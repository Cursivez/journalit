import { getLanguage } from 'obsidian';


import type { TranslationKey, Lang } from './locale/en';
import { decodeCompressedJson } from '../utils/compressedData';
import {
  englishPack,
  localePacks,
  localeBuildInfo,
} from './compressedLocales.generated';


type PluralBaseKey =
  | 'agent-requests.changes'
  | 'actions.review.answers'
  | 'actions.review.goals'
  | 'actions.review.checklist'
  | 'actions.review.session-log.add'
  | 'actions.review.images.add'
  | 'actions.review.images.remove'
  | 'actions.images.annotate'
  | 'actions.review.key-events.add'
  | 'actions.review.day-trade-fields.set'
  | 'actions.custom-field.delete'
  | 'actions.options.rename'
  | 'actions.options.rename-account-type'
  | 'actions.options.merge'
  | 'actions.options.delete'
  | 'actions.configuration.delete-question'
  | 'actions.configuration.delete-question-workflows'
  | 'actions.trade.entries'
  | 'actions.trade.exits'
  | 'actions.session-log-tag.delete'
  | 'actions.account.rename-trades'
  | 'actions.prop-challenge.configure.create'
  | 'actions.prop-challenge.configure.update'
  | 'settings.customization.custom-fields.convert.unreadable'
  | 'settings.customization.custom-fields.convert.conflict'
  | 'settings.customization.custom-fields.convert.summary-rate'
  | 'settings.customization.custom-fields.convert.summary-done'
  | 'settings.customization.custom-fields.convert.summary-skip'
  | 'settings.customization.custom-fields.convert.submit'
  | 'settings.customization.custom-fields.convert.done'
  | 'settings.customization.custom-fields.convert.changed'
  | 'settings.customization.custom-fields.convert.failed'
  | 'settings.customization.custom-fields.convert.remove-desc'
  | 'settings.customization.custom-fields.convert.remove-keeps'
  | 'settings.customization.custom-fields.convert.remove-confirm'
  | 'account.merge.phase.broker-accounts'
  | 'account.merge.review.phase-count'
  | 'validation.basic-tab-errors'
  | 'widget.day-trade-fields.apply'
  | 'widget.day-trade-fields.notice-updated'
  | 'widget.day-trade-fields.notice-failed'
  | 'validation.details-tab-errors'
  | 'validation.advanced-tab-errors'
  | 'form.manual-import-nudge.title'
  | 'notice.trades-deleted'
  | 'notice.trades-duplicated'
  | 'tradelog.batch.duplicate-skipped'
  | 'notice.mark-reviewed'
  | 'tradelog.batch.delete-confirm.message'
  | 'tradelog.batch.errors-count'
  | 'account.header.warning.trades-before-creation'
  | 'account.header.warning.trades-before-phase'
  | 'csv.results.success'
  | 'csv.results.skipped'
  | 'trade-import.pro-gate.title'
  | 'trade-import.preview.found'
  | 'trade-import.action.activate-pro'
  | 'quick-import.action.import-count'
  | 'settings.customization.custom-fields.option-count'
  | 'widget.best-worst-days.trade-count'
  | 'widget.trading-score.weeks-to-unlock'
  | 'widget.trading-score.trades-to-unlock'
  | 'widget.trading-score.trades-logged'
  | 'home.widget.unreviewed.need-review'
  | 'home.widget.streak.reviewed-trades-in-a-row'
  | 'home.widget.streak.reviewed-days-in-a-row'
  | 'home.widget.streak.reviewed-weeks-in-a-row'
  | 'home.widget.streak.reviewed-months-in-a-row'
  | 'home.widget.streak.missed-trades'
  | 'home.widget.streak.missed-days'
  | 'home.widget.streak.missed-weeks'
  | 'home.widget.streak.missed-months'
  | 'view.economic-calendar.import-count'
  | 'widget.key-events.event-count'
  | 'trade-handoff.trade-count'
  | 'trade-handoff.action.view-trades-count';

type SupportedLanguageCode =
  | 'en'
  | 'es'
  | 'de'
  | 'fr'
  | 'vi'
  | 'hi'
  | 'zh'
  | 'ru'
  | 'it'
  | 'ta'
  | 'ar';

const supportedLanguageCodes = new Set<string>([
  'en',
  'es',
  'de',
  'fr',
  'vi',
  'hi',
  'zh',
  'ru',
  'it',
  'ta',
  'ar',
]);

const loadedLocales: Partial<Record<SupportedLanguageCode, Partial<Lang>>> = {};
let englishLocale: Partial<Lang> | null = null;
const translationsAcrossLocales = new Map<TranslationKey, string[]>();

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function isLocaleRecord(
  value: Record<string, unknown>
): value is Partial<Lang> {
  for (const key in value) {
    if (typeof value[key] !== 'string') return false;
  }
  return true;
}

function parseEnglishLocale(): Partial<Lang> {
  const parsed = decodeCompressedJson(englishPack);
  if (!isRecord(parsed)) {
    return {};
  }
  
  
  for (const key of Object.keys(parsed)) {
    if (typeof parsed[key] !== 'string') delete parsed[key];
  }
  return isLocaleRecord(parsed) ? parsed : {};
}

function parseLocalePack(
  localeCode: keyof typeof localePacks
): Partial<Lang> | null {
  const pack = localePacks[localeCode];
  if (pack.format !== 'values') {
    return null;
  }

  const parsedValues = decodeCompressedJson(pack.data);
  if (!Array.isArray(parsedValues)) {
    return null;
  }
  const values = parsedValues.filter(
    (value): value is string | 0 => value === 0 || typeof value === 'string'
  );
  const englishKeys = getAllTranslationKeys();
  if (values.length !== localeBuildInfo.keyCount) {
    return null;
  }

  const en = getEnglishLocale();
  const locale: Partial<Lang> = {};
  
  
  for (let i = 0; i < values.length; i++) {
    const value = values[i];
    locale[englishKeys[i]] = value === 0 ? en[englishKeys[i]] : value;
  }

  return locale;
}

function getEnglishLocale(): Partial<Lang> {
  if (englishLocale) {
    return englishLocale;
  }

  const locale = parseEnglishLocale();

  englishLocale = locale;
  loadedLocales.en = englishLocale;
  return englishLocale;
}

function isSupportedLanguageCode(lang: string): lang is SupportedLanguageCode {
  return supportedLanguageCodes.has(lang);
}

function isLocalePackCode(
  localeCode: string
): localeCode is keyof typeof localePacks {
  return localeCode in localePacks;
}

function canonicalizeLanguageCode(lang: string): string {
  const parts = lang.trim().replace(/_/g, '-').split('-').filter(Boolean);
  if (parts.length === 0) return 'en';

  return parts
    .map((part, index) => {
      if (index === 0) return part.toLowerCase();
      if (part.length === 2 || part.length === 3) return part.toUpperCase();
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    })
    .join('-');
}

function normalizeLanguageCode(
  lang: string | null | undefined
): SupportedLanguageCode {
  if (!lang) return 'en';

  const canonicalLang = canonicalizeLanguageCode(lang);
  if (isSupportedLanguageCode(canonicalLang)) {
    return canonicalLang;
  }

  
  
  const [baseLanguage] = canonicalLang.split('-');
  if (isSupportedLanguageCode(baseLanguage)) {
    return baseLanguage;
  }

  return 'en';
}

type LanguageStorage = Pick<Storage, 'getItem'>;

function isLanguageStorage(value: unknown): value is LanguageStorage {
  return (
    typeof value === 'object' &&
    value !== null &&
    'getItem' in value &&
    typeof value.getItem === 'function'
  );
}

function getBrowserLanguageStorage(): LanguageStorage | undefined {
  if (typeof window === 'undefined') return undefined;
  const storageKey = `local${Date.name.slice(0, 0)}Storage`;
  const storage = window[storageKey];
  return isLanguageStorage(storage) ? storage : undefined;
}

function getObsidianLanguageStorage(): LanguageStorage {
  return {
    getItem: (key: string) => {
      if (key !== 'language') return null;
      const browserLanguage = readStorageItem(getBrowserLanguageStorage(), key);
      return browserLanguage ?? getLanguage();
    },
  };
}

function readStorageItem(
  storage: LanguageStorage | undefined,
  key: string
): string | null {
  try {
    return storage?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

function isDebugI18nEnabled(): boolean {
  return typeof window !== 'undefined' && window.JOURNALIT_DEBUG_I18N === true;
}

function warnI18n(message: string): void {
  if (isDebugI18nEnabled()) {
    console.warn(message);
  }
}


export function getCurrentLanguage(
  storage: LanguageStorage | undefined = getObsidianLanguageStorage()
): SupportedLanguageCode {
  const obsidianLang = readStorageItem(storage, 'language');
  return normalizeLanguageCode(obsidianLang);
}


function getLocale(): Partial<Lang> {
  const lang = getCurrentLanguage();
  if (loadedLocales[lang]) {
    return loadedLocales[lang];
  }

  if (lang === 'en') {
    return getEnglishLocale();
  }

  try {
    if (!(lang in localePacks)) {
      return getEnglishLocale();
    }

    const locale = parseLocalePack(lang);
    if (!locale) {
      return getEnglishLocale();
    }

    loadedLocales[lang] = locale;
    return locale;
  } catch (error) {
    warnI18n(
      `[Journalit i18n] Failed to load locale ${lang}: ${error instanceof Error ? error.message : String(error)}`
    );
    return getEnglishLocale();
  }
}

export function getTranslationsAcrossLocales(
  keys: readonly TranslationKey[]
): Map<TranslationKey, string[]> {
  const missingKeys = keys.filter((key) => !translationsAcrossLocales.has(key));
  if (missingKeys.length > 0) {
    const translationsByKey = new Map(
      missingKeys.map((key) => [key, new Set<string>()])
    );
    const locales: Array<Partial<Lang>> = [getEnglishLocale()];
    for (const localeCode of Object.keys(localePacks)) {
      if (!isLocalePackCode(localeCode)) continue;
      try {
        const locale = parseLocalePack(localeCode);
        if (locale) locales.push(locale);
      } catch (error) {
        warnI18n(
          `[Journalit i18n] Failed to inspect locale ${localeCode}: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    }
    for (const locale of locales) {
      for (const key of missingKeys) {
        const translation = locale[key];
        if (translation) translationsByKey.get(key)?.add(translation);
      }
    }
    for (const [key, translations] of translationsByKey) {
      translationsAcrossLocales.set(key, Array.from(translations));
    }
  }

  return new Map(
    keys.map((key) => [key, translationsAcrossLocales.get(key) ?? []])
  );
}

function hasTranslationInLocale(locale: Partial<Lang>, key: string): boolean {
  return key in locale;
}


export function t(
  key: TranslationKey,
  params?: Record<string, string>
): string {
  const locale = getLocale();
  const en = getEnglishLocale();

  
  let translation: string | undefined = locale[key] || en[key];

  
  if (!translation) {
    warnI18n(`[Journalit i18n] Missing translation for key: ${key}`);
    return key;
  }

  
  if (params) {
    translation = translation.replace(
      /\{(\w+)\}/g,
      (match: string, paramKey: string) => {
        const value = params[paramKey];
        return value !== undefined ? value : match;
      }
    );
  }

  return translation;
}


export function tPlural(
  baseKey: PluralBaseKey,
  count: number,
  params?: Record<string, string>
): string {
  const lang = getCurrentLanguage();
  const locale = getLocale();

  
  const otherKey = `${baseKey}.other`;
  if (!hasTranslation(otherKey)) {
    warnI18n(
      `[Journalit i18n] Invalid plural key: ${baseKey} (missing .other)`
    );
    return `${baseKey} (${count})`;
  }

  if (!hasTranslationInLocale(locale, otherKey)) {
    warnI18n(
      `[Journalit i18n] Missing plural translation for key: ${otherKey} in ${lang}`
    );
  }

  
  const pluralRules = getPluralRules(lang);
  const category = pluralRules.select(count); 
  const specificKey = `${baseKey}.${category}`;

  if (
    hasTranslation(specificKey) &&
    hasTranslationInLocale(locale, specificKey)
  ) {
    return t(specificKey, { count: String(count), ...params });
  }

  return t(otherKey, { count: String(count), ...params });
}

const pluralRulesCache = new Map<string, Intl.PluralRules>();

function getPluralRules(lang: string): Intl.PluralRules {
  let rules = pluralRulesCache.get(lang);
  if (!rules) {
    rules = new Intl.PluralRules(lang);
    pluralRulesCache.set(lang, rules);
  }
  return rules;
}


export function hasTranslation(key: string): key is TranslationKey {
  const locale = getLocale();
  const en = getEnglishLocale();
  return hasTranslationInLocale(locale, key) || key in en;
}


export function getAllTranslationKeys(): TranslationKey[] {
  const en = getEnglishLocale();
  return Object.keys(en).filter((key): key is TranslationKey => key in en);
}

export type { TranslationKey };
