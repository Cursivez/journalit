import type { TradeType } from '../../../services/tradelog/types';
import { normalizeDashboardTradeTypes } from '../../../settings/viewFiltersDefaults';
import { inferStoredTradeType } from '../../../utils/tradeTypeRouting';
import {
  normalizeAccountLookupKey,
  normalizeTradeAccountIdentity,
} from '../../../services/trade/core/TradeAccountIdentity';

const HOME_SUPPORTED_TRADE_TYPES: TradeType[] = ['regular', 'backtest'];

type HomeTradeType = (typeof HOME_SUPPORTED_TRADE_TYPES)[number];

interface HomeAccountTradeSnapshot {
  account?: string | string[];
  accountId?: string | number;
  accountRefs?: unknown;
  filePath?: string;
  path?: string;
  type?: unknown;
  isMissedTrade?: unknown;
  isBacktestTrade?: unknown;
}

const isHomeSupportedTradeType = (
  tradeType: string
): tradeType is HomeTradeType => {
  return HOME_SUPPORTED_TRADE_TYPES.includes(tradeType as HomeTradeType);
};

export const normalizeHomeTradeTypes = (
  tradeTypes?: TradeType[]
): TradeType[] => normalizeDashboardTradeTypes(tradeTypes);

interface HomeAccountSelectionState {
  selectedAccounts: string[];
  explicitAllSelected: boolean;
}

export const normalizeHomeAccountSelection = (
  availableAccounts: string[],
  selectedAccounts: string[],
  explicitAllSelected: boolean
): HomeAccountSelectionState => {
  const normalizedAvailableAccounts = [
    ...new Set(availableAccounts.filter(Boolean)),
  ].sort();
  const dedupedSelectedAccounts = [
    ...new Set(selectedAccounts.filter(Boolean)),
  ].sort();

  if (normalizedAvailableAccounts.length === 0) {
    return {
      selectedAccounts: dedupedSelectedAccounts,
      explicitAllSelected,
    };
  }

  const normalizedSelectedAccounts = dedupedSelectedAccounts.filter((account) =>
    normalizedAvailableAccounts.includes(account)
  );

  const hasFullAccountSelection =
    normalizedSelectedAccounts.length === normalizedAvailableAccounts.length &&
    normalizedAvailableAccounts.every(
      (account, index) => normalizedSelectedAccounts[index] === account
    );

  if (explicitAllSelected || hasFullAccountSelection) {
    return {
      selectedAccounts: normalizedAvailableAccounts,
      explicitAllSelected: true,
    };
  }

  return {
    selectedAccounts: normalizedSelectedAccounts,
    explicitAllSelected: false,
  };
};

export const collectAvailableHomeAccounts = (
  trades: HomeAccountTradeSnapshot[],
  selectedTradeTypes: TradeType[],
  retainedAccounts: string[] = [],
  options?: {
    resolveAccountIdDisplayName?: (accountId: string) => string | undefined;
  }
): string[] => {
  const normalizedTradeTypeSet = new Set(
    normalizeHomeTradeTypes(selectedTradeTypes)
  );
  const accountByLookupKey = new Map<string, string>();

  for (const retainedAccount of retainedAccounts) {
    if (!retainedAccount) {
      continue;
    }

    const lookupKey = normalizeAccountLookupKey(retainedAccount);
    if (!lookupKey || accountByLookupKey.has(lookupKey)) {
      continue;
    }

    accountByLookupKey.set(lookupKey, retainedAccount);
  }

  for (const trade of trades) {
    const tradeType = inferStoredTradeType({
      filePath: trade.path || trade.filePath,
      type: trade.type,
      isMissedTrade: trade.isMissedTrade,
      isBacktestTrade: trade.isBacktestTrade,
    });

    if (!isHomeSupportedTradeType(tradeType)) {
      continue;
    }

    if (!normalizedTradeTypeSet.has(tradeType)) {
      continue;
    }

    const identity = normalizeTradeAccountIdentity(
      trade as Record<string, unknown>,
      {
        resolveAccountIdDisplayName: options?.resolveAccountIdDisplayName,
      }
    );

    for (const accountName of identity.accountNames) {
      const lookupKey = normalizeAccountLookupKey(accountName);
      if (accountByLookupKey.has(lookupKey)) {
        continue;
      }
      accountByLookupKey.set(lookupKey, accountName);
    }
  }

  return Array.from(accountByLookupKey.values()).sort();
};

export const remapHomeSelectedAccounts = (
  trades: HomeAccountTradeSnapshot[],
  selectedAccounts: string[],
  selectedTradeTypes: TradeType[],
  availableAccounts: string[],
  options?: {
    resolveAccountIdDisplayName?: (accountId: string) => string | undefined;
  }
): string[] => {
  const normalizedTradeTypeSet = new Set(
    normalizeHomeTradeTypes(selectedTradeTypes)
  );
  const availableAccountSet = new Set(availableAccounts);
  const availableByLookupKey = new Map<string, string>(
    availableAccounts.map((accountName) => [
      normalizeAccountLookupKey(accountName),
      accountName,
    ])
  );

  const aliasToCanonical = new Map<string, string>();
  const ambiguousAliases = new Set<string>();

  for (const trade of trades) {
    const tradeType = inferStoredTradeType({
      filePath: trade.path || trade.filePath,
      type: trade.type,
      isMissedTrade: trade.isMissedTrade,
      isBacktestTrade: trade.isBacktestTrade,
    });

    if (!isHomeSupportedTradeType(tradeType)) {
      continue;
    }

    if (!normalizedTradeTypeSet.has(tradeType)) {
      continue;
    }

    const identity = normalizeTradeAccountIdentity(
      trade as Record<string, unknown>,
      {
        resolveAccountIdDisplayName: options?.resolveAccountIdDisplayName,
      }
    );

    if (identity.accountNames.length === 0) {
      continue;
    }

    const canonicalLookupToName = new Map<string, string>(
      identity.accountNames.map((accountName) => {
        const lookupKey = normalizeAccountLookupKey(accountName);
        return [lookupKey, availableByLookupKey.get(lookupKey) ?? accountName];
      })
    );
    const primaryCanonicalAccountName =
      canonicalLookupToName.get(
        normalizeAccountLookupKey(identity.accountNames[0])
      ) ?? identity.accountNames[0];

    for (const ref of identity.refs) {
      let targetCanonicalAccount = canonicalLookupToName.get(ref.lookupKey);

      if (!targetCanonicalAccount && canonicalLookupToName.size === 1) {
        targetCanonicalAccount = primaryCanonicalAccountName;
      }

      if (!targetCanonicalAccount) {
        continue;
      }

      const existing = aliasToCanonical.get(ref.lookupKey);
      if (!existing) {
        aliasToCanonical.set(ref.lookupKey, targetCanonicalAccount);
        continue;
      }

      if (existing !== targetCanonicalAccount) {
        aliasToCanonical.delete(ref.lookupKey);
        ambiguousAliases.add(ref.lookupKey);
      }
    }
  }

  const nextSelectedAccounts = new Set<string>();
  for (const selectedAccount of selectedAccounts) {
    if (!selectedAccount) {
      continue;
    }

    if (availableAccountSet.has(selectedAccount)) {
      nextSelectedAccounts.add(selectedAccount);
      continue;
    }

    const lookupKey = normalizeAccountLookupKey(selectedAccount);
    const directLookupMatch = availableByLookupKey.get(lookupKey);
    if (directLookupMatch) {
      nextSelectedAccounts.add(directLookupMatch);
      continue;
    }

    if (ambiguousAliases.has(lookupKey)) {
      continue;
    }

    const remappedAccount = aliasToCanonical.get(lookupKey);
    if (remappedAccount && availableAccountSet.has(remappedAccount)) {
      nextSelectedAccounts.add(remappedAccount);
    }
  }

  return Array.from(nextSelectedAccounts).sort();
};
