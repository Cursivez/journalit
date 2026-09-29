

import type { JournalitSettings } from '../../settings/types';

export function tradeImportAccountCurrency(
  settings: JournalitSettings,
  accountName: string | null | undefined
): string | undefined {
  if (!accountName) return undefined;
  return Object.values(settings.account?.accountMetadata ?? {}).find(
    (account) => account.name === accountName
  )?.currency;
}
