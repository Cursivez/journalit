

import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { TFile } from 'obsidian';
import type JournalitPlugin from '../../../main';
import type { NewsEvent } from '../../../services/weekly/types';
import type { ReviewChangedPayload } from '../../../services/events/types';
import { useBackendProEntitlement } from '../../../hooks/useBackendProEntitlement';
import { useEventBus } from '../../../hooks/useEventBus';
import { ChevronRight } from '../../shared/icons/ObsidianIcon';
import { KeyEventsCalendarButton } from '../../shared/keyEvents/KeyEventsCalendarButton';
import { SkeletonBox } from '../../shared/SkeletonBox';
import { SkeletonText } from '../../shared/SkeletonText';
import { t } from '../../../lang/helpers';
import {
  compareKeyEventDays,
  getKeyEventColor,
  getKeyEventDayLabel,
  isKeyEventDayPast,
} from '../../../utils/keyEvents';
import {
  formatIsoTimeOfDay,
  getUse24HourTimeSetting,
} from '../../../utils/timeFormat';

interface KeyEventsHomeWidgetProps {
  plugin: JournalitPlugin;
}

interface DisplayEvent extends NewsEvent {
  originalIndex: number;
}

interface EventGroup {
  day: string | undefined;
  events: DisplayEvent[];
}

const KeyEventsHomeWidgetComponent: React.FC<KeyEventsHomeWidgetProps> = ({
  plugin,
}) => {
  const [events, setEvents] = useState<NewsEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const isMountedRef = useRef(false);
  const weeklyReviewPathRef = useRef<string | null>(null);
  const use24HourTime = getUse24HourTimeSetting(plugin);
  const { isPro } = useBackendProEntitlement(plugin, 'home key events widget');

  const loadEvents = useCallback(async (): Promise<void> => {
    try {
      const weeklyReviewService =
        await plugin.serviceManager.getWeeklyReviewService();
      const currentDate = new Date();
      const weeklyReviewPath =
        weeklyReviewService.getWeeklyReviewPath(currentDate);
      weeklyReviewPathRef.current = weeklyReviewPath;
      const weeklyEvents = weeklyReviewService.getKeyEventsForWeek(currentDate);

      if (isMountedRef.current) setEvents(weeklyEvents);
    } catch (error) {
      console.error('[KeyEventsHomeWidget] Failed to load key events:', error);
      if (isMountedRef.current) setEvents([]);
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  }, [plugin]);

  useEffect(() => {
    isMountedRef.current = true;
    setCurrentDate(new Date());
    void loadEvents();

    const handleMetadataChange = (file: TFile): void => {
      if (file.path === weeklyReviewPathRef.current) {
        void loadEvents();
      }
    };

    plugin.app.metadataCache.on('changed', handleMetadataChange);

    let dayChangeTimeout: number | null = null;
    const scheduleDayChangeRefresh = (): void => {
      const now = new Date();
      const nextDay = new Date(now);
      nextDay.setDate(now.getDate() + 1);
      nextDay.setHours(0, 0, 0, 100);

      dayChangeTimeout = window.setTimeout(() => {
        setCurrentDate(new Date());
        void loadEvents();
        scheduleDayChangeRefresh();
      }, nextDay.getTime() - now.getTime());
    };
    scheduleDayChangeRefresh();

    return () => {
      isMountedRef.current = false;
      plugin.app.metadataCache.off('changed', handleMetadataChange);
      if (dayChangeTimeout !== null) window.clearTimeout(dayChangeTimeout);
    };
  }, [loadEvents, plugin.app.metadataCache]);

  const handleReviewChanged = useCallback(
    (payload: ReviewChangedPayload): void => {
      if (payload.type === 'weekly') {
        void loadEvents();
      }
    },
    [loadEvents]
  );

  const handleSettingsChanged = useCallback(
    (payload?: { section?: string; source?: string }): void => {
      if (payload?.source === 'week-start' || payload?.section === 'trade') {
        void loadEvents();
      }
    },
    [loadEvents]
  );

  const handleFolderPathChanged = useCallback((): void => {
    void loadEvents();
  }, [loadEvents]);

  useEventBus('review:changed', handleReviewChanged);
  useEventBus('settings:changed', handleSettingsChanged);
  useEventBus('folder-path:changed', handleFolderPathChanged);

  const openWeeklyReview = useCallback(async (): Promise<void> => {
    try {
      const weeklyReviewService =
        await plugin.serviceManager.getWeeklyReviewService();
      await weeklyReviewService.openWeeklyReview(new Date());
    } catch (error) {
      console.error(
        '[KeyEventsHomeWidget] Failed to open Weekly Review:',
        error
      );
    }
  }, [plugin]);

  const sortedEvents = useMemo<DisplayEvent[]>(
    () =>
      events
        .map((event, originalIndex) => ({ ...event, originalIndex }))
        .sort((a, b) => {
          const dayDifference = compareKeyEventDays(a.day, b.day);
          return dayDifference || a.originalIndex - b.originalIndex;
        }),
    [events]
  );

  const eventGroups = useMemo<EventGroup[]>(() => {
    const groups: EventGroup[] = [];

    for (const event of sortedEvents) {
      const currentGroup = groups[groups.length - 1];
      if (currentGroup && currentGroup.day === event.day) {
        currentGroup.events.push(event);
      } else {
        groups.push({ day: event.day, events: [event] });
      }
    }

    return groups;
  }, [sortedEvents]);

  return (
    <div className="journalit-home-key-events">
      <div className="journalit-home-key-events__header">
        <button
          type="button"
          className="journalit-native-button journalit-native-button--unstyled journalit-home-key-events__open"
          aria-label={t('home.widget.key-events.open-aria')}
          onClick={() => void openWeeklyReview()}
        >
          <span className="journalit-home-key-events__header-title">
            <span className="journalit-home-widget__eyebrow">
              {t('widget.key-events.title')}
            </span>
            {!loading && events.length > 0 && (
              <span className="journalit-home-key-events__count">
                {events.length}
              </span>
            )}
          </span>
          <ChevronRight
            className="journalit-home-key-events__chevron"
            size={15}
            aria-hidden="true"
          />
        </button>
        {isPro && (
          <div className="journalit-home-key-events__header-actions">
            <KeyEventsCalendarButton
              plugin={plugin}
              className="journalit-home-key-events__calendar"
            />
          </div>
        )}
      </div>

      {loading ? (
        <div className="journalit-home-key-events__loading">
          {['first', 'second', 'third', 'fourth'].map((key) => (
            <div key={key} className="journalit-home-key-events__loading-row">
              <SkeletonBox width={3} height={32} borderRadius="3px" />
              <div className="journalit-home-key-events__loading-copy">
                <SkeletonText width="65%" height="12px" />
                <SkeletonText width="35%" height="10px" />
              </div>
            </div>
          ))}
        </div>
      ) : eventGroups.length === 0 ? (
        <div className="journalit-home-key-events__empty">
          <div className="journalit-home-key-events__empty-title">
            {t('home.widget.key-events.empty-title')}
          </div>
        </div>
      ) : (
        <div
          className="journalit-home-key-events__list"
          role="group"
          tabIndex={0}
          aria-label={t('widget.key-events.title')}
        >
          {eventGroups.map((group) => (
            <div
              key={group.day ?? 'all-week'}
              className={`journalit-home-key-events__group${
                currentDate && isKeyEventDayPast(group.day, currentDate)
                  ? ' journalit-home-key-events__group--past'
                  : ''
              }`}
            >
              <div className="journalit-home-key-events__group-label">
                {getKeyEventDayLabel(group.day)}
              </div>
              {group.events.map((event) => {
                const color = getKeyEventColor(event.color);
                
                
                
                const scheduledTime = formatIsoTimeOfDay(
                  event.time,
                  use24HourTime
                );
                const trailingText =
                  event.eventType === 'holiday'
                    ? t('view.economic-calendar.all-day')
                    : event.source
                      ? scheduledTime || event.notes
                      : event.notes || scheduledTime;

                return (
                  <div
                    key={`${event.originalIndex}-${event.event}`}
                    className="journalit-home-key-events__item"
                  >
                    <span
                      className={`journalit-home-key-events__rail journalit-home-key-events__rail--${color}`}
                    />
                    <div className="journalit-home-key-events__item-title">
                      {event.event}
                    </div>
                    {trailingText && (
                      <span className="journalit-home-key-events__item-time">
                        {trailingText}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const KeyEventsHomeWidget = memo(KeyEventsHomeWidgetComponent);
KeyEventsHomeWidget.displayName = 'KeyEventsHomeWidget';
