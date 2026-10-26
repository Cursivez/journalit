import {
  deduplicateOptions,
  normalizeOptionKey,
  normalizedEquals,
} from './stringNormalization';
import { TAG_BUCKETS } from './tagSchema';

const RESERVED_TAG_BUCKETS = new Set<string>(Object.values(TAG_BUCKETS));


export function normalizeTradeTagList(values: readonly string[]): string[] {
  const normalized: string[] = [];
  const seen = new Set<string>();

  for (const rawValue of values) {
    const cleaned = rawValue.trim().replace(/^['"`]+|['"`]+$/g, '');
    if (!cleaned) continue;

    const dedupeKey = cleaned.toLowerCase();
    if (seen.has(dedupeKey)) continue;

    seen.add(dedupeKey);
    normalized.push(cleaned);
  }

  return normalized;
}

function cleanTagValue(value: string): string {
  let cleaned = value.trim();
  while (cleaned.startsWith('"') || cleaned.startsWith("'")) {
    cleaned = cleaned.slice(1).trim();
  }
  while (cleaned.endsWith('"') || cleaned.endsWith("'")) {
    cleaned = cleaned.slice(0, -1).trim();
  }
  return cleaned;
}

export function isReservedTradeTagPath(value: string): boolean {
  return hasReservedTagBucketPrefix(cleanTagValue(value));
}

export type TradeSelectionField = 'setup' | 'mistake';


export function readTradeSelectionEntry(
  value: string,
  field: TradeSelectionField
): string | null {
  const cleaned = cleanTagValue(value);
  if (!isReservedTradeTagPath(cleaned)) return value.trim();
  const separatorIndex = cleaned.indexOf('/');
  if (cleaned.slice(0, separatorIndex).toLowerCase() !== field) return null;
  return cleaned.slice(separatorIndex + 1).trim() || null;
}


export function selectionOptionKey(
  value: string,
  field: TradeSelectionField
): string {
  return (readTradeSelectionEntry(value, field) ?? value.trim()).toLowerCase();
}


export function isLeakedSelectionTagPath(value: string): boolean {
  return isReservedTradeTagPath(cleanTagValue(value));
}


export function normalizeTradeSelectionForWrite(
  values: readonly string[],
  field: TradeSelectionField
): string[] {
  const normalized = new Map<string, string>();
  for (const rawValue of values) {
    const value = readTradeSelectionEntry(cleanTagValue(rawValue), field);
    if (value && !normalized.has(value.toLowerCase())) {
      normalized.set(value.toLowerCase(), value);
    }
  }
  return Array.from(normalized.values());
}


export function canonicalizeTradeTagSelection(
  previousValues: readonly string[],
  nextValues: readonly string[]
): string[] {
  const retainedReservedTags = new Set(
    previousValues.flatMap((value) => {
      const cleaned = cleanTagValue(value);
      return isReservedTradeTagPath(cleaned) ? [cleaned.toLowerCase()] : [];
    })
  );
  const canonical = new Map<string, string>();

  for (const rawValue of nextValues) {
    const cleaned = cleanTagValue(rawValue);
    if (!cleaned) continue;

    const preserveReserved =
      isReservedTradeTagPath(cleaned) &&
      retainedReservedTags.has(cleaned.toLowerCase());
    const value = preserveReserved
      ? cleaned
      : (deduplicateOptions([cleaned])[0] ?? '');
    if (!value) continue;

    const key = preserveReserved
      ? `reserved:${value.toLowerCase()}`
      : `custom:${normalizeOptionKey(value)}`;
    if (!canonical.has(key)) canonical.set(key, value);
  }

  return Array.from(canonical.values());
}

function hasReservedTagBucketPrefix(value: string): boolean {
  const pathSeparator = value.indexOf('/');
  return (
    pathSeparator > 0 &&
    RESERVED_TAG_BUCKETS.has(value.slice(0, pathSeparator).toLowerCase())
  );
}


export function storedTagValuesMatch(
  stored: string,
  identity: string
): boolean {
  return hasReservedTagBucketPrefix(stored)
    ? stored.toLowerCase() === identity.toLowerCase()
    : normalizedEquals(stored, identity);
}

export function storedTagDedupeKey(value: string): string {
  return hasReservedTagBucketPrefix(value)
    ? `reserved:${value.toLowerCase()}`
    : `custom:${normalizeOptionKey(value)}`;
}
