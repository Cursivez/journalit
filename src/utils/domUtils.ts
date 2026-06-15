function handleDropdownDocumentMouseDown(event: MouseEvent): void {
  if (window.__isHandlingComboBoxRemove) return;

  window.__isHandlingComboBoxRemove = true;
  try {
    const registeredDocument = window.__dropdownClickHandlerDocument;
    if (!registeredDocument) return;

    const openDropdowns = registeredDocument.querySelectorAll(
      '[data-is-open="true"], [data-combobox-type][aria-expanded="true"]'
    );
    if (openDropdowns.length === 0) return;

    const target = event.target;
    const RegisteredDocumentNode = registeredDocument.defaultView?.Node;
    if (!RegisteredDocumentNode || !(target instanceof RegisteredDocumentNode))
      return;

    for (const dropdown of openDropdowns) {
      if (dropdown.contains(target)) return;
    }

    openDropdowns.forEach((dropdown) => {
      const input = dropdown.querySelector<HTMLInputElement>(
        'input[role="combobox"]'
      );
      if (!input) return;
      input.blur();
      dropdown.setAttribute('data-is-open', 'false');
      if (input.hasAttribute('aria-expanded'))
        input.setAttribute('aria-expanded', 'false');
    });
  } catch (error) {
    console.error('Error in dropdown click handler:', error);
  } finally {
    window.__isHandlingComboBoxRemove = false;
  }
}

export function injectDropdownFixScript(): void {
  if (window.__dropdownClickHandlerAdded) return;
  const registeredDocument = window.activeDocument;
  window.__dropdownClickHandlerAdded = true;
  window.__dropdownClickHandlerDocument = registeredDocument;
  window.__isHandlingComboBoxRemove = false;
  registeredDocument.addEventListener(
    'mousedown',
    handleDropdownDocumentMouseDown,
    true
  );
}

export function removeDropdownFixScript(): void {
  window.__dropdownClickHandlerDocument?.removeEventListener(
    'mousedown',
    handleDropdownDocumentMouseDown,
    true
  );
  window.__dropdownClickHandlerAdded = false;
  window.__dropdownClickHandlerDocument = undefined;
  window.__isHandlingComboBoxRemove = false;
}
