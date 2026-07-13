

import React, { memo, useState, useCallback } from 'react';
import { ChevronDown } from './icons/ObsidianIcon';
import { t } from '../../lang/helpers';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  isOpen?: boolean;
  onToggle?: (open: boolean) => void;
  badge?: number;
  className?: string;
  containerRef?: (element: HTMLDivElement | null) => void;
}

export const COLLAPSIBLE_SECTION_STYLES = `
.journalit-collapsible-section {
  border: 1px solid var(--background-modifier-border);
  border-radius: 6px;
  background: var(--background-primary);
  margin-bottom: 12px;
}

.journalit-collapsible-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 10px 12px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--text-normal);
  font-size: 13px;
  font-weight: 600;
  text-align: left;
  transition: background-color 0.15s ease;
  border-radius: 6px;
}

.journalit-collapsible-header:hover {
  background: var(--background-modifier-hover);
}

.journalit-collapsible-header:focus {
  outline: 2px solid var(--interactive-accent);
  outline-offset: -2px;
}

.journalit-collapsible-header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.journalit-collapsible-title {
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 11px;
}

.journalit-collapsible-header.has-active-filters .journalit-collapsible-title {
  color: var(--text-normal);
  font-weight: 700;
}

.journalit-collapsible-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  font-size: 10px;
  font-weight: 600;
  color: var(--text-on-accent);
  background-color: var(--interactive-accent);
  border-radius: 9px;
}

.journalit-collapsible-chevron {
  display: flex;
  align-items: center;
  color: var(--text-muted);
  transition: transform 0.2s ease;
}

.journalit-collapsible-chevron.open {
  transform: rotate(180deg);
}

.journalit-collapsible-content {
  padding: 12px 12px 12px 12px;
  display: flex;
  justify-content: center;
  animation: expandDown 0.2s ease-out;
}

@keyframes expandDown {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`;


export const CollapsibleSection = memo<CollapsibleSectionProps>(
  ({
    title,
    children,
    defaultOpen = true,
    isOpen: controlledIsOpen,
    onToggle,
    badge,
    className = '',
    containerRef,
  }) => {
    
    React.useEffect(() => {}, []);

    
    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
    const isControlled = controlledIsOpen !== undefined;
    const isOpen = isControlled ? controlledIsOpen : uncontrolledOpen;

    const handleToggle = useCallback(() => {
      const newOpen = !isOpen;
      if (!isControlled) {
        setUncontrolledOpen(newOpen);
      }
      onToggle?.(newOpen);
    }, [isOpen, isControlled, onToggle]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleToggle();
        }
      },
      [handleToggle]
    );

    return (
      <div
        className={`journalit-collapsible-section ${className}`}
        ref={containerRef}
      >
        <button
          className={`journalit-collapsible-header ${badge && badge > 0 ? 'has-active-filters' : ''}`}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          aria-expanded={isOpen}
          type="button"
        >
          <div className="journalit-collapsible-header-left">
            <span className="journalit-collapsible-title">{title}</span>
            {badge !== undefined && badge > 0 && (
              <span
                className="journalit-collapsible-badge"
                aria-label={t('shared.collapsible.active-filters', {
                  count: String(badge),
                })}
              >
                {badge}
              </span>
            )}
          </div>
          <span
            className={`journalit-collapsible-chevron ${isOpen ? 'open' : ''}`}
          >
            <ChevronDown size={16} />
          </span>
        </button>
        {isOpen && (
          <div className="journalit-collapsible-content">{children}</div>
        )}
      </div>
    );
  }
);

CollapsibleSection.displayName = 'CollapsibleSection';

export {};
