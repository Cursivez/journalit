import React, { useState } from 'react';
import ToggleSwitch from '../../../components/ui/ToggleSwitch';
import { t } from '../../../lang/helpers';
import type JournalitPlugin from '../../../main';
import { createDefaultBackendIntegrationSettings } from '../../types';


export function UpdateNotificationSettingsSection({
  plugin,
}: {
  plugin: JournalitPlugin;
}) {
  const [settings, setSettings] = useState(() => ({
    showUpdateNotifications:
      plugin.settings.backendIntegration?.showUpdateNotifications ?? true,
    showAvailableUpdateNotifications:
      plugin.settings.backendIntegration?.showAvailableUpdateNotifications ??
      true,
  }));

  const save = async (key: keyof typeof settings, value: boolean) => {
    const backend = (plugin.settings.backendIntegration ??=
      createDefaultBackendIntegrationSettings());
    backend[key] = value;
    await plugin.saveSettings();
    plugin.updateNotificationService?.handleNotificationSettingChanged();
    setSettings((current) => ({ ...current, [key]: value }));
  };

  return (
    <section className="journalit-settings-section">
      <h4>{t('settings.general.notification-settings')}</h4>
      <div className="setting-item">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('settings.general.update-notifications')}
          </div>
          <div className="setting-item-description">
            {t('settings.general.update-notifications-desc')}
          </div>
        </div>
        <div className="setting-item-control">
          <ToggleSwitch
            checked={settings.showUpdateNotifications}
            onChange={(value) => save('showUpdateNotifications', value)}
            id="show-update-notifications-toggle"
            ariaLabel={t('settings.general.update-notifications-aria')}
          />
        </div>
      </div>
      <div className="setting-item">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('settings.general.available-update-notifications')}
          </div>
          <div className="setting-item-description">
            {t('settings.general.available-update-notifications-desc')}
          </div>
        </div>
        <div className="setting-item-control">
          <ToggleSwitch
            checked={settings.showAvailableUpdateNotifications}
            disabled={!settings.showUpdateNotifications}
            onChange={(value) =>
              save('showAvailableUpdateNotifications', value)
            }
            id="show-available-update-notifications-toggle"
            ariaLabel={t('settings.general.available-update-notifications')}
          />
        </div>
      </div>
    </section>
  );
}
