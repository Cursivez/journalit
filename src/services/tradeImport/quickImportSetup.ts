import type JournalitPlugin from '../../main';
import { LocalTemplateService } from '../csv/LocalTemplateService';
import type { LocalCSVTemplate, ManualImportMode } from '../csv/types';
import { canonicalTradeImportBrokerId } from './brokerIds';
import type { BackendTradeImportService } from './BackendTradeImportService';
import type { TradeImportCapabilities } from './types';
import {
  manualModeForBackend,
  missingRequiredFieldsForMappings,
} from './manualMappingValidation';
import {
  defaultTradeImportAssetType,
  tradeImportSourceLabel,
} from './tradeImportSources';

type TradeImportQuickSetupSource =
  | 'favorite-template'
  | 'favorites'
  | 'fallback';

type TradeImportQuickSetupState = 'ready' | 'needs_setup' | 'unavailable';

export interface TradeImportQuickSetup {
  state: TradeImportQuickSetupState;
  source: TradeImportQuickSetupSource;
  accountName: string;
  
  accountNames: string[];
  broker: string;
  brokerLabel: string;
  assetType: 'stock' | 'options' | 'futures' | 'forex' | 'crypto';
  manualMode: ManualImportMode;
  dateFormat: string;
  templateId?: string;
  templateName?: string;
  sheetName: string | null;
  headerRowIndex: number | null;
  columnMappings: Record<string, string[]>;
  aiMappingEnabled: boolean;
  message?: string;
}

export interface TradeImportQuickImportState {
  phase:
    | 'idle'
    | 'loading'
    | 'analysing'
    | 'ready_to_import'
    | 'importing'
    | 'complete'
    | 'needs_full_import'
    | 'unavailable'
    | 'error';
  message?: string;
}

interface CachedQuickTradeImportSetup {
  capabilities: TradeImportCapabilities;
  setup: TradeImportQuickSetup;
}

let cachedQuickSetup: CachedQuickTradeImportSetup | null = null;
let inFlightQuickSetup: Promise<CachedQuickTradeImportSetup> | null = null;

export function getCachedQuickTradeImportSetup(): CachedQuickTradeImportSetup | null {
  return cachedQuickSetup;
}

function accountNames(plugin: JournalitPlugin): string[] {
  const metadata = plugin.settings.account?.accountMetadata ?? {};
  const names = Object.values(metadata).flatMap((account) =>
    account.name ? [account.name] : []
  );
  return names.length ? names : ['Main Account'];
}

export async function loadTradeImportAccountNames(
  plugin: JournalitPlugin
): Promise<string[]> {
  const catalog = await plugin.accountPageService?.getAccountCatalog();
  const catalogNames = (catalog ?? []).flatMap((account) =>
    !account.archived && account.name ? [account.name] : []
  );
  return catalogNames.length ? catalogNames : accountNames(plugin);
}

function asMappings(value: unknown): Record<string, string[]> {
  if (!value || typeof value !== 'object') return {};
  const mappings: Record<string, string[]> = {};
  for (const [key, columns] of Object.entries(value)) {
    if (Array.isArray(columns)) {
      const normalized = columns.flatMap((column) => {
        const mappedColumn = String(column);
        return mappedColumn ? [mappedColumn] : [];
      });
      if (normalized.length > 0) mappings[key] = normalized;
      continue;
    }
    if (typeof columns === 'string' && columns.trim()) {
      mappings[key] = [columns.trim()];
    }
  }
  return mappings;
}

function validBroker(
  capabilities: TradeImportCapabilities,
  broker: string | undefined
): string | undefined {
  if (!broker) return undefined;
  const canonicalBroker = canonicalTradeImportBrokerId(broker);
  return capabilities.brokers.some((item) => item.id === canonicalBroker)
    ? canonicalBroker
    : undefined;
}

function safeBroker(capabilities: TradeImportCapabilities): string {
  return (
    validBroker(capabilities, 'MANUAL') ??
    capabilities.brokers[0]?.id ??
    'MANUAL'
  );
}

function safeAccount(accounts: string[], favoriteAccount?: string): string {
  if (favoriteAccount && accounts.includes(favoriteAccount)) {
    return favoriteAccount;
  }
  return accounts[0] ?? 'Main Account';
}

function templateSetup(
  capabilities: TradeImportCapabilities,
  template: LocalCSVTemplate,
  accountName: string,
  accountNames: string[]
): TradeImportQuickSetup {
  const broker =
    validBroker(capabilities, template.broker_type) ?? safeBroker(capabilities);
  const columnMappings = asMappings(template.column_mappings);
  const mappedHeaders = Object.values(columnMappings).flat();
  const manualMode = template.manual_mode ?? 'price_based';
  const mappingComplete =
    missingRequiredFieldsForMappings(
      manualModeForBackend(manualMode, capabilities.manualMapping.modes),
      columnMappings,
      mappedHeaders,
      template.asset_type
    ).length === 0;
  return {
    state: mappingComplete ? 'ready' : 'needs_setup',
    source: 'favorite-template',
    accountName,
    accountNames,
    broker,
    brokerLabel: tradeImportSourceLabel(broker, capabilities),
    assetType: template.asset_type,
    manualMode,
    dateFormat: template.date_format ?? '',
    templateId: template.id,
    templateName: template.name,
    sheetName: null,
    headerRowIndex: template.header_row_index ?? null,
    columnMappings,
    aiMappingEnabled: false,
  };
}

export async function resolveQuickTradeImportSetup(
  plugin: JournalitPlugin,
  capabilities: TradeImportCapabilities
): Promise<TradeImportQuickSetup> {
  const accounts = await loadTradeImportAccountNames(plugin);
  const accountName = safeAccount(accounts, plugin.settings.csvFavoriteAccount);
  const templateService = new LocalTemplateService(
    plugin,
    plugin.settingsManager
  );
  const favoriteTemplateId = plugin.settings.csvFavoriteTemplateId;
  const favoriteTemplate = favoriteTemplateId
    ? templateService.getTemplate(favoriteTemplateId)
    : undefined;

  if (favoriteTemplate) {
    return templateSetup(capabilities, favoriteTemplate, accountName, accounts);
  }

  const favoriteBroker = validBroker(
    capabilities,
    plugin.settings.csvFavoriteBroker
  );
  if (favoriteBroker) {
    return {
      state: favoriteBroker === 'MANUAL' ? 'needs_setup' : 'ready',
      source: 'favorites',
      accountName,
      accountNames: accounts,
      broker: favoriteBroker,
      brokerLabel: tradeImportSourceLabel(favoriteBroker, capabilities),
      assetType: defaultTradeImportAssetType(
        plugin.settings,
        favoriteBroker,
        plugin.serviceManager.getInitializedOnboardingService()?.getState()
          .answers.assetFocus
      ),
      manualMode: 'price_based',
      dateFormat: '',
      sheetName: null,
      headerRowIndex: null,
      columnMappings: {},
      aiMappingEnabled: false,
    };
  }

  const fallbackBroker = safeBroker(capabilities);
  return {
    state: fallbackBroker === 'MANUAL' ? 'needs_setup' : 'ready',
    source: 'fallback',
    accountName,
    accountNames: accounts,
    broker: fallbackBroker,
    brokerLabel: tradeImportSourceLabel(fallbackBroker, capabilities),
    assetType: 'stock',
    manualMode: 'price_based',
    dateFormat: '',
    sheetName: null,
    headerRowIndex: null,
    columnMappings: {},
    aiMappingEnabled: false,
  };
}

export function loadCachedQuickTradeImportSetup(
  plugin: JournalitPlugin,
  backendService: BackendTradeImportService
): Promise<CachedQuickTradeImportSetup> {
  if (inFlightQuickSetup) return inFlightQuickSetup;

  inFlightQuickSetup = (async () => {
    const capabilities = await backendService.getCapabilities();
    const setup = await resolveQuickTradeImportSetup(plugin, capabilities);
    cachedQuickSetup = { capabilities, setup };
    return cachedQuickSetup;
  })().finally(() => {
    inFlightQuickSetup = null;
  });

  return inFlightQuickSetup;
}
