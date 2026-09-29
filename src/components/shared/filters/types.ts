

import { TradeType, TradeStatus } from '../../../services/tradelog/types';
import type {
  DirectionFilter,
  ImageAnnotationStatusFilter,
  ReviewStatusFilter,
} from '../../../services/tradelog/types';
import {
  CustomFieldDefinition,
  CustomFieldFilterSelections,
  DropdownOption,
} from '../../../types/customFields';
import type { FilterExclusions } from './filterExclusions';
import type { FilterMatchModes } from './filterMatchModes';


export interface UnifiedFilters {
  
  accounts: string[];

  
  accountPhases: AccountPhaseScope[];

  
  tickers: string[];

  
  setups: string[];

  
  tags: string[];

  
  mistakes: string[];

  
  tradeTypes: TradeType[];

  
  statuses: TradeStatus[];

  
  reviewStatus: ReviewStatusFilter[];

  
  directions: DirectionFilter[];

  
  sessionLogTags?: string[];

  
  customFieldFilters: CustomFieldFilterSelections;

  
  exclusions: FilterExclusions;

  
  matchModes: FilterMatchModes;

  
  imageAnnotationStatus?: ImageAnnotationStatusFilter[];
  imageTags?: string[];
}

export interface AccountPhaseScope {
  account: string;
  phaseId: string;
}

export interface AvailableImageFilterOptions {
  tags: DropdownOption[];
}

export interface AvailableCustomFieldFilter {
  field: CustomFieldDefinition;
  options: DropdownOption[];
}
