

import React, { useState } from 'react';
import { BaseWidget, BaseWidgetProps } from './BaseWidget';
import { SharedTradesChart, prepareTradesChartData } from '../../../charts';
import { usePlugin } from '../../../../hooks/usePlugin';
import { t } from '../../../../lang/helpers';
import {
  buildCurrencyConversionMetadata,
  CurrencyConversionInfo,
} from '../../../shared/display/CurrencyConversionInfo';


const TRADE_LIMITS = [25, 50, 75, 100] as const;
type TradeLimit = (typeof TRADE_LIMITS)[number];


export const TradesChart: React.FC<BaseWidgetProps> = ({
  filters,
  dateFormat,
}) => {
  const plugin = usePlugin();
  const defaultRiskAmount = plugin?.settings?.trade?.defaultRiskAmount;
  const [selectedLimit, setSelectedLimit] = useState<TradeLimit>(50);

  return (
    <BaseWidget
      filters={filters}
      dateFormat={dateFormat}
      skeletonType="bar-chart"
    >
      {(data, _userDateFormat) => {
        
        const allChartData = prepareTradesChartData(
          data.trades,
          defaultRiskAmount,
          plugin
        );
        const limitedData = allChartData.slice(-selectedLimit);
        const chartData = limitedData.map((point, _index) => ({
          ...point,
          tradeIndex: _index,
        }));
        const limitedTradePaths = new Set(
          limitedData
            .map((point) => point.path)
            .filter((path): path is string => typeof path === 'string')
        );
        const conversionTrades = limitedTradePaths.size
          ? data.trades.filter(
              (trade) =>
                typeof trade.path === 'string' &&
                limitedTradePaths.has(trade.path)
            )
          : data.trades.slice(-selectedLimit);

        
        const currencyOverride = data.metrics.isMultiCurrency
          ? data.metrics.conversionBaseCurrency
          : undefined;

        return (
          <div className="journalit-dashboard-trades-chart">
            
            <div className="journalit-dashboard-trades-chart__header">
              <div className="journalit-dashboard-trades-chart__title">
                {t('widget.tradesChart.name')}
                <CurrencyConversionInfo
                  metadata={buildCurrencyConversionMetadata(data.metrics)}
                  trades={conversionTrades}
                />
              </div>
              <div className="journalit-dashboard-trades-chart__selector">
                <select
                  value={selectedLimit}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (TRADE_LIMITS.includes(value as TradeLimit)) {
                      setSelectedLimit(value as TradeLimit);
                    }
                  }}
                  className="journalit-dashboard-trades-chart__select"
                >
                  {TRADE_LIMITS.map((limit) => (
                    <option key={limit} value={limit}>
                      {t('widget.tradesChart.limit', { count: String(limit) })}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            
            <div className="journalit-dashboard-trades-chart__body">
              <SharedTradesChart
                data={chartData}
                currencyOverride={currencyOverride}
                className="dashboard-trades-chart journalit-dashboard-trades-chart__chart"
              />
            </div>
          </div>
        );
      }}
    </BaseWidget>
  );
};
