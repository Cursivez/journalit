

import React, { useId, useMemo, useRef } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from 'recharts';
import { ChartBase } from '../../charts/ChartBase';
import { RechartsPortalTooltip } from '../../charts/RechartsPortalTooltip';
import { isolatedPointDot } from '../../charts/isolatedPointDot';
import { skipVerticalGridCoordinates } from '../../charts/chartGrid';
import {
  calculateYAxisWidth,
  generateNiceAxis,
} from '../../../utils/chartUtils';
import { formatDateDisplay } from '../../../utils/dateUtils';
import { t, tPlural } from '../../../lang/helpers';
import type { FilterState } from '../dashboardTypes';
import { toComparisonFilters } from './dashboardComparison';
import { describeComparisonFilters } from './describeComparisonFilters';

export type CompareSide = 'a' | 'b';

export const COMPARE_SIDES: readonly CompareSide[] = ['a', 'b'];


const COMPARE_COLORS: Record<CompareSide, string> = {
  a: 'var(--journalit-chart-series-1)',
  b: 'var(--journalit-chart-series-3)',
};

export const COMPARE_LETTER: Record<CompareSide, string> = { a: 'A', b: 'B' };

const TICK_STYLE = { fontSize: 11, fontWeight: 500, fill: 'var(--text-muted)' };
const GRID_STROKE = 'var(--background-modifier-border)';
const CHART_MARGIN = { top: 6, right: 8, left: 0, bottom: 4 };


export const CompareTag: React.FC<{ side: CompareSide }> = ({ side }) => (
  <span
    className={`journalit-compare-tag journalit-compare-tag--${side}`}
    aria-hidden="true"
  >
    {COMPARE_LETTER[side]}
  </span>
);


export const CompareLegend: React.FC<{
  aFilters: FilterState;
  bFilters: FilterState;
  
  children?: React.ReactNode;
}> = ({ aFilters, bFilters, children }) => (
  <div className="journalit-compare-legend">
    {(
      [
        ['a', aFilters],
        ['b', bFilters],
      ] as const
    ).map(([side, filters]) => (
      <span key={side} className="journalit-compare-legend__item">
        <CompareTag side={side} />
        <span className="journalit-compare-legend__label">
          <span className="journalit-sr-only">
            {t('dashboard.compare.filter-side', {
              side: COMPARE_LETTER[side],
            })}
            {': '}
          </span>
          {describeComparisonFilters(toComparisonFilters(filters))}
        </span>
      </span>
    ))}
    {children}
  </div>
);


const TooltipRow: React.FC<{
  side: CompareSide;
  value: string;
  note?: string;
  label?: string;
}> = ({ side, value, note, label }) => (
  <div className="journalit-compare-tooltip__row">
    <CompareTag side={side} />
    {label && <span className="journalit-compare-tooltip__label">{label}</span>}
    <span className="journalit-compare-tooltip__value">{value}</span>
    {note && <span className="journalit-compare-tooltip__note">{note}</span>}
  </div>
);

const CompareTooltip: React.FC<{
  title: string;
  rows: Array<{
    side: CompareSide;
    value: string;
    note?: string;
    
    label?: string;
  }>;
}> = ({ title, rows }) => (
  <div className="journalit-chart-tooltip journalit-compare-tooltip">
    <div className="journalit-chart-tooltip-date">{title}</div>
    {rows.map((row) => (
      <TooltipRow key={`${row.side}-${row.label ?? ''}`} {...row} />
    ))}
  </div>
);


const CompareChartFrame: React.FC<{
  label: string;
  children: React.ReactNode;
}> = ({ label, children }) => {
  const labelId = useId();
  return (
    <figure className="journalit-compare-chart" aria-labelledby={labelId}>
      <span id={labelId} className="journalit-sr-only">
        {label}
      </span>
      {children}
    </figure>
  );
};



export interface CompareCurvePoint {
  
  x: number;
  y: number;
}

interface MergedCurvePoint {
  x: number;
  a: number | null;
  b: number | null;
}


function mergeCurves(
  a: readonly CompareCurvePoint[],
  b: readonly CompareCurvePoint[]
): MergedCurvePoint[] {
  const xs = Array.from(
    new Set([...a.map((point) => point.x), ...b.map((point) => point.x)])
  ).sort((left, right) => left - right);
  
  
  const lastAt = (points: readonly CompareCurvePoint[]) => {
    const byX = new Map<number, number>();
    for (const point of points) byX.set(point.x, point.y);
    return byX;
  };
  const byXA = lastAt(a);
  const byXB = lastAt(b);
  let lastA: number | null = null;
  let lastB: number | null = null;
  return xs.map((x) => {
    lastA = byXA.get(x) ?? lastA;
    lastB = byXB.get(x) ?? lastB;
    return { x, a: lastA, b: lastB };
  });
}

interface CompareCurveChartProps {
  a: readonly CompareCurvePoint[];
  b: readonly CompareCurvePoint[];
  
  xKind: 'time' | 'index';
  dateFormat: string;
  formatValue: (value: number) => string;
  
  formatIndex?: (x: number) => string;
  masked: boolean;
  
  fill?: boolean;
  
  zeroLine?: boolean;
  ariaLabel: string;
}

export const CompareCurveChart: React.FC<CompareCurveChartProps> = ({
  a,
  b,
  xKind,
  dateFormat,
  formatValue,
  formatIndex = (x) => String(x),
  masked,
  fill = true,
  zeroLine = true,
  ariaLabel,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  
  const id = `journalit-compare-curve-${useId()}`;
  const merged = useMemo(() => mergeCurves(a, b), [a, b]);
  
  const plotted = useMemo(
    () =>
      masked
        ? merged.map((point) => ({
            x: point.x,
            a: point.a === null ? null : 1,
            b: point.b === null ? null : 1,
          }))
        : merged,
    [masked, merged]
  );
  const values = merged.flatMap((point) =>
    [point.a, point.b].filter((value): value is number => value !== null)
  );
  const axis = masked
    ? generateNiceAxis(0, 1, 6, true, false)
    : generateNiceAxis(
        Math.min(0, ...values),
        Math.max(0, ...values),
        6,
        true,
        true
      );
  const yAxisWidth = calculateYAxisWidth(axis.ticks, formatValue);
  const formatX = (x: number) =>
    xKind === 'time'
      ? formatDateDisplay(new Date(x), dateFormat)
      : formatIndex(x);

  return (
    <CompareChartFrame label={ariaLabel}>
      <ChartBase height="100%" width="100%" chartRef={chartRef}>
        <AreaChart data={plotted} margin={CHART_MARGIN}>
          <defs>
            {COMPARE_SIDES.map((side) => (
              <linearGradient
                key={side}
                id={`${id}-${side}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor={COMPARE_COLORS[side]}
                  stopOpacity={0.2}
                />
                <stop
                  offset="100%"
                  stopColor={COMPARE_COLORS[side]}
                  stopOpacity={0}
                />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid
            vertical={false}
            strokeDasharray="3 3"
            stroke={GRID_STROKE}
            strokeOpacity={0.5}
          />
          {zeroLine && !masked && (
            <ReferenceLine
              y={0}
              stroke="var(--text-normal)"
              strokeOpacity={0.4}
              strokeDasharray="3 3"
            />
          )}
          <XAxis
            dataKey="x"
            type="number"
            scale={xKind === 'time' ? 'time' : 'linear'}
            domain={['dataMin', 'dataMax']}
            tickFormatter={formatX}
            tick={TICK_STYLE}
            tickLine={false}
            axisLine={{ stroke: GRID_STROKE, strokeOpacity: 0.5 }}
            minTickGap={24}
            height={18}
          />
          <YAxis
            domain={axis.domain}
            ticks={axis.ticks}
            tickFormatter={masked ? () => '' : formatValue}
            width={masked ? 8 : yAxisWidth}
            tick={TICK_STYLE}
            tickLine={false}
            axisLine={false}
          />
          <RechartsPortalTooltip
            chartRef={chartRef}
            cursor={{ stroke: 'var(--text-faint)', strokeDasharray: '3 3' }}
          >
            {(props) => {
              const x = Number(props.label);
              const point = merged.find((candidate) => candidate.x === x);
              if (!props.active || !point) return null;
              return (
                <CompareTooltip
                  title={formatX(x)}
                  rows={COMPARE_SIDES.flatMap((side) =>
                    point[side] === null
                      ? []
                      : [{ side, value: formatValue(point[side]) }]
                  )}
                />
              );
            }}
          </RechartsPortalTooltip>
          {COMPARE_SIDES.map((side) => (
            <Area
              key={side}
              type="monotone"
              dataKey={side}
              stroke={COMPARE_COLORS[side]}
              strokeWidth={2}
              fill={fill ? `url(#${id}-${side})` : 'none'}
              connectNulls={false}
              dot={false}
              activeDot={{ r: 3 }}
              isAnimationActive={false}
            />
          ))}
        </AreaChart>
      </ChartBase>
    </CompareChartFrame>
  );
};




type CompareRollingValue = number | null;

export interface CompareRollingSeries {
  
  key: string;
  side: CompareSide;
  
  label?: string;
  dashed?: boolean;
  
  values: readonly CompareRollingValue[];
}


const alignRollingSeries = (
  series: readonly CompareRollingSeries[]
): Array<Record<string, number | null>> => {
  const length = Math.max(0, ...series.map((line) => line.values.length));
  return Array.from({ length }, (_, index) => {
    const x = index - length + 1;
    const row: Record<string, number | null> = { x };
    for (const line of series) {
      const at = line.values.length - 1 + x;
      row[line.key] = at >= 0 ? (line.values[at] ?? null) : null;
    }
    return row;
  });
};


const hasRollingWindow = (line: CompareRollingSeries, x: number): boolean =>
  line.values.length - 1 + x >= 0;

interface CompareRollingChartProps {
  series: readonly CompareRollingSeries[];
  formatValue: (value: number) => string;
  masked: boolean;
  
  referenceY?: number;
  
  unit?: CompareRollingUnit;
  ariaLabel: string;
}


type CompareRollingUnit = 'trades' | 'sessions';

const formatWindowsBack = (x: number, unit: CompareRollingUnit): string =>
  x === 0
    ? t('dashboard.compare.latest-trade')
    : tPlural(
        unit === 'sessions'
          ? 'dashboard.compare.sessions-back'
          : 'dashboard.compare.trades-back',
        -x
      );

export const CompareRollingChart: React.FC<CompareRollingChartProps> = ({
  series,
  formatValue,
  masked,
  referenceY = 0,
  unit = 'trades',
  ariaLabel,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const rows = useMemo(() => alignRollingSeries(series), [series]);
  const formatX = (x: number) => formatWindowsBack(x, unit);
  
  
  
  const plotted = masked
    ? rows.map((row, index) => {
        const flat: Record<string, number | null> = { x: row.x };
        for (const line of series) {
          flat[line.key] = hasRollingWindow(line, index - rows.length + 1)
            ? line.dashed
              ? 1
              : 2
            : null;
        }
        return flat;
      })
    : rows;
  const values = rows.flatMap((row) =>
    series.flatMap((line) => {
      const value = row[line.key];
      return typeof value === 'number' && Number.isFinite(value) ? [value] : [];
    })
  );
  const axis = masked
    ? generateNiceAxis(0, 3, 4, true, false)
    : generateNiceAxis(
        Math.min(referenceY, ...values),
        Math.max(referenceY, ...values),
        5,
        true,
        true
      );
  const yAxisWidth = calculateYAxisWidth(axis.ticks, formatValue);

  return (
    <CompareChartFrame label={ariaLabel}>
      <ChartBase height="100%" width="100%" chartRef={chartRef}>
        <LineChart data={plotted} margin={CHART_MARGIN}>
          <CartesianGrid
            vertical={false}
            strokeDasharray="3 3"
            stroke={GRID_STROKE}
            strokeOpacity={0.5}
          />
          {!masked && (
            <ReferenceLine
              y={referenceY}
              stroke="var(--text-normal)"
              strokeOpacity={0.4}
              strokeDasharray="3 3"
            />
          )}
          <XAxis
            dataKey="x"
            type="number"
            domain={['dataMin', 'dataMax']}
            allowDecimals={false}
            tickFormatter={formatX}
            tick={TICK_STYLE}
            tickLine={false}
            axisLine={{ stroke: GRID_STROKE, strokeOpacity: 0.5 }}
            minTickGap={24}
            height={18}
          />
          <YAxis
            domain={axis.domain}
            ticks={axis.ticks}
            tickFormatter={masked ? () => '' : formatValue}
            width={masked ? 8 : yAxisWidth}
            tick={TICK_STYLE}
            tickLine={false}
            axisLine={false}
          />
          <RechartsPortalTooltip
            chartRef={chartRef}
            cursor={{ stroke: 'var(--text-faint)', strokeDasharray: '3 3' }}
          >
            {(props) => {
              const x = Number(props.label);
              const row = rows.find((candidate) => candidate.x === x);
              if (!props.active || !row) return null;
              return (
                <CompareTooltip
                  title={formatX(x)}
                  rows={series.flatMap((line) => {
                    const value = row[line.key];
                    if (masked) {
                      return hasRollingWindow(line, x)
                        ? [
                            {
                              side: line.side,
                              label: line.label,
                              value: formatValue(0),
                            },
                          ]
                        : [];
                    }
                    return typeof value === 'number'
                      ? [
                          {
                            side: line.side,
                            label: line.label,
                            value: formatValue(value),
                          },
                        ]
                      : [];
                  })}
                />
              );
            }}
          </RechartsPortalTooltip>
          {series.map((line) => (
            <Line
              key={line.key}
              type="monotone"
              dataKey={line.key}
              stroke={COMPARE_COLORS[line.side]}
              strokeWidth={2}
              strokeDasharray={line.dashed ? '5 4' : undefined}
              connectNulls={false}
              dot={isolatedPointDot(
                plotted,
                line.key,
                COMPARE_COLORS[line.side]
              )}
              activeDot={{ r: 3 }}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ChartBase>
    </CompareChartFrame>
  );
};



export interface CompareBarRow {
  key: string;
  label: string;
  a: number | null;
  b: number | null;
  
  aNote?: string;
  bNote?: string;
}

interface CompareBarChartProps {
  rows: readonly CompareBarRow[];
  formatValue: (value: number) => string;
  masked: boolean;
  
  orientation?: 'columns' | 'rows';
  
  formatCategory?: (label: string) => string;
  ariaLabel: string;
  onCategoryClick?: (key: string) => void;
}


const plotBarRows = (rows: readonly CompareBarRow[], masked: boolean) =>
  rows.map((row) => ({
    ...row,
    a: row.a === null || !masked ? row.a : 1,
    b: row.b === null || !masked ? row.b : 1,
  }));

const barValueAxis = (rows: readonly CompareBarRow[], masked: boolean) => {
  if (masked) return generateNiceAxis(0, 1, 5, true, false);
  const values = rows.flatMap((row) =>
    [row.a, row.b].filter((value): value is number => value !== null)
  );
  return generateNiceAxis(
    Math.min(0, ...values),
    Math.max(0, ...values),
    5,
    true,
    true
  );
};


function renderBarAxes({
  isRows,
  axis,
  masked,
  formatValue,
  categoryLabel,
  categoryWidth,
}: {
  isRows: boolean;
  axis: ReturnType<typeof generateNiceAxis>;
  masked: boolean;
  formatValue: (value: number) => string;
  categoryLabel: (key: string) => string;
  categoryWidth: number;
}): React.ReactNode {
  const valueProps = {
    type: 'number' as const,
    domain: axis.domain,
    ticks: axis.ticks,
    tickFormatter: masked ? () => '' : formatValue,
    tick: TICK_STYLE,
    tickLine: false,
    axisLine: false,
  };
  const categoryProps = {
    type: 'category' as const,
    dataKey: 'key',
    tickFormatter: categoryLabel,
    tick: TICK_STYLE,
    tickLine: false,
  };
  if (isRows) {
    return (
      <>
        <XAxis {...valueProps} height={masked ? 4 : 18} />
        <YAxis
          {...categoryProps}
          width={categoryWidth}
          axisLine={false}
          interval={0}
        />
      </>
    );
  }
  return (
    <>
      <YAxis
        {...valueProps}
        width={masked ? 8 : calculateYAxisWidth(axis.ticks, formatValue)}
      />
      <XAxis
        {...categoryProps}
        axisLine={{ stroke: GRID_STROKE, strokeOpacity: 0.5 }}
        minTickGap={4}
        height={18}
      />
    </>
  );
}

const CompareBarTooltip: React.FC<{
  row: CompareBarRow;
  formatValue: (value: number) => string;
}> = ({ row, formatValue }) => (
  <CompareTooltip
    title={row.label}
    rows={COMPARE_SIDES.map((side) => {
      const value = row[side];
      return {
        side,
        value:
          value === null
            ? t('dashboard.compare.no-trades')
            : formatValue(value),
        note: side === 'a' ? row.aNote : row.bNote,
      };
    })}
  />
);

export const CompareBarChart: React.FC<CompareBarChartProps> = ({
  rows,
  formatValue,
  masked,
  orientation = 'columns',
  formatCategory = (label) => label,
  ariaLabel,
  onCategoryClick,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const plotted = useMemo(() => plotBarRows(rows, masked), [masked, rows]);
  const byKey = new Map(rows.map((row) => [row.key, row]));
  const isRows = orientation === 'rows';
  const categoryLabel = (key: string) =>
    formatCategory(byKey.get(key)?.label ?? key);
  const categoryWidth = Math.min(
    140,
    Math.max(48, ...rows.map((row) => formatCategory(row.label).length * 6.5))
  );
  const handleClick = (state: unknown) => {
    const key =
      typeof state === 'object' && state !== null && 'activeLabel' in state
        ? state.activeLabel
        : undefined;
    if (onCategoryClick && typeof key === 'string') onCategoryClick(key);
  };

  return (
    <CompareChartFrame label={ariaLabel}>
      <ChartBase
        height="100%"
        width="100%"
        chartRef={chartRef}
        skeletonVariant="bar"
      >
        <BarChart
          data={plotted}
          layout={isRows ? 'vertical' : 'horizontal'}
          margin={CHART_MARGIN}
          barCategoryGap={isRows ? '22%' : '18%'}
          barGap={1}
          onClick={handleClick}
        >
          <CartesianGrid
            vertical={isRows}
            horizontal={!isRows}
            strokeDasharray="3 3"
            stroke={GRID_STROKE}
            strokeOpacity={0.5}
            verticalCoordinatesGenerator={
              isRows ? undefined : skipVerticalGridCoordinates
            }
          />
          {!masked && (
            <ReferenceLine
              {...(isRows ? { x: 0 } : { y: 0 })}
              stroke="var(--text-faint)"
            />
          )}
          {renderBarAxes({
            isRows,
            axis: barValueAxis(rows, masked),
            masked,
            formatValue,
            categoryLabel,
            categoryWidth,
          })}
          <RechartsPortalTooltip
            chartRef={chartRef}
            placementMode="bar"
            cursor={{ fill: 'var(--background-modifier-hover)' }}
          >
            {(props) => {
              const row = byKey.get(String(props.label));
              return props.active && row ? (
                <CompareBarTooltip row={row} formatValue={formatValue} />
              ) : null;
            }}
          </RechartsPortalTooltip>
          {COMPARE_SIDES.map((side) => (
            <Bar
              key={side}
              dataKey={side}
              fill={COMPARE_COLORS[side]}
              radius={isRows ? [0, 2, 2, 0] : [2, 2, 0, 0]}
              maxBarSize={isRows ? 14 : 18}
              isAnimationActive={false}
              cursor={onCategoryClick ? 'pointer' : undefined}
            />
          ))}
        </BarChart>
      </ChartBase>
    </CompareChartFrame>
  );
};



export interface CompareScatterPoint {
  x: number;
  y: number;
  
  id: string;
}

interface CompareScatterChartProps {
  a: readonly CompareScatterPoint[];
  b: readonly CompareScatterPoint[];
  formatX: (value: number) => string;
  formatY: (value: number) => string;
  xLabel: string;
  masked: boolean;
  ariaLabel: string;
  onPointClick?: (id: string) => void;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;


const scatterPointRef = (
  entry: unknown
): { side: CompareSide; id: string } | null => {
  const point = isRecord(entry) ? entry.payload : undefined;
  if (!isRecord(point) || typeof point.id !== 'string') return null;
  return { side: point.side === 'b' ? 'b' : 'a', id: point.id };
};


const maskedScatter = (points: readonly CompareScatterPoint[], row: number) =>
  points.map((point, index) => ({
    ...point,
    x: (index % 12) + 1,
    y: row + Math.floor(index / 12) * 2,
  }));

export const CompareScatterChart: React.FC<CompareScatterChartProps> = ({
  a,
  b,
  formatX,
  formatY,
  xLabel,
  masked,
  ariaLabel,
  onPointClick,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const series = masked
    ? { a: maskedScatter(a, 1), b: maskedScatter(b, 2) }
    : { a, b };
  const ys = [...a, ...b].map((point) => point.y);
  const yAxis = masked
    ? generateNiceAxis(0, 3, 4, true, false)
    : generateNiceAxis(Math.min(0, ...ys), Math.max(0, ...ys), 5, true, true);
  const yAxisWidth = calculateYAxisWidth(yAxis.ticks, formatY);
  return (
    <CompareChartFrame label={ariaLabel}>
      <ChartBase height="100%" width="100%" chartRef={chartRef}>
        <ScatterChart margin={CHART_MARGIN}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={GRID_STROKE}
            strokeOpacity={0.5}
          />
          {!masked && <ReferenceLine y={0} stroke="var(--text-faint)" />}
          <XAxis
            type="number"
            dataKey="x"
            name={xLabel}
            tickFormatter={masked ? () => '' : formatX}
            tick={TICK_STYLE}
            tickLine={false}
            axisLine={{ stroke: GRID_STROKE, strokeOpacity: 0.5 }}
            height={18}
          />
          <YAxis
            type="number"
            dataKey="y"
            domain={yAxis.domain}
            ticks={yAxis.ticks}
            tickFormatter={masked ? () => '' : formatY}
            width={masked ? 8 : yAxisWidth}
            tick={TICK_STYLE}
            tickLine={false}
            axisLine={false}
          />
          <ZAxis range={[28, 28]} />
          <RechartsPortalTooltip chartRef={chartRef}>
            {(props) => {
              const hovered = scatterPointRef(props.payload?.[0]);
              if (!props.active || !hovered) return null;
              
              const original = (hovered.side === 'b' ? b : a).find(
                (candidate) => candidate.id === hovered.id
              );
              if (!original) return null;
              return (
                <CompareTooltip
                  title={`${xLabel}: ${formatX(original.x)}`}
                  rows={[{ side: hovered.side, value: formatY(original.y) }]}
                />
              );
            }}
          </RechartsPortalTooltip>
          {COMPARE_SIDES.map((side) => (
            <Scatter
              key={side}
              data={series[side].map((point) => ({ ...point, side }))}
              fill={COMPARE_COLORS[side]}
              fillOpacity={0.7}
              isAnimationActive={false}
              cursor={onPointClick ? 'pointer' : undefined}
              onClick={(entry: { payload?: { id?: unknown } }) => {
                const id = entry?.payload?.id;
                if (onPointClick && typeof id === 'string') onPointClick(id);
              }}
            />
          ))}
        </ScatterChart>
      </ChartBase>
    </CompareChartFrame>
  );
};
