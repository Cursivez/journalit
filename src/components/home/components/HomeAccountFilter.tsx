

import React, { useMemo } from 'react';
import { t } from '../../../lang/helpers';
import { MultiSelectDropdownFilter } from '../../shared/MultiSelectDropdownFilter';

interface HomeAccountFilterProps {
  availableAccounts: string[];
  selectedAccounts: string[];
  explicitAllSelected: boolean;
  onChange: (
    accounts: string[],
    explicitAllSelected: boolean
  ) => void | Promise<void>;
}

export const HomeAccountFilter: React.FC<HomeAccountFilterProps> = React.memo(
  ({ availableAccounts, selectedAccounts, explicitAllSelected, onChange }) => {
    const normalizedAccounts = useMemo(
      () => [...new Set(availableAccounts.filter(Boolean))].sort(),
      [availableAccounts]
    );

    const accountSummary = useMemo(() => {
      if (selectedAccounts.length === 0 || explicitAllSelected) {
        return t('dashboard.filter.accounts.all');
      }

      if (selectedAccounts.length === 1) {
        return selectedAccounts[0];
      }

      return t('dashboard.filter.accounts.n-selected', {
        count: selectedAccounts.length.toString(),
      });
    }, [explicitAllSelected, selectedAccounts]);

    const visualSelectedAccounts = useMemo(() => {
      if (explicitAllSelected || selectedAccounts.length === 0) {
        return [];
      }

      return selectedAccounts.filter((account) =>
        normalizedAccounts.includes(account)
      );
    }, [explicitAllSelected, normalizedAccounts, selectedAccounts]);

    return (
      <MultiSelectDropdownFilter
        options={normalizedAccounts.map((account) => ({
          value: account,
          label: account,
        }))}
        selectedValues={visualSelectedAccounts}
        summary={accountSummary}
        emptyMessage={t('dashboard.filter.accounts.none-found')}
        selectAllLabel={t('dashboard.filter.accounts.select-all')}
        showSelectAll
        classNamePrefix="journalit-home-account-filter"
        onChange={(accounts) =>
          onChange(
            accounts,
            accounts.length === normalizedAccounts.length && accounts.length > 0
          )
        }
      />
    );
  }
);

HomeAccountFilter.displayName = 'HomeAccountFilter';
