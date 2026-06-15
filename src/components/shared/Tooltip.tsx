

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { cssVars } from '../../styles/inlineStylePolicy';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  triggerClassName?: string;
  delay?: number;
  preferredPosition?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
  
  block?: boolean;
  instantHide?: boolean;
  disabled?: boolean;
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
  }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ top: -9999, left: -9999 });
    const [isMounted, setIsMounted] = useState(false);
    const lastMousePosition = useRef({ x: 0, y: 0 });
    const rafRef = useRef<number | null>(null);
    const timeoutRef = useRef<number | null>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);

    const calculatePosition = useCallback(() => {
      if (!triggerRef.current || !tooltipRef.current) return;

      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const gap = 8; 

      let top = 0;
      let left = 0;

      
      const isSmallTrigger = triggerRect.width < 50 && triggerRect.height < 50;
      const effectivePosition =
        isSmallTrigger && preferredPosition === 'auto'
          ? 'top'
          : preferredPosition;

      switch (effectivePosition) {
        case 'right':
          top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
          left = triggerRect.right + gap;
          
          if (left + tooltipRect.width > viewportWidth - 16) {
            left = triggerRect.left - tooltipRect.width - gap;
          }
          break;

        case 'left':
          top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
          left = triggerRect.left - tooltipRect.width - gap;
          
          if (left < 16) {
            left = triggerRect.right + gap;
          }
          break;

        case 'bottom':
          top = triggerRect.bottom + gap;
          left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
          break;

        case 'top':
          top = triggerRect.top - tooltipRect.height - gap;
          left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;

          
          if (top < 16) {
            top = triggerRect.bottom + gap;
          }
          break;

        default: 
          
          top = triggerRect.top - tooltipRect.height - gap;
          left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;

          
          if (top < 16) {
            top = triggerRect.bottom + gap;
          }
      }

      
      const margin = 16;
      if (left < margin) left = margin;
      if (left + tooltipRect.width > viewportWidth - margin) {
        left = viewportWidth - tooltipRect.width - margin;
      }
      if (top < margin) top = margin;
      if (top + tooltipRect.height > viewportHeight - margin) {
        top = viewportHeight - tooltipRect.height - margin;
      }

      setPosition({ top, left });
    }, [preferredPosition]);

    const showTooltip = useCallback(
      (e: React.MouseEvent) => {
        if (disabled) return;

        
        lastMousePosition.current = { x: e.clientX, y: e.clientY };

        
        if (rafRef.current) {
          window.cancelAnimationFrame(rafRef.current);
        }

        timeoutRef.current = window.setTimeout(() => {
          setIsVisible(true);
          setIsMounted(true);
        }, delay);
      },
      [delay, disabled]
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
      
      window.setTimeout(() => setIsMounted(false), 200);
    }, [instantHide]);

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

    return (
      <>
        <span
          ref={triggerRef}
          onMouseEnter={showTooltip}
          onMouseLeave={hideTooltip}
          onMouseMove={handleMouseMove}
          className={`tooltip-trigger ${block ? 'tooltip-trigger--block' : 'tooltip-trigger--inline'} ${triggerClassName}`.trim()}
        >
          {children}
        </span>
        {isMounted &&
          createPortal(
            <div
              ref={tooltipRef}
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
