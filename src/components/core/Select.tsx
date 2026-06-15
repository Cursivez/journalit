

import React, { useId } from 'react';
import { SelectProps } from './types';

const EMPTY_SELECT_OPTIONS: SelectProps['options'] = [];
import { t } from '../../lang/helpers';


export const Select: React.FC<SelectProps> = ({
  className = '',
  id,
  label,
  options = EMPTY_SELECT_OPTIONS,
  error,
  helperText,
  disabled = false,
  size = 'md',
  placeholder,
  onChange,
  ref,
  ...rest
}) => {
  
  const uniqueId = useId();
  const selectId = id || `select-${uniqueId}`;

  
  const helperId = `helper-${selectId}`;
  const errorId = `error-${selectId}`;

  
  const selectClasses = [
    'select',
    size,
    error ? 'error' : '',
    className,
    'journalit-select', 
  ]
    .filter(Boolean)
    .join(' ');

  
  const selectOption = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      void onChange(e.target.value);
    }

    
    if (e.target) {
      e.target.setAttribute(
        'data-has-value',
        e.target.value ? 'true' : 'false'
      );
    }
  };

  return (
    <div className="selectContainer">
      {label && (
        <label htmlFor={selectId} className="label">
          {label}
        </label>
      )}

      <div className="selectWrapper">
        <select
          ref={ref}
          id={selectId}
          className={selectClasses}
          disabled={disabled}
          data-has-value={
            !!rest.value || !!rest.defaultValue ? 'true' : 'false'
          }
          aria-invalid={!!error}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          onChange={selectOption}
          {...rest}
        >
          
          {!rest.value && !rest.defaultValue && (
            <option value="" disabled className="select-placeholder">
              {placeholder ?? t('common.select-option')}
            </option>
          )}

          
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
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


Select.displayName = 'Select';
