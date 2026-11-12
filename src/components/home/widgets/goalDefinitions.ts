

import type { GoalDirection, GoalType } from '../../../settings/types';


export const GOAL_HEADER_KEYS = {
  atLeast: {
    pnl: 'home.widget.goals-progress.header.pnl',
    tradesJournaled: 'home.widget.goals-progress.header.trades',
    winRate: 'home.widget.goals-progress.header.win-rate',
    profitFactor: 'home.widget.goals-progress.header.profit-factor',
    expectancy: 'home.widget.goals-progress.header.expectancy',
    maxDrawdown: 'home.widget.goals-progress.header.max-drawdown',
  },
  atMost: {
    pnl: 'home.widget.goals-progress.header.limit.pnl',
    tradesJournaled: 'home.widget.goals-progress.header.limit.trades',
    winRate: 'home.widget.goals-progress.header.limit.win-rate',
    profitFactor: 'home.widget.goals-progress.header.limit.profit-factor',
    expectancy: 'home.widget.goals-progress.header.limit.expectancy',
    maxDrawdown: 'home.widget.goals-progress.header.limit.max-drawdown',
  },
} as const satisfies Record<GoalDirection, Record<GoalType, string>>;

const AVERAGED_GOAL_TYPES: ReadonlySet<GoalType> = new Set([
  'winRate',
  'profitFactor',
  'expectancy',
]);


export function aggregateGoalAccountTargets(
  type: GoalType,
  targets: readonly number[]
): number {
  const positive = targets.filter((value) => value > 0);
  const sum = positive.reduce((total, value) => total + value, 0);
  if (!AVERAGED_GOAL_TYPES.has(type)) return sum;
  return positive.length > 0 ? sum / positive.length : 0;
}


export const isValidGoalTarget = (type: GoalType, value: number): boolean =>
  Number.isFinite(value) && value > 0 && (type !== 'winRate' || value <= 100);
