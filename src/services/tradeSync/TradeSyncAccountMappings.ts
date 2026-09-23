import type JournalitPlugin from '../../main';
import type { TradeProjectionAccountInventoryItem } from './types';

interface TradeSyncLocalAccount {
  id: string;
  name: string;
}

interface BrokerAccountMapping {
  localAccountId?: string | null;
  localAccountName?: string | null;
}

function localAccountNameKey(name: string): string {
  return name.trim().toLocaleLowerCase();
}

export async function loadTradeSyncLocalAccounts(
  plugin: JournalitPlugin
): Promise<TradeSyncLocalAccount[]> {
  const accountPageService =
    await plugin.serviceManager.getAccountPageService();
  const catalog = await accountPageService.getAccountCatalog();
  const catalogAccounts = catalog.flatMap((account) =>
    !account.archived && account.name
      ? [{ id: account.id || account.name, name: account.name }]
      : []
  );
  if (catalogAccounts.length) return catalogAccounts;
  return Object.keys(plugin.settings.account?.accountMetadata ?? {}).map(
    (name) => ({ id: name, name })
  );
}

export function createTradeSyncLocalAccountResolver(
  accounts: TradeSyncLocalAccount[]
): {
  byId(id: string | null | undefined): TradeSyncLocalAccount | undefined;
  byName(name: string | null | undefined): TradeSyncLocalAccount | undefined;
  resolveMapping(
    mapping: BrokerAccountMapping | null | undefined
  ): TradeSyncLocalAccount | undefined;
} {
  const byId = new Map(accounts.map((account) => [account.id, account]));
  const byName = new Map(
    accounts.map((account) => [localAccountNameKey(account.name), account])
  );
  const lookupById = (id: string | null | undefined) =>
    id ? byId.get(id) : undefined;
  const lookupByName = (name: string | null | undefined) =>
    name ? byName.get(localAccountNameKey(name)) : undefined;
  return {
    byId: lookupById,
    byName: lookupByName,
    resolveMapping: (mapping) =>
      lookupById(mapping?.localAccountId) ??
      lookupByName(mapping?.localAccountName),
  };
}

export function createTradeSyncAccountMappingIndex(
  inventoryAccounts: TradeProjectionAccountInventoryItem[]
): Map<string, BrokerAccountMapping | null> {
  return new Map(
    inventoryAccounts.map((account) => [
      account.accountId,
      account.mapping ?? null,
    ])
  );
}
