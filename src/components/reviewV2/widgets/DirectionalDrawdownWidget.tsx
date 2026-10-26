

import React, { useMemo } from 'react';
import JournalitPlugin from '../../../main';
import { SharedDrawdownChart } from '../../charts/SharedDrawdownChart';
import type { Trade } from '../../dashboard/utils/dataUtils';
import {
  getDrawdownChartPlotValue,
  prepareDrawdownChartState,
  getDrawdownChartScale,
} from '../../../utils/chartUtils';
import { mapTradesToDisplayPnL } from '../../../utils/pnlUtils';
import { TradesPreviewData } from '../../../types/reviewV2';
import { useReviewTrades } from '../hooks/useReviewData';
import { useAccountCapitalBasisLookup } from '../hooks/useAccountCapitalBasisLookup';
import { t } from '../../../lang/helpers';
import { getSingleExplicitCurrency } from '../../../utils/currencyAggregation';
import { isPnlContributingTrade } from '../../../utils/tradeStatusUtils';
import { getReviewAnalyticsDateBasis } from '../utils/reviewTradeDates';
import { resolveDrawdownCapitalBasis } from '../../../utils/drawdownAnalytics';
import {
  DirectionalChartSkeleton,
  DirectionalContainer,
  DirectionalSection,
  type TradeDirection,
} from './shared/DirectionalChartLayout';

const asDirectionalTrades = (value: unknown): Trade[] =>
  Array.isArray(value)
    ? value.filter((item): item is Trade =>
        Boolean(item && typeof item === 'object' && !Array.isArray(item))
      )
    : [];

const normalizeDirectionValue = (value: unknown): string =>
  typeof value === 'string' ? value.toLowerCase() : '';

const DIRECTION_EMPTY_KEYS = {
  long: 'widget.directional-drawdown.empty.no-long',
  short: 'widget.directional-drawdown.empty.no-short',
} as const;

const SKELETON_AXIS_WIDTHS = [25, 30, 28, 32] as const;
const SKELETON_LINE_PATH =
  'M0,10 L50,10 Q80,40 120,80 T180,60 T240,100 T320,40 T400,70';
const SKELETON_AREA_PATH = `${SKELETON_LINE_PATH} L400,0 L0,0 Z`;


function directionalDrawdownTitles(
  config: DirectionalDrawdownWidgetConfig
): Record<TradeDirection, string> {
  const customTitle = config.singleDirectionTitle;
  return {
    long:
      config.showLong && !config.showShort && customTitle
        ? customTitle
        : t('widget.directional-drawdown.title.long'),
    short:
      !config.showLong && config.showShort && customTitle
        ? customTitle
        : t('widget.directional-drawdown.title.short'),
  };
}


function directionalDrawdownEmptyKey({
  totalTrades,
  hasUnconvertedTrades,
  noteType,
  showsBothDirections,
}: {
  totalTrades: number;
  hasUnconvertedTrades: boolean;
  noteType: string | null | undefined;
  showsBothDirections: boolean;
}) {
  if (totalTrades === 0) {
    return hasUnconvertedTrades
      ? null
      : ('widget.directional-drawdown.empty.no-closed' as const);
  }
  if (noteType === 'drc' && totalTrades < 2 && showsBothDirections) {
    return 'widget.directional-drawdown.empty.not-enough' as const;
  }
  return null;
}

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

      const displayRMultiples =
        plugin?.settings?.trade?.displayRMultiples ?? false;
      const {
        longChart,
        shortChart,
        scale,
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

        
        const scale = getDrawdownChartScale(visibleSeries, displayRMultiples);
        const drawdownValues = visibleSeries.flatMap((series) =>
          series.map((point) => getDrawdownChartPlotValue(point, scale))
        );

        return {
          longChart: longState,
          shortChart: shortState,
          scale,
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
        displayRMultiples,
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

      const titles = directionalDrawdownTitles(mergedConfig);
      const unconvertedTrades = currencyConversion?.unconvertedTrades || [];
      const directionTrades = { long: longTrades, short: shortTrades };
      const conversionFor = (direction: TradeDirection) => ({
        metadata: currencyConversion,
        trades: [
          ...directionTrades[direction],
          ...unconvertedTrades.filter(
            (trade) => normalizeDirectionValue(trade.direction) === direction
          ),
        ],
      });

      if (loading) {
        return (
          <DirectionalContainer
            {...mergedConfig}
            renderDirection={(direction) => (
              <DirectionalSection title={titles[direction]}>
                <DirectionalChartSkeleton
                  height={mergedConfig.height || 250}
                  axisWidths={SKELETON_AXIS_WIDTHS}
                  areaPath={SKELETON_AREA_PATH}
                  linePath={SKELETON_LINE_PATH}
                />
              </DirectionalSection>
            )}
          />
        );
      }

      const emptyMessageKey = directionalDrawdownEmptyKey({
        totalTrades,
        hasUnconvertedTrades: unconvertedTrades.length > 0,
        noteType,
        showsBothDirections: Boolean(
          mergedConfig.showLong && mergedConfig.showShort
        ),
      });
      if (emptyMessageKey) {
        return (
          <div className="journalit-reviewv2-chart-empty journalit-reviewv2-chart-empty--small">
            {t(emptyMessageKey)}
          </div>
        );
      }

      const charts = { long: longChart, short: shortChart };

      
      
      return (
        <DirectionalContainer
          {...mergedConfig}
          renderDirection={(direction) => (
            <DirectionalSection
              title={titles[direction]}
              conversion={conversionFor(direction)}
              emptyMessage={t(DIRECTION_EMPTY_KEYS[direction])}
            >
              {charts[direction].totalClosedTrades > 0 && (
                <SharedDrawdownChart
                  data={charts[direction].data}
                  height={mergedConfig.height}
                  minValue={sharedMinValue}
                  maxValue={sharedMaxValue}
                  scale={scale}
                  plugin={plugin}
                  currencyOverride={currencyOverride}
                />
              )}
            </DirectionalSection>
          )}
        />
      );
    }
  );

DirectionalDrawdownWidget.displayName = 'DirectionalDrawdownWidget';
