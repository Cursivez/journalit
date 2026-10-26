

import { isPricedStopLoss } from '../../../services/trade/core/StopLossTargets';
import React from 'react';
import {
  tradeShareSectionProps,
  tradeSharePnlValue,
  tradeSharePnlLabel,
  type TradeShareOptions,
} from '../../share/tradeShare/tradeShareModel';
import { calculateTradeReturnPercent } from '../../tradelog/tradeMetricUtils';
import { PartialTradeFrontmatter } from '../../../types/TradeFrontmatter';
import { useCurrency } from '../../../contexts/CurrencyContext';
import { getCurrencyConfig } from '../../../utils/currencyConfig';
import { TradeTemplate, TradeMetricType } from '../../../types/reviewV2';
import { formatTradePositionSize } from '../../forms/trade/utils';
import { t } from '../../../lang/helpers';
import {
  useDisplayFormatter,
  useDisplayPolicy,
} from '../../../hooks/useDisplayPolicy';
import { isRMultipleUnavailable } from '../../../services/display/DisplayPolicy';
import { TradeRUnavailableMessage } from '../../shared/display/RMultipleUnavailableHint';
import { Tooltip } from '../../shared/Tooltip';
import { resolveTradeRiskAmount } from '../../../utils/riskCalculation';
import { FileText } from '../../shared/icons/ObsidianIcon';
import { calculateTotalCosts } from '../../forms/trade/validation';
import { calculateEffectiveRMultiple } from '../../../utils/formatting';
import { hasSizedExplicitExitPrice } from '../../../services/trade/core/TradeExecutionNormalization';
import { shareDollarAmountProps } from '../../../services/share/brandedCapture';
import { FitText } from '../../shared/FitText';
import { getExecutionFillPrices } from '../../../utils/tradeStatusUtils';

interface ExecutionItem {
  time?: Date;
  price?: number;
  size?: number;
  hasExplicitPrice?: boolean;
}

interface MetricCardProps {
  label: string;
  value: string;
  subtitle?: React.ReactNode;
  valueClassName?: string;
  tooltipContent?: React.ReactNode;
  
  dollarAmount?: boolean;
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
  shareOptions?: TradeShareOptions;
  data: PartialTradeFrontmatter;
  metrics: {
    duration: string;
    pnl?: number;
  };
  defaultRiskAmount?: number;
  formatTime: (date: Date | string | undefined) => string;
  config?: TradeTemplate['sections']['details'];
  section?: 'all' | 'metrics' | 'thesis';
  
  rating?: React.ReactNode;
}

interface TradeThesisSectionProps {
  thesis?: string;
}

interface ConfiguredMetricCardsProps {
  shareOptions?: TradeShareOptions;
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
): ExecutionItem[] =>
  Array.isArray(items) ? items.filter(hasExecutionContent) : [];

const getTakeProfitTargets = (
  targets: PartialTradeFrontmatter['takeProfits']
) =>
  Array.isArray(targets)
    ? targets.filter(
        (target) =>
          hasFiniteNumber(target.price) ||
          hasFiniteNumber(target.closePercent) ||
          hasFiniteNumber(target.size)
      )
    : [];


const getStopLossCountMeta = (count: number): string | undefined =>
  count > 1
    ? t('trade.details.stop-loss-count', { count: String(count) })
    : undefined;

interface PlanLevels {
  label: string;
  items: Array<{ key: string; price: string; amount: string }>;
}


const buildPlanLevels = (
  label: string,
  targets: ReadonlyArray<{
    price?: number;
    closePercent?: number;
    size?: number;
  }>,
  formatPrice: (value: number | undefined) => string,
  formatSize: (value: number) => string,
  formatPercent: (value: number) => string,
  blankAmountLabel = ''
): PlanLevels | undefined =>
  targets.length > 1
    ? {
        label,
        items: targets.map((target, index) => ({
          key: `${index}-${target.price}-${target.size}-${target.closePercent}`,
          price: formatPrice(target.price),
          amount: hasFiniteNumber(target.size)
            ? `${t('form.field.stop-loss-size')} ${formatSize(target.size)}`
            : hasFiniteNumber(target.closePercent)
              ? formatPercent(target.closePercent)
              : blankAmountLabel,
        })),
      }
    : undefined;

const PlanLevelsBreakdown: React.FC<{
  levels: PlanLevels;
  isMasked: boolean;
}> = ({ levels, isMasked }) => (
  <div className="trade-execution-breakdown-group">
    <div className="trade-execution-breakdown-label">{levels.label}</div>
    <div className="trade-execution-breakdown-rows">
      {levels.items.map((item, index) => (
        <div className="trade-execution-breakdown-row" key={item.key}>
          <span className="trade-execution-breakdown-index">{index + 1}</span>
          <span className={isMasked ? 'journalit-privacy-mask' : ''}>
            {item.price}
          </span>
          <span>{item.amount}</span>
        </div>
      ))}
    </div>
  </div>
);

interface PlanMetricStripProps {
  rows: Array<{
    id: string;
    label: string;
    value: React.ReactNode;
    meta?: React.ReactNode;
    valueClassName?: string;
    
    dollarAmount?: boolean;
    
    levels?: PlanLevels;
    levelsMasked?: boolean;
  }>;
}

const PlanMetricStrip: React.FC<PlanMetricStripProps> = ({ rows }) => {
  if (rows.length === 0) return null;

  return (
    <div className="trade-risk-target-strip">
      {rows.map((row) => {
        
        const tile = (
          <span
            key={row.id}
            className="trade-risk-target-item"
            {...(row.dollarAmount ? shareDollarAmountProps : {})}
          >
            <span className="trade-risk-target-label">{row.label}</span>
            <span
              className={`trade-risk-target-value ${row.valueClassName ?? ''}`}
            >
              {row.value}
            </span>
            {row.meta && (
              <span className="trade-risk-target-meta">{row.meta}</span>
            )}
          </span>
        );
        if (!row.levels) return tile;
        return (
          <Tooltip
            key={row.id}
            content={
              <PlanLevelsBreakdown
                levels={row.levels}
                isMasked={row.levelsMasked ?? false}
              />
            }
            preferredPosition="top"
            block
            disclosureLabel={row.levels.label}
          >
            {tile}
          </Tooltip>
        );
      })}
    </div>
  );
};


const buildPlanMetricRows = ({
  data,
  showStopLoss,
  showTakeProfit,
  formatPrice,
  formatSize,
  formatPercent,
  formatRisk,
  isPriceMasked,
  isRiskMasked,
}: {
  data: TradeDetailsSectionProps['data'];
  showStopLoss: boolean;
  showTakeProfit: boolean;
  formatPrice: (value: number | undefined) => string;
  formatSize: (value: number) => string;
  formatPercent: (value: number) => string;
  formatRisk: (value: number | undefined) => string;
  isPriceMasked: boolean;
  isRiskMasked: boolean;
}): PlanMetricStripProps['rows'] => {
  const rows: PlanMetricStripProps['rows'] = [];
  const priceClassName = isPriceMasked ? 'journalit-privacy-mask' : undefined;
  const stopLossTargets = (data.stopLosses ?? []).filter(isPricedStopLoss);
  if (showStopLoss && stopLossTargets.length > 0) {
    rows.push({
      id: 'stopLoss',
      label: t('form.field.stop-loss'),
      value: formatPrice(stopLossTargets[0].price),
      meta: getStopLossCountMeta(stopLossTargets.length),
      valueClassName: priceClassName,
      levels: buildPlanLevels(
        t('tradelog.tooltip.stop-losses'),
        stopLossTargets,
        formatPrice,
        formatSize,
        formatPercent,
        t('form.placeholder.stop-loss-rest')
      ),
      levelsMasked: isPriceMasked,
    });
  }
  const effectiveRiskAmount = resolveTradeRiskAmount(data);
  if (showStopLoss && hasFiniteNumber(effectiveRiskAmount)) {
    rows.push({
      id: 'riskAmount',
      label: t('form.field.risk-amount'),
      value: formatRisk(effectiveRiskAmount),
      valueClassName: isRiskMasked ? 'journalit-privacy-mask' : undefined,
      dollarAmount: true,
    });
  }
  const takeProfitTargets = getTakeProfitTargets(data.takeProfits);
  if (showTakeProfit && takeProfitTargets.length > 0) {
    const [firstTakeProfit] = takeProfitTargets;
    const countLabel = t('trade.details.take-profit-count', {
      count: String(takeProfitTargets.length),
    });
    rows.push({
      id: 'takeProfit',
      label: t('form.field.take-profit'),
      value: hasFiniteNumber(firstTakeProfit.price)
        ? formatPrice(firstTakeProfit.price)
        : countLabel,
      meta: takeProfitTargets.length > 1 ? countLabel : undefined,
      valueClassName: priceClassName,
      levels: buildPlanLevels(
        t('form.section.take-profits'),
        takeProfitTargets,
        formatPrice,
        formatSize,
        formatPercent
      ),
      levelsMasked: isPriceMasked,
    });
  }
  return rows;
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
  dollarAmount,
}) => {
  const card = (
    <div
      className="metric-card"
      {...(dollarAmount ? shareDollarAmountProps : {})}
    >
      <div className="metric-label">{label}</div>
      <div
        className={
          valueClassName ? `metric-value ${valueClassName}` : 'metric-value'
        }
      >
        <FitText>{value}</FitText>
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
    <div className="trade-main-content" {...tradeShareSectionProps('thesis')}>
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
  shareOptions,
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
  const displayPolicy = useDisplayPolicy();
  
  
  const pnlShownInDollars = shareOptions
    ? shareOptions.pnlMode === 'currency'
    : !displayPolicy.displayRMultiples;
  const pnlDisplayOptions = shareOptions
    ? tradeSharePnlValue({
        mode: shareOptions.pnlMode,
        pnl,
        rMultiple: effectiveRMultiple,
        positionReturn: calculateTradeReturnPercent(data),
        accountBalance: shareOptions.accountBalance,
        currency,
      })
    : {
        kind: 'pnl' as const,
        value: pnl,
        rMultiple: effectiveRMultiple,
        currencyCode: currency,
      };

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
          label={t(
            shareOptions
              ? tradeSharePnlLabel(shareOptions.pnlMode)
              : 'template.editor.metric.pnl'
          )}
          value={formatValue(pnlDisplayOptions)}
          valueClassName={shouldMask('pnl') ? 'journalit-privacy-mask' : ''}
          tooltipContent={
            isRMultipleUnavailable(pnlDisplayOptions, displayPolicy) ? (
              <TradeRUnavailableMessage />
            ) : undefined
          }
          dollarAmount={pnlShownInDollars}
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
          dollarAmount
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

const DEFAULT_DETAIL_METRICS: TradeMetricType[] = [
  'entry',
  'exit',
  'duration',
  'stopLoss',
  'takeProfit',
  'executionSummary',
];

const showsThesis = (
  section: NonNullable<TradeDetailsSectionProps['section']>,
  config: TradeDetailsSectionProps['config']
): boolean => section !== 'metrics' && config?.showThesis !== false;


const datesForSpan = (
  executionDates: Date[],
  scalarEntryDate: Date | null,
  scalarExitDate: Date | null
): Date[] =>
  executionDates.length > 0
    ? executionDates
    : [scalarEntryDate, scalarExitDate].filter(
        (date): date is Date => date !== null
      );


function resolveExitDisplay(
  data: PartialTradeFrontmatter,
  exitItems: ExecutionItem[],
  scalarExitDate: Date | null
) {
  const hasExplicitExitPrice = data.hasExplicitExitPrice === true;
  const hasSizedExplicitExit = exitItems.some(hasSizedExplicitExitPrice);
  const hasNoExitExecution =
    exitItems.length === 0 && scalarExitDate === null && !hasExplicitExitPrice;
  const displayExitPrice =
    hasNoExitExecution ||
    (data.exitPrice === 0 && !hasExplicitExitPrice && !hasSizedExplicitExit)
      ? null
      : data.exitPrice;
  return {
    hasNoExitExecution,
    displayExitPrice,
    exitSize: exitItems[0]?.size,
    exitTime: data.exitTime ?? exitItems[0]?.time,
  };
}

export const TradeDetailsSection: React.FC<TradeDetailsSectionProps> = ({
  shareOptions,
  data,
  metrics,
  defaultRiskAmount,
  formatTime,
  config,
  section = 'all',
  rating,
}) => {
  const { currency: globalCurrency } = useCurrency();
  const currency = data.currency || globalCurrency;
  const { formatValue, shouldMask } = useDisplayFormatter();
  const isPriceMasked = shouldMask('price');
  const isPositionSizeMasked = shouldMask('positionSize');

  const currencyConfig = getCurrencyConfig(currency);

  const formatDisplayPrice = (
    value: number | undefined | null,
    fillPrices?: readonly number[]
  ): string =>
    formatValue({
      kind: 'price',
      value,
      currencyCode: currency,
      priceStyle: 'decimal',
      fillPrices,
      fallback: t('common.na'),
    });

  const formatPositionSize = (
    value: number | undefined | null,
    assetType?: string
  ): string => {
    if (value === undefined || value === null || !Number.isFinite(value)) {
      return t('common.na');
    }

    return formatTradePositionSize(value, assetType, currencyConfig.locale);
  };

  
  const allowedMetrics = config?.metrics || DEFAULT_DETAIL_METRICS;
  const showMetrics = section !== 'thesis';
  const showThesis = showsThesis(section, config);

  
  const isMetricAllowed = (metric: TradeMetricType) =>
    allowedMetrics.includes(metric);

  const entryItems = getExecutionItems(data.entries);
  const exitItems = getExecutionItems(data.exits);
  
  const fillPrices = getExecutionFillPrices(data);
  const formatEntryPrice = (value: number | undefined | null) =>
    formatDisplayPrice(value, fillPrices.entry);
  const formatExitPrice = (value: number | undefined | null) =>
    formatDisplayPrice(value, fillPrices.exit);
  const executionDates = getValidExecutionDates([...entryItems, ...exitItems]);
  const scalarEntryDate = parseExecutionDate(data.entryTime);
  const scalarExitDate = parseExecutionDate(data.exitTime);
  const spansMultipleDates = hasMultipleCalendarDays(
    datesForSpan(executionDates, scalarEntryDate, scalarExitDate)
  );
  const formatExecutionDateTime = (date: Date | string | undefined) => {
    const parsedDate = parseExecutionDate(date);
    if (!parsedDate) return formatTime(date);
    return spansMultipleDates
      ? SHORT_DATE_TIME_FORMATTER.format(parsedDate)
      : formatTime(date);
  };
  const totalCosts = calculateTotalCosts(data);
  const hasCosts = totalCosts !== 0;
  const formatDisplayPositionSize = (value: number | undefined | null) =>
    isPositionSizeMasked
      ? formatValue({ kind: 'positionSize', value })
      : formatPositionSize(value, data.assetType);
  const planMetricRows = buildPlanMetricRows({
    data,
    showStopLoss: isMetricAllowed('stopLoss'),
    showTakeProfit: isMetricAllowed('takeProfit'),
    formatPrice: formatDisplayPrice,
    formatSize: formatDisplayPositionSize,
    
    formatPercent: (value) =>
      formatValue({
        kind: 'percentage',
        value,
        precision: Number.isInteger(value) ? 0 : 1,
      }),
    formatRisk: (value) =>
      formatValue({
        kind: 'risk',
        value,
        currencyCode: currency,
        fallback: t('common.na'),
      }),
    isPriceMasked,
    isRiskMasked: shouldMask('risk'),
  });
  const buildExecutionSubtitle = (
    time: Date | string | undefined,
    size: number | undefined | null
  ) =>
    hasFiniteNumber(size)
      ? `${formatExecutionDateTime(time)} · ${formatDisplayPositionSize(size)}`
      : formatExecutionDateTime(time);
  const { hasNoExitExecution, displayExitPrice, exitSize, exitTime } =
    resolveExitDisplay(data, exitItems, scalarExitDate);
  const hasExitTime = parseExecutionDate(exitTime) !== null;
  const exitSubtitle = (() => {
    if (exitItems.length > 1) {
      return t('trade.details.exits-summary', {
        count: String(exitItems.length),
      });
    }

    if (hasNoExitExecution) {
      return undefined;
    }

    if (hasFiniteNumber(exitSize) && hasExitTime) {
      return `${formatExecutionDateTime(exitTime)} · ${formatDisplayPositionSize(exitSize)}`;
    }

    if (hasFiniteNumber(exitSize)) {
      return formatDisplayPositionSize(exitSize);
    }

    if (hasExitTime) {
      return formatExecutionDateTime(exitTime);
    }

    return undefined;
  })();
  const buildExecutionTooltip = (
    label: string,
    items: ExecutionItem[],
    formatItemPrice: (value: number | undefined | null) => string
  ) =>
    items.length > 1 ? (
      <ExecutionBreakdownGroup
        label={label}
        items={items}
        formatDisplayPrice={formatItemPrice}
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
  const showExecutionSummary = isMetricAllowed('executionSummary');
  const entryTooltipContent = showExecutionSummary
    ? buildExecutionTooltip(
        t('trade.details.entry'),
        entryItems,
        formatEntryPrice
      )
    : undefined;
  const exitTooltipContent = showExecutionSummary
    ? buildExecutionTooltip(t('trade.details.exit'), exitItems, formatExitPrice)
    : undefined;
  const entrySubtitle =
    entryItems.length > 1
      ? t('trade.details.entries-summary', {
          count: String(entryItems.length),
        })
      : buildExecutionSubtitle(
          data.entryTime,
          entryItems[0]?.size ?? data.positionSize
        );
  const priceValueClassName = isPriceMasked ? 'journalit-privacy-mask' : '';

  return (
    <>
      
      {showMetrics && (
        <div
          className="trade-overview-section"
          {...tradeShareSectionProps('metrics')}
        >
          
          <div className="trade-metrics-grid">
            {isMetricAllowed('entry') && (
              <MetricCard
                label={t('trade.details.entry')}
                value={formatEntryPrice(data.entryPrice)}
                subtitle={entrySubtitle}
                valueClassName={priceValueClassName}
                tooltipContent={entryTooltipContent}
              />
            )}

            {isMetricAllowed('exit') && (
              <MetricCard
                label={t('trade.details.exit')}
                value={formatExitPrice(displayExitPrice)}
                subtitle={exitSubtitle}
                valueClassName={priceValueClassName}
                tooltipContent={exitTooltipContent}
              />
            )}

            {isMetricAllowed('duration') && (
              <MetricCard
                label={t('trade.details.duration')}
                value={metrics.duration || t('common.na')}
              />
            )}

            <ConfiguredMetricCards
              shareOptions={shareOptions}
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

            {rating}
          </div>

          <PlanMetricStrip rows={planMetricRows} />
        </div>
      )}

      {showThesis && <TradeThesisSection thesis={data.thesis} />}
    </>
  );
};
