import { requestUrl } from 'obsidian';
import { ApiClient } from '../backend/ApiClient';
import { ApiError } from '../../types/errors';
import { handleTradeSyncHttpError, authHeaders } from './http';
import {
  decodeRestoreProjectionResponse,
  decodeTradovateAccountSetupResponse,
  decodeTradovateClientDiagnosticsResponse,
  decodeTradovateConnectionsResponse,
  decodeTradovateJobResponse,
  decodeTradovateSyncJobResponse,
  decodeTradeProjectionInventoryResponse,
  decodeTradeProjectionMappingResponse,
  decodeTradeProjectionResponse,
} from './BackendTradeProjectionResponseDecoders';
import type {
  TradeProjectionAckRequest,
  TradeProjectionAccountInventoryResponse,
  TradeProjectionAccountVaultMapping,
  TradeProjectionAccountVaultMappingRequest,
  TradeProjectionRequest,
  TradeProjectionRequestOptions,
  TradeProjectionResponse,
  TradovateAccountSelection,
  TradovateClientDiagnosticPayload,
  TradovateClientOperationContext,
  TradovateConnections,
  TradovateSyncJob,
} from './types';

function projectionQuery(request: TradeProjectionRequest): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(request)) {
    if (value !== undefined && value !== null) params.set(key, String(value));
  }
  return params.toString();
}

function apiErrorCode(value: unknown): string | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  if (!('error' in value)) return null;
  return typeof value.error === 'string' ? value.error : null;
}

export class TradovateSyncClaimConflictError extends ApiError {
  constructor() {
    super('Tradovate account synchronization claim conflict', 409);
  }
}

export class BackendTradeProjectionService {
  async restoreProjection(
    tradeId: string,
    vaultId: string,
    operation?: TradovateClientOperationContext
  ): Promise<{ version: number; generation: string }> {
    const token = ApiClient.getAuthToken();
    const response = await requestUrl({
      url: ApiClient.buildUrl(
        `/api/v1/trade-projections/${encodeURIComponent(tradeId)}/restore`
      ),
      method: 'POST',
      headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
      body: JSON.stringify({
        vaultId,
        pluginVersion: operation?.pluginVersion,
        clientOperationId: operation?.clientOperationId,
      }),
      throw: false,
    });
    if (response.status < 200 || response.status >= 300) {
      handleTradeSyncHttpError(response.status, token, 'Trade Projection');
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
    const token = ApiClient.getAuthToken();
    const response = await requestUrl({
      url: ApiClient.buildUrl('/api/v1/trade-projections/ack'),
      method: 'POST',
      headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
      body: JSON.stringify({
        vaultId: request.vaultId,
        deviceId: request.deviceId,
        pluginVersion: request.pluginVersion,
        clientOperationId: request.clientOperationId,
        results: request.results,
      }),
      throw: false,
    });
    if (response.status < 200 || response.status >= 300) {
      handleTradeSyncHttpError(
        response.status,
        token,
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

  async startTradovateSync(
    connectionId: string,
    intent: 'sync' | 'discovery' = 'sync',
    operation?: TradovateClientOperationContext
  ): Promise<TradovateSyncJob> {
    const token = ApiClient.getAuthToken();
    const response = await requestUrl({
      url: ApiClient.buildUrl(
        `/api/v1/broker-connections/tradovate/connections/${encodeURIComponent(connectionId)}/sync`
      ),
      method: 'POST',
      headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source: 'plugin',
        intent,
        pluginVersion: operation?.pluginVersion,
        vaultId: operation?.vaultId,
        deviceId: operation?.deviceId,
        clientOperationId: operation?.clientOperationId,
      }),
      throw: false,
    });
    if (response.status < 200 || response.status >= 300) {
      handleTradeSyncHttpError(response.status, token, 'Trade Projection');
      throw new ApiError(
        `Tradovate cloud sync failed (${response.status})`,
        response.status
      );
    }
    return decodeTradovateSyncJobResponse(response.json, connectionId);
  }

  async configureTradovateAccounts(
    connectionId: string,
    accounts: TradovateAccountSelection[],
    operation?: TradovateClientOperationContext
  ): Promise<{ job: TradovateSyncJob | null; created: boolean }> {
    const token = ApiClient.getAuthToken();
    const response = await requestUrl({
      url: ApiClient.buildUrl(
        `/api/v1/broker-connections/tradovate/connections/${encodeURIComponent(connectionId)}/accounts`
      ),
      method: 'PUT',
      headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source: 'plugin',
        accounts,
        pluginVersion: operation?.pluginVersion,
        vaultId: operation?.vaultId,
        deviceId: operation?.deviceId,
        clientOperationId: operation?.clientOperationId,
      }),
      throw: false,
    });
    if (response.status < 200 || response.status >= 300) {
      if (
        response.status === 409 &&
        apiErrorCode(response.json) === 'sync_claim_conflict'
      ) {
        throw new TradovateSyncClaimConflictError();
      }
      handleTradeSyncHttpError(response.status, token, 'Tradovate');
      throw new ApiError(
        `Tradovate account setup failed (${response.status})`,
        response.status
      );
    }
    return decodeTradovateAccountSetupResponse(response.json, connectionId);
  }

  async getTradovateJob(
    connectionId: string,
    jobId: string
  ): Promise<TradovateSyncJob> {
    const token = ApiClient.getAuthToken();
    const response = await requestUrl({
      url: ApiClient.buildUrl(
        `/api/v1/broker-connections/tradovate/connections/${encodeURIComponent(connectionId)}/jobs/${encodeURIComponent(jobId)}`
      ),
      method: 'GET',
      headers: authHeaders(token),
      throw: false,
    });
    if (response.status < 200 || response.status >= 300) {
      handleTradeSyncHttpError(response.status, token, 'Tradovate');
      throw new ApiError(
        `Tradovate synchronization job unavailable (${response.status})`,
        response.status
      );
    }
    return decodeTradovateJobResponse(response.json, connectionId, jobId);
  }

  async getTradovateConnections(): Promise<TradovateConnections> {
    const token = ApiClient.getAuthToken();
    const response = await requestUrl({
      url: ApiClient.buildUrl(
        '/api/v1/broker-connections/tradovate/connections'
      ),
      method: 'GET',
      headers: authHeaders(token),
      throw: false,
    });
    if (response.status < 200 || response.status >= 300) {
      handleTradeSyncHttpError(response.status, token, 'Tradovate');
      throw new ApiError(
        `Tradovate status unavailable (${response.status})`,
        response.status
      );
    }
    return decodeTradovateConnectionsResponse(response.json);
  }

  async getRestorableProjections(
    request: TradeProjectionRequest,
    options: TradeProjectionRequestOptions = {}
  ): Promise<TradeProjectionResponse> {
    const token = ApiClient.getAuthToken();
    const response = await requestUrl({
      url: ApiClient.buildUrl(
        `/api/v1/trade-projections/missing?${projectionQuery(request)}`
      ),
      method: 'GET',
      headers: authHeaders(token),
      throw: false,
    });
    if (response.status < 200 || response.status >= 300) {
      handleTradeSyncHttpError(
        response.status,
        token,
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
    const token = ApiClient.getAuthToken();
    const response = await requestUrl({
      url: ApiClient.buildUrl(
        `/api/v1/trade-projections/accounts?vaultId=${encodeURIComponent(vaultId)}`
      ),
      method: 'GET',
      headers: authHeaders(token),
      throw: false,
    });
    if (response.status < 200 || response.status >= 300) {
      handleTradeSyncHttpError(
        response.status,
        token,
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
    const token = ApiClient.getAuthToken();
    const response = await requestUrl({
      url: ApiClient.buildUrl(
        `/api/v1/trade-projections/accounts/${encodeURIComponent(accountId)}/vault-mapping`
      ),
      method: 'PUT',
      headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
      throw: false,
    });
    if (response.status < 200 || response.status >= 300) {
      handleTradeSyncHttpError(response.status, token, 'Trade Projection');
      throw new ApiError(
        `Trade Projection account mapping failed (${response.status})`,
        response.status
      );
    }
    return decodeTradeProjectionMappingResponse(response.json, request);
  }

  async submitTradovateClientDiagnostics(
    payload: TradovateClientDiagnosticPayload
  ): Promise<void> {
    const token = ApiClient.getAuthToken();
    const response = await requestUrl({
      url: ApiClient.buildUrl(
        '/api/v1/broker-connections/tradovate/client-diagnostics'
      ),
      method: 'POST',
      headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      throw: false,
    });
    if (response.status < 200 || response.status >= 300) {
      throw new ApiError(
        `Tradovate client diagnostics submission failed (${response.status})`,
        response.status
      );
    }
    decodeTradovateClientDiagnosticsResponse(response.json);
  }
}
