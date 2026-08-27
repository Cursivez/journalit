

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
  
  secondaryActionButtonText?: string;
  
  onSecondaryActionButtonClick?: () => void;
}




export const EmptyState: React.FC<EmptyStateProps> = ({
  message = t('shared.empty-state.message'),
  className = '',
  iconSize = 48,
  subMessage,
  actionButtonText,
  actionIcon,
  onActionButtonClick,
  secondaryActionButtonText,
  onSecondaryActionButtonClick,
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
        {(actionButtonText || secondaryActionButtonText) && (
          <div className="journalit-empty-state-actions">
            {actionButtonText && onActionButtonClick && (
              <button
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
                className="journalit-empty-state-secondary-action-button"
                onClick={onSecondaryActionButtonClick}
              >
                <Plus size={16} className="journalit-empty-state-action-icon" />
                {secondaryActionButtonText}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export {};
