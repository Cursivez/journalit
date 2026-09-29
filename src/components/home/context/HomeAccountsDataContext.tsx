

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
import { evaluatePropChallengePhase } from '../../../services/propChallenge/PropChallengeRuleEngine';
import { getCurrentPropChallengePhase } from '../../../services/propChallenge/PropChallengeConfig';
import {
  summarizeChallengeRuleProgress,
  type ChallengeRuleProgress,
} from '../../../services/propChallenge/challengeRuleProgress';

interface HomeAccountsDataContextValue {
  accounts: AccountData[];
  
  challengeProgress: ReadonlyMap<string, ChallengeRuleProgress>;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const HomeAccountsDataContext =
  createContext<HomeAccountsDataContextValue | null>(null);

interface HomeAccountsDataProviderProps {
  plugin: JournalitPlugin;
  enabled: boolean;
  
  includeChallengeProgress: boolean;
  selectedTradeTypes: TradeType[];
  children: ReactNode;
}

export const HomeAccountsDataProvider: React.FC<
  HomeAccountsDataProviderProps
> = ({
  plugin,
  enabled,
  includeChallengeProgress,
  selectedTradeTypes,
  children,
}) => {
  const supportsAccountMetrics = selectedTradeTypes.includes('regular');
  const shouldLoadAccounts = enabled && supportsAccountMetrics;
  const [accounts, setAccounts] = useState<AccountData[]>([]);
  const [challengeProgress, setChallengeProgress] = useState<
    ReadonlyMap<string, ChallengeRuleProgress>
  >(() => new Map());
  const [loadState, setLoadState] = useState(() => ({
    isFetching: shouldLoadAccounts,
    hasSettled: !shouldLoadAccounts,
    shouldLoadAccounts,
  }));
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);
  
  
  const requestSequenceRef = useRef(0);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const refresh = useCallback(async () => {
    
    const requestSequence = ++requestSequenceRef.current;
    const isCurrent = () =>
      isMountedRef.current && requestSequence === requestSequenceRef.current;
    if (!shouldLoadAccounts) {
      if (isMountedRef.current) {
        setAccounts([]);
        setChallengeProgress(new Map());
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
        if (!isCurrent()) return;
        await new Promise((resolve) => window.setTimeout(resolve, 300));
        retries++;
      }

      if (!isCurrent()) return;

      if (!plugin.accountPageService) {
        throw new Error('Account service not available');
      }

      const accountPageService = plugin.accountPageService;
      const allAccounts = await accountPageService.getAllEnhancedAccounts();
      
      
      const tradingDayCutoffTime = plugin.settings.trade?.tradingDayCutoffTime;
      const loadProgress = async (accountName: string) => {
        const data = await accountPageService.getAccountPageData(accountName);
        const challenge = data?.account.propChallenge;
        const phase = challenge
          ? getCurrentPropChallengePhase(challenge)
          : undefined;
        if (!data || !challenge || !phase) return null;
        const evaluation = evaluatePropChallengePhase({
          phase,
          config: challenge,
          trades: data.trades,
          transactions: data.account.transactions,
          tradingDayCutoffTime,
        });
        return [
          accountName,
          summarizeChallengeRuleProgress(evaluation),
        ] as const;
      };
      const requests: ReturnType<typeof loadProgress>[] = [];
      if (includeChallengeProgress) {
        for (const account of allAccounts) {
          if (account.propChallenge) requests.push(loadProgress(account.name));
        }
      }
      const progressEntries = await Promise.all(requests);

      if (!isCurrent()) return;

      setAccounts(allAccounts);
      setChallengeProgress(
        new Map(progressEntries.flatMap((entry) => (entry ? [entry] : [])))
      );
      setLoadState({
        isFetching: false,
        hasSettled: true,
        shouldLoadAccounts,
      });
    } catch (err) {
      if (!isCurrent()) return;
      setError(err instanceof Error ? err.message : 'Failed to load accounts');
      setLoadState({
        isFetching: false,
        hasSettled: true,
        shouldLoadAccounts,
      });
    }
  }, [plugin, shouldLoadAccounts, includeChallengeProgress]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEventBus('account:changed', refresh, enabled);
  useEventBus('trade:changed', refresh, enabled);
  
  
  
  useEventBus(
    'settings:changed',
    (payload) => {
      if (
        payload?.section === 'trade' ||
        payload?.section === 'all' ||
        payload?.section === 'copyTradeAdjustments' ||
        payload?.section === 'symbolMappings'
      ) {
        void refresh();
      }
    },
    enabled
  );

  const isLoading =
    shouldLoadAccounts &&
    (loadState.isFetching ||
      !loadState.hasSettled ||
      loadState.shouldLoadAccounts !== shouldLoadAccounts);

  const value = useMemo<HomeAccountsDataContextValue>(
    () => ({
      accounts,
      challengeProgress,
      isLoading,
      error,
      refresh,
    }),
    [accounts, challengeProgress, isLoading, error, refresh]
  );

  return (
    <HomeAccountsDataContext.Provider value={value}>
      {children}
    </HomeAccountsDataContext.Provider>
  );
};

export const useHomeAccountsData = (): HomeAccountsDataContextValue | null =>
  use(HomeAccountsDataContext);
