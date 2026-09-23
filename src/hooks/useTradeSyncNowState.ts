import { useSyncExternalStore } from 'react';
import type JournalitPlugin from '../main';
import type { TradeSyncNowSnapshot } from '../services/tradeSync/TradeSyncCoordinator';

export function useTradeSyncNowState(
  plugin: JournalitPlugin
): TradeSyncNowSnapshot {
  const coordinator = plugin.ensureTradeSyncCoordinator();
  return useSyncExternalStore(
    coordinator.subscribe,
    coordinator.getSnapshot,
    coordinator.getSnapshot
  );
}
