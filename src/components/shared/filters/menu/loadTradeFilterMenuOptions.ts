

import type JournalitPlugin from '../../../../main';
import type { TradeLogService } from '../../../../services/tradelog/TradeLogService';
import {
  type DropdownOption,
  isDiscreteCustomFieldFilterable,
} from '../../../../types/customFields';
import type { LoadedFilterMenuOptions } from './filterMenuState';

interface LoadTradeFilterMenuOptionsInput {
  plugin: JournalitPlugin;
  tradeLogService: TradeLogService;
  
  fallbackAccounts?: string[];
  
  loadImageTags?: () => Promise<DropdownOption[]>;
  
  logPrefix: string;
}

export async function loadTradeFilterMenuOptions({
  plugin,
  tradeLogService,
  fallbackAccounts,
  loadImageTags,
  logPrefix,
}: LoadTradeFilterMenuOptionsInput): Promise<LoadedFilterMenuOptions> {
  const discreteFields = plugin.customFieldsService
    .getFields()
    .filter(isDiscreteCustomFieldFilterable);

  const [accounts, customFields, imageTags] = await Promise.all([
    tradeLogService.getUniqueAccounts().catch((error: unknown) => {
      console.error(
        `${logPrefix} Failed to load account filter options:`,
        error
      );
      return fallbackAccounts;
    }),
    tradeLogService
      .getAvailableCustomFieldFilters(discreteFields)
      .catch((error: unknown) => {
        console.error(
          `${logPrefix} Failed to load custom field filter options:`,
          error
        );
        return undefined;
      }),
    loadImageTags?.().catch((error: unknown) => {
      console.error(
        `${logPrefix} Failed to load gallery filter options:`,
        error
      );
      return undefined;
    }),
  ]);

  return { accounts, customFields, imageTags };
}
