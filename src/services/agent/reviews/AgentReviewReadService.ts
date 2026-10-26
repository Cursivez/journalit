import { TFile, normalizePath, type App } from 'obsidian';
import type JournalitPlugin from '../../../main';
import type { FolderPathService } from '../../core/FolderPathService';
import { getTradingDayRange } from '../../../utils/tradingDayUtils';

import {
  getWeekAnchorDate,
  getWeekStartDate,
  getWeekStringForDate,
  getISOWeekThursday,
  type WeekStartDaySetting,
} from '../../../utils/dateUtils';
import {
  createAgentReviewQuestionId,
  createAgentReviewRevision,
  type AgentReviewAnswer,
  type AgentReviewHash,
  type AgentReviewPeriod,
  type AgentReviewRevisionContent,
  webCryptoSha256,
} from './AgentReviewRevision';
import {
  readAgentReviewContent,
  type AgentReviewChecklistItem,
  type AgentReviewContentValue,
  type AgentReviewGoal,
  type AgentReviewGrades,
  type AgentReviewKeyLevels,
} from './AgentReviewContent';

const INVALID_REQUEST_MESSAGE = 'Invalid review read request.';
const LIMIT_EXCEEDED_MESSAGE = 'Review content limit exceeded.';
const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const MAX_SUMMARY_CODE_POINTS = 20_000;
const MAX_ANSWERS = 100;
const MAX_ANSWER_CODE_POINTS = 10_000;
const MAX_GOALS = 100;
const MAX_GOAL_CODE_POINTS = 1_000;
const MAX_CHECKLIST_ITEMS = 100;
const MAX_CHECKLIST_CODE_POINTS = 500;
const MAX_KEY_LEVELS = 50;
const MAX_KEY_LEVEL_CODE_POINTS = 40;

export interface AgentReviewIdentity {
  readonly period: AgentReviewPeriod;
  readonly period_start: string;
}

export interface AgentReviewReadRecord extends AgentReviewIdentity {
  
  readonly file: TFile;
  
  readonly questionById: ReadonlyMap<string, string>;
  
  readonly analyticsFrom: Date;
  readonly analyticsTo: Date;
  readonly revision: string;
  readonly summary: string;
  readonly answers: readonly AgentReviewAnswer[];
  readonly goals: readonly AgentReviewGoal[];
  readonly checklist: readonly AgentReviewChecklistItem[];
  readonly keyLevels: AgentReviewKeyLevels;
  readonly grades: AgentReviewGrades;
  readonly reviewed: boolean;
  
  readonly reviewedRecord: Readonly<Record<string, unknown>> | null;
}

export class AgentReviewReadError extends Error {
  constructor(public readonly code: 'invalid_request' | 'limit_exceeded') {
    super(
      code === 'invalid_request'
        ? INVALID_REQUEST_MESSAGE
        : LIMIT_EXCEEDED_MESSAGE
    );
    this.name = 'AgentReviewReadError';
  }
}

export interface AgentReviewReadDependencies {
  app: Pick<App, 'vault'>;
  plugin: Pick<JournalitPlugin, 'settings'>;
  folderPathService: Pick<FolderPathService, 'journalFolderPath'>;
  resolveDayPath: (date: Date) => Promise<string>;
  resolveWeeklyPath: (date: Date) => Promise<string>;
  resolveMonthlyPath: (date: Date) => Promise<string>;
  resolveQuarterlyPath: (date: Date) => Promise<string>;
  resolveYearlyPath: (date: Date) => Promise<string>;
  readFrontmatter: (file: TFile) => Promise<Readonly<Record<string, unknown>>>;
  hash?: AgentReviewHash;
}

interface ResolvedReview {
  file: TFile;
  frontmatter: Readonly<Record<string, unknown>>;
}

interface ParsedIdentity extends AgentReviewIdentity {
  date: Date;
}

class AgentReviewReadRecordValue implements AgentReviewReadRecord {
  readonly #file: TFile;
  readonly #questionById: ReadonlyMap<string, string>;
  readonly #analyticsFrom: Date;
  readonly #analyticsTo: Date;
  readonly #reviewedRecord: Readonly<Record<string, unknown>> | null;

  constructor(
    identity: AgentReviewIdentity,
    content: AgentReviewRevisionContent,
    revision: string,
    file: TFile,
    questionById: ReadonlyMap<string, string>,
    analyticsFrom: Date,
    analyticsTo: Date,
    reviewedRecord: Readonly<Record<string, unknown>> | null
  ) {
    this.period = identity.period;
    this.period_start = identity.period_start;
    this.revision = revision;
    this.summary = content.summary;
    this.answers = content.answers;
    this.goals = content.goals;
    this.checklist = content.checklist;
    this.keyLevels = content.keyLevels;
    this.grades = content.grades;
    this.reviewed = content.reviewed;
    this.#file = file;
    this.#questionById = questionById;
    this.#analyticsFrom = analyticsFrom;
    this.#analyticsTo = analyticsTo;
    this.#reviewedRecord = reviewedRecord;
  }

  readonly period: AgentReviewPeriod;
  readonly period_start: string;
  readonly revision: string;
  readonly summary: string;
  readonly answers: readonly AgentReviewAnswer[];
  readonly goals: readonly AgentReviewGoal[];
  readonly checklist: readonly AgentReviewChecklistItem[];
  readonly keyLevels: AgentReviewKeyLevels;
  readonly grades: AgentReviewGrades;
  readonly reviewed: boolean;

  get file(): TFile {
    return this.#file;
  }

  get questionById(): ReadonlyMap<string, string> {
    return this.#questionById;
  }

  get analyticsFrom(): Date {
    return this.#analyticsFrom;
  }

  get analyticsTo(): Date {
    return this.#analyticsTo;
  }

  get reviewedRecord(): Readonly<Record<string, unknown>> | null {
    return this.#reviewedRecord;
  }
}

function throwIfAborted(signal: AbortSignal): void {
  if (signal.aborted) {
    const reason: unknown = signal.reason;
    throw reason;
  }
}

function codePointLength(value: string): number {
  return Array.from(value).length;
}

function formatLocalDate(date: Date): string {
  const year = String(date.getFullYear()).padStart(4, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseLocalDate(value: unknown): Date | null {
  if (typeof value !== 'string') return null;
  const match = DATE_PATTERN.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(0);
  date.setFullYear(year, month - 1, day);
  date.setHours(0, 0, 0, 0);
  return date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
    ? date
    : null;
}

function configuredWeekStart(
  plugin: Pick<JournalitPlugin, 'settings'>
): WeekStartDaySetting {
  return plugin.settings.trade?.weekStartDay ?? 'monday';
}

function parseIdentity(
  identity: AgentReviewIdentity,
  plugin: Pick<JournalitPlugin, 'settings'>
): ParsedIdentity {
  if (
    identity === null ||
    typeof identity !== 'object' ||
    !['day', 'week', 'month', 'quarter', 'year'].includes(identity.period) ||
    typeof identity.period_start !== 'string'
  ) {
    throw new AgentReviewReadError('invalid_request');
  }
  const date = parseLocalDate(identity.period_start);
  if (!date) throw new AgentReviewReadError('invalid_request');
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const aligned = (() => {
    switch (identity.period) {
      case 'day':
        return true;
      case 'week':
        return (
          formatLocalDate(
            getWeekStartDate(date, configuredWeekStart(plugin))
          ) === identity.period_start
        );
      case 'month':
        return day === 1;
      case 'quarter':
        return day === 1 && [1, 4, 7, 10].includes(month);
      case 'year':
        return month === 1 && day === 1;
    }
  })();
  if (!aligned) throw new AgentReviewReadError('invalid_request');
  return { ...identity, date };
}

function analyticsRange(
  identity: ParsedIdentity,
  plugin: Pick<JournalitPlugin, 'settings'>
): { from: Date; to: Date } {
  const date = identity.date;
  let from: Date;
  let to: Date;
  switch (identity.period) {
    case 'day': {
      const noonAnchor = new Date(date);
      noonAnchor.setHours(12, 0, 0, 0);
      const range = getTradingDayRange(noonAnchor, plugin);
      from = range.start;
      
      to = new Date(range.end.getTime() - 1);
      break;
    }
    case 'week':
      from = new Date(date);
      to = new Date(date);
      to.setDate(to.getDate() + 6);
      to.setHours(23, 59, 59, 999);
      break;
    case 'month':
      from = new Date(date.getFullYear(), date.getMonth(), 1);
      to = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
      );
      break;
    case 'quarter':
      from = new Date(date.getFullYear(), date.getMonth(), 1);
      to = new Date(
        date.getFullYear(),
        date.getMonth() + 3,
        0,
        23,
        59,
        59,
        999
      );
      break;
    case 'year':
      from = new Date(date.getFullYear(), 0, 1);
      to = new Date(date.getFullYear(), 11, 31, 23, 59, 59, 999);
      break;
  }
  if (
    !Number.isFinite(from.getTime()) ||
    !Number.isFinite(to.getTime()) ||
    from.getTime() > to.getTime()
  ) {
    throw new Error('Review analytics range is invalid.');
  }
  return { from, to };
}

function comparePaths(left: TFile, right: TFile): number {
  return left.path < right.path ? -1 : left.path > right.path ? 1 : 0;
}


function enforceLimits(content: AgentReviewContentValue): void {
  const levels = [
    ...content.keyLevels.support,
    ...content.keyLevels.resistance,
  ];
  if (
    codePointLength(content.summary) > MAX_SUMMARY_CODE_POINTS ||
    content.questionEntries.length > MAX_ANSWERS ||
    content.questionEntries.some(
      ([, answer]) => codePointLength(answer) > MAX_ANSWER_CODE_POINTS
    ) ||
    content.goals.length > MAX_GOALS ||
    content.goals.some(
      (goal) =>
        goal.text === '' || codePointLength(goal.text) > MAX_GOAL_CODE_POINTS
    ) ||
    content.checklist.length > MAX_CHECKLIST_ITEMS ||
    content.checklist.some(
      (item) =>
        item.text === '' ||
        codePointLength(item.text) > MAX_CHECKLIST_CODE_POINTS
    ) ||
    content.keyLevels.support.length > MAX_KEY_LEVELS ||
    content.keyLevels.resistance.length > MAX_KEY_LEVELS ||
    levels.some(
      (level) => codePointLength(level.price) > MAX_KEY_LEVEL_CODE_POINTS
    )
  ) {
    throw new AgentReviewReadError('limit_exceeded');
  }
}


function reviewIdentityCandidate(
  frontmatter: Readonly<Record<string, unknown>>
): AgentReviewIdentity | null {
  const year = frontmatter.year;
  switch (frontmatter.type) {
    case 'drc':
      return typeof frontmatter.date === 'string'
        ? { period: 'day', period_start: frontmatter.date }
        : null;
    case 'weekly-review':
      return typeof frontmatter.date === 'string'
        ? { period: 'week', period_start: frontmatter.date }
        : null;
    case 'monthly-review':
      return typeof year === 'number' && typeof frontmatter.month === 'number'
        ? {
            period: 'month',
            period_start: `${String(year).padStart(4, '0')}-${String(frontmatter.month).padStart(2, '0')}-01`,
          }
        : null;
    case 'quarterly-review':
      return typeof year === 'number' && typeof frontmatter.quarter === 'number'
        ? {
            period: 'quarter',
            period_start: `${String(year).padStart(4, '0')}-${String((frontmatter.quarter - 1) * 3 + 1).padStart(2, '0')}-01`,
          }
        : null;
    case 'yearly-review':
      return typeof year === 'number'
        ? {
            period: 'year',
            period_start: `${String(year).padStart(4, '0')}-01-01`,
          }
        : null;
    default:
      return null;
  }
}

export class AgentReviewReadService {
  private readonly hash: AgentReviewHash;

  constructor(private readonly dependencies: AgentReviewReadDependencies) {
    this.hash = dependencies.hash ?? webCryptoSha256;
  }

  parseIdentity(identity: AgentReviewIdentity): Date {
    return parseIdentity(identity, this.dependencies.plugin).date;
  }

  
  identityForDate(
    period: AgentReviewIdentity['period'],
    value: string
  ): AgentReviewIdentity | null {
    const date = parseLocalDate(value);
    if (!date) return null;
    let start: Date;
    switch (period) {
      case 'day':
        start = date;
        break;
      case 'week':
        start = getWeekStartDate(
          date,
          configuredWeekStart(this.dependencies.plugin)
        );
        break;
      case 'month':
        start = new Date(date.getFullYear(), date.getMonth(), 1);
        break;
      case 'quarter':
        start = new Date(
          date.getFullYear(),
          Math.floor(date.getMonth() / 3) * 3,
          1
        );
        break;
      case 'year':
        start = new Date(date.getFullYear(), 0, 1);
        break;
    }
    return { period, period_start: formatLocalDate(start) };
  }

  async read(
    identity: AgentReviewIdentity,
    signal: AbortSignal
  ): Promise<AgentReviewReadRecord | null> {
    throwIfAborted(signal);
    const parsedIdentity = { ...identity, date: this.parseIdentity(identity) };
    const resolved = await this.resolveReview(parsedIdentity, signal);
    throwIfAborted(signal);
    if (!resolved) return null;

    const projected = readAgentReviewContent(
      resolved.frontmatter,
      parsedIdentity.period
    );
    enforceLimits(projected);

    const answers: AgentReviewAnswer[] = [];
    const questionById = new Map<string, string>();
    for (const [label, answer] of projected.questionEntries) {
      throwIfAborted(signal);
      const questionId = await createAgentReviewQuestionId(
        parsedIdentity.period,
        label,
        this.hash
      );
      throwIfAborted(signal);
      const existingLabel = questionById.get(questionId);
      if (existingLabel !== undefined && existingLabel !== label) {
        throw new Error('Review question identity collision detected.');
      }
      questionById.set(questionId, label);
      answers.push({ question_id: questionId, answer });
    }
    answers.sort((left, right) =>
      left.question_id < right.question_id
        ? -1
        : left.question_id > right.question_id
          ? 1
          : 0
    );

    const content: AgentReviewRevisionContent = {
      summary: projected.summary,
      answers,
      goals: projected.goals,
      checklist: projected.checklist,
      keyLevels: projected.keyLevels,
      grades: projected.grades,
      reviewed: projected.reviewed,
    };
    throwIfAborted(signal);
    const revision = await createAgentReviewRevision(content, this.hash);
    throwIfAborted(signal);
    const range = analyticsRange(parsedIdentity, this.dependencies.plugin);
    return new AgentReviewReadRecordValue(
      parsedIdentity,
      content,
      revision,
      resolved.file,
      questionById,
      range.from,
      range.to,
      projected.reviewedRecord
    );
  }

  async resolveFile(
    identity: AgentReviewIdentity,
    signal: AbortSignal
  ): Promise<TFile | null> {
    throwIfAborted(signal);
    const parsedIdentity = { ...identity, date: this.parseIdentity(identity) };
    const resolved = await this.resolveReview(parsedIdentity, signal);
    throwIfAborted(signal);
    return resolved?.file ?? null;
  }

  
  async identifyFile(
    file: TFile,
    signal: AbortSignal
  ): Promise<AgentReviewIdentity | null> {
    throwIfAborted(signal);
    const frontmatter = await this.dependencies.readFrontmatter(file);
    throwIfAborted(signal);
    const candidate = reviewIdentityCandidate(frontmatter);
    if (!candidate) return null;
    let resolved: TFile | null;
    try {
      resolved = await this.resolveFile(candidate, signal);
    } catch (error) {
      throwIfAborted(signal);
      if (error instanceof AgentReviewReadError) return null;
      throw error;
    }
    return resolved?.path === file.path ? candidate : null;
  }

  
  async readDayFrontmatterBetween(
    from: string,
    to: string,
    signal: AbortSignal
  ): Promise<Map<string, Readonly<Record<string, unknown>>>> {
    throwIfAborted(signal);
    const start = parseLocalDate(from);
    const end = parseLocalDate(to);
    if (!start || !end) throw new AgentReviewReadError('invalid_request');
    const candidates = new Map<string, TFile>();
    for (
      const day = new Date(start);
      day.getTime() <= end.getTime();
      day.setDate(day.getDate() + 1)
    ) {
      const exactPath = await this.dependencies.resolveDayPath(new Date(day));
      throwIfAborted(signal);
      const exactFile =
        this.dependencies.app.vault.getAbstractFileByPath(exactPath);
      if (exactFile instanceof TFile) candidates.set(exactFile.path, exactFile);
    }
    for (const file of this.journalDayReviewCandidates()) {
      candidates.set(file.path, file);
    }

    const byDate = new Map<string, Readonly<Record<string, unknown>> | null>();
    for (const file of [...candidates.values()].sort(comparePaths)) {
      throwIfAborted(signal);
      const frontmatter = await this.dependencies.readFrontmatter(file);
      throwIfAborted(signal);
      const date = frontmatter.date;
      if (
        frontmatter.type !== 'drc' ||
        typeof date !== 'string' ||
        parseLocalDate(date) === null ||
        date < from ||
        date > to
      ) {
        continue;
      }
      byDate.set(date, byDate.has(date) ? null : frontmatter);
    }
    const result = new Map<string, Readonly<Record<string, unknown>>>();
    for (const [date, frontmatter] of byDate) {
      if (frontmatter !== null) result.set(date, frontmatter);
    }
    return result;
  }

  private journalDayReviewCandidates(): TFile[] {
    const journalPath = normalizePath(
      this.dependencies.folderPathService.journalFolderPath
    );
    return this.dependencies.app.vault.getMarkdownFiles().filter((file) => {
      const normalizedFilePath = normalizePath(file.path);
      return (
        file.basename.startsWith('DRC') &&
        (normalizedFilePath === journalPath ||
          normalizedFilePath.startsWith(`${journalPath}/`))
      );
    });
  }

  private async resolveReview(
    identity: ParsedIdentity,
    signal: AbortSignal
  ): Promise<ResolvedReview | null> {
    if (identity.period === 'day') {
      return this.resolveDay(identity, signal);
    }

    const path = await this.getPeriodicPath(identity, signal);
    throwIfAborted(signal);
    const abstractFile =
      this.dependencies.app.vault.getAbstractFileByPath(path);
    if (!(abstractFile instanceof TFile)) return null;
    const frontmatter = await this.dependencies.readFrontmatter(abstractFile);
    throwIfAborted(signal);
    return this.matchesPeriodicIdentity(frontmatter, identity)
      ? { file: abstractFile, frontmatter }
      : null;
  }

  private async resolveDay(
    identity: ParsedIdentity,
    signal: AbortSignal
  ): Promise<ResolvedReview | null> {
    const candidates = new Map<string, TFile>();
    const exactPath = await this.dependencies.resolveDayPath(identity.date);
    throwIfAborted(signal);
    const exactFile =
      this.dependencies.app.vault.getAbstractFileByPath(exactPath);
    if (exactFile instanceof TFile) candidates.set(exactFile.path, exactFile);

    for (const file of this.journalDayReviewCandidates()) {
      candidates.set(file.path, file);
    }

    const matches: ResolvedReview[] = [];
    for (const file of [...candidates.values()].sort(comparePaths)) {
      throwIfAborted(signal);
      const frontmatter = await this.dependencies.readFrontmatter(file);
      throwIfAborted(signal);
      if (
        frontmatter.type === 'drc' &&
        frontmatter.date === identity.period_start
      ) {
        matches.push({ file, frontmatter });
      }
    }
    if (matches.length > 1) {
      throw new Error('Multiple daily review notes match the requested date.');
    }
    return matches[0] ?? null;
  }

  private async getPeriodicPath(
    identity: ParsedIdentity,
    signal: AbortSignal
  ): Promise<string> {
    throwIfAborted(signal);
    switch (identity.period) {
      case 'week':
        return this.resolvePath(
          this.dependencies.resolveWeeklyPath(identity.date),
          signal
        );
      case 'month':
        return this.resolvePath(
          this.dependencies.resolveMonthlyPath(identity.date),
          signal
        );
      case 'quarter':
        return this.resolvePath(
          this.dependencies.resolveQuarterlyPath(identity.date),
          signal
        );
      case 'year':
        return this.resolvePath(
          this.dependencies.resolveYearlyPath(identity.date),
          signal
        );
      case 'day':
        throw new Error('Daily reviews do not use periodic path resolution.');
    }
  }

  private async resolvePath(
    pendingPath: Promise<string>,
    signal: AbortSignal
  ): Promise<string> {
    const path = await pendingPath;
    throwIfAborted(signal);
    return path;
  }

  private matchesPeriodicIdentity(
    frontmatter: Readonly<Record<string, unknown>>,
    identity: ParsedIdentity
  ): boolean {
    const year = identity.date.getFullYear();
    const month = identity.date.getMonth() + 1;
    switch (identity.period) {
      case 'week': {
        const weekStart = configuredWeekStart(this.dependencies.plugin);
        const anchor = getWeekAnchorDate(identity.date, weekStart);
        const thursday = getISOWeekThursday(anchor);
        return (
          frontmatter.type === 'weekly-review' &&
          frontmatter.date === identity.period_start &&
          frontmatter.week === getWeekStringForDate(anchor) &&
          
          Number(frontmatter.month) === thursday.getMonth() + 1 &&
          Number(frontmatter.year) === thursday.getFullYear()
        );
      }
      case 'month': {
        const storedDate = parseLocalDate(frontmatter.date);
        return (
          frontmatter.type === 'monthly-review' &&
          frontmatter.month === month &&
          frontmatter.year === year &&
          storedDate !== null &&
          storedDate.getMonth() === month - 1 &&
          storedDate.getFullYear() === year
        );
      }
      case 'quarter': {
        const quarter = Math.floor((month - 1) / 3) + 1;
        const storedDate = parseLocalDate(frontmatter.date);
        return (
          frontmatter.type === 'quarterly-review' &&
          frontmatter.quarter === quarter &&
          frontmatter.year === year &&
          storedDate !== null &&
          storedDate.getFullYear() === year &&
          Math.floor(storedDate.getMonth() / 3) + 1 === quarter
        );
      }
      case 'year': {
        const storedDate = parseLocalDate(frontmatter.date);
        return (
          frontmatter.type === 'yearly-review' &&
          frontmatter.year === year &&
          storedDate !== null &&
          storedDate.getFullYear() === year
        );
      }
      case 'day':
        return false;
    }
  }
}
