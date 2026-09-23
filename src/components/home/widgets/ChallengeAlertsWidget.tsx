

import React, { memo, useCallback, useMemo } from 'react';
import { DEFAULT_PRIVACY_MASK } from '../../../constants';
import JournalitPlugin from '../../../main';
import { useHomeAccount } from '../context/HomeAccountContext';
import { useHomeAccountsData } from '../context/HomeAccountsDataContext';
import { useDisplayFormatter } from '../../../hooks/useDisplayPolicy';
import type {
  PropChallengeActiveNotice,
  PropChallengeNoticeKind,
} from '../../../services/propChallenge';
import { CheckCircle, ChevronRight } from '../../shared/icons/ObsidianIcon';
import { SkeletonBox } from '../../shared/SkeletonBox';
import { SkeletonText } from '../../shared/SkeletonText';
import { t } from '../../../lang/helpers';

interface ChallengeAlertsWidgetProps {
  plugin: JournalitPlugin;
}

interface AlertRow {
  accountName: string;
  notice: PropChallengeActiveNotice;
}

const PRIORITY: Record<PropChallengeNoticeKind, number> = {
  phase_failed: 0,
  unknown_account: 1,
  evaluation_passed: 2,
  target_reached: 2,
  payout_available: 3,
  payout_lost: 4,
};

const TONE: Record<PropChallengeNoticeKind, string> = {
  phase_failed: 'is-failed',
  unknown_account: 'is-unknown',
  evaluation_passed: 'is-passed',
  target_reached: 'is-passed',
  payout_available: 'is-payout',
  payout_lost: 'is-lost',
};

const MAX_ROWS = 4;

function kindLabel(notice: PropChallengeActiveNotice): string {
  switch (notice.kind) {
    case 'phase_failed':
      return t('home.widget.challenge-alerts.kind.failed');
    case 'target_reached':
      return t('home.widget.challenge-alerts.kind.target');
    case 'evaluation_passed':
      return t('home.widget.challenge-alerts.kind.passed');
    case 'payout_available':
      return t('home.widget.challenge-alerts.kind.payout');
    case 'payout_lost':
      return t('home.widget.challenge-alerts.kind.lost');
    case 'unknown_account':
      return t('home.widget.challenge-alerts.kind.unknown-account', {
        label: notice.identityLabel ?? notice.identity ?? '',
      });
  }
}

const ChallengeAlertsWidgetComponent: React.FC<ChallengeAlertsWidgetProps> = ({
  plugin,
}) => {
  const { shouldMask } = useDisplayFormatter();
  
  const outcomeMasked = shouldMask('pnl');
  const accountContext = useHomeAccount();
  const homeAccountsData = useHomeAccountsData();
  const accounts = useMemo(
    () => homeAccountsData?.accounts || [],
    [homeAccountsData?.accounts]
  );
  const isLoading = homeAccountsData?.isLoading ?? true;
  
  
  const loadError = homeAccountsData?.error ?? null;

  const rows = useMemo((): AlertRow[] => {
    const result: AlertRow[] = [];
    for (const account of accounts) {
      const active = account.propChallenge?.notices?.active;
      if (
        !active?.length ||
        account.accountType?.toLowerCase() === 'archived' ||
        !(
          accountContext?.matchesAccount(account.accountName || account.name) ??
          true
        )
      )
        continue;
      
      const notice = [...active].sort(
        (a, b) => PRIORITY[a.kind] - PRIORITY[b.kind]
      )[0];
      result.push({
        accountName: account.accountName || account.name,
        notice,
      });
    }
    return result.sort(
      (a, b) =>
        PRIORITY[a.notice.kind] - PRIORITY[b.notice.kind] ||
        b.notice.detectedAt.localeCompare(a.notice.detectedAt)
    );
  }, [accounts, accountContext]);

  const openAccount = useCallback(
    (accountName: string) => {
      void plugin.viewManager.openAccountPageView(accountName);
    },
    [plugin]
  );

  if (isLoading) {
    return (
      <div className="journalit-home-challenge-alerts">
        <div className="journalit-home-challenge-alerts__header">
          <SkeletonText width="110px" height="11px" />
          <SkeletonText width="20px" height="11px" />
        </div>
        <div className="journalit-home-challenge-alerts__row">
          <SkeletonBox width={8} height={8} borderRadius="50%" />
          <SkeletonText width="140px" height="13px" />
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="journalit-home-challenge-alerts journalit-home-challenge-alerts--empty">
        <span className="journalit-home-widget__muted">
          {t('home.widget.challenge-alerts.unable-to-load')}
        </span>
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="journalit-home-challenge-alerts journalit-home-challenge-alerts--empty">
        <CheckCircle
          size={16}
          className="journalit-home-challenge-alerts__check"
        />
        <span className="journalit-home-widget__muted">
          {t('home.widget.challenge-alerts.empty')}
        </span>
      </div>
    );
  }

  const shown = rows.slice(0, MAX_ROWS);
  return (
    <div className="journalit-home-challenge-alerts">
      <div className="journalit-home-challenge-alerts__header">
        <span className="journalit-home-widget__eyebrow">
          {t('home.widget.challenge-alerts.title')}
        </span>
        <span className="journalit-home-widget__faint">
          {rows.length === 1
            ? t('home.widget.challenge-alerts.count', { count: '1' })
            : t('home.widget.challenge-alerts.count-plural', {
                count: String(rows.length),
              })}
        </span>
      </div>
      <div className="journalit-home-challenge-alerts__body">
        <ul className="journalit-home-challenge-alerts__list">
          {shown.map(({ accountName, notice }) => (
            <li
              key={accountName}
              className="journalit-home-challenge-alerts__row journalit-home-challenge-alerts__row--clickable"
              tabIndex={0}
              onClick={() => openAccount(accountName)}
              onKeyDown={(event) => {
                if (event.key !== 'Enter' && event.key !== ' ') return;
                event.preventDefault();
                openAccount(accountName);
              }}
            >
              <span
                className={`journalit-home-challenge-alerts__dot ${
                  outcomeMasked && notice.kind !== 'unknown_account'
                    ? 'is-masked'
                    : TONE[notice.kind]
                }`}
              />
              <span className="journalit-home-challenge-alerts__account">
                {accountName}
              </span>
              
              <span className="journalit-home-challenge-alerts__label">
                {outcomeMasked && notice.kind !== 'unknown_account'
                  ? DEFAULT_PRIVACY_MASK
                  : kindLabel(notice)}
              </span>
              <ChevronRight
                size={14}
                className="journalit-home-challenge-alerts__chevron"
              />
            </li>
          ))}
        </ul>
        {rows.length > shown.length && (
          <span className="journalit-home-widget__faint">
            {t('home.widget.challenge-alerts.more', {
              count: String(rows.length - shown.length),
            })}
          </span>
        )}
      </div>
    </div>
  );
};

export const ChallengeAlertsWidget = memo(ChallengeAlertsWidgetComponent);
