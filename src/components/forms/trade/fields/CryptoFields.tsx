

import React from 'react';
import { Input } from '../../../core';
import { TradeFormData, TradeFormValue, TradeFormErrors } from '../types';
import { t } from '../../../../lang/helpers';

interface CryptoFieldsProps {
  
  data: Partial<TradeFormData>;
  
  errors: TradeFormErrors;
  
  onChange: (field: keyof TradeFormData, value: TradeFormValue) => void;
}


const CryptoFieldsComponent: React.FC<CryptoFieldsProps> = ({
  data,
  errors,
  onChange,
}) => {
  return (
    <>
      <div className="field">
        <Input
          label={t('form.field.exchange')}
          placeholder={t('form.placeholder.exchange-crypto')}
          value={data.cryptoExchange || ''}
          onChange={(value) => onChange('cryptoExchange', value)}
          error={errors.cryptoExchange}
        />
      </div>
    </>
  );
};

export const CryptoFields = React.memo(CryptoFieldsComponent);
