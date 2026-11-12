

import React, { useMemo, useState } from 'react';
import { FilterState } from '../../DashboardView';
import { DashboardData } from '../../utils/dataUtils';
import { usePlugin } from '../../../../hooks/usePlugin';
import { getUserDateFormat } from '../../../../utils/dateUtils';
import { t } from '../../../../lang/helpers';
import { TradeFormDrawer } from '../../../forms/trade/TradeFormDrawer';
import { EmptyState } from '../../../shared/EmptyState';
import {
  useDashboardCompareData,
  useDashboardData,
} from '../../context/DashboardDataContext';
import { DashboardWidgetSkeleton } from './DashboardWidgetSkeleton';
import { useWidgetDataTurn } from './widgetDataTurns';
import { sameDateRange } from '../../compare/dashboardComparison';


export interface WidgetCompare {
  data: DashboardData;
  filters: FilterState;
}

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
      filters: FilterState,
      compare: WidgetCompare | null
    ) => React.ReactNode;
  }
> = ({
  dateFormat,
  skeletonType = 'chart',
  tradeSource = 'trades',
  children,
}) => {
  const plugin = usePlugin();

  
  
  
  
  
  
  const { dashboardSnapshot, error: dataError } = useDashboardData();
  
  
  
  const compareSource = useDashboardCompareData();
  const comparing = compareSource !== null;
  const compareSnapshot = compareSource?.dashboardSnapshot ?? null;
  const candidate = useMemo(
    () =>
      !comparing
        ? { snapshot: dashboardSnapshot, compare: null }
        : !dashboardSnapshot || !compareSnapshot
          ? null
          : sameDateRange(dashboardSnapshot.filters, compareSnapshot.filters)
            ? { snapshot: dashboardSnapshot, compare: compareSnapshot }
            : undefined,
    [comparing, compareSnapshot, dashboardSnapshot]
  );
  const [latest, setLatest] = useState(candidate ?? null);
  if (candidate !== undefined && candidate !== latest) setLatest(candidate);
  const shown = useWidgetDataTurn(latest);
  const snapshot = shown?.snapshot ?? null;
  const compare = shown?.compare ?? null;
  const error = dataError ?? compareSource?.error ?? null;
  const tradeCount =
    (snapshot?.data[tradeSource]?.length ?? 0) +
    (compare?.data[tradeSource]?.length ?? 0);

  
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
        ) : !snapshot || tradeCount === 0 ? (
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
            {children(snapshot.data, userDateFormat, snapshot.filters, compare)}
          </div>
        )}
      </div>
    ),
    [
      snapshot,
      compare,
      tradeCount,
      error,
      skeletonType,
      plugin,
      children,
      userDateFormat,
    ]
  );
};
