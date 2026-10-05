export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right' | 'auto';


export function calculateTooltipPosition({
  triggerRect,
  tooltipRect,
  preferredPosition,
  viewportWidth,
  viewportHeight,
}: {
  triggerRect: Pick<
    DOMRect,
    'top' | 'bottom' | 'left' | 'right' | 'width' | 'height'
  >;
  tooltipRect: Pick<DOMRect, 'width' | 'height'>;
  preferredPosition: TooltipPosition;
  viewportWidth: number;
  viewportHeight: number;
}): { top: number; left: number } {
  const gap = 8;
  let top = 0;
  let left = 0;
  const isSmallTrigger = triggerRect.width < 50 && triggerRect.height < 50;
  const effectivePosition =
    isSmallTrigger && preferredPosition === 'auto' ? 'top' : preferredPosition;

  switch (effectivePosition) {
    case 'right':
      top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
      left = triggerRect.right + gap;
      if (left + tooltipRect.width > viewportWidth - 16) {
        left = triggerRect.left - tooltipRect.width - gap;
      }
      break;
    case 'left':
      top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
      left = triggerRect.left - tooltipRect.width - gap;
      if (left < 16) left = triggerRect.right + gap;
      break;
    case 'bottom':
      top = triggerRect.bottom + gap;
      left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
      break;
    case 'top':
    default:
      top = triggerRect.top - tooltipRect.height - gap;
      left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
      if (top < 16) top = triggerRect.bottom + gap;
      break;
  }

  const margin = 16;
  if (left < margin) left = margin;
  if (left + tooltipRect.width > viewportWidth - margin) {
    left = viewportWidth - tooltipRect.width - margin;
  }
  if (top < margin) top = margin;
  if (top + tooltipRect.height > viewportHeight - margin) {
    top = viewportHeight - tooltipRect.height - margin;
  }
  return { top, left };
}
