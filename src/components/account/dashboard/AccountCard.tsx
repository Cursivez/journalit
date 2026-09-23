

import React, { useMemo } from 'react';
import { t } from '../../../lang/helpers';
import { cssVars } from '../../../styles/inlineStylePolicy';
import {
  calculateDrawdownUsed,
  calculateProfitTargetProgress,
  calculateAccountGrowthAmount,
  calculateAccountGrowthPercent,
  haveSameRelevantTransactions,
} from './utils';
import {
  AccountCardFooter,
  AccountKeyMetrics,
  calculateAccountCardDetailMetrics,
} from './AccountCardDetails';
import { AccountCopyBadges, useCopiedByAccounts } from './AccountCopyBadges';
import { AccountCardProps } from './types';
import { AccountData, DrawdownType } from '../../../services/account/types';
import { useCurrency } from '../../../contexts/CurrencyContext';
import { useDisplayFormatter } from '../../../hooks/useDisplayPolicy';
import { parseCuratedCurrencyCode } from '../../../utils/currencyConfig';
import { PropChallengeAccountCard } from './PropChallengeAccountCard';
import { applyPropChallengeRuleProjection } from '../../../services/propChallenge/PropChallengeRuleProjection';

type FormatDisplayValue = ReturnType<typeof useDisplayFormatter>['formatValue'];
type AccountCardMetrics = ReturnType<typeof calculateAccountCardMetrics>;

function calculateAccountCardMetrics(account: AccountData) {
  const detailMetrics = calculateAccountCardDetailMetrics(account);
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

  return {
    ...detailMetrics,
    growthAmount,
    growthPercent,
    profitTargetProgress,
    profitTargetProgressClass,
    drawdownUsed,
    drawdownProgressClass,
  };
}

function AccountCardHeader({
  account,
  currency,
  metrics,
  growthClass,
  formatValue,
  copiedByAccounts,
  onOpen,
}: {
  account: AccountData;
  currency: string;
  metrics: AccountCardMetrics;
  growthClass: string;
  formatValue: FormatDisplayValue;
  copiedByAccounts: Array<{ account: string; multiplier: number }>;
  onOpen: () => void;
}) {
  return (
    <div className="account-card-header">
      <div className="account-identity">
        
        <button
          type="button"
          className="account-name journalit-account-card-name"
          onClick={(event) => {
            event.stopPropagation();
            onOpen();
          }}
        >
          {account.name}
        </button>
        <AccountCopyBadges
          account={account}
          copiedByAccounts={copiedByAccounts}
          leading={
            <div className="account-type-badge">{account.accountType}</div>
          }
        />
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


const RegularAccountCard: React.FC<{
  account: AccountData;
  onClick: () => void;
}> = ({ account: sourceAccount, onClick }) => {
  
  
  
  
  const account = useMemo(
    () => applyPropChallengeRuleProjection(sourceAccount),
    [sourceAccount]
  );
  const { currency: globalCurrency } = useCurrency();
  const { formatValue, shouldMask } = useDisplayFormatter();

  
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

  const copiedByAccounts = useCopiedByAccounts(account.name);

  const growthClass = isPnlMasked
    ? ''
    : calculatedMetrics.growthAmount >= 0
      ? 'positive'
      : 'negative';

  return (
    
    
    <div className="account-card" onClick={onClick}>
      <AccountCardHeader
        account={account}
        currency={currency}
        metrics={calculatedMetrics}
        growthClass={growthClass}
        formatValue={formatValue}
        copiedByAccounts={copiedByAccounts}
        onOpen={onClick}
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
              <span className="progress-label">
                {t('account.prop-challenge.rule.profit_target')}
              </span>
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
              <span className="progress-label">
                {t('account.prop-challenge.rule.drawdown')}
              </span>
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

const AccountCardComponent: React.FC<AccountCardProps> = ({
  account,
  propChallengeData,
  tradingDayCutoffTime,
  onClick,
}) =>
  propChallengeData ? (
    <PropChallengeAccountCard
      data={propChallengeData}
      tradingDayCutoffTime={tradingDayCutoffTime}
      onClick={onClick}
    />
  ) : (
    <RegularAccountCard account={account} onClick={onClick} />
  );



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
    prevProps.propChallengeData === nextProps.propChallengeData &&
    prevProps.tradingDayCutoffTime === nextProps.tradingDayCutoffTime &&
    prevProps.onClick === nextProps.onClick
  );
};

export const AccountCard = React.memo(AccountCardComponent, areEqual);
