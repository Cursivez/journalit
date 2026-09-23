import React from 'react';

import { t } from '../../lang/helpers';
import {
  BrokerImportRecoveryNotice,
  type BrokerImportRecoveryPresentationProps,
} from './BrokerImportRecoveryNotice';
import { METATRADER_BROKER_GUIDE_URL } from './brokerGuides';

export const MetaTraderStatementNotice: React.FC<
  BrokerImportRecoveryPresentationProps
> = ({ className, disabled, iconSize }) => (
  <BrokerImportRecoveryNotice
    className={className}
    disabled={disabled}
    guideLabel={t('trade-import.preview.metatrader-statement.guide')}
    guideUrl={METATRADER_BROKER_GUIDE_URL}
    iconSize={iconSize}
    message={t('trade-import.preview.metatrader-statement.message')}
    title={t('trade-import.preview.metatrader-statement.title')}
  />
);
