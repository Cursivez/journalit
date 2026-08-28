import {
  requestUrl,
  type RequestUrlParam,
  type RequestUrlResponse,
} from 'obsidian';
import {
  ApiClient,
  AuthenticationRefreshUnavailableError,
} from '../backend/ApiClient';
import { clearPersistedBackendAuthSession } from '../backend/BackendAuthFailure';
import { getPluginInstance } from '../../utils/pluginContext';
import { ApiError } from '../../types/errors';

export function authHeaders(token: string | null): Record<string, string> {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function tradeSyncApiErrorCode(value: unknown): string | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  if (!('error' in value)) return null;
  return typeof value.error === 'string' ? value.error : null;
}

type BrokerProviderUnavailableReason = 'disabled' | 'tier';


export function brokerProviderUnavailableReason(
  error: unknown,
  options: { allowRithmicDisabled?: boolean } = {}
): BrokerProviderUnavailableReason | null {
  if (!(error instanceof ApiError) || error.statusCode == null) return null;
  if (error.statusCode === 402 || error.statusCode === 403) return 'tier';
  if (
    Boolean(options.allowRithmicDisabled) &&
    error.statusCode === 404 &&
    tradeSyncApiErrorCode(error.context?.responseBody) === 'rithmic_disabled'
  ) {
    return 'disabled';
  }
  return null;
}

export async function requestTradeSyncWithAuthRetry(
  buildRequest: (authToken: string | null) => RequestUrlParam
): Promise<{
  response: RequestUrlResponse;
  requestAuthToken: string | null;
}> {
  let requestAuthToken = ApiClient.getAuthToken();
  let response = await requestUrl(buildRequest(requestAuthToken));
  if (response.status === 401 && requestAuthToken) {
    const refreshOutcome =
      await ApiClient.refreshAuthentication(requestAuthToken);
    if (refreshOutcome === 'refreshed') {
      requestAuthToken = ApiClient.getAuthToken();
      response = await requestUrl(buildRequest(requestAuthToken));
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
  interactiveEntitlement = true
): void {
  if (status === 402 && interactiveEntitlement) {
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
