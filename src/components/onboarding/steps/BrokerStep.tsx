

import React, { useEffect, useRef, useState } from 'react';
import { Button } from '../../ui/Button';
import { t } from '../../../lang/helpers';
import { Plus, Zap } from '../../shared/icons/ObsidianIcon';
import { BrokerPicker } from '../../shared/brokerPicker/BrokerPicker';
import { openExternalUrl } from '../../../utils/externalLinks';
import { JOURNALIT_SETTINGS_RESOURCES } from '../../../settings/settingsResources';
import { MessagesSquare } from '../../shared/icons/ObsidianIcon';
import {
  getUnlistedBrokerOption,
  type OnboardingBrokerOption,
} from '../../../services/onboarding/brokerCatalog';

interface BrokerStepProps {
  options: OnboardingBrokerOption[];
  statusText?: string;
  busy: boolean;
  onChoose: (option: OnboardingBrokerOption) => void | Promise<void>;
  onBack: () => void | Promise<void>;
}

export const BrokerStep: React.FC<BrokerStepProps> = ({
  options,
  statusText,
  busy,
  onChoose,
  onBack,
}) => {
  const [requesting, setRequesting] = useState(false);
  
  
  const [requestPulse, setRequestPulse] = useState(0);
  const requestPanelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!requesting) return;
    requestPanelRef.current?.scrollIntoView({
      block: 'nearest',
      behavior: 'smooth',
    });
    requestPanelRef.current
      ?.querySelector('button')
      ?.focus({ preventScroll: true });
  }, [requesting, requestPulse]);
  const unlistedId = getUnlistedBrokerOption().id;
  return (
    <div className="feature-selection-step choose-path-step choose-path-step-no-graphic broker-step">
      <div className="feature-content-wrapper">
        <div className="feature-left">
          <div className="explore-kicker">{t('onboarding.broker.kicker')}</div>
          <div className="step-header explore-header">
            <h2>{t('onboarding.broker.title')}</h2>
            <p className="step-subtitle">{t('onboarding.broker.subtitle')}</p>
          </div>

          <BrokerPicker
            items={options.map((option) =>
              option.id === unlistedId
                ? {
                    id: option.id,
                    label: option.label,
                    icon: <Plus size={22} />,
                    pinned: true,
                    expanded: requesting,
                  }
                : {
                    id: option.id,
                    label: option.label,
                    logo: option.logo,
                    ...(option.method === 'sync'
                      ? {
                          badge: {
                            icon: <Zap size={12} />,
                            label: t('onboarding.broker.badge.sync'),
                          },
                        }
                      : {}),
                  }
            )}
            searchPlaceholder={t('onboarding.broker.search')}
            disabled={busy}
            onSelect={(item) => {
              if (item.id !== unlistedId) {
                const option = options.find(
                  (candidate) => candidate.id === item.id
                );
                if (option) void onChoose(option);
                return;
              }
              setRequesting(true);
              setRequestPulse((count) => count + 1);
            }}
          />

          {requesting && (
            <div
              ref={requestPanelRef}
              className="broker-request-panel"
              role="region"
              aria-label={t('onboarding.broker.request.title')}
            >
              <div className="broker-request-panel__text">
                <strong>{t('onboarding.broker.request.title')}</strong>
                <span>{t('onboarding.broker.request.body')}</span>
              </div>
              <div className="broker-request-panel__actions">
                <Button
                  variant="primary"
                  onClick={() =>
                    openExternalUrl(JOURNALIT_SETTINGS_RESOURCES.discord)
                  }
                >
                  <MessagesSquare size={14} aria-hidden="true" />
                  {t('onboarding.broker.request.discord')}
                </Button>
                <Button
                  variant="secondary"
                  disabled={busy}
                  onClick={() => void onChoose(getUnlistedBrokerOption())}
                >
                  {t('onboarding.broker.request.continue')}
                </Button>
              </div>
            </div>
          )}
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
      </div>
    </div>
  );
};
