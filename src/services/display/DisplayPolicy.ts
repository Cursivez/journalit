import { DEFAULT_PRIVACY_MASK } from '../../constants';
import { CurrencyCode, getCurrencyConfig } from '../../utils/currencyConfig';
import { formatCost, formatCurrency, formatPnL } from '../../utils/formatting';

export type DisplayValueKind =
  | 'pnl'
  | 'money'
  | 'balance'
  | 'percentage'
  | 'returnPercent'
  | 'rMultiple'
  | 'risk'
  | 'drawdown'
  | 'price'
  | 'positionSize'
  | 'notional'
  | 'fee'
  | 'metric'
  | 'count';

export interface DisplayPolicy {
  privacyMode: boolean;
  privacyMask: string;
  currencyCode: string;
  displayRMultiples: boolean;
  defaultRiskAmount?: number;
  locale?: string;
  
  hideDollarAmounts?: boolean;
}

interface DisplayPolicySettingsInput {
  display?: {
    privacyMode?: boolean;
    privacyMask?: string;
  };
  general?: {
    currency?: string;
  };
  trade?: {
    displayRMultiples?: boolean;
    defaultRiskAmount?: number;
  };
}

export interface DisplayValueOptions {
  kind: DisplayValueKind;
  value: number | null | undefined;
  currencyCode?: string;
  showCents?: boolean;
  
  rMultiple?: number | null;
  fallback?: string;
  signed?: boolean;
  precision?: number;
  notation?: 'standard' | 'compact';
  
  priceStyle?: 'decimal' | 'currency';
}

const PRIVACY_MASKED_KINDS: ReadonlySet<DisplayValueKind> = new Set([
  'pnl',
  'money',
  'balance',
  'percentage',
  'returnPercent',
  'rMultiple',
  'risk',
  'drawdown',
  'price',
  'positionSize',
  'notional',
  'fee',
  'metric',
]);


const DECIMAL_QUOTE_MAX_SIGNIFICANT_DIGITS = 15;

export function createDisplayPolicy(
  settings: DisplayPolicySettingsInput
): DisplayPolicy {
  return {
    privacyMode: settings.display?.privacyMode ?? false,
    privacyMask: normalizePrivacyMask(settings.display?.privacyMask),
    currencyCode: settings.general?.currency ?? CurrencyCode.USD,
    displayRMultiples: settings.trade?.displayRMultiples ?? false,
    defaultRiskAmount: settings.trade?.defaultRiskAmount,
  };
}

export function shouldMaskValue(
  kind: DisplayValueKind,
  policy: DisplayPolicy
): boolean {
  return policy.privacyMode && PRIVACY_MASKED_KINDS.has(kind);
}


function hasRForm(
  options: DisplayValueOptions,
  policy: DisplayPolicy
): boolean {
  return (
    (options.kind === 'pnl' ||
      options.kind === 'risk' ||
      options.kind === 'drawdown') &&
    policy.displayRMultiples &&
    'rMultiple' in options
  );
}


export function isRMultipleUnavailable(
  options: DisplayValueOptions,
  policy: DisplayPolicy
): boolean {
  return (
    hasRForm(options, policy) &&
    isDisplayableNumber(options.value) &&
    !shouldMaskValue(options.kind, policy) &&
    !isDisplayableNumber(options.rMultiple)
  );
}

export function formatDisplayValue(
  options: DisplayValueOptions,
  policy: DisplayPolicy
): string {
  const fallback = options.fallback ?? '-';

  if (options.value === null || options.value === undefined) {
    return fallback;
  }

  if (shouldMaskValue(options.kind, policy)) {
    return policy.privacyMask;
  }

  if (policy.hideDollarAmounts && isDollarAmount(options, policy)) {
    return '';
  }

  if (options.kind === 'metric' && !Number.isFinite(options.value)) {
    if (options.value === Infinity) {
      return '∞';
    }
    if (options.value === -Infinity) {
      return '-∞';
    }
  }

  if (!isDisplayableNumber(options.value)) {
    return fallback;
  }

  const currencyCode = options.currencyCode ?? policy.currencyCode;

  switch (options.kind) {
    case 'pnl':
    case 'risk':
    case 'drawdown':
      if (hasRForm(options, policy)) {
        
        
        return isDisplayableNumber(options.rMultiple)
          ? formatPnL(
              options.value,
              options.showCents ?? true,
              currencyCode,
              true,
              options.rMultiple
            )
          : fallback;
      }
      return formatPnL(
        options.value,
        options.showCents ?? true,
        currencyCode,
        false,
        undefined
      );
    case 'money':
    case 'balance':
    case 'notional':
      if (options.precision !== undefined) {
        return formatCurrencyWithFixedPrecision(
          options.value,
          options.precision,
          options.signed ?? false,
          currencyCode
        );
      }

      return options.notation === 'compact'
        ? formatPnL(
            options.value,
            options.showCents ?? true,
            currencyCode,
            false,
            undefined
          )
        : formatCurrency(options.value, options.signed ?? false, currencyCode);
    case 'price':
      if (options.priceStyle === 'decimal') {
        return formatDecimalQuotePrice(
          options.value,
          policy.locale ?? getCurrencyConfig(currencyCode).locale,
          options.signed ?? false
        );
      }

      return options.precision === undefined
        ? formatCurrency(options.value, options.signed ?? false, currencyCode)
        : formatCurrencyWithFixedPrecision(
            options.value,
            options.precision,
            options.signed ?? false,
            currencyCode
          );
    case 'fee':
      return formatFeeValue(
        options.value,
        currencyCode,
        options.signed ?? false
      );
    case 'percentage':
    case 'returnPercent':
      return formatPercentageValue(
        options.value,
        options.precision ?? (options.kind === 'returnPercent' ? 2 : 1),
        options.signed ?? options.kind === 'returnPercent'
      );
    case 'rMultiple':
      return formatRMultipleValue(
        options.value,
        options.precision ?? 1,
        options.signed ?? true
      );
    case 'positionSize':
    case 'metric':
    case 'count':
      return formatNumberValue(options.value, policy.locale, options.precision);
  }
}

function formatFeeValue(
  value: number,
  currencyCode: string,
  signed: boolean
): string {
  const formatted = formatCost(Math.abs(value), currencyCode);

  if (value < 0) {
    return `-${formatted}`;
  }

  return signed && value > 0 ? `+${formatted}` : formatted;
}

function formatCurrencyWithFixedPrecision(
  value: number,
  precision: number,
  signed: boolean,
  currencyCode: string
): string {
  const currencyConfig = getCurrencyConfig(currencyCode);
  const isNegative = value < 0;
  const absValue = Math.abs(value);
  const formatted = absValue.toLocaleString(currencyConfig.locale, {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  });
  const spacing = currencyConfig.spacing ?? '';
  const withCurrency = currencyConfig.symbolBefore
    ? `${currencyConfig.symbol}${spacing}${formatted}`
    : `${formatted}${spacing}${currencyConfig.symbol}`;

  if (isNegative) {
    return `-${withCurrency}`;
  }

  return signed && value > 0 ? `+${withCurrency}` : withCurrency;
}


function isDollarAmount(
  options: DisplayValueOptions,
  policy: DisplayPolicy
): boolean {
  switch (options.kind) {
    case 'money':
    case 'balance':
    case 'notional':
    case 'fee':
      return true;
    case 'pnl':
    case 'risk':
    case 'drawdown':
      return !hasRForm(options, policy);
    default:
      return false;
  }
}

function normalizePrivacyMask(mask: string | undefined): string {
  const trimmed = mask?.trim();
  return trimmed ? trimmed : DEFAULT_PRIVACY_MASK;
}

function isDisplayableNumber(
  value: number | null | undefined
): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function formatPercentageValue(
  value: number,
  precision: number,
  signed: boolean
): string {
  const sign = signed && value > 0 ? '+' : '';
  return `${sign}${value.toFixed(precision)}%`;
}

function formatRMultipleValue(
  value: number,
  precision: number,
  signed: boolean
): string {
  const sign = signed && value > 0 ? '+' : '';
  return `${sign}${value.toFixed(precision)}R`;
}

function formatNumberValue(
  value: number,
  locale: string | undefined,
  precision: number | undefined
): string {
  if (precision === undefined) {
    return value.toLocaleString(locale);
  }

  return value.toLocaleString(locale, {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  });
}


function formatDecimalQuotePrice(
  value: number,
  locale: string | undefined,
  signed: boolean
): string {
  const formatted = value.toLocaleString(locale, {
    maximumSignificantDigits: DECIMAL_QUOTE_MAX_SIGNIFICANT_DIGITS,
  });

  return signed && value > 0 ? `+${formatted}` : formatted;
}
