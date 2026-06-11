

import { WorkspaceLeaf } from 'obsidian';
import { ReactView } from './ReactView';
import { RenderFunction } from './types';
import type JournalitPlugin from '../main';
import React from 'react';
import { OnboardingComponent } from '../components/onboarding/OnboardingComponent';
import { t } from '../lang/helpers';

export const ONBOARDING_VIEW_TYPE = 'journalit-onboarding-view';

const OnboardingViewContent: React.FC<{ plugin: JournalitPlugin }> = ({
  plugin,
}) => <OnboardingComponent plugin={plugin} />;

OnboardingViewContent.displayName = 'OnboardingViewContent';

export class OnboardingView extends ReactView {
  private plugin: JournalitPlugin;

  constructor(leaf: WorkspaceLeaf, plugin: JournalitPlugin) {
    super(leaf, {
      containerClass: 'journalit-onboarding-view-container',
    });
    this.plugin = plugin;
  }

  getDisplayText(): string {
    return t('onboarding.view.title');
  }

  getViewType(): string {
    return ONBOARDING_VIEW_TYPE;
  }

  getIcon(): string {
    return 'circle-dot-dashed';
  }

  async onOpen(): Promise<void> {
    await super.onOpen();

    
  }

  protected getRenderFunction(): RenderFunction {
    const plugin = this.plugin;
    function OnboardingViewRenderer() {
      return <OnboardingViewContent plugin={plugin} />;
    }
    return OnboardingViewRenderer;
  }
}
