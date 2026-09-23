import { normalizeTradeLogFilters } from '../../settings/viewFiltersDefaults';
import type { TradeLogFilters } from '../../services/tradelog/types';
import type { TradeLogMode } from './tradeLogStateUtils';


export function mergeUserTradeLogFilterChange(
  currentFilters: TradeLogFilters,
  changes: Partial<TradeLogFilters>
): TradeLogFilters {
  const clearsDrilldownDateBasis =
    'dateRange' in changes || 'viewLevel' in changes;

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
