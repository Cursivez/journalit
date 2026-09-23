

import React from 'react';





import { ReferenceLine } from 'recharts';
import { t } from '../../../lang/helpers';

interface AccountBalanceOffScaleLevelsProps {
  domain: [number, number];
  
  drawdownFloorValue?: number;
  drawdownFloorOffScaleBy?: number;
  profitTargetValue?: number;
  profitTargetOffScaleBy?: number;
  formatValue: (value: number) => string;
}

export const AccountBalanceOffScaleLevels = ({
  domain,
  drawdownFloorValue,
  drawdownFloorOffScaleBy,
  profitTargetValue,
  profitTargetOffScaleBy,
  formatValue,
}: AccountBalanceOffScaleLevelsProps): React.ReactElement => (
  <>
    {drawdownFloorOffScaleBy !== undefined &&
      drawdownFloorValue !== undefined && (
        <ReferenceLine
          y={domain[0]}
          stroke="var(--text-error)"
          strokeOpacity={0.9}
          strokeDasharray="5 5"
          strokeWidth={2}
          label={{
            value: t('account.balance-chart.drawdown-floor-off-scale', {
              value: formatValue(drawdownFloorValue),
              distance: formatValue(drawdownFloorOffScaleBy),
            }),
            fill: 'var(--text-error)',
            fontSize: 12,
            position: 'insideBottomLeft',
          }}
        />
      )}

    {profitTargetOffScaleBy !== undefined &&
      profitTargetValue !== undefined && (
        <ReferenceLine
          y={domain[1]}
          stroke="var(--text-success)"
          strokeOpacity={0.9}
          strokeDasharray="5 5"
          strokeWidth={2}
          label={{
            value: t('account.balance-chart.profit-target-off-scale', {
              value: formatValue(profitTargetValue),
              distance: formatValue(profitTargetOffScaleBy),
            }),
            fill: 'var(--text-success)',
            fontSize: 12,
            position: 'insideTopLeft',
          }}
        />
      )}
  </>
);

AccountBalanceOffScaleLevels.displayName = 'AccountBalanceOffScaleLevels';
