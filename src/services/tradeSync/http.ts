import { type RequestUrlParam, type RequestUrlResponse } from 'obsidian';
import {
  ApiClient,
  AuthenticationRefreshUnavailableError,
} from '../backend/ApiClient';
import { BackendHttpClient } from '../backend/BackendHttpClient';
import { clearPersistedBackendAuthSession } from '../backend/BackendAuthFailure';
import { getPluginInstance } from '../../utils/pluginContext';
import { ApiError } from '../../types/errors';
import { DemoSyncGate } from '../../demo/DemoSyncGate';

export function authHeaders(token: string | null): Record<string, string> {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function tradeSyncApiErrorCode(value: unknown): string | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  if (!('error' in value)) return null;
  return typeof value.error === 'string' ? value.error : null;
}

export type BrokerProviderUnavailableReason = 'disabled' | 'tier';


export function brokerProviderUnavailableReason(
  error: unknown,
  options: {
    allowRithmicDisabled?: boolean;
    allowCTraderDisabled?: boolean;
    allowHyperliquidDisabled?: boolean;
    allowTradovateDisabled?: boolean;
  } = {}
): BrokerProviderUnavailableReason | null {
  if (!(error instanceof ApiError) || error.statusCode == null) return null;
  if (error.statusCode === 402 || error.statusCode === 403) return 'tier';
  if (error.statusCode !== 404) return null;
  const errorCode = tradeSyncApiErrorCode(error.context?.responseBody);
  const disabled =
    (options.allowRithmicDisabled && errorCode === 'rithmic_disabled') ||
    (options.allowCTraderDisabled &&
      (errorCode === 'ctrader_disabled' ||
        errorCode === 'ctrader_unavailable')) ||
    (options.allowHyperliquidDisabled &&
      errorCode === 'hyperliquid_disabled') ||
    (options.allowTradovateDisabled && errorCode === 'tradovate_disabled');
  return disabled ? 'disabled' : null;
}

export async function requestTradeSyncWithAuthRetry(
  buildRequest: (authToken: string | null) => RequestUrlParam
): Promise<{
  response: RequestUrlResponse;
  requestAuthToken: string | null;
}> {
  DemoSyncGate.assertNetworkAllowed();
  let requestAuthToken = ApiClient.getAuthToken();
  let response = await BackendHttpClient.request(
    buildRequest(requestAuthToken)
  );
  if (response.status === 401 && requestAuthToken) {
    const refreshOutcome =
      await ApiClient.refreshAuthentication(requestAuthToken);
    if (refreshOutcome === 'refreshed') {
      requestAuthToken = ApiClient.getAuthToken();
      DemoSyncGate.assertNetworkAllowed();
      response = await BackendHttpClient.request(
        buildRequest(requestAuthToken)
      );
    } else if (refreshOutcome === 'unavailable') {
      throw new AuthenticationRefreshUnavailableError();
    }
  }
  return { response, requestAuthToken };
}

export function handleTradeSyncHttpError(
  status: number,
  requestAuthToken: string | null,
  operation: string,
  interactiveEntitlement = true,
  entitlementForbidden = false
): void {
  if (
    (status === 402 || (status === 403 && entitlementForbidden)) &&
    interactiveEntitlement
  ) {
    window.dispatchEvent(
      new CustomEvent('journalit:premium-required', {
        detail: { operation },
      })
    );
    return;
  }

  if (status !== 401) return;

  try {
    const plugin = getPluginInstance();
    if (
      !plugin?.settings.backendIntegration ||
      !requestAuthToken ||
      requestAuthToken !== ApiClient.getAuthToken()
    ) {
      return;
    }

    ApiClient.handleAuthenticationFailure({
      operation,
      statusCode: status,
    });
    void clearPersistedBackendAuthSession(plugin, requestAuthToken).catch(
      () => undefined
    );
  } catch {
    // intentional
  }
}
