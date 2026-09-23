import React from 'react';

import { t } from '../../lang/helpers';
import {
  BrokerImportRecoveryNotice,
  type BrokerImportRecoveryPresentationProps,
} from './BrokerImportRecoveryNotice';
import { DEEPCHARTS_BROKER_GUIDE_URL } from './brokerGuides';

export const DeepChartsSourceNotice: React.FC<
  BrokerImportRecoveryPresentationProps
> = ({ className, disabled, iconSize, onSwitchSource, selectedSource }) => (
  <BrokerImportRecoveryNotice
    actionLabel={t('trade-import.source-recovery.deepcharts.switch')}
    className={className}
    disabled={disabled}
    guideLabel={t('trade-import.source-recovery.deepcharts.guide')}
    guideUrl={DEEPCHARTS_BROKER_GUIDE_URL}
    iconSize={iconSize}
    message={t(
      selectedSource === 'RITHMIC'
        ? 'trade-import.source-recovery.deepcharts.rithmic-message'
        : 'trade-import.source-recovery.deepcharts.manual-message'
    )}
    onSwitchSource={onSwitchSource}
    title={t('trade-import.source-recovery.deepcharts.title')}
  />
);
