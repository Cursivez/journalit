
import type { BreakEvenRangeSettings } from '../../../../utils/breakEvenRange';
import type {
  PerformanceBreakdownMetric,
  PerformanceBreakdownViewMode,
} from '../../../../settings/types';
import {
  calculateWinRateExcludingBreakeven,
  classifyPnLWithBreakEvenSettings,
} from '../../../../utils/breakEvenRange';
import type { Trade } from '../../utils/dataUtils';
import { calculateEffectiveRMultiple } from '../../../../utils/formatting';
import {
  getEffectivePnL,
  isPnlContributingTrade,
} from '../../../../utils/tradeStatusUtils';


export type PerformanceGroupExtractor = (trade: Trade) => readonly string[];

export interface PerformanceBreakdownOptions {
  breakEvenSettings?: BreakEvenRangeSettings;
  defaultRiskAmount?: number;
  useStoredRMultiple: boolean;
  includePnLTotals: boolean;
  displayRMultiples: boolean;
  metric: PerformanceBreakdownMetric;
  viewMode: PerformanceBreakdownViewMode;
  getGroups: PerformanceGroupExtractor;
}

type PerformanceBreakdownROptions = Pick<
  PerformanceBreakdownOptions,
  'defaultRiskAmount' | 'useStoredRMultiple'
>;

export interface PerformanceBreakdownRow {
  label: string;
  totalPnL: number;
  totalR: number;
  tradeCount: number;
  rTradeCount: number;
  wins: number;
  losses: number;
  winRate: number;
}

interface PerformanceBreakdownSelection {
  visibleRows: PerformanceBreakdownRow[];
  omittedRowCount: number;
  dividerIndex?: number;
}

export interface PerformanceBreakdownResult extends PerformanceBreakdownSelection {
  rankedRows: PerformanceBreakdownRow[];
  totalTradeCount: number;
  totalRTradeCount: number;
  hasCompleteRCoverage: boolean;
  usesRMultiples: boolean;
}

export const PERFORMANCE_BREAKDOWN_MAX_VISIBLE_ROWS = 10;
const TOP_BOTTOM_ROW_COUNT = 5;

const createEmptyRow = (label: string): PerformanceBreakdownRow => ({
  label,
  totalPnL: 0,
  totalR: 0,
  tradeCount: 0,
  rTradeCount: 0,
  wins: 0,
  losses: 0,
  winRate: 0,
});

const getEffectiveRMultiple = (
  trade: Trade,
  pnl: number,
  options: PerformanceBreakdownROptions
): number | undefined =>
  calculateEffectiveRMultiple(
    pnl,
    options.useStoredRMultiple ? trade.rMultiple : undefined,
    trade.riskAmount,
    options.defaultRiskAmount
  );

export const hasCompletePerformanceBreakdownRMultipleCoverage = (
  trades: readonly Trade[],
  options: PerformanceBreakdownROptions & {
    getGroups: PerformanceGroupExtractor;
  }
): boolean => {
  for (const trade of trades) {
    if (
      options.getGroups(trade).length === 0 ||
      !isPnlContributingTrade(trade)
    ) {
      continue;
    }

    const effectiveR = getEffectiveRMultiple(
      trade,
      getEffectivePnL(trade),
      options
    );
    if (effectiveR === undefined || !Number.isFinite(effectiveR)) {
      return false;
    }
  }

  return true;
};

export const hasUnconvertedMixedCurrencyPerformanceGroups = (
  trades: readonly Trade[],
  options: {
    defaultCurrency: string;
    conversionBaseCurrency?: string;
    getGroups: PerformanceGroupExtractor;
  }
): boolean => {
  if (options.conversionBaseCurrency) return false;

  const currencies = new Set<string>();
  for (const trade of trades) {
    if (
      !isPnlContributingTrade(trade) ||
      options.getGroups(trade).length === 0
    ) {
      continue;
    }

    currencies.add(trade.currency || options.defaultCurrency);
    if (currencies.size > 1) return true;
  }

  return false;
};

const compareText = (first: string, second: string): number => {
  if (first < second) return -1;
  if (first > second) return 1;
  return 0;
};

const compareDescending = (first: number, second: number): number => {
  if (second < first) return -1;
  if (second > first) return 1;
  return 0;
};

const getPrimaryMetricValue = (
  row: PerformanceBreakdownRow,
  metric: PerformanceBreakdownMetric,
  usesRMultiples: boolean
): number => {
  if (metric === 'winRate') {
    return row.winRate;
  }

  return usesRMultiples ? row.totalR : row.totalPnL;
};

const rankRows = (
  rows: readonly PerformanceBreakdownRow[],
  metric: PerformanceBreakdownMetric,
  usesRMultiples: boolean
): PerformanceBreakdownRow[] =>
  Array.from(rows).sort((first, second) => {
    const primaryComparison = compareDescending(
      getPrimaryMetricValue(first, metric, usesRMultiples),
      getPrimaryMetricValue(second, metric, usesRMultiples)
    );
    if (primaryComparison !== 0) return primaryComparison;

    const tradeCountComparison = compareDescending(
      first.tradeCount,
      second.tradeCount
    );
    if (tradeCountComparison !== 0) return tradeCountComparison;

    const secondaryComparison =
      metric === 'winRate'
        ? compareDescending(
            getPrimaryMetricValue(first, 'net', usesRMultiples),
            getPrimaryMetricValue(second, 'net', usesRMultiples)
          )
        : compareDescending(first.winRate, second.winRate);
    if (secondaryComparison !== 0) return secondaryComparison;

    return compareText(first.label, second.label);
  });

const selectRows = (
  rankedRows: readonly PerformanceBreakdownRow[],
  viewMode: PerformanceBreakdownViewMode
): PerformanceBreakdownSelection => {
  if (rankedRows.length <= PERFORMANCE_BREAKDOWN_MAX_VISIBLE_ROWS) {
    return { visibleRows: [...rankedRows], omittedRowCount: 0 };
  }

  const omittedRowCount =
    rankedRows.length - PERFORMANCE_BREAKDOWN_MAX_VISIBLE_ROWS;
  switch (viewMode) {
    case 'bestAndWorst':
      return {
        visibleRows: [
          ...rankedRows.slice(0, TOP_BOTTOM_ROW_COUNT),
          ...rankedRows.slice(-TOP_BOTTOM_ROW_COUNT),
        ],
        omittedRowCount,
        dividerIndex: TOP_BOTTOM_ROW_COUNT,
      };
    case 'best':
      return {
        visibleRows: rankedRows.slice(
          0,
          PERFORMANCE_BREAKDOWN_MAX_VISIBLE_ROWS
        ),
        omittedRowCount,
      };
    case 'worst':
      return {
        visibleRows: rankedRows
          .slice(-PERFORMANCE_BREAKDOWN_MAX_VISIBLE_ROWS)
          .reverse(),
        omittedRowCount,
      };
    default: {
      const _exhaustive: never = viewMode;
      return _exhaustive;
    }
  }
};

export const buildPerformanceBreakdown = (
  trades: readonly Trade[],
  options: PerformanceBreakdownOptions
): PerformanceBreakdownResult => {
  const aggregates = new Map<string, PerformanceBreakdownRow>();

  for (const trade of trades) {
    if (!isPnlContributingTrade(trade)) continue;

    const groups = options.getGroups(trade);
    if (groups.length === 0) continue;

    const pnl = getEffectivePnL(trade);
    const outcome = classifyPnLWithBreakEvenSettings(
      pnl,
      options.breakEvenSettings,
      trade.breakEvenAccountCurrentBalanceTotal ??
        trade.breakEvenAccountCurrentBalance
    );
    const effectiveR = getEffectiveRMultiple(trade, pnl, options);

    for (const group of groups) {
      let row = aggregates.get(group);
      if (!row) {
        row = createEmptyRow(group);
        aggregates.set(group, row);
      }

      if (options.includePnLTotals) row.totalPnL += pnl;
      row.tradeCount += 1;
      if (outcome === 'win') row.wins += 1;
      else if (outcome === 'loss') row.losses += 1;

      if (effectiveR !== undefined && Number.isFinite(effectiveR)) {
        row.totalR += effectiveR;
        row.rTradeCount += 1;
      }
    }
  }

  for (const row of aggregates.values()) {
    row.winRate = calculateWinRateExcludingBreakeven(row.wins, row.losses);
  }

  const aggregatedRows = Array.from(aggregates.values());
  const totalTradeCount = aggregatedRows.reduce(
    (total, row) => total + row.tradeCount,
    0
  );
  const totalRTradeCount = aggregatedRows.reduce(
    (total, row) => total + row.rTradeCount,
    0
  );
  const hasCompleteRCoverage = totalTradeCount === totalRTradeCount;
  const usesRMultiples = options.displayRMultiples && hasCompleteRCoverage;
  const rankedRows = rankRows(aggregatedRows, options.metric, usesRMultiples);

  return {
    rankedRows,
    ...selectRows(rankedRows, options.viewMode),
    totalTradeCount,
    totalRTradeCount,
    hasCompleteRCoverage,
    usesRMultiples,
  };
};
