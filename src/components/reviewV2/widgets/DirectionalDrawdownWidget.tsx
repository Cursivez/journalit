

import React, { useMemo } from 'react';
import JournalitPlugin from '../../../main';
import { SharedDrawdownChart } from '../../charts/SharedDrawdownChart';
import type { Trade } from '../../dashboard/utils/dataUtils';
import {
  getDrawdownChartScaleValue,
  prepareDrawdownChartState,
  shouldUseDrawdownPercentScale,
} from '../../../utils/chartUtils';
import { mapTradesToDisplayPnL } from '../../../utils/pnlUtils';
import { TradesPreviewData } from '../../../types/reviewV2';
import { useReviewTrades } from '../hooks/useReviewData';
import { useAccountCapitalBasisLookup } from '../hooks/useAccountCapitalBasisLookup';
import { SkeletonBox } from '../../shared';
import { t } from '../../../lang/helpers';
import { cssVars } from '../../../styles/inlineStylePolicy';
import { getSingleExplicitCurrency } from '../../../utils/currencyAggregation';
import { CurrencyConversionInfo } from '../../shared/display/CurrencyConversionInfo';
import { isPnlContributingTrade } from '../../../utils/tradeStatusUtils';
import { getReviewAnalyticsDateBasis } from '../utils/reviewTradeDates';
import { resolveDrawdownCapitalBasis } from '../../../utils/drawdownAnalytics';

const asDirectionalTrades = (value: unknown): Trade[] =>
  Array.isArray(value)
    ? value.filter((item): item is Trade =>
        Boolean(item && typeof item === 'object' && !Array.isArray(item))
      )
    : [];

const normalizeDirectionValue = (value: unknown): string =>
  typeof value === 'string' ? value.toLowerCase() : '';

interface DirectionalDrawdownWidgetProps {
  filePath: string;
  plugin: JournalitPlugin;
  config?: DirectionalDrawdownWidgetConfig;
  preview?: boolean;
  previewData?: TradesPreviewData;
}

export interface DirectionalDrawdownWidgetConfig {
  showLong?: boolean;
  showShort?: boolean;
  height?: number;
  layout?: 'stacked' | 'side-by-side';
  singleDirectionTitle?: string;
}

const DEFAULT_CONFIG: DirectionalDrawdownWidgetConfig = {
  showLong: true,
  showShort: true,
  height: 250,
  layout: 'stacked',
};

export const DirectionalDrawdownWidget: React.FC<DirectionalDrawdownWidgetProps> =
  React.memo(
    ({ filePath, plugin, config = {}, preview = false, previewData }) => {
      const mergedConfig = { ...DEFAULT_CONFIG, ...config };

      const {
        trades: cachedTrades,
        loading: cacheLoading,
        noteType,
        currencyConversion,
        filters,
      } = useReviewTrades(filePath, plugin);

      const trades = asDirectionalTrades(
        preview && previewData ? previewData.trades : cachedTrades
      );
      const loading = preview ? false : cacheLoading;
      const currencyOverride = getSingleExplicitCurrency(trades);

      const dateFormat = plugin?.settings?.trade?.dateFormat || 'DDMMYY';
      const defaultRiskAmount = plugin?.settings?.trade?.defaultRiskAmount;
      const applyAccountCountMultiplier = false;
      const analyticsDateBasis = getReviewAnalyticsDateBasis(plugin);
      const accountCapitalByLookupKey = useAccountCapitalBasisLookup(
        plugin,
        !preview
      );

      const {
        longChart,
        shortChart,
        sharedMinValue,
        sharedMaxValue,
        totalTrades,
        longTrades,
        shortTrades,
      } = useMemo(() => {
        const pnlContributingTrades = trades.filter((trade) =>
          isPnlContributingTrade(trade)
        );
        const longTrades = pnlContributingTrades.filter(
          (trade) => trade.direction?.toLowerCase() === 'long'
        );
        const shortTrades = pnlContributingTrades.filter(
          (trade) => trade.direction?.toLowerCase() === 'short'
        );
        const tradesWithDisplayPnL = mapTradesToDisplayPnL(
          trades,
          applyAccountCountMultiplier
        );
        const displayCurrency =
          currencyConversion?.conversionBaseCurrency ??
          getSingleExplicitCurrency(trades) ??
          plugin?.settings?.general?.currency;
        const capitalBasis = resolveDrawdownCapitalBasis(
          tradesWithDisplayPnL,
          plugin?.settings?.account?.accountMetadata,
          { filters, displayCurrency, accountCapitalByLookupKey }
        );

        const longState = prepareDrawdownChartState(
          tradesWithDisplayPnL,
          dateFormat,
          defaultRiskAmount,
          'long',
          plugin,
          analyticsDateBasis,
          capitalBasis
        );
        const shortState = prepareDrawdownChartState(
          tradesWithDisplayPnL,
          dateFormat,
          defaultRiskAmount,
          'short',
          plugin,
          analyticsDateBasis,
          capitalBasis
        );

        const visibleSeries = [
          ...(mergedConfig.showLong && longState.totalClosedTrades > 0
            ? [longState.data]
            : []),
          ...(mergedConfig.showShort && shortState.totalClosedTrades > 0
            ? [shortState.data]
            : []),
        ];

        const usePercentScale = visibleSeries.every((series) =>
          shouldUseDrawdownPercentScale(series)
        );
        const drawdownValues = visibleSeries.flatMap((series) =>
          series.map((point) =>
            getDrawdownChartScaleValue(point, usePercentScale)
          )
        );

        return {
          longChart: longState,
          shortChart: shortState,
          sharedMinValue:
            drawdownValues.length > 0 ? Math.min(...drawdownValues) : undefined,
          sharedMaxValue:
            drawdownValues.length > 0 ? Math.max(...drawdownValues) : undefined,
          totalTrades:
            longState.totalClosedTrades + shortState.totalClosedTrades,
          longTrades,
          shortTrades,
        };
      }, [
        trades,
        dateFormat,
        defaultRiskAmount,
        applyAccountCountMultiplier,
        plugin,
        analyticsDateBasis,
        mergedConfig.showLong,
        mergedConfig.showShort,
        filters,
        accountCapitalByLookupKey,
        currencyConversion?.conversionBaseCurrency,
      ]);

      const containerClassName =
        mergedConfig.layout === 'side-by-side'
          ? 'journalit-reviewv2-directional-container journalit-reviewv2-directional-container--row'
          : 'journalit-reviewv2-directional-container journalit-reviewv2-directional-container--column';
      const singleVisibleDirection =
        mergedConfig.showLong && !mergedConfig.showShort
          ? 'long'
          : !mergedConfig.showLong && mergedConfig.showShort
            ? 'short'
            : null;
      const longTitle =
        singleVisibleDirection === 'long' && mergedConfig.singleDirectionTitle
          ? mergedConfig.singleDirectionTitle
          : t('widget.directional-drawdown.title.long');
      const shortTitle =
        singleVisibleDirection === 'short' && mergedConfig.singleDirectionTitle
          ? mergedConfig.singleDirectionTitle
          : t('widget.directional-drawdown.title.short');
      const unconvertedTrades = currencyConversion?.unconvertedTrades || [];
      const longConversionTrades = [
        ...longTrades,
        ...unconvertedTrades.filter(
          (trade) => normalizeDirectionValue(trade.direction) === 'long'
        ),
      ];
      const shortConversionTrades = [
        ...shortTrades,
        ...unconvertedTrades.filter(
          (trade) => normalizeDirectionValue(trade.direction) === 'short'
        ),
      ];

      if (loading) {
        const ChartSkeleton = ({ title }: { title: string }) => (
          <div className="journalit-reviewv2-directional-section">
            <div className="journalit-reviewv2-chart-header">
              <div className="journalit-reviewv2-chart-title">{title}</div>
            </div>
            <div className="journalit-reviewv2-chart-body">
              <div
                className="journalit-reviewv2-chart-skeleton"
                style={cssVars({
                  '--reviewv2-chart-height': `${mergedConfig.height || 250}px`,
                  '--reviewv2-chart-bar-gap': '4px',
                })}
              >
                <div className="journalit-reviewv2-chart-skeleton-axis">
                  <SkeletonBox width={25} height={10} borderRadius="4px" />
                  <SkeletonBox width={30} height={10} borderRadius="4px" />
                  <SkeletonBox width={28} height={10} borderRadius="4px" />
                  <SkeletonBox width={32} height={10} borderRadius="4px" />
                </div>
                <div className="journalit-reviewv2-chart-skeleton-wave journalit-reviewv2-chart-skeleton-wave--wide">
                  <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 400 200"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0,10 L50,10 Q80,40 120,80 T180,60 T240,100 T320,40 T400,70 L400,0 L0,0 Z"
                      fill="var(--background-modifier-border)"
                      className="skeleton-shimmer journalit-reviewv2-chart-skeleton-wave-fill"
                    />
                    <path
                      d="M0,10 L50,10 Q80,40 120,80 T180,60 T240,100 T320,40 T400,70"
                      fill="none"
                      stroke="var(--background-modifier-border)"
                      strokeWidth="2"
                      className="skeleton-shimmer journalit-reviewv2-chart-skeleton-wave-line"
                    />
                  </svg>
                </div>
                <div className="journalit-reviewv2-chart-skeleton-xlabels journalit-reviewv2-chart-skeleton-xlabels--between journalit-reviewv2-chart-skeleton-xlabels--wide">
                  <SkeletonBox width={20} height={10} borderRadius="4px" />
                  <SkeletonBox width={20} height={10} borderRadius="4px" />
                  <SkeletonBox width={20} height={10} borderRadius="4px" />
                </div>
              </div>
            </div>
          </div>
        );

        return (
          <div className={containerClassName}>
            {mergedConfig.showLong && <ChartSkeleton title={longTitle} />}
            {mergedConfig.showShort && <ChartSkeleton title={shortTitle} />}
          </div>
        );
      }

      if (totalTrades === 0) {
        if (unconvertedTrades.length > 0) {
          return (
            <div className={containerClassName}>
              {mergedConfig.showLong && (
                <div className="journalit-reviewv2-directional-section">
                  <div className="journalit-reviewv2-chart-header">
                    <div className="journalit-reviewv2-chart-title">
                      {longTitle}
                      <CurrencyConversionInfo
                        metadata={currencyConversion}
                        trades={longConversionTrades}
                      />
                    </div>
                  </div>
                  <div className="journalit-reviewv2-chart-empty journalit-reviewv2-chart-empty--small">
                    {t('widget.directional-drawdown.empty.no-long')}
                  </div>
                </div>
              )}
              {mergedConfig.showShort && (
                <div className="journalit-reviewv2-directional-section">
                  <div className="journalit-reviewv2-chart-header">
                    <div className="journalit-reviewv2-chart-title">
                      {shortTitle}
                      <CurrencyConversionInfo
                        metadata={currencyConversion}
                        trades={shortConversionTrades}
                      />
                    </div>
                  </div>
                  <div className="journalit-reviewv2-chart-empty journalit-reviewv2-chart-empty--small">
                    {t('widget.directional-drawdown.empty.no-short')}
                  </div>
                </div>
              )}
            </div>
          );
        }

        return (
          <div className="journalit-reviewv2-chart-empty journalit-reviewv2-chart-empty--small">
            {t('widget.directional-drawdown.empty.no-closed')}
          </div>
        );
      }

      if (
        noteType === 'drc' &&
        totalTrades < 2 &&
        mergedConfig.showLong &&
        mergedConfig.showShort
      ) {
        return (
          <div className="journalit-reviewv2-chart-empty journalit-reviewv2-chart-empty--small">
            {t('widget.directional-drawdown.empty.not-enough')}
          </div>
        );
      }

      return (
        <div className={containerClassName}>
          {mergedConfig.showLong && (
            <div className="journalit-reviewv2-directional-section">
              <div className="journalit-reviewv2-chart-header">
                <div className="journalit-reviewv2-chart-title">
                  {longTitle}
                  <CurrencyConversionInfo
                    metadata={currencyConversion}
                    trades={longConversionTrades}
                  />
                </div>
              </div>
              {longChart.totalClosedTrades > 0 ? (
                <div className="journalit-reviewv2-chart-body">
                  <SharedDrawdownChart
                    data={longChart.data}
                    height={mergedConfig.height}
                    minValue={sharedMinValue}
                    maxValue={sharedMaxValue}
                    plugin={plugin}
                    currencyOverride={currencyOverride}
                  />
                </div>
              ) : (
                <div className="journalit-reviewv2-chart-empty journalit-reviewv2-chart-empty--small">
                  {t('widget.directional-drawdown.empty.no-long')}
                </div>
              )}
            </div>
          )}

          {mergedConfig.showShort && (
            <div className="journalit-reviewv2-directional-section">
              <div className="journalit-reviewv2-chart-header">
                <div className="journalit-reviewv2-chart-title">
                  {shortTitle}
                  <CurrencyConversionInfo
                    metadata={currencyConversion}
                    trades={shortConversionTrades}
                  />
                </div>
              </div>
              {shortChart.totalClosedTrades > 0 ? (
                <div className="journalit-reviewv2-chart-body">
                  <SharedDrawdownChart
                    data={shortChart.data}
                    height={mergedConfig.height}
                    minValue={sharedMinValue}
                    maxValue={sharedMaxValue}
                    plugin={plugin}
                    currencyOverride={currencyOverride}
                  />
                </div>
              ) : (
                <div className="journalit-reviewv2-chart-empty journalit-reviewv2-chart-empty--small">
                  {t('widget.directional-drawdown.empty.no-short')}
                </div>
              )}
            </div>
          )}
        </div>
      );
    }
  );

DirectionalDrawdownWidget.displayName = 'DirectionalDrawdownWidget';
