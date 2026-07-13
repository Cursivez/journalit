export const USER_OWNED_TRADE_CONTENT_MARKER = '<!-- User Notes Below -->';
const LEGACY_GENERATED_NOTES_MARKER = '<!-- Legacy Generated Notes -->';
const TRADE_REVIEW_HEADING_PATTERN = /^##\s+Trade Review\s*$/gm;
const TRADE_REVIEW_MARKER_PATTERN = /<!--\s*journalit-trade-review:/;
const TRADE_REVIEW_END_PATTERN =
  /<!--\s*journalit-trade-review:end\s*-->(?:\s*\n---\s*\n_End Trade Review_\s*)?/;

export function createTradeNotesDocument(
  frontmatterYaml: string,
  notes?: string
): string {
  return [
    frontmatterYaml,
    '',
    '# Trade Notes',
    '',
    USER_OWNED_TRADE_CONTENT_MARKER,
    ...(notes ? ['', notes] : []),
  ].join('\n');
}

export function ensureTradeNoteOwnershipMarker(content: string): string {
  if (content.includes(USER_OWNED_TRADE_CONTENT_MARKER)) {
    return content;
  }

  const headingPattern = /(# Trade Notes\s*\r?\n\r?\n)/;
  if (headingPattern.test(content)) {
    return content.replace(
      headingPattern,
      `$1${USER_OWNED_TRADE_CONTENT_MARKER}\n\n`
    );
  }

  return `${content}\n\n${USER_OWNED_TRADE_CONTENT_MARKER}`;
}

export function extractDocumentBody(content: string): string {
  const frontmatterEndIndex = findFrontmatterEndIndex(content);
  if (frontmatterEndIndex === -1) {
    return content;
  }

  return content.substring(frontmatterEndIndex);
}

export function extractUserOwnedTradeContent(content: string): string {
  const bodySection = extractDocumentBody(content);
  const markerIndex = bodySection.indexOf(USER_OWNED_TRADE_CONTENT_MARKER);
  if (markerIndex !== -1) {
    const explicitMarkerContent = bodySection.substring(markerIndex);
    const explicitUserText = explicitMarkerContent
      .substring(USER_OWNED_TRADE_CONTENT_MARKER.length)
      .trim();

    if (explicitUserText.length > 0) {
      return explicitMarkerContent;
    }

    const legacyUserContent = extractLegacyUserOwnedTradeContent(
      bodySection.substring(0, markerIndex)
    );
    return legacyUserContent || explicitMarkerContent;
  }

  return extractLegacyUserOwnedTradeContent(bodySection);
}

export function extractUserOwnedTradeNotes(
  content: string
): string | undefined {
  const bodySection = extractDocumentBody(content);
  const markerIndex = bodySection.indexOf(USER_OWNED_TRADE_CONTENT_MARKER);
  if (markerIndex !== -1) {
    const notes = removeGeneratedTradeReviewBlock(
      bodySection.substring(
        markerIndex + USER_OWNED_TRADE_CONTENT_MARKER.length
      )
    ).trim();
    return notes.length > 0 ? notes : undefined;
  }

  const legacyContent = extractLegacyUserOwnedTradeContent(bodySection);
  const notes = extractPreservedUserText(legacyContent).trim();
  return notes.length > 0 ? notes : undefined;
}

function removeGeneratedTradeReviewBlock(notesSection: string): string {
  TRADE_REVIEW_HEADING_PATTERN.lastIndex = 0;
  const matches = Array.from(
    notesSection.matchAll(TRADE_REVIEW_HEADING_PATTERN)
  );

  for (const [index, match] of matches.entries()) {
    const blockEnd = matches[index + 1]?.index ?? notesSection.length;
    const block = notesSection.substring(match.index, blockEnd);
    if (TRADE_REVIEW_MARKER_PATTERN.test(block)) {
      const reviewEndMatch = TRADE_REVIEW_END_PATTERN.exec(block);
      const generatedBlockEnd =
        reviewEndMatch?.index !== undefined
          ? match.index + reviewEndMatch.index + reviewEndMatch[0].length
          : blockEnd;
      return `${notesSection.substring(0, match.index)}${notesSection.substring(generatedBlockEnd)}`;
    }
  }

  return notesSection;
}

function extractLegacyUserOwnedTradeContent(bodySection: string): string {
  const lines = bodySection.split('\n');
  let endOfGeneratedContent = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (
      line.startsWith('Status: Open') ||
      line.startsWith('✅ Profit:') ||
      line.startsWith('❌ Loss:') ||
      line.startsWith('Exit:')
    ) {
      endOfGeneratedContent = i + 1;
    }
  }

  if (endOfGeneratedContent >= lines.length) {
    return '';
  }

  const remainingLines = lines.slice(endOfGeneratedContent);
  const firstMeaningfulLineIndex = remainingLines.findIndex(
    (line) => line.trim() !== ''
  );

  if (
    firstMeaningfulLineIndex !== -1 &&
    remainingLines[firstMeaningfulLineIndex].trim() === 'Notes:'
  ) {
    const noteLines = remainingLines.slice(firstMeaningfulLineIndex + 1);
    const nonEmptyNoteLines = noteLines.filter((line) => line.trim() !== '');
    if (nonEmptyNoteLines.length === 0) {
      return '';
    }
    return `\n\n${LEGACY_GENERATED_NOTES_MARKER}\n\n${noteLines.join('\n')}`;
  }

  const nonEmptyContent = remainingLines.filter((line) => line.trim() !== '');
  if (nonEmptyContent.length > 0) {
    return `\n\n${USER_OWNED_TRADE_CONTENT_MARKER}\n\n${remainingLines.join('\n')}`;
  }

  return '';
}

export function mergeGeneratedTradeDocumentWithUserContent(
  generatedContent: string,
  preservedUserContent: string
): string {
  const markerIndex = generatedContent.indexOf(USER_OWNED_TRADE_CONTENT_MARKER);

  if (!preservedUserContent) {
    return markerIndex === -1
      ? `${generatedContent}\n\n${USER_OWNED_TRADE_CONTENT_MARKER}`
      : generatedContent;
  }

  const preservedUserText = extractPreservedUserText(preservedUserContent);
  const generatedNotesText = extractGeneratedNotesText(generatedContent);
  const isLegacyGeneratedNotes = preservedUserContent.includes(
    LEGACY_GENERATED_NOTES_MARKER
  );
  if (
    isLegacyGeneratedNotes &&
    generatedNotesText &&
    preservedUserText === generatedNotesText
  ) {
    return markerIndex === -1
      ? `${generatedContent}\n\n${USER_OWNED_TRADE_CONTENT_MARKER}`
      : generatedContent;
  }

  if (markerIndex === -1) {
    return generatedContent + preservedUserContent;
  }

  return (
    generatedContent.substring(0, markerIndex) +
    preservedUserContent.trimStart()
  );
}

function extractPreservedUserText(content: string): string {
  const marker = content.includes(USER_OWNED_TRADE_CONTENT_MARKER)
    ? USER_OWNED_TRADE_CONTENT_MARKER
    : content.includes(LEGACY_GENERATED_NOTES_MARKER)
      ? LEGACY_GENERATED_NOTES_MARKER
      : null;

  if (!marker) {
    return content.trim();
  }

  const markerIndex = content.indexOf(marker);
  return content.substring(markerIndex + marker.length).trim();
}

function extractGeneratedNotesText(content: string): string {
  const markerIndex = content.indexOf(USER_OWNED_TRADE_CONTENT_MARKER);
  const relevantContent =
    markerIndex === -1 ? content : content.substring(0, markerIndex);
  const notesIndex = relevantContent.lastIndexOf('\nNotes:\n');

  if (notesIndex === -1) {
    return '';
  }

  return relevantContent.substring(notesIndex + '\nNotes:\n'.length).trim();
}

function findFrontmatterEndIndex(content: string): number {
  if (!content.startsWith('---')) {
    return -1;
  }

  const lines = content.split('\n');
  let offset = lines[0].length;

  for (let i = 1; i < lines.length; i++) {
    offset += 1 + lines[i].length;
    if (lines[i].replace(/\r$/, '') === '---') {
      return offset;
    }
  }

  return -1;
}
