

import React from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  type ObsidianIconComponent,
} from '../../../../components/shared/icons/ObsidianIcon';

export type BrokerConnectionTone = 'success' | 'pending' | 'error';

const TONE_ICONS: Record<BrokerConnectionTone, ObsidianIconComponent> = {
  success: CheckCircle2,
  pending: Clock,
  error: AlertCircle,
};

interface BrokerConnectionStatusProps {
  tone: BrokerConnectionTone;
  
  label: string;
}

export const BrokerConnectionStatus: React.FC<BrokerConnectionStatusProps> = ({
  tone,
  label,
}) => {
  const Icon = TONE_ICONS[tone];
  return (
    <span className="journalit-broker-connection-status">
      <Icon size={18} className={`status-icon status-icon--${tone}`} />
      {label}
    </span>
  );
};

BrokerConnectionStatus.displayName = 'BrokerConnectionStatus';
