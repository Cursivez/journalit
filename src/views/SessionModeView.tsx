import React, {
  useCallback,
  useEffect,
  useEffectEvent,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Component, TFile, WorkspaceLeaf } from 'obsidian';
import { ReactView } from './ReactView';
import { RenderFunction } from './types';
import JournalitPlugin from '../main';
import { t } from '../lang/helpers';
import { getTradingDay, getTradingDayRange } from '../utils/tradingDayUtils';
import { formatLocalDateString } from '../utils/dateUtils';
import { TradeFormModal } from '../components/forms/trade/TradeFormModal';
import {
  fetchDashboardData,
  Trade,
} from '../components/dashboard/utils/dataUtils';
import { createDashboardFilters } from '../settings/viewFiltersDefaults';
import { eventBus } from '../services/events/EventBus';
import { SessionLogPanel } from '../components/sessionLog/SessionLogPanel';
import { GoalsWidget } from '../components/reviewV2/widgets/GoalsWidget';
import { ChecklistWidget } from '../components/reviewV2/widgets/ChecklistWidget';
import { Button } from '../components/ui/Button';
import { TradeGatePanel } from '../components/sessionMode/TradeGatePanel';
import {
  useGuideAction,
  useGuideTarget,
  useResolvedViewGuide,
} from '../guides/GuideRuntimeLayer';
import {
  SESSION_MODE_CHECKLIST_TARGET_ID,
  SESSION_MODE_CONFIGURE_BUTTON_TARGET_ID,
  SESSION_MODE_EDIT_BUTTON_TARGET_ID,
  SESSION_MODE_ENDED_ACTIONS_TARGET_ID,
  SESSION_MODE_HEADER_TARGET_ID,
  SESSION_MODE_GOALS_TARGET_ID,
  SESSION_MODE_SESSION_LOG_TARGET_ID,
  SESSION_MODE_SETTINGS_OPENED_ACTION_ID,
  SESSION_MODE_TRADE_GATE_TARGET_ID,
} from '../guides/sessionModeGuideIds';
import { resolveSessionModeGuideId } from '../guides/sessionModeGuideResolution';
import {
  getActiveTradeGateRunFromFile,
  getRunnableTradeGateWorkflows,
  getTradeGateRunsFromFile,
  isTradeGateRunCompatibleWithWorkflows,
  isTradeGateRunOutsideSession,
} from '../components/sessionMode/tradeGateUtils';
import {
  ArrowUpRightFromSquare,
  ChevronRight,
  Calendar,
  Check,
  Edit,
  GlassWater,
  Import,
  Play,
  PlusCircle,
  Square,
  Zap,
} from '../components/shared/icons/ObsidianIcon';
import { getRunningUnplannedSession } from '../components/sessionMode/unplannedSessionUtils';
import {
  useUnplannedSession,
  useUnplannedSessionActions,
} from '../components/sessionMode/useUnplannedSession';
import {
  createManualTimelineEntries,
  createTradeTimelineEntries,
  filterAutomaticTradeTimelineEntries,
  filterTimelineEntriesBySessionWindow,
  findOwningSessionWindow,
  findOwningSessionWindowForTimestamp,
  getSessionLogEntriesFromFile,
  sortSessionTimeline,
} from '../components/sessionLog/sessionLogUtils';
import { resolveSessionModePhaseForPlugin } from '../utils/sessionModePhaseInputs';
import type {
  ResolvedSessionModeWindow,
  ResolvedUnplannedSessionWindow,
  SessionModeLayoutModuleId,
  SessionModePhaseState,
} from '../types/sessionMode';
import type { SessionLogTimelineEntry } from '../types/sessionLog';
import { SETTINGS_TAB_IDS } from '../settings/types';
import { normalizeSessionModePhaseLayouts } from '../utils/sessionModeLayout';

export const SESSION_MODE_VIEW_TYPE = 'journalit-session-mode-view';

const createLocalDateFromKey = (dateKey: string): Date => {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const getSessionBackingDate = (
  phaseState: SessionModePhaseState,
  plugin: JournalitPlugin
): Date | null => {
  switch (phaseState.phase) {
    case 'preparation':
    case 'waiting':
      return phaseState.nextSession?.start ?? null;
    case 'live':
      return phaseState.currentSession?.start ?? null;
    case 'break':
      if (phaseState.previousSession && phaseState.nextSession) {
        const previousTradingDayKey = formatLocalDateString(
          getTradingDay(phaseState.previousSession.start, plugin)
        );
        const nextTradingDayKey = formatLocalDateString(
          getTradingDay(phaseState.nextSession.start, plugin)
        );
        if (previousTradingDayKey !== nextTradingDayKey) {
          return phaseState.nextSession.start;
        }
      }
      return phaseState.previousSession?.start ?? null;
    case 'ended':
      return phaseState.previousSession?.start ?? null;
    case 'unconfigured':
      return null;
  }
};

const getSessionTradeLoadRange = (
  phaseState: SessionModePhaseState,
  tradingDayRange: { start: Date; end: Date }
): { start: Date; end: Date } => {
  const sessionWindows: Array<{ start: Date; end: Date }> = [];
  switch (phaseState.phase) {
    case 'preparation':
    case 'waiting':
      if (phaseState.nextSession) sessionWindows.push(phaseState.nextSession);
      break;
    case 'live':
      if (phaseState.currentSession) {
        sessionWindows.push(phaseState.currentSession);
      }
      break;
    case 'break':
      if (phaseState.previousSession) {
        sessionWindows.push(phaseState.previousSession);
      }
      if (phaseState.nextSession) sessionWindows.push(phaseState.nextSession);
      break;
    case 'ended':
      if (phaseState.previousSession) {
        sessionWindows.push(phaseState.previousSession);
      }
      break;
    case 'unconfigured':
      break;
  }

  let start = tradingDayRange.start;
  let end = tradingDayRange.end;
  for (const sessionWindow of sessionWindows) {
    if (sessionWindow.start < start) start = sessionWindow.start;
    if (sessionWindow.end > end) end = sessionWindow.end;
  }
  return { start, end };
};

const getTimelineTradingDays = (
  phaseState: SessionModePhaseState,
  fallbackTradingDay: Date,
  plugin: JournalitPlugin
): Date[] => {
  const tradingDays = new Map<string, Date>();
  const addTradingDay = (date: Date) => {
    const tradingDay = getTradingDay(date, plugin);
    tradingDays.set(formatLocalDateString(tradingDay), tradingDay);
  };

  addTradingDay(fallbackTradingDay);

  const addSessionWindow = (window: { start: Date; end: Date } | undefined) => {
    if (!window) return;
    addTradingDay(window.start);
    addTradingDay(window.end);
  };

  switch (phaseState.phase) {
    case 'preparation':
    case 'waiting':
      addSessionWindow(phaseState.nextSession);
      break;
    case 'live':
      addSessionWindow(phaseState.currentSession);
      break;
    case 'break':
      addSessionWindow(phaseState.previousSession);
      addSessionWindow(phaseState.nextSession);
      break;
    case 'ended':
      addSessionWindow(phaseState.previousSession);
      break;
    case 'unconfigured':
      break;
  }

  return [...tradingDays.values()];
};

const getPhaseLoadKey = (phaseState: SessionModePhaseState): string => {
  const windowKey = (window: { start: Date; end: Date } | undefined) =>
    window ? `${window.start.getTime()}-${window.end.getTime()}` : 'none';
  switch (phaseState.phase) {
    case 'preparation':
    case 'waiting':
      return `${phaseState.phase}:${windowKey(phaseState.nextSession)}`;
    case 'live':
      return `${phaseState.phase}:${windowKey(phaseState.currentSession)}`;
    case 'break':
      return `${phaseState.phase}:${windowKey(phaseState.previousSession)}:${windowKey(phaseState.nextSession)}`;
    case 'ended':
      return `${phaseState.phase}:${windowKey(phaseState.previousSession)}`;
    case 'unconfigured':
      return phaseState.phase;
  }
};

const openSessionModeFile = async (
  plugin: JournalitPlugin,
  path: string
): Promise<void> => {
  await plugin.openFile(path, false, true, 'sidebar');
};

const SessionMode: React.FC<{
  plugin: JournalitPlugin;
  hoverParent: Component;
}> = ({ plugin, hoverParent }) => {
  const [now, setNow] = useState(() => new Date());
  const [filePath, setFilePath] = useState<string | null>(null);
  const [loadedBackingTradingDayKey, setLoadedBackingTradingDayKey] = useState<
    string | null
  >(null);
  const loadedBackingTradingDayKeyRef = useRef<string | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const loadRequestIdRef = useRef(0);
  const currentTradingDayKey = formatLocalDateString(
    getTradingDay(now, plugin)
  );
  const tradingDay = useMemo(
    () => createLocalDateFromKey(currentTradingDayKey),
    [currentTradingDayKey]
  );
  const {
    session: unplannedSession,
    windows: unplannedWindows,
    ready: unplannedSessionReady,
  } = useUnplannedSession(plugin, tradingDay, now);
  const phaseState = useMemo(
    
    
    () =>
      resolveSessionModePhaseForPlugin(
        plugin,
        now,
        tradingDay,
        unplannedSession
      ),
    [plugin, now, tradingDay, unplannedSession]
  );
  const phaseStateRef = useRef(phaseState);
  useLayoutEffect(() => {
    phaseStateRef.current = phaseState;
  }, [phaseState]);

  const phaseLoadKey = useMemo(() => getPhaseLoadKey(phaseState), [phaseState]);
  const backingDate = getSessionBackingDate(phaseState, plugin);
  const backingTradingDayKey = backingDate
    ? formatLocalDateString(getTradingDay(backingDate, plugin))
    : null;
  const backingTradingDay = useMemo(
    () =>
      backingTradingDayKey
        ? createLocalDateFromKey(backingTradingDayKey)
        : null,
    [backingTradingDayKey]
  );

  const loadSession = useCallback(async () => {
    const requestId = loadRequestIdRef.current + 1;
    loadRequestIdRef.current = requestId;
    const requestBackingTradingDayKey = backingTradingDayKey;
    const isCurrentRequest = () =>
      loadRequestIdRef.current === requestId &&
      requestBackingTradingDayKey === backingTradingDayKey;
    if (!backingTradingDay) {
      setFilePath(null);
      loadedBackingTradingDayKeyRef.current = null;
      setLoadedBackingTradingDayKey(null);
      setTrades([]);
      return;
    }
    if (!isCurrentRequest()) return;

    setFilePath((currentFilePath) => {
      if (
        loadedBackingTradingDayKeyRef.current === requestBackingTradingDayKey
      ) {
        return currentFilePath;
      }
      return null;
    });
    if (loadedBackingTradingDayKeyRef.current !== requestBackingTradingDayKey) {
      loadedBackingTradingDayKeyRef.current = null;
      setLoadedBackingTradingDayKey(null);
      setTrades([]);
    }

    const drcService = plugin.drcService
      ? plugin.drcService
      : await plugin.serviceManager.getDRCService();
    const drcPath = await drcService.createDRC(backingTradingDay);
    if (isCurrentRequest()) {
      setFilePath(drcPath);
      loadedBackingTradingDayKeyRef.current = requestBackingTradingDayKey;
      setLoadedBackingTradingDayKey(requestBackingTradingDayKey);
    }

    const tradeService = plugin.serviceManager.getTradeService();
    await tradeService.waitForTradeDataReady();
    const tradingDayRange = getTradingDayRange(backingTradingDay, plugin);
    const tradeLoadRange = getSessionTradeLoadRange(
      phaseStateRef.current,
      tradingDayRange
    );
    const sessionFilters = createDashboardFilters();
    sessionFilters.dateRange = [tradeLoadRange.start, tradeLoadRange.end];
    const data = await fetchDashboardData(
      plugin.app,
      tradeService,
      sessionFilters,
      plugin.settings.trade?.defaultRiskAmount,
      plugin,
      { freshTradeQuery: true, executionScopedDateRange: true }
    );
    if (isCurrentRequest()) setTrades(data.trades);
  }, [backingTradingDay, backingTradingDayKey, plugin]);

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 1_000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    
    
    if (!unplannedSessionReady) return;
    void loadSession();
  }, [loadSession, phaseLoadKey, unplannedSessionReady]);

  const onTradeChanged = useEffectEvent(() => {
    void loadSession();
  });
  const onDrcChanged = useEffectEvent(() => {
    
    
    setNow(new Date());
    void loadSession();
  });
  useEffect(() => {
    const unsubscribeTrade = eventBus.subscribe('trade:changed', () => {
      onTradeChanged();
    });
    const unsubscribeReview = eventBus.subscribe(
      'review:changed',
      (payload) => {
        if (payload.type === 'drc') onDrcChanged();
      }
    );
    const unsubscribeSettings = eventBus.subscribe('settings:changed', () => {
      setNow(new Date());
    });
    return () => {
      unsubscribeTrade();
      unsubscribeReview();
      unsubscribeSettings();
    };
  }, []);

  const timelineEntries = useMemo(() => {
    if (!filePath) return [];
    const manualEntries = createManualTimelineEntries(
      getSessionLogEntriesFromFile(plugin, filePath)
    );
    const tradeEntriesById = new Map<string, SessionLogTimelineEntry>();
    for (const timelineTradingDay of getTimelineTradingDays(
      phaseState,
      backingTradingDay ?? tradingDay,
      plugin
    )) {
      for (const entry of createTradeTimelineEntries(
        trades,
        timelineTradingDay,
        plugin
      )) {
        tradeEntriesById.set(entry.id, entry);
      }
    }
    const tradeEntries = [...tradeEntriesById.values()];
    return sortSessionTimeline([...manualEntries, ...tradeEntries]);
  }, [backingTradingDay, filePath, phaseState, plugin, trades, tradingDay]);
  const visibleTimelineEntries = filterAutomaticTradeTimelineEntries(
    timelineEntries,
    plugin.settings.sessionMode.showTradeExecutionsInSessionLog
  );

  const shouldRenderLoadedSession =
    unplannedSessionReady &&
    ((filePath !== null &&
      loadedBackingTradingDayKey === backingTradingDayKey) ||
      phaseState.phase === 'unconfigured');
  const resolvedFilePath = filePath ?? '';

  const timeline = (
    <SessionModeTimelineSection
      plugin={plugin}
      filePath={resolvedFilePath}
      trades={trades}
      timelineEntries={
        phaseState.phase === 'live' && phaseState.currentSession
          ? filterTimelineEntriesBySessionWindow(
              visibleTimelineEntries,
              phaseState.currentSession
            )
          : visibleTimelineEntries
      }
      timestampSessionWindow={
        phaseState.currentSession ??
        phaseState.previousSession ??
        phaseState.nextSession
      }
      onRefresh={() => {
        void loadSession();
      }}
    />
  );

  const tradeGate = (
    <TradeGatePanel
      plugin={plugin}
      filePath={resolvedFilePath}
      questions={plugin.settings.sessionMode.tradeGateQuestions}
      currentSession={phaseState.currentSession}
      onRefresh={() => {
        void loadSession();
      }}
    />
  );
  const editButton = <SessionModeSettingsButton plugin={plugin} />;
  const drcButton = (
    <SessionModeHeaderDRCButton filePath={resolvedFilePath} plugin={plugin} />
  );
  const runningUnplannedSession = getRunningUnplannedSession(phaseState);
  const getCurrentPhaseState = useCallback(() => phaseStateRef.current, []);
  const { startUnplanned, stopUnplanned } = useUnplannedSessionActions(
    plugin,
    getCurrentPhaseState
  );
  return shouldRenderLoadedSession ? (
    <div className="journalit-session-mode">
      {phaseState.phase !== 'ended' && phaseState.phase !== 'unconfigured' && (
        <SessionModeGuideHeader>
          <div className="journalit-session-mode-header__top">
            <div className="journalit-session-mode-header__title-group">
              <h3>{getSessionModeViewTitle(phaseState)}</h3>
              {phaseState.phase === 'live' && drcButton}
            </div>
            <div className="journalit-session-mode-header__actions">
              {editButton}
            </div>
          </div>
          {runningUnplannedSession && (
            <UnplannedSessionStrip
              session={runningUnplannedSession}
              timeSinceStartMs={phaseState.timeSinceStartMs}
              use24HourTime={plugin.settings.trade.use24HourTime ?? false}
              onStop={() => stopUnplanned(runningUnplannedSession)}
            />
          )}
          {phaseState.phase === 'preparation' && (
            <SessionModeDRCLink
              plugin={plugin}
              filePath={resolvedFilePath}
              tradingDay={backingTradingDay ?? tradingDay}
            />
          )}
          {phaseState.phase === 'preparation' && (
            <div className="journalit-session-mode-header__preparation-action">
              <Button variant="secondary" size="small" onClick={startUnplanned}>
                <Play size={14} aria-hidden="true" />
                {t('session-mode.unplanned.start')}
              </Button>
            </div>
          )}
        </SessionModeGuideHeader>
      )}
      {phaseState.phase !== 'unconfigured' &&
        phaseState.phase !== 'live' &&
        phaseState.phase !== 'waiting' &&
        phaseState.phase !== 'break' &&
        phaseState.phase !== 'ended' && (
          <SessionModeStatus
            phaseState={phaseState}
            use24HourTime={plugin.settings.trade.use24HourTime ?? false}
          />
        )}
      <SessionModePhaseContent
        phaseState={phaseState}
        plugin={plugin}
        filePath={resolvedFilePath}
        hoverParent={hoverParent}
        timelineEntries={timelineEntries}
        tradeGate={tradeGate}
        timeline={timeline}
        editButton={editButton}
        onStartUnplannedSession={startUnplanned}
        unplannedWindows={unplannedWindows}
      />
    </div>
  ) : (
    <SessionModeSkeleton phaseState={phaseState} />
  );
};

const openSessionModeSettings = (plugin: JournalitPlugin): void => {
  plugin.openSettingsToTab(SETTINGS_TAB_IDS.SESSION_MODE);
};


const SessionModeGuideSection: React.FC<{
  targetId: string;
  children: React.ReactNode;
}> = ({ targetId, children }) => {
  const registerTarget = useGuideTarget(targetId);
  return (
    <div className="journalit-session-mode-guide-section" ref={registerTarget}>
      {children}
    </div>
  );
};

const SessionModeGuideHeader: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const registerTarget = useGuideTarget(SESSION_MODE_HEADER_TARGET_ID);
  return (
    <div className="journalit-session-mode-header" ref={registerTarget}>
      {children}
    </div>
  );
};

const SessionModeSettingsButton: React.FC<{ plugin: JournalitPlugin }> = ({
  plugin,
}) => {
  const registerTarget = useGuideTarget(SESSION_MODE_EDIT_BUTTON_TARGET_ID);
  const emitGuideAction = useGuideAction();
  return (
    <button
      ref={registerTarget}
      type="button"
      className="journalit-session-mode-edit-button"
      onClick={() => {
        emitGuideAction(SESSION_MODE_SETTINGS_OPENED_ACTION_ID);
        openSessionModeSettings(plugin);
      }}
    >
      <Edit size={14} aria-hidden="true" />
      <span>{t('button.edit')}</span>
    </button>
  );
};

const SessionModeHeaderDRCButton: React.FC<{
  plugin: JournalitPlugin;
  filePath: string;
}> = ({ plugin, filePath }) => {
  const openDRC = async () => {
    await openSessionModeFile(plugin, filePath);
  };

  return (
    <button
      type="button"
      className="journalit-session-mode-drc-header-button"
      onClick={() => void openDRC()}
      aria-label={t('session-mode.ended.action.open-drc')}
    >
      <ArrowUpRightFromSquare size={13} aria-hidden="true" />
    </button>
  );
};

const UnplannedSessionStrip: React.FC<{
  session: ResolvedUnplannedSessionWindow;
  timeSinceStartMs: number | undefined;
  use24HourTime: boolean;
  onStop: () => void;
}> = ({ session, timeSinceStartMs, use24HourTime, onStop }) => (
  <div className="journalit-session-mode-unplanned-strip" role="status">
    <div className="journalit-session-mode-unplanned-strip__body">
      <span className="journalit-session-mode-unplanned-strip__badge">
        <Zap size={12} aria-hidden="true" />
        {t('session-mode.unplanned.badge')}
      </span>
      <span className="journalit-session-mode-unplanned-strip__reason">
        {session.reason}
      </span>
      <span className="journalit-session-mode-unplanned-strip__meta">
        {t('session-mode.unplanned.status.live', {
          time: formatSessionClockTime(session.start, use24HourTime),
          elapsed: formatElapsed(timeSinceStartMs),
        })}
      </span>
    </div>
    <button
      type="button"
      className="journalit-session-mode-unplanned-strip__stop"
      onClick={onStop}
    >
      <Square size={12} aria-hidden="true" />
      <span>{t('session-mode.unplanned.stop')}</span>
    </button>
  </div>
);

const UnplannedSessionEndedSummary: React.FC<{
  session: ResolvedUnplannedSessionWindow;
  use24HourTime: boolean;
}> = ({ session, use24HourTime }) => (
  <div className="journalit-session-mode-ended-summary__unplanned">
    <Zap size={14} aria-hidden="true" />
    <div>
      <div>
        {t('session-mode.unplanned.ended.summary', {
          start: formatSessionClockTime(session.start, use24HourTime),
          end: formatSessionClockTime(session.end, use24HourTime),
          duration: formatDuration(
            session.end.getTime() - session.start.getTime()
          ),
        })}
      </div>
      <div className="journalit-session-mode-ended-summary__unplanned-reason">
        {session.reason}
      </div>
    </div>
  </div>
);

const SessionModeSkeleton: React.FC<{
  phaseState: SessionModePhaseState;
}> = ({ phaseState }) => {
  const phase = phaseState.phase;

  return (
    <div className="journalit-session-mode journalit-session-mode-skeleton">
      <div className="journalit-session-mode-header">
        <div className="skeleton-shimmer journalit-session-mode-skeleton__title" />
      </div>
      <div
        className={`journalit-session-mode-skeleton__body is-${phase}`}
        role="status"
        aria-label={t('session-mode.loading')}
      >
        <span className="journalit-skeleton-screenreader-status">
          {t('session-mode.loading')}
        </span>
        {phase === 'preparation' ? (
          <>
            <div className="journalit-session-mode-skeleton__countdown">
              <div className="skeleton-shimmer journalit-session-mode-skeleton__eyebrow" />
              <div className="journalit-session-mode-skeleton__countdown-row">
                <div className="skeleton-shimmer journalit-session-mode-skeleton__countdown-number" />
                <div className="skeleton-shimmer journalit-session-mode-skeleton__countdown-separator" />
                <div className="skeleton-shimmer journalit-session-mode-skeleton__countdown-number" />
              </div>
              <div className="skeleton-shimmer journalit-session-mode-skeleton__meta" />
            </div>
            <SessionModeSkeletonCard lines={3} />
            <SessionModeSkeletonCard lines={5} />
          </>
        ) : phase === 'live' ? (
          <>
            <div className="skeleton-shimmer journalit-session-mode-skeleton__selector" />
            <SessionModeSkeletonCard lines={2} />
            <div className="skeleton-shimmer journalit-session-mode-skeleton__section-label" />
            <div className="skeleton-shimmer journalit-session-mode-skeleton__composer" />
            <SessionModeSkeletonTimeline />
          </>
        ) : phase === 'waiting' || phase === 'break' ? (
          <div className="journalit-session-mode-skeleton__center-state">
            {phase === 'break' && (
              <div className="skeleton-shimmer journalit-session-mode-skeleton__small-icon" />
            )}
            <div className="skeleton-shimmer journalit-session-mode-skeleton__eyebrow" />
            <div className="skeleton-shimmer journalit-session-mode-skeleton__hero-line" />
            <div className="skeleton-shimmer journalit-session-mode-skeleton__meta" />
            <div className="skeleton-shimmer journalit-session-mode-skeleton__button" />
          </div>
        ) : phase === 'ended' ? (
          <div className="journalit-session-mode-skeleton__ended">
            <div className="skeleton-shimmer journalit-session-mode-skeleton__hero-line" />
            <div className="skeleton-shimmer journalit-session-mode-skeleton__meta" />
            <div className="skeleton-shimmer journalit-session-mode-skeleton__action-row" />
            <div className="skeleton-shimmer journalit-session-mode-skeleton__action-row" />
            <div className="skeleton-shimmer journalit-session-mode-skeleton__action-row" />
            <div className="journalit-session-mode-skeleton__stats-row">
              <div className="skeleton-shimmer journalit-session-mode-skeleton__stat" />
              <div className="skeleton-shimmer journalit-session-mode-skeleton__stat" />
              <div className="skeleton-shimmer journalit-session-mode-skeleton__stat" />
            </div>
          </div>
        ) : (
          <SessionModeSkeletonCard lines={4} />
        )}
      </div>
    </div>
  );
};

const SessionModeSkeletonCard: React.FC<{ lines: number }> = ({ lines }) => (
  <div className="journalit-session-mode-skeleton__card">
    <div className="journalit-session-mode-skeleton__card-header">
      <div className="skeleton-shimmer journalit-session-mode-skeleton__card-title" />
      <div className="skeleton-shimmer journalit-session-mode-skeleton__card-pill" />
    </div>
    {['one', 'two', 'three', 'four', 'five'].slice(0, lines).map((key) => (
      <div
        key={key}
        className="skeleton-shimmer journalit-session-mode-skeleton__line"
      />
    ))}
  </div>
);

const SessionModeSkeletonTimeline: React.FC = () => (
  <div className="journalit-session-mode-skeleton__timeline">
    <div className="skeleton-shimmer journalit-session-mode-skeleton__timeline-label" />
    <div className="skeleton-shimmer journalit-session-mode-skeleton__timeline-entry" />
    <div className="skeleton-shimmer journalit-session-mode-skeleton__timeline-entry" />
    <div className="skeleton-shimmer journalit-session-mode-skeleton__timeline-entry" />
  </div>
);

const SessionModeDRCLink: React.FC<{
  plugin: JournalitPlugin;
  filePath: string;
  tradingDay: Date;
}> = ({ plugin, filePath, tradingDay }) => {
  const openDRC = async () => {
    await openSessionModeFile(plugin, filePath);
  };

  const label = tradingDay.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <button
      type="button"
      className="journalit-session-mode-drc-link"
      aria-label={t('session-mode.action.open-drc-for-date', { date: label })}
      onClick={() => void openDRC()}
    >
      {label}
    </button>
  );
};

const formatSessionClockTime = (date: Date, use24HourTime: boolean): string =>
  date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: !use24HourTime,
  });

const formatDuration = (milliseconds: number | undefined): string => {
  if (milliseconds === undefined) return '';
  const totalMinutes = Math.max(0, Math.ceil(milliseconds / 60_000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0)
    return t('session-mode.duration.minutes', { minutes: String(minutes) });
  if (minutes === 0)
    return t('session-mode.duration.hours', { hours: String(hours) });
  return t('session-mode.duration.hours-minutes', {
    hours: String(hours),
    minutes: String(minutes),
  });
};

const formatElapsed = (milliseconds: number | undefined): string => {
  if (milliseconds === undefined) return '';
  const totalMinutes = Math.max(0, Math.floor(milliseconds / 60_000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0)
    return t('session-mode.duration.minutes', { minutes: String(minutes) });
  if (minutes === 0)
    return t('session-mode.duration.hours', { hours: String(hours) });
  return t('session-mode.duration.hours-minutes', {
    hours: String(hours),
    minutes: String(minutes),
  });
};

const getCountdownParts = (
  milliseconds: number | undefined
): {
  leftValue: string;
  leftLabel: string;
  rightValue: string;
  rightLabel: string;
} => {
  const totalSeconds = Math.max(0, Math.ceil((milliseconds ?? 0) / 1_000));

  if (totalSeconds < 60 * 60) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return {
      leftValue: String(minutes).padStart(2, '0'),
      leftLabel: t('session-mode.countdown.minutes'),
      rightValue: String(seconds).padStart(2, '0'),
      rightLabel: t('session-mode.countdown.seconds'),
    };
  }

  const totalMinutes = Math.ceil(totalSeconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return {
    leftValue: String(hours).padStart(2, '0'),
    leftLabel: t('session-mode.countdown.hours'),
    rightValue: String(minutes).padStart(2, '0'),
    rightLabel: t('session-mode.countdown.minutes'),
  };
};

const getPhaseTitle = (phaseState: SessionModePhaseState): string => {
  switch (phaseState.phase) {
    case 'preparation':
      return t('session-mode.phase.preparation');
    case 'waiting':
      return t('session-mode.phase.waiting');
    case 'live':
      return t('session-mode.phase.live');
    case 'break':
      return t('session-mode.phase.break');
    case 'ended':
      return t('session-mode.phase.ended');
    case 'unconfigured':
      return t('session-mode.phase.unconfigured');
  }
};

const getSessionModeViewTitle = (phaseState: SessionModePhaseState): string => {
  switch (phaseState.phase) {
    case 'preparation':
      return t('session-mode.title.preparation');
    case 'waiting':
      return t('view.session-mode');
    case 'live':
      return phaseState.currentSession?.kind === 'unplanned'
        ? t('session-mode.unplanned.name')
        : t('session-mode.title.live');
    case 'break':
      return t('session-mode.title.break');
    case 'ended':
      return t('session-mode.title.ended');
    case 'unconfigured':
      return t('view.session-mode');
  }
};

const getPhaseDescription = (
  phaseState: SessionModePhaseState,
  use24HourTime: boolean
): string => {
  switch (phaseState.phase) {
    case 'preparation':
      return phaseState.nextSession
        ? t('session-mode.status.preparation', {
            session: phaseState.nextSession.name,
            time: formatSessionClockTime(
              phaseState.nextSession.start,
              use24HourTime
            ),
            remaining: formatDuration(phaseState.timeUntilStartMs),
          })
        : t('session-mode.status.preparation-generic');
    case 'waiting':
      return phaseState.nextSession
        ? t('session-mode.status.waiting', {
            session: phaseState.nextSession.name,
            time: formatSessionClockTime(
              phaseState.nextSession.start,
              use24HourTime
            ),
            remaining: formatDuration(phaseState.timeUntilStartMs),
          })
        : t('session-mode.status.waiting-generic');
    case 'live':
      return phaseState.currentSession
        ? t('session-mode.status.live', {
            session: phaseState.currentSession.name,
            remaining: formatDuration(phaseState.timeUntilEndMs),
          })
        : t('session-mode.status.live-generic');
    case 'break':
      return phaseState.nextSession
        ? t('session-mode.status.break', {
            session: phaseState.nextSession.name,
            time: formatSessionClockTime(
              phaseState.nextSession.start,
              use24HourTime
            ),
            remaining: formatDuration(phaseState.timeUntilStartMs),
          })
        : t('session-mode.status.break-generic');
    case 'ended':
      return t('session-mode.status.ended');
    case 'unconfigured':
      return t('session-mode.status.unconfigured');
  }
};

const SessionModeStatus: React.FC<{
  phaseState: SessionModePhaseState;
  use24HourTime: boolean;
}> = ({ phaseState, use24HourTime }) => {
  if (phaseState.phase === 'preparation' && phaseState.nextSession) {
    const countdown = getCountdownParts(phaseState.timeUntilStartMs);
    return (
      <div
        className="journalit-session-mode-countdown"
        aria-label={getPhaseDescription(phaseState, use24HourTime)}
      >
        <div className="journalit-session-mode-countdown__eyebrow">
          {t('session-mode.countdown.starts-in')}
        </div>
        <div className="journalit-session-mode-countdown__timer">
          <div className="journalit-session-mode-countdown__segment">
            <span className="journalit-session-mode-countdown__value">
              {countdown.leftValue}
            </span>
            <span className="journalit-session-mode-countdown__label">
              {countdown.leftLabel}
            </span>
          </div>
          <div className="journalit-session-mode-countdown__separator">:</div>
          <div className="journalit-session-mode-countdown__segment">
            <span className="journalit-session-mode-countdown__value">
              {countdown.rightValue}
            </span>
            <span className="journalit-session-mode-countdown__label">
              {countdown.rightLabel}
            </span>
          </div>
        </div>
        <div className="journalit-session-mode-countdown__meta">
          {t('session-mode.countdown.starts-at', {
            session: phaseState.nextSession.name,
            time: formatSessionClockTime(
              phaseState.nextSession.start,
              use24HourTime
            ),
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={`journalit-session-mode-status is-${phaseState.phase}`}>
      <div
        className="journalit-session-mode-status__indicator"
        aria-hidden="true"
      />
      <div className="journalit-session-mode-status__content">
        <div className="journalit-session-mode-status__phase">
          {getPhaseTitle(phaseState)}
        </div>
        <div className="journalit-session-mode-status__description">
          {getPhaseDescription(phaseState, use24HourTime)}
        </div>
      </div>
    </div>
  );
};

const SessionModePreparationResources: React.FC<{
  plugin: JournalitPlugin;
  filePath: string;
  hoverParent: Component;
}> = ({ plugin, filePath, hoverParent }) => {
  const linkedResources = plugin.settings.sessionMode.linkedResources;

  const openLinkedResource = async (path: string) => {
    await openSessionModeFile(plugin, path);
  };

  if (linkedResources.length === 0) return null;

  return (
    <section className="journalit-session-mode-section">
      <div className="journalit-session-mode-resource-links">
        <div className="journalit-session-mode-prep-card__title">
          {t('session-mode.prep.resources')}
        </div>
        <div className="journalit-session-mode-resource-links__list">
          {linkedResources.map((resource) => {
            const file = plugin.app.vault.getAbstractFileByPath(resource.path);
            const label = file instanceof TFile ? file.path : resource.path;
            return (
              <button
                type="button"
                key={resource.path}
                className="journalit-session-mode-resource-link"
                data-href={resource.path}
                onClick={() => {
                  void openLinkedResource(resource.path);
                }}
                onMouseOver={(event) => {
                  plugin.app.workspace.trigger('hover-link', {
                    event: event.nativeEvent,
                    source: 'preview',
                    hoverParent,
                    targetEl: event.currentTarget,
                    linktext: resource.path,
                    sourcePath: filePath,
                  });
                }}
                onFocus={(event) => {
                  plugin.app.workspace.trigger('hover-link', {
                    event: event.nativeEvent,
                    source: 'preview',
                    hoverParent,
                    targetEl: event.currentTarget,
                    linktext: resource.path,
                    sourcePath: filePath,
                  });
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const SessionModePreparationGoals: React.FC<{
  plugin: JournalitPlugin;
  filePath: string;
}> = ({ plugin, filePath }) => {
  const registerTarget = useGuideTarget(SESSION_MODE_GOALS_TARGET_ID);
  return (
    <section className="journalit-session-mode-section" ref={registerTarget}>
      <div className="journalit-session-mode-prep-card">
        <GoalsWidget filePath={filePath} plugin={plugin} />
      </div>
    </section>
  );
};

const SessionModePreparationChecklist: React.FC<{
  plugin: JournalitPlugin;
  filePath: string;
}> = ({ plugin, filePath }) => {
  const registerTarget = useGuideTarget(SESSION_MODE_CHECKLIST_TARGET_ID);
  return (
    <section className="journalit-session-mode-section" ref={registerTarget}>
      <div className="journalit-session-mode-prep-card">
        <ChecklistWidget filePath={filePath} plugin={plugin} />
      </div>
    </section>
  );
};

const SessionModeTimelineSection: React.FC<{
  plugin: JournalitPlugin;
  filePath: string;
  trades: Trade[];
  timelineEntries: ReturnType<typeof sortSessionTimeline>;
  timestampSessionWindow?: SessionModePhaseState['currentSession'];
  onRefresh: () => void;
}> = ({
  plugin,
  filePath,
  trades,
  timelineEntries,
  timestampSessionWindow,
  onRefresh,
}) => (
  <section className="journalit-session-mode-section journalit-session-mode-section--timeline">
    <div className="journalit-session-mode-section__header">
      {t('session-mode.section.timeline')}
    </div>
    <SessionLogPanel
      plugin={plugin}
      filePath={filePath}
      timelineEntries={timelineEntries}
      trades={trades}
      compact
      showFilters={false}
      newestFirst
      timestampSessionWindow={timestampSessionWindow}
      onRefresh={onRefresh}
    />
  </section>
);

const SessionModePhaseContent: React.FC<{
  phaseState: SessionModePhaseState;
  plugin: JournalitPlugin;
  filePath: string;
  hoverParent: Component;
  timelineEntries: ReturnType<typeof sortSessionTimeline>;
  tradeGate: React.ReactNode;
  timeline: React.ReactNode;
  editButton: React.ReactNode;
  onStartUnplannedSession: () => void;
  unplannedWindows: ResolvedUnplannedSessionWindow[];
}> = ({
  phaseState,
  plugin,
  filePath,
  hoverParent,
  timelineEntries,
  tradeGate,
  timeline,
  editButton,
  onStartUnplannedSession,
  unplannedWindows,
}) => {
  
  
  const phaseLayouts = normalizeSessionModePhaseLayouts(
    plugin.settings.sessionMode.phaseLayouts
  );
  useResolvedViewGuide(
    resolveSessionModeGuideId(
      phaseState.phase,
      phaseLayouts.ended.includes('endedActions')
    )
  );
  if (phaseState.phase === 'unconfigured') {
    return (
      <SessionModeUnconfiguredState
        plugin={plugin}
        onStartUnplannedSession={onStartUnplannedSession}
      />
    );
  }

  if (phaseState.phase === 'waiting') {
    return (
      <SessionModeWaitingState
        phaseState={phaseState}
        plugin={plugin}
        filePath={filePath}
        onStartUnplannedSession={onStartUnplannedSession}
      />
    );
  }

  if (phaseState.phase === 'break') {
    return (
      <SessionModeBreakState
        phaseState={phaseState}
        plugin={plugin}
        filePath={filePath}
        onStartUnplannedSession={onStartUnplannedSession}
      />
    );
  }

  const phase = phaseState.phase;
  const moduleIds = phaseLayouts[phase];
  const hasVisibleModule = moduleIds.some((moduleId) =>
    isSessionModeModuleVisible(
      moduleId,
      plugin,
      filePath,
      phaseState.currentSession
    )
  );

  if (!hasVisibleModule) {
    return (
      <SessionModeEmptyLayoutState
        editButton={phaseState.phase === 'ended' ? editButton : null}
      />
    );
  }

  
  
  const renderedModules = moduleIds.map((moduleId) =>
    isSessionModeModuleVisible(
      moduleId,
      plugin,
      filePath,
      phaseState.currentSession
    ) ? (
      <SessionModeLayoutModule
        key={moduleId}
        moduleId={moduleId}
        phaseState={phaseState}
        plugin={plugin}
        filePath={filePath}
        hoverParent={hoverParent}
        timelineEntries={timelineEntries}
        tradeGate={tradeGate}
        timeline={timeline}
        editButton={editButton}
        onStartUnplannedSession={onStartUnplannedSession}
        unplannedWindows={unplannedWindows}
      />
    ) : null
  );

  return <>{renderedModules}</>;
};

const isSessionModeModuleVisible = (
  moduleId: SessionModeLayoutModuleId,
  plugin: JournalitPlugin,
  filePath: string,
  currentSession: ResolvedSessionModeWindow | undefined
): boolean => {
  switch (moduleId) {
    case 'preparationResources':
      return plugin.settings.sessionMode.linkedResources.length > 0;
    case 'tradeGate': {
      
      
      
      
      const workflows = plugin.settings.sessionMode.tradeGateWorkflows;
      const questions = plugin.settings.sessionMode.tradeGateQuestions;
      if (getRunnableTradeGateWorkflows(workflows, questions).length > 0) {
        return true;
      }
      const activeRun = getActiveTradeGateRunFromFile(plugin, filePath);
      return (
        activeRun !== null &&
        !isTradeGateRunOutsideSession(activeRun, currentSession) &&
        isTradeGateRunCompatibleWithWorkflows(activeRun, workflows, questions)
      );
    }
    default:
      return true;
  }
};

const SessionModeLayoutModule: React.FC<{
  moduleId: SessionModeLayoutModuleId;
  phaseState: SessionModePhaseState;
  plugin: JournalitPlugin;
  filePath: string;
  hoverParent: Component;
  timelineEntries: ReturnType<typeof sortSessionTimeline>;
  tradeGate: React.ReactNode;
  timeline: React.ReactNode;
  editButton: React.ReactNode;
  onStartUnplannedSession: () => void;
  unplannedWindows: ResolvedUnplannedSessionWindow[];
}> = ({
  moduleId,
  phaseState,
  plugin,
  filePath,
  hoverParent,
  timelineEntries,
  tradeGate,
  timeline,
  editButton,
  onStartUnplannedSession,
  unplannedWindows,
}) => {
  switch (moduleId) {
    case 'preparationResources':
      return phaseState.phase === 'preparation' ? (
        <SessionModePreparationResources
          plugin={plugin}
          filePath={filePath}
          hoverParent={hoverParent}
        />
      ) : null;
    case 'preparationGoals':
      return phaseState.phase === 'preparation' ? (
        <SessionModePreparationGoals plugin={plugin} filePath={filePath} />
      ) : null;
    case 'preparationChecklist':
      return phaseState.phase === 'preparation' ? (
        <SessionModePreparationChecklist plugin={plugin} filePath={filePath} />
      ) : null;
    case 'tradeGate':
      return phaseState.phase === 'live' ? (
        <SessionModeGuideSection targetId={SESSION_MODE_TRADE_GATE_TARGET_ID}>
          {tradeGate}
        </SessionModeGuideSection>
      ) : null;
    case 'timeline':
      return phaseState.phase === 'live' ? (
        <SessionModeGuideSection targetId={SESSION_MODE_SESSION_LOG_TARGET_ID}>
          {timeline}
        </SessionModeGuideSection>
      ) : null;
    case 'endedActions':
      return phaseState.phase === 'ended' ? (
        <SessionModeGuideSection
          targetId={SESSION_MODE_ENDED_ACTIONS_TARGET_ID}
        >
          <SessionModeEndedActions
            plugin={plugin}
            filePath={filePath}
            editButton={editButton}
            previousSession={phaseState.previousSession}
            onStartUnplannedSession={onStartUnplannedSession}
          />
        </SessionModeGuideSection>
      ) : null;
    case 'endedStats':
      return phaseState.phase === 'ended' ? (
        <SessionModeEndedStats
          plugin={plugin}
          filePath={filePath}
          timelineEntries={timelineEntries}
          sessionWindow={phaseState.previousSession}
          unplannedWindows={unplannedWindows}
        />
      ) : null;
  }
};

const SessionModeWaitingState: React.FC<{
  phaseState: SessionModePhaseState;
  plugin: JournalitPlugin;
  filePath: string;
  onStartUnplannedSession: () => void;
}> = ({ phaseState, plugin, filePath, onStartUnplannedSession }) => {
  const nextSession = phaseState.nextSession;
  const preparationOpensInMs = Math.max(
    0,
    (phaseState.timeUntilStartMs ?? 0) -
      plugin.settings.sessionMode.preparationLeadTimeMinutes * 60_000
  );

  const openDRC = async () => {
    await openSessionModeFile(plugin, filePath);
  };

  return (
    <section className="journalit-session-mode-waiting-state">
      <div className="journalit-session-mode-waiting-state__eyebrow">
        {t('session-mode.waiting.next-session')}
      </div>
      <div className="journalit-session-mode-waiting-state__title">
        {nextSession
          ? t('session-mode.waiting.starts-at', {
              session: nextSession.name,
              time: formatSessionClockTime(
                nextSession.start,
                plugin.settings.trade.use24HourTime ?? false
              ),
            })
          : t('session-mode.status.waiting-generic')}
      </div>
      <div className="journalit-session-mode-waiting-state__meta">
        {t('session-mode.waiting.preparation-opens-in', {
          remaining: formatDuration(preparationOpensInMs),
        })}
      </div>
      <div className="journalit-session-mode-waiting-state__actions">
        <button
          type="button"
          className="journalit-session-mode-waiting-state__action"
          onClick={() => void openDRC()}
        >
          <Calendar size={16} aria-hidden="true" />
          <span>{t('session-mode.waiting.open-drc')}</span>
        </button>
        <button
          type="button"
          className="journalit-session-mode-waiting-state__action"
          onClick={onStartUnplannedSession}
        >
          <Play size={16} aria-hidden="true" />
          <span>{t('session-mode.unplanned.start')}</span>
        </button>
      </div>
    </section>
  );
};

const SessionModeBreakState: React.FC<{
  phaseState: SessionModePhaseState;
  plugin: JournalitPlugin;
  filePath: string;
  onStartUnplannedSession: () => void;
}> = ({ phaseState, plugin, filePath, onStartUnplannedSession }) => {
  const nextSession = phaseState.nextSession;

  const openDRC = async () => {
    await openSessionModeFile(plugin, filePath);
  };

  return (
    <section className="journalit-session-mode-break-state">
      <div
        className="journalit-session-mode-break-state__icon"
        aria-hidden="true"
      >
        <GlassWater size={24} />
      </div>
      <div className="journalit-session-mode-break-state__title">
        {nextSession
          ? t('session-mode.break.reset-before', {
              session: nextSession.name,
            })
          : t('session-mode.break.reset')}
      </div>
      {nextSession && (
        <div className="journalit-session-mode-break-state__meta">
          {t('session-mode.break.next-session-meta', {
            time: formatSessionClockTime(
              nextSession.start,
              plugin.settings.trade.use24HourTime ?? false
            ),
            remaining: formatDuration(phaseState.timeUntilStartMs),
          })}
        </div>
      )}
      <p className="journalit-session-mode-break-state__description">
        {t('session-mode.break.description')}
      </p>
      <div className="journalit-session-mode-break-state__actions">
        <button
          type="button"
          className="journalit-session-mode-break-state__action"
          onClick={() => void openDRC()}
        >
          <Calendar size={16} aria-hidden="true" />
          <span>{t('session-mode.break.open-drc')}</span>
        </button>
        <button
          type="button"
          className="journalit-session-mode-break-state__action"
          onClick={onStartUnplannedSession}
        >
          <Play size={16} aria-hidden="true" />
          <span>{t('session-mode.unplanned.start')}</span>
        </button>
      </div>
    </section>
  );
};

const SessionModeEndedActions: React.FC<{
  plugin: JournalitPlugin;
  filePath: string;
  editButton: React.ReactNode;
  previousSession: ResolvedSessionModeWindow | undefined;
  onStartUnplannedSession: () => void;
}> = ({
  plugin,
  filePath,
  editButton,
  previousSession,
  onStartUnplannedSession,
}) => {
  const openDRC = async () => {
    await openSessionModeFile(plugin, filePath);
  };

  const addTradeManually = () => {
    const modal = new TradeFormModal({ app: plugin.app, plugin });
    modal.open();
  };

  const actions = [
    {
      key: 'import',
      label: t('session-mode.ended.action.import-trades'),
      icon: Import,
      primary: true,
      onClick: () => void plugin.viewManager.openCSVImportView(),
    },
    {
      key: 'manual',
      label: t('session-mode.ended.action.add-trade-manually'),
      icon: PlusCircle,
      primary: false,
      onClick: addTradeManually,
    },
    {
      key: 'drc',
      label: t('session-mode.ended.action.open-drc'),
      icon: Calendar,
      primary: false,
      onClick: () => void openDRC(),
    },
    {
      key: 'unplanned',
      label: t('session-mode.unplanned.start'),
      icon: Play,
      primary: false,
      onClick: onStartUnplannedSession,
    },
  ];

  return (
    <section className="journalit-session-mode-ended-summary journalit-session-mode-ended-summary--actions">
      <div className="journalit-session-mode-ended-summary__header">
        <div className="journalit-session-mode-ended-summary__header-top">
          <h3>{t('session-mode.title.ended')}</h3>
          {editButton}
        </div>
        <p>{t('session-mode.ended.helper')}</p>
      </div>
      {previousSession?.kind === 'unplanned' && (
        <UnplannedSessionEndedSummary
          session={previousSession}
          use24HourTime={plugin.settings.trade.use24HourTime ?? false}
        />
      )}
      <div className="journalit-session-mode-ended-summary__actions">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.key}
              type="button"
              className={
                action.primary
                  ? 'journalit-session-mode-ended-action is-primary'
                  : 'journalit-session-mode-ended-action'
              }
              onClick={action.onClick}
            >
              <Icon
                className="journalit-session-mode-ended-action__icon"
                size={22}
                aria-hidden="true"
              />
              <span>{action.label}</span>
              <ChevronRight
                className="journalit-session-mode-ended-action__chevron"
                size={18}
                aria-hidden="true"
              />
            </button>
          );
        })}
      </div>
    </section>
  );
};

const SessionModeEndedStats: React.FC<{
  plugin: JournalitPlugin;
  filePath: string;
  timelineEntries: ReturnType<typeof sortSessionTimeline>;
  sessionWindow?: NonNullable<SessionModePhaseState['previousSession']>;
  unplannedWindows: ResolvedUnplannedSessionWindow[];
}> = ({
  plugin,
  filePath,
  timelineEntries,
  sessionWindow,
  unplannedWindows,
}) => {
  
  
  
  const candidateWindows: ResolvedSessionModeWindow[] = sessionWindow
    ? [sessionWindow, ...unplannedWindows]
    : [];
  const isOwnedBySessionWindow = (timestamp: Date): boolean =>
    sessionWindow !== undefined &&
    findOwningSessionWindowForTimestamp(timestamp, candidateWindows)?.id ===
      sessionWindow.id;
  const scopedTimelineEntries = sessionWindow
    ? timelineEntries.filter(
        (entry) =>
          findOwningSessionWindow(entry, candidateWindows)?.id ===
          sessionWindow.id
      )
    : timelineEntries;
  const tradePaths = new Set<string>();
  for (const entry of scopedTimelineEntries) {
    if (entry.kind === 'trade') tradePaths.add(entry.tradePath);
  }
  const tradeCount = tradePaths.size;
  const noteCount = scopedTimelineEntries.filter(
    (entry) => entry.kind === 'manual'
  ).length;
  let tradeGateRunCount = 0;
  for (const run of getTradeGateRunsFromFile(plugin, filePath)) {
    if (run.status !== 'completed') continue;
    if (!sessionWindow) {
      tradeGateRunCount += 1;
      continue;
    }
    const completedAt = run.completedAt ? new Date(run.completedAt) : null;
    if (completedAt && isOwnedBySessionWindow(completedAt)) {
      tradeGateRunCount += 1;
    }
  }

  const stats = [
    {
      label: t('session-mode.ended.stat.trades'),
      value: tradeCount,
    },
    {
      label: t('session-mode.ended.stat.notes'),
      value: noteCount,
    },
    {
      label: t('session-mode.ended.stat.gate-checks'),
      value: tradeGateRunCount,
    },
  ];

  return (
    <section className="journalit-session-mode-ended-summary journalit-session-mode-ended-summary--stats">
      <div className="journalit-session-mode-ended-summary__stats">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="journalit-session-mode-ended-summary__stat"
          >
            <span className="journalit-session-mode-ended-summary__stat-label">
              {stat.label}
            </span>
            <span className="journalit-session-mode-ended-summary__stat-value">
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

const SessionModeEmptyLayoutState: React.FC<{
  editButton: React.ReactNode | null;
}> = ({ editButton }) => (
  <section className="journalit-session-mode-empty-layout-state">
    <div className="journalit-session-mode-empty-layout-state__title">
      {t('session-mode.layout.empty.title')}
    </div>
    <div className="journalit-session-mode-empty-layout-state__description">
      {t('session-mode.layout.empty.description')}
    </div>
    {editButton}
  </section>
);

const stepKeys: Parameters<typeof t>[0][] = [
  'session-mode.unconfigured.step.window.title',
  'session-mode.unconfigured.step.prep.title',
  'session-mode.unconfigured.step.gate.title',
  'session-mode.unconfigured.step.log.title',
];

const getSteps = () => stepKeys.map((key) => t(key));

const SessionModeUnconfiguredState: React.FC<{
  plugin: JournalitPlugin;
  onStartUnplannedSession: () => void;
}> = ({ plugin, onStartUnplannedSession }) => {
  const steps = getSteps();
  const registerConfigureTarget = useGuideTarget(
    SESSION_MODE_CONFIGURE_BUTTON_TARGET_ID
  );
  const emitGuideAction = useGuideAction();
  return (
    <section className="journalit-session-mode-empty-state">
      <div className="journalit-session-mode-empty-state__title">
        {t('session-mode.unconfigured.title')}
      </div>
      <div className="journalit-session-mode-empty-state__description">
        {t('session-mode.unconfigured.description')}
      </div>
      <div className="journalit-session-mode-empty-state__steps">
        {steps.map((step) => (
          <div key={step} className="journalit-session-mode-empty-state__step">
            <div className="journalit-session-mode-empty-state__step-icon">
              <Check size={14} aria-hidden="true" />
            </div>
            <div className="journalit-session-mode-empty-state__step-title">
              {step}
            </div>
          </div>
        ))}
      </div>
      <div className="journalit-session-mode-empty-state__actions">
        <Button
          ref={registerConfigureTarget}
          variant="primary"
          size="medium"
          fullWidth
          onClick={() => {
            emitGuideAction(SESSION_MODE_SETTINGS_OPENED_ACTION_ID);
            openSessionModeSettings(plugin);
          }}
        >
          {t('session-mode.unconfigured.action')}
        </Button>
        <Button
          variant="secondary"
          size="medium"
          fullWidth
          onClick={onStartUnplannedSession}
        >
          <Play size={14} aria-hidden="true" />
          {t('session-mode.unplanned.start')}
        </Button>
      </div>
    </section>
  );
};

export class SessionModeView extends ReactView {
  private plugin: JournalitPlugin;

  constructor(leaf: WorkspaceLeaf, plugin: JournalitPlugin) {
    super(leaf, {
      containerClass: 'journalit-session-mode-view-container',
      rootId: 'journalit-session-mode-view',
    });
    this.plugin = plugin;
  }

  getViewType(): string {
    return SESSION_MODE_VIEW_TYPE;
  }

  getDisplayText(): string {
    return t('view.session-mode');
  }

  getIcon(): string {
    return 'radio';
  }

  async onOpen(): Promise<void> {
    this.containerEl.addClass('journalit-session-mode-view-container');
    await super.onOpen();
  }

  protected getRenderFunction(): RenderFunction {
    const SessionModeRenderer = () => (
      <SessionMode plugin={this.plugin} hoverParent={this} />
    );
    SessionModeRenderer.displayName = 'SessionModeRenderer';
    return SessionModeRenderer;
  }
}
