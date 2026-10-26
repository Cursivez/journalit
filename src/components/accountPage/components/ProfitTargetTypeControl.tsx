

import React from 'react';
import { t } from '../../../lang/helpers';
import { ProfitTargetType } from '../../../services/account/types';
import { SegmentedControl } from '../../shared/SegmentedControl';

export function ProfitTargetTypeControl({
  labelId,
  value,
  disabled,
  onChange,
}: {
  labelId: string;
  value: ProfitTargetType;
  disabled: boolean;
  onChange: (value: ProfitTargetType) => void;
}) {
  return (
    <SegmentedControl<ProfitTargetType>
      options={[
        {
          value: ProfitTargetType.ABSOLUTE,
          label: t('account.profit-target.type.absolute'),
        },
        {
          value: ProfitTargetType.PERCENTAGE,
          label: t('account.profit-target.type.percentage'),
        },
      ]}
      value={value}
      groupRole="radiogroup"
      ariaLabelledBy={labelId}
      fullWidth
      disabled={disabled}
      onChange={onChange}
    />
  );
}
