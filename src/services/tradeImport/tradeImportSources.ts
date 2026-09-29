

import { t } from '../../lang/helpers';
import type { BrokerLogo } from '../onboarding/brokerLogos.generated';
import {
  MANUAL_IMPORT_BROKER_ID,
  buildOnboardingBrokerOptions,
  getBrokerLogo,
  getSyncOnlyProviders,
  getTradeSyncSuggestion,
  type TradeSyncSuggestion,
} from '../onboarding/brokerCatalog';
import type { LocalCSVTemplate } from '../csv/types';
import type { OnboardingAssetFocus } from '../onboarding/types';
import type { JournalitSettings } from '../../settings/types';
import type JournalitPlugin from '../../main';
import type { TradeImportCapabilities } from './types';

export type TradeImportAssetType = LocalCSVTemplate['asset_type'];


export function tradeImportSourceLabel(
  brokerId: string,
  capabilities: TradeImportCapabilities | null
): string {
  if (brokerId === MANUAL_IMPORT_BROKER_ID) {
    return t('trade-import.source.manual.title');
  }
  return (
    capabilities?.brokers.find((broker) => broker.id === brokerId)?.label ??
    brokerId
  );
}

export interface TradeImportSourceOption {
  
  id: string;
  label: string;
  logo?: BrokerLogo;
  
  tradeSync?: TradeSyncSuggestion;
  
  syncOnly?: true;
}


export function buildTradeImportSourceOptions(
  capabilities: TradeImportCapabilities,
  favoriteBrokerId?: string
): TradeImportSourceOption[] {
  const importBrokers = new Map(
    capabilities.brokers.map((broker) => [broker.id.toUpperCase(), broker])
  );
  const syncOnlyProviders = new Map(
    getSyncOnlyProviders(new Set(importBrokers.keys())).map((suggestion) => [
      suggestion.providerId,
      suggestion,
    ])
  );
  
  
  const options: TradeImportSourceOption[] = [];

  for (const entry of buildOnboardingBrokerOptions(capabilities)) {
    const syncOnly = entry.syncProviderId
      ? syncOnlyProviders.get(entry.syncProviderId)
      : undefined;
    if (entry.method === 'sync' && syncOnly) {
      const logo = getBrokerLogo(syncOnly.providerId);
      options.push({
        id: `sync:${syncOnly.providerId}`,
        label: syncOnly.providerLabel,
        ...(logo ? { logo } : {}),
        tradeSync: syncOnly,
        syncOnly: true,
      });
      continue;
    }
    const broker = entry.importBrokerId
      ? importBrokers.get(entry.importBrokerId.toUpperCase())
      : undefined;
    
    
    if (!broker || broker.id === MANUAL_IMPORT_BROKER_ID) continue;
    const logo = getBrokerLogo(broker.id);
    const tradeSync = getTradeSyncSuggestion(broker.id);
    options.push({
      id: broker.id,
      label: broker.label,
      ...(logo ? { logo } : {}),
      ...(tradeSync ? { tradeSync } : {}),
    });
  }

  const favorite = options.find((option) => option.id === favoriteBrokerId);
  return favorite
    ? [favorite, ...options.filter((option) => option !== favorite)]
    : options;
}


const SINGLE_ASSET_CLASS_BROKERS: Readonly<
  Record<string, TradeImportAssetType>
> = {
  TRADOVATE: 'futures',
  TOPSTEPX: 'futures',
  RITHMIC: 'futures',
  DEEPCHARTS: 'futures',
  TRADINGTECHNOLOGIES: 'futures',
  METATRADER: 'forex',
  CTRADER: 'forex',
  HYPERLIQUID: 'crypto',
  BYBIT: 'crypto',
  BLOFIN: 'crypto',
  BREAKOUT: 'crypto',
  TRADEZERO: 'stock',
};

export const isTradeImportAssetType = (
  value: unknown
): value is TradeImportAssetType =>
  value === 'stock' ||
  value === 'options' ||
  value === 'futures' ||
  value === 'forex' ||
  value === 'crypto';


const FALLBACK_ASSET_TYPE: TradeImportAssetType = 'stock';


export function defaultTradeImportAssetType(
  settings: Pick<JournalitSettings, 'csvLastAssetType'>,
  brokerId: string,
  onboardingAssetFocus?: OnboardingAssetFocus
): TradeImportAssetType {
  const remembered = brokerId
    ? settings.csvLastAssetType?.[brokerId]
    : undefined;
  if (isTradeImportAssetType(remembered)) return remembered;
  const inferred = SINGLE_ASSET_CLASS_BROKERS[brokerId.toUpperCase()];
  if (inferred) return inferred;
  const last = settings.csvLastAssetType?.__last;
  if (isTradeImportAssetType(last)) return last;
  
  return isTradeImportAssetType(onboardingAssetFocus)
    ? onboardingAssetFocus
    : FALLBACK_ASSET_TYPE;
}


export async function rememberTradeImportAssetType(
  plugin: Pick<JournalitPlugin, 'settings' | 'saveSettings'>,
  brokerId: string,
  assetType: TradeImportAssetType
): Promise<void> {
  const current = plugin.settings.csvLastAssetType ?? {};
  if (
    current.__last === assetType &&
    (!brokerId || current[brokerId] === assetType)
  ) {
    return;
  }
  plugin.settings.csvLastAssetType = {
    ...current,
    ...(brokerId ? { [brokerId]: assetType } : {}),
    __last: assetType,
  };
  await plugin.saveSettings();
}
