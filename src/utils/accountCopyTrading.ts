import type { AccountMetadata, CopyTradingPeriod } from '../settings/types';
import { normalizeAccountLookupKey } from '../services/trade/core/TradeAccountIdentity';

const COPY_TRADING_MIN_MULTIPLIER = 0.1;
const COPY_TRADING_MAX_MULTIPLIER = 100;

export function isValidCopyTradingMultiplier(multiplier: number): boolean {
  return (
    Number.isFinite(multiplier) &&
    multiplier >= COPY_TRADING_MIN_MULTIPLIER &&
    multiplier <= COPY_TRADING_MAX_MULTIPLIER
  );
}

export function hasActiveCopyTradingPeriod(
  metadata: Pick<AccountMetadata, 'copyTradingPeriods'> | undefined,
  asOf: Date = new Date()
): boolean {
  return Boolean(getActiveCopyTradingPeriod(metadata, asOf));
}

export function getActiveCopyTradingPeriod(
  metadata: Pick<AccountMetadata, 'copyTradingPeriods'> | undefined,
  asOf: Date = new Date()
): CopyTradingPeriod | null {
  const periods = metadata?.copyTradingPeriods ?? [];
  const asOfTime = startOfDayTime(asOf);

  return (
    periods.find((period) => {
      const startTime = toStartOfDayTime(period.startDate);
      if (startTime === null) {
        return false;
      }
      const endTime = period.endDate ? toStartOfDayTime(period.endDate) : null;

      return startTime <= asOfTime && (endTime === null || asOfTime <= endTime);
    }) ?? null
  );
}

export function getCopyTradingPeriodForEntryDate(
  metadata: Pick<AccountMetadata, 'copyTradingPeriods'> | undefined,
  entryDate: Date
): CopyTradingPeriod | null {
  return getActiveCopyTradingPeriod(metadata, entryDate);
}

function isCopyAccountName(
  accountName: string,
  accountMetadata: Record<string, AccountMetadata> | undefined,
  asOf: Date = new Date()
): boolean {
  return hasActiveCopyTradingPeriod(accountMetadata?.[accountName], asOf);
}

export function filterActiveCopyAccounts(
  accountNames: string[],
  accountMetadata: Record<string, AccountMetadata> | undefined,
  asOf: Date = new Date()
): string[] {
  return accountNames.filter(
    (accountName) => !isCopyAccountName(accountName, accountMetadata, asOf)
  );
}

export function expandAccountsWithCopyTradingAccounts(
  accountNames: string[],
  accountMetadata: Record<string, AccountMetadata> | undefined,
  includeCopyAccounts: boolean
): string[] {
  if (!includeCopyAccounts || accountNames.length === 0 || !accountMetadata) {
    return [...new Set(accountNames.filter(Boolean))];
  }

  const expandedAccountsByLookupKey = new Map<string, string>();
  const selectedBaseLookupKeys = new Set<string>();

  for (const accountName of accountNames) {
    if (!accountName) {
      continue;
    }

    const lookupKey = normalizeAccountLookupKey(accountName);
    if (!lookupKey) {
      continue;
    }

    selectedBaseLookupKeys.add(lookupKey);
    expandedAccountsByLookupKey.set(lookupKey, accountName);
  }

  for (const [metadataKey, metadata] of Object.entries(accountMetadata)) {
    const copyPeriods = metadata.copyTradingPeriods ?? [];
    if (copyPeriods.length === 0) {
      continue;
    }

    const copiesSelectedBaseAccount = copyPeriods.some((period) =>
      selectedBaseLookupKeys.has(normalizeAccountLookupKey(period.baseAccount))
    );
    if (!copiesSelectedBaseAccount) {
      continue;
    }

    const copyAccountName = metadata.name || metadataKey;
    const copyAccountLookupKey = normalizeAccountLookupKey(copyAccountName);
    if (!copyAccountLookupKey) {
      continue;
    }

    expandedAccountsByLookupKey.set(copyAccountLookupKey, copyAccountName);
  }

  return Array.from(expandedAccountsByLookupKey.values());
}

export function isAccountUsedAsActiveCopyBase(
  accountName: string,
  accountMetadata: Record<string, AccountMetadata> | undefined,
  asOf: Date = new Date()
): boolean {
  if (!accountMetadata) {
    return false;
  }

  const accountLookupKey = normalizeAccountLookupKey(accountName);

  return Object.values(accountMetadata).some((metadata) => {
    const activePeriod = getActiveCopyTradingPeriod(metadata, asOf);
    return (
      activePeriod !== null &&
      normalizeAccountLookupKey(activePeriod.baseAccount) === accountLookupKey
    );
  });
}

function hasMatchingCopyTradingCurrency(
  copyMetadata: Pick<AccountMetadata, 'currency'>,
  baseMetadata: Pick<AccountMetadata, 'currency'> | undefined,
  defaultCurrency: string | undefined
): boolean {
  const copyCurrency = copyMetadata.currency ?? defaultCurrency;
  const baseCurrency = baseMetadata?.currency ?? defaultCurrency;

  return copyCurrency === baseCurrency;
}

function findAccountMetadataByName(
  accountMetadata: Record<string, AccountMetadata>,
  accountName: string
): AccountMetadata | undefined {
  const lookupKey = normalizeAccountLookupKey(accountName);
  return Object.values(accountMetadata).find(
    (metadata) => normalizeAccountLookupKey(metadata.name) === lookupKey
  );
}

export function isCopyTradingBaseEligible(
  accountMetadata: Record<string, AccountMetadata>,
  copyMetadata: AccountMetadata,
  baseAccountName: string,
  entryDate: Date,
  defaultCurrency: string | undefined
): boolean {
  const baseMetadata = findAccountMetadataByName(
    accountMetadata,
    baseAccountName
  );
  if (!baseMetadata) {
    return false;
  }

  return (
    !hasActiveCopyTradingPeriod(baseMetadata, entryDate) &&
    hasMatchingCopyTradingCurrency(copyMetadata, baseMetadata, defaultCurrency)
  );
}

function startOfDayTime(value: Date): number {
  return new Date(
    value.getFullYear(),
    value.getMonth(),
    value.getDate()
  ).getTime();
}

function toStartOfDayTime(value: Date | string): number | null {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return startOfDayTime(date);
}
