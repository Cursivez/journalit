

import type JournalitPlugin from '../../../main';
import type {
  GoalConfig,
  GoalDirection,
  GoalPeriod,
  GoalType,
} from '../../../settings/types';
import {
  Trade,
  dashboardRecentPeriodAccess,
  isTradeOpenInDashboard,
} from '../../dashboard/utils/dataUtils';
import { calculateCoreTradeMetrics } from '../../../services/analytics/metrics';
import { classifyPnLWithBreakEvenSettings } from '../../../utils/breakEvenRange';
import { analyzeDrawdown } from '../../../utils/drawdownAnalytics';
import {
  getEffectivePnL,
  isPnlContributingTrade,
} from '../../../utils/tradeStatusUtils';
import {
  getAnalyticsDateBasis,
  getTradeAnalyticsDate,
  getTradeAnalyticsTradingDay,
} from '../../../utils/tradeAnalyticsDate';
import {
  getWeekStartDate,
  WeekStartDaySetting,
} from '../../../utils/dateUtils';
import { getTradingDay } from '../../../utils/tradingDayUtils';
import {
  RECENT_PERIOD_MAX_COUNT,
  isInRecentPeriodWindow,
  resolveRecentPeriodWindow,
} from '../../shared/filters/recentPeriod';


export const DEFAULT_GOAL_SESSION_COUNT = 20;


export const defaultGoalDirection = (type: GoalType): GoalDirection =>
  type === 'maxDrawdown' ? 'atMost' : 'atLeast';


export const goalDirectionOf = (config: GoalConfig): GoalDirection =>
  config.direction ?? 'atLeast';


export const parseGoalSessionCount = (raw: string): number | undefined => {
  const value = Number(raw);
  return Number.isInteger(value) &&
    value >= 1 &&
    value <= RECENT_PERIOD_MAX_COUNT
    ? value
    : undefined;
};

const CALENDAR_PERIODS: readonly GoalPeriod[] = [
  'daily',
  'weekly',
  'monthly',
  'sessions',
];


export const goalPeriodsFor = (type: GoalType): readonly GoalPeriod[] =>
  type === 'tradesJournaled'
    ? [...CALENDAR_PERIODS, 'lifetime']
    : CALENDAR_PERIODS;

export interface GoalPeriodContext {
  plugin: JournalitPlugin;
  weekStartDay: WeekStartDaySetting;
  now: Date;
}


export function goalPeriodTrades(
  trades: readonly Trade[],
  config: Pick<GoalConfig, 'period' | 'sessionCount'>,
  { plugin, weekStartDay, now }: GoalPeriodContext
): Trade[] {
  if (config.period === 'lifetime') return [...trades];
  const basis = getAnalyticsDateBasis(plugin.settings);
  if (config.period === 'sessions') {
    
    
    
    
    
    const dashboardAccess = dashboardRecentPeriodAccess(basis, plugin);
    const access: typeof dashboardAccess = {
      ...dashboardAccess,
      isClosed: (trade) =>
        dashboardAccess.isClosed(trade) &&
        trade._dashboardClosesSourceTrade !== false,
    };
    const window = resolveRecentPeriodWindow(
      trades,
      {
        unit: 'sessions',
        count: config.sessionCount ?? DEFAULT_GOAL_SESSION_COUNT,
      },
      access,
      { today: getTradingDay(now, plugin) }
    );
    return trades.filter((trade) =>
      isInRecentPeriodWindow(trade, window, access)
    );
  }
  const periodEnd = getTradingDay(now, plugin);
  let periodStart: Date;
  if (config.period === 'daily') {
    periodStart = new Date(periodEnd);
    periodStart.setHours(0, 0, 0, 0);
  } else if (config.period === 'weekly') {
    periodStart = getWeekStartDate(periodEnd, weekStartDay);
  } else {
    periodStart = new Date(periodEnd.getFullYear(), periodEnd.getMonth(), 1);
  }
  return trades.filter((trade) => {
    const day = getTradeAnalyticsTradingDay(trade, basis, plugin);
    return day !== null && day >= periodStart && day <= periodEnd;
  });
}

type BreakEvenSettings = Parameters<typeof classifyPnLWithBreakEvenSettings>[1];

export interface GoalMetricContext {
  breakEvenSettings: BreakEvenSettings;
  analyticsDateBasis: 'entry' | 'exit';
  
  rRiskAmount?: number;
}


export function goalMetricValue(
  type: GoalType,
  periodTrades: readonly Trade[],
  context: GoalMetricContext
): number {
  if (type === 'tradesJournaled') {
    return periodTrades.filter((trade) => !isTradeOpenInDashboard(trade))
      .length;
  }
  const contributing = periodTrades.filter((trade) =>
    isPnlContributingTrade(trade)
  );
  if (type === 'maxDrawdown') {
    return analyzeDrawdown(
      contributing.map((trade) => ({
        path: trade.path,
        exitTime: getTradeAnalyticsDate(trade, context.analyticsDateBasis),
        pnl: getEffectivePnL(trade),
        tradeStatus: 'CLOSED',
      })),
      { assumeClosedTrades: true }
    ).summary.maxDrawdownAmount;
  }
  const netPnLValues: number[] = [];
  const winningNetPnL: number[] = [];
  const losingNetPnL: number[] = [];
  for (const trade of contributing) {
    const pnl = getEffectivePnL(trade);
    netPnLValues.push(pnl);
    const outcome = classifyPnLWithBreakEvenSettings(
      pnl,
      context.breakEvenSettings,
      trade.breakEvenAccountCurrentBalance
    );
    if (outcome === 'win') winningNetPnL.push(pnl);
    else if (outcome === 'loss') losingNetPnL.push(pnl);
  }
  const core = calculateCoreTradeMetrics({
    netPnLValues,
    winningNetPnL,
    losingNetPnL,
  });
  switch (type) {
    case 'pnl':
      return context.rRiskAmount === undefined
        ? core.netPnL
        : core.netPnL / context.rRiskAmount;
    case 'winRate':
      return core.winRate * 100;
    case 'profitFactor':
      return core.profitFactor;
    case 'expectancy':
      return core.expectancy;
  }
}

export interface GoalStanding {
  
  percentage: number;
  
  isComplete: boolean;
  
  exceeded: boolean;
}


export function goalStanding(
  current: number,
  target: number,
  direction: GoalDirection
): GoalStanding {
  
  const percentage = Math.max(0, Math.min((current / target) * 100, 100));
  return direction === 'atMost'
    ? { percentage, isComplete: false, exceeded: current > target }
    : { percentage, isComplete: current >= target, exceeded: false };
}
