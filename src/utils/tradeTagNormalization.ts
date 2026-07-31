import { deduplicateOptions, normalizeOptionKey } from './stringNormalization';
import { TAG_BUCKETS } from './tagSchema';

const RESERVED_TAG_BUCKETS = new Set<string>(Object.values(TAG_BUCKETS));

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

function isReservedTagPath(value: string): boolean {
  const separatorIndex = value.indexOf('/');
  return (
    separatorIndex > 0 &&
    RESERVED_TAG_BUCKETS.has(value.slice(0, separatorIndex).toLowerCase())
  );
}

export function canonicalizeTradeTagSelection(
  previousValues: readonly string[],
  nextValues: readonly string[]
): string[] {
  const retainedReservedTags = new Set(
    previousValues.flatMap((value) => {
      const cleaned = cleanTagValue(value);
      return isReservedTagPath(cleaned) ? [cleaned.toLowerCase()] : [];
    })
  );
  const canonical = new Map<string, string>();

  for (const rawValue of nextValues) {
    const cleaned = cleanTagValue(rawValue);
    if (!cleaned) continue;

    const preserveReserved =
      isReservedTagPath(cleaned) &&
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
