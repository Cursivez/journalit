import type { TradeType, TradeStatus } from '../../services/tradelog/types';
import type {
  DirectionFilter,
  ImageAnnotationStatusFilter,
  ReviewStatusFilter,
} from '../../services/tradelog/types';
import type { CustomFieldFilterSelections } from '../../types/customFields';
import type { AccountPhaseScope } from '../shared/filters/types';
import type { FilterExclusions } from '../shared/filters/filterExclusions';
import type { FilterMatchModes } from '../shared/filters/filterMatchModes';

export interface FilterState {
  dateRange: [Date | null, Date | null];
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
  customFieldFilters: CustomFieldFilterSelections;
  exclusions: FilterExclusions;
  matchModes: FilterMatchModes;
  imageAnnotationStatus?: ImageAnnotationStatusFilter[];
  imageTags?: string[];
}
