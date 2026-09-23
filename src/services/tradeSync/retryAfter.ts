type RetryAfterParseResult =
  | { kind: 'delay'; retryAfterMs: number }
  | { kind: 'absent' }
  | { kind: 'invalid' };

function headerValue(headers: unknown, name: string): string | undefined {
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

export function parseRetryAfterHeader(
  value: string | undefined,
  now = Date.now()
): RetryAfterParseResult {
  if (value === undefined) return { kind: 'absent' };
  const trimmed = value.trim();
  if (trimmed.length === 0) return { kind: 'invalid' };

  if (/^\d+$/.test(trimmed)) {
    const seconds = Number(trimmed);
    const retryAfterMs = seconds * 1000;
    return Number.isFinite(seconds) && Number.isFinite(retryAfterMs)
      ? { kind: 'delay', retryAfterMs }
      : { kind: 'invalid' };
  }

  if (!/[A-Za-z]/.test(trimmed)) return { kind: 'invalid' };
  const retryAt = Date.parse(trimmed);
  if (!Number.isFinite(retryAt)) return { kind: 'invalid' };
  return { kind: 'delay', retryAfterMs: Math.max(0, retryAt - now) };
}

export function parseRetryAfterFromHeaders(
  headers: unknown,
  now = Date.now()
): RetryAfterParseResult {
  return parseRetryAfterHeader(headerValue(headers, 'retry-after'), now);
}
