

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
import { useDisplayFormatter } from '../../hooks/useDisplayPolicy';
import { ChartBase } from './ChartBase';
import { RechartsPortalTooltip } from './RechartsPortalTooltip';
import { generateNiceAxis, calculateYAxisWidth } from '../../utils/chartUtils';
import type JournalitPlugin from '../../main';

const EPSILON = 1e-6; 


export interface SetupPerformanceDataPoint {
  name: string;
  pnl: number;
  winRate: number;
  tradeCount: number;
  totalRMultiple?: number; 
  profitFactor?: number; 
}

interface SetupBarShapeProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  payload?: SetupPerformanceDataPoint;
  stroke?: string;
  strokeWidth?: string | number;
  strokeOpacity?: string | number;
  filter?: string;
}


interface SharedSetupPerformanceChartProps {
  data: SetupPerformanceDataPoint[];
  height?: number | string;
  minValue?: number;
  maxValue?: number;
  currencyOverride?: string;
  plugin?: JournalitPlugin | null; 
}


const truncateSetupName = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength - 1) + '…';
};


const ANGLE_THRESHOLD = 4;


interface CustomTooltipContentProps extends TooltipProps<number, string> {
  currencyOverride?: string;
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    dataKey: string;
    payload: SetupPerformanceDataPoint;
  }>;
}

const CustomTooltip: React.FC<CustomTooltipContentProps> = ({
  active,
  payload,
  currencyOverride,
}) => {
  const { currency: globalCurrency } = useCurrency();
  const { formatValue, shouldMask } = useDisplayFormatter();
  const currency = currencyOverride || globalCurrency;

  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0].payload;
  const isProfitable = data.pnl >= 0;
  const isPnlMasked = shouldMask('pnl');
  const pnlFormatted = formatValue({
    kind: 'pnl',
    value: data.pnl,
    currencyCode: currency,
    rMultiple: data.totalRMultiple,
  });

  return (
    <div className="journalit-chart-tooltip">
      <div className="journalit-chart-tooltip-date">{data.name}</div>
      <div
        className={`journalit-chart-tooltip-value ${isPnlMasked ? '' : isProfitable ? 'positive' : 'negative'}`}
      >
        {pnlFormatted}
      </div>

      <div className="journalit-chart-tooltip-info">
        Win Rate:{' '}
        {formatValue({
          kind: 'percentage',
          value: data.winRate,
          precision: 1,
        })}
      </div>

      <div className="journalit-chart-tooltip-info journalit-chart-tooltip-info--tight">
        {data.tradeCount} {data.tradeCount === 1 ? 'trade' : 'trades'}
      </div>
    </div>
  );
};


export const SharedSetupPerformanceChart: React.FC<
  SharedSetupPerformanceChartProps
> = ({
  data,
  height = '100%',
  minValue,
  maxValue,
  currencyOverride,
  plugin,
}) => {
  const chartRef = React.useRef<HTMLDivElement>(null);
  const { currency: globalCurrency } = useCurrency();
  const { formatValue, shouldMask } = useDisplayFormatter();
  const currency = currencyOverride || globalCurrency;
  const isPnlMasked = shouldMask('pnl');
  const displayRMultiples = plugin?.settings?.trade?.displayRMultiples ?? false;

  
  const useAngledLabels = data.length > ANGLE_THRESHOLD;
  
  const maxLabelLength = useAngledLabels ? 10 : 6;

  const chartData = React.useMemo(
    () =>
      data.map((point) => ({
        ...point,
        displayPnl: isPnlMasked ? 1 : point.pnl,
      })),
    [data, isPnlMasked]
  );

  const maxDataPoint = React.useMemo(() => {
    if (data.length === 0) return null;
    return data.reduce(
      (max, point) => (Math.abs(point.pnl) > Math.abs(max.pnl) ? point : max),
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
        !maxDataPoint.totalRMultiple
      ) {
        return formatValue({
          kind: 'pnl',
          value,
          currencyCode: currency,
        });
      }

      const ratio = value / maxDataPoint.pnl;
      const proportionalR = ratio * maxDataPoint.totalRMultiple;

      return formatValue({
        kind: 'pnl',
        value,
        currencyCode: currency,
        rMultiple: proportionalR,
      });
    },
    [currency, displayRMultiples, formatValue, maxDataPoint]
  );

  
  const dataMin = isPnlMasked
    ? 0
    : data.length > 0
      ? Math.min(...data.map((item) => item.pnl))
      : 0;
  const dataMax = isPnlMasked
    ? 1
    : data.length > 0
      ? Math.max(...data.map((item) => item.pnl))
      : 0;

  
  const { domain, ticks } =
    minValue !== undefined && maxValue !== undefined
      ? {
          domain: [minValue, maxValue],
          ticks: generateNiceAxis(minValue, maxValue, 6, true, true).ticks,
        }
      : generateNiceAxis(dataMin, dataMax, 6, true, true);

  
  const yAxisWidth = React.useMemo(() => {
    return calculateYAxisWidth(ticks, formatYAxisTick);
  }, [ticks, formatYAxisTick]);

  return (
    <ChartBase
      height={height}
      width="100%"
      chartRef={chartRef}
      skeletonVariant="bar"
    >
      <BarChart
        data={chartData}
        margin={{ top: 6, right: 5, left: 0, bottom: 5 }}
      >
        <defs>
          
          <filter id="setup-bar-shadow" height="130%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.1" />
          </filter>
          
          <filter id="setup-bar-glow" height="130%">
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
          dataKey="name"
          tick={{ fontSize: 11, fontWeight: 500, fill: 'var(--text-muted)' }}
          tickMargin={useAngledLabels ? 4 : 8}
          tickLine={false}
          axisLine={{
            stroke: 'var(--background-modifier-border)',
            strokeOpacity: 0.5,
          }}
          tickFormatter={(value: string | number) =>
            truncateSetupName(String(value), maxLabelLength)
          }
          interval={0}
          angle={useAngledLabels ? -35 : 0}
          textAnchor={useAngledLabels ? 'end' : 'middle'}
          height={useAngledLabels ? 45 : 25}
        />

        <YAxis
          tickFormatter={formatYAxisTick}
          tick={{ fontSize: 11, fontWeight: 500, fill: 'var(--text-muted)' }}
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
              {...(tooltipProps as TooltipProps<number, string>)}
              currencyOverride={currencyOverride}
            />
          )}
        </RechartsPortalTooltip>

        <Bar
          dataKey="displayPnl"
          fill="var(--interactive-accent)" 
          minPointSize={0} 
          isAnimationActive={true}
          animationDuration={800}
          animationEasing="ease-out"
          stroke="var(--background-primary)"
          strokeWidth={0.8}
          strokeOpacity={0.5}
          filter="url(#setup-bar-shadow)"
          radius={[2, 2, 0, 0]}
          activeBar={{
            filter: 'url(#setup-bar-glow)',
            strokeWidth: 1.2,
            strokeOpacity: 0.8,
          }}
          

          shape={(props: SetupBarShapeProps) => {
            
            const isPositive = props.payload && props.payload.pnl >= 0;
            const fill = isPnlMasked
              ? 'var(--text-muted)'
              : isPositive
                ? 'var(--chart-positive)'
                : 'var(--chart-negative)';

            
            
            const { x, y, width, height } = props;

            
            const safeX = x || 0;
            const safeY = y || 0;
            const safeWidth = width || 0;
            const safeHeight = height || 0;

            
            
            const adjustedHeight =
              safeHeight < 0 ? Math.abs(safeHeight) : safeHeight;
            const adjustedY = safeHeight < 0 ? safeY + safeHeight : safeY;

            
            
            const radius = isPnlMasked
              ? [2, 2, 2, 2]
              : isPositive
                ? [2, 2, 0, 0]
                : [0, 0, 2, 2];

            
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
                filter={isPnlMasked ? undefined : props.filter}
                rx={radius[0]}
                ry={radius[0]}
              />
            );
          }}
        />
      </BarChart>
    </ChartBase>
  );
};
