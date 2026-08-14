import {
  type GroupedBreakEvenAccountBalance,
  type PnLOutcomeWithUnknown,
} from '../../../utils/breakEvenRange';
import type { BreakEvenAccountBalanceSnapshot } from '../../../services/trade/core/BreakEvenAccountBalance';

type WeeklySummaryDayBarVariant =
  | 'positive'
  | 'negative'
  | 'breakeven'
  | 'neutral'
  | 'empty'
  | 'future';

interface WeeklySummaryDayBarPresentation {
  variant: WeeklySummaryDayBarVariant;
  height: number;
  opacity: number;
}

type WeeklySummaryContext =
  | { key: 'home.widget.weekly.no-trades' }
  | { key: 'home.widget.weekly.breakeven' }
  | { key: 'home.widget.weekly.losing-days'; count: number }
  | { key: 'home.widget.weekly.winning-days'; count: number }
  | { key: 'home.widget.weekly.above-average' }
  | { key: 'home.widget.weekly.below-average' }
  | { key: 'home.widget.weekly.better-than-last' }
  | { key: 'home.widget.weekly.slower-than-last' }
  | { key: 'home.widget.weekly.on-track' }
  | { key: 'home.widget.weekly.room-to-recover' }
  | { key: 'home.widget.weekly.solid-start' }
  | { key: 'home.widget.weekly.early-in-week' }
  | null;

export const getWeeklySummaryContext = ({
  currentTotalTrades,
  currentOutcome,
  losingDays,
  winningDays,
  historicalAvg,
  currentNetPnL,
  previousNetPnL,
}: {
  currentTotalTrades: number;
  currentOutcome: PnLOutcomeWithUnknown;
  losingDays: number;
  winningDays: number;
  historicalAvg: number;
  currentNetPnL: number;
  previousNetPnL: number;
}): WeeklySummaryContext => {
  if (currentTotalTrades === 0) {
    return { key: 'home.widget.weekly.no-trades' };
  }

  if (currentOutcome === 'breakeven') {
    return { key: 'home.widget.weekly.breakeven' };
  }

  if (currentOutcome === 'unknown') {
    return null;
  }

  if (losingDays >= 3 && winningDays === 0) {
    return { key: 'home.widget.weekly.losing-days', count: losingDays };
  }

  if (winningDays >= 3 && losingDays === 0) {
    return { key: 'home.widget.weekly.winning-days', count: winningDays };
  }

  if (historicalAvg !== 0 && currentNetPnL > historicalAvg * 1.5) {
    return { key: 'home.widget.weekly.above-average' };
  }

  if (
    historicalAvg !== 0 &&
    currentNetPnL < historicalAvg * 0.5 &&
    currentNetPnL > 0
  ) {
    return { key: 'home.widget.weekly.below-average' };
  }

  if (previousNetPnL !== 0) {
    const changePercent =
      ((currentNetPnL - previousNetPnL) / Math.abs(previousNetPnL)) * 100;

    if (changePercent > 50) {
      return { key: 'home.widget.weekly.better-than-last' };
    }

    if (changePercent < -50) {
      return { key: 'home.widget.weekly.slower-than-last' };
    }

    return {
      key:
        currentNetPnL >= 0
          ? 'home.widget.weekly.on-track'
          : 'home.widget.weekly.room-to-recover',
    };
  }

  return {
    key:
      currentNetPnL >= 0
        ? 'home.widget.weekly.solid-start'
        : 'home.widget.weekly.early-in-week',
  };
};

export const getWeeklySummaryBreakEvenBalance = ({
  breakEvenAccountCurrentBalance,
  breakEvenAccountCurrentBalanceTotal,
}: {
  breakEvenAccountCurrentBalance?: number;
  breakEvenAccountCurrentBalanceTotal?: number;
}): number | undefined =>
  breakEvenAccountCurrentBalanceTotal ?? breakEvenAccountCurrentBalance;

export const getWeeklySummaryBreakEvenBalanceGroups = (trade: {
  accountLookupKeys?: string[];
  breakEvenAccountCurrentBalanceSnapshots?: BreakEvenAccountBalanceSnapshot[];
  breakEvenAccountCurrentBalance?: number;
  breakEvenAccountCurrentBalanceTotal?: number;
}): GroupedBreakEvenAccountBalance[] =>
  trade.breakEvenAccountCurrentBalanceSnapshots?.map((snapshot) => ({
    accountKeys: [snapshot.accountKey],
    balance: snapshot.balance,
  })) ?? [
    {
      accountKeys: trade.accountLookupKeys ?? [],
      balance: getWeeklySummaryBreakEvenBalance(trade),
    },
  ];

export const getWeeklySummaryDayBarPresentation = ({
  isFuture,
  isPnlMasked,
  tradeCount,
  outcome,
  pnl,
  maxAbsPnL,
}: {
  isFuture: boolean;
  isPnlMasked: boolean;
  tradeCount: number;
  outcome: PnLOutcomeWithUnknown;
  pnl: number;
  maxAbsPnL: number;
}): WeeklySummaryDayBarPresentation => {
  if (isFuture) {
    return { variant: 'future', height: 4, opacity: 0.3 };
  }

  if (isPnlMasked) {
    return { variant: 'neutral', height: 4, opacity: 0.3 };
  }

  if (tradeCount === 0) {
    return { variant: 'empty', height: 4, opacity: 0.5 };
  }

  if (outcome === 'breakeven') {
    return { variant: 'breakeven', height: 12, opacity: 1 };
  }

  if (outcome === 'unknown') {
    return { variant: 'neutral', height: 12, opacity: 1 };
  }

  return {
    variant: outcome === 'win' ? 'positive' : 'negative',
    height: Math.max(8, (Math.abs(pnl) / maxAbsPnL) * 40),
    opacity: 1,
  };
};

export const getWeeklySummaryHeroOutcome = ({
  pnlOutcome,
  displayRMultiples,
  netRMultiple,
}: {
  pnlOutcome: PnLOutcomeWithUnknown;
  displayRMultiples: boolean;
  netRMultiple: number | undefined;
}): PnLOutcomeWithUnknown => {
  if (!displayRMultiples || netRMultiple === undefined) {
    return pnlOutcome;
  }

  if (pnlOutcome === 'breakeven' || pnlOutcome === 'unknown') {
    return pnlOutcome;
  }

  if (netRMultiple > 0) {
    return 'win';
  }

  if (netRMultiple < 0) {
    return 'loss';
  }

  return 'breakeven';
};

export const getWeeklySummaryHeroColor = ({
  isPnlMasked,
  outcome,
}: {
  isPnlMasked: boolean;
  outcome: PnLOutcomeWithUnknown;
}): string => {
  if (isPnlMasked) {
    return 'var(--text-normal)';
  }

  if (outcome === 'win') {
    return 'var(--color-green)';
  }

  if (outcome === 'loss') {
    return 'var(--color-red)';
  }

  return 'var(--text-normal)';
};
