

import React from 'react';
import { Check } from '../shared/icons/ObsidianIcon';

interface CheckboxProps {
  
  checked: boolean;
  
  onChange: (checked: boolean) => void;
  
  id?: string;
  
  ariaLabel?: string;
  
  disabled?: boolean;
  
  label?: string;
  
  className?: string;
}


const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  id,
  ariaLabel,
  disabled = false,
  label,
  className = '',
}) => {
  const toggleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled) {
      onChange(e.target.checked);
    }
  };

  const checkboxId =
    id || `checkbox-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div
      className={`jl-checkbox-wrapper ${className}`}
      data-disabled={disabled ? 'true' : 'false'}
    >
      <input
        type="checkbox"
        id={checkboxId}
        className="jl-checkbox-input"
        checked={checked}
        onChange={toggleCheckbox}
        aria-label={ariaLabel || label}
        disabled={disabled}
      />

      <label htmlFor={checkboxId} className="jl-checkbox-label">
        <div
          className="jl-checkbox-box"
          data-checked={checked ? 'true' : 'false'}
        >
          {checked && (
            <Check size={10} className="jl-checkbox-check" aria-hidden="true" />
          )}
        </div>

        {label && <span className="jl-checkbox-text">{label}</span>}
      </label>
    </div>
  );
};

export default Checkbox;
