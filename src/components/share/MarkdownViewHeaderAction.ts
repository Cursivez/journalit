

import { App, MarkdownView, Plugin, TFile } from 'obsidian';

interface MarkdownViewHeaderActionSpec {
  icon: string;
  title: () => string;
  appliesTo: (file: TFile) => boolean;
  onClick: (view: MarkdownView, file: TFile) => void;
}

export class MarkdownViewHeaderAction {
  private readonly actionEls = new Map<MarkdownView, HTMLElement>();

  constructor(
    private readonly app: App,
    private readonly plugin: Plugin,
    private readonly spec: MarkdownViewHeaderActionSpec
  ) {}

  initialize(): void {
    const sync = () => this.sync();
    this.plugin.registerEvent(this.app.workspace.on('layout-change', sync));
    this.plugin.registerEvent(
      this.app.workspace.on('active-leaf-change', sync)
    );
    this.plugin.registerEvent(this.app.workspace.on('file-open', sync));
    
    this.plugin.registerEvent(this.app.metadataCache.on('changed', sync));
    this.app.workspace.onLayoutReady(sync);
  }

  cleanup(): void {
    this.actionEls.forEach((actionEl) => actionEl.remove());
    this.actionEls.clear();
  }

  
  runOnActiveView(checking: boolean): boolean {
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    const file = view?.file;
    if (!view || !file || !this.spec.appliesTo(file)) return false;
    if (!checking) this.spec.onClick(view, file);
    return true;
  }

  private sync(): void {
    const openViews = new Set<MarkdownView>();

    this.app.workspace.iterateAllLeaves((leaf) => {
      const view = leaf.view;
      if (!(view instanceof MarkdownView)) return;
      openViews.add(view);

      const shouldShow = view.file !== null && this.spec.appliesTo(view.file);
      const actionEl = this.actionEls.get(view);
      if (shouldShow && !actionEl) {
        this.actionEls.set(
          view,
          view.addAction(this.spec.icon, this.spec.title(), () => {
            
            if (view.file) this.spec.onClick(view, view.file);
          })
        );
      } else if (!shouldShow && actionEl) {
        actionEl.remove();
        this.actionEls.delete(view);
      }
    });

    this.actionEls.forEach((actionEl, view) => {
      if (openViews.has(view)) return;
      actionEl.remove();
      this.actionEls.delete(view);
    });
  }
}
