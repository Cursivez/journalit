import {
  AgentResultCacheError,
  type AgentResultCache,
} from '../AgentResultCache';
import type { AgentToolHandler } from '../AgentToolRegistry';
import { setupReadErrorResult } from './setupReadError';
import type { AgentAnalyticsReadService } from '../analytics';
import {
  agentContractManifest,
  parseAgentToolRequest,
  parseAgentToolResult,
} from '../protocol';
import type { GetReviewRequest } from '../protocol/generated/get_review.request.generated';
import type { GetReviewResult } from '../protocol/generated/get_review.result.generated';
import { AgentReviewReadError, type AgentReviewReadService } from '../reviews';
import { AgentTradeReadError } from '../trades';
import type { TFile } from 'obsidian';
import type { SessionLogEntry } from '../../../types/sessionLog';
import { findImagesWidgets, widgetImages } from '../../reviews/reviewImages';
import { agentMediaId } from '../media/agentMediaIdentity';
import {
  agentImageAnnotationFields,
  resolveAgentMedia,
} from '../media/agentOwnerMedia';
import type { ImageAnnotation } from '../../../types/imageAnnotations';
import { ANALYTICS_METRIC_IDS } from '../../analytics/types';
import { AnalyticsEvaluationError } from '../../analytics/types';
import {
  AnalyticsProjectionError,
  projectAnalyticsMetric,
} from '../analytics/metricProjection';
import { projectAnalyticsCalculationContext } from '../analytics/calculationContextProjection';
import { parseNewsEvents } from '../../weekly/parseNewsEvents';
import {
  isImportedKeyEvent,
  keyEventKeys,
  MAX_AGENT_KEY_EVENTS,
} from '../../weekly/keyEventKeys';
import { KEY_EVENT_COLORS, KEY_EVENT_DAYS } from '../../../utils/keyEvents';
import {
  normalizeDayTradeFieldValue,
  readDayTradeFieldRules,
  resolveDayTradeField,
} from '../../drc/dayTradeFields';
import type { CustomFieldDefinition } from '../../../types/customFields';

type Success = Extract<GetReviewResult, { status: 'ok' }>;
type Sections = Success['sections'];
type Performance = NonNullable<Sections['performance']>;

interface GetReviewDependencies {
  getReviewReadService(): Promise<Pick<AgentReviewReadService, 'read'>>;
  getAnalyticsReadService(): Promise<
    Pick<AgentAnalyticsReadService, 'evaluate'>
  >;
  cache: Pick<AgentResultCache, 'findPrior' | 'store'>;
  
  readSessionLog(file: TFile): readonly SessionLogEntry[];
  readContent(file: TFile): Promise<string>;
  readFrontmatter(file: TFile): Promise<Readonly<Record<string, unknown>>>;
  resolveMediaFile(source: string, sourcePath: string): TFile | null;
  
  readImageAnnotation(sourcePath: string, source: string): ImageAnnotation;
  getCustomFields(): CustomFieldDefinition[];
  
  getSetupIds(
    names: readonly string[]
  ): Promise<ReadonlyMap<string, string | null>>;
}

const MAX_SESSION_LOG_ENTRIES = 500;
const MAX_SESSION_LOG_TEXT = 2_000;
const MAX_IMAGE_WIDGETS = 20;

export const MAX_WIDGET_IMAGES = 100;

const MAX_KEY_EVENT_NAME = 500;
const MAX_KEY_EVENT_NOTES = 5_000;
const MAX_DAY_FIELD_VALUES = 50;
type DayTradeFields = NonNullable<Sections['day_trade_fields']>;

class ReviewSectionLimitError extends Error {}

function codePoints(value: string): number {
  return Array.from(value).length;
}


function projectKeyEvents(
  frontmatter: Readonly<Record<string, unknown>>
): NonNullable<Sections['key_events']> {
  const events = parseNewsEvents(frontmatter.keyEvents);
  if (events.length > MAX_AGENT_KEY_EVENTS) throw new ReviewSectionLimitError();
  const keys = keyEventKeys(events);
  return events.map((event, index) => {
    const day = KEY_EVENT_DAYS.find((candidate) => candidate === event.day);
    const color = KEY_EVENT_COLORS.find(
      (candidate) => candidate === event.color
    );
    if (
      codePoints(event.event) > MAX_KEY_EVENT_NAME ||
      codePoints(event.notes) > MAX_KEY_EVENT_NOTES
    ) {
      throw new ReviewSectionLimitError();
    }
    const time = event.time ? new Date(event.time) : null;
    return {
      key: keys[index],
      event: event.event,
      notes: event.notes,
      ...(day ? { day } : {}),
      ...(color ? { color } : {}),
      ...(time && !Number.isNaN(time.getTime())
        ? { time: time.toISOString() }
        : {}),
      ...(event.eventType === 'holiday' ? { all_day: true } : {}),
      ...(event.currency && /^[A-Z]{3}$/.test(event.currency)
        ? { currency: event.currency }
        : {}),
      ...(event.impact ? { impact: event.impact } : {}),
      ...(event.forecast === undefined ? {} : { forecast: event.forecast }),
      ...(event.previous === undefined ? {} : { previous: event.previous }),
      ...(event.actual === undefined ? {} : { actual: event.actual }),
      ...(event.source && codePoints(event.source) <= 100
        ? { source: event.source }
        : {}),
      imported: isImportedKeyEvent(event),
    };
  });
}


function boundedList(values: readonly string[]): string[] {
  if (
    values.length > MAX_DAY_FIELD_VALUES ||
    values.some((value) => codePoints(value) > 100)
  ) {
    throw new ReviewSectionLimitError();
  }
  return [...values];
}


async function projectDayTradeFields(
  frontmatter: Readonly<Record<string, unknown>>,
  dependencies: GetReviewDependencies
): Promise<DayTradeFields> {
  const definitions = dependencies.getCustomFields();
  const projected: DayTradeFields = {};
  const customFields: NonNullable<DayTradeFields['custom_fields']> = [];
  for (const rule of readDayTradeFieldRules({ ...frontmatter })) {
    const field = resolveDayTradeField(rule.field, definitions);
    if (!field) continue;
    const value = normalizeDayTradeFieldValue(field, rule.value);
    if (value === undefined) continue;
    if (field.kind === 'custom') {
      if (
        (typeof value === 'string' && codePoints(value) > 10_000) ||
        (Array.isArray(value) &&
          (value.length > 200 || value.some((item) => codePoints(item) > 100)))
      ) {
        throw new ReviewSectionLimitError();
      }
      customFields.push({ field_id: field.definition.id, value });
      continue;
    }
    const names = Array.isArray(value) ? value : [];
    switch (field.field) {
      case 'setup': {
        boundedList(names);
        const ids = await dependencies.getSetupIds(names);
        
        
        const matched = names.flatMap((name) => {
          const id = ids.get(name);
          return id ? [id] : [];
        });
        projected.setup_ids = boundedList([...new Set(matched)]);
        const unmatched = names.length - matched.length;
        if (unmatched > 0) projected.unmatched_setup_count = unmatched;
        break;
      }
      case 'mistake':
        projected.mistakes = boundedList(names);
        break;
      case 'tags':
        projected.tags = boundedList(names);
        break;
    }
  }
  if (customFields.length > MAX_DAY_FIELD_VALUES) {
    throw new ReviewSectionLimitError();
  }
  if (customFields.length > 0) projected.custom_fields = customFields;
  return projected;
}


function projectSessionLog(
  entries: readonly SessionLogEntry[]
): NonNullable<Sections['session_log']> {
  if (entries.length > MAX_SESSION_LOG_ENTRIES) {
    throw new ReviewSectionLimitError();
  }
  return entries
    .flatMap((entry) => {
      const time = new Date(entry.timestamp);
      if (Number.isNaN(time.getTime())) return [];
      if (Array.from(entry.text).length > MAX_SESSION_LOG_TEXT) {
        throw new ReviewSectionLimitError();
      }
      return [
        {
          entry_id: entry.id,
          time: time.toISOString(),
          tag_id: entry.tagId,
          text: entry.text,
          resolved: entry.resolved === true,
          promoted: entry.promoted === true,
        },
      ];
    })
    .sort((left, right) => left.time.localeCompare(right.time));
}


async function projectImages(
  file: TFile,
  installationId: string,
  dependencies: GetReviewDependencies,
  signal: AbortSignal
): Promise<NonNullable<Sections['images']>> {
  const blocks = findImagesWidgets(await dependencies.readContent(file));
  if (blocks.length > MAX_IMAGE_WIDGETS) throw new ReviewSectionLimitError();
  const frontmatter = await dependencies.readFrontmatter(file);
  const widgets: NonNullable<Sections['images']> = [];
  for (const block of blocks) {
    const images: NonNullable<Sections['images']>[number]['images'] = [];
    const seen = new Set<string>();
    for (const entry of widgetImages(frontmatter, block)) {
      throwIfAborted(signal);
      const media = resolveAgentMedia(entry, file.path, (source, sourcePath) =>
        dependencies.resolveMediaFile(source, sourcePath)
      );
      if (!media) continue;
      const mediaPath = media.file.path;
      if (seen.has(mediaPath)) continue;
      if (images.length === MAX_WIDGET_IMAGES) {
        throw new ReviewSectionLimitError();
      }
      seen.add(mediaPath);
      images.push({
        media_id: await agentMediaId(installationId, mediaPath),
        media_type: media.mediaType,
        size_bytes: media.file.stat.size,
        ...(media.path === undefined ? {} : { path: media.path }),
        ...agentImageAnnotationFields(
          dependencies.readImageAnnotation(file.path, entry)
        ),
      });
    }
    widgets.push({ widget: block.key, images });
  }
  return widgets;
}

interface GetReviewSnapshot {
  review: Success['review'];
  revision: string;
  sections: Sections;
}

const INVALID_REQUEST: GetReviewResult = {
  status: 'error',
  code: 'invalid_request',
  message: 'Review request is invalid.',
  retryable: false,
};
const NOT_FOUND: GetReviewResult = {
  status: 'error',
  code: 'not_found',
  message: 'Review was not found.',
  retryable: false,
};
const UNSUPPORTED_SESSION_LOG: GetReviewResult = {
  status: 'error',
  code: 'unsupported_capability',
  message: 'Only day reviews have a session log.',
  retryable: false,
};
const UNSUPPORTED_KEY_EVENTS: GetReviewResult = {
  status: 'error',
  code: 'unsupported_capability',
  message: 'Only week reviews have key events.',
  retryable: false,
};
const UNSUPPORTED_DAY_TRADE_FIELDS: GetReviewResult = {
  status: 'error',
  code: 'unsupported_capability',
  message: 'Only day reviews have day trade fields.',
  retryable: false,
};
const LIMIT_EXCEEDED: GetReviewResult = {
  status: 'error',
  code: 'limit_exceeded',
  message: 'Review content exceeds supported limits.',
  retryable: false,
};
const INTERNAL_ERROR: GetReviewResult = {
  status: 'error',
  code: 'internal_error',
  message: 'Review is temporarily unavailable.',
  retryable: true,
};

function throwIfAborted(signal: AbortSignal): void {
  if (signal.aborted) throw signal.reason;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const prototype = Object.getPrototypeOf(value) as unknown;
  return prototype === Object.prototype || prototype === null;
}

function validatedRequest(value: unknown): GetReviewRequest | undefined {
  try {
    const parsed = parseAgentToolRequest('get_review', value);
    if (new Set(parsed.sections).size !== parsed.sections.length)
      return undefined;
    return parsed;
  } catch {
    return undefined;
  }
}

function projectPerformance(
  value: Awaited<ReturnType<AgentAnalyticsReadService['evaluate']>>
): Performance {
  if (value.series.length !== 1) {
    throw new AnalyticsProjectionError('internal');
  }
  const row = value.series[0];
  if (
    row.intervalStart !== undefined ||
    row.groupKey !== undefined ||
    row.comparison !== undefined
  ) {
    throw new AnalyticsProjectionError('internal');
  }
  if (row.metrics.length > 25) throw new AnalyticsProjectionError('limit');
  if (row.metrics.length !== ANALYTICS_METRIC_IDS.length) {
    throw new AnalyticsProjectionError('internal');
  }
  for (let index = 0; index < ANALYTICS_METRIC_IDS.length; index += 1) {
    if (row.metrics[index].metricId !== ANALYTICS_METRIC_IDS[index]) {
      throw new AnalyticsProjectionError('internal');
    }
  }
  let metrics: Performance['metrics'];
  try {
    metrics = row.metrics.map(projectAnalyticsMetric);
  } catch (error) {
    if (error instanceof AnalyticsProjectionError) {
      throw new AnalyticsProjectionError('internal');
    }
    throw error;
  }
  return {
    calculation_context: projectAnalyticsCalculationContext(value.calculation),
    metrics,
  };
}

function exactSectionCoverage(
  sections: Record<string, unknown>,
  requested: readonly GetReviewRequest['sections'][number][]
): boolean {
  const keys = Object.keys(sections).sort();
  const expected = [...requested].sort();
  return (
    keys.length === expected.length &&
    keys.every((key, index) => key === expected[index])
  );
}

function successFromSnapshot(
  snapshot: unknown,
  request: GetReviewRequest,
  cached: boolean
): Success | undefined {
  if (!isPlainObject(snapshot)) return undefined;
  const snapshotKeys = Object.keys(snapshot).sort();
  if (snapshotKeys.join(',') !== 'review,revision,sections') return undefined;
  if (!isPlainObject(snapshot.review) || !isPlainObject(snapshot.sections)) {
    return undefined;
  }
  if (
    Object.keys(snapshot.review).sort().join(',') !== 'period,period_start' ||
    snapshot.review.period !== request.review.period ||
    snapshot.review.period_start !== request.review.period_start ||
    typeof snapshot.revision !== 'string' ||
    !exactSectionCoverage(snapshot.sections, request.sections)
  ) {
    return undefined;
  }
  const candidate = {
    status: 'ok' as const,
    meta: {
      contract_version: agentContractManifest.version,
      contract_digest: agentContractManifest.digest,
      cached,
      row_count: 1,
    },
    review: snapshot.review,
    revision: snapshot.revision,
    sections: snapshot.sections,
  };
  try {
    const parsed = parseAgentToolResult('get_review', candidate);
    return parsed.status === 'ok' ? parsed : undefined;
  } catch {
    return undefined;
  }
}

function errorResult(error: unknown): GetReviewResult {
  if (error instanceof AgentReviewReadError) {
    return error.code === 'invalid_request' ? INVALID_REQUEST : LIMIT_EXCEEDED;
  }
  if (
    error instanceof AnalyticsEvaluationError ||
    error instanceof AgentTradeReadError
  ) {
    return error.code === 'invalid_request' ? INVALID_REQUEST : LIMIT_EXCEEDED;
  }
  if (error instanceof AnalyticsProjectionError) {
    return error.kind === 'limit' ? LIMIT_EXCEEDED : INTERNAL_ERROR;
  }
  if (error instanceof AgentResultCacheError) {
    return error.code === 'limit_exceeded' ? LIMIT_EXCEEDED : INVALID_REQUEST;
  }
  if (error instanceof ReviewSectionLimitError) return LIMIT_EXCEEDED;
  return setupReadErrorResult(error) ?? INTERNAL_ERROR;
}

export function createGetReviewHandler(
  dependencies: GetReviewDependencies
): AgentToolHandler<'get_review'> {
  return async (untrustedRequest, context) => {
    try {
      throwIfAborted(context.signal);
      const request = validatedRequest(untrustedRequest);
      if (request === undefined) return { result: INVALID_REQUEST };
      const cacheContext = {
        tool: 'get_review' as const,
        installationId: context.installationId,
        arguments: request,
      };
      const prior = await dependencies.cache.findPrior(
        context.priorResultHint,
        cacheContext
      );
      throwIfAborted(context.signal);
      if (prior !== null) {
        const result = successFromSnapshot(prior.snapshot, request, true);
        return result === undefined
          ? { result: INTERNAL_ERROR }
          : { result, resultId: prior.resultId };
      }

      const reviewReadService = await dependencies.getReviewReadService();
      throwIfAborted(context.signal);
      const review = await reviewReadService.read(
        request.review,
        context.signal
      );
      throwIfAborted(context.signal);
      if (review === null) return { result: NOT_FOUND };

      const sections: Sections = {};
      for (const section of request.sections) {
        switch (section) {
          case 'summary':
            sections.summary = review.summary;
            break;
          case 'answers':
            sections.answers = review.answers.map(
              ({ question_id, answer }) => ({
                question_id,
                answer,
              })
            );
            break;
          case 'goals':
            sections.goals = review.goals.map(({ text, done }) => ({
              text,
              done,
            }));
            break;
          case 'checklist':
            sections.checklist = review.checklist.map(({ text, done }) => ({
              text,
              done,
            }));
            break;
          case 'key_levels':
            sections.key_levels = {
              support: review.keyLevels.support.map((level) => ({ ...level })),
              resistance: review.keyLevels.resistance.map((level) => ({
                ...level,
              })),
            };
            break;
          case 'grades':
            sections.grades = {
              mental: review.grades.mental,
              technical: review.grades.technical,
            };
            break;
          case 'reviewed':
            sections.reviewed = review.reviewed;
            break;
          case 'session_log':
            if (review.period !== 'day') {
              return { result: UNSUPPORTED_SESSION_LOG };
            }
            sections.session_log = projectSessionLog(
              dependencies.readSessionLog(review.file)
            );
            break;
          case 'key_events':
            if (review.period !== 'week') {
              return { result: UNSUPPORTED_KEY_EVENTS };
            }
            sections.key_events = projectKeyEvents(
              await dependencies.readFrontmatter(review.file)
            );
            break;
          case 'day_trade_fields':
            if (review.period !== 'day') {
              return { result: UNSUPPORTED_DAY_TRADE_FIELDS };
            }
            sections.day_trade_fields = await projectDayTradeFields(
              await dependencies.readFrontmatter(review.file),
              dependencies
            );
            break;
          case 'images':
            sections.images = await projectImages(
              review.file,
              context.installationId,
              dependencies,
              context.signal
            );
            break;
          case 'performance': {
            const analyticsReadService =
              await dependencies.getAnalyticsReadService();
            throwIfAborted(context.signal);
            const analytics = await analyticsReadService.evaluate(
              {
                metrics: [...ANALYTICS_METRIC_IDS],
                filters: {
                  trade_types: ['regular', 'backtest'],
                  date: {
                    from: review.analyticsFrom.toISOString(),
                    to: review.analyticsTo.toISOString(),
                  },
                },
              },
              context.signal
            );
            throwIfAborted(context.signal);
            sections.performance = projectPerformance(analytics);
            break;
          }
        }
      }

      const snapshot: GetReviewSnapshot = {
        review: {
          period: request.review.period,
          period_start: request.review.period_start,
        },
        revision: review.revision,
        sections,
      };
      const result = successFromSnapshot(snapshot, request, false);
      if (result === undefined) return { result: INTERNAL_ERROR };
      const resultId = await dependencies.cache.store({
        ...cacheContext,
        snapshot,
      });
      throwIfAborted(context.signal);
      return { result, resultId };
    } catch (error) {
      if (context.signal.aborted) throw context.signal.reason;
      return { result: errorResult(error) };
    }
  };
}
