

import React, { memo } from 'react';
import { Funnel } from './icons/ObsidianIcon';
import { t } from '../../lang/helpers';

interface FilterButtonProps {
  
  onClick: () => void;
  
  activeFilterCount: number;
  
  className?: string;
  
  disabled?: boolean;
}


export const FilterButton = memo<FilterButtonProps>(
  ({ onClick, activeFilterCount, className = '', disabled = false }) => {
    return (
      <div
        className={`journalit-filter-button-container ${
          className ? `${className}-container` : ''
        }`}
      >
        <button
          className={`journalit-filter-button clickable-icon ${className}`}
          onClick={disabled ? undefined : onClick}
          aria-label={
            disabled
              ? t('shared.filter.disabled-preview')
              : t('shared.filter.open')
          }
          type="button"
          disabled={disabled}
        >
          <Funnel size={16} />
        </button>
        {activeFilterCount > 0 && (
          <span
            className="journalit-filter-badge"
            aria-label={t('shared.filter.active-count', {
              count: activeFilterCount.toString(),
            })}
          >
            {activeFilterCount}
          </span>
        )}
      </div>
    );
  }
);

FilterButton.displayName = 'FilterButton';


export const FILTER_BUTTON_STYLES = `
  
  .journalit-filter-button-container {
    position: relative;
    display: inline-flex;
  }

  .journalit-filter-button-container.journalit-header-icon-button-container {
    width: 2rem;
    height: 2rem;
  }

  
  .journalit-filter-button-container .journalit-filter-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 6px;
    background-color: transparent;
    color: var(--text-normal);
    border: 1px solid transparent;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .journalit-filter-button-container .journalit-filter-button:hover {
    background-color: var(--background-modifier-hover);
  }

  .journalit-filter-button-container .journalit-filter-button:disabled {
    cursor: default;
    opacity: 0.6;
  }

  .journalit-filter-button-container .journalit-filter-button:disabled:hover {
    background-color: transparent;
  }

  .journalit-filter-button-container .journalit-filter-button.journalit-header-icon-button:disabled:hover {
    background-color: var(--background-secondary);
  }

  
  .journalit-filter-badge {
    position: absolute;
    top: -4px;
    right: -4px;
    display: grid;
    place-items: center;
    box-sizing: border-box;
    min-width: 16px;
    height: 16px;
    padding: 0 4px;
    font-size: 10px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    line-height: 1;
    color: white;
    background-color: var(--interactive-accent);
    border-radius: 8px;
    pointer-events: none;
    z-index: 1;
  }
`;
