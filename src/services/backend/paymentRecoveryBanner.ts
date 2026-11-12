
import type JournalitPlugin from '../../main';

export interface EntitlementsSubscriptionSnapshot {
  status: string;
  isPro: boolean;
  lifetime: boolean;
  
  pastDue?: boolean;
  
  graceEndsAt?: string | null;
}

export type PaymentRecoveryBanner =
  | { kind: 'grace'; deadline: Date }
  | { kind: 'noAccess' }
  | { kind: 'paused' };

const NO_ACCESS_STATUSES = new Set([
  'unpaid',
  'incomplete',
  'incomplete_expired',
]);

export function resolvePaymentRecoveryBanner(
  subscription: EntitlementsSubscriptionSnapshot | null,
  now: Date = new Date()
): PaymentRecoveryBanner | null {
  if (!subscription || subscription.lifetime) return null;
  const { status } = subscription;
  if (status === 'past_due' || subscription.pastDue === true) {
    const deadline = subscription.graceEndsAt
      ? new Date(subscription.graceEndsAt)
      : null;
    const graceOpen =
      deadline !== null &&
      !Number.isNaN(deadline.getTime()) &&
      deadline.getTime() > now.getTime();
    if (subscription.isPro) {
      return graceOpen && deadline ? { kind: 'grace', deadline } : null;
    }
    return { kind: 'noAccess' };
  }
  if (NO_ACCESS_STATUSES.has(status)) return { kind: 'noAccess' };
  if (status === 'paused') return { kind: 'paused' };
  return null;
}


export const PAYMENT_RECOVERY_LINK_HOSTS = ['journalit.co'] as const;


export const WEB_DASHBOARD_URL = 'https://journalit.co/dashboard';


const PAYMENT_RECOVERY_FOCUS_REFRESH_MS = 60_000;

interface PaymentRecoveryState {
  subscription: EntitlementsSubscriptionSnapshot | null;
  lastFocusRefreshAt: number | null;
  listeners: Set<() => void>;
  version: number;
}

const states = new WeakMap<JournalitPlugin, PaymentRecoveryState>();

function stateFor(plugin: JournalitPlugin): PaymentRecoveryState {
  let state = states.get(plugin);
  if (!state) {
    state = {
      subscription: null,
      lastFocusRefreshAt: null,
      listeners: new Set(),
      version: 0,
    };
    states.set(plugin, state);
  }
  return state;
}

function notify(state: PaymentRecoveryState): void {
  state.version += 1;
  for (const listener of state.listeners) listener();
}


export const paymentRecoveryStore = {
  setSubscription(
    plugin: JournalitPlugin,
    subscription: EntitlementsSubscriptionSnapshot
  ): void {
    const state = stateFor(plugin);
    const next = {
      status: subscription.status,
      isPro: subscription.isPro,
      lifetime: subscription.lifetime,
      pastDue: subscription.pastDue,
      graceEndsAt: subscription.graceEndsAt ?? null,
    };
    const previous = state.subscription;
    if (
      previous &&
      previous.status === next.status &&
      previous.isPro === next.isPro &&
      previous.lifetime === next.lifetime &&
      previous.pastDue === next.pastDue &&
      previous.graceEndsAt === next.graceEndsAt
    ) {
      return;
    }
    state.subscription = next;
    notify(state);
  },

  clear(plugin: JournalitPlugin): void {
    const state = states.get(plugin);
    if (!state?.subscription) return;
    state.subscription = null;
    notify(state);
  },

  getSubscription(
    plugin: JournalitPlugin
  ): EntitlementsSubscriptionSnapshot | null {
    return states.get(plugin)?.subscription ?? null;
  },

  
  claimFocusRefresh(plugin: JournalitPlugin, nowMs: number): boolean {
    const state = states.get(plugin);
    if (
      !state ||
      !resolvePaymentRecoveryBanner(state.subscription, new Date(0))
    ) {
      return false;
    }
    if (
      state.lastFocusRefreshAt !== null &&
      nowMs - state.lastFocusRefreshAt < PAYMENT_RECOVERY_FOCUS_REFRESH_MS
    ) {
      return false;
    }
    state.lastFocusRefreshAt = nowMs;
    return true;
  },

  subscribe(plugin: JournalitPlugin, listener: () => void): () => void {
    const state = stateFor(plugin);
    state.listeners.add(listener);
    return () => {
      state.listeners.delete(listener);
    };
  },

  getVersion(plugin: JournalitPlugin): number {
    return states.get(plugin)?.version ?? 0;
  },
};
