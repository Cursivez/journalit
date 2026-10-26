import { TradeFormData } from '../components/forms/trade/types';
import {
  calculateAssetAdjustedPriceMoveValue,
  hasAuthoritativePriceMoveMultiplier,
} from './priceMoveValue';
import {
  normalizeTradeExecution,
  type TradeExecutionNormalizationInput,
} from '../services/trade/core/TradeExecutionNormalization';
import {
  calculateStopLossPriceDistance,
  hasPricedStopLoss,
  resolveEffectiveStopPrice,
  resolveStopLossCoverage,
} from '../services/trade/core/StopLossTargets';
import type {
  StopLossCoverage,
  StopLossLeg,
  StopLossTarget,
} from '../services/trade/core/StopLossTargets';


type StopLossCoverageInput = TradeExecutionNormalizationInput & {
  stopLosses?: readonly StopLossTarget[];
};

interface StopLossRiskContext {
  legs: StopLossLeg[];
  referenceEntryPrice: number;
  totalSize: number;
}

const resolveExecutionRiskPositionSize = (
  execution: ReturnType<typeof normalizeTradeExecution>
): number => {
  const totalEntrySize = execution.entries.reduce(
    (sum, entry) =>
      entry.price !== null &&
      entry.price > 0 &&
      entry.size !== null &&
      entry.size > 0
        ? sum + entry.size
        : sum,
    0
  );
  return totalEntrySize || execution.positionSize || 0;
};

const resolveStopLossRiskContext = (
  data: Partial<TradeFormData>
): StopLossRiskContext | null => {
  if (!hasPricedStopLoss(data.stopLosses)) {
    return null;
  }

  const execution = normalizeTradeExecution(data, {
    deriveMissingExplicitness: true,
  });
  const referenceEntryPrice = execution.weightedEntryPrice ?? undefined;
  const totalSize = resolveExecutionRiskPositionSize(execution);

  if (referenceEntryPrice === undefined || totalSize <= 0) {
    return null;
  }

  const coverage = resolveStopLossCoverage(data.stopLosses, totalSize);
  if (coverage.status !== 'complete') {
    return null;
  }

  return {
    legs: coverage.legs,
    referenceEntryPrice,
    totalSize,
  };
};


export const resolveTradeRiskPositionSize = (
  data: StopLossCoverageInput
): number | undefined =>
  resolveExecutionRiskPositionSize(
    normalizeTradeExecution(data, { deriveMissingExplicitness: true })
  ) || undefined;


export const resolveTradeStopLossCoverage = (
  data: StopLossCoverageInput
): StopLossCoverage => {
  if (!hasPricedStopLoss(data.stopLosses)) {
    return { status: 'none' };
  }

  return resolveStopLossCoverage(
    data.stopLosses,
    resolveTradeRiskPositionSize(data)
  );
};


export const hasStopLossRiskBasis = (data: StopLossCoverageInput): boolean => {
  const { status } = resolveTradeStopLossCoverage(data);
  return status === 'complete' || status === 'no-position-size';
};


export const resolveTradeEffectiveStopPrice = (
  data: Partial<TradeFormData>
): number | undefined => {
  const coverage = resolveTradeStopLossCoverage(data);
  return coverage.status === 'complete'
    ? resolveEffectiveStopPrice(coverage.legs)
    : undefined;
};


export const canCalculateStopLossRiskAmount = (
  data: Partial<TradeFormData>
): boolean => {
  return resolveStopLossRiskContext(data) !== null;
};


export const calculateStopLossRiskAmount = (
  data: Partial<TradeFormData>
): number => {
  const context = resolveStopLossRiskContext(data);
  if (!context) {
    return 0;
  }

  const { legs, referenceEntryPrice, totalSize } = context;
  const stopDistance = calculateStopLossPriceDistance(
    legs,
    referenceEntryPrice,
    data
  );
  const riskAmount = calculateAssetAdjustedPriceMoveValue(
    data,
    stopDistance,
    totalSize
  );

  return Number.isFinite(riskAmount) ? Math.abs(riskAmount) : 0;
};

const hasAuthoritativeStopLossRiskContext = (
  data: Partial<TradeFormData>
): boolean => {
  if (!canCalculateStopLossRiskAmount(data)) {
    return false;
  }

  return hasAuthoritativePriceMoveMultiplier(data);
};

const isValidPositiveRiskAmount = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value > 0;


export const resolveEffectiveRiskAmount = (
  data: Partial<TradeFormData>,
  defaultRiskAmount?: number
): number | undefined => {
  if (hasAuthoritativeStopLossRiskContext(data)) {
    return calculateStopLossRiskAmount(data);
  }

  if (isValidPositiveRiskAmount(data.riskAmount)) {
    return data.riskAmount;
  }

  if (isValidPositiveRiskAmount(defaultRiskAmount)) {
    return defaultRiskAmount;
  }

  return undefined;
};


export const resolveTradeRiskAmount = (
  data: Partial<TradeFormData>
): number | undefined => {
  if (hasAuthoritativeStopLossRiskContext(data)) {
    const stopLossRiskAmount = calculateStopLossRiskAmount(data);
    if (stopLossRiskAmount > 0) {
      return stopLossRiskAmount;
    }
  }

  const manualRiskAmount = data.riskAmount;
  if (isValidPositiveRiskAmount(manualRiskAmount)) {
    return manualRiskAmount;
  }

  return undefined;
};
