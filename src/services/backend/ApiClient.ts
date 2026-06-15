

import { safeString } from '../../utils/safeString';
import { requestUrl } from 'obsidian';
import { ErrorHandler, ErrorContext } from '../../utils/errorHandler';
import { ApiError } from '../../types/errors';
import { getPluginInstance } from '../../utils/pluginContext';

const DEFAULT_BACKEND_SERVER_URL = 'https://api.journalit.co';

function normalizeBackendServerUrl(value: unknown): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return DEFAULT_BACKEND_SERVER_URL;
  }

  try {
    const parsedUrl = new URL(value.trim());
    if (parsedUrl.protocol !== 'https:' && parsedUrl.protocol !== 'http:') {
      return DEFAULT_BACKEND_SERVER_URL;
    }
    parsedUrl.pathname = parsedUrl.pathname.replace(/\/+$|^$/, '');
    parsedUrl.search = '';
    parsedUrl.hash = '';
    return parsedUrl.toString().replace(/\/$/, '');
  } catch {
    return DEFAULT_BACKEND_SERVER_URL;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function normalizeRequestHeaders(
  headers: HeadersInit | undefined
): Record<string, string> {
  if (!headers) {
    return {};
  }

  if (headers instanceof Headers) {
    return Object.fromEntries(headers.entries());
  }

  if (Array.isArray(headers)) {
    return Object.fromEntries(headers.map(([key, value]) => [key, value]));
  }

  return Object.fromEntries(
    Object.entries(headers).map(([key, value]) => [key, String(value)])
  );
}

function requestBodyToString(
  body: BodyInit | null | undefined
): string | undefined {
  return typeof body === 'string' ? body : undefined;
}

function parseErrorContext(error: unknown, context: string): ErrorContext {
  if (!isRecord(error)) {
    return { operation: context };
  }

  const embeddedContext = error.context;
  if (
    isRecord(embeddedContext) &&
    typeof embeddedContext.operation === 'string'
  ) {
    return {
      operation: embeddedContext.operation,
      endpoint:
        typeof embeddedContext.endpoint === 'string'
          ? embeddedContext.endpoint
          : undefined,
      statusCode:
        typeof embeddedContext.statusCode === 'number'
          ? embeddedContext.statusCode
          : undefined,
      responseBody: embeddedContext.responseBody,
      responseHeaders: isRecord(embeddedContext.responseHeaders)
        ? Object.fromEntries(
            Object.entries(embeddedContext.responseHeaders).map(
              ([key, value]) => [key, String(value)]
            )
          )
        : undefined,
    };
  }

  return {
    operation: context,
    endpoint: typeof error.endpoint === 'string' ? error.endpoint : undefined,
    statusCode:
      typeof error.statusCode === 'number' ? error.statusCode : undefined,
  };
}


function getBackendServerUrl(): string {
  try {
    const plugin = getPluginInstance();
    return normalizeBackendServerUrl(
      plugin?.settings?.backendIntegration?.serverUrl
    );
  } catch {
    // intentional
  }

  return DEFAULT_BACKEND_SERVER_URL;
}


export interface SyncResponse {
  status: string;
  synced_trades: number;
  new_files: number;
  updated_files: number;
  errors: string[];
}

export interface SyncStatus {
  last_sync_time: string;
  sync_count: number;
  status: string;
}

export interface VaultRegistrationData {
  vault_path: string;
  user_id: string;
  settings: {
    date_format: string;
    enabled: boolean;
  };
}

export interface Trade {
  id: number;
  account_id: number;
  mt_account_id?: number;
  mt_account_display_name?: string;
  mt_account_number?: string;
  symbol: string;
  direction: string; 
  entry_time: string;
  exit_time?: string;
  entry_price: number;
  exit_price?: number;
  volume: number;
  tradeId?: string;
  schemaVersion?: number | string;
  csvImportId?: string;
  executionLedgerVersion?: number;
  executionIds?: string[];
  profit_loss?: number;
  useDirectPnLInput?: boolean;
  directPnL?: number;
  notes?: string;
  thesis?: string;
  tags?: string[];
  setupIds?: string[];
  setup?: string[];
  mistakeIds?: string[];
  mistake?: string[];
  images?: string[];
  customFields?: Record<string, unknown>;
  commission?: number;
  hasExplicitCommission?: boolean;
  swap?: number;
  fees?: number; 
  rebate?: number;
  mt_comment?: string;
  currency?: string; 
  brokerBaseCurrencyPnl?: number;
  brokerBaseCurrency?: string;
  brokerBaseCurrencyPnlSource?: string;
  status: string; 
  entries?: Array<{ time: string; price: number; size: number }>;
  exits?: Array<{ time: string; price: number; size: number }>;
  dividends?: Array<{ time: string; amount: number }>;

  
  assetType?: 'forex' | 'stock' | 'options' | 'futures' | 'crypto';

  
  strikePrice?: number;
  expirationDate?: string;
  optionType?: 'call' | 'put';
  contractSize?: number;

  
  dollarPerPoint?: number;
  tickSize?: number;
  tickValue?: number;

  
  lotSize?: number;
  pipValue?: number;
  pipSize?: number;
}

export interface TradesResponse {
  trades: Trade[];
  pagination: {
    limit: number;
    offset: number;
    total_count: number;
    has_more: boolean;
  };
}


interface QueuedRequest<T> {
  url: string;
  options: RequestInit;
  context: string;
  resolve: (value: T | null) => void;
  reject: (error: unknown) => void;
  retryCount: number;
  priority: number; 
  
  suppressPremiumRequiredEvent?: boolean;
  
  throwOnPremiumRequired?: boolean;
  
  propagateErrors?: boolean;
}


export class ApiClient {
  private static readonly AUTH_FAILURE_EVENT = 'journalit:auth-failed';
  

  private static requestQueue: QueuedRequest<unknown>[] = [];
  private static activeRequests = 0;
  private static readonly MAX_CONCURRENT_REQUESTS = 3;
  private static readonly RATE_LIMIT_DELAY_MS = 200; 
  private static lastRequestTime = 0;
  private static isProcessingQueue = false;

  
  private static readonly MAX_RETRY_ATTEMPTS = 3;
  private static readonly RETRY_DELAY_BASE_MS = 1000; 

  
  private static responseCache = new Map<
    string,
    { data: unknown; timestamp: number }
  >();
  private static readonly CACHE_TTL_MS = 5 * 60 * 1000; 

  
  private static authToken: string | null = null;

  
  static setAuthToken(token: string | null): void {
    this.authToken = token;
  }

  
  static getAuthToken(): string | null {
    return this.authToken;
  }

  
  private static requiresAuth(url: string): boolean {
    
    const authEndpoints = [
      '/api/v1/trades',
      '/api/v1/mt-accounts',
      '/api/v1/obsidian/status',
      '/api/v1/obsidian/register-vault',
      '/api/v1/ftp-users',
      '/api/v1/sync/ftp',
      '/api/v1/csv',
      '/api/v1/trade-import',
      '/api/v1/me/entitlements',
    ];

    return authEndpoints.some((endpoint) => url.includes(endpoint));
  }

  
  private static getHeaders(
    providedHeaders: Record<string, string> = {}
  ): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept-Language': 'en-US',
      ...providedHeaders,
    };

    
    if (
      this.authToken &&
      this.requiresAuth(providedHeaders['x-endpoint'] || '')
    ) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    
    delete headers['x-endpoint'];

    return headers;
  }

  
  static async makeRequest<T>(
    url: string,
    options: RequestInit = {},
    context: string = 'API call',
    priority: number = 0,
    config?: {
      suppressPremiumRequiredEvent?: boolean;
      throwOnPremiumRequired?: boolean;
      propagateErrors?: boolean;
    }
  ): Promise<T | null> {
    
    if (options.method === 'GET' || !options.method) {
      const cached = this.getCachedResponse<T>(url);
      if (cached !== null) {
        return cached;
      }
    }

    
    const tempHeaders = {
      ...normalizeRequestHeaders(options.headers),
      'x-endpoint': url,
    };

    
    const authHeaders = this.getHeaders(tempHeaders);

    
    const authenticatedOptions: RequestInit = {
      ...options,
      headers: authHeaders,
    };

    
    return new Promise((resolve, reject) => {
      const queueItem: QueuedRequest<T> = {
        url,
        options: authenticatedOptions,
        context,
        resolve,
        reject,
        retryCount: 0,
        priority,
        suppressPremiumRequiredEvent: config?.suppressPremiumRequiredEvent,
        throwOnPremiumRequired: config?.throwOnPremiumRequired,
        propagateErrors: config?.propagateErrors,
      };

      this.requestQueue.push(queueItem);
      this.requestQueue.sort((a, b) => b.priority - a.priority); 

      
      if (!this.isProcessingQueue) {
        void this.processQueue();
      }
    });
  }

  
  private static async processQueue(): Promise<void> {
    if (this.isProcessingQueue) return;
    this.isProcessingQueue = true;

    while (
      this.requestQueue.length > 0 &&
      this.activeRequests < this.MAX_CONCURRENT_REQUESTS
    ) {
      
      const now = Date.now();
      const timeSinceLastRequest = now - this.lastRequestTime;
      if (timeSinceLastRequest < this.RATE_LIMIT_DELAY_MS) {
        await new Promise((resolve) =>
          window.setTimeout(
            resolve,
            this.RATE_LIMIT_DELAY_MS - timeSinceLastRequest
          )
        );
      }

      const request = this.requestQueue.shift();
      if (!request) continue;

      this.activeRequests++;
      this.lastRequestTime = Date.now();

      
      void this.executeRequest(request).finally(() => {
        this.activeRequests--;
        
        if (this.requestQueue.length > 0) {
          void this.processQueue();
        }
      });
    }

    this.isProcessingQueue = false;
  }

  
  private static async executeRequest<T>(
    request: QueuedRequest<T>
  ): Promise<void> {
    try {
      const response = await requestUrl({
        url: request.url,
        method: request.options.method || 'GET',
        headers: normalizeRequestHeaders(request.options.headers),
        body: requestBodyToString(request.options.body),
        throw: false,
      });

      
      
      
      
      const getHeader = (
        headers: Record<string, string> | undefined,
        name: string
      ): string | undefined => {
        if (!headers) return undefined;

        
        const direct =
          headers[name] ??
          headers[name.toLowerCase()] ??
          headers[name.toUpperCase()];
        if (direct !== undefined) return direct;

        
        const key = Object.keys(headers).find(
          (k) => k.toLowerCase() === name.toLowerCase()
        );
        return key ? headers[key] : undefined;
      };

      if (response.status < 200 || response.status >= 300) {
        
        if (
          (response.status === 429 || response.status >= 500) &&
          request.retryCount < this.MAX_RETRY_ATTEMPTS
        ) {
          await this.retryRequest(request);
          return;
        }

        
        if (response.status === 402) {
          
          if (request.throwOnPremiumRequired) {
            const errorContext: ErrorContext = {
              operation: request.context,
              endpoint: request.url,
              statusCode: response.status,
              responseBody: null,
              responseHeaders: response.headers,
            };

            throw new ApiError(
              `API Error: ${response.status}`,
              response.status,
              errorContext
            );
          }

          
          if (!request.suppressPremiumRequiredEvent) {
            window.dispatchEvent(
              new CustomEvent('journalit:premium-required', {
                detail: {
                  operation: request.context,
                  endpoint: request.url,
                },
              })
            );
          }

          
          request.resolve(null);
          return;
        }

        
        const contentTypeHeader = getHeader(response.headers, 'content-type');
        const responseBody: unknown = contentTypeHeader?.includes(
          'application/json'
        )
          ? response.json
          : null;

        const errorContext: ErrorContext = {
          operation: request.context,
          endpoint: request.url,
          statusCode: response.status,
          responseBody,
          responseHeaders: response.headers,
        };

        if (
          response.status === 401 &&
          this.authToken &&
          this.requiresAuth(request.url)
        ) {
          this.dispatchAuthFailure(errorContext);
        }

        throw new ApiError(
          `API Error: ${response.status}`,
          response.status,
          errorContext
        );
      }

      
      let data: T | null = null;
      const contentLengthHeader = getHeader(response.headers, 'content-length');
      if (response.status !== 204 && contentLengthHeader !== '0') {
        const contentType = getHeader(response.headers, 'content-type');
        if (contentType && contentType.includes('application/json')) {
          try {
            
            
            
            data = response.json as T;
          } catch (jsonError) {
            
            console.warn(
              'Failed to parse JSON response, treating as empty:',
              jsonError
            );
            data = null;
          }
        }
      }

      
      if (request.options.method === 'GET' || !request.options.method) {
        this.setCachedResponse(request.url, data);
      }

      request.resolve(data);
    } catch (error) {
      
      if (
        (error instanceof Error &&
          error.message?.includes('API Error: 400') &&
          request.context
            .toLowerCase()
            .includes('verify authentication code')) ||
        (error instanceof Error &&
          error.message?.includes('API Error: 429') &&
          request.context.toLowerCase().includes('verification code'))
      ) {
        console.warn(`Auth verification failed (${request.context}):`, error);
        request.resolve(null);
        return;
      }

      
      if (
        request.context.toLowerCase().includes('device flow') ||
        request.context.toLowerCase().includes('poll device')
      ) {
        request.reject(error);
        return;
      }

      
      if (request.propagateErrors) {
        request.reject(error);
        return;
      }

      
      if (
        request.retryCount < this.MAX_RETRY_ATTEMPTS &&
        ((error instanceof Error && error.name === 'TypeError') ||
          (error instanceof Error && error.message?.includes('fetch')))
      ) {
        await this.retryRequest(request);
      } else {
        this.handleError(error, request.context);
        request.resolve(null);
      }
    }
  }

  
  private static async retryRequest<T>(
    request: QueuedRequest<T>
  ): Promise<void> {
    request.retryCount++;
    const delay =
      this.RETRY_DELAY_BASE_MS * Math.pow(2, request.retryCount - 1);

    await new Promise((resolve) => window.setTimeout(resolve, delay));

    
    request.priority += 10; 
    this.requestQueue.unshift(request);

    if (!this.isProcessingQueue) {
      void this.processQueue();
    }
  }

  
  private static getCachedResponse<T>(url: string): T | null {
    const cached = this.responseCache.get(url);
    if (!cached) return null;

    const age = Date.now() - cached.timestamp;
    if (age > this.CACHE_TTL_MS) {
      this.responseCache.delete(url);
      return null;
    }

    
    
    return cached.data as T;
  }

  

  private static setCachedResponse(url: string, data: unknown): void {
    this.responseCache.set(url, {
      data,
      timestamp: Date.now(),
    });

    
    if (this.responseCache.size > 100) {
      
      const entries = Array.from(this.responseCache.entries()).sort(
        (a, b) => a[1].timestamp - b[1].timestamp
      );

      for (let i = 0; i < 20; i++) {
        this.responseCache.delete(entries[i][0]);
      }
    }
  }

  
  private static handleError(error: unknown, context: string): null {
    const errorContext = parseErrorContext(error, context);

    
    ErrorHandler.handleError(error, errorContext);
    return null;
  }

  private static dispatchAuthFailure(context: ErrorContext): void {
    if (typeof window.activeDocument === 'undefined') {
      return;
    }

    const event = new CustomEvent(this.AUTH_FAILURE_EVENT, {
      detail: context,
    });
    window.dispatchEvent(event);
    window.activeDocument.dispatchEvent(
      new CustomEvent(this.AUTH_FAILURE_EVENT, {
        detail: context,
      })
    );
  }

  
  static async checkHealth(): Promise<boolean> {
    try {
      const response = await requestUrl({
        url: ApiClient.buildUrl('/api/v1/health'),
        method: 'GET',
        throw: false,
      });

      return response.status >= 200 && response.status < 300;
    } catch {
      return false;
    }
  }

  

  static buildUrl(path: string, params?: Record<string, unknown>): string {
    const url = new URL(path, `${getBackendServerUrl()}/`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, safeString(value));
        }
      });
    }

    return url.toString();
  }

  
  static clearQueue(): void {
    
    this.requestQueue.forEach((request) => {
      request.reject(new Error('Request queue cleared'));
    });
    this.requestQueue = [];
    this.isProcessingQueue = false;
  }

  
  static getQueueStatus(): {
    queueLength: number;
    activeRequests: number;
    cacheSize: number;
  } {
    return {
      queueLength: this.requestQueue.length,
      activeRequests: this.activeRequests,
      cacheSize: this.responseCache.size,
    };
  }

  
  static clearCache(): void {
    this.responseCache.clear();
  }

  
  static invalidateCache(urlPattern: string | RegExp): void {
    const pattern =
      typeof urlPattern === 'string'
        ? new RegExp(urlPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
        : urlPattern;

    let invalidatedCount = 0;
    for (const [url] of this.responseCache) {
      if (pattern.test(url)) {
        this.responseCache.delete(url);
        invalidatedCount++;
      }
    }

    if (invalidatedCount > 0) {
      // intentional
    }
  }
}

export {};
