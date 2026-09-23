

export type ModalGuidePlacement = 'center' | 'auto' | 'right';

export interface ModalGuidePopoverPosition {
  top: string;
  left: string;
  highlight: DOMRect | null;
  anchored: boolean;
}

export const getModalGuideTargetElement = (
  selector?: string
): HTMLElement | null => {
  if (!selector) return null;
  return window.activeDocument.querySelector<HTMLElement>(selector);
};

export function getModalGuidePopoverPosition(
  placement: ModalGuidePlacement | undefined,
  targetRect: DOMRect | null
): ModalGuidePopoverPosition {
  if (placement === 'center' || !targetRect) {
    return { top: '50%', left: '50%', highlight: null, anchored: false };
  }

  const gap = 10;
  const popoverWidth = Math.min(340, window.innerWidth - 24);
  const estimatedHeight = 170;
  let top = targetRect.bottom + gap;
  let left = targetRect.left;

  if (placement === 'right') {
    top = targetRect.top + targetRect.height / 2 - estimatedHeight / 2;
    left = targetRect.right + gap;
  }

  
  
  if (
    placement === 'auto' &&
    top + estimatedHeight > window.innerHeight - 12 &&
    targetRect.top - gap - estimatedHeight >= 12
  ) {
    top = targetRect.top - gap - estimatedHeight;
  }

  if (left + popoverWidth > window.innerWidth - 12) {
    left = Math.max(12, targetRect.left - popoverWidth - gap);
  }
  if (left < 12) left = 12;
  if (top < 12) top = 12;
  if (top + estimatedHeight > window.innerHeight - 12) {
    top = Math.max(12, window.innerHeight - estimatedHeight - 12);
  }

  return {
    top: `${top}px`,
    left: `${left}px`,
    highlight: targetRect,
    anchored: true,
  };
}
