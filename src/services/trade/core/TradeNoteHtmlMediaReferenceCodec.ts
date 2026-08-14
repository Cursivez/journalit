import { isBackslashEscaped } from './MarkdownContentParser';
import type { MediaReferenceTransform } from './TradeNoteMediaReferenceTypes';

function escapeHtmlAttributeValue(value: string, quote: string): string {
  const escapedAmpersands = value.replace(/&/g, '&amp;');
  return quote === "'"
    ? escapedAmpersands.replace(/'/g, '&#39;')
    : escapedAmpersands.replace(/"/g, '&quot;');
}

function serializeRewrittenHtmlMediaTarget(
  target: string,
  originalQuote?: string
): string {
  if (originalQuote) {
    return `${originalQuote}${escapeHtmlAttributeValue(target, originalQuote)}${originalQuote}`;
  }
  if (!/[\s"'=<>`&]/.test(target)) {
    return target;
  }
  return `"${escapeHtmlAttributeValue(target, '"')}"`;
}

interface HtmlMediaAttribute {
  name: 'src' | 'srcset';
  startIndex: number;
  endIndex: number;
  valueStartIndex: number;
  valueEndIndex: number;
  target: string;
  quote?: string;
}

function findHtmlTagEnd(content: string, startIndex: number): number {
  let quote: string | undefined;
  for (let index = startIndex; index < content.length; index++) {
    const character = content[index];
    if (quote) {
      if (character === quote) quote = undefined;
      continue;
    }
    if (character === '"' || character === "'") {
      quote = character;
    } else if (character === '>') {
      return index;
    }
  }
  return -1;
}

function findHtmlMediaAttributes(
  tag: string,
  tagName: string,
  tagNameEndIndex: number
): HtmlMediaAttribute[] {
  const attributes: HtmlMediaAttribute[] = [];
  let index = tagNameEndIndex;
  while (index < tag.length - 1) {
    const whitespaceStart = index;
    while (/\s/.test(tag[index] ?? '')) index++;
    if (tag[index] === '/' || tag[index] === '>') break;

    const attributeNameStart = index;
    while (index < tag.length && !/[\s=/>]/.test(tag[index])) index++;
    if (index === attributeNameStart) {
      index++;
      continue;
    }
    const attributeName = tag.slice(attributeNameStart, index).toLowerCase();
    const attributeNameEnd = index;
    while (/\s/.test(tag[index] ?? '')) index++;
    if (tag[index] !== '=') {
      index = attributeNameEnd;
      continue;
    }
    index++;
    while (/\s/.test(tag[index] ?? '')) index++;

    const valueStartIndex = index;
    const quote =
      tag[index] === '"' || tag[index] === "'" ? tag[index] : undefined;
    if (quote) {
      index++;
      const targetStartIndex = index;
      while (index < tag.length && tag[index] !== quote) index++;
      if (tag[index] !== quote) return [];
      const target = tag.slice(targetStartIndex, index);
      index++;
      if (
        attributeName === 'src' ||
        (attributeName === 'srcset' &&
          (tagName === 'img' || tagName === 'source'))
      ) {
        attributes.push({
          name: attributeName,
          startIndex: whitespaceStart,
          endIndex: index,
          valueStartIndex,
          valueEndIndex: index,
          target,
          quote,
        });
      }
      continue;
    }

    const targetStartIndex = index;
    while (index < tag.length && !/[\s"'=<>`]/.test(tag[index])) index++;
    const target = tag.slice(targetStartIndex, index);
    if (
      attributeName === 'src' ||
      (attributeName === 'srcset' &&
        (tagName === 'img' || tagName === 'source'))
    ) {
      attributes.push({
        name: attributeName,
        startIndex: whitespaceStart,
        endIndex: index,
        valueStartIndex,
        valueEndIndex: index,
        target,
      });
    }
  }
  return attributes;
}

interface SrcsetCandidate {
  startIndex: number;
  endIndex: number;
  targetStartIndex: number;
  targetEndIndex: number;
  target: string;
}

function parseSrcsetCandidates(value: string): SrcsetCandidate[] {
  const candidates: SrcsetCandidate[] = [];
  let index = 0;
  while (index < value.length) {
    while (index < value.length && /[\s,]/.test(value[index])) index++;
    if (index >= value.length) break;

    const startIndex = index;
    const targetStartIndex = index;
    const isDataUrl = value.slice(index, index + 5).toLowerCase() === 'data:';
    while (
      index < value.length &&
      !/\s/.test(value[index]) &&
      (isDataUrl || value[index] !== ',')
    ) {
      index++;
    }
    const targetEndIndex = index;
    let parenthesisDepth = 0;
    while (index < value.length) {
      const character = value[index];
      if (character === '(') parenthesisDepth++;
      if (character === ')' && parenthesisDepth > 0) parenthesisDepth--;
      if (character === ',' && parenthesisDepth === 0) break;
      index++;
    }
    const endIndex = index;
    if (value[index] === ',') index++;

    candidates.push({
      startIndex,
      endIndex,
      targetStartIndex,
      targetEndIndex,
      target: value.slice(targetStartIndex, targetEndIndex),
    });
  }
  return candidates;
}

interface HtmlAttributeTransform {
  kind: 'keep' | 'replace' | 'remove';
  replacement?: string;
}

function transformSrcsetAttribute(
  attribute: HtmlMediaAttribute,
  transform: (target: string) => MediaReferenceTransform
): HtmlAttributeTransform {
  const candidates = parseSrcsetCandidates(attribute.target);
  if (candidates.length === 0) return { kind: 'keep' };

  const retainedCandidates: string[] = [];
  let changed = false;
  for (const candidate of candidates) {
    const result = transform(candidate.target);
    if (result.kind === 'remove') {
      changed = true;
      continue;
    }
    const candidateText = attribute.target.slice(
      candidate.startIndex,
      candidate.endIndex
    );
    if (result.kind === 'keep') {
      retainedCandidates.push(candidateText);
      continue;
    }
    changed = true;
    const rewrittenTarget = `${result.target}${result.suffix ?? ''}`;
    retainedCandidates.push(
      `${candidateText.slice(0, candidate.targetStartIndex - candidate.startIndex)}${rewrittenTarget}${candidateText.slice(candidate.targetEndIndex - candidate.startIndex)}`
    );
  }

  if (!changed) return { kind: 'keep' };
  if (retainedCandidates.length === 0) return { kind: 'remove' };
  const value = retainedCandidates.join(', ');
  return {
    kind: 'replace',
    replacement: serializeRewrittenHtmlMediaTarget(value, attribute.quote),
  };
}

export function mapHtmlMediaElements(
  content: string,
  transform: (target: string) => MediaReferenceTransform
): string {
  const tagPattern = /<\/?([a-z][\w-]*)/gi;
  const mediaTagNames = new Set(['audio', 'img', 'video', 'source']);
  let transformed = '';
  let retainedUntil = 0;
  let match: RegExpExecArray | null;

  while ((match = tagPattern.exec(content)) !== null) {
    if (isBackslashEscaped(content, match.index)) continue;
    const characterAfterTagName = content[tagPattern.lastIndex];
    if (
      characterAfterTagName !== '>' &&
      characterAfterTagName !== '/' &&
      !/\s/.test(characterAfterTagName ?? '')
    ) {
      continue;
    }
    const tagEndIndex = findHtmlTagEnd(content, tagPattern.lastIndex);
    if (tagEndIndex === -1) break;
    const tagName = match[1].toLowerCase();
    if (match[0][1] === '/' || !mediaTagNames.has(tagName)) {
      tagPattern.lastIndex = tagEndIndex + 1;
      continue;
    }
    const tag = content.slice(match.index, tagEndIndex + 1);
    const mediaAttributes = findHtmlMediaAttributes(
      tag,
      tagName,
      match[0].length
    );
    if (mediaAttributes.length === 0) {
      tagPattern.lastIndex = tagEndIndex + 1;
      continue;
    }

    const attributeTransforms = mediaAttributes.map((attribute) => {
      if (attribute.name === 'srcset') {
        return transformSrcsetAttribute(attribute, transform);
      }
      const result = transform(attribute.target);
      return result.kind === 'rewrite'
        ? {
            kind: 'replace' as const,
            replacement: serializeRewrittenHtmlMediaTarget(
              `${result.target}${result.suffix ?? ''}`,
              attribute.quote
            ),
          }
        : result;
    });
    if (attributeTransforms.every((result) => result.kind === 'keep')) {
      tagPattern.lastIndex = tagEndIndex + 1;
      continue;
    }

    transformed += content.slice(retainedUntil, match.index);
    const hasRetainedMediaAttribute = attributeTransforms.some(
      (result) => result.kind !== 'remove'
    );
    if (
      !hasRetainedMediaAttribute &&
      tagName !== 'audio' &&
      tagName !== 'video'
    ) {
      
      
      transformed += ' ';
    } else {
      let rewrittenTag = '';
      let attributeOffset = 0;
      for (let index = 0; index < mediaAttributes.length; index++) {
        const attribute = mediaAttributes[index];
        const result = attributeTransforms[index];
        rewrittenTag += tag.slice(attributeOffset, attribute.startIndex);
        if (result.kind === 'keep') {
          rewrittenTag += tag.slice(attribute.startIndex, attribute.endIndex);
        } else if (result.kind === 'replace') {
          rewrittenTag += `${tag.slice(attribute.startIndex, attribute.valueStartIndex)}${result.replacement}`;
        }
        attributeOffset = attribute.endIndex;
      }
      transformed += rewrittenTag + tag.slice(attributeOffset);
    }
    retainedUntil = tagEndIndex + 1;
    tagPattern.lastIndex = retainedUntil;
  }

  return retainedUntil === 0
    ? content
    : transformed + content.slice(retainedUntil);
}

export function mapOutsideHtmlTags(
  content: string,
  transform: (contentOutsideTags: string) => string
): string {
  const protectedTags: string[] = [];
  const tagStartPattern = /<\/?[a-z][\w-]*/gi;
  let protectedContent = '';
  let retainedUntil = 0;
  let match: RegExpExecArray | null;

  while ((match = tagStartPattern.exec(content)) !== null) {
    if (isBackslashEscaped(content, match.index)) continue;
    const characterAfterTagName = content[tagStartPattern.lastIndex];
    if (
      characterAfterTagName !== '>' &&
      characterAfterTagName !== '/' &&
      !/\s/.test(characterAfterTagName ?? '')
    ) {
      continue;
    }
    const tagEndIndex = findHtmlTagEnd(content, tagStartPattern.lastIndex);
    if (tagEndIndex === -1) break;
    const token = `\u0000JOURNALIT_HTML_TAG_${protectedTags.length}\u0000`;
    protectedTags.push(content.slice(match.index, tagEndIndex + 1));
    protectedContent += content.slice(retainedUntil, match.index);
    protectedContent += token;
    retainedUntil = tagEndIndex + 1;
    tagStartPattern.lastIndex = retainedUntil;
  }

  protectedContent += content.slice(retainedUntil);
  let transformed = transform(protectedContent);
  for (let index = protectedTags.length - 1; index >= 0; index--) {
    transformed = transformed.replaceAll(
      `\u0000JOURNALIT_HTML_TAG_${index}\u0000`,
      () => protectedTags[index]
    );
  }
  return transformed;
}
