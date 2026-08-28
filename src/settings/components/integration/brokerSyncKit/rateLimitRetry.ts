

import { ApiError } from '../../../../types/errors';

const RATE_LIMIT_RETRY_DELAY_MS = 2000;

function isRateLimited(error: unknown): boolean {
  return error instanceof ApiError && error.statusCode === 429;
}

export async function withRateLimitRetry<T>(
  load: () => Promise<T>,
  delayMs: number = RATE_LIMIT_RETRY_DELAY_MS
): Promise<T> {
  try {
    return await load();
  } catch (error) {
    if (!isRateLimited(error)) throw error;
    await new Promise<void>((resolve) => {
      window.setTimeout(resolve, delayMs);
    });
    return load();
  }
}
