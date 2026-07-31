import type { TradeType, TradeStatus } from '../../services/tradelog/types';
import type {
  DirectionFilter,
  ImageAnnotationStatusFilter,
  ReviewStatusFilter,
} from '../../services/tradelog/types';
import type { CustomFieldFilterSelections } from '../../types/customFields';

export interface FilterState {
  dateRange: [Date | null, Date | null];
  accounts: string[];
  tickers: string[];
  setups: string[];
  tags: string[];
  mistakes: string[];
  tradeTypes: TradeType[];
  statuses: TradeStatus[];
  reviewStatus: ReviewStatusFilter[];
  directions: DirectionFilter[];
  customFieldFilters: CustomFieldFilterSelections;
  imageAnnotationStatus?: ImageAnnotationStatusFilter[];
  imageTags?: string[];
}
