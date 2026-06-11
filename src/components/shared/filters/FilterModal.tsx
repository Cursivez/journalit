

import { Modal } from 'obsidian';
import React from 'react';
import { Root, createRoot } from 'react-dom/client';
import { FilterModalProps } from './types';
import { FilterModalContent } from './FilterModalContent';
import { ensureFilterModalStyles } from './filterModalStyles';
import { registerExternalGuideTarget } from '../../../guides/GuideRuntimeLayer';
import { TRADE_LOG_FILTER_MODAL_TARGET_ID } from '../../../guides/tradeLogGuideIds';
import { t } from '../../../lang/helpers';


class FilterModal extends Modal {
  private props: FilterModalProps;
  private container: HTMLDivElement;
  private root: Root | null = null;

  constructor(props: FilterModalProps) {
    super(props.app);
    this.titleEl.setText(t('filter.modal.title'));
    this.props = props;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();

    

    
    this.container = contentEl.createDiv({ cls: 'filter-modal-content' });

    
    this.modalEl.addClass('journalit-filter-modal');

    
    contentEl.addClass('filter-modal-container');

    if (this.props.context === 'tradelog') {
      registerExternalGuideTarget(
        TRADE_LOG_FILTER_MODAL_TARGET_ID,
        this.modalEl
      );
    }

    
    this.renderComponent();
  }

  onClose() {
    if (this.props.context === 'tradelog') {
      registerExternalGuideTarget(TRADE_LOG_FILTER_MODAL_TARGET_ID, null);
    }

    
    if (this.root) {
      this.root.unmount();
    }
    this.props.onClose();
  }

  private renderComponent() {
    this.root = createRoot(this.container);
    this.root.render(
      <FilterModalContent {...this.props} onModalClose={() => this.close()} />
    );
  }
}


export function openFilterModal(props: FilterModalProps): FilterModal {
  
  

  const modal = new FilterModal(props);
  modal.open();
  return modal;
}
