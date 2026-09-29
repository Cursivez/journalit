

import React from 'react';
import { Menu, WorkspaceLeaf } from 'obsidian';
import { ReactView } from './ReactView';
import { RenderFunction } from './types';
import JournalitPlugin from '../main';
import { CSVImport } from '../components/csv/CSVImport';
import { clearUpgradeOrigin } from '../services/upgrade/upgradeOrigin';
import { t } from '../lang/helpers';
import { ApiClient } from '../services/backend/ApiClient';
import { openImportManagement } from '../services/tradeImport/importManagementNavigation';

export const CSV_IMPORT_VIEW_TYPE = 'journalit-csv-import-view';

export class CSVImportView extends ReactView {
  private plugin: JournalitPlugin;
  private manageImportsAction: HTMLElement | null = null;

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
      
      
      this.syncManageImportsAction();
      const syncAction = () => this.syncManageImportsAction();
      for (const event of [
        'journalit:subscription-changed',
        'journalit:entitlements-refreshed',
      ]) {
        window.addEventListener(event, syncAction);
        this.register(() => window.removeEventListener(event, syncAction));
      }
    } catch (error) {
      console.error('[CSVImportView] Failed to initialize:', error);
    }
  }

  onPaneMenu(menu: Menu, source: string): void {
    super.onPaneMenu(menu, source);
    if (!this.canManageImports()) return;
    menu.addItem((item) =>
      item
        .setTitle(t('trade-import.action.manage-imports'))
        .setIcon('history')
        .onClick(() => this.openImportManagement())
    );
  }

  private canManageImports(): boolean {
    return (
      ApiClient.getAuthToken() !== null &&
      this.plugin.settings.backendIntegration?.subscriptionTier === 'premium'
    );
  }

  private syncManageImportsAction(): void {
    const allowed = this.canManageImports();
    if (allowed && !this.manageImportsAction) {
      this.manageImportsAction = this.addAction(
        'history',
        t('trade-import.action.manage-imports'),
        () => this.openImportManagement()
      );
    } else if (!allowed && this.manageImportsAction) {
      this.manageImportsAction.remove();
      this.manageImportsAction = null;
    }
  }

  private openImportManagement(): void {
    openImportManagement(this.plugin);
  }

  async onClose(): Promise<void> {
    
    
    
    clearUpgradeOrigin('csvImport');
    await super.onClose();
  }

  protected getRenderFunction(): RenderFunction {
    const CSVImportComponent = () => <CSVImport plugin={this.plugin} />;
    CSVImportComponent.displayName = 'CSVImportComponent';
    return CSVImportComponent;
  }
}
