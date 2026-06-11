import type JournalitPlugin from '../../main';
import { LocalTemplateService } from '../csv/LocalTemplateService';
import type { LocalCSVTemplate, ManualImportMode } from '../csv/types';
import type { TradeImportCapabilities } from './types';

export type TradeImportQuickSetupSource =
  | 'favorite-template'
  | 'favorites'
  | 'fallback';

export type TradeImportQuickSetupState =
  | 'ready'
  | 'needs_setup'
  | 'unavailable';

export interface TradeImportQuickSetup {
  state: TradeImportQuickSetupState;
  source: TradeImportQuickSetupSource;
  accountName: string;
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
    | 'error';
  message?: string;
}

function accountNames(plugin: JournalitPlugin): string[] {
  const metadata = plugin.settings.account?.accountMetadata ?? {};
  const names = Object.values(metadata)
    .map((account) => account.name)
    .filter((name): name is string => !!name);
  return names.length ? names : ['Main Account'];
}

export async function loadTradeImportAccountNames(
  plugin: JournalitPlugin
): Promise<string[]> {
  const catalog = await plugin.accountPageService?.getAccountCatalog();
  const catalogNames = (catalog ?? [])
    .filter((account) => !account.archived)
    .map((account) => account.name)
    .filter((name): name is string => !!name);
  return catalogNames.length ? catalogNames : accountNames(plugin);
}

function asMappings(value: unknown): Record<string, string[]> {
  if (!value || typeof value !== 'object') return {};
  const mappings: Record<string, string[]> = {};
  for (const [key, columns] of Object.entries(value)) {
    if (Array.isArray(columns)) {
      const normalized = columns.map(String).filter(Boolean);
      if (normalized.length > 0) mappings[key] = normalized;
      continue;
    }
    if (typeof columns === 'string' && columns.trim()) {
      mappings[key] = [columns.trim()];
    }
  }
  return mappings;
}

function brokerLabel(
  capabilities: TradeImportCapabilities,
  broker: string
): string {
  return (
    capabilities.brokers.find((item) => item.id === broker)?.label ?? broker
  );
}

function validBroker(
  capabilities: TradeImportCapabilities,
  broker: string | undefined
): string | undefined {
  if (!broker) return undefined;
  return capabilities.brokers.some((item) => item.id === broker)
    ? broker
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
  accountName: string
): TradeImportQuickSetup {
  const broker =
    validBroker(capabilities, template.broker_type) ?? safeBroker(capabilities);
  return {
    state: 'ready',
    source: 'favorite-template',
    accountName,
    broker,
    brokerLabel: brokerLabel(capabilities, broker),
    assetType: template.asset_type,
    manualMode: template.manual_mode ?? 'price_based',
    dateFormat: template.date_format ?? '',
    templateId: template.id,
    templateName: template.name,
    sheetName: null,
    headerRowIndex: template.header_row_index ?? null,
    columnMappings: asMappings(template.column_mappings),
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
    return templateSetup(capabilities, favoriteTemplate, accountName);
  }

  const favoriteBroker = validBroker(
    capabilities,
    plugin.settings.csvFavoriteBroker
  );
  if (favoriteBroker) {
    const rememberedAssetType = plugin.settings.csvLastAssetType?.[
      favoriteBroker
    ] as TradeImportQuickSetup['assetType'] | undefined;
    return {
      state: favoriteBroker === 'MANUAL' ? 'needs_setup' : 'ready',
      source: 'favorites',
      accountName,
      broker: favoriteBroker,
      brokerLabel: brokerLabel(capabilities, favoriteBroker),
      assetType: rememberedAssetType ?? 'stock',
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
    broker: fallbackBroker,
    brokerLabel: brokerLabel(capabilities, fallbackBroker),
    assetType: 'stock',
    manualMode: 'price_based',
    dateFormat: '',
    sheetName: null,
    headerRowIndex: null,
    columnMappings: {},
    aiMappingEnabled: false,
  };
}
