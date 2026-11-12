

import React, { useId, useState } from 'react';
import { t } from '../../lang/helpers';
import { Button } from '../ui/Button';
import { SegmentedControl } from '../shared/SegmentedControl';
import { CustomFieldType } from '../../types/customFields';
import {
  inferColumnCustomFieldType,
  validateNewCustomFieldLabel,
  type ColumnCustomFieldType,
  type NewCustomFieldLabelError,
} from './customFieldFromColumn';

export interface NewColumnCustomField {
  label: string;
  type: ColumnCustomFieldType;
}

const TYPE_OPTIONS: ReadonlyArray<[ColumnCustomFieldType, () => string]> = [
  [CustomFieldType.TEXT, () => t('trade-import.custom-field.type.text')],
  [CustomFieldType.NUMBER, () => t('trade-import.custom-field.type.number')],
  [
    CustomFieldType.DROPDOWN,
    () => t('trade-import.custom-field.type.dropdown'),
  ],
];


function labelErrorMessage(
  error: Exclude<NewCustomFieldLabelError, 'empty'>
): string {
  switch (error) {
    case 'reserved':
      return t('trade-import.custom-field.error.reserved');
    case 'duplicate':
      return t('error.settings.field-name-conflict');
  }
}

export const CreateCustomFieldFromColumn: React.FC<{
  header: string;
  sampleValues: readonly string[];
  existingLabels: readonly string[];
  onCreate: (field: NewColumnCustomField) => Promise<void>;
  onCancel: () => void;
}> = ({ header, sampleValues, existingLabels, onCreate, onCancel }) => {
  const nameId = useId();
  const [label, setLabel] = useState(() => header.trim());
  const [type, setType] = useState<ColumnCustomFieldType>(() =>
    inferColumnCustomFieldType(sampleValues)
  );
  const [saving, setSaving] = useState(false);
  const labelError = validateNewCustomFieldLabel(label, existingLabels);
  const disabled = saving;

  const create = async () => {
    if (labelError) return;
    setSaving(true);
    try {
      await onCreate({ label: label.trim(), type });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="journalit-trade-import-new-field">
      <p className="journalit-trade-import-new-field__hint">
        {t('trade-import.custom-field.hint')}
      </p>
      <div className="journalit-trade-import-new-field__controls">
        <label
          className="journalit-trade-import-new-field__name"
          htmlFor={nameId}
        >
          <span>{t('trade-import.custom-field.name')}</span>
          <input
            id={nameId}
            type="text"
            value={label}
            disabled={disabled}
            aria-invalid={labelError !== null}
            onChange={(event) => setLabel(event.target.value)}
            onKeyDown={(event) => {
              
              if (event.key === 'Enter') void create();
            }}
          />
        </label>
        <SegmentedControl<ColumnCustomFieldType>
          options={TYPE_OPTIONS.map(([value, optionLabel]) => ({
            value,
            label: optionLabel(),
          }))}
          value={type}
          onChange={setType}
          disabled={disabled}
          groupRole="radiogroup"
          ariaLabel={t('trade-import.custom-field.type')}
        />
      </div>
      {labelError && labelError !== 'empty' && (
        <p className="journalit-trade-import-new-field__error">
          {labelErrorMessage(labelError)}
        </p>
      )}
      <div className="journalit-trade-import-new-field__actions">
        <Button size="small" disabled={disabled} onClick={onCancel}>
          {t('button.cancel')}
        </Button>
        <Button
          variant="primary"
          size="small"
          disabled={disabled || labelError !== null}
          loading={saving}
          onClick={create}
        >
          {t('trade-import.custom-field.create')}
        </Button>
      </div>
    </div>
  );
};
