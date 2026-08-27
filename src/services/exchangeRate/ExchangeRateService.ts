

import { requestUrl } from 'obsidian';
import type JournalitPlugin from '../../main';
import { hasUnrealizedPriceSnapshot } from '../../utils/unrealizedPnl';
import type { BreakEvenAccountBalanceSnapshot } from '../trade/core/BreakEvenAccountBalance';
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

const FRANKFURTER_BASE_URL = 'https://api.frankfurter.dev/v1';
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
    defaultCurrency: string = baseCurrency,
    options: { includeUnrealizedPnl?: boolean } = {}
  ): Promise<ConvertedTradesResult<T> | null> {
    const includeUnrealizedPnl = options.includeUnrealizedPnl === true;
    const hasUsableBrokerBasePnl = (trade: T): boolean =>
      typeof trade.brokerBaseCurrencyPnl === 'number' &&
      Number.isFinite(trade.brokerBaseCurrencyPnl) &&
      trade.brokerBaseCurrency === baseCurrency;

    
    
    const getManualFxRate = (trade: T): number | null =>
      typeof trade.fxRate === 'number' &&
      Number.isFinite(trade.fxRate) &&
      trade.fxRate > 0 &&
      trade.fxRateBaseCurrency === baseCurrency
        ? trade.fxRate
        : null;

    const hasForeignAuxiliaryMonetaryFields = (trade: T): boolean => {
      const tradeCurrency = trade.currency || defaultCurrency;
      const manualFxRate = getManualFxRate(trade);
      const balanceNeedsFetchedRate = (
        value: number | undefined,
        currency: string | undefined
      ): boolean =>
        value !== undefined && value !== 0 && currency !== baseCurrency;
      return (
        (trade.riskAmount !== undefined &&
          tradeCurrency !== baseCurrency &&
          manualFxRate === null) ||
        (trade.breakEvenAccountCurrentBalanceSnapshots?.some((snapshot) =>
          balanceNeedsFetchedRate(snapshot.balance, snapshot.currency)
        ) ??
          false) ||
        balanceNeedsFetchedRate(
          trade.breakEvenAccountCurrentBalance,
          trade.breakEvenAccountCurrentBalanceCurrency
        ) ||
        balanceNeedsFetchedRate(
          trade.breakEvenAccountCurrentBalanceTotal,
          trade.breakEvenAccountCurrentBalanceTotalCurrency
        )
      );
    };

    
    
    
    
    
    const hasMeaningfulAmount = (value: number | undefined): boolean =>
      typeof value === 'number' && Number.isFinite(value) && value !== 0;
    const hasForeignBrokerAuxiliaryFields = (trade: T): boolean => {
      const tradeCurrency = trade.currency || defaultCurrency;
      if (
        tradeCurrency === baseCurrency ||
        !hasUsableBrokerBasePnl(trade) ||
        getManualFxRate(trade) !== null
      ) {
        return false;
      }
      return (
        (trade.commissionType !== 'percentage' &&
          hasMeaningfulAmount(trade.commission)) ||
        hasMeaningfulAmount(trade.swap) ||
        hasMeaningfulAmount(trade.fees) ||
        hasMeaningfulAmount(trade.rebate) ||
        hasMeaningfulAmount(trade.mae) ||
        hasMeaningfulAmount(trade.mfe) ||
        hasMeaningfulAmount(trade.riskAmount) ||
        (Array.isArray(trade.dividends) &&
          trade.dividends.some((dividend) =>
            hasMeaningfulAmount(
              typeof dividend?.amount === 'number' ? dividend.amount : undefined
            )
          ))
      );
    };

    const requiresFetchedRates = (trade: T): boolean => {
      const tradeCurrency = trade.currency || defaultCurrency;
      return (
        tradeCurrency !== baseCurrency &&
        getManualFxRate(trade) === null &&
        (!hasUsableBrokerBasePnl(trade) ||
          
          
          (includeUnrealizedPnl && hasUnrealizedPriceSnapshot(trade)))
      );
    };

    const needsRates = trades.some(
      (trade) =>
        requiresFetchedRates(trade) ||
        hasForeignAuxiliaryMonetaryFields(trade) ||
        hasForeignBrokerAuxiliaryFields(trade)
    );

    const ratesData = needsRates ? await this.getRates(baseCurrency) : null;
    const hasTradesRequiringFxRates = trades.some(requiresFetchedRates);

    if (hasTradesRequiringFxRates && !ratesData) {
      
      
      
      
      
      const hasOfflineConvertibleSource = trades.some(
        (trade) =>
          hasUsableBrokerBasePnl(trade) ||
          ((trade.currency || defaultCurrency) !== baseCurrency &&
            getManualFxRate(trade) !== null)
      );
      if (!hasOfflineConvertibleSource) {
        return null;
      }
    }

    const unconvertedCurrencies = new Set<string>();
    const partiallyConvertedCurrencies = new Set<string>();
    const excludedTrades: T[] = [];
    let brokerBaseCurrencyTradeCount = 0;
    let manualFxRateTradeCount = 0;

    const convertedTrades = trades.map((trade) => {
      const tradeCurrency = trade.currency || defaultCurrency;

      
      
      const manualFxRate =
        tradeCurrency !== baseCurrency ? getManualFxRate(trade) : null;

      
      
      let usedManualRate = false;
      let usedFetchedDailyRates = false;
      
      
      let conversionPnlFactor: number | null = null;
      const tradePartialCurrencies = new Set<string>();

      const finalizeConvertedTrade = <TConverted extends object>(
        converted: TConverted
      ) => {
        if (usedManualRate) {
          manualFxRateTradeCount += 1;
        }
        return {
          ...converted,
          conversionUsedManualRate: usedManualRate ? true : undefined,
          conversionUsedFetchedRates: usedFetchedDailyRates ? true : undefined,
          conversionPnlFactor: conversionPnlFactor ?? undefined,
          conversionPartialCurrencies:
            tradePartialCurrencies.size > 0
              ? Array.from(tradePartialCurrencies)
              : undefined,
        };
      };

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

        
        
        if (value === 0) {
          return 0;
        }

        
        
        
        if (manualFxRate !== null && sourceCurrency === tradeCurrency) {
          usedManualRate = true;
          return value * manualFxRate;
        }

        const rate = lookupRate(sourceCurrency);
        if (rate === null) {
          
          
          partiallyConvertedCurrencies.add(sourceCurrency);
          tradePartialCurrencies.add(sourceCurrency);
          return undefined;
        }

        if (sourceCurrency !== baseCurrency) {
          usedFetchedDailyRates = true;
        }
        
        return value / rate;
      };

      const convertAccountBalanceValue = (
        value: number | undefined,
        sourceCurrency?: string
      ): number | undefined => {
        if (value === undefined || !sourceCurrency) {
          return undefined;
        }

        if (value === 0) {
          return 0;
        }

        
        
        
        const rate = lookupRate(sourceCurrency);
        if (rate === null) {
          partiallyConvertedCurrencies.add(sourceCurrency);
          tradePartialCurrencies.add(sourceCurrency);
          return undefined;
        }

        if (sourceCurrency !== baseCurrency) {
          usedFetchedDailyRates = true;
        }
        return value / rate;
      };

      const convertBreakEvenAccountBalanceFields = () => {
        const sourceSnapshots = trade.breakEvenAccountCurrentBalanceSnapshots;
        const hasSourceSnapshots =
          sourceSnapshots !== undefined && sourceSnapshots.length > 0;
        let convertedSnapshots: BreakEvenAccountBalanceSnapshot[] | undefined;

        if (hasSourceSnapshots) {
          const nextSnapshots: BreakEvenAccountBalanceSnapshot[] = [];
          for (const snapshot of sourceSnapshots) {
            const balance = convertAccountBalanceValue(
              snapshot.balance,
              snapshot.currency
            );
            if (balance === undefined) {
              continue;
            }
            nextSnapshots.push({
              accountKey: snapshot.accountKey,
              balance,
              currency: baseCurrency,
            });
          }

          if (nextSnapshots.length === sourceSnapshots.length) {
            convertedSnapshots = nextSnapshots;
          }
        }

        const singleBalance = hasSourceSnapshots
          ? convertedSnapshots?.length === 1
            ? convertedSnapshots[0].balance
            : undefined
          : convertAccountBalanceValue(
              trade.breakEvenAccountCurrentBalance,
              trade.breakEvenAccountCurrentBalanceCurrency
            );
        const totalBalance = hasSourceSnapshots
          ? convertedSnapshots?.reduce(
              (sum, snapshot) => sum + snapshot.balance,
              0
            )
          : convertAccountBalanceValue(
              trade.breakEvenAccountCurrentBalanceTotal,
              trade.breakEvenAccountCurrentBalanceTotalCurrency
            );

        return {
          breakEvenAccountCurrentBalanceSnapshots: convertedSnapshots,
          breakEvenAccountCurrentBalance: singleBalance,
          breakEvenAccountCurrentBalanceCurrency:
            singleBalance !== undefined ? baseCurrency : undefined,
          breakEvenAccountCurrentBalanceTotal: totalBalance,
          breakEvenAccountCurrentBalanceTotalCurrency:
            totalBalance !== undefined ? baseCurrency : undefined,
        };
      };

      
      
      
      const derivedAmountRate = lookupRate(tradeCurrency);
      const unrealizedPnlConversionRate = includeUnrealizedPnl
        ? (manualFxRate ??
          (derivedAmountRate !== null && derivedAmountRate !== 0
            ? 1 / derivedAmountRate
            : undefined))
        : undefined;
      if (
        includeUnrealizedPnl &&
        tradeCurrency !== baseCurrency &&
        hasUnrealizedPriceSnapshot(trade)
      ) {
        if (manualFxRate !== null) {
          usedManualRate = true;
        } else if (unrealizedPnlConversionRate !== undefined) {
          usedFetchedDailyRates = true;
        } else {
          
          
          
          partiallyConvertedCurrencies.add(tradeCurrency);
          tradePartialCurrencies.add(tradeCurrency);
        }
      }

      if (hasUsableBrokerBasePnl(trade)) {
        if (tradeCurrency !== baseCurrency) {
          brokerBaseCurrencyTradeCount += 1;
        }
        
        
        
        
        const convertTradeCurrencyAmount = (
          value: number | undefined
        ): number | undefined => convertValue(value, tradeCurrency);
        const fetchedTradeRate = lookupRate(tradeCurrency);
        const dividendMultiplier =
          manualFxRate !== null
            ? manualFxRate
            : fetchedTradeRate !== null
              ? 1 / fetchedTradeRate
              : null;
        
        
        
        
        const originalEffectivePnl = Number(getEffectivePnL(trade)) || 0;
        const impliedBrokerFactor =
          typeof trade.brokerBaseCurrencyPnl === 'number' &&
          Number.isFinite(trade.brokerBaseCurrencyPnl) &&
          originalEffectivePnl !== 0 &&
          trade.brokerBaseCurrencyPnl / originalEffectivePnl > 0
            ? trade.brokerBaseCurrencyPnl / originalEffectivePnl
            : null;
        if (tradeCurrency !== baseCurrency) {
          conversionPnlFactor = impliedBrokerFactor ?? dividendMultiplier;
        }
        const convertedBreakEvenAccountBalanceFields =
          convertBreakEvenAccountBalanceFields();
        const brokerBaseTrade = {
          ...trade,
          currency: baseCurrency,
          originalCurrency: tradeCurrency,
          originalMaeBeforeConversion: trade.mae,
          originalMfeBeforeConversion: trade.mfe,
          originalPnlBeforeConversion: Number(getEffectivePnL(trade)) || 0,
          unrealizedPnlConversionRate,
          pnl: trade.brokerBaseCurrencyPnl,
          directPnL:
            trade.useDirectPnLInput === true
              ? trade.brokerBaseCurrencyPnl
              : trade.directPnL,
          ...convertedBreakEvenAccountBalanceFields,
        };

        if (
          dividendMultiplier === null &&
          hasForeignBrokerAuxiliaryFields(trade)
        ) {
          
          
          
          
          
          
          
          
          partiallyConvertedCurrencies.add(tradeCurrency);
          tradePartialCurrencies.add(tradeCurrency);
          return finalizeConvertedTrade({
            ...brokerBaseTrade,
            commission:
              trade.commissionType === 'percentage'
                ? trade.commission
                : trade.commission === undefined
                  ? undefined
                  : 0,
            swap: trade.swap === undefined ? undefined : 0,
            fees: trade.fees === undefined ? undefined : 0,
            rebate: undefined,
            riskAmount: undefined,
            mae: undefined,
            mfe: undefined,
            originalMaeBeforeConversion: undefined,
            originalMfeBeforeConversion: undefined,
            maeAmountDerivedFromPrice: undefined,
            mfeAmountDerivedFromPrice: undefined,
            
            
            maePrice: undefined,
            mfePrice: undefined,
            dividends: undefined,
          });
        }

        const hasDividendAmounts =
          Array.isArray(trade.dividends) &&
          trade.dividends.some((dividend) =>
            hasMeaningfulAmount(
              typeof dividend?.amount === 'number' ? dividend.amount : undefined
            )
          );
        if (dividendMultiplier !== null && hasDividendAmounts) {
          if (manualFxRate !== null) {
            usedManualRate = true;
          } else {
            usedFetchedDailyRates = true;
          }
        }

        return finalizeConvertedTrade({
          ...brokerBaseTrade,
          commission:
            trade.commissionType === 'percentage'
              ? trade.commission
              : convertTradeCurrencyAmount(trade.commission),
          swap: convertTradeCurrencyAmount(trade.swap),
          fees: convertTradeCurrencyAmount(trade.fees),
          rebate: convertTradeCurrencyAmount(trade.rebate),
          mae: convertTradeCurrencyAmount(trade.mae),
          mfe: convertTradeCurrencyAmount(trade.mfe),
          riskAmount: convertTradeCurrencyAmount(trade.riskAmount),
          dividends:
            dividendMultiplier !== null && Array.isArray(trade.dividends)
              ? trade.dividends.map((dividend) => ({
                  ...dividend,
                  amount:
                    typeof dividend?.amount === 'number' &&
                    Number.isFinite(dividend.amount)
                      ? dividend.amount * dividendMultiplier
                      : dividend?.amount,
                }))
              : trade.dividends,
        });
      }

      
      
      
      const hasConvertibleTradeCurrencyValue =
        hasMeaningfulAmount(
          typeof trade.pnl === 'number' ? trade.pnl : undefined
        ) ||
        hasMeaningfulAmount(
          typeof trade.directPnL === 'number' ? trade.directPnL : undefined
        ) ||
        (trade.commissionType !== 'percentage' &&
          hasMeaningfulAmount(trade.commission)) ||
        hasMeaningfulAmount(trade.swap) ||
        hasMeaningfulAmount(trade.fees) ||
        hasMeaningfulAmount(trade.rebate) ||
        hasMeaningfulAmount(trade.riskAmount) ||
        hasMeaningfulAmount(trade.mae) ||
        hasMeaningfulAmount(trade.mfe) ||
        (Array.isArray(trade.dividends) &&
          trade.dividends.some((dividend) =>
            hasMeaningfulAmount(
              typeof dividend?.amount === 'number' ? dividend.amount : undefined
            )
          ));
      
      
      
      const tradeRate =
        manualFxRate !== null ? 1 / manualFxRate : lookupRate(tradeCurrency);
      if (tradeRate === null) {
        if (!hasConvertibleTradeCurrencyValue) {
          
          
          
          const convertedBreakEvenAccountBalanceFields =
            convertBreakEvenAccountBalanceFields();
          return finalizeConvertedTrade({
            ...trade,
            currency: baseCurrency,
            originalCurrency: tradeCurrency,
            originalPnlBeforeConversion: Number(getEffectivePnL(trade)) || 0,
            commission: trade.commission ?? 0,
            swap: trade.swap ?? 0,
            fees: trade.fees ?? 0,
            ...convertedBreakEvenAccountBalanceFields,
          });
        }
        
        
        unconvertedCurrencies.add(tradeCurrency);
        excludedTrades.push(trade);
        return null;
      }
      if (hasConvertibleTradeCurrencyValue && tradeCurrency !== baseCurrency) {
        if (manualFxRate !== null) {
          usedManualRate = true;
        } else {
          usedFetchedDailyRates = true;
        }
      }
      if (tradeCurrency !== baseCurrency) {
        conversionPnlFactor = 1 / tradeRate;
      }

      
      const convertedPnl =
        trade.pnl !== undefined && trade.pnl !== null
          ? trade.pnl / tradeRate
          : trade.pnl;
      const convertedCommission =
        trade.commissionType === 'percentage'
          ? (trade.commission ?? 0)
          : (trade.commission ?? 0) / tradeRate;
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
      const convertedMae =
        trade.mae !== undefined ? trade.mae / tradeRate : undefined;
      const convertedMfe =
        trade.mfe !== undefined ? trade.mfe / tradeRate : undefined;
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

      const convertedBreakEvenAccountBalanceFields =
        convertBreakEvenAccountBalanceFields();

      return finalizeConvertedTrade({
        ...trade,
        currency: baseCurrency,
        originalCurrency: tradeCurrency,
        originalMaeBeforeConversion: trade.mae,
        originalMfeBeforeConversion: trade.mfe,
        originalPnlBeforeConversion: Number(getEffectivePnL(trade)) || 0,
        unrealizedPnlConversionRate,
        pnl: convertedPnl,
        directPnL: convertedDirectPnL,
        commission: convertedCommission,
        swap: convertedSwap,
        fees: convertedFees,
        rebate: convertedRebate,
        riskAmount: convertedRiskAmount,
        mae: convertedMae,
        mfe: convertedMfe,
        dividends: convertedDividends,
        ...convertedBreakEvenAccountBalanceFields,
      });
    });

    
    const validTrades = convertedTrades.filter((trade) => trade !== null);
    const usedFetchedRates = validTrades.some(
      (trade) => trade.conversionUsedFetchedRates === true
    );

    return {
      trades: validTrades,
      excludedTrades,
      baseCurrency,
      rateDate:
        (usedFetchedRates ? ratesData?.rateDate : undefined) ??
        (manualFxRateTradeCount > 0 ? 'manual' : 'broker'),
      unconvertedCurrencies: Array.from(unconvertedCurrencies),
      partiallyConvertedCurrencies: Array.from(partiallyConvertedCurrencies),
      originalTradeCount: trades.length,
      convertedTradeCount: validTrades.length,
      brokerBaseCurrencyTradeCount,
      manualFxRateTradeCount,
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
