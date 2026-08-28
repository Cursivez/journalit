

import type JournalitPlugin from '../../main';
import { generateUUID } from '../../utils/uuid';
import { getTradeProjectionOwnerId } from './TradeProjectionOwnership';
import type {
  BrokerClientOperationContext,
  BrokerSyncProviderId,
} from './types';

const DEVICE_STORAGE_KEY = 'journalit.tradovateClientDeviceId';
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function brokerClientDeviceIdentifier(plugin: JournalitPlugin): string {
  try {
    const stored: unknown = plugin.app.loadLocalStorage(DEVICE_STORAGE_KEY);
    if (typeof stored === 'string' && UUID_PATTERN.test(stored)) return stored;
    const created = generateUUID();
    plugin.app.saveLocalStorage(DEVICE_STORAGE_KEY, created);
    return created;
  } catch {
    return generateUUID();
  }
}

export function createBrokerConnectionOperation(
  plugin: JournalitPlugin,
  vaultId: string,
  connectionId: string,
  provider: BrokerSyncProviderId
): BrokerClientOperationContext {
  return {
    clientOperationId: generateUUID(),
    ownerUserId: getTradeProjectionOwnerId(plugin),
    provider,
    pluginVersion: plugin.manifest.version,
    vaultId,
    deviceId: brokerClientDeviceIdentifier(plugin),
    scope: 'connection',
    connectionId,
  };
}

export function createBrokerProjectionOperation(
  plugin: JournalitPlugin,
  vaultId: string,
  provider: BrokerSyncProviderId,
  syncRunId = generateUUID()
): BrokerClientOperationContext {
  return {
    clientOperationId: generateUUID(),
    ownerUserId: getTradeProjectionOwnerId(plugin),
    provider,
    pluginVersion: plugin.manifest.version,
    vaultId,
    deviceId: brokerClientDeviceIdentifier(plugin),
    scope: 'projection',
    syncRunId,
  };
}
