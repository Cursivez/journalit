

import type JournalitPlugin from '../../../main';
import { eventBus } from '../../../services/events/EventBus';
import type { SavedDashboardComparison } from './dashboardComparison';

type SettingsHost = Pick<JournalitPlugin, 'settings' | 'saveSettings'>;

const SAVED_COMPARISONS_COMPONENT = 'savedComparisons';

export function readSavedComparisons(
  plugin: SettingsHost
): SavedDashboardComparison[] {
  return plugin.settings.dashboard?.savedComparisons ?? [];
}


export async function persistSavedComparisons(
  plugin: SettingsHost,
  next: SavedDashboardComparison[],
  source: string
): Promise<void> {
  const dashboard = plugin.settings.dashboard;
  if (!dashboard) throw new Error('Dashboard settings are not loaded.');
  const previous = dashboard.savedComparisons;
  dashboard.savedComparisons = next;
  try {
    await plugin.saveSettings();
  } catch (error) {
    dashboard.savedComparisons = previous;
    throw error;
  }
  eventBus.publish('settings:changed', {
    section: 'dashboard',
    component: SAVED_COMPARISONS_COMPONENT,
    source,
  });
}
