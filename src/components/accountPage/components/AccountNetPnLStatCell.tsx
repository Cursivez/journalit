

import React from 'react';
import { useAccountPageData } from '../context/AccountPageDataContext';
import { useCurrency } from '../../../contexts/CurrencyContext';
import { parseCuratedCurrencyCode } from '../../../utils/currencyConfig';
import { useDisplayFormatter } from '../../../hooks/useDisplayPolicy';
import { ConversionSourceLines } from '../../shared/display/CurrencyConversionInfo';
import { Tooltip } from '../../shared/Tooltip';
import { t } from '../../../lang/helpers';
import {
  AccountStatCell,
  statTone,
  type MetricLayoutVars,
} from './AccountStatCell';

export const AccountNetPnLStatCell: React.FC<{
  layoutVars?: MetricLayoutVars;
}> = ({ layoutVars }) => {
  const { accountPageData, getMetrics } = useAccountPageData();
  const { currency: globalCurrency } = useCurrency();
  const { formatValue, shouldMask } = useDisplayFormatter();

  
  
  const metrics = getMetrics();
  if (!accountPageData || !metrics) {
    return null;
  }

  const { account } = accountPageData;
  const isPnlMasked = shouldMask('pnl');
  const effectiveCurrency = parseCuratedCurrencyCode(
    metrics.conversionBaseCurrency || account.currency || globalCurrency
  );

  const maskedOrSingleCurrency = formatValue({
    kind: 'pnl',
    value: metrics.totalPnL,
    currencyCode: effectiveCurrency,
  });

  const display =
    isPnlMasked || !metrics.isMultiCurrency
      ? { amount: metrics.totalPnL, value: maskedOrSingleCurrency }
      : metrics.convertedTotalPnL !== undefined
        ? {
            amount: metrics.convertedTotalPnL,
            value: formatValue({
              kind: 'pnl',
              value: metrics.convertedTotalPnL,
              currencyCode: parseCuratedCurrencyCode(
                metrics.conversionBaseCurrency || 'USD'
              ),
            }),
          }
        : metrics.pnlByCurrency
          ? {
              amount: undefined,
              value: Object.entries(metrics.pnlByCurrency)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([currencyCode, pnl], index, all) => (
                  <React.Fragment key={currencyCode}>
                    {formatValue({
                      kind: 'pnl',
                      value: pnl,
                      
                      
                      
                      
                      currencyCode,
                    })}
                    {index < all.length - 1 && <br />}
                  </React.Fragment>
                )),
            }
          : { amount: metrics.totalPnL, value: maskedOrSingleCurrency };

  const label =
    metrics.isMultiCurrency && metrics.convertedTotalPnL !== undefined ? (
      <span className="journalit-account-stat-label-with-icon">
        {t('dashboard.metrics.netPnL')}
        <Tooltip
          content={
            <div className="account-metrics-conversion-tooltip">
              <div className="account-metrics-conversion-tooltip-title">
                {t('dashboard.conversion.converted-total')}
              </div>
              <div>
                {t('dashboard.conversion.base', {
                  currency: metrics.conversionBaseCurrency || '',
                })}
              </div>
              <ConversionSourceLines
                brokerBaseCurrencyTradeCount={
                  metrics.brokerBaseCurrencyTradeCount
                }
                manualFxRateTradeCount={metrics.manualFxRateTradeCount}
                conversionRateDate={metrics.conversionRateDate}
              />
              {metrics.partiallyConvertedCurrencies &&
                metrics.partiallyConvertedCurrencies.length > 0 && (
                  <div className="account-metrics-conversion-warning">
                    {t('dashboard.conversion.partial-warning', {
                      currencies:
                        metrics.partiallyConvertedCurrencies.join(', '),
                    })}
                  </div>
                )}
              {metrics.unconvertedCurrencies &&
                metrics.unconvertedCurrencies.length > 0 && (
                  <div className="account-metrics-conversion-warning">
                    {t('dashboard.conversion.excluded-warning', {
                      converted: String(metrics.convertedTradeCount),
                      total: String(metrics.originalTradeCount),
                      excluded: String(
                        metrics.originalTradeCount! -
                          metrics.convertedTradeCount!
                      ),
                      currencies: metrics.unconvertedCurrencies.join(', '),
                    })}
                  </div>
                )}
            </div>
          }
          delay={200}
          preferredPosition="bottom"
        >
          <span className="metric-label-info-icon">ⓘ</span>
        </Tooltip>
      </span>
    ) : (
      t('dashboard.metrics.netPnL')
    );

  return (
    <AccountStatCell
      label={label}
      value={display.value}
      tone={
        display.amount === undefined
          ? 'neutral'
          : statTone(display.amount, isPnlMasked)
      }
      layoutVars={layoutVars}
    />
  );
};
