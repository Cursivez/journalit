import type { TradeFormData } from '../forms/trade/types';
import { resolveEffectiveRiskAmount } from '../../utils/riskCalculation';
import {
  getResolvedWeightedAverageExitPrice,
  getWeightedAverageEntryPrice,
  isTradeOpenWithContext,
} from '../../utils/tradeStatusUtils';
import { calculateDirectionalPriceDiff } from '../../utils/pnlCalculation';
import { safeString } from '../../utils/safeString';
import {
  getTradeMfeValue,
  type TradeExcursionInput,
} from '../../utils/tradeExcursion';
import { extractPriceMoveValueFields } from '../../utils/priceMoveValue';

type TradeMetricInput = TradeExcursionInput & {
  exitPrice?: number;
  hasExplicitExitPrice?: boolean;
  leverageRatio?: number;
  stopLoss?: number;
  riskAmount?: number;
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
};

const toRiskCalculationInput = (
  trade: TradeMetricInput
): Partial<TradeFormData> => ({
  ...extractPriceMoveValueFields(trade),
  entryPrice: trade.entryPrice,
  positionSize: trade.positionSize,
  entries: trade.entries?.reduce<{ price: number; size: number }[]>(
    (acc, entry) => {
      if (typeof entry.price === 'number' && typeof entry.size === 'number') {
        acc.push({ price: entry.price, size: entry.size });
      }
      return acc;
    },
    []
  ),
  stopLoss: trade.stopLoss,
  riskAmount: trade.riskAmount,
});

function normalizeAssetType(assetType: unknown): string {
  return safeString(assetType).toLowerCase();
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
