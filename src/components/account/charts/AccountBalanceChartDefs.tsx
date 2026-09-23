

import React from 'react';

const POSITIVE_BALANCE_COLOR = 'var(--chart-positive, #43a047)';
const NEGATIVE_BALANCE_COLOR = 'var(--chart-negative, #e53935)';

export const AccountBalanceChartDefs: React.FC<{
  balanceGradientId: string;
  balanceStrokeGradientId: string;
  balanceAreaTransitionOffset: number;
  balanceStrokeTransitionOffset: number;
  isBalanceMasked: boolean;
  isDrawdownMasked: boolean;
}> = ({
  balanceGradientId,
  balanceStrokeGradientId,
  balanceAreaTransitionOffset,
  balanceStrokeTransitionOffset,
  isBalanceMasked,
  isDrawdownMasked,
}) => {
  const positiveColor = isBalanceMasked
    ? 'var(--text-muted)'
    : POSITIVE_BALANCE_COLOR;
  const negativeColor = isBalanceMasked
    ? 'var(--text-muted)'
    : NEGATIVE_BALANCE_COLOR;

  return (
    <defs>
      <linearGradient id={balanceGradientId} x1="0" y1="0" x2="0" y2="1">
        {balanceAreaTransitionOffset <= 0.1 ? (
          <>
            <stop offset="0%" stopColor={negativeColor} stopOpacity={0.4} />
            <stop offset="100%" stopColor={negativeColor} stopOpacity={0.1} />
          </>
        ) : balanceAreaTransitionOffset >= 99.9 ? (
          <>
            <stop offset="0%" stopColor={positiveColor} stopOpacity={0.4} />
            <stop offset="100%" stopColor={positiveColor} stopOpacity={0.1} />
          </>
        ) : (
          <>
            <stop offset="0%" stopColor={positiveColor} stopOpacity={0.4} />
            <stop
              offset={`${balanceAreaTransitionOffset}%`}
              stopColor={positiveColor}
              stopOpacity={0.1}
            />
            <stop
              offset={`${balanceAreaTransitionOffset}%`}
              stopColor={negativeColor}
              stopOpacity={0.1}
            />
            <stop offset="100%" stopColor={negativeColor} stopOpacity={0.4} />
          </>
        )}
      </linearGradient>
      <linearGradient id={balanceStrokeGradientId} x1="0" y1="0" x2="0" y2="1">
        {balanceStrokeTransitionOffset <= 0.1 ? (
          <>
            <stop offset="0%" stopColor={negativeColor} />
            <stop offset="100%" stopColor={negativeColor} />
          </>
        ) : balanceStrokeTransitionOffset >= 99.9 ? (
          <>
            <stop offset="0%" stopColor={positiveColor} />
            <stop offset="100%" stopColor={positiveColor} />
          </>
        ) : (
          <>
            <stop offset="0%" stopColor={positiveColor} />
            <stop
              offset={`${Math.max(0.1, balanceStrokeTransitionOffset - 0.1)}%`}
              stopColor={positiveColor}
            />
            <stop
              offset={`${Math.min(99.9, balanceStrokeTransitionOffset + 0.1)}%`}
              stopColor={negativeColor}
            />
            <stop offset="100%" stopColor={negativeColor} />
          </>
        )}
      </linearGradient>
      <filter id="balanceShadow" height="120%">
        <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.1" />
      </filter>
      <linearGradient id="drawdownGradient" x1="0" y1="0" x2="0" y2="1">
        <stop
          offset="0%"
          stopColor={
            isDrawdownMasked ? 'var(--text-muted)' : 'var(--text-error)'
          }
          stopOpacity={0.2}
        />
        <stop
          offset="100%"
          stopColor={
            isDrawdownMasked ? 'var(--text-muted)' : 'var(--text-error)'
          }
          stopOpacity={0.5}
        />
      </linearGradient>
    </defs>
  );
};

AccountBalanceChartDefs.displayName = 'AccountBalanceChartDefs';
