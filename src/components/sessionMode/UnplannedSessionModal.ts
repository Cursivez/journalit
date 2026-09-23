import { Modal, Notice } from 'obsidian';
import type JournalitPlugin from '../../main';
import { t } from '../../lang/helpers';


export class UnplannedSessionModal extends Modal {
  private readonly onSubmit: (reason: string) => void;

  constructor(plugin: JournalitPlugin, onSubmit: (reason: string) => void) {
    super(plugin.app);
    this.onSubmit = onSubmit;
  }

  onOpen(): void {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass('journalit-unplanned-session-modal');
    this.titleEl.setText(t('session-mode.unplanned.modal.title'));

    contentEl.createEl('p', {
      cls: 'journalit-unplanned-session-modal__description',
      text: t('session-mode.unplanned.modal.description'),
    });

    const inputId = 'journalit-unplanned-session-reason';
    contentEl.createEl('label', {
      cls: 'journalit-unplanned-session-modal__label',
      text: t('session-mode.unplanned.modal.reason-label'),
      attr: { for: inputId },
    });
    const input = contentEl.createEl('input', {
      type: 'text',
      cls: 'journalit-unplanned-session-modal__input',
      attr: {
        id: inputId,
        placeholder: t('session-mode.unplanned.modal.reason-placeholder'),
        maxlength: '200',
      },
    });

    const buttonRow = contentEl.createDiv({ cls: 'modal-button-container' });
    const cancelButton = buttonRow.createEl('button', {
      text: t('button.cancel'),
    });
    const startButton = buttonRow.createEl('button', {
      text: t('session-mode.unplanned.start'),
      cls: 'mod-cta',
    });

    const submit = () => {
      const reason = input.value.trim();
      if (reason.length === 0) {
        new Notice(t('session-mode.unplanned.modal.reason-required'));
        input.focus();
        return;
      }
      this.onSubmit(reason);
      this.close();
    };

    startButton.addEventListener('click', submit);
    cancelButton.addEventListener('click', () => this.close());
    input.addEventListener('keydown', (event) => {
      if (event.isComposing) return;
      if (event.key === 'Enter') {
        event.preventDefault();
        submit();
      }
    });
    input.focus();
  }

  onClose(): void {
    this.contentEl.empty();
  }
}
