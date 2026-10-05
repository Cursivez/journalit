export function getEmbeddedReviewAncestorSources(
  element: HTMLElement
): string[] {
  const sources: string[] = [];
  let container = element.closest('[data-journalit-review-source]');
  while (container) {
    const source = container.getAttribute('data-journalit-review-source');
    if (source !== null) sources.push(source);
    container =
      container.parentElement?.closest('[data-journalit-review-source]') ??
      null;
  }
  return sources;
}
