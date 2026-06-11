


export interface FrankfurterResponse {
  amount: number;
  base: string;
  date: string;
  rates: Record<string, number>;
}


export interface CachedExchangeRates {
  
  baseCurrency: string;
  
  rates: Record<string, number>;
  
  rateDate: string;
  
  cachedAt: number;
}


export interface ConvertedPnL {
  
  total: number;
  
  baseCurrency: string;
  
  fullyConverted: boolean;
  
  unconvertedCurrencies: string[];
  
  originalByCurrency: Record<string, number>;
  
  convertedByCurrency: Record<string, number>;
  
  rateDate: string;
}


const FRANKFURTER_SUPPORTED_CURRENCIES = [
  'AUD',
  'BGN',
  'BRL',
  'CAD',
  'CHF',
  'CNY',
  'CZK',
  'DKK',
  'EUR',
  'GBP',
  'HKD',
  'HUF',
  'IDR',
  'ILS',
  'INR',
  'ISK',
  'JPY',
  'KRW',
  'MXN',
  'MYR',
  'NOK',
  'NZD',
  'PHP',
  'PLN',
  'RON',
  'SEK',
  'SGD',
  'THB',
  'TRY',
  'USD',
  'ZAR',
] as const;

type FrankfurterCurrency = (typeof FRANKFURTER_SUPPORTED_CURRENCIES)[number];


export function isFrankfurterSupported(
  currency: string
): currency is FrankfurterCurrency {
  return FRANKFURTER_SUPPORTED_CURRENCIES.includes(
    currency as FrankfurterCurrency
  );
}


export interface ConvertibleTrade {
  pnl?: number | null;
  directPnL?: number | null;
  useDirectPnLInput?: boolean;
  currency?: string;
  commission?: number;
  swap?: number;
  fees?: number;
  rebate?: number;
  dividends?: Array<{ amount?: number | null }>;
  
  riskAmount?: number;
  
  breakEvenAccountCurrentBalance?: number;
  
  breakEvenAccountCurrentBalanceCurrency?: string;
  
  breakEvenAccountCurrentBalanceTotal?: number;
  
  breakEvenAccountCurrentBalanceTotalCurrency?: string;
  
  brokerBaseCurrencyPnl?: number | null;
  
  brokerBaseCurrency?: string;
  
  brokerBaseCurrencyPnlSource?: string;
}


export interface ConvertedTradesResult<T extends ConvertibleTrade> {
  
  trades: T[];
  
  baseCurrency: string;
  
  rateDate: string;
  
  unconvertedCurrencies: string[];
  
  originalTradeCount: number;
  
  convertedTradeCount: number;
  
  brokerBaseCurrencyTradeCount?: number;
}

export {};
