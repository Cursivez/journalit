

import React, { useState, useMemo, useCallback } from 'react';
import JournalitPlugin from '../../../main';
import { t } from '../../../lang/helpers';
import { classifyPnLWithBreakEvenSettings } from '../../../utils/breakEvenRange';
import { calculateEffectiveRMultiple } from '../../../utils/formatting';
import {
  useDisplayFormatter,
  useDisplayPolicy,
} from '../../../hooks/useDisplayPolicy';
import {
  getEffectivePnL,
  isPnlContributingTrade,
} from '../../../utils/tradeStatusUtils';
import { getDisplayPnL, getAccountCount } from '../../../utils/pnlUtils';
import {
  formatDateDisplay,
  getWeekNumberForDate,
  getWeekStartDate,
  getWeekStartDaySetting,
} from '../../../utils/dateUtils';
import {
  getReviewTradeTradingDay,
  splitReviewTradeByRealizedPnlEvent,
} from '../utils/reviewTradeDates';
import {
  BestWorstPeriodGrid,
  BestWorstSkeletonGrid,
} from './shared/BestWorstPeriodGrid';
import {
  readReviewTradeSettings,
  settingsCurrency,
} from './shared/reviewWidgetSettings';
import { InvalidContextMessage } from './InvalidContextMessage';
import { TradesPreviewData } from '../../../types/reviewV2';
import { useReviewTrades } from '../hooks/useReviewData';
import { useEventBus } from '../../../hooks/useEventBus';
import { getBreakEvenBalanceForDisplayTrade } from './shared/breakEvenDisplayUtils';
import { openReviewWidgetFile } from '../reviewWidgetNavigation';

type ReviewBestWorstTrade = Record<string, unknown> & {
  pnl?: number | null;
  directPnL?: number | null;
  useDirectPnLInput?: boolean;
  dividends?: Array<{ amount?: number | null }>;
  commission?: number | null;
  swap?: number | null;
  fees?: number | null;
  rebate?: number | null;
  tradeStatus?: string;
  account?: string | string[];
  currency?: string;
  originalCurrency?: string;
  originalPnlBeforeConversion?: number | null;
  brokerBaseCurrency?: string;
  rMultiple?: number;
  riskAmount?: number;
  breakEvenAccountCurrentBalance?: number;
  breakEvenAccountCurrentBalanceTotal?: number;
};

function asReviewBestWorstTrades(value: unknown): ReviewBestWorstTrade[] {
  return Array.isArray(value)
    ? value.filter((item): item is ReviewBestWorstTrade =>
        Boolean(item && typeof item === 'object' && !Array.isArray(item))
      )
    : [];
}

interface BestWorstWeeksWidgetProps {
  filePath: string;
  plugin: JournalitPlugin;
  config?: BestWorstWeeksWidgetConfig;
  preview?: boolean;
  previewData?: TradesPreviewData;
}

interface BestWorstWeeksWidgetConfig {
  showBest?: boolean; 
  showWorst?: boolean; 
  showTradeCount?: boolean; 
  showWinRate?: boolean; 
}

const DEFAULT_CONFIG: BestWorstWeeksWidgetConfig = {
  showBest: true,
  showWorst: true,
  showTradeCount: true,
  showWinRate: true,
};

interface WeekStats {
  weekNumber: number;
  year: number;
  weekStart: Date;
  weekEnd: Date;
  pnl: number;
  pnlR: number | undefined; 
  tradeCount: number;
  wins: number;
  losses: number;
  breakevens: number;
  winRate: number;
  breakEvenBalances: Set<number>;
  hasUnresolvedBreakEvenBalance: boolean;
  pnlByCurrency: Record<string, number>;
  trades: Array<{
    currency?: string;
    originalCurrency?: string;
    originalPnlBeforeConversion?: number | null;
    pnl?: number | null;
  }>;
}

export const BestWorstWeeksWidget: React.FC<BestWorstWeeksWidgetProps> =
  React.memo(
    ({ filePath, plugin, config = {}, preview = false, previewData }) => {
      const mergedConfig = { ...DEFAULT_CONFIG, ...config };

      
      const {
        trades: cachedTrades,
        loading: cacheLoading,
        noteType,
        currencyConversion,
      } = useReviewTrades(filePath, plugin);

      
      const trades = asReviewBestWorstTrades(
        preview && previewData ? previewData.trades : cachedTrades
      );
      const loading = preview ? false : cacheLoading;

      
      const [, setSettingsVersion] = useState(0);

      useEventBus(
        'settings:changed',
        useCallback(() => {
          setSettingsVersion((v) => v + 1);
        }, []),
        !preview
      );

      
      const currency = settingsCurrency(plugin);
      const { formatValue, shouldMask } = useDisplayFormatter();
      const { displayRMultiples } = useDisplayPolicy();
      const isPnlMasked = shouldMask('pnl');
      const isReturnPercentMasked = shouldMask('returnPercent');
      const applyAccountCountMultiplier = false;
      const {
        defaultRiskAmount,
        dateFormat,
        breakEvenThresholdMode,
        breakEvenThresholdPercent,
        breakEvenRangeMin,
        breakEvenRangeMax,
      } = readReviewTradeSettings(plugin);
      
      const { bestWeek, worstWeek } = useMemo(() => {
        const closedTrades = asReviewBestWorstTrades(
          trades.flatMap((trade) =>
            isPnlContributingTrade(trade)
              ? splitReviewTradeByRealizedPnlEvent(trade, plugin)
              : []
          )
        );

        if (closedTrades.length === 0) {
          return { bestWeek: null, worstWeek: null };
        }

        
        const weekMap = new Map<string, WeekStats>();
        const weekStartDay = getWeekStartDaySetting(plugin);

        closedTrades.forEach((trade) => {
          
          const tradingDay = getReviewTradeTradingDay(trade, plugin);
          if (!tradingDay) {
            return;
          }
          const weekNum = getWeekNumberForDate(tradingDay, weekStartDay);
          const year = tradingDay.getFullYear();
          const weekKey = `${year}-W${weekNum}`;
          const weekStart = getWeekStartDate(tradingDay, weekStartDay);
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekEnd.getDate() + 6);
          weekEnd.setHours(23, 59, 59, 999);

          const existing = weekMap.get(weekKey) || {
            weekNumber: weekNum,
            year,
            weekStart,
            weekEnd,
            pnl: 0,
            pnlR: 0,
            tradeCount: 0,
            wins: 0,
            losses: 0,
            breakevens: 0,
            winRate: 0,
            breakEvenBalances: new Set<number>(),
            hasUnresolvedBreakEvenBalance: false,
            pnlByCurrency: {},
            trades: [],
          };

          
          const accountCount = getAccountCount(trade);
          const tradePnL = getDisplayPnL(
            getEffectivePnL(trade),
            accountCount,
            applyAccountCountMultiplier
          );

          
          const tradeRMultiple = calculateEffectiveRMultiple(
            getEffectivePnL(trade),
            trade.rMultiple,
            trade.riskAmount,
            defaultRiskAmount
          );

          existing.pnl += tradePnL || 0;
          const tradeCurrency = trade.currency || currency;
          existing.pnlByCurrency[tradeCurrency] =
            (existing.pnlByCurrency[tradeCurrency] || 0) + (tradePnL || 0);
          if (tradeRMultiple !== undefined) {
            existing.pnlR = (existing.pnlR || 0) + tradeRMultiple;
          }
          existing.tradeCount += 1;
          existing.trades.push({
            ...trade,
            pnl: tradePnL,
            originalPnlBeforeConversion:
              typeof trade.originalPnlBeforeConversion === 'number'
                ? getDisplayPnL(
                    trade.originalPnlBeforeConversion,
                    accountCount,
                    applyAccountCountMultiplier
                  )
                : trade.originalPnlBeforeConversion,
          });

          const breakEvenBalanceForDisplay = getBreakEvenBalanceForDisplayTrade(
            trade,
            applyAccountCountMultiplier
          );

          if (typeof breakEvenBalanceForDisplay === 'number') {
            existing.breakEvenBalances.add(breakEvenBalanceForDisplay);
          }

          const tradeOutcome = classifyPnLWithBreakEvenSettings(
            tradePnL,
            {
              breakEvenRangeMin,
              breakEvenRangeMax,
              breakEvenThresholdMode,
              breakEvenThresholdPercent,
            },
            breakEvenBalanceForDisplay
          );

          if (tradeOutcome === 'win') {
            existing.wins += 1;
          } else if (tradeOutcome === 'loss') {
            existing.losses += 1;
          } else {
            existing.breakevens += 1;
            if (tradeOutcome === 'unknown') {
              existing.hasUnresolvedBreakEvenBalance = true;
            }
          }

          weekMap.set(weekKey, existing);
        });

        
        weekMap.forEach((week) => {
          const decidedTrades = week.wins + week.losses;
          week.winRate =
            decidedTrades > 0 ? (week.wins / decidedTrades) * 100 : 0;
        });

        const weeks = Array.from(weekMap.values());

        
        const sortedByPnl = [...weeks].sort((a, b) => b.pnl - a.pnl);

        const resolveOutcome = (
          week: WeekStats | null
        ): 'win' | 'loss' | null => {
          if (!week) return null;
          if (week.hasUnresolvedBreakEvenBalance) {
            return null;
          }

          const balances = Array.from(week.breakEvenBalances);
          const balance = balances.length === 1 ? balances[0] : undefined;
          const outcome = classifyPnLWithBreakEvenSettings(
            week.pnl,
            {
              breakEvenRangeMin,
              breakEvenRangeMax,
              breakEvenThresholdMode,
              breakEvenThresholdPercent,
            },
            balance
          );

          if (outcome === 'win' || outcome === 'loss') {
            return outcome;
          }

          return null;
        };

        const bestWeek =
          sortedByPnl.find((week) => resolveOutcome(week) === 'win') || null;
        const worstWeek =
          [...sortedByPnl]
            .reverse()
            .find((week) => resolveOutcome(week) === 'loss') || null;

        return {
          bestWeek,
          worstWeek,
        };
      }, [
        trades,
        currency,
        plugin,
        applyAccountCountMultiplier,
        defaultRiskAmount,
        breakEvenThresholdMode,
        breakEvenThresholdPercent,
        breakEvenRangeMin,
        breakEvenRangeMax,
      ]);

      
      const formatWeekName = (week: WeekStats): string => {
        const startFormatted = formatDateDisplay(
          week.weekStart,
          dateFormat,
          '/'
        ).slice(0, 5); 
        const endFormatted = formatDateDisplay(
          week.weekEnd,
          dateFormat,
          '/'
        ).slice(0, 5);
        return t('widget.best-worst-weeks.week-name', {
          number: String(week.weekNumber),
          start: startFormatted,
          end: endFormatted,
        });
      };

      if (loading) {
        return (
          <BestWorstSkeletonGrid
            config={mergedConfig}
            bestTitle={t('widget.best-worst-weeks.best-week')}
            worstTitle={t('widget.best-worst-weeks.worst-week')}
            primaryWidth={160}
          />
        );
      }

      const openWeeklyReview = async (week: WeekStats) => {
        
        if (preview) return;

        try {
          
          const weeklyPath = plugin.weeklyReviewService?.getWeeklyReviewPath(
            week.weekStart
          );
          if (!weeklyPath) return;

          
          const file = plugin.app.vault.getAbstractFileByPath(weeklyPath);
          if (file) {
            await openReviewWidgetFile(plugin, weeklyPath);
          } else if (
            plugin.settings.weekly.autoCreateWeeklyReviewOnNavigation
          ) {
            
            await plugin.weeklyReviewService.createWeeklyReview(week.weekStart);
            
            const newPath = plugin.weeklyReviewService?.getWeeklyReviewPath(
              week.weekStart
            );
            if (newPath) await openReviewWidgetFile(plugin, newPath);
          }
        } catch (error) {
          console.error(
            '[BestWorstWeeksWidget] Error opening weekly review:',
            error
          );
        }
      };

      const formatWeekPnL = (week: WeekStats): string => {
        const currencies = Object.keys(week.pnlByCurrency).sort();
        
        if (currencies.length <= 1 || displayRMultiples) {
          return formatValue({
            kind: 'pnl',
            value: week.pnl,
            currencyCode: currencies[0] || currency,
            rMultiple: week.pnlR,
          });
        }

        return currencies
          .map((weekCurrency) =>
            formatValue({
              kind: 'pnl',
              value: week.pnlByCurrency[weekCurrency] || 0,
              currencyCode: weekCurrency,
            })
          )
          .join(' | ');
      };

      const buildMetaItems = (week: WeekStats): string[] => {
        const items: string[] = [];
        if (mergedConfig.showTradeCount) {
          items.push(
            t('widget.best-worst-weeks.trade-count', {
              count: String(week.tradeCount),
            })
          );
        }
        if (mergedConfig.showWinRate) {
          items.push(
            isReturnPercentMasked
              ? `${formatValue({
                  kind: 'returnPercent',
                  value: week.winRate,
                  signed: false,
                  precision: 0,
                })} ${t('dashboard.metrics.winRate')}`
              : t('widget.best-worst-weeks.win-rate', {
                  percent: week.winRate.toFixed(0),
                })
          );
        }
        return items;
      };

      
      const allowedNoteTypes = [
        'weekly-review',
        'monthly-review',
        'quarterly-review',
        'yearly-review',
      ];
      if (!preview && noteType && !allowedNoteTypes.includes(noteType)) {
        return (
          <InvalidContextMessage
            widgetType={t('widget.best-worst-weeks.name')}
            reason={t('widget.best-worst-weeks.invalid-context')}
          />
        );
      }

      return (
        <BestWorstPeriodGrid
          config={mergedConfig}
          best={{
            title: t('widget.best-worst-weeks.best-week'),
            emptyMessage: t('widget.best-worst-weeks.no-profitable'),
            period: bestWeek,
          }}
          worst={{
            title: t('widget.best-worst-weeks.worst-week'),
            emptyMessage: t('widget.best-worst-weeks.no-losing'),
            period: worstWeek,
          }}
          isPnlMasked={isPnlMasked}
          currencyConversion={currencyConversion}
          formatPnl={formatWeekPnL}
          formatName={formatWeekName}
          buildMetaItems={buildMetaItems}
          onOpen={(week) => void openWeeklyReview(week)}
        />
      );
    }
  );

BestWorstWeeksWidget.displayName = 'BestWorstWeeksWidget';

export {};
