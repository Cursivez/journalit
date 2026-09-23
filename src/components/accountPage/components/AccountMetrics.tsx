

import React from 'react';
import { useAccountPageData } from '../context/AccountPageDataContext';
import { useCurrency } from '../../../contexts/CurrencyContext';
import { parseCuratedCurrencyCode } from '../../../utils/currencyConfig';
import { useDisplayFormatter } from '../../../hooks/useDisplayPolicy';
import { t } from '../../../lang/helpers';
import { AccountStatCell, statTone, type MetricTile } from './AccountStatCell';
import { AccountNetPnLStatCell } from './AccountNetPnLStatCell';
import { calculateAccountCostSummary } from './accountSummaryMetrics';


export function useAccountMetricsTiles(
  includePromotedMetrics: boolean
): MetricTile[] {
  const { accountPageData, getMetrics } = useAccountPageData();
  const { currency: globalCurrency } = useCurrency();
  const { formatValue, shouldMask } = useDisplayFormatter();

  const metrics = getMetrics();

  if (!metrics) {
    return [];
  }

  const isPercentageMasked = shouldMask('percentage');
  const isMetricMasked = shouldMask('metric');
  const isPnlMasked = shouldMask('pnl');

  const effectiveCurrency = parseCuratedCurrencyCode(
    metrics.conversionBaseCurrency ||
      accountPageData?.account.currency ||
      globalCurrency
  );
  const accountCosts = accountPageData
    ? calculateAccountCostSummary(accountPageData.account)
    : undefined;

  const tiles: MetricTile[] = [];

  if (includePromotedMetrics) {
    tiles.push(
      <AccountStatCell
        key="trades"
        label={t('dashboard.metrics.numTrades')}
        value={formatValue({
          kind: 'count',
          value: metrics.totalTrades,
        })}
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
      <AccountNetPnLStatCell key="net-pnl" />
    );
  }

  tiles.push(
    <AccountStatCell
      key="profit-factor"
      label={t('dashboard.metrics.profitFactor')}
      value={formatValue({
        kind: 'metric',
        value: metrics.profitFactor,
        precision: 2,
      })}
      tone={statTone(metrics.profitFactor - 1, isMetricMasked)}
    />,
    <AccountStatCell
      key="avg-win"
      label={t('dashboard.metrics.avgWin')}
      value={formatValue({
        kind: 'pnl',
        value: metrics.avgWin,
        currencyCode: effectiveCurrency,
        rMultiple: metrics.avgWinRMultiple,
      })}
      tone={isPnlMasked ? 'neutral' : 'positive'}
    />,
    <AccountStatCell
      key="avg-loss"
      label={t('dashboard.metrics.avgLoss')}
      value={formatValue({
        kind: 'pnl',
        value: Math.abs(metrics.avgLoss),
        currencyCode: effectiveCurrency,
        rMultiple:
          metrics.avgLossRMultiple !== undefined
            ? -Math.abs(metrics.avgLossRMultiple)
            : undefined,
      })}
      tone={isPnlMasked ? 'neutral' : 'negative'}
    />,
    <AccountStatCell
      key="winning"
      label={t('dashboard.metrics.numWinTrades')}
      value={formatValue({
        kind: 'metric',
        value: metrics.winningTrades,
        precision: 0,
      })}
      tone={isMetricMasked ? 'neutral' : 'positive'}
    />,
    <AccountStatCell
      key="losing"
      label={t('dashboard.metrics.numLossTrades')}
      value={formatValue({
        kind: 'metric',
        value: metrics.losingTrades,
        precision: 0,
      })}
      tone={isMetricMasked ? 'neutral' : 'negative'}
    />,
    <AccountStatCell
      key="commission"
      label={t('dashboard.metrics.totalCommission')}
      value={formatValue({
        kind: 'fee',
        value: metrics.totalCommission,
        currencyCode: effectiveCurrency,
      })}
      muted
    />,
    <AccountStatCell
      key="fees"
      label={t('dashboard.metrics.totalFees')}
      value={formatValue({
        kind: 'fee',
        value: metrics.totalFees,
        currencyCode: effectiveCurrency,
      })}
      muted
    />
  );

  
  
  
  if (accountCosts?.hasCosts) {
    tiles.push(
      <AccountStatCell
        key="total-costs"
        label={t(
          accountCosts.monthlyCost > 0
            ? 'account.metrics.total-account-costs'
            : 'account.metrics.total-costs'
        )}
        value={formatValue({
          kind: 'fee',
          value: accountCosts.estimatedTotalCosts,
          currencyCode: effectiveCurrency,
        })}
        muted
      />
    );
    if (accountCosts.oneTimeCosts > 0) {
      tiles.push(
        <AccountStatCell
          key="one-time-costs"
          label={t('account.metrics.one-time-costs')}
          value={formatValue({
            kind: 'fee',
            value: accountCosts.oneTimeCosts,
            currencyCode: effectiveCurrency,
          })}
          muted
        />
      );
    }
    if (accountCosts.monthlyCost > 0) {
      tiles.push(
        <AccountStatCell
          key="recurring-costs"
          label={t('account.metrics.recurring-costs-to-date')}
          value={formatValue({
            kind: 'fee',
            value: accountCosts.estimatedRecurringCosts,
            currencyCode: effectiveCurrency,
          })}
          muted
        />,
        <AccountStatCell
          key="monthly-cost"
          label={t('account.metrics.monthly-cost')}
          value={formatValue({
            kind: 'fee',
            value: accountCosts.monthlyCost,
            currencyCode: effectiveCurrency,
          })}
          muted
        />
      );
    }
  }

  return tiles;
}
