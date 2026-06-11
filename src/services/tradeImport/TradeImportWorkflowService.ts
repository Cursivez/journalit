import { t } from '../../lang/helpers';
import type JournalitPlugin from '../../main';
import type { TradeData } from '../trade/TradeService';
import { classifyPreviewTrades } from './localDuplicateDetector';
import type {
  ClassifiedPreviewTrade,
  TradeImportAnalyseResponse,
  TradeImportCapabilities,
  TradeImportCustomFieldDefinition,
  TradeImportExistingOpenTrade,
  TradeImportFileType,
  TradeImportManualMode,
  TradeImportPreviewResponse,
} from './types';
import { BackendTradeImportService } from './BackendTradeImportService';

export class TradeImportValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TradeImportValidationError';
  }
}

interface TradeImportBrokerCapabilities {
  id: string;
  supportedFileTypes: TradeImportFileType[];
  supportsAiMapping: boolean;
}

interface TradeImportAnalyseInput {
  file: File;
  capabilities: TradeImportCapabilities;
  brokerCapabilities?: TradeImportBrokerCapabilities;
  broker: string;
  sheetName: string | null;
  headerRowIndex: number | null;
  aiMappingEnabled: boolean;
}

interface TradeImportPreviewInput {
  file: File;
  capabilities: TradeImportCapabilities;
  brokerCapabilities?: TradeImportBrokerCapabilities;
  analyse: TradeImportAnalyseResponse;
  broker: string;
  sheetName: string | null;
  headerRowIndex: number | null;
  accountName: string;
  assetType: string;
  manualMode: TradeImportManualMode;
  dateFormat: string;
  columnMappings: Record<string, string[]>;
}

export interface TradeImportPersistedTradeSummary {
  filePath: string;
  symbol: string;
  direction: 'long' | 'short';
  quantity: number;
  entryPrice: number;
  profitLoss?: number;
  entryTime: string;
  status: 'OPEN' | 'CLOSED';
}

export interface TradeImportCompletionResult {
  success: boolean;
  writtenCount: number;
  duplicateCount: number;
  failedCount: number;
  accountName: string;
  brokerLabel: string;
  importedTrades: TradeImportPersistedTradeSummary[];
}

interface TradeImportWriteInput {
  preview: TradeImportPreviewResponse;
  classified: ClassifiedPreviewTrade[];
  accountName: string;
  brokerLabel: string;
  localWriteTimeoutMs: number;
  onComplete?: (result: TradeImportCompletionResult) => void;
}

function pluginVersion(plugin: JournalitPlugin): string {
  return plugin.manifest.version;
}

function timeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
}

function fileTypeFor(file: File): TradeImportFileType {
  const ext = file.name.split('.').pop()?.toLowerCase();
  if (ext === 'xlsx') return 'xlsx';
  if (ext === 'xls') return 'xls';
  if (ext === 'html' || ext === 'htm') return 'html';
  return 'csv';
}

function validateSelectedFile(
  file: File,
  capabilities: TradeImportCapabilities,
  brokerCapabilities?: TradeImportBrokerCapabilities
): string | null {
  if (file.size > capabilities.fileLimits.maxFileBytes) {
    return t('trade-import.error.file-too-large');
  }
  const fileType = fileTypeFor(file);
  const supportedFileType = capabilities.fileTypes.find(
    (type) => type.id === fileType
  );
  const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
  if (!supportedFileType?.extensions.includes(extension)) {
    return t('trade-import.error.file-type-unsupported');
  }
  if (
    brokerCapabilities &&
    !brokerCapabilities.supportedFileTypes.includes(fileType)
  ) {
    return t('trade-import.error.broker-file-type-unsupported');
  }
  return null;
}

function asMappings(value: unknown): Record<string, string[]> {
  if (!value || typeof value !== 'object') return {};
  const mappings: Record<string, string[]> = {};
  for (const [key, columns] of Object.entries(value)) {
    if (Array.isArray(columns)) {
      mappings[key] = columns.map(String).filter(Boolean);
      continue;
    }
    if (typeof columns === 'string' && columns.trim()) {
      mappings[key] = [columns.trim()];
    }
  }
  return mappings;
}

function normalizeMappingToken(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function applyCustomFieldMappingSuggestions(
  suggestedMappings: Record<string, string[]> | undefined,
  headers: string[],
  customFields: TradeImportCustomFieldDefinition[]
): Record<string, string[]> {
  const mappings = asMappings(suggestedMappings);
  const customFieldByHeaderToken = new Map<string, string>();

  for (const customField of customFields) {
    const fieldKey = customField.fieldKey || customField.id;
    if (!fieldKey) continue;
    const mappingKey = `custom:${fieldKey}`;
    for (const token of [
      customField.label,
      customField.fieldKey,
      customField.id,
    ]) {
      if (!token) continue;
      customFieldByHeaderToken.set(normalizeMappingToken(token), mappingKey);
    }
  }

  for (const header of headers) {
    const customMappingKey = customFieldByHeaderToken.get(
      normalizeMappingToken(header)
    );
    if (!customMappingKey) continue;
    for (const [field, columns] of Object.entries(mappings)) {
      mappings[field] = columns.filter((column) => column !== header);
      if (mappings[field].length === 0) delete mappings[field];
    }
    mappings[customMappingKey] = [
      ...(mappings[customMappingKey] ?? []).filter(
        (column) => column !== header
      ),
      header,
    ];
  }

  return mappings;
}

export function customFieldDefinitions(
  plugin: JournalitPlugin
): TradeImportCustomFieldDefinition[] {
  const customFieldsService = plugin.customFieldsService;
  if (!customFieldsService) return [];
  return customFieldsService.getFields().map((field) => ({
    id: field.id,
    fieldKey: field.fieldKey,
    label: field.label,
    type: field.type,
    options: field.options,
    savedOptions: customFieldsService.getFieldOptions(field.id),
    allowCreateOptions: field.allowCreateOptions,
    validation: field.validation,
  }));
}

const toBackendExecution = (execution: {
  time: Date | string;
  price: number;
  size: number;
}) => ({
  time:
    execution.time instanceof Date
      ? execution.time.toISOString()
      : new Date(execution.time).toISOString(),
  price: execution.price,
  size: execution.size,
});

function remainingOpenQuantity(trade: TradeData): number {
  const entrySize = (trade.entries ?? []).reduce(
    (sum, entry) => sum + Math.abs(entry.size),
    0
  );
  if (entrySize === 0) return trade.positionSize;
  const exitSize = (trade.exits ?? []).reduce(
    (sum, exit) => sum + Math.abs(exit.size),
    0
  );
  const remaining = entrySize - exitSize;
  return remaining > 0 ? remaining : trade.positionSize;
}

function executionSize(
  executions: Array<{ size: number }> | undefined
): number {
  return (executions ?? []).reduce(
    (sum, execution) => sum + Math.abs(execution.size),
    0
  );
}

async function existingOpenTrades(
  plugin: JournalitPlugin,
  accountName: string,
  broker: string
): Promise<TradeImportExistingOpenTrade[]> {
  if (broker !== 'IBKR') return [];

  await plugin.tradeService.waitForTradeDataReady?.();
  const trades = (await plugin.tradeService.getTradeData()) as TradeData[];
  return trades
    .filter(
      (trade) =>
        trade.tradeStatus === 'OPEN' &&
        trade.account?.includes(accountName) &&
        trade.instrument &&
        trade.entryTime instanceof Date
    )
    .map((trade) => ({
      sourceRows: Array.isArray(trade.sourceRows)
        ? trade.sourceRows.map(Number).filter(Number.isFinite)
        : [],
      symbol: String(trade.instrument),
      direction: String(trade.direction),
      entryTime: trade.entryTime.toISOString(),
      entryPrice: trade.entryPrice,
      quantity: remainingOpenQuantity(trade),
      exitTime:
        trade.exitTime instanceof Date ? trade.exitTime.toISOString() : null,
      exitPrice:
        typeof trade.exitPrice === 'number' && Number.isFinite(trade.exitPrice)
          ? trade.exitPrice
          : null,
      status: 'OPEN' as const,
      closeOnly: false,
      commission: trade.commission ?? null,
      assetType: trade.assetType ?? null,
      currency: trade.currency ?? null,
      brokerBaseCurrencyPnl: trade.brokerBaseCurrencyPnl ?? null,
      brokerBaseCurrency: trade.brokerBaseCurrency ?? null,
      brokerBaseCurrencyPnlSource: trade.brokerBaseCurrencyPnlSource ?? null,
      entries: (trade.entries ?? []).map(toBackendExecution),
      exits: (trade.exits ?? []).map(toBackendExecution),
      executionLedgerVersion: trade.executionLedgerVersion,
      executionIds: trade.executionIds,
      strikePrice: trade.strikePrice ?? null,
      expirationDate:
        trade.expirationDate instanceof Date
          ? trade.expirationDate.toISOString()
          : null,
      optionType: trade.optionType ?? null,
      contractSize: trade.contractSize ?? null,
    }));
}

async function hasPersistedPreviewTrade(
  plugin: JournalitPlugin,
  item: ClassifiedPreviewTrade
): Promise<boolean> {
  const trades = (await plugin.tradeService.getTradeData()) as TradeData[];
  const identityValues = new Set([
    item.preview.csvImportId,
    ...item.preview.legacyCsvImportIds,
  ]);

  return trades.some((trade) => {
    if (
      typeof trade.csvImportId === 'string' &&
      identityValues.has(trade.csvImportId)
    ) {
      return true;
    }

    const legacyIds = Array.isArray(trade.legacyCsvImportIds)
      ? trade.legacyCsvImportIds.map(String)
      : [];
    if (legacyIds.some((id) => identityValues.has(id))) {
      return true;
    }

    return (
      !!item.preview.executionLedgerVersion &&
      trade.executionLedgerVersion === item.preview.executionLedgerVersion &&
      item.preview.executionIds.length > 0 &&
      item.preview.executionIds.every((id) => trade.executionIds?.includes(id))
    );
  });
}

async function mergePreviewWithExistingTrade(
  plugin: JournalitPlugin,
  existingPath: string,
  preview: TradeImportPreviewResponse['trades'][number],
  previewTradeData: TradeData
): Promise<TradeData> {
  await plugin.tradeService.waitForTradeDataReady?.();
  const trades = (await plugin.tradeService.getTradeData()) as TradeData[];
  const existing = trades.find(
    (trade) => typeof trade.path === 'string' && trade.path === existingPath
  );
  if (!existing) return previewTradeData;

  const unionStrings = (left?: string[], right?: string[]): string[] =>
    Array.from(new Set([...(left ?? []), ...(right ?? [])]));
  const unionNumbers = (left?: number[], right?: number[]): number[] =>
    Array.from(new Set([...(left ?? []), ...(right ?? [])]));
  const sumOptional = (left?: number, right?: number): number | undefined => {
    if (left === undefined && right === undefined) return undefined;
    return (left ?? 0) + (right ?? 0);
  };
  const existingLegacyIds = Array.isArray(existing.legacyCsvImportIds)
    ? existing.legacyCsvImportIds.map(String)
    : [];
  const previewLegacyIds = Array.isArray(previewTradeData.legacyCsvImportIds)
    ? previewTradeData.legacyCsvImportIds.map(String)
    : [];
  const existingSourceRows = Array.isArray(existing.sourceRows)
    ? existing.sourceRows.map(Number).filter(Number.isFinite)
    : [];
  const previewSourceRows = Array.isArray(previewTradeData.sourceRows)
    ? previewTradeData.sourceRows.map(Number).filter(Number.isFinite)
    : [];
  const preservedLocalFields = {
    notes: existing.notes,
    thesis: existing.thesis,
    images: existing.images,
    tags: existing.tags,
    customTags: existing.customTags,
    setupIds: existing.setupIds,
    setup: existing.setup,
    mistake: existing.mistake,
    customFields: existing.customFields,
    lossReview: existing.lossReview,
    reviewed: existing.reviewed,
    reviewedAt: existing.reviewedAt,
  };
  const mergedCsvImportId =
    previewTradeData.csvImportId ?? existing.csvImportId;
  const legacyIdsToPreserve: string[] =
    existing.csvImportId && existing.csvImportId !== mergedCsvImportId
      ? [String(existing.csvImportId)]
      : [];
  const mergedIdentityFields = {
    csvImportId: mergedCsvImportId,
    orderId: previewTradeData.orderId ?? existing.orderId,
    legacyCsvImportIds: unionStrings(
      unionStrings(existingLegacyIds, previewLegacyIds),
      legacyIdsToPreserve
    ),
    sourceRows: unionNumbers(existingSourceRows, previewSourceRows),
    executionLedgerVersion:
      previewTradeData.executionLedgerVersion ??
      existing.executionLedgerVersion,
    executionIds: unionStrings(
      existing.executionIds,
      previewTradeData.executionIds
    ),
  };

  if (preview.closeOnly) {
    const remainingBeforeClose = remainingOpenQuantity(existing);
    const closeSize = executionSize(previewTradeData.exits);
    if (closeSize > remainingBeforeClose) {
      throw new Error('Close-only preview exceeds remaining open quantity');
    }
    const remainsOpen = closeSize > 0 && closeSize < remainingBeforeClose;
    const mergedAuthoritativePnl = sumOptional(
      existing.authoritativePnl,
      previewTradeData.authoritativePnl
    );
    const mergedDirectPnL = sumOptional(
      existing.directPnL,
      previewTradeData.useDirectPnLInput
        ? previewTradeData.directPnL
        : undefined
    );
    const useDirectPnLInput = Boolean(
      existing.useDirectPnLInput || previewTradeData.useDirectPnLInput
    );
    return {
      ...existing,
      ...previewTradeData,
      ...mergedIdentityFields,
      tradeStatus: remainsOpen ? 'OPEN' : previewTradeData.tradeStatus,
      entryTime: existing.entryTime,
      entryPrice: existing.entryPrice,
      positionSize: existing.positionSize,
      entries: existing.entries,
      exits: [...(existing.exits ?? []), ...(previewTradeData.exits ?? [])],
      exitTime: remainsOpen ? existing.exitTime : previewTradeData.exitTime,
      exitPrice: remainsOpen ? existing.exitPrice : previewTradeData.exitPrice,
      hasExplicitExitPrice: remainsOpen
        ? existing.hasExplicitExitPrice
        : previewTradeData.hasExplicitExitPrice,
      authoritativePnl: mergedAuthoritativePnl,
      originalPnl: existing.originalPnl,
      useDirectPnLInput,
      directPnL: useDirectPnLInput ? mergedDirectPnL : existing.directPnL,
      commission: sumOptional(existing.commission, previewTradeData.commission),
      fees: sumOptional(existing.fees, previewTradeData.fees),
      swap: sumOptional(existing.swap, previewTradeData.swap),
      rebate: sumOptional(existing.rebate, previewTradeData.rebate),
      brokerBaseCurrencyPnl: sumOptional(
        existing.brokerBaseCurrencyPnl,
        previewTradeData.brokerBaseCurrencyPnl
      ),
      brokerBaseCurrency:
        previewTradeData.brokerBaseCurrency ?? existing.brokerBaseCurrency,
      brokerBaseCurrencyPnlSource:
        previewTradeData.brokerBaseCurrencyPnlSource ??
        existing.brokerBaseCurrencyPnlSource,
      ...preservedLocalFields,
    };
  }

  return {
    ...existing,
    ...previewTradeData,
    ...mergedIdentityFields,
    ...preservedLocalFields,
  };
}

function timeoutAfter(ms: number): Promise<never> {
  return new Promise((_, reject) => {
    window.setTimeout(() => reject(new Error('Timed out')), ms);
  });
}

export class TradeImportWorkflowService {
  constructor(
    private plugin: JournalitPlugin,
    private backendService: BackendTradeImportService
  ) {}

  async analyseFile({
    file,
    capabilities,
    brokerCapabilities,
    broker,
    sheetName,
    headerRowIndex,
    aiMappingEnabled,
  }: TradeImportAnalyseInput): Promise<{
    response: TradeImportAnalyseResponse;
    suggestedColumnMappings: Record<string, string[]>;
  }> {
    const validationError = validateSelectedFile(
      file,
      capabilities,
      brokerCapabilities
    );
    if (validationError) throw new TradeImportValidationError(validationError);

    const customFields = customFieldDefinitions(this.plugin);
    const response = await this.backendService.analyse(file, {
      schemaVersion: 'trade-import-analyse-request-v1',
      pluginVersion: pluginVersion(this.plugin),
      requestedBroker: broker,
      requestedFileType: fileTypeFor(file),
      sheetName,
      headerRowIndex,
      timeZone: timeZone(),
      sampleRowLimit: capabilities.fileLimits.sampleRowLimit,
      aiMapping: {
        enabled: aiMappingEnabled && !!brokerCapabilities?.supportsAiMapping,
        mode: aiMappingEnabled ? 'auto' : 'manual_requested',
      },
      customFields,
    });

    return {
      response,
      suggestedColumnMappings: applyCustomFieldMappingSuggestions(
        response.suggestedColumnMappings,
        response.headers,
        customFields
      ),
    };
  }

  async previewFile({
    file,
    capabilities,
    brokerCapabilities,
    analyse: _analyse,
    broker,
    sheetName,
    headerRowIndex,
    accountName,
    assetType,
    manualMode,
    dateFormat,
    columnMappings,
  }: TradeImportPreviewInput): Promise<{
    response: TradeImportPreviewResponse;
    classifiedTrades: ClassifiedPreviewTrade[];
  }> {
    const validationError = validateSelectedFile(
      file,
      capabilities,
      brokerCapabilities
    );
    if (validationError) throw new TradeImportValidationError(validationError);

    const openTradesForPreview = await existingOpenTrades(
      this.plugin,
      accountName,
      broker
    );
    const response = await this.backendService.preview(file, {
      schemaVersion: 'trade-import-preview-request-v1',
      pluginVersion: pluginVersion(this.plugin),
      broker,
      fileType: fileTypeFor(file),
      sheetName,
      headerRowIndex,
      timeZone: timeZone(),
      accountName,
      assetType,
      manualMode,
      dateFormat,
      mappingVersion: capabilities.manualMapping.mappingVersion,
      columnMappings,
      customFields: customFieldDefinitions(this.plugin),
      existingOpenTrades: openTradesForPreview,
    });
    const classifiedTrades = await classifyPreviewTrades(
      this.plugin,
      response.trades,
      accountName
    );
    return { response, classifiedTrades };
  }

  async writePreview({
    classified,
    accountName,
    brokerLabel,
    localWriteTimeoutMs,
    onComplete,
  }: TradeImportWriteInput): Promise<TradeImportCompletionResult> {
    let finalized = false;
    let written = 0;
    let failed = 0;
    const importedTrades: TradeImportPersistedTradeSummary[] = [];

    const buildResult = (
      writtenCount: number,
      duplicateCount: number,
      failedCount: number
    ): TradeImportCompletionResult => ({
      success: failedCount === 0,
      writtenCount,
      duplicateCount,
      failedCount,
      accountName,
      brokerLabel,
      importedTrades,
    });

    const finalizeImport = (
      writtenCount: number,
      duplicateCount: number,
      failedCount: number
    ): TradeImportCompletionResult | null => {
      if (finalized) return null;
      finalized = true;
      const result = buildResult(writtenCount, duplicateCount, failedCount);
      onComplete?.(result);
      return result;
    };

    for (const item of classified) {
      if (
        item.classification === 'duplicate' ||
        item.classification === 'failed'
      ) {
        continue;
      }
      try {
        if (item.classification === 'update_existing' && item.existingPath) {
          const mergedTradeData = await mergePreviewWithExistingTrade(
            this.plugin,
            item.existingPath,
            item.preview,
            item.tradeData
          );
          await Promise.race([
            this.plugin.tradeService.updateTrade(
              mergedTradeData,
              item.existingPath,
              'trade-import'
            ),
            timeoutAfter(localWriteTimeoutMs),
          ]);
          importedTrades.push({
            filePath: item.existingPath,
            symbol: item.preview.symbol,
            direction: item.preview.direction,
            quantity: item.preview.quantity,
            entryPrice: item.preview.entryPrice,
            profitLoss: item.preview.profitLoss ?? undefined,
            entryTime: item.preview.entryTime,
            status: item.preview.status,
          });
        } else {
          const filePath = await Promise.race([
            this.plugin.tradeService.createTrade(item.tradeData, {
              suppressAutoOpen: true,
              suppressPostCreateTasks: true,
            }),
            timeoutAfter(localWriteTimeoutMs),
          ]);
          importedTrades.push({
            filePath,
            symbol: item.preview.symbol,
            direction: item.preview.direction,
            quantity: item.preview.quantity,
            entryPrice: item.preview.entryPrice,
            profitLoss: item.preview.profitLoss ?? undefined,
            entryTime: item.preview.entryTime,
            status: item.preview.status,
          });
        }
        written++;
      } catch (_error) {
        if (await hasPersistedPreviewTrade(this.plugin, item)) {
          written++;
        } else {
          failed++;
        }
      }
    }

    const duplicateCount = classified.filter(
      (item) => item.classification === 'duplicate'
    ).length;
    const failedClassifications = classified.filter(
      (item) => item.classification === 'failed'
    ).length;
    return (
      finalizeImport(written, duplicateCount, failed + failedClassifications) ??
      buildResult(written, duplicateCount, failed + failedClassifications)
    );
  }
}
