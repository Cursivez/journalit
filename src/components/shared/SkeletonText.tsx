

import React, { memo } from 'react';
import { cssVars } from '../../styles/inlineStylePolicy';
import { SkeletonBox } from './SkeletonBox';

interface SkeletonTextProps {
  width?: string | number;
  lines?: number;
  gap?: number;
  height?: string | number;
  className?: string;
}

export const SkeletonText = memo<SkeletonTextProps>(
  ({ width = '100%', lines = 1, gap = 8, height = '16px', className = '' }) => {
    if (lines === 1) {
      return (
        <SkeletonBox
          width={width}
          height={height}
          borderRadius="8px"
          className={className}
        />
      );
    }

    const cssWidth = typeof width === 'number' ? `${width}px` : width;

    return (
      <div
        className="journalit-skeleton-text-multi"
        style={cssVars({
          '--journalit-skeleton-text-gap': `${gap}px`,
          '--journalit-skeleton-text-width': cssWidth,
        })}
      >
        {Array.from({ length: lines }).map((_, idx) => (
          <SkeletonBox
            key={idx}
            width={idx === lines - 1 ? '60%' : '100%'}
            height={height}
            borderRadius="8px"
            className={className}
          />
        ))}
      </div>
    );
  }
);

SkeletonText.displayName = 'SkeletonText';
