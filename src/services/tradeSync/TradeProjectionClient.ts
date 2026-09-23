

import { ApiClient } from '../backend/ApiClient';
import { ApiError } from '../../types/errors';
import {
  authHeaders,
  handleTradeSyncHttpError,
  requestTradeSyncWithAuthRetry,
  tradeSyncApiErrorCode,
} from './http';
import { tradeSyncRateLimitErrorFromHeaders } from './TradeSyncRateLimit';
import {
  decodeRestoreProjectionResponse,
  decodeTradeProjectionInventoryResponse,
  decodeTradeProjectionMappingResponse,
  decodeTradeProjectionAccountRemapResponse,
  decodeTradeProjectionResponse,
} from './BackendTradeProjectionResponseDecoders';
import type {
  BrokerClientOperationContext,
  TradeProjectionAckRequest,
  TradeProjectionAccountInventoryResponse,
  TradeProjectionAccountVaultMapping,
  TradeProjectionAccountVaultMappingRequest,
  TradeProjectionAccountVaultRemapRequest,
  TradeProjectionAccountVaultRemapResponse,
  TradeProjectionRequest,
  TradeProjectionRequestOptions,
  TradeProjectionResponse,
} from './types';

function projectionQuery(request: TradeProjectionRequest): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(request)) {
    if (value !== undefined && value !== null) params.set(key, String(value));
  }
  return params.toString();
}

const restoreInFlight = new Map<
  string,
  Promise<{ version: number; generation: string }>
>();
const mappingInFlight = new Map<
  string,
  Promise<TradeProjectionAccountVaultMapping>
>();

const NONZERO_UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const NIL_UUID = '00000000-0000-0000-0000-000000000000';

export function resetTradeProjectionMutationInFlightForTests(): void {
  restoreInFlight.clear();
  mappingInFlight.clear();
}

function shareInFlight<T>(
  inFlight: Map<string, Promise<T>>,
  key: string,
  work: () => Promise<T>
): Promise<T> {
  const existing = inFlight.get(key);
  if (existing) return existing;
  const pending = work().finally(() => {
    if (inFlight.get(key) === pending) inFlight.delete(key);
  });
  inFlight.set(key, pending);
  return pending;
}

function restoreMutationKey(
  tradeId: string,
  vaultId: string,
  operation?: BrokerClientOperationContext
): string {
  return JSON.stringify([
    tradeId,
    vaultId,
    operation?.pluginVersion ?? '',
    operation?.clientOperationId ?? '',
  ]);
}

function mutationRequestKey(request: object): [string, unknown][] {
  return Object.entries(request)
    .filter(([, value]) => value !== undefined)
    .sort(([left], [right]) => left.localeCompare(right));
}

function mappingMutationKey(
  accountId: string,
  request: TradeProjectionAccountVaultMappingRequest
): string {
  return JSON.stringify([accountId, mutationRequestKey(request)]);
}

export class TradeProjectionAccountRemapUnavailableError extends ApiError {
  constructor(statusCode: number) {
    super(
      `Trade Projection account remapping unavailable (${statusCode})`,
      statusCode
    );
    this.name = 'TradeProjectionAccountRemapUnavailableError';
  }
}

export function isTradeProjectionAccountRemapUnavailableError(
  error: unknown
): error is TradeProjectionAccountRemapUnavailableError {
  return error instanceof TradeProjectionAccountRemapUnavailableError;
}

export class TradeProjectionAccountNotFoundError extends ApiError {
  constructor() {
    super('Trade Projection account was not found', 404);
    this.name = 'TradeProjectionAccountNotFoundError';
  }
}

export function isTradeProjectionAccountNotFoundError(
  error: unknown
): error is TradeProjectionAccountNotFoundError {
  return error instanceof TradeProjectionAccountNotFoundError;
}

type TradeProjectionAccountRemapConflict =
  | 'projection_restore_in_progress'
  | 'remap_operation_conflict'
  | 'account_remap_busy';

const REMAP_CONFLICT_MESSAGES: Record<
  TradeProjectionAccountRemapConflict,
  string
> = {
  projection_restore_in_progress: 'Trade Projection restore is in progress',
  remap_operation_conflict: 'Trade Projection remap operation conflict',
  account_remap_busy: 'Trade Projection account remap is busy',
};

function isTradeProjectionAccountRemapConflict(
  value: string | null
): value is TradeProjectionAccountRemapConflict {
  return (
    value === 'projection_restore_in_progress' ||
    value === 'remap_operation_conflict' ||
    value === 'account_remap_busy'
  );
}

export class TradeProjectionAccountRemapConflictError extends ApiError {
  readonly conflict: TradeProjectionAccountRemapConflict;

  constructor(conflict: TradeProjectionAccountRemapConflict) {
    super(REMAP_CONFLICT_MESSAGES[conflict], 409);
    this.name = 'TradeProjectionAccountRemapConflictError';
    this.conflict = conflict;
  }
}

export function isTradeProjectionAccountRemapConflictError(
  error: unknown
): error is TradeProjectionAccountRemapConflictError {
  return error instanceof TradeProjectionAccountRemapConflictError;
}

function isNonzeroUuid(value: string): boolean {
  return NONZERO_UUID_PATTERN.test(value) && value.toLowerCase() !== NIL_UUID;
}

function assertRemapRequest(
  request: TradeProjectionAccountVaultRemapRequest
): void {
  if (!isNonzeroUuid(request.clientOperationId)) {
    throw new Error('Invalid Trade Projection account remap request');
  }
  if (request.existingNotes !== 'update' && request.existingNotes !== 'leave') {
    throw new Error('Invalid Trade Projection account remap request');
  }
}

function readRemapResponseJson(response: { json: unknown }): unknown {
  try {
    return response.json;
  } catch {
    return undefined;
  }
}

export class TradeProjectionClient {
  async restoreProjection(
    tradeId: string,
    vaultId: string,
    operation?: BrokerClientOperationContext
  ): Promise<{ version: number; generation: string }> {
    return shareInFlight(
      restoreInFlight,
      restoreMutationKey(tradeId, vaultId, operation),
      () => this.restoreProjectionRequest(tradeId, vaultId, operation)
    );
  }

  private async restoreProjectionRequest(
    tradeId: string,
    vaultId: string,
    operation?: BrokerClientOperationContext
  ): Promise<{ version: number; generation: string }> {
    const { response, requestAuthToken } = await requestTradeSyncWithAuthRetry(
      (authToken) => ({
        url: ApiClient.buildUrl(
          `/api/v1/trade-projections/${encodeURIComponent(tradeId)}/restore`
        ),
        method: 'POST',
        headers: {
          ...authHeaders(authToken),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vaultId,
          pluginVersion: operation?.pluginVersion,
          clientOperationId: operation?.clientOperationId,
        }),
        throw: false,
      })
    );
    if (response.status < 200 || response.status >= 300) {
      handleTradeSyncHttpError(
        response.status,
        requestAuthToken,
        'Trade Projection'
      );
      if (response.status === 429) {
        throw tradeSyncRateLimitErrorFromHeaders(
          `Trade Projection restore failed (${response.status})`,
          response.headers,
          'restore'
        );
      }
      throw new ApiError(
        `Trade Projection restore failed (${response.status})`,
        response.status
      );
    }
    return decodeRestoreProjectionResponse(response.json, tradeId);
  }

  async projectionAck(
    request: TradeProjectionAckRequest,
    options: TradeProjectionRequestOptions = {}
  ): Promise<void> {
    const { response, requestAuthToken } = await requestTradeSyncWithAuthRetry(
      (authToken) => ({
        url: ApiClient.buildUrl('/api/v1/trade-projections/ack'),
        method: 'POST',
        headers: {
          ...authHeaders(authToken),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vaultId: request.vaultId,
          deviceId: request.deviceId,
          pluginVersion: request.pluginVersion,
          clientOperationId: request.clientOperationId,
          results: request.results,
        }),
        throw: false,
      })
    );
    if (response.status < 200 || response.status >= 300) {
      handleTradeSyncHttpError(
        response.status,
        requestAuthToken,
        'Trade Projection',
        options.interactiveEntitlement ?? true
      );
      throw new ApiError(
        `Trade Projection acknowledgement failed (${response.status})`,
        response.status,
        {
          operation: 'Trade Projection acknowledgement',
          endpoint: '/api/v1/trade-projections/ack',
          statusCode: response.status,
          responseHeaders: response.headers,
        }
      );
    }
  }

  async getRestorableProjections(
    request: TradeProjectionRequest,
    options: TradeProjectionRequestOptions = {}
  ): Promise<TradeProjectionResponse> {
    const { response, requestAuthToken } = await requestTradeSyncWithAuthRetry(
      (authToken) => ({
        url: ApiClient.buildUrl(
          `/api/v1/trade-projections/missing?${projectionQuery(request)}`
        ),
        method: 'GET',
        headers: authHeaders(authToken),
        throw: false,
      })
    );
    if (response.status < 200 || response.status >= 300) {
      handleTradeSyncHttpError(
        response.status,
        requestAuthToken,
        'Trade Projection',
        options.interactiveEntitlement ?? true
      );
      throw new ApiError(
        `Trade Projection restorable projections unavailable (${response.status})`,
        response.status
      );
    }
    return decodeTradeProjectionResponse(response.json, request);
  }

  async getAccountInventory(
    vaultId: string,
    options: TradeProjectionRequestOptions = {}
  ): Promise<TradeProjectionAccountInventoryResponse> {
    const { response, requestAuthToken } = await requestTradeSyncWithAuthRetry(
      (authToken) => ({
        url: ApiClient.buildUrl(
          `/api/v1/trade-projections/accounts?vaultId=${encodeURIComponent(vaultId)}`
        ),
        method: 'GET',
        headers: authHeaders(authToken),
        throw: false,
      })
    );
    if (response.status < 200 || response.status >= 300) {
      handleTradeSyncHttpError(
        response.status,
        requestAuthToken,
        'Trade Projection',
        options.interactiveEntitlement ?? true
      );
      throw new ApiError(
        `Trade Projection accounts unavailable (${response.status})`,
        response.status
      );
    }
    return decodeTradeProjectionInventoryResponse(response.json, vaultId);
  }

  async updateAccountVaultMapping(
    accountId: string,
    request: TradeProjectionAccountVaultMappingRequest
  ): Promise<TradeProjectionAccountVaultMapping> {
    return shareInFlight(
      mappingInFlight,
      mappingMutationKey(accountId, request),
      () => this.updateAccountVaultMappingRequest(accountId, request)
    );
  }

  private async updateAccountVaultMappingRequest(
    accountId: string,
    request: TradeProjectionAccountVaultMappingRequest
  ): Promise<TradeProjectionAccountVaultMapping> {
    const { response, requestAuthToken } = await requestTradeSyncWithAuthRetry(
      (authToken) => ({
        url: ApiClient.buildUrl(
          `/api/v1/trade-projections/accounts/${encodeURIComponent(accountId)}/vault-mapping`
        ),
        method: 'PUT',
        headers: {
          ...authHeaders(authToken),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        throw: false,
      })
    );
    if (response.status < 200 || response.status >= 300) {
      handleTradeSyncHttpError(
        response.status,
        requestAuthToken,
        'Trade Projection'
      );
      if (response.status === 429) {
        throw tradeSyncRateLimitErrorFromHeaders(
          `Trade Projection account mapping failed (${response.status})`,
          response.headers,
          'mapping'
        );
      }
      throw new ApiError(
        `Trade Projection account mapping failed (${response.status})`,
        response.status
      );
    }
    return decodeTradeProjectionMappingResponse(response.json, request);
  }

  async remapAccountVaultMapping(
    accountId: string,
    request: TradeProjectionAccountVaultRemapRequest
  ): Promise<TradeProjectionAccountVaultRemapResponse> {
    assertRemapRequest(request);
    return this.remapAccountVaultMappingRequest(accountId, request);
  }

  private async remapAccountVaultMappingRequest(
    accountId: string,
    request: TradeProjectionAccountVaultRemapRequest
  ): Promise<TradeProjectionAccountVaultRemapResponse> {
    const { response, requestAuthToken } = await requestTradeSyncWithAuthRetry(
      (authToken) => ({
        url: ApiClient.buildUrl(
          `/api/v1/trade-projections/accounts/${encodeURIComponent(accountId)}/vault-remap`
        ),
        method: 'POST',
        headers: {
          ...authHeaders(authToken),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vaultId: request.vaultId,
          localAccountId: request.localAccountId,
          localAccountName: request.localAccountName,
          existingNotes: request.existingNotes,
          clientOperationId: request.clientOperationId,
          pluginVersion: request.pluginVersion,
          deviceId: request.deviceId,
        }),
        throw: false,
      })
    );
    if (response.status < 200 || response.status >= 300) {
      handleTradeSyncHttpError(
        response.status,
        requestAuthToken,
        'Trade Projection'
      );
      const responseJson = readRemapResponseJson(response);
      if (response.status === 404 || response.status === 405) {
        if (
          response.status === 404 &&
          tradeSyncApiErrorCode(responseJson) ===
            'trade_import_account_not_found'
        ) {
          throw new TradeProjectionAccountNotFoundError();
        }
        throw new TradeProjectionAccountRemapUnavailableError(response.status);
      }
      if (response.status === 409) {
        const conflict = tradeSyncApiErrorCode(responseJson);
        if (isTradeProjectionAccountRemapConflict(conflict)) {
          throw new TradeProjectionAccountRemapConflictError(conflict);
        }
      }
      if (response.status === 429) {
        throw tradeSyncRateLimitErrorFromHeaders(
          `Trade Projection account remapping failed (${response.status})`,
          response.headers,
          'mapping'
        );
      }
      throw new ApiError(
        `Trade Projection account remapping failed (${response.status})`,
        response.status,
        {
          operation: 'Trade Projection',
          statusCode: response.status,
          responseBody: responseJson,
        }
      );
    }
    return decodeTradeProjectionAccountRemapResponse(
      response.json,
      request,
      accountId
    );
  }
}
