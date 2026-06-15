

import React, {
  useEffect,
  useState,
  useCallback,
  useLayoutEffect,
} from 'react';
import { FilterState } from '../../DashboardView';
import { formatDuration } from '../../../../utils/formatting';
import { parseCuratedCurrencyCode } from '../../../../utils/currencyConfig';
import {
  formatGroupedPnL,
  formatPnLWithCurrency,
  CurrencyGroupedPnL,
} from '../../../../utils/currencyAggregation';
import { formatHoldTime } from '../../utils/analyticsUtils';
import { getActiveLayout, saveLayout } from '../../utils/layoutUtils';
import { usePlugin } from '../../../../hooks/usePlugin';
import { useDashboardData } from '../../context/DashboardDataContext';
import { MetricCard } from './MetricCard';
import {
  DndContext,
  DragEndEvent,
  closestCenter,
  Modifier,
} from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MetricCardSkeleton } from '../../../shared';
import { useCurrency } from '../../../../contexts/CurrencyContext';
import { useDisplayFormatter } from '../../../../hooks/useDisplayPolicy';
import type { DisplayValueKind } from '../../../../services/display/DisplayPolicy';
import { eventBus, useEventBus } from '../../../../services/events';
import { t } from '../../../../lang/helpers';
import { dndKitStyle } from '../../../../styles/inlineStylePolicy';
import {
  getWeekStartDate,
  getWeekStartDaySetting,
  type WeekStartDaySetting,
} from '../../../../utils/dateUtils';
import { GripVertical } from '../../../shared/icons/ObsidianIcon';
import { fetchDashboardData, type DashboardData } from '../../utils/dataUtils';
import {
  createPeriodValueDelta,
  createStatDelta,
  signedNumber,
  type StatDelta,
} from '../../../../utils/previousPeriodDelta';


const PAST_30D_COMPARISON_EXCLUDED_METRICS = new Set([
  'maxDrawdown',
  'bestDay',
  'largestWin',
  'largestLoss',
  'longestWinStreak',
  'longestLossStreak',
  'longestDrawdown',
  'drawdownEpisodes',
  'avgRecoveryTime',
]);

const MONEY_AND_DECIMAL_DELTA_METRICS = new Set([
  'netPnL',
  'expectancy',
  'avgWin',
  'avgLoss',
  'bestDay',
  'largestWin',
  'largestLoss',
  'maxDrawdown',
  'profitFactor',
  'avgRR',
  'avgRRRiskBased',
  'avgWinnerHeat',
  'winnerMaeP90',
  'winnerMaeMedian',
  'avgLossHeat',
  'winnerAvgMfe',
  'loserAvgMfe',
  'winnerMfeP90',
  'loserMfeP90',
]);

const MAE_MFE_METRICS = new Set([
  'avgWinnerHeat',
  'winnerMaeP90',
  'winnerMaeMedian',
  'avgLossHeat',
  'winnerAvgMfe',
  'loserAvgMfe',
  'winnerMfeP90',
  'loserMfeP90',
]);

function getDashboardMetricValue(
  metrics: DashboardData['metrics'],
  metric: string
): number | undefined {
  const metricKey = (() => {
    switch (metric) {
      case 'timeInDrawdown':
        return 'percentTimeInDrawdownDays';
      case 'avgRecoveryTime':
        return 'averageRecoveryDurationDays';
      case 'longestDrawdown':
        return 'longestDrawdownDurationDays';
      case 'drawdownEpisodes':
        return 'drawdownEpisodeCount';
      default:
        return metric;
    }
  })();

  const value = Object.entries(metrics).find(([key]) => key === metricKey)?.[1];
  return typeof value === 'number' ? value : undefined;
}

function getMetricDeltaZeroThreshold(
  metric: string,
  usesRMultipleDelta: boolean
): number | undefined {
  if (usesRMultipleDelta) return 0.05;
  if (metric === 'timeInDrawdown') return 0.05;
  if (metric === 'winRate') return 0.0005;
  return MONEY_AND_DECIMAL_DELTA_METRICS.has(metric) ? 0.005 : undefined;
}

const restrictToHorizontalAxis: Modifier = ({ transform }) => {
  return {
    ...transform,
    y: 0, 
  };
};

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function endOfDay(date: Date): Date {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    23,
    59,
    59,
    999
  );
}

function isSameLocalDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isSameRangeEndDate(endDate: Date, expectedEndDate: Date): boolean {
  return isSameLocalDay(endOfDay(endDate), endOfDay(expectedEndDate));
}

function formatDurationDelta(valueMs: number): string {
  const prefix = valueMs > 0 ? '+' : valueMs < 0 ? '-' : '';
  return `${prefix}${formatDuration(Math.abs(valueMs))}`;
}

function formatTrimmedDecimal(value: number, precision = 2): string {
  const formatted = value.toFixed(precision);
  return formatted.replace(/(\.\d*?[1-9])0+$/, '$1').replace(/\.0+$/, '');
}

function minDate(a: Date, b: Date): Date {
  return a.getTime() <= b.getTime() ? a : b;
}

function getDashboardComparisonDateRange(
  filters: FilterState,
  weekStartDay: WeekStartDaySetting
): {
  dateRange: [Date | null, Date | null];
  mode: 'previous' | 'past30d';
} {
  const [startDate, endDate] = filters.dateRange;
  const today = new Date();

  if (!startDate && !endDate) {
    const past30Start = startOfDay(today);
    past30Start.setDate(past30Start.getDate() - 29);
    return { dateRange: [past30Start, endOfDay(today)], mode: 'past30d' };
  }

  const resolvedEnd = endDate ? endOfDay(endDate) : endOfDay(today);
  const resolvedStart = startDate
    ? startOfDay(startDate)
    : (() => {
        const fallbackStart = startOfDay(resolvedEnd);
        fallbackStart.setDate(fallbackStart.getDate() - 29);
        return fallbackStart;
      })();
  const elapsedMs = resolvedEnd.getTime() - resolvedStart.getTime();
  const todayStart = startOfDay(today);

  const thisYearStart = startOfDay(new Date(today.getFullYear(), 0, 1));
  if (
    isSameLocalDay(resolvedStart, thisYearStart) &&
    isSameRangeEndDate(resolvedEnd, todayStart)
  ) {
    const previousStart = new Date(today.getFullYear() - 1, 0, 1);
    const previousEnd = endOfDay(new Date(today.getFullYear() - 1, 11, 31));
    return {
      dateRange: [
        previousStart,
        minDate(new Date(previousStart.getTime() + elapsedMs), previousEnd),
      ],
      mode: 'previous',
    };
  }

  const quarterStartMonth = Math.floor(today.getMonth() / 3) * 3;
  const thisQuarterStart = startOfDay(
    new Date(today.getFullYear(), quarterStartMonth, 1)
  );
  if (
    isSameLocalDay(resolvedStart, thisQuarterStart) &&
    isSameRangeEndDate(resolvedEnd, todayStart)
  ) {
    const previousStart = new Date(
      today.getFullYear(),
      quarterStartMonth - 3,
      1
    );
    const previousEnd = endOfDay(
      new Date(previousStart.getFullYear(), previousStart.getMonth() + 3, 0)
    );
    return {
      dateRange: [
        previousStart,
        minDate(new Date(previousStart.getTime() + elapsedMs), previousEnd),
      ],
      mode: 'previous',
    };
  }

  const thisWeekStart = startOfDay(getWeekStartDate(today, weekStartDay));
  if (
    isSameLocalDay(resolvedStart, thisWeekStart) &&
    isSameRangeEndDate(resolvedEnd, todayStart)
  ) {
    const previousStart = new Date(thisWeekStart);
    previousStart.setDate(previousStart.getDate() - 7);
    return {
      dateRange: [
        previousStart,
        endOfDay(new Date(previousStart.getTime() + elapsedMs)),
      ],
      mode: 'previous',
    };
  }

  const thisMonthStart = startOfDay(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  if (
    isSameLocalDay(resolvedStart, thisMonthStart) &&
    isSameRangeEndDate(resolvedEnd, todayStart)
  ) {
    const previousStart = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1
    );
    const previousEnd = endOfDay(
      new Date(previousStart.getFullYear(), previousStart.getMonth() + 1, 0)
    );
    return {
      dateRange: [
        previousStart,
        minDate(new Date(previousStart.getTime() + elapsedMs), previousEnd),
      ],
      mode: 'previous',
    };
  }

  if (elapsedMs < 7 * 24 * 60 * 60 * 1000) {
    const previousEnd = new Date(resolvedStart.getTime() - 1);
    const previousStart = new Date(previousEnd.getTime() - elapsedMs);
    return { dateRange: [previousStart, previousEnd], mode: 'previous' };
  }

  const previousEnd = new Date(resolvedStart.getTime() - 1);
  const previousStart = new Date(previousEnd.getTime() - elapsedMs);

  return { dateRange: [previousStart, previousEnd], mode: 'previous' };
}

interface TopSectionProps {
  filters: FilterState;
  isEditing: boolean;
  onShowMetricSelector?: () => void;
  hideAddButton?: boolean;
}


const SortableMetricCard: React.FC<{
  id: string;
  name: string;
  value: string;
  valueSuffix?: string;
  isPositive?: boolean;
  isEditing: boolean;
  onRemove: (id: string) => void;
  mainPart?: string;
  decimalPart?: string;
  tooltip?: React.ReactNode;
  valueSuffixIsPositive?: boolean;
  hasWarning?: boolean;
  previousDelta?: StatDelta;
}> = ({
  id,
  name,
  value,
  valueSuffix,
  valueSuffixIsPositive,
  isPositive,
  isEditing,
  onRemove,
  mainPart,
  decimalPart,
  tooltip,
  hasWarning,
  previousDelta,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id,
      disabled: !isEditing,
    });

  const transformString = CSS.Transform.toString(
    transform ? { ...transform, y: 0 } : transform
  );

  
  
  return (
    <div
      ref={setNodeRef}
      className="journalit-dashboard-metric-wrapper journalit-dashboard-metric-wrapper--sortable"
      style={dndKitStyle(transformString, transition)}
      data-editing={isEditing ? 'true' : 'false'}
    >
      <div
        className="journalit-dashboard-metric-handle"
        data-editing={isEditing ? 'true' : 'false'}
      >
        <div
          {...attributes}
          {...(isEditing ? listeners : {})}
          className="journalit-dashboard-metric-handle-inner"
        >
          <MetricCard
            name={name}
            value={value}
            valueSuffix={valueSuffix}
            valueSuffixIsPositive={valueSuffixIsPositive}
            isPositive={isPositive}
            mainPart={mainPart}
            decimalPart={decimalPart}
            tooltip={tooltip}
            hasWarning={hasWarning}
            previousDelta={previousDelta}
          />
          {isEditing && (
            <div
              className="journalit-dashboard-metric-drag-indicator"
              aria-hidden="true"
            >
              <GripVertical size={14} />
            </div>
          )}
        </div>

        {isEditing && (
          <button
            className="journalit-dashboard-widget-remove"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onRemove(id);
            }}
            aria-label={t('dashboard.top-section.remove-metric')}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};


function useTopSectionModel({ filters }: Pick<TopSectionProps, 'filters'>) {
  const plugin = usePlugin();
  const { currency } = useCurrency();
  const { formatValue, shouldMask } = useDisplayFormatter();
  const { dashboardData: data, error: contextError } = useDashboardData();
  const [activeMetrics, setActiveMetrics] = useState<string[]>([]);
  const error = contextError
    ? contextError.message || t('dashboard.top-section.failed-load')
    : null;
  const [comparisonData, setComparisonData] = useState<DashboardData | null>(
    null
  );
  const [comparisonMode, setComparisonMode] = useState<'previous' | 'past30d'>(
    'previous'
  );

  
  useLayoutEffect(() => {
    return () => {};
  }, []);

  useEffect(() => {
    if (!plugin?.tradeService || !data) {
      setComparisonData(null);
      return;
    }

    const comparisonRange = getDashboardComparisonDateRange(
      filters,
      getWeekStartDaySetting(plugin)
    );
    setComparisonData(null);
    setComparisonMode(comparisonRange.mode);

    let isMounted = true;
    fetchDashboardData(
      plugin.app,
      plugin.tradeService,
      { ...filters, dateRange: comparisonRange.dateRange },
      plugin.settings?.trade?.defaultRiskAmount,
      plugin,
      { freshTradeQuery: false }
    )
      .then((nextComparisonData) => {
        if (isMounted) setComparisonData(nextComparisonData);
      })
      .catch((comparisonError) => {
        console.error(
          '[Dashboard] Failed to load previous period metrics:',
          comparisonError
        );
        if (isMounted) setComparisonData(null);
      });

    return () => {
      isMounted = false;
    };
  }, [data, filters, plugin]);

  
  useEffect(() => {
    const initializeMetrics = () => {
      try {
        if (plugin) {
          const activeLayout = getActiveLayout(plugin);
          setActiveMetrics(activeLayout.topSection);
        }
      } catch (error) {
        console.error('Error initializing metrics:', error);
        setActiveMetrics(['netPnL', 'winRate', 'profitFactor', 'expectancy']);
      }
    };

    initializeMetrics();
  }, [plugin]);

  
  const handleMetricsChanged = useCallback(
    (payload: { activeMetrics: string[] }) => {
      setActiveMetrics([...payload.activeMetrics]);
    },
    []
  );

  
  useEventBus('metrics:changed', handleMetricsChanged);

  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      
      const oldIndex = activeMetrics.indexOf(active.id.toString());
      const newIndex = activeMetrics.indexOf(over.id.toString());

      if (oldIndex !== -1 && newIndex !== -1) {
        const newMetrics = [...activeMetrics];
        newMetrics.splice(oldIndex, 1);
        newMetrics.splice(newIndex, 0, active.id.toString());

        setActiveMetrics(newMetrics);

        
        if (plugin) {
          try {
            const currentLayout = getActiveLayout(plugin);
            const newLayout = {
              ...currentLayout,
              topSection: newMetrics,
            };

            
            void saveLayout(plugin, 'Default', newLayout);
          } catch (error) {
            console.error('Error saving layout:', error);
          }
        }
      }
    }
  };

  
  const handleRemoveMetric = async (metricId: string) => {
    if (plugin) {
      try {
        
        const newMetrics = activeMetrics.filter((id) => id !== metricId);

        
        setActiveMetrics([...newMetrics]);

        
        const currentLayout = getActiveLayout(plugin);
        const newLayout = {
          ...currentLayout,
          topSection: [...newMetrics],
        };

        
        try {
          await saveLayout(plugin, 'Default', newLayout);
        } catch (err) {
          console.error('Error saving layout:', err);
        }

        
        
        window.activeDocument
          .querySelectorAll('.journalit-dashboard-widget-remove')
          .forEach((el) => {
            if (!el.instanceOf(HTMLElement)) {
              return;
            }

            
            el.classList.add('jl-force-redraw');
            window.setTimeout(() => {
              el.classList.remove('jl-force-redraw');
            }, 10);
          });

        
        
        eventBus.publish('metrics:changed', { activeMetrics: newMetrics });
      } catch (error) {
        console.error('Error removing metric:', error);
      }
    }
  };

  const getMetricDisplayKind = (metric: string): DisplayValueKind => {
    switch (metric) {
      case 'netPnL':
      case 'expectancy':
      case 'avgWin':
      case 'avgLoss':
      case 'largestWin':
      case 'largestLoss':
      case 'bestDay':
        return 'pnl';
      case 'maxDrawdown':
        return 'drawdown';
      case 'winRate':
      case 'timeInDrawdown':
        return 'returnPercent';
      case 'profitFactor':
      case 'avgRR':
      case 'avgRRRiskBased':
        return 'metric';
      default:
        if (MAE_MFE_METRICS.has(metric)) return 'metric';
        return 'count';
    }
  };

  
  const formatMetricValue = (metric: string, value: number): string => {
    if (value === undefined || value === null || isNaN(value)) {
      return 'N/A';
    }

    const effectiveCurrency =
      data?.metrics.isMultiCurrency && data?.metrics.conversionBaseCurrency
        ? parseCuratedCurrencyCode(data.metrics.conversionBaseCurrency)
        : currency;
    const kind = getMetricDisplayKind(metric);

    if (metric === 'netPnL' && data?.metrics.isMultiCurrency) {
      if (
        shouldMask('pnl') ||
        (plugin?.settings?.trade?.displayRMultiples &&
          data.metrics.netPnLR !== undefined)
      ) {
        return formatValue({
          kind: 'pnl',
          value,
          currencyCode: effectiveCurrency,
          rMultiple: data.metrics.netPnLR,
        });
      }

      if (
        data.metrics.convertedNetPnL !== undefined &&
        data.metrics.conversionBaseCurrency
      ) {
        return formatPnLWithCurrency(
          data.metrics.convertedNetPnL,
          data.metrics.conversionBaseCurrency,
          false
        );
      }

      if (data.metrics.netPnLByCurrency) {
        const grouped: CurrencyGroupedPnL = {
          byCurrency: data.metrics.netPnLByCurrency,
          isMultiCurrency: true,
          currencies: Object.keys(data.metrics.netPnLByCurrency).sort(),
          defaultCurrency: data.metrics.primaryCurrency || 'USD',
        };
        const formatted = formatGroupedPnL(grouped, true);
        return Array.isArray(formatted) ? formatted.join(' | ') : formatted;
      }
    }

    switch (metric) {
      case 'netPnL':
        return formatValue({
          kind: 'pnl',
          value,
          currencyCode: effectiveCurrency,
          rMultiple: data?.metrics.netPnLR,
        });
      case 'expectancy':
        return formatValue({
          kind: 'pnl',
          value,
          currencyCode: effectiveCurrency,
          rMultiple: data?.metrics.expectancyR,
        });
      case 'avgWin':
        return formatValue({
          kind: 'pnl',
          value,
          currencyCode: effectiveCurrency,
          rMultiple: data?.metrics.avgWinR,
        });
      case 'avgLoss':
        return formatValue({
          kind: 'pnl',
          value,
          currencyCode: effectiveCurrency,
          rMultiple:
            data?.metrics.avgLossR !== undefined
              ? -Math.abs(data.metrics.avgLossR)
              : undefined,
        });
      case 'largestWin':
        return formatValue({
          kind: 'pnl',
          value,
          currencyCode: effectiveCurrency,
          rMultiple: data?.metrics.largestWinR,
        });
      case 'largestLoss':
        return formatValue({
          kind: 'pnl',
          value: Math.abs(value),
          currencyCode: effectiveCurrency,
          rMultiple: data?.metrics.largestLossR,
        });
      case 'maxDrawdown':
        return data?.metrics.maxDrawdownAmountPercent != null &&
          Number.isFinite(data.metrics.maxDrawdownAmountPercent)
          ? formatValue({
              kind: 'percentage',
              value: -Math.abs(data.metrics.maxDrawdownAmountPercent),
              signed: true,
              precision: 1,
            })
          : formatValue({
              kind: 'drawdown',
              value: Math.abs(value),
              currencyCode: effectiveCurrency,
              rMultiple: data?.metrics.maxDrawdownR,
            });
      case 'bestDay':
        return formatValue({
          kind: 'pnl',
          value,
          currencyCode: effectiveCurrency,
          rMultiple: data?.metrics.bestDayR,
        });
      case 'winRate':
        return formatValue({
          kind,
          value: value * 100,
          signed: false,
          precision: 1,
        });
      case 'timeInDrawdown':
        return formatValue({ kind, value, signed: false, precision: 1 });
      case 'profitFactor':
        return shouldMask(kind)
          ? formatValue({ kind, value, precision: 2 })
          : value === Infinity || value > 999
            ? '999+'
            : value.toFixed(2);
      case 'avgRR':
      case 'avgRRRiskBased':
        return shouldMask(kind)
          ? formatValue({ kind, value, precision: 2 })
          : value > 999
            ? '999+'
            : value.toFixed(2);
      case 'avgWinnerHeat':
      case 'winnerMaeP90':
      case 'winnerMaeMedian':
      case 'avgLossHeat':
      case 'winnerAvgMfe':
      case 'loserAvgMfe':
      case 'winnerMfeP90':
      case 'loserMfeP90':
        return shouldMask('metric')
          ? formatValue({ kind: 'metric', value, precision: 2 })
          : formatTrimmedDecimal(value);
      case 'avgHoldTime':
      case 'avgWinHoldTime':
      case 'avgLossHoldTime':
        if (value === 0) return '-';
        return formatHoldTime(value);
      case 'avgRecoveryTime':
      case 'longestDrawdown':
        if (value === 0) return '-';
        return formatDuration(value * 24 * 60 * 60 * 1000);
      default:
        return formatValue({ kind, value });
    }
  };

  
  const getMetricName = (metric: string): string => {
    switch (metric) {
      case 'netPnL':
        return t('dashboard.metrics.netPnL');
      case 'winRate':
        return t('dashboard.metrics.winRate');
      case 'profitFactor':
        return t('dashboard.metrics.profitFactor');
      case 'expectancy':
        return t('dashboard.metrics.expectancy');
      case 'numTrades':
        return t('dashboard.metrics.numTrades');
      case 'numWinTrades':
        return t('dashboard.metrics.numWinTrades');
      case 'numLossTrades':
        return t('dashboard.metrics.numLossTrades');
      case 'avgWin':
        return t('dashboard.metrics.avgWin');
      case 'avgLoss':
        return t('dashboard.metrics.avgLoss');
      case 'avgRR':
        return t('dashboard.metrics.avgRR');
      case 'avgRRRiskBased':
        return t('dashboard.metrics.avgRRRiskBased');
      case 'maxDrawdown':
        return t('dashboard.metrics.maxDrawdown');
      case 'timeInDrawdown':
        return t('metric.timeInDrawdown.name');
      case 'avgRecoveryTime':
        return t('metric.avgRecoveryTime.name');
      case 'longestDrawdown':
        return t('metric.longestDrawdown.name');
      case 'drawdownEpisodes':
        return t('metric.drawdownEpisodes.name');
      case 'bestDay':
        return t('dashboard.metrics.bestDay');
      case 'largestWin':
        return t('dashboard.metrics.largestWin');
      case 'largestLoss':
        return t('dashboard.metrics.largestLoss');
      case 'longestWinStreak':
        return t('dashboard.metrics.longestWinStreak');
      case 'longestLossStreak':
        return t('dashboard.metrics.longestLossStreak');
      case 'avgHoldTime':
        return t('dashboard.metrics.avgHoldTime');
      case 'avgWinHoldTime':
        return t('dashboard.metrics.avgWinHoldTime');
      case 'avgLossHoldTime':
        return t('dashboard.metrics.avgLossHoldTime');
      case 'avgWinnerHeat':
        return t('dashboard.metrics.avgWinnerHeat');
      case 'winnerMaeP90':
        return t('dashboard.metrics.winnerMaeP90');
      case 'winnerMaeMedian':
        return t('dashboard.metrics.winnerMaeMedian');
      case 'avgLossHeat':
        return t('dashboard.metrics.avgLossHeat');
      case 'winnerAvgMfe':
        return t('dashboard.metrics.winnerAvgMfe');
      case 'loserAvgMfe':
        return t('dashboard.metrics.loserAvgMfe');
      case 'winnerMfeP90':
        return t('dashboard.metrics.winnerMfeP90');
      case 'loserMfeP90':
        return t('dashboard.metrics.loserMfeP90');
      default:
        return metric;
    }
  };

  const createMetricDelta = (metric: string, metricValue: number) => {
    if (!data || !comparisonData) return undefined;

    const rawComparisonValue = getDashboardMetricValue(
      comparisonData.metrics,
      metric
    );
    if (!Number.isFinite(metricValue) || rawComparisonValue === undefined) {
      return undefined;
    }
    const normalizedMetricValue =
      metric === 'avgLoss' || metric === 'largestLoss'
        ? -Math.abs(metricValue)
        : metricValue;
    const comparisonValue =
      metric === 'avgLoss' || metric === 'largestLoss'
        ? -Math.abs(rawComparisonValue)
        : rawComparisonValue;
    const currentMaxDrawdownPercent = data.metrics.maxDrawdownAmountPercent;
    const comparisonMaxDrawdownPercent =
      comparisonData.metrics.maxDrawdownAmountPercent;
    const usesMaxDrawdownPercentDelta =
      metric === 'maxDrawdown' &&
      currentMaxDrawdownPercent != null &&
      Number.isFinite(currentMaxDrawdownPercent) &&
      comparisonMaxDrawdownPercent != null &&
      Number.isFinite(comparisonMaxDrawdownPercent);

    if (
      metric === 'maxDrawdown' &&
      !usesMaxDrawdownPercentDelta &&
      (currentMaxDrawdownPercent != null ||
        comparisonMaxDrawdownPercent != null)
    ) {
      return undefined;
    }

    const kind = getMetricDisplayKind(metric);
    const masked = shouldMask(kind);
    const suffixKey =
      comparisonMode === 'past30d'
        ? ('dashboard.metrics.past-30d' as const)
        : ('widget.stats.vs-prev' as const);
    const rMultipleDeltaValues = (() => {
      if (!plugin?.settings?.trade?.displayRMultiples) return null;

      switch (metric) {
        case 'netPnL':
          return {
            current: data.metrics.netPnLR,
            comparison: comparisonData.metrics.netPnLR,
          };
        case 'expectancy':
          return {
            current: data.metrics.expectancyR,
            comparison: comparisonData.metrics.expectancyR,
          };
        case 'avgWin':
          return {
            current: data.metrics.avgWinR,
            comparison: comparisonData.metrics.avgWinR,
          };
        case 'avgLoss':
          return {
            current:
              data.metrics.avgLossR !== undefined
                ? -Math.abs(data.metrics.avgLossR)
                : undefined,
            comparison:
              comparisonData.metrics.avgLossR !== undefined
                ? -Math.abs(comparisonData.metrics.avgLossR)
                : undefined,
          };
        case 'bestDay':
          return {
            current: data.metrics.bestDayR,
            comparison: comparisonData.metrics.bestDayR,
          };
        case 'largestWin':
          return {
            current: data.metrics.largestWinR,
            comparison: comparisonData.metrics.largestWinR,
          };
        case 'largestLoss':
          return {
            current:
              data.metrics.largestLossR !== undefined
                ? -Math.abs(data.metrics.largestLossR)
                : undefined,
            comparison:
              comparisonData.metrics.largestLossR !== undefined
                ? -Math.abs(comparisonData.metrics.largestLossR)
                : undefined,
          };
        case 'maxDrawdown':
          return {
            current:
              data.metrics.maxDrawdownR !== undefined
                ? Math.abs(data.metrics.maxDrawdownR)
                : undefined,
            comparison:
              comparisonData.metrics.maxDrawdownR !== undefined
                ? Math.abs(comparisonData.metrics.maxDrawdownR)
                : undefined,
          };
        default:
          return null;
      }
    })();
    const usesRMultipleDelta =
      !usesMaxDrawdownPercentDelta &&
      rMultipleDeltaValues?.current !== undefined &&
      rMultipleDeltaValues.comparison !== undefined;
    const deltaCurrentValue = usesMaxDrawdownPercentDelta
      ? Math.abs(currentMaxDrawdownPercent)
      : usesRMultipleDelta
        ? (rMultipleDeltaValues.current ?? normalizedMetricValue)
        : normalizedMetricValue;
    const deltaComparisonValue = usesMaxDrawdownPercentDelta
      ? Math.abs(comparisonMaxDrawdownPercent)
      : usesRMultipleDelta
        ? (rMultipleDeltaValues.comparison ?? comparisonValue)
        : comparisonValue;
    const zeroThreshold = getMetricDeltaZeroThreshold(
      metric,
      usesRMultipleDelta
    );

    const formatDeltaValue = (deltaValue: number): string => {
      if (usesRMultipleDelta) {
        return formatValue({
          kind: 'rMultiple',
          value: deltaValue,
          signed: true,
          precision: 1,
        });
      }

      switch (metric) {
        case 'netPnL':
        case 'expectancy':
        case 'avgWin':
        case 'bestDay':
        case 'largestWin':
          return formatValue({
            kind: 'pnl',
            value: deltaValue,
            currencyCode: currency,
            signed: true,
          });
        case 'avgLoss':
        case 'largestLoss':
          return formatValue({
            kind: 'pnl',
            value: deltaValue,
            currencyCode: currency,
            signed: true,
          });
        case 'maxDrawdown':
          return usesMaxDrawdownPercentDelta
            ? formatValue({
                kind: 'percentage',
                value: deltaValue,
                signed: true,
                precision: 1,
              })
            : formatValue({
                kind: 'drawdown',
                value: deltaValue,
                currencyCode: currency,
                signed: true,
              });
        case 'winRate':
          return formatValue({
            kind: 'returnPercent',
            value: deltaValue * 100,
            signed: true,
            precision: 1,
          });
        case 'timeInDrawdown':
          return formatValue({
            kind: 'returnPercent',
            value: deltaValue,
            signed: true,
            precision: 1,
          });
        case 'profitFactor':
        case 'avgRR':
        case 'avgRRRiskBased':
        case 'avgWinnerHeat':
        case 'winnerMaeP90':
        case 'winnerMaeMedian':
        case 'avgLossHeat':
        case 'winnerAvgMfe':
        case 'loserAvgMfe':
        case 'winnerMfeP90':
        case 'loserMfeP90':
          return shouldMask('metric')
            ? formatValue({
                kind: 'metric',
                value: deltaValue,
                signed: true,
                precision: 2,
              })
            : `${deltaValue > 0 ? '+' : ''}${formatTrimmedDecimal(deltaValue)}`;
        case 'avgHoldTime':
        case 'avgWinHoldTime':
        case 'avgLossHoldTime':
          return formatDurationDelta(deltaValue);
        case 'avgRecoveryTime':
        case 'longestDrawdown':
          return formatDurationDelta(deltaValue * 24 * 60 * 60 * 1000);
        default:
          return signedNumber(deltaValue);
      }
    };

    const lowerIsBetter = [
      'maxDrawdown',
      'timeInDrawdown',
      'avgLossHoldTime',
      'avgRecoveryTime',
      'longestDrawdown',
      'drawdownEpisodes',
      'numLossTrades',
      'longestLossStreak',
      'avgWinnerHeat',
      'winnerMaeP90',
      'winnerMaeMedian',
      'avgLossHeat',
      'loserAvgMfe',
      'loserMfeP90',
    ].includes(metric);
    const neutralTone = [
      'numTrades',
      'avgHoldTime',
      'avgWinHoldTime',
      'avgLossHoldTime',
    ].includes(metric);

    if (comparisonMode === 'past30d') {
      if (PAST_30D_COMPARISON_EXCLUDED_METRICS.has(metric)) {
        return undefined;
      }

      return createPeriodValueDelta(deltaComparisonValue, {
        dataAvailable: comparisonData.trades.length > 0,
        masked,
        formatter: formatDeltaValue,
        lowerIsBetter,
        neutralTone,
        zeroThreshold,
        suffixKey,
      });
    }

    return createStatDelta(deltaCurrentValue, deltaComparisonValue, {
      previousDataAvailable: comparisonData.trades.length > 0,
      masked,
      formatter: formatDeltaValue,
      lowerIsBetter,
      neutralTone,
      zeroThreshold,
      suffixKey,
    });
  };

  const formatMetricPercentSuffix = (
    metric: string,
    formattedValue: string
  ): { value: string; isPositive: boolean } | undefined => {
    if (
      !data ||
      formattedValue === 'N/A' ||
      plugin?.settings?.trade?.displayRMultiples ||
      shouldMask(getMetricDisplayKind(metric))
    ) {
      return undefined;
    }

    const hasUnconvertedMultiCurrencyTotals =
      data.metrics.isMultiCurrency && !data.metrics.conversionBaseCurrency;
    if (
      hasUnconvertedMultiCurrencyTotals &&
      (metric === 'largestWin' || metric === 'largestLoss')
    ) {
      return undefined;
    }

    let percentValue: number | undefined;
    switch (metric) {
      case 'avgWin':
        percentValue = data.metrics.avgWinPercent;
        break;
      case 'avgLoss':
        percentValue = data.metrics.avgLossPercent;
        break;
      case 'largestWin':
        percentValue = data.metrics.largestWinPercent;
        break;
      case 'largestLoss':
        percentValue = data.metrics.largestLossPercent;
        break;
      case 'maxDrawdown':
        return data.metrics.maxDrawdownAmountPercent != null &&
          Number.isFinite(data.metrics.maxDrawdownAmountPercent)
          ? {
              value: formatValue({
                kind: 'drawdown',
                value: -Math.abs(data.metrics.maxDrawdown),
                currencyCode:
                  data.metrics.isMultiCurrency &&
                  data.metrics.conversionBaseCurrency
                    ? data.metrics.conversionBaseCurrency
                    : currency,
              }),
              isPositive: false,
            }
          : undefined;
      default:
        return undefined;
    }

    if (
      percentValue === undefined ||
      percentValue === null ||
      isNaN(percentValue)
    ) {
      return undefined;
    }

    const roundedPercent = Math.abs(percentValue).toFixed(1);
    const formattedPercent = roundedPercent.endsWith('.0')
      ? roundedPercent.slice(0, -2)
      : roundedPercent;

    return {
      value: `${percentValue >= 0 ? '↑' : '↓'} ${formattedPercent}%`,
      isPositive: percentValue >= 0,
    };
  };

  
  const isPositiveMetric = (
    metric: string,
    value: number
  ): boolean | undefined => {
    if (value === undefined || value === null || isNaN(value)) {
      return undefined;
    }

    switch (metric) {
      case 'netPnL':
      case 'profitFactor':
      case 'expectancy':
        return value > 0;
      case 'avgWin':
      case 'avgLoss':
        return undefined;
      case 'avgRR':
      case 'avgRRRiskBased':
        return value === 1 ? undefined : value > 1;
      case 'winRate':
        return undefined;
      case 'maxDrawdown':
      case 'timeInDrawdown':
      case 'largestLoss':
      case 'numLossTrades':
      case 'bestDay':
      case 'largestWin':
      case 'longestWinStreak':
        return undefined;
      case 'avgHoldTime':
      case 'avgWinHoldTime':
      case 'avgRecoveryTime':
      case 'longestDrawdown':
      case 'drawdownEpisodes':
      case 'numTrades':
      case 'numWinTrades':
        return undefined; 
      case 'avgLossHoldTime':
        return undefined;
      case 'longestLossStreak':
        return undefined;
      default:
        return undefined; 
    }
  };

  
  const isCurrencyMetric = (metric: string): boolean => {
    if (
      metric === 'maxDrawdown' &&
      data?.metrics.maxDrawdownAmountPercent != null &&
      Number.isFinite(data.metrics.maxDrawdownAmountPercent)
    ) {
      return false;
    }

    return [
      'netPnL',
      'expectancy',
      'avgWin',
      'avgLoss',
      'maxDrawdown',
      'bestDay',
      'largestWin',
      'largestLoss',
    ].includes(metric);
  };

  
  const CURRENCY_BASED_METRICS = [
    'netPnL',
    'expectancy',
    'avgWin',
    'avgLoss',
    'avgRR',
    'largestWin',
    'largestLoss',
    'maxDrawdown',
    'bestDay',
  ];

  
  const getMetricTooltip = (metric: string): React.ReactNode | undefined => {
    if (!data) return undefined;

    
    if (metric === 'avgRRRiskBased') {
      const validTrades = data.metrics.riskBasedTradesCount ?? 0;
      const totalClosedTrades = data.metrics.numTrades ?? 0;
      const validWins = data.metrics.riskBasedWinTradesCount ?? 0;
      const validLosses = data.metrics.riskBasedLossTradesCount ?? 0;
      const hasInsufficientBuckets = validWins === 0 || validLosses === 0;
      const hasPartialRiskCoverage =
        validTrades > 0 && validTrades < totalClosedTrades;
      const hasMultiCurrencyConversion =
        data.metrics.isMultiCurrency && data.metrics.conversionBaseCurrency;
      const unconverted = data.metrics.unconvertedCurrencies || [];
      const hasUnconvertedCurrencies = unconverted.length > 0;

      return (
        <div className="journalit-dashboard-metric-tooltip">
          <div className="journalit-dashboard-metric-tooltip__title">
            {t('dashboard.avgRRRiskBased.tooltip.title')}
          </div>
          <div>{t('dashboard.avgRRRiskBased.tooltip.formula')}</div>
          <div>
            {t('dashboard.avgRRRiskBased.tooltip.coverage', {
              valid: String(validTrades),
              total: String(totalClosedTrades),
            })}
          </div>
          <div>
            {t('dashboard.avgRRRiskBased.tooltip.breakdown', {
              wins: String(validWins),
              losses: String(validLosses),
            })}
          </div>
          {hasPartialRiskCoverage && (
            <div className="journalit-dashboard-metric-tooltip__warning">
              {t('dashboard.avgRRRiskBased.tooltip.partial-coverage', {
                valid: String(validTrades),
                total: String(totalClosedTrades),
              })}
            </div>
          )}
          {(validTrades === 0 || hasInsufficientBuckets) &&
            totalClosedTrades > 0 && (
              <div className="journalit-dashboard-metric-tooltip__warning">
                {t('dashboard.avgRRRiskBased.tooltip.no-data')}
              </div>
            )}
          {hasMultiCurrencyConversion && (
            <>
              <div className="journalit-dashboard-metric-tooltip__title">
                {t('dashboard.conversion.title', {
                  currency: data.metrics.conversionBaseCurrency || 'USD',
                })}
              </div>
              <div>
                {t('dashboard.conversion.using-ecb', {
                  date: data.metrics.conversionRateDate || 'latest',
                })}
              </div>
            </>
          )}
          {hasUnconvertedCurrencies && (
            <div className="journalit-dashboard-metric-tooltip__warning">
              {t('dashboard.conversion.excluded-warning', {
                converted: String(data.metrics.convertedTradeCount),
                total: String(data.metrics.originalTradeCount),
                excluded: String(
                  data.metrics.originalTradeCount! -
                    data.metrics.convertedTradeCount!
                ),
                currencies: unconverted.join(', '),
              })}
            </div>
          )}
        </div>
      );
    }

    if (
      metric === 'avgRR' &&
      data.metrics.isMultiCurrency &&
      !data.metrics.conversionBaseCurrency
    ) {
      return (
        <div className="journalit-dashboard-metric-tooltip">
          <div className="journalit-dashboard-metric-tooltip__title">
            {t('dashboard.metrics.avgRR')}
          </div>
          <div>{t('dashboard.avgRR.tooltip.formula')}</div>
          <div className="journalit-dashboard-metric-tooltip__warning">
            {t('dashboard.avgRR.tooltip.no-conversion')}
          </div>
        </div>
      );
    }

    if (!data.metrics.isMultiCurrency) return undefined;
    if (!data.metrics.conversionBaseCurrency) return undefined;

    
    if (CURRENCY_BASED_METRICS.includes(metric)) {
      const rateDate = data.metrics.conversionRateDate || 'latest';
      const baseCurrency = data.metrics.conversionBaseCurrency || 'USD';
      const unconverted = data.metrics.unconvertedCurrencies || [];

      return (
        <div className="journalit-dashboard-metric-tooltip">
          <div className="journalit-dashboard-metric-tooltip__title">
            {t('dashboard.conversion.title', { currency: baseCurrency })}
          </div>
          <div>{t('dashboard.conversion.using-ecb', { date: rateDate })}</div>
          {unconverted.length > 0 && (
            <div className="journalit-dashboard-metric-tooltip__warning">
              {t('dashboard.conversion.excluded-warning', {
                converted: String(data.metrics.convertedTradeCount),
                total: String(data.metrics.originalTradeCount),
                excluded: String(
                  data.metrics.originalTradeCount! -
                    data.metrics.convertedTradeCount!
                ),
                currencies: unconverted.join(', '),
              })}
            </div>
          )}
        </div>
      );
    }

    return undefined;
  };

  const getConversionExcludedWarningMessage = (): string | undefined => {
    if (!data?.metrics.isMultiCurrency) return undefined;

    const unconverted = data.metrics.unconvertedCurrencies || [];
    if (unconverted.length === 0) return undefined;

    const convertedCount =
      data.metrics.convertedTradeCount ?? data.metrics.numTrades ?? 0;
    const totalCount =
      data.metrics.originalTradeCount ??
      data.metrics.numTrades ??
      convertedCount;
    const excludedCount = Math.max(totalCount - convertedCount, 0);

    return t('dashboard.conversion.excluded-warning', {
      converted: String(convertedCount),
      total: String(totalCount),
      excluded: String(excludedCount),
      currencies: unconverted.join(', '),
    });
  };

  
  const hasMetricWarning = (metric: string): boolean => {
    if (metric === 'netPnL') {
      return getConversionExcludedWarningMessage() !== undefined;
    }

    if (metric === 'avgRR') {
      const hasExcludedCurrencies =
        getConversionExcludedWarningMessage() !== undefined;
      const hasMultiCurrencyWithoutConversion =
        Boolean(data?.metrics.isMultiCurrency) &&
        !data?.metrics.conversionBaseCurrency;

      return hasExcludedCurrencies || hasMultiCurrencyWithoutConversion;
    }

    if (metric === 'avgRRRiskBased' && data?.metrics) {
      const totalClosedTrades = data.metrics.numTrades ?? 0;
      const validTrades = data.metrics.riskBasedTradesCount ?? 0;
      const validWins = data.metrics.riskBasedWinTradesCount ?? 0;
      const validLosses = data.metrics.riskBasedLossTradesCount ?? 0;
      const hasUnconvertedCurrencies =
        getConversionExcludedWarningMessage() !== undefined;

      const hasPartialRiskCoverage =
        totalClosedTrades > 0 && validTrades < totalClosedTrades;
      const hasInsufficientBuckets =
        totalClosedTrades > 0 && (validWins === 0 || validLosses === 0);

      return (
        hasPartialRiskCoverage ||
        hasInsufficientBuckets ||
        hasUnconvertedCurrencies
      );
    }

    return false;
  };

  
  const getMainPart = (
    metric: string,
    value: number,
    formattedValue: string
  ): string | undefined => {
    if (!isCurrencyMetric(metric) && !MAE_MFE_METRICS.has(metric)) {
      return undefined;
    }

    
    
    if (formattedValue.includes('R')) {
      return undefined;
    }

    
    
    if (formattedValue.includes('K') || formattedValue.includes('M')) {
      return undefined;
    }

    
    if (formattedValue.includes('|')) {
      return undefined;
    }

    
    if (formattedValue.includes('.')) {
      
      return formattedValue.split('.')[0];
    }

    
    return formattedValue;
  };

  
  const getDecimalPart = (
    metric: string,
    value: number,
    formattedValue: string
  ): string | undefined => {
    if (!isCurrencyMetric(metric) && !MAE_MFE_METRICS.has(metric)) {
      return undefined;
    }

    
    
    if (formattedValue.includes('R')) {
      return undefined;
    }

    
    if (formattedValue.includes('K') || formattedValue.includes('M')) {
      return undefined;
    }

    
    if (formattedValue.includes('|')) {
      return undefined;
    }

    
    if (formattedValue.includes('.')) {
      const cents = formattedValue.split('.')[1];
      if (!cents || cents === '00') {
        return undefined;
      }

      
      return '.' + cents;
    }

    return undefined;
  };

  return {
    data,
    error,
    activeMetrics,
    handleDragEnd,
    formatMetricValue,
    formatMetricPercentSuffix,
    createMetricDelta,
    getMetricName,
    getMetricDisplayKind,
    isPositiveMetric,
    getMainPart,
    getDecimalPart,
    getMetricTooltip,
    hasMetricWarning,
    handleRemoveMetric,
    shouldMask,
  };
}

export const TopSection: React.FC<TopSectionProps> = ({
  filters,
  isEditing,
  onShowMetricSelector,
  hideAddButton = false,
}) => {
  const {
    data,
    error,
    activeMetrics,
    handleDragEnd,
    formatMetricValue,
    formatMetricPercentSuffix,
    createMetricDelta,
    getMetricName,
    getMetricDisplayKind,
    isPositiveMetric,
    getMainPart,
    getDecimalPart,
    getMetricTooltip,
    hasMetricWarning,
    handleRemoveMetric,
    shouldMask,
  } = useTopSectionModel({ filters });

  return (
    <div className="journalit-dashboard-top-section">
      {isEditing && !hideAddButton && onShowMetricSelector && (
        <div className="journalit-dashboard-top-section-header">
          <button
            className="journalit-dashboard-add-metric-button"
            onClick={onShowMetricSelector}
            type="button"
          >
            {t('dashboard.top-section.add-metric')}
          </button>
        </div>
      )}

      {!data && !error ? (
        <div className="metric-cards-skeleton">
          {Array.from({ length: 4 }).map((_, idx) => (
            <MetricCardSkeleton key={idx} />
          ))}
        </div>
      ) : error ? (
        <div className="journalit-dashboard-error">{error}</div>
      ) : data ? (
        <div className="journalit-dashboard-top-section-body">
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            autoScroll={true}
            modifiers={[restrictToHorizontalAxis]} 
          >
            <SortableContext
              items={activeMetrics}
              strategy={horizontalListSortingStrategy}
            >
              <div
                className="journalit-dashboard-metrics"
                id="topsection-metrics-container"
              >
                {activeMetrics.map((metric) => {
                  const metricValue =
                    getDashboardMetricValue(data.metrics, metric) ?? 0;
                  const formattedValue = formatMetricValue(metric, metricValue);

                  const percentSuffix = formatMetricPercentSuffix(
                    metric,
                    formattedValue
                  );
                  const previousDelta = createMetricDelta(metric, metricValue);

                  return (
                    <SortableMetricCard
                      key={metric}
                      id={metric}
                      name={getMetricName(metric)}
                      value={formattedValue}
                      valueSuffix={percentSuffix?.value}
                      valueSuffixIsPositive={percentSuffix?.isPositive}
                      isPositive={
                        shouldMask(getMetricDisplayKind(metric))
                          ? undefined
                          : isPositiveMetric(metric, metricValue)
                      }
                      isEditing={isEditing}
                      onRemove={(metric) => void handleRemoveMetric(metric)}
                      
                      mainPart={getMainPart(
                        metric,
                        metricValue,
                        formattedValue
                      )}
                      decimalPart={getDecimalPart(
                        metric,
                        metricValue,
                        formattedValue
                      )}
                      tooltip={getMetricTooltip(metric)}
                      hasWarning={hasMetricWarning(metric)}
                      previousDelta={previousDelta}
                    />
                  );
                })}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      ) : (
        <div className="journalit-dashboard-no-data">
          {t('dashboard.no-data')}
        </div>
      )}
    </div>
  );
};
