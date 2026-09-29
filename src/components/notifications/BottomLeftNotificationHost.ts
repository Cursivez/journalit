

const HOST_CLASS = 'journalit-bottom-left-notifications';

type BottomLeftNotificationLayer = 'notice' | 'chrome';



const hostClassFor = (layer: BottomLeftNotificationLayer): string =>
  `${HOST_CLASS}--${layer}`;

export function ensureBottomLeftNotificationHost(
  layer: BottomLeftNotificationLayer = 'notice'
): HTMLElement {
  const document = window.activeDocument;
  const layerClass = hostClassFor(layer);
  const existing = document.body.querySelector<HTMLElement>(`.${layerClass}`);
  if (existing) {
    existing.setAttribute('aria-live', 'polite');
    existing.setAttribute('aria-atomic', 'false');
    return existing;
  }

  return document.body.createDiv({
    cls: [HOST_CLASS, layerClass],
    attr: {
      'aria-live': 'polite',
      'aria-atomic': 'false',
    },
  });
}

export function mountBottomLeftNotification(
  className: string,
  layer: BottomLeftNotificationLayer = 'notice'
): HTMLElement {
  return ensureBottomLeftNotificationHost(layer).createDiv({ cls: className });
}

export function removeBottomLeftNotification(element: HTMLElement): void {
  const host = element.parentElement;
  element.remove();
  if (host?.classList.contains(HOST_CLASS) && host.childElementCount === 0) {
    host.remove();
  }
}

export function cleanupBottomLeftNotificationHost(): void {
  window.activeDocument.body
    .querySelectorAll<HTMLElement>(`.${HOST_CLASS}`)
    .forEach((host) => {
      if (host.childElementCount === 0) host.remove();
    });
}
