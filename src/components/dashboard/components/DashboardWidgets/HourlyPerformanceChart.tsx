

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
import { CurrencyCode } from '../../../../utils/currencyConfig';
import { isPnlContributingTrade } from '../../../../utils/tradeStatusUtils';
import { getTradeRealizedPnlEvents } from '../../../../utils/tradeAnalyticsDate';
import {
  buildCurrencyConversionMetadata,
  CurrencyConversionInfo,
} from '../../../shared/display/CurrencyConversionInfo';

interface HourlyPerformanceDataPoint {
  hour: number;
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

type TooltipContentLike<TData> = TooltipProps<number, string> & {
  payload?: ReadonlyArray<{ payload?: TData }>;
};

type HourlyTooltipProps = TooltipContentLike<HourlyPerformanceDataPoint> & {
  useRMultiples: boolean;
  currencyCode: CurrencyCode;
};

const HOURS = Array.from({ length: 24 }, (_, hour) => hour);

const formatHourLabel = (hour: number): string =>
  `${String(hour).padStart(2, '0')}:00`;

const HourlyPerformanceTooltip: React.FC<HourlyTooltipProps> = ({
  active,
  payload,
  useRMultiples,
  currencyCode,
}) => {
  const { formatValue, shouldMask } = useDisplayFormatter();
  const data = payload?.[0]?.payload as HourlyPerformanceDataPoint | undefined;

  if (!active || !data) return null;

  const value = useRMultiples ? data.netR : data.netPnL;
  const isMasked = shouldMask(useRMultiples ? 'rMultiple' : 'pnl');
  const isWinRateMasked = shouldMask('returnPercent');
  const decidedTrades = data.wins + data.losses;
  const winRate = decidedTrades > 0 ? (data.wins / decidedTrades) * 100 : 0;
  const formatted = useRMultiples
    ? formatValue({ kind: 'rMultiple', value: data.netR, precision: 2 })
    : formatValue({ kind: 'pnl', value: data.netPnL, currencyCode });

  return (
    <div className="journalit-chart-tooltip">
      <div className="journalit-chart-tooltip-date">{data.label}</div>
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
          const currencyCode = activeCurrency as CurrencyCode;

          const aggregates = new Map<number, HourlyPerformanceDataPoint>(
            HOURS.map((hour) => [
              hour,
              {
                hour,
                label: formatHourLabel(hour),
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
          const tradeIdsByHour = new Map<number, Set<string>>(
            HOURS.map((hour) => [hour, new Set<string>()])
          );

          data.trades
            .filter((trade) => isPnlContributingTrade(trade))
            .forEach((trade) => {
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

                const bucket = aggregates.get(event.date.getHours());
                if (!bucket) continue;

                bucket.netPnL += event.pnl;
                bucket.pnlEvents += 1;

                const hourTradeIds = tradeIdsByHour.get(event.date.getHours());
                if (tradeKey && hourTradeIds && !hourTradeIds.has(tradeKey)) {
                  hourTradeIds.add(tradeKey);
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

          const hourlyData = HOURS.map((hour) => aggregates.get(hour)!);
          const hasCompleteRCoverage = hourlyData.every(
            (item) => item.pnlEvents === 0 || item.pnlEvents === item.rTrades
          );
          const useRMultiples = displayRMultiples && hasCompleteRCoverage;
          const isMasked = shouldMask(useRMultiples ? 'rMultiple' : 'pnl');

          const chartData = hourlyData.map((item) => ({
            ...item,
            displayValue: useRMultiples ? item.netR : item.netPnL,
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
                      interval={1}
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
                          {...(props as TooltipContentLike<HourlyPerformanceDataPoint>)}
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
                      shape={(props: any) => {
                        const fill = isMasked
                          ? 'var(--text-muted)'
                          : props.payload?.trades > 0 &&
                              props.payload?.displayValue === 0
                            ? 'var(--text-muted)'
                            : props.payload?.displayValue >= 0
                              ? 'var(--chart-positive)'
                              : 'var(--chart-negative)';
                        const safeX = props.x || 0;
                        const safeY = props.y || 0;
                        const safeWidth = props.width || 0;
                        const safeHeight = props.height || 0;
                        const adjustedHeight =
                          safeHeight < 0 ? Math.abs(safeHeight) : safeHeight;
                        const adjustedY =
                          safeHeight < 0 ? safeY + safeHeight : safeY;
                        const showBreakevenMarker =
                          !isMasked &&
                          props.payload?.trades > 0 &&
                          props.payload?.displayValue === 0;

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
