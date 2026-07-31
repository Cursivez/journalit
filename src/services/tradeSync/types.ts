import type { TradeImportPreviewTrade } from '../tradeImport/types';

export interface TradovateConnectionAccount {
  id: string;
  connectionId: string;
  canonicalAccountId: string;
  displayName?: string;
  environment: string;
  currency?: string;
  syncEnabled: boolean;
  historyMode: 'all_available' | 'from_date' | 'from_connection';
  historyFrom?: string;
  lastSuccessfulSyncAt?: string;
  syncClaim:
    | { state: 'available'; holderConnectionId: null }
    | { state: 'held'; holderConnectionId: string }
    | { state: 'held_elsewhere'; holderConnectionId: string };
}

export interface TradovateSyncJob {
  id: string;
  connectionId: string;
  kind: string;
  status: string;
  errorCode?: string;
}

const TRADOVATE_IN_PROGRESS_JOB_STATUSES = new Set([
  'queued',
  'running',
  'pending',
  'processing',
]);

export function isTradovateJobInProgress(status: string): boolean {
  return TRADOVATE_IN_PROGRESS_JOB_STATUSES.has(status.toLowerCase());
}

export interface TradovateConnection {
  id: string;
  displayName: string;
  status: string;
  connectedAt?: string;
  lastSuccessfulSyncAt?: string;
  lastErrorCode?: string;
  lastErrorAt?: string;
  nextSyncAt?: string;
  reconciliationIssueCount: number;
  accounts: TradovateConnectionAccount[];
  jobs: TradovateSyncJob[];
}

export interface TradovateConnections {
  schemaVersion: 'tradovate-connections-v2';
  connections: TradovateConnection[];
}

export interface TradovateAccountSelection {
  accountId: string;
  syncEnabled: boolean;
  historyMode: 'all_available' | 'from_date' | 'from_connection';
  historyFrom: string | null;
}

interface TradovateClientOperationBase {
  clientOperationId: string;
  ownerUserId: string;
  pluginVersion: string;
  vaultId: string;
  deviceId?: string;
  jobId?: string;
}

export type TradovateClientOperationContext = TradovateClientOperationBase &
  (
    | {
        scope: 'connection';
        connectionId: string;
      }
    | {
        scope: 'projection';
        syncRunId: string;
      }
  );

export type TradovateClientDiagnosticEventType =
  | 'sync_requested'
  | 'job_poll_started'
  | 'job_poll_completed'
  | 'projection_inventory_loaded'
  | 'account_mapping_missing'
  | 'projection_write_failed'
  | 'projection_ack_queued';

export type TradovateClientDiagnosticErrorCode =
  | 'broker_job_failed'
  | 'broker_job_cancelled'
  | 'job_poll_request_failed'
  | 'local_account_mapping_missing'
  | 'obsidian_write_timeout'
  | 'blocked_by_obsidian_write_timeout'
  | 'obsidian_write_failed'
  | 'trade_cache_lookup_failed';

export interface TradovateClientDiagnosticEvent {
  eventType: TradovateClientDiagnosticEventType;
  occurredAt: string;
  errorCode?: TradovateClientDiagnosticErrorCode;
  count?: number;
}

export interface TradovateClientDiagnosticPayload {
  schemaVersion: 'tradovate-client-diagnostics-v2';
  pluginVersion: string;
  vaultId: string;
  deviceId?: string;
  jobId?: string;
  operationId: string;
  connectionId?: string;
  syncRunId?: string;
  events: TradovateClientDiagnosticEvent[];
}

export interface TradovateConnectionSyncOutcome {
  connectionId: string;
  status: 'succeeded' | 'partial' | 'failed' | 'cancelled' | 'request_failed';
}

export interface TradovateSyncAllResult {
  outcomes: TradovateConnectionSyncOutcome[];
  projection: TradeProjectionSyncResult;
}

type TradeProjectionStatus =
  | 'missing'
  | 'local_deleted'
  | 'other_vault'
  | 'needs_rewrite'
  | 'synced'
  | 'failed'
  | 'conflict'
  | 'pending';

export interface TradeProjection {
  id: string;
  version: number;
  symbol: string;
  direction: 'long' | 'short';
  status: 'open' | 'partially_closed' | 'closed' | 'cancelled';
  accountName?: string | null;
  accountId?: string | null;
  importId?: string;
  correlationId?: string;
  commitId?: string;
  broker?: string | null;
  importedAt?: string | null;
  projectionStatus: TradeProjectionStatus;
  projectionGeneration?: string;
  previewTrade: TradeImportPreviewTrade;
}

export interface TradeProjectionRequest {
  vaultId: string;
  accountId?: string;
  broker?: string;
  importId?: string;
  from?: string;
  to?: string;
  status?: TradeProjectionStatus;
  includeLocalDeleted?: boolean;
  includeConflict?: boolean;
  limit?: number;
  cursor?: string;
}

export interface TradeProjectionRequestOptions {
  interactiveEntitlement?: boolean;
}

export interface TradeProjectionPersistedTradeSummary {
  filePath: string;
  symbol: string;
  direction: 'long' | 'short';
  quantity: number;
  entryPrice: number;
  profitLoss?: number;
  entryTime: string;
  status: 'OPEN' | 'PARTIALLY_CLOSED' | 'CLOSED' | 'CANCELLED';
}

export interface TradeProjectionResponse {
  schemaVersion: 'trade-projections-missing-v1';
  vaultId: string;
  projections: TradeProjection[];
  nextCursor?: string | null;
}

export interface TradeProjectionAccountVaultMapping {
  vaultId: string;
  localAccountId?: string | null;
  localAccountName?: string | null;
  mappingStatus: 'mapped';
  lastSyncedAt?: string | null;
  updatedAt?: string | null;
}

export interface TradeProjectionAccountInventoryItem {
  accountId: string;
  broker: string;
  displayName: string;
  tradeCount: number;
  missingCount: number;
  localDeletedCount: number;
  failedCount: number;
  needsRewriteCount: number;
  staleCount: number;
  conflictCount: number;
  pendingCount: number;
  syncedCount: number;
  restorableCount: number;
  lastImportedAt?: string | null;
  mapping?: TradeProjectionAccountVaultMapping | null;
}

export interface TradeProjectionAccountInventoryResponse {
  schemaVersion: 'trade-projection-accounts-v1';
  vaultId: string;
  accounts: TradeProjectionAccountInventoryItem[];
}

export interface TradeProjectionAccountVaultMappingRequest {
  vaultId: string;
  localAccountId: string;
  localAccountName: string;
  mappingStatus: 'mapped';
  pluginVersion?: string;
  clientOperationId?: string;
}

export interface TradeProjectionAckRequest {
  vaultId: string;
  deviceId?: string;
  pluginVersion?: string;
  clientOperationId?: string;
  
  diagnosticSyncRunId?: string;
  results: Array<{
    tradeId: string;
    backendTradeVersion: number;
    filePath?: string;
    frontmatterHash?: string;
    localRevision?: string;
    status:
      | 'pending'
      | 'synced'
      | 'failed'
      | 'conflict'
      | 'local_deleted'
      | 'needs_rewrite';
    errorCode?: string;
  }>;
}

export interface TradeProjectionAckClient {
  projectionAck(
    request: TradeProjectionAckRequest,
    options?: TradeProjectionRequestOptions
  ): Promise<void>;
}

export interface TradeProjectionClient extends TradeProjectionAckClient {
  getRestorableProjections(
    request: TradeProjectionRequest,
    options?: TradeProjectionRequestOptions
  ): Promise<TradeProjectionResponse>;
}

export interface TradeProjectionWriteResult {
  writtenCount: number;
  alreadyPresentCount: number;
  failedCount: number;
  pendingCount: number;
  ackFailedCount: number;
  importedTrades: TradeProjectionPersistedTradeSummary[];
  ackResults: TradeProjectionAckRequest['results'];
}

export interface TradeProjectionRestoreInput {
  accountName: string;
  brokerLabel: string;
  projections: TradeProjection[];
  localWriteTimeoutMs?: number;
  ownerUserId?: string;
  requestOptions?: TradeProjectionRequestOptions;
  shouldStop?: () => boolean;
  clientOperation?: TradovateClientOperationContext;
  onComplete?: (result: TradeProjectionRestoreResult) => void;
}

export interface TradeProjectionRestoreResult {
  success: boolean;
  writtenCount: number;
  duplicateCount: number;
  failedCount: number;
  pendingCount: number;
  ackFailedCount: number;
  accountName: string;
  brokerLabel: string;
  importedTrades: TradeProjectionPersistedTradeSummary[];
}

export interface TradeProjectionCommittedTrade {
  id: string;
  version: number;
  projectionGeneration?: string;
  symbol: string;
  direction: 'long' | 'short';
  status:
    | 'open'
    | 'partially_closed'
    | 'closed'
    | 'cancelled'
    | 'OPEN'
    | 'PARTIALLY_CLOSED'
    | 'CLOSED'
    | 'CANCELLED';
  accountId?: string | null;
  accountDisplayName?: string | null;
  broker?: string | null;
  importId?: string;
  previewTrade?: TradeImportPreviewTrade;
}

export interface TradeProjectionSyncResult {
  accountCount: number;
  writtenCount: number;
  failedCount: number;
  pendingCount: number;
  partial?: boolean;
}
