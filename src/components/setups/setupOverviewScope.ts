
import type {
  SetupMetrics,
  SetupOutcomeScope,
} from '../../services/setup/types';
import type { SetupTimesSeenPoint } from '../charts/SetupTimesSeenChart';
import type {
  SetupLinkedTrade,
  SetupOutcomeMetricsSource,
  SetupTradeIndex,
  SetupViewModel,
} from './setupsViewTypes';

export type SetupOutcome = Exclude<SetupOutcomeScope, 'all'>;

export const EMPTY_SETUP_METRICS: SetupMetrics = {
  totalTrades: 0,
  shareOfTrades: 0,
  winRate: 0,
  totalPnL: 0,
  avgWinner: 0,
  avgLoser: 0,
  winStreak: 0,
  loseStreak: 0,
  currentStreak: 0,
  expectedValue: 0,
  riskRewardRatio: 0,
  profitFactor: 0,
  averageDuration: 0,
  bestTrade: 0,
  worstTrade: 0,
  averageVolume: 0,
  lastTradeDate: '',
  tradingFrequency: 0,
  inactivityStreak: 0,
};


export function normalizeSetupOutcomeScope(value: unknown): SetupOutcomeScope {
  return value === 'wins' || value === 'losses' ? value : 'all';
}


function isInOutcome(trade: SetupLinkedTrade, outcome: SetupOutcome): boolean {
  if (!trade.pnlContributing) return false;
  return trade.outcome === (outcome === 'wins' ? 'win' : 'loss');
}

function scopeTradesBySetup(
  tradesBySetupId: Map<string, SetupLinkedTrade[]>,
  outcome: SetupOutcome
): Map<string, SetupLinkedTrade[]> {
  const scoped = new Map<string, SetupLinkedTrade[]>();
  for (const [setupId, trades] of tradesBySetupId) {
    scoped.set(
      setupId,
      trades.filter((trade) => isInOutcome(trade, outcome))
    );
  }
  return scoped;
}


export function scopeSetupOverviewChartData(
  viewModels: SetupViewModel[],
  tradeIndex: SetupTradeIndex,
  outcome: SetupOutcome,
  outcomeMetrics: SetupOutcomeMetricsSource
): {
  viewModels: SetupViewModel[];
  tradeIndex: SetupTradeIndex;
  tradeCount: number;
} {
  const { metricsBySetupId, tradeCount } = outcomeMetrics(outcome);
  return {
    tradeCount,
    viewModels: viewModels.map((viewModel) => ({
      ...viewModel,
      metrics: metricsBySetupId.get(viewModel.setup.id) ?? EMPTY_SETUP_METRICS,
    })),
    tradeIndex: {
      primary: scopeTradesBySetup(tradeIndex.primary, outcome),
      any: scopeTradesBySetup(tradeIndex.any, outcome),
    },
  };
}


export function buildSetupTimesSeenChartData(
  viewModels: SetupViewModel[]
): SetupTimesSeenPoint[] {
  return viewModels
    .map(({ setup, opportunityStats }) => {
      const taken = opportunityStats?.live.recordCount ?? 0;
      const missed = opportunityStats?.missed.recordCount ?? 0;
      return {
        id: setup.id,
        name: setup.name,
        taken,
        missed,
        seen: taken + missed,
      };
    })
    .sort(
      (a, b) =>
        b.seen - a.seen || b.missed - a.missed || a.name.localeCompare(b.name)
    );
}


export function getMostSkippedSetup(
  points: SetupTimesSeenPoint[]
): SetupTimesSeenPoint | null {
  let mostSkipped: SetupTimesSeenPoint | null = null;
  for (const point of points) {
    if (point.missed === 0) continue;
    if (!mostSkipped) {
      mostSkipped = point;
      continue;
    }
    
    const difference =
      point.missed * mostSkipped.seen - mostSkipped.missed * point.seen;
    if (
      difference > 0 ||
      (difference === 0 && point.missed > mostSkipped.missed)
    ) {
      mostSkipped = point;
    }
  }
  return mostSkipped;
}
