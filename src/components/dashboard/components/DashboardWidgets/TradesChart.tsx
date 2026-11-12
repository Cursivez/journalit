

import React, { useState } from 'react';
import { DropdownSelect } from '../../../shared/DropdownSelect';
import { BaseWidget, BaseWidgetProps } from './BaseWidget';
import { SharedTradesChart } from '../../../charts/SharedTradesChart';
import {
  getTradeNotePath,
  prepareTradesChartData,
} from '../../../../utils/chartUtils';
import { usePlugin } from '../../../../hooks/usePlugin';
import { t } from '../../../../lang/helpers';
import {
  buildCurrencyConversionMetadata,
  CurrencyConversionInfo,
} from '../../../shared/display/CurrencyConversionInfo';
import type { FilterState } from '../../DashboardView';
import { CompareLegend, CompareTag } from '../../compare/CompareCharts';

type TradesChartPoint = ReturnType<typeof prepareTradesChartData>[number];


const plottedValue = (
  point: TradesChartPoint,
  displayRMultiples: boolean
): number | null => {
  if (!displayRMultiples) return point.pnl;
  return point.rMultiple !== undefined && Number.isFinite(point.rMultiple)
    ? point.rMultiple
    : null;
};


const CompareTradesMultiples: React.FC<{
  a: TradesChartPoint[];
  b: TradesChartPoint[];
  currencyOverride: string | undefined;
  displayRMultiples: boolean;
  aFilters: FilterState;
  bFilters: FilterState;
  onOpenTrade: (path: string) => void;
}> = ({
  a,
  b,
  currencyOverride,
  displayRMultiples,
  aFilters,
  bFilters,
  onOpenTrade,
}) => {
  const values = [...a, ...b].flatMap((point) => {
    const value = plottedValue(point, displayRMultiples);
    return value === null ? [] : [value];
  });
  const minValue = Math.min(0, ...values);
  const maxValue = Math.max(0, ...values);
  return (
    <div className="journalit-compare-multiples">
      {(
        [
          ['a', a],
          ['b', b],
        ] as const
      ).map(([side, points]) => (
        <div key={side} className="journalit-compare-multiples__row">
          <CompareTag side={side} />
          {points.length > 0 ? (
            <SharedTradesChart
              data={points}
              currencyOverride={currencyOverride}
              minValue={minValue}
              maxValue={maxValue}
              className="journalit-compare-multiples__chart"
              onPointClick={(point) => {
                if (point.path) onOpenTrade(point.path);
              }}
            />
          ) : (
            <div className="journalit-compare-multiples__empty">
              {t('dashboard.compare.no-trades')}
            </div>
          )}
        </div>
      ))}
      <CompareLegend aFilters={aFilters} bFilters={bFilters} />
    </div>
  );
};


const TRADE_LIMITS = [25, 50, 75, 100] as const;
type TradeLimit = (typeof TRADE_LIMITS)[number];

const parseTradeLimit = (value: number): TradeLimit | null => {
  switch (value) {
    case 25:
    case 50:
    case 75:
    case 100:
      return value;
    default:
      return null;
  }
};


const TradesChartComponent: React.FC<BaseWidgetProps> = ({ dateFormat }) => {
  const plugin = usePlugin();
  const defaultRiskAmount = plugin?.settings?.trade?.defaultRiskAmount;
  const [selectedLimit, setSelectedLimit] = useState<TradeLimit>(50);

  return (
    <BaseWidget dateFormat={dateFormat} skeletonType="bar-chart">
      {(data, _userDateFormat, filters, compare) => {
        
        const limitedChartData = (source: typeof data) =>
          prepareTradesChartData(source.trades, defaultRiskAmount, plugin)
            .slice(-selectedLimit)
            .map((point, index) => ({ ...point, tradeIndex: index }));
        const chartData = limitedChartData(data);
        const limitedTradePaths = new Set(
          chartData.flatMap((point) =>
            typeof point.path === 'string' ? [point.path] : []
          )
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
                <DropdownSelect
                  variant="button"
                  menuWidth="content"
                  showOptionTooltips={false}
                  ariaLabel={t('widget.tradesChart.name')}
                  value={String(selectedLimit)}
                  options={TRADE_LIMITS.map((limit) => ({
                    value: String(limit),
                    label: t('widget.tradesChart.limit', {
                      count: String(limit),
                    }),
                  }))}
                  onChange={(value) => {
                    const limit = parseTradeLimit(Number(value));
                    if (limit) {
                      setSelectedLimit(limit);
                    }
                  }}
                />
              </div>
            </div>

            
            {compare ? (
              <CompareTradesMultiples
                a={chartData}
                b={limitedChartData(compare.data)}
                currencyOverride={currencyOverride}
                displayRMultiples={Boolean(
                  plugin?.settings?.trade?.displayRMultiples
                )}
                aFilters={filters}
                bFilters={compare.filters}
                onOpenTrade={(path) => {
                  if (plugin) {
                    void plugin.openFile(getTradeNotePath(path), true);
                  }
                }}
              />
            ) : (
              <div className="journalit-dashboard-trades-chart__body">
                <SharedTradesChart
                  data={chartData}
                  currencyOverride={currencyOverride}
                  className="dashboard-trades-chart journalit-dashboard-trades-chart__chart"
                  onPointClick={(point) => {
                    if (plugin && point.path) {
                      void plugin.openFile(getTradeNotePath(point.path), true);
                    }
                  }}
                />
              </div>
            )}
          </div>
        );
      }}
    </BaseWidget>
  );
};


export const TradesChart = React.memo(TradesChartComponent);
