import { Modal } from 'obsidian';



const openModals = new Set<JournalitModal>();


export abstract class JournalitModal extends Modal {
  private unloading = false;

  
  protected get closingForUnload(): boolean {
    return this.unloading;
  }

  open(): void {
    openModals.add(this);
    super.open();
  }

  close(): void {
    openModals.delete(this);
    super.close();
  }

  
  private closeForUnload(): void {
    this.unloading = true;
    openModals.delete(this);
    super.close();
  }

  static closeAllForUnload(): void {
    for (const modal of [...openModals]) {
      
      try {
        modal.closeForUnload();
      } catch (error) {
        console.error('Journalit: failed to close modal on unload', error);
      }
    }
  }
}
