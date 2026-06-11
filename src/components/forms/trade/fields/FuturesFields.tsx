

import React from 'react';
import { NumberInput } from '../../../core';
import { TradeFormData, TradeFormErrors, TradeFormValue } from '../types';
import { t } from '../../../../lang/helpers';

interface FuturesFieldsProps {
  
  data: Partial<TradeFormData>;
  
  errors: TradeFormErrors;
  
  onChange: (field: keyof TradeFormData, value: TradeFormValue) => void;
}


const FuturesFieldsComponent: React.FC<FuturesFieldsProps> = ({
  data,
  errors,
  onChange,
}) => {
  return (
    <>
      <div className="field">
        <NumberInput
          label={t('form.field.dollars-per-point')}
          value={data.dollarPerPoint}
          onChange={(value) => onChange('dollarPerPoint', value)}
          error={errors.dollarPerPoint}
          min={0.01}
          precision={2}
          allowDecimal={true}
          required={true}
          placeholder={t('form.placeholder.futures-point-value')}
        />
      </div>

      <div className="twoColumnLayout">
        <div className="field">
          <NumberInput
            label={t('form.field.tick-size')}
            value={data.tickSize}
            onChange={(value) => onChange('tickSize', value)}
            error={errors.tickSize}
            min={0}
            precision={2}
            allowDecimal={true}
          />
        </div>

        <div className="field">
          <NumberInput
            label={t('form.field.tick-value')}
            value={data.tickValue}
            onChange={(value) => onChange('tickValue', value)}
            error={errors.tickValue}
            min={0}
            precision={2}
            allowDecimal={true}
          />
        </div>
      </div>
    </>
  );
};

export const FuturesFields = React.memo(FuturesFieldsComponent);
