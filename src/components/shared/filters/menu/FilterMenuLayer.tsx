

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
  DateRangePanel,
} from './FilterMenuPanels';
import type { DateRangePickerLifecycle } from './DateRangePanelContent';
import { useFilterMenuDismiss } from './useFilterMenuDismiss';
import { usePanelPlacement } from './usePanelPlacement';
import { useFilterMenuGuideTarget } from './useFilterMenuGuideTarget';

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
  onCloseChild: () => void;
  onHoverRow: (childId: string | null) => void;
  registerAnchor: (id: string, element: HTMLElement | null) => void;
}

interface FilterMenuPanelProps extends DateRangePickerLifecycle {
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
  onPickerOpen,
  onPickerClose,
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
  if (node.kind === 'date-range') {
    return (
      <DateRangePanel
        {...frame}
        node={node}
        onPickerOpen={onPickerOpen}
        onPickerClose={onPickerClose}
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
  const calendarSurfaceRef = useRef<
    Parameters<DateRangePickerLifecycle['onPickerOpen']>[0] | null
  >(null);
  const onPickerOpen = useCallback<DateRangePickerLifecycle['onPickerOpen']>(
    (surface) => {
      calendarSurfaceRef.current = surface;
    },
    []
  );
  const onPickerClose = useCallback(() => {
    calendarSurfaceRef.current = null;
  }, []);
  const panelRefs = useRef<Array<HTMLDivElement | null>>([]);
  const anchorRefs = useRef(new Map<string, HTMLElement>());
  const hoverTimerRef = useRef<number | null>(null);
  const dateRangeEditingRef = useRef(false);
  
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
      dateRangeEditingRef.current = false;
      dispatch({ type: 'setPath', depth, id });
      if (focus) pendingFocusDepthRef.current = id ? depth + 1 : depth;
    },
    [clearHoverTimer]
  );

  const scheduleHover = useCallback(
    (depth: number, id: string | null) => {
      if (layout === 'drilldown') return;
      
      
      
      if (dateRangeEditingRef.current || calendarSurfaceRef.current) return;
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
      
      if (openNodes[depth - 1]?.kind === 'date-range') return;
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
    [closeLevel, setPathAt, openNodes]
  );

  useFilterMenuDismiss({
    triggerRef,
    layerRef,
    calendarSurfaceRef,
    onEscape: () => {
      if (calendarSurfaceRef.current) {
        calendarSurfaceRef.current.close();
      } else {
        closeLevel(openNodes.length);
      }
    },
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

  useFilterMenuGuideTarget({
    guideTour,
    depth: openNodes.length,
    position: positions[openNodes.length] ?? null,
    panelRefs,
  });

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
              onFocusCapture:
                node?.kind === 'date-range'
                  ? (event) => {
                      clearHoverTimer();
                      dateRangeEditingRef.current = true;
                      if (!event.currentTarget.contains(event.relatedTarget))
                        node.onActivate?.();
                    }
                  : undefined,
              onBack:
                layout === 'drilldown' && depth > 0
                  ? () => setPathAt(depth - 1, null, true)
                  : undefined,
            }}
            navigation={{
              openChildId: openPath[depth],
              onOpenChild: (childId, focus) =>
                setPathAt(depth, childId, focus || layout === 'drilldown'),
              onCloseChild: () => setPathAt(depth, null),
              onHoverRow: (childId) => scheduleHover(depth, childId),
              registerAnchor,
            }}
            title={title}
            canReset={canReset}
            onPickerOpen={onPickerOpen}
            onPickerClose={onPickerClose}
            onReset={() => {
              setPathAt(0, null, true);
              onReset();
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
