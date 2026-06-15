

import React from 'react';
import { SharedDrawdownChart } from '../../charts/SharedDrawdownChart';
import type { Trade } from '../../dashboard/utils/dataUtils';
import { prepareDrawdownChartState } from '../../../utils/chartUtils';
import { mapTradesToDisplayPnL } from '../../../utils/pnlUtils';
import JournalitPlugin from '../../../main';
import { TradesPreviewData } from '../../../types/reviewV2';
import { useReviewTrades } from '../hooks/useReviewData';
import { useAccountCapitalBasisLookup } from '../hooks/useAccountCapitalBasisLookup';
import { SkeletonBox } from '../../shared';
import { t } from '../../../lang/helpers';
import { cssVars } from '../../../styles/inlineStylePolicy';
import { getSingleExplicitCurrency } from '../../../utils/currencyAggregation';
import { CurrencyConversionInfo } from '../../shared/display/CurrencyConversionInfo';
import { getReviewAnalyticsDateBasis } from '../utils/reviewTradeDates';
import { resolveDrawdownCapitalBasis } from '../../../utils/drawdownAnalytics';

const asDrawdownTrades = (value: unknown): Trade[] =>
  Array.isArray(value)
    ? value.filter((item): item is Trade =>
        Boolean(item && typeof item === 'object' && !Array.isArray(item))
      )
    : [];

interface DrawdownChartWidgetProps {
  filePath: string;
  plugin: JournalitPlugin;
  config?: DrawdownChartWidgetConfig;
  preview?: boolean;
  previewData?: TradesPreviewData;
}

interface DrawdownChartWidgetConfig {
  height?: number;
}

const DEFAULT_CONFIG: DrawdownChartWidgetConfig = {
  height: 250,
};

export const DrawdownChartWidget: React.FC<DrawdownChartWidgetProps> =
  React.memo(({ filePath, plugin, config = {}, preview, previewData }) => {
    const mergedConfig = { ...DEFAULT_CONFIG, ...config };

    
    const {
      trades: cachedTrades,
      loading: cacheLoading,
      currencyConversion,
      filters,
      dateRange,
    } = useReviewTrades(filePath, plugin);

    
    const trades = asDrawdownTrades(
      preview && previewData ? previewData.trades : cachedTrades
    );
    const loading = preview ? false : cacheLoading;

    
    const dateFormat = plugin?.settings?.trade?.dateFormat || 'DDMMYY';
    const defaultRiskAmount = plugin?.settings?.trade?.defaultRiskAmount;
    const applyAccountCountMultiplier = false;
    const analyticsDateBasis = getReviewAnalyticsDateBasis(plugin);
    const accountCapitalByLookupKey = useAccountCapitalBasisLookup(
      plugin,
      !preview
    );

    const drawdownChart = React.useMemo(() => {
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
        {
          filters: dateRange
            ? { ...filters, dateRange: [dateRange.start, dateRange.end] }
            : filters,
          displayCurrency,
          accountCapitalByLookupKey,
        }
      );
      return prepareDrawdownChartState(
        tradesWithDisplayPnL,
        dateFormat,
        defaultRiskAmount,
        'combined',
        plugin,
        analyticsDateBasis,
        capitalBasis
      );
    }, [
      trades,
      dateFormat,
      defaultRiskAmount,
      applyAccountCountMultiplier,
      plugin,
      analyticsDateBasis,
      filters,
      dateRange,
      accountCapitalByLookupKey,
      currencyConversion?.conversionBaseCurrency,
    ]);

    const chartData =
      drawdownChart.totalClosedTrades > 0 ? drawdownChart.data : [];

    if (loading) {
      return (
        <div className="journalit-reviewv2-chart-container">
          <div className="journalit-reviewv2-chart-header">
            <div className="journalit-reviewv2-chart-title">
              {t('widget.drawdown-chart.name')}
            </div>
          </div>
          <div className="journalit-reviewv2-chart-body">
            
            <div
              className="journalit-reviewv2-chart-skeleton"
              role="status"
              aria-label={t('chart.loading')}
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
              
              <div className="journalit-reviewv2-chart-skeleton-wave">
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
              
              <div className="journalit-reviewv2-chart-skeleton-xlabels journalit-reviewv2-chart-skeleton-xlabels--between">
                <SkeletonBox width={20} height={10} borderRadius="4px" />
                <SkeletonBox width={20} height={10} borderRadius="4px" />
                <SkeletonBox width={20} height={10} borderRadius="4px" />
                <SkeletonBox width={20} height={10} borderRadius="4px" />
                <SkeletonBox width={20} height={10} borderRadius="4px" />
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (chartData.length === 0) {
      return (
        <div className="journalit-reviewv2-chart-container">
          <div className="journalit-reviewv2-chart-header">
            <div className="journalit-reviewv2-chart-title">
              {t('widget.drawdown-chart.name')}
            </div>
          </div>
          <div className="journalit-reviewv2-chart-empty">
            {t('widget.empty.no-closed-trades')}
          </div>
        </div>
      );
    }

    return (
      <div className="journalit-reviewv2-chart-container">
        <div className="journalit-reviewv2-chart-header">
          <div className="journalit-reviewv2-chart-title">
            {t('widget.drawdown-chart.name')}
            <CurrencyConversionInfo metadata={currencyConversion} />
          </div>
        </div>
        <div className="journalit-reviewv2-chart-body">
          <SharedDrawdownChart
            data={chartData}
            plugin={plugin}
            height={mergedConfig.height}
            currencyOverride={getSingleExplicitCurrency(trades)}
          />
        </div>
      </div>
    );
  });

DrawdownChartWidget.displayName = 'DrawdownChartWidget';
