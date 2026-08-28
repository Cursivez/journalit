import { normalizePath, TFile } from 'obsidian';
import type JournalitPlugin from '../../main';
import {
  forceMetadataCacheRefresh,
  readFrontmatterFromDisk,
} from '../../utils/dataRefresh';
import type { ImageGalleryAnnotation } from '../../components/imageGallery/types';
import { isRecord, normalizeImagePath } from './ImageGalleryInternal';
import type { AnnotationNoteSignature } from './ImageGalleryInternal';
import { isEmptyPersistedAnnotation } from './ImageGalleryAnnotations';
import { serializeImageAnnotation } from '../../utils/imageAnnotations';
import { refreshMetadataWithRecovery } from './ImageGalleryMetadataRefresh';

const ownedAnnotationWriteCounts = new Map<string, number>();
const ownedAnnotationWriteQueues = new WeakMap<object, Promise<void>>();
const relocatedAnnotationNotePaths = new WeakMap<object, string>();

function hasAnnotationEntry(
  annotations: unknown,
  path: string,
  isFolder: boolean
): boolean {
  if (!isRecord(annotations)) return false;
  const normalizedPath = normalizeImagePath(path);
  if (!isFolder) return normalizedPath in annotations;
  const prefix = `${normalizedPath}/`;
  return Object.keys(annotations).some(
    (annotationPath) =>
      annotationPath === normalizedPath || annotationPath.startsWith(prefix)
  );
}


export function isOwnedAnnotationWriteActive(path: string): boolean {
  return (ownedAnnotationWriteCounts.get(normalizePath(path)) ?? 0) > 0;
}

export class ImageGalleryAnnotationStore {
  constructor(private plugin: JournalitPlugin) {}

  getNotePath(): string {
    const canonicalPath = this.getCanonicalNotePath();
    const queueOwner = this.plugin.app.vault;
    const relocatedPath = relocatedAnnotationNotePaths.get(queueOwner);
    if (!relocatedPath) return canonicalPath;
    if (relocatedPath === canonicalPath) {
      relocatedAnnotationNotePaths.delete(queueOwner);
      return canonicalPath;
    }
    const relocatedNote =
      this.plugin.app.vault.getAbstractFileByPath(relocatedPath);
    if (relocatedNote instanceof TFile) return relocatedPath;
    relocatedAnnotationNotePaths.delete(queueOwner);
    return canonicalPath;
  }

  trackRelocatedNotePath(path: string): void {
    relocatedAnnotationNotePaths.set(
      this.plugin.app.vault,
      normalizePath(path)
    );
  }

  private getCanonicalNotePath(): string {
    const journalFolder =
      this.plugin.serviceManager?.getFolderPathService()?.journalFolderPath ||
      this.plugin.settings.general?.journalFolderPath ||
      '!Journalit';
    return normalizePath(`${journalFolder}/Gallery Media Annotations.md`);
  }

  getAnnotationMap(): unknown {
    const file = this.plugin.app.vault.getAbstractFileByPath(
      this.getNotePath()
    );
    if (!(file instanceof TFile)) return undefined;
    return this.plugin.app.metadataCache.getFileCache(file)?.frontmatter
      ?.imageAnnotations;
  }

  getNoteSignature(): AnnotationNoteSignature {
    const file = this.plugin.app.vault.getAbstractFileByPath(
      this.getNotePath()
    );
    return file instanceof TFile
      ? { exists: true, mtime: file.stat.mtime, size: file.stat.size }
      : { exists: false, mtime: null, size: null };
  }

  async runOwnedWrite<T>(operation: () => Promise<T>): Promise<T> {
    const queueOwner = this.plugin.app.vault;
    const previousWrite = ownedAnnotationWriteQueues.get(queueOwner);
    const write = (previousWrite ?? Promise.resolve()).then(async () => {
      const path = normalizePath(this.getNotePath());
      ownedAnnotationWriteCounts.set(
        path,
        (ownedAnnotationWriteCounts.get(path) ?? 0) + 1
      );
      try {
        return await operation();
      } finally {
        const remaining = (ownedAnnotationWriteCounts.get(path) ?? 1) - 1;
        if (remaining > 0) {
          ownedAnnotationWriteCounts.set(path, remaining);
        } else {
          ownedAnnotationWriteCounts.delete(path);
        }
      }
    });
    const queueTail = write.then(
      () => undefined,
      () => undefined
    );
    ownedAnnotationWriteQueues.set(queueOwner, queueTail);
    void queueTail.then(() => {
      if (ownedAnnotationWriteQueues.get(queueOwner) === queueTail) {
        ownedAnnotationWriteQueues.delete(queueOwner);
      }
    });
    return write;
  }

  hasEntryFor(path: string, isFolder: boolean): boolean {
    return hasAnnotationEntry(this.getAnnotationMap(), path, isFolder);
  }

  async hasEntryForAuthoritatively(
    path: string,
    isFolder: boolean,
    notePath: string = this.getNotePath()
  ): Promise<boolean> {
    const note = this.plugin.app.vault.getAbstractFileByPath(notePath);
    if (!(note instanceof TFile)) return false;
    const frontmatter = await readFrontmatterFromDisk(this.plugin.app, note);
    return hasAnnotationEntry(frontmatter.imageAnnotations, path, isFolder);
  }

  async refreshMetadataIfPresent(
    notePath: string = this.getNotePath()
  ): Promise<void> {
    const file = this.plugin.app.vault.getAbstractFileByPath(notePath);
    if (file instanceof TFile) {
      await forceMetadataCacheRefresh(this.plugin.app, file);
    }
  }

  async update(
    imagePath: string,
    annotation: ImageGalleryAnnotation,
    publishRecovery: () => void
  ): Promise<void> {
    const note = await this.ensureNote();
    const normalizedImagePath = normalizeImagePath(imagePath);
    const persistedAnnotation = serializeImageAnnotation(annotation);
    await this.plugin.app.fileManager.processFrontMatter(
      note,
      (frontmatter) => {
        const record = isRecord(frontmatter) ? frontmatter : {};
        const currentAnnotations = isRecord(record.imageAnnotations)
          ? { ...record.imageAnnotations }
          : {};
        if (isEmptyPersistedAnnotation(persistedAnnotation)) {
          delete currentAnnotations[normalizedImagePath];
        } else {
          currentAnnotations[normalizedImagePath] = persistedAnnotation;
        }
        if (Object.keys(currentAnnotations).length > 0) {
          record.imageAnnotations = currentAnnotations;
        } else {
          delete record.imageAnnotations;
        }
      }
    );
    await refreshMetadataWithRecovery(this.plugin.app, note, publishRecovery);
  }

  async rekey(
    oldPath: string,
    newPath: string,
    isFolder: boolean,
    publishRecovery: () => void,
    notePath: string = this.getNotePath()
  ): Promise<void> {
    const note = this.plugin.app.vault.getAbstractFileByPath(notePath);
    if (!(note instanceof TFile)) return;
    let changed = false;
    await this.plugin.app.fileManager.processFrontMatter(
      note,
      (frontmatter) => {
        const record = isRecord(frontmatter) ? frontmatter : {};
        if (!isRecord(record.imageAnnotations)) return;
        const annotations = { ...record.imageAnnotations };
        const normalizedOldPath = normalizeImagePath(oldPath);
        const normalizedNewPath = normalizeImagePath(newPath);
        const oldPrefix = `${normalizedOldPath}/`;
        for (const annotationPath of Object.keys(annotations)) {
          const matches = isFolder
            ? annotationPath === normalizedOldPath ||
              annotationPath.startsWith(oldPrefix)
            : annotationPath === normalizedOldPath;
          if (!matches) continue;
          const suffix = annotationPath.slice(normalizedOldPath.length);
          const annotationValue = annotations[annotationPath];
          delete annotations[annotationPath];
          annotations[`${normalizedNewPath}${suffix}`] = annotationValue;
          changed = true;
        }
        if (changed) record.imageAnnotations = annotations;
      }
    );
    if (changed) {
      await refreshMetadataWithRecovery(this.plugin.app, note, publishRecovery);
    }
  }

  private async ensureNote(): Promise<TFile> {
    const notePath = this.getNotePath();
    const existing = this.plugin.app.vault.getAbstractFileByPath(notePath);
    if (existing instanceof TFile) return existing;
    const folderPath = notePath.split('/').slice(0, -1).join('/');
    if (!this.plugin.app.vault.getAbstractFileByPath(folderPath)) {
      await this.plugin.app.vault.createFolder(folderPath);
    }
    return this.plugin.app.vault.create(notePath, '---\n---\n');
  }
}
