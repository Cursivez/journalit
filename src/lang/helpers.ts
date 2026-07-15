import { getLanguage } from 'obsidian';


import type { TranslationKey, Lang } from './locale/en';
import { inflateSync, strFromU8 } from 'fflate';
import {
  englishPack,
  localePacks,
  localeBuildInfo,
} from './compressedLocales.generated';


type PluralBaseKey =
  | 'validation.basic-tab-errors'
  | 'validation.details-tab-errors'
  | 'validation.advanced-tab-errors'
  | 'notice.csv-symbol-mappings-created'
  | 'notice.trades-deleted'
  | 'notice.mark-reviewed'
  | 'tradelog.batch.delete-confirm.message'
  | 'tradelog.batch.errors-count'
  | 'account.header.warning.trades-before-creation'
  | 'csv.results.success'
  | 'csv.results.updated'
  | 'csv.results.skipped'
  | 'csv.results.more-trades'
  | 'settings.customization.custom-fields.option-count'
  | 'widget.best-worst-days.trade-count'
  | 'widget.trading-score.weeks-to-unlock'
  | 'widget.trading-score.trades-to-unlock'
  | 'widget.trading-score.trades-logged'
  | 'home.widget.unreviewed.need-review';

const localeAliases = {
  pt: 'pt-BR',
  'zh-CN': 'zh',
} as const;

type SupportedLanguageCode =
  | 'en'
  | 'es'
  | 'de'
  | 'fr'
  | 'vi'
  | 'pt-BR'
  | 'pt'
  | 'zh'
  | 'zh-CN'
  | 'zh-TW'
  | 'ja'
  | 'ko'
  | 'ru';

const supportedLanguageCodes = new Set<string>([
  'en',
  'es',
  'de',
  'fr',
  'vi',
  'pt-BR',
  'pt',
  'zh',
  'zh-CN',
  'zh-TW',
  'ja',
  'ko',
  'ru',
]);

const loadedLocales: Partial<Record<SupportedLanguageCode, Partial<Lang>>> = {};
let englishLocale: Partial<Lang> | null = null;
const translationsAcrossLocales = new Map<TranslationKey, string[]>();

const BASE64_ALPHABET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const BASE64_VALUES = new Map(
  Array.from(BASE64_ALPHABET, (char, index) => [char, index])
);

function base64ToBytes(base64: string): Uint8Array {
  const output: number[] = [];
  let buffer = 0;
  let bits = 0;

  for (const char of base64) {
    if (char === '=') break;
    const value = BASE64_VALUES.get(char);
    if (value === undefined) continue;
    buffer = (buffer << 6) | value;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      output.push((buffer >> bits) & 0xff);
    }
  }

  return Uint8Array.from(output);
}

function unpackJson(base64: string): unknown {
  const bytes = base64ToBytes(base64);
  const inflateBytes: (data: Uint8Array) => Uint8Array = inflateSync;
  const decodeText: (data: Uint8Array) => string = strFromU8;
  const json = decodeText(inflateBytes(bytes));
  const parsed: unknown = JSON.parse(json);
  return parsed;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function parseEnglishLocale(): Partial<Lang> {
  const parsed = unpackJson(englishPack);
  const locale: Partial<Lang> = {};
  if (!isRecord(parsed)) {
    return locale;
  }

  for (const [key, value] of Object.entries(parsed)) {
    if (typeof value === 'string') {
      Object.defineProperty(locale, key, {
        value,
        enumerable: true,
        configurable: true,
        writable: true,
      });
    }
  }

  return locale;
}

function parseLocalePack(
  localeCode: keyof typeof localePacks
): Partial<Lang> | null {
  const pack = localePacks[localeCode];
  if (pack.format !== 'values') {
    return null;
  }

  const parsedValues = unpackJson(pack.data);
  if (!Array.isArray(parsedValues)) {
    return null;
  }
  const values = parsedValues.filter(
    (value): value is string | null =>
      value === null || typeof value === 'string'
  );
  const englishKeys = getAllTranslationKeys();
  if (values.length !== localeBuildInfo.keyCount) {
    return null;
  }

  const locale: Partial<Lang> = {};
  for (let i = 0; i < values.length; i++) {
    const value = values[i];
    if (value !== null) {
      locale[englishKeys[i]] = value;
    }
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

  const [baseLanguage, ...subtags] = canonicalLang.split('-');

  if (baseLanguage === 'zh') {
    const lowerSubtags = subtags.map((subtag) => subtag.toLowerCase());
    const isTraditionalChinese = lowerSubtags.some((subtag) =>
      ['tw', 'hk', 'mo', 'hant'].includes(subtag)
    );

    return isTraditionalChinese ? 'zh-TW' : 'zh';
  }

  if (baseLanguage === 'pt') {
    return 'pt';
  }

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

  const compressedLocaleCode =
    lang === 'pt'
      ? localeAliases.pt
      : lang === 'zh-CN'
        ? localeAliases['zh-CN']
        : lang;

  try {
    if (!(compressedLocaleCode in localePacks)) {
      return getEnglishLocale();
    }

    const locale = parseLocalePack(compressedLocaleCode);
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
