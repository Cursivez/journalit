

import React from 'react';
import type { TradeFormData } from '../../forms/trade/types';
import { calculateEffectiveRMultiple } from '../../../utils/formatting';
import { useDisplayFormatter } from '../../../hooks/useDisplayPolicy';
import {
  tradeShareSectionProps,
  tradeSharePnlValue,
  type TradeSharePnlMode,
} from '../../share/tradeShare/tradeShareModel';
import {
  hasRealizedStoredPnL,
  isTradeOpenWithContext,
} from '../../../utils/tradeStatusUtils';
import { useCurrency } from '../../../contexts/CurrencyContext';
import { usePlugin } from '../../../hooks/usePlugin';
import { t } from '../../../lang/helpers';
import { TradeRUnavailableHint } from '../../shared/display/RMultipleUnavailableHint';
import { getTradeDirectionDisplayKind } from '../../../services/trade/core/TradeDirection';
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
import {
  shareCaptureExcludeProps,
  shareDollarAmountProps,
} from '../../../services/share/brandedCapture';

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

function getTradeHeaderSequenceLabel(
  sourcePath: string | undefined,
  noteKind: TradeHeaderProps['noteKind']
): string | null {
  if (noteKind && noteKind !== 'trade') return null;

  const sequenceLabel = getTradeSequenceLabel(sourcePath);
  if (!sequenceLabel?.startsWith('T')) return null;

  const sequenceNumber = Number.parseInt(sequenceLabel.slice(1), 10);
  return sequenceNumber > 1 ? sequenceLabel : null;
}

function getTradeHeaderReviewDate({
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

function getDisplayInstrument(
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
  sharePnlDisplay?: {
    mode: TradeSharePnlMode;
    positionReturn: number | undefined;
    accountBalance: number | undefined;
  };
  pnlInput?: {
    useDirectPnLInput?: boolean;
    directPnL?: number | null;
    originalPnlWasNull?: boolean;
  };
  noteKind?: 'trade' | 'missed-trade' | 'backtest-trade';
  
  exitTime?: Date | string | null;
  exitPrice?: number | null;
  tradeStatus?: string;
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

function getDirectionLabel(
  kind: ReturnType<typeof getTradeDirectionDisplayKind>
): string | null {
  switch (kind) {
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
}

interface TradeHeaderDateLabels {
  weekday: string;
  dayNumber: number;
  daySuffix: string;
  week: string;
  month: string;
  quarter: string;
  year: string;
}

function getTradeHeaderDateLabels(
  tradeDate: Date | null,
  weekStartDay: ReturnType<typeof getWeekStartDaySetting>
): TradeHeaderDateLabels | null {
  if (!tradeDate) return null;
  const dayNumber = tradeDate.getDate();
  return {
    weekday: HEADER_WEEKDAY_FORMATTER.format(tradeDate),
    dayNumber,
    daySuffix: getOrdinalSuffix(dayNumber),
    week: `W${getWeekNumberForDate(tradeDate, weekStartDay)}`,
    month: HEADER_MONTH_FORMATTER.format(tradeDate),
    quarter: `Q${Math.ceil((tradeDate.getMonth() + 1) / 3)}`,
    year: String(tradeDate.getFullYear()),
  };
}

type HeaderOutcomeTone = 'unknown' | 'breakeven' | 'profit' | 'loss';

function returnPercentTone(
  value: number | null | undefined
): HeaderOutcomeTone {
  if (value == null) return 'unknown';
  if (value === 0) return 'breakeven';
  return value > 0 ? 'profit' : 'loss';
}

const OUTCOME_TEXT_CLASS = {
  unknown: '',
  breakeven: 'breakeven-text',
  profit: 'profit-text',
  loss: 'loss-text',
} satisfies Record<HeaderOutcomeTone, string>;

interface TradeHeaderOutcomeState {
  isOpen: boolean;
  isCancelled: boolean;
  isAuthoritativeUnknownOutcome: boolean;
  isPnlMasked: boolean;
  shareValue: ReturnType<typeof tradeSharePnlValue> | undefined;
  outcomeKind: TradeHeaderProps['outcome']['kind'];
  openUnrealizedPnL: number | null;
  headerPnlValue: number;
}

function getHeaderStatusClass(state: TradeHeaderOutcomeState): string {
  if (state.isOpen) return 'open';
  if (state.isCancelled) return 'breakeven';
  if (state.isAuthoritativeUnknownOutcome) return 'unknown';
  if (state.isPnlMasked) return 'privacy-masked';
  if (state.shareValue?.kind === 'returnPercent') {
    return returnPercentTone(state.shareValue.value);
  }
  return state.outcomeKind;
}

function getHeaderTextClass(state: TradeHeaderOutcomeState): string {
  if (state.isPnlMasked) return 'journalit-privacy-mask';
  if (state.shareValue?.kind === 'returnPercent') {
    return OUTCOME_TEXT_CLASS[returnPercentTone(state.shareValue.value)];
  }
  if (state.openUnrealizedPnL !== null) {
    if (state.headerPnlValue === 0) return 'breakeven-text';
    return state.headerPnlValue > 0 ? 'profit-text' : 'loss-text';
  }
  return OUTCOME_TEXT_CLASS[state.outcomeKind];
}

function getSpecialStatus({
  isBacktestTrade,
  isMissedTrade,
  isPartiallyClosed,
  isCancelled,
  isOpen,
}: {
  isBacktestTrade: boolean;
  isMissedTrade: boolean;
  isPartiallyClosed: boolean;
  isCancelled: boolean;
  isOpen: boolean;
}): { label: string; className: string } | null {
  if (isBacktestTrade) {
    return {
      label: t('tradelog.status.backtest'),
      className: 'trade-type-badge--backtest',
    };
  }
  if (isMissedTrade) {
    return {
      label: t('tradelog.status.missed'),
      className: 'trade-type-badge--missed',
    };
  }
  if (isPartiallyClosed) {
    return {
      label: t('tradelog.status.open'),
      className: 'trade-type-badge--open',
    };
  }
  if (isCancelled) {
    return {
      label: t('tradelog.status.cancelled'),
      className: 'trade-type-badge--cancelled',
    };
  }
  if (isOpen) {
    return {
      label: t('tradelog.status.open'),
      className: 'trade-type-badge--open',
    };
  }
  return null;
}


function getHeaderPnl({
  showsUnrealized,
  unrealizedPnL,
  hasRealizedOpenComponents,
  realizedPnL,
  pnl,
}: {
  showsUnrealized: boolean;
  unrealizedPnL: number | null | undefined;
  hasRealizedOpenComponents: boolean;
  realizedPnL: () => number;
  pnl: number;
}): { openUnrealizedPnL: number | null; headerPnlValue: number } {
  const openUnrealizedPnL =
    showsUnrealized && unrealizedPnL !== null && unrealizedPnL !== undefined
      ? unrealizedPnL
      : null;
  if (openUnrealizedPnL === null) {
    return { openUnrealizedPnL, headerPnlValue: pnl };
  }
  return {
    openUnrealizedPnL,
    headerPnlValue:
      (hasRealizedOpenComponents ? realizedPnL() : 0) + openUnrealizedPnL,
  };
}


function getOpenPnlLabel({
  isPnlMasked,
  openUnrealizedPnL,
  hasRealizedOpenComponents,
}: {
  isPnlMasked: boolean;
  openUnrealizedPnL: number | null;
  hasRealizedOpenComponents: boolean;
}): string {
  if (isPnlMasked) return t('form.field.floating-pnl');
  if (openUnrealizedPnL === null) return t('form.field.realized-pnl');
  return hasRealizedOpenComponents
    ? t('form.field.floating-pnl')
    : t('form.unrealized.preview');
}

function getHiddenOutcomeLabel({
  isCancelled,
  isAuthoritativeUnknownOutcome,
}: {
  isCancelled: boolean;
  isAuthoritativeUnknownOutcome: boolean;
}): string {
  if (isCancelled) return t('tradelog.status.cancelled');
  if (isAuthoritativeUnknownOutcome) return t('common.unknown');
  return t('tradelog.status.open');
}

const TradeHeaderMetaRow: React.FC<{
  directionLabel: string | null;
  specialStatus: { label: string; className: string } | null;
}> = ({ directionLabel, specialStatus }) => {
  if (!directionLabel && !specialStatus) return null;
  return (
    <span className="trade-instrument-meta-row">
      {directionLabel && (
        <span className="trade-instrument-direction">{directionLabel}</span>
      )}
      {directionLabel && specialStatus && (
        <span className="trade-instrument-status-separator" aria-hidden="true">
          ·
        </span>
      )}
      {specialStatus && (
        <span className={`trade-type-badge ${specialStatus.className}`}>
          {specialStatus.label}
        </span>
      )}
    </span>
  );
};

const TradeHeaderReviewedToggle: React.FC<{
  reviewed: boolean | undefined;
  onToggleReviewed: () => void;
}> = ({ reviewed, onToggleReviewed }) => (
  <button
    type="button"
    className="journalit-native-button journalit-native-button--unstyled trade-header-review-indicator"
    {...shareCaptureExcludeProps}
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
      <CheckCircle2 size={20} className="journalit-header-reviewed-icon" />
    ) : (
      <Circle size={20} className="journalit-header-unreviewed-icon" />
    )}
  </button>
);

const TradeHeaderOutcomeValue: React.FC<{
  textClassName: string;
  outcomeShownInDollars: boolean;
  parts: ReturnType<typeof splitHeaderOutcomeValue>;
}> = ({ textClassName, outcomeShownInDollars, parts }) => (
  <span
    className={textClassName}
    {...(outcomeShownInDollars ? shareDollarAmountProps : {})}
  >
    <span className="trade-pnl-primary">
      {parts.main}
      {parts.decimal && (
        <span className="trade-pnl-cents">{parts.decimal}</span>
      )}
    </span>
    {parts.suffix && <span className="trade-pnl-suffix">{parts.suffix}</span>}
  </span>
);

const TradeHeaderContextLink: React.FC<{
  target: HeaderReviewNavigationTarget;
  onNavigate: (target: HeaderReviewNavigationTarget) => void;
  children: React.ReactNode;
}> = ({ target, onNavigate, children }) => (
  <button
    type="button"
    className="journalit-native-button journalit-native-button--unstyled trade-header-context-link"
    onClick={() => onNavigate(target)}
    onKeyDown={(event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      onNavigate(target);
    }}
  >
    {children}
  </button>
);


const TradeHeaderReviewLinks: React.FC<{
  labels: TradeHeaderDateLabels;
  onNavigate: (target: HeaderReviewNavigationTarget) => void;
}> = ({ labels, onNavigate }) => {
  const periodLinks: Array<[HeaderReviewNavigationTarget, string]> = [
    ['weekly', labels.week],
    ['monthly', labels.month],
    ['quarterly', labels.quarter],
    ['yearly', labels.year],
  ];
  return (
    <>
      <TradeHeaderContextLink target="drc" onNavigate={onNavigate}>
        {labels.weekday}, {labels.dayNumber}
        <span className="trade-header-ordinal-suffix">{labels.daySuffix}</span>
      </TradeHeaderContextLink>
      {periodLinks.map(([target, label]) => (
        <React.Fragment key={target}>
          <span className="trade-header-context-separator">·</span>
          <TradeHeaderContextLink target={target} onNavigate={onNavigate}>
            {label}
          </TradeHeaderContextLink>
        </React.Fragment>
      ))}
    </>
  );
};

const defaultRiskAmountOf = (plugin: ReturnType<typeof usePlugin>) =>
  plugin?.settings?.trade?.defaultRiskAmount;

const rMultipleSettings = (
  rMultipleDisplay: TradeHeaderProps['rMultipleDisplay']
) => ({
  displayRMultiples: rMultipleDisplay?.enabled ?? false,
  riskAmount: rMultipleDisplay?.riskAmount,
});


function formatHeaderOutcome({
  sharePnlDisplay,
  headerPnlValue,
  rMultiple,
  currency,
  displayRMultiples,
  isPnlMasked,
  formatValue,
}: {
  sharePnlDisplay: TradeHeaderProps['sharePnlDisplay'];
  headerPnlValue: number;
  rMultiple: number | undefined;
  currency: string;
  displayRMultiples: boolean;
  isPnlMasked: boolean;
  formatValue: ReturnType<typeof useDisplayFormatter>['formatValue'];
}) {
  const shareValue = sharePnlDisplay
    ? tradeSharePnlValue({
        ...sharePnlDisplay,
        pnl: headerPnlValue,
        rMultiple,
        currency,
      })
    : undefined;
  const formattedPrivacyAwarePnL = formatValue(
    shareValue ?? {
      kind: 'pnl',
      value: headerPnlValue,
      currencyCode: currency,
      rMultiple,
    }
  );
  
  
  const outcomeShownInDollars = sharePnlDisplay
    ? sharePnlDisplay.mode === 'currency'
    : !displayRMultiples;
  const privacyAwarePnLPrefix =
    outcomeShownInDollars &&
    !isPnlMasked &&
    headerPnlValue > 0 &&
    !formattedPrivacyAwarePnL.startsWith('+')
      ? '+'
      : '';
  const formattedHeaderOutcome = `${privacyAwarePnLPrefix}${formattedPrivacyAwarePnL}`;
  
  
  const parts =
    shareValue?.kind === 'returnPercent'
      ? { main: formattedHeaderOutcome, decimal: null, suffix: null }
      : splitHeaderOutcomeValue(formattedHeaderOutcome);
  return { shareValue, outcomeShownInDollars, parts };
}


const showsOutcomeValue = ({
  isCancelled,
  isAuthoritativeUnknownOutcome,
  isLiveOpenTrade,
  hasRealizedOpenComponents,
  openUnrealizedPnL,
}: {
  isCancelled: boolean;
  isAuthoritativeUnknownOutcome: boolean;
  isLiveOpenTrade: boolean;
  hasRealizedOpenComponents: boolean;
  openUnrealizedPnL: number | null;
}): boolean =>
  !isCancelled &&
  !isAuthoritativeUnknownOutcome &&
  (!isLiveOpenTrade || hasRealizedOpenComponents || openUnrealizedPnL !== null);

const weekStartDayOf = (plugin: ReturnType<typeof usePlugin>) =>
  getWeekStartDaySetting(plugin ?? undefined);

const TradeHeaderIdentity: React.FC<{
  instrument: string | undefined;
  sequenceLabel: string | null;
}> = ({ instrument, sequenceLabel }) => (
  <span className="trade-instrument-identity">
    <span className="trade-instrument-symbol">
      {instrument || t('trade.header.unknown-instrument')}
    </span>
    {sequenceLabel && (
      <span className="trade-instrument-sequence">{sequenceLabel}</span>
    )}
  </span>
);

const TradeHeaderEditButton: React.FC<{
  onEditClick: (() => void) | undefined;
}> = ({ onEditClick }) => {
  if (!onEditClick) return null;
  return (
    <button
      type="button"
      className="journalit-header-icon-button"
      onClick={onEditClick}
      aria-label={t('button.edit')}
    >
      <Edit size={16} strokeWidth={2} aria-hidden="true" />
      <span>{t('button.edit')}</span>
    </button>
  );
};

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
  sharePnlDisplay,
  pnlInput,
  noteKind = 'trade',
  exitTime,
  exitPrice,
  tradeStatus,
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
  const { useDirectPnLInput, directPnL, originalPnlWasNull } = pnlInput ?? {};
  const isMissedTrade = noteKind === 'missed-trade';
  const isBacktestTrade = noteKind === 'backtest-trade';
  const { displayRMultiples, riskAmount } = rMultipleSettings(rMultipleDisplay);
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
  const isLiveOpenTrade = isOpen && !isMissedTrade && !isBacktestTrade;

  const directionLabel = getDirectionLabel(
    getTradeDirectionDisplayKind({ direction, assetType, optionType })
  );

  const tradeDate = React.useMemo(() => {
    return getTradeHeaderReviewDate({ entryTime, sourcePath });
  }, [entryTime, sourcePath]);
  const dateLabels = getTradeHeaderDateLabels(
    tradeDate,
    weekStartDayOf(plugin)
  );

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

  const defaultRiskAmount = defaultRiskAmountOf(plugin);
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

  const { openUnrealizedPnL, headerPnlValue } = getHeaderPnl({
    showsUnrealized: isLiveOpenTrade,
    unrealizedPnL,
    hasRealizedOpenComponents,
    realizedPnL: () =>
      calculateSnapshotRealizedPnL(
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
      ),
    pnl,
  });

  const effectiveRMultiple = calculateEffectiveRMultiple(
    headerPnlValue,
    isOpen ? undefined : rMultiple,
    riskAmount,
    defaultRiskAmount
  );

  const {
    shareValue,
    outcomeShownInDollars,
    parts: headerOutcomeParts,
  } = formatHeaderOutcome({
    sharePnlDisplay,
    headerPnlValue,
    rMultiple: effectiveRMultiple,
    currency,
    displayRMultiples,
    isPnlMasked,
    formatValue,
  });

  const outcomeState: TradeHeaderOutcomeState = {
    isOpen,
    isCancelled,
    isAuthoritativeUnknownOutcome,
    isPnlMasked,
    shareValue,
    outcomeKind: outcome.kind,
    openUnrealizedPnL,
    headerPnlValue,
  };
  const specialStatus = getSpecialStatus({
    isBacktestTrade,
    isMissedTrade,
    isPartiallyClosed,
    isCancelled,
    isOpen,
  });

  const shouldShowOutcomeValue = showsOutcomeValue({
    isCancelled,
    isAuthoritativeUnknownOutcome,
    isLiveOpenTrade,
    hasRealizedOpenComponents,
    openUnrealizedPnL,
  });

  return (
    <div
      className={`trade-note-header ${getHeaderStatusClass(outcomeState)}`}
      {...tradeShareSectionProps('header')}
    >
      <div className="trade-header-main-row">
        <div className="trade-instrument">
          <TradeHeaderMetaRow
            directionLabel={directionLabel}
            specialStatus={specialStatus}
          />
          <span className="trade-instrument-mainline">
            <span className="trade-instrument-title-row">
              <TradeHeaderIdentity
                instrument={displayInstrument}
                sequenceLabel={tradeSequenceLabel}
              />
              {onToggleReviewed && (
                <TradeHeaderReviewedToggle
                  reviewed={reviewed}
                  onToggleReviewed={onToggleReviewed}
                />
              )}
            </span>
          </span>
        </div>
        <div className="trade-pnl">
          {shouldShowOutcomeValue ? (
            <>
              {isLiveOpenTrade && (
                <span className="trade-pnl-label">
                  {getOpenPnlLabel({
                    isPnlMasked,
                    openUnrealizedPnL,
                    hasRealizedOpenComponents,
                  })}
                </span>
              )}
              <TradeRUnavailableHint
                disabled={sharePnlDisplay !== undefined}
                value={headerPnlValue}
                rMultiple={effectiveRMultiple}
              >
                <TradeHeaderOutcomeValue
                  textClassName={getHeaderTextClass(outcomeState)}
                  outcomeShownInDollars={outcomeShownInDollars}
                  parts={headerOutcomeParts}
                />
              </TradeRUnavailableHint>
            </>
          ) : (
            <span className="open-text">
              {getHiddenOutcomeLabel({
                isCancelled,
                isAuthoritativeUnknownOutcome,
              })}
            </span>
          )}
        </div>
      </div>
      <div className="trade-header-context-row">
        <div className="trade-header-meta">
          {showReviewNavigation && dateLabels && (
            <TradeHeaderReviewLinks
              labels={dateLabels}
              onNavigate={(target) => void handleReviewNavigation(target)}
            />
          )}
        </div>
        <div className="trade-header-actions" {...shareCaptureExcludeProps}>
          {sessionNavigation}
          <TradeHeaderEditButton onEditClick={onEditClick} />
        </div>
      </div>
    </div>
  );
};
