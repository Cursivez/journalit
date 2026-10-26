import type {
  ReviewCreationReceipt,
  ReviewFrontmatterGuard,
  ReviewInitialContent,
} from '../../reviews/ReviewWriteTypes';
import type { AgentActionContracts } from '../protocol/generated/actions.generated';
import {
  AgentReviewReadError,
  type AgentReviewIdentity,
  type AgentReviewReadRecord,
  type AgentReviewReadService,
} from './AgentReviewReadService';
import {
  checklistUpdates,
  goalUpdates,
  gradeUpdates,
  readAgentReviewContent,
  reviewedUpdates,
  reviewHasChecklist,
  reviewHasKeyLevels,
  type AgentReviewContentValue,
} from './AgentReviewContent';
import {
  createAgentReviewQuestionId,
  type AgentReviewAnswer,
  type AgentReviewHash,
  type AgentReviewPeriod,
  webCryptoSha256,
} from './AgentReviewRevision';

type ReviewContent = AgentActionContracts['review.create']['input']['content'];


export type AgentReviewWriteRequest =
  | {
      readonly create: true;
      readonly review: AgentReviewIdentity;
      readonly content: ReviewContent;
    }
  | {
      readonly create: false;
      readonly review: AgentReviewIdentity;
      readonly content: ReviewContent;
      readonly currentRevision: string;
    };

type AgentReviewWriteErrorCode =
  | 'invalid_request'
  | 'not_found'
  | 'conflict'
  | 'limit_exceeded'
  | 'unsupported_capability';

const ERROR_MESSAGES: Record<AgentReviewWriteErrorCode, string> = {
  invalid_request: 'Review mutation request is invalid.',
  not_found: 'Review mutation target was not found.',
  conflict: 'Review mutation conflicts with current content.',
  limit_exceeded: 'Review mutation limit exceeded.',
  unsupported_capability: 'Review mutation capability is not supported.',
};

export class AgentReviewWriteError extends Error {
  constructor(public readonly code: AgentReviewWriteErrorCode) {
    super(ERROR_MESSAGES[code]);
    this.name = 'AgentReviewWriteError';
  }
}

type Updates = Partial<Record<string, unknown>>;

interface AgentReviewPeriodWriteService {
  createWithReceipt(
    date: Date,
    initialContent?: ReviewInitialContent,
    source?: string
  ): Promise<ReviewCreationReceipt>;
  updateFrontmatterGuarded(
    filePath: string,
    updates: Updates,
    guard: ReviewFrontmatterGuard,
    source?: string
  ): Promise<void>;
}

interface DayReviewWriteService {
  createDRCWithReceipt: AgentReviewPeriodWriteService['createWithReceipt'];
  updateDRCFrontmatterGuarded: AgentReviewPeriodWriteService['updateFrontmatterGuarded'];
}

interface WeeklyReviewWriteService {
  createWeeklyReviewWithReceipt: AgentReviewPeriodWriteService['createWithReceipt'];
  updateWeeklyReviewFrontmatterGuarded: AgentReviewPeriodWriteService['updateFrontmatterGuarded'];
}

interface MonthlyReviewWriteService {
  createMonthlyReviewWithReceipt: AgentReviewPeriodWriteService['createWithReceipt'];
  updateMonthlyReviewFrontmatterGuarded: AgentReviewPeriodWriteService['updateFrontmatterGuarded'];
}

interface QuarterlyReviewWriteService {
  createQuarterlyReviewWithReceipt: AgentReviewPeriodWriteService['createWithReceipt'];
  updateQuarterlyReviewFrontmatterGuarded: AgentReviewPeriodWriteService['updateFrontmatterGuarded'];
}

interface YearlyReviewWriteService {
  createYearlyReviewWithReceipt: AgentReviewPeriodWriteService['createWithReceipt'];
  updateYearlyReviewFrontmatterGuarded: AgentReviewPeriodWriteService['updateFrontmatterGuarded'];
}

interface AgentReviewWriteDependencies {
  reviewReadService: Pick<AgentReviewReadService, 'read' | 'parseIdentity'>;
  resolveDrcService: () => Promise<DayReviewWriteService>;
  resolveWeeklyReviewService: () => Promise<WeeklyReviewWriteService>;
  resolveMonthlyReviewService: () => Promise<MonthlyReviewWriteService>;
  resolveQuarterlyReviewService: () => Promise<QuarterlyReviewWriteService>;
  resolveYearlyReviewService: () => Promise<YearlyReviewWriteService>;
  getConfiguredQuestionLabels: (period: AgentReviewPeriod) => readonly string[];
  hash?: AgentReviewHash;
}


interface TargetContent {
  readonly summary: string;
  readonly answers: readonly AgentReviewAnswer[];
  readonly goals: AgentReviewReadRecord['goals'];
  readonly checklist: AgentReviewReadRecord['checklist'];
  readonly keyLevels: AgentReviewReadRecord['keyLevels'];
  readonly grades: AgentReviewReadRecord['grades'];
  readonly reviewed: boolean;
}

function throwIfAborted(signal: AbortSignal): void {
  if (signal.aborted) throw signal.reason;
}

function sortAnswers(answers: AgentReviewAnswer[]): AgentReviewAnswer[] {
  return answers.sort((left, right) =>
    left.question_id < right.question_id
      ? -1
      : left.question_id > right.question_id
        ? 1
        : 0
  );
}


function contentKey(content: TargetContent): string {
  return JSON.stringify({
    summary: content.summary,
    answers: sortAnswers([...content.answers]).map((answer) => [
      answer.question_id,
      answer.answer,
    ]),
    goals: content.goals.map((goal) => [goal.text, goal.done]),
    checklist: content.checklist.map((item) => [item.text, item.done]),
    keyLevels: [content.keyLevels.support, content.keyLevels.resistance].map(
      (levels) => levels.map((level) => [level.price, level.importance])
    ),
    grades: [content.grades.mental, content.grades.technical],
    reviewed: content.reviewed,
  });
}


function widgetKey(content: Omit<TargetContent, 'answers'>): string {
  return contentKey({ ...content, answers: [] });
}

function detachedResult(record: AgentReviewReadRecord): {
  readonly review: AgentReviewIdentity;
  readonly revision: string;
} {
  return {
    review: { period: record.period, period_start: record.period_start },
    revision: record.revision,
  };
}


function applyContent(
  record: TargetContent,
  content: ReviewContent,
  answers: readonly AgentReviewAnswer[]
): TargetContent {
  return {
    summary: content.summary ?? record.summary,
    answers,
    goals: content.goals ?? record.goals,
    checklist: content.checklist ?? record.checklist,
    keyLevels: content.key_levels ?? record.keyLevels,
    grades: {
      mental:
        content.grades?.mental === undefined
          ? record.grades.mental
          : content.grades.mental,
      technical:
        content.grades?.technical === undefined
          ? record.grades.technical
          : content.grades.technical,
    },
    reviewed: content.reviewed ?? record.reviewed,
  };
}


function widgetUpdates(
  record: Pick<AgentReviewReadRecord, 'period' | 'reviewedRecord'>,
  content: ReviewContent,
  now: Date
): Updates {
  const { period } = record;
  if (content.checklist !== undefined && !reviewHasChecklist(period)) {
    throw new AgentReviewWriteError('unsupported_capability');
  }
  if (content.key_levels !== undefined && !reviewHasKeyLevels(period)) {
    throw new AgentReviewWriteError('unsupported_capability');
  }
  return {
    ...(content.summary === undefined ? {} : { summary: content.summary }),
    ...(content.goals === undefined ? {} : goalUpdates(period, content.goals)),
    ...(content.checklist === undefined
      ? {}
      : checklistUpdates(content.checklist)),
    ...(content.key_levels === undefined
      ? {}
      : {
          keyLevels: {
            support: content.key_levels.support.map((level) => ({ ...level })),
            resistance: content.key_levels.resistance.map((level) => ({
              ...level,
            })),
          },
        }),
    ...(content.grades === undefined ? {} : gradeUpdates(content.grades)),
    ...(content.reviewed === undefined
      ? {}
      : reviewedUpdates(period, content.reviewed, now, record.reviewedRecord)),
  };
}

export class AgentReviewWriteService {
  private readonly hash: AgentReviewHash;

  constructor(private readonly dependencies: AgentReviewWriteDependencies) {
    this.hash = dependencies.hash ?? webCryptoSha256;
  }

  async write(
    preview: AgentReviewWriteRequest,
    signal?: AbortSignal
  ): Promise<{
    readonly review: AgentReviewIdentity;
    readonly revision: string;
  }> {
    const activeSignal = signal ?? new AbortController().signal;
    throwIfAborted(activeSignal);
    return preview.create
      ? this.create(preview, activeSignal)
      : this.update(preview, activeSignal);
  }

  
  updateFrontmatterGuarded(
    period: AgentReviewPeriod,
    filePath: string,
    updates: Updates,
    guard: ReviewFrontmatterGuard
  ): Promise<void> {
    return this.periodService(period).updateFrontmatterGuarded(
      filePath,
      updates,
      guard,
      'agent'
    );
  }

  private async read(
    identity: AgentReviewIdentity,
    signal: AbortSignal
  ): Promise<AgentReviewReadRecord | null> {
    throwIfAborted(signal);
    try {
      const record = await this.dependencies.reviewReadService.read(
        identity,
        signal
      );
      throwIfAborted(signal);
      return record;
    } catch (error) {
      throwIfAborted(signal);
      if (error instanceof AgentReviewReadError) {
        throw new AgentReviewWriteError(error.code);
      }
      throw error;
    }
  }

  private parseDate(identity: AgentReviewIdentity, signal: AbortSignal): Date {
    throwIfAborted(signal);
    try {
      const date = this.dependencies.reviewReadService.parseIdentity(identity);
      throwIfAborted(signal);
      return date;
    } catch (error) {
      throwIfAborted(signal);
      if (error instanceof AgentReviewReadError) {
        throw new AgentReviewWriteError(error.code);
      }
      throw error;
    }
  }

  private periodService(
    period: AgentReviewPeriod
  ): AgentReviewPeriodWriteService {
    switch (period) {
      case 'day':
        return {
          createWithReceipt: (...args) =>
            this.dependencies
              .resolveDrcService()
              .then((service) => service.createDRCWithReceipt(...args)),
          updateFrontmatterGuarded: (...args) =>
            this.dependencies
              .resolveDrcService()
              .then((service) => service.updateDRCFrontmatterGuarded(...args)),
        };
      case 'week':
        return {
          createWithReceipt: (...args) =>
            this.dependencies
              .resolveWeeklyReviewService()
              .then((service) =>
                service.createWeeklyReviewWithReceipt(...args)
              ),
          updateFrontmatterGuarded: (...args) =>
            this.dependencies
              .resolveWeeklyReviewService()
              .then((service) =>
                service.updateWeeklyReviewFrontmatterGuarded(...args)
              ),
        };
      case 'month':
        return {
          createWithReceipt: (...args) =>
            this.dependencies
              .resolveMonthlyReviewService()
              .then((service) =>
                service.createMonthlyReviewWithReceipt(...args)
              ),
          updateFrontmatterGuarded: (...args) =>
            this.dependencies
              .resolveMonthlyReviewService()
              .then((service) =>
                service.updateMonthlyReviewFrontmatterGuarded(...args)
              ),
        };
      case 'quarter':
        return {
          createWithReceipt: (...args) =>
            this.dependencies
              .resolveQuarterlyReviewService()
              .then((service) =>
                service.createQuarterlyReviewWithReceipt(...args)
              ),
          updateFrontmatterGuarded: (...args) =>
            this.dependencies
              .resolveQuarterlyReviewService()
              .then((service) =>
                service.updateQuarterlyReviewFrontmatterGuarded(...args)
              ),
        };
      case 'year':
        return {
          createWithReceipt: (...args) =>
            this.dependencies
              .resolveYearlyReviewService()
              .then((service) =>
                service.createYearlyReviewWithReceipt(...args)
              ),
          updateFrontmatterGuarded: (...args) =>
            this.dependencies
              .resolveYearlyReviewService()
              .then((service) =>
                service.updateYearlyReviewFrontmatterGuarded(...args)
              ),
        };
    }
  }

  private async update(
    preview: Extract<AgentReviewWriteRequest, { create: false }>,
    signal: AbortSignal
  ): Promise<{
    readonly review: AgentReviewIdentity;
    readonly revision: string;
  }> {
    const record = await this.read(preview.review, signal);
    throwIfAborted(signal);
    if (!record) throw new AgentReviewWriteError('not_found');
    if (record.revision !== preview.currentRevision) {
      throw new AgentReviewWriteError('conflict');
    }

    const answerById = new Map(
      record.answers.map((answer) => [answer.question_id, answer.answer])
    );
    for (const answer of preview.content.answers ?? []) {
      if (!record.questionById.has(answer.question_id)) {
        throw new AgentReviewWriteError('conflict');
      }
      answerById.set(answer.question_id, answer.answer);
    }
    const answers = sortAnswers(
      [...answerById].map(([question_id, answer]) => ({ question_id, answer }))
    );
    const target = applyContent(record, preview.content, answers);

    const updates = widgetUpdates(record, preview.content, new Date());
    if (preview.content.answers && preview.content.answers.length > 0) {
      const reviewQuestions: Record<string, string> = {};
      for (const [questionId, label] of record.questionById) {
        const answer = answerById.get(questionId);
        if (answer === undefined) throw new AgentReviewWriteError('conflict');
        reviewQuestions[label] = answer;
      }
      updates.reviewQuestions = reviewQuestions;
    }
    if (contentKey(target) === contentKey(record)) {
      return detachedResult(record);
    }

    try {
      await this.periodService(record.period).updateFrontmatterGuarded(
        record.file.path,
        updates,
        this.createGuard(record),
        'agent'
      );
      throwIfAborted(signal);
    } catch (error) {
      throwIfAborted(signal);
      return this.reconcileUpdate(
        preview.review,
        record,
        target,
        error,
        signal
      );
    }
    return this.settle(preview.review, target, signal);
  }

  
  private createGuard(record: AgentReviewReadRecord): ReviewFrontmatterGuard {
    const expectedQuestions = new Map<string, string>();
    for (const answer of record.answers) {
      const label = record.questionById.get(answer.question_id);
      if (label === undefined) throw new AgentReviewWriteError('conflict');
      expectedQuestions.set(label, answer.answer);
    }
    const expectedWidgets = widgetKey(record);
    
    const expectedReviewedRecord = JSON.stringify(record.reviewedRecord);
    return (frontmatter) => {
      let current: AgentReviewContentValue;
      try {
        current = readAgentReviewContent(frontmatter, record.period);
      } catch {
        throw new AgentReviewWriteError('conflict');
      }
      const currentQuestions = new Map(current.questionEntries);
      const questionsMatch =
        currentQuestions.size === expectedQuestions.size &&
        [...expectedQuestions].every(
          ([label, answer]) => currentQuestions.get(label) === answer
        );
      if (
        !questionsMatch ||
        widgetKey(current) !== expectedWidgets ||
        JSON.stringify(current.reviewedRecord) !== expectedReviewedRecord
      ) {
        throw new AgentReviewWriteError('conflict');
      }
    };
  }

  private async create(
    preview: Extract<AgentReviewWriteRequest, { create: true }>,
    signal: AbortSignal
  ): Promise<{
    readonly review: AgentReviewIdentity;
    readonly revision: string;
  }> {
    const date = this.parseDate(preview.review, signal);
    const existing = await this.read(preview.review, signal);
    throwIfAborted(signal);
    if (existing) throw new AgentReviewWriteError('conflict');

    let reviewQuestions: Record<string, string> | undefined;
    let expectedAnswers: AgentReviewAnswer[] | undefined;
    if (preview.content.answers && preview.content.answers.length > 0) {
      const configured = await this.configuredQuestions(
        preview.review.period,
        signal
      );
      const answerById = new Map<string, string>();
      for (const questionId of configured.keys())
        answerById.set(questionId, '');
      for (const answer of preview.content.answers) {
        if (!configured.has(answer.question_id)) {
          throw new AgentReviewWriteError('conflict');
        }
        answerById.set(answer.question_id, answer.answer);
      }
      reviewQuestions = {};
      for (const [questionId, label] of configured) {
        reviewQuestions[label] = answerById.get(questionId) ?? '';
      }
      expectedAnswers = sortAnswers(
        [...answerById].map(([question_id, answer]) => ({
          question_id,
          answer,
        }))
      );
    }

    
    
    
    const { content } = preview;
    const hasWidgetContent =
      content.checklist !== undefined ||
      content.key_levels !== undefined ||
      content.grades !== undefined ||
      content.reviewed !== undefined ||
      (content.goals ?? []).some((goal) => goal.done);
    const initialContent: ReviewInitialContent = {
      ...(content.summary === undefined ? {} : { summary: content.summary }),
      ...(reviewQuestions === undefined ? {} : { reviewQuestions }),
      ...(content.goals === undefined
        ? {}
        : { goals: content.goals.map((goal) => goal.text) }),
      ...(hasWidgetContent
        ? {
            frontmatter: widgetUpdates(
              
              { period: preview.review.period, reviewedRecord: null },
              {
                goals: content.goals,
                checklist: content.checklist,
                key_levels: content.key_levels,
                grades: content.grades,
                reviewed: content.reviewed,
              },
              new Date()
            ),
          }
        : {}),
    };

    const matchesCreate = (record: AgentReviewReadRecord): boolean => {
      const target = applyContent(
        record,
        preview.content,
        expectedAnswers ?? record.answers
      );
      return contentKey(target) === contentKey(record);
    };

    let receipt: ReviewCreationReceipt;
    try {
      receipt = await this.periodService(
        preview.review.period
      ).createWithReceipt(date, initialContent, 'agent');
      throwIfAborted(signal);
    } catch (error) {
      throwIfAborted(signal);
      return this.reconcileCreate(preview.review, matchesCreate, error, signal);
    }
    if (!receipt.created) {
      
      
      await this.read(preview.review, signal);
      throwIfAborted(signal);
      throw new AgentReviewWriteError('conflict');
    }
    return this.settleWith(preview.review, matchesCreate, signal);
  }

  private async configuredQuestions(
    period: AgentReviewPeriod,
    signal: AbortSignal
  ): Promise<Map<string, string>> {
    throwIfAborted(signal);
    const configured = new Map<string, string>();
    for (const label of this.dependencies.getConfiguredQuestionLabels(period)) {
      throwIfAborted(signal);
      const questionId = await createAgentReviewQuestionId(
        period,
        label,
        this.hash
      );
      throwIfAborted(signal);
      const existingLabel = configured.get(questionId);
      if (existingLabel !== undefined && existingLabel !== label) {
        throw new Error('Review question identity collision detected.');
      }
      configured.set(questionId, label);
    }
    return configured;
  }

  private async settle(
    identity: AgentReviewIdentity,
    target: TargetContent,
    signal: AbortSignal
  ): Promise<{
    readonly review: AgentReviewIdentity;
    readonly revision: string;
  }> {
    return this.settleWith(
      identity,
      (record) => contentKey(record) === contentKey(target),
      signal
    );
  }

  private async settleWith(
    identity: AgentReviewIdentity,
    matches: (record: AgentReviewReadRecord) => boolean,
    signal: AbortSignal
  ): Promise<{
    readonly review: AgentReviewIdentity;
    readonly revision: string;
  }> {
    const record = await this.read(identity, signal);
    throwIfAborted(signal);
    if (!record) throw new AgentReviewWriteError('not_found');
    if (!matches(record)) throw new AgentReviewWriteError('conflict');
    return detachedResult(record);
  }

  private async reconcileUpdate(
    identity: AgentReviewIdentity,
    original: AgentReviewReadRecord,
    target: TargetContent,
    originalError: unknown,
    signal: AbortSignal
  ): Promise<{
    readonly review: AgentReviewIdentity;
    readonly revision: string;
  }> {
    let record: AgentReviewReadRecord | null;
    try {
      record = await this.read(identity, signal);
      throwIfAborted(signal);
    } catch {
      throwIfAborted(signal);
      throw originalError;
    }
    if (!record) throw new AgentReviewWriteError('not_found');
    if (contentKey(record) === contentKey(target))
      return detachedResult(record);
    if (contentKey(record) === contentKey(original)) throw originalError;
    throw new AgentReviewWriteError('conflict');
  }

  private async reconcileCreate(
    identity: AgentReviewIdentity,
    matches: (record: AgentReviewReadRecord) => boolean,
    originalError: unknown,
    signal: AbortSignal
  ): Promise<{
    readonly review: AgentReviewIdentity;
    readonly revision: string;
  }> {
    let record: AgentReviewReadRecord | null;
    try {
      record = await this.read(identity, signal);
      throwIfAborted(signal);
    } catch {
      throwIfAborted(signal);
      throw originalError;
    }
    if (!record) throw originalError;
    if (!matches(record)) throw new AgentReviewWriteError('conflict');
    return detachedResult(record);
  }
}
