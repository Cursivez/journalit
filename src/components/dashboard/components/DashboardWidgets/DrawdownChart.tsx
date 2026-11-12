

import React from 'react';
import { BaseWidget, BaseWidgetProps } from './BaseWidget';
import { SharedDrawdownChart } from '../../../charts/SharedDrawdownChart';
import { prepareDrawdownChartData } from '../../../../utils/chartUtils';
import { mapTradesToDisplayPnL } from '../../../../utils/pnlUtils';
import { usePlugin } from '../../../../hooks/usePlugin';
import { resolveDrawdownCapitalBasis } from '../../../../utils/drawdownAnalytics';
import { t } from '../../../../lang/helpers';
import type { FilterState } from '../../DashboardView';
import type { DashboardData } from '../../utils/dataUtils';
import type JournalitPlugin from '../../../../main';
import {
  CompareCurveWidget,
  drawdownCurves,
} from '../../compare/CompareCurveWidget';


const drawdownChartData = (
  data: DashboardData,
  filters: FilterState,
  dateFormat: string,
  plugin: JournalitPlugin | null
) => {
  const tradesWithDisplayPnL = mapTradesToDisplayPnL(data.trades, false);
  const currencyOverride = data.metrics.isMultiCurrency
    ? data.metrics.conversionBaseCurrency
    : undefined;
  const drawdownCapitalBasis =
    data.drawdownCapitalBasis ??
    resolveDrawdownCapitalBasis(
      tradesWithDisplayPnL,
      plugin?.settings?.account?.accountMetadata,
      {
        filters,
        displayCurrency:
          currencyOverride ?? plugin?.settings?.general?.currency,
      }
    );
  return prepareDrawdownChartData(
    tradesWithDisplayPnL,
    dateFormat,
    plugin?.settings?.trade?.defaultRiskAmount,
    'combined',
    plugin,
    undefined,
    drawdownCapitalBasis
  );
};


const DrawdownChartComponent: React.FC<BaseWidgetProps> = ({ dateFormat }) => {
  const plugin = usePlugin();

  return (
    <BaseWidget dateFormat={dateFormat}>
      {(data, userDateFormat, filters, compare) => {
        if (compare) {
          return (
            <CompareCurveWidget
              curves={drawdownCurves(
                data.trades.length > 0
                  ? drawdownChartData(data, filters, userDateFormat, plugin)
                  : [],
                compare.data.trades.length > 0
                  ? drawdownChartData(
                      compare.data,
                      compare.filters,
                      userDateFormat,
                      plugin
                    )
                  : [],
                plugin?.settings?.trade?.displayRMultiples ?? false
              )}
              measure="drawdown"
              aData={data}
              aFilters={filters}
              bFilters={compare.filters}
              dateFormat={userDateFormat}
              ariaLabel={t('widget.drawdownChart.name')}
            />
          );
        }
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
