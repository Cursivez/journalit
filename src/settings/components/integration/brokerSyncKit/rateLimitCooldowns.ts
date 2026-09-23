import { useEffect, useState } from 'react';
import {
  isRateLimitActive,
  tradeSyncRateLimitMessage,
} from '../../../../services/tradeSync/TradeSyncRateLimit';

interface RateLimitUiState {
  limited: boolean;
  message?: string;
}

export function rateLimitUiState(
  retryAt: number | undefined,
  action: 'mapping' | 'restore',
  now: number
): RateLimitUiState {
  const limited = isRateLimitActive(retryAt, now);
  return {
    limited,
    message:
      limited && retryAt !== undefined
        ? tradeSyncRateLimitMessage(retryAt, action, now)
        : undefined,
  };
}

export function useRateLimitCountdown(
  ...retryAtByKey: ReadonlyArray<Readonly<Record<string, number>>>
): number {
  const [clock, setClock] = useState(() => Date.now());
  const renderNow = Math.max(clock, Date.now());
  const hasActiveCooldown = retryAtByKey.some((retryAtMap) =>
    Object.values(retryAtMap).some((retryAt) =>
      isRateLimitActive(retryAt, renderNow)
    )
  );

  useEffect(() => {
    if (!hasActiveCooldown) return;
    const timer = window.setInterval(() => setClock(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [hasActiveCooldown]);

  return renderNow;
}
