import type { AgentReviewPeriod } from './AgentReviewRevision';



export interface AgentReviewGoal {
  readonly text: string;
  readonly done: boolean;
}

export interface AgentReviewChecklistItem {
  readonly text: string;
  readonly done: boolean;
}

interface AgentReviewKeyLevel {
  readonly price: string;
  readonly importance: 'High' | 'Medium' | 'Low' | null;
}

export interface AgentReviewKeyLevels {
  readonly support: readonly AgentReviewKeyLevel[];
  readonly resistance: readonly AgentReviewKeyLevel[];
}


type AgentReviewGrade =
  | 'A'
  | 'B'
  | 'C'
  | 0
  | 0.5
  | 1
  | 1.5
  | 2
  | 2.5
  | 3
  | 3.5
  | 4
  | 4.5
  | 5;

export interface AgentReviewGrades {
  readonly mental: AgentReviewGrade | null;
  readonly technical: AgentReviewGrade | null;
}

export interface AgentReviewContentValue {
  readonly summary: string;
  
  readonly questionEntries: ReadonlyArray<readonly [string, string]>;
  readonly goals: readonly AgentReviewGoal[];
  readonly checklist: readonly AgentReviewChecklistItem[];
  readonly keyLevels: AgentReviewKeyLevels;
  readonly grades: AgentReviewGrades;
  readonly reviewed: boolean;
  
  readonly reviewedRecord: Readonly<Record<string, unknown>> | null;
}


export function reviewHasChecklist(period: AgentReviewPeriod): boolean {
  return period === 'day' || period === 'week';
}

export function reviewHasKeyLevels(period: AgentReviewPeriod): boolean {
  return period === 'day' || period === 'week' || period === 'month';
}

function goalField(period: AgentReviewPeriod): string {
  return period === 'day' ? 'dailyGoals' : `${period}lyGoals`;
}

function goalStatusField(period: AgentReviewPeriod): string {
  return period === 'day' ? 'dailyGoalStatus' : `${period}lyGoalStatus`;
}

const GRADES: ReadonlySet<unknown> = new Set<AgentReviewGrade>([
  'A',
  'B',
  'C',
  0,
  0.5,
  1,
  1.5,
  2,
  2.5,
  3,
  3.5,
  4,
  4.5,
  5,
]);

function isAgentReviewGrade(value: unknown): value is AgentReviewGrade {
  return GRADES.has(value);
}

function hasOwn(
  source: Readonly<Record<string, unknown>>,
  key: string
): boolean {
  return Object.getOwnPropertyDescriptor(source, key) !== undefined;
}

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }
  const prototype: unknown = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}


function readStatuses(
  value: unknown,
  prefix: string,
  length: number,
  strict: boolean
): boolean[] {
  const statuses = Array.from({ length }, () => false);
  if (value === undefined) return statuses;
  if (!isPlainRecord(value)) {
    if (strict) throw new Error('Review content has malformed goal statuses.');
    return statuses;
  }
  for (const [key, status] of Object.entries(value)) {
    const index = Number(key.slice(prefix.length));
    const valid =
      typeof status === 'boolean' &&
      key === `${prefix}${index}` &&
      Number.isInteger(index) &&
      index < length;
    if (!valid) {
      if (strict)
        throw new Error('Review content has malformed goal statuses.');
      continue;
    }
    statuses[index] = status;
  }
  return statuses;
}

function readGoals(
  frontmatter: Readonly<Record<string, unknown>>,
  period: AgentReviewPeriod
): AgentReviewGoal[] {
  const field = goalField(period);
  if (!hasOwn(frontmatter, field)) return [];
  const source = frontmatter[field];
  if (!Array.isArray(source))
    throw new Error('Review content has malformed goals.');
  const goals = source.filter(
    (goal): goal is string => typeof goal === 'string'
  );
  if (goals.length !== source.length)
    throw new Error('Review content has malformed goals.');
  const done = readStatuses(
    frontmatter[goalStatusField(period)],
    'goal_',
    goals.length,
    true
  );
  return goals.map((text, index) => ({ text, done: done[index] }));
}


function readChecklist(
  frontmatter: Readonly<Record<string, unknown>>
): AgentReviewChecklistItem[] {
  const source = frontmatter.checklistItems;
  if (!Array.isArray(source)) return [];
  const texts = source.filter(
    (item): item is string => typeof item === 'string'
  );
  const done = readStatuses(
    frontmatter.checklistStatus,
    'item_',
    texts.length,
    false
  );
  return texts.map((text, index) => ({ text, done: done[index] }));
}

function readKeyLevel(value: unknown): AgentReviewKeyLevel | null {
  if (!isPlainRecord(value)) return null;
  const raw = value.price;
  if (typeof raw !== 'string' && typeof raw !== 'number') return null;
  const price = String(raw).trim();
  if (!price) return null;
  const importance =
    value.importance === 'High' ||
    value.importance === 'Medium' ||
    value.importance === 'Low'
      ? value.importance
      : null;
  return { price, importance };
}


function readKeyLevels(
  frontmatter: Readonly<Record<string, unknown>>
): AgentReviewKeyLevels {
  const source = frontmatter.keyLevels;
  if (
    !isPlainRecord(source) ||
    !Array.isArray(source.support) ||
    !Array.isArray(source.resistance)
  ) {
    return { support: [], resistance: [] };
  }
  const levels = (values: unknown[]) =>
    values.flatMap((level) => {
      const normalized = readKeyLevel(level);
      return normalized ? [normalized] : [];
    });
  return {
    support: levels(source.support),
    resistance: levels(source.resistance),
  };
}

function readGrade(value: unknown): AgentReviewGrade | null {
  return isAgentReviewGrade(value) ? value : null;
}


export function readAgentReviewContent(
  frontmatter: Readonly<Record<string, unknown>>,
  period: AgentReviewPeriod
): AgentReviewContentValue {
  let summary = '';
  if (hasOwn(frontmatter, 'summary')) {
    if (typeof frontmatter.summary !== 'string') {
      throw new Error('Review content has a malformed string field.');
    }
    summary = frontmatter.summary;
  }
  const questionEntries: Array<[string, string]> = [];
  if (hasOwn(frontmatter, 'reviewQuestions')) {
    if (!isPlainRecord(frontmatter.reviewQuestions)) {
      throw new Error('Review content has malformed answers.');
    }
    for (const [label, answer] of Object.entries(frontmatter.reviewQuestions)) {
      if (typeof answer !== 'string') {
        throw new Error('Review content has malformed answers.');
      }
      questionEntries.push([label, answer]);
    }
  }
  return {
    summary,
    questionEntries,
    goals: readGoals(frontmatter, period),
    checklist: reviewHasChecklist(period) ? readChecklist(frontmatter) : [],
    keyLevels: reviewHasKeyLevels(period)
      ? readKeyLevels(frontmatter)
      : { support: [], resistance: [] },
    grades: {
      mental: readGrade(frontmatter.mentalGrade),
      technical: readGrade(frontmatter.technicalGrade),
    },
    ...readReviewed(frontmatter, period),
  };
}


function readReviewed(
  frontmatter: Readonly<Record<string, unknown>>,
  period: AgentReviewPeriod
): Pick<AgentReviewContentValue, 'reviewed' | 'reviewedRecord'> {
  if (period !== 'day') {
    return { reviewed: frontmatter.reviewed === true, reviewedRecord: null };
  }
  const record = isPlainRecord(frontmatter.endOfDayReview)
    ? structuredClone(frontmatter.endOfDayReview)
    : null;
  return { reviewed: record?.reviewed === true, reviewedRecord: record };
}


export function goalUpdates(
  period: AgentReviewPeriod,
  goals: readonly AgentReviewGoal[]
): Record<string, unknown> {
  const statuses: Record<string, boolean> = {};
  goals.forEach((goal, index) => {
    statuses[`goal_${index}`] = goal.done;
  });
  return {
    [goalField(period)]: goals.map((goal) => goal.text),
    [goalStatusField(period)]: statuses,
  };
}


export function checklistUpdates(
  items: readonly AgentReviewChecklistItem[]
): Record<string, unknown> {
  const status: Record<string, boolean> = {};
  items.forEach((item, index) => {
    status[`item_${index}`] = item.done;
  });
  return {
    checklistItems: items.map((item) => item.text),
    checklistStatus: status,
  };
}


export function gradeUpdates(
  grades: Partial<AgentReviewGrades>
): Record<string, unknown> {
  const updates: Record<string, unknown> = {};
  if (grades.mental !== undefined)
    updates.mentalGrade = grades.mental ?? undefined;
  if (grades.technical !== undefined)
    updates.technicalGrade = grades.technical ?? undefined;
  return updates;
}


export function reviewedUpdates(
  period: AgentReviewPeriod,
  reviewed: boolean,
  now: Date,
  reviewedRecord: Readonly<Record<string, unknown>> | null
): Record<string, unknown> {
  const status = { reviewed, reviewedAt: reviewed ? now.toISOString() : null };
  return period === 'day'
    ? { endOfDayReview: { ...reviewedRecord, ...status } }
    : status;
}
