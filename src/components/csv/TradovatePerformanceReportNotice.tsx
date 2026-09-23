import React from 'react';

import { t } from '../../lang/helpers';
import {
  BrokerImportRecoveryNotice,
  type BrokerImportRecoveryPresentationProps,
} from './BrokerImportRecoveryNotice';
import { TRADOVATE_BROKER_GUIDE_URL } from './brokerGuides';

export const TradovatePerformanceReportNotice: React.FC<
  BrokerImportRecoveryPresentationProps
> = ({ className, disabled, iconSize }) => (
  <BrokerImportRecoveryNotice
    className={className}
    disabled={disabled}
    guideLabel={t('trade-import.preview.tradovate-performance.guide')}
    guideUrl={TRADOVATE_BROKER_GUIDE_URL}
    iconSize={iconSize}
    message={t('trade-import.preview.tradovate-performance.message')}
    title={t('trade-import.preview.tradovate-performance.title')}
  />
);
