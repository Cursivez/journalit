import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { TradeType } from '../../../services/tradelog/types';
import type { HomePeriod } from '../../../settings/types';
import { DEFAULT_REGULAR_ONLY_TRADE_TYPES } from '../../../settings/viewFiltersDefaults';
import { t } from '../../../lang/helpers';
import { FilterButton } from '../../shared/FilterButton';
import {
  CalendarRange,
  ListFilter,
  UsersRound,
  type ObsidianIconComponent,
} from '../../shared/icons/ObsidianIcon';
import {
  DEFAULT_HOME_FILTERS,
  normalizeHomeTradeTypes,
} from '../utils/homeTradeTypeUtils';
import {
  DrilldownFilterDivider,
  DrilldownFilterEmpty,
  DrilldownFilterOption,
  DrilldownFilterPanel,
  DrilldownFilterPanelHeader,
  DrilldownFilterReset,
  DrilldownFilterRow,
} from '../../shared/filters/DrilldownFilterPopover';

type HomeFilterPanel = 'root' | 'period' | 'tradeType' | 'accounts';

interface HomeFilterPopoverProps {
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
  const [isOpen, setIsOpen] = useState(false);
  const [panel, setPanel] = useState<HomeFilterPanel>('root');
  const popoverRef = useRef<HTMLDivElement>(null);
  const normalizedTradeTypes = useMemo(
    () => normalizeHomeTradeTypes(selectedTradeTypes),
    [selectedTradeTypes]
  );
  const normalizedAccounts = useMemo<string[]>(
    () =>
      Array.from(new Set(availableAccounts.filter(Boolean))).sort((a, b) =>
        a.localeCompare(b)
      ),
    [availableAccounts]
  );
  const allTradeTypesSelected = TRADE_TYPES.every((tradeType) =>
    normalizedTradeTypes.includes(tradeType)
  );
  const normalizedTradeTypesSet = new Set(normalizedTradeTypes);
  const defaultTradeTypesSelected =
    normalizedTradeTypes.length === DEFAULT_HOME_FILTERS.tradeTypes.length &&
    DEFAULT_HOME_FILTERS.tradeTypes.every((tradeType) =>
      normalizedTradeTypesSet.has(tradeType)
    );
  const allAccountsSelected =
    explicitAllAccountsSelected || selectedAccounts.length === 0;
  const activeFilterCount =
    (selectedPeriod === DEFAULT_HOME_FILTERS.period ? 0 : 1) +
    (defaultTradeTypesSelected ? 0 : 1) +
    (allAccountsSelected ? 0 : 1);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target;
      const ActiveDocumentNode = window.activeDocument.defaultView?.Node;
      if (
        !popoverRef.current ||
        !ActiveDocumentNode ||
        !(target instanceof ActiveDocumentNode) ||
        !popoverRef.current.contains(target)
      ) {
        setIsOpen(false);
        setPanel('root');
      }
    };

    window.activeDocument.addEventListener('mousedown', handleClickOutside);
    return () =>
      window.activeDocument.removeEventListener(
        'mousedown',
        handleClickOutside
      );
  }, []);

  const togglePopover = useCallback(() => {
    const nextIsOpen = !isOpen;
    if (nextIsOpen) onOpen?.();
    else setPanel('root');
    setIsOpen(nextIsOpen);
  }, [isOpen, onOpen]);

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

  const toggleAccount = useCallback(
    (account: string) => {
      const visualSelection = allAccountsSelected ? [] : selectedAccounts;
      const next = visualSelection.includes(account)
        ? visualSelection.filter((value) => value !== account)
        : [...visualSelection, account];
      void onAccountsChange(next, false);
    },
    [allAccountsSelected, onAccountsChange, selectedAccounts]
  );

  const tradeTypeSummary = allTradeTypesSelected
    ? t('tradelog.root.all-trades')
    : normalizedTradeTypes.length === 1
      ? normalizedTradeTypes[0] === 'backtest'
        ? t('filter.modal.type.backtest')
        : t('filter.modal.type.regular')
      : t('common.n-types', {
          count: normalizedTradeTypes.length.toString(),
        });
  const accountSummary = allAccountsSelected
    ? t('dashboard.filter.accounts.all')
    : selectedAccounts.length === 1
      ? selectedAccounts[0]
      : t('dashboard.filter.accounts.n-selected', {
          count: selectedAccounts.length.toString(),
        });

  const selectedAccountsSet = new Set(selectedAccounts);
  return (
    <div className="journalit-drilldown-filter" ref={popoverRef}>
      <FilterButton
        onClick={togglePopover}
        activeFilterCount={activeFilterCount}
        className="journalit-home-filter-button"
      />
      {isOpen ? (
        <div className="journalit-drilldown-filter__menu">
          {panel === 'root' ? (
            <DrilldownFilterPanel>
              <DrilldownFilterReset onClick={onReset} />
              <DrilldownFilterDivider />
              {(
                [
                  [
                    'period',
                    t('home.filters.period'),
                    periodLabels[selectedPeriod],
                    CalendarRange,
                  ],
                  [
                    'tradeType',
                    t('home.filters.trade-type'),
                    tradeTypeSummary,
                    ListFilter,
                  ],
                  [
                    'accounts',
                    t('home.filters.accounts'),
                    accountSummary,
                    UsersRound,
                  ],
                ] satisfies Array<
                  [HomeFilterPanel, string, string, ObsidianIconComponent]
                >
              ).map(([targetPanel, label, summary, RowIcon]) => (
                <DrilldownFilterRow
                  key={targetPanel}
                  icon={RowIcon}
                  label={label}
                  summary={summary}
                  onClick={() => setPanel(targetPanel)}
                />
              ))}
            </DrilldownFilterPanel>
          ) : null}
          {panel === 'period' ? (
            <DrilldownFilterPanel>
              <DrilldownFilterPanelHeader
                title={t('home.filters.period')}
                onBack={() => setPanel('root')}
              />
              {periods.map((period) => (
                <DrilldownFilterOption
                  key={period}
                  checked={selectedPeriod === period}
                  onClick={() => void onPeriodChange(period)}
                >
                  {periodLabels[period]}
                </DrilldownFilterOption>
              ))}
            </DrilldownFilterPanel>
          ) : null}
          {panel === 'tradeType' ? (
            <DrilldownFilterPanel>
              <DrilldownFilterPanelHeader
                title={t('home.filters.trade-type')}
                onBack={() => setPanel('root')}
              />
              <DrilldownFilterOption
                checked={allTradeTypesSelected}
                onClick={() =>
                  void onTradeTypesChange(
                    allTradeTypesSelected
                      ? [...DEFAULT_REGULAR_ONLY_TRADE_TYPES]
                      : [...TRADE_TYPES]
                  )
                }
              >
                {t('common.select-all')}
              </DrilldownFilterOption>
              <DrilldownFilterDivider />
              {TRADE_TYPES.map((tradeType) => (
                <DrilldownFilterOption
                  key={tradeType}
                  checked={normalizedTradeTypes.includes(tradeType)}
                  onClick={() => toggleTradeType(tradeType)}
                >
                  {tradeType === 'backtest'
                    ? t('filter.modal.type.backtest')
                    : t('filter.modal.type.regular')}
                </DrilldownFilterOption>
              ))}
            </DrilldownFilterPanel>
          ) : null}
          {panel === 'accounts' ? (
            <DrilldownFilterPanel>
              <DrilldownFilterPanelHeader
                title={t('home.filters.accounts')}
                onBack={() => setPanel('root')}
              />
              <DrilldownFilterOption
                checked={allAccountsSelected}
                onClick={() => void onAccountsChange([], true)}
              >
                {t('dashboard.filter.accounts.select-all')}
              </DrilldownFilterOption>
              <DrilldownFilterDivider />
              {normalizedAccounts.length > 0 ? (
                normalizedAccounts.map((account) => {
                  const selected =
                    allAccountsSelected || selectedAccountsSet.has(account);
                  return (
                    <DrilldownFilterOption
                      key={account}
                      checked={selected}
                      onClick={() => toggleAccount(account)}
                    >
                      {account}
                    </DrilldownFilterOption>
                  );
                })
              ) : (
                <DrilldownFilterEmpty>
                  {t('dashboard.filter.accounts.none-found')}
                </DrilldownFilterEmpty>
              )}
            </DrilldownFilterPanel>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

HomeFilterPopover.displayName = 'HomeFilterPopover';
