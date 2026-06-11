

import { TradeService } from '../trade/TradeService';
import { normalizeTradeExecutionForAnalytics } from '../trade/core/TradeExecutionAnalytics';
import { SetupMetrics } from './types';
import { calculateWinRateExcludingBreakeven } from '../../utils/breakEvenRange';
import {
  getEffectivePnL,
  getResolvedWeightedAverageExitPrice,
  getWeightedAverageEntryPrice,
  isPnlContributingTrade,
} from '../../utils/tradeStatusUtils';
import { calculateDirectionalPriceDiff } from '../../utils/pnlCalculation';

export interface Trade {
  exitPrice: number;
  entryPrice: number;
  positionSize: number;
  setupIds: string[];
  setup?: string[];
  entryTime: string; 
  exitTime: string; 
  pnl?: number | null;
  tradeStatus?: 'OPEN' | 'CLOSED' | string;
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


export class SetupMetricsCalculator {
  constructor(private tradeService: TradeService) {}

  
  public async calculateMetrics(setupId: string): Promise<SetupMetrics> {
    const trades = await this.getSetupTrades(setupId);
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

  
  private async getSetupTrades(setupId: string): Promise<Trade[]> {
    if (typeof this.tradeService.getTradeData === 'function') {
      const tradeData = await this.tradeService.getTradeData();
      if (Array.isArray(tradeData)) {
        const trades = tradeData as Trade[];
        return trades.filter((trade) => {
          const setupIds = Array.isArray(trade.setupIds)
            ? trade.setupIds
            : Array.isArray(trade.setup)
              ? trade.setup
              : [];
          return (
            setupIds.includes(setupId) && isPnlContributingTrade(trade as any)
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
            return trade.setupIds.includes(setupId) ? trade : null;
          } catch {
            console.warn(`Invalid trade file: ${file.path}`);
            return null;
          }
        })
      )
    ).filter((trade): trade is Trade => trade !== null);
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

    
    const durations = trades.map((trade) => {
      const exit = new Date(trade.exitTime);
      const entry = new Date(trade.entryTime);
      return (exit.getTime() - entry.getTime()) / 1000 / 60; 
    });

    const volumes = trades.map((t) => Math.abs(t.positionSize));
    const totalWinAmount = winningTrades.reduce((sum, pnl) => sum + pnl, 0);
    const totalLossAmount = Math.abs(
      losingTrades.reduce((sum, pnl) => sum + pnl, 0)
    );

    
    const tradeDates = trades.map((t) => new Date(t.exitTime));
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
      averageDuration:
        durations.reduce((sum, d) => sum + d, 0) / durations.length,
      bestTrade: Math.max(...results),
      worstTrade: Math.min(...results),
      averageVolume: volumes.reduce((sum, v) => sum + v, 0) / volumes.length,
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
          
          if (key === 'setupIds') {
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
      {} as Record<string, any>
    );

    const normalizedExecution = normalizeTradeExecutionForAnalytics({
      ...frontmatter,
      direction: frontmatter.direction || 'long',
    });

    return {
      exitPrice: normalizedExecution.exitPrice,
      entryPrice: normalizedExecution.entryPrice,
      positionSize: normalizedExecution.positionSize,
      setupIds: frontmatter.setupIds || [],
      entryTime: normalizedExecution.entryTime.toISOString(),
      exitTime: normalizedExecution.exitTime.toISOString(),
      direction: frontmatter.direction || 'long',
      assetType: frontmatter.assetType,
    };
  }
}
