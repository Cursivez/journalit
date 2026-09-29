

import React, { useCallback, useMemo } from 'react';
import type { App } from 'obsidian';
import type { TradeType } from '../../../services/tradelog/types';
import type { HomePeriod } from '../../../settings/types';
import { DEFAULT_REGULAR_ONLY_TRADE_TYPES } from '../../../settings/viewFiltersDefaults';
import { t } from '../../../lang/helpers';
import {
  DEFAULT_HOME_FILTERS,
  normalizeHomeTradeTypes,
} from '../utils/homeTradeTypeUtils';
import { CascadingFilterMenu } from '../../shared/filters/menu/CascadingFilterMenu';
import {
  type FilterMenuEntry,
  checklistNode,
} from '../../shared/filters/menu/menuModel';
import { FILTER_MENU_ICONS } from '../../shared/filters/menu/filterMenuIcons';

interface HomeFilterPopoverProps {
  app: App;
  periods: HomePeriod[];
  periodLabels: Record<HomePeriod, string>;
  selectedPeriod: HomePeriod;
  onPeriodChange: (period: HomePeriod) => void | Promise<void>;
  selectedTradeTypes: TradeType[];
  onTradeTypesChange: (tradeTypes: TradeType[]) => void | Promise<void>;
  availableAccounts: string[];
  selectedAccounts: string[];
  explicitAllAccountsSelected: boolean;
  onAccountsChange: (
    accounts: string[],
    explicitAllSelected: boolean
  ) => void | Promise<void>;
  onReset: () => void;
  onOpen?: () => void;
}

const TRADE_TYPES: TradeType[] = ['regular', 'backtest'];

export const HomeFilterPopover: React.FC<HomeFilterPopoverProps> = ({
  app,
  periods,
  periodLabels,
  selectedPeriod,
  onPeriodChange,
  selectedTradeTypes,
  onTradeTypesChange,
  availableAccounts,
  selectedAccounts,
  explicitAllAccountsSelected,
  onAccountsChange,
  onReset,
  onOpen,
}) => {
  const normalizedTradeTypes = useMemo(
    () => normalizeHomeTradeTypes(selectedTradeTypes),
    [selectedTradeTypes]
  );
  const accounts = useMemo(
    () =>
      Array.from(new Set(availableAccounts.filter(Boolean))).sort((a, b) =>
        a.localeCompare(b)
      ),
    [availableAccounts]
  );
  const selectedTradeTypeSet = new Set(normalizedTradeTypes);
  const defaultTradeTypesSelected =
    selectedTradeTypeSet.size === DEFAULT_HOME_FILTERS.tradeTypes.length &&
    DEFAULT_HOME_FILTERS.tradeTypes.every((tradeType) =>
      selectedTradeTypeSet.has(tradeType)
    );
  
  const allAccountsSelected =
    explicitAllAccountsSelected || selectedAccounts.length === 0;
  const visibleAccountSelection = useMemo(
    () => (allAccountsSelected ? [] : selectedAccounts),
    [allAccountsSelected, selectedAccounts]
  );
  const periodChanged = selectedPeriod !== DEFAULT_HOME_FILTERS.period;

  const toggleTradeType = useCallback(
    (tradeType: TradeType) => {
      
      if (
        normalizedTradeTypes.length === 1 &&
        normalizedTradeTypes[0] === tradeType
      ) {
        void onTradeTypesChange([
          tradeType === 'regular' ? 'backtest' : 'regular',
        ]);
        return;
      }
      const next = normalizedTradeTypes.includes(tradeType)
        ? normalizedTradeTypes.filter((value) => value !== tradeType)
        : [...normalizedTradeTypes, tradeType];
      void onTradeTypesChange(normalizeHomeTradeTypes(next));
    },
    [normalizedTradeTypes, onTradeTypesChange]
  );

  const entries = useMemo<FilterMenuEntry[]>(
    () => [
      checklistNode({
        id: 'period',
        label: t('home.filters.period'),
        icon: FILTER_MENU_ICONS.period,
        singleChoice: true,
        options: periods.map((period) => ({
          value: period,
          label: periodLabels[period],
        })),
        selected: [selectedPeriod],
        appliedCount: periodChanged ? 1 : 0,
        onToggle: (value) => {
          const period = periods.find((candidate) => candidate === value);
          if (period) void onPeriodChange(period);
        },
        onClear: () => void onPeriodChange(DEFAULT_HOME_FILTERS.period),
      }),
      checklistNode({
        id: 'tradeType',
        label: t('home.filters.trade-type'),
        icon: FILTER_MENU_ICONS.tradeType,
        options: TRADE_TYPES.map((tradeType) => ({
          value: tradeType,
          label:
            tradeType === 'backtest'
              ? t('filter.modal.type.backtest')
              : t('filter.modal.type.regular'),
        })),
        selected: normalizedTradeTypes,
        appliedCount: defaultTradeTypesSelected
          ? 0
          : normalizedTradeTypes.length,
        onToggle: (value) => {
          const tradeType = TRADE_TYPES.find(
            (candidate) => candidate === value
          );
          if (tradeType) toggleTradeType(tradeType);
        },
        onClear: () =>
          void onTradeTypesChange([...DEFAULT_REGULAR_ONLY_TRADE_TYPES]),
      }),
      checklistNode({
        id: 'accounts',
        label: t('home.filters.accounts'),
        icon: FILTER_MENU_ICONS.accounts,
        options: accounts.map((account) => ({
          value: account,
          label: account,
        })),
        selected: visibleAccountSelection,
        emptyLabel: t('dashboard.filter.accounts.none-found'),
        onToggle: (account) => {
          const next = visibleAccountSelection.includes(account)
            ? visibleAccountSelection.filter((value) => value !== account)
            : [...visibleAccountSelection, account];
          void onAccountsChange(next, false);
        },
        onClear: () => void onAccountsChange([], true),
      }),
    ],
    [
      accounts,
      defaultTradeTypesSelected,
      normalizedTradeTypes,
      onAccountsChange,
      onPeriodChange,
      onTradeTypesChange,
      periodChanged,
      periodLabels,
      periods,
      selectedPeriod,
      toggleTradeType,
      visibleAccountSelection,
    ]
  );

  return (
    <CascadingFilterMenu
      app={app}
      entries={entries}
      onReset={onReset}
      className="journalit-home-filter-button"
      onOpenChange={(isOpen) => {
        if (isOpen) onOpen?.();
      }}
    />
  );
};

HomeFilterPopover.displayName = 'HomeFilterPopover';
