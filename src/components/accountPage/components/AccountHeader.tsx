

import React, { useMemo, useCallback, useState } from 'react';
import {
  SquarePen,
  Plus,
  AlertTriangle,
  MoveLeft,
  Wrench,
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
import { MoneyValue } from '../../shared/display/DisplayValue';
import { formatDateDisplay } from '../../../utils/dateUtils';
import { t, tPlural } from '../../../lang/helpers';
import { useGuideTarget } from '../../../guides/GuideRuntimeLayer';
import {
  ACCOUNT_PAGE_ADD_EVENT_BUTTON_TARGET_ID,
  ACCOUNT_PAGE_EDIT_ACCOUNT_BUTTON_TARGET_ID,
  ACCOUNT_PAGE_ACTIONS_TARGET_ID,
  ACCOUNT_PAGE_HEADER_TARGET_ID,
  ACCOUNT_PAGE_VIEW_TRADES_BUTTON_TARGET_ID,
} from '../../../guides/accountPageGuideIds';
import { PropChallengeProfileNotice } from './propChallenge/PropChallengeProfileNotice';
import { PropChallengeTransitionNotice } from './propChallenge/PropChallengeTransitionNotice';
import { AccountMergeLegacyNotice } from './accountMerge/AccountMergeLegacyNotice';
import { AccountTradeLogControl } from './AccountTradeLogControl';
import { PhaseSelector } from './propChallenge/PropChallengePhaseNav';
import type { PropChallengePhase } from '../../../services/propChallenge/types';
import { formatAccountTypeLabel } from '../../../utils/accountTypeLabel';
import { Tooltip } from '../../shared/Tooltip';
import { useDisplayFormatter } from '../../../hooks/useDisplayPolicy';
import { getActiveCopyTradingPeriod } from '../../../utils/accountCopyTrading';
import { useCopiedByAccounts } from '../../account/dashboard/AccountCopyBadges';
import type { PropChallengeCockpitState } from './propChallenge/usePropChallengeCockpitState';
import {
  rebasePropChallengeStart,
  resolvePhaseForTrade,
  tradeAttributionTimestamp,
} from '../../../services/propChallenge/PropChallengeConfig';
import { savePropChallengeConfig } from '../../../services/propChallenge/PropChallengePersistence';
import type { AccountData } from '../../../services/account/types';


function startOfDay(value: Date): Date {
  const day = new Date(value);
  day.setHours(0, 0, 0, 0);
  return day;
}

function toDate(value: Date | string): Date {
  return value instanceof Date ? value : new Date(value);
}

interface AccountDateWarningInfo {
  earliestTradeDate: Date;
  suggestedDate: Date;
  fixCreatedDate: boolean;
  rebasePhaseStart: boolean;
  tradesBeforeCreation: number;
  tradesLostFromChallenge: number;
}

function AccountHeaderMeta({
  account,
  currency,
  challenge,
  selectedPhase,
}: {
  account: AccountData;
  currency: string;
  challenge?: AccountData['propChallenge'];
  
  selectedPhase?: PropChallengePhase;
}) {
  
  
  const activeCopyPeriod = getActiveCopyTradingPeriod(account);
  const copiedByAccounts = useCopiedByAccounts(account.name);
  
  
  
  const { shouldMask } = useDisplayFormatter();
  const copySizeMasked = shouldMask('positionSize');

  return (
    <div className="journalit-account-identity-meta">
      <span className="journalit-account-identity-meta-item">
        <span className="journalit-account-identity-meta-label">
          {t('account.header.type')}
        </span>
        <span className="journalit-account-identity-meta-value">
          {account.accountType
            ? formatAccountTypeLabel(account.accountType)
            : t('common.na')}
        </span>
      </span>
      <span className="journalit-account-identity-meta-item">
        <span className="journalit-account-identity-meta-label">
          {t('account.header.initial-balance')}
        </span>
        <span className="journalit-account-identity-meta-value">
          <MoneyValue
            kind="balance"
            
            
            
            
            value={
              selectedPhase?.startingBalance ?? account.initialBalance ?? 0
            }
            currencyCode={currency}
            tone="none"
          />
        </span>
      </span>
      {account.accountId && (
        <span className="journalit-account-identity-meta-item">
          <span className="journalit-account-identity-meta-label">
            {t('account.header.account-id')}
          </span>
          <span className="journalit-account-identity-meta-value">
            {account.accountId}
          </span>
        </span>
      )}
      <span className="journalit-account-identity-meta-item">
        <span className="journalit-account-identity-meta-label">
          {t('account.header.created')}
        </span>
        <span className="journalit-account-identity-meta-value">
          {formatDateDisplay(new Date(account.createdDate))}
        </span>
      </span>
      {activeCopyPeriod && (
        <span className="journalit-account-identity-meta-item">
          <span className="journalit-account-identity-meta-label">
            {t('account.header.copies')}
          </span>
          <span className="journalit-account-identity-meta-value">
            {copySizeMasked
              ? activeCopyPeriod.baseAccount
              : `${activeCopyPeriod.baseAccount} · ${activeCopyPeriod.multiplier}x`}
          </span>
        </span>
      )}
      {copiedByAccounts.length > 0 && (
        <span className="journalit-account-identity-meta-item">
          <span className="journalit-account-identity-meta-label">
            {t('account-dashboard.copy-badge.copied-by')}
          </span>
          <Tooltip
            content={
              <div className="account-copy-badge-tooltip">
                {copiedByAccounts.map((copyAccount) => (
                  <div
                    key={copyAccount.account}
                    className="account-copy-badge-tooltip-row"
                  >
                    <span>{copyAccount.account}</span>
                    {copySizeMasked ? null : (
                      <span>{copyAccount.multiplier}x</span>
                    )}
                  </div>
                ))}
              </div>
            }
            delay={0}
            preferredPosition="bottom"
          >
            <span className="journalit-account-identity-meta-value">
              {copiedByAccounts[0].account}
              {copiedByAccounts.length > 1
                ? ` ${t('account.header.copied-by-more', {
                    count: String(copiedByAccounts.length - 1),
                  })}`
                : ''}
            </span>
          </Tooltip>
        </span>
      )}
      {challenge?.firmName && (
        <span className="journalit-account-identity-meta-item">
          <span className="journalit-account-identity-meta-label">
            {t('account.prop-challenge.profile.firm')}
          </span>
          <span className="journalit-account-identity-meta-value">
            {challenge.firmName}
          </span>
        </span>
      )}
      {challenge?.challengeName.trim() && (
        <span className="journalit-account-identity-meta-item">
          <span className="journalit-account-identity-meta-label">
            {t('account.prop-challenge.profile.challenge')}
          </span>
          <span className="journalit-account-identity-meta-value">
            {challenge.challengeName}
          </span>
        </span>
      )}
    </div>
  );
}

function AccountDateWarningBanner({
  dateWarning,
  isFixingDate,
  onFix,
}: {
  dateWarning: AccountDateWarningInfo;
  isFixingDate: boolean;
  onFix: () => void;
}) {
  return (
    <div className="account-date-warning">
      <AlertTriangle size={20} className="account-date-warning__icon" />
      <div className="account-date-warning__content">
        {dateWarning.tradesBeforeCreation > 0 && (
          <div className="account-date-warning__title">
            {tPlural(
              'account.header.warning.trades-before-creation',
              dateWarning.tradesBeforeCreation
            )}
          </div>
        )}
        {dateWarning.tradesLostFromChallenge > 0 && (
          <div className="account-date-warning__title">
            {tPlural(
              'account.header.warning.trades-before-phase',
              dateWarning.tradesLostFromChallenge
            )}
          </div>
        )}
        <div className="account-date-warning__desc">
          {t(
            dateWarning.fixCreatedDate
              ? 'account.header.warning.earliest-trade'
              : 'account.header.warning.earliest-trade-phase',
            {
              date: dateWarning.earliestTradeDate.toLocaleDateString(),
            }
          )}
        </div>
      </div>
      <Button
        onClick={() => void onFix()}
        variant="secondary"
        size="sm"
        disabled={isFixingDate}
        aria-label={t(
          dateWarning.fixCreatedDate
            ? 'account.header.warning.fix-date.aria'
            : 'account.header.warning.fix-phase-start.aria'
        )}
        className={`account-date-warning__button ${isFixingDate ? 'is-loading' : ''}`}
      >
        <Wrench size={14} />
        {isFixingDate
          ? t('account.header.warning.fixing')
          : t('account.header.warning.fix-date')}
      </Button>
    </div>
  );
}


export const AccountHeader: React.FC<{
  cockpitState?: PropChallengeCockpitState | null;
}> = ({ cockpitState = null }) => {
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
  const registerActionsTarget = useGuideTarget(ACCOUNT_PAGE_ACTIONS_TARGET_ID);
  const registerAddEventButtonTarget = useGuideTarget(
    ACCOUNT_PAGE_ADD_EVENT_BUTTON_TARGET_ID
  );
  const registerEditAccountButtonTarget = useGuideTarget(
    ACCOUNT_PAGE_EDIT_ACCOUNT_BUTTON_TARGET_ID
  );
  const registerTradeLogButtonTarget = useGuideTarget(
    ACCOUNT_PAGE_VIEW_TRADES_BUTTON_TARGET_ID
  );

  
  
  
  
  const dateWarning = useMemo((): AccountDateWarningInfo | null => {
    if (!accountPageData || accountPageData.trades.length === 0) return null;

    const now = new Date();
    const createdDay = startOfDay(toDate(accountPageData.account.createdDate));
    const challenge = accountPageData.account.propChallenge;
    const phaseStart = challenge?.phases[0]?.startedAt
      ? Date.parse(challenge.phases[0].startedAt)
      : Number.NaN;

    let earliest: Date | null = null;
    let tradesBeforeCreation = 0;
    let tradesLostFromChallenge = 0;

    for (const trade of accountPageData.trades) {
      const entry = toDate(trade.entryTime);
      if (isNaN(entry.getTime())) continue;

      const beforeCreation = startOfDay(entry) < createdDay;
      const lostFromChallenge =
        challenge !== undefined &&
        Number.isFinite(phaseStart) &&
        (tradeAttributionTimestamp(trade) ?? entry.getTime()) < phaseStart &&
        resolvePhaseForTrade(challenge, trade, now) === undefined;
      if (!beforeCreation && !lostFromChallenge) continue;

      if (beforeCreation) tradesBeforeCreation += 1;
      if (lostFromChallenge) tradesLostFromChallenge += 1;
      if (!earliest || entry < earliest) earliest = entry;
    }

    if (!earliest) return null;

    const earliestTradeDate = startOfDay(earliest);
    
    const suggestedDate = new Date(earliestTradeDate);
    suggestedDate.setDate(suggestedDate.getDate() - 1);

    return {
      earliestTradeDate,
      suggestedDate,
      fixCreatedDate: tradesBeforeCreation > 0,
      rebasePhaseStart: tradesLostFromChallenge > 0,
      tradesBeforeCreation,
      tradesLostFromChallenge,
    };
  }, [accountPageData]);

  
  
  const handleFixCreatedDate = useCallback(async () => {
    if (!dateWarning || !plugin?.accountPageService || !accountPageData) return;

    setIsFixingDate(true);
    try {
      const createdDate = dateWarning.fixCreatedDate
        ? dateWarning.suggestedDate
        : undefined;
      const challengeConfig = accountPageData.account.propChallenge;
      const rebased =
        dateWarning.rebasePhaseStart && challengeConfig
          ? rebasePropChallengeStart(challengeConfig, dateWarning.suggestedDate)
          : undefined;

      if (rebased && challengeConfig && rebased !== challengeConfig) {
        await savePropChallengeConfig({
          accountPageService: plugin.accountPageService,
          accountName: accountPageData.account.name,
          accountId: accountPageData.account.id,
          config: rebased,
          createdDate,
          expectedConfig: challengeConfig,
        });
        new Notice(
          t('account.header.notice.phase-start-updated', {
            date: dateWarning.suggestedDate.toLocaleDateString(),
          })
        );
      } else if (createdDate) {
        await plugin.accountPageService.updateAccountMetadata(
          accountPageData.account.name,
          { createdDate }
        );
      }
      if (createdDate) {
        new Notice(
          t('account.header.notice.date-updated', {
            date: createdDate.toLocaleDateString(),
          })
        );
      }
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
      accountPageData.trades,
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

  const handleBackToDashboard = () => {
    void plugin.viewManager.navigateToAccountDashboard();
  };

  const challenge = account.propChallenge;

  return (
    <div className="journalit-account-identity" ref={registerHeaderTarget}>
      <div className="journalit-account-identity-row">
        <button
          type="button"
          className="journalit-account-back-button"
          aria-label={t('account.header.back-to-dashboard')}
          onClick={handleBackToDashboard}
        >
          <MoveLeft size={15} strokeWidth={2} aria-hidden="true" />
          <span className="journalit-account-back-button-label">
            {t('button.back')}
          </span>
        </button>
        <h2 className="journalit-account-identity-name">{account.name}</h2>
        <div className="journalit-account-identity-actions">
          {cockpitState ? (
            <PhaseSelector
              challenge={cockpitState.challenge}
              selectedPhase={cockpitState.selectedPhase}
              onSelectPhase={cockpitState.selectPhase}
            />
          ) : null}
          
          <div
            className="journalit-account-identity-action-buttons"
            ref={registerActionsTarget}
          >
            <div ref={registerTradeLogButtonTarget}>
              <AccountTradeLogControl
                accountName={account.name}
                selectedPhase={cockpitState?.selectedPhase}
              />
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
      </div>

      <AccountHeaderMeta
        account={account}
        currency={currency}
        challenge={challenge}
        selectedPhase={cockpitState?.selectedPhase}
      />

      
      {challenge && <PropChallengeTransitionNotice state={cockpitState} />}
      <AccountMergeLegacyNotice accountName={account.name} />
      {challenge && (
        <PropChallengeProfileNotice
          key={account.id ?? account.name}
          account={account}
          onUpdated={refreshData}
        />
      )}
      {dateWarning && (
        <AccountDateWarningBanner
          dateWarning={dateWarning}
          isFixingDate={isFixingDate}
          onFix={() => {
            void handleFixCreatedDate();
          }}
        />
      )}
    </div>
  );
};
