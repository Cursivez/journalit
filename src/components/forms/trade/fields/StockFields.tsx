

import React from 'react';
import { Input } from '../../../core';
import { t } from '../../../../lang/helpers';
import { TradeFormData, TradeFormErrors, TradeFormValue } from '../types';

interface StockFieldsProps {
  
  data: Partial<TradeFormData>;
  
  errors: TradeFormErrors;
  
  onChange: (field: keyof TradeFormData, value: TradeFormValue) => void;
}


const StockFieldsComponent: React.FC<StockFieldsProps> = ({
  data,
  errors,
  onChange,
}) => {
  return (
    <>
      <div className="field">
        <Input
          label={t('form.field.exchange')}
          placeholder={t('form.placeholder.exchange-stock')}
          value={data.exchange || ''}
          onChange={(value) => onChange('exchange', value)}
          error={errors.exchange}
        />
      </div>
    </>
  );
};

export const StockFields = React.memo(StockFieldsComponent);
