

import React, {
  createContext,
  use,
  useMemo,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import { HomePeriod } from '../../../settings/types';
import { createDateWithoutTime, getQuarter } from '../../../utils/dateUtils';
import { getTradingDay } from '../../../utils/tradingDayUtils';
import { usePlugin } from '../../../hooks/usePlugin';
import { getTradeAnalyticsTradingDay } from '../../../utils/tradeAnalyticsDate';

interface HomePeriodContextValue {
  
  period: HomePeriod;
  
  dateRange: [Date | null, Date | null];
  
  isDateInPeriod: (date: Date) => boolean;
}

const HomePeriodContext = createContext<HomePeriodContextValue | null>(null);


function getDateRangeForPeriod(
  period: HomePeriod,
  currentTradingDay: Date
): [Date | null, Date | null] {
  const today = currentTradingDay;

  switch (period) {
    case 'month': {
      
      const firstDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );
      const startDate = createDateWithoutTime(firstDayOfMonth, true);
      const endDate = createDateWithoutTime(today, false);
      return [startDate, endDate];
    }

    case 'quarter': {
      
      const currentQuarter = getQuarter(today);
      const quarterStartMonth = (currentQuarter - 1) * 3;
      const firstDayOfQuarter = new Date(
        today.getFullYear(),
        quarterStartMonth,
        1
      );
      const startDate = createDateWithoutTime(firstDayOfQuarter, true);
      const endDate = createDateWithoutTime(today, false);
      return [startDate, endDate];
    }

    case 'year': {
      
      const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
      const startDate = createDateWithoutTime(firstDayOfYear, true);
      const endDate = createDateWithoutTime(today, false);
      return [startDate, endDate];
    }

    case 'lifetime':
    default:
      
      return [null, null];
  }
}

interface HomePeriodProviderProps {
  period: HomePeriod;
  children: ReactNode;
}

export const HomePeriodProvider: React.FC<HomePeriodProviderProps> = ({
  period,
  children,
}) => {
  const plugin = usePlugin();
  const tradingDayCutoffTime = plugin?.settings?.trade?.tradingDayCutoffTime;
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(Date.now());
    }, 60_000);

    return () => window.clearInterval(interval);
  }, []);

  
  const dateRange = useMemo(() => {
    const currentTradingDay = getTradingDay(
      new Date(now),
      plugin ?? {
        settings: {
          trade: {
            tradingDayCutoffTime,
          },
        },
      }
    );
    return getDateRangeForPeriod(period, currentTradingDay);
  }, [now, period, plugin, tradingDayCutoffTime]);

  
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

  const contextValue = useMemo<HomePeriodContextValue>(
    () => ({
      period,
      dateRange,
      isDateInPeriod,
    }),
    [period, dateRange, isDateInPeriod]
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
