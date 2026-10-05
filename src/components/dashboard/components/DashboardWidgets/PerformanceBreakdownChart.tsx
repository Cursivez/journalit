
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
import { useCurrency } from '../../../../contexts/CurrencyContext';
import { useDisplayFormatter } from '../../../../hooks/useDisplayPolicy';
import { normalizeBreakEvenRange } from '../../../../utils/breakEvenRange';
import { parseCuratedCurrencyCode } from '../../../../utils/currencyConfig';
import { ChartBase } from '../../../charts/ChartBase';
import { RechartsPortalTooltip } from '../../../charts/RechartsPortalTooltip';
import {
  buildCurrencyConversionMetadata,
  CurrencyConversionInfo,
} from '../../../shared/display/CurrencyConversionInfo';
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

export const PerformanceBreakdownChart =
  React.memo<PerformanceBreakdownChartProps>(
    ({
      filters,
      dateFormat,
      kind,
      title,
      emptyMessage,
      maskedLabel,
      getGroups,
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
      const { currency } = useCurrency();
      const { formatValue, shouldMask } = useDisplayFormatter();

      const displayRMultiples =
        plugin?.settings?.trade?.displayRMultiples ?? false;
      const defaultRiskAmount = plugin?.settings?.trade?.defaultRiskAmount;
      const analyticsDateBasis =
        plugin?.settings?.trade?.analyticsDateBasis ?? 'entry';
      const breakEvenRange = normalizeBreakEvenRange(plugin?.settings?.trade);
      const breakEvenSettings = {
        breakEvenRangeMin: breakEvenRange.min,
        breakEvenRangeMax: breakEvenRange.max,
        breakEvenThresholdMode:
          plugin?.settings?.trade?.breakEvenThresholdMode ?? 'fixed',
        breakEvenThresholdPercent:
          plugin?.settings?.trade?.breakEvenThresholdPercent,
      };

      return (
        <BaseWidget
          filters={filters}
          dateFormat={dateFormat}
          skeletonType="bar-chart"
        >
          {(data) => {
            const sourceTrades =
              analyticsDateBasis === 'exit'
                ? (data.realizedEventTrades ?? data.trades)
                : data.trades;
            const useStoredRMultiple = analyticsDateBasis !== 'exit';
            
            
            const mixedCurrencyPnL =
              hasUnconvertedMixedCurrencyPerformanceGroups(sourceTrades, {
                defaultCurrency: currency,
                conversionBaseCurrency: data.metrics.conversionBaseCurrency,
                getGroups,
              });
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
            });

            if (result.rankedRows.length === 0) {
              return <PerformanceBreakdownNoDataState message={emptyMessage} />;
            }

            const usesRMultiples = result.usesRMultiples;
            const activeCurrency =
              (data.metrics.isMultiCurrency
                ? data.metrics.conversionBaseCurrency
                : currency) || currency;
            const currencyCode = parseCuratedCurrencyCode(activeCurrency);
            const isMasked = shouldMask(
              selectedMetric === 'winRate'
                ? 'returnPercent'
                : usesRMultiples
                  ? 'rMultiple'
                  : 'pnl'
            );
            const chartData: PerformanceBreakdownDataPoint[] =
              result.visibleRows.map((row) => ({
                kind: 'data',
                ...row,
                displayValue: getDisplayValue(
                  row,
                  selectedMetric,
                  usesRMultiples
                ),
              }));
            const dividerLabel =
              result.dividerIndex === undefined
                ? undefined
                : t('dashboard.widgets.ticker-performance.omitted-count', {
                    count: String(result.omittedRowCount),
                  });
            const displayChartData = isMasked
              ? createMaskedChartData(maskedLabel)
              : result.dividerIndex !== undefined && dividerLabel !== undefined
                ? insertDividerPoint(
                    chartData,
                    result.dividerIndex,
                    dividerLabel
                  )
                : chartData;
            const canNavigate = Boolean(plugin) && !isMasked;
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
            const axisConfig = getAxisConfig(chartData, selectedMetric);
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
                    result.rankedRows.length >
                      PERFORMANCE_BREAKDOWN_MAX_VISIBLE_ROWS && !isMasked
                  }
                />
                <div className="journalit-chart-widget__body">
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
                      {selectedMetric === 'net' && !isMasked && (
                        <ReferenceLine
                          x={0}
                          stroke="var(--text-normal, #888888)"
                          strokeOpacity={0.5}
                          strokeDasharray="3 3"
                          strokeWidth={1.5}
                        />
                      )}
                      {!isMasked && dividerLabel !== undefined && (
                        <ReferenceLine
                          className="journalit-performance-breakdown-divider-line"
                          y={dividerLabel}
                          stroke="var(--background-modifier-border)"
                          strokeOpacity={0.65}
                          strokeWidth={1}
                          label={(props: LabelProps) => (
                            <PerformanceBreakdownDividerLabel
                              {...props}
                              dividerLabel={dividerLabel}
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
                        tick={(
                          props: PerformanceBreakdownCategoryTickProps
                        ) => (
                          <PerformanceBreakdownCategoryTick
                            {...props}
                            dividerIndex={result.dividerIndex}
                          />
                        )}
                        width={getCategoryAxisWidth(
                          chartData.map((item) => item.label)
                        )}
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
                        cursor={canNavigate ? 'pointer' : undefined}
                        activeBar={
                          canNavigate
                            ? {
                                stroke: 'var(--interactive-accent)',
                                strokeOpacity: 0.65,
                                strokeWidth: 1.2,
                                cursor: 'pointer',
                              }
                            : false
                        }
                        onClick={
                          canNavigate
                            ? (bar, _index, event) => {
                                const payload: unknown = bar.payload;
                                const label =
                                  getPerformanceBreakdownLabel(payload);
                                if (!label) return;
                                handleClick(label, event, () =>
                                  openBreakdown(label)
                                );
                              }
                            : undefined
                        }
                        onTouchEnd={
                          canNavigate
                            ? (bar) => {
                                const payload: unknown = bar.payload;
                                const label =
                                  getPerformanceBreakdownLabel(payload);
                                if (label) recordTouch(label);
                              }
                            : undefined
                        }
                        shape={(props: PerformanceBreakdownBarShapeProps) => (
                          <PerformanceBreakdownBarShape
                            {...props}
                            fillMode={
                              isMasked
                                ? 'masked'
                                : selectedMetric === 'net'
                                  ? 'net'
                                  : 'neutral'
                            }
                            navigationTabIndex={
                              canNavigate
                                ? props.index === 0
                                  ? 0
                                  : -1
                                : undefined
                            }
                            onKeyboardActivate={(point, event) =>
                              handleKeyDown(event, () =>
                                openBreakdown(point.label)
                              )
                            }
                          />
                        )}
                      />
                    </BarChart>
                  </ChartBase>
                </div>
              </div>
            );
          }}
        </BaseWidget>
      );
    }
  );

PerformanceBreakdownChart.displayName = 'PerformanceBreakdownChart';
