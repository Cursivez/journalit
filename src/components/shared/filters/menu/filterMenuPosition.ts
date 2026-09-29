

export type FilterMenuLayout = 'cascade' | 'drilldown';
type PanelSide = 'left' | 'right';

export interface PanelPosition {
  top: number;
  left: number;
  maxHeight: number;
  side: PanelSide;
  
  bridgesGap: boolean;
}

export interface RectLike {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface PanelMeasurement {
  depth: number;
  width: number;
  height: number;
  
  anchorRect: RectLike | null;
  
  parentRect: RectLike | null;
}

interface ComputePanelPositionsInput {
  layout: FilterMenuLayout;
  viewportWidth: number;
  viewportHeight: number;
  triggerRect: RectLike;
  
  panels: PanelMeasurement[];
}

const VIEWPORT_MARGIN = 8;
const PANEL_GAP = 4;

export const SUBMENU_GAP = 4;
const MIN_ROOT_HEIGHT = 160;

const PANEL_MAX_HEIGHT = 420;
const FLIP_UP_THRESHOLD = 240;

const SUBMENU_TOP_OFFSET = 5;

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max));
}

function placeUnderTrigger(
  panel: PanelMeasurement,
  { viewportWidth, viewportHeight, triggerRect }: ComputePanelPositionsInput
): PanelPosition {
  const spaceBelow =
    viewportHeight - triggerRect.bottom - PANEL_GAP - VIEWPORT_MARGIN;
  const spaceAbove = triggerRect.top - PANEL_GAP - VIEWPORT_MARGIN;
  const openUp =
    spaceBelow < Math.min(panel.height, FLIP_UP_THRESHOLD) &&
    spaceAbove > spaceBelow;
  const maxHeight = Math.min(
    PANEL_MAX_HEIGHT,
    Math.max(MIN_ROOT_HEIGHT, openUp ? spaceAbove : spaceBelow)
  );
  const visibleHeight = Math.min(panel.height, maxHeight);

  return {
    top: openUp
      ? triggerRect.top - PANEL_GAP - visibleHeight
      : triggerRect.bottom + PANEL_GAP,
    
    left: clamp(
      triggerRect.right - panel.width,
      VIEWPORT_MARGIN,
      viewportWidth - VIEWPORT_MARGIN - panel.width
    ),
    maxHeight,
    
    
    side:
      triggerRect.left > viewportWidth - triggerRect.right ? 'left' : 'right',
    bridgesGap: false,
  };
}

function placeBesideParent(
  panel: PanelMeasurement,
  anchorRect: RectLike,
  parentRect: RectLike,
  preferred: PanelSide,
  { viewportWidth, viewportHeight }: ComputePanelPositionsInput
): PanelPosition {
  const fitsRight =
    parentRect.right + SUBMENU_GAP + panel.width <=
    viewportWidth - VIEWPORT_MARGIN;
  const fitsLeft =
    parentRect.left - SUBMENU_GAP - panel.width >= VIEWPORT_MARGIN;
  const side: PanelSide =
    preferred === 'right'
      ? fitsRight || !fitsLeft
        ? 'right'
        : 'left'
      : fitsLeft || !fitsRight
        ? 'left'
        : 'right';

  const rawLeft =
    side === 'right'
      ? parentRect.right + SUBMENU_GAP
      : parentRect.left - SUBMENU_GAP - panel.width;
  const visibleHeight = Math.min(
    panel.height,
    PANEL_MAX_HEIGHT,
    viewportHeight - VIEWPORT_MARGIN * 2
  );
  const top = clamp(
    anchorRect.top - SUBMENU_TOP_OFFSET,
    VIEWPORT_MARGIN,
    viewportHeight - VIEWPORT_MARGIN - visibleHeight
  );

  const left = clamp(
    rawLeft,
    VIEWPORT_MARGIN,
    viewportWidth - VIEWPORT_MARGIN - panel.width
  );

  return {
    top,
    left,
    maxHeight: Math.min(
      PANEL_MAX_HEIGHT,
      viewportHeight - VIEWPORT_MARGIN - top
    ),
    side,
    bridgesGap: left === rawLeft,
  };
}

export function computePanelPositions(
  input: ComputePanelPositionsInput
): Array<PanelPosition | null> {
  const positions: Array<PanelPosition | null> = [];

  for (const panel of input.panels) {
    const parent = positions[panel.depth - 1];
    if (
      input.layout === 'cascade' &&
      panel.depth > 0 &&
      panel.anchorRect &&
      panel.parentRect &&
      parent
    ) {
      positions[panel.depth] = placeBesideParent(
        panel,
        panel.anchorRect,
        panel.parentRect,
        parent.side,
        input
      );
    } else {
      positions[panel.depth] = placeUnderTrigger(panel, input);
    }
  }

  return positions;
}

export function arePositionsEqual(
  a: ReadonlyArray<PanelPosition | null | undefined>,
  b: ReadonlyArray<PanelPosition | null | undefined>
): boolean {
  if (a.length !== b.length) return false;
  for (let index = 0; index < a.length; index++) {
    const left = a[index];
    const right = b[index];
    if (!left || !right) {
      if (Boolean(left) !== Boolean(right)) return false;
      continue;
    }
    if (
      Math.round(left.top) !== Math.round(right.top) ||
      Math.round(left.left) !== Math.round(right.left) ||
      Math.round(left.maxHeight) !== Math.round(right.maxHeight) ||
      left.side !== right.side ||
      left.bridgesGap !== right.bridgesGap
    ) {
      return false;
    }
  }
  return true;
}
