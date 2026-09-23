

import React, { useCallback, useState } from 'react';
import type JournalitPlugin from '../../../main';
import { resolveUpgradeUrl } from '../../../services/upgrade/upgradeOrigin';
import { Button } from '../../../components/ui/Button';
import ToggleSwitch from '../../../components/ui/ToggleSwitch';
import {
  CalendarRange,
  Star,
} from '../../../components/shared/icons/ObsidianIcon';
import { t } from '../../../lang/helpers';
import { eventBus } from '../../../services/events/EventBus';
import { openExternalUrl } from '../../../utils/externalLinks';
import {
  createDefaultEconomicCalendarSettings,
  ECONOMIC_CALENDAR_IMPACTS,
  ECONOMIC_CALENDAR_IMPACTS_DISPLAY_ORDER,
  type EconomicCalendarImpact,
  type EconomicCalendarSettings,
} from '../../types';
import { useBackendProEntitlement } from '../../../hooks/useBackendProEntitlement';
import { ECONOMIC_CALENDAR_CURRENCIES } from '../../../services/economicCalendar/economicCalendarScope';

const IMPACT_LABEL_KEYS = {
  high: 'view.economic-calendar.impact.high',
  medium: 'view.economic-calendar.impact.medium',
  low: 'view.economic-calendar.impact.low',
  none: 'view.economic-calendar.impact.none',
} as const;

function ensureEconomicCalendarSettings(
  plugin: JournalitPlugin
): EconomicCalendarSettings {
  if (!plugin.settings.economicCalendar) {
    plugin.settings.economicCalendar = createDefaultEconomicCalendarSettings();
  }

  return plugin.settings.economicCalendar;
}

interface EconomicCalendarSettingsSectionProps {
  plugin: JournalitPlugin;
}

export const EconomicCalendarSettingsSection: React.FC<
  EconomicCalendarSettingsSectionProps
> = ({ plugin }) => {
  const settings = ensureEconomicCalendarSettings(plugin);
  const [autoImport, setAutoImport] = useState(settings.autoImport);
  const [currencies, setCurrencies] = useState<string[]>(
    settings.defaultCurrencies
  );
  const [impacts, setImpacts] = useState<EconomicCalendarImpact[]>(
    settings.impacts
  );
  const [includeHolidays, setIncludeHolidays] = useState(
    settings.includeHolidays
  );
  const { isPro, isChecking } = useBackendProEntitlement(
    plugin,
    'economic calendar settings open'
  );
  const controlsDisabled = !isPro;

  const persist = useCallback(async (): Promise<void> => {
    await plugin.saveSettings();
    eventBus.publish('settings:changed', {
      section: 'economicCalendar',
      source: 'economic-calendar-settings',
    });
  }, [plugin]);

  const handleAutoImportChange = useCallback(
    async (value: boolean): Promise<void> => {
      ensureEconomicCalendarSettings(plugin).autoImport = value;
      setAutoImport(value);
      await persist();

      if (!value) return;

      
      
      try {
        const service =
          await plugin.serviceManager.getEconomicCalendarService();
        await service.autoImportNow();
      } catch (error) {
        console.error(
          '[EconomicCalendarSettings] Auto-import after enabling failed:',
          error
        );
      }
    },
    [persist, plugin]
  );

  const handleToggleCurrency = useCallback(
    async (currency: string): Promise<void> => {
      const current = ensureEconomicCalendarSettings(plugin);
      const next = current.defaultCurrencies.includes(currency)
        ? current.defaultCurrencies.filter((value) => value !== currency)
        : [...current.defaultCurrencies, currency];
      current.defaultCurrencies = next;
      setCurrencies(next);
      await persist();
    },
    [persist, plugin]
  );

  const handleToggleImpact = useCallback(
    async (impact: EconomicCalendarImpact): Promise<void> => {
      const current = ensureEconomicCalendarSettings(plugin);
      const selected = new Set(current.impacts);
      if (selected.has(impact)) {
        selected.delete(impact);
      } else {
        selected.add(impact);
      }
      
      const next = ECONOMIC_CALENDAR_IMPACTS.filter((candidate) =>
        selected.has(candidate)
      );
      current.impacts = next;
      setImpacts(next);
      await persist();
    },
    [persist, plugin]
  );

  const handleIncludeHolidaysChange = useCallback(
    async (value: boolean): Promise<void> => {
      ensureEconomicCalendarSettings(plugin).includeHolidays = value;
      setIncludeHolidays(value);
      await persist();
    },
    [persist, plugin]
  );

  const handleOpenView = useCallback(async (): Promise<void> => {
    await plugin.viewManager.openEconomicCalendarView();
    plugin.app.setting?.close();
  }, [plugin]);

  return (
    <section className="journalit-settings-section journalit-settings-econ">
      <h4>{t('settings.economic-calendar.title')}</h4>
      <p className="setting-item-description journalit-settings-econ__intro">
        {t('settings.economic-calendar.description')}
      </p>

      {!isPro && !isChecking && (
        <div className="journalit-settings-econ__gate">
          <span className="journalit-settings-econ__pro-tag">
            <Star size={10} aria-hidden="true" />
            {t('onboarding.features.badge.pro')}
          </span>
          <span className="journalit-settings-econ__gate-text">
            {t('settings.economic-calendar.pro-required')}
          </span>
          <button
            type="button"
            className="journalit-settings-econ__gate-cta"
            onClick={() =>
              openExternalUrl(resolveUpgradeUrl('economicCalendar'))
            }
          >
            {t('premium.gate.cta.continue-pro')}
          </button>
        </div>
      )}

      <div className="setting-item">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('settings.economic-calendar.auto-import')}
          </div>
          <div className="setting-item-description">
            {t('settings.economic-calendar.auto-import-desc')}
          </div>
        </div>
        <div className="setting-item-control">
          <ToggleSwitch
            checked={autoImport}
            onChange={handleAutoImportChange}
            id="economic-calendar-auto-import-toggle"
            ariaLabel={t('settings.economic-calendar.auto-import')}
            disabled={controlsDisabled}
          />
        </div>
      </div>

      <div className="setting-item">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('settings.economic-calendar.currencies')}
          </div>
          <div className="setting-item-description">
            {t('settings.economic-calendar.currencies-desc')}
          </div>
        </div>
        <div className="setting-item-control">
          <div
            className="journalit-settings-econ__chips"
            role="group"
            aria-label={t('settings.economic-calendar.currencies')}
          >
            {ECONOMIC_CALENDAR_CURRENCIES.map((currency) => (
              <button
                key={currency}
                type="button"
                className="journalit-settings-econ__chip"
                aria-pressed={currencies.includes(currency)}
                disabled={controlsDisabled}
                onClick={() => void handleToggleCurrency(currency)}
              >
                {currency}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="setting-item">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('settings.economic-calendar.impacts')}
          </div>
          <div className="setting-item-description">
            {impacts.length === 0
              ? t('settings.economic-calendar.impacts-empty')
              : t('settings.economic-calendar.impacts-desc')}
          </div>
        </div>
        <div className="setting-item-control">
          <div
            className="journalit-settings-econ__chips"
            role="group"
            aria-label={t('settings.economic-calendar.impacts')}
          >
            {ECONOMIC_CALENDAR_IMPACTS_DISPLAY_ORDER.map((impact) => (
              <button
                key={impact}
                type="button"
                className="journalit-settings-econ__chip"
                aria-pressed={impacts.includes(impact)}
                disabled={controlsDisabled}
                onClick={() => void handleToggleImpact(impact)}
              >
                {t(IMPACT_LABEL_KEYS[impact])}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="setting-item">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('settings.economic-calendar.include-holidays')}
          </div>
          <div className="setting-item-description">
            {t('settings.economic-calendar.include-holidays-desc')}
          </div>
        </div>
        <div className="setting-item-control">
          <ToggleSwitch
            checked={includeHolidays}
            onChange={handleIncludeHolidaysChange}
            id="economic-calendar-include-holidays-toggle"
            ariaLabel={t('settings.economic-calendar.include-holidays')}
            disabled={controlsDisabled}
          />
        </div>
      </div>

      <div className="setting-item">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('settings.economic-calendar.open-view')}
          </div>
          <div className="setting-item-description">
            {t('settings.economic-calendar.open-view-desc')}
          </div>
        </div>
        <div className="setting-item-control">
          <Button
            variant="primary"
            size="small"
            onClick={() => void handleOpenView()}
          >
            <CalendarRange size={13} aria-hidden="true" />
            {t('settings.economic-calendar.open-view')}
          </Button>
        </div>
      </div>
    </section>
  );
};

EconomicCalendarSettingsSection.displayName = 'EconomicCalendarSettingsSection';
