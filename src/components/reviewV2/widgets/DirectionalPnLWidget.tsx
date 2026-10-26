

import React, { useMemo } from 'react';
import JournalitPlugin from '../../../main';
import { isPnlContributingTrade } from '../../../utils/tradeStatusUtils';
import { SharedPnLChart } from '../../charts/SharedPnLChart';
import type { Trade } from '../../dashboard/utils/dataUtils';
import { preparePnLChartData } from '../../../utils/chartUtils';
import { TradesPreviewData } from '../../../types/reviewV2';
import { useReviewTrades } from '../hooks/useReviewData';
import { t } from '../../../lang/helpers';
import { getSingleExplicitCurrency } from '../../../utils/currencyAggregation';
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

const DIRECTION_TITLE_KEYS = {
  long: 'widget.directional-pnl.title.long',
  short: 'widget.directional-pnl.title.short',
} as const;

const DIRECTION_EMPTY_KEYS = {
  long: 'widget.directional-pnl.empty.no-long',
  short: 'widget.directional-pnl.empty.no-short',
} as const;

const SKELETON_AXIS_WIDTHS = [30, 25, 35] as const;
const SKELETON_LINE_PATH = 'M0,150 Q80,130 160,100 T320,80 T400,50';
const SKELETON_AREA_PATH = `${SKELETON_LINE_PATH} L400,200 L0,200 Z`;


function directionalPnLEmptyKey(
  noteType: string | null | undefined,
  longCount: number,
  shortCount: number
) {
  
  if (noteType === 'drc' && longCount + shortCount < 2) {
    return 'widget.directional-pnl.empty.not-enough' as const;
  }
  if (longCount === 0 && shortCount === 0) {
    return 'widget.directional-pnl.empty.no-closed' as const;
  }
  return null;
}

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

      const currencyOverride = getSingleExplicitCurrency(trades);
      const getDirectionalConversionTrades = (direction: TradeDirection) => [
        ...(direction === 'long' ? longTrades : shortTrades),
        ...asDirectionalTrades(currencyConversion?.unconvertedTrades).filter(
          (trade) => normalizeDirectionValue(trade.direction) === direction
        ),
      ];

      if (loading) {
        return (
          <DirectionalContainer
            {...mergedConfig}
            renderDirection={(direction) => (
              <DirectionalSection title={t(DIRECTION_TITLE_KEYS[direction])}>
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

      const emptyMessageKey = directionalPnLEmptyKey(
        noteType,
        longCount,
        shortCount
      );
      if (emptyMessageKey) {
        return (
          <div className="journalit-reviewv2-chart-empty journalit-reviewv2-chart-empty--small">
            {t(emptyMessageKey)}
          </div>
        );
      }

      const chartDataByDirection = {
        long: longChartData,
        short: shortChartData,
      };

      return (
        <DirectionalContainer
          {...mergedConfig}
          renderDirection={(direction) => {
            const data = chartDataByDirection[direction];
            return (
              <DirectionalSection
                title={t(DIRECTION_TITLE_KEYS[direction])}
                conversion={{
                  metadata: currencyConversion,
                  trades: getDirectionalConversionTrades(direction),
                }}
                emptyMessage={t(DIRECTION_EMPTY_KEYS[direction])}
              >
                {data.length > 0 && (
                  <SharedPnLChart
                    showAccountTooltip={true}
                    data={data}
                    height={mergedConfig.height}
                    plugin={plugin}
                    currencyOverride={currencyOverride}
                  />
                )}
              </DirectionalSection>
            );
          }}
        />
      );
    }
  );

DirectionalPnLWidget.displayName = 'DirectionalPnLWidget';
