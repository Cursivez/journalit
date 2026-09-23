import type JournalitPlugin from '../../main';
import { TradeProjectionWriter } from './TradeProjectionWriter';
import type {
  TradeProjectionAckClient,
  TradeProjectionRestoreInput,
  TradeProjectionRestoreResult,
  TradeProjectionWriteResult,
} from './types';

export class TradeProjectionRestoreService {
  constructor(
    private readonly plugin: JournalitPlugin,
    private readonly projectionBackend: TradeProjectionAckClient
  ) {}

  async restoreProjections({
    accountName,
    brokerLabel,
    projections,
    ownerUserId,
    requestOptions = {},
    shouldStop,
    clientOperation,
    localWriteTimeoutMs,
    onComplete,
  }: TradeProjectionRestoreInput): Promise<TradeProjectionRestoreResult> {
    const projectionWriter = new TradeProjectionWriter(
      this.plugin,
      this.projectionBackend
    );
    const projectionResults: TradeProjectionWriteResult[] = [];
    if (!shouldStop?.() && projections.length > 0) {
      projectionResults.push(
        await projectionWriter.writeProjections({
          accountName,
          accountBroker: brokerLabel,
          accountDisplayName: accountName,
          trades: projections.map((projection) => ({
            id: projection.id,
            version: projection.version,
            projectionGeneration: projection.projectionGeneration,
            symbol: projection.symbol,
            direction: projection.direction,
            status: projection.status,
            accountId: projection.accountId,
            accountIdentity: projection.accountIdentity,
            accountDisplayName: projection.accountName,
            broker: projection.broker,
            importId: projection.importId,
            previewTrade: projection.previewTrade,
          })),
          ownerUserId,
          requestOptions,
          shouldStop,
          clientOperation,
          localWriteTimeoutMs,
        })
      );
    }

    const writtenCount = projectionResults.reduce(
      (total, result) => total + result.writtenCount,
      0
    );
    const duplicateCount = projectionResults.reduce(
      (total, result) => total + result.alreadyPresentCount,
      0
    );
    const failedCount = projectionResults.reduce(
      (total, result) => total + result.failedCount,
      0
    );
    const pendingCount = projectionResults.reduce(
      (total, result) => total + result.pendingCount,
      0
    );
    const ackFailedCount = projectionResults.reduce(
      (total, result) => total + result.ackFailedCount,
      0
    );
    const result: TradeProjectionRestoreResult = {
      success: failedCount === 0 && pendingCount === 0 && ackFailedCount === 0,
      writtenCount,
      duplicateCount,
      failedCount,
      pendingCount,
      ackFailedCount,
      accountName,
      brokerLabel,
      importedTrades: projectionResults.flatMap(
        (projectionResult) => projectionResult.importedTrades
      ),
    };
    onComplete?.(result);
    return result;
  }
}
