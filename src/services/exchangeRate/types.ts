


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
  return FRANKFURTER_SUPPORTED_CURRENCIES.some(
    (supportedCurrency) => supportedCurrency === currency
  );
}


export interface ConvertibleTrade {
  pnl?: number | null;
  directPnL?: number | null;
  useDirectPnLInput?: boolean;
  currency?: string;
  commission?: number;
  commissionType?: 'fixed' | 'percentage';
  swap?: number;
  fees?: number;
  rebate?: number;
  dividends?: Array<{ amount?: number | null }>;
  
  riskAmount?: number;
  
  mae?: number;
  
  mfe?: number;
  
  originalMaeBeforeConversion?: number;
  
  originalMfeBeforeConversion?: number;
  
  maeAmountDerivedFromPrice?: boolean;
  
  mfeAmountDerivedFromPrice?: boolean;
  
  maeTicksBeforeConversion?: number;
  
  mfeTicksBeforeConversion?: number;
  
  maePrice?: number;
  
  mfePrice?: number;
  
  breakEvenAccountCurrentBalance?: number;
  
  breakEvenAccountCurrentBalanceCurrency?: string;
  
  breakEvenAccountCurrentBalanceTotal?: number;
  
  breakEvenAccountCurrentBalanceTotalCurrency?: string;
  
  brokerBaseCurrencyPnl?: number | null;
  
  brokerBaseCurrency?: string;
  
  brokerBaseCurrencyPnlSource?: string;
  
  unrealizedPriceSnapshot?: number | null;
  
  fxRate?: number;
  
  fxRateBaseCurrency?: string;
}


export interface ConvertedTradesResult<T extends ConvertibleTrade> {
  
  trades: T[];
  
  excludedTrades: T[];
  
  baseCurrency: string;
  
  rateDate: string;
  
  unconvertedCurrencies: string[];
  
  partiallyConvertedCurrencies?: string[];
  
  originalTradeCount: number;
  
  convertedTradeCount: number;
  
  brokerBaseCurrencyTradeCount?: number;
  
  manualFxRateTradeCount?: number;
}

export {};
