import { parser as lezerMarkdownParser } from '@lezer/markdown';

const renderedMarkdownParser = lezerMarkdownParser.configure({
  remove: ['HTMLBlock'],
});

export function isBackslashEscaped(content: string, offset: number): boolean {
  let backslashCount = 0;
  for (let index = offset - 1; index >= 0 && content[index] === '\\'; index--) {
    backslashCount++;
  }
  return backslashCount % 2 === 1;
}

export function getMarkdownIndentColumns(value: string): number {
  let columns = 0;
  for (const character of value) {
    if (character === ' ') {
      columns++;
      continue;
    }
    if (character === '\t') {
      columns += 4 - (columns % 4);
      continue;
    }
    break;
  }
  return columns;
}

function getMarkdownColumnWidth(value: string): number {
  let columns = 0;
  for (const character of value) {
    columns = character === '\t' ? columns + 4 - (columns % 4) : columns + 1;
  }
  return columns;
}

interface MarkdownContainerLine {
  blockquoteDepth: number;
  content: string;
}

function parseMarkdownBlockquotePrefix(line: string): MarkdownContainerLine {
  let blockquoteDepth = 0;
  let offset = 0;

  while (offset < line.length) {
    let markerOffset = offset;
    let leadingSpaces = 0;
    while (leadingSpaces < 3 && line[markerOffset] === ' ') {
      leadingSpaces++;
      markerOffset++;
    }
    if (line[markerOffset] !== '>') break;

    blockquoteDepth++;
    offset = markerOffset + 1;
    if (line[offset] === ' ' || line[offset] === '\t') offset++;
  }

  return { blockquoteDepth, content: line.slice(offset) };
}

interface MarkdownLineAnalysis extends MarkdownContainerLine {
  activeListContentIndent: number;
  listItemMarkerLength: number;
  isIndentedCode: boolean;
  isParagraphLine: boolean;
}

type ParagraphRawHtmlTerminator = '-->' | '?>' | '>' | ']]>';

function getParagraphRawHtmlTerminator(
  content: string
): ParagraphRawHtmlTerminator | undefined {
  const leadingWhitespace = content.match(/^[ \t]*/)?.[0] ?? '';
  if (getMarkdownIndentColumns(leadingWhitespace) > 3) return undefined;
  const candidate = content.slice(leadingWhitespace.length);
  if (candidate.startsWith('<!--')) return '-->';
  if (candidate.startsWith('<?')) return '?>';
  if (/^<![A-Z]/.test(candidate)) return '>';
  if (candidate.startsWith('<![CDATA[')) return ']]>';
  return undefined;
}

function containsParagraphRawHtmlTerminator(
  content: string,
  terminator: ParagraphRawHtmlTerminator
): boolean {
  return content.includes(terminator);
}

function startsNonParagraphMarkdownBlock(
  content: string,
  canBeSetextUnderline = false
): boolean {
  const leadingWhitespace = content.match(/^[ \t]*/)?.[0] ?? '';
  if (getMarkdownIndentColumns(leadingWhitespace) > 3) return false;
  const candidate = content.slice(leadingWhitespace.length).trimEnd();
  if (/^#{1,6}(?:[ \t]+|$)/.test(candidate)) return true;
  if (canBeSetextUnderline && /^(?:=+|-+)[ \t]*$/.test(candidate)) {
    return true;
  }
  if (/^<\/?(?:pre|script|style|textarea)(?:\s|>|$)/i.test(candidate)) {
    return true;
  }
  if (
    /^(?:(?:\*[ \t]*){3,}|(?:_[ \t]*){3,}|(?:-[ \t]*){3,})$/.test(candidate)
  ) {
    return true;
  }
  const fenceMatch = candidate.match(/^(`{3,}|~{3,})/);
  return Boolean(
    fenceMatch &&
    (fenceMatch[1][0] === '~' ||
      !candidate.slice(fenceMatch[0].length).includes('`'))
  );
}

export function analyzeMarkdownLines(
  lines: readonly string[]
): MarkdownLineAnalysis[] {
  const analyses: MarkdownLineAnalysis[] = [];
  const listContentIndentsByBlockquoteDepth = new Map<number, number[]>();
  const rawHtmlTerminatorsByContainer = new Map<
    string,
    ParagraphRawHtmlTerminator
  >();

  const isRawHtmlBlockLine = (
    content: string,
    blockquoteDepth: number,
    activeListContentIndent: number
  ): boolean => {
    const containerKey = `${blockquoteDepth}:${activeListContentIndent}`;
    const activeTerminator = rawHtmlTerminatorsByContainer.get(containerKey);
    if (activeTerminator) {
      if (containsParagraphRawHtmlTerminator(content, activeTerminator)) {
        rawHtmlTerminatorsByContainer.delete(containerKey);
      }
      return true;
    }

    const openedTerminator = getParagraphRawHtmlTerminator(content);
    if (!openedTerminator) return false;
    if (!containsParagraphRawHtmlTerminator(content, openedTerminator)) {
      rawHtmlTerminatorsByContainer.set(containerKey, openedTerminator);
    }
    return true;
  };

  for (let index = 0; index < lines.length; index++) {
    const parsedLine = parseMarkdownBlockquotePrefix(
      lines[index].replace(/\r?\n$/, '')
    );
    const lineText = parsedLine.content;
    if (lineText.trim() === '') {
      analyses.push({
        ...parsedLine,
        activeListContentIndent: 0,
        listItemMarkerLength: 0,
        isIndentedCode: false,
        isParagraphLine: false,
      });
      continue;
    }

    for (const depth of listContentIndentsByBlockquoteDepth.keys()) {
      if (depth > parsedLine.blockquoteDepth) {
        listContentIndentsByBlockquoteDepth.delete(depth);
      }
    }
    const listContentIndents =
      listContentIndentsByBlockquoteDepth.get(parsedLine.blockquoteDepth) ?? [];
    listContentIndentsByBlockquoteDepth.set(
      parsedLine.blockquoteDepth,
      listContentIndents
    );

    const listItemMatch = lineText.match(
      /^([ \t]*)([-+*]|\d{1,9}[.)])(?:([ \t]+)|$)/
    );
    if (listItemMatch) {
      const markerIndent = getMarkdownIndentColumns(listItemMatch[1]);
      while (
        listContentIndents.length > 0 &&
        markerIndent < listContentIndents[listContentIndents.length - 1]
      ) {
        listContentIndents.pop();
      }
      const parentContentIndent =
        listContentIndents[listContentIndents.length - 1] ?? 0;
      const previousLineAnalysis = analyses[index - 1];
      const isSetextUnderline =
        previousLineAnalysis?.isParagraphLine === true &&
        previousLineAnalysis.blockquoteDepth === parsedLine.blockquoteDepth &&
        previousLineAnalysis.activeListContentIndent === parentContentIndent &&
        /^[ \t]{0,3}(?:=+|-+)[ \t]*$/.test(lineText);
      if (markerIndent <= parentContentIndent + 3 && !isSetextUnderline) {
        const marker = `${listItemMatch[1]}${listItemMatch[2]}`;
        const padding = listItemMatch[3] ?? '';
        const paddingColumns = padding
          ? getMarkdownColumnWidth(`${marker}${padding}`) -
            getMarkdownColumnWidth(marker)
          : 1;
        const consumedPaddingLength = padding
          ? paddingColumns <= 4
            ? padding.length
            : 1
          : 0;
        const listItemMarkerLength = marker.length + consumedPaddingLength;
        const activeListContentIndent =
          getMarkdownColumnWidth(marker) +
          (paddingColumns <= 4 ? paddingColumns : 1);
        listContentIndents.push(activeListContentIndent);
        const itemContent = lineText.slice(listItemMarkerLength);
        const isIndentedCode = getMarkdownIndentColumns(itemContent) >= 4;
        const isRawHtmlLine = isRawHtmlBlockLine(
          itemContent,
          parsedLine.blockquoteDepth,
          activeListContentIndent
        );
        analyses.push({
          ...parsedLine,
          activeListContentIndent,
          listItemMarkerLength,
          isIndentedCode,
          isParagraphLine:
            itemContent.trim() !== '' &&
            !isIndentedCode &&
            !isRawHtmlLine &&
            !startsNonParagraphMarkdownBlock(itemContent),
        });
        continue;
      }
    }

    const lineIndent = getMarkdownIndentColumns(lineText);
    while (
      listContentIndents.length > 0 &&
      lineIndent < listContentIndents[listContentIndents.length - 1]
    ) {
      listContentIndents.pop();
    }

    const activeListContentIndent =
      listContentIndents[listContentIndents.length - 1] ?? 0;
    const previousLineAnalysis = analyses[index - 1];
    const previousLineIsParagraph =
      previousLineAnalysis?.isParagraphLine === true &&
      previousLineAnalysis.blockquoteDepth === parsedLine.blockquoteDepth &&
      previousLineAnalysis.activeListContentIndent === activeListContentIndent;
    const isIndentedCode =
      !previousLineIsParagraph && lineIndent >= activeListContentIndent + 4;
    const paragraphContent = stripMarkdownIndentColumns(
      lineText,
      activeListContentIndent
    );
    const isRawHtmlLine = isRawHtmlBlockLine(
      paragraphContent,
      parsedLine.blockquoteDepth,
      activeListContentIndent
    );
    analyses.push({
      ...parsedLine,
      activeListContentIndent,
      listItemMarkerLength: 0,
      isIndentedCode,
      isParagraphLine:
        !isIndentedCode &&
        !isRawHtmlLine &&
        !startsNonParagraphMarkdownBlock(
          paragraphContent,
          previousLineIsParagraph
        ),
    });
  }

  return analyses;
}

function stripMarkdownIndentColumns(value: string, columns: number): string {
  let offset = 0;
  let consumedColumns = 0;
  while (offset < value.length && consumedColumns < columns) {
    if (value[offset] === ' ') {
      consumedColumns++;
      offset++;
      continue;
    }
    if (value[offset] === '\t') {
      const tabWidth = 4 - (consumedColumns % 4);
      offset++;
      if (consumedColumns + tabWidth > columns) {
        return `${' '.repeat(consumedColumns + tabWidth - columns)}${value.slice(offset)}`;
      }
      consumedColumns += tabWidth;
      continue;
    }
    break;
  }
  return value.slice(offset);
}

export function stripMarkdownContainerPrefix(lineAnalysis: {
  content: string;
  activeListContentIndent: number;
  listItemMarkerLength: number;
}): string {
  return lineAnalysis.listItemMarkerLength > 0
    ? lineAnalysis.content.slice(lineAnalysis.listItemMarkerLength)
    : stripMarkdownIndentColumns(
        lineAnalysis.content,
        lineAnalysis.activeListContentIndent
      );
}

interface SourceRange {
  from: number;
  to: number;
}

export interface MarkdownSyntaxNode {
  name: string;
  from: number;
  to: number;
  children: MarkdownSyntaxNode[];
}

interface MarkdownMapOptions {
  protectHtmlComments?: boolean;
  protectBlankLineRawHtmlBlocks?: boolean;
}

const BLANK_LINE_RAW_HTML_BLOCK_TAGS = new Set([
  'address',
  'article',
  'aside',
  'base',
  'basefont',
  'blockquote',
  'body',
  'caption',
  'center',
  'col',
  'colgroup',
  'dd',
  'details',
  'dialog',
  'dir',
  'div',
  'dl',
  'dt',
  'fieldset',
  'figcaption',
  'figure',
  'footer',
  'form',
  'frame',
  'frameset',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'head',
  'header',
  'hr',
  'html',
  'iframe',
  'legend',
  'li',
  'link',
  'main',
  'menu',
  'menuitem',
  'nav',
  'noframes',
  'ol',
  'optgroup',
  'option',
  'p',
  'param',
  'search',
  'section',
  'summary',
  'table',
  'tbody',
  'td',
  'tfoot',
  'th',
  'thead',
  'title',
  'tr',
  'track',
  'ul',
]);

function mergeSourceRanges(ranges: readonly SourceRange[]): SourceRange[] {
  const sorted = [...ranges]
    .filter(({ from, to }) => to > from)
    .sort((left, right) => left.from - right.from || right.to - left.to);
  const merged: SourceRange[] = [];
  for (const range of sorted) {
    const previous = merged[merged.length - 1];
    if (!previous || range.from > previous.to) {
      merged.push({ ...range });
      continue;
    }
    previous.to = Math.max(previous.to, range.to);
  }
  return merged;
}

export function collectMarkdownSyntaxNodes(
  content: string,
  names: ReadonlySet<string>,
  options?: { renderedMarkdown?: boolean }
): MarkdownSyntaxNode[] {
  const nodes: MarkdownSyntaxNode[] = [];
  const parser = options?.renderedMarkdown
    ? renderedMarkdownParser
    : lezerMarkdownParser;
  const cursor = parser.parse(content).cursor();
  const visit = (): MarkdownSyntaxNode => {
    const node: MarkdownSyntaxNode = {
      name: cursor.name,
      from: cursor.from,
      to: cursor.to,
      children: [],
    };
    if (cursor.firstChild()) {
      do {
        node.children.push(visit());
      } while (cursor.nextSibling());
      cursor.parent();
    }
    if (names.has(node.name)) nodes.push(node);
    return node;
  };
  visit();
  return nodes;
}

function isOpaqueRawHtmlBlock(
  content: string,
  from: number,
  to: number
): boolean {
  const block = content.slice(from, to).trimStart();
  return /^(?:<(?:pre|script|style|textarea)(?:\s|>|$)|<\?|<![A-Z]|<!\[CDATA\[)/i.test(
    block
  );
}

function shouldProtectBlankLineHtmlBlock(
  content: string,
  from: number,
  to: number
): boolean {
  const block = content.slice(from, to).trimStart();
  const tagName = block.match(/^<\/?([a-z][\w-]*)/i)?.[1].toLowerCase();
  if (!tagName || BLANK_LINE_RAW_HTML_BLOCK_TAGS.has(tagName)) return true;

  const previousLineEnd =
    from > 0 && content[from - 1] === '\n' ? from - 1 : from;
  const previousLineStart = content.lastIndexOf('\n', previousLineEnd - 1) + 1;
  const previousLine = content.slice(previousLineStart, previousLineEnd);
  return (
    previousLine.trim() === '' || startsNonParagraphMarkdownBlock(previousLine)
  );
}

function collectInlineCodeElementRanges(content: string): SourceRange[] {
  const tags = collectMarkdownSyntaxNodes(content, new Set(['HTMLTag']), {
    renderedMarkdown: true,
  });
  const openingTags: SourceRange[] = [];
  const ranges: SourceRange[] = [];
  for (const tag of tags) {
    const tagContent = content.slice(tag.from, tag.to);
    if (/^<code(?:\s|>)/i.test(tagContent) && !/\/\s*>$/.test(tagContent)) {
      openingTags.push(tag);
      continue;
    }
    if (!/^<\/code\s*>$/i.test(tagContent)) continue;
    const openingTag = openingTags.pop();
    if (openingTag) ranges.push({ from: openingTag.from, to: tag.to });
  }
  return ranges;
}

function mapOutsideSourceRanges(
  content: string,
  ranges: readonly SourceRange[],
  transform: (contentOutsideRanges: string) => string
): string {
  const tokenMarker = '\u0000JOURNALIT_PROTECTED_';
  const occupiedTokenNamespaces = new Set<number>();
  for (const tokenSuffix of content.split(tokenMarker).slice(1)) {
    const namespace = Number.parseInt(tokenSuffix, 10);
    const separatorIndex = String(namespace).length;
    if (
      Number.isInteger(namespace) &&
      namespace >= 0 &&
      tokenSuffix[separatorIndex] === '_'
    ) {
      occupiedTokenNamespaces.add(namespace);
    }
  }
  let tokenNamespace = 0;
  while (occupiedTokenNamespaces.has(tokenNamespace)) {
    tokenNamespace++;
  }
  const tokenPrefix = `\u0000JOURNALIT_PROTECTED_${tokenNamespace}_`;
  const protectedSegments: string[] = [];
  let protectedContent = '';
  let offset = 0;
  for (const range of mergeSourceRanges(ranges)) {
    protectedContent += content.slice(offset, range.from);
    const token = `${tokenPrefix}${protectedSegments.length}\u0000`;
    protectedSegments.push(content.slice(range.from, range.to));
    protectedContent += token;
    offset = range.to;
  }
  protectedContent += content.slice(offset);

  let transformed = transform(protectedContent);
  for (let index = protectedSegments.length - 1; index >= 0; index--) {
    transformed = transformed.replaceAll(
      `${tokenPrefix}${index}\u0000`,
      () => protectedSegments[index]
    );
  }
  return transformed;
}

export function mapOutsideMarkdownBlankLineRawHtmlBlocks(
  content: string,
  transform: (contentOutsideBlocks: string) => string
): string {
  const ranges = collectMarkdownSyntaxNodes(
    content,
    new Set(['HTMLBlock'])
  ).filter(({ from, to }) =>
    shouldProtectBlankLineHtmlBlock(content, from, to)
  );
  return mapOutsideSourceRanges(content, ranges, transform);
}

export function mapOutsideMarkdownCodeRegions(
  content: string,
  transform: (contentOutsideCode: string) => string,
  options?: MarkdownMapOptions
): string {
  const ranges: SourceRange[] = collectMarkdownSyntaxNodes(
    content,
    new Set(['FencedCode', 'CodeBlock', 'InlineCode']),
    { renderedMarkdown: true }
  ).map(({ from, to }) => ({ from, to }));
  ranges.push(
    ...collectMarkdownSyntaxNodes(
      content,
      new Set([
        'FencedCode',
        'CodeBlock',
        'InlineCode',
        'Comment',
        'CommentBlock',
        'HTMLBlock',
        'ProcessingInstruction',
        'ProcessingInstructionBlock',
      ])
    ).filter(({ name, from, to }) => {
      return (
        name === 'FencedCode' ||
        name === 'CodeBlock' ||
        name === 'InlineCode' ||
        (options?.protectHtmlComments !== false &&
          (name === 'Comment' || name === 'CommentBlock')) ||
        (name === 'HTMLBlock' && isOpaqueRawHtmlBlock(content, from, to)) ||
        name === 'ProcessingInstruction' ||
        name === 'ProcessingInstructionBlock'
      );
    })
  );
  ranges.push(...collectInlineCodeElementRanges(content));

  return mapOutsideSourceRanges(content, ranges, (protectedContent) =>
    options?.protectBlankLineRawHtmlBlocks === false
      ? transform(protectedContent)
      : mapOutsideMarkdownBlankLineRawHtmlBlocks(protectedContent, transform)
  );
}
