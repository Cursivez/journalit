import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { cssVars } from '../../styles/inlineStylePolicy';

interface StickyHeaderMetrics {
  left: number;
  portalContainer: Element;
  top: number;
  width: number;
}

export function useStickyHeader({
  containerRef,
  enabled,
  headerRef,
}: {
  containerRef: React.RefObject<HTMLElement | null>;
  enabled: boolean;
  headerRef: React.RefObject<HTMLElement | null>;
}): StickyHeaderMetrics | null {
  const [stickyHeader, setStickyHeader] = useState<StickyHeaderMetrics | null>(
    null
  );

  useEffect(() => {
    if (!enabled) {
      setStickyHeader(null);
      return;
    }

    const getNextStickyHeader = (): StickyHeaderMetrics | null => {
      const containerEl = containerRef.current;
      const headerEl = headerRef.current;
      if (!containerEl || !headerEl || !containerEl.isConnected) return null;

      const workspaceLeaf = containerEl.closest('.workspace-leaf');
      if (
        workspaceLeaf instanceof HTMLElement &&
        !workspaceLeaf.classList.contains('mod-active')
      ) {
        return null;
      }

      const containerRect = containerEl.getBoundingClientRect();
      const headerRect = headerEl.getBoundingClientRect();
      const scrollContainer = findScrollContainer(headerEl);
      const top = scrollContainer?.getBoundingClientRect().top ?? 0;
      const shouldStick =
        containerRect.top < top &&
        containerRect.bottom > top + headerRect.height;

      return shouldStick
        ? {
            left: containerRect.left,
            portalContainer:
              containerEl.closest('.modal-container') ??
              window.activeDocument.body,
            width: containerRect.width,
            top,
          }
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

export function StickyHeaderPortal({
  children,
  className,
  metrics,
}: {
  children: React.ReactNode;
  className?: string;
  metrics: StickyHeaderMetrics | null;
}) {
  if (!metrics) return null;

  return createPortal(
    <div
      className={['journalit-sticky-header-clone', className]
        .filter(Boolean)
        .join(' ')}
      style={cssVars({
        '--journalit-sticky-left': `${metrics.left}px`,
        '--journalit-sticky-width': `${metrics.width}px`,
        '--journalit-sticky-top': `${metrics.top}px`,
      })}
    >
      {children}
    </div>,
    metrics.portalContainer
  );
}

function findScrollContainer(element: HTMLElement): HTMLElement | null {
  let current = element.parentElement;
  while (current) {
    const overflowY = getComputedStyle(current).overflowY;
    if (
      (overflowY === 'auto' || overflowY === 'scroll') &&
      current.scrollHeight > current.clientHeight
    ) {
      return current;
    }
    current = current.parentElement;
  }
  return null;
}
