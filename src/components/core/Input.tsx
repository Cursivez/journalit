

import React, { useId, ChangeEvent } from 'react';
import { InputProps } from './types';


export const Input: React.FC<InputProps> = ({
  className = '',
  id,
  label,
  error,
  helperText,
  disabled = false,
  size = 'md',
  variant = 'default',
  loading = false,
  onChange,
  multiline = false,
  rows = 3,
  required = false,
  ref,
  ...rest
}) => {
  
  const uniqueId = useId();
  const inputId = id || `input-${uniqueId}`;

  
  const helperId = `helper-${inputId}`;
  const errorId = `error-${inputId}`;

  
  const isDefaultValue =
    typeof rest.value === 'string' &&
    (rest.value === '0' || rest.value === '0.00' || /^0\.0+$/.test(rest.value));

  
  const inputClasses = [
    'input',
    size,
    variant,
    error ? 'error' : '',
    isDefaultValue ? 'default-value' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const containerClasses = ['inputContainer', loading ? 'loading' : '']
    .filter(Boolean)
    .join(' ');

  
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      void onChange(e.target.value);
    }
  };

  
  const handleTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      void onChange(e.target.value);
    }
  };

  return (
    <div className={containerClasses}>
      {label && (
        <label htmlFor={inputId} className="label">
          {label}
          {required && <span className="required-indicator">*</span>}
        </label>
      )}

      <div className="inputWrapper">
        {multiline ? (
          <textarea
            id={inputId}
            className={inputClasses}
            disabled={disabled || loading}
            aria-invalid={!!error}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
            }
            rows={rows}
            onChange={handleTextareaChange}
            value={rest.value}
            placeholder={rest.placeholder}
          />
        ) : (
          <input
            ref={ref}
            id={inputId}
            className={inputClasses}
            disabled={disabled || loading}
            aria-invalid={!!error}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
            }
            onFocus={rest.onFocus}
            onBlur={rest.onBlur}
            onChange={handleInputChange}
            {...rest}
          />
        )}
      </div>

      {error && (
        <div id={errorId} className="errorMessage" role="alert">
          {error}
        </div>
      )}

      {!error && helperText && (
        <div id={helperId} className="helperText">
          {helperText}
        </div>
      )}
    </div>
  );
};


Input.displayName = 'Input';
