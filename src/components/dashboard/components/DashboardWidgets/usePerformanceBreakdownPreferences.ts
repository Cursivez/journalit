import React from 'react';
import { Notice } from 'obsidian';
import { t } from '../../../../lang/helpers';
import { usePlugin } from '../../../../hooks/usePlugin';
import type JournalitPlugin from '../../../../main';
import type {
  PerformanceBreakdownMetric,
  PerformanceBreakdownViewMode,
} from '../../../../settings/types';
import {
  normalizeMetric,
  normalizeViewMode,
} from './performanceBreakdownChartModel';

export type PerformanceBreakdownKind = 'ticker' | 'setup' | 'tag' | 'rating';

type PerformanceBreakdownMetricKey =
  | 'tickerPerformanceMetric'
  | 'setupPerformanceMetric'
  | 'tagPerformanceMetric'
  | 'ratingPerformanceMetric';

type PerformanceBreakdownViewModeKey =
  | 'tickerPerformanceViewMode'
  | 'setupPerformanceViewMode'
  | 'tagPerformanceViewMode';


const SETTINGS_KEYS = {
  ticker: {
    metric: 'tickerPerformanceMetric',
    viewMode: 'tickerPerformanceViewMode',
  },
  setup: {
    metric: 'setupPerformanceMetric',
    viewMode: 'setupPerformanceViewMode',
  },
  tag: {
    metric: 'tagPerformanceMetric',
    viewMode: 'tagPerformanceViewMode',
  },
  rating: {
    metric: 'ratingPerformanceMetric',
    viewMode: null,
  },
} as const satisfies Record<
  PerformanceBreakdownKind,
  {
    metric: PerformanceBreakdownMetricKey;
    viewMode: PerformanceBreakdownViewModeKey | null;
  }
>;

interface PerformanceBreakdownPreferences {
  plugin: JournalitPlugin | null;
  selectedMetric: PerformanceBreakdownMetric;
  handleMetricChange: (metric: PerformanceBreakdownMetric) => void;
  selectedViewMode: PerformanceBreakdownViewMode;
  handleViewModeChange: (viewMode: PerformanceBreakdownViewMode) => void;
}

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

const usePersistedSelection = <T extends string>(
  persistedValue: T,
  persist: (value: T) => Promise<void>
): readonly [T, (value: T) => void] => {
  const [selection, setSelection] = React.useState<{
    persistedValue: T;
    selectedValue: T;
  }>(() => ({ persistedValue, selectedValue: persistedValue }));
  const selectedValue =
    selection.persistedValue === persistedValue
      ? selection.selectedValue
      : persistedValue;
  const handleChange = React.useCallback(
    (nextValue: T) => {
      setSelection({ persistedValue, selectedValue: nextValue });
      void persist(nextValue);
    },
    [persist, persistedValue]
  );

  return [selectedValue, handleChange];
};

export const usePerformanceBreakdownPreferences = (
  kind: PerformanceBreakdownKind
): PerformanceBreakdownPreferences => {
  const plugin = usePlugin();
  const settingsKeys = SETTINGS_KEYS[kind];

  const persistedMetric = normalizeMetric(
    plugin?.settings?.dashboard?.[settingsKeys.metric]
  );
  const persistMetric = React.useCallback(
    async (metric: PerformanceBreakdownMetric): Promise<void> => {
      const dashboard = plugin?.settings.dashboard;
      if (!plugin || !dashboard) return;

      dashboard[settingsKeys.metric] = metric;
      try {
        await plugin.saveSettings();
      } catch (error) {
        console.error(`Failed to save ${kind} performance metric:`, error);
        new Notice(
          t('notice.error.save-settings', { error: getErrorMessage(error) })
        );
      }
    },
    [kind, plugin, settingsKeys.metric]
  );
  const [selectedMetric, handleMetricChange] = usePersistedSelection(
    persistedMetric,
    persistMetric
  );

  const viewModeKey = settingsKeys.viewMode;
  const persistedViewMode = normalizeViewMode(
    viewModeKey ? plugin?.settings?.dashboard?.[viewModeKey] : undefined
  );
  const persistViewMode = React.useCallback(
    async (viewMode: PerformanceBreakdownViewMode): Promise<void> => {
      const dashboard = plugin?.settings.dashboard;
      if (!plugin || !dashboard || !viewModeKey) return;

      dashboard[viewModeKey] = viewMode;
      try {
        await plugin.saveSettings();
      } catch (error) {
        console.error(`Failed to save ${kind} performance view mode:`, error);
        new Notice(
          t('notice.error.save-settings', { error: getErrorMessage(error) })
        );
      }
    },
    [kind, plugin, viewModeKey]
  );
  const [selectedViewMode, handleViewModeChange] = usePersistedSelection(
    persistedViewMode,
    persistViewMode
  );

  return {
    plugin,
    selectedMetric,
    handleMetricChange,
    selectedViewMode,
    handleViewModeChange,
  };
};
