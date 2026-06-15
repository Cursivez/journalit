

import {
  AccountMetrics,
  DEFAULT_ACCOUNT_METRICS,
  TransactionType,
  AccountData,
} from './types';
import { TradeService } from '../trade/TradeService';
import { calculateWinRateExcludingBreakeven } from '../../utils/breakEvenRange';

interface AccountMetricTrade {
  account?: string[];
  pnl?: number | string | null;
  rMultiple?: number | null;
}

function asAccountMetricTrades(value: unknown): AccountMetricTrade[] {
  return Array.isArray(value)
    ? value.filter((item): item is AccountMetricTrade =>
        Boolean(item && typeof item === 'object' && !Array.isArray(item))
      )
    : [];
}

function getTradePnl(trade: AccountMetricTrade): number {
  return typeof trade.pnl === 'string'
    ? parseFloat(trade.pnl)
    : Number(trade.pnl) || 0;
}


const accountMetricsCache = new Map<string, AccountMetrics>();

const MAX_CACHE_SIZE = 20;


export function clearAccountMetricsCache(accountIdOrName?: string): void {
  if (accountIdOrName) {
    
    const keysToDelete: string[] = [];
    accountMetricsCache.forEach((_, key) => {
      if (key.startsWith(`${accountIdOrName}:`)) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach((key) => accountMetricsCache.delete(key));
  } else {
    
    accountMetricsCache.clear();
  }
}


const ensureCacheSize = () => {
  if (accountMetricsCache.size > MAX_CACHE_SIZE) {
    
    const firstKey = Array.from(accountMetricsCache.keys())[0];
    if (firstKey !== undefined) {
      accountMetricsCache.delete(firstKey);
    }
  }
};


export async function calculateAccountMetrics(
  accountIdOrName: string,
  tradeService: TradeService,
  accountData?: AccountData
): Promise<AccountMetrics> {
  try {
    
    const cacheKey = `${accountIdOrName}:${Date.now() - (Date.now() % (5 * 60 * 1000))}`; 
    if (accountMetricsCache.has(cacheKey)) {
      return accountMetricsCache.get(cacheKey)!;
    }

    
    const allTrades = asAccountMetricTrades(await tradeService.getTradeData());

    
    if (!Array.isArray(allTrades)) {
      console.error(
        'Error calculating account metrics: allTrades is not an array:',
        allTrades
      );
      return { ...DEFAULT_ACCOUNT_METRICS };
    }

    
    
    
    const searchName = accountIdOrName;
    const searchId = accountIdOrName;

    
    const accountTrades = allTrades.filter((trade) => {
      const tradeAccounts = Array.isArray(trade.account)
        ? trade.account.filter(
            (account): account is string => typeof account === 'string'
          )
        : [];

      
      if (tradeAccounts.includes(searchId)) {
        return true;
      }

      
      if (tradeAccounts.includes(searchName)) {
        return true;
      }

      
      return tradeAccounts.some(
        (acc) =>
          typeof acc === 'string' &&
          acc.toLowerCase() === searchName.toLowerCase()
      );
    });

    
    if (accountTrades.length === 0) {
      return { ...DEFAULT_ACCOUNT_METRICS };
    }

    
    let winningTrades = 0;
    let losingTrades = 0;
    let breakEvenTrades = 0;
    let totalPnL = 0;
    let totalWinAmount = 0;
    let totalLossAmount = 0;
    let bestTrade = -Infinity;
    let worstTrade = Infinity;

    
    let maxDrawdown = 0;
    let peakBalance = 0;
    let currentBalance = 0;

    
    accountTrades.forEach((trade) => {
      
      const pnl = getTradePnl(trade);

      
      totalPnL += pnl;

      
      if (pnl > 0) {
        winningTrades++;
        totalWinAmount += pnl;
        bestTrade = Math.max(bestTrade, pnl);
      } else if (pnl < 0) {
        losingTrades++;
        totalLossAmount += Math.abs(pnl);
        worstTrade = Math.min(worstTrade, pnl);
      } else {
        breakEvenTrades++;
      }

      
      if (isNaN(pnl)) {
        console.error('Invalid PnL encountered in trade:', trade);
      }

      
      currentBalance += pnl;
      if (currentBalance > peakBalance) {
        peakBalance = currentBalance;
      }
      const currentDrawdown = peakBalance - currentBalance;

      
      if (!isNaN(currentDrawdown) && isFinite(currentDrawdown)) {
        maxDrawdown = Math.max(maxDrawdown, currentDrawdown);
      } else {
        console.error('Invalid drawdown calculation:', {
          peakBalance,
          currentBalance,
          currentDrawdown,
          pnl,
        });
      }
    });

    
    const totalTrades = accountTrades.length;
    const winRate =
      calculateWinRateExcludingBreakeven(winningTrades, losingTrades) * 100;

    
    let profitFactor = 0;
    if (totalLossAmount > 0) {
      profitFactor = totalWinAmount / totalLossAmount;
    } else if (totalWinAmount > 0) {
      profitFactor = 999; 
    }

    
    if (isNaN(profitFactor) || !isFinite(profitFactor)) {
      console.error(
        'Invalid profit factor calculated:',
        profitFactor,
        'totalWinAmount:',
        totalWinAmount,
        'totalLossAmount:',
        totalLossAmount
      );
      profitFactor = 0;
    }

    
    const averageWin = winningTrades > 0 ? totalWinAmount / winningTrades : 0;
    const averageLoss = losingTrades > 0 ? totalLossAmount / losingTrades : 0;

    
    const winningTradesWithR = accountTrades.filter(
      (t) => getTradePnl(t) > 0 && t.rMultiple !== undefined
    );
    const avgWinRMultiple =
      winningTradesWithR.length > 0
        ? winningTradesWithR.reduce((sum, t) => sum + (t.rMultiple ?? 0), 0) /
          winningTradesWithR.length
        : undefined;

    const losingTradesWithR = accountTrades.filter(
      (t) => getTradePnl(t) < 0 && t.rMultiple !== undefined
    );
    const avgLossRMultiple =
      losingTradesWithR.length > 0
        ? losingTradesWithR.reduce(
            (sum, t) => sum + Math.abs(t.rMultiple ?? 0),
            0
          ) / losingTradesWithR.length
        : undefined;

    
    if (bestTrade === -Infinity) bestTrade = 0;
    if (worstTrade === Infinity) worstTrade = 0;

    
    let totalWithdrawals = 0;
    if (accountData && accountData.transactions) {
      totalWithdrawals = accountData.transactions
        .filter(
          (t) =>
            t.type === TransactionType.WITHDRAWAL ||
            (t.type === TransactionType.DEPOSIT && t.amount < 0)
        )
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    }

    
    const metrics = {
      totalTrades,
      winningTrades,
      losingTrades,
      breakEvenTrades,
      winRate,
      totalPnL,
      bestTrade,
      worstTrade,
      profitFactor,
      averageWin,
      averageLoss,
      avgWinRMultiple,
      avgLossRMultiple,
      maxDrawdown,
      totalWithdrawals,
    };

    
    accountMetricsCache.set(cacheKey, metrics);
    ensureCacheSize();

    
    return metrics;
  } catch (error) {
    console.error('Error calculating account metrics:', error);
    return { ...DEFAULT_ACCOUNT_METRICS };
  }
}
