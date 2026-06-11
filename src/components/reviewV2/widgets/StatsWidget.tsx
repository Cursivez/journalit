

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { t } from '../../../lang/helpers';
import { calculateMetrics } from '../../dashboard/utils/dataUtils';
import { CurrencyCode } from '../../../utils/currencyConfig';
import { getSingleExplicitCurrency } from '../../../utils/currencyAggregation';
import {
  getEffectivePnL,
  isPnlContributingTrade,
} from '../../../utils/tradeStatusUtils';
import { getDisplayPnL, getAccountCount } from '../../../utils/pnlUtils';
import { classifyPnLWithBreakEvenSettings } from '../../../utils/breakEvenRange';
import JournalitPlugin from '../../../main';
import { TradesPreviewData } from '../../../types/reviewV2';
import { useReviewData } from '../hooks/useReviewData';
import { useEventBus } from '../../../hooks';
import { useDisplayFormatter } from '../../../hooks/useDisplayPolicy';
import { SkeletonBox } from '../../shared';
import {
  CurrencyConversionInfo,
  type CurrencyConversionTrade,
  type ReviewCurrencyConversionMetadata,
} from '../../shared/display/CurrencyConversionInfo';
import { cssVars } from '../../../styles/inlineStylePolicy';
import type { UnifiedFilters } from '../../shared/filters/types';
import type { CachedReviewData } from '../../../services/reviewV2/ReviewDataCache';
import {
  getPreviousBusinessDay,
  isWeekendSkippingEnabled,
  parseLocalDateSafe,
} from '../../../utils/dateUtils';
import { getTradingDayRange } from '../../../utils/tradingDayUtils';
import type { PartialTradeFrontmatter } from '../../../types/TradeFrontmatter';
import {
  createStatDelta,
  signedNumber,
  type StatDelta,
} from '../../../utils/previousPeriodDelta';
import {
  getReviewAnalyticsDateBasis,
  getReviewTradeRealizedPnlEvents,
  getReviewTradeTradingDay,
  splitReviewTradeByRealizedPnlEvent,
} from '../utils/reviewTradeDates';

interface StatsWidgetProps {
  filePath: string;
  plugin: JournalitPlugin;
  config?: StatsWidgetConfig;
  preview?: boolean;
  previewData?: TradesPreviewData;
}

interface StatsWidgetConfig {
  stats?: {
    netPnL?: boolean;
    winRate?: boolean;
    profitFactor?: boolean;
    expectancy?: boolean;
    totalTrades?: boolean;
    avgWin?: boolean;
    avgLoss?: boolean;
    plRatio?: boolean;
  };
  columns?: 2 | 3 | 4;
}

type StatsMetrics = ReturnType<typeof calculateMetrics>;

type ReviewNoteType = NonNullable<CachedReviewData['noteType']>;

const DEFAULT_CONFIG: StatsWidgetConfig = {
  stats: {
    netPnL: true,
    winRate: true,
    profitFactor: true,
    expectancy: true,
    totalTrades: true,
    avgWin: true,
    avgLoss: true,
    plRatio: true,
  },
  columns: 4,
};

export const StatsWidget: React.FC<StatsWidgetProps> = React.memo(
  ({ filePath, plugin, config = {}, preview, previewData }) => {
    const mergedConfig = {
      ...DEFAULT_CONFIG,
      ...config,
      stats: { ...DEFAULT_CONFIG.stats, ...config?.stats },
    };

    
    const { data: cachedData, loading: cacheLoading } = useReviewData(
      filePath,
      plugin
    );

    
    const trades = useMemo(
      () =>
        preview && previewData
          ? previewData.trades
          : (cachedData?.analyticsBasisTrades ?? cachedData?.trades ?? []),
      [cachedData, preview, previewData]
    );
    const metricTrades = useMemo(
      () =>
        preview && previewData
          ? trades
          : trades.flatMap((trade) =>
              splitReviewTradeByRealizedPnlEvent(trade, plugin)
            ),
      [plugin, preview, previewData, trades]
    );
    const loading = preview ? false : cacheLoading;
    const { formatValue, shouldMask } = useDisplayFormatter();
    const analyticsDateBasis = getReviewAnalyticsDateBasis(plugin);

    
    const [, setSettingsVersion] = useState(0);

    useEventBus(
      'settings:changed',
      useCallback(() => {
        setSettingsVersion((v) => v + 1);
      }, []),
      !preview
    );

    const prepareDisplayTrades = useCallback((metricTrades: typeof trades) => {
      const applyAccountCountMultiplier = false;

      return metricTrades.filter(isPnlContributingTrade).map((t) => {
        const accountCount = getAccountCount(t);
        const displayPnL = getDisplayPnL(
          getEffectivePnL(t),
          accountCount,
          applyAccountCountMultiplier
        );
        const breakEvenBalanceForDisplay = applyAccountCountMultiplier
          ? ((t as Record<string, unknown>)
              .breakEvenAccountCurrentBalanceTotal ??
            (t as Record<string, unknown>).breakEvenAccountCurrentBalance)
          : (t as Record<string, unknown>).breakEvenAccountCurrentBalance;
        const originalPnlForDisplay =
          typeof t.originalPnlBeforeConversion === 'number'
            ? getDisplayPnL(
                t.originalPnlBeforeConversion,
                accountCount,
                applyAccountCountMultiplier
              )
            : t.originalPnlBeforeConversion;

        return {
          ...t,
          pnl: displayPnL,
          originalPnlBeforeConversion: originalPnlForDisplay,
          breakEvenAccountCurrentBalance:
            typeof breakEvenBalanceForDisplay === 'number'
              ? breakEvenBalanceForDisplay
              : undefined,
        };
      });
    }, []);

    const calculateStatsMetrics = useCallback(
      (metricTrades: typeof trades) => {
        const tradesWithDisplayPnL = prepareDisplayTrades(metricTrades);

        if (tradesWithDisplayPnL.length === 0) {
          return null;
        }

        const defaultRiskAmount = plugin?.settings?.trade?.defaultRiskAmount;
        const breakEvenRangeMin =
          plugin?.settings?.trade?.breakEvenRangeMin ?? 0;
        const breakEvenRangeMax =
          plugin?.settings?.trade?.breakEvenRangeMax ?? 0;
        const breakEvenThresholdMode =
          plugin?.settings?.trade?.breakEvenThresholdMode;
        const breakEvenThresholdPercent =
          plugin?.settings?.trade?.breakEvenThresholdPercent;

        return calculateMetrics(tradesWithDisplayPnL, {
          defaultRiskAmount,
          breakEvenRangeMin,
          breakEvenRangeMax,
          breakEvenThresholdMode,
          breakEvenThresholdPercent,
          analyticsDateBasis,
          tradingDayCutoffTime: plugin?.settings?.trade?.tradingDayCutoffTime,
        });
      },
      [analyticsDateBasis, plugin, prepareDisplayTrades]
    );

    const metrics = useMemo(
      () => calculateStatsMetrics(metricTrades),
      [calculateStatsMetrics, metricTrades]
    );
    const currentDisplayTrades = useMemo(
      () => prepareDisplayTrades(metricTrades),
      [prepareDisplayTrades, metricTrades]
    );
    const winningTrades = useMemo<CurrencyConversionTrade[]>(() => {
      const breakEvenSettings = {
        breakEvenRangeMin: plugin?.settings?.trade?.breakEvenRangeMin ?? 0,
        breakEvenRangeMax: plugin?.settings?.trade?.breakEvenRangeMax ?? 0,
        breakEvenThresholdMode: plugin?.settings?.trade?.breakEvenThresholdMode,
        breakEvenThresholdPercent:
          plugin?.settings?.trade?.breakEvenThresholdPercent,
      };
      return currentDisplayTrades.filter(
        (trade) =>
          classifyPnLWithBreakEvenSettings(
            getEffectivePnL(trade),
            breakEvenSettings,
            trade.breakEvenAccountCurrentBalance
          ) === 'win'
      );
    }, [currentDisplayTrades, plugin]);
    const losingTrades = useMemo<CurrencyConversionTrade[]>(() => {
      const breakEvenSettings = {
        breakEvenRangeMin: plugin?.settings?.trade?.breakEvenRangeMin ?? 0,
        breakEvenRangeMax: plugin?.settings?.trade?.breakEvenRangeMax ?? 0,
        breakEvenThresholdMode: plugin?.settings?.trade?.breakEvenThresholdMode,
        breakEvenThresholdPercent:
          plugin?.settings?.trade?.breakEvenThresholdPercent,
      };
      return currentDisplayTrades.filter(
        (trade) =>
          classifyPnLWithBreakEvenSettings(
            getEffectivePnL(trade),
            breakEvenSettings,
            trade.breakEvenAccountCurrentBalance
          ) === 'loss'
      );
    }, [currentDisplayTrades, plugin]);

    const [previousTrades, setPreviousTrades] = useState<typeof trades>([]);

    useEffect(() => {
      if (preview || !cachedData || !plugin.tradeService) {
        setPreviousTrades([]);
        return;
      }

      let isMounted = true;
      (async () => {
        setPreviousTrades([]);
        if (!isMounted) return;

        const allTrades = await plugin.tradeService.getTradeData({
          fresh: false,
        });
        const previousPeriodTrades = await getPreviousPeriodTrades(
          cachedData,
          plugin,
          allTrades
        );

        if (isMounted) {
          setPreviousTrades(previousPeriodTrades);
        }
      })().catch((error) => {
        console.error(
          '[StatsWidget] Failed to load previous period trades:',
          error
        );
        if (isMounted) setPreviousTrades([]);
      });

      return () => {
        isMounted = false;
      };
    }, [cachedData, plugin, preview]);

    const previousMetrics = useMemo(
      () => calculateStatsMetrics(previousTrades),
      [calculateStatsMetrics, previousTrades]
    );

    
    const plRatio = useMemo(() => calculatePLRatio(metrics), [metrics]);
    const previousPLRatio = useMemo(
      () => calculatePLRatio(previousMetrics),
      [previousMetrics]
    );

    if (loading) {
      const { stats } = mergedConfig;
      const enabledStats = Object.entries(stats || {}).filter(
        ([, enabled]) => enabled
      );

      return (
        <div
          className="journalit-reviewv2-stats-grid"
          style={cssVars({
            '--reviewv2-stats-columns': mergedConfig.columns || 4,
          })}
        >
          {enabledStats.map(([key]) => (
            <div key={key} className="journalit-reviewv2-stats-card">
              <div className="journalit-u-mb-4">
                <SkeletonBox width={60} height={12} borderRadius="4px" />
              </div>
              <SkeletonBox width={50} height={18} borderRadius="4px" />
            </div>
          ))}
        </div>
      );
    }

    if (!metrics) {
      return (
        <div className="journalit-u-text-center journalit-reviewv2-text-muted">
          {t('widget.stats.no-trades')}
        </div>
      );
    }

    const currency =
      getSingleExplicitCurrency(trades) ||
      plugin?.settings?.general?.currency ||
      CurrencyCode.USD;
    const previousCurrency =
      getSingleExplicitCurrency(previousTrades) ||
      plugin?.settings?.general?.currency ||
      CurrencyCode.USD;
    const currencyConversion = cachedData?.currencyConversion ?? null;
    const isPnlMasked = shouldMask('pnl');
    const isReturnPercentMasked = shouldMask('returnPercent');
    const isMetricMasked = shouldMask('metric');
    const { stats } = mergedConfig;
    const previousDataAvailable = previousMetrics !== null;
    const displayRMultiples = plugin?.settings?.trade?.displayRMultiples;
    const comparablePnlCurrencies = currency === previousCurrency;
    const pnlDeltaOptions = {
      previousDataAvailable,
      masked: isPnlMasked,
      zeroThreshold: displayRMultiples ? 0.05 : 0.005,
      formatter: (value: number) =>
        displayRMultiples
          ? formatValue({
              kind: 'rMultiple' as const,
              value,
              signed: true,
              precision: 1,
            })
          : formatValue({
              kind: 'pnl' as const,
              value,
              currencyCode: currency,
              signed: true,
            }),
    };
    const percentDeltaOptions = {
      previousDataAvailable,
      masked: isReturnPercentMasked,
      zeroThreshold: 0.05,
      formatter: (value: number) =>
        formatValue({
          kind: 'returnPercent' as const,
          value,
          signed: true,
          precision: 1,
        }),
    };
    const metricDeltaOptions = {
      previousDataAvailable,
      masked: isMetricMasked,
      zeroThreshold: 0.005,
      formatter: (value: number) =>
        formatValue({
          kind: 'metric' as const,
          value,
          signed: true,
          precision: 2,
        }),
    };

    const createPnlDelta = (
      currentValue: number,
      previousValue: number | undefined,
      currentR: number | undefined,
      previousR: number | undefined,
      lowerIsBetter = false
    ): StatDelta | undefined => {
      const useRDelta =
        displayRMultiples && currentR !== undefined && previousR !== undefined;
      if (
        !useRDelta &&
        previousDataAvailable &&
        previousValue !== undefined &&
        !comparablePnlCurrencies
      ) {
        return undefined;
      }

      return createStatDelta(
        useRDelta ? currentR : currentValue,
        useRDelta ? previousR : previousValue,
        { ...pnlDeltaOptions, lowerIsBetter }
      );
    };

    return (
      <div
        className="journalit-reviewv2-stats-grid"
        style={cssVars({
          '--reviewv2-stats-columns': mergedConfig.columns || 4,
        })}
      >
        {stats?.netPnL && (
          <StatCard
            label={t('widget.stats.net-pnl')}
            value={formatValue({
              kind: 'pnl',
              value: metrics.netPnL,
              currencyCode: currency,
              rMultiple: metrics.netPnLR,
            })}
            color={
              isPnlMasked ? undefined : metrics.netPnL >= 0 ? 'green' : 'red'
            }
            delta={createPnlDelta(
              metrics.netPnL,
              previousMetrics?.netPnL,
              metrics.netPnLR,
              previousMetrics?.netPnLR
            )}
            currencyConversion={currencyConversion}
          />
        )}
        {stats?.winRate && (
          <StatCard
            label={t('widget.stats.win-rate')}
            value={formatValue({
              kind: 'returnPercent',
              value: metrics.winRate * 100,
              signed: false,
              precision: 1,
            })}
            delta={createStatDelta(
              metrics.winRate * 100,
              previousMetrics ? previousMetrics.winRate * 100 : undefined,
              percentDeltaOptions
            )}
          />
        )}
        {stats?.profitFactor && (
          <StatCard
            label={t('widget.stats.profit-factor')}
            value={
              isMetricMasked
                ? formatValue({ kind: 'metric', value: metrics.profitFactor })
                : metrics.profitFactor === Infinity
                  ? '∞'
                  : metrics.profitFactor.toFixed(2)
            }
            color={
              isMetricMasked
                ? undefined
                : metrics.profitFactor >= 1
                  ? 'green'
                  : 'red'
            }
            delta={createStatDelta(
              metrics.profitFactor,
              previousMetrics?.profitFactor,
              metricDeltaOptions
            )}
          />
        )}
        {stats?.expectancy && (
          <StatCard
            label={t('widget.stats.expectancy')}
            value={formatValue({
              kind: 'pnl',
              value: metrics.expectancy,
              currencyCode: currency,
              rMultiple: metrics.expectancyR,
            })}
            color={
              isPnlMasked
                ? undefined
                : metrics.expectancy > 0
                  ? 'green'
                  : metrics.expectancy < 0
                    ? 'red'
                    : undefined
            }
            delta={createPnlDelta(
              metrics.expectancy,
              previousMetrics?.expectancy,
              metrics.expectancyR,
              previousMetrics?.expectancyR
            )}
            currencyConversion={currencyConversion}
          />
        )}
        {stats?.totalTrades && (
          <StatCard
            label={t('widget.stats.total-trades')}
            value={metrics.numTrades.toString()}
            delta={createStatDelta(
              metrics.numTrades,
              previousMetrics?.numTrades,
              {
                previousDataAvailable,
                masked: false,
                formatter: (value) => signedNumber(value),
                lowerIsBetter: false,
                neutralTone: true,
              }
            )}
          />
        )}
        {stats?.avgWin && (
          <StatCard
            label={t('widget.stats.avg-win')}
            value={formatValue({
              kind: 'pnl',
              value: metrics.avgWin,
              currencyCode: currency,
              rMultiple: metrics.avgWinR,
            })}
            delta={createPnlDelta(
              metrics.avgWin,
              previousMetrics?.avgWin,
              metrics.avgWinR,
              previousMetrics?.avgWinR
            )}
            currencyConversion={currencyConversion}
            conversionTrades={winningTrades}
          />
        )}
        {stats?.avgLoss && (
          <StatCard
            label={t('widget.stats.avg-loss')}
            value={formatValue({
              kind: 'pnl',
              value: -Math.abs(metrics.avgLoss),
              currencyCode: currency,
              rMultiple: metrics.avgLossR
                ? -Math.abs(metrics.avgLossR)
                : undefined,
            })}
            delta={createPnlDelta(
              -Math.abs(metrics.avgLoss),
              previousMetrics ? -Math.abs(previousMetrics.avgLoss) : undefined,
              metrics.avgLossR !== undefined
                ? -Math.abs(metrics.avgLossR)
                : undefined,
              previousMetrics?.avgLossR !== undefined
                ? -Math.abs(previousMetrics.avgLossR)
                : undefined,
              false
            )}
            currencyConversion={currencyConversion}
            conversionTrades={losingTrades}
          />
        )}
        {stats?.plRatio && (
          <StatCard
            label={t('widget.stats.pl-ratio')}
            value={formatValue({
              kind: 'metric',
              value: plRatio,
              precision: 2,
            })}
            color={
              isMetricMasked || isReturnPercentMasked
                ? undefined
                : plRatio >= 1
                  ? 'green'
                  : 'red'
            }
            delta={createStatDelta(
              plRatio,
              previousPLRatio,
              metricDeltaOptions
            )}
          />
        )}
      </div>
    );
  }
);

StatsWidget.displayName = 'StatsWidget';

function calculatePLRatio(metrics: StatsMetrics | null): number {
  if (!metrics || metrics.avgLoss === 0) return 0;
  return Math.abs(metrics.avgWin / metrics.avgLoss);
}

async function getPreviousPeriodTrades(
  cachedData: CachedReviewData,
  plugin: JournalitPlugin,
  allTrades: CachedReviewData['trades']
): Promise<CachedReviewData['trades']> {
  const previousRange = getPreviousPeriodRange(
    cachedData.noteType,
    cachedData.dateRange,
    plugin,
    cachedData.tradingDayStr
  );
  if (!previousRange) return [];

  const filteredByDate = allTrades
    .map((trade: PartialTradeFrontmatter) => ({
      ...trade,
      _analyticsRangeStart: previousRange.start,
      _analyticsRangeEnd: previousRange.end,
    }))
    .filter((trade: PartialTradeFrontmatter) => {
      const reviewTrade = {
        ...trade,
        _originalPnlWasNull: trade.pnl === undefined || trade.pnl === null,
        _analyticsRangeStart: previousRange.start,
        _analyticsRangeEnd: previousRange.end,
      };

      if (getReviewTradeRealizedPnlEvents(reviewTrade, plugin).length > 0) {
        return true;
      }

      const analyticsTradingDay = getReviewTradeTradingDay(reviewTrade, plugin);

      if (analyticsTradingDay === null) return false;

      if (cachedData.noteType === 'drc') {
        return isSameLocalDate(
          analyticsTradingDay,
          startOfLocalDay(previousRange.start)
        );
      }

      return (
        analyticsTradingDay >= previousRange.start &&
        analyticsTradingDay <= previousRange.end
      );
    });

  if (!plugin.reviewDataCache) return [];

  const eventScopedTrades = filteredByDate.flatMap((trade) =>
    splitReviewTradeByRealizedPnlEvent(trade as PartialTradeFrontmatter, plugin)
  );

  return plugin.reviewDataCache.prepareTradesForReviewFilters(
    eventScopedTrades as unknown as Array<Record<string, unknown>>,
    cachedData.filters as UnifiedFilters
  );
}

function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isSameLocalDate(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getPreviousPeriodRange(
  noteType: ReviewNoteType,
  dateRange: CachedReviewData['dateRange'],
  plugin: JournalitPlugin,
  tradingDayStr?: string
): CachedReviewData['dateRange'] | null {
  const { start, end } = dateRange;

  if (noteType === 'drc') {
    const currentTradingDay = tradingDayStr
      ? (parseLocalDateSafe(tradingDayStr) ?? start)
      : start;
    const previousDay = getPreviousBusinessDay(
      currentTradingDay,
      isWeekendSkippingEnabled(plugin)
    );
    const tradingDayRange = getTradingDayRange(previousDay, plugin);
    return {
      start: tradingDayRange.start,
      end: new Date(tradingDayRange.end.getTime() - 1),
    };
  }

  if (noteType === 'weekly-review') {
    return shiftRangeByDays(start, end, -7);
  }

  if (noteType === 'monthly-review') {
    const previousMonthStart = new Date(
      start.getFullYear(),
      start.getMonth() - 1,
      1
    );
    return {
      start: previousMonthStart,
      end: new Date(
        previousMonthStart.getFullYear(),
        previousMonthStart.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
      ),
    };
  }

  if (noteType === 'quarterly-review') {
    const previousQuarterStart = new Date(
      start.getFullYear(),
      start.getMonth() - 3,
      1
    );
    return {
      start: previousQuarterStart,
      end: new Date(
        previousQuarterStart.getFullYear(),
        previousQuarterStart.getMonth() + 3,
        0,
        23,
        59,
        59,
        999
      ),
    };
  }

  if (noteType === 'yearly-review') {
    return {
      start: new Date(start.getFullYear() - 1, 0, 1),
      end: new Date(start.getFullYear() - 1, 11, 31, 23, 59, 59, 999),
    };
  }

  return null;
}

function shiftRangeByDays(
  start: Date,
  end: Date,
  days: number
): CachedReviewData['dateRange'] {
  const offsetMs = days * 24 * 60 * 60 * 1000;
  return {
    start: new Date(start.getTime() + offsetMs),
    end: new Date(end.getTime() + offsetMs),
  };
}

interface StatCardProps {
  label: string;
  value: string;
  color?: 'green' | 'red';
  delta?: StatDelta;
  currencyConversion?: ReviewCurrencyConversionMetadata | null;
  conversionTrades?: CurrencyConversionTrade[];
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  color,
  delta,
  currencyConversion,
  conversionTrades,
}) => {
  return (
    <div className="journalit-reviewv2-stats-card">
      <div className="journalit-reviewv2-stats-label">
        {label}
        <CurrencyConversionInfo
          metadata={currencyConversion}
          trades={conversionTrades}
        />
      </div>
      <div
        className={[
          'journalit-reviewv2-stats-value',
          color === 'green'
            ? 'journalit-reviewv2-stats-value--positive'
            : color === 'red'
              ? 'journalit-reviewv2-stats-value--negative'
              : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {value}
      </div>
      {delta && (
        <div
          className={[
            'journalit-reviewv2-stats-delta',
            delta.tone === 'green'
              ? 'journalit-reviewv2-stats-delta--positive'
              : delta.tone === 'red'
                ? 'journalit-reviewv2-stats-delta--negative'
                : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {delta.direction !== 'flat' && (
            <span className="journalit-reviewv2-stats-delta-arrow">
              {delta.direction === 'up' ? '↑' : '↓'}
            </span>
          )}
          <span>{delta.value}</span>
          <span className="journalit-reviewv2-stats-delta-suffix">
            {t('widget.stats.vs-prev')}
          </span>
        </div>
      )}
    </div>
  );
};
