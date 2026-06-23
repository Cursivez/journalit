

import React, {
  createContext,
  use,
  useCallback,
  useReducer,
  useRef,
  useMemo,
  ReactNode,
} from 'react';
import { App } from 'obsidian';
import { TradeService } from '../../../services/trade/TradeService';
import { DashboardData, fetchDashboardData } from '../utils/dataUtils';
import type { FilterState } from '../DashboardView';
import { useEventBus } from '../../../hooks/useEventBus';
import { t } from '../../../lang/helpers';
import type JournalitPlugin from '../../../main';


interface MetricValue {
  label: string;
  value: number;
  type: 'pnl' | 'percentage' | 'ratio' | 'number';
}

interface DashboardDataContextValue {
  
  dashboardData: DashboardData | null;
  isLoading: boolean;
  isStale: boolean;
  error: Error | null;

  
  filters: FilterState;

  
  refreshData: () => Promise<void>;
  forceRefreshData: () => Promise<void>;
  getMetricData: (metricId: string) => MetricValue[];

  getWidgetData: (widgetId: string) => unknown;

  
  lastFetchTime: number;
  isCacheValid: (maxAge?: number) => boolean;
}

const DashboardDataContext = createContext<DashboardDataContextValue | null>(
  null
);

interface DashboardDataProviderProps {
  app: App;
  tradeService: TradeService;
  filters: FilterState;
  children: ReactNode;
  defaultRiskAmount?: number; 
  plugin?: JournalitPlugin; 
  isActive?: boolean;
}


const DEFAULT_CACHE_DURATION = 5000;

const haveDashboardFiltersChanged = (
  prevFilters: FilterState,
  currentFilters: FilterState
): boolean => {
  const dateRangeChanged =
    prevFilters.dateRange[0]?.getTime() !==
      currentFilters.dateRange[0]?.getTime() ||
    prevFilters.dateRange[1]?.getTime() !==
      currentFilters.dateRange[1]?.getTime();

  const accountsChanged =
    prevFilters.accounts.length !== currentFilters.accounts.length ||
    prevFilters.accounts.some(
      (acc, idx) => acc !== currentFilters.accounts[idx]
    );

  const tickersChanged =
    prevFilters.tickers.length !== currentFilters.tickers.length ||
    prevFilters.tickers.some(
      (ticker, idx) => ticker !== currentFilters.tickers[idx]
    );

  const setupsChanged =
    prevFilters.setups.length !== currentFilters.setups.length ||
    !prevFilters.setups.every((s) => currentFilters.setups.includes(s));

  const tradeTypesChanged =
    prevFilters.tradeTypes.length !== currentFilters.tradeTypes.length ||
    !prevFilters.tradeTypes.every((t) => currentFilters.tradeTypes.includes(t));

  const statusesChanged =
    prevFilters.statuses.length !== currentFilters.statuses.length ||
    !prevFilters.statuses.every((s) => currentFilters.statuses.includes(s));

  const directionsChanged =
    prevFilters.directions.length !== currentFilters.directions.length ||
    !prevFilters.directions.every((direction) =>
      currentFilters.directions.includes(direction)
    );

  const mistakesChanged =
    (prevFilters.mistakes?.length || 0) !==
      (currentFilters.mistakes?.length || 0) ||
    !(prevFilters.mistakes || []).every((mistake) =>
      (currentFilters.mistakes || []).includes(mistake)
    );

  const tagsChanged =
    (prevFilters.tags?.length || 0) !== (currentFilters.tags?.length || 0) ||
    !(prevFilters.tags || []).every((t) =>
      (currentFilters.tags || []).includes(t)
    );

  const customFieldFiltersChanged =
    JSON.stringify(prevFilters.customFieldFilters || {}) !==
    JSON.stringify(currentFilters.customFieldFilters || {});

  return (
    dateRangeChanged ||
    accountsChanged ||
    tickersChanged ||
    setupsChanged ||
    tradeTypesChanged ||
    statusesChanged ||
    directionsChanged ||
    mistakesChanged ||
    tagsChanged ||
    customFieldFiltersChanged
  );
};

const getDashboardMetricData = (
  dashboardData: DashboardData | null,
  metricId: string
): MetricValue[] => {
  if (!dashboardData) return [];

  switch (metricId) {
    case 'total-pnl':
      return [
        {
          label: t('dashboard.metrics.netPnL'),
          value: dashboardData.metrics.netPnL,
          type: 'pnl',
        },
      ];
    case 'win-rate':
      return [
        {
          label: t('dashboard.metrics.winRate'),
          value: dashboardData.metrics.winRate,
          type: 'percentage',
        },
      ];
    case 'avg-win-loss':
      return [
        {
          label: t('dashboard.metrics.avgWin'),
          value: dashboardData.metrics.avgWin,
          type: 'pnl',
        },
        {
          label: t('dashboard.metrics.avgLoss'),
          value: dashboardData.metrics.avgLoss,
          type: 'pnl',
        },
      ];
    case 'profit-factor':
      return [
        {
          label: t('dashboard.metrics.profitFactor'),
          value: dashboardData.metrics.profitFactor,
          type: 'ratio',
        },
      ];
    case 'total-trades':
      return [
        {
          label: t('dashboard.metrics.numTrades'),
          value: dashboardData.metrics.numTrades,
          type: 'number',
        },
      ];
    case 'avg-rr':
    case 'avgRR':
      return [
        {
          label: t('dashboard.metrics.avgRR'),
          value: dashboardData.metrics.avgRR ?? 0,
          type: 'ratio',
        },
      ];
    case 'avg-rr-risk-based':
    case 'avgRRRiskBased':
      return [
        {
          label: t('dashboard.metrics.avgRRRiskBased'),
          value: dashboardData.metrics.avgRRRiskBased ?? 0,
          type: 'ratio',
        },
      ];
    default:
      return [];
  }
};

const getDashboardWidgetData = (
  dashboardData: DashboardData | null,
  widgetId: string
): unknown => {
  if (!dashboardData) return null;

  switch (widgetId) {
    case 'pnl-chart':
    case 'performance-calendar':
    case 'setup-performance':
    case 'daily-pnl':
    case 'trade-distribution':
      return dashboardData.trades || [];
    default:
      return null;
  }
};

export const DashboardDataProvider: React.FC<DashboardDataProviderProps> = ({
  app,
  tradeService,
  filters,
  children,
  defaultRiskAmount,
  plugin,
  isActive = true,
}) => {
  const [state, dispatchState] = useReducer(
    (
      current: {
        dashboardData: DashboardData | null;
        isLoading: boolean;
        isStale: boolean;
        error: Error | null;
        lastFetchTime: number;
      },
      update: Partial<{
        dashboardData: DashboardData | null;
        isLoading: boolean;
        isStale: boolean;
        error: Error | null;
        lastFetchTime: number;
      }>
    ) => ({ ...current, ...update }),
    {
      dashboardData: null,
      isLoading: false,
      isStale: false,
      error: null,
      lastFetchTime: 0,
    }
  );
  const { dashboardData, isLoading, isStale, error, lastFetchTime } = state;

  
  const fetchingRef = useRef(false);
  const pendingForceRefreshRef = useRef(false);
  const activeRefreshPromiseRef = useRef<Promise<void> | null>(null);
  const dataReadyRef = useRef(false);
  const filtersRef = useRef(filters);
  const previousFiltersRef = useRef(filters);
  const wasActiveRef = useRef(isActive);

  
  React.useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  
  const isCacheValid = useCallback(
    (maxAge: number = DEFAULT_CACHE_DURATION) => {
      return Date.now() - lastFetchTime < maxAge;
    },
    [lastFetchTime]
  );

  
  const refreshData = useCallback(
    async (forceRefresh: boolean = false) => {
      
      if (fetchingRef.current) {
        pendingForceRefreshRef.current = true;
        await activeRefreshPromiseRef.current;
        return;
      }

      const refreshPromise = (async () => {
        let shouldForceRefresh = forceRefresh;

        do {
          
          const filtersChanged = haveDashboardFiltersChanged(
            previousFiltersRef.current,
            filtersRef.current
          );

          
          if (
            !shouldForceRefresh &&
            !filtersChanged &&
            dashboardData &&
            isCacheValid()
          ) {
            return;
          }

          
          previousFiltersRef.current = filtersRef.current;

          fetchingRef.current = true;
          dispatchState({ isLoading: true, error: null });

          try {
            const data = await fetchDashboardData(
              app,
              tradeService,
              filtersRef.current,
              defaultRiskAmount,
              plugin,
              {
                freshTradeQuery: dataReadyRef.current,
              }
            );
            dispatchState({
              dashboardData: data,
              lastFetchTime: Date.now(),
              isStale: false,
            });
          } catch (err) {
            console.error('Error fetching dashboard data:', err);
            dispatchState({
              error:
                err instanceof Error
                  ? err
                  : new Error('Failed to fetch dashboard data'),
            });
          } finally {
            dispatchState({ isLoading: false, isStale: false });
            fetchingRef.current = false;
          }

          shouldForceRefresh = pendingForceRefreshRef.current;
          pendingForceRefreshRef.current = false;
        } while (shouldForceRefresh);
      })();

      activeRefreshPromiseRef.current = refreshPromise;
      try {
        await refreshPromise;
      } finally {
        if (activeRefreshPromiseRef.current === refreshPromise) {
          activeRefreshPromiseRef.current = null;
        }
      }
    },
    [app, tradeService, isCacheValid, dashboardData, defaultRiskAmount, plugin]
  );
  const refreshDataRef = useRef(refreshData);

  React.useEffect(() => {
    refreshDataRef.current = refreshData;
  }, [refreshData]);

  const getMetricData = useCallback(
    (metricId: string): MetricValue[] =>
      getDashboardMetricData(dashboardData, metricId),
    [dashboardData]
  );

  const getWidgetData = useCallback(
    (widgetId: string): unknown =>
      getDashboardWidgetData(dashboardData, widgetId),
    [dashboardData]
  );

  
  React.useEffect(() => {
    
    const filtersChanged = haveDashboardFiltersChanged(
      previousFiltersRef.current,
      filters
    );

    if (filtersChanged && dashboardData) {
      
      dispatchState({ isStale: true });
    }

    
    const timeoutId = window.setTimeout(() => {
      void refreshDataRef.current();
    }, 100);

    return () => window.clearTimeout(timeoutId);
  }, [filters, dashboardData]);

  
  useEventBus(
    'trade:changed',
    () => {
      void refreshData(true);
    },
    isActive
  );
  useEventBus(
    'backtest-trade:changed',
    () => {
      void refreshData(true);
    },
    isActive
  );
  useEventBus(
    'account:changed',
    () => {
      void refreshData(true);
    },
    isActive
  );

  
  useEventBus(
    'folder-path:changed',
    () => {
      void refreshData(true);
    },
    isActive
  );

  useEventBus(
    'settings:changed',
    (payload) => {
      if (
        payload?.section === 'trade' ||
        payload?.section === 'general' ||
        payload?.section === 'copyTradeAdjustments'
      ) {
        void refreshData(true);
      }
    },
    isActive
  );

  React.useEffect(() => {
    if (!isActive || dataReadyRef.current) return;

    let cancelled = false;
    void tradeService.waitForTradeDataReady().then(() => {
      if (cancelled) return;
      dataReadyRef.current = true;
      void refreshData(true);
    });

    return () => {
      cancelled = true;
    };
  }, [isActive, refreshData, tradeService]);

  React.useEffect(() => {
    if (isActive && !wasActiveRef.current) {
      void refreshData(true);
    }
    wasActiveRef.current = isActive;
  }, [isActive, refreshData]);

  
  const contextValue = useMemo<DashboardDataContextValue>(
    () => ({
      dashboardData,
      isLoading,
      isStale,
      error,
      filters,
      refreshData: () => refreshData(false),
      forceRefreshData: () => refreshData(true),
      getMetricData,
      getWidgetData,
      lastFetchTime,
      isCacheValid,
    }),
    [
      dashboardData,
      isLoading,
      isStale,
      error,
      filters,
      refreshData,
      getMetricData,
      getWidgetData,
      lastFetchTime,
      isCacheValid,
    ]
  );

  return (
    <DashboardDataContext.Provider value={contextValue}>
      {children}
    </DashboardDataContext.Provider>
  );
};


export const useDashboardData = () => {
  const context = use(DashboardDataContext);
  if (!context) {
    throw new Error(
      'useDashboardData must be used within a DashboardDataProvider'
    );
  }
  return context;
};
