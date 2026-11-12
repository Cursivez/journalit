import { useCallback, useSyncExternalStore } from 'react';
import type JournalitPlugin from '../main';
import { DemoSyncGate } from '../demo/DemoSyncGate';
import { BackendSecretStorage } from '../services/backend/BackendSecretStorage';
import {
  PAYMENT_RECOVERY_LINK_HOSTS,
  type PaymentRecoveryBanner,
  paymentRecoveryStore,
  resolvePaymentRecoveryBanner,
  WEB_DASHBOARD_URL,
} from '../services/backend/paymentRecoveryBanner';
import { openExternalUrl } from '../utils/externalLinks';

export interface PaymentRecoveryBannerModel {
  banner: PaymentRecoveryBanner;
  updatePaymentMethod: () => void;
}


export function usePaymentRecoveryBanner(
  plugin: JournalitPlugin
): PaymentRecoveryBannerModel | null {
  const subscribe = useCallback(
    (listener: () => void) => paymentRecoveryStore.subscribe(plugin, listener),
    [plugin]
  );
  const getVersion = useCallback(
    () => paymentRecoveryStore.getVersion(plugin),
    [plugin]
  );
  useSyncExternalStore(subscribe, getVersion, getVersion);

  if (DemoSyncGate.isActive() || !BackendSecretStorage.hasAuthToken(plugin)) {
    return null;
  }
  const banner = resolvePaymentRecoveryBanner(
    paymentRecoveryStore.getSubscription(plugin)
  );
  if (!banner) return null;
  return {
    banner,
    updatePaymentMethod: () => {
      openExternalUrl(WEB_DASHBOARD_URL, PAYMENT_RECOVERY_LINK_HOSTS);
    },
  };
}
