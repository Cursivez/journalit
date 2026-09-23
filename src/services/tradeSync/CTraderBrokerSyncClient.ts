

import { ApiClient } from '../backend/ApiClient';
import { ApiError } from '../../types/errors';
import {
  authHeaders,
  handleTradeSyncHttpError,
  requestTradeSyncWithAuthRetry,
  tradeSyncApiErrorCode,
} from './http';
import {
  decodeCTraderAccountSetupResponse,
  decodeCTraderConnectionsResponse,
  decodeCTraderJobResponse,
  decodeCTraderSyncJobResponse,
} from './BackendTradeProjectionResponseDecoders';
import type {
  BrokerClientOperationContext,
  BrokerSyncJob,
  CTraderAccountSelection,
  CTraderConnections,
  TradeProjectionRequestOptions,
} from './types';

export class CTraderSyncClaimConflictError extends ApiError {
  constructor() {
    super('cTrader account synchronization claim conflict', 409);
  }
}

export class CTraderBrokerSyncClient {
  async startCTraderSync(
    connectionId: string,
    intent: 'sync' | 'discovery' = 'sync',
    operation?: BrokerClientOperationContext
  ): Promise<BrokerSyncJob> {
    const { response, requestAuthToken } = await requestTradeSyncWithAuthRetry(
      (authToken) => ({
        url: ApiClient.buildUrl(
          `/api/v1/broker-connections/ctrader/connections/${encodeURIComponent(connectionId)}/sync`
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
        `cTrader cloud sync failed (${response.status})`,
        response.status
      );
    }
    return decodeCTraderSyncJobResponse(response.json, connectionId);
  }

  async configureCTraderAccounts(
    connectionId: string,
    accounts: CTraderAccountSelection[],
    operation?: BrokerClientOperationContext
  ): Promise<{ job: BrokerSyncJob | null; created: boolean }> {
    const { response, requestAuthToken } = await requestTradeSyncWithAuthRetry(
      (authToken) => ({
        url: ApiClient.buildUrl(
          `/api/v1/broker-connections/ctrader/connections/${encodeURIComponent(connectionId)}/accounts`
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
        throw new CTraderSyncClaimConflictError();
      }
      handleTradeSyncHttpError(response.status, requestAuthToken, 'cTrader');
      throw new ApiError(
        `cTrader account setup failed (${response.status})`,
        response.status
      );
    }
    return decodeCTraderAccountSetupResponse(response.json, connectionId);
  }

  async getCTraderJob(
    connectionId: string,
    jobId: string
  ): Promise<BrokerSyncJob> {
    const { response, requestAuthToken } = await requestTradeSyncWithAuthRetry(
      (authToken) => ({
        url: ApiClient.buildUrl(
          `/api/v1/broker-connections/ctrader/connections/${encodeURIComponent(connectionId)}/jobs/${encodeURIComponent(jobId)}`
        ),
        method: 'GET',
        headers: authHeaders(authToken),
        throw: false,
      })
    );
    if (response.status < 200 || response.status >= 300) {
      handleTradeSyncHttpError(response.status, requestAuthToken, 'cTrader');
      throw new ApiError(
        `cTrader synchronization job unavailable (${response.status})`,
        response.status
      );
    }
    return decodeCTraderJobResponse(response.json, connectionId, jobId);
  }

  
  async getCTraderConnections(
    options: TradeProjectionRequestOptions = {}
  ): Promise<CTraderConnections> {
    const { response, requestAuthToken } = await requestTradeSyncWithAuthRetry(
      (authToken) => ({
        url: ApiClient.buildUrl(
          '/api/v1/broker-connections/ctrader/connections'
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
        'cTrader',
        options.interactiveEntitlement ?? true
      );
      throw new ApiError(
        `cTrader status unavailable (${response.status})`,
        response.status,
        {
          operation: 'cTrader',
          statusCode: response.status,
          responseBody: response.json,
        }
      );
    }
    return decodeCTraderConnectionsResponse(response.json);
  }
}
