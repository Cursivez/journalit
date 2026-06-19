import { t } from '../../lang/helpers';
import type JournalitPlugin from '../../main';
import type { TradeData } from '../trade/TradeService';
import { generateUUID } from '../../utils/uuid';
import { mapPreviewTradeToTradeData } from './canonicalTradeMapper';
import {
  isTradeImportCommitEligible,
  isTradeImportSkipped,
} from './commitEligibility';
import type {
  ClassifiedPreviewTrade,
  TradeImportAnalyseResponse,
  TradeImportCapabilities,
  TradeImportCustomFieldDefinition,
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

function timeoutAfter(ms: number): Promise<never> {
  return new Promise((_, reject) => {
    window.setTimeout(
      () => reject(new Error('Trade Import local write timed out')),
      ms
    );
  });
}

function isProjectedTradeData(value: unknown): value is TradeData {
  return (
    typeof value === 'object' &&
    value !== null &&
    'tradeImportId' in value &&
    typeof value.tradeImportId === 'string' &&
    'path' in value &&
    typeof value.path === 'string'
  );
}

async function findProjectedTrade(
  plugin: JournalitPlugin,
  backendTradeId: string
): Promise<TradeData | undefined> {
  await plugin.tradeService.waitForTradeDataReady?.();
  const trades = await plugin.tradeService.getTradeData();
  return trades
    .filter(isProjectedTradeData)
    .find((trade) => trade.tradeImportId === backendTradeId);
}

function preserveLocalTradeAnnotations(
  tradeData: TradeData,
  existing: TradeData
): TradeData {
  return {
    ...tradeData,
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
    });
    const classifiedTrades = response.items.map((item) => ({
      itemId: item.itemId,
      preview: item.previewTrade,
      tradeData: mapPreviewTradeToTradeData(item.previewTrade, accountName),
      classification: item.classification,
      defaultAction: item.defaultAction,
      matchedTradeId: item.matchedTradeId,
      message: item.decisionReasons.map((reason) => reason.code).join(', '),
    }));
    return { response, classifiedTrades };
  }

  async writePreview({
    preview,
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

    const commitItems = classified.map((item) => {
      if (item.defaultAction === 'update' && item.matchedTradeId) {
        return {
          itemId: item.itemId,
          action: 'update_existing' as const,
          targetTradeId: item.matchedTradeId,
        };
      }
      return {
        itemId: item.itemId,
        action: isTradeImportCommitEligible(item.defaultAction)
          ? ('accept_default' as const)
          : ('skip' as const),
      };
    });

    const clientCommitId = generateUUID();
    let commit: Awaited<ReturnType<BackendTradeImportService['commit']>>;
    try {
      commit = await this.backendService.commit(
        preview.importId,
        {
          correlationId: preview.correlationId,
          previewRevision: preview.previewRevision,
          clientCommitId,
          items: commitItems,
        },
        clientCommitId
      );
    } catch {
      const duplicateCount = classified.filter((item) =>
        isTradeImportSkipped(item.defaultAction)
      ).length;
      return (
        finalizeImport(0, duplicateCount, classified.length - duplicateCount) ??
        buildResult(0, duplicateCount, classified.length - duplicateCount)
      );
    }

    const previewByItemId = new Map(
      classified.map((item) => [item.itemId, item])
    );
    const submittedItemIds = new Set(commitItems.map((item) => item.itemId));
    const returnedItemIds = new Set(
      commit.itemResults.map((result) => result.itemId)
    );
    if (
      returnedItemIds.size !== commit.itemResults.length ||
      commitItems.some((item) => !returnedItemIds.has(item.itemId)) ||
      commit.itemResults.some((result) => !submittedItemIds.has(result.itemId))
    ) {
      const duplicateCount = classified.filter((item) =>
        isTradeImportSkipped(item.defaultAction)
      ).length;
      return (
        finalizeImport(0, duplicateCount, classified.length - duplicateCount) ??
        buildResult(0, duplicateCount, classified.length - duplicateCount)
      );
    }
    const resultsByTradeId = new Map<
      string,
      Array<(typeof commit.itemResults)[number]>
    >();
    for (const result of commit.itemResults) {
      if (
        !result.tradeId ||
        (result.result !== 'created' && result.result !== 'updated')
      ) {
        continue;
      }
      resultsByTradeId.set(result.tradeId, [
        ...(resultsByTradeId.get(result.tradeId) ?? []),
        result,
      ]);
    }
    const ackResults: Array<{
      tradeId: string;
      backendTradeVersion: number;
      filePath?: string;
      status: 'synced' | 'failed';
      errorCode?: string;
    }> = [];

    for (const committedTrade of commit.trades) {
      const tradeResults = resultsByTradeId.get(committedTrade.id) ?? [];
      if (tradeResults.length === 0) continue;
      try {
        const existingTrade = await findProjectedTrade(
          this.plugin,
          committedTrade.id
        );
        const metadata = {
          backendTradeId: committedTrade.id,
          backendVersion: committedTrade.version,
        };
        const projectionTrade = committedTrade.previewTrade;
        if (!projectionTrade) {
          throw new Error('Trade Import commit projection missing trade data');
        }
        const tradeData = mapPreviewTradeToTradeData(
          projectionTrade,
          accountName,
          metadata
        );
        const existingPath =
          typeof existingTrade?.path === 'string'
            ? existingTrade.path
            : undefined;
        const projectedTradeData = existingTrade
          ? preserveLocalTradeAnnotations(tradeData, existingTrade)
          : tradeData;
        const filePath = existingPath
          ? await Promise.race([
              this.plugin.tradeService.updateTrade(
                projectedTradeData,
                existingPath,
                'trade-import'
              ),
              timeoutAfter(localWriteTimeoutMs),
            ])
          : await Promise.race([
              this.plugin.tradeService.createTrade(projectedTradeData, {
                suppressAutoOpen: true,
                suppressPostCreateTasks: true,
              }),
              timeoutAfter(localWriteTimeoutMs),
            ]);
        importedTrades.push({
          filePath,
          symbol: projectionTrade.symbol,
          direction: projectionTrade.direction,
          quantity: projectionTrade.quantity,
          entryPrice: projectionTrade.entryPrice,
          profitLoss: projectionTrade.profitLoss ?? undefined,
          entryTime: projectionTrade.entryTime,
          status: projectionTrade.status,
        });
        ackResults.push({
          tradeId: committedTrade.id,
          backendTradeVersion: committedTrade.version,
          filePath,
          status: 'synced',
        });
        written++;
      } catch {
        ackResults.push({
          tradeId: committedTrade.id,
          backendTradeVersion: committedTrade.version,
          status: 'failed',
          errorCode: 'obsidian_write_failed',
        });
        failed++;
      }
    }

    const duplicateCount = commit.itemResults.filter((result) => {
      if (
        result.result !== 'skipped' &&
        result.result !== 'skipped_duplicate'
      ) {
        return false;
      }
      const item = previewByItemId.get(result.itemId);
      return item?.defaultAction === 'skip';
    }).length;
    const failedSkippedResults = commit.itemResults.filter((result) => {
      if (
        result.result !== 'skipped' &&
        result.result !== 'skipped_duplicate'
      ) {
        return false;
      }
      const item = previewByItemId.get(result.itemId);
      return (
        item?.defaultAction === 'blocked' ||
        item?.defaultAction === 'manual_review'
      );
    }).length;
    const failedCommitResults = commit.itemResults.filter(
      (result) => result.result === 'blocked' || result.result === 'conflict'
    ).length;
    const projectedTradeIds = new Set(
      ackResults.map((ackResult) => ackResult.tradeId)
    );
    const successfulCommitResultsWithoutProjection = commit.itemResults.filter(
      (result) =>
        (result.result === 'created' || result.result === 'updated') &&
        (!result.tradeId || !projectedTradeIds.has(result.tradeId))
    ).length;
    const totalFailed =
      failed +
      failedCommitResults +
      failedSkippedResults +
      successfulCommitResultsWithoutProjection;
    const result =
      finalizeImport(written, duplicateCount, totalFailed) ??
      buildResult(written, duplicateCount, totalFailed);

    if (ackResults.length) {
      const uniqueAckResults = Array.from(
        new Map(
          ackResults.map((ackResult) => [ackResult.tradeId, ackResult])
        ).values()
      );
      try {
        await this.backendService.projectionAck({
          correlationId: commit.correlationId,
          importId: commit.importId,
          commitId: commit.commitId,
          vaultId:
            this.plugin.settings.backendIntegration?.vaultIdentifier ??
            this.plugin.app.vault.getName(),
          results: uniqueAckResults,
        });
      } catch {
        // intentional
      }
    }

    return result;
  }
}
