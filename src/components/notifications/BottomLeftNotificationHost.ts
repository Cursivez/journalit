const HOST_CLASS = 'journalit-bottom-left-notifications';

export function ensureBottomLeftNotificationHost(): HTMLElement {
  const document = window.activeDocument;
  const existing = document.body.querySelector<HTMLElement>(`.${HOST_CLASS}`);
  if (existing) {
    existing.setAttribute('aria-live', 'polite');
    existing.setAttribute('aria-atomic', 'false');
    return existing;
  }

  return document.body.createDiv({
    cls: HOST_CLASS,
    attr: {
      'aria-live': 'polite',
      'aria-atomic': 'false',
    },
  });
}

export function mountBottomLeftNotification(className: string): HTMLElement {
  return ensureBottomLeftNotificationHost().createDiv({ cls: className });
}

export function removeBottomLeftNotification(element: HTMLElement): void {
  const host = element.parentElement;
  element.remove();
  if (host?.classList.contains(HOST_CLASS) && host.childElementCount === 0) {
    host.remove();
  }
}

export function cleanupBottomLeftNotificationHost(): void {
  const host = window.activeDocument.body.querySelector<HTMLElement>(
    `.${HOST_CLASS}`
  );
  if (host?.childElementCount === 0) host.remove();
}
