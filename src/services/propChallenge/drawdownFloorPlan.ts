

import type { AccountTransaction } from '../account/types';
import type { AccountTradeData } from '../accountPage/types';
import {
  evaluatePropChallengePhase,
  latestPropChallengeDrawdownFloor,
  removeLatestPropChallengeDrawdownFloor,
  setPropChallengeDrawdownFloor,
  type PropChallengeRuleEvaluation,
  type TrailingDrawdownRule,
} from './PropChallengeRuleEngine';
import type {
  PropChallengeConfig,
  PropChallengeDrawdownFloorAdjustment,
  PropChallengePhase,
} from './types';

type DrawdownEvaluation = Extract<
  PropChallengeRuleEvaluation,
  { kind: 'drawdown' }
>;


export interface DrawdownFloorContext {
  config: PropChallengeConfig;
  phase: PropChallengePhase;
  rule: TrailingDrawdownRule;
  trades: readonly AccountTradeData[];
  transactions: readonly AccountTransaction[];
  tradingDayCutoffTime?: string;
  now: Date;
}


export type DrawdownFloorProblem =
  | { kind: 'at-balance'; balance: number }
  | { kind: 'above-lock'; lock: number }
  | { kind: 'too-low'; amount: number }
  | { kind: 'below-start'; floor: number };


export interface DrawdownFloorState {
  balance: number;
  
  failedAt?: Date;
  rule?: DrawdownEvaluation;
}


const CENT = 0.005;

function engineInput(context: DrawdownFloorContext, phase: PropChallengePhase) {
  return {
    phase,
    config: context.config,
    trades: context.trades,
    transactions: context.transactions,
    tradingDayCutoffTime: context.tradingDayCutoffTime,
    now: context.now,
  };
}


export function withPropChallengePhase(
  config: PropChallengeConfig,
  phase: PropChallengePhase
): PropChallengeConfig {
  return {
    ...config,
    phases: config.phases.map((candidate) =>
      candidate.id === phase.id ? phase : candidate
    ),
  };
}

export function drawdownFloorState(
  context: DrawdownFloorContext,
  phase: PropChallengePhase = context.phase
): DrawdownFloorState {
  const evaluation = evaluatePropChallengePhase(engineInput(context, phase));
  return {
    balance: evaluation.currentBalance,
    
    
    failedAt: evaluation.failure?.date,
    rule: evaluation.rules.find(
      (rule): rule is DrawdownEvaluation =>
        rule.kind === 'drawdown' && rule.ruleId === context.rule.id
    ),
  };
}


function floorProblem(
  floor: number,
  context: DrawdownFloorContext,
  current: DrawdownFloorState,
  after: DrawdownEvaluation | undefined
): DrawdownFloorProblem | undefined {
  const { rule, phase } = context;
  const { balance } = current;
  const currentFloor = current.rule?.currentFloor;
  if (floor >= balance - CENT) return { kind: 'at-balance', balance };
  
  const highestFloor =
    rule.lockAtBalance === undefined
      ? undefined
      : Math.max(rule.lockAtBalance, currentFloor ?? rule.lockAtBalance);
  if (highestFloor !== undefined && floor > highestFloor + CENT) {
    return { kind: 'above-lock', lock: highestFloor };
  }
  if (
    after &&
    rule.mode === 'intraday_trailing' &&
    !after.floorLocked &&
    floor < balance - rule.amount - CENT
  ) {
    return { kind: 'too-low', amount: rule.amount };
  }
  const lowestFloor = Math.min(
    phase.startingBalance - rule.amount,
    currentFloor ?? Number.POSITIVE_INFINITY
  );
  if (floor < lowestFloor - CENT) {
    return { kind: 'below-start', floor: lowestFloor };
  }
  return undefined;
}

export interface DrawdownFloorSetPlan {
  current: DrawdownFloorState;
  
  phase: PropChallengePhase;
  
  after: DrawdownEvaluation | undefined;
  problem?: DrawdownFloorProblem;
  
  replaces?: PropChallengeDrawdownFloorAdjustment;
}

export function planDrawdownFloor(
  context: DrawdownFloorContext,
  floor: number,
  current: DrawdownFloorState = drawdownFloorState(context)
): DrawdownFloorSetPlan {
  const { phase, rule } = context;
  const latest = latestPropChallengeDrawdownFloor(phase, rule.id);
  const next = setPropChallengeDrawdownFloor(
    engineInput(context, phase),
    rule.id,
    floor
  );
  const after = drawdownFloorState(context, next).rule;
  const problem = floorProblem(floor, context, current, after);
  const replaces =
    latest && !next.drawdownFloorAdjustments?.includes(latest)
      ? latest
      : undefined;
  return {
    current,
    phase: next,
    after,
    ...(problem ? { problem } : {}),
    ...(replaces ? { replaces } : {}),
  };
}

export interface DrawdownFloorRemovalPlan {
  removed: PropChallengeDrawdownFloorAdjustment;
  phase: PropChallengePhase;
  after: DrawdownEvaluation | undefined;
  
  failsAt?: Date;
}


export function planDrawdownFloorRemoval(
  context: DrawdownFloorContext,
  current: DrawdownFloorState = drawdownFloorState(context)
): DrawdownFloorRemovalPlan | undefined {
  const { phase, rule } = context;
  const removed = latestPropChallengeDrawdownFloor(phase, rule.id);
  if (!removed) return undefined;
  const next = removeLatestPropChallengeDrawdownFloor(phase, rule.id);
  const without = drawdownFloorState(context, next);
  const failsAt = current.failedAt ? undefined : without.failedAt;
  return {
    removed,
    phase: next,
    after: without.rule,
    ...(failsAt ? { failsAt } : {}),
  };
}
