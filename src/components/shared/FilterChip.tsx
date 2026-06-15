

import React, { memo, useCallback } from 'react';
import { X } from './icons/ObsidianIcon';
import { t } from '../../lang/helpers';

interface FilterChipProps {
  label: string;
  onRemove: () => void;
  className?: string;
}

export const FILTER_CHIP_STYLES = `
.journalit-filter-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 6px 2px 8px;
  font-size: 11px;
  font-weight: 500;
  color: var(--text-normal);
  background-color: rgba(var(--interactive-accent-rgb), 0.15);
  border: 1px solid var(--interactive-accent);
  border-radius: 10px;
  white-space: nowrap;
  transition: background-color 0.2s ease;
}

.journalit-filter-chip:hover {
  background-color: rgba(var(--interactive-accent-rgb), 0.25);
}

.journalit-filter-chip-label {
  line-height: 1.2;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
}

.journalit-filter-chip-remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  padding: 0;
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--text-normal);
  border-radius: 50%;
  transition: background-color 0.15s ease, color 0.15s ease;
  line-height: 0;
}

.journalit-filter-chip-remove:hover {
  background-color: rgba(0, 0, 0, 0.1);
  color: var(--text-on-accent);
}

.journalit-filter-chip-remove:focus {
  outline: 2px solid var(--interactive-accent);
  outline-offset: 1px;
}
`;


export const FilterChip = memo<FilterChipProps>(
  ({ label, onRemove, className = '' }) => {
    
    React.useEffect(() => {}, []);

    const handleRemove = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onRemove();
      },
      [onRemove]
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === ' ') {
          e.preventDefault();
          onRemove();
        }
      },
      [onRemove]
    );

    return (
      <div className={`journalit-filter-chip ${className}`}>
        <span className="journalit-filter-chip-label">{label}</span>
        <button
          className="journalit-filter-chip-remove"
          onClick={handleRemove}
          onKeyDown={handleKeyDown}
          aria-label={t('filter.chip.remove-aria', { label })}
          type="button"
        >
          <X size={10} />
        </button>
      </div>
    );
  }
);

FilterChip.displayName = 'FilterChip';

export {};
