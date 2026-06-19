

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { WorkspaceLeaf } from 'obsidian';
import { t } from '../../lang/helpers';
import { ReactView } from '../../views/ReactView';
import { RenderFunction } from '../../views/types';
import { FilterControls } from './components/FilterControls';
import { DashboardContent } from './components/DashboardContent';
import { useDashboard } from './hooks';
import {
  DashboardDataProvider,
  useDashboardData,
} from './context/DashboardDataContext';
import { usePlugin } from '../../hooks/usePlugin';
import { useLeafActive } from '../../hooks/useLeafActive';
import { TradeType, TradeStatus } from '../../services/tradelog/types';
import type {
  DirectionFilter,
  ReviewStatusFilter,
} from '../../services/tradelog/types';
import type { CustomFieldFilterSelections } from '../../types/customFields';
import { useEventBusMultiple } from '../../hooks/useEventBus';
import {
  useGuideAction,
  useGuideBackHandler,
  useGuideCurrentStepId,
} from '../../guides/GuideRuntimeLayer';
import {
  DASHBOARD_EDIT_MODE_DISABLED_ACTION_ID,
  DASHBOARD_EDIT_MODE_ENABLED_ACTION_ID,
  DASHBOARD_EMPTY_GUIDE_ID,
  DASHBOARD_MAIN_GUIDE_ID,
  DASHBOARD_WIDGET_SELECTOR_OPENED_ACTION_ID,
} from '../../guides/dashboardGuideIds';


export interface FilterState {
  dateRange: [Date | null, Date | null];
  accounts: string[];
  tickers: string[];
  setups: string[];
  tags: string[];
  mistakes: string[];
  tradeTypes: TradeType[];
  statuses: TradeStatus[];
  reviewStatus: ReviewStatusFilter[];
  directions: DirectionFilter[];
  customFieldFilters: CustomFieldFilterSelections;
}


export const DASHBOARD_VIEW_TYPE = 'journalit-dashboard-view';








export class DashboardView extends ReactView {
  
  getDisplayText(): string {
    return t('dashboard.title');
  }

  
  getViewType(): string {
    return DASHBOARD_VIEW_TYPE;
  }

  
  getIcon(): string {
    return 'grip';
  }

  
  async onOpen(): Promise<void> {
    try {
      
      
      

      
      
      await super.onOpen();

      
      if (this.containerEl) {
        this.containerEl.classList.add('journalit-dashboard-view-container');
      }
    } catch (error) {
      console.error('Error in DashboardView.onOpen:', error);
    }
  }

  
  async onClose(): Promise<void> {
    try {
      
      

      
      await super.onClose();
    } catch (error) {
      console.error('Error in DashboardView.onClose:', error);
    }
  }

  
  protected getRenderFunction(): RenderFunction {
    const DashboardViewRender = () => (
      <DashboardComponent leaf={this.leaf} view={this} />
    );
    DashboardViewRender.displayName = 'DashboardViewRender';
    return DashboardViewRender;
  }
}

interface DashboardGuideCoordinatorProps {
  leaf: WorkspaceLeaf;
  isEditing: boolean;
  showUnifiedSelector: boolean;
}

const DashboardGuideCoordinator: React.FC<DashboardGuideCoordinatorProps> = ({
  leaf,
  isEditing,
  showUnifiedSelector,
}) => {
  const plugin = usePlugin();
  const { dashboardData } = useDashboardData();
  const emitGuideAction = useGuideAction();
  const previousIsEditingRef = useRef(isEditing);
  const [totalTradeCount, setTotalTradeCount] = useState<number | null>(null);

  const refreshTradeCount = useCallback(
    async ({
      requireReady,
      ignoreUnmount,
    }: {
      requireReady: boolean;
      ignoreUnmount?: () => boolean;
    }) => {
      if (!plugin?.tradeService) {
        return;
      }

      try {
        if (requireReady) {
          await plugin.tradeService.waitForTradeDataReady();
        }

        const count = await plugin.tradeService.getTradeCount();
        if (!ignoreUnmount || !ignoreUnmount()) {
          setTotalTradeCount(count);
        }
      } catch (error) {
        console.error(
          requireReady
            ? '[DashboardGuideCoordinator] Failed to resolve trade count:'
            : '[DashboardGuideCoordinator] Failed to refresh trade count:',
          error
        );
      }
    },
    [plugin]
  );

  useEffect(() => {
    let isUnmounted = false;

    void refreshTradeCount({
      requireReady: true,
      ignoreUnmount: () => isUnmounted,
    });

    return () => {
      isUnmounted = true;
    };
  }, [refreshTradeCount]);

  const refreshEvents = useMemo<
    Array<'trade:changed' | 'backtest-trade:changed' | 'folder-path:changed'>
  >(
    () => ['trade:changed', 'backtest-trade:changed', 'folder-path:changed'],
    []
  );

  useEventBusMultiple(
    refreshEvents,
    () => {
      void refreshTradeCount({ requireReady: false });
    },
    !!plugin?.tradeService
  );

  const resolvedGuideId = useMemo(() => {
    if (!dashboardData || totalTradeCount === null) {
      return null;
    }

    if (totalTradeCount === 0 && dashboardData.trades.length === 0) {
      return DASHBOARD_EMPTY_GUIDE_ID;
    }

    if (totalTradeCount > 0 && dashboardData.trades.length > 0) {
      return DASHBOARD_MAIN_GUIDE_ID;
    }

    return null;
  }, [dashboardData, totalTradeCount]);

  useEffect(() => {
    if (!plugin?.viewGuideService) {
      return;
    }

    const activeSession = plugin.viewGuideService.getSessionForLeaf(
      leaf,
      DASHBOARD_VIEW_TYPE
    );

    if (
      activeSession &&
      resolvedGuideId &&
      activeSession.guideId !== resolvedGuideId
    ) {
      void plugin.viewGuideService.clearGuideState(activeSession.guideId);
    }

    plugin.viewGuideService.setResolvedGuideForLeaf(leaf, resolvedGuideId);
  }, [leaf, plugin, resolvedGuideId]);

  useEffect(() => {
    return () => {
      plugin?.viewGuideService?.setResolvedGuideForLeaf(leaf, null);
    };
  }, [leaf, plugin]);

  useEffect(() => {
    if (isEditing) {
      emitGuideAction(DASHBOARD_EDIT_MODE_ENABLED_ACTION_ID);
    } else if (previousIsEditingRef.current) {
      emitGuideAction(DASHBOARD_EDIT_MODE_DISABLED_ACTION_ID);
    }

    previousIsEditingRef.current = isEditing;
  }, [emitGuideAction, isEditing]);

  useEffect(() => {
    if (!showUnifiedSelector) {
      return;
    }

    emitGuideAction(DASHBOARD_WIDGET_SELECTOR_OPENED_ACTION_ID);
  }, [emitGuideAction, showUnifiedSelector]);

  return null;
};


const DashboardComponent: React.FC<{
  leaf: WorkspaceLeaf;
  view: DashboardView;
}> = function DashboardComponent({ leaf, view: _view }) {
  const plugin = usePlugin();
  const isActive = useLeafActive(leaf);
  const currentGuideStepId = useGuideCurrentStepId();
  const suppressWidgetPickerAutoOpenRef = useRef(false);

  
  const {
    filters,
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
    handleAddMetric,
    handleAddWidget,
  } = useDashboard();

  const handleGuideBack = useCallback(
    ({ fromStepId, toStepId }: { fromStepId: string; toStepId: string }) => {
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

  useGuideBackHandler(handleGuideBack);

  useEffect(() => {
    if (currentGuideStepId !== 'widget-picker') {
      suppressWidgetPickerAutoOpenRef.current = false;
    }

    if (currentGuideStepId === 'widget-picker' && !showUnifiedSelector) {
      if (!suppressWidgetPickerAutoOpenRef.current) {
        openUnifiedSelector();
      }
      return;
    }

    if (
      (currentGuideStepId === 'open-widget-selector' ||
        currentGuideStepId === 'metrics-section') &&
      showUnifiedSelector
    ) {
      closeUnifiedSelector();
    }
  }, [
    closeUnifiedSelector,
    currentGuideStepId,
    openUnifiedSelector,
    showUnifiedSelector,
  ]);

  
  if (!plugin) {
    return <div className="journalit-dashboard-view">Loading…</div>;
  }

  return (
    <DashboardDataProvider
      app={plugin.app}
      tradeService={plugin.tradeService}
      filters={filters}
      defaultRiskAmount={plugin?.settings?.trade?.defaultRiskAmount}
      plugin={plugin}
      isActive={isActive}
    >
      <div className="journalit-dashboard-view">
        <DashboardGuideCoordinator
          leaf={leaf}
          isEditing={isEditing}
          showUnifiedSelector={showUnifiedSelector}
        />

        
        <FilterControls
          filters={filters}
          onFilterChange={handleFilterChange}
          isEditing={isEditing}
          onToggleEditMode={toggleEditMode}
          onOpenAddWidget={openUnifiedSelector}
        />

        
        <DashboardContentWrapper
          isLoading={isLoading}
          filters={filters}
          isEditing={isEditing}
          showUnifiedSelector={showUnifiedSelector}
          activeMetrics={activeMetrics}
          activeWidgets={activeWidgets}
          onAddMetric={handleAddMetric}
          onAddWidget={handleAddWidget}
          onCloseSelector={closeUnifiedSelector}
          openUnifiedSelector={openUnifiedSelector}
        />
      </div>
    </DashboardDataProvider>
  );
};


const DashboardContentWrapper: React.FC<
  Omit<React.ComponentProps<typeof DashboardContent>, 'dashboardData'>
> = (props) => {
  const { dashboardData } = useDashboardData();

  return <DashboardContent {...props} dashboardData={dashboardData} />;
};
