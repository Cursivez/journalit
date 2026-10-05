import { TransactionType, type AccountTransaction } from '../account/types';
import type { AccountTradeData } from '../accountPage/types';
import { getTradingDayString } from '../../utils/tradingDayUtils';
import { policyAt, latestCustomTransition } from './PropChallengePolicyHistory';
import {
  doesPhaseOwnTransaction,
  type evaluatePropChallengePhase,
} from './PropChallengeRuleEngine';
import type {
  PropChallengeConfig,
  PropChallengePayoutPolicy,
  PropChallengePayoutMaximum,
  PropChallengePhase,
  PropChallengeProfitSplit,
  PropChallengeWeekday,
} from './types';
import { doesPhaseOwnTradeAt } from './PropChallengeConfig';

function countQualifyingDays(
  dailyProfit: ReadonlyMap<string, number>,
  minimumDailyProfit: number
): number {
  return Array.from(dailyProfit.values()).filter(
    (profit) => profit >= minimumDailyProfit
  ).length;
}

export type PropChallengePayoutRequirement =
  | {
      kind: 'qualifying_days';
      current: number;
      target: number;
      satisfied: boolean;
      minimumDailyProfit: number;
    }
  | {
      kind: 'cycle_days';
      current: number;
      target: number;
      satisfied: boolean;
      minimumDailyProfit?: number;
    }
  | {
      kind: 'cycle_profit';
      current: number;
      target: number;
      satisfied: boolean;
    }
  | {
      kind: 'minimum_balance';
      current: number;
      target: number;
      satisfied: boolean;
    }
  | {
      kind: 'positive_cycle_profit';
      current: number;
      target: number;
      satisfied: boolean;
    }
  | {
      kind: 'consistency';
      
      current: number;
      target: number;
      satisfied: boolean;
      bestDayProfit: number;
      cycleProfit: number;
      
      requiredCycleProfit: number;
    }
  | {
      kind: 'minimum_request';
      current: number;
      target: number;
      satisfied: boolean;
    }
  | {
      kind: 'payout_count';
      current: number;
      target: number;
      satisfied: boolean;
    }
  | {
      kind: 'request_window';
      current: number;
      target: number;
      satisfied: boolean;
      currentWeekday?: PropChallengeWeekday;
      allowedWeekdays: PropChallengeWeekday[];
      timeZone: string;
    }
  | {
      kind: 'elapsed_hours';
      current: number;
      target: number;
      satisfied: boolean;
    };

export interface PropChallengePayoutEvaluation {
  status: 'eligible' | 'not_eligible';
  requirements: PropChallengePayoutRequirement[];
  payoutCount: number;
  cycleProfit: number;
  currentBalance: number;
  availableAmount: number;
  minimumRequest: number;
  maximumRequest: number;
  traderSharePercent: number;
  cumulativeRequestedAmount: number;
  lifetimeQualifyingDays?: {
    current: number;
    target: number;
    unlocked: boolean;
  };
  nextEligibleAt?: Date;
}

interface PropChallengePayoutImpact {
  requestedAmount: number;
  requestAllowed: boolean;
  traderReceives: number;
  postPayoutBalance: number;
  drawdownFloor?: number;
  remainingDrawdownBuffer?: number;
  drawdownEffect: PropChallengePayoutPolicy['afterPayout']['drawdownAction'];
  cycleResets: boolean;
  immediateBreach: boolean;
  accountConcludes: boolean;
  maximumPayoutOutcome?: NonNullable<
    PropChallengePayoutPolicy['afterPayout']['maximumPayoutOutcome']
  >;
}

interface PayoutEngineInput {
  phase: PropChallengePhase;
  config?: PropChallengeConfig;
  policy: PropChallengePayoutPolicy;
  evaluation: ReturnType<typeof evaluatePropChallengePhase>;
  trades: readonly AccountTradeData[];
  transactions: readonly AccountTransaction[];
  now?: Date;
  tradingDayCutoffTime?: string;
}

const DAY_MS = 24 * 60 * 60 * 1000;

function weekdayInTimeZone(
  value: Date,
  timeZone: string
): PropChallengeWeekday | undefined {
  try {
    const weekday = new Intl.DateTimeFormat('en-US', {
      timeZone,
      weekday: 'long',
    })
      .format(value)
      .toLowerCase();
    switch (weekday) {
      case 'monday':
      case 'tuesday':
      case 'wednesday':
      case 'thursday':
      case 'friday':
      case 'saturday':
      case 'sunday':
        return weekday;
      default:
        return undefined;
    }
  } catch {
    return undefined;
  }
}


function firstPhaseTradeEntryAfter(
  trades: readonly AccountTradeData[],
  phases: readonly PropChallengePhase[],
  phase: PropChallengePhase,
  after: Date,
  now: Date
): Date | undefined {
  let earliest: Date | undefined;
  for (const trade of trades) {
    const entryTime = trade.entryTime;
    if (!(entryTime instanceof Date) || Number.isNaN(entryTime.getTime())) {
      continue;
    }
    if (entryTime.getTime() <= after.getTime()) continue;
    if (earliest && entryTime.getTime() >= earliest.getTime()) continue;
    if (!doesPhaseOwnTradeAt(phases, phase, trade, entryTime, now)) continue;
    earliest = entryTime;
  }
  return earliest;
}


function cycleTradingDayCount(
  trades: readonly AccountTradeData[],
  phases: readonly PropChallengePhase[],
  phase: PropChallengePhase,
  cycleStartedAt: Date,
  now: Date,
  tradingDayCutoffTime: string | undefined
): number {
  const days = new Set<string>();
  for (const trade of trades) {
    const entryTime = trade.entryTime;
    if (!(entryTime instanceof Date) || Number.isNaN(entryTime.getTime())) {
      continue;
    }
    if (entryTime.getTime() <= cycleStartedAt.getTime()) continue;
    if (!doesPhaseOwnTradeAt(phases, phase, trade, entryTime, now)) continue;
    days.add(
      getTradingDayString(entryTime, {
        settings: { trade: { tradingDayCutoffTime } },
      })
    );
  }
  return days.size;
}

function maximumForPayout(
  maximumRequest: PropChallengePayoutMaximum,
  payoutCount: number,
  cycleProfit: number
): number {
  switch (maximumRequest.kind) {
    case 'none':
      return Number.POSITIVE_INFINITY;
    case 'fixed':
      return maximumRequest.amount;
    case 'first_fixed_then_none':
      return payoutCount === 0
        ? maximumRequest.amount
        : Number.POSITIVE_INFINITY;
    case 'cycle_profit_percent':
      return Math.max(0, cycleProfit) * (maximumRequest.percent / 100);
    case 'schedule':
      return (
        maximumRequest.amounts[payoutCount] ??
        (maximumRequest.repeatLast
          ? maximumRequest.amounts[maximumRequest.amounts.length - 1]
          : undefined) ??
        0
      );
  }
}

function scheduledValue(
  values: readonly number[],
  payoutCount: number,
  repeatLast?: boolean
): number | undefined {
  return (
    values[payoutCount] ?? (repeatLast ? values[values.length - 1] : undefined)
  );
}

function currentProfitSharePercent(
  split: PropChallengeProfitSplit,
  cumulativeRequestedAmount: number,
  accountProfit: number
): number {
  switch (split.kind) {
    case 'fixed':
      return split.percent;
    case 'cumulative_payout_threshold':
      return cumulativeRequestedAmount < split.thresholdAmount
        ? split.initialPercent
        : split.thereafterPercent;
    case 'account_profit_threshold':
      return accountProfit < split.thresholdProfit
        ? split.belowPercent
        : split.atOrAbovePercent;
  }
}

function traderProceeds(
  split: PropChallengeProfitSplit,
  cumulativeRequestedAmount: number,
  requestedAmount: number,
  accountProfit: number
): number {
  if (split.kind === 'fixed') {
    return requestedAmount * (split.percent / 100);
  }
  if (split.kind === 'account_profit_threshold') {
    const percent =
      accountProfit < split.thresholdProfit
        ? split.belowPercent
        : split.atOrAbovePercent;
    return requestedAmount * (percent / 100);
  }
  const initialRoom = Math.max(
    0,
    split.thresholdAmount - cumulativeRequestedAmount
  );
  const atInitialRate = Math.min(requestedAmount, initialRoom);
  const atThereafterRate = Math.max(0, requestedAmount - atInitialRate);
  return (
    atInitialRate * (split.initialPercent / 100) +
    atThereafterRate * (split.thereafterPercent / 100)
  );
}

export function evaluatePropChallengePayout(
  input: PayoutEngineInput
): PropChallengePayoutEvaluation {
  const now = input.now ?? new Date();
  const phases = input.config?.phases ?? [input.phase];
  const revision = policyAt(input.phase, now);
  if (input.phase.policyHistory && revision.payoutPolicy)
    input = { ...input, policy: revision.payoutPolicy };
  const tradesByPath = new Map<string, AccountTradeData>();
  for (const trade of input.trades) {
    if (trade.path) tradesByPath.set(trade.path, trade);
  }
  
  
  
  
  
  const payoutTransactions = input.transactions
    .filter(
      (transaction) =>
        transaction.type === TransactionType.WITHDRAWAL &&
        doesPhaseOwnTransaction(
          transaction,
          phases,
          input.phase,
          tradesByPath,
          now
        )
    )
    .sort((left, right) => left.date.getTime() - right.date.getTime());
  const payoutCount = payoutTransactions.length;
  const cumulativeRequestedAmount = payoutTransactions.reduce(
    (sum, transaction) => sum + Math.abs(transaction.amount),
    0
  );
  if (input.phase.policyHistory && !revision.payoutPolicy) {
    return {
      status: 'not_eligible',
      requirements: [],
      payoutCount,
      cumulativeRequestedAmount,
      cycleProfit: 0,
      currentBalance: input.evaluation.currentBalance,
      availableAmount: 0,
      minimumRequest: 0,
      maximumRequest: 0,
      traderSharePercent: 0,
    };
  }
  const lastPayoutAt = payoutTransactions[payoutCount - 1]?.date;
  const phaseStartedAt = input.phase.startedAt
    ? new Date(input.phase.startedAt)
    : now;
  let cycleStartedAt =
    input.policy.afterPayout.resetCycle && lastPayoutAt
      ? lastPayoutAt
      : phaseStartedAt;
  const transition =
    revision.transition?.basis === 'preserve'
      ? latestCustomTransition(input.phase, revision.effectiveAt)?.transition
      : revision.transition;
  if (transition?.basis === 'custom') {
    cycleStartedAt = new Date(transition.payoutCycleStartedAt);
    for (const payout of payoutTransactions) {
      if (
        payout.date > cycleStartedAt &&
        policyAt(input.phase, payout.date).payoutPolicy?.afterPayout.resetCycle
      ) {
        cycleStartedAt = payout.date;
      }
    }
  }
  
  
  
  const phaseRealizedEvents = input.transactions
    .flatMap((transaction) =>
      transaction.type === TransactionType.TRADE &&
      doesPhaseOwnTransaction(
        transaction,
        phases,
        input.phase,
        tradesByPath,
        now
      )
        ? [{ date: transaction.date, amount: transaction.amount }]
        : []
    )
    .sort((left, right) => left.date.getTime() - right.date.getTime());
  const cycleEvents = phaseRealizedEvents.filter(
    ({ date }) => date.getTime() > cycleStartedAt.getTime()
  );
  const cycleProfit = cycleEvents.reduce((sum, item) => sum + item.amount, 0);
  const dailyProfit = new Map<string, number>();
  for (const item of cycleEvents) {
    const day = getTradingDayString(item.date, {
      settings: {
        trade: { tradingDayCutoffTime: input.tradingDayCutoffTime },
      },
    });
    dailyProfit.set(day, (dailyProfit.get(day) ?? 0) + item.amount);
  }
  let lifetimeQualifyingDays:
    | PropChallengePayoutEvaluation['lifetimeQualifyingDays']
    | undefined;
  if (
    input.policy.lifetimeQualifyingDaysUnlock &&
    input.policy.cycle.kind === 'qualifying_days'
  ) {
    const minimumDailyProfit = input.policy.cycle.minimumDailyProfit;
    const lifetimeDailyProfit = new Map<string, number>();
    for (const item of phaseRealizedEvents) {
      if (item.date.getTime() < phaseStartedAt.getTime()) continue;
      const day = getTradingDayString(item.date, {
        settings: {
          trade: { tradingDayCutoffTime: input.tradingDayCutoffTime },
        },
      });
      lifetimeDailyProfit.set(
        day,
        (lifetimeDailyProfit.get(day) ?? 0) + item.amount
      );
    }
    const current = Array.from(lifetimeDailyProfit.values()).filter(
      (profit) => profit >= minimumDailyProfit
    ).length;
    lifetimeQualifyingDays = {
      current,
      target: input.policy.lifetimeQualifyingDaysUnlock.days,
      unlocked: current >= input.policy.lifetimeQualifyingDaysUnlock.days,
    };
  }

  const requirements: PropChallengePayoutRequirement[] = [];
  let nextEligibleAt: Date | undefined;
  switch (input.policy.cycle.kind) {
    case 'none':
      break;
    case 'trading_days': {
      const current = cycleTradingDayCount(
        input.trades,
        phases,
        input.phase,
        cycleStartedAt,
        now,
        input.tradingDayCutoffTime
      );
      requirements.push({
        kind: 'cycle_days',
        current,
        target: input.policy.cycle.days,
        satisfied: current >= input.policy.cycle.days,
      });
      break;
    }
    case 'qualifying_days': {
      const minimumDailyProfit = input.policy.cycle.minimumDailyProfit;
      const current = countQualifyingDays(dailyProfit, minimumDailyProfit);
      requirements.push({
        kind: 'cycle_days',
        current,
        target: input.policy.cycle.days,
        minimumDailyProfit,
        satisfied: current >= input.policy.cycle.days,
      });
      break;
    }
    case 'calendar_days': {
      const anchor =
        input.policy.cycle.anchor === 'first_trade'
          ? firstPhaseTradeEntryAfter(
              input.trades,
              phases,
              input.phase,
              cycleStartedAt,
              now
            )
          : cycleStartedAt;
      const current = anchor
        ? Math.max(0, Math.floor((now.getTime() - anchor.getTime()) / DAY_MS))
        : 0;
      requirements.push({
        kind: 'cycle_days',
        current,
        target: input.policy.cycle.days,
        satisfied: current >= input.policy.cycle.days,
      });
      if (anchor && current < input.policy.cycle.days) {
        nextEligibleAt = new Date(
          anchor.getTime() + input.policy.cycle.days * DAY_MS
        );
      }
      break;
    }
  }

  if (input.policy.qualifyingDays) {
    const { days, minimumDailyProfit } = input.policy.qualifyingDays;
    const current = countQualifyingDays(dailyProfit, minimumDailyProfit);
    requirements.push({
      kind: 'qualifying_days',
      current,
      target: days,
      minimumDailyProfit,
      satisfied: current >= days,
    });
  }

  if (input.policy.requestWindow) {
    const currentWeekday = weekdayInTimeZone(
      now,
      input.policy.requestWindow.timeZone
    );
    const satisfied =
      currentWeekday !== undefined &&
      input.policy.requestWindow.weekdays.includes(currentWeekday);
    requirements.push({
      kind: 'request_window',
      current: satisfied ? 1 : 0,
      target: 1,
      satisfied,
      ...(currentWeekday ? { currentWeekday } : {}),
      allowedWeekdays: input.policy.requestWindow.weekdays,
      timeZone: input.policy.requestWindow.timeZone,
    });
  }

  if (input.policy.minimumElapsedHours !== undefined) {
    let firstTradeAt: Date | undefined;
    for (const trade of input.trades) {
      if (
        trade.entryTime >= cycleStartedAt &&
        doesPhaseOwnTradeAt(phases, input.phase, trade, trade.entryTime, now) &&
        (firstTradeAt === undefined ||
          trade.entryTime.getTime() < firstTradeAt.getTime())
      ) {
        firstTradeAt = trade.entryTime;
      }
    }
    const current = firstTradeAt
      ? Math.max(0, (now.getTime() - firstTradeAt.getTime()) / (60 * 60 * 1000))
      : 0;
    const target = input.policy.minimumElapsedHours;
    requirements.push({
      kind: 'elapsed_hours',
      current,
      target,
      satisfied: current >= target,
    });
    if (firstTradeAt && current < target) {
      const eligibleAt = new Date(
        firstTradeAt.getTime() + target * 60 * 60 * 1000
      );
      if (!nextEligibleAt || eligibleAt > nextEligibleAt) {
        nextEligibleAt = eligibleAt;
      }
    }
  }

  if (input.policy.minimumBalance !== undefined) {
    requirements.push({
      kind: 'minimum_balance',
      current: input.evaluation.currentBalance,
      target: input.policy.minimumBalance,
      satisfied: input.evaluation.currentBalance >= input.policy.minimumBalance,
    });
  }

  const requiredCycleProfit =
    payoutCount === 0 && input.policy.firstPayoutCycleProfitExempt
      ? 0
      : (input.policy.minimumCycleProfit ??
        (input.policy.minimumCycleProfitSchedule
          ? scheduledValue(
              input.policy.minimumCycleProfitSchedule.amounts,
              payoutCount,
              input.policy.minimumCycleProfitSchedule.repeatLast
            )
          : undefined));
  if (requiredCycleProfit !== undefined) {
    requirements.push({
      kind: 'cycle_profit',
      current: cycleProfit,
      target: requiredCycleProfit,
      satisfied: cycleProfit >= requiredCycleProfit,
    });
  }

  if (input.policy.requirePositiveCycleProfitAfterFirst && payoutCount > 0) {
    requirements.push({
      kind: 'positive_cycle_profit',
      current: cycleProfit,
      target: 0,
      satisfied: cycleProfit > 0,
    });
  }

  const maxBestDayPercent =
    input.policy.maxBestDayPercent ??
    (input.policy.maxBestDayPercentSchedule
      ? scheduledValue(
          input.policy.maxBestDayPercentSchedule.percents,
          payoutCount,
          input.policy.maxBestDayPercentSchedule.repeatLast
        )
      : undefined);
  if (maxBestDayPercent !== undefined) {
    const bestDay = Math.max(0, ...dailyProfit.values());
    const current = cycleProfit > 0 ? (bestDay / cycleProfit) * 100 : 100;
    requirements.push({
      kind: 'consistency',
      current,
      target: maxBestDayPercent,
      satisfied: cycleProfit > 0 && current <= maxBestDayPercent,
      bestDayProfit: bestDay,
      cycleProfit,
      requiredCycleProfit:
        bestDay > 0 && maxBestDayPercent > 0
          ? bestDay / (maxBestDayPercent / 100)
          : 0,
    });
  }

  const activeLifetimeUnlock = lifetimeQualifyingDays?.unlocked
    ? input.policy.lifetimeQualifyingDaysUnlock
    : undefined;
  const effectiveAvailability =
    activeLifetimeUnlock?.availability ?? input.policy.availability;
  const effectiveMaximumRequest =
    activeLifetimeUnlock?.maximumRequest ?? input.policy.maximumRequest;
  const availabilityFloor =
    effectiveAvailability.kind === 'profit_above_balance_floor'
      ? effectiveAvailability.balanceFloor
      : input.phase.startingBalance;
  const percentageAvailable =
    Math.max(0, input.evaluation.currentBalance - availabilityFloor) *
    (effectiveAvailability.requestPercent / 100);
  const maximumRequest = maximumForPayout(
    effectiveMaximumRequest,
    payoutCount,
    cycleProfit
  );
  const newProfitMaximum =
    input.policy.newProfitPercentOfRequest === undefined
      ? Number.POSITIVE_INFINITY
      : Math.max(0, cycleProfit) /
        (input.policy.newProfitPercentOfRequest / 100);
  const availableAmount = Math.min(
    percentageAvailable,
    maximumRequest,
    newProfitMaximum
  );
  requirements.push({
    kind: 'minimum_request',
    current: availableAmount,
    target: input.policy.minimumRequest,
    satisfied: availableAmount >= input.policy.minimumRequest,
  });
  if (input.policy.maximumPayouts !== undefined) {
    requirements.push({
      kind: 'payout_count',
      current: payoutCount,
      target: input.policy.maximumPayouts,
      satisfied: payoutCount < input.policy.maximumPayouts,
    });
  }

  return {
    
    
    status:
      input.evaluation.status !== 'failed' &&
      requirements.every((requirement) => requirement.satisfied)
        ? 'eligible'
        : 'not_eligible',
    requirements,
    payoutCount,
    cycleProfit,
    currentBalance: input.evaluation.currentBalance,
    availableAmount,
    minimumRequest: input.policy.minimumRequest,
    maximumRequest,
    traderSharePercent: currentProfitSharePercent(
      input.policy.profitSplit,
      cumulativeRequestedAmount,
      input.evaluation.currentBalance -
        input.phase.startingBalance +
        cumulativeRequestedAmount
    ),
    cumulativeRequestedAmount,
    ...(lifetimeQualifyingDays ? { lifetimeQualifyingDays } : {}),
    ...(nextEligibleAt ? { nextEligibleAt } : {}),
  };
}

export function previewPropChallengePayout(
  input: Pick<PayoutEngineInput, 'phase' | 'policy' | 'evaluation'> & {
    payout: PropChallengePayoutEvaluation;
    requestedAmount: number;
  }
): PropChallengePayoutImpact {
  const { afterPayout } = input.policy;
  const requestAllowed =
    input.payout.status === 'eligible' &&
    input.requestedAmount >= input.payout.minimumRequest &&
    input.requestedAmount <= input.payout.availableAmount;
  const postPayoutBalance =
    afterPayout.balanceAction === 'reset_to_starting_balance'
      ? input.phase.startingBalance
      : input.evaluation.currentBalance - input.requestedAmount;
  
  
  
  
  let strictestFloor: number | undefined;
  for (const rule of input.evaluation.rules) {
    if (rule.kind !== 'drawdown') continue;
    strictestFloor =
      strictestFloor === undefined
        ? rule.currentFloor
        : Math.max(strictestFloor, rule.currentFloor);
  }
  let drawdownFloor: number | undefined;
  switch (afterPayout.drawdownAction) {
    case 'unchanged':
      drawdownFloor = strictestFloor;
      break;
    case 'lock_at_balance':
      drawdownFloor = afterPayout.drawdownFloor;
      break;
    case 'reset_from_starting_balance': {
      
      
      
      
      let resetFloor: number | undefined;
      for (const rule of input.phase.rules) {
        if (rule.kind !== 'drawdown' || !rule.enabled) continue;
        const floor = input.phase.startingBalance - rule.amount;
        resetFloor =
          resetFloor === undefined ? floor : Math.max(resetFloor, floor);
      }
      drawdownFloor = resetFloor;
      break;
    }
  }
  const remainingDrawdownBuffer =
    drawdownFloor === undefined ? undefined : postPayoutBalance - drawdownFloor;
  const immediateBreach =
    remainingDrawdownBuffer !== undefined && remainingDrawdownBuffer <= 0;
  const reachesMaximumPayouts =
    input.policy.maximumPayouts !== undefined &&
    input.payout.payoutCount + 1 >= input.policy.maximumPayouts;
  const maximumPayoutOutcome = reachesMaximumPayouts
    ? afterPayout.maximumPayoutOutcome
    : undefined;
  return {
    requestedAmount: input.requestedAmount,
    requestAllowed,
    traderReceives: traderProceeds(
      input.policy.profitSplit,
      input.payout.cumulativeRequestedAmount,
      input.requestedAmount,
      input.evaluation.currentBalance -
        input.phase.startingBalance +
        input.payout.cumulativeRequestedAmount
    ),
    postPayoutBalance,
    ...(drawdownFloor === undefined ? {} : { drawdownFloor }),
    ...(remainingDrawdownBuffer === undefined
      ? {}
      : { remainingDrawdownBuffer }),
    drawdownEffect: afterPayout.drawdownAction,
    cycleResets: afterPayout.resetCycle,
    immediateBreach,
    accountConcludes:
      immediateBreach || maximumPayoutOutcome === 'conclude_account',
    ...(maximumPayoutOutcome ? { maximumPayoutOutcome } : {}),
  };
}
