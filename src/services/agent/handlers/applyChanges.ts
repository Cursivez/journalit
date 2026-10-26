import type { AgentToolHandler } from '../AgentToolRegistry';
import {
  agentContractManifest,
  parseAgentToolRequest,
  parseAgentToolResult,
  type AgentToolContracts,
} from '../protocol/AgentContractRegistry';
import {
  ActionBatchError,
  type ActionBatchErrorCode,
  type ActionBatchService,
} from '../../actions/ActionBatchService';
import { previewUnavailableMessage } from './previewUnavailableMessage';
import { setupReadErrorResult } from './setupReadError';

type ApplyChangesResult = AgentToolContracts['apply_changes']['result'];
type ErrorResult = Extract<ApplyChangesResult, { status: 'error' }>;

interface ApplyChangesDependencies {
  getBatchService(): Promise<Pick<ActionBatchService, 'preview' | 'commit'>>;
}

const MESSAGES: Record<ActionBatchErrorCode | 'internal_error', string> = {
  invalid_request: 'The requested change is invalid.',
  not_found: 'A requested target was not found.',
  conflict: 'The requested change conflicts with the current journal.',
  limit_exceeded: 'The requested change exceeds a limit.',
  unsupported_capability: 'The requested change is not supported.',
  permission_denied: 'The connection is not allowed to make this change.',
  preview_expired: previewUnavailableMessage('Change'),
  internal_error: 'Changes are temporarily unavailable.',
};

type ErrorDetailReason = NonNullable<ErrorResult['details']>[number]['reason'];


const DETAIL_REASONS: Record<
  ActionBatchErrorCode | 'internal_error',
  ErrorDetailReason
> = {
  invalid_request: 'action_invalid',
  not_found: 'action_target_not_found',
  conflict: 'action_conflict',
  limit_exceeded: 'action_limit_exceeded',
  unsupported_capability: 'action_unsupported',
  permission_denied: 'action_not_permitted',
  preview_expired: 'preview_expired',
  internal_error: 'changes_unavailable',
};

function errorResult(
  code: ActionBatchErrorCode | 'internal_error',
  field?: string
): ErrorResult {
  const result: ErrorResult = {
    status: 'error',
    code,
    message: MESSAGES[code],
    retryable: code === 'internal_error',
  };
  
  
  if (field !== undefined) {
    result.details = [{ field, reason: DETAIL_REASONS[code] }];
  }
  return result;
}

function meta(cached: boolean) {
  return {
    contract_version: agentContractManifest.version,
    contract_digest: agentContractManifest.digest,
    cached,
  };
}

export function createApplyChangesHandler(
  dependencies: ApplyChangesDependencies
): AgentToolHandler<'apply_changes'> {
  return async (untrustedRequest, context) => {
    try {
      if (context.signal.aborted) throw context.signal.reason;
      let request: AgentToolContracts['apply_changes']['request'];
      try {
        request = parseAgentToolRequest('apply_changes', untrustedRequest);
      } catch {
        return { result: errorResult('invalid_request') };
      }
      const service = await dependencies.getBatchService();
      if (context.signal.aborted) throw context.signal.reason;

      if (request.mode === 'preview') {
        const preview = await service.preview({
          installationId: context.installationId,
          scopes: context.scopes,
          actions: request.actions,
          signal: context.signal,
        });
        return {
          result: parseAgentToolResult('apply_changes', {
            ...preview,
            meta: meta(false),
          }),
        };
      }

      const outcome = await service.commit({
        installationId: context.installationId,
        scopes: context.scopes,
        previewId: request.preview_id,
        idempotencyKey: request.idempotency_key,
        signal: context.signal,
      });
      return {
        result: parseAgentToolResult('apply_changes', {
          ...outcome.result,
          meta: meta(outcome.cached),
        }),
      };
    } catch (error) {
      if (context.signal.aborted) throw context.signal.reason;
      if (error instanceof ActionBatchError) {
        return { result: errorResult(error.code, error.field) };
      }
      return {
        result: setupReadErrorResult(error) ?? errorResult('internal_error'),
      };
    }
  };
}
