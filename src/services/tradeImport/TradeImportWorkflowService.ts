import { tradeImportClassificationDetail } from './classificationLabels';
import { t } from '../../lang/helpers';
import type JournalitPlugin from '../../main';
import type { TradeData } from '../trade/TradeService';
import { generateUUID } from '../../utils/uuid';
import { mapProjectionTradeToTradeData } from '../tradeSync/canonicalTradeMapper';
import { applyInstrumentCostRulesToProjection } from '../tradeSync/projectionCostRules';
import {
  attachWorkbookImagesToTrades,
  type WorkbookImageAttachResult,
  type WorkbookImageTarget,
} from './workbookImages';
import {
  canImportTradeAnyway,
  isTradeImportCommitEligible,
  isTradeImportDuplicate,
  needsTradeImportAttention,
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
import { TradeProjectionClient } from '../tradeSync/TradeProjectionClient';
import { BackendTradeImportService } from './BackendTradeImportService';
import type {
  TradeProjection,
  TradeProjectionReadClient,
  TradeProjectionPersistedTradeSummary,
  TradeProjectionRequest,
  BrokerClientOperationContext,
} from '../tradeSync/types';
import { getTradeProjectionVaultId } from '../tradeSync/TradeProjectionAckQueue';
import { TradeProjectionRestoreService } from '../tradeSync/TradeProjectionRestoreService';
import { TradeProjectionWriter } from '../tradeSync/TradeProjectionWriter';
import {
  createTradeProjectionOwnershipGuard,
  getTradeProjectionOwnerId,
} from '../tradeSync/TradeProjectionOwnership';
import { getTradeImportTimeZone } from './timeZone';
import {
  missingRequiredFieldsForMappings,
  normalizeManualColumnMappings,
} from './manualMappingValidation';
import type { TradeField } from '../csv/types';

export class TradeImportValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TradeImportValidationError';
  }
}

export class TradeImportMappingValidationError extends TradeImportValidationError {
  constructor(public readonly missingRequiredFields: TradeField[]) {
    super(t('notice.csv-missing-fields'));
    this.name = 'TradeImportMappingValidationError';
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
  
  header: { sheetRow: number } | { index: number | null };
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
  timeZone?: string;
  columnMappings: Record<string, string[]>;
  manualMappingRequired: boolean;
}

export interface TradeImportCompletionResult {
  success: boolean;
  writtenCount: number;
  duplicateCount: number;
  failedCount: number;
  pendingCount: number;
  accountName: string;
  brokerLabel: string;
  importedTrades: TradeProjectionPersistedTradeSummary[];
  
  failedItemIds: string[];
  
  attachedImageCount: number;
  
  failedImageCount: number;
}

interface TradeImportWriteInput {
  preview: TradeImportPreviewResponse;
  previewOwnerUserId: string;
  classified: ClassifiedPreviewTrade[];
  
  importAnywayItemIds?: ReadonlySet<string>;
  
  workbookFile?: Blob;
  accountName: string;
  brokerLabel: string;
  localWriteTimeoutMs: number;
  onComplete?: (result: TradeImportCompletionResult) => void;
}

interface TradeImportRestoreInput {
  accountName: string;
  brokerLabel: string;
  projections: TradeProjection[];
  localWriteTimeoutMs: number;
  ownerUserId?: string;
  shouldStop?: () => boolean;
  clientOperation?: BrokerClientOperationContext;
  onComplete?: (result: TradeImportCompletionResult) => void;
}

type TradeProjectionBackend = TradeProjectionReadClient;

function hasProjectionAck(
  value: object
): value is Pick<TradeProjectionBackend, 'projectionAck'> {
  return 'projectionAck' in value && typeof value.projectionAck === 'function';
}

function hasRestorableProjectionQuery(
  value: object
): value is Pick<TradeProjectionBackend, 'getRestorableProjections'> {
  return (
    'getRestorableProjections' in value &&
    typeof value.getRestorableProjections === 'function'
  );
}

function projectionBackendFrom(value: unknown): TradeProjectionBackend | null {
  if (typeof value !== 'object' || value === null) return null;
  const projectionAck = hasProjectionAck(value)
    ? value.projectionAck
    : undefined;
  const getRestorableProjections = hasRestorableProjectionQuery(value)
    ? value.getRestorableProjections
    : undefined;
  if (
    typeof projectionAck !== 'function' &&
    typeof getRestorableProjections !== 'function'
  ) {
    return null;
  }
  return {
    projectionAck:
      (typeof projectionAck === 'function' ? projectionAck : undefined) ??
      (async () => {
        throw new Error('Projection acknowledgement client is unavailable');
      }),
    getRestorableProjections:
      (typeof getRestorableProjections === 'function'
        ? getRestorableProjections
        : undefined) ??
      (async () => {
        throw new Error('Projection restore client is unavailable');
      }),
  };
}

function pluginVersion(plugin: JournalitPlugin): string {
  return plugin.manifest.version;
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
  if (file.size === 0) {
    return t('trade-import.error.file-empty');
  }
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
  return value
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]/gu, '');
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
      const normalized = token ? normalizeMappingToken(token) : '';
      
      if (!normalized) continue;
      customFieldByHeaderToken.set(normalized, mappingKey);
    }
  }

  for (const header of headers) {
    const headerToken = normalizeMappingToken(header);
    const customMappingKey = headerToken
      ? customFieldByHeaderToken.get(headerToken)
      : undefined;
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


function submittedWrites(
  items: ReadonlyArray<{ itemId: string; action: string }>
): string[] {
  return items.flatMap((item) => (item.action === 'skip' ? [] : [item.itemId]));
}

export class TradeImportWorkflowService {
  constructor(
    private plugin: JournalitPlugin,
    private importBackend: Pick<
      BackendTradeImportService,
      'analyse' | 'preview' | 'commit'
    >,
    projectionBackend?: TradeProjectionBackend
  ) {
    this.projectionBackend =
      projectionBackend ??
      projectionBackendFrom(importBackend) ??
      new TradeProjectionClient();
    this.restoreService = new TradeProjectionRestoreService(
      plugin,
      this.projectionBackend
    );
  }

  private readonly projectionBackend: TradeProjectionBackend;
  private readonly restoreService: TradeProjectionRestoreService;

  async analyseFile({
    file,
    capabilities,
    brokerCapabilities,
    broker,
    sheetName,
    header,
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
    const shouldStop = createTradeProjectionOwnershipGuard(this.plugin);
    if (shouldStop()) throw new Error('Trade Import ownership changed');
    const response = await this.importBackend.analyse(file, {
      schemaVersion: 'trade-import-analyse-request-v1',
      pluginVersion: pluginVersion(this.plugin),
      requestedBroker: broker,
      requestedFileType: fileTypeFor(file),
      sheetName,
      ...('sheetRow' in header
        ? { headerSheetRow: header.sheetRow }
        : { headerRowIndex: header.index }),
      timeZone: getTradeImportTimeZone(),
      sampleRowLimit: capabilities.fileLimits.sampleRowLimit,
      aiMapping: {
        enabled: aiMappingEnabled && !!brokerCapabilities?.supportsAiMapping,
        mode: aiMappingEnabled ? 'auto' : 'manual_requested',
      },
      customFields,
    });
    if (shouldStop()) throw new Error('Trade Import ownership changed');

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
    analyse,
    broker,
    sheetName,
    headerRowIndex,
    accountName,
    assetType,
    manualMode,
    dateFormat,
    timeZone,
    columnMappings,
    manualMappingRequired,
  }: TradeImportPreviewInput): Promise<{
    response: TradeImportPreviewResponse;
    classifiedTrades: ClassifiedPreviewTrade[];
    ownerUserId: string;
  }> {
    const validationError = validateSelectedFile(
      file,
      capabilities,
      brokerCapabilities
    );
    if (validationError) throw new TradeImportValidationError(validationError);

    const normalizedColumnMappings = normalizeManualColumnMappings(
      columnMappings,
      analyse.headers
    );
    if (manualMappingRequired) {
      const missingRequiredFields = missingRequiredFieldsForMappings(
        manualMode,
        columnMappings,
        analyse.headers,
        assetType
      );
      if (missingRequiredFields.length > 0) {
        throw new TradeImportMappingValidationError(missingRequiredFields);
      }
    }

    const ownerUserId = getTradeProjectionOwnerId(this.plugin);
    const shouldStop = createTradeProjectionOwnershipGuard(
      this.plugin,
      ownerUserId
    );
    if (shouldStop()) throw new Error('Trade Import ownership changed');
    const response = await this.importBackend.preview(file, {
      schemaVersion: 'trade-import-preview-request-v1',
      pluginVersion: pluginVersion(this.plugin),
      broker,
      fileType: fileTypeFor(file),
      sheetName,
      headerRowIndex,
      timeZone: timeZone ?? getTradeImportTimeZone(),
      accountName,
      assetType,
      manualMode,
      dateFormat,
      mappingVersion: capabilities.manualMapping.mappingVersion,
      columnMappings: normalizedColumnMappings,
      customFields: customFieldDefinitions(this.plugin),
    });
    if (shouldStop()) throw new Error('Trade Import ownership changed');
    const classifiedTrades = response.items.map((item) => ({
      itemId: item.itemId,
      preview: item.previewTrade,
      tradeData: applyInstrumentCostRulesToProjection(
        mapProjectionTradeToTradeData(item.previewTrade, accountName),
        this.plugin.optionsService
      ),
      classification: item.classification,
      defaultAction: item.defaultAction,
      matchedTradeId: item.matchedTradeId,
      otherAccount: item.otherAccount,
      message: tradeImportClassificationDetail(item),
    }));
    return { response, classifiedTrades, ownerUserId };
  }

  async getRestorableProjections(
    filters: Omit<TradeProjectionRequest, 'vaultId'> = {}
  ) {
    return this.projectionBackend.getRestorableProjections({
      ...filters,
      vaultId: await getTradeProjectionVaultId(this.plugin),
    });
  }

  async restoreProjections({
    accountName,
    brokerLabel,
    projections,
    localWriteTimeoutMs,
    ownerUserId,
    shouldStop,
    clientOperation,
    onComplete,
  }: TradeImportRestoreInput): Promise<TradeImportCompletionResult> {
    const result = await this.restoreService.restoreProjections({
      accountName,
      brokerLabel,
      projections,
      localWriteTimeoutMs,
      ownerUserId,
      shouldStop,
      clientOperation,
    });
    const completionResult: TradeImportCompletionResult = {
      success: result.success,
      writtenCount: result.writtenCount + result.duplicateCount,
      duplicateCount: 0,
      failedCount: result.failedCount + result.ackFailedCount,
      pendingCount: result.pendingCount,
      accountName: result.accountName,
      brokerLabel: result.brokerLabel,
      importedTrades: result.importedTrades,
      
      failedItemIds: [],
      
      attachedImageCount: 0,
      failedImageCount: 0,
    };
    onComplete?.(completionResult);
    return completionResult;
  }

  
  private async attachWorkbookImages(
    workbookFile: Blob,
    itemResults: ReadonlyArray<{
      itemId: string;
      result: string;
      tradeId?: string | null;
    }>,
    projectionResult: {
      importedTrades: readonly TradeProjectionPersistedTradeSummary[];
      ackResults: ReadonlyArray<{
        tradeId: string;
        filePath?: string;
        status: string;
      }>;
    },
    previewByItemId: ReadonlyMap<string, ClassifiedPreviewTrade>
  ): Promise<WorkbookImageAttachResult> {
    const itemIdByTradeId = new Map<string, string>();
    for (const result of itemResults) {
      if (result.result === 'created' && result.tradeId) {
        itemIdByTradeId.set(result.tradeId, result.itemId);
      }
    }
    const createdPaths = new Set<string>();
    for (const trade of projectionResult.importedTrades) {
      if (trade.change === 'created') createdPaths.add(trade.filePath);
    }
    const ackByTradeId = new Map(
      projectionResult.ackResults.map((ack) => [ack.tradeId, ack])
    );
    const targets: WorkbookImageTarget[] = [];
    let unwrittenImages = 0;
    for (const [tradeId, itemId] of itemIdByTradeId) {
      const item = previewByItemId.get(itemId);
      const images = item?.preview.embeddedImages ?? [];
      if (!item || images.length === 0) continue;
      const ack = ackByTradeId.get(tradeId);
      if (
        ack?.status !== 'synced' ||
        !ack.filePath ||
        !createdPaths.has(ack.filePath)
      ) {
        unwrittenImages += images.length;
        continue;
      }
      targets.push({
        filePath: ack.filePath,
        symbol: item.preview.symbol,
        images,
      });
    }
    try {
      const result = await attachWorkbookImagesToTrades(
        this.plugin.app,
        workbookFile,
        targets
      );
      return {
        attachedCount: result.attachedCount,
        failedCount: result.failedCount + unwrittenImages,
      };
    } catch (error) {
      console.warn('[TradeImport] Failed to add workbook images:', error);
      return {
        attachedCount: 0,
        failedCount:
          unwrittenImages +
          targets.reduce((total, target) => total + target.images.length, 0),
      };
    }
  }

  async writePreview({
    preview,
    previewOwnerUserId,
    classified,
    importAnywayItemIds = new Set<string>(),
    workbookFile,
    accountName,
    brokerLabel,
    localWriteTimeoutMs,
    onComplete,
  }: TradeImportWriteInput): Promise<TradeImportCompletionResult> {
    const isLeftAsDuplicate = (item: ClassifiedPreviewTrade): boolean =>
      isTradeImportDuplicate(item) && !importAnywayItemIds.has(item.itemId);
    let finalized = false;
    let written = 0;
    let failed = 0;
    const importedTrades: TradeProjectionPersistedTradeSummary[] = [];
    const failedItemIds: string[] = [];
    let attachedImageCount = 0;
    let failedImageCount = 0;

    const buildResult = (
      writtenCount: number,
      duplicateCount: number,
      failedCount: number,
      pendingCount: number = 0
    ): TradeImportCompletionResult => ({
      success: failedCount === 0 && pendingCount === 0,
      writtenCount,
      duplicateCount,
      failedCount,
      pendingCount,
      accountName,
      brokerLabel,
      importedTrades,
      failedItemIds,
      attachedImageCount,
      failedImageCount,
    });

    const finalizeImport = (
      writtenCount: number,
      duplicateCount: number,
      failedCount: number,
      pendingCount: number = 0
    ): TradeImportCompletionResult | null => {
      if (finalized) return null;
      finalized = true;
      const result = buildResult(
        writtenCount,
        duplicateCount,
        failedCount,
        pendingCount
      );
      onComplete?.(result);
      return result;
    };
    const abortImport = (): TradeImportCompletionResult => {
      const duplicateCount = classified.filter((item) =>
        isLeftAsDuplicate(item)
      ).length;
      return (
        finalizeImport(0, duplicateCount, classified.length - duplicateCount) ??
        buildResult(0, duplicateCount, classified.length - duplicateCount)
      );
    };

    const commitItems = classified.map((item) => {
      if (importAnywayItemIds.has(item.itemId) && canImportTradeAnyway(item)) {
        return { itemId: item.itemId, action: 'create_new' as const };
      }
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
    const shouldStop = createTradeProjectionOwnershipGuard(
      this.plugin,
      previewOwnerUserId
    );
    if (shouldStop()) return abortImport();
    let commit: Awaited<ReturnType<BackendTradeImportService['commit']>>;
    try {
      commit = await this.importBackend.commit(
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
      failedItemIds.push(...submittedWrites(commitItems));
      const duplicateCount = classified.filter((item) =>
        isLeftAsDuplicate(item)
      ).length;
      return (
        finalizeImport(0, duplicateCount, classified.length - duplicateCount) ??
        buildResult(0, duplicateCount, classified.length - duplicateCount)
      );
    }
    if (shouldStop()) return abortImport();

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
      failedItemIds.push(...submittedWrites(commitItems));
      const duplicateCount = classified.filter((item) =>
        isLeftAsDuplicate(item)
      ).length;
      return (
        finalizeImport(0, duplicateCount, classified.length - duplicateCount) ??
        buildResult(0, duplicateCount, classified.length - duplicateCount)
      );
    }
    const projectedTradeIds = new Set<string>();
    const localTradeDataByTradeId = new Map<string, TradeData>();
    for (const result of commit.itemResults) {
      if (
        !result.tradeId ||
        (result.result !== 'created' && result.result !== 'updated')
      ) {
        continue;
      }
      projectedTradeIds.add(result.tradeId);
      const classifiedItem = previewByItemId.get(result.itemId);
      if (classifiedItem) {
        localTradeDataByTradeId.set(result.tradeId, classifiedItem.tradeData);
      }
    }
    const projectionWriter = new TradeProjectionWriter(
      this.plugin,
      this.projectionBackend
    );
    const projectionResult = await projectionWriter.writeProjections({
      accountName,
      accountBroker: preview.broker,
      accountDisplayName: accountName,

      trades: commit.trades.filter((trade) => projectedTradeIds.has(trade.id)),
      ownerUserId: previewOwnerUserId,
      shouldStop,
      localTradeDataByTradeId,
      localWriteTimeoutMs,
    });
    importedTrades.push(...projectionResult.importedTrades);
    if (workbookFile) {
      const images = await this.attachWorkbookImages(
        workbookFile,
        commit.itemResults,
        projectionResult,
        previewByItemId
      );
      attachedImageCount = images.attachedCount;
      failedImageCount = images.failedCount;
    }
    written =
      projectionResult.writtenCount + projectionResult.alreadyPresentCount;
    failed = projectionResult.failedCount + projectionResult.ackFailedCount;

    let duplicateCount = 0;
    let failedSkippedResults = 0;
    for (const result of commit.itemResults) {
      if (result.result === 'skipped_duplicate') {
        duplicateCount += 1;
        continue;
      }
      if (result.result !== 'skipped' && result.result !== 'skipped_user') {
        continue;
      }
      const item = previewByItemId.get(result.itemId);
      if (!item) continue;
      if (isTradeImportDuplicate(item)) {
        duplicateCount += 1;
      } else if (needsTradeImportAttention(item)) {
        failedSkippedResults += 1;
      }
    }
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
    for (const result of commit.itemResults) {
      const written =
        (result.result === 'created' || result.result === 'updated') &&
        result.tradeId !== undefined &&
        ackedTradeIds.has(result.tradeId);
      if (
        result.result === 'blocked' ||
        result.result === 'conflict' ||
        ((result.result === 'created' || result.result === 'updated') &&
          !written)
      ) {
        failedItemIds.push(result.itemId);
      }
    }
    const totalFailed =
      failed +
      failedCommitResults +
      failedSkippedResults +
      successfulCommitResultsWithoutProjection;
    const result =
      finalizeImport(
        written,
        duplicateCount,
        totalFailed,
        projectionResult.pendingCount
      ) ??
      buildResult(
        written,
        duplicateCount,
        totalFailed,
        projectionResult.pendingCount
      );

    return result;
  }
}
