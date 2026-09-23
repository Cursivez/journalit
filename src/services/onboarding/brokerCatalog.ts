

import { BROKER_LOGOS, type BrokerLogo } from './brokerLogos.generated';
import type { BrokerSyncProviderId } from '../tradeSync/types';
import type { TradeImportCapabilities } from '../tradeImport/types';
import type { OnboardingAssetFocus } from './types';
import { t } from '../../lang/helpers';


export type OnboardingSyncProviderId = 'metatrader' | BrokerSyncProviderId;


export const MANUAL_IMPORT_BROKER_ID = 'MANUAL';


const getBrokerLogo = (id: string): BrokerLogo | undefined =>
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
  inferredAssetFocus: OnboardingAssetFocus;
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
    inferredAssetFocus: 'forex',
  },
];

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
      coveredImportIds.has(broker.id.toUpperCase())
    ) {
      continue;
    }
    importOptions.push({
      id: `import:${broker.id}`,
      label:
        IMPORT_LABEL_OVERRIDES[broker.id.toUpperCase()]?.() ?? broker.label,
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
