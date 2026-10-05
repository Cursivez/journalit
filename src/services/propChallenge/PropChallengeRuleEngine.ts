import type { AccountTransaction } from '../account/types';
import { TransactionType } from '../account/types';
import type { AccountTradeData } from '../accountPage/types';
import { getTradingDayString } from '../../utils/tradingDayUtils';
import type {
  PropChallengeConfig,
  PropChallengePhase,
  PropChallengePolicyRevision,
  PropChallengeRule,
} from './types';
import { policyAt, latestCustomTransition } from './PropChallengePolicyHistory';
import { doesPhaseOwnTradeAt } from './PropChallengeConfig';
import { normalizeLiveBalanceAdjustment } from '../account/liveBalanceAdjustment';


const PROP_CHALLENGE_WARNING_THRESHOLD = 0.8;

export type PropChallengePhaseEvaluationStatus =
  | 'active'
  | 'passed'
  | 'failed'
  | 'warning';

interface RuleEvaluationBase {
  ruleId: string;
  kind: PropChallengeRule['kind'];
  current: number;
  target: number;
  progress: number;
  remaining: number;
  satisfied: boolean;
  breached: boolean;
  warning: boolean;
  breachDate?: Date;
}

interface ProfitTargetRuleEvaluation extends RuleEvaluationBase {
  kind: 'profit_target';
  targetBalance: number;
  targetReached: boolean;
}

interface DrawdownRuleEvaluation extends RuleEvaluationBase {
  kind: 'drawdown';
  mode: Extract<PropChallengeRule, { kind: 'drawdown' }>['mode'];
  currentFloor: number;
  
  maximumUsed: number;
  
  limit: number;
  
  currentUsed: number;
  
  currentBufferWarning: boolean;
}

interface DailyLossUsage {
  tradingDay: string;
  maximumLoss: number;
  endingPnL: number;
  breached: boolean;
  breachDate?: Date;
}

interface DailyLossLimitRuleEvaluation extends RuleEvaluationBase {
  kind: 'daily_loss_limit';
  breachAction: 'fail' | 'suspend_until_next_session';
  dailyUsage: DailyLossUsage[];
  
  currentTradingDay: string;
  
  currentTradingDayMaximumLoss: number;
  
  currentTradingDayBreached: boolean;
  
  currentTradingDayWarning: boolean;
}

interface DailyProfitCapRuleEvaluation extends RuleEvaluationBase {
  kind: 'daily_profit_cap';
  actualTradeProfit: number;
  creditedTradeProfit: number;
  excludedProfit: number;
  cappedTradingDays: string[];
}

interface LiveReviewDailyProfitRuleEvaluation extends RuleEvaluationBase {
  kind: 'live_review_daily_profit';
  bestDayProfit: number;
  eligibleForLiveReview: boolean;
}

interface MinimumTradingDaysRuleEvaluation extends RuleEvaluationBase {
  kind: 'minimum_trading_days';
  tradingDays: string[];
}

interface MinimumProfitableDaysRuleEvaluation extends RuleEvaluationBase {
  kind: 'minimum_profitable_days';
  profitableTradingDays: string[];
  minimumDailyProfit: number;
}

interface ConsistencyRuleEvaluation extends RuleEvaluationBase {
  kind: 'consistency';
  bestDayProfit: number;
  bestDayPercent: number;
  totalProfit: number;
  
  requiredTotalProfit: number;
}

interface MaxPositionSizeRuleEvaluation extends RuleEvaluationBase {
  kind: 'max_position_size';
  violatingTradePaths: string[];
  violatingTradingDays: string[];
}

export type PropChallengeRuleEvaluation =
  | ProfitTargetRuleEvaluation
  | DrawdownRuleEvaluation
  | DailyLossLimitRuleEvaluation
  | DailyProfitCapRuleEvaluation
  | LiveReviewDailyProfitRuleEvaluation
  | MinimumTradingDaysRuleEvaluation
  | MinimumProfitableDaysRuleEvaluation
  | ConsistencyRuleEvaluation
  | MaxPositionSizeRuleEvaluation;

export function hasFundedLimitWarning(
  rules: readonly PropChallengeRuleEvaluation[]
): boolean {
  return rules.some((rule) =>
    rule.kind === 'drawdown'
      ? rule.currentBufferWarning
      : rule.kind === 'daily_loss_limit'
        ? rule.currentTradingDayWarning
        : false
  );
}

export function isHardPropChallengeRuleBreach(
  rule: PropChallengeRuleEvaluation
): boolean {
  return (
    rule.breached &&
    (rule.kind !== 'daily_loss_limit' || rule.breachAction === 'fail')
  );
}

export function isPropChallengeAchievementRule(
  kind: PropChallengeRule['kind']
): boolean {
  switch (kind) {
    case 'profit_target':
    case 'minimum_trading_days':
    case 'minimum_profitable_days':
    case 'consistency':
      return true;
    case 'drawdown':
    case 'daily_loss_limit':
    case 'daily_profit_cap':
    case 'live_review_daily_profit':
    case 'max_position_size':
      return false;
    default: {
      const exhaustive: never = kind;
      return exhaustive;
    }
  }
}

interface PropChallengeFailure {
  date: Date;
  ruleId: string;
  ruleKind: 'drawdown' | 'daily_loss_limit' | 'max_position_size';
}

export interface PropChallengePhaseEvaluation {
  phaseId: string;
  status: PropChallengePhaseEvaluationStatus;
  currentBalance: number;
  targetReached: boolean;
  requirementsOutstanding: Array<
    | 'profit_target'
    | 'minimum_trading_days'
    | 'minimum_profitable_days'
    | 'consistency'
  >;
  rules: PropChallengeRuleEvaluation[];
  failure?: PropChallengeFailure;
  
  targetReachedAt?: Date;
  failureAfterTargetReached: boolean;
}

interface PropChallengeRuleEngineInput {
  phase: PropChallengePhase;
  config?: PropChallengeConfig;
  trades: readonly AccountTradeData[];
  transactions: readonly AccountTransaction[];
  now?: Date;
  tradingDayCutoffTime?: string;
}

type ScopedEvent = {
  
  source?: AccountTransaction;
  date: Date;
  amount: number;
  isTrade: boolean;
  isPayout: boolean;
  advancesTrailingPeak: boolean;
  requestedWithdrawal?: number;
  payoutAftermath?: NonNullable<
    PropChallengePhase['payoutPolicy']
  >['afterPayout'];
};

type ScopedTrade = {
  trade: AccountTradeData;
  closedAt: Date;
};

const clampProgress = (value: number): number =>
  Math.max(0, Math.min(1, value));

function phaseDateRange(
  phase: PropChallengePhase,
  now: Date
): { start: number; end: number } {
  return {
    start: phase.startedAt
      ? new Date(phase.startedAt).getTime()
      : Number.NEGATIVE_INFINITY,
    end: phase.completedAt
      ? new Date(phase.completedAt).getTime()
      : now.getTime(),
  };
}

function withinRange(date: Date, start: number, end: number): boolean {
  const timestamp = date.getTime();
  return timestamp >= start && timestamp <= end;
}

function tradingDayKey(date: Date, cutoffTime?: string): string {
  return getTradingDayString(date, {
    settings: { trade: { tradingDayCutoffTime: cutoffTime } },
  });
}

function getClosedAt(trade: AccountTradeData): Date | null {
  return trade.settlementTime ?? trade.exitTime;
}

function transactionOwnedByPhase(
  transaction: AccountTransaction,
  phases: readonly PropChallengePhase[],
  phase: PropChallengePhase,
  tradesByPath: ReadonlyMap<string, AccountTradeData>,
  start: number,
  end: number,
  evaluatedAt: Date
): boolean {
  if (transaction.type === TransactionType.TRADE && transaction.tradeId) {
    const trade = tradesByPath.get(transaction.tradeId);
    if (trade) {
      return doesPhaseOwnTradeAt(
        phases,
        phase,
        trade,
        transaction.date,
        evaluatedAt
      );
    }
  }
  
  
  
  
  
  
  if (!withinRange(transaction.date, start, end)) return false;
  const startsHere = transaction.date.getTime() === start;
  if (!startsHere) return true;
  return !phases.some(
    (candidate) =>
      candidate.id !== phase.id &&
      candidate.completedAt !== undefined &&
      Date.parse(candidate.completedAt) === start
  );
}


export function doesPhaseOwnTransaction(
  transaction: AccountTransaction,
  phases: readonly PropChallengePhase[],
  phase: PropChallengePhase,
  tradesByPath: ReadonlyMap<string, AccountTradeData>,
  evaluatedAt: Date
): boolean {
  const { start, end } = phaseDateRange(phase, evaluatedAt);
  return transactionOwnedByPhase(
    transaction,
    phases,
    phase,
    tradesByPath,
    start,
    end,
    evaluatedAt
  );
}

function scopeInput(
  input: PropChallengeRuleEngineInput,
  evaluatedAt: Date
): {
  events: ScopedEvent[];
  closedTrades: ScopedTrade[];
  positionTrades: ScopedTrade[];
} {
  const { start, end } = phaseDateRange(input.phase, evaluatedAt);
  const events: ScopedEvent[] = [];
  const phases = input.config?.phases ?? [input.phase];
  const tradesByPath = new Map<string, AccountTradeData>();
  for (const trade of input.trades) {
    if (trade.path) tradesByPath.set(trade.path, trade);
  }
  for (const transaction of input.transactions) {
    if (
      transaction.description === 'Initial deposit' ||
      !transactionOwnedByPhase(
        transaction,
        phases,
        input.phase,
        tradesByPath,
        start,
        end,
        evaluatedAt
      )
    ) {
      continue;
    }
    events.push({
      source: transaction,
      date: transaction.date,
      amount: transaction.amount,
      isTrade: transaction.type === TransactionType.TRADE,
      advancesTrailingPeak: transaction.type === TransactionType.TRADE,
      isPayout: transaction.type === TransactionType.WITHDRAWAL,
      ...(transaction.type === TransactionType.WITHDRAWAL
        ? {
            requestedWithdrawal: Math.abs(transaction.amount),
            payoutAftermath: policyAt(input.phase, transaction.date)
              .payoutPolicy?.afterPayout,
          }
        : {}),
    });
  }
  
  
  for (const adjustment of input.phase.balanceAdjustments ?? []) {
    const date = new Date(adjustment.recordedAt);
    if (date.getTime() > end) continue;
    events.push({
      date,
      amount: adjustment.amount,
      isTrade: false,
      isPayout: false,
      advancesTrailingPeak: true,
    });
  }
  events.sort((left, right) => left.date.getTime() - right.date.getTime());
  let runningBalance = input.phase.startingBalance;
  for (const event of events) {
    if (event.payoutAftermath?.balanceAction === 'reset_to_starting_balance') {
      event.amount = input.phase.startingBalance - runningBalance;
    }
    runningBalance += event.amount;
  }

  const closedTrades = input.trades
    .flatMap((trade): ScopedTrade[] => {
      const closedAt = getClosedAt(trade);
      return closedAt &&
        doesPhaseOwnTradeAt(phases, input.phase, trade, closedAt, evaluatedAt)
        ? [{ trade, closedAt }]
        : [];
    })
    .sort((left, right) => left.closedAt.getTime() - right.closedAt.getTime());

  const positionTrades = input.trades
    .flatMap((trade): ScopedTrade[] =>
      doesPhaseOwnTradeAt(
        phases,
        input.phase,
        trade,
        trade.entryTime,
        evaluatedAt
      )
        ? [{ trade, closedAt: trade.entryTime }]
        : []
    )
    .sort((left, right) => left.closedAt.getTime() - right.closedAt.getTime());

  return { events, closedTrades, positionTrades };
}


function waivedThrough(phase: PropChallengePhase, ruleId: string): number {
  let through = Number.NEGATIVE_INFINITY;
  for (const waiver of phase.waivedFailures ?? []) {
    if (waiver.ruleId === ruleId) {
      through = Math.max(through, Date.parse(waiver.breachedAt));
    }
  }
  return through;
}


function positionContracts(
  trade: AccountTradeData,
  microsPerContract: number | undefined
): number {
  const size = Math.abs(trade.positionSize);
  return microsPerContract !== undefined && trade.isMicroFutures
    ? size / microsPerContract
    : size;
}

function applyTrailingFloorLock(
  candidate: number,
  lockAtBalance?: number
): number {
  return lockAtBalance === undefined
    ? candidate
    : Math.min(candidate, lockAtBalance);
}


function evaluateDrawdown(
  rule: Extract<PropChallengeRule, { kind: 'drawdown' }>,
  phase: PropChallengePhase,
  events: readonly ScopedEvent[],
  cutoffTime?: string,
  revision?: PropChallengePolicyRevision,
  
  endedUnderFloorBefore?: boolean
): DrawdownRuleEvaluation {
  let balance = phase.startingBalance;
  let floor = phase.startingBalance - rule.amount;
  let highestBalance = phase.startingBalance;
  let lowestBuffer = balance - floor;
  let breachDate: Date | undefined;
  const breachesAfter = waivedThrough(phase, rule.id);
  
  
  let insideWaivedBreach = false;
  let trailingFloorLocked = false;
  const carriedRevision = revision
    ? (latestCustomTransition(phase, revision.effectiveAt, rule.id) ?? revision)
    : undefined;
  const transition =
    carriedRevision?.transition?.basis === 'custom'
      ? carriedRevision.transition.drawdowns.find(
          (state) => state.ruleId === rule.id
        )
      : undefined;
  if (transition && carriedRevision) {
    const effectiveTime = Date.parse(carriedRevision.effectiveAt);
    for (const event of events) {
      if (event.date.getTime() < effectiveTime) balance += event.amount;
    }
    events = events.filter((event) => event.date.getTime() >= effectiveTime);
    floor = transition.floor;
    highestBalance = transition.peakBalance;
    trailingFloorLocked = transition.locked;
    lowestBuffer = balance - floor;
    if (lowestBuffer <= 0) {
      
      
      
      
      
      
      const continuesWaivedExcursion =
        breachesAfter !== Number.NEGATIVE_INFINITY &&
        (carriedRevision !== revision || endedUnderFloorBefore !== false);
      if (continuesWaivedExcursion) {
        insideWaivedBreach = true;
      } else {
        breachDate = new Date(carriedRevision.effectiveAt);
      }
    }
  }

  const inspectPoint = (event: ScopedEvent) => {
    const payoutAftermath = event.payoutAftermath;
    balance =
      payoutAftermath?.balanceAction === 'reset_to_starting_balance'
        ? phase.startingBalance
        : balance + event.amount;
    if (payoutAftermath?.drawdownAction === 'lock_at_balance') {
      floor = payoutAftermath.drawdownFloor ?? phase.startingBalance;
      trailingFloorLocked = true;
    } else if (
      payoutAftermath?.drawdownAction === 'reset_from_starting_balance'
    ) {
      floor = phase.startingBalance - rule.amount;
      highestBalance = phase.startingBalance;
      trailingFloorLocked = false;
    }
    const buffer = balance - floor;
    lowestBuffer = Math.min(lowestBuffer, buffer);
    if (buffer > 0) {
      insideWaivedBreach = false;
    } else if (event.date.getTime() <= breachesAfter) {
      insideWaivedBreach = true;
    } else if (!breachDate && !insideWaivedBreach) {
      breachDate = event.date;
    }
  };

  if (rule.mode === 'eod_trailing') {
    let index = 0;
    while (index < events.length) {
      const day = tradingDayKey(events[index].date, cutoffTime);
      while (
        index < events.length &&
        tradingDayKey(events[index].date, cutoffTime) === day
      ) {
        inspectPoint(events[index]);
        index += 1;
      }
      if (!trailingFloorLocked) {
        highestBalance = Math.max(highestBalance, balance);
        floor = Math.max(
          floor,
          applyTrailingFloorLock(
            highestBalance - rule.amount,
            rule.lockAtBalance
          )
        );
      }
    }
  } else {
    for (const event of events) {
      inspectPoint(event);
      if (
        rule.mode === 'intraday_trailing' &&
        event.advancesTrailingPeak &&
        !trailingFloorLocked
      ) {
        highestBalance = Math.max(highestBalance, balance);
        floor = Math.max(
          floor,
          applyTrailingFloorLock(
            highestBalance - rule.amount,
            rule.lockAtBalance
          )
        );
      }
    }
  }

  const currentBuffer = balance - floor;
  const maximumUsed = Math.max(0, rule.amount - lowestBuffer);
  const progress = rule.amount > 0 ? maximumUsed / rule.amount : 0;
  
  
  
  const currentUsed = Math.max(0, rule.amount - currentBuffer);
  const currentProgress = rule.amount > 0 ? currentUsed / rule.amount : 0;
  return {
    ruleId: rule.id,
    kind: 'drawdown',
    mode: rule.mode,
    current: balance,
    target: floor,
    progress,
    remaining: currentBuffer,
    satisfied: !breachDate,
    breached: Boolean(breachDate),
    warning: !breachDate && progress >= PROP_CHALLENGE_WARNING_THRESHOLD,
    breachDate,
    currentFloor: floor,
    maximumUsed,
    limit: rule.amount,
    currentUsed,
    currentBufferWarning: currentProgress >= PROP_CHALLENGE_WARNING_THRESHOLD,
  };
}

function groupTradePnlByDay(
  events: readonly ScopedEvent[],
  cutoffTime?: string
): Map<string, ScopedEvent[]> {
  const grouped = new Map<string, ScopedEvent[]>();
  for (const event of events) {
    if (!event.isTrade) continue;
    const day = tradingDayKey(event.date, cutoffTime);
    const dayEvents = grouped.get(day) ?? [];
    dayEvents.push(event);
    grouped.set(day, dayEvents);
  }
  return grouped;
}

function groupEventsByDay(
  events: readonly ScopedEvent[],
  cutoffTime?: string
): Map<string, ScopedEvent[]> {
  const grouped = new Map<string, ScopedEvent[]>();
  for (const event of events) {
    const day = tradingDayKey(event.date, cutoffTime);
    const dayEvents = grouped.get(day) ?? [];
    dayEvents.push(event);
    grouped.set(day, dayEvents);
  }
  return grouped;
}

function evaluateDailyProfitCap(
  rule: Extract<PropChallengeRule, { kind: 'daily_profit_cap' }>,
  groupedTradePnl: ReadonlyMap<string, readonly ScopedEvent[]>
): DailyProfitCapRuleEvaluation {
  let actualTradeProfit = 0;
  let creditedTradeProfit = 0;
  let maximumDailyProfit = 0;
  const cappedTradingDays: string[] = [];

  for (const [tradingDay, events] of groupedTradePnl) {
    const dailyProfit = events.reduce((sum, event) => sum + event.amount, 0);
    actualTradeProfit += dailyProfit;
    creditedTradeProfit += Math.min(dailyProfit, rule.amount);
    maximumDailyProfit = Math.max(maximumDailyProfit, dailyProfit);
    if (dailyProfit > rule.amount) cappedTradingDays.push(tradingDay);
  }

  const excludedProfit = Math.max(0, actualTradeProfit - creditedTradeProfit);
  return {
    ruleId: rule.id,
    kind: 'daily_profit_cap',
    current: maximumDailyProfit,
    target: rule.amount,
    progress: rule.amount > 0 ? maximumDailyProfit / rule.amount : 0,
    remaining: Math.max(0, rule.amount - maximumDailyProfit),
    satisfied: true,
    breached: false,
    warning: false,
    actualTradeProfit,
    creditedTradeProfit,
    excludedProfit,
    cappedTradingDays,
  };
}

function evaluateDailyLoss(
  rule: Extract<PropChallengeRule, { kind: 'daily_loss_limit' }>,
  phase: PropChallengePhase,
  events: readonly ScopedEvent[],
  now: Date,
  cutoffTime?: string,
  effectiveAt?: string
): DailyLossLimitRuleEvaluation {
  const dailyUsage: DailyLossUsage[] = [];
  let worstLoss = 0;
  let maximumUsageRatio = 0;
  let breachDate: Date | undefined;
  const breachesAfter = waivedThrough(phase, rule.id);
  
  
  const waivedTradingDay =
    breachesAfter === Number.NEGATIVE_INFINITY
      ? undefined
      : tradingDayKey(new Date(breachesAfter), cutoffTime);
  const thresholdProfit =
    rule.profitThresholdPercent === undefined
      ? undefined
      : (phase.startingBalance * rule.profitThresholdPercent) / 100;
  let cumulativeProfit = 0;
  let increasedAt: Date | undefined;
  if (thresholdProfit !== undefined) {
    for (const event of events) {
      if (!event.isTrade) continue;
      cumulativeProfit += event.amount;
      if (cumulativeProfit >= thresholdProfit) {
        increasedAt = event.date;
        break;
      }
    }
  }
  const scaledLimitsByDay = new Map<string, number>();
  let latestScaledLimit = rule.amount;
  const tieredLimitsByDay = new Map<string, number>();
  let latestTieredLimit = rule.amount;
  if (rule.lossTiers) {
    let priorEodProfit = 0;
    const tierEvents =
      rule.profitBasis === 'current_account_profit'
        ? groupEventsByDay(events, cutoffTime)
        : groupTradePnlByDay(events, cutoffTime);
    for (const [tradingDay, dayEvents] of tierEvents) {
      tieredLimitsByDay.set(tradingDay, latestTieredLimit);
      priorEodProfit += dayEvents.reduce((sum, event) => sum + event.amount, 0);
      latestTieredLimit = rule.lossTiers.reduce(
        (limit, tier) => (priorEodProfit >= tier.profit ? tier.amount : limit),
        rule.amount
      );
    }
  }
  if (
    rule.scaleAtBalance !== undefined &&
    rule.scaledAmountPercentOfPeakEodProfit !== undefined
  ) {
    let cumulativeAccountProfit = 0;
    let peakEodProfit = 0;
    let scalingActive = false;
    for (const [tradingDay, dayEvents] of groupEventsByDay(
      events,
      cutoffTime
    )) {
      scaledLimitsByDay.set(tradingDay, latestScaledLimit);
      cumulativeAccountProfit += dayEvents.reduce(
        (sum, event) => sum + event.amount,
        0
      );
      peakEodProfit = Math.max(peakEodProfit, cumulativeAccountProfit);
      if (
        phase.startingBalance + cumulativeAccountProfit >=
        rule.scaleAtBalance
      ) {
        scalingActive = true;
      }
      if (scalingActive) {
        latestScaledLimit =
          peakEodProfit * (rule.scaledAmountPercentOfPeakEodProfit / 100);
      }
    }
  }
  const limitAt = (date: Date): number => {
    if (rule.lossTiers) {
      return (
        tieredLimitsByDay.get(tradingDayKey(date, cutoffTime)) ??
        latestTieredLimit
      );
    }
    if (rule.scaleAtBalance !== undefined) {
      return (
        scaledLimitsByDay.get(tradingDayKey(date, cutoffTime)) ??
        latestScaledLimit
      );
    }
    return increasedAt &&
      date.getTime() >= increasedAt.getTime() &&
      rule.amountAfterThreshold !== undefined
      ? rule.amountAfterThreshold
      : rule.amount;
  };

  for (const [tradingDay, dayEvents] of groupTradePnlByDay(
    events,
    cutoffTime
  )) {
    let runningPnL = 0;
    let maximumLoss = 0;
    let dayBreached = false;
    let dayBreachDate: Date | undefined;
    for (const event of dayEvents) {
      runningPnL += event.amount;
      maximumLoss = Math.max(maximumLoss, -runningPnL);
      if (effectiveAt && event.date.getTime() < Date.parse(effectiveAt))
        continue;
      const effectiveLimit = limitAt(event.date);
      maximumUsageRatio = Math.max(
        maximumUsageRatio,
        effectiveLimit > 0 ? maximumLoss / effectiveLimit : 0
      );
      if (maximumLoss >= effectiveLimit && !dayBreached) {
        dayBreached = true;
        dayBreachDate = event.date;
        if (
          !breachDate &&
          (waivedTradingDay === undefined || tradingDay > waivedTradingDay)
        ) {
          breachDate = event.date;
        }
      }
    }
    if (maximumLoss > worstLoss) {
      worstLoss = maximumLoss;
    }
    dailyUsage.push({
      tradingDay,
      maximumLoss,
      endingPnL: runningPnL,
      breached: dayBreached,
      breachDate: dayBreachDate,
    });
  }

  
  
  const currentTradingDay = tradingDayKey(now, cutoffTime);
  const currentTradingDayUsage = dailyUsage.find(
    (usage) => usage.tradingDay === currentTradingDay
  );
  const currentTradingDayMaximumLoss = currentTradingDayUsage?.maximumLoss ?? 0;
  const currentLimit = limitAt(now);
  const breachAction = rule.breachAction ?? 'fail';
  const currentTradingDayBreached = currentTradingDayUsage?.breached ?? false;
  const effectiveBreachDate =
    breachAction === 'fail' ? breachDate : currentTradingDayUsage?.breachDate;
  const breached =
    breachAction === 'fail' ? Boolean(breachDate) : currentTradingDayBreached;
  const hasDynamicLimit =
    thresholdProfit !== undefined ||
    rule.scaleAtBalance !== undefined ||
    rule.lossTiers !== undefined;
  const progress = !hasDynamicLimit
    ? rule.amount > 0
      ? worstLoss / rule.amount
      : 0
    : breachAction === 'fail'
      ? maximumUsageRatio
      : currentLimit > 0
        ? currentTradingDayMaximumLoss / currentLimit
        : 0;
  return {
    ruleId: rule.id,
    kind: 'daily_loss_limit',
    breachAction,
    current: worstLoss,
    target: currentLimit,
    progress,
    
    
    
    remaining: Math.max(0, currentLimit - currentTradingDayMaximumLoss),
    satisfied: !breached,
    breached,
    warning:
      !breached &&
      currentLimit > 0 &&
      (breachAction === 'fail'
        ? progress >= PROP_CHALLENGE_WARNING_THRESHOLD
        : currentTradingDayMaximumLoss / currentLimit >=
          PROP_CHALLENGE_WARNING_THRESHOLD),
    breachDate: effectiveBreachDate,
    dailyUsage,
    currentTradingDay,
    currentTradingDayMaximumLoss,
    currentTradingDayBreached,
    currentTradingDayWarning:
      currentLimit > 0 &&
      currentTradingDayMaximumLoss / currentLimit >=
        PROP_CHALLENGE_WARNING_THRESHOLD,
  };
}

function evaluateRule(
  rule: Exclude<
    PropChallengeRule,
    { kind: 'drawdown' | 'daily_loss_limit' | 'daily_profit_cap' }
  >,
  phase: PropChallengePhase,
  currentBalance: number,
  objectiveProfit: number,
  groupedTradePnl: ReadonlyMap<string, readonly ScopedEvent[]>,
  events: readonly ScopedEvent[],
  closedTrades: readonly ScopedTrade[],
  positionTrades: readonly ScopedTrade[],
  currentDrawdownFloor: number | undefined,
  evaluatedAt: Date,
  cutoffTime?: string
): PropChallengeRuleEvaluation {
  switch (rule.kind) {
    case 'profit_target': {
      const profitTarget =
        rule.targetType === 'percentage'
          ? (phase.startingBalance * rule.amount) / 100
          : rule.amount;
      const withdrawalCredit = rule.creditWithdrawals
        ? events.reduce(
            (total, event) =>
              event.isPayout ? total + (event.requestedWithdrawal ?? 0) : total,
            0
          )
        : 0;
      const currentProfit = objectiveProfit + withdrawalCredit;
      const targetReached = currentProfit >= profitTarget;
      return {
        ruleId: rule.id,
        kind: rule.kind,
        current: currentProfit,
        target: profitTarget,
        progress: profitTarget > 0 ? currentProfit / profitTarget : 1,
        remaining: Math.max(0, profitTarget - currentProfit),
        satisfied: targetReached,
        breached: false,
        warning: false,
        targetBalance: phase.startingBalance + profitTarget,
        targetReached,
      };
    }
    case 'minimum_trading_days': {
      
      
      
      
      
      const tradingDays = Array.from(
        new Set(
          positionTrades.map(({ closedAt }) =>
            tradingDayKey(closedAt, cutoffTime)
          )
        )
      );
      return {
        ruleId: rule.id,
        kind: rule.kind,
        current: tradingDays.length,
        target: rule.days,
        progress: rule.days > 0 ? tradingDays.length / rule.days : 1,
        remaining: Math.max(0, rule.days - tradingDays.length),
        satisfied: tradingDays.length >= rule.days,
        breached: false,
        warning: false,
        tradingDays,
      };
    }
    case 'minimum_profitable_days': {
      const profitableTradingDays: string[] = [];
      for (const [tradingDay, events] of groupedTradePnl.entries()) {
        const dayPnl = events.reduce((sum, event) => sum + event.amount, 0);
        if (dayPnl >= rule.minimumDailyProfit) {
          profitableTradingDays.push(tradingDay);
        }
      }
      return {
        ruleId: rule.id,
        kind: rule.kind,
        current: profitableTradingDays.length,
        target: rule.days,
        progress: rule.days > 0 ? profitableTradingDays.length / rule.days : 1,
        remaining: Math.max(0, rule.days - profitableTradingDays.length),
        satisfied: profitableTradingDays.length >= rule.days,
        breached: false,
        warning: false,
        profitableTradingDays,
        minimumDailyProfit: rule.minimumDailyProfit,
      };
    }
    case 'live_review_daily_profit': {
      const bestDayProfit = Math.max(
        0,
        ...Array.from(groupedTradePnl.values()).map((events) =>
          events.reduce((sum, event) => sum + event.amount, 0)
        )
      );
      const eligibleForLiveReview = bestDayProfit >= rule.amount;
      return {
        ruleId: rule.id,
        kind: rule.kind,
        current: bestDayProfit,
        target: rule.amount,
        progress: rule.amount > 0 ? bestDayProfit / rule.amount : 1,
        remaining: Math.max(0, rule.amount - bestDayProfit),
        satisfied: eligibleForLiveReview,
        breached: false,
        warning: false,
        bestDayProfit,
        eligibleForLiveReview,
      };
    }
    case 'consistency': {
      const effectiveMaxBestDayPercent =
        rule.maxBestDayPercent + (rule.consistencyCushionPercent ?? 0);
      const dailyProfits = Array.from(groupedTradePnl.values()).map((events) =>
        events.reduce((sum, event) => sum + event.amount, 0)
      );
      const totalProfit = dailyProfits.reduce((sum, profit) => sum + profit, 0);
      const bestDayProfit = Math.max(0, ...dailyProfits);
      const bestDayPercent =
        totalProfit > 0 ? (bestDayProfit / totalProfit) * 100 : 0;
      const satisfied =
        totalProfit > 0 && bestDayPercent <= effectiveMaxBestDayPercent;
      const maximumShare = effectiveMaxBestDayPercent / 100;
      const additionalProfitNeeded =
        totalProfit > 0 && maximumShare > 0
          ? Math.max(0, bestDayProfit / maximumShare - totalProfit)
          : 0;
      return {
        ruleId: rule.id,
        kind: rule.kind,
        current: bestDayPercent,
        target: effectiveMaxBestDayPercent,
        progress: satisfied
          ? 1
          : maximumShare > 0 && totalProfit > 0
            ? clampProgress(totalProfit / (bestDayProfit / maximumShare))
            : 0,
        remaining: additionalProfitNeeded,
        satisfied,
        breached: false,
        warning: false,
        bestDayProfit,
        bestDayPercent,
        totalProfit,
        requiredTotalProfit:
          totalProfit > 0 && maximumShare > 0
            ? totalProfit + additionalProfitNeeded
            : 0,
      };
    }
    case 'max_position_size': {
      const positionScalingEvents =
        'maxContracts' in rule || rule.profitBasis !== 'current_account_profit'
          ? groupedTradePnl
          : groupEventsByDay(events, cutoffTime);
      const positionLimitForDay = (tradingDay: string): number => {
        if ('maxContracts' in rule) return rule.maxContracts;
        const priorEodProfit = Array.from(
          positionScalingEvents.entries()
        ).reduce(
          (profit, [day, dayEvents]) =>
            day < tradingDay
              ? profit + dayEvents.reduce((sum, event) => sum + event.amount, 0)
              : profit,
          0
        );
        if ('profitTiers' in rule) {
          return rule.profitTiers.reduce(
            (limit, tier) =>
              priorEodProfit >= tier.profit ? tier.maxContracts : limit,
            rule.initialContracts
          );
        }
        const earnedContracts = Math.floor(
          Math.max(0, priorEodProfit) / rule.profitPerAdditionalContract
        );
        return Math.min(
          rule.maximumContracts ?? Number.POSITIVE_INFINITY,
          rule.initialContracts + earnedContracts
        );
      };
      const breachesAfter = waivedThrough(phase, rule.id);
      const exceedsLimit = ({ trade, closedAt }: ScopedTrade): boolean =>
        positionContracts(trade, rule.microsPerContract) >
        positionLimitForDay(tradingDayKey(closedAt, cutoffTime));
      const isWaived = (item: ScopedTrade): boolean =>
        item.closedAt.getTime() <= breachesAfter && exceedsLimit(item);
      const violatingTrades = positionTrades.filter(
        (item) => item.closedAt.getTime() > breachesAfter && exceedsLimit(item)
      );
      const currentTradingDay = tradingDayKey(evaluatedAt, cutoffTime);
      
      
      const measuredTrades = positionTrades.filter(
        (item) =>
          ('maxContracts' in rule ||
            tradingDayKey(item.closedAt, cutoffTime) === currentTradingDay) &&
          !isWaived(item)
      );
      const maximumPositionSize = measuredTrades.reduce(
        (maximum, { trade }) =>
          Math.max(maximum, positionContracts(trade, rule.microsPerContract)),
        0
      );
      const currentLimit = positionLimitForDay(currentTradingDay);
      const violatingTradingDays = Array.from(
        new Set(
          violatingTrades.map(({ closedAt }) =>
            tradingDayKey(closedAt, cutoffTime)
          )
        )
      );
      const breachDate = violatingTrades[0]?.closedAt;
      return {
        ruleId: rule.id,
        kind: rule.kind,
        current: maximumPositionSize,
        target: currentLimit,
        progress: currentLimit > 0 ? maximumPositionSize / currentLimit : 0,
        remaining: currentLimit - maximumPositionSize,
        satisfied: !breachDate,
        breached: Boolean(breachDate),
        warning: false,
        breachDate,
        violatingTradePaths: violatingTrades.map(({ trade }) => trade.path),
        violatingTradingDays,
      };
    }
    default: {
      const exhaustive: never = rule;
      return exhaustive;
    }
  }
}

function profitTargetAmount(
  rule: Extract<PropChallengeRule, { kind: 'profit_target' }>,
  startingBalance: number
): number {
  return rule.targetType === 'percentage'
    ? (startingBalance * rule.amount) / 100
    : rule.amount;
}

function eventsThrough(
  events: readonly ScopedEvent[],
  closedAt: Date
): ScopedEvent[] {
  const end = closedAt.getTime();
  const eventsToDate: ScopedEvent[] = [];
  for (const event of events) {
    if (event.date.getTime() > end) break;
    eventsToDate.push(event);
  }
  return eventsToDate;
}

function objectiveProfitThrough(
  eventsToDate: readonly ScopedEvent[],
  dailyCapAmounts: readonly number[],
  cutoffTime?: string
): number {
  const balanceDelta = eventsToDate.reduce(
    (sum, event) => sum + event.amount,
    0
  );
  if (dailyCapAmounts.length === 0) return balanceDelta;
  const grouped = groupTradePnlByDay(eventsToDate, cutoffTime);
  let actualTradeProfit = 0;
  for (const dayEvents of grouped.values()) {
    actualTradeProfit += dayEvents.reduce(
      (sum, event) => sum + event.amount,
      0
    );
  }
  const nonTradeProfit = balanceDelta - actualTradeProfit;
  const creditedTradeProfit = Math.min(
    ...dailyCapAmounts.map((cap) => {
      let credited = 0;
      for (const dayEvents of grouped.values()) {
        const dailyProfit = dayEvents.reduce(
          (sum, event) => sum + event.amount,
          0
        );
        credited += Math.min(dailyProfit, cap);
      }
      return credited;
    })
  );
  return creditedTradeProfit + nonTradeProfit;
}

function withdrawalCreditThrough(eventsToDate: readonly ScopedEvent[]): number {
  return eventsToDate.reduce(
    (total, event) =>
      event.isPayout ? total + (event.requestedWithdrawal ?? 0) : total,
    0
  );
}


function findTargetReachedAt(
  rules: readonly PropChallengeRule[],
  events: readonly ScopedEvent[],
  startingBalance: number,
  cutoffTime?: string
): Date | undefined {
  const profitTargets = rules.filter(
    (rule): rule is Extract<PropChallengeRule, { kind: 'profit_target' }> =>
      rule.kind === 'profit_target'
  );
  if (profitTargets.length === 0 || events.length === 0) {
    return undefined;
  }
  const dailyCapAmounts = rules.flatMap((rule) =>
    rule.kind === 'daily_profit_cap' ? [rule.amount] : []
  );
  
  
  
  
  
  
  for (const { date } of events) {
    const eventsToDate = eventsThrough(events, date);
    const profit = objectiveProfitThrough(
      eventsToDate,
      dailyCapAmounts,
      cutoffTime
    );
    const credit = withdrawalCreditThrough(eventsToDate);
    const reached = profitTargets.every((rule) => {
      const current = profit + (rule.creditWithdrawals ? credit : 0);
      return current >= profitTargetAmount(rule, startingBalance);
    });
    if (reached) return date;
  }
  return undefined;
}

function withTargetReachFacts(
  evaluation: Omit<
    PropChallengePhaseEvaluation,
    'targetReachedAt' | 'failureAfterTargetReached'
  >,
  targetReachedAt: Date | undefined
): PropChallengePhaseEvaluation {
  const failureAfterTargetReached = Boolean(
    evaluation.failure &&
    targetReachedAt &&
    evaluation.failure.date.getTime() > targetReachedAt.getTime()
  );
  return targetReachedAt
    ? { ...evaluation, targetReachedAt, failureAfterTargetReached }
    : { ...evaluation, failureAfterTargetReached };
}

function evaluateSinglePolicy(
  input: PropChallengeRuleEngineInput,
  revision?: PropChallengePolicyRevision,
  
  endedUnderFloor?: ReadonlySet<string>
): PropChallengePhaseEvaluation {
  
  
  
  const evaluatedAt = input.now ?? new Date();
  const { events, closedTrades, positionTrades } = scopeInput(
    input,
    evaluatedAt
  );
  const currentBalance =
    input.phase.startingBalance +
    events.reduce((sum, event) => sum + event.amount, 0);
  
  
  const phaseRules = input.phase.rules.filter((rule) => rule.enabled);
  const drawdowns = new Map<string, DrawdownRuleEvaluation>();
  for (const rule of phaseRules) {
    if (rule.kind !== 'drawdown') continue;
    drawdowns.set(
      rule.id,
      evaluateDrawdown(
        rule,
        input.phase,
        events,
        input.tradingDayCutoffTime,
        revision,
        endedUnderFloor ? endedUnderFloor.has(rule.id) : undefined
      )
    );
  }
  const currentDrawdownFloor = Array.from(drawdowns.values()).reduce<
    number | undefined
  >(
    (highest, drawdown) =>
      highest === undefined
        ? drawdown.currentFloor
        : Math.max(highest, drawdown.currentFloor),
    undefined
  );
  const groupedTradePnl = groupTradePnlByDay(
    events,
    input.tradingDayCutoffTime
  );
  const dailyProfitCaps = new Map<string, DailyProfitCapRuleEvaluation>();
  for (const rule of phaseRules) {
    if (rule.kind !== 'daily_profit_cap') continue;
    dailyProfitCaps.set(rule.id, evaluateDailyProfitCap(rule, groupedTradePnl));
  }
  const actualTradeProfit = Array.from(groupedTradePnl.values()).reduce(
    (total, dayEvents) =>
      total + dayEvents.reduce((sum, event) => sum + event.amount, 0),
    0
  );
  const nonTradeProfit =
    currentBalance - input.phase.startingBalance - actualTradeProfit;
  const objectiveProfit =
    dailyProfitCaps.size === 0
      ? currentBalance - input.phase.startingBalance
      : Math.min(
          ...Array.from(dailyProfitCaps.values()).map(
            (evaluation) => evaluation.creditedTradeProfit
          )
        ) + nonTradeProfit;

  const rules = phaseRules.map((rule): PropChallengeRuleEvaluation => {
    if (rule.kind === 'drawdown') return drawdowns.get(rule.id)!;
    if (rule.kind === 'daily_loss_limit') {
      return evaluateDailyLoss(
        rule,
        input.phase,
        events,
        evaluatedAt,
        input.tradingDayCutoffTime,
        revision?.effectiveAt
      );
    }
    if (rule.kind === 'daily_profit_cap') return dailyProfitCaps.get(rule.id)!;
    return evaluateRule(
      rule,
      input.phase,
      currentBalance,
      objectiveProfit,
      groupedTradePnl,
      events,
      closedTrades,
      revision
        ? positionTrades.filter(
            (item) =>
              item.closedAt.getTime() >= Date.parse(revision.effectiveAt)
          )
        : positionTrades,
      currentDrawdownFloor,
      evaluatedAt,
      input.tradingDayCutoffTime
    );
  });

  const hardFailures = rules.filter(
    (
      rule
    ): rule is
      | DrawdownRuleEvaluation
      | DailyLossLimitRuleEvaluation
      | MaxPositionSizeRuleEvaluation =>
      (rule.kind === 'drawdown' ||
        (rule.kind === 'daily_loss_limit' && rule.breachAction === 'fail') ||
        rule.kind === 'max_position_size') &&
      rule.breached
  );
  let firstFailure:
    | DrawdownRuleEvaluation
    | DailyLossLimitRuleEvaluation
    | MaxPositionSizeRuleEvaluation
    | undefined;
  for (const failure of hardFailures) {
    if (
      failure.breachDate &&
      (!firstFailure ||
        !firstFailure.breachDate ||
        failure.breachDate < firstFailure.breachDate)
    ) {
      firstFailure = failure;
    }
  }
  const profitTargets = rules.filter(
    (rule): rule is ProfitTargetRuleEvaluation => rule.kind === 'profit_target'
  );
  const minimumDayRules = rules.filter(
    (rule): rule is MinimumTradingDaysRuleEvaluation =>
      rule.kind === 'minimum_trading_days'
  );
  const minimumProfitableDayRules = rules.filter(
    (rule): rule is MinimumProfitableDaysRuleEvaluation =>
      rule.kind === 'minimum_profitable_days'
  );
  const consistencyRules = rules.filter(
    (rule): rule is ConsistencyRuleEvaluation => rule.kind === 'consistency'
  );
  const targetReached =
    profitTargets.length > 0 &&
    profitTargets.every((rule) => rule.targetReached);
  const requirementsOutstanding: PropChallengePhaseEvaluation['requirementsOutstanding'] =
    [];
  if (!targetReached) requirementsOutstanding.push('profit_target');
  if (minimumDayRules.some((rule) => !rule.satisfied))
    requirementsOutstanding.push('minimum_trading_days');
  if (minimumProfitableDayRules.some((rule) => !rule.satisfied))
    requirementsOutstanding.push('minimum_profitable_days');
  if (consistencyRules.some((rule) => !rule.satisfied))
    requirementsOutstanding.push('consistency');

  const status: PropChallengePhaseEvaluationStatus =
    hardFailures.length > 0
      ? 'failed'
      : rules.some(
            (rule) =>
              rule.warning ||
              (rule.kind === 'daily_loss_limit' &&
                rule.breachAction === 'suspend_until_next_session' &&
                rule.currentTradingDayBreached)
          )
        ? 'warning'
        : requirementsOutstanding.length === 0
          ? 'passed'
          : 'active';

  const failure =
    firstFailure?.breachDate &&
    (firstFailure.kind === 'drawdown' ||
      (firstFailure.kind === 'daily_loss_limit' &&
        firstFailure.breachAction === 'fail') ||
      firstFailure.kind === 'max_position_size')
      ? {
          date: firstFailure.breachDate,
          ruleId: firstFailure.ruleId,
          ruleKind: firstFailure.kind,
        }
      : undefined;

  return withTargetReachFacts(
    {
      phaseId: input.phase.id,
      status,
      currentBalance,
      targetReached,
      requirementsOutstanding,
      rules,
      ...(failure ? { failure } : {}),
    },
    findTargetReachedAt(
      phaseRules,
      events,
      input.phase.startingBalance,
      input.tradingDayCutoffTime
    )
  );
}



export function propChallengePhaseBalancesAfter(
  input: PropChallengeRuleEngineInput
): ReadonlyMap<AccountTransaction, number> {
  const balances = new Map<AccountTransaction, number>();
  for (const event of propChallengePhaseBalanceTimeline(input)) {
    if (event.transaction) balances.set(event.transaction, event.balance);
  }
  return balances;
}


export function propChallengePhaseBalanceTimeline(
  input: PropChallengeRuleEngineInput
) {
  const { events } = scopeInput(input, input.now ?? new Date());
  let balance = input.phase.startingBalance;
  return events.map((event) => {
    balance += event.amount;
    return {
      date: event.date,
      balance,
      transaction: event.source,
      advancesTrailingPeak: event.advancesTrailingPeak,
      payoutAftermath: event.payoutAftermath,
    };
  });
}

export class InactivePropChallengeBalanceError extends Error {
  constructor() {
    super('Live balance can only be changed on an active phase');
  }
}


export function calibratePropChallengeBalance(
  input: PropChallengeRuleEngineInput,
  liveBalance: number | null
): PropChallengePhase {
  if (input.phase.status !== 'active')
    throw new InactivePropChallengeBalanceError();
  const phase = { ...input.phase };
  if (liveBalance === null) {
    delete phase.balanceAdjustments;
    return phase;
  }
  const now = input.now ?? new Date();
  const delta = normalizeLiveBalanceAdjustment(
    liveBalance - evaluatePropChallengePhase({ ...input, now }).currentBalance
  );
  if (delta === undefined) return phase;
  const adjustments = [...(phase.balanceAdjustments ?? [])];
  const last = adjustments[adjustments.length - 1];
  const hasActivityAfterLast =
    last &&
    scopeInput(input, now).events.some(
      (event) =>
        event.source && event.date.getTime() >= Date.parse(last.recordedAt)
    );
  
  if (last && !hasActivityAfterLast) {
    adjustments.pop();
    const amount = normalizeLiveBalanceAdjustment(last.amount + delta);
    if (amount !== undefined) adjustments.push({ ...last, amount });
  } else adjustments.push({ amount: delta, recordedAt: now.toISOString() });
  if (adjustments.length) phase.balanceAdjustments = adjustments;
  else delete phase.balanceAdjustments;
  return phase;
}

export function evaluatePropChallengePhase(
  input: PropChallengeRuleEngineInput
): PropChallengePhaseEvaluation {
  const history = input.phase.policyHistory;
  if (!history?.length) return evaluateSinglePolicy(input);
  const end = Math.min(
    (input.now ?? new Date()).getTime(),
    input.phase.completedAt ? Date.parse(input.phase.completedAt) : Infinity
  );
  let result: PropChallengePhaseEvaluation | undefined;
  let firstFailure: PropChallengePhaseEvaluation['failure'];
  
  
  
  let endedUnderFloor: Set<string> | undefined;
  for (const [index, revision] of history.entries()) {
    if (Date.parse(revision.effectiveAt) > end) break;
    const next = history[index + 1];
    const intervalEnd = next
      ? Math.min(end, Date.parse(next.effectiveAt) - 1)
      : end;
    result = evaluateSinglePolicy(
      {
        ...input,
        now: new Date(intervalEnd),
        phase: {
          ...input.phase,
          completedAt: new Date(intervalEnd).toISOString(),
          rules: revision.rules,
          payoutPolicy: revision.payoutPolicy,
        },
      },
      revision,
      endedUnderFloor
    );
    endedUnderFloor = new Set();
    for (const rule of result.rules) {
      if (
        rule.kind === 'drawdown' &&
        result.currentBalance - rule.currentFloor <= 0
      ) {
        endedUnderFloor.add(rule.ruleId);
      }
    }
    if (
      result.failure &&
      (!firstFailure || result.failure.date < firstFailure.date)
    )
      firstFailure = result.failure;
  }
  if (!result)
    return evaluateSinglePolicy({
      ...input,
      phase: {
        ...input.phase,
        rules: history[0].rules,
        payoutPolicy: history[0].payoutPolicy,
      },
    });
  if (!firstFailure) return result;
  const { targetReachedAt: reachedAt, ...rest } = result;
  return withTargetReachFacts(
    { ...rest, status: 'failed', failure: firstFailure },
    reachedAt
  );
}
