import type { EntityShortcut, JournalitSettings } from '../settings/types';
import { DEFAULT_SETTINGS } from '../settings/types';
import { migrateRetiredSettings } from '../settings/settingsSchema';

export type JournalSettingsContext = 'real' | 'sample';

export const SAMPLE_SETTINGS_SCHEMA_VERSION = 1;

const JOURNAL_SCOPED_KEYS = new Set([
  'trade',
  'tradeLog',
  'sessionMode',
  'reviewV2',
  'templates',
  'drc',
  'weekly',
  'monthly',
  'quarterly',
  'yearly',
  'reviews',
  'dashboard',
  'home',
  'viewFilters',
  'customOptions',
  'customTradeFields',
  'customFieldOptions',
  'customReviewFields',
  'customReviewFieldOptions',
  'account',
  'initializedOptionTypes',
  'symbolMappings',
  'copyTradeAdjustments',
  'csvFavoriteAccount',
  'economicCalendar',
]);

const JOURNAL_SCOPED_PREFIXES = [
  'customOptions_',
  'customTradeFields_',
  'customFieldOptions_',
];

export interface SampleSettingsDocument {
  schemaVersion: typeof SAMPLE_SETTINGS_SCHEMA_VERSION;
  settings: Partial<JournalitSettings>;
  localMeta: Record<string, unknown>;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

function parseEntityShortcuts(value: unknown): EntityShortcut[] {
  if (!Array.isArray(value)) return [];
  const shortcuts: EntityShortcut[] = [];
  for (const shortcut of value) {
    if (
      !isRecord(shortcut) ||
      typeof shortcut.id !== 'string' ||
      typeof shortcut.order !== 'number' ||
      !Number.isSafeInteger(shortcut.order) ||
      !isRecord(shortcut.target)
    ) {
      continue;
    }
    const target = shortcut.target;
    if (target.kind === 'account' && typeof target.accountName === 'string') {
      shortcuts.push({
        id: shortcut.id,
        order: shortcut.order,
        target: { kind: 'account', accountName: target.accountName },
      });
      continue;
    }
    if (target.kind === 'setup' && typeof target.setupId === 'string') {
      shortcuts.push({
        id: shortcut.id,
        order: shortcut.order,
        target: { kind: 'setup', setupId: target.setupId },
      });
    }
  }
  return shortcuts;
}

function isJournalScopedSettingsKey(key: string): boolean {
  return (
    JOURNAL_SCOPED_KEYS.has(key) ||
    JOURNAL_SCOPED_PREFIXES.some((prefix) => key.startsWith(prefix))
  );
}

function createSampleGeneralSettings(
  journalFolderPath: string | undefined
): NonNullable<JournalitSettings['general']> {
  return {
    ...structuredClone(DEFAULT_SETTINGS.general!),
    journalFolderPath:
      journalFolderPath ?? DEFAULT_SETTINGS.general!.journalFolderPath,
  };
}

const REPLACE_RECORD_PATHS = new Set([
  'account.accountMetadata',
  'dashboard.layouts',
  'home.layouts',
]);

function normalizeSettingValue(
  value: unknown,
  fallback: unknown,
  path: string
): unknown {
  if (fallback === undefined) return structuredClone(value);
  if (fallback === null) return null;
  if (Array.isArray(fallback)) {
    return Array.isArray(value)
      ? structuredClone(value)
      : structuredClone(fallback);
  }
  if (isRecord(fallback)) {
    if (!isRecord(value)) return structuredClone(fallback);
    if (REPLACE_RECORD_PATHS.has(path) || Object.keys(fallback).length === 0) {
      return structuredClone(value);
    }
    const normalized: Record<string, unknown> = structuredClone(fallback);
    for (const [key, nestedValue] of Object.entries(value)) {
      normalized[key] = Object.prototype.hasOwnProperty.call(fallback, key)
        ? normalizeSettingValue(nestedValue, fallback[key], `${path}.${key}`)
        : structuredClone(nestedValue);
    }
    return normalized;
  }
  return typeof value === typeof fallback ? structuredClone(value) : fallback;
}

export function createDefaultSampleSettings(): Partial<JournalitSettings> {
  const defaults = structuredClone(DEFAULT_SETTINGS);
  return extractJournalScopedSettings(defaults);
}

export function extractJournalScopedSettings(
  settings: JournalitSettings
): Partial<JournalitSettings> {
  const result: Partial<JournalitSettings> = {};
  for (const key of Object.keys(settings)) {
    if (isJournalScopedSettingsKey(key)) {
      result[key] = settings[key];
    }
  }
  result.general = createSampleGeneralSettings(
    settings.general?.journalFolderPath
  );
  result.navigation = {
    ...structuredClone(DEFAULT_SETTINGS.navigation!),
    entityShortcuts: structuredClone(
      settings.navigation?.entityShortcuts ?? []
    ),
  };
  return result;
}

export function mergeRealGlobalSettings(
  realSettings: JournalitSettings,
  activeSettings: JournalitSettings
): JournalitSettings {
  const merged: JournalitSettings = structuredClone(realSettings);
  for (const key of Object.keys(activeSettings)) {
    if (
      key !== 'general' &&
      key !== 'navigation' &&
      !isJournalScopedSettingsKey(key)
    ) {
      merged[key] = activeSettings[key];
    }
  }
  merged.navigation = {
    ...DEFAULT_SETTINGS.navigation!,
    ...activeSettings.navigation,
    entityShortcuts: structuredClone(
      realSettings.navigation?.entityShortcuts ?? []
    ),
  };
  merged.general = {
    ...DEFAULT_SETTINGS.general!,
    ...realSettings.general,
    ...activeSettings.general,
    journalFolderPath:
      realSettings.general?.journalFolderPath ??
      DEFAULT_SETTINGS.general!.journalFolderPath,
  };
  return merged;
}

export function composeSampleSettings(
  realSettings: JournalitSettings,
  sampleSettings: Partial<JournalitSettings>
): JournalitSettings {
  const composed: JournalitSettings = structuredClone(realSettings);
  const defaults = createDefaultSampleSettings();

  for (const key of Object.keys(composed)) {
    if (isJournalScopedSettingsKey(key)) {
      delete composed[key];
    }
  }
  for (const key of Object.keys(defaults)) {
    composed[key] = defaults[key];
  }
  for (const key of Object.keys(sampleSettings)) {
    if (isJournalScopedSettingsKey(key)) {
      composed[key] = sampleSettings[key];
    }
  }
  composed.general = {
    ...DEFAULT_SETTINGS.general!,
    ...realSettings.general,
    journalFolderPath:
      sampleSettings.general?.journalFolderPath ??
      defaults.general?.journalFolderPath ??
      DEFAULT_SETTINGS.general!.journalFolderPath,
  };
  composed.navigation = {
    ...DEFAULT_SETTINGS.navigation!,
    ...realSettings.navigation,
    entityShortcuts: structuredClone(
      sampleSettings.navigation?.entityShortcuts ??
        defaults.navigation?.entityShortcuts ??
        []
    ),
  };

  return composed;
}

export function createSampleSettingsDocument(
  settings: Partial<JournalitSettings> = createDefaultSampleSettings(),
  localMeta: Record<string, unknown> = {}
): SampleSettingsDocument {
  return {
    schemaVersion: SAMPLE_SETTINGS_SCHEMA_VERSION,
    settings,
    localMeta,
  };
}

export function parseSampleSettingsDocument(
  value: unknown
): SampleSettingsDocument | null {
  if (!isRecord(value)) return null;
  if (value.schemaVersion !== SAMPLE_SETTINGS_SCHEMA_VERSION) return null;
  if (!isRecord(value.settings) || !isRecord(value.localMeta)) return null;

  const settings: Partial<JournalitSettings> = {};
  const defaults = createDefaultSampleSettings();
  for (const key of Object.keys(value.settings)) {
    if (isJournalScopedSettingsKey(key)) {
      const fallback = defaults[key];
      if (fallback !== undefined) {
        settings[key] = normalizeSettingValue(
          value.settings[key],
          fallback,
          key
        );
      } else if (isRecord(value.settings[key])) {
        settings[key] = structuredClone(value.settings[key]);
      }
    }
  }
  const general = isRecord(value.settings.general)
    ? value.settings.general
    : null;
  settings.general = createSampleGeneralSettings(
    typeof general?.journalFolderPath === 'string'
      ? general.journalFolderPath
      : undefined
  );
  const navigation = isRecord(value.settings.navigation)
    ? value.settings.navigation
    : null;
  settings.navigation = {
    ...structuredClone(DEFAULT_SETTINGS.navigation!),
    entityShortcuts: parseEntityShortcuts(navigation?.entityShortcuts),
  };

  migrateRetiredSettings(settings, value.settings);

  return createSampleSettingsDocument(settings, { ...value.localMeta });
}
