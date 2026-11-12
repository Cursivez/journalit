import React from 'react';
import { useDisplayFormatter } from '../../hooks/useDisplayPolicy';
import { tPlural } from '../../lang/helpers';


export function formatSetupTradeCount(
  count: number,
  formatCount: (count: number) => string = String
): string {
  return tPlural('setups.view.trade-count', count, {
    count: formatCount(count),
  });
}

export const SetupTradeCount: React.FC<{ count: number }> = ({ count }) => {
  const { formatValue } = useDisplayFormatter();
  return (
    <>
      {formatSetupTradeCount(count, (value) =>
        formatValue({ kind: 'count', value, precision: 0 })
      )}
    </>
  );
};

SetupTradeCount.displayName = 'SetupTradeCount';
