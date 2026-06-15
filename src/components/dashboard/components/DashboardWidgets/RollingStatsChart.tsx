

import React, { useState } from 'react';
import { BaseWidget, BaseWidgetProps } from './BaseWidget';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ReferenceLine,
  TooltipProps,
} from 'recharts';
import { ChartBase } from '../../../charts/ChartBase';
import { RechartsPortalTooltip } from '../../../charts/RechartsPortalTooltip';
import { Trade } from '../../utils/dataUtils';
import {
  getEffectivePnL,
  isPnlContributingTrade,
} from '../../../../utils/tradeStatusUtils';
import { calculateEffectiveRMultiple } from '../../../../utils/formatting';
import { useDisplayFormatter } from '../../../../hooks/useDisplayPolicy';
import { useCurrency } from '../../../../contexts/CurrencyContext';
import { usePlugin } from '../../../../hooks/usePlugin';
import { t } from '../../../../lang/helpers';
import { cssVars } from '../../../../styles/inlineStylePolicy';
import { classifyPnLWithBreakEvenSettings } from '../../../../utils/breakEvenRange';
import {
  getAnalyticsDateBasis,
  getTradeAnalyticsDate,
} from '../../../../utils/tradeAnalyticsDate';
import {
  buildCurrencyConversionMetadata,
  CurrencyConversionInfo,
} from '../../../shared/display/CurrencyConversionInfo';
import {
  calculateYAxisWidth,
  generateNiceAxis,
} from '../../../../utils/chartUtils';


interface RollingStatsDataPoint {
  tradeIndex: number; 
  avgWin: number | null; 
  avgLoss: number | null; 
  avgWinR?: number | null; 
  avgLossR?: number | null; 
  label: string; 
}


type TooltipContentLike<TData> = TooltipProps<number, string> & {
  payload?: ReadonlyArray<{
    payload?: TData;
  }>;
};

interface CustomLegendProps {
  payload?: Array<{
    value: string;
    color: string;
  }>;
}

type DisplayRollingStatsDataPoint = RollingStatsDataPoint & {
  displayAvgWin: number | null;
  displayAvgLoss: number | null;
  displayAvgWinR?: number | null;
  displayAvgLossR?: number | null;
};

const collectVisibleYAxisValues = (
  chartData: DisplayRollingStatsDataPoint[],
  displayRMultiples: boolean
): number[] => {
  const keys = displayRMultiples
    ? (['displayAvgWinR', 'displayAvgLossR'] as const)
    : (['displayAvgWin', 'displayAvgLoss'] as const);

  return chartData.flatMap((point) =>
    keys.flatMap((key) => {
      const value = point[key];
      return typeof value === 'number' && Number.isFinite(value) ? [value] : [];
    })
  );
};

const buildRollingStatsYAxis = (values: number[]) => {
  if (values.length === 0) {
    return generateNiceAxis(0, 1, 5, false);
  }

  const dataMin = Math.min(...values);
  const dataMax = Math.max(...values);

  if (dataMin !== dataMax) {
    return generateNiceAxis(dataMin, dataMax, 5, false);
  }

  if (dataMin === 0) {
    return generateNiceAxis(-1, 1, 5, false);
  }

  const padding = Math.abs(dataMin) * 0.1;
  return generateNiceAxis(dataMin - padding, dataMax + padding, 5, false);
};


const calculateRollingWindowStats = (
  trades: Trade[],
  period: number,
  defaultRiskAmount?: number,
  breakEvenRange?: {
    breakEvenRangeMin?: number;
    breakEvenRangeMax?: number;
    breakEvenThresholdMode?: 'fixed' | 'percentage_current_balance';
    breakEvenThresholdPercent?: number;
  },
  analyticsDateBasis: 'entry' | 'exit' = 'entry'
): RollingStatsDataPoint[] => {
  if (!trades || trades.length === 0) {
    return [];
  }

  
  const closedTrades = trades.filter((trade) => isPnlContributingTrade(trade));

  
  const sortedTrades = [...closedTrades].sort((a, b) => {
    const timeA = getTradeAnalyticsDate(a, analyticsDateBasis)?.getTime() ?? 0;
    const timeB = getTradeAnalyticsDate(b, analyticsDateBasis)?.getTime() ?? 0;
    return timeA - timeB;
  });

  const dataPoints: RollingStatsDataPoint[] = [];

  
  for (let i = 0; i < sortedTrades.length; i++) {
    
    const windowStart = Math.max(0, i - period + 1);
    const windowTrades = sortedTrades.slice(windowStart, i + 1);

    
    const wins = windowTrades.filter(
      (t) =>
        classifyPnLWithBreakEvenSettings(
          getEffectivePnL(t),
          breakEvenRange,
          t.breakEvenAccountCurrentBalance
        ) === 'win'
    );
    const losses = windowTrades.filter(
      (t) =>
        classifyPnLWithBreakEvenSettings(
          getEffectivePnL(t),
          breakEvenRange,
          t.breakEvenAccountCurrentBalance
        ) === 'loss'
    );

    
    const avgWin =
      wins.length > 0
        ? wins.reduce((sum, t) => sum + getEffectivePnL(t), 0) / wins.length
        : null;

    const avgLoss =
      losses.length > 0
        ? Math.abs(
            losses.reduce((sum, t) => sum + getEffectivePnL(t), 0) /
              losses.length
          )
        : null;

    
    let avgWinR: number | null = null;
    let avgLossR: number | null = null;

    if (defaultRiskAmount && defaultRiskAmount > 0) {
      
      const winningRMultiples = wins
        .map((t) =>
          calculateEffectiveRMultiple(
            getEffectivePnL(t),
            t.rMultiple,
            t.riskAmount,
            defaultRiskAmount
          )
        )
        .filter((r): r is number => r !== undefined && !isNaN(r));

      avgWinR =
        winningRMultiples.length > 0
          ? winningRMultiples.reduce((sum, r) => sum + r, 0) /
            winningRMultiples.length
          : null;

      
      const losingRMultiples = losses
        .map((t) =>
          calculateEffectiveRMultiple(
            getEffectivePnL(t),
            t.rMultiple,
            t.riskAmount,
            defaultRiskAmount
          )
        )
        .filter((r): r is number => r !== undefined && !isNaN(r));

      avgLossR =
        losingRMultiples.length > 0
          ? Math.abs(
              losingRMultiples.reduce((sum, r) => sum + r, 0) /
                losingRMultiples.length
            )
          : null;
    }

    dataPoints.push({
      tradeIndex: i + 1,
      avgWin,
      avgLoss,
      avgWinR,
      avgLossR,
      label: `#${i + 1}`,
    });
  }

  return dataPoints;
};


export const RollingStatsChart = React.memo<BaseWidgetProps>(
  ({ filters, dateFormat }) => {
    const chartRef = React.useRef<HTMLDivElement>(null);
    const plugin = usePlugin();
    const { currency } = useCurrency();
    const [period, setPeriod] = useState<number>(20);
    const defaultRiskAmount = plugin?.settings?.trade?.defaultRiskAmount;
    const displayRMultiples =
      plugin?.settings?.trade?.displayRMultiples ?? false;
    const { formatValue, shouldMask } = useDisplayFormatter();
    const isPnlMasked = shouldMask('pnl');

    
    const periodOptions = [10, 20, 30, 50];

    return (
      <BaseWidget
        filters={filters}
        dateFormat={dateFormat}
        skeletonType="line-chart"
      >
        {(data, _userDateFormat) => {
          
          const currencyOverride = data.metrics.isMultiCurrency
            ? data.metrics.conversionBaseCurrency
            : undefined;

          
          const activeCurrency = currencyOverride || currency;

          
          const allStats = calculateRollingWindowStats(
            data.trades,
            period,
            defaultRiskAmount,
            plugin?.settings?.trade,
            getAnalyticsDateBasis(plugin?.settings)
          );
          
          const chartData = allStats.slice(-period);
          const displayChartData = isPnlMasked
            ? chartData.map((point) => ({
                ...point,
                displayAvgWin: point.avgWin === null ? null : 1,
                displayAvgLoss: point.avgLoss === null ? null : -1,
                displayAvgWinR: point.avgWinR === undefined ? undefined : 1,
                displayAvgLossR: point.avgLossR === undefined ? undefined : -1,
              }))
            : chartData.map((point) => ({
                ...point,
                displayAvgWin: point.avgWin,
                displayAvgLoss: point.avgLoss,
                displayAvgWinR: point.avgWinR,
                displayAvgLossR: point.avgLossR,
              }));
          const yAxisValues = collectVisibleYAxisValues(
            displayChartData,
            displayRMultiples
          );
          const yAxisConfig = buildRollingStatsYAxis(yAxisValues);
          const formatYAxisTick = (value: number) => {
            if (!Number.isFinite(value)) {
              return '';
            }
            if (displayRMultiples) {
              return formatValue({
                kind: 'rMultiple',
                value,
              });
            }

            return formatValue({
              kind: 'pnl',
              value,
              currencyCode: activeCurrency,
            });
          };

          
          const renderTooltip = (
            props: TooltipContentLike<RollingStatsDataPoint>
          ) => {
            const data = props.payload?.[0]?.payload;

            if (!props.active || !data) {
              return null;
            }

            return (
              <div className="journalit-chart-tooltip journalit-chart-tooltip--compact">
                <div className="journalit-chart-tooltip-label">
                  {t('dashboard.widgets.rollingStats.tooltip.trade', {
                    label: data.label,
                  })}
                </div>
                {data.avgWin !== null && (
                  <div
                    className={`journalit-chart-tooltip-row ${isPnlMasked ? '' : 'journalit-chart-tooltip-row--positive'} journalit-chart-tooltip-row--spaced`}
                  >
                    {t('dashboard.widgets.rollingStats.avgWin')}:{' '}
                    {formatValue({
                      kind: 'pnl',
                      value: data.avgWin,
                      currencyCode: activeCurrency,
                      showCents: false,
                      rMultiple: data.avgWinR,
                    })}
                  </div>
                )}
                {data.avgLoss !== null && (
                  <div
                    className={`journalit-chart-tooltip-row ${isPnlMasked ? '' : 'journalit-chart-tooltip-row--negative'}`}
                  >
                    {t('dashboard.widgets.rollingStats.avgLoss')}:{' '}
                    {formatValue({
                      kind: 'pnl',
                      value: data.avgLoss,
                      currencyCode: activeCurrency,
                      showCents: false,
                      rMultiple: data.avgLossR ?? undefined,
                    })}
                  </div>
                )}
              </div>
            );
          };

          
          const renderLegend = (props: CustomLegendProps) => {
            const { payload } = props;
            if (!payload) return null;

            return (
              <div className="journalit-chart-widget__legend">
                {payload.map((entry) => (
                  <div
                    key={`legend-${entry.value}`}
                    className="journalit-chart-widget__legend-item"
                  >
                    <div
                      className="journalit-chart-widget__legend-swatch"
                      style={cssVars({ '--legend-color': entry.color })}
                    />
                    <span>{entry.value}</span>
                  </div>
                ))}
              </div>
            );
          };

          return (
            <div className="journalit-chart-widget">
              
              <div className="journalit-chart-widget__header">
                <div className="journalit-chart-widget__title">
                  {t('dashboard.widgets.rollingStats.title')}
                  {!displayRMultiples && (
                    <CurrencyConversionInfo
                      metadata={buildCurrencyConversionMetadata(data.metrics)}
                      trades={data.trades}
                    />
                  )}
                </div>
                <div className="journalit-chart-widget__selector">
                  <select
                    aria-label={t('dashboard.widgets.rollingStats.period')}
                    className="journalit-chart-widget__select"
                    value={period}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (!isNaN(value) && periodOptions.includes(value)) {
                        setPeriod(value);
                      }
                    }}
                  >
                    {periodOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {t('dashboard.widgets.rollingStats.trades', {
                          count: String(opt),
                        })}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              
              <div className="journalit-chart-widget__body">
                <ChartBase
                  height="100%"
                  width="100%"
                  chartRef={chartRef}
                  skeletonVariant="line"
                >
                  <LineChart
                    data={displayChartData}
                    margin={{ top: 6, right: 20, left: 0, bottom: 10 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="var(--background-modifier-border)"
                      strokeOpacity={0.5}
                    />
                    <XAxis
                      dataKey="label"
                      height={16}
                      tickMargin={4}
                      tickLine={false}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      tickFormatter={formatYAxisTick}
                      width={calculateYAxisWidth(
                        yAxisConfig.ticks,
                        formatYAxisTick
                      )}
                      tickLine={true}
                      tickMargin={5}
                      domain={yAxisConfig.domain}
                      ticks={yAxisConfig.ticks}
                    />
                    <RechartsPortalTooltip
                      chartRef={chartRef}
                      cursor={{
                        stroke: 'var(--interactive-accent)',
                        strokeWidth: 1,
                        strokeDasharray: '3 3',
                      }}
                    >
                      {renderTooltip}
                    </RechartsPortalTooltip>
                    <Legend content={renderLegend} />
                    {yAxisConfig.domain[0] <= 0 &&
                      yAxisConfig.domain[1] >= 0 && (
                        <ReferenceLine
                          y={0}
                          stroke="var(--text-normal)"
                          strokeOpacity={0.3}
                          strokeDasharray="3 3"
                          strokeWidth={1}
                        />
                      )}
                    <Line
                      type="monotone"
                      dataKey={
                        displayRMultiples ? 'displayAvgWinR' : 'displayAvgWin'
                      }
                      stroke={
                        isPnlMasked
                          ? 'var(--text-muted)'
                          : 'var(--chart-positive)'
                      }
                      strokeWidth={2.5}
                      dot={false}
                      activeDot={{
                        r: 6,
                        strokeWidth: 1,
                        stroke: 'var(--background-primary)',
                        fill: isPnlMasked
                          ? 'var(--text-muted)'
                          : 'var(--chart-positive)',
                      }}
                      name={t('dashboard.widgets.rollingStats.avgWin')}
                      connectNulls={false}
                      animationDuration={500}
                      animationEasing="ease-out"
                    />
                    <Line
                      type="monotone"
                      dataKey={
                        displayRMultiples ? 'displayAvgLossR' : 'displayAvgLoss'
                      }
                      stroke={
                        isPnlMasked
                          ? 'var(--text-muted)'
                          : 'var(--chart-negative)'
                      }
                      strokeWidth={2.5}
                      dot={false}
                      activeDot={{
                        r: 6,
                        strokeWidth: 1,
                        stroke: 'var(--background-primary)',
                        fill: isPnlMasked
                          ? 'var(--text-muted)'
                          : 'var(--chart-negative)',
                      }}
                      name={t('dashboard.widgets.rollingStats.avgLoss')}
                      connectNulls={false}
                      animationDuration={500}
                      animationEasing="ease-out"
                    />
                  </LineChart>
                </ChartBase>
              </div>
            </div>
          );
        }}
      </BaseWidget>
    );
  }
);

RollingStatsChart.displayName = 'RollingStatsChart';
