

import { type RefObject, useEffect, useLayoutEffect, useState } from 'react';
import {
  type FilterMenuLayout,
  type PanelMeasurement,
  type PanelPosition,
  arePositionsEqual,
  computePanelPositions,
} from './filterMenuPosition';
import { MENU_ITEM_SELECTOR } from './FilterMenuPanels';


function naturalPanelHeight(panel: HTMLElement): number {
  const list = panel.querySelector<HTMLElement>(
    '.journalit-filter-menu__scroll'
  );
  if (!list) return panel.offsetHeight;
  return panel.offsetHeight - list.clientHeight + list.scrollHeight;
}

interface UsePanelPlacementInput {
  layout: FilterMenuLayout;
  layoutTick: number;
  openPath: string[];
  visibleDepths: number[];
  positions: Array<PanelPosition | null>;
  
  contentKey: unknown;
  triggerRef: RefObject<HTMLElement | null>;
  panelRefs: RefObject<Array<HTMLDivElement | null>>;
  anchorRefs: RefObject<Map<string, HTMLElement>>;
  
  pendingFocusDepthRef: RefObject<number | null>;
  onPositions: (positions: Array<PanelPosition | null>) => void;
}

export function usePanelPlacement({
  layout,
  layoutTick,
  openPath,
  visibleDepths,
  positions,
  contentKey,
  triggerRef,
  panelRefs,
  anchorRefs,
  pendingFocusDepthRef,
  onPositions,
}: UsePanelPlacementInput): void {
  
  
  const [sizeTick, setSizeTick] = useState(0);
  useEffect(() => {
    const trigger = triggerRef.current;
    const ownerWindow = trigger?.ownerDocument.defaultView;
    if (!ownerWindow) return;
    const observer = new ownerWindow.ResizeObserver(() =>
      setSizeTick((tick) => tick + 1)
    );
    for (const depth of visibleDepths) {
      const panel = panelRefs.current[depth];
      if (!panel) continue;
      for (const child of Array.from(panel.children)) observer.observe(child);
    }
    return () => observer.disconnect();
  }, [panelRefs, triggerRef, visibleDepths]);

  useLayoutEffect(() => {
    void layoutTick;
    void contentKey;
    void sizeTick;
    const trigger = triggerRef.current;
    if (!trigger) return;

    const panels: PanelMeasurement[] = [];
    for (const depth of visibleDepths) {
      const panel = panelRefs.current[depth];
      if (!panel) continue;
      const anchor =
        depth > 0 ? anchorRefs.current.get(openPath[depth - 1]) : undefined;
      const parentPanel = depth > 0 ? panelRefs.current[depth - 1] : null;
      panels.push({
        depth,
        width: panel.offsetWidth,
        height: naturalPanelHeight(panel),
        anchorRect: anchor ? anchor.getBoundingClientRect() : null,
        parentRect: parentPanel ? parentPanel.getBoundingClientRect() : null,
      });
    }

    const ownerWindow = trigger.ownerDocument.defaultView ?? window;
    const next = computePanelPositions({
      layout,
      viewportWidth: ownerWindow.innerWidth,
      viewportHeight: ownerWindow.innerHeight,
      triggerRect: trigger.getBoundingClientRect(),
      panels,
    });
    if (!arePositionsEqual(positions, next)) {
      onPositions(next);
      return;
    }

    const pendingDepth = pendingFocusDepthRef.current;
    if (pendingDepth === null || !positions[pendingDepth]) return;
    const panel = panelRefs.current[pendingDepth];
    if (!panel) return;
    pendingFocusDepthRef.current = null;
    const target =
      panel.getAttribute('role') === 'dialog'
        ? panel.querySelector<HTMLElement>('input:not([disabled])')
        : panel.querySelector<HTMLElement>(MENU_ITEM_SELECTOR);
    target?.focus();
  }, [
    anchorRefs,
    contentKey,
    layout,
    layoutTick,
    onPositions,
    openPath,
    panelRefs,
    pendingFocusDepthRef,
    positions,
    sizeTick,
    triggerRef,
    visibleDepths,
  ]);
}
