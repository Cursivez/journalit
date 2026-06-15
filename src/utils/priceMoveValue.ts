import { safeString } from './safeString';
type PriceMoveValueInput = {
  assetType?: string;
  contractSize?: number;
  dollarPerPoint?: number;
  tickSize?: number;
  tickValue?: number;
  lotSize?: number;
  pipValue?: number;
};

function normalizeAssetType(assetType: unknown): string {
  return safeString(assetType).toLowerCase();
}


export function calculateAssetAdjustedPriceMoveValue(
  trade: PriceMoveValueInput,
  priceDiff: number,
  size: number
): number {
  let value = priceDiff * size;

  switch (normalizeAssetType(trade.assetType)) {
    case 'options': {
      if (
        typeof trade.contractSize === 'number' &&
        Number.isFinite(trade.contractSize) &&
        trade.contractSize > 0
      ) {
        value = priceDiff * size * trade.contractSize;
      }
      break;
    }

    case 'futures': {
      if (
        typeof trade.dollarPerPoint === 'number' &&
        Number.isFinite(trade.dollarPerPoint) &&
        trade.dollarPerPoint > 0
      ) {
        value = priceDiff * size * trade.dollarPerPoint;

        if (
          typeof trade.tickValue === 'number' &&
          Number.isFinite(trade.tickValue) &&
          trade.tickValue > 0 &&
          typeof trade.tickSize === 'number' &&
          Number.isFinite(trade.tickSize) &&
          trade.tickSize > 0
        ) {
          const ticks = priceDiff / trade.tickSize;
          value = ticks * trade.tickValue * size;
        }
      }
      break;
    }

    case 'forex': {
      if (
        typeof trade.lotSize === 'number' &&
        Number.isFinite(trade.lotSize) &&
        trade.lotSize > 0
      ) {
        value = priceDiff * size * trade.lotSize;
      } else if (
        typeof trade.pipValue === 'number' &&
        Number.isFinite(trade.pipValue) &&
        trade.pipValue > 0
      ) {
        const pips = priceDiff * 10000;
        value = pips * trade.pipValue * size;
      }
      break;
    }

    case 'cfd': {
      const contractSize =
        typeof trade.contractSize === 'number' &&
        Number.isFinite(trade.contractSize) &&
        trade.contractSize > 0
          ? trade.contractSize
          : 1;
      value = priceDiff * size * contractSize;
      break;
    }
  }

  return value;
}
