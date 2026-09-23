import { ApiError } from '../../types/errors';
import type { ErrorContext } from '../../utils/errorHandler';
import { t } from '../../lang/helpers';
import { parseRetryAfterFromHeaders } from './retryAfter';

const DEFAULT_RETRY_DELAY_MS = 30_000;
const MAX_RETRY_DELAY_MS = 60 * 60 * 1000;

type TradeSyncRateLimitAction = 'restore' | 'mapping';

export class TradeSyncRateLimitError extends ApiError {
  readonly retryAt: number;
  readonly action: TradeSyncRateLimitAction;

  constructor(
    message: string,
    retryAt: number,
    action: TradeSyncRateLimitAction,
    context?: ErrorContext
  ) {
    super(message, 429, context);
    this.name = 'TradeSyncRateLimitError';
    this.retryAt = retryAt;
    this.action = action;
  }
}

export function isTradeSyncRateLimitError(
  error: unknown
): error is TradeSyncRateLimitError {
  return error instanceof TradeSyncRateLimitError;
}

export function tradeSyncRateLimitErrorFromHeaders(
  message: string,
  headers: unknown,
  action: TradeSyncRateLimitAction,
  now = Date.now()
): TradeSyncRateLimitError {
  const parsed = parseRetryAfterFromHeaders(headers, now);
  const retryAfterMs =
    parsed.kind === 'delay' && Number.isFinite(parsed.retryAfterMs)
      ? Math.min(MAX_RETRY_DELAY_MS, Math.max(0, parsed.retryAfterMs))
      : DEFAULT_RETRY_DELAY_MS;
  const responseHeaders =
    typeof headers === 'object' && headers && !Array.isArray(headers)
      ? Object.fromEntries(
          Object.entries(headers).flatMap(([key, value]) =>
            typeof value === 'string' ? [[key, value] as const] : []
          )
        )
      : undefined;
  return new TradeSyncRateLimitError(message, now + retryAfterMs, action, {
    operation: message,
    statusCode: 429,
    responseHeaders,
  });
}

export function isRateLimitActive(
  retryAt: number | undefined,
  now = Date.now()
): boolean {
  return retryAt !== undefined && Number.isFinite(retryAt) && now < retryAt;
}

export function tradeSyncRateLimitMessage(
  retryAt: number,
  action: TradeSyncRateLimitError['action'],
  now = Date.now()
): string {
  const remainingMs = Number.isFinite(retryAt)
    ? Math.min(MAX_RETRY_DELAY_MS, Math.max(0, retryAt - now))
    : DEFAULT_RETRY_DELAY_MS;
  const seconds = Math.max(1, Math.ceil(remainingMs / 1000));
  return t('trade-sync.import.notice.rate-limited', {
    action: t(
      action === 'mapping'
        ? 'trade-sync.rate-limit.action.mapping'
        : 'trade-sync.import.action.restore-account'
    ),
    seconds: String(seconds),
  });
}
