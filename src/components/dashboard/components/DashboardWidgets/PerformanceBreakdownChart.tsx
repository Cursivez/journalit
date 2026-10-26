
import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  XAxis,
  YAxis,
} from 'recharts';
import type { LabelProps } from 'recharts';
import { t } from '../../../../lang/helpers';
import type {
  PerformanceBreakdownMetric,
  PerformanceBreakdownViewMode,
} from '../../../../settings/types';
import { useDisplayFormatter } from '../../../../hooks/useDisplayPolicy';
import { normalizeBreakEvenRange } from '../../../../utils/breakEvenRange';
import { parseCuratedCurrencyCode } from '../../../../utils/currencyConfig';
import { ChartBase } from '../../../charts/ChartBase';
import { RechartsPortalTooltip } from '../../../charts/RechartsPortalTooltip';
import {
  buildCurrencyConversionMetadata,
  CurrencyConversionInfo,
} from '../../../shared/display/CurrencyConversionInfo';
import type { FilterState } from '../../DashboardView';
import type { DashboardData, Trade } from '../../utils/dataUtils';
import { BaseWidget, type BaseWidgetProps } from './BaseWidget';
import {
  createMaskedChartData,
  getAxisConfig,
  getCategoryAxisWidth,
  getDisplayValue,
  getMetricLabel,
  getPerformanceBreakdownLabel,
  getViewModeLabel,
  insertDividerPoint,
  isPerformanceBreakdownTooltipContent,
  METRIC_OPTIONS,
  normalizeMetric,
  normalizeViewMode,
  VIEW_MODE_OPTIONS,
  type PerformanceBreakdownBarShapeProps,
  type PerformanceBreakdownCategoryTickProps,
  type PerformanceBreakdownChartPoint,
  type PerformanceBreakdownDataPoint,
} from './performanceBreakdownChartModel';
import {
  PerformanceBreakdownBarShape,
  PerformanceBreakdownCategoryTick,
  PerformanceBreakdownDividerLabel,
  PerformanceBreakdownMixedCurrencyState,
  PerformanceBreakdownNoDataState,
  PerformanceBreakdownTooltip,
} from './PerformanceBreakdownChartParts';
import {
  buildPerformanceBreakdown,
  hasCompletePerformanceBreakdownRMultipleCoverage,
  hasUnconvertedMixedCurrencyPerformanceGroups,
  PERFORMANCE_BREAKDOWN_MAX_VISIBLE_ROWS,
  type PerformanceGroupExtractor,
} from './performanceBreakdownUtils';
import {
  usePerformanceBreakdownPreferences,
  type PerformanceBreakdownKind,
} from './usePerformanceBreakdownPreferences';
import { useTwoStageTouchNavigation } from '../../../charts/useTwoStageTouchNavigation';
import { openDashboardPerformanceBreakdownTarget } from '../../performanceBreakdownNavigation';

interface PerformanceBreakdownChartProps extends BaseWidgetProps {
  kind: PerformanceBreakdownKind;
  title: string;
  emptyMessage: string;
  maskedLabel: string;
  getGroups: PerformanceGroupExtractor;
  
  fixedRowOrder?: readonly string[];
}

interface PerformanceBreakdownHeaderProps {
  title: string;
  metrics: DashboardData['metrics'];
  sourceTrades: Trade[];
  showConversionInfo: boolean;
  usesRMultiples: boolean;
  selectedMetric: PerformanceBreakdownMetric;
  onMetricChange: (metric: PerformanceBreakdownMetric) => void;
  selectedViewMode: PerformanceBreakdownViewMode;
  onViewModeChange: (viewMode: PerformanceBreakdownViewMode) => void;
  showViewSelector: boolean;
}

const PerformanceBreakdownHeader: React.FC<PerformanceBreakdownHeaderProps> = ({
  title,
  metrics,
  sourceTrades,
  showConversionInfo,
  usesRMultiples,
  selectedMetric,
  onMetricChange,
  selectedViewMode,
  onViewModeChange,
  showViewSelector,
}) => (
  <div className="journalit-chart-widget__header">
    <div className="journalit-chart-widget__title">
      {title}
      {showConversionInfo && (
        <CurrencyConversionInfo
          metadata={buildCurrencyConversionMetadata(metrics)}
          trades={sourceTrades}
        />
      )}
    </div>
    <div className="journalit-chart-widget__selector journalit-performance-breakdown-controls">
      <select
        aria-label={`${title} — ${t('dashboard.widgets.ticker-performance.metric-aria')}`}
        className="journalit-chart-widget__select"
        value={selectedMetric}
        onChange={(event) =>
          onMetricChange(normalizeMetric(event.target.value))
        }
      >
        {METRIC_OPTIONS.map((metric) => (
          <option key={metric} value={metric}>
            {getMetricLabel(metric, usesRMultiples)}
          </option>
        ))}
      </select>
      {showViewSelector && (
        <select
          aria-label={`${title} — ${t('dashboard.widgets.ticker-performance.view-aria')}`}
          className="journalit-chart-widget__select"
          value={selectedViewMode}
          onChange={(event) =>
            onViewModeChange(normalizeViewMode(event.target.value))
          }
        >
          {VIEW_MODE_OPTIONS.map((viewMode) => (
            <option key={viewMode} value={viewMode}>
              {getViewModeLabel(viewMode)}
            </option>
          ))}
        </select>
      )}
    </div>
  </div>
);

interface PerformanceBreakdownBodyProps extends Omit<
  PerformanceBreakdownChartProps,
  'dateFormat' | 'skeletonType'
> {
  data: DashboardData;
  
  filters: FilterState;
}

type TradeSettings = NonNullable<
  ReturnType<typeof usePerformanceBreakdownPreferences>['plugin']
>['settings']['trade'];

const breakdownTradeSettings = (trade: TradeSettings | undefined) => {
  const breakEvenRange = normalizeBreakEvenRange(trade);
  return {
    displayRMultiples: trade?.displayRMultiples ?? false,
    defaultRiskAmount: trade?.defaultRiskAmount,
    analyticsDateBasis: trade?.analyticsDateBasis ?? 'entry',
    breakEvenSettings: {
      breakEvenRangeMin: breakEvenRange.min,
      breakEvenRangeMax: breakEvenRange.max,
      breakEvenThresholdMode: trade?.breakEvenThresholdMode ?? 'fixed',
      breakEvenThresholdPercent: trade?.breakEvenThresholdPercent,
    },
  };
};

const breakdownSourceTrades = (
  data: DashboardData,
  analyticsDateBasis: string
): Trade[] =>
  analyticsDateBasis === 'exit'
    ? (data.realizedEventTrades ?? data.trades)
    : data.trades;

const breakdownCurrencyCode = (data: DashboardData) =>
  parseCuratedCurrencyCode(
    (data.metrics.isMultiCurrency
      ? data.metrics.conversionBaseCurrency
      : data.currency) || data.currency
  );

const breakdownMaskKind = (
  selectedMetric: PerformanceBreakdownMetric,
  usesRMultiples: boolean
) => {
  if (selectedMetric === 'winRate') return 'returnPercent';
  return usesRMultiples ? 'rMultiple' : 'pnl';
};

const breakdownDividerLabel = (
  result: ReturnType<typeof buildPerformanceBreakdown>
) =>
  result.dividerIndex === undefined
    ? undefined
    : t('dashboard.widgets.ticker-performance.omitted-count', {
        count: String(result.omittedRowCount),
      });

const breakdownDisplayData = ({
  isMasked,
  maskedLabel,
  chartData,
  dividerIndex,
  dividerLabel,
}: {
  isMasked: boolean;
  maskedLabel: string;
  chartData: PerformanceBreakdownDataPoint[];
  dividerIndex: number | undefined;
  dividerLabel: string | undefined;
}): PerformanceBreakdownChartPoint[] => {
  if (isMasked) return createMaskedChartData(maskedLabel);
  if (dividerIndex === undefined || dividerLabel === undefined) {
    return chartData;
  }
  return insertDividerPoint(chartData, dividerIndex, dividerLabel);
};

interface PerformanceBreakdownBarHandlers {
  onLabelClick: (label: string, event: React.MouseEvent) => void;
  onLabelTouch: (label: string) => void;
}


const breakdownBarInteraction = (
  canNavigate: boolean,
  { onLabelClick, onLabelTouch }: PerformanceBreakdownBarHandlers
): Pick<
  React.ComponentProps<typeof Bar>,
  'cursor' | 'activeBar' | 'onClick' | 'onTouchEnd'
> => {
  if (!canNavigate) return { activeBar: false };
  return {
    cursor: 'pointer',
    activeBar: {
      stroke: 'var(--interactive-accent)',
      strokeOpacity: 0.65,
      strokeWidth: 1.2,
      cursor: 'pointer',
    },
    onClick: (bar, _index, event) => {
      const payload: unknown = bar.payload;
      const label = getPerformanceBreakdownLabel(payload);
      if (label) onLabelClick(label, event);
    },
    onTouchEnd: (bar) => {
      const payload: unknown = bar.payload;
      const label = getPerformanceBreakdownLabel(payload);
      if (label) onLabelTouch(label);
    },
  };
};

const breakdownFillMode = (
  isMasked: boolean,
  selectedMetric: PerformanceBreakdownMetric
) => {
  if (isMasked) return 'masked';
  return selectedMetric === 'net' ? 'net' : 'neutral';
};

interface PerformanceBreakdownPlotProps {
  chartRef: React.RefObject<HTMLDivElement | null>;
  chartData: PerformanceBreakdownDataPoint[];
  displayChartData: PerformanceBreakdownChartPoint[];
  dividerIndex: number | undefined;
  dividerLabel: string | undefined;
  selectedMetric: PerformanceBreakdownMetric;
  usesRMultiples: boolean;
  isMasked: boolean;
  currencyCode: ReturnType<typeof parseCuratedCurrencyCode>;
  canNavigate: boolean;
  formatXAxisTick: (value: number) => string;
  barHandlers: PerformanceBreakdownBarHandlers;
  onBarKeyboardActivate: (
    point: PerformanceBreakdownDataPoint,
    event: React.KeyboardEvent
  ) => void;
}

const PerformanceBreakdownPlot: React.FC<PerformanceBreakdownPlotProps> = ({
  chartRef,
  chartData,
  displayChartData,
  dividerIndex,
  dividerLabel,
  selectedMetric,
  usesRMultiples,
  isMasked,
  currencyCode,
  canNavigate,
  formatXAxisTick,
  barHandlers,
  onBarKeyboardActivate,
}) => {
  const axisConfig = getAxisConfig(chartData, selectedMetric);
  const showZeroLine = selectedMetric === 'net' && !isMasked;
  const visibleDividerLabel = isMasked ? undefined : dividerLabel;
  const fillMode = breakdownFillMode(isMasked, selectedMetric);
  return (
    <ChartBase height="100%" width="100%" chartRef={chartRef}>
      <BarChart
        data={displayChartData}
        layout="vertical"
        margin={{ top: 6, right: 6, left: 0, bottom: 10 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          horizontal={false}
          stroke="var(--background-modifier-border)"
          strokeOpacity={0.5}
        />
        {showZeroLine && (
          <ReferenceLine
            x={0}
            stroke="var(--text-normal, #888888)"
            strokeOpacity={0.5}
            strokeDasharray="3 3"
            strokeWidth={1.5}
          />
        )}
        {visibleDividerLabel !== undefined && (
          <ReferenceLine
            className="journalit-performance-breakdown-divider-line"
            y={visibleDividerLabel}
            stroke="var(--background-modifier-border)"
            strokeOpacity={0.65}
            strokeWidth={1}
            label={(props: LabelProps) => (
              <PerformanceBreakdownDividerLabel
                {...props}
                dividerLabel={visibleDividerLabel}
              />
            )}
          />
        )}
        <XAxis
          type="number"
          tickFormatter={formatXAxisTick}
          tick={{
            fontSize: 11,
            fontWeight: 500,
            fill: 'var(--text-muted)',
          }}
          domain={axisConfig.domain}
          ticks={axisConfig.ticks}
          scale="linear"
          tickLine={false}
          axisLine={{
            stroke: 'var(--background-modifier-border)',
            strokeOpacity: 0.5,
          }}
          tickMargin={4}
        />
        <YAxis
          type="category"
          dataKey="label"
          hide={isMasked}
          tick={(props: PerformanceBreakdownCategoryTickProps) => (
            <PerformanceBreakdownCategoryTick
              {...props}
              dividerIndex={dividerIndex}
            />
          )}
          width={getCategoryAxisWidth(chartData.map((item) => item.label))}
          tickLine={false}
          axisLine={false}
          tickMargin={5}
        />
        {!isMasked && (
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
            {(props) =>
              isPerformanceBreakdownTooltipContent(props) ? (
                <PerformanceBreakdownTooltip
                  {...props}
                  currencyCode={currencyCode}
                  selectedMetric={selectedMetric}
                  useRMultiples={usesRMultiples}
                />
              ) : null
            }
          </RechartsPortalTooltip>
        )}
        <Bar
          dataKey={(point: PerformanceBreakdownChartPoint) =>
            point.kind === 'data' ? point.displayValue : null
          }
          fill="var(--interactive-accent)"
          maxBarSize={32}
          minPointSize={0}
          isAnimationActive={true}
          animationDuration={700}
          animationEasing="ease-out"
          stroke="var(--background-primary)"
          strokeWidth={0.8}
          strokeOpacity={0.5}
          radius={[2, 2, 2, 2]}
          {...breakdownBarInteraction(canNavigate, barHandlers)}
          shape={(props: PerformanceBreakdownBarShapeProps) => (
            <PerformanceBreakdownBarShape
              {...props}
              fillMode={fillMode}
              navigationTabIndex={
                canNavigate ? (props.index === 0 ? 0 : -1) : undefined
              }
              onKeyboardActivate={onBarKeyboardActivate}
            />
          )}
        />
      </BarChart>
    </ChartBase>
  );
};

const PerformanceBreakdownBody: React.FC<PerformanceBreakdownBodyProps> = ({
  data,
  filters,
  kind,
  title,
  emptyMessage,
  maskedLabel,
  getGroups,
  fixedRowOrder,
}) => {
  const chartRef = React.useRef<HTMLDivElement>(null);
  const {
    plugin,
    selectedMetric,
    handleMetricChange,
    selectedViewMode,
    handleViewModeChange,
  } = usePerformanceBreakdownPreferences(kind);
  const touchResetKey = React.useMemo(
    () =>
      JSON.stringify({
        kind,
        selectedMetric,
        selectedViewMode,
        filters,
      }),
    [filters, kind, selectedMetric, selectedViewMode]
  );
  const { handleClick, handleKeyDown, recordTouch } =
    useTwoStageTouchNavigation<string>(touchResetKey);
  const { formatValue, shouldMask } = useDisplayFormatter();

  const {
    displayRMultiples,
    defaultRiskAmount,
    analyticsDateBasis,
    breakEvenSettings,
  } = breakdownTradeSettings(plugin?.settings.trade);

  const sourceTrades = breakdownSourceTrades(data, analyticsDateBasis);
  const useStoredRMultiple = analyticsDateBasis !== 'exit';
  
  
  const mixedCurrencyPnL = hasUnconvertedMixedCurrencyPerformanceGroups(
    sourceTrades,
    {
      defaultCurrency: data.currency,
      conversionBaseCurrency: data.metrics.conversionBaseCurrency,
      getGroups,
    }
  );
  const netViewUnavailable =
    selectedMetric === 'net' &&
    mixedCurrencyPnL &&
    !(
      displayRMultiples &&
      hasCompletePerformanceBreakdownRMultipleCoverage(sourceTrades, {
        defaultRiskAmount,
        useStoredRMultiple,
        getGroups,
      })
    );

  const headerProps = {
    title,
    metrics: data.metrics,
    sourceTrades,
    selectedMetric,
    onMetricChange: handleMetricChange,
    selectedViewMode,
    onViewModeChange: handleViewModeChange,
  };

  if (netViewUnavailable) {
    return (
      <div className="journalit-chart-widget">
        <PerformanceBreakdownHeader
          {...headerProps}
          showConversionInfo={false}
          usesRMultiples={false}
          showViewSelector={false}
        />
        <div className="journalit-chart-widget__body">
          <PerformanceBreakdownMixedCurrencyState />
        </div>
      </div>
    );
  }

  const result = buildPerformanceBreakdown(sourceTrades, {
    breakEvenSettings,
    defaultRiskAmount,
    useStoredRMultiple,
    includePnLTotals: !mixedCurrencyPnL,
    displayRMultiples,
    metric: selectedMetric,
    viewMode: selectedViewMode,
    getGroups,
    fixedRowOrder,
  });

  if (result.rankedRows.length === 0) {
    return <PerformanceBreakdownNoDataState message={emptyMessage} />;
  }

  const usesRMultiples = result.usesRMultiples;
  const currencyCode = breakdownCurrencyCode(data);
  const isMasked = shouldMask(
    breakdownMaskKind(selectedMetric, usesRMultiples)
  );
  const chartData: PerformanceBreakdownDataPoint[] = result.visibleRows.map(
    (row) => ({
      kind: 'data',
      ...row,
      displayValue: getDisplayValue(row, selectedMetric, usesRMultiples),
    })
  );
  const dividerLabel = breakdownDividerLabel(result);
  const openBreakdown = (label: string) => {
    if (!plugin) return;
    void openDashboardPerformanceBreakdownTarget({
      plugin,
      kind,
      label,
      filters,
      analyticsDateBasis,
      sourceTrades,
      getGroups,
    });
  };
  const formatXAxisTick = (value: number): string => {
    if (selectedMetric === 'winRate') {
      return formatValue({
        kind: 'returnPercent',
        value,
        signed: false,
        precision: value < 10 ? 1 : 0,
      });
    }

    return usesRMultiples
      ? formatValue({ kind: 'rMultiple', value, precision: 1 })
      : formatValue({ kind: 'pnl', value, currencyCode });
  };

  return (
    <div className="journalit-chart-widget">
      <PerformanceBreakdownHeader
        {...headerProps}
        showConversionInfo={
          selectedMetric === 'net' && !usesRMultiples && !isMasked
        }
        usesRMultiples={usesRMultiples}
        showViewSelector={
          result.rankedRows.length > PERFORMANCE_BREAKDOWN_MAX_VISIBLE_ROWS &&
          !isMasked
        }
      />
      <div className="journalit-chart-widget__body">
        <PerformanceBreakdownPlot
          chartRef={chartRef}
          chartData={chartData}
          displayChartData={breakdownDisplayData({
            isMasked,
            maskedLabel,
            chartData,
            dividerIndex: result.dividerIndex,
            dividerLabel,
          })}
          dividerIndex={result.dividerIndex}
          dividerLabel={dividerLabel}
          selectedMetric={selectedMetric}
          usesRMultiples={usesRMultiples}
          isMasked={isMasked}
          currencyCode={currencyCode}
          canNavigate={Boolean(plugin) && !isMasked}
          formatXAxisTick={formatXAxisTick}
          barHandlers={{
            onLabelClick: (label, event) =>
              handleClick(label, event, () => openBreakdown(label)),
            onLabelTouch: recordTouch,
          }}
          onBarKeyboardActivate={(point, event) =>
            handleKeyDown(event, () => openBreakdown(point.label))
          }
        />
      </div>
    </div>
  );
};

export const PerformanceBreakdownChart =
  React.memo<PerformanceBreakdownChartProps>(
    ({
      dateFormat,
      kind,
      title,
      emptyMessage,
      maskedLabel,
      getGroups,
      fixedRowOrder,
    }) => (
      <BaseWidget dateFormat={dateFormat} skeletonType="bar-chart">
        {(data, _dateFormat, filters) => (
          <PerformanceBreakdownBody
            data={data}
            filters={filters}
            kind={kind}
            title={title}
            emptyMessage={emptyMessage}
            maskedLabel={maskedLabel}
            getGroups={getGroups}
            fixedRowOrder={fixedRowOrder}
          />
        )}
      </BaseWidget>
    )
  );

PerformanceBreakdownChart.displayName = 'PerformanceBreakdownChart';
