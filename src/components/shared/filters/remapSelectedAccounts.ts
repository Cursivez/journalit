import { AccountChangedPayload } from '../../../services/events/types';
import { normalizeAccountLookupKey } from '../../../services/trade/core/TradeAccountIdentity';
import type { AccountPhaseScope } from './types';

type AccountFilterState = {
  accounts: string[];
  accountPhases?: AccountPhaseScope[];
};

interface AccountChangeAliasContext {
  action: AccountChangedPayload['action'];
  aliasLookupKeys: Set<string>;
  canonicalAccountName: string | undefined;
}

function getAccountChangeAliasContext(
  payload: AccountChangedPayload
): AccountChangeAliasContext | null {
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
    return null;
  }

  const canonicalAccountName =
    payload.accountName &&
    normalizeAccountLookupKey(payload.accountName) !== payloadAccountIdLookupKey
      ? payload.accountName
      : undefined;

  return {
    action: payload.action,
    aliasLookupKeys: new Set(
      aliasValues.map((value) => normalizeAccountLookupKey(value))
    ),
    canonicalAccountName,
  };
}

function remapAccountName(
  selectedAccount: string,
  context: AccountChangeAliasContext
): string | undefined {
  const selectedLookupKey = normalizeAccountLookupKey(selectedAccount);
  let nextValue = selectedAccount;

  if (context.aliasLookupKeys.has(selectedLookupKey)) {
    if (context.action === 'deleted') {
      return undefined;
    }

    if (context.canonicalAccountName) {
      const accountNameLookupKey = normalizeAccountLookupKey(
        context.canonicalAccountName
      );

      if (selectedLookupKey !== accountNameLookupKey) {
        return undefined;
      }

      nextValue = context.canonicalAccountName;
    }
  }

  return nextValue;
}

function areAccountPhaseSelectionsEqual(
  first: readonly AccountPhaseScope[] | undefined,
  second: readonly AccountPhaseScope[] | undefined
): boolean {
  if (first === second) {
    return true;
  }
  if (!first || !second) {
    return first === second;
  }

  return (
    first.length === second.length &&
    first.every(
      (scope, index) =>
        scope.account === second[index].account &&
        scope.phaseId === second[index].phaseId
    )
  );
}

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

  const context = getAccountChangeAliasContext(payload);
  if (!context) {
    return selectedAccounts;
  }

  const remapped: string[] = [];
  const seen = new Set<string>();

  for (const selectedAccount of selectedAccounts) {
    const nextValue = remapAccountName(selectedAccount, context);
    if (nextValue === undefined) {
      continue;
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

function remapSelectedAccountPhasesFromAccountChange(
  selectedPhases: AccountPhaseScope[],
  payload: AccountChangedPayload
): AccountPhaseScope[] {
  if (selectedPhases.length === 0) {
    return selectedPhases;
  }

  const context = getAccountChangeAliasContext(payload);
  if (!context) {
    return selectedPhases;
  }

  const remapped: AccountPhaseScope[] = [];
  const seen = new Set<string>();

  for (const scope of selectedPhases) {
    const nextAccount = remapAccountName(scope.account, context);
    if (nextAccount === undefined) {
      continue;
    }

    const dedupeKey = `${normalizeAccountLookupKey(nextAccount)}\0${scope.phaseId}`;
    if (seen.has(dedupeKey)) {
      continue;
    }
    seen.add(dedupeKey);
    remapped.push(
      nextAccount === scope.account
        ? scope
        : { account: nextAccount, phaseId: scope.phaseId }
    );
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
  const nextAccountPhases =
    filters.accountPhases === undefined
      ? undefined
      : remapSelectedAccountPhasesFromAccountChange(
          filters.accountPhases,
          payload
        );

  const accountsUnchanged = areAccountSelectionsEqual(
    filters.accounts,
    nextAccounts
  );
  const phasesUnchanged = areAccountPhaseSelectionsEqual(
    filters.accountPhases,
    nextAccountPhases
  );

  if (accountsUnchanged && phasesUnchanged) {
    return filters;
  }

  return {
    ...filters,
    ...(accountsUnchanged ? {} : { accounts: nextAccounts }),
    ...(nextAccountPhases === undefined || phasesUnchanged
      ? {}
      : { accountPhases: nextAccountPhases }),
  };
}
