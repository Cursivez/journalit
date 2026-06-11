

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
import { getEffectivePnL } from '../../utils/tradeStatusUtils';

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

      const data: FrankfurterResponse = response.json;

      
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
        } as T;
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
      } as T;
    });

    
    const validTrades = convertedTrades.filter((t): t is T => t !== null);

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
      const stored = localStorage.getItem(CACHE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.warn('[ExchangeRateService] Failed to load cache:', error);
    }
    return null;
  }

  
  private saveToStorage(rates: CachedExchangeRates): void {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(rates));
    } catch (error) {
      console.warn('[ExchangeRateService] Failed to save cache:', error);
    }
  }

  
  clearCache(): void {
    this.memoryCache = null;
    try {
      localStorage.removeItem(CACHE_KEY);
    } catch (_error) {
      // intentional
    }
  }
}
