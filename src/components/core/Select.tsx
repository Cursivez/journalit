

import React, { useId } from 'react';
import { SelectProps } from './types';
import { DropdownSelect } from '../shared/DropdownSelect';
import { t } from '../../lang/helpers';

const EMPTY_SELECT_OPTIONS: SelectProps['options'] = [];


export const Select: React.FC<SelectProps> = ({
  className = '',
  id,
  label,
  options = EMPTY_SELECT_OPTIONS,
  value = '',
  error,
  helperText,
  disabled = false,
  placeholder,
  onChange,
  'aria-label': ariaLabel,
}) => {
  const uniqueId = useId();
  const selectId = id || `select-${uniqueId}`;
  const labelId = `label-${selectId}`;
  const helperId = `helper-${selectId}`;
  const errorId = `error-${selectId}`;

  return (
    <div className="selectContainer">
      {label && (
        <label id={labelId} htmlFor={selectId} className="label">
          {label}
        </label>
      )}

      <div className="selectWrapper">
        <DropdownSelect
          id={selectId}
          className={['journalit-select', className].filter(Boolean).join(' ')}
          value={value}
          options={options}
          onChange={(next) => void onChange?.(next)}
          ariaLabel={
            ariaLabel ?? label ?? placeholder ?? t('common.select-option')
          }
          ariaLabelledBy={label ? labelId : undefined}
          ariaDescribedBy={error ? errorId : helperText ? helperId : undefined}
          placeholder={placeholder ?? t('common.select-option')}
          disabled={disabled}
          invalid={Boolean(error)}
        />
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
