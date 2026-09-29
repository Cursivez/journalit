

import React from 'react';
import { DEFAULT_PRIVACY_MASK } from '../../../constants';
import { useAccountPageData } from '../context/AccountPageDataContext';
import { usePlugin } from '../../../hooks/usePlugin';
import {
  AccountTransaction,
  TransactionType,
} from '../../../services/account/types';
import { resolvePropChallengePayoutPhaseAt } from '../../../services/propChallenge/PropChallengeConfig';
import {
  doesPhaseOwnTransaction,
  propChallengePhaseBalancesAfter,
} from '../../../services/propChallenge/PropChallengeRuleEngine';
import type { AccountTradeData } from '../../../services/accountPage/types';
import { openEditEventModal } from './EditEventModal';
import {
  formatDateDisplay,
  getUserDateFormat,
  safeParseDateValue,
} from '../../../utils/dateUtils';
import { useCurrency } from '../../../contexts/CurrencyContext';
import { t } from '../../../lang/helpers';
import { useDisplayFormatter } from '../../../hooks/useDisplayPolicy';
import { useGuideTarget } from '../../../guides/GuideRuntimeLayer';
import { ACCOUNT_PAGE_TRANSACTIONS_SECTION_TARGET_ID } from '../../../guides/accountPageGuideIds';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  HandCoins,
} from '../../shared/icons/ObsidianIcon';


const EMPTY_TRADES_BY_PATH: ReadonlyMap<string, AccountTradeData> = new Map();


const LedgerRow: React.FC<{
  transaction: AccountTransaction;
  accountName: string;
  currency: string;
  payoutNumber: number | undefined;
  
  balanceAfter: number;
  onUpdate: () => void;
}> = ({
  transaction,
  accountName,
  currency,
  payoutNumber,
  balanceAfter,
  onUpdate,
}) => {
  const plugin = usePlugin();
  const { formatValue, shouldMask } = useDisplayFormatter();

  const isMoneyMasked = shouldMask('money');
  
  
  
  const isDeposit =
    transaction.type === TransactionType.DEPOSIT && transaction.amount >= 0;
  
  
  const isPayout = payoutNumber !== undefined;

  const openTransactionEditor = () => {
    if (!plugin) return;
    openEditEventModal(plugin.app, plugin, accountName, transaction, onUpdate);
  };

  const amountText = formatValue({
    kind: 'money',
    value: Math.abs(transaction.amount),
    currencyCode: currency,
    signed: false,
  });

  const tone = isMoneyMasked
    ? 'neutral'
    : isPayout
      ? 'payout'
      : isDeposit
        ? 'deposit'
        : 'withdrawal';
  const amountSign = isMoneyMasked || isPayout ? '' : isDeposit ? '+' : '−';
  const dateText = formatDateDisplay(transaction.date, getUserDateFormat());

  return (
    <tr
      className="journalit-account-ledger-row"
      
      
      onClick={openTransactionEditor}
    >
      <td className="journalit-account-ledger-cell-date">
        <button
          type="button"
          className="journalit-account-ledger-edit"
          aria-label={t('account.transaction.edit-row-label', {
            date: dateText,
            amount: `${amountSign}${amountText}`,
          })}
        >
          {dateText}
        </button>
      </td>
      <td className="journalit-account-ledger-cell-type">
        {isPayout && !isMoneyMasked ? (
          <span
            className={`journalit-account-ledger-type journalit-account-ledger-type-${tone}`}
          >
            <HandCoins size={13} />
            {`#${payoutNumber}`}
          </span>
        ) : (
          <span
            className={`journalit-account-ledger-type journalit-account-ledger-type-${tone}`}
          >
            {isMoneyMasked ? (
              <ArrowUpDown size={13} />
            ) : isDeposit ? (
              <ArrowDown size={13} />
            ) : (
              <ArrowUp size={13} />
            )}
            {isMoneyMasked
              ? DEFAULT_PRIVACY_MASK
              : isDeposit
                ? t('account.transaction.deposit')
                : t('account.transaction.withdrawal')}
          </span>
        )}
      </td>
      <td className="journalit-account-ledger-cell-description">
        {transaction.description}
      </td>
      <td
        className={`journalit-account-ledger-cell-amount journalit-account-ledger-amount-${tone}`}
      >
        {`${amountSign}${amountText}`}
      </td>
      <td className="journalit-account-ledger-cell-balance">
        {formatValue({
          kind: 'balance',
          value: balanceAfter,
          currencyCode: currency,
          signed: false,
        })}
      </td>
    </tr>
  );
};


export const DepositsWithdrawalsSection: React.FC = () => {
  const { accountPageData, refreshData, selectedPhaseId } =
    useAccountPageData();
  const plugin = usePlugin();
  const { currency: globalCurrency } = useCurrency();
  const { formatValue, shouldMask } = useDisplayFormatter();
  const registerTransactionsSectionTarget = useGuideTarget(
    ACCOUNT_PAGE_TRANSACTIONS_SECTION_TARGET_ID
  );

  if (!accountPageData || !plugin) {
    return null;
  }

  const { account } = accountPageData;
  const isProp = account.propChallenge !== undefined;
  const currency = account.currency || globalCurrency;

  
  
  
  const phaseWindow =
    selectedPhaseId && account.propChallenge
      ? account.propChallenge.phases.find(
          (phase) => phase.id === selectedPhaseId
        )
      : undefined;
  const phaseStart = phaseWindow?.startedAt
    ? new Date(phaseWindow.startedAt).getTime()
    : undefined;
  
  
  const ledgerEvaluatedAt = new Date();
  const manualTransactions = (account.transactions || []).filter(
    (transaction) => {
      if (
        (transaction.type !== TransactionType.DEPOSIT &&
          transaction.type !== TransactionType.WITHDRAWAL) ||
        transaction.description === 'Initial deposit'
      ) {
        return false;
      }
      if (!phaseWindow || !account.propChallenge) return true;
      
      
      
      if (phaseStart === undefined) return false;
      
      
      
      
      
      return doesPhaseOwnTransaction(
        transaction,
        account.propChallenge.phases,
        phaseWindow,
        EMPTY_TRADES_BY_PATH,
        ledgerEvaluatedAt
      );
    }
  );

  
  
  
  
  const phaseBalances =
    phaseWindow && phaseStart !== undefined && account.propChallenge
      ? propChallengePhaseBalancesAfter({
          phase: phaseWindow,
          config: account.propChallenge,
          trades: accountPageData.trades,
          transactions: account.transactions,
          now: ledgerEvaluatedAt,
        })
      : undefined;

  
  
  
  const datedTransactions: {
    transaction: (typeof manualTransactions)[number];
    index: number;
  }[] = [];
  for (let index = 0; index < manualTransactions.length; index++) {
    const transaction = manualTransactions[index];
    if (transaction && transaction.date) {
      datedTransactions.push({ transaction, index });
    }
  }
  datedTransactions.sort(
    (a, b) =>
      (safeParseDateValue(a.transaction.date)?.getTime() || 0) -
        (safeParseDateValue(b.transaction.date)?.getTime() || 0) ||
      a.index - b.index
  );
  const chronological = datedTransactions.map((entry) => entry.transaction);

  
  
  const payoutNumbers = new Map<AccountTransaction, number>();
  for (const transaction of chronological) {
    if (transaction.type !== TransactionType.WITHDRAWAL) continue;
    const challenge = account.propChallenge;
    if (!challenge) continue;
    const date = safeParseDateValue(transaction.date);
    if (!date) continue;
    if (resolvePropChallengePayoutPhaseAt(challenge, date)) {
      payoutNumbers.set(transaction, payoutNumbers.size + 1);
    }
  }
  const payouts = [...payoutNumbers.keys()];

  const sortedTransactions = [...chronological].reverse();

  
  
  const readsAsPayouts =
    isProp && (payouts.length > 0 || sortedTransactions.length === 0);

  const formatMoney = (value: number): string =>
    formatValue({
      kind: 'money',
      value: Math.abs(value),
      currencyCode: currency,
      signed: false,
    });

  const renderSummary = (): string => {
    if (readsAsPayouts) {
      
      
      if (shouldMask('money')) return t('account.payouts.summary-masked');
      const total = payouts.reduce(
        (sum, transaction) => sum + Math.abs(transaction.amount),
        0
      );
      const params = {
        count: String(payouts.length),
        total: formatMoney(total),
        date: formatDateDisplay(
          payouts[payouts.length - 1].date,
          getUserDateFormat()
        ),
      };
      return payouts.length === 1
        ? t('account.payouts.summary-one', params)
        : t('account.payouts.summary', params);
    }

    
    
    
    const movesOut = (transaction: AccountTransaction): boolean =>
      transaction.type === TransactionType.WITHDRAWAL || transaction.amount < 0;
    const deposited = sortedTransactions
      .filter((transaction) => !movesOut(transaction))
      .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);
    const withdrawn = sortedTransactions
      .filter(movesOut)
      .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);

    return t('account.deposits-withdrawals.summary', {
      deposits: formatMoney(deposited),
      withdrawn: formatMoney(withdrawn),
      date: formatDateDisplay(sortedTransactions[0].date, getUserDateFormat()),
    });
  };

  return (
    <div
      className="deposits-withdrawals-section"
      ref={registerTransactionsSectionTarget}
    >
      <div className="journalit-account-ledger-header">
        <h3 className="journalit-account-ledger-title">
          {readsAsPayouts
            ? t('account.payouts.title')
            : t('account.deposits-withdrawals.title')}
        </h3>
        {sortedTransactions.length > 0 && (
          <span className="journalit-account-ledger-summary">
            {renderSummary()}
          </span>
        )}
      </div>

      {sortedTransactions.length === 0 ? (
        <p className="journalit-account-ledger-empty">
          {readsAsPayouts ? (
            <HandCoins className="journalit-account-ledger-empty-icon" />
          ) : (
            <ArrowUpDown className="journalit-account-ledger-empty-icon" />
          )}
          <span>
            {readsAsPayouts
              ? t('account.payouts.empty')
              : t('account.deposits-withdrawals.empty')}
          </span>
          <span className="journalit-account-ledger-empty-hint">
            {readsAsPayouts
              ? t('account.payouts.empty-sub')
              : t('account.deposits-withdrawals.empty-sub')}
          </span>
        </p>
      ) : (
        <table className="journalit-account-ledger">
          <thead>
            <tr>
              <th className="journalit-account-ledger-cell-date">
                {t('account.ledger.column.date')}
              </th>
              <th className="journalit-account-ledger-cell-type">
                {readsAsPayouts
                  ? t('account.ledger.column.payout')
                  : t('account.ledger.column.type')}
              </th>
              <th className="journalit-account-ledger-cell-description">
                {t('account.ledger.column.description')}
              </th>
              <th className="journalit-account-ledger-cell-amount">
                {t('account.ledger.column.amount')}
              </th>
              <th className="journalit-account-ledger-cell-balance">
                {t('account.ledger.column.balance-after')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedTransactions.map((transaction) => (
              <LedgerRow
                key={transaction.id}
                transaction={transaction}
                accountName={account.name}
                currency={currency}
                payoutNumber={
                  isProp ? payoutNumbers.get(transaction) : undefined
                }
                balanceAfter={
                  phaseBalances?.get(transaction) ?? transaction.balanceAfter
                }
                onUpdate={() => void refreshData()}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
