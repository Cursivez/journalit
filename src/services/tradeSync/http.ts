import { ApiClient } from '../backend/ApiClient';
import { clearPersistedBackendAuthSession } from '../backend/BackendAuthFailure';
import { getPluginInstance } from '../../utils/pluginContext';

export function authHeaders(token: string | null): Record<string, string> {
  return token ? { Authorization: `Bearer ${token}` } : {};
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
