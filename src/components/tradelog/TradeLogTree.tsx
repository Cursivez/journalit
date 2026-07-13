

import React, {
  useMemo,
  useCallback,
  useRef,
  useEffect,
  useReducer,
  useState,
  memo,
} from 'react';
import {
  List,
  RowComponentProps,
  ListImperativeAPI,
  useDynamicRowHeight,
} from 'react-window';
import { TimeNode, TradeLogMetrics } from '../../services/tradelog/types';
import { LazyTradeLogNode } from './LazyTradeLogNode';
import { ColumnDefinition } from './columnConfig';
import { t } from '../../lang/helpers';
import { cssVars, virtualItemStyle } from '../../styles/inlineStylePolicy';

const EMPTY_METRICS: TradeLogMetrics = {
  totalPnL: 0,
  winRate: 0,
  tradeCount: 0,
};


interface VirtualRowProps {
  flattenedNodes: FlatNode[];
  expandedNodes: Set<string>;
  onToggleExpand: (node: TimeNode) => void;
  onNodeClick: (node: TimeNode) => void;
  viewLevel?: 'years' | 'quarters' | 'months' | 'weeks' | 'days' | 'trades';
  visibleColumns?: ColumnDefinition[];
  gridTemplate?: string;
  selectedTrades?: Set<string>;
  onToggleTradeSelection?: (tradeId: string) => void;
  isMultiSelectMode?: boolean;
  isExpandedMode?: boolean;
}




function VirtualRow({
  index,
  style,
  flattenedNodes,
  expandedNodes,
  onToggleExpand,
  onNodeClick,
  viewLevel,
  visibleColumns,
  gridTemplate,
  selectedTrades,
  onToggleTradeSelection,
  isMultiSelectMode,
  isExpandedMode,
}: RowComponentProps<VirtualRowProps>): React.ReactElement {
  const flatNode = flattenedNodes[index];

  
  if (!flatNode) {
    return <div style={virtualItemStyle(style)} />;
  }

  const { node, depth, isLastChild } = flatNode;

  return (
    <div style={virtualItemStyle(style)}>
      <LazyTradeLogNode
        key={node.id}
        node={node}
        depth={depth}
        isExpanded={expandedNodes.has(node.id)}
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
    </div>
  );
}

interface TradeLogTreeProps {
  nodes: TimeNode[];
  expandedNodes: Set<string>;
  onToggleExpand: (node: TimeNode) => void;
  onNodeClick: (node: TimeNode) => void;
  onTreeReady?: () => void;
  onScrollbarWidthChange?: (width: number) => void;
  viewLevel?: 'years' | 'quarters' | 'months' | 'weeks' | 'days' | 'trades';
  visibleColumns?: ColumnDefinition[];
  gridTemplate?: string;
  selectedTrades?: Set<string>;
  onToggleTradeSelection?: (tradeId: string) => void;
  isMultiSelectMode?: boolean;
  isExpandedMode?: boolean;
  
  requestedScrollOffset?: number | null;
  onScrollOffsetChange?: (offset: number) => void;
}

interface FlatNode {
  node: TimeNode;
  depth: number;
  isLastChild: boolean;
}

interface RenderedTradeLogTreeProps {
  shouldVirtualize: boolean;
  flattenedNodes: FlatNode[];
  expandedNodes: Set<string>;
  rowProps: VirtualRowProps;
  rowHeight: ReturnType<typeof useDynamicRowHeight>;
  containerHeight: number;
  listRef: React.RefObject<ListImperativeAPI | null>;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  onVirtualScroll: (event: React.UIEvent<HTMLDivElement>) => void;
  onNonVirtualScroll: (event: React.UIEvent<HTMLDivElement>) => void;
  onToggleExpand: (node: TimeNode) => void;
  onNodeClick: (node: TimeNode) => void;
  viewLevel?: 'years' | 'quarters' | 'months' | 'weeks' | 'days' | 'trades';
  visibleColumns?: ColumnDefinition[];
  gridTemplate?: string;
  selectedTrades?: Set<string>;
  onToggleTradeSelection?: (tradeId: string) => void;
  isMultiSelectMode?: boolean;
  isExpandedMode?: boolean;
}

const RenderedTradeLogTree: React.FC<RenderedTradeLogTreeProps> = ({
  shouldVirtualize,
  flattenedNodes,
  expandedNodes,
  rowProps,
  rowHeight,
  containerHeight,
  listRef,
  scrollContainerRef,
  onVirtualScroll,
  onNonVirtualScroll,
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
  if (shouldVirtualize) {
    return (
      <List
        listRef={listRef}
        rowComponent={VirtualRow}
        rowCount={flattenedNodes.length}
        rowHeight={rowHeight}
        rowProps={rowProps}
        overscanCount={5}
        className="trade-log-virtual-list"
        style={cssVars({
          '--journalit-tradelog-virtual-height': `${containerHeight}px`,
        })}
        onScroll={onVirtualScroll}
      />
    );
  }

  return (
    <div
      ref={scrollContainerRef}
      data-testid="scroll-container"
      onScroll={onNonVirtualScroll}
      className="trade-log-scroll-container"
      style={cssVars({
        '--journalit-tradelog-scroll-height': `${containerHeight}px`,
      })}
    >
      {flattenedNodes.map(({ node, depth, isLastChild }) => (
        <LazyTradeLogNode
          key={node.id}
          node={node}
          depth={depth}
          isExpanded={expandedNodes.has(node.id)}
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
      ))}
    </div>
  );
};

function createTradeGroupHeaderNode(parentId: string): TimeNode {
  return {
    type: 'trade-group-header' as const,
    id: `${parentId}-header`,
    label: '',
    metrics: EMPTY_METRICS,
    expanded: false,
    dataLoaded: true,
  };
}

function countExpandedNodes(nodes: TimeNode[], expandedNodes: Set<string>) {
  let count = nodes.length;
  nodes.forEach((node) => {
    if (node.children && expandedNodes.has(node.id)) {
      count += countExpandedNodes(node.children, expandedNodes);
    }
  });
  return count;
}

function flattenTradeLogNodesSync(
  nodes: TimeNode[],
  expandedNodes: Set<string>,
  depth = 0,
  result: FlatNode[] = []
): FlatNode[] {
  nodes.forEach((node, index) => {
    const isLastChild = index === nodes.length - 1;
    result.push({ node, depth, isLastChild });

    if (expandedNodes.has(node.id) && node.children?.length) {
      const hasTrades = node.children.some((child) => child.type === 'trade');
      if (hasTrades) {
        result.push({
          node: createTradeGroupHeaderNode(node.id),
          depth: depth + 1,
          isLastChild: false,
        });
      }

      flattenTradeLogNodesSync(node.children, expandedNodes, depth + 1, result);
    }
  });

  return result;
}

function useFlattenedTradeLogNodes({
  nodes,
  expandedNodes,
  onTreeReady,
}: {
  nodes: TimeNode[];
  expandedNodes: Set<string>;
  onTreeReady?: () => void;
}) {
  const [flattenState, dispatchFlattenState] = useReducer(
    (
      state: { flattenedNodes: FlatNode[]; isFlattening: boolean },
      action:
        | { type: 'loaded'; flattenedNodes: FlatNode[] }
        | { type: 'loading' }
    ) =>
      action.type === 'loaded'
        ? { flattenedNodes: action.flattenedNodes, isFlattening: false }
        : { ...state, isFlattening: true },
    { flattenedNodes: [], isFlattening: false }
  );
  const { flattenedNodes, isFlattening } = flattenState;
  const flattenGenerationRef = useRef(0);

  useEffect(() => {
    const flattenGeneration = flattenGenerationRef.current + 1;
    flattenGenerationRef.current = flattenGeneration;

    if (nodes.length === 0) {
      dispatchFlattenState({ type: 'loaded', flattenedNodes: [] });
      onTreeReady?.();
      return;
    }

    const estimatedNodeCount = countExpandedNodes(nodes, expandedNodes);

    if (estimatedNodeCount < 200) {
      const result = flattenTradeLogNodesSync(nodes, expandedNodes);

      if (flattenGenerationRef.current !== flattenGeneration) {
        return;
      }

      dispatchFlattenState({ type: 'loaded', flattenedNodes: result });
      onTreeReady?.();
      return;
    }

    dispatchFlattenState({ type: 'loading' });
    const timeoutIds = new Set<number>();

    const yieldToBrowser = () =>
      new Promise<void>((resolve) => {
        const timeoutId = window.setTimeout(() => {
          timeoutIds.delete(timeoutId);
          resolve();
        }, 0);
        timeoutIds.add(timeoutId);
      });

    const flattenAsync = async () => {
      const result: FlatNode[] = [];
      let processedCount = 0;

      const flattenDFS = async (nodes: TimeNode[], depth: number) => {
        for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i];
          const isLastChild = i === nodes.length - 1;

          result.push({ node, depth, isLastChild });
          processedCount++;

          if (expandedNodes.has(node.id) && node.children?.length) {
            const hasTrades = node.children.some(
              (child) => child.type === 'trade'
            );

            if (hasTrades) {
              result.push({
                node: createTradeGroupHeaderNode(node.id),
                depth: depth + 1,
                isLastChild: false,
              });
            }

            await flattenDFS(node.children, depth + 1);
          }

          if (processedCount % 100 === 0) {
            await yieldToBrowser();
          }
        }
      };

      await flattenDFS(nodes, 0);

      if (flattenGenerationRef.current !== flattenGeneration) {
        return;
      }

      dispatchFlattenState({ type: 'loaded', flattenedNodes: result });
      onTreeReady?.();
    };

    void flattenAsync();

    return () => {
      timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
      timeoutIds.clear();
    };
  }, [nodes, expandedNodes, onTreeReady]);

  return { flattenedNodes, isFlattening };
}

function TradeLogTreeComponent({
  nodes,
  expandedNodes,
  onToggleExpand,
  onNodeClick,
  onTreeReady,
  onScrollbarWidthChange,
  viewLevel,
  visibleColumns,
  gridTemplate,
  selectedTrades,
  onToggleTradeSelection,
  isMultiSelectMode,
  isExpandedMode,
  requestedScrollOffset,
  onScrollOffsetChange,
}: TradeLogTreeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<ListImperativeAPI>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastScrollOffsetRef = useRef<number>(0);
  const [containerHeight, setContainerHeight] = useState(600);

  
  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();

        
        const headerHeight =
          window.activeDocument
            .querySelector('.trade-log-headers')
            ?.getBoundingClientRect()?.height || 60;
        const availableHeight =
          rect.height || window.innerHeight - headerHeight - 100;

        setContainerHeight(Math.max(300, availableHeight)); 
      }
    };

    
    const timer = window.setTimeout(updateHeight, 300);

    
    let resizeObserver: ResizeObserver | null = null;
    if (containerRef.current && 'ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(updateHeight);
      resizeObserver.observe(containerRef.current);
    }

    
    window.addEventListener('resize', updateHeight);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('resize', updateHeight);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, []);

  const { flattenedNodes, isFlattening } = useFlattenedTradeLogNodes({
    nodes,
    expandedNodes,
    onTreeReady,
  });

  const rowHeightCacheKey = useMemo(
    () =>
      [
        viewLevel ?? 'trades',
        isExpandedMode ? 'expanded' : 'compact',
        gridTemplate ?? '',
        flattenedNodes.map(({ node }) => node.id).join('\u001f'),
      ].join('|'),
    [flattenedNodes, gridTemplate, isExpandedMode, viewLevel]
  );

  const dynamicRowHeight = useDynamicRowHeight({
    defaultRowHeight: 48,
    key: rowHeightCacheKey,
  });

  
  const shouldVirtualize = flattenedNodes.length > 50;

  useEffect(() => {
    if (!onScrollbarWidthChange) {
      return;
    }

    const measureScrollbarWidth = () => {
      if (!containerRef.current) {
        onScrollbarWidthChange(0);
        return;
      }

      const scrollElement = containerRef.current.querySelector<HTMLElement>(
        '.trade-log-virtual-list, .trade-log-scroll-container'
      );

      if (!scrollElement) {
        onScrollbarWidthChange(0);
        return;
      }

      onScrollbarWidthChange(
        Math.max(0, scrollElement.offsetWidth - scrollElement.clientWidth)
      );
    };

    const frameId = window.requestAnimationFrame(measureScrollbarWidth);
    window.addEventListener('resize', measureScrollbarWidth);

    let resizeObserver: ResizeObserver | null = null;
    if (containerRef.current && 'ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(measureScrollbarWidth);
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('resize', measureScrollbarWidth);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [
    flattenedNodes.length,
    shouldVirtualize,
    containerHeight,
    viewLevel,
    isExpandedMode,
    onScrollbarWidthChange,
  ]);

  
  
  const handleVirtualScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const scrollOffset = e.currentTarget.scrollTop;
      lastScrollOffsetRef.current = scrollOffset;
      onScrollOffsetChange?.(scrollOffset);
    },
    [onScrollOffsetChange]
  );

  const handleNonVirtualScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.currentTarget;
      lastScrollOffsetRef.current = target.scrollTop;
      onScrollOffsetChange?.(target.scrollTop);
    },
    [onScrollOffsetChange]
  );

  
  useEffect(() => {
    
    const restore = () => {
      const desiredOffset =
        (requestedScrollOffset ?? lastScrollOffsetRef.current) || 0;
      if (shouldVirtualize) {
        
        const element = listRef.current?.element;
        if (element) {
          element.scrollTop = desiredOffset;
        }
      } else {
        const sc = scrollContainerRef.current;
        if (sc) {
          sc.scrollTop = desiredOffset;
        }
      }
    };
    
    const id = window.requestAnimationFrame(restore);
    return () => window.cancelAnimationFrame(id);
  }, [flattenedNodes, shouldVirtualize, requestedScrollOffset]);

  
  const rowProps = useMemo<VirtualRowProps>(
    () => ({
      flattenedNodes,
      expandedNodes,
      onToggleExpand,
      onNodeClick,
      viewLevel,
      visibleColumns,
      gridTemplate,
      selectedTrades,
      onToggleTradeSelection,
      isMultiSelectMode,
      isExpandedMode,
    }),
    [
      flattenedNodes,
      expandedNodes,
      onToggleExpand,
      onNodeClick,
      viewLevel,
      visibleColumns,
      gridTemplate,
      selectedTrades,
      onToggleTradeSelection,
      isMultiSelectMode,
      isExpandedMode,
    ]
  );

  if (nodes.length === 0) {
    return (
      <div className="trade-log-tree trade-log-tree--empty">
        {t('tradelog.empty')}
      </div>
    );
  }

  if (isFlattening && flattenedNodes.length === 0) {
    return (
      <div className="trade-log-tree trade-log-tree--empty">
        {t('tradelog.processing')}
      </div>
    );
  }

  
  return (
    <div className="trade-log-tree" ref={containerRef}>
      <RenderedTradeLogTree
        shouldVirtualize={shouldVirtualize}
        flattenedNodes={flattenedNodes}
        expandedNodes={expandedNodes}
        rowProps={rowProps}
        rowHeight={dynamicRowHeight}
        containerHeight={containerHeight}
        listRef={listRef}
        scrollContainerRef={scrollContainerRef}
        onVirtualScroll={handleVirtualScroll}
        onNonVirtualScroll={handleNonVirtualScroll}
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
    </div>
  );
}

export const TradeLogTree = memo(TradeLogTreeComponent);
