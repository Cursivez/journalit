import React from 'react';
import { App, Modal } from 'obsidian';
import type { Root } from 'react-dom/client';
import JournalitPlugin from '../../main';
import { CurrencyProvider } from '../../contexts/CurrencyContext';
import { DisplayPolicyProvider } from '../../contexts/DisplayPolicyContext';
import { PositionSizeWidget } from '../home/widgets/PositionSizeWidget';
import { t } from '../../lang/helpers';

export class PositionSizeCalculatorModal extends Modal {
  private readonly plugin: JournalitPlugin;
  private root: Root | null = null;

  constructor(app: App, plugin: JournalitPlugin) {
    super(app);
    this.plugin = plugin;
  }

  async onOpen(): Promise<void> {
    this.titleEl.setText(t('widget.position-size.title'));
    this.modalEl.addClass('journalit-position-size-modal');

    this.contentEl.empty();
    const mountPoint = this.contentEl.createDiv({
      cls: 'journalit-position-size-modal-content',
    });

    const { createRoot } = await import('react-dom/client');
    this.root = createRoot(mountPoint);
    this.root.render(
      <CurrencyProvider>
        <DisplayPolicyProvider privacyModeOverride={false}>
          <PositionSizeWidget plugin={this.plugin} autoFocusOnMount={true} />
        </DisplayPolicyProvider>
      </CurrencyProvider>
    );
  }

  onClose(): void {
    this.root?.unmount();
    this.root = null;
    this.modalEl.removeClass('journalit-position-size-modal');
    this.contentEl.empty();
  }
}
