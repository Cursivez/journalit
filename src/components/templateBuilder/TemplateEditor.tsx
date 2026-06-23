

import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { Notice } from 'obsidian';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { dndKitStyle } from '../../styles/inlineStylePolicy';
import { ChevronDown, Info } from '../shared/icons/ObsidianIcon';
import { Tooltip } from '../shared/Tooltip';
import type JournalitPlugin from '../../main';
import {
  DemonTrackerCountMode,
  DemonTrackerSourceMode,
  DemonTrackerWidgetConfig,
  ReviewContextFieldsSelectionMode,
  ReviewContextFieldsWidgetConfig,
  ReviewTemplate,
  ReviewTemplateType,
  WidgetPlacement,
} from '../../types/reviewV2';
import { SegmentedControl, SegmentOption } from '../shared/SegmentedControl';
import { MultiSelectDropdownFilter } from '../shared/MultiSelectDropdownFilter';
import { TemplatePreview } from './TemplatePreview';
import type { ReviewTemplateService } from '../../services/templates/ReviewTemplateService';
import { WidgetPicker } from './WidgetPicker';
import {
  getWidgetNameByPlacement,
  type WidgetDefinition,
} from '../../data/widgetRegistry';
import { t } from '../../lang/helpers';
import { generateUUID } from '../../utils/uuid';
import { resolveDemonTrackerModes } from '../reviewV2/widgets/shared/demonTrackerAggregation';
import {
  useGuideAction,
  useGuideBackHandler,
  useGuideTarget,
} from '../../guides/GuideRuntimeLayer';
import {
  LAYOUT_BUILDER_ADD_WIDGET_BUTTON_TARGET_ID,
  LAYOUT_BUILDER_EDITOR_MODE_BUTTON_TARGET_ID,
  LAYOUT_BUILDER_EDITOR_PANEL_TARGET_ID,
  LAYOUT_BUILDER_PREVIEW_TARGET_ID,
  LAYOUT_BUILDER_EDITOR_MODE_OPENED_ACTION_ID,
  LAYOUT_BUILDER_SAVE_BUTTON_TARGET_ID,
  LAYOUT_BUILDER_TEMPLATE_SAVED_ACTION_ID,
  LAYOUT_BUILDER_WIDGET_ADDED_ACTION_ID,
  LAYOUT_BUILDER_WIDGET_LIBRARY_DOCS_TARGET_ID,
} from '../../guides/layoutBuilderGuideIds';
import { openExternalUrl } from '../../utils/externalLinks';

interface TemplateEditorProps {
  plugin: JournalitPlugin;
  templateService: ReviewTemplateService;
  templateId: string;
  templateType: ReviewTemplateType;
  onTemplateChange?: () => void;
  onDirtyStateChange?: (isDirty: boolean) => void;
}

const parseReviewContextFieldsSelectionMode = (
  value: string
): ReviewContextFieldsSelectionMode => {
  switch (value) {
    case 'group':
    case 'fields':
      return value;
    default:
      return 'all';
  }
};

const parseDemonTrackerCountMode = (value: string): DemonTrackerCountMode =>
  value === 'per-trading-day' ? 'per-trading-day' : 'per-trade';

const parseDemonTrackerSourceMode = (value: string): DemonTrackerSourceMode => {
  switch (value) {
    case 'session':
    case 'combined':
      return value;
    default:
      return 'trades';
  }
};








interface SortableWidgetItemProps {
  id: string;
  index: number;
  widget: WidgetPlacement;
  plugin: JournalitPlugin;
  isEditing: boolean;
  templateType: ReviewTemplateType;
  availableMarkdownHeadings: string[];
  availableDrcMarkdownHeadings: string[];
  skipWeekends: boolean;
  scalperDefaults?: {
    countMode?: DemonTrackerCountMode;
    sourceMode?: DemonTrackerSourceMode;
  };
  onWidgetChange: (index: number, widget: WidgetDefinition) => void;
  onConfigChange: (index: number, config: Record<string, unknown>) => void;
  onDuplicate: (index: number) => void;
  onRemove: (index: number) => void;
}

const cloneWidgetPlacements = (
  widgets: WidgetPlacement[] | undefined
): WidgetPlacement[] =>
  widgets
    ? widgets.map((widget) => ({
        ...widget,
        config: widget.config ? { ...widget.config } : undefined,
      }))
    : [];

const parsePreviousContextHeadings = (
  config: { headings?: string; headingsJson?: string } | undefined
): string[] => {
  if (config?.headingsJson) {
    try {
      const parsed: unknown = JSON.parse(config.headingsJson);
      if (Array.isArray(parsed)) {
        return parsed.map((heading) =>
          typeof heading === 'string' ? heading.trim() : ''
        );
      }
    } catch {
      // intentional
    }
  }

  if (!config?.headings) return [];
  return config.headings.split(/[|\n]/).map((heading) => heading.trim());
};

const serializePreviousContextHeadings = (headings: string[]): string =>
  JSON.stringify(headings.map((heading) => heading.trim()));

const buildPreviousContextConfig = (
  config: Record<string, unknown> | undefined,
  headings: string[],
  fallbackMode: string
): Record<string, unknown> => {
  const rest = { ...(config ?? {}) };
  delete rest.headings;
  delete rest.headingsJson;
  return {
    ...rest,
    headingsJson: serializePreviousContextHeadings(headings),
    fallbackMode,
  };
};

function useSortableWidgetItemContent({
  id,
  index,
  widget,
  plugin,
  isEditing,
  templateType,
  availableMarkdownHeadings,
  availableDrcMarkdownHeadings,
  skipWeekends,
  scalperDefaults,
  onWidgetChange,
  onConfigChange,
  onDuplicate,
  onRemove,
}: SortableWidgetItemProps): React.ReactNode {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: !isEditing || widget.locked });

  
  const headerConfig = widget.config as
    | { level?: number; text?: string }
    | undefined;
  const headerLevel = headerConfig?.level ?? 2;
  const headerText = headerConfig?.text ?? '';
  const markdownZoneConfig = widget.config as { text?: string } | undefined;
  const markdownZoneText = markdownZoneConfig?.text ?? '';
  const previousContextConfig = widget.config as
    | { headings?: string; headingsJson?: string; fallbackMode?: string }
    | undefined;
  const previousContextHeadings = parsePreviousContextHeadings(
    previousContextConfig
  );
  const previousContextFallbackMode =
    previousContextConfig?.fallbackMode ?? 'nearest-earlier';
  const previousContextSectionRows =
    previousContextHeadings.length > 0 ? previousContextHeadings : [''];
  const previousContextDatalistId = `previous-context-heading-options-${id}`;
  const weeklyDrcDayOptions = skipWeekends
    ? ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
    : [
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
      ];

  const weeklyDrcConfig = widget.config as
    | {
        headings?: string;
        headingsJson?: string;
        dayScope?: string;
        defaultExpanded?: boolean;
      }
    | undefined;
  const weeklyDrcDayScope =
    skipWeekends &&
    (weeklyDrcConfig?.dayScope === 'saturday' ||
      weeklyDrcConfig?.dayScope === 'sunday')
      ? 'all'
      : (weeklyDrcConfig?.dayScope ?? 'all');
  const weeklyDrcHeadings = parsePreviousContextHeadings(weeklyDrcConfig);
  const weeklyDrcSectionRows =
    weeklyDrcHeadings.length > 0 ? weeklyDrcHeadings : [''];
  const weeklyDrcDatalistId = `weekly-drc-heading-options-${id}`;

  const buildWeeklyDrcConfig = (
    headings: string[],
    overrides: Record<string, unknown> = {}
  ): Record<string, unknown> => {
    const rest = { ...(widget.config ?? {}) };
    delete rest.headings;
    delete rest.headingsJson;
    return {
      ...rest,
      headingsJson: serializePreviousContextHeadings(headings),
      dayScope: weeklyDrcDayScope,
      defaultExpanded: weeklyDrcConfig?.defaultExpanded ?? true,
      ...overrides,
    };
  };

  const updatePreviousContextHeading = (
    headingIndex: number,
    value: string
  ) => {
    const nextHeadings = [...previousContextSectionRows];
    nextHeadings[headingIndex] = value;
    onConfigChange(
      index,
      buildPreviousContextConfig(
        widget.config,
        nextHeadings,
        previousContextFallbackMode
      )
    );
  };

  const removePreviousContextHeading = (headingIndex: number) => {
    const nextHeadings = previousContextSectionRows.filter(
      (_, currentIndex) => currentIndex !== headingIndex
    );
    onConfigChange(
      index,
      buildPreviousContextConfig(
        widget.config,
        nextHeadings,
        previousContextFallbackMode
      )
    );
  };

  const addPreviousContextHeading = () => {
    onConfigChange(
      index,
      buildPreviousContextConfig(
        widget.config,
        [...previousContextSectionRows, ''],
        previousContextFallbackMode
      )
    );
  };

  const updateWeeklyDrcHeading = (headingIndex: number, value: string) => {
    const nextHeadings = [...weeklyDrcSectionRows];
    nextHeadings[headingIndex] = value;
    onConfigChange(index, buildWeeklyDrcConfig(nextHeadings));
  };

  const removeWeeklyDrcHeading = (headingIndex: number) => {
    const nextHeadings = weeklyDrcSectionRows.filter(
      (_, currentIndex) => currentIndex !== headingIndex
    );
    onConfigChange(index, buildWeeklyDrcConfig(nextHeadings));
  };

  const addWeeklyDrcHeading = () => {
    onConfigChange(index, buildWeeklyDrcConfig([...weeklyDrcSectionRows, '']));
  };

  const demonConfig = widget.config as DemonTrackerWidgetConfig | undefined;
  const demonModes = resolveDemonTrackerModes(demonConfig, scalperDefaults);
  const reviewContextConfig = widget.config as
    | ReviewContextFieldsWidgetConfig
    | undefined;
  const reviewContextFields = useMemo(
    () =>
      (plugin.customReviewFieldsService?.getFields() ?? []).filter(
        (field) =>
          field.scope.reviewTypes.includes(templateType) ||
          field.scope.inheritTo.includes(templateType)
      ),
    [plugin.customReviewFieldsService, templateType]
  );
  const reviewContextGroupIdsWithFields = useMemo(
    () =>
      new Set(
        reviewContextFields.flatMap((field) =>
          field.groupId ? [field.groupId] : []
        )
      ),
    [reviewContextFields]
  );
  const reviewContextGroups = useMemo(
    () =>
      (plugin.customReviewFieldsService?.getGroups() ?? []).filter((group) =>
        reviewContextGroupIdsWithFields.has(group.id)
      ),
    [plugin.customReviewFieldsService, reviewContextGroupIdsWithFields]
  );
  const reviewContextSelectionMode =
    reviewContextConfig?.selectionMode ?? 'all';
  const reviewContextSelectedFieldIds = useMemo(
    () =>
      new Set(
        (reviewContextConfig?.fieldIds || '').split(',').flatMap((fieldId) => {
          const trimmed = fieldId.trim();
          return trimmed ? [trimmed] : [];
        })
      ),
    [reviewContextConfig?.fieldIds]
  );

  const reviewContextFieldsSummary = useMemo(() => {
    const selectedFields = reviewContextFields.filter((field) =>
      reviewContextSelectedFieldIds.has(field.id)
    );
    if (selectedFields.length === 0) {
      return t(
        'templateEditor.widget.review-context-fields.fields-placeholder'
      );
    }
    if (selectedFields.length === 1) return selectedFields[0].label;
    return t('templateEditor.widget.review-context-fields.fields-selected', {
      count: String(selectedFields.length),
    });
  }, [reviewContextFields, reviewContextSelectedFieldIds]);
  const updateReviewContextConfig = (
    updates: Partial<ReviewContextFieldsWidgetConfig>
  ) => {
    onConfigChange(index, {
      selectionMode: 'all',
      showInherited: true,
      showLocal: true,
      hideEmpty: false,
      ...widget.config,
      ...updates,
    });
  };
  type ReviewContextDisplayMode = 'both' | 'inherited' | 'current';
  const reviewContextDisplayMode: ReviewContextDisplayMode =
    (reviewContextConfig?.showInherited ?? true) &&
    (reviewContextConfig?.showLocal ?? true)
      ? 'both'
      : reviewContextConfig?.showInherited === false
        ? 'current'
        : 'inherited';
  const reviewContextDisplayOptions: SegmentOption<ReviewContextDisplayMode>[] =
    [
      {
        value: 'both',
        label: t('templateEditor.widget.review-context-fields.context.both'),
      },
      {
        value: 'inherited',
        label: t('templateEditor.widget.review-context-fields.inherited'),
      },
      {
        value: 'current',
        label: t('templateEditor.widget.review-context-fields.current'),
      },
    ];

  return (
    <div
      ref={setNodeRef}
      style={dndKitStyle(
        CSS.Translate.toString(transform),
        isDragging ? transition : undefined
      )}
      className={`template-section-card${isDragging ? ' is-dragging' : ''}`}
    >
      
      <div className="template-widget-row">
        
        {!widget.locked && (
          <div
            {...attributes}
            {...listeners}
            role="button"
            tabIndex={isEditing ? 0 : -1}
            className={`template-section-handle${isEditing ? ' is-editing' : ''}`}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="9" cy="6" r="2" />
              <circle cx="15" cy="6" r="2" />
              <circle cx="9" cy="12" r="2" />
              <circle cx="15" cy="12" r="2" />
              <circle cx="9" cy="18" r="2" />
              <circle cx="15" cy="18" r="2" />
            </svg>
          </div>
        )}
        
        {widget.locked && <div className="template-widget-handle-spacer" />}

        <div className="template-widget-info">
          {isEditing && !widget.locked ? (
            <WidgetPicker
              value={widget.type}
              valueConfig={widget.config}
              templateType={templateType}
              onChange={(w) => onWidgetChange(index, w)}
              placeholder={t('templateEditor.widget.select-placeholder')}
            />
          ) : (
            <div className="template-widget-info-row">
              <span className="template-widget-name">
                {getWidgetNameByPlacement(widget.type, widget.config)}
              </span>
              {widget.locked && (
                <span className="template-widget-badge">
                  {t('templateEditor.widget.locked')}
                </span>
              )}
            </div>
          )}
        </div>

        {isEditing && !widget.locked && (
          <div className="template-section-actions">
            <Tooltip content={t('builder.sidebar.duplicate')}>
              <button
                onClick={() => onDuplicate(index)}
                className="template-section-action template-section-duplicate"
                aria-label={t('builder.sidebar.duplicate')}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              </button>
            </Tooltip>
            <button
              onClick={() => onRemove(index)}
              className="template-section-action template-section-remove"
              aria-label={t('button.remove')}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18" />
                <path d="M8 6V4h8v2" />
                <path d="M19 6l-1 14H6L5 6" />
                <path d="M10 11v5" />
                <path d="M14 11v5" />
              </svg>
            </button>
          </div>
        )}
      </div>

      
      {widget.type === 'markdown-header' && isEditing && (
        <div className="template-widget-config-row">
          <select
            value={headerLevel}
            onChange={(e) =>
              onConfigChange(index, {
                ...widget.config,
                level: parseInt(e.target.value, 10),
                text: headerText,
              })
            }
            className="template-select"
          >
            <option value={1}>H1</option>
            <option value={2}>H2</option>
            <option value={3}>H3</option>
            <option value={4}>H4</option>
            <option value={5}>H5</option>
            <option value={6}>H6</option>
          </select>
          <input
            type="text"
            value={headerText}
            onChange={(e) =>
              onConfigChange(index, {
                ...widget.config,
                level: headerLevel,
                text: e.target.value,
              })
            }
            placeholder={t('templateEditor.widget.header-text-placeholder')}
            className="template-input template-input--compact template-widget-config-input"
          />
        </div>
      )}

      
      {widget.type === 'markdown-zone' && isEditing && (
        <div className="template-widget-config-row template-widget-config-row--markdown-zone">
          <textarea
            value={markdownZoneText}
            onChange={(e) =>
              onConfigChange(index, {
                ...widget.config,
                text: e.target.value,
              })
            }
            aria-label={t('templateEditor.widget.markdown-zone-text-label')}
            placeholder={t(
              'templateEditor.widget.markdown-zone-text-placeholder'
            )}
            className="template-input template-widget-config-textarea"
            rows={3}
          />
        </div>
      )}

      {widget.type === 'review-context-fields' && isEditing && (
        <div className="template-review-context-config">
          <div className="template-review-context-config-row">
            <div className="template-review-context-config-label">
              {t('templateEditor.widget.review-context-fields.selection')}
            </div>
            <div className="template-review-context-config-control">
              <select
                value={reviewContextSelectionMode}
                onChange={(event) =>
                  updateReviewContextConfig({
                    selectionMode: parseReviewContextFieldsSelectionMode(
                      event.target.value
                    ),
                    groupId: undefined,
                    fieldIds: undefined,
                  })
                }
                className="template-select template-select--compact"
              >
                <option value="all">
                  {t(
                    'templateEditor.widget.review-context-fields.selection.all'
                  )}
                </option>
                <option value="group">
                  {t(
                    'templateEditor.widget.review-context-fields.selection.group'
                  )}
                </option>
                <option value="fields">
                  {t(
                    'templateEditor.widget.review-context-fields.selection.fields'
                  )}
                </option>
              </select>
            </div>
          </div>

          {reviewContextSelectionMode === 'group' && (
            <div className="template-review-context-config-row">
              <div className="template-review-context-config-label">
                {t('templateEditor.widget.review-context-fields.group')}
              </div>
              <div className="template-review-context-config-control">
                <select
                  value={reviewContextConfig?.groupId || ''}
                  onChange={(event) =>
                    updateReviewContextConfig({ groupId: event.target.value })
                  }
                  className="template-select template-select--compact"
                >
                  <option value="">
                    {t(
                      'templateEditor.widget.review-context-fields.group-placeholder'
                    )}
                  </option>
                  {reviewContextGroups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {reviewContextSelectionMode === 'fields' && (
            <div className="template-review-context-config-row template-review-context-config-row--fields">
              <div className="template-review-context-config-label">
                {t('templateEditor.widget.review-context-fields.fields')}
              </div>
              <div className="template-review-context-config-control template-review-context-field-list">
                {reviewContextFields.length === 0 ? (
                  <div className="template-widget-config-help">
                    {t('templateEditor.widget.review-context-fields.no-fields')}
                  </div>
                ) : (
                  <MultiSelectDropdownFilter
                    options={reviewContextFields.map((field) => ({
                      value: field.id,
                      label: field.label,
                    }))}
                    selectedValues={Array.from(reviewContextSelectedFieldIds)}
                    summary={reviewContextFieldsSummary}
                    emptyMessage={t(
                      'templateEditor.widget.review-context-fields.no-fields'
                    )}
                    classNamePrefix="template-review-context-field-filter"
                    onChange={(fieldIds) =>
                      updateReviewContextConfig({
                        fieldIds: fieldIds.join(','),
                      })
                    }
                  />
                )}
              </div>
            </div>
          )}

          <div className="template-review-context-config-row">
            <div className="template-review-context-config-label">
              {t('templateEditor.widget.review-context-fields.context')}
            </div>
            <div className="template-review-context-config-control template-review-context-pills">
              <SegmentedControl
                options={reviewContextDisplayOptions}
                value={reviewContextDisplayMode}
                size="small"
                onChange={(value) =>
                  updateReviewContextConfig({
                    showInherited: value === 'both' || value === 'inherited',
                    showLocal: value === 'both' || value === 'current',
                  })
                }
              />
            </div>
          </div>

          <div className="template-review-context-config-row">
            <div className="template-review-context-config-label">
              {t('templateEditor.widget.review-context-fields.empty-values')}
            </div>
            <div className="template-review-context-config-control">
              <label className="template-review-context-toggle-row">
                <input
                  type="checkbox"
                  checked={reviewContextConfig?.hideEmpty ?? false}
                  onChange={(event) =>
                    updateReviewContextConfig({
                      hideEmpty: event.target.checked,
                    })
                  }
                />
                {t('templateEditor.widget.review-context-fields.hide-empty')}
              </label>
            </div>
          </div>
        </div>
      )}

      
      {widget.type === 'previous-trading-day-context' && isEditing && (
        <div className="template-widget-config-row--previous-context">
          <datalist id={previousContextDatalistId}>
            {availableMarkdownHeadings.map((heading) => (
              <option key={heading} value={heading} />
            ))}
          </datalist>

          <div className="template-previous-context-controls">
            <button
              type="button"
              className="template-previous-context-add-button"
              onClick={addPreviousContextHeading}
            >
              {t('templateEditor.widget.previous-context-add-section')}
            </button>

            <select
              value={previousContextFallbackMode}
              onChange={(e) =>
                onConfigChange(
                  index,
                  buildPreviousContextConfig(
                    widget.config,
                    previousContextHeadings,
                    e.target.value
                  )
                )
              }
              className="template-select template-select--compact template-previous-context-fallback-select"
              aria-label={t(
                'templateEditor.widget.previous-context-fallback-label'
              )}
            >
              <option value="nearest-earlier">
                {t('templateEditor.widget.previous-context-fallback-nearest')}
              </option>
              <option value="expected-only">
                {t('templateEditor.widget.previous-context-fallback-expected')}
              </option>
            </select>
          </div>

          <div className="template-previous-context-sections">
            <div className="template-widget-config-label">
              {t('templateEditor.widget.previous-context-sections-label')}
            </div>
            {previousContextSectionRows.map((heading, headingIndex) => (
              <div
                key={`previous-context-heading-${headingIndex}`}
                className="template-previous-context-section-row"
              >
                <div className="template-previous-context-select-wrapper">
                  <select
                    value={heading}
                    onChange={(e) =>
                      updatePreviousContextHeading(headingIndex, e.target.value)
                    }
                    aria-label={t(
                      'templateEditor.widget.previous-context-heading-label'
                    )}
                    className="template-select template-select--compact template-previous-context-heading-input"
                  >
                    <option value="">
                      {t(
                        'templateEditor.widget.previous-context-heading-placeholder'
                      )}
                    </option>
                    {availableMarkdownHeadings.map((availableHeading) => (
                      <option key={availableHeading} value={availableHeading}>
                        {availableHeading}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="widget-picker-icon template-previous-context-select-icon"
                    aria-hidden="true"
                  />
                </div>
                <button
                  type="button"
                  className="template-previous-context-remove"
                  onClick={() => removePreviousContextHeading(headingIndex)}
                  aria-label={t('button.remove')}
                >
                  {t('button.remove')}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      
      {widget.type === 'weekly-drc-context' && isEditing && (
        <div className="template-widget-config-row--previous-context template-weekly-drc-config">
          <datalist id={weeklyDrcDatalistId}>
            {availableDrcMarkdownHeadings.map((heading) => (
              <option key={heading} value={heading} />
            ))}
          </datalist>

          <div className="template-weekly-drc-options">
            <label className="template-weekly-drc-field">
              <span className="template-widget-config-label">
                {t('templateEditor.widget.weekly-drc-day-label')}
              </span>
              <select
                value={weeklyDrcDayScope}
                onChange={(e) =>
                  onConfigChange(
                    index,
                    buildWeeklyDrcConfig(weeklyDrcHeadings, {
                      dayScope: e.target.value,
                    })
                  )
                }
                className="template-select template-select--compact"
              >
                <option value="all">
                  {t('templateEditor.widget.weekly-drc-day-all')}
                </option>
                {weeklyDrcDayOptions.map((day) => (
                  <option key={day} value={day}>
                    {day.charAt(0).toUpperCase() + day.slice(1)}
                  </option>
                ))}
              </select>
            </label>

            <label className="template-weekly-drc-collapse-toggle">
              <input
                type="checkbox"
                checked={!(weeklyDrcConfig?.defaultExpanded ?? true)}
                onChange={(e) =>
                  onConfigChange(
                    index,
                    buildWeeklyDrcConfig(weeklyDrcHeadings, {
                      defaultExpanded: !e.target.checked,
                    })
                  )
                }
              />
              {t('templateEditor.widget.weekly-drc-start-collapsed')}
            </label>
          </div>

          <div className="template-previous-context-sections">
            <div className="template-weekly-drc-sections-header">
              <div className="template-weekly-drc-sections-title">
                {t('templateEditor.widget.previous-context-sections-label')}
              </div>
              <button
                type="button"
                className="template-previous-context-add-button"
                onClick={addWeeklyDrcHeading}
              >
                {t('templateEditor.widget.previous-context-add-section')}
              </button>
            </div>
            {weeklyDrcSectionRows.map((heading, headingIndex) => (
              <div
                key={`weekly-drc-heading-${headingIndex}`}
                className="template-previous-context-section-row"
              >
                <div className="template-previous-context-select-wrapper">
                  <select
                    value={heading}
                    onChange={(e) =>
                      updateWeeklyDrcHeading(headingIndex, e.target.value)
                    }
                    className="template-select template-select--compact template-previous-context-heading-input"
                  >
                    <option value="">
                      {t(
                        'templateEditor.widget.previous-context-heading-placeholder'
                      )}
                    </option>
                    {availableDrcMarkdownHeadings.map((availableHeading) => (
                      <option key={availableHeading} value={availableHeading}>
                        {availableHeading}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="widget-picker-icon template-previous-context-select-icon"
                    aria-hidden="true"
                  />
                </div>
                <button
                  type="button"
                  className="template-previous-context-remove template-previous-context-remove--icon"
                  onClick={() => removeWeeklyDrcHeading(headingIndex)}
                  aria-label={t('button.remove')}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      
      {(widget.type === 'technical-game' || widget.type === 'mental-game') &&
        isEditing &&
        (() => {
          const gameConfig = widget.config as
            | { pageSize?: number; showRating?: boolean }
            | undefined;
          const pageSize = gameConfig?.pageSize ?? 5;
          const showRating = gameConfig?.showRating ?? true;
          return (
            <div className="template-widget-config-row template-widget-config-row--wide">
              <label className="template-widget-config-label">
                {t('templateEditor.widget.page-size')}
                <select
                  value={pageSize}
                  onChange={(e) =>
                    onConfigChange(index, {
                      ...widget.config,
                      pageSize: parseInt(e.target.value, 10),
                      showRating,
                    })
                  }
                  className="template-select template-select--compact"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={20}>20</option>
                </select>
              </label>
              <label className="template-widget-config-label template-widget-config-label--clickable">
                <input
                  type="checkbox"
                  checked={showRating}
                  onChange={(e) =>
                    onConfigChange(index, {
                      ...widget.config,
                      pageSize,
                      showRating: e.target.checked,
                    })
                  }
                  className="template-widget-config-checkbox"
                />
                {t('templateEditor.widget.show-rating-column')}
              </label>
            </div>
          );
        })()}

      
      {widget.type === 'demon-tracker' && isEditing && (
        <div className="template-widget-config-row template-widget-config-row--wide">
          <label className="template-widget-config-label">
            {t('templateEditor.widget.demon-tracker.count-mode')}
            <select
              value={demonModes.countMode}
              onChange={(e) =>
                onConfigChange(index, {
                  ...widget.config,
                  countMode: parseDemonTrackerCountMode(e.target.value),
                })
              }
              className="template-select template-select--compact"
            >
              <option value="per-trade">
                {t('templateEditor.widget.demon-tracker.count-mode.per-trade')}
              </option>
              <option value="per-trading-day">
                {t(
                  'templateEditor.widget.demon-tracker.count-mode.per-trading-day'
                )}
              </option>
            </select>
          </label>

          <label className="template-widget-config-label">
            {t('templateEditor.widget.demon-tracker.source-mode')}
            <select
              value={demonModes.sourceMode}
              onChange={(e) =>
                onConfigChange(index, {
                  ...widget.config,
                  sourceMode: parseDemonTrackerSourceMode(e.target.value),
                })
              }
              className="template-select template-select--compact"
            >
              <option value="trades">
                {t('templateEditor.widget.demon-tracker.source-mode.trades')}
              </option>
              <option value="session">
                {t('templateEditor.widget.demon-tracker.source-mode.session')}
              </option>
              <option value="combined">
                {t('templateEditor.widget.demon-tracker.source-mode.combined')}
              </option>
            </select>
          </label>
        </div>
      )}
    </div>
  );
}

const SortableWidgetItem: React.FC<SortableWidgetItemProps> = (props) =>
  useSortableWidgetItemContent(props);

type ViewMode = 'editor' | 'preview';

const getViewModeOptions = (): SegmentOption<ViewMode>[] => [
  { value: 'preview', label: t('templateEditor.mode.preview') },
  { value: 'editor', label: t('templateEditor.mode.editor') },
];

function useTemplateEditorModel({
  plugin,
  templateService,
  templateId,
  templateType,
  onTemplateChange,
  onDirtyStateChange,
}: TemplateEditorProps) {
  
  const [template, setTemplate] = useState<ReviewTemplate | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('preview');
  const [editingName, setEditingName] = useState('');
  const [editingWidgets, setEditingWidgets] = useState<WidgetPlacement[]>([]);
  const widgetEditorIdsRef = useRef<WeakMap<WidgetPlacement, string>>(
    new WeakMap()
  );
  const guideAddedWidgetIndexRef = useRef<number | null>(null);
  const emitGuideAction = useGuideAction();
  const registerEditorModeButtonTarget = useGuideTarget(
    LAYOUT_BUILDER_EDITOR_MODE_BUTTON_TARGET_ID
  );
  const registerEditorPanelTarget = useGuideTarget(
    LAYOUT_BUILDER_EDITOR_PANEL_TARGET_ID
  );
  const registerAddWidgetButtonTarget = useGuideTarget(
    LAYOUT_BUILDER_ADD_WIDGET_BUTTON_TARGET_ID
  );
  const registerPreviewTarget = useGuideTarget(
    LAYOUT_BUILDER_PREVIEW_TARGET_ID
  );
  const registerWidgetLibraryDocsTarget = useGuideTarget(
    LAYOUT_BUILDER_WIDGET_LIBRARY_DOCS_TARGET_ID
  );
  const registerSaveButtonTarget = useGuideTarget(
    LAYOUT_BUILDER_SAVE_BUTTON_TARGET_ID
  );

  
  const loadTemplate = useCallback(() => {
    const templates = templateService.getTemplates(templateType);
    const found = templates.find((t) => t.id === templateId);
    if (found) {
      setTemplate(found);
      setEditingName(found.name);
      setEditingWidgets(cloneWidgetPlacements(found.widgets));
    }
  }, [templateService, templateId, templateType]);

  useEffect(() => {
    loadTemplate();
  }, [loadTemplate, templateId]);

  
  const hasChanges = useMemo(() => {
    if (!template) return false;
    const templateWidgets = template.widgets || [];
    if (editingName !== template.name) return true;
    if (editingWidgets.length !== templateWidgets.length) return true;
    return editingWidgets.some((widget, i) => {
      const original = templateWidgets[i];
      if (!original) return true;
      return (
        widget.type !== original.type ||
        widget.id !== original.id ||
        widget.locked !== original.locked ||
        JSON.stringify(widget.config) !== JSON.stringify(original.config)
      );
    });
  }, [template, editingName, editingWidgets]);

  const availableMarkdownHeadings = useMemo(
    () =>
      editingWidgets.flatMap((widget) => {
        if (widget.type !== 'markdown-header') {
          return [];
        }

        const config = widget.config as { text?: string } | undefined;
        const heading = config?.text?.trim() ?? '';
        return heading ? [heading] : [];
      }),
    [editingWidgets]
  );

  const availableDrcMarkdownHeadings = useMemo(() => {
    if (templateType === 'drc') return availableMarkdownHeadings;

    const drcTemplate = templateService.getDefaultTemplate('drc');
    return drcTemplate.widgets.flatMap((widget) => {
      if (widget.type !== 'markdown-header') return [];
      const config = widget.config as { text?: string } | undefined;
      const trimmed = config?.text?.trim();
      return trimmed ? [trimmed] : [];
    });
  }, [availableMarkdownHeadings, templateService, templateType]);

  
  useEffect(() => {
    onDirtyStateChange?.(hasChanges);
  }, [hasChanges, onDirtyStateChange]);

  
  const canEdit = viewMode === 'editor' && template && !template.isBuiltIn;
  const scalperDefaults = plugin.settings.reviewV2?.scalperDefaults;
  const getWidgetEditorId = useCallback((widget: WidgetPlacement): string => {
    const existingId = widgetEditorIdsRef.current.get(widget);
    if (existingId) {
      return existingId;
    }

    const nextId = `widget-${generateUUID()}`;
    widgetEditorIdsRef.current.set(widget, nextId);
    return nextId;
  }, []);

  
  const handleSave = useCallback(async () => {
    if (!template) return;

    try {
      await templateService.updateTemplate(templateId, {
        name: editingName,
        widgets: editingWidgets,
      });
      loadTemplate();
      onTemplateChange?.();
      emitGuideAction(LAYOUT_BUILDER_TEMPLATE_SAVED_ACTION_ID);
      new Notice(t('notice.template-saved'));
    } catch (error) {
      console.error('Failed to save template:', error);
      new Notice(
        error instanceof Error
          ? error.message
          : t('notice.error.template-save-failed')
      );
    }
  }, [
    templateService,
    templateId,
    editingName,
    editingWidgets,
    emitGuideAction,
    loadTemplate,
    onTemplateChange,
    template,
  ]);

  
  const handleDiscard = useCallback(() => {
    if (template) {
      setEditingName(template.name);
      setEditingWidgets(cloneWidgetPlacements(template.widgets));
    }
  }, [template]);

  
  const handleAddWidget = useCallback(() => {
    setEditingWidgets((currentWidgets) => {
      guideAddedWidgetIndexRef.current = currentWidgets.length;
      return [...currentWidgets, { type: '' }];
    });
    emitGuideAction(LAYOUT_BUILDER_WIDGET_ADDED_ACTION_ID);
  }, [emitGuideAction]);

  const handleRemoveWidget = useCallback(
    (index: number) => {
      if (editingWidgets[index].locked) {
        new Notice(t('notice.info.cannot-remove-locked'));
        return;
      }
      const newWidgets = [...editingWidgets];
      newWidgets.splice(index, 1);
      setEditingWidgets(newWidgets);
    },
    [editingWidgets]
  );

  const handleDuplicateWidget = useCallback(
    (index: number) => {
      const sourceWidget = editingWidgets[index];
      if (!sourceWidget || sourceWidget.locked) {
        new Notice(t('notice.error.duplicate-to-customize'));
        return;
      }

      const duplicatedWidget: WidgetPlacement = {
        ...sourceWidget,
        config: sourceWidget.config ? { ...sourceWidget.config } : undefined,
      };
      if (duplicatedWidget.id) {
        duplicatedWidget.id = `${duplicatedWidget.type}-${generateUUID()}`;
      }

      const newWidgets = [...editingWidgets];
      newWidgets.splice(index + 1, 0, duplicatedWidget);
      setEditingWidgets(newWidgets);
    },
    [editingWidgets]
  );

  const handleWidgetChange = useCallback(
    (index: number, widgetDef: WidgetDefinition) => {
      const newWidgets = [...editingWidgets];
      
      
      
      const mergedConfig = widgetDef.defaultConfig
        ? { ...newWidgets[index].config, ...widgetDef.defaultConfig }
        : newWidgets[index].config;
      const nextWidget: WidgetPlacement = {
        ...newWidgets[index],
        type: widgetDef.type,
        config: mergedConfig,
      };

      if (widgetDef.type === 'images' && !nextWidget.id) {
        nextWidget.id = `images-${generateUUID()}`;
      }

      widgetEditorIdsRef.current.set(
        nextWidget,
        getWidgetEditorId(newWidgets[index])
      );
      newWidgets[index] = nextWidget;
      setEditingWidgets(newWidgets);
    },
    [editingWidgets, getWidgetEditorId]
  );

  const handleWidgetConfigChange = useCallback(
    (index: number, config: Record<string, unknown>) => {
      const newWidgets = [...editingWidgets];
      const nextWidget = { ...newWidgets[index], config };
      widgetEditorIdsRef.current.set(
        nextWidget,
        getWidgetEditorId(newWidgets[index])
      );
      newWidgets[index] = nextWidget;
      setEditingWidgets(newWidgets);
    },
    [editingWidgets, getWidgetEditorId]
  );

  
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      setEditingWidgets((prevWidgets) => {
        const oldIndex = prevWidgets.findIndex(
          (widget) => getWidgetEditorId(widget) === active.id
        );
        let newIndex = prevWidgets.findIndex(
          (widget) => getWidgetEditorId(widget) === over.id
        );

        if (oldIndex === -1 || newIndex === -1) return prevWidgets;

        
        
        const firstUnlockedIndex = prevWidgets.findIndex((w) => !w.locked);
        if (firstUnlockedIndex > 0 && newIndex < firstUnlockedIndex) {
          newIndex = firstUnlockedIndex;
        }

        
        if (newIndex === oldIndex) return prevWidgets;

        const newWidgets = [...prevWidgets];
        const [movedItem] = newWidgets.splice(oldIndex, 1);
        newWidgets.splice(newIndex, 0, movedItem);

        return newWidgets;
      });
    },
    [getWidgetEditorId]
  );

  const handleGuideBack = useCallback(
    ({ toStepId }: { toStepId: string }) => {
      if (
        toStepId === 'intro' ||
        toStepId === 'sidebar-overview' ||
        toStepId === 'pick-built-in-template' ||
        toStepId === 'duplicate-template' ||
        toStepId === 'preview-template'
      ) {
        setViewMode('preview');
        return;
      }

      if (
        toStepId === 'switch-to-editor' ||
        toStepId === 'editor-overview' ||
        toStepId === 'add-widget' ||
        toStepId === 'open-widget-picker' ||
        toStepId === 'choose-widget' ||
        toStepId === 'widget-library-docs' ||
        toStepId === 'save-template' ||
        toStepId === 'set-default-template'
      ) {
        setViewMode('editor');
      }

      const guideAddedWidgetIndex = guideAddedWidgetIndexRef.current;

      if (toStepId === 'add-widget' && guideAddedWidgetIndex !== null) {
        setEditingWidgets((currentWidgets) =>
          currentWidgets.filter((_, index) => index !== guideAddedWidgetIndex)
        );
        guideAddedWidgetIndexRef.current = null;
        return;
      }

      if (toStepId === 'choose-widget' && guideAddedWidgetIndex !== null) {
        setEditingWidgets((currentWidgets) =>
          currentWidgets.map((widget, index) =>
            index === guideAddedWidgetIndex ? { ...widget, type: '' } : widget
          )
        );
        return;
      }

      if (toStepId === 'save-template' && !hasChanges) {
        return { toStepId: 'widget-library-docs' };
      }
    },
    [hasChanges]
  );

  useGuideBackHandler(handleGuideBack);

  const handleViewModeChange = useCallback(
    (nextViewMode: ViewMode) => {
      setViewMode(nextViewMode);
      if (nextViewMode === 'editor') {
        emitGuideAction(LAYOUT_BUILDER_EDITOR_MODE_OPENED_ACTION_ID);
      }
    },
    [emitGuideAction]
  );

  const handleOpenWidgetLibraryDocs = useCallback(() => {
    openExternalUrl('https://journalit.co/docs/layout-builder#widget-library');
  }, []);

  const previewTemplate: ReviewTemplate | null = template
    ? hasChanges
      ? { ...template, name: editingName, widgets: editingWidgets }
      : template
    : null;

  return {
    plugin,
    templateType,
    template,
    viewMode,
    editingName,
    setEditingName,
    editingWidgets,
    hasChanges,
    availableMarkdownHeadings,
    availableDrcMarkdownHeadings,
    canEdit,
    scalperDefaults,
    getWidgetEditorId,
    previewTemplate,
    handleSave,
    handleDiscard,
    handleAddWidget,
    handleRemoveWidget,
    handleDuplicateWidget,
    handleWidgetChange,
    handleWidgetConfigChange,
    handleDragEnd,
    handleViewModeChange,
    handleOpenWidgetLibraryDocs,
    registerEditorModeButtonTarget,
    registerEditorPanelTarget,
    registerAddWidgetButtonTarget,
    registerPreviewTarget,
    registerWidgetLibraryDocsTarget,
    registerSaveButtonTarget,
  };
}

export const TemplateEditor: React.FC<TemplateEditorProps> = (props) => {
  const {
    plugin,
    templateType,
    template,
    viewMode,
    editingName,
    setEditingName,
    editingWidgets,
    hasChanges,
    availableMarkdownHeadings,
    availableDrcMarkdownHeadings,
    canEdit,
    scalperDefaults,
    getWidgetEditorId,
    previewTemplate,
    handleSave,
    handleDiscard,
    handleAddWidget,
    handleRemoveWidget,
    handleDuplicateWidget,
    handleWidgetChange,
    handleWidgetConfigChange,
    handleDragEnd,
    handleViewModeChange,
    handleOpenWidgetLibraryDocs,
    registerEditorModeButtonTarget,
    registerEditorPanelTarget,
    registerAddWidgetButtonTarget,
    registerPreviewTarget,
    registerWidgetLibraryDocsTarget,
    registerSaveButtonTarget,
  } = useTemplateEditorModel(props);

  if (!template || !previewTemplate) {
    return (
      <div className="template-editor-loading">
        {t('templateEditor.loading')}
      </div>
    );
  }

  return (
    <div className="template-editor-root">
      
      <div className="template-editor-topbar">
        <div className="template-editor-topbar-group">
          <SegmentedControl
            options={getViewModeOptions()}
            value={viewMode}
            onChange={(v) => handleViewModeChange(v)}
            size="small"
            getOptionRef={(value) =>
              value === 'editor' ? registerEditorModeButtonTarget : undefined
            }
          />
          <div className="template-editor-title-group">
            <span className="template-editor-title-name">
              {hasChanges ? editingName : template.name}
            </span>
            <span className="template-editor-badge template-editor-badge--type">
              {templateType}
            </span>
            {template.isBuiltIn && (
              <span className="template-editor-builtin-label">
                {t('templateEditor.built-in-badge')}
              </span>
            )}
          </div>
        </div>
      </div>

      
      <div className="template-editor-canvas template-editor-canvas-container">
        {viewMode === 'preview' ? (
          <TemplatePreview
            template={previewTemplate}
            plugin={plugin}
            containerRef={registerPreviewTarget}
          />
        ) : (
          <div
            className="template-editor-content"
            ref={registerEditorPanelTarget}
          >
            
            {template?.isBuiltIn && (
              <div className="template-editor-notice template-editor-notice--warning template-editor-notice--spaced">
                <Info size={16} className="template-editor-notice__icon" />
                <span>{t('templateEditor.built-in-notice')}</span>
              </div>
            )}

            
            {hasChanges && canEdit && (
              <div className="template-unsaved-banner">
                <span className="template-unsaved-banner__text">
                  {t('templateEditor.unsaved-changes')}
                </span>
                <div className="template-unsaved-banner__actions">
                  <button
                    onClick={() => void handleDiscard()}
                    className="template-action-button template-action-button--neutral template-action-button--compact"
                  >
                    {t('button.discard')}
                  </button>
                  <button
                    ref={registerSaveButtonTarget}
                    onClick={() => void handleSave()}
                    className="template-action-button template-action-button--primary template-action-button--compact"
                  >
                    {t('button.save')}
                  </button>
                </div>
              </div>
            )}

            
            <div className="template-editor-field">
              <label className="template-editor-field-label">
                {t('templateEditor.field.template-name')}
              </label>
              <input
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && canEdit && hasChanges) {
                    e.preventDefault();
                    void handleSave();
                  }
                }}
                disabled={!canEdit}
                className="template-form-input"
              />
            </div>

            
            <div>
              <div className="template-editor-widget-header">
                <label className="template-editor-widget-label">
                  {t('templateEditor.field.widgets', {
                    count: String(editingWidgets.length),
                  })}
                </label>
                {canEdit && (
                  <div className="template-editor-widget-actions">
                    <button
                      ref={registerWidgetLibraryDocsTarget}
                      onClick={() => void handleOpenWidgetLibraryDocs()}
                      className="template-action-button template-action-button--neutral template-action-button--compact"
                    >
                      {t('templateEditor.button.widget-library-docs')}
                    </button>
                    <button
                      ref={registerAddWidgetButtonTarget}
                      onClick={() => void handleAddWidget()}
                      className="template-action-button template-action-button--secondary template-action-button--compact"
                    >
                      {t('templateEditor.button.add-widget')}
                    </button>
                  </div>
                )}
              </div>

              <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={editingWidgets.map(getWidgetEditorId)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="template-editor-widget-list">
                    {editingWidgets.map((widget, index) => (
                      <SortableWidgetItem
                        key={getWidgetEditorId(widget)}
                        id={getWidgetEditorId(widget)}
                        index={index}
                        widget={widget}
                        plugin={plugin}
                        isEditing={!!canEdit}
                        templateType={templateType}
                        availableMarkdownHeadings={availableMarkdownHeadings}
                        availableDrcMarkdownHeadings={
                          availableDrcMarkdownHeadings
                        }
                        skipWeekends={
                          plugin.settings.trade.skipWeekends ?? true
                        }
                        scalperDefaults={scalperDefaults}
                        onWidgetChange={handleWidgetChange}
                        onConfigChange={handleWidgetConfigChange}
                        onDuplicate={handleDuplicateWidget}
                        onRemove={handleRemoveWidget}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
