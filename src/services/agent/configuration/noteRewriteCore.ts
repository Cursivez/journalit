import { App, parseYaml } from 'obsidian';
import { readFileContentForMutation } from '../../../utils/fileMutation';
import {
  isJournalitJournalPath,
  resolveJournalFolderPath,
} from '../../../utils/tagOptionNoteEligibility';
import { compareCodePoints, isRecord } from './configurationPrimitives';
import { OptionCatalogMutationError } from './optionCatalogMutation';
import { extractRawYamlScalars } from './rawYamlScalars';

const NOTE_REWRITE_AFFECTED_COUNT_MAX = 100_000;

interface YamlBlock {
  readonly key: string | undefined;
  readonly raw: string;
}

export interface ParsedNote {
  readonly newline: '\n' | '\r\n';
  readonly yaml: string;
  readonly body: string;
  readonly frontmatter: Record<string, unknown>;
}

interface NoteRewriteMutationDraft<Category extends string> {
  readonly path: string;
  readonly category: Category;
  readonly originalContent: string;
  readonly originalContentHash: string;
  readonly resultingContent: string;
}

export type YamlListWrite =
  | {
      readonly op: 'set';
      readonly key: string;
      readonly values: readonly string[];
    }
  | {
      readonly op: 'remove';
      readonly key: string;
    }
  | {
      readonly op: 'set_if_present';
      readonly key: string;
      readonly values: readonly string[];
    };

export function cloneRewriteValue<T>(value: T): T {
  return structuredClone(value);
}

export function deepFreezeRewriteValue<T>(value: T): T {
  if (value !== null && typeof value === 'object') {
    Object.freeze(value);
    for (const child of Object.values(value)) deepFreezeRewriteValue(child);
  }
  return value;
}

export function failNoteRewrite(
  code: 'conflict' | 'limit_exceeded' | 'internal_error'
): never {
  throw new OptionCatalogMutationError(code);
}

export function rethrowPrivacySafeNoteRewrite(error: unknown): never {
  if (error instanceof OptionCatalogMutationError) throw error;
  failNoteRewrite('internal_error');
}

function isSafeCount(value: number): boolean {
  return Number.isFinite(value) && Number.isInteger(value) && value >= 0;
}

export function assertRewriteCountLimit(
  leftCount: number,
  rightCount: number
): void {
  boundedRewriteCounts(leftCount, rightCount);
}

export function boundedRewriteCounts(
  leftCount: number,
  rightCount: number
): { readonly left: number; readonly right: number; readonly total: number } {
  if (!isSafeCount(leftCount) || !isSafeCount(rightCount)) {
    failNoteRewrite('internal_error');
  }
  const total = leftCount + rightCount;
  if (
    leftCount > NOTE_REWRITE_AFFECTED_COUNT_MAX ||
    rightCount > NOTE_REWRITE_AFFECTED_COUNT_MAX ||
    total > NOTE_REWRITE_AFFECTED_COUNT_MAX
  ) {
    failNoteRewrite('limit_exceeded');
  }
  return { left: leftCount, right: rightCount, total };
}

export async function hashNoteRewriteContent(content: string): Promise<string> {
  const bytes = new TextEncoder().encode(content);
  
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  const hex = Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, '0')
  ).join('');
  return `sha256:${hex}`;
}

export function isUnknownArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

export function probeStringFieldContains(
  value: unknown,
  matches: (entry: string) => boolean
): boolean {
  if (typeof value === 'string') return matches(value);
  if (!isUnknownArray(value)) return false;
  for (let index = 0; index < value.length; index += 1) {
    const entry = value[index];
    if (typeof entry === 'string' && matches(entry)) return true;
  }
  return false;
}

export function readStringListField(value: unknown): string[] {
  if (value === undefined || value === null) return [];
  if (typeof value === 'string') return [value];
  if (!isUnknownArray(value)) failNoteRewrite('conflict');
  const values: string[] = [];
  for (let index = 0; index < value.length; index += 1) {
    const entry = value[index];
    if (typeof entry !== 'string') failNoteRewrite('conflict');
    values.push(entry);
  }
  return values;
}

function splitNoteContent(
  content: string
): { newline: '\n' | '\r\n'; yaml: string; body: string } | undefined {
  const match = content.match(/^---(\r?\n)([\s\S]*?)\r?\n---(\r?\n|$)/);
  if (!match) return undefined;
  return {
    newline: match[1] === '\r\n' ? '\r\n' : '\n',
    yaml: match[2],
    body: content.slice(match[0].length),
  };
}

function tryParseFrontmatterMapping(
  yaml: string
): Record<string, unknown> | undefined {
  const parseUnknownYaml: (value: string) => unknown = parseYaml;
  let parsed: unknown;
  try {
    parsed = parseUnknownYaml(yaml);
  } catch {
    return undefined;
  }
  if (parsed === null || parsed === undefined) return {};
  if (!isRecord(parsed)) return undefined;
  return parsed;
}

function parseFrontmatterMapping(yaml: string): Record<string, unknown> {
  const parsed = tryParseFrontmatterMapping(yaml);
  if (parsed === undefined) failNoteRewrite('conflict');
  return parsed;
}

function rawBlockContainsSource(
  raw: string,
  matches: (token: string) => boolean
): boolean {
  const scalars = extractRawYamlScalars(raw);
  for (let index = 0; index < scalars.length; index += 1) {
    if (matches(scalars[index])) return true;
  }
  return false;
}

function collectOwnedBlockRaw(
  yaml: string,
  ownedKeys: readonly string[]
): string[] {
  const ownedKeySet = new Set(ownedKeys);
  const blocks = yamlBlocks(yaml);
  const payloads: string[] = [];
  let index = 0;
  while (index < blocks.length) {
    const block = blocks[index];
    if (block.key === undefined || !ownedKeySet.has(block.key)) {
      index += 1;
      continue;
    }
    let raw = block.raw;
    let nextIndex = index + 1;
    while (nextIndex < blocks.length) {
      const next = blocks[nextIndex];
      const trimmed = next.raw.trim();
      const isListItem = trimmed.startsWith('-');
      const isOwnedKey = next.key !== undefined && ownedKeySet.has(next.key);
      if (isOwnedKey) break;
      if (isListItem || next.key === undefined) {
        raw += next.raw;
        nextIndex += 1;
        continue;
      }
      break;
    }
    payloads.push(raw);
    index = nextIndex;
  }
  return payloads;
}

function rawOwnedFieldsContainSource(
  yaml: string,
  ownedKeys: readonly string[],
  matches: (token: string) => boolean
): boolean {
  const payloads = collectOwnedBlockRaw(yaml, ownedKeys);
  for (let index = 0; index < payloads.length; index += 1) {
    if (rawBlockContainsSource(payloads[index], matches)) return true;
  }
  return false;
}

function rawOwnedFieldsRequireParsedFallback(
  yaml: string,
  ownedKeys: readonly string[],
  structuredKeys: readonly string[]
): boolean {
  const ownedKeySet = new Set(ownedKeys);
  const structuredKeySet = new Set(structuredKeys);
  return yamlBlocks(yaml).some(
    (block) =>
      block.key !== undefined &&
      (structuredKeySet.has(block.key) ||
        (ownedKeySet.has(block.key) && /^\s*[^:]+:\s*[>|]/.test(block.raw)))
  );
}

function lineRecords(
  yaml: string
): { start: number; end: number; text: string }[] {
  const lines: { start: number; end: number; text: string }[] = [];
  let start = 0;
  for (let index = 0; index < yaml.length; index += 1) {
    if (yaml[index] !== '\n') continue;
    lines.push({
      start,
      end: index + 1,
      text: yaml.slice(start, index + 1),
    });
    start = index + 1;
  }
  if (start < yaml.length) {
    lines.push({
      start,
      end: yaml.length,
      text: yaml.slice(start),
    });
  }
  return lines;
}

function topLevelKey(lineText: string): string | undefined {
  const line = lineText.replace(/\r?\n$/, '');
  if (
    line.length === 0 ||
    line.startsWith(' ') ||
    line.startsWith('\t') ||
    line.startsWith('#')
  ) {
    return undefined;
  }
  const separator = line.indexOf(':');
  if (separator <= 0) return undefined;
  const key = line.slice(0, separator).trim();
  return key.length > 0 ? key : undefined;
}

export function yamlBlocks(yaml: string): YamlBlock[] {
  const lines = lineRecords(yaml);
  const blocks: YamlBlock[] = [];
  let current: { key: string | undefined; start: number } | undefined;
  for (let index = 0; index < lines.length; index += 1) {
    const key = topLevelKey(lines[index].text);
    if (
      key === undefined &&
      current !== undefined &&
      (lines[index].text.startsWith(' ') || lines[index].text.startsWith('\t'))
    )
      continue;
    if (current !== undefined) {
      blocks.push({
        key: current.key,
        raw: yaml.slice(current.start, lines[index].start),
      });
    }
    current = { key, start: lines[index].start };
  }
  if (current !== undefined) {
    blocks.push({
      key: current.key,
      raw: yaml.slice(current.start),
    });
  }
  return blocks;
}

function serializeYamlStringList(
  key: string,
  values: readonly string[],
  newline: '\n' | '\r\n'
): string {
  if (values.length === 0) return `${key}: []${newline}`;
  let serialized = `${key}:${newline}`;
  for (let index = 0; index < values.length; index += 1) {
    serialized += `  - ${JSON.stringify(values[index])}${newline}`;
  }
  return serialized;
}

export function assertUniqueOwnedYamlKeys(
  yaml: string,
  frontmatter: Record<string, unknown>,
  ownedKeys: readonly string[]
): void {
  const ownedKeySet = new Set(ownedKeys);
  const blocks = yamlBlocks(yaml);
  const blockCounts = new Map<string, number>();
  for (let index = 0; index < blocks.length; index += 1) {
    const key = blocks[index].key;
    if (key === undefined || !ownedKeySet.has(key)) continue;
    blockCounts.set(key, (blockCounts.get(key) ?? 0) + 1);
  }
  for (let index = 0; index < ownedKeys.length; index += 1) {
    const key = ownedKeys[index];
    if ((blockCounts.get(key) ?? 0) > 1) failNoteRewrite('conflict');
    if (frontmatter[key] !== undefined && (blockCounts.get(key) ?? 0) === 0) {
      failNoteRewrite('conflict');
    }
  }
}

export function rewriteFrontmatterLists(input: {
  yaml: string;
  newline: '\n' | '\r\n';
  frontmatter: Record<string, unknown>;
  ownedKeys: readonly string[];
  writes: readonly YamlListWrite[];
}): string {
  const blocks = yamlBlocks(input.yaml);
  assertUniqueOwnedYamlKeys(input.yaml, input.frontmatter, input.ownedKeys);

  const writeByKey = new Map<string, YamlListWrite>();
  for (let index = 0; index < input.writes.length; index += 1) {
    const write = input.writes[index];
    writeByKey.set(write.key, write);
  }

  let rewritten = '';
  const written = new Set<string>();
  for (let index = 0; index < blocks.length; index += 1) {
    const block = blocks[index];
    const write =
      block.key === undefined ? undefined : writeByKey.get(block.key);
    if (write === undefined) {
      rewritten += block.raw;
      continue;
    }
    if (write.op === 'remove') continue;
    rewritten += serializeYamlStringList(
      write.key,
      write.values,
      input.newline
    );
    written.add(write.key);
  }
  for (let index = 0; index < input.writes.length; index += 1) {
    const write = input.writes[index];
    if (write.op === 'set' && !written.has(write.key)) {
      if (rewritten.length > 0 && !rewritten.endsWith(input.newline)) {
        rewritten += input.newline;
      }
      rewritten += serializeYamlStringList(
        write.key,
        write.values,
        input.newline
      );
    }
  }
  return rewritten;
}

export function yamlMappingKey(key: string): string {
  if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) return key;
  return JSON.stringify(key);
}

export function serializeYamlLeaf(value: unknown): string {
  if (value === null) return 'null';
  if (typeof value === 'string') return JSON.stringify(value);
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'number' && Number.isFinite(value)) {
    return JSON.stringify(value);
  }
  if (Array.isArray(value) || isRecord(value)) return JSON.stringify(value);
  failNoteRewrite('conflict');
}

function serializeYamlSequenceItem(
  value: unknown,
  newline: '\n' | '\r\n'
): string {
  if (isRecord(value)) {
    const keys: string[] = [];
    for (const key of Object.keys(value)) {
      if (value[key] !== undefined) keys.push(key);
    }
    if (keys.length === 0) return `  - {}${newline}`;
    let serialized = '';
    for (let index = 0; index < keys.length; index += 1) {
      const key = keys[index];
      const line = `${yamlMappingKey(key)}: ${serializeYamlLeaf(value[key])}`;
      serialized +=
        index === 0 ? `  - ${line}${newline}` : `    ${line}${newline}`;
    }
    return serialized;
  }
  return `  - ${serializeYamlLeaf(value)}${newline}`;
}

function serializeYamlSequence(
  key: string,
  items: readonly unknown[],
  newline: '\n' | '\r\n'
): string {
  if (items.length === 0) return `${key}: []${newline}`;
  let serialized = `${key}:${newline}`;
  for (let index = 0; index < items.length; index += 1) {
    serialized += serializeYamlSequenceItem(items[index], newline);
  }
  return serialized;
}

export function rewriteFrontmatterSequence(input: {
  yaml: string;
  newline: '\n' | '\r\n';
  frontmatter: Record<string, unknown>;
  key: string;
  items: readonly unknown[];
}): string {
  assertUniqueOwnedYamlKeys(input.yaml, input.frontmatter, [input.key]);
  const blocks = yamlBlocks(input.yaml);
  let rewritten = '';
  let written = false;
  for (let index = 0; index < blocks.length; index += 1) {
    const block = blocks[index];
    if (block.key !== input.key) {
      rewritten += block.raw;
      continue;
    }
    rewritten += serializeYamlSequence(input.key, input.items, input.newline);
    written = true;
  }
  if (!written) {
    rewritten += serializeYamlSequence(input.key, input.items, input.newline);
  }
  return rewritten;
}

function semanticEqual(left: unknown, right: unknown): boolean {
  if (left === right) return true;
  if (Array.isArray(left) || Array.isArray(right)) {
    if (!Array.isArray(left) || !Array.isArray(right)) return false;
    if (left.length !== right.length) return false;
    for (let index = 0; index < left.length; index += 1) {
      if (!semanticEqual(left[index], right[index])) return false;
    }
    return true;
  }
  if (!isRecord(left) || !isRecord(right)) return false;
  const leftKeys: string[] = [];
  const rightKeys: string[] = [];
  for (const key of Object.keys(left)) {
    if (left[key] !== undefined) leftKeys.push(key);
  }
  for (const key of Object.keys(right)) {
    if (right[key] !== undefined) rightKeys.push(key);
  }
  leftKeys.sort();
  rightKeys.sort();
  if (leftKeys.length !== rightKeys.length) return false;
  for (let index = 0; index < leftKeys.length; index += 1) {
    if (leftKeys[index] !== rightKeys[index]) return false;
    if (!semanticEqual(left[leftKeys[index]], right[rightKeys[index]])) {
      return false;
    }
  }
  return true;
}

export function assertRewrittenFrontmatter(
  yaml: string,
  expected: Record<string, unknown>,
  forbiddenKeys: readonly string[] = []
): void {
  const parsed = parseFrontmatterMapping(yaml);
  for (let index = 0; index < forbiddenKeys.length; index += 1) {
    if (forbiddenKeys[index] in parsed) failNoteRewrite('conflict');
  }
  if (!semanticEqual(parsed, expected)) failNoteRewrite('conflict');
}

export function assembleRewrittenNote(input: {
  content: string;
  parsed: ParsedNote;
  yaml: string;
}): string {
  const match = input.content.match(/^---(\r?\n)([\s\S]*?)\r?\n---(\r?\n|$)/);
  if (!match) failNoteRewrite('internal_error');
  const yamlBlock = input.yaml.endsWith('\n')
    ? input.yaml
    : `${input.yaml}${input.parsed.newline}`;
  return `---${input.parsed.newline}${yamlBlock}---${match[3]}${input.parsed.body}`;
}

export async function collectNoteRewriteMutations<
  Category extends string,
>(input: {
  app: App;
  settings: unknown;
  ownedKeys: readonly string[];
  
  structuredKeys?: readonly string[];
  
  additionalPaths?: readonly string[];
  rawSourceMatches: (token: string) => boolean;
  visit: (args: {
    path: string;
    content: string;
    parsed: ParsedNote;
  }) => { category: Category; resultingContent: string } | undefined;
}): Promise<NoteRewriteMutationDraft<Category>[]> {
  const collected = await collectOwnedSourceNotes({
    app: input.app,
    settings: input.settings,
    ownedKeys: input.ownedKeys,
    structuredKeys: input.structuredKeys,
    additionalPaths: input.additionalPaths,
    rawSourceMatches: input.rawSourceMatches,
    visit: input.visit,
  });
  const mutations: NoteRewriteMutationDraft<Category>[] = [];
  let retainedBytes = 0;
  for (let index = 0; index < collected.length; index += 1) {
    const entry = collected[index];
    retainedBytes +=
      new TextEncoder().encode(entry.content).byteLength +
      new TextEncoder().encode(entry.result.resultingContent).byteLength;
    if (retainedBytes > 2 * 1024 * 1024) {
      failNoteRewrite('limit_exceeded');
    }
    mutations.push({
      path: entry.path,
      category: entry.result.category,
      originalContent: entry.content,
      originalContentHash: await hashNoteRewriteContent(entry.content),
      resultingContent: entry.result.resultingContent,
    });
  }
  return mutations;
}

export async function collectOwnedSourceNotes<T>(input: {
  app: App;
  settings: unknown;
  ownedKeys: readonly string[];
  
  structuredKeys?: readonly string[];
  
  additionalPaths?: readonly string[];
  rawSourceMatches: (token: string) => boolean;
  visit: (args: {
    path: string;
    content: string;
    parsed: ParsedNote;
  }) => T | undefined;
}): Promise<{ path: string; content: string; result: T }[]> {
  const folder = resolveJournalFolderPath(input.settings);
  const additionalPaths = new Set(input.additionalPaths);
  const files = input.app.vault.getMarkdownFiles();
  const collected: { path: string; content: string; result: T }[] = [];

  
  
  for (let index = 0; index < files.length; index += 1) {
    const file = files[index];
    if (
      !isJournalitJournalPath(file.path, folder) &&
      !additionalPaths.has(file.path)
    )
      continue;

    const content = await readFileContentForMutation(input.app, file);
    const split = splitNoteContent(content);
    if (!split) continue;
    const rawMatch = rawOwnedFieldsContainSource(
      split.yaml,
      input.ownedKeys,
      input.rawSourceMatches
    );
    if (
      !rawMatch &&
      !rawOwnedFieldsRequireParsedFallback(
        split.yaml,
        input.ownedKeys,
        input.structuredKeys ?? []
      )
    ) {
      continue;
    }
    const frontmatter = tryParseFrontmatterMapping(split.yaml);
    if (frontmatter === undefined) failNoteRewrite('conflict');
    const parsed: ParsedNote = {
      newline: split.newline,
      yaml: split.yaml,
      body: split.body,
      frontmatter,
    };
    const result = input.visit({
      path: file.path,
      content,
      parsed,
    });
    if (result === undefined) continue;
    collected.push({
      path: file.path,
      content,
      result,
    });
  }

  collected.sort((left, right) => compareCodePoints(left.path, right.path));
  return collected;
}
