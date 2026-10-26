

import { App, TFile } from 'obsidian';
import type { TradeData } from '../../services/trade/TradeService';
import { eventBus } from '../../services/events/EventBus';
import { getPluginInstance } from '../../utils/pluginContext';
import { getTradeIdentityNoteType } from '../../utils/tradeIdentity';
import {
  parseFrontmatterFromContentOrThrow,
  readFileContentFromDisk,
} from '../../utils/dataRefresh';
import type {
  TradeCommitEventBatch,
  TradeCreateOptions,
  TradeCreationBatch,
} from '../../services/trade/core/TradeCommandService';
import { extractUserOwnedTradeNotes } from '../../services/trade/core/TradeNoteDocumentCodec';
import {
  removeTradeNoteMediaReferences,
  snapshotTradeNoteMediaReferenceResolutions,
} from '../../services/trade/core/TradeNoteMediaReferenceCodec';
import {
  isManagedTradeMediaPath,
  resolveManagedTradeMediaReferencePath,
} from '../../services/trade/core/TradeMediaOwnership';

interface BatchOperationResult {
  processed: number;
  skipped: number;
  errors: number;
  total: number;
}

interface TradeServiceLike {
  extractTradeData: (
    file: TFile,
    frontmatterOverride?: Record<string, unknown>,
    contentOverride?: string
  ) => Promise<TradeData | null>;
  createTrade: (
    data: TradeData,
    options?: TradeCreateOptions
  ) => Promise<string>;
  createTradeCommitEventBatch: () => TradeCommitEventBatch;
  createTradeCreationBatch: () => TradeCreationBatch;
  discardCreatedTradeState: (filePath: string) => void;
  suppressCreatedTradeRollbackDeletion: (filePath: string) => void;
  cancelCreatedTradeRollbackDeletion: (filePath: string) => void;
}

function dedupeStrings(values: string[]): string[] {
  return Array.from(new Set(values));
}

function isTradeServiceLike(value: unknown): value is TradeServiceLike {
  return Boolean(
    value &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    typeof Reflect.get(value, 'extractTradeData') === 'function' &&
    typeof Reflect.get(value, 'createTrade') === 'function' &&
    typeof Reflect.get(value, 'createTradeCommitEventBatch') === 'function' &&
    typeof Reflect.get(value, 'createTradeCreationBatch') === 'function' &&
    typeof Reflect.get(value, 'discardCreatedTradeState') === 'function' &&
    typeof Reflect.get(value, 'suppressCreatedTradeRollbackDeletion') ===
      'function' &&
    typeof Reflect.get(value, 'cancelCreatedTradeRollbackDeletion') ===
      'function'
  );
}

function getTradeServiceOrThrow(): TradeServiceLike {
  const tradeService = getPluginInstance()?.tradeService;

  if (!isTradeServiceLike(tradeService)) {
    throw new Error('TradeService is required for batch trade mutations');
  }

  return tradeService;
}


async function readCanonicalTradeSource(
  app: App,
  tradeService: TradeServiceLike,
  file: TFile
): Promise<{
  content: string;
  frontmatter: Record<string, unknown>;
  tradeData: TradeData | null;
}> {
  const content = await readFileContentFromDisk(app, file);
  const frontmatter = parseFrontmatterFromContentOrThrow(content);
  return {
    content,
    frontmatter,
    tradeData: await tradeService.extractTradeData(file, frontmatter, content),
  };
}

function publishBatchTradeChanged(filePaths: string[]): void {
  eventBus.publish('trade:changed', {
    action: 'batch',
    filePaths: dedupeStrings(filePaths),
    timestamp: Date.now(),
  });
}


const DUPLICATE_EXCLUDED_FIELDS = [
  
  'tradeId',
  'schemaVersion',
  'tradeRevision',
  
  'path',
  
  'backendTradeId',
  'canonicalTradeId',
  'canonicalTradeVersion',
  'canonicalProjectionGeneration',
  'canonicalAccountId',
  'canonicalAccountIdentity',
  'canonicalBroker',
  'canonicalAccountDisplayName',
  'canonicalProjectionSchemaVersion',
  'canonicalProjectionClearFields',
  'mtComment',
  'lastBrokerSyncAt',
  'brokerBaseCurrencyPnl',
  'brokerBaseCurrency',
  'brokerBaseCurrencyPnlSource',
  
  
  'originalPnl',
  'originalRMultiple',
  'authoritativePnl',
  '_originalPnlWasNull',
  
  
  'unrealizedPriceSnapshot',
  'unrealizedPriceSnapshotTime',
  
  'tradeImportId',
  'tradeImportVersion',
  'tradeImportAccountId',
  'tradeImportAccountBroker',
  'tradeImportAccountDisplayName',
  'csvImportId',
  'legacyCsvImportIds',
  'sourceRows',
  'orderId',
  'canonicalExecutionMigrationVersion',
  'executionLedgerVersion',
  'executionIds',
  
  'lossReview',
  'tradeReview',
  'reviewed',
  'reviewedAt',
  'tradeRating',
  
  
  'filePath',
  'journalitSampleInstance',
  'journalitSampleEntityId',
] as const;

function buildDuplicateTradeData(
  app: App,
  tradeData: TradeData,
  notes: string | undefined,
  sourceFilePath: string
): TradeData {
  const duplicate: TradeData = { ...tradeData };
  const droppedManagedMediaPaths = new Set<string>();
  const resolveSourceMediaPath = (target: string): string => {
    const resolvedLink =
      !target.includes('/') && !target.includes('\\')
        ? app.metadataCache.getFirstLinkpathDest(target, sourceFilePath)?.path
        : undefined;
    return (
      resolvedLink ??
      resolveManagedTradeMediaReferencePath({
        mediaTarget: target,
        tradeFilePath: sourceFilePath,
        instrument: tradeData.instrument,
        pathExists: (path) =>
          app.vault.getAbstractFileByPath(path) instanceof TFile,
      }) ??
      app.metadataCache.getFirstLinkpathDest(target, sourceFilePath)?.path ??
      target
    );
  };
  for (const field of DUPLICATE_EXCLUDED_FIELDS) {
    delete duplicate[field];
  }

  if (duplicate.customFields) {
    const customFields = { ...duplicate.customFields };
    for (const field of DUPLICATE_EXCLUDED_FIELDS) {
      delete customFields[field];
    }
    duplicate.customFields = customFields;
  }

  if (notes) {
    const resolvedNoteMedia = snapshotTradeNoteMediaReferenceResolutions(
      notes,
      resolveSourceMediaPath,
      'notes'
    );
    for (const resolvedPath of resolvedNoteMedia.values()) {
      if (
        isManagedTradeMediaPath({
          mediaPath: resolvedPath,
          tradeFilePath: sourceFilePath,
          instrument: tradeData.instrument,
        })
      ) {
        droppedManagedMediaPaths.add(resolvedPath);
      }
    }
  }

  if (duplicate.images) {
    duplicate.images = duplicate.images.filter((mediaPath) => {
      const isManaged = isManagedTradeMediaPath({
        mediaPath,
        tradeFilePath: sourceFilePath,
        instrument: tradeData.instrument,
      });
      if (isManaged) {
        droppedManagedMediaPaths.add(mediaPath);
      }
      return !isManaged;
    });
    if (duplicate.images.length === 0) {
      delete duplicate.images;
    }
  }

  if (duplicate.imageAnnotations) {
    const filteredAnnotations = Object.fromEntries(
      Object.entries(duplicate.imageAnnotations).filter(([mediaPath]) => {
        if (droppedManagedMediaPaths.has(mediaPath)) return false;
        return !isManagedTradeMediaPath({
          mediaPath,
          tradeFilePath: sourceFilePath,
          instrument: tradeData.instrument,
        });
      })
    );
    if (Object.keys(filteredAnnotations).length > 0) {
      duplicate.imageAnnotations = filteredAnnotations;
    } else {
      delete duplicate.imageAnnotations;
    }
  }

  duplicate.notes = removeTradeNoteMediaReferences(
    notes,
    droppedManagedMediaPaths,
    resolveSourceMediaPath
  );
  return duplicate;
}

async function rollbackCreatedDuplicateTrades(
  app: App,
  tradeService: TradeServiceLike,
  createdFilePaths: readonly string[]
): Promise<string[]> {
  const survivingFilePaths: string[] = [];
  for (const filePath of [...createdFilePaths].reverse()) {
    try {
      const file = app.vault.getAbstractFileByPath(filePath);
      if (!(file instanceof TFile)) {
        tradeService.discardCreatedTradeState(filePath);
        continue;
      }
      tradeService.suppressCreatedTradeRollbackDeletion(filePath);
      try {
        await app.fileManager.trashFile(file);
      } catch (error) {
        tradeService.cancelCreatedTradeRollbackDeletion(filePath);
        throw error;
      }
      tradeService.discardCreatedTradeState(filePath);
    } catch (error) {
      console.error(`Failed to roll back duplicated trade: ${filePath}`, error);
      survivingFilePaths.push(filePath);
    }
  }
  return survivingFilePaths.reverse();
}


export async function batchDuplicateTrades(
  app: App,
  tradeFilePaths: string[]
): Promise<BatchOperationResult> {
  let processed = 0;
  let skipped = 0;
  let errors = 0;
  const total = tradeFilePaths.length;

  const tradeService = getTradeServiceOrThrow();
  const commitEventBatch = tradeService.createTradeCommitEventBatch();
  const creationBatch = tradeService.createTradeCreationBatch();
  const createdFilePaths: string[] = [];

  for (const filePath of tradeFilePaths) {
    try {
      const file = app.vault.getAbstractFileByPath(filePath);
      if (!(file instanceof TFile)) {
        console.warn(`File not found or not a TFile: ${filePath}`);
        errors++;
        continue;
      }

      const { content: sourceContent, tradeData } =
        await readCanonicalTradeSource(app, tradeService, file);

      if (!tradeData) {
        throw new Error(
          `Could not extract canonical trade data for duplication: ${file.path}`
        );
      }

      
      
      if (getTradeIdentityNoteType(tradeData, file.path) !== 'trade') {
        skipped++;
        continue;
      }

      const notes = extractUserOwnedTradeNotes(sourceContent);

      createdFilePaths.push(
        await tradeService.createTrade(
          buildDuplicateTradeData(app, tradeData, notes, file.path),
          {
            suppressAutoOpen: true,
            commitEventBatch,
            creationBatch,
            
            applyLayoutNoteSections: false,
          }
        )
      );
      processed++;
    } catch (error) {
      console.error(`Failed to duplicate trade: ${filePath}`, error);
      errors++;
    }
  }

  try {
    await creationBatch.flush(() => commitEventBatch.flush());
  } catch (error) {
    console.error('Failed to finalize duplicated trades:', error);
    const survivingFilePaths = await rollbackCreatedDuplicateTrades(
      app,
      tradeService,
      createdFilePaths
    );
    processed = survivingFilePaths.length;
    errors++;
    if (survivingFilePaths.length > 0) {
      creationBatch.retainPaths(new Set(survivingFilePaths));
      commitEventBatch.retainPaths(new Set(survivingFilePaths));
      try {
        await creationBatch.flush(() => commitEventBatch.flush());
      } catch (survivorFinalizationError) {
        console.error(
          'Failed to finalize surviving duplicated trades:',
          survivorFinalizationError
        );
        creationBatch.abandon();
        processed = 0;
        errors++;
        return { processed, skipped, errors, total };
      }
    }
    return { processed, skipped, errors, total };
  }

  return { processed, skipped, errors, total };
}

export async function batchDeleteTrades(
  app: App,
  tradeFilePaths: string[]
): Promise<BatchOperationResult> {
  let processed = 0;
  let errors = 0;
  const total = tradeFilePaths.length;

  const plugin = getPluginInstance();
  plugin?.backendIntegrationService?.addBatchModifiedFiles(tradeFilePaths);

  for (const filePath of tradeFilePaths) {
    try {
      const file = app.vault.getAbstractFileByPath(filePath);
      if (!(file instanceof TFile)) {
        console.warn(`File not found or not a TFile: ${filePath}`);
        errors++;
        continue;
      }

      await app.fileManager.trashFile(file);
      processed++;
    } catch (error) {
      console.error(`Failed to delete trade: ${filePath}`, error);
      errors++;
    }
  }

  
  
  publishBatchTradeChanged(tradeFilePaths);

  window.setTimeout(() => {
    plugin?.backendIntegrationService?.removeBatchModifiedFiles(tradeFilePaths);
  }, 500);

  return { processed, skipped: 0, errors, total };
}
