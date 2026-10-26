import {
  AgentResultCacheError,
  type AgentResultCache,
} from '../AgentResultCache';
import type { AgentToolHandler } from '../AgentToolRegistry';
import { setupReadErrorResult } from './setupReadError';
import { agentContractManifest, parseAgentToolResult } from '../protocol';
import type { EvaluateTradesRequest } from '../protocol/generated/evaluate_trades.request.generated';
import type { EvaluateTradesResult } from '../protocol/generated/evaluate_trades.result.generated';
import { AgentTradeReadError } from '../trades';
import {
  UnsupportedAnalyticsSelectionError,
  type AgentAnalyticsReadService,
} from '../analytics';
import { AnalyticsEvaluationError } from '../../analytics/types';
import {
  AnalyticsProjectionError,
  projectAnalyticsMetric,
} from '../analytics/metricProjection';
import { projectAnalyticsCalculationContext } from '../analytics/calculationContextProjection';
import type { AnalyticsGroupKey } from '../../analytics/types';

type Success = Extract<EvaluateTradesResult, { status: 'ok' }>;
type SeriesRow = Success['series'][number];
type Comparison = NonNullable<SeriesRow['comparison']>[number];

interface EvaluateTradesDependencies {
  getReadService(): Promise<Pick<AgentAnalyticsReadService, 'evaluate'>>;
  cache: Pick<AgentResultCache, 'findPrior' | 'store'>;
}

interface EvaluateTradesSnapshot {
  series: Success['series'];
  calculation_context: Success['calculation_context'];
}

const INVALID_REQUEST: EvaluateTradesResult = {
  status: 'error',
  code: 'invalid_request',
  message: 'Trade analytics request is invalid.',
  retryable: false,
};

const UNSUPPORTED_SELECTION: EvaluateTradesResult = {
  status: 'error',
  code: 'invalid_request',
  message:
    'Trade analytics requires a selection of supported regular or backtest trades. Narrow the filters and retry.',
  retryable: false,
  details: [
    {
      field: '/filters',
      reason: 'missed_trades_unsupported',
    },
  ],
};

const LIMIT_EXCEEDED: EvaluateTradesResult = {
  status: 'error',
  code: 'limit_exceeded',
  message: 'Trade analytics exceeds supported limits.',
  retryable: false,
};

const INTERNAL_ERROR: EvaluateTradesResult = {
  status: 'error',
  code: 'internal_error',
  message: 'Trade analytics is temporarily unavailable.',
  retryable: true,
};

const OPAQUE_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]*$/;

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

function boundedArray<T>(
  value: readonly T[],
  minimum: number,
  maximum: number
): void {
  if (!Array.isArray(value)) throw new AnalyticsProjectionError('internal');
  if (value.length > maximum) throw new AnalyticsProjectionError('limit');
  if (value.length < minimum) throw new AnalyticsProjectionError('internal');
}

function boundedNumber(
  value: number,
  minimum: number,
  maximum: number
): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new AnalyticsProjectionError('internal');
  }
  if (value < minimum || value > maximum) {
    throw new AnalyticsProjectionError('limit');
  }
  return value;
}

function boundedNullableNumber(
  value: number | null,
  minimum: number,
  maximum: number
): number | null {
  return value === null ? null : boundedNumber(value, minimum, maximum);
}

function boundedText(value: string, maximum: number): string {
  if (typeof value !== 'string' || value.length === 0) {
    throw new AnalyticsProjectionError('internal');
  }
  if (Array.from(value).length > maximum)
    throw new AnalyticsProjectionError('limit');
  return value;
}

function projectComparison(value: {
  metricId: Comparison['metric_id'];
  current: Parameters<typeof projectAnalyticsMetric>[0];
  baseline: Parameters<typeof projectAnalyticsMetric>[0];
  absoluteDelta: number | null;
  percentDelta: number | null;
}): Comparison {
  return {
    metric_id: value.metricId,
    current: projectAnalyticsMetric(value.current),
    baseline: projectAnalyticsMetric(value.baseline),
    absolute_delta: boundedNullableNumber(
      value.absoluteDelta,
      -1_000_000_000_000,
      1_000_000_000_000
    ),
    percent_delta: boundedNullableNumber(
      value.percentDelta,
      -1_000_000,
      1_000_000
    ),
  };
}

function projectGroupKey(value: AnalyticsGroupKey): SeriesRow['group_key'] {
  switch (value.kind) {
    case 'account':
    case 'setup':
      if (
        typeof value.id !== 'string' ||
        !OPAQUE_ID_PATTERN.test(value.id) ||
        Array.from(value.id).length > 128
      ) {
        throw new AnalyticsProjectionError(
          Array.from(value.id).length > 128 ? 'limit' : 'internal'
        );
      }
      return {
        kind: value.kind,
        id: value.id,
        label: boundedText(value.label, 120),
      };
    case 'ticker':
    case 'tag':
    case 'mistake':
      return { kind: value.kind, value: boundedText(value.value, 120) };
    case 'month':
      if (!/^[0-9]{4}-(0[1-9]|1[0-2])$/.test(value.value)) {
        throw new AnalyticsProjectionError('internal');
      }
      return { kind: 'month', value: value.value };
    case 'direction':
      switch (value.value) {
        case 'long':
        case 'short':
          return { kind: 'direction', value: value.value };
        default:
          throw new AnalyticsProjectionError('internal');
      }
    case 'weekday':
      switch (value.value) {
        case 'monday':
        case 'tuesday':
        case 'wednesday':
        case 'thursday':
        case 'friday':
        case 'saturday':
        case 'sunday':
          return { kind: 'weekday', value: value.value };
        default:
          throw new AnalyticsProjectionError('internal');
      }
    default: {
      const exhaustive: never = value;
      void exhaustive;
      throw new AnalyticsProjectionError('internal');
    }
  }
}

function projectResult(
  value: Awaited<ReturnType<AgentAnalyticsReadService['evaluate']>>
): EvaluateTradesSnapshot {
  boundedArray(value.series, 0, 500);
  const series = value.series.map((row): SeriesRow => {
    boundedArray(row.metrics, 1, 25);
    const projected: SeriesRow = {
      metrics: row.metrics.map(projectAnalyticsMetric),
    };
    if (row.intervalStart !== undefined) {
      if (
        !(row.intervalStart instanceof Date) ||
        !Number.isFinite(row.intervalStart.getTime())
      ) {
        throw new AnalyticsProjectionError('internal');
      }
      projected.interval_start = row.intervalStart.toISOString();
    }
    if (row.comparison !== undefined) {
      boundedArray(row.comparison, 1, 25);
      projected.comparison = row.comparison.map(projectComparison);
    }
    if (row.groupKey !== undefined) {
      projected.group_key = projectGroupKey(row.groupKey);
    }
    return projected;
  });
  return {
    series,
    calculation_context: projectAnalyticsCalculationContext(value.calculation),
  };
}

function successFromSnapshot(
  snapshot: unknown,
  cached: boolean
): Success | undefined {
  if (!isPlainObject(snapshot)) return undefined;
  const keys = Object.keys(snapshot);
  if (
    keys.length !== 2 ||
    !keys.includes('series') ||
    !keys.includes('calculation_context')
  ) {
    return undefined;
  }
  const candidate = {
    status: 'ok' as const,
    meta: {
      contract_version: agentContractManifest.version,
      contract_digest: agentContractManifest.digest,
      cached,
      row_count: Array.isArray(snapshot.series) ? snapshot.series.length : 0,
    },
    series: snapshot.series,
    calculation_context: snapshot.calculation_context,
  };
  try {
    const parsed = parseAgentToolResult('evaluate_trades', candidate);
    return parsed.status === 'ok' ? parsed : undefined;
  } catch {
    return undefined;
  }
}

function errorResult(error: unknown): EvaluateTradesResult {
  if (error instanceof UnsupportedAnalyticsSelectionError) {
    return UNSUPPORTED_SELECTION;
  }
  if (error instanceof AnalyticsProjectionError) {
    return error.kind === 'limit' ? LIMIT_EXCEEDED : INTERNAL_ERROR;
  }
  if (
    error instanceof AnalyticsEvaluationError ||
    error instanceof AgentTradeReadError
  ) {
    return error.code === 'invalid_request' ? INVALID_REQUEST : LIMIT_EXCEEDED;
  }
  if (error instanceof AgentResultCacheError) {
    return error.code === 'limit_exceeded' ? LIMIT_EXCEEDED : INVALID_REQUEST;
  }
  return setupReadErrorResult(error) ?? INTERNAL_ERROR;
}

export function createEvaluateTradesHandler(
  dependencies: EvaluateTradesDependencies
): AgentToolHandler<'evaluate_trades'> {
  return async (request, context) => {
    try {
      throwIfAborted(context.signal);
      const cacheContext: {
        tool: 'evaluate_trades';
        installationId: string;
        arguments: EvaluateTradesRequest;
      } = {
        tool: 'evaluate_trades',
        installationId: context.installationId,
        arguments: request,
      };
      const prior = await dependencies.cache.findPrior(
        context.priorResultHint,
        cacheContext
      );
      throwIfAborted(context.signal);
      if (prior !== null) {
        const result = successFromSnapshot(prior.snapshot, true);
        return result === undefined
          ? { result: INTERNAL_ERROR }
          : { result, resultId: prior.resultId };
      }

      const readService = await dependencies.getReadService();
      throwIfAborted(context.signal);
      const internal = await readService.evaluate(request, context.signal);
      throwIfAborted(context.signal);
      const snapshot = projectResult(internal);
      const checked = successFromSnapshot(snapshot, false);
      if (checked === undefined) return { result: INTERNAL_ERROR };
      const resultId = await dependencies.cache.store({
        ...cacheContext,
        snapshot,
      });
      throwIfAborted(context.signal);
      return { result: checked, resultId };
    } catch (error) {
      if (context.signal.aborted) throw context.signal.reason;
      return { result: errorResult(error) };
    }
  };
}
