

import React, { useLayoutEffect, useRef, useState } from 'react';
import { cssVars } from '../../styles/inlineStylePolicy';

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  className?: string;
  groupRole?: 'group' | 'radiogroup';
  ariaLabel?: string;
  ariaLabelledBy?: string;
  getOptionRef?: (
    value: T
  ) => ((element: HTMLButtonElement | null) => void) | undefined;
}

const sizeStyles = {
  small: {
    padding: '4px 10px',
    fontSize: '12px',
    gap: '2px',
    containerPadding: '2px',
    borderRadius: '4px',
  },
  medium: {
    padding: '6px 14px',
    fontSize: '13px',
    gap: '2px',
    containerPadding: '3px',
    borderRadius: '5px',
  },
  large: {
    padding: '8px 18px',
    fontSize: '14px',
    gap: '3px',
    containerPadding: '4px',
    borderRadius: '6px',
  },
};

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  size = 'medium',
  fullWidth = false,
  className = '',
  groupRole = 'group',
  ariaLabel,
  ariaLabelledBy,
  getOptionRef,
}: SegmentedControlProps<T>): React.ReactElement {
  const styles = sizeStyles[size];
  const containerRef = useRef<HTMLDivElement>(null);
  const [thumb, setThumb] = useState<{ left: number; width: number } | null>(
    null
  );

  
  
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const measure = () => {
      const active = container.querySelector<HTMLButtonElement>(
        '.segmented-control-option.is-active'
      );
      if (!active) {
        setThumb(null);
        return;
      }

      const containerRect = container.getBoundingClientRect();
      const activeRect = active.getBoundingClientRect();
      setThumb((current) => {
        const next = {
          left: activeRect.left - containerRect.left - container.clientLeft,
          width: activeRect.width,
        };
        return current &&
          current.left === next.left &&
          current.width === next.width
          ? current
          : next;
      });
    };

    measure();
    
    if (typeof ResizeObserver === 'undefined') return;
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, [value, options, size, fullWidth]);

  const handleRadioKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    optionIndex: number
  ): void => {
    if (groupRole !== 'radiogroup') return;
    let nextIndex: number | undefined;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextIndex = (optionIndex + 1) % options.length;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextIndex = (optionIndex - 1 + options.length) % options.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = options.length - 1;
    }
    if (nextIndex === undefined) return;
    event.preventDefault();
    onChange(options[nextIndex].value);
    const radios =
      event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>(
        'button[role="radio"]'
      );
    radios?.[nextIndex]?.focus();
  };

  return (
    <div
      ref={containerRef}
      className={`journalit-segmented-control segmented-control ${className}`}
      role={groupRole}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      data-full-width={fullWidth ? 'true' : 'false'}
      style={cssVars({
        '--journalit-seg-gap': styles.gap,
        '--journalit-seg-container-padding': styles.containerPadding,
        '--journalit-seg-radius': styles.borderRadius,
        '--journalit-seg-option-padding': styles.padding,
        '--journalit-seg-option-font-size': styles.fontSize,
      })}
    >
      {thumb && (
        <span
          className="journalit-segmented-control-thumb"
          aria-hidden="true"
          style={cssVars({
            '--journalit-seg-thumb-left': `${thumb.left}px`,
            '--journalit-seg-thumb-width': `${thumb.width}px`,
          })}
        />
      )}
      {options.map((option, optionIndex) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            ref={getOptionRef?.(option.value)}
            onClick={() => onChange(option.value)}
            className={`journalit-segmented-control-option segmented-control-option ${isActive ? 'is-active' : ''}`}
            type="button"
            role={groupRole === 'radiogroup' ? 'radio' : undefined}
            aria-checked={groupRole === 'radiogroup' ? isActive : undefined}
            aria-pressed={groupRole === 'group' ? isActive : undefined}
            tabIndex={
              groupRole === 'radiogroup' ? (isActive ? 0 : -1) : undefined
            }
            onKeyDown={(event) => handleRadioKeyDown(event, optionIndex)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

SegmentedControl.displayName = 'SegmentedControl';
