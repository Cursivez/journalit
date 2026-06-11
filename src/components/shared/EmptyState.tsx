

import React from 'react';
import { Ghost, Plus } from './icons/ObsidianIcon';
import { t } from '../../lang/helpers';

interface EmptyStateProps {
  
  message?: string;
  
  className?: string;
  
  iconSize?: number;
  
  subMessage?: string;
  
  actionButtonText?: string;
  
  onActionButtonClick?: () => void;
}




export const EmptyState: React.FC<EmptyStateProps> = ({
  message = t('shared.empty-state.message'),
  className = '',
  iconSize = 48,
  subMessage,
  actionButtonText,
  onActionButtonClick,
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
        {actionButtonText && onActionButtonClick && (
          <button
            className="journalit-empty-state-action-button"
            onClick={onActionButtonClick}
          >
            <Plus size={16} className="journalit-empty-state-action-icon" />
            {actionButtonText}
          </button>
        )}
      </div>
    </div>
  );
};

export {};
