import { generateUUID } from '../../../utils/uuid';
import type { AgentToolHandler } from '../AgentToolRegistry';
import {
  AgentIntegrationError,
  projectAgentIntegrationCapabilities,
  type AgentIntegrationConnectionStatus,
  type AgentIntegrationService,
} from '../integrations';
import {
  agentContractManifest,
  parseAgentToolRequest,
  parseAgentToolResult,
} from '../protocol';
import type { RunIntegrationRequest } from '../protocol/generated/run_integration.request.generated';
import type { RunIntegrationResult } from '../protocol/generated/run_integration.result.generated';

interface RunIntegrationDependencies {
  getIntegrationService(): AgentIntegrationService;
  createNavigationId?(): string;
}

const ERROR_RESULTS: Record<
  AgentIntegrationError['code'] | 'internal_error',
  RunIntegrationResult
> = {
  invalid_request: {
    status: 'error',
    code: 'invalid_request',
    message: 'Integration request is invalid.',
    retryable: false,
  },
  not_found: {
    status: 'error',
    code: 'not_found',
    message: 'Integration target was not found.',
    retryable: false,
  },
  conflict: {
    status: 'error',
    code: 'conflict',
    message: 'An integration operation is already running.',
    retryable: true,
  },
  permission_denied: {
    status: 'error',
    code: 'permission_denied',
    message: 'Integration is not permitted.',
    retryable: false,
  },
  offline: {
    status: 'error',
    code: 'offline',
    message: 'Journalit is offline.',
    retryable: true,
  },
  limit_exceeded: {
    status: 'error',
    code: 'limit_exceeded',
    message: 'Integration exceeds the supported limits.',
    retryable: false,
  },
  unsupported_capability: {
    status: 'error',
    code: 'unsupported_capability',
    message: 'Integration action is not supported.',
    retryable: false,
  },
  integration_unavailable: {
    status: 'error',
    code: 'integration_unavailable',
    message: 'Integration is temporarily unavailable.',
    retryable: true,
  },
  internal_error: {
    status: 'error',
    code: 'internal_error',
    message: 'Integration is temporarily unavailable.',
    retryable: true,
  },
};


type ErrorDetailReason = NonNullable<
  Extract<RunIntegrationResult, { status: 'error' }>['details']
>[number]['reason'];


const CONNECTION_REASONS: Record<
  AgentIntegrationError['code'],
  ErrorDetailReason
> = {
  invalid_request: 'connection_not_usable',
  not_found: 'connection_not_found',
  conflict: 'connection_busy',
  permission_denied: 'connection_needs_reconnect',
  offline: 'journalit_offline',
  limit_exceeded: 'connection_limit_exceeded',
  unsupported_capability: 'connection_action_unsupported',
  integration_unavailable: 'connection_unavailable',
};

function throwIfAborted(signal: AbortSignal): void {
  if (signal.aborted) throw signal.reason;
}

function validatedRequest(value: unknown): RunIntegrationRequest | null {
  try {
    return parseAgentToolRequest('run_integration', value);
  } catch {
    return null;
  }
}

function successMeta(cached: boolean) {
  return {
    contract_version: agentContractManifest.version,
    contract_digest: agentContractManifest.digest,
    cached,
  };
}

function projectConnection(connection: AgentIntegrationConnectionStatus) {
  if (connection.state === 'running') {
    return {
      connection_id: connection.connectionId,
      ...(connection.label === undefined ? {} : { label: connection.label }),
      state: 'running' as const,
      operation_id: connection.operationId,
    };
  }
  return {
    connection_id: connection.connectionId,
    ...(connection.label === undefined ? {} : { label: connection.label }),
    state: connection.state,
  };
}

function errorResult(error: unknown): RunIntegrationResult {
  if (error instanceof AgentIntegrationError) {
    const result = ERROR_RESULTS[error.code];
    if (error.field === undefined || result.status !== 'error') return result;
    return {
      ...result,
      details: [{ field: error.field, reason: CONNECTION_REASONS[error.code] }],
    };
  }
  return ERROR_RESULTS.internal_error;
}

export function createRunIntegrationHandler(
  dependencies: RunIntegrationDependencies
): AgentToolHandler<'run_integration'> {
  return async (untrustedRequest, context) => {
    try {
      throwIfAborted(context.signal);
      const request = validatedRequest(untrustedRequest);
      if (request === null) return { result: ERROR_RESULTS.invalid_request };

      switch (request.action) {
        case 'inspect_capabilities': {
          return {
            result: parseAgentToolResult('run_integration', {
              status: 'ok',
              meta: successMeta(false),
              variant: 'capabilities',
              capabilities: projectAgentIntegrationCapabilities(),
            }),
          };
        }
        case 'inspect_status': {
          if (request.integration !== 'tradovate') {
            return { result: ERROR_RESULTS.unsupported_capability };
          }
          const service = dependencies.getIntegrationService();
          throwIfAborted(context.signal);
          const status = await service.inspectTradovateStatus({
            installationId: context.installationId,
            signal: context.signal,
          });
          throwIfAborted(context.signal);
          return {
            result: parseAgentToolResult('run_integration', {
              status: 'ok',
              meta: successMeta(false),
              variant: 'status',
              integration: 'tradovate',
              state: status.state,
              connections: status.connections.map(projectConnection),
            }),
          };
        }
        case 'start_sync': {
          const service = dependencies.getIntegrationService();
          throwIfAborted(context.signal);
          const accepted = await service.startTradovateSync({
            installationId: context.installationId,
            connectionId: request.connection_id,
            idempotencyKey: request.idempotency_key,
            signal: context.signal,
          });
          throwIfAborted(context.signal);
          return {
            result: parseAgentToolResult('run_integration', {
              status: 'ok',
              meta: successMeta(accepted.cached),
              variant: 'accepted',
              operation_id: accepted.operationId,
              state: 'accepted',
            }),
          };
        }
        case 'open_import_workflow': {
          const service = dependencies.getIntegrationService();
          throwIfAborted(context.signal);
          await service.openImportWorkflow(context.signal);
          throwIfAborted(context.signal);
          const navigationId = dependencies.createNavigationId
            ? dependencies.createNavigationId()
            : `navigation_${generateUUID()}`;
          return {
            result: parseAgentToolResult('run_integration', {
              status: 'ok',
              meta: successMeta(false),
              variant: 'workflow_opened',
              navigation_id: navigationId,
            }),
          };
        }
        case 'import_economic_calendar': {
          const service = dependencies.getIntegrationService();
          throwIfAborted(context.signal);
          const imported = await service.importEconomicCalendar({
            week: request.week,
            signal: context.signal,
          });
          throwIfAborted(context.signal);
          return {
            result: parseAgentToolResult('run_integration', {
              status: 'ok',
              meta: successMeta(false),
              variant: 'calendar_imported',
              week: { period: 'week', period_start: imported.weekStart },
              added: imported.importedCount,
              updated: imported.updatedCount,
              skipped: imported.skippedCount,
            }),
          };
        }
        case 'operation_status': {
          const service = dependencies.getIntegrationService();
          throwIfAborted(context.signal);
          const status = service.getOperationStatus({
            installationId: context.installationId,
            operationId: request.operation_id,
          });
          throwIfAborted(context.signal);
          return {
            result: parseAgentToolResult('run_integration', {
              status: 'ok',
              meta: successMeta(false),
              variant: 'status',
              integration: status.integration,
              state: status.state,
              operation_id: status.operationId,
            }),
          };
        }
        default: {
          const exhaustive: never = request;
          return exhaustive;
        }
      }
    } catch (error) {
      if (context.signal.aborted) throw context.signal.reason;
      return { result: errorResult(error) };
    }
  };
}
