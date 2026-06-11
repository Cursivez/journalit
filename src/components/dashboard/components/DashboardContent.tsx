

import React from 'react';
import { EmptyState } from '../../shared/EmptyState';
import { TopSection } from './TopSection';
import { BottomSection } from './BottomSection';
import { UnifiedComponentSelector } from './UnifiedComponentSelector';
import { FilterState } from '../DashboardView';
import { DashboardData } from '../utils/dataUtils';
import { TradeFormModal } from '../../forms/trade/TradeFormModal';
import { usePlugin } from '../../../hooks/usePlugin';
import { t } from '../../../lang/helpers';
import { useGuideTarget } from '../../../guides/GuideRuntimeLayer';
import {
  DASHBOARD_BOTTOM_SECTION_TARGET_ID,
  DASHBOARD_EMPTY_STATE_TARGET_ID,
  DASHBOARD_METRICS_SECTION_TARGET_ID,
} from '../../../guides/dashboardGuideIds';

interface DashboardContentProps {
  isLoading: boolean;
  dashboardData: DashboardData | null;
  filters: FilterState;
  isEditing: boolean;
  showUnifiedSelector: boolean;
  activeMetrics: string[];
  activeWidgets: string[];
  onAddMetric: (metricId: string) => void;
  onAddWidget: (widgetId: string) => void;
  onCloseSelector: () => void;
  openUnifiedSelector: () => void;
}

const GuideTargetContainer: React.FC<{
  targetId: string;
  className: string;
  children: React.ReactNode;
}> = ({ targetId, className, children }) => {
  const registerTarget = useGuideTarget(targetId);

  return (
    <div className={className} ref={registerTarget}>
      {children}
    </div>
  );
};

const DashboardEmptyStateGuideTarget: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const registerTarget = useGuideTarget(DASHBOARD_EMPTY_STATE_TARGET_ID);

  return (
    <div className="journalit-dashboard-empty-container" ref={registerTarget}>
      {children}
    </div>
  );
};

export const DashboardContent: React.FC<DashboardContentProps> = React.memo(
  ({
    isLoading,
    dashboardData,
    filters,
    isEditing,
    showUnifiedSelector,
    activeMetrics,
    activeWidgets,
    onAddMetric,
    onAddWidget,
    onCloseSelector,
    openUnifiedSelector: _openUnifiedSelector,
  }) => {
    const plugin = usePlugin();

    
    const handleOpenTradeForm = () => {
      if (!plugin || !plugin.app) return;
      const modal = new TradeFormModal({ app: plugin.app, plugin });
      modal.open();
    };

    
    if (!isLoading && dashboardData && dashboardData.trades.length === 0) {
      return (
        <DashboardEmptyStateGuideTarget>
          <EmptyState
            message={t('dashboard.empty.message')}
            subMessage={t('dashboard.empty.submessage')}
            iconSize={56}
            actionButtonText={t('button.add-trade')}
            onActionButtonClick={handleOpenTradeForm}
          />
        </DashboardEmptyStateGuideTarget>
      );
    }

    return (
      <>
        
        <div className="journalit-dashboard-unified-container">
          
          <GuideTargetContainer
            className="journalit-dashboard-section-wrapper"
            targetId={DASHBOARD_METRICS_SECTION_TARGET_ID}
          >
            <TopSection
              filters={filters}
              isEditing={isEditing}
              hideAddButton={true}
            />
          </GuideTargetContainer>

          
          <GuideTargetContainer
            className="journalit-dashboard-section-wrapper"
            targetId={DASHBOARD_BOTTOM_SECTION_TARGET_ID}
          >
            <BottomSection
              filters={filters}
              isEditing={isEditing}
              hideAddButton={true}
            />
          </GuideTargetContainer>
        </div>

        
        {showUnifiedSelector && (
          <UnifiedComponentSelector
            activeMetrics={activeMetrics}
            activeWidgets={activeWidgets}
            onAddMetric={onAddMetric}
            onAddWidget={onAddWidget}
            onClose={onCloseSelector}
          />
        )}
      </>
    );
  }
);

DashboardContent.displayName = 'DashboardContent';
