import React from 'react';
import { SkeletonBox } from '../../shared/SkeletonBox';
import { SkeletonText } from '../../shared/SkeletonText';

export const CurrentStreakSkeletonContent: React.FC = () => (
  <>
    <div className="journalit-home-streak__skeleton-header">
      <SkeletonText width="70px" height="11px" />
      <SkeletonBox width={12} height={12} borderRadius="3px" />
    </div>
    <div className="journalit-home-streak__hero journalit-home-streak__hero--skeleton">
      <SkeletonBox width={24} height={24} borderRadius="50%" />
      <SkeletonBox width={48} height={36} borderRadius="8px" />
      <SkeletonText width="100px" height="14px" />
      <SkeletonText width="120px" height="12px" />
    </div>
  </>
);

export const CurrentStreakLoading: React.FC = () => (
  <div className="journalit-home-streak journalit-home-streak--loading">
    <CurrentStreakSkeletonContent />
  </div>
);
