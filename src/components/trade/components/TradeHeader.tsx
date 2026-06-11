

import React from 'react';
import { calculateEffectiveRMultiple } from '../../../utils';
import { useDisplayFormatter } from '../../../hooks/useDisplayPolicy';
import {
  hasRealizedStoredPnL,
  isTradeOpenWithContext,
} from '../../../utils/tradeStatusUtils';
import { useCurrency } from '../../../contexts/CurrencyContext';
import { usePlugin } from '../../../hooks/usePlugin';
import { t } from '../../../lang/helpers';
import { getTradeDirectionDisplayKind } from '../../../services/trade/core/TradeDirection';

interface TradeHeaderProps {
  instrument: string | undefined;
  direction: string | undefined;
  isProfit: boolean;
  isBreakeven?: boolean;
  pnl: number;
  percentChange: number;
  useDirectPnLInput?: boolean;
  directPnL?: number | null;
  isMissedTrade?: boolean;
  isBacktestTrade?: boolean;
  _originalPnlWasNull?: boolean;
  
  exitTime?: Date | string | null;
  exitPrice?: number | null;
  tradeStatus?: string;
  exits?: Array<{
    time?: Date | string | null;
    price?: number | null;
    size?: number | null;
  }>;
  entries?: Array<{
    time?: Date | string | null;
    price?: number | null;
    size?: number | null;
  }>;
  dividends?: Array<{ amount?: number | null }>;
  commission?: number | null;
  swap?: number | null;
  fees?: number | null;
  rebate?: number | null;
  
  assetType?: string;
  optionType?: 'call' | 'put';
  rMultiple?: number;
  displayRMultiples?: boolean;
  riskAmount?: number;
  
  currency?: string;
}

export const TradeHeader: React.FC<TradeHeaderProps> = ({
  instrument,
  direction,
  isProfit,
  isBreakeven,
  pnl,
  percentChange,
  useDirectPnLInput,
  directPnL,
  isMissedTrade,
  isBacktestTrade,
  _originalPnlWasNull,
  exitTime,
  exitPrice,
  tradeStatus,
  exits,
  entries,
  dividends,
  commission,
  swap,
  fees,
  rebate,
  assetType,
  optionType,
  rMultiple,
  displayRMultiples,
  riskAmount,
  currency: tradeCurrency,
}) => {
  const { currency: globalCurrency } = useCurrency();
  
  const currency = tradeCurrency || globalCurrency;
  const plugin = usePlugin();
  const { formatValue, shouldMask } = useDisplayFormatter();
  const isPnlMasked = shouldMask('pnl');
  const isReturnPercentMasked = shouldMask('returnPercent');

  
  
  const isOpen =
    tradeStatus === 'OPEN' ||
    isTradeOpenWithContext({
      useDirectPnLInput,
      exitTime,
      exitPrice, 
      tradeStatus,
      exits,
      entries,
      pnl: undefined, 
    });

  const directionDisplayKind = getTradeDirectionDisplayKind({
    direction,
    assetType,
    optionType,
  });
  const icon =
    directionDisplayKind === 'short' || directionDisplayKind === 'put'
      ? '▼'
      : '▲';

  
  const defaultRiskAmount = plugin?.settings?.trade?.defaultRiskAmount;

  
  const effectiveRMultiple = calculateEffectiveRMultiple(
    pnl,
    isOpen ? undefined : rMultiple,
    riskAmount,
    defaultRiskAmount
  );

  const formattedPrivacyAwarePnL = formatValue({
    kind: 'pnl',
    value: pnl,
    currencyCode: currency,
    rMultiple: effectiveRMultiple,
  });
  const privacyAwarePnLPrefix =
    !isPnlMasked &&
    !displayRMultiples &&
    pnl > 0 &&
    !formattedPrivacyAwarePnL.startsWith('+')
      ? '+'
      : '';

  
  const getStatusClass = () => {
    if (isOpen) return 'open';
    if (isPnlMasked) return 'privacy-masked';
    if (isBreakeven) return 'breakeven';
    return isProfit ? 'profit' : 'loss';
  };

  
  const getTextClass = () => {
    if (isPnlMasked) return 'journalit-privacy-mask';
    if (isBreakeven) return 'breakeven-text';
    return isProfit ? 'profit-text' : 'loss-text';
  };

  const statusClass = getStatusClass();
  const statusLabel = isOpen
    ? t('tradelog.status.open')
    : isPnlMasked
      ? t('tradelog.filter.closed')
      : isBreakeven
        ? t('tradelog.status.breakeven')
        : isProfit
          ? t('tradelog.status.win')
          : t('tradelog.status.loss');

  return (
    <div
      className={`trade-note-header ${statusClass}`}
      role="group"
      aria-label={t('trade.header.aria.status', { status: statusLabel })}
    >
      <div className="trade-instrument">
        <span className="trade-direction-icon">{icon}</span>
        {instrument || t('trade.header.unknown-instrument')}
        {isBacktestTrade && (
          <span className="backtest-trade-badge">
            {t('tradelog.status.backtest')}
          </span>
        )}
        {!isBacktestTrade && isMissedTrade && (
          <span className="missed-trade-badge">
            {t('tradelog.status.missed')}
          </span>
        )}
        {!isBacktestTrade && !isMissedTrade && isOpen && (
          <span className="open-trade-badge">{t('tradelog.status.open')}</span>
        )}
      </div>
      <div className="trade-header-actions">
        <div className="trade-pnl">
          {isOpen &&
          !isMissedTrade &&
          !isBacktestTrade &&
          !hasRealizedStoredPnL({
            pnl,
            _originalPnlWasNull,
            tradeStatus,
            useDirectPnLInput,
            directPnL,
            exits,
            dividends,
            commission,
            swap,
            fees,
            rebate,
          }) ? (
            <span className="open-text">{t('tradelog.status.open')}</span>
          ) : (
            <span className={getTextClass()}>
              {`${privacyAwarePnLPrefix}${formattedPrivacyAwarePnL}`}
              {!isOpen &&
                !useDirectPnLInput &&
                !isReturnPercentMasked &&
                ` (${formatValue({
                  kind: 'returnPercent',
                  value: percentChange,
                  precision: 2,
                  signed: false,
                })})`}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
