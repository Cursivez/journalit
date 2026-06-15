

import React, { memo, useLayoutEffect } from 'react';
import { SkeletonBox } from '../shared/SkeletonBox';
import { SkeletonText } from '../shared/SkeletonText';
import { DashboardWidgetSkeleton } from '../dashboard/components/DashboardWidgets/DashboardWidgetSkeleton';
import { t } from '../../lang/helpers';

export const AccountPageSkeleton = memo(() => {
  useLayoutEffect(() => {
    return () => {};
  }, []);

  return (
    <div
      className="account-page-skeleton"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="journalit-skeleton-screenreader-status">
        {t('skeleton.account-page.loading')}
      </span>
      
      <div className="account-page-skeleton-header">
        <SkeletonText width="200px" height="24px" />
        <SkeletonText width="120px" height="16px" />
      </div>

      
      <div className="account-page-skeleton-chart">
        <DashboardWidgetSkeleton type="chart" announceLoading={false} />
      </div>

      
      <div className="account-page-skeleton-metrics">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="skeleton-metric-card">
            <SkeletonText width="80px" height="14px" />
            <SkeletonText width="100px" height="20px" />
          </div>
        ))}
      </div>

      
      <div className="account-page-skeleton-risk">
        <SkeletonText width="150px" height="18px" />
        <div className="skeleton-risk-visualizations">
          <SkeletonBox width="100%" height="120px" borderRadius="8px" />
          <SkeletonBox width="100%" height="120px" borderRadius="8px" />
        </div>
      </div>

      
      <div className="account-page-skeleton-transactions">
        <DashboardWidgetSkeleton type="table" announceLoading={false} />
      </div>

      
      <div className="account-page-skeleton-trades">
        <DashboardWidgetSkeleton type="table" announceLoading={false} />
      </div>
    </div>
  );
});

AccountPageSkeleton.displayName = 'AccountPageSkeleton';
