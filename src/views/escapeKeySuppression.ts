

import { OPEN_FULLSCREEN_PORTAL_SELECTORS } from '../components/image/fullscreenPortalPresence';


export const ESCAPE_DELEGATE_ATTRIBUTE = 'data-journalit-escape-delegate';

const ESCAPE_DELEGATED_SURFACE_SELECTOR = [
  ...OPEN_FULLSCREEN_PORTAL_SELECTORS,
  '.journalit-shared-selector-overlay',
  '.journalit-widget-picker-overlay',
  '.widget-picker-dropdown--floating',
  '.journalit-modal-overlay',
  '.journalit-combobox[data-is-open="true"]',
  '.journalit-combobox.combobox-dropdown--portal',
  '.journalit-folder-browser-dropdown',
  '.journalit-trade-import-dropdown-menu--portal',
  '.journalit-trade-import-template-menu--portal',
  '.modal-container',
  '.suggestion-container',
  '.menu',
  `[${ESCAPE_DELEGATE_ATTRIBUTE}="true"]`,
].join(',');

interface ReactViewEscapeSuppressionContext {
  active: boolean;
  viewDocument: Document;
}

export function hasDelegatedEscapeSurface(
  viewDocument: Document,
  excludedSurface: Element | null = null,
  eventPath: EventTarget[] = []
): boolean {
  
  
  const ElementCtor = viewDocument.defaultView?.Element ?? Element;
  for (const target of eventPath) {
    if (
      target instanceof ElementCtor &&
      target !== excludedSurface &&
      target.matches(ESCAPE_DELEGATED_SURFACE_SELECTOR)
    )
      return true;
  }
  for (const surface of viewDocument.querySelectorAll(
    ESCAPE_DELEGATED_SURFACE_SELECTOR
  )) {
    if (surface !== excludedSurface) return true;
  }
  return false;
}

function isEditableEscapeTarget(
  target: EventTarget | null,
  viewDocument: Document
): boolean {
  const ElementCtor = viewDocument.defaultView?.Element ?? Element;
  if (!(target instanceof ElementCtor)) {
    return false;
  }

  return Boolean(
    target.closest(
      'input, textarea, select, [contenteditable="true"], [role="textbox"], [role="combobox"], [role="searchbox"]'
    )
  );
}

export function shouldSuppressEscapeForReactView(
  event: KeyboardEvent,
  context: ReactViewEscapeSuppressionContext
): boolean {
  if (event.key !== 'Escape') {
    return false;
  }

  if (!context.active) {
    return false;
  }

  if (isEditableEscapeTarget(event.target, context.viewDocument)) {
    return false;
  }

  if (hasDelegatedEscapeSurface(context.viewDocument)) {
    return false;
  }

  return true;
}
