import { parseLocalDateSafe } from '../../utils/dateUtils';
import { createTickerMatcher } from '../../utils/tickerMatching';
import type { DirectionFilter, TradeLogFilters } from '../tradelog/types';
import type { ImageGalleryItem } from '../../components/imageGallery/types';
import {
  getStringArray,
  isRecord,
  SELECTABLE_TRADE_STATUSES,
} from './ImageGalleryInternal';

function getTimestamp(date: string): number {
  const timestamp = parseLocalDateSafe(date)?.getTime() ?? Number.NaN;
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function includesAny(values: string[], selected: string[]): boolean {
  if (selected.length === 0) return true;
  const normalizedValues = new Set(values.map((value) => value.toLowerCase()));
  return selected.some((selectedValue) =>
    normalizedValues.has(selectedValue.toLowerCase())
  );
}

function includesAnyWithNoValueSentinel(
  values: string[],
  selected: string[],
  noValueSentinel: string
): boolean {
  if (selected.length === 0) return true;

  const hasNoValueFilter = selected.includes(noValueSentinel);
  if (hasNoValueFilter && values.length === 0) return true;

  const regularSelected = selected.filter((value) => value !== noValueSentinel);
  if (regularSelected.length === 0) return false;

  return includesAny(values, regularSelected);
}

export function normalizeCustomFieldFilterValue(value: unknown): string | null {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }
  if (
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    value instanceof Date
  ) {
    return String(value);
  }
  return null;
}

function hasAnySourceCustomFieldValue(
  item: ImageGalleryItem,
  selectedCustomFields: TradeLogFilters['customFieldFilters']
): boolean {
  return Object.entries(selectedCustomFields || {}).every(
    ([fieldId, selectedValues]) => {
      if (!Array.isArray(selectedValues) || selectedValues.length === 0) {
        return true;
      }

      const itemValues = item.sourceCustomFields[fieldId] ?? [];
      if (itemValues.length === 0) {
        return selectedValues.includes(`__NO_VALUE__${fieldId}`);
      }

      return selectedValues.some((selectedValue) => {
        if (selectedValue === `__NO_VALUE__${fieldId}`) return false;
        const normalizedSelected = selectedValue.toLowerCase();
        return itemValues.some(
          (itemValue) => itemValue.toLowerCase() === normalizedSelected
        );
      });
    }
  );
}

function matchesImageAnnotationStatus(
  item: ImageGalleryItem,
  selectedStatuses: string[]
): boolean {
  if (selectedStatuses.length === 0) return true;

  return selectedStatuses.some((status) => {
    if (status === 'tagged') {
      return item.tags.length > 0;
    }
    if (status === 'untagged') {
      return item.tags.length === 0;
    }
    if (status === 'hasNotes') {
      return Boolean(item.notes?.trim());
    }
    if (status === 'noNotes') {
      return !item.notes?.trim();
    }
    return false;
  });
}

function normalizeDirectionFilterValue(
  value: string | undefined
): DirectionFilter | null {
  const direction = value?.toLowerCase() ?? '';
  if (direction === 'buy' || direction === 'long' || direction === 'call') {
    return 'long';
  }
  if (direction === 'sell' || direction === 'short' || direction === 'put') {
    return 'short';
  }
  return null;
}

export function matchesImageGalleryTradeLogFilters(
  item: ImageGalleryItem,
  filters: TradeLogFilters
): boolean {
  const [startDate, endDate] = filters.dateRange;
  const timestamp = getTimestamp(item.date);
  if (startDate && timestamp < startDate.getTime()) return false;
  if (endDate && timestamp > endDate.getTime()) return false;

  if (filters.tickers.length > 0) {
    const matcher = createTickerMatcher(filters.tickers);
    const matched = matcher(item.symbol || item.sourceLabel || '');
    if (!matched) return false;
  }

  if (
    filters.accounts.length === 0 &&
    item.isCopiedTrade &&
    !item.includeInAllAccounts
  ) {
    return false;
  }

  if (filters.accounts.length > 0) {
    if (item.accounts && item.accounts.length > 0) {
      if (!includesAny(item.accounts, filters.accounts)) return false;
    } else if (!item.account) {
      return false;
    } else if (!includesAny([item.account], filters.accounts)) {
      return false;
    }
  }

  if (filters.tradeTypes.length > 0 && filters.tradeTypes.length < 3) {
    if (!item.tradeType || !filters.tradeTypes.includes(item.tradeType)) {
      return false;
    }
  }

  if (filters.directions.length > 0) {
    const normalizedDirection = normalizeDirectionFilterValue(item.direction);
    if (
      !normalizedDirection ||
      !filters.directions.includes(normalizedDirection)
    ) {
      return false;
    }
  }

  if (
    !includesAnyWithNoValueSentinel(
      item.setupIds,
      filters.setups,
      '__NO_SETUP__'
    )
  ) {
    return false;
  }
  if (
    !includesAnyWithNoValueSentinel(
      item.sourceTags,
      filters.tags,
      '__NO_TAGS__'
    )
  ) {
    return false;
  }
  if (
    !includesAnyWithNoValueSentinel(
      item.mistakes,
      filters.mistakes,
      '__NO_MISTAKES__'
    )
  ) {
    return false;
  }

  if (!hasAnySourceCustomFieldValue(item, filters.customFieldFilters)) {
    return false;
  }

  if (filters.reviewStatus.length === 1) {
    if (item.reviewed === undefined) return false;
    const reviewed = item.reviewed ? 'reviewed' : 'unreviewed';
    if (!filters.reviewStatus.includes(reviewed)) return false;
  }

  if (
    filters.statuses.length > 0 &&
    filters.statuses.length < SELECTABLE_TRADE_STATUSES.length
  ) {
    const status = item.tradeStatus ?? 'all';
    if (status === 'all' || !filters.statuses.includes(status)) return false;
  }

  if (!matchesImageAnnotationStatus(item, filters.imageAnnotationStatus)) {
    return false;
  }

  if (
    !includesAnyWithNoValueSentinel(
      item.tags,
      filters.imageTags,
      '__NO_IMAGE_TAGS__'
    )
  ) {
    return false;
  }

  return true;
}

export function normalizeStringArrayRecord(
  value: unknown
): Record<string, string[]> {
  if (!isRecord(value)) return {};
  return Object.fromEntries(
    Object.entries(value).flatMap(([key, entryValue]) => {
      const values = getStringArray(entryValue);
      return values.length > 0 ? [[key, values]] : [];
    })
  );
}
