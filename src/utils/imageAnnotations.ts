import type {
  ImageAnnotation,
  ImageAnnotations,
} from '../types/imageAnnotations';
import {
  storedTagDedupeKey,
  storedTagValuesMatch,
} from './tradeTagNormalization';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function normalizeTags(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  const seen = new Set<string>();
  const tags: string[] = [];
  for (const entry of value) {
    if (typeof entry !== 'string') continue;
    const tag = entry.trim();
    const key = tag.toLowerCase();
    if (!tag || seen.has(key)) continue;
    seen.add(key);
    tags.push(tag);
  }

  return tags;
}

export function normalizeImageAnnotation(
  annotation: ImageAnnotation
): ImageAnnotation {
  const notes = annotation.notes?.trim();
  return {
    tags: normalizeTags(annotation.tags),
    ...(notes ? { notes } : {}),
  };
}

export function parseImageAnnotations(
  value: unknown
): ImageAnnotations | undefined {
  if (!isRecord(value)) return undefined;

  const annotations: ImageAnnotations = {};
  for (const [imagePath, rawAnnotation] of Object.entries(value)) {
    if (!imagePath.trim() || !isRecord(rawAnnotation)) continue;
    annotations[imagePath] = normalizeImageAnnotation({
      tags: normalizeTags(rawAnnotation.tags),
      notes:
        typeof rawAnnotation.notes === 'string'
          ? rawAnnotation.notes
          : undefined,
    });
  }

  return annotations;
}

export function serializeImageAnnotation(
  annotation: ImageAnnotation
): Record<string, unknown> {
  const normalized = normalizeImageAnnotation(annotation);
  const persisted: Record<string, unknown> = {};

  if (normalized.tags.length > 0) persisted.tags = normalized.tags;
  if (normalized.notes) persisted.notes = normalized.notes;

  return persisted;
}

export function serializeImageAnnotations(
  annotations: ImageAnnotations
): Record<string, Record<string, unknown>> {
  const persisted: Record<string, Record<string, unknown>> = {};
  const entries = Object.entries(annotations).sort(([left], [right]) =>
    left.localeCompare(right)
  );
  for (const [imagePath, annotation] of entries) {
    
    
    persisted[imagePath] = serializeImageAnnotation(annotation);
  }
  return persisted;
}

export function serializeImageAnnotationsForFrontmatter(
  annotations: ImageAnnotations | undefined
): Record<string, Record<string, unknown>> | undefined {
  if (annotations === undefined) return undefined;

  const persisted = serializeImageAnnotations(annotations);
  return Object.keys(persisted).length > 0 ? persisted : undefined;
}

export function hasVisibleImageAnnotation(
  annotation: ImageAnnotation | undefined
): boolean {
  if (!annotation) return false;
  const normalized = normalizeImageAnnotation(annotation);
  return normalized.tags.length > 0 || normalized.notes !== undefined;
}
export function rekeyImageAnnotations(
  annotations: ImageAnnotations | undefined,
  pathMap: ReadonlyMap<string, string>
): ImageAnnotations | undefined {
  if (!annotations) return undefined;

  const rekeyed: ImageAnnotations = {};
  for (const [imagePath, annotation] of Object.entries(annotations)) {
    rekeyed[pathMap.get(imagePath) ?? imagePath] = annotation;
  }
  return rekeyed;
}


export type EmptiedImageAnnotation = 'tombstone' | 'remove';


export function rewriteImageAnnotationTags(
  annotations: unknown,
  change: {
    source: string;
    target: string | undefined;
    emptied: EmptiedImageAnnotation;
  }
):
  | { changed: false }
  | { changed: true; value: Record<string, unknown> | undefined } {
  if (!isRecord(annotations)) return { changed: false };
  let changed = false;
  const rewritten: Record<string, unknown> = {};
  for (const [imagePath, entry] of Object.entries(annotations)) {
    const tags = isRecord(entry) ? entry.tags : undefined;
    if (
      !isRecord(entry) ||
      !Array.isArray(tags) ||
      !tags.some(
        (tag) =>
          typeof tag === 'string' && storedTagValuesMatch(tag, change.source)
      )
    ) {
      rewritten[imagePath] = entry;
      continue;
    }
    changed = true;
    const seen = new Set<string>();
    const nextTags: string[] = [];
    for (const tag of tags) {
      if (typeof tag !== 'string') continue;
      const next = storedTagValuesMatch(tag, change.source)
        ? change.target
        : tag;
      if (next === undefined) continue;
      const key = storedTagDedupeKey(next);
      if (seen.has(key)) continue;
      seen.add(key);
      nextTags.push(next);
    }
    const next: Record<string, unknown> = { ...entry };
    if (nextTags.length > 0) next.tags = nextTags;
    else delete next.tags;
    const emptied =
      Object.keys(next).length === 0 ||
      (Object.keys(next).length === 1 &&
        typeof next.notes === 'string' &&
        next.notes.trim() === '');
    if (emptied && change.emptied === 'remove') continue;
    rewritten[imagePath] = emptied ? {} : next;
  }
  if (!changed) return { changed: false };
  return {
    changed: true,
    value: Object.keys(rewritten).length > 0 ? rewritten : undefined,
  };
}
