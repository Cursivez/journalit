

import { TradeService } from '../trade/TradeService';
import { Setup, SetupMetrics } from './types';
import { calculateWinRateExcludingBreakeven } from '../../utils/breakEvenRange';
import { isPnlContributingTrade } from '../../utils/tradeStatusUtils';
import { inferStoredTradeType } from '../../utils/tradeTypeRouting';
import { calculateSetupTradePnl, toSetupTradePnlInput } from './setupTradePnl';

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

export interface Trade extends Record<string, unknown> {
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


export class SetupMetricsCalculator {
  constructor(private tradeService: TradeService) {}

  
  public async calculateMetrics(setupId: string): Promise<SetupMetrics> {
    const trades = await this.getSetupTrades([setupId]);
    return this.calculateMetricsForTrades(trades);
  }

  public async calculateMetricsForSetup(setup: Setup): Promise<SetupMetrics> {
    const setupLabels = [setup.id, setup.name];
    const trades = await this.getSetupTrades(setupLabels);
    return this.calculateMetricsForTrades(trades);
  }

  public calculateMetricsForSetupFromTradeData(
    setup: Setup,
    tradeData: Array<Record<string, unknown>>
  ): SetupMetrics {
    const trades = this.filterSetupTrades(
      tradeData,
      this.buildSetupRefs([setup.id, setup.name])
    );
    return this.calculateMetricsForTrades(trades);
  }

  private calculateMetricsForTrades(trades: Trade[]): SetupMetrics {
    if (!trades.length) {
      return this.getEmptyMetrics();
    }

    const results = trades.map((trade) =>
      calculateSetupTradePnl(toSetupTradePnlInput(trade))
    );
    const winners = results.filter((r) => r > 0);
    const losers = results.filter((r) => r < 0);

    const streaks = this.calculateStreaks(results);

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
      ...this.calculateAdvancedMetrics(trades, results),
    };
  }

  
  private async getSetupTrades(setupTokens: string[]): Promise<Trade[]> {
    const tradeData = await this.tradeService.getTradeData();
    return this.filterSetupTrades(tradeData, this.buildSetupRefs(setupTokens));
  }

  private buildSetupRefs(setupTokens: string[]): Set<string> {
    return new Set(
      setupTokens.flatMap((ref) => {
        const normalizedRef = this.normalizeSetupToken(ref);
        return normalizedRef ? [normalizedRef] : [];
      })
    );
  }

  private filterSetupTrades(
    tradeData: Array<Record<string, unknown>>,
    normalizedSetupRefs: Set<string>
  ): Trade[] {
    const trades = tradeData.flatMap((trade) => {
      const normalizedTrade = normalizeSetupMetricTrade(trade);
      return normalizedTrade ? [normalizedTrade] : [];
    });
    return trades.filter(
      (trade) =>
        this.isRegularTrade(trade) &&
        this.tradeMatchesSetup(trade, normalizedSetupRefs) &&
        isPnlContributingTrade(trade)
    );
  }

  private tradeMatchesSetup(
    trade: Trade,
    normalizedSetupRefs: Set<string>
  ): boolean {
    return trade.setup.some((label) =>
      normalizedSetupRefs.has(this.normalizeSetupToken(label))
    );
  }

  private isRegularTrade(trade: Trade): boolean {
    return (
      inferStoredTradeType({
        filePath: trade.path,
        type: trade.type,
        isMissedTrade: trade.isMissedTrade,
        isBacktestTrade: trade.isBacktestTrade,
      }) === 'regular'
    );
  }

  private normalizeSetupToken(value: string): string {
    return value
      .trim()
      .normalize('NFKC')
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, '');
  }

  
  private calculateStreaks(results: number[]): {
    maxWin: number;
    maxLoss: number;
    current: number;
  } {
    let currentStreak = 0;
    let maxWin = 0;
    let maxLoss = 0;

    results.forEach((pnl) => {
      if (pnl > 0) {
        if (currentStreak < 0) currentStreak = 0;
        currentStreak++;
        maxWin = Math.max(maxWin, currentStreak);
      } else if (pnl < 0) {
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
    results: number[]
  ): Partial<SetupMetrics> {
    if (!trades.length) return {};

    const winningTrades = results.filter((r) => r > 0);
    const losingTrades = results.filter((r) => r < 0);

    
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
