

import React, { memo, useLayoutEffect } from 'react';
import { SkeletonBox } from '../../../shared/SkeletonBox';
import { ChartSkeleton } from '../../../shared/ChartSkeleton';
import { t } from '../../../../lang/helpers';

interface DashboardWidgetSkeletonProps {
  type:
    | 'chart'
    | 'area-chart'
    | 'line-chart'
    | 'bar-chart'
    | 'table'
    | 'calendar';
  announceLoading?: boolean;
}

const DashboardWidgetSkeletonBody: React.FC<{
  type: DashboardWidgetSkeletonProps['type'];
}> = ({ type }) => {
  switch (type) {
    case 'chart':
    case 'area-chart':
    case 'line-chart':
    case 'bar-chart':
      return (
        <div className="dashboard-widget-skeleton-chart">
          <ChartSkeleton
            variant={
              type === 'bar-chart'
                ? 'bar'
                : type === 'line-chart'
                  ? 'line'
                  : 'area'
            }
          />
        </div>
      );

    case 'table':
      return (
        <div className="dashboard-widget-skeleton-table">
          
          <div className="skeleton-table-header">
            {['first', 'second', 'third', 'fourth'].map((key) => (
              <SkeletonBox key={key} width="60px" height="14px" />
            ))}
          </div>
          
          {['first', 'second', 'third', 'fourth', 'fifth'].map((rowKey) => (
            <div key={rowKey} className="skeleton-table-row">
              {['first', 'second', 'third', 'fourth'].map((cellKey) => (
                <SkeletonBox key={cellKey} width="50px" height="12px" />
              ))}
            </div>
          ))}
        </div>
      );

    case 'calendar':
      return (
        <div className="dashboard-widget-skeleton-calendar">
          <div className="skeleton-calendar-grid">
            
            {Array.from({ length: 35 }).map((_, idx) => (
              <SkeletonBox
                key={idx}
                width="100%"
                height="40px"
                borderRadius="4px"
              />
            ))}
          </div>
        </div>
      );

    default:
      return <SkeletonBox width="100%" height="400px" />;
  }
};

export const DashboardWidgetSkeleton = memo<DashboardWidgetSkeletonProps>(
  ({ type, announceLoading = true }) => {
    useLayoutEffect(() => {
      return () => {};
    }, []);

    return (
      <div
        className="dashboard-widget-skeleton"
        role={announceLoading ? 'status' : undefined}
        aria-live={announceLoading ? 'polite' : undefined}
      >
        {announceLoading && (
          <span className="journalit-skeleton-screenreader-status">
            {t('skeleton.dashboard-widget.loading')}
          </span>
        )}
        <DashboardWidgetSkeletonBody type={type} />
      </div>
    );
  }
);

DashboardWidgetSkeleton.displayName = 'DashboardWidgetSkeleton';
