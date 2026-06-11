

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
let englishLocale: Lang | null = null;

function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes;
}

function unpackJson<T>(base64: string): T {
  const bytes = base64ToBytes(base64);
  const json = strFromU8(inflateSync(bytes));
  return JSON.parse(json) as T;
}

function parseEnglishLocale(): Lang {
  return unpackJson<Lang>(englishPack);
}

function parseLocalePack(
  localeCode: keyof typeof localePacks
): Partial<Lang> | null {
  const pack = localePacks[localeCode];
  if (pack.format !== 'values') {
    return null;
  }

  const values = unpackJson<Array<string | null>>(pack.data);
  const englishKeys = Object.keys(getEnglishLocale()) as Array<keyof Lang>;
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

function getEnglishLocale(): Lang {
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

function getWindowLocalStorage(): LanguageStorage | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }

  try {
    return window.localStorage ?? undefined;
  } catch {
    return undefined;
  }
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
  storage: LanguageStorage | undefined = getWindowLocalStorage()
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
    localeAliases[lang as keyof typeof localeAliases] ?? lang;

  try {
    if (!(compressedLocaleCode in localePacks)) {
      return getEnglishLocale();
    }

    const locale = parseLocalePack(
      compressedLocaleCode as keyof typeof localePacks
    );
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

function hasTranslationInLocale(locale: Partial<Lang>, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(locale, key);
}


export function t(
  key: TranslationKey,
  params?: Record<string, string>
): string {
  const locale = getLocale();
  const en = getEnglishLocale();

  
  let translation = locale[key] || en[key];

  
  if (!translation) {
    warnI18n(`[Journalit i18n] Missing translation for key: ${key}`);
    return key;
  }

  
  if (params) {
    translation = translation!.replace(/\{(\w+)\}/g, (match, paramKey) => {
      const value = params[paramKey];
      return value !== undefined ? value : match;
    });
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
  return (
    hasTranslationInLocale(locale, key) ||
    Object.prototype.hasOwnProperty.call(en, key)
  );
}


export function getAllTranslationKeys(): TranslationKey[] {
  return Object.keys(getEnglishLocale()) as TranslationKey[];
}

export type { TranslationKey };
