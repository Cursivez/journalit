import { useEffect, useRef } from 'react';
import { ExchangeRateService } from '../../../../../services/exchangeRate/ExchangeRateService';
import { resolveForexQuoteCurrency } from '../../../../../utils/forexCurrency';
import { getPluginInstance } from '../../../../../utils/pluginContext';
import type { TradeFormData, TradeFormValue } from '../../types';

type ForexConversionFields = Pick<
  TradeFormData,
  | 'assetType'
  | 'currency'
  | 'forexPnlConversionBaseCurrency'
  | 'forexPnlConversionRate'
  | 'forexPnlConversionRateDate'
  | 'forexPnlConversionRateSource'
  | 'forexQuoteCurrency'
  | 'instrument'
  | 'useDirectPnLInput'
>;

type ForexPnlConversionPlan =
  | { kind: 'clear' }
  | { kind: 'set-context'; quoteCurrency: string; baseCurrency: string }
  | { kind: 'preserve' }
  | { kind: 'fetch'; quoteCurrency: string; baseCurrency: string };

export function resolveFormForexQuoteCurrency(
  instrument: string | undefined,
  initialInstrument: string | undefined,
  resolvedQuoteCurrency: string | null,
  storedQuoteCurrency: string | undefined
): string | null {
  if (resolvedQuoteCurrency !== null) {
    return resolvedQuoteCurrency;
  }

  return instrument === initialInstrument
    ? (storedQuoteCurrency ?? null)
    : null;
}

export function resolveForexPnlConversionPlan(
  data: Partial<ForexConversionFields>,
  globalCurrency: string,
  quoteCurrency: string | null
): ForexPnlConversionPlan {
  if (
    data.assetType !== 'forex' ||
    data.useDirectPnLInput === true ||
    !data.instrument ||
    !quoteCurrency
  ) {
    return { kind: 'clear' };
  }

  const baseCurrency = data.currency || globalCurrency;
  if (quoteCurrency === baseCurrency) {
    return { kind: 'clear' };
  }

  if (
    data.forexQuoteCurrency !== quoteCurrency ||
    data.forexPnlConversionBaseCurrency !== baseCurrency
  ) {
    return { kind: 'set-context', quoteCurrency, baseCurrency };
  }

  const hasUsableRate =
    typeof data.forexPnlConversionRate === 'number' &&
    Number.isFinite(data.forexPnlConversionRate) &&
    data.forexPnlConversionRate > 0;

  return hasUsableRate
    ? { kind: 'preserve' }
    : { kind: 'fetch', quoteCurrency, baseCurrency };
}

interface UseForexPnlConversionRateOptions {
  data: Partial<TradeFormData>;
  globalCurrency: string;
  onChange: (field: keyof TradeFormData, value: TradeFormValue) => void;
}

export function useForexPnlConversionRate({
  data,
  globalCurrency,
  onChange,
}: UseForexPnlConversionRateOptions): void {
  const {
    assetType,
    currency,
    forexPnlConversionBaseCurrency,
    forexPnlConversionRate,
    forexPnlConversionRateDate,
    forexPnlConversionRateSource,
    forexQuoteCurrency,
    instrument,
    useDirectPnLInput,
  } = data;
  const initialInstrumentRef = useRef(instrument);

  useEffect(() => {
    const plugin = getPluginInstance();
    const specs =
      instrument && plugin
        ? plugin.specService?.getSpecsForSymbol(instrument, 'forex')
        : null;
    const resolvedQuoteCurrency = resolveForexQuoteCurrency(
      instrument,
      specs && 'lotSize' in specs ? specs : null
    );
    const quoteCurrency = resolveFormForexQuoteCurrency(
      instrument,
      initialInstrumentRef.current,
      resolvedQuoteCurrency,
      forexQuoteCurrency
    );
    const plan = resolveForexPnlConversionPlan(
      {
        assetType,
        currency,
        forexPnlConversionBaseCurrency,
        forexPnlConversionRate,
        forexPnlConversionRateDate,
        forexPnlConversionRateSource,
        forexQuoteCurrency,
        instrument,
        useDirectPnLInput,
      },
      globalCurrency,
      quoteCurrency
    );

    const clearAll = () => {
      if (forexQuoteCurrency !== undefined) {
        onChange('forexQuoteCurrency', undefined);
      }
      if (forexPnlConversionRate !== undefined) {
        onChange('forexPnlConversionRate', undefined);
      }
      if (forexPnlConversionBaseCurrency !== undefined) {
        onChange('forexPnlConversionBaseCurrency', undefined);
      }
      if (forexPnlConversionRateDate !== undefined) {
        onChange('forexPnlConversionRateDate', undefined);
      }
      if (forexPnlConversionRateSource !== undefined) {
        onChange('forexPnlConversionRateSource', undefined);
      }
    };

    if (plan.kind === 'clear') {
      clearAll();
      return;
    }

    if (plan.kind === 'set-context') {
      onChange('forexQuoteCurrency', plan.quoteCurrency);
      onChange('forexPnlConversionBaseCurrency', plan.baseCurrency);
      if (forexPnlConversionRate !== undefined) {
        onChange('forexPnlConversionRate', undefined);
      }
      if (forexPnlConversionRateDate !== undefined) {
        onChange('forexPnlConversionRateDate', undefined);
      }
      if (forexPnlConversionRateSource !== undefined) {
        onChange('forexPnlConversionRateSource', undefined);
      }
      return;
    }

    if (plan.kind === 'preserve' || !plugin) {
      return;
    }

    let cancelled = false;
    const service = new ExchangeRateService(plugin);
    void service.getRates(plan.baseCurrency).then((rates) => {
      const quotePerBase = rates?.rates[plan.quoteCurrency];
      if (
        cancelled ||
        !rates ||
        typeof quotePerBase !== 'number' ||
        !Number.isFinite(quotePerBase) ||
        quotePerBase <= 0
      ) {
        return;
      }

      onChange('forexQuoteCurrency', plan.quoteCurrency);
      onChange('forexPnlConversionRate', 1 / quotePerBase);
      onChange('forexPnlConversionBaseCurrency', plan.baseCurrency);
      onChange('forexPnlConversionRateDate', rates.rateDate);
      onChange('forexPnlConversionRateSource', 'automatic');
    });

    return () => {
      cancelled = true;
    };
  }, [
    assetType,
    currency,
    forexPnlConversionBaseCurrency,
    forexPnlConversionRate,
    forexPnlConversionRateDate,
    forexPnlConversionRateSource,
    forexQuoteCurrency,
    globalCurrency,
    instrument,
    onChange,
    useDirectPnLInput,
  ]);
}
