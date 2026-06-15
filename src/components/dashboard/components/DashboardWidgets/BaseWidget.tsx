

import React, { useEffect } from 'react';
import { FilterState } from '../../DashboardView';
import { DashboardData } from '../../utils/dataUtils';
import { usePlugin } from '../../../../hooks';
import { getUserDateFormat } from '../../../../utils/dateUtils';
import { t } from '../../../../lang/helpers';
import { TradeFormModal } from '../../../forms/trade/TradeFormModal';
import { EmptyState } from '../../../shared';
import { useDashboardData } from '../../context/DashboardDataContext';
import { DashboardWidgetSkeleton } from './DashboardWidgetSkeleton';

export interface BaseWidgetProps {
  filters: FilterState;
  dateFormat?: string; 
  skeletonType?:
    | 'chart'
    | 'area-chart'
    | 'line-chart'
    | 'bar-chart'
    | 'table'
    | 'calendar';
}


export const BaseWidget: React.FC<
  BaseWidgetProps & {
    children: (data: DashboardData, dateFormat: string) => React.ReactNode;
  }
> = ({ filters: _filters, dateFormat, skeletonType = 'chart', children }) => {
  const plugin = usePlugin();

  
  const { dashboardData, error } = useDashboardData();

  
  const userDateFormat = dateFormat || getUserDateFormat();

  
  useEffect(() => {
    
    const loadStyles = async () => {};

    void loadStyles();
  }, []);

  
  

  
  return (
    <div className="journalit-dashboard-widget-container">
      {!dashboardData && !error ? (
        <DashboardWidgetSkeleton type={skeletonType} />
      ) : error ? (
        <div className="journalit-dashboard-widget-error">
          {(typeof error === 'string' ? error : error?.message) ||
            t('dashboard.error.load-failed')}
        </div>
      ) : !dashboardData || dashboardData.trades.length === 0 ? (
        <div className="journalit-dashboard-widget-body">
          <EmptyState
            message={t('widget.empty.no-data')}
            subMessage={t('dashboard.empty.filter-hint')}
            iconSize={40}
            actionButtonText={t('button.add-trade')}
            onActionButtonClick={() => {
              
              if (!plugin || !plugin.app) return;

              
              const modal = new TradeFormModal({ app: plugin.app, plugin });
              modal.open();
            }}
          />
        </div>
      ) : (
        <div className="journalit-dashboard-widget-body">
          {children(dashboardData, userDateFormat)}
        </div>
      )}
    </div>
  );
};
