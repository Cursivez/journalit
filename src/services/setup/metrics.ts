

import { TradeService } from '../trade/TradeService';
import { normalizeTradeExecutionForAnalytics } from '../trade/core/TradeExecutionAnalytics';
import { Setup, SetupMetrics } from './types';
import { calculateWinRateExcludingBreakeven } from '../../utils/breakEvenRange';
import {
  getEffectivePnL,
  getResolvedWeightedAverageExitPrice,
  getWeightedAverageEntryPrice,
  isPnlContributingTrade,
} from '../../utils/tradeStatusUtils';
import { calculateDirectionalPriceDiff } from '../../utils/pnlCalculation';
import { inferStoredTradeType } from '../../utils/tradeTypeRouting';

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
    const normalizedSetupRefs = new Set(
      [setup.id, setup.name].flatMap((ref) => {
        const normalizedRef = this.normalizeSetupToken(ref);
        return normalizedRef ? [normalizedRef] : [];
      })
    );
    const trades = tradeData.flatMap((trade) => {
      const normalizedTrade = normalizeSetupMetricTrade(trade);
      if (
        !normalizedTrade ||
        !this.isRegularTrade(normalizedTrade) ||
        !this.tradeMatchesSetup(normalizedTrade, normalizedSetupRefs) ||
        !isPnlContributingTrade(normalizedTrade)
      ) {
        return [];
      }
      return [normalizedTrade];
    });
    return this.calculateMetricsForTrades(trades);
  }

  private calculateMetricsForTrades(trades: Trade[]): SetupMetrics {
    if (!trades.length) {
      return this.getEmptyMetrics();
    }

    const results = trades.map((trade) => this.calculateTradePnL(trade));
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
    const normalizedSetupRefs = new Set(
      setupTokens.flatMap((ref) => {
        const normalizedRef = this.normalizeSetupToken(ref);
        return normalizedRef ? [normalizedRef] : [];
      })
    );
    if (typeof this.tradeService.getTradeData === 'function') {
      const tradeData = await this.tradeService.getTradeData();
      if (Array.isArray(tradeData)) {
        const trades = tradeData.flatMap((trade) => {
          const normalizedTrade = normalizeSetupMetricTrade(trade);
          return normalizedTrade ? [normalizedTrade] : [];
        });
        return trades.filter((trade) => {
          return (
            this.isRegularTrade(trade) &&
            this.tradeMatchesSetup(trade, normalizedSetupRefs) &&
            isPnlContributingTrade(trade)
          );
        });
      }
    }

    
    const trades = await this.tradeService.getTrades(new Date(0), new Date());

    return (
      await Promise.all(
        trades.map(async (file) => {
          try {
            const content = await this.tradeService.readTradeContent(file);
            const trade = this.parseTrade(content);
            return this.isRegularTrade(trade) &&
              this.tradeMatchesSetup(trade, normalizedSetupRefs)
              ? trade
              : null;
          } catch {
            console.warn(`Invalid trade file: ${file.path}`);
            return null;
          }
        })
      )
    ).filter((trade): trade is Trade => trade !== null);
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

  
  private calculateTradePnL(trade: Trade): number {
    const hasStoredOrDirectPnL =
      (trade.pnl !== undefined &&
        trade.pnl !== null &&
        Number.isFinite(trade.pnl)) ||
      (trade.useDirectPnLInput === true &&
        trade.directPnL !== undefined &&
        trade.directPnL !== null);

    if (hasStoredOrDirectPnL) {
      return getEffectivePnL(trade);
    }

    const entryPrice = getWeightedAverageEntryPrice(trade);
    const exitPrice = getResolvedWeightedAverageExitPrice(trade);
    const priceDiff = calculateDirectionalPriceDiff(
      {
        assetType: trade.assetType,
        
        
        direction: trade.direction || 'long',
      },
      entryPrice,
      exitPrice
    );

    return priceDiff === null ? 0 : priceDiff * trade.positionSize;
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

  
  private parseTrade(content: string): Trade {
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (!match) throw new Error('Invalid trade file format');

    const frontmatter = match[1].split('\n').reduce(
      (acc, line) => {
        const [key, ...values] = line.split(':').map((s) => s.trim());
        if (key && values.length) {
          
          if (key === 'setup') {
            acc[key] = values
              .join(':')
              .replace(/[[\]]/g, '')
              .split(',')
              .map((s) => s.trim());
          } else {
            acc[key] = values.join(':');
          }
        }
        return acc;
      },
      {} as Record<string, unknown>
    );

    const normalizedExecution = normalizeTradeExecutionForAnalytics({
      ...frontmatter,
      direction:
        typeof frontmatter.direction === 'string'
          ? frontmatter.direction
          : 'long',
    });

    return {
      exitPrice: normalizedExecution.exitPrice,
      entryPrice: normalizedExecution.entryPrice,
      positionSize: normalizedExecution.positionSize,
      setup: Array.isArray(frontmatter.setup)
        ? frontmatter.setup.filter(
            (item): item is string => typeof item === 'string'
          )
        : [],
      entryTime: normalizedExecution.entryTime.toISOString(),
      exitTime: normalizedExecution.exitTime.toISOString(),
      direction:
        typeof frontmatter.direction === 'string'
          ? frontmatter.direction
          : 'long',
      assetType:
        typeof frontmatter.assetType === 'string'
          ? frontmatter.assetType
          : undefined,
      type: frontmatter.type,
      isMissedTrade: frontmatter.isMissedTrade === 'true',
      isBacktestTrade: frontmatter.isBacktestTrade === 'true',
    };
  }
}
