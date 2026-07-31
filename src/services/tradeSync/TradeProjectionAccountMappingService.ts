import { BackendTradeProjectionService } from './BackendTradeProjectionService';
import type {
  TradeProjectionAccountVaultMappingRequest,
  TradeProjectionRequestOptions,
} from './types';

export class TradeProjectionAccountMappingService {
  constructor(private readonly backend = new BackendTradeProjectionService()) {}

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
