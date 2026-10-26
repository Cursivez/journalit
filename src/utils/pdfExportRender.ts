
const OBSIDIAN_PRINT_CONTAINER_SELECTOR = '.print';

export function isInPdfExportRender(element: Element): boolean {
  return element.closest(OBSIDIAN_PRINT_CONTAINER_SELECTOR) !== null;
}
