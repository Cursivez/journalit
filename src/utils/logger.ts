

import { secureLog } from './secureLogging';
import { getPluginInstance } from './pluginContext';

function isDebugLoggingEnabled(): boolean {
  const plugin = getPluginInstance();
  return plugin?.settings?.general?.debugLogging === true;
}

function normalizeConsoleArgs(args: unknown[]): {
  message: string;
  rest: unknown[];
} {
  if (args.length === 0) return { message: '', rest: [] };

  const [first, ...rest] = args;

  if (typeof first === 'string') {
    return { message: first, rest };
  }

  
  
  return { message: '', rest: [first, ...rest] };
}

export const logger = {
  
  debug(...args: unknown[]): void {
    if (!isDebugLoggingEnabled()) return;
    const { message, rest } = normalizeConsoleArgs(args);
    secureLog.debug(message || '[Journalit]', ...rest);
  },

  
  info(...args: unknown[]): void {
    if (!isDebugLoggingEnabled()) return;
    const { message, rest } = normalizeConsoleArgs(args);
    secureLog.debug(message || '[Journalit]', ...rest);
  },

  
  warn(message: string, ...args: unknown[]): void {
    secureLog.warn(message, ...args);
  },

  
  error(message: string, ...args: unknown[]): void {
    secureLog.error(message, ...args);
  },
};
