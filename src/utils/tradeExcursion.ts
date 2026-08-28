import {
  calculateAssetAdjustedPriceMoveValue,
  type PriceMoveValueInput,
} from './priceMoveValue';
import { calculateDirectionalPriceDiff } from './pnlCalculation';
import {
  getTotalEntrySize,
  getWeightedAverageEntryPrice,
} from './tradeStatusUtils';

export type TradeExcursionInput = PriceMoveValueInput & {
  mae?: number;
  mfe?: number;
  maePrice?: number;
  mfePrice?: number;
  entryPrice?: number;
  positionSize?: number;
  direction?: string;
  originalMaeBeforeConversion?: number;
  originalMfeBeforeConversion?: number;
  maeAmountDerivedFromPrice?: boolean;
  mfeAmountDerivedFromPrice?: boolean;
  maeTicksBeforeConversion?: number;
  mfeTicksBeforeConversion?: number;
  entries?: Array<{
    time?: Date | string | null;
    price?: number | null;
    size?: number | null;
  }>;
};

function getTradeExcursionTicks(
  trade: TradeExcursionInput | undefined,
  side: 'mae' | 'mfe'
): number | undefined {
  if (
    !trade ||
    trade.assetType?.trim().toLowerCase() !== 'futures' ||
    typeof trade.tickSize !== 'number' ||
    !Number.isFinite(trade.tickSize) ||
    trade.tickSize <= 0
  ) {
    return undefined;
  }
  const tickSize = trade.tickSize;
  const excursionPrice = side === 'mae' ? trade.maePrice : trade.mfePrice;
  const excursionAmount = side === 'mae' ? trade.mae : trade.mfe;
  const originalExcursionAmount =
    side === 'mae'
      ? trade.originalMaeBeforeConversion
      : trade.originalMfeBeforeConversion;
  const amountDerivedFromPrice =
    side === 'mae'
      ? trade.maeAmountDerivedFromPrice
      : trade.mfeAmountDerivedFromPrice;
  const ticksBeforeConversion =
    side === 'mae'
      ? trade.maeTicksBeforeConversion
      : trade.mfeTicksBeforeConversion;

  if (
    typeof ticksBeforeConversion === 'number' &&
    Number.isFinite(ticksBeforeConversion)
  ) {
    return Math.abs(ticksBeforeConversion);
  }

  const getPriceTicks = (): number | undefined => {
    const entryPrice = getWeightedAverageEntryPrice(trade);
    if (
      typeof excursionPrice !== 'number' ||
      !Number.isFinite(excursionPrice) ||
      entryPrice === null
    ) {
      return undefined;
    }
    const priceDiff = calculateDirectionalPriceDiff(
      { assetType: trade.assetType, direction: trade.direction },
      entryPrice,
      excursionPrice
    );
    if (priceDiff === null) return undefined;
    const ticks = Math.abs(priceDiff) / tickSize;
    return Number.isFinite(ticks) ? ticks : undefined;
  };

  const getAmountTicks = (): number | undefined => {
    const amount = originalExcursionAmount ?? excursionAmount;
    const positionSize = getTotalEntrySize(trade);
    if (
      typeof amount !== 'number' ||
      !Number.isFinite(amount) ||
      typeof trade.tickValue !== 'number' ||
      !Number.isFinite(trade.tickValue) ||
      trade.tickValue <= 0 ||
      positionSize === null ||
      positionSize <= 0
    ) {
      return undefined;
    }

    const ticks = Math.abs(amount) / (trade.tickValue * positionSize);
    return Number.isFinite(ticks) ? ticks : undefined;
  };

  return amountDerivedFromPrice
    ? (getPriceTicks() ?? getAmountTicks())
    : (getAmountTicks() ?? getPriceTicks());
}

export function getTradeMaeTicks(
  trade: TradeExcursionInput | undefined
): number | undefined {
  return getTradeExcursionTicks(trade, 'mae');
}

export function getTradeMfeTicks(
  trade: TradeExcursionInput | undefined
): number | undefined {
  return getTradeExcursionTicks(trade, 'mfe');
}

export function getTradeMfeValue(
  trade: TradeExcursionInput | undefined
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
    if (priceDiff === null) {
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
  trade: TradeExcursionInput | undefined
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
    if (priceDiff === null) {
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

type PreConversionExcursionResolution =
  | { changed: false }
  | {
      changed: true;
      fields: Pick<
        TradeExcursionInput,
        | 'mae'
        | 'mfe'
        | 'maeAmountDerivedFromPrice'
        | 'mfeAmountDerivedFromPrice'
        | 'maeTicksBeforeConversion'
        | 'mfeTicksBeforeConversion'
      >;
    };

export function resolvePreConversionExcursionFields(
  trade: TradeExcursionInput
): PreConversionExcursionResolution {
  const mae = trade.mae ?? getTradeMaeValue(trade);
  const mfe = trade.mfe ?? getTradeMfeValue(trade);
  const maeAmountDerivedFromPrice =
    trade.maeAmountDerivedFromPrice ??
    (trade.mae === undefined && mae !== undefined ? true : undefined);
  const mfeAmountDerivedFromPrice =
    trade.mfeAmountDerivedFromPrice ??
    (trade.mfe === undefined && mfe !== undefined ? true : undefined);
  const maeTicksBeforeConversion =
    trade.maeTicksBeforeConversion ?? getTradeMaeTicks(trade);
  const mfeTicksBeforeConversion =
    trade.mfeTicksBeforeConversion ?? getTradeMfeTicks(trade);

  if (
    mae === trade.mae &&
    mfe === trade.mfe &&
    maeAmountDerivedFromPrice === trade.maeAmountDerivedFromPrice &&
    mfeAmountDerivedFromPrice === trade.mfeAmountDerivedFromPrice &&
    maeTicksBeforeConversion === trade.maeTicksBeforeConversion &&
    mfeTicksBeforeConversion === trade.mfeTicksBeforeConversion
  ) {
    return { changed: false };
  }

  return {
    changed: true,
    fields: {
      mae,
      mfe,
      maeAmountDerivedFromPrice,
      mfeAmountDerivedFromPrice,
      maeTicksBeforeConversion,
      mfeTicksBeforeConversion,
    },
  };
}
