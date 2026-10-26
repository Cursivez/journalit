import type { TradeLogService } from '../../services/tradelog/TradeLogService';
import type { TradeLogFilters } from '../../services/tradelog/types';
import { getActiveTreeSessionLogTags } from './tradeLogStateUtils';


export function queryTradeLog(
  service: TradeLogService,
  filters: TradeLogFilters,
  operationFilePaths?: string[],
  resultMode: 'view' | 'trades' = 'view'
) {
  return service.getHierarchicalData(
    filters.viewLevel,
    filters.dateRange[0] ?? undefined,
    filters.dateRange[1] ?? undefined,
    filters.tradeTypes,
    filters.statuses,
    filters.accounts,
    filters.tickers,
    filters.setups,
    filters.tags,
    filters.mistakes,
    filters.customFieldFilters,
    filters.reviewStatus,
    filters.directions,
    getActiveTreeSessionLogTags(filters),
    filters.analyticsDateBasis,
    operationFilePaths,
    filters.accountPhases,
    filters.exclusions,
    filters.matchModes,
    resultMode,
    filters.ratings
  );
}
