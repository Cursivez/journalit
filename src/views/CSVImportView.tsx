

import React from 'react';
import { WorkspaceLeaf } from 'obsidian';
import { ReactView } from './ReactView';
import { RenderFunction } from './types';
import JournalitPlugin from '../main';
import { CSVImport } from '../components/csv/CSVImport';
import { t } from '../lang/helpers';

export const CSV_IMPORT_VIEW_TYPE = 'journalit-csv-import-view';

export class CSVImportView extends ReactView {
  private plugin: JournalitPlugin;

  constructor(leaf: WorkspaceLeaf, plugin: JournalitPlugin) {
    super(leaf, {
      containerClass: 'journalit-csv-import-view-container',
      rootId: 'journalit-csv-import-view',
      displayPolicyPrivacyModeOverride: false,
    });
    this.plugin = plugin;
  }

  getViewType(): string {
    return CSV_IMPORT_VIEW_TYPE;
  }

  getDisplayText(): string {
    return t('view.csv-import');
  }

  getIcon(): string {
    return 'import';
  }

  async onOpen(): Promise<void> {
    try {
      await super.onOpen();
      this.containerEl.addClass('journalit-csv-import-container');
    } catch (error) {
      console.error('[CSVImportView] Failed to initialize:', error);
    }
  }

  protected getRenderFunction(): RenderFunction {
    const CSVImportComponent = () => <CSVImport plugin={this.plugin} />;
    CSVImportComponent.displayName = 'CSVImportComponent';
    return CSVImportComponent;
  }
}
