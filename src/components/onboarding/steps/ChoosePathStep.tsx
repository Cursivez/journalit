

import React from 'react';
import { Button } from '../../ui/Button';
import { SyncingTradesGraphic } from '../graphics/SyncingTradesGraphic';
import { t } from '../../../lang/helpers';

export interface OnboardingPathOption {
  id: string;
  label: string;
  description: string;
  badge?: string;
  badgeIcon?: React.ReactNode;
  onChoose: () => void | Promise<void>;
}

interface ChoosePathStepProps {
  kicker: string;
  title: string;
  subtitle: string;
  options: OnboardingPathOption[];
  busy: boolean;
  onBack: () => void | Promise<void>;
  
  statusText?: string;
  
  className?: string;
  
  showGraphic?: boolean;
}

export const ChoosePathStep: React.FC<ChoosePathStepProps> = ({
  kicker,
  title,
  subtitle,
  options,
  busy,
  onBack,
  statusText,
  className,
  showGraphic = true,
}) => (
  <div
    className={`feature-selection-step choose-path-step${className ? ` ${className}` : ''}${showGraphic ? '' : ' choose-path-step-no-graphic'}`}
  >
    <div className="feature-content-wrapper">
      <div className="feature-left">
        <div className="explore-kicker">{kicker}</div>
        <div className="step-header explore-header">
          <h2>{title}</h2>
          <p className="step-subtitle">{subtitle}</p>
        </div>

        <div className="features-grid">
          {options.map((option) => (
            <button
              key={option.id}
              type="button"
              className="feature-card journalit-onboarding-choice-card"
              disabled={busy}
              onClick={() => void option.onChoose()}
            >
              <span className="feature-content">
                <span className="feature-label">{option.label}</span>
                <span className="feature-description">
                  {option.description}
                </span>
              </span>
              {option.badge && (
                <span className="premium-badge">
                  {option.badgeIcon}
                  {option.badge}
                </span>
              )}
              <span className="onboarding-choice-arrow" aria-hidden="true">
                →
              </span>
            </button>
          ))}
        </div>

        {statusText && (
          <p className="onboarding-status-text" role="status">
            {statusText}
          </p>
        )}

        <div className="step-actions">
          <Button variant="secondary" onClick={onBack} disabled={busy}>
            {t('button.back')}
          </Button>
        </div>
      </div>

      {showGraphic && (
        <div className="feature-right">
          <div className="feature-graphic">
            <SyncingTradesGraphic />
          </div>
        </div>
      )}
    </div>
  </div>
);
