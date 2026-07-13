import type {
  ImageGalleryAnnotation,
  ImageGalleryOutcome,
} from '../../components/imageGallery/types';
import type { TradeStatus } from '../tradelog/types';

export const REVIEW_TYPE_TO_SOURCE: Record<
  ReviewNoteType,
  ImageGallerySourceType
> = {
  drc: 'drc',
  'weekly-review': 'weekly',
  'monthly-review': 'monthly',
  'quarterly-review': 'quarterly',
  'yearly-review': 'yearly',
};

export type ReviewNoteType =
  | 'drc'
  | 'weekly-review'
  | 'monthly-review'
  | 'quarterly-review'
  | 'yearly-review';
export type ImageGallerySourceType =
  | 'trade'
  | 'drc'
  | 'weekly'
  | 'monthly'
  | 'quarterly'
  | 'yearly';

export const IMAGE_GALLERY_INDEX_VERSION = 6;
export const IMAGE_GALLERY_INDEX_TTL_MS = 60 * 60 * 1000;
export const REVIEW_METADATA_READY_TIMEOUT_MS = 5000;
export const SELECTABLE_TRADE_STATUSES: TradeStatus[] = [
  'open',
  'win',
  'loss',
  'breakeven',
];

export const SOURCE_TO_REVIEW_TYPE: Partial<
  Record<
    ImageGallerySourceType,
    'drc' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'
  >
> = {
  drc: 'drc',
  weekly: 'weekly',
  monthly: 'monthly',
  quarterly: 'quarterly',
  yearly: 'yearly',
};

export interface PersistedImageGalleryIndex {
  version: number;
  timestamp: number;
  settingsFingerprint: string;
  items: import('../../components/imageGallery/types').ImageGalleryItem[];
}

export interface TradeRecord {
  [key: string]: unknown;
  path?: unknown;
  filePath?: unknown;
  instrument?: unknown;
  setup?: unknown;
  tags?: unknown;
  images?: unknown;
  imageAnnotations?: unknown;
  entryTime?: unknown;
  exitTime?: unknown;
  exitPrice?: unknown;
  entries?: unknown;
  exits?: unknown;
  date?: unknown;
  pnl?: unknown;
  directPnL?: unknown;
  dividends?: unknown;
  commission?: unknown;
  swap?: unknown;
  fees?: unknown;
  rebate?: unknown;
  useDirectPnLInput?: unknown;
  tradeStatus?: unknown;
  breakEvenAccountCurrentBalance?: unknown;
  breakEvenAccountCurrentBalanceTotal?: unknown;
  reviewed?: unknown;
  rMultiple?: unknown;
  riskAmount?: unknown;
  account?: unknown;
  assetType?: unknown;
  customFields?: unknown;
  direction?: unknown;
  optionType?: unknown;
  mistakes?: unknown;
  tradeType?: unknown;
  isMissedTrade?: unknown;
  type?: unknown;
  _originalPnlWasNull?: unknown;
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

export function asRecordArray(value: unknown): Array<Record<string, unknown>> {
  return Array.isArray(value)
    ? value.filter((item): item is Record<string, unknown> => isRecord(item))
    : [];
}

export function getString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

export function getDateString(value: unknown): string | undefined {
  if (typeof value === 'string') return value;
  if (value instanceof Date) return value.toISOString();
  return undefined;
}

export function getStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string');
  }
  return typeof value === 'string' && value.length > 0 ? [value] : [];
}

export function getOptionalNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim().length > 0) {
    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? numericValue : undefined;
  }
  return undefined;
}

export function getTradeExecutions(value: unknown):
  | Array<{
      time?: Date | string | null;
      price?: number | null;
      size?: number | null;
    }>
  | undefined {
  if (!Array.isArray(value)) return undefined;

  return value.flatMap((execution) => {
    if (!isRecord(execution)) return [];

    return [
      {
        time:
          execution.time instanceof Date || typeof execution.time === 'string'
            ? execution.time
            : null,
        price: getOptionalNumber(execution.price) ?? null,
        size: getOptionalNumber(execution.size) ?? null,
      },
    ];
  });
}

export function isReviewNoteType(
  value: string | undefined
): value is ReviewNoteType {
  return value !== undefined && value in REVIEW_TYPE_TO_SOURCE;
}

export function normalizeImagePath(path: string): string {
  let trimmed = path.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    trimmed = trimmed.slice(1, -1).trim();
  }

  const wikilinkMatch = trimmed.match(/^!?(?:\[\[)([^\]]+)(?:\]\])$/);
  if (wikilinkMatch) {
    return wikilinkMatch[1].split('|')[0].trim();
  }

  return trimmed;
}

function normalizeAnnotation(value: unknown): ImageGalleryAnnotation {
  const record = isRecord(value) ? value : {};

  return {
    tags: getStringArray(record.tags),
    notes: getString(record.notes),
  };
}

export function getAnnotation(
  annotations: unknown,
  imagePath: string
): ImageGalleryAnnotation {
  if (!isRecord(annotations)) {
    return { tags: [] };
  }

  return normalizeAnnotation(annotations[imagePath]);
}

export function getDateValue(record: {
  date?: unknown;
  entryTime?: unknown;
  exitTime?: unknown;
}): string {
  return (
    getDateString(record.exitTime) ||
    getDateString(record.entryTime) ||
    getDateString(record.date) ||
    ''
  );
}

export function getTradeDateValue(record: {
  date?: unknown;
  entryTime?: unknown;
  exitTime?: unknown;
}): string {
  return (
    getDateString(record.entryTime) ||
    getDateString(record.date) ||
    getDateString(record.exitTime) ||
    ''
  );
}

export function isImageGalleryOutcome(
  value: unknown
): value is ImageGalleryOutcome {
  return (
    value === 'winner' ||
    value === 'loser' ||
    value === 'breakeven' ||
    value === 'unknown'
  );
}

export function isImageGallerySourceType(
  value: unknown
): value is ImageGallerySourceType {
  return (
    value === 'trade' ||
    value === 'drc' ||
    value === 'weekly' ||
    value === 'monthly' ||
    value === 'quarterly' ||
    value === 'yearly'
  );
}

export function dedupeStrings(values: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of values) {
    const trimmed = value.trim();
    const key = trimmed.toLowerCase();
    if (!trimmed || seen.has(key)) continue;
    seen.add(key);
    result.push(trimmed);
  }
  return result;
}
