import { ApiError } from '../../types/errors';
import { validateFieldKey } from '../../types/customFields';
import { isTradeProjectionGeneration } from './TradeProjectionGeneration';
import type { TradeImportPreviewTrade } from '../tradeImport/types';
import type {
  TradeProjection,
  TradeProjectionAccountInventoryItem,
  TradeProjectionAccountInventoryResponse,
  TradeProjectionAccountVaultMapping,
  TradeProjectionAccountVaultMappingRequest,
  TradeProjectionRequest,
  TradeProjectionResponse,
  TradovateConnection,
  TradovateConnectionAccount,
  TradovateConnections,
  TradovateSyncJob,
} from './types';

const asRecord = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? Object.fromEntries(Object.entries(value))
    : null;

const unknownArray = (value: unknown): unknown[] =>
  Array.isArray(value) ? value : [];

const optionalString = (value: unknown): string | null =>
  typeof value === 'string' && value.trim() ? value : null;

const requiredInventoryCount = (value: unknown): number => {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 0) {
    throw new Error('Invalid Trade Projection account inventory response');
  }
  return value;
};

const projectionCursor = (value: unknown): string | null => {
  if (value === undefined || value === null) return null;
  if (typeof value !== 'string') {
    throw new Error('Invalid Trade Projection restorable response');
  }
  return value.trim() ? value : null;
};

const isPositiveInteger = (value: unknown): value is number =>
  typeof value === 'number' && Number.isInteger(value) && value > 0;

const projectionTradeId = (value: unknown): string => {
  if (typeof value !== 'string' || !value.trim() || value !== value.trim()) {
    throw new Error('Invalid Trade Projection restorable response');
  }
  return value;
};

const nullableProjectionNumber = (
  value: unknown,
  field: string
): number | null => {
  if (value === undefined || value === null) return null;
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`Invalid Trade Projection ${field} response`);
  }
  return value;
};

const nullableNonnegativeProjectionNumber = (
  value: unknown,
  field: string
): number | null => {
  const number = nullableProjectionNumber(value, field);
  if (number !== null && number < 0) {
    throw new Error(`Invalid Trade Projection ${field} response`);
  }
  return number;
};

const nullablePositiveProjectionNumber = (
  value: unknown,
  field: string
): number | null => {
  const number = nullableProjectionNumber(value, field);
  if (number !== null && number <= 0) {
    throw new Error(`Invalid Trade Projection ${field} response`);
  }
  return number;
};

const nullableMinimumProjectionNumber = (
  value: unknown,
  field: string,
  minimum: number
): number | null => {
  const number = nullableProjectionNumber(value, field);
  if (number !== null && number < minimum) {
    throw new Error(`Invalid Trade Projection ${field} response`);
  }
  return number;
};

const nullableProjectionString = (
  value: unknown,
  field: string
): string | null => {
  if (value === undefined || value === null) return null;
  if (typeof value !== 'string') {
    throw new Error(`Invalid Trade Projection ${field} response`);
  }
  return value;
};

const isParseableTimestamp = (value: unknown): value is string =>
  typeof value === 'string' &&
  value.trim().length > 0 &&
  Number.isFinite(Date.parse(value));

const nullableProjectionTimestamp = (
  value: unknown,
  field: string
): string | null => {
  if (value === undefined || value === null) return null;
  if (!isParseableTimestamp(value)) {
    throw new Error(`Invalid Trade Projection ${field} response`);
  }
  return value;
};

const projectionStringArray = (value: unknown, field: string): string[] => {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value)) {
    throw new Error(`Invalid Trade Projection ${field} response`);
  }
  const result: string[] = [];
  for (const item of value) {
    if (typeof item !== 'string') {
      throw new Error(`Invalid Trade Projection ${field} response`);
    }
    result.push(item);
  }
  return result;
};

const projectionNumberArray = (value: unknown, field: string): number[] => {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value)) {
    throw new Error(`Invalid Trade Projection ${field} response`);
  }
  const result: number[] = [];
  for (const item of value) {
    if (typeof item !== 'number' || !Number.isFinite(item)) {
      throw new Error(`Invalid Trade Projection ${field} response`);
    }
    result.push(item);
  }
  return result;
};

const projectionCustomFields = (value: unknown): Record<string, unknown> => {
  if (value === undefined) return {};
  const record = asRecord(value);
  if (!record) {
    throw new Error('Invalid Trade Projection customFields response');
  }
  if (Object.keys(record).some((key) => validateFieldKey(key) !== null)) {
    throw new Error('Invalid Trade Projection customFields response');
  }
  return record;
};

const projectionGeneration = (value: unknown): string | undefined => {
  if (value === undefined) return undefined;
  if (!isTradeProjectionGeneration(value)) {
    throw new Error('Invalid Trade Projection restorable response');
  }
  return value;
};

function scopedIdentifier(value: unknown, field: string): string {
  if (
    typeof value !== 'string' ||
    value.trim() === '' ||
    value !== value.trim()
  ) {
    throw new Error(`Invalid Tradovate ${field} response`);
  }
  return value;
}

function normalizeTradovateJob(value: unknown): TradovateSyncJob {
  const job = asRecord(value);
  if (
    !job ||
    typeof job.kind !== 'string' ||
    job.kind.trim() === '' ||
    job.kind !== job.kind.trim() ||
    typeof job.status !== 'string'
  ) {
    throw new Error('Invalid Tradovate job response');
  }
  return {
    id: scopedIdentifier(job.id, 'job'),
    connectionId: scopedIdentifier(job.connectionId, 'job connection scope'),
    kind: job.kind,
    status: job.status,
    errorCode: typeof job.errorCode === 'string' ? job.errorCode : undefined,
  };
}

function executionArray(value: unknown): TradeImportPreviewTrade['entries'] {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value)) {
    throw new Error('Invalid Trade Projection execution response');
  }
  return value.map((item) => {
    const record = asRecord(item);
    if (
      !record ||
      !isParseableTimestamp(record.time) ||
      typeof record.price !== 'number' ||
      !Number.isFinite(record.price) ||
      typeof record.size !== 'number' ||
      !Number.isFinite(record.size) ||
      record.size <= 0
    ) {
      throw new Error('Invalid Trade Projection execution response');
    }
    return { time: record.time, price: record.price, size: record.size };
  });
}

function previewStatus(
  value: unknown
): TradeImportPreviewTrade['status'] | null {
  switch (value) {
    case 'OPEN':
      return 'OPEN';
    case 'PARTIALLY_CLOSED':
      return 'PARTIALLY_CLOSED';
    case 'CLOSED':
      return 'CLOSED';
    case 'CANCELLED':
      return 'CANCELLED';
    default:
      return null;
  }
}

function projectionStatus(
  value: unknown,
  fallback: TradeImportPreviewTrade['status'] = 'CLOSED'
): TradeProjection['status'] {
  switch (value) {
    case 'open':
    case 'OPEN':
      return 'open';
    case 'partially_closed':
    case 'PARTIALLY_CLOSED':
      return 'partially_closed';
    case 'closed':
    case 'CLOSED':
      return 'closed';
    case 'cancelled':
    case 'CANCELLED':
      return 'cancelled';
    default:
      return fallback === 'OPEN'
        ? 'open'
        : fallback === 'PARTIALLY_CLOSED'
          ? 'partially_closed'
          : fallback === 'CANCELLED'
            ? 'cancelled'
            : 'closed';
  }
}

function previewTradesArray(value: unknown): TradeImportPreviewTrade[] {
  return unknownArray(value).flatMap((item) => {
    const record = asRecord(item);
    const status = previewStatus(record?.status);
    if (
      !record ||
      typeof record.symbol !== 'string' ||
      !record.symbol.trim() ||
      (record.direction !== 'long' && record.direction !== 'short') ||
      !isParseableTimestamp(record.entryTime) ||
      typeof record.entryPrice !== 'number' ||
      !Number.isFinite(record.entryPrice) ||
      typeof record.quantity !== 'number' ||
      !Number.isFinite(record.quantity) ||
      record.quantity < 0 ||
      !status ||
      typeof record.closeOnly !== 'boolean' ||
      typeof record.useDirectPnLInput !== 'boolean'
    ) {
      throw new Error('Invalid Trade Projection preview trade response');
    }
    return [
      {
        sourceRows: projectionNumberArray(record.sourceRows, 'sourceRows'),
        symbol: record.symbol,
        direction: record.direction,
        entryTime: record.entryTime,
        entryPrice: record.entryPrice,
        quantity: record.quantity,
        openQuantity:
          nullableNonnegativeProjectionNumber(
            record.openQuantity,
            'openQuantity'
          ) ?? undefined,
        closedQuantity:
          nullableNonnegativeProjectionNumber(
            record.closedQuantity,
            'closedQuantity'
          ) ?? undefined,
        exitTime: nullableProjectionTimestamp(record.exitTime, 'exitTime'),
        exitPrice: nullableProjectionNumber(record.exitPrice, 'exitPrice'),
        status,
        closeOnly: record.closeOnly,
        useDirectPnLInput: record.useDirectPnLInput,
        directPnL: nullableProjectionNumber(record.directPnL, 'directPnL'),
        profitLoss: nullableProjectionNumber(record.profitLoss, 'profitLoss'),
        grossProfitLoss: nullableProjectionNumber(
          record.grossProfitLoss,
          'grossProfitLoss'
        ),
        commission: nullableProjectionNumber(record.commission, 'commission'),
        fees: nullableProjectionNumber(record.fees, 'fees'),
        swap: nullableProjectionNumber(record.swap, 'swap'),
        assetType: nullableProjectionString(record.assetType, 'assetType'),
        exchange: nullableProjectionString(record.exchange, 'exchange'),
        underlyingSymbol: nullableProjectionString(
          record.underlyingSymbol,
          'underlyingSymbol'
        ),
        brokerContract: nullableProjectionString(
          record.brokerContract,
          'brokerContract'
        ),
        orderId: nullableProjectionString(record.orderId, 'orderId'),
        accountId: nullableProjectionString(record.accountId, 'accountId'),
        currency: nullableProjectionString(record.currency, 'currency'),
        brokerBaseCurrencyPnl: nullableProjectionNumber(
          record.brokerBaseCurrencyPnl,
          'brokerBaseCurrencyPnl'
        ),
        brokerBaseCurrency: nullableProjectionString(
          record.brokerBaseCurrency,
          'brokerBaseCurrency'
        ),
        brokerBaseCurrencyPnlSource: nullableProjectionString(
          record.brokerBaseCurrencyPnlSource,
          'brokerBaseCurrencyPnlSource'
        ),
        brokerComment: nullableProjectionString(
          record.brokerComment,
          'brokerComment'
        ),
        notes: nullableProjectionString(record.notes, 'notes'),
        thesis: nullableProjectionString(record.thesis, 'thesis'),
        entries: executionArray(record.entries),
        exits: executionArray(record.exits),
        executionLedgerVersion: nullableProjectionNumber(
          record.executionLedgerVersion,
          'executionLedgerVersion'
        ),
        executionIds: projectionStringArray(
          record.executionIds,
          'executionIds'
        ),
        tags: projectionStringArray(record.tags, 'tags'),
        images: projectionStringArray(record.images, 'images'),
        setup: projectionStringArray(record.setup, 'setup'),
        mistake: projectionStringArray(record.mistake, 'mistake'),
        customFields: projectionCustomFields(record.customFields),
        strikePrice: nullablePositiveProjectionNumber(
          record.strikePrice,
          'strikePrice'
        ),
        expirationDate: nullableProjectionTimestamp(
          record.expirationDate,
          'expirationDate'
        ),
        optionType: nullableProjectionString(record.optionType, 'optionType'),
        contractSize: nullablePositiveProjectionNumber(
          record.contractSize,
          'contractSize'
        ),
        dollarPerPoint: nullableMinimumProjectionNumber(
          record.dollarPerPoint,
          'dollarPerPoint',
          0.01
        ),
        tickSize: nullableProjectionNumber(record.tickSize, 'tickSize'),
        lastBrokerSyncAt: nullableProjectionTimestamp(
          record.lastBrokerSyncAt,
          'lastBrokerSyncAt'
        ),
        tickValue: nullableProjectionNumber(record.tickValue, 'tickValue'),
        lotSize: nullableNonnegativeProjectionNumber(record.lotSize, 'lotSize'),
        pipValue: nullableProjectionNumber(record.pipValue, 'pipValue'),
        pipSize: nullableProjectionNumber(record.pipSize, 'pipSize'),
        currencyPair: nullableProjectionString(
          record.currencyPair,
          'currencyPair'
        ),
        tradingPair: nullableProjectionString(
          record.tradingPair,
          'tradingPair'
        ),
        cryptoExchange: nullableProjectionString(
          record.cryptoExchange,
          'cryptoExchange'
        ),
        leverageRatio: nullablePositiveProjectionNumber(
          record.leverageRatio,
          'leverageRatio'
        ),
      },
    ];
  });
}

function projectionSyncStatus(
  value: unknown
): TradeProjection['projectionStatus'] {
  if (value === undefined) return 'missing';
  switch (value) {
    case 'missing':
      return 'missing';
    case 'local_deleted':
      return 'local_deleted';
    case 'other_vault':
      return 'other_vault';
    case 'needs_rewrite':
      return 'needs_rewrite';
    case 'synced':
      return 'synced';
    case 'failed':
      return 'failed';
    case 'conflict':
      return 'conflict';
    case 'pending':
      return 'pending';
    default:
      throw new Error('Invalid Trade Projection restorable response');
  }
}

function normalizeMissingProjection(
  record: Record<string, unknown>
): TradeProjection {
  const projectionTrade = asRecord(record.projectionTrade);
  const [previewTrade] = previewTradesArray([projectionTrade?.previewTrade]);
  const summary = asRecord(record.summary);
  if (!isPositiveInteger(record.backendTradeVersion)) {
    throw new Error('Invalid Trade Projection restorable response');
  }
  const tradeId = projectionTradeId(record.tradeId);
  const state = asRecord(record.projectionState);
  const syncStatus = projectionSyncStatus(state?.syncStatus);
  return {
    id: tradeId,
    version: record.backendTradeVersion,
    symbol:
      typeof record.symbol === 'string'
        ? record.symbol
        : typeof summary?.symbol === 'string'
          ? summary.symbol
          : previewTrade.symbol,
    direction: previewTrade.direction === 'short' ? 'short' : 'long',
    status: projectionStatus(summary?.status, previewTrade.status),
    accountName:
      typeof record.accountDisplayName === 'string'
        ? record.accountDisplayName
        : null,
    accountId: typeof record.accountId === 'string' ? record.accountId : null,
    importId: typeof record.importId === 'string' ? record.importId : '',
    correlationId:
      typeof record.correlationId === 'string'
        ? record.correlationId
        : undefined,
    commitId: typeof record.commitId === 'string' ? record.commitId : undefined,
    broker: typeof record.broker === 'string' ? record.broker : null,
    importedAt: nullableProjectionTimestamp(record.importedAt, 'importedAt'),
    projectionStatus:
      syncStatus === 'local_deleted'
        ? 'local_deleted'
        : state?.stale === true
          ? 'needs_rewrite'
          : syncStatus,
    projectionGeneration: projectionGeneration(state?.localRevision),
    previewTrade,
  };
}

function normalizeProjectionResponse(value: unknown): TradeProjectionResponse {
  const record = asRecord(value);
  if (
    !record ||
    record.schemaVersion !== 'trade-projections-missing-v1' ||
    typeof record.vaultId !== 'string'
  ) {
    throw new Error('Invalid Trade Projection restorable response');
  }
  if (!Array.isArray(record.items)) {
    throw new Error('Invalid Trade Projection restorable response');
  }
  return {
    schemaVersion: 'trade-projections-missing-v1',
    vaultId: record.vaultId,
    nextCursor: projectionCursor(record.nextCursor),
    projections: record.items.map((item) => {
      const projection = asRecord(item);
      if (projection && 'projectionTrade' in projection) {
        return normalizeMissingProjection(projection);
      }
      if (!projection || !isPositiveInteger(projection.version)) {
        throw new Error('Invalid Trade Projection restorable response');
      }
      const tradeId = projectionTradeId(projection.id);
      const [previewTrade] = previewTradesArray([projection.previewTrade]);
      return {
        id: tradeId,
        version: projection.version,
        symbol:
          typeof projection.symbol === 'string'
            ? projection.symbol
            : previewTrade.symbol,
        direction: projection.direction === 'short' ? 'short' : 'long',
        status: projectionStatus(
          asRecord(projection.summary)?.status ?? projection.status,
          previewTrade.status
        ),
        accountName:
          typeof projection.accountName === 'string'
            ? projection.accountName
            : null,
        accountId:
          typeof projection.accountId === 'string'
            ? projection.accountId
            : null,
        importId:
          typeof projection.importId === 'string' ? projection.importId : '',
        correlationId:
          typeof projection.correlationId === 'string'
            ? projection.correlationId
            : undefined,
        commitId:
          typeof projection.commitId === 'string'
            ? projection.commitId
            : undefined,
        broker:
          typeof projection.broker === 'string' ? projection.broker : null,
        importedAt: nullableProjectionTimestamp(
          projection.importedAt,
          'importedAt'
        ),
        projectionStatus: projectionSyncStatus(projection.projectionStatus),
        previewTrade,
      } satisfies TradeProjection;
    }),
  };
}

function validateProjectionResponseScope(
  response: TradeProjectionResponse,
  request: TradeProjectionRequest
): void {
  if (response.vaultId !== request.vaultId) {
    throw new Error('Invalid Trade Projection vault scope response');
  }
  if (
    request.accountId !== undefined &&
    response.projections.some(
      (projection) => projection.accountId !== request.accountId
    )
  ) {
    throw new Error('Invalid Trade Projection account scope response');
  }
}

function normalizeMapping(
  value: unknown
): TradeProjectionAccountVaultMapping | null {
  if (value === undefined || value === null) return null;
  const record = asRecord(value);
  if (
    !record ||
    typeof record.vaultId !== 'string' ||
    record.vaultId.trim() === ''
  ) {
    throw new Error('Invalid Trade Projection mapping response');
  }
  const rawLocalAccountId = record.localAccountId;
  if (
    rawLocalAccountId !== undefined &&
    rawLocalAccountId !== null &&
    (typeof rawLocalAccountId !== 'string' ||
      rawLocalAccountId.trim() === '' ||
      rawLocalAccountId !== rawLocalAccountId.trim())
  ) {
    throw new Error('Invalid Trade Projection mapping response');
  }
  const localAccountId =
    typeof rawLocalAccountId === 'string' ? rawLocalAccountId : null;
  return {
    vaultId: record.vaultId,
    localAccountId,
    localAccountName: optionalString(record.localAccountName),
    mappingStatus: 'mapped',
    lastSyncedAt: nullableProjectionTimestamp(
      record.lastSyncedAt,
      'mapping lastSyncedAt'
    ),
    updatedAt: nullableProjectionTimestamp(
      record.updatedAt,
      'mapping updatedAt'
    ),
  };
}

function normalizeInventoryItem(
  value: unknown
): TradeProjectionAccountInventoryItem {
  const record = asRecord(value);
  if (
    !record ||
    typeof record.accountId !== 'string' ||
    record.accountId.trim() === '' ||
    record.accountId !== record.accountId.trim() ||
    typeof record.broker !== 'string'
  ) {
    throw new Error('Invalid Trade Projection account inventory response');
  }
  return {
    accountId: record.accountId,
    broker: record.broker,
    displayName: optionalString(record.displayName) ?? record.broker,
    tradeCount: requiredInventoryCount(record.tradeCount),
    missingCount: requiredInventoryCount(record.missingCount),
    localDeletedCount: requiredInventoryCount(record.localDeletedCount),
    failedCount: requiredInventoryCount(record.failedCount),
    needsRewriteCount: requiredInventoryCount(record.needsRewriteCount),
    staleCount: requiredInventoryCount(record.staleCount),
    conflictCount: requiredInventoryCount(record.conflictCount),
    pendingCount: requiredInventoryCount(record.pendingCount),
    syncedCount: requiredInventoryCount(record.syncedCount),
    restorableCount: requiredInventoryCount(record.restorableCount),
    lastImportedAt: nullableProjectionTimestamp(
      record.lastImportedAt,
      'inventory lastImportedAt'
    ),
    mapping: normalizeMapping(record.mapping),
  };
}

function normalizeInventory(
  value: unknown
): TradeProjectionAccountInventoryResponse {
  const record = asRecord(value);
  if (
    !record ||
    record.schemaVersion !== 'trade-projection-accounts-v1' ||
    typeof record.vaultId !== 'string' ||
    !Array.isArray(record.accounts)
  ) {
    throw new Error('Invalid Trade Projection account inventory response');
  }
  const accountIds = new Set<string>();
  const accounts = record.accounts.map((value) => {
    const account = normalizeInventoryItem(value);
    if (accountIds.has(account.accountId)) {
      throw new Error('Invalid Trade Projection account inventory response');
    }
    accountIds.add(account.accountId);
    return account;
  });
  return {
    schemaVersion: 'trade-projection-accounts-v1',
    vaultId: record.vaultId,
    accounts,
  };
}

function validateInventoryResponseScope(
  response: TradeProjectionAccountInventoryResponse,
  vaultId: string
): void {
  if (response.vaultId !== vaultId) {
    throw new Error('Invalid Trade Projection inventory vault scope response');
  }
  if (
    response.accounts.some(
      (account) => account.mapping && account.mapping.vaultId !== vaultId
    )
  ) {
    throw new Error('Invalid Trade Projection mapping vault scope response');
  }
}

export function decodeRestoreProjectionResponse(
  value: unknown,
  tradeId: string
): { version: number; generation: string } {
  const record = asRecord(value);
  if (
    record?.schemaVersion !== 'trade-projection-restore-v1' ||
    record.tradeId !== tradeId ||
    !isPositiveInteger(record.backendTradeVersion) ||
    !isTradeProjectionGeneration(record.projectionGeneration)
  ) {
    throw new ApiError('Invalid Trade Projection restore response', 502);
  }
  return {
    version: record.backendTradeVersion,
    generation: record.projectionGeneration,
  };
}

export function decodeTradovateSyncJobResponse(
  value: unknown,
  connectionId: string
): TradovateSyncJob {
  const record = asRecord(value);
  if (
    record?.schemaVersion !== 'tradovate-sync-job-v2' ||
    record.connectionId !== connectionId
  ) {
    throw new Error('Invalid Tradovate sync response scope');
  }
  const job = normalizeTradovateJob(record.job);
  if (job.connectionId !== connectionId) {
    throw new Error('Invalid Tradovate sync response scope');
  }
  return job;
}

export function decodeTradovateAccountSetupResponse(
  value: unknown,
  connectionId: string
): {
  job: TradovateSyncJob | null;
  created: boolean;
} {
  const record = asRecord(value);
  if (
    record?.schemaVersion !== 'tradovate-account-selection-v2' ||
    record.connectionId !== connectionId ||
    typeof record.created !== 'boolean'
  ) {
    throw new Error('Invalid Tradovate account setup response');
  }
  const job = record.job ? normalizeTradovateJob(record.job) : null;
  if (job && job.connectionId !== connectionId) {
    throw new Error('Invalid Tradovate account setup response scope');
  }
  return {
    job,
    created: record.created,
  };
}

export function decodeTradovateJobResponse(
  value: unknown,
  connectionId: string,
  jobId: string
): TradovateSyncJob {
  const record = asRecord(value);
  if (
    record?.schemaVersion !== 'tradovate-job-v2' ||
    record.connectionId !== connectionId
  ) {
    throw new Error('Invalid Tradovate job response scope');
  }
  const job = normalizeTradovateJob(record.job);
  if (job.id !== jobId || job.connectionId !== connectionId) {
    throw new Error('Invalid Tradovate job response scope');
  }
  return job;
}

function normalizeTradovateAccount(
  value: unknown,
  connectionId: string
): TradovateConnectionAccount {
  const account = asRecord(value);
  const historyMode = account?.historyMode;
  const historyFrom = nullableProjectionTimestamp(
    account?.historyFrom,
    'historyFrom'
  );
  const rawClaim = asRecord(account?.syncClaim);
  if (
    !account ||
    account.connectionId !== connectionId ||
    typeof account.environment !== 'string' ||
    account.environment.trim() === '' ||
    account.environment !== account.environment.trim() ||
    typeof account.syncEnabled !== 'boolean' ||
    (historyMode !== 'all_available' &&
      historyMode !== 'from_date' &&
      historyMode !== 'from_connection') ||
    (account.syncEnabled && historyMode === 'from_date' && !historyFrom) ||
    !rawClaim ||
    (rawClaim.state !== 'available' &&
      rawClaim.state !== 'held' &&
      rawClaim.state !== 'held_elsewhere')
  ) {
    throw new Error('Invalid Tradovate account status response');
  }
  const syncClaim =
    rawClaim.state === 'available'
      ? rawClaim.holderConnectionId === null
        ? ({ state: 'available', holderConnectionId: null } as const)
        : null
      : ({
          state: rawClaim.state,
          holderConnectionId: scopedIdentifier(
            rawClaim.holderConnectionId,
            'account sync claim scope'
          ),
        } as const);
  if (
    !syncClaim ||
    (account.syncEnabled &&
      (syncClaim.state !== 'held' ||
        syncClaim.holderConnectionId !== connectionId)) ||
    (!account.syncEnabled &&
      syncClaim.state === 'held' &&
      syncClaim.holderConnectionId === connectionId) ||
    (syncClaim.state === 'held' &&
      syncClaim.holderConnectionId !== connectionId) ||
    (syncClaim.state === 'held_elsewhere' &&
      syncClaim.holderConnectionId === connectionId)
  ) {
    throw new Error('Invalid Tradovate account sync claim response');
  }
  return {
    id: scopedIdentifier(account.id, 'account identity'),
    connectionId,
    canonicalAccountId: scopedIdentifier(
      account.canonicalAccountId,
      'canonical account identity'
    ),
    displayName:
      typeof account.displayName === 'string' ? account.displayName : undefined,
    environment: account.environment,
    currency:
      typeof account.currency === 'string' ? account.currency : undefined,
    syncEnabled: account.syncEnabled,
    historyMode,
    historyFrom: historyFrom ?? undefined,
    lastSuccessfulSyncAt:
      nullableProjectionTimestamp(
        account.lastSuccessfulSyncAt,
        'account lastSuccessfulSyncAt'
      ) ?? undefined,
    syncClaim,
  };
}

function normalizeTradovateConnection(value: unknown): TradovateConnection {
  const connection = asRecord(value);
  if (
    !connection ||
    typeof connection.displayName !== 'string' ||
    connection.displayName.trim() === '' ||
    connection.displayName !== connection.displayName.trim() ||
    typeof connection.status !== 'string' ||
    connection.status.trim() === '' ||
    connection.status !== connection.status.trim() ||
    typeof connection.reconciliationIssueCount !== 'number' ||
    !Number.isInteger(connection.reconciliationIssueCount) ||
    connection.reconciliationIssueCount < 0 ||
    !Array.isArray(connection.accounts) ||
    !Array.isArray(connection.jobs)
  ) {
    throw new Error('Invalid Tradovate connection response');
  }
  const id = scopedIdentifier(connection.id, 'connection identity');
  const accountIds = new Set<string>();
  const canonicalAccountIds = new Set<string>();
  const accounts = connection.accounts.map((item) => {
    const account = normalizeTradovateAccount(item, id);
    if (
      accountIds.has(account.id) ||
      canonicalAccountIds.has(account.canonicalAccountId)
    ) {
      throw new Error('Invalid Tradovate account status response');
    }
    accountIds.add(account.id);
    canonicalAccountIds.add(account.canonicalAccountId);
    return account;
  });
  const jobIds = new Set<string>();
  const jobs = connection.jobs.map((item) => {
    const job = normalizeTradovateJob(item);
    if (job.connectionId !== id || jobIds.has(job.id)) {
      throw new Error('Invalid Tradovate job status response');
    }
    jobIds.add(job.id);
    return job;
  });
  return {
    id,
    displayName: connection.displayName,
    status: connection.status,
    connectedAt:
      nullableProjectionTimestamp(connection.connectedAt, 'connectedAt') ??
      undefined,
    lastSuccessfulSyncAt:
      nullableProjectionTimestamp(
        connection.lastSuccessfulSyncAt,
        'connection lastSuccessfulSyncAt'
      ) ?? undefined,
    lastErrorCode:
      nullableProjectionString(connection.lastErrorCode, 'lastErrorCode') ??
      undefined,
    lastErrorAt:
      nullableProjectionTimestamp(connection.lastErrorAt, 'lastErrorAt') ??
      undefined,
    nextSyncAt:
      nullableProjectionTimestamp(connection.nextSyncAt, 'nextSyncAt') ??
      undefined,
    reconciliationIssueCount: connection.reconciliationIssueCount,
    accounts,
    jobs,
  };
}

export function decodeTradovateConnectionsResponse(
  value: unknown
): TradovateConnections {
  const record = asRecord(value);
  if (
    record?.schemaVersion !== 'tradovate-connections-v2' ||
    !Array.isArray(record.connections)
  ) {
    throw new Error('Invalid Tradovate connections response');
  }
  const connectionIds = new Set<string>();
  const connections = record.connections.map((item) => {
    const connection = normalizeTradovateConnection(item);
    if (connectionIds.has(connection.id)) {
      throw new Error('Invalid Tradovate connections response');
    }
    connectionIds.add(connection.id);
    return connection;
  });
  const claimHolderByCanonicalAccountId = new Map<string, string | null>();
  for (const connection of connections) {
    for (const account of connection.accounts) {
      if (
        account.syncClaim.state !== 'available' &&
        !connectionIds.has(account.syncClaim.holderConnectionId)
      ) {
        throw new Error('Invalid Tradovate account sync claim response');
      }
      const holderConnectionId =
        account.syncClaim.state === 'available'
          ? null
          : account.syncClaim.holderConnectionId;
      const existingHolder = claimHolderByCanonicalAccountId.get(
        account.canonicalAccountId
      );
      if (
        claimHolderByCanonicalAccountId.has(account.canonicalAccountId) &&
        existingHolder !== holderConnectionId
      ) {
        throw new Error('Invalid Tradovate account sync claim response');
      }
      claimHolderByCanonicalAccountId.set(
        account.canonicalAccountId,
        holderConnectionId
      );
    }
  }
  return { schemaVersion: 'tradovate-connections-v2', connections };
}

export function decodeTradeProjectionResponse(
  value: unknown,
  request: TradeProjectionRequest
): TradeProjectionResponse {
  const response = normalizeProjectionResponse(value);
  validateProjectionResponseScope(response, request);
  return response;
}

export function decodeTradeProjectionInventoryResponse(
  value: unknown,
  vaultId: string
): TradeProjectionAccountInventoryResponse {
  const response = normalizeInventory(value);
  validateInventoryResponseScope(response, vaultId);
  return response;
}

export function decodeTradeProjectionMappingResponse(
  value: unknown,
  request: TradeProjectionAccountVaultMappingRequest
): TradeProjectionAccountVaultMapping {
  const mapping = normalizeMapping(asRecord(value)?.mapping ?? value);
  if (!mapping || mapping.vaultId !== request.vaultId) {
    throw new Error('Invalid Trade Projection mapping vault scope response');
  }
  if (
    mapping.localAccountId !== request.localAccountId ||
    mapping.localAccountName !== request.localAccountName
  ) {
    throw new Error('Invalid Trade Projection mapping local account response');
  }
  return mapping;
}

export function decodeTradovateClientDiagnosticsResponse(value: unknown): void {
  const record = asRecord(value);
  if (record?.schemaVersion !== 'tradovate-client-diagnostics-v2') {
    throw new ApiError('Invalid Tradovate client diagnostics response', 502);
  }
}
