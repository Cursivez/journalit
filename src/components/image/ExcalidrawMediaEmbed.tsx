import { Component, MarkdownRenderer, TFile } from 'obsidian';
import React, { useLayoutEffect, useRef } from 'react';
import { getApp } from '../../utils/obsidian';
import {
  isExcalidrawFile,
  resolveVaultMediaFile,
  toObsidianEmbed,
} from '../../utils/imageMediaUtils';

interface ExcalidrawMediaEmbedProps {
  path: string;
  sourcePath?: string;
  fullscreen?: boolean;
}

function resolveExcalidrawFile(path: string, sourcePath = ''): TFile | null {
  const app = getApp();
  const file = resolveVaultMediaFile(app, path, sourcePath);
  return file && isExcalidrawFile(file, app) ? file : null;
}

export const ExcalidrawMediaEmbed: React.FC<ExcalidrawMediaEmbedProps> = ({
  path,
  sourcePath = '',
  fullscreen = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const file = resolveExcalidrawFile(path, sourcePath);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container || !file) return;

    container.empty();
    const component = new Component();
    component.load();

    void MarkdownRenderer.render(
      getApp(),
      toObsidianEmbed(file.path),
      container,
      sourcePath || file.path,
      component
    );

    return () => {
      component.unload();
      container.empty();
    };
  }, [file, sourcePath]);

  return (
    <div
      className={`journalit-excalidraw-media${fullscreen ? ' journalit-excalidraw-media--fullscreen' : ''}`}
    >
      <div ref={containerRef} className="journalit-excalidraw-media__embed" />
    </div>
  );
};
