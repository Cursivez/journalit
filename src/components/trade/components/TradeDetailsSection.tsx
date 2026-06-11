

import React from 'react';
import { PartialTradeFrontmatter } from '../../../types/TradeFrontmatter';
import { EmptyState } from '../../shared/EmptyState';
import { useCurrency } from '../../../contexts/CurrencyContext';
import { getCurrencyConfig } from '../../../utils/currencyConfig';
import { TradeTemplate, TradeMetricType } from '../../../types/reviewV2';
import { getSizePrecision, roundToPrecision } from '../../forms/trade/utils';
import { t } from '../../../lang/helpers';
import { getTradeDirectionDisplayLabel } from '../../../utils/tradeDirectionDisplay';
import { useDisplayFormatter } from '../../../hooks/useDisplayPolicy';

interface TradeDetailsSectionProps {
  data: PartialTradeFrontmatter;
  metrics: {
    duration: string;
  };
  formatTime: (date: Date | string | undefined) => string;
  onEditClick?: () => void;
  config?: TradeTemplate['sections']['details'];
}

const getKeyedTextLines = (text: string) => {
  const occurrences = new Map<string, number>();
  return text.split('\n').map((line) => {
    const occurrence = (occurrences.get(line) ?? 0) + 1;
    occurrences.set(line, occurrence);
    return { line, key: `${line}-${occurrence}` };
  });
};

export const TradeDetailsSection: React.FC<TradeDetailsSectionProps> = ({
  data,
  metrics,
  formatTime,
  onEditClick,
  config,
}) => {
  const { currency: globalCurrency } = useCurrency();
  const currency = data.currency || globalCurrency;
  const { formatValue, shouldMask } = useDisplayFormatter();
  const isPriceMasked = shouldMask('price');
  const isPositionSizeMasked = shouldMask('positionSize');

  const currencyConfig = getCurrencyConfig(currency);

  const formatPriceNumber = (value: number | undefined | null): string => {
    if (value === undefined || value === null || isNaN(value)) return 'N/A';

    const absValue = Math.abs(value);

    let minimumFractionDigits = currencyConfig.decimalPlaces;
    let maximumFractionDigits = currencyConfig.decimalPlaces;

    if (currencyConfig.decimalPlaces > 0) {
      if (absValue === 0) {
        minimumFractionDigits = 0;
        maximumFractionDigits = 0;
      } else if (absValue < 10) {
        minimumFractionDigits = 4;
        maximumFractionDigits = 5;
      } else if (absValue < 100) {
        minimumFractionDigits = 3;
        maximumFractionDigits = 4;
      } else if (absValue >= 100) {
        if (absValue === Math.floor(absValue)) {
          minimumFractionDigits = 0;
          maximumFractionDigits = 0;
        }
      }
    }

    return value.toLocaleString(currencyConfig.locale, {
      minimumFractionDigits,
      maximumFractionDigits,
    });
  };

  const formatDisplayPrice = (value: number | undefined | null): string => {
    return isPriceMasked
      ? formatValue({ kind: 'price', value, currencyCode: currency })
      : formatPriceNumber(value);
  };

  const formatPositionSize = (
    value: number | undefined | null,
    assetType?: string
  ): string => {
    if (value === undefined || value === null || !Number.isFinite(value)) {
      return 'N/A';
    }

    const precision = getSizePrecision(assetType);
    const rounded = roundToPrecision(value, precision);

    return rounded.toLocaleString(currencyConfig.locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: precision,
    });
  };

  
  const allowedMetrics = config?.metrics || [
    'entry',
    'exit',
    'size',
    'duration',
    'pnl',
    'rMultiple',
  ];
  const showThesis = config?.showThesis !== false;

  
  const isMetricAllowed = (metric: TradeMetricType) =>
    allowedMetrics.includes(metric);

  return (
    <>
      
      <div className="trade-overview-section">
        
        <div className="trade-metrics-grid">
          {isMetricAllowed('entry') && (
            <div className="metric-card">
              <div className="metric-label">{t('trade.details.entry')}</div>
              <div
                className={`metric-value ${isPriceMasked ? 'journalit-privacy-mask' : ''}`}
              >
                {formatDisplayPrice(data.entryPrice)}
              </div>
              <div className="metric-subtitle">
                {formatTime(data.entryTime)}
              </div>
            </div>
          )}

          {isMetricAllowed('exit') && (
            <div className="metric-card">
              <div className="metric-label">{t('trade.details.exit')}</div>
              <div
                className={`metric-value ${isPriceMasked ? 'journalit-privacy-mask' : ''}`}
              >
                {formatDisplayPrice(data.exitPrice)}
              </div>
              <div className="metric-subtitle">{formatTime(data.exitTime)}</div>
            </div>
          )}

          {isMetricAllowed('size') && (
            <div className="metric-card">
              <div className="metric-label">{t('trade.details.size')}</div>
              <div
                className={`metric-value ${isPositionSizeMasked ? 'journalit-privacy-mask' : ''}`}
              >
                {isPositionSizeMasked
                  ? formatValue({
                      kind: 'positionSize',
                      value: data.positionSize,
                    })
                  : formatPositionSize(data.positionSize, data.assetType)}
              </div>
              <div className="metric-subtitle">
                {getTradeDirectionDisplayLabel(
                  {
                    direction: data.direction,
                    assetType: data.assetType,
                    optionType: data.optionType,
                  },
                  'N/A'
                )}
              </div>
            </div>
          )}

          {isMetricAllowed('duration') && (
            <div className="metric-card">
              <div className="metric-label">{t('trade.details.duration')}</div>
              <div className="metric-value">{metrics.duration}</div>
              <div className="metric-subtitle">&nbsp;</div>
            </div>
          )}
        </div>
      </div>

      
      <div className="trade-main-content">
        
        {showThesis && (
          <div className="thesis-section">
            <h4>{t('trade.details.thesis')}</h4>
            {data.thesis ? (
              <div className="thesis-content">
                {getKeyedTextLines(data.thesis).map((item, index, lines) => (
                  <React.Fragment key={item.key}>
                    {item.line}
                    {index < lines.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </div>
            ) : (
              <EmptyState
                message={t('trade.details.no-thesis')}
                subMessage={
                  onEditClick ? t('trade.details.add-thesis') : undefined
                }
                iconSize={32}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
};
