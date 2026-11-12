

import { t } from '../../../lang/helpers';
import { describeTradeChoiceFilters } from '../../shared/filters/tradeChoiceLabels';
import {
  DEFAULT_REGULAR_ONLY_TRADE_TYPES,
  getActiveTradeTypeSelection,
} from '../../../settings/viewFiltersDefaults';
import {
  type DashboardComparisonFilters,
  SAVED_COMPARISON_NAME_MAX_LENGTH,
} from './dashboardComparison';

const NO_VALUE_LABEL_KEYS = {
  __NO_SETUP__: 'filter.modal.no-setup',
  __NO_TAGS__: 'filter.modal.no-tags',
  __NO_MISTAKES__: 'filter.modal.no-mistakes',
} as const;

const NO_VALUE_SENTINELS: ReadonlySet<string> = new Set(
  Object.keys(NO_VALUE_LABEL_KEYS)
);

const isNoValueSentinel = (
  value: string
): value is keyof typeof NO_VALUE_LABEL_KEYS => NO_VALUE_SENTINELS.has(value);

const valueLabel = (value: string): string =>
  isNoValueSentinel(value) ? t(NO_VALUE_LABEL_KEYS[value]) : value;


const describeParts = (filters: DashboardComparisonFilters): string[] => {
  const included = [
    ...filters.accounts,
    ...filters.tickers,
    ...filters.setups,
    ...filters.tags,
    ...filters.mistakes,
    ...Object.values(filters.customFieldFilters).flat(),
    ...(filters.imageTags ?? []),
  ].map(valueLabel);
  const excluded = [
    ...filters.exclusions.tickers,
    ...filters.exclusions.setups,
    ...filters.exclusions.tags,
    ...filters.exclusions.mistakes,
    ...Object.values(filters.exclusions.customFieldFilters).flat(),
  ].map((value) =>
    t('dashboard.compare.not-value', { value: valueLabel(value) })
  );
  return [
    ...included,
    ...describeTradeChoiceFilters({
      ...filters,
      tradeTypes: getActiveTradeTypeSelection(
        filters.tradeTypes,
        DEFAULT_REGULAR_ONLY_TRADE_TYPES
      ),
    }),
    ...excluded,
  ];
};


export const selectsAllTrades = (
  filters: DashboardComparisonFilters
): boolean =>
  describeParts(filters).length === 0 && filters.accountPhases.length === 0;


export const describeComparisonFilters = (
  filters: DashboardComparisonFilters
): string => {
  const parts = describeParts(filters);
  if (parts.length > 0) return parts.join(' + ');
  return filters.accountPhases.length > 0
    ? t('dashboard.compare.filtered')
    : t('dashboard.compare.all-trades');
};

export const suggestComparisonName = (
  a: DashboardComparisonFilters,
  b: DashboardComparisonFilters
): string =>
  t('dashboard.compare.name-suggestion', {
    a: describeComparisonFilters(a),
    b: describeComparisonFilters(b),
  }).slice(0, SAVED_COMPARISON_NAME_MAX_LENGTH);
