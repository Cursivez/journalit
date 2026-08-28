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
  partiallyConvertedCurrencies?: string[];
  originalTradeCount?: number;
  convertedTradeCount?: number;
  brokerBaseCurrencyTradeCount?: number;
  manualFxRateTradeCount?: number;
  unconvertedTrades?: CurrencyConversionTrade[];
}

export interface CurrencyConversionTrade {
  tradeId?: string;
  path?: string;
  _dashboardExcursionSourceKey?: string;
  currency?: string;
  originalCurrency?: string;
  originalPnlBeforeConversion?: number | null;
  pnl?: number | null;
  brokerBaseCurrencyPnl?: number | null;
  brokerBaseCurrency?: string;
  brokerBaseCurrencyPnlSource?: string;
  
  conversionUsedManualRate?: boolean;
  conversionUsedFetchedRates?: boolean;
  conversionPartialCurrencies?: string[];
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
  partiallyConvertedCurrencies?: string[];
  originalTradeCount?: number;
  convertedTradeCount?: number;
  brokerBaseCurrencyTradeCount?: number;
  manualFxRateTradeCount?: number;
}


function getFetchedConversionRateDate(
  rateDate: string | undefined
): string | null {
  if (!rateDate || rateDate === 'broker' || rateDate === 'manual') {
    return null;
  }
  return rateDate;
}


export const ConversionSourceLines: React.FC<{
  brokerBaseCurrencyTradeCount?: number;
  manualFxRateTradeCount?: number;
  conversionRateDate?: string;
  
  ecbTradeCount?: number;
}> = ({
  brokerBaseCurrencyTradeCount,
  manualFxRateTradeCount,
  conversionRateDate,
  ecbTradeCount,
}) => {
  const brokerTradeCount = brokerBaseCurrencyTradeCount ?? 0;
  const manualRateTradeCount = manualFxRateTradeCount ?? 0;
  const fetchedRateDate = getFetchedConversionRateDate(conversionRateDate);
  const hasFetchedRateDate = fetchedRateDate !== null;
  
  
  
  const showEcbLine =
    ecbTradeCount !== undefined ? ecbTradeCount > 0 : hasFetchedRateDate;

  return (
    <>
      {brokerTradeCount > 0 && (
        <div>
          {t('dashboard.conversion.using-broker-pnl', {
            count: String(brokerTradeCount),
            tradeLabel:
              brokerTradeCount === 1
                ? t('dashboard.conversion.trade-singular')
                : t('dashboard.conversion.trade-plural'),
          })}
        </div>
      )}
      {manualRateTradeCount > 0 && (
        <div>
          {t('dashboard.conversion.using-manual-rate', {
            count: String(manualRateTradeCount),
            tradeLabel:
              manualRateTradeCount === 1
                ? t('dashboard.conversion.trade-singular')
                : t('dashboard.conversion.trade-plural'),
          })}
        </div>
      )}
      {showEcbLine && (
        <div>
          {t('dashboard.conversion.using-ecb', {
            date: fetchedRateDate ?? 'latest',
          })}
        </div>
      )}
    </>
  );
};

interface ForexPnlConversionInfoProps {
  quoteCurrency?: string | null;
  accountCurrency?: string | null;
  rateDate?: string;
  source?: 'automatic' | 'manual';
}


export const ForexPnlConversionInfo: React.FC<ForexPnlConversionInfoProps> = ({
  quoteCurrency,
  accountCurrency,
  rateDate,
  source,
}) => {
  if (!quoteCurrency || !accountCurrency || quoteCurrency === accountCurrency) {
    return null;
  }

  const tooltip = (
    <div className="journalit-dashboard-metric-tooltip">
      <div className="journalit-dashboard-metric-tooltip__title">
        {t('dashboard.conversion.title', { currency: accountCurrency })}
      </div>
      <div>
        {quoteCurrency} → {accountCurrency}
      </div>
      {source === 'automatic' && rateDate && (
        <div>{t('dashboard.conversion.using-ecb', { date: rateDate })}</div>
      )}
      {source === 'manual' && <div>{t('form.forex.using-manual-rate')}</div>}
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
    partiallyConvertedCurrencies: metrics.partiallyConvertedCurrencies,
    originalTradeCount: metrics.originalTradeCount,
    convertedTradeCount: metrics.convertedTradeCount,
    brokerBaseCurrencyTradeCount: metrics.brokerBaseCurrencyTradeCount,
    manualFxRateTradeCount: metrics.manualFxRateTradeCount,
  };
}

export const CurrencyConversionInfo: React.FC<CurrencyConversionInfoProps> = ({
  metadata,
  trades,
}) => {
  if (!metadata?.isMultiCurrency || !metadata.conversionBaseCurrency) {
    return null;
  }

  const conversionBaseCurrency = metadata.conversionBaseCurrency;
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
  
  
  const partiallyConverted = hasScopedTrades
    ? Array.from(
        new Set(
          (trades ?? []).flatMap(
            (trade) => trade.conversionPartialCurrencies ?? []
          )
        )
      )
    : metadata.partiallyConvertedCurrencies || [];
  const hasActualConversion =
    originalEntries.some(
      ([currency]) => currency !== metadata.conversionBaseCurrency
    ) ||
    unconverted.length > 0 ||
    partiallyConverted.length > 0;

  if (!hasActualConversion) {
    return null;
  }

  const countScopedSourceTrades = (
    predicate: (trade: CurrencyConversionTrade) => boolean
  ): number => {
    const identities = new Set<string>();
    let anonymousCount = 0;
    for (const trade of trades ?? []) {
      if (!predicate(trade)) continue;
      const identity =
        trade.tradeId ?? trade._dashboardExcursionSourceKey ?? trade.path;
      if (identity) {
        identities.add(identity);
      } else {
        anonymousCount += 1;
      }
    }
    return identities.size + anonymousCount;
  };

  return (
    <CurrencyConversionInfoContent
      metadata={{
        ...metadata,
        conversionBaseCurrency,
        brokerBaseCurrencyTradeCount: hasScopedTrades
          ? countScopedSourceTrades((trade) =>
              usedBrokerBasePnl(trade, conversionBaseCurrency)
            )
          : metadata.brokerBaseCurrencyTradeCount,
        manualFxRateTradeCount: hasScopedTrades
          ? countScopedSourceTrades(usedManualFxRate)
          : metadata.manualFxRateTradeCount,
      }}
      ecbTradeCount={
        hasScopedTrades ? countScopedSourceTrades(usedFetchedRates) : undefined
      }
      originalEntries={originalEntries}
      convertedEntries={convertedEntries}
      unconverted={unconverted}
      partiallyConverted={partiallyConverted}
    />
  );
};

function usedBrokerBasePnl(
  trade: CurrencyConversionTrade,
  conversionBaseCurrency: string
): boolean {
  return (
    typeof trade.brokerBaseCurrencyPnl === 'number' &&
    Number.isFinite(trade.brokerBaseCurrencyPnl) &&
    trade.brokerBaseCurrencyPnl !== 0 &&
    trade.brokerBaseCurrency === conversionBaseCurrency &&
    typeof trade.originalCurrency === 'string' &&
    trade.originalCurrency !== conversionBaseCurrency
  );
}





function usedManualFxRate(trade: CurrencyConversionTrade): boolean {
  return trade.conversionUsedManualRate === true;
}

function usedFetchedRates(trade: CurrencyConversionTrade): boolean {
  return trade.conversionUsedFetchedRates === true;
}

interface CurrencyConversionInfoContentProps {
  metadata: ReviewCurrencyConversionMetadata & {
    conversionBaseCurrency: string;
  };
  
  ecbTradeCount?: number;
  originalEntries: Array<[string, number]>;
  convertedEntries: Array<[string, number]>;
  unconverted: string[];
  partiallyConverted: string[];
}

const CurrencyConversionInfoContent: React.FC<
  CurrencyConversionInfoContentProps
> = ({
  metadata,
  ecbTradeCount,
  originalEntries,
  convertedEntries,
  unconverted,
  partiallyConverted,
}) => {
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
      <ConversionSourceLines
        brokerBaseCurrencyTradeCount={metadata.brokerBaseCurrencyTradeCount}
        manualFxRateTradeCount={metadata.manualFxRateTradeCount}
        conversionRateDate={metadata.conversionRateDate}
        ecbTradeCount={ecbTradeCount}
      />
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
      {partiallyConverted.length > 0 && (
        <div className="journalit-dashboard-metric-tooltip__warning">
          {t('dashboard.conversion.partial-warning', {
            currencies: partiallyConverted.join(', '),
          })}
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
