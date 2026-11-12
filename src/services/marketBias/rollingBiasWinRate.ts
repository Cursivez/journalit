

import type { TradeBiasAlignment } from './tradeMarketBias';

export const ROLLING_BIAS_PERIODS = [10, 20, 30, 50] as const;
export type RollingBiasPeriod = (typeof ROLLING_BIAS_PERIODS)[number];

type BiasSide = 'with' | 'against';

export interface RollingBiasTrade {
  readonly alignment: TradeBiasAlignment;
  readonly outcome: 'win' | 'loss' | 'breakeven' | 'unknown';
  
  readonly time: number;
}

export interface RollingBiasPoint {
  
  readonly tradeNumber: number;
  readonly time: number;
  readonly side: BiasSide;
  readonly beforePeriod: boolean;
  
  readonly with: number | null;
  readonly against: number | null;
}

export function parseRollingBiasPeriod(
  value: unknown
): RollingBiasPeriod | null {
  return (
    ROLLING_BIAS_PERIODS.find((period) => period === Number(value)) ?? null
  );
}

function winRate(window: readonly RollingBiasTrade[]): number | null {
  let wins = 0;
  let losses = 0;
  for (const trade of window) {
    if (trade.outcome === 'win') wins += 1;
    else if (trade.outcome === 'loss') losses += 1;
  }
  return wins + losses > 0 ? (wins / (wins + losses)) * 100 : null;
}


function lookbackStart(
  trades: readonly (RollingBiasTrade & { alignment: BiasSide })[],
  periodStartIndex: number,
  period: number
): number {
  let first = periodStartIndex;
  for (const side of ['with', 'against'] as const) {
    let seen = 0;
    for (let i = periodStartIndex - 1; i >= 0 && seen < period; i -= 1) {
      if (trades[i].alignment !== side) continue;
      seen += 1;
      first = Math.min(first, i);
    }
  }
  return first;
}

function sidedByTime(
  trades: readonly RollingBiasTrade[]
): (RollingBiasTrade & { alignment: BiasSide })[] {
  return trades
    .filter(
      (trade): trade is RollingBiasTrade & { alignment: BiasSide } =>
        trade.alignment === 'with' || trade.alignment === 'against'
    )
    .sort((a, b) => a.time - b.time);
}


export function calculateRollingBiasWinRate(
  trades: readonly RollingBiasTrade[],
  period: number,
  earlierTrades?: readonly RollingBiasTrade[]
): RollingBiasPoint[] {
  const inPeriod = sidedByTime(trades);
  const earlier = earlierTrades ? sidedByTime(earlierTrades) : [];
  const sided = [...earlier, ...inPeriod];

  let first = 0;
  if (earlierTrades) {
    if (inPeriod.length === 0) return [];
    first = lookbackStart(sided, earlier.length, period);
  }

  const windows: Record<BiasSide, RollingBiasTrade[]> = {
    with: [],
    against: [],
  };
  const value = (side: BiasSide) =>
    windows[side].length === period ? winRate(windows[side]) : null;
  const points: RollingBiasPoint[] = [];
  for (let i = 0; i < sided.length; i += 1) {
    const trade = sided[i];
    const window = windows[trade.alignment];
    window.push(trade);
    if (window.length > period) window.shift();
    if (i < first) continue;
    points.push({
      tradeNumber: points.length + 1,
      time: trade.time,
      side: trade.alignment,
      beforePeriod: i < earlier.length,
      with: value('with'),
      against: value('against'),
    });
  }

  
  if (earlierTrades) return points;
  const firstValue = points.findIndex(
    (point) => point.with !== null || point.against !== null
  );
  return firstValue < 0 ? [] : points.slice(firstValue);
}
