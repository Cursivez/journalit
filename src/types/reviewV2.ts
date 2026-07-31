


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

  sectionOrder?: TradeNoteSectionId[];
  assetDefaults?: Partial<
    Record<
      TradeTemplateAssetType,
      {
        sectionOrder?: TradeNoteSectionId[];
        sections?: Partial<TradeTemplate['sections']>;
      }
    >
  >;
  assetOverrides?: Partial<
    Record<
      TradeTemplateAssetType,
      {
        sectionOrder?: TradeNoteSectionId[];
        sections?: Partial<TradeTemplate['sections']>;
      }
    >
  >;

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
      showCustomFields?: boolean;
    };
    details: {
      show: boolean;
      showThesis: boolean;
      metrics: TradeMetricType[];
    };
    reviewButton: {
      show: boolean;
    };
    missedReason?: {
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
export type TradeNoteSectionId =
  | 'navigation'
  | 'images'
  | 'metrics'
  | 'thesis'
  | 'missedReason'
  | 'metadata'
  | 'reviewButton';

export type TradeTemplateAssetType =
  | 'stock'
  | 'options'
  | 'futures'
  | 'forex'
  | 'crypto'
  | 'cfd';


export type TradeMetricType =
  | 'entry'
  | 'exit'
  | 'size'
  | 'duration'
  | 'stopLoss'
  | 'takeProfit'
  | 'executionSummary'
  | 'pnl'
  | 'rMultiple'
  | 'costs';


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


export const DEMON_TRACKER_TRACKING_METHODS = [
  'trade-occurrences',
  'trading-days',
  'daily-review-entries',
] as const;
export type DemonTrackerTrackingMethod =
  (typeof DEMON_TRACKER_TRACKING_METHODS)[number];
export const DEFAULT_DEMON_TRACKER_TRACKING_METHOD: DemonTrackerTrackingMethod =
  'trade-occurrences';
const DEMON_TRACKER_TRACKING_METHOD_SET: ReadonlySet<string> = new Set(
  DEMON_TRACKER_TRACKING_METHODS
);

export function isDemonTrackerTrackingMethod(
  value: unknown
): value is DemonTrackerTrackingMethod {
  return (
    typeof value === 'string' && DEMON_TRACKER_TRACKING_METHOD_SET.has(value)
  );
}

export const DEMON_TRACKER_STOP_THRESHOLDS = [2, 3, 4, 5, 6, 7, 8, 9] as const;
export type DemonTrackerStopThreshold =
  (typeof DEMON_TRACKER_STOP_THRESHOLDS)[number];
export const DEFAULT_DEMON_TRACKER_STOP_THRESHOLD: DemonTrackerStopThreshold = 6;
const DEMON_TRACKER_STOP_THRESHOLD_SET: ReadonlySet<number> = new Set(
  DEMON_TRACKER_STOP_THRESHOLDS
);

export function isDemonTrackerStopThreshold(
  value: unknown
): value is DemonTrackerStopThreshold {
  return (
    typeof value === 'number' && DEMON_TRACKER_STOP_THRESHOLD_SET.has(value)
  );
}


export interface DemonTrackerWidgetConfig {
  trackingMethod?: DemonTrackerTrackingMethod;
  
  stopThreshold?: DemonTrackerStopThreshold;
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
  | 'session-log'
  | 'key-levels'
  | 'trades'
  | 'trade-review'
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
