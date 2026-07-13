import type { TradeReviewData } from '../../backend/types';

const TRADE_REVIEW_HEADING = 'Trade Review';
const LEGACY_TRADE_REVIEW_END_HEADING = 'End Trade Review';
const TRADE_REVIEW_END_MARKER = '<!-- journalit-trade-review:end -->';
const TRADE_REVIEW_QUESTION_MARKER_PREFIX =
  '<!-- journalit-trade-review:question ';
const TRADE_REVIEW_END_LABEL = '_End Trade Review_';
const TRADE_REVIEW_END_BLOCK = `${TRADE_REVIEW_END_MARKER}\n---\n${TRADE_REVIEW_END_LABEL}`;

const DEFAULT_QUESTION_LABELS_BY_ID: Record<string, string> = {
  'win-what-worked': 'What worked?',
  'win-repeatable': 'Was this repeatable?',
  'win-key-lesson': 'Key lesson',
  'loss-what-went-wrong': 'What went wrong?',
  'loss-valid-or-mistake': 'Was this a valid loss or a mistake?',
  'loss-avoid-next-time': 'How will you avoid this next time?',
  'be-managed-correctly': 'Was this managed correctly?',
  'be-key-lesson': 'Key lesson',
};

interface HeadingMatch {
  index: number;
  endIndex: number;
  level: number;
  text: string;
}

interface QuestionMarkerMatch {
  index: number;
  endIndex: number;
  questionId: string;
}

interface ReviewQuestionBlockStart {
  questionId: string;
  originalIndex: number;
  start: number;
}

interface ReviewQuestionBlock extends ReviewQuestionBlockStart {
  end: number;
  text: string;
}

function getTradeReviewQuestionLabel(questionId: string): string {
  return (
    DEFAULT_QUESTION_LABELS_BY_ID[questionId] ?? humanizeQuestionId(questionId)
  );
}

function createQuestionMarker(questionId: string): string {
  return `${TRADE_REVIEW_QUESTION_MARKER_PREFIX}id="${questionId.replace(/"/g, '&quot;')}" -->`;
}

function extractQuestionIdFromAnswerBlock(answerBlock: string): string | null {
  const markerMatch = answerBlock.match(
    /<!--\s*journalit-trade-review:question\s+id="([^"]+)"\s*-->/
  );
  return markerMatch?.[1]?.replace(/&quot;/g, '"') ?? null;
}

function removeQuestionMarker(answerBlock: string): string {
  return answerBlock.replace(
    /<!--\s*journalit-trade-review:question\s+id="[^"]+"\s*-->\s*/,
    ''
  );
}

function findQuestionHeadingById(
  content: string,
  questionId: string,
  startIndex: number,
  endIndex: number
): HeadingMatch | null {
  const marker = findQuestionMarkersInRange(content, startIndex, endIndex).find(
    (candidate) => candidate.questionId === questionId
  );
  if (!marker) return null;
  return findNearestHeadingBefore(content, marker.index, startIndex, 3);
}

function isDefaultQuestionLabel(label: string): boolean {
  return Object.values(DEFAULT_QUESTION_LABELS_BY_ID).some(
    (defaultLabel) => normalizeHeading(defaultLabel) === normalizeHeading(label)
  );
}

function findDefaultQuestionHeadingsInRange(
  content: string,
  start: number,
  end: number
): HeadingMatch[] {
  return findHeadingsInRange(content, start, end, 3).filter((heading) =>
    isDefaultQuestionLabel(heading.text)
  );
}

export function parseTradeReviewMarkdown(
  content: string
): TradeReviewData | undefined {
  const reviewHeading = findOwnedTradeReviewHeading(content);
  if (!reviewHeading) return undefined;

  const reviewEnd = findReviewBoundary(content, reviewHeading.endIndex, 2);
  const reviewBodyEnd = reviewEnd?.index ?? content.length;
  const sections: TradeReviewData['sections'] = {};
  const markers = findQuestionMarkersInRange(
    content,
    reviewHeading.endIndex,
    reviewBodyEnd
  );

  if (markers.length > 0) {
    const defaultQuestionHeadings = findDefaultQuestionHeadingsInRange(
      content,
      reviewHeading.endIndex,
      reviewBodyEnd
    );
    let nextDefaultQuestionIndex = 0;

    for (const [index, marker] of markers.entries()) {
      const nextMarker = markers[index + 1];
      const nextQuestionHeading = nextMarker
        ? findNearestHeadingBefore(
            content,
            nextMarker.index,
            marker.endIndex,
            3
          )
        : null;
      while (
        nextDefaultQuestionIndex < defaultQuestionHeadings.length &&
        defaultQuestionHeadings[nextDefaultQuestionIndex].index <=
          marker.endIndex
      ) {
        nextDefaultQuestionIndex += 1;
      }
      const nextDefaultQuestionHeading =
        defaultQuestionHeadings[nextDefaultQuestionIndex];
      const answerEnd = Math.min(
        nextQuestionHeading?.index ?? reviewBodyEnd,
        nextDefaultQuestionHeading?.index ?? reviewBodyEnd,
        reviewBodyEnd
      );
      const rawAnswer = content.slice(marker.endIndex, answerEnd).trim();
      sections[marker.questionId] = {
        textAreas: { [marker.questionId]: rawAnswer },
      };
    }

    let markerIndex = 0;
    for (const [index, heading] of defaultQuestionHeadings.entries()) {
      const nextHeading = defaultQuestionHeadings[index + 1];
      const answerStart = heading.endIndex;
      const answerEnd = nextHeading?.index ?? reviewBodyEnd;
      while (
        markerIndex < markers.length &&
        markers[markerIndex].index < heading.index
      ) {
        markerIndex += 1;
      }
      if (
        markerIndex < markers.length &&
        markers[markerIndex].index < answerEnd
      ) {
        continue;
      }

      const rawAnswer = content.slice(answerStart, answerEnd).trim();
      sections[heading.text] = { textAreas: { [heading.text]: rawAnswer } };
    }

    return Object.keys(sections).length > 0 ? { sections } : undefined;
  }

  const questionHeadings = findHeadingsInRange(
    content,
    reviewHeading.endIndex,
    reviewBodyEnd,
    3
  );

  for (const [index, heading] of questionHeadings.entries()) {
    const nextHeading = questionHeadings[index + 1];
    const answerStart = heading.endIndex;
    const answerEnd = nextHeading?.index ?? reviewBodyEnd;
    const rawAnswer = content.slice(answerStart, answerEnd).trim();
    const questionId = extractQuestionIdFromAnswerBlock(rawAnswer);
    const answer = removeQuestionMarker(rawAnswer).trim();
    const sectionId = questionId ?? heading.text;
    sections[sectionId] = { textAreas: { [sectionId]: answer } };
  }

  return Object.keys(sections).length > 0 ? { sections } : undefined;
}

export function upsertTradeReviewMarkdownQuestion({
  content,
  questionId,
  questionLabel,
  value,
  questionOrder,
}: {
  content: string;
  questionId: string;
  questionLabel: string;
  value: string;
  questionOrder?: Array<{ id: string }>;
}): string {
  const normalizedValue = value.trim();
  const marker = createQuestionMarker(questionId);
  const questionBody = `${marker}\n${normalizedValue}`;
  const reviewHeading = findOwnedTradeReviewHeading(content);
  if (!reviewHeading) {
    return reorderMarkedTradeReviewQuestions(
      appendBlock(
        content,
        `## ${TRADE_REVIEW_HEADING}\n\n### ${questionLabel}\n${questionBody}\n\n${TRADE_REVIEW_END_BLOCK}`
      ),
      questionOrder
    );
  }

  const reviewEnd = findReviewBoundary(content, reviewHeading.endIndex, 2);
  const reviewBodyEnd = reviewEnd?.index ?? content.length;
  const markedQuestionHeading = findQuestionHeadingById(
    content,
    questionId,
    reviewHeading.endIndex,
    reviewBodyEnd
  );
  const questionHeading =
    markedQuestionHeading ??
    findHeadingInRange(
      content,
      questionLabel,
      3,
      reviewHeading.endIndex,
      reviewBodyEnd
    );

  if (!questionHeading) {
    const insertion = `\n\n### ${questionLabel}\n${questionBody}\n`;
    return reorderMarkedTradeReviewQuestions(
      ensureTradeReviewEndBoundary(insertAt(content, reviewBodyEnd, insertion)),
      questionOrder
    );
  }

  const nextQuestionBoundary = markedQuestionHeading
    ? (findNextMarkedQuestionHeading(
        content,
        questionId,
        questionHeading.endIndex,
        reviewBodyEnd
      ) ?? findNextHeadingAtOrAboveLevel(content, questionHeading.endIndex, 2))
    : findNextHeadingAtOrAboveLevel(content, questionHeading.endIndex, 3);
  const answerEnd = Math.min(
    nextQuestionBoundary?.index ?? reviewBodyEnd,
    reviewBodyEnd
  );
  const replacement = `\n${questionBody}\n`;
  return reorderMarkedTradeReviewQuestions(
    ensureTradeReviewEndBoundary(
      `${content.slice(0, questionHeading.endIndex)}${replacement}${content.slice(answerEnd)}`
    ),
    questionOrder
  );
}

function reorderMarkedTradeReviewQuestions(
  content: string,
  questionOrder: Array<{ id: string }> | undefined
): string {
  if (!questionOrder || questionOrder.length === 0) return content;

  const orderById = new Map(
    questionOrder.map((question, index) => [question.id, index])
  );
  const reviewHeading = findOwnedTradeReviewHeading(content);
  if (!reviewHeading) return content;

  const reviewEnd = findReviewBoundary(content, reviewHeading.endIndex, 2);
  const reviewBodyEnd = reviewEnd?.index ?? content.length;
  const markers = findQuestionMarkersInRange(
    content,
    reviewHeading.endIndex,
    reviewBodyEnd
  );
  if (markers.length < 2) return content;

  const blocks: ReviewQuestionBlockStart[] = [];
  for (const [originalIndex, marker] of markers.entries()) {
    const heading = findNearestHeadingBefore(
      content,
      marker.index,
      reviewHeading.endIndex,
      3
    );
    if (!heading) continue;
    blocks.push({
      questionId: marker.questionId,
      originalIndex,
      start: heading.index,
    });
  }

  if (blocks.length < 2) return content;

  const uniqueStarts = new Set(blocks.map((block) => block.start));
  if (uniqueStarts.size !== blocks.length) return content;

  const sortedByStart = blocks.slice().sort((a, b) => a.start - b.start);
  const sortableBlocks: ReviewQuestionBlock[] = sortedByStart.map(
    (block, index) => ({
      ...block,
      end: sortedByStart[index + 1]?.start ?? reviewBodyEnd,
      text: content.slice(
        block.start,
        sortedByStart[index + 1]?.start ?? reviewBodyEnd
      ),
    })
  );

  const sortedBlocks = sortableBlocks.slice().sort((a, b) => {
    const aOrder = orderById.get(a.questionId) ?? Number.MAX_SAFE_INTEGER;
    const bOrder = orderById.get(b.questionId) ?? Number.MAX_SAFE_INTEGER;
    return aOrder - bOrder || a.originalIndex - b.originalIndex;
  });

  if (
    sortedBlocks.length === sortableBlocks.length &&
    sortedBlocks.every(
      (block, index) => block.questionId === sortableBlocks[index].questionId
    )
  ) {
    return content;
  }

  const spanStart = sortableBlocks[0].start;
  const spanEnd = sortableBlocks[sortableBlocks.length - 1].end;
  return `${content.slice(0, spanStart)}${sortedBlocks
    .map((block) => block.text)
    .join('')}${content.slice(spanEnd)}`;
}

export function ensureTradeReviewEndBoundary(content: string): string {
  const reviewHeading = findOwnedTradeReviewHeading(content);
  if (!reviewHeading) return content;

  const legacyEndHeading = findHeadingInRange(
    content,
    LEGACY_TRADE_REVIEW_END_HEADING,
    2,
    reviewHeading.endIndex,
    content.length
  );
  if (legacyEndHeading) {
    return `${content.slice(0, legacyEndHeading.index).trimEnd()}\n\n${TRADE_REVIEW_END_BLOCK}\n${content.slice(legacyEndHeading.endIndex).trimStart()}`;
  }

  const nextSectionHeading = findNextHeadingAtOrAboveLevel(
    content,
    reviewHeading.endIndex,
    2
  );
  const reviewEndLimit = nextSectionHeading?.index ?? content.length;
  const markerIndex = content.indexOf(
    TRADE_REVIEW_END_MARKER,
    reviewHeading.endIndex
  );
  const visibleEndSeparator = findTradeReviewVisibleEndSeparator(
    content,
    reviewHeading.endIndex
  );

  if (markerIndex !== -1 && markerIndex < reviewEndLimit) {
    const markerEndIndex = markerIndex + TRADE_REVIEW_END_MARKER.length;

    if (visibleEndSeparator && visibleEndSeparator.index < reviewEndLimit) {
      const betweenMarkerAndSeparator = content.slice(
        markerEndIndex,
        visibleEndSeparator.index
      );
      return `${content.slice(0, markerEndIndex)}${betweenMarkerAndSeparator.split(TRADE_REVIEW_END_MARKER).join('').trimEnd()}\n${content.slice(visibleEndSeparator.index)}`;
    }

    return `${content.slice(0, markerEndIndex)}\n---\n${TRADE_REVIEW_END_LABEL}\n${content.slice(markerEndIndex).trimStart()}`;
  }

  if (visibleEndSeparator && visibleEndSeparator.index < reviewEndLimit) {
    return `${content.slice(0, visibleEndSeparator.index).trimEnd()}\n\n${TRADE_REVIEW_END_MARKER}\n${content.slice(visibleEndSeparator.index)}`;
  }

  const reviewEnd = findReviewBoundary(content, reviewHeading.endIndex, 2);
  if (reviewEnd) return content;

  return `${content.trimEnd()}\n\n${TRADE_REVIEW_END_BLOCK}\n`;
}

export function migrateTradeReviewFrontmatterToMarkdown({
  content,
  tradeReview,
}: {
  content: string;
  tradeReview: TradeReviewData;
}): { content: string; migrated: boolean } {
  let nextContent = content;
  let migrated = false;
  const markdownReview = parseTradeReviewMarkdown(content);

  for (const [sectionId, section] of Object.entries(
    tradeReview.sections ?? {}
  )) {
    const textAreas = section.textAreas ?? {};
    for (const [questionId, answer] of Object.entries(textAreas)) {
      if (!answer.trim()) continue;
      const label = getTradeReviewQuestionLabel(questionId || sectionId);
      const existingAnswer =
        markdownReview?.sections?.[questionId]?.textAreas?.[
          questionId
        ]?.trim() ??
        markdownReview?.sections?.[label]?.textAreas?.[label]?.trim() ??
        '';
      if (existingAnswer) continue;
      nextContent = upsertTradeReviewMarkdownQuestion({
        content: nextContent,
        questionId,
        questionLabel: label,
        value: answer,
      });
      migrated = true;
    }

    const checklistAnswer = formatLegacyCheckboxAnswers(section.checkboxes);
    if (checklistAnswer) {
      const questionId = `${sectionId || 'legacy'}-checkboxes`;
      const label = `${humanizeQuestionId(sectionId || 'legacy')} checklist`;
      const existingAnswer =
        markdownReview?.sections?.[questionId]?.textAreas?.[
          questionId
        ]?.trim() ?? '';
      if (existingAnswer) continue;
      nextContent = upsertTradeReviewMarkdownQuestion({
        content: nextContent,
        questionId,
        questionLabel: label,
        value: checklistAnswer,
      });
      migrated = true;
    }
  }

  return { content: nextContent, migrated };
}

function formatLegacyCheckboxAnswers(
  checkboxes: Record<string, boolean> | undefined
): string {
  if (!checkboxes) return '';
  return Object.entries(checkboxes)
    .map(
      ([checkboxId, checked]) =>
        `- [${checked ? 'x' : ' '}] ${humanizeQuestionId(checkboxId)}`
    )
    .join('\n')
    .trim();
}

function findReviewBoundary(
  content: string,
  start: number,
  headingLevel: number
): HeadingMatch | null {
  const marker = findTradeReviewEndMarker(content, start);
  if (marker) return marker;

  const separator = findTradeReviewVisibleEndSeparator(content, start);
  const heading = findNextHeadingAtOrAboveLevel(content, start, headingLevel);

  if (!separator) return heading;
  if (!heading) return separator;
  return separator.index < heading.index ? separator : heading;
}

function findOwnedTradeReviewHeading(content: string): HeadingMatch | null {
  const reviewHeadings = findHeadingsInRange(
    content,
    0,
    content.length,
    2
  ).filter(
    (heading) =>
      normalizeHeading(heading.text) === normalizeHeading(TRADE_REVIEW_HEADING)
  );
  const questionMarkers = findQuestionMarkersInRange(
    content,
    0,
    content.length
  );
  const endMarkerIndexes = findTradeReviewEndMarkerIndexes(content);

  for (const reviewHeading of reviewHeadings) {
    const nextSectionHeading = findNextHeadingAtOrAboveLevel(
      content,
      reviewHeading.endIndex,
      2
    );
    const reviewBodyEnd = nextSectionHeading?.index ?? content.length;
    const hasEndMarker = endMarkerIndexes.some(
      (index) => index >= reviewHeading.endIndex && index < reviewBodyEnd
    );
    const hasQuestionMarker = questionMarkers.some(
      (marker) =>
        marker.index >= reviewHeading.endIndex && marker.index < reviewBodyEnd
    );

    if (hasEndMarker || hasQuestionMarker) {
      return reviewHeading;
    }
  }

  return null;
}

function findTradeReviewEndMarkerIndexes(content: string): number[] {
  const indexes: number[] = [];
  const endMarkerPattern = /<!--\s*journalit-trade-review:end\s*-->/g;
  let match: RegExpExecArray | null;

  while ((match = endMarkerPattern.exec(content)) !== null) {
    indexes.push(match.index);
  }

  return indexes;
}

function findTradeReviewEndMarker(
  content: string,
  start: number
): HeadingMatch | null {
  const markerIndex = content.indexOf(TRADE_REVIEW_END_MARKER, start);
  if (markerIndex !== -1) {
    return {
      index: markerIndex,
      endIndex: markerIndex + TRADE_REVIEW_END_MARKER.length,
      level: 2,
      text: TRADE_REVIEW_END_MARKER,
    };
  }

  return null;
}

function findTradeReviewVisibleEndSeparator(
  content: string,
  start: number
): HeadingMatch | null {
  const separatorPattern = /^---\s*\n_End Trade Review_\s*$/gm;
  separatorPattern.lastIndex = start;
  const match = separatorPattern.exec(content);
  if (!match) return null;

  return {
    index: match.index,
    endIndex: separatorPattern.lastIndex,
    level: 2,
    text: TRADE_REVIEW_END_LABEL,
  };
}

function findHeadingInRange(
  content: string,
  headingText: string,
  level: number,
  start: number,
  end: number
): HeadingMatch | null {
  return (
    findHeadingsInRange(content, start, end, level).find(
      (heading) =>
        normalizeHeading(heading.text) === normalizeHeading(headingText)
    ) ?? null
  );
}

function findQuestionMarkersInRange(
  content: string,
  start: number,
  end: number
): QuestionMarkerMatch[] {
  const markers: QuestionMarkerMatch[] = [];
  const markerPattern =
    /<!--\s*journalit-trade-review:question\s+id="([^"]+)"\s*-->/g;
  let match: RegExpExecArray | null;
  while ((match = markerPattern.exec(content)) !== null) {
    if (match.index < start || match.index >= end) continue;
    markers.push({
      index: match.index,
      endIndex: markerPattern.lastIndex,
      questionId: match[1].replace(/&quot;/g, '"'),
    });
  }
  return markers;
}

function findNearestHeadingBefore(
  content: string,
  beforeIndex: number,
  afterIndex: number,
  level: number
): HeadingMatch | null {
  const headings = findHeadingsInRange(content, afterIndex, beforeIndex, level);
  return headings[headings.length - 1] ?? null;
}

function findNextMarkedQuestionHeading(
  content: string,
  currentQuestionId: string,
  start: number,
  end: number
): HeadingMatch | null {
  const markers = findQuestionMarkersInRange(content, start, end);
  const nextMarker = markers.find(
    (marker) => marker.questionId !== currentQuestionId
  );
  return nextMarker
    ? findNearestHeadingBefore(content, nextMarker.index, start, 3)
    : null;
}

function findHeadingsInRange(
  content: string,
  start: number,
  end: number,
  level: number
): HeadingMatch[] {
  const headings: HeadingMatch[] = [];
  const headingPattern = /^(#{1,6})\s+(.+?)\s*$/gm;
  let match: RegExpExecArray | null;
  while ((match = headingPattern.exec(content)) !== null) {
    if (match.index < start || match.index >= end) continue;
    if (match[1].length !== level) continue;
    headings.push({
      index: match.index,
      endIndex: headingPattern.lastIndex,
      level: match[1].length,
      text: match[2].trim(),
    });
  }
  return headings;
}

function findNextHeadingAtOrAboveLevel(
  content: string,
  start: number,
  level: number
): HeadingMatch | null {
  const headingPattern = /^(#{1,6})\s+(.+?)\s*$/gm;
  headingPattern.lastIndex = start;
  let match: RegExpExecArray | null;
  while ((match = headingPattern.exec(content)) !== null) {
    if (match[1].length <= level) {
      return {
        index: match.index,
        endIndex: headingPattern.lastIndex,
        level: match[1].length,
        text: match[2].trim(),
      };
    }
  }
  return null;
}

function normalizeHeading(value: string): string {
  return value.trim().replace(/\s+/g, ' ').toLowerCase();
}

function appendBlock(content: string, block: string): string {
  const separator = content.trim().length > 0 ? '\n\n' : '';
  return `${content.trimEnd()}${separator}${block.trimEnd()}\n`;
}

function insertAt(content: string, index: number, insertion: string): string {
  return `${content.slice(0, index).trimEnd()}${insertion}${content.slice(index)}`;
}

function humanizeQuestionId(questionId: string): string {
  const words: string[] = [];
  const normalizedQuestionId = questionId
    .replace(/^[a-z]+-/, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2');
  for (const part of normalizedQuestionId.split('-')) {
    if (part) words.push(part.charAt(0).toUpperCase() + part.slice(1));
  }
  return words.join(' ');
}
