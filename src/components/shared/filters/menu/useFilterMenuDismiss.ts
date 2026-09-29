

import { type RefObject, useEffect, useEffectEvent } from 'react';

interface UseFilterMenuDismissInput {
  triggerRef: RefObject<HTMLElement | null>;
  layerRef: RefObject<HTMLElement | null>;
  onEscape: () => void;
  onDismiss: () => void;
  onReflow: () => void;
}


export function useFilterMenuDismiss({
  triggerRef,
  layerRef,
  onEscape,
  onDismiss,
  onReflow,
}: UseFilterMenuDismissInput): void {
  
  
  
  
  const handleKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    event.stopPropagation();
    onEscape();
  });
  const dismiss = useEffectEvent(() => onDismiss());
  const reflow = useEffectEvent(() => onReflow());

  useEffect(() => {
    const trigger = triggerRef.current;
    const ownerDocument = trigger?.ownerDocument;
    const ownerWindow = ownerDocument?.defaultView;
    if (!ownerDocument || !ownerWindow) return;

    const isInsideMenu = (target: EventTarget | null): boolean =>
      target instanceof ownerWindow.Node &&
      Boolean(trigger?.contains(target) || layerRef.current?.contains(target));

    const onPointerDown = (event: MouseEvent) => {
      if (!isInsideMenu(event.target)) dismiss();
    };
    
    const onFocusIn = (event: FocusEvent) => {
      if (!isInsideMenu(event.target)) dismiss();
    };
    const onBlur = () => dismiss();
    const onScroll = (event: Event) => {
      if (!(event.target instanceof ownerWindow.Node)) return;
      if (layerRef.current?.contains(event.target)) return;
      reflow();
    };
    const onResize = () => reflow();

    ownerDocument.addEventListener('keydown', handleKeyDown, true);
    ownerDocument.addEventListener('mousedown', onPointerDown, true);
    ownerDocument.addEventListener('focusin', onFocusIn);
    ownerDocument.addEventListener('scroll', onScroll, true);
    ownerWindow.addEventListener('resize', onResize);
    ownerWindow.addEventListener('blur', onBlur);
    return () => {
      ownerDocument.removeEventListener('keydown', handleKeyDown, true);
      ownerDocument.removeEventListener('mousedown', onPointerDown, true);
      ownerDocument.removeEventListener('focusin', onFocusIn);
      ownerDocument.removeEventListener('scroll', onScroll, true);
      ownerWindow.removeEventListener('resize', onResize);
      ownerWindow.removeEventListener('blur', onBlur);
    };
  }, [layerRef, triggerRef]);
}
