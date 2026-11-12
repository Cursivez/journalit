

import React from 'react';
import { Users } from '../../../../components/shared/icons/ObsidianIcon';
import { t } from '../../../../lang/helpers';
import type { LocalAccountOption } from './types';
import { DropdownSelect } from '../../../../components/shared/DropdownSelect';

interface BrokerAccountCardProps {
  
  className?: string;
  
  title: string;
  
  headerTrailing?: React.ReactNode;
  
  contentClassName?: string;
  children: React.ReactNode;
}

export const BrokerAccountCard: React.FC<BrokerAccountCardProps> = ({
  className,
  title,
  headerTrailing,
  contentClassName,
  children,
}) => (
  <article
    className={`status-card journalit-broker-account-card${
      className ? ` ${className}` : ''
    }`}
  >
    <div className="status-card-header journalit-broker-account-card__header">
      <span className="journalit-broker-card-header__title">
        <Users size={20} />
        <span>{title}</span>
      </span>
      {headerTrailing}
    </div>
    <div
      className={`status-card-content${
        contentClassName ? ` ${contentClassName}` : ''
      }`}
    >
      {children}
    </div>
  </article>
);

BrokerAccountCard.displayName = 'BrokerAccountCard';

interface BrokerLocalAccountSelectProps {
  id: string;
  value: string;
  disabled: boolean;
  localAccounts: LocalAccountOption[];
  onChange: (localAccountId: string) => void;
}

export const BrokerLocalAccountSelect: React.FC<
  BrokerLocalAccountSelectProps
> = ({ id, value, disabled, localAccounts, onChange }) => (
  
  <DropdownSelect
    id={id}
    ariaLabel={t('trade-sync.import.account.local-account')}
    ariaLabelledBy={`${id}-label`}
    value={value}
    disabled={disabled}
    placeholder={t('account.link-modal.select-account')}
    options={localAccounts.map((localAccount) => ({
      value: localAccount.id,
      label: localAccount.name,
    }))}
    onChange={onChange}
  />
);

BrokerLocalAccountSelect.displayName = 'BrokerLocalAccountSelect';
