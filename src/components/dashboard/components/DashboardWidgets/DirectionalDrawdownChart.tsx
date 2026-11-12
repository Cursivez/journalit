

import React from 'react';
import { BaseWidget, BaseWidgetProps } from './BaseWidget';
import { SharedDrawdownChart } from '../../../charts/SharedDrawdownChart';
import {
  getDrawdownChartPlotValue,
  prepareDrawdownChartState,
  getDrawdownChartScale,
} from '../../../../utils/chartUtils';
import { mapTradesToDisplayPnL } from '../../../../utils/pnlUtils';
import { usePlugin } from '../../../../hooks/usePlugin';
import { t } from '../../../../lang/helpers';
import { resolveDrawdownCapitalBasis } from '../../../../utils/drawdownAnalytics';
import type { FilterState } from '../../DashboardView';
import type { DashboardData } from '../../utils/dataUtils';
import type JournalitPlugin from '../../../../main';
import {
  CompareCurveWidget,
  drawdownCurves,
} from '../../compare/CompareCurveWidget';


const directionalDrawdownState = (
  data: DashboardData,
  filters: FilterState,
  dateFormat: string,
  direction: 'long' | 'short',
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
  return prepareDrawdownChartState(
    tradesWithDisplayPnL,
    dateFormat,
    plugin?.settings?.trade?.defaultRiskAmount,
    direction,
    plugin,
    undefined,
    drawdownCapitalBasis
  );
};

interface DirectionalDrawdownChartProps extends BaseWidgetProps {
  showLong?: boolean;
  showShort?: boolean;
  singleDirectionTitle?: string;
  hideInternalTitle?: boolean;
}

const DirectionalDrawdownChartComponent: React.FC<
  DirectionalDrawdownChartProps
> = ({
  dateFormat,
  showLong = true,
  showShort = true,
  singleDirectionTitle,
  hideInternalTitle = false,
}) => {
  const plugin = usePlugin();

  return (
    <BaseWidget dateFormat={dateFormat}>
      {(data, userDateFormat, filters, compare) => {
        const defaultRiskAmount = plugin?.settings?.trade?.defaultRiskAmount;
        const applyAccountCountMultiplier = false;

        if (
          (data.metrics.isMultiCurrency &&
            !data.metrics.conversionBaseCurrency) ||
          (compare?.data.metrics.isMultiCurrency &&
            !compare.data.metrics.conversionBaseCurrency)
        ) {
          return (
            <div className="journalit-dashboard-directional-chart-empty">
              {t('widget.drawdownStats.no-conversion')}
            </div>
          );
        }

        
        
        const compareDirection =
          showLong && !showShort
            ? 'long'
            : !showLong && showShort
              ? 'short'
              : null;
        if (compare && compareDirection) {
          const aChart = directionalDrawdownState(
            data,
            filters,
            userDateFormat,
            compareDirection,
            plugin
          );
          const bChart = directionalDrawdownState(
            compare.data,
            compare.filters,
            userDateFormat,
            compareDirection,
            plugin
          );
          if (aChart.totalClosedTrades + bChart.totalClosedTrades === 0) {
            return (
              <div className="journalit-dashboard-directional-chart-empty">
                {t(
                  compareDirection === 'long'
                    ? 'widget.directional-drawdown.empty.no-long'
                    : 'widget.directional-drawdown.empty.no-short'
                )}
              </div>
            );
          }
          return (
            <CompareCurveWidget
              curves={drawdownCurves(
                aChart.totalClosedTrades > 0 ? aChart.data : [],
                bChart.totalClosedTrades > 0 ? bChart.data : [],
                plugin?.settings?.trade?.displayRMultiples ?? false
              )}
              measure="drawdown"
              aData={data}
              aFilters={filters}
              bFilters={compare.filters}
              dateFormat={userDateFormat}
              ariaLabel={singleDirectionTitle ?? ''}
            />
          );
        }

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

        const longChart = prepareDrawdownChartState(
          tradesWithDisplayPnL,
          userDateFormat,
          defaultRiskAmount,
          'long',
          plugin,
          undefined,
          drawdownCapitalBasis
        );
        const shortChart = prepareDrawdownChartState(
          tradesWithDisplayPnL,
          userDateFormat,
          defaultRiskAmount,
          'short',
          plugin,
          undefined,
          drawdownCapitalBasis
        );

        const visibleSeries = [
          ...(showLong && longChart.totalClosedTrades > 0
            ? [longChart.data]
            : []),
          ...(showShort && shortChart.totalClosedTrades > 0
            ? [shortChart.data]
            : []),
        ];
        
        const scale = getDrawdownChartScale(
          visibleSeries,
          plugin?.settings?.trade?.displayRMultiples ?? false
        );
        const drawdownValues = visibleSeries.flatMap((series) =>
          series.map((point) => getDrawdownChartPlotValue(point, scale))
        );
        const sharedMinValue =
          drawdownValues.length > 0 ? Math.min(...drawdownValues) : undefined;
        const sharedMaxValue =
          drawdownValues.length > 0 ? Math.max(...drawdownValues) : undefined;

        const singleVisibleDirection =
          showLong && !showShort
            ? 'long'
            : !showLong && showShort
              ? 'short'
              : null;
        const longTitle =
          singleVisibleDirection === 'long' && singleDirectionTitle
            ? singleDirectionTitle
            : t('widget.directional-drawdown.title.long');
        const shortTitle =
          singleVisibleDirection === 'short' && singleDirectionTitle
            ? singleDirectionTitle
            : t('widget.directional-drawdown.title.short');

        if (
          (!showLong || longChart.totalClosedTrades === 0) &&
          (!showShort || shortChart.totalClosedTrades === 0)
        ) {
          return (
            <div className="journalit-dashboard-directional-chart-empty">
              {showLong && !showShort
                ? t('widget.directional-drawdown.empty.no-long')
                : !showLong && showShort
                  ? t('widget.directional-drawdown.empty.no-short')
                  : t('widget.directional-drawdown.empty.no-closed')}
            </div>
          );
        }

        return (
          <div className="journalit-dashboard-directional-chart-container">
            {showLong && (
              <div className="journalit-dashboard-directional-chart-section">
                {!hideInternalTitle && (
                  <div className="journalit-dashboard-directional-chart-title">
                    {longTitle}
                  </div>
                )}
                {longChart.totalClosedTrades > 0 ? (
                  <div className="journalit-dashboard-directional-chart-body">
                    <SharedDrawdownChart
                      data={longChart.data}
                      plugin={plugin}
                      currencyOverride={currencyOverride}
                      minValue={sharedMinValue}
                      maxValue={sharedMaxValue}
                      scale={scale}
                      tooltipProps={{
                        wrapperStyle: { zIndex: 1001 },
                      }}
                    />
                  </div>
                ) : (
                  <div className="journalit-dashboard-directional-chart-empty">
                    {t('widget.directional-drawdown.empty.no-long')}
                  </div>
                )}
              </div>
            )}

            {showShort && (
              <div className="journalit-dashboard-directional-chart-section">
                {!hideInternalTitle && (
                  <div className="journalit-dashboard-directional-chart-title">
                    {shortTitle}
                  </div>
                )}
                {shortChart.totalClosedTrades > 0 ? (
                  <div className="journalit-dashboard-directional-chart-body">
                    <SharedDrawdownChart
                      data={shortChart.data}
                      plugin={plugin}
                      currencyOverride={currencyOverride}
                      minValue={sharedMinValue}
                      maxValue={sharedMaxValue}
                      scale={scale}
                      tooltipProps={{
                        wrapperStyle: { zIndex: 1001 },
                      }}
                    />
                  </div>
                ) : (
                  <div className="journalit-dashboard-directional-chart-empty">
                    {t('widget.directional-drawdown.empty.no-short')}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      }}
    </BaseWidget>
  );
};

DirectionalDrawdownChartComponent.displayName = 'DirectionalDrawdownChart';

export const DirectionalDrawdownChart = React.memo(
  DirectionalDrawdownChartComponent
);
