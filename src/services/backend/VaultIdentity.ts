import type JournalitPlugin from '../../main';
import { generateUUID } from '../../utils/uuid';

const VAULT_IDENTITY_UNAVAILABLE_ERROR = 'Vault identity is unavailable.';

const vaultIdentityWorkByPlugin = new WeakMap<
  JournalitPlugin,
  Promise<string>
>();

export async function getOrCreateVaultIdentifier(
  plugin: JournalitPlugin
): Promise<string> {
  const pending = vaultIdentityWorkByPlugin.get(plugin);
  if (pending) {
    return pending;
  }

  const backendSettings = plugin.settings.backendIntegration;
  if (!backendSettings) {
    throw new Error(VAULT_IDENTITY_UNAVAILABLE_ERROR);
  }

  const existing = backendSettings.vaultIdentifier;
  if (existing) {
    return existing;
  }

  const work = (async () => {
    const vaultIdentifier = `vault_${generateUUID()}`;
    backendSettings.vaultIdentifier = vaultIdentifier;
    try {
      await plugin.saveSettings();
      return vaultIdentifier;
    } catch (error) {
      if (backendSettings.vaultIdentifier === vaultIdentifier) {
        delete backendSettings.vaultIdentifier;
      }
      throw error;
    }
  })();

  vaultIdentityWorkByPlugin.set(plugin, work);
  try {
    return await work;
  } finally {
    if (vaultIdentityWorkByPlugin.get(plugin) === work) {
      vaultIdentityWorkByPlugin.delete(plugin);
    }
  }
}
