

import React, { memo } from 'react';
import { SkeletonBox } from './SkeletonBox';

interface SkeletonCircleProps {
  size?: number;
  className?: string;
}

export const SkeletonCircle = memo<SkeletonCircleProps>(
  ({ size = 24, className = '' }) => {
    return (
      <SkeletonBox
        width={size}
        height={size}
        borderRadius="50%"
        className={className}
      />
    );
  }
);

SkeletonCircle.displayName = 'SkeletonCircle';
