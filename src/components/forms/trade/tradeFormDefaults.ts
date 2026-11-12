import type { TradeFormLayoutSettings } from '../../../settings/types';
import { normalizeAccountLookupKey } from '../../../services/trade/core/TradeAccountIdentity';


export function resolveFavoriteSymbol(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

interface FavoriteSymbolContext {
  layout: Pick<TradeFormLayoutSettings, 'assetTypeMode' | 'defaultAssetType'>;
  favoriteSymbol: string;
  
  assetType: string | undefined;
  isSymbolKnownFor: (symbol: string, assetType: string) => boolean;
}


export function resolveFavoriteSymbolForNewTrade({
  layout,
  favoriteSymbol,
  assetType,
  isSymbolKnownFor,
}: FavoriteSymbolContext): string | undefined {
  if (!favoriteSymbol) return undefined;
  if (!assetType) return favoriteSymbol;
  if (layout.assetTypeMode === 'fixed') {
    return assetType === layout.defaultAssetType ? favoriteSymbol : undefined;
  }
  return isSymbolKnownFor(favoriteSymbol, assetType)
    ? favoriteSymbol
    : undefined;
}


export function resolveFavoriteAccountToPrefill(
  favoriteAccounts: readonly string[],
  selectableAccountNames: readonly string[]
): string | undefined {
  const starred = selectableAccountNames.filter((name) =>
    favoriteAccounts.some(
      (favorite) =>
        normalizeAccountLookupKey(favorite) === normalizeAccountLookupKey(name)
    )
  );
  return starred.length === 1 ? starred[0] : undefined;
}
