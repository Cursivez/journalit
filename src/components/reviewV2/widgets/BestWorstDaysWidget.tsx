

import React, { useState, useMemo, useCallback } from 'react';
import JournalitPlugin from '../../../main';
import { calculateEffectiveRMultiple } from '../../../utils/formatting';
import { useDisplayFormatter } from '../../../hooks/useDisplayPolicy';
import { classifyPnLWithBreakEvenSettings } from '../../../utils/breakEvenRange';
import {
  getEffectivePnL,
  isPnlContributingTrade,
} from '../../../utils/tradeStatusUtils';
import { getDisplayPnL, getAccountCount } from '../../../utils/pnlUtils';
import { getBreakEvenBalanceForDisplayTrade } from './shared/breakEvenDisplayUtils';
import {
  formatDateDisplay,
  formatLocalDateString,
} from '../../../utils/dateUtils';
import {
  getReviewTradeTradingDay,
  splitReviewTradeByRealizedPnlEvent,
} from '../utils/reviewTradeDates';
import { TradesPreviewData } from '../../../types/reviewV2';
import {
  BestWorstPeriodGrid,
  BestWorstSkeletonGrid,
} from './shared/BestWorstPeriodGrid';
import {
  readReviewTradeSettings,
  resolveReviewCurrency,
} from './shared/reviewWidgetSettings';
import { InvalidContextMessage } from './InvalidContextMessage';
import { useReviewTrades } from '../hooks/useReviewData';
import { useEventBus } from '../../../hooks/useEventBus';
import { t, tPlural } from '../../../lang/helpers';
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

interface BestWorstDaysWidgetProps {
  filePath: string;
  plugin: JournalitPlugin;
  config?: BestWorstDaysWidgetConfig;
  preview?: boolean;
  previewData?: TradesPreviewData;
}

interface BestWorstDaysWidgetConfig {
  showBest?: boolean; 
  showWorst?: boolean; 
  showTradeCount?: boolean; 
  showWinRate?: boolean; 
}

const DEFAULT_CONFIG: BestWorstDaysWidgetConfig = {
  showBest: true,
  showWorst: true,
  showTradeCount: true,
  showWinRate: true,
};

interface DayStats {
  date: Date;
  dateKey: string;
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

export const BestWorstDaysWidget: React.FC<BestWorstDaysWidgetProps> =
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

      
      const isValidContext =
        preview || (noteType !== 'drc' && noteType !== 'trade');

      
      const currency = resolveReviewCurrency(trades, plugin);
      const { formatValue, shouldMask } = useDisplayFormatter();
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
      
      const { bestDay, worstDay } = useMemo(() => {
        const closedTrades = asReviewBestWorstTrades(
          trades.flatMap((trade) =>
            isPnlContributingTrade(trade)
              ? splitReviewTradeByRealizedPnlEvent(trade, plugin)
              : []
          )
        );

        if (closedTrades.length === 0) {
          return { bestDay: null, worstDay: null };
        }

        
        const dayMap = new Map<string, DayStats>();

        closedTrades.forEach((trade) => {
          
          const tradingDay = getReviewTradeTradingDay(trade, plugin);
          if (!tradingDay) {
            return;
          }
          const dateKey = formatLocalDateString(tradingDay); 

          const existing = dayMap.get(dateKey) || {
            date: tradingDay,
            dateKey,
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

          dayMap.set(dateKey, existing);
        });

        
        dayMap.forEach((day) => {
          const decidedTrades = day.wins + day.losses;
          day.winRate =
            decidedTrades > 0 ? (day.wins / decidedTrades) * 100 : 0;
        });

        const days = Array.from(dayMap.values());

        
        const sortedByPnl = [...days].sort((a, b) => b.pnl - a.pnl);

        const resolveOutcome = (
          day: DayStats | null
        ): 'win' | 'loss' | null => {
          if (!day) return null;
          if (day.hasUnresolvedBreakEvenBalance) {
            return null;
          }

          const balances = Array.from(day.breakEvenBalances);
          const balance = balances.length === 1 ? balances[0] : undefined;
          const outcome = classifyPnLWithBreakEvenSettings(
            day.pnl,
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

        const bestDay =
          sortedByPnl.find((day) => resolveOutcome(day) === 'win') || null;
        const worstDay =
          [...sortedByPnl]
            .reverse()
            .find((day) => resolveOutcome(day) === 'loss') || null;

        return {
          bestDay,
          worstDay,
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

      
      const formatDayName = (date: Date): string => {
        const dayNameKeys = [
          'common.day.sunday',
          'common.day.monday',
          'common.day.tuesday',
          'common.day.wednesday',
          'common.day.thursday',
          'common.day.friday',
          'common.day.saturday',
        ] as const;
        return `${t(dayNameKeys[date.getDay()])}, ${formatDateDisplay(date, dateFormat, '/')}`;
      };

      if (loading) {
        return (
          <BestWorstSkeletonGrid
            config={mergedConfig}
            bestTitle={t('widget.best-worst-days.best-day')}
            worstTitle={t('widget.best-worst-days.worst-day')}
            primaryWidth={140}
          />
        );
      }

      const openDRC = async (date: Date) => {
        
        if (preview) return;

        try {
          
          const drcPath = plugin.drcService?.getDRCNotePath(date);
          if (!drcPath) return;

          
          const file = plugin.app.vault.getAbstractFileByPath(drcPath);
          if (file) {
            await openReviewWidgetFile(plugin, drcPath);
          } else if (plugin.settings.drc.autoCreateDRCOnNavigation) {
            
            await plugin.drcService.createDRC(date);
            
            const newPath = plugin.drcService?.getDRCNotePath(date);
            if (newPath) await openReviewWidgetFile(plugin, newPath);
          }
        } catch (error) {
          console.error('[BestWorstDaysWidget] Error opening DRC:', error);
        }
      };

      const buildMetaItems = (day: DayStats): string[] => {
        const items: string[] = [];
        if (mergedConfig.showTradeCount) {
          items.push(
            tPlural('widget.best-worst-days.trade-count', day.tradeCount)
          );
        }
        if (mergedConfig.showWinRate) {
          items.push(
            isReturnPercentMasked
              ? `${formatValue({
                  kind: 'returnPercent',
                  value: day.winRate,
                  signed: false,
                  precision: 0,
                })} ${t('dashboard.metrics.winRate')}`
              : t('widget.best-worst-days.win-rate', {
                  rate: day.winRate.toFixed(0),
                })
          );
        }
        return items;
      };

      
      if (!preview && !isValidContext) {
        return (
          <InvalidContextMessage
            widgetType={t('widget.best-worst-days.name')}
            reason={t('widget.best-worst-days.invalid-context')}
          />
        );
      }

      const formatPeriodPnl = (period: DayStats): string =>
        formatValue({
          kind: 'pnl',
          value: period.pnl,
          currencyCode: currency,
          rMultiple: period.pnlR,
        });

      return (
        <BestWorstPeriodGrid
          config={mergedConfig}
          best={{
            title: t('widget.best-worst-days.best-day'),
            emptyMessage: t('widget.best-worst-days.no-profitable-days'),
            period: bestDay,
          }}
          worst={{
            title: t('widget.best-worst-days.worst-day'),
            emptyMessage: t('widget.best-worst-days.no-losing-days'),
            period: worstDay,
          }}
          isPnlMasked={isPnlMasked}
          currencyConversion={currencyConversion}
          formatPnl={formatPeriodPnl}
          formatName={(day) => formatDayName(day.date)}
          buildMetaItems={buildMetaItems}
          onOpen={(day) => void openDRC(day.date)}
        />
      );
    }
  );

BestWorstDaysWidget.displayName = 'BestWorstDaysWidget';

export {};
