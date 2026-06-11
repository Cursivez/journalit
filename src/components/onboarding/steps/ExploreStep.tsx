

import React from 'react';
import {
  Blocks,
  BookOpen,
  CheckCircle2,
  Copy,
  FolderTree,
  Grip,
  Import,
  Plug,
  Users,
} from '../../shared/icons/ObsidianIcon';
import { Button } from '../../ui/Button';
import { t } from '../../../lang/helpers';

interface ExploreStepProps {
  onBack: () => void;
  onNext: () => void;
  onOpenDashboard: () => void;
  onOpenTradeLog: () => void;
  onOpenAccounts: () => void;
  onOpenLayoutBuilder: () => void;
  onOpenCsv: () => void;
  onOpenMetaTrader: () => void;
  onOpenManual: () => void | Promise<void>;
  manualLinkFallbackUrl?: string | null;
  manualLinkCopied?: boolean;
  onManualLinkCopy?: (url: string) => void | Promise<void>;
}

interface ExploreCard {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  isPremium?: boolean;
  onOpen: () => void;
}

export const ExploreStep: React.FC<ExploreStepProps> = ({
  onBack,
  onNext,
  onOpenDashboard,
  onOpenTradeLog,
  onOpenAccounts,
  onOpenLayoutBuilder,
  onOpenCsv,
  onOpenMetaTrader,
  onOpenManual,
  manualLinkFallbackUrl,
  manualLinkCopied,
  onManualLinkCopy,
}) => {
  const tiles: ExploreCard[] = [
    {
      id: 'dashboard',
      label: t('onboarding.explore.core.dashboard.label'),
      description: t('onboarding.explore.core.dashboard.description'),
      icon: <Grip size={22} />,
      onOpen: onOpenDashboard,
    },
    {
      id: 'trade-log',
      label: t('onboarding.explore.core.tradelog.label'),
      description: t('onboarding.explore.core.tradelog.description'),
      icon: <FolderTree size={22} />,
      onOpen: onOpenTradeLog,
    },
    {
      id: 'accounts',
      label: t('onboarding.explore.core.accounts.label'),
      description: t('onboarding.explore.core.accounts.description'),
      icon: <Users size={22} />,
      onOpen: onOpenAccounts,
    },
    {
      id: 'layouts',
      label: t('onboarding.explore.core.layouts.label'),
      description: t('onboarding.explore.core.layouts.description'),
      icon: <Blocks size={22} />,
      onOpen: onOpenLayoutBuilder,
    },
    {
      id: 'csv',
      label: t('onboarding.explore.imports.csv.label'),
      description: t('onboarding.explore.imports.csv.description'),
      icon: <Import size={22} />,
      isPremium: true,
      onOpen: onOpenCsv,
    },
    {
      id: 'mt',
      label: t('onboarding.explore.imports.mt.label'),
      description: t('onboarding.explore.imports.mt.description'),
      icon: <Plug size={22} />,
      isPremium: true,
      onOpen: onOpenMetaTrader,
    },
  ];

  const renderTile = (tile: ExploreCard) => (
    <div
      key={tile.id}
      className={`feature-card explore-feature-tile ${tile.isPremium ? 'premium' : ''}`}
      role="button"
      tabIndex={0}
      onClick={tile.onOpen}
      onKeyDown={(e) => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        e.preventDefault();
        tile.onOpen();
      }}
    >
      <div className="explore-feature-icon">{tile.icon}</div>
      <div className="explore-feature-content">
        <div className="explore-feature-title">{tile.label}</div>
        <div className="explore-feature-description">{tile.description}</div>
      </div>
      {tile.isPremium && (
        <span className="premium-badge">
          {t('onboarding.features.badge.pro')}
        </span>
      )}
    </div>
  );

  return (
    <div className="feature-selection-step explore-step">
      <div className="feature-content-wrapper">
        <div className="feature-left">
          <div className="explore-kicker">{t('onboarding.explore.title')}</div>
          <div className="step-header explore-header">
            <h2>{t('onboarding.explore.section.out-of-box.title')}</h2>
            <p className="step-subtitle">{t('onboarding.explore.subtitle')}</p>
            <p className="step-subtitle">{t('onboarding.explore.subtitle2')}</p>
            <p className="step-subtitle explore-tagline">
              {t('onboarding.explore.tagline')}
            </p>
          </div>

          <div className="step-actions">
            <Button variant="secondary" onClick={onBack}>
              {t('button.back')}
            </Button>
            <Button variant="secondary" onClick={() => void onOpenManual()}>
              <BookOpen size={16} className="button-icon-left" />
              {t('onboarding.explore.cta.manual')}
            </Button>
            <Button variant="primary" onClick={onNext}>
              {t('onboarding.common.continue')}
            </Button>
          </div>

          {manualLinkFallbackUrl && (
            <div className="onboarding-link-fallback">
              <button
                className="onboarding-link-fallback-url"
                onClick={() => void onManualLinkCopy?.(manualLinkFallbackUrl)}
                aria-description={t('onboarding.activation.button.copy')}
                type="button"
              >
                {manualLinkFallbackUrl}
              </button>
              <button
                className={`onboarding-link-fallback-copy ${manualLinkCopied ? 'copied' : ''}`}
                onClick={() => void onManualLinkCopy?.(manualLinkFallbackUrl)}
                aria-label={
                  manualLinkCopied
                    ? t('onboarding.activation.button.copied')
                    : t('onboarding.activation.button.copy')
                }
                type="button"
              >
                {manualLinkCopied ? (
                  <CheckCircle2 size={16} />
                ) : (
                  <Copy size={16} />
                )}
              </button>
            </div>
          )}
        </div>

        <div className="feature-right explore-right">
          <div className="explore-feature-grid">{tiles.map(renderTile)}</div>
        </div>
      </div>
    </div>
  );
};
