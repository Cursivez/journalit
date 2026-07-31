import { useEffect, useRef, type RefObject } from 'react';

export function useCloseOnOutsideMouseDown(
  rootRef: RefObject<HTMLElement | null>,
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
      if (
        !rootRef.current ||
        !ActiveDocumentNode ||
        !(target instanceof ActiveDocumentNode) ||
        !rootRef.current.contains(target)
      ) {
        onOutsideRef.current();
      }
    };

    window.activeDocument.addEventListener('mousedown', handleMouseDown);
    return () =>
      window.activeDocument.removeEventListener('mousedown', handleMouseDown);
  }, [enabled, rootRef]);
}
