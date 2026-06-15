

import React from 'react';
import { useAccountPageData } from '../context/AccountPageDataContext';
import { usePlugin } from '../../../hooks/usePlugin';
import { EmptyState } from '../../shared/EmptyState';
import {
  AccountTransaction,
  TransactionType,
} from '../../../services/account/types';
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


const TransactionItem: React.FC<{
  transaction: AccountTransaction;
  accountName: string;
  onUpdate: () => void;
}> = ({ transaction, accountName, onUpdate }) => {
  const plugin = usePlugin();
  const { accountPageData } = useAccountPageData();
  const { currency: globalCurrency } = useCurrency();
  const { formatValue, shouldMask } = useDisplayFormatter();

  
  const currency = accountPageData?.account.currency || globalCurrency;
  const isMoneyMasked = shouldMask('money');

  const userDateFormat = getUserDateFormat();

  const formatCurrencyValue = (value: number): string =>
    formatValue({
      kind: 'money',
      value: Math.abs(value),
      currencyCode: currency,
      signed: false,
    });

  const formatBalanceAfter = (balance: number): string =>
    formatValue({
      kind: 'balance',
      value: balance,
      currencyCode: currency,
      signed: false,
    });

  const openTransactionEditor = async () => {
    if (!plugin) return;

    openEditEventModal(plugin.app, plugin, accountName, transaction, onUpdate);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      void openTransactionEditor();
    }
  };

  const isDeposit = transaction.type === TransactionType.DEPOSIT;
  const typeText = isDeposit
    ? t('account.transaction.deposit')
    : t('account.transaction.withdrawal');
  const typeClass = isMoneyMasked
    ? 'neutral'
    : isDeposit
      ? 'deposit'
      : 'withdrawal';

  return (
    <div
      className={`transaction-item ${typeClass} clickable`}
      onClick={() => void openTransactionEditor()}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={t('account.transaction.click-to-edit')}
    >
      <div className="transaction-header">
        <div className="transaction-primary-info">
          <span className={`transaction-type ${typeClass}`}>{typeText}</span>
          <span className="transaction-date">
            {formatDateDisplay(
              transaction.date instanceof Date
                ? transaction.date
                : new Date(transaction.date),
              userDateFormat
            )}
          </span>
        </div>
        <span
          className={`transaction-amount ${isMoneyMasked ? 'neutral' : isDeposit ? 'positive' : 'negative'}`}
        >
          {isMoneyMasked ? '' : isDeposit ? '+' : '-'}
          {formatCurrencyValue(transaction.amount)}
        </span>
      </div>

      <div className="transaction-details">
        {transaction.description && (
          <div className="transaction-description">
            <span className="description-label">
              {t('account.transaction.description')}:
            </span>
            <span className="description-text">{transaction.description}</span>
          </div>
        )}

        <div className="transaction-meta">
          <span className="balance-after">
            {t('account.transaction.balance-after')}:{' '}
            {formatBalanceAfter(transaction.balanceAfter)}
          </span>
        </div>
      </div>
    </div>
  );
};


export const DepositsWithdrawalsSection: React.FC = () => {
  const { accountPageData, refreshData } = useAccountPageData();
  const plugin = usePlugin();
  const registerTransactionsSectionTarget = useGuideTarget(
    ACCOUNT_PAGE_TRANSACTIONS_SECTION_TARGET_ID
  );

  if (!accountPageData || !plugin) {
    return null;
  }

  const { account } = accountPageData;

  
  const manualTransactions = (account.transactions || []).filter(
    (transaction) =>
      (transaction.type === TransactionType.DEPOSIT ||
        transaction.type === TransactionType.WITHDRAWAL) &&
      transaction.description !== 'Initial deposit'
  );

  
  const sortedTransactions = [...manualTransactions]
    .filter((t) => t && t.date) 
    .sort((a, b) => {
      
      const dateA = safeParseDateValue(a.date);
      const dateB = safeParseDateValue(b.date);
      return (dateB?.getTime() || 0) - (dateA?.getTime() || 0);
    });

  return (
    <div
      className="deposits-withdrawals-section"
      ref={registerTransactionsSectionTarget}
    >
      <div className="section-header-centered">
        <span className="section-header-line"></span>
        <h3 className="section-header-title">
          {t('account.deposits-withdrawals.title', {
            count: String(sortedTransactions.length),
          })}
        </h3>
        <span className="section-header-line"></span>
      </div>

      {sortedTransactions.length === 0 ? (
        <div className="empty-transactions">
          <EmptyState
            message={t('account.deposits-withdrawals.empty')}
            subMessage={t('account.deposits-withdrawals.empty-sub')}
          />
        </div>
      ) : (
        <div className="transactions-list">
          {sortedTransactions.map((transaction) => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              accountName={account.name}
              onUpdate={() => void refreshData()}
            />
          ))}
        </div>
      )}
    </div>
  );
};
