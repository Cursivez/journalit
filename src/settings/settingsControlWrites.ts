
import type JournalitPlugin from '../main';
import { eventBus } from '../services/events/EventBus';
import {
  DEFAULT_SETTINGS,
  resolveTradeFormLayoutSettings,
  type JournalitSettings,
} from './types';

const TRADE_FORM_LAYOUT_PREFIX = 'trade.tradeFormLayout.';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function getDefaultSettingsPath(path: string): unknown {
  let cursor: unknown = DEFAULT_SETTINGS;
  for (const part of path.split('.')) {
    if (!isRecord(cursor)) return undefined;
    cursor = cursor[part];
  }
  return cursor;
}


export function readSettingsPath(
  settings: JournalitSettings,
  path: string
): unknown {
  let cursor: unknown = settings;
  for (const part of path.split('.')) {
    if (
      !isRecord(cursor) ||
      !Object.prototype.hasOwnProperty.call(cursor, part)
    )
      return undefined;
    cursor = cursor[part];
  }
  return cursor;
}


export function getSettingsPath(
  settings: JournalitSettings,
  path: string
): unknown {
  let cursor: unknown = settings;
  for (const part of path.split('.')) {
    if (!isRecord(cursor)) return getDefaultSettingsPath(path);
    cursor = cursor[part];
  }
  return cursor ?? getDefaultSettingsPath(path);
}

export function setSettingsPath(
  settings: JournalitSettings,
  path: string,
  value: unknown
): void {
  const parts = path.split('.');
  const last = parts.pop();
  if (!last) return;

  let cursor: object = settings;
  let currentPath = '';
  for (const part of parts) {
    currentPath = currentPath ? `${currentPath}.${part}` : part;
    const next: unknown = Reflect.get(cursor, part);
    if (isRecord(next)) {
      cursor = next;
      continue;
    }
    const defaultBranch = getDefaultSettingsPath(currentPath);
    const replacement = isRecord(defaultBranch) ? { ...defaultBranch } : {};
    Reflect.set(cursor, part, replacement);
    cursor = replacement;
  }
  Reflect.set(cursor, last, value);
}


export function deleteSettingsPath(
  settings: JournalitSettings,
  path: string
): void {
  const parts = path.split('.');
  const last = parts.pop();
  if (!last) return;
  let cursor: unknown = settings;
  for (const part of parts) {
    if (!isRecord(cursor)) return;
    cursor = cursor[part];
  }
  if (isRecord(cursor)) Reflect.deleteProperty(cursor, last);
}

function normalizeControlValue(path: string, value: unknown): unknown {
  
  if (path === 'trade.breakEvenRangeMin' && isFiniteNumber(value)) {
    return -Math.abs(value);
  }
  if (path === 'trade.breakEvenRangeMax' && isFiniteNumber(value)) {
    return Math.abs(value);
  }
  if (path === 'trade.breakEvenThresholdPercent' && isFiniteNumber(value)) {
    return Math.max(0, value);
  }
  return value;
}


export function applySettingsControlValue(
  settings: JournalitSettings,
  path: string,
  value: unknown
): void {
  if (path === 'trade.tradingDayCutoffTime') {
    settings.trade.tradingDayCutoffEndOfDayMigrationVersion =
      DEFAULT_SETTINGS.trade.tradingDayCutoffEndOfDayMigrationVersion;
  }
  if (path.startsWith(TRADE_FORM_LAYOUT_PREFIX)) {
    
    settings.trade.tradeFormLayout = {
      ...resolveTradeFormLayoutSettings(settings.trade.tradeFormLayout),
      [path.slice(TRADE_FORM_LAYOUT_PREFIX.length)]: value,
    };
    return;
  }
  setSettingsPath(
    settings,
    path,
    normalizeControlValue(path, structuredClone(value))
  );
}


export async function publishSettingsControlChange(
  plugin: JournalitPlugin,
  key: string,
  published: Set<string> = new Set()
): Promise<void> {
  const publishOnce = (section: string, source: string): void => {
    const identity = `${section}\0${source}`;
    if (published.has(identity)) return;
    published.add(identity);
    eventBus.publish('settings:changed', { section, source });
  };

  if (key === 'general.currency') {
    window.dispatchEvent(
      new CustomEvent('journalit-currency-changed', {
        detail: { currency: plugin.settings.general?.currency },
      })
    );
    publishOnce('general', 'currency');
    return;
  }

  if (key === 'general.accentColorSource') {
    
    eventBus.publish('appearance:accent-source-changed');
    return;
  }

  if (key === 'home.filterRecentItemsToJournalit') {
    const recentItems = plugin.uiStateManager.getState().recentItems;
    eventBus.publish('recent-items:changed', {
      recentItems: recentItems.map((item) => ({
        path: item.path || item.viewType || '',
        timestamp: new Date(item.openedAt).getTime(),
        type: item.type,
      })),
    });
    return;
  }

  if (key === 'home.showBackgroundInDashboard') {
    publishOnce('home', 'background-dashboard-visibility');
    return;
  }

  if (key.startsWith('display.')) {
    publishOnce('display', key.slice('display.'.length));
    return;
  }

  if (key.startsWith(TRADE_FORM_LAYOUT_PREFIX)) {
    
    publishOnce('trade', 'trade-form-layout');
    return;
  }

  if (key.startsWith('trade.')) {
    publishOnce('trade', key.slice('trade.'.length));
    if (
      key.startsWith('trade.breakEven') ||
      key === 'trade.defaultRiskAmount'
    ) {
      const refreshKey = 'trade\0derived-refresh';
      if (published.has(refreshKey)) return;
      published.add(refreshKey);
      await plugin.tradeService?.clearCache();
      await plugin.accountPageService?.refreshAllAccountData();
    }
    return;
  }

  if (key.startsWith('backendIntegration.')) {
    if (
      key === 'backendIntegration.showUpdateNotifications' ||
      key === 'backendIntegration.showAvailableUpdateNotifications'
    ) {
      plugin.updateNotificationService?.handleNotificationSettingChanged();
    }
    publishOnce('backendIntegration', key.slice('backendIntegration.'.length));
    return;
  }

  if (key.startsWith('economicCalendar.')) {
    
    publishOnce('economicCalendar', 'economic-calendar-settings');
    if (
      key === 'economicCalendar.autoImport' &&
      plugin.settings.economicCalendar?.autoImport === true
    ) {
      
      void plugin.serviceManager
        .getEconomicCalendarService()
        .then((service) => service.autoImportNow())
        .catch((error: unknown) => {
          console.error(
            '[EconomicCalendarSettings] Auto-import after enabling failed:',
            error
          );
        });
    }
    return;
  }

  if (key.startsWith('sessionMode.')) {
    
    publishOnce('sessionMode', 'session-mode-settings');
    return;
  }

  if (
    key.startsWith('reviews.') ||
    key.startsWith('drc.') ||
    key.startsWith('weekly.') ||
    key.startsWith('monthly.') ||
    key.startsWith('quarterly.') ||
    key.startsWith('yearly.') ||
    key.startsWith('reviewV2.')
  ) {
    publishOnce('reviews', key);
  }
}
