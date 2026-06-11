


export enum CurrencyCode {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  JPY = 'JPY',
  CAD = 'CAD',
  AUD = 'AUD',
  CHF = 'CHF',
  CNY = 'CNY',
  HKD = 'HKD',
  SGD = 'SGD',
  KWD = 'KWD',
  NGN = 'NGN',
}


export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
  locale: string;
  
  decimalPlaces: number;
  
  symbolBefore: boolean;
  
  spacing?: string;
}

const DEFAULT_LOCALE = 'en-US';
const DEFAULT_SPACING = '';
const DEFAULT_FALLBACK_DECIMALS = 2;
const runtimeCurrencyConfigCache = new Map<string, CurrencyConfig>();
const runtimeCurrencyFormatterCache = new Map<string, Intl.NumberFormat>();

function getRuntimeCurrencyFormatter(currencyCode: string): Intl.NumberFormat {
  let formatter = runtimeCurrencyFormatterCache.get(currencyCode);
  if (!formatter) {
    formatter = new Intl.NumberFormat(DEFAULT_LOCALE, {
      style: 'currency',
      currency: currencyCode,
    });
    runtimeCurrencyFormatterCache.set(currencyCode, formatter);
  }
  return formatter;
}


export const CURRENCY_CONFIGS: Record<CurrencyCode, CurrencyConfig> = {
  [CurrencyCode.USD]: {
    code: CurrencyCode.USD,
    symbol: '$',
    name: 'US Dollar',
    locale: 'en-US',
    decimalPlaces: 2,
    symbolBefore: true,
    spacing: DEFAULT_SPACING,
  },
  [CurrencyCode.EUR]: {
    code: CurrencyCode.EUR,
    symbol: '€',
    name: 'Euro',
    locale: 'en-IE',
    decimalPlaces: 2,
    symbolBefore: true,
    spacing: DEFAULT_SPACING,
  },
  [CurrencyCode.GBP]: {
    code: CurrencyCode.GBP,
    symbol: '£',
    name: 'British Pound',
    locale: 'en-GB',
    decimalPlaces: 2,
    symbolBefore: true,
    spacing: DEFAULT_SPACING,
  },
  [CurrencyCode.JPY]: {
    code: CurrencyCode.JPY,
    symbol: '¥',
    name: 'Japanese Yen',
    locale: 'ja-JP',
    decimalPlaces: 0,
    symbolBefore: true,
    spacing: DEFAULT_SPACING,
  },
  [CurrencyCode.CAD]: {
    code: CurrencyCode.CAD,
    symbol: 'C$',
    name: 'Canadian Dollar',
    locale: 'en-CA',
    decimalPlaces: 2,
    symbolBefore: true,
    spacing: DEFAULT_SPACING,
  },
  [CurrencyCode.AUD]: {
    code: CurrencyCode.AUD,
    symbol: 'A$',
    name: 'Australian Dollar',
    locale: 'en-AU',
    decimalPlaces: 2,
    symbolBefore: true,
    spacing: DEFAULT_SPACING,
  },
  [CurrencyCode.CHF]: {
    code: CurrencyCode.CHF,
    symbol: 'Fr',
    name: 'Swiss Franc',
    locale: 'de-CH',
    decimalPlaces: 2,
    symbolBefore: false,
    spacing: DEFAULT_SPACING,
  },
  [CurrencyCode.CNY]: {
    code: CurrencyCode.CNY,
    symbol: '¥',
    name: 'Chinese Yuan',
    locale: 'zh-CN',
    decimalPlaces: 2,
    symbolBefore: true,
    spacing: DEFAULT_SPACING,
  },
  [CurrencyCode.HKD]: {
    code: CurrencyCode.HKD,
    symbol: 'HK$',
    name: 'Hong Kong Dollar',
    locale: 'zh-HK',
    decimalPlaces: 2,
    symbolBefore: true,
    spacing: DEFAULT_SPACING,
  },
  [CurrencyCode.SGD]: {
    code: CurrencyCode.SGD,
    symbol: 'S$',
    name: 'Singapore Dollar',
    locale: 'en-SG',
    decimalPlaces: 2,
    symbolBefore: true,
    spacing: DEFAULT_SPACING,
  },
  [CurrencyCode.KWD]: {
    code: CurrencyCode.KWD,
    symbol: 'KD',
    name: 'Kuwaiti Dinar',
    locale: 'en-US',
    decimalPlaces: 3,
    symbolBefore: false,
    spacing: DEFAULT_SPACING,
  },
  [CurrencyCode.NGN]: {
    code: CurrencyCode.NGN,
    symbol: '₦',
    name: 'Nigerian Naira',
    locale: 'en-NG',
    decimalPlaces: 2,
    symbolBefore: true,
    spacing: DEFAULT_SPACING,
  },
};

function normalizeCurrencyCode(
  currencyCode: string | undefined | null,
  fallback: string = CurrencyCode.USD
): string {
  const normalized =
    typeof currencyCode === 'string' ? currencyCode.trim().toUpperCase() : '';

  return normalized || fallback;
}

function isIsoCurrencyCode(currencyCode: string): boolean {
  return /^[A-Z]{3}$/.test(currencyCode);
}

function extractCurrencySpacing(
  parts: Intl.NumberFormatPart[],
  currencyIndex: number,
  integerIndex: number
): string {
  if (currencyIndex === -1 || integerIndex === -1) {
    return DEFAULT_SPACING;
  }

  const start = Math.min(currencyIndex, integerIndex) + 1;
  const end = Math.max(currencyIndex, integerIndex);

  return parts
    .slice(start, end)
    .filter((part) => part.type === 'literal')
    .map((part) => part.value.replace(/\u00A0/g, ' '))
    .join('');
}

function buildRuntimeCurrencyConfig(currencyCode: string): CurrencyConfig {
  if (!isIsoCurrencyCode(currencyCode)) {
    return {
      code: currencyCode,
      symbol: currencyCode,
      name: currencyCode,
      locale: DEFAULT_LOCALE,
      decimalPlaces:
        currencyCode === CurrencyCode.JPY ? 0 : DEFAULT_FALLBACK_DECIMALS,
      symbolBefore: true,
      spacing: ' ',
    };
  }

  try {
    const formatter = getRuntimeCurrencyFormatter(currencyCode);
    const resolved = formatter.resolvedOptions();
    const parts = formatter.formatToParts(1);
    const currencyIndex = parts.findIndex((part) => part.type === 'currency');
    const integerIndex = parts.findIndex((part) => part.type === 'integer');
    const symbol =
      parts.find((part) => part.type === 'currency')?.value || currencyCode;

    return {
      code: currencyCode,
      symbol,
      name: currencyCode,
      locale: DEFAULT_LOCALE,
      decimalPlaces:
        resolved.maximumFractionDigits ?? DEFAULT_FALLBACK_DECIMALS,
      symbolBefore: currencyIndex !== -1 && currencyIndex < integerIndex,
      spacing: extractCurrencySpacing(parts, currencyIndex, integerIndex),
    };
  } catch {
    return {
      code: currencyCode,
      symbol: currencyCode,
      name: currencyCode,
      locale: DEFAULT_LOCALE,
      decimalPlaces:
        currencyCode === CurrencyCode.JPY ? 0 : DEFAULT_FALLBACK_DECIMALS,
      symbolBefore: true,
      spacing: ' ',
    };
  }
}


export function getCurrencyConfig(
  currencyCode: string | CurrencyCode | undefined | null
): CurrencyConfig {
  const normalized = normalizeCurrencyCode(currencyCode);

  if (isValidCurrencyCode(normalized)) {
    return CURRENCY_CONFIGS[normalized];
  }

  const cached = runtimeCurrencyConfigCache.get(normalized);
  if (cached) {
    return cached;
  }

  const config = buildRuntimeCurrencyConfig(normalized);
  runtimeCurrencyConfigCache.set(normalized, config);
  return config;
}


export function getCurrencyOptions() {
  return Object.values(CURRENCY_CONFIGS).map((config) => ({
    value: config.code,
    label: `${config.symbol} ${config.name} (${config.code})`,
  }));
}


function isValidCurrencyCode(
  currencyCode: string
): currencyCode is CurrencyCode {
  const normalized = normalizeCurrencyCode(currencyCode, '');

  return (
    normalized !== '' &&
    Object.values(CurrencyCode).includes(normalized as CurrencyCode)
  );
}
