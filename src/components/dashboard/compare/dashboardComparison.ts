

import type { FilterState } from '../dashboardTypes';
import { areRecentPeriodsEqual } from '../../shared/filters/recentPeriod';
import { normalizeDashboardFilters } from '../../../settings/viewFiltersDefaults';

type SharedDates = 'dateRange' | 'datePreset' | 'recentPeriod';


export type DashboardComparisonFilters = Omit<FilterState, SharedDates>;

export interface SavedDashboardComparison {
  id: string;
  name: string;
  a: DashboardComparisonFilters;
  b: DashboardComparisonFilters;
}


export const COMPARE_LOW_SAMPLE_TRADES = 30;


export const SAVED_COMPARISON_NAME_MAX_LENGTH = 80;

export const toComparisonFilters = (
  filters: FilterState
): DashboardComparisonFilters => {
  const {
    dateRange: _dateRange,
    datePreset: _datePreset,
    recentPeriod: _recentPeriod,
    ...rest
  } = filters;
  return rest;
};


export const withSharedDateRange = (
  filters: DashboardComparisonFilters,
  dates: Pick<FilterState, SharedDates>
): FilterState =>
  normalizeDashboardFilters({
    ...filters,
    dateRange: dates.dateRange,
    datePreset: dates.datePreset,
    recentPeriod: dates.recentPeriod,
  });


export const sameDateRange = (
  a: FilterState | null,
  b: FilterState | null
): boolean => {
  if (!a || !b) return false;
  if (a.recentPeriod || b.recentPeriod) {
    return areRecentPeriodsEqual(a.recentPeriod, b.recentPeriod);
  }
  return (
    a.dateRange[0]?.getTime() === b.dateRange[0]?.getTime() &&
    a.dateRange[1]?.getTime() === b.dateRange[1]?.getTime()
  );
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);


export const normalizeComparisonFilters = (
  value: unknown
): DashboardComparisonFilters =>
  toComparisonFilters(
    normalizeDashboardFilters(
      isRecord(value)
        ? { ...(value as Partial<FilterState>), dateRange: [null, null] }
        : null
    )
  );


export const normalizeSavedComparisons = (
  value: unknown
): SavedDashboardComparison[] => {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const saved: SavedDashboardComparison[] = [];
  for (const entry of value) {
    if (!isRecord(entry)) continue;
    const id = typeof entry.id === 'string' ? entry.id.trim() : '';
    const name =
      typeof entry.name === 'string'
        ? entry.name.trim().slice(0, SAVED_COMPARISON_NAME_MAX_LENGTH)
        : '';
    if (!id || !name || seen.has(id)) continue;
    seen.add(id);
    saved.push({
      id,
      name,
      a: normalizeComparisonFilters(entry.a),
      b: normalizeComparisonFilters(entry.b),
    });
  }
  return saved;
};

export const createSavedComparisonId = (): string =>
  `cmp-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
