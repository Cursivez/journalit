import type JournalitPlugin from '../main';

export type AccountCapitalBasisSource = 'currentCapital' | 'initialBalance';

export interface AccountCapitalBasisLookupEntry {
  amount: number;
  currency?: string;
  source: AccountCapitalBasisSource;
}

const normalizeAccountCapitalLookupKey = (value: string): string =>
  value.trim().toLowerCase();

const getPositiveAccountCapital = (account: {
  currentBalance?: number;
  initialBalance?: number;
}): { amount: number; source: AccountCapitalBasisSource } | null => {
  const initialBalance = account.initialBalance;
  if (
    typeof initialBalance === 'number' &&
    Number.isFinite(initialBalance) &&
    initialBalance > 0
  ) {
    return {
      amount: initialBalance,
      source: 'initialBalance',
    };
  }

  const currentBalance = account.currentBalance;
  if (
    typeof currentBalance === 'number' &&
    Number.isFinite(currentBalance) &&
    currentBalance > 0
  ) {
    return {
      amount: currentBalance,
      source: 'currentCapital',
    };
  }

  return null;
};

export const getAccountCapitalBasisLookup = async (
  plugin: JournalitPlugin | undefined
): Promise<Record<string, AccountCapitalBasisLookupEntry> | undefined> => {
  if (!plugin) return undefined;

  const accountPageService = plugin.serviceManager
    ? await plugin.serviceManager.getAccountPageService()
    : plugin.accountPageService;

  if (!accountPageService) return undefined;

  const accounts = await accountPageService.getAllEnhancedAccounts();
  const capitalByLookupKey: Record<string, AccountCapitalBasisLookupEntry> = {};

  for (const account of accounts) {
    const capital = getPositiveAccountCapital(account);
    if (capital == null) continue;

    capitalByLookupKey[normalizeAccountCapitalLookupKey(account.name)] = {
      amount: capital.amount,
      currency: account.currency,
      source: capital.source,
    };
  }

  return capitalByLookupKey;
};
