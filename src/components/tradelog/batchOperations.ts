

import { App, TFile } from 'obsidian';
import type { TradeData } from '../../services/trade/TradeService';
import { eventBus } from '../../services/events';
import { getPluginInstance } from '../../utils/pluginContext';
import {
  ensureTradeIdentityFrontmatter,
  getTradeIdentityNoteType,
} from '../../utils/tradeIdentity';
import { forceMetadataCacheRefresh } from '../../utils/dataRefresh';
import { normalizeStringArray } from '../../utils/dataUtils';

interface BatchOperationResult {
  processed: number;
  skipped: number;
  errors: number;
  total: number;
}

interface TradeServiceLike {
  extractTradeData: (file: TFile) => Promise<TradeData | null>;
  updateTrade: (
    data: TradeData,
    filePath: string,
    source?: string
  ) => Promise<string>;
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

function getTradeServiceOrThrow(): TradeServiceLike {
  const tradeService = getPluginInstance()?.tradeService as
    | TradeServiceLike
    | undefined;

  if (!tradeService) {
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
      ? (frontmatter as Record<string, unknown>)
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

          await app.fileManager.processFrontMatter(file, (frontmatter) => {
            const frontmatterRecord = frontmatter as Record<string, unknown>;
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
          });

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
        const mutationResult = await applyFrontmatterPatch();
        applyPatchedMutationResult(mutationResult, noteKind);
        continue;
      }

      const canRefreshMetadata =
        typeof app.metadataCache?.getCache === 'function' &&
        typeof app.vault.cachedRead === 'function';

      if (operation.requireAuthoritativeMetadataRead && canRefreshMetadata) {
        await forceMetadataCacheRefresh(app, file, 0).catch((_error) => {
          // intentional
        });
      }

      let tradeData = await tradeService.extractTradeData(file);
      if (!tradeData && canRefreshMetadata) {
        await forceMetadataCacheRefresh(app, file, 0).catch((_error) => {
          // intentional
        });
        tradeData = await tradeService.extractTradeData(file);
      }

      if (!tradeData) {
        throw new Error(
          `Could not extract canonical trade data for batch mutation: ${file.path}`
        );
      }

      const frontmatter = app.metadataCache?.getFileCache(file)?.frontmatter;
      const frontmatterRecord =
        frontmatter && typeof frontmatter === 'object'
          ? (frontmatter as Record<string, unknown>)
          : null;

      const { shouldApplyPrimaryMutation, nextTradeData } =
        operation.applyToTradeData(tradeData, {
          frontmatter: frontmatterRecord,
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

  
  setTimeout(() => {
    plugin?.backendIntegrationService?.removeBatchModifiedFiles(
      Array.from(removalPaths)
    );
  }, 500);

  if (relocatedRemovalPaths.size > 0) {
    setTimeout(() => {
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
    requireAuthoritativeMetadataRead: true,
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
  setupIds: string[],
  setupNames: string[]
): Promise<BatchOperationResult> {
  return runBatchOperation(app, tradeFilePaths, {
    applyToTradeData: (tradeData) => {
      const merge = buildOptionMerge(
        tradeData.setupIds,
        tradeData.setup,
        setupIds,
        setupNames
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
          setupIds: merge.mergedIds,
          setup: merge.mergedNames,
        },
      };
    },
    applyToFrontmatterPatch: (frontmatter) => {
      const merge = buildOptionMerge(
        frontmatter.setupIds,
        frontmatter.setup,
        setupIds,
        setupNames
      );

      if (merge.allExist) {
        return { didPrimaryMutation: false };
      }

      frontmatter.setupIds = merge.mergedIds;
      frontmatter.setup = merge.mergedNames;
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

  
  await new Promise((resolve) => setTimeout(resolve, 500));

  publishBatchTradeChanged(tradeFilePaths);

  setTimeout(() => {
    plugin?.backendIntegrationService?.removeBatchModifiedFiles(tradeFilePaths);
  }, 500);

  return { processed, skipped: 0, errors, total };
}
