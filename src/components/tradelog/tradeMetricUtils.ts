import type { TradeFormData } from '../forms/trade/types';
import { calculateAssetAdjustedPriceMoveValue } from '../../utils/priceMoveValue';
import { resolveEffectiveRiskAmount } from '../../utils/riskCalculation';
import {
  getResolvedWeightedAverageExitPrice,
  getTotalEntrySize,
  getWeightedAverageEntryPrice,
  isTradeOpenWithContext,
} from '../../utils/tradeStatusUtils';
import { calculateDirectionalPriceDiff } from '../../utils/pnlCalculation';
import { safeString } from '../../utils/safeString';

type TradeMetricInput = {
  mae?: number;
  mfe?: number;
  maePrice?: number;
  mfePrice?: number;
  entryPrice?: number;
  exitPrice?: number;
  positionSize?: number;
  direction?: string;
  assetType?: string;
  hasExplicitExitPrice?: boolean;
  leverageRatio?: number;
  stopLoss?: number;
  riskAmount?: number;
  contractSize?: number;
  dollarPerPoint?: number;
  tickSize?: number;
  tickValue?: number;
  lotSize?: number;
  pipValue?: number;
  tradeStatus?: string;
  exitTime?: Date | string | null;
  pnl?: number | null;
  useDirectPnLInput?: boolean;
  exits?: Array<{
    time?: Date | string | null;
    price?: number | null;
    size?: number | null;
    hasExplicitPrice?: boolean;
  }>;
  entries?: Array<{
    time?: Date | string | null;
    price?: number | null;
    size?: number | null;
  }>;
};

const toRiskCalculationInput = (
  trade: TradeMetricInput
): Partial<TradeFormData> => ({
  assetType: trade.assetType,
  entryPrice: trade.entryPrice,
  positionSize: trade.positionSize,
  entries: trade.entries
    ?.filter(
      (entry): entry is { price: number; size: number } =>
        typeof entry.price === 'number' && typeof entry.size === 'number'
    )
    .map((entry) => ({ price: entry.price, size: entry.size })),
  stopLoss: trade.stopLoss,
  riskAmount: trade.riskAmount,
  contractSize: trade.contractSize,
  dollarPerPoint: trade.dollarPerPoint,
  lotSize: trade.lotSize,
  pipValue: trade.pipValue,
  tickSize: trade.tickSize,
  tickValue: trade.tickValue,
});

function normalizeAssetType(assetType: unknown): string {
  return safeString(assetType).toLowerCase();
}

export function getTradeMfeValue(
  trade: TradeMetricInput | undefined
): number | undefined {
  if (typeof trade?.mfe === 'number' && Number.isFinite(trade.mfe)) {
    return trade.mfe;
  }

  const entryPrice = trade ? getWeightedAverageEntryPrice(trade) : null;
  const positionSize = trade ? getTotalEntrySize(trade) : null;

  if (
    trade &&
    typeof trade.mfePrice === 'number' &&
    Number.isFinite(trade.mfePrice) &&
    entryPrice !== null &&
    positionSize !== null
  ) {
    const priceDiff = calculateDirectionalPriceDiff(
      { assetType: trade.assetType, direction: trade.direction },
      entryPrice,
      trade.mfePrice
    );
    if (priceDiff === null || positionSize === null) {
      return undefined;
    }
    const value = calculateAssetAdjustedPriceMoveValue(
      trade,
      priceDiff,
      positionSize
    );
    return Number.isFinite(value) ? value : undefined;
  }

  return undefined;
}

export function getTradeMaeValue(
  trade: TradeMetricInput | undefined
): number | undefined {
  if (typeof trade?.mae === 'number' && Number.isFinite(trade.mae)) {
    return trade.mae;
  }

  const entryPrice = trade ? getWeightedAverageEntryPrice(trade) : null;
  const positionSize = trade ? getTotalEntrySize(trade) : null;

  if (
    trade &&
    typeof trade.maePrice === 'number' &&
    Number.isFinite(trade.maePrice) &&
    entryPrice !== null &&
    positionSize !== null
  ) {
    const priceDiff = calculateDirectionalPriceDiff(
      { assetType: trade.assetType, direction: trade.direction },
      entryPrice,
      trade.maePrice
    );
    if (priceDiff === null || positionSize === null) {
      return undefined;
    }
    const value = calculateAssetAdjustedPriceMoveValue(
      trade,
      priceDiff,
      positionSize
    );
    return Number.isFinite(value) ? value : undefined;
  }

  return undefined;
}

export function calculateTradeMaxR(
  trade: TradeMetricInput | undefined,
  defaultRiskAmount?: number
): number | undefined {
  const mfeValue = getTradeMfeValue(trade);
  const normalizedTrade =
    trade === undefined
      ? undefined
      : ({
          ...trade,
          assetType: normalizeAssetType(trade.assetType),
        } as TradeMetricInput);

  const riskCalculationInput = normalizedTrade
    ? toRiskCalculationInput(normalizedTrade)
    : undefined;
  const effectiveRiskAmountWithoutDefault = riskCalculationInput
    ? resolveEffectiveRiskAmount(riskCalculationInput, undefined)
    : undefined;

  const manualRiskAmount = normalizedTrade?.riskAmount;
  const hasExplicitManualRisk =
    manualRiskAmount !== undefined && manualRiskAmount !== null;
  const hasValidPositiveManualRisk =
    typeof manualRiskAmount === 'number' &&
    Number.isFinite(manualRiskAmount) &&
    manualRiskAmount > 0;

  if (
    hasExplicitManualRisk &&
    !hasValidPositiveManualRisk &&
    effectiveRiskAmountWithoutDefault === undefined
  ) {
    return undefined;
  }

  const effectiveRiskAmount =
    effectiveRiskAmountWithoutDefault ??
    (riskCalculationInput
      ? resolveEffectiveRiskAmount(riskCalculationInput, defaultRiskAmount)
      : undefined);

  if (
    mfeValue === undefined ||
    effectiveRiskAmount === undefined ||
    !Number.isFinite(effectiveRiskAmount) ||
    effectiveRiskAmount <= 0
  ) {
    return undefined;
  }

  const maxR = mfeValue / effectiveRiskAmount;
  return Number.isFinite(maxR) ? maxR : undefined;
}

export function calculateTradeReturnPercent(
  trade: TradeMetricInput | undefined
): number | undefined {
  if (!trade) {
    return undefined;
  }

  if (
    isTradeOpenWithContext({
      tradeStatus: trade.tradeStatus,
      exitTime: trade.exitTime,
      exitPrice: trade.exitPrice,
      pnl: trade.pnl,
      useDirectPnLInput: trade.useDirectPnLInput,
      exits: trade.exits,
      entries: trade.entries,
    })
  ) {
    return undefined;
  }

  if (trade.useDirectPnLInput) {
    return undefined;
  }

  const entryPrice = getWeightedAverageEntryPrice(trade);
  const exitPrice = getResolvedWeightedAverageExitPrice(trade);
  const priceDiff = calculateDirectionalPriceDiff(
    { assetType: trade.assetType, direction: trade.direction },
    entryPrice,
    exitPrice
  );

  if (entryPrice === null || priceDiff === null) {
    return undefined;
  }

  let percentReturn = (priceDiff / entryPrice) * 100;
  const assetType = String(trade.assetType || '').toLowerCase();
  const leverageRatio = Number(trade.leverageRatio);
  if (
    assetType === 'cfd' &&
    Number.isFinite(leverageRatio) &&
    leverageRatio > 0
  ) {
    percentReturn *= leverageRatio;
  }

  return Number.isFinite(percentReturn) ? percentReturn : undefined;
}
