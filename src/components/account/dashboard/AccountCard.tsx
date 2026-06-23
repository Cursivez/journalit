

import React, { useMemo } from 'react';
import { Info, Network, Repeat2 } from '../../shared/icons/ObsidianIcon';
import { t } from '../../../lang/helpers';
import { cssVars } from '../../../styles/inlineStylePolicy';
import {
  calculateAccountAge,
  calculateDrawdownUsed,
  calculateProfitTargetProgress,
  calculateTotalCosts,
  calculateAccountWithdrawals,
  calculateAccountGrowthAmount,
  calculateAccountGrowthPercent,
  getWithdrawalsByMonth,
  haveSameRelevantTransactions,
} from './utils';
import { WithdrawalBreakdownTooltip } from './WithdrawalBreakdownTooltip';
import { Tooltip } from '../../shared';
import { AccountCardProps } from './types';
import { AccountData, DrawdownType } from '../../../services/account/types';
import { useCurrency } from '../../../contexts/CurrencyContext';
import { useDisplayFormatter } from '../../../hooks/useDisplayPolicy';
import { getActiveCopyTradingPeriod } from '../../../utils/accountCopyTrading';
import { normalizeAccountLookupKey } from '../../../services/trade/core/TradeAccountIdentity';
import { usePlugin } from '../../../hooks/usePlugin';
import { parseCuratedCurrencyCode } from '../../../utils/currencyConfig';

type FormatDisplayValue = ReturnType<typeof useDisplayFormatter>['formatValue'];
type AccountCardMetrics = ReturnType<typeof calculateAccountCardMetrics>;

function calculateAccountCardMetrics(account: AccountData) {
  const accountAge = calculateAccountAge(account.createdDate);
  const growthAmount = calculateAccountGrowthAmount(account);
  const growthPercent = calculateAccountGrowthPercent(account);

  const profitTargetProgress = calculateProfitTargetProgress(account);
  const profitTargetProgressClass =
    profitTargetProgress >= 100 ? 'complete' : '';

  const drawdownUsed = calculateDrawdownUsed(account);

  let drawdownProgressClass = '';
  if (drawdownUsed >= 75) {
    drawdownProgressClass = 'critical';
  } else if (drawdownUsed >= 50) {
    drawdownProgressClass = 'warning';
  } else {
    drawdownProgressClass = 'safe';
  }

  const totalWithdrawals = calculateAccountWithdrawals(account);
  const withdrawalsByMonth = getWithdrawalsByMonth([account]);

  const hasDrawdownSet =
    account.drawdownType !== DrawdownType.NONE &&
    Boolean(
      account.drawdownAmount > 0 ||
      (account.drawdownType === DrawdownType.MANUAL &&
        account.currentDrawdownSnapshot)
    );
  const hasProfitTargetSet =
    account.hasProfitTarget && account.profitTarget > 0;
  const drawdownStatus = hasDrawdownSet
    ? drawdownUsed >= 100
      ? 'BREACHED'
      : 'IN_PROGRESS'
    : null;
  const profitTargetStatus = hasProfitTargetSet
    ? profitTargetProgress >= 100
      ? 'ACHIEVED'
      : 'IN_PROGRESS'
    : null;

  return {
    accountAge,
    growthAmount,
    growthPercent,
    profitTargetProgress,
    profitTargetProgressClass,
    drawdownUsed,
    drawdownProgressClass,
    totalWithdrawals,
    totalCosts: calculateTotalCosts(account),
    withdrawalsByMonth,
    drawdownStatus,
    profitTargetStatus,
  };
}

function AccountCardHeader({
  account,
  currency,
  metrics,
  growthClass,
  formatValue,
  copiedByAccounts,
}: {
  account: AccountData;
  currency: string;
  metrics: AccountCardMetrics;
  growthClass: string;
  formatValue: FormatDisplayValue;
  copiedByAccounts: Array<{ account: string; multiplier: number }>;
}) {
  const activeCopyPeriod = getActiveCopyTradingPeriod(account);
  const isCopyAccount = activeCopyPeriod !== null;
  const isBaseAccount = copiedByAccounts.length > 0;

  return (
    <div className="account-card-header">
      <div className="account-identity">
        <div className="account-name">{account.name}</div>
        <div className="account-card-badges">
          <div className="account-type-badge">{account.accountType}</div>
          {isBaseAccount && (
            <Tooltip
              content={
                <div className="account-copy-badge-tooltip">
                  <div className="account-copy-badge-tooltip-title">
                    {t('account-dashboard.copy-badge.copied-by')}
                  </div>
                  {copiedByAccounts.map((copyAccount) => (
                    <div
                      key={copyAccount.account}
                      className="account-copy-badge-tooltip-row"
                    >
                      <span>{copyAccount.account}</span>
                      <span>{copyAccount.multiplier}x</span>
                    </div>
                  ))}
                </div>
              }
              delay={0}
              preferredPosition="top"
            >
              <div className="account-base-badge">
                <Network size={12} aria-hidden="true" />
                {t('account-dashboard.copy-badge.base')}
              </div>
            </Tooltip>
          )}
          {isCopyAccount && (
            <Tooltip
              content={t('account-dashboard.copy-badge.copies-tooltip', {
                account: activeCopyPeriod.baseAccount,
                multiplier: String(activeCopyPeriod.multiplier),
              })}
              delay={0}
              preferredPosition="top"
            >
              <div className="account-copy-badge">
                <Repeat2 size={12} aria-hidden="true" />
                {t('account-dashboard.copy-badge.copy')}
              </div>
            </Tooltip>
          )}
        </div>
      </div>
      <div className="account-balance">
        <div className="balance-amount">
          {formatValue({
            kind: 'balance',
            value: account.currentBalance,
            currencyCode: currency,
            notation: 'compact',
          })}
        </div>
        <div className={`balance-growth ${growthClass}`}>
          {formatValue({
            kind: 'pnl',
            value: metrics.growthAmount,
            currencyCode: currency,
            notation: 'compact',
          })}{' '}
          (
          {formatValue({
            kind: 'returnPercent',
            value: metrics.growthPercent,
            signed: false,
            precision: 1,
          })}
          )
        </div>
      </div>
    </div>
  );
}

function AccountKeyMetrics({
  account,
  currency,
  metrics,
  formatValue,
}: {
  account: AccountData;
  currency: string;
  metrics: AccountCardMetrics;
  formatValue: FormatDisplayValue;
}) {
  const withdrawalsValue = formatValue({
    kind: 'money',
    value: metrics.totalWithdrawals,
    currencyCode: currency,
    notation: 'compact',
  });

  return (
    <div className="key-metrics">
      <div className="metric-item">
        <div className="metric-value">{account.metrics.totalTrades}</div>
        <div className="metric-label">{t('account-card.metric.trades')}</div>
      </div>
      {metrics.withdrawalsByMonth.length > 0 ? (
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
            <div className="metric-value">{withdrawalsValue}</div>
            <div className="metric-label">
              {t('account-card.metric.withdrawals')}
              <Info size={8} className="withdrawal-info-icon" />
            </div>
          </div>
        </Tooltip>
      ) : (
        <div className="metric-item">
          <div className="metric-value">{withdrawalsValue}</div>
          <div className="metric-label">
            {t('account-card.metric.withdrawals')}
          </div>
        </div>
      )}
      <div className="metric-item">
        <div className="metric-value">{metrics.accountAge}</div>
        <div className="metric-label">{t('account-card.metric.age')}</div>
      </div>
    </div>
  );
}

function AccountCardFooter({
  account,
  currency,
  metrics,
  formatValue,
}: {
  account: AccountData;
  currency: string;
  metrics: AccountCardMetrics;
  formatValue: FormatDisplayValue;
}) {
  return (
    <div className="account-card-footer">
      <div className="footer-metric">
        <span className="footer-label">{t('account-card.footer.monthly')}</span>
        <span className="footer-value">
          {account.monthlyCost && account.monthlyCost > 0
            ? `${formatValue({
                kind: 'fee',
                value: account.monthlyCost,
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
          {metrics.totalCosts > 0
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


const AccountCardComponent: React.FC<AccountCardProps> = ({
  account,
  onClick,
}) => {
  const { currency: globalCurrency } = useCurrency();
  const { formatValue, shouldMask } = useDisplayFormatter();
  const plugin = usePlugin();

  
  const currency =
    account.metrics.isMultiCurrency && account.metrics.conversionBaseCurrency
      ? parseCuratedCurrencyCode(account.metrics.conversionBaseCurrency)
      : globalCurrency;

  const isPnlMasked = shouldMask('pnl');
  const isReturnPercentMasked = shouldMask('returnPercent');
  const isDrawdownMasked = shouldMask('drawdown');
  const isProfitTargetMasked = isPnlMasked || isReturnPercentMasked;

  
  const calculatedMetrics = useMemo(
    () => calculateAccountCardMetrics(account),
    [account]
  );

  const copiedByAccounts = useMemo(() => {
    const accountMetadata = plugin?.settings.account?.accountMetadata ?? {};
    const accountLookupKey = normalizeAccountLookupKey(account.name);

    return Object.values(accountMetadata).reduce<
      Array<{ account: string; multiplier: number }>
    >((acc, metadata) => {
      const activeCopyPeriod = getActiveCopyTradingPeriod(metadata);
      if (
        activeCopyPeriod &&
        normalizeAccountLookupKey(activeCopyPeriod.baseAccount) ===
          accountLookupKey
      ) {
        acc.push({
          account: metadata.name,
          multiplier: activeCopyPeriod.multiplier,
        });
      }
      return acc;
    }, []);
  }, [account.name, plugin?.settings.account?.accountMetadata]);

  const growthClass = isPnlMasked
    ? ''
    : calculatedMetrics.growthAmount >= 0
      ? 'positive'
      : 'negative';

  return (
    <div
      className="account-card"
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key !== 'Enter' && e.key !== ' ') {
          return;
        }

        e.preventDefault();
        onClick();
      }}
      role="button"
      tabIndex={0}
    >
      <AccountCardHeader
        account={account}
        currency={currency}
        metrics={calculatedMetrics}
        growthClass={growthClass}
        formatValue={formatValue}
        copiedByAccounts={copiedByAccounts}
      />

      
      <div className="account-card-body">
        <AccountKeyMetrics
          account={account}
          currency={currency}
          metrics={calculatedMetrics}
          formatValue={formatValue}
        />

        
        <div className="progress-section">
          
          <div
            className={`progress-item ${!(account.hasProfitTarget && account.profitTarget > 0) ? 'not-set' : ''}`}
          >
            <div className="progress-header">
              <div className="progress-label-with-badge">
                <span className="progress-label">
                  {t('account-card.progress.profit-target')}
                </span>
                {calculatedMetrics.profitTargetStatus &&
                  !isProfitTargetMasked && (
                    <span
                      className={`dashboard-status-badge ${calculatedMetrics.profitTargetStatus === 'ACHIEVED' ? 'achieved' : 'in-progress'}`}
                    >
                      {calculatedMetrics.profitTargetStatus === 'ACHIEVED'
                        ? t('account-card.status.achieved')
                        : t('account-card.status.in-progress')}
                    </span>
                  )}
              </div>
              <div
                className={`progress-value ${!(account.hasProfitTarget && account.profitTarget > 0) ? 'not-set' : ''}`}
              >
                {account.hasProfitTarget && account.profitTarget > 0
                  ? formatValue({
                      kind: 'returnPercent',
                      value: calculatedMetrics.profitTargetProgress,
                      signed: false,
                      precision: 1,
                    })
                  : t('account-card.progress.not-set')}
              </div>
            </div>
            <div className="progress-bar-container">
              <div
                className={`progress-bar ${!isProfitTargetMasked && account.hasProfitTarget && account.profitTarget > 0 && calculatedMetrics.profitTargetProgress > 0 ? `profit-target ${calculatedMetrics.profitTargetProgressClass}` : 'empty'}`}
                data-is-zero={
                  isProfitTargetMasked ||
                  !account.hasProfitTarget ||
                  account.profitTarget <= 0 ||
                  calculatedMetrics.profitTargetProgress <= 0
                }
                style={cssVars({
                  '--journalit-account-progress-width':
                    !isProfitTargetMasked &&
                    account.hasProfitTarget &&
                    account.profitTarget > 0
                      ? `${calculatedMetrics.profitTargetProgress}%`
                      : '0%',
                })}
              />
            </div>
          </div>

          
          <div
            className={`progress-item ${!(account.drawdownType !== DrawdownType.NONE && account.drawdownAmount > 0) ? 'not-set' : ''}`}
          >
            <div className="progress-header">
              <div className="progress-label-with-badge">
                <span className="progress-label">
                  {t('account-card.progress.drawdown-used')}
                </span>
                {calculatedMetrics.drawdownStatus && !isDrawdownMasked && (
                  <span
                    className={`dashboard-status-badge ${calculatedMetrics.drawdownStatus === 'BREACHED' ? 'breached' : 'in-progress'}`}
                  >
                    {calculatedMetrics.drawdownStatus === 'BREACHED'
                      ? t('account-card.status.breached')
                      : t('account-card.status.in-progress')}
                  </span>
                )}
              </div>
              <div
                className={`progress-value ${!(account.drawdownType !== DrawdownType.NONE && account.drawdownAmount > 0) ? 'not-set' : ''}`}
              >
                {account.drawdownType !== DrawdownType.NONE &&
                account.drawdownAmount > 0
                  ? formatValue({
                      kind: 'percentage',
                      value: calculatedMetrics.drawdownUsed,
                      signed: false,
                      precision: 1,
                    })
                  : t('account-card.progress.not-set')}
              </div>
            </div>
            <div className="progress-bar-container">
              <div
                className={`progress-bar ${!isDrawdownMasked && account.drawdownType !== DrawdownType.NONE && account.drawdownAmount > 0 && calculatedMetrics.drawdownUsed > 0 ? `drawdown ${calculatedMetrics.drawdownProgressClass}` : 'empty'}`}
                data-is-zero={
                  isDrawdownMasked ||
                  account.drawdownType === DrawdownType.NONE ||
                  account.drawdownAmount <= 0 ||
                  calculatedMetrics.drawdownUsed <= 0
                }
                style={cssVars({
                  '--journalit-account-progress-width':
                    !isDrawdownMasked &&
                    account.drawdownType !== DrawdownType.NONE &&
                    account.drawdownAmount > 0
                      ? `${calculatedMetrics.drawdownUsed}%`
                      : '0%',
                })}
              />
            </div>
          </div>
        </div>

        <AccountCardFooter
          account={account}
          currency={currency}
          metrics={calculatedMetrics}
          formatValue={formatValue}
        />
      </div>
    </div>
  );
};



const areEqual = (prevProps: AccountCardProps, nextProps: AccountCardProps) => {
  return (
    prevProps.account.id === nextProps.account.id &&
    prevProps.account.name === nextProps.account.name &&
    prevProps.account.accountType === nextProps.account.accountType &&
    prevProps.account.currentBalance === nextProps.account.currentBalance &&
    prevProps.account.initialBalance === nextProps.account.initialBalance &&
    prevProps.account.metrics.totalTrades ===
      nextProps.account.metrics.totalTrades &&
    prevProps.account.metrics.totalPnL === nextProps.account.metrics.totalPnL &&
    prevProps.account.metrics.maxDrawdown ===
      nextProps.account.metrics.maxDrawdown &&
    prevProps.account.profitTarget === nextProps.account.profitTarget &&
    prevProps.account.hasProfitTarget === nextProps.account.hasProfitTarget &&
    prevProps.account.drawdownType === nextProps.account.drawdownType &&
    prevProps.account.drawdownAmount === nextProps.account.drawdownAmount &&
    prevProps.account.currentDrawdownSnapshot?.drawdownLimit ===
      nextProps.account.currentDrawdownSnapshot?.drawdownLimit &&
    prevProps.account.createdDate === nextProps.account.createdDate &&
    prevProps.account.lastUpdated.getTime() ===
      nextProps.account.lastUpdated.getTime() &&
    haveSameRelevantTransactions(
      prevProps.account.transactions,
      nextProps.account.transactions
    ) &&
    prevProps.account.monthlyCost === nextProps.account.monthlyCost &&
    prevProps.onClick === nextProps.onClick
  );
};

export const AccountCard = React.memo(AccountCardComponent, areEqual);
