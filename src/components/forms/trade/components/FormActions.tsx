

import React from 'react';
import { Button } from '../../../ui/Button';
import { TradeFormErrors } from '../types';
import { hasFormErrors } from '../validation';
import { t } from '../../../../lang/helpers';

interface FormActionsProps {
  onCancel?: () => void;
  isSubmitting: boolean;
  errors: TradeFormErrors;
  isEditMode: boolean;
  hasEntryTime: boolean;
  disabledReason?: string;
}

export const FormActions: React.FC<FormActionsProps> = ({
  onCancel,
  isSubmitting,
  errors,
  isEditMode,
  hasEntryTime,
  disabledReason,
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
    Boolean(disabledReason) || hasFormErrors(errors) || isSubmitting;

  return (
    <div className="formActionsWrapper">
      <div className="formActions">
        {onCancel && (
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="cancelButton"
          >
            {t('button.cancel')}
          </Button>
        )}

        <Button
          type="submit"
          variant="primary"
          loading={isSubmitting}
          disabled={isSubmitDisabled}
          className="submitButton"
          title={disabledReason}
        >
          {getSubmitButtonText()}
        </Button>
      </div>

      {disabledReason && (
        <div className="formSubmitHelperText" role="status">
          {disabledReason}
        </div>
      )}
    </div>
  );
};
