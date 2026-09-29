

import type {
  AccountProgressWidgetConfig,
  HomeSettings,
} from '../settings/types';
import { normalizeAccountLookupKey } from '../services/trade/core/TradeAccountIdentity';


export const ACCOUNT_PROGRESS_MAX_OPTIONS: readonly (number | null)[] = [
  1,
  2,
  3,
  5,
  10,
  null,
];

const DEFAULT_ACCOUNT_PROGRESS_CONFIG: AccountProgressWidgetConfig = {
  mode: 'automatic',
  maxAccounts: 3,
  accounts: [],
};


export function getAccountProgressConfig(
  home: HomeSettings | undefined,
  instanceId: string
): AccountProgressWidgetConfig {
  const stored: unknown = home?.accountProgress?.[instanceId];
  if (typeof stored !== 'object' || stored === null) {
    return { ...DEFAULT_ACCOUNT_PROGRESS_CONFIG, accounts: [] };
  }
  const mode: unknown = Reflect.get(stored, 'mode');
  const maxAccounts: unknown = Reflect.get(stored, 'maxAccounts');
  const accounts: unknown = Reflect.get(stored, 'accounts');
  return {
    mode:
      mode === 'automatic' || mode === 'selected'
        ? mode
        : DEFAULT_ACCOUNT_PROGRESS_CONFIG.mode,
    maxAccounts:
      maxAccounts === null ||
      (typeof maxAccounts === 'number' &&
        ACCOUNT_PROGRESS_MAX_OPTIONS.includes(maxAccounts))
        ? maxAccounts
        : DEFAULT_ACCOUNT_PROGRESS_CONFIG.maxAccounts,
    accounts: Array.isArray(accounts)
      ? accounts.filter(
          (name): name is string =>
            typeof name === 'string' && name.trim().length > 0
        )
      : [],
  };
}


export function setAccountProgressConfig(
  home: HomeSettings,
  instanceId: string,
  config: AccountProgressWidgetConfig
): void {
  home.accountProgress ??= {};
  home.accountProgress[instanceId] = {
    mode: config.mode,
    maxAccounts: config.maxAccounts,
    accounts: [...config.accounts],
  };
}


export function isAccountSelected(
  selected: readonly string[],
  accountName: string
): boolean {
  const key = normalizeAccountLookupKey(accountName);
  return selected.some((name) => normalizeAccountLookupKey(name) === key);
}


export function selectAccountProgressItems<
  T extends { accountName: string; percent: number },
>(items: readonly T[], config: AccountProgressWidgetConfig): T[] {
  const sorted = [...items].sort((a, b) => b.percent - a.percent);
  if (config.mode === 'selected') {
    return sorted.filter((item) =>
      isAccountSelected(config.accounts, item.accountName)
    );
  }
  return config.maxAccounts === null
    ? sorted
    : sorted.slice(0, config.maxAccounts);
}
