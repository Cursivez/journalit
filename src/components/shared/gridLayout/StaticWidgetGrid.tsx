import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  type LayoutItem as RglLayoutItem,
  verticalCompactor,
} from './reactGridLayoutCompat';
import { cssVars } from '../../../styles/inlineStylePolicy';

type StaticGridBreakpoint = 'lg' | 'md' | 'sm' | 'xs' | 'xxs';

const DEFAULT_BREAKPOINTS: Record<StaticGridBreakpoint, number> = {
  lg: 1200,
  md: 996,
  sm: 768,
  xs: 480,
  xxs: 0,
};

const getStaticGridBreakpointForWidth = (
  width: number,
  breakpoints: Record<StaticGridBreakpoint, number> = DEFAULT_BREAKPOINTS
): StaticGridBreakpoint => {
  if (width >= breakpoints.lg) return 'lg';
  if (width >= breakpoints.md) return 'md';
  if (width >= breakpoints.sm) return 'sm';
  if (width >= breakpoints.xs) return 'xs';
  return 'xxs';
};

const isBottomSentinelY = (y: unknown, bottomPosition: number): boolean =>
  typeof y !== 'number' || !Number.isFinite(y) || y >= bottomPosition;

const calcStaticGridItemPosition = (
  params: {
    margin: readonly [number, number];
    containerPadding: readonly [number, number];
    containerWidth: number;
    cols: number;
    rowHeight: number;
  },
  x: number,
  y: number,
  w: number,
  h: number
) => {
  const [marginX, marginY] = params.margin;
  const [paddingX, paddingY] = params.containerPadding;
  const columnWidth =
    (params.containerWidth - paddingX * 2 - marginX * (params.cols - 1)) /
    params.cols;

  return {
    left: Math.round(paddingX + x * (columnWidth + marginX)),
    top: Math.round(paddingY + y * (params.rowHeight + marginY)),
    width: Math.round(columnWidth * w + Math.max(0, w - 1) * marginX),
    height: Math.round(params.rowHeight * h + Math.max(0, h - 1) * marginY),
  };
};

interface StaticWidgetGridProps {
  layouts: Record<StaticGridBreakpoint, RglLayoutItem[]>;
  widgets: string[];
  cols: Record<StaticGridBreakpoint, number>;
  rowHeight: number;
  gap: number;
  bottomPosition: number;
  className: string;
  itemClassName: string;
  renderWidget: (widgetId: string) => React.ReactNode;
  breakpoints?: Record<StaticGridBreakpoint, number>;
  getDefaultSize?: (widgetId: string) => { w: number; h: number } | undefined;
  mode?: 'css-grid' | 'absolute';
  containerPadding?: readonly [number, number];
  initialWidth?: number;
}

interface StaticWidgetGridItemProps {
  item: RglLayoutItem;
  itemClassName: string;
  mode: 'css-grid' | 'absolute';
  positionParams: {
    margin: readonly [number, number];
    containerPadding: readonly [number, number];
    containerWidth: number;
    cols: number;
    rowHeight: number;
  };
  renderWidget: (widgetId: string) => React.ReactNode;
}

const StaticWidgetGridItem: React.FC<StaticWidgetGridItemProps> = React.memo(
  ({ item, itemClassName, mode, positionParams, renderWidget }) => {
    const position = calcStaticGridItemPosition(
      positionParams,
      item.x,
      item.y,
      item.w,
      item.h
    );

    return (
      <div
        className={itemClassName}
        style={cssVars({
          '--jit-grid-column': `${item.x + 1} / span ${item.w}`,
          '--jit-grid-row': `${item.y + 1} / span ${item.h}`,
          '--jit-grid-item-left':
            mode === 'absolute' ? `${position.left}px` : undefined,
          '--jit-grid-item-top':
            mode === 'absolute' ? `${position.top}px` : undefined,
          '--jit-grid-item-width':
            mode === 'absolute' ? `${position.width}px` : undefined,
          '--jit-grid-item-height':
            mode === 'absolute' ? `${position.height}px` : undefined,
        })}
      >
        {renderWidget(item.i)}
      </div>
    );
  }
);

StaticWidgetGridItem.displayName = 'StaticWidgetGridItem';

export const StaticWidgetGrid: React.FC<StaticWidgetGridProps> = ({
  layouts,
  widgets,
  cols,
  rowHeight,
  gap,
  bottomPosition,
  className,
  itemClassName,
  renderWidget,
  breakpoints = DEFAULT_BREAKPOINTS,
  getDefaultSize,
  mode = 'css-grid',
  containerPadding = [0, 0],
  initialWidth = 0,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(initialWidth);
  const [currentBreakpoint, setCurrentBreakpoint] =
    useState<StaticGridBreakpoint>(() =>
      getStaticGridBreakpointForWidth(initialWidth, breakpoints)
    );

  useEffect(() => {
    if (initialWidth > 0) {
      setContainerWidth(initialWidth);
      setCurrentBreakpoint(
        getStaticGridBreakpointForWidth(initialWidth, breakpoints)
      );
    }
  }, [breakpoints, initialWidth]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof ResizeObserver === 'undefined') return;

    const updateBreakpoint = (width: number) => {
      setContainerWidth(width);
      setCurrentBreakpoint(getStaticGridBreakpointForWidth(width, breakpoints));
    };

    updateBreakpoint(container.getBoundingClientRect().width);

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      updateBreakpoint(entry.contentRect.width);
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [breakpoints]);

  const staticLayout = useMemo<RglLayoutItem[]>(() => {
    const columnCount = cols[currentBreakpoint];
    const widgetSet = new Set(widgets);
    const sourceLayout = Array.isArray(layouts[currentBreakpoint])
      ? layouts[currentBreakpoint]
      : [];
    const resolved: RglLayoutItem[] = [];
    const includedWidgetIds = new Set<string>();

    const getBottomY = () =>
      resolved.reduce((max, item) => Math.max(max, item.y + item.h), 0);

    const resolveItem = (item: RglLayoutItem): RglLayoutItem => {
      const width = Math.max(1, Math.min(item.w, columnCount));
      const x = Math.max(0, Math.min(item.x, Math.max(0, columnCount - width)));
      const y = isBottomSentinelY(item.y, bottomPosition)
        ? getBottomY()
        : Math.max(0, item.y);

      return {
        ...item,
        x,
        y,
        w: width,
        h: Math.max(1, item.h),
      };
    };

    for (const item of sourceLayout) {
      if (!widgetSet.has(item.i) || includedWidgetIds.has(item.i)) continue;
      const resolvedItem = resolveItem(item);
      resolved.push(resolvedItem);
      includedWidgetIds.add(resolvedItem.i);
    }

    for (const widgetId of widgets) {
      if (includedWidgetIds.has(widgetId)) continue;
      const defaultSize = getDefaultSize?.(widgetId);
      const resolvedItem = resolveItem({
        i: widgetId,
        x: 0,
        y: bottomPosition,
        w: Math.min(defaultSize?.w ?? columnCount, columnCount),
        h: defaultSize?.h ?? 4,
      });
      resolved.push(resolvedItem);
      includedWidgetIds.add(widgetId);
    }

    const compactedLayout = verticalCompactor.compact(
      resolved.map((item) => ({ ...item })),
      columnCount
    );

    return [...compactedLayout].sort(
      (a: RglLayoutItem, b: RglLayoutItem) => a.y - b.y || a.x - b.x
    );
  }, [
    bottomPosition,
    cols,
    currentBreakpoint,
    getDefaultSize,
    layouts,
    widgets,
  ]);

  const absoluteMetrics = useMemo(() => {
    const columnCount = cols[currentBreakpoint];
    const rows = staticLayout.reduce(
      (max, item) => Math.max(max, item.y + item.h),
      0
    );
    const height =
      rows > 0
        ? containerPadding[1] * 2 + rows * rowHeight + (rows - 1) * gap
        : 0;

    return {
      height,
      positionParams: {
        margin: [gap, gap] as const,
        containerPadding,
        containerWidth,
        cols: columnCount,
        rowHeight,
        maxRows: Infinity,
      },
    };
  }, [
    cols,
    containerPadding,
    containerWidth,
    currentBreakpoint,
    gap,
    rowHeight,
    staticLayout,
  ]);

  return (
    <div
      ref={containerRef}
      className={`${className} ${mode === 'absolute' ? `${className}--absolute` : ''}`}
      style={cssVars({
        '--jit-grid-cols': String(cols[currentBreakpoint]),
        '--jit-grid-row-height': `${rowHeight}px`,
        '--jit-grid-gap': `${gap}px`,
        '--jit-grid-height':
          mode === 'absolute' ? `${absoluteMetrics.height}px` : undefined,
      })}
    >
      {staticLayout.map((item) => (
        <StaticWidgetGridItem
          key={item.i}
          item={item}
          itemClassName={itemClassName}
          mode={mode}
          positionParams={absoluteMetrics.positionParams}
          renderWidget={renderWidget}
        />
      ))}
    </div>
  );
};
