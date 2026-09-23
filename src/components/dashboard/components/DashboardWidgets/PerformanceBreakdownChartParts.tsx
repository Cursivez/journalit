
import React from 'react';
import { t } from '../../../../lang/helpers';
import { useDisplayFormatter } from '../../../../hooks/useDisplayPolicy';
import { EmptyState } from '../../../shared/EmptyState';
import {
  formatPerformanceBreakdownMetricValue,
  getMetricLabel,
  getPerformanceBreakdownDividerLabelWidth,
  PERFORMANCE_BREAKDOWN_DIVIDER_LABEL_HEIGHT,
  truncatePerformanceBreakdownLabel,
  type PerformanceBreakdownBarShapeProps,
  type PerformanceBreakdownCategoryTickProps,
  type PerformanceBreakdownTooltipProps,
} from './performanceBreakdownChartModel';
import { handleRovingChartMarkKeyDown } from '../../../charts/chartKeyboardNavigation';

interface PerformanceBreakdownDividerLabelProps {
  dividerLabel: string;
  viewBox?: unknown;
}

interface CartesianLabelViewBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

const isCartesianLabelViewBox = (
  value: unknown
): value is CartesianLabelViewBox =>
  value !== null &&
  typeof value === 'object' &&
  !Array.isArray(value) &&
  'x' in value &&
  typeof value.x === 'number' &&
  'y' in value &&
  typeof value.y === 'number' &&
  'width' in value &&
  typeof value.width === 'number' &&
  'height' in value &&
  typeof value.height === 'number';

export const PerformanceBreakdownCategoryTick: React.FC<
  PerformanceBreakdownCategoryTickProps & { dividerIndex?: number }
> = ({
  x = 0,
  y = 0,
  index,
  payload,
  textAnchor = 'end',
  fill = 'var(--text-muted)',
  fontSize = 11,
  fontWeight = 500,
  className,
  dividerIndex,
}) => {
  if (dividerIndex !== undefined && index === dividerIndex) return null;

  return (
    <text
      className={className}
      x={x}
      y={y}
      textAnchor={textAnchor}
      fill={fill}
      fontSize={fontSize}
      fontWeight={fontWeight}
    >
      {typeof payload?.value === 'string'
        ? truncatePerformanceBreakdownLabel(payload.value)
        : payload?.value}
    </text>
  );
};

export const PerformanceBreakdownDividerLabel: React.FC<
  PerformanceBreakdownDividerLabelProps
> = ({ viewBox, dividerLabel }) => {
  if (!isCartesianLabelViewBox(viewBox)) return null;

  const centerX = viewBox.x + viewBox.width / 2;
  const centerY = viewBox.y + viewBox.height / 2;
  const labelWidth = getPerformanceBreakdownDividerLabelWidth(dividerLabel);

  return (
    <g aria-hidden="true" transform={`translate(${centerX}, ${centerY})`}>
      <rect
        x={-labelWidth / 2}
        y={-PERFORMANCE_BREAKDOWN_DIVIDER_LABEL_HEIGHT / 2}
        width={labelWidth}
        height={PERFORMANCE_BREAKDOWN_DIVIDER_LABEL_HEIGHT}
        rx={3}
        ry={3}
        fill="var(--background-primary)"
        stroke="var(--background-modifier-border)"
        strokeOpacity={0.8}
      />
      <text
        x={0}
        y={0}
        textAnchor="middle"
        dominantBaseline="central"
        fill="var(--text-muted)"
        fontSize={10}
        fontWeight={500}
      >
        {dividerLabel}
      </text>
    </g>
  );
};

export const PerformanceBreakdownTooltip: React.FC<
  PerformanceBreakdownTooltipProps
> = ({ active, payload, currencyCode, selectedMetric, useRMultiples }) => {
  const { formatValue } = useDisplayFormatter();
  if (!active) return null;

  const data = payload[0].payload;
  const formattedValue = formatPerformanceBreakdownMetricValue(
    data,
    selectedMetric,
    useRMultiples,
    currencyCode,
    formatValue
  );
  const formattedWinRate = formatValue({
    kind: 'returnPercent',
    value: data.winRate * 100,
    signed: false,
    precision: 1,
  });
  const valueClass =
    selectedMetric !== 'net'
      ? ''
      : data.displayValue > 0
        ? 'positive'
        : data.displayValue < 0
          ? 'negative'
          : '';

  return (
    <div className="journalit-chart-tooltip">
      <div className="journalit-chart-tooltip-date">{data.label}</div>
      <div className="journalit-chart-tooltip-info journalit-chart-tooltip-info--tight">
        {getMetricLabel(selectedMetric, useRMultiples)}
      </div>
      <div className={`journalit-chart-tooltip-value ${valueClass}`}>
        {formattedValue}
      </div>
      <div className="journalit-chart-tooltip-info">
        {t('dashboard.widgets.ticker-performance.tooltip.trades', {
          count: formatValue({ kind: 'count', value: data.tradeCount }),
        })}
      </div>
      <div className="journalit-chart-tooltip-info journalit-chart-tooltip-info--tight">
        {t('dashboard.widgets.ticker-performance.tooltip.win-rate', {
          rate: formattedWinRate,
          wins: formatValue({ kind: 'count', value: data.wins }),
          losses: formatValue({ kind: 'count', value: data.losses }),
        })}
      </div>
    </div>
  );
};

export const PerformanceBreakdownBarShape: React.FC<
  PerformanceBreakdownBarShapeProps & {
    fillMode: 'masked' | 'net' | 'neutral';
    navigationTabIndex?: 0 | -1;
    onKeyboardActivate?: (
      point: Exclude<
        NonNullable<PerformanceBreakdownBarShapeProps['payload']>,
        { kind: 'divider' }
      >,
      event: React.KeyboardEvent<SVGRectElement>
    ) => void;
  }
> = ({
  x,
  y,
  width,
  height,
  payload,
  stroke,
  strokeWidth,
  strokeOpacity,
  fillMode,
  navigationTabIndex,
  onKeyboardActivate,
}) => {
  if (!payload || payload.kind === 'divider') return null;

  const fill =
    fillMode !== 'net'
      ? 'var(--text-muted)'
      : payload.displayValue > 0
        ? 'var(--chart-positive)'
        : payload.displayValue < 0
          ? 'var(--chart-negative)'
          : 'var(--chart-neutral)';
  const safeWidth = width ?? 0;
  const adjustedX = safeWidth < 0 ? (x ?? 0) + safeWidth : (x ?? 0);
  const isInteractive = navigationTabIndex !== undefined;

  return (
    <rect
      x={adjustedX}
      y={y ?? 0}
      width={Math.abs(safeWidth)}
      height={Math.max(height ?? 0, 0)}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeOpacity={strokeOpacity}
      rx={2}
      ry={2}
      cursor={isInteractive ? 'pointer' : undefined}
      role={isInteractive ? 'button' : undefined}
      tabIndex={navigationTabIndex}
      data-journalit-chart-mark={isInteractive ? 'true' : undefined}
      aria-label={
        isInteractive
          ? t('setups.view.card.open-named', { name: payload.label })
          : undefined
      }
      onKeyDown={
        isInteractive && onKeyboardActivate
          ? (event) =>
              handleRovingChartMarkKeyDown(event, () =>
                onKeyboardActivate(payload, event)
              )
          : undefined
      }
    />
  );
};

export const PerformanceBreakdownNoDataState: React.FC<{
  message: string;
}> = ({ message }) => <EmptyState message={message} iconSize={40} />;

export const PerformanceBreakdownMixedCurrencyState: React.FC = () => (
  <EmptyState
    message={t('dashboard.conversion.requires-conversion')}
    iconSize={40}
  />
);
