

import React from 'react';
import { TransactionType } from '../../../services/account/types';
import { t } from '../../../lang/helpers';

interface AccountEventDescriptionFieldProps {
  label: string;
  hint: string;
  value: string;
  eventType: TransactionType;
  disabled: boolean;
  onChange: (description: string) => void;
}

export const AccountEventDescriptionField: React.FC<
  AccountEventDescriptionFieldProps
> = ({ label, hint, value, eventType, disabled, onChange }) => (
  <div className="setting-item">
    <div className="setting-item-info">
      <div className="setting-item-name">{label}</div>
      <div className="setting-item-description">{hint}</div>
    </div>
    <div className="setting-item-control">
      <input
        type="text"
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChange(e.target.value)
        }
        placeholder={
          eventType === TransactionType.DEPOSIT
            ? t('account.add-event.placeholder.deposit')
            : t('account.add-event.placeholder.withdrawal')
        }
        disabled={disabled}
      />
    </div>
  </div>
);
