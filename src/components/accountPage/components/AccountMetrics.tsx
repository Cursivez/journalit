

import React from 'react';
import { useAccountPageData } from '../context/AccountPageDataContext';
import { useCurrency } from '../../../contexts/CurrencyContext';
import { formatPnLWithCurrency } from '../../../utils/currencyAggregation';
import { useDisplayFormatter } from '../../../hooks/useDisplayPolicy';
import { t } from '../../../lang/helpers';
import { Tooltip } from '../../shared';
import { useGuideTarget } from '../../../guides/GuideRuntimeLayer';
import { ACCOUNT_PAGE_METRICS_SECTION_TARGET_ID } from '../../../guides/accountPageGuideIds';


export const AccountMetrics: React.FC = () => {
  const registerMetricsSectionTarget = useGuideTarget(
    ACCOUNT_PAGE_METRICS_SECTION_TARGET_ID
  );
  const {
    accountPageData,
    getMetrics,
    getFilteredTrades: _getFilteredTrades,
  } = useAccountPageData();
  const { currency: globalCurrency } = useCurrency();

  const metrics = getMetrics();
  const { formatValue, shouldMask } = useDisplayFormatter();
  const isPnlMasked = shouldMask('pnl');
  const isPercentageMasked = shouldMask('percentage');
  const isMetricMasked = shouldMask('metric');
  const isFeeMasked = shouldMask('fee');

  if (!metrics) {
    return null;
  }

  
  const effectiveCurrency = (metrics.conversionBaseCurrency ||
    accountPageData?.account.currency ||
    globalCurrency) as typeof globalCurrency;

  const getMetricClass = (value: number): string => {
    if (value > 0) return 'positive';
    if (value < 0) return 'negative';
    return 'neutral';
  };

  return (
    <div className="account-metrics" ref={registerMetricsSectionTarget}>
      <div className="metrics-grid">
        
        <div className="metric-card">
          <span className="metric-label">
            {t('dashboard.metrics.numTrades')}
          </span>
          <span className="metric-value">{metrics.totalTrades}</span>
        </div>

        
        <div className="metric-card">
          <span className="metric-label">{t('dashboard.metrics.winRate')}</span>
          <span
            className={`metric-value ${isPercentageMasked ? '' : getMetricClass(metrics.winRate - 50)}`}
          >
            {formatValue({
              kind: 'percentage',
              value: metrics.winRate,
              precision: 1,
            })}
          </span>
        </div>

        
        <div className="metric-card">
          <span className="metric-label metric-label--with-icon">
            {t('dashboard.metrics.netPnL')}
            {metrics.isMultiCurrency &&
              metrics.convertedTotalPnL !== undefined && (
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
                      <div>
                        {t('dashboard.conversion.rates', {
                          date: metrics.conversionRateDate || '',
                        })}
                      </div>
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
                              currencies:
                                metrics.unconvertedCurrencies.join(', '),
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
              )}
          </span>
          <span
            className={`metric-value ${isPnlMasked ? '' : getMetricClass(metrics.totalPnL)}`}
          >
            {isPnlMasked
              ? formatValue({
                  kind: 'pnl',
                  value: metrics.totalPnL,
                  currencyCode: effectiveCurrency,
                })
              : metrics.isMultiCurrency &&
                  metrics.convertedTotalPnL !== undefined
                ? 
                  formatPnLWithCurrency(
                    metrics.convertedTotalPnL,
                    metrics.conversionBaseCurrency || 'USD',
                    false
                  )
                : metrics.isMultiCurrency && metrics.pnlByCurrency
                  ? 
                    Object.entries(metrics.pnlByCurrency)
                      .sort(([a], [b]) => a.localeCompare(b))
                      .map(([curr, pnl], idx, arr) => (
                        <React.Fragment key={curr}>
                          {formatPnLWithCurrency(pnl, curr, false)}
                          {idx < arr.length - 1 && <br />}
                        </React.Fragment>
                      ))
                  : 
                    formatPnLWithCurrency(
                      metrics.totalPnL,
                      effectiveCurrency,
                      false
                    )}
          </span>
        </div>

        
        <div className="metric-card">
          <span className="metric-label">
            {t('dashboard.metrics.profitFactor')}
          </span>
          <span
            className={`metric-value ${isMetricMasked ? '' : getMetricClass(metrics.profitFactor - 1)}`}
          >
            {metrics.profitFactor === Infinity && !isMetricMasked
              ? '∞'
              : formatValue({
                  kind: 'metric',
                  value: metrics.profitFactor,
                  precision: 2,
                })}
          </span>
        </div>

        
        <div className="metric-card">
          <span className="metric-label">{t('dashboard.metrics.avgWin')}</span>
          <span className={`metric-value ${isPnlMasked ? '' : 'positive'}`}>
            {formatValue({
              kind: 'pnl',
              value: metrics.avgWin,
              currencyCode: effectiveCurrency,
              rMultiple: metrics.avgWinRMultiple,
            })}
          </span>
        </div>

        
        <div className="metric-card">
          <span className="metric-label">{t('dashboard.metrics.avgLoss')}</span>
          <span className={`metric-value ${isPnlMasked ? '' : 'negative'}`}>
            {formatValue({
              kind: 'pnl',
              value: Math.abs(metrics.avgLoss),
              currencyCode: effectiveCurrency,
              rMultiple:
                metrics.avgLossRMultiple !== undefined
                  ? -Math.abs(metrics.avgLossRMultiple)
                  : undefined,
            })}
          </span>
        </div>

        
        <div className="metric-card">
          <span className="metric-label">
            {t('dashboard.metrics.numWinTrades')}
          </span>
          <span className={`metric-value ${isMetricMasked ? '' : 'positive'}`}>
            {formatValue({
              kind: 'metric',
              value: metrics.winningTrades,
              precision: 0,
            })}
          </span>
        </div>

        
        <div className="metric-card">
          <span className="metric-label">
            {t('dashboard.metrics.numLossTrades')}
          </span>
          <span className={`metric-value ${isMetricMasked ? '' : 'negative'}`}>
            {formatValue({
              kind: 'metric',
              value: metrics.losingTrades,
              precision: 0,
            })}
          </span>
        </div>

        
        <div className="metric-card">
          <span className="metric-label">
            {t('dashboard.metrics.totalCommission')}
          </span>
          <span className={`metric-value ${isFeeMasked ? '' : 'negative'}`}>
            {formatValue({
              kind: 'fee',
              value: metrics.totalCommission,
              currencyCode: effectiveCurrency,
            })}
          </span>
        </div>

        
        <div className="metric-card">
          <span className="metric-label">
            {t('dashboard.metrics.totalFees')}
          </span>
          <span className={`metric-value ${isFeeMasked ? '' : 'negative'}`}>
            {formatValue({
              kind: 'fee',
              value: metrics.totalFees,
              currencyCode: effectiveCurrency,
            })}
          </span>
        </div>
      </div>
    </div>
  );
};
