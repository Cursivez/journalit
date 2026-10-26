import {
  classifyTagOptionTradeKind,
  isSetupDefinitionNote,
} from '../../../utils/tagOptionNoteEligibility';
import {
  storedTagDedupeKey,
  storedTagValuesMatch,
} from '../../../utils/tradeTagNormalization';
import { rewriteImageAnnotationTags } from '../../../utils/imageAnnotations';
import type { ReviewNoteType } from '../../imageGallery/ImageGalleryInternal';
import {
  cloneRewriteValue,
  failNoteRewrite,
  probeStringFieldContains,
  readStringListField,
  type ParsedNote,
} from './noteRewriteCore';
import {
  DAY_TRADE_FIELD_REWRITE_OWNED_KEYS,
  dayTradeFieldWrites,
  hasDayTradeFieldWrites,
  rewriteNoteWithDayTradeFields,
  stringEntries,
} from './dayTradeFieldNoteRewrite';

export type TagRewriteNoteCategory =
  | 'trade'
  | 'missed_trade'
  | 'backtest_trade'
  | 'setup'
  
  | 'drc'
  
  | 'weekly_review'
  | 'monthly_review'
  | 'quarterly_review'
  | 'yearly_review'
  
  | 'note';

export const IMAGE_ANNOTATIONS_KEY = 'imageAnnotations';

export const TAG_REWRITE_OWNED_KEYS = [
  'tags',
  IMAGE_ANNOTATIONS_KEY,
  ...DAY_TRADE_FIELD_REWRITE_OWNED_KEYS,
] as const;


export const PERIODIC_REVIEW_CATEGORIES = [
  ['weekly-review', 'weekly_review'],
  ['monthly-review', 'monthly_review'],
  ['quarterly-review', 'quarterly_review'],
  ['yearly-review', 'yearly_review'],
] as const satisfies ReadonlyArray<
  readonly [ReviewNoteType, TagRewriteNoteCategory]
>;

const CATEGORY_BY_REVIEW_TYPE = new Map<unknown, TagRewriteNoteCategory>(
  PERIODIC_REVIEW_CATEGORIES
);


export function isAnnotationOnlyTagCategory(
  category: TagRewriteNoteCategory
): boolean {
  return (
    category === 'note' ||
    category === 'weekly_review' ||
    category === 'monthly_review' ||
    category === 'quarterly_review' ||
    category === 'yearly_review'
  );
}

function classifyTagNote(
  frontmatter: Record<string, unknown>,
  filePath: string
): TagRewriteNoteCategory | 'ambiguous' {
  const setup = isSetupDefinitionNote(frontmatter);
  const tradeKind = classifyTagOptionTradeKind(frontmatter, filePath);
  if (setup && tradeKind !== undefined) return 'ambiguous';
  if (setup) return 'setup';
  if (tradeKind !== undefined) return tradeKind;
  if (frontmatter.type === 'drc') return 'drc';
  return CATEGORY_BY_REVIEW_TYPE.get(frontmatter.type) ?? 'note';
}

function canonicalizeTags(input: {
  tags: readonly string[];
  source: string;
  target: string | undefined;
}): string[] {
  const next: string[] = [];
  const seen = new Set<string>();
  const entries = input.tags;
  for (let index = 0; index < entries.length; index += 1) {
    const entry = entries[index];
    const matchesSource = storedTagValuesMatch(entry, input.source);
    const trimmed = entry.trim();
    if (!matchesSource && trimmed.length === 0) continue;
    const rewritten = matchesSource ? input.target : trimmed;
    if (rewritten === undefined) continue;
    const key = storedTagDedupeKey(rewritten);
    if (seen.has(key)) continue;
    seen.add(key);
    next.push(rewritten);
  }
  return next;
}

function expectedRewrittenFrontmatter(
  frontmatter: Record<string, unknown>,
  nextTags: readonly string[]
): Record<string, unknown> {
  const expected = cloneRewriteValue(frontmatter);
  const tags: string[] = [];
  for (let index = 0; index < nextTags.length; index += 1) {
    tags.push(nextTags[index]);
  }
  expected.tags = tags;
  return expected;
}

export function rewriteTagNote(input: {
  path: string;
  content: string;
  parsed: ParsedNote;
  source: string;
  target: string | undefined;
  
  galleryAnnotationNotePath: string;
}): { category: TagRewriteNoteCategory; resultingContent: string } | undefined {
  const { frontmatter } = input.parsed;
  const category = classifyTagNote(frontmatter, input.path);
  const annotations = rewriteImageAnnotationTags(
    frontmatter[IMAGE_ANNOTATIONS_KEY],
    {
      source: input.source,
      target: input.target,
      emptied:
        input.path === input.galleryAnnotationNotePath ? 'remove' : 'tombstone',
    }
  );
  const containsSource =
    (category === 'trade' ||
      category === 'missed_trade' ||
      category === 'backtest_trade' ||
      category === 'setup' ||
      category === 'ambiguous') &&
    probeStringFieldContains(frontmatter.tags, (entry) =>
      storedTagValuesMatch(entry, input.source)
    );
  if (category === 'ambiguous') {
    if (containsSource || annotations.changed) failNoteRewrite('conflict');
    return undefined;
  }
  const valueWrites = annotations.changed
    ? [{ key: IMAGE_ANNOTATIONS_KEY, value: annotations.value ?? null }]
    : [];
  if (isAnnotationOnlyTagCategory(category)) {
    if (!annotations.changed) return undefined;
    return {
      category,
      resultingContent: rewriteNoteWithDayTradeFields({
        content: input.content,
        parsed: input.parsed,
        listOwnedKeys: [],
        listWrites: [],
        dayWrites: {},
        valueWrites,
        expected: cloneRewriteValue(frontmatter),
      }),
    };
  }
  if (
    containsSource &&
    category === 'setup' &&
    frontmatter.tags !== undefined &&
    (!Array.isArray(frontmatter.tags) ||
      frontmatter.tags.some((tag) => typeof tag !== 'string'))
  ) {
    failNoteRewrite('conflict');
  }
  const nextTags = containsSource
    ? canonicalizeTags({
        tags: readStringListField(frontmatter.tags),
        source: input.source,
        target: input.target,
      })
    : undefined;
  
  const dayWrites =
    category === 'setup'
      ? {}
      : dayTradeFieldWrites({
          frontmatter,
          rewrite: {
            field: 'tags',
            matches: (entry) => storedTagValuesMatch(entry, input.source),
            rewrite: (values) =>
              canonicalizeTags({
                tags: values,
                source: input.source,
                target: input.target,
              }),
          },
          resultingFieldValues:
            category === 'drc'
              ? undefined
              : (nextTags ?? stringEntries(frontmatter.tags)),
          dedupeKey: storedTagDedupeKey,
        });
  if (nextTags === undefined) {
    if (!hasDayTradeFieldWrites(dayWrites) && !annotations.changed) {
      return undefined;
    }
    return {
      category,
      resultingContent: rewriteNoteWithDayTradeFields({
        content: input.content,
        parsed: input.parsed,
        listOwnedKeys: [],
        listWrites: [],
        dayWrites,
        valueWrites,
        expected: cloneRewriteValue(frontmatter),
      }),
    };
  }
  return {
    category,
    resultingContent: rewriteNoteWithDayTradeFields({
      content: input.content,
      parsed: input.parsed,
      listOwnedKeys: ['tags'],
      listWrites: [{ op: 'set', key: 'tags', values: nextTags }],
      dayWrites,
      valueWrites,
      expected: expectedRewrittenFrontmatter(frontmatter, nextTags),
    }),
  };
}
