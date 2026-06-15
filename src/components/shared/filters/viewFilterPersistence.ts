import type { PersistedViewFilters } from '../../../settings/types';
import {
  createDashboardFilters,
  createReviewFilters,
  createTradeLogFilters,
} from '../../../settings/viewFiltersDefaults';

type ViewFilterKey = keyof PersistedViewFilters;
type ViewFilterByKey<K extends ViewFilterKey> = PersistedViewFilters[K];

interface ViewFilterStore {
  getState(): { viewFilters?: Partial<PersistedViewFilters> };
  updateState(state: { viewFilters: PersistedViewFilters }): unknown;
}

const DEFAULT_VIEW_FILTERS: {
  [K in ViewFilterKey]: () => PersistedViewFilters[K];
} = {
  dashboard: createDashboardFilters,
  tradelog: createTradeLogFilters,
  reviews: createReviewFilters,
};

export function persistViewFilter<K extends ViewFilterKey>(
  store: ViewFilterStore,
  viewKey: K,
  filters: ViewFilterByKey<K>
): void {
  const currentViewFilters = store.getState().viewFilters;
  const nextViewFilters: PersistedViewFilters = {
    dashboard:
      currentViewFilters?.dashboard || DEFAULT_VIEW_FILTERS.dashboard(),
    tradelog: currentViewFilters?.tradelog || DEFAULT_VIEW_FILTERS.tradelog(),
    reviews: currentViewFilters?.reviews || DEFAULT_VIEW_FILTERS.reviews(),
  };

  const updatedViewFilters: PersistedViewFilters = {
    ...nextViewFilters,
    [viewKey]: filters,
  };

  void store.updateState({ viewFilters: updatedViewFilters });
  return;
}
