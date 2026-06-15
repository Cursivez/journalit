

import React, { memo, useLayoutEffect, useMemo } from 'react';
import { SkeletonBox } from '../shared/SkeletonBox';
import { SkeletonText } from '../shared/SkeletonText';
import { SkeletonCircle } from '../shared/SkeletonCircle';
import type { ColumnDefinition } from './columnConfig';
import { t } from '../../lang/helpers';
import { cssVars } from '../../styles/inlineStylePolicy';

interface TradeLogSkeletonProps {
  visibleColumns: ColumnDefinition[];
  gridTemplate: string;
  containerHeight?: number;
}

const SKELETON_ROW_KEYS = Array.from(
  { length: 20 },
  (_, index) => `trade-log-skeleton-row-${index}`
);

function TradeLogSkeletonCell({ columnId }: { columnId: string }) {
  switch (columnId) {
    case 'select':
      return <SkeletonCircle size={16} />;
    case 'image':
      return <SkeletonBox width={40} height={40} />;
    case 'ticker':
      return <SkeletonText width="80px" />;
    case 'direction':
      return <SkeletonText width="60px" />;
    case 'status':
      return <SkeletonText width="60px" />;
    case 'pnl':
      return <SkeletonText width="70px" />;
    case 'duration':
      return <SkeletonText width="50px" />;
    case 'date':
      return <SkeletonText width="70px" />;
    case 'account':
      return <SkeletonText width="60px" />;
    case 'reviewed':
      return <SkeletonCircle size={16} />;
    case 'positionSize':
      return <SkeletonText width="60px" />;
    case 'mistakes':
      return <SkeletonText width="40px" />;
    case 'setups':
      return <SkeletonText width="40px" />;
    case 'thesis':
    case 'mtComment':
      return <SkeletonText width="80%" />;
    default:
      return <SkeletonText width="50px" />;
  }
}

export const TradeLogSkeleton = memo<TradeLogSkeletonProps>(
  ({ visibleColumns, gridTemplate, containerHeight = 600 }) => {
    useLayoutEffect(() => {
      return () => {};
    }, []);

    const rowCount = useMemo(() => {
      return Math.min(Math.ceil(containerHeight / 48), 20);
    }, [containerHeight]);

    return (
      <div
        className="trade-log-skeleton"
        role="status"
        aria-live="polite"
        aria-busy="true"
        style={cssVars({
          '--journalit-tradelog-skeleton-grid-template': gridTemplate,
        })}
      >
        <span className="journalit-skeleton-screenreader-status">
          {t('skeleton.tradelog.loading')}
        </span>
        
        <div className="skeleton-header-row">
          {visibleColumns.map((col) => (
            <div key={col.id} className="skeleton-header-cell">
              <SkeletonText
                width={`${Math.min(col.width || 120, 100)}px`}
                height="14px"
              />
            </div>
          ))}
        </div>

        
        {SKELETON_ROW_KEYS.slice(0, rowCount).map((rowKey) => (
          <div key={rowKey} className="skeleton-data-row">
            {visibleColumns.map((col) => (
              <div key={col.id} className="skeleton-data-cell">
                <TradeLogSkeletonCell columnId={col.id} />
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }
);

TradeLogSkeleton.displayName = 'TradeLogSkeleton';
