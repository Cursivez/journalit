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
