

import React from 'react';
import { t } from '../../../lang/helpers';

interface InvalidContextMessageProps {
  widgetType: string;
  reason?: string;
}

export const InvalidContextMessage: React.FC<InvalidContextMessageProps> =
  React.memo(({ widgetType, reason }) => {
    const defaultMessage = t('widget.invalid-context.default', { widgetType });
    const displayMessage = reason || defaultMessage;

    return (
      <div className="journalit-reviewv2-invalid-context">
        <div className="journalit-reviewv2-invalid-context-title">
          {t('widget.invalid-context.title')}
        </div>
        <div className="journalit-reviewv2-invalid-context-reason">
          {displayMessage}
        </div>
      </div>
    );
  });

InvalidContextMessage.displayName = 'InvalidContextMessage';
