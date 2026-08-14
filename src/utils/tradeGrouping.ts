import { extractBaseSymbol } from './symbolNormalizer';

interface GroupableTrade {
  setup?: unknown;
  customTags?: unknown;
  tags?: unknown;
  instrument?: string;
  assetType?: string;
}

const normalizeGroupValue = (value: unknown): string => {
  if (typeof value === 'string') {
    return value.trim();
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value).trim();
  }

  return '';
};

const normalizeUniqueValues = (values: readonly unknown[]): string[] =>
  Array.from(
    new Set(
      values.flatMap((value) => {
        const normalized = normalizeGroupValue(value);
        return normalized ? [normalized] : [];
      })
    )
  );

export const getTradeSetupGroups = (trade: GroupableTrade): string[] =>
  normalizeUniqueValues(Array.isArray(trade.setup) ? trade.setup : []);

export const getTradeTagGroups = (trade: GroupableTrade): string[] => {
  const customTags = Array.isArray(trade.customTags) ? trade.customTags : [];
  const fallbackTags = Array.isArray(trade.tags) ? trade.tags : [];
  const tags = customTags.length > 0 ? customTags : fallbackTags;
  return normalizeUniqueValues(tags);
};


export const getTradeTickerGroups = (trade: GroupableTrade): string[] => {
  const instrument = trade.instrument?.trim().toUpperCase() ?? '';
  if (!instrument) {
    return [];
  }

  const ticker =
    trade.assetType?.trim().toLowerCase() === 'futures'
      ? extractBaseSymbol(instrument)
      : instrument;

  return ticker ? [ticker] : [];
};
