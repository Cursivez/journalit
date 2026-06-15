

import React, { useMemo } from 'react';
import { AccountCard } from './AccountCard';
import { VirtualizedAccountList } from './VirtualizedAccountList';
import { formatAccountType, getDisplayAccountTypes } from './utils';
import { AccountSectionProps, AccountSectionsProps } from './types';

const EMPTY_EXCLUDED_TYPES: string[] = [];
import { AccountTypeHeader } from './AccountTypeHeader';
import { EmptyState } from '../../shared/EmptyState';
import { OptionType } from '../../../services/options/CustomOptionsService';
import { t } from '../../../lang/helpers';


const AccountSectionComponent: React.FC<AccountSectionProps> = ({
  type,
  accounts,
  openAccount,
  totalAUM = 0,
  excludedTypes = EMPTY_EXCLUDED_TYPES,
}) => {
  
  const sortedAccounts = useMemo(
    () => [...accounts].sort((a, b) => b.currentBalance - a.currentBalance),
    [accounts]
  );

  
  const useVirtualScrolling = sortedAccounts.length > 50;

  
  const isExcludedFromStats = excludedTypes.includes(type.toLowerCase());

  return (
    <div className="account-section">
      <AccountTypeHeader
        type={type}
        accounts={sortedAccounts}
        totalAUM={totalAUM}
        isExcludedFromStats={isExcludedFromStats}
      />
      {sortedAccounts.length === 0 ? (
        <div className="account-section-content">
          <EmptyState
            message={t('account-dashboard.section.empty', {
              type: formatAccountType(type),
            })}
            subMessage={t('account-dashboard.section.empty-sub')}
            iconSize={40}
          />
        </div>
      ) : useVirtualScrolling ? (
        <div className="account-section-content">
          <VirtualizedAccountList
            accounts={sortedAccounts}
            openAccount={openAccount}
            containerHeight={600}
            itemHeight={380} 
            minColumnWidth={300} 
          />
        </div>
      ) : (
        <div className="account-cards">
          {sortedAccounts.map((account) => (
            <AccountCard
              key={account.id}
              account={account}
              onClick={() => void openAccount(account.name, account)}
            />
          ))}
        </div>
      )}
    </div>
  );
};


const AccountSection = React.memo(AccountSectionComponent);


const AccountSectionsComponent: React.FC<AccountSectionsProps> = ({
  accountsByType,
  openAccount,
  plugin: passedPlugin,
  refreshTrigger = 0,
  totalAUM = 0,
  excludedTypes = EMPTY_EXCLUDED_TYPES,
}) => {
  
  const plugin = passedPlugin;

  
  const accountTypesToDisplay = useMemo(() => {
    if (refreshTrigger < 0) {
      return [];
    }

    const configuredOrder: string[] | undefined =
      plugin?.settings?.account?.accountTypeOrder;
    const customTypes: string[] =
      plugin?.optionsService?.getOptions?.(OptionType.ACCOUNT_TYPE) || [];

    return getDisplayAccountTypes(accountsByType, configuredOrder, customTypes);
  }, [accountsByType, plugin, refreshTrigger]);

  return (
    <div className="account-sections">
      {accountTypesToDisplay.map((type) => (
        <AccountSection
          key={type}
          type={type}
          accounts={accountsByType[type] || []}
          openAccount={openAccount}
          totalAUM={totalAUM}
          excludedTypes={excludedTypes}
        />
      ))}
    </div>
  );
};


export const AccountSections = React.memo(AccountSectionsComponent);
