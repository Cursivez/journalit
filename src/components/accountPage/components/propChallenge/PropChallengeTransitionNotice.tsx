

import React, { useState } from 'react';
import { Notice } from 'obsidian';
import { useAccountPageData } from '../../context/AccountPageDataContext';
import { usePlugin } from '../../../../hooks/usePlugin';
import { useDisplayFormatter } from '../../../../hooks/useDisplayPolicy';
import { useCurrency } from '../../../../contexts/CurrencyContext';
import { t } from '../../../../lang/helpers';
import { assignBrokerIdentityToPhase } from '../../../../services/propChallenge/PropChallengeIdentityLearning';
import {
  derivePropChallengeNotices,
  dismissPropChallengeNotice,
  type PropChallengeNotice,
} from '../../../../services/propChallenge/PropChallengeNotices';
import { savePropChallengeConfig } from '../../../../services/propChallenge/PropChallengePersistence';
import { TransactionType } from '../../../../services/account/types';
import { formatDateDisplay } from '../../../../utils/dateUtils';
import { Button } from '../../../ui/Button';
import {
  AlertTriangle,
  CheckCircle,
  Info,
  DollarSign,
} from '../../../shared/icons/ObsidianIcon';
import { openAddEventModal } from '../AddEventModal';
import {
  applyPropChallengeLifecycleAction,
  applyPropChallengeAdvanceWithIdentity,
  promptPropChallengeAdvanceTime,
  runPropChallengeAdvance,
} from './propChallengeLifecycleActions';
import { payoutRequirementLabel } from './payoutRequirementLabel';
import type { PropChallengeCockpitState } from './usePropChallengeCockpitState';

const TONE: Record<PropChallengeNotice['kind'], string> = {
  phase_failed: 'is-failed',
  unknown_account: 'is-unknown',
  target_reached: 'is-passed',
  evaluation_passed: 'is-passed',
  payout_available: 'is-payout',
  payout_lost: 'is-lost',
};

const ICON: Record<PropChallengeNotice['kind'], typeof AlertTriangle> = {
  phase_failed: AlertTriangle,
  unknown_account: Info,
  target_reached: CheckCircle,
  evaluation_passed: CheckCircle,
  payout_available: DollarSign,
  payout_lost: Info,
};

function TransitionNoticeActions({
  busy,
  secondaryLabel,
  onSecondary,
  middleAction,
  primary,
}: {
  busy: boolean;
  secondaryLabel: string;
  onSecondary: () => void;
  middleAction?: { label: string; onClick: () => void };
  primary: { label: string; onClick: () => void; destructive?: boolean };
}) {
  return (
    <div className="journalit-prop-transition-notice__actions">
      {secondaryLabel && (
        <Button
          variant="plain"
          size="small"
          disabled={busy}
          onClick={onSecondary}
        >
          {secondaryLabel}
        </Button>
      )}
      {middleAction && (
        <Button
          variant="plain"
          size="small"
          disabled={busy}
          onClick={middleAction.onClick}
        >
          {middleAction.label}
        </Button>
      )}
      <Button
        variant={primary.destructive ? 'danger' : 'secondary'}
        size="small"
        className="account-date-warning__button"
        disabled={busy}
        onClick={primary.onClick}
      >
        {primary.label}
      </Button>
    </div>
  );
}

export const PropChallengeTransitionNotice: React.FC<{
  state: PropChallengeCockpitState | null;
}> = ({ state }) => {
  const { accountPageData, refreshData } = useAccountPageData();
  const plugin = usePlugin();
  const { formatValue, shouldMask } = useDisplayFormatter();
  const { currency: globalCurrency } = useCurrency();
  const [busy, setBusy] = useState(false);

  if (!plugin?.accountPageService || !accountPageData || !state) return null;
  const account = accountPageData.account;
  const notices = derivePropChallengeNotices({
    config: state.challenge,
    accountArchived: account.accountType === 'archived',
    evaluation: state.evaluation,
    payoutEvaluation: state.payoutEvaluation,
    trades: accountPageData.trades,
    resolveIdentityLabel: (identity) =>
      plugin.settings?.backendIntegration?.accountMapping?.[identity]?.trim() ||
      undefined,
  });
  const notice = notices[0];
  if (!notice) return null;

  const currency = account.currency || globalCurrency;
  const money = (value: number) =>
    formatValue({ kind: 'pnl', value, currencyCode: currency });
  const moneyMasked = shouldMask('pnl');
  
  
  if (moneyMasked && notice.kind !== 'unknown_account') return null;
  const context = {
    plugin,
    app: plugin.app,
    accountName: account.name,
    accountId: account.accountId,
    challenge: state.challenge,
    evaluation: state.evaluation,
    trades: accountPageData.trades,
  };

  const run = async (work: () => Promise<void>) => {
    setBusy(true);
    try {
      await work();
    } catch (error) {
      console.error('Failed to apply prop challenge notice action:', error);
      new Notice(t('account.prop-challenge.notice.error'));
    } finally {
      setBusy(false);
    }
  };

  const dismiss = () =>
    run(async () => {
      await savePropChallengeConfig({
        accountPageService: plugin.accountPageService,
        accountName: account.name,
        accountId: account.accountId,
        config: dismissPropChallengeNotice(
          state.challenge,
          notice.fingerprint,
          new Date()
        ),
        expectedConfig: state.challenge,
      });
    });

  const lifecycle = (action: 'advance' | 'archive' | 'reopen') =>
    run(async () => {
      if (action === 'advance') {
        await runPropChallengeAdvance(context);
        return;
      }
      await applyPropChallengeLifecycleAction(context, action, {
        confirm: false,
      });
    });

  const recordPayout = () => {
    openAddEventModal(
      plugin.app,
      plugin,
      account.name,
      () => void refreshData(),
      {
        type: TransactionType.WITHDRAWAL,
        ...(notice.suggestedAmount !== undefined
          ? { amount: notice.suggestedAmount }
          : {}),
        description: t('account.prop-challenge.notice.payout-description'),
      }
    );
  };

  let title: string;
  let description: string | undefined;
  let extraDescription: string | undefined = undefined;
  let primary: { label: string; onClick: () => void; destructive?: boolean };
  let secondaryLabel: string;
  let middleAction: { label: string; onClick: () => void } | undefined =
    undefined;

  switch (notice.kind) {
    case 'phase_failed': {
      title = t('account.prop-challenge.notice.failed-title', {
        phase: notice.phase.name,
      });
      description = notice.failure
        ? t('account.prop-challenge.notice.failed-description', {
            rule: t(
              `account.prop-challenge.summary.rule.${notice.failure.ruleKind}`
            ),
            date: formatDateDisplay(new Date(notice.failure.breachedAt)),
          })
        : t('account.prop-challenge.notice.failed-manual');
      primary = {
        label: t('account.prop-challenge.actions.archive'),
        onClick: () => void lifecycle('archive'),
        destructive: true,
      };
      middleAction = {
        label: t('account.prop-challenge.actions.reopen'),
        onClick: () => void lifecycle('reopen'),
      };
      secondaryLabel = t('account.prop-challenge.notice.keep-open');
      break;
    }
    case 'unknown_account': {
      const label = notice.identityLabel ?? notice.identity ?? '';
      const assignCurrent = () =>
        void run(async () => {
          if (!notice.identity) return;
          const next = assignBrokerIdentityToPhase(
            state.challenge,
            notice.phase.id,
            notice.identity
          );
          if (next === state.challenge) return;
          await savePropChallengeConfig({
            accountPageService: plugin.accountPageService,
            accountName: account.name,
            accountId: account.accountId,
            config: next,
            expectedConfig: state.challenge,
          });
        });
      const progress = () =>
        void run(async () => {
          if (!notice.identity) return;
          const at = await promptPropChallengeAdvanceTime(context, {
            defaultAt: notice.firstTradeAt
              ? new Date(notice.firstTradeAt)
              : undefined,
          });
          if (!at) return;
          await applyPropChallengeAdvanceWithIdentity(context, {
            identity: notice.identity,
            at,
          });
        });
      title = t('account.prop-challenge.notice.unknown-title', { label });
      description = t(
        notice.tradeCount === 1
          ? 'account.prop-challenge.notice.unknown-description-one'
          : 'account.prop-challenge.notice.unknown-description',
        {
          count: String(notice.tradeCount ?? 0),
          date: notice.firstTradeAt
            ? formatDateDisplay(new Date(notice.firstTradeAt))
            : '',
        }
      );
      secondaryLabel = t('account.prop-challenge.notice.not-now');
      if (notice.nextPhase) {
        middleAction = {
          label: t('account.prop-challenge.notice.same-phase'),
          onClick: assignCurrent,
        };
        primary = {
          label: t('account.prop-challenge.actions.progress-to', {
            phase: notice.nextPhase.name,
          }),
          onClick: progress,
        };
      } else {
        primary = {
          label: t('account.prop-challenge.notice.same-phase'),
          onClick: assignCurrent,
        };
      }
      break;
    }
    case 'target_reached': {
      title = t('account.prop-challenge.notice.target-title', {
        phase: notice.phase.name,
      });
      description = t('account.prop-challenge.notice.target-description', {
        next: notice.nextPhase?.name ?? '',
      });
      extraDescription =
        notice.breachAfterReached && notice.reachedAt
          ? t('account.prop-challenge.notice.breach-after-reached', {
              time: new Date(notice.reachedAt).toLocaleString(),
            })
          : undefined;
      primary = {
        label: t('account.prop-challenge.actions.progress-to', {
          phase: notice.nextPhase?.name ?? '',
        }),
        onClick: () => void lifecycle('advance'),
      };
      secondaryLabel = t('account.prop-challenge.notice.not-yet');
      break;
    }
    case 'evaluation_passed': {
      title = t('account.prop-challenge.notice.passed-title');
      description = t('account.prop-challenge.notice.passed-description');
      primary = {
        label: t('account.prop-challenge.actions.mark-passed'),
        onClick: () => void lifecycle('advance'),
      };
      secondaryLabel = t('account.prop-challenge.notice.not-yet');
      break;
    }
    case 'payout_available': {
      title = t('account.prop-challenge.notice.payout-title', {
        amount: money(notice.amount ?? 0),
      });
      description =
        !moneyMasked &&
        notice.suggestedAmount !== undefined &&
        notice.suggestedAmount !== notice.amount
          ? t('account.prop-challenge.notice.payout-plan', {
              amount: money(notice.suggestedAmount),
            })
          : undefined;
      primary = {
        label: t('account.prop-challenge.notice.record-payout'),
        onClick: recordPayout,
      };
      secondaryLabel = t('account.prop-challenge.notice.skip-cycle');
      break;
    }
    case 'payout_lost': {
      title = t('account.prop-challenge.notice.lost-title');
      description = notice.requirements?.length
        ? t('account.prop-challenge.notice.lost-description', {
            requirements: notice.requirements
              .map((kind) => payoutRequirementLabel(kind))
              .join(', '),
          })
        : undefined;
      primary = {
        label: t('account.prop-challenge.notice.dismiss'),
        onClick: () => void dismiss(),
      };
      secondaryLabel = '';
      break;
    }
  }

  const Icon = ICON[notice.kind];
  return (
    <div
      className={`account-date-warning journalit-prop-transition-notice ${TONE[notice.kind]}`}
      role="status"
      data-notice-kind={notice.kind}
    >
      <Icon size={20} className="account-date-warning__icon" />
      <div className="account-date-warning__content">
        <div className="account-date-warning__title">{title}</div>
        {description && (
          <div className="account-date-warning__desc">{description}</div>
        )}
        {extraDescription && (
          <div className="account-date-warning__desc">{extraDescription}</div>
        )}
      </div>
      <TransitionNoticeActions
        busy={busy}
        secondaryLabel={secondaryLabel}
        onSecondary={() => void dismiss()}
        middleAction={middleAction}
        primary={primary}
      />
    </div>
  );
};
