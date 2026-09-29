

import React from 'react';
import { useDisplayPolicy } from '../../../hooks/useDisplayPolicy';
import { isRMultipleUnavailable } from '../../../services/display/DisplayPolicy';
import { t } from '../../../lang/helpers';
import { HelpTooltipContent } from '../HelpTooltipContent';
import { Tooltip } from '../Tooltip';


export const TradeRUnavailableMessage: React.FC = () => (
  <HelpTooltipContent
    title={t('common.r-missing.title')}
    description={t('common.r-missing.trade')}
    example={t('common.r-missing.fix')}
  />
);


export const TradeRUnavailableHint: React.FC<{
  value: number | null | undefined;
  rMultiple: number | null | undefined;
  children: React.ReactNode;
}> = ({ value, rMultiple, children }) => {
  const policy = useDisplayPolicy();
  if (!isRMultipleUnavailable({ kind: 'pnl', value, rMultiple }, policy)) {
    return <>{children}</>;
  }

  
  
  return (
    <Tooltip
      content={<TradeRUnavailableMessage />}
      delay={200}
      preferredPosition="top"
      disclosureLabel={`${t('common.r-missing.title')}: ${t('common.r-missing.trade')}`}
    >
      {children}
    </Tooltip>
  );
};


export const WithTradeRUnavailableNote: React.FC<{
  value: number | null | undefined;
  rMultiple: number | null | undefined;
  children: React.ReactNode;
}> = ({ value, rMultiple, children }) => {
  const policy = useDisplayPolicy();
  return (
    <>
      {children}
      {isRMultipleUnavailable({ kind: 'pnl', value, rMultiple }, policy) && (
        <div className="journalit-r-unavailable-note">
          <TradeRUnavailableMessage />
        </div>
      )}
    </>
  );
};


export const getRCoverageMessage = (
  tradesWithR: number,
  totalTrades: number
): string | undefined => {
  if (totalTrades === 0 || tradesWithR >= totalTrades) return undefined;
  return tradesWithR === 0
    ? t('common.r-coverage.none')
    : t('common.r-coverage.partial', {
        valid: String(tradesWithR),
        total: String(totalTrades),
      });
};
