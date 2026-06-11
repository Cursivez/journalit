

import React from 'react';
import JournalitPlugin from '../../../main';
import { WeeklyTradesChart } from '../../weekly/charts/WeeklyTradesChart';
import { TradesPreviewData } from '../../../types/reviewV2';
import { useReviewTrades } from '../hooks/useReviewData';
import { SkeletonBox } from '../../shared';
import { t } from '../../../lang/helpers';
import { cssVars } from '../../../styles/inlineStylePolicy';
import { getSingleExplicitCurrency } from '../../../utils/currencyAggregation';
import { CurrencyConversionInfo } from '../../shared/display/CurrencyConversionInfo';

interface TradesScatterWidgetConfig {
  height?: number;
}

const EMPTY_TRADES_SCATTER_CONFIG: TradesScatterWidgetConfig = {};

interface TradesScatterWidgetProps {
  filePath: string;
  plugin: JournalitPlugin;
  config?: TradesScatterWidgetConfig;
  preview?: boolean;
  previewData?: TradesPreviewData;
}

export const TradesScatterWidget: React.FC<TradesScatterWidgetProps> = ({
  filePath,
  plugin,
  config = EMPTY_TRADES_SCATTER_CONFIG,
  preview = false,
  previewData,
}) => {
  
  const {
    trades: cachedTrades,
    loading: cacheLoading,
    currencyConversion,
  } = useReviewTrades(filePath, plugin);

  
  const trades = preview && previewData ? previewData.trades : cachedTrades;
  const loading = preview ? false : cacheLoading;

  const height = config.height ?? 300;

  if (loading) {
    return (
      <div className="journalit-reviewv2-chart-container">
        <div className="journalit-reviewv2-chart-header">
          <div className="journalit-reviewv2-chart-title">
            {t('widget.trades.name')}
          </div>
        </div>
        <div className="journalit-reviewv2-chart-body">
          
          <div
            className="journalit-reviewv2-chart-skeleton"
            style={cssVars({
              '--reviewv2-chart-height': `${height}px`,
              '--reviewv2-chart-bar-gap': '4px',
            })}
          >
            
            <div className="journalit-reviewv2-chart-skeleton-axis">
              <SkeletonBox width={30} height={10} borderRadius="4px" />
              <SkeletonBox width={25} height={10} borderRadius="4px" />
              <SkeletonBox width={28} height={10} borderRadius="4px" />
            </div>
            
            <div className="journalit-reviewv2-chart-skeleton-bars">
              
              <SkeletonBox width={18} height="45%" borderRadius="2px" />
              <SkeletonBox width={18} height="25%" borderRadius="2px" />
              <SkeletonBox width={18} height="60%" borderRadius="2px" />
              <SkeletonBox width={18} height="15%" borderRadius="2px" />
              <SkeletonBox width={18} height="35%" borderRadius="2px" />
              <SkeletonBox width={18} height="50%" borderRadius="2px" />
              <SkeletonBox width={18} height="20%" borderRadius="2px" />
              <SkeletonBox width={18} height="40%" borderRadius="2px" />
              <SkeletonBox width={18} height="30%" borderRadius="2px" />
              <SkeletonBox width={18} height="55%" borderRadius="2px" />
            </div>
            
            <div className="journalit-reviewv2-chart-skeleton-xline" />
            
            <div className="journalit-reviewv2-chart-skeleton-xlabels">
              {Array.from({ length: 5 }).map((_, i) => (
                <SkeletonBox
                  key={i}
                  width={15}
                  height={10}
                  borderRadius="4px"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (trades.length === 0) {
    return (
      <div className="journalit-reviewv2-chart-container">
        <div className="journalit-reviewv2-chart-header">
          <div className="journalit-reviewv2-chart-title">
            {t('widget.trades.name')}
          </div>
        </div>
        <div className="journalit-reviewv2-chart-empty">
          {t('widget.empty.no-trades')}
        </div>
      </div>
    );
  }

  return (
    <div className="journalit-reviewv2-chart-container">
      <div className="journalit-reviewv2-chart-header">
        <div className="journalit-reviewv2-chart-title">
          {t('widget.trades.name')}
          <CurrencyConversionInfo metadata={currencyConversion} />
        </div>
      </div>
      <div className="journalit-reviewv2-chart-body">
        <WeeklyTradesChart
          trades={trades}
          plugin={plugin}
          height={height}
          currencyOverride={getSingleExplicitCurrency(trades)}
        />
      </div>
    </div>
  );
};

export {};
