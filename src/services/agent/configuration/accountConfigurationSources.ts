import type { AccountMetadata } from '../../../settings/types';
import type { AccountCatalogEntry } from '../../accountPage/types';
import { normalizeAccountLookupKey } from '../../trade/core/TradeAccountIdentity';
import type { AccountConfigurationSource } from './accountConfiguration';

interface AccountSourceDependencies {
  getAccountCatalog(): Promise<AccountCatalogEntry[]>;
  getAccountMetadata(): Readonly<Record<string, AccountMetadata>> | undefined;
  
  getAccountMapping(): Readonly<Record<string, string>> | undefined;
  getOrCreateAccountId(name: string): Promise<string | null>;
  
  listTradeAccountReferences(signal: AbortSignal): Promise<
    readonly {
      readonly path: string;
      readonly accountIds: readonly string[];
    }[]
  >;
}

export interface AccountSources {
  readonly sources: readonly AccountConfigurationSource[];
  
  accountIdFor(name: string): string | undefined;
  
  byId(accountId: string): AccountConfigurationSource | undefined;
  
  tradePathsFor(accountId: string): readonly string[];
}

function throwIfAborted(signal: AbortSignal): void {
  if (signal.aborted) throw signal.reason;
}


export async function readAccountSources(
  deps: AccountSourceDependencies,
  signal: AbortSignal
): Promise<AccountSources> {
  const catalog = await deps.getAccountCatalog();
  throwIfAborted(signal);
  const metadataEntries = Object.entries(deps.getAccountMetadata() ?? {});
  const mappedLookupKeys = new Set(
    Object.entries(deps.getAccountMapping() ?? {}).flatMap(
      ([brokerAccountId, name]) => [
        normalizeAccountLookupKey(brokerAccountId),
        normalizeAccountLookupKey(String(name)),
      ]
    )
  );
  const idsByLookupKey = new Map<string, string>();
  
  
  for (const entry of catalog) {
    const id = await deps.getOrCreateAccountId(entry.name);
    throwIfAborted(signal);
    if (id !== null)
      idsByLookupKey.set(normalizeAccountLookupKey(entry.name), id);
  }
  const tradePaths = new Map<string, string[]>();
  for (const reference of await deps.listTradeAccountReferences(signal)) {
    for (const id of new Set(reference.accountIds)) {
      const paths = tradePaths.get(id) ?? [];
      paths.push(reference.path);
      tradePaths.set(id, paths);
    }
  }
  throwIfAborted(signal);

  const sources: AccountConfigurationSource[] = [];
  for (const entry of catalog) {
    const lookupKey = normalizeAccountLookupKey(entry.name);
    const accountId = idsByLookupKey.get(lookupKey);
    if (accountId === undefined) continue;
    const metadata = metadataEntries.find(
      ([key]) => normalizeAccountLookupKey(key) === lookupKey
    )?.[1];
    sources.push({
      accountId,
      name: entry.name,
      metadata,
      archived: entry.archived,
      brokerLinked: mappedLookupKeys.has(lookupKey),
      tradeCount: tradePaths.get(accountId)?.length ?? 0,
    });
  }
  const byId = new Map(sources.map((source) => [source.accountId, source]));
  return {
    sources,
    accountIdFor: (name) => idsByLookupKey.get(normalizeAccountLookupKey(name)),
    byId: (accountId) => byId.get(accountId),
    tradePathsFor: (accountId) => tradePaths.get(accountId) ?? [],
  };
}
