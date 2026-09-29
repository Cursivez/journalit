

import React from 'react';
import { Button } from '../../ui/Button';
import { cssVars } from '../../../styles/inlineStylePolicy';
import { t } from '../../../lang/helpers';
import type { DemoSessionSnapshot } from '../../../demo/DemoSessionService';

interface PreparingSampleStepProps {
  snapshot: DemoSessionSnapshot;
  
  stalled: boolean;
  busy: boolean;
  onRetry: () => void | Promise<void>;
  onBack: () => void | Promise<void>;
}

export const PreparingSampleStep: React.FC<PreparingSampleStepProps> = ({
  snapshot,
  stalled,
  busy,
  onRetry,
  onBack,
}) => {
  const failed = snapshot.phase === 'failed' || stalled;
  const progress = snapshot.progress;
  const ratio =
    progress && progress.total > 0
      ? Math.min(1, progress.completed / progress.total)
      : null;
  const percent = ratio === null ? null : Math.round(ratio * 100);
  const progressLabel =
    progress && progress.total > 0
      ? t('sample.progress.creating', {
          completed: String(progress.completed),
          total: String(progress.total),
        })
      : t('onboarding.preparing-sample.starting');

  return (
    <div className="manual-entry-step preparing-sample-step">
      <div className="manual-entry-content">
        <div className="manual-entry-header">
          <h1>
            {failed
              ? t('onboarding.preparing-sample.failed.title')
              : t('onboarding.preparing-sample.title')}
          </h1>
          <p>
            {failed
              ? t('onboarding.preparing-sample.failed.body')
              : t('onboarding.preparing-sample.body')}
          </p>
        </div>

        {!failed && (
          <div className="journalit-onboarding-progress">
            <div
              className={`journalit-onboarding-progress__track${percent === null ? ' journalit-onboarding-progress__track--indeterminate' : ''}`}
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={percent ?? undefined}
              aria-valuetext={progressLabel}
              aria-label={t('onboarding.preparing-sample.title')}
            >
              <div
                className="journalit-onboarding-progress__fill"
                style={cssVars({ '--journalit-progress': ratio ?? 0 })}
              />
            </div>
            <div className="journalit-onboarding-progress__meta">
              <span>{progressLabel}</span>
              {percent !== null && <strong>{`${percent}%`}</strong>}
            </div>
            <p className="journalit-onboarding-progress__hint">
              {t('onboarding.preparing-sample.hint')}
            </p>
          </div>
        )}

        {failed && (
          <div className="first-trade-actions preparing-sample-actions">
            <Button
              variant="primary"
              size="large"
              onClick={onRetry}
              disabled={busy}
            >
              {t('onboarding.preparing-sample.retry')}
            </Button>
            <Button
              variant="secondary"
              size="large"
              onClick={onBack}
              disabled={busy}
            >
              {t('button.back')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
