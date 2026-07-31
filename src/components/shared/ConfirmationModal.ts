import { Modal } from 'obsidian';
import type { App } from 'obsidian';

interface ConfirmationModalMessage {
  text: string;
  destructive?: boolean;
}

export type ConfirmationActionVariant = 'secondary' | 'primary' | 'destructive';

export function getConfirmationActionClass(
  variant: ConfirmationActionVariant
): string {
  const baseClass = 'journalit-confirmation-action';
  if (variant === 'destructive') return `${baseClass} mod-warning`;
  if (variant === 'primary') return `${baseClass} mod-cta`;
  return `${baseClass} journalit-button journalit-button--secondary journalit-button--medium journalit-modal-actions__cancel cancel-button journalit-confirmation-modal__cancel`;
}

export interface ConfirmationAction<TResult> {
  value: TResult;
  label: string;
  variant?: ConfirmationActionVariant;
  initialFocus?: boolean;
  disabled?: boolean;
}

interface ActionConfirmationModalOptions<TResult> {
  title?: string;
  message?: string | readonly ConfirmationModalMessage[];
  renderContent?: (contentEl: HTMLElement) => void | (() => void);
  actions: readonly ConfirmationAction<TResult>[];
  cancelValue: TResult;
  destructive?: boolean;
}

interface ConfirmationModalOptions {
  title?: string;
  message: string | readonly ConfirmationModalMessage[];
  confirmLabel: string;
  cancelLabel: string;
  destructive?: boolean;
}

class ConfirmationModal<TResult> extends Modal {
  private settled = false;
  private cleanupContent: (() => void) | null = null;

  constructor(
    app: App,
    private options: ActionConfirmationModalOptions<TResult>,
    private resolveChoice: (result: TResult) => void
  ) {
    super(app);
    if (options.title) {
      this.titleEl.setText(options.title);
    }
    if (options.title && options.destructive) {
      this.titleEl.addClass('journalit-modal-title-danger');
    }
  }

  onOpen(): void {
    this.contentEl.empty();
    this.modalEl.addClass('journalit-confirmation-modal');
    this.renderMessages();
    this.cleanupContent = this.options.renderContent?.(this.contentEl) ?? null;

    const actions = this.contentEl.createDiv({
      cls: 'journalit-modal-actions journalit-confirmation-modal__actions',
    });
    let initialFocusButton: HTMLButtonElement | null = null;
    for (const action of this.options.actions) {
      const button = actions.createEl('button', {
        type: 'button',
        text: action.label,
        cls: `journalit-confirmation-modal__action ${getConfirmationActionClass(action.variant ?? 'secondary')}`,
      });
      button.disabled = action.disabled ?? false;
      button.addEventListener('click', () => this.settle(action.value));
      if (action.initialFocus) {
        initialFocusButton = button;
      }
    }
    (initialFocusButton ?? actions.querySelector('button'))?.focus();
  }

  onClose(): void {
    if (!this.settled) {
      this.settled = true;
      this.resolveChoice(this.options.cancelValue);
    }
    this.cleanupContent?.();
    this.cleanupContent = null;
    this.contentEl.empty();
  }

  private renderMessages(): void {
    if (!this.options.message) return;
    const messages =
      typeof this.options.message === 'string'
        ? [{ text: this.options.message }]
        : this.options.message;
    for (const message of messages) {
      this.contentEl.createEl('p', {
        text: message.text,
        cls: message.destructive
          ? 'journalit-confirmation-modal__message journalit-confirmation-modal__message--destructive'
          : 'journalit-confirmation-modal__message',
      });
    }
  }

  private settle(result: TResult): void {
    if (this.settled) return;
    this.settled = true;
    this.resolveChoice(result);
    this.close();
  }
}

export function showActionConfirmationModal<TResult>(
  app: App,
  options: ActionConfirmationModalOptions<TResult>
): Promise<TResult> {
  return new Promise((resolve) => {
    new ConfirmationModal(app, options, resolve).open();
  });
}

export function showConfirmationModal(
  app: App,
  options: ConfirmationModalOptions
): Promise<boolean> {
  return showActionConfirmationModal(app, {
    title: options.title,
    message: options.message,
    destructive: options.destructive,
    cancelValue: false,
    actions: [
      {
        value: false,
        label: options.cancelLabel,
        variant: 'secondary',
        initialFocus: true,
      },
      {
        value: true,
        label: options.confirmLabel,
        variant: options.destructive ? 'destructive' : 'primary',
      },
    ],
  });
}
