

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  TooltipProps,
  ReferenceLine,
} from 'recharts';
import { useCurrency } from '../../contexts/CurrencyContext';
import { usePlugin } from '../../hooks/usePlugin';
import { useDisplayFormatter } from '../../hooks/useDisplayPolicy';
import { ChartBase } from './ChartBase';
import { RechartsPortalTooltip } from './RechartsPortalTooltip';
import { generateNiceAxis, calculateYAxisWidth } from '../../utils/chartUtils';

const EPSILON = 1e-6; 


interface DailyPerformanceDataPoint {
  date: string;
  originalDate?: string; 
  pnl: number;
  displayPnl?: number;
  fill: string;
  trades?: number;
  rMultiple?: number; 
  accountSummary?: string;
}


interface SharedDailyPerformanceChartProps {
  data: DailyPerformanceDataPoint[];
  height?: number | string;
  minValue?: number;
  maxValue?: number;
  currencyOverride?: string;
}


interface CustomTooltipContentProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    dataKey: string;
    payload: DailyPerformanceDataPoint;
  }>;
  currencyOverride?: string;
}

const CustomTooltip: React.FC<CustomTooltipContentProps> = ({
  active,
  payload,
  currencyOverride,
}) => {
  const { currency: globalCurrency } = useCurrency();
  const currency =
    (currencyOverride as typeof globalCurrency) || globalCurrency;
  const { formatValue, shouldMask } = useDisplayFormatter();

  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0].payload;
  const isProfitable = data.pnl >= 0;
  const isPnlMasked = shouldMask('pnl');
  const pnlFormatted = formatValue({
    kind: 'pnl',
    value: data.pnl,
    currencyCode: currency,
    rMultiple: data.rMultiple,
  });

  return (
    <div className="journalit-chart-tooltip">
      <div className="journalit-chart-tooltip-date">{data.date}</div>
      <div
        className={`journalit-chart-tooltip-value ${isPnlMasked ? '' : isProfitable ? 'positive' : 'negative'}`}
      >
        {pnlFormatted}
      </div>

      
      {data.trades !== undefined && (
        <div className="journalit-chart-tooltip-info">
          {data.trades} {data.trades === 1 ? 'trade' : 'trades'}
        </div>
      )}
      {data.accountSummary && (
        <div className="journalit-chart-tooltip-info">
          {data.accountSummary}
        </div>
      )}
    </div>
  );
};


export const SharedDailyPerformanceChart =
  React.memo<SharedDailyPerformanceChartProps>(
    ({ data, height = '100%', minValue, maxValue, currencyOverride }) => {
      const chartRef = React.useRef<HTMLDivElement>(null);
      const { currency: globalCurrency } = useCurrency();
      const currency =
        (currencyOverride as typeof globalCurrency) || globalCurrency;
      const plugin = usePlugin();
      const { formatValue, shouldMask } = useDisplayFormatter();
      const displayRMultiples =
        plugin?.settings?.trade?.displayRMultiples ?? false;
      const isPnlMasked = shouldMask('pnl');

      const displayData = React.useMemo(
        () =>
          data.map((entry) => ({
            ...entry,
            displayPnl: isPnlMasked ? 1 : entry.pnl,
            fill: isPnlMasked ? 'var(--text-muted)' : entry.fill,
          })),
        [data, isPnlMasked]
      );

      const maxDataPoint = React.useMemo(() => {
        if (data.length === 0) return null;
        return data.reduce(
          (max, point) =>
            Math.abs(point.pnl) > Math.abs(max.pnl) ? point : max,
          data[0]
        );
      }, [data]);

      const formatYAxisTick = React.useCallback(
        (value: number): string => {
          if (!displayRMultiples) {
            return formatValue({
              kind: 'pnl',
              value,
              currencyCode: currency,
            });
          }

          if (
            !maxDataPoint ||
            Math.abs(maxDataPoint.pnl) < EPSILON ||
            !maxDataPoint.rMultiple
          ) {
            return formatValue({
              kind: 'pnl',
              value,
              currencyCode: currency,
            });
          }

          const ratio = value / maxDataPoint.pnl;
          const proportionalR = ratio * maxDataPoint.rMultiple;

          return formatValue({
            kind: 'pnl',
            value,
            currencyCode: currency,
            rMultiple: proportionalR,
          });
        },
        [currency, displayRMultiples, formatValue, maxDataPoint]
      );

      
      const { domain, ticks, yAxisWidth } = React.useMemo(() => {
        const values = displayData.map((item) => item.displayPnl ?? item.pnl);
        const dataMin = isPnlMasked
          ? 0
          : minValue !== undefined
            ? minValue
            : Math.min(...values);
        const dataMax = isPnlMasked
          ? 1
          : maxValue !== undefined
            ? maxValue
            : Math.max(...values);
        const axisConfig = generateNiceAxis(dataMin, dataMax, 6, true, true);
        const width = calculateYAxisWidth(axisConfig.ticks, formatYAxisTick);
        return {
          domain: axisConfig.domain,
          ticks: axisConfig.ticks,
          yAxisWidth: width,
        };
      }, [displayData, isPnlMasked, minValue, maxValue, formatYAxisTick]);

      return (
        <ChartBase
          height={height}
          width="100%"
          chartRef={chartRef}
          skeletonVariant="bar"
        >
          <BarChart
            data={displayData}
            margin={{ top: 6, right: 5, left: 0, bottom: 10 }}
          >
            <defs>
              
              <filter id="dailyPerformanceBarShadow" height="130%">
                <feDropShadow
                  dx="0"
                  dy="2"
                  stdDeviation="2"
                  floodOpacity="0.1"
                />
              </filter>
              
              <filter id="dailyPerformanceBarGlow" height="130%">
                <feGaussianBlur
                  in="SourceGraphic"
                  stdDeviation="1.5"
                  result="blur"
                />
                <feColorMatrix
                  in="blur"
                  mode="matrix"
                  values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                  result="glow"
                />
                <feComposite in="SourceGraphic" in2="glow" operator="over" />
              </filter>
            </defs>
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
              ifOverflow="hidden"
            />
            <XAxis
              dataKey="date"
              height={16}
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
              domain={domain}
              allowDataOverflow={false}
              width={yAxisWidth}
              ticks={ticks}
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
              {(tooltipProps) => (
                <CustomTooltip
                  {...(tooltipProps as any)}
                  currencyOverride={currencyOverride}
                />
              )}
            </RechartsPortalTooltip>
            <Bar
              dataKey="displayPnl"
              fill="var(--interactive-accent)" 
              minPointSize={5}
              
              isAnimationActive={true}
              animationDuration={800}
              
              
              animationEasing="ease-out"
              fillOpacity={isPnlMasked ? 0.45 : 1}
              stroke="var(--background-primary)" 
              strokeWidth={0.8} 
              strokeOpacity={0.5} 
              filter="url(#dailyPerformanceBarShadow)" 
              
              radius={[2, 2, 0, 0]}
              
              activeBar={{
                filter: isPnlMasked
                  ? undefined
                  : 'url(#dailyPerformanceBarGlow)',
                strokeWidth: 1.2,
                strokeOpacity: isPnlMasked ? 0.4 : 0.8,
              }}
            />
          </BarChart>
        </ChartBase>
      );
    }
  );

SharedDailyPerformanceChart.displayName = 'SharedDailyPerformanceChart';
