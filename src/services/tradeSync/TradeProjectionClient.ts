

import { ApiClient } from '../backend/ApiClient';
import { ApiError } from '../../types/errors';
import {
  authHeaders,
  handleTradeSyncHttpError,
  requestTradeSyncWithAuthRetry,
} from './http';
import {
  decodeRestoreProjectionResponse,
  decodeTradeProjectionInventoryResponse,
  decodeTradeProjectionMappingResponse,
  decodeTradeProjectionResponse,
} from './BackendTradeProjectionResponseDecoders';
import type {
  BrokerClientOperationContext,
  TradeProjectionAckRequest,
  TradeProjectionAccountInventoryResponse,
  TradeProjectionAccountVaultMapping,
  TradeProjectionAccountVaultMappingRequest,
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

export class TradeProjectionClient {
  async restoreProjection(
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
      throw new ApiError(
        `Trade Projection account mapping failed (${response.status})`,
        response.status
      );
    }
    return decodeTradeProjectionMappingResponse(response.json, request);
  }
}
