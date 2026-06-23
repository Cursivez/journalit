

import React, {
  createContext,
  ReactNode,
  use,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type JournalitPlugin from '../../../main';
import type { AccountData } from '../../../services/account/types';
import type { TradeType } from '../../../services/tradelog/types';
import { useEventBus } from '../../../hooks/useEventBus';

interface HomeAccountsDataContextValue {
  accounts: AccountData[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const HomeAccountsDataContext =
  createContext<HomeAccountsDataContextValue | null>(null);

interface HomeAccountsDataProviderProps {
  plugin: JournalitPlugin;
  enabled: boolean;
  selectedTradeTypes: TradeType[];
  children: ReactNode;
}

export const HomeAccountsDataProvider: React.FC<
  HomeAccountsDataProviderProps
> = ({ plugin, enabled, selectedTradeTypes, children }) => {
  const supportsAccountMetrics = selectedTradeTypes.includes('regular');
  const shouldLoadAccounts = enabled && supportsAccountMetrics;
  const [accounts, setAccounts] = useState<AccountData[]>([]);
  const [loadState, setLoadState] = useState(() => ({
    isFetching: shouldLoadAccounts,
    hasSettled: !shouldLoadAccounts,
    shouldLoadAccounts,
  }));
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const refresh = useCallback(async () => {
    if (!shouldLoadAccounts) {
      if (isMountedRef.current) {
        setAccounts([]);
        setLoadState({
          isFetching: false,
          hasSettled: true,
          shouldLoadAccounts,
        });
        setError(null);
      }
      return;
    }

    if (!isMountedRef.current) return;

    try {
      setLoadState({
        isFetching: true,
        hasSettled: false,
        shouldLoadAccounts,
      });
      setError(null);

      let retries = 0;
      while (!plugin.accountPageService && retries < 5) {
        if (!isMountedRef.current) return;
        await new Promise((resolve) => window.setTimeout(resolve, 300));
        retries++;
      }

      if (!isMountedRef.current) return;

      if (!plugin.accountPageService) {
        throw new Error('Account service not available');
      }

      const allAccounts =
        await plugin.accountPageService.getAllEnhancedAccounts();

      if (!isMountedRef.current) return;

      setAccounts(allAccounts);
      setLoadState({
        isFetching: false,
        hasSettled: true,
        shouldLoadAccounts,
      });
    } catch (err) {
      if (!isMountedRef.current) return;
      setError(err instanceof Error ? err.message : 'Failed to load accounts');
      setLoadState({
        isFetching: false,
        hasSettled: true,
        shouldLoadAccounts,
      });
    }
  }, [plugin, shouldLoadAccounts]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEventBus('account:changed', refresh, enabled);
  useEventBus('trade:changed', refresh, enabled);

  const isLoading =
    shouldLoadAccounts &&
    (loadState.isFetching ||
      !loadState.hasSettled ||
      loadState.shouldLoadAccounts !== shouldLoadAccounts);

  const value = useMemo<HomeAccountsDataContextValue>(
    () => ({
      accounts,
      isLoading,
      error,
      refresh,
    }),
    [accounts, isLoading, error, refresh]
  );

  return (
    <HomeAccountsDataContext.Provider value={value}>
      {children}
    </HomeAccountsDataContext.Provider>
  );
};

export const useHomeAccountsData = (): HomeAccountsDataContextValue | null =>
  use(HomeAccountsDataContext);
