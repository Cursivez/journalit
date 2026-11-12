

import type JournalitPlugin from '../../main';
import type { UIState } from '../../settings/UIStateManager';
import {
  createReviewFilters,
  createTradeLogFilters,
  normalizeDashboardFilters,
} from '../../settings/viewFiltersDefaults';
import { eventBus } from '../../services/events/EventBus';
import { getWeekStartDaySetting } from '../../utils/dateUtils';
import { rollDatePreset } from '../../utils/datePresets';
import type { FilterState } from './dashboardTypes';
import {
  type DashboardComparisonFilters,
  normalizeComparisonFilters,
} from './compare/dashboardComparison';


export function readPersistedDashboardFilters(
  state: UIState
): FilterState | null {
  const persisted = state.viewFilters?.dashboard;
  if (!persisted) return null;
  return rollDatePreset(
    {
      ...normalizeDashboardFilters(persisted),
      
      dateRange: [
        persisted.dateRange[0] ? new Date(persisted.dateRange[0]) : null,
        persisted.dateRange[1] ? new Date(persisted.dateRange[1]) : null,
      ],
    },
    getWeekStartDaySetting(),
    new Date()
  );
}


export function readPersistedDashboardCompare(
  state: UIState
): DashboardComparisonFilters | null {
  const persisted = state.dashboardCompare;
  return persisted === undefined || persisted === null
    ? null
    : normalizeComparisonFilters(persisted);
}


export function requestDashboardView(
  plugin: Pick<JournalitPlugin, 'uiStateManager'>,
  filters: FilterState,
  compare: DashboardComparisonFilters | null
): void {
  const viewFilters = plugin.uiStateManager.getState().viewFilters;
  
  void plugin.uiStateManager.updateState({
    viewFilters: {
      dashboard: filters,
      tradelog: viewFilters?.tradelog ?? createTradeLogFilters(),
      reviews: viewFilters?.reviews ?? createReviewFilters(),
    },
    
    dashboardCompare: compare ?? undefined,
  });
  eventBus.publish('dashboard:view-requested');
}
