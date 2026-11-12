

import React, { useCallback, useEffect, useState, useRef } from 'react';
import { normalizePath, Notice, TFile, TFolder } from 'obsidian';
import JournalitPlugin from '../../../main';
import ToggleSwitch from '../../../components/ui/ToggleSwitch';
import { Button } from '../../../components/ui/Button';
import { Accordion } from '../../../components/shared/Accordion';
import { Folder, X } from '../../../components/shared/icons/ObsidianIcon';
import { FolderBrowser } from '../../../components/ui/FolderBrowser';
import { openPathChangeInstructionModal } from '../../../components/modals/PathChangeInstructionModal';
import { useDebouncedFunction } from '../../../hooks/useDebounced';
import { useEventBus } from '../../../hooks/useEventBus';
import { TradePathUpdateUtility } from '../../../services/trade/TradePathUpdateUtility';
import { eventBus } from '../../../services/events/EventBus';
import { SettingsExporter } from '../../SettingsExporter';
import { t } from '../../../lang/helpers';
import { createDefaultBackendIntegrationSettings } from '../../types';
import {
  applyGalleryFolderMutation,
  galleryFoldersMatch,
  persistGalleryFolderMutation,
  type GalleryFolderMutation,
} from '../../galleryFolderMutations';
import {
  isSupportedHomeBackgroundFile,
  saveHomeBackgroundFile,
} from '../../../components/home/homeBackgroundUtils';
import { ensureHomeSettings } from '../../homeSettings';
import type { JournalSettingsContext } from '../../../demo/DemoSettingsScope';
import { canApplyJournalFolderEdit } from './journalFolderEditContext';

const RESOLVED_SETTINGS_SAVE_PROMISE = Promise.resolve();

function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="journalit-settings-section">
      <h4>{title}</h4>
      {children}
    </section>
  );
}

function useAdvancedSettingsModel({ plugin }: { plugin: JournalitPlugin }) {
  const [settingsVersion, setSettingsVersion] = useState(0);
  
  const [journalFolderPath, setJournalFolderPath] = useState(
    plugin.settings.general?.journalFolderPath || ''
  );
  const [journalFolderResetVersion, setJournalFolderResetVersion] = useState(0);

  
  const [isUpdatingImages, setIsUpdatingImages] = useState(false);

  
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  
  const [settingsExporter] = useState(() => new SettingsExporter(plugin));

  
  useEffect(() => {
    setJournalFolderPath(plugin.settings.general?.journalFolderPath || '');
  }, [plugin.settings.general?.journalFolderPath, settingsVersion]);

  
  const applyJournalFolderPathChange = useDebouncedFunction(
    async (request: {
      newPath: string;
      originContext: JournalSettingsContext;
    }) => {
      const { newPath, originContext } = request;
      const folderPathService = plugin.serviceManager?.getFolderPathService();
      const currentPath = folderPathService?.journalFolderPath || '!Journalit';
      const contextChanged = () =>
        !folderPathService ||
        !canApplyJournalFolderEdit(originContext, folderPathService.context);
      if (contextChanged()) {
        new Notice(t('sample.notice.folder-locked'), 5000);
        setJournalFolderPath(currentPath);
        setJournalFolderResetVersion((version) => version + 1);
        return;
      }

      
      const backendService =
        await plugin.serviceManager.getBackendIntegrationService();
      if (backendService?.getIsSyncing()) {
        new Notice(t('notice.error.cannot-change-folder-during-sync'), 5000);
        
        setJournalFolderPath(currentPath);
        setJournalFolderResetVersion((version) => version + 1);
        return;
      }

      if (newPath === currentPath) {
        return; 
      }

      
      let hasExistingTrades = false;
      try {
        const vault = plugin.app.vault;
        const allFiles = vault.getMarkdownFiles();
        const effectiveCurrentPath = currentPath || '!Journalit';
        hasExistingTrades = allFiles.some((file) =>
          file.path.startsWith(effectiveCurrentPath)
        );
      } catch (error) {
        console.warn('Failed to check for existing trades:', error);
      }

      
      const effectiveCurrentPath = currentPath || '!Journalit';

      
      let effectiveNewPath: string;
      if (!newPath || newPath.trim() === '') {
        
        effectiveNewPath = '!Journalit';
      } else {
        
        const normalizedNewPath = newPath.endsWith('/')
          ? newPath.slice(0, -1)
          : newPath;
        effectiveNewPath = `${normalizedNewPath}/!Journalit`;
      }

      if (contextChanged()) {
        setJournalFolderPath(currentPath);
        setJournalFolderResetVersion((version) => version + 1);
        return;
      }

      openPathChangeInstructionModal(
        plugin.app,
        plugin,
        effectiveCurrentPath,
        effectiveNewPath,
        hasExistingTrades,
        async () => {
          
          try {
            if (
              !folderPathService ||
              !canApplyJournalFolderEdit(
                originContext,
                folderPathService.context
              )
            ) {
              throw new Error('Journal context changed before folder update');
            }
            await folderPathService.updatePath(effectiveNewPath);

            
            eventBus.publish('settings:changed', { source: 'user-input' });

            
            setJournalFolderPath(effectiveNewPath);
            setSettingsVersion((prev) => prev + 1);

            new Notice(
              t('settings.general.folder-updated', { path: effectiveNewPath })
            );
          } catch (error) {
            console.error('Failed to update journal folder path:', error);
            new Notice(
              t('settings.general.folder-update-failed', {
                error: error instanceof Error ? error.message : String(error),
              })
            );
            setJournalFolderPath(currentPath); 
            setJournalFolderResetVersion((version) => version + 1);
          }
        },
        () => {
          
          setJournalFolderPath(currentPath);
          setJournalFolderResetVersion((version) => version + 1);
        }
      );
    },
    2000, 
    { leading: false, trailing: true }
  );

  const handleJournalFolderPathChange = (newPath: string) => {
    const originContext = plugin.serviceManager.getFolderPathService().context;
    applyJournalFolderPathChange({ newPath, originContext });
  };

  return {
    plugin,
    journalFolderPath,
    journalFolderResetVersion,
    handleJournalFolderPathChange,
    isUpdatingImages,
    setIsUpdatingImages,
    settingsExporter,
    isExporting,
    setIsExporting,
    isImporting,
    setIsImporting,
    isResetting,
    setIsResetting,
    setSettingsVersion,
  };
}

type AdvancedSettingsModel = ReturnType<typeof useAdvancedSettingsModel>;

export function GalleryFoldersSettingsControl({
  plugin,
}: Pick<AdvancedSettingsModel, 'plugin'>) {
  const [folders, setFolders] = useState(
    () => plugin.settings.trade.galleryFolders ?? []
  );
  const foldersRef = useRef(folders);
  const saveQueueRef = useRef<Promise<void>>(RESOLVED_SETTINGS_SAVE_PROMISE);
  const latestMutationIdRef = useRef(0);
  const pendingSavesRef = useRef(0);
  const [selectedPath, setSelectedPath] = useState('');
  const [folderBrowserKey, setFolderBrowserKey] = useState(0);

  useEventBus('settings:changed', (payload) => {
    if (payload.source === 'gallery-folders') return;
    
    
    
    
    if (pendingSavesRef.current > 0) return;
    const canonicalFolders = [...plugin.settings.trade.galleryFolders];
    foldersRef.current = canonicalFolders;
    setFolders(canonicalFolders);
  });

  const saveFolders = (mutation: GalleryFolderMutation): Promise<void> => {
    const mutationId = ++latestMutationIdRef.current;
    const folderIdentity = plugin.app.vault.getAbstractFileByPath(
      mutation.path
    );
    const queuedMutation =
      folderIdentity instanceof TFolder
        ? { ...mutation, getCurrentPath: () => folderIdentity.path }
        : mutation;
    const optimisticFolders = applyGalleryFolderMutation(
      foldersRef.current,
      queuedMutation
    );
    foldersRef.current = optimisticFolders;
    setFolders(optimisticFolders);
    pendingSavesRef.current += 1;
    const save = saveQueueRef.current.then(async () => {
      try {
        const result = await persistGalleryFolderMutation({
          currentFolders: plugin.settings.trade.galleryFolders,
          mutation: queuedMutation,
          setCanonicalFolders: (folders) => {
            plugin.settings.trade.galleryFolders = folders;
          },
          getCanonicalFolders: () => plugin.settings.trade.galleryFolders,
          saveSettings: () => plugin.saveSettings(),
          onTargetApplied: (targetFolders) => {
            if (mutationId === latestMutationIdRef.current) {
              foldersRef.current = targetFolders;
              setFolders(targetFolders);
            }
          },
        });
        if (result.success) {
          eventBus.publish('settings:changed', {
            section: 'trade',
            source: 'gallery-folders',
          });
        } else {
          console.error('Failed to save gallery folders:', result.error);
          const mutationIsCurrent =
            mutationId === latestMutationIdRef.current &&
            galleryFoldersMatch(foldersRef.current, result.targetFolders);
          if (mutationIsCurrent) {
            foldersRef.current = result.folders;
            setFolders(result.folders);
          }
          new Notice(t('settings.gallery-folders.save-failed'), 5000);
        }
      } finally {
        pendingSavesRef.current -= 1;
      }
    });
    saveQueueRef.current = save.catch(() => undefined);
    return save;
  };

  const handleAdd = async () => {
    const normalized = normalizePath(selectedPath.trim());
    const currentFolders = foldersRef.current;
    if (!normalized || currentFolders.includes(normalized)) return;
    if (plugin.app.vault.getAbstractFileByPath(normalized) instanceof TFile) {
      new Notice(t('settings.gallery-folders.not-a-folder'), 5000);
      return;
    }
    const save = saveFolders({ kind: 'add', path: normalized });
    setSelectedPath('');
    setFolderBrowserKey((current) => current + 1);
    await save;
  };

  const handleRemove = (folderPath: string) => {
    void saveFolders({ kind: 'remove', path: folderPath });
  };

  return (
    <>
      {folders.length > 0 && (
        <div className="journalit-gallery-folders-list">
          {folders.map((folderPath) => (
            <div className="journalit-gallery-folders-row" key={folderPath}>
              <Folder
                aria-hidden="true"
                className="journalit-gallery-folders-row__icon"
                size={15}
              />
              <span className="journalit-gallery-folders-row__path">
                {folderPath}
              </span>
              <button
                aria-label={t('settings.gallery-folders.remove-aria', {
                  path: folderPath,
                })}
                className="clickable-icon journalit-gallery-folders-row__remove"
                onClick={() => handleRemove(folderPath)}
                type="button"
              >
                <X aria-hidden="true" size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="journalit-gallery-folders-add">
        <FolderBrowser
          app={plugin.app}
          includeJournalitTree
          key={folderBrowserKey}
          onChange={setSelectedPath}
          onInputChange={setSelectedPath}
          placeholder={t('settings.gallery-folders.placeholder')}
          selectedPath={selectedPath}
        />
        <Button
          disabled={
            !selectedPath.trim() ||
            folders.includes(normalizePath(selectedPath.trim()))
          }
          onClick={handleAdd}
          size="small"
          variant="primary"
        >
          {t('settings.gallery-folders.add')}
        </Button>
      </div>
    </>
  );
}

export function SyncNotificationSettingsSection({
  plugin,
}: Pick<AdvancedSettingsModel, 'plugin'>) {
  const [notificationSettings, setNotificationSettings] = useState(() => ({
    showSyncNotifications:
      plugin.settings.backendIntegration?.showSyncNotifications ?? true,
    showNewTradeNotifications:
      plugin.settings.backendIntegration?.showNewTradeNotifications ?? true,
  }));

  const ensureBackendIntegrationSettings = () => {
    plugin.settings.backendIntegration ??=
      createDefaultBackendIntegrationSettings();
    return plugin.settings.backendIntegration;
  };

  const saveNotificationSetting = async (
    key: 'showSyncNotifications' | 'showNewTradeNotifications',
    value: boolean,
    noticeKey:
      | 'settings.general.sync-notifications-toggled'
      | 'settings.general.new-trade-notifications-toggled'
  ) => {
    const backendIntegration = ensureBackendIntegrationSettings();
    backendIntegration[key] = value;
    await plugin.saveSettings();
    setNotificationSettings((current) => ({
      ...current,
      [key]: value,
    }));
    new Notice(
      t(noticeKey, {
        status: value
          ? t('settings.general.enabled')
          : t('settings.general.disabled'),
      })
    );
  };

  return (
    <Accordion
      title={t('settings.general.notification-settings')}
      defaultExpanded={false}
    >
      <div className="setting-item">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('settings.general.sync-notifications')}
          </div>
          <div className="setting-item-description">
            {t('settings.general.sync-notifications-desc')}
          </div>
        </div>
        <div className="setting-item-control">
          <ToggleSwitch
            checked={notificationSettings.showSyncNotifications}
            onChange={(newValue: boolean) =>
              void saveNotificationSetting(
                'showSyncNotifications',
                newValue,
                'settings.general.sync-notifications-toggled'
              )
            }
            id="sync-notifications-toggle"
            ariaLabel={t('settings.general.sync-notifications-aria')}
          />
        </div>
      </div>

      <div className="setting-item">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('settings.general.new-trade-notifications')}
          </div>
          <div className="setting-item-description">
            {t('settings.general.new-trade-notifications-desc')}
          </div>
        </div>
        <div className="setting-item-control">
          <ToggleSwitch
            checked={notificationSettings.showNewTradeNotifications}
            onChange={(newValue: boolean) =>
              void saveNotificationSetting(
                'showNewTradeNotifications',
                newValue,
                'settings.general.new-trade-notifications-toggled'
              )
            }
            id="new-trade-notifications-toggle"
            ariaLabel={t('settings.general.new-trade-notifications-aria')}
          />
        </div>
      </div>
    </Accordion>
  );
}

function GeneralDataManagementSection({
  plugin,
  settingsExporter,
  isExporting,
  setIsExporting,
  isImporting,
  setIsImporting,
  isResetting,
  setIsResetting,
  setSettingsVersion,
}: Pick<
  AdvancedSettingsModel,
  | 'plugin'
  | 'settingsExporter'
  | 'isExporting'
  | 'setIsExporting'
  | 'isImporting'
  | 'setIsImporting'
  | 'isResetting'
  | 'setIsResetting'
  | 'setSettingsVersion'
>) {
  const importInputRef = useRef<HTMLInputElement>(null);
  const handleImportFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setIsImporting(true);
    try {
      if (await settingsExporter.importSettings(file)) {
        setSettingsVersion((prev) => prev + 1);
      }
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <SettingsSection title={t('settings.general.backup-restore-section')}>
      
      <div className="setting-item">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('settings.general.export-settings')}
          </div>
          <div className="setting-item-description">
            {t('settings.general.export-settings-desc')}
          </div>
        </div>
        <div className="setting-item-control">
          <Button
            variant="primary"
            onClick={() => {
              void (async () => {
                setIsExporting(true);
                try {
                  await settingsExporter.exportSettings();
                } finally {
                  setIsExporting(false);
                }
              })();
            }}
            disabled={isExporting}
            className="journalit-settings-action-button"
          >
            {isExporting
              ? t('settings.general.export-settings-exporting')
              : t('settings.general.export-settings')}
          </Button>
        </div>
      </div>

      
      <div className="setting-item">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('settings.general.import-settings')}
          </div>
          <div className="setting-item-description">
            {t('settings.general.import-settings-desc')}
          </div>
        </div>
        <div className="setting-item-control">
          <Button
            variant="primary"
            onClick={() => importInputRef.current?.click()}
            disabled={isImporting}
            className="journalit-settings-action-button"
          >
            {isImporting
              ? t('settings.general.import-settings-importing')
              : t('settings.general.import-settings')}
          </Button>
          
          <input
            ref={importInputRef}
            type="file"
            accept=".json"
            onChange={(event) => void handleImportFileChange(event)}
            className="journalit-settings-import-file-input"
            aria-hidden="true"
            tabIndex={-1}
          />
        </div>
      </div>

      
      <div className="setting-item journalit-settings-divider">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('settings.general.reset-to-defaults')}
          </div>
          <div className="setting-item-description">
            {t('settings.general.reset-to-defaults-desc')}
            <br />
            <span className="journalit-settings-text-error">
              {t('settings.general.reset-to-defaults-warning')}
            </span>
          </div>
        </div>
        <div className="setting-item-control">
          <Button
            variant="danger"
            onClick={() => {
              void (async () => {
                setIsResetting(true);
                try {
                  const success = await settingsExporter.resetToDefaults(
                    plugin.app
                  );
                  if (success) {
                    setSettingsVersion((prev) => prev + 1);
                  }
                } finally {
                  setIsResetting(false);
                }
              })();
            }}
            disabled={isResetting}
            className="journalit-settings-action-button"
          >
            {isResetting
              ? t('settings.general.reset-to-defaults-resetting')
              : t('settings.general.reset-to-defaults')}
          </Button>
        </div>
      </div>
    </SettingsSection>
  );
}

function GeneralFolderSettingsSection({
  plugin,
  journalFolderPath,
  journalFolderResetVersion,
  handleJournalFolderPathChange,
  setIsUpdatingImages,
  isUpdatingImages,
}: Pick<
  AdvancedSettingsModel,
  | 'plugin'
  | 'journalFolderPath'
  | 'journalFolderResetVersion'
  | 'handleJournalFolderPathChange'
  | 'setIsUpdatingImages'
  | 'isUpdatingImages'
>) {
  const isSampleContext =
    plugin.serviceManager.getFolderPathService().context === 'sample';
  return (
    <SettingsSection title={t('settings.general.folder-section')}>
      
      <div className="setting-item">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('settings.general.journal-folder')}
          </div>
          <div className="setting-item-description">
            {t('settings.general.journal-folder-desc')}
            <br />
            {t('settings.general.journal-folder-desc-2')}
          </div>
        </div>
        <div className="setting-item-control">
          <FolderBrowser
            selectedPath={journalFolderPath}
            resetToken={journalFolderResetVersion}
            onChange={handleJournalFolderPathChange}
            placeholder={
              journalFolderPath
                ? t('settings.general.journal-folder-placeholder')
                : t('settings.general.journal-folder-default')
            }
            app={plugin.app}
          />
        </div>
      </div>

      
      <div className="setting-item journalit-settings-divider journalit-settings-divider--compact">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('settings.general.update-image-paths')}
          </div>
          <div className="setting-item-description">
            {t('settings.general.update-image-paths-desc')}
          </div>
        </div>
        <div className="setting-item-control">
          <Button
            variant="primary"
            onClick={() => {
              if (
                plugin.serviceManager.getFolderPathService().context ===
                'sample'
              ) {
                return;
              }
              void (async () => {
                setIsUpdatingImages(true);
                try {
                  const currentPath =
                    plugin.settings.general?.journalFolderPath || '!Journalit';
                  const normalizedCurrentPath =
                    currentPath.replace(/\/$/, '') + '/';

                  
                  const allFiles = plugin.app.vault.getMarkdownFiles();
                  const oldBasePaths = new Set<string>();

                  const utility = new TradePathUpdateUtility(
                    plugin.app,
                    plugin.tradeService
                  );

                  for (const file of allFiles) {
                    
                    const oldPaths = utility.getImageBasePaths(
                      file,
                      normalizedCurrentPath
                    );

                    if (oldPaths.size > 0) {
                      oldPaths.forEach((oldPath) => oldBasePaths.add(oldPath));
                    }
                  }

                  if (oldBasePaths.size === 0) {
                    new Notice(t('settings.general.update-image-paths-match'));
                    setIsUpdatingImages(false);
                    return;
                  }

                  
                  let totalFilesUpdated = 0;
                  let totalFailed = 0;
                  const allErrors: string[] = [];

                  const pathStats = await utility.updateImagePathsForBasePaths(
                    Array.from(oldBasePaths),
                    normalizedCurrentPath.replace(/\/$/, '')
                  );
                  totalFilesUpdated += pathStats.updated;
                  totalFailed += pathStats.failed;
                  allErrors.push(...pathStats.errors);

                  
                  try {
                    const quarterlyStats = await utility.fixQuarterlyImagePaths(
                      currentPath.replace(/\/$/, '')
                    );
                    totalFilesUpdated += quarterlyStats.updated;
                    totalFailed += quarterlyStats.failed;
                    allErrors.push(...quarterlyStats.errors);
                  } catch (error) {
                    console.error('Failed to fix quarterly paths:', error);
                    allErrors.push(
                      `Quarterly fix: ${error instanceof Error ? error.message : String(error)}`
                    );
                  }

                  
                  if (allErrors.length > 0) {
                    new Notice(
                      t('settings.general.update-image-paths-errors', {
                        updated: String(totalFilesUpdated),
                        failed: String(totalFailed),
                      }),
                      8000
                    );
                    console.error('Image path update errors:', allErrors);
                  } else if (totalFilesUpdated > 0) {
                    new Notice(
                      t('settings.general.update-image-paths-success', {
                        count: String(totalFilesUpdated),
                      }),
                      5000
                    );
                  } else {
                    new Notice(
                      t('settings.general.update-image-paths-no-update'),
                      3000
                    );
                  }
                } catch (error) {
                  console.error('Failed to update image paths:', error);
                  new Notice(
                    t('settings.general.update-image-paths-failed'),
                    5000
                  );
                } finally {
                  setIsUpdatingImages(false);
                }
              })();
            }}
            disabled={isUpdatingImages || isSampleContext}
            className="journalit-settings-action-button"
          >
            {isUpdatingImages
              ? t('settings.general.update-image-paths-updating')
              : t('settings.general.update-image-paths')}
          </Button>
        </div>
      </div>
    </SettingsSection>
  );
}

export function HomeBackgroundControls({
  plugin,
}: {
  plugin: JournalitPlugin;
}) {
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasBackground = Boolean(plugin.settings.home?.backgroundImagePath);

  const persistPath = useCallback(
    async (nextPath: string) => {
      ensureHomeSettings(plugin.settings).backgroundImagePath =
        nextPath || undefined;
      await plugin.saveSettings();
      eventBus.publish('settings:changed', {
        section: 'home',
        source: 'background-image',
      });
    },
    [plugin]
  );

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      event.target.value = '';
      if (!file) return;

      if (!isSupportedHomeBackgroundFile(file)) {
        new Notice(t('settings.general.home-background-invalid-file'));
        return;
      }

      setIsSaving(true);
      try {
        const savedPath = await saveHomeBackgroundFile(plugin.app, file);
        await persistPath(savedPath);
        new Notice(t('settings.general.home-background-saved'));
      } catch (error) {
        console.error('Failed to import Home background image:', error);
        new Notice(t('settings.general.home-background-save-failed'));
      } finally {
        setIsSaving(false);
      }
    },
    [persistPath, plugin]
  );

  const clearPath = useCallback(async () => {
    setIsSaving(true);
    try {
      await persistPath('');
      new Notice(t('settings.general.home-background-cleared'));
    } catch (error) {
      console.error('Failed to clear Home background image:', error);
      new Notice(t('settings.general.home-background-save-failed'));
    } finally {
      setIsSaving(false);
    }
  }, [persistPath]);

  return (
    <div className="journalit-home-background-controls">
      <Button
        onClick={() => fileInputRef.current?.click()}
        variant="primary"
        size="small"
        loading={isSaving}
        disabled={isSaving}
      >
        {t('settings.general.home-background-choose')}
      </Button>
      {hasBackground && (
        <Button
          onClick={() => void clearPath()}
          variant="plain"
          size="small"
          disabled={isSaving}
        >
          {t('settings.general.home-background-clear')}
        </Button>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(event) => void handleFileChange(event)}
        className="journalit-home-background-file-input"
        aria-hidden="true"
        tabIndex={-1}
      />
    </div>
  );
}

export function NavigationSidebarOpenControl({
  plugin,
}: {
  plugin: JournalitPlugin;
}) {
  const handleOpen = async () => {
    try {
      await plugin.openNavigationSidebar();
      plugin.app.setting?.close();
    } catch (error) {
      console.error(
        '[Journalit] Failed to open navigation sidebar from settings:',
        error
      );
      new Notice(t('notice.error.open-navigation-sidebar'));
    }
  };

  return (
    <Button variant="primary" size="small" onClick={handleOpen}>
      {t('navigation.setting.open.button')}
    </Button>
  );
}

export function CalendarSidebarOpenControl({
  plugin,
}: {
  plugin: JournalitPlugin;
}) {
  const handleOpen = async () => {
    try {
      await plugin.openCalendarSidebar();
      plugin.app.setting?.close();
    } catch (error) {
      console.error(
        '[Journalit] Failed to open calendar sidebar from settings:',
        error
      );
      new Notice(t('notice.error.open-calendar-sidebar'));
    }
  };

  return (
    <Button variant="primary" size="small" onClick={handleOpen}>
      {t('calendar.setting.open.button')}
    </Button>
  );
}

export function AdvancedSettings({ plugin }: { plugin: JournalitPlugin }) {
  const model = useAdvancedSettingsModel({ plugin });
  return (
    <div className="journalit-settings-tab general-settings">
      <GeneralFolderSettingsSection {...model} />
      <GeneralDataManagementSection {...model} />
    </div>
  );
}
