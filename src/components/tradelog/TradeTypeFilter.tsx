

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import { TradeType } from '../../services/tradelog/types';
import { t } from '../../lang/helpers';
import {
  DEFAULT_ALL_TRADE_TYPES,
  getActiveTradeTypeSelection,
} from '../../settings/viewFiltersDefaults';

const DEFAULT_AVAILABLE_TRADE_TYPES: TradeType[] = [
  'regular',
  'missed',
  'backtest',
];

interface TradeTypeFilterProps {
  selectedTradeTypes: TradeType[];
  defaultTradeTypes?: TradeType[];
  availableTradeTypes?: TradeType[];
  showImplicitDefaultAsChecked?: boolean;
  onChange: (tradeTypes: TradeType[]) => void;
}

const getTradeTypeOptions = (availableTradeTypes: TradeType[]) => {
  const concreteOptions = [
    {
      value: 'regular' as TradeType,
      label: t('tradelog.type.regular'),
      description: t('tradelog.type.regular.desc'),
    },
    {
      value: 'missed' as TradeType,
      label: t('tradelog.type.missed'),
      description: t('tradelog.type.missed.desc'),
    },
    {
      value: 'backtest' as TradeType,
      label: t('tradelog.type.backtest'),
      description: t('tradelog.type.backtest.desc'),
    },
  ].filter((option) => availableTradeTypes.includes(option.value));

  return [
    {
      value: 'all' as TradeType,
      label: t('tradelog.type.all'),
      description: t('tradelog.type.all.desc'),
    },
    ...concreteOptions,
  ];
};


export const TradeTypeFilter: React.FC<TradeTypeFilterProps> = React.memo(
  ({
    selectedTradeTypes,
    defaultTradeTypes = [],
    availableTradeTypes = DEFAULT_AVAILABLE_TRADE_TYPES,
    showImplicitDefaultAsChecked = false,
    onChange,
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target;
        if (
          dropdownRef.current &&
          (!(target instanceof Node) || !dropdownRef.current.contains(target))
        ) {
          setIsOpen(false);
        }
      };

      window.activeDocument.addEventListener('mousedown', handleClickOutside);
      return () => {
        window.activeDocument.removeEventListener(
          'mousedown',
          handleClickOutside
        );
      };
    }, []);

    const effectiveDefaultTradeTypes = useMemo(() => {
      const fallbackTradeTypes =
        defaultTradeTypes.length > 0
          ? defaultTradeTypes
          : DEFAULT_ALL_TRADE_TYPES;

      return fallbackTradeTypes.filter((tradeType) =>
        availableTradeTypes.includes(tradeType)
      );
    }, [availableTradeTypes, defaultTradeTypes]);

    const explicitSelectedTradeTypes = useMemo(
      () =>
        selectedTradeTypes.filter((tradeType) =>
          availableTradeTypes.includes(tradeType)
        ),
      [availableTradeTypes, selectedTradeTypes]
    );

    const effectiveSelectedTradeTypes = useMemo(() => {
      if (explicitSelectedTradeTypes.length > 0) {
        return explicitSelectedTradeTypes;
      }

      return effectiveDefaultTradeTypes;
    }, [effectiveDefaultTradeTypes, explicitSelectedTradeTypes]);

    const visualSelectedTradeTypes = useMemo(() => {
      const activeSelection = getActiveTradeTypeSelection(
        selectedTradeTypes,
        effectiveDefaultTradeTypes
      ).filter((tradeType) => availableTradeTypes.includes(tradeType));

      if (activeSelection.length > 0 || !showImplicitDefaultAsChecked) {
        return activeSelection;
      }

      return effectiveSelectedTradeTypes;
    }, [
      availableTradeTypes,
      effectiveDefaultTradeTypes,
      effectiveSelectedTradeTypes,
      selectedTradeTypes,
      showImplicitDefaultAsChecked,
    ]);

    
    const handleTradeTypeChange = useCallback(
      (tradeType: TradeType) => {
        if (tradeType === 'all') {
          if (visualSelectedTradeTypes.length === availableTradeTypes.length) {
            onChange([]);
          } else {
            onChange(availableTradeTypes);
          }
          return;
        }

        const isImplicitDefaultSelection =
          visualSelectedTradeTypes.length === 0;
        const defaultIsAll =
          effectiveDefaultTradeTypes.length === availableTradeTypes.length;

        if (isImplicitDefaultSelection) {
          if (defaultIsAll) {
            onChange([tradeType]);
          } else if (!effectiveSelectedTradeTypes.includes(tradeType)) {
            onChange([...effectiveSelectedTradeTypes, tradeType]);
          } else {
            onChange([...effectiveSelectedTradeTypes]);
          }
          return;
        }

        if (effectiveSelectedTradeTypes.includes(tradeType)) {
          onChange(effectiveSelectedTradeTypes.filter((t) => t !== tradeType));
        } else {
          onChange([...effectiveSelectedTradeTypes, tradeType]);
        }
      },
      [
        availableTradeTypes,
        effectiveDefaultTradeTypes,
        effectiveSelectedTradeTypes,
        onChange,
        visualSelectedTradeTypes,
      ]
    );

    
    const tradeTypeSummary = useMemo(() => {
      if (effectiveSelectedTradeTypes.length === availableTradeTypes.length) {
        return t('tradelog.type.all');
      }
      if (effectiveSelectedTradeTypes.length === 1) {
        const selectedTradeType = effectiveSelectedTradeTypes[0];
        if (selectedTradeType === 'regular') {
          return t('filter.summary.regular-trades');
        }
        if (selectedTradeType === 'missed') {
          return t('widget.missed-trades.name');
        }
        if (selectedTradeType === 'backtest') {
          return t('widget.backtest-trades.name');
        }

        const selectedOption = getTradeTypeOptions(availableTradeTypes).find(
          (opt) => opt.value === selectedTradeType
        );
        return selectedOption?.label || selectedTradeType;
      }
      return t('common.n-types', {
        count: effectiveSelectedTradeTypes.length.toString(),
      });
    }, [availableTradeTypes, effectiveSelectedTradeTypes]);

    
    const allTypesSelected =
      visualSelectedTradeTypes.length === availableTradeTypes.length;

    
    const toggleDropdown = useCallback(() => setIsOpen((prev) => !prev), []);

    const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        action();
      }
    };

    return (
      <div className="journalit-tradelog-trade-type-filter" ref={dropdownRef}>
        <div className="journalit-tradelog-trade-type-dropdown">
          <div
            className="journalit-tradelog-trade-type-summary"
            role="button"
            tabIndex={0}
            aria-expanded={isOpen}
            aria-haspopup="true"
            onClick={toggleDropdown}
            onKeyDown={(e) => handleKeyDown(e, toggleDropdown)}
          >
            {tradeTypeSummary}
            <span className="dropdown-arrow">{isOpen ? '▲' : '▼'}</span>
          </div>

          {isOpen && (
            <div className="journalit-tradelog-trade-type-options-dropdown">
              <div
                className="journalit-tradelog-trade-type-option-item select-all"
                role="checkbox"
                tabIndex={0}
                aria-checked={allTypesSelected}
                onClick={() => handleTradeTypeChange('all')}
                onKeyDown={(e) =>
                  handleKeyDown(e, () => handleTradeTypeChange('all'))
                }
              >
                <span
                  className={`journalit-tradelog-checkbox journalit-tradelog-trade-type-checkbox${
                    allTypesSelected ? ' checked' : ''
                  }`}
                  aria-hidden="true"
                >
                  {allTypesSelected ? '✓' : ''}
                </span>
                <span>{t('common.select-all')}</span>
              </div>
              <div className="journalit-tradelog-trade-type-divider"></div>
              {getTradeTypeOptions(availableTradeTypes)
                .slice(1)
                .map(
                  (
                    option 
                  ) => (
                    <div
                      key={option.value}
                      className="journalit-tradelog-trade-type-option-item"
                      role="checkbox"
                      tabIndex={0}
                      aria-checked={visualSelectedTradeTypes.includes(
                        option.value
                      )}
                      onClick={() => handleTradeTypeChange(option.value)}
                      onKeyDown={(e) =>
                        handleKeyDown(e, () =>
                          handleTradeTypeChange(option.value)
                        )
                      }
                      aria-description={option.description}
                    >
                      <span
                        className={`journalit-tradelog-checkbox journalit-tradelog-trade-type-checkbox${
                          visualSelectedTradeTypes.includes(option.value)
                            ? ' checked'
                            : ''
                        }`}
                        aria-hidden="true"
                      >
                        {visualSelectedTradeTypes.includes(option.value)
                          ? '✓'
                          : ''}
                      </span>
                      <span>{option.label}</span>
                    </div>
                  )
                )}
            </div>
          )}
        </div>
      </div>
    );
  }
);

TradeTypeFilter.displayName = 'TradeTypeFilter';
