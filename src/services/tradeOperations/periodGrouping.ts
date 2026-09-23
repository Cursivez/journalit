import type JournalitPlugin from '../../main';
import {
  formatDateDisplay,
  getQuarter,
  getWeekStartDate,
  getWeekStartDaySetting,
} from '../../utils/dateUtils';
import {
  createTradingDayFromString,
  getTradingDayString,
} from '../../utils/tradingDayUtils';
import type { TradeOperationTrade } from './types';

const MONTH_YEAR_FORMATTER = new Intl.DateTimeFormat(undefined, {
  month: 'long',
  year: 'numeric',
});

export type ReviewPeriodLevel =
  | 'days'
  | 'weeks'
  | 'months'
  | 'quarters'
  | 'years';

export interface AffectedPeriod {
  id: string;
  level: ReviewPeriodLevel;
  label: string;
  anchorDate: Date;
}

interface TradeOperationPeriodDistribution {
  recommendedLevel: ReviewPeriodLevel;
  groupsByLevel: Record<ReviewPeriodLevel, AffectedPeriod[]>;
}

const LEVELS: ReviewPeriodLevel[] = [
  'days',
  'weeks',
  'months',
  'quarters',
  'years',
];

interface AffectedTradingDay {
  id: string;
  date: Date;
}

function localDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function periodId(level: ReviewPeriodLevel, date: Date): string {
  switch (level) {
    case 'days':
      return localDateKey(date);
    case 'weeks':
      return `W:${localDateKey(date)}`;
    case 'months':
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    case 'quarters':
      return `${date.getFullYear()}-Q${getQuarter(date)}`;
    case 'years':
      return String(date.getFullYear());
  }
}

function periodLabel(
  level: ReviewPeriodLevel,
  anchorDate: Date,
  plugin: JournalitPlugin
): string {
  switch (level) {
    case 'days':
      return formatDateDisplay(anchorDate, plugin.settings.trade.dateFormat);
    case 'weeks': {
      const endDate = new Date(anchorDate);
      endDate.setDate(endDate.getDate() + 6);
      return `${formatDateDisplay(anchorDate, plugin.settings.trade.dateFormat)} – ${formatDateDisplay(endDate, plugin.settings.trade.dateFormat)}`;
    }
    case 'months':
      return MONTH_YEAR_FORMATTER.format(anchorDate);
    case 'quarters':
      return `Q${getQuarter(anchorDate)} ${anchorDate.getFullYear()}`;
    case 'years':
      return String(anchorDate.getFullYear());
  }
}

function anchorForLevel(
  level: ReviewPeriodLevel,
  day: Date,
  plugin: JournalitPlugin
): Date {
  switch (level) {
    case 'days':
      return new Date(day);
    case 'weeks':
      return getWeekStartDate(day, getWeekStartDaySetting(plugin));
    case 'months':
      return new Date(day.getFullYear(), day.getMonth(), 1);
    case 'quarters':
      return new Date(day.getFullYear(), (getQuarter(day) - 1) * 3, 1);
    case 'years':
      return new Date(day.getFullYear(), 0, 1);
  }
}

function affectedTradingDays(
  trades: readonly TradeOperationTrade[],
  plugin: JournalitPlugin
): AffectedTradingDay[] {
  const datesById = new Map<string, Date>();
  for (const trade of trades) {
    const entryDate = new Date(trade.entryTime);
    if (Number.isNaN(entryDate.getTime())) continue;
    const dayId = getTradingDayString(entryDate, plugin);
    if (!datesById.has(dayId)) {
      datesById.set(dayId, createTradingDayFromString(dayId));
    }
  }
  return Array.from(datesById.entries())
    .map(([id, date]) => ({ id, date }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}

function groupsForLevel(
  level: ReviewPeriodLevel,
  days: readonly AffectedTradingDay[],
  plugin: JournalitPlugin
): AffectedPeriod[] {
  const groups = new Map<string, Date>();
  for (const day of days) {
    const anchorDate = anchorForLevel(level, day.date, plugin);
    const id = periodId(level, anchorDate);
    if (!groups.has(id)) groups.set(id, anchorDate);
  }

  return Array.from(groups.entries())
    .map(([id, anchorDate]) => ({
      id,
      level,
      label: periodLabel(level, anchorDate, plugin),
      anchorDate,
    }))
    .sort((a, b) => a.anchorDate.getTime() - b.anchorDate.getTime());
}

function recommendLevel(
  groups: Record<ReviewPeriodLevel, AffectedPeriod[]>,
  affectedDayCount: number
): ReviewPeriodLevel {
  if (affectedDayCount <= 1) return 'days';
  if (groups.weeks.length === 1) return 'weeks';
  if (groups.years.length > 1) return 'years';
  if (
    groups.months.length === 1 &&
    groups.weeks.length >= 3 &&
    affectedDayCount >= 6
  ) {
    return 'months';
  }
  if (
    groups.quarters.length === 1 &&
    groups.months.length >= 2 &&
    affectedDayCount >= 12
  ) {
    return 'quarters';
  }
  if (
    groups.years.length === 1 &&
    groups.quarters.length >= 2 &&
    affectedDayCount >= 24
  ) {
    return 'years';
  }
  for (const level of LEVELS) {
    if (groups[level].length <= 5) return level;
  }
  return 'years';
}

export function buildTradeOperationPeriodDistribution(
  trades: readonly TradeOperationTrade[],
  plugin: JournalitPlugin
): TradeOperationPeriodDistribution {
  const days = affectedTradingDays(trades, plugin);
  const dayGroups = groupsForLevel('days', days, plugin);
  const weekGroups = groupsForLevel('weeks', days, plugin);
  const monthGroups = groupsForLevel('months', days, plugin);
  const quarterGroups = groupsForLevel('quarters', days, plugin);
  const yearGroups = groupsForLevel('years', days, plugin);
  const groupsByLevel = {
    days: dayGroups,
    weeks: weekGroups,
    months: monthGroups,
    quarters: quarterGroups,
    years: yearGroups,
  } satisfies Record<ReviewPeriodLevel, AffectedPeriod[]>;
  return {
    recommendedLevel: recommendLevel(groupsByLevel, days.length),
    groupsByLevel,
  };
}
