

import React, { useMemo } from 'react';
import { Info } from '../../shared/icons/ObsidianIcon';
import {
  formatAccountType,
  calculateAccountTypeMetrics,
  getWithdrawalsByMonth,
  haveSameRelevantTransactions,
  AccountTypeMetrics,
} from './utils';
import { WithdrawalBreakdownTooltip } from './WithdrawalBreakdownTooltip';
import { Tooltip } from '../../shared';
import { AccountData } from '../../../services/account/types';
import { useCurrency } from '../../../contexts/CurrencyContext';
import { useDisplayFormatter } from '../../../hooks/useDisplayPolicy';
import { t } from '../../../lang/helpers';


interface AccountTypeHeaderProps {
  type: string; 
  accounts: AccountData[]; 
  totalAUM: number; 
  isExcludedFromStats?: boolean; 
}


const AccountTypeHeaderComponent: React.FC<AccountTypeHeaderProps> = ({
  type,
  accounts,
  totalAUM,
  isExcludedFromStats = false,
}) => {
  const { currency } = useCurrency();
  const { formatValue, shouldMask } = useDisplayFormatter();

  
  const metrics: AccountTypeMetrics = useMemo(
    () => calculateAccountTypeMetrics(accounts, totalAUM),
    [accounts, totalAUM]
  );

  const withdrawalsByMonth = useMemo(
    () => getWithdrawalsByMonth(accounts),
    [accounts]
  );

  
  const isGrowthMasked = shouldMask('pnl') || shouldMask('returnPercent');
  const growthClass = isGrowthMasked
    ? ''
    : metrics.totalGrowthAmount >= 0
      ? 'positive'
      : 'negative';

  return (
    <div className="account-type-header">
      
      <div className="account-type-name">
        <h3>{formatAccountType(type)}</h3>
      </div>

      
      <div className="account-type-metrics">
        
        <div className="metric-item">
          <div
            className={`metric-value ${isExcludedFromStats ? 'excluded-status' : 'weight-percent'}`}
          >
            {isExcludedFromStats
              ? t('account-dashboard.type-header.excluded')
              : formatValue({
                  kind: 'percentage',
                  value: metrics.aumWeightPercent,
                  signed: false,
                  precision: 1,
                })}
          </div>
          <div className="metric-label">
            {isExcludedFromStats
              ? t('account-dashboard.type-header.from-stats')
              : t('account-dashboard.type-header.of-total-aum')}
          </div>
        </div>

        
        <div className="metric-item">
          <div className="metric-value">
            {formatValue({
              kind: 'balance',
              value: metrics.aumAmount,
              currencyCode: currency,
              notation: 'compact',
            })}
          </div>
          <div className="metric-label">
            {t('account-dashboard.type-header.aum')}
          </div>
        </div>

        
        {withdrawalsByMonth.length > 0 ? (
          <Tooltip
            content={
              <WithdrawalBreakdownTooltip
                withdrawalsByMonth={withdrawalsByMonth}
              />
            }
            triggerClassName="metric-item-trigger metric-item-trigger--withdrawals"
            delay={200}
            preferredPosition="bottom"
          >
            <div className="metric-item metric-item--withdrawals">
              <div className="metric-value">
                {formatValue({
                  kind: 'money',
                  value: metrics.totalWithdrawals,
                  currencyCode: currency,
                  notation: 'compact',
                })}
              </div>
              <div className="metric-label">
                {t('account-dashboard.type-header.withdrawals')}
                <Info size={8} className="withdrawal-info-icon" />
              </div>
            </div>
          </Tooltip>
        ) : (
          <div className="metric-item metric-item--withdrawals">
            <div className="metric-value">
              {formatValue({
                kind: 'money',
                value: metrics.totalWithdrawals,
                currencyCode: currency,
                notation: 'compact',
              })}
            </div>
            <div className="metric-label">
              {t('account-dashboard.type-header.withdrawals')}
            </div>
          </div>
        )}

        
        <div className="metric-item">
          <div className="metric-value">{metrics.accountCount}</div>
          <div className="metric-label">
            {metrics.accountCount !== 1
              ? t('account-dashboard.type-header.accounts')
              : t('account-dashboard.type-header.account')}
          </div>
        </div>

        
        <div className="metric-item metric-item--trades">
          <div className="metric-value">{metrics.totalTrades}</div>
          <div className="metric-label">
            {metrics.totalTrades !== 1
              ? t('account-dashboard.type-header.trades')
              : t('account-dashboard.type-header.trade')}
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
            {t('account-dashboard.type-header.growth', {
              percent: formatValue({
                kind: 'returnPercent',
                value: metrics.totalGrowthPercent,
                signed: false,
                precision: 1,
              }),
            })}
          </div>
        </div>
      </div>
    </div>
  );
};



const areEqual = (
  prevProps: AccountTypeHeaderProps,
  nextProps: AccountTypeHeaderProps
) => {
  if (prevProps.type !== nextProps.type) return false;
  if (prevProps.totalAUM !== nextProps.totalAUM) return false;
  if (prevProps.isExcludedFromStats !== nextProps.isExcludedFromStats) {
    return false;
  }
  if (prevProps.accounts.length !== nextProps.accounts.length) return false;

  
  for (let index = 0; index < prevProps.accounts.length; index++) {
    const account = prevProps.accounts[index];
    const nextAccount = nextProps.accounts[index];
    if (
      !nextAccount ||
      account.id !== nextAccount.id ||
      account.currentBalance !== nextAccount.currentBalance ||
      account.initialBalance !== nextAccount.initialBalance ||
      account.metrics.totalTrades !== nextAccount.metrics.totalTrades ||
      account.metrics.totalPnL !== nextAccount.metrics.totalPnL ||
      account.lastUpdated.getTime() !== nextAccount.lastUpdated.getTime() ||
      !haveSameRelevantTransactions(
        account.transactions,
        nextAccount.transactions
      )
    ) {
      return false;
    }
  }

  return true;
};

export const AccountTypeHeader = React.memo(
  AccountTypeHeaderComponent,
  areEqual
);

export {};
