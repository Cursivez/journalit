

import { useCallback, useEffect, useRef, useState } from 'react';
import type JournalitPlugin from '../../main';
import type {
  EconomicCalendarEvent,
  EconomicCalendarFetchResult,
} from '../../services/economicCalendar/types';
import type { NewsEvent } from '../../services/weekly/types';
import type { ReviewChangedPayload } from '../../services/events/types';
import { useEventBus } from '../../hooks/useEventBus';

type EconomicCalendarWeekStatus =
  | 'loading'
  | 'ok'
  | 'not_entitled'
  | 'offline'
  | 'error';

interface WeekState {
  status: EconomicCalendarWeekStatus;
  events: EconomicCalendarEvent[];
  
  fetchedAt: number;
  
  weekDate: Date;
}

interface EconomicCalendarWeek extends WeekState {
  
  keyEvents: NewsEvent[];
  
  refresh: () => Promise<EconomicCalendarWeekStatus>;
  
  refreshKeyEvents: () => Promise<void>;
}

export function useEconomicCalendarWeek(
  plugin: JournalitPlugin,
  
  
  onKeyEventsChanged?: (events: NewsEvent[]) => void
): EconomicCalendarWeek {
  const [week, setWeek] = useState<WeekState>(() => ({
    status: 'loading',
    events: [],
    fetchedAt: Date.now(),
    weekDate: new Date(),
  }));
  const [keyEvents, setKeyEvents] = useState<NewsEvent[]>([]);
  
  const weekDateRef = useRef(week.weekDate);
  const isMountedRef = useRef(false);
  const keyEventsReadGenerationRef = useRef(0);
  const onKeyEventsChangedRef = useRef(onKeyEventsChanged);

  useEffect(() => {
    onKeyEventsChangedRef.current = onKeyEventsChanged;
  }, [onKeyEventsChanged]);

  const refreshKeyEvents = useCallback(async (): Promise<void> => {
    const readGeneration = ++keyEventsReadGenerationRef.current;
    const weeklyReviewService =
      await plugin.serviceManager.getWeeklyReviewService();
    const weekEvents = await weeklyReviewService.readKeyEventsForWeek(
      weekDateRef.current
    );
    if (
      isMountedRef.current &&
      readGeneration === keyEventsReadGenerationRef.current
    ) {
      setKeyEvents(weekEvents);
      onKeyEventsChangedRef.current?.(weekEvents);
    }
  }, [plugin]);

  const refresh = useCallback(async (): Promise<EconomicCalendarWeekStatus> => {
    setWeek((current) => ({ ...current, status: 'loading' }));
    const weekDate = new Date();
    weekDateRef.current = weekDate;

    let result: EconomicCalendarFetchResult;
    try {
      const service = await plugin.serviceManager.getEconomicCalendarService();
      result = await service.fetchWeek({ weekDate });
      await refreshKeyEvents();
    } catch (error) {
      console.error('[EconomicCalendar] Failed to load events:', error);
      if (isMountedRef.current) {
        setWeek({
          status: 'error',
          events: [],
          fetchedAt: Date.now(),
          weekDate,
        });
      }
      return 'error';
    }

    if (!isMountedRef.current) return result.status;

    if (result.status !== 'ok') {
      setWeek({
        status: result.status,
        events: [],
        fetchedAt: Date.now(),
        weekDate,
      });
      return result.status;
    }

    
    setWeek({
      status: 'ok',
      events: result.events,
      fetchedAt: Date.now(),
      weekDate,
    });
    return 'ok';
  }, [plugin, refreshKeyEvents]);

  useEffect(() => {
    isMountedRef.current = true;
    void refresh();

    return () => {
      isMountedRef.current = false;
    };
  }, [refresh]);

  const handleReviewChanged = useCallback(
    (payload: ReviewChangedPayload): void => {
      
      
      if (payload.type === 'weekly') void refreshKeyEvents();
    },
    [refreshKeyEvents]
  );

  useEventBus('review:changed', handleReviewChanged);

  return { ...week, keyEvents, refresh, refreshKeyEvents };
}
