import React, { useMemo } from 'react';
import type JournalitPlugin from '../../../main';
import { useReviewData } from '../hooks/useReviewData';
import { SessionLogPanel } from '../../sessionLog/SessionLogPanel';
import {
  createManualTimelineEntries,
  createTradeTimelineEntries,
  getSessionLogTags,
  isTimelineEntryInSessionWindow,
  normalizeSessionLogEntries,
  sortSessionTimeline,
} from '../../sessionLog/sessionLogUtils';
import type { SessionLogTimelineEntry } from '../../../types/sessionLog';
import { parseLocalDateSafe } from '../../../utils/dateUtils';
import {
  getTradingDay,
  getTradingDayRange,
} from '../../../utils/tradingDayUtils';
import { resolveSessionModeWindowsForDate } from '../../../utils/sessionModePhase';
import { t } from '../../../lang/helpers';
import type { ResolvedSessionModeWindow } from '../../../types/sessionMode';

const getLocalDateKey = (date: Date): string =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const getSessionWindowsForTradingDay = (
  tradingDay: Date,
  plugin: JournalitPlugin
): ResolvedSessionModeWindow[] => {
  const previousDate = new Date(tradingDay);
  previousDate.setDate(previousDate.getDate() - 1);
  const tradingDayKey = getLocalDateKey(tradingDay);
  const windows = [
    ...resolveSessionModeWindowsForDate(
      previousDate,
      plugin.settings.sessionMode.sessionWindows
    ),
    ...resolveSessionModeWindowsForDate(
      tradingDay,
      plugin.settings.sessionMode.sessionWindows
    ),
  ];
  const seen = new Set<string>();
  return windows.filter((window) => {
    if (
      getLocalDateKey(getTradingDay(window.start, plugin)) !== tradingDayKey
    ) {
      return false;
    }
    const key = `${window.id}:${window.start.getTime()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

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
  const outsideWindow = activeGap ?? gaps[0] ?? { start, end: start };

  return {
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
  plugin: JournalitPlugin
): SessionLogTimelineEntry[] => {
  const drcTradingDayKey = getLocalDateKey(drcDate);
  const sessionWindows = getSessionWindowsForTradingDay(drcDate, plugin);
  const tradingDays = new Map<string, Date>([[drcTradingDayKey, drcDate]]);
  for (const window of sessionWindows) {
    const windowEnd = new Date(window.end.getTime() - 1);
    for (const tradingDay of [
      getTradingDay(window.start, plugin),
      getTradingDay(windowEnd, plugin),
    ]) {
      tradingDays.set(getLocalDateKey(tradingDay), tradingDay);
    }
  }

  const timelineEntriesById = new Map<string, SessionLogTimelineEntry>();
  for (const tradingDay of tradingDays.values()) {
    const isDRCTradingDay = getLocalDateKey(tradingDay) === drcTradingDayKey;
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
  ({ filePath, plugin }) => {
    const { data, loading, refresh } = useReviewData(filePath, plugin);

    const timelineEntries = useMemo(() => {
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
      const tradeEntries = drcDate
        ? createTradeTimelineEntriesForDRC(executionTrades, drcDate, plugin)
        : [];
      return sortSessionTimeline([...manualEntries, ...tradeEntries]);
    }, [data, plugin]);

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

      const windows = getSessionWindowsForTradingDay(drcDate, plugin);
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
        entries: timelineEntries.filter((entry) =>
          isTimelineEntryInSessionWindow(entry, window)
        ),
      }));

      const outsideEntries = timelineEntries.filter(
        (entry) =>
          !windows.some((window) =>
            isTimelineEntryInSessionWindow(entry, window)
          )
      );
      groups.push({
        id: 'outside-sessions',
        label: t('session-log.session-group.outside'),
        sessionWindow: createOutsideSessionWindow(drcDate, plugin, windows),
        entries: outsideEntries,
      });

      return groups;
    }, [data, plugin, timelineEntries]);

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
        <div className="journalit-widget-loading">
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
              <div className="journalit-session-log-session-group__header">
                {group.label}
              </div>
              <SessionLogPanel
                plugin={plugin}
                filePath={filePath}
                timelineEntries={group.entries}
                compact
                composerInitiallyVisible={group.entries.length === 0}
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
