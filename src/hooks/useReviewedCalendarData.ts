

import { useCallback, useEffect, useState } from 'react';
import { usePlugin } from './usePlugin';
import { useEventBus } from './useEventBus';
import type { DRCService } from '../services/drc/DRCService';
import type { WeeklyReviewService } from '../services/weekly/WeeklyReviewService';

interface ReviewedCalendarData {
  
  reviewedDayKeys: ReadonlySet<string>;
  
  isWeekReviewed: (date: Date) => boolean;
}

interface ReviewServices {
  drcService: DRCService;
  weeklyReviewService: WeeklyReviewService;
}

const EMPTY_KEYS: ReadonlySet<string> = new Set<string>();


export function useReviewedCalendarData(): ReviewedCalendarData {
  const plugin = usePlugin();
  const [services, setServices] = useState<ReviewServices | null>(null);
  
  const [, setVersion] = useState(0);
  const bump = useCallback(() => setVersion((v) => v + 1), []);

  useEventBus('drc:reviewed-index-invalidated', bump);
  useEventBus('weekly:reviewed-index-invalidated', bump);

  const serviceManager = plugin?.serviceManager;

  useEffect(() => {
    if (!serviceManager) return;

    let cancelled = false;
    void Promise.all([
      serviceManager.getDRCService(),
      serviceManager.getWeeklyReviewService(),
    ])
      .then(([drcService, weeklyReviewService]) => {
        if (cancelled) return;
        setServices({ drcService, weeklyReviewService });
      })
      .catch((error: unknown) => {
        console.error(
          '[useReviewedCalendarData] Failed to load review services:',
          error
        );
      });

    return () => {
      cancelled = true;
    };
  }, [serviceManager]);

  const weeklyReviewService = services?.weeklyReviewService;

  return {
    reviewedDayKeys: services?.drcService.getReviewedDayKeys() ?? EMPTY_KEYS,
    isWeekReviewed: (date: Date) =>
      weeklyReviewService?.isWeekReviewed(date) ?? false,
  };
}
