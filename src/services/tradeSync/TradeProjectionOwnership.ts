import type JournalitPlugin from '../../main';
import { ApiClient } from '../backend/ApiClient';

export function getTradeProjectionOwnerId(plugin: JournalitPlugin): string {
  return (
    plugin.settings.backendIntegration?.authenticatedAccountId?.trim() ?? ''
  );
}

export function createTradeProjectionOwnershipGuard(
  plugin: JournalitPlugin,
  ownerUserId = getTradeProjectionOwnerId(plugin)
): () => boolean {
  const hasOwnerToken = ApiClient.getAuthToken() !== null;
  const ownerAuthSessionVersion = ApiClient.getAuthSessionVersion();
  return () =>
    !ownerUserId ||
    !hasOwnerToken ||
    getTradeProjectionOwnerId(plugin) !== ownerUserId ||
    ApiClient.getAuthSessionVersion() !== ownerAuthSessionVersion;
}
