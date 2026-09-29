

const sameRect = (a: DOMRect, b: DOMRect): boolean =>
  a.top === b.top &&
  a.left === b.left &&
  a.width === b.width &&
  a.height === b.height;


export const trackElementRects = (
  elements: readonly [HTMLElement, ...HTMLElement[]],
  onChange: (rects: DOMRect[]) => void
): (() => void) => {
  
  
  const win = elements[0].ownerDocument.defaultView ?? window;
  let previousRects: DOMRect[] | null = null;
  let previousViewport = '';
  let frame = 0;
  let cancelled = false;

  const read = () => {
    const rects = elements.map((element) => element.getBoundingClientRect());
    const viewport = `${win.innerWidth}x${win.innerHeight}`;
    const lastRects = previousRects;
    if (
      !lastRects ||
      viewport !== previousViewport ||
      rects.some((rect, index) => !sameRect(rect, lastRects[index]))
    ) {
      previousRects = rects;
      previousViewport = viewport;
      onChange(rects);
    }
    if (!cancelled) {
      frame = win.requestAnimationFrame(read);
    }
  };

  read();

  return () => {
    cancelled = true;
    win.cancelAnimationFrame(frame);
  };
};
