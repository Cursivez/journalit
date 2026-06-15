

import JournalitPlugin from '../../main';
import { ApiClient } from './ApiClient';
import {
  BackendIntegrationSettings,
  DEFAULT_SETTINGS,
} from '../../settings/types';
import { FTPCredentials } from './types';
import { ErrorHandler, ErrorContext } from '../../utils/errorHandler';
import { BackendSecretStorage } from './BackendSecretStorage';

interface FTPUserResponse {
  user_id?: number;
  username: string;
  password?: string;
  server?: string;
  port?: number;
  last_password_reset?: string;
}

export class FTPManagementService {
  private plugin: JournalitPlugin;

  
  private get settings(): BackendIntegrationSettings {
    if (!this.plugin.settings.backendIntegration) {
      console.error(
        'FTPManagementService: backendIntegration is undefined, using defaults'
      );
      this.plugin.settings.backendIntegration = {
        ...DEFAULT_SETTINGS.backendIntegration!,
      };
    }
    return this.plugin.settings.backendIntegration;
  }

  constructor(plugin: JournalitPlugin, _settings: BackendIntegrationSettings) {
    this.plugin = plugin;
    
    
  }

  
  async getFTPCredentials(username: string): Promise<FTPCredentials | null> {
    try {
      
      const authToken = BackendSecretStorage.getAuthToken(this.plugin);
      const headers: Record<string, string> = {};
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const url = ApiClient.buildUrl(`/api/v1/ftp-users/${username}`);
      const response = await ApiClient.makeRequest<FTPUserResponse>(
        url,
        { method: 'GET', headers },
        'get FTP credentials'
      );

      if (!response) {
        return null;
      }

      
      const credentials = {
        user_id: response.user_id,
        username: response.username,
        server: response.server || 'sync.journalit.co',
        port: response.port || 2121,
        lastPasswordReset: response.last_password_reset,
      };

      return credentials;
    } catch (error) {
      
      if (this.settings.ftpUsername) {
        
        console.warn(
          'FTP credentials not found for specific username:',
          username
        );
        return null;
      }

      
      if (error instanceof Error && error.message.includes('404')) {
        
        return await this.createFTPUser(username);
      }

      
      const errorContext: ErrorContext = {
        operation: 'get FTP credentials',
        endpoint: `/api/v1/ftp-users/${username}`,
        statusCode: ErrorHandler.extractStatusCode(error),
      };

      ErrorHandler.logError(error, errorContext);
      throw error;
    }
  }

  
  async createOrGetFTPUser(): Promise<FTPCredentials | null> {
    try {
      
      const authToken = BackendSecretStorage.getAuthToken(this.plugin);
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const url = ApiClient.buildUrl('/api/v1/ftp-users/auto-create');
      const response = await ApiClient.makeRequest<FTPUserResponse>(
        url,
        {
          method: 'POST',
          headers,
          body: JSON.stringify({
            username: `journalit${Date.now()}${Math.floor(Math.random() * 1000)}`,
          }),
        },
        'create or get FTP user'
      );

      if (!response) {
        return null;
      }

      
      const credentials: FTPCredentials = {
        user_id: response.user_id,
        username: response.username,
        password: response.password,
        server: response.server || 'sync.journalit.co',
        port: response.port || 2121,
        lastPasswordReset:
          response.last_password_reset || new Date().toISOString(),
      };

      
      if (response.user_id && this.settings) {
        this.settings.ftpUserId = response.user_id;
        await this.plugin.saveSettings();
      }

      return credentials;
    } catch (error) {
      const errorContext: ErrorContext = {
        operation: 'create or get FTP user',
        endpoint: '/api/v1/ftp-users/auto-create',
        statusCode: ErrorHandler.extractStatusCode(error),
      };

      ErrorHandler.logError(error, errorContext);
      throw error;
    }
  }

  
  async autoCreateFTPCredentials(
    username: string
  ): Promise<FTPCredentials | null> {
    try {
      
      const authToken = BackendSecretStorage.getAuthToken(this.plugin);
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const url = ApiClient.buildUrl('/api/v1/ftp-users/auto-create');
      const response = await ApiClient.makeRequest<FTPUserResponse>(
        url,
        {
          method: 'POST',
          headers,
          body: JSON.stringify({ username: username }),
        },
        'auto-create FTP user'
      );

      if (!response) {
        return null;
      }

      
      return {
        username: response.username,
        password: response.password,
        server: response.server || 'sync.journalit.co',
        port: response.port || 2121,
        lastPasswordReset: new Date().toISOString(),
      };
    } catch (error) {
      const errorContext: ErrorContext = {
        operation: 'auto-create FTP user',
        endpoint: '/api/v1/ftp-users/auto-create',
        statusCode: ErrorHandler.extractStatusCode(error),
      };

      ErrorHandler.logError(error, errorContext);
      throw error;
    }
  }

  
  private async createFTPUser(_userId: string): Promise<FTPCredentials | null> {
    try {
      
      const accountId = await this.getFTPUserAccountId();
      if (!accountId) {
        const errorContext: ErrorContext = {
          operation: 'determine account ID for FTP user creation',
          endpoint: '/api/v1/mt-accounts',
        };

        ErrorHandler.logError(
          new Error('Could not determine account ID for FTP user creation'),
          errorContext
        );
        throw new Error('Could not determine account ID for FTP user creation');
      }

      
      const authToken = BackendSecretStorage.getAuthToken(this.plugin);
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const url = ApiClient.buildUrl('/api/v1/ftp-users/create');
      const response = await ApiClient.makeRequest<FTPUserResponse>(
        url,
        {
          method: 'POST',
          headers,
          body: JSON.stringify({ user_id: accountId }),
        },
        'create FTP user'
      );

      if (!response) {
        return null;
      }

      
      return {
        username: response.username,
        password: response.password,
        server: response.server || 'sync.journalit.co',
        port: response.port || 2121,
        lastPasswordReset: new Date().toISOString(),
      };
    } catch (error) {
      const errorContext: ErrorContext = {
        operation: 'create FTP user',
        endpoint: '/api/v1/ftp-users',
        statusCode: ErrorHandler.extractStatusCode(error),
      };

      ErrorHandler.logError(error, errorContext);
      throw error;
    }
  }

  
  async resetFTPPassword(userId: string): Promise<FTPCredentials | null> {
    try {
      
      const username = this.settings.ftpUsername || userId;

      
      let ftpUserId = this.settings.ftpUserId;
      if (!ftpUserId && username) {
        const existingUser = await this.getFTPCredentials(username);
        if (existingUser && existingUser.user_id) {
          ftpUserId = existingUser.user_id;
          
          this.settings.ftpUserId = ftpUserId;
          await this.plugin.saveSettings();
        }
      }

      if (!ftpUserId) {
        const errorContext: ErrorContext = {
          operation: 'determine FTP user ID',
          endpoint: `/api/v1/ftp-users/${username}`,
        };

        ErrorHandler.logError(
          new Error(
            'Could not find FTP user. Please try creating new credentials.'
          ),
          errorContext
        );
        throw new Error(
          'Could not find FTP user. Please try creating new credentials.'
        );
      }

      
      const authToken = BackendSecretStorage.getAuthToken(this.plugin);
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const url = ApiClient.buildUrl(`/api/v1/ftp-users/${ftpUserId}/password`);
      const response = await ApiClient.makeRequest<FTPUserResponse>(
        url,
        {
          method: 'PUT',
          headers,
        },
        'reset FTP password'
      );

      if (!response) {
        return null;
      }

      
      return {
        user_id: ftpUserId,
        username: username,
        password: response.password,
        server: 'sync.journalit.co',
        port: 2121,
        lastPasswordReset: new Date().toISOString(),
      };
    } catch (error) {
      const userIdForError = this.settings.ftpUserId || userId;
      const errorContext: ErrorContext = {
        operation: 'reset FTP password',
        endpoint: `/api/v1/ftp-users/${userIdForError}/reset-password`,
        statusCode: ErrorHandler.extractStatusCode(error),
      };

      ErrorHandler.logError(error, errorContext);
      throw error;
    }
  }

  
  private async getFTPUserAccountId(): Promise<number | null> {
    
    if (this.settings.ftpUserId) {
      return this.settings.ftpUserId;
    }

    
    const ftpUsername = this.settings.ftpUsername;
    if (ftpUsername) {
      const credentials = await this.getFTPCredentials(ftpUsername);
      if (credentials && credentials.user_id) {
        
        this.settings.ftpUserId = credentials.user_id;
        await this.plugin.saveSettings();
        return credentials.user_id;
      }
    }

    const errorContext: ErrorContext = {
      operation: 'determine FTP user account ID',
      endpoint: '/api/v1/mt-accounts',
    };

    ErrorHandler.logError(
      new Error(
        `Could not determine FTP user account ID. FTP username: ${ftpUsername}`
      ),
      errorContext
    );
    return null;
  }
}
