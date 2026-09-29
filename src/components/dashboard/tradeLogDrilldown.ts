import { createTradeLogFilters } from '../../settings/viewFiltersDefaults';
import type { TradeLogFilters } from '../../services/tradelog/types';
import type { FilterState } from './dashboardTypes';
import { cloneFilterExclusions } from '../shared/filters/filterExclusions';
import { cloneFilterMatchModes } from '../shared/filters/filterMatchModes';

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
    exclusions: cloneFilterExclusions(filters.exclusions),
    
    
    matchModes: {
      ...cloneFilterMatchModes(filters.matchModes),
      ...(overrides.setups ? { setups: 'any' as const } : {}),
      ...(overrides.tags ? { tags: 'any' as const } : {}),
    },
    imageAnnotationStatus: [...(filters.imageAnnotationStatus ?? [])],
    imageTags: [...(filters.imageTags ?? [])],
  };
}
