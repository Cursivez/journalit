import { Notice } from 'obsidian';
import type JournalitPlugin from '../../main';
import {
  parseUpgradeFeatureContent,
  type UpgradeFeature,
} from '../../constants';
import { t } from '../../lang/helpers';
import { DeviceFlowSignInModal } from '../../components/auth/DeviceFlowSignInModal';
import { BackendSecretStorage } from '../backend/BackendSecretStorage';
import { SubscriptionTierService } from '../backend/SubscriptionTierService';

export function parseUpgradeReturnFeature(
  value: unknown
): UpgradeFeature | null {
  return parseUpgradeFeatureContent(value);
}

async function resumeUpgradeFeature(
  plugin: JournalitPlugin,
  feature: UpgradeFeature
): Promise<void> {
  switch (feature) {
    case 'csvImport':
      await plugin.viewManager.openCSVImportView();
      return;
    case 'quickTradeImport': {
      const { openQuickTradeImportModal } =
        await import('../../components/csv/QuickTradeImportModal');
      openQuickTradeImportModal(plugin);
      return;
    }
    case 'metatraderSync':
      plugin.openSettingsToTab('tradeSync');
      return;
    case 'economicCalendar':
      await plugin.viewManager.openEconomicCalendarView();
      return;
    case 'propFirmProfiles':
    case 'genericUpgradeModal':
      new Notice(t('notice.pro-access-ready'));
  }
}

async function refreshAndResume(
  plugin: JournalitPlugin,
  feature: UpgradeFeature,
  allowSignIn: boolean
): Promise<void> {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    new Notice(t('premium.gate.offline'));
    return;
  }

  const result = await new SubscriptionTierService(plugin).refreshTier(
    'upgrade return'
  );
  window.dispatchEvent(new CustomEvent('journalit:subscription-changed'));
  if (result.status === 'signed_out') {
    if (allowSignIn) {
      openSignInAndResume(plugin, feature);
    } else {
      new Notice(t('onboarding.activation.error.generic'));
    }
    return;
  }
  if (result.status !== 'premium') {
    new Notice(t('premium.gate.not-pro-yet'));
    return;
  }

  await resumeUpgradeFeature(plugin, feature);
}

async function runRefreshAndResume(
  plugin: JournalitPlugin,
  feature: UpgradeFeature,
  allowSignIn: boolean
): Promise<void> {
  try {
    await refreshAndResume(plugin, feature, allowSignIn);
  } catch (error) {
    console.error('[Journalit] Upgrade return failed:', error);
    new Notice(t('onboarding.activation.error.generic'));
  }
}

function openSignInAndResume(
  plugin: JournalitPlugin,
  feature: UpgradeFeature
): void {
  const modal = new DeviceFlowSignInModal(
    plugin.app,
    plugin,
    () => {
      void runRefreshAndResume(plugin, feature, false);
    },
    () => undefined
  );
  modal.open();
}

export async function handleUpgradeReturn(
  plugin: JournalitPlugin,
  feature: UpgradeFeature
): Promise<void> {
  if (!BackendSecretStorage.getAuthToken(plugin)) {
    openSignInAndResume(plugin, feature);
    return;
  }

  await runRefreshAndResume(plugin, feature, true);
}
