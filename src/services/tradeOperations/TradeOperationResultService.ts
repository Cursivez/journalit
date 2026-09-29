import { normalizePath } from 'obsidian';
import type JournalitPlugin from '../../main';
import { getTradeProjectionOwnerId } from '../tradeSync/TradeProjectionOwnership';
import type {
  TradeOperationResult,
  TradeOperationScope,
  TradeOperationSnapshot,
  TradeOperationTrade,
} from './types';
import { requestTradeOperationResultNotice } from './resultNotice';
import { shouldAnnounceSyncCompletion } from './presentationPolicy';

function deduplicateTrades(
  trades: readonly TradeOperationTrade[]
): TradeOperationTrade[] {
  const byPath = new Map<string, TradeOperationTrade>();
  for (const trade of trades) {
    const filePath = normalizePath(trade.filePath);
    const current = byPath.get(filePath);
    if (!current || trade.change === 'updated') {
      byPath.set(filePath, { ...trade, filePath });
    }
  }
  return Array.from(byPath.values());
}

function uniqueSorted(values: readonly string[]): string[] {
  const uniqueValues = new Set<string>();
  for (const value of values) {
    const trimmed = value.trim();
    if (trimmed) uniqueValues.add(trimmed);
  }
  return Array.from(uniqueValues).sort((a, b) => a.localeCompare(b));
}

function normalizeTradeOperationResult(
  result: TradeOperationResult
): TradeOperationResult {
  const trades = deduplicateTrades(result.trades);
  return {
    ...result,
    counts: {
      ...result.counts,
      created: trades.filter((trade) => trade.change === 'created').length,
      updated: trades.filter((trade) => trade.change === 'updated').length,
    },
    trades,
    accountNames: uniqueSorted([
      ...result.accountNames,
      ...trades.map((trade) => trade.accountName),
    ]),
    brokerLabels: uniqueSorted(result.brokerLabels),
  };
}

export class TradeOperationResultService {
  private snapshot: TradeOperationSnapshot = {
    recentResult: null,
    activeTradeLogScope: null,
  };
  private readonly listeners = new Set<() => void>();
  private destroyed = false;

  constructor(private readonly plugin: JournalitPlugin) {
    const clearForOwnerChange = () => this.clearIfOwnerChanged();
    window.addEventListener(
      'journalit:subscription-changed',
      clearForOwnerChange
    );
    plugin.register(() =>
      window.removeEventListener(
        'journalit:subscription-changed',
        clearForOwnerChange
      )
    );
  }

  readonly subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  readonly getSnapshot = (): TradeOperationSnapshot => this.snapshot;

  record(result: TradeOperationResult): TradeOperationResult | null {
    const normalized = normalizeTradeOperationResult(result);
    if (this.destroyed || normalized.trades.length === 0) {
      return null;
    }
    const currentOwner = getTradeProjectionOwnerId(this.plugin);
    if (!currentOwner || currentOwner !== normalized.ownerUserId) {
      return null;
    }
    this.setSnapshot({
      recentResult: normalized,
      activeTradeLogScope: this.snapshot.activeTradeLogScope,
    });
    if (
      normalized.kind === 'sync' &&
      shouldAnnounceSyncCompletion(this.plugin)
    ) {
      requestTradeOperationResultNotice(normalized.id);
    }
    return normalized;
  }

  openTradeLogScope(result: TradeOperationResult): void {
    const normalized = normalizeTradeOperationResult(result);
    if (normalized.trades.length === 0) return;
    const currentOwner = getTradeProjectionOwnerId(this.plugin);
    if (!currentOwner || currentOwner !== normalized.ownerUserId) return;
    const scope: TradeOperationScope = {
      operationId: normalized.id,
      ownerUserId: normalized.ownerUserId,
      filePaths: normalized.trades.map((trade) => trade.filePath),
      accountNames: normalized.accountNames,
    };
    this.setSnapshot({
      recentResult: this.snapshot.recentResult,
      activeTradeLogScope: scope,
    });
  }

  clearTradeLogScope(): void {
    if (!this.snapshot.activeTradeLogScope) return;
    this.setSnapshot({
      recentResult: this.snapshot.recentResult,
      activeTradeLogScope: null,
    });
  }

  clearRecentResult(): void {
    if (!this.snapshot.recentResult) return;
    this.setSnapshot({
      recentResult: null,
      activeTradeLogScope: this.snapshot.activeTradeLogScope,
    });
  }

  destroy(): void {
    this.destroyed = true;
    this.listeners.clear();
    this.snapshot = { recentResult: null, activeTradeLogScope: null };
  }

  private clearIfOwnerChanged(): void {
    const ownerUserIds = [
      this.snapshot.recentResult?.ownerUserId,
      this.snapshot.activeTradeLogScope?.ownerUserId,
    ].filter((ownerUserId): ownerUserId is string => Boolean(ownerUserId));
    const currentOwner = getTradeProjectionOwnerId(this.plugin);
    if (
      ownerUserIds.length === 0 ||
      ownerUserIds.every((ownerUserId) => ownerUserId === currentOwner)
    ) {
      return;
    }
    this.setSnapshot({ recentResult: null, activeTradeLogScope: null });
  }

  private setSnapshot(snapshot: TradeOperationSnapshot): void {
    if (this.destroyed) return;
    this.snapshot = snapshot;
    for (const listener of this.listeners) listener();
  }
}
