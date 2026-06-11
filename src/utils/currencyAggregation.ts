

import { getCurrencyConfig } from './currencyConfig';
import { getEffectivePnL } from './tradeStatusUtils';


export interface CurrencyGroupedPnL {
  
  byCurrency: Record<string, number>;
  
  isMultiCurrency: boolean;
  
  currencies: string[];
  
  singleTotal?: number;
  
  defaultCurrency: string;
}


type TradeWithCurrency = {
  pnl?: number | null;
  directPnL?: number | null;
  useDirectPnLInput?: boolean;
  dividends?: Array<{ amount?: number | null }>;
  commission?: number | null;
  swap?: number | null;
  fees?: number | null;
  rebate?: number | null;
  currency?: string;
};


const DEFAULT_CURRENCY = 'USD';


export function aggregatePnLByCurrency(
  trades: TradeWithCurrency[],
  defaultCurrency: string = DEFAULT_CURRENCY
): CurrencyGroupedPnL {
  const byCurrency: Record<string, number> = {};

  for (const trade of trades) {
    const pnl = getEffectivePnL(trade);
    const currency = trade.currency || defaultCurrency;

    if (!byCurrency[currency]) {
      byCurrency[currency] = 0;
    }
    byCurrency[currency] += pnl;
  }

  const currencies = Object.keys(byCurrency).sort();
  const isMultiCurrency = currencies.length > 1;

  return {
    byCurrency,
    isMultiCurrency,
    currencies,
    singleTotal: isMultiCurrency ? undefined : (byCurrency[currencies[0]] ?? 0),
    defaultCurrency: currencies[0] || defaultCurrency,
  };
}


export function getCurrencyDecimalPlaces(currency: string): number {
  return getCurrencyConfig(currency).decimalPlaces;
}


export function formatPnLWithCurrency(
  amount: number,
  currency: string,
  showPlusSign: boolean = false
): string {
  const currencyConfig = getCurrencyConfig(currency);
  const decimalPlaces = currencyConfig.decimalPlaces;
  const absAmount = Math.abs(amount);
  const formattedAmount = absAmount.toLocaleString(currencyConfig.locale, {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });
  const spacing = currencyConfig.spacing ?? '';
  const withCurrency = currencyConfig.symbolBefore
    ? `${currencyConfig.symbol}${spacing}${formattedAmount}`
    : `${formattedAmount}${spacing}${currencyConfig.symbol}`;

  if (amount < 0) {
    return `-${withCurrency}`;
  }

  const prefix = showPlusSign && amount > 0 ? '+' : '';
  return `${prefix}${withCurrency}`;
}


export function formatGroupedPnL(
  grouped: CurrencyGroupedPnL,
  showPlusSign: boolean = false
): string | string[] {
  if (!grouped.isMultiCurrency && grouped.singleTotal !== undefined) {
    return formatPnLWithCurrency(
      grouped.singleTotal,
      grouped.defaultCurrency,
      showPlusSign
    );
  }

  return grouped.currencies.map((currency) =>
    formatPnLWithCurrency(grouped.byCurrency[currency], currency, showPlusSign)
  );
}


export function hasMultipleCurrencies(trades: TradeWithCurrency[]): boolean {
  const currencies = new Set<string>();

  for (const trade of trades) {
    currencies.add(trade.currency || DEFAULT_CURRENCY);
    if (currencies.size > 1) return true;
  }

  return false;
}


export function getSingleCurrency(
  trades: TradeWithCurrency[]
): string | undefined {
  const currencies = new Set<string>();

  for (const trade of trades) {
    currencies.add(trade.currency || DEFAULT_CURRENCY);
    if (currencies.size > 1) return undefined;
  }

  return currencies.size === 1 ? Array.from(currencies)[0] : undefined;
}


export function getSingleExplicitCurrency(
  trades: TradeWithCurrency[]
): string | undefined {
  const currencies = new Set<string>();
  let hasMissingCurrency = false;

  for (const trade of trades) {
    if (!trade.currency) {
      hasMissingCurrency = true;
      continue;
    }

    currencies.add(trade.currency);
    if (currencies.size > 1) return undefined;
  }

  if (hasMissingCurrency) {
    return undefined;
  }

  return currencies.size === 1 ? Array.from(currencies)[0] : undefined;
}
