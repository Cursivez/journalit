import type { TFile } from 'obsidian';

import { MAX_TARGETS } from '../../actions/domains/tradePlannedTargets';
import { extractUserOwnedTradeNotes } from '../../trade/core/TradeNoteDocumentCodec';
import {
  AgentResultCacheError,
  type AgentResultCache,
} from '../AgentResultCache';
import type { AgentToolHandler } from '../AgentToolRegistry';
import { agentMediaHashInput, sha256Hex } from '../media/agentMediaIdentity';
import {
  agentImageAnnotationFields,
  resolveAgentMedia,
} from '../media/agentOwnerMedia';
import type { ImageAnnotation } from '../../../types/imageAnnotations';
import { setupReadErrorResult } from './setupReadError';
import {
  agentContractManifest,
  parseAgentToolRequest,
  parseAgentToolResult,
} from '../protocol';
import type { GetTradeRequest } from '../protocol/generated/get_trade.request.generated';
import type {
  GetTradeResult,
  MediaMetadata,
} from '../protocol/generated/get_trade.result.generated';
import {
  AgentTradeReadError,
  type AgentTradeExecutionLeg,
  type AgentTradeReadRecord,
  type AgentTradeReadService,
} from '../trades';

type Success = Extract<GetTradeResult, { status: 'ok' }>;
type Sections = Success['sections'];
type SectionName = GetTradeRequest['sections'][number];

interface GetTradeDependencies {
  getReadService(): Promise<Pick<AgentTradeReadService, 'readByTradeId'>>;
  cache: Pick<AgentResultCache, 'findPrior' | 'store'>;
  readContent(file: TFile): Promise<string>;
  resolveMediaFile(pathOrLink: string, sourcePath: string): TFile | null;
  
  readImageAnnotation(sourcePath: string, source: string): ImageAnnotation;
  hashMediaIdentity?: (value: Uint8Array) => Promise<string>;
}

interface Snapshot {
  trade_id: string;
  trade_revision: number;
  sections: Sections;
  
  notes_truncated?: boolean;
}

const TRADE_ID_PATTERN =
  /^trade_[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
const SECTION_NAMES: readonly SectionName[] = [
  'summary',
  'execution',
  'classification',
  'risk',
  'journal',
  'notes',
  'media',
  'custom_fields',
];
const SECTION_NAME_SET = new Set<string>(SECTION_NAMES);
const MAX_NOTES_CHARS = 20_000;
const MAX_MEDIA_COUNT = 100;
const MAX_EXECUTION_LEGS = 100;

const INVALID_REQUEST: GetTradeResult = {
  status: 'error',
  code: 'invalid_request',
  message: 'Trade detail request is invalid.',
  retryable: false,
};
const NOT_FOUND: GetTradeResult = {
  status: 'error',
  code: 'not_found',
  message: 'Trade was not found.',
  retryable: false,
};
const LIMIT_EXCEEDED: GetTradeResult = {
  status: 'error',
  code: 'limit_exceeded',
  message: 'Trade detail exceeds supported limits.',
  retryable: false,
};
const INTERNAL_ERROR: GetTradeResult = {
  status: 'error',
  code: 'internal_error',
  message: 'Trade detail is temporarily unavailable.',
  retryable: true,
};

class ProjectionError extends Error {
  constructor(readonly kind: 'limit' | 'internal') {
    super('Trade detail projection failed');
  }
}

function throwIfAborted(signal: AbortSignal): void {
  if (signal.aborted) throw signal.reason;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const prototype = Object.getPrototypeOf(value) as unknown;
  return prototype === Object.prototype || prototype === null;
}

function validateRequest(value: unknown): GetTradeRequest | undefined {
  if (!isPlainObject(value)) return undefined;
  try {
    const parsed = parseAgentToolRequest('get_trade', value);
    if (!TRADE_ID_PATTERN.test(parsed.trade_id)) return undefined;
    if (
      parsed.sections.length < 1 ||
      parsed.sections.length > SECTION_NAMES.length ||
      new Set(parsed.sections).size !== parsed.sections.length ||
      parsed.sections.some((section) => !SECTION_NAME_SET.has(section))
    ) {
      return undefined;
    }
    if (
      parsed.notes_max_chars !== undefined &&
      (!Number.isSafeInteger(parsed.notes_max_chars) ||
        parsed.notes_max_chars < 0 ||
        parsed.notes_max_chars > MAX_NOTES_CHARS)
    ) {
      return undefined;
    }
    return parsed;
  } catch {
    return undefined;
  }
}

function boundedNumber(
  value: number | undefined,
  minimum: number,
  maximum: number
): number | undefined {
  return value !== undefined &&
    Number.isFinite(value) &&
    value >= minimum &&
    value <= maximum
    ? value
    : undefined;
}

function truncateCodePoints(value: string, maximum: number): string {
  return Array.from(value).slice(0, maximum).join('');
}

function cappedLabels(values: readonly string[]): string[] {
  const result: string[] = [];
  const seen = new Set<string>();
  for (const value of values) {
    const normalized = truncateCodePoints(value.trim(), 100);
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    result.push(normalized);
    if (result.length === 100) break;
  }
  return result;
}

function projectSummary(
  record: AgentTradeReadRecord
): NonNullable<Sections['summary']> {
  const result: NonNullable<Sections['summary']> = {
    status: record.executionStatus,
  };
  if (record.symbol !== undefined) {
    const symbol = record.symbol.trim();
    if (symbol) result.symbol = truncateCodePoints(symbol, 40);
  }
  result.trade_type = record.tradeType;
  if (record.assetType !== undefined) result.asset_type = record.assetType;
  if (record.missedReason !== undefined) {
    result.missed_reason = truncateCodePoints(record.missedReason, 500);
  }
  if (record.direction !== undefined) result.direction = record.direction;
  if (record.entryTime !== undefined) {
    if (!Number.isFinite(record.entryTime.getTime())) {
      throw new ProjectionError('internal');
    }
    result.entry_time = record.entryTime.toISOString();
  }
  if (record.exitTime !== undefined) {
    if (!Number.isFinite(record.exitTime.getTime())) {
      throw new ProjectionError('internal');
    }
    result.exit_time = record.exitTime.toISOString();
  }
  const pnl = boundedNumber(record.pnl, -1_000_000_000, 1_000_000_000);
  if (pnl !== undefined) result.pnl = pnl;
  return result;
}

function projectExecution(
  record: AgentTradeReadRecord
): NonNullable<Sections['execution']> {
  const result: NonNullable<Sections['execution']> = {};
  const volume = boundedNumber(record.volume, 0, 1_000_000_000);
  const entryPrice = boundedNumber(
    record.entryPrice,
    -1_000_000_000,
    1_000_000_000
  );
  const exitPrice = boundedNumber(
    record.exitPrice,
    -1_000_000_000,
    1_000_000_000
  );
  const commission = boundedNumber(
    record.commission,
    -1_000_000_000,
    1_000_000_000
  );
  if (volume !== undefined) result.volume = volume;
  if (entryPrice !== undefined) result.entry_price = entryPrice;
  if (exitPrice !== undefined) result.exit_price = exitPrice;
  if (commission !== undefined) result.commission = commission;
  const fees = boundedNumber(record.fees, 0, 1_000_000_000);
  if (fees !== undefined) result.fees = fees;
  const swap = boundedNumber(
    record.swap,
    -1_000_000_000_000,
    1_000_000_000_000
  );
  if (swap !== undefined) result.swap = swap;
  const directPnl = boundedNumber(
    record.directPnl,
    -1_000_000_000_000,
    1_000_000_000_000
  );
  if (directPnl !== undefined) result.direct_pnl = directPnl;
  if (record.entries.length > MAX_EXECUTION_LEGS)
    throw new AgentTradeReadError('limit_exceeded');
  if (record.exits.length > MAX_EXECUTION_LEGS)
    throw new AgentTradeReadError('limit_exceeded');
  result.entries = record.entries.map(projectLeg);
  result.exits = record.exits.map(projectLeg);
  result.executions_locked = record.executionsLocked;
  return result;
}

function projectLeg(leg: AgentTradeExecutionLeg) {
  if (
    Math.abs(leg.price) > 1_000_000_000 ||
    leg.size > 1_000_000_000_000 ||
    Number.isNaN(leg.time.getTime())
  )
    throw new AgentTradeReadError('limit_exceeded');
  return {
    time: leg.time.toISOString(),
    price: leg.price,
    size: leg.size,
  };
}

const FIELD_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;


function projectCustomFields(
  record: AgentTradeReadRecord
): NonNullable<Sections['custom_fields']> {
  const values: NonNullable<Sections['custom_fields']> = [];
  for (const [fieldId, value] of Object.entries(record.customFields)) {
    if (values.length === 200) break;
    if (!FIELD_ID_PATTERN.test(fieldId)) continue;
    if (typeof value === 'string') {
      if (value.length >= 1 && value.length <= 10_000) {
        values.push({ field_id: fieldId, value });
      }
    } else if (typeof value === 'number') {
      if (Number.isFinite(value) && Math.abs(value) <= 1_000_000_000_000) {
        values.push({ field_id: fieldId, value });
      }
    } else if (Array.isArray(value)) {
      const items = [...new Set(value)];
      if (
        items.length >= 1 &&
        items.length <= 200 &&
        items.every((item) => item.length >= 1 && item.length <= 100)
      ) {
        values.push({ field_id: fieldId, value: items });
      }
    }
  }
  return values;
}

function projectClassification(
  record: AgentTradeReadRecord
): NonNullable<Sections['classification']> {
  const result: NonNullable<Sections['classification']> = {
    tags: cappedLabels(record.tags),
    mistakes: cappedLabels(record.mistakes),
  };
  if (record.accountIds.length === 1) result.account_id = record.accountIds[0];
  if (record.setupIds.length === 1) result.setup_id = record.setupIds[0];
  return result;
}

const MAX_TARGET_AMOUNT = 1_000_000_000_000;


function projectTargets(
  targets: AgentTradeReadRecord['stopLosses']
): NonNullable<NonNullable<Sections['risk']>['stop_losses']> {
  if (targets.length > MAX_TARGETS) throw new ProjectionError('limit');
  return targets.map((target) => {
    const price = boundedNumber(target.price, -1_000_000_000, 1_000_000_000);
    const amount = (value: number | undefined) =>
      value === undefined
        ? undefined
        : boundedNumber(value, -MAX_TARGET_AMOUNT, MAX_TARGET_AMOUNT);
    const closePercent = amount(target.closePercent);
    const size = amount(target.size);
    if (
      price === undefined ||
      (target.closePercent !== undefined && closePercent === undefined) ||
      (target.size !== undefined && size === undefined)
    ) {
      throw new ProjectionError('limit');
    }
    return {
      price,
      ...(closePercent === undefined ? {} : { close_percent: closePercent }),
      ...(size === undefined ? {} : { size }),
    };
  });
}

function projectJournal(
  record: AgentTradeReadRecord
): NonNullable<Sections['journal']> {
  const thesis =
    record.thesis === undefined
      ? null
      : truncateCodePoints(record.thesis, MAX_NOTES_CHARS);
  return {
    thesis,
    
    thesis_truncated: thesis !== null && thesis !== record.thesis,
    reviewed: record.reviewed,
  };
}

function projectRisk(
  record: AgentTradeReadRecord
): NonNullable<Sections['risk']> {
  const result: NonNullable<Sections['risk']> = {};
  const stopLoss = boundedNumber(
    record.stopLoss,
    -1_000_000_000,
    1_000_000_000
  );
  const takeProfit = boundedNumber(
    record.takeProfit,
    -1_000_000_000,
    1_000_000_000
  );
  const riskAmount = boundedNumber(record.riskAmount, 0, 1_000_000_000);
  const rMultiple = boundedNumber(record.rMultiple, -1_000_000, 1_000_000);
  if (stopLoss !== undefined) result.stop_loss = stopLoss;
  if (takeProfit !== undefined) result.take_profit = takeProfit;
  if (riskAmount !== undefined) result.risk_amount = riskAmount;
  if (rMultiple !== undefined) result.r_multiple = rMultiple;
  result.stop_losses = projectTargets(record.stopLosses);
  result.take_profits = projectTargets(record.takeProfits);
  return result;
}

async function projectMedia(input: {
  record: AgentTradeReadRecord;
  installationId: string;
  signal: AbortSignal;
  dependencies: GetTradeDependencies;
}): Promise<MediaMetadata[]> {
  const { record, installationId, signal, dependencies } = input;
  const result: MediaMetadata[] = [];
  const seenPaths = new Set<string>();
  for (const source of record.mediaPaths) {
    throwIfAborted(signal);
    const media = resolveAgentMedia(
      source,
      record.file.path,
      (entry, sourcePath) => dependencies.resolveMediaFile(entry, sourcePath)
    );
    if (media === null || seenPaths.has(media.file.path)) continue;
    const { file, mediaType: type } = media;
    if (result.length === MAX_MEDIA_COUNT) throw new ProjectionError('limit');
    seenPaths.add(file.path);
    const hash = await (dependencies.hashMediaIdentity ?? sha256Hex)(
      agentMediaHashInput(installationId, file.path)
    );
    throwIfAborted(signal);
    if (!/^[0-9a-f]{64}$/.test(hash)) throw new ProjectionError('internal');
    result.push({
      media_id: `media_${hash}`,
      media_type: type,
      size_bytes: file.stat.size,
      ...(media.path === undefined ? {} : { path: media.path }),
      ...agentImageAnnotationFields(
        dependencies.readImageAnnotation(record.file.path, source)
      ),
    });
  }
  return result;
}

async function projectSections(input: {
  request: GetTradeRequest;
  record: AgentTradeReadRecord;
  context: Parameters<AgentToolHandler<'get_trade'>>[1];
  dependencies: GetTradeDependencies;
}): Promise<{ sections: Sections; notesTruncated?: boolean }> {
  const { request, record, context, dependencies } = input;
  const sections: Sections = {};
  let notesTruncated: boolean | undefined;
  for (const section of request.sections) {
    switch (section) {
      case 'summary':
        sections.summary = projectSummary(record);
        break;
      case 'execution':
        sections.execution = projectExecution(record);
        break;
      case 'classification':
        sections.classification = projectClassification(record);
        break;
      case 'risk':
        sections.risk = projectRisk(record);
        break;
      case 'journal':
        sections.journal = projectJournal(record);
        break;
      case 'notes': {
        const maximum = request.notes_max_chars ?? MAX_NOTES_CHARS;
        const content = await dependencies.readContent(record.file);
        throwIfAborted(context.signal);
        const notes = extractUserOwnedTradeNotes(content) ?? '';
        sections.notes = truncateCodePoints(notes, maximum);
        
        notesTruncated = sections.notes !== notes;
        break;
      }
      case 'media':
        sections.media = await projectMedia({
          record,
          installationId: context.installationId,
          signal: context.signal,
          dependencies,
        });
        break;
      case 'custom_fields':
        sections.custom_fields = projectCustomFields(record);
        break;
      default: {
        const exhaustiveSection: never = section;
        return exhaustiveSection;
      }
    }
  }
  return { sections, notesTruncated };
}

function successFromSnapshot(
  snapshot: unknown,
  request: GetTradeRequest,
  cached: boolean
): Success | undefined {
  const withNotes = request.sections.includes('notes');
  if (
    !isPlainObject(snapshot) ||
    Object.keys(snapshot).length !== (withNotes ? 4 : 3)
  ) {
    return undefined;
  }
  if (
    snapshot.trade_id !== request.trade_id ||
    !Number.isSafeInteger(snapshot.trade_revision) ||
    !isPlainObject(snapshot.sections) ||
    (withNotes && typeof snapshot.notes_truncated !== 'boolean')
  ) {
    return undefined;
  }
  const actualSections = Object.keys(snapshot.sections).sort();
  const expectedSections = [...request.sections].sort();
  if (
    actualSections.length !== expectedSections.length ||
    actualSections.some((key, index) => key !== expectedSections[index])
  ) {
    return undefined;
  }
  try {
    const result = parseAgentToolResult('get_trade', {
      status: 'ok',
      meta: {
        contract_version: agentContractManifest.version,
        contract_digest: agentContractManifest.digest,
        cached,
        row_count: 1,
      },
      trade_id: snapshot.trade_id,
      trade_revision: snapshot.trade_revision,
      sections: snapshot.sections,
      ...(withNotes ? { notes_truncated: snapshot.notes_truncated } : {}),
    });
    return result.status === 'ok' ? result : undefined;
  } catch {
    return undefined;
  }
}

function errorResult(error: unknown): GetTradeResult {
  if (error instanceof ProjectionError) {
    return error.kind === 'limit' ? LIMIT_EXCEEDED : INTERNAL_ERROR;
  }
  if (error instanceof AgentTradeReadError) {
    return error.code === 'limit_exceeded' ? LIMIT_EXCEEDED : INVALID_REQUEST;
  }
  if (error instanceof AgentResultCacheError) {
    return error.code === 'limit_exceeded' ? LIMIT_EXCEEDED : INVALID_REQUEST;
  }
  return setupReadErrorResult(error) ?? INTERNAL_ERROR;
}

export function createGetTradeHandler(
  dependencies: GetTradeDependencies
): AgentToolHandler<'get_trade'> {
  return async (untrustedRequest, context) => {
    try {
      throwIfAborted(context.signal);
      const request = validateRequest(untrustedRequest);
      if (request === undefined) return { result: INVALID_REQUEST };
      const cacheContext = {
        tool: 'get_trade' as const,
        installationId: context.installationId,
        arguments: request,
      };
      const prior = await dependencies.cache.findPrior(
        context.priorResultHint,
        cacheContext
      );
      throwIfAborted(context.signal);
      if (prior !== null) {
        const result = successFromSnapshot(prior.snapshot, request, true);
        return result === undefined
          ? { result: INTERNAL_ERROR }
          : { result, resultId: prior.resultId };
      }

      const readService = await dependencies.getReadService();
      throwIfAborted(context.signal);
      const record = await readService.readByTradeId(
        request.trade_id,
        context.signal
      );
      throwIfAborted(context.signal);
      if (record === null) return { result: NOT_FOUND };
      const revision = record.tradeRevision ?? 0;
      if (!Number.isSafeInteger(revision) || revision < 0) {
        return { result: INTERNAL_ERROR };
      }
      const projected = await projectSections({
        request,
        record,
        context,
        dependencies,
      });
      const snapshot: Snapshot = {
        trade_id: record.tradeId,
        trade_revision: revision,
        sections: projected.sections,
        ...(projected.notesTruncated === undefined
          ? {}
          : { notes_truncated: projected.notesTruncated }),
      };
      throwIfAborted(context.signal);
      const checked = successFromSnapshot(snapshot, request, false);
      if (checked === undefined) return { result: INTERNAL_ERROR };
      const resultId = await dependencies.cache.store({
        ...cacheContext,
        snapshot,
      });
      throwIfAborted(context.signal);
      return { result: checked, resultId };
    } catch (error) {
      if (context.signal.aborted) throw context.signal.reason;
      return { result: errorResult(error) };
    }
  };
}
