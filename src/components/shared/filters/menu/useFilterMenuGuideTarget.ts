import { useEffect, type RefObject } from 'react';
import type { FilterMenuGuideTour } from './menuModel';
import type { PanelPosition } from './filterMenuPosition';

const GUIDE_OPTION_SELECTOR = '[data-filter-menu-guide-option]';


export function useFilterMenuGuideTarget({
  guideTour,
  depth,
  position,
  panelRefs,
}: {
  guideTour: FilterMenuGuideTour | null;
  depth: number;
  position: PanelPosition | null;
  panelRefs: RefObject<Array<HTMLDivElement | null>>;
}) {
  const pathLength = guideTour?.path?.length ?? null;
  const target = guideTour?.target ?? null;
  const registerTarget = guideTour?.registerTarget ?? null;
  useEffect(() => {
    if (!registerTarget || pathLength !== depth || !position) return;
    const panel = panelRefs.current[depth];
    if (!panel) return;

    let registered: HTMLElement | null = null;
    const sync = () => {
      const next =
        target === 'option'
          ? (panel.querySelector<HTMLElement>(GUIDE_OPTION_SELECTOR) ?? panel)
          : panel;
      if (next === registered) return;
      registered = next;
      registerTarget(next);
    };
    sync();
    const observer = target === 'option' ? new MutationObserver(sync) : null;
    observer?.observe(panel, {
      childList: true,
      subtree: true,
      attributeFilter: ['data-filter-menu-guide-option'],
    });
    return () => {
      observer?.disconnect();
      registerTarget(null);
    };
  }, [depth, position, pathLength, target, registerTarget, panelRefs]);
}
