

import React, { useId } from 'react';
import { useSlidingThumb } from '../../hooks/useSlidingThumb';
import { cssVars } from '../../styles/inlineStylePolicy';

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
  
  disabled?: boolean;
  
  icon?: React.ReactNode;
  
  iconOnly?: boolean;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  
  disabled?: boolean;
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
    padding: '0 8px',
    fontSize: '12px',
    gap: '0',
    containerPadding: '2px',
    borderRadius: '6px',
  },
  medium: {
    padding: '0 10px',
    fontSize: 'var(--font-ui-small)',
    gap: '0',
    containerPadding: '2px',
    borderRadius: '6px',
  },
  large: {
    padding: '0 14px',
    fontSize: 'var(--font-ui-small)',
    gap: '0',
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
  disabled = false,
  className = '',
  groupRole = 'group',
  ariaLabel,
  ariaLabelledBy,
  getOptionRef,
}: SegmentedControlProps<T>): React.ReactElement {
  const styles = sizeStyles[size];
  const { containerRef, thumb } = useSlidingThumb(
    '.segmented-control-option.is-active',
    [value, options, size, fullWidth]
  );
  
  
  
  const generatedLabelId = useId();
  const hasHiddenLabel = Boolean(ariaLabel) && !ariaLabelledBy;
  const labelledBy =
    ariaLabelledBy ?? (hasHiddenLabel ? generatedLabelId : undefined);

  const handleRadioKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    optionIndex: number
  ): void => {
    if (groupRole !== 'radiogroup' || disabled) return;
    let nextIndex: number | undefined;
    
    
    
    
    
    let step = 1;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextIndex = (optionIndex + 1) % options.length;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      step = -1;
      nextIndex = (optionIndex - 1 + options.length) % options.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      step = -1;
      nextIndex = options.length - 1;
    }
    if (nextIndex === undefined) return;
    
    
    let guard = 0;
    while (options[nextIndex]?.disabled && guard < options.length) {
      nextIndex = (nextIndex + step + options.length) % options.length;
      guard += 1;
    }
    if (options[nextIndex]?.disabled || nextIndex === optionIndex) return;
    event.preventDefault();
    onChange(options[nextIndex].value);
    const radios =
      event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>(
        'button[role="radio"]'
      );
    radios?.[nextIndex]?.focus();
  };

  
  
  
  
  
  const selectedIndex = options.findIndex((option) => option.value === value);
  const firstEnabledIndex = options.findIndex((option) => !option.disabled);
  const tabStopIndex =
    selectedIndex >= 0 && !options[selectedIndex]?.disabled
      ? selectedIndex
      : firstEnabledIndex;

  return (
    <div
      ref={containerRef}
      className={`journalit-segmented-control segmented-control ${className}`}
      role={groupRole}
      aria-labelledby={labelledBy}
      data-full-width={fullWidth ? 'true' : 'false'}
      style={cssVars({
        '--journalit-seg-gap': styles.gap,
        '--journalit-seg-container-padding': styles.containerPadding,
        '--journalit-seg-radius': styles.borderRadius,
        '--journalit-seg-option-padding': styles.padding,
        '--journalit-seg-option-font-size': styles.fontSize,
      })}
    >
      {hasHiddenLabel && (
        <span className="journalit-sr-only" id={generatedLabelId}>
          {ariaLabel}
        </span>
      )}
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
            onClick={() => {
              
              
              
              
              if (groupRole === 'radiogroup' && isActive) return;
              onChange(option.value);
            }}
            className={`journalit-segmented-control-option segmented-control-option ${isActive ? 'is-active' : ''} ${option.icon ? 'has-icon' : ''}`}
            type="button"
            disabled={disabled || option.disabled}
            role={groupRole === 'radiogroup' ? 'radio' : undefined}
            aria-checked={groupRole === 'radiogroup' ? isActive : undefined}
            aria-pressed={groupRole === 'group' ? isActive : undefined}
            tabIndex={
              groupRole === 'radiogroup'
                ? optionIndex === tabStopIndex
                  ? 0
                  : -1
                : undefined
            }
            onKeyDown={(event) => handleRadioKeyDown(event, optionIndex)}
          >
            {option.icon}
            <span
              className={
                option.iconOnly
                  ? 'journalit-sr-only'
                  : 'journalit-button__label'
              }
            >
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

SegmentedControl.displayName = 'SegmentedControl';
