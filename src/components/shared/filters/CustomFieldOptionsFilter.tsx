import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import { t } from '../../../lang/helpers';
import type { DropdownOption } from '../../../types/customFields';

interface CustomFieldOptionsFilterProps {
  label: string;
  options: DropdownOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
}

const SELECT_ALL_SENTINEL = '__CUSTOM_FIELD_FILTER_ALL__';

export const CustomFieldOptionsFilter: React.FC<CustomFieldOptionsFilterProps> =
  React.memo(({ label, options, selectedValues, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const optionMap = useMemo(() => {
      const map = new Map<string, string>();
      options.forEach((option) => {
        map.set(option.value, option.label);
      });
      return map;
    }, [options]);

    const allOptions = useMemo(() => {
      const merged = [...options];
      selectedValues.forEach((value) => {
        if (!merged.some((option) => option.value === value)) {
          merged.push({ value, label: optionMap.get(value) || value });
        }
      });
      return merged;
    }, [options, selectedValues, optionMap]);

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

    const isAllSelected =
      allOptions.length > 0 && selectedValues.length === allOptions.length;

    const handleValueToggle = useCallback(
      (value: string) => {
        if (value === SELECT_ALL_SENTINEL) {
          if (isAllSelected) {
            onChange([]);
          } else {
            onChange(allOptions.map((option) => option.value));
          }
          return;
        }

        const nextValues = selectedValues.includes(value)
          ? selectedValues.filter((selected) => selected !== value)
          : [...selectedValues, value];

        if (nextValues.length === allOptions.length) {
          onChange(allOptions.map((option) => option.value));
          return;
        }

        onChange(nextValues);
      },
      [allOptions, isAllSelected, onChange, selectedValues]
    );

    const summaryText = useMemo(() => {
      if (selectedValues.length === 0 || isAllSelected) {
        return t('common.all');
      }

      if (selectedValues.length === 1) {
        return optionMap.get(selectedValues[0]) || selectedValues[0];
      }

      return t('filter.modal.custom-field.n-selected', {
        count: selectedValues.length.toString(),
      });
    }, [isAllSelected, optionMap, selectedValues]);

    const toggleDropdown = useCallback(() => setIsOpen((prev) => !prev), []);

    return (
      <div className="journalit-tradelog-custom-field-filter" ref={dropdownRef}>
        <label className="filter-modal-custom-field-label">{label}</label>
        <div className="journalit-tradelog-custom-field-dropdown">
          <div
            className="journalit-tradelog-custom-field-summary"
            onClick={toggleDropdown}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleDropdown();
              }
            }}
          >
            <span className="journalit-dashboard-summary-text">
              {summaryText}
            </span>
            <span className="dropdown-arrow">{isOpen ? '▲' : '▼'}</span>
          </div>

          {isOpen && (
            <div className="journalit-tradelog-custom-field-options-dropdown">
              <div
                className="journalit-tradelog-custom-field-option-item journalit-tradelog-custom-field-option-all"
                onClick={() => handleValueToggle(SELECT_ALL_SENTINEL)}
                role="checkbox"
                aria-checked={isAllSelected}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleValueToggle(SELECT_ALL_SENTINEL);
                  }
                }}
              >
                <span
                  className={`journalit-tradelog-custom-field-checkbox${isAllSelected ? ' checked' : ''}`}
                  aria-hidden="true"
                >
                  {isAllSelected ? '✓' : ''}
                </span>
                <span>{t('common.select-all')}</span>
              </div>
              {allOptions.length > 0 ? (
                <>
                  <div className="journalit-tradelog-custom-field-divider"></div>
                  {allOptions.map((option) => (
                    <div
                      key={option.value}
                      className="journalit-tradelog-custom-field-option-item"
                      onClick={() => handleValueToggle(option.value)}
                      role="checkbox"
                      aria-checked={selectedValues.includes(option.value)}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleValueToggle(option.value);
                        }
                      }}
                    >
                      <span
                        className={`journalit-tradelog-custom-field-checkbox${selectedValues.includes(option.value) ? ' checked' : ''}`}
                        aria-hidden="true"
                      >
                        {selectedValues.includes(option.value) ? '✓' : ''}
                      </span>
                      <span>{option.label}</span>
                    </div>
                  ))}
                </>
              ) : (
                <div className="journalit-tradelog-custom-field-empty">
                  {t('filter.modal.custom-field.none-available')}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  });

CustomFieldOptionsFilter.displayName = 'CustomFieldOptionsFilter';
