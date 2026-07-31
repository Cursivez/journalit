import type { TradeReviewData } from '../../backend/types';

const TRADE_REVIEW_HEADING = 'Trade Review';
const LEGACY_TRADE_REVIEW_END_HEADING = 'End Trade Review';
const TRADE_REVIEW_END_MARKER = '<!-- journalit-trade-review:end -->';
const TRADE_REVIEW_QUESTION_MARKER_PREFIX =
  '<!-- journalit-trade-review:question ';
const TRADE_REVIEW_CHOICE_MARKER_PREFIX =
  '<!-- journalit-trade-review:choice-option ';
const TRADE_REVIEW_END_LABEL = '_End Trade Review_';
const TRADE_REVIEW_END_BLOCK = `${TRADE_REVIEW_END_MARKER}\n---\n${TRADE_REVIEW_END_LABEL}`;
const LEGACY_CHECKLIST_QUESTION_ID_PREFIX = 'legacy-checklist:';
const LEGACY_CHECKLIST_QUESTION_ID_SUFFIX = '-checkboxes';
const LEGACY_CONFLICT_QUESTION_ID_PREFIX = 'legacy-conflict:';

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

const LEGACY_QUESTION_LABELS_BY_ID: Record<string, string> = {
  'loss-key-lesson': 'Key lesson',
  'feelings-text': 'How were you feeling about this loss?',
  'learn-reasonable': 'What went well that you can repeat?',
  'learn-unreasonable': 'What went wrong and how will you improve?',
  'next-steps-text': 'What are your next steps?',
  'overall-thoughts-text': 'Overall trade thoughts',
  [`${LEGACY_CHECKLIST_QUESTION_ID_PREFIX}pause-checkbox`]: 'Pause checklist',
  [`${LEGACY_CHECKLIST_QUESTION_ID_PREFIX}review-plan-checklist`]:
    'Review your plan checklist',
  [`${LEGACY_CHECKLIST_QUESTION_ID_PREFIX}final-check-list`]: 'Final check',
  'pause-checkbox-checkboxes': 'Pause checklist',
  'review-plan-checklist-checkboxes': 'Review your plan checklist',
  'final-check-list-checkboxes': 'Final check',
};
const LEGACY_SUPPLEMENTAL_QUESTION_IDS = new Set([
  ...Object.keys(DEFAULT_QUESTION_LABELS_BY_ID),
  ...Object.keys(LEGACY_QUESTION_LABELS_BY_ID),
  'what-went-well',
  'what-to-improve',
  'key-lesson',
]);
const LEGACY_DYNAMIC_QUESTION_ID_PATTERN = /^(?:(?:win|loss)-)?section-\d{13}$/;

export const TRADE_REVIEW_MARKDOWN_MIGRATION_VERSION =
  '2026-07-trade-review-markdown-v1';

const LEGACY_TRADE_REVIEW_QUESTION_ID_ALIASES: Record<string, string[]> = {
  'loss-what-went-wrong': ['loss-what-happened'],
};
const CANONICAL_TRADE_REVIEW_QUESTION_ID_BY_LEGACY_ID = new Map(
  Object.entries(LEGACY_TRADE_REVIEW_QUESTION_ID_ALIASES).flatMap(
    ([canonicalId, legacyIds]) =>
      legacyIds.map((legacyId) => [legacyId, canonicalId] as const)
  )
);

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

interface TradeReviewQuestionOrderEntry {
  id: string;
  label?: string;
  knownLabels?: string[];
  depth?: number;
}

function getQuestionHeadingLevel(depth: number | undefined): number {
  return 3 + Math.min(Math.max(depth ?? 0, 0), 3);
}

export function getTradeReviewQuestionLabel(questionId: string): string {
  if (questionId.startsWith(LEGACY_CONFLICT_QUESTION_ID_PREFIX)) {
    const originalId = questionId
      .slice(LEGACY_CONFLICT_QUESTION_ID_PREFIX.length)
      .replace(/:\d+$/, '');
    return `${getTradeReviewQuestionLabel(originalId)} (legacy answer)`;
  }
  if (questionId.startsWith(LEGACY_CHECKLIST_QUESTION_ID_PREFIX)) {
    const sectionId = questionId.slice(
      LEGACY_CHECKLIST_QUESTION_ID_PREFIX.length
    );
    return (
      LEGACY_QUESTION_LABELS_BY_ID[questionId] ??
      `${humanizeQuestionId(sectionId)} checklist`
    );
  }
  if (questionId.endsWith(LEGACY_CHECKLIST_QUESTION_ID_SUFFIX)) {
    const sectionId = questionId.slice(
      0,
      -LEGACY_CHECKLIST_QUESTION_ID_SUFFIX.length
    );
    return (
      LEGACY_QUESTION_LABELS_BY_ID[questionId] ??
      `${humanizeQuestionId(sectionId)} checklist`
    );
  }
  return (
    DEFAULT_QUESTION_LABELS_BY_ID[questionId] ??
    LEGACY_QUESTION_LABELS_BY_ID[questionId] ??
    humanizeQuestionId(questionId)
  );
}

export function getTradeReviewQuestionKnownLabels(
  questionId: string
): string[] {
  const labels = [
    DEFAULT_QUESTION_LABELS_BY_ID[questionId],
    LEGACY_QUESTION_LABELS_BY_ID[questionId],
    ...(LEGACY_TRADE_REVIEW_QUESTION_ID_ALIASES[questionId] ?? []).flatMap(
      (legacyId) => [
        DEFAULT_QUESTION_LABELS_BY_ID[legacyId],
        LEGACY_QUESTION_LABELS_BY_ID[legacyId],
      ]
    ),
  ].filter((label): label is string => typeof label === 'string');
  return Array.from(new Set(labels));
}

export function isLegacySupplementalTradeReviewQuestionId(
  questionId: string
): boolean {
  return (
    LEGACY_SUPPLEMENTAL_QUESTION_IDS.has(questionId) ||
    questionId.startsWith(LEGACY_CONFLICT_QUESTION_ID_PREFIX) ||
    questionId.startsWith(LEGACY_CHECKLIST_QUESTION_ID_PREFIX) ||
    questionId.endsWith(LEGACY_CHECKLIST_QUESTION_ID_SUFFIX) ||
    LEGACY_DYNAMIC_QUESTION_ID_PATTERN.test(questionId)
  );
}

export function getCanonicalTradeReviewQuestionId(questionId: string): string {
  if (questionId.startsWith(LEGACY_CONFLICT_QUESTION_ID_PREFIX)) {
    return questionId;
  }
  if (questionId.endsWith(LEGACY_CHECKLIST_QUESTION_ID_SUFFIX)) {
    return `${LEGACY_CHECKLIST_QUESTION_ID_PREFIX}${questionId.slice(
      0,
      -LEGACY_CHECKLIST_QUESTION_ID_SUFFIX.length
    )}`;
  }
  return (
    CANONICAL_TRADE_REVIEW_QUESTION_ID_BY_LEGACY_ID.get(questionId) ??
    questionId
  );
}

function getGeneratedLegacyHeadingCandidates(
  questionId: string,
  canonicalQuestionId: string
): string[] {
  const sourceId = questionId
    .replace(LEGACY_CHECKLIST_QUESTION_ID_PREFIX, '')
    .replace(LEGACY_CHECKLIST_QUESTION_ID_SUFFIX, '');
  const sourceWithoutOutcome = sourceId.replace(/^(?:win|loss)-/, '');
  const checklistSuffix =
    questionId.startsWith(LEGACY_CHECKLIST_QUESTION_ID_PREFIX) ||
    questionId.endsWith(LEGACY_CHECKLIST_QUESTION_ID_SUFFIX)
      ? ' checklist'
      : '';

  return Array.from(
    new Set([
      getTradeReviewQuestionLabel(questionId),
      getTradeReviewQuestionLabel(canonicalQuestionId),
      humanizeQuestionId(questionId),
      `${humanizeQuestionId(sourceId)}${checklistSuffix}`,
      `${humanizeQuestionId(sourceWithoutOutcome)}${checklistSuffix}`,
    ])
  );
}

export function getTradeReviewQuestionIdCandidates(
  questionId: string
): string[] {
  const canonicalQuestionId = getCanonicalTradeReviewQuestionId(questionId);
  const candidates = new Set([questionId, canonicalQuestionId]);

  for (const legacyId of LEGACY_TRADE_REVIEW_QUESTION_ID_ALIASES[
    canonicalQuestionId
  ] ?? []) {
    candidates.add(legacyId);
  }

  if (canonicalQuestionId.startsWith(LEGACY_CHECKLIST_QUESTION_ID_PREFIX)) {
    const sectionId = canonicalQuestionId.slice(
      LEGACY_CHECKLIST_QUESTION_ID_PREFIX.length
    );
    candidates.add(`${sectionId}${LEGACY_CHECKLIST_QUESTION_ID_SUFFIX}`);
  }

  return Array.from(candidates);
}

function createQuestionMarker(questionId: string): string {
  return createEncodedIdMarker(TRADE_REVIEW_QUESTION_MARKER_PREFIX, questionId);
}

function createChoiceOptionMarker(optionId: string): string {
  return createEncodedIdMarker(TRADE_REVIEW_CHOICE_MARKER_PREFIX, optionId);
}

function encodeMarkerId(markerId: string): string {
  return encodeURIComponent(markerId).replace(/%3A/gi, ':');
}

function createEncodedIdMarker(prefix: string, markerId: string): string {
  const encodedId = encodeMarkerId(markerId);
  const encoding = encodedId === markerId ? '' : ' encoding="uri"';
  return `${prefix}id="${encodedId}"${encoding} -->`;
}

function decodeMarkerId(
  markerId: string,
  encoding: string | undefined
): string {
  if (encoding !== 'uri') return markerId.replace(/&quot;/g, '"');
  try {
    return decodeURIComponent(markerId);
  } catch {
    return markerId.replace(/&quot;/g, '"');
  }
}

function extractChoiceOptionId(answerBlock: string): string | undefined {
  const markerMatch = answerBlock.match(
    /<!--\s*journalit-trade-review:choice-option\s+id="([^"]+)"(?:\s+encoding="(uri)")?\s*-->/
  );
  return markerMatch?.[1]
    ? decodeMarkerId(markerMatch[1], markerMatch[2])
    : undefined;
}

function removeChoiceOptionMarker(answerBlock: string): string {
  return answerBlock.replace(
    /<!--\s*journalit-trade-review:choice-option\s+id="[^"]+"(?:\s+encoding="uri")?\s*-->\s*/,
    ''
  );
}

function extractQuestionIdFromAnswerBlock(answerBlock: string): string | null {
  const markerMatch = answerBlock.match(
    /<!--\s*journalit-trade-review:question\s+id="([^"]+)"(?:\s+encoding="(uri)")?\s*-->/
  );
  return markerMatch?.[1]
    ? decodeMarkerId(markerMatch[1], markerMatch[2])
    : null;
}

function removeQuestionMarker(answerBlock: string): string {
  return answerBlock.replace(
    /<!--\s*journalit-trade-review:question\s+id="[^"]+"(?:\s+encoding="uri")?\s*-->\s*/,
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
  return findNearestQuestionHeadingBefore(content, marker.index, startIndex);
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
    for (const [index, marker] of markers.entries()) {
      const questionHeading = findNearestQuestionHeadingBefore(
        content,
        marker.index,
        reviewHeading.endIndex
      );
      const nextMarker = markers[index + 1];
      const nextQuestionHeading = nextMarker
        ? findNearestQuestionHeadingBefore(
            content,
            nextMarker.index,
            marker.endIndex
          )
        : null;
      const answerEnd = nextQuestionHeading?.index ?? reviewBodyEnd;
      const rawAnswer = content.slice(marker.endIndex, answerEnd).trim();
      const answer = removeChoiceOptionMarker(rawAnswer).trim();
      sections[marker.questionId] = {
        textAreas: { [marker.questionId]: answer },
        label: questionHeading?.text,
        choiceOptionId: extractChoiceOptionId(rawAnswer),
      };
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
    const answerWithoutQuestionMarker = removeQuestionMarker(rawAnswer).trim();
    const answer = removeChoiceOptionMarker(answerWithoutQuestionMarker).trim();
    const sectionId = questionId ?? heading.text;
    sections[sectionId] = {
      textAreas: { [sectionId]: answer },
      label: heading.text,
      choiceOptionId: extractChoiceOptionId(rawAnswer),
    };
  }

  return Object.keys(sections).length > 0 ? { sections } : undefined;
}

export function repairLegacyTradeReviewMarkdown({
  content,
  labelsByQuestionId,
}: {
  content: string;
  labelsByQuestionId: ReadonlyMap<string, string>;
}): { content: string; repaired: boolean; conflicts: number } {
  const reviewHeading = findOwnedTradeReviewHeading(content);
  if (!reviewHeading) {
    return { content, repaired: false, conflicts: 0 };
  }

  const reviewEnd = findReviewBoundary(content, reviewHeading.endIndex, 2);
  const reviewBodyEnd = reviewEnd?.index ?? content.length;
  const markers = findQuestionMarkersInRange(
    content,
    reviewHeading.endIndex,
    reviewBodyEnd
  );
  const markerIds = new Set(markers.map((marker) => marker.questionId));
  const assignedIds = new Set(markerIds);
  const replacements: Array<{ start: number; end: number; value: string }> = [];
  const replacedHeadingStarts = new Set<number>();
  const conflicts = 0;

  for (const marker of markers) {
    const canonicalQuestionId = getCanonicalTradeReviewQuestionId(
      marker.questionId
    );
    const hasCanonicalCollision =
      canonicalQuestionId !== marker.questionId &&
      markerIds.has(canonicalQuestionId);
    let repairedQuestionId = canonicalQuestionId;
    if (hasCanonicalCollision) {
      const conflictIdBase = `${LEGACY_CONFLICT_QUESTION_ID_PREFIX}${marker.questionId}`;
      repairedQuestionId = conflictIdBase;
      let suffix = 2;
      while (assignedIds.has(repairedQuestionId)) {
        repairedQuestionId = `${conflictIdBase}:${suffix}`;
        suffix++;
      }
      assignedIds.add(repairedQuestionId);
    }

    if (repairedQuestionId !== marker.questionId) {
      replacements.push({
        start: marker.index,
        end: marker.endIndex,
        value: createQuestionMarker(repairedQuestionId),
      });
    }

    const label =
      labelsByQuestionId.get(repairedQuestionId) ??
      labelsByQuestionId.get(marker.questionId);
    if (!label) continue;

    const heading = findNearestQuestionHeadingBefore(
      content,
      marker.index,
      reviewHeading.endIndex
    );
    if (!heading || replacedHeadingStarts.has(heading.index)) {
      continue;
    }
    const normalizedHeading = normalizeHeading(heading.text);
    if (normalizedHeading === normalizeHeading(label)) {
      continue;
    }
    const generatedHeadings = getGeneratedLegacyHeadingCandidates(
      marker.questionId,
      canonicalQuestionId
    );
    if (
      !generatedHeadings.some(
        (candidate) => normalizeHeading(candidate) === normalizedHeading
      )
    ) {
      continue;
    }

    replacedHeadingStarts.add(heading.index);
    replacements.push({
      start: heading.index,
      end: heading.endIndex,
      value: `### ${label}`,
    });
  }

  const repairedContent = replacements
    .sort((left, right) => right.start - left.start)
    .reduce(
      (nextContent, replacement) =>
        `${nextContent.slice(0, replacement.start)}${replacement.value}${nextContent.slice(replacement.end)}`,
      content
    );

  return {
    content: repairedContent,
    repaired: repairedContent !== content,
    conflicts,
  };
}

export function upsertTradeReviewMarkdownQuestion({
  content,
  questionId,
  questionLabel,
  value,
  selectedOptionId,
  questionOrder,
}: {
  content: string;
  questionId: string;
  questionLabel: string;
  value: string;
  selectedOptionId?: string;
  questionOrder?: Array<{
    id: string;
    label?: string;
    knownLabels?: string[];
    depth?: number;
  }>;
}): string {
  const normalizedValue = value.trim();
  const marker = createQuestionMarker(questionId);
  const choiceMarker = selectedOptionId
    ? `\n${createChoiceOptionMarker(selectedOptionId)}`
    : '';
  const questionBody = `${marker}${choiceMarker}\n${normalizedValue}`;
  const headingLevel = getQuestionHeadingLevel(
    questionOrder?.find((question) => question.id === questionId)?.depth
  );
  const questionHeadingMarkdown = `${'#'.repeat(headingLevel)} ${questionLabel}`;
  const reviewHeading = findOwnedTradeReviewHeading(content);
  if (!reviewHeading) {
    return reorderMarkedTradeReviewQuestions(
      appendBlock(
        content,
        `## ${TRADE_REVIEW_HEADING}\n\n${questionHeadingMarkdown}\n${questionBody}\n\n${TRADE_REVIEW_END_BLOCK}`
      ),
      questionOrder
    );
  }

  const reviewEnd = findReviewBoundary(content, reviewHeading.endIndex, 2);
  const reviewBodyEnd = reviewEnd?.index ?? content.length;
  const markers = findQuestionMarkersInRange(
    content,
    reviewHeading.endIndex,
    reviewBodyEnd
  );
  if (markers.length === 0 && questionOrder?.some(({ label }) => label)) {
    const upgradedContent = addMarkersToLegacyQuestionHeadings(
      content,
      questionOrder,
      reviewHeading.endIndex,
      reviewBodyEnd
    );
    if (upgradedContent !== content) {
      return upsertTradeReviewMarkdownQuestion({
        content: upgradedContent,
        questionId,
        questionLabel,
        value,
        selectedOptionId,
        questionOrder,
      });
    }
  }
  const markedQuestionHeading = findQuestionHeadingById(
    content,
    questionId,
    reviewHeading.endIndex,
    reviewBodyEnd
  );
  const questionHeading =
    markedQuestionHeading ??
    (markers.length === 0
      ? findHeadingInRange(
          content,
          questionLabel,
          3,
          reviewHeading.endIndex,
          reviewBodyEnd
        )
      : null);

  if (!questionHeading) {
    const insertion = `\n\n${questionHeadingMarkdown}\n${questionBody}\n`;
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
  questionOrder: TradeReviewQuestionOrderEntry[] | undefined
): string {
  if (!questionOrder || questionOrder.length === 0) return content;

  const orderById = new Map(
    questionOrder.map((question, index) => [question.id, index])
  );
  const questionById = new Map(
    questionOrder.map((question) => [question.id, question])
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
  if (markers.length === 0) return content;

  const blocks: ReviewQuestionBlockStart[] = [];
  for (const [originalIndex, marker] of markers.entries()) {
    const heading = findNearestQuestionHeadingBefore(
      content,
      marker.index,
      reviewHeading.endIndex
    );
    if (!heading) continue;
    blocks.push({
      questionId: marker.questionId,
      originalIndex,
      start: heading.index,
    });
  }

  if (blocks.length === 0) return content;

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

  const normalizedBlocks = sortableBlocks.map((block) => {
    const question = questionById.get(block.questionId);
    if (!question) return block;
    const headingPrefix = '#'.repeat(getQuestionHeadingLevel(question.depth));
    return {
      ...block,
      text: block.text.replace(
        /^#{3,6}(\s+.*)$/m,
        (_, existingLabel: string) =>
          question.label
            ? `${headingPrefix} ${question.label}`
            : `${headingPrefix}${existingLabel}`
      ),
    };
  });

  const sortedBlocks = normalizedBlocks.slice().sort((a, b) => {
    const aOrder = orderById.get(a.questionId) ?? Number.MAX_SAFE_INTEGER;
    const bOrder = orderById.get(b.questionId) ?? Number.MAX_SAFE_INTEGER;
    return aOrder - bOrder || a.originalIndex - b.originalIndex;
  });

  if (
    sortedBlocks.length === sortableBlocks.length &&
    sortedBlocks.every(
      (block, index) =>
        block.questionId === sortableBlocks[index].questionId &&
        block.text === sortableBlocks[index].text
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

function addMarkersToLegacyQuestionHeadings(
  content: string,
  questionOrder: TradeReviewQuestionOrderEntry[],
  start: number,
  end: number
): string {
  const headings = findHeadingsInRange(content, start, end, 3);
  const headingsByLabel = new Map<string, HeadingMatch[]>();
  for (const heading of headings) {
    const label = normalizeHeading(heading.text);
    const matchingHeadings = headingsByLabel.get(label) ?? [];
    matchingHeadings.push(heading);
    headingsByLabel.set(label, matchingHeadings);
  }
  const nextHeadingIndexByLabel = new Map<string, number>();
  const insertions: Array<{ index: number; marker: string }> = [];
  const assignedQuestionIds = new Set<string>();

  const assignMarker = (
    question: (typeof questionOrder)[number],
    candidateLabels: string[]
  ): boolean => {
    for (const candidateLabel of candidateLabels) {
      const normalizedLabel = normalizeHeading(candidateLabel);
      const nextHeadingIndex =
        nextHeadingIndexByLabel.get(normalizedLabel) ?? 0;
      const candidate =
        headingsByLabel.get(normalizedLabel)?.[nextHeadingIndex];
      if (!candidate) continue;
      nextHeadingIndexByLabel.set(normalizedLabel, nextHeadingIndex + 1);
      insertions.push({
        index: candidate.endIndex,
        marker: `\n${createQuestionMarker(question.id)}`,
      });
      return true;
    }
    return false;
  };

  for (const question of questionOrder) {
    const stableLabels = Array.from(
      new Set([
        ...(question.knownLabels ?? []),
        ...getTradeReviewQuestionKnownLabels(question.id),
      ])
    );
    if (assignMarker(question, stableLabels)) {
      assignedQuestionIds.add(question.id);
    }
  }

  for (const question of questionOrder) {
    if (assignedQuestionIds.has(question.id) || !question.label) continue;
    assignMarker(question, [question.label]);
  }

  return insertions
    .sort((a, b) => b.index - a.index)
    .reduce(
      (nextContent, insertion) =>
        insertAt(nextContent, insertion.index, insertion.marker),
      content
    );
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
  const answers: Array<{
    sourceQuestionId: string;
    canonicalQuestionId: string;
    label: string;
    answer: string;
  }> = [];

  for (const [sectionId, section] of Object.entries(
    tradeReview.sections ?? {}
  )) {
    const textAreas = section.textAreas ?? {};
    for (const [questionId, answer] of Object.entries(textAreas)) {
      if (!answer.trim()) continue;
      const sourceQuestionId = questionId || sectionId;
      const canonicalQuestionId =
        getCanonicalTradeReviewQuestionId(sourceQuestionId);
      answers.push({
        sourceQuestionId,
        canonicalQuestionId,
        label:
          section.label ?? getTradeReviewQuestionLabel(canonicalQuestionId),
        answer: answer.trim(),
      });
    }

    const checklistAnswer = formatLegacyCheckboxAnswers(section.checkboxes);
    if (checklistAnswer) {
      const sourceQuestionId = `${sectionId || 'legacy'}${LEGACY_CHECKLIST_QUESTION_ID_SUFFIX}`;
      const canonicalQuestionId =
        getCanonicalTradeReviewQuestionId(sourceQuestionId);
      answers.push({
        sourceQuestionId,
        canonicalQuestionId,
        label:
          section.label ?? getTradeReviewQuestionLabel(canonicalQuestionId),
        answer: checklistAnswer,
      });
    }
  }

  const answersByCanonicalId = new Map<string, (typeof answers)[number][]>();
  for (const answer of answers) {
    const groupedAnswers =
      answersByCanonicalId.get(answer.canonicalQuestionId) ?? [];
    groupedAnswers.push(answer);
    answersByCanonicalId.set(answer.canonicalQuestionId, groupedAnswers);
  }

  for (const [canonicalQuestionId, groupedAnswers] of answersByCanonicalId) {
    const distinctAnswers: (typeof answers)[number][] = [];
    const distinctAnswerValues = new Set<string>();
    for (const answer of groupedAnswers) {
      if (distinctAnswerValues.has(answer.answer)) continue;
      distinctAnswerValues.add(answer.answer);
      distinctAnswers.push(answer);
    }
    let markdownReview = parseTradeReviewMarkdown(nextContent);
    const existingMarkedAnswers = getTradeReviewQuestionIdCandidates(
      canonicalQuestionId
    ).flatMap((questionId): string[] => {
      const answer =
        markdownReview?.sections?.[questionId]?.textAreas?.[questionId]?.trim();
      return answer ? [answer] : [];
    });
    const existingUnmarkedAnswers: string[] = [];
    for (const { label } of distinctAnswers) {
      const unmarkedAnswer =
        markdownReview?.sections?.[label]?.textAreas?.[label]?.trim();
      if (unmarkedAnswer) existingUnmarkedAnswers.push(unmarkedAnswer);
    }
    const existingAnswers = new Set([
      ...existingMarkedAnswers,
      ...existingUnmarkedAnswers,
    ]);
    const conflictIdPrefixes = new Set(
      distinctAnswers.map(
        ({ sourceQuestionId }) =>
          `${LEGACY_CONFLICT_QUESTION_ID_PREFIX}${sourceQuestionId}`
      )
    );
    for (const [questionId, section] of Object.entries(
      markdownReview?.sections ?? {}
    )) {
      if (
        !Array.from(conflictIdPrefixes).some(
          (prefix) =>
            questionId === prefix || questionId.startsWith(`${prefix}:`)
        )
      ) {
        continue;
      }
      const conflictAnswer = section.textAreas?.[questionId]?.trim();
      if (conflictAnswer) existingAnswers.add(conflictAnswer);
    }
    const canonicalAnswerExists = Boolean(
      markdownReview?.sections?.[canonicalQuestionId]?.textAreas?.[
        canonicalQuestionId
      ]?.trim()
    );
    const answerBySourceQuestionId = new Map(
      distinctAnswers.map((answer) => [answer.sourceQuestionId, answer])
    );
    const canonicalSource = answerBySourceQuestionId.get(canonicalQuestionId);
    const canonicalAnswer =
      canonicalAnswerExists || existingUnmarkedAnswers.length > 0
        ? undefined
        : (canonicalSource ??
          (existingMarkedAnswers.length === 0
            ? distinctAnswers[0]
            : undefined));

    if (canonicalAnswer) {
      nextContent = upsertTradeReviewMarkdownQuestion({
        content: nextContent,
        questionId: canonicalQuestionId,
        questionLabel: canonicalAnswer.label,
        value: canonicalAnswer.answer,
      });
      existingAnswers.add(canonicalAnswer.answer);
      migrated = true;
    }

    for (const answer of distinctAnswers) {
      if (answer === canonicalAnswer || existingAnswers.has(answer.answer)) {
        continue;
      }
      markdownReview = parseTradeReviewMarkdown(nextContent);
      const existingQuestionIds = new Set(
        Object.keys(markdownReview?.sections ?? {})
      );
      const conflictIdBase = `${LEGACY_CONFLICT_QUESTION_ID_PREFIX}${answer.sourceQuestionId}`;
      let conflictQuestionId = conflictIdBase;
      let suffix = 2;
      while (existingQuestionIds.has(conflictQuestionId)) {
        conflictQuestionId = `${conflictIdBase}:${suffix}`;
        suffix++;
      }
      nextContent = upsertTradeReviewMarkdownQuestion({
        content: nextContent,
        questionId: conflictQuestionId,
        questionLabel: `${answer.label} (legacy answer)`,
        value: answer.answer,
      });
      existingAnswers.add(answer.answer);
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
    /<!--\s*journalit-trade-review:question\s+id="([^"]+)"(?:\s+encoding="(uri)")?\s*-->/g;
  let match: RegExpExecArray | null;
  while ((match = markerPattern.exec(content)) !== null) {
    if (match.index < start || match.index >= end) continue;
    markers.push({
      index: match.index,
      endIndex: markerPattern.lastIndex,
      questionId: decodeMarkerId(match[1], match[2]),
    });
  }
  return markers;
}

function findNearestQuestionHeadingBefore(
  content: string,
  beforeIndex: number,
  afterIndex: number
): HeadingMatch | null {
  const headings = [3, 4, 5, 6].flatMap((level) =>
    findHeadingsInRange(content, afterIndex, beforeIndex, level)
  );
  headings.sort((a, b) => a.index - b.index);
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
    ? findNearestQuestionHeadingBefore(content, nextMarker.index, start)
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
    .replace(/^(?:win|loss|be|open)-/, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2');
  for (const part of normalizedQuestionId.split('-')) {
    if (part) words.push(part.charAt(0).toUpperCase() + part.slice(1));
  }
  return words.join(' ');
}
