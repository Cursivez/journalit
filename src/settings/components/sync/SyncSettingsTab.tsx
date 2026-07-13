

import React, { useCallback, useState, useSyncExternalStore } from 'react';
import type JournalitPlugin from '../../../main';
import { t } from '../../../lang/helpers';
import { BackendSecretStorage } from '../../../services/backend/BackendSecretStorage';
import { AuthTab } from '../accounts/AuthTab';
import { TradeSyncTab } from '../integration/TradeSyncTab';
import { SyncNotificationSettingsSection } from '../general/GeneralTab';

interface SyncSettingsTabProps {
  plugin: JournalitPlugin;
  initialSection?: SyncSettingsSection;
}

type SyncSettingsSection = 'account' | 'metatrader' | 'tradeImport';

const METATRADER_SOURCE = 'metatrader';
const TRADE_IMPORT_SOURCE = 'tradeImport';

export const SyncSettingsTab: React.FC<SyncSettingsTabProps> = ({
  plugin,
  initialSection = 'metatrader',
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
      {!isAuthenticated ? (
        <TradeSyncTab plugin={plugin} source={METATRADER_SOURCE} />
      ) : (
        <>
          <nav className="settings-tab-nav journalit-settings-subnav">
            <button
              type="button"
              className={`journalit-button journalit-settings-tab-button settings-tab-button ${activeSection === 'account' ? 'settings-tab-button--active' : ''}`}
              onClick={() => selectSection('account')}
            >
              {t('settings.tab.accounts')}
            </button>
            <button
              type="button"
              className={`journalit-button journalit-settings-tab-button settings-tab-button ${activeSection === 'metatrader' ? 'settings-tab-button--active' : ''}`}
              onClick={() => selectSection('metatrader')}
            >
              {t('trade-sync.source.metatrader')}
            </button>
            <button
              type="button"
              className={`journalit-button journalit-settings-tab-button settings-tab-button ${activeSection === 'tradeImport' ? 'settings-tab-button--active' : ''}`}
              onClick={() => selectSection('tradeImport')}
            >
              {t('trade-sync.source.trade-import')}
            </button>
          </nav>

          {activeSection === 'account' && <AuthTab plugin={plugin} />}
          {activeSection === 'metatrader' && (
            <>
              <TradeSyncTab plugin={plugin} source={METATRADER_SOURCE} />
              <SyncNotificationSettingsSection plugin={plugin} />
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
