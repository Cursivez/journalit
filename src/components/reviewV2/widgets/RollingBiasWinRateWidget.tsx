

import React, { useEffect, useMemo, useState } from 'react';
import type JournalitPlugin from '../../../main';
import type { TradesPreviewData } from '../../../types/reviewV2';
import { t } from '../../../lang/helpers';
import { RollingBiasWinRateChart } from '../../charts/RollingBiasWinRateChart';
import { ChartSkeleton } from '../../shared/ChartSkeleton';
import { useReviewData } from '../hooks/useReviewData';
import { useTradeMarketBiasResolver } from '../../../hooks/useTradeMarketBiasResolver';
import { getReviewAnalyticsDateBasis } from '../utils/reviewTradeDates';
import {
  getMissedTradeTradingDay,
  getTradeAnalyticsDate,
  getTradeAnalyticsTradingDay,
} from '../../../utils/tradeAnalyticsDate';
import { isPnlContributingTrade } from '../../../utils/tradeStatusUtils';
import type { CachedReviewData } from '../../../services/reviewV2/ReviewDataCache';
import {
  calculateRollingBiasWinRate,
  parseRollingBiasPeriod,
  type RollingBiasPeriod,
  type RollingBiasTrade,
} from '../../../services/marketBias/rollingBiasWinRate';
import {
  getBreakEvenSettings,
  toRollingBiasTrades,
} from '../../../services/marketBias/rollingBiasTrades';
import type {
  TradeBiasAlignment,
  TradeMarketBiasResolver,
} from '../../../services/marketBias/tradeMarketBias';
import type { AnalyticsDateBasis } from '../../../settings/types';
import type { PartialTradeFrontmatter } from '../../../types/TradeFrontmatter';

export const DEFAULT_ROLLING_BIAS_REVIEW_PERIOD: RollingBiasPeriod = 10;


const LOOKBACK_CHUNK = 200;

export interface RollingBiasWinRateWidgetConfig {
  
  window?: RollingBiasPeriod;
}


export function toRollingBiasWidgetConfig(
  config: Readonly<Record<string, unknown>> | undefined
): RollingBiasWinRateWidgetConfig {
  const size = parseRollingBiasPeriod(config?.window);
  return size ? { window: size } : {};
}


export function parseRollingBiasWidgetConfig(
  source: string
): RollingBiasWinRateWidgetConfig {
  const match = /^\s*window\s*:\s*(\d+)\s*$/m.exec(source);
  const size = match ? parseRollingBiasPeriod(match[1]) : null;
  return size ? { window: size } : {};
}

interface RollingBiasWinRateWidgetProps {
  filePath: string;
  plugin: JournalitPlugin;
  config?: RollingBiasWinRateWidgetConfig;
  preview?: boolean;
  previewData?: TradesPreviewData;
}

type ReviewTrade = PartialTradeFrontmatter & Record<string, unknown>;


function reviewPeriodTrades(review: CachedReviewData): ReviewTrade[] {
  return (review.analyticsBasisTrades ?? review.trades).filter(
    (trade): trade is ReviewTrade =>
      typeof trade === 'object' && trade !== null && !Array.isArray(trade)
  );
}

function tradePath(trade: ReviewTrade): string | undefined {
  return typeof trade.path === 'string' ? trade.path : undefined;
}


async function loadEarlierMissedTrades(
  plugin: JournalitPlugin,
  review: CachedReviewData,
  dateBasis: AnalyticsDateBasis
): Promise<ReviewTrade[]> {
  const { tradeTypes } = review.filters;
  if (tradeTypes.length > 0 && !tradeTypes.includes('missed')) return [];
  const missedTradeService =
    await plugin.serviceManager.getMissedTradeService();
  const lastEarlierDay = new Date(review.dateRange.start);
  lastEarlierDay.setDate(lastEarlierDay.getDate() - 1);
  const files = await missedTradeService.getMissedTrades(
    new Date(0),
    lastEarlierDay,
    { dateBasis }
  );
  const trades = await Promise.all(
    files.map((file) => plugin.tradeService.extractTradeData(file))
  );
  return trades.filter(
    (trade): trade is ReviewTrade =>
      trade !== null && trade.isMissedTrade === true
  );
}


async function loadLookbackTrades(
  plugin: JournalitPlugin,
  review: CachedReviewData,
  resolveBias: TradeMarketBiasResolver,
  period: number,
  dateBasis: AnalyticsDateBasis
): Promise<RollingBiasTrade[]> {
  const reviewDataCache = plugin.reviewDataCache;
  if (!reviewDataCache) return [];
  const periodStart = review.dateRange.start;
  const periodPaths = new Set(
    reviewPeriodTrades(review).flatMap((t) => tradePath(t) ?? [])
  );
  const [trades, missedTrades] = await Promise.all([
    plugin.tradeService.getTradeData({ fresh: false }),
    loadEarlierMissedTrades(plugin, review, dateBasis),
  ]);
  const earlier = [...trades, ...missedTrades]
    .flatMap((trade) => {
      if (!isPnlContributingTrade(trade)) return [];
      const path = tradePath(trade);
      if (path !== undefined && periodPaths.has(path)) return [];
      const tradingDay =
        trade.isMissedTrade === true
          ? getMissedTradeTradingDay(trade, dateBasis, plugin)
          : getTradeAnalyticsTradingDay(trade, dateBasis, plugin);
      if (!tradingDay || tradingDay >= periodStart) return [];
      const time = getTradeAnalyticsDate(trade, dateBasis)?.getTime();
      if (time === undefined) return [];
      const entryTime = getTradeAnalyticsDate(trade, 'entry');
      if (!entryTime) return [];
      const { alignment } = resolveBias({ ...trade, entryTime });
      return alignment === 'with' || alignment === 'against'
        ? [{ trade, time }]
        : [];
    })
    .sort((a, b) => b.time - a.time);

  const breakEvenSettings = getBreakEvenSettings(plugin);
  const found: RollingBiasTrade[] = [];
  const counts: Partial<Record<TradeBiasAlignment, number>> = {};
  
  
  for (
    let i = 0;
    i < earlier.length &&
    ((counts.with ?? 0) < period || (counts.against ?? 0) < period);
    i += LOOKBACK_CHUNK
  ) {
    const chunk = earlier
      .slice(i, i + LOOKBACK_CHUNK)
      .map(({ trade }) => Object.fromEntries(Object.entries(trade)));
    const filtered = await reviewDataCache.prepareTradesForReviewFilters(
      chunk,
      review.filters
    );
    for (const trade of toRollingBiasTrades(
      filtered,
      resolveBias,
      breakEvenSettings,
      dateBasis
    )) {
      counts[trade.alignment] = (counts[trade.alignment] ?? 0) + 1;
      found.push(trade);
    }
  }
  return found;
}


function previewRollingTrades(
  previewData: TradesPreviewData | undefined
): RollingBiasTrade[] {
  return (previewData?.trades ?? []).map((trade, index) => ({
    alignment: index % 3 === 0 ? 'against' : 'with',
    outcome:
      (trade.pnl ?? 0) > 0
        ? 'win'
        : (trade.pnl ?? 0) < 0
          ? 'loss'
          : 'breakeven',
    time: index,
  }));
}

function periodStartLabel(noteType: CachedReviewData['noteType']): string {
  switch (noteType) {
    case 'weekly-review':
      return t('widget.rolling-bias-win-rate.week-starts');
    case 'monthly-review':
      return t('widget.rolling-bias-win-rate.month-starts');
    case 'quarterly-review':
      return t('widget.rolling-bias-win-rate.quarter-starts');
    default:
      return t('widget.rolling-bias-win-rate.year-starts');
  }
}

export const RollingBiasWinRateWidget =
  React.memo<RollingBiasWinRateWidgetProps>(
    ({ filePath, plugin, config, preview, previewData }) => {
      const period = config?.window ?? DEFAULT_ROLLING_BIAS_REVIEW_PERIOD;
      const { data: review, loading } = useReviewData(filePath, plugin);
      const resolveBias = useTradeMarketBiasResolver();
      const dateBasis = getReviewAnalyticsDateBasis(plugin);
      const [lookback, setLookback] = useState<{
        key: CachedReviewData;
        resolver: TradeMarketBiasResolver;
        period: number;
        trades: RollingBiasTrade[];
      } | null>(null);

      useEffect(() => {
        if (preview || !review || !resolveBias) return;
        let cancelled = false;
        loadLookbackTrades(plugin, review, resolveBias, period, dateBasis)
          .then((trades) => {
            if (!cancelled) {
              setLookback({
                key: review,
                resolver: resolveBias,
                period,
                trades,
              });
            }
          })
          .catch((error: unknown) => {
            console.error(
              '[RollingBiasWinRateWidget] Failed to load earlier trades:',
              error
            );
            if (!cancelled) {
              setLookback({
                key: review,
                resolver: resolveBias,
                period,
                trades: [],
              });
            }
          });
        return () => {
          cancelled = true;
        };
      }, [plugin, review, resolveBias, period, dateBasis, preview]);

      const lookbackReady =
        lookback !== null &&
        lookback.key === review &&
        lookback.resolver === resolveBias &&
        lookback.period === period;

      const points = useMemo(() => {
        if (preview) {
          return calculateRollingBiasWinRate(
            previewRollingTrades(previewData),
            period
          );
        }
        if (!review || !resolveBias || !lookbackReady) return null;
        const periodTrades = toRollingBiasTrades(
          reviewPeriodTrades(review),
          resolveBias,
          getBreakEvenSettings(plugin),
          dateBasis
        );
        return calculateRollingBiasWinRate(
          periodTrades,
          period,
          lookback.trades
        );
      }, [
        preview,
        previewData,
        period,
        review,
        resolveBias,
        lookbackReady,
        lookback,
        plugin,
        dateBasis,
      ]);

      const hasPeriodPoint = points?.some((point) => !point.beforePeriod);

      return (
        <div className="journalit-reviewv2-chart-container">
          <div className="journalit-reviewv2-chart-header">
            <div className="journalit-reviewv2-chart-title">
              {t('widget.rolling-bias-win-rate.name')}
            </div>
          </div>
          {points === null || (loading && !preview) ? (
            <div className="journalit-reviewv2-chart-body journalit-rolling-bias-review-body">
              <ChartSkeleton variant="line" />
            </div>
          ) : !hasPeriodPoint ? (
            <div className="journalit-reviewv2-chart-empty">
              {t('widget.rolling-bias-win-rate.empty')}
            </div>
          ) : (
            <div className="journalit-reviewv2-chart-body journalit-rolling-bias-review-body">
              <RollingBiasWinRateChart
                points={points}
                period={period}
                xAxis={preview ? 'tradeNumber' : 'day'}
                periodStartLabel={
                  review ? periodStartLabel(review.noteType) : undefined
                }
              />
            </div>
          )}
        </div>
      );
    }
  );

RollingBiasWinRateWidget.displayName = 'RollingBiasWinRateWidget';
