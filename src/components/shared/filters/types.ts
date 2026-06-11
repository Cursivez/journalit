

import { App } from 'obsidian';
import JournalitPlugin from '../../../main';
import { TradeType, TradeStatus } from '../../../services/tradelog/types';
import {
  CustomFieldDefinition,
  CustomFieldFilterSelections,
  DropdownOption,
} from '../../../types/customFields';

export type FilterContext = 'dashboard' | 'tradelog' | 'review';


export interface UnifiedFilters {
  
  accounts: string[];

  
  tickers: string[];

  
  setups: string[];

  
  tags: string[];

  
  mistakes: string[];

  
  tradeTypes: TradeType[];

  
  statuses: TradeStatus[];

  
  customFieldFilters: CustomFieldFilterSelections;
}

export interface AvailableCustomFieldFilter {
  field: CustomFieldDefinition;
  options: DropdownOption[];
}

export interface FilterModalProps {
  app: App;
  plugin: JournalitPlugin;
  context: FilterContext;
  currentFilters: UnifiedFilters;
  onApply: (filters: UnifiedFilters) => void;
  onClose: () => void;
  
  availableAccounts?: string[];
  
  availableCustomFieldFilters?: AvailableCustomFieldFilter[];
}
