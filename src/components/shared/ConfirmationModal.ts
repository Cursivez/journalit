import { Modal } from 'obsidian';
import type { App } from 'obsidian';

interface ConfirmationModalOptions {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  destructive?: boolean;
}

class ConfirmationModal extends Modal {
  private settled = false;

  constructor(
    app: App,
    private options: ConfirmationModalOptions,
    private resolveChoice: (confirmed: boolean) => void
  ) {
    super(app);
    this.titleEl.setText(options.title);
    if (options.destructive) {
      this.titleEl.addClass('journalit-modal-title-danger');
    }
  }

  onOpen(): void {
    this.contentEl.empty();
    this.modalEl.addClass('journalit-confirmation-modal');
    this.contentEl.createEl('p', {
      text: this.options.message,
      cls: 'journalit-confirmation-modal__message',
    });

    const actions = this.contentEl.createDiv({
      cls: 'journalit-modal-actions journalit-confirmation-modal__actions',
    });
    const cancelButton = actions.createEl('button', {
      type: 'button',
      text: this.options.cancelLabel,
      cls: 'journalit-button journalit-button--secondary journalit-button--medium journalit-modal-actions__cancel cancel-button journalit-confirmation-modal__cancel',
    });
    cancelButton.addEventListener('click', () => this.settle(false));

    const confirmButton = actions.createEl('button', {
      type: 'button',
      text: this.options.confirmLabel,
      cls: `${this.options.destructive ? 'mod-warning ' : ''}journalit-confirmation-modal__confirm`,
    });
    confirmButton.addEventListener('click', () => this.settle(true));
    cancelButton.focus();
  }

  onClose(): void {
    if (!this.settled) {
      this.settled = true;
      this.resolveChoice(false);
    }
    this.contentEl.empty();
  }

  private settle(confirmed: boolean): void {
    if (this.settled) return;
    this.settled = true;
    this.resolveChoice(confirmed);
    this.close();
  }
}

export function showConfirmationModal(
  app: App,
  options: ConfirmationModalOptions
): Promise<boolean> {
  return new Promise((resolve) => {
    new ConfirmationModal(app, options, resolve).open();
  });
}
