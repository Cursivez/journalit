

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
import {
  CurrencyCode,
  parseCuratedCurrencyCode,
} from '../../../../utils/currencyConfig';
import {
  getEffectivePnL,
  isPnlContributingTrade,
} from '../../../../utils/tradeStatusUtils';
import type { WeekdayPerformanceMetric } from '../../../../settings/types';
import { getTradeAnalyticsTradingDay } from '../../../../utils/tradeAnalyticsDate';
import {
  buildCurrencyConversionMetadata,
  CurrencyConversionInfo,
} from '../../../shared/display/CurrencyConversionInfo';

type WeekdayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

interface WeekdayAggregate {
  key: WeekdayKey;
  label: string;
  netPnL: number;
  netR: number;
  trades: number;
  rTrades: number;
  wins: number;
  losses: number;
}

interface WeekdayPerformanceDataPoint extends WeekdayAggregate {
  winRate: number;
  displayValue: number;
}

type TooltipContentLike<TData> = TooltipProps<number, string> & {
  payload?: ReadonlyArray<{
    payload?: TData;
  }>;
};

interface WeekdayBarShapeProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  payload?: WeekdayPerformanceDataPoint;
  stroke?: string;
  strokeWidth?: string | number;
  strokeOpacity?: string | number;
}

type WeekdayTooltipProps = TooltipContentLike<WeekdayPerformanceDataPoint> & {
  useRMultiples: boolean;
  currencyCode: CurrencyCode;
  selectedMetric: WeekdayPerformanceMetric;
};

const DAY_ORDER: WeekdayKey[] = [
  'mon',
  'tue',
  'wed',
  'thu',
  'fri',
  'sat',
  'sun',
];
const DAY_KEY_BY_STANDARD_INDEX: Record<number, WeekdayKey> = {
  0: 'sun',
  1: 'mon',
  2: 'tue',
  3: 'wed',
  4: 'thu',
  5: 'fri',
  6: 'sat',
};
const WEEKEND_DAY_KEYS = new Set<WeekdayKey>(['sat', 'sun']);
const METRIC_OPTIONS: WeekdayPerformanceMetric[] = ['net', 'winRate', 'trades'];

const buildTradeCountAxis = (maxTrades: number) => {
  const upperBound = Math.max(1, Math.ceil(maxTrades));
  const targetSteps = 5;
  const step = Math.max(1, Math.ceil(upperBound / targetSteps));
  const axisMax = Math.ceil(upperBound / step) * step;
  const ticks: number[] = [];

  for (let tick = 0; tick <= axisMax; tick += step) {
    ticks.push(tick);
  }

  return {
    domain: [0, axisMax] as [number, number],
    ticks,
    step,
  };
};

const normalizeMetric = (
  value: string | undefined
): WeekdayPerformanceMetric => {
  switch (value) {
    case 'winRate':
    case 'trades':
      return value;
    default:
      return 'net';
  }
};

const getDashboardRealizedTradingDay = (trade: unknown): Date | undefined => {
  if (
    !trade ||
    typeof trade !== 'object' ||
    !('_dashboardRealizedTradingDay' in trade)
  ) {
    return undefined;
  }
  const value = trade._dashboardRealizedTradingDay;
  return value instanceof Date ? value : undefined;
};

const isWeekdayTooltipContent = (
  value: unknown
): value is TooltipContentLike<WeekdayPerformanceDataPoint> => {
  if (!value || typeof value !== 'object' || !('payload' in value)) {
    return false;
  }

  const payloadValue = value.payload;
  const payload = Array.isArray(payloadValue) ? payloadValue : [];
  const firstPayload: unknown = payload[0];
  return Boolean(
    firstPayload &&
    typeof firstPayload === 'object' &&
    'payload' in firstPayload
  );
};

const getMetricLabel = (metric: WeekdayPerformanceMetric): string => {
  switch (metric) {
    case 'winRate':
      return t('dashboard.widgets.weekday-performance.metric.win-rate');
    case 'trades':
      return t('dashboard.widgets.weekday-performance.metric.trades');
    case 'net':
    default:
      return t('dashboard.widgets.weekday-performance.metric.net');
  }
};

const formatMetricValue = (
  metric: WeekdayPerformanceMetric,
  data: WeekdayPerformanceDataPoint,
  currencyCode: CurrencyCode,
  useRMultiples: boolean,
  formatValue: ReturnType<typeof useDisplayFormatter>['formatValue']
): string => {
  if (metric === 'net') {
    return formatValue({
      kind: 'pnl',
      value: data.netPnL,
      currencyCode,
      rMultiple: useRMultiples ? data.netR : undefined,
    });
  }

  if (metric === 'winRate') {
    return formatValue({
      kind: 'returnPercent',
      value: data.winRate,
      signed: false,
      precision: 1,
    });
  }

  return String(data.trades);
};

const WeekdayPerformanceTooltip: React.FC<WeekdayTooltipProps> = ({
  active,
  payload,
  useRMultiples,
  currencyCode,
  selectedMetric,
}) => {
  const { formatValue, shouldMask } = useDisplayFormatter();
  const data = payload?.[0]?.payload;

  if (!active || !data) return null;

  const netValue = useRMultiples ? data.netR : data.netPnL;
  const netFormatted = formatMetricValue(
    'net',
    data,
    currencyCode,
    useRMultiples,
    formatValue
  );
  const isNetMasked = shouldMask('pnl');
  const isWinRateMasked = shouldMask('returnPercent');
  const winRateLine = isWinRateMasked
    ? `${t('dashboard.widgets.weekday-performance.metric.win-rate')}: ${formatValue(
        {
          kind: 'returnPercent',
          value: data.winRate,
          signed: false,
          precision: 1,
        }
      )}`
    : t('dashboard.widgets.weekday-performance.tooltip.win-rate', {
        rate: formatValue({
          kind: 'returnPercent',
          value: data.winRate,
          signed: false,
          precision: 1,
        }),
        wins: String(data.wins),
        losses: String(data.losses),
      });

  return (
    <div className="journalit-chart-tooltip">
      <div className="journalit-chart-tooltip-date">{data.label}</div>

      <div
        className={`journalit-chart-tooltip-value ${isNetMasked ? '' : netValue >= 0 ? 'positive' : 'negative'}`}
      >
        {netFormatted}
      </div>

      {selectedMetric === 'winRate' && data.trades > 0 && (
        <div className="journalit-chart-tooltip-info">{winRateLine}</div>
      )}

      {selectedMetric === 'trades' && data.trades > 0 && (
        <div className="journalit-chart-tooltip-info">
          {t('dashboard.widgets.weekday-performance.tooltip.trades', {
            count: String(data.trades),
          })}
        </div>
      )}

      {data.trades > 0 ? (
        <>
          {selectedMetric !== 'winRate' && (
            <div className="journalit-chart-tooltip-info">{winRateLine}</div>
          )}
          {selectedMetric !== 'trades' && (
            <div className="journalit-chart-tooltip-info journalit-chart-tooltip-info--tight">
              {t('dashboard.widgets.weekday-performance.tooltip.trades', {
                count: String(data.trades),
              })}
            </div>
          )}
        </>
      ) : (
        <div className="journalit-chart-tooltip-info">
          {t('dashboard.widgets.weekday-performance.tooltip.no-trades')}
        </div>
      )}
    </div>
  );
};

export const WeekdayPerformanceChart = React.memo<BaseWidgetProps>(
  ({ filters, dateFormat }) => {
    const chartRef = React.useRef<HTMLDivElement>(null);
    const plugin = usePlugin();
    const { currency } = useCurrency();
    const { formatValue, shouldMask } = useDisplayFormatter();

    const persistedMetric = normalizeMetric(
      plugin?.settings?.dashboard?.weekdayPerformanceMetric
    );
    const [selectedMetric, setSelectedMetric] =
      React.useState<WeekdayPerformanceMetric>(persistedMetric);

    React.useEffect(() => {
      setSelectedMetric(persistedMetric);
    }, [persistedMetric]);

    const handleMetricChange = React.useCallback(
      async (nextMetric: WeekdayPerformanceMetric) => {
        setSelectedMetric(nextMetric);

        if (!plugin?.settings?.dashboard) return;

        plugin.settings.dashboard.weekdayPerformanceMetric = nextMetric;
        try {
          await plugin.saveSettings();
        } catch (error) {
          console.error('Failed to save weekday performance metric:', error);
        }
      },
      [plugin]
    );

    const displayRMultiples =
      plugin?.settings?.trade?.displayRMultiples ?? false;
    const skipWeekends = plugin?.settings?.trade?.skipWeekends ?? true;
    const defaultRiskAmount = plugin?.settings?.trade?.defaultRiskAmount;

    const breakEvenRange = normalizeBreakEvenRange(plugin?.settings?.trade);
    const breakEvenSettings = {
      breakEvenRangeMin: breakEvenRange.min,
      breakEvenRangeMax: breakEvenRange.max,
      breakEvenThresholdMode:
        plugin?.settings?.trade?.breakEvenThresholdMode ?? 'fixed',
      breakEvenThresholdPercent:
        plugin?.settings?.trade?.breakEvenThresholdPercent,
    };

    const weekdayLabelMap: Record<WeekdayKey, string> = {
      mon: t('calendar.day.mon'),
      tue: t('calendar.day.tue'),
      wed: t('calendar.day.wed'),
      thu: t('calendar.day.thu'),
      fri: t('calendar.day.fri'),
      sat: t('calendar.day.sat'),
      sun: t('calendar.day.sun'),
    };

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
          const currencyCode = parseCuratedCurrencyCode(activeCurrency);

          const visibleDays = skipWeekends
            ? DAY_ORDER.filter((dayKey) => !WEEKEND_DAY_KEYS.has(dayKey))
            : DAY_ORDER;

          const aggregates = new Map<WeekdayKey, WeekdayAggregate>(
            visibleDays.map((dayKey) => [
              dayKey,
              {
                key: dayKey,
                label: weekdayLabelMap[dayKey],
                netPnL: 0,
                netR: 0,
                trades: 0,
                rTrades: 0,
                wins: 0,
                losses: 0,
              },
            ])
          );

          const analyticsDateBasis =
            plugin?.settings?.trade?.analyticsDateBasis ?? 'entry';
          const sourceTrades =
            analyticsDateBasis === 'exit'
              ? (data.realizedEventTrades ?? data.trades)
              : data.trades;
          const closedTrades = sourceTrades.filter((trade) =>
            isPnlContributingTrade(trade)
          );

          closedTrades.forEach((trade) => {
            const events = [
              {
                tradingDay:
                  getDashboardRealizedTradingDay(trade) ??
                  getTradeAnalyticsTradingDay(
                    trade,
                    analyticsDateBasis,
                    plugin
                  ),
                pnl: getEffectivePnL(trade),
                useStoredRMultiple: analyticsDateBasis !== 'exit',
              },
            ];

            events.forEach(({ tradingDay, pnl, useStoredRMultiple }) => {
              if (!tradingDay) {
                return;
              }

              const dayKey = DAY_KEY_BY_STANDARD_INDEX[tradingDay.getDay()];
              const bucket = aggregates.get(dayKey);

              if (!bucket) return;

              bucket.netPnL += pnl;
              bucket.trades += 1;

              const outcome = classifyPnLWithBreakEvenSettings(
                pnl,
                breakEvenSettings,
                trade.breakEvenAccountCurrentBalance
              );
              if (outcome === 'win') {
                bucket.wins += 1;
              } else if (outcome === 'loss') {
                bucket.losses += 1;
              }

              const effectiveR = calculateEffectiveRMultiple(
                pnl,
                useStoredRMultiple ? trade.rMultiple : undefined,
                trade.riskAmount,
                defaultRiskAmount
              );
              if (effectiveR !== undefined && Number.isFinite(effectiveR)) {
                bucket.netR += effectiveR;
                bucket.rTrades += 1;
              }
            });
          });

          const hasCompleteRCoverage = Array.from(aggregates.values()).every(
            (item) => item.trades === 0 || item.trades === item.rTrades
          );
          const useRMultiples = displayRMultiples && hasCompleteRCoverage;

          const isSelectedMetricMasked =
            (selectedMetric === 'net' &&
              shouldMask(useRMultiples ? 'rMultiple' : 'pnl')) ||
            (selectedMetric === 'winRate' && shouldMask('returnPercent'));

          const chartData: WeekdayPerformanceDataPoint[] = visibleDays.map(
            (dayKey) => {
              const item = aggregates.get(dayKey);
              if (!item) {
                return {
                  key: dayKey,
                  label: weekdayLabelMap[dayKey],
                  netPnL: 0,
                  netR: 0,
                  trades: 0,
                  rTrades: 0,
                  wins: 0,
                  losses: 0,
                  winRate: 0,
                  displayValue: 0,
                };
              }

              const decidedTrades = item.wins + item.losses;
              const winRate =
                decidedTrades > 0 ? (item.wins / decidedTrades) * 100 : 0;

              let displayValue: number;
              if (selectedMetric === 'winRate') {
                displayValue = winRate;
              } else if (selectedMetric === 'trades') {
                displayValue = item.trades;
              } else {
                displayValue = useRMultiples ? item.netR : item.netPnL;
              }

              return {
                ...item,
                winRate,
                displayValue,
              };
            }
          );

          const displayChartData = isSelectedMetricMasked
            ? chartData.map((item) => ({ ...item, displayValue: 1 }))
            : chartData;

          const axisConfig = (() => {
            if (isSelectedMetricMasked) {
              return generateNiceAxis(0, 1, 6, true, false);
            }

            if (selectedMetric === 'winRate') {
              const maxWinRate = Math.max(
                ...chartData.map((item) => item.winRate),
                0
              );
              const winRateCeiling = Math.min(
                100,
                Math.max(10, Math.ceil(maxWinRate / 10) * 10)
              );
              return generateNiceAxis(0, winRateCeiling, 6, true, false);
            }

            if (selectedMetric === 'trades') {
              const maxTrades = Math.max(
                ...chartData.map((item) => item.trades),
                0
              );
              return buildTradeCountAxis(maxTrades);
            }

            const dataMin = Math.min(
              ...chartData.map((item) => item.displayValue)
            );
            const dataMax = Math.max(
              ...chartData.map((item) => item.displayValue)
            );
            return generateNiceAxis(dataMin, dataMax, 6, true, true);
          })();

          const formatYAxisTick = (value: number) => {
            if (selectedMetric === 'winRate') {
              return formatValue({
                kind: 'returnPercent',
                value,
                signed: false,
                precision: value < 10 ? 1 : 0,
              });
            }

            if (selectedMetric === 'trades') {
              return Number.isInteger(value) ? `${value}` : value.toFixed(1);
            }

            return useRMultiples
              ? formatValue({
                  kind: 'rMultiple',
                  value,
                  precision: 1,
                })
              : formatValue({
                  kind: 'pnl',
                  value,
                  currencyCode,
                });
          };

          const yAxisWidth = calculateYAxisWidth(
            axisConfig.ticks,
            formatYAxisTick
          );

          return (
            <div className="journalit-chart-widget">
              <div className="journalit-chart-widget__header">
                <div className="journalit-chart-widget__title">
                  {t('dashboard.widgets.weekday-performance.title')}
                  {selectedMetric === 'net' && !useRMultiples && (
                    <CurrencyConversionInfo
                      metadata={buildCurrencyConversionMetadata(data.metrics)}
                      trades={data.trades}
                    />
                  )}
                </div>
                <div className="journalit-chart-widget__selector">
                  <select
                    aria-label={t(
                      'dashboard.widgets.weekday-performance.metric-aria'
                    )}
                    className="journalit-chart-widget__select"
                    value={selectedMetric}
                    onChange={(event) =>
                      void handleMetricChange(
                        normalizeMetric(event.target.value)
                      )
                    }
                  >
                    {METRIC_OPTIONS.map((metricOption) => (
                      <option key={metricOption} value={metricOption}>
                        {getMetricLabel(metricOption)}
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
                      height={18}
                      tick={{
                        fontSize: 11,
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
                      {(props) =>
                        isWeekdayTooltipContent(props) ? (
                          <WeekdayPerformanceTooltip
                            {...props}
                            useRMultiples={useRMultiples}
                            currencyCode={currencyCode}
                            selectedMetric={selectedMetric}
                          />
                        ) : null
                      }
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
                      shape={(props: WeekdayBarShapeProps) => {
                        const fill = (() => {
                          if (isSelectedMetricMasked) {
                            return 'var(--text-muted)';
                          }

                          if (selectedMetric === 'net') {
                            return (props.payload?.displayValue ?? 0) >= 0
                              ? 'var(--chart-positive)'
                              : 'var(--chart-negative)';
                          }

                          if ((props.payload?.trades ?? 0) === 0) {
                            return 'var(--background-modifier-border)';
                          }

                          return 'var(--interactive-accent)';
                        })();

                        const safeX = props.x ?? 0;
                        const safeY = props.y ?? 0;
                        const safeWidth = props.width ?? 0;
                        const safeHeight = props.height ?? 0;

                        const adjustedHeight =
                          safeHeight < 0 ? Math.abs(safeHeight) : safeHeight;
                        const adjustedY =
                          safeHeight < 0 ? safeY + safeHeight : safeY;

                        return (
                          <rect
                            x={safeX}
                            y={adjustedY}
                            width={safeWidth}
                            height={adjustedHeight > 0 ? adjustedHeight : 0}
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

WeekdayPerformanceChart.displayName = 'WeekdayPerformanceChart';
