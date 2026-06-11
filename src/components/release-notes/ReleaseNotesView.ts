

import React from 'react';
import { WorkspaceLeaf } from 'obsidian';
import { ReactView } from '../../views/ReactView';
import { RenderFunction } from '../../views/types';
import { ReleaseNotesRenderer } from './ReleaseNotesRenderer';
import { ensureReleaseNotesStyles } from '../../styles/releaseNotesStyles';
import { t } from '../../lang/helpers';

export const RELEASE_NOTES_VIEW_TYPE = 'journalit-release-notes';

export class ReleaseNotesView extends ReactView {
  constructor(leaf: WorkspaceLeaf) {
    super(leaf, {
      containerClass: 'journalit-release-notes-container',
    });
  }

  getDisplayText(): string {
    return t('release-notes.title');
  }

  getViewType(): string {
    return RELEASE_NOTES_VIEW_TYPE;
  }

  getIcon(): string {
    return 'scroll';
  }

  async onOpen(): Promise<void> {
    await super.onOpen();
  }

  protected getRenderFunction(): RenderFunction {
    const renderFn = () =>
      React.createElement(ReleaseNotesRenderer, {
        leaf: this.leaf,
        view: this,
      });
    renderFn.displayName = 'ReleaseNotesView';
    return renderFn;
  }
}
