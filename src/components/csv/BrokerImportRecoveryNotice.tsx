import React from 'react';

import { openExternalUrl } from '../../utils/externalLinks';
import { AlertTriangle, ExternalLink } from '../shared/icons/ObsidianIcon';

interface BrokerImportRecoveryNoticeProps {
  className: string;
  disabled?: boolean;
  iconSize: number;
  onSwitchSource?: () => void;
  actionLabel?: string;
  
  continueLabel?: string;
  onContinue?: () => void;
  guideLabel?: string;
  
  guideUrl?: string;
  message: string;
  title: string;
}

export const BrokerImportRecoveryNotice: React.FC<
  BrokerImportRecoveryNoticeProps
> = ({
  className,
  actionLabel,
  continueLabel,
  disabled = false,
  guideLabel,
  guideUrl,
  iconSize,
  message,
  onContinue,
  onSwitchSource,
  title,
}) => (
  <div className={className}>
    <AlertTriangle size={iconSize} />
    <div className="journalit-broker-import-recovery-guidance">
      <strong>{title}</strong>
      <p>{message}</p>
      <div className="journalit-broker-import-recovery-actions">
        {actionLabel && onSwitchSource && (
          <button
            type="button"
            className="journalit-trade-import-recovery-switch"
            disabled={disabled}
            onClick={onSwitchSource}
          >
            {actionLabel}
          </button>
        )}
        {continueLabel && onContinue && (
          <button
            type="button"
            className="journalit-trade-import-recovery-continue"
            disabled={disabled}
            onClick={onContinue}
          >
            {continueLabel}
          </button>
        )}
        {guideUrl && guideLabel && (
          <button
            type="button"
            className="journalit-trade-import-guide-link"
            disabled={disabled}
            onClick={() => openExternalUrl(guideUrl)}
          >
            {guideLabel}
            <ExternalLink size={13} aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  </div>
);
