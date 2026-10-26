import {
  createAgentReviewRevision,
  type AgentReviewHash,
  type AgentReviewRevisionContent,
} from '../../agent/reviews/AgentReviewRevision';
import type { ActionInput } from '../ActionTypes';

type ReviewUpdateInput = ActionInput<'review.update'>;
type ReviewContent = ReviewUpdateInput['content'];

function same(left: unknown, right: unknown): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

function answerOf(
  content: AgentReviewRevisionContent,
  questionId: string
): string | undefined {
  return content.answers.find((answer) => answer.question_id === questionId)
    ?.answer;
}


function applied(
  review: AgentReviewRevisionContent,
  content: ReviewContent
): AgentReviewRevisionContent {
  const answers = new Map(
    review.answers.map((answer) => [answer.question_id, answer.answer])
  );
  for (const answer of content.answers ?? []) {
    answers.set(answer.question_id, answer.answer);
  }
  return {
    summary: content.summary ?? review.summary,
    answers: [...answers].map(([question_id, answer]) => ({
      question_id,
      answer,
    })),
    goals: content.goals ?? review.goals,
    checklist: content.checklist ?? review.checklist,
    keyLevels: content.key_levels ?? review.keyLevels,
    grades: {
      mental:
        content.grades?.mental === undefined
          ? review.grades.mental
          : content.grades.mental,
      technical:
        content.grades?.technical === undefined
          ? review.grades.technical
          : content.grades.technical,
    },
    reviewed: content.reviewed ?? review.reviewed,
  };
}


function previousContent(
  requested: ReviewContent,
  previous: AgentReviewRevisionContent,
  written: AgentReviewRevisionContent
): ReviewContent | null {
  const content: ReviewContent = {};
  if (requested.summary !== undefined && previous.summary !== written.summary) {
    content.summary = previous.summary;
  }
  const answers: NonNullable<ReviewContent['answers']> = [];
  for (const { question_id } of requested.answers ?? []) {
    const before = answerOf(previous, question_id);
    if (before === answerOf(written, question_id)) continue;
    
    if (before === undefined) return null;
    answers.push({ question_id, answer: before });
  }
  if (answers.length > 0) content.answers = answers;
  if (requested.goals !== undefined && !same(previous.goals, written.goals)) {
    content.goals = previous.goals.map(({ text, done }) => ({ text, done }));
  }
  if (
    requested.checklist !== undefined &&
    !same(previous.checklist, written.checklist)
  ) {
    content.checklist = previous.checklist.map(({ text, done }) => ({
      text,
      done,
    }));
  }
  if (
    requested.key_levels !== undefined &&
    !same(previous.keyLevels, written.keyLevels)
  ) {
    content.key_levels = {
      support: previous.keyLevels.support.map(({ price, importance }) => ({
        price,
        importance,
      })),
      resistance: previous.keyLevels.resistance.map(
        ({ price, importance }) => ({ price, importance })
      ),
    };
  }
  const grades: NonNullable<ReviewContent['grades']> = {};
  for (const key of ['mental', 'technical'] as const) {
    if (
      requested.grades?.[key] !== undefined &&
      previous.grades[key] !== written.grades[key]
    ) {
      grades[key] = previous.grades[key];
    }
  }
  if (Object.keys(grades).length > 0) content.grades = grades;
  if (
    requested.reviewed !== undefined &&
    previous.reviewed !== written.reviewed
  ) {
    content.reviewed = previous.reviewed;
  }
  return content;
}


export async function restoringReviewUpdate(
  capture: {
    review: ReviewUpdateInput['review'];
    requested: ReviewContent;
    previous: AgentReviewRevisionContent & { readonly revision: string };
    written: AgentReviewRevisionContent & { readonly revision: string };
  },
  hash?: AgentReviewHash
): Promise<ReviewUpdateInput | null> {
  const { previous, written } = capture;
  try {
    const content = previousContent(capture.requested, previous, written);
    if (!content || Object.keys(content).length === 0) return null;
    const restored = await createAgentReviewRevision(
      applied(written, content),
      hash
    );
    return restored === previous.revision
      ? {
          review: {
            period: capture.review.period,
            period_start: capture.review.period_start,
          },
          expected_revision: written.revision,
          content,
        }
      : null;
  } catch (error) {
    
    console.warn('[Journalit] Could not capture a review change:', error);
    return null;
  }
}
