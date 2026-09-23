

import React from 'react';
import { Platform } from 'obsidian';
import { Button } from '../../ui/Button';
import { t } from '../../../lang/helpers';

interface ObsidianOrientationStepProps {
  onRevealSidebar: () => void | Promise<void>;
  sidebarRevealed: boolean;
  onContinue: () => void | Promise<void>;
  onBack: () => void | Promise<void>;
}

export const ObsidianOrientationStep: React.FC<
  ObsidianOrientationStepProps
> = ({ onRevealSidebar, sidebarRevealed, onContinue, onBack }) => {
  const isMobile = Platform.isMobileApp;

  return (
    <div className="feature-selection-step choose-path-step choose-path-step-no-graphic orientation-step">
      <div className="feature-content-wrapper">
        <div className="feature-left">
          <div className="explore-kicker">
            {t('onboarding.orientation.kicker')}
          </div>
          <div className="step-header explore-header">
            <h2>{t('onboarding.orientation.title')}</h2>
            <p className="step-subtitle">
              {t('onboarding.orientation.subtitle')}
            </p>
          </div>

          <ol className="orientation-cards">
            <li className="orientation-card">
              <span className="orientation-card-number" aria-hidden="true">
                1
              </span>
              <span className="orientation-card-body">
                <span className="orientation-card-title">
                  {t('onboarding.orientation.inside.title')}
                </span>
                <span className="orientation-card-text">
                  {t('onboarding.orientation.inside.body')}
                </span>
              </span>
            </li>

            <li className="orientation-card orientation-card-interactive">
              <span className="orientation-card-number" aria-hidden="true">
                2
              </span>
              <span className="orientation-card-body">
                <span className="orientation-card-title">
                  {t('onboarding.orientation.sidebar.title')}
                </span>
                <span className="orientation-card-text">
                  {t('onboarding.orientation.sidebar.body')}
                </span>
                <span className="orientation-card-actions">
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={onRevealSidebar}
                  >
                    {t(
                      isMobile
                        ? 'onboarding.orientation.sidebar.action-mobile'
                        : 'onboarding.orientation.sidebar.action'
                    )}
                  </Button>
                  {sidebarRevealed && (
                    <span className="orientation-card-hint" role="status">
                      {t(
                        isMobile
                          ? 'onboarding.orientation.sidebar.hint-mobile'
                          : 'onboarding.orientation.sidebar.hint'
                      )}
                    </span>
                  )}
                </span>
              </span>
            </li>

            <li className="orientation-card">
              <span className="orientation-card-number" aria-hidden="true">
                3
              </span>
              <span className="orientation-card-body">
                <span className="orientation-card-title">
                  {t('onboarding.orientation.tabs.title')}
                </span>
                <span className="orientation-card-text">
                  {t('onboarding.orientation.tabs.body')}
                </span>
              </span>
            </li>

            <li className="orientation-card">
              <span className="orientation-card-number" aria-hidden="true">
                4
              </span>
              <span className="orientation-card-body">
                <span className="orientation-card-title">
                  {t('onboarding.orientation.privacy.title')}
                </span>
                <span className="orientation-card-text">
                  {t('onboarding.orientation.privacy.body')}
                </span>
              </span>
            </li>
          </ol>

          <div className="step-actions">
            <Button variant="secondary" onClick={onBack}>
              {t('button.back')}
            </Button>
            <Button variant="primary" onClick={onContinue}>
              {t('onboarding.orientation.continue')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
