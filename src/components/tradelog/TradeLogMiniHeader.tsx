

import React, { useLayoutEffect } from 'react';
import { ColumnDefinition, getColumnLabel } from './columnConfig';
import { cssVars } from '../../styles/inlineStylePolicy';

interface TradeLogMiniHeaderProps {
  visibleColumns: ColumnDefinition[];
  gridTemplate: string;
  depth: number;
  isMultiSelectMode?: boolean;
}

export const TradeLogMiniHeader = React.memo<TradeLogMiniHeaderProps>(
  ({ visibleColumns, gridTemplate, depth }) => {
    useLayoutEffect(() => {
      return () => {};
    }, []);

    const depthOffset = `${depth * 24}px`;

    return (
      <div
        className="trade-log-mini-header"
        style={cssVars({
          '--journalit-tree-structure-width': depthOffset,
          '--journalit-tradelog-mini-grid-template': gridTemplate,
        })}
      >
        
        <div className="tree-structure" />

        
        <div className="mini-header-row">
          
          <div className="tree-indicator-cell-header" />

          
          {visibleColumns.map((col) => {
            const label = getColumnLabel(col);
            const isMoneyColumn = col.id === 'fees' || col.id === 'dividends';

            return (
              <div
                key={col.id}
                className={`mini-header-cell header-${col.id} ${isMoneyColumn ? 'header-money-cell' : ''}`}
              >
                {label}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

TradeLogMiniHeader.displayName = 'TradeLogMiniHeader';
