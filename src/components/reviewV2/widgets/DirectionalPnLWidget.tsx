

import React, { useMemo } from 'react';
import JournalitPlugin from '../../../main';
import { isPnlContributingTrade } from '../../../utils/tradeStatusUtils';
import { SharedPnLChart } from '../../charts/SharedPnLChart';
import type { Trade } from '../../dashboard/utils/dataUtils';
import { preparePnLChartData } from '../../../utils/chartUtils';
import { TradesPreviewData } from '../../../types/reviewV2';
import { useReviewTrades } from '../hooks/useReviewData';
import { SkeletonBox } from '../../shared';
import { t } from '../../../lang/helpers';
import { cssVars } from '../../../styles/inlineStylePolicy';
import { getSingleExplicitCurrency } from '../../../utils/currencyAggregation';
import { CurrencyConversionInfo } from '../../shared/display/CurrencyConversionInfo';

const asDirectionalTrades = (value: unknown): Trade[] =>
  Array.isArray(value)
    ? value.filter((item): item is Trade =>
        Boolean(item && typeof item === 'object' && !Array.isArray(item))
      )
    : [];

const normalizeDirectionValue = (value: unknown): string =>
  typeof value === 'string' ? value.toLowerCase() : '';

interface DirectionalPnLWidgetProps {
  filePath: string;
  plugin: JournalitPlugin;
  config?: DirectionalPnLWidgetConfig;
  preview?: boolean;
  previewData?: TradesPreviewData;
}

export interface DirectionalPnLWidgetConfig {
  showLong?: boolean; 
  showShort?: boolean; 
  height?: number; 
  layout?: 'stacked' | 'side-by-side'; 
}

const DEFAULT_CONFIG: DirectionalPnLWidgetConfig = {
  showLong: true,
  showShort: true,
  height: 250,
  layout: 'stacked',
};

export const DirectionalPnLWidget: React.FC<DirectionalPnLWidgetProps> =
  React.memo(
    ({ filePath, plugin, config = {}, preview = false, previewData }) => {
      const mergedConfig = { ...DEFAULT_CONFIG, ...config };

      
      const {
        trades: cachedTrades,
        loading: cacheLoading,
        noteType,
        currencyConversion,
      } = useReviewTrades(filePath, plugin);

      
      const trades = asDirectionalTrades(
        preview && previewData ? previewData.trades : cachedTrades
      );
      const loading = preview ? false : cacheLoading;

      
      const userDateFormat = plugin?.settings?.trade?.dateFormat || 'DDMMYY';
      const defaultRiskAmount = plugin?.settings?.trade?.defaultRiskAmount;

      
      const {
        longChartData,
        shortChartData,
        longCount,
        shortCount,
        longTrades,
        shortTrades,
      } = useMemo(() => {
        const pnlContributingTrades = trades.filter((t) =>
          isPnlContributingTrade(t)
        );

        const longTrades = pnlContributingTrades.filter(
          (t) => t.direction?.toLowerCase() === 'long'
        );
        const shortTrades = pnlContributingTrades.filter(
          (t) => t.direction?.toLowerCase() === 'short'
        );

        
        const longData =
          longTrades.length > 0
            ? preparePnLChartData(
                longTrades,
                userDateFormat,
                defaultRiskAmount,
                plugin
              )
            : [];
        const shortData =
          shortTrades.length > 0
            ? preparePnLChartData(
                shortTrades,
                userDateFormat,
                defaultRiskAmount,
                plugin
              )
            : [];

        return {
          longChartData: longData,
          shortChartData: shortData,
          longCount: longTrades.length,
          shortCount: shortTrades.length,
          longTrades,
          shortTrades,
        };
      }, [trades, userDateFormat, defaultRiskAmount, plugin]);

      const containerClassName =
        mergedConfig.layout === 'side-by-side'
          ? 'journalit-reviewv2-directional-container journalit-reviewv2-directional-container--row'
          : 'journalit-reviewv2-directional-container journalit-reviewv2-directional-container--column';
      const currencyOverride = getSingleExplicitCurrency(trades);
      const getDirectionalConversionTrades = (direction: 'long' | 'short') => [
        ...(direction === 'long' ? longTrades : shortTrades),
        ...asDirectionalTrades(currencyConversion?.unconvertedTrades).filter(
          (trade) => normalizeDirectionValue(trade.direction) === direction
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
                  <SkeletonBox width={30} height={10} borderRadius="4px" />
                  <SkeletonBox width={25} height={10} borderRadius="4px" />
                  <SkeletonBox width={35} height={10} borderRadius="4px" />
                </div>
                
                <div className="journalit-reviewv2-chart-skeleton-wave journalit-reviewv2-chart-skeleton-wave--wide">
                  <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 400 200"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0,150 Q80,130 160,100 T320,80 T400,50 L400,200 L0,200 Z"
                      fill="var(--background-modifier-border)"
                      className="skeleton-shimmer journalit-reviewv2-chart-skeleton-wave-fill"
                    />
                    <path
                      d="M0,150 Q80,130 160,100 T320,80 T400,50"
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
            {mergedConfig.showLong && (
              <ChartSkeleton title={t('widget.directional-pnl.title.long')} />
            )}
            {mergedConfig.showShort && (
              <ChartSkeleton title={t('widget.directional-pnl.title.short')} />
            )}
          </div>
        );
      }

      
      if (noteType === 'drc') {
        
        const totalTrades = longCount + shortCount;
        if (totalTrades < 2) {
          return (
            <div className="journalit-reviewv2-chart-empty journalit-reviewv2-chart-empty--small">
              {t('widget.directional-pnl.empty.not-enough')}
            </div>
          );
        }
      }

      
      if (longCount === 0 && shortCount === 0) {
        return (
          <div className="journalit-reviewv2-chart-empty journalit-reviewv2-chart-empty--small">
            {t('widget.directional-pnl.empty.no-closed')}
          </div>
        );
      }

      return (
        <div className={containerClassName}>
          {mergedConfig.showLong && (
            <div className="journalit-reviewv2-directional-section">
              <div className="journalit-reviewv2-chart-header">
                <div className="journalit-reviewv2-chart-title">
                  {t('widget.directional-pnl.title.long')}
                  <CurrencyConversionInfo
                    metadata={currencyConversion}
                    trades={getDirectionalConversionTrades('long')}
                  />
                </div>
              </div>
              {longChartData.length > 0 ? (
                <div className="journalit-reviewv2-chart-body">
                  <SharedPnLChart
                    showAccountTooltip={true}
                    data={longChartData}
                    height={mergedConfig.height}
                    plugin={plugin}
                    currencyOverride={currencyOverride}
                  />
                </div>
              ) : (
                <div className="journalit-reviewv2-chart-empty journalit-reviewv2-chart-empty--small">
                  {t('widget.directional-pnl.empty.no-long')}
                </div>
              )}
            </div>
          )}

          {mergedConfig.showShort && (
            <div className="journalit-reviewv2-directional-section">
              <div className="journalit-reviewv2-chart-header">
                <div className="journalit-reviewv2-chart-title">
                  {t('widget.directional-pnl.title.short')}
                  <CurrencyConversionInfo
                    metadata={currencyConversion}
                    trades={getDirectionalConversionTrades('short')}
                  />
                </div>
              </div>
              {shortChartData.length > 0 ? (
                <div className="journalit-reviewv2-chart-body">
                  <SharedPnLChart
                    showAccountTooltip={true}
                    data={shortChartData}
                    height={mergedConfig.height}
                    plugin={plugin}
                    currencyOverride={currencyOverride}
                  />
                </div>
              ) : (
                <div className="journalit-reviewv2-chart-empty journalit-reviewv2-chart-empty--small">
                  {t('widget.directional-pnl.empty.no-short')}
                </div>
              )}
            </div>
          )}
        </div>
      );
    }
  );

DirectionalPnLWidget.displayName = 'DirectionalPnLWidget';
