
import type { SVGProps } from 'react';
import { t } from '../../../../lang/helpers';
import type {
  PerformanceBreakdownMetric,
  PerformanceBreakdownViewMode,
} from '../../../../settings/types';
import type { useDisplayFormatter } from '../../../../hooks/useDisplayPolicy';
import { generateNiceAxis } from '../../../../utils/chartUtils';
import type { parseCuratedCurrencyCode } from '../../../../utils/currencyConfig';
import {
  PERFORMANCE_BREAKDOWN_MAX_VISIBLE_ROWS,
  type PerformanceBreakdownRow,
} from './performanceBreakdownUtils';

export interface PerformanceBreakdownDataPoint extends PerformanceBreakdownRow {
  kind: 'data';
  displayValue: number;
}

interface PerformanceBreakdownDividerPoint {
  kind: 'divider';
  label: string;
}

export type PerformanceBreakdownChartPoint =
  | PerformanceBreakdownDataPoint
  | PerformanceBreakdownDividerPoint;

export interface PerformanceBreakdownBarShapeProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  payload?: PerformanceBreakdownChartPoint;
  stroke?: string;
  strokeWidth?: string | number;
  strokeOpacity?: string | number;
}

export interface PerformanceBreakdownCategoryTickProps {
  x?: number | string;
  y?: number | string;
  index?: number;
  payload?: { value?: string | number };
  textAnchor?: SVGProps<SVGTextElement>['textAnchor'];
  fill?: string;
  fontSize?: number | string;
  fontWeight?: number | string;
  className?: string;
}

export interface PerformanceBreakdownTooltipLike {
  active?: boolean;
  payload: ReadonlyArray<{ payload: PerformanceBreakdownDataPoint }>;
}

export type PerformanceBreakdownTooltipProps =
  PerformanceBreakdownTooltipLike & {
    currencyCode: ReturnType<typeof parseCuratedCurrencyCode>;
    selectedMetric: PerformanceBreakdownMetric;
    useRMultiples: boolean;
  };

export const METRIC_OPTIONS: PerformanceBreakdownMetric[] = ['net', 'winRate'];
export const VIEW_MODE_OPTIONS: PerformanceBreakdownViewMode[] = [
  'bestAndWorst',
  'best',
  'worst',
];

export const normalizeMetric = (
  value: string | undefined
): PerformanceBreakdownMetric => (value === 'winRate' ? 'winRate' : 'net');

export const normalizeViewMode = (
  value: string | undefined
): PerformanceBreakdownViewMode => {
  if (value === 'best' || value === 'worst') return value;
  return 'bestAndWorst';
};

export const getMetricLabel = (
  metric: PerformanceBreakdownMetric,
  useRMultiples: boolean
): string => {
  if (metric === 'winRate') {
    return t('dashboard.widgets.ticker-performance.metric.win-rate');
  }

  return useRMultiples
    ? t('dashboard.widgets.ticker-performance.metric.total-r')
    : t('dashboard.widgets.ticker-performance.metric.total-pnl');
};

export const getViewModeLabel = (
  viewMode: PerformanceBreakdownViewMode
): string => {
  switch (viewMode) {
    case 'bestAndWorst':
      return t('dashboard.widgets.ticker-performance.view.best-and-worst');
    case 'best':
      return t('dashboard.widgets.ticker-performance.view.best');
    case 'worst':
      return t('dashboard.widgets.ticker-performance.view.worst');
    default: {
      const _exhaustive: never = viewMode;
      return _exhaustive;
    }
  }
};

export const getDisplayValue = (
  row: PerformanceBreakdownRow,
  metric: PerformanceBreakdownMetric,
  useRMultiples: boolean
): number => {
  if (metric === 'winRate') return row.winRate * 100;
  return useRMultiples ? row.totalR : row.totalPnL;
};

const isWideCodePoint = (codePoint: number): boolean =>
  (codePoint >= 0x1100 && codePoint <= 0x115f) ||
  (codePoint >= 0x2329 && codePoint <= 0x232a) ||
  (codePoint >= 0x2e80 && codePoint <= 0x303e) ||
  (codePoint >= 0x3040 && codePoint <= 0xa4cf) ||
  (codePoint >= 0xa960 && codePoint <= 0xa97f) ||
  (codePoint >= 0xac00 && codePoint <= 0xd7a3) ||
  (codePoint >= 0xd7b0 && codePoint <= 0xd7ff) ||
  (codePoint >= 0xf900 && codePoint <= 0xfaff) ||
  (codePoint >= 0xfe10 && codePoint <= 0xfe19) ||
  (codePoint >= 0xfe30 && codePoint <= 0xfe6f) ||
  (codePoint >= 0xff01 && codePoint <= 0xff60) ||
  (codePoint >= 0xffe0 && codePoint <= 0xffe6) ||
  (codePoint >= 0x1b000 && codePoint <= 0x1b0ff) ||
  (codePoint >= 0x1f200 && codePoint <= 0x1f2ff) ||
  (codePoint >= 0x20000 && codePoint <= 0x3fffd);

const getLabelCharacterUnits = (label: string): number => {
  let characterUnits = 0;
  for (const character of label) {
    const codePoint = character.codePointAt(0);
    if (codePoint !== undefined) {
      characterUnits += isWideCodePoint(codePoint) ? 2 : 1;
    }
  }
  return characterUnits;
};

export const getCategoryAxisWidth = (labels: readonly string[]): number => {
  const longestLabel = Math.max(...labels.map(getLabelCharacterUnits), 0);
  return Math.max(56, Math.min(120, longestLabel * 7 + 14));
};

const MAX_CATEGORY_LABEL_UNITS = 16;

export const truncatePerformanceBreakdownLabel = (label: string): string => {
  if (getLabelCharacterUnits(label) <= MAX_CATEGORY_LABEL_UNITS) return label;

  let truncated = '';
  let usedUnits = 0;
  for (const character of label) {
    const codePoint = character.codePointAt(0);
    if (codePoint === undefined) continue;

    const characterUnits = isWideCodePoint(codePoint) ? 2 : 1;
    if (usedUnits + characterUnits + 1 > MAX_CATEGORY_LABEL_UNITS) break;
    truncated += character;
    usedUnits += characterUnits;
  }

  return `${truncated}…`;
};

export const PERFORMANCE_BREAKDOWN_DIVIDER_LABEL_HEIGHT = 18;
const DIVIDER_LABEL_HORIZONTAL_PADDING = 8;
const DIVIDER_LABEL_CHARACTER_WIDTH = 5.5;

export const getPerformanceBreakdownDividerLabelWidth = (
  label: string
): number => {
  return Math.ceil(
    getLabelCharacterUnits(label) * DIVIDER_LABEL_CHARACTER_WIDTH +
      DIVIDER_LABEL_HORIZONTAL_PADDING * 2
  );
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

const isNonNegativeInteger = (value: unknown): value is number =>
  isFiniteNumber(value) && Number.isInteger(value) && value >= 0;

const isPerformanceBreakdownDataPoint = (
  value: unknown
): value is PerformanceBreakdownDataPoint => {
  if (!isRecord(value)) return false;

  return (
    value.kind === 'data' &&
    typeof value.label === 'string' &&
    value.label.trim().length > 0 &&
    isFiniteNumber(value.totalPnL) &&
    isFiniteNumber(value.totalR) &&
    isNonNegativeInteger(value.tradeCount) &&
    isNonNegativeInteger(value.rTradeCount) &&
    isNonNegativeInteger(value.wins) &&
    isNonNegativeInteger(value.losses) &&
    isFiniteNumber(value.winRate) &&
    value.winRate >= 0 &&
    value.winRate <= 1 &&
    isFiniteNumber(value.displayValue)
  );
};

export const isPerformanceBreakdownTooltipContent = (
  value: unknown
): value is PerformanceBreakdownTooltipLike => {
  if (!isRecord(value) || !Array.isArray(value.payload)) return false;

  return (
    value.payload.length > 0 &&
    value.payload.every(
      (entry) =>
        isRecord(entry) && isPerformanceBreakdownDataPoint(entry.payload)
    )
  );
};

export const formatPerformanceBreakdownMetricValue = (
  data: PerformanceBreakdownDataPoint,
  selectedMetric: PerformanceBreakdownMetric,
  useRMultiples: boolean,
  currencyCode: ReturnType<typeof parseCuratedCurrencyCode>,
  formatValue: ReturnType<typeof useDisplayFormatter>['formatValue']
): string => {
  if (selectedMetric === 'winRate') {
    return formatValue({
      kind: 'returnPercent',
      value: data.winRate * 100,
      signed: false,
      precision: 1,
    });
  }

  return useRMultiples
    ? formatValue({ kind: 'rMultiple', value: data.totalR, precision: 1 })
    : formatValue({ kind: 'pnl', value: data.totalPnL, currencyCode });
};

export const createMaskedChartData = (
  maskedLabel: string
): PerformanceBreakdownDataPoint[] =>
  Array.from({ length: PERFORMANCE_BREAKDOWN_MAX_VISIBLE_ROWS }, () => ({
    kind: 'data',
    label: maskedLabel,
    totalPnL: 0,
    totalR: 0,
    tradeCount: 0,
    rTradeCount: 0,
    wins: 0,
    losses: 0,
    winRate: 0,
    displayValue: 1,
  }));

export const insertDividerPoint = (
  chartData: readonly PerformanceBreakdownDataPoint[],
  dividerIndex: number,
  dividerLabel: string
): PerformanceBreakdownChartPoint[] => [
  ...chartData.slice(0, dividerIndex),
  { kind: 'divider', label: dividerLabel },
  ...chartData.slice(dividerIndex),
];

export const getAxisConfig = (
  chartData: readonly PerformanceBreakdownDataPoint[],
  selectedMetric: PerformanceBreakdownMetric
) => {
  if (selectedMetric === 'winRate') {
    const maxWinRate = Math.max(
      ...chartData.map((item) => item.displayValue),
      0
    );
    const ceiling = Math.min(
      100,
      Math.max(10, Math.ceil(maxWinRate / 10) * 10)
    );
    return generateNiceAxis(0, ceiling, 6, true, false);
  }

  const dataMin = Math.min(...chartData.map((item) => item.displayValue));
  const dataMax = Math.max(...chartData.map((item) => item.displayValue));
  return generateNiceAxis(dataMin, dataMax, 6, true, true);
};
