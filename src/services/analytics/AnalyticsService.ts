import type {
  DashboardData,
  Trade,
} from '../../components/dashboard/utils/dataUtils';
import type { CustomFieldDefinition } from '../../types/customFields';
import type { AnalyticsContext } from './AnalyticsContext';
import {
  analyticsGroupDisplayValue,
  analyticsGroupIdentity,
  compareAnalyticsStrings,
  getAnalyticsGroupKeys,
  type AnalyticsGroupingResolvers,
} from './grouping';
import { applyAnalyticsFilters } from './filters';
import { projectRegisteredMetric } from './metrics';
import {
  buildAnalyticsComparison,
  getPreviousPeriodRange,
  getPreviousYearRange,
} from './comparison';
import {
  getAnalyticsIntervalRange,
  getAnalyticsIntervalStart,
  shiftAnalyticsInterval,
} from './timeSeries';
import { getTradeAnalyticsTradingDay } from '../../utils/tradeAnalyticsDate';
import { safeParseDateValue } from '../../utils/dateUtils';
import { getTradingDay } from '../../utils/tradingDayUtils';
import {
  normalizeBreakEvenRange,
  normalizeBreakEvenThresholdPercent,
} from '../../utils/breakEvenRange';
import type {
  AnalyticsDateRange,
  AnalyticsEvaluationRequest,
  AnalyticsEvaluationResult,
  AnalyticsGroupDimension,
  AnalyticsGroupKey,
  AnalyticsMetricId,
  AnalyticsMetricValue,
  AnalyticsCalculationMetadata,
  AnalyticsSeriesRequest,
  AnalyticsSeriesResult,
  AnalyticsSeriesRow,
} from './types';
import { AnalyticsEvaluationError } from './types';

export interface DashboardMetricCalculationOptions {
  defaultRiskAmount?: number;
  breakEvenRangeMin?: number;
  breakEvenRangeMax?: number;
  breakEvenThresholdMode?: 'fixed' | 'percentage_current_balance';
  breakEvenThresholdPercent?: number;
  defaultCurrency?: string;
  analyticsDateBasis?: 'entry' | 'exit';
  tradingDayCutoffTime?: string;
  drawdownCapitalBasis?: AnalyticsContext['drawdownCapitalBasis'];
  maeMfeDisplayUnit?: AnalyticsContext['maeMfeDisplayUnit'];
  calmarHistoryIncomplete?: boolean;
  sharpeRatioTrades?: Trade[];
  unrealizedPnlTrades?: Trade[];
  tickExcursionSupplementTrades?: Trade[];
}

export type DashboardMetricCalculator = (
  trades: Trade[],
  options?: DashboardMetricCalculationOptions
) => DashboardData['metrics'];

export interface AnalyticsPreparedDataset {
  metricTrades: Trade[];
  
  calmarHistoryIncomplete?: boolean;
  sharpeRatioTrades?: Trade[];
  unrealizedPnlTrades?: Trade[];
  tickExcursionSupplementTrades?: Trade[];
  conversionMetadata?: {
    unconvertedCurrencies: string[];
    partiallyConvertedCurrencies?: string[];
    originalTradeCount: number;
    convertedTradeCount: number;
  };
  
  conversionIssueTrades?: AnalyticsConversionIssueTrades;
  preparedFor: {
    currency: string;
    analyticsDateBasis: 'entry' | 'exit';
  };
}

export interface AnalyticsServiceOptions {
  context: AnalyticsContext;
  calculateDashboardMetrics: DashboardMetricCalculator;
  isTradeOpen: (trade: Trade) => boolean;
  customFieldDefinitions?: CustomFieldDefinition[];
  groupingResolvers?: AnalyticsGroupingResolvers;
  resolveTradingDay?: AnalyticsTradingDayResolver;
}

export type AnalyticsDatasetRole =
  | 'metricTrades'
  | 'sharpeRatioTrades'
  | 'unrealizedPnlTrades'
  | 'tickExcursionSupplementTrades';

export type AnalyticsConversionIssueTrades = Partial<
  Record<AnalyticsDatasetRole, Trade[]>
>;

type AnalyticsTradingDayResolver = (
  trade: Trade,
  role: AnalyticsDatasetRole
) => Date | null;

const SINGLE_CURRENCY_METRICS = new Set<AnalyticsMetricId>([
  'net_pnl',
  'profit_factor',
  'expectancy',
  'average_win',
  'average_loss',
  'payoff_ratio',
  'sharpe_ratio',
  'max_drawdown',
  'best_day',
  'largest_win',
  'largest_loss',
]);

interface AnalyticsPartitionDescriptor {
  groupKey?: AnalyticsGroupKey;
  intervalStart?: Date;
}

interface CachedAnalyticsGroups {
  keys: AnalyticsGroupKey[];
  identities: Set<string>;
}

interface AnalyticsEvaluationCache {
  groupDimension?: AnalyticsGroupDimension;
  tradingDays: Record<AnalyticsDatasetRole, WeakMap<Trade, Date | null>>;
  groups: Record<AnalyticsDatasetRole, WeakMap<Trade, CachedAnalyticsGroups>>;
}

const DATASET_ROLES: AnalyticsDatasetRole[] = [
  'metricTrades',
  'sharpeRatioTrades',
  'unrealizedPnlTrades',
  'tickExcursionSupplementTrades',
];

function createRoleCaches<T>(): Record<
  AnalyticsDatasetRole,
  WeakMap<Trade, T>
> {
  return {
    metricTrades: new WeakMap<Trade, T>(),
    sharpeRatioTrades: new WeakMap<Trade, T>(),
    unrealizedPnlTrades: new WeakMap<Trade, T>(),
    tickExcursionSupplementTrades: new WeakMap<Trade, T>(),
  };
}

export class AnalyticsService {
  private readonly context: AnalyticsContext;
  private readonly calculator: DashboardMetricCalculator;
  private readonly isTradeOpen: (trade: Trade) => boolean;
  private readonly customFieldDefinitions: CustomFieldDefinition[];
  private readonly groupingResolvers: AnalyticsGroupingResolvers;
  private readonly resolveTradingDay: AnalyticsTradingDayResolver;

  constructor(options: AnalyticsServiceOptions) {
    this.context = options.context;
    this.calculator = options.calculateDashboardMetrics;
    this.isTradeOpen = options.isTradeOpen;
    this.customFieldDefinitions = options.customFieldDefinitions ?? [];
    this.groupingResolvers = options.groupingResolvers ?? {};
    const analyticsPlugin = {
      settings: {
        trade: {
          tradingDayCutoffTime: this.context.tradingDayCutoffTime,
        },
      },
    };
    this.resolveTradingDay =
      options.resolveTradingDay ??
      ((trade, role) => {
        if (
          role === 'unrealizedPnlTrades' &&
          this.context.analyticsDateBasis === 'exit'
        ) {
          const snapshotTime = safeParseDateValue(
            trade.unrealizedPriceSnapshotTime
          );
          if (snapshotTime) return getTradingDay(snapshotTime, analyticsPlugin);
        }
        return getTradeAnalyticsTradingDay(
          trade,
          this.context.analyticsDateBasis,
          analyticsPlugin
        );
      });
  }

  private buildCalculatorOptions(
    dataset: AnalyticsPreparedDataset
  ): DashboardMetricCalculationOptions {
    return {
      defaultRiskAmount: this.context.defaultRiskAmount,
      breakEvenRangeMin: this.context.breakEvenRangeMin,
      breakEvenRangeMax: this.context.breakEvenRangeMax,
      breakEvenThresholdMode: this.context.breakEvenThresholdMode,
      breakEvenThresholdPercent: this.context.breakEvenThresholdPercent,
      defaultCurrency: this.context.currency,
      analyticsDateBasis: this.context.analyticsDateBasis,
      tradingDayCutoffTime: this.context.tradingDayCutoffTime,
      drawdownCapitalBasis: this.context.drawdownCapitalBasis,
      maeMfeDisplayUnit: this.context.maeMfeDisplayUnit,
      calmarHistoryIncomplete: dataset.calmarHistoryIncomplete,
      sharpeRatioTrades: dataset.sharpeRatioTrades,
      unrealizedPnlTrades: dataset.unrealizedPnlTrades,
      tickExcursionSupplementTrades: dataset.tickExcursionSupplementTrades,
    };
  }

  private assertPreparedForContext(dataset: AnalyticsPreparedDataset): void {
    if (
      dataset.preparedFor.currency !== this.context.currency ||
      dataset.preparedFor.analyticsDateBasis !== this.context.analyticsDateBasis
    ) {
      throw new Error('Analytics dataset was not prepared for this context');
    }
  }

  private applyFilters(
    trades: Trade[],
    request: AnalyticsEvaluationRequest
  ): Trade[] {
    if (!request.filters) return trades;
    return applyAnalyticsFilters(trades, request.filters, {
      customFieldDefinitions: this.customFieldDefinitions,
      isTradeOpen: this.isTradeOpen,
      breakEvenSettings: {
        breakEvenRangeMin: this.context.breakEvenRangeMin,
        breakEvenRangeMax: this.context.breakEvenRangeMax,
        breakEvenThresholdMode: this.context.breakEvenThresholdMode,
        breakEvenThresholdPercent: this.context.breakEvenThresholdPercent,
      },
      getBreakEvenBalance: (trade) => trade.breakEvenAccountCurrentBalance,
    });
  }

  private filterDataset(
    dataset: AnalyticsPreparedDataset,
    request: AnalyticsEvaluationRequest
  ): AnalyticsPreparedDataset {
    const result: AnalyticsPreparedDataset = {
      ...dataset,
      metricTrades: this.applyFilters(dataset.metricTrades, request),
      sharpeRatioTrades: dataset.sharpeRatioTrades
        ? this.applyFilters(dataset.sharpeRatioTrades, request)
        : undefined,
      unrealizedPnlTrades: dataset.unrealizedPnlTrades
        ? this.applyFilters(dataset.unrealizedPnlTrades, request)
        : undefined,
      tickExcursionSupplementTrades: dataset.tickExcursionSupplementTrades
        ? this.applyFilters(dataset.tickExcursionSupplementTrades, request)
        : undefined,
    };
    if (dataset.conversionIssueTrades) {
      result.conversionIssueTrades = {};
      for (const role of DATASET_ROLES) {
        const issueTrades = dataset.conversionIssueTrades[role];
        if (issueTrades) {
          result.conversionIssueTrades[role] = this.applyFilters(
            issueTrades,
            request
          );
        }
      }
    }
    return result;
  }

  private containsUnconvertedForeignCurrencies(
    dataset: AnalyticsPreparedDataset
  ): boolean {
    if (dataset.conversionIssueTrades !== undefined) {
      for (const role of DATASET_ROLES) {
        const issues = dataset.conversionIssueTrades[role];
        if (issues && issues.length > 0) return true;

        
        
        if (
          issues === undefined &&
          dataset[role]?.some(
            (trade) =>
              (trade.currency?.trim() || this.context.currency) !==
              this.context.currency
          )
        ) {
          return true;
        }
      }
      return false;
    }
    const metadata = dataset.conversionMetadata;
    if (
      metadata !== undefined &&
      (metadata.unconvertedCurrencies.length > 0 ||
        (metadata.partiallyConvertedCurrencies?.length ?? 0) > 0 ||
        metadata.convertedTradeCount < metadata.originalTradeCount)
    ) {
      return true;
    }
    const sources = [
      dataset.metricTrades,
      dataset.sharpeRatioTrades ?? [],
      dataset.unrealizedPnlTrades ?? [],
      dataset.tickExcursionSupplementTrades ?? [],
    ];
    return sources.some((trades) =>
      trades.some(
        (trade) =>
          (trade.currency?.trim() || this.context.currency) !==
          this.context.currency
      )
    );
  }

  private projectMetrics(
    dataset: AnalyticsPreparedDataset,
    metricIds: AnalyticsMetricId[],
    minimumSampleSize: number
  ): AnalyticsMetricValue[] {
    const metrics = this.calculateDashboardMetrics(dataset);
    
    
    const projectedMetrics =
      metricIds.includes('net_r') &&
      (dataset.unrealizedPnlTrades?.length ?? 0) > 0
        ? {
            ...metrics,
            netPnLR: this.calculator(dataset.metricTrades, {
              ...this.buildCalculatorOptions(dataset),
              unrealizedPnlTrades: undefined,
            }).netPnLR,
          }
        : metrics;
    const containsForeign = this.containsUnconvertedForeignCurrencies(dataset);
    return metricIds.map((metricId) => {
      const projected = projectRegisteredMetric(
        projectedMetrics,
        metricId,
        minimumSampleSize
      );
      return containsForeign && SINGLE_CURRENCY_METRICS.has(metricId)
        ? {
            status: 'unavailable',
            metricId,
            value: null,
            unit: projected.unit,
            sampleSize: projected.sampleSize,
            reason: 'currency_conversion_required',
          }
        : projected;
    });
  }

  private calculationMetadata(
    source: AnalyticsPreparedDataset,
    evaluated: AnalyticsPreparedDataset,
    minimumSampleSize: number
  ): AnalyticsEvaluationResult['calculation'] {
    const input: AnalyticsCalculationMetadata['input'] = {
      kind: 'analytics_ready',
      preparedCurrency: source.preparedFor.currency,
      preparedAnalyticsDateBasis: source.preparedFor.analyticsDateBasis,
      containsUnconvertedForeignCurrencies:
        this.containsUnconvertedForeignCurrencies(evaluated),
    };
    const common = {
      analyticsDateBasis: this.context.analyticsDateBasis,
      tradingDayCutoffTime: this.context.tradingDayCutoffTime,
      ...(this.context.timezone ? { timezone: this.context.timezone } : {}),
      currency: this.context.currency,
      minimumSampleSize,
      input,
    };
    return this.context.breakEvenThresholdMode === 'fixed'
      ? {
          ...common,
          breakEvenThresholdMode: 'fixed',
          breakEvenRange: normalizeBreakEvenRange(this.context),
        }
      : {
          ...common,
          breakEvenThresholdMode: 'percentage_current_balance',
          breakEvenThresholdPercent: normalizeBreakEvenThresholdPercent(
            this.context.breakEvenThresholdPercent
          ),
        };
  }

  private validateSeriesRequest(request: AnalyticsSeriesRequest): void {
    const validDateTimestamp = (value: unknown): number | undefined => {
      if (
        !(value instanceof Date) ||
        Object.prototype.toString.call(value) !== '[object Date]'
      ) {
        return undefined;
      }
      const timestamp = value.getTime();
      return Number.isFinite(timestamp) ? timestamp : undefined;
    };
    const invalidRange = (range: AnalyticsDateRange): boolean => {
      const from = validDateTimestamp(range.from);
      const to = validDateTimestamp(range.to);
      return from === undefined || to === undefined || from > to;
    };
    const limit = request.groupBy?.limit;
    const minimumSampleSize = request.minimumSampleSize;
    if (
      request.metricIds.length < 1 ||
      request.metricIds.length > 25 ||
      new Set(request.metricIds).size !== request.metricIds.length ||
      (minimumSampleSize !== undefined &&
        (!Number.isInteger(minimumSampleSize) ||
          minimumSampleSize < 0 ||
          minimumSampleSize > 10_000)) ||
      (request.dateRange && invalidRange(request.dateRange)) ||
      (limit !== undefined &&
        (!Number.isInteger(limit) || limit < 1 || limit > 100)) ||
      (request.sort?.by === 'group' && !request.groupBy) ||
      (request.sort?.metricId !== undefined &&
        !request.metricIds.includes(request.sort.metricId)) ||
      ((request.comparison?.mode === 'previous_period' ||
        request.comparison?.mode === 'previous_year') &&
        !request.dateRange) ||
      (request.comparison?.mode === 'custom' &&
        invalidRange(request.comparison.dateRange)) ||
      (request.groupBy?.dimension === 'account' &&
        !this.groupingResolvers.account) ||
      (request.groupBy?.dimension === 'setup' && !this.groupingResolvers.setup)
    ) {
      throw new AnalyticsEvaluationError('invalid_request');
    }
  }

  private createEvaluationCache(
    groupDimension?: AnalyticsGroupDimension
  ): AnalyticsEvaluationCache {
    return {
      groupDimension,
      tradingDays: createRoleCaches<Date | null>(),
      groups: createRoleCaches<CachedAnalyticsGroups>(),
    };
  }

  private getCachedTradingDay(
    trade: Trade,
    role: AnalyticsDatasetRole,
    cache: AnalyticsEvaluationCache
  ): Date | null {
    const roleCache = cache.tradingDays[role];
    if (roleCache.has(trade)) return roleCache.get(trade) ?? null;
    const tradingDay = this.resolveTradingDay(trade, role);
    roleCache.set(trade, tradingDay);
    return tradingDay;
  }

  private isDateEligible(
    date: Date | null,
    range: AnalyticsDateRange | undefined,
    interval: AnalyticsSeriesRequest['interval']
  ): boolean {
    if (interval && !date) return false;
    if (!range) return true;
    if (!date) return false;
    const timestamp = date.getTime();
    return timestamp >= range.from.getTime() && timestamp <= range.to.getTime();
  }

  private getCachedGroups(
    trade: Trade,
    role: AnalyticsDatasetRole,
    cache: AnalyticsEvaluationCache
  ): CachedAnalyticsGroups {
    const roleCache = cache.groups[role];
    const cached = roleCache.get(trade);
    if (cached) return cached;
    const keys = cache.groupDimension
      ? getAnalyticsGroupKeys(
          trade,
          cache.groupDimension,
          this.getCachedTradingDay(trade, role, cache),
          this.groupingResolvers
        )
      : [];
    const groups = {
      keys,
      identities: new Set(keys.map(analyticsGroupIdentity)),
    };
    roleCache.set(trade, groups);
    return groups;
  }

  private groupMatches(
    trade: Trade,
    role: AnalyticsDatasetRole,
    group: AnalyticsGroupKey | undefined,
    cache: AnalyticsEvaluationCache
  ): boolean {
    if (!group) return true;
    return this.getCachedGroups(trade, role, cache).identities.has(
      analyticsGroupIdentity(group)
    );
  }

  private partitionDataset(
    dataset: AnalyticsPreparedDataset,
    descriptor: AnalyticsPartitionDescriptor,
    dateRange: AnalyticsDateRange | undefined,
    interval: AnalyticsSeriesRequest['interval'],
    cache: AnalyticsEvaluationCache
  ): AnalyticsPreparedDataset {
    const result: AnalyticsPreparedDataset = {
      metricTrades: [],
      preparedFor: dataset.preparedFor,
      ...(dataset.conversionIssueTrades === undefined &&
      dataset.conversionMetadata !== undefined
        ? { conversionMetadata: dataset.conversionMetadata }
        : {}),
    };
    const matchesPartition = (
      trade: Trade,
      role: AnalyticsDatasetRole
    ): boolean => {
      const tradingDay = this.getCachedTradingDay(trade, role, cache);
      if (!this.isDateEligible(tradingDay, dateRange, interval)) return false;
      if (
        descriptor.intervalStart &&
        interval &&
        (!tradingDay ||
          getAnalyticsIntervalStart(
            tradingDay,
            interval,
            this.context.weekStartDay
          ).getTime() !== descriptor.intervalStart.getTime())
      ) {
        return false;
      }
      return this.groupMatches(trade, role, descriptor.groupKey, cache);
    };
    for (const role of DATASET_ROLES) {
      const source = dataset[role];
      if (source) {
        result[role] = source.filter((trade) => matchesPartition(trade, role));
      }
      const issueTrades = dataset.conversionIssueTrades?.[role];
      if (issueTrades) {
        result.conversionIssueTrades ??= {};
        result.conversionIssueTrades[role] = issueTrades.filter((trade) =>
          matchesPartition(trade, role)
        );
      }
    }
    return result;
  }

  private collectEligibleGroups(
    dataset: AnalyticsPreparedDataset,
    request: AnalyticsSeriesRequest,
    cache: AnalyticsEvaluationCache
  ): Map<string, AnalyticsGroupKey> {
    const groups = new Map<string, AnalyticsGroupKey>();
    if (!request.groupBy) return groups;
    for (const trade of dataset.metricTrades) {
      const tradingDay = this.getCachedTradingDay(trade, 'metricTrades', cache);
      if (
        !this.isDateEligible(tradingDay, request.dateRange, request.interval)
      ) {
        continue;
      }
      for (const group of this.getCachedGroups(trade, 'metricTrades', cache)
        .keys) {
        const identity = analyticsGroupIdentity(group);
        const existing = groups.get(identity);
        if (
          !existing ||
          compareAnalyticsStrings(
            analyticsGroupDisplayValue(group),
            analyticsGroupDisplayValue(existing)
          ) < 0
        ) {
          groups.set(identity, group);
        }
      }
    }
    return groups;
  }

  private collectDescriptors(
    dataset: AnalyticsPreparedDataset,
    request: AnalyticsSeriesRequest,
    selectedGroups: Map<string, AnalyticsGroupKey> | undefined,
    cache: AnalyticsEvaluationCache
  ): AnalyticsPartitionDescriptor[] {
    if (!request.groupBy && !request.interval) return [{}];
    const descriptors = new Map<string, AnalyticsPartitionDescriptor>();
    for (const trade of dataset.metricTrades) {
      const tradingDay = this.getCachedTradingDay(trade, 'metricTrades', cache);
      if (
        !this.isDateEligible(tradingDay, request.dateRange, request.interval)
      ) {
        continue;
      }
      const intervalStart = request.interval
        ? tradingDay
          ? getAnalyticsIntervalStart(
              tradingDay,
              request.interval,
              this.context.weekStartDay
            )
          : undefined
        : undefined;
      if (request.interval && !intervalStart) continue;
      const groups: Array<AnalyticsGroupKey | undefined> = request.groupBy
        ? this.getCachedGroups(trade, 'metricTrades', cache)
            .keys.map((group) =>
              selectedGroups?.get(analyticsGroupIdentity(group))
            )
            .filter((group) => group !== undefined)
        : [undefined];
      for (const groupKey of groups) {
        const groupIdentity = groupKey ? analyticsGroupIdentity(groupKey) : '';
        const identity = `${intervalStart?.getTime() ?? ''}|${groupIdentity}`;
        if (descriptors.has(identity)) continue;
        if (descriptors.size === 500) {
          throw new AnalyticsEvaluationError('limit_exceeded');
        }
        descriptors.set(identity, { groupKey, intervalStart });
      }
    }
    return [...descriptors.values()];
  }

  private metricForSort(
    row: AnalyticsSeriesRow,
    request: AnalyticsSeriesRequest
  ): AnalyticsMetricValue {
    const metricId = request.sort?.metricId ?? request.metricIds[0];
    const metric = row.metrics.find(
      (candidate) => candidate.metricId === metricId
    );
    if (!metric) throw new AnalyticsEvaluationError('invalid_request');
    return metric;
  }

  private compareRows(
    left: AnalyticsSeriesRow,
    right: AnalyticsSeriesRow,
    request: AnalyticsSeriesRequest
  ): number {
    const canonical = (): number => {
      const intervalComparison =
        (left.intervalStart?.getTime() ?? 0) -
        (right.intervalStart?.getTime() ?? 0);
      if (intervalComparison !== 0) return intervalComparison;
      const leftGroup = left.groupKey
        ? analyticsGroupIdentity(left.groupKey)
        : '';
      const rightGroup = right.groupKey
        ? analyticsGroupIdentity(right.groupKey)
        : '';
      return compareAnalyticsStrings(leftGroup, rightGroup);
    };
    if (!request.sort) return canonical();
    let comparison = 0;
    if (request.sort.by === 'group') {
      comparison = compareAnalyticsStrings(
        analyticsGroupDisplayValue(left.groupKey!),
        analyticsGroupDisplayValue(right.groupKey!)
      );
    } else {
      const leftMetric = this.metricForSort(left, request);
      const rightMetric = this.metricForSort(right, request);
      const leftAvailable = leftMetric.status === 'available';
      const rightAvailable = rightMetric.status === 'available';
      if (leftAvailable !== rightAvailable) return leftAvailable ? -1 : 1;
      if (leftAvailable && rightAvailable) {
        const leftValue =
          request.sort.by === 'value'
            ? leftMetric.value
            : leftMetric.sampleSize;
        const rightValue =
          request.sort.by === 'value'
            ? rightMetric.value
            : rightMetric.sampleSize;
        comparison = leftValue - rightValue;
      }
    }
    if (comparison !== 0) {
      return request.sort.direction === 'asc' ? comparison : -comparison;
    }
    return canonical();
  }

  private comparisonRange(
    request: AnalyticsSeriesRequest,
    descriptor: AnalyticsPartitionDescriptor
  ): AnalyticsDateRange {
    const comparison = request.comparison!;
    if (comparison.mode === 'custom') return comparison.dateRange;
    if (request.interval && descriptor.intervalStart) {
      if (comparison.mode === 'previous_year') {
        return getPreviousYearRange(
          getAnalyticsIntervalRange(descriptor.intervalStart, request.interval)
        );
      }
      return getAnalyticsIntervalRange(
        shiftAnalyticsInterval(descriptor.intervalStart, request.interval, -1),
        request.interval
      );
    }
    return comparison.mode === 'previous_period'
      ? getPreviousPeriodRange(request.dateRange!)
      : getPreviousYearRange(request.dateRange!);
  }

  calculateDashboardMetrics(
    dataset: AnalyticsPreparedDataset
  ): DashboardData['metrics'] {
    this.assertPreparedForContext(dataset);
    return this.calculator(
      dataset.metricTrades,
      this.buildCalculatorOptions(dataset)
    );
  }

  evaluate(
    request: AnalyticsEvaluationRequest,
    dataset: AnalyticsPreparedDataset
  ): AnalyticsEvaluationResult {
    this.assertPreparedForContext(dataset);
    const minimumSampleSize = Math.max(0, request.minimumSampleSize ?? 0);
    const filteredDataset = this.filterDataset(dataset, request);

    return {
      metrics: this.projectMetrics(
        filteredDataset,
        request.metricIds,
        minimumSampleSize
      ),
      sourceTradeCount: filteredDataset.metricTrades.length,
      calculation: this.calculationMetadata(
        dataset,
        filteredDataset,
        minimumSampleSize
      ),
    };
  }

  evaluateSeries(
    request: AnalyticsSeriesRequest,
    dataset: AnalyticsPreparedDataset
  ): AnalyticsSeriesResult {
    this.assertPreparedForContext(dataset);
    this.validateSeriesRequest(request);
    const minimumSampleSize = Math.max(0, request.minimumSampleSize ?? 0);
    const unifiedFiltered = this.filterDataset(dataset, request);
    const cache = this.createEvaluationCache(request.groupBy?.dimension);
    let selectedGroups: Map<string, AnalyticsGroupKey> | undefined;
    let selectedAggregateRows: Map<string, AnalyticsSeriesRow> | undefined;

    if (request.groupBy) {
      const groups = this.collectEligibleGroups(
        unifiedFiltered,
        request,
        cache
      );
      selectedGroups = groups;
      if (request.groupBy.limit !== undefined) {
        const aggregateRows = [...groups.values()].map((groupKey) => {
          const aggregateDataset = this.partitionDataset(
            unifiedFiltered,
            { groupKey },
            request.dateRange,
            request.interval,
            cache
          );
          return {
            groupKey,
            metrics: this.projectMetrics(
              aggregateDataset,
              request.metricIds,
              minimumSampleSize
            ),
          } satisfies AnalyticsSeriesRow;
        });
        aggregateRows.sort((left, right) =>
          this.compareRows(left, right, request)
        );
        const selectedRows = aggregateRows.slice(0, request.groupBy.limit);
        selectedGroups = new Map(
          selectedRows.map((row) => [
            analyticsGroupIdentity(row.groupKey),
            row.groupKey,
          ])
        );
        if (!request.interval) {
          selectedAggregateRows = new Map(
            selectedRows.map((row) => [
              analyticsGroupIdentity(row.groupKey),
              row,
            ])
          );
        }
      }
    }
    const descriptors = this.collectDescriptors(
      unifiedFiltered,
      request,
      selectedGroups,
      cache
    );

    const series = descriptors.map((descriptor): AnalyticsSeriesRow => {
      const cachedCurrent = descriptor.groupKey
        ? selectedAggregateRows?.get(
            analyticsGroupIdentity(descriptor.groupKey)
          )
        : undefined;
      const metrics =
        cachedCurrent?.metrics ??
        this.projectMetrics(
          this.partitionDataset(
            unifiedFiltered,
            descriptor,
            request.dateRange,
            request.interval,
            cache
          ),
          request.metricIds,
          minimumSampleSize
        );
      const row: AnalyticsSeriesRow = {
        ...(descriptor.groupKey ? { groupKey: descriptor.groupKey } : {}),
        ...(descriptor.intervalStart
          ? { intervalStart: descriptor.intervalStart }
          : {}),
        metrics,
      };
      if (request.comparison) {
        const baselineDataset = this.partitionDataset(
          unifiedFiltered,
          { groupKey: descriptor.groupKey },
          this.comparisonRange(request, descriptor),
          undefined,
          cache
        );
        const baseline = this.projectMetrics(
          baselineDataset,
          request.metricIds,
          minimumSampleSize
        );
        row.comparison = buildAnalyticsComparison(metrics, baseline);
      }
      return row;
    });
    series.sort((left, right) => this.compareRows(left, right, request));
    const currentDataset = this.partitionDataset(
      unifiedFiltered,
      {},
      request.dateRange,
      request.interval,
      cache
    );
    return {
      series,
      calculation: this.calculationMetadata(
        dataset,
        currentDataset,
        minimumSampleSize
      ),
    };
  }
}
