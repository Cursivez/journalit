

import React from 'react';
import { BaseWidget, BaseWidgetProps } from './BaseWidget';
import { SharedDrawdownChart, prepareDrawdownChartData } from '../../../charts';
import { mapTradesToDisplayPnL } from '../../../../utils/pnlUtils';
import { usePlugin } from '../../../../hooks/usePlugin';
import { resolveDrawdownCapitalBasis } from '../../../../utils/drawdownAnalytics';


const DrawdownChartComponent: React.FC<BaseWidgetProps> = ({
  filters,
  dateFormat,
}) => {
  const plugin = usePlugin();

  return (
    <BaseWidget filters={filters} dateFormat={dateFormat}>
      {(data, userDateFormat) => {
        const applyAccountCountMultiplier = false;

        
        const tradesWithDisplayPnL = mapTradesToDisplayPnL(
          data.trades,
          applyAccountCountMultiplier
        );

        
        const currencyOverride = data.metrics.isMultiCurrency
          ? data.metrics.conversionBaseCurrency
          : undefined;
        const capitalBasis = resolveDrawdownCapitalBasis(
          tradesWithDisplayPnL,
          plugin?.settings?.account?.accountMetadata,
          {
            filters,
            displayCurrency:
              currencyOverride ?? plugin?.settings?.general?.currency,
          }
        );
        const drawdownCapitalBasis = data.drawdownCapitalBasis ?? capitalBasis;
        const chartData = prepareDrawdownChartData(
          tradesWithDisplayPnL,
          userDateFormat,
          plugin?.settings?.trade?.defaultRiskAmount,
          'combined',
          plugin,
          undefined,
          drawdownCapitalBasis
        );

        
        return (
          <SharedDrawdownChart
            data={chartData}
            plugin={plugin}
            currencyOverride={currencyOverride}
            
            showTooltip={true}
            tooltipProps={{
              
              wrapperStyle: { zIndex: 1001 }, 
            }}
          />
        );
      }}
    </BaseWidget>
  );
};

DrawdownChartComponent.displayName = 'DrawdownChart';

export const DrawdownChart = React.memo(DrawdownChartComponent);
