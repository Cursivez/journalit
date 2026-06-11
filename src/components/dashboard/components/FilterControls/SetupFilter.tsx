

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { t } from '../../../../lang/helpers';
import type { CustomOptionsService } from '../../../../services/options/CustomOptionsService';
import { OptionType } from '../../../../services/options/CustomOptionsService';

interface SetupFilterProps {
  selected: string[];
  onChange: (setups: string[]) => void;
  optionsService: CustomOptionsService;
}


const SetupFilterComponent: React.FC<SetupFilterProps> = ({
  selected,
  onChange,
  optionsService,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  
  const setupOptions = useMemo(() => {
    return optionsService.getOptions(OptionType.SETUP);
  }, [optionsService]);

  
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

  const allOptions = useMemo(
    () => ['__NO_SETUP__', ...setupOptions],
    [setupOptions]
  );

  
  const handleSetupChange = useCallback(
    (setupId: string) => {
      if (setupId === 'all') {
        if (selected.length === allOptions.length) {
          onChange([]);
        } else {
          onChange([...allOptions]);
        }
      } else if (setupId === '__NO_SETUP__') {
        
        if (selected.includes('__NO_SETUP__')) {
          onChange(selected.filter((s) => s !== '__NO_SETUP__'));
        } else {
          onChange([...selected, '__NO_SETUP__']);
        }
      } else {
        
        if (selected.includes(setupId)) {
          onChange(selected.filter((s) => s !== setupId));
        } else {
          onChange([...selected, setupId]);
        }
      }
    },
    [allOptions, onChange, selected]
  );

  
  const summaryText = useMemo(() => {
    if (selected.length === 0) return t('dashboard.filter.setup.all');
    if (selected.length === allOptions.length)
      return t('dashboard.filter.setup.all');
    if (selected.length === 1 && selected[0] === '__NO_SETUP__')
      return t('dashboard.filter.setup.none');
    if (selected.length === 1) return selected[0];
    return t('dashboard.filter.setup.n-selected', {
      count: selected.length.toString(),
    });
  }, [allOptions, selected]);

  
  const toggleDropdown = useCallback(() => setIsOpen((prev) => !prev), []);

  const isAllSelected = selected.length === allOptions.length;

  return (
    <div className="journalit-dashboard-setup-filter" ref={dropdownRef}>
      <div className="journalit-dashboard-setup-dropdown">
        <div
          className="journalit-dashboard-setup-summary"
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
          <div className="journalit-dashboard-setup-options-dropdown">
            <div
              className="journalit-dashboard-setup-option-item journalit-dashboard-setup-option-all"
              onClick={() => handleSetupChange('all')}
              role="checkbox"
              aria-checked={isAllSelected}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSetupChange('all');
                }
              }}
            >
              <span
                className={`journalit-dashboard-setup-checkbox${isAllSelected ? ' checked' : ''}`}
                aria-hidden="true"
              >
                {isAllSelected ? '✓' : ''}
              </span>
              <span>{t('dashboard.filter.setup.select-all')}</span>
            </div>
            <div className="journalit-dashboard-setup-divider"></div>
            <div
              className="journalit-dashboard-setup-option-item"
              onClick={() => handleSetupChange('__NO_SETUP__')}
              role="checkbox"
              aria-checked={selected.includes('__NO_SETUP__')}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSetupChange('__NO_SETUP__');
                }
              }}
            >
              <span
                className={`journalit-dashboard-setup-checkbox${selected.includes('__NO_SETUP__') ? ' checked' : ''}`}
                aria-hidden="true"
              >
                {selected.includes('__NO_SETUP__') ? '✓' : ''}
              </span>
              <span>{t('dashboard.filter.setup.none')}</span>
            </div>
            {setupOptions.length > 0 && (
              <>
                <div className="journalit-dashboard-setup-divider"></div>
                {setupOptions.map((setup) => (
                  <div
                    key={setup}
                    className="journalit-dashboard-setup-option-item"
                    onClick={() => handleSetupChange(setup)}
                    role="checkbox"
                    aria-checked={selected.includes(setup)}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleSetupChange(setup);
                      }
                    }}
                  >
                    <span
                      className={`journalit-dashboard-setup-checkbox${selected.includes(setup) ? ' checked' : ''}`}
                      aria-hidden="true"
                    >
                      {selected.includes(setup) ? '✓' : ''}
                    </span>
                    <span>{setup}</span>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const SetupFilter = React.memo(SetupFilterComponent);
