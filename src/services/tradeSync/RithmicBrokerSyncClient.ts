

import { ApiClient } from '../backend/ApiClient';
import { ApiError } from '../../types/errors';
import {
  authHeaders,
  handleTradeSyncHttpError,
  requestTradeSyncWithAuthRetry,
} from './http';
import {
  decodeRithmicConnectionsResponse,
  decodeRithmicJobResponse,
  decodeRithmicSyncJobResponse,
} from './BackendTradeProjectionResponseDecoders';
import type {
  BrokerClientOperationContext,
  BrokerSyncJob,
  RithmicConnections,
  TradeProjectionRequestOptions,
} from './types';

export class RithmicBrokerSyncClient {
  async getRithmicConnections(
    options: TradeProjectionRequestOptions = {}
  ): Promise<RithmicConnections> {
    const { response, requestAuthToken } = await requestTradeSyncWithAuthRetry(
      (authToken) => ({
        url: ApiClient.buildUrl(
          '/api/v1/broker-connections/rithmic/connections'
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
        'Rithmic',
        options.interactiveEntitlement ?? true
      );
      throw new ApiError(
        `Rithmic status unavailable (${response.status})`,
        response.status,
        {
          operation: 'Rithmic',
          statusCode: response.status,
          responseBody: response.json,
        }
      );
    }
    return decodeRithmicConnectionsResponse(response.json);
  }

  async startRithmicSync(
    connectionId: string,
    operation?: BrokerClientOperationContext
  ): Promise<BrokerSyncJob> {
    const { response, requestAuthToken } = await requestTradeSyncWithAuthRetry(
      (authToken) => ({
        url: ApiClient.buildUrl(
          `/api/v1/broker-connections/rithmic/${encodeURIComponent(connectionId)}/sync`
        ),
        method: 'POST',
        headers: {
          ...authHeaders(authToken),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source: 'plugin',
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
        `Rithmic cloud sync failed (${response.status})`,
        response.status
      );
    }
    return decodeRithmicSyncJobResponse(response.json, connectionId);
  }

  async getRithmicJob(
    connectionId: string,
    jobId: string
  ): Promise<BrokerSyncJob> {
    const { response, requestAuthToken } = await requestTradeSyncWithAuthRetry(
      (authToken) => ({
        url: ApiClient.buildUrl(
          `/api/v1/broker-connections/rithmic/${encodeURIComponent(connectionId)}/jobs/${encodeURIComponent(jobId)}`
        ),
        method: 'GET',
        headers: authHeaders(authToken),
        throw: false,
      })
    );
    if (response.status < 200 || response.status >= 300) {
      handleTradeSyncHttpError(response.status, requestAuthToken, 'Rithmic');
      throw new ApiError(
        `Rithmic synchronization job unavailable (${response.status})`,
        response.status
      );
    }
    return decodeRithmicJobResponse(response.json, connectionId, jobId);
  }
}
