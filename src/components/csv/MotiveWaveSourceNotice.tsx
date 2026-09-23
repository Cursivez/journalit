import React from 'react';

import { t } from '../../lang/helpers';
import {
  BrokerImportRecoveryNotice,
  type BrokerImportRecoveryPresentationProps,
} from './BrokerImportRecoveryNotice';
import { MOTIVEWAVE_BROKER_GUIDE_URL } from './brokerGuides';

export const MotiveWaveSourceNotice: React.FC<
  BrokerImportRecoveryPresentationProps
> = ({ className, disabled, iconSize, onSwitchSource }) => (
  <BrokerImportRecoveryNotice
    actionLabel={t('trade-import.source-recovery.motivewave.switch')}
    className={className}
    disabled={disabled}
    guideLabel={t('trade-import.source-recovery.motivewave.guide')}
    guideUrl={MOTIVEWAVE_BROKER_GUIDE_URL}
    iconSize={iconSize}
    message={t('trade-import.source-recovery.motivewave.message')}
    onSwitchSource={onSwitchSource}
    title={t('trade-import.source-recovery.motivewave.title')}
  />
);
