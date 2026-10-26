import type { AnalyticsCalculationMetadata } from '../../analytics/types';
import { AnalyticsProjectionError } from './metricProjection';

interface AgentAnalyticsCalculationContextBase {
  currency: string;
  analytics_date_basis: 'entry' | 'exit';
  timezone?: string;
  trading_day_cutoff_time?: string;
  minimum_sample_size: number;
  input: {
    kind: 'analytics_ready';
    prepared_currency: string;
    prepared_analytics_date_basis: 'entry' | 'exit';
    contains_unconverted_foreign_currencies: boolean;
  };
}

type AgentAnalyticsCalculationContext =
  | (AgentAnalyticsCalculationContextBase & {
      break_even_threshold_mode: 'fixed';
      break_even_range: { min: number; max: number };
    })
  | (AgentAnalyticsCalculationContextBase & {
      break_even_threshold_mode: 'percentage_current_balance';
      break_even_threshold_percent: number;
    });

function boundedInteger(value: number, maximum: number): number {
  if (!Number.isSafeInteger(value) || value < 0) {
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
  if (!Number.isFinite(value)) throw new AnalyticsProjectionError('internal');
  if (value < minimum || value > maximum) {
    throw new AnalyticsProjectionError('limit');
  }
  return value;
}

function boundedText(value: string, maximum: number): string {
  if (typeof value !== 'string' || value.length === 0) {
    throw new AnalyticsProjectionError('internal');
  }
  if (Array.from(value).length > maximum) {
    throw new AnalyticsProjectionError('limit');
  }
  return value;
}

export function projectAnalyticsCalculationContext(
  value: AnalyticsCalculationMetadata
): AgentAnalyticsCalculationContext {
  if (
    (value.analyticsDateBasis !== 'entry' &&
      value.analyticsDateBasis !== 'exit') ||
    (value.input.preparedAnalyticsDateBasis !== 'entry' &&
      value.input.preparedAnalyticsDateBasis !== 'exit') ||
    value.input.kind !== 'analytics_ready' ||
    typeof value.input.containsUnconvertedForeignCurrencies !== 'boolean' ||
    !/^[A-Z]{3}$/.test(value.currency) ||
    !/^[A-Z]{3}$/.test(value.input.preparedCurrency)
  ) {
    throw new AnalyticsProjectionError('internal');
  }
  if (
    value.tradingDayCutoffTime !== undefined &&
    (value.timezone === undefined ||
      !/^(?:[01][0-9]|2[0-3]):[0-5][0-9]$/.test(value.tradingDayCutoffTime))
  ) {
    throw new AnalyticsProjectionError('internal');
  }
  const input: AgentAnalyticsCalculationContext['input'] = {
    kind: 'analytics_ready',
    prepared_currency: value.input.preparedCurrency,
    prepared_analytics_date_basis: value.input.preparedAnalyticsDateBasis,
    contains_unconverted_foreign_currencies:
      value.input.containsUnconvertedForeignCurrencies,
  };
  const common = {
    currency: value.currency,
    analytics_date_basis: value.analyticsDateBasis,
    ...(value.timezone === undefined
      ? {}
      : { timezone: boundedText(value.timezone, 64) }),
    ...(value.tradingDayCutoffTime === undefined
      ? {}
      : { trading_day_cutoff_time: value.tradingDayCutoffTime }),
    minimum_sample_size: boundedInteger(value.minimumSampleSize, 10_000),
    input,
  };

  return value.breakEvenThresholdMode === 'fixed'
    ? {
        ...common,
        break_even_threshold_mode: 'fixed',
        break_even_range: projectFixedBreakEvenRange(value.breakEvenRange),
      }
    : {
        ...common,
        break_even_threshold_mode: 'percentage_current_balance',
        break_even_threshold_percent: boundedNumber(
          value.breakEvenThresholdPercent,
          0,
          1_000_000
        ),
      };
}

function projectFixedBreakEvenRange(value: { min: number; max: number }): {
  min: number;
  max: number;
} {
  const min = boundedNumber(value.min, -1_000_000, 1_000_000);
  const max = boundedNumber(value.max, -1_000_000, 1_000_000);
  if (min > max) throw new AnalyticsProjectionError('internal');
  return { min, max };
}
