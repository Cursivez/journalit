import React from 'react';
import { Info } from '../icons/ObsidianIcon';
import { Tooltip } from '../Tooltip';
import { useDisplayFormatter } from '../../../hooks/useDisplayPolicy';
import { t } from '../../../lang/helpers';
import { getEffectivePnL } from '../../../utils/tradeStatusUtils';

export interface ReviewCurrencyConversionMetadata {
  isMultiCurrency: boolean;
  conversionBaseCurrency?: string;
  conversionRateDate?: string;
  originalByCurrency?: Record<string, number>;
  convertedByCurrency?: Record<string, number>;
  unconvertedCurrencies?: string[];
  originalTradeCount?: number;
  convertedTradeCount?: number;
  brokerBaseCurrencyTradeCount?: number;
  unconvertedTrades?: CurrencyConversionTrade[];
}

export interface CurrencyConversionTrade {
  currency?: string;
  originalCurrency?: string;
  originalPnlBeforeConversion?: number | null;
  pnl?: number | null;
  brokerBaseCurrencyPnl?: number | null;
  brokerBaseCurrency?: string;
  brokerBaseCurrencyPnlSource?: string;
  isUnconvertedCurrency?: boolean;
  direction?: string;
}

interface CurrencyConversionInfoProps {
  metadata?: ReviewCurrencyConversionMetadata | null;
  trades?: CurrencyConversionTrade[];
}

interface CurrencyConversionMetricsLike {
  isMultiCurrency?: boolean;
  conversionBaseCurrency?: string;
  conversionRateDate?: string;
  netPnLByCurrency?: Record<string, number>;
  unconvertedCurrencies?: string[];
  originalTradeCount?: number;
  convertedTradeCount?: number;
  brokerBaseCurrencyTradeCount?: number;
}

export function buildCurrencyConversionMetadata(
  metrics?: CurrencyConversionMetricsLike | null
): ReviewCurrencyConversionMetadata | null {
  if (!metrics?.isMultiCurrency || !metrics.conversionBaseCurrency) {
    return null;
  }

  return {
    isMultiCurrency: true,
    conversionBaseCurrency: metrics.conversionBaseCurrency,
    conversionRateDate: metrics.conversionRateDate,
    originalByCurrency: metrics.netPnLByCurrency,
    unconvertedCurrencies: metrics.unconvertedCurrencies,
    originalTradeCount: metrics.originalTradeCount,
    convertedTradeCount: metrics.convertedTradeCount,
    brokerBaseCurrencyTradeCount: metrics.brokerBaseCurrencyTradeCount,
  };
}

export const CurrencyConversionInfo: React.FC<CurrencyConversionInfoProps> = ({
  metadata,
  trades,
}) => {
  if (!metadata?.isMultiCurrency || !metadata.conversionBaseCurrency) {
    return null;
  }

  const scopedOriginalByCurrency: Record<string, number> = {};
  const scopedConvertedByCurrency: Record<string, number> = {};

  for (const trade of trades || []) {
    const originalCurrency = trade.originalCurrency || trade.currency;
    if (!originalCurrency) continue;

    const originalPnlBeforeConversion =
      typeof trade.originalPnlBeforeConversion === 'number' &&
      Number.isFinite(trade.originalPnlBeforeConversion)
        ? trade.originalPnlBeforeConversion
        : getEffectivePnL(trade);

    scopedOriginalByCurrency[originalCurrency] =
      (scopedOriginalByCurrency[originalCurrency] || 0) +
      originalPnlBeforeConversion;
    if (!trade.isUnconvertedCurrency) {
      scopedConvertedByCurrency[originalCurrency] =
        (scopedConvertedByCurrency[originalCurrency] || 0) +
        getEffectivePnL(trade);
    }
  }

  const hasScopedTrades = trades !== undefined;
  const hasScopedConversionEntries =
    Object.keys(scopedOriginalByCurrency).length > 0 ||
    Object.keys(scopedConvertedByCurrency).length > 0;

  if (hasScopedTrades && !hasScopedConversionEntries) {
    return null;
  }

  const originalByCurrency = hasScopedTrades
    ? scopedOriginalByCurrency
    : metadata.originalByCurrency || {};
  const convertedByCurrency = hasScopedTrades
    ? scopedConvertedByCurrency
    : metadata.convertedByCurrency || {};

  const originalEntries = Object.entries(originalByCurrency).sort(([a], [b]) =>
    a.localeCompare(b)
  );
  const convertedEntries = Object.entries(convertedByCurrency).sort(
    ([a], [b]) => a.localeCompare(b)
  );
  const unconverted = hasScopedTrades
    ? (metadata.unconvertedCurrencies || []).filter((currency) =>
        Object.prototype.hasOwnProperty.call(originalByCurrency, currency)
      )
    : metadata.unconvertedCurrencies || [];
  const hasActualConversion =
    originalEntries.some(
      ([currency]) => currency !== metadata.conversionBaseCurrency
    ) || unconverted.length > 0;

  if (!hasActualConversion) {
    return null;
  }

  return (
    <CurrencyConversionInfoContent
      metadata={
        {
          ...metadata,
          brokerBaseCurrencyTradeCount: hasScopedTrades
            ? trades.filter(
                (trade) =>
                  typeof trade.brokerBaseCurrencyPnl === 'number' &&
                  Number.isFinite(trade.brokerBaseCurrencyPnl) &&
                  trade.brokerBaseCurrency === metadata.conversionBaseCurrency
              ).length
            : metadata.brokerBaseCurrencyTradeCount,
        } as ReviewCurrencyConversionMetadata & {
          conversionBaseCurrency: string;
        }
      }
      originalEntries={originalEntries}
      convertedEntries={convertedEntries}
      unconverted={unconverted}
    />
  );
};

interface CurrencyConversionInfoContentProps {
  metadata: ReviewCurrencyConversionMetadata & {
    conversionBaseCurrency: string;
  };
  originalEntries: Array<[string, number]>;
  convertedEntries: Array<[string, number]>;
  unconverted: string[];
}

const CurrencyConversionInfoContent: React.FC<
  CurrencyConversionInfoContentProps
> = ({ metadata, originalEntries, convertedEntries, unconverted }) => {
  const { formatValue } = useDisplayFormatter();

  const convertedEntriesToShow = convertedEntries.filter(
    ([currency]) => currency !== metadata.conversionBaseCurrency
  );

  const tooltip = (
    <div className="journalit-dashboard-metric-tooltip">
      <div className="journalit-dashboard-metric-tooltip__title">
        {t('dashboard.conversion.title', {
          currency: metadata.conversionBaseCurrency,
        })}
      </div>
      <div>
        {metadata.brokerBaseCurrencyTradeCount &&
        metadata.brokerBaseCurrencyTradeCount > 0
          ? t('dashboard.conversion.using-broker-pnl', {
              count: String(metadata.brokerBaseCurrencyTradeCount),
              tradeLabel:
                metadata.brokerBaseCurrencyTradeCount === 1
                  ? t('dashboard.conversion.trade-singular')
                  : t('dashboard.conversion.trade-plural'),
            })
          : t('dashboard.conversion.using-ecb', {
              date: metadata.conversionRateDate || 'latest',
            })}
      </div>
      {metadata.brokerBaseCurrencyTradeCount &&
        metadata.brokerBaseCurrencyTradeCount > 0 &&
        metadata.conversionRateDate &&
        metadata.conversionRateDate !== 'broker' && (
          <div>
            {t('dashboard.conversion.using-ecb', {
              date: metadata.conversionRateDate,
            })}
          </div>
        )}
      {originalEntries.length > 0 && (
        <div>
          <div className="journalit-dashboard-metric-tooltip__title">
            {t('dashboard.conversion.original-pnl')}
          </div>
          {originalEntries.map(([currency, value]) => (
            <div key={currency}>
              {currency}:{' '}
              {formatValue({ kind: 'pnl', value, currencyCode: currency })}
            </div>
          ))}
        </div>
      )}
      {convertedEntriesToShow.length > 0 && (
        <div>
          <div className="journalit-dashboard-metric-tooltip__title">
            {t('dashboard.conversion.converted-pnl')}
          </div>
          {convertedEntriesToShow.map(([currency, value]) => (
            <div key={currency}>
              {currency} → {metadata.conversionBaseCurrency}:{' '}
              {formatValue({
                kind: 'pnl',
                value,
                currencyCode: metadata.conversionBaseCurrency,
              })}
            </div>
          ))}
        </div>
      )}
      {unconverted.length > 0 && (
        <div className="journalit-dashboard-metric-tooltip__warning">
          {t('dashboard.conversion.excluded-warning', {
            converted: String(metadata.convertedTradeCount ?? 0),
            total: String(metadata.originalTradeCount ?? 0),
            excluded: String(
              Math.max(
                (metadata.originalTradeCount ?? 0) -
                  (metadata.convertedTradeCount ?? 0),
                0
              )
            ),
            currencies: unconverted.join(', '),
          })}
        </div>
      )}
    </div>
  );

  return (
    <Tooltip content={tooltip} delay={200} preferredPosition="bottom">
      <span
        className="journalit-dashboard-metric-info journalit-currency-conversion-info"
        aria-label={t('dashboard.conversion.details-label')}
      >
        <Info size={10} />
      </span>
    </Tooltip>
  );
};
