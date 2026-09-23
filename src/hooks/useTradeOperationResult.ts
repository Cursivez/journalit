import { useSyncExternalStore } from 'react';
import type JournalitPlugin from '../main';
import type { TradeOperationSnapshot } from '../services/tradeOperations/types';

export function useTradeOperationResult(
  plugin: JournalitPlugin
): TradeOperationSnapshot {
  const service = plugin.ensureTradeOperationResultService();
  return useSyncExternalStore(
    service.subscribe,
    service.getSnapshot,
    service.getSnapshot
  );
}
