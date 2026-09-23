

import React, { useEffect, useRef, useState } from 'react';
import { Button } from '../../ui/Button';
import { t } from '../../../lang/helpers';
import { Plus, Search, Zap } from '../../shared/icons/ObsidianIcon';
import { cssVars } from '../../../styles/inlineStylePolicy';
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

const monogram = (label: string): string => {
  const words = label.split(/\s+/).filter(Boolean);
  const letters =
    words.length >= 2
      ? words[0][0] + words[1][0]
      : label.replace(/[^a-z0-9]/gi, '').slice(0, 2);
  return letters.toUpperCase();
};

export const BrokerStep: React.FC<BrokerStepProps> = ({
  options,
  statusText,
  busy,
  onChoose,
  onBack,
}) => {
  const [query, setQuery] = useState('');
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
  const normalizedQuery = query.trim().toLowerCase();
  const visible = options.filter(
    (option) =>
      option.id === unlistedId ||
      !normalizedQuery ||
      option.label.toLowerCase().includes(normalizedQuery)
  );

  return (
    <div className="feature-selection-step choose-path-step choose-path-step-no-graphic broker-step">
      <div className="feature-content-wrapper">
        <div className="feature-left">
          <div className="explore-kicker">{t('onboarding.broker.kicker')}</div>
          <div className="step-header explore-header">
            <h2>{t('onboarding.broker.title')}</h2>
            <p className="step-subtitle">{t('onboarding.broker.subtitle')}</p>
          </div>

          <label className="broker-search">
            <Search size={16} aria-hidden="true" />
            <input
              type="search"
              value={query}
              placeholder={t('onboarding.broker.search')}
              aria-label={t('onboarding.broker.search')}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>

          <div className="broker-tiles">
            {visible.map((option) => {
              const isUnlisted = option.id === unlistedId;
              const logo = option.logo;
              return (
                <button
                  key={option.id}
                  type="button"
                  className={`journalit-onboarding-broker-tile${isUnlisted ? ' is-unlisted' : ''}${isUnlisted && requesting ? ' is-active' : ''}`}
                  disabled={busy}
                  aria-expanded={isUnlisted ? requesting : undefined}
                  onClick={() => {
                    if (!isUnlisted) {
                      void onChoose(option);
                      return;
                    }
                    setRequesting(true);
                    setRequestPulse((count) => count + 1);
                  }}
                >
                  <span
                    className={`broker-tile-mark${logo && !logo.monochrome ? ' has-logo' : ''}`}
                    aria-hidden="true"
                  >
                    {isUnlisted ? (
                      <Plus size={22} />
                    ) : logo?.monochrome ? (
                      <span
                        className="broker-tile-logo"
                        style={cssVars({
                          '--journalit-broker-mark': `url("${logo.uri}")`,
                        })}
                      />
                    ) : logo ? (
                      <img src={logo.uri} alt="" />
                    ) : (
                      monogram(option.label)
                    )}
                  </span>
                  <span className="broker-tile-label">{option.label}</span>
                  {option.method === 'sync' && (
                    <span
                      className="broker-tile-badge"
                      role="img"
                      aria-label={t('onboarding.broker.badge.sync')}
                    >
                      <Zap size={12} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

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
