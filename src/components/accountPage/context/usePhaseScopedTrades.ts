

import { useCallback, useMemo } from 'react';
import type JournalitPlugin from '../../../main';
import type {
  AccountPageData,
  AccountTradeData,
} from '../../../services/accountPage/types';
import { getCurrentPropChallengePhase } from '../../../services/propChallenge/PropChallengeConfig';
import { getTradeBrokerIdentity } from '../../../services/propChallenge/tradeIdentity';
import { normalizeAccountLookupKey } from '../../../services/trade/core/TradeAccountIdentity';
import {
  resolveAccountPhaseWindows,
  tradeMatchesAccountPhaseWindows,
} from '../../shared/filters/accountPhaseScope';

interface PhaseScopedTradesArgs {
  accountPageData: AccountPageData | null;
  accountName: string;
  plugin: JournalitPlugin | null | undefined;
  
  selectedPhaseId: string | undefined;
  trades: AccountTradeData[];
  
  excludedTrades: AccountTradeData[];
}

interface PhaseScopedTrades {
  
  effectivePhaseId: string | null;
  trades: AccountTradeData[];
  excludedTrades: AccountTradeData[];
}

export function usePhaseScopedTrades({
  accountPageData,
  accountName,
  plugin,
  selectedPhaseId,
  trades,
  excludedTrades,
}: PhaseScopedTradesArgs): PhaseScopedTrades {
  
  
  const effectivePhaseId = useMemo(() => {
    const challenge = accountPageData?.account.propChallenge;
    if (!challenge) return null;
    
    
    
    
    
    
    if (selectedPhaseId === null) return null;
    if (
      selectedPhaseId !== undefined &&
      challenge.phases.some((phase) => phase.id === selectedPhaseId)
    ) {
      return selectedPhaseId;
    }
    return getCurrentPropChallengePhase(challenge)?.id ?? null;
  }, [selectedPhaseId, accountPageData]);

  const phaseWindows = useMemo(
    () =>
      effectivePhaseId && accountPageData
        ? resolveAccountPhaseWindows(
            [{ account: accountName, phaseId: effectivePhaseId }],
            plugin?.settings?.account?.accountMetadata,
            new Date()
          )
        : [],
    [effectivePhaseId, accountPageData, accountName, plugin]
  );

  
  
  
  const accountLookupKeys = useMemo(() => {
    const lookupKey = normalizeAccountLookupKey(accountName);
    return new Set(lookupKey ? [lookupKey] : []);
  }, [accountName]);

  
  
  const scopeToPhase = useCallback(
    (rows: AccountTradeData[]): AccountTradeData[] => {
      
      
      
      
      if (!effectivePhaseId) return rows;
      if (phaseWindows.length === 0) return [];
      return rows.filter((trade) =>
        tradeMatchesAccountPhaseWindows(
          trade,
          accountLookupKeys,
          getTradeBrokerIdentity({
            accountId: Reflect.get(trade, 'accountId'),
            canonicalAccountId: Reflect.get(trade, 'canonicalAccountId'),
            canonicalAccountIdentity: Reflect.get(
              trade,
              'canonicalAccountIdentity'
            ),
            
            
            
            
            
            isCopiedTrade: trade.isCopiedTrade,
          }),
          phaseWindows
        )
      );
    },
    [phaseWindows, accountLookupKeys, effectivePhaseId]
  );

  const scopedTrades = useMemo(
    () => scopeToPhase(trades),
    [trades, scopeToPhase]
  );
  
  
  
  const scopedExcludedTrades = useMemo(
    () => scopeToPhase(excludedTrades),
    [excludedTrades, scopeToPhase]
  );

  return {
    effectivePhaseId,
    trades: scopedTrades,
    excludedTrades: scopedExcludedTrades,
  };
}
