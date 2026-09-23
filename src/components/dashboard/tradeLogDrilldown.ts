import { createTradeLogFilters } from '../../settings/viewFiltersDefaults';
import type { TradeLogFilters } from '../../services/tradelog/types';
import type { FilterState } from './dashboardTypes';

type TradeLogDrilldownOverrides = Partial<
  Pick<
    TradeLogFilters,
    'analyticsDateBasis' | 'dateRange' | 'tickers' | 'setups' | 'tags'
  >
>;


export function createDashboardTradeLogDrilldownFilters(
  filters: FilterState,
  overrides: TradeLogDrilldownOverrides = {}
): TradeLogFilters {
  return {
    ...createTradeLogFilters(),
    analyticsDateBasis: overrides.analyticsDateBasis,
    dateRange: overrides.dateRange
      ? [...overrides.dateRange]
      : [...filters.dateRange],
    tradeTypes: [...filters.tradeTypes],
    statuses: [...filters.statuses],
    reviewStatus: [...filters.reviewStatus],
    accounts: [...filters.accounts],
    directions: [...filters.directions],
    tickers: overrides.tickers ? [...overrides.tickers] : [...filters.tickers],
    setups: overrides.setups ? [...overrides.setups] : [...filters.setups],
    tags: overrides.tags ? [...overrides.tags] : [...filters.tags],
    mistakes: [...filters.mistakes],
    customFieldFilters: { ...filters.customFieldFilters },
    imageAnnotationStatus: [...(filters.imageAnnotationStatus ?? [])],
    imageTags: [...(filters.imageTags ?? [])],
  };
}
