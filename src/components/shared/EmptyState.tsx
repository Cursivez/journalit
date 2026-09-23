

import React from 'react';
import { Ghost, Plus } from './icons/ObsidianIcon';
import { t } from '../../lang/helpers';

interface EmptyStateProps {
  
  message?: string;
  
  className?: string;
  
  iconSize?: number;
  
  subMessage?: string;
  
  actionButtonText?: string;
  
  actionIcon?: React.ReactNode;
  
  onActionButtonClick?: () => void;
  
  actionButtonRef?: React.Ref<HTMLButtonElement>;
  
  secondaryActionButtonText?: string;
  
  onSecondaryActionButtonClick?: () => void;
  
  additionalAction?: React.ReactNode;
  
  actionsLayout?: 'row' | 'stacked';
}




export const EmptyState: React.FC<EmptyStateProps> = ({
  message = t('shared.empty-state.message'),
  className = '',
  iconSize = 48,
  subMessage,
  actionButtonText,
  actionIcon,
  onActionButtonClick,
  actionButtonRef,
  secondaryActionButtonText,
  onSecondaryActionButtonClick,
  additionalAction,
  actionsLayout = 'row',
}) => {
  return (
    <div className={`journalit-empty-state ${className}`}>
      <div className="journalit-empty-state-icon">
        <Ghost size={iconSize} />
      </div>
      <div className="journalit-empty-state-content">
        <p className="journalit-empty-state-message">{message}</p>
        {subMessage && (
          <p className="journalit-empty-state-submessage">{subMessage}</p>
        )}
        {(actionButtonText ||
          secondaryActionButtonText ||
          additionalAction) && (
          <div
            className={`journalit-empty-state-actions${actionsLayout === 'stacked' ? ' journalit-empty-state-actions--stacked' : ''}`}
          >
            {actionButtonText && onActionButtonClick && (
              <button
                ref={actionButtonRef}
                type="button"
                className="journalit-empty-state-action-button"
                onClick={onActionButtonClick}
              >
                {actionIcon ?? (
                  <Plus
                    size={16}
                    className="journalit-empty-state-action-icon"
                  />
                )}
                {actionButtonText}
              </button>
            )}
            {secondaryActionButtonText && onSecondaryActionButtonClick && (
              <button
                type="button"
                className="journalit-empty-state-secondary-action-button"
                onClick={onSecondaryActionButtonClick}
              >
                <Plus size={16} className="journalit-empty-state-action-icon" />
                {secondaryActionButtonText}
              </button>
            )}
            {additionalAction}
          </div>
        )}
      </div>
    </div>
  );
};

export {};
