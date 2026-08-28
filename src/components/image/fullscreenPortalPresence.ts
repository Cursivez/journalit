

export const OPEN_FULLSCREEN_PORTAL_SELECTORS = [
  '#journalit-fullscreen-portal:not(:empty)',
  '.journalit-fullscreen-portal-container:not(:empty)',
] as const;

export function hasOpenFullscreenPortal(viewDocument: Document): boolean {
  return OPEN_FULLSCREEN_PORTAL_SELECTORS.some((selector) =>
    Boolean(viewDocument.querySelector(selector))
  );
}
