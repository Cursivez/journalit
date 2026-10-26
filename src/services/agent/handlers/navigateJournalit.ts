import { generateUUID } from '../../../utils/uuid';
import type { AgentToolHandler } from '../AgentToolRegistry';
import { setupReadErrorResult } from './setupReadError';
import {
  AgentNavigationError,
  type AgentNavigationService,
} from '../navigation';
import {
  agentContractManifest,
  parseAgentToolRequest,
  parseAgentToolResult,
} from '../protocol';
import type { NavigateJournalitRequest } from '../protocol/generated/navigate_journalit.request.generated';
import type { NavigateJournalitResult } from '../protocol/generated/navigate_journalit.result.generated';
import { AgentReviewReadError } from '../reviews';

interface NavigateJournalitDependencies {
  getNavigationService(): Promise<Pick<AgentNavigationService, 'navigate'>>;
  createNavigationId?(): string;
}

const INVALID_REQUEST: NavigateJournalitResult = {
  status: 'error',
  code: 'invalid_request',
  message: 'Navigation request is invalid.',
  retryable: false,
};
const NOT_FOUND: NavigateJournalitResult = {
  status: 'error',
  code: 'not_found',
  message: 'Navigation target was not found.',
  retryable: false,
};
const UNSUPPORTED: NavigateJournalitResult = {
  status: 'error',
  code: 'unsupported_capability',
  message: 'Navigation target is not supported.',
  retryable: false,
};
const INTERNAL_ERROR: NavigateJournalitResult = {
  status: 'error',
  code: 'internal_error',
  message: 'Navigation is temporarily unavailable.',
  retryable: true,
};

function throwIfAborted(signal: AbortSignal): void {
  if (signal.aborted) throw signal.reason;
}

function validatedRequest(value: unknown): NavigateJournalitRequest | null {
  try {
    return parseAgentToolRequest('navigate_journalit', value);
  } catch {
    return null;
  }
}

function errorResult(error: unknown): NavigateJournalitResult {
  if (error instanceof AgentNavigationError) {
    switch (error.code) {
      case 'invalid_request':
        return INVALID_REQUEST;
      case 'not_found':
        return NOT_FOUND;
      case 'unsupported_capability':
        return UNSUPPORTED;
    }
  }
  if (
    error instanceof AgentReviewReadError &&
    error.code === 'invalid_request'
  ) {
    return INVALID_REQUEST;
  }
  return setupReadErrorResult(error) ?? INTERNAL_ERROR;
}

export function createNavigateJournalitHandler(
  dependencies: NavigateJournalitDependencies
): AgentToolHandler<'navigate_journalit'> {
  return async (untrustedRequest, context) => {
    try {
      throwIfAborted(context.signal);
      const request = validatedRequest(untrustedRequest);
      if (request === null) return { result: INVALID_REQUEST };

      const service = await dependencies.getNavigationService();
      throwIfAborted(context.signal);
      await service.navigate(request.target, context.signal);
      throwIfAborted(context.signal);

      const navigationId = dependencies.createNavigationId
        ? dependencies.createNavigationId()
        : `navigation_${generateUUID()}`;
      const result = parseAgentToolResult('navigate_journalit', {
        status: 'ok',
        meta: {
          contract_version: agentContractManifest.version,
          contract_digest: agentContractManifest.digest,
          cached: false,
        },
        target: request.target,
        navigation_id: navigationId,
      });
      return { result };
    } catch (error) {
      if (context.signal.aborted) throw context.signal.reason;
      return { result: errorResult(error) };
    }
  };
}
