

import JournalitPlugin from '../../main';
import { ApiClient } from './ApiClient';
import { BackendSecretStorage } from './BackendSecretStorage';
import type { BackendIntegrationSettings } from '../../settings/types';
import { ApiError } from '../../types/errors';


export interface DeviceCodeResponse {
  device_code: string;
  user_code: string; 
  verification_uri: string; 
  expires_in: number; 
  interval: number; 
}


interface DeviceFlowUser {
  id: string;
  email: string;
  tier: string;
}


interface DeviceTokenResponse {
  status: string;
  token: string; 
  user: DeviceFlowUser;
  expires_at: string; 
}


export interface DeviceFlowErrorContext {
  operation: string;
  endpoint?: string;
  statusCode?: number;
  errorCode?: string;
  retryAfterSeconds?: number;
}

export class DeviceFlowError extends Error {
  context?: DeviceFlowErrorContext;

  constructor(message: string, context?: DeviceFlowErrorContext) {
    super(message);
    this.name = 'DeviceFlowError';
    this.context = context;
  }
}


type DeviceFlowPollResult =
  | { status: 'success'; data: DeviceTokenResponse }
  | {
      status: 'pending';
      retryAfterSeconds?: number;
      context?: DeviceFlowErrorContext;
    } 
  | { status: 'expired'; context?: DeviceFlowErrorContext } 
  | { status: 'denied'; context?: DeviceFlowErrorContext } 
  | { status: 'error'; message: string; context?: DeviceFlowErrorContext }; 


export class DeviceFlowService {
  private plugin: JournalitPlugin;
  private settings: BackendIntegrationSettings;

  constructor(plugin: JournalitPlugin, settings: BackendIntegrationSettings) {
    this.plugin = plugin;
    this.settings = settings;
  }

  
  async initiateDeviceFlow(): Promise<DeviceCodeResponse> {
    try {
      const url = ApiClient.buildUrl('/auth/device/code');
      const response = await ApiClient.makeRequest<DeviceCodeResponse>(
        url,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        },
        'initiate device flow',
        1 
      );

      if (!response) {
        throw new DeviceFlowError(
          'Failed to initiate device flow - no response from server',
          {
            operation: 'initiate device flow',
            endpoint: '/auth/device/code',
          }
        );
      }

      return response;
    } catch (error) {
      const context = this.buildErrorContext(
        error,
        'initiate device flow',
        '/auth/device/code'
      );
      console.error('Device flow initiation failed:', error);
      throw new DeviceFlowError(
        'Failed to start device activation. Please check your internet connection.',
        context
      );
    }
  }

  
  async pollForToken(deviceCode: string): Promise<DeviceFlowPollResult> {
    try {
      const url = ApiClient.buildUrl('/auth/device/token');
      const response = await ApiClient.makeRequest<DeviceTokenResponse>(
        url,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ device_code: deviceCode }),
        },
        'poll device flow token',
        1 
      );

      if (response) {
        return { status: 'success', data: response };
      }

      
      return {
        status: 'error',
        message: 'Unexpected empty response',
        context: {
          operation: 'poll device flow token',
          endpoint: '/auth/device/token',
        },
      };
    } catch (error: unknown) {
      const context = this.buildErrorContext(
        error,
        'poll device flow token',
        '/auth/device/token'
      );
      const { statusCode, errorCode, retryAfterSeconds } = context;

      if (statusCode === 400 && errorCode) {
        switch (errorCode) {
          case 'authorization_pending':
            return { status: 'pending', context };
          case 'slow_down':
            return { status: 'pending', retryAfterSeconds, context };
          case 'expired_token':
            return { status: 'expired', context };
          case 'access_denied':
            return { status: 'denied', context };
          case 'invalid_grant':
            return { status: 'expired', context };
          default:
            break;
        }
      }

      if (statusCode === 403) {
        
        return { status: 'pending', context };
      }

      if (statusCode === 404) {
        
        return { status: 'expired', context };
      }

      if (statusCode === 410) {
        
        return { status: 'denied', context };
      }

      if (statusCode === 429) {
        
        return {
          status: 'error',
          message: 'Sign-in timed out. Please close this window and try again.',
          context,
        };
      }

      
      if (!statusCode) {
        return {
          status: 'error',
          message: 'Connection lost. Please check your internet and try again.',
          context,
        };
      }

      
      console.error('Device flow token poll failed:', error);
      return {
        status: 'error',
        message:
          'Something went wrong. Please close this window and try signing in again.',
        context,
      };
    }
  }

  
  async storeActivationResult(
    tokenResponse: DeviceTokenResponse
  ): Promise<{ persisted: boolean }> {
    
    if (!tokenResponse.token) {
      throw new Error('Missing token in response');
    }

    if (!tokenResponse.user) {
      throw new Error('Missing user data in response');
    }

    const authToken = tokenResponse.token;

    
    this.settings.userId = tokenResponse.user.id;

    
    const tier = tokenResponse.user.tier?.toLowerCase() || 'free';

    BackendSecretStorage.setAuthToken(this.plugin, authToken);
    this.settings.userEmail = tokenResponse.user.email || '';
    this.settings.subscriptionTier =
      tier === 'premium' || tier === 'pro' ? 'premium' : 'free';

    let persisted = true;

    
    
    try {
      await this.plugin.saveSettings();
    } catch (error) {
      persisted = false;
      console.error('Failed to persist activation settings:', error);
    }

    return { persisted };
  }

  private buildErrorContext(
    error: unknown,
    operation: string,
    endpoint: string
  ): DeviceFlowErrorContext {
    if (error instanceof DeviceFlowError && error.context) {
      return {
        operation: error.context.operation || operation,
        endpoint: error.context.endpoint || endpoint,
        statusCode: error.context.statusCode,
        errorCode: error.context.errorCode,
        retryAfterSeconds: error.context.retryAfterSeconds,
      };
    }

    let statusCode: number | undefined;
    let errorCode: string | undefined;
    let retryAfterSeconds: number | undefined;

    if (error instanceof ApiError) {
      statusCode = error.statusCode;
      errorCode = this.getDeviceFlowErrorCode(error.context?.responseBody);
      retryAfterSeconds = this.getRetryAfterSeconds(
        error.context?.responseHeaders
      );
    } else if (typeof error === 'object' && error !== null) {
      const errObj = error as Record<string, unknown>;
      statusCode =
        typeof errObj.statusCode === 'number'
          ? errObj.statusCode
          : typeof errObj.status === 'number'
            ? errObj.status
            : undefined;
    }

    return {
      operation,
      endpoint,
      statusCode,
      errorCode,
      retryAfterSeconds,
    };
  }

  private getDeviceFlowErrorCode(errorBody: unknown): string | undefined {
    if (!errorBody || typeof errorBody !== 'object') {
      return undefined;
    }

    const errorValue = (errorBody as Record<string, unknown>).error;
    return typeof errorValue === 'string' ? errorValue : undefined;
  }

  private getRetryAfterSeconds(
    headers?: Record<string, string>
  ): number | undefined {
    if (!headers) {
      return undefined;
    }

    const headerKey = Object.keys(headers).find(
      (key) => key.toLowerCase() === 'retry-after'
    );

    if (!headerKey) {
      return undefined;
    }

    const retryAfterValue = Number(headers[headerKey]);
    return Number.isFinite(retryAfterValue) ? retryAfterValue : undefined;
  }
}
