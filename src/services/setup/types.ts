

import type { LabelColor } from '../../types/labelColor';

export type SetupStatus = 'testing' | 'active' | 'archived';

type SetupDirection = 'long' | 'short' | 'both';

export type SetupRuleCategory =
  | 'context'
  | 'entry'
  | 'exit'
  | 'risk'
  | 'management'
  | 'invalidation'
  | 'psychology';

export interface SetupRule {
  id: string;
  label: string;
  description?: string;
  category: SetupRuleCategory;
  groupId?: string;
  required: boolean;
  order: number;
}

export interface SetupRuleGroup {
  id: string;
  name: string;
  order: number;
}

export interface Setup {
  id: string;
  name: string;
  description?: string;
  model?: string;
  category?: string;
  filePath?: string;
  aliases: string[];
  status: SetupStatus;
  color?: LabelColor;
  icon?: string;
  tags: string[];
  
  preferredSessions: string[];
  preferredTimeframes: string[];
  preferredTickers: string[];
  direction?: SetupDirection;
  playbookMarkdown: string;
  ruleGroups: SetupRuleGroup[];
  rules: SetupRule[];
  ruleSetVersion: number;
  linkedNotes: string[];
  version: number;
  createdAt: string;
  updatedAt: string;
  order: number; 
}

export interface SetupData {
  name: string;
  aliases?: string[];
  status?: SetupStatus;
  color?: LabelColor | null;
  icon?: string;
  tags?: string[];
  
  preferredSessions?: string[];
  preferredTimeframes?: string[];
  preferredTickers?: string[];
  direction?: SetupDirection;
  playbookMarkdown?: string;
  
  rules?: SetupRule[] | string;
  ruleGroups?: SetupRuleGroup[];
  ruleSetVersion?: number;
  linkedNotes?: string[];
  order?: number;
}

export interface SetupRefResolution {
  kind: 'resolved' | 'unmanaged' | 'ambiguous';
  raw: string;
  setup?: Setup;
  setups?: Setup[];
  matchedBy?: 'id' | 'name' | 'alias' | 'normalized-name' | 'normalized-alias';
}

export type ConvertUnmanagedSetupLabelData = Partial<SetupData>;

export interface SetupMetrics {
  
  totalTrades: number;
  winRate: number;
  totalPnL: number;
  avgWinner: number;
  avgLoser: number;
  winStreak: number;
  loseStreak: number;
  currentStreak: number;

  
  expectedValue: number; 
  riskRewardRatio: number; 
  profitFactor: number; 
  averageDuration: number; 
  bestTrade: number; 
  worstTrade: number; 
  averageVolume: number; 

  
  lastTradeDate: string; 
  tradingFrequency: number; 
  inactivityStreak: number; 
}

export type SetupOpportunityTradeType = 'live' | 'missed' | 'backtest';

export interface SetupOpportunityBucket {
  recordCount: number;
  contributingCount: number;
  winRate: number;
  totalPnL: number;
  averagePnL: number;
  profitFactor: number;
  totalR: number;
  averageR: number;
  rMultipleCount: number;
}

export interface SetupMissedReasonCount {
  reason: string;
  count: number;
}

export interface SetupOpportunityStats {
  setupId: string;
  live: SetupOpportunityBucket;
  missed: SetupOpportunityBucket;
  backtest: SetupOpportunityBucket;
  livePlusMissed: SetupOpportunityBucket;
  missedOpportunityRate: number;
  backtestVsLiveAverageRDelta: number | null;
  missedReasonCounts: SetupMissedReasonCount[];
}

export interface SetupOutcomeMetrics {
  tradeCount: number;
  winRate: number;
  totalPnL: number;
  averagePnL: number;
  profitFactor: number;
}

export interface SetupNeedsAttentionInsight {
  setupId: string;
  kind: 'no-trades';
  severity: 'info' | 'warning' | 'critical';
}

export interface SetupAdvancedAnalyticsBySetup {
  setupId: string;
  tradeCount: number;
  needsAttention: SetupNeedsAttentionInsight[];
}

export interface SetupCombinationAnalytics {
  setupIds: string[];
  setupNames: string[];
  metrics: SetupOutcomeMetrics;
}

export interface SetupAdvancedAnalytics {
  bySetup: Record<string, SetupAdvancedAnalyticsBySetup>;
  combinations: SetupCombinationAnalytics[];
  pairedSetups: SetupCombinationAnalytics[];
}

export interface SetupFilter {
  status?: SetupStatus;
  search?: string;
  sortBy?: 'name' | 'createdAt' | 'winRate' | 'order';
  sortDir?: 'asc' | 'desc';
}
