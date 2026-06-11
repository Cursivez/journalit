import { AccountChangedPayload } from '../../../services/events/types';
import { normalizeAccountLookupKey } from '../../../services/trade/core/TradeAccountIdentity';

type AccountFilterState = { accounts: string[] };

export function areAccountSelectionsEqual(
  first: readonly string[],
  second: readonly string[]
): boolean {
  return (
    first.length === second.length &&
    first.every((account, index) => account === second[index])
  );
}

export function remapSelectedAccountsFromAccountChange(
  selectedAccounts: string[],
  payload: AccountChangedPayload
): string[] {
  if (selectedAccounts.length === 0) {
    return selectedAccounts;
  }

  const payloadAccountIdLookupKey = payload.accountId
    ? normalizeAccountLookupKey(payload.accountId)
    : undefined;

  const aliasValues = (
    payload.accountNames?.length
      ? payload.accountNames
      : payload.accountName
        ? [payload.accountName]
        : []
  ).filter(
    (value) => normalizeAccountLookupKey(value) !== payloadAccountIdLookupKey
  );

  if (aliasValues.length === 0) {
    return selectedAccounts;
  }

  const canonicalAccountName =
    payload.accountName &&
    normalizeAccountLookupKey(payload.accountName) !== payloadAccountIdLookupKey
      ? payload.accountName
      : undefined;

  const aliasLookupKeys = new Set(
    aliasValues.map((value) => normalizeAccountLookupKey(value))
  );

  const remapped: string[] = [];
  const seen = new Set<string>();

  for (const selectedAccount of selectedAccounts) {
    const selectedLookupKey = normalizeAccountLookupKey(selectedAccount);
    let nextValue = selectedAccount;

    if (aliasLookupKeys.has(selectedLookupKey)) {
      if (payload.action === 'deleted') {
        continue;
      }

      if (canonicalAccountName) {
        const accountNameLookupKey =
          normalizeAccountLookupKey(canonicalAccountName);

        if (selectedLookupKey !== accountNameLookupKey) {
          continue;
        }

        nextValue = canonicalAccountName;
      }
    }

    const nextLookupKey = normalizeAccountLookupKey(nextValue);
    if (seen.has(nextLookupKey)) {
      continue;
    }

    seen.add(nextLookupKey);
    remapped.push(nextValue);
  }

  return remapped;
}

export function remapAccountFilterFromAccountChange<
  TFilters extends AccountFilterState,
>(filters: TFilters, payload: AccountChangedPayload): TFilters {
  const nextAccounts = remapSelectedAccountsFromAccountChange(
    filters.accounts,
    payload
  );

  return areAccountSelectionsEqual(filters.accounts, nextAccounts)
    ? filters
    : { ...filters, accounts: nextAccounts };
}
