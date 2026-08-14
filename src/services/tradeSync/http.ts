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

export function authHeaders(token: string | null): Record<string, string> {
  return token ? { Authorization: `Bearer ${token}` } : {};
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
