

import React from 'react';
import { BaseWidget, BaseWidgetProps } from './BaseWidget';
import { SharedPnLChart } from '../../../charts/SharedPnLChart';
import { preparePnLChartData } from '../../../../utils/chartUtils';
import { usePlugin } from '../../../../hooks/usePlugin';
import { t } from '../../../../lang/helpers';
import { isPnlContributingTrade } from '../../../../utils/tradeStatusUtils';
import { getTradeMarketSide } from '../../../../services/trade/core/TradeDirection';
import type { Trade } from '../../utils/dataUtils';
import {
  CompareCurveWidget,
  pnlCurves,
} from '../../compare/CompareCurveWidget';

interface DirectionalPnLChartProps extends BaseWidgetProps {
  direction: 'long' | 'short';
}

const directionTranslationKeys = {
  long: {
    empty: 'widget.directional-pnl.empty.no-long',
  },
  short: {
    empty: 'widget.directional-pnl.empty.no-short',
  },
} as const;


const directionTradesByList = new WeakMap<
  readonly Trade[],
  Partial<Record<'long' | 'short', Trade[]>>
>();

function getDirectionTrades(
  trades: Trade[],
  direction: 'long' | 'short'
): Trade[] {
  let byDirection = directionTradesByList.get(trades);
  if (!byDirection) {
    byDirection = {};
    directionTradesByList.set(trades, byDirection);
  }
  return (byDirection[direction] ??= trades.filter(
    (trade) =>
      isPnlContributingTrade(trade) && getTradeMarketSide(trade) === direction
  ));
}

const DirectionalPnLChartComponent: React.FC<DirectionalPnLChartProps> = ({
  dateFormat,
  direction,
}) => {
  const plugin = usePlugin();
  const defaultRiskAmount = plugin?.settings?.trade?.defaultRiskAmount;

  return (
    <BaseWidget dateFormat={dateFormat}>
      {(data, userDateFormat, filters, compare) => {
        const directionTrades = getDirectionTrades(data.trades, direction);

        if (compare) {
          const compareTrades = getDirectionTrades(
            compare.data.trades,
            direction
          );
          if (directionTrades.length + compareTrades.length === 0) {
            return (
              <div className="journalit-dashboard-directional-chart-empty">
                {t(directionTranslationKeys[direction].empty)}
              </div>
            );
          }
          const curve = (trades: Trade[]) =>
            trades.length > 0
              ? preparePnLChartData(
                  trades,
                  userDateFormat,
                  defaultRiskAmount,
                  plugin
                )
              : [];
          return (
            <CompareCurveWidget
              curves={pnlCurves(
                curve(directionTrades),
                curve(compareTrades),
                plugin?.settings?.trade?.displayRMultiples ?? false
              )}
              measure="pnl"
              aData={data}
              aFilters={filters}
              bFilters={compare.filters}
              dateFormat={userDateFormat}
              ariaLabel={t(
                direction === 'long'
                  ? 'widget.longPnLChart.name'
                  : 'widget.shortPnLChart.name'
              )}
            />
          );
        }

        if (directionTrades.length === 0) {
          return (
            <div className="journalit-dashboard-directional-chart-empty">
              {t(directionTranslationKeys[direction].empty)}
            </div>
          );
        }

        const chartData = preparePnLChartData(
          directionTrades,
          userDateFormat,
          defaultRiskAmount,
          plugin
        );

        const currencyOverride = data.metrics.isMultiCurrency
          ? data.metrics.conversionBaseCurrency
          : undefined;

        return (
          <SharedPnLChart
            data={chartData}
            plugin={plugin}
            currencyOverride={currencyOverride}
          />
        );
      }}
    </BaseWidget>
  );
};

DirectionalPnLChartComponent.displayName = 'DirectionalPnLChart';

export const DirectionalPnLChart = React.memo(DirectionalPnLChartComponent);
