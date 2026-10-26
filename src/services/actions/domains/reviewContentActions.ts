import {
  AgentReviewReadError,
  type AgentReviewReadRecord,
  type AgentReviewReadService,
} from '../../agent/reviews/AgentReviewReadService';
import {
  AgentReviewWriteError,
  type AgentReviewWriteRequest,
  type AgentReviewWriteService,
} from '../../agent/reviews/AgentReviewWriteService';
import {
  createAgentReviewQuestionId,
  type AgentReviewHash,
  type AgentReviewPeriod,
} from '../../agent/reviews/AgentReviewRevision';
import { t, tPlural } from '../../../lang/helpers';
import {
  reviewHasChecklist,
  reviewHasKeyLevels,
} from '../../agent/reviews/AgentReviewContent';
import { ActionExecutionError, ActionPlanError } from '../ActionErrors';
import {
  ActionExecution,
  type ActionDefinition,
  type ActionDisplay,
  type ActionInput,
  type ActionPlan,
  type ActionPlanContext,
} from '../ActionTypes';
import { restoringReviewUpdate } from './reviewRestore';
import { reviewIdentityKey } from './plannedReview';

type ReviewIdentity = ActionInput<'review.create'>['review'];
type ReviewContent = ActionInput<'review.create'>['content'];

interface ReviewContentActionDependencies {
  reviewReadService: Pick<AgentReviewReadService, 'read'>;
  reviewWriteService: Pick<AgentReviewWriteService, 'write'>;
  getConfiguredQuestionLabels: (period: AgentReviewPeriod) => readonly string[];
  hash?: AgentReviewHash;
}

function throwIfAborted(signal: AbortSignal): void {
  if (signal.aborted) throw signal.reason;
}

function validateUniqueAnswerIds(content: ReviewContent): void {
  const seen = new Set<string>();
  for (const answer of content.answers ?? []) {
    if (seen.has(answer.question_id)) {
      throw new ActionPlanError('invalid_request', 'content.answers');
    }
    seen.add(answer.question_id);
  }
}

function validateKnownAnswerIds(
  content: ReviewContent,
  knownQuestions: ReadonlyMap<string, string>
): void {
  for (const answer of content.answers ?? []) {
    if (!knownQuestions.has(answer.question_id)) {
      throw new ActionPlanError('not_found', 'content.answers');
    }
  }
}


function validatePeriodSections(
  review: ReviewIdentity,
  content: ReviewContent
): void {
  if (content.checklist !== undefined && !reviewHasChecklist(review.period)) {
    throw new ActionPlanError('unsupported_capability', 'content.checklist');
  }
  if (content.key_levels !== undefined && !reviewHasKeyLevels(review.period)) {
    throw new ActionPlanError('unsupported_capability', 'content.key_levels');
  }
}

function gradeLabel(value: string | number | null): string {
  return value === null ? t('actions.value.cleared') : String(value);
}

function describeContent(
  review: ReviewIdentity,
  content: ReviewContent
): ActionDisplay {
  const changes: string[] = [];
  if (content.summary !== undefined) {
    changes.push(t('actions.review.summary'));
  }
  if (content.answers !== undefined && content.answers.length > 0) {
    changes.push(tPlural('actions.review.answers', content.answers.length));
  }
  if (content.goals !== undefined) {
    changes.push(tPlural('actions.review.goals', content.goals.length));
  }
  if (content.checklist !== undefined) {
    changes.push(tPlural('actions.review.checklist', content.checklist.length));
  }
  if (content.key_levels !== undefined) {
    changes.push(
      t('actions.review.key-levels', {
        support: String(content.key_levels.support.length),
        resistance: String(content.key_levels.resistance.length),
      })
    );
  }
  if (content.grades?.mental !== undefined) {
    changes.push(
      t('actions.review.grade.mental', {
        value: gradeLabel(content.grades.mental),
      })
    );
  }
  if (content.grades?.technical !== undefined) {
    changes.push(
      t('actions.review.grade.technical', {
        value: gradeLabel(content.grades.technical),
      })
    );
  }
  if (content.reviewed !== undefined) {
    changes.push(
      t(
        content.reviewed
          ? 'actions.review.reviewed'
          : 'actions.review.not-reviewed'
      )
    );
  }
  return {
    target: t(`actions.review.target.${review.period}`, {
      date: review.period_start,
    }),
    changes,
  };
}

function executionError(error: unknown): never {
  if (error instanceof AgentReviewWriteError) {
    switch (error.code) {
      case 'conflict':
        throw new ActionExecutionError('conflict', false);
      case 'not_found':
        throw new ActionExecutionError('not_found', false);
      case 'invalid_request':
      case 'limit_exceeded':
        throw new ActionExecutionError('invalid_request', false);
      case 'unsupported_capability':
        throw new ActionExecutionError('unsupported_operation', false);
    }
  }
  throw error;
}


class ReviewContentPlanner {
  constructor(private readonly deps: ReviewContentActionDependencies) {}

  async read(
    review: ReviewIdentity,
    signal: AbortSignal
  ): Promise<AgentReviewReadRecord | null> {
    try {
      const record = await this.deps.reviewReadService.read(review, signal);
      throwIfAborted(signal);
      return record;
    } catch (error) {
      throwIfAborted(signal);
      if (error instanceof AgentReviewReadError) {
        throw new ActionPlanError(error.code, 'review');
      }
      throw error;
    }
  }

  async configuredQuestions(
    period: AgentReviewPeriod,
    signal: AbortSignal
  ): Promise<Map<string, string>> {
    const labels = this.deps.getConfiguredQuestionLabels(period);
    
    const ids = await Promise.all(
      labels.map((label) =>
        createAgentReviewQuestionId(period, label, this.deps.hash)
      )
    );
    throwIfAborted(signal);
    const questions = new Map<string, string>();
    labels.forEach((label, index) => {
      const existing = questions.get(ids[index]);
      if (existing !== undefined && existing !== label) {
        throw new Error('Review question identity collision detected.');
      }
      questions.set(ids[index], label);
    });
    return questions;
  }

  async write(
    request: AgentReviewWriteRequest,
    signal: AbortSignal
  ): Promise<{ review: ReviewIdentity; revision: string }> {
    throwIfAborted(signal);
    try {
      const result = await this.deps.reviewWriteService.write(request, signal);
      return {
        review: {
          period: result.review.period,
          period_start: result.review.period_start,
        },
        revision: result.revision,
      };
    } catch (error) {
      return executionError(error);
    }
  }
}


export class ReviewCreateAction implements ActionDefinition<'review.create'> {
  private readonly planner: ReviewContentPlanner;

  constructor(deps: ReviewContentActionDependencies) {
    this.planner = new ReviewContentPlanner(deps);
  }

  async plan(
    input: ActionInput<'review.create'>,
    context: ActionPlanContext
  ): Promise<ActionPlan<'review.create'>> {
    const { signal } = context;
    throwIfAborted(signal);
    validateUniqueAnswerIds(input.content);
    validatePeriodSections(input.review, input.content);
    if (await this.planner.read(input.review, signal)) {
      throw new ActionPlanError('conflict', 'review');
    }
    if ((input.content.answers ?? []).length > 0) {
      validateKnownAnswerIds(
        input.content,
        await this.planner.configuredQuestions(input.review.period, signal)
      );
    }
    const request: AgentReviewWriteRequest = {
      create: true,
      review: structuredClone(input.review),
      content: structuredClone(input.content),
    };
    return {
      target: reviewIdentityKey(input.review),
      creates: [reviewIdentityKey(input.review)],
      summary: { review: request.review, content: request.content },
      affectedNotes: 1,
      display: describeContent(input.review, input.content),
      execute: (executionSignal) =>
        this.planner.write(request, executionSignal),
    };
  }
}


export class ReviewUpdateAction implements ActionDefinition<'review.update'> {
  private readonly planner: ReviewContentPlanner;

  constructor(private readonly deps: ReviewContentActionDependencies) {
    this.planner = new ReviewContentPlanner(deps);
  }

  async plan(
    input: ActionInput<'review.update'>,
    context: ActionPlanContext
  ): Promise<ActionPlan<'review.update'>> {
    const { signal } = context;
    throwIfAborted(signal);
    validateUniqueAnswerIds(input.content);
    validatePeriodSections(input.review, input.content);
    const record = await this.planner.read(input.review, signal);
    if (!record) throw new ActionPlanError('not_found', 'review');
    if (record.revision !== input.expected_revision) {
      throw new ActionPlanError('conflict', 'expected_revision');
    }
    validateKnownAnswerIds(input.content, record.questionById);
    const request: AgentReviewWriteRequest = {
      create: false,
      review: structuredClone(input.review),
      content: structuredClone(input.content),
      currentRevision: record.revision,
    };
    return {
      target: reviewIdentityKey(input.review),
      writes: [`note:${record.file.path}`],
      summary: {
        review: request.review,
        base_revision: record.revision,
        content: request.content,
      },
      affectedNotes: 1,
      display: describeContent(input.review, input.content),
      execute: async (executionSignal) => {
        const result = await this.planner.write(request, executionSignal);
        if (result.revision === record.revision) {
          return new ActionExecution(result, { restoreInput: 'unchanged' });
        }
        if (context.origin !== 'agent') {
          return new ActionExecution(result, { restoreInput: null });
        }
        return new ActionExecution(result, {
          restoreInput: await this.captureRestore(
            input,
            record,
            result.revision,
            executionSignal
          ),
        });
      },
    };
  }

  
  private async captureRestore(
    input: ActionInput<'review.update'>,
    previous: AgentReviewReadRecord,
    revision: string,
    signal: AbortSignal
  ): Promise<ActionInput<'review.update'> | null> {
    let written: AgentReviewReadRecord | null;
    try {
      written = await this.planner.read(input.review, signal);
    } catch (error) {
      if (!signal.aborted) {
        console.warn('[Journalit] Could not capture a review change:', error);
      }
      return null;
    }
    if (!written || written.revision !== revision) return null;
    return restoringReviewUpdate(
      {
        review: input.review,
        requested: input.content,
        previous,
        written,
      },
      this.deps.hash
    );
  }
}
