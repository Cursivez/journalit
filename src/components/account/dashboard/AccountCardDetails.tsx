import React from 'react';
import { Info } from '../../shared/icons/ObsidianIcon';
import { Tooltip } from '../../shared/Tooltip';
import { t } from '../../../lang/helpers';
import type { AccountData } from '../../../services/account/types';
import { useDisplayFormatter } from '../../../hooks/useDisplayPolicy';
import {
  calculateAccountAge,
  calculateAccountWithdrawals,
  getWithdrawalsByMonth,
} from './utils';
import { calculateAccountCostSummary } from '../../accountPage/components/accountSummaryMetrics';
import { WithdrawalBreakdownTooltip } from './WithdrawalBreakdownTooltip';

type FormatDisplayValue = ReturnType<typeof useDisplayFormatter>['formatValue'];

export function calculateAccountCardDetailMetrics(account: AccountData) {
  return {
    accountAge: calculateAccountAge(account.createdDate),
    totalWithdrawals: calculateAccountWithdrawals(account),
    
    
    
    totalCosts: calculateAccountCostSummary(account).estimatedTotalCosts,
    withdrawalsByMonth: getWithdrawalsByMonth([account]),
  };
}

type AccountCardDetailMetrics = ReturnType<
  typeof calculateAccountCardDetailMetrics
>;

export function AccountKeyMetrics({
  account,
  currency,
  metrics,
  formatValue,
}: {
  account: AccountData;
  currency: string;
  metrics: AccountCardDetailMetrics;
  formatValue: FormatDisplayValue;
}) {
  
  
  const { shouldMask } = useDisplayFormatter();
  const withdrawalsValue = formatValue({
    kind: 'money',
    value: metrics.totalWithdrawals,
    currencyCode: currency,
    notation: 'compact',
  });

  return (
    <div className="key-metrics">
      <div className="metric-item">
        <div className="metric-value">
          <span>{account.metrics.totalTrades}</span>
        </div>
        <div className="metric-label">
          <span>{t('account-card.metric.trades')}</span>
        </div>
      </div>
      {metrics.withdrawalsByMonth.length > 0 && !shouldMask('money') ? (
        <Tooltip
          content={
            <WithdrawalBreakdownTooltip
              withdrawalsByMonth={metrics.withdrawalsByMonth}
            />
          }
          delay={200}
          preferredPosition="bottom"
        >
          <div className="metric-item">
            <div className="metric-value">
              <span>{withdrawalsValue}</span>
              <Info size={8} className="withdrawal-info-icon" />
            </div>
            <div className="metric-label">
              <span>{t('account-card.metric.withdrawals')}</span>
            </div>
          </div>
        </Tooltip>
      ) : (
        <div className="metric-item">
          <div className="metric-value">
            <span>{withdrawalsValue}</span>
          </div>
          <div className="metric-label">
            <span>{t('account-card.metric.withdrawals')}</span>
          </div>
        </div>
      )}
      <div className="metric-item">
        <div className="metric-value">
          <span>{metrics.accountAge}</span>
        </div>
        <div className="metric-label">
          <span>{t('account-card.metric.age')}</span>
        </div>
      </div>
    </div>
  );
}

export function AccountCardFooter({
  account,
  currency,
  metrics,
  formatValue,
}: {
  account: AccountData;
  currency: string;
  metrics: AccountCardDetailMetrics;
  formatValue: FormatDisplayValue;
}) {
  
  
  
  const { shouldMask } = useDisplayFormatter();
  const feesMasked = shouldMask('fee');
  return (
    <div className="account-card-footer">
      <div className="footer-metric">
        <span className="footer-label">{t('account-card.footer.monthly')}</span>
        <span className="footer-value">
          {feesMasked || (account.monthlyCost && account.monthlyCost > 0)
            ? `${formatValue({
                kind: 'fee',
                value: account.monthlyCost ?? 0,
                currencyCode: currency,
              })}/month`
            : 'N/A'}
        </span>
      </div>
      <div className="footer-metric">
        <span className="footer-label">
          {t('account-card.footer.total-costs')}
        </span>
        <span className="footer-value">
          {feesMasked || metrics.totalCosts > 0
            ? formatValue({
                kind: 'fee',
                value: metrics.totalCosts,
                currencyCode: currency,
              })
            : 'N/A'}
        </span>
      </div>
    </div>
  );
}
