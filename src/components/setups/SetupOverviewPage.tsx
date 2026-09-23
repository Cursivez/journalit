import React, { useCallback, useMemo, useReducer, useState } from 'react';

import type JournalitPlugin from '../../main';
import { t } from '../../lang/helpers';

import {
  useGuideAction,
  useGuideCurrentStepId,
  useGuideTarget,
} from '../../guides/GuideRuntimeLayer';
import {
  SETUPS_CARD_GRID_TARGET_ID,
  SETUPS_COMPARE_OPENED_ACTION_ID,
  SETUPS_COMPARE_SELECTING_ACTION_ID,
  SETUPS_COMPARE_TAB_TARGET_ID,
  SETUPS_CREATE_BUTTON_TARGET_ID,
  SETUPS_OVERVIEW_OPENED_ACTION_ID,
  SETUPS_OVERVIEW_TAB_TARGET_ID,
  SETUPS_PAIRS_OPENED_ACTION_ID,
  SETUPS_PAIRS_TAB_TARGET_ID,
  SETUPS_TAG_FILTER_TARGET_ID,
  SETUPS_VIEW_TABS_TARGET_ID,
} from '../../guides/setupsGuideIds';
import { EmptyState } from '../shared/EmptyState';
import { Plus } from '../shared/icons/ObsidianIcon';
import type {
  MetricKey,
  SetupOverviewChartMode,
  SetupPairMetricKey,
  SetupTradeIndex,
  SetupViewModel,
} from './setupsViewTypes';
import {
  setupOverviewChartSettingsReducer,
  sortSetupCardsByRecentActivity,
  toggleSelectedSetupId,
} from './setupsViewModel';
import { SegmentedControl } from '../shared/SegmentedControl';
import { SetupCard } from './SetupCard';
import { SetupPerformanceChartSection } from './SetupOverviewPerformanceSection';
import {
  SetupOverviewFilter,
  type SetupDirectionFilter,
  useSetupOverviewTagFilter,
} from './SetupTags';

function useSetupOverviewFilterActions({
  currentGuideStepId,
  handleDirectionFiltersChange,
  handleFiltersChange,
  handleTagFiltersChange,
  setIsCompareSelecting,
}: {
  currentGuideStepId: string | null;
  handleDirectionFiltersChange: (directions: SetupDirectionFilter[]) => number;
  handleFiltersChange: (
    tags: string[],
    directions: SetupDirectionFilter[]
  ) => number;
  handleTagFiltersChange: (tags: string[]) => number;
  setIsCompareSelecting: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const exitInvalidCompareSelection = useCallback(
    (visibleSetupCount: number) => {
      if (!currentGuideStepId && visibleSetupCount < 2) {
        setIsCompareSelecting(false);
      }
    },
    [currentGuideStepId, setIsCompareSelecting]
  );
  const onTagsChange = useCallback(
    (tags: string[]) =>
      exitInvalidCompareSelection(handleTagFiltersChange(tags)),
    [exitInvalidCompareSelection, handleTagFiltersChange]
  );
  const onDirectionsChange = useCallback(
    (directions: SetupDirectionFilter[]) =>
      exitInvalidCompareSelection(handleDirectionFiltersChange(directions)),
    [exitInvalidCompareSelection, handleDirectionFiltersChange]
  );
  const onReset = useCallback(
    () => exitInvalidCompareSelection(handleFiltersChange([], [])),
    [exitInvalidCompareSelection, handleFiltersChange]
  );
  return { onDirectionsChange, onReset, onTagsChange };
}

function useSetupChartNavigation(
  viewModels: SetupViewModel[],
  onOpenSetup: (setupId: string, setupName: string, setupPath?: string) => void
) {
  return useCallback(
    (setupId: string) => {
      const viewModel = viewModels.find(({ setup }) => setup.id === setupId);
      if (viewModel) {
        onOpenSetup(
          viewModel.setup.id,
          viewModel.setup.name,
          viewModel.setup.filePath
        );
      }
    },
    [onOpenSetup, viewModels]
  );
}

export const SetupOverviewPage: React.FC<{
  plugin: JournalitPlugin;
  viewModels: SetupViewModel[];
  tradeIndex: SetupTradeIndex;
  selectedSetupIds: string[];
  onSelectedSetupIdsChange: (setupIds: string[]) => void;
  onOpenSetup: (setupId: string, setupName: string, setupPath?: string) => void;
  onCompareSelected: (setupIds: string[]) => void;
  onCreateSetup: () => void;
}> = ({
  plugin,
  viewModels,
  tradeIndex,
  selectedSetupIds,
  onSelectedSetupIdsChange,
  onOpenSetup,
  onCompareSelected,
  onCreateSetup,
}) => {
  const currentGuideStepId = useGuideCurrentStepId();
  const {
    availableTags,
    filteredViewModels: effectiveViewModels,
    handleDirectionFiltersChange,
    handleFiltersChange,
    handleTagFiltersChange,
    selectedDirectionFilters,
    selectedTagFilters,
    visibleSelectedSetupIds: effectiveVisibleSelectedSetupIds,
  } = useSetupOverviewTagFilter({
    plugin,
    viewModels,
    selectedSetupIds,
    onSelectedSetupIdsChange,
    isGuideActive: Boolean(currentGuideStepId),
  });

  const [chartSettings, dispatchChartSettings] = useReducer(
    setupOverviewChartSettingsReducer,
    undefined,
    () => ({
      metricKey:
        plugin.uiStateManager.getState().setupOverviewMetricKey ??
        'profitFactor',
      chartMode:
        plugin.uiStateManager.getState().setupOverviewChartMode ?? 'setups',
      pairMetricKey:
        plugin.uiStateManager.getState().setupOverviewPairMetricKey ??
        (plugin.settings.trade?.displayRMultiples ? 'edgeR' : 'profitFactor'),
      selectedSetupIds:
        plugin.uiStateManager.getState().setupOverviewSelectedSetupIds,
    })
  );
  const [isCompareSelecting, setIsCompareSelecting] = useState(
    selectedSetupIds.length > 0 && effectiveViewModels.length >= 2
  );
  const {
    onDirectionsChange: handleOverviewDirectionFiltersChange,
    onReset: resetOverviewFilters,
    onTagsChange: handleOverviewTagFiltersChange,
  } = useSetupOverviewFilterActions({
    currentGuideStepId,
    handleDirectionFiltersChange,
    handleFiltersChange,
    handleTagFiltersChange,
    setIsCompareSelecting,
  });
  const emitGuideAction = useGuideAction();
  const registerViewTabsTarget = useGuideTarget(SETUPS_VIEW_TABS_TARGET_ID);
  const registerPairsTabTarget = useGuideTarget(SETUPS_PAIRS_TAB_TARGET_ID);
  const registerOverviewTabTarget = useGuideTarget(
    SETUPS_OVERVIEW_TAB_TARGET_ID
  );
  const registerCompareTabTarget = useGuideTarget(SETUPS_COMPARE_TAB_TARGET_ID);
  const registerCreateButtonTarget = useGuideTarget(
    SETUPS_CREATE_BUTTON_TARGET_ID
  );
  const registerCardGridTarget = useGuideTarget(SETUPS_CARD_GRID_TARGET_ID);
  const registerTagFilterTarget = useGuideTarget(SETUPS_TAG_FILTER_TARGET_ID);
  const handleSetupChartSelected = useSetupChartNavigation(
    effectiveViewModels,
    onOpenSetup
  );
  const { metricKey, chartMode, pairMetricKey } = chartSettings;
  const chartSelectedSetupIds = chartSettings.selectedSetupIds;
  const guideForcesPairsView =
    currentGuideStepId === 'pairs-mode' || currentGuideStepId === 'pairs-chart';
  const guideForcesCompareSelection =
    currentGuideStepId === 'compare-mode' ||
    currentGuideStepId === 'compare-select';
  const sortedOverviewViewModels = useMemo(
    () => sortSetupCardsByRecentActivity(effectiveViewModels),
    [effectiveViewModels]
  );
  const effectiveChartMode: SetupOverviewChartMode = guideForcesPairsView
    ? 'pairs'
    : currentGuideStepId
      ? 'setups'
      : chartMode;
  const effectiveIsCompareSelecting = guideForcesPairsView
    ? false
    : guideForcesCompareSelection
      ? true
      : isCompareSelecting;

  const handleCompareAction = () => {
    if (currentGuideStepId === 'compare-mode') {
      setIsCompareSelecting(true);
      emitGuideAction(SETUPS_COMPARE_SELECTING_ACTION_ID);
      return;
    }

    if (!effectiveIsCompareSelecting) {
      setIsCompareSelecting(true);
      emitGuideAction(SETUPS_COMPARE_SELECTING_ACTION_ID);
      return;
    }

    handleOverviewAction();
  };

  const handleOverviewAction = () => {
    setIsCompareSelecting(false);
    onSelectedSetupIdsChange([]);
    handleChartModeChange('setups');
    emitGuideAction(SETUPS_OVERVIEW_OPENED_ACTION_ID);
  };

  const handlePairsAction = () => {
    setIsCompareSelecting(false);
    onSelectedSetupIdsChange([]);
    handleChartModeChange('pairs');
    emitGuideAction(SETUPS_PAIRS_OPENED_ACTION_ID);
  };

  const handleCreateSetupAction = () => {
    onCreateSetup();
  };

  const handleToggleSetupForCompare = (setupId: string) => {
    const nextSelectedSetupIds = toggleSelectedSetupId(
      effectiveVisibleSelectedSetupIds,
      setupId
    );
    onSelectedSetupIdsChange(nextSelectedSetupIds);

    if (nextSelectedSetupIds.length === 2) {
      emitGuideAction(SETUPS_COMPARE_OPENED_ACTION_ID);
      onCompareSelected(nextSelectedSetupIds);
    }
  };

  const handleGuideCompareAutoSelect = () => {
    const setupIds = sortedOverviewViewModels
      .slice(0, 2)
      .map(({ setup }) => setup.id);
    if (setupIds.length < 2) {
      return;
    }

    onSelectedSetupIdsChange(setupIds);
    emitGuideAction(SETUPS_COMPARE_OPENED_ACTION_ID);
    onCompareSelected(setupIds);
  };

  const handleMetricKeyChange = (nextMetricKey: MetricKey) => {
    dispatchChartSettings({ type: 'metric', metricKey: nextMetricKey });
    void plugin.uiStateManager.updateState({
      setupOverviewMetricKey: nextMetricKey,
    });
  };

  const handleChartModeChange = (nextMode: SetupOverviewChartMode) => {
    dispatchChartSettings({ type: 'mode', chartMode: nextMode });
    void plugin.uiStateManager.updateState({
      setupOverviewChartMode: nextMode,
    });
  };

  const handlePairMetricKeyChange = (nextMetricKey: SetupPairMetricKey) => {
    dispatchChartSettings({ type: 'pairMetric', pairMetricKey: nextMetricKey });
    void plugin.uiStateManager.updateState({
      setupOverviewPairMetricKey: nextMetricKey,
    });
  };

  const handleChartSelectedSetupIdsChange = (
    nextSelectedSetupIds: string[] | undefined
  ) => {
    dispatchChartSettings({
      type: 'selectedSetups',
      selectedSetupIds: nextSelectedSetupIds,
    });
    void plugin.uiStateManager.updateState({
      setupOverviewSelectedSetupIds: nextSelectedSetupIds,
    });
  };

  const effectiveVisibleSelectedSetupIdsSet = new Set(
    effectiveVisibleSelectedSetupIds
  );
  return (
    <div className="journalit-setups-view">
      <SetupOverviewHeader
        availableTags={availableTags}
        canCompare={effectiveViewModels.length >= 2}
        chartMode={effectiveChartMode}
        isCompareSelecting={effectiveIsCompareSelecting}
        selectedDirectionFilters={selectedDirectionFilters}
        selectedSetupCount={effectiveVisibleSelectedSetupIds.length}
        selectedTagFilters={selectedTagFilters}
        onCompare={handleCompareAction}
        onCreateSetup={handleCreateSetupAction}
        onDirectionFiltersChange={handleOverviewDirectionFiltersChange}
        onOverview={handleOverviewAction}
        onPairs={handlePairsAction}
        onResetFilters={resetOverviewFilters}
        onTagFiltersChange={handleOverviewTagFiltersChange}
        registerCompareTabTarget={registerCompareTabTarget}
        registerCreateButtonTarget={registerCreateButtonTarget}
        registerOverviewTabTarget={registerOverviewTabTarget}
        registerPairsTabTarget={registerPairsTabTarget}
        registerTagFilterTarget={registerTagFilterTarget}
        registerViewTabsTarget={registerViewTabsTarget}
      />

      <SetupPerformanceChartSection
        plugin={plugin}
        viewModels={effectiveViewModels}
        tradeIndex={tradeIndex}
        chartMode={effectiveChartMode}
        metricKey={metricKey}
        pairMetricKey={pairMetricKey}
        selectedSetupIds={chartSelectedSetupIds}
        onMetricKeyChange={handleMetricKeyChange}
        onPairMetricKeyChange={handlePairMetricKeyChange}
        onSelectedSetupIdsChange={handleChartSelectedSetupIdsChange}
        onSetupSelected={handleSetupChartSelected}
      />

      {viewModels.length === 0 ? (
        <EmptyState
          className="journalit-setups-overview-empty-state"
          iconSize={42}
          message={t('setups.view.empty.no-setups')}
          subMessage={t('setups.view.empty.no-setups-submessage')}
          actionButtonText={t('setups.view.action.new')}
          onActionButtonClick={handleCreateSetupAction}
        />
      ) : effectiveViewModels.length === 0 ? (
        <EmptyState
          className="journalit-setups-overview-empty-state"
          iconSize={42}
          message={t('setups.view.overview.tag-filter.empty')}
          subMessage={t('setups.view.overview.tag-filter.empty-submessage')}
          actionButtonText={t('setups.view.overview.tag-filter.reset')}
          onActionButtonClick={resetOverviewFilters}
        />
      ) : (
        <section
          className="journalit-setups-card-grid"
          ref={registerCardGridTarget}
        >
          {currentGuideStepId === 'compare-select' ? (
            <button
              type="button"
              className="journalit-skeleton-screenreader-status"
              onClick={handleGuideCompareAutoSelect}
            >
              {t('setups.guide.compare-select.title')}
            </button>
          ) : null}
          {sortedOverviewViewModels.map((viewModel) => (
            <SetupCard
              key={viewModel.setup.id}
              viewModel={viewModel}
              linkedTrades={tradeIndex.any.get(viewModel.setup.id) ?? []}
              displayRMultiples={
                plugin.settings.trade?.displayRMultiples ?? false
              }
              compareMode={effectiveIsCompareSelecting}
              compareSelected={effectiveVisibleSelectedSetupIdsSet.has(
                viewModel.setup.id
              )}
              compareDisabled={
                effectiveIsCompareSelecting &&
                effectiveVisibleSelectedSetupIds.length >= 2 &&
                !effectiveVisibleSelectedSetupIdsSet.has(viewModel.setup.id)
              }
              onOpen={() => {
                onOpenSetup(
                  viewModel.setup.id,
                  viewModel.setup.name,
                  viewModel.setup.filePath
                );
              }}
              onToggleCompare={() =>
                handleToggleSetupForCompare(viewModel.setup.id)
              }
            />
          ))}
        </section>
      )}
    </div>
  );
};

SetupOverviewPage.displayName = 'SetupOverviewPage';

const SetupOverviewHeader: React.FC<{
  availableTags: string[];
  canCompare: boolean;
  chartMode: SetupOverviewChartMode;
  isCompareSelecting: boolean;
  selectedDirectionFilters: SetupDirectionFilter[];
  selectedSetupCount: number;
  selectedTagFilters: string[];
  onCompare: () => void;
  onCreateSetup: () => void;
  onDirectionFiltersChange: (directions: SetupDirectionFilter[]) => void;
  onOverview: () => void;
  onPairs: () => void;
  onResetFilters: () => void;
  onTagFiltersChange: (tags: string[]) => void;
  registerCompareTabTarget: (element: HTMLElement | null) => void;
  registerCreateButtonTarget: (element: HTMLElement | null) => void;
  registerOverviewTabTarget: (element: HTMLElement | null) => void;
  registerPairsTabTarget: (element: HTMLElement | null) => void;
  registerTagFilterTarget: (element: HTMLElement | null) => void;
  registerViewTabsTarget: (element: HTMLElement | null) => void;
}> = ({
  availableTags,
  canCompare,
  chartMode,
  isCompareSelecting,
  selectedDirectionFilters,
  selectedSetupCount,
  selectedTagFilters,
  onCompare,
  onCreateSetup,
  onDirectionFiltersChange,
  onOverview,
  onPairs,
  onResetFilters,
  onTagFiltersChange,
  registerCompareTabTarget,
  registerCreateButtonTarget,
  registerOverviewTabTarget,
  registerPairsTabTarget,
  registerTagFilterTarget,
  registerViewTabsTarget,
}) => (
  <header className="journalit-setups-view__header">
    <div>
      <h1 className="journalit-setups-view__title journalit-setups-view__sr-only">
        {t('setups.view.title')}
      </h1>
    </div>
    <div className="journalit-setups-view__tabs" ref={registerViewTabsTarget}>
      <SegmentedControl<SetupOverviewChartMode | 'compare'>
        ariaLabel={t('setups.view.tabs.aria')}
        className="journalit-setups-view__tab-control"
        groupRole="radiogroup"
        size="medium"
        value={isCompareSelecting ? 'compare' : chartMode}
        getOptionRef={(value) =>
          value === 'pairs'
            ? registerPairsTabTarget
            : value === 'setups'
              ? registerOverviewTabTarget
              : registerCompareTabTarget
        }
        options={[
          {
            value: 'pairs',
            label: t('setups.view.overview.mode.pairs'),
            disabled: !canCompare,
          },
          { value: 'setups', label: t('setups.view.tab.overview') },
          {
            value: 'compare',
            label: isCompareSelecting
              ? `${t('setups.view.tab.compare')} (${selectedSetupCount}/2)`
              : t('setups.view.tab.compare'),
            disabled: !canCompare,
          },
        ]}
        onChange={(next) => {
          if (next === 'pairs') onPairs();
          else if (next === 'setups') onOverview();
          else onCompare();
        }}
      />
    </div>
    <div className="journalit-setups-view__actions">
      <div
        className="journalit-setups-tag-filter-target"
        ref={registerTagFilterTarget}
      >
        <SetupOverviewFilter
          availableTags={availableTags}
          selectedDirections={selectedDirectionFilters}
          selectedTags={selectedTagFilters}
          onDirectionsChange={onDirectionFiltersChange}
          onReset={onResetFilters}
          onTagsChange={onTagFiltersChange}
        />
      </div>
      <button
        className="journalit-setups-create-button"
        onClick={onCreateSetup}
        aria-label={t('setups.view.action.create')}
        ref={registerCreateButtonTarget}
      >
        <Plus size={15} />
        <span>{t('setups.view.action.new')}</span>
      </button>
    </div>
  </header>
);

SetupOverviewHeader.displayName = 'SetupOverviewHeader';
