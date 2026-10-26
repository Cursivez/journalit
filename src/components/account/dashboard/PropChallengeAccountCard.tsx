import React, { useMemo, useState } from 'react';
import { useCurrency } from '../../../contexts/CurrencyContext';
import { useDisplayFormatter } from '../../../hooks/useDisplayPolicy';
import { AccountCopyBadges, useCopiedByAccounts } from './AccountCopyBadges';
import { usePropChallengeReconciliation } from '../../../hooks/usePropChallengeReconciliation';
import { t } from '../../../lang/helpers';
import type { AccountPageData } from '../../../services/accountPage/types';
import { evaluatePropChallengePayout } from '../../../services/propChallenge/PropChallengePayoutEngine';
import { getCurrentPropChallengePhase } from '../../../services/propChallenge/PropChallengeConfig';
import {
  evaluatePropChallengePhase,
  hasFundedLimitWarning,
  isHardPropChallengeRuleBreach,
  isPropChallengeAchievementRule,
  type PropChallengePhaseEvaluation,
  type PropChallengeRuleEvaluation,
} from '../../../services/propChallenge/PropChallengeRuleEngine';
import type { CurrencyCode } from '../../../utils/currencyConfig';
import { cssVars } from '../../../styles/inlineStylePolicy';
import {
  AccountCardFooter,
  AccountKeyMetrics,
  calculateAccountCardDetailMetrics,
} from './AccountCardDetails';
import {
  PhaseRibbon,
  getChallengeCardStatus,
  isFundedPhase,
} from './PhaseRibbon';

type RuleProgressState = 'default' | 'satisfied' | 'breached' | 'warning';

function getRuleProgressState(
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


function displayedCardRules(
  rules: PropChallengePhaseEvaluation['rules'],
  fundedStage: boolean
) {
  const profitTarget = rules.find((rule) => rule.kind === 'profit_target');
  const drawdown = rules.find((rule) => rule.kind === 'drawdown');
  const dailyLoss = rules.find((rule) => rule.kind === 'daily_loss_limit');
  const minimumDays = rules.find(
    (rule) => rule.kind === 'minimum_trading_days'
  );
  const displayedDrawdown =
    drawdown && fundedStage
      ? {
          ...drawdown,
          progress:
            drawdown.limit > 0 ? drawdown.currentUsed / drawdown.limit : 0,
          warning: drawdown.currentBufferWarning,
        }
      : drawdown;
  const displayedDailyLoss =
    dailyLoss && fundedStage
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
  return { profitTarget, displayedDrawdown, displayedDailyLoss, minimumDays };
}

const PropChallengeCardRules: React.FC<{
  rules: PropChallengePhaseEvaluation['rules'];
  fundedStage: boolean;
  currency: CurrencyCode;
  progressMasked: boolean;
  hasBreachedRule: boolean;
}> = ({ rules, fundedStage, currency, progressMasked, hasBreachedRule }) => {
  const { formatValue } = useDisplayFormatter();
  const { profitTarget, displayedDrawdown, displayedDailyLoss, minimumDays } =
    displayedCardRules(rules, fundedStage);
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
    <>
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
              value: Math.max(0, Math.min(1, displayedDrawdown.progress)) * 100,
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
              label={t('account.prop-challenge.summary.rule.daily_loss_limit')}
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
    </>
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
        <PropChallengeCardRules
          rules={evaluation.rules}
          fundedStage={isFundedPhase(currentPhase)}
          currency={currency}
          progressMasked={progressMasked}
          hasBreachedRule={hasBreachedRule}
        />
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
