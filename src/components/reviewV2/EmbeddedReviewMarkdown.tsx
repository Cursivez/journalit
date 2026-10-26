import React, { useEffect, useRef, useState } from 'react';
import { Component, MarkdownRenderer, TFile, type App } from 'obsidian';
import type JournalitPlugin from '../../main';
import { openReviewWidgetFile } from './reviewWidgetNavigation';
import { shareLoadingProps } from '../../services/share/brandedCapture';
import {
  preventMutation,
  readOnlyTaskCheckboxProps,
} from './readOnlyTaskCheckboxes';

function resolveEmbeddedReviewInternalLinkPath(
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
  const renderKey = `${sourcePath}\n${markdown}`;
  
  
  
  const [renderedKey, setRenderedKey] = useState<string | null>(null);
  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    let cancelled = false;
    let frame = 0;
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
    ).finally(() => {
      if (cancelled) return;
      frame = container.win.requestAnimationFrame(() =>
        setRenderedKey(renderKey)
      );
    });
    return () => {
      cancelled = true;
      container.win.cancelAnimationFrame(frame);
      component.unload();
    };
  }, [markdown, plugin, renderKey, sourcePath]);

  return (
    <div
      ref={ref}
      className="journalit-previous-drc-rendered-markdown"
      data-journalit-review-source={sourcePath}
      {...(renderedKey === renderKey ? {} : shareLoadingProps)}
      onInputCapture={preventMutation}
      onChangeCapture={preventMutation}
      onSubmitCapture={preventMutation}
      {...readOnlyTaskCheckboxProps}
    />
  );
}
