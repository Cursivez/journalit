import type JournalitPlugin from '../../main';
import { BackendSecretStorage } from './BackendSecretStorage';


export async function clearPersistedBackendAuthSession(
  plugin: JournalitPlugin,
  requestAuthToken: string | null
): Promise<boolean> {
  const backend = plugin.settings.backendIntegration;
  if (!backend || !requestAuthToken) {
    return false;
  }

  if (BackendSecretStorage.getAuthToken(plugin) !== requestAuthToken) {
    return false;
  }

  BackendSecretStorage.clearAuthToken(plugin);
  backend.userEmail = undefined;
  backend.subscriptionTier = undefined;
  backend.userId = '';
  await plugin.saveSettings();
  window.dispatchEvent(new CustomEvent('journalit:subscription-changed'));

  return true;
}
