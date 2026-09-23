import type JournalitPlugin from '../main';

interface CanonicalReviewNavigationOptions<Service> {
  plugin: Pick<JournalitPlugin, 'app'>;
  autoCreate: boolean | undefined;
  getService: () => Promise<Service>;
  getPath: (service: Service) => string | Promise<string>;
  open: (service: Service) => Promise<void>;
}


export async function openCanonicalReviewIfAllowed<Service>({
  plugin,
  autoCreate,
  getService,
  getPath,
  open,
}: CanonicalReviewNavigationOptions<Service>): Promise<boolean> {
  try {
    const service = await getService();
    const path = await getPath(service);
    const exists = plugin.app.vault.getAbstractFileByPath(path) !== null;
    if (!exists && !(autoCreate ?? true)) return false;

    await open(service);
    return true;
  } catch (error) {
    console.error('[Journalit] Failed to open canonical review:', error);
    return false;
  }
}
