import React from 'react';
import { createPortal } from 'react-dom';
import { cssVars } from '../../styles/inlineStylePolicy';

type TooltipCoordinate = { x: number; y: number };
type TooltipSize = { width: number; height: number };
type TooltipAnchor = { x: number; y: number };
type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';
export type TooltipPlacementMode = 'point' | 'bar';

interface TooltipPosition {
  left: number;
  top: number;
  placement: TooltipPlacement;
}

interface PortalRootRecord {
  element: HTMLDivElement;
  users: number;
}

const DEFAULT_TOOLTIP_SIZE: TooltipSize = { width: 280, height: 96 };
const DEFAULT_OFFSET = 12;
const DEFAULT_MARGIN = 12;
const portalRoots = new WeakMap<Document, PortalRootRecord>();

const clamp = (value: number, min: number, max: number): number => {
  if (max < min) return min;
  return Math.min(Math.max(value, min), max);
};

const nearlyEqual = (a: number, b: number): boolean => Math.abs(a - b) < 0.5;

const sameAnchor = (
  a: TooltipAnchor | null,
  b: TooltipAnchor | null
): boolean => {
  if (a === b) return true;
  if (!a || !b) return false;
  return nearlyEqual(a.x, b.x) && nearlyEqual(a.y, b.y);
};

const sameSize = (a: TooltipSize, b: TooltipSize): boolean =>
  nearlyEqual(a.width, b.width) && nearlyEqual(a.height, b.height);

const isPointInsideRect = (
  rect: DOMRect,
  x: number,
  y: number,
  tolerance: number
): boolean =>
  x >= rect.left - tolerance &&
  x <= rect.right + tolerance &&
  y >= rect.top - tolerance &&
  y <= rect.bottom + tolerance;

const acquirePortalRoot = (doc: Document): HTMLDivElement => {
  const existing = portalRoots.get(doc);
  if (existing?.element.isConnected) {
    existing.users += 1;
    return existing.element;
  }

  const element = doc.createElement('div');
  element.className = 'journalit-chart-tooltip-portal-root';
  doc.body.appendChild(element);
  portalRoots.set(doc, { element, users: 1 });
  return element;
};

const releasePortalRoot = (doc: Document): void => {
  const existing = portalRoots.get(doc);
  if (!existing) return;

  existing.users -= 1;
  if (existing.users <= 0) {
    existing.element.remove();
    portalRoots.delete(doc);
  }
};

const getOwnerDocument = (
  chartRef: React.RefObject<HTMLElement | null>
): Document | null =>
  chartRef.current?.ownerDocument ??
  (typeof window.activeDocument !== 'undefined' ? window.activeDocument : null);

const getChartRect = (chartRoot: HTMLElement): DOMRect => {
  const rechartsWrapper =
    chartRoot.querySelector<HTMLElement>('.recharts-wrapper');
  return (rechartsWrapper ?? chartRoot).getBoundingClientRect();
};

const readTooltipAnchor = (
  chartRef: React.RefObject<HTMLElement | null>,
  coordinate: TooltipCoordinate | undefined
): TooltipAnchor | null => {
  const chartRoot = chartRef.current;
  if (!chartRoot || !coordinate) return null;
  if (!Number.isFinite(coordinate.x) || !Number.isFinite(coordinate.y)) {
    return null;
  }

  const rect = getChartRect(chartRoot);
  return { x: rect.left + coordinate.x, y: rect.top + coordinate.y };
};

const getViewport = (
  win: Window
): { left: number; top: number; width: number; height: number } => {
  const visualViewport = win.visualViewport;
  return {
    left: visualViewport?.offsetLeft ?? 0,
    top: visualViewport?.offsetTop ?? 0,
    width: visualViewport?.width ?? win.innerWidth,
    height: visualViewport?.height ?? win.innerHeight,
  };
};

const computeTooltipPosition = (
  anchor: TooltipAnchor,
  size: TooltipSize,
  win: Window,
  offset: number,
  margin: number,
  placementMode: TooltipPlacementMode
): TooltipPosition => {
  const viewport = getViewport(win);
  const width = Math.max(size.width, 1);
  const height = Math.max(size.height, 1);
  const minLeft = viewport.left + margin;
  const maxLeft = viewport.left + viewport.width - margin - width;
  const minTop = viewport.top + margin;
  const maxTop = viewport.top + viewport.height - margin - height;
  const aboveTop = anchor.y - height - offset;
  const belowTop = anchor.y + offset;

  if (placementMode === 'bar') {
    const rightLeft = anchor.x + offset;
    const leftLeft = anchor.x - width - offset;
    const fitsRight = rightLeft <= maxLeft;
    const fitsLeft = leftLeft >= minLeft;
    const placement: TooltipPlacement = fitsRight
      ? 'right'
      : fitsLeft
        ? 'left'
        : 'top';

    if (placement === 'right' || placement === 'left') {
      return {
        left: placement === 'right' ? rightLeft : leftLeft,
        top: clamp(anchor.y - height / 2, minTop, maxTop),
        placement,
      };
    }
  }

  const fitsAbove = aboveTop >= minTop;
  const fitsBelow = belowTop <= maxTop;
  const placement: TooltipPlacement =
    fitsAbove || !fitsBelow ? 'top' : 'bottom';
  const preferredTop = placement === 'top' ? aboveTop : belowTop;

  return {
    left: clamp(anchor.x - width / 2, minLeft, maxLeft),
    top: clamp(preferredTop, minTop, maxTop),
    placement,
  };
};

const useTooltipPortalRoot = (
  chartRef: React.RefObject<HTMLElement | null>
): HTMLDivElement | null => {
  const [portalRoot, setPortalRoot] = React.useState<HTMLDivElement | null>(
    null
  );

  React.useEffect(() => {
    const doc = getOwnerDocument(chartRef);
    if (!doc?.body) return undefined;

    const root = acquirePortalRoot(doc);
    setPortalRoot(root);
    return () => releasePortalRoot(doc);
  }, [chartRef]);

  return portalRoot;
};

interface PortalChartTooltipProps {
  active?: boolean;
  payload?: readonly unknown[];
  coordinate?: TooltipCoordinate;
  chartRef: React.RefObject<HTMLElement | null>;
  children: React.ReactNode;
  offset?: number;
  margin?: number;
  placementMode?: TooltipPlacementMode;
}

export function PortalChartTooltip({
  active,
  payload,
  coordinate,
  chartRef,
  children,
  offset = DEFAULT_OFFSET,
  margin = DEFAULT_MARGIN,
  placementMode = 'point',
}: PortalChartTooltipProps): React.ReactPortal | null {
  const portalRoot = useTooltipPortalRoot(chartRef);
  const tooltipRef = React.useRef<HTMLDivElement>(null);
  const [anchor, setAnchor] = React.useState<TooltipAnchor | null>(null);
  const [tooltipSize, setTooltipSize] = React.useState<TooltipSize>({
    width: 0,
    height: 0,
  });
  const [isPointerInsideChart, setIsPointerInsideChart] = React.useState(true);

  const hasActivePayload = Boolean(
    active && payload && payload.length > 0 && coordinate && portalRoot
  );
  const isVisible = hasActivePayload && isPointerInsideChart;

  const updateAnchor = React.useCallback(() => {
    const nextAnchor = readTooltipAnchor(chartRef, coordinate);
    setAnchor((previous) =>
      sameAnchor(previous, nextAnchor) ? previous : nextAnchor
    );
  }, [chartRef, coordinate]);
  const updateAnchorRef = React.useRef(updateAnchor);

  React.useEffect(() => {
    updateAnchorRef.current = updateAnchor;
  }, [updateAnchor]);

  React.useLayoutEffect(() => {
    if (!isVisible) {
      setAnchor((previous) => (previous === null ? previous : null));
      return;
    }
    updateAnchor();
  }, [isVisible, updateAnchor]);

  React.useEffect(() => {
    if (!hasActivePayload) {
      setIsPointerInsideChart((previous) => (previous ? previous : true));
      return undefined;
    }

    const chartRoot = chartRef.current;
    const doc = getOwnerDocument(chartRef);
    if (!chartRoot || !doc) return undefined;

    const updatePointerState = (event: PointerEvent) => {
      const rect = getChartRect(chartRoot);
      const nextIsInside = isPointInsideRect(
        rect,
        event.clientX,
        event.clientY,
        2
      );

      setIsPointerInsideChart((previous) =>
        previous === nextIsInside ? previous : nextIsInside
      );
    };

    const hideTooltip = () => {
      setIsPointerInsideChart(false);
    };

    doc.addEventListener('pointermove', updatePointerState, true);
    doc.addEventListener('pointerdown', hideTooltip, true);
    doc.addEventListener('mouseleave', hideTooltip, true);
    doc.defaultView?.addEventListener('blur', hideTooltip);

    return () => {
      doc.removeEventListener('pointermove', updatePointerState, true);
      doc.removeEventListener('pointerdown', hideTooltip, true);
      doc.removeEventListener('mouseleave', hideTooltip, true);
      doc.defaultView?.removeEventListener('blur', hideTooltip);
    };
  }, [chartRef, hasActivePayload]);

  React.useEffect(() => {
    if (!hasActivePayload || !portalRoot) return undefined;

    const doc = portalRoot.ownerDocument;
    const win = doc.defaultView;
    if (!win) return undefined;
    const handleViewportChange = () => updateAnchorRef.current();

    win.addEventListener('resize', handleViewportChange);
    doc.addEventListener('scroll', handleViewportChange, {
      capture: true,
      passive: true,
    });
    win.visualViewport?.addEventListener('resize', handleViewportChange);
    win.visualViewport?.addEventListener('scroll', handleViewportChange, {
      passive: true,
    });

    return () => {
      win.removeEventListener('resize', handleViewportChange);
      doc.removeEventListener('scroll', handleViewportChange, {
        capture: true,
      });
      win.visualViewport?.removeEventListener('resize', handleViewportChange);
      win.visualViewport?.removeEventListener('scroll', handleViewportChange);
    };
  }, [hasActivePayload, portalRoot]);

  React.useLayoutEffect(() => {
    if (!isVisible) {
      setTooltipSize((previous) =>
        previous.width === 0 && previous.height === 0
          ? previous
          : { width: 0, height: 0 }
      );
      return undefined;
    }

    const node = tooltipRef.current;
    if (!node) return undefined;
    const updateSize = () => {
      const rect = node.getBoundingClientRect();
      const nextSize = { width: rect.width, height: rect.height };
      setTooltipSize((previous) =>
        sameSize(previous, nextSize) ? previous : nextSize
      );
    };

    updateSize();
    const ResizeObserverCtor = node.ownerDocument.defaultView?.ResizeObserver;
    if (!ResizeObserverCtor) return undefined;

    const observer = new ResizeObserverCtor(updateSize);
    observer.observe(node);
    return () => observer.disconnect();
  }, [isVisible, children]);

  if (!isVisible || !portalRoot || !anchor) return null;

  const win = portalRoot.ownerDocument.defaultView;
  if (!win) return null;
  const isMeasured = tooltipSize.width > 0 && tooltipSize.height > 0;
  const position = computeTooltipPosition(
    anchor,
    isMeasured ? tooltipSize : DEFAULT_TOOLTIP_SIZE,
    win,
    offset,
    margin,
    placementMode
  );

  return createPortal(
    <div
      ref={tooltipRef}
      className={
        isMeasured
          ? 'journalit-chart-tooltip-portal'
          : 'journalit-chart-tooltip-portal journalit-chart-tooltip-portal--measuring'
      }
      data-placement={position.placement}
      style={cssVars({
        '--journalit-chart-tooltip-left': `${Math.round(position.left)}px`,
        '--journalit-chart-tooltip-top': `${Math.round(position.top)}px`,
      })}
    >
      {children}
    </div>,
    portalRoot
  );
}
