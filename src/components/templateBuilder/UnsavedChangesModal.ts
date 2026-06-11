

import { App, Modal } from 'obsidian';
import { t } from '../../lang/helpers';


class UnsavedChangesModal extends Modal {
  private resolved = false;

  constructor(
    app: App,
    private onConfirm: (shouldDiscard: boolean) => void
  ) {
    super(app);
    this.titleEl.setText(t('template-builder.modal.unsaved-changes.title'));
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();

    contentEl.createEl('p', {
      text: t('template-builder.modal.unsaved-changes.body1'),
    });
    contentEl.createEl('p', {
      text: t('template-builder.modal.unsaved-changes.body2'),
    });

    const buttonContainer = contentEl.createDiv({
      cls: 'modal-button-container journalit-modal-button-container',
    });

    
    const continueBtn = buttonContainer.createEl('button', {
      type: 'button',
      text: t('template-builder.modal.unsaved-changes.continue'),
      cls: 'mod-cta',
    });
    continueBtn.addEventListener('click', () => {
      if (!this.resolved) {
        this.resolved = true;
        this.onConfirm(false); 
      }
      this.close();
    });

    
    const discardBtn = buttonContainer.createEl('button', {
      type: 'button',
      text: t('template-builder.modal.unsaved-changes.discard'),
      cls: 'mod-warning',
    });
    discardBtn.addEventListener('click', () => {
      if (!this.resolved) {
        this.resolved = true;
        this.onConfirm(true); 
      }
      this.close();
    });
  }

  close(): void {
    super.close();
    
    if (!this.resolved) {
      this.resolved = true;
      this.onConfirm(false); 
    }
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}


export function showUnsavedChangesModal(app: App): Promise<boolean> {
  return new Promise((resolve) => {
    new UnsavedChangesModal(app, resolve).open();
  });
}


class DeleteTemplateConfirmationModal extends Modal {
  private resolved = false;

  constructor(
    app: App,
    private templateName: string,
    private onConfirm: (shouldDelete: boolean) => void
  ) {
    super(app);
    this.titleEl.setText(t('template-builder.modal.delete.title'));
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();

    contentEl.createEl('p', {
      text: t('template-builder.modal.delete.body', {
        name: this.templateName,
      }),
    });
    contentEl.createEl('p', {
      text: t('template-builder.modal.delete.warning'),
      cls: 'mod-warning',
    });

    const buttonContainer = contentEl.createDiv({
      cls: 'modal-button-container journalit-modal-button-container',
    });

    
    const cancelBtn = buttonContainer.createEl('button', {
      type: 'button',
      text: t('template-builder.modal.delete.cancel'),
    });
    cancelBtn.addEventListener('click', () => {
      if (!this.resolved) {
        this.resolved = true;
        this.onConfirm(false);
      }
      this.close();
    });

    
    const deleteBtn = buttonContainer.createEl('button', {
      type: 'button',
      text: t('template-builder.modal.delete.confirm'),
      cls: 'mod-warning',
    });
    deleteBtn.addEventListener('click', () => {
      if (!this.resolved) {
        this.resolved = true;
        this.onConfirm(true);
      }
      this.close();
    });
  }

  close(): void {
    super.close();
    
    if (!this.resolved) {
      this.resolved = true;
      this.onConfirm(false); 
    }
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}


export function showDeleteTemplateModal(
  app: App,
  templateName: string
): Promise<boolean> {
  return new Promise((resolve) => {
    new DeleteTemplateConfirmationModal(app, templateName, resolve).open();
  });
}
