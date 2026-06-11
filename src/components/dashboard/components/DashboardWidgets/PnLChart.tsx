

import React from 'react';
import { BaseWidget, BaseWidgetProps } from './BaseWidget';
import { SharedPnLChart, preparePnLChartData } from '../../../charts';
import { usePlugin } from '../../../../hooks/usePlugin';


export const PnLChart = React.memo<BaseWidgetProps>(
  ({ filters, dateFormat }) => {
    const plugin = usePlugin();
    const defaultRiskAmount = plugin?.settings?.trade?.defaultRiskAmount;

    return (
      <BaseWidget filters={filters} dateFormat={dateFormat}>
        {(data, userDateFormat) => {
          
          const chartData = preparePnLChartData(
            data.trades,
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
              onPointClick={(_data, _index) => {
                // intentional
              }}
            />
          );
        }}
      </BaseWidget>
    );
  }
);

PnLChart.displayName = 'PnLChart';
