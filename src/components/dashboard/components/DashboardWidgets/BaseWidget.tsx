

import React, { useMemo } from 'react';
import { FilterState } from '../../DashboardView';
import { DashboardData } from '../../utils/dataUtils';
import { usePlugin } from '../../../../hooks/usePlugin';
import { getUserDateFormat } from '../../../../utils/dateUtils';
import { t } from '../../../../lang/helpers';
import { TradeFormDrawer } from '../../../forms/trade/TradeFormDrawer';
import { EmptyState } from '../../../shared/EmptyState';
import { useDashboardData } from '../../context/DashboardDataContext';
import { DashboardWidgetSkeleton } from './DashboardWidgetSkeleton';
import { useWidgetDataTurn } from './widgetDataTurns';

export interface BaseWidgetProps {
  dateFormat?: string; 
  skeletonType?: React.ComponentProps<typeof DashboardWidgetSkeleton>['type'];
}


export const BaseWidget: React.FC<
  BaseWidgetProps & {
    
    tradeSource?: 'trades' | 'excursionTrades';
    
    children: (
      data: DashboardData,
      dateFormat: string,
      filters: FilterState
    ) => React.ReactNode;
  }
> = ({
  dateFormat,
  skeletonType = 'chart',
  tradeSource = 'trades',
  children,
}) => {
  const plugin = usePlugin();

  
  
  
  
  
  
  const { dashboardSnapshot, error } = useDashboardData();
  const snapshot = useWidgetDataTurn(dashboardSnapshot);

  
  const userDateFormat = dateFormat || getUserDateFormat();

  
  

  
  return useMemo(
    () => (
      <div className="journalit-dashboard-widget-container">
        {!snapshot && !error ? (
          <DashboardWidgetSkeleton type={skeletonType} />
        ) : error ? (
          <div className="journalit-dashboard-widget-error">
            {(typeof error === 'string' ? error : error?.message) ||
              t('dashboard.error.load-failed')}
          </div>
        ) : !snapshot || (snapshot.data[tradeSource]?.length ?? 0) === 0 ? (
          <div className="journalit-dashboard-widget-body">
            <EmptyState
              message={t('widget.empty.no-data')}
              subMessage={t('dashboard.empty.filter-hint')}
              iconSize={40}
              actionButtonText={t('button.add-trade')}
              onActionButtonClick={() => {
                
                if (!plugin || !plugin.app) return;

                
                const drawer = new TradeFormDrawer({ app: plugin.app, plugin });
                drawer.open();
              }}
            />
          </div>
        ) : (
          <div className="journalit-dashboard-widget-body">
            {children(snapshot.data, userDateFormat, snapshot.filters)}
          </div>
        )}
      </div>
    ),
    [
      snapshot,
      error,
      skeletonType,
      tradeSource,
      plugin,
      children,
      userDateFormat,
    ]
  );
};
