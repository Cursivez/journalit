

import { ApiClient } from '../../backend/ApiClient';

const USAGE_ENDPOINT = '/api/v1/mcp/usage';
const USAGE_KEYS = [
  'monthStart',
  'consumed',
  'reserved',
  'entitlementClass',
  'enforcement',
  'applicableLimit',
  'resetAt',
] as const;

export interface McpUsage {
  
  readonly consumed: number;
  readonly entitlementClass: 'free' | 'pro';
  
  readonly enforcement: boolean;
  
  readonly limit: number;
  readonly resetAt: Date;
}

function isCount(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;
}

function utcSecond(value: unknown): Date | null {
  if (
    typeof value !== 'string' ||
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(value)
  ) {
    return null;
  }
  const parsed = new Date(value);
  return Number.isFinite(parsed.getTime()) ? parsed : null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}


function parseMcpUsage(record: unknown): McpUsage | null {
  if (!isRecord(record)) return null;
  const keys = Object.keys(record);
  if (
    keys.length !== USAGE_KEYS.length ||
    !USAGE_KEYS.every((key) =>
      Object.prototype.hasOwnProperty.call(record, key)
    )
  ) {
    return null;
  }
  const resetAt = utcSecond(record.resetAt);
  if (
    resetAt === null ||
    utcSecond(record.monthStart) === null ||
    !isCount(record.consumed) ||
    !isCount(record.reserved) ||
    !isCount(record.applicableLimit) ||
    typeof record.enforcement !== 'boolean' ||
    (record.entitlementClass !== 'free' && record.entitlementClass !== 'pro')
  ) {
    return null;
  }
  return {
    consumed: record.consumed,
    entitlementClass: record.entitlementClass,
    enforcement: record.enforcement,
    limit: record.applicableLimit,
    resetAt,
  };
}


export async function fetchMcpUsage(): Promise<McpUsage | null> {
  if (!ApiClient.getAuthToken()) return null;
  ApiClient.invalidateCache(USAGE_ENDPOINT);
  try {
    const response = await ApiClient.makeRequest<unknown>(
      ApiClient.buildUrl(USAGE_ENDPOINT),
      { method: 'GET', headers: { 'x-endpoint': USAGE_ENDPOINT } },
      'MCP usage',
      0,
      {
        suppressPremiumRequiredEvent: true,
        propagateErrors: true,
        maxRetryAttempts: 0,
      }
    );
    return parseMcpUsage(response);
  } catch {
    return null;
  }
}
