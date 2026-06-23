

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  startTransition,
} from 'react';
import { App, Modal, Notice } from 'obsidian';
import { Edit } from '../../../components/shared/icons/ObsidianIcon';
import JournalitPlugin from '../../../main';
import { CustomFieldsService } from '../../../services/CustomFieldsService';
import {
  CustomFieldDefinition,
  CustomFieldType,
  createDefaultFieldDefinition,
  labelToFieldKey,
  validateFieldKey,
  validateFieldLabel,
  generateUniqueFieldKey,
} from '../../../types/customFields';
import { Button } from '../../../components/ui/Button';
import { useService } from '../../../hooks';
import { useOptimizedAccordion } from '../../../hooks/useOptimizedAccordion';
import { FieldEditor } from './FieldEditor';
import { t, tPlural } from '../../../lang/helpers';
import { cssVars } from '../../../styles/inlineStylePolicy';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

const isCustomFieldType = (value: unknown): value is CustomFieldType =>
  Object.values<unknown>(CustomFieldType).includes(value);

const isCustomFieldDefinition = (
  value: unknown
): value is CustomFieldDefinition =>
  isRecord(value) &&
  typeof value.id === 'string' &&
  typeof value.label === 'string' &&
  typeof value.fieldKey === 'string' &&
  isCustomFieldType(value.type) &&
  typeof value.order === 'number';

interface CustomFieldsManagerProps {
  plugin: JournalitPlugin;
  onRequestExpansion?: () => void;
  remeasureContent?: () => void;
}

interface FieldAccordionProps {
  field: CustomFieldDefinition;
  savedOptions: string[];
  onDeleteOption: (fieldId: string, option: string) => void | Promise<void>;
  onClearAll: (fieldId: string, fieldLabel: string) => void | Promise<void>;
  initialExpanded?: boolean;
}

const FieldAccordion: React.FC<FieldAccordionProps> = ({
  field,
  savedOptions,
  onDeleteOption,
  onClearAll,
  initialExpanded = false,
}) => {
  const {
    isExpanded,
    toggleExpanded,
    contentRef,
    containerRef,
    contentHeight,
  } = useOptimizedAccordion(initialExpanded, {
    duration: { open: 300, close: 250 },
    easing: 'ease-in-out',
    stagger: { opacity: 100 },
  });

  const heightPx = isExpanded ? contentHeight : 0;

  return (
    <div
      className="custom-fields-accordion"
      data-expanded={isExpanded ? 'true' : 'false'}
    >
      <div className="setting-item">
        <div className="setting-item-info">
          <div
            className="setting-item-name custom-fields-accordion-title"
            onClick={toggleExpanded}
            onKeyDown={(e) => {
              if (e.key !== 'Enter' && e.key !== ' ') {
                return;
              }

              e.preventDefault();
              toggleExpanded();
            }}
            role="button"
            tabIndex={0}
          >
            <svg
              className="custom-fields-accordion-chevron"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M4 2l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>
              {field.label} (
              {tPlural(
                'settings.customization.custom-fields.option-count',
                savedOptions.length
              )}
              )
            </span>
          </div>
          <div className="setting-item-description">
            {field.type === CustomFieldType.DROPDOWN
              ? t('settings.customization.custom-fields.type-dropdown')
              : t('settings.customization.custom-fields.type-multiselect')}{' '}
            {t('settings.customization.custom-fields.type-suffix')}
          </div>
        </div>
        <div className="setting-item-control">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onClearAll(field.id, field.label)}
            className="custom-fields-danger-outline"
          >
            {t('button.clear-all')}
          </Button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="journalit-settings-accordion__container"
        style={cssVars({ '--journalit-accordion-height': `${heightPx}px` })}
      >
        <div
          ref={contentRef}
          className="journalit-settings-accordion__content custom-fields-accordion-content"
        >
          {savedOptions.map((option) => (
            <div
              key={option}
              className="setting-item custom-fields-option-item"
            >
              <div className="setting-item-info">
                <div className="setting-item-name custom-fields-option-name">
                  • {option}
                </div>
              </div>
              <div className="setting-item-control">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDeleteOption(field.id, option)}
                  className="custom-fields-option-button"
                >
                  {t('button.delete')}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

function useCustomFieldsManagerModel(props: CustomFieldsManagerProps) {
  const { plugin, onRequestExpansion, remeasureContent } = props;
  const { service: customFieldsService, status } = useService(
    'customFieldsService'
  );
  const [fields, setFields] = useState<CustomFieldDefinition[]>([]);
  const [editingField, setEditingField] =
    useState<CustomFieldDefinition | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [, setForceUpdate] = useState(0);

  
  const remeasureTimeoutRef = useRef<number | null>(null);

  
  const debouncedRemeasure = useCallback(() => {
    if (!remeasureContent) return;

    
    if (remeasureTimeoutRef.current) {
      window.clearTimeout(remeasureTimeoutRef.current);
    }

    
    remeasureTimeoutRef.current = window.setTimeout(() => {
      window.requestAnimationFrame(() => {
        remeasureContent();
      });
    }, 16); 
  }, [remeasureContent]);

  
  useEffect(() => {
    return () => {
      if (remeasureTimeoutRef.current) {
        window.clearTimeout(remeasureTimeoutRef.current);
      }
    };
  }, []);

  const loadFields = useCallback(() => {
    if (customFieldsService && status === 'ready') {
      const loadedFields = customFieldsService.getFields();
      setFields(loadedFields);
    }
  }, [customFieldsService, status]);

  
  useEffect(() => {
    loadFields();

    
    const app = plugin.app;
    const handleCustomFieldsChanged = (payload: unknown) => {
      if (!payload || typeof payload !== 'object') return;
      if (!('fields' in payload)) return;

      const fields = payload.fields;
      if (Array.isArray(fields) && fields.every(isCustomFieldDefinition)) {
        setFields(fields);
      }
    };

    app.workspace.on(
      'journalit-custom-fields-changed',
      handleCustomFieldsChanged
    );

    
    return () => {
      app.workspace.off(
        'journalit-custom-fields-changed',
        handleCustomFieldsChanged
      );
    };
  }, [loadFields, plugin.app]); 

  const handleAddField = () => {
    onRequestExpansion?.();
    const existingKeys = fields.map(
      (f) => f.fieldKey || labelToFieldKey(f.label)
    );
    const newField = createDefaultFieldDefinition(
      CustomFieldType.TEXT,
      existingKeys
    );
    setEditingField(newField);
    setIsAddingNew(true);
    
  };

  const handleEditField = (field: CustomFieldDefinition) => {
    onRequestExpansion?.();
    setEditingField({ ...field });
    setIsAddingNew(false);
    
  };

  const generateUniqueKeyForField = useCallback(
    (label: string, excludeFieldId?: string): string => {
      const existingKeys = fields.reduce<string[]>((acc, f) => {
        if (f.id !== excludeFieldId) {
          acc.push(f.fieldKey || labelToFieldKey(f.label));
        }
        return acc;
      }, []);
      return generateUniqueFieldKey(label, existingKeys);
    },
    [fields]
  );

  const validateLabelForField = useCallback(
    (label: string, excludeFieldId?: string): string | null => {
      const reservedLabelError = validateFieldLabel(label);
      if (reservedLabelError) {
        return reservedLabelError;
      }

      const normalizedLabel = label.trim().toLowerCase();
      if (!normalizedLabel) {
        return null;
      }

      const hasDuplicateLabel = fields.some(
        (existingField) =>
          existingField.id !== excludeFieldId &&
          existingField.label.trim().toLowerCase() === normalizedLabel
      );

      return hasDuplicateLabel ? t('error.settings.field-name-conflict') : null;
    },
    [fields]
  );

  const handleSaveField = useCallback(
    async (field: CustomFieldDefinition) => {
      if (!customFieldsService || status !== 'ready') {
        console.error('CustomFieldsService not ready, status:', status);
        return;
      }

      const labelValidation = validateLabelForField(field.label, field.id);
      if (labelValidation) {
        new Notice(
          t('settings.customization.custom-fields.error.cannot-save', {
            error: labelValidation,
          })
        );
        return;
      }

      
      const keyValidation = validateFieldKey(field.fieldKey);
      if (keyValidation) {
        new Notice(
          t('settings.customization.custom-fields.error.cannot-save', {
            error: keyValidation,
          })
        );
        return;
      }

      
      const existingKeys = fields.reduce<string[]>((acc, f) => {
        if (f.id !== field.id) {
          acc.push(f.fieldKey || labelToFieldKey(f.label));
        }
        return acc;
      }, []);

      if (existingKeys.includes(field.fieldKey)) {
        new Notice(
          t('settings.customization.custom-fields.error.cannot-save', {
            error: t(
              'settings.customization.custom-fields.error.duplicate-key'
            ),
          })
        );
        return;
      }

      try {
        
        if (!field.fieldKey) {
          field.fieldKey = generateUniqueFieldKey(field.label, existingKeys);
        }

        
        startTransition(() => {
          setEditingField(null);
          setIsAddingNew(false);
        });

        if (isAddingNew) {
          await customFieldsService.addField(field);
        } else {
          await customFieldsService.updateField(field.id, field);
        }
        loadFields();

        
        debouncedRemeasure();
      } catch (error) {
        console.error('Failed to save field:', error);
        new Notice(t('settings.customization.custom-fields.error.save-failed'));
      }
    },
    [
      customFieldsService,
      status,
      fields,
      isAddingNew,
      debouncedRemeasure,
      loadFields,
      validateLabelForField,
    ]
  );

  const handleCancelEdit = useCallback(() => {
    
    startTransition(() => {
      setEditingField(null);
      setIsAddingNew(false);
    });
    
  }, []);

  const handleDeleteField = useCallback(
    async (fieldId: string) => {
      if (!customFieldsService || status !== 'ready') {
        console.error('CustomFieldsService not ready, status:', status);
        return;
      }

      
      const fieldToDelete =
        editingField?.id === fieldId
          ? editingField
          : fields.find((f) => f.id === fieldId);
      const fieldLabel = fieldToDelete?.label || 'Unknown Field';

      new DeleteFieldConfirmationModal(plugin.app, fieldLabel, async () => {
        try {
          
          startTransition(() => {
            setEditingField(null);
            setIsAddingNew(false);
          });

          await customFieldsService.removeField(fieldId);
          loadFields();

          
          debouncedRemeasure();
        } catch (error) {
          console.error('Failed to delete field:', error);
        }
      }).open();
    },
    [
      customFieldsService,
      status,
      editingField,
      fields,
      plugin.app,
      debouncedRemeasure,
      loadFields,
    ]
  );

  const handleResetFields = async () => {
    if (!customFieldsService || status !== 'ready') {
      console.error('CustomFieldsService not ready, status:', status);
      return;
    }

    new ResetFieldsConfirmationModal(plugin.app, async () => {
      try {
        
        startTransition(() => {
          setEditingField(null);
          setIsAddingNew(false);
        });

        await customFieldsService.resetFields();
        loadFields();

        
        debouncedRemeasure();
      } catch (error) {
        console.error('Failed to reset fields:', error);
      }
    }).open();
  };

  const handleMoveField = useCallback(
    async (fieldId: string, direction: 'up' | 'down') => {
      if (!customFieldsService || status !== 'ready') {
        console.error('CustomFieldsService not ready, status:', status);
        return;
      }

      const currentIndex = fields.findIndex((field) => field.id === fieldId);
      const targetIndex =
        direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (
        currentIndex === -1 ||
        targetIndex < 0 ||
        targetIndex >= fields.length
      ) {
        return;
      }

      const reorderedFields = [...fields];
      const [movedField] = reorderedFields.splice(currentIndex, 1);
      reorderedFields.splice(targetIndex, 0, movedField);
      setFields(reorderedFields);

      try {
        await customFieldsService.reorderFields(
          reorderedFields.map((field) => field.id)
        );
        loadFields();
      } catch (error) {
        console.error('Failed to reorder custom fields:', error);
        loadFields();
      }
    },
    [customFieldsService, status, fields, loadFields]
  );

  return {
    editingField,
    fields,
    generateUniqueKeyForField,
    handleAddField,
    handleCancelEdit,
    handleDeleteField,
    handleEditField,
    handleMoveField,
    handleResetFields,
    handleSaveField,
    isAddingNew,
    plugin,
    setForceUpdate,
    validateLabelForField,
    customFieldsService,
  };
}

export const CustomFieldsManager: React.FC<CustomFieldsManagerProps> = (
  props
) => {
  const {
    editingField,
    fields,
    generateUniqueKeyForField,
    handleAddField,
    handleCancelEdit,
    handleDeleteField,
    handleEditField,
    handleMoveField,
    handleResetFields,
    handleSaveField,
    isAddingNew,
    plugin,
    setForceUpdate,
    validateLabelForField,
    customFieldsService,
  } = useCustomFieldsManagerModel(props);

  return (
    <div className="custom-fields-manager">
      <div className="custom-fields-intro">
        {t('settings.customization.custom-fields.description')}
      </div>

      
      {fields.length > 0 && (
        <div className="custom-fields-list-panel">
          <div className="custom-fields-list-header">
            <div>
              <div className="custom-fields-list-title">
                {t('settings.customization.custom-fields.title', {
                  count: String(fields.length),
                })}
              </div>
              <div className="custom-fields-list-description">
                {t('settings.customization.custom-fields.manage-desc')}
              </div>
            </div>
            <div className="custom-fields-list-header-actions">
              {!editingField && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => void handleAddField()}
                >
                  {t('settings.customization.custom-fields.add-button')}
                </Button>
              )}
            </div>
          </div>

          <div className="custom-fields-field-list">
            {fields.map((field, index) => (
              <div key={field.id} className="custom-fields-field-item">
                <div className="setting-item-info">
                  <div className="setting-item-name">
                    {field.label}
                    {field.validation?.required && (
                      <span className="custom-fields-required-indicator">
                        *
                      </span>
                    )}
                  </div>
                  <div className="setting-item-description">
                    Type: {field.type}
                    {field.validation?.required && ' • Required'}
                  </div>
                </div>
                <div className="setting-item-control">
                  <div className="custom-fields-field-actions">
                    <div className="custom-fields-reorder-controls">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMoveField(field.id, 'up')}
                        disabled={index === 0}
                        aria-label={`${t('button.move-up')}: ${field.label}`}
                        className="custom-fields-reorder-button"
                      >
                        ↑
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMoveField(field.id, 'down')}
                        disabled={index === fields.length - 1}
                        aria-label={`${t('button.move-down')}: ${field.label}`}
                        className="custom-fields-reorder-button"
                      >
                        ↓
                      </Button>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditField(field)}
                      aria-label={`${t('validation.edit')}: ${field.label}`}
                      className="custom-fields-edit-button"
                    >
                      <Edit size={14} aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      
      {editingField && (
        <div className="custom-fields-editor-panel">
          <div className="custom-fields-editor-panel-header">
            <div className="custom-fields-editor-panel-title">
              {isAddingNew
                ? t('settings.customization.custom-fields.add-new')
                : t(
                    'settings.customization.custom-fields.edit-field-with-name',
                    { fieldLabel: editingField.label }
                  )}
            </div>
            <div className="custom-fields-editor-panel-description">
              {t('settings.customization.custom-fields.configure-desc')}
            </div>
          </div>

          <FieldEditor
            key={editingField.id}
            field={editingField}
            isNewField={isAddingNew}
            onSave={handleSaveField}
            onCancel={handleCancelEdit}
            onDelete={handleDeleteField}
            generateUniqueKey={generateUniqueKeyForField}
            validateLabel={validateLabelForField}
          />
        </div>
      )}

      
      {!editingField && (
        <SavedCustomOptionsSection
          customFieldsService={customFieldsService}
          fields={fields}
          onOptionsChanged={() => {
            
            setForceUpdate((prev) => prev + 1);
          }}
          plugin={plugin}
        />
      )}

      
      {!editingField && (
        <div className="custom-fields-danger-zone">
          <div>
            <div className="custom-fields-danger-zone-title">
              {fields.length > 0
                ? t('settings.customization.custom-fields.actions')
                : t('settings.customization.custom-fields.no-fields')}
            </div>
            <div className="custom-fields-danger-zone-description">
              {fields.length > 0
                ? t('settings.customization.custom-fields.actions-desc')
                : t('settings.customization.custom-fields.no-fields-desc')}
            </div>
          </div>
          <div className="custom-fields-actions-buttons">
            {fields.length === 0 && (
              <Button variant="primary" onClick={() => void handleAddField()}>
                {t('settings.customization.custom-fields.add-button')}
              </Button>
            )}

            {fields.length > 0 && (
              <Button
                variant="danger"
                onClick={() => void handleResetFields()}
                className="custom-fields-delete-all-button"
              >
                {t('settings.customization.custom-fields.delete-all-button')}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};


class DeleteFieldConfirmationModal extends Modal {
  constructor(
    app: App,
    private fieldLabel: string,
    private onConfirm: () => void | Promise<void>
  ) {
    super(app);
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.createEl('p', {
      text: t('settings.customization.custom-fields.delete.confirm-message', {
        fieldLabel: this.fieldLabel,
      }),
    });
    contentEl.createEl('p', {
      text: t('settings.customization.custom-fields.delete.cannot-undo'),
      cls: 'warning',
    });

    const buttonContainer = contentEl.createDiv({
      cls: 'modal-button-container journalit-modal-button-container',
    });

    buttonContainer
      .createEl('button', { text: t('button.delete'), cls: 'mod-warning' })
      .addEventListener('click', () => {
        this.close();
        void this.onConfirm();
      });

    buttonContainer
      .createEl('button', { text: t('button.cancel') })
      .addEventListener('click', () => {
        this.close();
      });
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}

class ResetFieldsConfirmationModal extends Modal {
  constructor(
    app: App,
    private onConfirm: () => void | Promise<void>
  ) {
    super(app);
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.createEl('p', {
      text: t('settings.customization.custom-fields.reset.confirm-message'),
    });
    contentEl.createEl('p', {
      text: t('settings.customization.custom-fields.delete.cannot-undo'),
      cls: 'warning',
    });

    const buttonContainer = contentEl.createDiv({
      cls: 'modal-button-container journalit-modal-button-container',
    });

    buttonContainer
      .createEl('button', { text: t('button.delete-all'), cls: 'mod-warning' })
      .addEventListener('click', () => {
        this.close();
        void this.onConfirm();
      });

    buttonContainer
      .createEl('button', { text: t('button.cancel') })
      .addEventListener('click', () => {
        this.close();
      });
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}

class DeleteOptionConfirmationModal extends Modal {
  constructor(
    app: App,
    private optionName: string,
    private onConfirm: () => void | Promise<void>
  ) {
    super(app);
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.createEl('p', {
      text: t('settings.customization.custom-fields.option.delete-confirm', {
        optionName: this.optionName,
      }),
    });

    const buttonContainer = contentEl.createDiv({
      cls: 'modal-button-container journalit-modal-button-container',
    });

    buttonContainer
      .createEl('button', { text: t('button.delete'), cls: 'mod-warning' })
      .addEventListener('click', () => {
        this.close();
        void this.onConfirm();
      });

    buttonContainer
      .createEl('button', { text: t('button.cancel') })
      .addEventListener('click', () => {
        this.close();
      });
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}

class ClearAllOptionsConfirmationModal extends Modal {
  constructor(
    app: App,
    private fieldLabel: string,
    private onConfirm: () => void | Promise<void>
  ) {
    super(app);
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.createEl('p', {
      text: t('settings.customization.custom-fields.option.clear-confirm', {
        fieldLabel: this.fieldLabel,
      }),
    });
    contentEl.createEl('p', {
      text: t('settings.customization.custom-fields.delete.cannot-undo'),
      cls: 'warning',
    });

    const buttonContainer = contentEl.createDiv({
      cls: 'modal-button-container journalit-modal-button-container',
    });

    buttonContainer
      .createEl('button', { text: t('button.clear-all'), cls: 'mod-warning' })
      .addEventListener('click', () => {
        this.close();
        void this.onConfirm();
      });

    buttonContainer
      .createEl('button', { text: t('button.cancel') })
      .addEventListener('click', () => {
        this.close();
      });
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}


interface SavedCustomOptionsSectionProps {
  customFieldsService: CustomFieldsService | null;
  fields: CustomFieldDefinition[];
  onOptionsChanged: () => void;
  plugin: JournalitPlugin;
}

const SavedCustomOptionsSection: React.FC<SavedCustomOptionsSectionProps> = ({
  customFieldsService,
  fields,
  onOptionsChanged,
  plugin,
}) => {
  
  const fieldsWithSavedOptions = useMemo(() => {
    if (!customFieldsService) return [];
    return fields.filter(
      (field) =>
        (field.type === CustomFieldType.DROPDOWN ||
          field.type === CustomFieldType.MULTISELECT) &&
        field.allowCreateOptions &&
        customFieldsService.getFieldOptions(field.id).length > 0
    );
  }, [fields, customFieldsService]);

  const handleDeleteOption = useCallback(
    async (fieldId: string, option: string) => {
      if (!customFieldsService) return;

      new DeleteOptionConfirmationModal(plugin.app, option, async () => {
        try {
          await customFieldsService.removeFieldOption(fieldId, option);
          onOptionsChanged();
        } catch (error) {
          console.error('Failed to delete option:', error);
          new Notice(
            t('settings.customization.custom-fields.saved-options.delete-error')
          );
        }
      }).open();
    },
    [customFieldsService, plugin.app, onOptionsChanged]
  );

  const handleClearAllOptions = useCallback(
    async (fieldId: string, fieldLabel: string) => {
      if (!customFieldsService) return;

      new ClearAllOptionsConfirmationModal(plugin.app, fieldLabel, async () => {
        try {
          await customFieldsService.removeAllFieldOptions(fieldId);
          onOptionsChanged();
        } catch (error) {
          console.error('Failed to clear all options:', error);
          new Notice(
            t('settings.customization.custom-fields.saved-options.clear-error')
          );
        }
      }).open();
    },
    [customFieldsService, plugin.app, onOptionsChanged]
  );

  if (!customFieldsService || fieldsWithSavedOptions.length === 0) {
    return null; 
  }

  return (
    <div className="custom-fields-saved-options">
      <div className="setting-item">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('settings.customization.custom-fields.saved-options.title')}
          </div>
          <div className="setting-item-description">
            {t(
              'settings.customization.custom-fields.saved-options.description'
            )}
          </div>
        </div>
      </div>

      {fieldsWithSavedOptions.map((field) => {
        const savedOptions = customFieldsService.getFieldOptions(field.id);
        return (
          <FieldAccordion
            key={field.id}
            field={field}
            savedOptions={savedOptions}
            onDeleteOption={handleDeleteOption}
            onClearAll={handleClearAllOptions}
            initialExpanded={false}
          />
        );
      })}
    </div>
  );
};
