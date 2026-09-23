

import type { CustomFieldFilterSelections } from '../../types/customFields';
import type { AccountPhaseScope } from '../../components/shared/filters/types';
import type { PartialTradeFrontmatter } from '../../types/TradeFrontmatter';
import type { AnalyticsDateBasis } from '../../settings/types';

export type ViewLevel =
  | 'years'
  | 'quarters'
  | 'months'
  | 'weeks'
  | 'days'
  | 'trades';

type NodeType =
  | 'root'
  | 'year'
  | 'quarter'
  | 'month'
  | 'week'
  | 'day'
  | 'trade'
  | 'trade-group-header';

export interface TradeLogMetrics {
  totalPnL: number;
  winRate: number;
  tradeCount: number;
  openTradeCount?: number;
  closedTradeCount?: number;
  totalRMultiple?: number;
  bestPeriod?: {
    label: string;
    pnl: number;
  };
  worstPeriod?: {
    label: string;
    pnl: number;
  };
  status?:
    | 'win'
    | 'loss'
    | 'breakeven'
    | 'unknown'
    | 'missed'
    | 'open'
    | 'partially_closed'
    | 'cancelled'
    | 'backtest';
  
  totalPnLByCurrency?: Record<string, number>;
  
  isMultiCurrency?: boolean;
  
  primaryCurrency?: string;
}

export type TradeLogTrade = PartialTradeFrontmatter &
  Record<string, unknown> & {
    filePath?: string;
    path?: string;
    file?: { path?: string };
  };

export interface TimeNode {
  type: NodeType;
  id: string;
  label: string;
  metrics: TradeLogMetrics;
  sessionLogTagIds?: string[];
  children?: TimeNode[];
  trade?: TradeLogTrade;
  expanded: boolean;
  dataLoaded: boolean;
  
  anchorDate?: string;
  
  parentPeriodId?: string;
  performanceIndicator?: 'best' | 'worst'; 
}

export type TradeType = 'all' | 'regular' | 'missed' | 'backtest';

export type TradeStatus =
  | 'all'
  | 'open'
  | 'closed'
  | 'win'
  | 'loss'
  | 'breakeven'
  | 'cancelled';

export type ReviewStatusFilter = 'reviewed' | 'unreviewed';

export type DirectionFilter = 'long' | 'short';

export type ImageAnnotationStatusFilter =
  | 'tagged'
  | 'untagged'
  | 'hasNotes'
  | 'noNotes';



export const SELECTABLE_TRADE_TYPES_COUNT = 3; 
export const SELECTABLE_STATUSES_COUNT = 5; 

export interface TradeLogFilters {
  dateRange: [Date | null, Date | null];
  analyticsDateBasis?: AnalyticsDateBasis;
  viewLevel: ViewLevel;
  tradeTypes: TradeType[];
  statuses: TradeStatus[];
  accounts: string[];
  accountPhases: AccountPhaseScope[];
  directions: DirectionFilter[];
  sessionLogTags: string[];
  tickers: string[];
  setups: string[];
  tags: string[];
  mistakes: string[];
  reviewStatus: ReviewStatusFilter[];
  customFieldFilters: CustomFieldFilterSelections;
  imageAnnotationStatus: ImageAnnotationStatusFilter[];
  imageTags: string[];
}
