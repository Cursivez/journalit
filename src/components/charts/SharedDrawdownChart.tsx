

import React, { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import type JournalitPlugin from '../../main';
import {
  DrawdownChartDataPoint,
  generateNiceAxis,
  calculateYAxisWidth,
  getDrawdownChartScaleValue,
  shouldUseDrawdownPercentScale,
} from '../../utils/chartUtils';
import { formatDuration } from '../../utils/formatting';
import { ChartBase } from './ChartBase';
import { ChartTooltip } from './ChartTooltip';
import { RechartsPortalTooltip } from './RechartsPortalTooltip';
import { DrawdownChartProps } from './types';
import { useCurrency } from '../../contexts/CurrencyContext';
import { t } from '../../lang/helpers';
import { useDisplayFormatter } from '../../hooks/useDisplayPolicy';

interface SharedDrawdownChartProps extends DrawdownChartProps {
  plugin?: JournalitPlugin | null; 
  currencyOverride?: string; 
}

let drawdownChartIdCounter = 0;


const renderDrawdownTooltip = (
  props: any,
  displayRMultiples?: boolean,
  defaultRiskAmount?: number,
  currencyOverride?: string,
  preferPercent?: boolean
) => {
  return (
    <ChartTooltip
      {...props}
      displayRMultiples={displayRMultiples}
      currencyOverride={currencyOverride}
      formatter={(data: DrawdownChartDataPoint) => {
        const drawdownPercent =
          data.drawdownPercent != null &&
          Number.isFinite(data.drawdownPercent) &&
          data.drawdownPercentBasisLabel
            ? data.drawdownPercent
            : null;
        const drawdownPercentBasisLabel =
          drawdownPercent != null ? data.drawdownPercentBasisLabel : null;
        const items: Array<{
          label: string;
          value: number | string;
          type?: 'pnl' | 'drawdown' | 'percentage' | 'text';
          rMultiple?: number;
          isNegative?: boolean;
        }> = [
          {
            label: t('chart.tooltip.peak-equity'),
            value: data.peakRealizedPnl,
            type: 'pnl',
            rMultiple:
              data.peakRealizedPnl && defaultRiskAmount && defaultRiskAmount > 0
                ? data.peakRealizedPnl / defaultRiskAmount
                : undefined,
          },
        ];

        if (preferPercent && drawdownPercent != null) {
          items.unshift({
            label: t('chart.tooltip.drawdown-amount'),
            value: data.drawdown,
            type: 'drawdown' as const,
            isNegative: data.drawdown < 0,
            rMultiple:
              data.drawdownR !== undefined
                ? -Math.abs(data.drawdownR)
                : undefined,
          });
        }

        if (!preferPercent && drawdownPercent != null) {
          items.push({
            label: t('chart.tooltip.drawdown-percent', {
              basis: drawdownPercentBasisLabel ?? '',
            }),
            value: -Math.abs(drawdownPercent),
            type: 'percentage' as const,
            isNegative: drawdownPercent > 0,
          });

          if (
            data.drawdownPercentBasisValue != null &&
            Number.isFinite(data.drawdownPercentBasisValue)
          ) {
            items.push({
              label: t('chart.tooltip.percent-basis'),
              value: data.drawdownPercentBasisValue,
              type: 'drawdown' as const,
            });
          }
        }

        if (data.episodeStartDate) {
          items.push(
            {
              label: t('chart.tooltip.episode-start'),
              value: data.episodeStartDate,
              type: 'text' as const,
            },
            {
              label: t('chart.tooltip.underwater-days'),
              value:
                data.underwaterDurationMs != null
                  ? formatDuration(data.underwaterDurationMs)
                  : 'N/A',
              type: 'text' as const,
            },
            {
              label: t('chart.tooltip.underwater-trades'),
              value:
                data.underwaterDurationTrades != null
                  ? String(data.underwaterDurationTrades)
                  : 'N/A',
              type: 'text' as const,
            }
          );
        }

        return {
          title: data.date,
          primaryValue:
            preferPercent && drawdownPercent != null
              ? {
                  label: '',
                  value: -Math.abs(drawdownPercent),
                  type: 'percentage' as const,
                  isNegative: drawdownPercent > 0,
                }
              : {
                  label: '',
                  value: data.drawdown,
                  type: 'drawdown' as const,
                  isNegative: data.drawdown < 0,
                  rMultiple:
                    data.drawdownR !== undefined
                      ? -Math.abs(data.drawdownR)
                      : undefined,
                },
          items,
        };
      }}
    />
  );
};


export const SharedDrawdownChart = React.memo<SharedDrawdownChartProps>(
  ({
    data,
    height = '100%',
    width = '100%',
    minValue,
    maxValue,
    margin = { top: 6, right: 5, left: 0, bottom: 10 },
    className = '',
    styleVars,
    tooltipProps = {},
    showTooltip = true,
    customTooltip,
    autoRange: _autoRange = true,
    paddingPercentage: _paddingPercentage = 0.05,
    onChartClick,
    onPointClick,
    plugin,
    currencyOverride,
  }) => {
    const chartRef = React.useRef<HTMLDivElement>(null);
    const { currency: globalCurrency } = useCurrency();
    const { formatValue, shouldMask } = useDisplayFormatter();
    const isDrawdownMasked = shouldMask('drawdown');
    const displayCurrency = currencyOverride || globalCurrency;
    const preferPercent = shouldUseDrawdownPercentScale(data);

    
    const displayRMultiples =
      plugin?.settings?.trade?.displayRMultiples ?? false;
    const defaultRiskAmount = plugin?.settings?.trade?.defaultRiskAmount;
    const chartIdRef = React.useRef(
      `drawdown-chart-${++drawdownChartIdCounter}`
    );
    const chartId = chartIdRef.current;
    const displayData = useMemo(
      () =>
        data.map((item) => ({
          ...item,
          displayDrawdown: isDrawdownMasked
            ? 0
            : getDrawdownChartScaleValue(item, preferPercent),
        })),
      [data, isDrawdownMasked, preferPercent]
    );

    const formatDrawdownTick = React.useCallback(
      (value: number): string =>
        preferPercent
          ? formatValue({
              kind: 'percentage',
              value,
              signed: true,
              precision: 1,
            })
          : formatValue({
              kind: 'drawdown',
              value,
              currencyCode: displayCurrency,
            }),
      [displayCurrency, formatValue, preferPercent]
    );

    
    const drawdownConfig = useMemo(() => {
      const drawdownValues =
        displayData.length > 0
          ? displayData.map((item) => item.displayDrawdown)
          : [0];

      
      
      const dataMin = isDrawdownMasked
        ? 0
        : minValue !== undefined
          ? minValue
          : Math.min(...drawdownValues);
      const dataMax = isDrawdownMasked
        ? 1
        : maxValue !== undefined
          ? maxValue
          : Math.max(...drawdownValues);

      
      
      
      const { domain, ticks } = generateNiceAxis(
        dataMin,
        dataMax,
        6,
        true,
        true
      );

      
      const yAxisWidth = calculateYAxisWidth(ticks, formatDrawdownTick);

      
      const negativeColor = isDrawdownMasked
        ? 'var(--text-muted)'
        : 'var(--text-error, #e53935)';

      return {
        domain,
        ticks,
        yAxisWidth,
        negativeColor,
      };
    }, [displayData, isDrawdownMasked, minValue, maxValue, formatDrawdownTick]);

    const { domain, ticks, yAxisWidth, negativeColor } = drawdownConfig;

    const dateLabelLookup = useMemo(() => {
      const map = new Map<string, string>();
      data.forEach((point) => {
        map.set(point.dateKey, point.date);
      });
      return map;
    }, [data]);

    

    const handleChartClick = (event: any) => {
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
              id={`${chartId}-gradient`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor={negativeColor} stopOpacity={0.1} />
              <stop offset="100%" stopColor={negativeColor} stopOpacity={0.4} />
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
            tickFormatter={formatDrawdownTick}
            domain={domain}
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
                  : renderDrawdownTooltip(
                      runtimeProps,
                      displayRMultiples,
                      defaultRiskAmount,
                      currencyOverride,
                      preferPercent
                    )
              }
            </RechartsPortalTooltip>
          )}
          <Area
            type="monotone"
            dataKey="displayDrawdown"
            stroke={negativeColor}
            strokeWidth={2.5}
            fill={`url(#${chartId}-gradient)`}
            fillOpacity={0.4}
            dot={false}
            activeDot={{
              r: 7,
              strokeWidth: 1,
              stroke: 'var(--background-primary)',
              fill: negativeColor,
              filter: `url(#${chartId}-glow)`,
            }}
            animationDuration={1000}
            animationEasing="ease-out"
            filter={`url(#${chartId}-shadow)`}
          />
        </AreaChart>
      </ChartBase>
    );
  }
);

SharedDrawdownChart.displayName = 'SharedDrawdownChart';
