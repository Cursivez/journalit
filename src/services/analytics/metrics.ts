import type { DashboardData } from '../../components/dashboard/utils/dataUtils';
import { getMetricDefinition } from './metricRegistry';
import { calculateWinRateExcludingBreakeven } from '../../utils/breakEvenRange';
import { calculateProfitFactor } from '../../utils/profitFactor';
import type { AnalyticsMetricId, AnalyticsMetricValue } from './types';

type DashboardMetrics = DashboardData['metrics'];

export interface CoreTradeMetricInputs {
  netPnLValues: number[];
  winningNetPnL: number[];
  losingNetPnL: number[];
}

export interface CoreTradeMetrics {
  netPnL: number;
  winRate: number;
  profitFactor: number;
  expectancy: number;
  numTrades: number;
  numWinTrades: number;
  numLossTrades: number;
  avgWin: number;
  avgLoss: number;
  avgRR?: number;
}


export const calculateCoreTradeMetrics = ({
  netPnLValues,
  winningNetPnL,
  losingNetPnL,
}: CoreTradeMetricInputs): CoreTradeMetrics => {
  const netPnL = netPnLValues.reduce((sum, pnl) => sum + pnl, 0);
  const totalProfit = winningNetPnL.reduce((sum, pnl) => sum + pnl, 0);
  const totalLoss = Math.abs(losingNetPnL.reduce((sum, pnl) => sum + pnl, 0));
  const winRate = calculateWinRateExcludingBreakeven(
    winningNetPnL.length,
    losingNetPnL.length
  );
  const profitFactor = calculateProfitFactor(totalProfit, totalLoss);
  const avgWin =
    winningNetPnL.length > 0 ? totalProfit / winningNetPnL.length : 0;
  const avgLoss = losingNetPnL.length > 0 ? totalLoss / losingNetPnL.length : 0;

  return {
    netPnL,
    winRate,
    profitFactor,
    expectancy: winRate * avgWin - (1 - winRate) * avgLoss,
    numTrades: netPnLValues.length,
    numWinTrades: winningNetPnL.length,
    numLossTrades: losingNetPnL.length,
    avgWin,
    avgLoss,
    avgRR: avgWin > 0 && avgLoss > 0 ? avgWin / avgLoss : undefined,
  };
};

const getMetricNumber = (
  metrics: DashboardMetrics,
  metricId: AnalyticsMetricId
): number | undefined => {
  switch (metricId) {
    case 'net_pnl':
      return metrics.netPnL;
    case 'win_rate':
      return metrics.winRate;
    case 'profit_factor':
      return metrics.profitFactor;
    case 'expectancy':
      return metrics.expectancy;
    case 'trade_count':
      return metrics.numTrades;
    case 'win_count':
      return metrics.numWinTrades;
    case 'loss_count':
      return metrics.numLossTrades;
    case 'average_win':
      return metrics.avgWin;
    case 'average_loss':
      return metrics.avgLoss;
    case 'payoff_ratio':
      return metrics.avgRR;
    case 'sharpe_ratio':
      return metrics.sharpeRatio;
    case 'net_r':
      return metrics.netPnLR;
    case 'expectancy_r':
      return metrics.expectancyR;
    case 'average_win_r':
      return metrics.avgWinR;
    case 'average_loss_r':
      return metrics.avgLossR;
    case 'max_drawdown':
      return metrics.maxDrawdown;
    case 'best_day':
      return metrics.bestDay;
    case 'largest_win':
      return metrics.largestWin;
    case 'largest_loss':
      return metrics.largestLoss;
    default: {
      const exhaustive: never = metricId;
      return exhaustive;
    }
  }
};

const getSampleSize = (
  metrics: DashboardMetrics,
  metricId: AnalyticsMetricId
): number => {
  const definition = getMetricDefinition(metricId);
  switch (definition.sampleSize) {
    case 'all_contributing':
      return metrics.numTrades;
    case 'wins':
      return metrics.numWinTrades;
    case 'losses':
      return metrics.numLossTrades;
    case 'risk_valid':
      return metrics.riskBasedTradesCount ?? 0;
    case 'sharpe_observations':
      return metrics.sharpeRatioTradeCount ?? 0;
    default: {
      const exhaustive: never = definition.sampleSize;
      return exhaustive;
    }
  }
};

export const projectRegisteredMetric = (
  metrics: DashboardMetrics,
  metricId: AnalyticsMetricId,
  minimumSampleSize: number
): AnalyticsMetricValue => {
  const definition = getMetricDefinition(metricId);
  const sampleSize = getSampleSize(metrics, metricId);
  const value = getMetricNumber(metrics, metricId);

  
  
  if (sampleSize === 0 && definition.zeroSample === 'not_calculable') {
    return {
      status: 'unavailable',
      metricId,
      value: null,
      unit: definition.unit,
      sampleSize,
      reason: 'not_calculable',
    };
  }
  if (sampleSize < minimumSampleSize) {
    return {
      status: 'unavailable',
      metricId,
      value: null,
      unit: definition.unit,
      sampleSize,
      reason: 'insufficient_sample',
    };
  }
  if (value === undefined || !Number.isFinite(value)) {
    return {
      status: 'unavailable',
      metricId,
      value: null,
      unit: definition.unit,
      sampleSize,
      reason: 'not_calculable',
    };
  }
  return {
    status: 'available',
    metricId,
    value,
    unit: definition.unit,
    sampleSize,
  };
};
