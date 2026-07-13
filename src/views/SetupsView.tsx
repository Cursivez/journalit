import React from 'react';
import { Menu, WorkspaceLeaf, ViewStateResult } from 'obsidian';
import { ReactView } from './ReactView';
import { RenderFunction } from './types';
import type JournalitPlugin from '../main';
import {
  SetupsViewContent,
  SetupsViewState,
} from '../components/setups/SetupsViewContent';
import { t } from '../lang/helpers';

export const SETUPS_VIEW_TYPE = 'journalit-setups-view';

const DEFAULT_SETUPS_VIEW_STATE: SetupsViewState = {
  page: 'overview',
};

export class SetupsView extends ReactView {
  private setupsState: SetupsViewState = DEFAULT_SETUPS_VIEW_STATE;

  constructor(
    leaf: WorkspaceLeaf,
    private plugin: JournalitPlugin
  ) {
    super(leaf, {
      containerClass: 'journalit-setups-view-container',
    });
    this.setupsState = normalizeSetupsViewState(leaf.getViewState().state);
  }

  getDisplayText(): string {
    if (this.setupsState.page === 'detail' && this.setupsState.setupName) {
      return this.setupsState.setupName;
    }

    if (this.setupsState.page === 'compare') {
      return t('setups.view.compare.title');
    }

    return t('setups.view.title');
  }

  getViewType(): string {
    return SETUPS_VIEW_TYPE;
  }

  getIcon(): string {
    return 'flask-conical';
  }

  onPaneMenu(menu: Menu, source: string): void {
    const setupReference = getSetupMarkdownReference(this.setupsState);
    if (setupReference) {
      menu.addItem((item) => {
        item
          .setTitle(t('setups.view.open-as-markdown'))
          .setIcon('file-text')
          .setSection('pane')
          .onClick(() => {
            void this.plugin.viewManager.openSetupMarkdownView(
              setupReference,
              this.leaf
            );
          });
      });
    }
    super.onPaneMenu(menu, source);
  }

  async onOpen(): Promise<void> {
    await super.onOpen();
  }

  async setState(state: unknown, result: ViewStateResult): Promise<void> {
    await super.setState(state, result);
    this.setSetupsState(normalizeSetupsViewState(state), this.isRenderReady());
  }

  getState(): Record<string, unknown> {
    return {
      ...super.getState(),
      ...this.setupsState,
    };
  }

  public getSetupsState(): SetupsViewState {
    return this.setupsState;
  }

  public setSetupsState(
    nextState: SetupsViewState,
    shouldRender: boolean = true
  ): void {
    this.setupsState = normalizeSetupsViewState(nextState);
    refreshSetupsViewTabHeader(this.leaf);
    if (shouldRender) {
      this.renderComponent();
    }
  }

  protected getRenderFunction(): RenderFunction {
    const SetupsViewRender = () => (
      <SetupsViewContent
        hoverParent={this}
        plugin={this.plugin}
        state={this.getSetupsState()}
        onStateChange={(nextState) => this.setSetupsState(nextState)}
      />
    );
    SetupsViewRender.displayName = 'SetupsViewRender';
    return SetupsViewRender;
  }
}

export function getSetupMarkdownReference(
  state: SetupsViewState
): string | undefined {
  return state.page === 'detail'
    ? (state.setupPath ?? state.setupId)
    : undefined;
}

function normalizeSetupsViewState(state: unknown): SetupsViewState {
  if (!state || typeof state !== 'object') {
    return DEFAULT_SETUPS_VIEW_STATE;
  }

  const candidate = state as Partial<SetupsViewState>;
  const page = isSetupsViewPage(candidate.page)
    ? candidate.page
    : DEFAULT_SETUPS_VIEW_STATE.page;

  return {
    page,
    setupId:
      page === 'detail' && typeof candidate.setupId === 'string'
        ? candidate.setupId
        : undefined,
    setupPath:
      page === 'detail' && typeof candidate.setupPath === 'string'
        ? candidate.setupPath
        : undefined,
    setupName:
      page === 'detail' && typeof candidate.setupName === 'string'
        ? candidate.setupName
        : undefined,
    selectedSetupIds: Array.isArray(candidate.selectedSetupIds)
      ? candidate.selectedSetupIds
          .filter((setupId): setupId is string => typeof setupId === 'string')
          .slice(0, 2)
      : undefined,
  };
}

function refreshSetupsViewTabHeader(leaf: WorkspaceLeaf): void {
  const refreshableLeaf = leaf as WorkspaceLeaf & {
    updateHeader?: () => void;
  };

  refreshableLeaf.updateHeader?.();
  const headerTitle = leaf.view.containerEl.querySelector('.view-header-title');
  if (headerTitle instanceof HTMLElement) {
    headerTitle.setText(leaf.view.getDisplayText());
  }
}

function isSetupsViewPage(value: unknown): value is SetupsViewState['page'] {
  return value === 'overview' || value === 'detail' || value === 'compare';
}
