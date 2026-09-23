

import React from 'react';
import type { TradeFormData } from '../../forms/trade/types';
import { calculateEffectiveRMultiple } from '../../../utils/formatting';
import { useDisplayFormatter } from '../../../hooks/useDisplayPolicy';
import {
  hasRealizedStoredPnL,
  isTradeOpenWithContext,
} from '../../../utils/tradeStatusUtils';
import { useCurrency } from '../../../contexts/CurrencyContext';
import { usePlugin } from '../../../hooks/usePlugin';
import { t } from '../../../lang/helpers';
import { getTradeDirectionDisplayKind } from '../../../services/trade/core/TradeDirection';
import { formatLocalizedDateTime } from '../../../utils/localizedDateTime';
import {
  getWeekNumberForDate,
  getWeekStartDaySetting,
} from '../../../utils/dateUtils';
import { CheckCircle2, Circle, Edit } from '../../shared/icons/ObsidianIcon';
import { calculateSnapshotRealizedPnL } from '../../../utils/unrealizedPnl';
import type { PriceMoveValueInput } from '../../../utils/priceMoveValue';
import { Notice } from 'obsidian';
import { openReviewPeriod } from '../../../services/tradeOperations/reviewNavigation';
import type { ReviewPeriodLevel } from '../../../services/tradeOperations/periodGrouping';

const HEADER_WEEKDAY_FORMATTER = new Intl.DateTimeFormat(undefined, {
  weekday: 'short',
});

const HEADER_MONTH_FORMATTER = new Intl.DateTimeFormat(undefined, {
  month: 'short',
});

type HeaderReviewNavigationTarget =
  | 'drc'
  | 'weekly'
  | 'monthly'
  | 'quarterly'
  | 'yearly';

const REVIEW_PERIOD_LEVEL_BY_TARGET = {
  drc: 'days',
  weekly: 'weeks',
  monthly: 'months',
  quarterly: 'quarters',
  yearly: 'years',
} satisfies Record<HeaderReviewNavigationTarget, ReviewPeriodLevel>;

function getOrdinalSuffix(day: number): string {
  const mod100 = day % 100;
  if (mod100 >= 11 && mod100 <= 13) return 'th';

  switch (day % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}

function splitHeaderOutcomeValue(value: string): {
  main: string;
  decimal: string | null;
  suffix: string | null;
} {
  const match = value.match(/^(.*?)([.,]\d{2})(\s?[^\d.,]*)$/);

  if (!match) {
    return { main: value, decimal: null, suffix: null };
  }

  return {
    main: match[1],
    decimal: match[2],
    suffix: match[3] || null,
  };
}

function getTradeSequenceLabel(sourcePath: string | undefined): string | null {
  if (!sourcePath) return null;
  const match = sourcePath.match(/-([TMB]\d+)\.md$/i);
  return match ? match[1].toUpperCase() : null;
}

export function getTradeHeaderSequenceLabel(
  sourcePath: string | undefined,
  noteKind: TradeHeaderProps['noteKind']
): string | null {
  if (noteKind && noteKind !== 'trade') return null;

  const sequenceLabel = getTradeSequenceLabel(sourcePath);
  if (!sequenceLabel?.startsWith('T')) return null;

  const sequenceNumber = Number.parseInt(sequenceLabel.slice(1), 10);
  return sequenceNumber > 1 ? sequenceLabel : null;
}

export function getTradeHeaderReviewDate({
  entryTime,
  sourcePath,
}: {
  entryTime?: Date | string | null;
  sourcePath?: string;
}): Date | null {
  if (entryTime) {
    const date = new Date(entryTime);
    if (!Number.isNaN(date.getTime())) return date;
  }

  const pathMatch = sourcePath?.match(/(\d{2})(\d{2})(\d{2})-[TMB]\d+\.md$/i);
  if (!pathMatch) return null;

  const [, day, month, year] = pathMatch;
  const parsedDate = new Date(
    2000 + parseInt(year, 10),
    parseInt(month, 10) - 1,
    parseInt(day, 10)
  );

  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}

export function getDisplayInstrument(
  instrument: string | undefined,
  sourcePath: string | undefined
): string | undefined {
  if (!instrument || !sourcePath) return instrument;

  const tradeSequenceLabel = getTradeSequenceLabel(sourcePath);
  if (!tradeSequenceLabel) return instrument;

  const sequencePattern = new RegExp(`[-_\\s]+${tradeSequenceLabel}$`, 'i');
  return instrument.replace(sequencePattern, '');
}

interface TradeHeaderProps extends PriceMoveValueInput {
  instrument: string | undefined;
  direction: string | undefined;
  entryTime?: Date | string | null;
  sourcePath?: string;
  onEditClick?: () => void;
  sessionNavigation?: React.ReactNode;
  showReviewNavigation?: boolean;
  reviewed?: boolean;
  onToggleReviewed?: () => void;
  outcome: {
    kind: 'profit' | 'loss' | 'breakeven';
  };
  pnl: number;
  percentChange: number;
  pnlInput?: {
    useDirectPnLInput?: boolean;
    directPnL?: number | null;
    originalPnlWasNull?: boolean;
  };
  noteKind?: 'trade' | 'missed-trade' | 'backtest-trade';
  
  exitTime?: Date | string | null;
  exitPrice?: number | null;
  tradeStatus?: string;
  lastBrokerSyncAt?: string;
  exits?: TradeFormData['exits'];
  entries?: TradeFormData['entries'];
  dividends?: TradeFormData['dividends'];
  commission?: number | null;
  commissionType?: TradeFormData['commissionType'];
  swap?: number | null;
  fees?: number | null;
  rebate?: number | null;
  
  optionType?: 'call' | 'put';
  rMultiple?: number;
  rMultipleDisplay?: {
    enabled: boolean;
    riskAmount?: number;
  };
  
  currency?: string;
  
  unrealizedPnL?: number | null;
  unrealizedPriceSnapshotTime?: TradeFormData['unrealizedPriceSnapshotTime'];
}

export const TradeHeader: React.FC<TradeHeaderProps> = ({
  instrument,
  direction,
  entryTime,
  sourcePath,
  onEditClick,
  sessionNavigation,
  showReviewNavigation = true,
  reviewed,
  onToggleReviewed,
  outcome,
  pnl,
  pnlInput,
  noteKind = 'trade',
  exitTime,
  exitPrice,
  tradeStatus,
  lastBrokerSyncAt,
  exits,
  entries,
  dividends,
  commission,
  commissionType,
  swap,
  fees,
  rebate,
  assetType,
  optionType,
  contractSize,
  dollarPerPoint,
  tickSize,
  tickValue,
  lotSize,
  pipValue,
  pipSize,
  forexPnlConversionRate,
  rMultiple,
  rMultipleDisplay,
  currency: tradeCurrency,
  unrealizedPnL,
  unrealizedPriceSnapshotTime,
}) => {
  const isBreakeven = outcome.kind === 'breakeven';
  const isProfit = outcome.kind === 'profit';
  const useDirectPnLInput = pnlInput?.useDirectPnLInput;
  const directPnL = pnlInput?.directPnL;
  const originalPnlWasNull = pnlInput?.originalPnlWasNull;
  const isMissedTrade = noteKind === 'missed-trade';
  const isBacktestTrade = noteKind === 'backtest-trade';
  const displayRMultiples = rMultipleDisplay?.enabled ?? false;
  const riskAmount = rMultipleDisplay?.riskAmount;
  const { currency: globalCurrency } = useCurrency();
  const currency = tradeCurrency || globalCurrency;
  const plugin = usePlugin();
  const { formatValue, shouldMask } = useDisplayFormatter();
  const isPnlMasked = shouldMask('pnl');
  const isNavigatingRef = React.useRef(false);
  const displayInstrument = getDisplayInstrument(instrument, sourcePath);
  const tradeSequenceLabel = getTradeHeaderSequenceLabel(sourcePath, noteKind);

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
  const isPartiallyClosed = tradeStatus === 'PARTIALLY_CLOSED';
  const isCancelled = tradeStatus === 'CANCELLED';
  const isAuthoritativeUnknownOutcome =
    tradeStatus === 'CLOSED' && originalPnlWasNull === true;

  const brokerSyncDate = lastBrokerSyncAt ? new Date(lastBrokerSyncAt) : null;
  const brokerSyncLabel =
    isOpen && brokerSyncDate && Number.isFinite(brokerSyncDate.getTime())
      ? t('trade.broker-synced-at', {
          date: formatLocalizedDateTime(brokerSyncDate),
        })
      : null;

  const directionDisplayKind = getTradeDirectionDisplayKind({
    direction,
    assetType,
    optionType,
  });
  const directionLabel = (() => {
    switch (directionDisplayKind) {
      case 'short':
        return t('form.field.direction.short');
      case 'put':
        return t('form.field.option-type.put');
      case 'call':
        return t('form.field.option-type.call');
      case 'long':
        return t('form.field.direction.long');
      default:
        return null;
    }
  })();

  const tradeDate = React.useMemo(() => {
    return getTradeHeaderReviewDate({ entryTime, sourcePath });
  }, [entryTime, sourcePath]);

  const formattedTradeWeekday = tradeDate
    ? HEADER_WEEKDAY_FORMATTER.format(tradeDate)
    : null;
  const tradeDayNumber = tradeDate ? tradeDate.getDate() : null;
  const tradeDaySuffix = tradeDayNumber
    ? getOrdinalSuffix(tradeDayNumber)
    : null;
  const tradeMonthLabel = tradeDate
    ? HEADER_MONTH_FORMATTER.format(tradeDate)
    : null;
  const tradeQuarterLabel = tradeDate
    ? `Q${Math.ceil((tradeDate.getMonth() + 1) / 3)}`
    : null;
  const tradeYearLabel = tradeDate ? String(tradeDate.getFullYear()) : null;
  const tradeWeekLabel = tradeDate
    ? `W${getWeekNumberForDate(
        tradeDate,
        getWeekStartDaySetting(plugin ?? undefined)
      )}`
    : null;

  const handleReviewNavigation = React.useCallback(
    async (target: HeaderReviewNavigationTarget) => {
      if (!plugin?.app || !tradeDate || isNavigatingRef.current) return;

      isNavigatingRef.current = true;
      try {
        const outcome = await openReviewPeriod(
          plugin,
          REVIEW_PERIOD_LEVEL_BY_TARGET[target],
          tradeDate,
          { createNewLeaf: false }
        );
        if (outcome === 'creation-disabled') {
          new Notice(t('trade-handoff.review.creation-disabled'));
        } else if (outcome === 'failed') {
          new Notice(t('trade-handoff.review.open-failed'));
        }
      } catch (error) {
        console.error('[TradeHeader] Failed to navigate to review:', error);
      } finally {
        isNavigatingRef.current = false;
      }
    },
    [plugin, tradeDate]
  );

  const handleReviewNavigationKeyDown = React.useCallback(
    (
      event: React.KeyboardEvent<HTMLSpanElement>,
      target: HeaderReviewNavigationTarget
    ) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      void handleReviewNavigation(target);
    },
    [handleReviewNavigation]
  );

  const defaultRiskAmount = plugin?.settings?.trade?.defaultRiskAmount;
  const priceMoveFields = {
    assetType,
    contractSize,
    dollarPerPoint,
    tickSize,
    tickValue,
    lotSize,
    pipValue,
    pipSize,
    forexPnlConversionRate,
  } satisfies Record<keyof PriceMoveValueInput, unknown>;

  const hasRealizedOpenComponents = hasRealizedStoredPnL({
    pnl,
    _originalPnlWasNull: originalPnlWasNull,
    tradeStatus,
    useDirectPnLInput,
    directPnL,
    exits,
    dividends,
    commission,
    swap,
    fees,
    rebate,
  });

  
  
  const openUnrealizedPnL =
    isOpen &&
    !isMissedTrade &&
    !isBacktestTrade &&
    unrealizedPnL !== null &&
    unrealizedPnL !== undefined
      ? unrealizedPnL
      : null;
  const headerPnlValue =
    openUnrealizedPnL !== null
      ? (hasRealizedOpenComponents
          ? calculateSnapshotRealizedPnL(
              {
                tradeStatus,
                direction,
                entryTime: entryTime instanceof Date ? entryTime : undefined,
                exitTime: exitTime instanceof Date ? exitTime : undefined,
                exitPrice: exitPrice ?? undefined,
                entries,
                exits,
                dividends,
                commission: commission ?? undefined,
                commissionType,
                swap: swap ?? undefined,
                fees: fees ?? undefined,
                rebate: rebate ?? undefined,
                optionType,
                ...priceMoveFields,
                unrealizedPriceSnapshotTime,
              },
              pnl
            )
          : 0) + openUnrealizedPnL
      : pnl;

  const effectiveRMultiple = calculateEffectiveRMultiple(
    headerPnlValue,
    isOpen ? undefined : rMultiple,
    riskAmount,
    defaultRiskAmount
  );

  const formattedPrivacyAwarePnL = formatValue({
    kind: 'pnl',
    value: headerPnlValue,
    currencyCode: currency,
    rMultiple: effectiveRMultiple,
  });
  const privacyAwarePnLPrefix =
    !isPnlMasked &&
    !displayRMultiples &&
    headerPnlValue > 0 &&
    !formattedPrivacyAwarePnL.startsWith('+')
      ? '+'
      : '';
  const formattedHeaderOutcome = `${privacyAwarePnLPrefix}${formattedPrivacyAwarePnL}`;
  const headerOutcomeParts = splitHeaderOutcomeValue(formattedHeaderOutcome);

  const getStatusClass = () => {
    if (isOpen) return 'open';
    if (isCancelled) return 'breakeven';
    if (isAuthoritativeUnknownOutcome) return 'unknown';
    if (isPnlMasked) return 'privacy-masked';
    if (isBreakeven) return 'breakeven';
    return isProfit ? 'profit' : 'loss';
  };

  const getTextClass = () => {
    if (isPnlMasked) return 'journalit-privacy-mask';
    if (openUnrealizedPnL !== null) {
      if (headerPnlValue === 0) return 'breakeven-text';
      return headerPnlValue > 0 ? 'profit-text' : 'loss-text';
    }
    if (isBreakeven) return 'breakeven-text';
    return isProfit ? 'profit-text' : 'loss-text';
  };

  const statusClass = getStatusClass();
  const specialStatusLabel = isBacktestTrade
    ? t('tradelog.status.backtest')
    : isMissedTrade
      ? t('tradelog.status.missed')
      : isPartiallyClosed
        ? t('tradelog.status.open')
        : isCancelled
          ? t('tradelog.status.cancelled')
          : isOpen
            ? t('tradelog.status.open')
            : null;
  const specialStatusClass = isBacktestTrade
    ? 'trade-type-badge--backtest'
    : isMissedTrade
      ? 'trade-type-badge--missed'
      : isPartiallyClosed
        ? 'trade-type-badge--open'
        : isCancelled
          ? 'trade-type-badge--cancelled'
          : isOpen
            ? 'trade-type-badge--open'
            : '';

  const shouldShowOutcomeValue =
    !isCancelled &&
    !isAuthoritativeUnknownOutcome &&
    (!isOpen ||
      isMissedTrade ||
      isBacktestTrade ||
      hasRealizedOpenComponents ||
      openUnrealizedPnL !== null);

  return (
    <div className={`trade-note-header ${statusClass}`}>
      <div className="trade-header-main-row">
        <div className="trade-instrument">
          {(directionLabel || specialStatusLabel) && (
            <span className="trade-instrument-meta-row">
              {directionLabel && (
                <span className="trade-instrument-direction">
                  {directionLabel}
                </span>
              )}
              {directionLabel && specialStatusLabel && (
                <span
                  className="trade-instrument-status-separator"
                  aria-hidden="true"
                >
                  ·
                </span>
              )}
              {specialStatusLabel && (
                <span className={`trade-type-badge ${specialStatusClass}`}>
                  {specialStatusLabel}
                </span>
              )}
            </span>
          )}
          <span className="trade-instrument-mainline">
            <span className="trade-instrument-title-row">
              <span className="trade-instrument-identity">
                <span className="trade-instrument-symbol">
                  {displayInstrument || t('trade.header.unknown-instrument')}
                </span>
                {tradeSequenceLabel && (
                  <span className="trade-instrument-sequence">
                    {tradeSequenceLabel}
                  </span>
                )}
              </span>
              {onToggleReviewed && (
                <button
                  type="button"
                  className="journalit-native-button journalit-native-button--unstyled trade-header-review-indicator"
                  onClick={onToggleReviewed}
                  onKeyDown={(event) => {
                    if (event.key !== 'Enter' && event.key !== ' ') return;
                    event.preventDefault();
                    onToggleReviewed();
                  }}
                  aria-label={
                    reviewed
                      ? t('widget.header.aria.mark-not-reviewed')
                      : t('widget.header.aria.mark-reviewed')
                  }
                >
                  {reviewed ? (
                    <CheckCircle2
                      size={20}
                      className="journalit-header-reviewed-icon"
                    />
                  ) : (
                    <Circle
                      size={20}
                      className="journalit-header-unreviewed-icon"
                    />
                  )}
                </button>
              )}
            </span>
          </span>
        </div>
        <div className="trade-pnl">
          {shouldShowOutcomeValue ? (
            <>
              {isOpen && !isMissedTrade && !isBacktestTrade && (
                <span className="trade-pnl-label">
                  
                  {isPnlMasked
                    ? t('form.field.floating-pnl')
                    : openUnrealizedPnL === null
                      ? t('form.field.realized-pnl')
                      : hasRealizedOpenComponents
                        ? t('form.field.floating-pnl')
                        : t('form.unrealized.preview')}
                </span>
              )}
              <span className={getTextClass()}>
                <span className="trade-pnl-primary">
                  {headerOutcomeParts.main}
                  {headerOutcomeParts.decimal && (
                    <span className="trade-pnl-cents">
                      {headerOutcomeParts.decimal}
                    </span>
                  )}
                </span>
                {headerOutcomeParts.suffix && (
                  <span className="trade-pnl-suffix">
                    {headerOutcomeParts.suffix}
                  </span>
                )}
              </span>
            </>
          ) : (
            <span className="open-text">
              {isCancelled
                ? t('tradelog.status.cancelled')
                : isAuthoritativeUnknownOutcome
                  ? t('common.unknown')
                  : t('tradelog.status.open')}
            </span>
          )}
        </div>
      </div>
      <div className="trade-header-context-row">
        <div className="trade-header-meta">
          {brokerSyncLabel && <span>{brokerSyncLabel}</span>}
          {brokerSyncLabel && showReviewNavigation && formattedTradeWeekday && (
            <span className="trade-header-context-separator">·</span>
          )}
          {showReviewNavigation &&
            formattedTradeWeekday &&
            tradeDayNumber &&
            tradeDaySuffix &&
            tradeDate && (
              <>
                <button
                  type="button"
                  className="journalit-native-button journalit-native-button--unstyled trade-header-context-link"
                  onClick={() => void handleReviewNavigation('drc')}
                  onKeyDown={(event) =>
                    handleReviewNavigationKeyDown(event, 'drc')
                  }
                >
                  {formattedTradeWeekday}, {tradeDayNumber}
                  <span className="trade-header-ordinal-suffix">
                    {tradeDaySuffix}
                  </span>
                </button>
                {tradeWeekLabel && (
                  <>
                    <span className="trade-header-context-separator">·</span>
                    <button
                      type="button"
                      className="journalit-native-button journalit-native-button--unstyled trade-header-context-link"
                      onClick={() => void handleReviewNavigation('weekly')}
                      onKeyDown={(event) =>
                        handleReviewNavigationKeyDown(event, 'weekly')
                      }
                    >
                      {tradeWeekLabel}
                    </button>
                  </>
                )}
                {tradeMonthLabel && (
                  <>
                    <span className="trade-header-context-separator">·</span>
                    <button
                      type="button"
                      className="journalit-native-button journalit-native-button--unstyled trade-header-context-link"
                      onClick={() => void handleReviewNavigation('monthly')}
                      onKeyDown={(event) =>
                        handleReviewNavigationKeyDown(event, 'monthly')
                      }
                    >
                      {tradeMonthLabel}
                    </button>
                  </>
                )}
                {tradeQuarterLabel && (
                  <>
                    <span className="trade-header-context-separator">·</span>
                    <button
                      type="button"
                      className="journalit-native-button journalit-native-button--unstyled trade-header-context-link"
                      onClick={() => void handleReviewNavigation('quarterly')}
                      onKeyDown={(event) =>
                        handleReviewNavigationKeyDown(event, 'quarterly')
                      }
                    >
                      {tradeQuarterLabel}
                    </button>
                  </>
                )}
                {tradeYearLabel && (
                  <>
                    <span className="trade-header-context-separator">·</span>
                    <button
                      type="button"
                      className="journalit-native-button journalit-native-button--unstyled trade-header-context-link"
                      onClick={() => void handleReviewNavigation('yearly')}
                      onKeyDown={(event) =>
                        handleReviewNavigationKeyDown(event, 'yearly')
                      }
                    >
                      {tradeYearLabel}
                    </button>
                  </>
                )}
              </>
            )}
        </div>
        <div className="trade-header-actions">
          {sessionNavigation}
          {onEditClick && (
            <button
              type="button"
              className="journalit-header-icon-button"
              onClick={onEditClick}
              aria-label={t('button.edit')}
            >
              <Edit size={16} strokeWidth={2} aria-hidden="true" />
              <span>{t('button.edit')}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
