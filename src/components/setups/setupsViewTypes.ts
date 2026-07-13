import type React from 'react';

import type {
  Setup,
  SetupAdvancedAnalyticsBySetup,
  SetupMetrics,
  SetupOpportunityStats,
  SetupRule,
} from '../../services/setup/types';
import type { ObsidianIconComponent } from '../shared/icons/ObsidianIcon';

export type SetupsViewPage = 'overview' | 'detail' | 'compare';
export type SetupDetailAnalysisMode = 'performance' | 'execution-gap';

export interface SetupDetailTabOption<T extends string> {
  id: T;
  label: string;
  badge?: string;
}

export interface SetupsViewState {
  page: SetupsViewPage;
  setupId?: string;
  setupPath?: string;
  setupName?: string;
  selectedSetupIds?: string[];
}

export type MetricKey =
  | 'expectedValue'
  | 'expectedR'
  | 'totalPnL'
  | 'totalR'
  | 'winRate'
  | 'profitFactor'
  | 'totalTrades'
  | 'cumulativePnl'
  | 'cumulativeR';

export type SetupOverviewChartMode = 'setups' | 'pairs';
export type SetupPairMetricKey =
  | 'edgeR'
  | 'expectancyR'
  | 'totalR'
  | 'totalPnL'
  | 'winRate'
  | 'profitFactor'
  | 'totalTrades';

export interface SetupViewModel {
  setup: Setup;
  metrics: SetupMetrics;
  advancedAnalytics?: SetupAdvancedAnalyticsBySetup;
  opportunityStats?: SetupOpportunityStats;
  completenessBadges: string[];
}

export interface SetupTradeIndex {
  primary: Map<string, SetupLinkedTrade[]>;
  any: Map<string, SetupLinkedTrade[]>;
}

export interface SetupsDataState {
  viewModels: SetupViewModel[];
  tradeIndex: SetupTradeIndex;
  loadError: string | null;
  hasLoadedData: boolean;
}

export interface SetupLinkedTrade {
  path: string;
  analyticsTime: string;
  instrument: string;
  account: string | null;
  direction: string;
  assetType?: string;
  optionType?: string;
  entryTime: string;
  exitTime: string;
  images: string[];
  pnl: number;
  rMultiple?: number;
  pnlContributing: boolean;
  reviewed: boolean;
}

export interface SetupDetailPerformancePoint {
  index: number;
  label: string;
  value: number;
  pnl: number;
  rMultiple?: number;
}

export type SetupDetailMetricTone =
  | 'positive'
  | 'negative'
  | 'neutral'
  | 'warning'
  | 'info';

export interface SetupCompareViewModel {
  setup: Setup;
  metrics: SetupCompareMetrics;
  trades: SetupLinkedTrade[];
}

export interface SetupCompareMetrics {
  totalTrades: number;
  rMultipleCount: number;
  winRate: number;
  totalPnL: number;
  totalR: number;
  expectancyR: number;
  profitFactor: number;
}

export interface SetupPairViewModel {
  key: string;
  setupIds: [string, string];
  setupNames: [string, string];
  trades: SetupLinkedTrade[];
  metrics: SetupCompareMetrics;
  firstSoloMetrics: SetupCompareMetrics;
  secondSoloMetrics: SetupCompareMetrics;
  edgeR: number;
}

export interface SetupPairSummary {
  pairCount: number;
  bestPair: SetupPairViewModel | null;
  worstPair: SetupPairViewModel | null;
  needsReviewCount: number;
}

export type SetupCompareChartMetric = 'r' | 'pnl';
export type SetupDetailChartMode = 'cumulative' | 'trades' | 'drawdown';
export type SetupCompareMetricKey =
  | 'trades'
  | 'winRate'
  | 'totalPnL'
  | 'totalR'
  | 'expectancyR'
  | 'profitFactor';

export interface SetupCompareEdgeSummary {
  winner: SetupCompareViewModel | null;
  expectancyDelta: number;
  expectancyKind: 'pnl' | 'rMultiple';
  confidence: 'low' | 'moderate' | 'high';
  sampleDescription: string;
  edgeStrength: 'slight' | 'clear' | 'strong';
  reasons: SetupCompareEdgeReason[];
}

export interface SetupCompareEdgeReason {
  label: string;
  value: React.ReactNode;
  tone: 'positive' | 'negative' | 'neutral';
}

export interface SetupOverviewChartSettings {
  metricKey: MetricKey;
  chartMode: SetupOverviewChartMode;
  pairMetricKey: SetupPairMetricKey;
  selectedSetupIds?: string[];
}

export type SetupOverviewChartSettingsAction =
  | { type: 'metric'; metricKey: MetricKey }
  | { type: 'mode'; chartMode: SetupOverviewChartMode }
  | { type: 'pairMetric'; pairMetricKey: SetupPairMetricKey }
  | { type: 'selectedSetups'; selectedSetupIds?: string[] };

export interface TradeRecordForSetups {
  path?: unknown;
  type?: unknown;
  isMissedTrade?: unknown;
  isBacktestTrade?: unknown;
  instrument?: unknown;
  entryTime?: unknown;
  exitTime?: unknown;
  images?: unknown;
  setup?: unknown;
  account?: unknown;
  pnl?: number | null;
  entryPrice?: unknown;
  exitPrice?: unknown;
  positionSize?: unknown;
  direction?: unknown;
  assetType?: unknown;
  optionType?: unknown;
  hasExplicitExitPrice?: unknown;
  directPnL?: number | null;
  riskAmount?: number | null;
  rMultiple?: number | null;
  useDirectPnLInput?: boolean;
  dividends?: Array<{ amount?: number | null }>;
  commission?: number | null;
  swap?: number | null;
  fees?: number | null;
  rebate?: number | null;
  tradeStatus?: string;
  reviewed?: unknown;
  entries?: unknown;
  exits?: unknown;
  _originalPnlWasNull?: unknown;
}

export type TradePnlCompareInput = Parameters<
  typeof import('../../utils/tradeStatusUtils').isPnlContributingTrade
>[0] & {
  entryPrice?: number | null;
  exitPrice?: number | null;
  positionSize: number;
  direction?: string;
  assetType?: string;
  optionType?: string;
  hasExplicitExitPrice?: boolean;
  entries?: Array<{
    time?: Date | string | null;
    price?: number | null;
    size?: number | null;
    hasExplicitPrice?: boolean;
  }>;
  exits?: Array<{
    time?: Date | string | null;
    price?: number | null;
    size?: number | null;
    hasExplicitPrice?: boolean;
  }>;
};

export type SetupCardHealth = 'good' | 'monitor' | 'review';
export type SetupCardTone = 'positive' | 'negative' | 'neutral';

export interface SetupSparklineModel {
  tradeCount: number;
  zeroY: number;
  positiveAreaPaths: string[];
  negativeAreaPaths: string[];
  positivePaths: string[];
  negativePaths: string[];
  neutralPaths: string[];
  finalValue: number;
}

export interface SetupOverviewPnlSeries {
  key: string;
  label: string;
  color: string;
  isCombined: boolean;
}

export interface SetupOverviewPnlPoint {
  index: number;
  label: string;
  [key: string]: number | string;
}

export interface SetupOverviewPnlChartModel {
  data: SetupOverviewPnlPoint[];
  series: SetupOverviewPnlSeries[];
}

export interface SetupPairTrendPoint {
  index: number;
  value: number;
}

export interface SetupRuleGroupViewModel {
  id: string;
  label: string;
  order: number;
  rules: SetupRule[];
}

export interface SetupAttentionItem {
  key: string;
  severity: 'info' | 'warning' | 'critical' | 'success';
  icon: ObsidianIconComponent;
  title: string;
  detail: string;
}

export interface SetupCompareBreakdown {
  label: string;
  Icon: ObsidianIconComponent;
  rows: Array<{
    id: string;
    label: string;
    value: number;
    winnerValue: number;
    otherValue: number;
    winnerName: string;
    otherName: string;
  }>;
}
