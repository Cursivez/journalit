import React, { useRef } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ReferenceLine,
  XAxis,
  YAxis,
  type TooltipProps,
} from 'recharts';
import { ChartBase } from './ChartBase';
import { RechartsPortalTooltip } from './RechartsPortalTooltip';
import type {
  SetupOpportunityBucket,
  SetupOpportunityStats,
} from '../../services/setup/types';
import { t } from '../../lang/helpers';
import { calculateYAxisWidth, generateNiceAxis } from '../../utils/chartUtils';

const SVG_TEXT_ANCHOR_MIDDLE = 'middle';

interface SetupExecutionGapChartProps {
  stats: SetupOpportunityStats;
  formatValue: (value: number) => string;
  isMasked: boolean;
  valueMode: 'pnl' | 'rMultiple';
}

interface SetupExecutionGapChartDatum {
  name: string;
  live: number;
  missed: number;
  backtest: number;
  livePlusMissed: number;
}

export const SetupExecutionGapChart: React.FC<SetupExecutionGapChartProps> = ({
  stats,
  formatValue,
  isMasked,
  valueMode,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  if (isMasked) {
    return (
      <div className="journalit-setups-execution-gap__masked">
        {t('setups.view.detail.execution-gap.hidden')}
      </div>
    );
  }

  const liveRawValue = getExecutionGapBucketValue(stats.live, valueMode);
  const missedRawValue = getExecutionGapBucketValue(stats.missed, valueMode);
  const livePlusMissedRawValue = getExecutionGapBucketValue(
    stats.livePlusMissed,
    valueMode
  );
  const backtestRawValue = getExecutionGapBucketValue(
    stats.backtest,
    valueMode
  );
  const liveValue = liveRawValue;
  const missedValue = missedRawValue;
  const livePlusMissedValue = livePlusMissedRawValue;
  const backtestValue = backtestRawValue;
  const hasMissedTrades = stats.missed.recordCount > 0;
  const hasBacktestTrades = stats.backtest.recordCount > 0;
  if (!hasMissedTrades && !hasBacktestTrades) {
    return (
      <div className="journalit-setups-execution-gap__masked">
        {t('setups.view.detail.execution-gap.empty')}
      </div>
    );
  }
  const axis = buildSetupExecutionGapAxis({
    live: liveValue,
    missed: missedValue,
    livePlusMissed: livePlusMissedValue,
    backtest: backtestValue,
  });
  const yAxisWidth = calculateYAxisWidth(axis.ticks, formatValue);
  const chartData: SetupExecutionGapChartDatum[] = [
    {
      name: t('setups.view.detail.execution-gap.live-execution'),
      live: liveValue,
      missed: hasMissedTrades ? missedValue : 0,
      backtest: 0,
      livePlusMissed: livePlusMissedValue,
    },
  ];
  if (hasBacktestTrades) {
    chartData.push({
      name: t('setups.view.detail.execution-gap.backtest-benchmark'),
      live: 0,
      missed: 0,
      backtest: backtestValue,
      livePlusMissed: 0,
    });
  }

  return (
    <div className="journalit-setups-execution-gap">
      <div className="journalit-setups-execution-gap__plot">
        <ChartBase
          chartRef={chartRef}
          className="journalit-setups-execution-gap__chart"
          height="100%"
          skeletonVariant="bar"
        >
          <BarChart
            data={chartData}
            margin={{ top: 14, right: 12, bottom: 8, left: 0 }}
            barCategoryGap="24%"
            barGap={0}
          >
            <defs>
              <pattern
                id="journalit-execution-gap-missed-pattern"
                patternUnits="userSpaceOnUse"
                width="8"
                height="8"
                patternTransform="rotate(45)"
              >
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="8"
                  stroke="var(--color-orange, #ff9800)"
                  strokeWidth="2"
                />
              </pattern>
            </defs>
            <CartesianGrid
              stroke="var(--background-modifier-border)"
              strokeDasharray="3 3"
              strokeOpacity={0.45}
              vertical={false}
            />
            <ReferenceLine
              y={0}
              stroke="var(--text-normal)"
              strokeOpacity={0.55}
            />
            <XAxis
              dataKey="name"
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
              tickFormatter={formatValue}
              tickLine={false}
              tickMargin={6}
              width={yAxisWidth}
            />
            <RechartsPortalTooltip
              chartRef={chartRef}
              placementMode="bar"
              tooltipProps={{}}
              cursor={{ fill: 'var(--interactive-hover)', fillOpacity: 0.08 }}
            >
              {(runtimeProps) => (
                <SetupExecutionGapTooltip
                  {...runtimeProps}
                  formatValue={formatValue}
                />
              )}
            </RechartsPortalTooltip>
            <Bar
              dataKey="live"
              name={t('setups.view.detail.execution-gap.live-execution')}
              stackId="captured"
              isAnimationActive={false}
              fill="var(--chart-positive, var(--text-success, #43a047))"
              fillOpacity={0.82}
              maxBarSize={108}
              radius={missedValue > 0 ? [0, 0, 4, 4] : [4, 4, 4, 4]}
              stroke="var(--chart-positive, var(--text-success, #43a047))"
              strokeOpacity={0.75}
              strokeWidth={1}
            >
              <LabelList
                content={(props) => (
                  <SetupExecutionGapBarLabel
                    {...props}
                    value={liveRawValue}
                    formatValue={formatValue}
                  />
                )}
              />
            </Bar>
            <Bar
              dataKey="missed"
              name={t('setups.view.detail.execution-gap.missed-edge')}
              stackId="captured"
              isAnimationActive={false}
              fill="url(#journalit-execution-gap-missed-pattern)"
              fillOpacity={0.62}
              maxBarSize={108}
              radius={[4, 4, 0, 0]}
              stroke="var(--color-orange, #ff9800)"
              strokeOpacity={0.82}
              strokeWidth={1}
            >
              <LabelList
                content={(props) => (
                  <SetupExecutionGapBarLabel
                    {...props}
                    value={missedRawValue}
                    formatValue={formatValue}
                    tone="warning"
                    hideWhenZero
                  />
                )}
              />
            </Bar>
            {hasBacktestTrades ? (
              <Bar
                dataKey="backtest"
                name={t('setups.view.detail.execution-gap.backtest-benchmark')}
                stackId="captured"
                isAnimationActive={false}
                fill="var(--color-purple, #6f42c1)"
                fillOpacity={0.72}
                maxBarSize={108}
                radius={[4, 4, 4, 4]}
                stroke="var(--color-purple, #6f42c1)"
                strokeOpacity={0.78}
                strokeWidth={1}
              >
                <LabelList
                  content={(props) => (
                    <SetupExecutionGapBarLabel
                      {...props}
                      value={backtestRawValue}
                      formatValue={formatValue}
                    />
                  )}
                />
              </Bar>
            ) : null}
          </BarChart>
        </ChartBase>
      </div>
    </div>
  );
};

SetupExecutionGapChart.displayName = 'SetupExecutionGapChart';

const SetupExecutionGapTooltip: React.FC<
  Omit<TooltipProps<number, string>, 'payload'> & {
    formatValue: (value: number) => string;
    label?: React.ReactNode;
    payload?: readonly unknown[];
  }
> = ({ active, payload, label, formatValue }) => {
  if (!active || !payload?.length) return null;
  const visiblePayload = payload.flatMap((entry) => {
    if (!isRecord(entry)) return [];
    const value = Number(entry.value);
    if (!Number.isFinite(value) || value === 0) return [];
    const rawName = entry.name ?? entry.dataKey;
    const name =
      typeof rawName === 'string' || typeof rawName === 'number'
        ? String(rawName)
        : '';
    const rawKey = entry.dataKey ?? entry.name;
    const dataKey =
      typeof rawKey === 'string' || typeof rawKey === 'number'
        ? String(rawKey)
        : String(value);
    return [{ dataKey, name, value }];
  });
  if (visiblePayload.length === 0) return null;

  return (
    <div className="journalit-chart-tooltip">
      <div className="journalit-chart-tooltip-date">{label}</div>
      {visiblePayload.map((entry) => (
        <div className="journalit-chart-tooltip-info" key={entry.dataKey}>
          {entry.name}: {formatValue(entry.value)}
        </div>
      ))}
    </div>
  );
};

SetupExecutionGapTooltip.displayName = 'SetupExecutionGapTooltip';

const SetupExecutionGapBarLabel: React.FC<{
  x?: number | string;
  y?: number | string;
  width?: number | string;
  height?: number | string;
  value: number;
  formatValue: (value: number) => string;
  tone?: 'warning';
  hideWhenZero?: boolean;
}> = ({ x, y, width, height, value, formatValue, tone, hideWhenZero }) => {
  if (hideWhenZero && value === 0) return null;
  const numericX = Number(x ?? 0);
  const numericY = Number(y ?? 0);
  const numericWidth = Number(width ?? 0);
  const numericHeight = Number(height ?? 0);
  if (numericHeight < 18 || numericWidth < 44) return null;

  const centerX = numericX + numericWidth / 2;
  const centerY = numericY + numericHeight / 2 + 4;
  const textClass = tone
    ? 'journalit-setups-execution-gap__bar-label journalit-setups-execution-gap__bar-label--warning'
    : 'journalit-setups-execution-gap__bar-label';

  return (
    <g className={textClass}>
      <text x={centerX} y={centerY} textAnchor={SVG_TEXT_ANCHOR_MIDDLE}>
        {formatValue(value)}
      </text>
    </g>
  );
};

SetupExecutionGapBarLabel.displayName = 'SetupExecutionGapBarLabel';

function getExecutionGapBucketValue(
  bucket: SetupOpportunityBucket,
  valueMode: 'pnl' | 'rMultiple'
): number {
  return valueMode === 'rMultiple' ? bucket.totalR : bucket.totalPnL;
}

export function buildSetupExecutionGapAxis(values: {
  live: number;
  missed: number;
  livePlusMissed: number;
  backtest: number;
}) {
  const capturedPositiveExtent =
    Math.max(0, values.live) + Math.max(0, values.missed);
  const capturedNegativeExtent =
    Math.min(0, values.live) + Math.min(0, values.missed);
  const minValue = Math.min(
    0,
    capturedNegativeExtent,
    values.livePlusMissed,
    values.backtest
  );
  const maxValue = Math.max(
    0,
    capturedPositiveExtent,
    values.livePlusMissed,
    values.backtest
  );

  return generateNiceAxis(minValue, maxValue, 4, true, true);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}
