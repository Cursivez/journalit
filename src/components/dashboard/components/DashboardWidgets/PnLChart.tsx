

import React from 'react';
import { BaseWidget, BaseWidgetProps } from './BaseWidget';
import { SharedPnLChart } from '../../../charts/SharedPnLChart';
import { preparePnLChartData } from '../../../../utils/chartUtils';
import { usePlugin } from '../../../../hooks/usePlugin';
import { t } from '../../../../lang/helpers';
import {
  CompareCurveWidget,
  pnlCurves,
} from '../../compare/CompareCurveWidget';


export const PnLChart = React.memo<BaseWidgetProps>(({ dateFormat }) => {
  const plugin = usePlugin();
  const defaultRiskAmount = plugin?.settings?.trade?.defaultRiskAmount;

  return (
    <BaseWidget dateFormat={dateFormat}>
      {(data, userDateFormat, filters, compare) => {
        
        const chartData = preparePnLChartData(
          data.trades,
          userDateFormat,
          defaultRiskAmount,
          plugin
        );

        if (compare) {
          return (
            <CompareCurveWidget
              curves={pnlCurves(
                data.trades.length > 0 ? chartData : [],
                compare.data.trades.length > 0
                  ? preparePnLChartData(
                      compare.data.trades,
                      userDateFormat,
                      defaultRiskAmount,
                      plugin
                    )
                  : [],
                plugin?.settings?.trade?.displayRMultiples ?? false
              )}
              measure="pnl"
              aData={data}
              aFilters={filters}
              bFilters={compare.filters}
              dateFormat={userDateFormat}
              ariaLabel={t('widget.pnlChart.name')}
            />
          );
        }

        
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
});

PnLChart.displayName = 'PnLChart';
