import type { TradeData } from '../trade/TradeService';

export type TradeImportFileType = 'csv' | 'xlsx' | 'xls' | 'html';
export type TradeImportManualMode =
  | 'price_based'
  | 'direct_pnl'
  | 'trade_per_row';

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
    supportsExportTimeZone: boolean;
  }>;
  manualMapping: {
    supported: boolean;
    mappingVersion: number;
    modes: TradeImportManualMode[];
  };
  freePreviewLimits?: {
    requestsPerHour: number;
    diagnosticRetentionMinutes: number;
    storedPreviewRetentionHours: number;
    maxStoredPreviewItems: number;
  };
  diagnosticVersion: string;
}

export interface TradeImportDiagnostic {
  severity?: 'info' | 'warning' | 'error';
  kind?: string;
  code: string;
  message: string;
  row?: number;
  
  sheetRow?: number;
  field?: string;
  count?: number;
  
  example?: string;
  
  candidateFormats?: string[];
  
  missingColumns?: string[];
}

export const UNSUPPORTED_TRADOVATE_PERFORMANCE_REPORT_DIAGNOSTIC_CODE =
  'unsupported-tradovate-performance-report';
export const UNSUPPORTED_METATRADER_STATEMENT_DIAGNOSTIC_CODE =
  'unsupported-metatrader-statement';
export const MISSING_COLUMN_DIAGNOSTIC_CODE = 'missing-column';
export const BYBIT_HEADER_MISMATCH_DIAGNOSTIC_CODE = 'bybit-header-mismatch';
export const UNSUPPORTED_RITHMIC_ORDER_HISTORY_DIAGNOSTIC_CODE =
  'unsupported-rithmic-order-history';
export interface TradeImportAnalyseRequest {
  schemaVersion: 'trade-import-analyse-request-v1';
  pluginVersion: string;
  requestedBroker: string;
  requestedFileType: TradeImportFileType;
  sheetName?: string | null;
  headerRowIndex?: number | null;
  
  headerSheetRow?: number;
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
  
  headerRowIndex?: number;
  
  headerSheetRow?: number;
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

export interface TradeImportEmbeddedImage {
  path: string;
  row: number;
  column?: string;
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
  status: 'OPEN' | 'PARTIALLY_CLOSED' | 'CLOSED' | 'CANCELLED';
  openQuantity?: number;
  closedQuantity?: number;
  closeOnly: boolean;
  useDirectPnLInput: boolean;
  directPnL?: number | null;
  profitLoss?: number | null;
  grossProfitLoss?: number | null;
  commission?: number | null;
  fees?: number | null;
  swap?: number | null;
  assetType?: string | null;
  exchange?: string | null;
  underlyingSymbol?: string | null;
  brokerContract?: string | null;
  orderId?: string | null;
  accountId?: string | null;
  currency?: string | null;
  brokerBaseCurrencyPnl?: number | null;
  brokerBaseCurrency?: string | null;
  brokerBaseCurrencyPnlSource?: string | null;
  brokerComment?: string | null;
  notes?: string | null;
  thesis?: string | null;
  entries?: TradeImportExecution[];
  exits?: TradeImportExecution[];
  executionLedgerVersion?: number | null;
  executionIds: string[];
  tags: string[];
  images: string[];
  
  embeddedImages?: TradeImportEmbeddedImage[];
  setup: string[];
  mistake: string[];
  customFields: Record<string, unknown>;
  strikePrice?: number | null;
  expirationDate?: string | null;
  optionType?: string | null;
  contractSize?: number | null;
  dollarPerPoint?: number | null;
  tickSize?: number | null;
  lastBrokerSyncAt?: string | null;
  tickValue?: number | null;
  lotSize?: number | null;
  pipValue?: number | null;
  pipSize?: number | null;
  currencyPair?: string | null;
  tradingPair?: string | null;
  cryptoExchange?: string | null;
  leverageRatio?: number | null;
}

export type TradeImportPreviewClassification =
  | 'new'
  | 'exact_duplicate'
  | 'already_applied'
  | 'exists_in_other_account'
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

export type TradeImportPreviewOutcome =
  | 'completed'
  | 'partially_completed'
  | 'failed';

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


export interface TradeImportOtherAccountMatch {
  accountId: string;
  accountDisplayName: string;
}

export interface TradeImportPreviewItem {
  itemId: string;
  itemIndex?: number;
  classification: TradeImportPreviewClassification;
  defaultAction: TradeImportDefaultAction;
  matchedTradeId?: string | null;
  otherAccount?: TradeImportOtherAccountMatch;
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
  outcome: TradeImportPreviewOutcome;
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
  otherAccount?: TradeImportOtherAccountMatch;
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

interface TradeImportCommittedTrade {
  id: string;
  version: number;
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
  accountIdentity?: 'broker' | 'name';
  accountDisplayName?: string | null;
  broker?: string | null;
  importId: string;
  previewTrade?: TradeImportPreviewTrade;
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
