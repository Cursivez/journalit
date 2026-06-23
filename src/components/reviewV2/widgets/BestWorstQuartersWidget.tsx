

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
import {
  getQuarter,
  getQuarterStartDate,
  getQuarterEndDate,
} from '../../../utils/dateUtils';
import { BestWorstCard } from './shared/BestWorstCard';
import { InvalidContextMessage } from './InvalidContextMessage';
import { TradesPreviewData } from '../../../types/reviewV2';
import { useReviewTrades } from '../hooks/useReviewData';
import { useEventBus } from '../../../hooks';
import { SkeletonBox } from '../../shared';
import { t } from '../../../lang/helpers';
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

interface BestWorstQuartersWidgetProps {
  filePath: string;
  plugin: JournalitPlugin;
  config?: BestWorstQuartersWidgetConfig;
  preview?: boolean;
  previewData?: TradesPreviewData;
}

interface BestWorstQuartersWidgetConfig {
  showBest?: boolean; 
  showWorst?: boolean; 
  showTradeCount?: boolean; 
  showWinRate?: boolean; 
}

const DEFAULT_CONFIG: BestWorstQuartersWidgetConfig = {
  showBest: true,
  showWorst: true,
  showTradeCount: true,
  showWinRate: true,
};

interface QuarterStats {
  quarter: number; 
  year: number;
  quarterStart: Date;
  quarterEnd: Date;
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

export const BestWorstQuartersWidget: React.FC<BestWorstQuartersWidgetProps> =
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
      
      const { bestQuarter, worstQuarter } = useMemo(() => {
        const closedTrades = asReviewBestWorstTrades(
          trades.flatMap((trade) =>
            isPnlContributingTrade(trade)
              ? splitReviewTradeByRealizedPnlEvent(trade, plugin)
              : []
          )
        );

        if (closedTrades.length === 0) {
          return { bestQuarter: null, worstQuarter: null };
        }

        
        const quarterMap = new Map<string, QuarterStats>();

        closedTrades.forEach((trade) => {
          
          const tradingDay = getReviewTradeTradingDay(trade, plugin);
          if (!tradingDay) {
            return;
          }
          const year = tradingDay.getFullYear();
          const quarter = getQuarter(tradingDay); 
          const quarterKey = `${year}-Q${quarter}`;
          const quarterStart = getQuarterStartDate(year, quarter);
          const quarterEnd = getQuarterEndDate(year, quarter);

          const existing = quarterMap.get(quarterKey) || {
            quarter,
            year,
            quarterStart,
            quarterEnd,
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

          quarterMap.set(quarterKey, existing);
        });

        
        quarterMap.forEach((quarterData) => {
          const decidedTrades = quarterData.wins + quarterData.losses;
          quarterData.winRate =
            decidedTrades > 0 ? (quarterData.wins / decidedTrades) * 100 : 0;
        });

        const quarters = Array.from(quarterMap.values());

        
        const sortedByPnl = [...quarters].sort((a, b) => b.pnl - a.pnl);

        const resolveOutcome = (
          quarterData: QuarterStats | null
        ): 'win' | 'loss' | null => {
          if (!quarterData) return null;
          if (quarterData.hasUnresolvedBreakEvenBalance) {
            return null;
          }

          const balances = Array.from(quarterData.breakEvenBalances);
          const balance = balances.length === 1 ? balances[0] : undefined;
          const outcome = classifyPnLWithBreakEvenSettings(
            quarterData.pnl,
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

        const bestQuarter =
          sortedByPnl.find(
            (quarterData) => resolveOutcome(quarterData) === 'win'
          ) || null;
        const worstQuarter =
          [...sortedByPnl]
            .reverse()
            .find((quarterData) => resolveOutcome(quarterData) === 'loss') ||
          null;

        return {
          bestQuarter,
          worstQuarter,
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

      
      const formatQuarterName = (quarterData: QuarterStats): string => {
        return `Q${quarterData.quarter} ${quarterData.year}`;
      };

      if (loading) {
        const showBoth = Boolean(
          mergedConfig.showBest && mergedConfig.showWorst
        );

        const renderSkeletonCard = (isPositive: boolean, title: string) => (
          <div>
            <div className="journalit-reviewv2-bestworst-label">{title}</div>
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
                <SkeletonBox width={80} height={16} borderRadius="4px" />
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
              renderSkeletonCard(
                true,
                t('widget.best-worst-quarters.best-quarter')
              )}
            {mergedConfig.showWorst &&
              renderSkeletonCard(
                false,
                t('widget.best-worst-quarters.worst-quarter')
              )}
          </div>
        );
      }

      const openQuarterlyReview = async (quarterData: QuarterStats) => {
        
        if (preview) return;

        try {
          
          const quarterlyPath =
            await plugin.quarterlyReviewService?.getQuarterlyReviewPath(
              quarterData.quarterStart
            );
          if (!quarterlyPath) return;

          
          const file = plugin.app.vault.getAbstractFileByPath(quarterlyPath);
          if (file) {
            await plugin.openFile(quarterlyPath, false);
          } else if (
            plugin.settings.quarterly?.autoCreateQuarterlyReviewOnNavigation
          ) {
            
            await plugin.quarterlyReviewService.createQuarterlyReview(
              quarterData.quarterStart
            );
            
            const newPath =
              await plugin.quarterlyReviewService?.getQuarterlyReviewPath(
                quarterData.quarterStart
              );
            if (newPath) await plugin.openFile(newPath, false);
          }
        } catch (error) {
          console.error(
            '[BestWorstQuartersWidget] Error opening quarterly review:',
            error
          );
        }
      };

      const buildMetaItems = (quarterData: QuarterStats): string[] => {
        const items: string[] = [];
        if (mergedConfig.showTradeCount) {
          items.push(
            t('widget.best-worst-quarters.trade-count', {
              count: String(quarterData.tradeCount),
            })
          );
        }
        if (mergedConfig.showWinRate) {
          items.push(
            isReturnPercentMasked
              ? `${formatValue({
                  kind: 'returnPercent',
                  value: quarterData.winRate,
                  signed: false,
                  precision: 0,
                })} ${t('dashboard.metrics.winRate')}`
              : t('widget.best-worst-quarters.win-rate', {
                  percent: quarterData.winRate.toFixed(0),
                })
          );
        }
        return items;
      };

      
      const allowedNoteTypes = ['yearly-review'];
      if (!preview && noteType && !allowedNoteTypes.includes(noteType)) {
        return (
          <InvalidContextMessage
            widgetType={t('widget.best-worst-quarters.name')}
            reason={t('widget.best-worst-quarters.invalid-context')}
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
              title={t('widget.best-worst-quarters.best-quarter')}
              isPositive={true}
              isMasked={isPnlMasked}
              isEmpty={!bestQuarter}
              emptyMessage={t('widget.best-worst-quarters.no-profitable')}
              pnl={
                bestQuarter
                  ? formatValue({
                      kind: 'pnl',
                      value: bestQuarter.pnl,
                      currencyCode: currency,
                      rMultiple: bestQuarter.pnlR,
                    })
                  : ''
              }
              primaryText={bestQuarter ? formatQuarterName(bestQuarter) : ''}
              metaItems={bestQuarter ? buildMetaItems(bestQuarter) : []}
              onClick={
                bestQuarter
                  ? () => void openQuarterlyReview(bestQuarter)
                  : undefined
              }
              currencyConversion={currencyConversion}
              conversionTrades={bestQuarter?.trades}
            />
          )}
          {mergedConfig.showWorst && (
            <BestWorstCard
              title={t('widget.best-worst-quarters.worst-quarter')}
              isPositive={false}
              isMasked={isPnlMasked}
              isEmpty={!worstQuarter}
              emptyMessage={t('widget.best-worst-quarters.no-losing')}
              pnl={
                worstQuarter
                  ? formatValue({
                      kind: 'pnl',
                      value: worstQuarter.pnl,
                      currencyCode: currency,
                      rMultiple: worstQuarter.pnlR,
                    })
                  : ''
              }
              primaryText={worstQuarter ? formatQuarterName(worstQuarter) : ''}
              metaItems={worstQuarter ? buildMetaItems(worstQuarter) : []}
              onClick={
                worstQuarter
                  ? () => void openQuarterlyReview(worstQuarter)
                  : undefined
              }
              currencyConversion={currencyConversion}
              conversionTrades={worstQuarter?.trades}
            />
          )}
        </div>
      );
    }
  );

BestWorstQuartersWidget.displayName = 'BestWorstQuartersWidget';

export {};
