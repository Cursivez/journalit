import { normalizePath, TFile, TFolder, type TAbstractFile } from 'obsidian';
import type JournalitPlugin from '../../main';
import { forceMetadataCacheRefresh } from '../../utils/dataRefresh';
import { getMediaKind } from '../../utils/imageMediaUtils';
import { eventBus } from '../events/EventBus';
import {
  ImageGalleryAnnotationStore,
  isOwnedAnnotationWriteActive,
} from './ImageGalleryAnnotationStore';
import { ImageGalleryFolderSource } from './ImageGalleryFolderSource';
import { clearPersistedImageGalleryIndex } from './ImageGalleryIndexStorage';

export class ImageGalleryVaultWatcher {
  private annotations: ImageGalleryAnnotationStore;
  private folders: ImageGalleryFolderSource;
  private pendingMetadataRefreshPaths = new Set<string>();
  private registrationInitialized = false;
  private registered = false;
  
  private renameQueue: Promise<void> = Promise.resolve();

  constructor(private plugin: JournalitPlugin) {
    this.annotations = new ImageGalleryAnnotationStore(plugin);
    this.folders = new ImageGalleryFolderSource(plugin, this.annotations);
  }

  register(): void {
    if (!this.registrationInitialized) {
      this.registrationInitialized = true;
      const unsubscribe = eventBus.subscribe('settings:changed', () =>
        this.activateIfNeeded()
      );
      this.plugin.register(unsubscribe);
    }
    this.activateIfNeeded();
  }

  private activateIfNeeded(): void {
    if (this.registered) return;
    const annotationNote = this.plugin.app.vault.getAbstractFileByPath(
      this.annotations.getNotePath()
    );
    if (
      this.folders.getConfiguredRoots().length === 0 &&
      !(annotationNote instanceof TFile)
    ) {
      return;
    }
    this.registered = true;
    this.plugin.registerEvent(
      this.plugin.app.vault.on('create', async (file) =>
        this.handleChange(file)
      )
    );
    this.plugin.registerEvent(
      this.plugin.app.vault.on('modify', async (file) =>
        this.handleChange(file)
      )
    );
    this.plugin.registerEvent(
      this.plugin.app.vault.on('delete', async (file) =>
        this.handleDelete(file)
      )
    );
    this.plugin.registerEvent(
      this.plugin.app.vault.on('rename', async (file, oldPath) =>
        this.enqueueRename(file, oldPath)
      )
    );
    this.plugin.registerEvent(
      this.plugin.app.metadataCache.on('changed', async (file) =>
        this.handleMetadataChanged(file)
      )
    );
  }

  private enqueueRename(file: TAbstractFile, oldPath: string): Promise<void> {
    const rename = this.renameQueue.then(() =>
      this.handleRename(file, oldPath)
    );
    this.renameQueue = rename.catch(() => undefined);
    return rename;
  }

  private async handleChange(file: TAbstractFile): Promise<void> {
    const annotationPath = this.annotations.getNotePath();
    if (file.path === annotationPath) {
      if (isOwnedAnnotationWriteActive(annotationPath)) return;
      await clearPersistedImageGalleryIndex(this.plugin.app);
      try {
        await this.withMetadataRefresh(annotationPath, () =>
          this.annotations.refreshMetadataIfPresent()
        );
      } catch (error) {
        console.error(
          '[ImageGalleryVaultWatcher] Failed to handle change:',
          error
        );
      } finally {
        this.publishChanged();
      }
      return;
    }
    if (!this.folders.isConfiguredPath(file.path)) return;
    const isMarkdown = file instanceof TFile && file.extension === 'md';
    if (!isMarkdown && getMediaKind(this.plugin.app, file.path) === 'unknown') {
      return;
    }
    try {
      if (isMarkdown) {
        await this.withMetadataRefresh(file.path, () =>
          forceMetadataCacheRefresh(this.plugin.app, file)
        );
      }
    } catch (error) {
      console.error(
        '[ImageGalleryVaultWatcher] Failed to handle change:',
        error
      );
    } finally {
      this.publishChanged();
    }
  }

  private async handleDelete(file: TAbstractFile): Promise<void> {
    const annotationPath = this.annotations.getNotePath();
    if (
      file.path === annotationPath ||
      annotationPath.startsWith(`${file.path}/`)
    ) {
      await clearPersistedImageGalleryIndex(this.plugin.app);
      this.publishChanged();
      return;
    }
    if (
      !this.folders.isConfiguredPath(file.path) &&
      !this.folders.isAncestorOfConfiguredRoot(file.path)
    ) {
      return;
    }
    this.publishChanged();
  }

  private async handleRename(
    file: TAbstractFile,
    oldPath: string
  ): Promise<void> {
    const annotationPath = this.annotations.getNotePath();
    const annotationNoteChanged =
      oldPath === annotationPath ||
      file.path === annotationPath ||
      (file instanceof TFolder &&
        (annotationPath.startsWith(`${oldPath}/`) ||
          annotationPath.startsWith(`${file.path}/`)));
    const renamedAnnotationNoteFile =
      file instanceof TFile &&
      (oldPath === annotationPath || file.path === annotationPath);
    const relocatedAnnotationPath = renamedAnnotationNoteFile
      ? file.path
      : file instanceof TFolder && annotationPath.startsWith(`${oldPath}/`)
        ? normalizePath(`${file.path}${annotationPath.slice(oldPath.length)}`)
        : annotationPath;
    if (
      annotationNoteChanged &&
      !renamedAnnotationNoteFile &&
      relocatedAnnotationPath !== annotationPath
    ) {
      this.annotations.trackRelocatedNotePath(relocatedAnnotationPath);
    }

    await this.annotations.runOwnedWrite(async () => {
      const oldConfigured = this.folders.isConfiguredPath(oldPath);
      const newConfigured = this.folders.isConfiguredPath(file.path);
      const newConfiguredAncestor =
        file instanceof TFolder &&
        this.folders.isAncestorOfConfiguredRoot(file.path);
      const renamedSettings =
        file instanceof TFolder
          ? this.folders.getRenamedSettings(oldPath, file.path)
          : null;
      let hasAnnotationEntry = this.annotations.hasEntryFor(
        oldPath,
        file instanceof TFolder
      );
      if (
        !annotationNoteChanged &&
        !oldConfigured &&
        !newConfigured &&
        !newConfiguredAncestor &&
        !renamedSettings &&
        !hasAnnotationEntry
      ) {
        try {
          hasAnnotationEntry =
            await this.annotations.hasEntryForAuthoritatively(
              oldPath,
              file instanceof TFolder,
              relocatedAnnotationPath
            );
        } catch (error) {
          console.error(
            '[ImageGalleryVaultWatcher] Failed to read annotations before rename:',
            error
          );
          hasAnnotationEntry = true;
        }
        if (!hasAnnotationEntry) return;
      }

      if (annotationNoteChanged) {
        await clearPersistedImageGalleryIndex(this.plugin.app);
      }
      if (renamedSettings) {
        this.plugin.settings.trade.galleryFolders = renamedSettings;
        try {
          await this.plugin.saveSettings();
        } catch (error) {
          console.error(
            '[ImageGalleryVaultWatcher] Failed to handle rename:',
            error
          );
        }
        eventBus.publish('settings:changed', {
          section: 'trade',
          source: 'gallery-folders-service',
        });
      }

      let annotationRefreshPath = relocatedAnnotationPath;
      try {
        if (renamedAnnotationNoteFile && file.path !== annotationPath) {
          await this.plugin.app.fileManager.renameFile(file, annotationPath);
          annotationRefreshPath = annotationPath;
        } else if (!renamedAnnotationNoteFile) {
          await this.annotations.rekey(
            oldPath,
            file.path,
            file instanceof TFolder,
            () => this.publishChanged(),
            relocatedAnnotationPath
          );
        }
        if (annotationNoteChanged) {
          await this.withMetadataRefresh(annotationRefreshPath, () =>
            this.annotations.refreshMetadataIfPresent(annotationRefreshPath)
          );
        } else if (
          newConfigured &&
          file instanceof TFile &&
          file.extension === 'md'
        ) {
          await this.withMetadataRefresh(file.path, () =>
            forceMetadataCacheRefresh(this.plugin.app, file)
          );
        }
      } catch (error) {
        console.error(
          '[ImageGalleryVaultWatcher] Failed to handle rename:',
          error
        );
      } finally {
        this.publishChanged();
      }
    });
  }

  private async handleMetadataChanged(file: TFile): Promise<void> {
    if (this.pendingMetadataRefreshPaths.has(file.path)) return;
    if (file.path === this.annotations.getNotePath()) {
      if (isOwnedAnnotationWriteActive(file.path)) return;
      await clearPersistedImageGalleryIndex(this.plugin.app);
      this.publishChanged();
      return;
    }
    if (file.extension !== 'md' || !this.folders.isConfiguredPath(file.path)) {
      return;
    }
    this.publishChanged();
  }

  private async withMetadataRefresh(
    path: string,
    refresh: () => Promise<void>
  ): Promise<void> {
    this.pendingMetadataRefreshPaths.add(path);
    try {
      await refresh();
    } finally {
      this.pendingMetadataRefreshPaths.delete(path);
    }
  }

  private publishChanged(): void {
    eventBus.publish('image-gallery:changed');
  }
}
