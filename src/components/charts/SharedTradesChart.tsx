

import React, { MouseEvent } from 'react';
import { t } from '../../lang/helpers';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import type { TooltipProps } from 'recharts';
import { EmptyState } from '../shared/EmptyState';
import {
  generateNiceAxis,
  calculateYAxisWidth,
  TradesChartDataPoint,
} from '../../utils/chartUtils';
import { ChartBase } from './ChartBase';
import { ChartTooltip } from './ChartTooltip';
import { RechartsPortalTooltip } from './RechartsPortalTooltip';
import { TradesChartProps } from './types';
import { useCurrency } from '../../contexts/CurrencyContext';
import { usePlugin } from '../../hooks/usePlugin';
import { cssVars } from '../../styles/inlineStylePolicy';
import { useDisplayFormatter } from '../../hooks/useDisplayPolicy';

interface SharedTradesChartProps extends TradesChartProps {
  currencyOverride?: string;
  valueMode?: 'pnl' | 'rMultiple';
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const isTradesChartDataPoint = (
  value: unknown
): value is TradesChartDataPoint =>
  isRecord(value) &&
  typeof value.tradeIndex === 'number' &&
  typeof value.pnl === 'number' &&
  typeof value.fill === 'string';

const getTradesTooltipPayload = (
  payload: readonly unknown[] | undefined
): TradesChartTooltipProps['payload'] => {
  if (!payload) return undefined;
  return payload.flatMap((item) => {
    if (!isRecord(item) || !isTradesChartDataPoint(item.payload)) {
      return [];
    }
    return [{ payload: item.payload }];
  });
};

type TradesChartTooltipProps = Partial<TooltipProps<number, string>> & {
  payload?: Array<{ payload: TradesChartDataPoint }>;
};

interface TradesBarShapeProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  payload?: TradesChartDataPoint;
  index?: number;
  stroke?: string;
  strokeWidth?: string | number;
  strokeOpacity?: string | number;
  filter?: string;
}

const DEFAULT_MARGIN = { top: 6, right: 5, left: 0, bottom: 10 };
const DEFAULT_TOOLTIP_PROPS = {};




const renderTradesChartTooltip = (
  props: TradesChartTooltipProps,
  displayRMultiples?: boolean,
  currencyOverride?: string,
  showAccountTooltip?: boolean,
  valueMode?: 'pnl' | 'rMultiple'
) => {
  if (!props.active || !props.payload || props.payload.length === 0)
    return null;

  const data = props.payload[0].payload;

  
  const entryDate = data.entryTime
    ? new Date(data.entryTime).toLocaleString()
    : 'Unknown';
  const exitDate = data.exitTime
    ? new Date(data.exitTime).toLocaleString()
    : 'Unknown';

  return (
    <ChartTooltip<TradesChartDataPoint>
      active={props.active}
      payload={props.payload}
      displayRMultiples={displayRMultiples}
      currencyOverride={currencyOverride}
      formatter={(data: TradesChartDataPoint) => ({
        title: data.instrument
          ? `${data.instrument} ${data.direction?.toLowerCase() === 'long' ? '↑' : '↓'}`
          : `Trade #${data.tradeIndex + 1}`,
        primaryValue: {
          label:
            valueMode === 'rMultiple'
              ? t('tradelog.column.rMultiple')
              : t('chart.label.pnl'),
          value: data.pnl,
          type: valueMode === 'rMultiple' ? 'rMultiple' : 'pnl',
          isPositive: data.pnl >= 0,
          isNegative: data.pnl < 0,
          rMultiple: data.rMultiple,
        },
        items: [
          {
            label: t('chart.legend.entry'),
            value: entryDate,
            type: 'text',
          },
          {
            label: t('chart.legend.exit'),
            value: exitDate,
            type: 'text',
          },
          {
            label: t('chart.legend.trade'),
            value: `#${data.tradeIndex + 1}`,
            type: 'text',
          },
          ...(showAccountTooltip && data.accounts
            ? [
                {
                  label: '',
                  value: data.accounts,
                  type: 'text' as const,
                },
              ]
            : []),
        ],
      })}
    />
  );
};

function TradesChartEmptyState({
  height,
}: {
  height: SharedTradesChartProps['height'];
}) {
  return (
    <div
      className="journalit-chart-empty-container"
      style={cssVars({
        '--journalit-chart-empty-height':
          typeof height === 'number' ? `${height}px` : height,
      })}
    >
      <EmptyState
        message={t('chart.shared.empty')}
        subMessage={t('chart.shared.empty-sub')}
        iconSize={36}
      />
    </div>
  );
}

function TradesChartDefs() {
  return (
    <defs>
      <filter id="tradesChartBarShadow" height="130%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.1" />
      </filter>
      <filter id="tradesChartBarGlow" height="130%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
        <feColorMatrix
          in="blur"
          mode="matrix"
          values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
          result="glow"
        />
        <feComposite in="SourceGraphic" in2="glow" operator="over" />
      </filter>
    </defs>
  );
}


export const SharedTradesChart: React.FC<SharedTradesChartProps> = ({
  data,
  height = '100%',
  width = '100%',
  minValue,
  maxValue,
  margin = DEFAULT_MARGIN,
  className = '',
  styleVars,
  tooltipProps = DEFAULT_TOOLTIP_PROPS,
  showTooltip = true,
  customTooltip,
  autoRange: _autoRange = true,
  paddingPercentage: _paddingPercentage = 0.05,
  onChartClick,
  onPointClick,
  currencyOverride,
  showAccountTooltip = false,
  valueMode,
}) => {
  const chartRef = React.useRef<HTMLDivElement>(null);
  const { currency: globalCurrency } = useCurrency();
  const currency = currencyOverride || globalCurrency;
  const plugin = usePlugin();
  const displayRMultiples = plugin?.settings?.trade?.displayRMultiples;
  const { formatValue, shouldMask } = useDisplayFormatter();
  const useRValues = valueMode === 'rMultiple';
  const effectiveDisplayRMultiples =
    valueMode === undefined ? displayRMultiples : useRValues;
  const isValueMasked = shouldMask(useRValues ? 'rMultiple' : 'pnl');

  
  const defaultRiskAmount = plugin?.settings?.trade?.defaultRiskAmount;

  const customTickFormatter = React.useCallback(
    (value: number): string => {
      if (useRValues) {
        return formatValue({ kind: 'rMultiple', value });
      }
      const tickRMultiple =
        effectiveDisplayRMultiples && defaultRiskAmount && defaultRiskAmount > 0
          ? value / defaultRiskAmount
          : undefined;

      return formatValue({
        kind: 'pnl',
        value,
        currencyCode: currency,
        rMultiple: tickRMultiple,
      });
    },
    [
      currency,
      defaultRiskAmount,
      effectiveDisplayRMultiples,
      formatValue,
      useRValues,
    ]
  );
  const displayData = React.useMemo(
    () =>
      data.map((entry) => ({
        ...entry,
        displayPnl: isValueMasked ? 1 : entry.pnl,
        fill: isValueMasked ? 'var(--text-muted)' : entry.fill,
      })),
    [data, isValueMasked]
  );

  
  const dataMinMax = React.useMemo(() => {
    const values = displayData.map((item) => item.displayPnl ?? item.pnl);
    const dataMin = Math.min(...values);
    const dataMax = Math.max(...values);
    return { dataMin, dataMax };
  }, [displayData]);

  const { dataMin, dataMax } = dataMinMax;

  
  const { domain, ticks } = React.useMemo(() => {
    
    
    const effectiveMin = isValueMasked
      ? 0
      : minValue !== undefined
        ? minValue
        : dataMin;
    const effectiveMax = isValueMasked
      ? 1
      : maxValue !== undefined
        ? maxValue
        : dataMax;

    return generateNiceAxis(effectiveMin, effectiveMax, 6, true, true);
  }, [dataMin, dataMax, isValueMasked, minValue, maxValue]);

  
  const yAxisWidth = React.useMemo(() => {
    return calculateYAxisWidth(ticks, customTickFormatter);
  }, [ticks, customTickFormatter]);

  
  if (data.length === 0) {
    return <TradesChartEmptyState height={height} />;
  }

  
  const handleRectClick = (
    event: MouseEvent<SVGRectElement>,

    payload: TradesChartDataPoint,
    index: number
  ) => {
    if (onPointClick) {
      onPointClick(payload, index);
    }
  };

  return (
    <ChartBase
      chartRef={chartRef}
      height={height}
      width={width}
      className={className}
      styleVars={styleVars}
      onChartClick={onChartClick}
      skeletonVariant="bar"
    >
      <BarChart data={displayData} margin={margin}>
        <TradesChartDefs />
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
          dataKey="tradeIndex"
          height={16}
          tickFormatter={(value) => `#${value + 1}`}
          tickMargin={4}
          tickLine={false}
          axisLine={{
            stroke: 'var(--background-modifier-border)',
            strokeOpacity: 0.5,
          }}
        />
        <YAxis
          tickFormatter={customTickFormatter}
          domain={domain}
          allowDataOverflow={false}
          width={yAxisWidth}
          ticks={ticks}
          interval="preserveStartEnd"
          scale="linear"
          tickLine={false}
          axisLine={false}
          tickMargin={5}
        />
        {showTooltip && (
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
            tooltipProps={tooltipProps}
          >
            {(runtimeProps) =>
              customTooltip
                ? React.cloneElement(customTooltip, runtimeProps)
                : renderTradesChartTooltip(
                    {
                      ...runtimeProps,
                      payload: getTradesTooltipPayload(runtimeProps.payload),
                    },
                    effectiveDisplayRMultiples,
                    currencyOverride,
                    showAccountTooltip,
                    valueMode
                  )
            }
          </RechartsPortalTooltip>
        )}
        <Bar
          dataKey="displayPnl"
          fill="var(--interactive-accent)" 
          minPointSize={5}
          
          isAnimationActive={true}
          animationDuration={800}
          
          
          animationEasing="ease-out"
          stroke="var(--background-primary)" 
          strokeWidth={0.8} 
          strokeOpacity={0.5} 
          fillOpacity={isValueMasked ? 0.45 : 1}
          filter={isValueMasked ? undefined : 'url(#tradesChartBarShadow)'} 
          
          radius={[2, 2, 0, 0]}
          
          activeBar={{
            filter: isValueMasked ? undefined : 'url(#tradesChartBarGlow)',
            strokeWidth: 1.2,
            strokeOpacity: isValueMasked ? 0.4 : 0.8,
          }}
          

          shape={(props: TradesBarShapeProps) => {
            
            const { x, y, width, height } = props;

            
            const pnlValue = props.payload?.pnl ?? 0;
            const isPositive = pnlValue >= 0;

            
            const fill = isValueMasked
              ? 'var(--text-muted)'
              : props.payload?.fill ||
                (isPositive
                  ? 'var(--chart-positive)'
                  : 'var(--chart-negative)');

            
            const safeX = x || 0;
            const safeY = y || 0;
            const safeWidth = width || 0;
            const safeHeight = height || 0;

            
            
            const adjustedHeight =
              safeHeight < 0 ? Math.abs(safeHeight) : safeHeight;
            const adjustedY = safeHeight < 0 ? safeY + safeHeight : safeY;

            
            
            const radius = isValueMasked
              ? [2, 2, 0, 0]
              : isPositive
                ? [2, 2, 0, 0]
                : [0, 0, 2, 2];

            const index = props.index ?? 0;

            
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
                fillOpacity={isValueMasked ? 0.45 : 1}
                
                filter={
                  isValueMasked
                    ? undefined
                    : isPositive
                      ? props.filter
                      : undefined
                }
                
                rx={radius[0]}
                ry={radius[0]}
                onClick={(e) => {
                  if (props.payload) {
                    handleRectClick(e, props.payload, index);
                  }
                }}
              />
            );
          }}
        />
      </BarChart>
    </ChartBase>
  );
};
