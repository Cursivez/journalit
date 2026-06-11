

import { isTradeOpenWithContext } from './tradeStatusUtils';
import { TradeFormData, AssetType } from '../components/forms/trade/types';
import { calculateAssetAdjustedPriceMoveValue } from './priceMoveValue';
import {
  normalizeTradeExecution,
  NormalizedExecutionExit,
  NormalizedTradeExecution,
} from '../services/trade/core/TradeExecutionNormalization';
import { calculateTradeDirectionPriceDiff } from '../services/trade/core/TradeDirection';


function applyRebateCredit(pnl: number, rebate: number | undefined): number {
  if (rebate !== undefined && rebate > 0) {
    return pnl + rebate;
  }
  return pnl;
}

function applyFinancialAdjustments(
  pnl: number,
  data: Partial<TradeFormData>
): number {
  let adjustedPnL = pnl;

  
  if (data.commission !== undefined) {
    const actualCommission = calculateActualCommission(data);
    if (data.commission < 0) {
      adjustedPnL += actualCommission;
    } else {
      adjustedPnL -= actualCommission;
    }
  }

  if (data.swap !== undefined) {
    adjustedPnL += data.swap;
  }

  if (data.fees !== undefined) {
    if (data.fees < 0) {
      adjustedPnL += data.fees;
    } else {
      adjustedPnL -= data.fees;
    }
  }

  return applyRebateCredit(adjustedPnL, data.rebate);
}


export const calculateTotalDividends = (data: {
  dividends?: Array<{ amount?: number | null }>;
}): number => {
  if (!Array.isArray(data.dividends) || data.dividends.length === 0) {
    return 0;
  }

  return data.dividends.reduce((sum, dividend) => {
    const amount = dividend?.amount;
    return typeof amount === 'number' && Number.isFinite(amount)
      ? sum + amount
      : sum;
  }, 0);
};

export const deriveRawDirectPnLFromStoredCombinedPnL = (
  data: Pick<
    Partial<TradeFormData>,
    | 'pnl'
    | 'dividends'
    | 'rebate'
    | 'fees'
    | 'swap'
    | 'commission'
    | 'commissionType'
    | 'entryPrice'
    | 'positionSize'
  >
): number | undefined => {
  if (data.pnl === undefined) {
    return undefined;
  }

  const totalDividends = calculateTotalDividends(data);
  let rawDirectPnL = data.pnl - totalDividends;

  if (data.rebate !== undefined && data.rebate > 0) {
    rawDirectPnL -= data.rebate;
  }

  if (data.fees !== undefined) {
    rawDirectPnL += data.fees < 0 ? -data.fees : data.fees;
  }

  if (data.swap !== undefined) {
    rawDirectPnL -= data.swap;
  }

  if (data.commission !== undefined) {
    const actualCommission = calculateActualCommission(data);
    rawDirectPnL += data.commission < 0 ? -actualCommission : actualCommission;
  }

  return rawDirectPnL;
};


export const calculateActualCommission = (
  data: Partial<TradeFormData>
): number => {
  const commission = data.commission || 0;
  const commissionType = data.commissionType || 'fixed';

  if (commissionType === 'percentage') {
    
    
    const normalizedExecution = normalizeTradeExecutionForCalculation(data);
    const entriesValue = normalizedExecution.entries.reduce((sum, entry) => {
      if (
        entry.price !== null &&
        entry.price > 0 &&
        entry.size !== null &&
        entry.size > 0
      ) {
        return sum + Math.abs(entry.price * entry.size);
      }
      return sum;
    }, 0);

    let tradeValue = entriesValue;
    if (
      tradeValue === 0 &&
      normalizedExecution.entryPrice !== null &&
      normalizedExecution.positionSize !== null
    ) {
      tradeValue = Math.abs(
        normalizedExecution.entryPrice * normalizedExecution.positionSize
      );
    } else if (
      tradeValue === 0 &&
      data.useDirectPnLInput &&
      data.directPnL !== undefined
    ) {
      
      tradeValue = Math.abs(data.directPnL);
    }

    return (tradeValue * commission) / 100;
  }

  return commission; 
};


const calculatePnLSingle = (
  data: Partial<TradeFormData>,
  normalizedExecution: NormalizedTradeExecution
): number => {
  const priceDiff = calculateDirectionalPriceDiff(
    data,
    normalizedExecution.weightedEntryPrice,
    normalizedExecution.resolvedExitPrice
  );

  if (priceDiff === null || normalizedExecution.positionSize === null) {
    return 0;
  }

  const pnl = calculateAssetAdjustedPriceMoveValue(
    data,
    priceDiff,
    normalizedExecution.positionSize
  );

  return applyFinancialAdjustments(pnl, data);
};


const normalizeTradeExecutionForCalculation = (
  data: Partial<TradeFormData>
): NormalizedTradeExecution =>
  normalizeTradeExecution(data, { deriveMissingExplicitness: false });

const hasCalculationEntry = (
  normalizedExecution: NormalizedTradeExecution
): boolean => normalizedExecution.weightedEntryPrice !== null;

const hasCalculationExit = (exit: NormalizedExecutionExit): boolean => {
  if (
    exit.price === null ||
    exit.price < 0 ||
    exit.size === null ||
    exit.size <= 0
  ) {
    return false;
  }

  return exit.price > 0 || exit.hasExplicitPrice !== false;
};

const hasMeaningfulExits = (
  normalizedExecution: NormalizedTradeExecution
): boolean => normalizedExecution.exits.some(hasCalculationExit);

export const calculateDirectionalPriceDiff = (
  data: {
    assetType?: AssetType | string;
    direction?: string;
    optionType?: string;
  },
  entryPrice: number | null,
  exitPrice: number | null
): number | null =>
  calculateTradeDirectionPriceDiff(data, entryPrice, exitPrice);

const calculateExecutionPnL = (
  data: Partial<TradeFormData>,
  normalizedExecution: NormalizedTradeExecution
): number | null => {
  if (
    !hasCalculationEntry(normalizedExecution) ||
    !hasMeaningfulExits(normalizedExecution)
  ) {
    return null;
  }

  let totalPnL = 0;
  for (const exit of normalizedExecution.exits) {
    if (!hasCalculationExit(exit)) {
      continue;
    }

    const priceDiff = calculateDirectionalPriceDiff(
      data,
      normalizedExecution.weightedEntryPrice,
      exit.price
    );
    if (priceDiff === null || exit.size === null) {
      continue;
    }

    totalPnL += calculateAssetAdjustedPriceMoveValue(
      data,
      priceDiff,
      exit.size
    );
  }

  return totalPnL;
};

export const calculatePnL = (data: Partial<TradeFormData>): number => {
  const totalDividends = calculateTotalDividends(data);
  const normalizedExecution = normalizeTradeExecutionForCalculation(data);
  const isOpenTrade = isTradeOpenWithContext({
    tradeStatus: data.tradeStatus,
    exitTime: data.exitTime,
    exitPrice: data.exitPrice,
    pnl: data._originalPnlWasNull ? null : data.pnl,
    useDirectPnLInput: data.useDirectPnLInput,
    exits: data.exits,
    entries: data.entries,
  });

  const hasExecutionPnLForOpenTrade =
    isOpenTrade && hasMeaningfulExits(normalizedExecution);

  if (
    data.useDirectPnLInput &&
    data.directPnL !== undefined &&
    !(isOpenTrade && data.tradeStatus === 'OPEN') &&
    !hasExecutionPnLForOpenTrade
  ) {
    return applyFinancialAdjustments(data.directPnL, data) + totalDividends;
  }

  const executionPnL = calculateExecutionPnL(data, normalizedExecution);
  if (executionPnL !== null) {
    return applyFinancialAdjustments(executionPnL, data) + totalDividends;
  }

  if (!isOpenTrade) {
    return calculatePnLSingle(data, normalizedExecution) + totalDividends;
  }

  return applyFinancialAdjustments(0, data) + totalDividends;
};
