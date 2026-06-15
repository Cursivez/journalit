

import React, { useCallback, useEffect, useLayoutEffect } from 'react';
import { useOptimizedAccordion } from '../../hooks/useOptimizedAccordion';
import { cssVars } from '../../styles/inlineStylePolicy';
import { ChevronDown } from './icons/ObsidianIcon';

interface AccordionProps {
  title: string;
  defaultExpanded?: boolean;
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  onRemeasureContentChange?: (remeasureContent: () => void) => void;
  className?: string;
  children: React.ReactNode;
}

export const Accordion: React.FC<AccordionProps> = React.memo(
  ({
    title,
    defaultExpanded = false,
    expanded,
    onExpandedChange,
    onRemeasureContentChange,
    className = '',
    children,
  }) => {
    const isControlled = expanded !== undefined;
    const currentExpanded = isControlled ? expanded : defaultExpanded;

    const {
      isExpanded,
      toggleExpanded,
      remeasureContent,
      contentRef,
      containerRef,
      contentHeight,
    } = useOptimizedAccordion(currentExpanded, {
      duration: { open: 150, close: 150 },
      easing: 'ease-out',
      stagger: { opacity: 25 },
    });

    
    
    
    useLayoutEffect(() => {}, []);

    
    useEffect(() => {
      remeasureContent();
    }, [children, remeasureContent]);

    
    useEffect(() => {
      onRemeasureContentChange?.(remeasureContent);
    }, [onRemeasureContentChange, remeasureContent]);

    const toggleHandler = useCallback((): void => {
      const newExpanded = !isExpanded;

      if (isControlled && onExpandedChange) {
        onExpandedChange(newExpanded);
      } else {
        toggleExpanded();
      }
    }, [isExpanded, isControlled, onExpandedChange, toggleExpanded]);

    const customKeyHandler = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleHandler();
        }
      },
      [toggleHandler]
    );

    const heightPx = isExpanded ? contentHeight : 0;

    return (
      <div
        className={`journalit-settings-accordion ${className}`}
        aria-expanded={isExpanded}
        data-expanded={isExpanded ? 'true' : 'false'}
      >
        <button
          type="button"
          className="journalit-settings-accordion__header"
          onClick={toggleHandler}
          onKeyDown={customKeyHandler}
        >
          <span className="journalit-settings-accordion__chevron" aria-hidden>
            <ChevronDown size={16} />
          </span>
          <span className="journalit-settings-accordion__title">{title}</span>
        </button>

        <div
          ref={containerRef}
          className="journalit-settings-accordion__container"
          style={cssVars({ '--journalit-accordion-height': `${heightPx}px` })}
        >
          <div
            ref={contentRef}
            className="journalit-settings-accordion__content"
          >
            {children}
          </div>
        </div>
      </div>
    );
  }
);

Accordion.displayName = 'Accordion';
