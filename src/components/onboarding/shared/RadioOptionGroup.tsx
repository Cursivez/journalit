

import React, { useEffect, useRef } from 'react';

export interface RadioOption<T = string> {
  
  value: T;
  
  label: string;
  
  description?: string;
  
  badge?: string;
  
  icon?: React.ReactNode;
}

interface RadioOptionGroupProps<T = string> {
  
  options: RadioOption<T>[];
  
  selectedValue?: T;
  
  onSelect: (value: T) => void;
  
  className?: string;
  
  variant?: 'default' | 'goal';
}


export const RadioOptionGroup = <T extends string = string>({
  options,
  selectedValue,
  onSelect,
  className = '',
  variant = 'default',
}: RadioOptionGroupProps<T>) => {
  const firstOptionRef = useRef<HTMLDivElement>(null);
  const containerClass = variant === 'goal' ? 'goal-options' : 'radio-options';
  const optionClass = variant === 'goal' ? 'goal-option' : 'radio-option';
  const radioClass = variant === 'goal' ? 'goal-radio' : 'option-radio';
  const radioInnerClass =
    variant === 'goal' ? 'goal-radio-inner' : 'radio-inner';
  const contentClass = variant === 'goal' ? 'goal-content' : 'option-content';

  useEffect(() => {
    firstOptionRef.current?.focus();
  }, []);

  return (
    <div className={`${containerClass} ${className}`}>
      {options.map((option, index) => (
        <div
          ref={index === 0 ? firstOptionRef : undefined}
          key={option.value}
          className={`${optionClass} ${selectedValue === option.value ? 'selected' : ''}`}
          onClick={() => onSelect(option.value)}
          role="button"
          tabIndex={0}
          onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
            if (e.key !== 'Enter' && e.key !== ' ') return;
            e.preventDefault();
            onSelect(option.value);
          }}
        >
          <div className={radioClass}>
            <div
              className={`${radioInnerClass} ${selectedValue === option.value ? 'selected' : ''}`}
            ></div>
          </div>

          <div className={contentClass}>
            {variant === 'goal' ? (
              <>
                <h3>
                  {option.icon && (
                    <span className="goal-icon">{option.icon}</span>
                  )}
                  {option.label}
                </h3>
                {option.description && <p>{option.description}</p>}
                {option.badge && (
                  <span className="goal-badge">{option.badge}</span>
                )}
              </>
            ) : (
              <>
                <span className="option-label">{option.label}</span>
                {option.description && (
                  <span className="option-description">
                    {option.description}
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
