

import React, { memo, useMemo } from 'react';
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

const circleCell = () => <SkeletonCircle size={16} />;
const textCell = (width: string) => () => <SkeletonText width={width} />;


const SKELETON_CELL_BY_COLUMN = new Map<string, () => React.ReactElement>(
  Object.entries({
    select: circleCell,
    image: () => <SkeletonBox width={40} height={40} />,
    ticker: textCell('80px'),
    direction: textCell('60px'),
    status: textCell('60px'),
    pnl: textCell('70px'),
    duration: textCell('50px'),
    date: textCell('70px'),
    account: textCell('60px'),
    reviewed: circleCell,
    tradeRating: textCell('64px'),
    positionSize: textCell('60px'),
    mistakes: textCell('40px'),
    setups: textCell('40px'),
    thesis: textCell('80%'),
    mtComment: textCell('80%'),
  })
);
const defaultSkeletonCell = textCell('50px');

function TradeLogSkeletonCell({ columnId }: { columnId: string }) {
  const renderCell =
    SKELETON_CELL_BY_COLUMN.get(columnId) ?? defaultSkeletonCell;
  return renderCell();
}

export const TradeLogSkeleton = memo<TradeLogSkeletonProps>(
  ({ visibleColumns, gridTemplate, containerHeight = 600 }) => {
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
