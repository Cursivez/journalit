import { classifyTagOptionTradeKind } from '../../../utils/tagOptionNoteEligibility';
import { selectionOptionKey } from '../../../utils/tradeTagNormalization';
import {
  cloneRewriteValue,
  failNoteRewrite,
  probeStringFieldContains,
  readStringListField,
  type ParsedNote,
  type YamlListWrite,
} from './noteRewriteCore';
import {
  DAY_TRADE_FIELD_REWRITE_OWNED_KEYS,
  dayTradeFieldWrites,
  hasDayTradeFieldWrites,
  rewriteNoteWithDayTradeFields,
  stringEntries,
} from './dayTradeFieldNoteRewrite';

export type MistakeRewriteNoteCategory =
  | 'trade'
  | 'missed_trade'
  | 'backtest_trade'
  | 'drc';

export const MISTAKE_REWRITE_OWNED_KEYS = [
  'mistake',
  'sessionMistakes',
  ...DAY_TRADE_FIELD_REWRITE_OWNED_KEYS,
] as const;

function isDrcNote(frontmatter: Record<string, unknown>): boolean {
  return frontmatter.type === 'drc';
}

function classifyMistakeNote(
  frontmatter: Record<string, unknown>,
  filePath: string
): MistakeRewriteNoteCategory | 'ambiguous' | undefined {
  if (isDrcNote(frontmatter)) {
    if (
      frontmatter.isMissedTrade === true ||
      frontmatter.isMissedTrade === 'true' ||
      frontmatter.isBacktestTrade === true ||
      frontmatter.isBacktestTrade === 'true'
    ) {
      return 'ambiguous';
    }
    return 'drc';
  }
  return classifyTagOptionTradeKind(frontmatter, filePath);
}


function mistakeKey(value: string): string {
  return selectionOptionKey(value, 'mistake');
}


function sameMistake(entry: string, source: string): boolean {
  return mistakeKey(entry) === mistakeKey(source);
}

function canonicalizeMistakes(input: {
  values: readonly string[];
  source: string;
  target: string | undefined;
}): string[] {
  const next: string[] = [];
  const seen = new Set<string>();
  for (let index = 0; index < input.values.length; index += 1) {
    const entry = input.values[index];
    const matchesSource = sameMistake(entry, input.source);
    const trimmed = entry.trim();
    if (!matchesSource && trimmed.length === 0) continue;
    const rewritten = matchesSource ? input.target : trimmed;
    if (rewritten === undefined) continue;
    const key = mistakeKey(rewritten);
    if (key.length === 0 || seen.has(key)) continue;
    seen.add(key);
    next.push(rewritten);
  }
  return next;
}

function expectedTradeFrontmatter(
  frontmatter: Record<string, unknown>,
  nextMistakes: readonly string[]
): Record<string, unknown> {
  const expected = cloneRewriteValue(frontmatter);
  if (nextMistakes.length > 0) {
    const values: string[] = [];
    for (let index = 0; index < nextMistakes.length; index += 1) {
      values.push(nextMistakes[index]);
    }
    expected.mistake = values;
  } else {
    delete expected.mistake;
  }
  return expected;
}

function expectedDrcFrontmatter(
  frontmatter: Record<string, unknown>,
  nextMistakes: readonly string[]
): Record<string, unknown> {
  const expected = cloneRewriteValue(frontmatter);
  const values: string[] = [];
  for (let index = 0; index < nextMistakes.length; index += 1) {
    values.push(nextMistakes[index]);
  }
  expected.sessionMistakes = values;
  return expected;
}

function probeMistakeOwnedFields(
  frontmatter: Record<string, unknown>,
  source: string
): boolean {
  return (
    probeStringFieldContains(frontmatter.sessionMistakes, (entry) =>
      sameMistake(entry, source)
    ) ||
    probeStringFieldContains(frontmatter.mistake, (entry) =>
      sameMistake(entry, source)
    )
  );
}

export function rewriteMistakeNote(input: {
  path: string;
  content: string;
  parsed: ParsedNote;
  source: string;
  target: string | undefined;
}):
  | { category: MistakeRewriteNoteCategory; resultingContent: string }
  | undefined {
  const { frontmatter } = input.parsed;
  const category = classifyMistakeNote(frontmatter, input.path);
  if (category === undefined) return undefined;

  const rewriteValues = (values: readonly string[]) =>
    canonicalizeMistakes({
      values,
      source: input.source,
      target: input.target,
    });
  
  const dayRewrite = {
    field: 'mistake' as const,
    matches: (entry: string) => sameMistake(entry, input.source),
    rewrite: rewriteValues,
  };

  if (category === 'ambiguous') {
    if (
      probeMistakeOwnedFields(frontmatter, input.source) ||
      hasDayTradeFieldWrites(
        dayTradeFieldWrites({
          frontmatter,
          rewrite: dayRewrite,
          dedupeKey: mistakeKey,
        })
      )
    ) {
      failNoteRewrite('conflict');
    }
    return undefined;
  }

  const key = category === 'drc' ? 'sessionMistakes' : 'mistake';
  const containsSource = probeStringFieldContains(frontmatter[key], (entry) =>
    sameMistake(entry, input.source)
  );
  const nextMistakes = containsSource
    ? rewriteValues(readStringListField(frontmatter[key]))
    : undefined;
  const dayWrites = dayTradeFieldWrites({
    frontmatter,
    rewrite: dayRewrite,
    resultingFieldValues:
      category === 'drc'
        ? undefined
        : (nextMistakes ?? stringEntries(frontmatter[key])),
    dedupeKey: mistakeKey,
  });
  if (nextMistakes === undefined && !hasDayTradeFieldWrites(dayWrites)) {
    return undefined;
  }

  let expected = cloneRewriteValue(frontmatter);
  let listWrites: YamlListWrite[] = [];
  if (nextMistakes !== undefined) {
    if (category === 'drc') {
      expected = expectedDrcFrontmatter(frontmatter, nextMistakes);
      listWrites = [{ op: 'set', key, values: nextMistakes }];
    } else {
      expected = expectedTradeFrontmatter(frontmatter, nextMistakes);
      listWrites =
        nextMistakes.length > 0
          ? [{ op: 'set', key, values: nextMistakes }]
          : [{ op: 'remove', key }];
    }
  }
  return {
    category,
    resultingContent: rewriteNoteWithDayTradeFields({
      content: input.content,
      parsed: input.parsed,
      listOwnedKeys: [key],
      listWrites,
      dayWrites,
      expected,
    }),
  };
}
