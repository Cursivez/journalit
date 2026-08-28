

import React from 'react';
import { t } from '../../../../lang/helpers';

interface BrokerInlineHintProps {
  message: string;
}

export const BrokerInlineHint: React.FC<BrokerInlineHintProps> = ({
  message,
}) => (
  <p className="journalit-broker-mapping-hint" role="note">
    {message}
  </p>
);

BrokerInlineHint.displayName = 'BrokerInlineHint';


export const BrokerUnsavedMappingHint: React.FC = () => (
  <BrokerInlineHint message={t('trade-sync.broker.mapping-unsaved-hint')} />
);

BrokerUnsavedMappingHint.displayName = 'BrokerUnsavedMappingHint';
