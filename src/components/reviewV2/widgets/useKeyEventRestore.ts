import { Notice } from 'obsidian';
import { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import type JournalitPlugin from '../../../main';
import { importedKeyEventIdentityKey } from '../../../services/economicCalendar/EconomicCalendarService';
import type { NewsEvent } from '../../../services/weekly/types';
import { t } from '../../../lang/helpers';

type RestoreCheckState =
  | { status: 'idle' | 'checking' | 'complete' | 'error' }
  | { status: 'missing'; missingCount: number };

function restoreCheckReducer(
  _current: RestoreCheckState,
  next: RestoreCheckState
): RestoreCheckState {
  return next;
}

function incrementRevision(current: number): number {
  return current + 1;
}

interface UseKeyEventRestoreOptions {
  plugin: JournalitPlugin;
  events: readonly NewsEvent[];
  enabled: boolean;
  weekStartDate: Date | null;
  reloadEvents: () => Promise<void>;
}

export function useKeyEventRestore({
  plugin,
  events,
  enabled,
  weekStartDate,
  reloadEvents,
}: UseKeyEventRestoreOptions): {
  check: RestoreCheckState;
  isRestoring: boolean;
  restore: () => Promise<void>;
} {
  const [check, dispatchCheck] = useReducer(restoreCheckReducer, {
    status: 'idle',
  });
  const [revision, requestCheck] = useReducer(incrementRevision, 0);
  const [isRestoring, setIsRestoring] = useState(false);
  const identitySignature = useMemo(() => {
    const keys: string[] = [];
    for (const event of events) {
      const key = importedKeyEventIdentityKey(event);
      if (key !== undefined) keys.push(key);
    }
    return keys.sort().join('\n');
  }, [events]);
  const weekStartTimestamp = weekStartDate?.getTime() ?? null;

  useEffect(() => {
    if (!enabled || weekStartTimestamp === null) {
      dispatchCheck({ status: 'idle' });
      return;
    }

    let cancelled = false;
    const week = new Date(weekStartTimestamp);
    dispatchCheck({ status: 'checking' });
    void plugin.serviceManager
      .getEconomicCalendarService()
      .then((service) => service.checkConfiguredEventsForWeek(week))
      .then((result) => {
        if (cancelled) return;
        if (result.status !== 'ok') {
          dispatchCheck({
            status:
              result.status === 'not_entitled' || result.status === 'signed_out'
                ? 'complete'
                : 'error',
          });
          return;
        }
        dispatchCheck(
          result.missingCount > 0
            ? { status: 'missing', missingCount: result.missingCount }
            : { status: 'complete' }
        );
      })
      .catch((error) => {
        if (cancelled) return;
        console.error(
          '[KeyEventsWidget] Failed to check auto-import coverage:',
          error
        );
        dispatchCheck({ status: 'error' });
      });

    return () => {
      cancelled = true;
    };
  }, [
    enabled,
    identitySignature,
    plugin.serviceManager,
    revision,
    weekStartTimestamp,
  ]);

  const restore = useCallback(async (): Promise<void> => {
    if (weekStartTimestamp === null || isRestoring) return;

    setIsRestoring(true);
    try {
      const service = await plugin.serviceManager.getEconomicCalendarService();
      const result = await service.restoreConfiguredEventsForWeek(
        new Date(weekStartTimestamp)
      );
      if (result.status !== 'ok') {
        dispatchCheck({ status: 'error' });
        new Notice(t('view.economic-calendar.import-failed'));
        return;
      }

      new Notice(
        t('view.economic-calendar.import-success', {
          imported: String(result.importedCount),
          updated: String(result.updatedCount),
        })
      );
      dispatchCheck({ status: 'checking' });
      await reloadEvents();
      requestCheck();
    } catch (error) {
      console.error(
        '[KeyEventsWidget] Failed to restore auto-import scope:',
        error
      );
      dispatchCheck({ status: 'error' });
      new Notice(t('view.economic-calendar.import-failed'));
    } finally {
      setIsRestoring(false);
    }
  }, [isRestoring, plugin.serviceManager, reloadEvents, weekStartTimestamp]);

  return { check, isRestoring, restore };
}
