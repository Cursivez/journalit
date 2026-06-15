import React, { useEffect, useRef, useState } from 'react';
import * as ReactGridLayout from 'react-grid-layout';

export interface LayoutItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  maxW?: number;
  minH?: number;
  maxH?: number;
  moved?: boolean;
  static?: boolean;
  isDraggable?: boolean;
  isResizable?: boolean;
  resizeHandles?: Array<'s' | 'w' | 'e' | 'n' | 'sw' | 'nw' | 'se' | 'ne'>;
  isBounded?: boolean;
}

export type Layout = LayoutItem;

interface GridCompactor {
  compact(layout: LayoutItem[], cols: number): LayoutItem[];
}

const reactGridLayoutModule = Object.fromEntries(
  Object.entries(ReactGridLayout)
);

const isReactComponentType = (
  value: unknown
): value is React.ComponentType<Record<string, unknown>> =>
  typeof value === 'function' ||
  (typeof value === 'object' && value !== null && !Array.isArray(value));

const isGridCompactor = (value: unknown): value is GridCompactor =>
  Boolean(
    value &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    typeof Reflect.get(value, 'compact') === 'function'
  );

const responsiveGridLayout = reactGridLayoutModule.Responsive;
if (!isReactComponentType(responsiveGridLayout)) {
  throw new Error('react-grid-layout Responsive export is unavailable');
}

export const ResponsiveGridLayout = responsiveGridLayout;

const reactGridVerticalCompactor = reactGridLayoutModule.verticalCompactor;
if (!isGridCompactor(reactGridVerticalCompactor)) {
  throw new Error('react-grid-layout verticalCompactor export is unavailable');
}

const collides = (a: LayoutItem, b: LayoutItem): boolean => {
  if (a.i === b.i) return false;
  if (a.x + a.w <= b.x) return false;
  if (b.x + b.w <= a.x) return false;
  if (a.y + a.h <= b.y) return false;
  if (b.y + b.h <= a.y) return false;
  return true;
};

const firstCollision = (
  layout: LayoutItem[],
  item: LayoutItem
): LayoutItem | undefined => layout.find((placed) => collides(item, placed));

const resolveLayoutCollisions = (
  layout: LayoutItem[],
  priorityItemId?: string | null
): LayoutItem[] => {
  const resolved: LayoutItem[] = [];
  const sorted = [...layout].sort((a, b) => {
    if (priorityItemId) {
      if (a.i === priorityItemId) return -1;
      if (b.i === priorityItemId) return 1;
    }
    return a.y - b.y || a.x - b.x;
  });

  for (const sourceItem of sorted) {
    const item = { ...sourceItem };
    let collision = firstCollision(resolved, item);
    while (collision) {
      item.y = collision.y + collision.h;
      collision = firstCollision(resolved, item);
    }
    resolved.push(item);
  }

  return resolved;
};

export const verticalCompactor = reactGridVerticalCompactor;

const horizontalOverlap = (a: LayoutItem, b: LayoutItem): number =>
  Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x));

const verticalOverlap = (a: LayoutItem, b: LayoutItem): number =>
  Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));

export const applyVerticalDragSwap = (
  layout: LayoutItem[],
  activeItemId: string | null,
  dragStartItem: LayoutItem | null
): LayoutItem[] => {
  if (!activeItemId || !dragStartItem) {
    return resolveLayoutCollisions(layout);
  }

  const activeItem = layout.find((item) => item.i === activeItemId);
  if (!activeItem) {
    return resolveLayoutCollisions(layout);
  }

  let target: LayoutItem | undefined;
  let bestVerticalOverlapRatio = Number.NEGATIVE_INFINITY;

  for (const item of layout) {
    if (item.i === activeItemId) continue;

    const horizontalOverlapRatio =
      horizontalOverlap(activeItem, item) / Math.min(activeItem.w, item.w);
    const verticalOverlapRatio =
      verticalOverlap(activeItem, item) / Math.min(activeItem.h, item.h);

    if (horizontalOverlapRatio < 0.5 || verticalOverlapRatio < 0.2) {
      continue;
    }

    if (verticalOverlapRatio > bestVerticalOverlapRatio) {
      bestVerticalOverlapRatio = verticalOverlapRatio;
      target = item;
    }
  }

  if (!target) {
    return resolveLayoutCollisions(layout, activeItemId);
  }

  const swapped = layout.map((item) => {
    if (item.i === activeItemId) {
      return { ...item, x: target.x, y: target.y };
    }
    if (item.i === target.i) {
      return { ...item, x: dragStartItem.x, y: dragStartItem.y };
    }
    return item;
  });

  return resolveLayoutCollisions(swapped, activeItemId);
};

export const normalizeBottomSentinelRows = (
  layout: LayoutItem[],
  bottomPosition: number
): LayoutItem[] => {
  let nextBottomY = layout.reduce((maxY, item) => {
    if (item.y >= bottomPosition) {
      return maxY;
    }
    return Math.max(maxY, item.y + item.h);
  }, 0);

  const normalized = layout.map((item) => {
    if (item.y < bottomPosition) {
      return item;
    }

    const normalizedItem = { ...item, y: nextBottomY };
    nextBottomY += item.h;
    return normalizedItem;
  });

  return resolveLayoutCollisions(normalized);
};

export function useContainerWidth(options?: { initialWidth?: number }): {
  width: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  mounted: boolean;
} {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(options?.initialWidth ?? 0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const container = containerRef.current;
    if (!container || typeof ResizeObserver === 'undefined') {
      return;
    }

    const updateWidth = (nextWidth: number) => {
      setWidth(nextWidth);
    };
    updateWidth(container.getBoundingClientRect().width);

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        updateWidth(entry.contentRect.width);
      }
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return { width, containerRef, mounted };
}
