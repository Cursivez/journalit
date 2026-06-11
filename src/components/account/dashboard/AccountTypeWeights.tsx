

import React, { useMemo } from 'react';
import { AccountData } from '../../../services/account/types';
import { AccountTypeWeightBar } from './AccountTypeWeightBar';
import { calculateAccountTypeWeights } from './weightUtils';


const EMPTY_EXCLUDED_TYPES: string[] = [];

interface AccountTypeWeightsProps {
  accounts: AccountData[]; 
  accountsByType: Record<string, AccountData[]>; 
  accountTypesToDisplay: string[]; 
  totalAUM: number; 
  excludedTypes?: string[]; 
  className?: string; 
  showLegend?: boolean; 
}


export const AccountTypeWeights: React.FC<AccountTypeWeightsProps> = ({
  accounts,
  accountsByType,
  accountTypesToDisplay,
  totalAUM,
  excludedTypes = EMPTY_EXCLUDED_TYPES,
  className = '',
  showLegend = true,
}) => {
  
  const weightData = useMemo(() => {
    return calculateAccountTypeWeights(
      accounts,
      accountsByType,
      accountTypesToDisplay,
      totalAUM,
      excludedTypes
    );
  }, [
    accounts,
    accountsByType,
    accountTypesToDisplay,
    totalAUM,
    excludedTypes,
  ]);

  
  if (!weightData || weightData.length === 0 || totalAUM === 0) {
    return null;
  }

  return (
    <div className={`account-type-weights ${className}`}>
      
      <AccountTypeWeightBar
        accounts={accounts}
        accountsByType={accountsByType}
        accountTypesToDisplay={accountTypesToDisplay}
        totalAUM={totalAUM}
        excludedTypes={excludedTypes}
        showLegend={showLegend}
      />
    </div>
  );
};

export {};
