

import React, {
  createContext,
  use,
  useCallback,
  useRef,
  useState,
  useMemo,
  ReactNode,
} from 'react';
import type JournalitPlugin from '../../../main';
import { App } from 'obsidian';
import { AccountPageService } from '../../../services/accountPage/AccountPageService';
import {
  AccountPageData,
  AccountTradeData,
  AccountMetrics,
  AccountTradeFilter,
} from '../../../services/accountPage/types';
import { calculateEffectiveRMultiple } from '../../../utils/formatting';
import {
  getEffectivePnL,
  isPnlContributingTrade,
} from '../../../utils/tradeStatusUtils';
import {
  calculateWinRateExcludingBreakeven,
  classifyPnLWithBreakEvenSettings,
  type BreakEvenRangeSettings,
} from '../../../utils/breakEvenRange';
import {
  useEventBus,
  AccountChangedPayload,
  TradeChangedPayload,
} from '../../../services/events';
import type { TradeCommittedPayload } from '../../../services/trade/core/tradeCoreTypes';
import { normalizeAccountLookupKey } from '../../../services/trade/core/TradeAccountIdentity';

interface AccountPageDataContextValue {
  
  accountPageData: AccountPageData | null;
  isLoading: boolean;
  isStale: boolean;
  error: Error | null;

  
  accountName: string;

  
  filters: AccountTradeFilter;

  
  refreshData: () => Promise<void>;
  setFilters: (filters: AccountTradeFilter) => void;

  
  lastFetchTime: number;
  isCacheValid: (maxAge?: number) => boolean;

  
  getFilteredTrades: () => AccountTradeData[];
  getMetrics: () => AccountMetrics | null;
}

const AccountPageDataContext =
  createContext<AccountPageDataContextValue | null>(null);

interface AccountPageDataProviderProps {
  app: App;
  accountPageService: AccountPageService;
  accountName: string;
  plugin?: JournalitPlugin | null;
  children: ReactNode;
}

const filterAccountTrades = (
  trades: AccountTradeData[] | undefined,
  filters: AccountTradeFilter
): AccountTradeData[] => {
  if (!trades) return [];

  let filtered = [...trades];

  if (filters.dateRange && (filters.dateRange[0] || filters.dateRange[1])) {
    filtered = filtered.filter((trade) => {
      let tradeDate: Date;
      try {
        if (trade.entryTime instanceof Date) {
          tradeDate = trade.entryTime;
        } else {
          tradeDate = new Date(trade.entryTime);
          if (isNaN(tradeDate.getTime())) {
            return false;
          }
        }
      } catch (error) {
        console.error(
          'Error parsing trade entry time:',
          error,
          trade.entryTime
        );
        return false;
      }

      if (filters.dateRange![0] && tradeDate < filters.dateRange![0]) {
        return false;
      }
      if (filters.dateRange![1] && tradeDate > filters.dateRange![1]) {
        return false;
      }
      return true;
    });
  }

  if (filters.instruments && filters.instruments.length > 0) {
    filtered = filtered.filter((trade) =>
      filters.instruments!.includes(trade.instrument)
    );
  }

  if (filters.setups && filters.setups.length > 0) {
    filtered = filtered.filter((trade) =>
      trade.setup.some((setup) => filters.setups!.includes(setup))
    );
  }

  if (filters.directions && filters.directions.length > 0) {
    filtered = filtered.filter((trade) =>
      filters.directions!.includes(trade.direction)
    );
  }

  if (filters.reviewed !== undefined) {
    filtered = filtered.filter((trade) => trade.reviewed === filters.reviewed);
  }

  filtered.sort((a, b) => {
    const dateA =
      a.entryTime instanceof Date ? a.entryTime : new Date(a.entryTime);
    const dateB =
      b.entryTime instanceof Date ? b.entryTime : new Date(b.entryTime);
    return dateB.getTime() - dateA.getTime();
  });

  return filtered;
};

const createEmptyAccountMetrics = (): AccountMetrics => ({
  totalTrades: 0,
  winningTrades: 0,
  losingTrades: 0,
  winRate: 0,
  totalPnL: 0,
  avgWin: 0,
  avgLoss: 0,
  avgWinRMultiple: undefined,
  avgLossRMultiple: undefined,
  profitFactor: 0,
  totalCommission: 0,
  totalSwap: 0,
  totalFees: 0,
});

interface FilteredMetricsOptions extends BreakEvenRangeSettings {
  defaultRiskAmount?: number;
}

const calculateFilteredAccountMetrics = (
  accountPageData: AccountPageData | null,
  filteredTrades: AccountTradeData[],
  options: FilteredMetricsOptions
): AccountMetrics | null => {
  if (!accountPageData) return null;

  if (filteredTrades.length === accountPageData.trades.length) {
    return accountPageData.metrics;
  }

  if (filteredTrades.length === 0) {
    return createEmptyAccountMetrics();
  }

  const pnlContributingTrades = filteredTrades.filter((trade) =>
    isPnlContributingTrade(trade)
  );
  const totalTrades = pnlContributingTrades.length;
  const totalCommission = pnlContributingTrades.reduce(
    (sum, trade) => sum + trade.commission,
    0
  );
  const totalSwap = pnlContributingTrades.reduce(
    (sum, trade) => sum + trade.swap,
    0
  );
  const totalFees = pnlContributingTrades.reduce(
    (sum, trade) => sum + trade.fees,
    0
  );
  const totalPnL = pnlContributingTrades.reduce(
    (sum, trade) => sum + getEffectivePnL(trade),
    0
  );

  const breakEvenSettings = {
    breakEvenThresholdMode: options.breakEvenThresholdMode,
    breakEvenThresholdPercent: options.breakEvenThresholdPercent,
    breakEvenRangeMin: options.breakEvenRangeMin,
    breakEvenRangeMax: options.breakEvenRangeMax,
  };
  const accountCurrentBalance = accountPageData.account.currentBalance;

  const winningTrades = pnlContributingTrades.filter(
    (trade) =>
      classifyPnLWithBreakEvenSettings(
        getEffectivePnL(trade),
        breakEvenSettings,
        accountCurrentBalance
      ) === 'win'
  );
  const losingTrades = pnlContributingTrades.filter(
    (trade) =>
      classifyPnLWithBreakEvenSettings(
        getEffectivePnL(trade),
        breakEvenSettings,
        accountCurrentBalance
      ) === 'loss'
  );

  const winRate =
    calculateWinRateExcludingBreakeven(
      winningTrades.length,
      losingTrades.length
    ) * 100;
  const totalWinAmount = winningTrades.reduce(
    (sum, trade) => sum + getEffectivePnL(trade),
    0
  );
  const totalLossAmount = Math.abs(
    losingTrades.reduce((sum, trade) => sum + getEffectivePnL(trade), 0)
  );
  const avgWin =
    winningTrades.length > 0 ? totalWinAmount / winningTrades.length : 0;
  const avgLoss =
    losingTrades.length > 0 ? totalLossAmount / losingTrades.length : 0;

  const winningTradesR = winningTrades
    .map((trade) =>
      calculateEffectiveRMultiple(
        getEffectivePnL(trade),
        trade.rMultiple,
        trade.riskAmount,
        options.defaultRiskAmount
      )
    )
    .filter((r) => r !== undefined) as number[];
  const avgWinRMultiple =
    winningTradesR.length > 0
      ? winningTradesR.reduce((sum, r) => sum + r, 0) / winningTradesR.length
      : undefined;

  const losingTradesR = losingTrades
    .map((trade) =>
      calculateEffectiveRMultiple(
        getEffectivePnL(trade),
        trade.rMultiple,
        trade.riskAmount,
        options.defaultRiskAmount
      )
    )
    .filter((r) => r !== undefined) as number[];
  const avgLossRMultiple =
    losingTradesR.length > 0
      ? losingTradesR.reduce((sum, r) => sum + Math.abs(r), 0) /
        losingTradesR.length
      : undefined;

  let profitFactor = 0;
  if (totalLossAmount > 0) {
    profitFactor = totalWinAmount / totalLossAmount;
  } else if (totalWinAmount > 0) {
    profitFactor = 999;
  }

  return {
    totalTrades,
    winningTrades: winningTrades.length,
    losingTrades: losingTrades.length,
    winRate,
    totalPnL,
    avgWin,
    avgLoss,
    avgWinRMultiple,
    avgLossRMultiple,
    profitFactor,
    totalCommission,
    totalSwap,
    totalFees,
  };
};

export const AccountPageDataProvider: React.FC<
  AccountPageDataProviderProps
> = ({ app: _app, accountPageService, accountName, plugin, children }) => {
  const [accountPageData, setAccountPageData] =
    useState<AccountPageData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isStale, setIsStale] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState(0);
  const [filters, setFiltersState] = useState<AccountTradeFilter>({});

  
  const fetchingRef = useRef(false);
  const refreshQueuedRef = useRef(false);
  const activeRefreshPromiseRef = useRef<Promise<void> | null>(null);
  const accountNameRef = useRef(accountName);
  const recentCommittedTradeChangesRef = useRef<Map<string, number>>(new Map());

  React.useEffect(() => {
    accountNameRef.current = accountName;
  }, [accountName]);

  
  const isCacheValid = useCallback(
    (maxAge: number = 5000) => {
      return Date.now() - lastFetchTime < maxAge;
    },
    [lastFetchTime]
  );

  
  const refreshData = useCallback(async () => {
    
    if (fetchingRef.current) {
      refreshQueuedRef.current = true;
      await activeRefreshPromiseRef.current;
      return;
    }

    const refreshPromise = (async () => {
      do {
        refreshQueuedRef.current = false;
        fetchingRef.current = true;
        setIsLoading(true);
        setError(null);

        try {
          const data = await accountPageService.getAccountPageData(
            accountNameRef.current
          );
          setAccountPageData(data);
          setLastFetchTime(Date.now());
          setIsStale(false); 
        } catch (err) {
          console.error('Error fetching account page data:', err);
          setError(
            err instanceof Error
              ? err
              : new Error('Failed to fetch account page data')
          );
        } finally {
          setIsLoading(false);
          setIsStale(false); 
          fetchingRef.current = false;
        }
      } while (refreshQueuedRef.current);
    })();

    activeRefreshPromiseRef.current = refreshPromise;
    try {
      await refreshPromise;
    } finally {
      if (activeRefreshPromiseRef.current === refreshPromise) {
        activeRefreshPromiseRef.current = null;
      }
    }
  }, [accountPageService]);

  const setFilters = useCallback((newFilters: AccountTradeFilter) => {
    setFiltersState(newFilters);
  }, []);

  const filteredTrades = useMemo<AccountTradeData[]>(
    () => filterAccountTrades(accountPageData?.trades, filters),
    [accountPageData?.trades, filters]
  );

  const breakEvenThresholdMode =
    plugin?.settings?.trade?.breakEvenThresholdMode;
  const breakEvenThresholdPercent =
    plugin?.settings?.trade?.breakEvenThresholdPercent;
  const breakEvenRangeMin = plugin?.settings?.trade?.breakEvenRangeMin;
  const breakEvenRangeMax = plugin?.settings?.trade?.breakEvenRangeMax;
  const defaultRiskAmount = plugin?.settings?.trade?.defaultRiskAmount;

  const filteredMetrics = useMemo<AccountMetrics | null>(
    () =>
      calculateFilteredAccountMetrics(accountPageData, filteredTrades, {
        breakEvenThresholdMode,
        breakEvenThresholdPercent,
        breakEvenRangeMin,
        breakEvenRangeMax,
        defaultRiskAmount,
      }),
    [
      accountPageData,
      filteredTrades,
      breakEvenThresholdMode,
      breakEvenThresholdPercent,
      breakEvenRangeMin,
      breakEvenRangeMax,
      defaultRiskAmount,
    ]
  );

  const getFilteredTrades = useCallback(
    (): AccountTradeData[] => filteredTrades,
    [filteredTrades]
  );

  const getMetrics = useCallback(
    (): AccountMetrics | null => filteredMetrics,
    [filteredMetrics]
  );

  const rememberCommittedTradeChange = useCallback((filePaths: string[]) => {
    const expiresAt = Date.now() + 2000;
    const recentChanges = recentCommittedTradeChangesRef.current;

    for (const [filePath, expiry] of recentChanges.entries()) {
      if (expiry <= Date.now()) {
        recentChanges.delete(filePath);
      }
    }

    for (const filePath of filePaths) {
      recentChanges.set(filePath, expiresAt);
    }
  }, []);

  const wasExpectedLegacyMirror = useCallback(
    (payload: TradeChangedPayload) => {
      const filePaths =
        payload.filePaths ?? (payload.filePath ? [payload.filePath] : []);
      if (filePaths.length === 0) {
        return false;
      }

      const recentChanges = recentCommittedTradeChangesRef.current;
      let hasTrackedPath = false;
      const now = Date.now();

      for (const filePath of filePaths) {
        const expiry = recentChanges.get(filePath);
        if (!expiry) {
          return false;
        }

        if (expiry <= now) {
          recentChanges.delete(filePath);
          return false;
        }

        hasTrackedPath = true;
      }

      if (hasTrackedPath) {
        for (const filePath of filePaths) {
          recentChanges.delete(filePath);
        }
      }

      return hasTrackedPath;
    },
    []
  );

  
  const handleTradeDataChanged = useCallback(async () => {
    await refreshData();
  }, [refreshData]);

  const handleTradeCommitted = useCallback(
    async (payload: TradeCommittedPayload) => {
      const changedPaths = [
        payload.change.path,
        payload.change.previousPath,
      ].filter((path): path is string => Boolean(path));

      if (payload.legacyTradeChangedExpected) {
        rememberCommittedTradeChange(changedPaths);
      }

      await refreshData();
    },
    [refreshData, rememberCommittedTradeChange]
  );

  const handleLegacyTradeChanged = useCallback(
    async (payload: TradeChangedPayload) => {
      if (wasExpectedLegacyMirror(payload)) {
        return;
      }

      await handleTradeDataChanged();
    },
    [handleTradeDataChanged, wasExpectedLegacyMirror]
  );

  
  const handleAccountChanged = useCallback(
    async (payload: AccountChangedPayload) => {
      
      const currentAccountLookupKey = normalizeAccountLookupKey(accountName);
      if (payload.accountNames && payload.accountNames.length > 0) {
        const payloadLookupKeys = new Set(
          payload.accountNames.map((name) => normalizeAccountLookupKey(name))
        );
        if (!payloadLookupKeys.has(currentAccountLookupKey)) {
          return; 
        }
      } else if (payload.accountName) {
        if (
          normalizeAccountLookupKey(payload.accountName) !==
          currentAccountLookupKey
        ) {
          return; 
        }
      }
      
      await refreshData();
    },
    [refreshData, accountName]
  );

  
  useEventBus('trade:changed', handleLegacyTradeChanged);
  useEventBus('trade:committed', handleTradeCommitted);
  useEventBus('missed-trade:changed', handleTradeDataChanged);
  useEventBus('account:changed', handleAccountChanged);
  useEventBus('settings:changed', (payload) => {
    if (payload?.section === 'copyTradeAdjustments') {
      void refreshData();
    }
  });

  
  React.useEffect(() => {
    if (accountName && accountPageService) {
      refreshData();
    }
  }, [accountName, accountPageService, refreshData]);

  
  const contextValue = useMemo<AccountPageDataContextValue>(
    () => ({
      accountPageData,
      isLoading,
      isStale,
      error,
      accountName,
      filters,
      refreshData,
      setFilters,
      lastFetchTime,
      isCacheValid,
      getFilteredTrades,
      getMetrics,
    }),
    [
      accountPageData,
      isLoading,
      isStale,
      error,
      accountName,
      filters,
      refreshData,
      setFilters,
      lastFetchTime,
      isCacheValid,
      getFilteredTrades,
      getMetrics,
    ]
  );

  return (
    <AccountPageDataContext.Provider value={contextValue}>
      {children}
    </AccountPageDataContext.Provider>
  );
};


export const useAccountPageData = () => {
  const context = use(AccountPageDataContext);
  if (!context) {
    throw new Error(
      'useAccountPageData must be used within an AccountPageDataProvider'
    );
  }
  return context;
};

export {};
