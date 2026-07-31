

import { App } from 'obsidian';
import { t } from '../../lang/helpers';
import { showConfirmationModal } from '../shared/ConfirmationModal';



export function showUnsavedChangesModal(app: App): Promise<boolean> {
  return showConfirmationModal(app, {
    title: t('template-builder.modal.unsaved-changes.title'),
    message: [
      { text: t('template-builder.modal.unsaved-changes.body1') },
      { text: t('template-builder.modal.unsaved-changes.body2') },
    ],
    cancelLabel: t('template-builder.modal.unsaved-changes.continue'),
    confirmLabel: t('template-builder.modal.unsaved-changes.discard'),
    destructive: true,
  });
}



export function showDeleteTemplateModal(
  app: App,
  templateName: string
): Promise<boolean> {
  return showConfirmationModal(app, {
    title: t('template-builder.modal.delete.title'),
    message: [
      {
        text: t('template-builder.modal.delete.body', {
          name: templateName,
        }),
      },
      {
        text: t('template-builder.modal.delete.warning'),
        destructive: true,
      },
    ],
    confirmLabel: t('template-builder.modal.delete.confirm'),
    cancelLabel: t('template-builder.modal.delete.cancel'),
    destructive: true,
  });
}
