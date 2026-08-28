import { TradeProjectionClient } from './TradeProjectionClient';
import type {
  TradeProjectionAccountVaultMappingRequest,
  TradeProjectionRequestOptions,
} from './types';

export class TradeProjectionAccountMappingService {
  constructor(private readonly backend = new TradeProjectionClient()) {}

  getInventory(vaultId: string, options?: TradeProjectionRequestOptions) {
    return this.backend.getAccountInventory(vaultId, options);
  }

  update(
    accountId: string,
    request: TradeProjectionAccountVaultMappingRequest
  ) {
    return this.backend.updateAccountVaultMapping(accountId, request);
  }
}
