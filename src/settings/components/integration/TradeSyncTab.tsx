

import React, { useCallback, useState } from 'react';
import { Notice } from 'obsidian';
import type JournalitPlugin from '../../../main';
import { t } from '../../../lang/helpers';
import { UPGRADE_URLS } from '../../../constants';
import { openExternalUrl } from '../../../utils/externalLinks';
import { SubscriptionTierService } from '../../../services/backend/SubscriptionTierService';
import { DeviceFlowSignInModal } from '../../../components/auth/DeviceFlowSignInModal';
import { Button } from '../../../components/ui/Button';
import { SegmentedControl } from '../../../components/shared/SegmentedControl';
import { BackendIntegrationTab } from './BackendIntegrationTab';
import { TradeImportSyncPanel } from './TradeImportSyncPanel';
import { TradovateSyncPanel } from './TradovateSyncPanel';
import { RithmicSyncPanel } from './RithmicSyncPanel';
import { useBackendProEntitlement } from '../../../hooks/useBackendProEntitlement';
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner';
import { Check } from '../../../components/shared/icons/ObsidianIcon';

interface TradeSyncTabProps {
  plugin: JournalitPlugin;
  mode?: 'full' | 'sync' | 'accounts';
  source?: TradeSyncSource;
  displayMode?: 'default' | 'upgrade-only';
}

type TradeSyncSource = 'metatrader' | 'tradovate' | 'rithmic' | 'tradeImport';

interface TrialOfferProps {
  onRedeem: () => void;
  onRefresh?: () => Promise<void>;
  onSignIn?: () => void;
}

interface FeatureUnavailableProps {
  onRefresh: () => Promise<void>;
}

const TrialOffer: React.FC<TrialOfferProps> = ({
  onRedeem,
  onRefresh,
  onSignIn,
}) => (
  <section
    className="journalit-trade-sync-trial"
    aria-labelledby="journalit-trade-sync-trial-title"
  >
    <div className="journalit-trade-sync-trial-copy">
      <h3 id="journalit-trade-sync-trial-title">
        {t('trade-sync.trial.title')}
      </h3>
      <p>{t('trade-sync.trial.description')}</p>
    </div>
    <ul className="journalit-trade-sync-trial-benefits">
      <li>
        <span aria-hidden="true">
          <Check size={16} />
        </span>
        {t('trade-sync.trial.benefit.sync')}
      </li>
      <li>
        <span aria-hidden="true">
          <Check size={16} />
        </span>
        {t('trade-sync.trial.benefit.import')}
      </li>
    </ul>
    <div className="journalit-trade-sync-trial-actions">
      <Button variant="primary" size="large" onClick={onRedeem}>
        {t('trade-sync.trial.cta')}
      </Button>
      {onRefresh && (
        <Button variant="secondary" onClick={onRefresh}>
          {t('premium.gate.cta.refresh')}
        </Button>
      )}
    </div>
    {onSignIn && (
      <button
        type="button"
        className="journalit-trade-sync-trial-signin"
        onClick={onSignIn}
      >
        {t('trade-sync.trial.existing-subscriber')}
      </button>
    )}
    <p className="journalit-trade-sync-trial-eligibility">
      {t('trade-sync.trial.eligibility')}
    </p>
  </section>
);

TrialOffer.displayName = 'TrialOffer';

const FeatureUnavailable: React.FC<FeatureUnavailableProps> = ({
  onRefresh,
}) => (
  <div className="setting-item">
    <div className="setting-item-info">
      <div className="setting-item-name">
        {t('trade-sync.gate.feature-unavailable.title')}
      </div>
      <div className="setting-item-description">
        {t('trade-sync.gate.feature-unavailable.description')}
      </div>
    </div>
    <div className="setting-item-control">
      <Button variant="secondary" onClick={onRefresh}>
        {t('premium.gate.cta.refresh')}
      </Button>
    </div>
  </div>
);

FeatureUnavailable.displayName = 'FeatureUnavailable';

interface TradeSyncEntitlements {
  metatrader: boolean;
  tradovate: boolean;
  rithmic: boolean;
}

interface EntitlementGateProps {
  enabled: boolean;
  isPro: boolean;
  onRefresh: () => Promise<void>;
}

const EntitlementGate: React.FC<EntitlementGateProps> = ({
  enabled,
  isPro,
  onRefresh,
}) => {
  if (enabled) return null;
  return isPro ? (
    <FeatureUnavailable onRefresh={onRefresh} />
  ) : (
    <TrialOffer
      onRedeem={() => openExternalUrl(UPGRADE_URLS.metatraderSync)}
      onRefresh={onRefresh}
    />
  );
};

EntitlementGate.displayName = 'EntitlementGate';

interface ProviderSectionProps {
  plugin: JournalitPlugin;
  mode: 'full' | 'sync' | 'accounts';
  entitlements: TradeSyncEntitlements;
  isPro: boolean;
  onRefresh: (source: TradeSyncSource) => Promise<void>;
}

type TradeSyncProvider = 'metatrader' | 'tradovate' | 'rithmic';

const PROVIDER_STORAGE_KEY = 'journalit:trade-sync-provider';

const ProviderSection: React.FC<ProviderSectionProps> = ({
  plugin,
  mode,
  entitlements,
  isPro,
  onRefresh,
}) => {
  const [provider, setProvider] = useState<TradeSyncProvider>(() => {
    const storedProvider: unknown =
      plugin.app.loadLocalStorage(PROVIDER_STORAGE_KEY);
    if (storedProvider === 'tradovate') return 'tradovate';
    if (storedProvider === 'rithmic') return 'rithmic';
    return 'metatrader';
  });
  const selectProvider = (next: TradeSyncProvider) => {
    setProvider(next);
    plugin.app.saveLocalStorage(PROVIDER_STORAGE_KEY, next);
  };
  const enabled = entitlements[provider];

  return (
    <section className="journalit-trade-sync-section journalit-trade-sync-providers">
      <SegmentedControl
        options={[
          {
            value: 'metatrader',
            label: t('trade-sync.source.metatrader'),
          },
          {
            value: 'tradovate',
            label: t('trade-sync.source.tradovate'),
          },
          {
            value: 'rithmic',
            label: t('trade-sync.source.rithmic'),
          },
        ]}
        value={provider}
        onChange={selectProvider}
      />
      <EntitlementGate
        enabled={enabled}
        isPro={isPro}
        onRefresh={() => onRefresh(provider)}
      />
      {enabled &&
        (provider === 'metatrader' ? (
          <BackendIntegrationTab plugin={plugin} embedded contentMode={mode} />
        ) : provider === 'tradovate' ? (
          <TradovateSyncPanel plugin={plugin} />
        ) : (
          <RithmicSyncPanel plugin={plugin} />
        ))}
    </section>
  );
};

ProviderSection.displayName = 'ProviderSection';

interface FocusedTradeSyncContentProps {
  plugin: JournalitPlugin;
  mode: 'full' | 'sync' | 'accounts';
  source: TradeSyncSource;
  enabled: boolean;
  isPro: boolean;
  onRefresh: () => Promise<void>;
}

const FocusedTradeSyncContent: React.FC<FocusedTradeSyncContentProps> = ({
  plugin,
  mode,
  source,
  enabled,
  isPro,
  onRefresh,
}) => (
  <>
    <p className="journalit-trade-sync-source-description">
      {source === 'metatrader'
        ? t('trade-sync.source.metatrader.description')
        : source === 'tradovate'
          ? t('trade-sync.source.tradovate.description')
          : source === 'rithmic'
            ? t('trade-sync.source.rithmic.description')
            : t('trade-sync.source.trade-import.description')}
    </p>
    <EntitlementGate enabled={enabled} isPro={isPro} onRefresh={onRefresh} />
    {enabled &&
      (source === 'metatrader' ? (
        <BackendIntegrationTab plugin={plugin} embedded contentMode={mode} />
      ) : source === 'tradovate' ? (
        <TradovateSyncPanel plugin={plugin} />
      ) : source === 'rithmic' ? (
        <RithmicSyncPanel plugin={plugin} />
      ) : (
        <TradeImportSyncPanel plugin={plugin} />
      ))}
  </>
);

FocusedTradeSyncContent.displayName = 'FocusedTradeSyncContent';

export const TradeSyncTab: React.FC<TradeSyncTabProps> = ({
  plugin,
  mode = 'full',
  source,
  displayMode = 'default',
}) => {
  const {
    isAuthenticated,
    isPro,
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
  const {
    isFeatureEnabled: canUseRithmicSync,
    isChecking: isCheckingRithmicEntitlement,
  } = useBackendProEntitlement(
    plugin,
    'rithmic sync settings open',
    'rithmicSync'
  );

  const selectedSourceEnabled = source
    ? source === 'metatrader'
      ? canUseMetatraderSync
      : source === 'tradovate'
        ? isPro
        : source === 'rithmic'
          ? canUseRithmicSync
          : canUseTradeImportSync
    : true;
  const isCheckingSelectedEntitlement = source
    ? source === 'tradeImport'
      ? isCheckingTradeImportEntitlement
      : source === 'rithmic'
        ? isCheckingRithmicEntitlement
        : isCheckingMetatraderEntitlement
    : isCheckingMetatraderEntitlement;

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
    openExternalUrl(UPGRADE_URLS.metatraderSync);
  };

  const handleRefresh = useCallback(
    async (refreshSource?: TradeSyncSource) => {
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

      const selectedSource = refreshSource ?? source;
      const selectedFeatureEnabled =
        selectedSource === 'metatrader'
          ? result.entitlements?.features.metatraderSync.enabled === true
          : selectedSource === 'tradovate'
            ? result.status === 'premium'
            : selectedSource === 'rithmic'
              ? result.entitlements?.features.rithmicSync.enabled === true
              : result.entitlements?.features.tradeImport.enabled === true;

      if (!selectedFeatureEnabled) {
        new Notice(
          result.status === 'premium'
            ? t('trade-sync.gate.feature-unavailable.description')
            : t('premium.gate.not-pro-yet')
        );
      }
    },
    [isAuthenticated, plugin, source]
  );

  if (!isAuthenticated) {
    return (
      <div className="journalit-settings-tab backend-integration-settings">
        <TrialOffer onRedeem={handleUpgrade} onSignIn={handleSignIn} />
      </div>
    );
  }

  if (displayMode === 'upgrade-only') {
    return (
      <div className="journalit-settings-tab backend-integration-settings">
        <TrialOffer
          onRedeem={handleUpgrade}
          onRefresh={() => handleRefresh(source)}
        />
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

  return (
    <div className="journalit-settings-tab backend-integration-settings">
      {source ? (
        <FocusedTradeSyncContent
          plugin={plugin}
          mode={mode}
          source={source}
          enabled={selectedSourceEnabled}
          isPro={isPro}
          onRefresh={() => handleRefresh(source)}
        />
      ) : (
        <ProviderSection
          plugin={plugin}
          mode={mode}
          entitlements={{
            metatrader: canUseMetatraderSync,
            tradovate: isPro,
            rithmic: canUseRithmicSync,
          }}
          isPro={isPro}
          onRefresh={handleRefresh}
        />
      )}
    </div>
  );
};

TradeSyncTab.displayName = 'TradeSyncTab';
