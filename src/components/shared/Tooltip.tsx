

import React, { useState, useRef, useEffect, useCallback, useId } from 'react';
import { createPortal } from 'react-dom';
import { cssVars } from '../../styles/inlineStylePolicy';
import { mergeClassNames } from '../../utils/classNames';
import { useDisclosureEscape } from './disclosureEscape';
import {
  calculateTooltipPosition,
  type TooltipPosition,
} from './tooltipPosition';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  triggerClassName?: string;
  delay?: number;
  preferredPosition?: TooltipPosition;
  
  block?: boolean;
  instantHide?: boolean;
  disabled?: boolean;
  
  disclosureLabel?: string;
  
  ariaDescribedBy?: string;
}

export const Tooltip = React.memo<TooltipProps>(
  ({
    content,
    children,
    className = '',
    triggerClassName = '',
    delay = 300,
    preferredPosition = 'auto',
    block = false,
    instantHide = false,
    disabled = false,
    disclosureLabel,
    ariaDescribedBy,
  }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ top: -9999, left: -9999 });
    const [isMounted, setIsMounted] = useState(false);
    const lastMousePosition = useRef({ x: 0, y: 0 });
    const rafRef = useRef<number | null>(null);
    const timeoutRef = useRef<number | null>(null);
    const unmountTimeoutRef = useRef<number | null>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLElement | null>(null);
    const setTriggerRef = useCallback((element: HTMLElement | null) => {
      triggerRef.current = element;
    }, []);
    const tooltipId = useId();
    const disclosureLabelId = `${tooltipId}-label`;

    const calculatePosition = useCallback(() => {
      if (!triggerRef.current || !tooltipRef.current) return;

      setPosition(
        calculateTooltipPosition({
          triggerRect: triggerRef.current.getBoundingClientRect(),
          tooltipRect: tooltipRef.current.getBoundingClientRect(),
          preferredPosition,
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
        })
      );
    }, [preferredPosition]);

    const scheduleShowTooltip = useCallback(() => {
      if (disabled) return;

      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
      }
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      if (unmountTimeoutRef.current) {
        window.clearTimeout(unmountTimeoutRef.current);
        unmountTimeoutRef.current = null;
      }

      timeoutRef.current = window.setTimeout(() => {
        setIsVisible(true);
        setIsMounted(true);
      }, delay);
    }, [delay, disabled]);

    const showTooltip = useCallback(
      (event: React.MouseEvent) => {
        if (disabled) return;

        lastMousePosition.current = {
          x: event.clientX,
          y: event.clientY,
        };
        scheduleShowTooltip();
      },
      [disabled, scheduleShowTooltip]
    );

    const hideTooltip = useCallback(() => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      setIsVisible(false);
      if (instantHide) {
        setIsMounted(false);
        return;
      }
      
      unmountTimeoutRef.current = window.setTimeout(() => {
        setIsMounted(false);
        unmountTimeoutRef.current = null;
      }, 200);
    }, [instantHide]);

    useDisclosureEscape({
      active: Boolean(disclosureLabel) && isVisible,
      onEscape: hideTooltip,
    });

    useEffect(() => {
      if (isVisible && isMounted) {
        
        rafRef.current = window.requestAnimationFrame(() => {
          calculatePosition();
        });
      }
    }, [isVisible, isMounted, calculatePosition]);

    useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          window.clearTimeout(timeoutRef.current);
        }
        if (rafRef.current) {
          window.cancelAnimationFrame(rafRef.current);
        }
        if (unmountTimeoutRef.current) {
          window.clearTimeout(unmountTimeoutRef.current);
        }
      };
    }, []);

    
    const handleMouseMove = useCallback(
      (e: React.MouseEvent) => {
        
        if (
          isVisible &&
          (Math.abs(e.clientX - lastMousePosition.current.x) > 5 ||
            Math.abs(e.clientY - lastMousePosition.current.y) > 5)
        ) {
          lastMousePosition.current = { x: e.clientX, y: e.clientY };
          
          if (rafRef.current) {
            window.cancelAnimationFrame(rafRef.current);
          }
          rafRef.current = window.requestAnimationFrame(() => {
            calculatePosition();
          });
        }
      },
      [isVisible, calculatePosition]
    );

    const handleDisclosureClick = useCallback(
      (event: React.MouseEvent) => {
        if (!disclosureLabel) return;
        event.preventDefault();
        event.stopPropagation();
        if (isVisible) hideTooltip();
        else scheduleShowTooltip();
      },
      [disclosureLabel, hideTooltip, isVisible, scheduleShowTooltip]
    );

    const handleDisclosureKeyDown = useCallback(
      (event: React.KeyboardEvent) => {
        if (!disclosureLabel) return;
        event.stopPropagation();
        if (event.key === 'Escape') {
          hideTooltip();
          return;
        }
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        if (isVisible) hideTooltip();
        else scheduleShowTooltip();
      },
      [disclosureLabel, hideTooltip, isVisible, scheduleShowTooltip]
    );

    return (
      <>
        {disclosureLabel ? (
          <>
            <span
              id={disclosureLabelId}
              aria-hidden="true"
              className="journalit-tooltip__sr-only"
            >
              {disclosureLabel}
            </span>
            <button
              type="button"
              ref={setTriggerRef}
              aria-controls={tooltipId}
              aria-expanded={isVisible}
              aria-labelledby={disclosureLabelId}
              aria-describedby={ariaDescribedBy}
              onClick={handleDisclosureClick}
              onKeyDown={handleDisclosureKeyDown}
              onMouseEnter={showTooltip}
              onMouseLeave={hideTooltip}
              onMouseMove={handleMouseMove}
              onFocus={scheduleShowTooltip}
              onBlur={hideTooltip}
              className={mergeClassNames(
                'journalit-native-button journalit-native-button--unstyled',
                `tooltip-trigger ${block ? 'tooltip-trigger--block' : 'tooltip-trigger--inline'} ${triggerClassName}`.trim()
              )}
            >
              {children}
            </button>
          </>
        ) : (
          <span
            ref={setTriggerRef}
            onMouseEnter={showTooltip}
            onMouseLeave={hideTooltip}
            onMouseMove={handleMouseMove}
            onFocus={scheduleShowTooltip}
            onBlur={hideTooltip}
            className={`tooltip-trigger ${block ? 'tooltip-trigger--block' : 'tooltip-trigger--inline'} ${triggerClassName}`.trim()}
          >
            {children}
          </span>
        )}
        {isMounted &&
          createPortal(
            <div
              id={tooltipId}
              ref={tooltipRef}
              role="tooltip"
              className={`journalit-tooltip ${className} ${isVisible ? 'journalit-tooltip--visible' : ''}`}
              style={cssVars({
                '--journalit-tooltip-top': `${position.top}px`,
                '--journalit-tooltip-left': `${position.left}px`,
              })}
            >
              {content}
            </div>,
            window.activeDocument.body
          )}
      </>
    );
  }
);

Tooltip.displayName = 'Tooltip';
