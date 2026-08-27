

import { Notice } from 'obsidian';
import JournalitPlugin from '../../main';
import { ApiClient } from './ApiClient';
import { t } from '../../lang/helpers';
import {
  BackendIntegrationSettings,
  DEFAULT_SETTINGS,
} from '../../settings/types';
import { FTPCredentials, FTPProvisionedCredentials } from './types';
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
        return null;
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

  
  async createOrGetFTPUser(): Promise<FTPProvisionedCredentials | null> {
    try {
      
      const url = ApiClient.buildUrl('/api/v1/ftp-users/auto-create');
      const response = await ApiClient.makeRequest<FTPUserResponse>(
        url,
        { method: 'POST' },
        'create or get FTP user'
      );

      if (!response) {
        return null;
      }

      
      if (response.user_id) {
        this.settings.ftpUserId = response.user_id;
        await this.plugin.saveSettings();
      }

      const toCredentials = (
        source: FTPProvisionedCredentials['source'],
        password: string | undefined,
        lastPasswordReset: string | undefined
      ): FTPProvisionedCredentials => ({
        source,
        user_id: response.user_id,
        username: response.username,
        password,
        server: response.server || 'sync.journalit.co',
        port: response.port || 2121,
        lastPasswordReset,
      });

      if (response.password) {
        
        
        return toCredentials(
          'created',
          response.password,
          response.last_password_reset || new Date().toISOString()
        );
      }

      
      
      const storedPassword = BackendSecretStorage.getFTPPassword(this.plugin);
      if (storedPassword && this.settings.ftpUsername === response.username) {
        return toCredentials(
          'reused',
          storedPassword,
          response.last_password_reset
        );
      }

      
      
      
      const rotated = await this.resetFTPPassword(response.username);
      if (!rotated) {
        return null;
      }
      new Notice(t('notice.ftp-password-rotated'), 10000);
      return toCredentials(
        'rotated',
        rotated.password,
        rotated.lastPasswordReset
      );
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
}
