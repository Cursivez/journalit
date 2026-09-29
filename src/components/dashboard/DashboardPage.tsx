import React, {
  useCallback,
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
} from 'react';
import type { WorkspaceLeaf } from 'obsidian';
import type JournalitPlugin from '../../main';
import { FilterControls } from './components/FilterControls';
import { DashboardContent } from './components/DashboardContent';
import { useDashboard } from './hooks';
import type { FilterState } from './DashboardView';
import {
  DashboardDataProvider,
  useDashboardData,
} from './context/DashboardDataContext';
import { useDebounced } from '../../hooks/useDebounced';
import { useEventBusMultiple } from '../../hooks/useEventBus';
import { usePlugin } from '../../hooks/usePlugin';
import {
  useGuideAction,
  useGuideBackHandler,
  useGuideCurrentStepId,
} from '../../guides/GuideRuntimeLayer';
import {
  DASHBOARD_EDIT_MODE_DISABLED_ACTION_ID,
  DASHBOARD_EDIT_MODE_ENABLED_ACTION_ID,
  DASHBOARD_CUSTOMIZE_GUIDE_ID,
  DASHBOARD_EMPTY_GUIDE_ID,
  DASHBOARD_MAIN_GUIDE_ID,
  DASHBOARD_WIDGET_SELECTOR_OPENED_ACTION_ID,
} from '../../guides/dashboardGuideIds';
import { resolveContextualGuideId } from '../../guides/contextualGuideResolution';
import { isFilterMenuWhatsNewDue } from '../../guides/filterMenuWhatsNewResolution';
import { DASHBOARD_WHATS_NEW_FILTER_MENU_GUIDE_ID } from '../../guides/filterMenuWhatsNewGuideIds';

interface DashboardGuideCoordinatorProps {
  leaf: WorkspaceLeaf;
  isActive: boolean;
  isEditing: boolean;
  showUnifiedSelector: boolean;
}

const DashboardGuideCoordinator: React.FC<DashboardGuideCoordinatorProps> = ({
  leaf,
  isActive,
  isEditing,
  showUnifiedSelector,
}) => {
  const plugin = usePlugin();
  const { dashboardData } = useDashboardData();
  const emitGuideAction = useGuideAction();
  const previousIsEditingRef = useRef(isEditing);
  const isEditingRef = useRef(isEditing);
  const totalTradeCountRef = useRef<number | null>(null);
  
  
  
  const isActiveRef = useRef(isActive);

  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  const applyResolvedGuide = useCallback(
    (tradeCount: number | null, data: typeof dashboardData) => {
      if (!isActiveRef.current || !plugin?.viewGuideService) return;

      let resolvedGuideId: string | null = null;
      if (data && tradeCount !== null) {
        if (tradeCount === 0 && data.trades.length === 0) {
          resolvedGuideId = DASHBOARD_EMPTY_GUIDE_ID;
        } else if (tradeCount > 0 && data.trades.length > 0) {
          const guideService = plugin.viewGuideService;
          const getPersistedState = (guideId: string) =>
            guideService.getPersistedGuideState(guideId);
          const baseGuideId = isFilterMenuWhatsNewDue(
            DASHBOARD_WHATS_NEW_FILTER_MENU_GUIDE_ID,
            getPersistedState
          )
            ? DASHBOARD_WHATS_NEW_FILTER_MENU_GUIDE_ID
            : DASHBOARD_MAIN_GUIDE_ID;
          const activeSessionGuideId =
            [baseGuideId, DASHBOARD_CUSTOMIZE_GUIDE_ID]
              .map((guideId) =>
                guideService.getSessionForGuideAndLeaf(guideId, leaf)
              )
              .find((session) => session && session.status !== 'ended')
              ?.guideId ?? null;
          resolvedGuideId = resolveContextualGuideId({
            baseGuideId,
            contextualGuides: [
              {
                guideId: DASHBOARD_CUSTOMIZE_GUIDE_ID,
                active: isEditingRef.current,
              },
            ],
            activeSessionGuideId,
            getPersistedState,
          });
        }
      }

      const dashboardSession =
        plugin.viewGuideService.getSessionForGuideAndLeaf(
          DASHBOARD_MAIN_GUIDE_ID,
          leaf
        ) ||
        plugin.viewGuideService.getSessionForGuideAndLeaf(
          DASHBOARD_EMPTY_GUIDE_ID,
          leaf
        );

      if (
        dashboardSession &&
        resolvedGuideId &&
        resolvedGuideId !== DASHBOARD_CUSTOMIZE_GUIDE_ID &&
        resolvedGuideId !== DASHBOARD_WHATS_NEW_FILTER_MENU_GUIDE_ID &&
        dashboardSession.guideId !== resolvedGuideId
      ) {
        void plugin.viewGuideService.clearGuideState(dashboardSession.guideId);
      }

      plugin.viewGuideService.setResolvedGuideForLeaf(leaf, resolvedGuideId);
    },
    [leaf, plugin]
  );

  const refreshTradeCount = useCallback(
    async ({ requireReady }: { requireReady: boolean }) => {
      if (!isActiveRef.current || !plugin?.tradeService) return;

      try {
        if (requireReady) await plugin.tradeService.waitForTradeDataReady();
        if (!isActiveRef.current) return;
        const count = await plugin.tradeService.getTradeCount();
        totalTradeCountRef.current = count;
        applyResolvedGuide(count, dashboardData);
      } catch (error) {
        console.error(
          '[DashboardGuideCoordinator] Failed to resolve trade count:',
          error
        );
      }
    },
    [applyResolvedGuide, dashboardData, plugin]
  );

  useEffect(() => {
    if (!isActive) return;
    void refreshTradeCount({ requireReady: true });
  }, [isActive, refreshTradeCount]);

  const refreshEvents = useMemo<
    Array<'trade:changed' | 'backtest-trade:changed' | 'folder-path:changed'>
  >(
    () => ['trade:changed', 'backtest-trade:changed', 'folder-path:changed'],
    []
  );

  useEventBusMultiple(
    refreshEvents,
    () => void refreshTradeCount({ requireReady: false }),
    isActive && !!plugin?.tradeService
  );

  useEffect(() => {
    applyResolvedGuide(totalTradeCountRef.current, dashboardData);
  }, [applyResolvedGuide, dashboardData]);

  
  
  
  const reapplyResolvedGuide = useEffectEvent(() =>
    applyResolvedGuide(totalTradeCountRef.current, dashboardData)
  );
  useEffect(() => {
    const guideService = plugin?.viewGuideService;
    if (!isActive || !guideService) return;
    return guideService.subscribe(() => reapplyResolvedGuide());
  }, [isActive, plugin]);

  useEffect(() => {
    if (!isActive) return;
    isEditingRef.current = isEditing;
    applyResolvedGuide(totalTradeCountRef.current, dashboardData);
    if (isEditing) emitGuideAction(DASHBOARD_EDIT_MODE_ENABLED_ACTION_ID);
    else if (previousIsEditingRef.current) {
      emitGuideAction(DASHBOARD_EDIT_MODE_DISABLED_ACTION_ID);
    }
    previousIsEditingRef.current = isEditing;
  }, [applyResolvedGuide, dashboardData, emitGuideAction, isActive, isEditing]);

  useEffect(() => {
    if (isActive && showUnifiedSelector) {
      emitGuideAction(DASHBOARD_WIDGET_SELECTOR_OPENED_ACTION_ID);
    }
  }, [emitGuideAction, isActive, showUnifiedSelector]);

  return null;
};

interface DashboardBodyProps {
  plugin: JournalitPlugin;
  leaf: WorkspaceLeaf;
  modeToggle: React.ReactNode;
  filters: FilterState;
  activeMetrics: string[];
  activeWidgets: string[];
  handleFilterChange: (filters: FilterState) => void;
  toggleEditMode: () => void;
  openUnifiedSelector: () => void;
  closeUnifiedSelector: () => void;
  isActive: boolean;
  isLoading: boolean;
  isEditing: boolean;
  showUnifiedSelector: boolean;
}

const DashboardContentWrapper: React.FC<
  Omit<React.ComponentProps<typeof DashboardContent>, 'dashboardData'>
> = (props) => {
  const { dashboardData } = useDashboardData();
  return <DashboardContent {...props} dashboardData={dashboardData} />;
};






const DashboardBody: React.FC<DashboardBodyProps> = ({
  plugin,
  leaf,
  modeToggle,
  filters,
  activeMetrics,
  activeWidgets,
  handleFilterChange,
  toggleEditMode,
  openUnifiedSelector,
  closeUnifiedSelector,
  isActive,
  isLoading,
  isEditing,
  showUnifiedSelector,
}) => {
  
  const debouncedFilters = useDebounced(filters, 150);

  return (
    <DashboardDataProvider
      app={plugin.app}
      tradeService={plugin.tradeService}
      filters={debouncedFilters}
      defaultRiskAmount={plugin.settings.trade?.defaultRiskAmount}
      plugin={plugin}
      isActive={isActive}
    >
      <div className="journalit-dashboard-view-container journalit-dashboard-view--embedded">
        <div className="journalit-dashboard-view">
          <DashboardGuideCoordinator
            leaf={leaf}
            isActive={isActive}
            isEditing={isEditing}
            showUnifiedSelector={showUnifiedSelector}
          />
          <FilterControls
            filters={filters}
            onFilterChange={handleFilterChange}
            isEditing={isEditing}
            onToggleEditMode={toggleEditMode}
            onOpenAddWidget={openUnifiedSelector}
            modeToggle={modeToggle}
          />
          <DashboardContentWrapper
            isLoading={isLoading}
            filters={debouncedFilters}
            isEditing={isEditing}
            showUnifiedSelector={showUnifiedSelector}
            activeMetrics={activeMetrics}
            activeWidgets={activeWidgets}
            onCloseSelector={closeUnifiedSelector}
            openUnifiedSelector={openUnifiedSelector}
          />
        </div>
      </div>
    </DashboardDataProvider>
  );
};

interface DashboardPageProps {
  leaf: WorkspaceLeaf;
  isActive: boolean;
  modeToggle: React.ReactNode;
}




export const DashboardPage = React.memo(function DashboardPage({
  leaf,
  isActive,
  modeToggle,
}: DashboardPageProps) {
  const plugin = usePlugin();
  const currentGuideStepId = useGuideCurrentStepId();
  const suppressWidgetPickerAutoOpenRef = useRef(false);
  const {
    filters,
    isFiltersHydrated,
    isLoading,
    isEditing,
    showUnifiedSelector,
    activeMetrics,
    activeWidgets,
    handleFilterChange,
    toggleEditMode,
    openUnifiedSelector,
    closeUnifiedSelector,
    restoreGuideStepState,
  } = useDashboard();

  const handleGuideBack = useCallback(
    ({
      fromStepId,
      toStepId,
      guideId,
    }: {
      fromStepId: string;
      toStepId: string;
      guideId: string;
    }) => {
      if (
        guideId !== DASHBOARD_MAIN_GUIDE_ID &&
        guideId !== DASHBOARD_EMPTY_GUIDE_ID &&
        guideId !== DASHBOARD_CUSTOMIZE_GUIDE_ID
      ) {
        return;
      }
      if (
        fromStepId === 'widget-picker' &&
        toStepId === 'open-widget-selector'
      ) {
        suppressWidgetPickerAutoOpenRef.current = true;
      }
      return restoreGuideStepState({ fromStepId, toStepId });
    },
    [restoreGuideStepState]
  );

  useGuideBackHandler(isActive ? handleGuideBack : null);

  useEffect(() => {
    if (!isActive) return;
    if (currentGuideStepId !== 'widget-picker') {
      suppressWidgetPickerAutoOpenRef.current = false;
    }
    if (currentGuideStepId === 'widget-picker' && !showUnifiedSelector) {
      if (!suppressWidgetPickerAutoOpenRef.current) openUnifiedSelector();
      return;
    }
    if (
      (currentGuideStepId === 'save-layout' ||
        currentGuideStepId === 'open-widget-selector' ||
        currentGuideStepId === 'metrics-section') &&
      showUnifiedSelector
    ) {
      closeUnifiedSelector();
    }
  }, [
    closeUnifiedSelector,
    currentGuideStepId,
    isActive,
    openUnifiedSelector,
    showUnifiedSelector,
  ]);

  if (!plugin || !isFiltersHydrated) {
    return <div className="journalit-dashboard-view">Loading…</div>;
  }

  return (
    <DashboardBody
      plugin={plugin}
      leaf={leaf}
      modeToggle={modeToggle}
      filters={filters}
      activeMetrics={activeMetrics}
      activeWidgets={activeWidgets}
      handleFilterChange={handleFilterChange}
      toggleEditMode={toggleEditMode}
      openUnifiedSelector={openUnifiedSelector}
      closeUnifiedSelector={closeUnifiedSelector}
      isActive={isActive}
      isLoading={isLoading}
      isEditing={isEditing}
      showUnifiedSelector={showUnifiedSelector}
    />
  );
});

DashboardPage.displayName = 'DashboardPage';
