

import React from 'react';
import { PartialTradeFrontmatter } from '../../../types/TradeFrontmatter';
import { useCurrency } from '../../../contexts/CurrencyContext';
import { getCurrencyConfig } from '../../../utils/currencyConfig';
import { TradeTemplate, TradeMetricType } from '../../../types/reviewV2';
import { getSizePrecision, roundToPrecision } from '../../forms/trade/utils';
import { t } from '../../../lang/helpers';
import { useDisplayFormatter } from '../../../hooks/useDisplayPolicy';
import { Tooltip } from '../../shared/Tooltip';
import { resolveTradeRiskAmount } from '../../../utils/riskCalculation';
import { FileText } from '../../shared/icons/ObsidianIcon';
import { calculateTotalCosts } from '../../forms/trade/validation';
import { calculateEffectiveRMultiple } from '../../../utils';

interface ExecutionItem {
  time?: Date;
  price?: number;
  size?: number;
}

interface MetricCardProps {
  label: string;
  value: React.ReactNode;
  subtitle?: React.ReactNode;
  valueClassName?: string;
  tooltipContent?: React.ReactNode;
}

interface ExecutionBreakdownProps {
  entries: ExecutionItem[];
  exits: ExecutionItem[];
  formatDisplayPrice: (value: number | undefined | null) => string;
  formatPositionSize: (
    value: number | undefined | null,
    assetType?: string
  ) => string;
  formatMaskedPositionSize: (value: number | undefined | null) => string;
  formatExecutionDateTime: (date: Date | string | undefined) => string;
  assetType?: string;
  isPriceMasked: boolean;
  isPositionSizeMasked: boolean;
}

interface TradeDetailsSectionProps {
  data: PartialTradeFrontmatter;
  metrics: {
    duration: string;
    pnl?: number;
  };
  defaultRiskAmount?: number;
  formatTime: (date: Date | string | undefined) => string;
  config?: TradeTemplate['sections']['details'];
  section?: 'all' | 'metrics' | 'thesis';
}

interface TradeThesisSectionProps {
  thesis?: string;
}

interface ConfiguredMetricCardsProps {
  allowedMetrics: TradeMetricType[];
  data: PartialTradeFrontmatter;
  pnl?: number;
  defaultRiskAmount?: number;
  currency: string;
  totalCosts: number;
  hasCosts: boolean;
  formatDisplayPositionSize: (value: number | undefined | null) => string;
  formatValue: ReturnType<typeof useDisplayFormatter>['formatValue'];
  shouldMask: ReturnType<typeof useDisplayFormatter>['shouldMask'];
  isPositionSizeMasked: boolean;
}

const getKeyedTextLines = (text: string) => {
  const occurrences = new Map<string, number>();
  return text.split('\n').map((line) => {
    const occurrence = (occurrences.get(line) ?? 0) + 1;
    occurrences.set(line, occurrence);
    return { line, key: `${line}-${occurrence}` };
  });
};

const hasFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

const hasExecutionContent = (item: ExecutionItem) =>
  item.time !== undefined ||
  hasFiniteNumber(item.price) ||
  hasFiniteNumber(item.size);

const getExecutionItems = (
  items: PartialTradeFrontmatter['entries'] | PartialTradeFrontmatter['exits']
) => (Array.isArray(items) ? items.filter(hasExecutionContent) : []);

const getTakeProfitTargets = (
  targets: PartialTradeFrontmatter['takeProfits']
) =>
  Array.isArray(targets)
    ? targets.filter(
        (target) =>
          hasFiniteNumber(target.price) || hasFiniteNumber(target.closePercent)
      )
    : [];

interface PlanMetricStripProps {
  rows: Array<{
    id: string;
    label: string;
    value: React.ReactNode;
    meta?: React.ReactNode;
    valueClassName?: string;
  }>;
}

const PlanMetricStrip: React.FC<PlanMetricStripProps> = ({ rows }) => {
  if (rows.length === 0) return null;

  return (
    <div className="trade-risk-target-strip">
      {rows.map((row) => (
        <div key={row.id} className="trade-risk-target-item">
          <span className="trade-risk-target-label">{row.label}</span>
          <span
            className={`trade-risk-target-value ${row.valueClassName ?? ''}`}
          >
            {row.value}
          </span>
          {row.meta && (
            <span className="trade-risk-target-meta">{row.meta}</span>
          )}
        </div>
      ))}
    </div>
  );
};

const parseExecutionDate = (
  value: Date | string | undefined | null
): Date | null => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const isSameCalendarDay = (first: Date, second: Date) =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();

const hasMultipleCalendarDays = (dates: Date[]) => {
  const [firstDate] = dates;
  if (!firstDate) return false;
  return dates.some((date) => !isSameCalendarDay(firstDate, date));
};

const getValidExecutionDates = (items: ExecutionItem[]) => {
  const dates: Date[] = [];
  for (const item of items) {
    const parsedDate = parseExecutionDate(item.time);
    if (parsedDate) dates.push(parsedDate);
  }
  return dates;
};

const SHORT_DATE_TIME_FORMATTER = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
});

const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subtitle,
  valueClassName,
  tooltipContent,
}) => {
  const card = (
    <div className="metric-card">
      <div className="metric-label">{label}</div>
      <div
        className={
          valueClassName ? `metric-value ${valueClassName}` : 'metric-value'
        }
      >
        {value}
      </div>
      <div className="metric-subtitle">{subtitle ?? '\u00a0'}</div>
    </div>
  );

  if (!tooltipContent) return card;

  return (
    <Tooltip content={tooltipContent} preferredPosition="top" block>
      {card}
    </Tooltip>
  );
};

const getExecutionRowKey = (item: ExecutionItem) =>
  `${item.time?.toISOString() ?? 'no-time'}-${item.price ?? 'no-price'}-${item.size ?? 'no-size'}`;

const ExecutionBreakdownGroup: React.FC<{
  label: string;
  items: ExecutionItem[];
  formatDisplayPrice: ExecutionBreakdownProps['formatDisplayPrice'];
  formatPositionSize: ExecutionBreakdownProps['formatPositionSize'];
  formatMaskedPositionSize: ExecutionBreakdownProps['formatMaskedPositionSize'];
  formatExecutionDateTime: ExecutionBreakdownProps['formatExecutionDateTime'];
  assetType?: string;
  isPriceMasked: boolean;
  isPositionSizeMasked: boolean;
}> = ({
  label,
  items,
  formatDisplayPrice,
  formatPositionSize,
  formatMaskedPositionSize,
  formatExecutionDateTime,
  assetType,
  isPriceMasked,
  isPositionSizeMasked,
}) => (
  <div className="trade-execution-breakdown-group">
    <div className="trade-execution-breakdown-label">{label}</div>
    <div className="trade-execution-breakdown-rows">
      {items.map((item, index) => (
        <div
          className="trade-execution-breakdown-row"
          key={getExecutionRowKey(item)}
        >
          <span className="trade-execution-breakdown-index">{index + 1}</span>
          <span>{formatExecutionDateTime(item.time)}</span>
          <span
            className={
              isPositionSizeMasked || isPriceMasked
                ? 'journalit-privacy-mask'
                : ''
            }
          >
            {isPositionSizeMasked
              ? formatMaskedPositionSize(item.size)
              : formatPositionSize(item.size, assetType)}{' '}
            @ {formatDisplayPrice(item.price)}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const TradeThesisSection: React.FC<TradeThesisSectionProps> = ({ thesis }) => {
  const trimmedThesis = thesis?.trim();
  if (!trimmedThesis) return null;

  return (
    <div className="trade-main-content">
      <div className="thesis-section">
        <div className="thesis-section-header">
          <div className="thesis-section-title">
            <FileText size={17} />
            <span>{t('trade.details.thesis')}</span>
          </div>
        </div>
        <div className="thesis-content">
          {getKeyedTextLines(trimmedThesis).map((item, index, lines) => (
            <React.Fragment key={item.key}>
              {item.line}
              {index < lines.length - 1 && <br />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

const ConfiguredMetricCards: React.FC<ConfiguredMetricCardsProps> = ({
  allowedMetrics,
  data,
  pnl,
  defaultRiskAmount,
  currency,
  totalCosts,
  hasCosts,
  formatDisplayPositionSize,
  formatValue,
  shouldMask,
  isPositionSizeMasked,
}) => {
  const isMetricAllowed = (metric: TradeMetricType) =>
    allowedMetrics.includes(metric);
  const effectiveRMultiple = calculateEffectiveRMultiple(
    pnl,
    data.rMultiple,
    data.riskAmount,
    defaultRiskAmount
  );

  return (
    <>
      {isMetricAllowed('size') && (
        <MetricCard
          label={t('template.editor.metric.position-size')}
          value={formatDisplayPositionSize(data.positionSize)}
          valueClassName={isPositionSizeMasked ? 'journalit-privacy-mask' : ''}
        />
      )}

      {isMetricAllowed('pnl') && (
        <MetricCard
          label={t('template.editor.metric.pnl')}
          value={formatValue({
            kind: 'pnl',
            value: pnl,
            currencyCode: currency,
          })}
          valueClassName={shouldMask('pnl') ? 'journalit-privacy-mask' : ''}
        />
      )}

      {isMetricAllowed('rMultiple') && (
        <MetricCard
          label={t('template.editor.metric.r-multiple')}
          value={formatValue({ kind: 'rMultiple', value: effectiveRMultiple })}
          valueClassName={
            shouldMask('rMultiple') ? 'journalit-privacy-mask' : ''
          }
        />
      )}

      {isMetricAllowed('costs') && hasCosts && (
        <MetricCard
          label={t('template.editor.metric.costs')}
          value={formatValue({
            kind: 'fee',
            value: totalCosts,
            currencyCode: currency,
          })}
          valueClassName={shouldMask('fee') ? 'journalit-privacy-mask' : ''}
        />
      )}
    </>
  );
};

export const TradeDetailsSection: React.FC<TradeDetailsSectionProps> = ({
  data,
  metrics,
  defaultRiskAmount,
  formatTime,
  config,
  section = 'all',
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

  const formatDisplayRisk = (value: number | undefined | null): string => {
    return formatValue({
      kind: 'risk',
      value,
      currencyCode: currency,
      fallback: t('common.na'),
    });
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
    'duration',
    'stopLoss',
    'takeProfit',
    'executionSummary',
  ];
  const showMetrics = section !== 'thesis';
  const showThesis = section !== 'metrics' && config?.showThesis !== false;

  
  const isMetricAllowed = (metric: TradeMetricType) =>
    allowedMetrics.includes(metric);

  const entryItems = getExecutionItems(data.entries);
  const exitItems = getExecutionItems(data.exits);
  const executionDates = getValidExecutionDates([...entryItems, ...exitItems]);
  const scalarEntryDate = parseExecutionDate(data.entryTime);
  const scalarExitDate = parseExecutionDate(data.exitTime);
  const spansMultipleDates = hasMultipleCalendarDays(
    executionDates.length > 0
      ? executionDates
      : [scalarEntryDate, scalarExitDate].filter(
          (date): date is Date => date !== null
        )
  );
  const formatExecutionDateTime = (date: Date | string | undefined) => {
    const parsedDate = parseExecutionDate(date);
    if (!parsedDate) return formatTime(date);
    return spansMultipleDates
      ? SHORT_DATE_TIME_FORMATTER.format(parsedDate)
      : formatTime(date);
  };
  const takeProfitTargets = getTakeProfitTargets(data.takeProfits);
  const firstTakeProfit = takeProfitTargets[0];
  const hasStopLoss = hasFiniteNumber(data.stopLoss);
  const effectiveRiskAmount = resolveTradeRiskAmount(data);
  const hasRiskAmount = hasFiniteNumber(effectiveRiskAmount);
  const shouldShowStopLossMetric = isMetricAllowed('stopLoss') && hasStopLoss;
  const shouldShowRiskAmountMetric =
    isMetricAllowed('stopLoss') && hasRiskAmount;
  const shouldShowTakeProfitMetric =
    isMetricAllowed('takeProfit') && takeProfitTargets.length > 0;
  const totalCosts = calculateTotalCosts(data);
  const hasCosts = totalCosts !== 0;
  const firstTakeProfitLabel = hasFiniteNumber(firstTakeProfit?.price)
    ? formatDisplayPrice(firstTakeProfit.price)
    : null;
  const planMetricRows: PlanMetricStripProps['rows'] = [];
  if (shouldShowStopLossMetric) {
    planMetricRows.push({
      id: 'stopLoss',
      label: t('form.field.stop-loss'),
      value: formatDisplayPrice(data.stopLoss),
      valueClassName: isPriceMasked ? 'journalit-privacy-mask' : undefined,
    });
  }
  if (shouldShowRiskAmountMetric) {
    planMetricRows.push({
      id: 'riskAmount',
      label: t('form.field.risk-amount'),
      value: formatDisplayRisk(effectiveRiskAmount),
      valueClassName: shouldMask('risk') ? 'journalit-privacy-mask' : undefined,
    });
  }
  if (shouldShowTakeProfitMetric) {
    planMetricRows.push({
      id: 'takeProfit',
      label: t('form.field.take-profit'),
      value:
        firstTakeProfitLabel ??
        t('trade.details.take-profit-count', {
          count: String(takeProfitTargets.length),
        }),
      meta:
        takeProfitTargets.length > 1
          ? t('trade.details.take-profit-count', {
              count: String(takeProfitTargets.length),
            })
          : undefined,
      valueClassName: isPriceMasked ? 'journalit-privacy-mask' : undefined,
    });
  }
  const formatDisplayPositionSize = (value: number | undefined | null) =>
    isPositionSizeMasked
      ? formatValue({ kind: 'positionSize', value })
      : formatPositionSize(value, data.assetType);
  const buildExecutionSubtitle = (
    time: Date | string | undefined,
    size: number | undefined | null
  ) =>
    hasFiniteNumber(size)
      ? `${formatExecutionDateTime(time)} · ${formatDisplayPositionSize(size)}`
      : formatExecutionDateTime(time);
  const entryTooltipContent =
    isMetricAllowed('executionSummary') && entryItems.length > 1 ? (
      <ExecutionBreakdownGroup
        label={t('trade.details.entry')}
        items={entryItems}
        formatDisplayPrice={formatDisplayPrice}
        formatPositionSize={formatPositionSize}
        formatMaskedPositionSize={(value) =>
          formatValue({ kind: 'positionSize', value })
        }
        formatExecutionDateTime={formatExecutionDateTime}
        assetType={data.assetType}
        isPriceMasked={isPriceMasked}
        isPositionSizeMasked={isPositionSizeMasked}
      />
    ) : undefined;
  const exitTooltipContent =
    isMetricAllowed('executionSummary') && exitItems.length > 1 ? (
      <ExecutionBreakdownGroup
        label={t('trade.details.exit')}
        items={exitItems}
        formatDisplayPrice={formatDisplayPrice}
        formatPositionSize={formatPositionSize}
        formatMaskedPositionSize={(value) =>
          formatValue({ kind: 'positionSize', value })
        }
        formatExecutionDateTime={formatExecutionDateTime}
        assetType={data.assetType}
        isPriceMasked={isPriceMasked}
        isPositionSizeMasked={isPositionSizeMasked}
      />
    ) : undefined;

  return (
    <>
      
      {showMetrics && (
        <div className="trade-overview-section">
          
          <div className="trade-metrics-grid">
            {isMetricAllowed('entry') && (
              <MetricCard
                label={t('trade.details.entry')}
                value={formatDisplayPrice(data.entryPrice)}
                subtitle={
                  entryItems.length > 1
                    ? t('trade.details.entries-summary', {
                        count: String(entryItems.length),
                      })
                    : buildExecutionSubtitle(
                        data.entryTime,
                        entryItems[0]?.size ?? data.positionSize
                      )
                }
                valueClassName={isPriceMasked ? 'journalit-privacy-mask' : ''}
                tooltipContent={entryTooltipContent}
              />
            )}

            {isMetricAllowed('exit') && (
              <MetricCard
                label={t('trade.details.exit')}
                value={formatDisplayPrice(data.exitPrice)}
                subtitle={
                  exitItems.length > 1
                    ? t('trade.details.exits-summary', {
                        count: String(exitItems.length),
                      })
                    : buildExecutionSubtitle(
                        data.exitTime,
                        exitItems[0]?.size ?? data.positionSize
                      )
                }
                valueClassName={isPriceMasked ? 'journalit-privacy-mask' : ''}
                tooltipContent={exitTooltipContent}
              />
            )}

            {isMetricAllowed('duration') && (
              <MetricCard
                label={t('trade.details.duration')}
                value={metrics.duration}
              />
            )}

            <ConfiguredMetricCards
              allowedMetrics={allowedMetrics}
              data={data}
              pnl={metrics.pnl}
              defaultRiskAmount={defaultRiskAmount}
              currency={currency}
              totalCosts={totalCosts}
              hasCosts={hasCosts}
              formatDisplayPositionSize={formatDisplayPositionSize}
              formatValue={formatValue}
              shouldMask={shouldMask}
              isPositionSizeMasked={isPositionSizeMasked}
            />
          </div>

          <PlanMetricStrip rows={planMetricRows} />
        </div>
      )}

      {showThesis && <TradeThesisSection thesis={data.thesis} />}
    </>
  );
};
