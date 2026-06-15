

import React from 'react';
import { Info, Star } from '../../shared/icons/ObsidianIcon';
import { Button } from '../../ui/Button';
import { SyncingTradesGraphic } from '../graphics/SyncingTradesGraphic';
import { t } from '../../../lang/helpers';

export type OnboardingPath = 'manual' | 'csv' | 'mt';

interface ChoosePathStepProps {
  selectedPath: OnboardingPath | null;
  onSelect: (path: OnboardingPath) => void;
  onNext: () => void | Promise<void>;
  onBack: () => void | Promise<void>;
}

interface PathOption {
  value: OnboardingPath;
  label: string;
  description: string;
  isPremium?: boolean;
}

export const ChoosePathStep: React.FC<ChoosePathStepProps> = ({
  selectedPath,
  onSelect,
  onNext,
  onBack,
}) => {
  const pathOptions: PathOption[] = [
    {
      value: 'manual',
      label: t('onboarding.path.option.manual.label'),
      description: t('onboarding.path.option.manual.description'),
    },
    {
      value: 'csv',
      label: t('onboarding.path.option.csv.label'),
      description: t('onboarding.path.option.csv.description'),
      isPremium: true,
    },
    {
      value: 'mt',
      label: t('onboarding.path.option.mt.label'),
      description: t('onboarding.path.option.mt.description'),
      isPremium: true,
    },
  ];

  return (
    <div className="feature-selection-step choose-path-step">
      <div className="feature-content-wrapper">
        <div className="feature-left">
          <div className="explore-kicker">{t('onboarding.path.kicker')}</div>
          <div className="step-header explore-header">
            <h2>{t('onboarding.path.title')}</h2>
            <p className="step-subtitle">{t('onboarding.path.subtitle')}</p>
          </div>

          <div className="features-grid">
            {pathOptions.map((option) => {
              const isSelected = selectedPath === option.value;
              return (
                <div
                  key={option.value}
                  className={`feature-card ${isSelected ? 'selected' : ''} ${option.isPremium ? 'premium' : ''}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelect(option.value)}
                  onKeyDown={(e) => {
                    if (e.key !== 'Enter' && e.key !== ' ') return;
                    e.preventDefault();
                    onSelect(option.value);
                  }}
                >
                  <div className="feature-checkbox">
                    {isSelected && <span className="checkmark">✓</span>}
                  </div>
                  <div className="feature-content">
                    <div className="feature-label">{option.label}</div>
                    <div className="feature-description">
                      {option.description}
                    </div>
                  </div>
                  {option.isPremium && (
                    <span className="premium-badge">
                      <Star size={12} fill="currentColor" />
                      {t('onboarding.features.badge.pro')}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="choose-path-tip">
            <Info size={14} className="choose-path-tip-icon" />
            <span>{t('onboarding.path.tip.trial')}</span>
          </div>

          <div className="step-actions">
            <Button variant="secondary" onClick={onBack}>
              {t('button.back')}
            </Button>
            <Button variant="primary" onClick={onNext} disabled={!selectedPath}>
              {t('onboarding.common.continue')}
            </Button>
          </div>
        </div>

        <div className="feature-right">
          <div className="feature-graphic">
            <SyncingTradesGraphic />
          </div>
        </div>
      </div>
    </div>
  );
};
