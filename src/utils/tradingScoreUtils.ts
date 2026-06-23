

import { Trade } from '../components/dashboard/utils/dataUtils';
import { getEffectivePnL, isPnlContributingTrade } from './tradeStatusUtils';
import { t } from '../lang/helpers';
import { calculateWinRateExcludingBreakeven } from './breakEvenRange';
import { calculateEffectiveRMultiple } from './formatting';
import { analyzeDrawdown } from './drawdownAnalytics';





export interface AxisScores {
  profitability: number;
  riskManagement: number;
  execution: number;
  consistency: number;
  returnConsistency: number;
  experience: number;
}

interface AxisBreakdown {
  profitability: {
    profitFactor: number;
    profitFactorScore: number;
    expectancy: number;
    expectancyScore: number;
  };
  riskManagement: {
    maxDrawdown: number;
    maxDrawdownR: number | null;
    maxDrawdownScore: number;
    recoveryFactor: number;
    recoveryFactorR: number | null;
    recoveryFactorScore: number;
  };
  execution: {
    winRate: number;
    winRateScore: number;
    avgWinLossRatio: number;
    avgWinLossRatioScore: number;
  };
  consistency: {
    returnStabilityCV: number;
    returnStabilityScore: number;
    streakRatio: number;
    streakStabilityScore: number;
  };
  returnConsistency: {
    rPlusCV: number;
    rPlusScore: number;
    rMinusCV: number;
    rMinusScore: number;
  };
  experience: {
    activeWeeks: number;
    totalWeeks: number;
    consistencyRatio: number;
    score: number;
  };
}

export interface TradingScoreResult {
  compositeScore: number;
  axisScores: AxisScores;
  breakdown: AxisBreakdown;
  phase: 'insufficient' | 'developing' | 'established';
  phaseWeeks: number;
  tradeCount: number;
}

type TradingScoreDrawdownTrade = Trade & {
  pnl: number;
  hasEffectiveRMultiple: boolean;
};

interface ScoreLabel {
  label: string;
  color: string;
}





export const AXIS_WEIGHTS = {
  profitability: 0.2,
  riskManagement: 0.25,
  execution: 0.15,
  consistency: 0.15,
  returnConsistency: 0.1,
  experience: 0.15,
} as const;






function scoreProfitFactor(profitFactor: number): number {
  if (!isFinite(profitFactor) || profitFactor < 0) return 0;

  if (profitFactor < 0.75) {
    return Math.max(0, (profitFactor / 0.75) * 20);
  }
  if (profitFactor < 1.0) {
    return 20 + ((profitFactor - 0.75) / 0.25) * 20;
  }
  if (profitFactor < 1.25) {
    return 40 + ((profitFactor - 1.0) / 0.25) * 15;
  }
  if (profitFactor < 1.5) {
    return 55 + ((profitFactor - 1.25) / 0.25) * 15;
  }
  if (profitFactor < 2.0) {
    return 70 + ((profitFactor - 1.5) / 0.5) * 15;
  }
  if (profitFactor < 3.0) {
    return 85 + ((profitFactor - 2.0) / 1.0) * 10;
  }
  return 95 + Math.min(5, ((profitFactor - 3.0) / 2.0) * 5);
}


function scoreExpectancy(
  expectancy: number,
  isRBased: boolean = false
): number {
  if (!isFinite(expectancy)) return 0;

  
  if (isRBased) {
    if (expectancy < 0) {
      return Math.max(0, 30 + expectancy * 10); 
    }
    if (expectancy < 0.25) {
      return 30 + (expectancy / 0.25) * 20;
    }
    if (expectancy < 0.5) {
      return 50 + ((expectancy - 0.25) / 0.25) * 20;
    }
    if (expectancy < 1.0) {
      return 70 + ((expectancy - 0.5) / 0.5) * 15;
    }
    return 85 + Math.min(15, ((expectancy - 1.0) / 1.0) * 15);
  }

  
  if (expectancy < 0) {
    return Math.max(0, 30); 
  }
  if (expectancy === 0) {
    return 40; 
  }
  
  return Math.min(100, 50 + Math.log10(1 + expectancy) * 20);
}


function scoreMaxDrawdownR(maxDrawdownR: number): number {
  if (!isFinite(maxDrawdownR) || maxDrawdownR <= 0) return 100;

  if (maxDrawdownR > 10) {
    return Math.max(0, 20 - (maxDrawdownR - 10) * 2);
  }
  if (maxDrawdownR > 6) {
    return 20 + ((10 - maxDrawdownR) / 4) * 25;
  }
  if (maxDrawdownR > 4) {
    return 45 + ((6 - maxDrawdownR) / 2) * 20;
  }
  if (maxDrawdownR > 2) {
    return 65 + ((4 - maxDrawdownR) / 2) * 20;
  }
  if (maxDrawdownR > 1) {
    return 85 + (2 - maxDrawdownR) * 10;
  }
  return 95 + Math.min(5, 1 - maxDrawdownR);
}


function scoreRecoveryFactor(recoveryFactor: number): number {
  if (!isFinite(recoveryFactor) || recoveryFactor < 0) return 0;

  if (recoveryFactor < 1.0) {
    return (recoveryFactor / 1.0) * 40;
  }
  if (recoveryFactor < 2.0) {
    return 40 + ((recoveryFactor - 1.0) / 1.0) * 20;
  }
  if (recoveryFactor < 3.0) {
    return 60 + ((recoveryFactor - 2.0) / 1.0) * 15;
  }
  if (recoveryFactor < 5.0) {
    return 75 + ((recoveryFactor - 3.0) / 2.0) * 15;
  }
  return 90 + Math.min(10, ((recoveryFactor - 5.0) / 5.0) * 10);
}


function scoreWinRate(winRate: number): number {
  if (!isFinite(winRate) || winRate < 0) return 0;

  if (winRate < 0.3) {
    return 20 + (winRate / 0.3) * 20;
  }
  if (winRate < 0.4) {
    return 40 + ((winRate - 0.3) / 0.1) * 15;
  }
  if (winRate < 0.5) {
    return 55 + ((winRate - 0.4) / 0.1) * 15;
  }
  if (winRate < 0.6) {
    return 70 + ((winRate - 0.5) / 0.1) * 15;
  }
  if (winRate < 0.7) {
    return 85 + ((winRate - 0.6) / 0.1) * 10;
  }
  return 95 + Math.min(5, ((winRate - 0.7) / 0.3) * 5);
}


function scoreWinLossRatio(ratio: number): number {
  if (!isFinite(ratio) || ratio < 0) return 0;

  if (ratio < 0.5) {
    return (ratio / 0.5) * 20;
  }
  if (ratio < 0.75) {
    return 20 + ((ratio - 0.5) / 0.25) * 20;
  }
  if (ratio < 1.0) {
    return 40 + ((ratio - 0.75) / 0.25) * 15;
  }
  if (ratio < 1.5) {
    return 55 + ((ratio - 1.0) / 0.5) * 15;
  }
  if (ratio < 2.0) {
    return 70 + ((ratio - 1.5) / 0.5) * 15;
  }
  if (ratio < 3.0) {
    return 85 + ((ratio - 2.0) / 1.0) * 10;
  }
  return 95 + Math.min(5, ((ratio - 3.0) / 2.0) * 5);
}


function scoreReturnStability(cv: number): number {
  if (!isFinite(cv) || cv < 0) return 50; 

  if (cv > 3.0) {
    return Math.max(0, 30 - (cv - 3.0) * 10);
  }
  if (cv > 2.0) {
    return 30 + ((3.0 - cv) / 1.0) * 20;
  }
  if (cv > 1.5) {
    return 50 + ((2.0 - cv) / 0.5) * 15;
  }
  if (cv > 1.0) {
    return 65 + ((1.5 - cv) / 0.5) * 15;
  }
  if (cv > 0.5) {
    return 80 + ((1.0 - cv) / 0.5) * 10;
  }
  return 90 + Math.min(10, ((0.5 - cv) / 0.5) * 10);
}


function scoreStreakStability(
  maxLosingStreak: number,
  avgStreak: number
): number {
  if (avgStreak <= 0 || maxLosingStreak <= 0) return 70; 

  const ratio = maxLosingStreak / avgStreak;

  if (ratio > 5) return 20;
  if (ratio > 4) return 40;
  if (ratio > 3) return 55;
  if (ratio > 2) return 70;
  if (ratio > 1.5) return 85;
  return 95;
}


function scoreReturnConsistencyCV(cv: number): number {
  if (!isFinite(cv) || cv < 0) return 50; 

  if (cv > 1.5) {
    return Math.max(20, 30 - (cv - 1.5) * 10);
  }
  if (cv > 1.0) {
    return 30 + ((1.5 - cv) / 0.5) * 20;
  }
  if (cv > 0.75) {
    return 50 + ((1.0 - cv) / 0.25) * 15;
  }
  if (cv > 0.5) {
    return 65 + ((0.75 - cv) / 0.25) * 15;
  }
  return 80 + Math.min(20, ((0.5 - cv) / 0.5) * 20);
}


function scoreExperience(
  activeWeeks: number,
  totalWeeks: number
): { score: number; phase: 'insufficient' | 'developing' | 'established' } {
  if (activeWeeks < 4) {
    return { score: Math.max(10, activeWeeks * 2.5), phase: 'insufficient' };
  }

  const consistencyRatio = totalWeeks > 0 ? activeWeeks / totalWeeks : 0;

  
  let baseScore: number;
  let phase: 'developing' | 'established';

  if (activeWeeks < 12) {
    
    baseScore = 40 + ((activeWeeks - 4) / 8) * 30;
    phase = 'developing';
  } else if (activeWeeks < 24) {
    
    baseScore = 70 + ((activeWeeks - 12) / 12) * 22;
    phase = 'established';
  } else {
    
    baseScore = 92 + Math.min(8, ((activeWeeks - 24) / 24) * 8);
    phase = 'established';
  }

  
  let consistencyMultiplier = 1.0;
  if (consistencyRatio < 0.5) {
    consistencyMultiplier = 0.7;
  } else if (consistencyRatio < 0.75) {
    consistencyMultiplier = 0.85;
  }

  return {
    score: Math.round(baseScore * consistencyMultiplier),
    phase,
  };
}






function calculateCV(values: number[]): number {
  if (values.length < 2) return 0;

  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  if (mean === 0) return 0;

  const squaredDiffs = values.map((v) => Math.pow(v - mean, 2));
  const variance = squaredDiffs.reduce((sum, v) => sum + v, 0) / values.length;
  const stdDev = Math.sqrt(variance);

  return Math.abs(stdDev / mean);
}


function calculateStreakStats(trades: Trade[]): {
  maxLosingStreak: number;
  avgStreak: number;
} {
  if (trades.length === 0) return { maxLosingStreak: 0, avgStreak: 0 };

  let currentStreak = 0;
  let currentType: 'win' | 'loss' | null = null;
  let maxLosingStreak = 0;
  const streaks: number[] = [];

  
  const sortedTrades = [...trades].sort(
    (a, b) => new Date(a.entryTime).getTime() - new Date(b.entryTime).getTime()
  );

  for (const trade of sortedTrades) {
    const isWin = getEffectivePnL(trade) > 0;
    const type = isWin ? 'win' : 'loss';

    if (type === currentType) {
      currentStreak++;
    } else {
      if (currentStreak > 0) {
        streaks.push(currentStreak);
        if (currentType === 'loss') {
          maxLosingStreak = Math.max(maxLosingStreak, currentStreak);
        }
      }
      currentStreak = 1;
      currentType = type;
    }
  }

  
  if (currentStreak > 0) {
    streaks.push(currentStreak);
    if (currentType === 'loss') {
      maxLosingStreak = Math.max(maxLosingStreak, currentStreak);
    }
  }

  const avgStreak =
    streaks.length > 0
      ? streaks.reduce((sum, s) => sum + s, 0) / streaks.length
      : 1;

  return { maxLosingStreak, avgStreak };
}


function calculateTradingWeeks(trades: Trade[]): {
  activeWeeks: number;
  totalWeeks: number;
} {
  if (trades.length === 0) return { activeWeeks: 0, totalWeeks: 0 };

  
  const entryTimes = trades.map((t) => new Date(t.entryTime).getTime());
  const minTime = Math.min(...entryTimes);
  const maxTime = Math.max(...entryTimes);

  
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  const totalWeeks = Math.max(1, Math.ceil((maxTime - minTime) / msPerWeek));

  
  const weekSet = new Set<string>();
  for (const trade of trades) {
    const date = new Date(trade.entryTime);
    
    const thursday = new Date(date);
    thursday.setDate(date.getDate() + 4 - (date.getDay() || 7));
    const yearStart = new Date(thursday.getFullYear(), 0, 1);
    const weekNum = Math.ceil(
      ((thursday.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
    );
    weekSet.add(`${thursday.getFullYear()}-W${weekNum}`);
  }

  return { activeWeeks: weekSet.size, totalWeeks };
}

function hasCompleteRDataForMaxDrawdownEpisode(
  drawdownAnalytics: ReturnType<
    typeof analyzeDrawdown<TradingScoreDrawdownTrade>
  >
): boolean {
  const { summary, episodes, points } = drawdownAnalytics;

  if (summary.maxDrawdownAmount <= 0) {
    return true;
  }

  const maxDrawdownEpisodes = episodes.filter(
    (episode) => episode.maxDrawdownAmount === summary.maxDrawdownAmount
  );

  if (maxDrawdownEpisodes.length === 0) {
    return false;
  }

  return maxDrawdownEpisodes.every((episode) =>
    points
      .slice(episode.startPoint.tradeIndex, episode.troughPoint.tradeIndex + 1)
      .every((point) => point.trade.hasEffectiveRMultiple)
  );
}

function calculateTradingScoreEffectiveRMultiple(
  trade: Trade
): number | undefined {
  const pnl = getEffectivePnL(trade);

  if (pnl === 0) {
    return 0;
  }

  return calculateEffectiveRMultiple(
    pnl,
    trade.rMultiple,
    trade.riskAmount,
    undefined
  );
}






export function calculateTradingScore(trades: Trade[]): TradingScoreResult {
  const closedTrades = trades.filter((t) => isPnlContributingTrade(t));

  const tradeCount = closedTrades.length;

  
  const { activeWeeks, totalWeeks } = calculateTradingWeeks(closedTrades);
  const consistencyRatio = totalWeeks > 0 ? activeWeeks / totalWeeks : 0;

  
  const experienceResult = scoreExperience(activeWeeks, totalWeeks);
  const phase = experienceResult.phase;

  
  if (tradeCount < 5 || activeWeeks < 4) {
    return {
      compositeScore: 0,
      axisScores: {
        profitability: 0,
        riskManagement: 0,
        execution: 0,
        consistency: 0,
        returnConsistency: 0,
        experience: experienceResult.score,
      },
      breakdown: createEmptyBreakdown(
        activeWeeks,
        totalWeeks,
        consistencyRatio,
        experienceResult.score
      ),
      phase: 'insufficient',
      phaseWeeks: activeWeeks,
      tradeCount,
    };
  }

  
  const winners = closedTrades.filter((t) => getEffectivePnL(t) > 0);
  const losers = closedTrades.filter((t) => getEffectivePnL(t) < 0);

  
  const totalPnL = closedTrades.reduce((sum, t) => sum + getEffectivePnL(t), 0);
  const grossProfit = winners.reduce((sum, t) => sum + getEffectivePnL(t), 0);
  const grossLoss = Math.abs(
    losers.reduce((sum, t) => sum + getEffectivePnL(t), 0)
  );

  const profitFactor =
    grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? 999 : 0;
  const winRate = calculateWinRateExcludingBreakeven(
    winners.length,
    losers.length
  );
  const avgWin = winners.length > 0 ? grossProfit / winners.length : 0;
  const avgLoss = losers.length > 0 ? grossLoss / losers.length : 0;
  const avgWinLossRatio = avgLoss > 0 ? avgWin / avgLoss : avgWin > 0 ? 999 : 0;

  
  const expectancy = tradeCount > 0 ? totalPnL / tradeCount : 0;

  
  const tradesWithR = closedTrades.flatMap((trade) => {
    const effectiveR = calculateTradingScoreEffectiveRMultiple(trade);
    return effectiveR === undefined ? [] : [{ trade, effectiveR }];
  });
  const hasRData = tradesWithR.length > tradeCount * 0.5; 
  const hasCompleteRData = tradesWithR.length === tradeCount;
  let expectancyR = 0;
  let totalR: number | null = null;
  if (hasRData) {
    totalR = tradesWithR.reduce((sum, item) => sum + item.effectiveR, 0);
    expectancyR = totalR / tradesWithR.length;
  }

  
  
  
  const drawdownTrades: TradingScoreDrawdownTrade[] = closedTrades.map(
    (trade) => {
      const pnl = getEffectivePnL(trade);
      return {
        ...trade,
        pnl,
        hasEffectiveRMultiple:
          calculateTradingScoreEffectiveRMultiple(trade) !== undefined,
      };
    }
  );
  const drawdownAnalytics = analyzeDrawdown(drawdownTrades, {
    assumeClosedTrades: true,
  });
  const maxDrawdown = drawdownAnalytics.summary.maxDrawdownAmount;
  const hasCompleteRDrawdown =
    hasCompleteRDataForMaxDrawdownEpisode(drawdownAnalytics);
  const useRBasedRisk = hasCompleteRData && hasCompleteRDrawdown;
  const maxDrawdownR = useRBasedRisk
    ? drawdownAnalytics.summary.maxDrawdownR
    : null;

  
  const amountRecoveryFactor =
    maxDrawdown > 0 ? totalPnL / maxDrawdown : totalPnL > 0 ? 999 : 0;
  const recoveryFactorR =
    useRBasedRisk && totalR != null && maxDrawdownR != null
      ? maxDrawdownR > 0
        ? totalR / maxDrawdownR
        : totalR > 0
          ? 999
          : 0
      : null;
  const recoveryFactor = recoveryFactorR ?? amountRecoveryFactor;

  
  const pnls = closedTrades.map((t) => getEffectivePnL(t));
  const returnStabilityCV = calculateCV(pnls);

  
  const streakStats = calculateStreakStats(closedTrades);

  
  const winnerPnLs = winners.map((t) => getEffectivePnL(t));
  const loserPnLs = losers.map((t) => Math.abs(getEffectivePnL(t)));
  const rPlusCV = winnerPnLs.length >= 3 ? calculateCV(winnerPnLs) : 1.0;
  const rMinusCV = loserPnLs.length >= 3 ? calculateCV(loserPnLs) : 1.0;

  
  
  

  
  const profitFactorScore = scoreProfitFactor(profitFactor);
  const expectancyScore = scoreExpectancy(
    hasRData ? expectancyR : expectancy,
    hasRData
  );
  const profitabilityScore = profitFactorScore * 0.6 + expectancyScore * 0.4;

  
  const maxDrawdownScore =
    maxDrawdownR != null
      ? scoreMaxDrawdownR(maxDrawdownR)
      : scoreRecoveryFactor(amountRecoveryFactor);
  const recoveryFactorScore = scoreRecoveryFactor(recoveryFactor);
  const riskManagementScore =
    maxDrawdownScore * 0.5 + recoveryFactorScore * 0.5;

  
  
  const winRateScore = scoreWinRate(winRate);
  const winLossRatioScore = scoreWinLossRatio(avgWinLossRatio);
  let executionScore = winRateScore * 0.4 + winLossRatioScore * 0.6;

  
  if (winRate < 0.4 && expectancy > 0 && avgWinLossRatio > 2) {
    executionScore = Math.min(100, executionScore + 10);
  }

  
  const returnStabilityScore = scoreReturnStability(returnStabilityCV);
  const streakStabilityScore = scoreStreakStability(
    streakStats.maxLosingStreak,
    streakStats.avgStreak
  );
  const consistencyScore =
    returnStabilityScore * 0.6 + streakStabilityScore * 0.4;

  
  const rPlusScore = scoreReturnConsistencyCV(rPlusCV);
  const rMinusScore = scoreReturnConsistencyCV(rMinusCV);
  const returnConsistencyScore = rPlusScore * 0.5 + rMinusScore * 0.5;

  
  const experienceScore = experienceResult.score;

  
  
  

  const axisScores: AxisScores = {
    profitability: Math.round(profitabilityScore),
    riskManagement: Math.round(riskManagementScore),
    execution: Math.round(executionScore),
    consistency: Math.round(consistencyScore),
    returnConsistency: Math.round(returnConsistencyScore),
    experience: experienceScore,
  };

  const compositeScore = Math.round(
    axisScores.profitability * AXIS_WEIGHTS.profitability +
      axisScores.riskManagement * AXIS_WEIGHTS.riskManagement +
      axisScores.execution * AXIS_WEIGHTS.execution +
      axisScores.consistency * AXIS_WEIGHTS.consistency +
      axisScores.returnConsistency * AXIS_WEIGHTS.returnConsistency +
      axisScores.experience * AXIS_WEIGHTS.experience
  );

  
  
  

  const breakdown: AxisBreakdown = {
    profitability: {
      profitFactor,
      profitFactorScore: Math.round(profitFactorScore),
      expectancy: hasRData ? expectancyR : expectancy,
      expectancyScore: Math.round(expectancyScore),
    },
    riskManagement: {
      maxDrawdown,
      maxDrawdownR,
      maxDrawdownScore: Math.round(maxDrawdownScore),
      recoveryFactor,
      recoveryFactorR,
      recoveryFactorScore: Math.round(recoveryFactorScore),
    },
    execution: {
      winRate,
      winRateScore: Math.round(winRateScore),
      avgWinLossRatio,
      avgWinLossRatioScore: Math.round(winLossRatioScore),
    },
    consistency: {
      returnStabilityCV,
      returnStabilityScore: Math.round(returnStabilityScore),
      streakRatio:
        streakStats.avgStreak > 0
          ? streakStats.maxLosingStreak / streakStats.avgStreak
          : 0,
      streakStabilityScore: Math.round(streakStabilityScore),
    },
    returnConsistency: {
      rPlusCV,
      rPlusScore: Math.round(rPlusScore),
      rMinusCV,
      rMinusScore: Math.round(rMinusScore),
    },
    experience: {
      activeWeeks,
      totalWeeks,
      consistencyRatio,
      score: experienceScore,
    },
  };

  return {
    compositeScore,
    axisScores,
    breakdown,
    phase,
    phaseWeeks: activeWeeks,
    tradeCount,
  };
}


function createEmptyBreakdown(
  activeWeeks: number,
  totalWeeks: number,
  consistencyRatio: number,
  experienceScore: number
): AxisBreakdown {
  return {
    profitability: {
      profitFactor: 0,
      profitFactorScore: 0,
      expectancy: 0,
      expectancyScore: 0,
    },
    riskManagement: {
      maxDrawdown: 0,
      maxDrawdownR: null,
      maxDrawdownScore: 0,
      recoveryFactor: 0,
      recoveryFactorR: null,
      recoveryFactorScore: 0,
    },
    execution: {
      winRate: 0,
      winRateScore: 0,
      avgWinLossRatio: 0,
      avgWinLossRatioScore: 0,
    },
    consistency: {
      returnStabilityCV: 0,
      returnStabilityScore: 0,
      streakRatio: 0,
      streakStabilityScore: 0,
    },
    returnConsistency: {
      rPlusCV: 0,
      rPlusScore: 0,
      rMinusCV: 0,
      rMinusScore: 0,
    },
    experience: {
      activeWeeks,
      totalWeeks,
      consistencyRatio,
      score: experienceScore,
    },
  };
}






export function getScoreLabel(score: number): ScoreLabel {
  if (score < 30) {
    return {
      label: t('common.score.poor'),
      color: 'var(--color-red, #e53935)',
    };
  }
  if (score < 50) {
    return {
      label: t('common.score.below-average'),
      color: 'var(--color-orange, #fb8c00)',
    };
  }
  if (score < 70) {
    return {
      label: t('common.score.average'),
      color: 'var(--color-yellow, #fdd835)',
    };
  }
  if (score < 90) {
    return {
      label: t('common.score.strong'),
      color: 'var(--color-green, #43a047)',
    };
  }
  return {
    label: t('common.score.excellent'),
    color: 'var(--journalit-score-excellent, #0ea5e9)',
  };
}
