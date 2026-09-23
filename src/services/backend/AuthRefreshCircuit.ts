
export const AUTH_REFRESH_UNAVAILABLE_COOLDOWN_MS = 2 * 60 * 1000;

export type AuthRefreshResumeReason =
  | 'manual'
  | 'online'
  | 'focus'
  | 'cooldown'
  | 'session';

export class AuthRefreshCircuit {
  private blockedUntil = 0;
  private expiryTimer: number | null = null;
  private readonly listeners = new Set<(blocked: boolean) => void>();

  isBlocked(now = Date.now()): boolean {
    return now < this.blockedUntil;
  }

  recordUnavailable(
    now = Date.now(),
    cooldownMs = AUTH_REFRESH_UNAVAILABLE_COOLDOWN_MS
  ): void {
    this.blockedUntil = now + cooldownMs;
    this.scheduleExpiry(cooldownMs);
    this.emit();
  }

  resume(_reason: AuthRefreshResumeReason): boolean {
    if (this.blockedUntil === 0 && this.expiryTimer === null) {
      return false;
    }
    this.blockedUntil = 0;
    this.clearExpiryTimer();
    this.emit();
    return true;
  }

  subscribe(listener: (blocked: boolean) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  dispose(): void {
    this.blockedUntil = 0;
    this.clearExpiryTimer();
    this.listeners.clear();
  }

  private scheduleExpiry(delayMs: number): void {
    this.clearExpiryTimer();
    if (typeof window === 'undefined') return;
    this.expiryTimer = window.setTimeout(() => {
      this.expiryTimer = null;
      this.blockedUntil = 0;
      this.emit();
    }, delayMs);
  }

  private clearExpiryTimer(): void {
    if (this.expiryTimer === null || typeof window === 'undefined') {
      this.expiryTimer = null;
      return;
    }
    window.clearTimeout(this.expiryTimer);
    this.expiryTimer = null;
  }

  private emit(): void {
    const blocked = this.isBlocked();
    for (const listener of this.listeners) {
      listener(blocked);
    }
  }
}
