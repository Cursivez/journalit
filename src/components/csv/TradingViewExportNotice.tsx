import React from 'react';

import { t } from '../../lang/helpers';
import {
  BrokerImportRecoveryNotice,
  type BrokerImportRecoveryPresentationProps,
} from './BrokerImportRecoveryNotice';
import { TRADINGVIEW_BROKER_GUIDE_URL } from './brokerGuides';

export const TradingViewExportNotice: React.FC<
  BrokerImportRecoveryPresentationProps
> = ({ className, disabled, iconSize }) => (
  <BrokerImportRecoveryNotice
    className={className}
    disabled={disabled}
    guideLabel={t('trade-import.preview.tradingview-export.guide')}
    guideUrl={TRADINGVIEW_BROKER_GUIDE_URL}
    iconSize={iconSize}
    message={t('trade-import.preview.tradingview-export.message')}
    title={t('trade-import.preview.tradingview-export.title')}
  />
);
