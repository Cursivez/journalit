import type { App } from 'obsidian';
import { getJournalitCachePath } from '../base/pluginStoragePaths';
import { isMissingFileError } from './ImageGalleryPersistence';

export function getImageGalleryIndexPath(app: App): string {
  return `${getJournalitCachePath(app)}/image-gallery-index.json`;
}

export async function clearPersistedImageGalleryIndex(app: App): Promise<void> {
  try {
    const indexPath = getImageGalleryIndexPath(app);
    if (await app.vault.adapter.exists(indexPath)) {
      await app.vault.adapter.remove(indexPath);
    }
  } catch (error) {
    if (isMissingFileError(error)) return;
    console.warn('[ImageGallery] Failed to clear persisted index:', error);
  }
}
