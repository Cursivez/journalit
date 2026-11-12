import React, { useCallback, useMemo, useRef, useState } from 'react';
import type JournalitPlugin from '../../main';
import type { SetupOutcomeScope } from '../../services/setup/types';
import { t } from '../../lang/helpers';
import { useDisplayFormatter } from '../../hooks/useDisplayPolicy';
import { useGuideTarget } from '../../guides/GuideRuntimeLayer';
import { SETUPS_CHART_TARGET_ID } from '../../guides/setupsGuideIds';
import type { DropdownMenuOption } from '../shared/DropdownMenu';
import {
  ALL_OUTCOMES_ONLY_METRIC_KEYS,
  METRIC_OPTIONS,
  OVERVIEW_R_METRIC_KEYS,
  PAIR_R_METRIC_KEYS,
  SETUP_PAIR_METRIC_OPTIONS,
} from './setupOverviewMetrics';
import type { SetupOutcome } from './setupOverviewScope';
import { SetupOutcomeScopeControl } from './SetupOverviewOutcome';
import {
  SetupPerformanceEmptyState,
  SetupPerformanceWidgetHeader,
  type SetupPerformanceHeaderRenderer,
} from './SetupOverviewPerformanceChrome';
import { SetupTimesSeenPanel } from './SetupOverviewTimesSeen';
import type {
  MetricKey,
  SetupOutcomeMetricsSource,
  SetupOverviewChartMode,
  SetupOverviewMetricKey,
  SetupPairMetricKey,
  SetupTradeIndex,
  SetupViewModel,
} from './setupsViewTypes';
import { useCloseSetupChartMenusOnOutsidePointer } from './useSetupOverviewPerformance';
import {
  resolveOverviewMetric,
  SetupRankingPanel,
} from './SetupOverviewRankingPanel';

const displaysRMultiples = (plugin: JournalitPlugin): boolean =>
  plugin.settings.trade?.displayRMultiples ?? false;

const setupSelectionLabelOf = (
  allSelected: boolean,
  selectedCount: number
): string =>
  allSelected
    ? t('setups.view.overview.setup-filter.all')
    : t('setups.view.overview.setup-filter.selected').replace(
        '{count}',
        String(selectedCount)
      );

const performanceWidgetClassName = (isPairsMode: boolean): string =>
  isPairsMode
    ? 'journalit-chart-widget journalit-setups-performance-widget journalit-setups-performance-widget--pairs'
    : 'journalit-chart-widget journalit-setups-performance-widget';


export const SetupPerformanceChartSection: React.FC<{
  plugin: JournalitPlugin;
  viewModels: SetupViewModel[];
  tradeIndex: SetupTradeIndex;
  outcomeMetrics: SetupOutcomeMetricsSource;
  chartMode: SetupOverviewChartMode;
  metricKey: SetupOverviewMetricKey;
  outcomeScope: SetupOutcomeScope;
  pairMetricKey: SetupPairMetricKey;
  selectedSetupIds: string[] | undefined;
  onMetricKeyChange: (metricKey: SetupOverviewMetricKey) => void;
  onOutcomeScopeChange: (outcomeScope: SetupOutcomeScope) => void;
  onPairMetricKeyChange: (metricKey: SetupPairMetricKey) => void;
  onSelectedSetupIdsChange: (setupIds: string[] | undefined) => void;
  onSetupSelected: (setupId: string) => void;
}> = ({
  plugin,
  viewModels,
  tradeIndex,
  outcomeMetrics,
  chartMode,
  metricKey,
  outcomeScope,
  pairMetricKey,
  selectedSetupIds,
  onMetricKeyChange,
  onOutcomeScopeChange,
  onPairMetricKeyChange,
  onSelectedSetupIdsChange,
  onSetupSelected,
}) => {
  const { shouldMask } = useDisplayFormatter();
  const registerChartTarget = useGuideTarget(SETUPS_CHART_TARGET_ID);
  const [metricMenuOpen, setMetricMenuOpen] = useState(false);
  const [setupMenuOpen, setSetupMenuOpen] = useState(false);
  
  const [selectedPairKey, setSelectedPairKey] = useState<string | null>(null);
  const metricMenuRef = useRef<HTMLDivElement>(null);
  const setupMenuRef = useRef<HTMLDivElement>(null);
  const handleMetricMenuOpenChange = (open: boolean) => {
    setMetricMenuOpen(open);
    if (open) setSetupMenuOpen(false);
  };
  const handleSetupMenuOpenChange = (open: boolean) => {
    setSetupMenuOpen(open);
    if (open) setMetricMenuOpen(false);
  };
  const closeMenus = useCallback(() => {
    setMetricMenuOpen(false);
    setSetupMenuOpen(false);
  }, []);
  useCloseSetupChartMenusOnOutsidePointer(
    metricMenuOpen,
    setupMenuOpen,
    metricMenuRef,
    setupMenuRef,
    closeMenus
  );
  const displayRMultiples = displaysRMultiples(plugin);
  const isPairsMode = chartMode === 'pairs';
  
  
  const outcome: SetupOutcome | null =
    isPairsMode || metricKey === 'timesSeen' || outcomeScope === 'all'
      ? null
      : outcomeScope;
  const availableSetupIds = useMemo(
    () => viewModels.map(({ setup }) => setup.id),
    [viewModels]
  );
  const effectiveSelectedSetupIds = useMemo(() => {
    if (selectedSetupIds === undefined) return availableSetupIds;
    const available = new Set(availableSetupIds);
    return selectedSetupIds.filter((setupId) => available.has(setupId));
  }, [availableSetupIds, selectedSetupIds]);
  const allSetupsSelected =
    selectedSetupIds === undefined ||
    effectiveSelectedSetupIds.length === availableSetupIds.length;
  const selectedViewModels = useMemo(() => {
    const selected = new Set(effectiveSelectedSetupIds);
    return viewModels.filter(({ setup }) => selected.has(setup.id));
  }, [effectiveSelectedSetupIds, viewModels]);
  const { metricOptions, pairMetricOptions } = useSetupPerformanceMetricOptions(
    displayRMultiples,
    outcome !== null
  );
  const setups = useMemo(
    () => viewModels.map(({ setup }) => setup),
    [viewModels]
  );
  const renderHeader: SetupPerformanceHeaderRenderer = ({
    summary,
    metricKey: shownMetricKey,
    metricLabel,
    showOutcomeControl,
  }) => (
    <SetupPerformanceWidgetHeader
      currentMetricLabel={metricLabel}
      effectiveSelectedSetupIds={effectiveSelectedSetupIds}
      headerSummary={summary}
      metricKey={shownMetricKey}
      outcomeControl={
        showOutcomeControl ? (
          <SetupOutcomeScopeControl
            value={outcomeScope}
            onChange={onOutcomeScopeChange}
          />
        ) : null
      }
      metricMenuOpen={metricMenuOpen}
      metricMenuRef={metricMenuRef}
      metricOptions={metricOptions}
      setupMenuOpen={setupMenuOpen}
      setupMenuRef={setupMenuRef}
      setupSelectionLabel={setupSelectionLabelOf(
        allSetupsSelected,
        effectiveSelectedSetupIds.length
      )}
      setups={setups}
      onMetricKeyChange={onMetricKeyChange}
      onMetricMenuOpenChange={handleMetricMenuOpenChange}
      onSelectedSetupIdsChange={onSelectedSetupIdsChange}
      onSetupMenuOpenChange={handleSetupMenuOpenChange}
    />
  );

  
  const rankedMetricKey: MetricKey =
    metricKey === 'timesSeen' ? METRIC_OPTIONS[0].key : metricKey;
  let panel: React.ReactNode;
  if (!isPairsMode && metricKey === 'timesSeen') {
    panel = (
      <SetupTimesSeenPanel
        viewModels={selectedViewModels}
        renderHeader={renderHeader}
        onSetupSelected={onSetupSelected}
      />
    );
  } else if (outcome && shouldMask('percentage')) {
    
    
    const { effectiveMetricKey, metric } = resolveOverviewMetric(
      rankedMetricKey,
      displayRMultiples,
      shouldMask,
      outcome
    );
    panel = (
      <>
        {renderHeader({
          summary: null,
          metricKey: effectiveMetricKey,
          metricLabel: t(metric.labelKey),
          showOutcomeControl: true,
        })}
        <SetupPerformanceEmptyState reason="outcomePrivacy" />
      </>
    );
  } else {
    panel = (
      <SetupRankingPanel
        allSetupsSelected={allSetupsSelected}
        displayRMultiples={displayRMultiples}
        isPairsMode={isPairsMode}
        metricKey={rankedMetricKey}
        metricMenuOpen={metricMenuOpen}
        metricMenuRef={metricMenuRef}
        outcome={outcome}
        outcomeMetrics={outcomeMetrics}
        pairMetricKey={pairMetricKey}
        pairMetricOptions={pairMetricOptions}
        selectedPairKey={selectedPairKey}
        onPairSelected={setSelectedPairKey}
        renderHeader={renderHeader}
        tradeIndex={tradeIndex}
        viewModels={selectedViewModels}
        onMetricMenuOpenChange={handleMetricMenuOpenChange}
        onPairMetricKeyChange={onPairMetricKeyChange}
        onSetupSelected={onSetupSelected}
      />
    );
  }

  return (
    <section
      className={performanceWidgetClassName(isPairsMode)}
      ref={registerChartTarget}
    >
      {panel}
    </section>
  );
};

SetupPerformanceChartSection.displayName = 'SetupPerformanceChartSection';

function useSetupPerformanceMetricOptions(
  displayRMultiples: boolean,
  isCountingOneOutcome: boolean
): {
  metricOptions: Array<DropdownMenuOption<SetupOverviewMetricKey>>;
  pairMetricOptions: Array<DropdownMenuOption<SetupPairMetricKey>>;
} {
  const metricOptions = useMemo<
    Array<DropdownMenuOption<SetupOverviewMetricKey>>
  >(() => {
    const options: Array<DropdownMenuOption<SetupOverviewMetricKey>> = [];
    for (const option of METRIC_OPTIONS) {
      if (!displayRMultiples && OVERVIEW_R_METRIC_KEYS.has(option.key)) {
        continue;
      }
      if (
        isCountingOneOutcome &&
        ALL_OUTCOMES_ONLY_METRIC_KEYS.has(option.key)
      ) {
        continue;
      }
      options.push({ value: option.key, label: t(option.labelKey) });
    }
    options.push({
      value: 'timesSeen',
      label: t('setups.view.metric.times-seen'),
    });
    return options;
  }, [displayRMultiples, isCountingOneOutcome]);
  const pairMetricOptions = useMemo<
    Array<DropdownMenuOption<SetupPairMetricKey>>
  >(() => {
    const options: Array<DropdownMenuOption<SetupPairMetricKey>> = [];
    for (const option of SETUP_PAIR_METRIC_OPTIONS) {
      if (displayRMultiples || !PAIR_R_METRIC_KEYS.has(option.key)) {
        options.push({ value: option.key, label: t(option.labelKey) });
      }
    }
    return options;
  }, [displayRMultiples]);

  return { metricOptions, pairMetricOptions };
}
