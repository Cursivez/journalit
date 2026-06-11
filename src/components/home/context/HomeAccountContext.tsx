

import React, { createContext, use, useMemo, ReactNode } from 'react';
import { normalizeAccountLookupKey } from '../../../services/trade/core/TradeAccountIdentity';

interface HomeAccountContextValue {
  selectedAccounts: string[];
  hasAccountFilter: boolean;
  matchesAccount: (account: string | string[] | null | undefined) => boolean;
}

const HomeAccountContext = createContext<HomeAccountContextValue | null>(null);

interface HomeAccountProviderProps {
  selectedAccounts: string[];
  children: ReactNode;
}

export const HomeAccountProvider: React.FC<HomeAccountProviderProps> = ({
  selectedAccounts,
  children,
}) => {
  const normalizedSelectedAccounts = useMemo(
    () => [...new Set(selectedAccounts.filter(Boolean))],
    [selectedAccounts]
  );
  const normalizedSelectedLookupKeys = useMemo(
    () =>
      new Set(
        normalizedSelectedAccounts.map((account) =>
          normalizeAccountLookupKey(account)
        )
      ),
    [normalizedSelectedAccounts]
  );

  const hasAccountFilter = normalizedSelectedAccounts.length > 0;

  const matchesAccount = useMemo(() => {
    return (account: string | string[] | null | undefined): boolean => {
      if (!hasAccountFilter) {
        return true;
      }

      if (!account) {
        return false;
      }

      const accountValues = Array.isArray(account) ? account : [account];
      return accountValues.some((value) =>
        normalizedSelectedLookupKeys.has(normalizeAccountLookupKey(value))
      );
    };
  }, [hasAccountFilter, normalizedSelectedLookupKeys]);

  const contextValue = useMemo<HomeAccountContextValue>(
    () => ({
      selectedAccounts: normalizedSelectedAccounts,
      hasAccountFilter,
      matchesAccount,
    }),
    [normalizedSelectedAccounts, hasAccountFilter, matchesAccount]
  );

  return (
    <HomeAccountContext.Provider value={contextValue}>
      {children}
    </HomeAccountContext.Provider>
  );
};

export const useHomeAccount = (): HomeAccountContextValue | null => {
  return use(HomeAccountContext);
};
