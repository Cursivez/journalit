import type JournalitPlugin from '../../main';
import type { TradeData } from '../trade/TradeService';
import { mapPreviewTradeToTradeData } from './canonicalTradeMapper';
import { BackendTradeImportService } from './BackendTradeImportService';
import {
  getTradeImportVaultId,
  sendTradeImportProjectionAckWithStatus,
} from './TradeImportProjectionAckQueue';
import type {
  TradeImportCommittedTrade,
  TradeImportPreviewTrade,
  TradeImportProjectionAckRequest,
} from './types';

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

interface TradeImportProjectionWriteResult {
  writtenCount: number;
  alreadyPresentCount: number;
  failedCount: number;
  ackFailedCount: number;
  importedTrades: TradeImportPersistedTradeSummary[];
  ackResults: TradeImportProjectionAckRequest['results'];
}

interface TradeImportProjectionWriteInput {
  accountName: string;
  accountBroker?: string | null;
  accountDisplayName?: string | null;
  correlationId: string;
  importId: string;
  commitId: string;
  trades: TradeImportCommittedTrade[];
  localWriteTimeoutMs: number;
}

interface ProjectionSingleWriteResult {
  summary?: TradeImportPersistedTradeSummary;
  ackResult: TradeImportProjectionAckRequest['results'][number];
  existed: boolean;
  failed: boolean;
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

async function projectedTradesByBackendId(
  plugin: JournalitPlugin
): Promise<Map<string, TradeData>> {
  await plugin.tradeService.waitForTradeDataReady?.();
  const trades = await plugin.tradeService.getTradeData();
  const byBackendId = new Map<string, TradeData>();
  for (const trade of trades) {
    if (isProjectedTradeData(trade)) {
      const tradeImportId = String(trade.tradeImportId);
      byBackendId.set(tradeImportId, trade);
    }
  }
  return byBackendId;
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

function summaryFor(
  filePath: string,
  projectionTrade: TradeImportPreviewTrade
): TradeImportPersistedTradeSummary {
  return {
    filePath,
    symbol: projectionTrade.symbol,
    direction: projectionTrade.direction,
    quantity: projectionTrade.quantity,
    entryPrice: projectionTrade.entryPrice,
    profitLoss: projectionTrade.profitLoss ?? undefined,
    entryTime: projectionTrade.entryTime,
    status: projectionTrade.status,
  };
}

function failedProjectionResult(
  committedTrade: TradeImportCommittedTrade,
  errorCode: string
): ProjectionSingleWriteResult {
  return {
    ackResult: {
      tradeId: committedTrade.id,
      backendTradeVersion: committedTrade.version,
      status: 'failed',
      errorCode,
    },
    existed: false,
    failed: true,
  };
}

export class TradeImportProjectionWriter {
  constructor(
    private plugin: JournalitPlugin,
    private backendService: BackendTradeImportService
  ) {}

  private async writeSingleProjection(
    committedTrade: TradeImportCommittedTrade,
    accountName: string,
    existingByBackendId: Map<string, TradeData>,
    localWriteTimeoutMs: number
  ): Promise<ProjectionSingleWriteResult> {
    try {
      const projectionTrade = committedTrade.previewTrade;
      if (!projectionTrade) {
        throw new Error('Trade Import projection missing trade data');
      }
      const existingTrade = existingByBackendId.get(committedTrade.id);
      const tradeData = mapPreviewTradeToTradeData(
        projectionTrade,
        accountName,
        {
          backendTradeId: committedTrade.id,
          backendVersion: committedTrade.version,
          accountId: committedTrade.accountId,
          accountBroker: committedTrade.broker,
          accountDisplayName: committedTrade.accountDisplayName,
        }
      );
      const projectedTradeData = existingTrade
        ? preserveLocalTradeAnnotations(tradeData, existingTrade)
        : tradeData;
      const existingPath =
        typeof existingTrade?.path === 'string'
          ? existingTrade.path
          : undefined;
      const filePath = String(
        existingPath
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
            ])
      );

      return {
        summary: summaryFor(filePath, projectionTrade),
        ackResult: {
          tradeId: committedTrade.id,
          backendTradeVersion: committedTrade.version,
          filePath,
          status: 'synced',
        },
        existed: Boolean(existingPath),
        failed: false,
      };
    } catch (error) {
      return failedProjectionResult(
        committedTrade,
        error instanceof Error && error.message.indexOf('timed out') >= 0
          ? 'obsidian_write_timeout'
          : 'obsidian_write_failed'
      );
    }
  }

  async writeProjections({
    accountName,
    accountBroker,
    accountDisplayName,
    correlationId,
    importId,
    commitId,
    trades,
    localWriteTimeoutMs,
  }: TradeImportProjectionWriteInput): Promise<TradeImportProjectionWriteResult> {
    const writeResults: ProjectionSingleWriteResult[] = [];
    try {
      const existingByBackendId = await projectedTradesByBackendId(this.plugin);
      let writeChain = Promise.resolve();
      for (const committedTrade of trades) {
        const tradeWithAccountMetadata = {
          ...committedTrade,
          broker: committedTrade.broker ?? accountBroker,
          accountDisplayName:
            committedTrade.accountDisplayName ?? accountDisplayName,
        };
        writeChain = writeChain.then(async () => {
          writeResults.push(
            await this.writeSingleProjection(
              tradeWithAccountMetadata,
              accountName,
              existingByBackendId,
              localWriteTimeoutMs
            )
          );
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

    const importedTrades = writeResults.flatMap((result) =>
      result.summary ? [result.summary] : []
    );
    const ackResults = writeResults.map((result) => result.ackResult);
    const writtenCount = writeResults.filter(
      (result) => !result.failed && !result.existed
    ).length;
    const alreadyPresentCount = writeResults.filter(
      (result) => !result.failed && result.existed
    ).length;
    const failedCount = writeResults.filter((result) => result.failed).length;

    let ackFailedCount = 0;
    if (ackResults.length) {
      const uniqueAckResults = Array.from(
        new Map(
          ackResults.map((ackResult) => [ackResult.tradeId, ackResult])
        ).values()
      );
      const sendStatus = await sendTradeImportProjectionAckWithStatus(
        this.plugin,
        this.backendService,
        {
          correlationId,
          importId,
          commitId,
          vaultId: await getTradeImportVaultId(this.plugin),
          results: uniqueAckResults,
        }
      );
      ackFailedCount =
        sendStatus !== 'failed'
          ? 0
          : uniqueAckResults.filter(
              (ackResult) => ackResult.status !== 'failed'
            ).length;
    }

    return {
      writtenCount,
      alreadyPresentCount,
      failedCount,
      ackFailedCount,
      importedTrades,
      ackResults,
    };
  }
}
