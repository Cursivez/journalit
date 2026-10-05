import { Keymap, type App, type Component, type HoverParent } from 'obsidian';




function getInternalLink(
  event: MouseEvent
): { link: HTMLAnchorElement; linktext: string } | null {
  const target = event.targetNode;
  if (!target?.instanceOf(Element)) return null;
  const link = target.closest('a.internal-link');
  if (!link?.instanceOf(HTMLAnchorElement)) return null;
  const linktext = link.dataset.href?.trim();
  return linktext ? { link, linktext } : null;
}


export function registerRenderedMarkdownLinks({
  app,
  component,
  container,
  sourcePath,
}: {
  app: App;
  component: Component;
  container: HTMLElement;
  sourcePath: string;
}): void {
  const hoverParent: HoverParent = { hoverPopover: null };

  const openLink = (
    event: MouseEvent,
    newLeaf: ReturnType<typeof Keymap.isModEvent>
  ) => {
    const internalLink = getInternalLink(event);
    if (!internalLink) return;
    event.preventDefault();
    event.stopPropagation();
    void app.workspace
      .openLinkText(internalLink.linktext, sourcePath, newLeaf)
      .catch((error: unknown) => {
        console.error('Failed to open rendered markdown link:', error);
      });
  };

  component.registerDomEvent(container, 'click', (event) => {
    if (event.button !== 0) return;
    openLink(event, Keymap.isModEvent(event) || 'tab');
  });
  component.registerDomEvent(container, 'auxclick', (event) => {
    if (event.button !== 1) return;
    openLink(event, 'tab');
  });
  component.registerDomEvent(container, 'mouseover', (event) => {
    const internalLink = getInternalLink(event);
    if (!internalLink) return;
    app.workspace.trigger('hover-link', {
      event,
      source: 'preview',
      hoverParent,
      targetEl: internalLink.link,
      linktext: internalLink.linktext,
      sourcePath,
    });
  });
}
