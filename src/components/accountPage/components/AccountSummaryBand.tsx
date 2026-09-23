

import React from 'react';
import { useAccountPageData } from '../context/AccountPageDataContext';
import { useCurrency } from '../../../contexts/CurrencyContext';
import { parseCuratedCurrencyCode } from '../../../utils/currencyConfig';
import { useDisplayFormatter } from '../../../hooks/useDisplayPolicy';
import { t } from '../../../lang/helpers';
import {
  calculateAccountGrowthAmount,
  calculateAccountWithdrawals,
} from '../../account/dashboard/utils';
import {
  calculateNetCashFlow,
  calculatePhaseWithdrawals,
} from './accountSummaryMetrics';
import type { PropChallengeCockpitState } from './propChallenge/usePropChallengeCockpitState';
import { AccountStatCell, statTone, type MetricTile } from './AccountStatCell';
import { AccountNetPnLStatCell } from './AccountNetPnLStatCell';


export function useSummaryBandTiles(
  enabled: boolean,
  cockpitState: PropChallengeCockpitState | null
): MetricTile[] {
  const { accountPageData, getMetrics } = useAccountPageData();
  const { currency: globalCurrency } = useCurrency();
  const { formatValue, shouldMask } = useDisplayFormatter();

  if (!enabled || !accountPageData) {
    return [];
  }

  const { account } = accountPageData;
  
  
  
  const metrics = getMetrics() ?? accountPageData.metrics;
  
  
  
  
  
  
  const effectiveCurrency = parseCuratedCurrencyCode(
    metrics.conversionBaseCurrency || account.currency || globalCurrency
  );

  const isPercentageMasked = shouldMask('percentage');
  const isReturnMasked = shouldMask('returnPercent');

  const isProp = account.propChallenge !== undefined;
  
  
  
  
  const phase = cockpitState?.selectedPhase;

  const balance = phase
    ? cockpitState.selectedEvaluation.currentBalance
    : (account.currentBalance ?? 0);
  
  
  const growthBase = phase ? phase.startingBalance : account.initialBalance;
  const growthAmount = phase
    ? balance - phase.startingBalance
    : calculateAccountGrowthAmount(account);
  const growthPercent = growthBase > 0 ? (growthAmount / growthBase) * 100 : 0;

  return [
    
    
    <AccountStatCell
      key="balance"
      label={t('account.summary.current-balance')}
      value={formatValue({
        kind: 'balance',
        value: balance,
        currencyCode: effectiveCurrency,
      })}
    />,
    <AccountNetPnLStatCell key="net-pnl" />,
    <AccountStatCell
      key="growth"
      label={t('account-dashboard.metrics.growth-percent')}
      value={formatValue({
        kind: 'returnPercent',
        value: growthPercent,
        precision: 1,
        signed: false,
      })}
      tone={statTone(growthPercent, isReturnMasked)}
    />,
    <AccountStatCell
      key="trades"
      label={t('dashboard.metrics.numTrades')}
      value={formatValue({ kind: 'count', value: metrics.totalTrades })}
    />,
    <AccountStatCell
      key="win-rate"
      label={t('dashboard.metrics.winRate')}
      value={formatValue({
        kind: 'percentage',
        value: metrics.winRate,
        precision: 1,
      })}
      tone={statTone(metrics.winRate - 50, isPercentageMasked)}
    />,
    
    
    
    isProp ? (
      <AccountStatCell
        key="cash"
        label={t('account.summary.payouts')}
        value={formatValue({
          kind: 'money',
          value: phase
            ? calculatePhaseWithdrawals(
                phase,
                cockpitState.challenge,
                accountPageData.trades,
                account.transactions
              )
            : calculateAccountWithdrawals(account),
          currencyCode: effectiveCurrency,
        })}
      />
    ) : (
      <AccountStatCell
        key="cash"
        label={t('account.summary.net-cash-flow')}
        value={formatValue({
          kind: 'money',
          value: calculateNetCashFlow(account),
          currencyCode: effectiveCurrency,
          signed: true,
        })}
      />
    ),
  ];
}
