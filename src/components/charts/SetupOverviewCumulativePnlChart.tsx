import React, { useRef } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  XAxis,
  YAxis,
  type TooltipProps,
} from 'recharts';
import { ChartBase } from './ChartBase';
import { RechartsPortalTooltip } from './RechartsPortalTooltip';
import { t } from '../../lang/helpers';
import { cssVars } from '../../styles/inlineStylePolicy';
import { calculateYAxisWidth, generateNiceAxis } from '../../utils/chartUtils';

interface SetupOverviewPnlSeries {
  key: string;
  label: string;
  color: string;
  isCombined: boolean;
}

interface SetupOverviewPnlPoint {
  index: number;
  label: string;
  [key: string]: number | string;
}

interface SetupOverviewCumulativePnlChartProps {
  data: SetupOverviewPnlPoint[];
  series: SetupOverviewPnlSeries[];
  height?: number;
  formatPnl: (value: number) => string;
  isMasked: boolean;
}

export const SetupOverviewCumulativePnlChart: React.FC<
  SetupOverviewCumulativePnlChartProps
> = ({ data, series, height = 340, formatPnl, isMasked }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  if (isMasked) {
    return (
      <div className="journalit-setups-overview-pnl-chart__masked">
        {t('setups.view.overview.pnl-chart.hidden')}
      </div>
    );
  }

  const values = data.flatMap((point) =>
    series.flatMap((item) => {
      const value = point[item.key];
      return typeof value === 'number' ? [value] : [];
    })
  );
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const axis = buildCumulativePnlAxis(minValue, maxValue);
  const yAxisWidth = calculateYAxisWidth(axis.ticks, formatPnl);

  return (
    <div className="journalit-setups-overview-pnl-chart">
      <ChartBase
        chartRef={chartRef}
        className="journalit-setups-overview-pnl-chart__chart"
        height={height}
        skeletonVariant="line"
      >
        <LineChart
          data={data}
          margin={{ top: 10, right: 18, bottom: 4, left: 0 }}
        >
          <CartesianGrid
            stroke="var(--background-modifier-border)"
            strokeDasharray="3 3"
            strokeOpacity={0.35}
            vertical={false}
          />
          <ReferenceLine
            y={0}
            stroke="var(--text-muted)"
            strokeDasharray="4 4"
            strokeOpacity={0.65}
          />
          <XAxis
            dataKey="index"
            axisLine={{
              stroke: 'var(--background-modifier-border)',
              strokeOpacity: 0.7,
            }}
            tickLine={false}
            tickMargin={8}
            height={28}
          />
          <YAxis
            axisLine={false}
            domain={axis.domain}
            ticks={axis.ticks}
            tickFormatter={formatPnl}
            tickLine={false}
            tickMargin={6}
            width={yAxisWidth}
          />
          <RechartsPortalTooltip
            chartRef={chartRef}
            placementMode="point"
            tooltipProps={{}}
            cursor={{ stroke: 'var(--text-faint)', strokeOpacity: 0.35 }}
          >
            {(runtimeProps) => (
              <SetupOverviewPnlTooltip
                {...runtimeProps}
                formatPnl={formatPnl}
                series={series}
              />
            )}
          </RechartsPortalTooltip>
          {series.map((item) => (
            <Line
              key={item.key}
              type="monotone"
              dataKey={item.key}
              name={item.label}
              stroke={item.color}
              strokeWidth={item.isCombined ? 2.5 : 1.5}
              strokeOpacity={item.isCombined ? 0.95 : 0.72}
              dot={false}
              activeDot={{ r: item.isCombined ? 4 : 3 }}
              connectNulls
            />
          ))}
        </LineChart>
      </ChartBase>
    </div>
  );
};

SetupOverviewCumulativePnlChart.displayName = 'SetupOverviewCumulativePnlChart';

const SetupOverviewPnlTooltip: React.FC<
  Omit<TooltipProps<number, string>, 'payload'> & {
    formatPnl: (value: number) => string;
    label?: React.ReactNode;
    payload?: readonly unknown[];
    series: SetupOverviewPnlSeries[];
  }
> = ({ active, payload, label, formatPnl, series }) => {
  if (!active || !payload?.length) return null;
  const seriesByKey = new Map(series.map((item) => [item.key, item]));
  const visiblePayload = payload.flatMap((entry) => {
    if (!isRecord(entry)) return [];
    const value = Number(entry.value);
    if (!Number.isFinite(value)) return [];
    const rawKey = entry.dataKey;
    const key =
      typeof rawKey === 'string' || typeof rawKey === 'number'
        ? String(rawKey)
        : String(value);
    const item = seriesByKey.get(key);
    return [
      {
        key,
        label: item?.label ?? key,
        color: item?.color ?? 'var(--text-normal)',
        value,
      },
    ];
  });
  const tooltipLabel =
    typeof label === 'string' || typeof label === 'number' ? String(label) : '';

  return (
    <div className="journalit-chart-tooltip">
      <div className="journalit-chart-tooltip-date">
        {Number(tooltipLabel) === 0
          ? t('setups.view.overview.pnl-chart.start')
          : `${t('setups.view.overview.pnl-chart.trade')} ${tooltipLabel}`}
      </div>
      {visiblePayload.map((entry) => (
        <div
          className="journalit-chart-tooltip-info journalit-setups-overview-pnl-tooltip__item"
          key={entry.key}
          style={cssVars({
            '--journalit-setup-overview-pnl-series-color': entry.color,
          })}
        >
          {entry.label}: {formatPnl(entry.value)}
        </div>
      ))}
    </div>
  );
};

SetupOverviewPnlTooltip.displayName = 'SetupOverviewPnlTooltip';

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

export function buildCumulativePnlAxis(
  minValue: number,
  maxValue: number
): { domain: [number, number]; ticks: number[] } {
  if (!Number.isFinite(minValue) || !Number.isFinite(maxValue)) {
    return { domain: [0, 1], ticks: [0, 1] };
  }

  if (minValue === 0 && maxValue === 0) {
    return { domain: [0, 1], ticks: [0, 1] };
  }

  if (maxValue <= 0) {
    const negativeAxis = generateNiceAxis(minValue, 0, 5, true);
    return { domain: negativeAxis.domain, ticks: negativeAxis.ticks };
  }

  const positiveAxis = generateNiceAxis(0, Math.max(1, maxValue), 6, true);
  if (minValue >= 0) {
    return { domain: positiveAxis.domain, ticks: positiveAxis.ticks };
  }

  const negativeRange = Math.abs(minValue);
  const negativeMoveIsMinor =
    negativeRange <= positiveAxis.step * 0.35 ||
    negativeRange <= Math.max(1, maxValue) * 0.06;

  if (negativeMoveIsMinor) {
    return {
      domain: [minValue * 1.15, positiveAxis.domain[1]],
      ticks: positiveAxis.ticks,
    };
  }

  const positiveMoveIsMinor =
    maxValue <= Math.abs(generateNiceAxis(minValue, 0, 5, true).step) * 0.35 ||
    maxValue <= negativeRange * 0.06;

  if (positiveMoveIsMinor) {
    const negativeAxis = generateNiceAxis(minValue, 0, 5, true);
    return {
      domain: [negativeAxis.domain[0], maxValue * 1.15],
      ticks: negativeAxis.ticks,
    };
  }

  const fullAxis = generateNiceAxis(minValue, maxValue, 6, true);
  return { domain: fullAxis.domain, ticks: fullAxis.ticks };
}
