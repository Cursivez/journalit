import { normalizeTradeLogFilters } from '../../settings/viewFiltersDefaults';
import type { TradeLogFilters } from '../../services/tradelog/types';
import type { TradeLogMode } from './tradeLogStateUtils';

function sameDate(a: Date | null, b: Date | null): boolean {
  return a === b || (a !== null && b !== null && a.getTime() === b.getTime());
}


export function mergeUserTradeLogFilterChange(
  currentFilters: TradeLogFilters,
  changes: Partial<TradeLogFilters>
): TradeLogFilters {
  const nextRange = changes.dateRange;
  const dateRangeChanged =
    nextRange !== undefined &&
    !(
      sameDate(nextRange[0], currentFilters.dateRange[0]) &&
      sameDate(nextRange[1], currentFilters.dateRange[1])
    );
  const viewLevelChanged =
    changes.viewLevel !== undefined &&
    changes.viewLevel !== currentFilters.viewLevel;
  const clearsDrilldownDateBasis = dateRangeChanged || viewLevelChanged;

  return normalizeTradeLogFilters({
    ...currentFilters,
    ...changes,
    ...(clearsDrilldownDateBasis ? { analyticsDateBasis: undefined } : {}),
  });
}

export function clearDrilldownBasisForTradeLogMode(
  currentFilters: TradeLogFilters,
  nextMode: TradeLogMode
): TradeLogFilters {
  if (
    nextMode !== 'imageGallery' ||
    currentFilters.analyticsDateBasis === undefined
  ) {
    return currentFilters;
  }

  return normalizeTradeLogFilters({
    ...currentFilters,
    analyticsDateBasis: undefined,
  });
}
