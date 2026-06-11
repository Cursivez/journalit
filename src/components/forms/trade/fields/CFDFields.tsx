

import React from 'react';
import { NumberInput } from '../../../core';
import { TradeFormData, TradeFormErrors, TradeFormValue } from '../types';
import { t } from '../../../../lang/helpers';

interface CFDFieldsProps {
  
  data: Partial<TradeFormData>;
  
  errors: TradeFormErrors;
  
  onChange: (field: keyof TradeFormData, value: TradeFormValue) => void;
}


const CFDFieldsComponent: React.FC<CFDFieldsProps> = ({
  data,
  errors,
  onChange,
}) => {
  return (
    <>
      <div className="field">
        <NumberInput
          label={t('form.field.contract-size')}
          value={data.contractSize}
          onChange={(value) => onChange('contractSize', value)}
          error={errors.contractSize}
          min={1}
          precision={0}
          allowDecimal={false}
        />
      </div>

      <div className="field">
        <NumberInput
          label={t('form.field.leverage-ratio')}
          placeholder={t('form.placeholder.leverage')}
          value={data.leverageRatio}
          onChange={(value) => onChange('leverageRatio', value)}
          error={errors.leverageRatio}
          min={1}
          precision={0}
          allowDecimal={false}
        />
      </div>
    </>
  );
};

export const CFDFields = React.memo(CFDFieldsComponent);
