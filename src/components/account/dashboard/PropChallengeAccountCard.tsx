import React, { useMemo, useState } from 'react';
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
import { useCurrency } from '../../../contexts/CurrencyContext';
import { useDisplayFormatter } from '../../../hooks/useDisplayPolicy';
import { usePlugin } from '../../../hooks/usePlugin';
import { AccountCopyBadges, useCopiedByAccounts } from './AccountCopyBadges';
import { usePropChallengeReconciliation } from '../../../hooks/usePropChallengeReconciliation';
import { t } from '../../../lang/helpers';
import type { AccountPageData } from '../../../services/accountPage/types';
import { suggestPropChallengePayoutAmount } from '../../../services/propChallenge/PropChallengeNotices';
import {
  evaluatePropChallengePayout,
  type PropChallengePayoutEvaluation,
} from '../../../services/propChallenge/PropChallengePayoutEngine';
import { getCurrentPropChallengePhase } from '../../../services/propChallenge/PropChallengeConfig';
import {
  evaluatePropChallengePhase,
  hasFundedLimitWarning,
  isHardPropChallengeRuleBreach,
  isPropChallengeAchievementRule,
  type PropChallengePhaseEvaluation,
  type PropChallengePhaseEvaluationStatus,
  type PropChallengeRuleEvaluation,
} from '../../../services/propChallenge/PropChallengeRuleEngine';
import type {
  PropChallengeConfig,
  PropChallengePhase,
} from '../../../services/propChallenge/types';
import { TransactionType } from '../../../services/account/types';
import { cssVars } from '../../../styles/inlineStylePolicy';
import { openAddEventModal } from '../../accountPage/components/AddEventModal';
import {
  applyPropChallengeLifecycleAction,
  runPropChallengeAdvance,
  type LifecycleActionContext,
} from '../../accountPage/components/propChallenge/propChallengeLifecycleActions';
import {
  AccountCardFooter,
  AccountKeyMetrics,
  calculateAccountCardDetailMetrics,
} from './AccountCardDetails';

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

type RuleProgressState = 'default' | 'satisfied' | 'breached' | 'warning';

export function getRuleProgressState(
  rule:
    | (Pick<
        PropChallengeRuleEvaluation,
        'kind' | 'satisfied' | 'breached' | 'warning'
      > & { breachAction?: 'fail' | 'suspend_until_next_session' })
    | undefined,
  masked: boolean,
  hasBreachedRule: boolean
): RuleProgressState {
  if (masked || !rule) return 'default';
  if (
    rule.breached &&
    (rule.kind !== 'daily_loss_limit' || rule.breachAction === 'fail')
  )
    return 'breached';
  if (rule.breached) return 'warning';
  if (rule.warning && !hasBreachedRule) return 'warning';
  if (rule.satisfied && isPropChallengeAchievementRule(rule.kind)) {
    return 'satisfied';
  }
  return 'default';
}

export function getRibbonItems(
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

export function getPhaseStatus(
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


export function getRibbonTone(
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


export function getRibbonMode(args: {
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

const PhaseRibbon: React.FC<{
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
  const plugin = usePlugin();
  const [busy, setBusy] = useState(false);
  const evaluationStatus = evaluation.status;
  const payoutStatus = payoutEvaluation?.status;
  const isFundedStage =
    currentPhase.stage === 'sim_funded' || currentPhase.stage === 'live_funded';
  const ribbonEvaluationStatus =
    isFundedStage && evaluationStatus === 'warning' && !fundedLimitWarning
      ? 'active'
      : evaluationStatus;
  const challengeStatus = getChallengeCardStatus(
    challenge,
    evaluationStatus,
    masked,
    currentPhase,
    payoutStatus,
    fundedLimitWarning
  );
  const segments: PhaseRibbonSegment[] = getRibbonItems(
    challenge.phases,
    currentPhase.id
  ).map((item) => {
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
        ? t(`account.prop-challenge.summary.status.${challengeStatus}`)
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

  const mode = getRibbonMode({
    challenge,
    currentPhase,
    challengeStatus,
    accountArchived: data.account.accountType === 'archived',
    masked,
  });
  const attention = mode.kind === 'attention' ? mode : undefined;
  
  
  const liveSegment = segments.find(
    (segment) => segment.key === currentPhase.id
  );
  
  
  
  
  const visibleSegments =
    mode.kind === 'full' || !liveSegment
      ? segments
      : [
          attention && attention.state !== 'payout_ready'
            ? {
                ...liveSegment,
                label: t(`account.prop-challenge.ribbon.${attention.state}`, {
                  phase: currentPhase.name,
                }),
              }
            : liveSegment,
        ];
  
  const ActionIcon = !attention
    ? undefined
    : attention.action === 'archive'
      ? Archive
      : attention.action === 'record-payout'
        ? HandCoins
        : attention.action === 'mark-passed'
          ? Check
          : ArrowRight;
  const actionLabel = !attention
    ? undefined
    : attention.action === 'advance'
      ? t('account.prop-challenge.ribbon.action.advance', {
          phase: attention.nextPhase.name,
        })
      : t(`account.prop-challenge.ribbon.action.${attention.action}`);
  
  
  
  const actionText =
    attention?.action === 'advance'
      ? t('account.prop-challenge.ribbon.action.advance-short')
      : attention?.action === 'record-payout'
        ? t('account.prop-challenge.ribbon.action.record-payout-short')
        : actionLabel;
  
  
  const attentionStateIcon = !attention
    ? undefined
    : attention.state === 'failed'
      ? XCircle
      : attention.state === 'payout_ready'
        ? CircleDollarSign
        : CheckCircle;

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
    <ol
      className={`journalit-account-phase-ribbon${attention ? ` is-attention is-${attention.state}` : ''}${className ? ` ${className}` : ''}`}
    >
      {visibleSegments.map((segment, index) => {
        const state = ribbonSegmentState(segment);
        const Icon = attentionStateIcon ?? ribbonSegmentIcon(state);
        const stateLabel = state
          ? t(`account.prop-challenge.summary.status.${state}`)
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
      {attention && actionLabel && (
        <>
          <li
            className={`journalit-account-phase-ribbon-connector from-${visibleSegments[visibleSegments.length - 1].tone} to-action`}
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
              {ActionIcon && attention.action !== 'advance' && (
                <ActionIcon
                  size={12}
                  aria-hidden="true"
                  className="journalit-account-phase-ribbon-action-icon is-leading"
                />
              )}
              <span className="journalit-account-phase-ribbon-action-label">
                {actionText}
              </span>
              {ActionIcon && attention.action === 'advance' && (
                <ActionIcon
                  size={12}
                  aria-hidden="true"
                  className="journalit-account-phase-ribbon-action-icon is-trailing"
                />
              )}
            </button>
          </li>
        </>
      )}
    </ol>
  );
};

const RuleProgress: React.FC<{
  label: string;
  rule: PropChallengeRuleEvaluation | undefined;
  value: string;
  masked: boolean;
  hasBreachedRule: boolean;
}> = ({ label, rule, value, masked, hasBreachedRule }) => {
  const width = !masked && rule ? Math.max(0, Math.min(1, rule.progress)) : 0;
  const state = getRuleProgressState(rule, masked, hasBreachedRule);
  const stateClass = state === 'default' ? '' : ` is-${state}`;

  return (
    <div
      className={`progress-item journalit-account-rule-progress${stateClass}`}
    >
      <div className="progress-header journalit-account-rule-progress-header">
        <span className="progress-label">{label}</span>
        <strong className="progress-value">{value}</strong>
      </div>
      <div className="progress-bar-container journalit-account-rule-progress-track">
        <span
          className="progress-bar journalit-account-rule-progress-fill"
          data-is-zero={masked || !rule || width <= 0}
          style={cssVars({
            '--journalit-account-progress-width': `${width * 100}%`,
          })}
        />
      </div>
    </div>
  );
};

const RuleMetric: React.FC<{
  label: string;
  rule: PropChallengeRuleEvaluation;
  value: string;
  masked: boolean;
  hasBreachedRule: boolean;
}> = ({ label, rule, value, masked, hasBreachedRule }) => {
  const state = getRuleProgressState(rule, masked, hasBreachedRule);
  const stateClass = state === 'default' ? '' : ` is-${state}`;

  return (
    <div className={`journalit-account-prop-rule-metric${stateClass}`}>
      <span className="progress-label">{label}</span>
      <strong className="progress-value">{value}</strong>
    </div>
  );
};

export const PropChallengeAccountCard: React.FC<{
  data: AccountPageData;
  tradingDayCutoffTime?: string;
  onClick: () => void;
}> = ({ data, tradingDayCutoffTime, onClick }) => {
  const { currency: globalCurrency } = useCurrency();
  const { formatValue, shouldMask } = useDisplayFormatter();
  const [actionHovered, setActionHovered] = useState(false);
  const challenge = data.account.propChallenge;
  const currentPhase = challenge
    ? getCurrentPropChallengePhase(challenge)
    : undefined;
  const evaluation = useMemo(
    () =>
      challenge && currentPhase
        ? evaluatePropChallengePhase({
            phase: currentPhase,
            config: challenge,
            trades: data.trades,
            transactions: data.account.transactions,
            tradingDayCutoffTime,
          })
        : null,
    [
      challenge,
      currentPhase,
      data.account.transactions,
      data.trades,
      tradingDayCutoffTime,
    ]
  );
  const payoutEvaluation = useMemo(
    () =>
      currentPhase?.payoutPolicy && evaluation
        ? evaluatePropChallengePayout({
            phase: currentPhase,
            config: challenge,
            policy: currentPhase.payoutPolicy,
            evaluation,
            trades: data.trades,
            transactions: data.account.transactions,
            tradingDayCutoffTime,
          })
        : undefined,
    [
      challenge,
      currentPhase,
      data.account.transactions,
      data.trades,
      evaluation,
      tradingDayCutoffTime,
    ]
  );

  usePropChallengeReconciliation({
    accountPageData: data,
    evaluation,
    payoutEvaluation,
  });

  const copiedByAccounts = useCopiedByAccounts(data.account.name);

  if (!challenge || !currentPhase || !evaluation) return null;

  const currency = data.account.currency || globalCurrency;
  const moneyMasked = shouldMask('pnl');
  const progressMasked = moneyMasked || shouldMask('percentage');
  const profitTarget = evaluation.rules.find(
    (rule) => rule.kind === 'profit_target'
  );
  const drawdown = evaluation.rules.find((rule) => rule.kind === 'drawdown');
  const dailyLoss = evaluation.rules.find(
    (rule) => rule.kind === 'daily_loss_limit'
  );
  const minimumDays = evaluation.rules.find(
    (rule) => rule.kind === 'minimum_trading_days'
  );
  const isFundedStage =
    currentPhase.stage === 'sim_funded' || currentPhase.stage === 'live_funded';
  const displayedDrawdown =
    drawdown && isFundedStage
      ? {
          ...drawdown,
          progress:
            drawdown.limit > 0 ? drawdown.currentUsed / drawdown.limit : 0,
          warning: drawdown.currentBufferWarning,
        }
      : drawdown;
  const displayedDailyLoss =
    dailyLoss && isFundedStage
      ? {
          ...dailyLoss,
          current: dailyLoss.currentTradingDayMaximumLoss,
          progress:
            dailyLoss.target > 0
              ? dailyLoss.currentTradingDayMaximumLoss / dailyLoss.target
              : 0,
          warning: dailyLoss.currentTradingDayWarning,
        }
      : dailyLoss;
  const cardMetrics = calculateAccountCardDetailMetrics(data.account);
  const hasBreachedRule = evaluation.rules.some(isHardPropChallengeRuleBreach);
  const fundedLimitWarning = hasFundedLimitWarning(evaluation.rules);
  const challengeStatus = getChallengeCardStatus(
    challenge,
    evaluation.status,
    moneyMasked,
    currentPhase,
    payoutEvaluation?.status,
    fundedLimitWarning
  );
  const minimumDaysValue = minimumDays
    ? progressMasked
      ? formatValue({
          kind: 'percentage',
          value: minimumDays.progress * 100,
          signed: false,
          precision: 0,
        })
      : `${formatValue({ kind: 'metric', value: minimumDays.current })} / ${formatValue({ kind: 'metric', value: minimumDays.target })}`
    : '';

  return (
    
    
    
    
    <div
      className={`account-card is-prop-challenge${challengeStatus ? ` is-${challengeStatus}` : ''}${actionHovered ? ' is-action-hover' : ''}`}
      onClick={onClick}
    >
      <div className="account-card-header">
        <div className="account-identity has-inline-badges">
          <button
            type="button"
            className="account-name journalit-account-card-name"
            onClick={(event) => {
              event.stopPropagation();
              onClick();
            }}
          >
            {data.account.name}
          </button>
          
          <AccountCopyBadges
            account={data.account}
            copiedByAccounts={copiedByAccounts}
          />
        </div>
        <div className="account-balance">
          <div className="balance-amount">
            {formatValue({
              kind: 'balance',
              
              
              
              
              value: evaluation.currentBalance,
              currencyCode: currency,
              notation: 'compact',
            })}
          </div>
        </div>
        
        <PhaseRibbon
          data={data}
          challenge={challenge}
          currentPhase={currentPhase}
          evaluation={evaluation}
          fundedLimitWarning={fundedLimitWarning}
          payoutEvaluation={payoutEvaluation}
          masked={moneyMasked}
          className="is-in-header"
          onActionHover={setActionHovered}
        />
      </div>
      <div className="account-card-body journalit-account-prop-card-content">
        <AccountKeyMetrics
          account={data.account}
          currency={currency}
          metrics={cardMetrics}
          formatValue={formatValue}
        />
        <div className="progress-section journalit-account-prop-progress-list">
          {profitTarget && (
            <RuleProgress
              label={t('account.prop-challenge.rule.profit_target')}
              rule={profitTarget}
              value={formatValue({
                kind: 'percentage',
                value: Math.max(0, Math.min(1, profitTarget.progress)) * 100,
                signed: false,
                precision: 1,
              })}
              masked={progressMasked}
              hasBreachedRule={hasBreachedRule}
            />
          )}
          {displayedDrawdown && (
            <RuleProgress
              label={t(
                `account.prop-challenge.summary.rule.drawdown-${displayedDrawdown.mode}`
              )}
              rule={displayedDrawdown}
              value={formatValue({
                kind: 'percentage',
                value:
                  Math.max(0, Math.min(1, displayedDrawdown.progress)) * 100,
                signed: false,
                precision: 1,
              })}
              masked={progressMasked}
              hasBreachedRule={hasBreachedRule}
            />
          )}
        </div>
        {(displayedDailyLoss || minimumDays) && (
          <div className="journalit-account-prop-secondary-rules">
            {displayedDailyLoss && (
              <RuleMetric
                label={t(
                  'account.prop-challenge.summary.rule.daily_loss_limit'
                )}
                rule={displayedDailyLoss}
                value={`${formatValue({
                  kind: 'risk',
                  value: displayedDailyLoss.current,
                  currencyCode: currency,
                  signed: false,
                  notation: 'compact',
                })} / ${formatValue({
                  kind: 'risk',
                  value: displayedDailyLoss.target,
                  currencyCode: currency,
                  signed: false,
                  notation: 'compact',
                })}`}
                masked={progressMasked}
                hasBreachedRule={hasBreachedRule}
              />
            )}
            {minimumDays && (
              <RuleMetric
                label={t(
                  'account.prop-challenge.summary.rule.minimum_trading_days'
                )}
                rule={minimumDays}
                value={minimumDaysValue}
                masked={progressMasked}
                hasBreachedRule={hasBreachedRule}
              />
            )}
          </div>
        )}
        <AccountCardFooter
          account={data.account}
          currency={currency}
          metrics={cardMetrics}
          formatValue={formatValue}
        />
      </div>
    </div>
  );
};
