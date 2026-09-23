

import { Notice } from 'obsidian';
import type JournalitPlugin from '../../main';
import { ApiClient } from './ApiClient';
import { BackendSecretStorage } from './BackendSecretStorage';
import { clearPersistedBackendAuthSession } from './BackendAuthFailure';
import { ApiError } from '../../types/errors';
import { t } from '../../lang/helpers';
import { DemoSyncGate } from '../../demo/DemoSyncGate';

export type SubscriptionTierRefreshStatus =
  | 'premium'
  | 'free'
  | 'signed_out'
  | 'unverified';

export type BackendFeatureKey =
  | 'tradeImport'
  | 'quickTradeImport'
  | 'metatraderSync'
  | 'rithmicSync'
  | 'aiMapping';


export type OptionalBackendFeatureKey = 'ctraderSync';

export type AnyBackendFeatureKey =
  | BackendFeatureKey
  | OptionalBackendFeatureKey;

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
  features: Record<BackendFeatureKey, BackendFeatureEntitlement> &
    Partial<Record<OptionalBackendFeatureKey, BackendFeatureEntitlement>>;
  limits: {
    tradeImport: {
      maxFileBytes: number;
      monthlyImportsUsed: number;
      monthlyImportsLimit: number | null;
    };
  };
}

export interface SubscriptionTierRefreshResult {
  status: SubscriptionTierRefreshStatus;
  entitlements?: BackendEntitlementsResponse;
}

interface ActiveRefresh {
  authSessionVersion: number;
  promise: Promise<SubscriptionTierRefreshResult>;
}

const activeRefreshes = new WeakMap<JournalitPlugin, ActiveRefresh>();

export class SubscriptionTierService {
  constructor(private plugin: JournalitPlugin) {}

  
  async refreshTier(reason: string): Promise<SubscriptionTierRefreshResult> {
    if (DemoSyncGate.isActive()) {
      return { status: 'unverified' };
    }
    const authToken = BackendSecretStorage.getAuthToken(this.plugin);
    ApiClient.setAuthToken(authToken);
    const authSessionVersion = ApiClient.getAuthSessionVersion();
    const activeRefresh = activeRefreshes.get(this.plugin);
    if (activeRefresh?.authSessionVersion === authSessionVersion) {
      return activeRefresh.promise;
    }

    const refresh = this.performRefresh(
      reason,
      authToken,
      authSessionVersion
    ).finally(() => {
      if (activeRefreshes.get(this.plugin)?.promise === refresh) {
        activeRefreshes.delete(this.plugin);
      }
    });
    activeRefreshes.set(this.plugin, { authSessionVersion, promise: refresh });
    return refresh;
  }

  private async performRefresh(
    reason: string,
    authToken: string | null,
    authSessionVersion: number
  ): Promise<SubscriptionTierRefreshResult> {
    const backend = this.plugin.settings.backendIntegration;
    if (!backend) {
      return { status: 'signed_out' };
    }

    if (!authToken) {
      return { status: 'signed_out' };
    }

    
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
      if (ApiClient.getAuthSessionVersion() !== authSessionVersion) {
        return { status: 'unverified' };
      }

      const nextTier = entitlements.subscription.isPro ? 'premium' : 'free';
      const nextUserId = String(entitlements.user.id);
      const entitlementEventDetail = {
        tradeImportEnabled: entitlements.features.tradeImport.enabled,
      };
      if (
        backend.subscriptionTier !== nextTier ||
        backend.userEmail !== entitlements.user.email ||
        backend.userId !== nextUserId ||
        backend.authenticatedAccountId !== nextUserId
      ) {
        backend.subscriptionTier = nextTier;
        backend.userEmail = entitlements.user.email;
        backend.userId = nextUserId;
        backend.authenticatedAccountId = nextUserId;
        await this.plugin.saveSettings();
        window.dispatchEvent(
          new CustomEvent('journalit:subscription-changed', {
            detail: entitlementEventDetail,
          })
        );
      }
      window.dispatchEvent(
        new CustomEvent('journalit:entitlements-refreshed', {
          detail: entitlementEventDetail,
        })
      );
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
