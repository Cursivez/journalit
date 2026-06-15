

import React, { memo, useLayoutEffect } from 'react';
import { SkeletonText } from '../../shared/SkeletonText';
import { SkeletonCircle } from '../../shared/SkeletonCircle';
import { DashboardWidgetSkeleton } from '../../dashboard/components/DashboardWidgets/DashboardWidgetSkeleton';
import { t } from '../../../lang/helpers';

export const AccountDashboardSkeleton = memo(() => {
  useLayoutEffect(() => {
    return () => {};
  }, []);

  return (
    <div
      className="account-dashboard-skeleton"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="journalit-skeleton-screenreader-status">
        {t('common.loading')}
      </span>
      
      <div className="account-dashboard-skeleton-header">
        <div className="account-dashboard-skeleton-header-copy">
          <SkeletonText width="200px" height="28px" />
          <SkeletonText width="320px" height="14px" />
        </div>
        <div className="skeleton-header-actions">
          <SkeletonCircle size={32} />
          <SkeletonCircle size={32} />
        </div>
      </div>

      
      <div className="account-dashboard-skeleton-aum">
        <DashboardWidgetSkeleton type="chart" announceLoading={false} />
      </div>

      
      <div className="account-dashboard-skeleton-metrics">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="skeleton-metric-card">
            <SkeletonText width="100px" height="14px" />
            <SkeletonText width="120px" height="20px" />
          </div>
        ))}
      </div>

      
      <div className="account-dashboard-skeleton-weights">
        <DashboardWidgetSkeleton type="chart" announceLoading={false} />
      </div>

      
      <div className="account-dashboard-skeleton-sections">
        <SkeletonText width="120px" height="18px" />
        <div className="skeleton-account-cards">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="skeleton-account-card">
              <SkeletonText width="150px" height="16px" />
              <SkeletonText width="100px" height="24px" />
              <div className="skeleton-account-card-metrics">
                <SkeletonText width="60px" height="12px" />
                <SkeletonText width="60px" height="12px" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

AccountDashboardSkeleton.displayName = 'AccountDashboardSkeleton';
