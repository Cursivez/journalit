

import type {
  GoalConfig,
  GoalDirection,
  GoalPeriod,
  GoalType,
} from '../../../settings/types';
import { aggregateGoalAccountTargets } from '../../../components/home/widgets/goalDefinitions';
import type { HomeGoal } from '../protocol/generated/apply_changes.request.generated';
import { isRecord } from './configurationPrimitives';

type Metric = HomeGoal['metric'];
type Period = HomeGoal['period'];
type Direction = HomeGoal['direction'];

const GOAL_TYPES = {
  net_pnl: 'pnl',
  trade_count: 'tradesJournaled',
  win_rate: 'winRate',
  profit_factor: 'profitFactor',
  expectancy: 'expectancy',
  max_drawdown: 'maxDrawdown',
} as const satisfies Record<Metric, GoalType>;

const GOAL_PERIODS = {
  day: 'daily',
  week: 'weekly',
  month: 'monthly',
  sessions: 'sessions',
  all_time: 'lifetime',
} as const satisfies Record<Period, GoalPeriod>;

const GOAL_DIRECTIONS = {
  at_least: 'atLeast',
  at_most: 'atMost',
} as const satisfies Record<Direction, GoalDirection>;


const METRICS = new Map<string, Metric>(
  Object.entries({
    pnl: 'net_pnl',
    tradesJournaled: 'trade_count',
    winRate: 'win_rate',
    profitFactor: 'profit_factor',
    expectancy: 'expectancy',
    maxDrawdown: 'max_drawdown',
  } satisfies Record<GoalType, Metric>)
);
const PERIODS = new Map<string, Period>(
  Object.entries({
    daily: 'day',
    weekly: 'week',
    monthly: 'month',
    sessions: 'sessions',
    lifetime: 'all_time',
  } satisfies Record<GoalPeriod, Period>)
);
const DIRECTIONS = new Map<string, Direction>(
  Object.entries({
    atLeast: 'at_least',
    atMost: 'at_most',
  } satisfies Record<GoalDirection, Direction>)
);

const MAX_TARGET = 1_000_000_000_000;
const MAX_SESSION_COUNT = 1000;
const MAX_ACCOUNT_TARGETS = 100;

const isTarget = (value: unknown): value is number =>
  typeof value === 'number' &&
  Number.isFinite(value) &&
  value >= 0 &&
  value <= MAX_TARGET;


export const goalTypeOf = (metric: Metric): GoalType => GOAL_TYPES[metric];


export function projectHomeGoal(
  value: unknown,
  accountIdFor: (name: string) => string | undefined
): HomeGoal | undefined {
  if (!isRecord(value)) return undefined;
  const metric =
    typeof value.type === 'string' ? METRICS.get(value.type) : undefined;
  const period =
    typeof value.period === 'string' ? PERIODS.get(value.period) : undefined;
  const direction =
    value.direction === undefined
      ? 'at_least'
      : typeof value.direction === 'string'
        ? DIRECTIONS.get(value.direction)
        : undefined;
  if (!metric || !period || !direction || !isTarget(value.target))
    return undefined;
  if (period === 'all_time' && metric !== 'trade_count') return undefined;
  if (metric === 'win_rate' && value.target > 100) return undefined;
  const goal: HomeGoal = { metric, direction, target: value.target, period };
  if (period === 'sessions') {
    const count = value.sessionCount;
    if (
      typeof count !== 'number' ||
      !Number.isInteger(count) ||
      count < 1 ||
      count > MAX_SESSION_COUNT
    )
      return undefined;
    goal.session_count = count;
  }
  if (value.accountAware === true) {
    const targets = isRecord(value.accountTargets) ? value.accountTargets : {};
    const accounts = Array.isArray(value.accountTargetAccounts)
      ? value.accountTargetAccounts
      : [];
    const accountTargets: NonNullable<HomeGoal['account_targets']> = [];
    const seen = new Set<string>();
    for (const account of accounts) {
      if (typeof account !== 'string') return undefined;
      const target = targets[account];
      if (!isTarget(target) || target === 0) continue;
      if (metric === 'win_rate' && target > 100) return undefined;
      const accountId = accountIdFor(account);
      
      if (accountId === undefined) continue;
      if (seen.has(accountId)) return undefined;
      seen.add(accountId);
      accountTargets.push({ account_id: accountId, target });
    }
    if (
      accountTargets.length === 0 ||
      accountTargets.length > MAX_ACCOUNT_TARGETS
    )
      return undefined;
    goal.account_targets = accountTargets;
  } else if (metric === 'net_pnl' && value.useRMultiples === true) {
    goal.r_multiples = true;
  }
  return goal;
}


export function goalConfigFromHomeGoal(
  goal: HomeGoal,
  accountNames: readonly string[],
  createdAt: string
): GoalConfig {
  const type = GOAL_TYPES[goal.metric];
  const period = GOAL_PERIODS[goal.period];
  const accountTargets = goal.account_targets;
  return {
    type,
    target: accountTargets
      ? aggregateGoalAccountTargets(
          type,
          accountTargets.map(({ target }) => target)
        )
      : goal.target,
    period,
    sessionCount: period === 'sessions' ? goal.session_count : undefined,
    direction: GOAL_DIRECTIONS[goal.direction],
    useRMultiples: type === 'pnl' ? goal.r_multiples === true : undefined,
    accountAware: accountTargets ? true : undefined,
    accountTargets: accountTargets
      ? Object.fromEntries(
          accountTargets.map(({ target }, index) => [
            accountNames[index],
            target,
          ])
        )
      : undefined,
    accountTargetAccounts: accountTargets ? [...accountNames] : undefined,
    createdAt,
  };
}
