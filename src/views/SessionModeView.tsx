import React, {
  useCallback,
  useEffect,
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
import { TradeFormModal } from '../components/forms/trade/TradeFormModal';
import {
  fetchDashboardData,
  Trade,
} from '../components/dashboard/utils/dataUtils';
import { createDashboardFilters } from '../settings/viewFiltersDefaults';
import { eventBus } from '../services/events';
import { SessionLogPanel } from '../components/sessionLog/SessionLogPanel';
import { GoalsWidget } from '../components/reviewV2/widgets/GoalsWidget';
import { ChecklistWidget } from '../components/reviewV2/widgets/ChecklistWidget';
import { Button } from '../components/ui/Button';
import { TradeGatePanel } from '../components/sessionMode/TradeGatePanel';
import { getTradeGateRunsFromFile } from '../components/sessionMode/tradeGateUtils';
import {
  ArrowUpRightFromSquare,
  ChevronRight,
  Calendar,
  Check,
  Edit,
  GlassWater,
  Import,
  PlusCircle,
} from '../components/shared/icons/ObsidianIcon';
import {
  createManualTimelineEntries,
  createTradeTimelineEntries,
  filterAutomaticTradeTimelineEntries,
  filterTimelineEntriesBySessionWindow,
  getSessionLogEntriesFromFile,
  sortSessionTimeline,
} from '../components/sessionLog/sessionLogUtils';
import { resolveSessionModePhase } from '../utils/sessionModePhase';
import type {
  SessionModeLayoutModuleId,
  SessionModePhaseState,
} from '../types/sessionMode';
import type { SessionLogTimelineEntry } from '../types/sessionLog';
import { SETTINGS_TAB_IDS } from '../settings/types';
import { normalizeSessionModePhaseLayouts } from '../utils/sessionModeLayout';

export const SESSION_MODE_VIEW_TYPE = 'journalit-session-mode-view';

const getLocalDateKey = (date: Date): string =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

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
        const previousTradingDayKey = getLocalDateKey(
          getTradingDay(phaseState.previousSession.start, plugin)
        );
        const nextTradingDayKey = getLocalDateKey(
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
    tradingDays.set(getLocalDateKey(tradingDay), tradingDay);
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
  const currentTradingDayKey = getLocalDateKey(getTradingDay(now, plugin));
  const tradingDay = useMemo(
    () => createLocalDateFromKey(currentTradingDayKey),
    [currentTradingDayKey]
  );
  const phaseState = useMemo(
    () =>
      resolveSessionModePhase(now, plugin.settings.sessionMode, tradingDay, {
        skipWeekends: plugin.settings.trade.skipWeekends ?? true,
      }),
    [
      now,
      plugin.settings.sessionMode,
      plugin.settings.trade.skipWeekends,
      tradingDay,
    ]
  );
  const phaseStateRef = useRef(phaseState);
  phaseStateRef.current = phaseState;
  const phaseLoadKey = useMemo(() => getPhaseLoadKey(phaseState), [phaseState]);
  const backingDate = getSessionBackingDate(phaseState, plugin);
  const backingTradingDayKey = backingDate
    ? getLocalDateKey(getTradingDay(backingDate, plugin))
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
    void loadSession();
  }, [loadSession, phaseLoadKey]);

  useEffect(() => {
    const unsubscribeTrade = eventBus.subscribe('trade:changed', () => {
      void loadSession();
    });
    const unsubscribeReview = eventBus.subscribe(
      'review:changed',
      (payload) => {
        if (payload.type === 'drc') void loadSession();
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
  }, [loadSession]);

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
    (filePath !== null &&
      loadedBackingTradingDayKey === backingTradingDayKey) ||
    phaseState.phase === 'unconfigured';
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

  return shouldRenderLoadedSession ? (
    <div className="journalit-session-mode">
      {phaseState.phase !== 'ended' && phaseState.phase !== 'unconfigured' && (
        <div className="journalit-session-mode-header">
          <div className="journalit-session-mode-header__top">
            <div className="journalit-session-mode-header__title-group">
              <h3>{getSessionModeViewTitle(phaseState)}</h3>
              {phaseState.phase === 'live' && drcButton}
            </div>
            <div className="journalit-session-mode-header__actions">
              {editButton}
            </div>
          </div>
          {phaseState.phase === 'preparation' && (
            <SessionModeDRCLink
              plugin={plugin}
              filePath={resolvedFilePath}
              tradingDay={backingTradingDay ?? tradingDay}
            />
          )}
        </div>
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
      />
    </div>
  ) : (
    <SessionModeSkeleton phaseState={phaseState} />
  );
};

const openSessionModeSettings = (plugin: JournalitPlugin): void => {
  plugin.openSettingsToTab(SETTINGS_TAB_IDS.SESSION_MODE);
};

const SessionModeSettingsButton: React.FC<{ plugin: JournalitPlugin }> = ({
  plugin,
}) => (
  <button
    type="button"
    className="journalit-session-mode-edit-button"
    onClick={() => openSessionModeSettings(plugin)}
  >
    <Edit size={14} aria-hidden="true" />
    <span>{t('button.edit')}</span>
  </button>
);

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
      return t('session-mode.title.live');
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
}> = ({ plugin, filePath }) => (
  <section className="journalit-session-mode-section">
    <div className="journalit-session-mode-prep-card">
      <GoalsWidget filePath={filePath} plugin={plugin} />
    </div>
  </section>
);

const SessionModePreparationChecklist: React.FC<{
  plugin: JournalitPlugin;
  filePath: string;
}> = ({ plugin, filePath }) => (
  <section className="journalit-session-mode-section">
    <div className="journalit-session-mode-prep-card">
      <ChecklistWidget filePath={filePath} plugin={plugin} />
    </div>
  </section>
);

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
}> = ({
  phaseState,
  plugin,
  filePath,
  hoverParent,
  timelineEntries,
  tradeGate,
  timeline,
  editButton,
}) => {
  if (phaseState.phase === 'unconfigured') {
    return <SessionModeUnconfiguredState plugin={plugin} />;
  }

  if (phaseState.phase === 'waiting') {
    return (
      <SessionModeWaitingState
        phaseState={phaseState}
        plugin={plugin}
        filePath={filePath}
      />
    );
  }

  if (phaseState.phase === 'break') {
    return (
      <SessionModeBreakState
        phaseState={phaseState}
        plugin={plugin}
        filePath={filePath}
      />
    );
  }

  const phase = phaseState.phase;
  const moduleIds = normalizeSessionModePhaseLayouts(
    plugin.settings.sessionMode.phaseLayouts
  )[phase];
  const hasVisibleModule = moduleIds.some((moduleId) =>
    isSessionModeModuleVisible(moduleId, plugin)
  );

  if (!hasVisibleModule) {
    return (
      <SessionModeEmptyLayoutState
        editButton={phaseState.phase === 'ended' ? editButton : null}
      />
    );
  }

  const renderedModules = moduleIds.map((moduleId) => (
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
    />
  ));

  return <>{renderedModules}</>;
};

const isSessionModeModuleVisible = (
  moduleId: SessionModeLayoutModuleId,
  plugin: JournalitPlugin
): boolean => {
  switch (moduleId) {
    case 'preparationResources':
      return plugin.settings.sessionMode.linkedResources.length > 0;
    case 'tradeGate':
      return plugin.settings.sessionMode.tradeGateWorkflows.length > 0;
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
      return phaseState.phase === 'live' ? tradeGate : null;
    case 'timeline':
      return phaseState.phase === 'live' ? timeline : null;
    case 'endedActions':
      return phaseState.phase === 'ended' ? (
        <SessionModeEndedActions
          plugin={plugin}
          filePath={filePath}
          editButton={editButton}
        />
      ) : null;
    case 'endedStats':
      return phaseState.phase === 'ended' ? (
        <SessionModeEndedStats
          plugin={plugin}
          filePath={filePath}
          timelineEntries={timelineEntries}
          sessionWindow={phaseState.previousSession}
        />
      ) : null;
  }
};

const SessionModeWaitingState: React.FC<{
  phaseState: SessionModePhaseState;
  plugin: JournalitPlugin;
  filePath: string;
}> = ({ phaseState, plugin, filePath }) => {
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
      <button
        type="button"
        className="journalit-session-mode-waiting-state__action"
        onClick={() => void openDRC()}
      >
        <Calendar size={16} aria-hidden="true" />
        <span>{t('session-mode.waiting.open-drc')}</span>
      </button>
    </section>
  );
};

const SessionModeBreakState: React.FC<{
  phaseState: SessionModePhaseState;
  plugin: JournalitPlugin;
  filePath: string;
}> = ({ phaseState, plugin, filePath }) => {
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
      <button
        type="button"
        className="journalit-session-mode-break-state__action"
        onClick={() => void openDRC()}
      >
        <Calendar size={16} aria-hidden="true" />
        <span>{t('session-mode.break.open-drc')}</span>
      </button>
    </section>
  );
};

const SessionModeEndedActions: React.FC<{
  plugin: JournalitPlugin;
  filePath: string;
  editButton: React.ReactNode;
}> = ({ plugin, filePath, editButton }) => {
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
}> = ({ plugin, filePath, timelineEntries, sessionWindow }) => {
  const scopedTimelineEntries = sessionWindow
    ? filterTimelineEntriesBySessionWindow(timelineEntries, sessionWindow)
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
    if (
      completedAt &&
      completedAt.getTime() >= sessionWindow.start.getTime() &&
      completedAt.getTime() < sessionWindow.end.getTime()
    ) {
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

const SessionModeUnconfiguredState: React.FC<{ plugin: JournalitPlugin }> = ({
  plugin,
}) => {
  const steps = [
    t('session-mode.unconfigured.step.window.title'),
    t('session-mode.unconfigured.step.prep.title'),
    t('session-mode.unconfigured.step.gate.title'),
    t('session-mode.unconfigured.step.log.title'),
  ];

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
      <Button
        variant="primary"
        size="small"
        className="journalit-session-mode-empty-state__button"
        onClick={() => openSessionModeSettings(plugin)}
      >
        {t('session-mode.unconfigured.action')}
      </Button>
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
