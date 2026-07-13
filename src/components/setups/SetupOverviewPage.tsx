import React, { useMemo, useReducer, useState } from 'react';

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
  SETUPS_DETAIL_OPENED_ACTION_ID,
  SETUPS_OVERVIEW_OPENED_ACTION_ID,
  SETUPS_OVERVIEW_TAB_TARGET_ID,
  SETUPS_PAIRS_OPENED_ACTION_ID,
  SETUPS_PAIRS_TAB_TARGET_ID,
  SETUPS_VIEW_TABS_TARGET_ID,
} from '../../guides/setupsGuideIds';
import { EmptyState } from '../shared/EmptyState';
import {
  CreateGroup,
  FlaskConical,
  Plus,
  Share2,
} from '../shared/icons/ObsidianIcon';
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
import { SetupCard } from './SetupCard';
import { SetupPerformanceChartSection } from './SetupOverviewPerformanceSection';

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
  const sortedOverviewViewModels = useMemo(
    () => sortSetupCardsByRecentActivity(viewModels),
    [viewModels]
  );
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
    selectedSetupIds.length > 0
  );
  const emitGuideAction = useGuideAction();
  const currentGuideStepId = useGuideCurrentStepId();
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
  const { metricKey, chartMode, pairMetricKey } = chartSettings;
  const chartSelectedSetupIds = chartSettings.selectedSetupIds;
  const guideForcesPairsView =
    currentGuideStepId === 'pairs-mode' || currentGuideStepId === 'pairs-chart';
  const guideForcesCompareSelection =
    currentGuideStepId === 'compare-mode' ||
    currentGuideStepId === 'compare-select';
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
      selectedSetupIds,
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

  return (
    <div className="journalit-setups-view">
      <SetupOverviewHeader
        canCompare={viewModels.length >= 2}
        chartMode={effectiveChartMode}
        isCompareSelecting={effectiveIsCompareSelecting}
        selectedSetupCount={selectedSetupIds.length}
        onCompare={handleCompareAction}
        onCreateSetup={handleCreateSetupAction}
        onOverview={handleOverviewAction}
        onPairs={handlePairsAction}
        registerCompareTabTarget={registerCompareTabTarget}
        registerCreateButtonTarget={registerCreateButtonTarget}
        registerOverviewTabTarget={registerOverviewTabTarget}
        registerPairsTabTarget={registerPairsTabTarget}
        registerViewTabsTarget={registerViewTabsTarget}
      />

      <SetupPerformanceChartSection
        plugin={plugin}
        viewModels={viewModels}
        tradeIndex={tradeIndex}
        chartMode={effectiveChartMode}
        metricKey={metricKey}
        pairMetricKey={pairMetricKey}
        selectedSetupIds={chartSelectedSetupIds}
        onMetricKeyChange={handleMetricKeyChange}
        onPairMetricKeyChange={handlePairMetricKeyChange}
        onSelectedSetupIdsChange={handleChartSelectedSetupIdsChange}
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
              compareSelected={selectedSetupIds.includes(viewModel.setup.id)}
              compareDisabled={
                effectiveIsCompareSelecting &&
                selectedSetupIds.length >= 2 &&
                !selectedSetupIds.includes(viewModel.setup.id)
              }
              onOpen={() => {
                emitGuideAction(SETUPS_DETAIL_OPENED_ACTION_ID);
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
  canCompare: boolean;
  chartMode: SetupOverviewChartMode;
  isCompareSelecting: boolean;
  selectedSetupCount: number;
  onCompare: () => void;
  onCreateSetup: () => void;
  onOverview: () => void;
  onPairs: () => void;
  registerCompareTabTarget: (element: HTMLElement | null) => void;
  registerCreateButtonTarget: (element: HTMLElement | null) => void;
  registerOverviewTabTarget: (element: HTMLElement | null) => void;
  registerPairsTabTarget: (element: HTMLElement | null) => void;
  registerViewTabsTarget: (element: HTMLElement | null) => void;
}> = ({
  canCompare,
  chartMode,
  isCompareSelecting,
  selectedSetupCount,
  onCompare,
  onCreateSetup,
  onOverview,
  onPairs,
  registerCompareTabTarget,
  registerCreateButtonTarget,
  registerOverviewTabTarget,
  registerPairsTabTarget,
  registerViewTabsTarget,
}) => (
  <header className="journalit-setups-view__header">
    <div>
      <h1 className="journalit-setups-view__title journalit-setups-view__title--sr">
        {t('setups.view.title')}
      </h1>
    </div>
    <nav
      className="journalit-setups-view__tabs"
      aria-label={t('setups.view.tabs.aria')}
      ref={registerViewTabsTarget}
    >
      <button
        className={[
          'journalit-setups-tab-button',
          !isCompareSelecting && chartMode === 'pairs'
            ? 'journalit-setups-tab-button--active'
            : '',
        ]
          .filter(Boolean)
          .join(' ')}
        aria-current={
          !isCompareSelecting && chartMode === 'pairs' ? 'page' : undefined
        }
        aria-pressed={!isCompareSelecting && chartMode === 'pairs'}
        disabled={!canCompare}
        onClick={onPairs}
        aria-label={t('setups.view.overview.mode.pairs')}
        ref={registerPairsTabTarget}
      >
        <Share2 size={15} />
        <span>{t('setups.view.overview.mode.pairs')}</span>
      </button>
      <button
        className={[
          'journalit-setups-tab-button',
          !isCompareSelecting && chartMode === 'setups'
            ? 'journalit-setups-tab-button--active'
            : '',
        ]
          .filter(Boolean)
          .join(' ')}
        aria-current={
          !isCompareSelecting && chartMode === 'setups' ? 'page' : undefined
        }
        aria-pressed={!isCompareSelecting && chartMode === 'setups'}
        onClick={onOverview}
        aria-label={t('setups.view.tab.overview')}
        ref={registerOverviewTabTarget}
      >
        <FlaskConical size={15} />
        <span>{t('setups.view.tab.overview')}</span>
      </button>
      <button
        className={[
          'journalit-setups-tab-button',
          isCompareSelecting ? 'journalit-setups-tab-button--active' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        aria-pressed={isCompareSelecting}
        disabled={!canCompare}
        onClick={onCompare}
        aria-label={t('setups.view.action.compare-selected')}
        ref={registerCompareTabTarget}
      >
        <CreateGroup size={15} />
        <span>
          {isCompareSelecting
            ? `${t('setups.view.tab.compare')} (${selectedSetupCount}/2)`
            : t('setups.view.tab.compare')}
        </span>
      </button>
    </nav>
    <div className="journalit-setups-view__actions">
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
