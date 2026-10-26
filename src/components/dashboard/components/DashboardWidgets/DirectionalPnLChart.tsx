

import React from 'react';
import { BaseWidget, BaseWidgetProps } from './BaseWidget';
import { SharedPnLChart } from '../../../charts/SharedPnLChart';
import { preparePnLChartData } from '../../../../utils/chartUtils';
import { usePlugin } from '../../../../hooks/usePlugin';
import { t } from '../../../../lang/helpers';
import { isPnlContributingTrade } from '../../../../utils/tradeStatusUtils';
import type { Trade } from '../../utils/dataUtils';

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
      isPnlContributingTrade(trade) &&
      trade.direction?.toLowerCase() === direction
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
      {(data, userDateFormat) => {
        const directionTrades = getDirectionTrades(data.trades, direction);

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
