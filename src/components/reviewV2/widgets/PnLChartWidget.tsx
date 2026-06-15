

import React, { useMemo } from 'react';
import { isPnlContributingTrade } from '../../../utils/tradeStatusUtils';
import JournalitPlugin from '../../../main';
import { SharedPnLChart } from '../../charts';
import type { Trade } from '../../dashboard/utils/dataUtils';
import { preparePnLChartData } from '../../../utils/chartUtils';
import { getSingleExplicitCurrency } from '../../../utils/currencyAggregation';
import { TradesPreviewData } from '../../../types/reviewV2';
import { useReviewTrades } from '../hooks/useReviewData';
import { SkeletonBox } from '../../shared';
import { t } from '../../../lang/helpers';
import { cssVars } from '../../../styles/inlineStylePolicy';
import { CurrencyConversionInfo } from '../../shared/display/CurrencyConversionInfo';

const asPnLTrades = (value: unknown): Trade[] =>
  Array.isArray(value)
    ? value.filter((item): item is Trade =>
        Boolean(item && typeof item === 'object' && !Array.isArray(item))
      )
    : [];

interface PnLChartWidgetProps {
  filePath: string;
  plugin: JournalitPlugin;
  config?: PnLChartWidgetConfig;
  preview?: boolean;
  previewData?: TradesPreviewData;
}

interface PnLChartWidgetConfig {
  height?: number;
}

const DEFAULT_CONFIG: PnLChartWidgetConfig = {
  height: 250,
};

export const PnLChartWidget: React.FC<PnLChartWidgetProps> = React.memo(
  ({ filePath, plugin, config = {}, preview, previewData }) => {
    const mergedConfig = { ...DEFAULT_CONFIG, ...config };

    
    const {
      trades: cachedTrades,
      loading: cacheLoading,
      currencyConversion,
    } = useReviewTrades(filePath, plugin);

    
    const trades = asPnLTrades(
      preview && previewData ? previewData.trades : cachedTrades
    );
    const loading = preview ? false : cacheLoading;

    
    
    const { chartData, currencyOverride } = useMemo(() => {
      const pnlContributingTrades = trades.filter((t) =>
        isPnlContributingTrade(t)
      );

      if (pnlContributingTrades.length === 0) {
        return { chartData: [], currencyOverride: undefined };
      }

      const dateFormat = plugin?.settings?.trade?.dateFormat || 'DDMMYY';
      const defaultRiskAmount = plugin?.settings?.trade?.defaultRiskAmount;
      return {
        chartData: preparePnLChartData(
          pnlContributingTrades,
          dateFormat,
          defaultRiskAmount,
          plugin
        ),
        currencyOverride: getSingleExplicitCurrency(pnlContributingTrades),
      };
    }, [trades, plugin]);

    if (loading) {
      return (
        <div className="journalit-reviewv2-chart-container">
          <div className="journalit-reviewv2-chart-header">
            <div className="journalit-reviewv2-chart-title">
              {t('widget.pnl-chart.name')}
            </div>
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
                <SkeletonBox width={30} height={10} borderRadius="4px" />
                <SkeletonBox width={25} height={10} borderRadius="4px" />
                <SkeletonBox width={35} height={10} borderRadius="4px" />
                <SkeletonBox width={28} height={10} borderRadius="4px" />
              </div>
              
              <div className="journalit-reviewv2-chart-skeleton-wave journalit-reviewv2-chart-skeleton-wave--wide">
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 400 200"
                  preserveAspectRatio="none"
                >
                  
                  <path
                    d="M0,180 Q50,160 100,140 T200,100 T300,80 T400,60 L400,200 L0,200 Z"
                    fill="var(--background-modifier-border)"
                    className="skeleton-shimmer journalit-reviewv2-chart-skeleton-wave-fill"
                  />
                  
                  <path
                    d="M0,180 Q50,160 100,140 T200,100 T300,80 T400,60"
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
              {t('widget.pnl-chart.name')}
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
            {t('widget.pnl-chart.name')}
            <CurrencyConversionInfo metadata={currencyConversion} />
          </div>
        </div>
        <div className="journalit-reviewv2-chart-body">
          <SharedPnLChart
            data={chartData}
            plugin={plugin}
            showAccountTooltip={true}
            height={mergedConfig.height || 250}
            currencyOverride={currencyOverride}
          />
        </div>
      </div>
    );
  }
);

PnLChartWidget.displayName = 'PnLChartWidget';
