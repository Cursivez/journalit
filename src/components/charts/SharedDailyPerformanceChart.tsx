

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
import { handleRovingChartMarkKeyDown } from './chartKeyboardNavigation';
import { useTwoStageTouchNavigation } from './useTwoStageTouchNavigation';

const EPSILON = 1e-6; 


export interface DailyPerformanceDataPoint {
  date: string;
  originalDate?: string; 
  pnl: number;
  displayPnl?: number;
  fill: string;
  trades?: number;
  rMultiple?: number; 
  accountSummary?: string;
}

interface DailyPerformanceNavigation {
  onPointClick: (point: DailyPerformanceDataPoint, index: number) => void;
  getPointAriaLabel: (point: DailyPerformanceDataPoint) => string;
}

interface SharedDailyPerformanceChartProps {
  data: DailyPerformanceDataPoint[];
  height?: number | string;
  minValue?: number;
  maxValue?: number;
  currencyOverride?: string;
  navigation?: DailyPerformanceNavigation;
}

const isDailyPerformanceDataPoint = (
  value: unknown
): value is DailyPerformanceDataPoint => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  if (!('date' in value) || !('pnl' in value) || !('fill' in value)) {
    return false;
  }
  return (
    typeof value.date === 'string' &&
    typeof value.pnl === 'number' &&
    typeof value.fill === 'string'
  );
};

interface DailyPerformanceBarShapeProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  payload?: DailyPerformanceDataPoint;
  index?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: string | number;
  strokeOpacity?: string | number;
  fillOpacity?: string | number;
  filter?: string;
}

const DailyPerformanceBarShape: React.FC<
  DailyPerformanceBarShapeProps & {
    isInteractive: boolean;
    isInitialTabStop: boolean;
    onKeyboardActivate?: (
      point: DailyPerformanceDataPoint,
      index: number,
      event: React.KeyboardEvent<SVGRectElement>
    ) => void;
    ariaLabel?: string;
  }
> = ({
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  payload,
  index,
  fill,
  stroke,
  strokeWidth,
  strokeOpacity,
  fillOpacity,
  filter,
  isInteractive,
  isInitialTabStop,
  onKeyboardActivate,
  ariaLabel,
}) => {
  const adjustedHeight = height < 0 ? Math.abs(height) : height;
  const adjustedY = height < 0 ? y + height : y;
  const canActivate = isInteractive && payload && index !== undefined;

  return (
    <rect
      x={x}
      y={adjustedY}
      width={Math.max(width, 0)}
      height={Math.max(adjustedHeight, 0)}
      fill={payload?.fill ?? fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeOpacity={strokeOpacity}
      fillOpacity={fillOpacity}
      filter={filter}
      rx={2}
      ry={2}
      cursor={isInteractive ? 'pointer' : undefined}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? (isInitialTabStop ? 0 : -1) : undefined}
      data-journalit-chart-mark={isInteractive ? 'true' : undefined}
      aria-label={isInteractive && payload ? ariaLabel : undefined}
      onKeyDown={
        canActivate
          ? (event) =>
              handleRovingChartMarkKeyDown(event, () =>
                onKeyboardActivate?.(payload, index, event)
              )
          : undefined
      }
    />
  );
};

DailyPerformanceBarShape.displayName = 'DailyPerformanceBarShape';


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
  const currency = currencyOverride || globalCurrency;
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
    ({
      data,
      height = '100%',
      minValue,
      maxValue,
      currencyOverride,
      navigation,
    }) => {
      const chartRef = React.useRef<HTMLDivElement>(null);
      const touchResetKey = React.useMemo(
        () =>
          data.map((point) => point.originalDate ?? point.date).join('\u0000'),
        [data]
      );
      const { handleClick, handleKeyDown, recordTouch } =
        useTwoStageTouchNavigation<string>(touchResetKey);
      const { currency: globalCurrency } = useCurrency();
      const currency = currencyOverride || globalCurrency;
      const plugin = usePlugin();
      const { formatValue, shouldMask } = useDisplayFormatter();
      const displayRMultiples =
        plugin?.settings?.trade?.displayRMultiples ?? false;
      const isPnlMasked = shouldMask('pnl');
      const canNavigate = Boolean(navigation) && !isPnlMasked;

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
              
              rMultiple: undefined,
              fallback: '',
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
                  {...(tooltipProps as TooltipProps<number, string>)}
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
              cursor={canNavigate ? 'pointer' : undefined}
              
              activeBar={{
                filter: isPnlMasked
                  ? undefined
                  : 'url(#dailyPerformanceBarGlow)',
                strokeWidth: 1.2,
                strokeOpacity: isPnlMasked ? 0.4 : 0.8,
                cursor: canNavigate ? 'pointer' : undefined,
              }}
              onClick={
                canNavigate && navigation
                  ? (bar, index, event) => {
                      const pointLike: unknown = bar.payload;
                      if (!isDailyPerformanceDataPoint(pointLike)) return;
                      const point = pointLike;
                      handleClick(point.originalDate ?? point.date, event, () =>
                        navigation.onPointClick(point, index)
                      );
                    }
                  : undefined
              }
              onTouchEnd={
                canNavigate
                  ? (bar) => {
                      const pointLike: unknown = bar.payload;
                      if (isDailyPerformanceDataPoint(pointLike)) {
                        recordTouch(pointLike.originalDate ?? pointLike.date);
                      }
                    }
                  : undefined
              }
              shape={(props: DailyPerformanceBarShapeProps) => (
                <DailyPerformanceBarShape
                  {...props}
                  isInteractive={canNavigate}
                  isInitialTabStop={props.index === 0}
                  ariaLabel={
                    props.payload && navigation
                      ? navigation.getPointAriaLabel(props.payload)
                      : undefined
                  }
                  onKeyboardActivate={(point, index, event) =>
                    handleKeyDown(event, () =>
                      navigation?.onPointClick(point, index)
                    )
                  }
                />
              )}
            />
          </BarChart>
        </ChartBase>
      );
    }
  );

SharedDailyPerformanceChart.displayName = 'SharedDailyPerformanceChart';
