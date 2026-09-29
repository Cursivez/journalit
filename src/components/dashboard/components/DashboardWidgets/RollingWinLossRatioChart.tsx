

import React, { useState, useRef, useEffect } from 'react';
import { BaseWidget, BaseWidgetProps } from './BaseWidget';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceArea,
  ReferenceLine,
  TooltipProps,
  DotItemDotProps,
} from 'recharts';
import { ChartBase } from '../../../charts/ChartBase';
import { RechartsPortalTooltip } from '../../../charts/RechartsPortalTooltip';
import { Trade } from '../../utils/dataUtils';
import { calculateEffectiveRMultiple } from '../../../../utils/formatting';
import { generateNiceAxis } from '../../../../utils/chartUtils';
import { useDisplayFormatter } from '../../../../hooks/useDisplayPolicy';
import { useCurrency } from '../../../../contexts/CurrencyContext';
import { CurrencyCode } from '../../../../utils/currencyConfig';
import { usePlugin } from '../../../../hooks/usePlugin';
import {
  getEffectivePnL,
  isPnlContributingTrade,
} from '../../../../utils/tradeStatusUtils';
import { t } from '../../../../lang/helpers';
import {
  getAnalyticsDateBasis,
  getTradeAnalyticsDate,
} from '../../../../utils/tradeAnalyticsDate';


const ROLLING_PERIODS = [10, 20, 30, 50] as const;
type RollingPeriod = (typeof ROLLING_PERIODS)[number];
const BREAKEVEN_RATIO = 1;
const RATIO_AXIS_MIN_SPAN = 0.5;
const RATIO_AXIS_TARGET_TICKS = 5;

interface RatioYAxisConfig {
  domain: [number, number];
  ticks: number[];
}

const MASKED_RATIO_AXIS: RatioYAxisConfig = {
  domain: [0.5, 1.5],
  ticks: [0.5, 1, 1.5],
};


export const buildRatioYAxis = (
  ratios: readonly (number | null)[],
  isMetricMasked: boolean
): RatioYAxisConfig => {
  if (isMetricMasked) {
    return MASKED_RATIO_AXIS;
  }

  const finiteRatios = ratios.filter(
    (ratio): ratio is number => ratio !== null && Number.isFinite(ratio)
  );
  if (finiteRatios.length === 0) {
    return MASKED_RATIO_AXIS;
  }

  
  let dataMin = Math.min(...finiteRatios, BREAKEVEN_RATIO);
  let dataMax = Math.max(...finiteRatios, BREAKEVEN_RATIO);

  
  const span = dataMax - dataMin;
  if (span < RATIO_AXIS_MIN_SPAN) {
    const midpoint = (dataMin + dataMax) / 2;
    dataMin = midpoint - RATIO_AXIS_MIN_SPAN / 2;
    dataMax = midpoint + RATIO_AXIS_MIN_SPAN / 2;
  }

  const { domain, ticks, step } = generateNiceAxis(
    dataMin,
    dataMax,
    RATIO_AXIS_TARGET_TICKS
  );

  const axisTicks = [...ticks];

  
  
  
  if (domain[0] >= BREAKEVEN_RATIO && step > 0) {
    domain[0] -= step;
    axisTicks.unshift(domain[0]);
  }
  if (domain[1] <= BREAKEVEN_RATIO && step > 0) {
    domain[1] += step;
    axisTicks.push(domain[1]);
  }

  
  const lower = Math.max(0, domain[0]);
  return {
    domain: [lower, domain[1]],
    ticks: axisTicks.filter((tick) => tick >= lower),
  };
};


interface RollingWinLossRatioDataPoint {
  tradeIndex: number;
  
  ratio: number | null;
  avgWin: number;
  avgLoss: number;
  avgWinR?: number; 
  avgLossR?: number; 
  label: string; 
}


type UndefinedRatioBand =
  | { scope: 'categories'; x1: string; x2: string; y1: number; y2: number }
  | { scope: 'plot' };

export const getUndefinedRatioBands = (
  points: readonly RollingWinLossRatioDataPoint[]
): UndefinedRatioBand[] => {
  const bands: UndefinedRatioBand[] = [];
  let runStart: number | null = null;

  const closeRun = (runEnd: number) => {
    if (runStart === null) return;

    const left = points[runStart - 1];
    const right = points[runEnd + 1];
    const leftRatio = left?.ratio ?? null;
    const rightRatio = right?.ratio ?? null;
    
    
    const y1 = leftRatio ?? rightRatio;
    const y2 = rightRatio ?? leftRatio;

    if (y1 === null || y2 === null) {
      bands.push({ scope: 'plot' });
    } else {
      bands.push({
        scope: 'categories',
        x1: (left ?? points[runStart]).label,
        x2: (right ?? points[runEnd]).label,
        y1,
        y2,
      });
    }
    runStart = null;
  };

  points.forEach((point, index) => {
    if (point.ratio === null) {
      runStart ??= index;
      return;
    }
    closeRun(index - 1);
  });
  closeRun(points.length - 1);

  return bands;
};

const ZIGZAG_AMPLITUDE = 7;
const ZIGZAG_HALF_WAVELENGTH = 11;

const ZIGZAG_RAMP_PX = 18;

const ZIGZAG_MAX_RAMP = 0.35;

export const getZigzagRamp = (width: number): number =>
  Math.min(ZIGZAG_RAMP_PX / Math.max(width, 1), ZIGZAG_MAX_RAMP);


const zigzagEnvelope = (position: number, ramp: number): number => {
  const distanceFromEnd = Math.min(position, 1 - position);
  if (distanceFromEnd >= ramp) return 1;
  const progress = distanceFromEnd / ramp;
  
  return progress * progress * (3 - 2 * progress);
};


const LINE_HALF_WIDTH = 1.25;

const BREAK_HALF_WIDTH = 0.6;

interface Point {
  x: number;
  y: number;
}

const zigzagCenterline = (
  x: number,
  width: number,
  yStart: number,
  yEnd: number
): Point[] => {
  const vertices = Math.max(2, Math.round(width / ZIGZAG_HALF_WAVELENGTH));
  const ramp = getZigzagRamp(width);
  const points: Point[] = [{ x, y: yStart }];

  for (let vertex = 1; vertex < vertices; vertex++) {
    const position = vertex / vertices;
    const direction = vertex % 2 === 0 ? 1 : -1;
    points.push({
      x: x + width * position,
      y:
        yStart +
        (yEnd - yStart) * position +
        ZIGZAG_AMPLITUDE * zigzagEnvelope(position, ramp) * direction,
    });
  }

  points.push({ x: x + width, y: yEnd });
  return points;
};


export const buildSquigglePath = (
  x: number,
  width: number,
  yStart: number,
  yEnd: number
): string => {
  const centerline = zigzagCenterline(x, width, yStart, yEnd);
  const ramp = getZigzagRamp(width);
  const last = centerline.length - 1;
  const top: Point[] = [];
  const bottom: Point[] = [];

  centerline.forEach((point, index) => {
    
    const previous = centerline[Math.max(0, index - 1)];
    const next = centerline[Math.min(last, index + 1)];
    const dx = next.x - previous.x;
    const dy = next.y - previous.y;
    const length = Math.hypot(dx, dy) || 1;
    const halfWidth =
      LINE_HALF_WIDTH +
      (BREAK_HALF_WIDTH - LINE_HALF_WIDTH) * zigzagEnvelope(index / last, ramp);
    const offsetX = (-dy / length) * halfWidth;
    const offsetY = (dx / length) * halfWidth;

    top.push({ x: point.x + offsetX, y: point.y + offsetY });
    bottom.push({ x: point.x - offsetX, y: point.y - offsetY });
  });

  const trace = (points: Point[]) =>
    points.map((point) => `${point.x.toFixed(2)} ${point.y.toFixed(2)}`);

  return `M ${trace(top).join(' L ')} L ${trace([...bottom].reverse()).join(' L ')} Z`;
};


export const getIsolatedPointLabels = (
  points: readonly { ratio: number | null; label: string }[]
): Set<string> => {
  const labels = new Set<string>();

  points.forEach((point, index) => {
    if (point.ratio === null) return;
    const hasDefinedNeighbour =
      points[index - 1]?.ratio != null || points[index + 1]?.ratio != null;
    if (!hasDefinedNeighbour) {
      labels.add(point.label);
    }
  });

  return labels;
};

interface RatioDotProps extends Omit<DotItemDotProps, 'payload'> {
  payload?: { label: string };
}


interface RatioBandShapeProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

const asRatioDotProps = (props: DotItemDotProps): RatioDotProps => props;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const parseRollingPeriod = (value: number): RollingPeriod | null => {
  switch (value) {
    case 10:
    case 20:
    case 30:
    case 50:
      return value;
    default:
      return null;
  }
};

const isRollingWinLossRatioDataPoint = (
  value: unknown
): value is RollingWinLossRatioDataPoint =>
  isRecord(value) &&
  typeof value.tradeIndex === 'number' &&
  (value.ratio === null || typeof value.ratio === 'number') &&
  typeof value.avgWin === 'number' &&
  typeof value.avgLoss === 'number' &&
  (value.avgWinR === undefined || typeof value.avgWinR === 'number') &&
  (value.avgLossR === undefined || typeof value.avgLossR === 'number') &&
  typeof value.label === 'string';


const getRollingTooltipDataPoint = (
  payload: readonly unknown[] | undefined,
  label: string | number | undefined,
  chartData: readonly RollingWinLossRatioDataPoint[]
): RollingWinLossRatioDataPoint | undefined => {
  const firstPayload = payload?.[0];
  if (isRecord(firstPayload)) {
    const data = firstPayload.payload;
    if (isRollingWinLossRatioDataPoint(data)) {
      return data;
    }
  }

  return typeof label === 'string'
    ? chartData.find((point) => point.label === label)
    : undefined;
};


export const calculateRollingWinLossRatio = (
  trades: Trade[],
  period: number,
  defaultRiskAmount?: number,
  analyticsDateBasis: 'entry' | 'exit' = 'entry'
): RollingWinLossRatioDataPoint[] => {
  if (trades.length === 0) return [];

  
  const closedTrades = trades.filter((trade) => isPnlContributingTrade(trade));

  
  const sortedTrades = [...closedTrades].sort((a, b) => {
    const timeA = getTradeAnalyticsDate(a, analyticsDateBasis)?.getTime() ?? 0;
    const timeB = getTradeAnalyticsDate(b, analyticsDateBasis)?.getTime() ?? 0;
    return timeA - timeB;
  });

  const dataPoints: RollingWinLossRatioDataPoint[] = [];

  for (let i = period - 1; i < sortedTrades.length; i++) {
    const windowTrades = sortedTrades.slice(i - period + 1, i + 1);

    
    const wins = windowTrades.filter((t) => getEffectivePnL(t) > 0);
    const losses = windowTrades.filter((t) => getEffectivePnL(t) < 0);

    
    const avgWin =
      wins.length > 0
        ? wins.reduce((sum, t) => sum + getEffectivePnL(t), 0) / wins.length
        : 0;

    const avgLoss =
      losses.length > 0
        ? Math.abs(
            losses.reduce((sum, t) => sum + getEffectivePnL(t), 0) /
              losses.length
          )
        : 0;

    
    
    
    const ratio = avgLoss > 0 ? avgWin / avgLoss : null;

    
    let avgWinR: number | undefined = undefined;
    let avgLossR: number | undefined = undefined;

    if (defaultRiskAmount && defaultRiskAmount > 0) {
      
      const winningRMultiples = wins.flatMap((t) => {
        const rMultiple = calculateEffectiveRMultiple(
          getEffectivePnL(t),
          t.rMultiple,
          t.riskAmount,
          defaultRiskAmount
        );
        return rMultiple !== undefined && !isNaN(rMultiple) ? [rMultiple] : [];
      });

      avgWinR =
        winningRMultiples.length > 0
          ? winningRMultiples.reduce((sum, r) => sum + r, 0) /
            winningRMultiples.length
          : undefined;

      
      const losingRMultiples = losses.flatMap((t) => {
        const rMultiple = calculateEffectiveRMultiple(
          getEffectivePnL(t),
          t.rMultiple,
          t.riskAmount,
          defaultRiskAmount
        );
        return rMultiple !== undefined && !isNaN(rMultiple) ? [rMultiple] : [];
      });

      avgLossR =
        losingRMultiples.length > 0
          ? Math.abs(
              losingRMultiples.reduce((sum, r) => sum + r, 0) /
                losingRMultiples.length
            )
          : undefined;
    }

    dataPoints.push({
      tradeIndex: i + 1,
      ratio: ratio === null ? null : Math.round(ratio * 100) / 100, 
      avgWin,
      avgLoss,
      avgWinR,
      avgLossR,
      label: `#${i + 1}`,
    });
  }

  return dataPoints;
};


type CustomTooltipProps = Omit<TooltipProps<number, string>, 'payload'> & {
  payload?: readonly unknown[];
  label?: string | number;
  chartData: readonly RollingWinLossRatioDataPoint[];
  currency?: CurrencyCode;
  formatValue: ReturnType<typeof useDisplayFormatter>['formatValue'];
  shouldMask: ReturnType<typeof useDisplayFormatter>['shouldMask'];
};


const RollingWinLossRatioTooltip = (props: CustomTooltipProps) => {
  const {
    active,
    payload,
    label,
    chartData,
    currency = CurrencyCode.USD,
    formatValue,
    shouldMask,
  } = props;
  const data = getRollingTooltipDataPoint(payload, label, chartData);

  if (!active || !data) return null;

  const isPnlMasked = shouldMask('pnl');
  
  
  const isRatioUndefined = data.ratio === null && !shouldMask('metric');
  const formatAvgWin = () =>
    formatValue({
      kind: 'pnl',
      value: data.avgWin,
      currencyCode: currency,
      showCents: false,
      rMultiple: data.avgWinR,
    });

  const formatAvgLoss = () =>
    formatValue({
      kind: 'pnl',
      value: data.avgLoss,
      currencyCode: currency,
      showCents: false,
      rMultiple: data.avgLossR,
    });

  return (
    <div className="journalit-chart-tooltip journalit-chart-tooltip--compact">
      <div className="journalit-chart-tooltip-label">
        {t('dashboard.rolling_win_loss.trade_label', { label: data.label })}
      </div>
      <div className="journalit-chart-tooltip-row journalit-chart-tooltip-row--neutral journalit-chart-tooltip-row--spaced">
        {isRatioUndefined
          ? t('dashboard.rolling_win_loss.ratio_undefined')
          : t('dashboard.rolling_win_loss.ratio_label', {
              ratio: formatValue({
                kind: 'metric',
                value: data.ratio ?? 0,
                precision: 2,
              }),
            })}
      </div>
      {(isPnlMasked || data.avgWin > 0) && (
        <div
          className={`journalit-chart-tooltip-row ${isPnlMasked ? '' : 'journalit-chart-tooltip-row--positive'} journalit-chart-tooltip-row--spaced`}
        >
          {t('dashboard.rolling_win_loss.avg_win_label', {
            value: formatAvgWin(),
          })}
        </div>
      )}
      {(isPnlMasked || data.avgLoss > 0) && (
        <div
          className={`journalit-chart-tooltip-row ${isPnlMasked ? '' : 'journalit-chart-tooltip-row--negative'}`}
        >
          {t('dashboard.rolling_win_loss.avg_loss_label', {
            value: formatAvgLoss(),
          })}
        </div>
      )}
    </div>
  );
};


let gradientIdCounter = 0;


export const RollingWinLossRatioChart = React.memo<BaseWidgetProps>(
  ({ filters, dateFormat }) => {
    const chartRef = React.useRef<HTMLDivElement>(null);
    const [selectedPeriod, setSelectedPeriod] = useState<RollingPeriod>(20);
    const plugin = usePlugin();
    const { currency } = useCurrency();
    const defaultRiskAmount = plugin?.settings?.trade?.defaultRiskAmount;
    const { formatValue, shouldMask } = useDisplayFormatter();
    const isMetricMasked = shouldMask('metric');

    
    const chartIdRef = useRef<string | null>(null);
    useEffect(() => {
      if (!chartIdRef.current) {
        chartIdRef.current = `rolling-win-loss-ratio-${++gradientIdCounter}`;
      }
    }, []);
    const chartId = chartIdRef.current || 'rolling-win-loss-ratio-default';
    
    const LINE_COLOR = 'var(--text-muted)';

    return (
      <BaseWidget
        filters={filters}
        dateFormat={dateFormat}
        skeletonType="line-chart"
      >
        {(data) => {
          
          
          const allStats = calculateRollingWinLossRatio(
            data.trades,
            selectedPeriod,
            defaultRiskAmount,
            getAnalyticsDateBasis(plugin?.settings)
          );
          
          const chartData = allStats.slice(-selectedPeriod);

          
          
          const undefinedBands = isMetricMasked
            ? []
            : getUndefinedRatioBands(chartData);
          const displayChartData = isMetricMasked
            ? chartData.map((point) => ({ ...point, displayRatio: 1 }))
            : chartData.map((point) => ({
                ...point,
                displayRatio: point.ratio,
              }));
          
          const isolatedPointLabels = getIsolatedPointLabels(
            displayChartData.map((point) => ({
              ratio: point.displayRatio,
              label: point.label,
            }))
          );

          const yAxisConfig = buildRatioYAxis(
            displayChartData.map((point) => point.displayRatio),
            isMetricMasked
          );

          return (
            <div className="journalit-chart-widget">
              
              <div className="journalit-chart-widget__header">
                <div className="journalit-chart-widget__title">
                  {t('dashboard.rolling_win_loss.title')}
                </div>
                <div className="journalit-chart-widget__selector">
                  <select
                    id="rolling-period-select"
                    aria-label={t('dashboard.rolling_win_loss.period_aria')}
                    className="journalit-chart-widget__select"
                    value={selectedPeriod}
                    onChange={(e) => {
                      const period = parseRollingPeriod(Number(e.target.value));
                      if (period) {
                        setSelectedPeriod(period);
                      }
                    }}
                  >
                    {ROLLING_PERIODS.map((period) => (
                      <option key={period} value={period}>
                        {t('dashboard.rolling_win_loss.trades_count', {
                          count: String(period),
                        })}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              
              {chartData.length === 0 ? (
                <div className="journalit-dashboard-directional-chart-empty">
                  {t('dashboard.rolling_win_loss.window_not_filled', {
                    count: String(selectedPeriod),
                  })}
                </div>
              ) : (
                <div className="journalit-chart-widget__body">
                  <ChartBase
                    height="100%"
                    width="100%"
                    chartRef={chartRef}
                    skeletonVariant="line"
                  >
                    <LineChart
                      data={displayChartData}
                      margin={{ top: 6, right: 30, left: 0, bottom: 10 }}
                    >
                      <defs>
                        
                        <filter id={`${chartId}-glow`} height="130%">
                          <feGaussianBlur
                            in="SourceGraphic"
                            stdDeviation="2"
                            result="blur"
                          />
                          <feColorMatrix
                            in="blur"
                            mode="matrix"
                            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                            result="glow"
                          />
                          <feComposite
                            in="SourceGraphic"
                            in2="glow"
                            operator="over"
                          />
                        </filter>
                      </defs>

                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="var(--background-modifier-border)"
                        strokeOpacity={0.5}
                      />

                      
                      {undefinedBands.map((band) => {
                        const midRatio =
                          (yAxisConfig.domain[0] + yAxisConfig.domain[1]) / 2;
                        
                        
                        const descending =
                          band.scope === 'categories' && band.y1 > band.y2;
                        return (
                          <ReferenceArea
                            key={
                              band.scope === 'plot'
                                ? 'no-losses-plot'
                                : `${band.x1}-${band.x2}`
                            }
                            x1={
                              band.scope === 'categories' ? band.x1 : undefined
                            }
                            x2={
                              band.scope === 'categories' ? band.x2 : undefined
                            }
                            y1={
                              band.scope === 'categories' ? band.y1 : midRatio
                            }
                            y2={
                              band.scope === 'categories' ? band.y2 : midRatio
                            }
                            fill="none"
                            stroke="none"
                            ifOverflow="extendDomain"
                            shape={(shapeProps: RatioBandShapeProps) => {
                              const { x, y, width, height } = shapeProps;
                              if (
                                x == null ||
                                y == null ||
                                width == null ||
                                height == null
                              ) {
                                return <g />;
                              }
                              
                              
                              const yStart = descending ? y : y + height;
                              const yEnd = descending ? y + height : y;
                              const fadeId = `${chartId}-break-fade-${Math.round(x)}`;
                              const fadeRamp = getZigzagRamp(width) * 100;
                              return (
                                <g>
                                  <defs>
                                    
                                    <linearGradient
                                      id={fadeId}
                                      gradientUnits="userSpaceOnUse"
                                      x1={x}
                                      x2={x + width}
                                    >
                                      <stop
                                        offset="0%"
                                        stopColor={LINE_COLOR}
                                        stopOpacity={1}
                                      />
                                      <stop
                                        offset={`${fadeRamp}%`}
                                        stopColor={LINE_COLOR}
                                        stopOpacity={0.45}
                                      />
                                      <stop
                                        offset={`${100 - fadeRamp}%`}
                                        stopColor={LINE_COLOR}
                                        stopOpacity={0.45}
                                      />
                                      <stop
                                        offset="100%"
                                        stopColor={LINE_COLOR}
                                        stopOpacity={1}
                                      />
                                    </linearGradient>
                                  </defs>
                                  <path
                                    d={buildSquigglePath(
                                      x,
                                      width,
                                      yStart,
                                      yEnd
                                    )}
                                    fill={`url(#${fadeId})`}
                                    stroke="none"
                                  />
                                  <text
                                    x={x + width / 2}
                                    y={(yStart + yEnd) / 2 - 12}
                                    textAnchor="middle"
                                    fill="var(--text-muted)"
                                    fontSize={10}
                                  >
                                    {t(
                                      'dashboard.rolling_win_loss.no_losses_band'
                                    )}
                                  </text>
                                </g>
                              );
                            }}
                          />
                        );
                      })}

                      
                      <ReferenceLine
                        y={BREAKEVEN_RATIO}
                        stroke="var(--text-normal, #888888)"
                        strokeOpacity={isMetricMasked ? 0.2 : 0.5}
                        strokeDasharray="3 3"
                        strokeWidth={1.5}
                        label={{
                          value: '1.0',
                          position: 'right',
                          fill: 'var(--text-muted)',
                          fontSize: 11,
                          fontWeight: 500,
                        }}
                      />

                      <XAxis
                        dataKey="label"
                        height={16}
                        tickMargin={4}
                        tickLine={false}
                      />

                      <YAxis
                        className="journalit-chart-axis--numeric"
                        tickFormatter={(value: number) => {
                          
                          if (!Number.isFinite(value)) {
                            return '';
                          }
                          return formatValue({
                            kind: 'metric',
                            value,
                            precision: 1,
                          });
                        }}
                        domain={yAxisConfig.domain}
                        ticks={yAxisConfig.ticks}
                        width={45}
                        tickLine={true}
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
                        {(props) => (
                          <RollingWinLossRatioTooltip
                            active={props.active}
                            payload={props.payload}
                            label={props.label}
                            chartData={chartData}
                            currency={currency}
                            formatValue={formatValue}
                            shouldMask={shouldMask}
                          />
                        )}
                      </RechartsPortalTooltip>

                      <Line
                        type="monotone"
                        dataKey="displayRatio"
                        stroke={LINE_COLOR}
                        strokeWidth={2.5}
                        dot={(props: DotItemDotProps) => {
                          const { cx, cy, payload } = asRatioDotProps(props);
                          const isIsolated =
                            payload !== undefined &&
                            isolatedPointLabels.has(payload.label);
                          
                          
                          return isIsolated && cx != null && cy != null ? (
                            <circle
                              cx={cx}
                              cy={cy}
                              r={3.5}
                              fill={LINE_COLOR}
                              stroke="var(--background-primary)"
                              strokeWidth={1}
                            />
                          ) : (
                            <circle cx={0} cy={0} r={0} opacity={0} />
                          );
                        }}
                        activeDot={{
                          r: 7,
                          strokeWidth: 1,
                          stroke: 'var(--background-primary)',
                          fill: 'var(--interactive-accent)',
                          filter: `url(#${chartId}-glow)`,
                        }}
                        animationDuration={500}
                        animationEasing="ease-out"
                      />
                    </LineChart>
                  </ChartBase>
                </div>
              )}
            </div>
          );
        }}
      </BaseWidget>
    );
  }
);

RollingWinLossRatioChart.displayName = 'RollingWinLossRatioChart';
