

import React, { useCallback, useState, useSyncExternalStore } from 'react';
import type JournalitPlugin from '../../../main';
import { t } from '../../../lang/helpers';
import { BackendSecretStorage } from '../../../services/backend/BackendSecretStorage';
import { AuthTab } from '../accounts/AuthTab';
import { TradeSyncTab } from '../integration/TradeSyncTab';
import { SyncNotificationSettingsSection } from '../general/GeneralTab';
import { EconomicCalendarSettingsSection } from '../economicCalendar/EconomicCalendarSettingsSection';

interface SyncSettingsTabProps {
  plugin: JournalitPlugin;
  initialSection?: SyncSettingsSection;
  
  isNativeSubPage?: boolean;
}

type SyncSettingsSection = 'brokerSync' | 'tradeImport';

const METATRADER_SOURCE = 'metatrader';
const TRADE_IMPORT_SOURCE = 'tradeImport';

export const SyncSettingsTab: React.FC<SyncSettingsTabProps> = ({
  plugin,
  initialSection = 'brokerSync',
  isNativeSubPage = false,
}) => {
  const showSectionTabs = !isNativeSubPage;
  const showAccountCard = !isNativeSubPage;
  const showEconomicCalendar = !isNativeSubPage;
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
  const [sectionState, setSectionState] = useState(() => ({
    initialSection,
    activeSection: initialSection,
  }));
  const activeSection =
    sectionState.initialSection === initialSection
      ? sectionState.activeSection
      : initialSection;

  const selectSection = (section: SyncSettingsSection) => {
    setSectionState({ initialSection, activeSection: section });
  };

  return (
    <div className="journalit-settings-tab sync-settings">
      {showAccountCard && <AuthTab plugin={plugin} />}
      {!isAuthenticated ? (
        <TradeSyncTab plugin={plugin} source={METATRADER_SOURCE} />
      ) : (
        <>
          {showSectionTabs && (
            <nav className="settings-tab-nav journalit-settings-subnav">
              <button
                type="button"
                className={`journalit-button journalit-settings-tab-button settings-tab-button ${activeSection === 'brokerSync' ? 'settings-tab-button--active' : ''}`}
                onClick={() => selectSection('brokerSync')}
              >
                {t('trade-sync.providers.title')}
              </button>
              <button
                type="button"
                className={`journalit-button journalit-settings-tab-button settings-tab-button ${activeSection === 'tradeImport' ? 'settings-tab-button--active' : ''}`}
                onClick={() => selectSection('tradeImport')}
              >
                {t('trade-sync.source.trade-import')}
              </button>
            </nav>
          )}

          {activeSection === 'brokerSync' && (
            <>
              <TradeSyncTab plugin={plugin} />
              {shouldShowNotifications && (
                <SyncNotificationSettingsSection plugin={plugin} />
              )}
              {showEconomicCalendar && (
                <EconomicCalendarSettingsSection plugin={plugin} />
              )}
            </>
          )}
          {activeSection === 'tradeImport' && (
            <TradeSyncTab plugin={plugin} source={TRADE_IMPORT_SOURCE} />
          )}
        </>
      )}
    </div>
  );
};

SyncSettingsTab.displayName = 'SyncSettingsTab';
