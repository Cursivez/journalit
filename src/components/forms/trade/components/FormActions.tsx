

import React from 'react';
import { Button } from '../../../ui/Button';
import { TradeFormErrors } from '../types';
import { hasFormErrors } from '../validation';
import { t } from '../../../../lang/helpers';

interface FormActionsProps {
  onCancel?: () => void;
  onImportTrades?: () => void;
  isSubmitting: boolean;
  errors: TradeFormErrors;
  submissionState?: 'idle' | 'retryable-error';
  isEditMode: boolean;
  hasEntryTime: boolean;
  disabledReason?: string;
  footerSummary?: React.ReactNode;
}

export const FormActions: React.FC<FormActionsProps> = ({
  onCancel,
  onImportTrades,
  isSubmitting,
  errors,
  submissionState = 'idle',
  isEditMode,
  hasEntryTime,
  disabledReason,
  footerSummary,
}) => {
  
  const getSubmitButtonText = () => {
    if (isEditMode) {
      return t('button.update-trade');
    } else if (hasEntryTime) {
      return t('button.save-changes');
    } else {
      return t('button.add-trade');
    }
  };

  const isSubmitDisabled =
    Boolean(disabledReason) ||
    (hasFormErrors(errors) && submissionState !== 'retryable-error') ||
    isSubmitting;

  return (
    <div className="formActionsWrapper">
      {footerSummary}
      <div className="formActions">
        <div className="formActionsLeft">
          {onCancel && (
            <Button
              variant="plain"
              onClick={onCancel}
              disabled={isSubmitting}
              className="cancelButton cancel-button"
            >
              {t('button.cancel')}
            </Button>
          )}
        </div>

        <div className="formActionsRight">
          {onImportTrades && (
            <Button
              variant="secondary"
              onClick={onImportTrades}
              disabled={isSubmitting}
              className="importTradesButton"
            >
              {t('form.import-shortcut.open')}
            </Button>
          )}

          <Button
            type="submit"
            variant="primary"
            loading={isSubmitting}
            disabled={isSubmitDisabled}
            className="submitButton create-account-button accent-button modal-save-accent"
            title={disabledReason}
          >
            {getSubmitButtonText()}
          </Button>
        </div>
      </div>

      {disabledReason && (
        <div className="formSubmitHelperText" role="status">
          {disabledReason}
        </div>
      )}
    </div>
  );
};
