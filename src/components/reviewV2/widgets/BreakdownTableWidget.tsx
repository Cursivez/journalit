

import React, { useState, useMemo, useCallback } from 'react';
import { hasTranslation, t } from '../../../lang/helpers';
import {
  getEffectivePnL,
  isPnlContributingTrade,
} from '../../../utils/tradeStatusUtils';
import { calculateEffectiveRMultiple } from '../../../utils/formatting';
import { useDisplayFormatter } from '../../../hooks/useDisplayPolicy';
import { resolveReviewCurrency } from './shared/reviewWidgetSettings';
import { getDisplayPnL, getAccountCount } from '../../../utils/pnlUtils';
import {
  formatDateDisplay,
  getUserDateFormat,
  safeDateSort,
  getQuarterForMonth,
  getWeekNumberForDate,
  getWeekStartDaySetting,
} from '../../../utils/dateUtils';
import JournalitPlugin from '../../../main';
import { TradesPreviewData } from '../../../types/reviewV2';
import { Trade } from '../../drc/types';
import { useReviewTrades } from '../hooks/useReviewData';
import { useEventBus } from '../../../hooks/useEventBus';
import { SkeletonBox } from '../../shared/SkeletonBox';
import { InvalidContextMessage } from './InvalidContextMessage';
import { classifyPnLWithBreakEvenSettings } from '../../../utils/breakEvenRange';
import { getBreakEvenBalanceForDisplayTrade } from './shared/breakEvenDisplayUtils';
import {
  getReviewTradeDate,
  getReviewTradeTradingDay,
  splitReviewTradeByRealizedPnlEvent,
} from '../utils/reviewTradeDates';
import { openReviewWidgetFile } from '../reviewWidgetNavigation';

type BreakdownTrade = Trade & { _reviewBreakdownDate?: Date };

const asBreakdownTrades = (value: unknown): BreakdownTrade[] =>
  Array.isArray(value)
    ? value.filter((item): item is BreakdownTrade =>
        Boolean(item && typeof item === 'object' && !Array.isArray(item))
      )
    : [];

type BreakdownPeriod = 'daily' | 'weekly' | 'monthly' | 'quarterly';


const getMonthName = (monthIndex: number): string => {
  const key = `widget.header.month.${monthIndex}`;
  return hasTranslation(key) ? t(key) : key;
};

interface BreakdownTableWidgetProps {
  filePath: string;
  plugin: JournalitPlugin;
  config?: BreakdownTableWidgetConfig;
  preview?: boolean;
  previewData?: TradesPreviewData;
  period?: BreakdownPeriod; 
}

interface BreakdownTableWidgetConfig {
  groupBy?: 'day' | 'week' | 'month' | 'quarter'; 
  columns?: {
    date?: boolean;
    trades?: boolean;
    winRate?: boolean;
    profitFactor?: boolean;
    pnl?: boolean;
  };
}

const DEFAULT_CONFIG: BreakdownTableWidgetConfig = {
  columns: {
    date: true,
    trades: true,
    winRate: true,
    profitFactor: true,
    pnl: true,
  },
};

type BreakdownColumns = BreakdownTableWidgetConfig['columns'];


const BREAKDOWN_GROUP_SHAPES = {
  day: {
    headerKey: 'widget.table.header.date',
    emptyKey: 'widget.breakdown.empty.days-week',
    skeletonRows: 5,
    skeletonDateWidth: 70,
  },
  week: {
    headerKey: 'widget.table.header.week',
    emptyKey: 'widget.breakdown.empty.weeks-month',
    skeletonRows: 4,
    skeletonDateWidth: 35,
  },
  month: {
    headerKey: 'widget.table.header.month',
    emptyKey: 'widget.breakdown.empty.months-quarter',
    skeletonRows: 3,
    skeletonDateWidth: 100,
  },
  quarter: {
    headerKey: 'widget.table.header.quarter',
    emptyKey: 'widget.breakdown.empty.quarters-year',
    skeletonRows: 4,
    skeletonDateWidth: 60,
  },
} as const;

type BreakdownGroupBy = keyof typeof BREAKDOWN_GROUP_SHAPES;

const BREAKDOWN_GROUP_BY_VALUES: ReadonlySet<string> = new Set(
  Object.keys(BREAKDOWN_GROUP_SHAPES)
);

const isBreakdownGroupBy = (value: unknown): value is BreakdownGroupBy =>
  typeof value === 'string' && BREAKDOWN_GROUP_BY_VALUES.has(value);

interface BreakdownRow {
  key: string;
  label: string;
  tradeCount: number;
  pnl: number;
  pnlR?: number;
  winRate: number;
  profitFactor: number;
  onOpen: () => void;
}

interface BreakdownFormat {
  pnl: (value: number, rMultiple?: number) => string;
  winRate: (value: number) => string;
  profitFactor: (value: number) => string;
  pnlTone: (value: number) => string;
  metricTone: (value: number) => string;
}

const HEADER_CELL = 'journalit-reviewv2-table-header-cell';
const COMPACT_CELL =
  'journalit-reviewv2-table-cell journalit-reviewv2-table-cell--compact';
const EMPHASIS_CELL = `${COMPACT_CELL} journalit-reviewv2-table-cell--emphasis`;

const BreakdownHeaderRow: React.FC<{
  columns: BreakdownColumns;
  dateHeader: string;
}> = ({ columns, dateHeader }) => (
  <thead>
    <tr>
      {columns?.date && (
        <th className={`${HEADER_CELL} journalit-reviewv2-col-date`}>
          {dateHeader}
        </th>
      )}
      {columns?.trades && (
        <th className={`${HEADER_CELL} journalit-reviewv2-col-trades`}>
          {t('widget.table.header.trades')}
        </th>
      )}
      {columns?.pnl && (
        <th className={`${HEADER_CELL} journalit-reviewv2-col-pnl`}>
          {t('widget.table.header.pnl')}
        </th>
      )}
      {columns?.winRate && (
        <th className={`${HEADER_CELL} journalit-reviewv2-col-winrate`}>
          {t('widget.table.header.win-rate')}
        </th>
      )}
      {columns?.profitFactor && (
        <th className={`${HEADER_CELL} journalit-reviewv2-col-profit-factor`}>
          {t('widget.table.header.profit-factor')}
        </th>
      )}
    </tr>
  </thead>
);

const BreakdownSkeleton: React.FC<{
  columns: BreakdownColumns;
  dateHeader: string;
  rowCount: number;
  dateSkeletonWidth: number;
}> = ({ columns, dateHeader, rowCount, dateSkeletonWidth }) => (
  <table className="weekly-review-trades-table journalit-reviewv2-table journalit-reviewv2-table--compact">
    <BreakdownHeaderRow columns={columns} dateHeader={dateHeader} />
    <tbody>
      {Array.from({ length: rowCount }).map((_, i) => (
        <tr
          key={i}
          className="journalit-reviewv2-table-row journalit-reviewv2-table-row--static"
        >
          {columns?.date && (
            <td className={`${COMPACT_CELL} journalit-reviewv2-col-date`}>
              <SkeletonBox
                width={dateSkeletonWidth}
                height={14}
                borderRadius="4px"
              />
            </td>
          )}
          {columns?.trades && (
            <td className={`${COMPACT_CELL} journalit-reviewv2-col-trades`}>
              <SkeletonBox width={25} height={14} borderRadius="4px" />
            </td>
          )}
          {columns?.pnl && (
            <td className={`${COMPACT_CELL} journalit-reviewv2-col-pnl`}>
              <SkeletonBox width={65} height={14} borderRadius="4px" />
            </td>
          )}
          {columns?.winRate && (
            <td className={`${COMPACT_CELL} journalit-reviewv2-col-winrate`}>
              <SkeletonBox width={40} height={14} borderRadius="4px" />
            </td>
          )}
          {columns?.profitFactor && (
            <td
              className={`${COMPACT_CELL} journalit-reviewv2-col-profit-factor`}
            >
              <SkeletonBox width={35} height={14} borderRadius="4px" />
            </td>
          )}
        </tr>
      ))}
    </tbody>
  </table>
);

const BreakdownTableRow: React.FC<{
  row: BreakdownRow;
  columns: BreakdownColumns;
  format: BreakdownFormat;
}> = ({ row, columns, format }) => (
  <tr
    tabIndex={0}
    onKeyDown={(event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        event.currentTarget.click();
      }
    }}
    className="weekly-review-trade-row journalit-reviewv2-table-row journalit-reviewv2-table-row--interactive"
    onClick={row.onOpen}
  >
    {columns?.date && (
      <td className={`${COMPACT_CELL} journalit-reviewv2-col-date`}>
        {row.label}
      </td>
    )}
    {columns?.trades && (
      <td className={`${COMPACT_CELL} journalit-reviewv2-col-trades`}>
        {row.tradeCount}
      </td>
    )}
    {columns?.pnl && (
      <td
        className={`${EMPHASIS_CELL} journalit-reviewv2-col-pnl ${format.pnlTone(row.pnl)}`}
      >
        {format.pnl(row.pnl, row.pnlR)}
      </td>
    )}
    {columns?.winRate && (
      <td className={`${COMPACT_CELL} journalit-reviewv2-col-winrate`}>
        {format.winRate(row.winRate)}
      </td>
    )}
    {columns?.profitFactor && (
      <td
        className={`${EMPHASIS_CELL} journalit-reviewv2-col-profit-factor ${format.metricTone(row.profitFactor)}`}
      >
        {format.profitFactor(row.profitFactor)}
      </td>
    )}
  </tr>
);

export const BreakdownTableWidget: React.FC<BreakdownTableWidgetProps> =
  React.memo(
    ({
      filePath,
      plugin,
      config = {},
      preview = false,
      previewData,
      period,
    }) => {
      const mergedConfig = {
        ...DEFAULT_CONFIG,
        ...config,
        columns: { ...DEFAULT_CONFIG.columns, ...config?.columns },
      };

      
      const {
        trades: cachedTrades,
        loading: cacheLoading,
        noteType: cachedNoteType,
      } = useReviewTrades(filePath, plugin);

      
      const trades = asBreakdownTrades(
        preview && previewData ? previewData.trades : cachedTrades
      );
      const loading = preview ? false : cacheLoading;
      const noteType = cachedNoteType || '';

      
      const userDateFormat = useMemo(() => getUserDateFormat(), []);

      
      const [, setSettingsVersion] = useState(0);

      useEventBus(
        'settings:changed',
        useCallback(() => {
          setSettingsVersion((v) => v + 1);
        }, []),
        !preview
      );

      const { formatValue, shouldMask } = useDisplayFormatter();
      const isPnlMasked = shouldMask('pnl');
      const isMetricMasked = shouldMask('metric');

      
      const groupBy = useMemo(() => {
        
        
        if (isBreakdownGroupBy(config.groupBy)) return config.groupBy;
        
        if (period === 'daily') return 'day';
        if (period === 'weekly') return 'week';
        if (period === 'monthly') return 'month';
        if (period === 'quarterly') return 'quarter';
        
        if (noteType === 'weekly-review') return 'day';
        if (noteType === 'monthly-review') return 'week';
        if (noteType === 'quarterly-review') return 'month';
        if (noteType === 'yearly-review') return 'quarter';
        return 'day'; 
      }, [config.groupBy, period, noteType]);

      
      const validationResult = useMemo(() => {
        if (preview) return { valid: true };
        if (!noteType) return { valid: true }; 

        
        if (period === 'monthly') {
          const allowed = ['quarterly-review', 'yearly-review'];
          if (!allowed.includes(noteType)) {
            return {
              valid: false,
              widgetName: t('widget.breakdown-monthly.name'),
              reason: t('widget.invalid-context.quarterly-yearly'),
            };
          }
        }

        
        if (period === 'quarterly') {
          if (noteType !== 'yearly-review') {
            return {
              valid: false,
              widgetName: t('widget.breakdown-quarterly.name'),
              reason: t('widget.invalid-context.yearly-only'),
            };
          }
        }

        return { valid: true };
      }, [preview, noteType, period]);

      const closedTrades = useMemo<BreakdownTrade[]>(() => {
        return asBreakdownTrades(
          trades.flatMap((trade) =>
            isPnlContributingTrade(trade)
              ? splitReviewTradeByRealizedPnlEvent(trade, plugin)
              : []
          )
        );
      }, [trades, plugin]);

      const getAnalyticsDate = useCallback(
        (trade: BreakdownTrade) =>
          trade._reviewBreakdownDate ?? getReviewTradeDate(trade, plugin),
        [plugin]
      );
      const getAnalyticsTradingDay = useCallback(
        (trade: BreakdownTrade) =>
          trade._reviewBreakdownDate ?? getReviewTradeTradingDay(trade, plugin),
        [plugin]
      );

      
      const dailyBreakdown = useMemo(() => {
        if (groupBy !== 'day' || closedTrades.length === 0) return [];

        const defaultRiskAmount = plugin?.settings?.trade?.defaultRiskAmount;
        const applyAccountCountMultiplier = false;
        const breakEvenSettings = plugin?.settings?.trade;
        const tradesByDate = new Map<string, Trade[]>();

        closedTrades.forEach((trade) => {
          const analyticsDate = getAnalyticsDate(trade);
          if (!analyticsDate) {
            return;
          }

          const dateStr = formatDateDisplay(analyticsDate, userDateFormat);
          if (!tradesByDate.has(dateStr)) {
            tradesByDate.set(dateStr, []);
          }
          tradesByDate.get(dateStr)?.push(trade);
        });

        const dailyMetrics: Array<{
          date: string;
          rawDate: Date;
          tradeCount: number;
          winRate: number;
          profitFactor: number;
          pnl: number;
          pnlR: number;
          drcPath?: string;
        }> = [];

        tradesByDate.forEach((dayTrades, dateStr) => {
          
          const tradesWithDisplayPnL = dayTrades.map((t) => ({
            ...t,
            displayPnL: getDisplayPnL(
              getEffectivePnL(t),
              getAccountCount(t),
              applyAccountCountMultiplier
            ),
          }));

          
          const winningTrades = tradesWithDisplayPnL.filter((t) => {
            const breakEvenBalanceForDisplay =
              getBreakEvenBalanceForDisplayTrade(
                t,
                applyAccountCountMultiplier
              );
            return (
              classifyPnLWithBreakEvenSettings(
                t.displayPnL,
                breakEvenSettings,
                breakEvenBalanceForDisplay
              ) === 'win'
            );
          });
          const losingTrades = tradesWithDisplayPnL.filter((t) => {
            const breakEvenBalanceForDisplay =
              getBreakEvenBalanceForDisplayTrade(
                t,
                applyAccountCountMultiplier
              );
            return (
              classifyPnLWithBreakEvenSettings(
                t.displayPnL,
                breakEvenSettings,
                breakEvenBalanceForDisplay
              ) === 'loss'
            );
          });

          const totalWinAmount = winningTrades.reduce(
            (sum, t) => sum + t.displayPnL,
            0
          );
          const totalLossAmount = losingTrades.reduce(
            (sum, t) => sum + Math.abs(t.displayPnL),
            0
          );

          const decidedTrades = winningTrades.length + losingTrades.length;
          const winRate =
            decidedTrades > 0 ? winningTrades.length / decidedTrades : 0;
          const profitFactor =
            totalLossAmount > 0
              ? totalWinAmount / totalLossAmount
              : totalWinAmount > 0
                ? Infinity
                : 0;
          const totalPnL = tradesWithDisplayPnL.reduce(
            (sum, t) => sum + t.displayPnL,
            0
          );

          const totalPnLR = dayTrades.reduce((sum, t) => {
            const effectiveRMultiple = calculateEffectiveRMultiple(
              getEffectivePnL(t),
              t.rMultiple,
              t.riskAmount,
              defaultRiskAmount
            );
            if (
              effectiveRMultiple !== undefined &&
              !isNaN(effectiveRMultiple)
            ) {
              return sum + effectiveRMultiple;
            }
            return sum;
          }, 0);

          const rawDate = getAnalyticsDate(dayTrades[0]) ?? new Date();

          let drcPath = undefined;
          try {
            if (plugin?.drcService) {
              drcPath = plugin.drcService.getDRCNotePath(rawDate);
            }
          } catch (error) {
            console.error(`Error getting DRC path for date ${dateStr}:`, error);
          }

          dailyMetrics.push({
            date: dateStr,
            rawDate,
            tradeCount: dayTrades.length,
            winRate,
            profitFactor,
            pnl: totalPnL,
            pnlR: totalPnLR,
            drcPath,
          });
        });

        dailyMetrics.sort((a, b) => safeDateSort(b.rawDate, a.rawDate));
        return dailyMetrics;
      }, [groupBy, closedTrades, userDateFormat, plugin, getAnalyticsDate]);

      
      const weeklyBreakdown = useMemo(() => {
        if (groupBy !== 'week' || closedTrades.length === 0) return [];

        const defaultRiskAmount = plugin?.settings?.trade?.defaultRiskAmount;
        const applyAccountCountMultiplier = false;
        const breakEvenSettings = plugin?.settings?.trade;
        const tradesByWeek = new Map<number, Trade[]>();
        const weekStartDay = getWeekStartDaySetting(plugin);

        closedTrades.forEach((trade) => {
          const analyticsTradingDay = getAnalyticsTradingDay(trade);
          if (!analyticsTradingDay) {
            return;
          }

          const weekNumber = getWeekNumberForDate(
            analyticsTradingDay,
            weekStartDay
          );
          if (!tradesByWeek.has(weekNumber)) {
            tradesByWeek.set(weekNumber, []);
          }
          tradesByWeek.get(weekNumber)?.push(trade);
        });

        const weeklyMetrics: Array<{
          week: string;
          weekNumber: number;
          firstDate: Date;
          tradeCount: number;
          winRate: number;
          profitFactor: number;
          pnl: number;
          pnlR: number;
          weeklyPath?: string;
        }> = [];

        tradesByWeek.forEach((weekTrades, weekNumber) => {
          
          const tradesWithDisplayPnL = weekTrades.map((t) => ({
            ...t,
            displayPnL: getDisplayPnL(
              getEffectivePnL(t),
              getAccountCount(t),
              applyAccountCountMultiplier
            ),
          }));

          
          const winningTrades = tradesWithDisplayPnL.filter((t) => {
            const breakEvenBalanceForDisplay =
              getBreakEvenBalanceForDisplayTrade(
                t,
                applyAccountCountMultiplier
              );
            return (
              classifyPnLWithBreakEvenSettings(
                t.displayPnL,
                breakEvenSettings,
                breakEvenBalanceForDisplay
              ) === 'win'
            );
          });
          const losingTrades = tradesWithDisplayPnL.filter((t) => {
            const breakEvenBalanceForDisplay =
              getBreakEvenBalanceForDisplayTrade(
                t,
                applyAccountCountMultiplier
              );
            return (
              classifyPnLWithBreakEvenSettings(
                t.displayPnL,
                breakEvenSettings,
                breakEvenBalanceForDisplay
              ) === 'loss'
            );
          });

          const totalWinAmount = winningTrades.reduce(
            (sum, t) => sum + t.displayPnL,
            0
          );
          const totalLossAmount = losingTrades.reduce(
            (sum, t) => sum + Math.abs(t.displayPnL),
            0
          );

          const decidedTrades = winningTrades.length + losingTrades.length;
          const winRate =
            decidedTrades > 0 ? winningTrades.length / decidedTrades : 0;
          const profitFactor =
            totalLossAmount > 0
              ? totalWinAmount / totalLossAmount
              : totalWinAmount > 0
                ? Infinity
                : 0;
          const totalPnL = tradesWithDisplayPnL.reduce(
            (sum, t) => sum + t.displayPnL,
            0
          );

          const totalPnLR = weekTrades.reduce((sum, t) => {
            const effectiveRMultiple = calculateEffectiveRMultiple(
              getEffectivePnL(t),
              t.rMultiple,
              t.riskAmount,
              defaultRiskAmount
            );
            if (
              effectiveRMultiple !== undefined &&
              !isNaN(effectiveRMultiple)
            ) {
              return sum + effectiveRMultiple;
            }
            return sum;
          }, 0);

          
          const sortedTrades = [...weekTrades].sort((a, b) => {
            const dateA = getAnalyticsDate(a)?.getTime() ?? 0;
            const dateB = getAnalyticsDate(b)?.getTime() ?? 0;
            return dateA - dateB;
          });
          const firstDate = getAnalyticsDate(sortedTrades[0]) ?? new Date();

          let weeklyPath = undefined;
          try {
            if (plugin?.weeklyReviewService) {
              weeklyPath =
                plugin.weeklyReviewService.getWeeklyReviewPath(firstDate);
            }
          } catch (error) {
            console.error(
              `Error getting weekly review path for week ${weekNumber}:`,
              error
            );
          }

          weeklyMetrics.push({
            week: `W${weekNumber.toString().padStart(2, '0')}`,
            weekNumber,
            firstDate,
            tradeCount: weekTrades.length,
            winRate,
            profitFactor,
            pnl: totalPnL,
            pnlR: totalPnLR,
            weeklyPath,
          });
        });

        weeklyMetrics.sort((a, b) => safeDateSort(b.firstDate, a.firstDate));
        return weeklyMetrics;
      }, [
        groupBy,
        closedTrades,
        plugin,
        getAnalyticsDate,
        getAnalyticsTradingDay,
      ]);

      
      const monthlyBreakdown = useMemo(() => {
        if (groupBy !== 'month' || closedTrades.length === 0) return [];

        const defaultRiskAmount = plugin?.settings?.trade?.defaultRiskAmount;
        const applyAccountCountMultiplier = false;
        const breakEvenSettings = plugin?.settings?.trade;
        const tradesByMonth = new Map<string, Trade[]>();

        closedTrades.forEach((trade) => {
          const tradingDay = getAnalyticsTradingDay(trade);
          if (!tradingDay) {
            return;
          }
          const year = tradingDay.getFullYear();
          const month = tradingDay.getMonth(); 
          const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;

          if (!tradesByMonth.has(monthKey)) {
            tradesByMonth.set(monthKey, []);
          }
          tradesByMonth.get(monthKey)?.push(trade);
        });

        const monthlyMetrics: Array<{
          month: string;
          monthNumber: number;
          year: number;
          monthStart: Date;
          tradeCount: number;
          winRate: number;
          profitFactor: number;
          pnl: number;
          pnlR: number;
          monthlyPath?: string;
        }> = [];

        tradesByMonth.forEach((monthTrades, monthKey) => {
          const tradesWithDisplayPnL = monthTrades.map((t) => ({
            ...t,
            displayPnL: getDisplayPnL(
              getEffectivePnL(t),
              getAccountCount(t),
              applyAccountCountMultiplier
            ),
          }));

          const winningTrades = tradesWithDisplayPnL.filter((t) => {
            const breakEvenBalanceForDisplay =
              getBreakEvenBalanceForDisplayTrade(
                t,
                applyAccountCountMultiplier
              );
            return (
              classifyPnLWithBreakEvenSettings(
                t.displayPnL,
                breakEvenSettings,
                breakEvenBalanceForDisplay
              ) === 'win'
            );
          });
          const losingTrades = tradesWithDisplayPnL.filter((t) => {
            const breakEvenBalanceForDisplay =
              getBreakEvenBalanceForDisplayTrade(
                t,
                applyAccountCountMultiplier
              );
            return (
              classifyPnLWithBreakEvenSettings(
                t.displayPnL,
                breakEvenSettings,
                breakEvenBalanceForDisplay
              ) === 'loss'
            );
          });

          const totalWinAmount = winningTrades.reduce(
            (sum, t) => sum + t.displayPnL,
            0
          );
          const totalLossAmount = losingTrades.reduce(
            (sum, t) => sum + Math.abs(t.displayPnL),
            0
          );

          const decidedTrades = winningTrades.length + losingTrades.length;
          const winRate =
            decidedTrades > 0 ? winningTrades.length / decidedTrades : 0;
          const profitFactor =
            totalLossAmount > 0
              ? totalWinAmount / totalLossAmount
              : totalWinAmount > 0
                ? Infinity
                : 0;
          const totalPnL = tradesWithDisplayPnL.reduce(
            (sum, t) => sum + t.displayPnL,
            0
          );

          const totalPnLR = monthTrades.reduce((sum, t) => {
            const effectiveRMultiple = calculateEffectiveRMultiple(
              getEffectivePnL(t),
              t.rMultiple,
              t.riskAmount,
              defaultRiskAmount
            );
            if (
              effectiveRMultiple !== undefined &&
              !isNaN(effectiveRMultiple)
            ) {
              return sum + effectiveRMultiple;
            }
            return sum;
          }, 0);

          
          const [yearStr, monthStr] = monthKey.split('-');
          const year = parseInt(yearStr, 10);
          const monthNumber = parseInt(monthStr, 10) - 1; 
          const monthStart = new Date(year, monthNumber, 1);

          let monthlyPath = undefined;
          try {
            if (plugin?.monthlyReviewService) {
              monthlyPath =
                plugin.monthlyReviewService.getMonthlyReviewPath(monthStart);
            }
          } catch (error) {
            console.error(
              `Error getting monthly review path for ${monthKey}:`,
              error
            );
          }

          monthlyMetrics.push({
            month: getMonthName(monthNumber),
            monthNumber,
            year,
            monthStart,
            tradeCount: monthTrades.length,
            winRate,
            profitFactor,
            pnl: totalPnL,
            pnlR: totalPnLR,
            monthlyPath,
          });
        });

        monthlyMetrics.sort((a, b) => safeDateSort(b.monthStart, a.monthStart));
        return monthlyMetrics;
      }, [groupBy, closedTrades, plugin, getAnalyticsTradingDay]);

      
      const quarterlyBreakdown = useMemo(() => {
        if (groupBy !== 'quarter' || closedTrades.length === 0) return [];

        const defaultRiskAmount = plugin?.settings?.trade?.defaultRiskAmount;
        const applyAccountCountMultiplier = false;
        const breakEvenSettings = plugin?.settings?.trade;
        const tradesByQuarter = new Map<string, Trade[]>();

        closedTrades.forEach((trade) => {
          const tradingDay = getAnalyticsTradingDay(trade);
          if (!tradingDay) {
            return;
          }
          const year = tradingDay.getFullYear();
          const month = tradingDay.getMonth() + 1; 
          const quarter = getQuarterForMonth(month);
          const quarterKey = `${year}-Q${quarter}`;

          if (!tradesByQuarter.has(quarterKey)) {
            tradesByQuarter.set(quarterKey, []);
          }
          tradesByQuarter.get(quarterKey)?.push(trade);
        });

        const quarterlyMetrics: Array<{
          quarter: string;
          quarterNumber: number;
          year: number;
          quarterStart: Date;
          tradeCount: number;
          winRate: number;
          profitFactor: number;
          pnl: number;
          pnlR: number;
          quarterlyPath?: string;
        }> = [];

        tradesByQuarter.forEach((quarterTrades, quarterKey) => {
          const tradesWithDisplayPnL = quarterTrades.map((t) => ({
            ...t,
            displayPnL: getDisplayPnL(
              getEffectivePnL(t),
              getAccountCount(t),
              applyAccountCountMultiplier
            ),
          }));

          const winningTrades = tradesWithDisplayPnL.filter((t) => {
            const breakEvenBalanceForDisplay =
              getBreakEvenBalanceForDisplayTrade(
                t,
                applyAccountCountMultiplier
              );
            return (
              classifyPnLWithBreakEvenSettings(
                t.displayPnL,
                breakEvenSettings,
                breakEvenBalanceForDisplay
              ) === 'win'
            );
          });
          const losingTrades = tradesWithDisplayPnL.filter((t) => {
            const breakEvenBalanceForDisplay =
              getBreakEvenBalanceForDisplayTrade(
                t,
                applyAccountCountMultiplier
              );
            return (
              classifyPnLWithBreakEvenSettings(
                t.displayPnL,
                breakEvenSettings,
                breakEvenBalanceForDisplay
              ) === 'loss'
            );
          });

          const totalWinAmount = winningTrades.reduce(
            (sum, t) => sum + t.displayPnL,
            0
          );
          const totalLossAmount = losingTrades.reduce(
            (sum, t) => sum + Math.abs(t.displayPnL),
            0
          );

          const decidedTrades = winningTrades.length + losingTrades.length;
          const winRate =
            decidedTrades > 0 ? winningTrades.length / decidedTrades : 0;
          const profitFactor =
            totalLossAmount > 0
              ? totalWinAmount / totalLossAmount
              : totalWinAmount > 0
                ? Infinity
                : 0;
          const totalPnL = tradesWithDisplayPnL.reduce(
            (sum, t) => sum + t.displayPnL,
            0
          );

          const totalPnLR = quarterTrades.reduce((sum, t) => {
            const effectiveRMultiple = calculateEffectiveRMultiple(
              getEffectivePnL(t),
              t.rMultiple,
              t.riskAmount,
              defaultRiskAmount
            );
            if (
              effectiveRMultiple !== undefined &&
              !isNaN(effectiveRMultiple)
            ) {
              return sum + effectiveRMultiple;
            }
            return sum;
          }, 0);

          
          const [yearStr, quarterStr] = quarterKey.split('-');
          const year = parseInt(yearStr, 10);
          const quarterNumber = parseInt(quarterStr.replace('Q', ''), 10);
          
          const quarterStartMonth = (quarterNumber - 1) * 3;
          const quarterStart = new Date(year, quarterStartMonth, 1);

          let quarterlyPath = undefined;
          try {
            const folderPathService =
              plugin?.serviceManager?.getFolderPathService();
            if (folderPathService) {
              quarterlyPath = folderPathService.getQuarterlyReviewPathSync(
                year,
                quarterNumber
              );
            }
          } catch (error) {
            console.error(
              `Error getting quarterly review path for ${quarterKey}:`,
              error
            );
          }

          quarterlyMetrics.push({
            quarter: `Q${quarterNumber}`,
            quarterNumber,
            year,
            quarterStart,
            tradeCount: quarterTrades.length,
            winRate,
            profitFactor,
            pnl: totalPnL,
            pnlR: totalPnLR,
            quarterlyPath,
          });
        });

        quarterlyMetrics.sort((a, b) =>
          safeDateSort(b.quarterStart, a.quarterStart)
        );
        return quarterlyMetrics;
      }, [groupBy, closedTrades, plugin, getAnalyticsTradingDay]);

      
      if (!validationResult.valid) {
        return (
          <InvalidContextMessage
            widgetType={validationResult.widgetName || t('common.breakdown')}
            reason={validationResult.reason}
          />
        );
      }

      
      const handleDayRowClick = async (
        drcPath: string | undefined,
        rawDate: Date | undefined
      ) => {
        
        if (preview) return;
        if (!drcPath || !rawDate) return;

        try {
          
          const file = plugin.app.vault.getAbstractFileByPath(drcPath);
          if (file) {
            
            
            await openReviewWidgetFile(plugin, drcPath);
          } else if (plugin.settings.drc.autoCreateDRCOnNavigation) {
            
            await plugin.drcService.createDRC(rawDate);
            await openReviewWidgetFile(plugin, drcPath);
          }
        } catch (error) {
          console.error('[BreakdownTableWidget] Error opening DRC:', error);
        }
      };

      
      const handleWeekRowClick = async (
        weeklyPath: string | undefined,
        firstDate: Date | undefined
      ) => {
        
        if (preview) return;
        if (!weeklyPath || !firstDate) return;

        try {
          
          const file = plugin.app.vault.getAbstractFileByPath(weeklyPath);
          if (file) {
            
            
            await openReviewWidgetFile(plugin, weeklyPath);
          } else if (
            plugin.settings.weekly.autoCreateWeeklyReviewOnNavigation
          ) {
            
            await plugin.weeklyReviewService.createWeeklyReview(firstDate);
            await openReviewWidgetFile(plugin, weeklyPath);
          }
        } catch (error) {
          console.error(
            '[BreakdownTableWidget] Error opening weekly review:',
            error
          );
        }
      };

      
      const handleMonthRowClick = async (
        monthlyPath: string | undefined,
        monthStart: Date | undefined
      ) => {
        if (preview) return;
        if (!monthlyPath || !monthStart) return;

        try {
          const file = plugin.app.vault.getAbstractFileByPath(monthlyPath);
          if (file) {
            await openReviewWidgetFile(plugin, monthlyPath);
          } else if (
            plugin.settings.monthly?.autoCreateMonthlyReviewOnNavigation
          ) {
            await plugin.monthlyReviewService.createMonthlyReview(monthStart);
            await openReviewWidgetFile(plugin, monthlyPath);
          }
        } catch (error) {
          console.error(
            '[BreakdownTableWidget] Error opening monthly review:',
            error
          );
        }
      };

      
      const handleQuarterRowClick = async (
        quarterlyPath: string | undefined,
        quarterStart: Date | undefined
      ) => {
        if (preview) return;
        if (!quarterlyPath || !quarterStart) return;

        try {
          const file = plugin.app.vault.getAbstractFileByPath(quarterlyPath);
          if (file) {
            await openReviewWidgetFile(plugin, quarterlyPath);
          } else if (
            plugin.settings.quarterly?.autoCreateQuarterlyReviewOnNavigation
          ) {
            await plugin.quarterlyReviewService.createQuarterlyReview(
              quarterStart
            );
            await openReviewWidgetFile(plugin, quarterlyPath);
          }
        } catch (error) {
          console.error(
            '[BreakdownTableWidget] Error opening quarterly review:',
            error
          );
        }
      };

      const { columns } = mergedConfig;
      const shape = BREAKDOWN_GROUP_SHAPES[groupBy];

      if (loading) {
        return (
          <BreakdownSkeleton
            columns={columns}
            dateHeader={t(shape.headerKey)}
            rowCount={shape.skeletonRows}
            dateSkeletonWidth={shape.skeletonDateWidth}
          />
        );
      }

      const currency = resolveReviewCurrency(trades, plugin);
      const format: BreakdownFormat = {
        pnl: (value, rMultiple) =>
          formatValue({
            kind: 'pnl',
            value,
            currencyCode: currency,
            rMultiple,
          }),
        winRate: (value) =>
          formatValue({
            kind: 'returnPercent',
            value: value * 100,
            signed: false,
            precision: 1,
          }),
        profitFactor: (value) =>
          value === Infinity && !isMetricMasked
            ? '∞'
            : formatValue({ kind: 'metric', value, precision: 2 }),
        pnlTone: (value) =>
          isPnlMasked
            ? ''
            : value >= 0
              ? 'journalit-reviewv2-table-cell--positive'
              : 'journalit-reviewv2-table-cell--negative',
        metricTone: (value) =>
          isMetricMasked
            ? ''
            : value >= 1
              ? 'journalit-reviewv2-table-cell--positive'
              : 'journalit-reviewv2-table-cell--negative',
      };

      const rowsByGroup: Record<typeof groupBy, () => BreakdownRow[]> = {
        day: () =>
          dailyBreakdown.map((day) => ({
            ...day,
            key: day.rawDate.toISOString(),
            label: day.date,
            onOpen: () => void handleDayRowClick(day.drcPath, day.rawDate),
          })),
        week: () =>
          weeklyBreakdown.map((week) => ({
            ...week,
            key: week.weeklyPath ?? week.firstDate.toISOString(),
            label: week.week,
            onOpen: () =>
              void handleWeekRowClick(week.weeklyPath, week.firstDate),
          })),
        month: () =>
          monthlyBreakdown.map((month) => ({
            ...month,
            key: month.monthlyPath ?? month.monthStart.toISOString(),
            label: month.month,
            onOpen: () =>
              void handleMonthRowClick(month.monthlyPath, month.monthStart),
          })),
        quarter: () =>
          quarterlyBreakdown.map((quarter) => ({
            ...quarter,
            key: quarter.quarterlyPath ?? quarter.quarterStart.toISOString(),
            label: quarter.quarter,
            onOpen: () =>
              void handleQuarterRowClick(
                quarter.quarterlyPath,
                quarter.quarterStart
              ),
          })),
      };
      const rows = rowsByGroup[groupBy]();

      if (rows.length === 0) {
        return (
          <div className="journalit-reviewv2-empty journalit-reviewv2-empty--large">
            {t(shape.emptyKey)}
          </div>
        );
      }

      return (
        <table className="weekly-review-trades-table journalit-reviewv2-table journalit-reviewv2-table--compact">
          <BreakdownHeaderRow
            columns={columns}
            dateHeader={t(shape.headerKey)}
          />
          <tbody>
            {rows.map((row) => (
              <BreakdownTableRow
                key={row.key}
                row={row}
                columns={columns}
                format={format}
              />
            ))}
          </tbody>
        </table>
      );
    }
  );

BreakdownTableWidget.displayName = 'BreakdownTableWidget';

export {};
