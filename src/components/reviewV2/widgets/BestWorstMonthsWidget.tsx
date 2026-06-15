

import React, { useState, useMemo, useCallback } from 'react';
import JournalitPlugin from '../../../main';
import { calculateEffectiveRMultiple } from '../../../utils/formatting';
import { useDisplayFormatter } from '../../../hooks/useDisplayPolicy';
import { CurrencyCode } from '../../../utils/currencyConfig';
import { getSingleExplicitCurrency } from '../../../utils/currencyAggregation';
import {
  getEffectivePnL,
  isPnlContributingTrade,
} from '../../../utils/tradeStatusUtils';
import { getDisplayPnL, getAccountCount } from '../../../utils/pnlUtils';
import {
  getReviewTradeTradingDay,
  splitReviewTradeByRealizedPnlEvent,
} from '../utils/reviewTradeDates';
import { BestWorstCard } from './shared/BestWorstCard';
import { InvalidContextMessage } from './InvalidContextMessage';
import { TradesPreviewData } from '../../../types/reviewV2';
import { useReviewTrades } from '../hooks/useReviewData';
import { useEventBus } from '../../../hooks';
import { SkeletonBox } from '../../shared';
import { t, type TranslationKey } from '../../../lang/helpers';
import { classifyPnLWithBreakEvenSettings } from '../../../utils/breakEvenRange';
import { getBreakEvenBalanceForDisplayTrade } from './shared/breakEvenDisplayUtils';

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

interface BestWorstMonthsWidgetProps {
  filePath: string;
  plugin: JournalitPlugin;
  config?: BestWorstMonthsWidgetConfig;
  preview?: boolean;
  previewData?: TradesPreviewData;
}

interface BestWorstMonthsWidgetConfig {
  showBest?: boolean; 
  showWorst?: boolean; 
  showTradeCount?: boolean; 
  showWinRate?: boolean; 
}

const DEFAULT_CONFIG: BestWorstMonthsWidgetConfig = {
  showBest: true,
  showWorst: true,
  showTradeCount: true,
  showWinRate: true,
};

interface MonthStats {
  month: number; 
  year: number;
  monthStart: Date;
  monthEnd: Date;
  pnl: number;
  pnlR: number | undefined; 
  tradeCount: number;
  wins: number;
  losses: number;
  breakevens: number;
  winRate: number;
  breakEvenBalances: Set<number>;
  hasUnresolvedBreakEvenBalance: boolean;
  trades: Array<{
    originalCurrency?: string;
    originalPnlBeforeConversion?: number | null;
    pnl?: number | null;
    currency?: string;
  }>;
}


const MONTH_KEYS = [
  'common.month.january',
  'common.month.february',
  'common.month.march',
  'common.month.april',
  'common.month.may',
  'common.month.june',
  'common.month.july',
  'common.month.august',
  'common.month.september',
  'common.month.october',
  'common.month.november',
  'common.month.december',
] as const satisfies readonly TranslationKey[];


const getMonthBounds = (
  year: number,
  month: number
): { start: Date; end: Date } => {
  const start = new Date(year, month, 1, 0, 0, 0, 0);
  const end = new Date(year, month + 1, 0, 23, 59, 59, 999); 
  return { start, end };
};

export const BestWorstMonthsWidget: React.FC<BestWorstMonthsWidgetProps> =
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

      
      const currency =
        getSingleExplicitCurrency(trades) ||
        plugin?.settings?.general?.currency ||
        CurrencyCode.USD;
      const { formatValue, shouldMask } = useDisplayFormatter();
      const isPnlMasked = shouldMask('pnl');
      const isReturnPercentMasked = shouldMask('returnPercent');
      const applyAccountCountMultiplier = false;
      const defaultRiskAmount = plugin?.settings?.trade?.defaultRiskAmount;
      const breakEvenThresholdMode =
        plugin?.settings?.trade?.breakEvenThresholdMode;
      const breakEvenThresholdPercent =
        plugin?.settings?.trade?.breakEvenThresholdPercent;
      const breakEvenRangeMin = plugin?.settings?.trade?.breakEvenRangeMin;
      const breakEvenRangeMax = plugin?.settings?.trade?.breakEvenRangeMax;
      
      const { bestMonth, worstMonth } = useMemo(() => {
        const closedTrades = asReviewBestWorstTrades(
          trades
            .filter((t) => isPnlContributingTrade(t))
            .flatMap((trade) =>
              splitReviewTradeByRealizedPnlEvent(trade, plugin)
            )
        );

        if (closedTrades.length === 0) {
          return { bestMonth: null, worstMonth: null };
        }

        
        const monthMap = new Map<string, MonthStats>();

        closedTrades.forEach((trade) => {
          
          const tradingDay = getReviewTradeTradingDay(trade, plugin);
          if (!tradingDay) {
            return;
          }
          const year = tradingDay.getFullYear();
          const month = tradingDay.getMonth(); 
          const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
          const { start: monthStart, end: monthEnd } = getMonthBounds(
            year,
            month
          );

          const existing = monthMap.get(monthKey) || {
            month,
            year,
            monthStart,
            monthEnd,
            pnl: 0,
            pnlR: undefined,
            tradeCount: 0,
            wins: 0,
            losses: 0,
            breakevens: 0,
            winRate: 0,
            breakEvenBalances: new Set<number>(),
            hasUnresolvedBreakEvenBalance: false,
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

          monthMap.set(monthKey, existing);
        });

        
        monthMap.forEach((monthData) => {
          const decidedTrades = monthData.wins + monthData.losses;
          monthData.winRate =
            decidedTrades > 0 ? (monthData.wins / decidedTrades) * 100 : 0;
        });

        const months = Array.from(monthMap.values());

        
        const sortedByPnl = [...months].sort((a, b) => b.pnl - a.pnl);

        const resolveOutcome = (
          monthData: MonthStats | null
        ): 'win' | 'loss' | null => {
          if (!monthData) return null;
          if (monthData.hasUnresolvedBreakEvenBalance) {
            return null;
          }

          const balances = Array.from(monthData.breakEvenBalances);
          const balance = balances.length === 1 ? balances[0] : undefined;
          const outcome = classifyPnLWithBreakEvenSettings(
            monthData.pnl,
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

        const bestMonth =
          sortedByPnl.find(
            (monthData) => resolveOutcome(monthData) === 'win'
          ) || null;
        const worstMonth =
          [...sortedByPnl]
            .reverse()
            .find((monthData) => resolveOutcome(monthData) === 'loss') || null;

        return {
          bestMonth,
          worstMonth,
        };
      }, [
        trades,
        plugin,
        applyAccountCountMultiplier,
        defaultRiskAmount,
        breakEvenThresholdMode,
        breakEvenThresholdPercent,
        breakEvenRangeMin,
        breakEvenRangeMax,
      ]);

      
      const formatMonthName = (monthData: MonthStats): string => {
        return `${t(MONTH_KEYS[monthData.month])} ${monthData.year}`;
      };

      if (loading) {
        const showBoth = Boolean(
          mergedConfig.showBest && mergedConfig.showWorst
        );

        const renderSkeletonCard = (
          isPositive: boolean,
          titleKey: TranslationKey
        ) => (
          <div>
            <div className="journalit-reviewv2-bestworst-label">
              {t(titleKey)}
            </div>
            <div
              className={[
                'journalit-reviewv2-bestworst-card',
                isPositive
                  ? 'journalit-reviewv2-bestworst-card--positive'
                  : 'journalit-reviewv2-bestworst-card--negative',
                'journalit-reviewv2-bestworst-card--preview',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <div className="journalit-reviewv2-bestworst-pnl-col">
                <SkeletonBox width={70} height={20} borderRadius="4px" />
              </div>
              <div className="journalit-reviewv2-bestworst-details">
                <SkeletonBox width={120} height={16} borderRadius="4px" />
                <div className="journalit-u-flex journalit-u-gap-8 journalit-u-mt-4">
                  <SkeletonBox width={50} height={12} borderRadius="4px" />
                  <SkeletonBox width={70} height={12} borderRadius="4px" />
                </div>
              </div>
            </div>
          </div>
        );

        return (
          <div
            className={[
              'journalit-reviewv2-bestworst-grid',
              showBoth
                ? 'journalit-reviewv2-bestworst-grid--both'
                : 'journalit-reviewv2-bestworst-grid--single',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {mergedConfig.showBest &&
              renderSkeletonCard(true, 'widget.best-worst.best-month')}
            {mergedConfig.showWorst &&
              renderSkeletonCard(false, 'widget.best-worst.worst-month')}
          </div>
        );
      }

      const openMonthlyReview = async (monthData: MonthStats) => {
        
        if (preview) return;

        try {
          
          const monthlyPath = plugin.monthlyReviewService?.getMonthlyReviewPath(
            monthData.monthStart
          );
          if (!monthlyPath) return;

          
          const file = plugin.app.vault.getAbstractFileByPath(monthlyPath);
          if (file) {
            await plugin.openFile(monthlyPath, false);
          } else if (
            plugin.settings.monthly?.autoCreateMonthlyReviewOnNavigation
          ) {
            
            await plugin.monthlyReviewService.createMonthlyReview(
              monthData.monthStart
            );
            
            const newPath = plugin.monthlyReviewService?.getMonthlyReviewPath(
              monthData.monthStart
            );
            if (newPath) await plugin.openFile(newPath, false);
          }
        } catch (error) {
          console.error(
            '[BestWorstMonthsWidget] Error opening monthly review:',
            error
          );
        }
      };

      const buildMetaItems = (monthData: MonthStats): string[] => {
        const items: string[] = [];
        if (mergedConfig.showTradeCount) {
          items.push(
            t('widget.best-worst.n-trades', {
              count: String(monthData.tradeCount),
            })
          );
        }
        if (mergedConfig.showWinRate) {
          items.push(
            isReturnPercentMasked
              ? `${formatValue({
                  kind: 'returnPercent',
                  value: monthData.winRate,
                  signed: false,
                  precision: 0,
                })} ${t('dashboard.metrics.winRate')}`
              : t('widget.best-worst.win-rate', {
                  rate: monthData.winRate.toFixed(0),
                })
          );
        }
        return items;
      };

      
      const allowedNoteTypes = ['quarterly-review', 'yearly-review'];
      if (!preview && noteType && !allowedNoteTypes.includes(noteType)) {
        return (
          <InvalidContextMessage
            widgetType={t('widget.best-worst-months.name')}
            reason={t('widget.best-worst-months.invalid-context')}
          />
        );
      }

      return (
        <div
          className={[
            'journalit-reviewv2-bestworst-grid',
            mergedConfig.showBest && mergedConfig.showWorst
              ? 'journalit-reviewv2-bestworst-grid--both'
              : 'journalit-reviewv2-bestworst-grid--single',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {mergedConfig.showBest && (
            <BestWorstCard
              title={t('widget.best-worst.best-month')}
              isPositive={true}
              isMasked={isPnlMasked}
              isEmpty={!bestMonth}
              emptyMessage={t('widget.best-worst.no-profitable-months')}
              pnl={
                bestMonth
                  ? formatValue({
                      kind: 'pnl',
                      value: bestMonth.pnl,
                      currencyCode: currency,
                      rMultiple: bestMonth.pnlR,
                    })
                  : ''
              }
              primaryText={bestMonth ? formatMonthName(bestMonth) : ''}
              metaItems={bestMonth ? buildMetaItems(bestMonth) : []}
              onClick={
                bestMonth ? () => void openMonthlyReview(bestMonth) : undefined
              }
              currencyConversion={currencyConversion}
              conversionTrades={bestMonth?.trades}
            />
          )}
          {mergedConfig.showWorst && (
            <BestWorstCard
              title={t('widget.best-worst.worst-month')}
              isPositive={false}
              isMasked={isPnlMasked}
              isEmpty={!worstMonth}
              emptyMessage={t('widget.best-worst.no-losing-months')}
              pnl={
                worstMonth
                  ? formatValue({
                      kind: 'pnl',
                      value: worstMonth.pnl,
                      currencyCode: currency,
                      rMultiple: worstMonth.pnlR,
                    })
                  : ''
              }
              primaryText={worstMonth ? formatMonthName(worstMonth) : ''}
              metaItems={worstMonth ? buildMetaItems(worstMonth) : []}
              onClick={
                worstMonth
                  ? () => void openMonthlyReview(worstMonth)
                  : undefined
              }
              currencyConversion={currencyConversion}
              conversionTrades={worstMonth?.trades}
            />
          )}
        </div>
      );
    }
  );

BestWorstMonthsWidget.displayName = 'BestWorstMonthsWidget';

export {};
