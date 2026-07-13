import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { cssVars } from '../../../../styles/inlineStylePolicy';

interface StickyReviewHeaderMetrics {
  left: number;
  top: number;
  width: number;
}

export function useStickyReviewHeader({
  containerRef,
  enabled,
  headerRef,
}: {
  containerRef: React.RefObject<HTMLElement | null>;
  enabled: boolean;
  headerRef: React.RefObject<HTMLElement | null>;
}): StickyReviewHeaderMetrics | null {
  const [stickyHeader, setStickyHeader] =
    useState<StickyReviewHeaderMetrics | null>(null);

  useEffect(() => {
    if (!enabled) {
      setStickyHeader(null);
      return;
    }

    const getNextStickyHeader = (): StickyReviewHeaderMetrics | null => {
      const containerEl = containerRef.current;
      const headerEl = headerRef.current;
      if (!containerEl || !headerEl || !containerEl.isConnected) {
        return null;
      }

      const workspaceLeaf = containerEl.closest('.workspace-leaf');
      if (
        workspaceLeaf instanceof HTMLElement &&
        !workspaceLeaf.classList.contains('mod-active')
      ) {
        return null;
      }

      const containerRect = containerEl.getBoundingClientRect();
      const headerRect = headerEl.getBoundingClientRect();
      const scrollContainer = headerEl.closest(
        '.cm-scroller, .markdown-preview-view, .markdown-reading-view'
      );
      const top = scrollContainer?.getBoundingClientRect().top ?? 0;
      const shouldStick =
        containerRect.top < top &&
        containerRect.bottom > top + headerRect.height;

      return shouldStick
        ? { left: containerRect.left, width: containerRect.width, top }
        : null;
    };

    const updateStickyHeader = () => {
      setStickyHeader(getNextStickyHeader());
    };

    updateStickyHeader();
    window.addEventListener('scroll', updateStickyHeader, true);
    window.addEventListener('resize', updateStickyHeader);
    window.activeDocument.addEventListener(
      'visibilitychange',
      updateStickyHeader
    );

    const containerEl = containerRef.current;
    const workspaceRoot =
      containerEl?.closest('.workspace') ?? window.activeDocument.body;
    const activeLeafObserver = new MutationObserver(updateStickyHeader);
    activeLeafObserver.observe(workspaceRoot, {
      attributes: true,
      attributeFilter: ['class'],
      subtree: true,
    });

    return () => {
      activeLeafObserver.disconnect();
      window.removeEventListener('scroll', updateStickyHeader, true);
      window.removeEventListener('resize', updateStickyHeader);
      window.activeDocument.removeEventListener(
        'visibilitychange',
        updateStickyHeader
      );
    };
  }, [containerRef, enabled, headerRef]);

  return stickyHeader;
}

export function StickyReviewHeaderPortal({
  children,
  className,
  metrics,
}: {
  children: React.ReactNode;
  className?: string;
  metrics: StickyReviewHeaderMetrics | null;
}) {
  if (!metrics) return null;

  return createPortal(
    <div
      className={['journalit-review-sticky-header-clone', className]
        .filter(Boolean)
        .join(' ')}
      style={cssVars({
        '--journalit-review-sticky-left': `${metrics.left}px`,
        '--journalit-review-sticky-width': `${metrics.width}px`,
        '--journalit-review-sticky-top': `${metrics.top}px`,
      })}
    >
      {children}
    </div>,
    window.activeDocument.body
  );
}

export function scrollToNextReviewItemAfterCollapse(
  currentItem: HTMLElement | null,
  nextItemKey?: string
): void {
  if (!currentItem) return;

  const nextItem = findNextReviewItem(currentItem, nextItemKey);
  const scrollTarget = nextItem instanceof HTMLElement ? nextItem : currentItem;
  const headerTarget = findReviewHeader(scrollTarget) ?? scrollTarget;
  const scrollContainer = findReviewScrollContainer(currentItem);
  if (scrollContainer) {
    scrollContainer.classList.add('journalit-review-scroll-anchor-disabled');
  }

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      if (scrollContainer instanceof HTMLElement) {
        const targetRect = headerTarget.getBoundingClientRect();
        const containerRect = scrollContainer.getBoundingClientRect();
        scrollContainer.scrollTo({
          top: scrollContainer.scrollTop + targetRect.top - containerRect.top,
          behavior: 'auto',
        });
        window.requestAnimationFrame(() => {
          scrollContainer.classList.remove(
            'journalit-review-scroll-anchor-disabled'
          );
        });
        return;
      }

      headerTarget.scrollIntoView({ block: 'start', behavior: 'auto' });
    });
  });
}

function findNextReviewItem(
  currentItem: HTMLElement,
  nextItemKey?: string
): Element | null {
  if (nextItemKey) {
    const parent = currentItem.parentElement;
    const keyedItem = Array.from(
      parent?.querySelectorAll('[data-journalit-review-item-key]') ?? []
    ).find(
      (item) =>
        item.getAttribute('data-journalit-review-item-key') === nextItemKey
    );
    if (keyedItem) return keyedItem;
  }

  return currentItem.nextElementSibling;
}

function findReviewHeader(item: HTMLElement): HTMLElement | null {
  return item.querySelector(
    '.journalit-trade-review-card-header, .journalit-weekly-drc-summary'
  );
}

function findReviewScrollContainer(item: HTMLElement): HTMLElement | null {
  const scrollContainer = item.closest(
    '.cm-scroller, .markdown-preview-view, .markdown-reading-view'
  );
  return scrollContainer instanceof HTMLElement ? scrollContainer : null;
}
