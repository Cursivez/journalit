import { logger } from '../../utils/logger';


import React, { useEffect, useMemo, useCallback } from 'react';
import { useDisplayFormatter } from '../../hooks/useDisplayPolicy';
import { t } from '../../lang/helpers';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import type { TooltipProps } from 'recharts';
import {
  generateNiceAxis,
  calculateYAxisWidth,
  PnLChartDataPoint,
} from '../../utils/chartUtils';
import { ChartBase } from './ChartBase';
import { ChartTooltip } from './ChartTooltip';
import { RechartsPortalTooltip } from './RechartsPortalTooltip';
import { PnLChartProps } from './types';
import { useCurrency } from '../../contexts/CurrencyContext';
import type JournalitPlugin from '../../main';

const EPSILON = 1e-6; 

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const isPnLChartDataPoint = (value: unknown): value is PnLChartDataPoint =>
  isRecord(value) &&
  typeof value.date === 'string' &&
  typeof value.dateKey === 'string' &&
  typeof value.pnl === 'number';

const getPnLTooltipPayload = (
  payload: readonly unknown[] | undefined
): PnLChartDataPointTooltipProps['payload'] => {
  if (!payload) return undefined;
  return payload.flatMap((item) => {
    if (!isRecord(item) || !isPnLChartDataPoint(item.payload)) {
      return [];
    }
    return [{ payload: item.payload }];
  });
};

type PnLChartDataPointTooltipProps = Partial<TooltipProps<number, string>> & {
  payload?: Array<{ payload: PnLChartDataPoint }>;
};

type PnLChartDataPointChartClickEvent = {
  activePayload?: Array<{ payload: PnLChartDataPoint }>;
  activeTooltipIndex?: number | string | null;
};

interface SharedPnLChartProps extends PnLChartProps {
  plugin?: JournalitPlugin | null; 
  currencyOverride?: string; 
}


const renderPnLTooltip = (
  props: PnLChartDataPointTooltipProps,
  displayRMultiples?: boolean,
  currencyOverride?: string,
  showAccountTooltip?: boolean
) => {
  return (
    <ChartTooltip<PnLChartDataPoint>
      active={props.active}
      payload={props.payload}
      valueKey="pnl"
      valueType="pnl"
      displayRMultiples={displayRMultiples}
      currencyOverride={currencyOverride}
      additionalItems={(data: PnLChartDataPoint) => {
        const items = [];

        if (data.tradePnL !== 0) {
          items.push({
            label: t('chart.tooltip.trade-pnl'),
            value: data.tradePnL,
            type: 'pnl' as const,
            isPositive: data.tradePnL > 0,
            isNegative: data.tradePnL < 0,
            rMultiple: data.tradeR,
          });
        }

        if (showAccountTooltip && data.accounts) {
          items.push({
            label: '',
            value: data.accounts,
            type: 'text' as const,
          });
        }

        return items;
      }}
    />
  );
};



let gradientIdCounter = 0;


const POSITIVE_COLOR = 'var(--chart-positive, #43a047)';
const NEGATIVE_COLOR = 'var(--chart-negative, #e53935)';

export const SharedPnLChart = React.memo<SharedPnLChartProps>(
  ({
    data,
    height = '100%',
    width = '100%',
    minValue,
    maxValue,
    gradientTransitionOffset,
    margin = { top: 6, right: 5, left: 0, bottom: 10 },
    className = '',
    styleVars,
    tooltipProps = {},
    showTooltip = true,
    customTooltip,
    fillGradient = true,
    onChartClick,
    onPointClick,
    plugin,
    currencyOverride,
    showAccountTooltip = false,
  }) => {
    const chartRef = React.useRef<HTMLDivElement>(null);
    const { currency: globalCurrency } = useCurrency();
    
    const currency = currencyOverride || globalCurrency;
    const DEBUG_CHARTS: boolean =
      (typeof window !== 'undefined' && window.JOURNALIT_DEBUG_CHARTS) === true;

    
    const displayRMultiples =
      plugin?.settings?.trade?.displayRMultiples ?? false;
    const { formatValue, shouldMask } = useDisplayFormatter();
    const isPnlMasked = shouldMask('pnl');
    const positiveColor = isPnlMasked ? 'var(--text-muted)' : POSITIVE_COLOR;
    const negativeColor = isPnlMasked ? 'var(--text-muted)' : NEGATIVE_COLOR;

    
    const chartIdRef = React.useRef(`pnl-chart-${++gradientIdCounter}`);
    const chartId = chartIdRef.current;
    const displayData = useMemo<
      Array<PnLChartDataPoint & { displayPnl: number }>
    >(
      () =>
        data.map((item) => ({
          ...item,
          displayPnl: isPnlMasked ? 1 : item.pnl,
        })),
      [data, isPnlMasked]
    );

    
    const dataRange = useMemo(() => {
      const values = displayData.map((item) => item.displayPnl);
      const dataMin = Math.min(...values);
      const dataMax = Math.max(...values);
      return { dataMin, dataMax };
    }, [displayData]);

    const dateLabelLookup = useMemo(() => {
      const map = new Map<string, string>();
      data.forEach((point) => {
        map.set(point.dateKey, point.date);
      });
      return map;
    }, [data]);

    
    const interpolateRMultiple = useCallback(
      (targetPnL: number): number | undefined => {
        if (!displayRMultiples || data.length === 0) return undefined;

        
        let lower = data[0];
        let upper = data[data.length - 1];

        for (let i = 0; i < data.length - 1; i++) {
          if (data[i].pnl <= targetPnL && data[i + 1].pnl >= targetPnL) {
            lower = data[i];
            upper = data[i + 1];
            break;
          }
        }

        
        if (
          lower.cumulativeR !== undefined &&
          upper.cumulativeR !== undefined
        ) {
          const pnlRange = upper.pnl - lower.pnl;
          if (Math.abs(pnlRange) < EPSILON) return lower.cumulativeR;

          const ratio = (targetPnL - lower.pnl) / pnlRange;
          return (
            lower.cumulativeR + ratio * (upper.cumulativeR - lower.cumulativeR)
          );
        }

        return undefined;
      },
      [displayRMultiples, data]
    );

    
    
    const axisConfig = useMemo(() => {
      const { dataMin, dataMax } = dataRange;

      
      
      
      const effectiveMin = isPnlMasked
        ? 0
        : minValue !== undefined
          ? minValue
          : dataMin;
      const effectiveMax = isPnlMasked
        ? 1
        : maxValue !== undefined
          ? maxValue
          : dataMax;

      
      
      const { domain, ticks } = generateNiceAxis(
        effectiveMin,
        effectiveMax,
        6,
        true,
        true
      );

      const [actualMinValue, actualMaxValue] = domain;

      
      
      
      
      let actualTransitionOffset = gradientTransitionOffset;

      if (actualTransitionOffset === undefined) {
        
        
        const gradientMin = Math.min(0, dataMin); 
        const gradientMax = Math.max(0, dataMax); 
        const gradientRange = gradientMax - gradientMin;

        
        if (
          gradientRange !== 0 &&
          !isNaN(gradientRange) &&
          !isNaN(gradientMax) &&
          !isNaN(gradientMin)
        ) {
          
          const calculatedOffset = ((gradientMax - 0) / gradientRange) * 100;
          actualTransitionOffset = !isNaN(calculatedOffset)
            ? calculatedOffset
            : 50;
        } else {
          
          if (!isNaN(gradientMax)) {
            actualTransitionOffset = gradientMax < 0 ? 100 : 0;
          } else {
            actualTransitionOffset = 50; 
          }
        }

        
        actualTransitionOffset = Math.max(
          0,
          Math.min(100, actualTransitionOffset)
        );
      }

      return {
        actualMinValue,
        actualMaxValue,
        actualTransitionOffset,
        ticks,
      };
    }, [dataRange, isPnlMasked, minValue, maxValue, gradientTransitionOffset]);

    
    const { actualMinValue, actualMaxValue, actualTransitionOffset, ticks } =
      axisConfig;

    
    const formatYAxisTick = useCallback(
      (value: number): string => {
        const interpolatedR = interpolateRMultiple(value);
        return formatValue({
          kind: 'pnl',
          value,
          currencyCode: currency,
          rMultiple: interpolatedR,
        });
      },
      [currency, formatValue, interpolateRMultiple]
    );

    const yAxisWidth = React.useMemo(() => {
      return calculateYAxisWidth(ticks, formatYAxisTick);
    }, [ticks, formatYAxisTick]);

    
    useEffect(() => {
      if (!DEBUG_CHARTS) return;

      logger.debug('[SharedPnLChart] data len/domain', {
        length: data?.length ?? 0,
        domain: [actualMinValue, actualMaxValue],
        ticks,
        offset: actualTransitionOffset,
      });
    }, [
      DEBUG_CHARTS,
      data?.length,
      actualMinValue,
      actualMaxValue,
      ticks,
      actualTransitionOffset,
    ]);

    
    let fillGradientUrl = `url(#${chartId}-gradientDual)`; 
    const strokeGradientUrl = `url(#${chartId}-strokeGradient)`; 

    
    if (actualMinValue >= 0 && actualMaxValue >= 0) {
      
      fillGradientUrl = `url(#${chartId}-gradientPositive)`;
    } else if (actualMaxValue <= 0 && actualMinValue <= 0) {
      
      fillGradientUrl = `url(#${chartId}-gradientNegative)`;
    }
    

    
    const handleChartClick = (event: PnLChartDataPointChartClickEvent) => {
      if (onChartClick) {
        onChartClick(event);
      }

      
      
      if (
        onPointClick &&
        event &&
        event.activePayload &&
        event.activePayload.length > 0
      ) {
        const payload = event.activePayload[0].payload;
        const activeTooltipIndex = Number(event.activeTooltipIndex);
        const indexFromTooltip = Number.isInteger(activeTooltipIndex)
          ? activeTooltipIndex
          : -1;
        const payloadDateKey = payload?.dateKey;
        const index =
          indexFromTooltip >= 0 && indexFromTooltip < data.length
            ? indexFromTooltip
            : data.findIndex(
                (item) =>
                  payloadDateKey !== undefined &&
                  item.dateKey === payloadDateKey
              );
        if (index !== -1) {
          onPointClick(data[index], index);
        }
      }
    };

    return (
      <ChartBase
        chartRef={chartRef}
        height={height}
        width={width}
        className={className}
        styleVars={styleVars}
        onChartClick={onChartClick ? handleChartClick : undefined}
      >
        <AreaChart
          data={displayData}
          margin={margin}
          onClick={handleChartClick}
        >
          <defs>
            
            <linearGradient
              id={`${chartId}-gradientPositive`}
              x1="0"
              y1="1"
              x2="0"
              y2="0"
            >
              
              <stop offset="0%" stopColor={positiveColor} stopOpacity={0.1} />
              <stop offset="100%" stopColor={positiveColor} stopOpacity={0.4} />
            </linearGradient>
            <linearGradient
              id={`${chartId}-gradientNegative`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              
              <stop offset="0%" stopColor={negativeColor} stopOpacity={0.1} />
              <stop offset="100%" stopColor={negativeColor} stopOpacity={0.4} />
            </linearGradient>
            
            <linearGradient
              id={`${chartId}-gradientDual`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor={positiveColor} stopOpacity={0.4} />
              <stop
                offset={`${actualTransitionOffset}%`}
                stopColor={positiveColor}
                stopOpacity={0.1}
              />
              <stop
                offset={`${actualTransitionOffset}%`}
                stopColor={negativeColor}
                stopOpacity={0.1}
              />
              <stop offset="100%" stopColor={negativeColor} stopOpacity={0.4} />
            </linearGradient>
            
            <linearGradient
              id={`${chartId}-strokeGradient`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              {actualTransitionOffset <= 0.1 ? (
                
                <>
                  <stop offset="0%" stopColor={negativeColor} />
                  <stop offset="100%" stopColor={negativeColor} />
                </>
              ) : actualTransitionOffset >= 99.9 ? (
                
                <>
                  <stop offset="0%" stopColor={positiveColor} />
                  <stop offset="100%" stopColor={positiveColor} />
                </>
              ) : (
                
                <>
                  <stop offset="0%" stopColor={positiveColor} />
                  <stop
                    offset={`${Math.max(0.1, actualTransitionOffset - 0.1)}%`}
                    stopColor={positiveColor}
                  />
                  <stop
                    offset={`${Math.min(99.9, actualTransitionOffset + 0.1)}%`}
                    stopColor={negativeColor}
                  />
                  <stop offset="100%" stopColor={negativeColor} />
                </>
              )}
            </linearGradient>
            
            <filter id={`${chartId}-shadow`} height="120%">
              <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.1" />
            </filter>
            
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
            dataKey="dateKey"
            height={16}
            tickMargin={4}
            tickLine={false}
            axisLine={{
              stroke: 'var(--background-modifier-border)',
              strokeOpacity: 0.5,
            }}
            tickFormatter={(value: string | number) => {
              const key = String(value);
              return dateLabelLookup.get(key) ?? key;
            }}
          />
          <YAxis
            tickFormatter={formatYAxisTick}
            domain={[actualMinValue, actualMaxValue]}
            allowDataOverflow={false}
            width={yAxisWidth}
            ticks={ticks}
            scale="linear"
            tickLine={true}
            axisLine={{
              stroke: 'var(--background-modifier-border)',
              strokeOpacity: 0.3,
            }}
            tickMargin={5}
          />
          {showTooltip && (
            <RechartsPortalTooltip
              chartRef={chartRef}
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
                  : renderPnLTooltip(
                      {
                        ...runtimeProps,
                        payload: getPnLTooltipPayload(runtimeProps.payload),
                      },
                      displayRMultiples,
                      currencyOverride,
                      showAccountTooltip
                    )
              }
            </RechartsPortalTooltip>
          )}
          <Area
            type="monotone"
            dataKey="displayPnl"
            stroke={
              strokeGradientUrl
            } 
            strokeWidth={2.5}
            fill={
              fillGradient ? fillGradientUrl : 'none'
            } 
            dot={false}
            activeDot={{
              r: 7,
              strokeWidth: 1,
              stroke: 'var(--background-primary)',
              fill: 'var(--interactive-accent, #4299e1)',
              filter: `url(#${chartId}-glow)`,
            }}
            animationDuration={500}
            animationEasing="ease-out"
            filter={`url(#${chartId}-shadow)`}
          />{' '}
        </AreaChart>
      </ChartBase>
    );
  }
);

SharedPnLChart.displayName = 'SharedPnLChart';
