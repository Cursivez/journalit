

import React from 'react';
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
  getOptionRef?: (
    value: T
  ) => ((element: HTMLButtonElement | null) => void) | undefined;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  size = 'medium',
  fullWidth = false,
  className = '',
  getOptionRef,
}: SegmentedControlProps<T>): React.ReactElement {
  const sizeStyles = {
    small: {
      padding: '4px 10px',
      fontSize: '12px',
      gap: '2px',
      containerPadding: '2px',
      borderRadius: '6px',
    },
    medium: {
      padding: '6px 14px',
      fontSize: '13px',
      gap: '2px',
      containerPadding: '3px',
      borderRadius: '8px',
    },
    large: {
      padding: '8px 18px',
      fontSize: '14px',
      gap: '3px',
      containerPadding: '4px',
      borderRadius: '10px',
    },
  };

  const styles = sizeStyles[size];

  return (
    <div
      className={`segmented-control ${className}`}
      data-full-width={fullWidth ? 'true' : 'false'}
      style={cssVars({
        '--journalit-seg-gap': styles.gap,
        '--journalit-seg-container-padding': styles.containerPadding,
        '--journalit-seg-radius': styles.borderRadius,
        '--journalit-seg-option-padding': styles.padding,
        '--journalit-seg-option-font-size': styles.fontSize,
      })}
    >
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            ref={getOptionRef?.(option.value)}
            onClick={() => onChange(option.value)}
            className={`segmented-control-option ${isActive ? 'is-active' : ''}`}
            type="button"
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

SegmentedControl.displayName = 'SegmentedControl';
