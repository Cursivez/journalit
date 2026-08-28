import { safeString } from './safeString';
export type PriceMoveValueInput = {
  assetType?: string;
  contractSize?: number;
  dollarPerPoint?: number;
  tickSize?: number;
  tickValue?: number;
  lotSize?: number;
  pipValue?: number;
  pipSize?: number;
  forexPnlConversionRate?: number;
};

export type PriceMoveValueSource = {
  [K in keyof PriceMoveValueInput]?: unknown;
};

export function extractPriceMoveValueFields(
  value: PriceMoveValueSource
): PriceMoveValueInput {
  const getFiniteNumber = (field: keyof PriceMoveValueInput) => {
    const candidate = value[field];
    return typeof candidate === 'number' && Number.isFinite(candidate)
      ? candidate
      : undefined;
  };

  return {
    assetType:
      typeof value.assetType === 'string' ? value.assetType : undefined,
    contractSize: getFiniteNumber('contractSize'),
    dollarPerPoint: getFiniteNumber('dollarPerPoint'),
    tickSize: getFiniteNumber('tickSize'),
    tickValue: getFiniteNumber('tickValue'),
    lotSize: getFiniteNumber('lotSize'),
    pipValue: getFiniteNumber('pipValue'),
    pipSize: getFiniteNumber('pipSize'),
    forexPnlConversionRate: getFiniteNumber('forexPnlConversionRate'),
  } satisfies Record<keyof PriceMoveValueInput, unknown>;
}

function normalizeAssetType(assetType: unknown): string {
  return safeString(assetType).toLowerCase();
}

const isPositiveFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value > 0;

type FuturesTickEconomics = PriceMoveValueInput & {
  tickSize: number;
  tickValue: number;
};

const hasFuturesTickEconomics = (
  trade: PriceMoveValueInput
): trade is FuturesTickEconomics =>
  isPositiveFiniteNumber(trade.tickSize) &&
  isPositiveFiniteNumber(trade.tickValue);


export function hasAuthoritativePriceMoveMultiplier(
  trade: PriceMoveValueInput
): boolean {
  switch (normalizeAssetType(trade.assetType)) {
    case 'options':
      return isPositiveFiniteNumber(trade.contractSize);
    case 'futures':
      return (
        hasFuturesTickEconomics(trade) ||
        isPositiveFiniteNumber(trade.dollarPerPoint)
      );
    case 'forex':
      return (
        isPositiveFiniteNumber(trade.lotSize) ||
        isPositiveFiniteNumber(trade.pipValue)
      );
    case 'cfd':
      
      
      return isPositiveFiniteNumber(trade.contractSize);
    default:
      return true;
  }
}


export function calculateAssetAdjustedPriceMoveValue(
  trade: PriceMoveValueInput,
  priceDiff: number,
  size: number
): number {
  let value = priceDiff * size;

  switch (normalizeAssetType(trade.assetType)) {
    case 'options': {
      if (isPositiveFiniteNumber(trade.contractSize)) {
        value = priceDiff * size * trade.contractSize;
      }
      break;
    }

    case 'futures': {
      if (hasFuturesTickEconomics(trade)) {
        const ticks = priceDiff / trade.tickSize;
        value = ticks * trade.tickValue * size;
      } else if (isPositiveFiniteNumber(trade.dollarPerPoint)) {
        value = priceDiff * size * trade.dollarPerPoint;
      }
      break;
    }

    case 'forex': {
      if (isPositiveFiniteNumber(trade.lotSize)) {
        value = priceDiff * size * trade.lotSize;
        if (isPositiveFiniteNumber(trade.forexPnlConversionRate)) {
          value *= trade.forexPnlConversionRate;
        }
      } else if (isPositiveFiniteNumber(trade.pipValue)) {
        const pipSize = isPositiveFiniteNumber(trade.pipSize)
          ? trade.pipSize
          : 0.0001;
        const pips = priceDiff / pipSize;
        value = pips * trade.pipValue * size;
      }
      break;
    }

    case 'cfd': {
      const contractSize = isPositiveFiniteNumber(trade.contractSize)
        ? trade.contractSize
        : 1;
      value = priceDiff * size * contractSize;
      break;
    }
  }

  return value;
}
