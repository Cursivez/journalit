import type { AnalyticsMetricId, AnalyticsMetricUnit } from './types';

export interface AnalyticsMetricDefinition {
  id: AnalyticsMetricId;
  unit: AnalyticsMetricUnit;
  sampleSize:
    | 'all_contributing'
    | 'wins'
    | 'losses'
    | 'risk_valid'
    | 'sharpe_observations';
  
  zeroSample: 'not_calculable' | 'zero';
}

const definition = (
  id: AnalyticsMetricId,
  unit: AnalyticsMetricUnit,
  zeroSample: AnalyticsMetricDefinition['zeroSample'],
  sampleSize: AnalyticsMetricDefinition['sampleSize'] = 'all_contributing'
): AnalyticsMetricDefinition => ({
  id,
  unit,
  sampleSize,
  zeroSample,
});

const ANALYTICS_METRIC_REGISTRY: ReadonlyMap<
  AnalyticsMetricId,
  AnalyticsMetricDefinition
> = new Map(
  [
    definition('net_pnl', 'currency', 'zero'),
    definition('win_rate', 'fraction', 'not_calculable'),
    definition('profit_factor', 'ratio', 'not_calculable'),
    definition('expectancy', 'currency', 'not_calculable'),
    definition('trade_count', 'count', 'zero'),
    definition('win_count', 'count', 'zero', 'wins'),
    definition('loss_count', 'count', 'zero', 'losses'),
    definition('average_win', 'currency', 'not_calculable', 'wins'),
    definition('average_loss', 'currency', 'not_calculable', 'losses'),
    definition('payoff_ratio', 'ratio', 'not_calculable'),
    definition(
      'sharpe_ratio',
      'ratio',
      'not_calculable',
      'sharpe_observations'
    ),
    definition('net_r', 'r_multiple', 'zero', 'risk_valid'),
    definition('expectancy_r', 'r_multiple', 'not_calculable', 'risk_valid'),
    definition('average_win_r', 'r_multiple', 'not_calculable', 'risk_valid'),
    definition('average_loss_r', 'r_multiple', 'not_calculable', 'risk_valid'),
    definition('max_drawdown', 'currency', 'zero'),
    definition('best_day', 'currency', 'not_calculable'),
    definition('largest_win', 'currency', 'not_calculable', 'wins'),
    definition('largest_loss', 'currency', 'not_calculable', 'losses'),
  ].map((item) => [item.id, item])
);

export const getMetricDefinition = (
  metricId: AnalyticsMetricId
): AnalyticsMetricDefinition => {
  const metric = ANALYTICS_METRIC_REGISTRY.get(metricId);
  if (!metric) {
    throw new Error(`Unsupported analytics metric: ${metricId}`);
  }
  return metric;
};
