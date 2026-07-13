import React from 'react';

import { t } from '../../lang/helpers';

interface FloatingUnsavedChangesBannerProps {
  message: string;
  onDiscard: () => void;
  onSave: () => void;
  saveButtonRef?: React.Ref<HTMLButtonElement>;
}

export const FloatingUnsavedChangesBanner: React.FC<
  FloatingUnsavedChangesBannerProps
> = ({ message, onDiscard, onSave, saveButtonRef }) => (
  <div className="template-unsaved-banner template-unsaved-banner--floating">
    <span className="template-unsaved-banner__text">{message}</span>
    <div className="template-unsaved-banner__actions">
      <button
        onClick={onDiscard}
        className="template-action-button template-action-button--neutral template-action-button--compact"
      >
        {t('button.discard')}
      </button>
      <button
        ref={saveButtonRef}
        onClick={onSave}
        className="template-action-button template-action-button--primary template-action-button--compact"
      >
        {t('button.save')}
      </button>
    </div>
  </div>
);
