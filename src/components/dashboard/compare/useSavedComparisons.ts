

import { useCallback, useState } from 'react';
import { Notice } from 'obsidian';
import type JournalitPlugin from '../../../main';
import { useEventBus } from '../../../hooks/useEventBus';
import { t } from '../../../lang/helpers';
import {
  type DashboardComparisonFilters,
  type SavedDashboardComparison,
  SAVED_COMPARISON_NAME_MAX_LENGTH,
  createSavedComparisonId,
} from './dashboardComparison';
import {
  persistSavedComparisons,
  readSavedComparisons,
} from './savedComparisonStore';

const errorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

const readSaved = (plugin: JournalitPlugin | null) =>
  plugin ? readSavedComparisons(plugin) : [];

export function useSavedComparisons(plugin: JournalitPlugin | null) {
  const [saved, setSaved] = useState<SavedDashboardComparison[]>(() =>
    readSaved(plugin)
  );

  
  useEventBus('settings:changed', (payload) => {
    if (payload?.section === 'dashboard' || payload?.section === 'all') {
      setSaved(readSaved(plugin));
    }
  });

  const write = useCallback(
    async (next: SavedDashboardComparison[]): Promise<boolean> => {
      if (!plugin?.settings.dashboard) return false;
      const previous = readSavedComparisons(plugin);
      setSaved(next);
      try {
        await persistSavedComparisons(plugin, next, 'dashboard-filter-menu');
        return true;
      } catch (error) {
        setSaved(previous);
        console.error('[Dashboard] Failed to save comparisons:', error);
        new Notice(
          t('notice.error.save-settings', { error: errorMessage(error) })
        );
        return false;
      }
    },
    [plugin]
  );

  
  const saveComparison = useCallback(
    (
      name: string,
      a: DashboardComparisonFilters,
      b: DashboardComparisonFilters
    ) => {
      const trimmed = name.trim().slice(0, SAVED_COMPARISON_NAME_MAX_LENGTH);
      if (!trimmed) return;
      const current = readSaved(plugin);
      const key = trimmed.toLowerCase();
      const existing = current.find(
        (comparison) => comparison.name.toLowerCase() === key
      );
      const entry: SavedDashboardComparison = {
        id: existing?.id ?? createSavedComparisonId(),
        name: trimmed,
        a,
        b,
      };
      void write(
        existing
          ? current.map((comparison) =>
              comparison.id === existing.id ? entry : comparison
            )
          : [...current, entry]
      ).then((written) => {
        if (written) {
          new Notice(t('dashboard.compare.saved-notice', { name: trimmed }));
        }
      });
    },
    [plugin, write]
  );

  const deleteComparison = useCallback(
    (id: string) => {
      void write(
        readSaved(plugin).filter((comparison) => comparison.id !== id)
      );
    },
    [plugin, write]
  );

  return { saved, saveComparison, deleteComparison };
}
