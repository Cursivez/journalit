


const DATE_LABEL_WIDTH_PX = 56;

const DATE_LABEL_GAP_PX = 8;
const DATE_LABEL_SLOT_PX = DATE_LABEL_WIDTH_PX + DATE_LABEL_GAP_PX;

const EDGE_CLEARANCE_PX = DATE_LABEL_SLOT_PX + DATE_LABEL_WIDTH_PX / 2;

export interface PlotBounds {
  left: number;
  right: number;
}


export function evenDateTicks<T>(keys: readonly T[], plot: PlotBounds): T[] {
  const plotWidth = plot.right - plot.left;
  const lastIndex = keys.length - 1;
  if (lastIndex < 1) return [...keys];
  if (plotWidth <= 0) return [];
  
  if (plotWidth < 2 * DATE_LABEL_WIDTH_PX + DATE_LABEL_GAP_PX) {
    return [keys[lastIndex]];
  }

  const pxPerPoint = plotWidth / lastIndex;
  const lo = Math.ceil(EDGE_CLEARANCE_PX / pxPerPoint);
  const hi = Math.floor((plotWidth - EDGE_CLEARANCE_PX) / pxPerPoint);
  const inner: T[] = [];
  if (lo <= hi) {
    
    const minStep = Math.ceil(DATE_LABEL_SLOT_PX / pxPerPoint);
    const count = Math.floor((hi - lo) / minStep) + 1;
    if (count === 1) {
      inner.push(keys[Math.round((lo + hi) / 2)]);
    } else {
      const step = (hi - lo) / (count - 1);
      for (let i = 0; i < count; i++) {
        inner.push(keys[lo + Math.round(i * step)]);
      }
    }
  }
  return [keys[0], ...inner, keys[lastIndex]];
}


export function dateTickAnchor(
  x: number,
  plot: PlotBounds
): 'start' | 'middle' | 'end' {
  const half = DATE_LABEL_WIDTH_PX / 2;
  if (x + half > plot.right) return 'end';
  if (x - half < plot.left) return 'start';
  return 'middle';
}
