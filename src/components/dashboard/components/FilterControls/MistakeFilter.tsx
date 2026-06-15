

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import { t } from '../../../../lang/helpers';
import { OptionType } from '../../../../services/options/CustomOptionsService';
import { usePlugin } from '../../../../hooks/usePlugin';
import { useEventBus } from '../../../../hooks';
import { MistakeFilterProps } from './types';


export const MistakeFilter: React.FC<MistakeFilterProps> = React.memo(
  ({ mistakes, selectedMistakes, onChange }) => {
    const plugin = usePlugin();
    const [customMistakes, setCustomMistakes] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    
    useEffect(() => {
      if (plugin && plugin.optionsService) {
        const optionsMistakes = plugin.optionsService.getOptions(
          OptionType.MISTAKE
        );
        setCustomMistakes(optionsMistakes);
      }
    }, [plugin]);

    const handleOptionsChanged = useCallback(() => {
      if (plugin && plugin.optionsService) {
        const updatedMistakes = plugin.optionsService.getOptions(
          OptionType.MISTAKE
        );
        setCustomMistakes(updatedMistakes);
      }
    }, [plugin]);

    useEventBus('options:changed', handleOptionsChanged);

    const combinedMistakes = useMemo(() => {
      return [...new Set([...customMistakes, ...mistakes])];
    }, [customMistakes, mistakes]);

    const hasMistakes = combinedMistakes.length > 0;

    const allOptions = useMemo(
      () => ['__NO_MISTAKES__', ...combinedMistakes],
      [combinedMistakes]
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

    const handleMistakeChange = useCallback(
      (mistakeId: string) => {
        if (mistakeId === 'select-all') {
          if (selectedMistakes.length === allOptions.length) {
            onChange([]);
          } else {
            onChange([...allOptions]);
          }
        } else if (mistakeId === '__NO_MISTAKES__') {
          if (selectedMistakes.includes('__NO_MISTAKES__')) {
            onChange(selectedMistakes.filter((t) => t !== '__NO_MISTAKES__'));
          } else {
            onChange([...selectedMistakes, '__NO_MISTAKES__']);
          }
        } else {
          if (selectedMistakes.includes(mistakeId)) {
            onChange(selectedMistakes.filter((t) => t !== mistakeId));
          } else {
            onChange([...selectedMistakes, mistakeId]);
          }
        }
      },
      [selectedMistakes, allOptions, onChange]
    );

    const mistakeSummary = useMemo(() => {
      if (selectedMistakes.length === 0)
        return t('dashboard.filter.mistakes.all');
      if (selectedMistakes.length === allOptions.length)
        return t('dashboard.filter.mistakes.all');
      if (
        selectedMistakes.length === 1 &&
        selectedMistakes[0] === '__NO_MISTAKES__'
      )
        return t('dashboard.filter.mistakes.none');
      if (selectedMistakes.length === 1) return selectedMistakes[0];
      return t('dashboard.filter.mistakes.n-selected', {
        count: selectedMistakes.length.toString(),
      });
    }, [selectedMistakes, allOptions]);

    const toggleDropdown = useCallback(() => setIsOpen((prev) => !prev), []);

    const handleSelectAllClick = useCallback(
      () => handleMistakeChange('select-all'),
      [handleMistakeChange]
    );

    const getMistakeClickHandler = useCallback(
      (mistake: string) => {
        return () => handleMistakeChange(mistake);
      },
      [handleMistakeChange]
    );

    return (
      <div
        className="journalit-dashboard-mistake-filter journalit-responsive-mistake-filter"
        ref={dropdownRef}
      >
        <div className="journalit-dashboard-mistake-dropdown">
          <div
            className="journalit-dashboard-mistake-summary"
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
              {mistakeSummary}
            </span>
            <span className="dropdown-arrow">{isOpen ? '▲' : '▼'}</span>
          </div>

          {isOpen && (
            <div className="journalit-dashboard-mistake-options-dropdown">
              {hasMistakes || selectedMistakes.includes('__NO_MISTAKES__') ? (
                <>
                  <div
                    className="journalit-dashboard-mistake-option-item select-all"
                    onClick={handleSelectAllClick}
                    role="checkbox"
                    aria-checked={selectedMistakes.length === allOptions.length}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleSelectAllClick();
                      }
                    }}
                  >
                    <span
                      className={`journalit-dashboard-mistake-checkbox${selectedMistakes.length === allOptions.length ? ' checked' : ''}`}
                      aria-hidden="true"
                    >
                      {selectedMistakes.length === allOptions.length ? '✓' : ''}
                    </span>
                    <span>{t('dashboard.filter.mistakes.select-all')}</span>
                  </div>
                  <div className="journalit-dashboard-mistake-divider"></div>
                  <div
                    className="journalit-dashboard-mistake-option-item"
                    onClick={getMistakeClickHandler('__NO_MISTAKES__')}
                    role="checkbox"
                    aria-checked={selectedMistakes.includes('__NO_MISTAKES__')}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleMistakeChange('__NO_MISTAKES__');
                      }
                    }}
                  >
                    <span
                      className={`journalit-dashboard-mistake-checkbox${selectedMistakes.includes('__NO_MISTAKES__') ? ' checked' : ''}`}
                      aria-hidden="true"
                    >
                      {selectedMistakes.includes('__NO_MISTAKES__') ? '✓' : ''}
                    </span>
                    <span>{t('dashboard.filter.mistakes.none')}</span>
                  </div>
                  {combinedMistakes.length > 0 && (
                    <>
                      <div className="journalit-dashboard-mistake-divider"></div>
                      {combinedMistakes.map((mistake) => (
                        <div
                          key={mistake}
                          className="journalit-dashboard-mistake-option-item"
                          onClick={getMistakeClickHandler(mistake)}
                          role="checkbox"
                          aria-checked={selectedMistakes.includes(mistake)}
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleMistakeChange(mistake);
                            }
                          }}
                        >
                          <span
                            className={`journalit-dashboard-mistake-checkbox${selectedMistakes.includes(mistake) ? ' checked' : ''}`}
                            aria-hidden="true"
                          >
                            {selectedMistakes.includes(mistake) ? '✓' : ''}
                          </span>
                          <span>{mistake}</span>
                        </div>
                      ))}
                    </>
                  )}
                </>
              ) : (
                <div className="journalit-dashboard-no-mistakes">
                  {t('dashboard.filter.mistakes.none-found')}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
);

MistakeFilter.displayName = 'MistakeFilter';
