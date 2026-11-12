import { normalizeAccountLookupKey } from '../trade/core/TradeAccountIdentity';


export const MAX_FAVORITE_ACCOUNTS = 50;


export function resolveFavoriteAccounts(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const names = value.flatMap((entry) =>
    typeof entry === 'string' && entry.trim() ? [entry.trim()] : []
  );
  return [...new Set(names)];
}


export function repointFavoriteAccounts(
  favorites: unknown,
  oldName: string,
  newName: string
): string[] | undefined {
  const current = resolveFavoriteAccounts(favorites);
  const oldKey = normalizeAccountLookupKey(oldName);
  if (!current.some((name) => normalizeAccountLookupKey(name) === oldKey)) {
    return undefined;
  }
  const seen = new Set<string>();
  const next: string[] = [];
  for (const name of current) {
    const renamed = normalizeAccountLookupKey(name) === oldKey ? newName : name;
    const key = normalizeAccountLookupKey(renamed);
    if (seen.has(key)) continue;
    seen.add(key);
    next.push(renamed);
  }
  return next;
}


export function removeFavoriteAccounts(
  favorites: unknown,
  removedLookupKeys: ReadonlySet<string>
): string[] | undefined {
  const current = resolveFavoriteAccounts(favorites);
  const next = current.filter(
    (name) => !removedLookupKeys.has(normalizeAccountLookupKey(name))
  );
  return next.length === current.length ? undefined : next;
}
