

import { Notice } from 'obsidian';
import { t } from '../lang/helpers';

export interface ErrorContext {
  operation: string;
  endpoint?: string;
  statusCode?: number;
  responseBody?: unknown;
  responseHeaders?: Record<string, string>;
  originalError?: Error;
}

export class ErrorHandler {
  private static readonly AUTH_ERROR_WINDOW_MS = 10 * 60 * 1000;
  private static authErrorTimestamps: number[] = [];

  
  static getErrorMessage(error: unknown, context: ErrorContext): string {
    const statusCode =
      context.statusCode || ErrorHandler.extractStatusCode(error);
    const endpoint = context.endpoint || '';

    
    if (statusCode === 401) {
      return t('error.session-expired');
    }

    
    if (statusCode === 404) {
      if (endpoint.includes('/ftp-users/')) {
        return t('error.ftp-not-found');
      }
      if (endpoint.includes('/trades') || endpoint.includes('/mt-accounts')) {
        return t('error.no-trading-data');
      }
      return t('error.unable-connect-service');
    }

    
    if (statusCode === 400) {
      if (
        context.operation.includes('verification') ||
        context.operation.includes('auth')
      ) {
        return t('error.invalid-verification-code');
      }
      if (
        context.operation.includes('registration') ||
        context.operation.includes('vault')
      ) {
        return t('error.invalid-registration-data');
      }
      return t('error.invalid-request');
    }

    
    if (statusCode === 403) {
      return t('error.access-denied');
    }

    
    if (statusCode === 429) {
      return t('error.too-many-requests');
    }

    
    if (statusCode && statusCode >= 500) {
      if (statusCode === 503) {
        return t('error.service-unavailable');
      }
      return t('error.server-error');
    }

    
    if (ErrorHandler.isNetworkError(error)) {
      return t('error.network-error');
    }

    
    if (
      context.operation.includes('clipboard') ||
      context.operation.includes('paste')
    ) {
      return ErrorHandler.getClipboardErrorMessage(error, context);
    }

    
    if (
      context.operation.includes('custom fields') ||
      context.operation.includes('field')
    ) {
      return ErrorHandler.getSettingsErrorMessage(error, context);
    }

    if (
      context.operation.includes('options') ||
      context.operation.includes('dropdown')
    ) {
      return ErrorHandler.getOptionsErrorMessage(error, context);
    }

    
    const originalMessage =
      typeof error === 'object' && error !== null && 'message' in error
        ? String(error.message)
        : t('error.unknown');
    if (originalMessage.includes('API Error:')) {
      
      return originalMessage.replace(/^API Error: \d+ /, '');
    }

    return t('error.unexpected');
  }

  
  static showError(error: unknown, context: ErrorContext): void {
    const message = ErrorHandler.getErrorMessage(error, context);
    const statusCode =
      context.statusCode || ErrorHandler.extractStatusCode(error);

    
    let duration = 5000; 
    let icon = '⚠️'; 

    if (statusCode === 401) {
      duration = 8000; 
      icon = '🔐';
    } else if (statusCode && statusCode >= 500) {
      duration = 8000; 
      icon = '❌';
    } else if (ErrorHandler.isNetworkError(error)) {
      duration = 6000;
      icon = '📡';
    }

    new Notice(`${icon} ${message}`, duration);
  }

  
  static logError(error: unknown, context: ErrorContext): void {
    const statusCode =
      context.statusCode || ErrorHandler.extractStatusCode(error);
    const logLevel =
      (statusCode && statusCode >= 500) || ErrorHandler.isNetworkError(error)
        ? 'error'
        : 'warn';

    const logMessage = `${context.operation} failed`;
    const errorMessage =
      typeof error === 'object' && error !== null && 'message' in error
        ? error.message
        : error;
    const errorStack =
      typeof error === 'object' && error !== null && 'stack' in error
        ? error.stack
        : undefined;
    const logData = {
      statusCode,
      endpoint: context.endpoint,
      error: errorMessage,
      stack: errorStack,
    };

    if (logLevel === 'error') {
      console.error(logMessage, logData);
    } else {
      console.warn(logMessage, logData);
    }
  }

  
  static handleError(error: unknown, context: ErrorContext): void {
    
    if (ErrorHandler.shouldSuppressNotification(error, context)) {
      ErrorHandler.logError(error, context);
      return;
    }

    const statusCode =
      context.statusCode || ErrorHandler.extractStatusCode(error);

    if (statusCode === 401) {
      const message = ErrorHandler.getErrorMessage(error, context);
      const now = Date.now();
      ErrorHandler.authErrorTimestamps = [
        ...ErrorHandler.authErrorTimestamps.filter(
          (timestamp) => now - timestamp <= ErrorHandler.AUTH_ERROR_WINDOW_MS
        ),
        now,
      ];

      window.activeDocument.dispatchEvent(
        new CustomEvent('journalit:auth-error', {
          detail: {
            message,
            operation: context.operation,
            endpoint: context.endpoint,
            statusCode,
            timestamp: new Date().toISOString(),
            occurrences: ErrorHandler.authErrorTimestamps.length,
            windowMinutes: Math.round(
              ErrorHandler.AUTH_ERROR_WINDOW_MS / 60000
            ),
          },
        })
      );
    }

    ErrorHandler.showError(error, context);
    ErrorHandler.logError(error, context);
  }

  
  private static isNetworkError(error: unknown): boolean {
    if (!error) return false;

    const errorName =
      typeof error === 'object' && 'name' in error
        ? String(error.name).toLowerCase()
        : '';
    const errorMessage =
      typeof error === 'object' && 'message' in error
        ? String(error.message).toLowerCase()
        : '';

    return (
      errorName === 'typeerror' ||
      errorMessage.includes('fetch') ||
      errorMessage.includes('network') ||
      errorMessage.includes('connection') ||
      errorMessage.includes('timeout')
    );
  }

  
  static extractStatusCode(error: unknown): number | undefined {
    const isStatusError = (value: unknown): value is { status: number } =>
      typeof value === 'object' &&
      value !== null &&
      'status' in value &&
      typeof (value as Record<string, unknown>).status === 'number';

    if (isStatusError(error)) {
      return error.status;
    }

    const message =
      typeof error === 'object' && error !== null && 'message' in error
        ? String(error.message)
        : '';
    const match = message.match(/API Error: (\d+)/);
    return match ? parseInt(match[1], 10) : undefined;
  }

  
  private static shouldSuppressNotification(
    error: unknown,
    context: ErrorContext
  ): boolean {
    const statusCode = ErrorHandler.extractStatusCode(error);
    const operation = context.operation.toLowerCase();

    
    if (
      (statusCode === 401 || statusCode === 400) &&
      (operation.includes('vault registration') ||
        operation.includes('sync status'))
    ) {
      return true;
    }

    
    if (
      (statusCode === 400 || statusCode === 429) &&
      operation.includes('verify authentication code')
    ) {
      return true;
    }

    return false;
  }

  
  static getSettingsErrorMessage(
    error: unknown,
    context: ErrorContext
  ): string {
    const errorMessage =
      typeof error === 'object' && error !== null && 'message' in error
        ? String(error.message).toLowerCase()
        : '';
    const operation = context.operation.toLowerCase();

    
    if (errorMessage.includes('pattern') || errorMessage.includes('regex')) {
      return t('error.settings.invalid-pattern');
    }

    if (
      errorMessage.includes('field key') &&
      errorMessage.includes('already in use')
    ) {
      return t('error.settings.field-name-conflict');
    }

    if (
      errorMessage.includes('field key') ||
      errorMessage.includes('invalid')
    ) {
      return t('error.settings.invalid-field-name');
    }

    
    if (operation.includes('save') || operation.includes('update')) {
      return t('error.settings.save-failed');
    }

    if (operation.includes('load')) {
      return t('error.settings.load-failed');
    }

    if (operation.includes('import')) {
      return t('error.settings.import-failed');
    }

    if (operation.includes('add') || operation.includes('create')) {
      return t('error.settings.create-failed');
    }

    if (operation.includes('remove') || operation.includes('delete')) {
      return t('error.settings.remove-failed');
    }

    return t('error.settings.generic');
  }

  
  static getOptionsErrorMessage(error: unknown, context: ErrorContext): string {
    const errorMessage =
      typeof error === 'object' && error !== null && 'message' in error
        ? String(error.message).toLowerCase()
        : '';
    const operation = context.operation.toLowerCase();

    
    if (
      errorMessage.includes('duplicate') ||
      errorMessage.includes('already exists')
    ) {
      return t('error.options.duplicate');
    }

    if (
      errorMessage.includes('ticker format') ||
      errorMessage.includes('invalid ticker')
    ) {
      return t('error.options.invalid-ticker');
    }

    
    if (operation.includes('add')) {
      if (operation.includes('instrument') || operation.includes('ticker')) {
        return t('error.options.add-ticker-failed');
      }
      return t('error.options.add-failed');
    }

    if (operation.includes('update') || operation.includes('edit')) {
      return t('error.options.update-failed');
    }

    if (operation.includes('remove') || operation.includes('delete')) {
      return t('error.options.remove-failed');
    }

    if (operation.includes('reset') && errorMessage.includes('no options')) {
      return t('error.options.no-options-reset');
    }

    if (operation.includes('reset')) {
      return t('error.options.reset-failed');
    }

    
    if (operation.includes('save') || operation.includes('load')) {
      return t('error.options.save-failed');
    }

    return t('error.options.generic');
  }

  
  static getClipboardErrorMessage(
    error: unknown,
    context: ErrorContext
  ): string {
    const errorMessage =
      typeof error === 'object' && error !== null && 'message' in error
        ? String(error.message).toLowerCase()
        : '';
    const operation = context.operation.toLowerCase();
    const errorName =
      typeof error === 'object' && error !== null && 'name' in error
        ? String(error.name)
        : '';

    
    if (
      errorName === 'NotAllowedError' ||
      errorMessage.includes('permission') ||
      operation.includes('permission')
    ) {
      return t('error.clipboard.permission-denied');
    }

    
    if (
      operation.includes('clipboard access') &&
      (errorMessage.includes('not supported') ||
        errorMessage.includes('undefined'))
    ) {
      return t('error.clipboard.not-supported');
    }

    
    if (
      operation.includes('size validation') ||
      errorMessage.includes('exceeds limit')
    ) {
      return t('error.clipboard.image-too-large');
    }

    
    if (operation.includes('content check')) {
      return t('error.clipboard.no-content');
    }

    
    if (operation.includes('image extraction')) {
      return t('error.clipboard.no-images');
    }

    
    if (operation.includes('target detection')) {
      return t('error.clipboard.no-target');
    }

    
    if (
      operation.includes('paste operation') ||
      operation.includes('global paste')
    ) {
      if (
        errorMessage.includes('failed to fetch') ||
        errorMessage.includes('network')
      ) {
        return t('error.clipboard.network-error');
      }
      return t('error.clipboard.paste-failed');
    }

    
    return t('error.clipboard.generic');
  }

  
  static createContext(
    operation: string,
    endpoint?: string,
    statusCode?: number
  ): ErrorContext {
    return {
      operation,
      endpoint,
      statusCode,
    };
  }
}
