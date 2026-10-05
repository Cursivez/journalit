

import React, {
  createContext,
  use,
  useMemo,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import { HomePeriod } from '../../../settings/types';
import { getWeekStartDaySetting } from '../../../utils/dateUtils';
import type { HomePeriodSelection } from '../../../settings/homePeriod';
import { getHomePeriodRange } from '../utils/homePeriodRange';
import { useEventBus } from '../../../hooks/useEventBus';
import { getTradingDay } from '../../../utils/tradingDayUtils';
import { usePlugin } from '../../../hooks/usePlugin';
import { getTradeAnalyticsTradingDay } from '../../../utils/tradeAnalyticsDate';

interface HomePeriodContextValue {
  
  period: HomePeriod;
  
  dateRange: [Date | null, Date | null];
  
  isDateInPeriod: (date: Date) => boolean;
  
  isTimestampInPeriod: (timestamp: Date) => boolean;
}

const HomePeriodContext = createContext<HomePeriodContextValue | null>(null);

interface HomePeriodProviderProps {
  selection: HomePeriodSelection;
  children: ReactNode;
}

export const HomePeriodProvider: React.FC<HomePeriodProviderProps> = ({
  selection,
  children,
}) => {
  const plugin = usePlugin();
  const period = selection.period;
  
  
  const [, refreshSettings] = useState(0);
  useEventBus('settings:changed', (payload) => {
    if (
      !payload.section ||
      payload.section === 'trade' ||
      payload.section === 'all' ||
      payload.source === 'week-start'
    ) {
      refreshSettings((value) => value + 1);
    }
  });
  const weekStartDay = getWeekStartDaySetting(plugin ?? undefined);
  const tradingDayCutoffTime = plugin?.settings?.trade?.tradingDayCutoffTime;
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(Date.now());
    }, 60_000);

    return () => window.clearInterval(interval);
  }, []);

  
  const dateRange = useMemo(() => {
    const currentTradingDay = getTradingDay(new Date(now), {
      settings: { trade: { tradingDayCutoffTime } },
    });
    return getHomePeriodRange(selection, currentTradingDay, weekStartDay);
  }, [now, selection, weekStartDay, tradingDayCutoffTime]);

  
  const isDateInPeriod = useMemo(() => {
    return (date: Date): boolean => {
      const [startDate, endDate] = dateRange;

      
      if (!startDate && !endDate) {
        return true;
      }

      const dateTime = date.getTime();

      if (startDate && dateTime < startDate.getTime()) {
        return false;
      }

      if (endDate && dateTime > endDate.getTime()) {
        return false;
      }

      return true;
    };
  }, [dateRange]);

  const isTimestampInPeriod = useMemo(
    () => (timestamp: Date) =>
      isDateInPeriod(
        getTradingDay(timestamp, {
          settings: { trade: { tradingDayCutoffTime } },
        })
      ),
    [isDateInPeriod, tradingDayCutoffTime]
  );

  const contextValue = useMemo<HomePeriodContextValue>(
    () => ({
      period,
      dateRange,
      isDateInPeriod,
      isTimestampInPeriod,
    }),
    [period, dateRange, isDateInPeriod, isTimestampInPeriod]
  );

  return (
    <HomePeriodContext.Provider value={contextValue}>
      {children}
    </HomePeriodContext.Provider>
  );
};


export const useHomePeriod = (): HomePeriodContextValue | null => {
  return use(HomePeriodContext);
};


export function useFilteredByPeriod<
  T extends {
    entryTime?: string | Date | null;
    exitTime?: string | Date | null;
    entries?: Array<{ time?: Date | string | null }>;
    exits?: Array<{ time?: Date | string | null }>;
    tradeStatus?: string;
    pnl?: number | null;
    useDirectPnLInput?: boolean;
    _originalPnlWasNull?: boolean;
  },
>(items: T[] | undefined): T[] {
  const plugin = usePlugin();
  const periodContext = useHomePeriod();

  
  const period = periodContext?.period;
  const isDateInPeriod = periodContext?.isDateInPeriod;
  const analyticsDateBasis =
    plugin?.settings?.trade?.analyticsDateBasis ?? 'entry';

  return useMemo(() => {
    if (!items || items.length === 0) {
      return [];
    }

    
    if (!isDateInPeriod || period === 'lifetime') {
      return items;
    }

    return items.filter((item) => {
      const analyticsDate = getTradeAnalyticsTradingDay(
        item,
        analyticsDateBasis,
        plugin
      );
      if (!analyticsDate) {
        return false;
      }

      return isDateInPeriod(analyticsDate);
    });
  }, [analyticsDateBasis, items, period, isDateInPeriod, plugin]);
}
