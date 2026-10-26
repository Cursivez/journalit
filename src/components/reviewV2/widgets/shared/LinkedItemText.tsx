

import React, { useEffect, useRef } from 'react';
import { Component, MarkdownRenderer } from 'obsidian';
import { registerRenderedMarkdownLinks } from '../../../shared/renderedMarkdownLinks';
import type JournalitPlugin from '../../../../main';
import { shouldOpenReviewWidgetNotesInNewTab } from '../../reviewWidgetNavigation';

interface LinkedItemTextProps {
  plugin: JournalitPlugin;
  text: string;
  
  sourcePath: string;
  className?: string;
  
  onToggle?: () => void;
}



const EMBED_PREFIX = /!(\[\[)/g;

export const LinkedItemText: React.FC<LinkedItemTextProps> = ({
  plugin,
  text,
  sourcePath,
  className,
  onToggle,
}) => {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const component = new Component();
    component.load();
    container.empty();
    registerRenderedMarkdownLinks({
      app: plugin.app,
      component,
      container,
      sourcePath,
      openPlainClickInNewTab: () => shouldOpenReviewWidgetNotesInNewTab(plugin),
    });

    
    
    
    if (/[\r\n]/.test(text)) {
      container.setText(text);
      return () => {
        component.unload();
      };
    }

    void MarkdownRenderer.render(
      plugin.app,
      text.replace(EMBED_PREFIX, '$1'),
      container,
      sourcePath,
      component
    );

    return () => {
      component.unload();
    };
  }, [plugin, text, sourcePath]);

  const classes = `journalit-reviewv2-linked-text${className ? ` ${className}` : ''}`;
  return (
    <span
      ref={containerRef}
      role="presentation"
      className={classes}
      onClick={(event) => {
        
        
        const target = event.nativeEvent.targetNode;
        if (target?.instanceOf(Element) && target.closest('a')) return;
        onToggle?.();
      }}
    />
  );
};
