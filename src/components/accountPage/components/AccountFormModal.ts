

import { createRef, type Ref } from 'react';
import { t } from '../../../lang/helpers';
import { showConfirmationModal } from '../../shared/ConfirmationModal';
import { JournalitModal } from '../../modals/JournalitModal';


type AccountFormCloseState = 'saving' | 'unsaved' | 'clean';


export interface AccountFormCloseHandle {
  closeState: () => AccountFormCloseState;
}


export interface AccountFormCloseProps {
  
  onModalClose: () => void;
  
  onRequestClose: () => void;
  
  closeHandle?: Ref<AccountFormCloseHandle>;
}

export abstract class AccountFormModal extends JournalitModal {
  private confirmingClose = false;

  
  protected readonly closeHandle = createRef<AccountFormCloseHandle>();

  
  protected readonly closeWithoutConfirm = () => {
    super.close();
  };

  close(): void {
    if (this.confirmingClose) return;
    
    const state = this.closeHandle.current?.closeState() ?? 'clean';
    if (state === 'saving') return;
    if (state === 'clean') {
      super.close();
      return;
    }
    this.confirmingClose = true;
    void showConfirmationModal(this.app, {
      title: t('form.modal.unsaved-changes.title'),
      message: [
        { text: t('account.form.unsaved-changes.body') },
        { text: t('form.modal.unsaved-changes.body2') },
      ],
      cancelLabel: t('form.modal.unsaved-changes.continue'),
      confirmLabel: t('form.modal.unsaved-changes.discard'),
      destructive: true,
    })
      .then((discard) => {
        if (discard) super.close();
      })
      .finally(() => {
        this.confirmingClose = false;
      });
  }
}
