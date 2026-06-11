

import React, { memo } from 'react';
import { cssVars } from '../../styles/inlineStylePolicy';

interface SkeletonBoxProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
}

export const SkeletonBox = memo<SkeletonBoxProps>(
  ({
    width = '100%',
    height = '20px',
    borderRadius = '4px',
    className = '',
  }) => {
    const cssWidth = typeof width === 'number' ? `${width}px` : width;
    const cssHeight = typeof height === 'number' ? `${height}px` : height;
    const cssRadius =
      typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius;

    return (
      <div
        className={`skeleton-shimmer ${className}`.trim()}
        style={cssVars({
          '--journalit-skeleton-width': cssWidth,
          '--journalit-skeleton-height': cssHeight,
          '--journalit-skeleton-radius': cssRadius,
        })}
        aria-hidden="true"
      />
    );
  }
);

SkeletonBox.displayName = 'SkeletonBox';
