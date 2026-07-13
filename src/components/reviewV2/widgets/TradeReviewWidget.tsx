import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useImperativeHandle,
} from 'react';
import type JournalitPlugin from '../../../main';
import type { TradeReviewData } from '../../../services/backend/types';
import type { CustomFieldDefinition } from '../../../types/customFields';
import { ImageCarousel } from '../../image/ImageCarousel';
import { useReviewTrades } from '../hooks/useReviewData';
import { useCurrency } from '../../../contexts/CurrencyContext';
import { useDisplayFormatter } from '../../../contexts/DisplayPolicyContext';
import { getCurrencyConfig } from '../../../utils/currencyConfig';
import { calculateEffectiveRMultiple } from '../../../utils/formatting';
import {
  getEffectivePnL,
  isTradeOpenWithContext,
} from '../../../utils/tradeStatusUtils';
import { getTradeDirectionDisplayKind } from '../../../services/trade/core/TradeDirection';

import { t } from '../../../lang/helpers';
import { ChevronDown } from '../../shared/icons/ObsidianIcon';
import {
  scrollToNextReviewItemAfterCollapse,
  StickyReviewHeaderPortal,
  useStickyReviewHeader,
} from './shared/StickyReviewHeader';
import { ReviewWidgetSkeleton } from './shared/ReviewWidgetSkeleton';

export type TradeReviewCardField =
  | 'entry'
  | 'exit'
  | 'duration'
  | 'risk'
  | 'positionSize'
  | 'stopLoss'
  | 'takeProfit'
  | 'fees'
  | 'commission'
  | 'mae'
  | 'mfe'
  | 'account'
  | 'setup'
  | 'mistakes'
  | 'tags'
  | 'thesis'
  | 'notes'
  | 'customFields';

export interface TradeReviewQuestionConfig {
  id: string;
  label: string;
  placeholder?: string;
}

export interface TradeReviewWidgetConfig {
  defaultExpanded?: boolean;
  showReviewedTrades?: boolean;
  showOpenTrades?: boolean;
  fields?: TradeReviewCardField[];
  primaryMetrics?: TradeReviewCardField[];
  classificationFields?: TradeReviewCardField[];
  moreContextFields?: TradeReviewCardField[];
  showImages?: boolean;
  winQuestions?: TradeReviewQuestionConfig[];
  lossQuestions?: TradeReviewQuestionConfig[];
  breakevenQuestions?: TradeReviewQuestionConfig[];
  openQuestions?: TradeReviewQuestionConfig[];
}

interface TradeReviewWidgetProps {
  filePath: string;
  plugin: JournalitPlugin;
  config?: TradeReviewWidgetConfig;
  preview?: boolean;
  previewData?: { trades: unknown[] };
}

type ReviewTrade = Record<string, unknown> & {
  id?: string | number;
  tradeId?: string;
  path?: string;
  instrument?: string;
  direction?: string;
  assetType?: string;
  optionType?: string;
  entryTime?: Date | string;
  exitTime?: Date | string;
  entryPrice?: number;
  exitPrice?: number;
  positionSize?: number;
  entries?: Array<{ time?: Date | string; price?: number; size?: number }>;
  exits?: Array<{ time?: Date | string; price?: number; size?: number }>;
  pnl?: number | null;
  directPnL?: number | null;
  useDirectPnLInput?: boolean;
  rMultiple?: number;
  riskAmount?: number;
  stopLoss?: number;
  takeProfits?: Array<{ price?: number; closePercent?: number }>;
  commission?: number;
  fees?: number;
  mae?: number;
  mfe?: number;
  account?: string | string[];
  setup?: string[];
  mistake?: string[];
  tags?: string[];
  customTags?: string[];
  images?: string[] | string;
  tradeStatus?: string;
  tradeReview?: TradeReviewData;
  reviewed?: boolean;
  reviewedAt?: string;
  isMissedTrade?: boolean;
  isBacktestTrade?: boolean;
  isCopiedTrade?: boolean;
  reviewSessionVisible?: boolean;
  thesis?: string;
  notes?: string;
  customFields?: Record<string, unknown>;
};

type TradeReviewQuestionSaveHandle = {
  flushPendingSaves: () => Promise<void>;
};

const DEFAULT_FIELDS: TradeReviewCardField[] = [
  'entry',
  'exit',
  'duration',
  'risk',
  'account',
  'setup',
  'mistakes',
  'tags',
  'thesis',
  'notes',
  'customFields',
];

const DEFAULT_WIN_QUESTIONS: TradeReviewQuestionConfig[] = [
  {
    id: 'win-what-worked',
    label: t('widget.trade-review.question.win-what-worked'),
    placeholder: t('widget.trade-review.placeholder.win-what-worked'),
  },
  {
    id: 'win-repeatable',
    label: t('widget.trade-review.question.win-repeatable'),
    placeholder: t('widget.trade-review.placeholder.win-repeatable'),
  },
  {
    id: 'win-key-lesson',
    label: t('widget.trade-review.question.key-lesson'),
    placeholder: t('widget.trade-review.placeholder.key-lesson'),
  },
];

const DEFAULT_LOSS_QUESTIONS: TradeReviewQuestionConfig[] = [
  {
    id: 'loss-what-went-wrong',
    label: t('widget.trade-review.question.loss-what-went-wrong'),
    placeholder: t('widget.trade-review.placeholder.loss-what-went-wrong'),
  },
  {
    id: 'loss-valid-or-mistake',
    label: t('widget.trade-review.question.loss-valid-or-mistake'),
    placeholder: t('widget.trade-review.placeholder.loss-valid-or-mistake'),
  },
  {
    id: 'loss-avoid-next-time',
    label: t('widget.trade-review.question.loss-avoid-next-time'),
    placeholder: t('widget.trade-review.placeholder.loss-avoid-next-time'),
  },
];

const DEFAULT_BREAKEVEN_QUESTIONS: TradeReviewQuestionConfig[] = [
  {
    id: 'be-managed-correctly',
    label: t('widget.trade-review.question.be-managed-correctly'),
    placeholder: t('widget.trade-review.placeholder.be-managed-correctly'),
  },
  {
    id: 'be-key-lesson',
    label: t('widget.trade-review.question.key-lesson'),
    placeholder: t('widget.trade-review.placeholder.key-lesson'),
  },
];

const DEFAULT_OPEN_QUESTIONS: TradeReviewQuestionConfig[] = [];

const SESSION_VISIBLE_REVIEWED_PATHS_BY_REVIEW = new Map<string, Set<string>>();
const RECENT_REVIEW_TOGGLE_VISIBLE_UNTIL_BY_REVIEW = new Map<
  string,
  Map<string, number>
>();
const REVIEW_TOGGLE_VISIBILITY_GRACE_MS = 5000;
const SCROLL_RESTORE_DELAYS_MS = [0, 16, 50, 100, 200, 400, 800, 1200];
const LAST_NON_EMPTY_DISPLAY_TRADES_BY_REVIEW = new Map<
  string,
  { trades: ReviewTrade[]; visibleUntil: number }
>();
const REVIEW_CARD_EXPANSION_BY_REVIEW = new Map<string, Map<string, boolean>>();

function getStoredCardExpansion(
  reviewFilePath: string,
  cardKey: string
): boolean | undefined {
  return REVIEW_CARD_EXPANSION_BY_REVIEW.get(reviewFilePath)?.get(cardKey);
}

function setStoredCardExpansion(
  reviewFilePath: string,
  cardKey: string,
  expanded: boolean
): void {
  const reviewExpansion =
    REVIEW_CARD_EXPANSION_BY_REVIEW.get(reviewFilePath) ??
    new Map<string, boolean>();
  reviewExpansion.set(cardKey, expanded);
  REVIEW_CARD_EXPANSION_BY_REVIEW.set(reviewFilePath, reviewExpansion);
}

type ReviewScrollSnapshot = {
  leafContent: HTMLElement;
  cmScrollTop?: number;
  readingScrollTop?: number;
  previewScrollTop?: number;
};

function captureReviewScrollSnapshot(
  sourceElement: HTMLElement | null = window.activeDocument
    .activeElement instanceof HTMLElement
    ? window.activeDocument.activeElement
    : null
): ReviewScrollSnapshot | null {
  if (!sourceElement) return null;

  const leafContent = sourceElement.closest<HTMLElement>(
    '.workspace-leaf-content'
  );
  if (!leafContent) return null;

  const cmScroller = sourceElement.closest<HTMLElement>('.cm-scroller');
  const readingView = sourceElement.closest<HTMLElement>(
    '.markdown-reading-view'
  );
  const previewView = sourceElement.closest<HTMLElement>(
    '.markdown-preview-view'
  );

  return {
    leafContent,
    cmScrollTop: cmScroller?.scrollTop,
    readingScrollTop: readingView?.scrollTop,
    previewScrollTop: previewView?.scrollTop,
  };
}

function restoreReviewScrollSnapshot(
  snapshot: ReviewScrollSnapshot | null
): void {
  if (!snapshot) return;

  SCROLL_RESTORE_DELAYS_MS.forEach((delay) => {
    window.setTimeout(() => applyReviewScrollSnapshot(snapshot), delay);
  });
}

function applyReviewScrollSnapshot(snapshot: ReviewScrollSnapshot): void {
  const cmScroller =
    snapshot.leafContent.querySelector<HTMLElement>('.cm-scroller');
  if (cmScroller && snapshot.cmScrollTop !== undefined) {
    cmScroller.scrollTop = snapshot.cmScrollTop;
  }

  const readingView = snapshot.leafContent.querySelector<HTMLElement>(
    '.markdown-reading-view'
  );
  if (readingView && snapshot.readingScrollTop !== undefined) {
    readingView.scrollTop = snapshot.readingScrollTop;
  }

  const previewView = snapshot.leafContent.querySelector<HTMLElement>(
    '.markdown-preview-view'
  );
  if (previewView && snapshot.previewScrollTop !== undefined) {
    previewView.scrollTop = snapshot.previewScrollTop;
  }
}

function startReviewScrollGuard(
  snapshot: ReviewScrollSnapshot | null
): (restoreAfterRelease?: boolean) => void {
  if (!snapshot) return () => undefined;

  let released = false;
  let frameId: number | undefined;

  const guard = () => {
    applyReviewScrollSnapshot(snapshot);
    if (released) return;

    frameId = window.requestAnimationFrame(guard);
  };

  guard();

  return (restoreAfterRelease = true) => {
    released = true;
    if (frameId !== undefined) {
      window.cancelAnimationFrame(frameId);
    }
    if (restoreAfterRelease) {
      restoreReviewScrollSnapshot(snapshot);
    }
  };
}

function focusAdjacentReviewTextarea(
  currentTextarea: HTMLTextAreaElement,
  direction: 1 | -1
): boolean {
  const widget = currentTextarea.closest<HTMLElement>(
    '.journalit-trade-review-widget'
  );
  if (!widget) return false;

  const textareas = Array.from(
    widget.querySelectorAll<HTMLTextAreaElement>(
      '.journalit-trade-review-textarea'
    )
  );
  const currentIndex = textareas.indexOf(currentTextarea);
  const nextTextarea = textareas[currentIndex + direction];
  if (!nextTextarea) return false;

  nextTextarea.focus();
  return true;
}

function isTradeReviewTextareaFocused(): boolean {
  const activeElement = window.activeDocument.activeElement;
  return (
    activeElement instanceof HTMLTextAreaElement &&
    activeElement.classList.contains('journalit-trade-review-textarea')
  );
}

function getSessionVisibleReviewedPaths(reviewFilePath: string): Set<string> {
  return new Set(
    SESSION_VISIBLE_REVIEWED_PATHS_BY_REVIEW.get(reviewFilePath) ?? []
  );
}

function setSessionVisibleReviewedPath(
  reviewFilePath: string,
  tradeFilePath: string,
  keepVisible: boolean
): Set<string> {
  const reviewRecentToggles =
    RECENT_REVIEW_TOGGLE_VISIBLE_UNTIL_BY_REVIEW.get(reviewFilePath) ??
    new Map<string, number>();
  reviewRecentToggles.set(
    tradeFilePath,
    Date.now() + REVIEW_TOGGLE_VISIBILITY_GRACE_MS
  );
  RECENT_REVIEW_TOGGLE_VISIBLE_UNTIL_BY_REVIEW.set(
    reviewFilePath,
    reviewRecentToggles
  );
  const nextPaths = getSessionVisibleReviewedPaths(reviewFilePath);
  if (keepVisible) {
    nextPaths.add(tradeFilePath);
  } else {
    nextPaths.delete(tradeFilePath);
  }

  if (nextPaths.size === 0) {
    SESSION_VISIBLE_REVIEWED_PATHS_BY_REVIEW.delete(reviewFilePath);
  } else {
    SESSION_VISIBLE_REVIEWED_PATHS_BY_REVIEW.set(reviewFilePath, nextPaths);
  }

  return nextPaths;
}

function hasRecentReviewToggle(
  reviewFilePath: string,
  tradeFilePath: string
): boolean {
  const reviewRecentToggles =
    RECENT_REVIEW_TOGGLE_VISIBLE_UNTIL_BY_REVIEW.get(reviewFilePath);
  const visibleUntil = reviewRecentToggles?.get(tradeFilePath);
  if (visibleUntil === undefined) return false;
  if (visibleUntil > Date.now()) return true;
  reviewRecentToggles?.delete(tradeFilePath);
  if (reviewRecentToggles?.size === 0) {
    RECENT_REVIEW_TOGGLE_VISIBLE_UNTIL_BY_REVIEW.delete(reviewFilePath);
  }
  return false;
}

export function getStableDisplayTrades(
  reviewFilePath: string,
  displayTrades: ReviewTrade[],
  options: { isTransientRefresh: boolean } = { isTransientRefresh: false }
): ReviewTrade[] {
  if (displayTrades.length > 0) {
    LAST_NON_EMPTY_DISPLAY_TRADES_BY_REVIEW.set(reviewFilePath, {
      trades: displayTrades,
      visibleUntil: Date.now() + REVIEW_TOGGLE_VISIBILITY_GRACE_MS,
    });
    return displayTrades;
  }

  if (!options.isTransientRefresh) {
    LAST_NON_EMPTY_DISPLAY_TRADES_BY_REVIEW.delete(reviewFilePath);
    return displayTrades;
  }

  const lastDisplay =
    LAST_NON_EMPTY_DISPLAY_TRADES_BY_REVIEW.get(reviewFilePath);
  if (!lastDisplay) return displayTrades;
  if (lastDisplay.visibleUntil < Date.now()) {
    LAST_NON_EMPTY_DISPLAY_TRADES_BY_REVIEW.delete(reviewFilePath);
    return displayTrades;
  }
  return lastDisplay.trades;
}

function ReviewedCheckmark() {
  return (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

const DATE_TIME_FORMATTER = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

const TIME_FORMATTER = new Intl.DateTimeFormat(undefined, {
  hour: '2-digit',
  minute: '2-digit',
});

export function asReviewTrades(value: unknown): ReviewTrade[] {
  return Array.isArray(value)
    ? value.filter((item): item is ReviewTrade =>
        Boolean(
          item &&
          typeof item === 'object' &&
          !Array.isArray(item) &&
          Reflect.get(item, 'isCopiedTrade') !== true
        )
      )
    : [];
}

function parseDate(value: Date | string | undefined): Date | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function sameCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatTradeTime(trade: ReviewTrade): string {
  const entryDate = parseDate(trade.entryTime ?? trade.entries?.[0]?.time);
  const exitDate = parseDate(
    trade.exitTime ?? trade.exits?.[trade.exits.length - 1]?.time
  );
  if (!entryDate && !exitDate) return t('common.na');
  if (entryDate && !exitDate) {
    return `${DATE_TIME_FORMATTER.format(entryDate)} → ${t('widget.trade-review.time.open')}`;
  }
  if (!entryDate && exitDate)
    return `— → ${DATE_TIME_FORMATTER.format(exitDate)}`;
  if (!entryDate || !exitDate) return t('common.na');
  if (sameCalendarDay(entryDate, exitDate)) {
    return `${TIME_FORMATTER.format(entryDate)} → ${TIME_FORMATTER.format(exitDate)}`;
  }
  return `${DATE_TIME_FORMATTER.format(entryDate)} → ${DATE_TIME_FORMATTER.format(exitDate)}`;
}

function formatDuration(trade: ReviewTrade): string {
  const entryDate = parseDate(trade.entryTime ?? trade.entries?.[0]?.time);
  const exitDate = parseDate(
    trade.exitTime ?? trade.exits?.[trade.exits.length - 1]?.time
  );
  if (!entryDate || !exitDate) return t('common.na');
  const minutes = Math.max(
    0,
    Math.round((exitDate.getTime() - entryDate.getTime()) / 60000)
  );
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return remaining > 0 ? `${hours}h ${remaining}m` : `${hours}h`;
}

function normalizeImages(images: ReviewTrade['images']): string[] {
  if (!images) return [];
  if (Array.isArray(images)) {
    return images.flatMap(normalizeImagePath);
  }
  if (typeof images !== 'string') return [];
  const trimmed = images.trim();
  if (!trimmed) return [];
  try {
    const parsed: unknown = JSON.parse(trimmed);
    return Array.isArray(parsed)
      ? parsed.flatMap(normalizeImagePath)
      : normalizeImagePath(trimmed);
  } catch {
    return normalizeImagePath(trimmed);
  }
}

function normalizeImagePath(image: unknown): string[] {
  if (typeof image !== 'string') return [];
  const trimmed = image.trim().replace(/^['"]|['"]$/g, '');
  return trimmed ? [trimmed] : [];
}

function uniqueInstruments(trades: ReviewTrade[]): Set<string> {
  return new Set(
    trades.flatMap((trade) => {
      const instrument =
        typeof trade.instrument === 'string' ? trade.instrument.trim() : '';
      return instrument ? [instrument] : [];
    })
  );
}

function getTradeKey(trade: ReviewTrade, index: number): string {
  return String(trade.tradeId ?? trade.id ?? trade.path ?? `trade-${index}`);
}

export function getOutcome(
  trade: ReviewTrade
): 'win' | 'loss' | 'breakeven' | 'open' {
  const isOpen = isTradeOpenWithContext({
    tradeStatus: trade.tradeStatus,
    exitTime: trade.exitTime,
    exitPrice: trade.exitPrice,
    pnl: trade.pnl,
    useDirectPnLInput: trade.useDirectPnLInput,
    exits: trade.exits,
    entries: trade.entries,
  });
  if (isOpen) return 'open';
  const pnl = getEffectivePnL(trade);
  if (pnl === null || pnl === 0) return 'breakeven';
  return pnl > 0 ? 'win' : 'loss';
}

export function getQuestions(
  config: TradeReviewWidgetConfig,
  outcome: ReturnType<typeof getOutcome>
): TradeReviewQuestionConfig[] {
  if (outcome === 'win') return config.winQuestions ?? DEFAULT_WIN_QUESTIONS;
  if (outcome === 'loss') return config.lossQuestions ?? DEFAULT_LOSS_QUESTIONS;
  if (outcome === 'breakeven')
    return config.breakevenQuestions ?? DEFAULT_BREAKEVEN_QUESTIONS;
  return config.openQuestions ?? DEFAULT_OPEN_QUESTIONS;
}

export function getDisplayQuestions(
  config: TradeReviewWidgetConfig,
  outcome: ReturnType<typeof getOutcome>,
  isOutcomeMasked: boolean
): TradeReviewQuestionConfig[] {
  if (isOutcomeMasked) return [];
  return getQuestions(config, outcome);
}

export function getPreferredOutcomeLabel({
  outcome,
  displayRMultiples,
  effectiveR,
  pnl,
  currency,
  formatValue,
}: {
  outcome: ReturnType<typeof getOutcome>;
  displayRMultiples: boolean;
  effectiveR: number | undefined;
  pnl: number | null;
  currency: string;
  formatValue: ReturnType<typeof useDisplayFormatter>['formatValue'];
}): string {
  if (outcome === 'open') {
    return t('widget.trade-review.time.open');
  }

  if (displayRMultiples) {
    return effectiveR !== undefined
      ? formatValue({ kind: 'rMultiple', value: effectiveR })
      : t('common.na');
  }

  return formatValue({ kind: 'pnl', value: pnl, currencyCode: currency });
}

function getReviewText(
  review: TradeReviewData | undefined,
  question: TradeReviewQuestionConfig
): string {
  return (
    review?.sections?.[question.id]?.textAreas?.[question.id] ??
    review?.sections?.[question.label]?.textAreas?.[question.label] ??
    ''
  );
}

function formatItems(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter(
      (item): item is string =>
        typeof item === 'string' && item.trim().length > 0
    );
  }
  if (typeof value === 'string' && value.trim()) return [value.trim()];
  return [];
}

function formatDirectionLabel(trade: ReviewTrade): string | null {
  const directionKind = getTradeDirectionDisplayKind({
    direction: trade.direction,
    assetType: trade.assetType,
    optionType: trade.optionType,
  });

  return directionKind === 'unknown' ? null : directionKind.toUpperCase();
}

const METRIC_FIELD_SET = new Set<TradeReviewCardField>([
  'entry',
  'exit',
  'duration',
  'risk',
  'positionSize',
  'stopLoss',
  'takeProfit',
  'fees',
  'commission',
  'mae',
  'mfe',
]);

const CONTEXT_FIELD_SET = new Set<TradeReviewCardField>([
  'account',
  'setup',
  'mistakes',
  'tags',
]);

function TradeReviewMetrics({
  fields,
  values,
}: {
  fields: TradeReviewCardField[];
  values: Partial<Record<TradeReviewCardField, string>>;
}) {
  const visibleFields = fields.filter((field) =>
    isPresentDisplayValue(values[field] ?? '')
  );
  if (visibleFields.length === 0) return null;

  return (
    <div
      className={`journalit-trade-review-metrics journalit-trade-review-metrics--count-${visibleFields.length}`}
    >
      {visibleFields.map((field) => (
        <div key={field} className="journalit-trade-review-metric-card">
          <span className="journalit-trade-review-metric-label">
            {getFieldLabel(field)}
          </span>
          <span className="journalit-trade-review-metric-value">
            {values[field]}
          </span>
        </div>
      ))}
    </div>
  );
}

function TradeReviewContext({
  fields,
  itemsByField,
}: {
  fields: TradeReviewCardField[];
  itemsByField: Partial<Record<TradeReviewCardField, string[]>>;
}) {
  const visibleFields = fields.filter(
    (field) => (itemsByField[field] ?? []).length > 0
  );
  if (visibleFields.length === 0) return null;

  return (
    <div className="journalit-trade-review-context">
      {visibleFields.map((field) => {
        const items = itemsByField[field] ?? [];
        return (
          <div key={field} className="journalit-trade-review-context-row">
            <span className="journalit-trade-review-context-label">
              {getFieldLabel(field)}
            </span>
            <span className="journalit-trade-review-context-values">
              {items.map((item) => (
                <span
                  key={item}
                  className={`journalit-trade-review-context-chip journalit-trade-review-context-chip--${field}`}
                >
                  {item}
                </span>
              ))}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function isPresentDisplayValue(value: string): boolean {
  const trimmedValue = value.trim();
  return trimmedValue.length > 0 && trimmedValue !== t('common.na');
}

function toFiniteNumber(value: unknown): number | null {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }
  if (typeof value === 'string') {
    const parsedValue = Number(value.trim());
    return Number.isFinite(parsedValue) ? parsedValue : null;
  }
  return null;
}

interface TradeReviewMoreContextItem {
  id: string;
  label: string;
  value: string;
  multiline?: boolean;
}

function TradeReviewMoreContext({
  items,
}: {
  items: TradeReviewMoreContextItem[];
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  if (items.length === 0) return null;

  return (
    <div
      className={`journalit-trade-review-more-context ${isExpanded ? 'journalit-trade-review-more-context--expanded' : ''}`}
    >
      <button
        type="button"
        className="journalit-trade-review-more-context-toggle"
        aria-expanded={isExpanded}
        onClick={() => setIsExpanded((expanded) => !expanded)}
      >
        <span
          className={`journalit-weekly-drc-accordion-indicator journalit-trade-review-more-context-chevron ${isExpanded ? 'is-expanded' : ''}`}
          aria-hidden="true"
        >
          <ChevronDown size={14} />
        </span>
        <span>{t('widget.trade-review.more-context')}</span>
        <span className="journalit-trade-review-more-context-count">
          {items.length}
        </span>
      </button>
      {isExpanded && (
        <div className="journalit-trade-review-more-context-body">
          {items.map((item) => (
            <div
              key={item.id}
              className={`journalit-trade-review-more-context-row ${item.multiline ? 'journalit-trade-review-more-context-row--multiline' : ''}`}
            >
              <span className="journalit-trade-review-more-context-label">
                {item.label}
              </span>
              <span className="journalit-trade-review-more-context-value">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function formatContextScalar(value: unknown): string {
  if (Array.isArray(value)) {
    const formattedValues: string[] = [];
    for (const item of value) {
      const formattedValue = formatContextScalar(item);
      if (isPresentDisplayValue(formattedValue)) {
        formattedValues.push(formattedValue);
      }
    }
    return formattedValues.join(', ');
  }
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  if (typeof value === 'boolean')
    return value ? t('common.yes') : t('common.no');
  if (value instanceof Date) return value.toLocaleDateString();
  return '';
}

function addMoreContextItem(
  items: TradeReviewMoreContextItem[],
  item: TradeReviewMoreContextItem
) {
  if (!isPresentDisplayValue(item.value)) return;
  items.push(item);
}

function formatTakeProfitValues(
  takeProfits: ReviewTrade['takeProfits'],
  formatPrice: (value: unknown) => string
): string {
  if (!Array.isArray(takeProfits)) return t('common.na');
  const values: string[] = [];
  for (const target of takeProfits) {
    const formattedTarget = formatPrice(toFiniteNumber(target.price));
    if (isPresentDisplayValue(formattedTarget)) {
      values.push(formattedTarget);
    }
  }
  return values.join(', ');
}

function getCustomFieldValue(
  trade: ReviewTrade,
  field: CustomFieldDefinition
): unknown {
  if (
    trade.customFields &&
    Object.prototype.hasOwnProperty.call(trade.customFields, field.id)
  ) {
    return trade.customFields[field.id];
  }
  return trade[field.fieldKey];
}

function buildMoreContextItems({
  fields,
  trade,
  customFieldDefinitions,
  formatPrice,
  formatMoney,
  formatPositionSize,
  formatCustomFieldValue,
}: {
  fields: TradeReviewCardField[];
  trade: ReviewTrade;
  customFieldDefinitions: CustomFieldDefinition[];
  formatPrice: (value: unknown) => string;
  formatMoney: (value: number | null) => string;
  formatPositionSize: (value: unknown) => string;
  formatCustomFieldValue: (value: unknown) => string;
}): TradeReviewMoreContextItem[] {
  const items: TradeReviewMoreContextItem[] = [];
  const shouldShow = (field: TradeReviewCardField) => fields.includes(field);

  if (shouldShow('positionSize')) {
    addMoreContextItem(items, {
      id: 'positionSize',
      label: getFieldLabel('positionSize'),
      value: formatPositionSize(trade.positionSize),
    });
  }
  if (shouldShow('stopLoss')) {
    addMoreContextItem(items, {
      id: 'stopLoss',
      label: getFieldLabel('stopLoss'),
      value: formatPrice(trade.stopLoss),
    });
  }
  if (shouldShow('takeProfit')) {
    const takeProfitValues: string[] = [];
    if (Array.isArray(trade.takeProfits)) {
      for (const target of trade.takeProfits) {
        const formattedTarget = formatPrice(target.price);
        if (isPresentDisplayValue(formattedTarget)) {
          takeProfitValues.push(formattedTarget);
        }
      }
    }
    addMoreContextItem(items, {
      id: 'takeProfit',
      label: getFieldLabel('takeProfit'),
      value: takeProfitValues.join(', '),
    });
  }
  if (shouldShow('fees')) {
    addMoreContextItem(items, {
      id: 'fees',
      label: getFieldLabel('fees'),
      value: formatMoney(toFiniteNumber(trade.fees)),
    });
  }
  if (shouldShow('commission')) {
    addMoreContextItem(items, {
      id: 'commission',
      label: getFieldLabel('commission'),
      value: formatMoney(toFiniteNumber(trade.commission)),
    });
  }
  if (shouldShow('mae')) {
    addMoreContextItem(items, {
      id: 'mae',
      label: getFieldLabel('mae'),
      value: formatMoney(toFiniteNumber(trade.mae)),
    });
  }
  if (shouldShow('mfe')) {
    addMoreContextItem(items, {
      id: 'mfe',
      label: getFieldLabel('mfe'),
      value: formatMoney(toFiniteNumber(trade.mfe)),
    });
  }
  if (shouldShow('thesis')) {
    addMoreContextItem(items, {
      id: 'thesis',
      label: getFieldLabel('thesis'),
      value: formatContextScalar(trade.thesis),
      multiline: true,
    });
  }
  if (shouldShow('notes')) {
    addMoreContextItem(items, {
      id: 'notes',
      label: getFieldLabel('notes'),
      value: formatContextScalar(trade.notes),
      multiline: true,
    });
  }

  const explicitCustomFields = fields.flatMap((field) =>
    field.startsWith('custom:') ? [field.slice('custom:'.length)] : []
  );
  const includedCustomFields = shouldShow('customFields')
    ? customFieldDefinitions
    : customFieldDefinitions.filter((field) =>
        explicitCustomFields.includes(field.id)
      );
  for (const field of includedCustomFields) {
    addMoreContextItem(items, {
      id: `custom:${field.id}`,
      label: field.label,
      value: formatCustomFieldValue(getCustomFieldValue(trade, field)),
      multiline: true,
    });
  }

  return items;
}

function buildFactValues({
  trade,
  currency,
  formatPrice,
  formatValue,
}: {
  trade: ReviewTrade;
  currency: string;
  formatPrice: (value: unknown) => string;
  formatValue: ReturnType<typeof useDisplayFormatter>['formatValue'];
}): Partial<Record<TradeReviewCardField, string>> {
  return {
    entry: formatPrice(trade.entryPrice ?? trade.entries?.[0]?.price),
    exit: formatPrice(
      trade.exitPrice ?? trade.exits?.[trade.exits.length - 1]?.price
    ),
    duration: formatDuration(trade),
    risk: formatValue({
      kind: 'risk',
      value: toFiniteNumber(trade.riskAmount),
      currencyCode: currency,
      fallback: t('common.na'),
    }),
    positionSize: formatValue({
      kind: 'positionSize',
      value: toFiniteNumber(trade.positionSize),
      precision: 4,
      fallback: t('common.na'),
    }),
    stopLoss: formatPrice(trade.stopLoss),
    takeProfit: formatTakeProfitValues(trade.takeProfits, formatPrice),
    fees: formatValue({
      kind: 'fee',
      value: toFiniteNumber(trade.fees),
      currencyCode: currency,
      fallback: t('common.na'),
    }),
    commission: formatValue({
      kind: 'fee',
      value: toFiniteNumber(trade.commission),
      currencyCode: currency,
      fallback: t('common.na'),
    }),
    mae: formatValue({
      kind: 'money',
      value: toFiniteNumber(trade.mae),
      currencyCode: currency,
      fallback: t('common.na'),
    }),
    mfe: formatValue({
      kind: 'money',
      value: toFiniteNumber(trade.mfe),
      currencyCode: currency,
      fallback: t('common.na'),
    }),
  };
}

const TradeReviewQuestionInput = React.memo(function TradeReviewQuestionInput({
  question,
  persistedValue,
  onDraftChange,
}: {
  question: TradeReviewQuestionConfig;
  persistedValue: string;
  onDraftChange: (
    question: TradeReviewQuestionConfig,
    value: string,
    scrollSnapshot: ReviewScrollSnapshot | null
  ) => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const hasLocalDraftRef = useRef(false);
  const isFocusedRef = useRef(false);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    if (textarea.value === persistedValue) {
      hasLocalDraftRef.current = false;
      return;
    }

    if (isFocusedRef.current || hasLocalDraftRef.current) return;
    textarea.value = persistedValue;
  }, [persistedValue]);

  return (
    <textarea
      ref={textareaRef}
      className="journalit-trade-review-textarea"
      defaultValue={persistedValue}
      spellCheck={false}
      placeholder={
        question.placeholder || t('widget.trade-review.placeholder.default')
      }
      rows={3}
      onFocus={() => {
        isFocusedRef.current = true;
      }}
      onChange={(event) => {
        hasLocalDraftRef.current = true;
        onDraftChange(
          question,
          event.target.value,
          captureReviewScrollSnapshot(event.currentTarget)
        );
      }}
      onKeyDownCapture={(event) => {
        if (event.key !== 'Tab') return;

        const focusedAdjacentTextarea = focusAdjacentReviewTextarea(
          event.currentTarget,
          event.shiftKey ? -1 : 1
        );
        if (focusedAdjacentTextarea) {
          event.preventDefault();
          event.stopPropagation();
        }
      }}
      onBlur={() => {
        isFocusedRef.current = false;
      }}
    />
  );
});

function TradeReviewQuestions({
  plugin,
  tradePath,
  questions,
  review,
  ref,
}: {
  plugin: JournalitPlugin;
  tradePath?: string;
  questions: TradeReviewQuestionConfig[];
  review: TradeReviewData | undefined;
  ref?: React.Ref<TradeReviewQuestionSaveHandle>;
}) {
  const saveTimersRef = useRef<Record<string, number>>({});
  const pendingSavesRef = useRef<
    Record<
      string,
      {
        question: TradeReviewQuestionConfig;
        value: string;
        scrollSnapshot: ReviewScrollSnapshot | null;
      }
    >
  >({});
  const saveQueueRef = useRef<Promise<void>>(Promise.resolve());

  const commitQuestionSave = useCallback(
    (
      question: TradeReviewQuestionConfig,
      value: string,
      scrollSnapshot: ReviewScrollSnapshot | null = captureReviewScrollSnapshot()
    ) => {
      if (!tradePath) return saveQueueRef.current;

      const commit = async () => {
        const releaseScrollGuard = startReviewScrollGuard(scrollSnapshot);
        try {
          await plugin.tradeService.updateTradeReviewQuestion(
            tradePath,
            question.id,
            question.label,
            value,
            'user-input',
            questions.map(({ id }) => ({ id }))
          );
        } finally {
          releaseScrollGuard();
          restoreReviewScrollSnapshot(scrollSnapshot);
        }
      };

      saveQueueRef.current = saveQueueRef.current
        .catch(() => undefined)
        .then(commit);
      return saveQueueRef.current;
    },
    [plugin.tradeService, questions, tradePath]
  );

  const flushPendingSaves = useCallback(async () => {
    Object.values(saveTimersRef.current).forEach((timerId) => {
      window.clearTimeout(timerId);
    });
    saveTimersRef.current = {};

    Object.values(pendingSavesRef.current).forEach(
      ({ question, value, scrollSnapshot }) => {
        void commitQuestionSave(question, value, scrollSnapshot);
      }
    );
    pendingSavesRef.current = {};

    await saveQueueRef.current;
  }, [commitQuestionSave]);

  useImperativeHandle(
    ref,
    () => ({
      flushPendingSaves,
    }),
    [flushPendingSaves]
  );

  useEffect(() => {
    return () => {
      void flushPendingSaves();
    };
  }, [flushPendingSaves]);

  const flushQuestionSave = useCallback(
    (
      questionId: string,
      scrollSnapshotOverride: ReviewScrollSnapshot | null = null
    ) => {
      const timerId = saveTimersRef.current[questionId];
      if (timerId !== undefined) {
        window.clearTimeout(timerId);
        delete saveTimersRef.current[questionId];
      }

      const pendingSave = pendingSavesRef.current[questionId];
      if (!pendingSave) return;
      delete pendingSavesRef.current[questionId];
      void commitQuestionSave(
        pendingSave.question,
        pendingSave.value,
        scrollSnapshotOverride ?? pendingSave.scrollSnapshot
      );
    },
    [commitQuestionSave]
  );

  const scheduleQuestionSave = useCallback(
    (
      question: TradeReviewQuestionConfig,
      value: string,
      scrollSnapshot: ReviewScrollSnapshot | null
    ) => {
      const existingTimerId = saveTimersRef.current[question.id];
      if (existingTimerId !== undefined) {
        window.clearTimeout(existingTimerId);
      }

      pendingSavesRef.current[question.id] = {
        question,
        value,
        scrollSnapshot,
      };
      saveTimersRef.current[question.id] = window.setTimeout(() => {
        if (isTradeReviewTextareaFocused()) {
          scheduleQuestionSave(question, value, scrollSnapshot);
          return;
        }

        flushQuestionSave(question.id);
      }, 500);
    },
    [flushQuestionSave]
  );

  const handleQuestionChange = useCallback(
    (
      question: TradeReviewQuestionConfig,
      value: string,
      scrollSnapshot: ReviewScrollSnapshot | null
    ) => {
      scheduleQuestionSave(question, value, scrollSnapshot);
    },
    [scheduleQuestionSave]
  );

  if (questions.length === 0) {
    return null;
  }

  return (
    <div className="journalit-trade-review-questions">
      {questions.map((question) => (
        <label key={question.id} className="journalit-trade-review-question">
          <span className="journalit-trade-review-question-label">
            {question.label}
          </span>
          <TradeReviewQuestionInput
            question={question}
            persistedValue={getReviewText(review, question)}
            onDraftChange={handleQuestionChange}
          />
        </label>
      ))}
    </div>
  );
}

TradeReviewQuestions.displayName = 'TradeReviewQuestions';

const TradeReviewCardBody: React.FC<{
  images: string[];
  showMedia: boolean;
  trade: ReviewTrade;
  filePath: string;
  plugin: JournalitPlugin;
  metricFields: TradeReviewCardField[];
  factValues: Partial<Record<TradeReviewCardField, string>>;
  contextFields: TradeReviewCardField[];
  contextItems: Partial<Record<TradeReviewCardField, string[]>>;
  moreContextItems: TradeReviewMoreContextItem[];
  questions: TradeReviewQuestionConfig[];
  review: TradeReviewData | undefined;
  questionSaveRef: React.RefObject<TradeReviewQuestionSaveHandle | null>;
}> = ({
  images,
  showMedia,
  trade,
  filePath,
  plugin,
  metricFields,
  factValues,
  contextFields,
  contextItems,
  moreContextItems,
  questions,
  review,
  questionSaveRef,
}) => (
  <div className="journalit-trade-review-card-body">
    {showMedia &&
      (images.length > 0 ? (
        <div className="journalit-trade-review-media journalit-images-widget journalit-media-carousel-surface">
          <ImageCarousel
            images={images}
            altPrefix={t('widget.trade-review.image-alt-prefix')}
            displayOptions={{
              showThumbnails: images.length > 1,
              showCounter: images.length > 1,
              enableFullscreen: true,
            }}
            deleteOptions={{ enabled: false }}
            useResolveMediaPath={true}
            sourcePath={trade.path || filePath}
          />
        </div>
      ) : (
        <div className="journalit-trade-review-empty-media">
          {t('widget.trade-review.no-image')}
        </div>
      ))}

    <TradeReviewMetrics fields={metricFields} values={factValues} />

    <TradeReviewContext fields={contextFields} itemsByField={contextItems} />

    <TradeReviewMoreContext items={moreContextItems} />

    <TradeReviewQuestions
      ref={questionSaveRef}
      plugin={plugin}
      tradePath={trade.path}
      questions={questions}
      review={review}
    />

    <div className="journalit-trade-review-actions">
      {trade.path && (
        <button
          type="button"
          className="journalit-trade-review-secondary-action"
          onClick={() => void plugin.openFile(trade.path!, false)}
        >
          {t('widget.trade-review.open-trade-note')}
        </button>
      )}
    </div>
  </div>
);

TradeReviewCardBody.displayName = 'TradeReviewCardBody';

function TradeReviewCardHeader({
  headerRef,
  index,
  isExpanded,
  isReviewed,
  onToggleExpanded,
  onToggleReviewed,
  outcomeClass,
  preferredOutcome,
  title,
  trade,
}: {
  headerRef?: React.Ref<HTMLDivElement>;
  index: number;
  isExpanded: boolean;
  isReviewed: boolean;
  onToggleExpanded: () => void;
  onToggleReviewed: (event: React.MouseEvent<HTMLButtonElement>) => void;
  outcomeClass: string;
  preferredOutcome: string;
  title: string;
  trade: ReviewTrade;
}) {
  return (
    <div
      ref={headerRef}
      className="journalit-trade-review-card-header"
      role="button"
      tabIndex={0}
      aria-expanded={isExpanded}
      onClick={onToggleExpanded}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return;
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        onToggleExpanded();
      }}
    >
      <span
        className="journalit-weekly-drc-accordion-indicator journalit-trade-review-card-chevron"
        aria-hidden="true"
      >
        <ChevronDown size={16} />
      </span>
      <span className="journalit-trade-review-card-title">
        {title ||
          t('widget.trade-review.fallback-title', {
            index: String(index + 1),
          })}
      </span>
      <span className="journalit-trade-review-card-time">
        {formatTradeTime(trade)}
      </span>
      <span className={`journalit-trade-review-card-outcome ${outcomeClass}`}>
        {preferredOutcome}
      </span>
      <span className="journalit-trade-review-card-header-spacer" />
      <button
        type="button"
        className={`journalit-weekly-drc-mark-reviewed-button ${isReviewed ? 'journalit-weekly-drc-mark-reviewed-button--reviewed' : ''}`}
        onClick={onToggleReviewed}
        onKeyDown={(event) => event.stopPropagation()}
        aria-pressed={isReviewed}
      >
        <span
          className={`journalit-weekly-drc-mark-reviewed-icon ${isReviewed ? 'journalit-weekly-drc-mark-reviewed-icon--reviewed' : ''}`}
          aria-hidden="true"
        >
          {isReviewed && <ReviewedCheckmark />}
        </span>
        {isReviewed
          ? t('widget.trade-review.status.reviewed')
          : t('widget.trade-review.status.pending')}
      </button>
    </div>
  );
}

export async function updateTradeReviewStatusForTrade(
  plugin: JournalitPlugin,
  trade: ReviewTrade,
  reviewed: boolean
): Promise<void> {
  if (!trade.path) return;

  const reviewedAt = reviewed ? new Date().toISOString() : '';
  if (trade.isMissedTrade === true) {
    const missedTradeService = plugin.serviceManager
      ? await plugin.serviceManager.getMissedTradeService()
      : plugin.missedTradeService;
    await missedTradeService.updateMissedTradeReviewStatus(
      trade.path,
      reviewed,
      reviewedAt
    );
    return;
  }

  if (trade.isBacktestTrade === true) {
    const backtestTradeService = plugin.serviceManager
      ? await plugin.serviceManager.getBacktestTradeService()
      : plugin.backtestTradeService;
    await backtestTradeService.updateBacktestTradeReviewStatus(
      trade.path,
      reviewed,
      reviewedAt
    );
    return;
  }

  await plugin.tradeService.updateTradeReviewStatus(
    trade.path,
    reviewed,
    reviewedAt,
    'user-input'
  );
}

const REVIEW_STATUS_WRITE_QUEUE_BY_TRADE = new Map<string, Promise<void>>();
const LATEST_REVIEW_STATUS_BY_TRADE = new Map<
  string,
  { plugin: JournalitPlugin; trade: ReviewTrade; reviewed: boolean }
>();

async function processNextTradeReviewStatusWrite(
  tradePath: string
): Promise<void> {
  const nextWrite = LATEST_REVIEW_STATUS_BY_TRADE.get(tradePath);
  if (!nextWrite) return;

  LATEST_REVIEW_STATUS_BY_TRADE.delete(tradePath);
  await updateTradeReviewStatusForTrade(
    nextWrite.plugin,
    nextWrite.trade,
    nextWrite.reviewed
  );

  if (LATEST_REVIEW_STATUS_BY_TRADE.has(tradePath)) {
    await processNextTradeReviewStatusWrite(tradePath);
  }
}

export async function queueTradeReviewStatusUpdate(
  plugin: JournalitPlugin,
  trade: ReviewTrade,
  reviewed: boolean
): Promise<void> {
  if (!trade.path) return;

  const tradePath = trade.path;
  LATEST_REVIEW_STATUS_BY_TRADE.set(tradePath, { plugin, trade, reviewed });

  const existingWrite = REVIEW_STATUS_WRITE_QUEUE_BY_TRADE.get(tradePath);
  if (existingWrite) {
    await existingWrite;
    return;
  }

  const writeQueue = processNextTradeReviewStatusWrite(tradePath);

  REVIEW_STATUS_WRITE_QUEUE_BY_TRADE.set(tradePath, writeQueue);
  try {
    await writeQueue;
  } finally {
    if (REVIEW_STATUS_WRITE_QUEUE_BY_TRADE.get(tradePath) === writeQueue) {
      REVIEW_STATUS_WRITE_QUEUE_BY_TRADE.delete(tradePath);
    }
  }
}

const TradeReviewCard: React.FC<{
  trade: ReviewTrade;
  index: number;
  filePath: string;
  plugin: JournalitPlugin;
  config: TradeReviewWidgetConfig;
  showInstrument: boolean;
  isInitiallyExpanded: boolean;
  nextReviewItemKey?: string;
  onSessionVisibilityChange: (filePath: string, keepVisible: boolean) => void;
}> = ({
  trade,
  index,
  filePath,
  plugin,
  config,
  showInstrument,
  isInitiallyExpanded,
  nextReviewItemKey,
  onSessionVisibilityChange,
}) => {
  const cardKey = getTradeKey(trade, index);
  const storedExpansion = getStoredCardExpansion(filePath, cardKey);
  const cardRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const questionSaveRef = useRef<TradeReviewQuestionSaveHandle | null>(null);
  const [hasExpansionOverride, setHasExpansionOverride] = useState(
    storedExpansion !== undefined
  );
  const [expansionOverride, setExpansionOverride] = useState(
    storedExpansion ?? false
  );
  const [localReviewed, setLocalReviewed] = useState<boolean | undefined>();

  useEffect(() => {
    setLocalReviewed(undefined);
  }, [trade.reviewed, trade.reviewedAt]);

  const isExpanded = hasExpansionOverride
    ? expansionOverride
    : isInitiallyExpanded;
  const { currency: globalCurrency } = useCurrency();
  const { formatValue, shouldMask } = useDisplayFormatter();
  const isPnlMasked = shouldMask('pnl');
  const isRMasked = shouldMask('rMultiple');
  const isPriceMasked = shouldMask('price');
  const currency =
    typeof trade.currency === 'string' ? trade.currency : globalCurrency;
  const currencyConfig = getCurrencyConfig(currency);
  const outcome = getOutcome(trade);
  const questions = getDisplayQuestions(
    config,
    outcome,
    isPnlMasked || isRMasked
  );
  const legacyFields = config.fields ?? DEFAULT_FIELDS;
  const primaryMetricFields = config.primaryMetrics ?? legacyFields;
  const classificationConfigFields =
    config.classificationFields ?? legacyFields;
  const moreContextConfigFields = config.moreContextFields ?? legacyFields;
  const customFieldDefinitions = plugin.customFieldsService?.getFields() ?? [];
  const showMedia = config.showImages !== false;
  const images = showMedia ? normalizeImages(trade.images) : [];
  const review = trade.tradeReview;
  const isReviewed = localReviewed ?? trade.reviewed === true;
  const pnl = getEffectivePnL(trade);
  const effectiveR = calculateEffectiveRMultiple(
    pnl ?? undefined,
    toFiniteNumber(trade.rMultiple) ?? undefined,
    toFiniteNumber(trade.riskAmount) ?? undefined,
    plugin.settings.trade.defaultRiskAmount
  );
  const preferredOutcome = getPreferredOutcomeLabel({
    outcome,
    displayRMultiples: plugin.settings.trade.displayRMultiples === true,
    effectiveR,
    pnl,
    currency,
    formatValue,
  });
  const outcomeClass =
    isPnlMasked || isRMasked || outcome === 'open'
      ? ''
      : outcome === 'win'
        ? 'journalit-trade-review-card-outcome--positive'
        : outcome === 'loss'
          ? 'journalit-trade-review-card-outcome--negative'
          : 'journalit-trade-review-card-outcome--muted';

  const formatPrice = (value: unknown): string => {
    const numericValue = toFiniteNumber(value);
    if (numericValue === null) return t('common.na');
    if (isPriceMasked) {
      return formatValue({
        kind: 'price',
        value: numericValue,
        currencyCode: currency,
        fallback: t('common.na'),
      });
    }
    return numericValue.toLocaleString(currencyConfig.locale, {
      minimumFractionDigits: numericValue < 10 ? 4 : 2,
      maximumFractionDigits: numericValue < 10 ? 5 : 2,
    });
  };

  const handleToggleReviewed = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (!trade.path) return;
    const nextReviewed = !isReviewed;
    setLocalReviewed(nextReviewed);
    if (nextReviewed && isExpanded) {
      setHasExpansionOverride(true);
      setExpansionOverride(false);
      setStoredCardExpansion(filePath, cardKey, false);
      scrollToNextReviewItemAfterCollapse(cardRef.current, nextReviewItemKey);
    }
    plugin.reviewDataCache?.setSessionReviewedTradeVisibility(
      filePath,
      trade.path,
      nextReviewed
    );
    onSessionVisibilityChange(trade.path, nextReviewed);
    window.setTimeout(() => {
      if (!trade.path) return;
      void (async () => {
        await questionSaveRef.current?.flushPendingSaves();
        await queueTradeReviewStatusUpdate(plugin, trade, nextReviewed);
      })().catch((error: unknown) => {
        console.error(
          '[TradeReviewWidget] Error updating review status:',
          error
        );
        plugin.reviewDataCache?.setSessionReviewedTradeVisibility(
          filePath,
          trade.path!,
          false
        );
        setLocalReviewed(undefined);
        onSessionVisibilityChange(trade.path!, false);
      });
    }, 0);
  };

  const toggleExpansion = () => {
    const nextExpanded = !isExpanded;
    setHasExpansionOverride(true);
    setExpansionOverride(nextExpanded);
    setStoredCardExpansion(filePath, cardKey, nextExpanded);

    if (!nextExpanded) {
      window.requestAnimationFrame(() => {
        headerRef.current?.scrollIntoView({
          block: 'nearest',
          inline: 'nearest',
        });
      });
    }
  };

  const factValues = buildFactValues({
    trade,
    currency,
    formatPrice,
    formatValue,
  });
  const metricFields = primaryMetricFields.filter((field) =>
    METRIC_FIELD_SET.has(field)
  );
  const contextFields = classificationConfigFields.filter((field) =>
    CONTEXT_FIELD_SET.has(field)
  );
  const moreContextItems = buildMoreContextItems({
    fields: moreContextConfigFields,
    trade,
    customFieldDefinitions,
    formatPrice,
    formatMoney: (value) =>
      formatValue({
        kind: 'money',
        value,
        currencyCode: currency,
        fallback: t('common.na'),
      }),
    formatPositionSize: (value) =>
      formatValue({
        kind: 'positionSize',
        value: toFiniteNumber(value),
        fallback: t('common.na'),
      }),
    formatCustomFieldValue: (value) =>
      shouldMask('metric')
        ? formatValue({ kind: 'metric', value: 0, precision: 0 })
        : formatContextScalar(value),
  });
  const contextItems: Partial<Record<TradeReviewCardField, string[]>> = {
    account: formatItems(trade.account),
    setup: formatItems(trade.setup),
    mistakes: formatItems(trade.mistake),
    tags: formatItems(trade.customTags ?? trade.tags),
  };

  const directionLabel = formatDirectionLabel(trade);
  const titleParts = [
    showInstrument && trade.instrument ? trade.instrument : null,
    directionLabel,
  ].filter(Boolean);
  const title = titleParts.join(' · ');
  const stickyHeader = useStickyReviewHeader({
    containerRef: cardRef,
    enabled: isExpanded,
    headerRef,
  });

  return (
    <article
      ref={cardRef}
      className="journalit-trade-review-card"
      data-journalit-review-item-key={cardKey}
    >
      <TradeReviewCardHeader
        headerRef={headerRef}
        index={index}
        isExpanded={isExpanded}
        isReviewed={isReviewed}
        onToggleExpanded={toggleExpansion}
        onToggleReviewed={handleToggleReviewed}
        outcomeClass={outcomeClass}
        preferredOutcome={preferredOutcome}
        title={title}
        trade={trade}
      />

      <StickyReviewHeaderPortal
        className="journalit-trade-review-card-header--sticky-clone"
        metrics={stickyHeader}
      >
        <TradeReviewCardHeader
          index={index}
          isExpanded={isExpanded}
          isReviewed={isReviewed}
          onToggleExpanded={toggleExpansion}
          onToggleReviewed={handleToggleReviewed}
          outcomeClass={outcomeClass}
          preferredOutcome={preferredOutcome}
          title={title}
          trade={trade}
        />
      </StickyReviewHeaderPortal>

      {isExpanded && (
        <TradeReviewCardBody
          images={images}
          showMedia={showMedia}
          trade={trade}
          filePath={filePath}
          plugin={plugin}
          metricFields={metricFields}
          factValues={factValues}
          contextFields={contextFields}
          contextItems={contextItems}
          moreContextItems={moreContextItems}
          questions={questions}
          review={review}
          questionSaveRef={questionSaveRef}
        />
      )}
    </article>
  );
};

function getFieldLabel(field: TradeReviewCardField): string {
  switch (field) {
    case 'entry':
      return t('widget.trade-review.field.entry');
    case 'exit':
      return t('widget.trade-review.field.exit');
    case 'duration':
      return t('widget.trade-review.field.duration');
    case 'risk':
      return t('widget.trade-review.field.risk');
    case 'positionSize':
      return t('widget.trade-review.field.position-size');
    case 'stopLoss':
      return t('widget.trade-review.field.stop-loss');
    case 'takeProfit':
      return t('widget.trade-review.field.take-profit');
    case 'fees':
      return t('widget.trade-review.field.fees');
    case 'commission':
      return t('widget.trade-review.field.commission');
    case 'mae':
      return t('widget.trade-review.field.mae');
    case 'mfe':
      return t('widget.trade-review.field.mfe');
    case 'account':
      return t('widget.trade-review.field.account');
    case 'setup':
      return t('widget.trade-review.field.setup');
    case 'mistakes':
      return t('widget.trade-review.field.mistakes');
    case 'tags':
      return t('widget.trade-review.field.tags');
    case 'thesis':
      return t('widget.trade-review.field.thesis');
    case 'notes':
      return t('widget.trade-review.field.notes');
    case 'customFields':
      return t('widget.trade-review.field.custom-fields');
  }
}

export const TradeReviewWidget: React.FC<TradeReviewWidgetProps> = React.memo(
  ({ filePath, plugin, config = {}, preview = false, previewData }) => {
    const [sessionVisibleReviewedPaths, setSessionVisibleReviewedPaths] =
      useState<Set<string>>(() => getSessionVisibleReviewedPaths(filePath));
    const { trades: cachedTrades, loading } = useReviewTrades(filePath, plugin);
    const baseTrades = useMemo(
      () =>
        asReviewTrades(
          preview && previewData ? previewData.trades : cachedTrades
        ),
      [cachedTrades, preview, previewData]
    );
    const baseTradesKey = useMemo(
      () =>
        baseTrades
          .map(
            (trade, index) =>
              `${typeof trade.path === 'string' ? trade.path : index}:${String(trade.reviewed)}:${String(trade.reviewedAt ?? '')}`
          )
          .join('\u0000'),
      [baseTrades]
    );
    const [markdownReviewState, setMarkdownReviewState] = useState<{
      key: string;
      trades: ReviewTrade[];
    } | null>(null);
    const markdownReviewTrades =
      markdownReviewState?.key === baseTradesKey
        ? markdownReviewState.trades
        : null;
    const trades = markdownReviewTrades ?? baseTrades;

    useEffect(() => {
      if (preview) return;

      let cancelled = false;

      if (baseTrades.length === 0) return;

      void plugin.reviewDataCache
        ?.attachMarkdownTradeReviews(baseTrades)
        .then((hydratedTrades) => {
          if (!cancelled) {
            setMarkdownReviewState({
              key: baseTradesKey,
              trades: asReviewTrades(hydratedTrades),
            });
          }
        })
        .catch((error: unknown) => {
          if (!cancelled) {
            console.error(
              '[TradeReviewWidget] Error loading markdown review answers:',
              error
            );
          }
        });

      return () => {
        cancelled = true;
      };
    }, [baseTrades, baseTradesKey, plugin.reviewDataCache, preview]);

    const displayTrades = useMemo(() => {
      const sessionVisiblePaths = getSessionVisibleReviewedPaths(filePath);
      const withOpenFilter =
        config.showOpenTrades === false
          ? trades.filter((trade) => getOutcome(trade) !== 'open')
          : trades;
      return config.showReviewedTrades === false
        ? withOpenFilter.filter(
            (trade) =>
              trade.reviewed !== true ||
              trade.reviewSessionVisible === true ||
              (typeof trade.path === 'string' &&
                (hasRecentReviewToggle(filePath, trade.path) ||
                  sessionVisibleReviewedPaths.has(trade.path) ||
                  sessionVisiblePaths.has(trade.path)))
          )
        : withOpenFilter;
    }, [
      config.showOpenTrades,
      config.showReviewedTrades,
      filePath,
      sessionVisibleReviewedPaths,
      trades,
    ]);
    const stableDisplayTrades = getStableDisplayTrades(
      filePath,
      displayTrades,
      { isTransientRefresh: loading }
    );

    const handleSessionVisibilityChange = useCallback(
      (tradeFilePath: string, keepVisible: boolean) => {
        setSessionVisibleReviewedPaths(
          setSessionVisibleReviewedPath(filePath, tradeFilePath, keepVisible)
        );
      },
      [filePath]
    );

    const instruments = useMemo(
      () => uniqueInstruments(stableDisplayTrades),
      [stableDisplayTrades]
    );
    const showInstrument = instruments.size > 1;

    if (loading && !preview && trades.length === 0) {
      return <ReviewWidgetSkeleton variant="trade-review" />;
    }

    if (stableDisplayTrades.length === 0) {
      return (
        <div className="journalit-trade-review-widget journalit-weekly-drc-context">
          <div className="journalit-reviewv2-chart-title">
            {t('widget.trade-review.name')}
          </div>
          <div className="journalit-widget-empty">
            {t('widget.trade-review.no-trades')}
          </div>
        </div>
      );
    }

    return (
      <div className="journalit-trade-review-widget journalit-weekly-drc-context">
        <div className="journalit-reviewv2-chart-title">
          {t('widget.trade-review.name')}
        </div>
        <div className="journalit-trade-review-card-list">
          {stableDisplayTrades.map((trade, index) => (
            <TradeReviewCard
              key={getTradeKey(trade, index)}
              trade={trade}
              index={index}
              filePath={filePath}
              plugin={plugin}
              config={config}
              showInstrument={showInstrument}
              isInitiallyExpanded={
                config.defaultExpanded !== false && index === 0
              }
              nextReviewItemKey={
                stableDisplayTrades[index + 1]
                  ? getTradeKey(stableDisplayTrades[index + 1], index + 1)
                  : undefined
              }
              onSessionVisibilityChange={handleSessionVisibilityChange}
            />
          ))}
        </div>
      </div>
    );
  }
);

TradeReviewWidget.displayName = 'TradeReviewWidget';
