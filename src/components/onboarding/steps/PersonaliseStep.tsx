

import React, { useId, useState } from 'react';
import { Button } from '../../ui/Button';
import { t } from '../../../lang/helpers';
import type { TranslationKey } from '../../../lang/locale/en';
import type {
  OnboardingAccountKind,
  OnboardingAnswers,
  OnboardingAssetFocus,
  OnboardingTradingStyle,
} from '../../../services/onboarding/types';

export interface PersonaliseAnswers {
  tradingStyle: OnboardingTradingStyle;
  accountKind: OnboardingAccountKind;
  assetFocus?: OnboardingAssetFocus;
}

interface PersonaliseStepProps {
  initial: OnboardingAnswers;
  
  askAssetFocus: boolean;
  busy: boolean;
  onContinue: (answers: PersonaliseAnswers) => void | Promise<void>;
  onBack: () => void | Promise<void>;
}

interface ChipRowProps<T extends string> {
  question: string;
  options: Array<{ value: T; label: string }>;
  value: T | undefined;
  onChange: (value: T) => void;
  disabled: boolean;
  columns?: 'auto' | 'two';
}

function ChipRow<T extends string>({
  question,
  options,
  value,
  onChange,
  disabled,
  columns = 'auto',
}: ChipRowProps<T>) {
  const questionId = useId();

  return (
    <div
      className="personalise-row"
      role="radiogroup"
      aria-labelledby={questionId}
    >
      <span id={questionId} className="personalise-question">
        {question}
      </span>
      <div
        className={`personalise-options${columns === 'two' ? ' personalise-options-two-columns' : ''}`}
      >
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={value === option.value}
            className={`journalit-onboarding-option${value === option.value ? ' is-selected' : ''}`}
            disabled={disabled}
            onClick={() => onChange(option.value)}
          >
            <span
              className="journalit-onboarding-option-radio"
              aria-hidden="true"
            />
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

const STYLE_OPTIONS: Array<{
  value: OnboardingTradingStyle;
  key: TranslationKey;
}> = [
  { value: 'scalping', key: 'onboarding.personalise.style.scalping' },
  { value: 'intraday', key: 'onboarding.personalise.style.intraday' },
  { value: 'swing', key: 'onboarding.personalise.style.swing' },
  { value: 'position', key: 'onboarding.personalise.style.position' },
];

const ACCOUNT_OPTIONS: Array<{
  value: OnboardingAccountKind;
  key: TranslationKey;
}> = [
  { value: 'personal', key: 'onboarding.personalise.account.personal' },
  { value: 'practice', key: 'onboarding.personalise.account.practice' },
  { value: 'prop', key: 'onboarding.personalise.account.prop' },
];

const ASSET_OPTIONS: Array<{
  value: OnboardingAssetFocus;
  key: TranslationKey;
}> = [
  { value: 'stock', key: 'onboarding.personalise.asset.stock' },
  { value: 'futures', key: 'onboarding.personalise.asset.futures' },
  { value: 'forex', key: 'onboarding.personalise.asset.forex' },
  { value: 'crypto', key: 'onboarding.personalise.asset.crypto' },
  { value: 'options', key: 'onboarding.personalise.asset.options' },
  { value: 'mixed', key: 'onboarding.personalise.asset.mixed' },
];

export const PersonaliseStep: React.FC<PersonaliseStepProps> = ({
  initial,
  askAssetFocus,
  busy,
  onContinue,
  onBack,
}) => {
  const [tradingStyle, setTradingStyle] = useState(initial.tradingStyle);
  const [accountKind, setAccountKind] = useState(initial.accountKind);
  const [assetFocus, setAssetFocus] = useState(initial.assetFocus);

  const canContinue =
    tradingStyle !== undefined &&
    accountKind !== undefined &&
    (!askAssetFocus || assetFocus !== undefined);

  return (
    <div className="feature-selection-step choose-path-step choose-path-step-no-graphic personalise-step">
      <div className="feature-content-wrapper">
        <div className="feature-left">
          <div className="explore-kicker">
            {t('onboarding.personalise.kicker')}
          </div>
          <div className="step-header explore-header">
            <h2>{t('onboarding.personalise.title')}</h2>
            <p className="step-subtitle">
              {t('onboarding.personalise.subtitle')}
            </p>
          </div>

          <div className="personalise-rows">
            <ChipRow<OnboardingTradingStyle>
              question={t('onboarding.personalise.style.question')}
              options={STYLE_OPTIONS.map((option) => ({
                value: option.value,
                label: t(option.key),
              }))}
              value={tradingStyle}
              onChange={setTradingStyle}
              disabled={busy}
              columns="two"
            />
            <ChipRow<OnboardingAccountKind>
              question={t('onboarding.personalise.account.question')}
              options={ACCOUNT_OPTIONS.map((option) => ({
                value: option.value,
                label: t(option.key),
              }))}
              value={accountKind}
              onChange={setAccountKind}
              disabled={busy}
            />
            {askAssetFocus && (
              <ChipRow<OnboardingAssetFocus>
                question={t('onboarding.personalise.asset.question')}
                options={ASSET_OPTIONS.map((option) => ({
                  value: option.value,
                  label: t(option.key),
                }))}
                value={assetFocus}
                onChange={setAssetFocus}
                disabled={busy}
              />
            )}
          </div>

          <div className="step-actions">
            <Button variant="secondary" onClick={onBack} disabled={busy}>
              {t('button.back')}
            </Button>
            <Button
              variant="primary"
              disabled={!canContinue || busy}
              onClick={() => {
                if (!tradingStyle || !accountKind) return;
                void onContinue({
                  tradingStyle,
                  accountKind,
                  assetFocus: askAssetFocus ? assetFocus : undefined,
                });
              }}
            >
              {t('onboarding.common.continue')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
