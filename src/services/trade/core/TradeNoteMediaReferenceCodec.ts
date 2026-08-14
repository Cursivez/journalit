import { normalizePath } from 'obsidian';
import { decodeHTMLStrict } from 'entities';
import {
  isExternalMediaTarget,
  splitTradeMediaTargetSuffix,
} from './TradeMediaOwnership';
import type { RelocatedManagedTradeMedia } from './TradeMediaRelocation';
import {
  mapOutsideMarkdownBlankLineRawHtmlBlocks,
  mapOutsideMarkdownCodeRegions,
} from './MarkdownContentParser';
import {
  mapHtmlMediaElements,
  mapOutsideHtmlTags,
} from './TradeNoteHtmlMediaReferenceCodec';
import { mapMarkdownTradeNoteMediaReferences } from './TradeNoteMarkdownMediaReferenceCodec';
import type { MediaReferenceTransform } from './TradeNoteMediaReferenceTypes';

function decodeHtmlCharacterReferences(value: string): string {
  return decodeHTMLStrict(value);
}

function normalizeMediaReferenceTarget(target: string): string {
  const unwrapped = decodeHtmlCharacterReferences(
    target.trim().replace(/^<|>$/g, '')
  );
  const decodeMarkdownPunctuationEscapes = (value: string): string =>
    value.replace(/\\([!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])/g, '$1');
  try {
    return decodeMarkdownPunctuationEscapes(decodeURIComponent(unwrapped));
  } catch {
    return decodeMarkdownPunctuationEscapes(unwrapped);
  }
}

function normalizeMediaReferenceTargetWithSuffix(target: string): {
  path: string;
  suffix: string;
} {
  const unwrappedTarget = decodeHtmlCharacterReferences(
    target.trim().replace(/^<|>$/g, '')
  );
  const { path, suffix } = splitTradeMediaTargetSuffix(unwrappedTarget);
  return { path: normalizeMediaReferenceTarget(path), suffix };
}

function mapRenderedTradeNoteMediaReferences(
  content: string,
  transform: (target: string) => MediaReferenceTransform
): string {
  const withHtmlMedia = mapHtmlMediaElements(content, transform);
  return mapOutsideMarkdownBlankLineRawHtmlBlocks(
    withHtmlMedia,
    (markdownContent) =>
      mapOutsideHtmlTags(markdownContent, (contentOutsideTags) =>
        mapMarkdownTradeNoteMediaReferences(contentOutsideTags, transform)
      )
  );
}

function mapTradeNoteMediaReferences(
  content: string,
  transform: (target: string) => MediaReferenceTransform
): string {
  return mapOutsideMarkdownCodeRegions(
    content,
    (renderedContent) =>
      mapRenderedTradeNoteMediaReferences(renderedContent, transform),
    { protectBlankLineRawHtmlBlocks: false }
  );
}

function removeVacatedMediaLines(
  original: string,
  transformed: string
): string {
  const originalLines = original.split('\n');
  const transformedLines = transformed.split('\n');
  if (originalLines.length !== transformedLines.length) return transformed;

  const vacatedLineIndexes = new Set<number>();
  for (let index = 0; index < originalLines.length; index++) {
    const originalContent = originalLines[index];
    const transformedContent = transformedLines[index];
    if (
      originalContent.trim() !== '' &&
      transformedContent.trim() === '' &&
      originalContent !== transformedContent
    ) {
      vacatedLineIndexes.add(index);
    }
  }

  const retainedContentIndexes: number[] = [];
  for (let index = 0; index < transformedLines.length; index++) {
    if (
      !vacatedLineIndexes.has(index) &&
      transformedLines[index].trim() !== ''
    ) {
      retainedContentIndexes.push(index);
    }
  }
  if (retainedContentIndexes.length === 0) return '';

  const cleanedLines: string[] = [];
  const firstContentIndex = retainedContentIndexes[0];
  const leadingVacated = Array.from(vacatedLineIndexes).some(
    (index) => index < firstContentIndex
  );
  if (!leadingVacated) {
    cleanedLines.push(...transformedLines.slice(0, firstContentIndex));
  }
  cleanedLines.push(transformedLines[firstContentIndex]);

  const blankLine = original.includes('\r\n') ? '\r' : '';
  for (let index = 1; index < retainedContentIndexes.length; index++) {
    const previousContentIndex = retainedContentIndexes[index - 1];
    const contentIndex = retainedContentIndexes[index];
    const vacatedThisGap = Array.from(vacatedLineIndexes).some(
      (lineIndex) =>
        lineIndex > previousContentIndex && lineIndex < contentIndex
    );
    if (vacatedThisGap) {
      cleanedLines.push(blankLine);
    } else {
      cleanedLines.push(
        ...transformedLines.slice(previousContentIndex + 1, contentIndex)
      );
    }
    cleanedLines.push(transformedLines[contentIndex]);
  }

  const lastContentIndex =
    retainedContentIndexes[retainedContentIndexes.length - 1];
  const trailingVacated = Array.from(vacatedLineIndexes).some(
    (index) => index > lastContentIndex
  );
  if (!trailingVacated) {
    cleanedLines.push(...transformedLines.slice(lastContentIndex + 1));
  }
  return cleanedLines.join('\n');
}


export function removeTradeNoteMediaReferences(
  notes: string | undefined,
  removedMediaPaths: ReadonlySet<string>,
  resolveMediaPath?: (target: string) => string | undefined
): string | undefined {
  if (!notes || removedMediaPaths.size === 0) {
    return notes;
  }

  const normalizedRemovedPaths = new Set(
    Array.from(removedMediaPaths, normalizeMediaReferenceTarget)
  );
  const shouldRemove = (target: string): boolean => {
    const normalizedTarget =
      normalizeMediaReferenceTargetWithSuffix(target).path;
    if (normalizedRemovedPaths.has(normalizedTarget)) {
      return true;
    }

    const resolvedPath = resolveMediaPath?.(normalizedTarget);
    return resolvedPath
      ? normalizedRemovedPaths.has(normalizeMediaReferenceTarget(resolvedPath))
      : false;
  };

  const withoutRemovedMedia = mapTradeNoteMediaReferences(notes, (target) =>
    shouldRemove(target) ? { kind: 'remove' } : { kind: 'keep' }
  );
  if (withoutRemovedMedia === notes) return notes;

  const cleaned = removeVacatedMediaLines(notes, withoutRemovedMedia);
  return cleaned.trim().length > 0 ? cleaned : undefined;
}

function normalizeVaultMediaPath(path: string): string {
  const segments: string[] = [];
  for (const segment of normalizePath(path).split('/')) {
    if (!segment || segment === '.') {
      continue;
    }
    if (segment === '..') {
      segments.pop();
      continue;
    }
    segments.push(segment);
  }
  return segments.join('/');
}


export function snapshotTradeNoteMediaReferenceResolutions(
  content: string,
  resolveMediaPath: (target: string) => string | undefined,
  contentKind: 'document' | 'notes'
): ReadonlyMap<string, string> {
  const resolutions = new Map<string, string>();
  const frontmatterEndIndex =
    contentKind === 'document' ? findFrontmatterEndIndex(content) : -1;
  const bodyStart = frontmatterEndIndex === -1 ? 0 : frontmatterEndIndex;

  mapTradeNoteMediaReferences(content.slice(bodyStart), (target) => {
    const { path: normalizedPath, suffix } =
      normalizeMediaReferenceTargetWithSuffix(target);
    const normalizedTarget = `${normalizedPath}${suffix}`;
    const resolvedPath = resolveMediaPath(normalizedPath);
    if (resolvedPath) {
      resolutions.set(normalizedTarget, resolvedPath);
    }
    return { kind: 'keep' };
  });

  return resolutions;
}


export function rewriteTradeNoteMediaReferences(
  content: string,
  relocatedMedia: readonly RelocatedManagedTradeMedia[],
  resolvedOriginalReferences?: ReadonlyMap<string, string>,
  resolveCurrentMediaPath?: (target: string) => string | undefined
): string {
  if (relocatedMedia.length === 0) {
    return content;
  }

  const relocations = relocatedMedia.map(({ sourcePath, destinationPath }) => ({
    sourcePath: normalizeVaultMediaPath(sourcePath),
    destinationPath: normalizeVaultMediaPath(destinationPath),
  }));
  const uniqueSourceBasenames = new Map<string, string | null>();
  const uniqueDestinationBasenames = new Map<string, string | null>();
  for (const relocation of relocations) {
    const sourceBasename = relocation.sourcePath.split('/').pop() ?? '';
    const destinationBasename =
      relocation.destinationPath.split('/').pop() ?? '';
    uniqueSourceBasenames.set(
      sourceBasename,
      uniqueSourceBasenames.has(sourceBasename)
        ? null
        : relocation.destinationPath
    );
    uniqueDestinationBasenames.set(
      destinationBasename,
      uniqueDestinationBasenames.has(destinationBasename)
        ? null
        : relocation.destinationPath
    );
  }

  const rewriteTarget = (
    target: string
  ): { target: string; suffix?: string } | null => {
    const { path: mediaPath, suffix } =
      normalizeMediaReferenceTargetWithSuffix(target);
    if (isExternalMediaTarget(mediaPath)) {
      return null;
    }
    const normalizedTarget = normalizeVaultMediaPath(
      mediaPath.replace(/^\/+/, '')
    );
    for (const relocation of relocations) {
      if (normalizedTarget === relocation.destinationPath) {
        return null;
      }
      if (normalizedTarget === relocation.sourcePath) {
        return { target: relocation.destinationPath, suffix };
      }
    }

    if (resolvedOriginalReferences) {
      const resolvedOriginalPath = resolvedOriginalReferences.get(
        `${mediaPath}${suffix}`
      );
      if (resolvedOriginalPath) {
        const normalizedResolvedPath =
          normalizeVaultMediaPath(resolvedOriginalPath);
        for (const relocation of relocations) {
          if (normalizedResolvedPath === relocation.destinationPath) {
            return null;
          }
          if (normalizedResolvedPath === relocation.sourcePath) {
            return { target: relocation.destinationPath, suffix };
          }
        }
        return null;
      }

      const resolvedCurrentPath = resolveCurrentMediaPath?.(mediaPath);
      if (!resolvedCurrentPath) {
        return null;
      }
      const normalizedCurrentPath =
        normalizeVaultMediaPath(resolvedCurrentPath);
      for (const relocation of relocations) {
        if (
          normalizedCurrentPath === relocation.sourcePath ||
          normalizedCurrentPath === relocation.destinationPath
        ) {
          return { target: relocation.destinationPath, suffix };
        }
      }
      return null;
    }

    if (!normalizedTarget.includes('/')) {
      if (uniqueDestinationBasenames.has(normalizedTarget)) {
        const destinationPath =
          uniqueDestinationBasenames.get(normalizedTarget);
        return destinationPath ? { target: destinationPath, suffix } : null;
      }
      const destinationPath = uniqueSourceBasenames.get(normalizedTarget);
      return destinationPath ? { target: destinationPath, suffix } : null;
    }

    const pathSuffix = `/${normalizedTarget}`;
    const destinationMatches = relocations.filter(({ destinationPath }) =>
      destinationPath.endsWith(pathSuffix)
    );
    if (destinationMatches.length === 1) {
      return { target: destinationMatches[0].destinationPath, suffix };
    }
    const sourceMatches = relocations.filter(({ sourcePath }) =>
      sourcePath.endsWith(pathSuffix)
    );
    return sourceMatches.length === 1
      ? { target: sourceMatches[0].destinationPath, suffix }
      : null;
  };

  const frontmatterEndIndex = findFrontmatterEndIndex(content);
  const bodyStart = frontmatterEndIndex === -1 ? 0 : frontmatterEndIndex;
  const documentPrefix = content.slice(0, bodyStart);
  const rewrittenBody = mapTradeNoteMediaReferences(
    content.slice(bodyStart),
    (target) => {
      const destination = rewriteTarget(target);
      return destination
        ? { kind: 'rewrite', ...destination }
        : { kind: 'keep' };
    }
  );
  return `${documentPrefix}${rewrittenBody}`;
}

function findFrontmatterEndIndex(content: string): number {
  if (!content.startsWith('---')) {
    return -1;
  }

  const lines = content.split('\n');
  let offset = lines[0].length;

  for (let index = 1; index < lines.length; index++) {
    offset += 1 + lines[index].length;
    if (lines[index].replace(/\r$/, '') === '---') {
      return offset;
    }
  }

  return -1;
}
