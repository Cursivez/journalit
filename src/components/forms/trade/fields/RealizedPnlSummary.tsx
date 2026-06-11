import React from 'react';
import { formatPnL } from '../../../../utils';
import { t } from '../../../../lang/helpers';

export type RealizedPnlSummaryProps = {
  realizedPnL: number;
  closedSize: number;
  totalSize: number;
  pnlCurrency: string;
  displayRMultiples: boolean;
  pnlRMultiple?: number;
};

export function RealizedPnlSummary({
  realizedPnL,
  closedSize,
  totalSize,
  pnlCurrency,
  displayRMultiples,
  pnlRMultiple,
}: RealizedPnlSummaryProps) {
  return (
    <div className="calculatedValue">
      <span className="calculatedLabel">
        {t('form.field.realized-pnl')} ({closedSize}/{totalSize}{' '}
        {t('form.field.closed')})
      </span>
      <span
        className={`calculatedAmount ${realizedPnL > 0 ? 'positive' : realizedPnL < 0 ? 'negative' : 'neutral'}`}
      >
        {formatPnL(
          realizedPnL,
          true,
          pnlCurrency,
          displayRMultiples,
          pnlRMultiple
        )}
      </span>
    </div>
  );
}
