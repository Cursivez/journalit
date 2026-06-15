export interface RawExecutionLegInput {
  time?: unknown;
  price?: unknown;
  size?: unknown;
  quantity?: unknown;
  notional?: unknown;
  hasExplicitPrice?: unknown;
}

import { calculateTradeDirectionPriceDiff } from './TradeDirection';
import { parseTradeTimestampValue } from '../../../utils/dateUtils';
import { safeString } from '../../../utils/safeString';

export interface TradeExecutionNormalizationInput {
  entryPrice?: unknown;
  exitPrice?: unknown;
  positionSize?: unknown;
  entries?: unknown;
  exits?: unknown;
  entryTime?: unknown;
  exitTime?: unknown;
  direction?: unknown;
  assetType?: unknown;
  optionType?: unknown;
  useDirectPnLInput?: unknown;
  hasExplicitExitPrice?: unknown;
}

export interface NormalizeTradeExecutionOptions {
  
  deriveMissingExplicitness: boolean;
}

export interface NormalizedExecutionEntry {
  time: Date | null;
  price: number | null;
  size: number | null;
  notional?: number;
}

export interface NormalizedExecutionExit {
  time: Date | null;
  price: number | null;
  size: number | null;
  notional?: number;
  hasExplicitPrice?: boolean;
}

export interface NormalizedTradeExecution {
  entryPrice: number | null;
  exitPrice: number | null;
  positionSize: number | null;
  useDirectPnLInput: boolean;
  hasExplicitExitPrice?: boolean;
  entries: NormalizedExecutionEntry[];
  exits: NormalizedExecutionExit[];

  weightedEntryPrice: number | null;
  weightedExitPrice: number | null;
  resolvedExitPrice: number | null;
  priceMove: number | null;

  firstEntryTime: Date | null;
  lastExitTime: Date | null;
}

interface WeightedExitLeg {
  price?: unknown;
  size?: unknown;
  hasExplicitPrice?: boolean;
}

export function normalizeTradeExecution(
  input: TradeExecutionNormalizationInput,
  options: NormalizeTradeExecutionOptions
): NormalizedTradeExecution {
  const entryPrice = parseFiniteNumber(input.entryPrice);
  const exitPrice = parseFiniteNumber(input.exitPrice);
  const positionSize = parseFiniteNumber(input.positionSize);
  const useDirectPnLInput = isTruthyValue(input.useDirectPnLInput);
  const hasExplicitExitPrice = normalizeTradeLevelExplicitness(input, options);

  const entries = normalizeEntries(input.entries);
  const exits = normalizeExits(input.exits, hasExplicitExitPrice, options);

  const weightedEntryPrice =
    calculateWeightedAveragePrice(entries) ??
    (entryPrice !== null && entryPrice > 0 ? entryPrice : null);
  const weightedExitPrice = calculateWeightedAverageExitPrice(exits, exitPrice);
  const resolvedExitPrice = resolveExitPrice({
    exits,
    exitPrice: weightedExitPrice,
    useDirectPnLInput,
    hasExplicitExitPrice,
  });

  return {
    entryPrice,
    exitPrice,
    positionSize,
    useDirectPnLInput,
    hasExplicitExitPrice,
    entries,
    exits,
    weightedEntryPrice,
    weightedExitPrice,
    resolvedExitPrice,
    priceMove: calculatePriceMove(weightedEntryPrice, resolvedExitPrice, input),
    firstEntryTime: getFirstExecutionTime(entries, input.entryTime),
    lastExitTime: getLastExecutionTime(exits, input.exitTime),
  };
}

export function deriveLegacyExitPriceExplicitness(input: {
  exitPrice?: unknown;
  useDirectPnLInput?: unknown;
}): boolean | undefined {
  const parsedExitPrice = parseFiniteNumber(input.exitPrice);
  if (parsedExitPrice === null) {
    return undefined;
  }

  return parsedExitPrice !== 0 || !isTruthyValue(input.useDirectPnLInput);
}

export function calculateWeightedAveragePrice(
  legs: Array<{ price?: unknown; size?: unknown }>
): number | null {
  let totalValue = 0;
  let totalSize = 0;

  for (const leg of legs) {
    const price = parseFiniteNumber(leg.price);
    const size = parseFiniteNumber(leg.size);

    if (price !== null && price > 0 && size !== null && size > 0) {
      totalValue += price * size;
      totalSize += size;
    }
  }

  return totalSize > 0 ? totalValue / totalSize : null;
}

function normalizeTradeLevelExplicitness(
  input: TradeExecutionNormalizationInput,
  options: NormalizeTradeExecutionOptions
): boolean | undefined {
  if (typeof input.hasExplicitExitPrice === 'boolean') {
    return input.hasExplicitExitPrice;
  }

  return options.deriveMissingExplicitness
    ? deriveLegacyExitPriceExplicitness(input)
    : undefined;
}

function normalizeEntries(input: unknown): NormalizedExecutionEntry[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input.filter(isRecord).map((entry) => {
    const notional = parseFiniteNumber(entry.notional);

    return {
      time: parseDateValue(entry.time),
      price: parseFiniteNumber(entry.price),
      size: parseFiniteNumber(entry.size ?? entry.quantity),
      ...(notional !== null ? { notional } : {}),
    };
  });
}

function normalizeExits(
  input: unknown,
  hasExplicitExitPrice: boolean | undefined,
  options: NormalizeTradeExecutionOptions
): NormalizedExecutionExit[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input.filter(isRecord).map((exit) => {
    const price = parseFiniteNumber(exit.price);
    const hasExplicitPrice = normalizeExitLegExplicitness(
      exit,
      price,
      hasExplicitExitPrice,
      options
    );
    const notional = parseFiniteNumber(exit.notional);

    return {
      time: parseDateValue(exit.time),
      price,
      size: parseFiniteNumber(exit.size ?? exit.quantity),
      ...(notional !== null ? { notional } : {}),
      ...(hasExplicitPrice !== undefined ? { hasExplicitPrice } : {}),
    };
  });
}

function normalizeExitLegExplicitness(
  exit: Record<string, unknown>,
  price: number | null,
  hasExplicitExitPrice: boolean | undefined,
  options: NormalizeTradeExecutionOptions
): boolean | undefined {
  if (typeof exit.hasExplicitPrice === 'boolean') {
    return exit.hasExplicitPrice;
  }

  if (!options.deriveMissingExplicitness) {
    return undefined;
  }

  return hasPresentValue(exit.price) && price !== null
    ? price !== 0 || hasExplicitExitPrice === true
    : false;
}

function calculateWeightedAverageExitPrice(
  exits: WeightedExitLeg[],
  fallbackExitPrice: number | null
): number | null {
  let totalValue = 0;
  let totalSize = 0;

  for (const exit of exits) {
    const price = getExplicitExitPriceValue(exit);
    const size = parseFiniteNumber(exit.size);

    if (price !== null && size !== null && size > 0) {
      totalValue += price * size;
      totalSize += size;
    }
  }

  return totalSize > 0 ? totalValue / totalSize : fallbackExitPrice;
}

function resolveExitPrice(input: {
  exits: WeightedExitLeg[];
  exitPrice: number | null;
  useDirectPnLInput: boolean;
  hasExplicitExitPrice?: boolean;
}): number | null {
  const hasSizedExplicitExit = input.exits.some(hasSizedExplicitExitPrice);
  const hasKnownExitPriceExplicitness =
    input.hasExplicitExitPrice !== undefined ||
    input.exits.some(hasExplicitPriceFlagKnown);

  if (
    input.useDirectPnLInput &&
    hasKnownExitPriceExplicitness &&
    !hasSizedExplicitExit &&
    input.hasExplicitExitPrice !== true
  ) {
    return null;
  }

  if (
    input.exitPrice === 0 &&
    !hasSizedExplicitExit &&
    input.hasExplicitExitPrice === false
  ) {
    return null;
  }

  return input.exitPrice;
}

function calculatePriceMove(
  entryPrice: number | null,
  exitPrice: number | null,
  input: TradeExecutionNormalizationInput
): number | null {
  return calculateTradeDirectionPriceDiff(input, entryPrice, exitPrice);
}

function getExplicitExitPriceValue(exit: WeightedExitLeg): number | null {
  const price = parseFiniteNumber(exit.price);
  if (price === null) {
    return null;
  }

  if (price > 0 || (price === 0 && exit.hasExplicitPrice === true)) {
    return price;
  }

  return !hasExplicitPriceFlagKnown(exit) && price === 0 ? price : null;
}

function hasSizedExplicitExitPrice(exit: WeightedExitLeg): boolean {
  const size = parseFiniteNumber(exit.size);
  return getExplicitExitPriceValue(exit) !== null && size !== null && size > 0;
}

function hasExplicitPriceFlagKnown(exit: {
  hasExplicitPrice?: boolean;
}): boolean {
  return 'hasExplicitPrice' in exit;
}

function getFirstExecutionTime(
  entries: NormalizedExecutionEntry[],
  fallbackEntryTime: unknown
): Date | null {
  const earliest = entries.reduce<Date | null>(
    (current, entry) => getEarlierDate(current, entry.time),
    null
  );

  return earliest ?? parseDateValue(fallbackEntryTime);
}

function getLastExecutionTime(
  exits: NormalizedExecutionExit[],
  fallbackExitTime: unknown
): Date | null {
  const latest = exits.reduce<Date | null>(
    (current, exit) =>
      isMeaningfulExitTimeCandidate(exit)
        ? getLaterDate(current, exit.time)
        : current,
    null
  );

  return latest ?? parseDateValue(fallbackExitTime);
}

function isMeaningfulExitTimeCandidate(exit: NormalizedExecutionExit): boolean {
  return exit.size === null || exit.size > 0;
}

function getEarlierDate(
  current: Date | null,
  candidate: Date | null
): Date | null {
  if (!candidate) {
    return current;
  }

  return !current || candidate < current ? candidate : current;
}

function getLaterDate(
  current: Date | null,
  candidate: Date | null
): Date | null {
  if (!candidate) {
    return current;
  }

  return !current || candidate > current ? candidate : current;
}

function parseFiniteNumber(value: unknown): number | null {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  const parsed = typeof value === 'number' ? value : Number(safeString(value));
  return Number.isFinite(parsed) ? parsed : null;
}

function parseDateValue(value: unknown): Date | null {
  const parsed = parseTradeTimestampValue(value);
  return parsed ? new Date(parsed) : null;
}

function isTruthyValue(value: unknown): boolean {
  return value === true || value === 'true';
}

function hasPresentValue(value: unknown): boolean {
  return value !== undefined && value !== null && value !== '';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object';
}
