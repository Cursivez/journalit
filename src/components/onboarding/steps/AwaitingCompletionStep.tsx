

import React from 'react';
import { Button } from '../../ui/Button';
import { t } from '../../../lang/helpers';
import type { TranslationKey } from '../../../lang/locale/en';
import type { OnboardingCompletionReason } from '../../../services/onboarding/types';

interface AwaitingCompletionStepProps {
  pending: OnboardingCompletionReason;
  busy: boolean;
  
  signedOut: boolean;
  onSignIn: () => void | Promise<void>;
  onPrimary: () => void | Promise<void>;
  onChangeRoute: () => void | Promise<void>;
  onSkip: () => void | Promise<void>;
}

const COPY: Record<
  OnboardingCompletionReason,
  { title: TranslationKey; body: TranslationKey; action: TranslationKey }
> = {
  'first-sync': {
    title: 'onboarding.awaiting.first-sync.title',
    body: 'onboarding.awaiting.first-sync.body',
    action: 'onboarding.awaiting.first-sync.action',
  },
  'first-import': {
    title: 'onboarding.awaiting.first-import.title',
    body: 'onboarding.awaiting.first-import.body',
    action: 'onboarding.awaiting.first-import.action',
  },
  'first-trade': {
    title: 'onboarding.awaiting.first-trade.title',
    body: 'onboarding.awaiting.first-trade.body',
    action: 'onboarding.awaiting.first-trade.action',
  },
};

export const AwaitingCompletionStep: React.FC<AwaitingCompletionStepProps> = ({
  pending,
  busy,
  signedOut,
  onSignIn,
  onPrimary,
  onChangeRoute,
  onSkip,
}) => {
  const copy = COPY[pending];
  const needsSignIn = signedOut && pending !== 'first-trade';
  return (
    <div className="manual-entry-step awaiting-step">
      <div className="manual-entry-content">
        <div className="manual-entry-header">
          <div className="explore-kicker">
            {t('onboarding.awaiting.kicker')}
          </div>
          <h1>{t(copy.title)}</h1>
          <p>
            {needsSignIn ? t('onboarding.awaiting.sign-in.body') : t(copy.body)}
          </p>
        </div>

        <div className="first-trade-actions">
          <Button
            variant="primary"
            size="large"
            onClick={needsSignIn ? onSignIn : onPrimary}
            disabled={busy}
          >
            {needsSignIn
              ? t('onboarding.awaiting.sign-in.action')
              : t(copy.action)}
          </Button>
          <Button variant="secondary" onClick={onChangeRoute} disabled={busy}>
            {t('onboarding.awaiting.change-route')}
          </Button>
        </div>

        <div className="manual-entry-actions">
          <Button
            variant="text"
            size="small"
            onClick={onSkip}
            disabled={busy}
            aria-label={t('onboarding.wizard.skip-aria')}
          >
            {t('onboarding.wizard.skip-onboarding')}
          </Button>
        </div>
      </div>
    </div>
  );
};
