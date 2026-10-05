import {
  useEffect,
  useEffectEvent,
  useLayoutEffect,
  type RefObject,
} from 'react';
import { Scope } from 'obsidian';
import { getPluginInstance } from '../../../utils/pluginContext';


export function usePopupDismiss({
  isOpen,
  rootRef,
  popupRef,
  onDismiss,
  onEscape,
}: {
  isOpen: boolean;
  rootRef: RefObject<HTMLElement | null>;
  popupRef: RefObject<HTMLElement | null>;
  onDismiss: () => void;
  onEscape: () => void;
}) {
  const dismiss = useEffectEvent(onDismiss);
  const escape = useEffectEvent((event: KeyboardEvent) => {
    if (event.isComposing) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    onEscape();
    return false;
  });

  useLayoutEffect(() => {
    if (!isOpen) return;
    const app = getPluginInstance()?.app;
    if (!app) return;
    
    
    
    const scope = new Scope(
      rootRef.current?.closest('.modal-container') ? undefined : app.scope
    );
    scope.register(null, 'Escape', (event) => escape(event));
    app.keymap.pushScope(scope);
    return () => app.keymap.popScope(scope);
  }, [isOpen, rootRef]);

  useEffect(() => {
    if (!isOpen) return;
    const doc = rootRef.current?.ownerDocument;
    const ownerWindow = doc?.defaultView;
    if (!doc || !ownerWindow) return;

    const onOutsideInteraction = (event: Event) => {
      const path = event.composedPath();
      const root = rootRef.current;
      const popup = popupRef.current;
      if (!(root && path.includes(root)) && !(popup && path.includes(popup))) {
        dismiss();
      }
    };
    const onWindowBlur = () => dismiss();
    
    
    doc.addEventListener('pointerdown', onOutsideInteraction, true);
    doc.addEventListener('focusin', onOutsideInteraction);
    ownerWindow.addEventListener('blur', onWindowBlur);
    return () => {
      doc.removeEventListener('pointerdown', onOutsideInteraction, true);
      doc.removeEventListener('focusin', onOutsideInteraction);
      ownerWindow.removeEventListener('blur', onWindowBlur);
    };
  }, [isOpen, rootRef, popupRef]);
}
