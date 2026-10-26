import type { UnifiedFilters } from '../../components/shared/filters/types';

export const ANALYTICS_METRIC_IDS = [
  'net_pnl',
  'win_rate',
  'profit_factor',
  'expectancy',
  'trade_count',
  'win_count',
  'loss_count',
  'average_win',
  'average_loss',
  'payoff_ratio',
  'sharpe_ratio',
  'net_r',
  'expectancy_r',
  'average_win_r',
  'average_loss_r',
  'max_drawdown',
  'best_day',
  'largest_win',
  'largest_loss',
] as const;

export type AnalyticsMetricId = (typeof ANALYTICS_METRIC_IDS)[number];

export type AnalyticsMetricUnit =
  | 'currency'
  | 'fraction'
  | 'ratio'
  | 'count'
  | 'r_multiple';

type AnalyticsUnavailableReason =
  | 'insufficient_sample'
  | 'not_calculable'
  | 'currency_conversion_required';

export interface AnalyticsEvaluationRequest {
  metricIds: AnalyticsMetricId[];
  filters?: UnifiedFilters | null;
  minimumSampleSize?: number;
}

export interface AnalyticsDateRange {
  from: Date;
  to: Date;
}

export type AnalyticsGroupDimension =
  | 'account'
  | 'setup'
  | 'ticker'
  | 'direction'
  | 'weekday'
  | 'month'
  | 'tag'
  | 'mistake';

interface AnalyticsGrouping {
  dimension: AnalyticsGroupDimension;
  limit?: number;
}

export type AnalyticsInterval = 'day' | 'week' | 'month' | 'quarter' | 'year';

type AnalyticsComparison =
  | { mode: 'previous_period' | 'previous_year' }
  | { mode: 'custom'; dateRange: AnalyticsDateRange };

interface AnalyticsSort {
  by: 'group' | 'value' | 'sample_count';
  direction: 'asc' | 'desc';
  metricId?: AnalyticsMetricId;
}

export interface AnalyticsSeriesRequest extends AnalyticsEvaluationRequest {
  dateRange?: AnalyticsDateRange;
  groupBy?: AnalyticsGrouping;
  comparison?: AnalyticsComparison;
  interval?: AnalyticsInterval;
  sort?: AnalyticsSort;
}

export interface AnalyticsEntityGroupKey {
  kind: 'account' | 'setup';
  id: string;
  label: string;
}

interface AnalyticsStringGroupKey {
  kind: 'ticker' | 'tag' | 'mistake';
  value: string;
}

interface AnalyticsDirectionGroupKey {
  kind: 'direction';
  value: 'long' | 'short';
}

interface AnalyticsWeekdayGroupKey {
  kind: 'weekday';
  value:
    | 'monday'
    | 'tuesday'
    | 'wednesday'
    | 'thursday'
    | 'friday'
    | 'saturday'
    | 'sunday';
}

interface AnalyticsMonthGroupKey {
  kind: 'month';
  value: string;
}

export type AnalyticsGroupKey =
  | AnalyticsEntityGroupKey
  | AnalyticsStringGroupKey
  | AnalyticsDirectionGroupKey
  | AnalyticsWeekdayGroupKey
  | AnalyticsMonthGroupKey;

interface AvailableMetricValue {
  status: 'available';
  metricId: AnalyticsMetricId;
  value: number;
  unit: AnalyticsMetricUnit;
  sampleSize: number;
}

interface UnavailableMetricValue {
  status: 'unavailable';
  metricId: AnalyticsMetricId;
  value: null;
  unit: AnalyticsMetricUnit;
  sampleSize: number;
  reason: AnalyticsUnavailableReason;
}

export type AnalyticsMetricValue =
  | AvailableMetricValue
  | UnavailableMetricValue;

interface AnalyticsCalculationMetadataBase {
  analyticsDateBasis: 'entry' | 'exit';
  tradingDayCutoffTime?: string;
  timezone?: string;
  currency: string;
  minimumSampleSize: number;
  input: {
    kind: 'analytics_ready';
    preparedCurrency: string;
    preparedAnalyticsDateBasis: 'entry' | 'exit';
    containsUnconvertedForeignCurrencies: boolean;
  };
}

export type AnalyticsCalculationMetadata =
  | (AnalyticsCalculationMetadataBase & {
      breakEvenThresholdMode: 'fixed';
      breakEvenRange: { min: number; max: number };
    })
  | (AnalyticsCalculationMetadataBase & {
      breakEvenThresholdMode: 'percentage_current_balance';
      breakEvenThresholdPercent: number;
    });

export interface AnalyticsEvaluationResult {
  metrics: AnalyticsMetricValue[];
  sourceTradeCount: number;
  calculation: AnalyticsCalculationMetadata;
}

export interface AnalyticsComparisonMetric {
  metricId: AnalyticsMetricId;
  current: AnalyticsMetricValue;
  baseline: AnalyticsMetricValue;
  absoluteDelta: number | null;
  percentDelta: number | null;
}

export interface AnalyticsSeriesRow {
  intervalStart?: Date;
  groupKey?: AnalyticsGroupKey;
  metrics: AnalyticsMetricValue[];
  comparison?: AnalyticsComparisonMetric[];
}

export interface AnalyticsSeriesResult {
  series: AnalyticsSeriesRow[];
  calculation: AnalyticsCalculationMetadata;
}

type AnalyticsEvaluationErrorCode = 'invalid_request' | 'limit_exceeded';

const ANALYTICS_ERROR_MESSAGES: Record<AnalyticsEvaluationErrorCode, string> = {
  invalid_request: 'The analytics request is invalid.',
  limit_exceeded: 'The analytics result exceeds the series limit.',
};

export class AnalyticsEvaluationError extends Error {
  readonly code: AnalyticsEvaluationErrorCode;

  constructor(code: AnalyticsEvaluationErrorCode) {
    super(ANALYTICS_ERROR_MESSAGES[code]);
    this.name = 'AnalyticsEvaluationError';
    this.code = code;
  }
}
