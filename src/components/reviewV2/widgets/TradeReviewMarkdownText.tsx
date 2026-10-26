import React, { useEffect, useRef, useState } from 'react';
import { Component, MarkdownRenderer } from 'obsidian';
import type JournalitPlugin from '../../../main';
import { shareLoadingProps } from '../../../services/share/brandedCapture';
import { registerRenderedMarkdownLinks } from '../../shared/renderedMarkdownLinks';
import { shouldOpenReviewWidgetNotesInNewTab } from '../reviewWidgetNavigation';
import { NOTE_EXCERPT_ATTRIBUTE } from '../../../utils/noteExcerpt';
import { readOnlyTaskCheckboxProps } from '../readOnlyTaskCheckboxes';


export function TradeReviewMarkdownText({
  plugin,
  markdown,
  sourcePath,
}: {
  plugin: JournalitPlugin;
  markdown: string;
  sourcePath: string;
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
    registerRenderedMarkdownLinks({
      app: plugin.app,
      component,
      container,
      sourcePath,
      openPlainClickInNewTab: () => shouldOpenReviewWidgetNotesInNewTab(plugin),
    });
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
      className="journalit-trade-review-context-markdown markdown-rendered"
      
      
      {...{ [NOTE_EXCERPT_ATTRIBUTE]: '' }}
      {...(renderedKey === renderKey ? {} : shareLoadingProps)}
      {...readOnlyTaskCheckboxProps}
    />
  );
}
