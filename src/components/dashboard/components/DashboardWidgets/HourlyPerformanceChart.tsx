

import React from 'react';
import { BaseWidget, BaseWidgetProps } from './BaseWidget';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  TooltipProps,
} from 'recharts';
import { t } from '../../../../lang/helpers';
import { usePlugin } from '../../../../hooks/usePlugin';
import { useCurrency } from '../../../../contexts/CurrencyContext';
import { useDisplayFormatter } from '../../../../hooks/useDisplayPolicy';
import { calculateEffectiveRMultiple } from '../../../../utils/formatting';
import {
  classifyPnLWithBreakEvenSettings,
  normalizeBreakEvenRange,
} from '../../../../utils/breakEvenRange';
import {
  calculateYAxisWidth,
  generateNiceAxis,
} from '../../../../utils/chartUtils';
import { ChartBase } from '../../../charts/ChartBase';
import { RechartsPortalTooltip } from '../../../charts/RechartsPortalTooltip';
import { isPnlContributingTrade } from '../../../../utils/tradeStatusUtils';
import { getTradeRealizedPnlEvents } from '../../../../utils/tradeAnalyticsDate';
import {
  buildCurrencyConversionMetadata,
  CurrencyConversionInfo,
} from '../../../shared/display/CurrencyConversionInfo';

interface HourlyPerformanceDataPoint {
  bucketStart: number;
  label: string;
  netPnL: number;
  netR: number;
  trades: number;
  pnlEvents: number;
  rTrades: number;
  wins: number;
  losses: number;
  displayValue: number;
}

type TimeBucketMinutes = 15 | 30 | 60;
type TimeMetric = 'total' | 'average';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const isHourlyPerformanceDataPoint = (
  value: unknown
): value is HourlyPerformanceDataPoint =>
  isRecord(value) &&
  typeof value.bucketStart === 'number' &&
  typeof value.label === 'string' &&
  typeof value.netPnL === 'number' &&
  typeof value.netR === 'number' &&
  typeof value.trades === 'number' &&
  typeof value.wins === 'number' &&
  typeof value.losses === 'number';

const getHourlyTooltipPayload = (
  payload: readonly unknown[] | undefined
): TooltipContentLike<HourlyPerformanceDataPoint>['payload'] => {
  if (!payload) return undefined;
  return payload.flatMap((item) => {
    if (!isRecord(item) || !isHourlyPerformanceDataPoint(item.payload)) {
      return [];
    }
    return [{ payload: item.payload }];
  });
};

type TooltipContentLike<TData> = TooltipProps<number, string> & {
  payload?: ReadonlyArray<{ payload?: TData }>;
};

interface HourlyBarShapeProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  payload?: HourlyPerformanceDataPoint;
  stroke?: string;
  strokeWidth?: string | number;
  strokeOpacity?: string | number;
}

type HourlyTooltipProps = TooltipContentLike<HourlyPerformanceDataPoint> & {
  metric: TimeMetric;
  useRMultiples: boolean;
  currencyCode: string;
};

const MINUTES_PER_DAY = 24 * 60;
const BUCKET_OPTIONS: TimeBucketMinutes[] = [15, 30, 60];
const METRIC_OPTIONS: TimeMetric[] = ['total', 'average'];

const parseBucketMinutes = (value: string): TimeBucketMinutes => {
  const parsed = Number(value);
  return parsed === 15 || parsed === 30 || parsed === 60 ? parsed : 60;
};

const parseMetric = (value: string): TimeMetric => {
  if (value === 'total' || value === 'average') {
    return value;
  }
  return 'total';
};

const formatMinuteLabel = (minute: number): string => {
  const normalized =
    ((minute % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  const hour = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  return `${String(hour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

const formatBucketLabel = (
  startMinute: number,
  bucketMinutes: number
): string =>
  `${formatMinuteLabel(startMinute)}-${formatMinuteLabel(startMinute + bucketMinutes)}`;

const getBucketStart = (
  date: Date,
  bucketMinutes: TimeBucketMinutes
): number => {
  const minute = date.getHours() * 60 + date.getMinutes();
  return Math.floor(minute / bucketMinutes) * bucketMinutes;
};

const getMetricLabel = (metric: TimeMetric): string =>
  metric === 'average'
    ? t('dashboard.widgets.hourly-performance.metric.average')
    : t('dashboard.widgets.hourly-performance.metric.total');

const formatXAxisTick = (label: string): string => label.split('-')[0] ?? label;

const HourlyPerformanceTooltip: React.FC<HourlyTooltipProps> = ({
  active,
  payload,
  metric,
  useRMultiples,
  currencyCode,
}) => {
  const { formatValue, shouldMask } = useDisplayFormatter();
  const data = payload?.[0]?.payload;

  if (!active || !data) return null;

  const value = data.displayValue;
  const isMasked = shouldMask(useRMultiples ? 'rMultiple' : 'pnl');
  const isWinRateMasked = shouldMask('returnPercent');
  const decidedTrades = data.wins + data.losses;
  const winRate = decidedTrades > 0 ? (data.wins / decidedTrades) * 100 : 0;
  const formatted = useRMultiples
    ? formatValue({ kind: 'rMultiple', value, precision: 2 })
    : formatValue({ kind: 'pnl', value, currencyCode });

  return (
    <div className="journalit-chart-tooltip">
      <div className="journalit-chart-tooltip-date">{data.label}</div>
      <div className="journalit-chart-tooltip-info journalit-chart-tooltip-info--tight">
        {getMetricLabel(metric)}
      </div>
      <div
        className={`journalit-chart-tooltip-value ${isMasked ? '' : value >= 0 ? 'positive' : 'negative'}`}
      >
        {formatted}
      </div>
      <div className="journalit-chart-tooltip-info">
        {t('dashboard.widgets.hourly-performance.tooltip.trades', {
          count: isMasked ? '***' : String(data.trades),
        })}
      </div>
      <div className="journalit-chart-tooltip-info journalit-chart-tooltip-info--tight">
        {isWinRateMasked
          ? `${t('dashboard.widgets.hourly-performance.tooltip.win-rate-label')}: ${formatValue(
              {
                kind: 'returnPercent',
                value: winRate,
                signed: false,
                precision: 1,
              }
            )}`
          : t('dashboard.widgets.hourly-performance.tooltip.win-rate', {
              rate: formatValue({
                kind: 'returnPercent',
                value: winRate,
                signed: false,
                precision: 1,
              }),
              wins: String(data.wins),
              losses: String(data.losses),
            })}
      </div>
    </div>
  );
};

export const HourlyPerformanceChart = React.memo<BaseWidgetProps>(
  ({ filters, dateFormat }) => {
    const chartRef = React.useRef<HTMLDivElement>(null);
    const [bucketMinutes, setBucketMinutes] =
      React.useState<TimeBucketMinutes>(60);
    const [metric, setMetric] = React.useState<TimeMetric>('total');
    const plugin = usePlugin();
    const { currency } = useCurrency();
    const { formatValue, shouldMask } = useDisplayFormatter();
    const displayRMultiples =
      plugin?.settings?.trade?.displayRMultiples ?? false;
    const defaultRiskAmount = plugin?.settings?.trade?.defaultRiskAmount;
    const analyticsDateBasis =
      plugin?.settings?.trade?.analyticsDateBasis ?? 'entry';
    const breakEvenRange = normalizeBreakEvenRange(plugin?.settings?.trade);
    const breakEvenSettings = {
      breakEvenRangeMin: breakEvenRange.min,
      breakEvenRangeMax: breakEvenRange.max,
      breakEvenThresholdMode:
        plugin?.settings?.trade?.breakEvenThresholdMode ?? 'fixed',
      breakEvenThresholdPercent:
        plugin?.settings?.trade?.breakEvenThresholdPercent,
    };
    const [filterStartDate, filterEndDate] = filters.dateRange;

    return (
      <BaseWidget
        filters={filters}
        dateFormat={dateFormat}
        skeletonType="bar-chart"
      >
        {(data) => {
          const activeCurrency =
            (data.metrics.isMultiCurrency
              ? data.metrics.conversionBaseCurrency
              : currency) || currency;
          const currencyCode = activeCurrency;

          const bucketStarts = Array.from(
            { length: MINUTES_PER_DAY / bucketMinutes },
            (_, index) => index * bucketMinutes
          );
          const aggregates = new Map<number, HourlyPerformanceDataPoint>(
            bucketStarts.map((bucketStart) => [
              bucketStart,
              {
                bucketStart,
                label: formatBucketLabel(bucketStart, bucketMinutes),
                netPnL: 0,
                netR: 0,
                trades: 0,
                pnlEvents: 0,
                rTrades: 0,
                wins: 0,
                losses: 0,
                displayValue: 0,
              },
            ])
          );
          const tradeIdsByBucket = new Map<number, Set<string>>(
            bucketStarts.map((bucketStart) => [bucketStart, new Set<string>()])
          );

          data.trades.forEach((trade) => {
            if (!isPnlContributingTrade(trade)) return;
            const realizedEvents = getTradeRealizedPnlEvents(
              trade,
              analyticsDateBasis,
              plugin
            );
            if (realizedEvents.length === 0) return;

            const useStoredRMultiple = realizedEvents.length === 1;
            const tradeKey = trade.tradeId ?? trade.path ?? trade.instrument;

            for (const event of realizedEvents) {
              if (
                (filterStartDate && event.tradingDay < filterStartDate) ||
                (filterEndDate && event.tradingDay > filterEndDate) ||
                (trade._analyticsRangeStart &&
                  event.tradingDay < trade._analyticsRangeStart) ||
                (trade._analyticsRangeEnd &&
                  event.tradingDay > trade._analyticsRangeEnd)
              ) {
                continue;
              }

              const bucketStart = getBucketStart(event.date, bucketMinutes);
              const bucket = aggregates.get(bucketStart);
              if (!bucket) continue;

              bucket.netPnL += event.pnl;
              bucket.pnlEvents += 1;

              const bucketTradeIds = tradeIdsByBucket.get(bucketStart);
              if (tradeKey && bucketTradeIds && !bucketTradeIds.has(tradeKey)) {
                bucketTradeIds.add(tradeKey);
                bucket.trades += 1;
              } else if (!tradeKey) {
                bucket.trades += 1;
              }

              const outcome = classifyPnLWithBreakEvenSettings(
                event.pnl,
                breakEvenSettings,
                trade.breakEvenAccountCurrentBalance
              );
              if (outcome === 'win') {
                bucket.wins += 1;
              } else if (outcome === 'loss') {
                bucket.losses += 1;
              }

              const effectiveR = calculateEffectiveRMultiple(
                event.pnl,
                useStoredRMultiple ? trade.rMultiple : undefined,
                trade.riskAmount,
                defaultRiskAmount
              );
              if (effectiveR !== undefined && Number.isFinite(effectiveR)) {
                bucket.netR += effectiveR;
                bucket.rTrades += 1;
              }
            }
          });

          const hourlyData = bucketStarts.map(
            (bucketStart) => aggregates.get(bucketStart)!
          );
          const hasCompleteRCoverage = hourlyData.every(
            (item) => item.pnlEvents === 0 || item.pnlEvents === item.rTrades
          );
          const useRMultiples = displayRMultiples && hasCompleteRCoverage;
          const isMasked = shouldMask(useRMultiples ? 'rMultiple' : 'pnl');

          const chartData = hourlyData.map((item) => ({
            ...item,
            displayValue:
              metric === 'average'
                ? useRMultiples
                  ? item.rTrades > 0
                    ? item.netR / item.rTrades
                    : 0
                  : item.trades > 0
                    ? item.netPnL / item.trades
                    : 0
                : useRMultiples
                  ? item.netR
                  : item.netPnL,
          }));
          const displayChartData = isMasked
            ? chartData.map((item) => ({ ...item, displayValue: 1 }))
            : chartData;

          const dataMin = Math.min(
            ...chartData.map((item) => item.displayValue)
          );
          const dataMax = Math.max(
            ...chartData.map((item) => item.displayValue)
          );
          const axisConfig = isMasked
            ? generateNiceAxis(0, 1, 6, true, false)
            : generateNiceAxis(dataMin, dataMax, 6, true, true);

          const formatYAxisTick = (value: number) =>
            useRMultiples
              ? formatValue({ kind: 'rMultiple', value, precision: 1 })
              : formatValue({ kind: 'pnl', value, currencyCode });

          const yAxisWidth = calculateYAxisWidth(
            axisConfig.ticks,
            formatYAxisTick
          );

          return (
            <div className="journalit-chart-widget">
              <div className="journalit-chart-widget__header">
                <div className="journalit-chart-widget__title">
                  {t('dashboard.widgets.hourly-performance.title')}
                  {!useRMultiples && (
                    <CurrencyConversionInfo
                      metadata={buildCurrencyConversionMetadata(data.metrics)}
                      trades={data.trades}
                    />
                  )}
                </div>
                <div className="journalit-chart-widget__selector journalit-hourly-performance-controls">
                  <select
                    className="journalit-chart-widget__select"
                    aria-label={t(
                      'dashboard.widgets.hourly-performance.bucket-aria'
                    )}
                    value={String(bucketMinutes)}
                    onChange={(event) =>
                      setBucketMinutes(parseBucketMinutes(event.target.value))
                    }
                  >
                    {BUCKET_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {t(
                          'dashboard.widgets.hourly-performance.bucket-option',
                          {
                            minutes: String(option),
                          }
                        )}
                      </option>
                    ))}
                  </select>
                  <select
                    className="journalit-chart-widget__select"
                    aria-label={t(
                      'dashboard.widgets.hourly-performance.metric-aria'
                    )}
                    value={metric}
                    onChange={(event) =>
                      setMetric(parseMetric(event.target.value))
                    }
                  >
                    {METRIC_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {getMetricLabel(option)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="journalit-chart-widget__body">
                <ChartBase height="100%" width="100%" chartRef={chartRef}>
                  <BarChart
                    data={displayChartData}
                    margin={{ top: 6, right: 6, left: 0, bottom: 10 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="var(--background-modifier-border)"
                      strokeOpacity={0.5}
                    />
                    <ReferenceLine
                      y={0}
                      stroke="var(--text-normal, #888888)"
                      strokeOpacity={0.5}
                      strokeDasharray="3 3"
                      strokeWidth={1.5}
                    />
                    <XAxis
                      dataKey="label"
                      tickFormatter={formatXAxisTick}
                      interval={Math.max(
                        0,
                        Math.ceil(chartData.length / 8) - 1
                      )}
                      height={18}
                      tick={{
                        fontSize: 10,
                        fontWeight: 500,
                        fill: 'var(--text-muted)',
                      }}
                      tickMargin={4}
                      tickLine={false}
                      axisLine={{
                        stroke: 'var(--background-modifier-border)',
                        strokeOpacity: 0.5,
                      }}
                    />
                    <YAxis
                      tickFormatter={formatYAxisTick}
                      tick={{
                        fontSize: 11,
                        fontWeight: 500,
                        fill: 'var(--text-muted)',
                      }}
                      domain={axisConfig.domain}
                      ticks={axisConfig.ticks}
                      width={yAxisWidth}
                      scale="linear"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={5}
                    />
                    <RechartsPortalTooltip
                      chartRef={chartRef}
                      placementMode="bar"
                      cursor={{
                        fill: 'var(--interactive-hover)',
                        fillOpacity: 0.1,
                        strokeOpacity: 0.3,
                        strokeWidth: 1,
                        stroke: 'var(--interactive-accent)',
                      }}
                    >
                      {(props) => (
                        <HourlyPerformanceTooltip
                          active={props.active}
                          payload={getHourlyTooltipPayload(props.payload)}
                          metric={metric}
                          useRMultiples={useRMultiples}
                          currencyCode={currencyCode}
                        />
                      )}
                    </RechartsPortalTooltip>
                    <Bar
                      dataKey="displayValue"
                      fill="var(--interactive-accent)"
                      minPointSize={0}
                      isAnimationActive={true}
                      animationDuration={700}
                      animationEasing="ease-out"
                      stroke="var(--background-primary)"
                      strokeWidth={0.8}
                      strokeOpacity={0.5}
                      radius={[2, 2, 0, 0]}
                      shape={(props: HourlyBarShapeProps) => {
                        const fill = isMasked
                          ? 'var(--text-muted)'
                          : (props.payload?.trades ?? 0) > 0 &&
                              (props.payload?.displayValue ?? 0) === 0
                            ? 'var(--text-muted)'
                            : (props.payload?.displayValue ?? 0) >= 0
                              ? 'var(--chart-positive)'
                              : 'var(--chart-negative)';
                        const safeX = props.x ?? 0;
                        const safeY = props.y ?? 0;
                        const safeWidth = props.width ?? 0;
                        const safeHeight = props.height ?? 0;
                        const adjustedHeight =
                          safeHeight < 0 ? Math.abs(safeHeight) : safeHeight;
                        const adjustedY =
                          safeHeight < 0 ? safeY + safeHeight : safeY;
                        const showBreakevenMarker =
                          !isMasked &&
                          (props.payload?.trades ?? 0) > 0 &&
                          (props.payload?.displayValue ?? 0) === 0;

                        return (
                          <rect
                            x={safeX}
                            y={
                              showBreakevenMarker ? adjustedY - 1.5 : adjustedY
                            }
                            width={safeWidth}
                            height={
                              showBreakevenMarker
                                ? 3
                                : adjustedHeight > 0
                                  ? adjustedHeight
                                  : 0
                            }
                            fill={fill}
                            stroke={props.stroke}
                            strokeWidth={props.strokeWidth}
                            strokeOpacity={props.strokeOpacity}
                            rx={2}
                            ry={2}
                          />
                        );
                      }}
                    />
                  </BarChart>
                </ChartBase>
              </div>
            </div>
          );
        }}
      </BaseWidget>
    );
  }
);

HourlyPerformanceChart.displayName = 'HourlyPerformanceChart';
