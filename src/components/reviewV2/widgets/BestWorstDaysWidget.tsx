

import React, { useState, useMemo, useCallback } from 'react';
import JournalitPlugin from '../../../main';
import { calculateEffectiveRMultiple } from '../../../utils/formatting';
import { useDisplayFormatter } from '../../../hooks/useDisplayPolicy';
import { CurrencyCode } from '../../../utils/currencyConfig';
import { getSingleExplicitCurrency } from '../../../utils/currencyAggregation';
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
import { BestWorstCard } from './shared/BestWorstCard';
import { InvalidContextMessage } from './InvalidContextMessage';
import { useReviewTrades } from '../hooks/useReviewData';
import { useEventBus } from '../../../hooks';
import { SkeletonBox } from '../../shared';
import { t, tPlural } from '../../../lang/helpers';

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
        dateRange: _dateRange,
        currencyConversion,
      } = useReviewTrades(filePath, plugin);

      
      const trades = preview && previewData ? previewData.trades : cachedTrades;
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

      
      const currency =
        getSingleExplicitCurrency(trades) ||
        plugin?.settings?.general?.currency ||
        CurrencyCode.USD;
      const { formatValue, shouldMask } = useDisplayFormatter();
      const isPnlMasked = shouldMask('pnl');
      const isReturnPercentMasked = shouldMask('returnPercent');
      const applyAccountCountMultiplier = false;
      const defaultRiskAmount = plugin?.settings?.trade?.defaultRiskAmount;
      const dateFormat = plugin?.settings?.trade?.dateFormat || 'DDMMYY';
      const breakEvenThresholdMode =
        plugin?.settings?.trade?.breakEvenThresholdMode;
      const breakEvenThresholdPercent =
        plugin?.settings?.trade?.breakEvenThresholdPercent;
      const breakEvenRangeMin = plugin?.settings?.trade?.breakEvenRangeMin;
      const breakEvenRangeMax = plugin?.settings?.trade?.breakEvenRangeMax;
      
      const { bestDay, worstDay } = useMemo(() => {
        const closedTrades = trades
          .filter((t) => isPnlContributingTrade(t))
          .flatMap((trade) =>
            splitReviewTradeByRealizedPnlEvent(trade, plugin)
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
        const showBoth = Boolean(
          mergedConfig.showBest && mergedConfig.showWorst
        );

        const renderSkeletonCard = (
          isPositive: boolean,
          titleKey:
            | 'widget.best-worst-days.best-day'
            | 'widget.best-worst-days.worst-day'
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
                <SkeletonBox width={140} height={16} borderRadius="4px" />
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
              renderSkeletonCard(true, 'widget.best-worst-days.best-day')}
            {mergedConfig.showWorst &&
              renderSkeletonCard(false, 'widget.best-worst-days.worst-day')}
          </div>
        );
      }

      const openDRC = async (date: Date) => {
        
        if (preview) return;

        try {
          
          const drcPath = plugin.drcService?.getDRCNotePath(date);
          if (!drcPath) return;

          
          const file = plugin.app.vault.getAbstractFileByPath(drcPath);
          if (file) {
            await plugin.openFile(drcPath, false);
          } else if (plugin.settings.drc.autoCreateDRCOnNavigation) {
            
            await plugin.drcService.createDRC(date);
            
            const newPath = plugin.drcService?.getDRCNotePath(date);
            if (newPath) await plugin.openFile(newPath, false);
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
              title={t('widget.best-worst-days.best-day')}
              isPositive={true}
              isMasked={isPnlMasked}
              isEmpty={!bestDay}
              emptyMessage={t('widget.best-worst-days.no-profitable-days')}
              pnl={
                bestDay
                  ? formatValue({
                      kind: 'pnl',
                      value: bestDay.pnl,
                      currencyCode: currency,
                      rMultiple: bestDay.pnlR,
                    })
                  : ''
              }
              primaryText={bestDay ? formatDayName(bestDay.date) : ''}
              metaItems={bestDay ? buildMetaItems(bestDay) : []}
              onClick={bestDay ? () => openDRC(bestDay.date) : undefined}
              currencyConversion={currencyConversion}
              conversionTrades={bestDay?.trades}
            />
          )}
          {mergedConfig.showWorst && (
            <BestWorstCard
              title={t('widget.best-worst-days.worst-day')}
              isPositive={false}
              isMasked={isPnlMasked}
              isEmpty={!worstDay}
              emptyMessage={t('widget.best-worst-days.no-losing-days')}
              pnl={
                worstDay
                  ? formatValue({
                      kind: 'pnl',
                      value: worstDay.pnl,
                      currencyCode: currency,
                      rMultiple: worstDay.pnlR,
                    })
                  : ''
              }
              primaryText={worstDay ? formatDayName(worstDay.date) : ''}
              metaItems={worstDay ? buildMetaItems(worstDay) : []}
              onClick={worstDay ? () => openDRC(worstDay.date) : undefined}
              currencyConversion={currencyConversion}
              conversionTrades={worstDay?.trades}
            />
          )}
        </div>
      );
    }
  );

BestWorstDaysWidget.displayName = 'BestWorstDaysWidget';

export {};
