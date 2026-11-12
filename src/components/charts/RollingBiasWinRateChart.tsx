

import React, { useMemo } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartBase } from './ChartBase';
import { isolatedPointDot } from './isolatedPointDot';
import { RechartsPortalTooltip } from './RechartsPortalTooltip';
import { useChartAnimationActive } from './chartAnimation';
import { useDisplayFormatter } from '../../hooks/useDisplayPolicy';
import { getCurrentLanguage, t } from '../../lang/helpers';
import { cssVars } from '../../styles/inlineStylePolicy';
import type { RollingBiasPoint } from '../../services/marketBias/rollingBiasWinRate';

const WIN_RATE_TICKS = [0, 25, 50, 75, 100];
const MASKED_WIN_RATE = 50;
const MAX_X_TICKS = 6;
const WITH_COLOR = 'var(--journalit-status-success)';
const AGAINST_COLOR = 'var(--journalit-status-error)';

type RollingBiasXAxis = 'tradeNumber' | 'day';

interface ChartPoint {
  x: number;
  point: RollingBiasPoint;
  with: number | null;
  against: number | null;
  withBefore: number | null;
  againstBefore: number | null;
}

interface RollingBiasWinRateChartProps {
  points: readonly RollingBiasPoint[];
  period: number;
  
  xAxis: RollingBiasXAxis;
  
  periodStartLabel?: string;
}


function spreadTicks(candidates: readonly number[]): number[] {
  if (candidates.length <= MAX_X_TICKS) return [...candidates];
  const step = (candidates.length - 1) / (MAX_X_TICKS - 1);
  return Array.from(
    { length: MAX_X_TICKS },
    (_, i) => candidates[Math.round(i * step)]
  );
}

function dayKey(time: number): string {
  const date = new Date(time);
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}


function dayStartTicks(points: readonly ChartPoint[]): number[] {
  const ticks: number[] = [];
  let previous = '';
  for (const { x, point } of points) {
    if (point.beforePeriod) continue;
    const key = dayKey(point.time);
    if (key !== previous) ticks.push(x);
    previous = key;
  }
  return spreadTicks(ticks);
}

const LegendItem: React.FC<{
  color: string;
  label: string;
  dashed?: boolean;
}> = ({ color, label, dashed }) => (
  <div className="journalit-chart-widget__legend-item">
    <div
      className={`journalit-chart-widget__legend-swatch${dashed ? ' journalit-chart-widget__legend-swatch--dashed' : ''}`}
      style={cssVars({ '--legend-color': color })}
    />
    <span>{label}</span>
  </div>
);

export const RollingBiasWinRateChart: React.FC<
  RollingBiasWinRateChartProps
> = ({ points, period, xAxis, periodStartLabel }) => {
  const chartRef = React.useRef<HTMLDivElement>(null);
  const isAnimationActive = useChartAnimationActive();
  const { formatValue, shouldMask } = useDisplayFormatter();
  const isMasked = shouldMask('percentage');

  const chartData = useMemo<ChartPoint[]>(() => {
    
    
    const display = (value: number | null) =>
      isMasked ? MASKED_WIN_RATE : value;
    const firstInPeriod = points.findIndex((point) => !point.beforePeriod);
    return points.map((point, x) => {
      const before = point.beforePeriod || x === firstInPeriod;
      return {
        x,
        point,
        with: point.beforePeriod ? null : display(point.with),
        against: point.beforePeriod ? null : display(point.against),
        withBefore: before ? display(point.with) : null,
        againstBefore: before ? display(point.against) : null,
      };
    });
  }, [points, isMasked]);

  const periodStartX = chartData.find((p) => !p.point.beforePeriod)?.x ?? 0;
  const hasBeforePeriod = periodStartX > 0;

  const dayFormat = useMemo(() => {
    const first = points[0]?.time ?? 0;
    const last = points[points.length - 1]?.time ?? 0;
    const shortSpan = last - first <= 7 * 24 * 60 * 60 * 1000;
    return new Intl.DateTimeFormat(
      getCurrentLanguage(),
      shortSpan
        ? { weekday: 'short', day: 'numeric' }
        : { day: 'numeric', month: 'short' }
    );
  }, [points]);

  const xTicks = useMemo(
    () =>
      xAxis === 'day'
        ? dayStartTicks(chartData)
        : spreadTicks(chartData.map((p) => p.x)),
    [chartData, xAxis]
  );

  const xLabel = (x: number): string => {
    const point = chartData[x]?.point;
    if (!point) return '';
    return xAxis === 'day'
      ? dayFormat.format(point.time)
      : `#${point.tradeNumber}`;
  };

  const percent = (value: number | null): string =>
    value === null && !isMasked
      ? t('dashboard.rolling_bias.window_filling')
      : formatValue({ kind: 'percentage', value: value ?? 0, precision: 0 });

  const lineProps = {
    type: 'monotone' as const,
    connectNulls: false,
    isAnimationActive,
  };

  return (
    <div className="journalit-rolling-bias-chart">
      <div className="journalit-chart-widget__body">
        <ChartBase
          height="100%"
          width="100%"
          chartRef={chartRef}
          skeletonVariant="line"
        >
          <LineChart
            data={chartData}
            margin={{ top: 6, right: 30, left: 0, bottom: 10 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="var(--background-modifier-border)"
              strokeOpacity={0.5}
            />
            {hasBeforePeriod && (
              <ReferenceLine
                x={periodStartX}
                stroke="var(--text-faint)"
                strokeDasharray="2 2"
                label={
                  periodStartLabel
                    ? {
                        value: periodStartLabel,
                        position: 'insideTopLeft',
                        fill: 'var(--text-faint)',
                        fontSize: 11,
                      }
                    : undefined
                }
              />
            )}
            <ReferenceLine
              y={50}
              stroke="var(--text-normal, #888888)"
              strokeOpacity={isMasked ? 0.2 : 0.5}
              strokeDasharray="3 3"
              strokeWidth={1.5}
              label={{
                value: formatValue({
                  kind: 'percentage',
                  value: 50,
                  precision: 0,
                }),
                position: 'right',
                fill: 'var(--text-muted)',
                fontSize: 11,
                fontWeight: 500,
              }}
            />
            <XAxis
              dataKey="x"
              type="number"
              domain={['dataMin', 'dataMax']}
              ticks={xTicks}
              interval={0}
              tickFormatter={xLabel}
              height={16}
              tickMargin={4}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              ticks={WIN_RATE_TICKS}
              tickFormatter={(value: number) =>
                formatValue({ kind: 'percentage', value, precision: 0 })
              }
              width={45}
              tickLine
              tickMargin={5}
            />
            <RechartsPortalTooltip
              chartRef={chartRef}
              allowEmptyPayload
              cursor={{
                stroke: 'var(--interactive-accent)',
                strokeWidth: 1,
                strokeDasharray: '3 3',
              }}
            >
              {({ active, label }) => {
                const hovered =
                  typeof label === 'number' ? chartData[label] : undefined;
                if (!active || !hovered) return null;
                const { point } = hovered;
                return (
                  <div className="journalit-chart-tooltip journalit-chart-tooltip--compact">
                    <div className="journalit-chart-tooltip-label">
                      {t('dashboard.rolling_bias.tooltip_label', {
                        label: xLabel(hovered.x),
                        count: String(period),
                      })}
                    </div>
                    {point.beforePeriod && periodStartLabel && (
                      <div className="journalit-chart-tooltip-row journalit-chart-tooltip-row--neutral">
                        {t('dashboard.rolling_bias.before_period')}
                      </div>
                    )}
                    <div
                      className={`journalit-chart-tooltip-row ${isMasked ? '' : 'journalit-chart-tooltip-row--positive'}`}
                    >
                      {t('dashboard.rolling_bias.with_value', {
                        value: percent(point.with),
                      })}
                    </div>
                    <div
                      className={`journalit-chart-tooltip-row ${isMasked ? '' : 'journalit-chart-tooltip-row--negative'}`}
                    >
                      {t('dashboard.rolling_bias.against_value', {
                        value: percent(point.against),
                      })}
                    </div>
                  </div>
                );
              }}
            </RechartsPortalTooltip>
            {hasBeforePeriod && (
              <Line
                {...lineProps}
                dataKey="withBefore"
                dot={isolatedPointDot(
                  chartData,
                  'withBefore',
                  WITH_COLOR,
                  0.45
                )}
                stroke={WITH_COLOR}
                strokeOpacity={0.45}
                strokeDasharray="4 3"
                strokeWidth={2}
              />
            )}
            {hasBeforePeriod && (
              <Line
                {...lineProps}
                dataKey="againstBefore"
                dot={isolatedPointDot(
                  chartData,
                  'againstBefore',
                  AGAINST_COLOR,
                  0.45
                )}
                stroke={AGAINST_COLOR}
                strokeOpacity={0.45}
                strokeDasharray="4 3"
                strokeWidth={2}
              />
            )}
            <Line
              {...lineProps}
              dataKey="with"
              dot={isolatedPointDot(chartData, 'with', WITH_COLOR)}
              stroke={WITH_COLOR}
              strokeWidth={2.5}
            />
            <Line
              {...lineProps}
              dataKey="against"
              dot={isolatedPointDot(chartData, 'against', AGAINST_COLOR)}
              stroke={AGAINST_COLOR}
              strokeWidth={2.5}
            />
          </LineChart>
        </ChartBase>
      </div>
      <div className="journalit-chart-widget__legend">
        <LegendItem
          color={WITH_COLOR}
          label={t('dashboard.rolling_bias.with_bias')}
        />
        <LegendItem
          color={AGAINST_COLOR}
          label={t('dashboard.rolling_bias.against_bias')}
        />
        {hasBeforePeriod && (
          <LegendItem
            color="var(--text-faint)"
            dashed
            label={t('dashboard.rolling_bias.before_period_legend')}
          />
        )}
      </div>
    </div>
  );
};
