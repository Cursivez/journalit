

import React, { useState, useCallback } from 'react';
import { Notice } from 'obsidian';
import {
  AlertTriangle,
  Copy,
  Check,
  Ban,
  Lock,
  Eye,
  EyeOff,
} from '../../../components/shared/icons/ObsidianIcon';
import { useService, usePlugin } from '../../../hooks';
import type { FTPCredentials } from '../../types';
import { ErrorHandler, ErrorContext } from '../../../utils/errorHandler';
import { t } from '../../../lang/helpers';
import { SupportErrorDetails } from '../../../utils/supportReport';
import { BackendSecretStorage } from '../../../services/backend/BackendSecretStorage';
import { writeClipboardText } from '../../../utils/clipboard';

interface FTPCredentialsSectionProps {
  userId: string;
  onErrorChange?: (details: SupportErrorDetails | null) => void;
}

const asRecord = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? Object.fromEntries(Object.entries(value))
    : null;

function isFtpCredentials(value: unknown): value is FTPCredentials {
  const candidate = asRecord(value);
  if (!candidate) return false;
  return (
    typeof candidate.server === 'string' &&
    typeof candidate.port === 'number' &&
    typeof candidate.username === 'string' &&
    typeof candidate.password === 'string'
  );
}

function getCredentialsFromEvent(event: Event): FTPCredentials | null {
  if (!(event instanceof CustomEvent)) return null;
  const detail = asRecord(event.detail);
  const credentials = detail?.credentials;
  return isFtpCredentials(credentials) ? credentials : null;
}

function useFTPCredentialsSectionModel({
  userId,
  onErrorChange,
}: FTPCredentialsSectionProps) {
  const plugin = usePlugin();
  const { service: backendService } = useService('backendIntegrationService');
  const [credentials, setCredentials] = useState<FTPCredentials | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [isPasswordMasked, setIsPasswordMasked] = useState(false);

  const loadCredentials = useCallback(async () => {
    if (!userId || !backendService) return;

    setLoading(true);
    onErrorChange?.(null);
    try {
      const creds = await backendService.getFTPCredentials(userId);
      if (creds) {
        
        const savedPassword = plugin
          ? BackendSecretStorage.getFTPPassword(plugin)
          : null;
        if (savedPassword && !creds.password) {
          
          setIsPasswordMasked(true);
          creds.password = ''; 
        } else {
          setIsPasswordMasked(false);
        }
        setCredentials(creds);
      } else {
        setCredentials(null);
        setIsPasswordMasked(false);
      }
    } catch (err) {
      
      if (!(err instanceof Error) || !err.message?.includes('404')) {
        const errorContext: ErrorContext = {
          operation: 'load FTP credentials',
          endpoint: `/api/v1/ftp-users/${userId}`,
          statusCode: ErrorHandler.extractStatusCode(err),
        };

        const userFriendlyMessage = ErrorHandler.getErrorMessage(
          err,
          errorContext
        );
        onErrorChange?.({
          message: userFriendlyMessage,
          operation: errorContext.operation,
          endpoint: errorContext.endpoint,
          statusCode: errorContext.statusCode,
          timestamp: new Date().toISOString(),
        });
        ErrorHandler.logError(err, errorContext);
      }
      setCredentials(null);
    } finally {
      setLoading(false);
    }
  }, [userId, backendService, plugin, onErrorChange]);

  
  React.useEffect(() => {
    void loadCredentials();
  }, [userId, loadCredentials]);

  
  React.useEffect(() => {
    const handleCredentialsCreated = (event: Event) => {
      const eventCredentials = getCredentialsFromEvent(event);
      if (eventCredentials) {
        
        setCredentials(eventCredentials);
        setIsPasswordMasked(false); 
        onErrorChange?.(null);
      } else {
        void loadCredentials();
      }
    };

    window.addEventListener(
      'ftp-credentials-created',
      handleCredentialsCreated
    );
    return () => {
      window.removeEventListener(
        'ftp-credentials-created',
        handleCredentialsCreated
      );
    };
  }, [loadCredentials, onErrorChange]);

  const copyToClipboard = useCallback(async (text: string, field: string) => {
    try {
      await writeClipboardText(text);
      setCopySuccess(field);
      window.setTimeout(() => setCopySuccess(null), 2000);
    } catch (err) {
      const errorContext: ErrorContext = {
        operation: 'copy to clipboard',
        endpoint: undefined,
      };

      ErrorHandler.showError(
        new Error('Failed to copy to clipboard'),
        errorContext
      );
      ErrorHandler.logError(err, errorContext);
    }
  }, []);

  const handleResetPassword = useCallback(async () => {
    if (!backendService || !userId) return;

    setIsResettingPassword(true);
    onErrorChange?.(null);
    try {
      const newCredentials = await backendService.resetFTPPassword(userId);
      if (newCredentials) {
        setCredentials(newCredentials);
        setIsPasswordMasked(false); 
        setShowPassword(true); 
        new Notice(t('notice.ftp-reset'));

        
        if (plugin) {
          if (newCredentials.password) {
            BackendSecretStorage.setFTPPassword(
              plugin,
              newCredentials.password
            );
          } else {
            BackendSecretStorage.clearFTPPassword(plugin);
          }
          await plugin.saveSettings();
        }
      } else {
        onErrorChange?.({
          message: t('settings.ftp.error.reset-failed'),
          operation: 'reset FTP password',
          endpoint: `/api/v1/ftp-users/${userId}/reset-password`,
          statusCode: undefined,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (err) {
      const errorContext: ErrorContext = {
        operation: 'reset FTP password',
        endpoint: `/api/v1/ftp-users/${userId}/reset-password`,
        statusCode: ErrorHandler.extractStatusCode(err),
      };

      const userFriendlyMessage = ErrorHandler.getErrorMessage(
        err,
        errorContext
      );
      onErrorChange?.({
        message: userFriendlyMessage,
        operation: errorContext.operation,
        endpoint: errorContext.endpoint,
        statusCode: errorContext.statusCode,
        timestamp: new Date().toISOString(),
      });

      
      ErrorHandler.handleError(err, errorContext);
    } finally {
      setIsResettingPassword(false);
    }
  }, [backendService, userId, plugin, onErrorChange]);

  return {
    credentials,
    loading,
    showPassword,
    setShowPassword,
    copySuccess,
    isResettingPassword,
    isPasswordMasked,
    copyToClipboard,
    handleResetPassword,
  };
}

export const FTPCredentialsSection: React.FC<FTPCredentialsSectionProps> = (
  props
) => {
  const {
    credentials,
    loading,
    showPassword,
    setShowPassword,
    copySuccess,
    isResettingPassword,
    isPasswordMasked,
    copyToClipboard,
    handleResetPassword,
  } = useFTPCredentialsSectionModel(props);

  if (loading && !credentials) {
    return (
      <div className="ftp-credentials-section">
        <h3>{t('settings.ftp.title')}</h3>
        <div className="loading-container">{t('settings.ftp.loading')}</div>
      </div>
    );
  }

  return (
    <div className="ftp-credentials-section">
      <h3>{t('settings.ftp.title-metatrader')}</h3>

      {credentials ? (
        <>
          <div className="ftp-info-message">
            <p>{t('settings.ftp.info-message')}</p>
          </div>

          <div className="ftp-credentials-grid">
            <div className="ftp-credential-field">
              <label>{t('settings.ftp.label.server')}</label>
              <div className="input-with-action">
                <input
                  type="text"
                  value={`${credentials.server}:${credentials.port}`}
                  readOnly
                  className="ftp-readonly-input"
                />
                <button
                  className="clickable-icon"
                  onClick={() =>
                    void copyToClipboard(
                      `${credentials.server}:${credentials.port}`,
                      'server'
                    )
                  }
                  aria-label={t('settings.ftp.aria.copy-server')}
                >
                  {copySuccess === 'server' ? (
                    <Check size={16} />
                  ) : (
                    <Copy size={16} />
                  )}
                </button>
              </div>
            </div>

            <div className="ftp-credential-field">
              <label>{t('settings.ftp.label.login')}</label>
              <div className="input-with-action">
                <input
                  type="text"
                  value={credentials.username}
                  readOnly
                  className="ftp-readonly-input"
                />
                <button
                  className="clickable-icon"
                  onClick={() =>
                    void copyToClipboard(credentials.username, 'username')
                  }
                  aria-label={t('settings.ftp.aria.copy-login')}
                >
                  {copySuccess === 'username' ? (
                    <Check size={16} />
                  ) : (
                    <Copy size={16} />
                  )}
                </button>
              </div>
            </div>

            {(credentials.password || isPasswordMasked) && (
              <div className="ftp-credential-field">
                <label>{t('settings.ftp.label.password')}</label>
                <div className="input-with-action">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={
                      isPasswordMasked ? '*'.repeat(12) : credentials.password
                    }
                    readOnly
                    className="ftp-readonly-input"
                  />
                  <button
                    className="clickable-icon"
                    onClick={() =>
                      void copyToClipboard(credentials.password!, 'password')
                    }
                    disabled={isPasswordMasked || !credentials.password}
                    aria-label={
                      isPasswordMasked
                        ? t('settings.ftp.aria.password-unavailable')
                        : t('settings.ftp.aria.copy-password')
                    }
                  >
                    {isPasswordMasked ? (
                      <Ban size={16} />
                    ) : copySuccess === 'password' ? (
                      <Check size={16} />
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                  <button
                    className="clickable-icon"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isPasswordMasked}
                    aria-label={
                      isPasswordMasked
                        ? t('settings.ftp.aria.password-hidden')
                        : showPassword
                          ? t('settings.ftp.aria.hide-password')
                          : t('settings.ftp.aria.show-password')
                    }
                  >
                    {isPasswordMasked ? (
                      <Lock size={16} />
                    ) : showPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
                <div className="ftp-password-notice">
                  <AlertTriangle size={14} />
                  <span>
                    {isPasswordMasked
                      ? t('settings.ftp.notice.password-masked')
                      : t('settings.ftp.notice.password-save')}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="ftp-reset-password">
            <button
              className="mod-cta ftp-reset-password-button"
              onClick={() => void handleResetPassword()}
              disabled={isResettingPassword}
            >
              {isResettingPassword
                ? t('settings.ftp.button.resetting')
                : t('settings.ftp.button.reset')}
            </button>
            <div className="ftp-reset-hint">{t('settings.ftp.reset-hint')}</div>
          </div>

          <div className="ftp-setup-instructions">
            <h4>{t('settings.ftp.instructions.title')}</h4>
            <ol>
              <li>{t('settings.ftp.instructions.step1')}</li>
              <li>{t('settings.ftp.instructions.step2')}</li>
              <li>{t('settings.ftp.instructions.step3')}</li>
              <li>{t('settings.ftp.instructions.step4')}</li>
              <li>{t('settings.ftp.instructions.step5')}</li>
              <li>{t('settings.ftp.instructions.step6')}</li>
            </ol>
          </div>
        </>
      ) : (
        <div className="ftp-no-credentials">
          <p>{t('settings.ftp.no-credentials')}</p>
        </div>
      )}
    </div>
  );
};
