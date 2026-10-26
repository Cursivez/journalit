

import React from 'react';
import { WorkspaceLeaf } from 'obsidian';
import { ReactView } from './ReactView';
import { RenderFunction } from './types';
import JournalitPlugin from '../main';
import TemplateBuilderRenderer from '../components/templateBuilder/TemplateBuilderRenderer';
import type { Selection } from '../components/templateBuilder/BuilderSidebar';
import type { ReviewTemplateType } from '../types/reviewV2';
import { t } from '../lang/helpers';

export const TEMPLATE_BUILDER_VIEW_TYPE = 'journalit-template-builder-view';


export type TemplateBuilderSelectionRequest = Selection & {
  type: 'template';
  templateType: ReviewTemplateType;
};


export interface TemplateBuilderExternalSelection {
  requestId: number;
  selection: TemplateBuilderSelectionRequest;
}

export class TemplateBuilderView extends ReactView {
  private plugin: JournalitPlugin;

  private externalSelection: TemplateBuilderExternalSelection | null = null;

  private externalSelectionRequests = 0;

  constructor(leaf: WorkspaceLeaf, plugin: JournalitPlugin) {
    super(leaf, {
      containerClass: 'journalit-template-builder-view-container',
      rootId: 'journalit-template-builder-view',
    });
    this.plugin = plugin;
  }

  getViewType(): string {
    return TEMPLATE_BUILDER_VIEW_TYPE;
  }

  getDisplayText(): string {
    return t('view.layout-builder');
  }

  getIcon(): string {
    return 'lucide-blocks';
  }

  async onOpen(): Promise<void> {
    try {
      await super.onOpen();
      this.containerEl.addClass('journalit-template-builder-container');
    } catch (error) {
      console.error('[TemplateBuilderView] Failed to initialize:', error);
    }
  }

  
  public requestSelection(selection: TemplateBuilderSelectionRequest): void {
    this.externalSelectionRequests += 1;
    this.externalSelection = {
      requestId: this.externalSelectionRequests,
      selection,
    };
    if (this.isRenderReady()) {
      this.renderComponent();
    }
  }

  protected getRenderFunction(): RenderFunction {
    const render = () =>
      React.createElement(TemplateBuilderRenderer, {
        leaf: this.leaf,
        view: this,
        externalSelection: this.externalSelection,
      });
    render.displayName = 'TemplateBuilderView';
    return render;
  }
}
