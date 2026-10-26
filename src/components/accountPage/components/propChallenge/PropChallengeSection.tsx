

import React, { useState } from 'react';
import { Notice } from 'obsidian';
import { useAccountPageData } from '../../context/AccountPageDataContext';
import { useCurrency } from '../../../../contexts/CurrencyContext';
import { useDisplayFormatter } from '../../../../hooks/useDisplayPolicy';
import { usePlugin } from '../../../../hooks/usePlugin';
import { t } from '../../../../lang/helpers';
import {
  hasFundedLimitWarning,
  isReviewOnlyWarning,
} from '../../../../services/propChallenge/PropChallengeRuleEngine';
import {
  applyPropChallengeLifecycleAction,
  runPropChallengeAdvance,
} from './propChallengeLifecycleActions';
import { useGuideTarget } from '../../../../guides/GuideRuntimeLayer';
import { ACCOUNT_PAGE_CHALLENGE_SECTION_TARGET_ID } from '../../../../guides/accountPageGuideIds';
import { PropChallengePhaseNav } from './PropChallengePhaseNav';
import { openProfileSourceModal } from './ProfileUpdateModal';
import { openCorrectionHistoryModal } from './CorrectionHistoryModal';
import { PropFirmRuleUpdatesTeaser } from './PropFirmPrefillTeaser';
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

type PropChallengeStatusClass =
  | PropChallengeCockpitState['selectedEvaluation']['status']
  | PropChallengeCockpitState['challenge']['status']
  | 'pending'
  | 'warning';

const isFundedStage = (phase: PropChallengeCockpitState['selectedPhase']) =>
  phase.stage === 'sim_funded' || phase.stage === 'live_funded';


function fundedPhaseStatus(
  state: PropChallengeCockpitState,
  treatAsPassed: boolean
): PropChallengeStatusClass {
  const { challenge, selectedEvaluation } = state;
  if (
    challenge.status === 'failed' ||
    (selectedEvaluation.status === 'failed' && !treatAsPassed)
  )
    return 'failed';
  return hasFundedLimitWarning(selectedEvaluation.rules) ? 'warning' : 'active';
}


function evaluationPhaseStatus(
  state: PropChallengeCockpitState,
  treatAsPassed: boolean
): PropChallengeStatusClass {
  if (state.challenge.status !== 'active') return state.challenge.status;
  return treatAsPassed ? 'passed' : state.selectedEvaluation.status;
}


function selectedPhaseStatus(state: PropChallengeCockpitState): {
  selectedIsFunded: boolean;
  statusClass: PropChallengeStatusClass;
} {
  const { challenge, currentPhase, selectedEvaluation, selectedPhase } = state;
  const selectedIsFunded = isFundedStage(selectedPhase);
  const selectedIndex = challenge.phases.findIndex(
    (phase) => phase.id === selectedPhase.id
  );
  const selectedNextPhase = challenge.phases[selectedIndex + 1];
  const treatAsPassed =
    selectedEvaluation.failureAfterTargetReached && Boolean(selectedNextPhase);
  
  
  
  if (selectedPhase.status === 'pending' && !selectedPhase.startedAt) {
    return { selectedIsFunded, statusClass: 'pending' };
  }
  
  
  
  
  
  
  
  const isCurrentPhase = selectedPhase.id === currentPhase.id;
  const hasStoredOutcome =
    selectedPhase.status === 'passed' || selectedPhase.status === 'failed';
  if (hasStoredOutcome && (!isCurrentPhase || challenge.status !== 'active')) {
    return { selectedIsFunded, statusClass: selectedPhase.status };
  }
  return {
    selectedIsFunded,
    statusClass: selectedIsFunded
      ? fundedPhaseStatus(state, treatAsPassed)
      : evaluationPhaseStatus(state, treatAsPassed),
  };
}

type PluginInstance = ReturnType<typeof usePlugin>;

const hasPremium = (plugin: PluginInstance): boolean =>
  plugin?.settings.backendIntegration?.subscriptionTier === 'premium';


const offersRuleLinking = (
  plugin: PluginInstance,
  challenge: PropChallengeCockpitState['challenge'],
  isAccountArchived: boolean
): boolean =>
  !challenge.profileRef &&
  !isAccountArchived &&
  (hasPremium(plugin) ||
    (plugin?.settings.personalPropFirmProfiles?.length ?? 0) > 0);


const showsRuleUpdatesTeaser = (
  plugin: PluginInstance,
  challenge: PropChallengeCockpitState['challenge'],
  isAccountArchived: boolean
): boolean =>
  !challenge.profileRef && !isAccountArchived && !hasPremium(plugin);


function buildChallengeMenuActions({
  challenge,
  selectedPhase,
  outcomeMasked,
  hasNextPhase,
  isSaving,
  isAccountArchived,
  canLinkRules,
}: {
  challenge: PropChallengeCockpitState['challenge'];
  selectedPhase: PropChallengeCockpitState['selectedPhase'];
  outcomeMasked: boolean;
  hasNextPhase: boolean;
  isSaving: boolean;
  isAccountArchived: boolean;
  canLinkRules: boolean;
}): PropChallengeMenuAction[] {
  const isConcluded =
    challenge.status === 'passed' || challenge.status === 'failed';
  const lifecycleLocked =
    isSaving || isAccountArchived || challenge.status !== 'active';
  const hasCorrections =
    !outcomeMasked &&
    challenge.correctionHistory?.some(
      (audit) => audit.before.id === selectedPhase.id
    ) === true;
  return [
    ...(hasCorrections
      ? [
          {
            id: 'rule-corrections' as const,
            label: t('account.profiles.correction-history'),
            disabled: false,
          },
        ]
      : []),
    {
      id: 'advance',
      label: hasNextPhase
        ? t('account.prop-challenge.actions.progress')
        : t('account.prop-challenge.actions.mark-passed'),
      disabled: lifecycleLocked,
    },
    {
      id: 'fail',
      label: t('account.prop-challenge.actions.mark-failed'),
      disabled: lifecycleLocked,
    },
    {
      id: 'archive',
      label: t('account.prop-challenge.actions.archive'),
      disabled: isSaving || isAccountArchived || !isConcluded,
    },
    {
      
      
      
      
      
      id: 'reopen',
      label: t('account.prop-challenge.actions.reopen'),
      disabled:
        isSaving || (!isAccountArchived && challenge.status !== 'failed'),
    },
    ...(canLinkRules
      ? [
          {
            id: 'link-rules' as const,
            label: t('account.prop-challenge.actions.link-rules'),
            disabled: isSaving,
          },
        ]
      : []),
  ];
}


const PropChallengeCockpitBody: React.FC<{
  state: PropChallengeCockpitState;
  currency: string;
}> = ({ state, currency }) => {
  const { formatValue } = useDisplayFormatter();
  const {
    challenge,
    currentPhase,
    evaluation,
    payoutEvaluation,
    selectedEvaluation,
    selectedPhase,
  } = state;
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
  const payoutCalculated =
    payout && payout.evaluation.status !== 'needs_review';
  return (
    <>
      <div
        className={`journalit-prop-cockpit-body${payoutCalculated ? ' has-payout' : ''}`}
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
      {payoutCalculated ? (
        <div className="journalit-prop-cockpit-footer">
          <PropChallengePayoutPlanEditor
            challenge={challenge}
            currency={currency}
          />
        </div>
      ) : null}
    </>
  );
};

export const PropChallengeSection: React.FC<{
  state: PropChallengeCockpitState;
}> = ({ state }) => {
  const { accountPageData, refreshData } = useAccountPageData();
  const plugin = usePlugin();
  const { currency: globalCurrency } = useCurrency();
  const [isSaving, setIsSaving] = useState(false);
  const registerChallengeSectionTarget = useGuideTarget(
    ACCOUNT_PAGE_CHALLENGE_SECTION_TARGET_ID
  );

  const {
    challenge,
    currentPhase,
    evaluation,
    outcomeMasked,
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

  const { selectedIsFunded, statusClass } = selectedPhaseStatus(state);

  const applyAction = async (action: PropChallengeManualAction) => {
    if (!plugin?.accountPageService) return;
    if (action === 'rule-corrections') {
      openCorrectionHistoryModal({
        app: plugin.app,
        config: challenge,
        phase: selectedPhase,
      });
      return;
    }
    if (action === 'link-rules') {
      openProfileSourceModal({
        plugin,
        account: accountPageData.account,
        onUpdated: refreshData,
      });
      return;
    }
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

  const canLinkRules = offersRuleLinking(plugin, challenge, isAccountArchived);
  const actions = buildChallengeMenuActions({
    challenge,
    selectedPhase,
    outcomeMasked,
    hasNextPhase: nextPhase !== undefined,
    isSaving,
    isAccountArchived,
    canLinkRules,
  });

  
  const upsell = showsRuleUpdatesTeaser(
    plugin,
    challenge,
    isAccountArchived
  ) ? (
    <PropFirmRuleUpdatesTeaser firmName={challenge.firmName} />
  ) : undefined;

  
  
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
          upsell={upsell}
          selectedPhase={selectedPhase}
        />
      </section>
    );
  }

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
        reviewRequired={isReviewOnlyWarning(
          selectedEvaluation.rules,
          selectedIsFunded
        )}
        upsell={upsell}
      />
      <PropChallengeCockpitBody state={state} currency={currency} />
    </section>
  );
};
