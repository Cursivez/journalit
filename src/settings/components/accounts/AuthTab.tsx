

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Notice } from 'obsidian';
import JournalitPlugin from '../../../main';
import { Button } from '../../../components/ui/Button';
import { DeviceFlowSignInModal } from '../../../components/auth/DeviceFlowSignInModal';
import { SupportActions } from '../../../components/shared/SupportActions';
import { BackendSecretStorage } from '../../../services/backend/BackendSecretStorage';
import { SubscriptionTierService } from '../../../services/backend/SubscriptionTierService';
import {
  SupportErrorDetails,
  buildSupportReport,
  formatSupportErrorDetails,
} from '../../../utils/supportReport';
import { t } from '../../../lang/helpers';
import { openExternalUrl } from '../../../utils/externalLinks';
import { writeClipboardText } from '../../../utils/clipboard';

interface AuthTabProps {
  plugin: JournalitPlugin;
}

function isAuthErrorDetail(
  value: unknown
): value is SupportErrorDetails & { occurrences?: number } {
  return value !== null && typeof value === 'object' && 'message' in value;
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

    window.activeDocument.addEventListener(
      'journalit:auth-error',
      handleAuthError
    );

    return () => {
      window.activeDocument.removeEventListener(
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
      if (plugin.settings.backendIntegration) {
        BackendSecretStorage.clearAuthToken(plugin);
        plugin.settings.backendIntegration.userEmail = undefined;
        plugin.settings.backendIntegration.subscriptionTier = undefined;
        plugin.settings.backendIntegration.userId = '';
        await plugin.saveSettings();
      }
      new Notice(t('notice.logout-success'));
      setAuthState((current) => ({
        ...current,
        signOutError: null,
        authError: null,
        signOutReportCopied: false,
      }));

      window.dispatchEvent(new CustomEvent('journalit:subscription-changed'));
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

  const getTierBadgeClass = (tierName?: string): string => {
    switch (tierName?.toLowerCase()) {
      case 'pro':
      case 'premium':
        return 'tier-pro';
      case 'enterprise':
        return 'tier-enterprise';
      case 'free':
        return 'tier-free';
      default:
        return 'tier-unknown';
    }
  };

  const getTierLabel = (tierName?: string): string => {
    if (!tierName) return '';
    const normalized = tierName.toLowerCase();
    if (normalized === 'pro' || normalized === 'premium') return 'PRO';
    if (normalized === 'enterprise') return 'ENTERPRISE';
    if (normalized === 'free') return 'FREE';
    return tierName.charAt(0).toUpperCase() + tierName.slice(1);
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
    getTierBadgeClass,
    getTierLabel,
    activeError,
    activeErrorTitle,
  };
}

const AuthTabComponent: React.FC<AuthTabProps> = ({ plugin }) => {
  const {
    isAuthenticated,
    tier,
    userEmail,
    signOutReportCopied,
    handleCopySignOutReport,
    handleDeviceFlowSignIn,
    handleDeviceFlowSignOut,
    getTierBadgeClass,
    getTierLabel,
    activeError,
    activeErrorTitle,
  } = useAuthTabModel({ plugin });

  return (
    <div className="trading-journal-settings-container">
      
      <div className="account-profile-card">
        <div className="account-info">
          <div className="account-email-row">
            <span className="account-email">
              {isAuthenticated && userEmail
                ? userEmail
                : t('settings.auth.guest')}
            </span>
            {isAuthenticated && tier && (
              <span className={`tier-badge ${getTierBadgeClass(tier)}`}>
                {getTierLabel(tier)}
              </span>
            )}
          </div>
          <div
            className={`account-status ${isAuthenticated ? 'online' : 'offline'}`}
          >
            {isAuthenticated
              ? `● ${t('settings.auth.status-online')}`
              : t('settings.auth.status-offline')}
          </div>
        </div>

        
        {isAuthenticated ? (
          <Button
            variant="danger"
            onClick={() => void handleDeviceFlowSignOut()}
            className="sign-out-inline"
          >
            {t('settings.auth.sign-out')}
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={() => void handleDeviceFlowSignIn()}
            className="sign-in-inline"
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
            onDiscord={() => openExternalUrl('https://discord.gg/AkSw3D9h8b')}
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

      
      {isAuthenticated && tier && (
        <div className="account-section">
          <div className="section-header-row">
            <div className="section-header">{t('settings.auth.your-plan')}</div>
            <a
              href="https://journalit.co/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="manage-subscription-link"
            >
              {t('settings.auth.manage-subscription')} →
            </a>
          </div>
          <div className="plan-features-inline">
            {(tier.toLowerCase() === 'pro' ||
              tier.toLowerCase() === 'premium') && (
              <>
                <span className="feature-tag">
                  {t('settings.auth.feature.csv-import')}
                </span>
                <span className="feature-tag">
                  {t('settings.auth.feature.ai-mapping')}
                </span>
                <span className="feature-tag">
                  {t('settings.auth.feature.metatrader-sync')}
                </span>
              </>
            )}
            {tier.toLowerCase() === 'free' && (
              <>
                <span className="feature-tag">
                  {t('settings.auth.feature.basic-tracking')}
                </span>
                <span className="feature-tag">
                  {t('settings.auth.feature.manual-entry')}
                </span>
                <span className="feature-tag">
                  {t('settings.auth.feature.analytics-reviews')}
                </span>
                <span className="feature-tag feature-tag--locked">
                  {t('settings.auth.feature.csv-import')}
                </span>
                <span className="feature-tag feature-tag--locked">
                  {t('settings.auth.feature.ai-mapping')}
                </span>
                <span className="feature-tag feature-tag--locked">
                  {t('settings.auth.feature.metatrader-sync')}
                </span>
              </>
            )}
            {tier.toLowerCase() === 'enterprise' && (
              <>
                <span className="feature-tag">
                  {t('settings.auth.feature.csv-import')}
                </span>
                <span className="feature-tag">
                  {t('settings.auth.feature.ai-mapping')}
                </span>
                <span className="feature-tag">
                  {t('settings.auth.feature.metatrader-sync')}
                </span>
                <span className="feature-tag">
                  {t('settings.auth.feature.priority-support')}
                </span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

AuthTabComponent.displayName = 'AuthTab';

export const AuthTab: React.FC<AuthTabProps> = React.memo(AuthTabComponent);
