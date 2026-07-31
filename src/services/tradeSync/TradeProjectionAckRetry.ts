export type AckQueueBlockReason = 'authentication' | 'entitlement';

export type RetryableAckFailure =
  | { kind: 'scheduled'; retryAfterMs: number }
  | { kind: 'event'; blockedBy: AckQueueBlockReason };

const DEFAULT_RETRY_DELAY_MS = 30_000;

function errorStatusCode(error: unknown): number | undefined {
  return typeof error === 'object' &&
    error !== null &&
    'statusCode' in error &&
    typeof error.statusCode === 'number'
    ? error.statusCode
    : undefined;
}

function responseHeader(headers: unknown, name: string): string | undefined {
  if (typeof headers !== 'object' || !headers || Array.isArray(headers)) {
    return undefined;
  }
  for (const [key, value] of Object.entries(headers)) {
    if (key.toLowerCase() === name.toLowerCase()) {
      return typeof value === 'string' ? value : undefined;
    }
  }
  return undefined;
}

function retryAfterMs(error: unknown, now: number): number | undefined {
  if (errorStatusCode(error) !== 429 || typeof error !== 'object' || !error) {
    return undefined;
  }
  const context = 'context' in error ? error.context : undefined;
  if (
    typeof context !== 'object' ||
    !context ||
    !('responseHeaders' in context)
  ) {
    return undefined;
  }
  const value = responseHeader(context.responseHeaders, 'retry-after');
  if (!value) return undefined;
  const seconds = Number(value);
  if (Number.isFinite(seconds) && seconds >= 0) return seconds * 1000;
  const retryAt = Date.parse(value);
  return Number.isFinite(retryAt) ? Math.max(0, retryAt - now) : undefined;
}

export function retryableProjectionAckFailure(
  error: unknown,
  now = Date.now()
): RetryableAckFailure | null {
  const statusCode = errorStatusCode(error);
  if (statusCode === undefined) {
    return { kind: 'scheduled', retryAfterMs: DEFAULT_RETRY_DELAY_MS };
  }
  if (statusCode === 401 || statusCode === 402 || statusCode === 403) {
    return {
      kind: 'event',
      blockedBy: statusCode === 401 ? 'authentication' : 'entitlement',
    };
  }
  if (statusCode === 408 || statusCode === 429) {
    return {
      kind: 'scheduled',
      retryAfterMs: retryAfterMs(error, now) ?? DEFAULT_RETRY_DELAY_MS,
    };
  }
  return statusCode >= 500
    ? { kind: 'scheduled', retryAfterMs: DEFAULT_RETRY_DELAY_MS }
    : null;
}

export function tradeImportEntitlementFromEvent(
  event: Event
): boolean | undefined {
  if (!(event instanceof CustomEvent)) return undefined;
  const detail: unknown = event.detail;
  if (typeof detail !== 'object' || !detail || Array.isArray(detail)) {
    return undefined;
  }
  if (
    !('tradeImportEnabled' in detail) ||
    typeof detail.tradeImportEnabled !== 'boolean'
  ) {
    return undefined;
  }
  return detail.tradeImportEnabled;
}
