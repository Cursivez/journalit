

import { App, Modal } from 'obsidian';
import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import JournalitPlugin from '../../../main';
import { t } from '../../../lang/helpers';
import { TradeFormLayoutSettings } from '../../../settings/types';
import { TradeFormLayoutEditor } from './TradeFormLayoutEditor';

interface TradeFormLayoutSettingsModalProps {
  app: App;
  plugin: JournalitPlugin;
  onSave?: (layout: TradeFormLayoutSettings) => void;
}

class TradeFormLayoutSettingsModal extends Modal {
  private root: Root | null = null;
  private container!: HTMLDivElement;
  private props: TradeFormLayoutSettingsModalProps;
  private dirtyStateRef: { current: (() => boolean) | null } = {
    current: null,
  };
  private isConfirming = false;
  private shouldBypassUnsavedCheck = false;

  constructor(props: TradeFormLayoutSettingsModalProps) {
    super(props.app);
    this.props = props;
    this.titleEl.setText(t('form.layout.modal-title'));
  }

  onOpen(): void {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass('journalit-trade-form-layout-modal');
    this.container = contentEl.createDiv({
      cls: 'journalit-trade-form-layout-modal__container',
    });
    this.renderComponent();
  }

  onClose(): void {
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }
    this.contentEl.empty();
  }

  private async closeIfConfirmed(): Promise<boolean> {
    if (this.isConfirming) {
      return false;
    }

    if (this.shouldBypassUnsavedCheck) {
      this.shouldBypassUnsavedCheck = false;
      super.close();
      return true;
    }

    const checkForUnsavedChanges = this.dirtyStateRef.current;
    if (checkForUnsavedChanges?.()) {
      this.isConfirming = true;
      try {
        const shouldClose = await this.showUnsavedChangesConfirmation();
        if (shouldClose) {
          super.close();
        }
        return shouldClose;
      } finally {
        this.isConfirming = false;
      }
    }

    super.close();
    return true;
  }

  close(): void {
    void this.closeIfConfirmed();
  }

  private showUnsavedChangesConfirmation(): Promise<boolean> {
    return new Promise((resolve) => {
      const modal = new TradeFormLayoutUnsavedChangesModal(
        this.props.app,
        resolve
      );
      modal.open();
    });
  }

  private renderComponent(): void {
    this.root = createRoot(this.container);
    this.root.render(
      <TradeFormLayoutEditor
        plugin={this.props.plugin}
        compactFooter={true}
        dirtyStateRef={this.dirtyStateRef}
        onCancel={() => this.close()}
        onSave={(layout) => {
          this.props.onSave?.(layout);
          this.shouldBypassUnsavedCheck = true;
          this.close();
        }}
      />
    );
  }
}

class TradeFormLayoutUnsavedChangesModal extends Modal {
  private resolved = false;

  constructor(
    app: App,
    private onConfirm: (shouldClose: boolean) => void
  ) {
    super(app);
    this.titleEl.setText(t('form.modal.unsaved-changes.title'));
  }

  onOpen(): void {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl('p', {
      text: t('form.modal.unsaved-changes.body1'),
    });
    contentEl.createEl('p', {
      text: t('form.modal.unsaved-changes.body2'),
    });

    const buttonContainer = contentEl.createDiv({
      cls: 'modal-button-container journalit-modal-button-container',
    });

    buttonContainer
      .createEl('button', {
        type: 'button',
        text: t('form.modal.unsaved-changes.continue'),
        cls: 'mod-cta',
      })
      .addEventListener('click', () => {
        this.resolve(false);
      });

    buttonContainer
      .createEl('button', {
        type: 'button',
        text: t('form.modal.unsaved-changes.discard'),
        cls: 'mod-warning',
      })
      .addEventListener('click', () => {
        this.resolve(true);
      });
  }

  close(): void {
    this.resolve(false);
  }

  private resolve(shouldClose: boolean): void {
    if (this.resolved) return;
    this.resolved = true;
    this.onConfirm(shouldClose);
    super.close();
  }
}

export function openTradeFormLayoutSettingsModal(
  props: TradeFormLayoutSettingsModalProps
): TradeFormLayoutSettingsModal {
  const modal = new TradeFormLayoutSettingsModal(props);
  modal.open();
  return modal;
}
