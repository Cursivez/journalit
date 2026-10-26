import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useImperativeHandle,
} from 'react';
import type JournalitPlugin from '../../../main';
import { Notice } from 'obsidian';
import { getTradeMediaOwner } from '../../../services/trade/core/TradeMediaOwnership';
import {
  isEditingTradeReviewField,
  TradeReviewEditableValue,
  TradeReviewEditableMedia,
  useTradeReviewJournalEditing,
  type TradeReviewJournalSaveHandle,
} from './TradeReviewInlineEditing';
import {
  isEditableJournalField,
  normalizeTradeJournalSelection,
} from '../../../services/trade/core/TradeJournalFields';
import type { TradeReviewData } from '../../../services/backend/types';
import type { CustomFieldDefinition } from '../../../types/customFields';
import { ImageCarousel } from '../../image/ImageCarousel';
import { useReviewTrades } from '../hooks/useReviewData';
import { useCurrency } from '../../../contexts/CurrencyContext';
import { useDisplayFormatter } from '../../../contexts/DisplayPolicyContext';
import { getCurrencyConfig } from '../../../utils/currencyConfig';
import { formatTradePositionSize } from '../../forms/trade/utils';
import { calculateEffectiveRMultiple } from '../../../utils/formatting';
import {
  getEffectivePnL,
  getExecutionFillPrices,
  isTradeOpenWithContext,
} from '../../../utils/tradeStatusUtils';
import { classifyPnLWithBreakEvenSettings } from '../../../utils/breakEvenRange';
import type { JournalitSettings } from '../../../settings/types';
import { getTradeDirectionDisplayKind } from '../../../services/trade/core/TradeDirection';
import { hasUnknownCanonicalPnL } from '../../../services/trade/core/CanonicalProjectionFields';
import { cssVars } from '../../../styles/inlineStylePolicy';
import { useReviewReadOnly } from '../ReviewReadOnlyContext';

import { t } from '../../../lang/helpers';
import { ChevronDown, CornerDownRight } from '../../shared/icons/ObsidianIcon';
import { StickyHeaderPortal, useStickyHeader } from '../../shared/StickyHeader';
import { keepReviewItemHeaderInPlaceOnCollapse } from './shared/reviewScrollUtils';
import { ReviewWidgetSkeleton } from './shared/ReviewWidgetSkeleton';
import { openReviewWidgetFile } from '../reviewWidgetNavigation';
import {
  getTradeReviewQuestionIdCandidates,
  getTradeReviewQuestionKnownLabels,
  getTradeReviewQuestionLabel,
  isLegacySupplementalTradeReviewQuestionId,
} from '../../../services/trade/core/TradeReviewMarkdownCodec';
import {
  getAllLocalizedDefaultTradeReviewQuestionLabels,
  orderTradeReviewQuestionsByHierarchy,
  resolveTradeReviewQuestions,
  resolveTradeReviewQuestionDepths,
  resolveVisibleTradeReviewQuestions,
  expandTradeReviewFieldGroups,
  getTradeReviewBuiltInFieldLabel,
  getTradeReviewCustomFieldId,
  isTradeReviewCustomFieldRef,
  resolveTradeReviewFieldLayout,
  type TradeReviewCardField,
  type TradeReviewFieldId,
  type TradeReviewQuestionConfig,
  type TradeReviewWidgetConfig,
} from './tradeReviewConfig';
import { shareCaptureExcludeProps } from '../../../services/share/brandedCapture';
import { partitionMarkdownSectionsByHeading } from '../../../utils/markdownSectionExtractor';
import { TradeReviewMarkdownText } from './TradeReviewMarkdownText';

const RESOLVED_SAVE_PROMISE = Promise.resolve();

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
  authoritativePnl?: number | null;
  _originalPnlWasNull?: boolean;
  directPnL?: number | null;
  useDirectPnLInput?: boolean;
  rMultiple?: number;
  riskAmount?: number;
  stopLosses?: Array<{ price?: number }>;
  takeProfits?: Array<{ price?: number; closePercent?: number }>;
  commission?: number;
  fees?: number;
  mae?: number;
  mfe?: number;
  account?: string | string[];
  setup?: string[];
  mistake?: string[];
  tags?: string[];
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
  breakEvenAccountCurrentBalance?: number;
  breakEvenAccountCurrentBalanceTotal?: number;
};

type TradeReviewQuestionSaveHandle = {
  flushPendingSaves: () => Promise<void>;
};

const SESSION_VISIBLE_REVIEWED_PATHS_BY_REVIEW = new Map<string, Set<string>>();
const RECENT_REVIEW_TOGGLE_VISIBLE_UNTIL_BY_REVIEW = new Map<
  string,
  Map<string, number>
>();
const REVIEW_TOGGLE_VISIBILITY_GRACE_MS = 5000;
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
  
  return (
    window.activeDocument.activeElement?.classList.contains(
      'journalit-trade-review-textarea'
    ) ?? false
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

function getStableDisplayTrades(
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

function asReviewTrades(value: unknown): ReviewTrade[] {
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

function getOutcome(
  trade: ReviewTrade,
  breakEvenSettings?: JournalitSettings['trade']
): 'win' | 'loss' | 'breakeven' | 'unknown' | 'open' | 'cancelled' {
  if (trade.tradeStatus === 'CANCELLED') return 'cancelled';
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
  if (hasUnknownCanonicalPnL(trade)) {
    return 'unknown';
  }
  const pnl = getEffectivePnL(trade);
  if (pnl === null) return 'breakeven';
  const outcome = classifyPnLWithBreakEvenSettings(
    pnl,
    breakEvenSettings,
    trade.breakEvenAccountCurrentBalanceTotal ??
      trade.breakEvenAccountCurrentBalance
  );
  return outcome === 'unknown' ? 'breakeven' : outcome;
}

function getQuestions(
  config: TradeReviewWidgetConfig,
  outcome: ReturnType<typeof getOutcome>
): TradeReviewQuestionConfig[] {
  if (outcome === 'cancelled' || outcome === 'unknown') return [];
  return resolveTradeReviewQuestions(config, outcome);
}

function getDisplayQuestions(
  config: TradeReviewWidgetConfig,
  outcome: ReturnType<typeof getOutcome>,
  isOutcomeMasked: boolean
): TradeReviewQuestionConfig[] {
  if (isOutcomeMasked) return [];
  return getQuestions(config, outcome);
}

function getPreferredOutcomeLabel({
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
  if (outcome === 'cancelled') {
    return t('tradelog.status.cancelled');
  }
  if (outcome === 'open') {
    return t('widget.trade-review.time.open');
  }
  if (outcome === 'unknown') {
    return t('common.unknown');
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
  question: TradeReviewQuestionConfig,
  allQuestions: TradeReviewQuestionConfig[] = [question]
): string {
  const questionIds = getTradeReviewQuestionIdCandidates(question.id);
  for (const questionId of questionIds) {
    const textAreas = review?.sections?.[questionId]?.textAreas;
    if (!textAreas) continue;
    const answer = textAreas[questionId] ?? Object.values(textAreas)[0];
    if (answer) return answer;
  }
  const stableLabels = [
    ...getAllLocalizedDefaultTradeReviewQuestionLabels(question.id),
    ...getTradeReviewQuestionKnownLabels(question.id),
  ];
  for (const label of stableLabels) {
    const answer = review?.sections?.[label]?.textAreas?.[label];
    if (answer) return answer;
  }

  const reservedLabels = new Set<string>();
  for (const candidateQuestion of allQuestions) {
    if (candidateQuestion.id === question.id) continue;
    const labels = [
      ...getAllLocalizedDefaultTradeReviewQuestionLabels(candidateQuestion.id),
      ...getTradeReviewQuestionKnownLabels(candidateQuestion.id),
    ];
    for (const label of labels) {
      reservedLabels.add(label.trim().toLocaleLowerCase());
    }
  }
  if (reservedLabels.has(question.label.trim().toLocaleLowerCase())) return '';
  const answer =
    review?.sections?.[question.label]?.textAreas?.[question.label];
  if (answer) return answer;
  return '';
}

function getReviewChoiceOptionId(
  review: TradeReviewData | undefined,
  question: TradeReviewQuestionConfig
): string | undefined {
  for (const questionId of getTradeReviewQuestionIdCandidates(question.id)) {
    const optionId = review?.sections?.[questionId]?.choiceOptionId;
    if (optionId) return optionId;
  }
  return undefined;
}

function includeLegacyAnsweredQuestions(
  questions: TradeReviewQuestionConfig[],
  review: TradeReviewData | undefined
): TradeReviewQuestionConfig[] {
  if (!review) return questions;
  const consumedIds = new Set(
    questions.flatMap((question) => [
      ...getTradeReviewQuestionIdCandidates(question.id),
      question.label,
    ])
  );
  const legacyQuestions = Object.entries(review.sections).flatMap(
    ([sectionId, section]): TradeReviewQuestionConfig[] => {
      if (
        consumedIds.has(sectionId) ||
        !isLegacySupplementalTradeReviewQuestionId(sectionId)
      ) {
        return [];
      }
      const answer =
        section.textAreas?.[sectionId] ??
        (section.textAreas ? Object.values(section.textAreas)[0] : undefined);
      if (!answer?.trim()) return [];
      return [
        {
          id: sectionId,
          label:
            section.label?.trim() || getTradeReviewQuestionLabel(sectionId),
        },
      ];
    }
  );
  return legacyQuestions.length > 0
    ? [...questions, ...legacyQuestions]
    : questions;
}


function getChipField(
  trade: ReviewTrade,
  field: TradeReviewCardField
): {
  values: string[];
  selectionId: 'setup' | 'mistake' | 'tags' | null;
} | null {
  switch (field) {
    case 'account':
      return { values: formatItems(trade.account), selectionId: null };
    case 'setup':
      return {
        values: formatItems(
          normalizeTradeJournalSelection(trade.setup, 'setup')
        ),
        selectionId: 'setup',
      };
    case 'mistakes':
      return {
        values: formatItems(
          normalizeTradeJournalSelection(trade.mistake, 'mistake')
        ),
        selectionId: 'mistake',
      };
    case 'tags':
      return {
        values: formatItems(trade.tags),
        selectionId: 'tags',
      };
    default:
      return null;
  }
}

function formatItems(value: unknown): string[] {
  if (Array.isArray(value)) {
    
    return [
      ...new Set(
        value.filter(
          (item): item is string =>
            typeof item === 'string' && item.trim().length > 0
        )
      ),
    ];
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

type TradeReviewEditableField = React.ComponentProps<
  typeof TradeReviewEditableValue
>['field'];

type TradeReviewJournalEditing = ReturnType<
  typeof useTradeReviewJournalEditing
>;


type TradeReviewFieldDisplay = {
  id: string;
  label: string;
  
  editableField?: TradeReviewEditableField;
} & (
  | { kind: 'chips'; field: TradeReviewCardField; values: string[] }
  | {
      kind: 'text';
      value: string;
      
      markdownSourcePath?: string;
    }
);

function hasDisplayValue(item: TradeReviewFieldDisplay): boolean {
  return item.kind === 'chips'
    ? item.values.length > 0
    : isPresentDisplayValue(item.value);
}


function getShownFieldDisplays(
  items: TradeReviewFieldDisplay[],
  editing: TradeReviewJournalEditing
): TradeReviewFieldDisplay[] {
  return items.filter(
    (item) =>
      hasDisplayValue(item) ||
      (editing.enabled && item.editableField !== undefined)
  );
}

function TradeReviewMetrics({
  items,
  editing,
}: {
  items: TradeReviewFieldDisplay[];
  editing: TradeReviewJournalEditing;
}) {
  
  const shownItems = getShownFieldDisplays(items, editing);
  if (shownItems.length === 0) return null;

  return (
    <div
      className={`journalit-trade-review-metrics journalit-trade-review-metrics--count-${shownItems.length}`}
    >
      {shownItems.map((item) => {
        const empty = !hasDisplayValue(item);
        const valueEl = (
          <span className="journalit-trade-review-metric-value">
            {item.kind === 'chips' ? item.values.join(', ') : item.value}
          </span>
        );
        return (
          <div
            key={item.id}
            
            className={`journalit-trade-review-metric-card${
              item.editableField &&
              isEditingTradeReviewField(editing, item.editableField)
                ? ' journalit-trade-review-metric-card--editing'
                : ''
            }`}
            {...(empty ? shareCaptureExcludeProps : {})}
          >
            <span className="journalit-trade-review-metric-label">
              {item.label}
            </span>
            {item.editableField ? (
              <TradeReviewEditableValue
                editing={editing}
                field={item.editableField}
                empty={empty}
              >
                {valueEl}
              </TradeReviewEditableValue>
            ) : (
              valueEl
            )}
          </div>
        );
      })}
    </div>
  );
}


function TradeReviewFieldRow({
  item,
  editing,
  plugin,
}: {
  item: TradeReviewFieldDisplay;
  plugin: JournalitPlugin;
  editing: TradeReviewJournalEditing;
}) {
  const empty = !hasDisplayValue(item);
  const editable = (content: React.ReactNode) =>
    item.editableField ? (
      <TradeReviewEditableValue
        editing={editing}
        field={item.editableField}
        empty={empty}
      >
        {content}
      </TradeReviewEditableValue>
    ) : (
      content
    );

  return (
    <div
      data-context-field={item.id}
      className="journalit-trade-review-context-row"
      {...(empty ? shareCaptureExcludeProps : {})}
    >
      <span className="journalit-trade-review-context-label">{item.label}</span>
      {item.kind === 'chips' ? (
        <div className="journalit-trade-review-context-values">
          {editable(
            item.values.map((value) => (
              <span
                key={value}
                className={`journalit-trade-review-context-chip journalit-trade-review-context-chip--${item.field}`}
              >
                {value}
              </span>
            ))
          )}
        </div>
      ) : item.markdownSourcePath !== undefined ? (
        editable(
          <TradeReviewMarkdownText
            plugin={plugin}
            markdown={item.value}
            sourcePath={item.markdownSourcePath}
          />
        )
      ) : (
        editable(
          <span className="journalit-trade-review-context-text">
            {item.value}
          </span>
        )
      )}
    </div>
  );
}

function TradeReviewContext({
  items,
  editing,
  plugin,
}: {
  items: TradeReviewFieldDisplay[];
  editing: TradeReviewJournalEditing;
  plugin: JournalitPlugin;
}) {
  const shownItems = getShownFieldDisplays(items, editing);
  if (shownItems.length === 0) return null;

  return (
    <div className="journalit-trade-review-context">
      {shownItems.map((item) => (
        <TradeReviewFieldRow
          key={item.id}
          item={item}
          editing={editing}
          plugin={plugin}
        />
      ))}
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

function TradeReviewMoreContext({
  items,
  editing,
  plugin,
}: {
  items: TradeReviewFieldDisplay[];
  editing: TradeReviewJournalEditing;
  plugin: JournalitPlugin;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const shownItems = getShownFieldDisplays(items, editing);
  if (shownItems.length === 0) return null;

  return (
    <div
      className={`journalit-trade-review-more-context ${isExpanded ? 'journalit-trade-review-more-context--expanded' : ''}`}
      
      {...(isExpanded ? {} : shareCaptureExcludeProps)}
    >
      <button
        type="button"
        className="journalit-trade-review-more-context-toggle"
        aria-expanded={isExpanded}
        onClick={() => {
          if (!isExpanded) {
            setIsExpanded(true);
            return;
          }
          void editing
            .save()
            .then(() => setIsExpanded(false))
            .catch(() => {
              // intentional
            });
        }}
      >
        <span
          className={`journalit-weekly-drc-accordion-indicator journalit-trade-review-more-context-chevron ${isExpanded ? 'is-expanded' : ''}`}
          aria-hidden="true"
        >
          <ChevronDown size={14} />
        </span>
        <span>{t('widget.trade-review.more-context')}</span>
        <span className="journalit-trade-review-more-context-count">
          {shownItems.filter(hasDisplayValue).length}
        </span>
      </button>
      {isExpanded && (
        <div className="journalit-trade-review-more-context-body">
          {shownItems.map((item) => (
            <TradeReviewFieldRow
              key={item.id}
              item={item}
              editing={editing}
              plugin={plugin}
            />
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


function formatTargetPrices(
  targets: Array<{ price?: number }> | undefined,
  formatPrice: (value: unknown) => string,
  emptyValue?: string
): string {
  if (!Array.isArray(targets)) return t('common.na');
  const values: string[] = [];
  for (const target of targets) {
    const formattedTarget = formatPrice(toFiniteNumber(target.price));
    if (isPresentDisplayValue(formattedTarget)) {
      values.push(formattedTarget);
    }
  }
  return values.length === 0 && emptyValue !== undefined
    ? emptyValue
    : values.join(', ');
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

interface TradeReviewFieldValueSources {
  trade: ReviewTrade;
  factValues: Partial<Record<TradeReviewCardField, string>>;
  customFieldDefinitions: CustomFieldDefinition[];
  formatCustomFieldValue: (value: unknown) => string;
  notesSections: string[] | undefined;
  
  notesSourcePath: string;
}


function buildFieldDisplays(
  fields: readonly TradeReviewFieldId[],
  {
    trade,
    factValues,
    customFieldDefinitions,
    formatCustomFieldValue,
    notesSections,
    notesSourcePath,
  }: TradeReviewFieldValueSources
): TradeReviewFieldDisplay[] {
  const items: TradeReviewFieldDisplay[] = [];
  const definitionsById = new Map(
    customFieldDefinitions.map((definition) => [definition.id, definition])
  );

  for (const field of fields) {
    if (isTradeReviewCustomFieldRef(field)) {
      const definition = definitionsById.get(
        getTradeReviewCustomFieldId(field)
      );
      if (!definition) continue;
      items.push({
        id: field,
        label: definition.label,
        kind: 'text',
        value: formatCustomFieldValue(getCustomFieldValue(trade, definition)),
        editableField: isEditableJournalField(definition)
          ? {
              kind: 'custom',
              id: definition.id,
              label: definition.label,
              definition,
            }
          : undefined,
      });
      continue;
    }
    if (field === 'customFields') continue;

    const label = getTradeReviewBuiltInFieldLabel(field);
    const chipField = getChipField(trade, field);
    if (chipField) {
      const { values, selectionId } = chipField;
      items.push({
        id: field,
        label,
        kind: 'chips',
        field,
        values,
        editableField: selectionId
          ? { kind: 'selection', id: selectionId, label }
          : undefined,
      });
      continue;
    }
    if (field === 'thesis') {
      items.push({
        id: field,
        label,
        kind: 'text',
        value: formatContextScalar(trade.thesis),
        editableField: { kind: 'text', id: 'thesis', label },
      });
      continue;
    }
    if (field === 'notes') {
      if (notesSections && notesSections.length > 0) {
        
        partitionMarkdownSectionsByHeading(
          typeof trade.notes === 'string' ? trade.notes : '',
          notesSections
        ).forEach((section, index) => {
          items.push({
            id: `notes:${index}`,
            label: section.heading,
            kind: 'text',
            value: section.content,
            markdownSourcePath: notesSourcePath,
          });
        });
      } else {
        items.push({
          id: field,
          label,
          kind: 'text',
          value: formatContextScalar(trade.notes),
          markdownSourcePath: notesSourcePath,
        });
      }
      continue;
    }
    items.push({
      id: field,
      label,
      kind: 'text',
      value: factValues[field] ?? '',
    });
  }

  return items;
}


function formatPositionSize({
  trade,
  currency,
  formatValue,
  isMasked,
}: {
  trade: ReviewTrade;
  currency: string;
  formatValue: ReturnType<typeof useDisplayFormatter>['formatValue'];
  isMasked: boolean;
}): string {
  const value = toFiniteNumber(trade.positionSize);
  if (isMasked || value === null) {
    return formatValue({
      kind: 'positionSize',
      value,
      fallback: t('common.na'),
    });
  }
  return formatTradePositionSize(
    value,
    trade.assetType,
    getCurrencyConfig(currency).locale
  );
}

function buildFactValues({
  trade,
  currency,
  formatPrice,
  formatValue,
  isPositionSizeMasked,
}: {
  trade: ReviewTrade;
  currency: string;
  formatPrice: (value: unknown, fillPrices?: readonly number[]) => string;
  formatValue: ReturnType<typeof useDisplayFormatter>['formatValue'];
  isPositionSizeMasked: boolean;
}): Partial<Record<TradeReviewCardField, string>> {
  const fillPrices = getExecutionFillPrices(trade);
  return {
    entry: formatPrice(
      trade.entryPrice ?? trade.entries?.[0]?.price,
      fillPrices.entry
    ),
    exit: formatPrice(
      trade.exitPrice ?? trade.exits?.[trade.exits.length - 1]?.price,
      fillPrices.exit
    ),
    duration: formatDuration(trade),
    risk: formatValue({
      kind: 'risk',
      value: toFiniteNumber(trade.riskAmount),
      currencyCode: currency,
      fallback: t('common.na'),
    }),
    positionSize: formatPositionSize({
      trade,
      currency,
      formatValue,
      isMasked: isPositionSizeMasked,
    }),
    stopLoss: formatTargetPrices(trade.stopLosses, formatPrice, t('common.na')),
    takeProfit: formatTargetPrices(trade.takeProfits, formatPrice),
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
  onFocusLeave,
}: {
  question: TradeReviewQuestionConfig;
  persistedValue: string;
  onDraftChange: (question: TradeReviewQuestionConfig, value: string) => void;
  
  onFocusLeave: () => void;
}) {
  const readOnly = useReviewReadOnly();
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
      readOnly={readOnly}
      spellCheck={false}
      placeholder={
        question.placeholder || t('widget.trade-review.placeholder.default')
      }
      rows={3}
      onFocus={() => {
        isFocusedRef.current = true;
      }}
      onChange={(event) => {
        if (readOnly) return;
        hasLocalDraftRef.current = true;
        onDraftChange(question, event.target.value);
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
      onBlur={(event) => {
        isFocusedRef.current = false;
        
        if (
          event.relatedTarget?.classList.contains(
            'journalit-trade-review-textarea'
          )
        ) {
          return;
        }
        onFocusLeave();
      }}
    />
  );
});

function TradeReviewChoiceInput({
  question,
  value,
  selectedOptionId,
  onSelect,
}: {
  question: TradeReviewQuestionConfig;
  value: string;
  selectedOptionId?: string;
  onSelect: (question: TradeReviewQuestionConfig, value: string) => void;
}) {
  const readOnly = useReviewReadOnly();
  const selectedValue = value.trim();
  return (
    <div
      className="journalit-trade-review-choice-options"
      role="group"
      aria-label={question.label}
    >
      {(question.options ?? []).map((option) => {
        const optionLabel = option.label.trim();
        if (!optionLabel) return null;
        const selected = selectedOptionId
          ? selectedOptionId === option.id
          : selectedValue === optionLabel;
        return (
          <button
            key={option.id}
            type="button"
            className={`journalit-trade-review-choice-option${selected ? ' is-selected' : ''}`}
            aria-pressed={selected}
            disabled={readOnly}
            onClick={() => onSelect(question, selected ? '' : optionLabel)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function shouldRetainTradeReviewChoiceDraft({
  review,
  question,
  questions,
  draft,
  saveInFlight,
}: {
  review: TradeReviewData | undefined;
  question: TradeReviewQuestionConfig;
  questions: TradeReviewQuestionConfig[];
  draft: { value: string; optionId?: string };
  saveInFlight: boolean;
}): boolean {
  if (saveInFlight) return true;
  const persistedOptionId = getReviewChoiceOptionId(review, question);
  const persistedValue = getReviewText(review, question, questions);
  const persistedMatches = draft.optionId
    ? persistedOptionId === draft.optionId
    : persistedOptionId === undefined &&
      persistedValue.trim() === draft.value.trim();
  return !persistedMatches;
}

type ChoiceDrafts = Record<string, { value: string; optionId?: string }>;

function pruneSettledChoiceDrafts(
  current: ChoiceDrafts,
  review: TradeReviewData | undefined,
  questions: TradeReviewQuestionConfig[],
  inFlightSaveCounts: Map<string, number>
): ChoiceDrafts {
  const questionsById = new Map(
    questions.map((question) => [question.id, question])
  );
  const entries = Object.entries(current).filter(([questionId, draft]) => {
    const question = questionsById.get(questionId);
    if (!question) return false;
    return shouldRetainTradeReviewChoiceDraft({
      review,
      question,
      questions,
      draft,
      saveInFlight: inFlightSaveCounts.has(questionId),
    });
  });
  return entries.length === Object.keys(current).length
    ? current
    : Object.fromEntries(entries);
}

function useTradeReviewChoiceDrafts({
  review,
  questions,
  commitQuestionSave,
}: {
  review: TradeReviewData | undefined;
  questions: TradeReviewQuestionConfig[];
  commitQuestionSave: (
    question: TradeReviewQuestionConfig,
    value: string
  ) => Promise<void>;
}): {
  choiceDrafts: ChoiceDrafts;
  handleChoiceSelect: (
    question: TradeReviewQuestionConfig,
    value: string
  ) => void;
} {
  const [choiceDrafts, setChoiceDrafts] = useState<ChoiceDrafts>({});
  const inFlightSaveCountsRef = useRef<Map<string, number>>(new Map());
  const latestPersistedRef = useRef({ review, questions });

  const handleChoiceSelect = useCallback(
    (question: TradeReviewQuestionConfig, value: string) => {
      const optionId = question.options?.find(
        (option) => option.label.trim() === value.trim()
      )?.id;
      setChoiceDrafts((current) => ({
        ...current,
        [question.id]: { value, optionId },
      }));
      const counts = inFlightSaveCountsRef.current;
      counts.set(question.id, (counts.get(question.id) ?? 0) + 1);
      const finishSave = (failed: boolean): void => {
        const remaining = (counts.get(question.id) ?? 1) - 1;
        if (remaining <= 0) {
          counts.delete(question.id);
          if (failed) {
            setChoiceDrafts((current) => {
              const next = { ...current };
              delete next[question.id];
              return next;
            });
            return;
          }
          
          
          setChoiceDrafts((current) =>
            pruneSettledChoiceDrafts(
              current,
              latestPersistedRef.current.review,
              latestPersistedRef.current.questions,
              counts
            )
          );
        } else {
          counts.set(question.id, remaining);
        }
      };
      void commitQuestionSave(question, value).then(
        () => finishSave(false),
        () => finishSave(true)
      );
    },
    [commitQuestionSave]
  );

  useEffect(() => {
    latestPersistedRef.current = { review, questions };
    setChoiceDrafts((current) =>
      pruneSettledChoiceDrafts(
        current,
        review,
        questions,
        inFlightSaveCountsRef.current
      )
    );
  }, [questions, review]);

  return { choiceDrafts, handleChoiceSelect };
}

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
  const readOnly = useReviewReadOnly();
  const saveTimersRef = useRef<Record<string, number>>({});
  const pendingSavesRef = useRef<
    Record<
      string,
      {
        question: TradeReviewQuestionConfig;
        value: string;
      }
    >
  >({});
  const saveQueueRef = useRef<Promise<void>>(RESOLVED_SAVE_PROMISE);
  const orderedQuestions = useMemo(
    () => orderTradeReviewQuestionsByHierarchy(questions),
    [questions]
  );
  const questionDepths = useMemo(
    () => resolveTradeReviewQuestionDepths(orderedQuestions),
    [orderedQuestions]
  );

  const commitQuestionSave = useCallback(
    (question: TradeReviewQuestionConfig, value: string) => {
      if (readOnly || !tradePath) return saveQueueRef.current;

      const commit = async () => {
        await plugin.tradeService.updateTradeReviewQuestion(
          tradePath,
          question.id,
          question.label,
          value,
          'user-input',
          orderedQuestions.map(({ id, label }) => ({
            id,
            label,
            depth: questionDepths.get(id) ?? 0,
            knownLabels: getAllLocalizedDefaultTradeReviewQuestionLabels(id),
          })),
          question.type === 'choice'
            ? question.options?.find(
                (option) => option.label.trim() === value.trim()
              )?.id
            : undefined
        );
      };

      saveQueueRef.current = saveQueueRef.current
        .catch(() => undefined)
        .then(commit);
      return saveQueueRef.current;
    },
    [orderedQuestions, plugin.tradeService, questionDepths, tradePath, readOnly]
  );

  const flushPendingSaves = useCallback(async () => {
    Object.values(saveTimersRef.current).forEach((timerId) => {
      window.clearTimeout(timerId);
    });
    saveTimersRef.current = {};

    Object.values(pendingSavesRef.current).forEach(({ question, value }) => {
      void commitQuestionSave(question, value);
    });
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

  
  
  const saveOnFocusLeave = useCallback(() => {
    void flushPendingSaves();
  }, [flushPendingSaves]);

  
  
  
  
  const flushPendingSavesRef = useRef(flushPendingSaves);
  useEffect(() => {
    flushPendingSavesRef.current = flushPendingSaves;
  }, [flushPendingSaves]);
  useEffect(() => {
    const flushOnUnmount = flushPendingSavesRef;
    return () => {
      void flushOnUnmount.current();
    };
  }, []);

  const flushQuestionSave = useCallback(
    (questionId: string) => {
      const timerId = saveTimersRef.current[questionId];
      if (timerId !== undefined) {
        window.clearTimeout(timerId);
        delete saveTimersRef.current[questionId];
      }

      const pendingSave = pendingSavesRef.current[questionId];
      if (!pendingSave) return;
      delete pendingSavesRef.current[questionId];
      void commitQuestionSave(pendingSave.question, pendingSave.value);
    },
    [commitQuestionSave]
  );

  const scheduleQuestionSave = useCallback(
    (question: TradeReviewQuestionConfig, value: string) => {
      const existingTimerId = saveTimersRef.current[question.id];
      if (existingTimerId !== undefined) {
        window.clearTimeout(existingTimerId);
      }

      pendingSavesRef.current[question.id] = { question, value };
      saveTimersRef.current[question.id] = window.setTimeout(() => {
        if (isTradeReviewTextareaFocused()) {
          scheduleQuestionSave(question, value);
          return;
        }

        flushQuestionSave(question.id);
      }, 500);
    },
    [flushQuestionSave]
  );

  const { choiceDrafts, handleChoiceSelect } = useTradeReviewChoiceDrafts({
    review,
    questions: orderedQuestions,
    commitQuestionSave,
  });

  if (questions.length === 0) {
    return null;
  }

  const getEffectiveAnswer = (question: TradeReviewQuestionConfig): string =>
    choiceDrafts[question.id]?.value ??
    getReviewText(review, question, questions);

  const getEffectiveOptionId = (
    question: TradeReviewQuestionConfig
  ): string | undefined => {
    const draft = choiceDrafts[question.id];
    return draft ? draft.optionId : getReviewChoiceOptionId(review, question);
  };

  const visibleQuestions = resolveVisibleTradeReviewQuestions(
    orderedQuestions,
    getEffectiveAnswer,
    getEffectiveOptionId
  );
  return (
    <div className="journalit-trade-review-questions">
      {visibleQuestions.map((question) => {
        const depth = questionDepths.get(question.id) ?? 0;
        const isFollowUp = depth > 0;
        const visualDepth = Math.min(depth, 4);
        const followUpIndicator = isFollowUp ? (
          <CornerDownRight
            size={16}
            aria-hidden="true"
            className="journalit-trade-review-follow-up-icon"
          />
        ) : null;
        if (question.type === 'choice') {
          return (
            <div
              key={question.id}
              className={`journalit-trade-review-question${isFollowUp ? ' is-follow-up' : ''}`}
              style={cssVars({
                '--journalit-trade-review-follow-up-depth':
                  visualDepth.toString(),
              })}
            >
              {followUpIndicator}
              <span className="journalit-trade-review-question-label">
                {question.label}
              </span>
              <TradeReviewChoiceInput
                question={question}
                value={getEffectiveAnswer(question)}
                selectedOptionId={getEffectiveOptionId(question)}
                onSelect={handleChoiceSelect}
              />
            </div>
          );
        }
        return (
          <label
            key={question.id}
            className={`journalit-trade-review-question${isFollowUp ? ' is-follow-up' : ''}`}
            
            {...(getReviewText(review, question, questions).trim()
              ? {}
              : shareCaptureExcludeProps)}
            style={cssVars({
              '--journalit-trade-review-follow-up-depth':
                visualDepth.toString(),
            })}
          >
            {followUpIndicator}
            <span className="journalit-trade-review-question-label">
              {question.label}
            </span>
            <TradeReviewQuestionInput
              question={question}
              persistedValue={getReviewText(review, question, questions)}
              onDraftChange={scheduleQuestionSave}
              onFocusLeave={saveOnFocusLeave}
            />
          </label>
        );
      })}
    </div>
  );
}

TradeReviewQuestions.displayName = 'TradeReviewQuestions';

const TradeReviewCardBody: React.FC<{
  images: string[];
  readOnly: boolean;
  showMedia: boolean;
  trade: ReviewTrade;
  filePath: string;
  plugin: JournalitPlugin;
  cardItems: TradeReviewFieldDisplay[];
  visibleItems: TradeReviewFieldDisplay[];
  moreContextItems: TradeReviewFieldDisplay[];
  questions: TradeReviewQuestionConfig[];
  review: TradeReviewData | undefined;
  questionSaveRef: React.RefObject<TradeReviewQuestionSaveHandle | null>;
  journalSaveRef: React.RefObject<TradeReviewJournalSaveHandle | null>;
  canEditJournal: boolean;
}> = ({
  images,
  readOnly,
  showMedia,
  trade,
  filePath,
  plugin,
  cardItems,
  visibleItems,
  moreContextItems,
  questions,
  review,
  questionSaveRef,
  journalSaveRef,
  canEditJournal,
}) => {
  const canUpload =
    canEditJournal && Boolean(getTradeMediaOwner(trade.path, trade.instrument));
  const editing = useTradeReviewJournalEditing(
    plugin,
    trade.path,
    canEditJournal,
    journalSaveRef
  );
  const renderMedia = (thumbnailActions?: React.ReactNode) =>
    images.length > 0 ? (
      <div className="journalit-trade-review-media journalit-images-widget journalit-media-carousel-surface">
        <ImageCarousel
          images={images}
          thumbnailActions={thumbnailActions}
          altPrefix={t('widget.trade-review.image-alt-prefix')}
          displayOptions={{
            showThumbnails: true,
            showCounter: images.length > 1,
            enableFullscreen: true,
          }}
          deleteOptions={{ enabled: false }}
          fullscreenAnnotationOptions={{ enabled: !readOnly }}
          useResolveMediaPath={true}
          sourcePath={trade.path || filePath}
        />
      </div>
    ) : null;
  return (
    <div className="journalit-trade-review-card-body">
      {showMedia &&
        (canUpload && trade.path ? (
          <TradeReviewEditableMedia
            plugin={plugin}
            tradePath={trade.path}
            editing={editing}
            empty={images.length === 0}
          >
            {renderMedia}
          </TradeReviewEditableMedia>
        ) : (
          (renderMedia() ?? (
            <div
              className="journalit-trade-review-empty-media"
              {...shareCaptureExcludeProps}
            >
              {t('widget.trade-review.no-image')}
            </div>
          ))
        ))}

      <TradeReviewMetrics items={cardItems} editing={editing} />

      <TradeReviewContext
        items={visibleItems}
        editing={editing}
        plugin={plugin}
      />

      <TradeReviewMoreContext
        items={moreContextItems}
        editing={editing}
        plugin={plugin}
      />

      <TradeReviewQuestions
        ref={questionSaveRef}
        plugin={plugin}
        tradePath={trade.path}
        questions={questions}
        review={review}
      />

      <div
        className="journalit-trade-review-actions"
        {...shareCaptureExcludeProps}
      >
        {trade.path && (
          <button
            type="button"
            className="journalit-trade-review-secondary-action"
            onClick={() => void openReviewWidgetFile(plugin, trade.path!)}
          >
            {t('widget.trade-review.open-trade-note')}
          </button>
        )}
      </div>
    </div>
  );
};

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
  const readOnly = useReviewReadOnly();
  return (
    <div
      ref={headerRef}
      className="journalit-trade-review-card-header"
      data-expanded={isExpanded ? 'true' : 'false'}
    >
      <button
        type="button"
        className="journalit-native-button journalit-native-button--unstyled journalit-trade-review-card-header-toggle"
        aria-expanded={isExpanded}
        onClick={onToggleExpanded}
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
      </button>
      <button
        type="button"
        className={`journalit-weekly-drc-mark-reviewed-button ${isReviewed ? 'journalit-weekly-drc-mark-reviewed-button--reviewed' : ''}`}
        onClick={onToggleReviewed}
        onKeyDown={(event) => event.stopPropagation()}
        aria-pressed={isReviewed}
        disabled={readOnly}
        {...shareCaptureExcludeProps}
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

async function updateTradeReviewStatusForTrade(
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

async function queueTradeReviewStatusUpdate(
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


function createTradeReviewPriceFormatter({
  currency,
  formatValue,
  isPriceMasked,
}: {
  currency: string;
  formatValue: ReturnType<typeof useDisplayFormatter>['formatValue'];
  isPriceMasked: boolean;
}): (value: unknown, fillPrices?: readonly number[]) => string {
  const { locale } = getCurrencyConfig(currency);
  return (value, fillPrices) => {
    const numericValue = toFiniteNumber(value);
    if (numericValue === null) return t('common.na');
    if (fillPrices) {
      return formatValue({
        kind: 'price',
        value: numericValue,
        currencyCode: currency,
        priceStyle: 'decimal',
        fillPrices,
        fallback: t('common.na'),
      });
    }
    if (isPriceMasked) {
      return formatValue({
        kind: 'price',
        value: numericValue,
        currencyCode: currency,
        fallback: t('common.na'),
      });
    }
    return numericValue.toLocaleString(locale, {
      minimumFractionDigits: numericValue < 10 ? 4 : 2,
      maximumFractionDigits: numericValue < 10 ? 5 : 2,
    });
  };
}

function resolveCardFieldConfig(config: TradeReviewWidgetConfig) {
  return {
    fieldLayout: resolveTradeReviewFieldLayout(config),
    showMedia: config.showImages !== false,
  };
}

function outcomeClassName(outcome: ReturnType<typeof getOutcome>): string {
  if (outcome === 'open') return '';
  if (outcome === 'win') return 'journalit-trade-review-card-outcome--positive';
  if (outcome === 'loss')
    return 'journalit-trade-review-card-outcome--negative';
  return 'journalit-trade-review-card-outcome--muted';
}


function canEditTradeJournal(trade: ReviewTrade, readOnly: boolean): boolean {
  return Boolean(trade.path) && !readOnly && trade.isCopiedTrade !== true;
}

function tradeReviewCardTitle(
  trade: ReviewTrade,
  showInstrument: boolean
): string {
  return [
    showInstrument && trade.instrument ? trade.instrument : null,
    formatDirectionLabel(trade),
  ]
    .filter(Boolean)
    .join(' · ');
}


function useOptimisticReviewed(
  trade: ReviewTrade
): [boolean, (reviewed: boolean | undefined) => void] {
  const savedState = `${String(trade.reviewed)}|${String(trade.reviewedAt)}`;
  const [local, setLocal] = useState<boolean | undefined>();
  const [localSavedState, setLocalSavedState] = useState(savedState);
  if (localSavedState !== savedState) {
    setLocalSavedState(savedState);
    setLocal(undefined);
  }
  return [local ?? trade.reviewed === true, setLocal];
}


function useCardExpansion(
  filePath: string,
  cardKey: string,
  isInitiallyExpanded: boolean
): [boolean, (expanded: boolean) => void] {
  const [override, setOverride] = useState<boolean | undefined>(() =>
    getStoredCardExpansion(filePath, cardKey)
  );
  const setExpanded = (expanded: boolean) => {
    setOverride(expanded);
    setStoredCardExpansion(filePath, cardKey, expanded);
  };
  return [override ?? isInitiallyExpanded, setExpanded];
}

const TradeReviewCard: React.FC<{
  trade: ReviewTrade;
  index: number;
  filePath: string;
  plugin: JournalitPlugin;
  config: TradeReviewWidgetConfig;
  showInstrument: boolean;
  isInitiallyExpanded: boolean;
  enableStickyHeader: boolean;
  preview: boolean;
  onSessionVisibilityChange: (filePath: string, keepVisible: boolean) => void;
}> = ({
  trade,
  index,
  filePath,
  plugin,
  config,
  showInstrument,
  isInitiallyExpanded,
  enableStickyHeader,
  preview,
  onSessionVisibilityChange,
}) => {
  const readOnly = useReviewReadOnly();
  const cardKey = getTradeKey(trade, index);
  const cardRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const questionSaveRef = useRef<TradeReviewQuestionSaveHandle | null>(null);
  const journalSaveRef = useRef<TradeReviewJournalSaveHandle | null>(null);
  const journalTransitionRef = useRef(false);
  const [isExpanded, setExpanded] = useCardExpansion(
    filePath,
    cardKey,
    isInitiallyExpanded
  );
  const [isReviewed, setLocalReviewed] = useOptimisticReviewed(trade);

  const { currency: globalCurrency } = useCurrency();
  const { formatValue, shouldMask } = useDisplayFormatter();
  const isPnlMasked = shouldMask('pnl');
  const isRMasked = shouldMask('rMultiple');
  const isPriceMasked = shouldMask('price');
  const currency =
    typeof trade.currency === 'string' ? trade.currency : globalCurrency;
  const outcome = getOutcome(trade, plugin.settings.trade);
  const review = trade.tradeReview;
  const isOutcomeMasked = isPnlMasked || isRMasked;
  const questions = includeLegacyAnsweredQuestions(
    getDisplayQuestions(config, outcome, isOutcomeMasked),
    isOutcomeMasked ? undefined : review
  );
  const { fieldLayout, showMedia } = resolveCardFieldConfig(config);
  const customFieldDefinitions = plugin.customFieldsService?.getFields() ?? [];
  const images = showMedia ? normalizeImages(trade.images) : [];
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
  const outcomeClass = isOutcomeMasked ? '' : outcomeClassName(outcome);

  const formatPrice = createTradeReviewPriceFormatter({
    currency,
    formatValue,
    isPriceMasked,
  });

  const handleToggleReviewed = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (readOnly || !trade.path) return;
    const tradePath = trade.path;
    if (journalTransitionRef.current) return;
    journalTransitionRef.current = true;
    void (async () => {
      await journalSaveRef.current?.flushPendingSaves();
      const nextReviewed = !isReviewed;
      
      
      const pendingAnswerSaves =
        questionSaveRef.current?.flushPendingSaves() ?? Promise.resolve();
      
      
      pendingAnswerSaves.catch(() => undefined);
      setLocalReviewed(nextReviewed);
      if (nextReviewed && isExpanded) {
        keepReviewItemHeaderInPlaceOnCollapse(cardRef.current);
        setExpanded(false);
      }
      plugin.reviewDataCache?.setSessionReviewedTradeVisibility(
        filePath,
        tradePath,
        nextReviewed
      );
      onSessionVisibilityChange(tradePath, nextReviewed);
      window.setTimeout(() => {
        void (async () => {
          await pendingAnswerSaves;
          await queueTradeReviewStatusUpdate(plugin, trade, nextReviewed);
        })().catch((error: unknown) => {
          console.error(
            '[TradeReviewWidget] Error updating review status:',
            error
          );
          plugin.reviewDataCache?.setSessionReviewedTradeVisibility(
            filePath,
            tradePath,
            false
          );
          setLocalReviewed(undefined);
          onSessionVisibilityChange(tradePath, false);
        });
      }, 0);
    })()
      .catch((error: unknown) => {
        new Notice(error instanceof Error ? error.message : String(error));
      })
      .finally(() => {
        journalTransitionRef.current = false;
      });
  };

  const toggleExpansion = () => {
    const applyExpansion = () => {
      const nextExpanded = !isExpanded;
      if (!nextExpanded) {
        keepReviewItemHeaderInPlaceOnCollapse(cardRef.current);
      }
      setExpanded(nextExpanded);
    };
    if (!isExpanded || !journalSaveRef.current || readOnly || preview) {
      applyExpansion();
      return;
    }
    if (journalTransitionRef.current) return;
    journalTransitionRef.current = true;
    void journalSaveRef.current
      .flushPendingSaves()
      .then(applyExpansion)
      .catch((error: unknown) => {
        new Notice(error instanceof Error ? error.message : String(error));
      })
      .finally(() => {
        journalTransitionRef.current = false;
      });
  };

  const canEditJournal = canEditTradeJournal(trade, readOnly || preview);
  const fieldValueSources: TradeReviewFieldValueSources = {
    trade,
    factValues: buildFactValues({
      trade,
      currency,
      formatPrice,
      formatValue,
      isPositionSizeMasked: shouldMask('positionSize'),
    }),
    customFieldDefinitions,
    formatCustomFieldValue: (value) =>
      shouldMask('metric')
        ? formatValue({ kind: 'metric', value: 0, precision: 0 })
        : formatContextScalar(value),
    notesSections: config.notesSections,
    notesSourcePath: trade.path || filePath,
  };
  const fieldGroups = expandTradeReviewFieldGroups(
    fieldLayout,
    customFieldDefinitions.map((definition) => definition.id)
  );
  const cardItems = buildFieldDisplays(fieldGroups.cards, fieldValueSources);
  const visibleItems = buildFieldDisplays(
    fieldGroups.visible,
    fieldValueSources
  );
  const moreContextItems = buildFieldDisplays(
    fieldGroups.collapsed,
    fieldValueSources
  );

  const title = tradeReviewCardTitle(trade, showInstrument);
  const stickyHeader = useStickyHeader({
    containerRef: cardRef,
    enabled: enableStickyHeader && isExpanded,
    headerRef,
  });

  return (
    <article ref={cardRef} className="journalit-trade-review-card">
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

      <StickyHeaderPortal
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
      </StickyHeaderPortal>

      {isExpanded && (
        <TradeReviewCardBody
          images={images}
          readOnly={readOnly}
          showMedia={showMedia}
          trade={trade}
          filePath={filePath}
          plugin={plugin}
          cardItems={cardItems}
          visibleItems={visibleItems}
          moreContextItems={moreContextItems}
          questions={questions}
          review={review}
          questionSaveRef={questionSaveRef}
          journalSaveRef={journalSaveRef}
          canEditJournal={canEditJournal}
        />
      )}
    </article>
  );
};

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
      contexts: Array<Pick<ReviewTrade, 'tradeReview' | 'notes'>>;
    } | null>(null);
    const markdownContexts =
      markdownReviewState?.key === baseTradesKey
        ? markdownReviewState.contexts
        : null;
    
    
    const trades = useMemo(
      () =>
        markdownContexts
          ? baseTrades.map((trade, index) => ({
              ...trade,
              ...markdownContexts[index],
            }))
          : baseTrades,
      [baseTrades, markdownContexts]
    );

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
              contexts: asReviewTrades(hydratedTrades).map(
                ({ tradeReview, notes }) => ({ tradeReview, notes })
              ),
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
          ? trades.filter(
              (trade) => getOutcome(trade, plugin.settings.trade) !== 'open'
            )
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
      plugin.settings.trade,
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
              enableStickyHeader={!preview}
              preview={preview}
              onSessionVisibilityChange={handleSessionVisibilityChange}
            />
          ))}
        </div>
      </div>
    );
  }
);

TradeReviewWidget.displayName = 'TradeReviewWidget';
