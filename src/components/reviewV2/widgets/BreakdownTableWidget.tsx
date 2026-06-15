

import React, { useState, useMemo, useCallback } from 'react';
import { hasTranslation, t } from '../../../lang/helpers';
import {
  getEffectivePnL,
  isPnlContributingTrade,
} from '../../../utils/tradeStatusUtils';
import { calculateEffectiveRMultiple } from '../../../utils/formatting';
import { useDisplayFormatter } from '../../../hooks/useDisplayPolicy';
import { CurrencyCode } from '../../../utils/currencyConfig';
import { getSingleExplicitCurrency } from '../../../utils/currencyAggregation';
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
import { useEventBus } from '../../../hooks';
import { SkeletonBox } from '../../shared';
import { InvalidContextMessage } from './InvalidContextMessage';
import { classifyPnLWithBreakEvenSettings } from '../../../utils/breakEvenRange';
import { getBreakEvenBalanceForDisplayTrade } from './shared/breakEvenDisplayUtils';
import {
  getReviewTradeDate,
  getReviewTradeTradingDay,
  splitReviewTradeByRealizedPnlEvent,
} from '../utils/reviewTradeDates';

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
        if (config.groupBy) return config.groupBy;
        
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
          trades
            .filter((t) => isPnlContributingTrade(t))
            .flatMap((trade) =>
              splitReviewTradeByRealizedPnlEvent(trade, plugin)
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
            
            
            await plugin.openFile(drcPath, false);
          } else if (plugin.settings.drc.autoCreateDRCOnNavigation) {
            
            await plugin.drcService.createDRC(rawDate);
            await plugin.openFile(drcPath, false);
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
            
            
            await plugin.openFile(weeklyPath, false);
          } else if (
            plugin.settings.weekly.autoCreateWeeklyReviewOnNavigation
          ) {
            
            await plugin.weeklyReviewService.createWeeklyReview(firstDate);
            await plugin.openFile(weeklyPath, false);
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
            await plugin.openFile(monthlyPath, false);
          } else if (
            plugin.settings.monthly?.autoCreateMonthlyReviewOnNavigation
          ) {
            await plugin.monthlyReviewService.createMonthlyReview(monthStart);
            await plugin.openFile(monthlyPath, false);
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
            await plugin.openFile(quarterlyPath, false);
          } else if (
            plugin.settings.quarterly?.autoCreateQuarterlyReviewOnNavigation
          ) {
            await plugin.quarterlyReviewService.createQuarterlyReview(
              quarterStart
            );
            await plugin.openFile(quarterlyPath, false);
          }
        } catch (error) {
          console.error(
            '[BreakdownTableWidget] Error opening quarterly review:',
            error
          );
        }
      };

      if (loading) {
        const { columns } = mergedConfig;
        
        const rowCount =
          groupBy === 'week'
            ? 4
            : groupBy === 'month'
              ? 3
              : groupBy === 'quarter'
                ? 4
                : 5;
        
        const dateHeader =
          groupBy === 'week'
            ? t('widget.table.header.week')
            : groupBy === 'month'
              ? t('widget.table.header.month')
              : groupBy === 'quarter'
                ? t('widget.table.header.quarter')
                : t('widget.table.header.date');
        
        const dateSkeletonWidth =
          groupBy === 'week'
            ? 35
            : groupBy === 'month'
              ? 100
              : groupBy === 'quarter'
                ? 60
                : 70;

        return (
          <table className="weekly-review-trades-table journalit-reviewv2-table journalit-reviewv2-table--compact">
            <thead>
              <tr>
                {columns?.date && (
                  <th className="journalit-reviewv2-table-header-cell journalit-reviewv2-col-date">
                    {dateHeader}
                  </th>
                )}
                {columns?.trades && (
                  <th className="journalit-reviewv2-table-header-cell journalit-reviewv2-col-trades">
                    {t('widget.table.header.trades')}
                  </th>
                )}
                {columns?.pnl && (
                  <th className="journalit-reviewv2-table-header-cell journalit-reviewv2-col-pnl">
                    {t('widget.table.header.pnl')}
                  </th>
                )}
                {columns?.winRate && (
                  <th className="journalit-reviewv2-table-header-cell journalit-reviewv2-col-winrate">
                    {t('widget.table.header.win-rate')}
                  </th>
                )}
                {columns?.profitFactor && (
                  <th className="journalit-reviewv2-table-header-cell journalit-reviewv2-col-profit-factor">
                    {t('widget.table.header.profit-factor')}
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: rowCount }).map((_, i) => (
                <tr
                  key={i}
                  className="journalit-reviewv2-table-row journalit-reviewv2-table-row--static"
                >
                  {columns?.date && (
                    <td className="journalit-reviewv2-table-cell journalit-reviewv2-table-cell--compact journalit-reviewv2-col-date">
                      <SkeletonBox
                        width={dateSkeletonWidth}
                        height={14}
                        borderRadius="4px"
                      />
                    </td>
                  )}
                  {columns?.trades && (
                    <td className="journalit-reviewv2-table-cell journalit-reviewv2-table-cell--compact journalit-reviewv2-col-trades">
                      <SkeletonBox width={25} height={14} borderRadius="4px" />
                    </td>
                  )}
                  {columns?.pnl && (
                    <td className="journalit-reviewv2-table-cell journalit-reviewv2-table-cell--compact journalit-reviewv2-col-pnl">
                      <SkeletonBox width={65} height={14} borderRadius="4px" />
                    </td>
                  )}
                  {columns?.winRate && (
                    <td className="journalit-reviewv2-table-cell journalit-reviewv2-table-cell--compact journalit-reviewv2-col-winrate">
                      <SkeletonBox width={40} height={14} borderRadius="4px" />
                    </td>
                  )}
                  {columns?.profitFactor && (
                    <td className="journalit-reviewv2-table-cell journalit-reviewv2-table-cell--compact journalit-reviewv2-col-profit-factor">
                      <SkeletonBox width={35} height={14} borderRadius="4px" />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        );
      }

      const currency =
        getSingleExplicitCurrency(trades) ||
        plugin?.settings?.general?.currency ||
        CurrencyCode.USD;
      const { columns } = mergedConfig;
      const formatBreakdownPnL = (value: number, rMultiple?: number) =>
        formatValue({
          kind: 'pnl',
          value,
          currencyCode: currency,
          rMultiple,
        });
      const formatBreakdownWinRate = (value: number) =>
        formatValue({
          kind: 'returnPercent',
          value: value * 100,
          signed: false,
          precision: 1,
        });
      const formatBreakdownProfitFactor = (value: number) =>
        value === Infinity && !isMetricMasked
          ? '∞'
          : formatValue({ kind: 'metric', value, precision: 2 });
      const getPnlToneClass = (value: number) =>
        isPnlMasked
          ? ''
          : value >= 0
            ? 'journalit-reviewv2-table-cell--positive'
            : 'journalit-reviewv2-table-cell--negative';
      const getMetricToneClass = (value: number) =>
        isMetricMasked
          ? ''
          : value >= 1
            ? 'journalit-reviewv2-table-cell--positive'
            : 'journalit-reviewv2-table-cell--negative';

      
      if (groupBy === 'day') {
        if (dailyBreakdown.length === 0) {
          return (
            <div className="journalit-reviewv2-empty journalit-reviewv2-empty--large">
              {t('widget.breakdown.empty.days-week')}
            </div>
          );
        }

        return (
          <table className="weekly-review-trades-table journalit-reviewv2-table journalit-reviewv2-table--compact">
            <thead>
              <tr>
                {columns?.date && (
                  <th className="journalit-reviewv2-table-header-cell journalit-reviewv2-col-date">
                    {t('widget.table.header.date')}
                  </th>
                )}
                {columns?.trades && (
                  <th className="journalit-reviewv2-table-header-cell journalit-reviewv2-col-trades">
                    {t('widget.table.header.trades')}
                  </th>
                )}
                {columns?.pnl && (
                  <th className="journalit-reviewv2-table-header-cell journalit-reviewv2-col-pnl">
                    {t('widget.table.header.pnl')}
                  </th>
                )}
                {columns?.winRate && (
                  <th className="journalit-reviewv2-table-header-cell journalit-reviewv2-col-winrate">
                    {t('widget.table.header.win-rate')}
                  </th>
                )}
                {columns?.profitFactor && (
                  <th className="journalit-reviewv2-table-header-cell journalit-reviewv2-col-profit-factor">
                    {t('widget.table.header.profit-factor')}
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {dailyBreakdown.map((day) => {
                const pnlClassName = [
                  'journalit-reviewv2-table-cell',
                  'journalit-reviewv2-table-cell--compact',
                  'journalit-reviewv2-table-cell--emphasis',
                  'journalit-reviewv2-col-pnl',
                  getPnlToneClass(day.pnl),
                ].join(' ');
                const profitFactorClassName = [
                  'journalit-reviewv2-table-cell',
                  'journalit-reviewv2-table-cell--compact',
                  'journalit-reviewv2-table-cell--emphasis',
                  'journalit-reviewv2-col-profit-factor',
                  getMetricToneClass(day.profitFactor),
                ].join(' ');

                return (
                  <tr
                    key={day.rawDate.toISOString()}
                    className="weekly-review-trade-row journalit-reviewv2-table-row journalit-reviewv2-table-row--interactive"
                    onClick={() =>
                      void handleDayRowClick(day.drcPath, day.rawDate)
                    }
                  >
                    {columns?.date && (
                      <td className="journalit-reviewv2-table-cell journalit-reviewv2-table-cell--compact journalit-reviewv2-col-date">
                        {day.date}
                      </td>
                    )}
                    {columns?.trades && (
                      <td className="journalit-reviewv2-table-cell journalit-reviewv2-table-cell--compact journalit-reviewv2-col-trades">
                        {day.tradeCount}
                      </td>
                    )}
                    {columns?.pnl && (
                      <td className={pnlClassName}>
                        {formatBreakdownPnL(day.pnl, day.pnlR)}
                      </td>
                    )}
                    {columns?.winRate && (
                      <td className="journalit-reviewv2-table-cell journalit-reviewv2-table-cell--compact journalit-reviewv2-col-winrate">
                        {formatBreakdownWinRate(day.winRate)}
                      </td>
                    )}
                    {columns?.profitFactor && (
                      <td className={profitFactorClassName}>
                        {formatBreakdownProfitFactor(day.profitFactor)}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        );
      }

      
      if (groupBy === 'week') {
        if (weeklyBreakdown.length === 0) {
          return (
            <div className="journalit-reviewv2-empty journalit-reviewv2-empty--large">
              {t('widget.breakdown.empty.weeks-month')}
            </div>
          );
        }

        return (
          <table className="weekly-review-trades-table journalit-reviewv2-table journalit-reviewv2-table--compact">
            <thead>
              <tr>
                {columns?.date && (
                  <th className="journalit-reviewv2-table-header-cell journalit-reviewv2-col-date">
                    {t('widget.table.header.week')}
                  </th>
                )}
                {columns?.trades && (
                  <th className="journalit-reviewv2-table-header-cell journalit-reviewv2-col-trades">
                    {t('widget.table.header.trades')}
                  </th>
                )}
                {columns?.pnl && (
                  <th className="journalit-reviewv2-table-header-cell journalit-reviewv2-col-pnl">
                    {t('widget.table.header.pnl')}
                  </th>
                )}
                {columns?.winRate && (
                  <th className="journalit-reviewv2-table-header-cell journalit-reviewv2-col-winrate">
                    {t('widget.table.header.win-rate')}
                  </th>
                )}
                {columns?.profitFactor && (
                  <th className="journalit-reviewv2-table-header-cell journalit-reviewv2-col-profit-factor">
                    {t('widget.table.header.profit-factor')}
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {weeklyBreakdown.map((week) => {
                const pnlClassName = [
                  'journalit-reviewv2-table-cell',
                  'journalit-reviewv2-table-cell--compact',
                  'journalit-reviewv2-table-cell--emphasis',
                  'journalit-reviewv2-col-pnl',
                  getPnlToneClass(week.pnl),
                ].join(' ');
                const profitFactorClassName = [
                  'journalit-reviewv2-table-cell',
                  'journalit-reviewv2-table-cell--compact',
                  'journalit-reviewv2-table-cell--emphasis',
                  'journalit-reviewv2-col-profit-factor',
                  getMetricToneClass(week.profitFactor),
                ].join(' ');

                return (
                  <tr
                    key={week.weeklyPath ?? week.firstDate.toISOString()}
                    className="weekly-review-trade-row journalit-reviewv2-table-row journalit-reviewv2-table-row--interactive"
                    onClick={() =>
                      void handleWeekRowClick(week.weeklyPath, week.firstDate)
                    }
                  >
                    {columns?.date && (
                      <td className="journalit-reviewv2-table-cell journalit-reviewv2-table-cell--compact journalit-reviewv2-col-date">
                        {week.week}
                      </td>
                    )}
                    {columns?.trades && (
                      <td className="journalit-reviewv2-table-cell journalit-reviewv2-table-cell--compact journalit-reviewv2-col-trades">
                        {week.tradeCount}
                      </td>
                    )}
                    {columns?.pnl && (
                      <td className={pnlClassName}>
                        {formatBreakdownPnL(week.pnl, week.pnlR)}
                      </td>
                    )}
                    {columns?.winRate && (
                      <td className="journalit-reviewv2-table-cell journalit-reviewv2-table-cell--compact journalit-reviewv2-col-winrate">
                        {formatBreakdownWinRate(week.winRate)}
                      </td>
                    )}
                    {columns?.profitFactor && (
                      <td className={profitFactorClassName}>
                        {formatBreakdownProfitFactor(week.profitFactor)}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        );
      }

      
      if (groupBy === 'month') {
        if (monthlyBreakdown.length === 0) {
          return (
            <div className="journalit-reviewv2-empty journalit-reviewv2-empty--large">
              {t('widget.breakdown.empty.months-quarter')}
            </div>
          );
        }

        return (
          <table className="weekly-review-trades-table journalit-reviewv2-table journalit-reviewv2-table--compact">
            <thead>
              <tr>
                {columns?.date && (
                  <th className="journalit-reviewv2-table-header-cell journalit-reviewv2-col-date">
                    {t('widget.table.header.month')}
                  </th>
                )}
                {columns?.trades && (
                  <th className="journalit-reviewv2-table-header-cell journalit-reviewv2-col-trades">
                    {t('widget.table.header.trades')}
                  </th>
                )}
                {columns?.pnl && (
                  <th className="journalit-reviewv2-table-header-cell journalit-reviewv2-col-pnl">
                    {t('widget.table.header.pnl')}
                  </th>
                )}
                {columns?.winRate && (
                  <th className="journalit-reviewv2-table-header-cell journalit-reviewv2-col-winrate">
                    {t('widget.table.header.win-rate')}
                  </th>
                )}
                {columns?.profitFactor && (
                  <th className="journalit-reviewv2-table-header-cell journalit-reviewv2-col-profit-factor">
                    {t('widget.table.header.profit-factor')}
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {monthlyBreakdown.map((month) => {
                const pnlClassName = [
                  'journalit-reviewv2-table-cell',
                  'journalit-reviewv2-table-cell--compact',
                  'journalit-reviewv2-table-cell--emphasis',
                  'journalit-reviewv2-col-pnl',
                  getPnlToneClass(month.pnl),
                ].join(' ');
                const profitFactorClassName = [
                  'journalit-reviewv2-table-cell',
                  'journalit-reviewv2-table-cell--compact',
                  'journalit-reviewv2-table-cell--emphasis',
                  'journalit-reviewv2-col-profit-factor',
                  getMetricToneClass(month.profitFactor),
                ].join(' ');

                return (
                  <tr
                    key={month.monthlyPath ?? month.monthStart.toISOString()}
                    className="weekly-review-trade-row journalit-reviewv2-table-row journalit-reviewv2-table-row--interactive"
                    onClick={() =>
                      void handleMonthRowClick(
                        month.monthlyPath,
                        month.monthStart
                      )
                    }
                  >
                    {columns?.date && (
                      <td className="journalit-reviewv2-table-cell journalit-reviewv2-table-cell--compact journalit-reviewv2-col-date">
                        {month.month}
                      </td>
                    )}
                    {columns?.trades && (
                      <td className="journalit-reviewv2-table-cell journalit-reviewv2-table-cell--compact journalit-reviewv2-col-trades">
                        {month.tradeCount}
                      </td>
                    )}
                    {columns?.pnl && (
                      <td className={pnlClassName}>
                        {formatBreakdownPnL(month.pnl, month.pnlR)}
                      </td>
                    )}
                    {columns?.winRate && (
                      <td className="journalit-reviewv2-table-cell journalit-reviewv2-table-cell--compact journalit-reviewv2-col-winrate">
                        {formatBreakdownWinRate(month.winRate)}
                      </td>
                    )}
                    {columns?.profitFactor && (
                      <td className={profitFactorClassName}>
                        {formatBreakdownProfitFactor(month.profitFactor)}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        );
      }

      
      if (groupBy === 'quarter') {
        if (quarterlyBreakdown.length === 0) {
          return (
            <div className="journalit-reviewv2-empty journalit-reviewv2-empty--large">
              {t('widget.breakdown.empty.quarters-year')}
            </div>
          );
        }

        return (
          <table className="weekly-review-trades-table journalit-reviewv2-table journalit-reviewv2-table--compact">
            <thead>
              <tr>
                {columns?.date && (
                  <th className="journalit-reviewv2-table-header-cell journalit-reviewv2-col-date">
                    {t('widget.table.header.quarter')}
                  </th>
                )}
                {columns?.trades && (
                  <th className="journalit-reviewv2-table-header-cell journalit-reviewv2-col-trades">
                    {t('widget.table.header.trades')}
                  </th>
                )}
                {columns?.pnl && (
                  <th className="journalit-reviewv2-table-header-cell journalit-reviewv2-col-pnl">
                    {t('widget.table.header.pnl')}
                  </th>
                )}
                {columns?.winRate && (
                  <th className="journalit-reviewv2-table-header-cell journalit-reviewv2-col-winrate">
                    {t('widget.table.header.win-rate')}
                  </th>
                )}
                {columns?.profitFactor && (
                  <th className="journalit-reviewv2-table-header-cell journalit-reviewv2-col-profit-factor">
                    {t('widget.table.header.profit-factor')}
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {quarterlyBreakdown.map((quarter) => {
                const pnlClassName = [
                  'journalit-reviewv2-table-cell',
                  'journalit-reviewv2-table-cell--compact',
                  'journalit-reviewv2-table-cell--emphasis',
                  'journalit-reviewv2-col-pnl',
                  getPnlToneClass(quarter.pnl),
                ].join(' ');
                const profitFactorClassName = [
                  'journalit-reviewv2-table-cell',
                  'journalit-reviewv2-table-cell--compact',
                  'journalit-reviewv2-table-cell--emphasis',
                  'journalit-reviewv2-col-profit-factor',
                  getMetricToneClass(quarter.profitFactor),
                ].join(' ');

                return (
                  <tr
                    key={
                      quarter.quarterlyPath ??
                      quarter.quarterStart.toISOString()
                    }
                    className="weekly-review-trade-row journalit-reviewv2-table-row journalit-reviewv2-table-row--interactive"
                    onClick={() =>
                      void handleQuarterRowClick(
                        quarter.quarterlyPath,
                        quarter.quarterStart
                      )
                    }
                  >
                    {columns?.date && (
                      <td className="journalit-reviewv2-table-cell journalit-reviewv2-table-cell--compact journalit-reviewv2-col-date">
                        {quarter.quarter}
                      </td>
                    )}
                    {columns?.trades && (
                      <td className="journalit-reviewv2-table-cell journalit-reviewv2-table-cell--compact journalit-reviewv2-col-trades">
                        {quarter.tradeCount}
                      </td>
                    )}
                    {columns?.pnl && (
                      <td className={pnlClassName}>
                        {formatBreakdownPnL(quarter.pnl, quarter.pnlR)}
                      </td>
                    )}
                    {columns?.winRate && (
                      <td className="journalit-reviewv2-table-cell journalit-reviewv2-table-cell--compact journalit-reviewv2-col-winrate">
                        {formatBreakdownWinRate(quarter.winRate)}
                      </td>
                    )}
                    {columns?.profitFactor && (
                      <td className={profitFactorClassName}>
                        {formatBreakdownProfitFactor(quarter.profitFactor)}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        );
      }

      return null;
    }
  );

BreakdownTableWidget.displayName = 'BreakdownTableWidget';

export {};
