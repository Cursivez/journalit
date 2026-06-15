

import type { CustomFieldFilterSelections } from '../../types/customFields';

export type ViewLevel =
  | 'years'
  | 'quarters'
  | 'months'
  | 'weeks'
  | 'days'
  | 'trades';

export type NodeType =
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
  status?: 'win' | 'loss' | 'breakeven' | 'missed' | 'open' | 'backtest';
  
  totalPnLByCurrency?: Record<string, number>;
  
  isMultiCurrency?: boolean;
  
  primaryCurrency?: string;
}

export interface TimeNode {
  type: NodeType;
  id: string;
  label: string;
  metrics: TradeLogMetrics;
  children?: TimeNode[];
  trade?: Record<string, unknown> & {
    filePath?: string;
    path?: string;
    file?: { path?: string };
  };
  expanded: boolean;
  dataLoaded: boolean;
  performanceIndicator?: 'best' | 'worst'; 
}

export type TradeType = 'all' | 'regular' | 'missed' | 'backtest';

export type TradeStatus =
  | 'all'
  | 'open'
  | 'closed'
  | 'win'
  | 'loss'
  | 'breakeven';



export const SELECTABLE_TRADE_TYPES_COUNT = 3; 
export const SELECTABLE_STATUSES_COUNT = 4; 

export interface TradeLogFilters {
  dateRange: [Date | null, Date | null];
  viewLevel: ViewLevel;
  tradeTypes: TradeType[];
  statuses: TradeStatus[];
  accounts: string[];
  tickers: string[];
  setups: string[];
  tags: string[];
  mistakes: string[];
  customFieldFilters: CustomFieldFilterSelections;
}
