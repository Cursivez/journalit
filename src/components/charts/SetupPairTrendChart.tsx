import React, { useRef } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  XAxis,
  YAxis,
} from 'recharts';

import { ChartBase } from './ChartBase';
import { RechartsPortalTooltip } from './RechartsPortalTooltip';
import { useDisplayFormatter } from '../../hooks/useDisplayPolicy';
import { t } from '../../lang/helpers';
import { generateNiceAxis } from '../../utils/chartUtils';

interface SetupPairTrendPoint {
  index: number;
  value: number;
}

interface SetupPairTrendChartPoint extends SetupPairTrendPoint {
  negativeValue: number | null;
  positiveValue: number | null;
}

interface SetupPairTrendChartProps {
  baseline: number;
  displayKind: 'count' | 'pnl' | 'percentage' | 'metric' | 'rMultiple';
  points: SetupPairTrendPoint[];
}

export const SetupPairTrendChart: React.FC<SetupPairTrendChartProps> = ({
  baseline,
  displayKind,
  points,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const { formatValue } = useDisplayFormatter();
  const chartData = buildSignedTrendChartData(points, baseline);
  const values = points.map((point) => point.value);
  const rawMin = Math.min(...values, 0);
  const rawMax = Math.max(...values, 0);
  const padding = Math.max(
    (rawMax - rawMin) * 0.12,
    displayKind === 'pnl' ? 50 : 0.5
  );
  
  
  
  
  const axisMin =
    baseline === 1 ? 0 : rawMin >= baseline ? baseline : rawMin - padding;
  const axisMax = rawMax <= baseline ? baseline + padding : rawMax + padding;
  const baseAxis = generateNiceAxis(axisMin, axisMax, 5, false, false);
  const axis =
    displayKind === 'percentage'
      ? {
          domain: [0, 100] as [number, number],
          ticks: [0, 20, 40, 60, 80, 100],
        }
      : {
          domain: [
            Math.min(baseAxis.domain[0], baseline),
            Math.max(baseAxis.domain[1], baseline),
          ] as [number, number],
          ticks: Array.from(new Set([...baseAxis.ticks, baseline])).sort(
            (first, second) => first - second
          ),
        };
  const isNeutralSeries =
    displayKind === 'percentage' || displayKind === 'count';

  const formatAxisValue = (value: number): string => {
    if (!Number.isFinite(value)) return '';
    switch (displayKind) {
      case 'pnl':
        return formatValue({
          kind: 'pnl',
          value,
          showCents: false,
          notation: 'compact',
        });
      case 'rMultiple':
        return formatValue({ kind: 'rMultiple', value, precision: 1 });
      case 'percentage':
        return formatValue({
          kind: 'percentage',
          value,
          precision: Math.abs(value) < 10 ? 1 : 0,
        });
      case 'count':
        return formatValue({ kind: 'count', value });
      case 'metric':
        return formatValue({ kind: 'metric', value, precision: 2 });
    }
  };

  return (
    <ChartBase chartRef={chartRef} height="100%" skeletonVariant="line">
      <LineChart
        data={chartData}
        margin={{ top: 8, right: 8, left: 0, bottom: 4 }}
      >
        <CartesianGrid
          stroke="var(--background-modifier-border)"
          strokeDasharray="3 3"
          strokeOpacity={0.5}
          vertical={false}
        />
        <ReferenceLine
          y={baseline}
          stroke="var(--text-normal)"
          strokeDasharray="3 3"
          strokeOpacity={0.36}
          strokeWidth={1.4}
        />
        <XAxis
          dataKey="index"
          domain={['dataMin', 'dataMax']}
          height={16}
          interval="preserveStartEnd"
          minTickGap={24}
          tickFormatter={(value: number) => String(Math.round(value))}
          tickLine={false}
          tickMargin={4}
          type="number"
        />
        <YAxis
          domain={axis.domain}
          tickFormatter={formatAxisValue}
          tickLine={true}
          tickMargin={5}
          ticks={axis.ticks}
          width={54}
        />
        <RechartsPortalTooltip
          chartRef={chartRef}
          cursor={{
            stroke: 'var(--interactive-accent)',
            strokeDasharray: '3 3',
            strokeWidth: 1,
          }}
        >
          {(props) => (
            <SetupPairTrendTooltip
              active={props.active}
              displayKind={displayKind}
              payload={props.payload}
            />
          )}
        </RechartsPortalTooltip>
        {isNeutralSeries ? (
          <Line
            activeDot={{
              fill: 'var(--interactive-accent)',
              r: 5,
              stroke: 'var(--background-primary)',
              strokeWidth: 1,
            }}
            animationDuration={500}
            dataKey="value"
            dot={{
              fill: 'var(--text-muted)',
              r: 3,
              stroke: 'var(--background-primary)',
              strokeWidth: 1.4,
            }}
            stroke="var(--text-muted)"
            strokeWidth={2.4}
            type="monotone"
          />
        ) : (
          <>
            <Line
              activeDot={{
                fill: 'var(--interactive-accent)',
                r: 5,
                stroke: 'var(--background-primary)',
                strokeWidth: 1,
              }}
              connectNulls={false}
              dataKey="negativeValue"
              dot={{
                fill: 'var(--chart-negative, var(--text-error))',
                r: 3,
                stroke: 'var(--background-primary)',
                strokeWidth: 1.4,
              }}
              isAnimationActive={false}
              stroke="var(--chart-negative, var(--text-error))"
              strokeWidth={2.4}
              type="monotone"
            />
            <Line
              activeDot={{
                fill: 'var(--interactive-accent)',
                r: 5,
                stroke: 'var(--background-primary)',
                strokeWidth: 1,
              }}
              animationDuration={500}
              connectNulls={false}
              dataKey="positiveValue"
              dot={{
                fill: 'var(--chart-positive, var(--text-success))',
                r: 3,
                stroke: 'var(--background-primary)',
                strokeWidth: 1.4,
              }}
              stroke="var(--chart-positive, var(--text-success))"
              strokeWidth={2.4}
              type="monotone"
            />
          </>
        )}
      </LineChart>
    </ChartBase>
  );
};

SetupPairTrendChart.displayName = 'SetupPairTrendChart';

const SetupPairTrendTooltip: React.FC<{
  active?: boolean;
  displayKind: SetupPairTrendChartProps['displayKind'];
  payload?: readonly unknown[];
}> = ({ active, displayKind, payload }) => {
  const { formatValue } = useDisplayFormatter();
  const point = getTooltipPoint(payload);

  if (!active || !point) return null;

  const value = formatTrendValue(formatValue, displayKind, point.value, 2);

  return (
    <div className="journalit-chart-tooltip journalit-chart-tooltip--compact">
      <div className="journalit-chart-tooltip-label">
        {t('setups.view.metric.trades')}: {Math.round(point.index)}
      </div>
      <div className="journalit-chart-tooltip-row journalit-chart-tooltip-row--neutral journalit-chart-tooltip-row--spaced">
        {value}
      </div>
    </div>
  );
};

SetupPairTrendTooltip.displayName = 'SetupPairTrendTooltip';

function formatTrendValue(
  formatValue: ReturnType<typeof useDisplayFormatter>['formatValue'],
  displayKind: SetupPairTrendChartProps['displayKind'],
  value: number,
  precision: number
): string {
  switch (displayKind) {
    case 'pnl':
      return formatValue({ kind: 'pnl', value, showCents: false });
    case 'rMultiple':
      return formatValue({ kind: 'rMultiple', value, precision });
    case 'percentage':
      return formatValue({ kind: 'percentage', value, precision: 0 });
    case 'count':
      return formatValue({ kind: 'count', value });
    case 'metric':
      return formatValue({ kind: 'metric', value, precision });
  }
}

function buildSignedTrendChartData(
  points: SetupPairTrendPoint[],
  baseline: number
): SetupPairTrendChartPoint[] {
  const chartData: SetupPairTrendChartPoint[] = [];

  points.forEach((point, pointIndex) => {
    const previous = points[pointIndex - 1];
    if (previous && crossesBaseline(previous.value, point.value, baseline)) {
      const valueDelta = point.value - previous.value;
      const ratio =
        valueDelta === 0 ? 0 : (baseline - previous.value) / valueDelta;
      const baselineIndex =
        previous.index + ratio * (point.index - previous.index);
      chartData.push({
        index: baselineIndex,
        value: baseline,
        negativeValue: baseline,
        positiveValue: baseline,
      });
    }

    chartData.push({
      index: point.index,
      value: point.value,
      negativeValue: point.value <= baseline ? point.value : null,
      positiveValue: point.value >= baseline ? point.value : null,
    });
  });

  return chartData;
}

function crossesBaseline(
  first: number,
  second: number,
  baseline: number
): boolean {
  return (
    (first < baseline && second > baseline) ||
    (first > baseline && second < baseline)
  );
}

function getTooltipPoint(
  payload: readonly unknown[] | undefined
): SetupPairTrendPoint | null {
  const firstPayload = payload?.[0];
  if (!isRecord(firstPayload)) return null;
  const rawPoint = firstPayload.payload;
  if (!isRecord(rawPoint)) return null;
  const { index, value } = rawPoint;
  return typeof index === 'number' && typeof value === 'number'
    ? { index, value }
    : null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
