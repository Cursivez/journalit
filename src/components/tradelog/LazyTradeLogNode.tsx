

import React, { useRef, useState, useEffect, memo } from 'react';
import { TimeNode } from '../../services/tradelog/types';
import { TradeLogNode } from './TradeLogNode';
import { ColumnDefinition } from './columnConfig';
import { cssVars } from '../../styles/inlineStylePolicy';

interface LazyTradeLogNodeProps {
  node: TimeNode;
  depth: number;
  isExpanded: boolean;
  isLastChild?: boolean;
  onToggleExpand: (node: TimeNode) => void;
  onNodeClick: (node: TimeNode) => void;
  viewLevel?: 'years' | 'quarters' | 'months' | 'weeks' | 'days' | 'trades';
  height?: number;
  visibleColumns?: ColumnDefinition[];
  gridTemplate?: string;
  selectedTrades?: Set<string>;
  onToggleTradeSelection?: (tradeId: string) => void;
  isMultiSelectMode?: boolean;
  isExpandedMode?: boolean;
}


let sharedObserver: IntersectionObserver | null = null;
const observerCallbacks = new WeakMap<Element, () => void>();

const getSharedObserver = () => {
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const callback = observerCallbacks.get(entry.target);
            if (callback) {
              callback();
              sharedObserver?.unobserve(entry.target);
              observerCallbacks.delete(entry.target);
            }
          }
        });
      },
      {
        
        rootMargin: '300px 0px',
        threshold: 0,
      }
    );
  }
  return sharedObserver;
};

export const LazyTradeLogNode = memo<LazyTradeLogNodeProps>(
  ({
    node,
    depth,
    isExpanded,
    isLastChild,
    onToggleExpand,
    onNodeClick,
    viewLevel,
    visibleColumns,
    gridTemplate,
    selectedTrades,
    onToggleTradeSelection,
    isMultiSelectMode,
    isExpandedMode,
  }) => {
    const [isVisible, setIsVisible] = useState(false);
    const placeholderRef = useRef<HTMLDivElement>(null);

    
    const shouldRenderImmediately = depth === 0 || depth === 1;

    useEffect(() => {
      if (shouldRenderImmediately) {
        setIsVisible(true);
        return;
      }

      const element = placeholderRef.current;
      if (!element) return;

      const observer = getSharedObserver();

      const callback = () => setIsVisible(true);
      observerCallbacks.set(element, callback);
      observer.observe(element);

      return () => {
        if (element) {
          observer.unobserve(element);
          observerCallbacks.delete(element);
        }
      };
    }, [shouldRenderImmediately]);

    if (!isVisible) {
      
      const nodeHeight = node.type === 'trade' ? 60 : 48;

      return (
        <div
          ref={placeholderRef}
          className={`trade-log-node-placeholder trade-log-node--${node.type}`}
          style={cssVars({
            '--journalit-trade-log-node-placeholder-height': `${nodeHeight}px`,
          })}
        />
      );
    }

    
    return (
      <TradeLogNode
        node={node}
        depth={depth}
        isExpanded={isExpanded}
        isLastChild={isLastChild}
        onToggleExpand={onToggleExpand}
        onNodeClick={onNodeClick}
        viewLevel={viewLevel}
        visibleColumns={visibleColumns}
        gridTemplate={gridTemplate}
        selectedTrades={selectedTrades}
        onToggleTradeSelection={onToggleTradeSelection}
        isMultiSelectMode={isMultiSelectMode}
        isExpandedMode={isExpandedMode}
      />
    );
  }
);

LazyTradeLogNode.displayName = 'LazyTradeLogNode';
