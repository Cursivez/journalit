

import { useSyncExternalStore } from 'react';
import type JournalitPlugin from '../main';
import type { SessionIndicatorPhase } from '../services/sessionMode/SessionPhaseWatcher';

export function useSessionIndicatorPhase(
  plugin: JournalitPlugin
): SessionIndicatorPhase {
  const watcher = plugin.ensureSessionPhaseWatcher();
  return useSyncExternalStore(
    watcher.subscribe,
    watcher.getSnapshot,
    watcher.getSnapshot
  );
}
