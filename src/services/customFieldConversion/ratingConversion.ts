

import {
  CustomFieldType,
  type CustomFieldDefinition,
} from '../../types/customFields';
import {
  isEditableJournalField,
  type TradeJournalValues,
} from '../trade/core/TradeJournalFields';
import { parseTradeRating } from '../../utils/tradeRating';


const RATING_SOURCE_TYPES: ReadonlySet<CustomFieldType> = new Set([
  CustomFieldType.NUMBER,
  CustomFieldType.DROPDOWN,
  CustomFieldType.TEXT,
]);

export const RATING_SCALE_PRESETS = [3, 5, 10, 100] as const;

export function canConvertFieldToRating(field: CustomFieldDefinition): boolean {
  return RATING_SOURCE_TYPES.has(field.type) && isEditableJournalField(field);
}


export function readSourceValueKey(value: unknown): string | null | undefined {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number') {
    return Number.isFinite(value) ? String(value) : undefined;
  }
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  if (trimmed === '') return null;
  const numeric = Number(trimmed);
  return Number.isFinite(numeric) ? String(numeric) : trimmed;
}


export function suggestRating(
  valueKey: string,
  scaleMax: number
): number | null {
  const value = Number(valueKey);
  if (!Number.isFinite(value) || value < 0 || value > scaleMax) return null;
  return Math.max(0.5, Math.round((value / scaleMax) * 10) / 2);
}


export function suggestRatingScale(
  field: CustomFieldDefinition,
  valueKeys: readonly string[]
): number | null {
  let highest = -Infinity;
  for (const valueKey of valueKeys) {
    const value = Number(valueKey);
    if (Number.isFinite(value) && value > highest) highest = value;
  }
  if (highest === -Infinity) return null;
  const fieldMax = field.validation?.max;
  if (fieldMax !== undefined && Number.isFinite(fieldMax) && fieldMax > 0) {
    return fieldMax;
  }
  return (
    [5, 10, 100].find((scale) => scale >= highest) ??
    Math.ceil(Math.max(highest, 1))
  );
}

export interface RatingConversionNote {
  path: string;
  
  value: unknown;
  
  tradeRating: unknown;
  
  readOnly: boolean;
}

type RatingConversionStatus =
  
  | 'convert'
  
  | 'converted'
  
  | 'conflict'
  
  | 'unmapped'
  | 'read-only';

export interface PlannedRatingNote {
  path: string;
  
  valueKey: string | undefined;
  status: RatingConversionStatus;
  
  rating?: number;
  
  currentRating: number | undefined;
}

export interface RatingValueSummary {
  valueKey: string;
  noteCount: number;
}


export function summarizeSourceValues(notes: readonly RatingConversionNote[]): {
  values: RatingValueSummary[];
  unreadableCount: number;
} {
  const counts = new Map<string, number>();
  let unreadableCount = 0;
  for (const note of notes) {
    const key = readSourceValueKey(note.value);
    if (key === null) continue;
    if (key === undefined) unreadableCount += 1;
    else counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  const values = [...counts.entries()].map(([valueKey, noteCount]) => ({
    valueKey,
    noteCount,
  }));
  values.sort((a, b) => {
    const an = Number(a.valueKey);
    const bn = Number(b.valueKey);
    const aNumeric = Number.isFinite(an);
    const bNumeric = Number.isFinite(bn);
    if (aNumeric && bNumeric) return an - bn;
    if (aNumeric !== bNumeric) return aNumeric ? -1 : 1;
    return a.valueKey.localeCompare(b.valueKey);
  });
  return { values, unreadableCount };
}


export type RatingValueMapping = ReadonlyMap<string, number | null>;

export function planRatingConversion(
  notes: readonly RatingConversionNote[],
  mapping: RatingValueMapping
): PlannedRatingNote[] {
  return notes.flatMap((note): PlannedRatingNote[] => {
    const key = readSourceValueKey(note.value);
    if (key === null) return [];
    const currentRating = parseTradeRating(note.tradeRating);
    const base = { path: note.path, valueKey: key, currentRating };
    if (note.readOnly) return [{ ...base, status: 'read-only' as const }];
    const rating = key === undefined ? undefined : mapping.get(key);
    if (rating === undefined || rating === null) {
      return [{ ...base, status: 'unmapped' as const }];
    }
    const status: RatingConversionStatus =
      currentRating === undefined
        ? 'convert'
        : currentRating === rating
          ? 'converted'
          : 'conflict';
    return [{ ...base, status, rating }];
  });
}

export type RatingConversionCounts = Record<RatingConversionStatus, number>;

export function countRatingConversion(
  plan: readonly PlannedRatingNote[]
): RatingConversionCounts {
  const counts: RatingConversionCounts = {
    convert: 0,
    converted: 0,
    conflict: 0,
    unmapped: 0,
    'read-only': 0,
  };
  for (const note of plan) counts[note.status] += 1;
  return counts;
}


export function isPlannedNoteUnchanged(
  current: Pick<TradeJournalValues, 'customFields' | 'tradeRating'>,
  sourceFieldId: string,
  planned: PlannedRatingNote
): boolean {
  return (
    readSourceValueKey(current.customFields[sourceFieldId]) ===
      planned.valueKey && current.tradeRating === planned.currentRating
  );
}
