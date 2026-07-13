

const ESCAPE_DELEGATED_SURFACE_SELECTORS = [
  '#journalit-fullscreen-portal:not(:empty)',
  '.journalit-fullscreen-portal-container:not(:empty)',
  '.journalit-shared-selector-overlay',
  '.journalit-component-selector-overlay',
  '.journalit-widget-picker-overlay',
  '.widget-picker-dropdown--floating',
  '.journalit-modal-overlay',
  '.journalit-combobox[data-is-open="true"]',
  '.journalit-combobox.combobox-dropdown--portal',
  '.folder-browser-dropdown',
  '.journalit-trade-import-dropdown-menu--portal',
  '.journalit-trade-import-template-menu--portal',
  '.modal-container',
  '.suggestion-container',
  '.menu',
];

interface ReactViewEscapeSuppressionContext {
  active: boolean;
  viewDocument: Document;
}

export function hasDelegatedEscapeSurface(viewDocument: Document): boolean {
  return ESCAPE_DELEGATED_SURFACE_SELECTORS.some((selector) =>
    Boolean(viewDocument.querySelector(selector))
  );
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
