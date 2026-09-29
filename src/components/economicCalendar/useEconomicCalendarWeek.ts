

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
  | EconomicCalendarFetchResult['status'];

interface WeekState {
  status: EconomicCalendarWeekStatus;
  
  settledStatus: EconomicCalendarFetchResult['status'] | null;
  events: EconomicCalendarEvent[];
  
  fetchedAt: number;
  
  weekDate: Date;
}

interface EconomicCalendarWeek extends WeekState {
  
  keyEvents: NewsEvent[];
  
  refresh: () => Promise<EconomicCalendarFetchResult['status']>;
  
  refreshKeyEvents: () => Promise<void>;
}

export function useEconomicCalendarWeek(
  plugin: JournalitPlugin,
  
  
  onKeyEventsChanged?: (events: NewsEvent[]) => void
): EconomicCalendarWeek {
  const [week, setWeek] = useState<WeekState>(() => ({
    status: 'loading',
    settledStatus: null,
    events: [],
    fetchedAt: Date.now(),
    weekDate: new Date(),
  }));
  const [keyEvents, setKeyEvents] = useState<NewsEvent[]>([]);
  
  const weekDateRef = useRef(week.weekDate);
  const isMountedRef = useRef(false);
  const keyEventsReadGenerationRef = useRef(0);
  
  const weekLoadGenerationRef = useRef(0);
  
  const newestWeekLoadRef = useRef<Promise<
    EconomicCalendarFetchResult['status']
  > | null>(null);
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

  const loadWeek = useCallback(
    async (
      loadGeneration: number
    ): Promise<EconomicCalendarFetchResult['status']> => {
      const isSuperseded = (): boolean =>
        loadGeneration !== weekLoadGenerationRef.current;
      
      
      const followNewestLoad = (): Promise<
        EconomicCalendarFetchResult['status']
      > => {
        const newestLoad = newestWeekLoadRef.current;
        
        
        if (newestLoad === null) {
          throw new Error(
            '[EconomicCalendar] Superseded week load has no newer load'
          );
        }
        return newestLoad;
      };
      setWeek((current) => ({ ...current, status: 'loading' }));
      const weekDate = new Date();
      weekDateRef.current = weekDate;

      let result: EconomicCalendarFetchResult;
      try {
        const service =
          await plugin.serviceManager.getEconomicCalendarService();
        result = await service.fetchWeek({ weekDate });
        await refreshKeyEvents();
      } catch (error) {
        console.error('[EconomicCalendar] Failed to load events:', error);
        if (isSuperseded()) return followNewestLoad();
        if (!isMountedRef.current) return 'error';
        setWeek({
          status: 'error',
          settledStatus: 'error',
          events: [],
          fetchedAt: Date.now(),
          weekDate,
        });
        return 'error';
      }

      if (isSuperseded()) return followNewestLoad();
      if (!isMountedRef.current) return result.status;

      if (result.status !== 'ok') {
        setWeek({
          status: result.status,
          settledStatus: result.status,
          events: [],
          fetchedAt: Date.now(),
          weekDate,
        });
        return result.status;
      }

      
      setWeek({
        status: 'ok',
        settledStatus: 'ok',
        events: result.events,
        fetchedAt: Date.now(),
        weekDate,
      });
      return 'ok';
    },
    [plugin, refreshKeyEvents]
  );

  const refresh = useCallback((): Promise<
    EconomicCalendarFetchResult['status']
  > => {
    const load = loadWeek(++weekLoadGenerationRef.current);
    newestWeekLoadRef.current = load;
    return load;
  }, [loadWeek]);

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

  
  
  useEffect(() => {
    const handleSubscriptionChanged = (): void => {
      void refresh();
    };
    window.addEventListener(
      'journalit:subscription-changed',
      handleSubscriptionChanged
    );
    return () => {
      window.removeEventListener(
        'journalit:subscription-changed',
        handleSubscriptionChanged
      );
    };
  }, [refresh]);

  return { ...week, keyEvents, refresh, refreshKeyEvents };
}
