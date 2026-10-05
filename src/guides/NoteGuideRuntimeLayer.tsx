import React, { useEffect, useState } from 'react';
import type { MarkdownView, WorkspaceLeaf } from 'obsidian';
import type JournalitPlugin from '../main';
import { isMarkdownView } from '../types/obsidian-extensions';
import { GuideRuntimeLayer } from './GuideRuntimeLayer';


export const NoteGuideRuntimeLayer: React.FC<{
  plugin: JournalitPlugin;
  containerEl: HTMLElement;
  filePath: string;
  children?: React.ReactNode;
}> = ({ plugin, containerEl, filePath, children }) => {
  const [leaf, setLeaf] = useState<WorkspaceLeaf | null>(null);

  useEffect(() => {
    const findOwner = (): {
      leaf: WorkspaceLeaf;
      view: MarkdownView;
    } | null => {
      for (const candidate of plugin.app.workspace.getLeavesOfType(
        'markdown'
      )) {
        const view = candidate.view;
        if (
          isMarkdownView(view) &&
          view.file?.path === filePath &&
          view.containerEl.contains(containerEl)
        ) {
          return { leaf: candidate, view };
        }
      }
      return null;
    };

    let observedHost: HTMLElement | null = null;
    let observedModes: HTMLElement[] = [];
    const observer = new MutationObserver(() => syncOwner());

    const syncOwner = (): void => {
      if (containerEl.closest('.markdown-embed, .journalit-share-card')) {
        observer.disconnect();
        observedHost = null;
        observedModes = [];
        setLeaf(null);
        return;
      }
      const owner = findOwner();
      
      
      const modeSelector = owner
        ? owner.view.getMode() === 'preview'
          ? '.markdown-preview-view'
          : '.markdown-source-view'
        : null;
      setLeaf(
        owner && modeSelector && containerEl.closest(modeSelector)
          ? owner.leaf
          : null
      );

      
      
      
      const host = owner?.view.containerEl ?? containerEl.ownerDocument.body;
      const modes = Array.from(
        host.querySelectorAll<HTMLElement>(
          '.markdown-reading-view, .markdown-source-view'
        )
      );
      if (
        observedHost === host &&
        modes.length === observedModes.length &&
        modes.every((mode, index) => mode === observedModes[index])
      )
        return;
      observer.disconnect();
      observedHost = host;
      observedModes = modes;
      observer.observe(host, { childList: true, subtree: true });
      for (const mode of modes) {
        observer.observe(mode, {
          attributes: true,
          attributeFilter: ['class', 'style'],
        });
      }
    };
    plugin.app.workspace.on('layout-change', syncOwner);
    plugin.app.workspace.on('active-leaf-change', syncOwner);
    syncOwner();
    return () => {
      
      
      observer.disconnect();
      plugin.app.workspace.off('layout-change', syncOwner);
      plugin.app.workspace.off('active-leaf-change', syncOwner);
    };
  }, [containerEl, filePath, plugin]);

  return (
    <GuideRuntimeLayer leaf={leaf} viewType="markdown">
      {children}
    </GuideRuntimeLayer>
  );
};
