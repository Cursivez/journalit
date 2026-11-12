import { useState } from 'react';
import { t } from '../../../../lang/helpers';
import { getPluginInstance } from '../../../../utils/pluginContext';
import {
  MAX_FAVORITE_ACCOUNTS,
  resolveFavoriteAccounts,
} from '../../../../services/account/favoriteAccounts';
import { resolveFavoriteSymbol } from '../tradeFormDefaults';

const favoriteLabels = () => ({
  setLabel: t('csv.account-selector.favorite.set'),
  removeLabel: t('csv.account-selector.favorite.remove'),
});


export function useTradeFormFavorites() {
  const [state, setState] = useState(() => {
    const trade = getPluginInstance()?.settings.trade;
    return {
      accounts: resolveFavoriteAccounts(trade?.favoriteAccounts),
      symbol: resolveFavoriteSymbol(trade?.favoriteSymbol),
    };
  });

  const toggleAccount = (name: string) => {
    const plugin = getPluginInstance();
    if (!plugin) return;
    const starred = state.accounts.includes(name);
    if (!starred && state.accounts.length >= MAX_FAVORITE_ACCOUNTS) return;
    const accounts = starred
      ? state.accounts.filter((account) => account !== name)
      : [...state.accounts, name];
    plugin.settings.trade.favoriteAccounts = accounts;
    setState((previous) => ({ ...previous, accounts }));
    void plugin.saveSettings();
  };

  const toggleSymbol = (name: string) => {
    const plugin = getPluginInstance();
    if (!plugin) return;
    const symbol = state.symbol === name ? '' : name;
    plugin.settings.trade.favoriteSymbol = symbol;
    setState((previous) => ({ ...previous, symbol }));
    void plugin.saveSettings();
  };

  const labels = favoriteLabels();

  return {
    accounts: { values: state.accounts, onToggle: toggleAccount, ...labels },
    symbol: {
      values: state.symbol ? [state.symbol] : [],
      onToggle: toggleSymbol,
      ...labels,
    },
  };
}


export const pinFavoritesFirst = (
  options: readonly string[],
  favorites: readonly string[]
): string[] => {
  const starred = new Set(favorites);
  return [
    ...options.filter((option) => starred.has(option)),
    ...options.filter((option) => !starred.has(option)),
  ];
};
