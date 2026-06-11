

import React, { useEffect } from 'react';
import { ensureSharedComponentStyles } from '../../styles/sharedComponentStyles';
import { cssVars } from '../../styles/inlineStylePolicy';
import { t } from '../../lang/helpers';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  fullscreen?: boolean;
  overlay?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message,
  size = 'medium',
  fullscreen = false,
  overlay = false,
}) => {
  const displayMessage = message ?? t('common.loading');
  
  useEffect(() => {}, []);

  
  const spinnerSize = size === 'small' ? 16 : size === 'large' ? 32 : 24;

  const content = (
    <div
      className={`journalit-loading-spinner ${size}`}
      style={cssVars({ '--spinner-size': `${spinnerSize}px` })}
    >
      <div className="journalit-spinner-icon" />
      {displayMessage && (
        <span className="loading-message">{displayMessage}</span>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div className="journalit-loading-overlay">
        <div className="journalit-loading-overlay-content">{content}</div>
      </div>
    );
  }

  if (fullscreen) {
    return <div className="journalit-loading-fullscreen">{content}</div>;
  }

  return content;
};
