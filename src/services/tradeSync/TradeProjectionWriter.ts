import type JournalitPlugin from '../../main';
import { OptionType } from '../options/CustomOptionsService';
import type { TradeData } from '../trade/TradeService';
import type {
  TradeCommitEventBatch,
  TradeCreationBatch,
} from '../trade/core/TradeCommandService';
import {
  CANONICAL_PROJECTION_CLEAR_FIELDS,
  CANONICAL_PROJECTION_EMPTY_ARRAY_FIELDS,
  hasCanonicalProjectionIdentity,
} from '../trade/core/CanonicalProjectionFields';
import { mapProjectionTradeToTradeData } from './canonicalTradeMapper';
import { applyInstrumentCostRulesToProjection } from './projectionCostRules';
import {
  clearLocalDeletedTradeProjection,
  getTradeProjectionVaultId,
  isLocallyDeletedTradeProjection,
  migrateQueuedTradeProjectionTombstones,
  sendTradeProjectionAckWithResult,
} from './TradeProjectionAckQueue';
import { getTradeProjectionOwnerId } from './TradeProjectionOwnership';
import { TradovateClientDiagnosticsService } from './TradovateClientDiagnosticsService';
import { parseTradeProjectionGenerationOrder } from './TradeProjectionGeneration';
import {
  areSnapshotKeysClaimedByCustomFields,
  shouldInvalidateUnrealizedSnapshot,
  hasUnrealizedPriceSnapshot,
} from '../../utils/unrealizedPnl';
import { safeParseDateValue } from '../../utils/dateUtils';
import { deduplicateOptions } from '../../utils/stringNormalization';
import {
  hasPendingTradeProjectionDeletionIntent,
  runWithTradeProjectionWriteLock,
} from './TradeProjectionWriteLock';
import type {
  TradeProjectionAckClient,
  TradeProjectionAckRequest,
  TradeProjectionCommittedTrade,
  TradeProjectionPersistedTradeSummary,
  TradeProjectionRequestOptions,
  TradeProjectionWriteResult,
  BrokerClientDiagnosticErrorCode,
  BrokerClientOperationContext,
} from './types';

interface TradeProjectionWriteInput {
  accountName: string;
  accountBroker?: string | null;
  accountDisplayName?: string | null;
  trades: TradeProjectionCommittedTrade[];
  ownerUserId?: string;
  requestOptions?: TradeProjectionRequestOptions;
  shouldStop?: () => boolean;
  localTradeDataByTradeId?: Map<string, TradeData>;
  clientOperation?: BrokerClientOperationContext;
  localWriteTimeoutMs?: number;
}

interface ProjectionSingleWriteResult {
  summary?: TradeProjectionPersistedTradeSummary;
  ackResult: TradeProjectionAckRequest['results'][number];
  existed: boolean;
  failed: boolean;
  pending: boolean;
  settlement?: Promise<ProjectionSingleWriteResult>;
}

const BACKEND_OWNED_TRADE_FIELDS = [
  ...CANONICAL_PROJECTION_CLEAR_FIELDS,
  'account',
] as const;

const SNAPSHOT_QUOTE_CONTEXT_FIELDS = [
  'instrument',
  'direction',
  'currency',
  'assetType',
  'exchange',
  'expirationDate',
  'strikePrice',
  'optionType',
  'contractSize',
  'contractSymbol',
  'dollarPerPoint',
  'tickSize',
  'tickValue',
  'currencyPair',
  'lotSize',
  'pipValue',
  'tradingPair',
  'cryptoExchange',
] as const;

function hasSnapshotQuoteContextChanged(
  previous: TradeData,
  next: TradeData
): boolean {
  const previousRecord = previous as Record<string, unknown>;
  const nextRecord = next as Record<string, unknown>;
  return SNAPSHOT_QUOTE_CONTEXT_FIELDS.some((field) => {
    if (field !== 'expirationDate') {
      return previousRecord[field] !== nextRecord[field];
    }

    const previousDate = safeParseDateValue(previousRecord[field]);
    const nextDate = safeParseDateValue(nextRecord[field]);
    return previousDate && nextDate
      ? previousDate.getTime() !== nextDate.getTime()
      : previousRecord[field] !== nextRecord[field];
  });
}

function isProjectedTradeData(value: unknown): value is TradeData {
  return (
    typeof value === 'object' &&
    value !== null &&
    (hasCanonicalProjectionIdentity(value) ||
      ('tradeImportId' in value && typeof value.tradeImportId === 'string')) &&
    'path' in value &&
    typeof value.path === 'string'
  );
}

async function projectedTradesByBackendId(
  plugin: JournalitPlugin
): Promise<Map<string, TradeData[]>> {
  await plugin.tradeService.waitForTradeDataReady?.();
  const trades = await plugin.tradeService.getTradeData({ fresh: true });
  const allowLegacyTradeImportIdFallback =
    (plugin.settings.backendIntegration?.canonicalProjectionMigrationVersion ??
      0) < 1;
  const byBackendId = new Map<string, TradeData[]>();
  const addTrade = (trade: unknown) => {
    if (
      isProjectedTradeData(trade) &&
      (allowLegacyTradeImportIdFallback ||
        hasCanonicalProjectionIdentity(trade))
    ) {
      const canonicalTradeId = hasCanonicalProjectionIdentity(trade)
        ? trade.canonicalTradeId
        : allowLegacyTradeImportIdFallback
          ? trade.tradeImportId
          : undefined;
      if (!canonicalTradeId) return;
      const matchingTrades = byBackendId.get(canonicalTradeId) ?? [];
      if (!matchingTrades.some((item) => item.path === trade.path)) {
        matchingTrades.push(trade);
      }
      byBackendId.set(canonicalTradeId, matchingTrades);
    }
  };
  for (const trade of trades) {
    addTrade(trade);
  }
  const knownPaths = new Set(trades.map((trade) => trade.path));
  const outsideCandidates = (
    plugin.app?.vault.getMarkdownFiles?.() ?? []
  ).filter((file) => {
    if (knownPaths.has(file.path)) return false;
    const frontmatter =
      plugin.app.metadataCache.getFileCache(file)?.frontmatter;
    return (
      hasCanonicalProjectionIdentity(frontmatter) ||
      (allowLegacyTradeImportIdFallback &&
        typeof frontmatter?.tradeImportId === 'string')
    );
  });
  const outsideTrades = await Promise.all(
    outsideCandidates.map((file) => plugin.tradeService.extractTradeData(file))
  );
  for (const trade of outsideTrades) addTrade(trade);
  return byBackendId;
}

function mergeProjectionTradeData(
  existing: TradeData,
  tradeData: TradeData
): TradeData {
  const merged: TradeData = { ...existing };
  const mergedRecord = merged as Record<string, unknown>;
  const tradeDataRecord = tradeData as Record<string, unknown>;
  for (const field of BACKEND_OWNED_TRADE_FIELDS) {
    if (tradeDataRecord[field] !== undefined) {
      mergedRecord[field] = tradeDataRecord[field];
    } else {
      delete merged[field];
    }
  }
  merged.skipDefaultRiskAmount = true;
  return merged;
}

function projectionClearFields(
  tradeData: TradeData
): TradeData['canonicalProjectionClearFields'] {
  const record = tradeData as Record<string, unknown>;
  return CANONICAL_PROJECTION_CLEAR_FIELDS.filter((field) => {
    if (field === 'rMultiple') {
      return record.authoritativePnl === null;
    }
    if (field === 'hasExplicitCommission') {
      return record.commission === undefined || record.commission === null;
    }
    if (field === 'hasExplicitExitPrice') {
      return record.exitPrice === undefined || record.exitPrice === null;
    }
    const value = record[field];
    if (value === undefined || value === null) return true;
    return (
      CANONICAL_PROJECTION_EMPTY_ARRAY_FIELDS.has(field) &&
      Array.isArray(value) &&
      value.length === 0
    );
  });
}

function summaryFor(
  filePath: string,
  projectionTrade: NonNullable<TradeProjectionCommittedTrade['previewTrade']>,
  canonicalNetProfitLoss: number | null | undefined
): TradeProjectionPersistedTradeSummary {
  return {
    filePath,
    symbol: projectionTrade.symbol,
    direction: projectionTrade.direction,
    quantity: projectionTrade.quantity,
    entryPrice: projectionTrade.entryPrice,
    profitLoss: canonicalNetProfitLoss ?? undefined,
    entryTime: projectionTrade.entryTime,
    status: projectionTrade.status,
  };
}

function failedProjectionResult(
  committedTrade: TradeProjectionCommittedTrade,
  errorCode: string
): ProjectionSingleWriteResult {
  return {
    ackResult: {
      tradeId: committedTrade.id,
      backendTradeVersion: committedTrade.version,
      localRevision: committedTrade.projectionGeneration,
      status: 'failed',
      errorCode,
    },
    existed: false,
    failed: true,
    pending: false,
  };
}

function pendingProjectionResult(
  committedTrade: TradeProjectionCommittedTrade,
  errorCode: string
): ProjectionSingleWriteResult {
  return {
    ackResult: {
      tradeId: committedTrade.id,
      backendTradeVersion: committedTrade.version,
      localRevision: committedTrade.projectionGeneration,
      
      
      status: 'failed',
      errorCode,
    },
    existed: false,
    failed: false,
    pending: true,
  };
}

interface ProjectionWriteExecution {
  result: TradeProjectionWriteResult;
  settlement: Promise<void>;
}

function assertUniqueProjectionIds(
  trades: TradeProjectionCommittedTrade[]
): void {
  const tradeIds = new Set<string>();
  for (const trade of trades) {
    if (tradeIds.has(trade.id)) {
      throw new Error('Trade Projection response contains duplicate trade IDs');
    }
    tradeIds.add(trade.id);
  }
}

type LocalWriteOutcome<T> =
  | { kind: 'completed'; value: T }
  | { kind: 'timed_out'; settlement: Promise<T> };

function withLocalWriteTimeout<T>(
  work: Promise<T>,
  timeoutMs: number | undefined
): Promise<LocalWriteOutcome<T>> {
  if (!timeoutMs || !Number.isFinite(timeoutMs) || timeoutMs <= 0) {
    return work.then((value) => ({ kind: 'completed', value }));
  }
  return new Promise<LocalWriteOutcome<T>>((resolve, reject) => {
    let settled = false;
    const timer = window.setTimeout(() => {
      if (settled) return;
      settled = true;
      resolve({ kind: 'timed_out', settlement: work });
    }, timeoutMs);
    work.then(
      (value) => {
        if (settled) return;
        settled = true;
        window.clearTimeout(timer);
        resolve({ kind: 'completed', value });
      },
      (error: unknown) => {
        if (settled) return;
        settled = true;
        window.clearTimeout(timer);
        reject(
          error instanceof Error
            ? error
            : new Error('Trade Projection local write failed')
        );
      }
    );
  });
}

export class TradeProjectionWriter {
  constructor(
    private readonly plugin: JournalitPlugin,
    private readonly backendService: TradeProjectionAckClient
  ) {}

  private async writeSingleProjection(
    committedTrade: TradeProjectionCommittedTrade,
    accountName: string,
    existingByBackendId: Map<string, TradeData[]>,
    localTradeDataByTradeId?: Map<string, TradeData>,
    shouldStop?: () => boolean,
    localWriteTimeoutMs?: number,
    commitEventBatch?: TradeCommitEventBatch,
    creationBatch?: TradeCreationBatch
  ): Promise<ProjectionSingleWriteResult> {
    try {
      if (shouldStop?.()) {
        return failedProjectionResult(committedTrade, 'plugin_unloaded');
      }
      const projectionTrade = committedTrade.previewTrade;
      if (!projectionTrade) {
        throw new Error('Trade Projection missing trade data');
      }
      const matchingTrades = existingByBackendId.get(committedTrade.id) ?? [];
      if (matchingTrades.length > 1) {
        return {
          ackResult: {
            tradeId: committedTrade.id,
            backendTradeVersion: committedTrade.version,
            localRevision: committedTrade.projectionGeneration,
            status: 'conflict',
            errorCode: 'duplicate_canonical_trade_id',
          },
          existed: false,
          failed: true,
          pending: false,
        };
      }
      const indexedExistingTrade = matchingTrades[0];
      const refreshedExistingTrade = indexedExistingTrade
        ? (await this.plugin.tradeService.getTradeData({ fresh: true })).find(
            (trade): trade is TradeData =>
              isProjectedTradeData(trade) &&
              trade.path === indexedExistingTrade.path
          )
        : undefined;
      const existingTrade: TradeData | undefined =
        refreshedExistingTrade ?? indexedExistingTrade;
      const existingProjectionGeneration =
        typeof existingTrade?.canonicalProjectionGeneration === 'string'
          ? existingTrade.canonicalProjectionGeneration
          : undefined;
      const effectiveGeneration =
        committedTrade.projectionGeneration ?? existingProjectionGeneration;
      const effectiveCommittedTrade = {
        ...committedTrade,
        projectionGeneration: effectiveGeneration,
      };
      const existingVersion = existingTrade?.canonicalTradeVersion;
      const existingGeneration = parseTradeProjectionGenerationOrder(
        existingTrade?.canonicalProjectionGeneration
      );
      const incomingGeneration =
        parseTradeProjectionGenerationOrder(effectiveGeneration);
      if (
        existingTrade &&
        ((existingVersion ?? 0) > committedTrade.version ||
          (existingVersion === committedTrade.version &&
            existingGeneration !== null &&
            incomingGeneration !== null &&
            existingGeneration > incomingGeneration))
      ) {
        return failedProjectionResult(
          effectiveCommittedTrade,
          'stale_projection_response'
        );
      }
      const canonicalTradeData = applyInstrumentCostRulesToProjection(
        mapProjectionTradeToTradeData(projectionTrade, accountName, {
          backendTradeId: committedTrade.id,
          backendVersion: committedTrade.version,
          projectionGeneration: effectiveGeneration,
          accountId: committedTrade.accountId,
          accountBroker: committedTrade.broker,
          accountDisplayName: committedTrade.accountDisplayName,
        }),
        this.plugin.optionsService
      );
      const localTradeData = localTradeDataByTradeId?.get(committedTrade.id);
      const tradeData =
        !existingTrade && localTradeData
          ? mergeProjectionTradeData(localTradeData, canonicalTradeData)
          : canonicalTradeData;
      const projectedTradeData = existingTrade
        ? mergeProjectionTradeData(existingTrade, tradeData)
        : tradeData;
      if (
        existingTrade &&
        !areSnapshotKeysClaimedByCustomFields(
          this.plugin.customFieldsService?.getFields()
        ) &&
        hasUnrealizedPriceSnapshot(existingTrade) &&
        (shouldInvalidateUnrealizedSnapshot(
          existingTrade,
          projectedTradeData
        ) ||
          hasSnapshotQuoteContextChanged(existingTrade, projectedTradeData))
      ) {
        projectedTradeData.unrealizedPriceSnapshot = undefined;
        projectedTradeData.unrealizedPriceSnapshotTime = undefined;
      }
      projectedTradeData.canonicalProjectionClearFields =
        projectionClearFields(tradeData);
      const existingPath =
        typeof existingTrade?.path === 'string'
          ? existingTrade.path
          : undefined;
      if (shouldStop?.()) {
        return failedProjectionResult(
          effectiveCommittedTrade,
          'plugin_unloaded'
        );
      }
      if (
        hasPendingTradeProjectionDeletionIntent(
          this.plugin,
          committedTrade.id
        ) ||
        isLocallyDeletedTradeProjection(this.plugin, committedTrade.id)
      ) {
        return failedProjectionResult(effectiveCommittedTrade, 'local_deleted');
      }
      const projectionTags = deduplicateOptions([
        ...(canonicalTradeData.tags ?? []),
        ...(canonicalTradeData.customTags ?? []),
      ]);
      if (projectionTags.length > 0) {
        await this.plugin.optionsService.addOptions(
          OptionType.TAG,
          projectionTags
        );
      }
      const expectedTradeRevision =
        typeof existingTrade?.tradeRevision === 'number' &&
        Number.isInteger(existingTrade.tradeRevision) &&
        existingTrade.tradeRevision > 0
          ? existingTrade.tradeRevision
          : undefined;
      const write = existingPath
        ? expectedTradeRevision !== undefined
          ? this.plugin.tradeService.updateTrade(
              projectedTradeData,
              existingPath,
              'trade-import',
              commitEventBatch
                ? { expectedTradeRevision, commitEventBatch }
                : { expectedTradeRevision }
            )
          : commitEventBatch
            ? this.plugin.tradeService.updateTrade(
                projectedTradeData,
                existingPath,
                'trade-import',
                { commitEventBatch }
              )
            : this.plugin.tradeService.updateTrade(
                projectedTradeData,
                existingPath,
                'trade-import'
              )
        : this.plugin.tradeService.createTrade(
            projectedTradeData,
            commitEventBatch
              ? {
                  suppressAutoOpen: true,
                  suppressPostCreateTasks: true,
                  commitEventBatch,
                  creationBatch,
                }
              : {
                  suppressAutoOpen: true,
                  suppressPostCreateTasks: true,
                  creationBatch,
                }
          );
      const writeOutcome = await withLocalWriteTimeout(
        write,
        localWriteTimeoutMs
      );
      if (writeOutcome.kind === 'timed_out') {
        const pendingResult = pendingProjectionResult(
          effectiveCommittedTrade,
          'obsidian_write_timeout'
        );
        pendingResult.settlement = writeOutcome.settlement.then(
          async (lateFilePath) =>
            this.completeSuccessfulWrite(
              String(lateFilePath),
              effectiveCommittedTrade,
              projectionTrade,
              existingPath,
              canonicalTradeData.authoritativePnl
            ),
          () =>
            failedProjectionResult(
              effectiveCommittedTrade,
              'obsidian_write_failed'
            )
        );
        return pendingResult;
      }
      return this.completeSuccessfulWrite(
        String(writeOutcome.value),
        effectiveCommittedTrade,
        projectionTrade,
        existingPath,
        canonicalTradeData.authoritativePnl
      );
    } catch {
      return failedProjectionResult(committedTrade, 'obsidian_write_failed');
    }
  }

  private async completeSuccessfulWrite(
    filePath: string,
    committedTrade: TradeProjectionCommittedTrade,
    projectionTrade: NonNullable<TradeProjectionCommittedTrade['previewTrade']>,
    existingPath: string | undefined,
    canonicalNetProfitLoss: number | null | undefined
  ): Promise<ProjectionSingleWriteResult> {
    try {
      if (
        !existingPath &&
        hasPendingTradeProjectionDeletionIntent(this.plugin, committedTrade.id)
      ) {
        const recreatedFile =
          this.plugin.app.vault.getAbstractFileByPath(filePath);
        if (recreatedFile) {
          await this.plugin.app.fileManager.trashFile(recreatedFile);
        }
        return failedProjectionResult(committedTrade, 'local_deleted');
      }
      if (committedTrade.projectionGeneration?.startsWith('restore_')) {
        await clearLocalDeletedTradeProjection(this.plugin, committedTrade.id);
      }
      return {
        summary: summaryFor(filePath, projectionTrade, canonicalNetProfitLoss),
        ackResult: {
          tradeId: committedTrade.id,
          backendTradeVersion: committedTrade.version,
          localRevision: committedTrade.projectionGeneration,
          filePath,
          status: 'synced',
        },
        existed: Boolean(existingPath),
        failed: false,
        pending: false,
      };
    } catch {
      return failedProjectionResult(committedTrade, 'obsidian_write_failed');
    }
  }

  async writeProjections(
    input: TradeProjectionWriteInput
  ): Promise<TradeProjectionWriteResult> {
    assertUniqueProjectionIds(input.trades);
    const ownedInput = {
      ...input,
      ownerUserId: input.ownerUserId ?? getTradeProjectionOwnerId(this.plugin),
    };
    return runWithTradeProjectionWriteLock(this.plugin, async () => {
      await (
        this.plugin.canonicalProjectionMigrationService?.run() ??
        Promise.resolve()
      ).then(() => migrateQueuedTradeProjectionTombstones(this.plugin));
      const completed = await this.performWriteProjections(ownedInput);
      return {
        value: completed.result,
        settlement: completed.settlement,
      };
    });
  }

  private async performWriteProjections({
    accountName,
    accountBroker,
    accountDisplayName,

    trades,
    ownerUserId,
    localTradeDataByTradeId,
    shouldStop,
    clientOperation,
    localWriteTimeoutMs,
    requestOptions = {},
  }: TradeProjectionWriteInput): Promise<ProjectionWriteExecution> {
    const writeResults: ProjectionSingleWriteResult[] = [];
    const timedOutWriteSettlements: Promise<void>[] = [];
    let resolveInitialAck: (() => void) | undefined;
    const initialAckSent = new Promise<void>((resolve) => {
      resolveInitialAck = resolve;
    });
    const commitEventBatch =
      this.plugin.tradeService.createTradeCommitEventBatch();
    const creationBatch = this.plugin.tradeService.createTradeCreationBatch();
    try {
      const existingByBackendId = await projectedTradesByBackendId(this.plugin);
      let writeChain = Promise.resolve();
      let writeTimedOut = false;
      for (const committedTrade of trades) {
        writeChain = writeChain.then(async () => {
          if (writeTimedOut) {
            writeResults.push(
              pendingProjectionResult(
                committedTrade,
                'blocked_by_obsidian_write_timeout'
              )
            );
            return;
          }
          if (
            hasPendingTradeProjectionDeletionIntent(
              this.plugin,
              committedTrade.id
            )
          ) {
            writeResults.push(
              failedProjectionResult(committedTrade, 'local_deleted')
            );
            return;
          }
          if (isLocallyDeletedTradeProjection(this.plugin, committedTrade.id)) {
            writeResults.push({
              ackResult: {
                tradeId: committedTrade.id,
                backendTradeVersion: committedTrade.version,
                localRevision: committedTrade.projectionGeneration,
                status: 'local_deleted',
              },
              existed: true,
              failed: false,
              pending: false,
            });
            return;
          }
          const result = await this.writeSingleProjection(
            {
              ...committedTrade,
              broker: committedTrade.broker ?? accountBroker,
              accountDisplayName:
                committedTrade.accountDisplayName ?? accountDisplayName,
            },
            accountName,
            existingByBackendId,
            localTradeDataByTradeId,
            shouldStop,
            localWriteTimeoutMs,
            commitEventBatch,
            creationBatch
          );
          writeResults.push(result);
          writeTimedOut = result.pending;
          if (result.settlement) {
            timedOutWriteSettlements.push(
              result.settlement.then(async (settledResult) => {
                await initialAckSent;
                await this.sendAckResults(
                  [settledResult.ackResult],
                  requestOptions,
                  ownerUserId,
                  clientOperation
                );
              })
            );
          }
        });
      }
      await writeChain;
    } catch {
      for (const committedTrade of trades) {
        writeResults.push(
          failedProjectionResult(committedTrade, 'trade_cache_lookup_failed')
        );
      }
    }
    try {
      await creationBatch.flush();
    } catch (error) {
      console.warn(
        '[TradeProjectionWriter] Failed to finalize the projection creation batch:',
        error
      );
      const survivingCreationPaths = new Set<string>();
      for (const result of writeResults) {
        if (
          !result.failed &&
          !result.pending &&
          !result.existed &&
          result.summary &&
          this.plugin.app.vault.getAbstractFileByPath(result.summary.filePath)
        ) {
          survivingCreationPaths.add(result.summary.filePath);
        }
      }
      creationBatch.retainPaths(survivingCreationPaths);
      let survivingCreationsFinalized = false;
      if (survivingCreationPaths.size > 0) {
        try {
          await creationBatch.flush();
          survivingCreationsFinalized = true;
        } catch (recoveryError) {
          console.warn(
            '[TradeProjectionWriter] Failed to finalize surviving projection creations:',
            recoveryError
          );
          creationBatch.abandon();
        }
      } else {
        creationBatch.abandon();
      }
      const retainedCommitPaths = new Set<string>();
      const committedTradesById = new Map(
        trades.map((trade) => [trade.id, trade])
      );
      for (let index = 0; index < writeResults.length; index++) {
        const result = writeResults[index];
        const summaryPath = result.summary?.filePath;
        if (!result.failed && !result.pending && !result.existed) {
          if (
            survivingCreationsFinalized &&
            summaryPath &&
            survivingCreationPaths.has(summaryPath)
          ) {
            retainedCommitPaths.add(summaryPath);
            continue;
          }
          const committedTrade = committedTradesById.get(
            result.ackResult.tradeId
          );
          if (committedTrade) {
            writeResults[index] = failedProjectionResult(
              committedTrade,
              'obsidian_write_failed'
            );
          }
          continue;
        }
        if (!result.failed && !result.pending && result.summary) {
          retainedCommitPaths.add(result.summary.filePath);
        }
      }
      commitEventBatch.retainPaths(retainedCommitPaths);
    }
    try {
      commitEventBatch.flush();
    } catch (error) {
      console.warn(
        '[TradeProjectionWriter] Failed to publish the projection commit batch:',
        error
      );
    }

    const importedTrades = writeResults.flatMap((result) =>
      result.summary ? [result.summary] : []
    );
    const ackResults = writeResults.map((result) => result.ackResult);
    const writtenCount = writeResults.filter(
      (result) => !result.failed && !result.pending && !result.existed
    ).length;
    const alreadyPresentCount = writeResults.filter(
      (result) => !result.failed && !result.pending && result.existed
    ).length;
    const failedCount = writeResults.filter((result) => result.failed).length;
    const pendingCount = writeResults.filter((result) => result.pending).length;

    
    
    if (clientOperation?.provider === 'tradovate') {
      const diagnostics = new TradovateClientDiagnosticsService(this.plugin);
      const diagnosticCodes: BrokerClientDiagnosticErrorCode[] = [
        'obsidian_write_timeout',
        'blocked_by_obsidian_write_timeout',
        'obsidian_write_failed',
        'trade_cache_lookup_failed',
      ];
      await Promise.all(
        diagnosticCodes.map(async (diagnosticCode) => {
          const count = ackResults.filter(
            (result) => result.errorCode === diagnosticCode
          ).length;
          if (count > 0) {
            await diagnostics.record(clientOperation, {
              eventType: 'projection_write_failed',
              errorCode: diagnosticCode,
              count,
            });
          }
        })
      );
    }

    let ackFailedCount = 0;
    try {
      ackFailedCount = await this.sendAckResults(
        ackResults,
        requestOptions,
        ownerUserId,
        clientOperation
      );
    } finally {
      resolveInitialAck?.();
    }

    return {
      result: {
        writtenCount,
        alreadyPresentCount,
        failedCount,
        pendingCount,
        ackFailedCount,
        importedTrades,
        ackResults,
      },
      settlement: Promise.all(timedOutWriteSettlements).then(() => undefined),
    };
  }

  private async sendAckResults(
    ackResults: TradeProjectionAckRequest['results'],
    requestOptions: TradeProjectionRequestOptions,
    ownerUserId: string | undefined,
    clientOperation: BrokerClientOperationContext | undefined
  ): Promise<number> {
    if (ackResults.length === 0) return 0;
    const uniqueAckResults = Array.from(
      new Map(ackResults.map((result) => [result.tradeId, result])).values()
    );
    const vaultId = await getTradeProjectionVaultId(this.plugin);
    const ackDelivery = await sendTradeProjectionAckWithResult(
      this.plugin,
      this.backendService,
      {
        vaultId,
        deviceId: clientOperation?.deviceId,
        pluginVersion: clientOperation?.pluginVersion,
        clientOperationId: clientOperation?.clientOperationId,
        diagnosticSyncRunId:
          clientOperation?.scope === 'projection'
            ? clientOperation.syncRunId
            : undefined,
        diagnosticProvider: clientOperation?.provider,
        results: uniqueAckResults,
      },
      requestOptions,
      ownerUserId
    );
    return ackDelivery.permanentlyFailedResults.filter(
      (result) => result.status !== 'failed'
    ).length;
  }
}
