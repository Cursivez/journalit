import type JournalitPlugin from '../../../main';
import type { AccountCatalogEntry } from '../../../services/accountPage/types';
import { normalizeAccountLookupKey } from '../../../services/trade/core/TradeAccountIdentity';
import { filterActiveCopyAccounts } from '../../../utils/accountCopyTrading';

function mergeActiveTradeFormAccountNames(
  catalogAccounts: ReadonlyArray<
    Pick<AccountCatalogEntry, 'name' | 'archived'>
  >,
  uniqueAccounts: readonly string[]
): string[] {
  const archivedLookupKeys = new Set<string>();
  const activeAccountsByLookupKey = new Map<string, string>();

  for (const account of catalogAccounts) {
    const lookupKey = normalizeAccountLookupKey(account.name);
    if (!lookupKey) {
      continue;
    }
    if (account.archived) {
      archivedLookupKeys.add(lookupKey);
    } else {
      activeAccountsByLookupKey.set(lookupKey, account.name);
    }
  }

  for (const accountName of uniqueAccounts) {
    const lookupKey = normalizeAccountLookupKey(accountName);
    if (
      lookupKey &&
      !archivedLookupKeys.has(lookupKey) &&
      !activeAccountsByLookupKey.has(lookupKey)
    ) {
      activeAccountsByLookupKey.set(lookupKey, accountName);
    }
  }

  return Array.from(activeAccountsByLookupKey.values());
}


export async function loadSelectableTradeFormAccountNames(
  plugin: JournalitPlugin,
  asOf?: Date
): Promise<string[]> {
  const catalogAccounts = plugin.accountPageService
    ? await plugin.accountPageService.getAccountCatalog()
    : [];
  const uniqueAccounts = plugin.tradeService
    ? await plugin.tradeService.getUniqueAccounts()
    : [];
  return filterActiveCopyAccounts(
    mergeActiveTradeFormAccountNames(catalogAccounts, uniqueAccounts),
    plugin.settings.account?.accountMetadata,
    asOf
  );
}
