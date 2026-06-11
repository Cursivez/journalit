

import { getDaysToExpiry } from '../../utils/dateUtils';
import {
  calculateTradePriceMove,
  getEffectivePnL,
  getFirstEntryTime,
  getLastExitTime,
  getTotalEntrySize,
  getWeightedAverageEntryPrice,
} from '../../utils/tradeStatusUtils';
import { calculateEffectiveRMultiple } from '../../utils/formatting';
import {
  calculateTradeMaxR,
  calculateTradeReturnPercent,
  getTradeMaeValue,
  getTradeMfeValue,
} from './tradeMetricUtils';
import { TimeNode } from '../../services/tradelog/types';
import { ColumnDefinition } from './columnConfig';
import {
  CustomFieldType,
  type CustomFieldTradeLogDropdownSortMode,
} from '../../types/customFields';
import { parseStoredDateLikeValue } from '../../utils/customFieldPersistence';
import {
  calculateDirectionalPriceDiff,
  calculateTotalDividends,
} from '../../utils/pnlCalculation';
import {
  getCustomFieldDisplayValues,
  getCustomFieldRawValue,
} from './customFieldDisplay';

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  column: string | null;
  direction: SortDirection;
}

const textCollator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: 'base',
});

function compareValues<T extends number | string>(
  valueA: T | null,
  valueB: T | null,
  direction: SortDirection
): number {
  if (valueA === null && valueB === null) return 0;
  if (valueA === null) return 1;
  if (valueB === null) return -1;

  const comparison =
    typeof valueA === 'number' && typeof valueB === 'number'
      ? valueA - valueB
      : textCollator.compare(String(valueA), String(valueB));

  return direction === 'asc' ? comparison : -comparison;
}

interface CustomDropdownSortValue {
  raw: string | null;
  display: string | null;
}

function getCustomDropdownSortValue(
  trade: Record<string, unknown> | undefined,
  column: ColumnDefinition
): CustomDropdownSortValue {
  const field = column.customField;
  if (!field || !trade) {
    return { raw: null, display: null };
  }

  const rawValue = getCustomFieldRawValue(trade, field);
  const displayValue = getCustomFieldDisplayValues(field, rawValue)[0] || null;
  const normalizedRaw =
    rawValue === undefined || rawValue === null
      ? null
      : String(rawValue).trim();

  return {
    raw: normalizedRaw ? normalizedRaw : null,
    display: displayValue,
  };
}

function compareCustomDropdownValues(
  valueA: CustomDropdownSortValue,
  valueB: CustomDropdownSortValue,
  mode: CustomFieldTradeLogDropdownSortMode,
  direction: SortDirection,
  column: ColumnDefinition
): number {
  const displayA = valueA.display;
  const displayB = valueB.display;

  const isEmptyA = !displayA;
  const isEmptyB = !displayB;
  if (isEmptyA && isEmptyB) return 0;
  if (isEmptyA) return 1;
  if (isEmptyB) return -1;

  if (mode === 'alphabetical') {
    return compareValues(displayA, displayB, direction);
  }

  if (mode === 'numeric') {
    const numericA = Number(displayA);
    const numericB = Number(displayB);
    const hasNumericA = Number.isFinite(numericA);
    const hasNumericB = Number.isFinite(numericB);

    if (hasNumericA && hasNumericB) {
      return compareValues(numericA, numericB, direction);
    }
    if (hasNumericA !== hasNumericB) {
      return hasNumericA ? -1 : 1;
    }

    return compareValues(displayA, displayB, direction);
  }

  const optionOrder = new Map(
    (column.customField?.options || []).map((option, index) => [
      option.value,
      index,
    ])
  );
  const rankA = valueA.raw ? optionOrder.get(valueA.raw) : undefined;
  const rankB = valueB.raw ? optionOrder.get(valueB.raw) : undefined;
  const hasRankA = rankA !== undefined;
  const hasRankB = rankB !== undefined;

  if (hasRankA && hasRankB) {
    return direction === 'asc' ? rankA - rankB : rankB - rankA;
  }
  if (hasRankA !== hasRankB) {
    return hasRankA ? -1 : 1;
  }

  return compareValues(displayA, displayB, direction);
}

function sortByCustomField(
  nodes: TimeNode[],
  direction: SortDirection,
  column: ColumnDefinition
): TimeNode[] {
  const field = column.customField;
  if (!field || !column.sortable) {
    return nodes;
  }

  const getSortValue = (
    trade: Record<string, unknown> | undefined
  ): number | string | null => {
    const rawValue = trade ? getCustomFieldRawValue(trade, field) : undefined;

    if (
      rawValue === undefined ||
      rawValue === null ||
      rawValue === '' ||
      (Array.isArray(rawValue) && rawValue.length === 0)
    ) {
      return null;
    }

    switch (field.type) {
      case CustomFieldType.NUMBER: {
        const numericValue = Number(rawValue);
        return Number.isFinite(numericValue) ? numericValue : null;
      }
      case CustomFieldType.DATE:
      case CustomFieldType.DATETIME: {
        const parsedDate = parseStoredDateLikeValue(
          rawValue as string | Date | undefined,
          field.type === CustomFieldType.DATETIME
            ? { includeTime: true }
            : undefined
        );
        return parsedDate ? parsedDate.getTime() : null;
      }
      case CustomFieldType.TIME: {
        const parsedTime = parseStoredDateLikeValue(
          rawValue as string | Date | undefined,
          { timeOnly: true }
        );
        if (!parsedTime) {
          return null;
        }
        return (
          parsedTime.getHours() * 3600 +
          parsedTime.getMinutes() * 60 +
          parsedTime.getSeconds()
        );
      }
      case CustomFieldType.MULTISELECT:
        return null;
      case CustomFieldType.TEXT:
      default: {
        const stringValue = String(rawValue).trim();
        return stringValue ? stringValue : null;
      }
    }
  };

  return [...nodes].sort((a, b) => {
    if (a.type !== 'trade' || b.type !== 'trade') return 0;

    if (field.type === CustomFieldType.DROPDOWN) {
      const sortMode = field.tradeLog?.dropdownSortMode;
      if (!sortMode) {
        return 0;
      }

      return compareCustomDropdownValues(
        getCustomDropdownSortValue(
          a.trade as Record<string, unknown> | undefined,
          column
        ),
        getCustomDropdownSortValue(
          b.trade as Record<string, unknown> | undefined,
          column
        ),
        sortMode,
        direction,
        column
      );
    }

    const valueA = getSortValue(a.trade as Record<string, unknown> | undefined);
    const valueB = getSortValue(b.trade as Record<string, unknown> | undefined);

    return compareValues(valueA, valueB, direction);
  });
}


function sortByPnL(nodes: TimeNode[], direction: SortDirection): TimeNode[] {
  return [...nodes].sort((a, b) => {
    if (a.type !== 'trade' || b.type !== 'trade') return 0;

    const pnlA = getEffectivePnL((a.trade as Record<string, unknown>) || {});
    const pnlB = getEffectivePnL((b.trade as Record<string, unknown>) || {});

    return direction === 'asc' ? pnlA - pnlB : pnlB - pnlA;
  });
}

function sortByDividends(
  nodes: TimeNode[],
  direction: SortDirection
): TimeNode[] {
  return [...nodes].sort((a, b) => {
    if (a.type !== 'trade' || b.type !== 'trade') return 0;

    const dividendsA = calculateTotalDividends(a.trade ?? {});
    const dividendsB = calculateTotalDividends(b.trade ?? {});

    return direction === 'asc'
      ? dividendsA - dividendsB
      : dividendsB - dividendsA;
  });
}


function sortByDate(nodes: TimeNode[], direction: SortDirection): TimeNode[] {
  return [...nodes].sort((a, b) => {
    if (a.type !== 'trade' || b.type !== 'trade') return 0;

    const dateA = getFirstEntryTime(a.trade ?? {})?.getTime() ?? 0;
    const dateB = getFirstEntryTime(b.trade ?? {})?.getTime() ?? 0;

    return direction === 'asc' ? dateA - dateB : dateB - dateA;
  });
}


function sortByPositionSize(
  nodes: TimeNode[],
  direction: SortDirection
): TimeNode[] {
  return [...nodes].sort((a, b) => {
    if (a.type !== 'trade' || b.type !== 'trade') return 0;

    const sizeA = getTotalEntrySize(a.trade ?? {}) ?? 0;
    const sizeB = getTotalEntrySize(b.trade ?? {}) ?? 0;

    return direction === 'asc' ? sizeA - sizeB : sizeB - sizeA;
  });
}


function sortByDuration(
  nodes: TimeNode[],
  direction: SortDirection
): TimeNode[] {
  return [...nodes].sort((a, b) => {
    if (a.type !== 'trade' || b.type !== 'trade') return 0;

    const getDuration = (
      trade: Record<string, unknown> | undefined
    ): number => {
      const entry = getFirstEntryTime(trade ?? {})?.getTime();
      const exit = getLastExitTime(trade ?? {})?.getTime();
      if (entry === undefined || exit === undefined) return 0;
      return exit - entry; 
    };

    const durationA = getDuration(a.trade as Record<string, unknown>);
    const durationB = getDuration(b.trade as Record<string, unknown>);

    return direction === 'asc' ? durationA - durationB : durationB - durationA;
  });
}


function sortByExitDate(
  nodes: TimeNode[],
  direction: SortDirection
): TimeNode[] {
  return [...nodes].sort((a, b) => {
    if (a.type !== 'trade' || b.type !== 'trade') return 0;

    const exitA = getLastExitTime(
      (a.trade as Record<string, unknown>) || undefined
    );
    const exitB = getLastExitTime(
      (b.trade as Record<string, unknown>) || undefined
    );

    
    if (!exitA && !exitB) return 0;
    if (!exitA) return 1;
    if (!exitB) return -1;

    const timeA = exitA.getTime();
    const timeB = exitB.getTime();
    const comparison = timeA - timeB;

    return direction === 'asc' ? comparison : -comparison;
  });
}


function sortByRMultiple(
  nodes: TimeNode[],
  direction: SortDirection,
  defaultRiskAmount?: number
): TimeNode[] {
  return [...nodes].sort((a, b) => {
    if (a.type !== 'trade' || b.type !== 'trade') return 0;

    const rMultipleA = calculateEffectiveRMultiple(
      getEffectivePnL((a.trade as Record<string, unknown>) || {}),
      a.trade?.rMultiple as number | undefined,
      a.trade?.riskAmount as number | undefined,
      defaultRiskAmount
    );
    const rMultipleB = calculateEffectiveRMultiple(
      getEffectivePnL((b.trade as Record<string, unknown>) || {}),
      b.trade?.rMultiple as number | undefined,
      b.trade?.riskAmount as number | undefined,
      defaultRiskAmount
    );

    
    if (rMultipleA === undefined && rMultipleB === undefined) return 0;
    if (rMultipleA === undefined) return 1;
    if (rMultipleB === undefined) return -1;

    const comparison = rMultipleA - rMultipleB;
    return direction === 'asc' ? comparison : -comparison;
  });
}

function sortByMaxR(
  nodes: TimeNode[],
  direction: SortDirection,
  defaultRiskAmount?: number
): TimeNode[] {
  return [...nodes].sort((a, b) => {
    if (a.type !== 'trade' || b.type !== 'trade') return 0;

    const maxRA = calculateTradeMaxR(a.trade, defaultRiskAmount) ?? null;
    const maxRB = calculateTradeMaxR(b.trade, defaultRiskAmount) ?? null;

    if (maxRA === null && maxRB === null) return 0;
    if (maxRA === null) return 1;
    if (maxRB === null) return -1;

    return direction === 'asc' ? maxRA - maxRB : maxRB - maxRA;
  });
}

function sortByPriceMove(
  nodes: TimeNode[],
  direction: SortDirection
): TimeNode[] {
  return [...nodes].sort((a, b) => {
    if (a.type !== 'trade' || b.type !== 'trade') return 0;

    const priceMoveA = calculateTradePriceMove(a.trade) ?? null;
    const priceMoveB = calculateTradePriceMove(b.trade) ?? null;

    return compareValues(priceMoveA, priceMoveB, direction);
  });
}

function sortByReturnPercent(
  nodes: TimeNode[],
  direction: SortDirection
): TimeNode[] {
  return [...nodes].sort((a, b) => {
    if (a.type !== 'trade' || b.type !== 'trade') return 0;

    const returnA = calculateTradeReturnPercent(a.trade) ?? null;
    const returnB = calculateTradeReturnPercent(b.trade) ?? null;

    if (returnA === null && returnB === null) return 0;
    if (returnA === null) return 1;
    if (returnB === null) return -1;

    return direction === 'asc' ? returnA - returnB : returnB - returnA;
  });
}


function sortByMae(nodes: TimeNode[], direction: SortDirection): TimeNode[] {
  return [...nodes].sort((a, b) => {
    if (a.type !== 'trade' || b.type !== 'trade') return 0;

    const maeA = getTradeMaeValue(a.trade) ?? null;
    const maeB = getTradeMaeValue(b.trade) ?? null;

    if (maeA === null && maeB === null) return 0;
    if (maeA === null) return 1;
    if (maeB === null) return -1;

    return direction === 'asc' ? maeA - maeB : maeB - maeA;
  });
}

function sortByMfe(nodes: TimeNode[], direction: SortDirection): TimeNode[] {
  return [...nodes].sort((a, b) => {
    if (a.type !== 'trade' || b.type !== 'trade') return 0;

    const mfeA = getTradeMfeValue(a.trade) ?? null;
    const mfeB = getTradeMfeValue(b.trade) ?? null;

    if (mfeA === null && mfeB === null) return 0;
    if (mfeA === null) return 1;
    if (mfeB === null) return -1;

    return direction === 'asc' ? mfeA - mfeB : mfeB - mfeA;
  });
}

function sortByMaePrice(
  nodes: TimeNode[],
  direction: SortDirection
): TimeNode[] {
  return [...nodes].sort((a, b) => {
    if (a.type !== 'trade' || b.type !== 'trade') return 0;

    const priceA = a.trade?.maePrice;
    const priceB = b.trade?.maePrice;

    if (priceA === undefined && priceB === undefined) return 0;
    if (priceA === undefined) return 1;
    if (priceB === undefined) return -1;

    return direction === 'asc' ? priceA - priceB : priceB - priceA;
  });
}

function sortByMfePrice(
  nodes: TimeNode[],
  direction: SortDirection
): TimeNode[] {
  return [...nodes].sort((a, b) => {
    if (a.type !== 'trade' || b.type !== 'trade') return 0;

    const priceA = a.trade?.mfePrice;
    const priceB = b.trade?.mfePrice;

    if (priceA === undefined && priceB === undefined) return 0;
    if (priceA === undefined) return 1;
    if (priceB === undefined) return -1;

    return direction === 'asc' ? priceA - priceB : priceB - priceA;
  });
}

type MaeMfePercentTrade = {
  entries?: Array<{
    price?: number | string | null;
    size?: number | string | null;
  }>;
  entryPrice?: number | string | null;
  positionSize?: number | string | null;
  direction?: string;
  assetType?: string;
  mae?: number | string | null;
  mfe?: number | string | null;
  maePrice?: number | string | null;
  mfePrice?: number | string | null;
};

function parseFiniteSortNumber(value: unknown): number | null {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  const parsed = typeof value === 'number' ? value : Number(String(value));
  return Number.isFinite(parsed) ? parsed : null;
}

function getMaeMfePercent(
  trade: Record<string, unknown> | undefined,
  valueField: 'mae' | 'mfe',
  priceField: 'maePrice' | 'mfePrice'
): number | null {
  const metricTrade = trade as MaeMfePercentTrade | undefined;
  if (!metricTrade) {
    return null;
  }

  const entryPrice = getWeightedAverageEntryPrice(metricTrade);
  if (entryPrice === null || entryPrice === 0) {
    return null;
  }

  const metricPrice = parseFiniteSortNumber(metricTrade[priceField]);
  if (metricPrice !== null) {
    const priceDiff = calculateDirectionalPriceDiff(
      {
        assetType: metricTrade.assetType,
        direction: getMaeMfeSortDirection(metricTrade.direction),
      },
      entryPrice,
      metricPrice
    );

    if (priceDiff !== null) {
      const percent = (priceDiff / entryPrice) * 100;
      return Number.isFinite(percent) ? percent : null;
    }
  }

  const metricValue = parseFiniteSortNumber(metricTrade[valueField]);
  const positionSize = getTotalEntrySize(metricTrade);
  if (metricValue === null || positionSize === null || positionSize === 0) {
    return null;
  }

  const percent = (metricValue / (entryPrice * positionSize)) * 100;
  return Number.isFinite(percent) ? percent : null;
}

function getMaeMfeSortDirection(direction: unknown): string {
  const normalizedDirection = String(direction || '').toLowerCase();
  return normalizedDirection === 'short' || normalizedDirection === 'sell'
    ? normalizedDirection
    : 'long';
}

function sortByMaeMfePercent(
  nodes: TimeNode[],
  direction: SortDirection,
  valueField: 'mae' | 'mfe',
  priceField: 'maePrice' | 'mfePrice'
): TimeNode[] {
  const percentByNode = new Map<TimeNode, number | null>();
  for (const node of nodes) {
    percentByNode.set(
      node,
      node.type === 'trade'
        ? getMaeMfePercent(node.trade, valueField, priceField)
        : null
    );
  }

  return [...nodes].sort((a, b) => {
    if (a.type !== 'trade' || b.type !== 'trade') return 0;

    const percentA = percentByNode.get(a) ?? null;
    const percentB = percentByNode.get(b) ?? null;

    return compareValues(percentA, percentB, direction);
  });
}

function sortByMaePercent(
  nodes: TimeNode[],
  direction: SortDirection
): TimeNode[] {
  return sortByMaeMfePercent(nodes, direction, 'mae', 'maePrice');
}

function sortByMfePercent(
  nodes: TimeNode[],
  direction: SortDirection
): TimeNode[] {
  return sortByMaeMfePercent(nodes, direction, 'mfe', 'mfePrice');
}


export function applySorting(
  nodes: TimeNode[],
  sortConfig: SortConfig,
  defaultRiskAmount?: number,
  allColumns: ColumnDefinition[] = []
): TimeNode[] {
  if (!sortConfig.column) return nodes;

  const matchedColumn = allColumns.find(
    (column) => column.id === sortConfig.column
  );
  if (matchedColumn?.customField) {
    return matchedColumn.sortable
      ? sortByCustomField(nodes, sortConfig.direction, matchedColumn)
      : nodes;
  }

  switch (sortConfig.column) {
    case 'pnl':
      return sortByPnL(nodes, sortConfig.direction);
    case 'date':
      return sortByDate(nodes, sortConfig.direction);
    case 'positionSize':
      return sortByPositionSize(nodes, sortConfig.direction);
    case 'dividends':
      return sortByDividends(nodes, sortConfig.direction);
    case 'duration':
      return sortByDuration(nodes, sortConfig.direction);
    case 'exitDate':
      return sortByExitDate(nodes, sortConfig.direction);
    case 'rMultiple':
      return sortByRMultiple(nodes, sortConfig.direction, defaultRiskAmount);
    case 'maxR':
      return sortByMaxR(nodes, sortConfig.direction, defaultRiskAmount);
    case 'mae':
      return sortByMae(nodes, sortConfig.direction);
    case 'mfe':
      return sortByMfe(nodes, sortConfig.direction);
    case 'maePrice':
      return sortByMaePrice(nodes, sortConfig.direction);
    case 'mfePrice':
      return sortByMfePrice(nodes, sortConfig.direction);
    case 'maePercent':
      return sortByMaePercent(nodes, sortConfig.direction);
    case 'mfePercent':
      return sortByMfePercent(nodes, sortConfig.direction);
    case 'returnPercent':
      return sortByReturnPercent(nodes, sortConfig.direction);
    case 'priceMove':
      return sortByPriceMove(nodes, sortConfig.direction);
    case 'expirationDate':
      return [...nodes].sort((a, b) => {
        if (a.type !== 'trade' || b.type !== 'trade') return 0;

        const dateA = a.trade?.expirationDate as string | undefined;
        const dateB = b.trade?.expirationDate as string | undefined;

        if (!dateA && !dateB) return 0;
        if (!dateA) return 1;
        if (!dateB) return -1;

        const timeA = new Date(dateA).getTime();
        const timeB = new Date(dateB).getTime();
        const comparison = timeA - timeB;

        return sortConfig.direction === 'asc' ? comparison : -comparison;
      });
    case 'daysToExpiry':
      return [...nodes].sort((a, b) => {
        if (a.type !== 'trade' || b.type !== 'trade') return 0;

        const expiryA = a.trade?.expirationDate as string | undefined;
        const expiryB = b.trade?.expirationDate as string | undefined;

        const dteA = expiryA ? getDaysToExpiry(expiryA) : null;
        const dteB = expiryB ? getDaysToExpiry(expiryB) : null;

        if (dteA === null && dteB === null) return 0;
        if (dteA === null) return 1;
        if (dteB === null) return -1;

        const comparison = dteA - dteB;
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      });
    default:
      return nodes;
  }
}
