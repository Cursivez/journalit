
import React, { useState } from 'react';
import { Notice } from 'obsidian';
import {
  Archive,
  ArrowRight,
  Check,
  CheckCircle,
  CircleDollarSign,
  HandCoins,
  XCircle,
  AlertTriangle,
  X,
} from '../../shared/icons/ObsidianIcon';
import { usePlugin } from '../../../hooks/usePlugin';
import { t } from '../../../lang/helpers';
import type { AccountPageData } from '../../../services/accountPage/types';
import { suggestPropChallengePayoutAmount } from '../../../services/propChallenge/PropChallengeNotices';
import { type PropChallengePayoutEvaluation } from '../../../services/propChallenge/PropChallengePayoutEngine';
import {
  isReviewOnlyWarning,
  type PropChallengePhaseEvaluation,
  type PropChallengePhaseEvaluationStatus,
} from '../../../services/propChallenge/PropChallengeRuleEngine';
import type {
  PropChallengeConfig,
  PropChallengePhase,
} from '../../../services/propChallenge/types';
import { TransactionType } from '../../../services/account/types';
import { openAddEventModal } from '../../accountPage/components/AddEventModal';
import {
  applyPropChallengeLifecycleAction,
  runPropChallengeAdvance,
  type LifecycleActionContext,
} from '../../accountPage/components/propChallenge/propChallengeLifecycleActions';

type RibbonItem =
  | { kind: 'phase'; phase: PropChallengePhase }
  | { kind: 'ellipsis'; id: string };


type RibbonSegmentStatus = PropChallengePhase['status'] | 'warning';

type RibbonTone =
  | PropChallengePhase['status']
  | 'current'
  | 'current-warning'
  | 'current-failed'
  | 'current-passed'
  | 'current-payout';

type ChallengeCardStatus =
  | PropChallengeConfig['status']
  | PropChallengePhaseEvaluationStatus
  | 'payout_ready';

function challengeStatusLabel(
  status: ChallengeCardStatus,
  reviewOnly: boolean
): string {
  return reviewOnly && status === 'warning'
    ? t('account.prop-challenge.ledger.state.needs-review')
    : t(`account.prop-challenge.summary.status.${status}`);
}

type PhaseRibbonSegment = {
  key: string;
  label: string;
  tone: RibbonTone;
  className: string;
  isComplete: boolean;
  isEllipsis: boolean;
  status: ChallengeCardStatus | undefined;
  statusLabel: string | undefined;
};

function ribbonSegmentState(segment: PhaseRibbonSegment) {
  if (segment.isEllipsis) return undefined;
  if (segment.statusLabel) return segment.status;
  if (segment.className.startsWith('is-passed')) return 'passed' as const;
  if (segment.className.startsWith('is-failed')) return 'failed' as const;
  return undefined;
}

function ribbonSegmentIcon(state: ReturnType<typeof ribbonSegmentState>) {
  return state === 'failed'
    ? X
    : state === 'warning'
      ? AlertTriangle
      : state === 'payout_ready'
        ? CircleDollarSign
        : state === 'passed'
          ? Check
          : undefined;
}

export const isFundedPhase = (phase: PropChallengePhase): boolean =>
  phase.stage === 'sim_funded' || phase.stage === 'live_funded';

export function getChallengeCardStatus(
  challenge: PropChallengeConfig,
  evaluationStatus: PropChallengePhaseEvaluationStatus,
  masked: boolean,
  currentPhase?: PropChallengePhase,
  payoutStatus?: PropChallengePayoutEvaluation['status'],
  fundedLimitWarning = false
): ChallengeCardStatus | undefined {
  if (masked) return undefined;
  const isFundedStage =
    currentPhase?.stage === 'sim_funded' ||
    currentPhase?.stage === 'live_funded';
  
  
  
  
  
  
  
  const concluded =
    challenge.status !== 'active' &&
    currentPhase !== undefined &&
    currentPhase.status !== 'active';
  if (isFundedStage && challenge.status !== 'failed' && !concluded) {
    if (evaluationStatus === 'failed') return evaluationStatus;
    if (fundedLimitWarning) return 'warning';
    return payoutStatus === 'eligible' ? 'payout_ready' : 'active';
  }
  return challenge.status === 'active' ? evaluationStatus : challenge.status;
}

function getRibbonItems(
  phases: readonly PropChallengePhase[],
  currentPhaseId: string
): RibbonItem[] {
  if (phases.length <= 5) {
    return phases.map((phase) => ({ kind: 'phase', phase }));
  }

  const currentIndex = Math.max(
    0,
    phases.findIndex((phase) => phase.id === currentPhaseId)
  );
  if (currentIndex <= 1) {
    return [
      ...phases.slice(0, 3).map((phase) => ({ kind: 'phase' as const, phase })),
      { kind: 'ellipsis', id: 'tail-gap' },
      { kind: 'phase', phase: phases[phases.length - 1] },
    ];
  }
  if (currentIndex >= phases.length - 2) {
    return [
      { kind: 'phase', phase: phases[0] },
      { kind: 'ellipsis', id: 'head-gap' },
      ...phases.slice(-3).map((phase) => ({ kind: 'phase' as const, phase })),
    ];
  }
  return [
    { kind: 'phase', phase: phases[0] },
    { kind: 'ellipsis', id: 'head-gap' },
    { kind: 'phase', phase: phases[currentIndex] },
    { kind: 'ellipsis', id: 'tail-gap' },
    { kind: 'phase', phase: phases[phases.length - 1] },
  ];
}

function getPhaseStatus(
  phase: PropChallengePhase,
  currentPhase: PropChallengePhase,
  challenge: PropChallengeConfig,
  evaluationStatus: PropChallengePhaseEvaluationStatus,
  masked: boolean
): RibbonSegmentStatus {
  if (masked) return 'pending';
  if (phase.id !== currentPhase.id || challenge.status !== 'active') {
    return phase.status;
  }
  return evaluationStatus;
}


function getRibbonTone(
  status: RibbonSegmentStatus,
  isCurrent: boolean
): RibbonTone {
  if (!isCurrent) return status === 'warning' ? 'active' : status;
  if (status === 'warning') return 'current-warning';
  if (status === 'failed') return 'current-failed';
  return 'current';
}

type RibbonAttentionState = 'failed' | 'passed' | 'payout_ready';

type RibbonAttentionAction =
  | 'archive'
  | 'advance'
  | 'mark-passed'
  | 'record-payout';

type RibbonMode =
  | {
      kind: 'attention';
      state: RibbonAttentionState;
      action: Exclude<RibbonAttentionAction, 'advance'>;
    }
  | {
      kind: 'attention';
      state: 'passed';
      action: 'advance';
      nextPhase: PropChallengePhase;
    }
  | { kind: 'final-phase' }
  | { kind: 'full' };


function getRibbonMode(args: {
  challenge: PropChallengeConfig;
  currentPhase: PropChallengePhase;
  challengeStatus: ChallengeCardStatus | undefined;
  accountArchived: boolean;
  masked: boolean;
}): RibbonMode {
  const { challenge, currentPhase, challengeStatus, accountArchived, masked } =
    args;
  
  
  
  if (masked) return { kind: 'full' };
  const currentIndex = challenge.phases.findIndex(
    (phase) => phase.id === currentPhase.id
  );
  const nextPhase =
    currentIndex >= 0 ? challenge.phases[currentIndex + 1] : undefined;
  const hasNextPhase = nextPhase !== undefined;

  
  
  if (!accountArchived) {
    if (challengeStatus === 'failed') {
      return { kind: 'attention', state: 'failed', action: 'archive' };
    }
    if (challengeStatus === 'payout_ready') {
      return {
        kind: 'attention',
        state: 'payout_ready',
        action: 'record-payout',
      };
    }
    if (challengeStatus === 'passed' && challenge.status === 'active') {
      return nextPhase
        ? { kind: 'attention', state: 'passed', action: 'advance', nextPhase }
        : { kind: 'attention', state: 'passed', action: 'mark-passed' };
    }
  }

  if (
    challenge.status === 'active' &&
    challenge.phases.length > 1 &&
    currentIndex >= 0 &&
    !hasNextPhase
  ) {
    return { kind: 'final-phase' };
  }
  return { kind: 'full' };
}

type RibbonAttention = Extract<RibbonMode, { kind: 'attention' }>;


const ATTENTION_ACTION_ICONS = {
  archive: Archive,
  'record-payout': HandCoins,
  'mark-passed': Check,
  advance: ArrowRight,
} as const;



const ATTENTION_STATE_ICONS = {
  failed: XCircle,
  payout_ready: CircleDollarSign,
  passed: CheckCircle,
} as const;

const attentionActionLabel = (attention: RibbonAttention): string =>
  attention.action === 'advance'
    ? t('account.prop-challenge.ribbon.action.advance', {
        phase: attention.nextPhase.name,
      })
    : t(`account.prop-challenge.ribbon.action.${attention.action}`);




const attentionActionText = (
  attention: RibbonAttention,
  actionLabel: string
): string => {
  if (attention.action === 'advance') {
    return t('account.prop-challenge.ribbon.action.advance-short');
  }
  if (attention.action === 'record-payout') {
    return t('account.prop-challenge.ribbon.action.record-payout-short');
  }
  return actionLabel;
};

function buildRibbonSegments({
  challenge,
  currentPhase,
  ribbonEvaluationStatus,
  challengeStatus,
  ruleReviewRequired,
  masked,
}: {
  challenge: PropChallengeConfig;
  currentPhase: PropChallengePhase;
  ribbonEvaluationStatus: PropChallengePhaseEvaluation['status'];
  challengeStatus: ChallengeCardStatus | undefined;
  ruleReviewRequired: boolean;
  masked: boolean;
}): PhaseRibbonSegment[] {
  return getRibbonItems(challenge.phases, currentPhase.id).map((item) => {
    if (item.kind === 'ellipsis') {
      return {
        key: item.id,
        label: '…',
        tone: 'pending' as const,
        className: 'is-ellipsis',
        isComplete: false,
        isEllipsis: true,
        status: undefined,
        statusLabel: undefined,
      };
    }
    const status = getPhaseStatus(
      item.phase,
      currentPhase,
      challenge,
      ribbonEvaluationStatus,
      masked
    );
    const isCurrent =
      item.phase.id === currentPhase.id &&
      challenge.status === 'active' &&
      status !== 'pending' &&
      status !== 'passed';
    const isComplete = !masked && status === 'passed';
    const statusLabel =
      item.phase.id === currentPhase.id &&
      challengeStatus &&
      challengeStatus !== 'active'
        ? challengeStatusLabel(challengeStatus, ruleReviewRequired)
        : undefined;
    
    
    const tone: RibbonTone =
      statusLabel && challengeStatus === 'payout_ready'
        ? 'current-payout'
        : statusLabel && challengeStatus === 'passed'
          ? 'current-passed'
          : getRibbonTone(status, isCurrent);
    return {
      key: item.phase.id,
      label: item.phase.name,
      tone,
      className: `is-${status}${isCurrent ? ' is-current' : ''}`,
      isComplete,
      isEllipsis: false,
      status: challengeStatus,
      statusLabel,
    };
  });
}


function visibleRibbonSegments(
  mode: RibbonMode,
  segments: PhaseRibbonSegment[],
  currentPhase: PropChallengePhase
): PhaseRibbonSegment[] {
  
  
  const liveSegment = segments.find(
    (segment) => segment.key === currentPhase.id
  );
  if (mode.kind === 'full' || !liveSegment) return segments;
  if (mode.kind === 'attention' && mode.state !== 'payout_ready') {
    return [
      {
        ...liveSegment,
        label: t(`account.prop-challenge.ribbon.${mode.state}`, {
          phase: currentPhase.name,
        }),
      },
    ];
  }
  return [liveSegment];
}


const PhaseRibbonAction: React.FC<{
  attention: RibbonAttention;
  fromTone: RibbonTone;
  data: AccountPageData;
  challenge: PropChallengeConfig;
  evaluation: PropChallengePhaseEvaluation;
  payoutEvaluation?: PropChallengePayoutEvaluation;
  onActionHover?: (hovered: boolean) => void;
}> = ({
  attention,
  fromTone,
  data,
  challenge,
  evaluation,
  payoutEvaluation,
  onActionHover,
}) => {
  const plugin = usePlugin();
  const [busy, setBusy] = useState(false);
  const actionLabel = attentionActionLabel(attention);
  const ActionIcon = ATTENTION_ACTION_ICONS[attention.action];
  const isAdvance = attention.action === 'advance';

  const runAttentionAction = async (action: RibbonAttentionAction) => {
    if (!plugin) return;
    setBusy(true);
    try {
      const context: LifecycleActionContext = {
        plugin,
        app: plugin.app,
        accountName: data.account.name,
        ...(data.account.accountId
          ? { accountId: data.account.accountId }
          : {}),
        challenge,
        evaluation,
        trades: data.trades,
      };
      if (action === 'record-payout') {
        openAddEventModal(plugin.app, plugin, data.account.name, () => {}, {
          type: TransactionType.WITHDRAWAL,
          ...(payoutEvaluation
            ? {
                amount: suggestPropChallengePayoutAmount(
                  challenge.payoutPlan,
                  payoutEvaluation
                ),
              }
            : {}),
          description: t('account.prop-challenge.notice.payout-description'),
        });
        return;
      }
      if (action === 'archive') {
        await applyPropChallengeLifecycleAction(context, 'archive');
        return;
      }
      
      
      await runPropChallengeAdvance(context);
    } catch (error) {
      console.error('Failed to apply prop challenge ribbon action:', error);
      new Notice(t('account.prop-challenge.notice.error'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <li
        className={`journalit-account-phase-ribbon-connector from-${fromTone} to-action`}
        aria-hidden="true"
      />
      <li
        className={`journalit-account-phase-ribbon-action is-${attention.state}`}
      >
        <button
          type="button"
          className="journalit-account-phase-ribbon-action-button"
          disabled={busy}
          aria-label={actionLabel}
          onPointerEnter={() => onActionHover?.(true)}
          onPointerLeave={() => onActionHover?.(false)}
          onClick={(event) => {
            
            
            event.stopPropagation();
            void runAttentionAction(attention.action);
          }}
        >
          {!isAdvance && (
            <ActionIcon
              size={12}
              aria-hidden="true"
              className="journalit-account-phase-ribbon-action-icon is-leading"
            />
          )}
          <span className="journalit-account-phase-ribbon-action-label">
            {attentionActionText(attention, actionLabel)}
          </span>
          {isAdvance && (
            <ActionIcon
              size={12}
              aria-hidden="true"
              className="journalit-account-phase-ribbon-action-icon is-trailing"
            />
          )}
        </button>
      </li>
    </>
  );
};

export const PhaseRibbon: React.FC<{
  data: AccountPageData;
  challenge: PropChallengeConfig;
  currentPhase: PropChallengePhase;
  evaluation: PropChallengePhaseEvaluation;
  payoutEvaluation?: PropChallengePayoutEvaluation;
  fundedLimitWarning?: boolean;
  masked: boolean;
  className?: string;
  
  onActionHover?: (hovered: boolean) => void;
}> = ({
  data,
  challenge,
  currentPhase,
  evaluation,
  payoutEvaluation,
  fundedLimitWarning,
  masked,
  className,
  onActionHover,
}) => {
  const evaluationStatus = evaluation.status;
  const payoutStatus = payoutEvaluation?.status;
  const isFundedStage = isFundedPhase(currentPhase);
  const ribbonEvaluationStatus =
    isFundedStage && evaluationStatus === 'warning' && !fundedLimitWarning
      ? 'active'
      : evaluationStatus;
  const ruleReviewRequired = isReviewOnlyWarning(
    evaluation.rules,
    isFundedStage
  );
  const challengeStatus = getChallengeCardStatus(
    challenge,
    evaluationStatus,
    masked,
    currentPhase,
    payoutStatus,
    fundedLimitWarning
  );
  const segments = buildRibbonSegments({
    challenge,
    currentPhase,
    ribbonEvaluationStatus,
    challengeStatus,
    ruleReviewRequired,
    masked,
  });

  const mode = getRibbonMode({
    challenge,
    currentPhase,
    challengeStatus,
    accountArchived: data.account.accountType === 'archived',
    masked,
  });
  const attention = mode.kind === 'attention' ? mode : undefined;
  const visibleSegments = visibleRibbonSegments(mode, segments, currentPhase);
  const attentionStateIcon = attention
    ? ATTENTION_STATE_ICONS[attention.state]
    : undefined;

  
  
  

  return (
    <ol
      className={`journalit-account-phase-ribbon${attention ? ` is-attention is-${attention.state}` : ''}${className ? ` ${className}` : ''}`}
    >
      {visibleSegments.map((segment, index) => {
        const state = ribbonSegmentState(segment);
        const Icon = attentionStateIcon ?? ribbonSegmentIcon(state);
        const stateLabel = state
          ? challengeStatusLabel(
              state,
              ruleReviewRequired && segment.key === currentPhase.id
            )
          : undefined;
        return (
          <React.Fragment key={segment.key}>
            {index > 0 && (
              <li
                className={`journalit-account-phase-ribbon-connector from-${visibleSegments[index - 1].tone} to-${segment.tone}`}
                aria-hidden="true"
              />
            )}
            <li
              className={`journalit-account-phase-ribbon-segment ${segment.className}${state ? ` is-state-${state}` : ''}${segment.statusLabel ? ' has-state' : ''}`}
              aria-hidden={segment.isEllipsis ? 'true' : undefined}
            >
              {Icon && stateLabel && (
                <Icon
                  size={attention ? 12 : 10}
                  role="img"
                  aria-label={stateLabel}
                  className="journalit-account-phase-ribbon-icon"
                />
              )}
              <span className="journalit-account-phase-ribbon-name">
                {segment.label}
              </span>
            </li>
          </React.Fragment>
        );
      })}
      {attention && (
        <PhaseRibbonAction
          attention={attention}
          fromTone={visibleSegments[visibleSegments.length - 1].tone}
          data={data}
          challenge={challenge}
          evaluation={evaluation}
          payoutEvaluation={payoutEvaluation}
          onActionHover={onActionHover}
        />
      )}
    </ol>
  );
};
