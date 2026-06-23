import React, {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { App, Modal, Notice } from 'obsidian';
import {
  Edit,
  Plus,
  Trash,
} from '../../../components/shared/icons/ObsidianIcon';
import JournalitPlugin from '../../../main';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/core/Input';
import { useService } from '../../../hooks';
import {
  CustomFieldType,
  generateFieldId,
  generateUniqueFieldKey,
  labelToFieldKey,
  validateFieldKey,
  validateFieldLabel,
} from '../../../types/customFields';
import type {
  CustomReviewFieldDefinition,
  CustomReviewFieldGroup,
} from '../../../types/reviewCustomFields';
import {
  DEFAULT_REVIEW_FIELD_INHERIT_TO,
  DEFAULT_REVIEW_FIELD_INHERITANCE_SOURCES,
  DEFAULT_REVIEW_FIELD_REVIEW_TYPES,
} from '../../../types/reviewCustomFields';
import { t } from '../../../lang/helpers';
import { ReviewFieldEditor } from './ReviewFieldEditor';

interface ReviewFieldsManagerProps {
  plugin: JournalitPlugin;
  onRequestExpansion?: () => void;
  remeasureContent?: () => void;
}

const asRecord = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? Object.fromEntries(Object.entries(value))
    : null;

const isCustomReviewFieldDefinition = (
  value: unknown
): value is CustomReviewFieldDefinition => {
  const record = asRecord(value);
  return Boolean(
    record &&
    typeof record.id === 'string' &&
    typeof record.label === 'string' &&
    typeof record.fieldKey === 'string' &&
    typeof record.type === 'string'
  );
};

const isCustomReviewFieldGroup = (
  value: unknown
): value is CustomReviewFieldGroup => {
  const record = asRecord(value);
  return Boolean(
    record && typeof record.id === 'string' && typeof record.name === 'string'
  );
};

function createDefaultReviewFieldDefinition(
  existingKeys: string[],
  groupId?: string
): CustomReviewFieldDefinition {
  const label = t('settings.customization.review-fields.default-label');
  const order = Date.now();

  return {
    id: generateFieldId(),
    label,
    fieldKey: generateUniqueFieldKey(label, existingKeys),
    type: CustomFieldType.TEXT,
    validation: {},
    options: [],
    order,
    scope: {
      reviewTypes: [...DEFAULT_REVIEW_FIELD_REVIEW_TYPES],
      editableOn: [...DEFAULT_REVIEW_FIELD_REVIEW_TYPES],
      inheritTo: [...DEFAULT_REVIEW_FIELD_INHERIT_TO],
    },
    inheritance: {
      enabled: true,
      sources: [...DEFAULT_REVIEW_FIELD_INHERITANCE_SOURCES],
      mode: 'inherit-and-local',
      showSourceLabels: true,
      hideWhenEmpty: false,
    },
    groupId,
    display: { order },
  };
}

interface ReviewFieldEditorPanelProps {
  editingField: CustomReviewFieldDefinition;
  isAddingNew: boolean;
  onSaveField: (field: CustomReviewFieldDefinition) => void | Promise<void>;
  onCancelEdit: () => void | Promise<void>;
  onDeleteField: (fieldId: string) => void | Promise<void>;
  generateUniqueKeyForField: (label: string, excludeFieldId?: string) => string;
  validateLabelForField: (
    label: string,
    excludeFieldId?: string
  ) => string | null;
  groups: CustomReviewFieldGroup[];
}

interface ReviewFieldsDangerZoneProps {
  hasConfiguredItems: boolean;
  onAddGroup: () => void | Promise<void>;
  onResetFields: () => void | Promise<void>;
}

const ReviewFieldEditorPanel: React.FC<ReviewFieldEditorPanelProps> = ({
  editingField,
  isAddingNew,
  onSaveField,
  onCancelEdit,
  onDeleteField,
  generateUniqueKeyForField,
  validateLabelForField,
  groups,
}) => (
  <div className="custom-fields-editor-panel">
    <div className="custom-fields-editor-panel-header">
      <div className="custom-fields-editor-panel-title">
        {isAddingNew
          ? t('settings.customization.review-fields.add-new')
          : t('settings.customization.review-fields.edit-field-with-name', {
              fieldLabel: editingField.label,
            })}
      </div>
      <div className="custom-fields-editor-panel-description">
        {t('settings.customization.review-fields.configure-desc')}
      </div>
    </div>
    <ReviewFieldEditor
      field={editingField}
      isNewField={isAddingNew}
      onSave={onSaveField}
      onCancel={onCancelEdit}
      onDelete={onDeleteField}
      generateUniqueKey={generateUniqueKeyForField}
      validateLabel={validateLabelForField}
      groups={groups}
    />
  </div>
);

const ReviewFieldsDangerZone: React.FC<ReviewFieldsDangerZoneProps> = ({
  hasConfiguredItems,
  onAddGroup,
  onResetFields,
}) => (
  <div className="custom-fields-danger-zone">
    <div>
      <div className="custom-fields-danger-zone-title">
        {hasConfiguredItems
          ? t('settings.customization.custom-fields.actions')
          : t('settings.customization.review-fields.no-fields')}
      </div>
      <div className="custom-fields-danger-zone-description">
        {hasConfiguredItems
          ? t('settings.customization.review-fields.actions-desc')
          : t('settings.customization.review-fields.no-fields-desc')}
      </div>
    </div>
    <div className="custom-fields-actions-buttons">
      {!hasConfiguredItems && (
        <Button variant="primary" onClick={onAddGroup}>
          {t('settings.customization.review-fields.groups.add-button')}
        </Button>
      )}
      {hasConfiguredItems && (
        <Button
          variant="danger"
          onClick={onResetFields}
          className="custom-fields-delete-all-button"
        >
          {t('settings.customization.review-fields.delete-all-button')}
        </Button>
      )}
    </div>
  </div>
);

const useReviewFieldsManagerController = ({
  plugin,
  onRequestExpansion,
  remeasureContent,
}: ReviewFieldsManagerProps) => {
  const { service: customReviewFieldsService, status } = useService(
    'customReviewFieldsService'
  );
  const [fields, setFields] = useState<CustomReviewFieldDefinition[]>([]);
  const [groups, setGroups] = useState<CustomReviewFieldGroup[]>([]);
  const [editingField, setEditingField] =
    useState<CustomReviewFieldDefinition | null>(null);
  const [editingGroup, setEditingGroup] =
    useState<CustomReviewFieldGroup | null>(null);
  const [editingGroupName, setEditingGroupName] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const remeasureTimeoutRef = useRef<number | null>(null);

  const debouncedRemeasure = useCallback(() => {
    if (!remeasureContent) return;
    if (remeasureTimeoutRef.current) {
      window.clearTimeout(remeasureTimeoutRef.current);
    }
    remeasureTimeoutRef.current = window.setTimeout(() => {
      window.requestAnimationFrame(() => remeasureContent());
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
    if (customReviewFieldsService && status === 'ready') {
      setFields(customReviewFieldsService.getFields());
      setGroups(customReviewFieldsService.getGroups());
    }
  }, [customReviewFieldsService, status]);

  useEffect(() => {
    loadFields();

    const handleReviewFieldsChanged = (payload: unknown) => {
      const nextPayload = asRecord(payload);
      if (!nextPayload || !('fields' in nextPayload)) return;

      if (Array.isArray(nextPayload.fields)) {
        setFields(nextPayload.fields.filter(isCustomReviewFieldDefinition));
      }
      if (Array.isArray(nextPayload.groups)) {
        setGroups(nextPayload.groups.filter(isCustomReviewFieldGroup));
      }
    };

    plugin.app.workspace.on(
      'journalit-custom-review-fields-changed',
      handleReviewFieldsChanged
    );
    return () => {
      plugin.app.workspace.off(
        'journalit-custom-review-fields-changed',
        handleReviewFieldsChanged
      );
    };
  }, [loadFields, plugin.app]);

  const generateUniqueKeyForField = useCallback(
    (label: string, excludeFieldId?: string): string => {
      const existingKeys = fields.reduce<string[]>((acc, field) => {
        if (field.id !== excludeFieldId) {
          acc.push(field.fieldKey || labelToFieldKey(field.label));
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
      if (reservedLabelError) return reservedLabelError;

      const normalizedLabel = label.trim().toLowerCase();
      if (!normalizedLabel) return null;

      const hasDuplicateLabel = fields.some(
        (field) =>
          field.id !== excludeFieldId &&
          field.label.trim().toLowerCase() === normalizedLabel
      );

      return hasDuplicateLabel ? t('error.settings.field-name-conflict') : null;
    },
    [fields]
  );

  const handleAddField = (groupId?: string) => {
    onRequestExpansion?.();
    const existingKeys = fields.map(
      (field) => field.fieldKey || labelToFieldKey(field.label)
    );
    setEditingField(createDefaultReviewFieldDefinition(existingKeys, groupId));
    setIsAddingNew(true);
  };

  const handleAddGroup = async () => {
    if (!customReviewFieldsService || status !== 'ready') {
      console.error('CustomReviewFieldsService not ready, status:', status);
      return;
    }

    try {
      await customReviewFieldsService
        .addGroup({
          name: t('settings.customization.review-fields.groups.default-name'),
        })
        .then((group) => {
          setEditingGroup(group);
          setEditingGroupName('');
        });
      loadFields();
      debouncedRemeasure();
    } catch (error) {
      console.error('Failed to add custom review field group:', error);
      new Notice(
        t('settings.customization.review-fields.groups.error.save-failed')
      );
    }
  };

  const handleRenameGroup = (group: CustomReviewFieldGroup) => {
    setEditingGroup(group);
    setEditingGroupName(group.name);
  };

  const handleSaveGroupName = async () => {
    if (!editingGroup) return;
    if (!customReviewFieldsService || status !== 'ready') {
      console.error('CustomReviewFieldsService not ready, status:', status);
      return;
    }

    try {
      await customReviewFieldsService.updateGroup(editingGroup.id, {
        name: editingGroupName,
      });
      setEditingGroup(null);
      setEditingGroupName('');
      loadFields();
      debouncedRemeasure();
    } catch (error) {
      console.error('Failed to rename custom review field group:', error);
      new Notice(
        t('settings.customization.review-fields.groups.error.save-failed')
      );
    }
  };

  const handleCancelGroupEdit = () => {
    setEditingGroup(null);
    setEditingGroupName('');
  };

  const handleDeleteGroup = async (group: CustomReviewFieldGroup) => {
    if (!customReviewFieldsService || status !== 'ready') {
      console.error('CustomReviewFieldsService not ready, status:', status);
      return;
    }

    new DeleteReviewFieldGroupConfirmationModal(
      plugin.app,
      group.name,
      async () => {
        try {
          await customReviewFieldsService.removeGroup(group.id);
          loadFields();
          debouncedRemeasure();
        } catch (error) {
          console.error('Failed to delete custom review field group:', error);
        }
      }
    ).open();
  };

  const handleEditField = (field: CustomReviewFieldDefinition) => {
    onRequestExpansion?.();
    setEditingField({ ...field });
    setIsAddingNew(false);
  };

  const handleSaveField = useCallback(
    async (field: CustomReviewFieldDefinition) => {
      if (!customReviewFieldsService || status !== 'ready') {
        console.error('CustomReviewFieldsService not ready, status:', status);
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

      const existingKeys = fields.reduce<string[]>((acc, existingField) => {
        if (existingField.id !== field.id) {
          acc.push(
            existingField.fieldKey || labelToFieldKey(existingField.label)
          );
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
        startTransition(() => {
          setEditingField(null);
          setIsAddingNew(false);
        });

        if (isAddingNew) {
          await customReviewFieldsService.addField(field);
        } else {
          await customReviewFieldsService.updateField(field.id, field);
        }
        loadFields();
        debouncedRemeasure();
      } catch (error) {
        console.error('Failed to save custom review field:', error);
        new Notice(t('settings.customization.review-fields.error.save-failed'));
      }
    },
    [
      customReviewFieldsService,
      debouncedRemeasure,
      fields,
      isAddingNew,
      loadFields,
      status,
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
      if (!customReviewFieldsService || status !== 'ready') {
        console.error('CustomReviewFieldsService not ready, status:', status);
        return;
      }

      const fieldToDelete =
        editingField?.id === fieldId
          ? editingField
          : fields.find((field) => field.id === fieldId);
      const fieldLabel =
        fieldToDelete?.label ||
        t('settings.customization.review-fields.unknown-field');

      new DeleteReviewFieldConfirmationModal(
        plugin.app,
        fieldLabel,
        async () => {
          try {
            startTransition(() => {
              setEditingField(null);
              setIsAddingNew(false);
            });

            await customReviewFieldsService.removeField(fieldId);
            loadFields();
            debouncedRemeasure();
          } catch (error) {
            console.error('Failed to delete custom review field:', error);
          }
        }
      ).open();
    },
    [
      customReviewFieldsService,
      debouncedRemeasure,
      editingField,
      fields,
      loadFields,
      plugin.app,
      status,
    ]
  );

  const handleResetFields = async () => {
    if (!customReviewFieldsService || status !== 'ready') {
      console.error('CustomReviewFieldsService not ready, status:', status);
      return;
    }

    new ResetReviewFieldsConfirmationModal(plugin.app, async () => {
      try {
        startTransition(() => {
          setEditingField(null);
          setIsAddingNew(false);
        });

        await customReviewFieldsService.resetFields();
        loadFields();
        debouncedRemeasure();
      } catch (error) {
        console.error('Failed to reset custom review fields:', error);
      }
    }).open();
  };

  const groupedFieldSections = useMemo(() => {
    const sections: Array<{
      group: CustomReviewFieldGroup | null;
      fields: CustomReviewFieldDefinition[];
    }> = groups.map((group) => ({
      group,
      fields: fields.filter((field) => field.groupId === group.id),
    }));
    const ungroupedFields = fields.filter((field) => !field.groupId);
    if (ungroupedFields.length > 0) {
      sections.push({ group: null, fields: ungroupedFields });
    }
    return sections;
  }, [fields, groups]);

  const handleMoveField = useCallback(
    async (
      fieldId: string,
      direction: 'up' | 'down',
      sectionFieldIds: string[]
    ) => {
      if (!customReviewFieldsService || status !== 'ready') {
        console.error('CustomReviewFieldsService not ready, status:', status);
        return;
      }

      const currentIndex = sectionFieldIds.indexOf(fieldId);
      const targetIndex =
        direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (
        currentIndex === -1 ||
        targetIndex < 0 ||
        targetIndex >= sectionFieldIds.length
      ) {
        return;
      }

      const reorderedSectionIds = [...sectionFieldIds];
      const [movedFieldId] = reorderedSectionIds.splice(currentIndex, 1);
      reorderedSectionIds.splice(targetIndex, 0, movedFieldId);

      const fieldIdsByGroup = new Map<string, string[]>();
      for (const section of groupedFieldSections) {
        fieldIdsByGroup.set(
          section.group?.id || 'ungrouped',
          section.fields.map((field) => field.id)
        );
      }
      const currentField = fields.find((field) => field.id === fieldId);
      const currentGroupKey = currentField?.groupId || 'ungrouped';
      fieldIdsByGroup.set(currentGroupKey, reorderedSectionIds);

      const reorderedFieldIds = groupedFieldSections.flatMap(
        (section) => fieldIdsByGroup.get(section.group?.id || 'ungrouped') ?? []
      );
      const fieldMap = new Map(fields.map((field) => [field.id, field]));
      setFields(
        reorderedFieldIds.reduce<CustomReviewFieldDefinition[]>((acc, id) => {
          const field = fieldMap.get(id);
          if (field) {
            acc.push(field);
          }
          return acc;
        }, [])
      );

      try {
        await customReviewFieldsService.reorderFields(reorderedFieldIds);
        loadFields();
      } catch (error) {
        console.error('Failed to reorder custom review fields:', error);
        loadFields();
      }
    },
    [
      customReviewFieldsService,
      fields,
      groupedFieldSections,
      loadFields,
      status,
    ]
  );

  return {
    fields,
    groups,
    editingField,
    editingGroup,
    editingGroupName,
    isAddingNew,
    groupedFieldSections,
    handleAddGroup,
    handleRenameGroup,
    handleDeleteGroup,
    handleAddField,
    handleSaveGroupName,
    handleCancelGroupEdit,
    setEditingGroupName,
    handleMoveField,
    handleEditField,
    handleSaveField,
    handleCancelEdit,
    handleDeleteField,
    generateUniqueKeyForField,
    validateLabelForField,
    handleResetFields,
  };
};

export const ReviewFieldsManager: React.FC<ReviewFieldsManagerProps> = ({
  plugin,
  onRequestExpansion,
  remeasureContent,
}) => {
  const {
    fields,
    groups,
    editingField,
    editingGroup,
    editingGroupName,
    isAddingNew,
    groupedFieldSections,
    handleAddGroup,
    handleRenameGroup,
    handleDeleteGroup,
    handleAddField,
    handleSaveGroupName,
    handleCancelGroupEdit,
    setEditingGroupName,
    handleMoveField,
    handleEditField,
    handleSaveField,
    handleCancelEdit,
    handleDeleteField,
    generateUniqueKeyForField,
    validateLabelForField,
    handleResetFields,
  } = useReviewFieldsManagerController({
    plugin,
    onRequestExpansion,
    remeasureContent,
  });

  return (
    <div className="custom-fields-manager custom-review-fields-manager">
      <div className="custom-fields-intro">
        {t('settings.customization.review-fields.description')}
      </div>

      {(fields.length > 0 || groups.length > 0) && (
        <div className="custom-fields-list-panel">
          <div className="custom-fields-list-header">
            <div>
              <div className="custom-fields-list-title">
                {t('settings.customization.review-fields.title', {
                  count: String(fields.length),
                })}
              </div>
              <div className="custom-fields-list-description">
                {t('settings.customization.review-fields.manage-desc')}
              </div>
            </div>
            <div className="custom-fields-list-header-actions">
              {!editingField && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => void handleAddGroup()}
                >
                  {t('settings.customization.review-fields.groups.add-button')}
                </Button>
              )}
            </div>
          </div>

          <div className="custom-review-field-groups-list">
            {groupedFieldSections.map(({ group, fields: sectionFields }) => {
              const sectionId = group?.id || 'ungrouped';
              return (
                <div
                  key={sectionId}
                  className="custom-review-field-group-panel"
                >
                  <div className="custom-review-field-group-header">
                    <div className="setting-item-info">
                      <div className="setting-item-name">
                        {group?.name ||
                          t(
                            'settings.customization.review-fields.groups.ungrouped'
                          )}
                      </div>
                      <div className="setting-item-description">
                        {group?.description ||
                          t(
                            'settings.customization.review-fields.groups.field-count',
                            {
                              count: String(sectionFields.length),
                            }
                          )}
                      </div>
                    </div>
                    <div className="setting-item-control">
                      <div className="custom-fields-field-actions">
                        {group && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRenameGroup(group)}
                              aria-label={`${t('validation.edit')}: ${group.name}`}
                              className="custom-review-field-group-icon-button"
                            >
                              <Edit size={14} aria-hidden="true" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteGroup(group)}
                              aria-label={`${t('button.delete')}: ${group.name}`}
                              className="custom-review-field-group-icon-button"
                            >
                              <Trash size={14} aria-hidden="true" />
                            </Button>
                          </>
                        )}
                        {group && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleAddField(group.id)}
                            aria-label={`${t(
                              'settings.customization.review-fields.add-button'
                            )}: ${group.name}`}
                            className="custom-review-field-group-icon-button custom-review-field-group-add-button"
                          >
                            <Plus size={14} aria-hidden="true" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {editingGroup?.id === group?.id && (
                    <div className="custom-review-field-group-editor">
                      <div className="custom-review-field-group-editor-label">
                        {t(
                          'settings.customization.review-fields.groups.rename-prompt'
                        )}
                      </div>
                      <Input
                        value={editingGroupName}
                        onChange={setEditingGroupName}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter') {
                            event.preventDefault();
                            void handleSaveGroupName();
                          }
                        }}
                        placeholder={t(
                          'settings.customization.review-fields.groups.rename-prompt'
                        )}
                      />
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => void handleSaveGroupName()}
                      >
                        {t('button.save')}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => void handleCancelGroupEdit()}
                      >
                        {t('button.cancel')}
                      </Button>
                    </div>
                  )}

                  <div className="custom-fields-field-list">
                    {sectionFields.length === 0 ? (
                      <div className="custom-fields-empty-group">
                        {t('settings.customization.review-fields.groups.empty')}
                      </div>
                    ) : (
                      sectionFields.map((field, index) => (
                        <div
                          key={field.id}
                          className="custom-fields-field-item"
                        >
                          <div className="setting-item-info">
                            <div className="setting-item-name">
                              {field.label}
                            </div>
                            <div className="setting-item-description">
                              {t(
                                'settings.customization.review-fields.field-summary',
                                {
                                  type: field.type,
                                  reviews: field.scope.reviewTypes
                                    .map((type) =>
                                      t(`template.review-type.${type}`)
                                    )
                                    .join(', '),
                                }
                              )}
                            </div>
                          </div>
                          <div className="setting-item-control">
                            <div className="custom-fields-field-actions">
                              <div className="custom-fields-reorder-controls">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleMoveField(
                                      field.id,
                                      'up',
                                      sectionFields.map((item) => item.id)
                                    )
                                  }
                                  disabled={index === 0}
                                  aria-label={`${t('button.move-up')}: ${field.label}`}
                                  className="custom-fields-reorder-button"
                                >
                                  ↑
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleMoveField(
                                      field.id,
                                      'down',
                                      sectionFields.map((item) => item.id)
                                    )
                                  }
                                  disabled={index === sectionFields.length - 1}
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
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {editingField && (
        <ReviewFieldEditorPanel
          editingField={editingField}
          isAddingNew={isAddingNew}
          onSaveField={handleSaveField}
          onCancelEdit={handleCancelEdit}
          onDeleteField={handleDeleteField}
          generateUniqueKeyForField={generateUniqueKeyForField}
          validateLabelForField={validateLabelForField}
          groups={groups}
        />
      )}

      {!editingField && (
        <ReviewFieldsDangerZone
          hasConfiguredItems={fields.length > 0 || groups.length > 0}
          onAddGroup={handleAddGroup}
          onResetFields={handleResetFields}
        />
      )}
    </div>
  );
};

class DeleteReviewFieldConfirmationModal extends Modal {
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
      text: t('settings.customization.review-fields.delete.confirm-message', {
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
      .addEventListener('click', () => this.close());
  }

  onClose() {
    this.contentEl.empty();
  }
}

class DeleteReviewFieldGroupConfirmationModal extends Modal {
  constructor(
    app: App,
    private groupName: string,
    private onConfirm: () => void | Promise<void>
  ) {
    super(app);
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.createEl('p', {
      text: t('settings.customization.review-fields.groups.delete-message', {
        groupName: this.groupName,
      }),
    });
    contentEl.createEl('p', {
      text: t('settings.customization.review-fields.groups.delete-note'),
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
      .addEventListener('click', () => this.close());
  }

  onClose() {
    this.contentEl.empty();
  }
}

class ResetReviewFieldsConfirmationModal extends Modal {
  constructor(
    app: App,
    private onConfirm: () => void | Promise<void>
  ) {
    super(app);
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.createEl('p', {
      text: t('settings.customization.review-fields.reset.confirm-message'),
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
      .addEventListener('click', () => this.close());
  }

  onClose() {
    this.contentEl.empty();
  }
}
