import React, { useMemo, useState } from 'react';
import type JournalitPlugin from '../../../main';
import { useReviewData } from '../hooks/useReviewData';
import { SessionLogPanel } from '../../sessionLog/SessionLogPanel';
import {
  createManualTimelineEntries,
  createTradeTimelineEntries,
  filterAutomaticTradeTimelineEntries,
  findOwningSessionWindow,
  getSessionLogTags,
  isTimelineEntryInSessionWindow,
  normalizeSessionLogEntries,
  sortSessionTimeline,
} from '../../sessionLog/sessionLogUtils';
import type { SessionLogTimelineEntry } from '../../../types/sessionLog';
import {
  formatLocalDateString,
  parseLocalDateSafe,
} from '../../../utils/dateUtils';
import {
  getTradingDay,
  getTradingDayRange,
} from '../../../utils/tradingDayUtils';
import { resolveSessionModeWindowsForTradingDay } from '../../../utils/sessionModePhase';
import { t } from '../../../lang/helpers';
import type {
  ResolvedSessionModeWindow,
  UnplannedSession,
} from '../../../types/sessionMode';
import { normalizeUnplannedSessions } from '../../../types/sessionMode';
import { resolveUnplannedSessionWindow } from '../../sessionMode/unplannedSessionUtils';
import { useEventBus } from '../../../hooks/useEventBus';
import { Tooltip } from '../../shared/Tooltip';
import { Info } from '../../shared/icons/ObsidianIcon';
import { shareLoadingProps } from '../../../services/share/brandedCapture';

const getSessionWindowsForTradingDay = (
  tradingDay: Date,
  plugin: JournalitPlugin,
  unplannedSessions: UnplannedSession[]
): ResolvedSessionModeWindow[] => {
  const now = new Date();
  return resolveSessionModeWindowsForTradingDay(
    tradingDay,
    plugin.settings.sessionMode.sessionWindows,
    unplannedSessions.map((session) =>
      resolveUnplannedSessionWindow(session, now, plugin)
    ),
    (date) => getTradingDay(date, plugin)
  );
};

const getSessionGroupLabel = (
  window: ResolvedSessionModeWindow,
  use24HourTime: boolean
): string =>
  window.kind === 'unplanned'
    ? t('session-log.session-group.unplanned', {
        time: window.start.toLocaleTimeString(undefined, {
          hour: '2-digit',
          minute: '2-digit',
          hour12: !use24HourTime,
        }),
      })
    : window.name;

const SessionGroupHeader: React.FC<{
  window: ResolvedSessionModeWindow;
  use24HourTime: boolean;
}> = ({ window, use24HourTime }) => (
  <div className="journalit-session-log-session-group__header">
    <span>{getSessionGroupLabel(window, use24HourTime)}</span>
    {window.kind === 'unplanned' && (
      <Tooltip
        content={window.reason}
        className="journalit-session-log-session-group__tooltip"
        preferredPosition="top"
        disclosureLabel={t('session-mode.unplanned.modal.reason-label')}
      >
        <Info
          className="journalit-session-log-session-group__info"
          size={12}
          aria-hidden="true"
        />
      </Tooltip>
    )}
  </div>
);

const createOutsideSessionWindow = (
  tradingDay: Date,
  plugin: JournalitPlugin,
  sessionWindows: ResolvedSessionModeWindow[] = []
): ResolvedSessionModeWindow => {
  const { start, end } = getTradingDayRange(tradingDay, plugin);
  const clampedWindows: Array<{ start: Date; end: Date }> = [];
  for (const window of sessionWindows) {
    const clampedWindow = {
      start: new Date(Math.max(window.start.getTime(), start.getTime())),
      end: new Date(Math.min(window.end.getTime(), end.getTime())),
    };
    if (clampedWindow.start.getTime() < clampedWindow.end.getTime()) {
      clampedWindows.push(clampedWindow);
    }
  }
  clampedWindows.sort((a, b) => a.start.getTime() - b.start.getTime());

  const gaps: Array<{ start: Date; end: Date }> = [];
  let cursor = start;
  for (const window of clampedWindows) {
    if (cursor.getTime() < window.start.getTime()) {
      gaps.push({ start: cursor, end: window.start });
    }
    if (window.end.getTime() > cursor.getTime()) {
      cursor = window.end;
    }
  }
  if (cursor.getTime() < end.getTime()) {
    gaps.push({ start: cursor, end });
  }

  const now = new Date();
  const nowMs = now.getTime();
  const activeGap = gaps.find(
    (gap) => nowMs >= gap.start.getTime() && nowMs < gap.end.getTime()
  );
  
  
  const outsideWindow = activeGap ??
    (nowMs >= end.getTime() ? gaps[gaps.length - 1] : gaps[0]) ?? {
      start,
      end: start,
    };

  return {
    kind: 'scheduled',
    id: 'outside-sessions',
    name: t('session-log.session-group.outside'),
    startTime: '00:00',
    endTime: '00:00',
    start: outsideWindow.start,
    end: outsideWindow.end,
  };
};

const createTradeTimelineEntriesForDRC = (
  trades: unknown[],
  drcDate: Date,
  plugin: JournalitPlugin,
  unplannedSessions: UnplannedSession[]
): SessionLogTimelineEntry[] => {
  const drcTradingDayKey = formatLocalDateString(drcDate);
  const sessionWindows = getSessionWindowsForTradingDay(
    drcDate,
    plugin,
    unplannedSessions
  );
  const tradingDays = new Map<string, Date>([[drcTradingDayKey, drcDate]]);
  for (const window of sessionWindows) {
    const windowEnd = new Date(window.end.getTime() - 1);
    for (const tradingDay of [
      getTradingDay(window.start, plugin),
      getTradingDay(windowEnd, plugin),
    ]) {
      tradingDays.set(formatLocalDateString(tradingDay), tradingDay);
    }
  }

  const timelineEntriesById = new Map<string, SessionLogTimelineEntry>();
  for (const tradingDay of tradingDays.values()) {
    const isDRCTradingDay =
      formatLocalDateString(tradingDay) === drcTradingDayKey;
    for (const entry of createTradeTimelineEntries(
      trades,
      tradingDay,
      plugin
    )) {
      if (
        !isDRCTradingDay &&
        !sessionWindows.some((window) =>
          isTimelineEntryInSessionWindow(entry, window)
        )
      ) {
        continue;
      }
      timelineEntriesById.set(entry.id, entry);
    }
  }
  return Array.from(timelineEntriesById.values());
};

interface SessionLogWidgetProps {
  filePath: string;
  plugin: JournalitPlugin;
  hideEmptyOutsideSession?: boolean;
}

const formatLessonTime = (date: Date, use24HourTime: boolean): string => {
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  if (use24HourTime) return `${String(hours).padStart(2, '0')}:${minutes}`;
  const period = hours >= 12 ? 'PM' : 'AM';
  return `${hours % 12 || 12}:${minutes}\u202f${period}`;
};

const LessonSummary: React.FC<{
  entries: Extract<SessionLogTimelineEntry, { kind: 'manual' }>[];
  use24HourTime: boolean;
  tagLabelsById: Map<string, string>;
  showRowTags: boolean;
}> = ({ entries, use24HourTime, tagLabelsById, showRowTags }) => {
  if (entries.length === 0) return null;

  return (
    <section className="journalit-session-log-lessons-summary">
      <div className="journalit-session-log-lessons-summary__header">
        <span>{t('session-log.lessons.title')}</span>
        <span className="journalit-session-log-lessons-summary__count">
          {entries.length}
        </span>
      </div>
      <div className="journalit-session-log-lessons-summary__list">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="journalit-session-log-lessons-summary__item"
          >
            <span className="journalit-session-log-lessons-summary__dot" />
            <span className="journalit-session-log-lessons-summary__text">
              {entry.text}
              {showRowTags ? (
                <span className="journalit-session-log-lessons-summary__badge">
                  {tagLabelsById.get(entry.tagId) ??
                    t('session-log.lessons.badge')}
                </span>
              ) : null}
              <span className="journalit-session-log-lessons-summary__separator">
                •
              </span>
              <span className="journalit-session-log-lessons-summary__time">
                {formatLessonTime(entry.timestamp, use24HourTime)}
              </span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export const SessionLogWidget: React.FC<SessionLogWidgetProps> = React.memo(
  ({ filePath, plugin, hideEmptyOutsideSession = false }) => {
    const { data, loading, refresh } = useReviewData(filePath, plugin);
    const [settingsVersion, setSettingsVersion] = useState(0);
    useEventBus('settings:changed', (payload) => {
      if (payload.section === 'sessionMode' || payload.section === 'all') {
        setSettingsVersion((current) => current + 1);
      }
    });

    const timelineEntries = useMemo(() => {
      void settingsVersion;
      if (!data) return [];
      const frontmatterDate = data.frontmatter.date;
      const drcDate =
        typeof frontmatterDate === 'string' ||
        typeof frontmatterDate === 'number' ||
        frontmatterDate instanceof Date
          ? parseLocalDateSafe(frontmatterDate)
          : null;
      const manualEntries = createManualTimelineEntries(
        normalizeSessionLogEntries(data.frontmatter?.sessionLog)
      );
      const executionTrades = data.executionBasisTrades ?? data.trades;
      const tradeEntries =
        drcDate && plugin.settings.sessionMode.showTradeExecutionsInSessionLog
          ? createTradeTimelineEntriesForDRC(
              executionTrades,
              drcDate,
              plugin,
              normalizeUnplannedSessions(
                data.frontmatter.sessionModeUnplannedSessions
              )
            )
          : [];
      return filterAutomaticTradeTimelineEntries(
        sortSessionTimeline([...manualEntries, ...tradeEntries]),
        plugin.settings.sessionMode.showTradeExecutionsInSessionLog
      );
    }, [data, plugin, settingsVersion]);

    const sessionGroups = useMemo(() => {
      if (!data) return [];
      const frontmatterDate = data.frontmatter.date;
      const drcDate =
        typeof frontmatterDate === 'string' ||
        typeof frontmatterDate === 'number' ||
        frontmatterDate instanceof Date
          ? parseLocalDateSafe(frontmatterDate)
          : null;
      if (!drcDate) return [];

      const windows = getSessionWindowsForTradingDay(
        drcDate,
        plugin,
        normalizeUnplannedSessions(
          data.frontmatter.sessionModeUnplannedSessions
        )
      );
      if (windows.length === 0) return [];

      const groups: Array<{
        id: string;
        label: string;
        sessionWindow: ResolvedSessionModeWindow;
        entries: SessionLogTimelineEntry[];
      }> = windows.map((window) => ({
        id: window.id,
        label: window.name,
        sessionWindow: window,
        entries: [],
      }));
      const groupsByWindow = new Map(
        windows.map((window, index) => [window, groups[index]])
      );

      const outsideEntries: SessionLogTimelineEntry[] = [];
      for (const entry of timelineEntries) {
        const owner = findOwningSessionWindow(entry, windows);
        const group = owner ? groupsByWindow.get(owner) : undefined;
        if (group) {
          group.entries.push(entry);
        } else {
          outsideEntries.push(entry);
        }
      }
      
      
      if (outsideEntries.length > 0 || !hideEmptyOutsideSession) {
        groups.push({
          id: 'outside-sessions',
          label: t('session-log.session-group.outside'),
          sessionWindow: createOutsideSessionWindow(drcDate, plugin, windows),
          entries: outsideEntries,
        });
      }

      return groups;
    }, [data, plugin, timelineEntries, hideEmptyOutsideSession]);

    const drcTimestampContext = useMemo(() => {
      if (!data) return undefined;
      const frontmatterDate = data.frontmatter.date;
      const drcDate =
        typeof frontmatterDate === 'string' ||
        typeof frontmatterDate === 'number' ||
        frontmatterDate instanceof Date
          ? parseLocalDateSafe(frontmatterDate)
          : null;
      return drcDate ? createOutsideSessionWindow(drcDate, plugin) : undefined;
    }, [data, plugin]);

    const lessonTagContext = useMemo(() => {
      const lessonTagIds = new Set<string>();
      const tagLabelsById = new Map<string, string>();
      for (const tag of getSessionLogTags(plugin)) {
        if (tag.lessonTag) {
          lessonTagIds.add(tag.id);
          tagLabelsById.set(tag.id, tag.shortLabel || tag.label);
        }
      }
      const entries = timelineEntries.filter(
        (
          entry
        ): entry is Extract<SessionLogTimelineEntry, { kind: 'manual' }> =>
          entry.kind === 'manual' && lessonTagIds.has(entry.tagId)
      );
      const usedLessonTagIds = new Set(entries.map((entry) => entry.tagId));
      return {
        entries,
        tagLabelsById,
        showRowTags: usedLessonTagIds.size > 1,
      };
    }, [plugin, timelineEntries]);

    const lessonSummary = (
      <LessonSummary
        entries={lessonTagContext.entries}
        use24HourTime={plugin.settings.trade.use24HourTime ?? false}
        tagLabelsById={lessonTagContext.tagLabelsById}
        showRowTags={lessonTagContext.showRowTags}
      />
    );

    if (loading && timelineEntries.length === 0) {
      return (
        <div className="journalit-widget-loading" {...shareLoadingProps}>
          {t('session-log.loading')}
        </div>
      );
    }

    if (sessionGroups.length > 0) {
      return (
        <div className="journalit-session-log-session-groups">
          {lessonSummary}
          {sessionGroups.map((group) => (
            <section
              key={group.id}
              className="journalit-session-log-session-group"
            >
              {group.id === 'outside-sessions' ? (
                <div className="journalit-session-log-session-group__header">
                  <span>{group.label}</span>
                </div>
              ) : (
                <SessionGroupHeader
                  window={group.sessionWindow}
                  use24HourTime={plugin.settings.trade.use24HourTime ?? false}
                />
              )}
              <SessionLogPanel
                plugin={plugin}
                filePath={filePath}
                timelineEntries={group.entries}
                compact
                composerInitiallyVisible={false}
                showComposerToggle
                showFilters={false}
                timestampSessionWindow={group.sessionWindow}
                onRefresh={refresh}
              />
            </section>
          ))}
        </div>
      );
    }

    return (
      <>
        {lessonSummary}
        <SessionLogPanel
          plugin={plugin}
          filePath={filePath}
          timelineEntries={timelineEntries}
          compact
          composerInitiallyVisible={false}
          showComposerToggle
          timestampSessionWindow={drcTimestampContext}
          onRefresh={refresh}
        />
      </>
    );
  }
);

SessionLogWidget.displayName = 'SessionLogWidget';
