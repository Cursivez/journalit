

import type { App } from 'obsidian';

type TradeSyncProviderPreference =
  | 'metatrader'
  | 'tradovate'
  | 'rithmic'
  | 'ctrader';

const STORAGE_KEY = 'journalit:trade-sync-provider';

export function readTradeSyncProviderPreference(
  app: App
): TradeSyncProviderPreference {
  const stored: unknown = app.loadLocalStorage(STORAGE_KEY);
  if (stored === 'tradovate') return 'tradovate';
  if (stored === 'rithmic') return 'rithmic';
  if (stored === 'ctrader') return 'ctrader';
  return 'metatrader';
}

export function writeTradeSyncProviderPreference(
  app: App,
  provider: TradeSyncProviderPreference
): void {
  app.saveLocalStorage(STORAGE_KEY, provider);
}
