import type {
  AccountMetadata,
  AccountSettings,
  JournalitSettings,
} from '../../settings/types';
import { AccountType, DrawdownType } from '../account/types';
import { normalizeAccountLookupKey } from '../trade/core/TradeAccountIdentity';
import { defineOwnEntry } from '../../utils/defineOwnEntry';

interface Host {
  settings: JournalitSettings;
  saveSettings(): Promise<void>;
}

export class AccountMetadataSavedError extends AggregateError {
  readonly outcome = 'saved';

  constructor(error: unknown) {
    super(
      [error],
      'Account metadata was saved, but its view could not be refreshed. Refresh Journalit instead of repeating the change.'
    );
    this.name = 'AccountMetadataSavedError';
  }
}

function newAccountSettings(): AccountSettings {
  return {
    defaultAccountType: AccountType.DEMO,
    defaultDrawdownType: DrawdownType.NONE,
    defaultDrawdownAmount: 0,
    showBalanceInDashboard: true,
    excludedAccountTypes: ['archived'],
    includeWithdrawalsFromExcluded: { archived: true, demo: false },
    accountTypeOrder: ['funded', 'evaluation', 'demo', 'archived'],
  };
}


export async function commitAccountMetadata(
  host: Host,
  name: string,
  materialize: (current: AccountMetadata | undefined) => AccountMetadata
): Promise<void> {
  const root = host.settings;
  const previousAccount = root.account;
  const account = previousAccount ?? newAccountSettings();
  const initialAccountSignature =
    previousAccount === undefined ? JSON.stringify(account) : undefined;
  const previousMap = account.accountMetadata;
  const lookup = normalizeAccountLookupKey(name);
  const matching = Object.keys(previousMap ?? {}).filter(
    (key) => normalizeAccountLookupKey(key) === lookup
  );
  if (matching.length > 1)
    throw new Error(
      'Account metadata is ambiguous. Resolve the duplicate names before saving.'
    );
  const key = matching[0] ?? name;
  const hadPrevious =
    previousMap !== undefined &&
    Object.prototype.hasOwnProperty.call(previousMap, key) === true;
  const before = hadPrevious ? structuredClone(previousMap[key]) : undefined;
  const beforeSignature = JSON.stringify(before);
  const next = structuredClone(
    materialize(before === undefined ? undefined : structuredClone(before))
  );
  const expected = JSON.stringify(next);
  const installed = { ...previousMap };
  defineOwnEntry(installed, key, next);
  account.accountMetadata = installed;
  root.account = account;

  function owns(
    map: Record<string, AccountMetadata>,
    value: AccountMetadata | undefined,
    signature: string | undefined
  ): boolean {
    const present = Object.prototype.hasOwnProperty.call(map, key) === true;
    return (
      host.settings === root &&
      root.account === account &&
      account.accountMetadata === map &&
      (value === undefined ? !present : present && map[key] === value) &&
      JSON.stringify(present ? map[key] : undefined) === signature
    );
  }

  try {
    await host.saveSettings();
  } catch (error) {
    if (!owns(installed, next, expected)) {
      throw new AggregateError(
        [error],
        'Account metadata could not be saved and recovery was incomplete because settings changed.'
      );
    }
    
    const restored = { ...installed };
    if (before === undefined) delete restored[key];
    else defineOwnEntry(restored, key, before);
    account.accountMetadata = restored;
    const removeMap =
      previousMap === undefined && Object.keys(restored).length === 0;
    if (removeMap) delete account.accountMetadata;
    const removeAccount =
      previousAccount === undefined &&
      JSON.stringify(account) === initialAccountSignature;
    if (removeAccount) delete root.account;
    try {
      await host.saveSettings();
      const recovered = removeAccount
        ? host.settings === root && root.account === undefined
        : removeMap
          ? host.settings === root &&
            root.account === account &&
            account.accountMetadata === undefined
          : owns(restored, before, beforeSignature);
      if (!recovered)
        throw new Error('Account metadata changed during recovery.');
    } catch (recoveryError) {
      throw new AggregateError(
        [error, recoveryError],
        'Account metadata could not be saved and recovery was incomplete.'
      );
    }
    throw error;
  }
  
  
  
  const current = host.settings.account?.accountMetadata;
  const retained =
    current !== undefined &&
    Object.prototype.hasOwnProperty.call(current, key) === true &&
    JSON.stringify(current[key]) === expected;
  if (!owns(installed, next, expected) && !retained) {
    throw new Error(
      'Account metadata changed while saving. Review the account before retrying.'
    );
  }
}
