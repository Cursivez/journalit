


export interface ReviewTemplate {
  id: string;
  name: string;
  type: 'drc' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  version: number;
  createdAt: string;
  updatedAt: string;
  isBuiltIn: boolean;
  widgets: WidgetPlacement[];
}


export interface WidgetPlacement {
  type: string;
  id?: string;
  locked?: boolean;
  config?: Record<string, unknown>;
}


export interface TradeTemplate {
  id: string;
  name: string;
  type: 'trade';
  version: number;
  createdAt: string;
  updatedAt: string;
  isBuiltIn: boolean;

  sections: {
    header: { show: true };
    navigation: { show: boolean };
    images: {
      show: boolean;
      position: 'top' | 'side' | 'bottom';
    };
    metadata: {
      show: boolean;
      showAccounts: boolean;
      showSetups: boolean;
      showMistakes: boolean;
      showTags: boolean;
    };
    details: {
      show: boolean;
      showThesis: boolean;
      metrics: TradeMetricType[];
    };
    review: {
      show: 'always' | 'losses-only' | 'never';
      showForMissed?: boolean; 
      showForBacktest?: boolean; 
      sections: TradeReviewSection[]; 
      winSections?: TradeReviewSection[]; 
      lossSections?: TradeReviewSection[]; 
    };
    reviewButton: {
      show: boolean;
    };
  };

  display: {
    pnlFormat: 'currency' | 'rMultiple' | 'percentage' | 'both';
    showOpenBadge: boolean;
    showMissedBadge: boolean;
    showBacktestBadge: boolean;
  };
}


export type TradeMetricType =
  | 'entry'
  | 'exit'
  | 'size'
  | 'duration'
  | 'pnl'
  | 'rMultiple'
  | 'costs';


export interface TradeReviewSection {
  id: string;
  title: string;
  type: 'header' | 'checkbox' | 'textarea' | 'checkboxList';
  content?: string; 
  items?: string[]; 
  placeholder?: string; 
}


export interface CustomWidgetType {
  id: string;
  name: string;

  dataSource: {
    type: 'frontmatter' | 'query' | 'static';
    field?: string;
    query?: {
      entity: 'trades' | 'drcs' | 'weekly' | 'accounts';
      filters?: QueryFilter[];
    };
  };

  dateFilter?: {
    type: 'inherit' | 'relative' | 'custom';
    relative?: 'this-week' | 'last-week' | 'this-month' | 'last-month';
  };

  displayType: 'text' | 'list' | 'table' | 'chart' | 'stat-card';
  displayConfig?: {
    style?: 'bullet' | 'checkbox' | 'numbered';
    columns?: string[];
    chartType?: 'line' | 'bar' | 'pie' | 'histogram' | 'area';
    stats?: StatType[];
  };
}


interface QueryFilter {
  field: string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'contains';
  value: unknown;
}


type StatType = 'pnl' | 'winRate' | 'tradeCount' | 'avgR' | 'profitFactor';


export type DemonTrackerCountMode = 'per-trade' | 'per-trading-day';


export type DemonTrackerSourceMode = 'trades' | 'session' | 'combined';


export interface DemonTrackerWidgetConfig {
  countMode?: DemonTrackerCountMode;
  sourceMode?: DemonTrackerSourceMode;
}

export type ReviewContextFieldsSelectionMode = 'all' | 'group' | 'fields';

export interface ReviewContextFieldsWidgetConfig {
  selectionMode?: ReviewContextFieldsSelectionMode;
  groupId?: string;
  fieldIds?: string;
  showInherited?: boolean;
  showLocal?: boolean;
  hideEmpty?: boolean;
}


type DRCWidgetType =
  | 'header'
  | 'goals'
  | 'checklist'
  | 'session-mistakes'
  | 'key-levels'
  | 'trades'
  | 'stats'
  | 'account-breakdown'
  | 'pnl-chart'
  | 'drawdown-chart'
  | 'setup-performance'
  | 'best-worst' 
  | 'trades-chart' 
  | 'directional-pnl'
  | 'directional-drawdown'
  | 'long-drawdown'
  | 'short-drawdown'
  | 'breakdown' 
  | 'review'
  | 'review-context-fields'
  | 'missed-trades'
  | 'backtest-trades'
  | 'key-events'
  | 'previous-trading-day-context'
  | 'images'
  | 'markdown-zone'
  | 'markdown-header'
  | 'mark-reviewed';


type WeeklyWidgetType =
  | 'header'
  | 'goals'
  | 'checklist'
  | 'key-levels'
  | 'key-events'
  | 'weekly-drc-context'
  | 'stats'
  | 'account-breakdown'
  | 'pnl-chart'
  | 'drawdown-chart'
  | 'trades'
  | 'breakdown' 
  | 'setup-performance'
  | 'best-worst' 
  | 'trades-chart' 
  | 'directional-pnl'
  | 'directional-drawdown'
  | 'long-drawdown'
  | 'short-drawdown'
  | 'review'
  | 'review-context-fields'
  | 'backtest-trades'
  | 'images'
  | 'markdown-zone'
  | 'markdown-header'
  | 'mark-reviewed';


type MonthlyWidgetType =
  | 'header'
  | 'goals'
  | 'key-levels'
  | 'stats'
  | 'account-breakdown'
  | 'pnl-chart'
  | 'drawdown-chart'
  | 'trades'
  | 'breakdown' 
  | 'technical-game'
  | 'mental-game'
  | 'demon-tracker'
  | 'setup-performance'
  | 'best-worst' 
  | 'trades-chart' 
  | 'directional-pnl'
  | 'directional-drawdown'
  | 'long-drawdown'
  | 'short-drawdown'
  | 'review'
  | 'review-context-fields'
  | 'backtest-trades'
  | 'images'
  | 'markdown-zone'
  | 'markdown-header'
  | 'mark-reviewed';


type QuarterlyWidgetType =
  | 'header'
  | 'goals'
  | 'stats'
  | 'account-breakdown'
  | 'pnl-chart'
  | 'drawdown-chart'
  | 'trades'
  | 'breakdown' 
  | 'technical-game'
  | 'mental-game'
  | 'demon-tracker'
  | 'setup-performance'
  | 'best-worst' 
  | 'trades-chart' 
  | 'directional-pnl'
  | 'directional-drawdown'
  | 'long-drawdown'
  | 'short-drawdown'
  | 'review'
  | 'review-context-fields'
  | 'backtest-trades'
  | 'images'
  | 'markdown-zone'
  | 'markdown-header'
  | 'mark-reviewed';


type YearlyWidgetType =
  | 'header'
  | 'goals'
  | 'stats'
  | 'account-breakdown'
  | 'pnl-chart'
  | 'drawdown-chart'
  | 'trades'
  | 'breakdown' 
  | 'technical-game'
  | 'mental-game'
  | 'demon-tracker'
  | 'setup-performance'
  | 'best-worst' 
  | 'trades-chart' 
  | 'directional-pnl'
  | 'directional-drawdown'
  | 'long-drawdown'
  | 'short-drawdown'
  | 'review'
  | 'review-context-fields'
  | 'backtest-trades'
  | 'images'
  | 'markdown-zone'
  | 'markdown-header'
  | 'mark-reviewed';


export type ReviewWidgetType =
  | DRCWidgetType
  | WeeklyWidgetType
  | MonthlyWidgetType
  | QuarterlyWidgetType
  | YearlyWidgetType;


export type ReviewTemplateType =
  | 'drc'
  | 'weekly'
  | 'monthly'
  | 'quarterly'
  | 'yearly';





import { Trade } from '../components/drc/types';


export interface GoalsPreviewData {
  goals: Array<{ text: string; checked: boolean }>;
}


export interface ChecklistPreviewData {
  items: Array<{ text: string; checked: boolean }>;
}


export interface HeaderPreviewData {
  date: Date;
  title: string;
  reviewType: 'drc' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  weekNumber?: number;
  month?: string;
  quarter?: number;
  year?: number;
}


export interface ReviewPreviewData {
  mentalGrade: string | number;
  technicalGrade: string | number;
  gradeScale?: 'letter' | 'numeric';
}


export interface MarkReviewedPreviewData {
  reviewed: boolean;
  reviewedAt?: string;
}


export interface TradesPreviewData {
  trades: Trade[];
  noteType?:
    | 'drc'
    | 'weekly-review'
    | 'monthly-review'
    | 'quarterly-review'
    | 'yearly-review';
}
