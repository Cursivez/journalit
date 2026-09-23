import type JournalitPlugin from '../../main';

export function shouldAnnounceSyncCompletion(plugin: JournalitPlugin): boolean {
  return plugin.settings.backendIntegration?.showSyncNotifications ?? true;
}
