import { t } from '../../lang/helpers';
import type JournalitPlugin from '../../main';
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
  TradeImportRestorableProjection,
  TradeImportRestorableProjectionRequest,
} from './types';
import { BackendTradeImportService } from './BackendTradeImportService';
import {
  TradeImportProjectionWriter,
  type TradeImportPersistedTradeSummary,
} from './TradeImportProjectionWriter';
import { getTradeImportVaultId } from './TradeImportProjectionAckQueue';

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

interface TradeImportRestoreInput {
  accountName: string;
  brokerLabel: string;
  projections: TradeImportRestorableProjection[];
  localWriteTimeoutMs: number;
  onComplete?: (result: TradeImportCompletionResult) => void;
}

interface TradeImportProjectionRestoreGroup {
  correlationId: string;
  importId: string;
  commitId: string;
  projections: TradeImportRestorableProjection[];
}

function groupRestorableProjections(
  projections: TradeImportRestorableProjection[]
): TradeImportProjectionRestoreGroup[] {
  const groups = new Map<string, TradeImportProjectionRestoreGroup>();
  for (const projection of projections) {
    const correlationId =
      projection.correlationId ?? `restore-${projection.importId}`;
    const importId = projection.importId || 'restore';
    const commitId = projection.commitId ?? `restore-${importId}`;
    const key = `${correlationId}\u001f${importId}\u001f${commitId}`;
    const existing = groups.get(key);
    if (existing) {
      existing.projections.push(projection);
      continue;
    }
    groups.set(key, {
      correlationId,
      importId,
      commitId,
      projections: [projection],
    });
  }
  return Array.from(groups.values());
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
      mappings[key] = columns.flatMap((column) => {
        const mappedColumn = String(column);
        return mappedColumn ? [mappedColumn] : [];
      });
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

  async getRestorableProjections(
    filters: Omit<TradeImportRestorableProjectionRequest, 'vaultId'> = {}
  ) {
    return this.backendService.getRestorableProjections({
      ...filters,
      vaultId: await getTradeImportVaultId(this.plugin),
    });
  }

  async restoreProjections({
    accountName,
    brokerLabel,
    projections,
    localWriteTimeoutMs,
    onComplete,
  }: TradeImportRestoreInput): Promise<TradeImportCompletionResult> {
    const projectionWriter = new TradeImportProjectionWriter(
      this.plugin,
      this.backendService
    );
    const projectionResults: Array<
      Awaited<ReturnType<TradeImportProjectionWriter['writeProjections']>>
    > = [];
    let restoreChain = Promise.resolve();
    for (const group of groupRestorableProjections(projections)) {
      restoreChain = restoreChain.then(async () => {
        projectionResults.push(
          await projectionWriter.writeProjections({
            accountName,
            correlationId: group.correlationId,
            importId: group.importId,
            commitId: group.commitId,
            trades: group.projections.map((projection) => ({
              id: projection.id,
              version: projection.version,
              symbol: projection.symbol,
              direction: projection.direction,
              status: projection.status,
              accountId: projection.accountId,
              accountDisplayName: projection.accountName,
              broker: projection.broker,
              importId: projection.importId,
              previewTrade: projection.previewTrade,
            })),
            localWriteTimeoutMs,
          })
        );
      });
    }
    await restoreChain;
    const writtenCount = projectionResults.reduce(
      (total, projectionResult) => total + projectionResult.writtenCount,
      0
    );
    const alreadyPresentCount = projectionResults.reduce(
      (total, projectionResult) => total + projectionResult.alreadyPresentCount,
      0
    );
    const failedCount = projectionResults.reduce(
      (total, projectionResult) => total + projectionResult.failedCount,
      0
    );
    const ackFailedCount = projectionResults.reduce(
      (total, projectionResult) => total + projectionResult.ackFailedCount,
      0
    );
    const result: TradeImportCompletionResult = {
      success: failedCount === 0 && ackFailedCount === 0,
      writtenCount: writtenCount + alreadyPresentCount,
      duplicateCount: 0,
      failedCount: failedCount + ackFailedCount,
      accountName,
      brokerLabel,
      importedTrades: projectionResults.flatMap(
        (projectionResult) => projectionResult.importedTrades
      ),
    };
    onComplete?.(result);
    return result;
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
    const projectedTradeIds = new Set<string>();
    for (const result of commit.itemResults) {
      if (
        !result.tradeId ||
        (result.result !== 'created' && result.result !== 'updated')
      ) {
        continue;
      }
      projectedTradeIds.add(result.tradeId);
    }
    const projectionWriter = new TradeImportProjectionWriter(
      this.plugin,
      this.backendService
    );
    const projectionResult = await projectionWriter.writeProjections({
      accountName,
      accountBroker: preview.broker,
      accountDisplayName: accountName,
      correlationId: commit.correlationId,
      importId: commit.importId,
      commitId: commit.commitId,
      trades: commit.trades.filter((trade) => projectedTradeIds.has(trade.id)),
      localWriteTimeoutMs,
    });
    importedTrades.push(...projectionResult.importedTrades);
    written =
      projectionResult.writtenCount + projectionResult.alreadyPresentCount;
    failed = projectionResult.failedCount + projectionResult.ackFailedCount;

    const duplicateCount = commit.itemResults.filter((result) => {
      if (result.result === 'skipped_user') return true;
      if (result.result === 'skipped_duplicate') return true;
      if (result.result !== 'skipped') return false;
      const item = previewByItemId.get(result.itemId);
      return item?.defaultAction === 'skip';
    }).length;
    const failedSkippedResults = commit.itemResults.filter((result) => {
      if (result.result !== 'skipped') return false;
      const item = previewByItemId.get(result.itemId);
      return (
        item?.defaultAction === 'blocked' ||
        item?.defaultAction === 'manual_review'
      );
    }).length;
    const failedCommitResults = commit.itemResults.filter(
      (result) => result.result === 'blocked' || result.result === 'conflict'
    ).length;
    const ackedTradeIds = new Set(
      projectionResult.ackResults.map((ackResult) => ackResult.tradeId)
    );
    const successfulCommitResultsWithoutProjection = commit.itemResults.filter(
      (result) =>
        (result.result === 'created' || result.result === 'updated') &&
        (!result.tradeId || !ackedTradeIds.has(result.tradeId))
    ).length;
    const totalFailed =
      failed +
      failedCommitResults +
      failedSkippedResults +
      successfulCommitResultsWithoutProjection;
    const result =
      finalizeImport(written, duplicateCount, totalFailed) ??
      buildResult(written, duplicateCount, totalFailed);

    return result;
  }
}
