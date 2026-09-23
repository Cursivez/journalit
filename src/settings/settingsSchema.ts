import {
  CURRENT_SETTINGS_SCHEMA_VERSION,
  type JournalitSettings,
} from './types';

type SettingsMigrationMode = 'load' | 'import';

interface SettingsSchemaMigrationOptions {
  mode: SettingsMigrationMode;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
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
