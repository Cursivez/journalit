

import React, { useCallback, useState } from 'react';
import { Notice } from 'obsidian';
import type JournalitPlugin from '../../../main';
import { t } from '../../../lang/helpers';
import { UPGRADE_URL } from '../../../constants';
import { openExternalUrl } from '../../../utils/externalLinks';
import { SubscriptionTierService } from '../../../services/backend/SubscriptionTierService';
import { DeviceFlowSignInModal } from '../../../components/auth/DeviceFlowSignInModal';
import { Button } from '../../../components/ui/Button';
import { BackendIntegrationTab } from './BackendIntegrationTab';
import { TradeImportSyncPanel } from './TradeImportSyncPanel';
import { useBackendProEntitlement } from '../../../hooks/useBackendProEntitlement';
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner';

interface TradeSyncTabProps {
  plugin: JournalitPlugin;
}

type TradeSyncSource = 'metatrader' | 'tradeImport';

const TRADE_SYNC_SOURCE_STORAGE_KEY = 'journalit.tradeSyncSelectedSource';

function isTradeSyncSourceEnabled(
  source: TradeSyncSource,
  entitlements: { metatrader: boolean; tradeImport: boolean }
): boolean {
  return source === 'metatrader'
    ? entitlements.metatrader
    : entitlements.tradeImport;
}

function readStoredTradeSyncSource(plugin: JournalitPlugin): TradeSyncSource {
  const storedUiState =
    plugin.uiStateManager.getState().tradeSyncSelectedSource;
  if (storedUiState === 'tradeImport') return 'tradeImport';

  return plugin.app.loadLocalStorage(TRADE_SYNC_SOURCE_STORAGE_KEY) ===
    'tradeImport'
    ? 'tradeImport'
    : 'metatrader';
}

export const TradeSyncTab: React.FC<TradeSyncTabProps> = ({ plugin }) => {
  const [selectedSource, setSelectedSource] = useState<TradeSyncSource>(() =>
    readStoredTradeSyncSource(plugin)
  );
  const {
    isAuthenticated,
    isFeatureEnabled: canUseMetatraderSync,
    isChecking: isCheckingMetatraderEntitlement,
  } = useBackendProEntitlement(
    plugin,
    'trade sync settings open',
    'metatraderSync'
  );
  const {
    isFeatureEnabled: canUseTradeImportSync,
    isChecking: isCheckingTradeImportEntitlement,
  } = useBackendProEntitlement(
    plugin,
    'trade import sync settings open',
    'tradeImport'
  );

  const selectedSourceEnabled = isTradeSyncSourceEnabled(selectedSource, {
    metatrader: canUseMetatraderSync,
    tradeImport: canUseTradeImportSync,
  });
  const isCheckingSelectedEntitlement =
    selectedSource === 'metatrader'
      ? isCheckingMetatraderEntitlement
      : isCheckingTradeImportEntitlement;

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

    const selectedFeatureEnabled =
      selectedSource === 'metatrader'
        ? result.entitlements?.features.metatraderSync.enabled === true
        : result.entitlements?.features.tradeImport.enabled === true;

    if (!selectedFeatureEnabled) {
      new Notice(t('premium.gate.not-pro-yet'));
    }
  }, [isAuthenticated, plugin, selectedSource]);

  const selectSource = useCallback(
    (source: TradeSyncSource) => {
      setSelectedSource(source);
      void plugin.uiStateManager.updateStateImmediate({
        tradeSyncSelectedSource: source,
      });
      plugin.app.saveLocalStorage(TRADE_SYNC_SOURCE_STORAGE_KEY, source);
    },
    [plugin.app, plugin.uiStateManager]
  );

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

  if (isCheckingSelectedEntitlement) {
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

  const gate = !selectedSourceEnabled ? (
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
  ) : null;

  if (!canUseMetatraderSync && !canUseTradeImportSync) {
    return (
      <div className="journalit-settings-tab backend-integration-settings">
        <h3>{t('backend.title')}</h3>
        <p className="setting-item-description">{t('backend.description')}</p>

        {gate}
      </div>
    );
  }

  return (
    <div className="journalit-settings-tab backend-integration-settings">
      <div className="journalit-trade-sync-source-switcher" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={selectedSource === 'metatrader'}
          className={
            selectedSource === 'metatrader'
              ? 'journalit-trade-sync-source is-active'
              : 'journalit-trade-sync-source'
          }
          onClick={() => selectSource('metatrader')}
        >
          {t('trade-sync.source.metatrader')}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={selectedSource === 'tradeImport'}
          className={
            selectedSource === 'tradeImport'
              ? 'journalit-trade-sync-source is-active'
              : 'journalit-trade-sync-source'
          }
          onClick={() => selectSource('tradeImport')}
        >
          {t('trade-sync.source.trade-import')}
        </button>
      </div>
      <p className="journalit-trade-sync-source-description">
        {selectedSource === 'metatrader'
          ? t('trade-sync.source.metatrader.description')
          : t('trade-sync.source.trade-import.description')}
      </p>

      {gate ??
        (selectedSource === 'metatrader' ? (
          <BackendIntegrationTab plugin={plugin} embedded />
        ) : (
          <TradeImportSyncPanel plugin={plugin} />
        ))}
    </div>
  );
};

TradeSyncTab.displayName = 'TradeSyncTab';
