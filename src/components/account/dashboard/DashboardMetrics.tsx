import React, { useMemo } from 'react';
import { Info } from '../../shared/icons/ObsidianIcon';
import { DashboardMetricsProps } from './types';
import { getWithdrawalsByMonth } from './utils';
import { WithdrawalBreakdownTooltip } from './WithdrawalBreakdownTooltip';
import { Tooltip } from '../../shared';
import { useCurrency } from '../../../contexts/CurrencyContext';
import { useDisplayFormatter } from '../../../hooks/useDisplayPolicy';
import { t } from '../../../lang/helpers';

export const DashboardMetrics: React.FC<DashboardMetricsProps> = ({
  metrics,
  withdrawalAccounts,
}) => {
  const { currency } = useCurrency();
  const { formatValue, shouldMask } = useDisplayFormatter();

  const isGrowthMasked = shouldMask('pnl') || shouldMask('returnPercent');
  const growthClass = isGrowthMasked
    ? ''
    : metrics.totalGrowthAmount >= 0
      ? 'positive'
      : 'negative';

  const withdrawalsByMonth = useMemo(
    () => getWithdrawalsByMonth(withdrawalAccounts || []),
    [withdrawalAccounts]
  );

  const hasBreakdown = withdrawalsByMonth.length > 0;

  const withdrawalContent = (
    <div className="metric-item">
      <div className="metric-value">
        {formatValue({
          kind: 'money',
          value: metrics.totalWithdrawals,
          currencyCode: currency,
          notation: 'compact',
        })}
      </div>
      <div className="metric-label">
        {t('account-dashboard.metrics.total-withdrawals')}
        {hasBreakdown && <Info size={10} className="withdrawal-info-icon" />}
      </div>
    </div>
  );

  return (
    <div className="dashboard-metrics">
      <div className="metric-item">
        <div className="metric-value">{metrics.totalAccounts}</div>
        <div className="metric-label">
          {t('account-dashboard.metrics.total-accounts')}
        </div>
      </div>

      <div className="metric-item">
        <div className="metric-value">
          {formatValue({
            kind: 'balance',
            value: metrics.totalAUM,
            currencyCode: currency,
            notation: 'compact',
          })}
        </div>
        <div className="metric-label">
          {t('account-dashboard.metrics.total-aum')}
        </div>
      </div>

      <div className="metric-item">
        <div className={`metric-value ${growthClass}`}>
          {formatValue({
            kind: 'pnl',
            value: metrics.totalGrowthAmount,
            currencyCode: currency,
            notation: 'compact',
          })}
        </div>
        <div className="metric-label">
          {t('account-dashboard.metrics.total-growth')}
        </div>
      </div>

      <div className="metric-item">
        <div className={`metric-value ${growthClass}`}>
          {formatValue({
            kind: 'returnPercent',
            value: metrics.totalGrowthPercent,
            signed: false,
            precision: 1,
          })}
        </div>
        <div className="metric-label">
          {t('account-dashboard.metrics.growth-percent')}
        </div>
      </div>

      {hasBreakdown ? (
        <Tooltip
          content={
            <WithdrawalBreakdownTooltip
              withdrawalsByMonth={withdrawalsByMonth}
            />
          }
          delay={200}
          preferredPosition="bottom"
        >
          {withdrawalContent}
        </Tooltip>
      ) : (
        withdrawalContent
      )}

      <div className="metric-item">
        <div className="metric-value">{metrics.totalTrades}</div>
        <div className="metric-label">
          {t('account-dashboard.metrics.total-trades')}
        </div>
      </div>
    </div>
  );
};
