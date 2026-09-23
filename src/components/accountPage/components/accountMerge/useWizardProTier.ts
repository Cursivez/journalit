

import { useCallback, useEffect, useState } from 'react';
import type JournalitPlugin from '../../../../main';
import { BackendSecretStorage } from '../../../../services/backend/BackendSecretStorage';
import { SubscriptionTierService } from '../../../../services/backend/SubscriptionTierService';

const readIsPro = (plugin: JournalitPlugin): boolean =>
  plugin.settings.backendIntegration?.subscriptionTier === 'premium' &&
  BackendSecretStorage.hasAuthToken(plugin);

export function useWizardProTier(plugin: JournalitPlugin): boolean {
  const [isPro, setIsPro] = useState(() => readIsPro(plugin));
  const sync = useCallback(() => setIsPro(readIsPro(plugin)), [plugin]);

  useEffect(() => {
    
    
    let cancelled = false;
    
    
    const onFocus = () => {
      if (readIsPro(plugin) || !BackendSecretStorage.hasAuthToken(plugin)) {
        return;
      }
      void new SubscriptionTierService(plugin)
        .refreshTier('challenge setup')
        .then(() => {
          if (!cancelled) sync();
        });
    };
    const targetWindows = new Set<Window>([window, window.activeWindow]);
    for (const targetWindow of targetWindows) {
      targetWindow.addEventListener('focus', onFocus);
    }
    window.addEventListener('journalit:subscription-changed', sync);
    window.addEventListener('journalit:entitlements-refreshed', sync);
    return () => {
      cancelled = true;
      for (const targetWindow of targetWindows) {
        targetWindow.removeEventListener('focus', onFocus);
      }
      window.removeEventListener('journalit:subscription-changed', sync);
      window.removeEventListener('journalit:entitlements-refreshed', sync);
    };
  }, [plugin, sync]);

  return isPro;
}
