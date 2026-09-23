

import React from 'react';
import { Button } from '../../ui/Button';
import { t } from '../../../lang/helpers';

interface SampleExploringStepProps {
  busy: boolean;
  
  sampleFailed: boolean;
  onExitSample: () => void | Promise<void>;
  onSkip: () => void | Promise<void>;
}

export const SampleExploringStep: React.FC<SampleExploringStepProps> = ({
  busy,
  sampleFailed,
  onExitSample,
  onSkip,
}) => (
  <div className="manual-entry-step sample-exploring-step">
    <div className="manual-entry-content">
      <div className="manual-entry-header">
        <div className="explore-kicker">
          {t('onboarding.sample-exploring.kicker')}
        </div>
        <h1>
          {sampleFailed
            ? t('onboarding.sample-exploring.failed.title')
            : t('onboarding.sample-exploring.title')}
        </h1>
        <p>
          {sampleFailed
            ? t('onboarding.sample-exploring.failed.body')
            : t('onboarding.sample-exploring.body')}
        </p>
      </div>
      <div className="first-trade-actions">
        <Button
          variant="primary"
          size="large"
          onClick={onExitSample}
          disabled={busy}
        >
          {t('onboarding.sample-exploring.exit')}
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
