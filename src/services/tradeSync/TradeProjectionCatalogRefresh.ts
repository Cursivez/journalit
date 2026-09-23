import type {
  TradeProjectionAccountInventoryResponse,
  TradeProjectionRequestOptions,
  TradovateConnection,
} from './types';

interface BrokerConnectionList {
  connections: TradovateConnection[];
}

interface TradeProjectionCatalog {
  connections: BrokerConnectionList;
  inventory: TradeProjectionAccountInventoryResponse;
}

interface CatalogBackend {
  getConnections(
    options?: TradeProjectionRequestOptions
  ): Promise<BrokerConnectionList>;
  getAccountInventory(
    vaultId: string,
    options?: TradeProjectionRequestOptions
  ): Promise<TradeProjectionAccountInventoryResponse>;
}

interface TradeProjectionCatalogRefreshIdentity {
  ownerUserId: string;
  authSessionVersion: number;
  freshnessGeneration: number;
}

let backendIds = new WeakMap<object, number>();
let nextBackendId = 1;
const inFlight = new Map<string, Promise<TradeProjectionCatalog>>();

function catalogRefreshKey(
  backend: CatalogBackend,
  vaultId: string,
  options: TradeProjectionRequestOptions | undefined,
  identity: TradeProjectionCatalogRefreshIdentity
): string {
  let backendId = backendIds.get(backend);
  if (backendId === undefined) {
    backendId = nextBackendId++;
    backendIds.set(backend, backendId);
  }
  return JSON.stringify([
    backendId,
    vaultId,
    identity.ownerUserId,
    identity.authSessionVersion,
    options?.interactiveEntitlement !== false,
    identity.freshnessGeneration,
  ]);
}

export function refreshTradeProjectionCatalog(
  backend: CatalogBackend,
  vaultId: string,
  options: TradeProjectionRequestOptions | undefined,
  identity: TradeProjectionCatalogRefreshIdentity
): Promise<TradeProjectionCatalog> {
  const key = catalogRefreshKey(backend, vaultId, options, identity);
  const existing = inFlight.get(key);
  if (existing) return existing;

  const pending = Promise.all([
    backend.getConnections(options),
    backend.getAccountInventory(vaultId, options),
  ]).then(([connections, inventory]) => ({ connections, inventory }));

  const tracked = pending.finally(() => {
    if (inFlight.get(key) === tracked) {
      inFlight.delete(key);
    }
  });
  inFlight.set(key, tracked);
  return tracked;
}

export function resetTradeProjectionCatalogRefreshForTests(): void {
  inFlight.clear();
  backendIds = new WeakMap<object, number>();
  nextBackendId = 1;
}
