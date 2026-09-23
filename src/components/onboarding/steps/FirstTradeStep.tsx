

import React from 'react';
import { Button } from '../../ui/Button';
import { t } from '../../../lang/helpers';

interface FirstTradeStepProps {
  busy: boolean;
  onAddTrade: () => void | Promise<void>;
  onExploreSample?: () => void | Promise<void>;
  onBack: () => void | Promise<void>;
}

export const FirstTradeStep: React.FC<FirstTradeStepProps> = ({
  busy,
  onAddTrade,
  onExploreSample,
  onBack,
}) => {
  return (
    <div className="manual-entry-step first-trade-step">
      <div className="manual-entry-content">
        <div className="manual-entry-header">
          <div className="explore-kicker">
            {t('onboarding.first-trade.kicker')}
          </div>
          <h1>{t('onboarding.first-trade.title')}</h1>
          <p>{t('onboarding.first-trade.subtitle')}</p>
        </div>

        <div className="first-trade-actions">
          <Button
            variant="primary"
            size="large"
            onClick={onAddTrade}
            disabled={busy}
          >
            {t('onboarding.first-trade.cta')}
          </Button>
          {onExploreSample && (
            <Button
              variant="secondary"
              size="large"
              onClick={onExploreSample}
              disabled={busy}
            >
              {t('onboarding.first-trade.sample')}
            </Button>
          )}
        </div>

        <div className="manual-entry-actions">
          <Button variant="secondary" onClick={onBack} disabled={busy}>
            {t('button.back')}
          </Button>
        </div>
      </div>
    </div>
  );
};
