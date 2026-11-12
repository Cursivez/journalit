

import React, { useCallback, useSyncExternalStore } from 'react';
import type JournalitPlugin from '../../../main';
import { BackendSecretStorage } from '../../../services/backend/BackendSecretStorage';
import { TradeSyncTab } from '../integration/TradeSyncTab';
import { SyncNotificationSettingsSection } from '../general/GeneralTab';
import { AgentAccessSettingsSection } from './AgentAccessSettingsSection';

interface SyncSettingsTabProps {
  plugin: JournalitPlugin;
  section: SyncSettingsSection;
}

type SyncSettingsSection = 'brokerSync' | 'tradeImport' | 'mcpAccess';

const METATRADER_SOURCE = 'metatrader';
const TRADE_IMPORT_SOURCE = 'tradeImport';

export const SyncSettingsTab: React.FC<SyncSettingsTabProps> = ({
  plugin,
  section,
}) => {
  const subscribeToAuthentication = useCallback((onStoreChange: () => void) => {
    window.addEventListener('journalit:subscription-changed', onStoreChange);
    return () => {
      window.removeEventListener(
        'journalit:subscription-changed',
        onStoreChange
      );
    };
  }, []);
  const getAuthenticationSnapshot = useCallback(
    () => BackendSecretStorage.hasAuthToken(plugin),
    [plugin]
  );
  const isAuthenticated = useSyncExternalStore(
    subscribeToAuthentication,
    getAuthenticationSnapshot,
    getAuthenticationSnapshot
  );
  const getSubscriptionTierSnapshot = useCallback(
    () => plugin.settings.backendIntegration?.subscriptionTier ?? '',
    [plugin]
  );
  const subscriptionTier = useSyncExternalStore(
    subscribeToAuthentication,
    getSubscriptionTierSnapshot,
    getSubscriptionTierSnapshot
  );
  const isPaidSubscriber = ['pro', 'premium', 'enterprise'].includes(
    subscriptionTier.toLowerCase()
  );
  
  const shouldShowNotifications = isPaidSubscriber;

  return (
    <div className="journalit-settings-tab sync-settings">
      {!isAuthenticated ? (
        <TradeSyncTab plugin={plugin} source={METATRADER_SOURCE} />
      ) : (
        <>
          {section === 'brokerSync' && (
            <>
              <TradeSyncTab plugin={plugin} />
              {shouldShowNotifications && (
                <SyncNotificationSettingsSection plugin={plugin} />
              )}
            </>
          )}
          {section === 'tradeImport' && (
            <TradeSyncTab plugin={plugin} source={TRADE_IMPORT_SOURCE} />
          )}
          {section === 'mcpAccess' && (
            <AgentAccessSettingsSection plugin={plugin} />
          )}
        </>
      )}
    </div>
  );
};

SyncSettingsTab.displayName = 'SyncSettingsTab';
