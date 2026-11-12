

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Notice, setTooltip } from 'obsidian';
import JournalitPlugin from '../../../main';
import { Button } from '../../../components/ui/Button';
import { DeviceFlowSignInModal } from '../../../components/auth/DeviceFlowSignInModal';
import { SupportActions } from '../../../components/shared/SupportActions';
import { BackendSecretStorage } from '../../../services/backend/BackendSecretStorage';
import { TokenManager } from '../../../services/backend/TokenManager';
import { SubscriptionTierService } from '../../../services/backend/SubscriptionTierService';
import {
  SupportErrorDetails,
  buildSupportReport,
  formatSupportErrorDetails,
} from '../../../utils/supportReport';
import { t } from '../../../lang/helpers';
import { openExternalUrl } from '../../../utils/externalLinks';
import { writeClipboardText } from '../../../utils/clipboard';
import { JOURNALIT_SETTINGS_RESOURCES } from '../../settingsResources';
import { AccountPaymentRecoveryBanner } from '../../../components/auth/AccountPaymentRecoveryBanner';
import { openUpgradeModal } from '../../../components/modals/UpgradeModal';
import type { UpgradeFeature } from '../../../constants';
import {
  Check,
  ExternalLink,
  Lock,
} from '../../../components/shared/icons/ObsidianIcon';

const MANAGE_SUBSCRIPTION_URL = 'https://journalit.co/dashboard';

interface AuthTabProps {
  plugin: JournalitPlugin;
}

function isAuthErrorDetail(
  value: unknown
): value is SupportErrorDetails & { occurrences?: number } {
  return value !== null && typeof value === 'object' && 'message' in value;
}

type PlanKind = 'pro' | 'enterprise' | 'free' | 'unknown';

function planKind(tierName: string): PlanKind {
  switch (tierName.toLowerCase()) {
    case 'pro':
    case 'premium':
      return 'pro';
    case 'enterprise':
      return 'enterprise';
    case 'free':
      return 'free';
    default:
      return 'unknown';
  }
}


function planLabel(tierName: string): string {
  switch (planKind(tierName)) {
    case 'pro':
      return 'Pro';
    case 'enterprise':
      return 'Enterprise';
    case 'free':
      return 'Free';
    case 'unknown':
      return tierName.charAt(0).toUpperCase() + tierName.slice(1);
  }
}

function useAuthTabModel({ plugin }: AuthTabProps) {
  const [authState, setAuthState] = useState(() => ({
    isAuthenticated: BackendSecretStorage.hasAuthToken(plugin),
    tier: plugin.settings.backendIntegration?.subscriptionTier,
    userEmail: plugin.settings.backendIntegration?.userEmail,
    signOutError: null as SupportErrorDetails | null,
    authError: null as SupportErrorDetails | null,
    signOutReportCopied: false,
  }));
  const {
    isAuthenticated,
    tier,
    userEmail,
    signOutError,
    authError,
    signOutReportCopied,
  } = authState;
  const signOutCopyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const handleSubscriptionChange = () => {
      setAuthState({
        isAuthenticated: BackendSecretStorage.hasAuthToken(plugin),
        tier: plugin.settings.backendIntegration?.subscriptionTier,
        userEmail: plugin.settings.backendIntegration?.userEmail,
        signOutError: null,
        authError: null,
        signOutReportCopied: false,
      });
    };

    window.addEventListener(
      'journalit:subscription-changed',
      handleSubscriptionChange
    );

    return () => {
      window.removeEventListener(
        'journalit:subscription-changed',
        handleSubscriptionChange
      );
    };
  }, [plugin]);

  useEffect(() => {
    const handleAuthError = (event: Event) => {
      const detail: unknown =
        event instanceof CustomEvent ? event.detail : undefined;
      if (!isAuthErrorDetail(detail)) {
        return;
      }

      setAuthState((current) => ({
        ...current,
        authError: (detail.occurrences ?? 0) >= 2 ? detail : null,
        signOutReportCopied: false,
      }));
    };

    const listenerDocument = window.activeDocument;
    listenerDocument.addEventListener('journalit:auth-error', handleAuthError);

    return () => {
      listenerDocument.removeEventListener(
        'journalit:auth-error',
        handleAuthError
      );
    };
  }, []);

  
  
  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    void new SubscriptionTierService(plugin).refreshTier('account tab open');
  }, [isAuthenticated, plugin]);

  useEffect(() => {
    return () => {
      if (signOutCopyTimerRef.current) {
        window.clearTimeout(signOutCopyTimerRef.current);
      }
    };
  }, []);

  const buildSignOutReport = useCallback(() => {
    const backendUrl =
      plugin.settings.backendIntegration?.serverUrl || 'Unknown';
    const pluginVersion = plugin.manifest?.version || 'Unknown';
    const activeError = signOutError ?? authError;
    const statusLine = signOutError
      ? 'Status: Sign-out failed'
      : 'Status: Session expired';
    const details = activeError
      ? formatSupportErrorDetails(activeError)
      : ['Message: Unknown'];

    return buildSupportReport('Journalit Auth Report', [
      statusLine,
      `User email: ${userEmail || 'Unknown'}`,
      `Tier: ${tier || 'Unknown'}`,
      `Backend URL: ${backendUrl}`,
      `Plugin version: ${pluginVersion}`,
      `Time: ${new Date().toISOString()}`,
      '',
      'Error Details',
      ...details,
    ]);
  }, [authError, plugin, signOutError, tier, userEmail]);

  const handleCopySignOutReport = useCallback(async () => {
    const report = buildSignOutReport();

    try {
      await writeClipboardText(report);
      setAuthState((current) => ({
        ...current,
        signOutReportCopied: true,
      }));

      if (signOutCopyTimerRef.current) {
        window.clearTimeout(signOutCopyTimerRef.current);
      }

      signOutCopyTimerRef.current = window.setTimeout(() => {
        setAuthState((current) => ({
          ...current,
          signOutReportCopied: false,
        }));
      }, 2000);
    } catch {
      new Notice(t('library.error.copy-failed'));
    }
  }, [buildSignOutReport]);

  const handleDeviceFlowSignIn = () => {
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
  };

  const handleDeviceFlowSignOut = async () => {
    try {
      try {
        await new TokenManager(plugin).revokeRefreshSession();
      } catch (error) {
        
        
        console.warn('[AuthTab] Backend session revocation failed:', error);
      }

      if (plugin.settings.backendIntegration) {
        BackendSecretStorage.clearAuthToken(plugin);
        plugin.settings.backendIntegration.userEmail = undefined;
        plugin.settings.backendIntegration.subscriptionTier = undefined;
        plugin.settings.backendIntegration.userId = '';
        plugin.settings.backendIntegration.authenticatedAccountId = undefined;
        await plugin.saveSettings();
      }
      window.dispatchEvent(new CustomEvent('journalit:subscription-changed'));

      new Notice(t('notice.logout-success'));
      setAuthState((current) => ({
        ...current,
        signOutError: null,
        authError: null,
        signOutReportCopied: false,
      }));
    } catch (error) {
      console.error('[AuthTab] Sign-out failed:', error);
      new Notice(t('notice.error.sign-out'));

      const message =
        error instanceof Error ? error.message : t('common.error');
      setAuthState((current) => ({
        ...current,
        signOutError: {
          message,
          operation: 'sign out',
          timestamp: new Date().toISOString(),
        },
      }));
    }
  };

  const activeError = signOutError ?? authError;
  const activeErrorTitle = signOutError
    ? t('notice.error.sign-out')
    : t('error.session-expired');

  return {
    isAuthenticated,
    tier,
    userEmail,
    signOutReportCopied,
    handleCopySignOutReport,
    handleDeviceFlowSignIn,
    handleDeviceFlowSignOut,
    activeError,
    activeErrorTitle,
  };
}


const PRO_FEATURE_KEYS = [
  'settings.auth.feature.csv-import',
  'settings.auth.feature.ai-mapping',
  'settings.auth.feature.trade-sync',
  'settings.auth.feature.economic-calendar',
  'settings.auth.feature.ai-tool-calls-pro',
] as const;

const FREE_FEATURE_KEYS = [
  'settings.auth.feature.basic-tracking',
  'settings.auth.feature.manual-entry',
  'settings.auth.feature.analytics-reviews',
  'settings.auth.feature.ai-tool-calls-free',
] as const;

type ProFeatureKey = (typeof PRO_FEATURE_KEYS)[number];

type FeatureKey =
  | ProFeatureKey
  | (typeof FREE_FEATURE_KEYS)[number]
  | 'settings.auth.feature.priority-support';


const PRO_FEATURE_UPGRADE: Record<ProFeatureKey, UpgradeFeature> = {
  'settings.auth.feature.csv-import': 'csvImport',
  'settings.auth.feature.ai-mapping': 'csvImport',
  'settings.auth.feature.trade-sync': 'metatraderSync',
  'settings.auth.feature.economic-calendar': 'economicCalendar',
  'settings.auth.feature.ai-tool-calls-pro': 'genericUpgradeModal',
};

interface PlanSummary {
  title: string;
  included: readonly FeatureKey[];
  locked: readonly ProFeatureKey[];
}

function planSummary(tierName: string): PlanSummary {
  switch (planKind(tierName)) {
    case 'pro':
      return {
        title: t('settings.auth.plan-includes-pro'),
        included: PRO_FEATURE_KEYS,
        locked: [],
      };
    case 'enterprise':
      return {
        title: t('settings.auth.plan-includes-enterprise'),
        
        
        included: [
          ...PRO_FEATURE_KEYS.filter(
            (key) => key !== 'settings.auth.feature.ai-tool-calls-pro'
          ),
          'settings.auth.feature.priority-support',
        ],
        locked: [],
      };
    case 'free':
      return {
        title: t('settings.auth.plan-includes-free'),
        included: FREE_FEATURE_KEYS,
        locked: PRO_FEATURE_KEYS,
      };
    case 'unknown':
      return { title: t('settings.auth.your-plan'), included: [], locked: [] };
  }
}

const AccountPlan: React.FC<{ plugin: JournalitPlugin; tier: string }> = ({
  plugin,
  tier,
}) => {
  const { title, included, locked } = planSummary(tier);
  const openUpgrade = (feature: ProFeatureKey | null) =>
    openUpgradeModal({
      app: plugin.app,
      plugin,
      featureName: feature ? t(feature) : 'Pro',
      feature: feature ? PRO_FEATURE_UPGRADE[feature] : 'genericUpgradeModal',
      message: feature ? undefined : t('upgrade.plan-message'),
    });

  return (
    <div className="journalit-account-card__plan">
      <div className="journalit-account-card__plan-head">
        <span className="journalit-account-card__plan-title">{title}</span>
        <div className="journalit-account-card__plan-actions">
          <Button
            variant="secondary"
            size="small"
            onClick={() => openExternalUrl(MANAGE_SUBSCRIPTION_URL)}
          >
            {t('settings.auth.manage-subscription')}
            <ExternalLink size={14} />
          </Button>
          {locked.length > 0 && (
            <Button
              variant="primary"
              size="small"
              onClick={() => openUpgrade(null)}
            >
              {t('upgrade.title')}
            </Button>
          )}
        </div>
      </div>
      {included.length + locked.length > 0 && (
        <ul className="journalit-account-card__features">
          {included.map((key) => (
            <li key={key} className="journalit-account-card__feature">
              <Check size={14} />
              {t(key)}
            </li>
          ))}
          {locked.map((key) => (
            <li
              key={key}
              className="journalit-account-card__feature journalit-account-card__feature--locked"
            >
              <Button
                variant="plain"
                size="small"
                onClick={() => openUpgrade(key)}
              >
                <Lock size={14} />
                {t(key)}
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};


const showEmailIfTruncated = (event: React.MouseEvent<HTMLElement>) => {
  const el = event.currentTarget;
  setTooltip(
    el,
    el.scrollWidth > el.clientWidth ? (el.textContent ?? '') : '',
    {
      placement: 'top',
    }
  );
};

const AuthTabComponent: React.FC<AuthTabProps> = ({ plugin }) => {
  const {
    isAuthenticated,
    tier,
    userEmail,
    signOutReportCopied,
    handleCopySignOutReport,
    handleDeviceFlowSignIn,
    handleDeviceFlowSignOut,
    activeError,
    activeErrorTitle,
  } = useAuthTabModel({ plugin });

  return (
    <div className="journalit-account-card">
      <AccountPaymentRecoveryBanner plugin={plugin} />
      <div className="journalit-account-card__head">
        <div className="journalit-account-card__who">
          {isAuthenticated ? (
            <>
              <span className="journalit-account-card__email-line">
                {userEmail && (
                  <span
                    className="journalit-account-card__email"
                    onMouseEnter={showEmailIfTruncated}
                  >
                    {userEmail}
                  </span>
                )}
                {tier && (
                  <span
                    className={`journalit-account-card__badge${
                      planKind(tier) === 'pro' ||
                      planKind(tier) === 'enterprise'
                        ? ' journalit-account-card__badge--paid'
                        : ''
                    }`}
                  >
                    {planLabel(tier)}
                  </span>
                )}
              </span>
              <span className="journalit-account-card__status">
                <span className="journalit-account-card__dot" aria-hidden />
                {t('settings.auth.status-signed-in')}
              </span>
            </>
          ) : (
            <>
              <span className="journalit-account-card__email">
                {t('settings.auth.not-signed-in')}
              </span>
              <span className="journalit-account-card__sub">
                {t('settings.auth.signed-out-desc')}
              </span>
            </>
          )}
        </div>
        {isAuthenticated ? (
          <Button
            variant="secondary"
            onClick={() => void handleDeviceFlowSignOut()}
          >
            {t('settings.auth.sign-out')}
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={() => void handleDeviceFlowSignIn()}
          >
            {t('settings.auth.sign-in-up')}
          </Button>
        )}
      </div>

      {activeError && (
        <div className="auth-error-panel">
          <div className="auth-error-title">{activeErrorTitle}</div>
          <SupportActions
            onCopy={handleCopySignOutReport}
            copied={signOutReportCopied}
            copyLabel={t('csv.errors.copy-report')}
            copiedLabel={t('csv.errors.copied')}
            discordLabel={t('button.discord')}
            note={t('csv.results.discord-note')}
            onDiscord={() =>
              openExternalUrl(JOURNALIT_SETTINGS_RESOURCES.discord)
            }
            actionsClassName="auth-error-actions"
            helpClassName="auth-error-help"
            helpContentClassName="auth-error-help-content"
            noteIconClassName="auth-error-help-icon"
            renderButton={({ variant, onClick, content }) => (
              <Button variant={variant} size="small" onClick={onClick}>
                {content}
              </Button>
            )}
          />
        </div>
      )}

      {isAuthenticated && tier && <AccountPlan plugin={plugin} tier={tier} />}
    </div>
  );
};

AuthTabComponent.displayName = 'AuthTab';

export const AuthTab: React.FC<AuthTabProps> = React.memo(AuthTabComponent);
