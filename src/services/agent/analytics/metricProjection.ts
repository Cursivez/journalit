import type { AnalyticsMetricValue } from '../../analytics/types';

type AgentProjectedMetricValue =
  | {
      metric_id: AnalyticsMetricValue['metricId'];
      sample_count: number;
      status: 'available';
      value: number;
      unit: AnalyticsMetricValue['unit'];
    }
  | {
      metric_id: AnalyticsMetricValue['metricId'];
      sample_count: number;
      status: 'unavailable';
      value: null;
      unit: AnalyticsMetricValue['unit'];
      unavailable_reason: Extract<
        AnalyticsMetricValue,
        { status: 'unavailable' }
      >['reason'];
    };

export class AnalyticsProjectionError extends Error {
  constructor(readonly kind: 'limit' | 'internal') {
    super('Analytics projection failed');
  }
}

function boundedInteger(value: number, maximum: number): number {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 0) {
    throw new AnalyticsProjectionError('internal');
  }
  if (value > maximum) throw new AnalyticsProjectionError('limit');
  return value;
}

function boundedNumber(
  value: number,
  minimum: number,
  maximum: number
): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new AnalyticsProjectionError('internal');
  }
  if (value < minimum || value > maximum) {
    throw new AnalyticsProjectionError('limit');
  }
  return value;
}

export function projectAnalyticsMetric(
  value: AnalyticsMetricValue
): AgentProjectedMetricValue {
  const sample_count = boundedInteger(value.sampleSize, 1_000_000);
  if (value.status === 'available') {
    if (value.value === null) throw new AnalyticsProjectionError('internal');
    return {
      metric_id: value.metricId,
      sample_count,
      status: 'available',
      value: boundedNumber(value.value, -1_000_000_000_000, 1_000_000_000_000),
      unit: value.unit,
    };
  }
  if (value.value !== null || value.reason === undefined) {
    throw new AnalyticsProjectionError('internal');
  }
  return {
    metric_id: value.metricId,
    sample_count,
    status: 'unavailable',
    value: null,
    unit: value.unit,
    unavailable_reason: value.reason,
  };
}
