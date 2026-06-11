import { requestUrl } from 'obsidian';
import { ApiClient } from '../backend/ApiClient';
import { BackendSecretStorage } from '../backend/BackendSecretStorage';
import { ApiError } from '../../types/errors';
import { getPluginInstance } from '../../utils/pluginContext';
import type {
  TradeImportAnalyseRequest,
  TradeImportAnalyseResponse,
  TradeImportCapabilities,
  TradeImportPreviewRequest,
  TradeImportPreviewResponse,
} from './types';

function authHeaders(): Record<string, string> {
  const token = ApiClient.getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function handleTradeImportHttpError(status: number): void {
  if (status === 402) {
    document.dispatchEvent(
      new CustomEvent('journalit:premium-required', {
        detail: { operation: 'Trade Import' },
      })
    );
    return;
  }

  if (status === 401) {
    try {
      const plugin = getPluginInstance();
      const backend = plugin?.settings.backendIntegration;
      if (!plugin || !backend) return;

      BackendSecretStorage.clearAuthToken(plugin);
      backend.userEmail = undefined;
      backend.subscriptionTier = undefined;
      backend.userId = '';
      void plugin.saveSettings();
      document.dispatchEvent(new CustomEvent('journalit:subscription-changed'));
    } catch (_error) {
      // intentional
    }
  }
}

async function postMultipart<T>(
  path: string,
  file: File,
  request: unknown
): Promise<T> {
  const form = new FormData();
  form.append('file', file);
  form.append(
    'request',
    new Blob([JSON.stringify(request)], { type: 'application/json' })
  );

  return new Promise<T>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', ApiClient.buildUrl(path));
    for (const [key, value] of Object.entries(authHeaders()))
      xhr.setRequestHeader(key, value);
    xhr.onload = () => {
      if (xhr.status < 200 || xhr.status >= 300) {
        handleTradeImportHttpError(xhr.status);
        reject(
          new ApiError(
            `Trade Import request failed (${xhr.status})`,
            xhr.status
          )
        );
        return;
      }
      try {
        resolve(JSON.parse(xhr.responseText) as T);
      } catch (error) {
        reject(error);
      }
    };
    xhr.onerror = () =>
      reject(new Error('Trade Import network request failed'));
    xhr.send(form);
  });
}

export class BackendTradeImportService {
  async getCapabilities(): Promise<TradeImportCapabilities> {
    const response = await requestUrl({
      url: ApiClient.buildUrl('/api/v1/trade-import/capabilities'),
      method: 'GET',
      headers: authHeaders(),
      throw: false,
    });
    if (response.status < 200 || response.status >= 300) {
      handleTradeImportHttpError(response.status);
      throw new ApiError(
        'Trade Import capabilities unavailable',
        response.status
      );
    }
    return response.json as TradeImportCapabilities;
  }

  analyse(
    file: File,
    request: TradeImportAnalyseRequest
  ): Promise<TradeImportAnalyseResponse> {
    return postMultipart('/api/v1/trade-import/analyse', file, request);
  }

  preview(
    file: File,
    request: TradeImportPreviewRequest
  ): Promise<TradeImportPreviewResponse> {
    return postMultipart('/api/v1/trade-import/preview', file, request);
  }
}
