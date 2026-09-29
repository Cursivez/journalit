
const ANCHOR_FRAMES = 3;


export function keepReviewItemHeaderInPlaceOnCollapse(
  currentItem: HTMLElement | null
): void {
  if (!currentItem) return;

  const header = findReviewHeader(currentItem) ?? currentItem;
  const scrollContainer = findReviewScrollContainer(currentItem);
  if (!scrollContainer) return;

  const containerTop = scrollContainer.getBoundingClientRect().top;
  const maxAnchorTop = Math.max(
    0,
    scrollContainer.clientHeight - header.getBoundingClientRect().height
  );
  const anchorTop = Math.min(
    Math.max(header.getBoundingClientRect().top - containerTop, 0),
    maxAnchorTop
  );

  scrollContainer.classList.add('journalit-review-scroll-anchor-disabled');
  
  
  const view = scrollContainer.win;

  let remainingFrames = ANCHOR_FRAMES;
  const correct = () => {
    const offset =
      header.getBoundingClientRect().top -
      scrollContainer.getBoundingClientRect().top -
      anchorTop;
    if (Math.abs(offset) >= 1) {
      scrollContainer.scrollTop += offset;
    }

    remainingFrames -= 1;
    if (remainingFrames > 0) {
      view.requestAnimationFrame(correct);
      return;
    }
    scrollContainer.classList.remove('journalit-review-scroll-anchor-disabled');
  };

  view.requestAnimationFrame(correct);
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
  
  return scrollContainer?.instanceOf(HTMLElement) ? scrollContainer : null;
}
