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

export interface TradeImportExecution {
  time: string;
  price: number;
  size: number;
}
export interface TradeImportPreviewTrade {
  csvImportId: string;
  legacyCsvImportIds: string[];
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
  existingOpenTrades: TradeImportExistingOpenTrade[];
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

export interface TradeImportExistingOpenTrade {
  sourceRows: number[];
  symbol: string;
  direction: string;
  entryTime: string;
  entryPrice: number;
  quantity: number;
  exitTime?: string | null;
  exitPrice?: number | null;
  status: 'OPEN' | 'CLOSED';
  closeOnly: boolean;
  commission?: number | null;
  assetType?: string | null;
  currency?: string | null;
  brokerBaseCurrencyPnl?: number | null;
  brokerBaseCurrency?: string | null;
  brokerBaseCurrencyPnlSource?: string | null;
  entries: TradeImportExecution[];
  exits: TradeImportExecution[];
  executionLedgerVersion?: number;
  executionIds?: string[];
  strikePrice?: number | null;
  expirationDate?: string | null;
  optionType?: string | null;
  contractSize?: number | null;
}

export interface TradeImportPreviewResponse {
  importId: string;
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
  trades: TradeImportPreviewTrade[];
  diagnostics: TradeImportDiagnostic[];
}
export interface ClassifiedPreviewTrade {
  preview: TradeImportPreviewTrade;
  tradeData: TradeData;
  classification: 'new' | 'duplicate' | 'update_existing' | 'failed';
  existingPath?: string;
  message?: string;
}
