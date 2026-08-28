

import React from 'react';
import { Platform } from 'obsidian';
import { Button } from '../../ui/Button';
import { t } from '../../../lang/helpers';
import { getAddTradeHotkeyParts } from '../../../utils/obsidianHotkeys';

interface ManualEntryStepProps {
  onBack: () => void | Promise<void>;
  onChangeHotkey: () => void | Promise<void>;
  onAddTrade: () => void | Promise<void>;
}

export const ManualEntryStep: React.FC<ManualEntryStepProps> = ({
  onBack,
  onChangeHotkey,
  onAddTrade,
}) => {
  const hotkeyParts = getAddTradeHotkeyParts();
  const hotkeyDisplay = hotkeyParts.join(' + ');

  return (
    <div className="manual-entry-step">
      <div className="manual-entry-content">
        <div className="manual-entry-header">
          <h1>{t('onboarding.manual.title')}</h1>
          <p>
            {t(
              Platform.isMobileApp
                ? 'onboarding.manual.subtitle-mobile'
                : 'onboarding.manual.subtitle'
            )}
          </p>
        </div>

        <div className="manual-entry-hero">
          <div className="manual-entry-glow" aria-hidden="true" />
          {!Platform.isMobileApp && (
            <>
              <p className="manual-entry-hint">
                {t('onboarding.manual.hit-hotkey', {
                  hotkey: hotkeyDisplay,
                })}
              </p>
              <div
                className="manual-entry-hotkey-keys"
                role="group"
                aria-label={t('onboarding.manual.hotkey.title')}
              >
                {hotkeyParts.map((part, index) => (
                  <React.Fragment key={part}>
                    <span className="manual-entry-hotkey-key">{part}</span>
                    {index < hotkeyParts.length - 1 && (
                      <span className="manual-entry-hotkey-plus">+</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
              <Button
                variant="text"
                className="manual-entry-change-hotkey"
                onClick={onChangeHotkey}
              >
                {t('onboarding.manual.cta.change-hotkey')}
              </Button>
            </>
          )}
        </div>

        <div className="manual-entry-actions">
          <Button variant="secondary" onClick={onBack}>
            {t('button.back')}
          </Button>
          <Button variant="primary" onClick={onAddTrade}>
            {t('onboarding.manual.add-first-trade')}
          </Button>
        </div>
      </div>
    </div>
  );
};
