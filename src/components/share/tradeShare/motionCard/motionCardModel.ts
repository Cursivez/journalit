
import type { PartialTradeFrontmatter } from '../../../../types/TradeFrontmatter';
import type {
  DisplayValueKind,
  DisplayValueOptions,
} from '../../../../services/display/DisplayPolicy';
import { calculateTradeReturnPercent } from '../../../tradelog/tradeMetricUtils';
import { calculateEffectiveRMultiple } from '../../../../utils/formatting';
import { calculateSnapshotRealizedPnL } from '../../../../utils/unrealizedPnl';
import {
  getHeaderPnl,
  showsOutcomeValue,
  splitHeaderOutcomeValue,
} from '../../../trade/tradeHeaderOutcome';
import {
  getExecutionFillPrices,
  getExecutionLegs,
  getResolvedWeightedAverageExitPrice,
  getTotalEntrySize,
  getWeightedAverageEntryPrice,
  hasRealizedStoredPnL,
  isTradeOpenWithContext,
} from '../../../../utils/tradeStatusUtils';
import { t } from '../../../../lang/helpers';
import { tradeSharePnlValue, type TradeSharePnlMode } from '../tradeShareModel';

export type MotionCardAspect = 'landscape' | 'square' | 'portrait';
export type MotionCardRow = 'entry' | 'exit' | 'size' | 'return';

export const MOTION_CARD_ROWS: readonly MotionCardRow[] = [
  'entry',
  'exit',
  'size',
  'return',
];


export const MOTION_CARD_SIZES: Record<
  MotionCardAspect,
  { width: number; height: number }
> = {
  landscape: { width: 1920, height: 1080 },
  square: { width: 1080, height: 1080 },
  portrait: { width: 1080, height: 1920 },
};

export const MOTION_CARD_FPS = 30;
export const MOTION_CARD_MAX_SECONDS = 60;
const STILL_BACKGROUND_SECONDS = 8;


export interface MotionCardOutcomeSlot {
  char: string;
  
  digitIndex: number | null;
  
  small: boolean;
}

export type MotionCardTone = 'positive' | 'negative' | 'plain';

export interface MotionCardContent {
  instrument: string;
  subtitle: string;
  
  outcome: MotionCardOutcomeSlot[];
  
  tone: MotionCardTone;
  rows: { label: string; value: string }[];
}

export type MotionCardOutcomeClass = 'win' | 'loss' | 'breakeven';

export interface MotionCardContentInput {
  data: PartialTradeFrontmatter;
  pnl: number;
  
  unrealizedPnL: number | null;
  
  verified: boolean;
  
  outcomeClass: MotionCardOutcomeClass;
  currency: string;
  defaultRiskAmount: number | undefined;
  accountBalance: number | undefined;
  pnlMode: TradeSharePnlMode;
  rows: ReadonlySet<MotionCardRow>;
  fallbackInstrument: string;
  dateLocale: string | undefined;
  formatValue: (options: DisplayValueOptions) => string;
  shouldMask: (kind: DisplayValueKind) => boolean;
}

interface MotionCardOutcome {
  value: number | null;
  
  status: string | null;
  isLiveOpen: boolean;
}


export function resolveMotionCardOutcome(
  data: PartialTradeFrontmatter,
  pnl: number,
  unrealizedPnL: number | null
): MotionCardOutcome {
  const { tradeStatus } = data;
  const isCancelled = tradeStatus === 'CANCELLED';
  const isUnknown =
    tradeStatus === 'CLOSED' && data._originalPnlWasNull === true;
  const isOpen =
    tradeStatus === 'OPEN' ||
    isTradeOpenWithContext({
      useDirectPnLInput: data.useDirectPnLInput,
      exitTime: data.exitTime,
      exitPrice: data.exitPrice,
      tradeStatus,
      exits: data.exits,
      entries: data.entries,
      pnl: undefined,
    });
  const isLiveOpen =
    isOpen &&
    data.isMissedTrade !== true &&
    data.type !== 'missed-trade' &&
    data.type !== 'backtest-trade' &&
    data.isBacktestTrade !== true;
  const hasRealizedOpenComponents = hasRealizedStoredPnL({
    pnl,
    _originalPnlWasNull: data._originalPnlWasNull,
    tradeStatus,
    useDirectPnLInput: data.useDirectPnLInput,
    directPnL: data.directPnL,
    exits: data.exits,
    dividends: data.dividends,
    commission: data.commission,
    swap: data.swap,
    fees: data.fees,
    rebate: data.rebate,
  });
  const { openUnrealizedPnL, headerPnlValue } = getHeaderPnl({
    showsUnrealized: isLiveOpen,
    unrealizedPnL,
    hasRealizedOpenComponents,
    realizedPnL: () => calculateSnapshotRealizedPnL(data, pnl),
    pnl,
  });
  const showsValue = showsOutcomeValue({
    isCancelled,
    isAuthoritativeUnknownOutcome: isUnknown,
    isLiveOpenTrade: isLiveOpen,
    hasRealizedOpenComponents,
    openUnrealizedPnL,
  });
  if (showsValue) return { value: headerPnlValue, status: null, isLiveOpen };
  return {
    value: null,
    status: isCancelled
      ? t('filter.menu.status.cancelled')
      : isUnknown
        ? t('common.na')
        : t('tradelog.filter.open'),
    isLiveOpen,
  };
}


export function motionCardOutcomeSlots(
  text: string,
  smallDecimals: boolean
): MotionCardOutcomeSlot[] {
  if (!/[0-9]/.test(text)) {
    return [{ char: text, digitIndex: null, small: false }];
  }
  const parts = smallDecimals
    ? splitHeaderOutcomeValue(text)
    : { main: text, decimal: null, suffix: null };
  const slots = [
    ...[...parts.main].map((char) => ({ char, small: false })),
    ...[...`${parts.decimal ?? ''}${parts.suffix ?? ''}`].map((char) => ({
      char,
      small: true,
    })),
  ];
  let digits = 0;
  return slots
    .reverse()
    .map(({ char, small }) => ({
      char,
      small,
      digitIndex: /^[0-9]$/.test(char) ? digits++ : null,
    }))
    .reverse();
}

function subtitleOf(
  data: PartialTradeFrontmatter,
  dateLocale: string | undefined,
  isLiveOpen: boolean
): string {
  const direction =
    data.direction?.toLowerCase() === 'short'
      ? t('form.field.direction.short')
      : data.direction?.toLowerCase() === 'long'
        ? t('form.field.direction.long')
        : null;
  const date = data.entryTime ? new Date(data.entryTime) : null;
  const dateLabel =
    date && !Number.isNaN(date.getTime())
      ? new Intl.DateTimeFormat(dateLocale, {
          month: 'short',
          day: 'numeric',
        }).format(date)
      : null;
  
  return [direction, isLiveOpen ? t('tradelog.filter.open') : null, dateLabel]
    .filter((part) => part !== null)
    .join(' · ')
    .toLocaleUpperCase(dateLocale);
}

export function buildMotionCardContent(
  input: MotionCardContentInput
): MotionCardContent {
  const {
    data,
    pnl,
    currency,
    defaultRiskAmount,
    accountBalance,
    pnlMode,
    formatValue,
    shouldMask,
  } = input;
  const { value, status, isLiveOpen } = resolveMotionCardOutcome(
    data,
    pnl,
    input.unrealizedPnL
  );
  const rMultiple = calculateEffectiveRMultiple(
    value ?? undefined,
    isLiveOpen ? undefined : data.rMultiple,
    data.riskAmount,
    defaultRiskAmount
  );
  
  const positionReturn = calculateTradeReturnPercent(
    input.verified ? { ...data, leverageRatio: undefined } : data
  );
  const averageEntry = getWeightedAverageEntryPrice(data);
  const resolvedExit = getResolvedWeightedAverageExitPrice(data);
  
  const averageExit =
    isLiveOpen ||
    (data.useDirectPnLInput === true &&
      getExecutionLegs(data).exits.length === 0)
      ? null
      : resolvedExit;
  const fillPrices = getExecutionFillPrices(data);

  const headline: DisplayValueOptions | null =
    value === null
      ? null
      : {
          ...tradeSharePnlValue({
            mode: pnlMode,
            pnl: value,
            rMultiple,
            positionReturn,
            accountBalance,
            currency,
          }),
          ...(pnlMode === 'r' ? { precision: 2 } : {}),
          fallback: t('common.na'),
        };
  const headlineMasked = headline !== null && shouldMask(headline.kind);
  const formatted = headline
    ? formatValue(headline)
    : (status ?? t('common.na'));
  const outcomeText =
    pnlMode === 'currency' &&
    !headlineMasked &&
    value !== null &&
    value > 0 &&
    !formatted.startsWith('+')
      ? `+${formatted}`
      : formatted;
  
  
  const shownValue = headline?.value ?? 0;
  const followsBreakEven =
    !isLiveOpen && (pnlMode === 'currency' || pnlMode === 'r');
  const shownClass: MotionCardOutcomeClass = followsBreakEven
    ? input.outcomeClass
    : shownValue > 0
      ? 'win'
      : shownValue < 0
        ? 'loss'
        : 'breakeven';
  const tone: MotionCardTone =
    headlineMasked || !/[0-9]/.test(outcomeText)
      ? 'plain'
      : shownClass === 'win'
        ? 'positive'
        : shownClass === 'loss'
          ? 'negative'
          : 'plain';

  const priceValue = (value: number | null, fills: readonly number[]): string =>
    formatValue({
      kind: 'price',
      value,
      currencyCode: currency,
      priceStyle: 'decimal',
      fillPrices: fills,
      fallback: t('common.na'),
    });

  const rows: MotionCardContent['rows'] = [];
  if (input.rows.has('entry') && averageEntry !== null) {
    rows.push({
      label: t('trade.details.entry'),
      value: priceValue(averageEntry, fillPrices.entry),
    });
  }
  if (input.rows.has('exit') && averageExit !== null) {
    rows.push({
      label: t('trade.details.exit'),
      value: priceValue(averageExit, fillPrices.exit),
    });
  }
  const size = getTotalEntrySize(data);
  if (input.rows.has('size') && size !== null && size > 0) {
    rows.push({
      label: t('widget.trade-review.field.position-size'),
      value: formatValue({ kind: 'positionSize', value: size }),
    });
  }
  
  const returnValue: DisplayValueOptions =
    pnlMode !== 'r' && rMultiple !== undefined && !input.verified
      ? { kind: 'rMultiple', value: rMultiple, signed: true, precision: 2 }
      : { kind: 'returnPercent', value: positionReturn, signed: true };
  if (
    input.rows.has('return') &&
    status === null &&
    returnValue.value !== undefined
  ) {
    rows.push({
      label: t('share.motion.return'),
      value: formatValue(returnValue),
    });
  }

  return {
    instrument: data.instrument?.trim() || input.fallbackInstrument,
    subtitle: subtitleOf(data, input.dateLocale, isLiveOpen),
    outcome: motionCardOutcomeSlots(outcomeText, pnlMode === 'currency'),
    tone,
    rows,
  };
}


export function resolveMotionCardSeconds(
  selected: number | null,
  backgroundSeconds: number | null
): number {
  return (
    selected ??
    Math.min(
      backgroundSeconds ?? STILL_BACKGROUND_SECONDS,
      MOTION_CARD_MAX_SECONDS
    )
  );
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));


function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  const axis = (a: number, b: number, t: number) =>
    3 * (1 - t) ** 2 * t * a + 3 * (1 - t) * t ** 2 * b + t ** 3;
  return (x: number): number => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let low = 0;
    let high = 1;
    for (let step = 0; step < 24; step++) {
      const middle = (low + high) / 2;
      if (axis(x1, x2, middle) < x) low = middle;
      else high = middle;
    }
    return axis(y1, y2, (low + high) / 2);
  };
}

const easeOut = cubicBezier(0.23, 1, 0.32, 1);

const easeCount = cubicBezier(0.33, 1, 0.68, 1);


export function motionCardFrameCount(seconds: number): number {
  return Math.max(1, Math.round(seconds * MOTION_CARD_FPS));
}


export function motionCardFrameTime(
  index: number,
  frameCount: number,
  seconds: number
): number {
  return index === frameCount - 1 ? seconds : index / MOTION_CARD_FPS;
}


const SETTLE_SECONDS = 0.8;

const NUMBER_SETTLE_SECONDS = 1.6;
const SETTLE_SHARE_OF_LENGTH = 0.7;
const NUMBER_START_SECONDS = 0.05;
const FADE_SECONDS = 0.25;

const HEADLINE_FADE_SECONDS = 0.12;

export const MOTION_CARD_SEAL_DELAY_SECONDS = 0.25;
const COUNT_SECONDS = 1.5;


export function motionCardHeadlineAlpha(time: number): number {
  return clamp01(time / HEADLINE_FADE_SECONDS);
}


function decimalPlaces(text: string): number {
  return /[.,]([0-9]{1,2})[^0-9]*$/.exec(text)?.[1].length ?? 0;
}


export function motionCardCountSlots(
  outcome: MotionCardOutcomeSlot[],
  progress: number
): MotionCardOutcomeSlot[] {
  const digits = outcome.filter(({ digitIndex }) => digitIndex !== null);
  if (progress >= 1 || digits.length === 0) return outcome;
  const text = outcome.map(({ char }) => char).join('');
  const reached = String(
    Math.floor(Number(digits.map(({ char }) => char).join('')) * progress)
  );
  const shown = reached.padStart(decimalPlaces(text) + 1, '0');
  const firstDigit = outcome.findIndex(({ digitIndex }) => digitIndex !== null);
  const firstShown = outcome.findIndex(
    ({ digitIndex }) => digitIndex === shown.length - 1
  );
  return [
    ...outcome.slice(0, firstDigit),
    ...outcome
      .slice(firstShown)
      .map((slot) =>
        slot.digitIndex === null
          ? slot
          : { ...slot, char: shown[shown.length - 1 - slot.digitIndex] }
      ),
  ];
}


export function motionCardOutcomeAt(
  outcome: MotionCardOutcomeSlot[],
  time: number
): MotionCardOutcomeSlot[] {
  return motionCardCountSlots(outcome, easeCount(time / COUNT_SECONDS));
}

export interface MotionCardTimeline {
  
  numberTime: number;
  
  enter: (delay: number) => number;
  
  sealScale: () => number;
}


export function motionCardTimeline(
  time: number,
  seconds: number
): MotionCardTimeline {
  
  const longest = seconds * SETTLE_SHARE_OF_LENGTH;
  const clock =
    clamp01(time / Math.min(longest, SETTLE_SECONDS)) * SETTLE_SECONDS;
  const numberClock =
    clamp01(time / Math.min(longest, NUMBER_SETTLE_SECONDS)) *
    NUMBER_SETTLE_SECONDS;
  return {
    numberTime: numberClock - NUMBER_START_SECONDS,
    enter: (delay) => easeOut((clock - delay) / FADE_SECONDS),
    sealScale: () => {
      const progress = clamp01(
        (clock - MOTION_CARD_SEAL_DELAY_SECONDS) / FADE_SECONDS
      );
      const rest = 1 - progress;
      return 1 - rest ** 3 + 0.88 * progress * rest ** 2;
    },
  };
}
