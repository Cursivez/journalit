

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
import { TagFilterProps } from './types';


export const TagFilter: React.FC<TagFilterProps> = React.memo(
  ({ tags, selectedTags, onChange }) => {
    const plugin = usePlugin();
    const [customTags, setCustomTags] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    
    useEffect(() => {
      if (plugin && plugin.optionsService) {
        
        const optionsTags = plugin.optionsService.getOptions(OptionType.TAG);
        setCustomTags(optionsTags);
      }
    }, [plugin]);

    
    const handleOptionsChanged = useCallback(() => {
      if (plugin && plugin.optionsService) {
        const updatedTags = plugin.optionsService.getOptions(OptionType.TAG);
        setCustomTags(updatedTags);
      }
    }, [plugin]);

    
    useEventBus('options:changed', handleOptionsChanged);

    
    const combinedTags = useMemo(() => {
      return [...new Set([...customTags, ...tags])]; 
    }, [tags, customTags]);

    
    const hasTags = combinedTags.length > 0;

    
    const allOptions = useMemo(
      () => ['__NO_TAGS__', ...combinedTags],
      [combinedTags]
    );

    
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

    
    const handleTagChange = useCallback(
      (tagId: string) => {
        if (tagId === 'select-all') {
          
          if (selectedTags.length === allOptions.length) {
            onChange([]);
          } else {
            onChange([...allOptions]);
          }
        } else if (tagId === '__NO_TAGS__') {
          
          if (selectedTags.includes('__NO_TAGS__')) {
            onChange(selectedTags.filter((t) => t !== '__NO_TAGS__'));
          } else {
            onChange([...selectedTags, '__NO_TAGS__']);
          }
        } else {
          
          if (selectedTags.includes(tagId)) {
            onChange(selectedTags.filter((t) => t !== tagId));
          } else {
            onChange([...selectedTags, tagId]);
          }
        }
      },
      [selectedTags, allOptions, onChange]
    );

    
    const tagSummary = useMemo(() => {
      if (selectedTags.length === 0) return t('dashboard.filter.tags.all');
      if (selectedTags.length === allOptions.length)
        return t('dashboard.filter.tags.all');
      if (selectedTags.length === 1 && selectedTags[0] === '__NO_TAGS__')
        return t('dashboard.filter.tags.none');
      if (selectedTags.length === 1) return selectedTags[0];
      return t('dashboard.filter.tags.n-selected', {
        count: selectedTags.length.toString(),
      });
    }, [selectedTags, allOptions]);

    
    const toggleDropdown = useCallback(() => setIsOpen((prev) => !prev), []);

    
    const handleSelectAllClick = useCallback(
      () => handleTagChange('select-all'),
      [handleTagChange]
    );

    
    const getTagClickHandler = useCallback(
      (tag: string) => {
        return () => handleTagChange(tag);
      },
      [handleTagChange]
    );

    return (
      <div
        className="journalit-dashboard-tag-filter journalit-responsive-tag-filter"
        ref={dropdownRef}
      >
        <div className="journalit-dashboard-tag-dropdown">
          <div
            className="journalit-dashboard-tag-summary"
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
              {tagSummary}
            </span>
            <span className="dropdown-arrow">{isOpen ? '▲' : '▼'}</span>
          </div>

          {isOpen && (
            <div className="journalit-dashboard-tag-options-dropdown">
              {hasTags || selectedTags.includes('__NO_TAGS__') ? (
                <>
                  <div
                    className="journalit-dashboard-tag-option-item select-all"
                    onClick={handleSelectAllClick}
                    role="checkbox"
                    aria-checked={selectedTags.length === allOptions.length}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleSelectAllClick();
                      }
                    }}
                  >
                    <span
                      className={`journalit-dashboard-tag-checkbox${selectedTags.length === allOptions.length ? ' checked' : ''}`}
                      aria-hidden="true"
                    >
                      {selectedTags.length === allOptions.length ? '✓' : ''}
                    </span>
                    <span>{t('dashboard.filter.tags.select-all')}</span>
                  </div>
                  <div className="journalit-dashboard-tag-divider"></div>
                  <div
                    className="journalit-dashboard-tag-option-item"
                    onClick={getTagClickHandler('__NO_TAGS__')}
                    role="checkbox"
                    aria-checked={selectedTags.includes('__NO_TAGS__')}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleTagChange('__NO_TAGS__');
                      }
                    }}
                  >
                    <span
                      className={`journalit-dashboard-tag-checkbox${selectedTags.includes('__NO_TAGS__') ? ' checked' : ''}`}
                      aria-hidden="true"
                    >
                      {selectedTags.includes('__NO_TAGS__') ? '✓' : ''}
                    </span>
                    <span>{t('dashboard.filter.tags.none')}</span>
                  </div>
                  {hasTags && (
                    <>
                      <div className="journalit-dashboard-tag-divider"></div>
                      {combinedTags.map((tag) => (
                        <div
                          key={tag}
                          className="journalit-dashboard-tag-option-item"
                          onClick={getTagClickHandler(tag)}
                          role="checkbox"
                          aria-checked={selectedTags.includes(tag)}
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleTagChange(tag);
                            }
                          }}
                        >
                          <span
                            className={`journalit-dashboard-tag-checkbox${selectedTags.includes(tag) ? ' checked' : ''}`}
                            aria-hidden="true"
                          >
                            {selectedTags.includes(tag) ? '✓' : ''}
                          </span>
                          <span>{tag}</span>
                        </div>
                      ))}
                    </>
                  )}
                </>
              ) : (
                <div className="journalit-dashboard-no-tags">
                  {t('dashboard.filter.tags.none-found')}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
);

TagFilter.displayName = 'TagFilter';
