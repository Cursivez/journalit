

import {
  Setup,
  SetupMetrics,
  SetupMetricsResult,
  SetupOutcomeScope,
} from './types';
import { calculateWinRateExcludingBreakeven } from '../../utils/breakEvenRange';
import { isPnlContributingTrade } from '../../utils/tradeStatusUtils';
import {
  getSetupTradeType,
  LIVE_SETUP_TRADE_TYPES,
  type SetupTradeType,
} from './setupTradeTypes';
import { calculateSetupTradePnl, toSetupTradePnlInput } from './setupTradePnl';
import type {
  SetupTradeBalanceFields,
  SetupTradeOutcome,
  SetupTradeOutcomeClassifier,
} from './setupTradeOutcome';

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : [];
}

function numberValue(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

function dateString(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  return typeof value === 'string' ? value : '';
}

interface Trade extends Record<string, unknown>, SetupTradeBalanceFields {
  path?: string;
  type?: unknown;
  isMissedTrade?: unknown;
  isBacktestTrade?: unknown;
  exitPrice: number;
  entryPrice: number;
  positionSize: number;
  setup: string[];
  entryTime: string; 
  exitTime: string; 
  pnl?: number | null;
  tradeStatus?: string;
  direction?: string;
  assetType?: string;
  useDirectPnLInput?: boolean;
  hasExplicitExitPrice?: boolean;
  directPnL?: number | null;
  dividends?: Array<{ amount?: number | null }>;
  commission?: number | null;
  commissionType?: 'fixed' | 'percentage';
  swap?: number | null;
  fees?: number | null;
  rebate?: number | null;
  entries?: Array<{
    time?: string | Date | null;
    price?: number | null;
    size?: number | null;
  }>;
  exits?: Array<{
    time?: string | Date | null;
    price?: number | null;
    size?: number | null;
    hasExplicitPrice?: boolean;
  }>;
  _originalPnlWasNull?: boolean;
}

function normalizeSetupMetricTrade(value: unknown): Trade | null {
  if (!isRecord(value)) {
    return null;
  }

  const setup = stringArray(value.setup);

  return {
    ...value,
    exitPrice: numberValue(value.exitPrice),
    entryPrice: numberValue(value.entryPrice),
    positionSize: numberValue(value.positionSize),
    setup,
    entryTime: dateString(value.entryTime),
    exitTime: dateString(value.exitTime),
  };
}

function isInScope(
  outcome: SetupTradeOutcome,
  scope: SetupOutcomeScope
): boolean {
  if (scope === 'all') return true;
  return scope === 'wins' ? outcome === 'win' : outcome === 'loss';
}


interface TradeResult {
  pnl: number;
  outcome: SetupTradeOutcome;
}

function pnlsWithOutcome(
  results: readonly TradeResult[],
  outcome: SetupTradeOutcome
): number[] {
  return results.flatMap((result) =>
    result.outcome === outcome ? [result.pnl] : []
  );
}


export class SetupMetricsCalculator {
  
  public calculateMetricsForSetupsFromTradeData(
    setups: readonly Setup[],
    tradeData: Array<Record<string, unknown>>,
    classifyOutcome: SetupTradeOutcomeClassifier,
    scope: SetupOutcomeScope = 'all',
    tradeTypes: ReadonlySet<SetupTradeType> = LIVE_SETUP_TRADE_TYPES
  ): SetupMetricsResult {
    const trades: Trade[] = [];
    
    const results: TradeResult[] = [];
    const tradeIndexesByToken = new Map<string, number[]>();
    for (const value of tradeData) {
      const trade = normalizeSetupMetricTrade(value);
      if (
        !trade ||
        !tradeTypes.has(getSetupTradeType(trade)) ||
        !isPnlContributingTrade(trade)
      ) {
        continue;
      }
      const pnl = calculateSetupTradePnl(toSetupTradePnlInput(trade));
      const outcome = classifyOutcome(pnl, trade);
      if (!isInScope(outcome, scope)) continue;
      const tradeIndex = trades.length;
      trades.push(trade);
      results.push({ pnl, outcome });
      for (const label of trade.setup) {
        const token = this.normalizeSetupToken(label);
        if (!token) continue;
        const indexes = tradeIndexesByToken.get(token);
        if (!indexes) {
          tradeIndexesByToken.set(token, [tradeIndex]);
        } else if (indexes[indexes.length - 1] !== tradeIndex) {
          indexes.push(tradeIndex);
        }
      }
    }

    const metricsBySetupId = new Map<string, SetupMetrics>();
    for (const setup of setups) {
      const matchingIndexes = new Set<number>();
      for (const ref of this.buildSetupRefs([setup.id, setup.name])) {
        for (const index of tradeIndexesByToken.get(ref) ?? []) {
          matchingIndexes.add(index);
        }
      }
      
      const setupIndexes = Array.from(matchingIndexes).sort((a, b) => a - b);
      const metrics = this.calculateMetricsForTrades(
        setupIndexes.map((index) => trades[index]),
        setupIndexes.map((index) => results[index])
      );
      metrics.shareOfTrades = trades.length
        ? (metrics.totalTrades / trades.length) * 100
        : 0;
      metricsBySetupId.set(setup.id, metrics);
    }
    return { metricsBySetupId, tradeCount: trades.length };
  }

  private calculateMetricsForTrades(
    trades: Trade[],
    tradeResults: TradeResult[]
  ): SetupMetrics {
    if (!trades.length) {
      return this.getEmptyMetrics();
    }

    const results = tradeResults.map(({ pnl }) => pnl);
    const winners = pnlsWithOutcome(tradeResults, 'win');
    const losers = pnlsWithOutcome(tradeResults, 'loss');

    const streaks = this.calculateStreaks(tradeResults);

    const baseMetrics = this.getEmptyMetrics();
    return {
      ...baseMetrics,
      totalTrades: trades.length,
      winRate:
        calculateWinRateExcludingBreakeven(winners.length, losers.length) * 100,
      totalPnL: results.reduce((sum, pnl) => sum + pnl, 0),
      avgWinner: winners.length
        ? winners.reduce((sum, pnl) => sum + pnl, 0) / winners.length
        : 0,
      avgLoser: losers.length
        ? losers.reduce((sum, pnl) => sum + pnl, 0) / losers.length
        : 0,
      winStreak: streaks.maxWin,
      loseStreak: streaks.maxLoss,
      currentStreak: streaks.current,
      ...this.calculateAdvancedMetrics(trades, results, winners, losers),
    };
  }

  private buildSetupRefs(setupTokens: string[]): Set<string> {
    return new Set(
      setupTokens.flatMap((ref) => {
        const normalizedRef = this.normalizeSetupToken(ref);
        return normalizedRef ? [normalizedRef] : [];
      })
    );
  }

  private normalizeSetupToken(value: string): string {
    return value
      .trim()
      .normalize('NFKC')
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, '');
  }

  
  private calculateStreaks(results: TradeResult[]): {
    maxWin: number;
    maxLoss: number;
    current: number;
  } {
    let currentStreak = 0;
    let maxWin = 0;
    let maxLoss = 0;

    results.forEach(({ outcome }) => {
      if (outcome === 'win') {
        if (currentStreak < 0) currentStreak = 0;
        currentStreak++;
        maxWin = Math.max(maxWin, currentStreak);
      } else if (outcome === 'loss') {
        if (currentStreak > 0) currentStreak = 0;
        currentStreak--;
        maxLoss = Math.min(maxLoss, currentStreak);
      }
    });

    return {
      maxWin,
      maxLoss: Math.abs(maxLoss),
      current: currentStreak,
    };
  }

  
  private getEmptyMetrics(): SetupMetrics {
    const now = new Date();
    return {
      
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

      
      lastTradeDate: now.toISOString(),
      tradingFrequency: 0,
      inactivityStreak: 0,
    };
  }

  
  private calculateAdvancedMetrics(
    trades: Trade[],
    results: number[],
    winningTrades: number[],
    losingTrades: number[]
  ): Partial<SetupMetrics> {
    if (!trades.length) return {};

    
    const durations = trades.flatMap((trade) => {
      const exit = new Date(trade.exitTime);
      const entry = new Date(trade.entryTime);
      const duration = (exit.getTime() - entry.getTime()) / 1000 / 60;
      return Number.isFinite(duration) ? [duration] : [];
    });

    const volumes = trades.map((t) => Math.abs(t.positionSize));
    const totalWinAmount = winningTrades.reduce((sum, pnl) => sum + pnl, 0);
    const totalLossAmount = Math.abs(
      losingTrades.reduce((sum, pnl) => sum + pnl, 0)
    );

    
    const tradeDates = trades.flatMap((trade) => {
      const date = new Date(trade.exitTime);
      return Number.isFinite(date.getTime()) ? [date] : [];
    });
    const fallbackMetrics = {
      expectedValue:
        results.reduce((sum, pnl) => sum + pnl, 0) / results.length,
      riskRewardRatio:
        Math.abs(
          winningTrades.length ? totalWinAmount / winningTrades.length : 0
        ) /
        Math.abs(
          losingTrades.length ? totalLossAmount / losingTrades.length : 1
        ),
      profitFactor: totalLossAmount
        ? totalWinAmount / totalLossAmount
        : totalWinAmount
          ? Infinity
          : 0,
      averageDuration: durations.length
        ? durations.reduce((sum, d) => sum + d, 0) / durations.length
        : 0,
      bestTrade: Math.max(...results),
      worstTrade: Math.min(...results),
      averageVolume: volumes.reduce((sum, v) => sum + v, 0) / volumes.length,
    };
    if (tradeDates.length === 0) return fallbackMetrics;
    const lastTradeDate = new Date(
      Math.max(...tradeDates.map((d) => d.getTime()))
    );
    const now = new Date();
    const inactivityStreak = Math.floor(
      (now.getTime() - lastTradeDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    
    const earliestDate = new Date(
      Math.min(...tradeDates.map((d) => d.getTime()))
    );
    const monthsSinceFirst =
      (now.getTime() - earliestDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44); 

    return {
      ...fallbackMetrics,
      lastTradeDate: lastTradeDate.toISOString(),
      tradingFrequency: trades.length / monthsSinceFirst,
      inactivityStreak,
    };
  }
}
