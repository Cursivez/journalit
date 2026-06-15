

import React from 'react';
import { t } from '../../lang/helpers';

interface ToggleSwitchProps {
  
  checked: boolean;
  
  onChange: (checked: boolean) => void | Promise<void>;
  
  id?: string;
  
  ariaLabel?: string;
  
  disabled?: boolean;
}


const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  id,
  ariaLabel = t('ui.toggle-switch.aria-label'),
  disabled = false,
}) => {
  const toggleSwitch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled) {
      void onChange(e.target.checked);
    }
  };

  const toggleId = id || `toggle-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className={`toggle-switch-container ${disabled ? 'disabled' : ''}`}>
      <input
        type="checkbox"
        id={toggleId}
        className="toggle-switch-input"
        checked={checked}
        onChange={toggleSwitch}
        aria-label={ariaLabel}
        disabled={disabled}
      />
      <label
        htmlFor={toggleId}
        className="toggle-switch-label"
        aria-label={ariaLabel}
      >
        <span className="toggle-switch-button" />
      </label>
    </div>
  );
};

export default ToggleSwitch;
