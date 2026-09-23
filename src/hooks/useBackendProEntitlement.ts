import {
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import type JournalitPlugin from '../main';
import {
  type AnyBackendFeatureKey,
  SubscriptionTierService,
  type SubscriptionTierRefreshStatus,
} from '../services/backend/SubscriptionTierService';
import { BackendSecretStorage } from '../services/backend/BackendSecretStorage';

interface BackendProEntitlementState {
  isAuthenticated: boolean;
  isChecking: boolean;
  isPro: boolean;
  isFeatureEnabled: boolean;
  
  entitlementStatus: SubscriptionTierRefreshStatus | null;
}

interface BackendProEntitlementRefreshState {
  isChecking: boolean;
  isFeatureEnabled: boolean;
  refreshStatus: SubscriptionTierRefreshStatus | null;
}

type BackendProEntitlementRefreshAction =
  | { type: 'signed-out' }
  | { type: 'checking' }
  | { type: 'failed' }
  | {
      type: 'resolved';
      refreshStatus: SubscriptionTierRefreshStatus;
      isFeatureEnabled: boolean;
    };

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
    case 'failed':
      return { ...state, isChecking: false };
    case 'resolved':
      return {
        isChecking: false,
        refreshStatus: action.refreshStatus,
        isFeatureEnabled: action.isFeatureEnabled,
      };
  }
};

const RETURN_REFRESH_MIN_INTERVAL_MS = 30_000;
const subscribeToSubscriptionChanged = (
  onStoreChange: () => void
): (() => void) => {
  const handleSubscriptionChanged = () => onStoreChange();
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
};

export function useBackendProEntitlement(
  plugin: JournalitPlugin,
  reason: string,
  feature?: AnyBackendFeatureKey
): BackendProEntitlementState {
  const authToken = useSyncExternalStore(subscribeToSubscriptionChanged, () =>
    BackendSecretStorage.getAuthToken(plugin)
  );
  const [returnRefreshVersion, setReturnRefreshVersion] = useState(0);
  const lastReturnRefreshAtRef = useRef(0);
  const returnRefreshTimeoutRef = useRef<number | null>(null);
  const wasAwayFromObsidianRef = useRef(false);
  const [refreshState, dispatchRefresh] = useReducer(
    refreshReducer,
    undefined,
    (): BackendProEntitlementRefreshState => {
      const hasAuthToken = !!authToken;
      const cachedTier =
        plugin.settings.backendIntegration?.subscriptionTier ?? null;
      return {
        isChecking: hasAuthToken,
        refreshStatus: hasAuthToken
          ? cachedTier === 'premium' || cachedTier === 'free'
            ? cachedTier
            : null
          : 'signed_out',
        isFeatureEnabled: hasAuthToken && cachedTier === 'premium',
      };
    }
  );

  const isAuthenticated = !!authToken;

  useEffect(() => {
    if (!isAuthenticated) {
      wasAwayFromObsidianRef.current = false;
      return;
    }

    const markAway = () => {
      wasAwayFromObsidianRef.current = true;
    };
    const activeWindow = window.activeWindow;
    const targetWindows = new Set<Window>([window, activeWindow]);
    const targetDocuments = new Set<Document>(
      
      Array.from(targetWindows, (targetWindow) => targetWindow.document)
    );
    const requestRefresh = () => {
      lastReturnRefreshAtRef.current = Date.now();
      setReturnRefreshVersion((version) => version + 1);
    };
    const refreshAfterReturn = () => {
      if (!wasAwayFromObsidianRef.current) return;
      wasAwayFromObsidianRef.current = false;
      const now = Date.now();
      const elapsed = now - lastReturnRefreshAtRef.current;
      if (elapsed < RETURN_REFRESH_MIN_INTERVAL_MS) {
        if (returnRefreshTimeoutRef.current === null) {
          returnRefreshTimeoutRef.current = window.setTimeout(() => {
            returnRefreshTimeoutRef.current = null;
            requestRefresh();
          }, RETURN_REFRESH_MIN_INTERVAL_MS - elapsed);
        }
        return;
      }
      requestRefresh();
    };
    const visibilityHandlers = new Map<Document, () => void>();

    for (const targetWindow of targetWindows) {
      targetWindow.addEventListener('blur', markAway);
      targetWindow.addEventListener('focus', refreshAfterReturn);
    }
    for (const targetDocument of targetDocuments) {
      const handleVisibilityChange = () => {
        if (targetDocument.visibilityState === 'hidden') {
          markAway();
        } else {
          refreshAfterReturn();
        }
      };
      visibilityHandlers.set(targetDocument, handleVisibilityChange);
      targetDocument.addEventListener(
        'visibilitychange',
        handleVisibilityChange
      );
    }
    return () => {
      for (const targetWindow of targetWindows) {
        targetWindow.removeEventListener('blur', markAway);
        targetWindow.removeEventListener('focus', refreshAfterReturn);
      }
      for (const targetDocument of targetDocuments) {
        const handleVisibilityChange = visibilityHandlers.get(targetDocument);
        if (!handleVisibilityChange) continue;
        targetDocument.removeEventListener(
          'visibilitychange',
          handleVisibilityChange
        );
      }
      if (returnRefreshTimeoutRef.current !== null) {
        window.clearTimeout(returnRefreshTimeoutRef.current);
        returnRefreshTimeoutRef.current = null;
      }
    };
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      dispatchRefresh({ type: 'signed-out' });
      return;
    }

    let cancelled = false;
    let generation = 0;

    const refresh = () => {
      const requestGeneration = ++generation;
      void new SubscriptionTierService(plugin)
        .refreshTier(reason)
        .then((result) => {
          if (cancelled || requestGeneration !== generation) {
            return;
          }
          dispatchRefresh({
            type: 'resolved',
            refreshStatus: result.status,
            isFeatureEnabled: feature
              ? result.entitlements?.features[feature]?.enabled === true
              : result.status === 'premium',
          });
        })
        .catch(() => {
          if (cancelled || requestGeneration !== generation) {
            return;
          }
          dispatchRefresh({ type: 'failed' });
        });
    };

    dispatchRefresh({ type: 'checking' });
    
    
    
    window.addEventListener('journalit:subscription-changed', refresh);
    window.addEventListener('journalit:entitlements-refreshed', refresh);
    refresh();

    return () => {
      cancelled = true;
      window.removeEventListener('journalit:subscription-changed', refresh);
      window.removeEventListener('journalit:entitlements-refreshed', refresh);
    };
  }, [
    authToken,
    feature,
    isAuthenticated,
    plugin,
    reason,
    returnRefreshVersion,
  ]);

  return useMemo(() => {
    const { isChecking, isFeatureEnabled, refreshStatus } = refreshState;
    return {
      isAuthenticated,
      isChecking,
      isPro: isAuthenticated && refreshStatus === 'premium',
      isFeatureEnabled: isAuthenticated && isFeatureEnabled,
      entitlementStatus: isAuthenticated ? refreshStatus : 'signed_out',
    };
  }, [isAuthenticated, refreshState]);
}


export function useCachedBackendProEntitlement(
  plugin: JournalitPlugin
): BackendProEntitlementState {
  const snapshot = useSyncExternalStore(subscribeToSubscriptionChanged, () => {
    const authState = BackendSecretStorage.getAuthToken(plugin)
      ? 'authenticated'
      : 'signed-out';
    const tier = plugin.settings.backendIntegration?.subscriptionTier ?? '';
    return `${authState}:${tier}`;
  });
  const [authState, tier] = snapshot.split(':');
  const isAuthenticated = authState === 'authenticated';
  const isPro = isAuthenticated && tier === 'premium';
  return {
    isAuthenticated,
    isChecking: false,
    isPro,
    isFeatureEnabled: isPro,
    entitlementStatus: !isAuthenticated
      ? 'signed_out'
      : tier === 'premium'
        ? 'premium'
        : tier === 'free'
          ? 'free'
          : null,
  };
}
