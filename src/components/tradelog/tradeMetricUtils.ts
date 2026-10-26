import type { StopLossTarget } from '../../services/trade/core/StopLossTargets';
import type { TradeFormData } from '../forms/trade/types';
import { resolveEffectiveRiskAmount } from '../../utils/riskCalculation';
import {
  getTotalEntrySize,
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

export type TradeMetricInput = TradeExcursionInput & {
  exitPrice?: number;
  hasExplicitExitPrice?: boolean;
  leverageRatio?: number;
  stopLosses?: StopLossTarget[];
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
  stopLosses: trade.stopLosses,
  direction: trade.direction,
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

type MaeMfePercentTrade = {
  entries?: Array<{
    price?: number | string | null;
    size?: number | string | null;
  }>;
  entryPrice?: number | string | null;
  positionSize?: number | string | null;
  direction?: string;
  assetType?: string;
  mae?: number | string | null;
  mfe?: number | string | null;
  maePrice?: number | string | null;
  mfePrice?: number | string | null;
};

function parseFiniteSortNumber(value: unknown): number | null {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  const parsed = typeof value === 'number' ? value : Number(safeString(value));
  return Number.isFinite(parsed) ? parsed : null;
}

export function getMaeMfePercent(
  trade: Record<string, unknown> | undefined,
  valueField: 'mae' | 'mfe',
  priceField: 'maePrice' | 'mfePrice'
): number | null {
  const metricTrade = trade as MaeMfePercentTrade | undefined;
  if (!metricTrade) {
    return null;
  }

  const entryPrice = getWeightedAverageEntryPrice(metricTrade);
  if (entryPrice === null || entryPrice === 0) {
    return null;
  }

  const metricPrice = parseFiniteSortNumber(metricTrade[priceField]);
  if (metricPrice !== null) {
    const priceDiff = calculateDirectionalPriceDiff(
      {
        assetType: metricTrade.assetType,
        direction: getMaeMfeSortDirection(metricTrade.direction),
      },
      entryPrice,
      metricPrice
    );

    if (priceDiff !== null) {
      const percent = (priceDiff / entryPrice) * 100;
      return Number.isFinite(percent) ? percent : null;
    }
  }

  const metricValue = parseFiniteSortNumber(metricTrade[valueField]);
  const positionSize = getTotalEntrySize(metricTrade);
  if (metricValue === null || positionSize === null || positionSize === 0) {
    return null;
  }

  const percent = (metricValue / (entryPrice * positionSize)) * 100;
  return Number.isFinite(percent) ? percent : null;
}

function getMaeMfeSortDirection(direction: unknown): string {
  const normalizedDirection = safeString(direction).toLowerCase();
  return normalizedDirection === 'short' || normalizedDirection === 'sell'
    ? normalizedDirection
    : 'long';
}
