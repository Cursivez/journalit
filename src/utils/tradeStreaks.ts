import {
  BreakEvenRangeSettings,
  classifyPnLWithBreakEvenSettings,
} from './breakEvenRange';
import { getEffectivePnL } from './tradeStatusUtils';

type StreakType = 'win' | 'loss' | 'none';

interface TradeOutcomeInput {
  pnl?: number | null;
  directPnL?: number | null;
  useDirectPnLInput?: boolean;
  breakEvenAccountCurrentBalance?: number;
}

const getTradeOutcome = (
  trade: TradeOutcomeInput,
  settings?: BreakEvenRangeSettings
) =>
  classifyPnLWithBreakEvenSettings(
    getEffectivePnL(trade),
    settings,
    trade.breakEvenAccountCurrentBalance
  );

export const calculateCurrentStreak = (
  sortedTrades: TradeOutcomeInput[],
  settings?: BreakEvenRangeSettings
): { currentStreak: number; streakType: StreakType } => {
  let currentStreak = 0;
  let streakType: StreakType = 'none';

  for (const trade of sortedTrades) {
    const outcome = getTradeOutcome(trade, settings);

    
    if (outcome === 'breakeven' || outcome === 'unknown') {
      continue;
    }

    if (streakType === 'none') {
      streakType = outcome;
      currentStreak = 1;
      continue;
    }

    if (outcome === streakType) {
      currentStreak++;
      continue;
    }

    break;
  }

  return { currentStreak, streakType };
};

export const calculateHistoricalStreaks = (
  chronologicalTrades: TradeOutcomeInput[],
  settings?: BreakEvenRangeSettings
): { winStreaks: number[]; lossStreaks: number[] } => {
  const winStreaks: number[] = [];
  const lossStreaks: number[] = [];

  let tempWinStreak = 0;
  let tempLossStreak = 0;

  for (const trade of chronologicalTrades) {
    const outcome = getTradeOutcome(trade, settings);

    if (outcome === 'breakeven' || outcome === 'unknown') {
      
      continue;
    }

    if (outcome === 'win') {
      if (tempLossStreak > 0) {
        lossStreaks.push(tempLossStreak);
        tempLossStreak = 0;
      }
      tempWinStreak++;
    } else {
      if (tempWinStreak > 0) {
        winStreaks.push(tempWinStreak);
        tempWinStreak = 0;
      }
      tempLossStreak++;
    }
  }

  if (tempWinStreak > 0) {
    winStreaks.push(tempWinStreak);
  }

  if (tempLossStreak > 0) {
    lossStreaks.push(tempLossStreak);
  }

  return { winStreaks, lossStreaks };
};

export const getDailyOutcome = (
  dayPnL: number,
  tradeCount: number,
  settings?: BreakEvenRangeSettings,
  accountCurrentBalance?: number
): 'win' | 'loss' | 'breakeven' => {
  if (tradeCount === 0) {
    return 'breakeven';
  }

  const outcome = classifyPnLWithBreakEvenSettings(
    dayPnL,
    settings,
    accountCurrentBalance
  );
  return outcome === 'unknown' ? 'breakeven' : outcome;
};
