import type JournalitPlugin from '../../main';
import { ApiClient } from '../backend/ApiClient';
import type {
  PropFirmIndex,
  PropFirmIndexCache,
  PropFirmProfileCatalog,
  PropFirmProfileCatalogCache,
} from './types';
import {
  normalizePropFirmIndex,
  normalizePropFirmProfileCatalog,
} from './normalization';

const FIRM_INDEX_PATH = '/api/v1/prop-firm-profiles/firms';

const FIRM_INDEX_TTL_MS = 24 * 60 * 60 * 1000;

type PropFirmProfileCatalogRefreshResult =
  | { kind: 'ready'; catalog: PropFirmProfileCatalog }
  | { kind: 'unavailable'; catalog?: PropFirmProfileCatalog };

export class PropFirmProfileCatalogService {
  private lastAttemptAt = 0;
  private activeRefresh: Promise<PropFirmProfileCatalogRefreshResult> | null =
    null;

  constructor(
    private plugin: Pick<JournalitPlugin, 'settings' | 'saveSettings'>,
    private getAuthToken: () => string | null
  ) {}

  getCatalog(): PropFirmProfileCatalog | undefined {
    return this.getCache()?.catalog;
  }

  refresh({
    force = false,
  }: { force?: boolean } = {}): Promise<PropFirmProfileCatalogRefreshResult> {
    if (this.activeRefresh) return this.activeRefresh;
    const cache = this.getCache();
    const backend = this.plugin.settings.backendIntegration;
    if (!this.getAuthToken() || backend?.subscriptionTier !== 'premium') {
      return Promise.resolve({ kind: 'unavailable', catalog: cache?.catalog });
    }
    const now = Date.now();
    const age = cache ? now - Date.parse(cache.fetchedAt) : Infinity;
    if (!force && cache && age >= 0 && age < 15 * 60_000) {
      return Promise.resolve({ kind: 'ready', catalog: cache.catalog });
    }
    if (!force && now - this.lastAttemptAt < 60_000) {
      return Promise.resolve({ kind: 'unavailable', catalog: cache?.catalog });
    }
    this.lastAttemptAt = now;
    const refresh = this.performRefresh().finally(() => {
      if (this.activeRefresh === refresh) this.activeRefresh = null;
    });
    this.activeRefresh = refresh;
    return refresh;
  }

  private async performRefresh(): Promise<PropFirmProfileCatalogRefreshResult> {
    const cache = this.getCache();
    const backend = this.plugin.settings.backendIntegration;
    const authToken = this.getAuthToken();
    if (!backend || !authToken || backend.subscriptionTier !== 'premium') {
      return { kind: 'unavailable', catalog: cache?.catalog };
    }
    
    
    
    const requestUserId = backend.userId;

    ApiClient.setAuthToken(authToken);
    ApiClient.invalidateCache('/api/v1/prop-firm-profiles');
    const url = ApiClient.buildUrl('/api/v1/prop-firm-profiles');
    let responseStatus = 0;
    let responseEtag: string | undefined;
    try {
      const response = await ApiClient.makeRequest<unknown>(
        url,
        {
          method: 'GET',
          headers: {
            'x-endpoint': '/api/v1/prop-firm-profiles',
            ...(cache?.etag ? { 'If-None-Match': cache.etag } : {}),
          },
        },
        'prop-firm profile catalog refresh',
        0,
        {
          propagateErrors: true,
          acceptedStatuses: [304],
          maxRetryAttempts: 0,
          onResponse: (metadata) => {
            responseStatus = metadata.status;
            responseEtag = metadata.getHeader('etag');
          },
        }
      );
      const currentBackend = this.plugin.settings.backendIntegration;
      if (
        !this.getAuthToken() ||
        currentBackend?.userId !== requestUserId ||
        currentBackend?.subscriptionTier !== 'premium'
      ) {
        return { kind: 'unavailable' };
      }
      if (responseStatus === 304 && cache) {
        await this.persistCache({
          ...cache,
          fetchedAt: new Date().toISOString(),
        });
        return { kind: 'ready', catalog: cache.catalog };
      }
      const catalog = normalizePropFirmProfileCatalog(response);
      if (!catalog) return { kind: 'unavailable', catalog: cache?.catalog };
      await this.persistCache({
        catalog,
        etag: responseEtag,
        fetchedAt: new Date().toISOString(),
      });
      return { kind: 'ready', catalog };
    } catch {
      return { kind: 'unavailable', catalog: cache?.catalog };
    }
  }

  
  getFirmIndex(): PropFirmIndex | undefined {
    return this.plugin.settings.backendIntegration?.propFirmIndexCache?.index;
  }

  
  async refreshFirmIndex(): Promise<PropFirmIndex | undefined> {
    const backend = this.plugin.settings.backendIntegration;
    const cache = backend?.propFirmIndexCache;
    const authToken = this.getAuthToken();
    if (!backend || !authToken) return cache?.index;

    const age = cache ? Date.now() - Date.parse(cache.fetchedAt) : Infinity;
    if (cache && age >= 0 && age < FIRM_INDEX_TTL_MS) return cache.index;

    const requestUserId = backend.userId;
    ApiClient.setAuthToken(authToken);
    ApiClient.invalidateCache(FIRM_INDEX_PATH);
    let responseEtag: string | undefined;
    let responseStatus = 0;
    try {
      const response = await ApiClient.makeRequest<unknown>(
        ApiClient.buildUrl(FIRM_INDEX_PATH),
        {
          method: 'GET',
          headers: {
            'x-endpoint': FIRM_INDEX_PATH,
            ...(cache?.etag ? { 'If-None-Match': cache.etag } : {}),
          },
        },
        'prop-firm index refresh',
        0,
        {
          propagateErrors: true,
          acceptedStatuses: [304],
          maxRetryAttempts: 0,
          onResponse: (metadata) => {
            responseStatus = metadata.status;
            responseEtag = metadata.getHeader('etag');
          },
        }
      );
      const currentBackend = this.plugin.settings.backendIntegration;
      if (!this.getAuthToken() || currentBackend?.userId !== requestUserId) {
        return cache?.index;
      }
      if (responseStatus === 304 && cache) {
        await this.persistFirmIndex({
          ...cache,
          fetchedAt: new Date().toISOString(),
        });
        return cache.index;
      }
      const index = normalizePropFirmIndex(response);
      if (!index) return cache?.index;
      await this.persistFirmIndex({
        index,
        ...(responseEtag ? { etag: responseEtag } : {}),
        fetchedAt: new Date().toISOString(),
      });
      return index;
    } catch {
      return cache?.index;
    }
  }

  private async persistFirmIndex(cache: PropFirmIndexCache): Promise<void> {
    const backend = this.plugin.settings.backendIntegration;
    if (!backend) return;
    const previous = backend.propFirmIndexCache;
    backend.propFirmIndexCache = cache;
    try {
      await this.plugin.saveSettings();
    } catch (error) {
      backend.propFirmIndexCache = previous;
      throw error;
    }
  }

  private getCache(): PropFirmProfileCatalogCache | undefined {
    return this.plugin.settings.backendIntegration?.propFirmProfileCatalogCache;
  }

  private async persistCache(
    cache: PropFirmProfileCatalogCache
  ): Promise<void> {
    const backend = this.plugin.settings.backendIntegration;
    if (!backend) return;
    const previous = backend.propFirmProfileCatalogCache;
    backend.propFirmProfileCatalogCache = cache;
    try {
      await this.plugin.saveSettings();
    } catch (error) {
      
      backend.propFirmProfileCatalogCache = previous;
      throw error;
    }
  }
}
