

import React, { useMemo } from 'react';
import { t } from '../../../lang/helpers';
import { AccountData } from '../../../services/account/types';
import {
  AccountTypeWeightData,
  calculateAccountTypeWeights,
  filterSignificantSegments,
} from './weightUtils';
import { AccountTypeWeightLegend } from './AccountTypeWeightLegend';
import { cssVars } from '../../../styles/inlineStylePolicy';
import { useDisplayFormatter } from '../../../hooks/useDisplayPolicy';


const EMPTY_EXCLUDED_TYPES: string[] = [];

interface AccountTypeWeightBarProps {
  accounts: AccountData[]; 
  accountsByType: Record<string, AccountData[]>; 
  accountTypesToDisplay: string[]; 
  totalAUM: number; 
  excludedTypes?: string[]; 
  className?: string; 
  showLegend?: boolean; 
  minimumSegmentWidth?: number; 
}


const WeightBarSegment: React.FC<{
  data: AccountTypeWeightData;
  minimumWidth?: number;
}> = ({ data, minimumWidth = 2 }) => {
  const { shouldMask } = useDisplayFormatter();
  const isPercentageMasked = shouldMask('percentage');
  
  
  const segmentWidth = isPercentageMasked
    ? 1
    : Math.max(data.aumWeightPercent, minimumWidth);
  const ariaLabel = isPercentageMasked
    ? data.displayName
    : t('account-dashboard.weight-bar.segment-aria', {
        name: data.displayName,
        percent: data.aumWeightPercent.toFixed(1),
      });

  return (
    <div
      className="account-weight-segment"
      style={cssVars({
        '--journalit-account-weight-segment-ratio': `${segmentWidth}`,
        '--journalit-account-weight-segment-color': data.color,
      })}
      role="progressbar"
      aria-valuenow={isPercentageMasked ? undefined : data.aumWeightPercent}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={ariaLabel}
    />
  );
};


export const AccountTypeWeightBar: React.FC<AccountTypeWeightBarProps> = ({
  accounts,
  accountsByType,
  accountTypesToDisplay,
  totalAUM,
  excludedTypes = EMPTY_EXCLUDED_TYPES,
  className = '',
  showLegend = true,
  minimumSegmentWidth = 2,
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

  
  const { segments } = useMemo(() => {
    
    return filterSignificantSegments(weightData, 0); 
  }, [weightData]);

  
  if (segments.length === 0) {
    return null;
  }

  return (
    <div className={`account-weight-bar-container ${className}`}>
      <div
        className="account-weight-bar"
        role="progressbar"
        aria-label={t('account-dashboard.weight-bar.aria')}
      >
        {segments.map((segmentData) => (
          <WeightBarSegment
            key={segmentData.type}
            data={segmentData}
            minimumWidth={minimumSegmentWidth}
          />
        ))}
      </div>

      
      {showLegend && (
        <AccountTypeWeightLegend
          weightData={weightData}
          showPercentages={true}
        />
      )}
    </div>
  );
};

export {};
