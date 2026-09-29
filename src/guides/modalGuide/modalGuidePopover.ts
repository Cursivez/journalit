

import type { GuideViewport } from '../viewGuidePopoverPosition';

export type ModalGuidePlacement = 'center' | 'auto' | 'right';

interface ModalGuidePopoverPosition {
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
  targetRect: DOMRect | null,
  popoverHeight: number,
  viewport: GuideViewport
): ModalGuidePopoverPosition {
  if (placement === 'center' || !targetRect) {
    return { top: '50%', left: '50%', highlight: null, anchored: false };
  }

  const gap = 10;
  const popoverWidth = Math.min(340, viewport.width - 24);
  let top = targetRect.bottom + gap;
  let left = targetRect.left;

  if (placement === 'right') {
    top = targetRect.top + targetRect.height / 2 - popoverHeight / 2;
    left = targetRect.right + gap;
  }

  
  
  if (
    placement === 'auto' &&
    top + popoverHeight > viewport.height - 12 &&
    targetRect.top - gap - popoverHeight >= 12
  ) {
    top = targetRect.top - gap - popoverHeight;
  }

  if (left + popoverWidth > viewport.width - 12) {
    left = Math.max(12, targetRect.left - popoverWidth - gap);
  }
  if (left < 12) left = 12;
  if (top < 12) top = 12;
  if (top + popoverHeight > viewport.height - 12) {
    top = Math.max(12, viewport.height - popoverHeight - 12);
  }

  return {
    top: `${top}px`,
    left: `${left}px`,
    highlight: targetRect,
    anchored: true,
  };
}
