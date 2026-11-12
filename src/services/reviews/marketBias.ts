

export const MARKET_BIAS_FIELD = 'marketBias';

export const MARKET_BIAS_DIRECTIONS = ['long', 'neutral', 'short'] as const;
export type MarketBiasDirection = (typeof MARKET_BIAS_DIRECTIONS)[number];

export interface MarketBiasEntry {
  
  readonly ticker?: string;
  readonly bias: MarketBiasDirection;
}

export type MarketBiasFor = 'overall' | 'tickers';

export interface MarketBiasWidgetConfig {
  biasFor?: MarketBiasFor;
  
  tickers?: string;
}

const MAX_MARKET_BIAS_TICKER_LENGTH = 40;

function isMarketBiasDirection(value: unknown): value is MarketBiasDirection {
  return MARKET_BIAS_DIRECTIONS.some((direction) => direction === value);
}


export function normalizeMarketBiasTicker(value: string): string | undefined {
  const ticker = value.trim().toUpperCase();
  if (!ticker || ticker.includes(',')) return undefined;
  return ticker.length <= MAX_MARKET_BIAS_TICKER_LENGTH ? ticker : undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}


export function readMarketBias(
  frontmatter: Readonly<Record<string, unknown>> | null | undefined
): MarketBiasEntry[] {
  const raw = frontmatter?.[MARKET_BIAS_FIELD];
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const entries: MarketBiasEntry[] = [];
  for (const item of raw) {
    if (!isRecord(item) || !isMarketBiasDirection(item.bias)) continue;
    let ticker: string | undefined;
    if (item.ticker !== undefined && item.ticker !== null) {
      if (typeof item.ticker !== 'string') continue;
      ticker = normalizeMarketBiasTicker(item.ticker);
      if (ticker === undefined) continue;
    }
    const key = ticker ?? '';
    if (seen.has(key)) continue;
    seen.add(key);
    entries.push(
      ticker === undefined ? { bias: item.bias } : { ticker, bias: item.bias }
    );
  }
  return entries;
}


export function findMarketBias(
  entries: readonly MarketBiasEntry[],
  ticker: string | undefined
): MarketBiasDirection | null {
  return entries.find((entry) => entry.ticker === ticker)?.bias ?? null;
}


export function withMarketBias(
  entries: readonly MarketBiasEntry[],
  ticker: string | undefined,
  bias: MarketBiasDirection | null
): MarketBiasEntry[] {
  const index = entries.findIndex((entry) => entry.ticker === ticker);
  if (bias === null) {
    return index < 0 ? [...entries] : entries.filter((_, i) => i !== index);
  }
  const entry: MarketBiasEntry =
    ticker === undefined ? { bias } : { ticker, bias };
  if (index < 0) return [...entries, entry];
  return entries.map((current, i) => (i === index ? entry : current));
}


export function marketBiasFrontmatterValue(
  entries: readonly MarketBiasEntry[]
): Array<{ ticker?: string; bias: MarketBiasDirection }> | undefined {
  return entries.length
    ? entries.map((entry) =>
        entry.ticker === undefined
          ? { bias: entry.bias }
          : { ticker: entry.ticker, bias: entry.bias }
      )
    : undefined;
}


export function marketBiasUpdate(
  frontmatter: Readonly<Record<string, unknown>>,
  ticker: string | undefined,
  bias: MarketBiasDirection | null
): Record<string, unknown> {
  return {
    [MARKET_BIAS_FIELD]: marketBiasFrontmatterValue(
      withMarketBias(readMarketBias(frontmatter), ticker, bias)
    ),
  };
}


export function parseMarketBiasTickers(value: unknown): string[] {
  if (typeof value !== 'string') return [];
  const tickers = new Set<string>();
  for (const part of value.split(',')) {
    const ticker = normalizeMarketBiasTicker(part);
    if (ticker !== undefined) tickers.add(ticker);
  }
  return [...tickers];
}


export function resolveMarketBiasRows(
  config: MarketBiasWidgetConfig | undefined
): Array<string | undefined> {
  if (config?.biasFor !== 'tickers') return [undefined];
  const tickers = parseMarketBiasTickers(config.tickers);
  return tickers.length ? tickers : [undefined];
}


export function resolveMarketBiasDisplayRows(
  config: MarketBiasWidgetConfig | undefined,
  entries: readonly MarketBiasEntry[]
): Array<string | undefined> {
  const rows = new Set(resolveMarketBiasRows(config));
  for (const entry of entries) rows.add(entry.ticker);
  return [...rows];
}


export function toMarketBiasWidgetConfig(
  config: Readonly<Record<string, unknown>> | undefined
): MarketBiasWidgetConfig {
  return {
    biasFor: config?.biasFor === 'tickers' ? 'tickers' : 'overall',
    ...(typeof config?.tickers === 'string' ? { tickers: config.tickers } : {}),
  };
}


export function parseMarketBiasWidgetConfig(
  source: string
): MarketBiasWidgetConfig {
  const config: MarketBiasWidgetConfig = {};
  for (const line of source.split('\n')) {
    const colonIndex = line.indexOf(':');
    if (colonIndex <= 0) continue;
    const key = line.substring(0, colonIndex).trim();
    const value = line.substring(colonIndex + 1).trim();
    if (key === 'biasFor' && (value === 'overall' || value === 'tickers')) {
      config.biasFor = value;
    }
    if (key === 'tickers') config.tickers = value;
  }
  return config;
}
