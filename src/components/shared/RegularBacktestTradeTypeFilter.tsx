import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ChevronDown } from './icons/ObsidianIcon';
import type { TradeType } from '../../services/tradelog/types';
import { t } from '../../lang/helpers';
import { DEFAULT_REGULAR_ONLY_TRADE_TYPES } from '../../settings/viewFiltersDefaults';
import { normalizeHomeTradeTypes } from '../home/utils/homeTradeTypeUtils';

const REGULAR_BACKTEST_TRADE_TYPES: TradeType[] = ['regular', 'backtest'];

interface RegularBacktestTradeTypeFilterProps {
  selectedTradeTypes: TradeType[];
  onChange: (tradeTypes: TradeType[]) => void | Promise<void>;
  className?: string;
}

export const RegularBacktestTradeTypeFilter: React.FC<RegularBacktestTradeTypeFilterProps> =
  React.memo(({ selectedTradeTypes, onChange, className }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const normalizedSelection = useMemo(
      () => normalizeHomeTradeTypes(selectedTradeTypes),
      [selectedTradeTypes]
    );

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

    const allSelected = useMemo(
      () =>
        REGULAR_BACKTEST_TRADE_TYPES.every((tradeType) =>
          normalizedSelection.includes(tradeType)
        ),
      [normalizedSelection]
    );

    const summary = useMemo(() => {
      if (allSelected) {
        return t('tradelog.root.all-trades');
      }

      if (normalizedSelection.length === 1) {
        return normalizedSelection[0] === 'backtest'
          ? t('widget.backtest-trades.name')
          : t('filter.summary.regular-trades');
      }

      return t('common.n-types', {
        count: normalizedSelection.length.toString(),
      });
    }, [allSelected, normalizedSelection]);

    const toggleTradeType = useCallback(
      (tradeType: TradeType) => {
        const nextSelection = normalizedSelection.includes(tradeType)
          ? normalizedSelection.filter((value) => value !== tradeType)
          : [...normalizedSelection, tradeType];

        const normalizedNextSelection = normalizeHomeTradeTypes(nextSelection);

        void onChange(normalizedNextSelection);
      },
      [normalizedSelection, onChange]
    );

    const toggleAllTradeTypes = useCallback(() => {
      const nextSelection = allSelected
        ? [...DEFAULT_REGULAR_ONLY_TRADE_TYPES]
        : [...REGULAR_BACKTEST_TRADE_TYPES];

      void onChange(nextSelection);
    }, [allSelected, onChange]);

    return (
      <div
        className={`journalit-home-trade-type-filter${className ? ` ${className}` : ''}`}
        ref={dropdownRef}
      >
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="journalit-home-trade-type-filter__trigger clickable-icon"
          aria-label={`${t('home.aria.filter-trade-types')}: ${summary}`}
          aria-expanded={isOpen}
        >
          <span className="journalit-home-trade-type-filter__summary">
            {summary}
          </span>
          <ChevronDown
            size={14}
            className={`journalit-home-trade-type-filter__chevron${isOpen ? ' journalit-home-trade-type-filter__chevron--open' : ''}`}
          />
        </button>

        {isOpen && (
          <div className="journalit-home-trade-type-filter__menu">
            <button
              onClick={toggleAllTradeTypes}
              className={`journalit-home-trade-type-filter__option journalit-home-trade-type-filter__option--select-all${allSelected ? ' journalit-home-trade-type-filter__option--active' : ''}`}
              aria-pressed={allSelected}
            >
              <span
                className={`journalit-home-trade-type-filter__checkbox${allSelected ? ' journalit-home-trade-type-filter__checkbox--checked' : ''}`}
                aria-hidden="true"
              >
                {allSelected ? '✓' : ''}
              </span>
              <span>{t('common.select-all')}</span>
            </button>

            <div className="journalit-home-trade-type-filter__divider" />

            {REGULAR_BACKTEST_TRADE_TYPES.map((tradeType) => {
              const isSelected = normalizedSelection.includes(tradeType);
              const label =
                tradeType === 'backtest'
                  ? t('filter.modal.type.backtest')
                  : t('filter.modal.type.regular');

              return (
                <button
                  key={tradeType}
                  onClick={() => toggleTradeType(tradeType)}
                  className={`journalit-home-trade-type-filter__option${isSelected ? ' journalit-home-trade-type-filter__option--active' : ''}`}
                  aria-pressed={isSelected}
                >
                  <span
                    className={`journalit-home-trade-type-filter__checkbox${isSelected ? ' journalit-home-trade-type-filter__checkbox--checked' : ''}`}
                    aria-hidden="true"
                  >
                    {isSelected ? '✓' : ''}
                  </span>
                  <span className="journalit-home-trade-type-filter__option-label">
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  });

RegularBacktestTradeTypeFilter.displayName = 'RegularBacktestTradeTypeFilter';
