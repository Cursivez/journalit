import {
  useLayoutEffect,
  useRef,
  useState,
  type DependencyList,
  type RefObject,
} from 'react';

export interface SlidingThumb {
  left: number;
  width: number;
}


export function useSlidingThumb(
  activeSelector: string,
  dependencies: DependencyList
): {
  containerRef: RefObject<HTMLDivElement | null>;
  thumb: SlidingThumb | null;
} {
  const containerRef = useRef<HTMLDivElement>(null);
  const [thumb, setThumb] = useState<SlidingThumb | null>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const measure = () => {
      const active = container.querySelector<HTMLElement>(activeSelector);
      if (!active) {
        setThumb(null);
        return;
      }

      
      setThumb((current) => {
        const next = { left: active.offsetLeft, width: active.offsetWidth };
        return current &&
          current.left === next.left &&
          current.width === next.width
          ? current
          : next;
      });
    };

    measure();
    
    if (typeof ResizeObserver === 'undefined') return;
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- the caller's list stands in for what is read from the DOM
  }, [activeSelector, ...dependencies]);

  return { containerRef, thumb };
}
