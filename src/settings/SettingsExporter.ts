import { logger } from '../utils/logger';


import { Notice, App } from 'obsidian';
import JournalitPlugin from '../main';
import { JournalitSettings, DEFAULT_SETTINGS } from './types';
import { t } from '../lang/helpers';
import { BackendSecretStorage } from '../services/backend/BackendSecretStorage';
import { eventBus } from '../services/events/EventBus';
import {
  showActionConfirmationModal,
  showConfirmationModal,
} from '../components/shared/ConfirmationModal';
import { normalizeGalleryFolders } from './settingsNormalization';
import { normalizeHomeBackgroundImagePath } from '../components/home/homeBackgroundUtils';

export function redactSettingsSecretsForExport(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => redactSettingsSecretsForExport(item));
  }

  if (typeof value !== 'object' || value === null) {
    return value;
  }

  const redacted: Record<string, unknown> = {};
  for (const [key, nestedValue] of Object.entries(value)) {
    if (
      key === 'authToken' ||
      key === 'ftpPassword' ||
      key === 'secretStorageNamespace'
    ) {
      continue;
    }
    redacted[key] = redactSettingsSecretsForExport(nestedValue);
  }

  return redacted;
}

interface SettingsImportFile {
  _version?: string;
  settings?: unknown;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function parseSettingsImport(content: string): SettingsImportFile {
  const parsed: unknown = JSON.parse(content);
  if (!isRecord(parsed)) return {};
  return {
    _version: typeof parsed._version === 'string' ? parsed._version : undefined,
    settings: parsed.settings,
  };
}

function cloneDefaultSettings(): JournalitSettings {
  return structuredClone(DEFAULT_SETTINGS);
}

function removeLocalSecretNamespaceFromImport(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => removeLocalSecretNamespaceFromImport(item));
  }

  if (typeof value !== 'object' || value === null) {
    return value;
  }

  const sanitized: Record<string, unknown> = {};
  for (const [key, nestedValue] of Object.entries(value)) {
    if (key === 'secretStorageNamespace') {
      continue;
    }
    sanitized[key] = removeLocalSecretNamespaceFromImport(nestedValue);
  }

  return sanitized;
}


export class SettingsExporter {
  private plugin: JournalitPlugin;

  constructor(plugin: JournalitPlugin) {
    this.plugin = plugin;
  }

  
  async exportSettings(): Promise<void> {
    try {
      const exportData = {
        _exportedAt: new Date().toISOString(),
        _version: this.plugin.manifest.version,
        _pluginId: this.plugin.manifest.id,
        settings: redactSettingsSecretsForExport(this.plugin.settings),
      };

      const filename = `journalit-settings-${new Date().toISOString().split('T')[0]}.json`;
      const content = JSON.stringify(exportData, null, 2);

      
      const blob = new Blob([content], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const a = window.activeDocument.body.createEl('a');
      a.href = url;
      a.download = filename;
      try {
        a.click();
      } finally {
        a.remove();
        URL.revokeObjectURL(url);
      }

      new Notice(t('notice.settings-exported', { filename }), 5000);
    } catch (error) {
      console.error('Failed to export settings:', error);
      new Notice(t('notice.error.export-settings'), 5000);
    }
  }

  
  async importSettings(file: File): Promise<boolean> {
    try {
      const content = await file.text();
      const importData = parseSettingsImport(content);

      
      if (!importData.settings || typeof importData.settings !== 'object') {
        throw new Error('Invalid settings file: missing settings object');
      }

      
      if (!this.isValidSettingsStructure(importData.settings)) {
        throw new Error(
          'Invalid settings file: does not appear to be Journalit settings'
        );
      }

      
      const mergedSettings = this.deepMergeSettings(
        this.plugin.settings,
        removeLocalSecretNamespaceFromImport(importData.settings)
      );
      if (this.isPlainObject(mergedSettings.trade)) {
        mergedSettings.trade.galleryFolders = normalizeGalleryFolders(
          mergedSettings.trade.galleryFolders
        );
      }
      if (mergedSettings.home) {
        mergedSettings.home.backgroundImagePath =
          normalizeHomeBackgroundImagePath(
            mergedSettings.home.backgroundImagePath,
            this.plugin.settings.home?.backgroundImagePath || undefined
          );
        mergedSettings.home.showBackgroundInDashboard =
          typeof mergedSettings.home.showBackgroundInDashboard === 'boolean'
            ? mergedSettings.home.showBackgroundInDashboard
            : (this.plugin.settings.home?.showBackgroundInDashboard ?? false);
      }
      const mergedSessionMode = mergedSettings.sessionMode;
      if (!this.isPlainObject(mergedSessionMode)) {
        mergedSettings.sessionMode =
          this.plugin.settings.sessionMode ?? DEFAULT_SETTINGS.sessionMode;
      } else if (
        typeof mergedSessionMode.showTradeExecutionsInSessionLog !== 'boolean'
      ) {
        mergedSessionMode.showTradeExecutionsInSessionLog =
          this.plugin.settings.sessionMode?.showTradeExecutionsInSessionLog ??
          DEFAULT_SETTINGS.sessionMode.showTradeExecutionsInSessionLog;
      }

      
      this.plugin.settings = mergedSettings;
      await BackendSecretStorage.migrateLegacySettings(this.plugin, {
        overwriteExistingSecrets: true,
      });
      await this.plugin.saveSettings();

      
      window.activeDocument.dispatchEvent(
        new CustomEvent('journalit-settings-updated', {
          detail: { source: 'SettingsExporter.import' },
        })
      );
      eventBus.publish('settings:changed', {
        section: 'all',
        source: 'SettingsExporter.import',
      });

      const exportVersion = importData._version ?? 'unknown';
      new Notice(
        t('notice.settings-imported', { version: exportVersion }),
        10000
      );

      return true;
    } catch (error) {
      console.error('Failed to import settings:', error);
      new Notice(
        t('notice.error.import-settings', {
          error: error instanceof Error ? error.message : String(error),
        }),
        5000
      );
      return false;
    }
  }

  
  async resetToDefaults(app: App): Promise<boolean> {
    const confirmed = await showActionConfirmationModal<boolean>(app, {
      title: t('settings.reset.modal.title'),
      destructive: true,
      renderContent: (contentEl) => {
        const container = contentEl.createDiv({
          cls: 'journalit-confirmation-content',
        });

        container.createEl('p', {
          text: t('settings.reset.modal.explanation'),
          cls: 'journalit-confirmation-modal__message',
        });

        const infoBox = container.createDiv({
          cls: 'journalit-confirmation-content__info',
        });
        const list = infoBox.createEl('ul', {
          cls: 'journalit-confirmation-content__list',
        });
        list.createEl('li', {
          text: t('settings.reset.modal.item-custom-options'),
        });
        list.createEl('li', {
          text: t('settings.reset.modal.item-account-settings'),
        });
        list.createEl('li', {
          text: t('settings.reset.modal.item-dashboard-layouts'),
        });
        list.createEl('li', {
          text: t('settings.reset.modal.item-symbol-mappings'),
        });
        list.createEl('li', {
          text: t('settings.reset.modal.item-csv-templates'),
        });
        list.createEl('li', { text: t('settings.reset.modal.item-other') });

        const backupNote = container.createEl('p', {
          cls: 'journalit-confirmation-modal__message',
        });
        backupNote.createEl('strong', {
          text: t('common.note-label'),
        });
        backupNote.createSpan({
          text: ` ${t('settings.reset.modal.backup-note')}`,
        });

        const warningBox = container.createDiv({
          cls: 'journalit-confirmation-content__alert journalit-confirmation-content__alert--destructive',
        });
        warningBox.createEl('p', {
          text: t('settings.reset.modal.warning'),
          cls: 'journalit-confirmation-modal__message',
        });
      },
      cancelValue: false,
      actions: [
        {
          value: false,
          label: t('button.cancel'),
          variant: 'secondary',
          initialFocus: true,
        },
        {
          value: true,
          label: t('button.reset-to-defaults'),
          variant: 'destructive',
        },
      ],
    });

    if (!confirmed) return false;

    try {
      
      const backupCreated = await this.createBackupBeforeReset();

      
      if (!backupCreated) {
        const proceedAnyway = await showConfirmationModal(app, {
          title: t('settings.reset.backup-failed.title'),
          message: [
            { text: t('settings.reset.backup-failed.message') },
            {
              text: t('settings.reset.backup-failed.warning'),
              destructive: true,
            },
          ],
          confirmLabel: t('button.proceed-anyway'),
          cancelLabel: t('button.cancel-reset'),
          destructive: true,
        });
        if (!proceedAnyway) return false;
      }

      
      BackendSecretStorage.clearAuthToken(this.plugin);
      BackendSecretStorage.clearFTPPassword(this.plugin);
      this.plugin.settings = cloneDefaultSettings();
      await this.plugin.saveSettings();

      
      window.activeDocument.dispatchEvent(
        new CustomEvent('journalit-settings-updated', {
          detail: { source: 'SettingsExporter.reset' },
        })
      );
      eventBus.publish('settings:changed', {
        section: 'all',
        source: 'SettingsExporter.reset',
      });

      const noticeMsg = backupCreated
        ? t('notice.settings-reset-with-backup')
        : t('notice.settings-reset-no-backup');
      new Notice(noticeMsg, 10000);
      return true;
    } catch (error) {
      console.error('Failed to reset settings:', error);
      new Notice(t('notice.error.reset-settings'), 5000);
      return false;
    }
  }

  
  private async createBackupBeforeReset(): Promise<boolean> {
    try {
      const backupPath = `${this.plugin.app.vault.configDir}/plugins/journalit/data.pre-reset-backup.json`;
      await this.plugin.app.vault.adapter.write(
        backupPath,
        JSON.stringify(this.plugin.settings, null, 2)
      );
      logger.debug('Pre-reset backup created at:', backupPath);
      return true;
    } catch (error) {
      console.warn('Failed to create pre-reset backup:', error);
      return false;
    }
  }

  
  private isValidSettingsStructure(
    data: unknown
  ): data is Partial<JournalitSettings> {
    if (!data || typeof data !== 'object') return false;

    
    const expectedKeys = ['general', 'trade'];
    const hasExpectedKeys = expectedKeys.every((key) => key in data);

    
    const hasReasonableKeys = Object.keys(data).length >= 2;

    return hasExpectedKeys && hasReasonableKeys;
  }

  
  private deepMergeSettings(
    current: JournalitSettings,
    imported: unknown
  ): JournalitSettings {
    if (!this.isPlainObject(imported)) {
      return current;
    }
    return this.deepMergeSettingsObject(current, imported);
  }

  private deepMergeSettingsObject(
    current: JournalitSettings,
    imported: Record<string, unknown>
  ): JournalitSettings {
    const merged: JournalitSettings = { ...current };
    for (const key of Object.keys(imported)) {
      const currentValue = current[key];
      const importedValue = imported[key];

      if (
        this.isPlainObject(importedValue) &&
        this.isPlainObject(currentValue)
      ) {
        merged[key] = this.deepMergeRecord(currentValue, importedValue);
      } else {
        merged[key] = importedValue;
      }
    }

    return merged;
  }

  private deepMergeRecord(
    current: Record<string, unknown>,
    imported: Record<string, unknown>
  ): Record<string, unknown> {
    const merged: Record<string, unknown> = { ...current };
    for (const key of Object.keys(imported)) {
      const currentValue = current[key];
      const importedValue = imported[key];
      merged[key] =
        this.isPlainObject(importedValue) && this.isPlainObject(currentValue)
          ? this.deepMergeRecord(currentValue, importedValue)
          : importedValue;
    }
    return merged;
  }

  private isPlainObject(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }

  
  openImportFilePicker(): Promise<File | null> {
    return new Promise((resolve) => {
      const input = createEl('input', {
        attr: { type: 'file', accept: '.json' },
      });

      input.onchange = () => {
        resolve(input.files?.[0] ?? null);
      };

      input.oncancel = () => {
        resolve(null);
      };

      input.click();
    });
  }
}
