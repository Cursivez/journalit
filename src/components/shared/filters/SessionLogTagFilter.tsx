import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { getSessionLogTags } from '../../sessionLog/sessionLogUtils';
import { t } from '../../../lang/helpers';
import type JournalitPlugin from '../../../main';
import type { SessionLogTagDefinition } from '../../../types/sessionLog';

interface SessionLogTagFilterProps {
  plugin: JournalitPlugin;
  selectedTags: string[];
  onChange: (tags: string[]) => void;
}

export function areAllSessionLogTagsSelected(
  tags: SessionLogTagDefinition[],
  selectedTags: string[]
): boolean {
  if (tags.length === 0 || selectedTags.length !== tags.length) return false;
  const selectedTagIds = new Set(selectedTags);
  return tags.every((tag) => selectedTagIds.has(tag.id));
}

export function getSessionLogTagSummary(
  tags: SessionLogTagDefinition[],
  selectedTags: string[]
): string {
  const configuredTagIds = new Set(tags.map((tag) => tag.id));
  const visibleSelectedTags = selectedTags.filter((tagId) =>
    configuredTagIds.has(tagId)
  );
  if (visibleSelectedTags.length === 0) {
    return t('filter.modal.session-tags.placeholder');
  }
  if (areAllSessionLogTagsSelected(tags, visibleSelectedTags)) {
    return t('filter.modal.session-tags.all');
  }
  if (visibleSelectedTags.length === 1) {
    return (
      tags.find((tag) => tag.id === visibleSelectedTags[0])?.label ??
      t('filter.modal.session-tags.placeholder')
    );
  }
  return t('filter.modal.session-tags.n-selected', {
    count: visibleSelectedTags.length.toString(),
  });
}

export const SessionLogTagFilter: React.FC<SessionLogTagFilterProps> =
  React.memo(({ plugin, selectedTags, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const tags = useMemo(() => getSessionLogTags(plugin), [plugin]);
    const selectedConfiguredTags = useMemo(() => {
      const configuredTagIds = new Set(tags.map((tag) => tag.id));
      return selectedTags.filter((tagId) => configuredTagIds.has(tagId));
    }, [selectedTags, tags]);
    const isAllSelected = areAllSessionLogTagsSelected(
      tags,
      selectedConfiguredTags
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

    const summary = useMemo(
      () => getSessionLogTagSummary(tags, selectedTags),
      [selectedTags, tags]
    );

    const toggleDropdown = useCallback(() => setIsOpen((open) => !open), []);

    const handleSelectAll = useCallback(() => {
      onChange(isAllSelected ? [] : tags.map((tag) => tag.id));
    }, [isAllSelected, onChange, tags]);

    const handleTagChange = useCallback(
      (tagId: string) => {
        onChange(
          selectedTags.includes(tagId)
            ? selectedTags.filter((selected) => selected !== tagId)
            : [...selectedTags, tagId]
        );
      },
      [onChange, selectedTags]
    );

    return (
      <div className="journalit-session-log-tag-filter" ref={dropdownRef}>
        <div className="journalit-dashboard-mistake-dropdown journalit-session-log-tag-dropdown">
          <div
            className="journalit-dashboard-mistake-summary journalit-session-log-tag-summary"
            onClick={toggleDropdown}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                toggleDropdown();
              }
            }}
          >
            <span className="journalit-dashboard-summary-text">{summary}</span>
            <span className="dropdown-arrow">{isOpen ? '▲' : '▼'}</span>
          </div>

          {isOpen && (
            <div className="journalit-dashboard-mistake-options-dropdown journalit-session-log-tag-options-dropdown">
              {tags.length > 0 ? (
                <>
                  <div
                    className="journalit-dashboard-mistake-option-item select-all"
                    onClick={handleSelectAll}
                    role="checkbox"
                    aria-checked={isAllSelected}
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        handleSelectAll();
                      }
                    }}
                  >
                    <span
                      className={`journalit-dashboard-mistake-checkbox${isAllSelected ? ' checked' : ''}`}
                      aria-hidden="true"
                    >
                      {isAllSelected ? '✓' : ''}
                    </span>
                    <span>{t('filter.modal.session-tags.select-all')}</span>
                  </div>
                  <div className="journalit-dashboard-mistake-divider"></div>
                  {tags.map((tag) => {
                    const isSelected = selectedTags.includes(tag.id);
                    return (
                      <div
                        key={tag.id}
                        className="journalit-dashboard-mistake-option-item"
                        onClick={() => handleTagChange(tag.id)}
                        role="checkbox"
                        aria-checked={isSelected}
                        tabIndex={0}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            handleTagChange(tag.id);
                          }
                        }}
                      >
                        <span
                          className={`journalit-dashboard-mistake-checkbox${isSelected ? ' checked' : ''}`}
                          aria-hidden="true"
                        >
                          {isSelected ? '✓' : ''}
                        </span>
                        <span>{tag.label}</span>
                      </div>
                    );
                  })}
                </>
              ) : (
                <div className="journalit-dashboard-no-mistakes">
                  {t('filter.modal.session-tags.none-found')}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  });

SessionLogTagFilter.displayName = 'SessionLogTagFilter';
