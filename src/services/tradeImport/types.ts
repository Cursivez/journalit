import type { TradeData } from '../trade/TradeService';

export type TradeImportFileType = 'csv' | 'xlsx' | 'xls' | 'html';
export type TradeImportManualMode = 'price_based' | 'direct_pnl';

export interface TradeImportCapabilities {
  apiVersion: string;
  schemaVersion: 'trade-import-capabilities-v1';
  fileLimits: {
    maxFileBytes: number;
    maxRows: number;
    maxColumns: number;
    maxCells: number;
    sampleRowLimit: number;
  };
  fileTypes: Array<{
    id: TradeImportFileType;
    extensions: string[];
    mimeTypes: string[];
  }>;
  brokers: Array<{
    id: string;
    label: string;
    adapterVersion: string;
    supportedFileTypes: TradeImportFileType[];
    supportsAnalyse: boolean;
    supportsManualMapping: boolean;
    supportsAiMapping: boolean;
  }>;
  manualMapping: {
    supported: boolean;
    mappingVersion: number;
    modes: TradeImportManualMode[];
  };
  diagnosticVersion: string;
}

export interface TradeImportDiagnostic {
  severity?: 'info' | 'warning' | 'error';
  kind?: string;
  code: string;
  message: string;
  row?: number;
  field?: string;
  count?: number;
}
export interface TradeImportAnalyseRequest {
  schemaVersion: 'trade-import-analyse-request-v1';
  pluginVersion: string;
  requestedBroker: string;
  requestedFileType: TradeImportFileType;
  sheetName?: string | null;
  headerRowIndex?: number | null;
  timeZone: string;
  sampleRowLimit: number;
  aiMapping: { enabled: boolean; mode: 'manual_requested' | 'auto' };
  customFields?: TradeImportCustomFieldDefinition[];
}
export interface TradeImportAnalyseResponse {
  schemaVersion: 'trade-import-analyse-v1';
  importId: string;
  fileType: TradeImportFileType;
  sheets: Array<{
    name: string;
    rowCountBucket: string;
    columnCount: number;
    category: string;
  }>;
  selectedSheet?: string;
  suggestedSheet?: string;
  headers: string[];
  sampleRows: string[][];
  suggestedHeaderRowIndex?: number;
  brokerCandidates: Array<{
    broker: string;
    confidence: number;
    reasons: string[];
  }>;
  suggestedColumnAssignments?: Record<
    string,
    { tradeField: string; confidence: number; reasoning: string }
  >;
  suggestedColumnMappings?: Record<string, string[]>;
  diagnostics: TradeImportDiagnostic[];
}

interface TradeImportExecution {
  time: string;
  price: number;
  size: number;
}
export interface TradeImportPreviewTrade {
  sourceRows: number[];
  symbol: string;
  direction: 'long' | 'short';
  entryTime: string;
  entryPrice: number;
  quantity: number;
  exitTime?: string | null;
  exitPrice?: number | null;
  status: 'OPEN' | 'CLOSED';
  closeOnly: boolean;
  useDirectPnLInput: boolean;
  directPnL?: number | null;
  profitLoss?: number | null;
  commission?: number | null;
  fees?: number | null;
  swap?: number | null;
  assetType?: string | null;
  orderId?: string | null;
  accountId?: string | null;
  currency?: string | null;
  brokerBaseCurrencyPnl?: number | null;
  brokerBaseCurrency?: string | null;
  brokerBaseCurrencyPnlSource?: string | null;
  notes?: string | null;
  thesis?: string | null;
  entries?: TradeImportExecution[];
  exits?: TradeImportExecution[];
  executionLedgerVersion?: number | null;
  executionIds: string[];
  tags: string[];
  images: string[];
  setupIds: string[];
  mistake: string[];
  customFields: Record<string, unknown>;
  strikePrice?: number | null;
  expirationDate?: string | null;
  optionType?: string | null;
  contractSize?: number | null;
  dollarPerPoint?: number | null;
  tickSize?: number | null;
  tickValue?: number | null;
  lotSize?: number | null;
  pipValue?: number | null;
  pipSize?: number | null;
}

export type TradeImportPreviewClassification =
  | 'new'
  | 'exact_duplicate'
  | 'already_applied'
  | 'update_existing'
  | 'partial_update_existing'
  | 'likely_duplicate'
  | 'conflict'
  | 'failed_invalid_trade'
  | 'failed_no_open_match'
  | 'failed_multiple_open_matches'
  | 'failed_quantity_mismatch'
  | 'duplicate_in_import';

export type TradeImportDefaultAction =
  | 'create'
  | 'update'
  | 'skip'
  | 'manual_review'
  | 'blocked';

interface TradeImportIdentityCandidate {
  entityType?: string;
  idType: string;
  value?: string;
  hash?: string;
  strength?: string;
  cardinality?: string;
  scope?: string;
  source?: string;
}

export interface TradeImportPreviewItem {
  itemId: string;
  itemIndex?: number;
  classification: TradeImportPreviewClassification;
  defaultAction: TradeImportDefaultAction;
  matchedTradeId?: string | null;
  decisionReasons: Array<{ code: string; message?: string }>;
  identityCandidates: TradeImportIdentityCandidate[];
  previewTrade: TradeImportPreviewTrade;
}
export interface TradeImportPreviewRequest {
  schemaVersion: 'trade-import-preview-request-v1';
  pluginVersion: string;
  broker: string;
  fileType: TradeImportFileType;
  sheetName?: string | null;
  headerRowIndex?: number | null;
  timeZone: string;
  accountName: string;
  assetType: string;
  dateFormat?: string;
  manualMode?: TradeImportManualMode;
  mappingVersion: number;
  columnMappings: Record<string, string[]>;
  customFields: TradeImportCustomFieldDefinition[];
}

export interface TradeImportCustomFieldDefinition {
  id: string;
  fieldKey: string;
  label: string;
  type: string;
  options?: Array<{ value: string; label: string }>;
  savedOptions?: string[];
  allowCreateOptions?: boolean;
  validation?: { required?: boolean };
}

export interface TradeImportPreviewResponse {
  importId: string;
  correlationId: string;
  previewRevision: number;
  previewExpiresAt?: string;
  schemaVersion: 'trade-import-preview-v1';
  broker: string;
  adapterVersion: string;
  fileType: TradeImportFileType;
  summary: {
    sourceRowCount: number;
    previewTradeCount: number;
    duplicateInFileCount: number;
    failedRowCount: number;
    skippedIncompleteCount: number;
  };
  items: TradeImportPreviewItem[];
  diagnostics: TradeImportDiagnostic[];
}
export interface ClassifiedPreviewTrade {
  itemId: string;
  preview: TradeImportPreviewTrade;
  tradeData: TradeData;
  classification: TradeImportPreviewClassification;
  defaultAction: TradeImportDefaultAction;
  matchedTradeId?: string | null;
  existingPath?: string;
  message?: string;
}

export interface TradeImportCommitRequest {
  correlationId: string;
  previewRevision: number;
  clientCommitId: string;
  items: Array<{
    itemId: string;
    action: 'accept_default' | 'skip' | 'create_new' | 'update_existing';
    targetTradeId?: string;
  }>;
}

export interface TradeImportCommittedTrade {
  id: string;
  version: number;
  symbol: string;
  direction: 'long' | 'short';
  status: 'open' | 'closed' | 'OPEN' | 'CLOSED';
  accountId?: string | null;
  accountDisplayName?: string | null;
  broker?: string | null;
  importId: string;
  previewTrade?: TradeImportPreviewTrade;
}

type TradeImportProjectionStatus =
  | 'missing'
  | 'local_deleted'
  | 'other_vault'
  | 'needs_rewrite'
  | 'synced'
  | 'failed'
  | 'conflict'
  | 'pending';

export interface TradeImportRestorableProjection {
  id: string;
  version: number;
  symbol: string;
  direction: 'long' | 'short';
  status: 'open' | 'closed' | 'OPEN' | 'CLOSED';
  accountName?: string | null;
  accountId?: string | null;
  importId: string;
  correlationId?: string;
  commitId?: string;
  broker?: string | null;
  importedAt?: string | null;
  projectionStatus: TradeImportProjectionStatus;
  previewTrade: TradeImportPreviewTrade;
}

export interface TradeImportRestorableProjectionRequest {
  vaultId: string;
  accountId?: string;
  broker?: string;
  importId?: string;
  from?: string;
  to?: string;
  status?: TradeImportProjectionStatus;
  limit?: number;
  cursor?: string;
}

export interface TradeImportRestorableProjectionResponse {
  schemaVersion: 'trade-import-restorable-projections-v1';
  vaultId: string;
  projections: TradeImportRestorableProjection[];
  nextCursor?: string | null;
}

export interface TradeImportAccountVaultMapping {
  vaultId: string;
  localAccountId?: string | null;
  localAccountName?: string | null;
  mappingStatus: 'mapped';
  lastSyncedAt?: string | null;
  updatedAt?: string | null;
}

export interface TradeImportAccountInventoryItem {
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
  mapping?: TradeImportAccountVaultMapping | null;
}

export interface TradeImportAccountInventoryResponse {
  schemaVersion: 'trade-import-accounts-v1';
  vaultId: string;
  accounts: TradeImportAccountInventoryItem[];
}

export interface TradeImportAccountVaultMappingRequest {
  vaultId: string;
  localAccountId: string;
  localAccountName: string;
  mappingStatus: 'mapped';
}

export interface TradeImportCommitResponse {
  commitId: string;
  importId: string;
  correlationId: string;
  status: string;
  itemResults: Array<{
    itemId: string;
    result:
      | 'created'
      | 'updated'
      | 'skipped'
      | 'skipped_user'
      | 'skipped_duplicate'
      | 'blocked'
      | 'conflict';
    tradeId?: string;
    tradeVersion?: number;
    errorCode?: string;
    errorMessage?: string;
  }>;
  trades: TradeImportCommittedTrade[];
}

export interface TradeImportProjectionAckRequest {
  correlationId: string;
  importId: string;
  commitId: string;
  vaultId: string;
  deviceId?: string;
  results: Array<{
    tradeId: string;
    backendTradeVersion: number;
    filePath?: string;
    frontmatterHash?: string;
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
