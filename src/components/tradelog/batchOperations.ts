

import { App, TFile } from 'obsidian';
import type { TradeData } from '../../services/trade/TradeService';
import { eventBus } from '../../services/events/EventBus';
import { getPluginInstance } from '../../utils/pluginContext';
import {
  ensureTradeIdentityFrontmatter,
  getTradeIdentityNoteType,
} from '../../utils/tradeIdentity';
import {
  forceMetadataCacheRefresh,
  parseFrontmatterFromContentOrThrow,
  readFileContentFromDisk,
  readFrontmatterFromDisk,
} from '../../utils/dataRefresh';
import { normalizeStringArray } from '../../utils/dataUtils';
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
  updateTrade: (
    data: TradeData,
    filePath: string,
    source?: string
  ) => Promise<string>;
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

type BatchNoteKind = 'regular' | 'missed' | 'backtest';
type NonRegularBatchNoteKind = Exclude<BatchNoteKind, 'regular'>;

interface FrontmatterMutationResult {
  didPrimaryMutation: boolean;
  didIdentityBackfill?: boolean;
}

interface OptionMergeResult {
  allExist: boolean;
  mergedIds: string[];
  mergedNames: string[];
}

interface TradeDataMutationContext {
  frontmatter: Record<string, unknown> | null;
}

function dedupeStrings(values: string[]): string[] {
  return Array.from(new Set(values));
}

function arraysEqual(left: string[], right: string[]): boolean {
  return (
    left.length === right.length &&
    left.every((value, index) => value === right[index])
  );
}

function isTradeServiceLike(value: unknown): value is TradeServiceLike {
  return Boolean(
    value &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    typeof Reflect.get(value, 'extractTradeData') === 'function' &&
    typeof Reflect.get(value, 'updateTrade') === 'function' &&
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

function buildOptionMerge(
  existingIdsRaw: unknown,
  existingNamesRaw: unknown,
  incomingIds: string[],
  incomingNames: string[]
): OptionMergeResult {
  const existingIds = normalizeStringArray(existingIdsRaw);
  const existingNames = normalizeStringArray(existingNamesRaw);
  const allExist = incomingNames.every((name) => existingNames.includes(name));

  return {
    allExist,
    mergedIds: dedupeStrings([...existingIds, ...incomingIds]),
    mergedNames: dedupeStrings([...existingNames, ...incomingNames]),
  };
}

function buildTagMerge(
  tagsRaw: unknown,
  customTagsRaw: unknown,
  incomingTags: string[]
): { isCanonicalNoOp: boolean; mergedTags: string[] } {
  const canonicalTags = normalizeStringArray(tagsRaw);
  const mergedTags = dedupeStrings([
    ...canonicalTags,
    ...normalizeStringArray(customTagsRaw),
    ...incomingTags,
  ]);

  return {
    isCanonicalNoOp:
      incomingTags.every((tag) => canonicalTags.includes(tag)) &&
      arraysEqual(canonicalTags, mergedTags),
    mergedTags,
  };
}

function getNoteKind(app: App, file: TFile): BatchNoteKind {
  const frontmatter = app.metadataCache?.getFileCache(file)?.frontmatter;
  const frontmatterRecord =
    frontmatter && typeof frontmatter === 'object'
      ? Object.fromEntries(Object.entries(frontmatter))
      : null;
  const noteType = getTradeIdentityNoteType(frontmatterRecord, file.path);

  if (noteType === 'backtest-trade') {
    return 'backtest';
  }

  if (noteType === 'trade') {
    return 'regular';
  }

  if (
    frontmatter?.isMissedTrade === true ||
    frontmatter?.isMissedTrade === 'true' ||
    frontmatter?.type === 'missed-trade' ||
    /-M\d+\.md$/i.test(file.path)
  ) {
    return 'missed';
  }

  return 'regular';
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

async function runBatchOperation(
  app: App,
  tradeFilePaths: string[],
  operation: {
    applyToTradeData: (
      tradeData: TradeData,
      context: TradeDataMutationContext
    ) => {
      shouldApplyPrimaryMutation: boolean;
      nextTradeData: TradeData;
    };
    applyToFrontmatterPatch: (
      frontmatter: Record<string, unknown>
    ) => FrontmatterMutationResult;
    requireAuthoritativeMetadataRead?: boolean;
    introducedTags?: string[];
  }
): Promise<BatchOperationResult> {
  let processed = 0;
  let skipped = 0;
  let errors = 0;
  const total = tradeFilePaths.length;
  const touchedRegularFilePaths: string[] = [];
  const touchedMissedFilePaths: string[] = [];
  const touchedBacktestFilePaths: string[] = [];
  const touchedFrontmatterPatchedFiles: TFile[] = [];
  const removalPaths = new Set(tradeFilePaths);
  const relocatedRemovalPaths = new Set<string>();

  const plugin = getPluginInstance();
  const tradeService = getTradeServiceOrThrow();

  plugin?.backendIntegrationService?.addBatchModifiedFiles(tradeFilePaths);

  for (const filePath of tradeFilePaths) {
    try {
      const file = app.vault.getAbstractFileByPath(filePath);
      if (!(file instanceof TFile)) {
        console.warn(`File not found or not a TFile: ${filePath}`);
        errors++;
        continue;
      }

      const noteKind = getNoteKind(app, file);

      const applyFrontmatterPatch =
        async (): Promise<FrontmatterMutationResult> => {
          let mutationResult: FrontmatterMutationResult = {
            didPrimaryMutation: false,
            didIdentityBackfill: false,
          };

          await app.fileManager.processFrontMatter(
            file,
            (frontmatter: Record<string, unknown>) => {
              const frontmatterRecord = frontmatter;
              const noteType = getTradeIdentityNoteType(
                frontmatterRecord,
                file.path
              );
              const identityBackfillResult =
                noteType !== null
                  ? ensureTradeIdentityFrontmatter(frontmatterRecord)
                  : null;

              const primaryMutation =
                operation.applyToFrontmatterPatch(frontmatterRecord);

              mutationResult = {
                didPrimaryMutation: primaryMutation.didPrimaryMutation,
                didIdentityBackfill: identityBackfillResult?.changed ?? false,
              };
            }
          );

          return mutationResult;
        };

      const applyPatchedMutationResult = (
        mutationResult: FrontmatterMutationResult,
        kind: NonRegularBatchNoteKind
      ): void => {
        const touchedByPatch =
          mutationResult.didPrimaryMutation ||
          mutationResult.didIdentityBackfill === true;

        if (touchedByPatch) {
          if (kind === 'missed') {
            touchedMissedFilePaths.push(file.path);
          } else {
            touchedBacktestFilePaths.push(file.path);
          }
          touchedFrontmatterPatchedFiles.push(file);
        }

        if (mutationResult.didPrimaryMutation) {
          processed++;
        } else {
          skipped++;
        }
      };

      if (noteKind !== 'regular') {
        const readPreviousTags = async (): Promise<string[]> => {
          const currentFrontmatter = operation.requireAuthoritativeMetadataRead
            ? await readFrontmatterFromDisk(app, file)
            : app.metadataCache.getFileCache(file)?.frontmatter;
          return currentFrontmatter
            ? dedupeStrings([
                ...normalizeStringArray(currentFrontmatter.tags),
                ...normalizeStringArray(currentFrontmatter.customTags),
              ])
            : [];
        };
        const mutationResult = operation.introducedTags?.length
          ? await plugin?.optionsService.runWithTagAssignments(
              operation.introducedTags,
              applyFrontmatterPatch,
              readPreviousTags
            )
          : await applyFrontmatterPatch();
        if (!mutationResult) {
          throw new Error(
            'Options service is required for batch tag mutations'
          );
        }
        applyPatchedMutationResult(mutationResult, noteKind);
        continue;
      }

      const { frontmatter, tradeData } = await readCanonicalTradeSource(
        app,
        tradeService,
        file
      );

      if (!tradeData) {
        throw new Error(
          `Could not extract canonical trade data for batch mutation: ${file.path}`
        );
      }

      const { shouldApplyPrimaryMutation, nextTradeData } =
        operation.applyToTradeData(tradeData, {
          frontmatter,
        });

      const needsIdentityBackfill =
        !nextTradeData.tradeId || !nextTradeData.schemaVersion;

      if (!shouldApplyPrimaryMutation && !needsIdentityBackfill) {
        skipped++;
        continue;
      }

      try {
        const updatedPath = await tradeService.updateTrade(
          nextTradeData,
          filePath,
          'user-input'
        );

        touchedRegularFilePaths.push(updatedPath);
        plugin?.backendIntegrationService?.addBatchModifiedFiles([updatedPath]);
        if (updatedPath !== filePath) {
          relocatedRemovalPaths.add(updatedPath);
        }

        if (shouldApplyPrimaryMutation) {
          processed++;
        } else {
          skipped++;
        }
      } catch (updateError) {
        if (!shouldApplyPrimaryMutation) {
          skipped++;
          continue;
        }

        throw updateError;
      }
    } catch (error) {
      console.error(`Failed batch operation for trade: ${filePath}`, error);
      errors++;
    }
  }

  if (
    touchedFrontmatterPatchedFiles.length > 0 &&
    typeof app.metadataCache?.getCache === 'function' &&
    typeof app.vault.cachedRead === 'function'
  ) {
    await Promise.all(
      touchedFrontmatterPatchedFiles.map((file) =>
        forceMetadataCacheRefresh(app, file, 120).catch((_error) => {
          // intentional
        })
      )
    );
  }

  if (touchedRegularFilePaths.length > 0) {
    publishBatchTradeChanged(touchedRegularFilePaths);
  }

  for (const filePath of dedupeStrings(touchedMissedFilePaths)) {
    eventBus.publish('missed-trade:changed', {
      action: 'updated',
      filePath,
      timestamp: Date.now(),
    });
  }

  for (const filePath of dedupeStrings(touchedBacktestFilePaths)) {
    eventBus.publish('backtest-trade:changed', {
      action: 'updated',
      filePath,
      timestamp: Date.now(),
    });
  }

  
  window.setTimeout(() => {
    plugin?.backendIntegrationService?.removeBatchModifiedFiles(
      Array.from(removalPaths)
    );
  }, 500);

  if (relocatedRemovalPaths.size > 0) {
    window.setTimeout(() => {
      plugin?.backendIntegrationService?.removeBatchModifiedFiles(
        Array.from(relocatedRemovalPaths)
      );
    }, 5_500);
  }

  return { processed, skipped, errors, total };
}

export async function batchMarkAsReviewed(
  app: App,
  tradeFilePaths: string[]
): Promise<BatchOperationResult> {
  return runBatchOperation(app, tradeFilePaths, {
    applyToTradeData: (tradeData) => {
      if (tradeData.reviewed === true) {
        return {
          shouldApplyPrimaryMutation: false,
          nextTradeData: tradeData,
        };
      }

      return {
        shouldApplyPrimaryMutation: true,
        nextTradeData: {
          ...tradeData,
          reviewed: true,
          reviewedAt: new Date().toISOString(),
        },
      };
    },
    applyToFrontmatterPatch: (frontmatter) => {
      if (frontmatter.reviewed === true) {
        return { didPrimaryMutation: false };
      }

      frontmatter.reviewed = true;
      frontmatter.reviewedAt = new Date().toISOString();
      return { didPrimaryMutation: true };
    },
  });
}

export async function batchAddSetups(
  app: App,
  tradeFilePaths: string[],
  _setupIds: string[],
  setupNames: string[]
): Promise<BatchOperationResult> {
  return runBatchOperation(app, tradeFilePaths, {
    applyToTradeData: (tradeData) => {
      const existingNames = normalizeStringArray(tradeData.setup);
      const mergedNames = dedupeStrings([...existingNames, ...setupNames]);
      const allExist = setupNames.every((name) => existingNames.includes(name));

      if (allExist) {
        return {
          shouldApplyPrimaryMutation: false,
          nextTradeData: tradeData,
        };
      }

      return {
        shouldApplyPrimaryMutation: true,
        nextTradeData: {
          ...tradeData,
          setup: mergedNames,
        },
      };
    },
    applyToFrontmatterPatch: (frontmatter) => {
      const existingNames = normalizeStringArray(frontmatter.setup);
      const mergedNames = dedupeStrings([...existingNames, ...setupNames]);
      const allExist = setupNames.every((name) => existingNames.includes(name));

      if (allExist) {
        return { didPrimaryMutation: false };
      }

      frontmatter.setup = mergedNames;
      return { didPrimaryMutation: true };
    },
  });
}


export async function batchAddMistakes(
  app: App,
  tradeFilePaths: string[],
  mistakes: string[]
): Promise<BatchOperationResult> {
  const mistakeIds = mistakes;
  const mistakeNames = mistakes;

  return runBatchOperation(app, tradeFilePaths, {
    applyToTradeData: (tradeData) => {
      const merge = buildOptionMerge(
        tradeData.mistakeIds,
        tradeData.mistake,
        mistakeIds,
        mistakeNames
      );

      if (merge.allExist) {
        return {
          shouldApplyPrimaryMutation: false,
          nextTradeData: tradeData,
        };
      }

      return {
        shouldApplyPrimaryMutation: true,
        nextTradeData: {
          ...tradeData,
          mistakeIds: merge.mergedIds,
          mistake: merge.mergedNames,
        },
      };
    },
    applyToFrontmatterPatch: (frontmatter) => {
      const merge = buildOptionMerge(
        frontmatter.mistakeIds,
        frontmatter.mistake,
        mistakeIds,
        mistakeNames
      );

      if (merge.allExist) {
        return { didPrimaryMutation: false };
      }

      frontmatter.mistakeIds = merge.mergedIds;
      frontmatter.mistake = merge.mergedNames;
      return { didPrimaryMutation: true };
    },
  });
}

export async function batchAddTags(
  app: App,
  tradeFilePaths: string[],
  tags: string[]
): Promise<BatchOperationResult> {
  return runBatchOperation(app, tradeFilePaths, {
    requireAuthoritativeMetadataRead: true,
    introducedTags: tags,
    applyToTradeData: (tradeData, context) => {
      const merge = buildTagMerge(
        tradeData.tags,
        context.frontmatter?.customTags,
        tags
      );

      if (merge.isCanonicalNoOp) {
        return {
          shouldApplyPrimaryMutation: false,
          nextTradeData: tradeData,
        };
      }

      return {
        shouldApplyPrimaryMutation: true,
        nextTradeData: {
          ...tradeData,
          tags: merge.mergedTags,
        },
      };
    },
    applyToFrontmatterPatch: (frontmatter) => {
      const merge = buildTagMerge(
        frontmatter.tags,
        frontmatter.customTags,
        tags
      );

      if (merge.isCanonicalNoOp) {
        return { didPrimaryMutation: false };
      }

      frontmatter.tags = merge.mergedTags;
      frontmatter.customTags = undefined;
      return { didPrimaryMutation: true };
    },
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

  
  await new Promise((resolve) => window.setTimeout(resolve, 500));

  publishBatchTradeChanged(tradeFilePaths);

  window.setTimeout(() => {
    plugin?.backendIntegrationService?.removeBatchModifiedFiles(tradeFilePaths);
  }, 500);

  return { processed, skipped: 0, errors, total };
}
