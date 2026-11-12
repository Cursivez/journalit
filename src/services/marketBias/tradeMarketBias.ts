

import { formatLocalDateString } from '../../utils/dateUtils';
import { extractBaseSymbol } from '../../utils/symbolNormalizer';
import { getTradeMarketSide } from '../trade/core/TradeDirection';
import {
  findMarketBias,
  normalizeMarketBiasTicker,
  type MarketBiasDirection,
  type MarketBiasEntry,
} from '../reviews/marketBias';

export const TRADE_BIAS_ALIGNMENTS = [
  'with',
  'against',
  'neutral',
  'none',
] as const;
export type TradeBiasAlignment = (typeof TRADE_BIAS_ALIGNMENTS)[number];

function isTradeBiasAlignment(value: unknown): value is TradeBiasAlignment {
  return TRADE_BIAS_ALIGNMENTS.some((alignment) => alignment === value);
}


export function normalizeTradeBiasFilters(
  value: unknown
): TradeBiasAlignment[] {
  return Array.isArray(value)
    ? [...new Set(value.filter(isTradeBiasAlignment))]
    : [];
}

export interface TradeMarketBias {
  
  readonly alignment: TradeBiasAlignment;
  
  readonly bias: MarketBiasDirection | null;
  
  readonly fromWeek: boolean;
  
  readonly daily: MarketBiasDirection | null;
  
  readonly weekly: MarketBiasDirection | null;
}

export interface TradeMarketBiasInput {
  readonly instrument?: unknown;
  readonly direction?: unknown;
  readonly assetType?: unknown;
  readonly optionType?: unknown;
}

export const NO_TRADE_MARKET_BIAS: TradeMarketBias = {
  alignment: 'none',
  bias: null,
  fromWeek: false,
  daily: null,
  weekly: null,
};


function tradeBiasTickers(instrument: unknown): string[] {
  if (typeof instrument !== 'string') return [];
  const tickers: string[] = [];
  for (const candidate of [instrument, extractBaseSymbol(instrument)]) {
    const ticker = normalizeMarketBiasTicker(candidate);
    if (ticker !== undefined && !tickers.includes(ticker)) {
      tickers.push(ticker);
    }
  }
  return tickers;
}


function noteBias(
  entries: readonly MarketBiasEntry[],
  tickers: readonly string[]
): MarketBiasDirection | null {
  for (const ticker of tickers) {
    const bias = findMarketBias(entries, ticker);
    if (bias !== null) return bias;
  }
  return findMarketBias(entries, undefined);
}

export function resolveTradeMarketBias(
  trade: TradeMarketBiasInput,
  dayEntries: readonly MarketBiasEntry[],
  weekEntries: readonly MarketBiasEntry[]
): TradeMarketBias {
  if (dayEntries.length === 0 && weekEntries.length === 0) {
    return NO_TRADE_MARKET_BIAS;
  }
  const tickers = tradeBiasTickers(trade.instrument);
  const daily = noteBias(dayEntries, tickers);
  const weekly = noteBias(weekEntries, tickers);
  const bias = daily ?? weekly;
  const side = getTradeMarketSide(trade);
  let alignment: TradeBiasAlignment = 'none';
  if (bias === 'neutral') alignment = 'neutral';
  else if (bias !== null && side !== null) {
    alignment = bias === side ? 'with' : 'against';
  }
  return {
    alignment,
    bias,
    fromWeek: daily === null && weekly !== null,
    daily,
    weekly,
  };
}


export function filterTradesByMarketBias<T>(
  trades: T[],
  selected: readonly TradeBiasAlignment[],
  alignmentOf: (trade: T) => TradeBiasAlignment
): T[] {
  if (selected.length === 0) return trades;
  const wanted = new Set(selected);
  return trades.filter((trade) => wanted.has(alignmentOf(trade)));
}

export interface MarketBiasSources {
  
  getMarketBiasByDay(): ReadonlyMap<string, readonly MarketBiasEntry[]>;
  
  getMarketBiasForWeek(tradingDay: Date): readonly MarketBiasEntry[];
}

export type TradeMarketBiasResolver = (
  trade: TradeMarketBiasInput & { readonly entryTime: Date }
) => TradeMarketBias;


export function createTradeMarketBiasResolver(
  sources: MarketBiasSources,
  tradingDayOf: (entryTime: Date) => Date
): TradeMarketBiasResolver {
  const biasByDay = sources.getMarketBiasByDay();
  const weekBiasByDay = new Map<string, readonly MarketBiasEntry[]>();
  return (trade) => {
    const tradingDay = tradingDayOf(trade.entryTime);
    const dayKey = formatLocalDateString(tradingDay);
    let weekEntries = weekBiasByDay.get(dayKey);
    if (weekEntries === undefined) {
      weekEntries = sources.getMarketBiasForWeek(tradingDay);
      weekBiasByDay.set(dayKey, weekEntries);
    }
    return resolveTradeMarketBias(
      trade,
      biasByDay.get(dayKey) ?? [],
      weekEntries
    );
  };
}
