

import { AssetType } from './types';


export function roundToPrecision(value: number, decimals: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  const factor = 10 ** decimals;
  const epsilon = value >= 0 ? Number.EPSILON : -Number.EPSILON;
  const rounded = Math.round((value + epsilon) * factor) / factor;

  return Object.is(rounded, -0) ? 0 : rounded;
}


export function getPricePrecision(assetType?: string): number {
  switch (assetType) {
    case AssetType.FOREX:
      
      return 5;
    case AssetType.CRYPTO:
      
      return 8;
    case AssetType.FUTURES:
      
      return 4;
    case AssetType.OPTIONS:
      
      return 4;
    case AssetType.STOCK:
      
      return 2;
    case AssetType.CFD:
      
      return 4;
    default:
      
      return 4;
  }
}


export function getSizePrecision(assetType?: string): number {
  switch (assetType) {
    case AssetType.FOREX:
      
      return 4;
    case AssetType.CRYPTO:
      
      return 8;
    case AssetType.FUTURES:
      
      return 0;
    case AssetType.OPTIONS:
      
      return 0;
    case AssetType.STOCK:
      
      return 2;
    case AssetType.CFD:
      
      return 2;
    default:
      
      return 2;
  }
}
