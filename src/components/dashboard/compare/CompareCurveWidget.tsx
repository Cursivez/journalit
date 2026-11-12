

import React from 'react';
import { useDisplayFormatter } from '../../../hooks/useDisplayPolicy';
import {
  type DrawdownChartDataPoint,
  type PnLChartDataPoint,
  getDrawdownChartPlotValue,
  getDrawdownChartScale,
} from '../../../utils/chartUtils';
import type { DashboardData } from '../utils/dataUtils';
import type { FilterState } from '../dashboardTypes';
import {
  CompareCurveChart,
  type CompareCurvePoint,
  CompareLegend,
} from './CompareCharts';


export const widgetCurrency = (data: DashboardData): string =>
  (data.metrics.isMultiCurrency
    ? data.metrics.conversionBaseCurrency
    : undefined) ?? data.currency;


type CompareCurveUnit = 'money' | 'r' | 'percent';

export interface CompareCurves {
  a: CompareCurvePoint[];
  b: CompareCurvePoint[];
  unit: CompareCurveUnit;
}

const timed = <T extends { time?: number }>(
  points: readonly T[],
  value: (point: T) => number | undefined
): CompareCurvePoint[] =>
  points.flatMap((point) => {
    const y = value(point);
    return point.time === undefined || y === undefined || !Number.isFinite(y)
      ? []
      : [{ x: point.time, y }];
  });


export const pnlCurves = (
  a: readonly PnLChartDataPoint[],
  b: readonly PnLChartDataPoint[],
  displayRMultiples: boolean
): CompareCurves => {
  const useR =
    displayRMultiples &&
    [...a, ...b].every((point) => Number.isFinite(point.cumulativeR));
  const value = (point: PnLChartDataPoint) =>
    useR ? point.cumulativeR : point.pnl;
  return {
    a: timed(a, value),
    b: timed(b, value),
    unit: useR ? 'r' : 'money',
  };
};


export const drawdownCurves = (
  a: DrawdownChartDataPoint[],
  b: DrawdownChartDataPoint[],
  displayRMultiples: boolean
): CompareCurves => {
  const series = [a, b].filter((points) => points.length > 0);
  const scale = getDrawdownChartScale(series, displayRMultiples);
  const value = (point: DrawdownChartDataPoint) =>
    getDrawdownChartPlotValue(point, scale);
  return {
    a: timed(a, value),
    b: timed(b, value),
    unit: scale === 'r' ? 'r' : scale === 'percent' ? 'percent' : 'money',
  };
};

interface CompareCurveWidgetProps {
  curves: CompareCurves;
  
  measure: 'pnl' | 'drawdown';
  aData: DashboardData;
  aFilters: FilterState;
  bFilters: FilterState;
  dateFormat: string;
  ariaLabel: string;
}

export const CompareCurveWidget: React.FC<CompareCurveWidgetProps> = ({
  curves,
  measure,
  aData,
  aFilters,
  bFilters,
  dateFormat,
  ariaLabel,
}) => {
  const { formatValue, shouldMask } = useDisplayFormatter();
  const moneyKind = measure === 'drawdown' ? 'drawdown' : 'pnl';
  const kind =
    curves.unit === 'r'
      ? 'rMultiple'
      : curves.unit === 'percent'
        ? 'returnPercent'
        : moneyKind;
  const currencyCode = widgetCurrency(aData);
  const format = (value: number) =>
    curves.unit === 'r'
      ? formatValue({ kind: 'rMultiple', value, precision: 1 })
      : curves.unit === 'percent'
        ? formatValue({ kind: 'returnPercent', value, precision: 1 })
        : formatValue({ kind: moneyKind, value, currencyCode });
  return (
    <div className="journalit-compare-widget">
      <CompareCurveChart
        a={curves.a}
        b={curves.b}
        xKind="time"
        dateFormat={dateFormat}
        masked={shouldMask(kind)}
        formatValue={format}
        fill={measure === 'pnl'}
        ariaLabel={ariaLabel}
      />
      <CompareLegend aFilters={aFilters} bFilters={bFilters} />
    </div>
  );
};
