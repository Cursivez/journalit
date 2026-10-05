import {
  CURRENT_SETTINGS_SCHEMA_VERSION,
  type JournalitSettings,
} from './types';
import { migratePropChallengeLiveBalances } from '../services/propChallenge/PropChallengeBalance';
import {
  migratePropChallengePayoutRequirements,
  migratePersonalProfilePayoutRequirements,
} from '../services/propChallenge/PropChallengePayoutRequirements';
import { normalizePropChallengeConfig } from '../services/propChallenge/normalization';
import { normalizePersonalProfiles } from '../services/propChallenge/PersonalPropFirmProfiles';

type SettingsMigrationMode = 'load' | 'import';

interface SettingsSchemaMigrationOptions {
  mode: SettingsMigrationMode;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function getImportedAccountMetadata(
  source: unknown
): Record<string, unknown> | undefined {
  if (!isRecord(source)) return undefined;
  const account: unknown = source.account;
  if (!isRecord(account)) return undefined;
  const metadata: unknown = account.accountMetadata;
  return isRecord(metadata) ? metadata : undefined;
}

function migrateImportedLiveBalances(
  settings: JournalitSettings,
  source: unknown
): boolean {
  const accountSettings = settings.account;
  const accounts = accountSettings?.accountMetadata;
  const imported = getImportedAccountMetadata(source);
  if (!accountSettings || !accounts || !imported) return false;
  const migratedAccounts = { ...accounts };
  let selected = false;
  let changed = false;
  for (const [name, incoming] of Object.entries(imported)) {
    if (
      !isRecord(incoming) ||
      !Object.prototype.hasOwnProperty.call(incoming, 'liveBalanceAdjustment')
    )
      continue;
    const metadata = accounts[name];
    if (!isRecord(metadata)) continue;
    
    
    const config = normalizePropChallengeConfig(metadata.propChallenge);
    if (!config) continue;
    const normalized = { ...metadata, propChallenge: config };
    changed =
      migratePropChallengeLiveBalances({ [name]: normalized }) || changed;
    migratedAccounts[name] = normalized;
    selected = true;
  }
  
  if (selected)
    settings.account = {
      ...accountSettings,
      accountMetadata: migratedAccounts,
    };
  return changed;
}

function getStoredSchemaVersion(value: unknown): number {
  if (!isRecord(value)) return 0;
  const version = value.settingsSchemaVersion;
  return typeof version === 'number' &&
    Number.isInteger(version) &&
    version >= 0
    ? version
    : 0;
}

function getLegacyAutoCreateSetting(value: unknown): boolean | null {
  if (!isRecord(value)) return null;

  const reviews = isRecord(value.reviews) ? value.reviews : undefined;
  const globalValue =
    typeof reviews?.globalAutoCreate === 'boolean'
      ? reviews.globalAutoCreate
      : null;

  const legacyValues: boolean[] = [];
  for (const sectionName of [
    'drc',
    'weekly',
    'monthly',
    'quarterly',
    'yearly',
  ]) {
    const section = isRecord(value[sectionName])
      ? value[sectionName]
      : undefined;
    if (typeof section?.autoCreateOnFirstTrade === 'boolean') {
      legacyValues.push(section.autoCreateOnFirstTrade);
    }
  }

  if (globalValue === false) return false;
  if (legacyValues.length === 0) return globalValue;

  
  
  
  return legacyValues.every(Boolean);
}

function deleteKey(record: Record<string, unknown>, key: string): boolean {
  if (!Object.prototype.hasOwnProperty.call(record, key)) return false;
  delete record[key];
  return true;
}

function removeRetiredSettings(settings: Partial<JournalitSettings>): boolean {
  let changed = deleteKey(settings, 'uiCustomization');

  for (const sectionName of [
    'drc',
    'weekly',
    'monthly',
    'quarterly',
    'yearly',
  ]) {
    const section = settings[sectionName];
    if (isRecord(section)) {
      changed = deleteKey(section, 'autoCreateOnFirstTrade') || changed;
    }
  }

  if (isRecord(settings.reviewV2)) {
    changed = deleteKey(settings.reviewV2, 'scalperDefaults') || changed;
  }

  return changed;
}


export function migrateRetiredSettings(
  settings: Partial<JournalitSettings>,
  source: unknown
): boolean {
  let changed = false;
  const legacyAutoCreate = getLegacyAutoCreateSetting(source);
  if (legacyAutoCreate !== null) {
    if (!settings.reviews) {
      settings.reviews = { globalAutoCreate: legacyAutoCreate };
      changed = true;
    } else if (settings.reviews.globalAutoCreate !== legacyAutoCreate) {
      settings.reviews.globalAutoCreate = legacyAutoCreate;
      changed = true;
    }
  }

  return removeRetiredSettings(settings) || changed;
}


export function migrateSettingsSchema(
  settings: JournalitSettings,
  source: unknown,
  options: SettingsSchemaMigrationOptions
): boolean {
  
  
  const storedVersion = getStoredSchemaVersion(source);

  let changed =
    storedVersion < 1
      ? migrateRetiredSettings(settings, source)
      : removeRetiredSettings(settings);

  if (options.mode === 'load') {
    if (settings.account?.accountMetadata) {
      changed =
        migratePropChallengeLiveBalances(settings.account.accountMetadata) ||
        changed;
    }
  } else {
    changed = migrateImportedLiveBalances(settings, source) || changed;
  }

  if (storedVersion < 2) {
    const importedAccounts =
      options.mode === 'import'
        ? getImportedAccountMetadata(source)
        : undefined;
    const profilesIncluded =
      options.mode === 'load' ||
      (isRecord(source) &&
        Object.prototype.hasOwnProperty.call(
          source,
          'personalPropFirmProfiles'
        ) === true);
    const originalPersonalProfiles =
      settings.personalPropFirmProfiles === undefined
        ? []
        : options.mode === 'import' && profilesIncluded
          ? normalizePersonalProfiles(settings.personalPropFirmProfiles)
          : settings.personalPropFirmProfiles;
    if (profilesIncluded && settings.personalPropFirmProfiles !== undefined) {
      const profiles = originalPersonalProfiles;
      const migrated = migratePersonalProfilePayoutRequirements(profiles);
      if (migrated !== profiles) {
        settings.personalPropFirmProfiles = migrated;
        changed = true;
      }
    }
    const accountSettings = settings.account;
    const accounts = accountSettings?.accountMetadata;
    if (
      accountSettings &&
      accounts &&
      (options.mode === 'load' || isRecord(accounts))
    ) {
      const migratedAccounts = { ...accounts };
      let accountsChanged = false;
      for (const [accountName, metadata] of Object.entries(accounts)) {
        
        if (options.mode === 'import') {
          const imported = importedAccounts?.[accountName];
          
          
          if (
            !isRecord(metadata) ||
            !isRecord(imported) ||
            !isRecord(imported.propChallenge) ||
            !Array.isArray(imported.propChallenge.phases)
          )
            continue;
        }
        const config =
          options.mode === 'import'
            ? normalizePropChallengeConfig(metadata.propChallenge)
            : metadata.propChallenge;
        if (!config) {
          if (options.mode === 'import') {
            
            
            const quarantined = {
              ...metadata,
              propChallengeQuarantine: metadata.propChallenge,
            };
            delete quarantined.propChallenge;
            migratedAccounts[accountName] = quarantined;
            accountsChanged = true;
          }
          continue;
        }
        const migrated = migratePropChallengePayoutRequirements(
          config,
          originalPersonalProfiles
        );
        
        
        if (options.mode === 'import') {
          migratedAccounts[accountName] = {
            ...metadata,
            propChallenge: migrated,
          };
          accountsChanged = true;
        } else if (migrated !== config) {
          metadata.propChallenge = migrated;
          changed = true;
        }
      }
      if (accountsChanged) {
        settings.account = {
          ...accountSettings,
          accountMetadata: migratedAccounts,
        };
        changed = true;
      }
    }
  }

  
  
  
  const targetVersion =
    options.mode === 'load' && storedVersion > CURRENT_SETTINGS_SCHEMA_VERSION
      ? storedVersion
      : CURRENT_SETTINGS_SCHEMA_VERSION;
  if (storedVersion !== targetVersion) {
    changed = true;
  }
  settings.settingsSchemaVersion = targetVersion;

  return changed;
}
