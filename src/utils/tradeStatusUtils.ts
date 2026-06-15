

import {
  calculateWeightedAveragePrice,
  normalizeTradeExecution,
} from '../services/trade/core/TradeExecutionNormalization';
import { calculateTradeDirectionPriceDiff } from '../services/trade/core/TradeDirection';
import { classifyPnLWithBreakEvenSettings } from './breakEvenRange';
import { parseTradeTimestampValue } from './dateUtils';

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
    (trade.tradeStatus !== 'OPEN' &&
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

export function isPnlContributingTrade(
  trade: TradePnLContributionContext
): boolean {
  if (trade.tradeStatus === 'CLOSED') {
    return true;
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


function isTradeOpen(trade: {
  tradeStatus?: string;
  exitTime?: Date | string | null;
  pnl?: number | null;
}): boolean {
  
  if (trade.tradeStatus === 'OPEN') {
    return true;
  }

  if (trade.tradeStatus === 'CLOSED') {
    return false;
  }

  
  
  
  return !trade.exitTime && (trade.pnl === null || trade.pnl === undefined);
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

  
  if (trade.tradeStatus === 'CLOSED') {
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
  if (trade.tradeStatus === 'CLOSED') {
    return false;
  }

  if (trade.tradeStatus === 'OPEN') {
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


export function getTradeDisplayStatus(
  trade: {
    tradeStatus?: string;
    exitTime?: Date | string | null;
    pnl?: number | null;
    isMissedTrade?: boolean;
    isBacktestTrade?: boolean;
    useDirectPnLInput?: boolean;
    directPnL?: number | null;
    breakEvenAccountCurrentBalance?: number;
    breakEvenAccountCurrentBalanceTotal?: number;
  },
  settings?: {
    breakEvenRangeMin?: number;
    breakEvenRangeMax?: number;
    breakEvenThresholdMode?: 'fixed' | 'percentage_current_balance';
    breakEvenThresholdPercent?: number;
  }
): 'open' | 'win' | 'loss' | 'breakeven' | 'missed' | 'backtest' {
  
  if (trade.isBacktestTrade) {
    return 'backtest';
  }

  
  if (trade.isMissedTrade) {
    return 'missed';
  }

  
  if (isTradeOpen(trade)) {
    return 'open';
  }

  
  const effectivePnL = getEffectivePnL(trade);
  const mode = settings?.breakEvenThresholdMode ?? 'fixed';

  if (mode !== 'percentage_current_balance') {
    const minBE = settings?.breakEvenRangeMin ?? 0;
    const maxBE = settings?.breakEvenRangeMax ?? 0;
    if (effectivePnL > maxBE) return 'win';
    if (effectivePnL < minBE) return 'loss';
    return 'breakeven';
  }

  const breakEvenBalance =
    trade.breakEvenAccountCurrentBalanceTotal ??
    trade.breakEvenAccountCurrentBalance;

  const outcome = classifyPnLWithBreakEvenSettings(
    effectivePnL,
    settings,
    breakEvenBalance
  );

  return outcome === 'unknown' ? 'breakeven' : outcome;
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
  settings?: {
    breakEvenRangeMin?: number;
    breakEvenRangeMax?: number;
    breakEvenThresholdMode?: 'fixed' | 'percentage_current_balance';
    breakEvenThresholdPercent?: number;
  }
): 'open' | 'win' | 'loss' | 'breakeven' | 'missed' | 'backtest' {
  
  if (trade.isBacktestTrade) {
    return 'backtest';
  }

  
  if (trade.isMissedTrade) {
    return 'missed';
  }

  
  if (isTradeOpenWithContext(trade)) {
    return 'open';
  }

  
  const effectivePnL = getEffectivePnL(trade);
  const mode = settings?.breakEvenThresholdMode ?? 'fixed';

  if (mode !== 'percentage_current_balance') {
    const minBE = settings?.breakEvenRangeMin ?? 0;
    const maxBE = settings?.breakEvenRangeMax ?? 0;
    if (effectivePnL > maxBE) return 'win';
    if (effectivePnL < minBE) return 'loss';
    return 'breakeven';
  }

  const breakEvenBalance =
    trade.breakEvenAccountCurrentBalanceTotal ??
    trade.breakEvenAccountCurrentBalance;

  const outcome = classifyPnLWithBreakEvenSettings(
    effectivePnL,
    settings,
    breakEvenBalance
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


export function getPartialExitInfo(trade: {
  entries?: Array<{ price?: number | null; size?: number | null }>;
  exits?: Array<{
    time?: Date | string | null;
    price?: number | null;
    size?: number | null;
  }>;
  direction?: string;
  assetType?: string;
  optionType?: string;
  contractSize?: number;
  dollarPerPoint?: number;
  tickValue?: number;
  tickSize?: number;
  lotSize?: number;
  pipValue?: number;
  commission?: number;
  commissionType?: 'fixed' | 'percentage';
  swap?: number;
  fees?: number;
  rebate?: number;
}): PartialExitInfo {
  const defaultResult: PartialExitInfo = {
    isPartialExit: false,
    closedSize: 0,
    totalSize: 0,
    remainingSize: 0,
    realizedPnL: 0,
    exits: [],
  };

  
  if (!trade.entries || trade.entries.length === 0) {
    return defaultResult;
  }

  const isWeightedEntryLeg = (entry: {
    price?: number | null;
    size?: number | null;
  }): entry is { price: number; size: number } =>
    typeof entry.price === 'number' &&
    Number.isFinite(entry.price) &&
    entry.price > 0 &&
    typeof entry.size === 'number' &&
    Number.isFinite(entry.size) &&
    entry.size > 0;

  const weightedEntryLegs = trade.entries.filter(isWeightedEntryLeg);
  const totalEntrySize = weightedEntryLegs.reduce(
    (sum, entry) => sum + entry.size,
    0
  );
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

  
  let totalExitSize = 0;
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

    totalExitSize += exitSize;

    
    const priceDiff = calculateTradeDirectionPriceDiff(
      trade,
      avgEntryPrice,
      exitPrice
    );
    if (priceDiff === null) continue;

    let exitPnL = priceDiff * exitSize;

    
    if (trade.assetType) {
      switch (trade.assetType) {
        case 'options':
          if (trade.contractSize) {
            exitPnL = priceDiff * exitSize * trade.contractSize;
          }
          break;
        case 'futures':
          
          if (trade.tickValue && trade.tickSize && trade.tickSize > 0) {
            const ticks = priceDiff / trade.tickSize;
            exitPnL = ticks * trade.tickValue * exitSize;
          } else if (trade.dollarPerPoint) {
            exitPnL = priceDiff * exitSize * trade.dollarPerPoint;
          }
          break;
        case 'forex':
          if (trade.lotSize && trade.lotSize > 0) {
            exitPnL = priceDiff * exitSize * trade.lotSize;
          } else if (trade.pipValue && trade.pipValue > 0) {
            const pips = priceDiff * 10000;
            exitPnL = pips * trade.pipValue * exitSize;
          }
          break;
        case 'cfd': {
          const contractSize =
            trade.contractSize && trade.contractSize > 0
              ? trade.contractSize
              : 1;
          exitPnL = priceDiff * exitSize * contractSize;
          break;
        }
      }
    }

    totalPnL += exitPnL;
    exitDetails.push({
      time: exit.time,
      price: exitPrice,
      size: exitSize,
      pnl: exitPnL,
    });
  }

  
  const remainingSize = totalEntrySize - totalExitSize;
  const normalizedRemainingSize =
    Math.abs(remainingSize) <= SIZE_COMPARISON_TOLERANCE ? 0 : remainingSize;
  const isPartialExit =
    totalExitSize > SIZE_COMPARISON_TOLERANCE &&
    remainingSize > SIZE_COMPARISON_TOLERANCE;

  
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


export function getWeightedAverageExitPrice(
  trade: Pick<TradeExecutionCompatibilityInput, 'exits' | 'exitPrice'>
): number | null {
  return normalizeTradeExecutionForCompatibility({
    exits: trade.exits,
    exitPrice: trade.exitPrice,
  }).weightedExitPrice;
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
