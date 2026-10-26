import type { TakeProfitTarget } from '../../../components/forms/trade/types';
import { isTradeExecutionOwnedBySync } from './tradeExecutionOwnership';
import type { TFile } from 'obsidian';
import type JournalitPlugin from '../../../main';
import type { CustomFieldDefinition } from '../../../types/customFields';
import { CustomFieldType } from '../../../types/customFields';

import { classifyPnLWithBreakEvenSettings } from '../../../utils/breakEvenRange';
import { createTickerMatcher } from '../../../utils/tickerMatching';
import {
  getEffectivePnL,
  getPartialExitInfo,
  getTotalEntrySize,
  isTradeOpenWithContext,
} from '../../../utils/tradeStatusUtils';
import { getTradingDayString } from '../../../utils/tradingDayUtils';
import {
  parseStoredDateLikeValue,
  serializeCustomFieldValue,
} from '../../../utils/customFieldPersistence';
import type { ImageGalleryItem } from '../../../components/imageGallery/types';
import type { CustomFieldsService } from '../../CustomFieldsService';
import type { DRCService } from '../../drc/DRCService';
import type { ImageGalleryService } from '../../imageGallery/ImageGalleryService';
import type { SetupService } from '../../setup/SetupService';
import type { Setup } from '../../setup/types';
import { normalizeSetupKey } from '../../setup/setupIdentity';
import { normalizeTradeAccountIdentity } from '../../trade/core/TradeAccountIdentity';
import { getTradeDirectionDisplayKind } from '../../trade/core/TradeDirection';
import { normalizeTradeExecution } from '../../trade/core/TradeExecutionNormalization';
import {
  parseStopLossTargets,
  type StopLossTarget,
} from '../../trade/core/StopLossTargets';
import { parseTakeProfitTargets } from '../../trade/core/TakeProfitTargets';
import type { TradeService } from '../../trade/TradeService';
import type { AgentEntityIdentityService } from '../identity/AgentEntityIdentityService';
import type { AgentTradeIdentityService } from '../identity/AgentTradeIdentityService';
import type {
  QueryTradesRequest,
  TradeFilters,
} from '../protocol/generated/query_trades.request.generated';

const MAX_IDENTITY_COUNT = 1_000_000;
const INVALID_REQUEST_MESSAGE = 'Invalid query trades request.';
const LIMIT_EXCEEDED_MESSAGE = 'Trade query limit exceeded.';
const ABORTED_MESSAGE = 'Agent operation aborted';

type TradeType = 'regular' | 'missed' | 'backtest';
type Direction = 'long' | 'short';
type AssetType = 'stock' | 'futures' | 'forex' | 'crypto' | 'options' | 'cfd';
const ASSET_TYPES: ReadonlySet<string> = new Set<AssetType>([
  'stock',
  'futures',
  'forex',
  'crypto',
  'options',
  'cfd',
]);

function isAssetType(value: unknown): value is AssetType {
  return typeof value === 'string' && ASSET_TYPES.has(value);
}
type ExecutionStatus = 'open' | 'partially_closed' | 'closed' | 'cancelled';
type Outcome = 'win' | 'loss' | 'breakeven';
type CustomFieldValue = string | number | boolean | string[];
type AbortMode = 'fixed' | 'exact';

interface TradeIdentityRecord {
  file: TFile;
  tradeId: string;
  tradeType: TradeType;
  tradeRevision?: number;
}

export interface AgentTradeReadRecord {
  
  readonly file: TFile;
  
  readonly mediaPaths: readonly string[];
  readonly tradeId: string;
  readonly tradeType: TradeType;
  readonly tradeRevision?: number;
  readonly symbol?: string;
  readonly assetType?: AssetType;
  
  readonly missedReason?: string;
  readonly direction?: Direction;
  readonly executionStatus: ExecutionStatus;
  readonly outcome?: Outcome;
  readonly entryTime?: Date;
  readonly exitTime?: Date;
  readonly volume?: number;
  readonly entryPrice?: number;
  readonly exitPrice?: number;
  readonly pnl?: number;
  readonly commission?: number;
  readonly fees?: number;
  readonly swap?: number;
  
  readonly directPnl?: number;
  readonly entries: readonly AgentTradeExecutionLeg[];
  readonly exits: readonly AgentTradeExecutionLeg[];
  
  readonly executionsLocked: boolean;
  readonly rMultiple?: number;
  readonly stopLoss?: number;
  readonly takeProfit?: number;
  
  readonly stopLosses: readonly AgentTradeTarget[];
  
  readonly takeProfits: readonly AgentTradeTarget[];
  
  readonly thesis?: string;
  readonly riskAmount?: number;
  readonly accountIds: readonly string[];
  readonly setupIds: readonly string[];
  readonly tags: readonly string[];
  readonly mistakes: readonly string[];
  readonly reviewed: boolean;
  readonly customFields: Readonly<Record<string, CustomFieldValue>>;
}


interface AgentTradeTarget {
  readonly price: number;
  readonly closePercent?: number;
  readonly size?: number;
}


function storedTargets(
  value: readonly (StopLossTarget | TakeProfitTarget)[]
): AgentTradeTarget[] {
  return value.flatMap(({ price, closePercent, size }): AgentTradeTarget[] =>
    price === undefined
      ? []
      : [
          {
            price,
            ...(closePercent === undefined ? {} : { closePercent }),
            ...(size === undefined ? {} : { size }),
          },
        ]
  );
}


export interface AgentTradeExecutionLeg {
  readonly time: Date;
  readonly price: number;
  readonly size: number;
}

function completeLegs(
  legs: readonly {
    time: Date | null;
    price: number | null;
    size: number | null;
  }[]
): AgentTradeExecutionLeg[] {
  return legs.flatMap((leg) =>
    leg.time !== null && leg.price !== null && leg.size !== null && leg.size > 0
      ? [{ time: leg.time, price: leg.price, size: leg.size }]
      : []
  );
}

export class AgentTradeReadError extends Error {
  constructor(public readonly code: 'invalid_request' | 'limit_exceeded') {
    super(
      code === 'invalid_request'
        ? INVALID_REQUEST_MESSAGE
        : LIMIT_EXCEEDED_MESSAGE
    );
    this.name = 'AgentTradeReadError';
  }
}

interface AgentTradeReadDependencies {
  plugin: Pick<JournalitPlugin, 'settings'>;
  tradeIdentityService: Pick<
    AgentTradeIdentityService,
    'listTradeIdentitiesStrict' | 'resolveTradeId'
  >;
  tradeService: Pick<TradeService, 'getTradeData'>;
  entityIdentityService: Pick<
    AgentEntityIdentityService,
    'getOrCreateAccountId' | 'getOrCreateSetupId'
  >;
  setupService: Pick<SetupService, 'listSetupsForAgentIdentityStrict'>;
  drcService: Pick<DRCService, 'getSessionLogTagIdsByDay'>;
  customFieldsService: Pick<CustomFieldsService, 'getField' | 'getFields'>;
  getImageGalleryService: () => Pick<ImageGalleryService, 'getAllGalleryItems'>;
  readFrontmatter: (file: TFile) => Promise<Readonly<Record<string, unknown>>>;
}

interface MaterializedRecord {
  identity: TradeIdentityRecord;
  source: Record<string, unknown>;
  accountNames: string[];
  setupNames: string[];
}

type SortEntry = NonNullable<QueryTradesRequest['sort']>[number];
type CustomFieldClause = NonNullable<TradeFilters['custom_fields']>[number];

interface CompiledCustomFieldClause {
  field: CustomFieldDefinition;
  clause: CustomFieldClause;
}

interface CompiledRequest {
  sort: readonly SortEntry[];
  customFields: readonly CustomFieldDefinition[];
  customClauses: readonly CompiledCustomFieldClause[];
  dateFrom?: Date;
  dateTo?: Date;
}

function throwIfAborted(
  signal: AbortSignal | undefined,
  mode: AbortMode
): void {
  if (!signal?.aborted) return;
  if (mode === 'exact') throw signal.reason;
  throw new Error(ABORTED_MESSAGE);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function finiteNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value)
    ? value
    : undefined;
}

function frontmatterNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value !== 'string' || !value.trim()) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}


export function isEntryTimeInRange(
  record: Pick<AgentTradeReadRecord, 'entryTime'>,
  from: Date | undefined,
  to: Date | undefined
): boolean {
  if (from && (!record.entryTime || record.entryTime < from)) return false;
  return !(to && (!record.entryTime || record.entryTime > to));
}

function validDate(value: unknown): Date | undefined {
  const date =
    value instanceof Date
      ? new Date(value.getTime())
      : typeof value === 'string' && value.trim()
        ? new Date(value)
        : undefined;
  return date && Number.isFinite(date.getTime()) ? date : undefined;
}

function normalizedString(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed || undefined;
}

function compareStrings(left: string, right: string): number {
  const insensitive = left.localeCompare(right, 'en-US', {
    sensitivity: 'base',
  });
  return insensitive || (left < right ? -1 : left > right ? 1 : 0);
}

function normalizedStrings(value: unknown): string[] {
  const source = Array.isArray(value) ? value : [value];
  const values = new Set<string>();
  for (const item of source) {
    const normalized = normalizedString(item);
    if (normalized) values.add(normalized);
  }
  return [...values].sort(compareStrings);
}

function normalizedSourceArray(value: unknown): string[] {
  return Array.isArray(value) ? normalizedStrings(value) : [];
}

function normalizedMediaSources(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const result: string[] = [];
  for (const item of value) {
    const normalized = normalizedString(item);
    if (normalized) result.push(normalized);
  }
  return result;
}

function normalizeDirection(
  source: Record<string, unknown>
): Direction | undefined {
  const kind = getTradeDirectionDisplayKind(source);
  if (kind === 'long' || kind === 'call') return 'long';
  if (kind === 'short' || kind === 'put') return 'short';
  return undefined;
}

function normalizeDateLikeCustomFieldValue(
  value: unknown,
  type: CustomFieldType.DATE | CustomFieldType.DATETIME | CustomFieldType.TIME
): string | undefined {
  if (type === CustomFieldType.TIME && typeof value !== 'string') {
    return undefined;
  }
  const parsed = parseStoredDateLikeValue(
    value,
    type === CustomFieldType.TIME
      ? { timeOnly: true }
      : type === CustomFieldType.DATETIME
        ? { includeTime: true }
        : undefined
  );
  if (!parsed) return undefined;
  const serialized = serializeCustomFieldValue(value, type);
  return typeof serialized === 'string' ? serialized : undefined;
}

function normalizeCustomFieldValue(
  value: unknown,
  field: CustomFieldDefinition
): CustomFieldValue | undefined {
  switch (field.type) {
    case CustomFieldType.TEXT:
    case CustomFieldType.DROPDOWN:
      return normalizedString(value);
    case CustomFieldType.NUMBER:
      return finiteNumber(value);
    case CustomFieldType.MULTISELECT: {
      if (!Array.isArray(value)) return undefined;
      const normalized = normalizedStrings(value);
      return normalized.length > 0 ? normalized : undefined;
    }
    case CustomFieldType.DATE:
    case CustomFieldType.DATETIME:
    case CustomFieldType.TIME:
      return normalizeDateLikeCustomFieldValue(value, field.type);
  }
}

function customFieldSource(
  source: Record<string, unknown>,
  fields: readonly CustomFieldDefinition[]
): Record<string, CustomFieldValue> {
  const nested = isRecord(source.customFields)
    ? source.customFields
    : undefined;
  const result: Record<string, CustomFieldValue> = {};
  for (const field of fields) {
    const rootValue = source[field.fieldKey];
    const raw = rootValue !== undefined ? rootValue : nested?.[field.id];
    const value = normalizeCustomFieldValue(raw, field);
    if (value !== undefined) result[field.id] = value;
  }
  return result;
}

function executionStatus(
  source: Record<string, unknown>,
  execution: ReturnType<typeof normalizeTradeExecution>
): ExecutionStatus {
  if (source.tradeStatus === 'CANCELLED') return 'cancelled';
  const statusInput = {
    ...source,
    entries: execution.entries,
    exits: execution.exits,
  };
  if (
    source.tradeStatus === 'PARTIALLY_CLOSED' ||
    getPartialExitInfo(statusInput).isPartialExit
  ) {
    return 'partially_closed';
  }
  return isTradeOpenWithContext(statusInput) ? 'open' : 'closed';
}

function effectivePnl(source: Record<string, unknown>): number | undefined {
  const hasValue =
    frontmatterNumber(source.pnl) !== undefined ||
    (source.useDirectPnLInput === true &&
      frontmatterNumber(source.directPnL) !== undefined);
  if (!hasValue) return undefined;
  const value = getEffectivePnL({
    pnl: frontmatterNumber(source.pnl),
    directPnL: frontmatterNumber(source.directPnL),
    useDirectPnLInput: source.useDirectPnLInput === true,
    commission: frontmatterNumber(source.commission),
    swap: frontmatterNumber(source.swap),
    fees: frontmatterNumber(source.fees),
    rebate: frontmatterNumber(source.rebate),
  });
  return Number.isFinite(value) ? value : undefined;
}

function defineInternalProperties(
  record: Omit<AgentTradeReadRecord, 'file' | 'mediaPaths'>,
  file: TFile,
  mediaPaths: readonly string[]
): AgentTradeReadRecord {
  Object.defineProperty(record, 'file', {
    value: file,
    enumerable: false,
    configurable: false,
    writable: false,
  });
  Object.defineProperty(record, 'mediaPaths', {
    value: Object.freeze([...mediaPaths]),
    enumerable: false,
    configurable: false,
    writable: false,
  });
  return record as AgentTradeReadRecord;
}

function normalizeComparableScalar(
  value: unknown
): string | number | boolean | undefined {
  if (typeof value === 'number')
    return Number.isFinite(value) ? value : undefined;
  if (typeof value === 'boolean') return value;
  return normalizedString(value);
}

function scalarEqual(left: unknown, right: unknown): boolean {
  const normalizedLeft = normalizeComparableScalar(left);
  const normalizedRight = normalizeComparableScalar(right);
  return normalizedLeft !== undefined && normalizedLeft === normalizedRight;
}

function sameStringSet(
  left: readonly string[],
  right: readonly string[]
): boolean {
  const normalizedRight = normalizedStrings(right);
  return (
    left.length === normalizedRight.length &&
    left.every((value, index) => value === normalizedRight[index])
  );
}

function isOrderingOperator(operator: CustomFieldClause['operator']): boolean {
  return (
    operator === 'greater_than' ||
    operator === 'greater_than_or_equal' ||
    operator === 'less_than' ||
    operator === 'less_than_or_equal'
  );
}

function validateCustomClause(
  field: CustomFieldDefinition,
  clause: CustomFieldClause
): void {
  const { operator, value } = clause;
  if (
    ![
      'equals',
      'not_equals',
      'contains',
      'greater_than',
      'greater_than_or_equal',
      'less_than',
      'less_than_or_equal',
    ].includes(operator)
  ) {
    throw new AgentTradeReadError('invalid_request');
  }
  if (operator === 'contains') {
    if (
      field.type !== CustomFieldType.TEXT &&
      field.type !== CustomFieldType.MULTISELECT
    )
      throw new AgentTradeReadError('invalid_request');
    if (
      (field.type === CustomFieldType.TEXT && typeof value !== 'string') ||
      (field.type === CustomFieldType.MULTISELECT &&
        typeof value !== 'string' &&
        !Array.isArray(value))
    ) {
      throw new AgentTradeReadError('invalid_request');
    }
    if (
      (typeof value === 'string' && !value.trim()) ||
      (Array.isArray(value) && normalizedStrings(value).length === 0)
    ) {
      throw new AgentTradeReadError('invalid_request');
    }
  }
  if (isOrderingOperator(operator)) {
    const orderable =
      field.type === CustomFieldType.NUMBER ||
      field.type === CustomFieldType.DATE ||
      field.type === CustomFieldType.DATETIME ||
      field.type === CustomFieldType.TIME;
    if (
      !orderable ||
      (field.type === CustomFieldType.NUMBER &&
        finiteNumber(value) === undefined) ||
      (field.type !== CustomFieldType.NUMBER &&
        (typeof value !== 'string' || !value.trim()))
    ) {
      throw new AgentTradeReadError('invalid_request');
    }
  }
  if (
    (operator === 'equals' || operator === 'not_equals') &&
    ((field.type === CustomFieldType.MULTISELECT &&
      typeof value !== 'string' &&
      !Array.isArray(value)) ||
      (field.type === CustomFieldType.NUMBER &&
        finiteNumber(value) === undefined) ||
      ((field.type === CustomFieldType.TEXT ||
        field.type === CustomFieldType.DROPDOWN ||
        field.type === CustomFieldType.DATE ||
        field.type === CustomFieldType.DATETIME ||
        field.type === CustomFieldType.TIME) &&
        typeof value !== 'string'))
  ) {
    throw new AgentTradeReadError('invalid_request');
  }
}

function normalizeCustomClause(
  field: CustomFieldDefinition,
  clause: CustomFieldClause
): CustomFieldClause {
  const invalid = (): never => {
    throw new AgentTradeReadError('invalid_request');
  };
  let value: CustomFieldClause['value'];
  switch (field.type) {
    case CustomFieldType.TEXT:
    case CustomFieldType.DROPDOWN:
      value = normalizedString(clause.value) ?? invalid();
      break;
    case CustomFieldType.NUMBER:
      value = finiteNumber(clause.value) ?? invalid();
      break;
    case CustomFieldType.MULTISELECT:
      if (Array.isArray(clause.value)) {
        const normalized = normalizedStrings(clause.value);
        value = normalized.length > 0 ? normalized : invalid();
      } else {
        value = normalizedString(clause.value) ?? invalid();
      }
      break;
    case CustomFieldType.DATE:
    case CustomFieldType.DATETIME:
    case CustomFieldType.TIME:
      value =
        normalizeDateLikeCustomFieldValue(clause.value, field.type) ??
        invalid();
      break;
  }
  return { ...clause, value };
}

function matchesCustomClause(
  record: AgentTradeReadRecord,
  field: CustomFieldDefinition,
  clause: CustomFieldClause
): boolean {
  const stored = record.customFields[field.id];
  const query = clause.value;
  let matches = false;
  if (clause.operator === 'equals' || clause.operator === 'not_equals') {
    if (field.type === CustomFieldType.MULTISELECT && Array.isArray(stored)) {
      matches = Array.isArray(query)
        ? sameStringSet(stored, query)
        : typeof query === 'string' && stored.includes(query.trim());
    } else {
      matches = scalarEqual(stored, query);
    }
    return clause.operator === 'not_equals' ? !matches : matches;
  }
  if (clause.operator === 'contains') {
    if (Array.isArray(stored)) {
      const members = Array.isArray(query)
        ? normalizedStrings(query)
        : normalizedStrings([query]);
      const storedFolded = new Set(
        stored.map((item) => item.toLocaleLowerCase('en-US'))
      );
      return members.every((item) =>
        storedFolded.has(item.toLocaleLowerCase('en-US'))
      );
    }
    return (
      typeof stored === 'string' &&
      typeof query === 'string' &&
      stored
        .toLocaleLowerCase('en-US')
        .includes(query.trim().toLocaleLowerCase('en-US'))
    );
  }
  if (field.type === CustomFieldType.NUMBER) {
    if (typeof stored !== 'number' || typeof query !== 'number') return false;
    if (clause.operator === 'greater_than') return stored > query;
    if (clause.operator === 'greater_than_or_equal') return stored >= query;
    if (clause.operator === 'less_than') return stored < query;
    if (clause.operator === 'less_than_or_equal') return stored <= query;
    return false;
  }
  if (typeof stored !== 'string' || typeof query !== 'string') return false;
  if (clause.operator === 'greater_than') return stored > query;
  if (clause.operator === 'greater_than_or_equal') return stored >= query;
  if (clause.operator === 'less_than') return stored < query;
  return stored <= query;
}

function imageMatches(
  item: ImageGalleryItem,
  annotationStatuses: readonly string[],
  imageTags: ReadonlySet<string>
): boolean {
  const tagged = item.tags.length > 0;
  const hasNotes = Boolean(item.notes?.trim());
  const annotationMatch =
    annotationStatuses.length === 0 ||
    annotationStatuses.some((status) =>
      status === 'tagged'
        ? tagged
        : status === 'untagged'
          ? !tagged
          : status === 'has_notes'
            ? hasNotes
            : !hasNotes
    );
  if (!annotationMatch) return false;
  if (imageTags.size === 0) return true;
  return item.tags.some((tag) =>
    imageTags.has(tag.trim().toLocaleLowerCase('en-US'))
  );
}

function compareOptional<T>(
  left: T | undefined,
  right: T | undefined,
  direction: 'asc' | 'desc',
  compare: (a: T, b: T) => number
): number {
  if (left === undefined) return right === undefined ? 0 : 1;
  if (right === undefined) return -1;
  const result = compare(left, right);
  return direction === 'asc' ? result : -result;
}

function compareBySort(
  left: AgentTradeReadRecord,
  right: AgentTradeReadRecord,
  sort: SortEntry
): number {
  switch (sort.field) {
    case 'entry_time':
      return compareOptional(
        left.entryTime,
        right.entryTime,
        sort.direction,
        (a, b) => a.getTime() - b.getTime()
      );
    case 'exit_time':
      return compareOptional(
        left.exitTime,
        right.exitTime,
        sort.direction,
        (a, b) => a.getTime() - b.getTime()
      );
    case 'symbol':
      return compareOptional(
        left.symbol,
        right.symbol,
        sort.direction,
        compareStrings
      );
    case 'pnl':
      return compareOptional(
        left.pnl,
        right.pnl,
        sort.direction,
        (a, b) => a - b
      );
    case 'r_multiple':
      return compareOptional(
        left.rMultiple,
        right.rMultiple,
        sort.direction,
        (a, b) => a - b
      );
  }
}

export class AgentTradeReadService {
  constructor(private readonly dependencies: AgentTradeReadDependencies) {}

  public async read(
    request: {
      filters?: QueryTradesRequest['filters'];
      sort?: QueryTradesRequest['sort'];
    },
    signal: AbortSignal
  ): Promise<readonly AgentTradeReadRecord[]> {
    throwIfAborted(signal, 'fixed');
    const compiled = this.compileRequest(request);
    const identities =
      (await this.dependencies.tradeIdentityService.listTradeIdentitiesStrict()) as readonly TradeIdentityRecord[];
    throwIfAborted(signal, 'fixed');
    if (identities.length > MAX_IDENTITY_COUNT) {
      throw new AgentTradeReadError('limit_exceeded');
    }

    const coreRows = await this.dependencies.tradeService.getTradeData({
      fresh: true,
    });
    throwIfAborted(signal, 'fixed');
    const rowsByPath = new Map<string, Record<string, unknown>>();
    for (const row of coreRows) {
      const path = normalizedString(row.path);
      if (path && !rowsByPath.has(path)) rowsByPath.set(path, row);
    }

    const materialized: MaterializedRecord[] = [];
    for (const identity of identities) {
      throwIfAborted(signal, 'fixed');
      materialized.push(
        await this.materializeIdentity(identity, rowsByPath, signal, 'fixed')
      );
    }

    const records = await this.projectMaterialized(
      materialized,
      compiled.customFields,
      signal,
      'fixed'
    );

    const filtered = await this.applyFilters({
      records,
      filters: request.filters,
      compiled,
      signal,
    });
    throwIfAborted(signal, 'fixed');
    return this.sortRecords(filtered, compiled.sort);
  }

  public async readByTradeId(
    tradeId: string,
    signal?: AbortSignal
  ): Promise<AgentTradeReadRecord | null> {
    throwIfAborted(signal, 'exact');
    const identity =
      await this.dependencies.tradeIdentityService.resolveTradeId(tradeId);
    throwIfAborted(signal, 'exact');
    if (!identity) return null;

    let rowsByPath: ReadonlyMap<string, Record<string, unknown>> | undefined;
    if (identity.tradeType !== 'missed') {
      const coreRows = await this.dependencies.tradeService.getTradeData({
        fresh: true,
      });
      throwIfAborted(signal, 'exact');
      const rows = new Map<string, Record<string, unknown>>();
      for (const row of coreRows) {
        const path = normalizedString(row.path);
        if (path && !rows.has(path)) rows.set(path, row);
      }
      rowsByPath = rows;
    }

    const materialized = await this.materializeIdentity(
      identity,
      rowsByPath,
      signal,
      'exact'
    );
    const records = await this.projectMaterialized(
      [materialized],
      this.dependencies.customFieldsService.getFields(),
      signal,
      'exact'
    );
    throwIfAborted(signal, 'exact');
    return records[0];
  }

  private async materializeIdentity(
    identity: TradeIdentityRecord,
    rowsByPath: ReadonlyMap<string, Record<string, unknown>> | undefined,
    signal: AbortSignal | undefined,
    abortMode: AbortMode
  ): Promise<MaterializedRecord> {
    let source: Record<string, unknown>;
    if (identity.tradeType === 'missed') {
      const frontmatter = await this.dependencies.readFrontmatter(
        identity.file
      );
      throwIfAborted(signal, abortMode);
      source = {
        ...frontmatter,
        path: identity.file.path,
        isMissedTrade: true,
      };
    } else {
      const row = rowsByPath?.get(identity.file.path);
      if (!row) throw new Error('Trade read model is incomplete');
      source = row;
    }
    return {
      identity,
      source,
      accountNames: normalizeTradeAccountIdentity(source).accountNames,
      setupNames: normalizedSourceArray(source.setup),
    };
  }

  private async projectMaterialized(
    materialized: readonly MaterializedRecord[],
    customFields: readonly CustomFieldDefinition[],
    signal: AbortSignal | undefined,
    abortMode: AbortMode
  ): Promise<AgentTradeReadRecord[]> {
    let setupIdsByKey = new Map<string, string>();
    if (materialized.some((record) => record.setupNames.length > 0)) {
      const setups =
        await this.dependencies.setupService.listSetupsForAgentIdentityStrict();
      throwIfAborted(signal, abortMode);
      setupIdsByKey = await this.buildSetupIds(
        setups,
        materialized,
        signal,
        abortMode
      );
    }
    const accountIdsByName = await this.buildAccountIds(
      materialized,
      signal,
      abortMode
    );
    const records = materialized.map((item) =>
      this.toRecord(item, accountIdsByName, setupIdsByKey, customFields)
    );
    throwIfAborted(signal, abortMode);
    return records;
  }

  private compileRequest(request: {
    filters?: QueryTradesRequest['filters'];
    sort?: QueryTradesRequest['sort'];
  }): CompiledRequest {
    if (
      request.sort &&
      (request.sort.length === 0 || request.sort.length > 3)
    ) {
      throw new AgentTradeReadError('invalid_request');
    }
    const sort: readonly SortEntry[] = request.sort ?? [
      { field: 'entry_time', direction: 'desc' },
    ];
    for (const entry of sort) {
      if (
        !['entry_time', 'exit_time', 'symbol', 'pnl', 'r_multiple'].includes(
          entry.field
        ) ||
        (entry.direction !== 'asc' && entry.direction !== 'desc')
      ) {
        throw new AgentTradeReadError('invalid_request');
      }
    }

    const customFields: CustomFieldDefinition[] = [];
    const customClauses: CompiledCustomFieldClause[] = [];
    for (const clause of request.filters?.custom_fields ?? []) {
      const field = this.dependencies.customFieldsService.getField(
        clause.field_id
      );
      if (!field) throw new AgentTradeReadError('invalid_request');
      validateCustomClause(field, clause);
      if (!customFields.some((candidate) => candidate.id === field.id)) {
        customFields.push(field);
      }
      customClauses.push({
        field,
        clause: normalizeCustomClause(field, clause),
      });
    }
    const dateFrom = request.filters?.date?.from
      ? validDate(request.filters.date.from)
      : undefined;
    const dateTo = request.filters?.date?.to
      ? validDate(request.filters.date.to)
      : undefined;
    if (
      (request.filters?.date?.from && !dateFrom) ||
      (request.filters?.date?.to && !dateTo) ||
      (dateFrom && dateTo && dateFrom > dateTo) ||
      (request.filters?.pnl?.min !== undefined &&
        request.filters.pnl.max !== undefined &&
        request.filters.pnl.min > request.filters.pnl.max)
    ) {
      throw new AgentTradeReadError('invalid_request');
    }
    return { sort, customFields, customClauses, dateFrom, dateTo };
  }

  private async buildAccountIds(
    records: readonly MaterializedRecord[],
    signal: AbortSignal | undefined,
    abortMode: AbortMode
  ): Promise<Map<string, string>> {
    const result = new Map<string, string>();
    const names = normalizedStrings(
      records.flatMap((record) => record.accountNames)
    );
    for (const name of names) {
      throwIfAborted(signal, abortMode);
      const id =
        await this.dependencies.entityIdentityService.getOrCreateAccountId(
          name
        );
      throwIfAborted(signal, abortMode);
      if (id) result.set(name.trim().toLocaleLowerCase('en-US'), id);
    }
    return result;
  }

  private async buildSetupIds(
    setups: readonly Setup[],
    records: readonly MaterializedRecord[],
    signal: AbortSignal | undefined,
    abortMode: AbortMode
  ): Promise<Map<string, string>> {
    const result = new Map<string, string>();
    const candidatesByKey = new Map<string, Setup[]>();
    const ambiguousKeys = new Set<string>();
    for (const setup of setups) {
      const key = normalizeSetupKey(setup.name);
      const candidates = candidatesByKey.get(key) ?? [];
      candidates.push(setup);
      candidatesByKey.set(key, candidates);
    }
    for (const [key, candidates] of candidatesByKey) {
      if (candidates.length === 1 && candidates[0].agentEntityId) {
        result.set(key, candidates[0].agentEntityId);
      } else if (candidates.length > 1) {
        ambiguousKeys.add(key);
      }
    }
    const names = normalizedStrings(
      records.flatMap((record) => record.setupNames)
    );
    for (const name of names) {
      const key = normalizeSetupKey(name);
      if (result.has(key) || ambiguousKeys.has(key)) continue;
      throwIfAborted(signal, abortMode);
      const id =
        await this.dependencies.entityIdentityService.getOrCreateSetupId(name);
      throwIfAborted(signal, abortMode);
      if (id) result.set(key, id);
    }
    return result;
  }

  private toRecord(
    item: MaterializedRecord,
    accountIdsByName: ReadonlyMap<string, string>,
    setupIdsByKey: ReadonlyMap<string, string>,
    fields: readonly CustomFieldDefinition[]
  ): AgentTradeReadRecord {
    const { source, identity } = item;
    const execution = normalizeTradeExecution(source, {
      deriveMissingExplicitness: true,
    });
    const status = executionStatus(source, execution);
    const pnl = effectivePnl(source);
    const balance =
      frontmatterNumber(source.breakEvenAccountCurrentBalanceTotal) ??
      frontmatterNumber(source.breakEvenAccountCurrentBalance);
    const outcomeValue =
      status === 'closed' && pnl !== undefined
        ? classifyPnLWithBreakEvenSettings(
            pnl,
            this.dependencies.plugin.settings.trade,
            balance
          )
        : undefined;
    const volume = getTotalEntrySize({
      entries: execution.entries,
      positionSize: execution.positionSize,
    });
    const accountIds = item.accountNames.flatMap((name) => {
      const id = accountIdsByName.get(name.trim().toLocaleLowerCase('en-US'));
      return id ? [id] : [];
    });
    const setupIds = item.setupNames.flatMap((name) => {
      const id = setupIdsByKey.get(normalizeSetupKey(name));
      return id ? [id] : [];
    });
    const symbol = normalizedString(source.instrument);
    const missedReason =
      identity.tradeType === 'missed'
        ? normalizedString(source.missedReason)
        : undefined;
    const direction = normalizeDirection(source);
    const stopLoss = frontmatterNumber(source.stopLoss);
    
    const stopLosses = storedTargets(parseStopLossTargets(source.stopLosses));
    const takeProfits = storedTargets(
      parseTakeProfitTargets(source.takeProfits)
    );
    const takeProfit = takeProfits[0]?.price;
    const thesis =
      typeof source.thesis === 'string' && source.thesis !== ''
        ? source.thesis
        : undefined;
    const riskAmount = frontmatterNumber(source.riskAmount);
    const record: Omit<AgentTradeReadRecord, 'file' | 'mediaPaths'> = {
      tradeId: identity.tradeId,
      tradeType: identity.tradeType,
      ...(identity.tradeRevision === undefined
        ? {}
        : { tradeRevision: identity.tradeRevision }),
      ...(symbol ? { symbol } : {}),
      ...(isAssetType(source.assetType) ? { assetType: source.assetType } : {}),
      ...(missedReason ? { missedReason } : {}),
      ...(direction ? { direction } : {}),
      executionStatus: status,
      ...(outcomeValue && outcomeValue !== 'unknown'
        ? { outcome: outcomeValue }
        : {}),
      ...(execution.firstEntryTime
        ? { entryTime: execution.firstEntryTime }
        : {}),
      ...(execution.lastExitTime ? { exitTime: execution.lastExitTime } : {}),
      ...(volume !== null && Number.isFinite(volume) && volume > 0
        ? { volume }
        : {}),
      ...(execution.weightedEntryPrice !== null &&
      Number.isFinite(execution.weightedEntryPrice)
        ? { entryPrice: execution.weightedEntryPrice }
        : {}),
      ...(execution.resolvedExitPrice !== null &&
      Number.isFinite(execution.resolvedExitPrice)
        ? { exitPrice: execution.resolvedExitPrice }
        : {}),
      ...(pnl === undefined ? {} : { pnl }),
      ...(frontmatterNumber(source.commission) === undefined
        ? {}
        : { commission: frontmatterNumber(source.commission) }),
      ...(frontmatterNumber(source.fees) === undefined
        ? {}
        : { fees: frontmatterNumber(source.fees) }),
      ...(frontmatterNumber(source.swap) === undefined
        ? {}
        : { swap: frontmatterNumber(source.swap) }),
      ...(execution.useDirectPnLInput &&
      frontmatterNumber(source.directPnL) !== undefined
        ? { directPnl: frontmatterNumber(source.directPnL) }
        : {}),
      entries: completeLegs(execution.entries),
      exits: completeLegs(
        execution.exits.filter((exit) => exit.hasExplicitPrice !== false)
      ),
      executionsLocked: isTradeExecutionOwnedBySync(source),
      ...(frontmatterNumber(source.rMultiple) === undefined
        ? {}
        : { rMultiple: frontmatterNumber(source.rMultiple) }),
      ...(stopLoss === undefined ? {} : { stopLoss }),
      ...(takeProfit === undefined ? {} : { takeProfit }),
      stopLosses,
      takeProfits,
      ...(thesis === undefined ? {} : { thesis }),
      ...(riskAmount === undefined ? {} : { riskAmount }),
      accountIds: [...new Set(accountIds)].sort(compareStrings),
      setupIds: [...new Set(setupIds)].sort(compareStrings),
      tags: normalizedSourceArray(source.tags),
      mistakes: normalizedSourceArray(source.mistake),
      reviewed: source.reviewed === true,
      customFields: customFieldSource(source, fields),
    };
    return defineInternalProperties(
      record,
      identity.file,
      normalizedMediaSources(source.images)
    );
  }

  private async applyFilters(input: {
    records: readonly AgentTradeReadRecord[];
    filters: QueryTradesRequest['filters'];
    compiled: CompiledRequest;
    signal: AbortSignal;
  }): Promise<AgentTradeReadRecord[]> {
    const { records, filters, compiled, signal } = input;
    if (!filters) return [...records];
    const { customClauses, dateFrom: from, dateTo: to } = compiled;
    const tickerMatcher = createTickerMatcher(filters.tickers ?? []);
    const sessionTags = new Set(filters.session_log_tags ?? []);
    const tagsByDay =
      sessionTags.size > 0
        ? this.dependencies.drcService.getSessionLogTagIdsByDay()
        : undefined;
    let imagesByPath: Map<string, ImageGalleryItem[]> | undefined;
    if (
      (filters.image_annotation_status?.length ?? 0) > 0 ||
      (filters.image_tags?.length ?? 0) > 0
    ) {
      const items = await this.dependencies
        .getImageGalleryService()
        .getAllGalleryItems();
      throwIfAborted(signal, 'fixed');
      imagesByPath = new Map();
      for (const item of items) {
        if (item.sourceType !== 'trade') continue;
        const existing = imagesByPath.get(item.sourcePath) ?? [];
        existing.push(item);
        imagesByPath.set(item.sourcePath, existing);
      }
    }
    const selectedImageTags = new Set(
      (filters.image_tags ?? [])
        .map((tag) => tag.trim().toLocaleLowerCase('en-US'))
        .filter(Boolean)
    );

    return records.filter((record) => {
      throwIfAborted(signal, 'fixed');
      if (!isEntryTimeInRange(record, from, to)) return false;
      if (
        filters.account_ids?.length &&
        !filters.account_ids.some((id) => record.accountIds.includes(id))
      )
        return false;
      if (
        filters.setup_ids?.length &&
        !filters.setup_ids.some((id) => record.setupIds.includes(id))
      )
        return false;
      if (filters.tickers?.length && !tickerMatcher(record.symbol))
        return false;
      if (
        filters.tags?.length &&
        !filters.tags.some((tag) => record.tags.includes(tag))
      )
        return false;
      if (
        filters.mistakes?.length &&
        !filters.mistakes.some((mistake) => record.mistakes.includes(mistake))
      )
        return false;
      if (
        filters.directions?.length &&
        (!record.direction || !filters.directions.includes(record.direction))
      )
        return false;
      if (
        filters.status?.length &&
        !filters.status.some((status) =>
          status === 'open'
            ? record.executionStatus === 'open' ||
              record.executionStatus === 'partially_closed'
            : status === 'closed'
              ? record.executionStatus === 'closed'
              : status === 'partially_closed'
                ? record.executionStatus === 'partially_closed'
                : status === 'cancelled'
                  ? record.executionStatus === 'cancelled'
                  : record.executionStatus === 'closed' &&
                    record.outcome === status
        )
      )
        return false;
      if (
        filters.pnl?.min !== undefined &&
        (record.pnl === undefined || record.pnl < filters.pnl.min)
      )
        return false;
      if (
        filters.pnl?.max !== undefined &&
        (record.pnl === undefined || record.pnl > filters.pnl.max)
      )
        return false;
      if (
        filters.trade_types?.length &&
        !filters.trade_types.includes(record.tradeType)
      )
        return false;
      if (
        filters.review_status?.length &&
        !filters.review_status.some((status) =>
          status === 'reviewed' ? record.reviewed : !record.reviewed
        )
      )
        return false;
      if (tagsByDay && sessionTags.size > 0) {
        if (!record.entryTime) return false;
        const dayTags = tagsByDay.get(
          getTradingDayString(record.entryTime, this.dependencies.plugin)
        );
        if (!dayTags || ![...sessionTags].some((tag) => dayTags.has(tag)))
          return false;
      }
      if (imagesByPath) {
        const images = imagesByPath.get(record.file.path) ?? [];
        if (
          !images.some((item) =>
            imageMatches(
              item,
              filters.image_annotation_status ?? [],
              selectedImageTags
            )
          )
        )
          return false;
      }
      return customClauses.every(({ field, clause }) =>
        matchesCustomClause(record, field, clause)
      );
    });
  }

  private sortRecords(
    records: readonly AgentTradeReadRecord[],
    sort: readonly SortEntry[]
  ): AgentTradeReadRecord[] {
    return [...records].sort((left, right) => {
      for (const entry of sort) {
        const result = compareBySort(left, right, entry);
        if (result !== 0) return result;
      }
      return compareStrings(left.tradeId, right.tradeId);
    });
  }
}
