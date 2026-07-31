

import { App, Modal } from 'obsidian';
import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import JournalitPlugin from '../../../main';
import { t } from '../../../lang/helpers';
import { showConfirmationModal } from '../../shared/ConfirmationModal';
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
    return showConfirmationModal(this.props.app, {
      title: t('form.modal.unsaved-changes.title'),
      message: [
        { text: t('form.modal.unsaved-changes.body1') },
        { text: t('form.modal.unsaved-changes.body2') },
      ],
      cancelLabel: t('form.modal.unsaved-changes.continue'),
      confirmLabel: t('form.modal.unsaved-changes.discard'),
      destructive: true,
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

export function openTradeFormLayoutSettingsModal(
  props: TradeFormLayoutSettingsModalProps
): TradeFormLayoutSettingsModal {
  const modal = new TradeFormLayoutSettingsModal(props);
  modal.open();
  return modal;
}
