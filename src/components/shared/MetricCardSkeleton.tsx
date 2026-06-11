

import React, { memo } from 'react';
import { SkeletonText } from './SkeletonText';

export const MetricCardSkeleton = memo(() => {
  return (
    <div className="metric-card-skeleton" aria-hidden="true">
      
      <div className="metric-card-skeleton-label">
        <SkeletonText width="80px" height="14px" />
      </div>

      
      <SkeletonText width="120px" height="24px" />
    </div>
  );
});

MetricCardSkeleton.displayName = 'MetricCardSkeleton';
