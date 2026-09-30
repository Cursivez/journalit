

import {
  calculateWeightedAveragePrice,
  normalizeTradeExecution,
} from '../services/trade/core/TradeExecutionNormalization';
import { hasUnknownCanonicalPnL } from '../services/trade/core/CanonicalProjectionFields';
import { calculateTradeDirectionPriceDiff } from '../services/trade/core/TradeDirection';
import { classifyPnLWithBreakEvenSettings } from './breakEvenRange';
import { parseTradeTimestampValue } from './dateUtils';
import {
  calculateAssetAdjustedPriceMoveValue,
  type PriceMoveValueInput,
} from './priceMoveValue';

const SIZE_COMPARISON_TOLERANCE = 1e-9;

export function getEffectivePnL(trade: {
  pnl?: number | null;
  directPnL?: number | null;
  useDirectPnLInput?: boolean;
  dividends?: Array<{ amount?: number | null }>;
  commission?: number | null;
  swap?: number | null;
  fees?: number | null;
  rebate?: number | null;
}): number {
  const hasStoredPnL =
    trade.pnl !== undefined && trade.pnl !== null && Number.isFinite(trade.pnl);
  const hasDividendEvents = Boolean(
    trade.dividends?.some(
      (dividend) =>
        dividend.amount !== undefined &&
        dividend.amount !== null &&
        Number.isFinite(dividend.amount) &&
        dividend.amount !== 0
    )
  );
  const hasPnLAdjustments = [
    trade.commission,
    trade.swap,
    trade.fees,
    trade.rebate,
  ].some(
    (value) =>
      value !== undefined &&
      value !== null &&
      Number.isFinite(value) &&
      value !== 0
  );

  if (hasStoredPnL) {
    const shouldFallbackToDirectPnLForLegacyTrade =
      trade.useDirectPnLInput === true &&
      trade.directPnL !== undefined &&
      trade.directPnL !== null &&
      trade.pnl === 0 &&
      trade.directPnL !== 0 &&
      !hasDividendEvents &&
      !hasPnLAdjustments;

    if (!shouldFallbackToDirectPnLForLegacyTrade) {
      return typeof trade.pnl === 'number' && Number.isFinite(trade.pnl)
        ? trade.pnl
        : 0;
    }
  }

  
  
  if (
    trade.useDirectPnLInput &&
    trade.directPnL !== undefined &&
    trade.directPnL !== null
  ) {
    return trade.directPnL;
  }

  return typeof trade.pnl === 'number' && Number.isFinite(trade.pnl)
    ? trade.pnl
    : 0;
}

interface TradePnLContributionContext {
  canonicalTradeId?: string;
  canonicalTradeVersion?: number;
  canonicalProjectionSchemaVersion?: number;
  authoritativePnl?: number | null;
  tradeStatus?: string;
  exitTime?: Date | string | null;
  exitPrice?: number | null;
  pnl?: number | null;
  _originalPnlWasNull?: boolean;
  useDirectPnLInput?: boolean;
  directPnL?: number | null;
  dividends?: Array<{ amount?: number | null }>;
  commission?: number | null;
  swap?: number | null;
  fees?: number | null;
  rebate?: number | null;
  exits?: Array<{
    time?: Date | string | null;
    price?: number | null;
    size?: number | null;
  }>;
  entries?: Array<{
    time?: Date | string | null;
    price?: number | null;
    size?: number | null;
  }>;
}

type PartialExitSizeInput = Pick<
  TradePnLContributionContext,
  'entries' | 'exits'
>;

function getPartialExitSizeSummary(trade: PartialExitSizeInput): {
  weightedEntryLegs: Array<{ price: number; size: number }>;
  totalEntrySize: number;
  totalExitSize: number;
  remainingSize: number;
  normalizedRemainingSize: number;
  isPartialExit: boolean;
} {
  const weightedEntryLegs = (trade.entries ?? []).flatMap((entry) =>
    typeof entry.price === 'number' &&
    Number.isFinite(entry.price) &&
    entry.price > 0 &&
    typeof entry.size === 'number' &&
    Number.isFinite(entry.size) &&
    entry.size > 0
      ? [{ price: entry.price, size: entry.size }]
      : []
  );
  const totalEntrySize = weightedEntryLegs.reduce(
    (sum, entry) => sum + entry.size,
    0
  );
  const totalExitSize = (trade.exits ?? []).reduce(
    (sum, exit) =>
      typeof exit.size === 'number' &&
      Number.isFinite(exit.size) &&
      exit.size > 0
        ? sum + exit.size
        : sum,
    0
  );
  const remainingSize = totalEntrySize - totalExitSize;
  const normalizedRemainingSize =
    Math.abs(remainingSize) <= SIZE_COMPARISON_TOLERANCE ? 0 : remainingSize;

  return {
    weightedEntryLegs,
    totalEntrySize,
    totalExitSize,
    remainingSize,
    normalizedRemainingSize,
    isPartialExit:
      totalExitSize > SIZE_COMPARISON_TOLERANCE &&
      remainingSize > SIZE_COMPARISON_TOLERANCE,
  };
}

export function hasRealizedPnLComponents(
  trade: Pick<
    TradePnLContributionContext,
    | 'tradeStatus'
    | 'useDirectPnLInput'
    | 'directPnL'
    | 'dividends'
    | 'commission'
    | 'swap'
    | 'fees'
    | 'rebate'
    | 'exits'
  >
): boolean {
  const hasRealizedExits = Boolean(
    trade.exits?.some(
      (exit) =>
        exit.price !== undefined && exit.price !== null && (exit.size ?? 0) > 0
    )
  );
  const hasDividendEvents = Boolean(
    trade.dividends?.some(
      (dividend) =>
        dividend.amount !== undefined &&
        dividend.amount !== null &&
        Number.isFinite(dividend.amount) &&
        dividend.amount !== 0
    )
  );
  const hasAdjustments = [
    trade.commission,
    trade.swap,
    trade.fees,
    trade.rebate,
  ].some(
    (value) =>
      value !== undefined &&
      value !== null &&
      Number.isFinite(value) &&
      value !== 0
  );

  return (
    hasRealizedExits ||
    hasDividendEvents ||
    hasAdjustments ||
    (trade.tradeStatus === 'CLOSED' &&
      trade.useDirectPnLInput === true &&
      trade.directPnL !== undefined &&
      trade.directPnL !== null)
  );
}

export function hasRealizedStoredPnL(
  trade: Pick<
    TradePnLContributionContext,
    | '_originalPnlWasNull'
    | 'tradeStatus'
    | 'pnl'
    | 'useDirectPnLInput'
    | 'directPnL'
    | 'dividends'
    | 'commission'
    | 'swap'
    | 'fees'
    | 'rebate'
    | 'exits'
  >
): boolean {
  if (trade._originalPnlWasNull === true) {
    return false;
  }

  return (
    Number.isFinite(trade.pnl) &&
    ((trade.pnl ?? 0) !== 0 || hasRealizedPnLComponents(trade))
  );
}

export function hasDerivableCurrentRealizedPnL(
  trade: Pick<
    TradePnLContributionContext,
    | 'canonicalTradeId'
    | 'canonicalTradeVersion'
    | 'canonicalProjectionSchemaVersion'
    | 'authoritativePnl'
    | 'tradeStatus'
    | '_originalPnlWasNull'
    | 'pnl'
    | 'entries'
    | 'exits'
  >
): boolean {
  if (trade.tradeStatus === 'CANCELLED') return false;
  if (hasUnknownCanonicalPnL(trade)) return false;

  return getPartialExitSizeSummary(trade).isPartialExit;
}

export function isPnlContributingTrade(
  trade: TradePnLContributionContext
): boolean {
  if (trade.tradeStatus === 'CANCELLED') {
    return false;
  }
  if (trade.tradeStatus === 'CLOSED') {
    return !hasUnknownCanonicalPnL(trade);
  }

  return (
    !isTradeOpenWithContext({
      tradeStatus: trade.tradeStatus,
      exitTime: trade.exitTime,
      exitPrice: trade.exitPrice,
      pnl: trade._originalPnlWasNull ? null : trade.pnl,
      useDirectPnLInput: trade.useDirectPnLInput,
      exits: trade.exits,
      entries: trade.entries,
    }) || hasRealizedStoredPnL(trade)
  );
}


export function isTradeOpenWithContext(trade: {
  tradeStatus?: string;
  exitTime?: Date | string | null;
  exitPrice?: number | null;
  pnl?: number | null;
  useDirectPnLInput?: boolean;
  exits?: Array<{
    time?: Date | string | null;
    price?: number | null;
    size?: number | null;
  }>;
  entries?: Array<{
    time?: Date | string | null;
    price?: number | null;
    size?: number | null;
  }>;
}): boolean {
  
  
  if (trade.tradeStatus === 'OPEN') {
    return true;
  }

  if (trade.tradeStatus === 'PARTIALLY_CLOSED') {
    return true;
  }

  if (trade.tradeStatus === 'CANCELLED') {
    return false;
  }

  
  
  if (trade.useDirectPnLInput === true) {
    return false;
  }

  
  

  
  const hasMeaningfulExitsData =
    trade.exits &&
    trade.exits.length > 0 &&
    trade.exits.some(
      (exit) =>
        (exit.price !== undefined && exit.price !== null && exit.price !== 0) ||
        (exit.size !== undefined && exit.size !== null && exit.size !== 0)
    );

  
  
  const hasLegacyExitPrice =
    trade.exitPrice !== undefined && trade.exitPrice !== null;

  
  const hasEntriesArray = trade.entries && trade.entries.length > 0;
  if (hasEntriesArray) {
    
    if (!hasMeaningfulExitsData && !hasLegacyExitPrice) {
      return true; 
    }

    
    if (trade.entries && trade.exits && hasMeaningfulExitsData) {
      const totalEntrySize = trade.entries.reduce(
        (sum, entry) => sum + (entry.size || 0),
        0
      );
      const totalExitSize = trade.exits.reduce(
        (sum, exit) => sum + (exit.size || 0),
        0
      );

      
      if (totalExitSize < totalEntrySize - SIZE_COMPARISON_TOLERANCE) {
        return true; 
      }
    }
  }

  
  if (trade.tradeStatus === 'CLOSED' || trade.tradeStatus === 'CANCELLED') {
    return false;
  }

  
  
  const hasRealizedPnL =
    trade.pnl !== null &&
    trade.pnl !== undefined &&
    (hasMeaningfulExitsData || hasLegacyExitPrice || trade.exitTime);

  
  return !hasMeaningfulExitsData && !hasLegacyExitPrice && !hasRealizedPnL;
}


export function isTradeOpenPreservingNullPnl(trade: {
  tradeStatus?: string;
  exitTime?: Date | string | null;
  exitPrice?: number | null;
  pnl?: number | null;
  useDirectPnLInput?: boolean;
  exits?: Array<{
    time?: Date | string | null;
    price?: number | null;
    size?: number | null;
  }>;
  entries?: Array<{
    time?: Date | string | null;
    price?: number | null;
    size?: number | null;
  }>;
  _originalPnlWasNull?: boolean;
}): boolean {
  if (trade.tradeStatus === 'CLOSED' || trade.tradeStatus === 'CANCELLED') {
    return false;
  }

  if (trade.tradeStatus === 'OPEN') {
    return true;
  }

  if (trade.tradeStatus === 'PARTIALLY_CLOSED') {
    return true;
  }

  if (trade._originalPnlWasNull && !trade.tradeStatus) {
    return true;
  }

  return isTradeOpenWithContext({
    tradeStatus: trade.tradeStatus,
    exitTime: trade.exitTime,
    exitPrice: trade.exitPrice,
    pnl: trade._originalPnlWasNull ? null : trade.pnl,
    useDirectPnLInput: trade.useDirectPnLInput,
    exits: trade.exits,
    entries: trade.entries,
  });
}


export function getTradeDisplayStatusWithContext(
  trade: {
    tradeStatus?: string;
    exitTime?: Date | string | null;
    pnl?: number | null;
    isMissedTrade?: boolean;
    isBacktestTrade?: boolean;
    useDirectPnLInput?: boolean;
    directPnL?: number | null;
    authoritativePnl?: number | null;
    _originalPnlWasNull?: boolean;
    canonicalTradeId?: string;
    canonicalTradeVersion?: number;
    canonicalProjectionSchemaVersion?: number;
    breakEvenAccountCurrentBalance?: number;
    breakEvenAccountCurrentBalanceTotal?: number;
    exits?: Array<{
      time?: Date | string | null;
      price?: number | null;
      size?: number | null;
    }>;
    entries?: Array<{
      time?: Date | string | null;
      price?: number | null;
      size?: number | null;
    }>;
  },
  settings:
    | {
        breakEvenRangeMin?: number;
        breakEvenRangeMax?: number;
        breakEvenThresholdMode?: 'fixed' | 'percentage_current_balance';
        breakEvenThresholdPercent?: number;
      }
    | undefined,
  resolvePnL: () => number
):
  | 'open'
  | 'partially_closed'
  | 'cancelled'
  | 'win'
  | 'loss'
  | 'breakeven'
  | 'unknown'
  | 'missed'
  | 'backtest' {
  
  if (trade.isBacktestTrade) {
    return 'backtest';
  }

  
  if (trade.isMissedTrade) {
    return 'missed';
  }

  if (trade.tradeStatus === 'CANCELLED') return 'cancelled';
  if (trade.tradeStatus === 'PARTIALLY_CLOSED') return 'partially_closed';

  
  if (isTradeOpenWithContext(trade)) {
    return 'open';
  }

  if (hasUnknownCanonicalPnL(trade)) {
    return 'unknown';
  }

  
  
  const outcome = classifyPnLWithBreakEvenSettings(
    resolvePnL(),
    settings,
    trade.breakEvenAccountCurrentBalanceTotal ??
      trade.breakEvenAccountCurrentBalance
  );

  return outcome === 'unknown' ? 'breakeven' : outcome;
}


export interface PartialExitInfo {
  
  isPartialExit: boolean;
  
  closedSize: number;
  
  totalSize: number;
  
  remainingSize: number;
  
  realizedPnL: number;
  
  exits: Array<{
    time?: Date | string | null;
    price: number;
    size: number;
    pnl: number;
  }>;
}


export function getPartialExitInfo(
  trade: PriceMoveValueInput & {
    entries?: Array<{ price?: number | null; size?: number | null }>;
    exits?: Array<{
      time?: Date | string | null;
      price?: number | null;
      size?: number | null;
    }>;
    direction?: string;
    optionType?: string;
    commission?: number;
    commissionType?: 'fixed' | 'percentage';
    swap?: number;
    fees?: number;
    rebate?: number;
  }
): PartialExitInfo {
  const defaultResult: PartialExitInfo = {
    isPartialExit: false,
    closedSize: 0,
    totalSize: 0,
    remainingSize: 0,
    realizedPnL: 0,
    exits: [],
  };

  const {
    weightedEntryLegs,
    totalEntrySize,
    totalExitSize,
    normalizedRemainingSize,
    isPartialExit,
  } = getPartialExitSizeSummary(trade);
  const totalEntryValue = weightedEntryLegs.reduce(
    (sum, entry) => sum + entry.price * entry.size,
    0
  );
  const avgEntryPrice = calculateWeightedAveragePrice(weightedEntryLegs);

  if (avgEntryPrice === null || totalEntrySize === 0) {
    return defaultResult;
  }

  
  if (!trade.exits || trade.exits.length === 0) {
    return {
      ...defaultResult,
      totalSize: totalEntrySize,
      remainingSize: totalEntrySize,
    };
  }

  
  let totalPnL = 0;
  const exitDetails: Array<{
    time?: Date | string | null;
    price: number;
    size: number;
    pnl: number;
  }> = [];

  for (const exit of trade.exits) {
    const exitSize = exit.size ?? 0;
    const exitPrice = exit.price ?? 0;

    if (exitSize <= 0) continue;

    
    const priceDiff = calculateTradeDirectionPriceDiff(
      trade,
      avgEntryPrice,
      exitPrice
    );
    if (priceDiff === null) continue;

    const exitPnL = calculateAssetAdjustedPriceMoveValue(
      trade,
      priceDiff,
      exitSize
    );

    totalPnL += exitPnL;
    exitDetails.push({
      time: exit.time,
      price: exitPrice,
      size: exitSize,
      pnl: exitPnL,
    });
  }

  
  if (isPartialExit && totalExitSize > 0) {
    const closedRatio = totalExitSize / totalEntrySize;

    
    if (trade.commission !== undefined && trade.commission !== 0) {
      const actualCommission =
        trade.commissionType === 'percentage'
          ? totalEntryValue * (trade.commission / 100) * closedRatio
          : trade.commission * closedRatio;

      if (trade.commission < 0) {
        totalPnL += actualCommission;
      } else {
        totalPnL -= actualCommission;
      }
    }

    
    if (trade.swap !== undefined) {
      totalPnL += trade.swap * closedRatio;
    }

    
    if (trade.fees !== undefined && trade.fees !== 0) {
      const proportionalFees = trade.fees * closedRatio;
      if (trade.fees < 0) {
        totalPnL += proportionalFees;
      } else {
        totalPnL -= proportionalFees;
      }
    }

    
    if (trade.rebate !== undefined && trade.rebate > 0) {
      totalPnL += trade.rebate * closedRatio;
    }
  }

  return {
    isPartialExit,
    closedSize: totalExitSize,
    totalSize: totalEntrySize,
    remainingSize: normalizedRemainingSize,
    realizedPnL: totalPnL,
    exits: exitDetails,
  };
}

type CurrentRealizedPnLInput = Parameters<typeof getPartialExitInfo>[0] &
  Parameters<typeof getEffectivePnL>[0] &
  Parameters<typeof hasRealizedStoredPnL>[0] & {
    canonicalTradeId?: string;
    canonicalTradeVersion?: number;
    canonicalProjectionSchemaVersion?: number;
    authoritativePnl?: number | null;
  };

interface CurrentRealizedPnLResolution {
  pnl: number | null;
  financialAdjustmentRatio: number;
}


export function resolveCurrentRealizedPnL(
  trade: CurrentRealizedPnLInput,
  totalDividends: number,
  options: { authoritativePnlUnknown?: boolean } = {}
): CurrentRealizedPnLResolution {
  if (options.authoritativePnlUnknown || hasUnknownCanonicalPnL(trade)) {
    return { pnl: null, financialAdjustmentRatio: 0 };
  }

  if (hasRealizedStoredPnL(trade)) {
    return { pnl: getEffectivePnL(trade), financialAdjustmentRatio: 1 };
  }

  const partialExitInfo = getPartialExitInfo(trade);
  if (!partialExitInfo.isPartialExit) {
    return { pnl: 0, financialAdjustmentRatio: 0 };
  }

  return {
    pnl: partialExitInfo.realizedPnL + totalDividends,
    financialAdjustmentRatio:
      partialExitInfo.closedSize / partialExitInfo.totalSize,
  };
}


export function getCurrentRealizedPnL(
  trade: CurrentRealizedPnLInput,
  totalDividends: number,
  options: { authoritativePnlUnknown?: boolean } = {}
): number | null {
  return resolveCurrentRealizedPnL(trade, totalDividends, options).pnl;
}

interface TradeExecutionCompatibilityInput {
  entries?: Array<{
    time?: Date | string | null;
    price?: number | string | null;
    size?: number | string | null;
  }>;
  exits?: Array<{
    time?: Date | string | null;
    price?: number | string | null;
    size?: number | string | null;
    hasExplicitPrice?: boolean;
  }>;
  entryPrice?: number | string | null;
  exitPrice?: number | string | null;
  positionSize?: number | string | null;
  entryTime?: Date | string | null;
  exitTime?: Date | string | null;
  hasExplicitExitPrice?: boolean;
  useDirectPnLInput?: boolean | string;
  direction?: string;
  assetType?: string;
  optionType?: string;
}

const COMPATIBILITY_NORMALIZATION_OPTIONS = {
  deriveMissingExplicitness: false,
} as const;

function normalizeTradeExecutionForCompatibility(
  trade: TradeExecutionCompatibilityInput
) {
  return normalizeTradeExecution(trade, COMPATIBILITY_NORMALIZATION_OPTIONS);
}


export function getWeightedAverageEntryPrice(
  trade: Pick<TradeExecutionCompatibilityInput, 'entries' | 'entryPrice'>
): number | null {
  return normalizeTradeExecutionForCompatibility({
    entries: trade.entries,
    entryPrice: trade.entryPrice,
  }).weightedEntryPrice;
}

export function getTotalEntrySize(
  trade: Pick<TradeExecutionCompatibilityInput, 'entries' | 'positionSize'>
): number | null {
  const normalized = normalizeTradeExecutionForCompatibility({
    entries: trade.entries,
    positionSize: trade.positionSize,
  });
  const entriesSize = normalized.entries.reduce(
    (sum, entry) =>
      entry.size !== null && entry.size > 0 ? sum + entry.size : sum,
    0
  );

  return entriesSize > 0 ? entriesSize : normalized.positionSize;
}

export function getResolvedWeightedAverageExitPrice(
  trade: Pick<
    TradeExecutionCompatibilityInput,
    'exits' | 'exitPrice' | 'hasExplicitExitPrice' | 'useDirectPnLInput'
  >
): number | null {
  return normalizeTradeExecutionForCompatibility({
    exits: trade.exits,
    exitPrice: trade.exitPrice,
    hasExplicitExitPrice: trade.hasExplicitExitPrice,
    useDirectPnLInput: trade.useDirectPnLInput,
  }).resolvedExitPrice;
}

export function calculateTradePriceMove(
  trade: Pick<
    TradeExecutionCompatibilityInput,
    | 'entries'
    | 'exits'
    | 'entryPrice'
    | 'exitPrice'
    | 'hasExplicitExitPrice'
    | 'useDirectPnLInput'
    | 'direction'
    | 'assetType'
    | 'optionType'
  >
): number | null {
  return normalizeTradeExecutionForCompatibility({
    entries: trade.entries,
    exits: trade.exits,
    entryPrice: trade.entryPrice,
    exitPrice: trade.exitPrice,
    hasExplicitExitPrice: trade.hasExplicitExitPrice,
    useDirectPnLInput: trade.useDirectPnLInput,
    direction: trade.direction,
    assetType: trade.assetType,
    optionType: trade.optionType,
  }).priceMove;
}


export function getFirstEntryTime(
  trade: Pick<TradeExecutionCompatibilityInput, 'entries' | 'entryTime'>
): Date | null {
  return normalizeTradeExecutionForCompatibility({
    entries: trade.entries,
    entryTime: trade.entryTime,
  }).firstEntryTime;
}


export function getLastExitTime(
  trade: Pick<
    TradeExecutionCompatibilityInput,
    'exits' | 'exitTime' | 'useDirectPnLInput'
  >
): Date | null {
  if (
    (trade.useDirectPnLInput === true || trade.useDirectPnLInput === 'true') &&
    Array.isArray(trade.exits)
  ) {
    const latest = trade.exits.reduce<Date | null>((current, exit) => {
      if (!exit.time) {
        return current;
      }

      const candidate = parseTradeTimestampValue(exit.time);
      if (!candidate) {
        return current;
      }

      return !current || candidate > current ? candidate : current;
    }, null);

    if (latest) {
      return latest;
    }
  }

  return normalizeTradeExecutionForCompatibility({
    exits: trade.exits,
    exitTime: trade.exitTime,
    useDirectPnLInput: trade.useDirectPnLInput,
  }).lastExitTime;
}
