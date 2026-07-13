

import React from 'react';
import { TradeFormData, TradeFormErrors, TradeFormValue } from '../types';
import { CommonFields } from '../fields/CommonFields';
import { MetadataFields } from '../fields/MetadataFields';
import { TradeFormLayoutSettings } from '../../../../settings/types';
import { getEditAwareVisibleOrderedTradeFormLayoutItems } from '../tradeFormLayoutConfig';

interface DetailsTabProps {
  data: Partial<TradeFormData>;
  errors: TradeFormErrors;
  onChange: (field: keyof TradeFormData, value: TradeFormValue) => void;
  accounts: Array<{ id: string; name: string }>;
  setups: Array<{ id: string; name: string }>;
  mistakes: Array<{ id: string; name: string }>;
  availableTags: string[];
  onAddImage: (file: File) => Promise<string>;
  onDeleteImage: (imagePath: string) => Promise<void>;
  layout: TradeFormLayoutSettings;
  isEditMode: boolean;
}

export const DetailsTab: React.FC<DetailsTabProps> = ({
  data,
  errors,
  onChange,
  accounts,
  setups,
  mistakes,
  availableTags,
  onAddImage,
  onDeleteImage,
  layout,
  isEditMode,
}) => {
  const commonFieldOrder = getEditAwareVisibleOrderedTradeFormLayoutItems(
    layout,
    ['setup', 'mistake', 'customTags', 'thesis'],
    data,
    isEditMode
  );
  const detailFieldOrder = getEditAwareVisibleOrderedTradeFormLayoutItems(
    layout,
    ['setup', 'mistake', 'customTags', 'thesis', 'attachments'],
    data,
    isEditMode
  );

  const renderDetailFieldGroup = (fieldId: string) => {
    if (fieldId === 'attachments') {
      return detailFieldOrder.includes('attachments') ? (
        <div
          key="attachments"
          className="trade-form-details-block trade-form-details-block--attachments"
        >
          <MetadataFields
            data={data}
            onChange={onChange}
            availableTags={availableTags}
            onAddImage={onAddImage}
            onDeleteImage={onDeleteImage}
            sourcePath={data.filePath || ''}
          />
        </div>
      ) : null;
    }

    const commonField = commonFieldOrder.find(
      (commonFieldId) => commonFieldId === fieldId
    );
    if (!commonField) return null;

    return (
      <div
        key={commonField}
        className={`trade-form-details-block trade-form-details-block--${commonField}`}
      >
        <CommonFields
          data={data}
          errors={errors}
          onChange={onChange}
          accounts={accounts}
          setups={setups}
          mistakes={mistakes}
          fieldOrder={[commonField]}
        />
      </div>
    );
  };

  return (
    <div className="trade-form-details-tab">
      {detailFieldOrder.map(renderDetailFieldGroup)}
    </div>
  );
};
