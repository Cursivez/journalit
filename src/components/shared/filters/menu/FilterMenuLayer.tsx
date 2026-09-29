

import React, {
  type RefObject,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import { createPortal } from 'react-dom';
import { Platform } from 'obsidian';
import { ESCAPE_DELEGATE_ATTRIBUTE } from '../../../../views/escapeKeySuppression';
import { SUSPEND_VIEW_GUIDES_MENU_PROPS } from '../../../../guides/suspendViewGuides';
import {
  type FilterMenuEntry,
  type FilterMenuGuideTour,
  type FilterMenuNode,
  type FilterMenuValuesNode,
  findChildNode,
} from './menuModel';
import type { FilterMenuLayout, PanelPosition } from './filterMenuPosition';
import { createFilterMenuState, filterMenuReducer } from './filterMenuState';
import {
  type PanelFrameProps,
  BranchPanel,
  MENU_ITEM_SELECTOR,
  RootPanel,
  ValuesPanel,
} from './FilterMenuPanels';
import { useFilterMenuDismiss } from './useFilterMenuDismiss';
import { usePanelPlacement } from './usePanelPlacement';

const CASCADE_MIN_VIEWPORT_WIDTH = 720;
const HOVER_SWITCH_DELAY_MS = 140;

function getOwnerWindow(element: HTMLElement | null): Window {
  return element?.ownerDocument.defaultView ?? window;
}

function resolveLayout(element: HTMLElement | null): FilterMenuLayout {
  return Platform.isPhone ||
    getOwnerWindow(element).innerWidth < CASCADE_MIN_VIEWPORT_WIDTH
    ? 'drilldown'
    : 'cascade';
}


function resolveOpenNodes(
  entries: FilterMenuEntry[],
  openPath: string[]
): FilterMenuNode[] {
  const nodes: FilterMenuNode[] = [];
  let parent: FilterMenuNode | FilterMenuEntry[] = entries;
  for (const id of openPath) {
    const child = findChildNode(parent, id);
    if (!child) break;
    nodes.push(child);
    parent = child;
  }
  return nodes;
}

interface PanelNavigation {
  openChildId: string | undefined;
  onOpenChild: (childId: string, focus: boolean) => void;
  onHoverRow: (childId: string | null) => void;
  registerAnchor: (id: string, element: HTMLElement | null) => void;
}

interface FilterMenuPanelProps {
  node: FilterMenuNode | null;
  frame: PanelFrameProps;
  navigation: PanelNavigation;
  entries: FilterMenuEntry[];
  title: string;
  canReset: boolean;
  onReset: () => void;
  onClear: (node: FilterMenuValuesNode) => void;
}


const FilterMenuPanel: React.FC<FilterMenuPanelProps> = ({
  node,
  frame,
  navigation,
  entries,
  title,
  canReset,
  onReset,
  onClear,
}) => {
  if (!node) {
    return (
      <RootPanel
        {...frame}
        {...navigation}
        title={title}
        entries={entries}
        canReset={canReset}
        onReset={onReset}
      />
    );
  }
  if (node.kind === 'branch') {
    return (
      <BranchPanel
        {...frame}
        {...navigation}
        title={node.label}
        entries={node.children}
      />
    );
  }
  return (
    <ValuesPanel
      {...frame}
      {...navigation}
      node={node}
      onClear={() => onClear(node)}
    />
  );
};

interface FilterMenuLayerProps {
  entries: FilterMenuEntry[];
  title: string;
  canReset: boolean;
  onReset: () => void;
  triggerRef: RefObject<HTMLElement | null>;
  
  onClose: (restoreFocus: boolean) => void;
  guideTour: FilterMenuGuideTour | null;
}


const GUIDE_OPTION_SELECTOR = '[data-filter-menu-guide-option]';

export const FilterMenuLayer: React.FC<FilterMenuLayerProps> = ({
  entries,
  title,
  canReset,
  onReset,
  triggerRef,
  onClose,
  guideTour,
}) => {
  const layerRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<Array<HTMLDivElement | null>>([]);
  const anchorRefs = useRef(new Map<string, HTMLElement>());
  const hoverTimerRef = useRef<number | null>(null);
  
  const pendingFocusDepthRef = useRef<number | null>(0);
  const [state, dispatch] = useReducer(
    filterMenuReducer,
    triggerRef,
    (trigger) => createFilterMenuState(resolveLayout(trigger.current))
  );
  const { layout, positions } = state;
  
  const openPath = guideTour?.path ?? state.openPath;
  const openNodes = useMemo(
    () => resolveOpenNodes(entries, openPath),
    [entries, openPath]
  );

  const clearHoverTimer = useCallback(() => {
    if (hoverTimerRef.current === null) return;
    getOwnerWindow(triggerRef.current).clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = null;
  }, [triggerRef]);
  useEffect(() => clearHoverTimer, [clearHoverTimer]);

  const closeMenu = useCallback(
    (restoreFocus: boolean) => {
      const layer = layerRef.current;
      const active = layer?.ownerDocument.activeElement ?? null;
      onClose(
        restoreFocus || Boolean(layer && active && layer.contains(active))
      );
    },
    [onClose]
  );

  const setPathAt = useCallback(
    (depth: number, id: string | null, focus = false) => {
      clearHoverTimer();
      dispatch({ type: 'setPath', depth, id });
      if (focus) pendingFocusDepthRef.current = id ? depth + 1 : depth;
    },
    [clearHoverTimer]
  );

  const scheduleHover = useCallback(
    (depth: number, id: string | null) => {
      if (layout === 'drilldown') return;
      clearHoverTimer();
      if ((openPath[depth] ?? null) === id) return;
      const delay = openPath.length > depth ? HOVER_SWITCH_DELAY_MS : 0;
      hoverTimerRef.current = getOwnerWindow(triggerRef.current).setTimeout(
        () => {
          hoverTimerRef.current = null;
          setPathAt(depth, id);
        },
        delay
      );
    },
    [clearHoverTimer, layout, openPath, setPathAt, triggerRef]
  );

  const registerAnchor = useCallback(
    (id: string, element: HTMLElement | null) => {
      if (element) {
        anchorRefs.current.set(id, element);
      } else {
        anchorRefs.current.delete(id);
      }
    },
    []
  );

  
  const closeLevel = useCallback(
    (depth: number) => {
      if (depth === 0) {
        closeMenu(true);
        return;
      }
      const anchor = anchorRefs.current.get(openPath[depth - 1]);
      setPathAt(depth - 1, null);
      const focusTarget = anchor?.matches(MENU_ITEM_SELECTOR)
        ? anchor
        : anchor?.querySelector<HTMLElement>(MENU_ITEM_SELECTOR);
      if (layout === 'cascade' && focusTarget) {
        focusTarget.focus();
      } else {
        pendingFocusDepthRef.current = depth - 1;
      }
    },
    [closeMenu, layout, openPath, setPathAt]
  );

  const handlePanelKeyDown = useCallback(
    (depth: number, event: React.KeyboardEvent<HTMLDivElement>) => {
      const panel = event.currentTarget;
      const active = panel.ownerDocument.activeElement;
      const isTextInput = active instanceof HTMLInputElement;

      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        event.stopPropagation();
        const items = Array.from(
          panel.querySelectorAll<HTMLElement>(MENU_ITEM_SELECTOR)
        );
        if (items.length === 0) return;
        const step = event.key === 'ArrowDown' ? 1 : -1;
        const index = items.findIndex((item) => item === active);
        const nextIndex =
          index === -1
            ? step === 1
              ? 0
              : items.length - 1
            : (index + step + items.length) % items.length;
        items[nextIndex].focus();
        return;
      }

      if (event.key === 'ArrowRight' && !isTextInput) {
        const opens =
          active instanceof HTMLElement
            ? active.dataset.filterMenuOpens
            : undefined;
        if (!opens) return;
        event.preventDefault();
        event.stopPropagation();
        setPathAt(depth, opens, true);
        return;
      }

      if (event.key === 'ArrowLeft' && !isTextInput && depth > 0) {
        event.preventDefault();
        event.stopPropagation();
        closeLevel(depth);
      }
    },
    [closeLevel, setPathAt]
  );

  useFilterMenuDismiss({
    triggerRef,
    layerRef,
    onEscape: () => closeLevel(openNodes.length),
    onDismiss: () => closeMenu(false),
    onReflow: () =>
      dispatch({ type: 'reflow', layout: resolveLayout(triggerRef.current) }),
  });

  const visibleDepths = useMemo(
    () =>
      layout === 'drilldown'
        ? [openNodes.length]
        : Array.from({ length: openNodes.length + 1 }, (_, depth) => depth),
    [layout, openNodes.length]
  );
  const handlePositions = useCallback(
    (next: Array<PanelPosition | null>) =>
      dispatch({ type: 'setPositions', positions: next }),
    []
  );
  usePanelPlacement({
    layout,
    layoutTick: state.layoutTick,
    openPath,
    visibleDepths,
    positions,
    contentKey: entries,
    triggerRef,
    panelRefs,
    anchorRefs,
    pendingFocusDepthRef,
    onPositions: handlePositions,
  });

  
  
  
  const guidePanelDepth = openNodes.length;
  const guidePanelPosition = positions[guidePanelDepth] ?? null;
  const guidePathLength = guideTour?.path?.length ?? null;
  const guideTarget = guideTour?.target ?? null;
  const registerGuideTarget = guideTour?.registerTarget ?? null;
  useEffect(() => {
    if (!registerGuideTarget || guidePathLength !== guidePanelDepth) return;
    if (!guidePanelPosition) return;
    const panel = panelRefs.current[guidePanelDepth];
    if (!panel) return;

    let registered: HTMLElement | null = null;
    const sync = () => {
      const next =
        guideTarget === 'option'
          ? (panel.querySelector<HTMLElement>(GUIDE_OPTION_SELECTOR) ?? panel)
          : panel;
      if (next === registered) return;
      registered = next;
      registerGuideTarget(next);
    };
    sync();
    const observer =
      guideTarget === 'option' ? new MutationObserver(sync) : null;
    observer?.observe(panel, {
      childList: true,
      subtree: true,
      attributeFilter: ['data-filter-menu-guide-option'],
    });
    return () => {
      observer?.disconnect();
      registerGuideTarget(null);
    };
  }, [
    guidePanelDepth,
    guidePanelPosition,
    guidePathLength,
    guideTarget,
    registerGuideTarget,
  ]);

  const portalRoot = triggerRef.current?.ownerDocument.body;
  if (!portalRoot) return null;

  return createPortal(
    <div
      ref={layerRef}
      className="journalit-filter-menu"
      {...{ [ESCAPE_DELEGATE_ATTRIBUTE]: 'true' }}
      
      
      {...(guideTour ? {} : SUSPEND_VIEW_GUIDES_MENU_PROPS)}
    >
      {visibleDepths.map((depth) => {
        const node = depth === 0 ? null : openNodes[depth - 1];
        return (
          <FilterMenuPanel
            key={node ? node.id : 'root'}
            node={node}
            entries={entries}
            frame={{
              depth,
              layout,
              position: positions[depth] ?? null,
              panelRef: (element) => {
                panelRefs.current[depth] = element;
              },
              onKeyDown: (event) => handlePanelKeyDown(depth, event),
              onPointerEnter: clearHoverTimer,
              onBack:
                layout === 'drilldown' && depth > 0
                  ? () => setPathAt(depth - 1, null, true)
                  : undefined,
            }}
            navigation={{
              openChildId: openPath[depth],
              onOpenChild: (childId, focus) =>
                setPathAt(depth, childId, focus || layout === 'drilldown'),
              onHoverRow: (childId) => scheduleHover(depth, childId),
              registerAnchor,
            }}
            title={title}
            canReset={canReset}
            onReset={() => {
              onReset();
              pendingFocusDepthRef.current = 0;
            }}
            onClear={(valuesNode) => {
              valuesNode.onClear();
              pendingFocusDepthRef.current = depth;
            }}
          />
        );
      })}
    </div>,
    portalRoot
  );
};
