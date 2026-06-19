import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { t } from '../../lang/helpers';
import type { DirectionFilter as DirectionFilterValue } from '../../services/tradelog/types';

interface DirectionFilterProps {
  selectedDirections: DirectionFilterValue[];
  onChange: (directions: DirectionFilterValue[]) => void;
}

const DIRECTION_OPTIONS: Array<{
  value: DirectionFilterValue;
  labelKey:
    | 'filter.modal.direction.long-call'
    | 'filter.modal.direction.short-put';
}> = [
  { value: 'long', labelKey: 'filter.modal.direction.long-call' },
  { value: 'short', labelKey: 'filter.modal.direction.short-put' },
];

export const DirectionFilter: React.FC<DirectionFilterProps> = React.memo(
  ({ selectedDirections, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          event.target instanceof Node &&
          !dropdownRef.current.contains(event.target)
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

    const summary = useMemo(() => {
      if (selectedDirections.length === 0 || selectedDirections.length === 2) {
        return t('tradelog.filter.all-directions');
      }

      const selected = DIRECTION_OPTIONS.find(
        (option) => option.value === selectedDirections[0]
      );
      return selected
        ? t(selected.labelKey)
        : t('tradelog.filter.all-directions');
    }, [selectedDirections]);

    const allSelected = selectedDirections.length === 0;
    const toggleDropdown = useCallback(() => setIsOpen((prev) => !prev), []);

    const handleDirectionChange = useCallback(
      (direction: DirectionFilterValue | 'all') => {
        if (direction === 'all') {
          onChange([]);
          return;
        }

        if (selectedDirections.includes(direction)) {
          onChange(
            selectedDirections.filter((current) => current !== direction)
          );
          return;
        }

        const nextDirections = [...selectedDirections, direction];
        onChange(
          nextDirections.length === DIRECTION_OPTIONS.length
            ? []
            : nextDirections
        );
      },
      [onChange, selectedDirections]
    );

    const handleKeyDown = (event: React.KeyboardEvent, action: () => void) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        action();
      }
    };

    return (
      <div className="journalit-tradelog-status-filter" ref={dropdownRef}>
        <div className="journalit-tradelog-status-dropdown">
          <div
            className="journalit-tradelog-status-summary"
            role="button"
            tabIndex={0}
            aria-expanded={isOpen}
            aria-haspopup="true"
            onClick={toggleDropdown}
            onKeyDown={(event) => handleKeyDown(event, toggleDropdown)}
          >
            {summary}
            <span className="dropdown-arrow">{isOpen ? '▲' : '▼'}</span>
          </div>

          {isOpen && (
            <div className="journalit-tradelog-status-options-dropdown">
              <div
                className="journalit-tradelog-status-option-item select-all"
                onClick={() => handleDirectionChange('all')}
                role="checkbox"
                tabIndex={0}
                aria-checked={allSelected}
                onKeyDown={(event) =>
                  handleKeyDown(event, () => handleDirectionChange('all'))
                }
              >
                <span
                  className={`journalit-tradelog-checkbox journalit-tradelog-status-checkbox${
                    allSelected ? ' checked' : ''
                  }`}
                  aria-hidden="true"
                >
                  {allSelected ? '✓' : ''}
                </span>
                <span>{t('common.select-all')}</span>
              </div>

              <div className="journalit-tradelog-status-divider"></div>

              {DIRECTION_OPTIONS.map((option) => {
                const checked = selectedDirections.includes(option.value);
                return (
                  <div
                    key={option.value}
                    className="journalit-tradelog-status-option-item"
                    onClick={() => handleDirectionChange(option.value)}
                    role="checkbox"
                    tabIndex={0}
                    aria-checked={checked}
                    onKeyDown={(event) =>
                      handleKeyDown(event, () =>
                        handleDirectionChange(option.value)
                      )
                    }
                  >
                    <span
                      className={`journalit-tradelog-checkbox journalit-tradelog-status-checkbox${
                        checked ? ' checked' : ''
                      }`}
                      aria-hidden="true"
                    >
                      {checked ? '✓' : ''}
                    </span>
                    <span>{t(option.labelKey)}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }
);

DirectionFilter.displayName = 'DirectionFilter';
