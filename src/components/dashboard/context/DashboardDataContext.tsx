

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
import { areFilterExclusionsEqual } from '../../shared/filters/filterExclusions';
import { areFilterMatchModesEqual } from '../../shared/filters/filterMatchModes';
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
  
  dataFilters: FilterState | null;
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

  const prevAccountPhases = prevFilters.accountPhases || [];
  const currentAccountPhases = currentFilters.accountPhases || [];
  const accountPhasesChanged =
    prevAccountPhases.length !== currentAccountPhases.length ||
    prevAccountPhases.some(
      (scope, idx) =>
        scope.account !== currentAccountPhases[idx].account ||
        scope.phaseId !== currentAccountPhases[idx].phaseId
    );

  const tickersChanged =
    prevFilters.tickers.length !== currentFilters.tickers.length ||
    prevFilters.tickers.some(
      (ticker, idx) => ticker !== currentFilters.tickers[idx]
    );

  const setupsSet = new Set(currentFilters.setups);
  const setupsChanged =
    prevFilters.setups.length !== currentFilters.setups.length ||
    !prevFilters.setups.every((s) => setupsSet.has(s));

  const tradeTypesSet = new Set(currentFilters.tradeTypes);
  const tradeTypesChanged =
    prevFilters.tradeTypes.length !== currentFilters.tradeTypes.length ||
    !prevFilters.tradeTypes.every((t) => tradeTypesSet.has(t));

  const statusesSet = new Set(currentFilters.statuses);
  const statusesChanged =
    prevFilters.statuses.length !== currentFilters.statuses.length ||
    !prevFilters.statuses.every((s) => statusesSet.has(s));

  const directionsSet = new Set(currentFilters.directions);
  const directionsChanged =
    prevFilters.directions.length !== currentFilters.directions.length ||
    !prevFilters.directions.every((direction) => directionsSet.has(direction));

  const mistakesSet = new Set(currentFilters.mistakes || []);
  const mistakesChanged =
    (prevFilters.mistakes?.length || 0) !==
      (currentFilters.mistakes?.length || 0) ||
    !(prevFilters.mistakes || []).every((mistake) => mistakesSet.has(mistake));

  const tagsSet = new Set(currentFilters.tags || []);
  const tagsChanged =
    (prevFilters.tags?.length || 0) !== (currentFilters.tags?.length || 0) ||
    !(prevFilters.tags || []).every((t) => tagsSet.has(t));

  const customFieldFiltersChanged =
    JSON.stringify(prevFilters.customFieldFilters || {}) !==
    JSON.stringify(currentFilters.customFieldFilters || {});

  const exclusionsChanged = !areFilterExclusionsEqual(
    prevFilters.exclusions,
    currentFilters.exclusions
  );
  const matchModesChanged = !areFilterMatchModesEqual(
    prevFilters.matchModes,
    currentFilters.matchModes
  );

  return (
    exclusionsChanged ||
    matchModesChanged ||
    dateRangeChanged ||
    accountsChanged ||
    accountPhasesChanged ||
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
    case 'sharpe-ratio':
    case 'sharpeRatio':
      return dashboardData.metrics.sharpeRatio === undefined
        ? []
        : [
            {
              label: t('dashboard.metrics.sharpeRatio'),
              value: dashboardData.metrics.sharpeRatio,
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
        dataFilters: FilterState | null;
        isLoading: boolean;
        isStale: boolean;
        error: Error | null;
        lastFetchTime: number;
      },
      update: Partial<{
        dashboardData: DashboardData | null;
        dataFilters: FilterState | null;
        isLoading: boolean;
        isStale: boolean;
        error: Error | null;
        lastFetchTime: number;
      }>
    ) => ({ ...current, ...update }),
    {
      dashboardData: null,
      dataFilters: null,
      isLoading: false,
      isStale: false,
      error: null,
      lastFetchTime: 0,
    }
  );
  const {
    dashboardData,
    dataFilters,
    isLoading,
    isStale,
    error,
    lastFetchTime,
  } = state;

  
  const fetchingRef = useRef(false);
  const pendingForceRefreshRef = useRef(false);
  const activeRefreshPromiseRef = useRef<Promise<void> | null>(null);
  const dataReadyRef = useRef(false);
  const filtersRef = useRef(filters);
  const previousFiltersRef = useRef(filters);
  const wasActiveRef = useRef(isActive);
  const isActiveRef = useRef(isActive);
  const pendingInvalidationRef = useRef(false);
  const completedFetchRef = useRef({ hasData: false, timestamp: 0 });

  React.useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  
  React.useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  
  const isCacheValid = useCallback(
    (maxAge: number = DEFAULT_CACHE_DURATION) => {
      return Date.now() - completedFetchRef.current.timestamp < maxAge;
    },
    []
  );

  
  const refreshData = useCallback(
    async (forceRefresh: boolean = false) => {
      
      
      if (fetchingRef.current) {
        pendingForceRefreshRef.current ||=
          forceRefresh ||
          haveDashboardFiltersChanged(
            previousFiltersRef.current,
            filtersRef.current
          );
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
            completedFetchRef.current.hasData &&
            isCacheValid()
          ) {
            return;
          }

          
          previousFiltersRef.current = filtersRef.current;

          fetchingRef.current = true;
          dispatchState({ isLoading: true, error: null });

          const fetchFilters = filtersRef.current;
          try {
            const data = await fetchDashboardData(
              app,
              tradeService,
              fetchFilters,
              defaultRiskAmount,
              plugin,
              {
                freshTradeQuery: dataReadyRef.current,
              }
            );
            const timestamp = Date.now();
            completedFetchRef.current = { hasData: true, timestamp };
            dispatchState({
              dashboardData: data,
              dataFilters: fetchFilters,
              lastFetchTime: timestamp,
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
    [app, tradeService, isCacheValid, defaultRiskAmount, plugin]
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

    if (filtersChanged && completedFetchRef.current.hasData) {
      
      dispatchState({ isStale: true });
    }

    
    
    
    if (!isActive) return;

    
    const timeoutId = window.setTimeout(() => {
      void refreshDataRef.current();
    }, 100);

    return () => window.clearTimeout(timeoutId);
  }, [filters, isActive]);

  
  
  
  const handleDataInvalidation = useCallback(() => {
    if (isActiveRef.current) {
      void refreshData(true);
    } else {
      pendingInvalidationRef.current = true;
    }
  }, [refreshData]);

  
  useEventBus('trade:changed', handleDataInvalidation);
  useEventBus('backtest-trade:changed', handleDataInvalidation);
  useEventBus('account:changed', handleDataInvalidation);

  
  useEventBus('folder-path:changed', handleDataInvalidation);

  useEventBus('settings:changed', (payload) => {
    if (
      payload?.section === 'trade' ||
      payload?.section === 'general' ||
      payload?.section === 'copyTradeAdjustments'
    ) {
      handleDataInvalidation();
    }
  });

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
    if (isActive && !wasActiveRef.current && pendingInvalidationRef.current) {
      pendingInvalidationRef.current = false;
      void refreshData(true);
    }
    wasActiveRef.current = isActive;
  }, [isActive, refreshData]);

  
  const contextValue = useMemo<DashboardDataContextValue>(
    () => ({
      dashboardData,
      dataFilters,
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
      dataFilters,
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
