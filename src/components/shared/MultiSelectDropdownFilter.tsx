import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useCloseOnOutsideMouseDown } from '../../hooks/useCloseOnOutsideMouseDown';
import { FilterButton } from './FilterButton';
import { ChevronDown, type ObsidianIconComponent } from './icons/ObsidianIcon';

interface MultiSelectDropdownOption {
  value: string;
  label: string;
}

const identityDropdownValue = (value: string): string => value;

interface MultiSelectDropdownFilterProps {
  options: MultiSelectDropdownOption[];
  selectedValues: string[];
  summary: string;
  emptyMessage: string;
  onChange: (values: string[]) => void | Promise<void>;
  classNamePrefix: string;
  ariaLabel?: string;
  selectAllLabel?: string;
  showSelectAll?: boolean;
  icon?: ObsidianIconComponent;
  triggerVariant?: 'summary' | 'filter-button';
  activeFilterCount?: number;
  disabled?: boolean;
  header?: {
    title: string;
    resetLabel: string;
    onReset: () => void;
  };
  normalizeValue?: (value: string) => string;
}

export const MultiSelectDropdownFilter: React.FC<MultiSelectDropdownFilterProps> =
  React.memo(
    ({
      options,
      selectedValues,
      summary,
      emptyMessage,
      onChange,
      classNamePrefix,
      ariaLabel,
      selectAllLabel,
      showSelectAll = false,
      icon: LeadingIcon,
      triggerVariant = 'summary',
      activeFilterCount = selectedValues.length,
      disabled = false,
      header,
      normalizeValue = identityDropdownValue,
    }) => {
      const [isOpen, setIsOpen] = useState(false);
      const dropdownRef = useRef<HTMLDivElement>(null);

      useCloseOnOutsideMouseDown(dropdownRef, () => setIsOpen(false), isOpen);
      const selectedKeys = useMemo(
        () => new Set(selectedValues.map(normalizeValue)),
        [normalizeValue, selectedValues]
      );
      const allSelected =
        options.length > 0 &&
        options.every((option) =>
          selectedKeys.has(normalizeValue(option.value))
        );

      const toggleValue = useCallback(
        (value: string) => {
          const valueKey = normalizeValue(value);
          if (selectedKeys.has(valueKey)) {
            void onChange(
              selectedValues.filter(
                (selected) => normalizeValue(selected) !== valueKey
              )
            );
            return;
          }
          void onChange([...selectedValues, value]);
        },
        [normalizeValue, onChange, selectedKeys, selectedValues]
      );

      const toggleAll = useCallback(() => {
        if (allSelected) {
          void onChange([]);
          return;
        }
        void onChange(options.map((option) => option.value));
      }, [allSelected, onChange, options]);

      return (
        <div className={classNamePrefix} ref={dropdownRef}>
          {triggerVariant === 'filter-button' ? (
            <FilterButton
              activeFilterCount={activeFilterCount}
              ariaExpanded={isOpen}
              ariaHaspopup="true"
              ariaLabel={ariaLabel || summary}
              className={`${classNamePrefix}__trigger`}
              disabled={disabled}
              onClick={() => setIsOpen((prev) => !prev)}
            />
          ) : (
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className={`journalit-native-button journalit-multi-select-dropdown-filter__trigger ${classNamePrefix}__trigger clickable-icon`}
              aria-expanded={isOpen}
              aria-haspopup="true"
              aria-label={ariaLabel || summary}
              disabled={disabled}
            >
              {LeadingIcon && (
                <LeadingIcon
                  size={14}
                  className="journalit-home-filter-icon"
                  aria-hidden="true"
                />
              )}
              <span className={`${classNamePrefix}__summary`}>{summary}</span>
              <ChevronDown
                size={14}
                className={`${classNamePrefix}__chevron${isOpen ? ` ${classNamePrefix}__chevron--open` : ''}`}
                aria-hidden="true"
              />
            </button>
          )}

          {isOpen && (
            <div className={`${classNamePrefix}__menu`}>
              {header ? (
                <div className={`${classNamePrefix}__header`}>
                  <span>{header.title}</span>
                  <button
                    className={`journalit-native-button journalit-multi-select-dropdown-filter__reset ${classNamePrefix}__reset`}
                    type="button"
                    onClick={header.onReset}
                  >
                    {header.resetLabel}
                  </button>
                </div>
              ) : null}
              {options.length > 0 ? (
                <div className={`${classNamePrefix}__options`}>
                  {showSelectAll && selectAllLabel ? (
                    <>
                      <button
                        type="button"
                        onClick={toggleAll}
                        className={`journalit-native-button journalit-multi-select-dropdown-filter__option ${classNamePrefix}__option ${classNamePrefix}__option--select-all${allSelected ? ` ${classNamePrefix}__option--active` : ''}`}
                        aria-pressed={allSelected}
                      >
                        <span
                          className={`${classNamePrefix}__checkbox${allSelected ? ` ${classNamePrefix}__checkbox--checked` : ''}`}
                          aria-hidden="true"
                        >
                          {allSelected ? '✓' : ''}
                        </span>
                        <span>{selectAllLabel}</span>
                      </button>
                      <div className={`${classNamePrefix}__divider`} />
                    </>
                  ) : null}

                  {options.map((option) => {
                    const isSelected = selectedKeys.has(
                      normalizeValue(option.value)
                    );
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => toggleValue(option.value)}
                        className={`journalit-native-button journalit-multi-select-dropdown-filter__option ${classNamePrefix}__option${isSelected ? ` ${classNamePrefix}__option--active` : ''}`}
                        aria-pressed={isSelected}
                      >
                        <span
                          className={`${classNamePrefix}__checkbox${isSelected ? ` ${classNamePrefix}__checkbox--checked` : ''}`}
                          aria-hidden="true"
                        >
                          {isSelected ? '✓' : ''}
                        </span>
                        <span className={`${classNamePrefix}__option-label`}>
                          {option.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className={`${classNamePrefix}__empty`}>
                  {emptyMessage}
                </div>
              )}
            </div>
          )}
        </div>
      );
    }
  );

MultiSelectDropdownFilter.displayName = 'MultiSelectDropdownFilter';
