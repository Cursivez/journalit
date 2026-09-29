

import React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { Modal, type App } from 'obsidian';
import { t } from '../../lang/helpers';
import {
  CreateCustomFieldFromColumn,
  type NewColumnCustomField,
} from './CreateCustomFieldFromColumn';

interface CustomFieldFromColumnModalOptions {
  header: string;
  sampleValues: readonly string[];
  existingLabels: readonly string[];
  
  onCreate: (field: NewColumnCustomField) => Promise<boolean>;
}

class CustomFieldFromColumnModal extends Modal {
  private root: Root | null = null;

  constructor(
    app: App,
    private readonly options: CustomFieldFromColumnModalOptions
  ) {
    super(app);
  }

  onOpen(): void {
    this.titleEl.setText(
      t('trade-import.custom-field.title', { header: this.options.header })
    );
    this.modalEl.addClass('journalit-trade-import-new-field-modal');
    this.root = createRoot(this.contentEl.createDiv());
    this.root.render(
      <CreateCustomFieldFromColumn
        header={this.options.header}
        sampleValues={this.options.sampleValues}
        existingLabels={this.options.existingLabels}
        onCancel={() => this.close()}
        onCreate={async (field) => {
          if (await this.options.onCreate(field)) this.close();
        }}
      />
    );
  }

  onClose(): void {
    this.root?.unmount();
    this.root = null;
    this.contentEl.empty();
  }
}

export function openCustomFieldFromColumnModal(
  app: App,
  options: CustomFieldFromColumnModalOptions
): void {
  new CustomFieldFromColumnModal(app, options).open();
}
