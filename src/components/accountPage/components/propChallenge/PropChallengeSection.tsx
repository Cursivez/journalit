

import React, { useState } from 'react';
import { Notice } from 'obsidian';
import { useAccountPageData } from '../../context/AccountPageDataContext';
import { useCurrency } from '../../../../contexts/CurrencyContext';
import { useDisplayFormatter } from '../../../../hooks/useDisplayPolicy';
import { usePlugin } from '../../../../hooks/usePlugin';
import { t } from '../../../../lang/helpers';
import { hasFundedLimitWarning } from '../../../../services/propChallenge/PropChallengeRuleEngine';
import {
  applyPropChallengeLifecycleAction,
  runPropChallengeAdvance,
} from './propChallengeLifecycleActions';
import { useGuideTarget } from '../../../../guides/GuideRuntimeLayer';
import { ACCOUNT_PAGE_CHALLENGE_SECTION_TARGET_ID } from '../../../../guides/accountPageGuideIds';
import { PropChallengePhaseNav } from './PropChallengePhaseNav';
import { PropChallengeRuleLedger } from './PropChallengeRuleLedger';
import { PropChallengePayoutCard } from './PropChallengePayoutCard';
import { PropChallengePayoutPlanEditor } from './PropChallengePayoutPlanEditor';
import { buildPropChallengeLedgerRows } from './propChallengeLedgerModel';
import { buildPayoutRequirementLedgerRows } from './propChallengePayoutLedgerRows';
import type {
  PropChallengeManualAction,
  PropChallengeMenuAction,
} from './PropChallengeActionsMenu';
import type { PropChallengeCockpitState } from './usePropChallengeCockpitState';

export const PropChallengeSection: React.FC<{
  state: PropChallengeCockpitState;
}> = ({ state }) => {
  const { accountPageData } = useAccountPageData();
  const plugin = usePlugin();
  const { currency: globalCurrency } = useCurrency();
  const { formatValue } = useDisplayFormatter();
  const [isSaving, setIsSaving] = useState(false);
  const registerChallengeSectionTarget = useGuideTarget(
    ACCOUNT_PAGE_CHALLENGE_SECTION_TARGET_ID
  );

  const {
    challenge,
    currentPhase,
    evaluation,
    outcomeMasked,
    payoutEvaluation,
    selectedEvaluation,
    selectedPhase,
    selectPhase,
  } = state;
  const currentIndex = challenge.phases.findIndex(
    (phase) => phase.id === currentPhase.id
  );
  const nextPhase = challenge.phases[currentIndex + 1];
  const isAccountArchived = accountPageData?.account.accountType === 'archived';

  if (!accountPageData) return null;

  
  
  
  
  
  
  const currency = accountPageData.account.currency || globalCurrency;

  const selectedIsFunded =
    selectedPhase.stage === 'sim_funded' ||
    selectedPhase.stage === 'live_funded';
  const selectedIndex = challenge.phases.findIndex(
    (phase) => phase.id === selectedPhase.id
  );
  const selectedNextPhase = challenge.phases[selectedIndex + 1];
  const treatAsPassed =
    selectedEvaluation.failureAfterTargetReached && Boolean(selectedNextPhase);
  
  
  
  const isCurrentPhase = selectedPhase.id === currentPhase?.id;
  
  
  
  
  const storedStatus =
    selectedPhase.status === 'passed' || selectedPhase.status === 'failed'
      ? selectedPhase.status
      : undefined;
  const historicalStatus =
    !isCurrentPhase || challenge.status !== 'active' ? storedStatus : undefined;
  
  
  
  const isUnstartedPhase =
    selectedPhase.status === 'pending' && !selectedPhase.startedAt;
  const statusClass = isUnstartedPhase
    ? 'pending'
    : (historicalStatus ??
      (selectedIsFunded
        ? challenge.status === 'failed' ||
          (selectedEvaluation.status === 'failed' && !treatAsPassed)
          ? 'failed'
          : hasFundedLimitWarning(selectedEvaluation.rules)
            ? 'warning'
            : 'active'
        : challenge.status === 'active'
          ? treatAsPassed
            ? 'passed'
            : selectedEvaluation.status
          : challenge.status));

  const applyAction = async (action: PropChallengeManualAction) => {
    if (!plugin?.accountPageService) return;
    setIsSaving(true);
    try {
      const context = {
        plugin,
        app: plugin.app,
        accountName: accountPageData.account.name,
        accountId: accountPageData.account.accountId,
        challenge,
        evaluation,
        trades: accountPageData.trades,
      };
      let applied = false;
      if (action === 'advance') {
        applied = await runPropChallengeAdvance(context);
      } else {
        applied = await applyPropChallengeLifecycleAction(context, action);
      }
      
      
      if (applied) selectPhase(undefined);
    } catch (error) {
      console.error('Failed to update prop challenge lifecycle:', error);
      new Notice(t('account.prop-challenge.actions.error'));
    } finally {
      setIsSaving(false);
    }
  };

  
  
  
  const isConcluded =
    challenge.status === 'passed' || challenge.status === 'failed';
  const actions: PropChallengeMenuAction[] = [
    {
      id: 'advance',
      label: nextPhase
        ? t('account.prop-challenge.actions.progress')
        : t('account.prop-challenge.actions.mark-passed'),
      disabled: isSaving || isAccountArchived || challenge.status !== 'active',
    },
    {
      id: 'fail',
      label: t('account.prop-challenge.actions.mark-failed'),
      disabled: isSaving || isAccountArchived || challenge.status !== 'active',
    },
    {
      id: 'archive',
      label: t('account.prop-challenge.actions.archive'),
      disabled: isSaving || isAccountArchived || !isConcluded,
    },
    {
      id: 'reopen',
      label: t('account.prop-challenge.actions.reopen'),
      disabled: isSaving || !isAccountArchived,
    },
  ];

  
  
  if (outcomeMasked) {
    return (
      <section
        className="journalit-prop-cockpit is-masked"
        ref={registerChallengeSectionTarget}
      >
        <PropChallengePhaseNav
          actions={actions}
          challenge={challenge}
          onAction={(action) => void applyAction(action)}
          selectedPhase={selectedPhase}
        />
      </section>
    );
  }

  const ledgerRows = buildPropChallengeLedgerRows(
    selectedEvaluation.rules,
    formatValue,
    currency
  );

  
  
  const payoutPolicy =
    selectedPhase.id === currentPhase.id
      ? currentPhase.payoutPolicy
      : undefined;
  const payout =
    payoutPolicy && payoutEvaluation
      ? { policy: payoutPolicy, evaluation: payoutEvaluation }
      : undefined;
  const payoutRows = payout
    ? buildPayoutRequirementLedgerRows(payout.evaluation, formatValue, currency)
    : [];

  return (
    <section
      className={`journalit-prop-cockpit is-${statusClass}`}
      ref={registerChallengeSectionTarget}
    >
      <PropChallengePhaseNav
        actions={actions}
        challenge={challenge}
        onAction={(action) => void applyAction(action)}
        selectedPhase={selectedPhase}
        status={statusClass}
      />
      <div
        className={`journalit-prop-cockpit-body${payout ? ' has-payout' : ''}`}
      >
        {payout ? (
          <PropChallengePayoutCard
            currency={currency}
            evaluation={evaluation}
            payout={payout.evaluation}
            phase={currentPhase}
            policy={payout.policy}
          />
        ) : null}
        {ledgerRows.length > 0 || payoutRows.length > 0 ? (
          <PropChallengeRuleLedger
            caption={t('account.prop-challenge.phase-rules', {
              phase: selectedPhase.name,
            })}
            payoutSection={{
              label: t('account.prop-challenge.ledger.section.payout'),
              rows: payoutRows,
            }}
            rows={ledgerRows}
          />
        ) : null}
      </div>
      {payout ? (
        <div className="journalit-prop-cockpit-footer">
          <PropChallengePayoutPlanEditor
            challenge={challenge}
            currency={currency}
          />
        </div>
      ) : null}
    </section>
  );
};
