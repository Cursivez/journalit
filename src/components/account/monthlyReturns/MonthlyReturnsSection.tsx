import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { AccountData } from '../../../services/account/types';
import type { TradeType } from '../../../services/tradelog/types';
import {
  convertLedgerCurrency,
  firstTradeInScope,
} from '../../../services/account/monthlyReturns';
import { ExchangeRateService } from '../../../services/exchangeRate/ExchangeRateService';
import type { CachedExchangeRates } from '../../../services/exchangeRate/types';
import { eventBus } from '../../../services/events/EventBus';
import { useAccountPageService } from '../../../hooks/useService';
import { usePlugin } from '../../../hooks/usePlugin';
import { useCurrency } from '../../../contexts/CurrencyContext';
import { createTradeLogFilters } from '../../../settings/viewFiltersDefaults';
import { openTradeLogWithFilters } from '../../../utils/openTradeLogWithFilters';
import { createDateWithoutTime } from '../../../utils/dateUtils';
import { t } from '../../../lang/helpers';
import {
  MonthlyReturnsTable,
  type MonthlyReturnsPeriodHandler,
} from './MonthlyReturnsTable';

const TRADE_TYPES: readonly TradeType[] = [
  'all',
  'regular',
  'missed',
  'backtest',
];

type LedgersState =
  | { status: 'loading' }
  | { status: 'ready'; accounts: AccountData[] }
  | { status: 'error' };

interface MonthlyReturnsSectionProps {
  
  accountNames: readonly string[];
  tradeTypes: readonly TradeType[];
  
  placement: 'account-page' | 'account-dashboard';
  
  sectionRef?: React.Ref<HTMLElement>;
}


export function MonthlyReturnsSection({
  accountNames,
  tradeTypes,
  placement,
  sectionRef,
}: MonthlyReturnsSectionProps) {
  const { service } = useAccountPageService();
  const plugin = usePlugin();
  const { currency: baseCurrency } = useCurrency();
  const [state, setState] = useState<LedgersState>({ status: 'loading' });
  const [ratesState, setRatesState] = useState<{
    baseCurrency: string;
    rates: CachedExchangeRates | null;
  } | null>(null);
  const dirtyRef = useRef(true);
  
  
  const namesKey = accountNames.join('\u0000');
  const typesKey = tradeTypes.join('|');

  useEffect(() => {
    if (!service) return;
    const names = namesKey === '' ? [] : namesKey.split('\u0000');
    const keyedTypes = typesKey.split('|');
    const types = TRADE_TYPES.filter((type) => keyedTypes.includes(type));
    let mounted = true;
    let inFlight = false;
    let timer: number | null = null;
    dirtyRef.current = true;
    
    
    const schedule = () => {
      if (inFlight || timer !== null || !dirtyRef.current) return;
      timer = window.setTimeout(() => {
        timer = null;
        void refresh();
      }, 100);
    };
    const invalidate = () => {
      dirtyRef.current = true;
      schedule();
    };
    const refresh = async () => {
      dirtyRef.current = false;
      inFlight = true;
      try {
        const accounts = await service.getReturnLedgers(types, names);
        if (mounted && !dirtyRef.current)
          setState({ status: 'ready', accounts });
      } catch (error) {
        console.error(
          '[MonthlyReturns] Failed to load account ledgers:',
          error
        );
        if (mounted && !dirtyRef.current) setState({ status: 'error' });
      } finally {
        inFlight = false;
        if (mounted) schedule();
      }
    };
    const unsubscribeAccount = eventBus.subscribe(
      'account:changed',
      invalidate
    );
    const unsubscribeTrade = eventBus.subscribe(
      'trade-data:changed',
      invalidate
    );
    const unsubscribeBacktest = eventBus.subscribe(
      'backtest-trade:changed',
      invalidate
    );
    const unsubscribeFolder = eventBus.subscribe(
      'folder-path:changed',
      invalidate
    );
    const unsubscribeSettings = eventBus.subscribe(
      'settings:changed',
      (payload) => {
        if (
          payload?.section &&
          ['trade', 'general', 'copyTradeAdjustments', 'all'].includes(
            payload.section
          )
        )
          invalidate();
      }
    );
    schedule();
    return () => {
      mounted = false;
      if (timer !== null) window.clearTimeout(timer);
      unsubscribeAccount();
      unsubscribeTrade();
      unsubscribeBacktest();
      unsubscribeFolder();
      unsubscribeSettings();
    };
  }, [service, namesKey, typesKey]);

  
  
  const contributing = useMemo(
    () =>
      state.status === 'ready'
        ? state.accounts.filter(
            (account) => firstTradeInScope(account) !== null
          )
        : [],
    [state]
  );
  const needsRates =
    new Set(contributing.map((account) => account.currency ?? baseCurrency))
      .size > 1;
  const rates =
    ratesState?.baseCurrency === baseCurrency ? ratesState.rates : undefined;

  
  
  useEffect(() => {
    if (!needsRates || rates !== undefined || !plugin) return;
    let mounted = true;
    void new ExchangeRateService(plugin)
      .getRates(baseCurrency)
      .catch((error: unknown) => {
        console.warn('[MonthlyReturns] Exchange rates unavailable:', error);
        return null;
      })
      .then((fetched) => {
        if (mounted) setRatesState({ baseCurrency, rates: fetched });
      });
    return () => {
      mounted = false;
    };
  }, [needsRates, rates, plugin, baseCurrency]);

  
  
  
  
  const { accounts, excludedCurrencies } = useMemo(() => {
    if (!needsRates || rates === undefined)
      return { accounts: contributing, excludedCurrencies: [] };
    const converted: AccountData[] = [];
    const excluded = new Set<string>();
    for (const account of contributing) {
      const accountCurrency = account.currency ?? baseCurrency;
      const rate = rates?.rates[accountCurrency];
      if (accountCurrency === baseCurrency) converted.push(account);
      else if (rate !== undefined && rate > 0)
        converted.push(convertLedgerCurrency(account, baseCurrency, 1 / rate));
      else excluded.add(accountCurrency);
    }
    return { accounts: converted, excludedCurrencies: [...excluded].sort() };
  }, [contributing, needsRates, rates, baseCurrency]);

  
  
  const openPeriod: MonthlyReturnsPeriodHandler = (year, month) => {
    if (!plugin) return;
    const start = new Date(year, month ?? 0, 1);
    const end =
      month === null ? new Date(year, 11, 31) : new Date(year, month + 1, 0);
    void openTradeLogWithFilters(plugin, {
      ...createTradeLogFilters(),
      analyticsDateBasis: 'exit',
      dateRange: [
        createDateWithoutTime(start, true),
        createDateWithoutTime(end, false),
      ],
      tradeTypes: [...tradeTypes],
      accounts: accounts.map((account) => account.name),
    });
  };

  const loading =
    state.status === 'loading' || (needsRates && rates === undefined);
  const onDashboard = placement === 'account-dashboard';

  if (onDashboard && state.status === 'ready' && contributing.length === 0)
    return null;

  return (
    <section
      className="journalit-monthly-returns"
      ref={sectionRef}
      aria-busy={loading}
    >
      {!onDashboard && (
        <h3 className="journalit-monthly-returns-title">
          {t('account.monthly-returns.title')}
        </h3>
      )}
      {state.status === 'error' ? (
        <p className="journalit-monthly-returns-empty" role="alert">
          {t('account.monthly-returns.error')}
        </p>
      ) : loading ? (
        <div className="journalit-monthly-returns-loading" />
      ) : (
        <MonthlyReturnsTable
          accounts={accounts}
          excludedCurrencies={excludedCurrencies}
          onOpenPeriod={openPeriod}
        />
      )}
    </section>
  );
}
