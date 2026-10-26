import { isRecord } from './configurationPrimitives';
import {
  assembleRewrittenNote,
  assertRewrittenFrontmatter,
  cloneRewriteValue,
  failNoteRewrite,
  isUnknownArray,
  rewriteFrontmatterSequence,
  type ParsedNote,
} from './noteRewriteCore';

export type EventRewriteNoteCategory = 'weekly';

export const EVENT_REWRITE_OWNED_KEYS = ['keyEvents'] as const;

const EVENT_OCCURRENCE_COLORS = new Set(['gray', 'red', 'orange', 'yellow']);

interface CanonicalEventOccurrence {
  readonly event: string;
  readonly notes: string;
  readonly color?: string;
  readonly day?: string;
  readonly [key: string]: unknown;
}

export function eventIdentitiesMatch(left: string, right: string): boolean {
  return left.trim().toLowerCase() === right.trim().toLowerCase();
}

function isCanonicalEventOccurrence(
  value: unknown
): value is CanonicalEventOccurrence {
  if (!isRecord(value)) return false;
  if (typeof value.event !== 'string' || typeof value.notes !== 'string') {
    return false;
  }
  if (
    value.color !== undefined &&
    (typeof value.color !== 'string' ||
      !EVENT_OCCURRENCE_COLORS.has(value.color))
  ) {
    return false;
  }
  if (value.day !== undefined && typeof value.day !== 'string') return false;
  return true;
}

function occurrenceEventName(value: unknown): string | undefined {
  if (typeof value === 'string') return value;
  if (isRecord(value) && typeof value.event === 'string') return value.event;
  return undefined;
}

export function inspectEventKeyEvents(input: {
  frontmatter: Record<string, unknown>;
  source: string;
  target: string | undefined;
}): { items: unknown[] } | undefined {
  if (!Object.prototype.hasOwnProperty.call(input.frontmatter, 'keyEvents')) {
    return undefined;
  }
  const keyEvents = input.frontmatter.keyEvents;
  if (!isUnknownArray(keyEvents)) failNoteRewrite('conflict');
  const items: unknown[] = [];
  let matched = false;
  for (let index = 0; index < keyEvents.length; index += 1) {
    const entry = keyEvents[index];
    const name = occurrenceEventName(entry);
    const matches =
      name !== undefined && eventIdentitiesMatch(name, input.source);
    if (!matches) {
      items.push(cloneRewriteValue(entry));
      continue;
    }
    if (!isCanonicalEventOccurrence(entry)) failNoteRewrite('conflict');
    matched = true;
    if (input.target === undefined) {
      items.push(cloneRewriteValue(entry));
      continue;
    }
    const next: Record<string, unknown> = cloneRewriteValue(entry);
    if (!isRecord(next)) failNoteRewrite('conflict');
    next.event = input.target;
    items.push(next);
  }
  if (!matched) return undefined;
  return { items };
}

export function isWeeklyReviewNote(
  frontmatter: Record<string, unknown>
): boolean {
  return frontmatter.type === 'weekly-review';
}

export function rewriteEventNote(input: {
  content: string;
  parsed: ParsedNote;
  items: unknown[];
}): string {
  const yaml = rewriteFrontmatterSequence({
    yaml: input.parsed.yaml,
    newline: input.parsed.newline,
    frontmatter: input.parsed.frontmatter,
    key: 'keyEvents',
    items: input.items,
  });
  const expected = cloneRewriteValue(input.parsed.frontmatter);
  expected.keyEvents = cloneRewriteValue(input.items);
  assertRewrittenFrontmatter(yaml, expected);
  return assembleRewrittenNote({
    content: input.content,
    parsed: input.parsed,
    yaml,
  });
}
