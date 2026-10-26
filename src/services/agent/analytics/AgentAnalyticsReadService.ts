import type { App } from 'obsidian';

import type JournalitPlugin from '../../../main';
import {
  AnalyticsPreparationError,
  prepareDashboardAnalytics,
  type Trade,
} from '../../../components/dashboard/utils/dataUtils';
import type { FilterState } from '../../../components/dashboard/dashboardTypes';
import { createFilterExclusions } from '../../../components/shared/filters/filterExclusions';
import { createFilterMatchModes } from '../../../components/shared/filters/filterMatchModes';
import type { TradeService } from '../../trade/TradeService';
import { normalizeTradeAccountIdentity } from '../../trade/core/TradeAccountIdentity';
import { normalizeSetupKey } from '../../setup/setupIdentity';
import type {
  AnalyticsPreparedDataset,
  AnalyticsService,
} from '../../analytics/AnalyticsService';
import {
  compareAnalyticsStrings,
  type AnalyticsEntityGroupResolver,
  type AnalyticsGroupingResolvers,
} from '../../analytics/grouping';
import {
  AnalyticsEvaluationError,
  type AnalyticsCalculationMetadata,
  type AnalyticsDateRange,
  type AnalyticsSeriesRequest,
  type AnalyticsSeriesResult,
} from '../../analytics/types';
import {
  getPreviousPeriodRange,
  getPreviousYearRange,
} from '../../analytics/comparison';
import type { EvaluateTradesRequest } from '../protocol/generated/evaluate_trades.request.generated';
import {
  type AgentTradeReadRecord,
  type AgentTradeReadService,
  isEntryTimeInRange,
} from '../trades';
import { getEffectivePnL } from '../../../utils/tradeStatusUtils';
import { classifyPnLWithBreakEvenSettings } from '../../../utils/breakEvenRange';
import { getTradingDayString } from '../../../utils/tradingDayUtils';
import type { BehaviorTrade } from './behaviorAnalysis';
import type { AgentEntityIdentityService } from '../identity';
import { isAccountAgentId } from '../identity/accountIdentityStore';
import { isSetupAgentId } from '../identity/setupIdentityStore';

type IdentityService = Pick<
  AgentEntityIdentityService,
  | 'resolveAccountId'
  | 'resolveSetupId'
  | 'getOrCreateAccountId'
  | 'getOrCreateSetupIds'
>;

type TradeReadService = Pick<AgentTradeReadService, 'read'>;

type PreparedDashboardAnalytics = Awaited<
  ReturnType<typeof prepareDashboardAnalytics>
>;

export interface BehaviorSelectionTrade extends BehaviorTrade {
  
  path: string;
  
  conversionIssue: boolean;
}

export interface BehaviorTradeSelection {
  
  trades: BehaviorSelectionTrade[];
  
  excludedOpenTradeCount: number;
  
  calculationFor(paths: Iterable<string>): AnalyticsCalculationMetadata;
}

interface AgentAnalyticsReadDependencies {
  app: App;
  plugin: JournalitPlugin;
  tradeService: TradeService;
  getTradeReadService(): Promise<TradeReadService>;
  identityService: IdentityService;
}

const DATASET_ROLES = [
  'metricTrades',
  'sharpeRatioTrades',
  'unrealizedPnlTrades',
  'tickExcursionSupplementTrades',
] as const satisfies readonly (keyof AnalyticsPreparedDataset)[];

function throwIfAborted(signal: AbortSignal): void {
  if (signal.aborted) throw signal.reason;
}

async function awaitBoundary<T>(
  operation: Promise<T>,
  signal: AbortSignal
): Promise<T> {
  try {
    return await operation;
  } finally {
    throwIfAborted(signal);
  }
}

function capCodePoints(value: string, maximum: number): string {
  return Array.from(value).slice(0, maximum).join('');
}

function validDate(value: string): Date {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) {
    throw new AnalyticsEvaluationError('invalid_request');
  }
  return date;
}

const MINIMUM_DATE = new Date(-8_640_000_000_000_000);
const MAXIMUM_DATE = new Date(8_640_000_000_000_000);

function mapOpenEndedDateRange(value: {
  from?: string;
  to?: string;
}): AnalyticsDateRange {
  const dateRange = {
    from: value.from === undefined ? MINIMUM_DATE : validDate(value.from),
    to: value.to === undefined ? MAXIMUM_DATE : validDate(value.to),
  };
  if (dateRange.from.getTime() > dateRange.to.getTime()) {
    throw new AnalyticsEvaluationError('invalid_request');
  }
  return dateRange;
}

function mapBoundedDateRange(value: {
  from: string;
  to: string;
}): AnalyticsDateRange {
  const dateRange = {
    from: validDate(value.from),
    to: validDate(value.to),
  };
  if (dateRange.from.getTime() > dateRange.to.getTime()) {
    throw new AnalyticsEvaluationError('invalid_request');
  }
  return dateRange;
}

function mapDateRange(
  value: NonNullable<EvaluateTradesRequest['filters']>['date']
): AnalyticsDateRange | undefined {
  if (
    value === undefined ||
    (value.from === undefined && value.to === undefined)
  ) {
    return undefined;
  }
  return mapOpenEndedDateRange(value);
}

function assertComparisonHasBoundedCurrentRange(
  request: EvaluateTradesRequest
): void {
  if (
    request.comparison !== undefined &&
    request.comparison.mode !== 'custom' &&
    (request.filters?.date?.from === undefined ||
      request.filters.date.to === undefined)
  ) {
    throw new AnalyticsEvaluationError('invalid_request');
  }
}

function mapSeriesRequest(
  request: EvaluateTradesRequest
): AnalyticsSeriesRequest {
  assertComparisonHasBoundedCurrentRange(request);
  const dateRange = mapDateRange(request.filters?.date);
  const comparison = request.comparison
    ? request.comparison.mode === 'custom'
      ? {
          mode: 'custom' as const,
          dateRange: mapBoundedDateRange(request.comparison),
        }
      : { mode: request.comparison.mode }
    : undefined;

  return {
    metricIds: [...request.metrics],
    ...(dateRange ? { dateRange } : {}),
    ...(request.group_by
      ? {
          groupBy: {
            dimension: request.group_by.dimension,
            ...(request.group_by.limit === undefined
              ? {}
              : { limit: request.group_by.limit }),
          },
        }
      : {}),
    ...(comparison ? { comparison } : {}),
    ...(request.interval ? { interval: request.interval } : {}),
    ...(request.minimum_sample_size === undefined
      ? {}
      : { minimumSampleSize: request.minimum_sample_size }),
    ...(request.sort
      ? {
          sort: {
            by: request.sort.by,
            direction: request.sort.direction,
            ...(request.sort.metric_id
              ? { metricId: request.sort.metric_id }
              : {}),
          },
        }
      : {}),
  };
}

function selectionDateRanges(
  request: EvaluateTradesRequest,
  seriesRequest: AnalyticsSeriesRequest
): AnalyticsDateRange[] {
  const current = seriesRequest.dateRange;
  if (current === undefined) return [];
  const ranges = [current];
  if (request.comparison === undefined) return ranges;
  if (request.comparison.mode === 'custom') {
    ranges.push(mapBoundedDateRange(request.comparison));
  } else if (request.comparison.mode === 'previous_period') {
    ranges.push(getPreviousPeriodRange(current));
  } else {
    ranges.push(getPreviousYearRange(current));
  }
  return ranges;
}

function selectionReadRequest(filters: EvaluateTradesRequest['filters']): {
  filters?: Omit<NonNullable<EvaluateTradesRequest['filters']>, 'date'>;
} {
  if (filters === undefined) {
    return {};
  }
  const nonDateFilters = { ...filters };
  delete nonDateFilters.date;
  return Object.keys(nonDateFilters).length === 0
    ? {}
    : { filters: nonDateFilters };
}

function emptyFilters(accounts: string[], setups: string[]): FilterState {
  return {
    dateRange: [null, null],
    accounts,
    accountPhases: [],
    tickers: [],
    setups,
    tags: [],
    mistakes: [],
    tradeTypes: [],
    statuses: [],
    reviewStatus: [],
    ratings: [],
    directions: [],
    customFieldFilters: {},
    exclusions: createFilterExclusions(),
    matchModes: createFilterMatchModes(),
    imageAnnotationStatus: [],
    imageTags: [],
  };
}

function filterDataset(
  dataset: AnalyticsPreparedDataset,
  predicate: (trade: Trade) => boolean
): AnalyticsPreparedDataset {
  const result: AnalyticsPreparedDataset = {
    ...dataset,
    metricTrades: [],
    ...(dataset.conversionIssueTrades ? { conversionIssueTrades: {} } : {}),
  };
  for (const role of DATASET_ROLES) {
    const trades = dataset[role];
    if (trades !== undefined) result[role] = trades.filter(predicate);
    const issueTrades = dataset.conversionIssueTrades?.[role];
    if (issueTrades !== undefined) {
      result.conversionIssueTrades ??= {};
      result.conversionIssueTrades[role] = issueTrades.filter(predicate);
    }
  }
  return result;
}

function datasetTrades(dataset: AnalyticsPreparedDataset): Trade[] {
  const trades: Trade[] = [];
  for (const role of DATASET_ROLES) {
    const roleTrades = dataset[role];
    if (roleTrades) trades.push(...roleTrades);
    const issueTrades = dataset.conversionIssueTrades?.[role];
    if (issueTrades) trades.push(...issueTrades);
  }
  return trades;
}

function isSelectedPath(
  trade: Trade,
  selectedPaths: ReadonlySet<string>
): boolean {
  if (selectedPaths.has(trade.path)) return true;
  if (
    !('_dashboardRealizedTradingDay' in trade) ||
    !(trade._dashboardRealizedTradingDay instanceof Date)
  ) {
    return false;
  }
  const realizedProjection = trade.path.match(/^(.*)#realized-\d+$/);
  return (
    realizedProjection !== null && selectedPaths.has(realizedProjection[1])
  );
}

function normalizedSetups(trade: Trade): Array<{ key: string; label: string }> {
  const byKey = new Map<string, string>();
  for (const raw of trade.setup ?? []) {
    const label = raw.trim();
    const key = normalizeSetupKey(label);
    if (!key || !label) continue;
    const existing = byKey.get(key);
    if (
      existing === undefined ||
      compareAnalyticsStrings(label, existing) < 0
    ) {
      byKey.set(key, label);
    }
  }
  return [...byKey]
    .sort(([left], [right]) => compareAnalyticsStrings(left, right))
    .map(([key, label]) => ({ key, label }));
}

export class UnsupportedAnalyticsSelectionError extends Error {
  constructor() {
    super(
      'Analytics requires a selection of supported regular or backtest trades.'
    );
    this.name = 'UnsupportedAnalyticsSelectionError';
  }
}

export class AgentAnalyticsReadService {
  constructor(private readonly dependencies: AgentAnalyticsReadDependencies) {}

  public async evaluate(
    request: EvaluateTradesRequest,
    signal: AbortSignal
  ): Promise<AnalyticsSeriesResult> {
    throwIfAborted(signal);
    const seriesRequest = mapSeriesRequest(request);
    const { prepared } = await this.prepareSelection(
      request.filters,
      selectionReadRequest(request.filters),
      signal,
      (records) => {
        
        
        
        if (!records.some((record) => record.tradeType === 'missed')) return;
        const ranges = selectionDateRanges(request, seriesRequest);
        if (ranges.length === 0) {
          throw new UnsupportedAnalyticsSelectionError();
        }
        
        
        const missedInWindow = ranges.some((range) =>
          records.some(
            (record) =>
              record.tradeType === 'missed' &&
              isEntryTimeInRange(record, range.from, range.to)
          )
        );
        if (missedInWindow) {
          throw new UnsupportedAnalyticsSelectionError();
        }
      }
    );

    const groupingResolvers = await this.buildGroupingResolvers(
      request.group_by?.dimension,
      prepared.dataset,
      signal
    );
    throwIfAborted(signal);
    const analytics: AnalyticsService = prepared.createAnalyticsService({
      groupingResolvers,
    });
    return analytics.evaluateSeries(seriesRequest, prepared.dataset);
  }

  
  public async readBehaviorTrades(
    filters: EvaluateTradesRequest['filters'],
    signal: AbortSignal
  ): Promise<BehaviorTradeSelection> {
    throwIfAborted(signal);
    if (filters?.trade_types?.includes('missed')) {
      throw new UnsupportedAnalyticsSelectionError();
    }
    const { prepared, records } = await this.prepareSelection(
      filters,
      { filters },
      signal,
      (selected) => {
        if (selected.some((record) => record.tradeType === 'missed')) {
          throw new UnsupportedAnalyticsSelectionError();
        }
      }
    );
    const tradingDaySettings = { settings: this.dependencies.plugin.settings };
    const closedPaths = new Set<string>();
    let excludedOpenTradeCount = 0;
    for (const record of records) {
      if (record.executionStatus === 'closed') {
        closedPaths.add(record.file.path);
      } else if (
        record.executionStatus === 'open' ||
        record.executionStatus === 'partially_closed'
      ) {
        excludedOpenTradeCount += 1;
      }
    }

    
    
    
    
    const issueRows = new Set(
      prepared.dataset.conversionIssueTrades?.sharpeRatioTrades ?? []
    );
    const wholeTrades = [
      ...(prepared.dataset.sharpeRatioTrades ?? []),
      ...(prepared.dataset.conversionIssueTrades?.sharpeRatioTrades ?? []),
    ];
    const breakEvenSettings = prepared.context;
    const trades: BehaviorSelectionTrade[] = [];
    const seen = new Set<string>();
    for (const row of wholeTrades) {
      if (!closedPaths.has(row.path)) continue;
      const key = row.tradeId || row.path;
      if (seen.has(key)) continue;
      seen.add(key);
      const entryTime = row.entryTime;
      if (
        !(entryTime instanceof Date) ||
        !Number.isFinite(entryTime.getTime())
      ) {
        continue;
      }
      
      
      const exitTime =
        row.exitTime instanceof Date && Number.isFinite(row.exitTime.getTime())
          ? row.exitTime
          : null;
      const pnl = getEffectivePnL(row);
      const classified = classifyPnLWithBreakEvenSettings(
        pnl,
        breakEvenSettings,
        row.breakEvenAccountCurrentBalance
      );
      const size = Math.abs(row.positionSize);
      trades.push({
        key,
        path: row.path,
        entryTime,
        exitTime,
        tradingDay: getTradingDayString(entryTime, tradingDaySettings),
        entryHour: entryTime.getHours(),
        pnl,
        
        
        outcome:
          classified === 'win' || classified === 'loss'
            ? classified
            : 'breakeven',
        ...(Number.isFinite(size) && size > 0 ? { quantity: size } : {}),
        ticker: (row.instrument ?? '').trim().toUpperCase(),
        mistakes: [
          ...new Set(
            (row.mistake ?? []).flatMap((mistake) => {
              const label = mistake.trim();
              return label.length > 0 ? [label] : [];
            })
          ),
        ],
        setups: normalizedSetups(row),
        reviewed: row.reviewed === true,
        conversionIssue: issueRows.has(row),
      });
    }

    return {
      trades,
      excludedOpenTradeCount,
      calculationFor: (paths) => {
        const selected = new Set(paths);
        const dataset = filterDataset(prepared.dataset, (trade) =>
          isSelectedPath(trade, selected)
        );
        return prepared
          .createAnalyticsService()
          .evaluateSeries({ metricIds: ['trade_count'] }, dataset).calculation;
      },
    };
  }

  
  private async prepareSelection(
    filters: EvaluateTradesRequest['filters'],
    readRequest: Parameters<TradeReadService['read']>[0],
    signal: AbortSignal,
    checkRecords: (records: readonly AgentTradeReadRecord[]) => void
  ): Promise<{
    prepared: PreparedDashboardAnalytics;
    records: readonly AgentTradeReadRecord[];
  }> {
    const accountLabels = await this.resolveLabels(
      filters?.account_ids,
      (id) => this.dependencies.identityService.resolveAccountId(id),
      signal
    );
    const setupLabels = await this.resolveLabels(
      filters?.setup_ids,
      (id) => this.dependencies.identityService.resolveSetupId(id),
      signal
    );

    let prepared = await awaitBoundary(
      prepareDashboardAnalytics(
        this.dependencies.app,
        this.dependencies.tradeService,
        emptyFilters(accountLabels, setupLabels),
        this.dependencies.plugin,
        { freshTradeQuery: true, signal }
      ),
      signal
    );
    if (prepared.skippedTradeFileCount > 0) {
      throw new AnalyticsPreparationError();
    }

    const readService = await awaitBoundary(
      this.dependencies.getTradeReadService(),
      signal
    );
    let records = await awaitBoundary(
      readService.read(readRequest, signal),
      signal
    );
    checkRecords(records);
    const selectedPaths = new Set(records.map((record) => record.file.path));
    prepared = {
      ...prepared,
      dataset: filterDataset(prepared.dataset, (trade) =>
        isSelectedPath(trade, selectedPaths)
      ),
    };

    const requestedAccounts = filters?.account_ids ?? [];
    const requestedSetups = filters?.setup_ids ?? [];
    if (
      (requestedAccounts.length > 0 && accountLabels.length === 0) ||
      (requestedSetups.length > 0 && setupLabels.length === 0)
    ) {
      prepared = {
        ...prepared,
        dataset: filterDataset(prepared.dataset, () => false),
      };
      records = [];
    }
    return { prepared, records };
  }

  private async resolveLabels(
    ids: readonly string[] | undefined,
    resolve: (id: string) => Promise<string | null>,
    signal: AbortSignal
  ): Promise<string[]> {
    const labels = new Set<string>();
    for (const id of ids ?? []) {
      throwIfAborted(signal);
      const label = await awaitBoundary(resolve(id), signal);
      if (label) labels.add(label);
    }
    return [...labels].sort(compareAnalyticsStrings);
  }

  private async buildGroupingResolvers(
    dimension:
      | NonNullable<EvaluateTradesRequest['group_by']>['dimension']
      | undefined,
    dataset: AnalyticsPreparedDataset,
    signal: AbortSignal
  ): Promise<AnalyticsGroupingResolvers> {
    if (dimension === 'account') {
      return {
        account: await this.buildAccountResolver(dataset, signal),
      };
    }
    if (dimension === 'setup') {
      return { setup: await this.buildSetupResolver(dataset, signal) };
    }
    return {};
  }

  private async buildAccountResolver(
    dataset: AnalyticsPreparedDataset,
    signal: AbortSignal
  ): Promise<AnalyticsEntityGroupResolver> {
    const labelsByKey = new Map<string, string>();
    for (const trade of datasetTrades(dataset)) {
      const identity = normalizeTradeAccountIdentity({
        account: trade.account,
      });
      identity.refs.forEach((ref) => {
        const existing = labelsByKey.get(ref.lookupKey);
        if (
          existing === undefined ||
          compareAnalyticsStrings(ref.value, existing) < 0
        ) {
          labelsByKey.set(ref.lookupKey, ref.value);
        }
      });
    }
    const entitiesByKey = new Map<string, { id: string; label: string }>();
    for (const [key, label] of [...labelsByKey].sort(([left], [right]) =>
      compareAnalyticsStrings(left, right)
    )) {
      throwIfAborted(signal);
      const id = await awaitBoundary(
        this.dependencies.identityService.getOrCreateAccountId(label),
        signal
      );
      if (isAccountAgentId(id)) {
        entitiesByKey.set(key, { id, label: capCodePoints(label, 120) });
      }
    }
    return (trade) => {
      const identity = normalizeTradeAccountIdentity({
        account: trade.account,
      });
      const byId = new Map<string, { id: string; label: string }>();
      for (const key of identity.lookupKeys) {
        const entity = entitiesByKey.get(key);
        if (entity) byId.set(entity.id, entity);
      }
      return [...byId.values()].sort((left, right) =>
        compareAnalyticsStrings(left.id, right.id)
      );
    };
  }

  private async buildSetupResolver(
    dataset: AnalyticsPreparedDataset,
    signal: AbortSignal
  ): Promise<AnalyticsEntityGroupResolver> {
    const labelsByKey = new Map<string, string>();
    for (const trade of datasetTrades(dataset)) {
      for (const { key, label } of normalizedSetups(trade)) {
        const existing = labelsByKey.get(key);
        if (
          existing === undefined ||
          compareAnalyticsStrings(label, existing) < 0
        ) {
          labelsByKey.set(key, label);
        }
      }
    }
    throwIfAborted(signal);
    const idsByLabel = await awaitBoundary(
      this.dependencies.identityService.getOrCreateSetupIds(
        [...labelsByKey.values()].sort(compareAnalyticsStrings)
      ),
      signal
    );
    const entitiesByKey = new Map<string, { id: string; label: string }>();
    for (const [key, label] of labelsByKey) {
      const id = idsByLabel.get(label);
      if (isSetupAgentId(id)) {
        entitiesByKey.set(key, { id, label: capCodePoints(label, 120) });
      }
    }
    return (trade) => {
      const byId = new Map<string, { id: string; label: string }>();
      for (const { key } of normalizedSetups(trade)) {
        const entity = entitiesByKey.get(key);
        if (entity) byId.set(entity.id, entity);
      }
      return [...byId.values()].sort((left, right) =>
        compareAnalyticsStrings(left.id, right.id)
      );
    };
  }
}
