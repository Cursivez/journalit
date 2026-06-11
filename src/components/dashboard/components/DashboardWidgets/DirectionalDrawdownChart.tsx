

import React from 'react';
import { BaseWidget, BaseWidgetProps } from './BaseWidget';
import { SharedDrawdownChart } from '../../../charts';
import {
  getDrawdownChartScaleValue,
  prepareDrawdownChartState,
  shouldUseDrawdownPercentScale,
} from '../../../../utils/chartUtils';
import { mapTradesToDisplayPnL } from '../../../../utils/pnlUtils';
import { usePlugin } from '../../../../hooks/usePlugin';
import { t } from '../../../../lang/helpers';
import { resolveDrawdownCapitalBasis } from '../../../../utils/drawdownAnalytics';

interface DirectionalDrawdownChartProps extends BaseWidgetProps {
  showLong?: boolean;
  showShort?: boolean;
  singleDirectionTitle?: string;
  hideInternalTitle?: boolean;
}

const DirectionalDrawdownChartComponent: React.FC<
  DirectionalDrawdownChartProps
> = ({
  filters,
  dateFormat,
  showLong = true,
  showShort = true,
  singleDirectionTitle,
  hideInternalTitle = false,
}) => {
  const plugin = usePlugin();

  return (
    <BaseWidget filters={filters} dateFormat={dateFormat}>
      {(data, userDateFormat) => {
        const defaultRiskAmount = plugin?.settings?.trade?.defaultRiskAmount;
        const applyAccountCountMultiplier = false;

        if (
          data.metrics.isMultiCurrency &&
          !data.metrics.conversionBaseCurrency
        ) {
          return (
            <div className="journalit-dashboard-directional-chart-empty">
              {t('widget.drawdownStats.no-conversion')}
            </div>
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
        const usePercentScale = visibleSeries.every((series) =>
          shouldUseDrawdownPercentScale(series)
        );
        const drawdownValues = visibleSeries.flatMap((series) =>
          series.map((point) =>
            getDrawdownChartScaleValue(point, usePercentScale)
          )
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
