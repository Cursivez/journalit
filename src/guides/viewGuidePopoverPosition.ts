

import type { GuideStepDefinition } from './types';


export interface GuideViewport {
  width: number;
  height: number;
}

export const getWindowViewport = (win: Window): GuideViewport => ({
  width: win.innerWidth,
  height: win.innerHeight,
});

export const getAnchoredPopoverPosition = (
  targetRect: DOMRect,
  popoverHeight: number,
  viewport: GuideViewport,
  placement: GuideStepDefinition['placement'] = 'auto'
): { top: number; left: number } => {
  const gap = 10;
  const viewportWidth = viewport.width;
  const viewportHeight = viewport.height;
  const popoverWidth = Math.min(340, viewportWidth - 24);

  if (placement === 'right' || placement === 'right-top') {
    let top =
      placement === 'right-top'
        ? targetRect.top
        : targetRect.top + targetRect.height / 2 - popoverHeight / 2;
    let left = targetRect.right + gap;

    if (left + popoverWidth > viewportWidth - 12) {
      left = Math.max(12, targetRect.left - popoverWidth - gap);
    }

    if (top < 12) {
      top = 12;
    }

    if (top + popoverHeight > viewportHeight - 12) {
      top = Math.max(12, viewportHeight - popoverHeight - 12);
    }

    return { top, left };
  }

  if (placement === 'left') {
    let top = targetRect.top + targetRect.height / 2 - popoverHeight / 2;
    let left = targetRect.left - popoverWidth - gap;

    if (left < 12) {
      left = Math.min(
        viewportWidth - popoverWidth - 12,
        targetRect.right + gap
      );
    }

    if (top < 12) {
      top = 12;
    }

    if (top + popoverHeight > viewportHeight - 12) {
      top = Math.max(12, viewportHeight - popoverHeight - 12);
    }

    return { top, left };
  }

  let top = targetRect.bottom + gap;
  let left = targetRect.left;

  if (left + popoverWidth > viewportWidth - 12) {
    left = viewportWidth - popoverWidth - 12;
  }

  if (left < 12) {
    left = 12;
  }

  
  
  
  if (top + popoverHeight > viewportHeight - 12) {
    const above = targetRect.top - gap - popoverHeight;
    top =
      above >= 12 ? above : Math.max(12, viewportHeight - popoverHeight - 12);
  }

  return { top, left };
};
