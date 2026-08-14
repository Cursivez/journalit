import {
  analyzeMarkdownLines,
  collectMarkdownSyntaxNodes as collectLezerMarkdownSyntaxNodes,
  getMarkdownIndentColumns,
  isBackslashEscaped,
  stripMarkdownContainerPrefix,
} from './MarkdownContentParser';
import type { MarkdownSyntaxNode } from './MarkdownContentParser';
import type { MediaReferenceTransform } from './TradeNoteMediaReferenceTypes';

function normalizeMarkdownReferenceLabel(label: string): string {
  return label.trim().replace(/\s+/g, ' ').toLowerCase();
}

function formatRewrittenMarkdownTarget(
  originalTarget: string,
  rewrittenTarget: string,
  suffix = ''
): string {
  const encodedTarget = encodeURI(rewrittenTarget)
    .replace(/#/g, '%23')
    .replace(/\?/g, '%3F');
  const targetWithSuffix = `${encodedTarget}${suffix}`;
  return originalTarget.startsWith('<')
    ? `<${targetWithSuffix}>`
    : targetWithSuffix;
}

function formatRewrittenWikiTarget(
  rewrittenTarget: string,
  suffix = ''
): string {
  return `${rewrittenTarget.replace(/#/g, '%23').replace(/\?/g, '%3F')}${suffix}`;
}

interface SourceRange {
  from: number;
  to: number;
}

interface SourceEdit extends SourceRange {
  replacement: string;
}

function collectMarkdownSyntaxNodes(
  nodes: readonly MarkdownSyntaxNode[],
  name: string
): MarkdownSyntaxNode[] {
  return nodes.filter((node) => node.name === name);
}

const TRADE_MARKDOWN_NODE_NAMES = new Set(['Image', 'Link', 'LinkReference']);

function parseMarkdownSyntax(content: string): MarkdownSyntaxNode[] {
  return collectLezerMarkdownSyntaxNodes(content, TRADE_MARKDOWN_NODE_NAMES, {
    renderedMarkdown: true,
  });
}

function applySourceEdits(
  content: string,
  edits: readonly SourceEdit[]
): string {
  const selectedEdits: SourceEdit[] = [];
  const editsBySourceOrder = Array.from(edits);
  editsBySourceOrder.sort(
    (left, right) => left.from - right.from || right.to - left.to
  );
  for (const edit of editsBySourceOrder) {
    const containingEdit = selectedEdits[selectedEdits.length - 1];
    if (containingEdit && edit.from < containingEdit.to) {
      if (edit.to <= containingEdit.to) continue;
      
      
      
      throw new Error('Overlapping Markdown source edits are not supported');
    }
    selectedEdits.push(edit);
  }

  let transformed = content;
  const sortedEdits = Array.from(selectedEdits);
  sortedEdits.sort((left, right) => right.from - left.from);
  for (const edit of sortedEdits) {
    transformed = `${transformed.slice(0, edit.from)}${edit.replacement}${transformed.slice(edit.to)}`;
  }
  return transformed;
}

function isCoveredBySourceRange(
  from: number,
  to: number,
  ranges: readonly SourceRange[]
): boolean {
  return ranges.some((range) => range.from <= from && range.to >= to);
}

function findDirectChild(
  node: MarkdownSyntaxNode,
  name: string
): MarkdownSyntaxNode | undefined {
  return node.children.find((child) => child.name === name);
}

function getMarkdownLinkLabel(
  content: string,
  node: MarkdownSyntaxNode
): string | null {
  const openingLength = content.startsWith('![', node.from) ? 2 : 1;
  const closingMark = node.children.find(
    (child) =>
      child.name === 'LinkMark' && content.slice(child.from, child.to) === ']'
  );
  return closingMark
    ? content.slice(node.from + openingLength, closingMark.from)
    : null;
}

function isEscapedMarkdownNode(
  content: string,
  node: MarkdownSyntaxNode
): boolean {
  return (
    isBackslashEscaped(content, node.from) ||
    (node.name === 'Link' &&
      content[node.from - 1] === '!' &&
      isBackslashEscaped(content, node.from - 1))
  );
}

function getAuthoritativeInlineUrl(
  content: string,
  node: MarkdownSyntaxNode
): MarkdownSyntaxNode | undefined {
  const url = findDirectChild(node, 'URL');
  if (!url) return undefined;
  const title = findDirectChild(node, 'LinkTitle');
  
  
  return content[node.to] === ')' && title && content[title.from] === '('
    ? undefined
    : url;
}

function mapMarkdownInlineLinks(
  content: string,
  transform: (target: string) => MediaReferenceTransform
): string {
  const syntax = parseMarkdownSyntax(content);
  const edits: SourceEdit[] = [];
  for (const node of [
    ...collectMarkdownSyntaxNodes(syntax, 'Image'),
    ...collectMarkdownSyntaxNodes(syntax, 'Link'),
  ]) {
    if (
      content.startsWith('![[', node.from) ||
      isEscapedMarkdownNode(content, node)
    ) {
      continue;
    }
    const url = getAuthoritativeInlineUrl(content, node);
    if (!url) continue;

    const result = transform(content.slice(url.from, url.to));
    if (result.kind === 'keep') continue;
    if (result.kind === 'remove') {
      const label = getMarkdownLinkLabel(content, node);
      edits.push({
        from: node.from,
        to: node.to,
        replacement: node.name === 'Image' ? '' : (label ?? ''),
      });
      continue;
    }
    edits.push({
      from: url.from,
      to: url.to,
      replacement: formatRewrittenMarkdownTarget(
        content.slice(url.from, url.to),
        result.target,
        result.suffix
      ),
    });
  }
  const transformed = applySourceEdits(content, edits);
  if (transformed !== content) {
    return mapMarkdownInlineLinks(transformed, transform);
  }
  const transformedSyntax = parseMarkdownSyntax(transformed);
  const recognizedInlineNodes = [
    ...collectMarkdownSyntaxNodes(transformedSyntax, 'Image'),
    ...collectMarkdownSyntaxNodes(transformedSyntax, 'Link'),
  ].filter((node) => Boolean(getAuthoritativeInlineUrl(transformed, node)));
  return mapExtendedMarkdownInlineLinks(
    transformed,
    transform,
    recognizedInlineNodes
  );
}

interface MarkdownInlineDestination {
  leadingWhitespace: string;
  target: string;
  title: string;
  endIndex: number;
}

interface MarkdownBracketLabel {
  label: string;
  endIndex: number;
}

function continueMarkdownTitleAfterLineEnding(
  content: string,
  index: number
): number | null {
  const nextLineIndex =
    content[index] === '\r' && content[index + 1] === '\n'
      ? index + 2
      : index + 1;
  let nextContentIndex = nextLineIndex;
  while (
    content[nextContentIndex] === ' ' ||
    content[nextContentIndex] === '\t'
  ) {
    nextContentIndex++;
  }
  return nextContentIndex >= content.length ||
    content[nextContentIndex] === '\r' ||
    content[nextContentIndex] === '\n'
    ? null
    : nextLineIndex;
}

function parseMarkdownBracketLabel(
  content: string,
  startIndex: number
): MarkdownBracketLabel | null {
  let index = startIndex;
  let bracketDepth = 1;
  while (index < content.length) {
    if (content[index] === '\\' && index + 1 < content.length) {
      index += 2;
      continue;
    }
    if (content[index] === '\r' || content[index] === '\n') {
      index += content[index] === '\r' && content[index + 1] === '\n' ? 2 : 1;
      let nextContentIndex = index;
      while (
        content[nextContentIndex] === ' ' ||
        content[nextContentIndex] === '\t'
      ) {
        nextContentIndex++;
      }
      if (
        nextContentIndex >= content.length ||
        content[nextContentIndex] === '\r' ||
        content[nextContentIndex] === '\n'
      ) {
        return null;
      }
      continue;
    }
    if (content[index] === '[') {
      bracketDepth++;
    } else if (content[index] === ']') {
      bracketDepth--;
      if (bracketDepth === 0) {
        return {
          label: content.slice(startIndex, index),
          endIndex: index + 1,
        };
      }
    }
    index++;
  }
  return null;
}

function parseMarkdownInlineDestination(
  content: string,
  startIndex: number
): MarkdownInlineDestination | null {
  let index = startIndex;
  while (content[index] === ' ' || content[index] === '\t') index++;
  if (content[index] === '\r' && content[index + 1] === '\n') {
    index += 2;
    while (content[index] === ' ' || content[index] === '\t') index++;
  } else if (content[index] === '\n') {
    index++;
    while (content[index] === ' ' || content[index] === '\t') index++;
  }
  const targetStart = index;
  const leadingWhitespace = content.slice(startIndex, targetStart);
  let targetEnd: number;

  if (content[index] === '<') {
    index++;
    while (index < content.length && content[index] !== '\n') {
      if (content[index] === '\\' && index + 1 < content.length) {
        index += 2;
        continue;
      }
      if (content[index] === '>') break;
      index++;
    }
    if (content[index] !== '>') return null;
    targetEnd = ++index;
  } else {
    let parenthesisDepth = 0;
    while (index < content.length && content[index] !== '\n') {
      const character = content[index];
      if (character === '\\' && index + 1 < content.length) {
        index += 2;
        continue;
      }
      if (character === '(') {
        parenthesisDepth++;
        index++;
        continue;
      }
      if (character === ')') {
        if (parenthesisDepth === 0) break;
        parenthesisDepth--;
        index++;
        continue;
      }
      if (/\s/.test(character)) break;
      index++;
    }
    if (parenthesisDepth !== 0 || index === targetStart) return null;
    targetEnd = index;
  }

  if (content[index] === ')') {
    return {
      leadingWhitespace,
      target: content.slice(targetStart, targetEnd),
      title: '',
      endIndex: index + 1,
    };
  }

  const titleStart = index;
  while (content[index] === ' ' || content[index] === '\t') index++;
  if (content[index] === '\r' && content[index + 1] === '\n') {
    index += 2;
    while (content[index] === ' ' || content[index] === '\t') index++;
  } else if (content[index] === '\n') {
    index++;
    while (content[index] === ' ' || content[index] === '\t') index++;
  }
  if (index === titleStart) return null;
  if (content[index] === ')') {
    return {
      leadingWhitespace,
      target: content.slice(targetStart, targetEnd),
      title: content.slice(titleStart, index),
      endIndex: index + 1,
    };
  }

  const titleDelimiter = content[index];
  if (titleDelimiter === '"' || titleDelimiter === "'") {
    index++;
    while (index < content.length) {
      if (content[index] === '\\' && index + 1 < content.length) {
        index += 2;
        continue;
      }
      if (content[index] === '\r' || content[index] === '\n') {
        const continuationIndex = continueMarkdownTitleAfterLineEnding(
          content,
          index
        );
        if (continuationIndex === null) return null;
        index = continuationIndex;
        continue;
      }
      if (content[index] === titleDelimiter) break;
      index++;
    }
    if (content[index] !== titleDelimiter) return null;
    index++;
  } else if (titleDelimiter === '(') {
    let titleParenthesisDepth = 1;
    index++;
    while (index < content.length) {
      if (content[index] === '\\' && index + 1 < content.length) {
        index += 2;
        continue;
      }
      if (content[index] === '\r' || content[index] === '\n') {
        const continuationIndex = continueMarkdownTitleAfterLineEnding(
          content,
          index
        );
        if (continuationIndex === null) return null;
        index = continuationIndex;
        continue;
      }
      if (content[index] === '(') {
        titleParenthesisDepth++;
      } else if (content[index] === ')') {
        titleParenthesisDepth--;
        if (titleParenthesisDepth === 0) {
          index++;
          break;
        }
      }
      index++;
    }
    if (titleParenthesisDepth !== 0) return null;
  } else {
    return null;
  }

  while (content[index] === ' ' || content[index] === '\t') index++;
  if (content[index] !== ')') return null;

  return {
    leadingWhitespace,
    target: content.slice(targetStart, targetEnd),
    title: content.slice(titleStart, index),
    endIndex: index + 1,
  };
}




function mapExtendedMarkdownInlineLinks(
  content: string,
  transform: (target: string) => MediaReferenceTransform,
  recognizedRanges: readonly SourceRange[]
): string {
  const openerPattern = /(!?)\[/g;
  let transformed = '';
  let retainedUntil = 0;
  let match: RegExpExecArray | null;

  while ((match = openerPattern.exec(content)) !== null) {
    if (isBackslashEscaped(content, match.index)) continue;
    const parsedLabel = parseMarkdownBracketLabel(
      content,
      openerPattern.lastIndex
    );
    if (!parsedLabel || content[parsedLabel.endIndex] !== '(') continue;

    const destination = parseMarkdownInlineDestination(
      content,
      parsedLabel.endIndex + 1
    );
    if (!destination) continue;
    openerPattern.lastIndex = destination.endIndex;
    if (
      isCoveredBySourceRange(
        match.index,
        destination.endIndex,
        recognizedRanges
      )
    ) {
      continue;
    }

    const result = transform(destination.target);
    if (result.kind === 'keep') continue;

    transformed += content.slice(retainedUntil, match.index);
    if (result.kind === 'remove') {
      transformed += match[1] ? '' : parsedLabel.label;
    } else {
      transformed += `${match[1]}[${parsedLabel.label}](${destination.leadingWhitespace}${formatRewrittenMarkdownTarget(destination.target, result.target, result.suffix)}${destination.title})`;
    }
    retainedUntil = destination.endIndex;
  }

  return retainedUntil === 0
    ? content
    : transformed + content.slice(retainedUntil);
}

function getReferenceLabel(
  content: string,
  labelNode: MarkdownSyntaxNode
): string {
  return content.slice(labelNode.from + 1, labelNode.to - 1);
}

function hasBalancedBareDestinationParentheses(target: string): boolean {
  if (target.startsWith('<')) return true;
  let depth = 0;
  for (let index = 0; index < target.length; index++) {
    if (target[index] === '\\') {
      index++;
    } else if (target[index] === '(') {
      depth++;
    } else if (target[index] === ')') {
      if (depth === 0) return false;
      depth--;
    }
  }
  return depth === 0;
}

function getReferenceUseLabel(
  content: string,
  node: MarkdownSyntaxNode
): string | null {
  const visibleLabel = getMarkdownLinkLabel(content, node);
  if (visibleLabel === null) return null;
  const explicitLabel = findDirectChild(node, 'LinkLabel');
  if (!explicitLabel) return visibleLabel;
  const label = getReferenceLabel(content, explicitLabel);
  return label || visibleLabel;
}

function getWholeLineEdit(
  content: string,
  from: number,
  to: number
): SourceEdit {
  const lineStart = content.lastIndexOf('\n', from - 1) + 1;
  const nextLineBreak = content.indexOf('\n', to);
  const lineEnd = nextLineBreak === -1 ? content.length : nextLineBreak;
  return {
    from: lineStart,
    to: lineEnd,
    replacement: content.slice(lineStart, lineEnd).replace(/[^\r\n]/g, ''),
  };
}

function mapMarkdownReferenceLinks(
  content: string,
  transform: (target: string) => MediaReferenceTransform
): string {
  const syntax = parseMarkdownSyntax(content);
  const transformsByLabel = new Map<string, MediaReferenceTransform>();
  const edits: SourceEdit[] = [];

  for (const definition of collectMarkdownSyntaxNodes(
    syntax,
    'LinkReference'
  )) {
    const labelNode = findDirectChild(definition, 'LinkLabel');
    const urlNode = findDirectChild(definition, 'URL');
    if (!labelNode || !urlNode) continue;

    const normalizedLabel = normalizeMarkdownReferenceLabel(
      getReferenceLabel(content, labelNode)
    );
    if (normalizedLabel.startsWith('^')) continue;
    const existingTransform = transformsByLabel.get(normalizedLabel);
    if (existingTransform) {
      if (existingTransform.kind === 'remove') {
        edits.push(getWholeLineEdit(content, definition.from, definition.to));
      }
      continue;
    }

    const target = content.slice(urlNode.from, urlNode.to);
    if (!hasBalancedBareDestinationParentheses(target)) continue;
    const result = transform(target);
    transformsByLabel.set(normalizedLabel, result);
    if (result.kind === 'remove') {
      edits.push(getWholeLineEdit(content, definition.from, definition.to));
    } else if (result.kind === 'rewrite') {
      edits.push({
        from: urlNode.from,
        to: urlNode.to,
        replacement: formatRewrittenMarkdownTarget(
          target,
          result.target,
          result.suffix
        ),
      });
    }
  }

  for (const node of [
    ...collectMarkdownSyntaxNodes(syntax, 'Image'),
    ...collectMarkdownSyntaxNodes(syntax, 'Link'),
  ]) {
    if (
      content.startsWith('![[', node.from) ||
      content[node.from - 1] === '[' ||
      isEscapedMarkdownNode(content, node) ||
      findDirectChild(node, 'URL')
    ) {
      continue;
    }
    const referenceLabel = getReferenceUseLabel(content, node);
    if (referenceLabel === null || referenceLabel.startsWith('^')) continue;
    const result = transformsByLabel.get(
      normalizeMarkdownReferenceLabel(referenceLabel)
    );
    if (result?.kind !== 'remove') continue;

    edits.push({
      from: node.from,
      to: node.to,
      replacement:
        node.name === 'Image'
          ? ''
          : (getMarkdownLinkLabel(content, node) ?? ''),
    });
  }

  const transformed = applySourceEdits(content, edits);
  const transformedSyntax = parseMarkdownSyntax(transformed);
  const recognizedReferenceNodes = [
    ...collectMarkdownSyntaxNodes(transformedSyntax, 'LinkReference'),
    ...[
      ...collectMarkdownSyntaxNodes(transformedSyntax, 'Image'),
      ...collectMarkdownSyntaxNodes(transformedSyntax, 'Link'),
    ].filter((node) => {
      if (getAuthoritativeInlineUrl(transformed, node)) return true;
      const label = getReferenceUseLabel(transformed, node);
      return (
        label !== null &&
        transformsByLabel.has(normalizeMarkdownReferenceLabel(label))
      );
    }),
  ];
  return mapExtendedMarkdownReferenceLinks(
    transformed,
    transform,
    recognizedReferenceNodes,
    transformsByLabel
  );
}

function isMarkdownReferenceContinuationTitle(content: string): boolean {
  const leadingIndent = content.match(/^[ \t]*/)?.[0] ?? '';
  if (getMarkdownIndentColumns(leadingIndent) > 3) return false;

  const candidate = content.slice(leadingIndent.length).trimEnd();
  if (candidate.length < 2) return false;
  const openingDelimiter = candidate[0];
  const closingDelimiter = openingDelimiter === '(' ? ')' : openingDelimiter;
  if (
    (openingDelimiter !== '"' &&
      openingDelimiter !== "'" &&
      openingDelimiter !== '(') ||
    candidate[candidate.length - 1] !== closingDelimiter
  ) {
    return false;
  }

  for (let index = 1; index < candidate.length - 1; index++) {
    if (candidate[index] === '\\') {
      index++;
      continue;
    }
    if (candidate[index] === closingDelimiter) return false;
  }
  return true;
}

interface MarkdownReferenceDefinition {
  label: string;
  target: string;
}

function parseMarkdownReferenceDefinition(
  content: string
): MarkdownReferenceDefinition | null {
  const opener = content.match(/^[ \t]{0,3}\[/);
  if (!opener) return null;
  const label = parseMarkdownBracketLabel(content, opener[0].length);
  if (
    !label ||
    label.label.startsWith('^') ||
    content[label.endIndex] !== ':'
  ) {
    return null;
  }

  let index = label.endIndex + 1;
  while (content[index] === ' ' || content[index] === '\t') index++;
  if (content[index] === '\r' && content[index + 1] === '\n') {
    index += 2;
    while (content[index] === ' ' || content[index] === '\t') index++;
  } else if (content[index] === '\n') {
    index++;
    while (content[index] === ' ' || content[index] === '\t') index++;
  }
  const targetStartIndex = index;
  if (content[index] === '<') {
    index++;
    while (index < content.length && content[index] !== '>') index++;
    if (content[index] !== '>') return null;
    index++;
  } else {
    let parenthesisDepth = 0;
    while (index < content.length && !/\s/.test(content[index])) {
      if (content[index] === '\\') {
        index += 2;
        continue;
      }
      if (content[index] === '(') {
        parenthesisDepth++;
      } else if (content[index] === ')') {
        if (parenthesisDepth === 0) return null;
        parenthesisDepth--;
      }
      index++;
    }
    if (parenthesisDepth !== 0) return null;
  }
  if (index === targetStartIndex) return null;

  const target = content.slice(targetStartIndex, index);
  const remainder = content.slice(index).trim();
  if (
    remainder !== '' &&
    !/^(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\))$/.test(
      remainder
    )
  ) {
    return null;
  }
  return { label: label.label, target };
}

function mapMarkdownReferenceUses(
  content: string,
  transformsByLabel: ReadonlyMap<string, MediaReferenceTransform>
): string {
  const openerPattern = /(!?)\[/g;
  let transformed = '';
  let retainedUntil = 0;
  let match: RegExpExecArray | null;

  while ((match = openerPattern.exec(content)) !== null) {
    if (
      isBackslashEscaped(content, match.index) ||
      content[openerPattern.lastIndex] === '['
    ) {
      continue;
    }
    const label = parseMarkdownBracketLabel(content, openerPattern.lastIndex);
    if (!label || label.label.startsWith('^')) continue;

    let referenceLabel = label.label;
    let referenceEndIndex = label.endIndex;
    if (content[label.endIndex] === '[') {
      const explicitReferenceLabel = parseMarkdownBracketLabel(
        content,
        label.endIndex + 1
      );
      if (!explicitReferenceLabel) continue;
      referenceLabel = explicitReferenceLabel.label || label.label;
      referenceEndIndex = explicitReferenceLabel.endIndex;
    } else if (
      content[label.endIndex] === '(' ||
      content[label.endIndex] === ':' ||
      content[match.index - 1] === '[' ||
      content[match.index - 1] === ']'
    ) {
      continue;
    }

    if (referenceLabel.startsWith('^')) continue;

    const result = transformsByLabel.get(
      normalizeMarkdownReferenceLabel(referenceLabel)
    );
    if (!result || result.kind !== 'remove') continue;

    transformed += content.slice(retainedUntil, match.index);
    transformed += match[1] ? '' : label.label;
    retainedUntil = referenceEndIndex;
    openerPattern.lastIndex = referenceEndIndex;
  }

  return retainedUntil === 0
    ? content
    : transformed + content.slice(retainedUntil);
}



function mapExtendedMarkdownReferenceLinks(
  content: string,
  transform: (target: string) => MediaReferenceTransform,
  recognizedRanges: readonly SourceRange[],
  initialTransformsByLabel: ReadonlyMap<string, MediaReferenceTransform>
): string {
  const transformsByLabel = new Map<string, MediaReferenceTransform>();
  const lines = content.match(/[^\n]*(?:\n|$)/g)?.filter(Boolean) ?? [];
  const lineOffsets: number[] = [];
  let nextLineOffset = 0;
  for (const line of lines) {
    lineOffsets.push(nextLineOffset);
    nextLineOffset += line.length;
  }
  const lineAnalyses = analyzeMarkdownLines(lines);
  const removedContinuationLines = new Set<number>();
  const rewrittenContinuationLines = new Map<number, string>();
  const acceptedDefinitionLines = new Set<number>();
  const withDefinitions = lines
    .map((line, index) => {
      const lineEnding = line.match(/\r?\n$/)?.[0] ?? '';
      if (removedContinuationLines.has(index)) return lineEnding;
      const rewrittenContinuationLine = rewrittenContinuationLines.get(index);
      if (rewrittenContinuationLine !== undefined) {
        return rewrittenContinuationLine;
      }

      const lineWithoutEnding = line.slice(0, line.length - lineEnding.length);
      const lineAnalysis = lineAnalyses[index];
      const previousLineAnalysis = lineAnalyses[index - 1];
      const interruptsActiveParagraph =
        !acceptedDefinitionLines.has(index - 1) &&
        previousLineAnalysis?.isParagraphLine === true &&
        previousLineAnalysis.blockquoteDepth === lineAnalysis.blockquoteDepth &&
        previousLineAnalysis.activeListContentIndent ===
          lineAnalysis.activeListContentIndent &&
        lineAnalysis.listItemMarkerLength === 0;
      if (interruptsActiveParagraph) return line;
      const definitionContent = stripMarkdownContainerPrefix(lineAnalysis);
      let definition = parseMarkdownReferenceDefinition(definitionContent);
      let targetLineIndex = index;
      if (!definition) {
        let continuedDefinitionContent = definitionContent;
        for (
          let continuationLineIndex = index + 1;
          continuationLineIndex < lineAnalyses.length;
          continuationLineIndex++
        ) {
          const nextLineAnalysis = lineAnalyses[continuationLineIndex];
          const nextLineContent =
            stripMarkdownContainerPrefix(nextLineAnalysis);
          if (
            nextLineContent.trim() === '' ||
            nextLineAnalysis.blockquoteDepth !== lineAnalysis.blockquoteDepth ||
            nextLineAnalysis.activeListContentIndent !==
              lineAnalysis.activeListContentIndent
          ) {
            break;
          }
          continuedDefinitionContent += `\n${nextLineContent}`;
          definition = parseMarkdownReferenceDefinition(
            continuedDefinitionContent
          );
          if (definition) {
            targetLineIndex = continuationLineIndex;
            break;
          }
        }
      }
      if (!definition) return line;
      for (
        let definitionLineIndex = index;
        definitionLineIndex <= targetLineIndex;
        definitionLineIndex++
      ) {
        acceptedDefinitionLines.add(definitionLineIndex);
      }
      const continuationTitleLineIndex = targetLineIndex + 1;
      const continuationTitleLineAnalysis =
        lineAnalyses[continuationTitleLineIndex];
      if (
        continuationTitleLineAnalysis &&
        continuationTitleLineAnalysis.blockquoteDepth ===
          lineAnalysis.blockquoteDepth &&
        continuationTitleLineAnalysis.activeListContentIndent ===
          lineAnalysis.activeListContentIndent &&
        isMarkdownReferenceContinuationTitle(
          stripMarkdownContainerPrefix(continuationTitleLineAnalysis)
        )
      ) {
        acceptedDefinitionLines.add(continuationTitleLineIndex);
      }

      const removeDefinition = (): string => {
        for (
          let definitionLineIndex = index + 1;
          definitionLineIndex <= targetLineIndex;
          definitionLineIndex++
        ) {
          removedContinuationLines.add(definitionLineIndex);
        }
        const titleLineIndex = targetLineIndex + 1;
        const nextLineAnalysis = lineAnalyses[titleLineIndex];
        if (
          nextLineAnalysis &&
          nextLineAnalysis.blockquoteDepth === lineAnalysis.blockquoteDepth &&
          nextLineAnalysis.activeListContentIndent ===
            lineAnalysis.activeListContentIndent
        ) {
          const continuationContent =
            stripMarkdownContainerPrefix(nextLineAnalysis);
          if (isMarkdownReferenceContinuationTitle(continuationContent)) {
            removedContinuationLines.add(titleLineIndex);
          }
        }
        return lineEnding;
      };

      const { label, target } = definition;
      const targetLine = lines[targetLineIndex];
      const targetLineEnding = targetLine.match(/\r?\n$/)?.[0] ?? '';
      const targetLineWithoutEnding = targetLine.slice(
        0,
        targetLine.length - targetLineEnding.length
      );
      const targetSearchStart =
        targetLineIndex === index ? lineWithoutEnding.indexOf(']:') + 2 : 0;
      const targetIndex = targetLineWithoutEnding.indexOf(
        target,
        targetSearchStart
      );
      if (targetIndex === -1) return line;
      const absoluteTargetIndex = lineOffsets[targetLineIndex] + targetIndex;
      if (
        isCoveredBySourceRange(
          absoluteTargetIndex,
          absoluteTargetIndex + target.length,
          recognizedRanges
        )
      ) {
        return line;
      }

      const normalizedLabel = normalizeMarkdownReferenceLabel(label);
      const existingTransform = transformsByLabel.get(normalizedLabel);
      if (existingTransform) {
        return existingTransform.kind === 'remove' ? removeDefinition() : line;
      }

      const result = transform(target);
      transformsByLabel.set(normalizedLabel, result);
      if (result.kind === 'keep') return line;
      if (result.kind === 'remove') return removeDefinition();

      if (targetLineIndex !== index) {
        rewrittenContinuationLines.set(
          targetLineIndex,
          `${targetLineWithoutEnding.slice(0, targetIndex)}${formatRewrittenMarkdownTarget(target, result.target, result.suffix)}${targetLineWithoutEnding.slice(targetIndex + target.length)}${targetLineEnding}`
        );
        return line;
      }

      return `${lineWithoutEnding.slice(0, targetIndex)}${formatRewrittenMarkdownTarget(target, result.target, result.suffix)}${lineWithoutEnding.slice(targetIndex + target.length)}${lineEnding}`;
    })
    .join('');

  const transformsForUses = new Map(initialTransformsByLabel);
  for (const [label, result] of transformsByLabel) {
    transformsForUses.set(label, result);
  }
  return mapMarkdownReferenceUses(withDefinitions, transformsForUses);
}

export function mapMarkdownTradeNoteMediaReferences(
  content: string,
  transform: (target: string) => MediaReferenceTransform
): string {
  const withReferenceLinks = mapMarkdownReferenceLinks(content, transform);
  const withWikiLinks = withReferenceLinks.replace(
    /(!?)\[\[([^\]]+)\]\]/g,
    (match, embedMarker: string, linkText: string, offset: number) => {
      if (isBackslashEscaped(withReferenceLinks, offset)) return match;
      const aliasIndex = linkText.indexOf('|');
      const targetWithSubpath =
        aliasIndex === -1 ? linkText : linkText.slice(0, aliasIndex);
      const alias = aliasIndex === -1 ? '' : linkText.slice(aliasIndex);
      const subpathIndex = targetWithSubpath.indexOf('#');
      const target =
        subpathIndex === -1
          ? targetWithSubpath
          : targetWithSubpath.slice(0, subpathIndex);
      const subpath =
        subpathIndex === -1 ? '' : targetWithSubpath.slice(subpathIndex);
      const result = transform(target.trim());
      if (result.kind === 'keep') return match;
      if (result.kind === 'remove') {
        return embedMarker ? '' : alias.slice(1).trim();
      }
      return `${embedMarker}[[${formatRewrittenWikiTarget(result.target, result.suffix)}${subpath}${alias}]]`;
    }
  );
  return mapMarkdownInlineLinks(withWikiLinks, transform);
}
