

import { Notice } from 'obsidian';
import type JournalitPlugin from '../../main';
import { ApiClient } from './ApiClient';
import { BackendSecretStorage } from './BackendSecretStorage';
import { clearPersistedBackendAuthSession } from './BackendAuthFailure';
import { ApiError } from '../../types/errors';
import { t } from '../../lang/helpers';

export type SubscriptionTierRefreshStatus =
  | 'premium'
  | 'free'
  | 'signed_out'
  | 'unverified';

export type BackendFeatureKey =
  | 'tradeImport'
  | 'quickTradeImport'
  | 'metatraderSync'
  | 'aiMapping';

interface BackendFeatureEntitlement {
  enabled: boolean;
  reason: string | null;
}

interface BackendEntitlementsResponse {
  schemaVersion: 'entitlements-v1';
  user: {
    id: number;
    email: string;
  };
  subscription: {
    tier: string;
    status: string;
    isPro: boolean;
    trial: {
      active: boolean;
      endsAt: string | null;
    };
    paidThrough: string | null;
    lifetime: boolean;
  };
  accountEntitlements: {
    lifetimePro: boolean;
    grantedAt: string | null;
    betaProgram: {
      eligible: boolean;
      source: string | null;
    };
  };
  features: Record<BackendFeatureKey, BackendFeatureEntitlement>;
  limits: {
    tradeImport: {
      maxFileBytes: number;
      monthlyImportsUsed: number;
      monthlyImportsLimit: number | null;
    };
  };
}

interface SubscriptionTierRefreshResult {
  status: SubscriptionTierRefreshStatus;
  entitlements?: BackendEntitlementsResponse;
}

interface ActiveRefresh {
  authToken: string | null;
  promise: Promise<SubscriptionTierRefreshResult>;
}

const activeRefreshes = new WeakMap<JournalitPlugin, ActiveRefresh>();

export class SubscriptionTierService {
  constructor(private plugin: JournalitPlugin) {}

  
  async refreshTier(reason: string): Promise<SubscriptionTierRefreshResult> {
    const authToken = BackendSecretStorage.getAuthToken(this.plugin);
    const activeRefresh = activeRefreshes.get(this.plugin);
    if (activeRefresh?.authToken === authToken) {
      return activeRefresh.promise;
    }

    const refresh = this.performRefresh(reason, authToken).finally(() => {
      if (activeRefreshes.get(this.plugin)?.promise === refresh) {
        activeRefreshes.delete(this.plugin);
      }
    });
    activeRefreshes.set(this.plugin, { authToken, promise: refresh });
    return refresh;
  }

  private async performRefresh(
    reason: string,
    authToken: string | null
  ): Promise<SubscriptionTierRefreshResult> {
    const backend = this.plugin.settings.backendIntegration;
    if (!backend) {
      return { status: 'signed_out' };
    }

    if (!authToken) {
      return { status: 'signed_out' };
    }

    ApiClient.setAuthToken(authToken);

    
    ApiClient.invalidateCache('/api/v1/me/entitlements');

    const url = ApiClient.buildUrl('/api/v1/me/entitlements');

    try {
      const entitlements =
        await ApiClient.makeRequest<BackendEntitlementsResponse>(
          url,
          {
            method: 'GET',
            headers: {
              'x-endpoint': '/api/v1/me/entitlements',
            },
          },
          `entitlement check: ${reason}`,
          10,
          {
            suppressPremiumRequiredEvent: true,
            propagateErrors: true,
          }
        );
      if (!entitlements) {
        return { status: 'unverified' };
      }
      if (BackendSecretStorage.getAuthToken(this.plugin) !== authToken) {
        return { status: 'unverified' };
      }

      const nextTier = entitlements.subscription.isPro ? 'premium' : 'free';
      const nextUserId = String(entitlements.user.id);
      if (
        backend.subscriptionTier !== nextTier ||
        backend.userEmail !== entitlements.user.email ||
        backend.userId !== nextUserId
      ) {
        backend.subscriptionTier = nextTier;
        backend.userEmail = entitlements.user.email;
        backend.userId = nextUserId;
        await this.plugin.saveSettings();
        window.dispatchEvent(new CustomEvent('journalit:subscription-changed'));
      }
      return {
        status: entitlements.subscription.isPro ? 'premium' : 'free',
        entitlements,
      };
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === 'Authenticated request cancelled'
      ) {
        return { status: 'signed_out' };
      }

      if (error instanceof ApiError) {
        if (error.statusCode === 401) {
          
          
          
          
          const cleared = await clearPersistedBackendAuthSession(
            this.plugin,
            authToken
          );
          if (cleared && !this.hasBackendIntegrationService()) {
            this.showAuthExpiredNoticeWithoutBackendService();
          }
          return { status: 'signed_out' };
        }
      }

      console.warn('[SubscriptionTierService] Tier refresh failed:', error);
      return { status: 'unverified' };
    }
  }

  private hasBackendIntegrationService(): boolean {
    return Boolean(
      (this.plugin as JournalitPlugin & { backendIntegrationService?: unknown })
        .backendIntegrationService
    );
  }

  private showAuthExpiredNoticeWithoutBackendService(): void {
    new Notice(t('error.session-expired'));
  }
}
