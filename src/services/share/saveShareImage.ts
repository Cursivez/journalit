import { type App, Notice, Platform } from 'obsidian';
import { t } from '../../lang/helpers';


export async function saveShareImage(
  app: App,
  doc: Document,
  png: Blob
): Promise<void> {
  const filename = `journalit-share-${new Date().toISOString().replace(/[:.]/g, '-')}-${crypto.randomUUID().slice(0, 8)}.png`;
  if (Platform.isMobileApp) {
    await app.vault.createBinary(filename, await png.arrayBuffer());
    new Notice(t('share.saved-to-vault', { filename }));
    return;
  }

  const anchor = doc.body.createEl('a');
  const url = URL.createObjectURL(png);
  anchor.href = url;
  anchor.download = filename;
  try {
    anchor.click();
  } finally {
    anchor.remove();
    
    
    
    
    window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
  }
}
