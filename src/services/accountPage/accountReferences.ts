import type { JournalitSettings } from '../../settings/types';
import type { AccountReferenceChange } from '../accountMerge/types';
import { normalizeAccountLookupKey } from '../trade/core/TradeAccountIdentity';


export function repointAccountReferences(
  settings: JournalitSettings,
  oldName: string,
  newName: string
): AccountReferenceChange[] {
  const changes: AccountReferenceChange[] = [];
  if (oldName === newName) {
    return changes;
  }

  const oldLookupKey = normalizeAccountLookupKey(oldName);
  const newLookupKey = normalizeAccountLookupKey(newName);

  const accountMetadata = settings.account?.accountMetadata;
  if (accountMetadata) {
    for (const [metadataKey, accountEntry] of Object.entries(accountMetadata)) {
      if (!accountEntry.copyTradingPeriods?.length) {
        continue;
      }

      const previousPeriods = accountEntry.copyTradingPeriods;
      const updatedPeriods = previousPeriods.map((period) =>
        normalizeAccountLookupKey(period.baseAccount) === oldLookupKey
          ? { ...period, baseAccount: newName }
          : period
      );

      const changed = updatedPeriods.some(
        (period, index) =>
          period.baseAccount !== previousPeriods[index]?.baseAccount
      );
      if (!changed) {
        continue;
      }

      changes.push({
        kind: 'copyTradingPeriods',
        accountKey: metadataKey,
        previousPeriods,
      });
      accountEntry.copyTradingPeriods = updatedPeriods;
    }
  }

  
  
  
  const lookupKeyChanged = oldLookupKey !== newLookupKey;
  const copyTradeAdjustments = lookupKeyChanged
    ? settings.copyTradeAdjustments
    : undefined;
  if (copyTradeAdjustments) {
    for (const [baseTradeKey, accountAdjustments] of Object.entries(
      copyTradeAdjustments
    )) {
      if (!(oldLookupKey in accountAdjustments)) {
        continue;
      }

      changes.push({
        kind: 'copyTradeAdjustment',
        baseTradeKey,
        previousOldLookupKey: oldLookupKey,
        previousOldAdjustment: accountAdjustments[oldLookupKey],
        previousNewLookupKey: newLookupKey,
        previousNewAdjustment: accountAdjustments[newLookupKey],
      });
      accountAdjustments[newLookupKey] = accountAdjustments[oldLookupKey];
      delete accountAdjustments[oldLookupKey];
    }
  }

  const accountMapping = settings.backendIntegration?.accountMapping;
  if (accountMapping) {
    for (const [accountId, displayName] of Object.entries(accountMapping)) {
      if (
        normalizeAccountLookupKey(String(displayName)) !== oldLookupKey ||
        displayName === newName
      ) {
        continue;
      }

      changes.push({
        kind: 'accountMapping',
        accountId,
        previous: displayName,
      });
      accountMapping[accountId] = newName;
    }
  }

  const homeGoals = settings.home?.goals;
  if (homeGoals) {
    for (const [goalId, goalConfig] of Object.entries(homeGoals)) {
      let changed = false;

      const nextAccountTargets = goalConfig.accountTargets
        ? { ...goalConfig.accountTargets }
        : undefined;
      if (nextAccountTargets) {
        for (const [accountName, target] of Object.entries(
          goalConfig.accountTargets ?? {}
        )) {
          if (normalizeAccountLookupKey(accountName) !== oldLookupKey) {
            continue;
          }

          let destinationKey: string | undefined;
          for (const key of Object.keys(nextAccountTargets)) {
            if (key === accountName) continue;
            if (normalizeAccountLookupKey(key) === newLookupKey) {
              destinationKey = key;
              break;
            }
          }

          if (destinationKey !== undefined) {
            
            
            nextAccountTargets[destinationKey] += target;
            delete nextAccountTargets[accountName];
            changed = true;
          } else if (accountName !== newName) {
            nextAccountTargets[newName] = target;
            delete nextAccountTargets[accountName];
            changed = true;
          }
        }
      }

      
      
      
      const remappedTargetAccounts = goalConfig.accountTargetAccounts?.map(
        (accountName) => {
          if (normalizeAccountLookupKey(accountName) !== oldLookupKey) {
            return accountName;
          }

          changed = true;
          return newName;
        }
      );
      let nextAccountTargetAccounts = remappedTargetAccounts;
      if (remappedTargetAccounts) {
        const seen = new Set<string>();
        const deduped = remappedTargetAccounts.filter((accountName) => {
          const key = normalizeAccountLookupKey(accountName);
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
        if (deduped.length !== remappedTargetAccounts.length) {
          changed = true;
          nextAccountTargetAccounts = deduped;
        }
      }

      if (!changed) {
        continue;
      }

      changes.push({
        kind: 'homeGoal',
        goalId,
        previousAccountTargets: goalConfig.accountTargets,
        previousAccountTargetAccounts: goalConfig.accountTargetAccounts,
      });
      goalConfig.accountTargets = nextAccountTargets;
      goalConfig.accountTargetAccounts = nextAccountTargetAccounts;
    }
  }

  changes.push(
    ...repointHomeAccountProgressReferences(settings, oldName, newName)
  );

  const csvFavoriteAccount = settings.csvFavoriteAccount;
  if (
    typeof csvFavoriteAccount === 'string' &&
    csvFavoriteAccount !== newName &&
    normalizeAccountLookupKey(csvFavoriteAccount) === oldLookupKey
  ) {
    changes.push({
      kind: 'csvFavoriteAccount',
      previous: csvFavoriteAccount,
    });
    settings.csvFavoriteAccount = newName;
  }

  return changes;
}


export function repointHomeAccountProgressReferences(
  settings: JournalitSettings,
  oldName: string,
  newName: string
): AccountReferenceChange[] {
  const changes: AccountReferenceChange[] = [];
  const accountProgress = settings.home?.accountProgress;
  if (!accountProgress || oldName === newName) return changes;
  const oldLookupKey = normalizeAccountLookupKey(oldName);
  for (const [widgetId, config] of Object.entries(accountProgress)) {
    
    
    if (!Array.isArray(config?.accounts)) continue;
    if (
      !config.accounts.some(
        (name) => normalizeAccountLookupKey(name) === oldLookupKey
      )
    ) {
      continue;
    }
    const nextAccounts: string[] = [];
    for (const name of config.accounts) {
      const next =
        normalizeAccountLookupKey(name) === oldLookupKey ? newName : name;
      if (
        !nextAccounts.some(
          (entry) =>
            normalizeAccountLookupKey(entry) === normalizeAccountLookupKey(next)
        )
      ) {
        nextAccounts.push(next);
      }
    }
    changes.push({
      kind: 'homeAccountProgress',
      widgetId,
      previousAccounts: config.accounts,
    });
    config.accounts = nextAccounts;
  }
  return changes;
}

export function revertAccountReferences(
  settings: JournalitSettings,
  changes: readonly AccountReferenceChange[]
): void {
  for (let index = changes.length - 1; index >= 0; index -= 1) {
    revertAccountReferenceChange(settings, changes[index]);
  }
}

function revertAccountReferenceChange(
  settings: JournalitSettings,
  change: AccountReferenceChange
): void {
  switch (change.kind) {
    case 'accountMapping': {
      const accountMapping = settings.backendIntegration?.accountMapping;
      if (!accountMapping) {
        return;
      }
      accountMapping[change.accountId] = change.previous;
      return;
    }
    case 'homeGoal': {
      const goalConfig = settings.home?.goals?.[change.goalId];
      if (!goalConfig) {
        return;
      }
      goalConfig.accountTargets = change.previousAccountTargets;
      goalConfig.accountTargetAccounts = change.previousAccountTargetAccounts;
      return;
    }
    case 'copyTradingPeriods': {
      const accountEntry =
        settings.account?.accountMetadata?.[change.accountKey];
      if (!accountEntry) {
        return;
      }
      accountEntry.copyTradingPeriods = change.previousPeriods;
      return;
    }
    case 'csvFavoriteAccount': {
      settings.csvFavoriteAccount = change.previous;
      return;
    }
    case 'homeAccountProgress': {
      const config = settings.home?.accountProgress?.[change.widgetId];
      if (!config) {
        return;
      }
      config.accounts = change.previousAccounts;
      return;
    }
    case 'copyTradeAdjustment': {
      const accountAdjustments =
        settings.copyTradeAdjustments?.[change.baseTradeKey];
      if (!accountAdjustments) {
        return;
      }
      accountAdjustments[change.previousOldLookupKey] =
        change.previousOldAdjustment;
      if (change.previousNewAdjustment === undefined) {
        delete accountAdjustments[change.previousNewLookupKey];
      } else {
        accountAdjustments[change.previousNewLookupKey] =
          change.previousNewAdjustment;
      }
      return;
    }
    default: {
      const _exhaustive: never = change;
      return _exhaustive;
    }
  }
}
