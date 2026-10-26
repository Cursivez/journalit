import type { AgentToolHandler } from '../AgentToolRegistry';
import { setupReadErrorResult } from './setupReadError';
import {
  agentContractManifest,
  parseAgentToolResult,
} from '../protocol/AgentContractRegistry';
import type { AnalyzeBehaviorResult } from '../protocol/generated/analyze_behavior.result.generated';
import { AgentTradeReadError } from '../trades';
import {
  UnsupportedAnalyticsSelectionError,
  type AgentAnalyticsReadService,
} from '../analytics';
import { AnalyticsEvaluationError } from '../../analytics/types';
import { AnalyticsProjectionError } from '../analytics/metricProjection';
import { projectAnalyticsCalculationContext } from '../analytics/calculationContextProjection';
import {
  computeMistakeCost,
  computeOvertrading,
  computeTilt,
  samplePeriod,
} from '../analytics/behaviorAnalysis';
import { capText } from './insightText';

interface AnalyzeBehaviorDependencies {
  getReadService(): Promise<
    Pick<AgentAnalyticsReadService, 'readBehaviorTrades'>
  >;
}

const INVALID_REQUEST: AnalyzeBehaviorResult = {
  status: 'error',
  code: 'invalid_request',
  message: 'Behavior analysis request is invalid.',
  retryable: false,
};

const UNSUPPORTED_SELECTION: AnalyzeBehaviorResult = {
  status: 'error',
  code: 'invalid_request',
  message:
    'Behavior analysis covers regular or backtest trades only; missed trades have no P&L. Remove "missed" from filters.trade_types and retry.',
  retryable: false,
  details: [
    { field: '/filters/trade_types', reason: 'missed_trades_unsupported' },
  ],
};

const LIMIT_EXCEEDED: AnalyzeBehaviorResult = {
  status: 'error',
  code: 'limit_exceeded',
  message: 'Behavior analysis exceeds supported limits.',
  retryable: false,
};

const INTERNAL_ERROR: AnalyzeBehaviorResult = {
  status: 'error',
  code: 'internal_error',
  message: 'Behavior analysis is temporarily unavailable.',
  retryable: true,
};

function unconvertedCurrencyError(currency: string): AnalyzeBehaviorResult {
  return {
    status: 'error',
    code: 'invalid_request',
    message: `Some trades in scope have amounts that could not be converted to ${currency}, so their P&L cannot be combined. Narrow the filters (for example by account) and retry.`,
    retryable: false,
  };
}

function throwIfAborted(signal: AbortSignal): void {
  if (signal.aborted) throw signal.reason;
}

function errorResult(error: unknown): AnalyzeBehaviorResult {
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
  return setupReadErrorResult(error) ?? INTERNAL_ERROR;
}

export function createAnalyzeBehaviorHandler(
  dependencies: AnalyzeBehaviorDependencies
): AgentToolHandler<'analyze_behavior'> {
  return async (request, context) => {
    try {
      throwIfAborted(context.signal);
      if (request.filters?.trade_types?.includes('missed')) {
        return { result: UNSUPPORTED_SELECTION };
      }
      const readService = await dependencies.getReadService();
      throwIfAborted(context.signal);
      const selection = await readService.readBehaviorTrades(
        {
          ...request.filters,
          trade_types: request.filters?.trade_types ?? ['regular'],
        },
        context.signal
      );
      throwIfAborted(context.signal);
      const calculation = projectAnalyticsCalculationContext(
        selection.calculationFor(selection.trades.map((trade) => trade.path))
      );
      if (
        calculation.input.contains_unconverted_foreign_currencies ||
        selection.trades.some((trade) => trade.conversionIssue)
      ) {
        return { result: unconvertedCurrencyError(calculation.currency) };
      }
      const trades = selection.trades;
      const { trading_day_count, period } = samplePeriod(trades);
      const common = {
        status: 'ok' as const,
        meta: {
          contract_version: agentContractManifest.version,
          contract_digest: agentContractManifest.digest,
          cached: false,
        },
        sample: {
          trade_count: trades.length,
          trading_day_count,
          excluded_open_trade_count: selection.excludedOpenTradeCount,
        },
        ...(period ? { period } : {}),
        calculation_context: calculation,
      };
      let candidate: unknown;
      switch (request.analysis) {
        case 'mistake_cost': {
          const cost = computeMistakeCost(trades);
          candidate = {
            ...common,
            analysis: 'mistake_cost',
            mistake_cost: {
              ...cost,
              mistakes: cost.mistakes.map((row) => ({
                ...row,
                mistake: capText(row.mistake, 100),
              })),
            },
          };
          break;
        }
        case 'tilt':
          candidate = {
            ...common,
            analysis: 'tilt',
            tilt: { buckets: computeTilt(trades) },
          };
          break;
        case 'overtrading':
          candidate = {
            ...common,
            analysis: 'overtrading',
            overtrading: { buckets: computeOvertrading(trades) },
          };
          break;
        default: {
          const exhaustive: never = request.analysis;
          void exhaustive;
          return { result: INVALID_REQUEST };
        }
      }
      try {
        return { result: parseAgentToolResult('analyze_behavior', candidate) };
      } catch {
        return { result: INTERNAL_ERROR };
      }
    } catch (error) {
      if (context.signal.aborted) throw context.signal.reason;
      return { result: errorResult(error) };
    }
  };
}
