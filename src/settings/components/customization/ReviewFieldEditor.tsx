import React, { memo, useMemo, useState } from 'react';
import { Trash } from '../../../components/shared/icons/ObsidianIcon';
import {
  CustomFieldType,
  generateUniqueFieldKey,
  labelToFieldKey,
  validateFieldLabel,
} from '../../../types/customFields';
import type {
  CustomReviewFieldDefinition,
  CustomReviewFieldGroup,
  ReviewFieldInheritanceMode,
  ReviewFieldReviewType,
} from '../../../types/reviewCustomFields';
import {
  REVIEW_FIELD_INHERITANCE_MODES,
  REVIEW_FIELD_REVIEW_TYPES,
} from '../../../types/reviewCustomFields';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/core/Input';
import { NumberInput } from '../../../components/core/NumberInput';
import { Select } from '../../../components/core/Select';
import { t } from '../../../lang/helpers';
import { safeString } from '../../../utils/safeString';

interface ReviewFieldEditorProps {
  field: CustomReviewFieldDefinition;
  isNewField: boolean;
  onSave: (field: CustomReviewFieldDefinition) => void | Promise<void>;
  onCancel: () => void | Promise<void>;
  onDelete: (fieldId: string) => void | Promise<void>;
  generateUniqueKey: (label: string, excludeFieldId?: string) => string;
  validateLabel?: (label: string, excludeFieldId?: string) => string | null;
  groups: CustomReviewFieldGroup[];
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

const reviewTypeOptions = REVIEW_FIELD_REVIEW_TYPES.map((type) => ({
  type,
  label: t(`template.review-type.${type}`),
}));

const reviewTypeDisplayLabels: Record<ReviewFieldReviewType, string> = {
  drc: 'DRC',
  weekly: 'Weekly',
  monthly: 'Monthly',
  quarterly: 'Quarterly',
  yearly: 'Yearly',
};

const editableReviewTypeOptions = REVIEW_FIELD_REVIEW_TYPES.map((type) => ({
  type,
  label: reviewTypeDisplayLabels[type],
}));

const inheritToReviewTypeOptions = REVIEW_FIELD_REVIEW_TYPES.reduce(
  (acc, type) => {
    if (type !== 'yearly') {
      acc.push({
        type,
        label: reviewTypeDisplayLabels[type],
      });
    }
    return acc;
  },
  [] as { type: (typeof REVIEW_FIELD_REVIEW_TYPES)[number]; label: string }[]
);

const inheritanceSourceReviewTypeOptions = REVIEW_FIELD_REVIEW_TYPES.reduce(
  (acc, type) => {
    if (type !== 'drc') {
      acc.push({
        type,
        label: reviewTypeDisplayLabels[type],
      });
    }
    return acc;
  },
  [] as { type: (typeof REVIEW_FIELD_REVIEW_TYPES)[number]; label: string }[]
);

const inheritanceModeOptions = REVIEW_FIELD_INHERITANCE_MODES.map((mode) => ({
  value: mode,
  label: t(`settings.customization.review-fields.inheritance-mode.${mode}`),
}));

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

const parseInheritanceMode = (
  value: string
): ReviewFieldInheritanceMode | null => {
  switch (value) {
    case 'inherit-only':
    case 'local-only':
    case 'inherit-and-local':
      return value;
    default:
      return null;
  }
};

function uniqueReviewTypes(
  values: ReviewFieldReviewType[]
): ReviewFieldReviewType[] {
  return REVIEW_FIELD_REVIEW_TYPES.filter((type) => values.includes(type));
}

function toggleReviewType(
  values: ReviewFieldReviewType[],
  type: ReviewFieldReviewType,
  checked: boolean
): ReviewFieldReviewType[] {
  const next = checked
    ? [...values, type]
    : values.filter((value) => value !== type);
  return uniqueReviewTypes(next);
}

interface ReviewFieldOptionsConfigProps {
  editingField: CustomReviewFieldDefinition;
  newOption: string;
  optionError: string | null;
  setNewOption: (value: string) => void;
  setOptionError: (value: string | null) => void;
  isDuplicateOption: (option: string) => boolean;
  addOption: () => void | Promise<void>;
  removeOption: (index: number) => void | Promise<void>;
  moveOption: (index: number, direction: 'up' | 'down') => void | Promise<void>;
  updateField: <K extends keyof CustomReviewFieldDefinition>(
    key: K,
    value: CustomReviewFieldDefinition[K]
  ) => void | Promise<void>;
}

const ReviewFieldOptionsConfig: React.FC<ReviewFieldOptionsConfigProps> = ({
  editingField,
  newOption,
  optionError,
  setNewOption,
  setOptionError,
  isDuplicateOption,
  addOption,
  removeOption,
  moveOption,
  updateField,
}) => (
  <>
    <div className="setting-item">
      <div className="setting-item-info">
        <div className="setting-item-name">
          {t('settings.customization.custom-fields.editor.options')}
        </div>
        <div className="setting-item-description">
          {t('settings.customization.review-fields.editor.options-desc')}
        </div>
      </div>
    </div>
    {(editingField.options || []).map((option, index) => (
      <div key={option} className="setting-item">
        <div className="setting-item-info">
          <div className="setting-item-name">{option}</div>
        </div>
        <div className="setting-item-control journalit-u-flex journalit-u-gap-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => moveOption(index, 'up')}
            disabled={index === 0}
            aria-label={t('button.move-up')}
            className="custom-fields-option-move-button"
          >
            ↑
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => moveOption(index, 'down')}
            disabled={index === (editingField.options || []).length - 1}
            aria-label={t('button.move-down')}
            className="custom-fields-option-move-button"
          >
            ↓
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => removeOption(index)}
            aria-label={`${t('button.remove')}: ${option}`}
            className="custom-fields-option-delete-button"
          >
            <Trash size={14} aria-hidden="true" />
          </Button>
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
            onKeyDown={(event) => {
              if (event.key !== 'Enter') return;
              event.preventDefault();
              if (!newOption.trim() || optionError) return;
              void addOption();
            }}
            placeholder={t(
              'settings.customization.custom-fields.editor.add-option-placeholder'
            )}
            size="md"
          />
          <Button
            variant="primary"
            size="md"
            onClick={addOption}
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
      <CheckboxSetting
        title={t('settings.customization.custom-fields.editor.allow-create')}
        description={t(
          'settings.customization.review-fields.editor.allow-create-desc'
        )}
        checked={editingField.allowCreateOptions || false}
        onChange={(checked) => updateField('allowCreateOptions', checked)}
      />
    )}
  </>
);

const useReviewFieldEditorController = ({
  field,
  isNewField,
  onSave,
  generateUniqueKey,
  validateLabel,
}: Pick<
  ReviewFieldEditorProps,
  'field' | 'isNewField' | 'onSave' | 'generateUniqueKey' | 'validateLabel'
>) => {
  const [editorState, setEditorState] = useState(() => ({
    sourceField: field,
    editingField: { ...field },
    newOption: '',
    optionError: null as string | null,
  }));
  const editingField =
    editorState.sourceField === field ? editorState.editingField : { ...field };
  const newOption =
    editorState.sourceField === field ? editorState.newOption : '';
  const optionError =
    editorState.sourceField === field ? editorState.optionError : null;
  const setEditingField: React.Dispatch<
    React.SetStateAction<CustomReviewFieldDefinition>
  > = (update) => {
    setEditorState((current) => {
      const currentEditingField =
        current.sourceField === field ? current.editingField : { ...field };
      return {
        sourceField: field,
        editingField:
          typeof update === 'function' ? update(currentEditingField) : update,
        newOption: current.sourceField === field ? current.newOption : '',
        optionError: current.sourceField === field ? current.optionError : null,
      };
    });
  };
  const setNewOption = (value: string) => {
    setEditorState((current) => ({
      sourceField: field,
      editingField:
        current.sourceField === field ? current.editingField : { ...field },
      newOption: value,
      optionError: current.sourceField === field ? current.optionError : null,
    }));
  };
  const setOptionError = (value: string | null) => {
    setEditorState((current) => ({
      sourceField: field,
      editingField:
        current.sourceField === field ? current.editingField : { ...field },
      newOption: current.sourceField === field ? current.newOption : '',
      optionError: value,
    }));
  };

  const showOptionsConfig = [
    CustomFieldType.DROPDOWN,
    CustomFieldType.MULTISELECT,
  ].includes(editingField.type);

  const labelValidationError = useMemo(() => {
    const shouldValidate =
      isNewField || editingField.label.trim() !== field.label.trim();
    if (!shouldValidate) return null;
    return (
      validateLabel?.(editingField.label, editingField.id) ??
      validateFieldLabel(editingField.label)
    );
  }, [
    editingField.id,
    editingField.label,
    field.label,
    isNewField,
    validateLabel,
  ]);

  const updateField = <K extends keyof CustomReviewFieldDefinition>(
    key: K,
    value: CustomReviewFieldDefinition[K]
  ) => {
    setEditingField((prev) => {
      const next = { ...prev, [key]: value };
      if (key === 'label' && isNewField) {
        next.fieldKey = generateUniqueKey(safeString(value), prev.id);
      }
      if (
        key === 'type' &&
        value !== CustomFieldType.DROPDOWN &&
        value !== CustomFieldType.MULTISELECT
      ) {
        next.options = [];
        next.allowCreateOptions = false;
      }
      return next;
    });
  };

  const updateValidation = (key: string, value: unknown) => {
    setEditingField((prev) => ({
      ...prev,
      validation: { ...prev.validation, [key]: value },
    }));
  };

  const updateScopeList = (
    key: keyof CustomReviewFieldDefinition['scope'],
    type: ReviewFieldReviewType,
    checked: boolean
  ) => {
    setEditingField((prev) => ({
      ...prev,
      scope: {
        ...prev.scope,
        [key]: toggleReviewType(prev.scope[key], type, checked),
      },
    }));
  };

  const updateSourceList = (type: ReviewFieldReviewType, checked: boolean) => {
    setEditingField((prev) => ({
      ...prev,
      inheritance: {
        ...prev.inheritance,
        sources: toggleReviewType(prev.inheritance.sources, type, checked),
      },
    }));
  };

  const isDuplicateOption = (option: string): boolean => {
    const normalized = option.trim().toLowerCase();
    return (editingField.options || []).some(
      (existing) => existing.trim().toLowerCase() === normalized
    );
  };

  const addOption = () => {
    const trimmed = newOption.trim();
    if (!trimmed) return;
    if (isDuplicateOption(trimmed)) {
      setOptionError(t('error.options.duplicate'));
      return;
    }
    setEditingField((prev) => ({
      ...prev,
      options: [...(prev.options || []), trimmed],
    }));
    setNewOption('');
    setOptionError(null);
  };

  const removeOption = (index: number) => {
    setEditingField((prev) => ({
      ...prev,
      options: (prev.options || []).filter(
        (_, optionIndex) => optionIndex !== index
      ),
    }));
  };

  const moveOption = (index: number, direction: 'up' | 'down') => {
    setEditingField((prev) => {
      const options = [...(prev.options || [])];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= options.length) return prev;
      [options[index], options[targetIndex]] = [
        options[targetIndex],
        options[index],
      ];
      return { ...prev, options };
    });
  };

  const save = () => {
    if (labelValidationError) return;
    const existingKey =
      editingField.fieldKey || labelToFieldKey(editingField.label);
    const validation = { ...(editingField.validation || {}) };
    delete validation.required;
    void onSave({
      ...editingField,
      fieldKey: existingKey || generateUniqueFieldKey(editingField.label),
      validation,
      scope: {
        reviewTypes: editingField.scope.reviewTypes,
        editableOn: editingField.scope.editableOn,
        inheritTo: editingField.scope.inheritTo.filter(
          (type) => type !== 'yearly'
        ),
      },
      inheritance: {
        ...editingField.inheritance,
        sources: editingField.inheritance.sources.filter(
          (type) => type !== 'drc'
        ),
      },
      groupId: editingField.groupId || undefined,
      display: {
        ...editingField.display,
        order: editingField.display.order ?? editingField.order,
      },
    });
  };

  return {
    editingField,
    setEditingField,
    newOption,
    setNewOption,
    optionError,
    setOptionError,
    showOptionsConfig,
    labelValidationError,
    updateField,
    updateValidation,
    updateScopeList,
    updateSourceList,
    isDuplicateOption,
    addOption,
    removeOption,
    moveOption,
    save,
  };
};

const ReviewFieldEditorComponent: React.FC<ReviewFieldEditorProps> = ({
  field,
  isNewField,
  onSave,
  onCancel,
  onDelete,
  generateUniqueKey,
  validateLabel,
  groups,
}) => {
  const {
    editingField,
    setEditingField,
    newOption,
    setNewOption,
    optionError,
    setOptionError,
    showOptionsConfig,
    labelValidationError,
    updateField,
    updateValidation,
    updateScopeList,
    updateSourceList,
    isDuplicateOption,
    addOption,
    removeOption,
    moveOption,
    save,
  } = useReviewFieldEditorController({
    field,
    isNewField,
    onSave,
    generateUniqueKey,
    validateLabel,
  });

  return (
    <div className="custom-field-editor custom-review-field-editor">
      <div className="setting-item">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('settings.customization.review-fields.editor.title')}
          </div>
        </div>
      </div>

      <div className="setting-item">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('settings.customization.custom-fields.editor.label')}
          </div>
          <div className="setting-item-description">
            {t('settings.customization.review-fields.editor.label-desc')}
          </div>
        </div>
        <div className="setting-item-control custom-fields-label-control">
          <Input
            type="text"
            value={editingField.label}
            onChange={(value) => updateField('label', value)}
            placeholder={t(
              'settings.customization.review-fields.editor.label-placeholder'
            )}
            size="md"
          />
          {labelValidationError && (
            <div className="setting-item-description custom-fields-label-error">
              {labelValidationError}{' '}
              <code>{labelToFieldKey(editingField.label)}</code>
            </div>
          )}
        </div>
      </div>

      <div className="setting-item">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('settings.customization.review-fields.editor.key')}
          </div>
          <div className="setting-item-description">
            {t('settings.customization.review-fields.editor.key-desc')}{' '}
            <code className="custom-fields-key-preview">
              reviewCustomFields.
              {editingField.fieldKey ||
                t(
                  'settings.customization.custom-fields.editor.key-placeholder'
                )}
            </code>
          </div>
        </div>
      </div>

      <div className="setting-item">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('settings.customization.custom-fields.editor.type')}
          </div>
          <div className="setting-item-description">
            {t('settings.customization.review-fields.editor.type-desc')}
          </div>
        </div>
        <div className="setting-item-control">
          <Select
            options={fieldTypeOptions}
            value={editingField.type}
            onChange={(value) => {
              const type = parseCustomFieldType(value);
              if (type) {
                updateField('type', type);
              }
            }}
          />
        </div>
      </div>

      <div className="setting-item">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('settings.customization.review-fields.editor.description')}
          </div>
          <div className="setting-item-description">
            {t('settings.customization.review-fields.editor.description-desc')}
          </div>
        </div>
        <div className="setting-item-control">
          <Input
            type="text"
            value={editingField.description || ''}
            onChange={(value) => updateField('description', value || undefined)}
            placeholder={t(
              'settings.customization.review-fields.editor.description-placeholder'
            )}
            size="md"
          />
        </div>
      </div>

      <div className="setting-item">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('settings.customization.custom-fields.editor.placeholder')}
          </div>
          <div className="setting-item-description">
            {t('settings.customization.review-fields.editor.placeholder-desc')}
          </div>
        </div>
        <div className="setting-item-control">
          <Input
            type="text"
            value={editingField.placeholder || ''}
            onChange={(value) => updateField('placeholder', value || undefined)}
            placeholder={t(
              'settings.customization.review-fields.editor.placeholder-input'
            )}
            size="md"
          />
        </div>
      </div>

      <div className="setting-item">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('settings.customization.review-fields.editor.group')}
          </div>
          <div className="setting-item-description">
            {t('settings.customization.review-fields.editor.group-desc')}
          </div>
        </div>
        <div className="setting-item-control">
          <Select
            value={editingField.groupId || ''}
            onChange={(value) => updateField('groupId', value || undefined)}
            options={[
              {
                value: '',
                label: t(
                  'settings.customization.review-fields.groups.ungrouped'
                ),
              },
              ...groups.map((group) => ({
                value: group.id,
                label: group.name,
              })),
            ]}
          />
        </div>
      </div>

      <CheckboxSetting
        title={t('settings.customization.review-fields.editor.compact')}
        description={t(
          'settings.customization.review-fields.editor.compact-desc'
        )}
        checked={editingField.display.compact || false}
        onChange={(checked) =>
          setEditingField((prev) => ({
            ...prev,
            display: { ...prev.display, compact: checked || undefined },
          }))
        }
      />

      <ReviewTypeCheckboxes
        title={t('settings.customization.review-fields.editor.appears-on')}
        description={t(
          'settings.customization.review-fields.editor.appears-on-desc'
        )}
        selected={editingField.scope.reviewTypes}
        options={editableReviewTypeOptions}
        onToggle={(type, checked) =>
          updateScopeList('reviewTypes', type, checked)
        }
      />
      <ReviewTypeCheckboxes
        title={t('settings.customization.review-fields.editor.editable-on')}
        description={t(
          'settings.customization.review-fields.editor.editable-on-desc'
        )}
        selected={editingField.scope.editableOn}
        options={editableReviewTypeOptions}
        onToggle={(type, checked) =>
          updateScopeList('editableOn', type, checked)
        }
      />
      <ReviewFieldInheritanceSettings
        editingField={editingField}
        setEditingField={setEditingField}
        updateScopeList={updateScopeList}
        updateSourceList={updateSourceList}
      />

      <ReviewFieldValidationSettings
        fieldType={editingField.type}
        validation={editingField.validation}
        onUpdateValidation={updateValidation}
      />

      {showOptionsConfig && (
        <ReviewFieldOptionsConfig
          editingField={editingField}
          newOption={newOption}
          optionError={optionError}
          setNewOption={setNewOption}
          setOptionError={setOptionError}
          isDuplicateOption={isDuplicateOption}
          addOption={addOption}
          removeOption={removeOption}
          moveOption={moveOption}
          updateField={updateField}
        />
      )}

      <ReviewFieldEditorActions
        isNewField={isNewField}
        fieldId={field.id}
        labelValidationError={labelValidationError}
        onDelete={onDelete}
        onCancel={onCancel}
        onSave={save}
      />
    </div>
  );
};

interface ReviewFieldInheritanceSettingsProps {
  editingField: CustomReviewFieldDefinition;
  setEditingField: React.Dispatch<
    React.SetStateAction<CustomReviewFieldDefinition>
  >;
  updateScopeList: (
    key: keyof CustomReviewFieldDefinition['scope'],
    type: ReviewFieldReviewType,
    checked: boolean
  ) => void | Promise<void>;
  updateSourceList: (
    type: ReviewFieldReviewType,
    checked: boolean
  ) => void | Promise<void>;
}

const ReviewFieldInheritanceSettings: React.FC<
  ReviewFieldInheritanceSettingsProps
> = ({ editingField, setEditingField, updateScopeList, updateSourceList }) => (
  <>
    <CheckboxSetting
      title={t('settings.customization.review-fields.editor.inheritance')}
      description={t(
        'settings.customization.review-fields.editor.inheritance-desc'
      )}
      checked={editingField.inheritance.enabled}
      onChange={(checked) =>
        setEditingField((prev) => ({
          ...prev,
          inheritance: { ...prev.inheritance, enabled: checked },
        }))
      }
    />
    {editingField.inheritance.enabled && (
      <>
        <ReviewTypeCheckboxes
          title={t('settings.customization.review-fields.editor.inherit-to')}
          description={t(
            'settings.customization.review-fields.editor.inherit-to-desc'
          )}
          selected={editingField.scope.inheritTo}
          options={inheritToReviewTypeOptions}
          onToggle={(type, checked) =>
            updateScopeList('inheritTo', type, checked)
          }
        />
        <div className="setting-item">
          <div className="setting-item-info">
            <div className="setting-item-name">
              {t(
                'settings.customization.review-fields.editor.inheritance-mode'
              )}
            </div>
            <div className="setting-item-description">
              {t(
                'settings.customization.review-fields.editor.inheritance-mode-desc'
              )}
            </div>
          </div>
          <div className="setting-item-control">
            <Select
              options={inheritanceModeOptions}
              value={editingField.inheritance.mode}
              onChange={(value) => {
                const mode = parseInheritanceMode(value);
                if (!mode) {
                  return;
                }
                setEditingField((prev) => ({
                  ...prev,
                  inheritance: {
                    ...prev.inheritance,
                    mode,
                  },
                }));
              }}
            />
          </div>
        </div>
        <ReviewTypeCheckboxes
          title={t('settings.customization.review-fields.editor.sources')}
          description={t(
            'settings.customization.review-fields.editor.sources-desc'
          )}
          selected={editingField.inheritance.sources}
          options={inheritanceSourceReviewTypeOptions}
          onToggle={updateSourceList}
        />
      </>
    )}
  </>
);

interface ReviewFieldValidationSettingsProps {
  fieldType: CustomFieldType;
  validation: CustomReviewFieldDefinition['validation'];
  onUpdateValidation: (key: string, value: unknown) => void | Promise<void>;
}

const ReviewFieldValidationSettings: React.FC<
  ReviewFieldValidationSettingsProps
> = ({ fieldType, validation, onUpdateValidation }) => (
  <>
    {fieldType === CustomFieldType.TEXT && (
      <>
        <NumberSetting
          title={t(
            'settings.customization.custom-fields.editor.validation.min-length'
          )}
          description={t(
            'settings.customization.custom-fields.editor.validation.min-length-desc'
          )}
          value={validation?.minLength}
          min={0}
          onChange={(value) => onUpdateValidation('minLength', value)}
        />
        <NumberSetting
          title={t(
            'settings.customization.custom-fields.editor.validation.max-length'
          )}
          description={t(
            'settings.customization.custom-fields.editor.validation.max-length-desc'
          )}
          value={validation?.maxLength}
          min={1}
          onChange={(value) => onUpdateValidation('maxLength', value)}
        />
      </>
    )}
    {fieldType === CustomFieldType.NUMBER && (
      <>
        <NumberSetting
          title={t(
            'settings.customization.custom-fields.editor.validation.min-value'
          )}
          description={t(
            'settings.customization.custom-fields.editor.validation.min-value-desc'
          )}
          value={validation?.min}
          onChange={(value) => onUpdateValidation('min', value)}
          allowDecimal={true}
        />
        <NumberSetting
          title={t(
            'settings.customization.custom-fields.editor.validation.max-value'
          )}
          description={t(
            'settings.customization.custom-fields.editor.validation.max-value-desc'
          )}
          value={validation?.max}
          onChange={(value) => onUpdateValidation('max', value)}
          allowDecimal={true}
        />
      </>
    )}
  </>
);

interface ReviewFieldEditorActionsProps {
  isNewField: boolean;
  fieldId: string;
  labelValidationError: string | null;
  onDelete: (fieldId: string) => void | Promise<void>;
  onCancel: () => void | Promise<void>;
  onSave: () => void | Promise<void>;
}

const ReviewFieldEditorActions: React.FC<ReviewFieldEditorActionsProps> = ({
  isNewField,
  fieldId,
  labelValidationError,
  onDelete,
  onCancel,
  onSave,
}) => (
  <div className="setting-item custom-fields-editor-actions">
    {!isNewField && (
      <Button
        variant="danger"
        onClick={() => void onDelete(fieldId)}
        className="custom-fields-delete-button"
      >
        {t('settings.customization.review-fields.editor.delete')}
      </Button>
    )}
    <div className="custom-fields-editor-primary-actions">
      <Button variant="outline" onClick={onCancel}>
        {t('button.cancel')}
      </Button>
      <Button
        variant="primary"
        onClick={onSave}
        disabled={!!labelValidationError}
      >
        {t('settings.customization.review-fields.editor.save')}
      </Button>
    </div>
  </div>
);

interface ReviewTypeCheckboxesProps {
  title: string;
  description: string;
  selected: ReviewFieldReviewType[];
  options?: { type: ReviewFieldReviewType; label: string }[];
  onToggle: (
    type: ReviewFieldReviewType,
    checked: boolean
  ) => void | Promise<void>;
}

const ReviewTypeCheckboxes: React.FC<ReviewTypeCheckboxesProps> = ({
  title,
  description,
  selected,
  options = reviewTypeOptions,
  onToggle,
}) => (
  <div className="setting-item custom-review-fields-review-type-setting">
    <div className="setting-item-info">
      <div className="setting-item-name">{title}</div>
      <div className="setting-item-description">{description}</div>
    </div>
    <div className="setting-item-control custom-review-fields-checkbox-group">
      {options.map(({ type, label }) => (
        <label key={type} className="custom-review-fields-checkbox-label">
          <input
            type="checkbox"
            checked={selected.includes(type)}
            onChange={(event) => void onToggle(type, event.target.checked)}
            className="custom-fields-checkbox"
          />
          <span>{label}</span>
        </label>
      ))}
    </div>
  </div>
);

interface NumberSettingProps {
  title: string;
  description: string;
  value: number | undefined;
  min?: number;
  allowDecimal?: boolean;
  onChange: (value: number | undefined) => void | Promise<void>;
}

const NumberSetting: React.FC<NumberSettingProps> = ({
  title,
  description,
  value,
  min,
  allowDecimal,
  onChange,
}) => (
  <div className="setting-item">
    <div className="setting-item-info">
      <div className="setting-item-name">{title}</div>
      <div className="setting-item-description">{description}</div>
    </div>
    <div className="setting-item-control">
      <NumberInput
        value={value}
        onChange={(value) => void onChange(value)}
        min={min}
        allowDecimal={allowDecimal}
        className="custom-review-fields-number-input"
      />
    </div>
  </div>
);

interface CheckboxSettingProps {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void | Promise<void>;
}

const CheckboxSetting: React.FC<CheckboxSettingProps> = ({
  title,
  description,
  checked,
  onChange,
}) => (
  <div className="setting-item">
    <div className="setting-item-info">
      <div className="setting-item-name">{title}</div>
      <div className="setting-item-description">{description}</div>
    </div>
    <div className="setting-item-control">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => void onChange(event.target.checked)}
        className="custom-fields-checkbox"
      />
    </div>
  </div>
);

export const ReviewFieldEditor = memo(ReviewFieldEditorComponent);
ReviewFieldEditor.displayName = 'ReviewFieldEditor';
