import { useEffect, useRef, type RefObject } from 'react';


export function useCloseOnOutsideMouseDown(
  rootRefs:
    | RefObject<HTMLElement | null>
    | ReadonlyArray<RefObject<HTMLElement | null>>,
  onOutside: () => void,
  enabled = true
): void {
  const onOutsideRef = useRef(onOutside);

  useEffect(() => {
    onOutsideRef.current = onOutside;
  }, [onOutside]);

  useEffect(() => {
    if (!enabled) return;

    const handleMouseDown = (event: MouseEvent) => {
      const target = event.target;
      const ActiveDocumentNode = window.activeDocument.defaultView?.Node;
      const roots = 'current' in rootRefs ? [rootRefs] : rootRefs;
      const inside =
        ActiveDocumentNode !== undefined &&
        target instanceof ActiveDocumentNode &&
        roots.some((root) => root.current?.contains(target));
      if (!inside) onOutsideRef.current();
    };

    const listenerDocument = window.activeDocument;
    listenerDocument.addEventListener('mousedown', handleMouseDown);
    return () =>
      listenerDocument.removeEventListener('mousedown', handleMouseDown);
  }, [enabled, rootRefs]);
}
