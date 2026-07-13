

import React, { useMemo, useCallback, useState } from 'react';
import {
  SquarePen,
  Plus,
  AlertTriangle,
  Wrench,
  ScanSearch,
} from '../../shared/icons/ObsidianIcon';
import { Notice } from 'obsidian';
import { useAccountPageData } from '../context/AccountPageDataContext';
import { usePlugin } from '../../../hooks/usePlugin';
import { Button } from '../../ui/Button';
import { IconButton } from '../../ui/IconButton';
import { openEditAccountModal } from './EditAccountModal';
import { openAddEventModal } from './AddEventModal';
import { useCurrency } from '../../../contexts/CurrencyContext';
import { parseCuratedCurrencyCode } from '../../../utils/currencyConfig';
import { MoneyValue } from '../../shared/display';
import { AccountTradeData } from '../../../services/accountPage/types';
import { t, tPlural } from '../../../lang/helpers';
import { useGuideTarget } from '../../../guides/GuideRuntimeLayer';
import {
  ACCOUNT_PAGE_ADD_EVENT_BUTTON_TARGET_ID,
  ACCOUNT_PAGE_EDIT_ACCOUNT_BUTTON_TARGET_ID,
  ACCOUNT_PAGE_HEADER_TARGET_ID,
  ACCOUNT_PAGE_VIEW_TRADES_BUTTON_TARGET_ID,
} from '../../../guides/accountPageGuideIds';
import { openTradeLogWithFilters } from '../../../utils/openTradeLogWithFilters';


function findEarliestTradeDate(trades: AccountTradeData[]): Date | null {
  if (trades.length === 0) return null;

  let earliest: Date | null = null;

  for (const trade of trades) {
    const tradeDate =
      trade.entryTime instanceof Date
        ? trade.entryTime
        : new Date(trade.entryTime);

    
    if (isNaN(tradeDate.getTime())) continue;

    if (!earliest || tradeDate < earliest) {
      earliest = tradeDate;
    }
  }

  return earliest;
}


export const AccountHeader: React.FC = () => {
  const { accountPageData, refreshData } = useAccountPageData();
  const { currency: globalCurrency } = useCurrency();
  const plugin = usePlugin();

  
  const currency =
    accountPageData?.metrics.isMultiCurrency &&
    accountPageData?.metrics.conversionBaseCurrency
      ? parseCuratedCurrencyCode(accountPageData.metrics.conversionBaseCurrency)
      : accountPageData?.account.currency || globalCurrency;
  const [isFixingDate, setIsFixingDate] = useState(false);
  const registerHeaderTarget = useGuideTarget(ACCOUNT_PAGE_HEADER_TARGET_ID);
  const registerAddEventButtonTarget = useGuideTarget(
    ACCOUNT_PAGE_ADD_EVENT_BUTTON_TARGET_ID
  );
  const registerEditAccountButtonTarget = useGuideTarget(
    ACCOUNT_PAGE_EDIT_ACCOUNT_BUTTON_TARGET_ID
  );
  const registerTradeLogButtonTarget = useGuideTarget(
    ACCOUNT_PAGE_VIEW_TRADES_BUTTON_TARGET_ID
  );

  
  const dateWarning = useMemo(() => {
    if (!accountPageData?.trades || accountPageData.trades.length === 0) {
      return null;
    }

    const earliestTradeDate = findEarliestTradeDate(accountPageData.trades);
    if (!earliestTradeDate) return null;

    const createdDate =
      accountPageData.account.createdDate instanceof Date
        ? accountPageData.account.createdDate
        : new Date(accountPageData.account.createdDate);

    
    const earliestDateNormalized = new Date(earliestTradeDate);
    earliestDateNormalized.setHours(0, 0, 0, 0);

    const createdDateNormalized = new Date(createdDate);
    createdDateNormalized.setHours(0, 0, 0, 0);

    if (earliestDateNormalized < createdDateNormalized) {
      
      const suggestedDate = new Date(earliestDateNormalized);
      suggestedDate.setDate(suggestedDate.getDate() - 1);

      return {
        earliestTradeDate: earliestDateNormalized,
        suggestedDate,
        tradesBeforeCreation: accountPageData.trades.filter((trade) => {
          const tradeDate =
            trade.entryTime instanceof Date
              ? trade.entryTime
              : new Date(trade.entryTime);
          if (isNaN(tradeDate.getTime())) return false;
          const normalized = new Date(tradeDate);
          normalized.setHours(0, 0, 0, 0);
          return normalized < createdDateNormalized;
        }).length,
      };
    }

    return null;
  }, [accountPageData]);

  
  const handleFixCreatedDate = useCallback(async () => {
    if (!dateWarning || !plugin?.accountPageService || !accountPageData) return;

    setIsFixingDate(true);
    try {
      await plugin.accountPageService.updateAccountMetadata(
        accountPageData.account.name,
        {
          createdDate: dateWarning.suggestedDate,
        }
      );

      new Notice(
        t('account.header.notice.date-updated', {
          date: dateWarning.suggestedDate.toLocaleDateString(),
        })
      );
      await refreshData();
    } catch (error) {
      console.error(t('account.header.notice.update-failed-log'), error);
      new Notice(
        t('account.header.notice.update-failed', {
          error:
            error instanceof Error ? error.message : t('common.unknown-error'),
        })
      );
    } finally {
      setIsFixingDate(false);
    }
  }, [dateWarning, plugin, accountPageData, refreshData]);

  if (!accountPageData || !plugin) {
    return null;
  }

  const { account } = accountPageData;

  const handleEditAccount = () => {
    openEditAccountModal(
      plugin.app,
      plugin,
      account,
      () => void refreshData() 
    );
  };

  const handleAddEvent = () => {
    openAddEventModal(
      plugin.app,
      plugin,
      account.name,
      () => void refreshData() 
    );
  };

  const handleViewTrades = async () => {
    await openTradeLogWithFilters(plugin, { accounts: [account.name] });
  };

  return (
    <div className="account-page-header" ref={registerHeaderTarget}>
      <div className="account-header-main">
        <h2>{t('account.header.title', { name: account.name })}</h2>
        <div className="header-buttons">
          <div ref={registerTradeLogButtonTarget}>
            <IconButton
              onClick={() => void handleViewTrades()}
              variant="toolbar"
              className="view-trades-btn"
              ariaLabel={t('account.header.view-trades.aria')}
            >
              <ScanSearch size={16} />
            </IconButton>
          </div>
          <div ref={registerAddEventButtonTarget}>
            <IconButton
              onClick={() => void handleAddEvent()}
              variant="toolbar"
              className="add-event-btn"
              ariaLabel={t('account.header.add-event.aria')}
            >
              <Plus size={16} />
            </IconButton>
          </div>
          <div ref={registerEditAccountButtonTarget}>
            <IconButton
              onClick={() => void handleEditAccount()}
              variant="toolbar"
              className="edit-account-btn"
              ariaLabel={t('account.header.edit-account.aria')}
            >
              <SquarePen size={16} />
            </IconButton>
          </div>
        </div>
      </div>

      <div className="account-info">
        <div className="account-info-item">
          <span className="info-label">{t('account.header.type')}</span>
          <span className="info-value">
            {account.accountType || t('common.na')}
          </span>
        </div>
        <div className="account-info-item">
          <span className="info-label">
            {t('account.header.initial-balance')}
          </span>
          <span className="info-value">
            <MoneyValue
              kind="balance"
              value={account.initialBalance ?? 0}
              currencyCode={currency}
              tone="none"
            />
          </span>
        </div>
        <div className="account-info-item">
          <span className="info-label">
            {t('account.header.current-balance')}
          </span>
          <span className="info-value">
            <MoneyValue
              kind="balance"
              value={account.currentBalance ?? 0}
              currencyCode={currency}
              tone="none"
            />
          </span>
        </div>
        {account.accountId && (
          <div className="account-info-item">
            <span className="info-label">{t('account.header.account-id')}</span>
            <span className="info-value">{account.accountId}</span>
          </div>
        )}
      </div>

      
      {dateWarning && (
        <div className="account-date-warning">
          <AlertTriangle size={20} className="account-date-warning__icon" />
          <div className="account-date-warning__content">
            <div className="account-date-warning__title">
              {tPlural(
                'account.header.warning.trades-before-creation',
                dateWarning.tradesBeforeCreation
              )}
            </div>
            <div className="account-date-warning__desc">
              {t('account.header.warning.earliest-trade', {
                date: dateWarning.earliestTradeDate.toLocaleDateString(),
              })}
            </div>
          </div>
          <Button
            onClick={() => void handleFixCreatedDate()}
            variant="secondary"
            size="sm"
            disabled={isFixingDate}
            aria-label={t('account.header.warning.fix-date.aria')}
            className={`account-date-warning__button ${isFixingDate ? 'is-loading' : ''}`}
          >
            <Wrench size={14} />
            {isFixingDate
              ? t('account.header.warning.fixing')
              : t('account.header.warning.fix-date')}
          </Button>
        </div>
      )}
    </div>
  );
};
