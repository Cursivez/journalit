import React, { useEffect, useRef } from 'react';
import { Component, MarkdownRenderer, TFile, type App } from 'obsidian';
import type JournalitPlugin from '../../main';
import { openReviewWidgetFile } from './reviewWidgetNavigation';

export function resolveEmbeddedReviewInternalLinkPath(
  app: { metadataCache: Pick<App['metadataCache'], 'getFirstLinkpathDest'> },
  target: EventTarget | null,
  sourcePath: string
): string | null {
  if (!(target instanceof Element)) return null;
  const link = target.closest('a.internal-link');
  if (!(link instanceof HTMLAnchorElement)) return null;
  const linkText = link.dataset.href?.trim();
  if (!linkText) return null;
  const linkedFile = app.metadataCache.getFirstLinkpathDest(
    linkText,
    sourcePath
  );
  return linkedFile instanceof TFile ? linkedFile.path : null;
}

const preventMutation = (event: React.SyntheticEvent) => {
  event.preventDefault();
  event.stopPropagation();
};

const isNativeTaskCheckbox = (target: EventTarget | null): boolean =>
  target instanceof HTMLInputElement &&
  target.classList.contains('task-list-item-checkbox');


export function EmbeddedReviewMarkdown({
  markdown,
  sourcePath,
  plugin,
}: {
  markdown: string;
  sourcePath: string;
  plugin: JournalitPlugin;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    container.empty();
    const component = new Component();
    component.load();
    component.registerDomEvent(
      container,
      'click',
      (event) => {
        if (
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        )
          return;
        const linkedPath = resolveEmbeddedReviewInternalLinkPath(
          plugin.app,
          event.target,
          sourcePath
        );
        if (!linkedPath) return;
        event.preventDefault();
        event.stopPropagation();
        void openReviewWidgetFile(plugin, linkedPath);
      },
      { capture: true }
    );
    void MarkdownRenderer.render(
      plugin.app,
      markdown,
      container,
      sourcePath,
      component
    );
    return () => component.unload();
  }, [markdown, plugin, sourcePath]);

  return (
    <div
      ref={ref}
      className="journalit-previous-drc-rendered-markdown"
      data-journalit-review-source={sourcePath}
      onInputCapture={preventMutation}
      onChangeCapture={preventMutation}
      onSubmitCapture={preventMutation}
      onClickCapture={(event) => {
        if (isNativeTaskCheckbox(event.target)) preventMutation(event);
      }}
      onKeyDownCapture={(event) => {
        if (
          (event.key === ' ' || event.key === 'Enter') &&
          isNativeTaskCheckbox(event.target)
        )
          preventMutation(event);
      }}
    />
  );
}
