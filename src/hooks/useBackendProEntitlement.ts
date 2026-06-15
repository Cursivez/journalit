import { useEffect, useMemo, useState } from 'react';
import type JournalitPlugin from '../main';
import {
  type BackendFeatureKey,
  SubscriptionTierService,
  type SubscriptionTierRefreshStatus,
} from '../services/backend/SubscriptionTierService';
import { BackendSecretStorage } from '../services/backend/BackendSecretStorage';

interface BackendProEntitlementState {
  isAuthenticated: boolean;
  isChecking: boolean;
  isVerified: boolean;
  isPro: boolean;
  isFeatureEnabled: boolean;
  refreshStatus: SubscriptionTierRefreshStatus | null;
}

export function useBackendProEntitlement(
  plugin: JournalitPlugin,
  reason: string,
  feature?: BackendFeatureKey
): BackendProEntitlementState {
  const [subscriptionVersion, setSubscriptionVersion] = useState(0);
  const [isChecking, setIsChecking] = useState(() =>
    BackendSecretStorage.hasAuthToken(plugin)
  );
  const [refreshStatus, setRefreshStatus] =
    useState<SubscriptionTierRefreshStatus | null>(null);
  const [isFeatureEnabled, setIsFeatureEnabled] = useState(
    () =>
      BackendSecretStorage.hasAuthToken(plugin) &&
      plugin.settings.backendIntegration?.subscriptionTier === 'premium'
  );

  useEffect(() => {
    const handleSubscriptionChanged = () =>
      setSubscriptionVersion((v) => v + 1);
    window.addEventListener(
      'journalit:subscription-changed',
      handleSubscriptionChanged
    );
    return () => {
      window.removeEventListener(
        'journalit:subscription-changed',
        handleSubscriptionChanged
      );
    };
  }, []);

  const authToken = BackendSecretStorage.getAuthToken(plugin);
  const isAuthenticated = !!authToken;

  useEffect(() => {
    if (!isAuthenticated) {
      setIsChecking(false);
      setRefreshStatus('signed_out');
      setIsFeatureEnabled(false);
      return;
    }

    let cancelled = false;
    setIsChecking(true);
    void new SubscriptionTierService(plugin)
      .refreshTier(reason)
      .then((result) => {
        if (!cancelled) {
          setRefreshStatus(result.status);
          setIsFeatureEnabled(
            feature
              ? result.entitlements?.features[feature]?.enabled === true
              : result.status === 'premium'
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsChecking(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [
    authToken,
    feature,
    isAuthenticated,
    plugin,
    reason,
    subscriptionVersion,
  ]);

  return useMemo(() => {
    const isVerified =
      refreshStatus === 'premium' ||
      refreshStatus === 'free' ||
      refreshStatus === 'signed_out';
    return {
      isAuthenticated,
      isChecking,
      isVerified,
      isPro: isAuthenticated && refreshStatus === 'premium',
      isFeatureEnabled: isAuthenticated && isFeatureEnabled,
      refreshStatus,
    };
  }, [isAuthenticated, isChecking, isFeatureEnabled, refreshStatus]);
}
