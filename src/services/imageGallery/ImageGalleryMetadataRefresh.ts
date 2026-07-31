import type { App, TFile } from 'obsidian';
import { forceMetadataCacheRefresh } from '../../utils/dataRefresh';

const METADATA_REFRESH_RETRY_DELAY_MS = 500;

export async function refreshMetadataWithRecovery(
  app: App,
  file: TFile,
  publishRecovery: () => void
): Promise<void> {
  try {
    await forceMetadataCacheRefresh(app, file);
  } catch (error) {
    console.error(
      '[ImageGallery] Annotation metadata refresh failed after write:',
      error
    );
    window.setTimeout(() => {
      void (async () => {
        try {
          await forceMetadataCacheRefresh(app, file);
        } catch (retryError) {
          console.error(
            '[ImageGallery] Annotation metadata recovery refresh failed:',
            retryError
          );
        } finally {
          publishRecovery();
        }
      })();
    }, METADATA_REFRESH_RETRY_DELAY_MS);
  }
}
