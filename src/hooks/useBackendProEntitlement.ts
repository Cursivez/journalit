import { useEffect, useMemo, useReducer, useState } from 'react';
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

interface BackendProEntitlementRefreshState {
  isChecking: boolean;
  isFeatureEnabled: boolean;
  refreshStatus: SubscriptionTierRefreshStatus | null;
}

type BackendProEntitlementRefreshAction =
  | { type: 'signed-out' }
  | { type: 'checking' }
  | {
      type: 'resolved';
      refreshStatus: SubscriptionTierRefreshStatus;
      isFeatureEnabled: boolean;
    }
  | { type: 'settled' };

const refreshReducer = (
  state: BackendProEntitlementRefreshState,
  action: BackendProEntitlementRefreshAction
): BackendProEntitlementRefreshState => {
  switch (action.type) {
    case 'signed-out':
      return {
        isChecking: false,
        refreshStatus: 'signed_out',
        isFeatureEnabled: false,
      };
    case 'checking':
      return { ...state, isChecking: true };
    case 'resolved':
      return {
        isChecking: false,
        refreshStatus: action.refreshStatus,
        isFeatureEnabled: action.isFeatureEnabled,
      };
    case 'settled':
      return { ...state, isChecking: false };
  }
};

export function useBackendProEntitlement(
  plugin: JournalitPlugin,
  reason: string,
  feature?: BackendFeatureKey
): BackendProEntitlementState {
  const [subscriptionVersion, setSubscriptionVersion] = useState(0);
  const [refreshState, dispatchRefresh] = useReducer(
    refreshReducer,
    undefined,
    () => {
      const hasAuthToken = BackendSecretStorage.hasAuthToken(plugin);
      return {
        isChecking: hasAuthToken,
        refreshStatus: null,
        isFeatureEnabled:
          hasAuthToken &&
          plugin.settings.backendIntegration?.subscriptionTier === 'premium',
      };
    }
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
      dispatchRefresh({ type: 'signed-out' });
      return;
    }

    let cancelled = false;
    dispatchRefresh({ type: 'checking' });
    void new SubscriptionTierService(plugin)
      .refreshTier(reason)
      .then((result) => {
        if (!cancelled) {
          dispatchRefresh({
            type: 'resolved',
            refreshStatus: result.status,
            isFeatureEnabled: feature
              ? result.entitlements?.features[feature]?.enabled === true
              : result.status === 'premium',
          });
        }
      })
      .finally(() => {
        if (!cancelled) {
          dispatchRefresh({ type: 'settled' });
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
    const { isChecking, isFeatureEnabled, refreshStatus } = refreshState;
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
  }, [isAuthenticated, refreshState]);
}
