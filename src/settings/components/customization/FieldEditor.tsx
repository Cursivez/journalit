

import React, { useState, memo } from 'react';
import { Trash } from '../../../components/shared/icons/ObsidianIcon';
import {
  CustomFieldDefinition,
  CustomFieldType,
  RESERVED_FRONTMATTER_KEYS,
  labelToFieldKey,
  validateFieldLabel,
  type CustomFieldTradeLogMultiselectCollapsedDisplay,
} from '../../../types/customFields';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/core/Select';
import { NumberInput } from '../../../components/core/NumberInput';
import { Input } from '../../../components/core/Input';
import { t } from '../../../lang/helpers';
import { cssVars } from '../../../styles/inlineStylePolicy';

const parseCustomFieldType = (value: string): CustomFieldType | null => {
  switch (value) {
    case 'text':
      return CustomFieldType.TEXT;
    case 'number':
      return CustomFieldType.NUMBER;
    case 'dropdown':
      return CustomFieldType.DROPDOWN;
    case 'multiselect':
      return CustomFieldType.MULTISELECT;
    case 'date':
      return CustomFieldType.DATE;
    case 'datetime':
      return CustomFieldType.DATETIME;
    case 'time':
      return CustomFieldType.TIME;
    default:
      return null;
  }
};

const parseMultiselectCollapsedDisplay = (
  value: string
): CustomFieldTradeLogMultiselectCollapsedDisplay =>
  value === 'values' ? 'values' : 'count';

interface FieldEditorProps {
  field: CustomFieldDefinition;
  isNewField: boolean;
  onSave: (field: CustomFieldDefinition) => void | Promise<void>;
  onCancel: () => void | Promise<void>;
  onDelete: (fieldId: string) => void | Promise<void>;
  generateUniqueKey: (label: string, excludeFieldId?: string) => string;
  validateLabel?: (label: string, excludeFieldId?: string) => string | null;
}

const fieldTypeOptions = [
  {
    value: CustomFieldType.TEXT,
    label: t('settings.customization.custom-fields.type.text'),
  },
  {
    value: CustomFieldType.NUMBER,
    label: t('settings.customization.custom-fields.type.number'),
  },
  {
    value: CustomFieldType.DROPDOWN,
    label: t('settings.customization.custom-fields.type-dropdown'),
  },
  {
    value: CustomFieldType.MULTISELECT,
    label: t('settings.customization.custom-fields.type-multiselect'),
  },
  {
    value: CustomFieldType.DATE,
    label: t('settings.customization.custom-fields.type.date'),
  },
  {
    value: CustomFieldType.DATETIME,
    label: t('settings.customization.custom-fields.type.datetime'),
  },
  {
    value: CustomFieldType.TIME,
    label: t('settings.customization.custom-fields.type.time'),
  },
];

interface FieldEditorTradeLogSettingsProps {
  editingField: CustomFieldDefinition;
  handleFieldChange: (
    field: keyof CustomFieldDefinition,
    value: unknown
  ) => void | Promise<void>;
  handleTradeLogChange: (
    field:
      | 'columnLabel'
      | 'displayAsCurrency'
      | 'multiselectCollapsedDisplay'
      | 'dropdownSortMode',
    value: string | boolean | undefined
  ) => void | Promise<void>;
}

const FieldEditorTradeLogSettings: React.FC<
  FieldEditorTradeLogSettingsProps
> = ({ editingField, handleTradeLogChange }) => (
  <>
    <div className="setting-item">
      <div className="setting-item-info">
        <div className="setting-item-name">
          {t('settings.customization.custom-fields.editor.trade-log')}
        </div>
        <div className="setting-item-description">
          {t('settings.customization.custom-fields.editor.trade-log-desc')}
        </div>
      </div>
    </div>

    <div className="setting-item">
      <div className="setting-item-info">
        <div className="setting-item-name">
          {t('settings.customization.custom-fields.editor.column-label')}
        </div>
        <div className="setting-item-description">
          {t('settings.customization.custom-fields.editor.column-label-desc')}
        </div>
      </div>
      <div className="setting-item-control">
        <Input
          type="text"
          value={editingField.tradeLog?.columnLabel || ''}
          onChange={(value) =>
            handleTradeLogChange('columnLabel', value || undefined)
          }
          aria-label={t(
            'settings.customization.custom-fields.editor.column-label'
          )}
          placeholder={t(
            'settings.customization.custom-fields.editor.column-label-placeholder'
          )}
          size="md"
          onKeyDown={(e) => {
            if (e.key === 'Enter') e.preventDefault();
          }}
        />
      </div>
    </div>

    {editingField.type === CustomFieldType.NUMBER && (
      <div className="setting-item">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t(
              'settings.customization.custom-fields.editor.display-as-currency'
            )}
          </div>
          <div className="setting-item-description">
            {t(
              'settings.customization.custom-fields.editor.display-as-currency-desc'
            )}
          </div>
        </div>
        <div className="setting-item-control">
          <input
            type="checkbox"
            checked={editingField.tradeLog?.displayAsCurrency || false}
            onChange={(e) =>
              void handleTradeLogChange('displayAsCurrency', e.target.checked)
            }
            className="custom-fields-checkbox"
          />
        </div>
      </div>
    )}

    {editingField.type === CustomFieldType.DROPDOWN && (
      <div className="setting-item">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('settings.customization.custom-fields.editor.dropdown-sort')}
          </div>
          <div className="setting-item-description">
            {t(
              'settings.customization.custom-fields.editor.dropdown-sort-desc'
            )}
          </div>
        </div>
        <div className="setting-item-control">
          <Select
            aria-label={t(
              'settings.customization.custom-fields.editor.dropdown-sort'
            )}
            options={[
              {
                value: 'disabled',
                label: t(
                  'settings.customization.custom-fields.editor.dropdown-sort.disabled'
                ),
              },
              {
                value: 'alphabetical',
                label: t(
                  'settings.customization.custom-fields.editor.dropdown-sort.alphabetical'
                ),
              },
              {
                value: 'numeric',
                label: t(
                  'settings.customization.custom-fields.editor.dropdown-sort.numeric'
                ),
              },
              {
                value: 'option-order',
                label: t(
                  'settings.customization.custom-fields.editor.dropdown-sort.option-order'
                ),
              },
            ]}
            value={editingField.tradeLog?.dropdownSortMode || 'disabled'}
            onChange={(value) =>
              handleTradeLogChange(
                'dropdownSortMode',
                value === 'disabled' ? undefined : value
              )
            }
          />
        </div>
      </div>
    )}

    {editingField.type === CustomFieldType.MULTISELECT && (
      <div className="setting-item">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t(
              'settings.customization.custom-fields.editor.multiselect-collapsed-display'
            )}
          </div>
          <div className="setting-item-description">
            {t(
              'settings.customization.custom-fields.editor.multiselect-collapsed-display-desc'
            )}
          </div>
        </div>
        <div className="setting-item-control">
          <Select
            aria-label={t(
              'settings.customization.custom-fields.editor.multiselect-collapsed-display'
            )}
            options={[
              {
                value: 'count',
                label: t(
                  'settings.customization.custom-fields.editor.multiselect-collapsed-display.count'
                ),
              },
              {
                value: 'values',
                label: t(
                  'settings.customization.custom-fields.editor.multiselect-collapsed-display.values'
                ),
              },
            ]}
            value={
              editingField.tradeLog?.multiselectCollapsedDisplay || 'count'
            }
            onChange={(value) =>
              handleTradeLogChange(
                'multiselectCollapsedDisplay',
                parseMultiselectCollapsedDisplay(value)
              )
            }
          />
        </div>
      </div>
    )}
  </>
);

interface FieldEditorValidationSettingsProps {
  editingField: CustomFieldDefinition;
  handleValidationChange: (
    validationField: string,
    value: unknown
  ) => void | Promise<void>;
}

const FieldEditorValidationSettings: React.FC<
  FieldEditorValidationSettingsProps
> = ({ editingField, handleValidationChange }) => (
  <>
    <div className="setting-item">
      <div className="setting-item-info">
        <div className="setting-item-name">
          {t('settings.customization.custom-fields.editor.validation')}
        </div>
        <div className="setting-item-description">
          {t('settings.customization.custom-fields.editor.validation-desc')}
        </div>
      </div>
    </div>

    <div className="setting-item">
      <div className="setting-item-info">
        <div className="setting-item-name">
          {t('settings.customization.custom-fields.editor.validation.required')}
        </div>
        <div className="setting-item-description">
          {t(
            'settings.customization.custom-fields.editor.validation.required-desc'
          )}
        </div>
      </div>
      <div className="setting-item-control">
        <input
          type="checkbox"
          checked={editingField.validation?.required || false}
          onChange={(e) =>
            void handleValidationChange('required', e.target.checked)
          }
          className="custom-fields-checkbox"
        />
      </div>
    </div>

    {editingField.type === CustomFieldType.TEXT && (
      <>
        <div className="setting-item">
          <div className="setting-item-info">
            <div className="setting-item-name">
              {t(
                'settings.customization.custom-fields.editor.validation.min-length'
              )}
            </div>
            <div className="setting-item-description">
              {t(
                'settings.customization.custom-fields.editor.validation.min-length-desc'
              )}
            </div>
          </div>
          <div className="setting-item-control">
            <NumberInput
              value={editingField.validation?.minLength || undefined}
              onChange={(value) => handleValidationChange('minLength', value)}
              min={0}
              placeholder={t(
                'settings.customization.custom-fields.editor.validation.no-min'
              )}
            />
          </div>
        </div>
        <div className="setting-item">
          <div className="setting-item-info">
            <div className="setting-item-name">
              {t(
                'settings.customization.custom-fields.editor.validation.max-length'
              )}
            </div>
            <div className="setting-item-description">
              {t(
                'settings.customization.custom-fields.editor.validation.max-length-desc'
              )}
            </div>
          </div>
          <div className="setting-item-control">
            <NumberInput
              value={editingField.validation?.maxLength || undefined}
              onChange={(value) => handleValidationChange('maxLength', value)}
              min={1}
              placeholder={t(
                'settings.customization.custom-fields.editor.validation.no-max'
              )}
            />
          </div>
        </div>
      </>
    )}

    {editingField.type === CustomFieldType.NUMBER && (
      <>
        <div className="setting-item">
          <div className="setting-item-info">
            <div className="setting-item-name">
              {t(
                'settings.customization.custom-fields.editor.validation.min-value'
              )}
            </div>
            <div className="setting-item-description">
              {t(
                'settings.customization.custom-fields.editor.validation.min-value-desc'
              )}
            </div>
          </div>
          <div className="setting-item-control">
            <NumberInput
              value={editingField.validation?.min || undefined}
              onChange={(value) => handleValidationChange('min', value)}
              allowDecimal={true}
              placeholder={t(
                'settings.customization.custom-fields.editor.validation.no-min'
              )}
            />
          </div>
        </div>
        <div className="setting-item">
          <div className="setting-item-info">
            <div className="setting-item-name">
              {t(
                'settings.customization.custom-fields.editor.validation.max-value'
              )}
            </div>
            <div className="setting-item-description">
              {t(
                'settings.customization.custom-fields.editor.validation.max-value-desc'
              )}
            </div>
          </div>
          <div className="setting-item-control">
            <NumberInput
              value={editingField.validation?.max || undefined}
              onChange={(value) => handleValidationChange('max', value)}
              allowDecimal={true}
              placeholder={t(
                'settings.customization.custom-fields.editor.validation.no-max'
              )}
            />
          </div>
        </div>
      </>
    )}
  </>
);

interface FieldEditorOptionsConfigProps {
  editingField: CustomFieldDefinition;
  newOption: string;
  optionError: string | null;
  setNewOption: (value: string) => void;
  setOptionError: (value: string | null) => void;
  isDuplicateOption: (option: string) => boolean;
  handleAddOption: () => void;
  handleRemoveOption: (index: number) => void | Promise<void>;
  handleMoveOption: (
    index: number,
    direction: 'up' | 'down'
  ) => void | Promise<void>;
  handleFieldChange: (
    field: keyof CustomFieldDefinition,
    value: unknown
  ) => void | Promise<void>;
}

const FieldEditorOptionsConfig: React.FC<FieldEditorOptionsConfigProps> = ({
  editingField,
  newOption,
  optionError,
  setNewOption,
  setOptionError,
  isDuplicateOption,
  handleAddOption,
  handleRemoveOption,
  handleMoveOption,
  handleFieldChange,
}) => (
  <>
    <div className="setting-item">
      <div className="setting-item-info">
        <div className="setting-item-name">
          {t('settings.customization.custom-fields.editor.options')}
        </div>
        <div className="setting-item-description">
          {t('settings.customization.custom-fields.editor.options-desc')}
        </div>
      </div>
    </div>

    {(editingField.options || []).map((option, index) => (
      <div key={option.value} className="setting-item">
        <div className="setting-item-info">
          <div className="setting-item-name">{option.label}</div>
        </div>
        <div className="setting-item-control">
          <div className="journalit-u-flex journalit-u-gap-8 journalit-u-items-center">
            <Button
              variant="outline"
              size="sm"
              className="custom-fields-option-move-button"
              onClick={() => handleMoveOption(index, 'up')}
              disabled={index === 0}
              aria-label={t('button.move-up')}
            >
              ↑
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="custom-fields-option-move-button"
              onClick={() => handleMoveOption(index, 'down')}
              disabled={index === (editingField.options || []).length - 1}
              aria-label={t('button.move-down')}
            >
              ↓
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRemoveOption(index)}
              aria-label={`${t('button.remove')}: ${option.label}`}
              className="custom-fields-option-delete-button"
            >
              <Trash size={14} aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    ))}

    <div className="setting-item">
      <div className="setting-item-info">
        <div className="setting-item-name">
          {t('settings.customization.custom-fields.editor.add-option')}
        </div>
        <div className="setting-item-description">
          {t('settings.customization.custom-fields.editor.add-option-desc')}
        </div>
      </div>
      <div className="setting-item-control">
        <div className="journalit-u-flex journalit-u-gap-8 journalit-u-items-center journalit-u-w-full">
          <div className="journalit-u-flex-1">
            <Input
              type="text"
              value={newOption}
              onChange={(value) => {
                setNewOption(value);
                setOptionError(
                  value.trim() && isDuplicateOption(value)
                    ? t('error.options.duplicate')
                    : null
                );
              }}
              placeholder={t(
                'settings.customization.custom-fields.editor.add-option-placeholder'
              )}
              size="md"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (newOption.trim()) {
                    handleAddOption();
                  }
                }
              }}
            />
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={() => void handleAddOption()}
            disabled={!newOption.trim() || !!optionError}
          >
            {t('button.add')}
          </Button>
        </div>
        {optionError && (
          <div className="setting-item-description custom-fields-label-error">
            {optionError}
          </div>
        )}
      </div>
    </div>

    {editingField.type === CustomFieldType.MULTISELECT && (
      <div className="setting-item">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('settings.customization.custom-fields.editor.allow-create')}
          </div>
          <div className="setting-item-description">
            {t('settings.customization.custom-fields.editor.allow-create-desc')}
          </div>
        </div>
        <div className="setting-item-control">
          <input
            type="checkbox"
            checked={editingField.allowCreateOptions || false}
            onChange={(e) =>
              void handleFieldChange('allowCreateOptions', e.target.checked)
            }
            className="custom-fields-checkbox"
          />
        </div>
      </div>
    )}
  </>
);

interface FieldEditorActionsProps {
  fieldId: string;
  labelValidationError: string | null;
  onDelete: (fieldId: string) => void | Promise<void>;
  onCancel: () => void | Promise<void>;
  onSave: () => void | Promise<void>;
}

const FieldEditorActions: React.FC<FieldEditorActionsProps> = ({
  fieldId,
  labelValidationError,
  onDelete,
  onCancel,
  onSave,
}) => (
  <div className="setting-item custom-fields-editor-actions">
    <Button
      variant="danger"
      onClick={() => void onDelete(fieldId)}
      className="custom-fields-delete-button"
    >
      {t('settings.customization.custom-fields.editor.delete')}
    </Button>
    <div className="custom-fields-editor-primary-actions">
      <Button variant="plain" onClick={onCancel}>
        {t('button.cancel')}
      </Button>
      <Button
        variant="primary"
        onClick={onSave}
        disabled={!!labelValidationError}
      >
        {t('settings.customization.custom-fields.editor.save')}
      </Button>
    </div>
  </div>
);

const useFieldEditorController = ({
  field,
  isNewField,
  onSave,
  generateUniqueKey,
  validateLabel,
}: Pick<
  FieldEditorProps,
  'field' | 'isNewField' | 'onSave' | 'generateUniqueKey' | 'validateLabel'
>) => {
  const [editingField, setEditingField] = useState<CustomFieldDefinition>({
    ...field,
  });
  const [newOption, setNewOption] = useState('');
  const [optionError, setOptionError] = useState<string | null>(null);

  const handleFieldChange = (
    field: keyof CustomFieldDefinition,
    value: unknown
  ) => {
    const updatedField = {
      ...editingField,
      [field]: value,
    };

    
    if (field === 'type') {
      
      const typesWithoutValidation = [
        CustomFieldType.DATE,
        CustomFieldType.DATETIME,
        CustomFieldType.DROPDOWN,
        CustomFieldType.MULTISELECT,
      ];

      const nextFieldType =
        typeof value === 'string' ? parseCustomFieldType(value) : null;
      if (nextFieldType && typesWithoutValidation.includes(nextFieldType)) {
        updatedField.validation = {};
      }

      
      if (
        value !== CustomFieldType.DROPDOWN &&
        value !== CustomFieldType.MULTISELECT
      ) {
        updatedField.options = [];
      }

      if (updatedField.tradeLog) {
        updatedField.tradeLog = {
          ...updatedField.tradeLog,
          displayAsCurrency:
            value === CustomFieldType.NUMBER
              ? updatedField.tradeLog.displayAsCurrency
              : undefined,
          multiselectCollapsedDisplay:
            value === CustomFieldType.MULTISELECT
              ? updatedField.tradeLog.multiselectCollapsedDisplay
              : undefined,
          dropdownSortMode:
            value === CustomFieldType.DROPDOWN
              ? updatedField.tradeLog.dropdownSortMode
              : undefined,
        };

        if (
          !updatedField.tradeLog.columnLabel &&
          !updatedField.tradeLog.displayAsCurrency &&
          !updatedField.tradeLog.multiselectCollapsedDisplay &&
          !updatedField.tradeLog.dropdownSortMode
        ) {
          updatedField.tradeLog = undefined;
        }
      }
    }

    
    
    
    if (field === 'label' && isNewField) {
      updatedField.fieldKey = generateUniqueKey(
        typeof value === 'string' ? value : '',
        editingField.id
      );
    }

    setEditingField(updatedField);
  };

  const handleValidationChange = (validationField: string, value: unknown) => {
    setEditingField((prev) => ({
      ...prev,
      validation: {
        ...prev.validation,
        [validationField]: value,
      },
    }));
  };

  const handleTradeLogChange = (
    field:
      | 'columnLabel'
      | 'displayAsCurrency'
      | 'multiselectCollapsedDisplay'
      | 'dropdownSortMode',
    value: string | boolean | undefined
  ) => {
    setEditingField((prev) => {
      const nextTradeLog = {
        ...prev.tradeLog,
        [field]: value,
      };

      if (
        field === 'columnLabel' &&
        (typeof value !== 'string' || value.trim().length === 0)
      ) {
        delete nextTradeLog.columnLabel;
      }

      if (field === 'displayAsCurrency' && value !== true) {
        delete nextTradeLog.displayAsCurrency;
      }

      if (
        field === 'multiselectCollapsedDisplay' &&
        value !== 'count' &&
        value !== 'values'
      ) {
        delete nextTradeLog.multiselectCollapsedDisplay;
      }

      if (
        field === 'dropdownSortMode' &&
        value !== 'alphabetical' &&
        value !== 'numeric' &&
        value !== 'option-order'
      ) {
        delete nextTradeLog.dropdownSortMode;
      }

      return {
        ...prev,
        tradeLog:
          Object.keys(nextTradeLog).length > 0 ? nextTradeLog : undefined,
      };
    });
  };

  const isDuplicateOption = (optionName: string): boolean => {
    const normalizedOptionName = optionName.trim().toLowerCase();
    return (editingField.options || []).some(
      (option) =>
        option.value.trim().toLowerCase() === normalizedOptionName ||
        option.label.trim().toLowerCase() === normalizedOptionName
    );
  };

  const handleAddOption = () => {
    const trimmedOption = newOption.trim();
    if (!trimmedOption) {
      return;
    }

    if (isDuplicateOption(trimmedOption)) {
      setOptionError(t('error.options.duplicate'));
      return;
    }

    const newOptions = [
      ...(editingField.options || []),
      { value: trimmedOption, label: trimmedOption },
    ];
    setEditingField((prev) => ({
      ...prev,
      options: newOptions,
    }));
    setNewOption('');
    setOptionError(null);
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = [...(editingField.options || [])];
    newOptions.splice(index, 1);
    setEditingField((prev) => ({
      ...prev,
      options: newOptions,
    }));
  };

  const handleMoveOption = (index: number, direction: 'up' | 'down') => {
    setEditingField((prev) => {
      const currentOptions = [...(prev.options || [])];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;

      if (targetIndex < 0 || targetIndex >= currentOptions.length) {
        return prev;
      }

      [currentOptions[index], currentOptions[targetIndex]] = [
        currentOptions[targetIndex],
        currentOptions[index],
      ];

      return {
        ...prev,
        options: currentOptions,
      };
    });
  };

  const shouldValidateLabel =
    isNewField || editingField.label.trim() !== field.label.trim();
  const labelValidationError = shouldValidateLabel
    ? (validateLabel?.(editingField.label, editingField.id) ??
      validateFieldLabel(editingField.label))
    : null;
  const derivedLabelKey = labelToFieldKey(editingField.label);

  const handleSave = () => {
    if (labelValidationError) {
      return;
    }

    void onSave(editingField);
  };

  const showValidationOptions = true; 
  const showOptionsConfig = [
    CustomFieldType.DROPDOWN,
    CustomFieldType.MULTISELECT,
  ].includes(editingField.type);

  return {
    editingField,
    setEditingField,
    newOption,
    setNewOption,
    optionError,
    setOptionError,
    handleFieldChange,
    handleValidationChange,
    handleTradeLogChange,
    isDuplicateOption,
    handleAddOption,
    handleRemoveOption,
    handleMoveOption,
    labelValidationError,
    derivedLabelKey,
    handleSave,
    showValidationOptions,
    showOptionsConfig,
  };
};

const FieldEditorComponent: React.FC<FieldEditorProps> = ({
  field,
  isNewField,
  onSave,
  onCancel,
  onDelete,
  generateUniqueKey,
  validateLabel,
}) => {
  const {
    editingField,
    newOption,
    setNewOption,
    optionError,
    setOptionError,
    handleFieldChange,
    handleValidationChange,
    handleTradeLogChange,
    isDuplicateOption,
    handleAddOption,
    handleRemoveOption,
    handleMoveOption,
    labelValidationError,
    derivedLabelKey,
    handleSave,
    showValidationOptions,
    showOptionsConfig,
  } = useFieldEditorController({
    field,
    isNewField,
    onSave,
    generateUniqueKey,
    validateLabel,
  });

  return (
    <div className="custom-field-editor">
      <div className="setting-item">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('settings.customization.custom-fields.editor.title')}
          </div>
        </div>
      </div>

      <div className="setting-item">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('settings.customization.custom-fields.editor.label')}
          </div>
          <div className="setting-item-description">
            {t('settings.customization.custom-fields.editor.label-desc')}
          </div>
        </div>
        <div className="setting-item-control custom-fields-label-control">
          <Input
            type="text"
            value={editingField.label}
            onChange={(value) => handleFieldChange('label', value)}
            aria-label={t('settings.customization.custom-fields.editor.label')}
            placeholder={t(
              'settings.customization.custom-fields.editor.label-placeholder'
            )}
            size="md"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
              }
            }}
          />
          {labelValidationError && (
            <div className="setting-item-description custom-fields-label-error">
              {labelValidationError}
              {derivedLabelKey && (
                <>
                  {' '}
                  <code>{derivedLabelKey}</code>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      
      <div className="setting-item">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('settings.customization.custom-fields.editor.key')}
          </div>
          <div className="setting-item-description">
            {t('settings.customization.custom-fields.editor.key-desc')}{' '}
            <code
              className="custom-fields-key-preview"
              style={cssVars({
                '--custom-fields-key-color':
                  editingField.fieldKey &&
                  RESERVED_FRONTMATTER_KEYS.has(editingField.fieldKey)
                    ? 'var(--text-error)'
                    : 'var(--text-accent)',
              })}
            >
              {editingField.fieldKey ||
                t(
                  'settings.customization.custom-fields.editor.key-placeholder'
                )}
            </code>
            {editingField.fieldKey &&
              RESERVED_FRONTMATTER_KEYS.has(editingField.fieldKey) && (
                <span className="custom-fields-key-reserved">
                  {t(
                    'settings.customization.custom-fields.editor.key-reserved'
                  )}
                </span>
              )}
          </div>
        </div>
      </div>

      <div className="setting-item">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('settings.customization.custom-fields.editor.type')}
          </div>
          <div className="setting-item-description">
            {t('settings.customization.custom-fields.editor.type-desc')}
          </div>
        </div>
        <div className="setting-item-control">
          <Select
            options={fieldTypeOptions}
            value={editingField.type}
            aria-label={t('settings.customization.custom-fields.editor.type')}
            onChange={(value) => {
              const fieldType = parseCustomFieldType(value);
              if (fieldType) {
                handleFieldChange('type', fieldType);
              }
            }}
          />
        </div>
      </div>

      <div className="setting-item">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('settings.customization.custom-fields.editor.placeholder')}
          </div>
          <div className="setting-item-description">
            {t('settings.customization.custom-fields.editor.placeholder-desc')}
          </div>
        </div>
        <div className="setting-item-control">
          <Input
            type="text"
            value={editingField.placeholder || ''}
            onChange={(value) => handleFieldChange('placeholder', value)}
            aria-label={t(
              'settings.customization.custom-fields.editor.placeholder'
            )}
            placeholder={t(
              'settings.customization.custom-fields.editor.placeholder-input'
            )}
            size="md"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
              }
            }}
          />
        </div>
      </div>

      <FieldEditorTradeLogSettings
        editingField={editingField}
        handleFieldChange={handleFieldChange}
        handleTradeLogChange={handleTradeLogChange}
      />

      
      {showValidationOptions && (
        <FieldEditorValidationSettings
          editingField={editingField}
          handleValidationChange={handleValidationChange}
        />
      )}

      
      {showOptionsConfig && (
        <FieldEditorOptionsConfig
          editingField={editingField}
          newOption={newOption}
          optionError={optionError}
          setNewOption={setNewOption}
          setOptionError={setOptionError}
          isDuplicateOption={isDuplicateOption}
          handleAddOption={handleAddOption}
          handleRemoveOption={handleRemoveOption}
          handleMoveOption={handleMoveOption}
          handleFieldChange={handleFieldChange}
        />
      )}

      
      <FieldEditorActions
        fieldId={field.id}
        labelValidationError={labelValidationError}
        onDelete={onDelete}
        onCancel={onCancel}
        onSave={handleSave}
      />
    </div>
  );
};

const FieldEditorWithKeyedState: React.FC<FieldEditorProps> = (props) => (
  <FieldEditorComponent key={props.field.id} {...props} />
);


export const FieldEditor = memo(
  FieldEditorWithKeyedState,
  (prevProps, nextProps) => {
    
    if (prevProps.field === nextProps.field) return true;

    
    if (prevProps.field.id !== nextProps.field.id) return false;
    if (prevProps.field.label !== nextProps.field.label) return false;
    if (prevProps.field.type !== nextProps.field.type) return false;
    if (prevProps.field.placeholder !== nextProps.field.placeholder)
      return false;
    if (prevProps.field.fieldKey !== nextProps.field.fieldKey) return false;
    if (
      prevProps.field.allowCreateOptions !== nextProps.field.allowCreateOptions
    )
      return false;

    const prevTradeLog = prevProps.field.tradeLog;
    const nextTradeLog = nextProps.field.tradeLog;
    if (prevTradeLog !== nextTradeLog) {
      if (!prevTradeLog || !nextTradeLog) return false;
      if (prevTradeLog.columnLabel !== nextTradeLog.columnLabel) return false;
      if (prevTradeLog.displayAsCurrency !== nextTradeLog.displayAsCurrency) {
        return false;
      }
      if (
        prevTradeLog.multiselectCollapsedDisplay !==
        nextTradeLog.multiselectCollapsedDisplay
      ) {
        return false;
      }
      if (prevTradeLog.dropdownSortMode !== nextTradeLog.dropdownSortMode) {
        return false;
      }
    }

    
    const prevValidation = prevProps.field.validation;
    const nextValidation = nextProps.field.validation;
    if (prevValidation !== nextValidation) {
      
      if (!prevValidation || !nextValidation) return false;
      
      if (prevValidation.required !== nextValidation.required) return false;
      if (prevValidation.minLength !== nextValidation.minLength) return false;
      if (prevValidation.maxLength !== nextValidation.maxLength) return false;
      if (prevValidation.min !== nextValidation.min) return false;
      if (prevValidation.max !== nextValidation.max) return false;
    }

    
    const prevOptions = prevProps.field.options;
    const nextOptions = nextProps.field.options;
    if (prevOptions !== nextOptions) {
      if (!prevOptions || !nextOptions) return false;
      if (prevOptions.length !== nextOptions.length) return false;
      for (let i = 0; i < prevOptions.length; i++) {
        if (prevOptions[i]?.value !== nextOptions[i]?.value) return false;
        if (prevOptions[i]?.label !== nextOptions[i]?.label) return false;
      }
    }

    if (prevProps.isNewField !== nextProps.isNewField) return false;

    
    return true;
  }
);

FieldEditor.displayName = 'FieldEditor';
