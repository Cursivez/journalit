import {
  AgentResultCacheError,
  type AgentResultCache,
} from '../AgentResultCache';
import type { AgentToolHandler } from '../AgentToolRegistry';
import { setupReadErrorResult } from './setupReadError';
import { agentContractManifest } from '../protocol';
import type { QueryTradesRequest } from '../protocol/generated/query_trades.request.generated';
import type { QueryTradesResult } from '../protocol/generated/query_trades.result.generated';
import {
  AgentTradeReadError,
  type AgentTradeReadRecord,
  type AgentTradeReadService,
} from '../trades';

type QueryField = QueryTradesRequest['fields'][number];
type Success = Extract<QueryTradesResult, { status: 'ok' }>;
type TradeRow = Success['trades'][number];

type QueryTradesCache = Pick<
  AgentResultCache,
  'findPrior' | 'resolveCursor' | 'store' | 'createCursor'
>;

type QueryTradesReadService = Pick<AgentTradeReadService, 'read'>;

interface QueryTradesDependencies {
  getReadService(): Promise<QueryTradesReadService>;
  cache: QueryTradesCache;
}

interface QueryTradesSnapshot {
  fields: QueryField[];
  trades: TradeRow[];
}

const INVALID_REQUEST: QueryTradesResult = {
  status: 'error',
  code: 'invalid_request',
  message: 'Trade query request is invalid.',
  retryable: false,
};

const LIMIT_EXCEEDED: QueryTradesResult = {
  status: 'error',
  code: 'limit_exceeded',
  message: 'Trade query exceeds supported limits.',
  retryable: false,
};

const CURSOR_EXPIRED: QueryTradesResult = {
  status: 'error',
  code: 'cursor_expired',
  message: 'Trade query cursor has expired.',
  retryable: false,
};

const INTERNAL_ERROR: QueryTradesResult = {
  status: 'error',
  code: 'internal_error',
  message: 'Trade query is temporarily unavailable.',
  retryable: true,
};

const QUERY_FIELDS: readonly QueryField[] = [
  'trade_id',
  'symbol',
  'direction',
  'status',
  'entry_time',
  'exit_time',
  'account_id',
  'setup_id',
  'volume',
  'entry_price',
  'exit_price',
  'pnl',
  'commission',
  'r_multiple',
  'tags',
  'mistakes',
  'trade_revision',
];
const TRADE_ID_PATTERN =
  /^trade_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const OPAQUE_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]*$/;

function effectiveFields(fields: readonly QueryField[]): QueryField[] {
  const result: QueryField[] = ['trade_id'];
  const seen = new Set<QueryField>(result);
  for (const field of fields) {
    if (!seen.has(field)) {
      seen.add(field);
      result.push(field);
    }
  }
  return result;
}

function capCodePoints(value: string, maximum: number): string {
  return Array.from(value).slice(0, maximum).join('');
}

function normalizedText(value: string, maximum: number): string | undefined {
  const normalized = capCodePoints(value.trim(), maximum);
  return normalized.length === 0 ? undefined : normalized;
}

function normalizedList(values: readonly string[]): string[] {
  const result: string[] = [];
  const seen = new Set<string>();
  for (const value of values) {
    const normalized = normalizedText(value, 100);
    if (normalized === undefined || seen.has(normalized)) continue;
    seen.add(normalized);
    result.push(normalized);
    if (result.length === 100) break;
  }
  return result;
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

function isoDate(value: Date | undefined): string | undefined {
  if (value === undefined || !Number.isFinite(value.getTime()))
    return undefined;
  return value.toISOString();
}

function projectTrade(
  record: AgentTradeReadRecord,
  fields: readonly QueryField[]
): TradeRow {
  const row: TradeRow = { trade_id: record.tradeId };
  for (const field of fields) {
    switch (field) {
      case 'trade_id':
        break;
      case 'symbol': {
        const value =
          record.symbol === undefined
            ? undefined
            : normalizedText(record.symbol, 40);
        row.symbol = value ?? null;
        break;
      }
      case 'direction':
        row.direction = record.direction ?? null;
        break;
      case 'status':
        row.status = record.executionStatus;
        break;
      case 'entry_time': {
        const value = isoDate(record.entryTime);
        row.entry_time = value ?? null;
        break;
      }
      case 'exit_time': {
        const value = isoDate(record.exitTime);
        row.exit_time = value ?? null;
        break;
      }
      case 'account_id':
        row.account_id =
          record.accountIds.length === 1 ? record.accountIds[0] : null;
        break;
      case 'setup_id':
        row.setup_id = record.setupIds.length === 1 ? record.setupIds[0] : null;
        break;
      case 'volume': {
        const value = boundedNumber(record.volume, 0, 1_000_000_000);
        row.volume = value ?? null;
        break;
      }
      case 'entry_price': {
        const value = boundedNumber(
          record.entryPrice,
          -1_000_000_000,
          1_000_000_000
        );
        row.entry_price = value ?? null;
        break;
      }
      case 'exit_price': {
        const value = boundedNumber(
          record.exitPrice,
          -1_000_000_000,
          1_000_000_000
        );
        row.exit_price = value ?? null;
        break;
      }
      case 'pnl': {
        const value = boundedNumber(record.pnl, -1_000_000_000, 1_000_000_000);
        row.pnl = value ?? null;
        break;
      }
      case 'commission': {
        const value = boundedNumber(
          record.commission,
          -1_000_000_000,
          1_000_000_000
        );
        row.commission = value ?? null;
        break;
      }
      case 'r_multiple': {
        const value = boundedNumber(record.rMultiple, -1_000_000, 1_000_000);
        row.r_multiple = value ?? null;
        break;
      }
      case 'tags':
        row.tags = normalizedList(record.tags);
        break;
      case 'mistakes':
        row.mistakes = normalizedList(record.mistakes);
        break;
      case 'trade_revision':
        
        
        row.trade_revision = record.tradeRevision ?? 0;
        break;
      default: {
        const exhaustiveField: never = field;
        return exhaustiveField;
      }
    }
  }
  return row;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const prototype = Object.getPrototypeOf(value) as unknown;
  return prototype === Object.prototype || prototype === null;
}

function hasExactFields(
  value: unknown,
  expected: readonly QueryField[]
): boolean {
  if (!Array.isArray(value) || value.length !== expected.length) return false;
  return value.every((field, index) => field === expected[index]);
}

function isQueryField(value: string): value is QueryField {
  return QUERY_FIELDS.some((field) => field === value);
}

function isStringList(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.length <= 100 &&
    value.every(
      (item) =>
        typeof item === 'string' &&
        item.length > 0 &&
        Array.from(item).length <= 100
    )
  );
}


const NULLABLE_FIELDS: ReadonlySet<QueryField> = new Set([
  'symbol',
  'direction',
  'entry_time',
  'volume',
  'entry_price',
  'exit_time',
  'account_id',
  'setup_id',
  'exit_price',
  'pnl',
  'commission',
  'r_multiple',
]);

function isCachedFieldValue(field: QueryField, value: unknown): boolean {
  if (value === null) return NULLABLE_FIELDS.has(field);
  switch (field) {
    case 'trade_id':
      return typeof value === 'string' && TRADE_ID_PATTERN.test(value);
    case 'account_id':
    case 'setup_id':
      return (
        typeof value === 'string' &&
        value.length <= 128 &&
        OPAQUE_ID_PATTERN.test(value)
      );
    case 'symbol':
      return (
        typeof value === 'string' &&
        value.length > 0 &&
        Array.from(value).length <= 40
      );
    case 'direction':
      return value === 'long' || value === 'short';
    case 'status':
      return (
        value === 'open' ||
        value === 'partially_closed' ||
        value === 'closed' ||
        value === 'cancelled'
      );
    case 'entry_time':
    case 'exit_time': {
      if (typeof value !== 'string') return false;
      const timestamp = Date.parse(value);
      return (
        Number.isFinite(timestamp) &&
        new Date(timestamp).toISOString() === value
      );
    }
    case 'volume':
      return (
        typeof value === 'number' &&
        boundedNumber(value, 0, 1_000_000_000) !== undefined
      );
    case 'entry_price':
    case 'exit_price':
    case 'pnl':
    case 'commission':
      return (
        typeof value === 'number' &&
        boundedNumber(value, -1_000_000_000, 1_000_000_000) !== undefined
      );
    case 'r_multiple':
      return (
        typeof value === 'number' &&
        boundedNumber(value, -1_000_000, 1_000_000) !== undefined
      );
    case 'tags':
    case 'mistakes':
      return isStringList(value);
    case 'trade_revision':
      return (
        typeof value === 'number' && Number.isSafeInteger(value) && value >= 0
      );
    default: {
      const exhaustiveField: never = field;
      return exhaustiveField;
    }
  }
}

function isTradeRow(
  value: unknown,
  fields: readonly QueryField[]
): value is TradeRow {
  if (!isPlainObject(value) || typeof value.trade_id !== 'string') return false;
  const allowed = new Set<QueryField>(fields);
  for (const key of Object.keys(value)) {
    if (
      !isQueryField(key) ||
      !allowed.has(key) ||
      !isCachedFieldValue(key, value[key])
    ) {
      return false;
    }
  }
  return true;
}

function isSnapshot(
  value: unknown,
  fields: readonly QueryField[]
): value is QueryTradesSnapshot {
  if (!isPlainObject(value)) return false;
  const keys = Object.keys(value);
  if (
    keys.length !== 2 ||
    !keys.includes('fields') ||
    !keys.includes('trades')
  ) {
    return false;
  }
  return (
    hasExactFields(value.fields, fields) &&
    Array.isArray(value.trades) &&
    value.trades.every((trade) => isTradeRow(trade, fields))
  );
}

function baseArguments(request: QueryTradesRequest): QueryTradesRequest {
  return { ...request, page: { limit: request.page.limit } };
}

function errorResult(error: unknown): QueryTradesResult {
  if (error instanceof AgentTradeReadError) {
    return error.code === 'invalid_request' ? INVALID_REQUEST : LIMIT_EXCEEDED;
  }
  if (error instanceof AgentResultCacheError) {
    switch (error.code) {
      case 'invalid_request':
        return INVALID_REQUEST;
      case 'limit_exceeded':
        return LIMIT_EXCEEDED;
      case 'cursor_expired':
        return CURSOR_EXPIRED;
    }
  }
  return setupReadErrorResult(error) ?? INTERNAL_ERROR;
}

export function createQueryTradesHandler(
  dependencies: QueryTradesDependencies
): AgentToolHandler<'query_trades'> {
  return async (request, context) => {
    try {
      if (context.signal.aborted) throw new Error('Agent operation aborted');
      const fields = effectiveFields(request.fields);
      const cacheContext: {
        tool: 'query_trades';
        installationId: string;
        arguments: QueryTradesRequest;
      } = {
        tool: 'query_trades',
        installationId: context.installationId,
        arguments: baseArguments(request),
      };

      let snapshotValue: unknown;
      let offset = 0;
      let resultId: string;
      let cached = true;
      if (request.page.cursor !== undefined) {
        const resolved = await dependencies.cache.resolveCursor(
          request.page.cursor,
          cacheContext
        );
        if (context.signal.aborted) throw new Error('Agent operation aborted');
        snapshotValue = resolved.snapshot;
        offset = resolved.offset;
        resultId = resolved.resultId;
      } else {
        const prior = await dependencies.cache.findPrior(
          context.priorResultHint,
          cacheContext
        );
        if (context.signal.aborted) throw new Error('Agent operation aborted');
        if (prior !== null) {
          snapshotValue = prior.snapshot;
          resultId = prior.resultId;
        } else {
          const readService = await dependencies.getReadService();
          if (context.signal.aborted)
            throw new Error('Agent operation aborted');
          const records = await readService.read(
            { filters: request.filters, sort: request.sort },
            context.signal
          );
          if (context.signal.aborted)
            throw new Error('Agent operation aborted');
          const snapshot: QueryTradesSnapshot = {
            fields,
            trades: records.map((record) => projectTrade(record, fields)),
          };
          resultId = await dependencies.cache.store({
            ...cacheContext,
            snapshot,
          });
          if (context.signal.aborted)
            throw new Error('Agent operation aborted');
          snapshotValue = snapshot;
          cached = false;
        }
      }

      if (!isSnapshot(snapshotValue, fields)) {
        return { result: INTERNAL_ERROR };
      }
      if (
        !Number.isSafeInteger(offset) ||
        offset < 0 ||
        offset > snapshotValue.trades.length
      ) {
        return { result: INTERNAL_ERROR };
      }

      const trades = snapshotValue.trades.slice(
        offset,
        offset + request.page.limit
      );
      const nextOffset = offset + trades.length;
      const hasMore = nextOffset < snapshotValue.trades.length;
      const page: Success['page'] = { has_more: hasMore };
      if (hasMore) {
        page.next_cursor = dependencies.cache.createCursor(resultId, {
          offset: nextOffset,
        });
      }
      const meta: Success['meta'] = {
        contract_version: agentContractManifest.version,
        contract_digest: agentContractManifest.digest,
        cached,
      };
      if (snapshotValue.trades.length <= 100_000) {
        meta.row_count = snapshotValue.trades.length;
      }
      return {
        result: { status: 'ok', meta, fields, trades, page },
        resultId,
      };
    } catch (error) {
      if (context.signal.aborted) throw error;
      return { result: errorResult(error) };
    }
  };
}
