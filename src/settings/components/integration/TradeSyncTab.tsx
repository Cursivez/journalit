

import React, { useCallback } from 'react';
import { Notice } from 'obsidian';
import type JournalitPlugin from '../../../main';
import { t } from '../../../lang/helpers';
import { UPGRADE_URL } from '../../../constants';
import { openExternalUrl } from '../../../utils/externalLinks';
import { SubscriptionTierService } from '../../../services/backend/SubscriptionTierService';
import { DeviceFlowSignInModal } from '../../../components/auth/DeviceFlowSignInModal';
import { Button } from '../../../components/ui/Button';
import { BackendIntegrationTab } from './BackendIntegrationTab';
import { useBackendProEntitlement } from '../../../hooks/useBackendProEntitlement';
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner';

interface TradeSyncTabProps {
  plugin: JournalitPlugin;
}

export const TradeSyncTab: React.FC<TradeSyncTabProps> = ({ plugin }) => {
  const {
    isAuthenticated,
    isFeatureEnabled: canUseMetatraderSync,
    isChecking: isCheckingEntitlement,
  } = useBackendProEntitlement(
    plugin,
    'trade sync settings open',
    'metatraderSync'
  );

  const handleSignIn = useCallback(() => {
    if (isAuthenticated) {
      return;
    }

    const modal = new DeviceFlowSignInModal(
      plugin.app,
      plugin,
      () => {
        new Notice(t('notice.login-success'));
      },
      () => {
        // intentional
      }
    );

    modal.open();
  }, [isAuthenticated, plugin]);

  const handleUpgrade = () => {
    openExternalUrl(UPGRADE_URL);
  };

  const handleRefresh = useCallback(async () => {
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      new Notice(t('premium.gate.offline'));
      return;
    }

    if (!isAuthenticated) {
      new Notice(t('premium.gate.not-pro-yet'));
      return;
    }

    const result = await new SubscriptionTierService(plugin).refreshTier(
      'manual refresh'
    );
    window.dispatchEvent(new CustomEvent('journalit:subscription-changed'));

    if (result.entitlements?.features.metatraderSync.enabled !== true) {
      new Notice(t('premium.gate.not-pro-yet'));
    }
  }, [isAuthenticated, plugin]);

  if (!isAuthenticated) {
    return (
      <div className="journalit-settings-tab backend-integration-settings">
        <h3>{t('backend.title')}</h3>
        <p className="setting-item-description">{t('backend.description')}</p>

        <div className="setting-item">
          <div className="setting-item-info">
            <div className="setting-item-name">
              {t('trade-sync.gate.signin.title')}
            </div>
            <div className="setting-item-description">
              {t('trade-sync.gate.signin.description')}
            </div>
          </div>

          <div className="setting-item-control">
            <Button variant="primary" onClick={handleSignIn}>
              {t('trade-sync.gate.signin.cta')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isCheckingEntitlement) {
    return (
      <div className="journalit-settings-tab backend-integration-settings">
        <h3>{t('backend.title')}</h3>
        <p className="setting-item-description">{t('backend.description')}</p>

        <div className="setting-item">
          <div className="setting-item-info">
            <div className="setting-item-name">
              {t('backend.status.checking')}
            </div>
            <div className="setting-item-description">
              {t('backend.status.checking')}
            </div>
          </div>

          <div className="setting-item-control">
            <LoadingSpinner size="small" message="" />
          </div>
        </div>
      </div>
    );
  }

  if (!canUseMetatraderSync) {
    return (
      <div className="journalit-settings-tab backend-integration-settings">
        <h3>{t('backend.title')}</h3>
        <p className="setting-item-description">{t('backend.description')}</p>

        <div className="setting-item">
          <div className="setting-item-info">
            <div className="setting-item-name">
              {t('trade-sync.gate.pro.title')}
            </div>
            <div className="setting-item-description">
              {t('trade-sync.gate.pro.description')}
            </div>
          </div>

          <div className="setting-item-control">
            <Button variant="primary" onClick={handleUpgrade}>
              {t('trade-sync.gate.pro.cta')}
            </Button>
            <Button variant="secondary" onClick={handleRefresh}>
              {t('premium.gate.cta.refresh')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <BackendIntegrationTab plugin={plugin} />;
};

TradeSyncTab.displayName = 'TradeSyncTab';
