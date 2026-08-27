

import { ApiClient } from '../backend/ApiClient';
import { ApiError } from '../../types/errors';
import {
  authHeaders,
  handleTradeSyncHttpError,
  requestTradeSyncWithAuthRetry,
  tradeSyncApiErrorCode,
} from './http';
import {
  decodeTradovateAccountSetupResponse,
  decodeTradovateClientDiagnosticsResponse,
  decodeTradovateConnectionsResponse,
  decodeTradovateJobResponse,
  decodeTradovateSyncJobResponse,
} from './BackendTradeProjectionResponseDecoders';
import type {
  BrokerClientOperationContext,
  BrokerSyncJob,
  TradeProjectionRequestOptions,
  TradovateAccountSelection,
  TradovateClientDiagnosticPayload,
  TradovateConnections,
} from './types';

export class TradovateSyncClaimConflictError extends ApiError {
  constructor() {
    super('Tradovate account synchronization claim conflict', 409);
  }
}

export class TradovateBrokerSyncClient {
  async startTradovateSync(
    connectionId: string,
    intent: 'sync' | 'discovery' = 'sync',
    operation?: BrokerClientOperationContext
  ): Promise<BrokerSyncJob> {
    const { response, requestAuthToken } = await requestTradeSyncWithAuthRetry(
      (authToken) => ({
        url: ApiClient.buildUrl(
          `/api/v1/broker-connections/tradovate/connections/${encodeURIComponent(connectionId)}/sync`
        ),
        method: 'POST',
        headers: {
          ...authHeaders(authToken),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source: 'plugin',
          intent,
          pluginVersion: operation?.pluginVersion,
          vaultId: operation?.vaultId,
          deviceId: operation?.deviceId,
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
        `Tradovate cloud sync failed (${response.status})`,
        response.status
      );
    }
    return decodeTradovateSyncJobResponse(response.json, connectionId);
  }

  async configureTradovateAccounts(
    connectionId: string,
    accounts: TradovateAccountSelection[],
    operation?: BrokerClientOperationContext
  ): Promise<{ job: BrokerSyncJob | null; created: boolean }> {
    const { response, requestAuthToken } = await requestTradeSyncWithAuthRetry(
      (authToken) => ({
        url: ApiClient.buildUrl(
          `/api/v1/broker-connections/tradovate/connections/${encodeURIComponent(connectionId)}/accounts`
        ),
        method: 'PUT',
        headers: {
          ...authHeaders(authToken),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source: 'plugin',
          accounts,
          pluginVersion: operation?.pluginVersion,
          vaultId: operation?.vaultId,
          deviceId: operation?.deviceId,
          clientOperationId: operation?.clientOperationId,
        }),
        throw: false,
      })
    );
    if (response.status < 200 || response.status >= 300) {
      if (
        response.status === 409 &&
        tradeSyncApiErrorCode(response.json) === 'sync_claim_conflict'
      ) {
        throw new TradovateSyncClaimConflictError();
      }
      handleTradeSyncHttpError(response.status, requestAuthToken, 'Tradovate');
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
  ): Promise<BrokerSyncJob> {
    const { response, requestAuthToken } = await requestTradeSyncWithAuthRetry(
      (authToken) => ({
        url: ApiClient.buildUrl(
          `/api/v1/broker-connections/tradovate/connections/${encodeURIComponent(connectionId)}/jobs/${encodeURIComponent(jobId)}`
        ),
        method: 'GET',
        headers: authHeaders(authToken),
        throw: false,
      })
    );
    if (response.status < 200 || response.status >= 300) {
      handleTradeSyncHttpError(response.status, requestAuthToken, 'Tradovate');
      throw new ApiError(
        `Tradovate synchronization job unavailable (${response.status})`,
        response.status
      );
    }
    return decodeTradovateJobResponse(response.json, connectionId, jobId);
  }

  
  async getTradovateConnections(
    options: TradeProjectionRequestOptions = {}
  ): Promise<TradovateConnections> {
    const { response, requestAuthToken } = await requestTradeSyncWithAuthRetry(
      (authToken) => ({
        url: ApiClient.buildUrl(
          '/api/v1/broker-connections/tradovate/connections'
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
        'Tradovate',
        options.interactiveEntitlement ?? true
      );
      throw new ApiError(
        `Tradovate status unavailable (${response.status})`,
        response.status
      );
    }
    return decodeTradovateConnectionsResponse(response.json);
  }

  async submitTradovateClientDiagnostics(
    payload: TradovateClientDiagnosticPayload
  ): Promise<void> {
    const { response } = await requestTradeSyncWithAuthRetry((authToken) => ({
      url: ApiClient.buildUrl(
        '/api/v1/broker-connections/tradovate/client-diagnostics'
      ),
      method: 'POST',
      headers: {
        ...authHeaders(authToken),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      throw: false,
    }));
    if (response.status < 200 || response.status >= 300) {
      throw new ApiError(
        `Tradovate client diagnostics submission failed (${response.status})`,
        response.status
      );
    }
    decodeTradovateClientDiagnosticsResponse(response.json);
  }
}
