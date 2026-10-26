

import {
  DrawdownType,
  ProfitTargetType,
  type AccountData,
} from '../account/types';
import {
  getCurrentPropChallengePhase,
  resolvePhaseProfitTarget,
} from './PropChallengeConfig';
import { policyAt } from './PropChallengePolicyHistory';
import { isAuthoritativeDrawdown } from './PropChallengeRuleReview';
import type { PropChallengeConfig } from './types';

type PropChallengeDrawdownMode =
  | 'static'
  | 'eod_trailing'
  | 'intraday_trailing';

export interface ProjectedPropChallengeRules {
  phaseId: string;
  
  startingBalance: number;
  
  startMs?: number;
  endMs: number;
  drawdown?: {
    mode: PropChallengeDrawdownMode;
    amount: number;
    
    lockAtBalance?: number;
  };
  
  profitTargetValue?: number;
  
  profitTargetNeedsBalance?: { percent: number };
}


export function projectCurrentPropChallengeRules(
  config: PropChallengeConfig | undefined,
  now: Date = new Date(),
  
  phaseId?: string | null
): ProjectedPropChallengeRules | undefined {
  if (!config) return undefined;
  const phase =
    (phaseId
      ? config.phases.find((candidate) => candidate.id === phaseId)
      : undefined) ?? getCurrentPropChallengePhase(config);
  if (!phase) return undefined;

  const policy = policyAt(phase, now);
  const drawdownRule = policy.rules.find(
    (rule) => rule.enabled && isAuthoritativeDrawdown(rule)
  );
  const drawdown =
    drawdownRule?.kind === 'drawdown' && drawdownRule.amount > 0
      ? {
          mode: drawdownRule.mode,
          amount: drawdownRule.amount,
          lockAtBalance: drawdownRule.lockAtBalance,
        }
      : undefined;

  const profitTargetRule = policy.rules.find(
    (rule) => rule.enabled && rule.kind === 'profit_target'
  );
  const profitTarget =
    profitTargetRule?.kind === 'profit_target' && profitTargetRule.amount > 0
      ? profitTargetRule
      : undefined;

  const profitTargetAmount = profitTarget
    ? resolvePhaseProfitTarget(profitTarget, phase.startingBalance)
    : undefined;

  const startMs = parseTimestamp(phase.startedAt);
  const endMs = parseTimestamp(phase.completedAt) ?? now.getTime();

  return {
    phaseId: phase.id,
    startingBalance: phase.startingBalance,
    startMs,
    endMs,
    drawdown,
    profitTargetValue:
      profitTargetAmount === undefined
        ? undefined
        : phase.startingBalance + profitTargetAmount,
    ...(profitTarget && profitTargetAmount === undefined
      ? { profitTargetNeedsBalance: { percent: profitTarget.amount } }
      : {}),
  };
}


export function applyPropChallengeRuleProjection(
  account: AccountData,
  now: Date = new Date()
): AccountData {
  const config = account.propChallenge;
  const projection = projectCurrentPropChallengeRules(config, now);
  if (!projection || !config) return account;
  
  if (
    config.phases[0]?.id !== projection.phaseId ||
    projection.startingBalance !== account.initialBalance
  ) {
    return account;
  }

  
  
  
  const needsBalance = projection.profitTargetNeedsBalance;
  if (needsBalance) {
    return {
      ...projectedDrawdown(account, projection.drawdown),
      hasProfitTarget: true,
      profitTarget: needsBalance.percent,
      profitTargetType: ProfitTargetType.PERCENTAGE,
    };
  }

  const profitTarget =
    projection.profitTargetValue === undefined
      ? undefined
      : projection.profitTargetValue - projection.startingBalance;

  return {
    ...projectedDrawdown(account, projection.drawdown),
    hasProfitTarget: profitTarget !== undefined || account.hasProfitTarget,
    profitTarget: profitTarget ?? account.profitTarget,
    profitTargetType:
      profitTarget === undefined
        ? account.profitTargetType
        : ProfitTargetType.ABSOLUTE,
  };
}

function projectedDrawdown(
  account: AccountData,
  drawdown: ProjectedPropChallengeRules['drawdown']
): AccountData {
  if (!drawdown) return account;
  return {
    ...account,
    drawdownType:
      drawdown.mode === 'static'
        ? DrawdownType.FIXED
        : DrawdownType.EOD_TRAILING,
    drawdownAmount: drawdown.amount,
  };
}

function parseTimestamp(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? undefined : timestamp;
}
