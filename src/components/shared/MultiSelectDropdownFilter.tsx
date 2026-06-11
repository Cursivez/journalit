import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronDown } from './icons/ObsidianIcon';

interface MultiSelectDropdownOption {
  value: string;
  label: string;
}

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
    }) => {
      const [isOpen, setIsOpen] = useState(false);
      const dropdownRef = useRef<HTMLDivElement>(null);

      useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target as Node)
          ) {
            setIsOpen(false);
          }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, []);

      const toggleValue = useCallback(
        (value: string) => {
          if (selectedValues.includes(value)) {
            void onChange(
              selectedValues.filter((selected) => selected !== value)
            );
            return;
          }
          void onChange([...selectedValues, value]);
        },
        [onChange, selectedValues]
      );

      const toggleAll = useCallback(() => {
        if (selectedValues.length === options.length) {
          void onChange([]);
          return;
        }
        void onChange(options.map((option) => option.value));
      }, [onChange, options, selectedValues.length]);

      const allSelected =
        options.length > 0 && selectedValues.length === options.length;

      return (
        <div className={classNamePrefix} ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className={`${classNamePrefix}__trigger clickable-icon`}
            aria-label={ariaLabel || summary}
          >
            <span className={`${classNamePrefix}__summary`}>{summary}</span>
            <ChevronDown
              size={14}
              className={`${classNamePrefix}__chevron${isOpen ? ` ${classNamePrefix}__chevron--open` : ''}`}
              aria-hidden="true"
            />
          </button>

          {isOpen && (
            <div className={`${classNamePrefix}__menu`}>
              {options.length > 0 ? (
                <>
                  {showSelectAll && selectAllLabel ? (
                    <>
                      <button
                        type="button"
                        onClick={toggleAll}
                        className={`${classNamePrefix}__option ${classNamePrefix}__option--select-all${allSelected ? ` ${classNamePrefix}__option--active` : ''}`}
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
                    const isSelected = selectedValues.includes(option.value);
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => toggleValue(option.value)}
                        className={`${classNamePrefix}__option${isSelected ? ` ${classNamePrefix}__option--active` : ''}`}
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
                </>
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
