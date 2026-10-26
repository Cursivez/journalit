import { ApiClient } from '../backend/ApiClient';
import { ApiError } from '../../types/errors';
import {
  authHeaders,
  handleTradeSyncHttpError,
  requestTradeSyncWithAuthRetry,
  tradeSyncApiErrorCode,
} from './http';
import {
  decodeHyperliquidConfig,
  decodeHyperliquidClientDiagnosticsReceipt,
  decodeHyperliquidConnections,
  decodeHyperliquidJob,
  decodeHyperliquidSyncJob,
  validateHyperliquidId,
} from './HyperliquidResponseDecoders';
import type {
  BrokerClientOperationContext,
  BrokerSyncJob,
  HyperliquidConfig,
  HyperliquidConnections,
  HyperliquidClientDiagnosticPayload,
  TradeProjectionRequestOptions,
} from './types';


export class HyperliquidBrokerSyncClient {
  async submitHyperliquidClientDiagnostics(
    payload: HyperliquidClientDiagnosticPayload
  ): Promise<void> {
    decodeHyperliquidClientDiagnosticsReceipt(
      await this.request(
        '/client-diagnostics',
        { interactiveEntitlement: false },
        payload
      ),
      payload.events.length
    );
  }

  private async request(
    path: string,
    options: TradeProjectionRequestOptions = {},
    body?: object
  ): Promise<unknown> {
    const { response, requestAuthToken } = await requestTradeSyncWithAuthRetry(
      (token) => ({
        url: ApiClient.buildUrl(
          `/api/v1/broker-connections/hyperliquid${path}`
        ),
        method: body ? 'POST' : 'GET',
        headers: body
          ? { ...authHeaders(token), 'Content-Type': 'application/json' }
          : authHeaders(token),
        ...(body ? { body: JSON.stringify(body) } : {}),
        throw: false,
      })
    );
    let data: unknown;
    try {
      data = response.json;
    } catch {
      
      
      
      data = undefined;
    }
    if (response.status < 200 || response.status >= 300) {
      handleTradeSyncHttpError(
        response.status,
        requestAuthToken,
        'Hyperliquid',
        options.interactiveEntitlement ?? true,
        true
      );
      const code = tradeSyncApiErrorCode(data);
      
      const safeCode =
        code && /^[a-z][a-z0-9_]{0,79}$/.test(code) ? code : null;
      throw new ApiError(
        `Hyperliquid request failed (${response.status})`,
        response.status,
        {
          operation: 'Hyperliquid',
          statusCode: response.status,
          responseBody: safeCode ? { error: safeCode } : undefined,
        }
      );
    }
    return data;
  }

  async getHyperliquidConfig(
    options: TradeProjectionRequestOptions = {}
  ): Promise<HyperliquidConfig> {
    return decodeHyperliquidConfig(await this.request('/config', options));
  }

  async getHyperliquidConnections(
    options: TradeProjectionRequestOptions = {}
  ): Promise<HyperliquidConnections> {
    return decodeHyperliquidConnections(
      await this.request('/connections', options)
    );
  }

  async startHyperliquidSync(
    connectionId: string,
    operation?: BrokerClientOperationContext
  ): Promise<BrokerSyncJob> {
    validateHyperliquidId(connectionId);
    if (
      operation &&
      (operation.provider !== 'hyperliquid' ||
        operation.scope !== 'connection' ||
        operation.connectionId !== connectionId)
    ) {
      throw new ApiError('Invalid Hyperliquid operation scope');
    }
    const data = await this.request(
      `/connections/${encodeURIComponent(connectionId)}/sync`,
      {},
      {
        source: 'plugin',
        intent: 'sync',
        pluginVersion: operation?.pluginVersion,
        vaultId: operation?.vaultId,
        deviceId: operation?.deviceId,
        clientOperationId: operation?.clientOperationId,
      }
    );
    return decodeHyperliquidSyncJob(data, connectionId);
  }

  async getHyperliquidJob(
    connectionId: string,
    jobId: string
  ): Promise<BrokerSyncJob> {
    validateHyperliquidId(connectionId);
    validateHyperliquidId(jobId);
    return decodeHyperliquidJob(
      await this.request(
        `/connections/${encodeURIComponent(connectionId)}/jobs/${encodeURIComponent(jobId)}`
      ),
      connectionId,
      jobId
    );
  }
}
