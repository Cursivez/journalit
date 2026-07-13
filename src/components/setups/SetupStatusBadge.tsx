import React from 'react';

import type { SetupStatus } from '../../services/setup/types';
import { getStatusLabel } from './setupsViewModel';

export const SetupStatusBadge: React.FC<{ status: SetupStatus }> = ({
  status,
}) => (
  <span className={`journalit-setups-badge journalit-setups-badge--${status}`}>
    {getStatusLabel(status)}
  </span>
);

SetupStatusBadge.displayName = 'SetupStatusBadge';
