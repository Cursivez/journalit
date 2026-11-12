

import React from 'react';
import { TransactionType } from '../../../services/account/types';
import { t } from '../../../lang/helpers';


export const PRIOR_PAYOUT_EVENT = 'prior-payout';
export type AccountEventType = TransactionType | typeof PRIOR_PAYOUT_EVENT;

function placeholder(eventType: AccountEventType): string {
  if (eventType === PRIOR_PAYOUT_EVENT) {
    return t('account.add-event.placeholder.prior-payout');
  }
  return eventType === TransactionType.DEPOSIT
    ? t('account.add-event.placeholder.deposit')
    : t('account.add-event.placeholder.withdrawal');
}

interface AccountEventDescriptionFieldProps {
  label: string;
  hint: string;
  value: string;
  eventType: AccountEventType;
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
        placeholder={placeholder(eventType)}
        disabled={disabled}
      />
    </div>
  </div>
);
