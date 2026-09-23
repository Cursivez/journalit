import type { SampleReviewAuthoring } from './DemoOwnership';
import type { DemoReviewRecipe } from './compileDemoPack';

function createReviewNarrative(review: DemoReviewRecipe): string {
  return [
    '<!-- journalit-sample-review-narrative:start -->',
    '## Sample reflection',
    '',
    Object.values(review.answers).join('\n\n'),
    '',
    '<!-- journalit-sample-review-narrative:end -->',
  ].join('\n');
}

export function createSampleReviewAuthoring(
  review: DemoReviewRecipe,
  instanceId: string
): SampleReviewAuthoring {
  const frontmatter: Record<string, unknown> = {
    templateId: review.templateId,
    reviewQuestions: review.answers,
  };
  if (review.customFields) {
    frontmatter.reviewCustomFields = review.customFields;
  }
  if (review.type === 'drc') {
    frontmatter.endOfDayReview = {
      reviewed: review.completed,
      reviewedAt: review.completedAt ?? null,
    };
  } else {
    frontmatter.reviewed = review.completed;
    frontmatter.reviewedAt = review.completedAt ?? null;
  }
  return {
    instanceId,
    entityId: review.entityId,
    frontmatter,
    appendBody: createReviewNarrative(review),
  };
}
