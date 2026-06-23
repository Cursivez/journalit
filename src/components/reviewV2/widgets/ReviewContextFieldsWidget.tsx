import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { TFile } from 'obsidian';
import JournalitPlugin from '../../../main';
import { Input } from '../../core/Input';
import { NumberInput } from '../../core/NumberInput';
import { Select } from '../../core/Select';
import { ComboBox } from '../../core/ComboBox';
import { FastDateTimeInput } from '../../core/FastDateTimeInput';
import { Button } from '../../ui/Button';
import { t } from '../../../lang/helpers';
import { parseLocalDateSafe } from '../../../utils/dateUtils';
import { eventBus } from '../../../services/events/EventBus';
import type {
  InheritedReviewContext,
  ReviewContextSource,
} from '../../../services/ReviewContextInheritanceService';
import {
  CustomFieldDefinition,
  CustomFieldType,
  validateCustomFieldValue,
} from '../../../types/customFields';
import type {
  CustomReviewFieldDefinition,
  CustomReviewFieldGroup,
  ReviewFieldReviewType,
} from '../../../types/reviewCustomFields';
import type { ReviewContextFieldsWidgetConfig } from '../../../types/reviewV2';
import {
  readReviewCustomFieldValuesByIdFromFrontmatter,
  mergeReviewCustomFieldsFrontmatter,
} from '../../../utils/reviewCustomFieldPersistence';
import { InvalidContextMessage } from './InvalidContextMessage';

interface ReviewContextFieldsWidgetProps {
  filePath: string;
  plugin: JournalitPlugin;
  config?: ReviewContextFieldsWidgetConfig;
  preview?: boolean;
  previewReviewType?: ReviewFieldReviewType;
}

type ReviewNoteFrontmatterType =
  | 'drc'
  | 'weekly-review'
  | 'monthly-review'
  | 'quarterly-review'
  | 'yearly-review';

const FRONTMATTER_TYPE_TO_REVIEW_TYPE: Record<
  ReviewNoteFrontmatterType,
  ReviewFieldReviewType
> = {
  drc: 'drc',
  'weekly-review': 'weekly',
  'monthly-review': 'monthly',
  'quarterly-review': 'quarterly',
  'yearly-review': 'yearly',
};

const SAVE_DEBOUNCE_MS = 500;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return isRecord(value) ? value : undefined;
}

function isReviewNoteType(value: unknown): value is ReviewNoteFrontmatterType {
  return (
    value === 'drc' ||
    value === 'weekly-review' ||
    value === 'monthly-review' ||
    value === 'quarterly-review' ||
    value === 'yearly-review'
  );
}

function toValidationField(
  field: CustomReviewFieldDefinition
): CustomFieldDefinition {
  return {
    ...field,
    options: field.options?.map((option) => ({ value: option, label: option })),
  };
}

function getDefaultFieldValue(field: CustomReviewFieldDefinition): unknown {
  if (field.type === CustomFieldType.MULTISELECT) return [];
  if (field.type === CustomFieldType.NUMBER) return undefined;
  return '';
}

function getCompactSourceLabel(source: ReviewContextSource): string {
  return getReviewTypeSourceLabel(source.type);
}

function getReviewTypeSourceLabel(type: ReviewFieldReviewType): string {
  switch (type) {
    case 'yearly':
      return t('common.year');
    case 'quarterly':
      return t('common.quarter');
    case 'monthly':
      return t('common.month');
    case 'weekly':
      return t('common.week');
    case 'drc':
      return 'DRC';
    default: {
      const exhaustive: never = type;
      return exhaustive;
    }
  }
}

function reviewContextValueToString(value: unknown): string {
  if (value === undefined || value === null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean')
    return String(value);
  if (value instanceof Date) return value.toISOString();
  return JSON.stringify(value);
}

function formatReviewContextDisplayValue(value: unknown): string {
  const displayValue = reviewContextValueToString(value).trim();
  if (displayValue) return displayValue;
  if (Array.isArray(value) && value.length > 0) {
    return value.map(reviewContextValueToString).join(', ');
  }
  return t('common.none');
}

function getTargetDateFromFrontmatter(
  frontmatter: Record<string, unknown>
): Date | null {
  const dateFields = [
    frontmatter.date,
    frontmatter.weekStart,
    frontmatter.monthStart,
    frontmatter.quarterStart,
    frontmatter.yearStart,
  ];

  for (const value of dateFields) {
    if (typeof value !== 'string') continue;
    const parsed = parseLocalDateSafe(value);
    if (parsed) return parsed;
  }

  return null;
}

export const ReviewContextFieldsWidget: React.FC<ReviewContextFieldsWidgetProps> =
  React.memo(({ filePath, plugin, config, preview, previewReviewType }) => {
    const [reviewType, setReviewType] = useState<ReviewFieldReviewType | null>(
      previewReviewType ?? null
    );
    const [fields, setFields] = useState<CustomReviewFieldDefinition[]>([]);
    const [reviewFieldGroups, setReviewFieldGroups] = useState<
      CustomReviewFieldGroup[]
    >([]);
    const [values, setValues] = useState<Record<string, unknown>>({});
    const [inheritedContext, setInheritedContext] =
      useState<InheritedReviewContext | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isEditingLocalContext, setIsEditingLocalContext] = useState(false);
    const [loading, setLoading] = useState(!preview);
    const [isValidContext, setIsValidContext] = useState(true);
    const dirtyRef = useRef(false);
    const pendingValuesRef = useRef<Record<string, unknown> | null>(null);
    const persistValuesRef = useRef<
      ((nextValues: Record<string, unknown>) => Promise<void>) | null
    >(null);
    const saveTimeoutRef = useRef<number | null>(null);
    const inheritedRequestIdRef = useRef(0);
    const inheritedDependencyPathsRef = useRef<Set<string>>(new Set());
    const inheritedTargetRef = useRef<{
      type: ReviewFieldReviewType;
      date: Date;
    } | null>(null);

    const service = plugin.customReviewFieldsService;
    const reviewFieldGroupLabels = useMemo(
      () => new Map(reviewFieldGroups.map((group) => [group.id, group.name])),
      [reviewFieldGroups]
    );

    const loadInheritedContext = useCallback(
      async (type: ReviewFieldReviewType, targetDate: Date) => {
        const requestId = ++inheritedRequestIdRef.current;
        if (preview) {
          setInheritedContext(null);
          return;
        }

        try {
          const context =
            await plugin.reviewContextInheritanceService.getInheritedContext({
              targetType: type,
              targetDate,
            });
          if (requestId === inheritedRequestIdRef.current) {
            inheritedDependencyPathsRef.current = new Set(
              context.sources.map((source) => source.path)
            );
            setInheritedContext(context);
          }
        } catch (error) {
          console.error(
            '[ReviewContextFieldsWidget] Failed to load inherited review context:',
            error
          );
          if (requestId === inheritedRequestIdRef.current) {
            inheritedDependencyPathsRef.current = new Set();
            setInheritedContext(null);
          }
        }
      },
      [plugin.reviewContextInheritanceService, preview]
    );

    const loadFields = useCallback(
      (type: ReviewFieldReviewType | null) => {
        if (!service || !type) {
          setFields([]);
          return [];
        }

        const editableFields = service.getEditableFieldsForReview(type);
        setFields(editableFields);
        setReviewFieldGroups('getGroups' in service ? service.getGroups() : []);
        return editableFields;
      },
      [service]
    );

    const loadValues = useCallback(() => {
      if (preview) {
        const type = previewReviewType ?? 'drc';
        setReviewType(type);
        loadFields(type);
        setValues({});
        setInheritedContext(null);
        setLoading(false);
        setIsValidContext(true);
        return;
      }

      const file = plugin.app.vault.getAbstractFileByPath(filePath);
      if (!(file instanceof TFile)) {
        setIsValidContext(false);
        setLoading(false);
        return;
      }

      const frontmatter = asRecord(
        plugin.app.metadataCache.getFileCache(file)?.frontmatter
      );
      const type = frontmatter?.type;
      if (!frontmatter || !isReviewNoteType(type)) {
        setIsValidContext(false);
        setLoading(false);
        return;
      }

      const normalizedType = FRONTMATTER_TYPE_TO_REVIEW_TYPE[type];
      const targetDate = getTargetDateFromFrontmatter(frontmatter);
      const editableFields = loadFields(normalizedType);
      inheritedTargetRef.current = targetDate
        ? { type: normalizedType, date: targetDate }
        : null;
      setReviewType(normalizedType);
      setValues(
        readReviewCustomFieldValuesByIdFromFrontmatter(
          frontmatter,
          editableFields
        )
      );
      if (targetDate) {
        setInheritedContext(null);
        void loadInheritedContext(normalizedType, targetDate);
      } else {
        inheritedRequestIdRef.current += 1;
        inheritedDependencyPathsRef.current = new Set();
        setInheritedContext(null);
      }
      setIsValidContext(true);
      setLoading(false);
    }, [
      filePath,
      loadInheritedContext,
      loadFields,
      plugin.app.metadataCache,
      plugin.app.vault,
      preview,
      previewReviewType,
    ]);

    useEffect(() => {
      loadValues();

      if (preview) return;

      const handleMetadataChange = (file: TFile) => {
        if (file.path === filePath) {
          if (!dirtyRef.current) loadValues();
          return;
        }

        if (inheritedDependencyPathsRef.current.has(file.path)) {
          const target = inheritedTargetRef.current;
          if (target) void loadInheritedContext(target.type, target.date);
        }
      };

      const reloadInheritedFromEvent = () => {
        const target = inheritedTargetRef.current;
        if (target) void loadInheritedContext(target.type, target.date);
      };

      const reloadCurrentFromEvent = () => {
        if (dirtyRef.current) {
          reloadInheritedFromEvent();
        } else {
          loadValues();
        }
      };

      const handleFieldsChanged = () => {
        loadFields(reviewType);
        if (!dirtyRef.current) loadValues();
      };

      const reviewChangedUnsubscribe = eventBus.subscribe(
        'review:changed',
        (payload) => {
          if (payload.source === 'review-context-fields') return;
          if (payload.filePath === filePath) {
            reloadCurrentFromEvent();
            return;
          }
          if (
            payload.filePath &&
            inheritedDependencyPathsRef.current.has(payload.filePath)
          ) {
            reloadInheritedFromEvent();
          }
        }
      );

      plugin.app.metadataCache.on('changed', handleMetadataChange);
      plugin.app.workspace.on(
        'journalit-custom-review-fields-changed',
        handleFieldsChanged
      );
      plugin.app.workspace.on(
        'journalit-custom-review-field-options-changed',
        handleFieldsChanged
      );

      return () => {
        plugin.app.metadataCache.off('changed', handleMetadataChange);
        plugin.app.workspace.off(
          'journalit-custom-review-fields-changed',
          handleFieldsChanged
        );
        plugin.app.workspace.off(
          'journalit-custom-review-field-options-changed',
          handleFieldsChanged
        );
        reviewChangedUnsubscribe();
      };
    }, [
      filePath,
      loadFields,
      loadInheritedContext,
      loadValues,
      plugin.app.metadataCache,
      plugin.app.workspace,
      preview,
      reviewType,
    ]);

    const validateValues = useCallback(
      (nextValues: Record<string, unknown>) => {
        const nextErrors: Record<string, string> = {};
        for (const field of fields) {
          const error = validateCustomFieldValue(
            nextValues[field.id],
            toValidationField(field),
            service?.getFieldOptions(field.id) ?? []
          );
          if (error) nextErrors[field.id] = error;
        }
        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
      },
      [fields, service]
    );

    const persistValues = useCallback(
      async (nextValues: Record<string, unknown>) => {
        if (preview || !reviewType) return;
        if (!validateValues(nextValues)) return;

        const file = plugin.app.vault.getAbstractFileByPath(filePath);
        if (!(file instanceof TFile)) return;

        try {
          await plugin.app.fileManager.processFrontMatter(
            file,
            (frontmatter) => {
              const record = asRecord(frontmatter) ?? {};
              record.reviewCustomFields = mergeReviewCustomFieldsFrontmatter(
                record.reviewCustomFields,
                nextValues,
                fields,
                { includeClearedFields: true }
              );
            }
          );

          if (pendingValuesRef.current === nextValues) {
            dirtyRef.current = false;
            pendingValuesRef.current = null;
          }
          eventBus.publish('review:changed', {
            action: 'updated',
            type: reviewType,
            filePath,
            source: 'review-context-fields',
          });
        } catch (error) {
          console.error(
            '[ReviewContextFieldsWidget] Failed to update review custom fields:',
            error
          );
        }
      },
      [
        fields,
        filePath,
        plugin.app.fileManager,
        plugin.app.vault,
        preview,
        reviewType,
        validateValues,
      ]
    );

    useEffect(() => {
      persistValuesRef.current = persistValues;
    }, [persistValues]);

    useEffect(() => {
      return () => {
        if (saveTimeoutRef.current !== null) {
          window.clearTimeout(saveTimeoutRef.current);
        }
        if (dirtyRef.current && pendingValuesRef.current) {
          void persistValuesRef.current?.(pendingValuesRef.current);
        }
      };
    }, []);

    const schedulePersist = useCallback(
      (nextValues: Record<string, unknown>) => {
        dirtyRef.current = true;
        pendingValuesRef.current = nextValues;
        if (saveTimeoutRef.current !== null) {
          window.clearTimeout(saveTimeoutRef.current);
        }
        saveTimeoutRef.current = window.setTimeout(() => {
          saveTimeoutRef.current = null;
          void persistValues(nextValues);
        }, SAVE_DEBOUNCE_MS);
      },
      [persistValues]
    );

    const handleChange = useCallback(
      (fieldId: string, value: unknown) => {
        setValues((currentValues) => {
          const nextValues = { ...currentValues, [fieldId]: value };
          schedulePersist(nextValues);
          return nextValues;
        });
      },
      [schedulePersist]
    );

    const openReviewFieldSettings = useCallback(() => {
      plugin.app.saveLocalStorage('journalit:open-review-fields-settings', '1');
      plugin.openSettingsToTab('customization');
      window.dispatchEvent(new Event('journalit:open-review-fields-settings'));
    }, [plugin]);

    const handleOpenSourceReview = useCallback(
      async (source: ReviewContextSource) => {
        if (preview) return;

        try {
          if (!source.exists) {
            const date = inheritedTargetRef.current?.date ?? new Date();
            switch (source.type) {
              case 'weekly': {
                const weeklyService =
                  await plugin.serviceManager.getWeeklyReviewService();
                await weeklyService.createWeeklyReview(date);
                break;
              }
              case 'monthly': {
                const monthlyService =
                  await plugin.serviceManager.getMonthlyReviewService();
                await monthlyService.createMonthlyReview(date);
                break;
              }
              case 'quarterly': {
                const quarterlyService =
                  await plugin.serviceManager.getQuarterlyReviewService();
                await quarterlyService.createQuarterlyReview(date);
                break;
              }
              case 'yearly': {
                const yearlyService =
                  await plugin.serviceManager.getYearlyReviewService();
                await yearlyService.createYearlyReview(date);
                break;
              }
              case 'drc':
                return;
            }
          }

          await plugin.app.workspace.openLinkText(source.path, filePath);
          if (!dirtyRef.current) {
            loadValues();
          } else {
            const target = inheritedTargetRef.current;
            if (target) void loadInheritedContext(target.type, target.date);
          }
        } catch (error) {
          console.error(
            '[ReviewContextFieldsWidget] Failed to open inherited review context source:',
            error
          );
        }
      },
      [filePath, loadInheritedContext, loadValues, plugin, preview]
    );

    const inheritedFieldDefinitions = useMemo(
      () =>
        reviewType
          ? (service?.getInheritedFieldsForReview(reviewType) ?? [])
          : [],
      [reviewType, service]
    );
    const selectedFieldIds = useMemo(
      () =>
        new Set(
          (config?.fieldIds || '').split(',').flatMap((fieldId) => {
            const trimmed = fieldId.trim();
            return trimmed ? [trimmed] : [];
          })
        ),
      [config?.fieldIds]
    );
    const filterFieldByConfig = useCallback(
      (field: CustomReviewFieldDefinition): boolean => {
        const selectionMode = config?.selectionMode ?? 'all';
        if (selectionMode === 'group') {
          return Boolean(config?.groupId) && field.groupId === config?.groupId;
        }
        if (selectionMode === 'fields') {
          return selectedFieldIds.has(field.id);
        }
        return true;
      },
      [config?.groupId, config?.selectionMode, selectedFieldIds]
    );
    const showInherited = config?.showInherited ?? true;
    const showLocal = config?.showLocal ?? true;
    const hideEmpty = config?.hideEmpty ?? false;
    const visibleEditableFields = useMemo(
      () => fields.filter(filterFieldByConfig),
      [fields, filterFieldByConfig]
    );
    const visibleInheritedFieldDefinitions = useMemo(
      () =>
        showInherited
          ? inheritedFieldDefinitions.filter(filterFieldByConfig)
          : [],
      [filterFieldByConfig, inheritedFieldDefinitions, showInherited]
    );
    const inheritedSourceTypes = useMemo(
      () =>
        new Set(
          visibleInheritedFieldDefinitions.flatMap((field) =>
            field.inheritance.sources.filter((sourceType) =>
              field.scope.reviewTypes.includes(sourceType)
            )
          )
        ),
      [visibleInheritedFieldDefinitions]
    );
    const inheritedSources = useMemo(
      () =>
        showInherited
          ? (inheritedContext?.sources ?? []).filter((source) =>
              inheritedSourceTypes.has(source.type)
            )
          : [],
      [inheritedContext?.sources, inheritedSourceTypes, showInherited]
    );
    const hasInheritedContext = inheritedSources.length > 0;

    const groupedFields = useMemo(() => {
      const fieldMap = new Map<string, CustomReviewFieldDefinition>();
      for (const field of visibleInheritedFieldDefinitions) {
        fieldMap.set(field.id, field);
      }
      if (showLocal) {
        for (const field of visibleEditableFields) {
          fieldMap.set(field.id, field);
        }
      }

      const groups = new Map<string, CustomReviewFieldDefinition[]>();
      for (const field of fieldMap.values()) {
        const group =
          (field.groupId && reviewFieldGroupLabels.get(field.groupId)) ||
          t('widget.review-context-fields.group.default');
        const existing = groups.get(group) ?? [];
        existing.push(field);
        groups.set(group, existing);
      }
      return Array.from(groups.entries()).map(([group, groupFields]) => ({
        group,
        fields: groupFields.sort(
          (a, b) => (a.display.order ?? a.order) - (b.display.order ?? b.order)
        ),
      }));
    }, [
      showLocal,
      visibleEditableFields,
      visibleInheritedFieldDefinitions,
      reviewFieldGroupLabels,
    ]);

    if (!isValidContext) {
      return (
        <InvalidContextMessage
          widgetType={t('widget.review-context-fields.name')}
        />
      );
    }

    if (loading) {
      return (
        <div className="journalit-widget-loading">{t('common.loading')}</div>
      );
    }

    if (!service) {
      return (
        <div className="review-context-fields-empty">
          {t('widget.review-context-fields.service-unavailable')}
        </div>
      );
    }

    if (groupedFields.length === 0 && !hasInheritedContext) {
      return (
        <div className="review-context-fields-empty">
          <p>{t('widget.review-context-fields.empty-title')}</p>
          <p>{t('widget.review-context-fields.empty-desc')}</p>
          {!preview && (
            <Button variant="primary" onClick={openReviewFieldSettings}>
              {t('widget.review-context-fields.configure')}
            </Button>
          )}
        </div>
      );
    }

    return (
      <div className="review-context-fields">
        {groupedFields.length > 0 && (
          <section className="review-context-fields-inherited">
            <div className="review-context-fields-inherited-header">
              <div className="review-context-fields-inherited-title">
                {t('widget.review-context-fields.group.default')}
              </div>
              {!preview && showLocal && visibleEditableFields.length > 0 ? (
                <Button
                  variant="secondary"
                  size="small"
                  className="review-context-fields-edit-toggle"
                  onClick={() =>
                    setIsEditingLocalContext((current) => !current)
                  }
                >
                  {isEditingLocalContext ? t('button.done') : t('button.edit')}
                </Button>
              ) : null}
            </div>
            <div className="review-context-fields-local-groups">
              {groupedFields.map(({ group, fields: groupFields }) => (
                <div key={group} className="review-context-fields-local-group">
                  <div className="review-context-fields-local-group-title">
                    {group}
                  </div>
                  <InheritedContextFieldGroups
                    sources={inheritedSources}
                    fields={groupFields}
                    localValues={values}
                    editableFields={showLocal ? visibleEditableFields : []}
                    isEditing={isEditingLocalContext}
                    hideEmpty={hideEmpty}
                    service={service}
                    errors={errors}
                    onLocalChange={(field, value) =>
                      void handleChange(field, value)
                    }
                    onOpenSource={(source) =>
                      void handleOpenSourceReview(source)
                    }
                    localSourceLabel={
                      reviewType
                        ? getReviewTypeSourceLabel(reviewType)
                        : 'Local'
                    }
                    preview={preview}
                  />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    );
  });

ReviewContextFieldsWidget.displayName = 'ReviewContextFieldsWidget';

interface InheritedContextFieldGroupsProps {
  sources: ReviewContextSource[];
  fields: CustomReviewFieldDefinition[];
  localValues: Record<string, unknown>;
  editableFields: CustomReviewFieldDefinition[];
  isEditing: boolean;
  hideEmpty: boolean;
  service: JournalitPlugin['customReviewFieldsService'];
  errors: Record<string, string>;
  onLocalChange: (fieldId: string, value: unknown) => void;
  onOpenSource: (source: ReviewContextSource) => void;
  localSourceLabel: string;
  preview?: boolean;
}

const InheritedContextFieldGroups: React.FC<
  InheritedContextFieldGroupsProps
> = ({
  sources,
  fields,
  localValues,
  editableFields,
  isEditing,
  hideEmpty,
  service,
  errors,
  onLocalChange,
  onOpenSource,
  localSourceLabel,
  preview,
}) => {
  const editableFieldIds = new Set(editableFields.map((field) => field.id));
  const sourceStatuses: Array<{ source: ReviewContextSource; status: string }> =
    [];

  for (const source of sources) {
    const status = !source.exists
      ? t('widget.review-context-fields.source-missing')
      : !source.valid
        ? t('widget.review-context-fields.source-invalid')
        : source.fields.length === 0
          ? t('widget.review-context-fields.source-empty')
          : null;

    if (status) {
      sourceStatuses.push({ source, status });
      continue;
    }
  }

  return (
    <div className="review-context-fields-by-field">
      {fields.map((field) => {
        const inheritedEntries = sources.flatMap((source) => {
          if (!source.exists || !source.valid) return [];
          const inheritedField = source.fields.find(
            (sourceField) => sourceField.fieldId === field.id
          );
          if (!inheritedField) return [];
          return [
            {
              source,
              sourceLabel: getCompactSourceLabel(source),
              value: inheritedField.formattedValue || t('common.none'),
            },
          ];
        });
        const isEditable = editableFieldIds.has(field.id);
        const localValue = localValues[field.id] ?? getDefaultFieldValue(field);
        const localDisplayValue = formatReviewContextDisplayValue(localValue);
        const hasLocalDisplayValue = localDisplayValue !== t('common.none');

        if (inheritedEntries.length === 0 && !isEditable) return null;
        if (
          hideEmpty &&
          inheritedEntries.length === 0 &&
          isEditable &&
          !isEditing &&
          !hasLocalDisplayValue
        ) {
          return null;
        }

        return (
          <div key={field.id} className="review-context-fields-field-group">
            <div className="review-context-fields-inherited-label">
              {field.label}
            </div>
            <div className="review-context-fields-field-chain">
              {inheritedEntries.map(({ source, sourceLabel, value }) => (
                <div
                  key={`${field.id}:${source.type}:${source.path}`}
                  className="review-context-fields-field-entry"
                >
                  {!preview ? (
                    <button
                      type="button"
                      className="review-context-fields-source-link"
                      onClick={() => onOpenSource(source)}
                    >
                      {sourceLabel}
                    </button>
                  ) : (
                    <span className="review-context-fields-source-label">
                      {sourceLabel}
                    </span>
                  )}
                  <span className="review-context-fields-inherited-value">
                    {value}
                  </span>
                </div>
              ))}
              {isEditable ? (
                <div className="review-context-fields-field-entry review-context-fields-field-entry--local">
                  <span className="review-context-fields-source-label">
                    {localSourceLabel}
                  </span>
                  {isEditing ? (
                    <div className="review-context-fields-inline-control">
                      <ReviewContextFieldControl
                        field={field}
                        value={localValue}
                        error={errors[field.id]}
                        service={service}
                        onChange={(value) => onLocalChange(field.id, value)}
                      />
                    </div>
                  ) : (
                    <span className="review-context-fields-inherited-value review-context-fields-inherited-value--local">
                      {localDisplayValue}
                    </span>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        );
      })}

      {sourceStatuses.length > 0 ? (
        <div className="review-context-fields-source-statuses">
          {sourceStatuses.map(({ source, status }) => {
            const sourceLabel = getCompactSourceLabel(source);
            return (
              <div
                key={`${source.type}:${source.path}`}
                className="review-context-fields-source-status-row"
              >
                {!preview ? (
                  <button
                    type="button"
                    className="review-context-fields-source-link"
                    onClick={() => onOpenSource(source)}
                  >
                    {sourceLabel}
                  </button>
                ) : (
                  <span className="review-context-fields-source-label">
                    {sourceLabel}
                  </span>
                )}
                <span className="review-context-fields-source-status">
                  {status}
                </span>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

interface ReviewContextFieldControlProps {
  field: CustomReviewFieldDefinition;
  value: unknown;
  error?: string;
  service: JournalitPlugin['customReviewFieldsService'];
  onChange: (value: unknown) => void;
}

const ReviewContextFieldControl: React.FC<ReviewContextFieldControlProps> = ({
  field,
  value,
  error,
  service,
  onChange,
}) => {
  const options = useMemo(() => {
    const predefined = field.options ?? [];
    const saved = service?.getFieldOptions(field.id) ?? [];
    return Array.from(new Set([...predefined, ...saved]));
  }, [field.id, field.options, service]);

  const handleSaveOption = useCallback(
    async (option: string) => {
      if (!field.allowCreateOptions) return;
      await service?.addFieldOption(field.id, option);
    },
    [field.allowCreateOptions, field.id, service]
  );

  const commonProps = {
    label: field.label,
    value,
    onChange,
    placeholder: field.placeholder,
    helperText: field.description || field.helperText,
    error,
    required: field.validation?.required || false,
  };

  switch (field.type) {
    case CustomFieldType.TEXT:
      return (
        <Input
          {...commonProps}
          value={reviewContextValueToString(value)}
          multiline={field.display.compact !== true}
          rows={3}
        />
      );
    case CustomFieldType.NUMBER:
      return (
        <NumberInput
          {...commonProps}
          value={typeof value === 'number' ? value : undefined}
          allowDecimal={true}
          precision={2}
          min={field.validation?.min}
          max={field.validation?.max}
        />
      );
    case CustomFieldType.DROPDOWN:
      if (field.allowCreateOptions) {
        return (
          <ComboBox
            {...commonProps}
            value={reviewContextValueToString(value)}
            options={options}
            isMulti={false}
            allowCreate={true}
            onSaveOption={handleSaveOption}
          />
        );
      }
      return (
        <Select
          {...commonProps}
          value={reviewContextValueToString(value)}
          options={options.map((option) => ({ value: option, label: option }))}
        />
      );
    case CustomFieldType.MULTISELECT:
      return (
        <ComboBox
          {...commonProps}
          value={
            Array.isArray(value) ? value.map(reviewContextValueToString) : []
          }
          options={options}
          isMulti={true}
          allowCreate={field.allowCreateOptions || false}
          onSaveOption={field.allowCreateOptions ? handleSaveOption : undefined}
        />
      );
    case CustomFieldType.DATE:
      return (
        <FastDateTimeInput
          {...commonProps}
          value={reviewContextValueToString(value)}
          includeTime={false}
        />
      );
    case CustomFieldType.DATETIME:
      return (
        <FastDateTimeInput
          {...commonProps}
          value={reviewContextValueToString(value)}
          includeTime={true}
        />
      );
    case CustomFieldType.TIME:
      return (
        <FastDateTimeInput
          {...commonProps}
          value={reviewContextValueToString(value)}
          timeOnly={true}
        />
      );
    default:
      return (
        <div className="review-context-fields-error">
          {t('widget.review-context-fields.unsupported-type')}
        </div>
      );
  }
};
