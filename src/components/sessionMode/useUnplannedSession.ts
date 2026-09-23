import { useCallback, useEffect, useState } from 'react';
import { useEventBus } from '../../hooks/useEventBus';
import { Notice } from 'obsidian';
import type JournalitPlugin from '../../main';
import type {
  ResolvedUnplannedSessionWindow,
  SessionModePhaseState,
} from '../../types/sessionMode';
import { t } from '../../lang/helpers';
import { UnplannedSessionModal } from './UnplannedSessionModal';
import {
  canStartUnplannedSession,
  getUnplannedSessionsFromFile,
  resolveUnplannedSessionDrcPath,
  resolveUnplannedSessionWindow,
  selectRelevantUnplannedSession,
  startUnplannedSession,
  stopUnplannedSession,
} from './unplannedSessionUtils';


export function useUnplannedSession(
  plugin: JournalitPlugin,
  tradingDay: Date,
  now: Date
): {
  session: ResolvedUnplannedSessionWindow | undefined;
  
  windows: ResolvedUnplannedSessionWindow[];
  
  ready: boolean;
} {
  const [drcPath, setDrcPath] = useState<string | null>(null);
  
  
  const [pathVersion, setPathVersion] = useState(0);
  useEventBus('settings:changed', () => {
    setPathVersion((current) => current + 1);
  });
  useEventBus('review:changed', (payload) => {
    if (payload.type === 'drc' && payload.action === 'created') {
      setPathVersion((current) => current + 1);
    }
  });

  useEffect(() => {
    void pathVersion;
    let cancelled = false;
    void resolveUnplannedSessionDrcPath(plugin, tradingDay).then((path) => {
      if (!cancelled) setDrcPath(path);
    });
    return () => {
      cancelled = true;
    };
  }, [pathVersion, plugin, tradingDay]);

  
  
  
  
  
  const sessions = drcPath ? getUnplannedSessionsFromFile(plugin, drcPath) : [];
  const windows = sessions.map((entry) =>
    resolveUnplannedSessionWindow(entry, now, plugin)
  );
  const session = drcPath
    ? selectRelevantUnplannedSession(sessions, now, plugin)
    : undefined;

  return { session, windows, ready: drcPath !== null };
}


export function useUnplannedSessionActions(
  plugin: JournalitPlugin,
  getPhaseState: () => SessionModePhaseState
): {
  startUnplanned: () => void;
  stopUnplanned: (session: ResolvedUnplannedSessionWindow) => void;
} {
  const startUnplanned = useCallback(() => {
    if (!canStartUnplannedSession(getPhaseState())) {
      new Notice(t('session-mode.unplanned.notice.blocked-live'));
      return;
    }
    new UnplannedSessionModal(plugin, (reason) => {
      void startUnplannedSession({ plugin, reason })
        .then((result) => {
          new Notice(
            result.status === 'started'
              ? t('session-mode.unplanned.notice.started')
              : t('session-mode.unplanned.notice.blocked-live')
          );
        })
        .catch((error: unknown) => {
          console.error('Failed to start unplanned session:', error);
          new Notice(t('session-mode.unplanned.notice.failed'));
        });
    }).open();
  }, [getPhaseState, plugin]);

  const stopUnplanned = useCallback(
    (session: ResolvedUnplannedSessionWindow) => {
      void stopUnplannedSession({ plugin, session })
        .then((stopped) => {
          new Notice(
            stopped
              ? t('session-mode.unplanned.notice.stopped')
              : t('session-mode.unplanned.notice.none-running')
          );
        })
        .catch((error: unknown) => {
          console.error('Failed to stop unplanned session:', error);
          new Notice(t('session-mode.unplanned.notice.failed'));
        });
    },
    [plugin]
  );

  return { startUnplanned, stopUnplanned };
}
