import {
  normalizeAccountLookupKey,
  normalizeTradeAccountIdentity,
} from './TradeAccountIdentity';

interface BreakEvenAccountBalanceAccountSnapshot {
  name: string;
  currentBalance: unknown;
  currency?: string;
  id?: string | number | null;
  accountId?: string | number | null;
}

export interface BreakEvenAccountBalanceSnapshot {
  balance: number;
  currency?: string;
}

export type BreakEvenAccountBalanceLookup = Map<
  string,
  BreakEvenAccountBalanceSnapshot
>;

interface BreakEvenAccountBalanceResolution {
  singleBalance?: number;
  singleBalanceCurrency?: string;
  totalBalance?: number;
  totalBalanceCurrency?: string;
  unresolved: boolean;
  requiredLookupKeys: string[];
  resolvedSnapshots: BreakEvenAccountBalanceSnapshot[];
}

interface BreakEvenAccountBalanceFields {
  breakEvenAccountCurrentBalance?: number;
  breakEvenAccountCurrentBalanceCurrency?: string;
  breakEvenAccountCurrentBalanceTotal?: number;
  breakEvenAccountCurrentBalanceTotalCurrency?: string;
}

interface BreakEvenAccountPageServiceLike {
  getAllEnhancedAccounts(): Promise<BreakEvenAccountBalanceAccountSnapshot[]>;
}

interface BreakEvenAccountPluginLike {
  accountPageService?: BreakEvenAccountPageServiceLike | null;
  serviceManager?: {
    getAccountPageService?: () =>
      | BreakEvenAccountPageServiceLike
      | Promise<BreakEvenAccountPageServiceLike>;
  } | null;
}

type ResolveAccountIdDisplayName = (accountId: string) => string | undefined;

const toLookupString = (value: string | number | null | undefined): string =>
  value === null || value === undefined ? '' : String(value);

const getGeneratedAccountIdentityAliases = (accountName: string): string[] => {
  const generatedId = accountName.replace(/[^a-zA-Z0-9]/g, '-');
  return generatedId ? [generatedId, `account-${generatedId}`] : [];
};

export const buildBreakEvenAccountBalanceLookup = (
  accounts: BreakEvenAccountBalanceAccountSnapshot[]
): BreakEvenAccountBalanceLookup => {
  const lookup: BreakEvenAccountBalanceLookup = new Map();
  const explicitLookupKeys = new Set<string>();
  const generatedAliasCandidates = new Map<
    string,
    Set<BreakEvenAccountBalanceSnapshot>
  >();

  const setExplicitLookup = (
    value: string,
    snapshot: BreakEvenAccountBalanceSnapshot
  ): void => {
    const lookupKey = normalizeAccountLookupKey(value);
    explicitLookupKeys.add(lookupKey);
    lookup.set(lookupKey, snapshot);
  };

  const addGeneratedAliasCandidate = (
    value: string,
    snapshot: BreakEvenAccountBalanceSnapshot
  ): void => {
    const lookupKey = normalizeAccountLookupKey(value);
    const candidates = generatedAliasCandidates.get(lookupKey) ?? new Set();
    candidates.add(snapshot);
    generatedAliasCandidates.set(lookupKey, candidates);
  };

  for (const account of accounts) {
    const balance = Number(account.currentBalance);
    if (!Number.isFinite(balance)) {
      continue;
    }

    const snapshot: BreakEvenAccountBalanceSnapshot = {
      balance,
      currency: account.currency,
    };

    setExplicitLookup(account.name, snapshot);

    for (const alias of getGeneratedAccountIdentityAliases(account.name)) {
      addGeneratedAliasCandidate(alias, snapshot);
    }

    const id = toLookupString(account.id);
    if (id) {
      setExplicitLookup(id, snapshot);
    }

    const accountId = toLookupString(account.accountId);
    if (accountId) {
      setExplicitLookup(accountId, snapshot);
    }
  }

  for (const [lookupKey, candidates] of generatedAliasCandidates.entries()) {
    if (explicitLookupKeys.has(lookupKey) || candidates.size !== 1) {
      continue;
    }

    lookup.set(lookupKey, Array.from(candidates)[0]);
  }

  return lookup;
};

export const fetchBreakEvenAccountBalanceLookup = async (
  plugin?: BreakEvenAccountPluginLike | null
): Promise<BreakEvenAccountBalanceLookup> => {
  if (!plugin) {
    return new Map();
  }

  try {
    const accountPageService =
      plugin.accountPageService ||
      (plugin.serviceManager?.getAccountPageService
        ? await Promise.resolve(plugin.serviceManager.getAccountPageService())
        : null);

    if (!accountPageService) {
      return new Map();
    }

    return buildBreakEvenAccountBalanceLookup(
      await accountPageService.getAllEnhancedAccounts()
    );
  } catch (error) {
    console.error(
      '[BreakEvenAccountBalance] Failed to build account balance lookup for break-even percentage mode:',
      error
    );
    return new Map();
  }
};

export const resolveBreakEvenAccountBalances = (
  trade: Record<string, unknown>,
  accountBalanceLookup: BreakEvenAccountBalanceLookup,
  options: { resolveAccountIdDisplayName?: ResolveAccountIdDisplayName } = {}
): BreakEvenAccountBalanceResolution => {
  const identity = normalizeTradeAccountIdentity(trade, options);
  const requiredLookupKeys = Array.from(
    new Set([
      ...identity.accountNames.map(normalizeAccountLookupKey),
      ...identity.lookupKeys,
    ])
  );

  const resolvedSnapshotsByKey = requiredLookupKeys.map((lookupKey) =>
    accountBalanceLookup.get(lookupKey)
  );
  const hasFullyResolvedBalances =
    requiredLookupKeys.length > 0 &&
    resolvedSnapshotsByKey.every(
      (snapshot) => snapshot !== undefined && Number.isFinite(snapshot.balance)
    );
  const resolvedSnapshots = Array.from(
    new Set(
      resolvedSnapshotsByKey.filter(
        (snapshot): snapshot is BreakEvenAccountBalanceSnapshot =>
          snapshot !== undefined && Number.isFinite(snapshot.balance)
      )
    )
  );

  const resolution: BreakEvenAccountBalanceResolution = {
    unresolved: !hasFullyResolvedBalances,
    requiredLookupKeys,
    resolvedSnapshots,
  };

  if (!hasFullyResolvedBalances) {
    return resolution;
  }

  if (resolvedSnapshots.length === 1) {
    resolution.singleBalance = resolvedSnapshots[0].balance;
    resolution.singleBalanceCurrency = resolvedSnapshots[0].currency;
  }

  if (resolvedSnapshots.length > 0) {
    const uniqueCurrencies = Array.from(
      new Set(resolvedSnapshots.map((snapshot) => snapshot.currency))
    );
    if (uniqueCurrencies.length === 1) {
      resolution.totalBalance = resolvedSnapshots.reduce(
        (sum, snapshot) => sum + snapshot.balance,
        0
      );
      resolution.totalBalanceCurrency = uniqueCurrencies[0];
    }
  }

  return resolution;
};

export const getBreakEvenAccountBalanceFields = (
  resolution: BreakEvenAccountBalanceResolution
): BreakEvenAccountBalanceFields => ({
  breakEvenAccountCurrentBalance: resolution.singleBalance,
  breakEvenAccountCurrentBalanceCurrency: resolution.singleBalanceCurrency,
  breakEvenAccountCurrentBalanceTotal: resolution.totalBalance,
  breakEvenAccountCurrentBalanceTotalCurrency: resolution.totalBalanceCurrency,
});

export const attachBreakEvenAccountBalancesToTrade = <
  T extends Record<string, unknown>,
>(
  trade: T,
  accountBalanceLookup: BreakEvenAccountBalanceLookup,
  options: { resolveAccountIdDisplayName?: ResolveAccountIdDisplayName } = {}
): T & BreakEvenAccountBalanceFields => ({
  ...trade,
  ...getBreakEvenAccountBalanceFields(
    resolveBreakEvenAccountBalances(trade, accountBalanceLookup, options)
  ),
});
