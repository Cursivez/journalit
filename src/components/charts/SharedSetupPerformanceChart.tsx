

import React from 'react';
import {
  BarChart,
  Bar,
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  LabelList,
  TooltipProps,
  ReferenceLine,
} from 'recharts';
import { useCurrency } from '../../contexts/CurrencyContext';
import { useDisplayFormatter } from '../../hooks/useDisplayPolicy';
import { ChartBase } from './ChartBase';
import { RechartsPortalTooltip } from './RechartsPortalTooltip';
import { generateNiceAxis, calculateYAxisWidth } from '../../utils/chartUtils';
import type JournalitPlugin from '../../main';
import { t } from '../../lang/helpers';
import { cssVars } from '../../styles/inlineStylePolicy';

const EPSILON = 1e-6; 
const SVG_TEXT_ANCHOR_START = 'start';


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

type SetupPerformanceMetricKind =
  | 'count'
  | 'pnl'
  | 'percentage'
  | 'metric'
  | 'rMultiple';

interface SetupPerformanceRankingPoint {
  id: string;
  name: string;
  value: number;
  rawValue: number;
  trades: number;
  winRate: number;
  profitFactor: number;
}

interface SetupPerformanceRankingChartProps {
  data: SetupPerformanceRankingPoint[];
  height?: number;
  metricKind: SetupPerformanceMetricKind;
  metricKey: string;
  metricLabel: string;
  isChartMasked: boolean;
  onPointClick?: (pointId: string) => void;
}

interface SetupPerformanceBarShapeProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  payload?: SetupPerformanceRankingPoint;
  stroke?: string;
  strokeWidth?: string | number;
  strokeOpacity?: string | number;
  isChartMasked: boolean;
  metricKey: string;
}

const SetupPerformanceBarShape: React.FC<SetupPerformanceBarShapeProps> = ({
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  payload,
  stroke,
  strokeWidth,
  strokeOpacity,
  isChartMasked,
  metricKey,
}) => {
  const adjustedWidth = width < 0 ? Math.abs(width) : width;
  const adjustedX = width < 0 ? x + width : x;

  return (
    <rect
      x={adjustedX}
      y={y}
      width={Math.max(adjustedWidth, 0)}
      height={Math.max(height, 0)}
      fill={getPerformanceBarFill(
        payload?.value ?? 0,
        isChartMasked,
        metricKey
      )}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeOpacity={strokeOpacity}
      rx={2}
      ry={2}
    />
  );
};

SetupPerformanceBarShape.displayName = 'SetupPerformanceBarShape';

export const SetupPerformanceRankingChart: React.FC<
  SetupPerformanceRankingChartProps
> = ({
  data,
  height,
  metricKind,
  metricKey,
  metricLabel,
  isChartMasked,
  onPointClick,
}) => {
  const chartRef = React.useRef<HTMLDivElement>(null);
  const { formatValue } = useDisplayFormatter();
  const chartHeight = height ?? Math.max(240, data.length * 30 + 48);

  const formatMetric = React.useCallback(
    (value: number): string =>
      formatValue({
        kind: metricKind,
        value: metricKey === 'profitFactor' ? value + 1 : value,
        precision: metricKey === 'totalTrades' ? 0 : 2,
      }),
    [formatValue, metricKind, metricKey]
  );

  const axisConfig = React.useMemo(() => {
    if (isChartMasked) return generateNiceAxis(0, 1, 6, true, false);

    const dataMin = Math.min(...data.map((point) => point.value), 0);
    const dataMax = Math.max(...data.map((point) => point.value), 0);

    if (metricKey === 'totalTrades') {
      return generateNiceAxis(0, Math.max(dataMax, 1), 6, true, false);
    }

    if (metricKey === 'profitFactor') {
      const profitFactorAxis = generateNiceAxis(
        Math.max(dataMin, -1),
        dataMax,
        7,
        true,
        true
      );
      return {
        ...profitFactorAxis,
        domain: [
          Math.max(profitFactorAxis.domain[0], -1),
          profitFactorAxis.domain[1],
        ] as [number, number],
        ticks: profitFactorAxis.ticks.filter((tick) => tick >= -1),
      };
    }

    return generateNiceAxis(dataMin, dataMax, 6, true, true);
  }, [data, isChartMasked, metricKey]);

  return (
    <ChartBase height={chartHeight} width="100%" chartRef={chartRef}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 8, bottom: 0, left: 0 }}
        barCategoryGap={10}
      >
        <CartesianGrid
          horizontal={false}
          stroke="var(--background-modifier-border)"
          strokeDasharray="3 3"
          strokeOpacity={0.35}
        />
        <XAxis
          type="number"
          domain={axisConfig.domain}
          ticks={axisConfig.ticks}
          tickLine={false}
          axisLine={{
            stroke: 'var(--background-modifier-border)',
            strokeOpacity: 0.5,
          }}
          tick={{
            fill: 'var(--text-muted)',
            fontSize: 11,
            fontWeight: 500,
          }}
          tickMargin={5}
          tickFormatter={(value) => formatMetric(Number(value))}
        />
        <YAxis
          type="category"
          dataKey="name"
          width={160}
          tickLine={false}
          axisLine={false}
          tick={{
            fill: 'var(--text-muted)',
            fontSize: 11,
            fontWeight: 600,
          }}
          tickMargin={8}
        />
        <ReferenceLine
          x={0}
          stroke="var(--text-normal, #888888)"
          strokeOpacity={0.55}
          strokeWidth={1}
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
            <SetupPerformanceTooltip
              active={props.active}
              payload={props.payload}
              metricLabel={metricLabel}
              metricKind={metricKind}
            />
          )}
        </RechartsPortalTooltip>
        <Bar
          dataKey="value"
          barSize={16}
          fill="var(--interactive-accent)"
          cursor={onPointClick ? 'pointer' : undefined}
          onClick={(point) => {
            if (!onPointClick || !isSetupPerformanceRankingPoint(point)) {
              return;
            }
            onPointClick(point.id);
          }}
          minPointSize={0}
          isAnimationActive={true}
          animationDuration={700}
          animationEasing="ease-out"
          stroke="var(--background-primary)"
          strokeWidth={0.8}
          strokeOpacity={0.5}
          shape={
            <SetupPerformanceBarShape
              isChartMasked={isChartMasked}
              metricKey={metricKey}
            />
          }
        />
      </BarChart>
    </ChartBase>
  );
};

SetupPerformanceRankingChart.displayName = 'SetupPerformanceRankingChart';

const SetupPerformanceTooltip: React.FC<{
  active?: boolean;
  payload?: unknown;
  metricLabel: string;
  metricKind: SetupPerformanceMetricKind;
}> = ({ active, payload, metricLabel, metricKind }) => {
  const { formatValue, shouldMask } = useDisplayFormatter();
  const point = getSetupPerformanceTooltipPoint(payload);
  if (!active || !point) return null;

  const isMetricMasked = metricKind !== 'count' && shouldMask(metricKind);
  const valueToneClass =
    isMetricMasked || metricKind === 'count'
      ? ''
      : point.value >= 0
        ? 'positive'
        : 'negative';

  return (
    <div className="journalit-chart-tooltip">
      <div className="journalit-chart-tooltip-date">{point.name}</div>

      <div
        className={['journalit-chart-tooltip-value', valueToneClass]
          .filter(Boolean)
          .join(' ')}
      >
        {formatValue({
          kind: metricKind,
          value: point.rawValue,
          precision: metricKind === 'count' ? 0 : 2,
        })}
      </div>

      <div className="journalit-chart-tooltip-info journalit-chart-tooltip-info--tight">
        {metricLabel}
      </div>

      <div className="journalit-chart-tooltip-info journalit-chart-tooltip-info--tight">
        {formatValue({ kind: 'count', value: point.trades, precision: 0 })}{' '}
        {t('setups.view.metric.trades')} ·{' '}
        {formatValue({ kind: 'percentage', value: point.winRate })} ·{' '}
        {formatValue({
          kind: 'metric',
          value: point.profitFactor,
          precision: 2,
        })}{' '}
        {t('setups.view.metric.profit-factor')}
      </div>
    </div>
  );
};

SetupPerformanceTooltip.displayName = 'SetupPerformanceTooltip';

function getSetupPerformanceTooltipPoint(
  payload: unknown
): SetupPerformanceRankingPoint | null {
  if (!isUnknownArray(payload)) return null;
  const first = payload[0];
  if (!isRecord(first)) return null;
  const point = first.payload;
  return isSetupPerformanceRankingPoint(point) ? point : null;
}

function isSetupPerformanceRankingPoint(
  value: unknown
): value is SetupPerformanceRankingPoint {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.value === 'number' &&
    typeof value.rawValue === 'number'
  );
}

function getPerformanceBarFill(
  value: number,
  isMasked: boolean,
  metricKey: string
): string {
  if (isMasked) return 'var(--text-muted)';
  if (metricKey === 'winRate' || metricKey === 'totalTrades') {
    return 'var(--chart-neutral, var(--text-muted))';
  }
  if (value < 0) return 'var(--chart-negative)';
  if (value > 0) return 'var(--chart-positive)';
  return 'var(--chart-neutral)';
}

type SetupCompareCumulativeMetric = 'r' | 'pnl';

interface SetupCompareCumulativeSeries {
  id: string;
  key: string;
  name: string;
  values: number[];
}

interface SetupCompareCumulativeDatum {
  index: number;
  label: string;
  [setupId: string]: number | string;
}

interface SetupCompareLegendProps {
  payload?: Array<{
    value: string;
    color: string;
  }>;
}

interface SetupCompareEdgeBreakdownPoint {
  id: string;
  label: string;
  value: number;
  winnerValue: number;
  otherValue: number;
  winnerName: string;
  otherName: string;
}

interface SetupCompareEdgeBarShapeProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  payload?: SetupCompareEdgeBreakdownPoint;
  stroke?: string;
  strokeWidth?: string | number;
  strokeOpacity?: string | number;
}

interface SetupCompareEdgeValueLabelProps {
  x?: number | string;
  y?: number | string;
  width?: number | string;
  height?: number | string;
  value?: number | string;
  valueKind?: 'pnl' | 'rMultiple';
}

const SetupCompareEdgeBarShape: React.FC<SetupCompareEdgeBarShapeProps> = ({
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  payload,
  stroke,
  strokeWidth,
  strokeOpacity,
}) => {
  const adjustedWidth = width < 0 ? Math.abs(width) : width;
  const adjustedX = width < 0 ? x + width : x;
  const value = payload?.value ?? 0;

  return (
    <rect
      x={adjustedX}
      y={y}
      width={Math.max(adjustedWidth, 0)}
      height={Math.max(height, 0)}
      fill={
        value >= 0
          ? 'var(--journalit-setup-edge-positive)'
          : 'var(--journalit-setup-edge-negative)'
      }
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeOpacity={strokeOpacity}
      rx={2}
      ry={2}
    />
  );
};

SetupCompareEdgeBarShape.displayName = 'SetupCompareEdgeBarShape';

const SetupCompareEdgeValueLabel: React.FC<SetupCompareEdgeValueLabelProps> = ({
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  value = 0,
  valueKind = 'rMultiple',
}) => {
  const { formatValue } = useDisplayFormatter();
  const numericX = Number(x);
  const numericY = Number(y);
  const numericWidth = Number(width);
  const numericHeight = Number(height);
  const numericValue = Number(value);
  if (
    !Number.isFinite(numericX) ||
    !Number.isFinite(numericY) ||
    !Number.isFinite(numericWidth) ||
    !Number.isFinite(numericHeight) ||
    !Number.isFinite(numericValue)
  ) {
    return null;
  }

  const isPositive = numericValue >= 0;
  const labelX = numericWidth < 0 ? numericX + 8 : numericX + numericWidth + 8;

  return (
    <text
      className={
        isPositive
          ? 'journalit-setups-compare-breakdown-chart__value journalit-setups-compare-breakdown-chart__value--positive'
          : 'journalit-setups-compare-breakdown-chart__value journalit-setups-compare-breakdown-chart__value--negative'
      }
      x={labelX}
      y={numericY + numericHeight / 2}
      textAnchor={SVG_TEXT_ANCHOR_START}
      dominantBaseline="middle"
    >
      {formatValue({
        kind: valueKind,
        value: numericValue,
        precision: valueKind === 'rMultiple' ? 2 : undefined,
        signed: true,
      })}
    </text>
  );
};

SetupCompareEdgeValueLabel.displayName = 'SetupCompareEdgeValueLabel';

export const SetupCompareEdgeBreakdownChart: React.FC<{
  data: SetupCompareEdgeBreakdownPoint[];
  winnerName: string;
  otherName: string;
  valueKind: 'pnl' | 'rMultiple';
}> = ({ data, winnerName, otherName, valueKind }) => {
  const chartRef = React.useRef<HTMLDivElement>(null);
  const { formatValue } = useDisplayFormatter();
  const maxMagnitude = Math.max(
    ...data.map((point) => Math.abs(point.value)),
    0.25
  );
  const axisConfig = React.useMemo(
    () => generateNiceAxis(-maxMagnitude, maxMagnitude, 5, true, true),
    [maxMagnitude]
  );
  const chartHeight = Math.max(154, data.length * 28 + 36);

  return (
    <ChartBase height={chartHeight} width="100%" chartRef={chartRef}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 2, right: 54, bottom: 0, left: 0 }}
        barCategoryGap={10}
      >
        <CartesianGrid
          horizontal={false}
          stroke="var(--background-modifier-border)"
          strokeDasharray="3 3"
          strokeOpacity={0.3}
        />
        <XAxis
          type="number"
          domain={axisConfig.domain}
          ticks={axisConfig.ticks}
          hide
        />
        <YAxis
          type="category"
          dataKey="label"
          width={80}
          tickLine={false}
          axisLine={false}
          tick={{
            fill: 'var(--text-muted)',
            fontSize: 11,
            fontWeight: 600,
          }}
          tickMargin={8}
        />
        <ReferenceLine
          x={0}
          stroke="var(--text-muted)"
          strokeOpacity={0.65}
          strokeWidth={1}
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
          {(props) => {
            const point = getSetupCompareEdgeTooltipPoint(props.payload);
            if (!props.active || !point) return null;
            return (
              <div className="journalit-chart-tooltip journalit-chart-tooltip--compact">
                <div className="journalit-chart-tooltip-label">
                  {point.label}
                </div>
                <div
                  className={[
                    'journalit-chart-tooltip-row',
                    'journalit-chart-tooltip-row--spaced',
                    point.value >= 0
                      ? 'journalit-chart-tooltip-row--positive'
                      : 'journalit-chart-tooltip-row--negative',
                  ].join(' ')}
                >
                  {t('setups.view.compare.edge-column')}:{' '}
                  {formatValue({
                    kind: valueKind,
                    value: point.value,
                    precision: valueKind === 'rMultiple' ? 2 : undefined,
                    signed: true,
                  })}
                </div>
                <div className="journalit-chart-tooltip-row journalit-chart-tooltip-row--neutral">
                  {winnerName}:{' '}
                  {formatValue({
                    kind: valueKind,
                    value: point.winnerValue,
                    precision: valueKind === 'rMultiple' ? 2 : undefined,
                    signed: true,
                  })}
                </div>
                <div className="journalit-chart-tooltip-row journalit-chart-tooltip-row--neutral">
                  {otherName}:{' '}
                  {formatValue({
                    kind: valueKind,
                    value: point.otherValue,
                    precision: valueKind === 'rMultiple' ? 2 : undefined,
                    signed: true,
                  })}
                </div>
              </div>
            );
          }}
        </RechartsPortalTooltip>
        <Bar
          dataKey="value"
          barSize={10}
          fill="var(--interactive-accent)"
          minPointSize={0}
          isAnimationActive={false}
          stroke="var(--background-primary)"
          strokeWidth={0.8}
          strokeOpacity={0.5}
          shape={<SetupCompareEdgeBarShape />}
        >
          <LabelList
            dataKey="value"
            content={<SetupCompareEdgeValueLabel valueKind={valueKind} />}
          />
        </Bar>
      </BarChart>
    </ChartBase>
  );
};

SetupCompareEdgeBreakdownChart.displayName = 'SetupCompareEdgeBreakdownChart';

export const SetupCompareCumulativeChart: React.FC<{
  metric: SetupCompareCumulativeMetric;
  series: SetupCompareCumulativeSeries[];
}> = ({ metric, series }) => {
  const { formatValue } = useDisplayFormatter();
  const chartRef = React.useRef<HTMLDivElement>(null);
  const chartData = React.useMemo(
    () => buildCompareChartData(series),
    [series]
  );
  const values = chartData.flatMap((datum) =>
    series.flatMap((item) => {
      const value = datum[item.key];
      return typeof value === 'number' && Number.isFinite(value) ? [value] : [];
    })
  );
  const axis = generateNiceAxis(
    Math.min(...values, 0),
    Math.max(...values, 0),
    5,
    true,
    true
  );
  const formatAxisValue = React.useCallback(
    (value: number) =>
      formatValue({
        kind: metric === 'r' ? 'rMultiple' : 'pnl',
        value,
        precision: metric === 'r' ? 1 : 0,
      }),
    [formatValue, metric]
  );
  const yAxisWidth = React.useMemo(
    () => calculateYAxisWidth(axis.ticks, formatAxisValue),
    [axis.ticks, formatAxisValue]
  );
  const renderLegend = React.useCallback((props: SetupCompareLegendProps) => {
    const { payload } = props;
    if (!payload) return null;

    return (
      <div className="journalit-chart-widget__legend">
        {payload.map((entry) => (
          <div
            className="journalit-chart-widget__legend-item"
            key={`legend-${entry.value}`}
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
  }, []);

  return (
    <div className="journalit-setups-compare-chart">
      <ChartBase chartRef={chartRef} height={280} skeletonVariant="line">
        <LineChart
          data={chartData}
          margin={{ top: 6, right: 20, left: 0, bottom: 10 }}
        >
          <CartesianGrid
            className="journalit-chart-grid"
            strokeDasharray="3 3"
            vertical={false}
            stroke="var(--background-modifier-border)"
            strokeOpacity={0.5}
          />
          <XAxis dataKey="label" tickLine={false} axisLine={false} />
          <YAxis
            width={yAxisWidth}
            tickLine={false}
            axisLine={false}
            domain={axis.domain}
            ticks={axis.ticks}
            tickMargin={5}
            tickFormatter={formatAxisValue}
          />
          <ReferenceLine
            y={0}
            className="journalit-setups-compare-chart__zero"
          />
          <RechartsPortalTooltip
            chartRef={chartRef}
            cursor={{ strokeDasharray: '3 3' }}
          >
            {({ active, payload }) =>
              active && Array.isArray(payload) && payload.length ? (
                <div className="journalit-chart-tooltip journalit-chart-tooltip--compact">
                  <div className="journalit-chart-tooltip-label">
                    {t('dashboard.rolling_win_loss.trade_label', {
                      label: getCompareChartTooltipLabel(payload),
                    })}
                  </div>
                  {payload.flatMap((item) => {
                    if (!isRecord(item)) return [];
                    const value =
                      typeof item.value === 'number' ? item.value : 0;
                    const name = typeof item.name === 'string' ? item.name : '';
                    const dataKey =
                      typeof item.dataKey === 'string' ||
                      typeof item.dataKey === 'number'
                        ? String(item.dataKey)
                        : name || String(value);
                    return (
                      <div
                        className={[
                          'journalit-chart-tooltip-row',
                          'journalit-chart-tooltip-row--spaced',
                          value > 0
                            ? 'journalit-chart-tooltip-row--positive'
                            : value < 0
                              ? 'journalit-chart-tooltip-row--negative'
                              : 'journalit-chart-tooltip-row--neutral',
                        ].join(' ')}
                        key={dataKey}
                      >
                        {name}:{' '}
                        {formatValue({
                          kind: metric === 'r' ? 'rMultiple' : 'pnl',
                          value,
                          precision: 2,
                        })}
                      </div>
                    );
                  })}
                </div>
              ) : null
            }
          </RechartsPortalTooltip>
          <Legend content={renderLegend} />
          {series.map((item, index) => (
            <Line
              key={item.id}
              type="monotone"
              dataKey={item.key}
              name={item.name}
              stroke={`var(--journalit-setup-compare-line-${index + 1})`}
              strokeWidth={2.5}
              dot={false}
              activeDot={{
                r: 6,
                strokeWidth: 1,
                stroke: 'var(--background-primary)',
                fill: `var(--journalit-setup-compare-line-${index + 1})`,
              }}
              connectNulls
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ChartBase>
    </div>
  );
};

SetupCompareCumulativeChart.displayName = 'SetupCompareCumulativeChart';

function buildCompareChartData(
  series: SetupCompareCumulativeSeries[]
): SetupCompareCumulativeDatum[] {
  const maxLength = Math.max(...series.map((item) => item.values.length), 0);

  return Array.from({ length: maxLength + 1 }, (_, index) => {
    const datum: SetupCompareCumulativeDatum = {
      index,
      label: String(index),
    };
    for (const item of series) {
      if (index === 0) {
        datum[item.key] = 0;
        continue;
      }

      const value = item.values[index - 1];
      if (value !== undefined) datum[item.key] = value;
    }
    return datum;
  });
}

function getCompareChartTooltipLabel(payload: readonly unknown[]): string {
  const first = payload.find(isRecord);
  if (!first || !isRecord(first.payload)) return '';
  const label = first.payload.label;
  return typeof label === 'string' || typeof label === 'number'
    ? String(label)
    : '';
}

function getSetupCompareEdgeTooltipPoint(
  payload: unknown
): SetupCompareEdgeBreakdownPoint | null {
  if (!isUnknownArray(payload)) return null;
  const first = payload[0];
  if (!isRecord(first)) return null;
  const point = first.payload;
  return isSetupCompareEdgeBreakdownPoint(point) ? point : null;
}

function isSetupCompareEdgeBreakdownPoint(
  value: unknown
): value is SetupCompareEdgeBreakdownPoint {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === 'string' &&
    typeof value.label === 'string' &&
    typeof value.value === 'number' &&
    Number.isFinite(value.value) &&
    typeof value.winnerValue === 'number' &&
    Number.isFinite(value.winnerValue) &&
    typeof value.otherValue === 'number' &&
    Number.isFinite(value.otherValue) &&
    typeof value.winnerName === 'string' &&
    typeof value.otherName === 'string'
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isUnknownArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}
