import type JournalitPlugin from '../../main';
import { SETTINGS_TAB_IDS } from '../../settings/types';

const historyFocusRequests = new WeakSet<JournalitPlugin>();


export function openImportManagement(plugin: JournalitPlugin): void {
  historyFocusRequests.add(plugin);
  plugin.openSettingsToTab(SETTINGS_TAB_IDS.TRADE_IMPORT_SYNC);
}


export function consumeImportHistoryFocus(plugin: JournalitPlugin): boolean {
  return historyFocusRequests.delete(plugin);
}
