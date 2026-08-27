

import type JournalitPlugin from '../../../../main';
import type { TradeProjectionAccountInventoryItem } from '../../../../services/tradeSync/types';
import type { LocalAccountOption } from './types';


interface BrokerAccountMapping {
  localAccountId?: string | null;
  localAccountName?: string | null;
}

function localAccountNameKey(name: string): string {
  return name.trim().toLocaleLowerCase();
}


export async function loadLocalAccounts(
  plugin: JournalitPlugin
): Promise<LocalAccountOption[]> {
  const catalog = await plugin.accountPageService?.getAccountCatalog();
  const catalogAccounts = (catalog ?? []).flatMap((account) =>
    !account.archived && account.name
      ? [{ id: account.id || account.name, name: account.name }]
      : []
  );
  if (catalogAccounts.length) return catalogAccounts;
  return Object.keys(plugin.settings.account?.accountMetadata ?? {}).map(
    (name) => ({ id: name, name })
  );
}

interface LocalAccountResolver {
  byId(id: string | null | undefined): LocalAccountOption | undefined;
  byName(name: string | null | undefined): LocalAccountOption | undefined;
  
  resolveMapping(
    mapping: BrokerAccountMapping | null | undefined
  ): LocalAccountOption | undefined;
}

export function createLocalAccountResolver(
  accounts: LocalAccountOption[]
): LocalAccountResolver {
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


export function createAccountMappingIndex(
  inventoryAccounts: TradeProjectionAccountInventoryItem[]
): Map<string, BrokerAccountMapping | null> {
  return new Map(
    inventoryAccounts.map((account) => [
      account.accountId,
      account.mapping ?? null,
    ])
  );
}
