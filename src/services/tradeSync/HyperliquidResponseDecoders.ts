import { ApiError } from '../../types/errors';
import type {
  BrokerSyncJob,
  HyperliquidConfig,
  HyperliquidConnection,
  HyperliquidConnectionAccount,
  HyperliquidConnections,
} from './types';

function invalid(): never {
  throw new ApiError('Invalid Hyperliquid response');
}

function isResponseObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function object(value: unknown): Record<string, unknown> {
  if (!isResponseObject(value)) invalid();
  return value;
}

function list(value: unknown): unknown[] {
  if (!Array.isArray(value)) invalid();
  return value;
}

function string(value: unknown): string {
  if (typeof value !== 'string') invalid();
  return value;
}

export function validateHyperliquidId(value: unknown): string {
  const id = string(value);
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
  )
    invalid();
  return id;
}

function boolean(value: unknown): boolean {
  if (typeof value !== 'boolean') invalid();
  return value;
}

function integer(value: unknown, minimum = 0): number {
  if (
    typeof value !== 'number' ||
    !Number.isSafeInteger(value) ||
    value < minimum
  )
    invalid();
  return value;
}


export function decodeHyperliquidClientDiagnosticsReceipt(
  value: unknown,
  submittedEventCount: number
): void {
  const receipt = object(value);
  if (
    receipt.schemaVersion !== 'hyperliquid-client-diagnostics-v2' ||
    integer(receipt.accepted) !== submittedEventCount
  )
    invalid();
}

function choice<T extends string>(value: unknown, choices: readonly T[]): T {
  for (const candidate of choices) if (value === candidate) return candidate;
  return invalid();
}

function timestamp(value: unknown): string {
  const date = string(value);
  if (
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(
      date
    ) ||
    !Number.isFinite(Date.parse(date))
  )
    invalid();
  
  const day = Number(date.slice(8, 10));
  const month = Number(date.slice(5, 7));
  const year = Number(date.slice(0, 4));
  const monthEnd = new Date(0);
  monthEnd.setUTCFullYear(year, month, 0);
  if (
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > monthEnd.getUTCDate() ||
    Number(date.slice(11, 13)) > 23 ||
    Number(date.slice(14, 16)) > 59 ||
    Number(date.slice(17, 19)) > 59
  )
    invalid();
  return date;
}

function optionalString(value: unknown): string | undefined {
  return value == null ? undefined : string(value);
}

function optionalDate(value: unknown): string | undefined {
  return value == null ? undefined : timestamp(value);
}

function unique(id: string, seen: Set<string>): void {
  const key = id.toLowerCase();
  if (seen.has(key)) invalid();
  seen.add(key);
}

export function decodeHyperliquidConfig(value: unknown): HyperliquidConfig {
  const data = object(value);
  const networks = list(data.networks).map((network) =>
    choice(network, ['mainnet', 'testnet'] as const)
  );
  const products = list(data.supportedProducts).map((product) =>
    choice(product, ['usdc_perpetuals'] as const)
  );
  if (
    new Set(networks).size !== networks.length ||
    new Set(products).size !== products.length
  )
    invalid();
  return {
    enabled: boolean(data.enabled),
    eligible: boolean(data.eligible),
    networks,
    supportedProducts: products,
    maxConnections: integer(data.maxConnections, 1),
    fillHistoryLimit: integer(data.fillHistoryLimit, 1),
    historyCapacityBytes: integer(data.historyCapacityBytes, 1),
  };
}

function decodeJob(value: unknown, connectionId: string): BrokerSyncJob {
  const data = object(value);
  const nestedConnectionId = validateHyperliquidId(data.connectionId);
  if (nestedConnectionId !== connectionId) invalid();
  const kind = string(data.kind);
  if (kind.trim().length === 0) invalid();
  return {
    id: validateHyperliquidId(data.id),
    connectionId: nestedConnectionId,
    kind,
    status: choice(data.status, [
      'queued',
      'running',
      'succeeded',
      'partial',
      'failed',
      'cancelled',
    ]),
    errorCode: optionalString(data.errorCode),
  };
}

function decodeAccount(
  value: unknown,
  connectionId: string
): HyperliquidConnectionAccount {
  const data = object(value);
  if (validateHyperliquidId(data.connectionId) !== connectionId) invalid();
  const claim = object(data.syncClaim);
  let syncClaim: HyperliquidConnectionAccount['syncClaim'];
  if (claim.state === 'available') {
    if (claim.holderConnectionId !== null) invalid();
    syncClaim = { state: 'available', holderConnectionId: null };
  } else {
    const state = choice(claim.state, ['held', 'held_elsewhere']);
    const holderConnectionId = validateHyperliquidId(claim.holderConnectionId);
    if ((state === 'held') !== (holderConnectionId === connectionId)) invalid();
    syncClaim = { state, holderConnectionId };
  }
  const historyMode = choice(data.historyMode, [
    'all_available',
    'from_date',
    'from_connection',
  ]);
  const historyFrom = optionalDate(data.historyFrom);
  if ((historyMode === 'from_date') !== (historyFrom !== undefined)) invalid();
  if (historyFrom !== undefined) {
    const instant = Date.parse(historyFrom);
    
    
    if (
      instant === Date.parse('0001-01-01T00:00:00Z') ||
      instant % (24 * 60 * 60 * 1000) !== 0 ||
      /\.\d*[1-9]/.test(historyFrom)
    )
      invalid();
  }
  return {
    id: validateHyperliquidId(data.id),
    connectionId,
    canonicalAccountId: validateHyperliquidId(data.canonicalAccountId),
    environment: choice(data.environment, ['live', 'demo']),
    displayName: optionalString(data.displayName),
    currency: optionalString(data.currency),
    providerAvailable: boolean(data.providerAvailable),
    syncEnabled: boolean(data.syncEnabled),
    historyMode,
    historyFrom,
    providerHistoryBoundaryStatus: string(data.providerHistoryBoundaryStatus),
    providerHistoryBoundaryDate: optionalDate(data.providerHistoryBoundaryDate),
    providerHistoryBoundaryObservedAt: optionalDate(
      data.providerHistoryBoundaryObservedAt
    ),
    providerHistoryBoundaryErrorCode: optionalString(
      data.providerHistoryBoundaryErrorCode
    ),
    tradeHistoryComplete: boolean(data.tradeHistoryComplete),
    performanceCoverageThrough: optionalDate(data.performanceCoverageThrough),
    cashHistoryCoverageThrough: optionalDate(data.cashHistoryCoverageThrough),
    feeDataIncomplete: boolean(data.feeDataIncomplete),
    lastSuccessfulSyncAt: optionalDate(data.lastSuccessfulSyncAt),
    createdAt: timestamp(data.createdAt),
    updatedAt: timestamp(data.updatedAt),
    syncClaim,
  };
}

export function decodeHyperliquidConnections(
  value: unknown
): HyperliquidConnections {
  const data = object(value);
  if (data.schemaVersion !== 'hyperliquid-connections-v2') invalid();
  const connectionIds = new Set<string>();
  const accountIds = new Set<string>();
  const jobIds = new Set<string>();
  const connections = list(data.connections).map(
    (value): HyperliquidConnection => {
      const connection = object(value);
      const id = validateHyperliquidId(connection.id);
      unique(id, connectionIds);
      const canonicalIds = new Set<string>();
      const accounts = list(connection.accounts).map((value) => {
        const account = decodeAccount(value, id);
        unique(account.id, accountIds);
        unique(account.canonicalAccountId, canonicalIds);
        return account;
      });
      const jobs = list(connection.jobs).map((value) => {
        const job = decodeJob(value, id);
        unique(job.id, jobIds);
        return job;
      });
      return {
        id,
        displayName: string(connection.displayName),
        providerName: optionalString(connection.providerName),
        status: choice(connection.status, [
          'pending',
          'setup_required',
          'active',
          'paused',
          'reauthorization_required',
          'disconnected',
          'error',
          'deleting',
        ]),
        connectedAt: optionalDate(connection.connectedAt),
        lastSuccessfulSyncAt: optionalDate(connection.lastSuccessfulSyncAt),
        lastErrorAt: optionalDate(connection.lastErrorAt),
        nextSyncAt: optionalDate(connection.nextSyncAt),
        lastErrorCode: optionalString(connection.lastErrorCode),
        reconciliationIssueCount: integer(connection.reconciliationIssueCount),
        accounts,
        jobs,
      };
    }
  );
  return { schemaVersion: 'hyperliquid-connections-v2', connections };
}

export function decodeHyperliquidSyncJob(
  value: unknown,
  connectionId: string
): BrokerSyncJob {
  const data = object(value);
  if (
    data.schemaVersion !== 'hyperliquid-sync-job-v2' ||
    validateHyperliquidId(data.connectionId) !== connectionId
  )
    invalid();
  boolean(data.created);
  return decodeJob(data.job, connectionId);
}

export function decodeHyperliquidJob(
  value: unknown,
  connectionId: string,
  jobId: string
): BrokerSyncJob {
  const data = object(value);
  if (
    data.schemaVersion !== 'hyperliquid-job-v2' ||
    validateHyperliquidId(data.connectionId) !== connectionId
  )
    invalid();
  const job = decodeJob(data.job, connectionId);
  if (job.id !== jobId) invalid();
  return job;
}
