

import { ApiClient } from '../backend/ApiClient';
import { ApiError } from '../../types/errors';
import {
  authHeaders,
  handleTradeSyncHttpError,
  requestTradeSyncWithAuthRetry,
  tradeSyncApiErrorCode,
} from '../tradeSync/http';

export interface TradeImportHistoryEntry {
  importId: string;
  broker: string;
  accountId: string;
  accountDisplayName: string;
  fileType: string;
  committedAt: string;
  createdCount: number;
  updatedCount: number;
  skippedCount: number;
  failedCount: number;
  
  liveTradeCount: number;
}

interface TradeImportHistoryPage {
  imports: TradeImportHistoryEntry[];
  nextCursor: string | null;
}

export interface TradeImportDeletionResult {
  deletedTradeIds: string[];
  
  keptTradeCount: number;
}

export interface ServerDeletedTrade {
  cursor: number;
  tradeId: string;
}

export interface ServerDeletedTradesPage {
  trades: ServerDeletedTrade[];
  nextCursor: number;
  hasMore: boolean;
}


type TradeImportAccountDeletionBlock = 'broker_connected' | 'broker_history';

export class TradeImportAccountDeletionBlockedError extends Error {
  constructor(readonly reason: TradeImportAccountDeletionBlock) {
    super(`Trade Import account deletion blocked: ${reason}`);
    this.name = 'TradeImportAccountDeletionBlockedError';
  }
}

const OPERATION = 'Trade Import';

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? Object.fromEntries(Object.entries(value))
    : null;
}

function requiredString(record: Record<string, unknown>, key: string): string {
  const value = record[key];
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`Invalid Trade Import ${key} response`);
  }
  return value;
}

function requiredCount(record: Record<string, unknown>, key: string): number {
  const value = record[key];
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 0) {
    throw new Error(`Invalid Trade Import ${key} response`);
  }
  return value;
}

function requiredArray(
  record: Record<string, unknown>,
  key: string
): unknown[] {
  const value = record[key];
  if (!Array.isArray(value)) {
    throw new Error(`Invalid Trade Import ${key} response`);
  }
  return value;
}

function responseRecord(value: unknown): Record<string, unknown> {
  const record = asRecord(value);
  if (!record) throw new Error('Invalid Trade Import response');
  return record;
}

export function decodeTradeImportHistoryPage(
  value: unknown
): TradeImportHistoryPage {
  const record = responseRecord(value);
  const imports = requiredArray(record, 'imports').map((entry) => {
    const item = responseRecord(entry);
    return {
      importId: requiredString(item, 'importId'),
      broker: requiredString(item, 'broker'),
      accountId: requiredString(item, 'accountId'),
      accountDisplayName:
        typeof item.accountDisplayName === 'string'
          ? item.accountDisplayName
          : '',
      fileType: requiredString(item, 'fileType'),
      committedAt: requiredString(item, 'committedAt'),
      createdCount: requiredCount(item, 'createdCount'),
      updatedCount: requiredCount(item, 'updatedCount'),
      skippedCount: requiredCount(item, 'skippedCount'),
      failedCount: requiredCount(item, 'failedCount'),
      liveTradeCount: requiredCount(item, 'liveTradeCount'),
    };
  });
  const nextCursor =
    typeof record.nextCursor === 'string' && record.nextCursor !== ''
      ? record.nextCursor
      : null;
  return { imports, nextCursor };
}

function decodeTradeImportDeletionResult(
  value: unknown
): TradeImportDeletionResult {
  const record = responseRecord(value);
  return {
    deletedTradeIds: requiredArray(record, 'deletedTradeIds').map((id) => {
      if (typeof id !== 'string' || id === '') {
        throw new Error('Invalid Trade Import deletedTradeIds response');
      }
      return id;
    }),
    keptTradeCount: requiredCount(record, 'keptTradeCount'),
  };
}

export function decodeServerDeletedTradesPage(
  value: unknown
): ServerDeletedTradesPage {
  const record = responseRecord(value);
  return {
    trades: requiredArray(record, 'trades').map((entry) => {
      const item = responseRecord(entry);
      return {
        cursor: requiredCount(item, 'cursor'),
        tradeId: requiredString(item, 'tradeId'),
      };
    }),
    nextCursor: requiredCount(record, 'nextCursor'),
    hasMore: record.hasMore === true,
  };
}

export class TradeImportManagementClient {
  async listImportHistory(
    before: string | null = null
  ): Promise<TradeImportHistoryPage> {
    const query = before ? `?before=${encodeURIComponent(before)}` : '';
    const { response, requestAuthToken } = await requestTradeSyncWithAuthRetry(
      (authToken) => ({
        url: ApiClient.buildUrl(`/api/v1/trade-import/imports${query}`),
        method: 'GET',
        headers: authHeaders(authToken),
        throw: false,
      })
    );
    if (response.status < 200 || response.status >= 300) {
      handleTradeSyncHttpError(response.status, requestAuthToken, OPERATION);
      throw new ApiError(
        `Trade Import history unavailable (${response.status})`,
        response.status
      );
    }
    return decodeTradeImportHistoryPage(response.json);
  }

  async deleteImport(importId: string): Promise<TradeImportDeletionResult> {
    const { response, requestAuthToken } = await requestTradeSyncWithAuthRetry(
      (authToken) => ({
        url: ApiClient.buildUrl(
          `/api/v1/trade-import/imports/${encodeURIComponent(importId)}`
        ),
        method: 'DELETE',
        headers: authHeaders(authToken),
        throw: false,
      })
    );
    if (response.status < 200 || response.status >= 300) {
      handleTradeSyncHttpError(response.status, requestAuthToken, OPERATION);
      throw new ApiError(
        `Trade Import deletion failed (${response.status})`,
        response.status
      );
    }
    return decodeTradeImportDeletionResult(response.json);
  }

  async deleteAccount(accountId: string): Promise<TradeImportDeletionResult> {
    const { response, requestAuthToken } = await requestTradeSyncWithAuthRetry(
      (authToken) => ({
        url: ApiClient.buildUrl(
          `/api/v1/trade-import/accounts/${encodeURIComponent(accountId)}`
        ),
        method: 'DELETE',
        headers: authHeaders(authToken),
        throw: false,
      })
    );
    if (response.status === 409) {
      const code = tradeSyncApiErrorCode(response.json);
      if (code === 'trade_import_account_broker_connected') {
        throw new TradeImportAccountDeletionBlockedError('broker_connected');
      }
      if (code === 'trade_import_account_broker_history') {
        throw new TradeImportAccountDeletionBlockedError('broker_history');
      }
    }
    if (response.status < 200 || response.status >= 300) {
      handleTradeSyncHttpError(response.status, requestAuthToken, OPERATION);
      throw new ApiError(
        `Trade Import account deletion failed (${response.status})`,
        response.status
      );
    }
    return decodeTradeImportDeletionResult(response.json);
  }

  async listDeletedTrades(after: number): Promise<ServerDeletedTradesPage> {
    const { response, requestAuthToken } = await requestTradeSyncWithAuthRetry(
      (authToken) => ({
        url: ApiClient.buildUrl(
          `/api/v1/trade-import/deleted-trades?after=${String(after)}`
        ),
        method: 'GET',
        headers: authHeaders(authToken),
        throw: false,
      })
    );
    if (response.status < 200 || response.status >= 300) {
      handleTradeSyncHttpError(
        response.status,
        requestAuthToken,
        OPERATION,
        false
      );
      throw new ApiError(
        `Deleted trades unavailable (${response.status})`,
        response.status
      );
    }
    return decodeServerDeletedTradesPage(response.json);
  }
}
