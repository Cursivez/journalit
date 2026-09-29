import { generateUUID } from '../../utils/uuid';
import type { TradeImportCompletionResult } from '../tradeImport/TradeImportWorkflowService';
import type {
  TradeProjectionPersistedTradeSummary,
  TradeProjectionSyncResult,
} from '../tradeSync/types';
import type {
  TradeOperationCounts,
  TradeOperationResult,
  TradeOperationSource,
  TradeOperationTrade,
} from './types';

function operationTrades(
  summaries: readonly TradeProjectionPersistedTradeSummary[]
): TradeOperationTrade[] {
  return summaries.map((summary) => ({
    filePath: summary.filePath,
    entryTime: summary.entryTime,
    accountName: summary.accountName,
    change: summary.change,
  }));
}

function countsForTrades(
  trades: readonly TradeOperationTrade[],
  overrides: Partial<TradeOperationCounts> = {}
): TradeOperationCounts {
  return {
    created: trades.filter((trade) => trade.change === 'created').length,
    updated: trades.filter((trade) => trade.change === 'updated').length,
    duplicates: 0,
    failed: 0,
    pending: 0,
    ackFailed: 0,
    ...overrides,
  };
}

function unique(values: readonly string[]): string[] {
  return Array.from(new Set(values.filter(Boolean)));
}

export function combineTradeProjectionSyncResults(
  results: readonly TradeProjectionSyncResult[]
): TradeProjectionSyncResult {
  const importedByPath = new Map<
    string,
    TradeProjectionPersistedTradeSummary
  >();
  for (const result of results) {
    for (const trade of result.importedTrades ?? []) {
      importedByPath.set(trade.filePath, trade);
    }
  }
  return {
    accountCount: results.reduce(
      (total, result) => total + result.accountCount,
      0
    ),
    writtenCount: results.reduce(
      (total, result) => total + result.writtenCount,
      0
    ),
    failedCount: results.reduce(
      (total, result) => total + result.failedCount,
      0
    ),
    pendingCount: results.reduce(
      (total, result) => total + result.pendingCount,
      0
    ),
    ackFailedCount: results.reduce(
      (total, result) => total + (result.ackFailedCount ?? 0),
      0
    ),
    partial: results.some(
      (result) =>
        Boolean(result.partial) ||
        result.failedCount > 0 ||
        result.pendingCount > 0 ||
        (result.ackFailedCount ?? 0) > 0
    ),
    importedTrades: Array.from(importedByPath.values()),
  };
}

export function combineAggregateTradeProjectionSnapshots(
  results: readonly TradeProjectionSyncResult[]
): TradeProjectionSyncResult | null {
  const latest = results[results.length - 1];
  if (!latest) return null;

  const importedByPath = new Map<
    string,
    TradeProjectionPersistedTradeSummary
  >();
  for (const result of results) {
    for (const trade of result.importedTrades ?? []) {
      importedByPath.set(trade.filePath, trade);
    }
  }

  
  
  
  return {
    ...latest,
    importedTrades: Array.from(importedByPath.values()),
  };
}

export function buildImportOperationResult({
  result,
  source,
  ownerUserId,
}: {
  result: TradeImportCompletionResult;
  source: Extract<TradeOperationSource, 'full-import' | 'quick-import'>;
  ownerUserId: string;
}): TradeOperationResult {
  const trades = operationTrades(result.importedTrades);
  return {
    id: generateUUID(),
    kind: 'import',
    source,
    completedAt: Date.now(),
    ownerUserId,
    counts: countsForTrades(trades, {
      duplicates: result.duplicateCount,
      failed: result.failedCount,
      pending: result.pendingCount,
    }),
    trades,
    accountNames: unique([result.accountName]),
    brokerLabels: unique([result.brokerLabel]),
    partial:
      !result.success || result.failedCount > 0 || result.pendingCount > 0,
  };
}

export function buildProjectionSyncOperationResult({
  result,
  source,
  ownerUserId,
}: {
  result: TradeProjectionSyncResult;
  source: Extract<
    TradeOperationSource,
    'manual-sync' | 'automatic-sync' | 'broker-panel' | 'projection-restore'
  >;
  ownerUserId: string;
}): TradeOperationResult {
  const trades = operationTrades(result.importedTrades ?? []);
  return {
    id: generateUUID(),
    kind: 'sync',
    source,
    completedAt: Date.now(),
    ownerUserId,
    counts: countsForTrades(trades, {
      failed: result.failedCount,
      pending: result.pendingCount,
      ackFailed: result.ackFailedCount ?? 0,
    }),
    trades,
    accountNames: unique(trades.map((trade) => trade.accountName)),
    
    
    brokerLabels: [],
    partial:
      result.partial === true ||
      result.failedCount > 0 ||
      result.pendingCount > 0 ||
      (result.ackFailedCount ?? 0) > 0,
  };
}
