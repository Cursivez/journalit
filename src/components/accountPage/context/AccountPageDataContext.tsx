

import React, {
  createContext,
  use,
  useCallback,
  useReducer,
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
import { calculateProfitFactor } from '../../../utils/profitFactor';
import {
  getEffectivePnL,
  isPnlContributingTrade,
} from '../../../utils/tradeStatusUtils';
import {
  calculateWinRateExcludingBreakeven,
  classifyPnLWithBreakEvenSettings,
  type BreakEvenRangeSettings,
} from '../../../utils/breakEvenRange';
import { TradeChangedPayload } from '../../../services/events/types';
import { usePhaseScopedTrades } from './usePhaseScopedTrades';
import { useAccountPageDataEvents } from './useAccountPageDataEvents';
import { calculateCommissionCost } from '../../../utils/pnlUtils';

interface AccountPageDataContextValue {
  
  accountPageData: AccountPageData | null;
  isLoading: boolean;
  isStale: boolean;
  error: Error | null;

  
  accountName: string;

  
  filters: AccountTradeFilter;

  
  selectedPhaseId: string | null;

  
  refreshData: () => Promise<void>;
  setFilters: (filters: AccountTradeFilter) => void;
  
  setSelectedPhaseId: (phaseId: string | undefined) => void;

  
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

type AccountPageProviderState = {
  accountPageData: AccountPageData | null;
  isLoading: boolean;
  isStale: boolean;
  error: Error | null;
  lastFetchTime: number;
};

const initialAccountPageProviderState: AccountPageProviderState = {
  accountPageData: null,
  isLoading: false,
  isStale: false,
  error: null,
  lastFetchTime: 0,
};

const accountPageProviderReducer = (
  current: AccountPageProviderState,
  update: Partial<AccountPageProviderState>
): AccountPageProviderState => ({ ...current, ...update });

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
    const instrumentsSet = new Set(filters.instruments);
    filtered = filtered.filter((trade) => instrumentsSet.has(trade.instrument));
  }

  if (filters.setups && filters.setups.length > 0) {
    const setupsSet = new Set(filters.setups);
    filtered = filtered.filter((trade) =>
      trade.setup.some((setup) => setupsSet.has(setup))
    );
  }

  if (filters.directions && filters.directions.length > 0) {
    const directionsSet = new Set(filters.directions);
    filtered = filtered.filter((trade) => directionsSet.has(trade.direction));
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
  totalPnLRMultiple: undefined,
  rMultipleTradeCount: 0,
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
  
  filteredExcludedTrades: AccountTradeData[];
}





export const applyScopedConversionMetadata = (
  filteredMetrics: AccountMetrics,
  parentMetrics: AccountMetrics,
  filteredTrades: AccountTradeData[],
  pnlContributingTrades: AccountTradeData[],
  filteredExcludedTrades: AccountTradeData[]
): void => {
  if (!parentMetrics.isMultiCurrency) return;

  
  
  
  const brokerBaseCurrencyTradeCount = filteredTrades.filter(
    (trade) =>
      typeof trade.brokerBaseCurrencyPnl === 'number' &&
      Number.isFinite(trade.brokerBaseCurrencyPnl) &&
      trade.brokerBaseCurrency === parentMetrics.conversionBaseCurrency &&
      typeof trade.originalCurrency === 'string' &&
      trade.originalCurrency !== parentMetrics.conversionBaseCurrency
  ).length;
  const manualFxRateTradeCount = filteredTrades.filter(
    (trade) => trade.conversionUsedManualRate === true
  ).length;
  const usedFetchedRates = filteredTrades.some(
    (trade) => trade.conversionUsedFetchedRates === true
  );
  const partiallyConverted = Array.from(
    new Set(
      filteredTrades.flatMap((trade) => trade.conversionPartialCurrencies ?? [])
    )
  );

  if (parentMetrics.conversionBaseCurrency !== undefined) {
    
    
    
    const scopeNeedsConversionIndicator =
      usedFetchedRates ||
      manualFxRateTradeCount > 0 ||
      brokerBaseCurrencyTradeCount > 0 ||
      partiallyConverted.length > 0 ||
      filteredExcludedTrades.length > 0;
    if (!scopeNeedsConversionIndicator) return;

    filteredMetrics.conversionBaseCurrency =
      parentMetrics.conversionBaseCurrency;
    
    filteredMetrics.conversionRateDate = usedFetchedRates
      ? parentMetrics.conversionRateDate
      : manualFxRateTradeCount > 0
        ? 'manual'
        : 'broker';
    filteredMetrics.brokerBaseCurrencyTradeCount = brokerBaseCurrencyTradeCount;
    filteredMetrics.manualFxRateTradeCount = manualFxRateTradeCount;
  } else {
    
    
    filteredMetrics.conversionRateDate = parentMetrics.conversionRateDate;
  }

  filteredMetrics.isMultiCurrency = true;
  if (parentMetrics.convertedTotalPnL !== undefined) {
    filteredMetrics.convertedTotalPnL = filteredMetrics.totalPnL;
  }
  
  const pnlByCurrency: Record<string, number> = {};
  for (const trade of pnlContributingTrades) {
    const currency =
      trade.currency ||
      parentMetrics.conversionBaseCurrency ||
      parentMetrics.primaryCurrency ||
      'USD';
    pnlByCurrency[currency] =
      (pnlByCurrency[currency] || 0) + getEffectivePnL(trade);
  }
  filteredMetrics.pnlByCurrency = pnlByCurrency;
  if (filteredExcludedTrades.length > 0) {
    filteredMetrics.unconvertedCurrencies = Array.from(
      new Set(
        filteredExcludedTrades.flatMap((trade) =>
          typeof trade.currency === 'string' ? [trade.currency] : []
        )
      )
    );
    filteredMetrics.originalTradeCount =
      filteredTrades.length + filteredExcludedTrades.length;
    filteredMetrics.convertedTradeCount = filteredTrades.length;
  }
  filteredMetrics.partiallyConvertedCurrencies =
    partiallyConverted.length > 0 ? partiallyConverted : undefined;
};

const calculateFilteredAccountMetrics = (
  accountPageData: AccountPageData | null,
  filteredTrades: AccountTradeData[],
  options: FilteredMetricsOptions
): AccountMetrics | null => {
  if (!accountPageData) return null;

  
  
  
  const excludedTrades = accountPageData.excludedTrades ?? [];
  const { filteredExcludedTrades } = options;

  if (
    filteredTrades.length === accountPageData.trades.length &&
    filteredExcludedTrades.length === excludedTrades.length
  ) {
    return accountPageData.metrics;
  }

  if (filteredTrades.length === 0) {
    const emptyMetrics = createEmptyAccountMetrics();
    applyScopedConversionMetadata(
      emptyMetrics,
      accountPageData.metrics,
      filteredTrades,
      [],
      filteredExcludedTrades
    );
    return emptyMetrics;
  }

  const pnlContributingTrades = filteredTrades.filter((trade) =>
    isPnlContributingTrade(trade)
  );
  const totalTrades = pnlContributingTrades.length;
  const totalCommission = pnlContributingTrades.reduce(
    (sum, trade) => sum + calculateCommissionCost(trade),
    0
  );
  const totalSwap = pnlContributingTrades.reduce(
    (sum, trade) => sum + trade.swap,
    0
  );
  const totalFees = pnlContributingTrades.reduce(
    (sum, trade) => sum + Math.abs(trade.fees),
    0
  );
  const totalPnL = pnlContributingTrades.reduce(
    (sum, trade) => sum + getEffectivePnL(trade),
    0
  );
  const tradeRMultiples = pnlContributingTrades.flatMap((trade) => {
    const r = calculateEffectiveRMultiple(
      getEffectivePnL(trade),
      trade.rMultiple,
      trade.riskAmount,
      options.defaultRiskAmount
    );
    return r === undefined ? [] : [r];
  });
  
  const totalPnLRMultiple =
    tradeRMultiples.length > 0
      ? tradeRMultiples.reduce((sum, r) => sum + r, 0)
      : undefined;

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

  const winningTradesR = winningTrades.reduce<number[]>((acc, trade) => {
    const r = calculateEffectiveRMultiple(
      getEffectivePnL(trade),
      trade.rMultiple,
      trade.riskAmount,
      options.defaultRiskAmount
    );
    if (r !== undefined) {
      acc.push(r);
    }
    return acc;
  }, []);
  const avgWinRMultiple =
    winningTradesR.length > 0
      ? winningTradesR.reduce((sum, r) => sum + r, 0) / winningTradesR.length
      : undefined;

  const losingTradesR = losingTrades.reduce<number[]>((acc, trade) => {
    const r = calculateEffectiveRMultiple(
      getEffectivePnL(trade),
      trade.rMultiple,
      trade.riskAmount,
      options.defaultRiskAmount
    );
    if (r !== undefined) {
      acc.push(r);
    }
    return acc;
  }, []);
  const avgLossRMultiple =
    losingTradesR.length > 0
      ? losingTradesR.reduce((sum, r) => sum + Math.abs(r), 0) /
        losingTradesR.length
      : undefined;

  const profitFactor = calculateProfitFactor(totalWinAmount, totalLossAmount);

  const filteredMetrics: AccountMetrics = {
    totalTrades,
    winningTrades: winningTrades.length,
    losingTrades: losingTrades.length,
    winRate,
    totalPnL,
    totalPnLRMultiple,
    rMultipleTradeCount: tradeRMultiples.length,
    avgWin,
    avgLoss,
    avgWinRMultiple,
    avgLossRMultiple,
    profitFactor,
    totalCommission,
    totalSwap,
    totalFees,
  };

  applyScopedConversionMetadata(
    filteredMetrics,
    accountPageData.metrics,
    filteredTrades,
    pnlContributingTrades,
    filteredExcludedTrades
  );

  return filteredMetrics;
};

export const AccountPageDataProvider: React.FC<
  AccountPageDataProviderProps
> = ({ app: _app, accountPageService, accountName, plugin, children }) => {
  const [state, dispatchState] = useReducer(
    accountPageProviderReducer,
    initialAccountPageProviderState
  );
  const { accountPageData, isLoading, isStale, error, lastFetchTime } = state;
  const [filters, setFiltersState] = useState<AccountTradeFilter>({});
  
  
  const [selectedPhaseId, setSelectedPhaseIdState] = useState<
    string | undefined
  >(undefined);

  
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
        dispatchState({ isLoading: true, error: null });

        try {
          const data = await accountPageService.getAccountPageData(
            accountNameRef.current
          );
          dispatchState({
            accountPageData: data,
            lastFetchTime: Date.now(),
            isStale: false,
          });
        } catch (err) {
          console.error('Error fetching account page data:', err);
          dispatchState({
            error:
              err instanceof Error
                ? err
                : new Error('Failed to fetch account page data'),
          });
        } finally {
          dispatchState({ isLoading: false, isStale: false });
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

  const setSelectedPhaseId = useCallback((phaseId: string | undefined) => {
    setSelectedPhaseIdState(phaseId);
  }, []);

  const setFilters = useCallback((newFilters: AccountTradeFilter) => {
    setFiltersState(newFilters);
  }, []);

  const {
    effectivePhaseId,
    trades: filteredTrades,
    excludedTrades: filteredExcludedTrades,
  } = usePhaseScopedTrades({
    accountPageData,
    accountName,
    plugin,
    selectedPhaseId,
    trades: useMemo(
      () => filterAccountTrades(accountPageData?.trades, filters),
      [accountPageData?.trades, filters]
    ),
    excludedTrades: useMemo(
      () => filterAccountTrades(accountPageData?.excludedTrades, filters),
      [accountPageData?.excludedTrades, filters]
    ),
  });

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
        filteredExcludedTrades,
      }),
    [
      accountPageData,
      filteredTrades,
      filteredExcludedTrades,
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

  useAccountPageDataEvents({
    accountName,
    refreshData,
    rememberCommittedTradeChange,
    wasExpectedLegacyMirror,
  });

  
  React.useEffect(() => {
    if (accountName && accountPageService) {
      void refreshData();
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
      selectedPhaseId: effectivePhaseId,
      refreshData,
      setFilters,
      setSelectedPhaseId,
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
      effectivePhaseId,
      refreshData,
      setFilters,
      setSelectedPhaseId,
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

export const useOptionalAccountPageData = () => use(AccountPageDataContext);

export {};
