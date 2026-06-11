

import React from 'react';
import { BaseWidget, BaseWidgetProps } from './BaseWidget';
import { SharedPnLChart, preparePnLChartData } from '../../../charts';
import { usePlugin } from '../../../../hooks/usePlugin';
import { t } from '../../../../lang/helpers';
import { isPnlContributingTrade } from '../../../../utils/tradeStatusUtils';

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

const DirectionalPnLChartComponent: React.FC<DirectionalPnLChartProps> = ({
  filters,
  dateFormat,
  direction,
}) => {
  const plugin = usePlugin();
  const defaultRiskAmount = plugin?.settings?.trade?.defaultRiskAmount;

  return (
    <BaseWidget filters={filters} dateFormat={dateFormat}>
      {(data, userDateFormat) => {
        const directionTrades = data.trades.filter(
          (trade) =>
            isPnlContributingTrade(trade) &&
            trade.direction?.toLowerCase() === direction
        );

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
