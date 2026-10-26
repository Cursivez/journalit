import { applyTradeFilters } from '../../components/shared/filters/filterUtils';
import type { UnifiedFilters } from '../../components/shared/filters/types';
import type { CustomFieldDefinition } from '../../types/customFields';
import type { BreakEvenRangeSettings } from '../../utils/breakEvenRange';

export interface AnalyticsFilterOptions<TTrade extends object> {
  customFieldDefinitions?: CustomFieldDefinition[];
  isTradeOpen?: (trade: TTrade) => boolean;
  breakEvenSettings?: BreakEvenRangeSettings;
  getBreakEvenBalance?: (trade: TTrade) => number | undefined;
}

export const applyAnalyticsFilters = <TTrade extends object>(
  trades: TTrade[],
  filters: UnifiedFilters | null,
  options: AnalyticsFilterOptions<TTrade> = {}
): TTrade[] =>
  applyTradeFilters(trades, filters, options.customFieldDefinitions ?? [], {
    isTradeOpen: options.isTradeOpen,
    breakEvenSettings: options.breakEvenSettings,
    getBreakEvenBalance: options.getBreakEvenBalance,
  });
