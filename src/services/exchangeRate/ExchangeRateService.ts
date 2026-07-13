

import { requestUrl } from 'obsidian';
import type JournalitPlugin from '../../main';
import {
  FrankfurterResponse,
  CachedExchangeRates,
  ConvertedPnL,
  ConvertibleTrade,
  ConvertedTradesResult,
  isFrankfurterSupported,
} from './types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function getNumericRecord(value: unknown): Record<string, number> | null {
  if (!isRecord(value)) return null;
  return Object.fromEntries(
    Object.entries(value).filter(
      (entry): entry is [string, number] => typeof entry[1] === 'number'
    )
  );
}

import { getEffectivePnL } from '../../utils/tradeStatusUtils';

function asFrankfurterResponse(value: unknown): FrankfurterResponse | null {
  if (!isRecord(value)) return null;
  const record = value;
  if (
    typeof record.date !== 'string' ||
    !record.rates ||
    typeof record.rates !== 'object' ||
    Array.isArray(record.rates)
  )
    return null;
  const rates = getNumericRecord(record.rates);
  if (!rates) return null;
  return {
    amount: typeof record.amount === 'number' ? record.amount : 1,
    base: typeof record.base === 'string' ? record.base : '',
    date: record.date,
    rates,
  };
}

function asCachedExchangeRates(value: unknown): CachedExchangeRates | null {
  if (!isRecord(value)) return null;
  const record = value;
  if (
    typeof record.baseCurrency !== 'string' ||
    typeof record.rateDate !== 'string' ||
    typeof record.cachedAt !== 'number' ||
    !record.rates ||
    typeof record.rates !== 'object' ||
    Array.isArray(record.rates)
  )
    return null;
  const rates = getNumericRecord(record.rates);
  if (!rates) return null;
  return {
    baseCurrency: record.baseCurrency,
    rateDate: record.rateDate,
    cachedAt: record.cachedAt,
    rates,
  };
}

const FRANKFURTER_BASE_URL = 'https://api.frankfurter.app';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; 
const CACHE_KEY = 'journalit-exchange-rates';

export class ExchangeRateService {
  private plugin: JournalitPlugin;
  private memoryCache: CachedExchangeRates | null = null;

  constructor(plugin: JournalitPlugin) {
    this.plugin = plugin;
  }

  
  async getRates(baseCurrency: string): Promise<CachedExchangeRates | null> {
    
    if (
      this.memoryCache &&
      this.memoryCache.baseCurrency === baseCurrency &&
      this.isCacheFresh(this.memoryCache.cachedAt)
    ) {
      return this.memoryCache;
    }

    
    const storedCache = this.loadFromStorage();
    if (
      storedCache &&
      storedCache.baseCurrency === baseCurrency &&
      this.isCacheFresh(storedCache.cachedAt)
    ) {
      this.memoryCache = storedCache;
      return storedCache;
    }

    
    try {
      const rates = await this.fetchRates(baseCurrency);
      if (rates) {
        this.memoryCache = rates;
        this.saveToStorage(rates);
        return rates;
      }
    } catch (error) {
      console.warn('[ExchangeRateService] Failed to fetch rates:', error);
    }

    
    if (storedCache && storedCache.baseCurrency === baseCurrency) {
      console.warn('[ExchangeRateService] Using stale cache');
      this.memoryCache = storedCache;
      return storedCache;
    }

    return null;
  }

  
  private async fetchRates(
    baseCurrency: string
  ): Promise<CachedExchangeRates | null> {
    
    if (!isFrankfurterSupported(baseCurrency)) {
      console.warn(
        `[ExchangeRateService] Base currency ${baseCurrency} not supported by Frankfurter`
      );
      return null;
    }

    try {
      const response = await requestUrl({
        url: `${FRANKFURTER_BASE_URL}/latest?base=${baseCurrency}`,
        method: 'GET',
        throw: false,
      });

      if (response.status !== 200) {
        console.error(`[ExchangeRateService] API returned ${response.status}`);
        return null;
      }

      const data = asFrankfurterResponse(response.json);
      if (!data) {
        console.error('[ExchangeRateService] Invalid API response');
        return null;
      }

      
      const rates: Record<string, number> = { ...data.rates };
      rates[baseCurrency] = 1;

      return {
        baseCurrency,
        rates,
        rateDate: data.date,
        cachedAt: Date.now(),
      };
    } catch (error) {
      console.error('[ExchangeRateService] Network error:', error);
      return null;
    }
  }

  
  async convertPnLToBaseCurrency(
    pnlByCurrency: Record<string, number>,
    baseCurrency: string
  ): Promise<ConvertedPnL | null> {
    const currencies = Object.keys(pnlByCurrency);

    
    if (currencies.length === 1 && currencies[0] === baseCurrency) {
      return {
        total: pnlByCurrency[baseCurrency],
        baseCurrency,
        fullyConverted: true,
        unconvertedCurrencies: [],
        originalByCurrency: pnlByCurrency,
        convertedByCurrency: { [baseCurrency]: pnlByCurrency[baseCurrency] },
        rateDate: new Date().toISOString().split('T')[0],
      };
    }

    
    const ratesData = await this.getRates(baseCurrency);
    if (!ratesData) {
      return null;
    }

    const convertedByCurrency: Record<string, number> = {};
    const unconvertedCurrencies: string[] = [];
    let total = 0;

    for (const [currency, amount] of Object.entries(pnlByCurrency)) {
      if (currency === baseCurrency) {
        
        convertedByCurrency[currency] = amount;
        total += amount;
      } else if (ratesData.rates[currency] !== undefined) {
        
        const rate = ratesData.rates[currency];
        const converted = amount / rate;
        convertedByCurrency[currency] = converted;
        total += converted;
      } else {
        
        unconvertedCurrencies.push(currency);
      }
    }

    return {
      total,
      baseCurrency,
      fullyConverted: unconvertedCurrencies.length === 0,
      unconvertedCurrencies,
      originalByCurrency: pnlByCurrency,
      convertedByCurrency,
      rateDate: ratesData.rateDate,
    };
  }

  
  async convertTrades<T extends ConvertibleTrade>(
    trades: T[],
    baseCurrency: string,
    defaultCurrency: string = baseCurrency
  ): Promise<ConvertedTradesResult<T> | null> {
    const hasUsableBrokerBasePnl = (trade: T): boolean =>
      typeof trade.brokerBaseCurrencyPnl === 'number' &&
      Number.isFinite(trade.brokerBaseCurrencyPnl) &&
      trade.brokerBaseCurrency === baseCurrency;

    const hasForeignAuxiliaryMonetaryFields = (trade: T): boolean => {
      const tradeCurrency = trade.currency || defaultCurrency;
      return (
        (trade.riskAmount !== undefined && tradeCurrency !== baseCurrency) ||
        (trade.breakEvenAccountCurrentBalance !== undefined &&
          trade.breakEvenAccountCurrentBalanceCurrency !== baseCurrency) ||
        (trade.breakEvenAccountCurrentBalanceTotal !== undefined &&
          trade.breakEvenAccountCurrentBalanceTotalCurrency !== baseCurrency)
      );
    };

    const needsRates = trades.some((trade) => {
      const tradeCurrency = trade.currency || defaultCurrency;
      return (
        (tradeCurrency !== baseCurrency && !hasUsableBrokerBasePnl(trade)) ||
        hasForeignAuxiliaryMonetaryFields(trade)
      );
    });

    const ratesData = needsRates ? await this.getRates(baseCurrency) : null;
    const hasTradesRequiringFxRates = trades.some((trade) => {
      const tradeCurrency = trade.currency || defaultCurrency;
      return tradeCurrency !== baseCurrency && !hasUsableBrokerBasePnl(trade);
    });

    if (hasTradesRequiringFxRates && !ratesData) {
      return null;
    }

    const unconvertedCurrencies = new Set<string>();
    let brokerBaseCurrencyTradeCount = 0;

    const convertedTrades = trades.map((trade) => {
      const tradeCurrency = trade.currency || defaultCurrency;

      const lookupRate = (currency?: string): number | null => {
        if (!currency) {
          return null;
        }

        if (currency === baseCurrency) {
          return 1;
        }

        const rate = ratesData?.rates[currency];
        return rate === undefined ? null : rate;
      };

      const convertValue = (
        value: number | undefined,
        sourceCurrency?: string
      ): number | undefined => {
        if (value === undefined || !sourceCurrency) {
          return undefined;
        }

        const rate = lookupRate(sourceCurrency);
        if (rate === null) {
          return undefined;
        }

        
        return value / rate;
      };

      if (hasUsableBrokerBasePnl(trade)) {
        brokerBaseCurrencyTradeCount += 1;
        const brokerBaseRiskAmount = convertValue(
          trade.riskAmount,
          tradeCurrency
        );
        const brokerBaseBreakEvenAccountCurrentBalance = convertValue(
          trade.breakEvenAccountCurrentBalance,
          trade.breakEvenAccountCurrentBalanceCurrency
        );
        const brokerBaseBreakEvenAccountCurrentBalanceTotal = convertValue(
          trade.breakEvenAccountCurrentBalanceTotal,
          trade.breakEvenAccountCurrentBalanceTotalCurrency
        );
        return {
          ...trade,
          currency: baseCurrency,
          originalCurrency: tradeCurrency,
          originalPnlBeforeConversion: Number(getEffectivePnL(trade)) || 0,
          pnl: trade.brokerBaseCurrencyPnl,
          directPnL:
            trade.useDirectPnLInput === true
              ? trade.brokerBaseCurrencyPnl
              : trade.directPnL,
          riskAmount: brokerBaseRiskAmount,
          breakEvenAccountCurrentBalance:
            brokerBaseBreakEvenAccountCurrentBalance,
          breakEvenAccountCurrentBalanceCurrency:
            brokerBaseBreakEvenAccountCurrentBalance !== undefined
              ? baseCurrency
              : undefined,
          breakEvenAccountCurrentBalanceTotal:
            brokerBaseBreakEvenAccountCurrentBalanceTotal,
          breakEvenAccountCurrentBalanceTotalCurrency:
            brokerBaseBreakEvenAccountCurrentBalanceTotal !== undefined
              ? baseCurrency
              : undefined,
        };
      }

      const getTradeRateForCurrency = (currency: string): number | null => {
        const rate = lookupRate(currency);
        if (rate === null) {
          unconvertedCurrencies.add(currency);
        }
        return rate;
      };

      
      const tradeRate = getTradeRateForCurrency(tradeCurrency);
      if (tradeRate === null) {
        
        return null;
      }

      
      const convertedPnl =
        trade.pnl !== undefined && trade.pnl !== null
          ? trade.pnl / tradeRate
          : trade.pnl;
      const convertedCommission = (trade.commission ?? 0) / tradeRate;
      const convertedSwap = (trade.swap ?? 0) / tradeRate;
      const convertedFees = (trade.fees ?? 0) / tradeRate;
      const convertedRebate =
        trade.rebate !== undefined ? trade.rebate / tradeRate : undefined;
      const directPnLValue =
        typeof trade.directPnL === 'number' ? trade.directPnL : undefined;
      const convertedDirectPnL =
        directPnLValue !== undefined && Number.isFinite(directPnLValue)
          ? directPnLValue / tradeRate
          : trade.directPnL;
      const convertedRiskAmount =
        trade.riskAmount !== undefined
          ? trade.riskAmount / tradeRate
          : undefined;
      const convertedDividends = Array.isArray(trade.dividends)
        ? trade.dividends.map((dividend) => ({
            ...dividend,
            amount:
              typeof dividend?.amount === 'number' &&
              Number.isFinite(dividend.amount)
                ? dividend.amount / tradeRate
                : dividend?.amount,
          }))
        : trade.dividends;

      const convertedBreakEvenAccountCurrentBalance = convertValue(
        trade.breakEvenAccountCurrentBalance,
        trade.breakEvenAccountCurrentBalanceCurrency
      );
      const convertedBreakEvenAccountCurrentBalanceTotal = convertValue(
        trade.breakEvenAccountCurrentBalanceTotal,
        trade.breakEvenAccountCurrentBalanceTotalCurrency
      );

      return {
        ...trade,
        currency: baseCurrency,
        originalCurrency: tradeCurrency,
        originalPnlBeforeConversion: Number(getEffectivePnL(trade)) || 0,
        pnl: convertedPnl,
        directPnL: convertedDirectPnL,
        commission: convertedCommission,
        swap: convertedSwap,
        fees: convertedFees,
        rebate: convertedRebate,
        riskAmount: convertedRiskAmount,
        dividends: convertedDividends,
        breakEvenAccountCurrentBalance: convertedBreakEvenAccountCurrentBalance,
        breakEvenAccountCurrentBalanceCurrency:
          convertedBreakEvenAccountCurrentBalance !== undefined
            ? baseCurrency
            : trade.breakEvenAccountCurrentBalanceCurrency,
        breakEvenAccountCurrentBalanceTotal:
          convertedBreakEvenAccountCurrentBalanceTotal,
        breakEvenAccountCurrentBalanceTotalCurrency:
          convertedBreakEvenAccountCurrentBalanceTotal !== undefined
            ? baseCurrency
            : trade.breakEvenAccountCurrentBalanceTotalCurrency,
      };
    });

    
    const validTrades = convertedTrades.filter((trade) => trade !== null);

    return {
      trades: validTrades,
      baseCurrency,
      rateDate: ratesData?.rateDate ?? 'broker',
      unconvertedCurrencies: Array.from(unconvertedCurrencies),
      originalTradeCount: trades.length,
      convertedTradeCount: validTrades.length,
      brokerBaseCurrencyTradeCount,
    };
  }

  
  private isCacheFresh(cachedAt: number): boolean {
    return Date.now() - cachedAt < CACHE_TTL_MS;
  }

  
  private loadFromStorage(): CachedExchangeRates | null {
    try {
      const stored: unknown = this.plugin.app.loadLocalStorage(CACHE_KEY);
      if (stored) {
        const parsed: unknown =
          typeof stored === 'string' ? (JSON.parse(stored) as unknown) : stored;
        return asCachedExchangeRates(parsed);
      }
    } catch (error) {
      console.warn('[ExchangeRateService] Failed to load cache:', error);
    }
    return null;
  }

  
  private saveToStorage(rates: CachedExchangeRates): void {
    try {
      this.plugin.app.saveLocalStorage(CACHE_KEY, rates);
    } catch (error) {
      console.warn('[ExchangeRateService] Failed to save cache:', error);
    }
  }

  
  clearCache(): void {
    this.memoryCache = null;
    try {
      this.plugin.app.saveLocalStorage(CACHE_KEY, null);
    } catch {
      // intentional
    }
  }
}
