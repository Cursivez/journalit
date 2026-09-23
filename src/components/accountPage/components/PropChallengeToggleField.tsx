

import React, { useId } from 'react';
import ToggleSwitch from '../../ui/ToggleSwitch';
import { t } from '../../../lang/helpers';

export function PropChallengeToggleField({
  checked,
  disabled,
  onChange,
}: {
  checked: boolean;
  disabled: boolean;
  onChange: (checked: boolean) => void;
}) {
  const toggleId = useId();
  const label = t('account.challenge.toggle.label');

  return (
    <div className="journalit-account-challenge-toggle">
      <div className="journalit-account-challenge-toggle__text">
        <label
          className="journalit-account-challenge-toggle__label"
          htmlFor={toggleId}
        >
          {label}
        </label>
        <p className="journalit-account-challenge-toggle__help">
          {t('account.challenge.toggle.help')}
        </p>
      </div>
      <ToggleSwitch
        ariaLabel={label}
        checked={checked}
        disabled={disabled}
        id={toggleId}
        onChange={onChange}
      />
    </div>
  );
}
