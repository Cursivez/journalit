

import React, { useState, useRef, useEffect } from 'react';
import { BaseWidget, BaseWidgetProps } from './BaseWidget';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  TooltipProps,
} from 'recharts';
import { ChartBase } from '../../../charts/ChartBase';
import { RechartsPortalTooltip } from '../../../charts/RechartsPortalTooltip';
import { Trade } from '../../utils/dataUtils';
import { calculateEffectiveRMultiple } from '../../../../utils/formatting';
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

interface RatioYAxisConfig {
  domain: [number, number];
  ticks: number[];
}

const floorRatioTick = (value: number): number => Math.floor(value * 10) / 10;
const ceilRatioTick = (value: number): number => Math.ceil(value * 10) / 10;

const buildRatioYAxis = (ratios: number[], isMetricMasked: boolean) => {
  if (isMetricMasked || ratios.length === 0) {
    return { domain: [0.5, 1.5] as [number, number], ticks: [0.5, 1, 1.5] };
  }

  const finiteRatios = ratios.filter(Number.isFinite);
  if (finiteRatios.length === 0) {
    return { domain: [0.5, 1.5] as [number, number], ticks: [0.5, 1, 1.5] };
  }

  const dataMin = Math.min(...finiteRatios);
  const dataMax = Math.max(...finiteRatios);
  const distanceFromBreakeven = Math.max(
    Math.abs(dataMin - BREAKEVEN_RATIO),
    Math.abs(dataMax - BREAKEVEN_RATIO),
    RATIO_AXIS_MIN_SPAN / 2
  );
  const paddedDistance = distanceFromBreakeven * 1.15;
  const lower = Math.max(0, floorRatioTick(BREAKEVEN_RATIO - paddedDistance));
  const upper = ceilRatioTick(BREAKEVEN_RATIO + paddedDistance);
  const domain: [number, number] = [lower, upper];
  const ticks = Array.from(new Set([lower, BREAKEVEN_RATIO, upper])).sort(
    (a, b) => a - b
  );

  return { domain, ticks } satisfies RatioYAxisConfig;
};


interface RollingWinLossRatioDataPoint {
  tradeIndex: number;
  ratio: number;
  avgWin: number;
  avgLoss: number;
  avgWinR?: number; 
  avgLossR?: number; 
  label: string; 
}

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
  typeof value.ratio === 'number' &&
  typeof value.avgWin === 'number' &&
  typeof value.avgLoss === 'number' &&
  (value.avgWinR === undefined || typeof value.avgWinR === 'number') &&
  (value.avgLossR === undefined || typeof value.avgLossR === 'number') &&
  typeof value.label === 'string';

const getRollingTooltipDataPoint = (
  payload: readonly unknown[] | undefined
): RollingWinLossRatioDataPoint | undefined => {
  const firstPayload = payload?.[0];
  if (!isRecord(firstPayload)) {
    return undefined;
  }
  const data = firstPayload.payload;
  return isRollingWinLossRatioDataPoint(data) ? data : undefined;
};


const calculateRollingWinLossRatio = (
  trades: Trade[],
  period: RollingPeriod,
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

  for (let i = 0; i < sortedTrades.length; i++) {
    
    const windowStart = Math.max(0, i - period + 1);
    const windowTrades = sortedTrades.slice(windowStart, i + 1);

    
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

    
    const ratio = avgLoss > 0 ? avgWin / avgLoss : 0;

    
    let avgWinR: number | undefined = undefined;
    let avgLossR: number | undefined = undefined;

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
          : undefined;

      
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
          : undefined;
    }

    dataPoints.push({
      tradeIndex: i + 1,
      ratio: Math.round(ratio * 100) / 100, 
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
  currency?: CurrencyCode;
  formatValue: ReturnType<typeof useDisplayFormatter>['formatValue'];
  shouldMask: ReturnType<typeof useDisplayFormatter>['shouldMask'];
};


const RollingWinLossRatioTooltip = (props: CustomTooltipProps) => {
  const {
    active,
    payload,
    currency = CurrencyCode.USD,
    formatValue,
    shouldMask,
  } = props;
  const data = getRollingTooltipDataPoint(payload);

  if (!active || !data) return null;

  const isPnlMasked = shouldMask('pnl');
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
        {t('dashboard.rolling_win_loss.ratio_label', {
          ratio: formatValue({
            kind: 'metric',
            value: data.ratio,
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
          const displayChartData = isMetricMasked
            ? chartData.map((point) => ({ ...point, displayRatio: 1 }))
            : chartData.map((point) => ({
                ...point,
                displayRatio: point.ratio,
              }));

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
                      dot={false}
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
            </div>
          );
        }}
      </BaseWidget>
    );
  }
);

RollingWinLossRatioChart.displayName = 'RollingWinLossRatioChart';
