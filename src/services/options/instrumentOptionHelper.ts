import { Plugin } from 'obsidian';
import { CustomOptionsService, OptionType } from './CustomOptionsService';

type PluginWithOptionsService = Plugin & {
  optionsService?: CustomOptionsService;
};

export async function ensureInstrumentOptionsExist(
  plugin: PluginWithOptionsService,
  trades: Array<{ symbol: string; assetType?: string }>
): Promise<void> {
  try {
    const optionsService =
      plugin.optionsService || new CustomOptionsService(plugin);
    const existingByAssetType = new Map<string, Set<string>>();
    const uniqueKeys = new Set<string>();

    for (const trade of trades) {
      const symbol = String(trade.symbol || '').trim();
      if (!symbol) continue;

      const assetType = String(trade.assetType || 'stock').trim() || 'stock';
      uniqueKeys.add(`${assetType}::${symbol}`);
    }

    for (const key of uniqueKeys) {
      const separatorIndex = key.search(/::/);
      if (separatorIndex <= 0) {
        continue;
      }

      const assetType = key.substring(0, separatorIndex);
      const symbol = key.substring(separatorIndex + 2);
      if (!assetType || !symbol) {
        continue;
      }

      let existing = existingByAssetType.get(assetType);
      if (!existing) {
        existing = new Set(
          optionsService.getInstrumentsForAssetType(assetType)
        );
        existingByAssetType.set(assetType, existing);
      }

      if (existing.has(symbol)) {
        continue;
      }

      await optionsService.addOption(OptionType.INSTRUMENT, symbol, assetType);
      existing.add(symbol);
    }
  } catch (error) {
    console.error('Failed to auto-create imported instrument options:', error);
  }
}
