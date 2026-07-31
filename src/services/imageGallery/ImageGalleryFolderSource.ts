import { normalizePath } from 'obsidian';
import type JournalitPlugin from '../../main';
import type { ImageGalleryItem } from '../../components/imageGallery/types';
import { getMediaKind } from '../../utils/imageMediaUtils';
import { getAnnotation } from './ImageGalleryInternal';
import type { ImageGalleryAnnotationStore } from './ImageGalleryAnnotationStore';

export class ImageGalleryFolderSource {
  constructor(
    private plugin: JournalitPlugin,
    private annotations: ImageGalleryAnnotationStore
  ) {}

  getConfiguredRoots(): string[] {
    const uniquePaths = new Set<string>();
    for (const configuredPath of this.plugin.settings.trade.galleryFolders ??
      []) {
      const normalizedPath = normalizePath(configuredPath.trim());
      if (normalizedPath) uniquePaths.add(normalizedPath);
    }
    return Array.from(uniquePaths).sort(
      (a, b) => a.length - b.length || a.localeCompare(b)
    );
  }

  createPathMatcher(roots: readonly string[]): (path: string) => boolean {
    return (path) =>
      roots.some((folderPath) => this.isWithin(path, folderPath));
  }

  isConfiguredPath(path: string): boolean {
    return this.createPathMatcher(this.getConfiguredRoots())(path);
  }

  isAncestorOfConfiguredRoot(path: string): boolean {
    const normalizedPath = normalizePath(path);
    if (!normalizedPath) return false;
    const prefix = `${normalizedPath}/`;
    return this.getConfiguredRoots().some(
      (root) => root === normalizedPath || root.startsWith(prefix)
    );
  }

  getCurrentMediaPaths(
    roots: readonly string[] = this.getConfiguredRoots()
  ): Set<string> | null {
    const paths = new Set<string>();
    if (roots.length === 0) return paths;
    const matchesConfiguredPath = this.createPathMatcher(roots);
    for (const file of this.plugin.app.vault.getFiles()) {
      if (!matchesConfiguredPath(file.path)) continue;
      if (
        file.extension === 'md' &&
        !this.plugin.app.metadataCache.getFileCache(file)
      ) {
        return null;
      }
      if (getMediaKind(this.plugin.app, file.path) !== 'unknown') {
        paths.add(file.path);
      }
    }
    return paths;
  }

  getItems(): ImageGalleryItem[] {
    const configuredRoots = this.getConfiguredRoots();
    if (configuredRoots.length === 0) return [];
    const annotationMap = this.annotations.getAnnotationMap();
    const items: ImageGalleryItem[] = [];
    const configuredFolders = new Set(configuredRoots);
    for (const file of this.plugin.app.vault.getFiles()) {
      const folderPath = this.findConfiguredAncestor(
        file.path,
        configuredFolders
      );
      if (
        !folderPath ||
        getMediaKind(this.plugin.app, file.path) === 'unknown'
      ) {
        continue;
      }
      const annotation = getAnnotation(annotationMap, file.path);
      const pathSegments = file.path.split('/');
      const parentFolderName =
        pathSegments.length >= 2
          ? pathSegments[pathSegments.length - 2]
          : (folderPath.split('/').pop() ?? folderPath);
      items.push({
        id: `folder:${file.path}`,
        imagePath: file.path,
        sourcePath: file.path,
        sourceType: 'folder',
        sourceLabel: parentFolderName,
        folderPath,
        date: new Date(file.stat.mtime).toISOString(),
        mediaMtime: file.stat.mtime,
        setupIds: [],
        sourceTags: [],
        mistakes: [],
        tags: annotation.tags,
        notes: annotation.notes,
        sourceCustomFields: {},
        outcome: 'unknown',
      });
    }
    return items;
  }

  getRenamedSettings(oldPath: string, newPath: string): string[] | null {
    const normalizedOldPath = normalizePath(oldPath);
    const normalizedNewPath = normalizePath(newPath);
    const oldPrefix = `${normalizedOldPath}/`;
    const renamed: string[] = [];
    const seen = new Set<string>();
    let changed = false;
    for (const configuredPath of this.plugin.settings.trade.galleryFolders ??
      []) {
      const current = normalizePath(configuredPath.trim());
      const matches =
        current === normalizedOldPath || current.startsWith(oldPrefix);
      const next = matches
        ? `${normalizedNewPath}${current.slice(normalizedOldPath.length)}`
        : current;
      if (matches) changed = true;
      if (!next || seen.has(next)) continue;
      seen.add(next);
      renamed.push(next);
    }
    return changed ? renamed : null;
  }

  private isWithin(path: string, folderPath: string): boolean {
    return path === folderPath || path.startsWith(`${folderPath}/`);
  }

  private findConfiguredAncestor(
    filePath: string,
    configuredFolders: ReadonlySet<string>
  ): string | null {
    const segments = filePath.split('/');
    segments.pop();
    while (segments.length > 0) {
      const candidate = segments.join('/');
      if (configuredFolders.has(candidate)) return candidate;
      segments.pop();
    }
    return null;
  }
}
