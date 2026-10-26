

import React, { useEffect, useRef, useState } from 'react';
import { Component, MarkdownRenderer } from 'obsidian';
import JournalitPlugin from '../../../main';
import { ShareCard } from '../ShareCard';
import {
  shareCaptureUnwrapProps,
  shareLoadingProps,
} from '../../../services/share/brandedCapture';
import type { ReviewNoteBlock } from './reviewNoteBlocks';

interface ReviewShareCardProps {
  filePath: string;
  plugin: JournalitPlugin;
  blocks: ReviewNoteBlock[];
  
  hideDollarAmounts: boolean;
}


const RenderedNoteBlock: React.FC<{
  plugin: JournalitPlugin;
  filePath: string;
  markdown: string;
}> = ({ plugin, filePath, markdown }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [renderedMarkdown, setRenderedMarkdown] = useState<string | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const component = new Component();
    component.load();
    const rendering = MarkdownRenderer.render(
      plugin.app,
      markdown,
      container,
      filePath,
      component
    );
    
    
    let frame = 0;
    let cancelled = false;
    void rendering.finally(() => {
      if (cancelled) return;
      frame = container.win.requestAnimationFrame(() =>
        setRenderedMarkdown(markdown)
      );
    });
    return () => {
      cancelled = true;
      container.win.cancelAnimationFrame(frame);
      container.empty();
      
      
      
      void rendering.finally(() => component.unload());
    };
  }, [plugin, filePath, markdown]);

  return (
    <div
      ref={containerRef}
      className="journalit-share-card-block"
      {...shareCaptureUnwrapProps}
      {...(renderedMarkdown === markdown ? {} : shareLoadingProps)}
    />
  );
};

export const ReviewShareCard = React.forwardRef<
  HTMLDivElement,
  ReviewShareCardProps
>(function ReviewShareCard(
  { filePath, plugin, blocks, hideDollarAmounts },
  ref
) {
  return (
    <ShareCard ref={ref} hideDollarAmounts={hideDollarAmounts}>
      
      <div className="journalit-share-card-note markdown-preview-view markdown-rendered">
        {blocks.map((block) => (
          <RenderedNoteBlock
            
            
            
            key={`${block.id}:${hideDollarAmounts ? 'hide' : 'show'}`}
            plugin={plugin}
            filePath={filePath}
            markdown={block.markdown}
          />
        ))}
      </div>
    </ShareCard>
  );
});
