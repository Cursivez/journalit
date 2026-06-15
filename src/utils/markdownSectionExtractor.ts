interface ExtractedMarkdownSection {
  heading: string;
  level: number;
  content: string;
}

const FRONTMATTER_PATTERN = /^---\r?\n[\s\S]*?\r?\n---\r?\n?/;
const HEADING_PATTERN = /^(#{1,6})\s+(.+?)\s*#*\s*$/;
const FENCE_PATTERN = /^\s*(```|~~~)/;
const PREVIOUS_TRADING_DAY_CONTEXT_WIDGET =
  'journalit-previous-trading-day-context';
const OPENING_FENCE_PATTERN = /^ {0,3}(`{3,}|~{3,})[\t ]*([^\r\n]*)$/;
const BLOCKQUOTE_PREFIX_PATTERN = /^ {0,3}>[\t ]?/;
const LIST_ITEM_PREFIX_PATTERN = /^ {0,3}(?:[-+*]|\d{1,9}[.)])[\t ]+/;
const ABSOLUTE_LIST_ITEM_PATTERN = /^( *)(?:[-+*]|\d{1,9}[.)])[\t ]+/;

function normalizeHeadingText(text: string): string {
  return text.trim().replace(/\s+/g, ' ').toLowerCase();
}

function stripMarkdownFrontmatter(content: string): string {
  return content.replace(FRONTMATTER_PATTERN, '');
}

function trimBlankBoundaryLines(content: string): string {
  return content
    .replace(/^(?:[\t ]*\r?\n)+/, '')
    .replace(/(?:\r?\n[\t ]*)+$/, '');
}

interface MarkdownFence {
  fenceChar: '`' | '~';
  fenceLength: number;
  infoString: string;
  maxClosingIndent: number;
  allowContainerPrefixClosing: boolean;
}

interface StrippedMarkdownContainerLine {
  line: string;
  maxFenceIndent: number;
  usedContainerPrefix: boolean;
}

function getLeadingSpaces(line: string): number {
  return line.match(/^ */)?.[0].length ?? 0;
}

function getListContinuationIndent(line: string): number | null {
  const match = line.match(ABSOLUTE_LIST_ITEM_PATTERN);
  if (!match) return null;
  return match[0].length;
}

function stripMarkdownContainerPrefixes(
  line: string
): StrippedMarkdownContainerLine {
  let remaining = line;
  let maxFenceIndent = 3;
  let usedContainerPrefix = false;
  let changed = true;

  while (changed) {
    changed = false;

    const withoutBlockquote = remaining.replace(BLOCKQUOTE_PREFIX_PATTERN, '');
    if (withoutBlockquote !== remaining) {
      remaining = withoutBlockquote;
      usedContainerPrefix = true;
      changed = true;
      continue;
    }

    const listItemMatch = remaining.match(LIST_ITEM_PREFIX_PATTERN);
    const withoutListItem = remaining.replace(LIST_ITEM_PREFIX_PATTERN, '');
    if (withoutListItem !== remaining) {
      maxFenceIndent = Math.max(maxFenceIndent, listItemMatch?.[0].length ?? 3);
      remaining = withoutListItem;
      usedContainerPrefix = true;
      changed = true;
    }
  }

  return { line: remaining, maxFenceIndent, usedContainerPrefix };
}

function getOpeningFence(
  line: string,
  activeListIndents: number[] = []
): MarkdownFence | null {
  const matchingListIndent = activeListIndents.reduce<number | undefined>(
    (best, indent) =>
      line.startsWith(' '.repeat(indent)) &&
      (best === undefined || indent > best)
        ? indent
        : best,
    undefined
  );
  const lineRelativeToList =
    matchingListIndent === undefined ? line : line.slice(matchingListIndent);
  const stripped = stripMarkdownContainerPrefixes(lineRelativeToList);
  const match = stripped.line.match(OPENING_FENCE_PATTERN);
  if (!match) return null;

  const fenceChar = match[1].startsWith('`') ? '`' : '~';
  const baseListIndent = matchingListIndent ?? 0;
  return {
    fenceChar,
    fenceLength: match[1].length,
    infoString: match[2].trim(),
    maxClosingIndent: baseListIndent + stripped.maxFenceIndent,
    allowContainerPrefixClosing: stripped.usedContainerPrefix,
  };
}

function isPreviousTradingDayContextOpeningFence(
  fence: MarkdownFence
): boolean {
  const language = fence.infoString.split(/[\t ]+/)[0];
  return language === PREVIOUS_TRADING_DAY_CONTEXT_WIDGET;
}

function isClosingFence(
  line: string,
  fenceChar: '`' | '~',
  fenceLength: number,
  maxClosingIndent: number,
  allowContainerPrefixClosing: boolean
): boolean {
  const escapedFenceChar = fenceChar === '`' ? '`' : '~';
  const pattern = new RegExp(
    `^ {0,${maxClosingIndent}}${escapedFenceChar}{${fenceLength},}[\\t ]*$`
  );
  const candidateLine = allowContainerPrefixClosing
    ? stripMarkdownContainerPrefixes(line).line
    : line;
  return pattern.test(candidateLine);
}

export function extractMarkdownSectionsByHeading(
  content: string,
  headings: string[]
): ExtractedMarkdownSection[] {
  const wantedHeadings = new Set(
    headings.map(normalizeHeadingText).filter((heading) => heading.length > 0)
  );

  if (wantedHeadings.size === 0) {
    return [];
  }

  const lines = stripMarkdownFrontmatter(content).split('\n');
  const sections: ExtractedMarkdownSection[] = [];

  let inFence = false;
  for (let i = 0; i < lines.length; i++) {
    if (FENCE_PATTERN.test(lines[i])) {
      inFence = !inFence;
      continue;
    }

    if (inFence) continue;

    const match = lines[i].match(HEADING_PATTERN);
    if (!match) continue;

    const level = match[1].length;
    const heading = match[2].trim();
    if (!wantedHeadings.has(normalizeHeadingText(heading))) continue;

    const sectionLines: string[] = [];
    let sectionInFence = false;
    for (let j = i + 1; j < lines.length; j++) {
      if (FENCE_PATTERN.test(lines[j])) {
        sectionInFence = !sectionInFence;
        sectionLines.push(lines[j]);
        continue;
      }

      const nextHeading = sectionInFence
        ? null
        : lines[j].match(HEADING_PATTERN);
      if (nextHeading && nextHeading[1].length <= level) {
        break;
      }
      sectionLines.push(lines[j]);
    }

    sections.push({
      heading,
      level,
      content: sectionLines.join('\n').trim(),
    });
  }

  return sections;
}

export function extractJournalitImageWidgetIds(content: string): string[] {
  const lines = content.split('\n');
  const ids: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    if (!lines[i].trimStart().startsWith('```journalit-images')) continue;

    for (let j = i + 1; j < lines.length; j++) {
      const trimmed = lines[j].trim();
      if (trimmed === '```') {
        i = j;
        break;
      }
      if (trimmed.startsWith('id:')) {
        const id = trimmed.slice('id:'.length).trim();
        if (id) ids.push(id);
      }
    }
  }

  return ids;
}

export function stripPreviousTradingDayContextWidgetBlocks(
  content: string
): string {
  const lines = content.split(/(\r?\n)/);
  const output: string[] = [];
  const activeListIndents: number[] = [];

  for (let i = 0; i < lines.length; i += 2) {
    const line = lines[i];
    const newline = lines[i + 1] ?? '';

    if (line.trim().length > 0) {
      const leadingSpaces = getLeadingSpaces(line);
      while (
        activeListIndents.length > 0 &&
        leadingSpaces < activeListIndents[activeListIndents.length - 1]
      ) {
        activeListIndents.pop();
      }
    }

    const openingFence = getOpeningFence(line, activeListIndents);
    const listContinuationIndent = getListContinuationIndent(line);
    if (listContinuationIndent !== null) {
      while (
        activeListIndents.length > 0 &&
        listContinuationIndent <=
          activeListIndents[activeListIndents.length - 1]
      ) {
        activeListIndents.pop();
      }
      activeListIndents.push(listContinuationIndent);
    }

    if (!openingFence) {
      output.push(line, newline);
      continue;
    }

    const shouldStrip = isPreviousTradingDayContextOpeningFence(openingFence);
    if (!shouldStrip) output.push(line, newline);

    while (i + 2 < lines.length) {
      i += 2;
      const candidateLine = lines[i];
      const candidateNewline = lines[i + 1] ?? '';
      if (!shouldStrip) output.push(candidateLine, candidateNewline);
      if (
        isClosingFence(
          candidateLine,
          openingFence.fenceChar,
          openingFence.fenceLength,
          openingFence.maxClosingIndent,
          openingFence.allowContainerPrefixClosing
        )
      ) {
        break;
      }
    }
  }

  return trimBlankBoundaryLines(output.join(''));
}
