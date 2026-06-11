import { TradeFormData, AssetType } from '../components/forms/trade/types';
import { calculateAssetAdjustedPriceMoveValue } from './priceMoveValue';
import { normalizeTradeExecution } from '../services/trade/core/TradeExecutionNormalization';

interface StopLossRiskContext {
  stopLoss: number;
  referenceEntryPrice: number;
  totalSize: number;
}

const resolveStopLossRiskContext = (
  data: Partial<TradeFormData>
): StopLossRiskContext | null => {
  if (
    data.stopLoss === undefined ||
    data.stopLoss === null ||
    !Number.isFinite(data.stopLoss)
  ) {
    return null;
  }

  const execution = normalizeTradeExecution(data, {
    deriveMissingExplicitness: true,
  });
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
  const referenceEntryPrice = execution.weightedEntryPrice ?? undefined;
  const totalSize = totalEntrySize || execution.positionSize || 0;

  if (referenceEntryPrice === undefined || totalSize <= 0) {
    return null;
  }

  return {
    stopLoss: data.stopLoss,
    referenceEntryPrice,
    totalSize,
  };
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

  const { stopLoss, referenceEntryPrice, totalSize } = context;
  const stopDistance = Math.abs(referenceEntryPrice - stopLoss);
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

  switch (data.assetType) {
    case AssetType.OPTIONS:
      return !!(data.contractSize && data.contractSize > 0);
    case AssetType.FUTURES:
      return !!(data.dollarPerPoint && data.dollarPerPoint > 0);
    case AssetType.FOREX:
      return !!(
        (data.lotSize && data.lotSize > 0) ||
        (data.pipValue && data.pipValue > 0)
      );
    case AssetType.CFD:
      return !!(data.contractSize && data.contractSize > 0);
    default:
      return true;
  }
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
