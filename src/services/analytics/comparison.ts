import type {
  AnalyticsComparisonMetric,
  AnalyticsDateRange,
  AnalyticsMetricValue,
} from './types';

const shiftYearClamped = (date: Date, years: number): Date => {
  const result = new Date(date);
  const day = result.getDate();
  result.setDate(1);
  result.setFullYear(result.getFullYear() + years);
  const lastDay = new Date(
    result.getFullYear(),
    result.getMonth() + 1,
    0
  ).getDate();
  result.setDate(Math.min(day, lastDay));
  return result;
};

export const getPreviousPeriodRange = (
  current: AnalyticsDateRange
): AnalyticsDateRange => {
  const duration = current.to.getTime() - current.from.getTime() + 1;
  const to = new Date(current.from.getTime() - 1);
  return { from: new Date(to.getTime() - duration + 1), to };
};

export const getPreviousYearRange = (
  current: AnalyticsDateRange
): AnalyticsDateRange => ({
  from: shiftYearClamped(current.from, -1),
  to: shiftYearClamped(current.to, -1),
});

export const buildAnalyticsComparison = (
  current: AnalyticsMetricValue[],
  baseline: AnalyticsMetricValue[]
): AnalyticsComparisonMetric[] =>
  current.map((currentMetric, index) => {
    const baselineMetric = baseline[index];
    if (!baselineMetric || baselineMetric.metricId !== currentMetric.metricId) {
      throw new Error('Analytics metric projection order mismatch');
    }
    const valuesAvailable =
      currentMetric.status === 'available' &&
      baselineMetric.status === 'available';
    const absoluteDelta = valuesAvailable
      ? currentMetric.value - baselineMetric.value
      : null;
    return {
      metricId: currentMetric.metricId,
      current: currentMetric,
      baseline: baselineMetric,
      absoluteDelta,
      percentDelta:
        absoluteDelta === null ||
        baselineMetric.status !== 'available' ||
        baselineMetric.value === 0
          ? null
          : absoluteDelta / Math.abs(baselineMetric.value),
    };
  });
