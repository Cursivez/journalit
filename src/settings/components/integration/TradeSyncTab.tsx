

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Notice } from 'obsidian';
import type JournalitPlugin from '../../../main';
import { t } from '../../../lang/helpers';
import { resolveUpgradeUrl } from '../../../services/upgrade/upgradeOrigin';
import { openExternalUrl } from '../../../utils/externalLinks';
import {
  readTradeSyncProviderPreference,
  writeTradeSyncProviderPreference,
} from '../../../services/tradeSync/tradeSyncProviderPreference';
import { ApiClient } from '../../../services/backend/ApiClient';
import { SubscriptionTierService } from '../../../services/backend/SubscriptionTierService';
import { DeviceFlowSignInModal } from '../../../components/auth/DeviceFlowSignInModal';
import { Button } from '../../../components/ui/Button';
import { SegmentedControl } from '../../../components/shared/SegmentedControl';
import { BackendIntegrationTab } from './BackendIntegrationTab';
import { TradeImportSyncPanel } from './TradeImportSyncPanel';
import { TradovateSyncPanel } from './TradovateSyncPanel';
import { RithmicSyncPanel } from './RithmicSyncPanel';
import { CTraderSyncPanel } from './CTraderSyncPanel';
import { CTraderBrokerSyncClient } from '../../../services/tradeSync/CTraderBrokerSyncClient';
import { getTradeProjectionOwnerId } from '../../../services/tradeSync/TradeProjectionOwnership';
import { useBackendProEntitlement } from '../../../hooks/useBackendProEntitlement';
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner';
import { Check } from '../../../components/shared/icons/ObsidianIcon';
import { useAuthRefreshRecovery } from './brokerSyncKit';

interface TradeSyncTabProps {
  plugin: JournalitPlugin;
  mode?: 'full' | 'sync' | 'accounts';
  source?: TradeSyncSource;
  displayMode?: 'default' | 'upgrade-only';
}

type TradeSyncSource =
  | 'metatrader'
  | 'tradovate'
  | 'rithmic'
  | 'ctrader'
  | 'tradeImport';

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
        <Button variant="secondary" size="large" onClick={onRefresh}>
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
  ctrader: boolean;
}


function confirmedCTraderPresenceForOwner(
  remembered: { ownerUserId: string; hasConnections: boolean } | null,
  ownerUserId: string
): boolean {
  if (!remembered || remembered.ownerUserId !== ownerUserId) return false;
  return remembered.hasConnections;
}

function useHasCTraderConnections(
  plugin: JournalitPlugin,
  active: boolean
): {
  hasConnections: boolean;
  refreshConnections: () => Promise<boolean>;
  waitForCurrentRefresh: () => Promise<boolean>;
  applyCatalogPresence: (hasConnections: boolean) => void;
} {
  const [hasConnections, setHasConnections] = useState(false);
  const client = useMemo(() => new CTraderBrokerSyncClient(), []);
  const aliveRef = useRef(true);
  const epochRef = useRef(0);
  const activeRef = useRef(active);
  const pluginRef = useRef(plugin);
  const clientRef = useRef(client);
  const runningRef = useRef<Promise<boolean> | null>(null);
  const queuedRef = useRef(false);
  const confirmedPresenceRef = useRef<{
    ownerUserId: string;
    hasConnections: boolean;
  } | null>(null);
  const lifecycleCoalesceRef = useRef(false);
  const currentOwnerUserId = getTradeProjectionOwnerId(plugin);
  useLayoutEffect(() => {
    activeRef.current = active;
    pluginRef.current = plugin;
    clientRef.current = client;
  }, [active, plugin, client]);

  const refreshConnections = useCallback((): Promise<boolean> => {
    if (!aliveRef.current) return Promise.resolve(false);
    if (!activeRef.current) {
      confirmedPresenceRef.current = null;
      setHasConnections(false);
      return Promise.resolve(false);
    }
    if (runningRef.current) {
      queuedRef.current = true;
      return runningRef.current.then(function waitForTail(result):
        | Promise<boolean>
        | boolean {
        if (runningRef.current) return runningRef.current.then(waitForTail);
        if (queuedRef.current && aliveRef.current && activeRef.current) {
          return refreshConnections();
        }
        return result;
      });
    }

    const run = (async () => {
      let result = false;
      try {
        do {
          queuedRef.current = false;
          if (!aliveRef.current || !activeRef.current) {
            result = false;
            break;
          }
          const epoch = epochRef.current;
          const requestOwnerUserId = getTradeProjectionOwnerId(
            pluginRef.current
          );
          const authSessionVersion = ApiClient.getAuthSessionVersion();
          if (
            confirmedPresenceRef.current &&
            confirmedPresenceRef.current.ownerUserId !== requestOwnerUserId
          ) {
            confirmedPresenceRef.current = null;
            setHasConnections(false);
          }
          try {
            const status = await clientRef.current.getCTraderConnections({
              interactiveEntitlement: false,
            });
            if (
              !aliveRef.current ||
              !activeRef.current ||
              epoch !== epochRef.current ||
              getTradeProjectionOwnerId(pluginRef.current) !==
                requestOwnerUserId ||
              ApiClient.getAuthSessionVersion() !== authSessionVersion
            ) {
              result = false;
              break;
            }
            result = status.connections.length > 0;
            confirmedPresenceRef.current = {
              ownerUserId: requestOwnerUserId,
              hasConnections: result,
            };
            setHasConnections(result);
          } catch {
            if (
              !aliveRef.current ||
              !activeRef.current ||
              epoch !== epochRef.current ||
              getTradeProjectionOwnerId(pluginRef.current) !==
                requestOwnerUserId ||
              ApiClient.getAuthSessionVersion() !== authSessionVersion
            ) {
              result = false;
              break;
            }
            result = confirmedCTraderPresenceForOwner(
              confirmedPresenceRef.current,
              requestOwnerUserId
            );
            setHasConnections(result);
          }
        } while (queuedRef.current && aliveRef.current && activeRef.current);
        return result;
      } finally {
        runningRef.current = null;
      }
    })();
    runningRef.current = run;
    return run;
  }, []);

  const waitForCurrentRefresh = useCallback((): Promise<boolean> => {
    if (!aliveRef.current || !activeRef.current) {
      return Promise.resolve(false);
    }
    if (!runningRef.current) {
      return Promise.resolve(
        confirmedCTraderPresenceForOwner(
          confirmedPresenceRef.current,
          getTradeProjectionOwnerId(pluginRef.current)
        )
      );
    }
    return runningRef.current.then(function waitForTail():
      | Promise<boolean>
      | boolean {
      if (!aliveRef.current || !activeRef.current) return false;
      if (runningRef.current) return runningRef.current.then(waitForTail);
      return confirmedCTraderPresenceForOwner(
        confirmedPresenceRef.current,
        getTradeProjectionOwnerId(pluginRef.current)
      );
    });
  }, []);

  const applyCatalogPresence = useCallback((nextHasConnections: boolean) => {
    if (!aliveRef.current || !activeRef.current) return;
    confirmedPresenceRef.current = {
      ownerUserId: getTradeProjectionOwnerId(pluginRef.current),
      hasConnections: nextHasConnections,
    };
    setHasConnections(nextHasConnections);
  }, []);

  useEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
      epochRef.current += 1;
      queuedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!active) {
      epochRef.current += 1;
      queuedRef.current = false;
      confirmedPresenceRef.current = null;
      setHasConnections(false);
      return;
    }
    if (
      confirmedPresenceRef.current &&
      confirmedPresenceRef.current.ownerUserId !== currentOwnerUserId
    ) {
      confirmedPresenceRef.current = null;
      setHasConnections(false);
    }
    void refreshConnections();
    return () => {
      epochRef.current += 1;
      queuedRef.current = false;
    };
  }, [active, currentOwnerUserId, refreshConnections]);

  useAuthRefreshRecovery(plugin, refreshConnections);

  useEffect(() => {
    const onLifecycleSignal = () => {
      if (lifecycleCoalesceRef.current) return;
      lifecycleCoalesceRef.current = true;
      queueMicrotask(() => {
        lifecycleCoalesceRef.current = false;
      });
      void refreshConnections();
    };
    window.addEventListener(
      'journalit:subscription-changed',
      onLifecycleSignal
    );
    window.addEventListener(
      'journalit:entitlements-refreshed',
      onLifecycleSignal
    );
    return () => {
      window.removeEventListener(
        'journalit:subscription-changed',
        onLifecycleSignal
      );
      window.removeEventListener(
        'journalit:entitlements-refreshed',
        onLifecycleSignal
      );
    };
  }, [refreshConnections]);

  return {
    hasConnections,
    refreshConnections,
    waitForCurrentRefresh,
    applyCatalogPresence,
  };
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
      onRedeem={() => openExternalUrl(resolveUpgradeUrl('metatraderSync'))}
      onRefresh={onRefresh}
    />
  );
};

EntitlementGate.displayName = 'EntitlementGate';

interface ProviderSectionProps {
  plugin: JournalitPlugin;
  mode: 'full' | 'sync' | 'accounts';
  entitlements: TradeSyncEntitlements;
  canCreateCTraderConnections: boolean;
  onCTraderCatalogLoaded: (hasConnections: boolean) => void;
  isPro: boolean;
  onRefresh: (source: TradeSyncSource) => Promise<void>;
}

type TradeSyncProvider = 'metatrader' | 'tradovate' | 'rithmic' | 'ctrader';

const ProviderSection: React.FC<ProviderSectionProps> = ({
  plugin,
  mode,
  entitlements,
  canCreateCTraderConnections,
  onCTraderCatalogLoaded,
  isPro,
  onRefresh,
}) => {
  const [provider, setProvider] = useState<TradeSyncProvider>(() =>
    readTradeSyncProviderPreference(plugin.app)
  );
  const selectProvider = (next: TradeSyncProvider) => {
    setProvider(next);
    writeTradeSyncProviderPreference(plugin.app, next);
  };
  const enabled = entitlements[provider];
  const providerScroller = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const scroller = providerScroller.current;
    if (!scroller) return;
    const revealSelection = () => {
      const selected = scroller.querySelector<HTMLButtonElement>('.is-active');
      if (!selected) return;
      const bounds = scroller.getBoundingClientRect();
      const button = selected.getBoundingClientRect();
      if (button.left < bounds.left) {
        scroller.scrollLeft += button.left - bounds.left - 4;
      } else if (button.right > bounds.right) {
        scroller.scrollLeft += button.right - bounds.right + 4;
      }
    };
    revealSelection();
    window.addEventListener('resize', revealSelection);
    return () => window.removeEventListener('resize', revealSelection);
  }, [provider]);

  return (
    <section className="journalit-trade-sync-section journalit-trade-sync-providers">
      <div
        className="journalit-trade-sync-provider-scroller"
        ref={providerScroller}
      >
        <SegmentedControl
          className="journalit-trade-sync-provider-switcher"
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
            {
              value: 'ctrader',
              label: t('trade-sync.source.ctrader'),
            },
          ]}
          value={provider}
          onChange={selectProvider}
        />
      </div>
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
        ) : provider === 'rithmic' ? (
          <RithmicSyncPanel plugin={plugin} />
        ) : (
          <CTraderSyncPanel
            plugin={plugin}
            canCreateConnections={canCreateCTraderConnections}
            onCatalogLoaded={onCTraderCatalogLoaded}
          />
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
  canCreateCTraderConnections: boolean;
  onCTraderCatalogLoaded: (hasConnections: boolean) => void;
  isPro: boolean;
  onRefresh: () => Promise<void>;
}

const FocusedTradeSyncContent: React.FC<FocusedTradeSyncContentProps> = ({
  plugin,
  mode,
  source,
  enabled,
  canCreateCTraderConnections,
  onCTraderCatalogLoaded,
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
            : source === 'ctrader'
              ? t('trade-sync.source.ctrader.description')
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
      ) : source === 'ctrader' ? (
        <CTraderSyncPanel
          plugin={plugin}
          canCreateConnections={canCreateCTraderConnections}
          onCatalogLoaded={onCTraderCatalogLoaded}
        />
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
  const {
    isFeatureEnabled: canUseCTraderSync,
    isChecking: isCheckingCTraderEntitlement,
  } = useBackendProEntitlement(
    plugin,
    'ctrader sync settings open',
    'ctraderSync'
  );
  const {
    hasConnections: hasCTraderConnections,
    refreshConnections,
    waitForCurrentRefresh,
    applyCatalogPresence,
  } = useHasCTraderConnections(plugin, isAuthenticated);
  
  
  
  const canUseCTraderPanel =
    canUseCTraderSync || (isPro && hasCTraderConnections);

  const selectedSourceEnabled = source
    ? source === 'metatrader'
      ? canUseMetatraderSync
      : source === 'tradovate'
        ? isPro
        : source === 'rithmic'
          ? canUseRithmicSync
          : source === 'ctrader'
            ? canUseCTraderPanel
            : canUseTradeImportSync
    : true;
  const isCheckingSelectedEntitlement = source
    ? source === 'tradeImport'
      ? isCheckingTradeImportEntitlement
      : source === 'rithmic'
        ? isCheckingRithmicEntitlement
        : source === 'ctrader'
          ? isCheckingCTraderEntitlement
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
    openExternalUrl(resolveUpgradeUrl('metatraderSync'));
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
      const hasCTraderConnectionsNow =
        result.status === 'unverified'
          ? await refreshConnections()
          : await waitForCurrentRefresh();

      const selectedSource = refreshSource ?? source;
      const selectedFeatureEnabled =
        selectedSource === 'metatrader'
          ? result.entitlements?.features.metatraderSync.enabled === true
          : selectedSource === 'tradovate'
            ? result.status === 'premium'
            : selectedSource === 'rithmic'
              ? result.entitlements?.features.rithmicSync.enabled === true
              : selectedSource === 'ctrader'
                ? result.entitlements?.features.ctraderSync?.enabled === true ||
                  ((result.status === 'premium' ||
                    (result.status === 'unverified' && isPro)) &&
                    hasCTraderConnectionsNow)
                : result.entitlements?.features.tradeImport.enabled === true;

      if (!selectedFeatureEnabled) {
        new Notice(
          result.status === 'premium'
            ? t('trade-sync.gate.feature-unavailable.description')
            : t('premium.gate.not-pro-yet')
        );
      }
    },
    [
      isAuthenticated,
      isPro,
      plugin,
      refreshConnections,
      source,
      waitForCurrentRefresh,
    ]
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
          canCreateCTraderConnections={canUseCTraderSync}
          onCTraderCatalogLoaded={applyCatalogPresence}
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
            ctrader: canUseCTraderPanel,
          }}
          canCreateCTraderConnections={canUseCTraderSync}
          onCTraderCatalogLoaded={applyCatalogPresence}
          isPro={isPro}
          onRefresh={handleRefresh}
        />
      )}
    </div>
  );
};

TradeSyncTab.displayName = 'TradeSyncTab';
