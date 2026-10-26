

import { BROKER_LOGOS, type BrokerLogo } from './brokerLogos.generated';
import type { BrokerSyncProviderId } from '../tradeSync/types';
import type { TradeImportCapabilities } from '../tradeImport/types';
import type { OnboardingAssetFocus } from './types';
import { t } from '../../lang/helpers';


type OnboardingSyncProviderId = 'metatrader' | BrokerSyncProviderId;


export const MANUAL_IMPORT_BROKER_ID = 'MANUAL';


export const getBrokerLogo = (id: string): BrokerLogo | undefined =>
  BROKER_LOGOS[id.toLowerCase()];

export interface OnboardingBrokerOption {
  id: string;
  label: string;
  method: 'sync' | 'import';
  
  syncProviderId?: OnboardingSyncProviderId;
  
  importBrokerId?: string;
  
  inferredAssetFocus?: OnboardingAssetFocus;
  
  logo?: BrokerLogo;
}

interface SyncProviderDefinition {
  id: OnboardingSyncProviderId;
  label: () => string;
  
  importBrokerIds: string[];
  
  partialImportBrokerIds?: string[];
  inferredAssetFocus: OnboardingAssetFocus;
  
  scopeDescription?: () => string;
}


const IMPORT_LABEL_OVERRIDES: Readonly<Record<string, () => string>> = {
  METATRADER: () => t('onboarding.broker.option.metatrader5.label'),
};


const IMPORT_USAGE_ORDER: readonly string[] = [
  'METATRADER',
  'DEEPCHARTS',
  'IBKR',
  'TOPSTEPX',
  'FXREPLAY',
  'ATAS',
  'HYPERLIQUID',
  'MOTIVEWAVE',
  'BREAKOUT',
  'RITHMIC',
  'TRADINGVIEW',
];


interface ImportFormatGroup {
  label: () => string;
  formats: readonly {
    brokerId: string;
    label: () => string;
    hint: () => string;
  }[];
}

const IMPORT_FORMAT_GROUPS: readonly ImportFormatGroup[] = [
  {
    label: () => 'TradingView',
    formats: [
      {
        brokerId: 'TRADINGVIEW',
        label: () => t('trade-import.format.tradingview.paper'),
        hint: () => t('trade-import.format.tradingview.paper-hint'),
      },
      {
        brokerId: 'TRADINGVIEW_STRATEGY',
        label: () => t('trade-import.format.tradingview.strategy'),
        hint: () => t('trade-import.format.tradingview.strategy-hint'),
      },
    ],
  },
];

const importFormatGroup = (brokerId: string): ImportFormatGroup | undefined => {
  const normalized = brokerId.toUpperCase();
  return IMPORT_FORMAT_GROUPS.find((group) =>
    group.formats.some((format) => format.brokerId === normalized)
  );
};

type ImportBrokerCapabilities = Pick<TradeImportCapabilities, 'brokers'>;


const availableGroupFormats = (
  group: ImportFormatGroup,
  capabilities: ImportBrokerCapabilities | null
): ImportFormatGroup['formats'] => {
  const available = new Set(
    capabilities?.brokers.map((broker) => broker.id.toUpperCase()) ?? []
  );
  return group.formats.filter((format) => available.has(format.brokerId));
};


export const importSourceTileId = (
  brokerId: string,
  capabilities: ImportBrokerCapabilities | null
): string => {
  const group = importFormatGroup(brokerId);
  if (!group) return brokerId;
  return availableGroupFormats(group, capabilities)[0]?.brokerId ?? brokerId;
};

interface TradeImportFormatOption {
  brokerId: string;
  label: string;
  hint: string;
}


export function getImportFormatOptions(
  brokerId: string,
  capabilities: ImportBrokerCapabilities | null
): TradeImportFormatOption[] {
  const group = importFormatGroup(brokerId);
  if (!group) return [];
  const formats = availableGroupFormats(group, capabilities);
  return formats.length > 1
    ? formats.map((format) => ({
        brokerId: format.brokerId,
        label: format.label(),
        hint: format.hint(),
      }))
    : [];
}


export const importPlatformLabel = (
  brokerId: string,
  capabilities: ImportBrokerCapabilities | null
): string | undefined =>
  getImportFormatOptions(brokerId, capabilities).length > 0
    ? importFormatGroup(brokerId)?.label()
    : undefined;


export const importFormatForTile = (
  tileId: string,
  favoriteBrokerId: string | undefined,
  capabilities: ImportBrokerCapabilities | null
): string =>
  favoriteBrokerId &&
  capabilities?.brokers.some((broker) => broker.id === favoriteBrokerId) &&
  importSourceTileId(favoriteBrokerId, capabilities) === tileId
    ? favoriteBrokerId
    : tileId;

const importRank = (id: string | undefined): number => {
  const index = IMPORT_USAGE_ORDER.indexOf((id ?? '').toUpperCase());
  return index < 0 ? IMPORT_USAGE_ORDER.length : index;
};

const SYNC_PROVIDERS: readonly SyncProviderDefinition[] = [
  {
    id: 'tradovate',
    label: () => t('trade-sync.source.tradovate'),
    importBrokerIds: ['TRADOVATE'],
    inferredAssetFocus: 'futures',
  },
  {
    id: 'ctrader',
    label: () => t('trade-sync.source.ctrader'),
    importBrokerIds: ['CTRADER'],
    inferredAssetFocus: 'forex',
  },
  {
    
    
    id: 'metatrader',
    label: () => t('onboarding.broker.option.metatrader4.label'),
    importBrokerIds: [],
    partialImportBrokerIds: ['METATRADER'],
    inferredAssetFocus: 'forex',
  },
  {
    
    
    id: 'hyperliquid',
    label: () => t('onboarding.broker.option.hyperliquid-sync.label'),
    importBrokerIds: [],
    partialImportBrokerIds: ['HYPERLIQUID'],
    inferredAssetFocus: 'crypto',
    scopeDescription: () => t('trade-sync.hyperliquid.scope-description'),
  },
];

function toTradeSyncSuggestion(
  provider: SyncProviderDefinition,
  coverage: TradeSyncSuggestion['coverage']
): TradeSyncSuggestion {
  return {
    providerId: provider.id,
    providerLabel: provider.label(),
    coverage,
    ...(provider.scopeDescription
      ? { scopeDescription: provider.scopeDescription() }
      : {}),
  };
}

export function getSyncProviderOptions(
  capabilities: TradeImportCapabilities | null = null
): OnboardingBrokerOption[] {
  return SYNC_PROVIDERS.map((provider) => {
    const logo = getBrokerLogo(provider.id);
    return {
      id: `sync:${provider.id}`,
      label: provider.label(),
      method: 'sync',
      syncProviderId: provider.id,
      importBrokerId: provider.importBrokerIds[0],
      inferredAssetFocus: provider.inferredAssetFocus,
      ...(logo ? { logo } : {}),
    };
  });
}


export interface TradeSyncSuggestion {
  providerId: OnboardingSyncProviderId;
  providerLabel: string;
  
  coverage: 'full' | 'partial';
  
  scopeDescription?: string;
}

export function getTradeSyncSuggestion(
  importBrokerId: string
): TradeSyncSuggestion | undefined {
  const normalized = importBrokerId.toUpperCase();
  for (const provider of SYNC_PROVIDERS) {
    const coverage = provider.importBrokerIds.includes(normalized)
      ? 'full'
      : provider.partialImportBrokerIds?.includes(normalized)
        ? 'partial'
        : undefined;
    if (coverage) return toTradeSyncSuggestion(provider, coverage);
  }
  return undefined;
}


export function getSyncOnlyProviders(
  importBrokerIds: ReadonlySet<string>
): TradeSyncSuggestion[] {
  const providers: TradeSyncSuggestion[] = [];
  for (const provider of SYNC_PROVIDERS) {
    const importable = [
      ...provider.importBrokerIds,
      ...(provider.partialImportBrokerIds ?? []),
    ].some((id) => importBrokerIds.has(id));
    if (importable) continue;
    providers.push(toTradeSyncSuggestion(provider, 'full'));
  }
  return providers;
}


export function getUnlistedBrokerOption(): OnboardingBrokerOption {
  return {
    id: 'import:unlisted',
    label: t('onboarding.broker.option.unlisted.label'),
    method: 'import',
    importBrokerId: MANUAL_IMPORT_BROKER_ID,
  };
}


export function buildOnboardingBrokerOptions(
  capabilities: TradeImportCapabilities | null
): OnboardingBrokerOption[] {
  const syncOptions = getSyncProviderOptions(capabilities);
  const coveredImportIds = new Set(
    SYNC_PROVIDERS.flatMap((provider) => provider.importBrokerIds)
  );
  const importOptions: OnboardingBrokerOption[] = [];
  for (const broker of capabilities?.brokers ?? []) {
    if (
      broker.id === MANUAL_IMPORT_BROKER_ID ||
      coveredImportIds.has(broker.id.toUpperCase()) ||
      
      importSourceTileId(broker.id, capabilities) !== broker.id
    ) {
      continue;
    }
    importOptions.push({
      id: `import:${broker.id}`,
      label:
        importPlatformLabel(broker.id, capabilities) ??
        IMPORT_LABEL_OVERRIDES[broker.id.toUpperCase()]?.() ??
        broker.label,
      method: 'import',
      importBrokerId: broker.id,
      ...(getBrokerLogo(broker.id) ? { logo: getBrokerLogo(broker.id) } : {}),
    });
  }
  importOptions.sort(
    (a, b) =>
      importRank(a.importBrokerId) - importRank(b.importBrokerId) ||
      a.label.localeCompare(b.label)
  );

  return [...syncOptions, ...importOptions, getUnlistedBrokerOption()];
}
