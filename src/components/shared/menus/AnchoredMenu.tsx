import React, { useEffect, useEffectEvent, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cssVars } from '../../../styles/inlineStylePolicy';
import {
  useAnchoredMenuPosition,
  type AnchoredMenuWidth,
} from './useAnchoredMenuPosition';

interface RefCurrent<T> {
  readonly current: T | null;
}

interface AnchoredMenuProps {
  isOpen: boolean;
  triggerRef: RefCurrent<HTMLElement>;
  onClose: () => void;
  className?: string;
  role?: React.AriaRole;
  ariaLabel?: string;
  width?: AnchoredMenuWidth;
  minWidth?: number;
  maxWidth?: number;
  maxHeight?: number;
  children: React.ReactNode;
}

function resolveFocusTarget(trigger: HTMLElement): HTMLElement {
  const focusable = trigger.querySelector<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  return focusable ?? trigger;
}

export function AnchoredMenu({
  isOpen,
  triggerRef,
  onClose,
  className,
  role,
  ariaLabel,
  width = 'trigger',
  minWidth = 150,
  maxWidth,
  maxHeight = 280,
  children,
}: AnchoredMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const position = useAnchoredMenuPosition({
    isOpen,
    triggerRef,
    menuRef,
    width,
    minWidth,
    maxWidth,
    maxHeight,
  });
  const closeFromOutsidePress = useEffectEvent(() => onClose());

  useEffect(() => {
    if (!isOpen) return;
    const ownerDocument = triggerRef.current?.ownerDocument;
    const ownerWindow = ownerDocument?.defaultView;
    if (!ownerDocument || !ownerWindow) return;

    const closeOnOutsidePress = (event: MouseEvent) => {
      const target = event.target;
      const NodeConstructor = ownerDocument.defaultView?.Node ?? Node;
      if (
        !(target instanceof NodeConstructor) ||
        (!triggerRef.current?.contains(target) &&
          !menuRef.current?.contains(target))
      ) {
        closeFromOutsidePress();
      }
    };
    const closeOnWindowBlur = () => closeFromOutsidePress();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      event.stopPropagation();
      const trigger = triggerRef.current;
      closeFromOutsidePress();
      if (!trigger) return;
      const focusTarget = resolveFocusTarget(trigger);
      window.requestAnimationFrame(() => focusTarget.focus());
    };

    ownerDocument.addEventListener('mousedown', closeOnOutsidePress);
    ownerDocument.addEventListener('keydown', closeOnEscape, true);
    ownerWindow.addEventListener('blur', closeOnWindowBlur);
    return () => {
      ownerDocument.removeEventListener('mousedown', closeOnOutsidePress);
      ownerDocument.removeEventListener('keydown', closeOnEscape, true);
      ownerWindow.removeEventListener('blur', closeOnWindowBlur);
    };
  }, [isOpen, triggerRef]);

  
  
  
  
  
  useEffect(() => {
    if (!isOpen) return;
    const trigger = triggerRef.current;
    const focusFirstItem = window.setTimeout(() => {
      const menu = menuRef.current;
      if (!menu) return;
      const first = menu.querySelector<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      first?.focus();
    }, 0);
    const menuAtOpen = menuRef.current;
    return () => {
      window.clearTimeout(focusFirstItem);
      const active = trigger?.ownerDocument.activeElement ?? null;
      if (menuAtOpen && active && menuAtOpen.contains(active)) {
        trigger?.focus?.();
      }
    };
  }, [isOpen, triggerRef]);

  if (!isOpen) return null;

  const portalRoot =
    triggerRef.current?.ownerDocument.body ?? window.activeDocument.body;
  const cssWidth =
    width === 'content' && position.width === 0
      ? 'max-content'
      : `${position.width}px`;

  return createPortal(
    <div
      ref={menuRef}
      className={['journalit-anchored-menu', className]
        .filter(Boolean)
        .join(' ')}
      role={role}
      aria-label={ariaLabel}
      style={cssVars({
        '--journalit-anchored-menu-top': `${position.top}px`,
        '--journalit-anchored-menu-left': `${position.left}px`,
        '--journalit-anchored-menu-width': cssWidth,
        '--journalit-anchored-menu-max-height': `${position.maxHeight}px`,
      })}
    >
      {children}
    </div>,
    portalRoot
  );
}
