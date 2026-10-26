

export type BehaviorOutcomeKind = 'win' | 'loss' | 'breakeven';

export interface BehaviorTrade {
  
  key: string;
  entryTime: Date;
  
  exitTime: Date | null;
  
  tradingDay: string;
  
  entryHour: number;
  pnl: number;
  outcome: BehaviorOutcomeKind;
  
  quantity?: number;
  ticker: string;
  
  mistakes: readonly string[];
  setups: ReadonlyArray<{ key: string; label: string }>;
  reviewed: boolean;
}

interface BehaviorOutcome {
  trade_count: number;
  win_count: number;
  loss_count: number;
  breakeven_count: number;
  net_pnl: number;
  average_pnl: number | null;
  win_rate: number | null;
}

interface MistakeCostRow extends BehaviorOutcome {
  mistake: string;
}

export interface MistakeCostResult {
  clean: BehaviorOutcome;
  clean_unreviewed_count: number;
  with_mistakes: BehaviorOutcome;
  mistakes: MistakeCostRow[];
}

export interface TiltRow extends BehaviorOutcome {
  preceding_losses: number;
  median_size_ratio: number | null;
  median_minutes_since_previous_exit: number | null;
}

export interface OvertradingRow extends BehaviorOutcome {
  trade_number: number;
}

const MAX_PRECEDING_LOSSES = 3;
const MAX_TRADE_NUMBER = 6;
const MAX_MISTAKE_ROWS = 100;

const compareText = (left: string, right: string): number =>
  left < right ? -1 : left > right ? 1 : 0;


function summarizeOutcomes(trades: readonly BehaviorTrade[]): BehaviorOutcome {
  let wins = 0;
  let losses = 0;
  let breakevens = 0;
  let net = 0;
  for (const trade of trades) {
    net += trade.pnl;
    if (trade.outcome === 'win') wins += 1;
    else if (trade.outcome === 'loss') losses += 1;
    else breakevens += 1;
  }
  const count = trades.length;
  return {
    trade_count: count,
    win_count: wins,
    loss_count: losses,
    breakeven_count: breakevens,
    net_pnl: net,
    average_pnl: count > 0 ? net / count : null,
    win_rate: wins + losses > 0 ? wins / (wins + losses) : null,
  };
}

function median(values: readonly number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((left, right) => left - right);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 1
    ? sorted[middle]
    : (sorted[middle - 1] + sorted[middle]) / 2;
}

const byEntry = (left: BehaviorTrade, right: BehaviorTrade): number =>
  left.entryTime.getTime() - right.entryTime.getTime() ||
  compareText(left.key, right.key);

function groupByTradingDay(
  trades: readonly BehaviorTrade[]
): Map<string, BehaviorTrade[]> {
  const days = new Map<string, BehaviorTrade[]>();
  for (const trade of trades) {
    const day = days.get(trade.tradingDay);
    if (day) day.push(trade);
    else days.set(trade.tradingDay, [trade]);
  }
  for (const day of days.values()) day.sort(byEntry);
  return days;
}

interface MistakeTally {
  mistake: string;
  trades: BehaviorTrade[];
}


function tallyMistakes(trades: readonly BehaviorTrade[]): MistakeTally[] {
  const byMistake = new Map<string, BehaviorTrade[]>();
  for (const trade of trades) {
    for (const mistake of new Set(trade.mistakes)) {
      const list = byMistake.get(mistake);
      if (list) list.push(trade);
      else byMistake.set(mistake, [trade]);
    }
  }
  return [...byMistake].map(([mistake, list]) => ({ mistake, trades: list }));
}

export function computeMistakeCost(
  trades: readonly BehaviorTrade[]
): MistakeCostResult {
  const clean = trades.filter((trade) => trade.mistakes.length === 0);
  const withMistakes = trades.filter((trade) => trade.mistakes.length > 0);
  const mistakes = tallyMistakes(trades)
    .map(({ mistake, trades: list }): MistakeCostRow => ({
      mistake,
      ...summarizeOutcomes(list),
    }))
    .sort(
      (left, right) =>
        left.net_pnl - right.net_pnl || compareText(left.mistake, right.mistake)
    )
    .slice(0, MAX_MISTAKE_ROWS);
  return {
    clean: summarizeOutcomes(clean),
    clean_unreviewed_count: clean.filter((trade) => !trade.reviewed).length,
    with_mistakes: summarizeOutcomes(withMistakes),
    mistakes,
  };
}

export interface PrecedingLossContext {
  
  precedingLosses: number;
  
  minutesSincePreviousExit: number | null;
}


export function computePrecedingLosses(
  trades: readonly BehaviorTrade[]
): Map<string, PrecedingLossContext> {
  const result = new Map<string, PrecedingLossContext>();
  for (const day of groupByTradingDay(trades).values()) {
    const byExit = day
      .flatMap((trade) =>
        trade.exitTime === null
          ? []
          : [{ trade, exit: trade.exitTime.getTime() }]
      )
      .sort(
        (left, right) =>
          right.exit - left.exit || compareText(right.trade.key, left.trade.key)
      );
    for (const trade of day) {
      const entry = trade.entryTime.getTime();
      let losses = 0;
      let latestExit: number | null = null;
      for (const { trade: prior, exit } of byExit) {
        if (prior.key === trade.key) continue;
        if (exit > entry) continue;
        latestExit ??= exit;
        if (prior.outcome !== 'loss') break;
        losses += 1;
        if (losses >= MAX_PRECEDING_LOSSES) break;
      }
      result.set(trade.key, {
        precedingLosses: losses,
        minutesSincePreviousExit:
          latestExit === null ? null : (entry - latestExit) / 60_000,
      });
    }
  }
  return result;
}


export function computeSizeRatios(
  trades: readonly BehaviorTrade[]
): Map<string, number> {
  const sizesByTicker = new Map<string, number[]>();
  for (const trade of trades) {
    if (trade.quantity === undefined) continue;
    const sizes = sizesByTicker.get(trade.ticker);
    if (sizes) sizes.push(trade.quantity);
    else sizesByTicker.set(trade.ticker, [trade.quantity]);
  }
  const medianByTicker = new Map<string, number>();
  for (const [ticker, sizes] of sizesByTicker) {
    const value = median(sizes);
    if (value !== null && value > 0) medianByTicker.set(ticker, value);
  }
  const ratios = new Map<string, number>();
  for (const trade of trades) {
    const reference = medianByTicker.get(trade.ticker);
    if (trade.quantity === undefined || reference === undefined) continue;
    ratios.set(trade.key, trade.quantity / reference);
  }
  return ratios;
}

export function computeTilt(trades: readonly BehaviorTrade[]): TiltRow[] {
  const context = computePrecedingLosses(trades);
  const ratios = computeSizeRatios(trades);
  const buckets: BehaviorTrade[][] = Array.from(
    { length: MAX_PRECEDING_LOSSES + 1 },
    () => []
  );
  for (const trade of trades) {
    const bucket = context.get(trade.key)?.precedingLosses ?? 0;
    buckets[bucket].push(trade);
  }
  return buckets.map((bucket, index) => {
    const sizeRatios: number[] = [];
    const minutes: number[] = [];
    for (const trade of bucket) {
      const ratio = ratios.get(trade.key);
      if (ratio !== undefined) sizeRatios.push(ratio);
      const since = context.get(trade.key)?.minutesSincePreviousExit;
      if (since !== undefined && since !== null) minutes.push(since);
    }
    return {
      preceding_losses: index,
      median_size_ratio: median(sizeRatios),
      median_minutes_since_previous_exit: median(minutes),
      ...summarizeOutcomes(bucket),
    };
  });
}


function computeTradeNumbers(
  trades: readonly BehaviorTrade[]
): Map<string, number> {
  const numbers = new Map<string, number>();
  for (const day of groupByTradingDay(trades).values()) {
    day.forEach((trade, index) => {
      numbers.set(trade.key, Math.min(index + 1, MAX_TRADE_NUMBER));
    });
  }
  return numbers;
}

export function computeOvertrading(
  trades: readonly BehaviorTrade[]
): OvertradingRow[] {
  const numbers = computeTradeNumbers(trades);
  const buckets: BehaviorTrade[][] = Array.from(
    { length: MAX_TRADE_NUMBER },
    () => []
  );
  for (const trade of trades) {
    buckets[(numbers.get(trade.key) ?? 1) - 1].push(trade);
  }
  return buckets.map((bucket, index) => ({
    trade_number: index + 1,
    ...summarizeOutcomes(bucket),
  }));
}

export interface SamplePeriod {
  trading_day_count: number;
  period?: { first_trading_day: string; last_trading_day: string };
}

export function samplePeriod(trades: readonly BehaviorTrade[]): SamplePeriod {
  const days = [...new Set(trades.map((trade) => trade.tradingDay))].sort();
  return days.length === 0
    ? { trading_day_count: 0 }
    : {
        trading_day_count: days.length,
        period: {
          first_trading_day: days[0],
          last_trading_day: days[days.length - 1],
        },
      };
}

export interface RecentMistake {
  mistake: string;
  trade_count: number;
  net_pnl: number;
}

export function topRecentMistakes(
  trades: readonly BehaviorTrade[],
  limit: number
): RecentMistake[] {
  return tallyMistakes(trades)
    .map(({ mistake, trades: list }) => ({
      mistake,
      trade_count: list.length,
      net_pnl: list.reduce((sum, trade) => sum + trade.pnl, 0),
    }))
    .sort(
      (left, right) =>
        right.trade_count - left.trade_count ||
        left.net_pnl - right.net_pnl ||
        compareText(left.mistake, right.mistake)
    )
    .slice(0, limit);
}

export interface TiltSignal {
  after_losses: number;
  trade_count: number;
  net_pnl: number;
  win_rate: number | null;
  baseline_win_rate: number | null;
}


export function computeTiltSignal(
  trades: readonly BehaviorTrade[],
  afterLosses: number
): TiltSignal | null {
  if (trades.length === 0) return null;
  const context = computePrecedingLosses(trades);
  const losses = (trade: BehaviorTrade): number =>
    context.get(trade.key)?.precedingLosses ?? 0;
  const tilted = summarizeOutcomes(
    trades.filter((trade) => losses(trade) >= afterLosses)
  );
  return {
    after_losses: afterLosses,
    trade_count: tilted.trade_count,
    net_pnl: tilted.net_pnl,
    win_rate: tilted.win_rate,
    baseline_win_rate: summarizeOutcomes(
      trades.filter((trade) => losses(trade) === 0)
    ).win_rate,
  };
}

interface EdgeGroup<Key> {
  key: Key;
  trade_count: number;
  net_pnl: number;
  win_rate: number | null;
}

export interface EdgePick<Key> {
  best: EdgeGroup<Key> | null;
  worst: EdgeGroup<Key> | null;
}


export function pickEdge<Key>(
  groups: ReadonlyMap<Key, readonly BehaviorTrade[]>,
  minimumSampleSize: number,
  compareKeys: (left: Key, right: Key) => number
): EdgePick<Key> {
  const qualifying: EdgeGroup<Key>[] = [];
  for (const [key, list] of groups) {
    if (list.length < minimumSampleSize) continue;
    const summary = summarizeOutcomes(list);
    qualifying.push({
      key,
      trade_count: summary.trade_count,
      net_pnl: summary.net_pnl,
      win_rate: summary.win_rate,
    });
  }
  qualifying.sort(
    (left, right) =>
      right.net_pnl - left.net_pnl || compareKeys(left.key, right.key)
  );
  const best = qualifying[0];
  const worst = [...qualifying].sort(
    (left, right) =>
      left.net_pnl - right.net_pnl || compareKeys(left.key, right.key)
  )[0];
  return {
    best: best !== undefined && best.net_pnl > 0 ? best : null,
    worst: worst !== undefined && worst.net_pnl < 0 ? worst : null,
  };
}

export function groupBySetup(
  trades: readonly BehaviorTrade[]
): Map<string, BehaviorTrade[]> {
  const groups = new Map<string, BehaviorTrade[]>();
  for (const trade of trades) {
    for (const setup of trade.setups) {
      const list = groups.get(setup.key);
      if (list) list.push(trade);
      else groups.set(setup.key, [trade]);
    }
  }
  return groups;
}

export function groupByEntryHour(
  trades: readonly BehaviorTrade[]
): Map<number, BehaviorTrade[]> {
  const groups = new Map<number, BehaviorTrade[]>();
  for (const trade of trades) {
    const list = groups.get(trade.entryHour);
    if (list) list.push(trade);
    else groups.set(trade.entryHour, [trade]);
  }
  return groups;
}
