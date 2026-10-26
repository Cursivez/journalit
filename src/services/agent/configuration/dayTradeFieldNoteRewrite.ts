
import {
  DAY_TRADE_FIELDS_KEY,
  applyDayTradeFieldOptionWrites,
  planDayTradeFieldOptionRewrite,
  type DayTradeFieldOptionRewrite,
  type DayTradeFieldOptionWrites,
} from '../../drc/dayTradeFields';
import { DAY_TRADE_FIELD_SOURCES_KEY } from '../../trade/core/TradeJournalFields';
import {
  assembleRewrittenNote,
  assertRewrittenFrontmatter,
  cloneRewriteValue,
  rewriteFrontmatterLists,
  type ParsedNote,
  type YamlListWrite,
} from './noteRewriteCore';
import { rewriteFrontmatterValues } from './yamlValueRewrite';

export const DAY_TRADE_FIELD_REWRITE_OWNED_KEYS = [
  DAY_TRADE_FIELDS_KEY,
  DAY_TRADE_FIELD_SOURCES_KEY,
] as const;


export function stringEntries(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  return Array.isArray(value)
    ? value.filter((entry): entry is string => typeof entry === 'string')
    : [];
}

export function hasDayTradeFieldWrites(
  writes: DayTradeFieldOptionWrites
): boolean {
  return Object.keys(writes).length > 0;
}


export function dayTradeFieldWrites(input: {
  frontmatter: Record<string, unknown>;
  rewrite: DayTradeFieldOptionRewrite;
  
  resultingFieldValues?: readonly string[];
  dedupeKey: (value: string) => string;
}): DayTradeFieldOptionWrites {
  return planDayTradeFieldOptionRewrite(
    input.frontmatter,
    input.rewrite,
    input.resultingFieldValues === undefined
      ? undefined
      : { values: input.resultingFieldValues, key: input.dedupeKey }
  );
}


export function rewriteNoteWithDayTradeFields(input: {
  content: string;
  parsed: ParsedNote;
  listOwnedKeys: readonly string[];
  listWrites: readonly YamlListWrite[];
  dayWrites: DayTradeFieldOptionWrites;
  
  valueWrites?: readonly { key: string; value: unknown }[];
  expected: Record<string, unknown>;
  forbiddenKeys?: readonly string[];
}): string {
  let yaml = input.listWrites.length
    ? rewriteFrontmatterLists({
        yaml: input.parsed.yaml,
        newline: input.parsed.newline,
        frontmatter: input.parsed.frontmatter,
        ownedKeys: input.listOwnedKeys,
        writes: input.listWrites,
      })
    : input.parsed.yaml;
  const expected = cloneRewriteValue(input.expected);
  const valueWrites = input.valueWrites ?? [];
  if (hasDayTradeFieldWrites(input.dayWrites) || valueWrites.length > 0) {
    yaml = rewriteFrontmatterValues({
      yaml,
      newline: input.parsed.newline,
      frontmatter: input.parsed.frontmatter,
      writes: [
        ...Object.entries(input.dayWrites).map(([key, value]) => ({
          key,
          value,
        })),
        ...valueWrites,
      ],
    });
    applyDayTradeFieldOptionWrites(expected, input.dayWrites);
    for (const { key, value } of valueWrites) {
      if (value === null) delete expected[key];
      else expected[key] = cloneRewriteValue(value);
    }
  }
  assertRewrittenFrontmatter(yaml, expected, input.forbiddenKeys);
  return assembleRewrittenNote({
    content: input.content,
    parsed: input.parsed,
    yaml,
  });
}
