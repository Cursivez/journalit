

import React, {
  useCallback,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from 'react';
import type { App } from 'obsidian';
import { t } from '../../../../lang/helpers';
import { FilterButton } from '../../FilterButton';
import { FilterMenuLayer } from './FilterMenuLayer';
import {
  type FilterMenuEntry,
  type FilterMenuGuideTour,
  countAppliedFilters,
  hasAppliedEntries,
} from './menuModel';

export interface FilterMenuTriggerState {
  onClick: () => void;
  isOpen: boolean;
  
  activeFilterCount: number;
}

interface CascadingFilterMenuProps {
  app: App;
  entries: FilterMenuEntry[];
  onReset: () => void;
  
  canReset?: boolean;
  title?: string;
  className?: string;
  
  onOpenChange?: (isOpen: boolean) => void;
  
  renderTrigger?: (trigger: FilterMenuTriggerState) => React.ReactNode;
  ariaLabelledBy?: string;
  
  guideTour?: FilterMenuGuideTour | null;
}

export const CascadingFilterMenu: React.FC<CascadingFilterMenuProps> = ({
  app,
  entries,
  onReset,
  canReset,
  title,
  className,
  onOpenChange,
  renderTrigger,
  ariaLabelledBy,
  guideTour = null,
}) => {
  const triggerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const isGuided = guideTour !== null;
  const activeFilterCount = countAppliedFilters(entries);

  const setOpen = useCallback(
    (next: boolean) => {
      setIsOpen(next);
      onOpenChange?.(next);
    },
    [onOpenChange]
  );

  const handleClose = useCallback(
    (restoreFocus: boolean) => {
      
      
      if (isGuided) return;
      setOpen(false);
      if (restoreFocus) {
        triggerRef.current?.querySelector<HTMLElement>('button')?.focus();
      }
    },
    [isGuided, setOpen]
  );

  
  
  const closeOnLeafChange = useEffectEvent(() => handleClose(false));
  useEffect(() => {
    if (!isOpen) return;
    const workspace = app.workspace;
    const onLeafChange = () => closeOnLeafChange();
    workspace.on('active-leaf-change', onLeafChange);
    return () => {
      workspace.off('active-leaf-change', onLeafChange);
    };
  }, [app, isOpen]);

  
  
  const wasGuidedRef = useRef(false);
  const syncWithTour = useEffectEvent((guided: boolean) => {
    const wasGuided = wasGuidedRef.current;
    wasGuidedRef.current = guided;
    if (guided === wasGuided || guided === isOpen) return;
    setOpen(guided);
  });
  useEffect(() => {
    syncWithTour(isGuided);
  }, [isGuided]);

  const handleTriggerClick = useCallback(() => {
    if (isOpen) {
      handleClose(false);
    } else {
      setOpen(true);
    }
  }, [handleClose, isOpen, setOpen]);

  return (
    <>
      <div ref={triggerRef} className="journalit-filter-menu-trigger">
        {renderTrigger ? (
          renderTrigger({
            onClick: handleTriggerClick,
            isOpen,
            activeFilterCount,
          })
        ) : (
          <FilterButton
            onClick={handleTriggerClick}
            className={className}
            activeFilterCount={activeFilterCount}
            ariaExpanded={isOpen}
            ariaHaspopup="menu"
            ariaLabelledBy={ariaLabelledBy}
          />
        )}
      </div>
      {isOpen && (
        <FilterMenuLayer
          entries={entries}
          title={title ?? t('filter.menu.title')}
          canReset={canReset ?? hasAppliedEntries(entries)}
          onReset={onReset}
          triggerRef={triggerRef}
          onClose={handleClose}
          guideTour={guideTour}
        />
      )}
    </>
  );
};
