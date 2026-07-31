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
  const ownerToken = ApiClient.getAuthToken();
  return () =>
    !ownerUserId ||
    !ownerToken ||
    getTradeProjectionOwnerId(plugin) !== ownerUserId ||
    ApiClient.getAuthToken() !== ownerToken;
}
