import { useLayoutEffect, useState } from 'react';


export function anchoredMenuPortalRoot(
  trigger: HTMLElement | null
): HTMLElement {
  return (
    trigger?.closest<HTMLElement>('.modal-container') ??
    trigger?.ownerDocument.body ??
    window.activeDocument.body
  );
}

type AnchoredMenuWidth = 'trigger' | 'content' | number;

interface RefCurrent<T> {
  readonly current: T | null;
}

interface UseAnchoredMenuPositionOptions {
  isOpen: boolean;
  triggerRef: RefCurrent<HTMLElement>;
  menuRef: RefCurrent<HTMLElement>;
  width?: AnchoredMenuWidth;
  maxHeight?: number;
  minWidth?: number;
  maxWidth?: number;
}

interface AnchoredMenuPosition {
  top: number;
  left: number;
  width: number;
  maxHeight: number;
  openUpward: boolean;
}

const VIEWPORT_MARGIN = 8;
const FLIP_THRESHOLD = 180;
const MIN_MAX_HEIGHT = 96;
const MENU_GAP = 4;

export function useAnchoredMenuPosition({
  isOpen,
  triggerRef,
  menuRef,
  width = 'trigger',
  maxHeight = 280,
  minWidth,
  maxWidth,
}: UseAnchoredMenuPositionOptions): AnchoredMenuPosition {
  const [position, setPosition] = useState<AnchoredMenuPosition>({
    top: 0,
    left: 0,
    width: 0,
    maxHeight,
    openUpward: false,
  });

  useLayoutEffect(() => {
    if (!isOpen) return;

    const updatePosition = () => {
      const trigger = triggerRef.current;
      if (!trigger) return;

      const rect = trigger.getBoundingClientRect();
      const ownerWindow = trigger.ownerDocument.defaultView ?? window;
      const viewportHeight = ownerWindow.innerHeight;
      const viewportWidth = ownerWindow.innerWidth;
      const viewportCap = Math.max(0, viewportWidth - VIEWPORT_MARGIN * 2);

      let resolvedMenuWidth: number;
      if (width === 'content') {
        const menu = menuRef.current;
        const measuredWidth = menu
          ? Math.max(menu.scrollWidth, menu.getBoundingClientRect().width)
          : rect.width;
        resolvedMenuWidth = Math.max(measuredWidth, rect.width);
      } else if (typeof width === 'number') {
        resolvedMenuWidth = width;
      } else {
        resolvedMenuWidth = rect.width;
      }

      if (minWidth != null) {
        resolvedMenuWidth = Math.max(resolvedMenuWidth, minWidth);
      }
      if (maxWidth != null) {
        resolvedMenuWidth = Math.min(
          resolvedMenuWidth,
          maxWidth,
          viewportWidth * 0.8
        );
      }
      resolvedMenuWidth = Math.min(resolvedMenuWidth, viewportCap);

      const spaceBelow = viewportHeight - rect.bottom - VIEWPORT_MARGIN;
      const spaceAbove = rect.top - VIEWPORT_MARGIN;
      const openUpward = spaceBelow < FLIP_THRESHOLD && spaceAbove > spaceBelow;
      const clampedMaxHeight = Math.max(
        MIN_MAX_HEIGHT,
        Math.min(maxHeight, openUpward ? spaceAbove : spaceBelow)
      );
      
      
      const measuredHeight = menuRef.current?.getBoundingClientRect().height;
      const menuHeight = measuredHeight
        ? Math.min(measuredHeight, clampedMaxHeight)
        : clampedMaxHeight;

      setPosition({
        top: openUpward
          ? Math.max(VIEWPORT_MARGIN, rect.top - menuHeight - MENU_GAP)
          : rect.bottom + MENU_GAP,
        left: Math.max(
          VIEWPORT_MARGIN,
          Math.min(
            rect.left,
            viewportWidth - resolvedMenuWidth - VIEWPORT_MARGIN
          )
        ),
        width: resolvedMenuWidth,
        maxHeight: clampedMaxHeight,
        openUpward,
      });
    };

    updatePosition();
    const ownerDocument = triggerRef.current?.ownerDocument;
    const ownerWindow = ownerDocument?.defaultView ?? window;
    if (!ownerDocument) return;

    ownerDocument.addEventListener('scroll', updatePosition, true);
    ownerWindow.addEventListener('resize', updatePosition);
    return () => {
      ownerDocument.removeEventListener('scroll', updatePosition, true);
      ownerWindow.removeEventListener('resize', updatePosition);
    };
  }, [isOpen, maxHeight, maxWidth, menuRef, minWidth, triggerRef, width]);

  return position;
}
