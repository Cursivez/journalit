

import React from 'react';
import { useAccountPageData } from '../context/AccountPageDataContext';
import { useCurrency } from '../../../contexts/CurrencyContext';
import {
  type CurrencyCode,
  parseCuratedCurrencyCode,
} from '../../../utils/currencyConfig';
import type { AccountMetrics } from '../../../services/accountPage/types';
import {
  useDisplayFormatter,
  useDisplayPolicy,
} from '../../../hooks/useDisplayPolicy';
import { ConversionSourceLines } from '../../shared/display/CurrencyConversionInfo';
import { getRCoverageMessage } from '../../shared/display/RMultipleUnavailableHint';
import { HelpTooltipContent } from '../../shared/HelpTooltipContent';
import { Tooltip } from '../../shared/Tooltip';
import { t } from '../../../lang/helpers';
import {
  AccountStatCell,
  statTone,
  type MetricLayoutVars,
} from './AccountStatCell';

type FormatDisplayValue = ReturnType<typeof useDisplayFormatter>['formatValue'];

interface NetPnLDisplay {
  
  amount: number | undefined;
  value: React.ReactNode;
}

function resolveNetPnLDisplay({
  metrics,
  isPnlMasked,
  displayRMultiples,
  effectiveCurrency,
  formatValue,
}: {
  metrics: AccountMetrics;
  isPnlMasked: boolean;
  displayRMultiples: boolean;
  effectiveCurrency: CurrencyCode;
  formatValue: FormatDisplayValue;
}): NetPnLDisplay {
  const maskedOrSingleCurrency = formatValue({
    kind: 'pnl',
    value: metrics.totalPnL,
    rMultiple: metrics.totalPnLRMultiple,
    currencyCode: effectiveCurrency,
  });

  
  if (isPnlMasked || !metrics.isMultiCurrency || displayRMultiples) {
    return {
      
      amount:
        displayRMultiples && !isPnlMasked
          ? metrics.totalPnLRMultiple
          : metrics.totalPnL,
      value: maskedOrSingleCurrency,
    };
  }
  if (metrics.convertedTotalPnL !== undefined) {
    return {
      amount: metrics.convertedTotalPnL,
      value: formatValue({
        kind: 'pnl',
        value: metrics.convertedTotalPnL,
        currencyCode: parseCuratedCurrencyCode(
          metrics.conversionBaseCurrency || 'USD'
        ),
      }),
    };
  }
  if (metrics.pnlByCurrency) {
    return {
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
    };
  }
  return { amount: metrics.totalPnL, value: maskedOrSingleCurrency };
}

const RCoverageLabel: React.FC<{ warning: string }> = ({ warning }) => (
  <span className="journalit-account-stat-label-with-icon">
    {t('dashboard.metrics.netPnL')}
    <Tooltip
      content={
        <HelpTooltipContent
          title={t('dashboard.metrics.netPnL')}
          description={warning}
          example={t('common.r-missing.fix')}
        />
      }
      delay={200}
      
      
      disclosureLabel={`${t('dashboard.metrics.netPnL')}: ${warning}`}
      preferredPosition="bottom"
    >
      <span className="metric-label-info-icon" aria-hidden="true">
        ⓘ
      </span>
    </Tooltip>
  </span>
);

const ConversionLabel: React.FC<{ metrics: AccountMetrics }> = ({
  metrics,
}) => (
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
            brokerBaseCurrencyTradeCount={metrics.brokerBaseCurrencyTradeCount}
            manualFxRateTradeCount={metrics.manualFxRateTradeCount}
            conversionRateDate={metrics.conversionRateDate}
          />
          {metrics.partiallyConvertedCurrencies &&
            metrics.partiallyConvertedCurrencies.length > 0 && (
              <div className="account-metrics-conversion-warning">
                {t('dashboard.conversion.partial-warning', {
                  currencies: metrics.partiallyConvertedCurrencies.join(', '),
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
                    metrics.originalTradeCount! - metrics.convertedTradeCount!
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
);

export const AccountNetPnLStatCell: React.FC<{
  layoutVars?: MetricLayoutVars;
}> = ({ layoutVars }) => {
  const { accountPageData, getMetrics } = useAccountPageData();
  const { currency: globalCurrency } = useCurrency();
  const { formatValue, shouldMask } = useDisplayFormatter();
  const { displayRMultiples } = useDisplayPolicy();

  
  
  const metrics = getMetrics();
  if (!accountPageData || !metrics) {
    return null;
  }

  const { account } = accountPageData;
  const isPnlMasked = shouldMask('pnl');
  const effectiveCurrency = parseCuratedCurrencyCode(
    metrics.conversionBaseCurrency || account.currency || globalCurrency
  );

  const display = resolveNetPnLDisplay({
    metrics,
    isPnlMasked,
    displayRMultiples,
    effectiveCurrency,
    formatValue,
  });

  
  const rCoverageWarning =
    displayRMultiples && !isPnlMasked
      ? getRCoverageMessage(metrics.rMultipleTradeCount, metrics.totalTrades)
      : undefined;

  const label = rCoverageWarning ? (
    <RCoverageLabel warning={rCoverageWarning} />
  ) : metrics.isMultiCurrency && metrics.convertedTotalPnL !== undefined ? (
    <ConversionLabel metrics={metrics} />
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
