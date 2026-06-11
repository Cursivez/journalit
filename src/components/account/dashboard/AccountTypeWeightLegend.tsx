

import React from 'react';
import { AccountTypeWeightData } from './weightUtils';
import { t } from '../../../lang/helpers';
import { cssVars } from '../../../styles/inlineStylePolicy';
import { useDisplayFormatter } from '../../../hooks/useDisplayPolicy';


interface AccountTypeWeightLegendProps {
  weightData: AccountTypeWeightData[]; 
  className?: string; 
  dotSize?: number; 
  showPercentages?: boolean; 
  maxItemsPerRow?: number; 
}


const LegendItem: React.FC<{
  data: AccountTypeWeightData;
  dotSize: number;
  showPercentage: boolean;
}> = ({ data, dotSize, showPercentage }) => {
  const { formatValue } = useDisplayFormatter();
  const formattedPercent = formatValue({
    kind: 'percentage',
    value: data.aumWeightPercent,
    signed: false,
    precision: 1,
  });

  return (
    <div className="account-weight-legend-item">
      <div
        className="legend-dot"
        style={cssVars({
          '--journalit-account-weight-legend-dot-size': `${dotSize}px`,
          '--journalit-account-weight-legend-dot-color': data.color,
        })}
        aria-hidden="true"
      />
      <span className="legend-text">
        <span className="legend-type-name">{data.displayName}</span>
        {showPercentage && (
          <span className="legend-percentage">{formattedPercent}</span>
        )}
      </span>
    </div>
  );
};


export const AccountTypeWeightLegend: React.FC<
  AccountTypeWeightLegendProps
> = ({
  weightData,
  className = '',
  dotSize = 12,
  showPercentages = true,
  maxItemsPerRow: _maxItemsPerRow = 6,
}) => {
  const { formatValue } = useDisplayFormatter();

  
  if (!weightData || weightData.length === 0) {
    return null;
  }

  
  const orderedData = weightData;

  return (
    <div className={`account-weight-legend-container ${className}`}>
      <div
        className="account-weight-legend"
        role="list"
        aria-label={t('account.weight-legend.aria-label')}
      >
        {orderedData.map((data) => (
          <div
            key={data.type}
            role="listitem"
            aria-label={
              showPercentages
                ? t('account.weight-legend.item-aria-label', {
                    name: data.displayName,
                    percent: formatValue({
                      kind: 'percentage',
                      value: data.aumWeightPercent,
                      signed: false,
                      precision: 1,
                    }),
                  })
                : data.displayName
            }
          >
            <LegendItem
              data={data}
              dotSize={dotSize}
              showPercentage={showPercentages}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export {};
