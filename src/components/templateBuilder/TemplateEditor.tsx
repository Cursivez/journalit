

import React, {
  useState,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react';
import { useEventBus } from '../../hooks/useEventBus';
import { resolveDefaultTradeTemplate } from '../../services/templates/defaultTradeTemplateMetadata';
import { Notice } from 'obsidian';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { dndKitStyle } from '../../styles/inlineStylePolicy';
import { Info } from '../shared/icons/ObsidianIcon';
import { Tooltip } from '../shared/Tooltip';
import type JournalitPlugin from '../../main';
import {
  DEMON_TRACKER_TRACKING_METHODS,
  DEMON_TRACKER_STOP_THRESHOLDS,
  DemonTrackerTrackingMethod,
  DemonTrackerWidgetConfig,
  isDemonTrackerStopThreshold,
  isDemonTrackerTrackingMethod,
  ReviewContextFieldsSelectionMode,
  ReviewContextFieldsWidgetConfig,
  ReviewTemplate,
  ReviewTemplateType,
  WidgetPlacement,
} from '../../types/reviewV2';
import { SegmentedControl, SegmentOption } from '../shared/SegmentedControl';
import { ComboBox } from '../core/ComboBox';
import { TemplatePreview } from './TemplatePreview';
import type { ReviewTemplateService } from '../../services/templates/ReviewTemplateService';
import { WidgetPicker } from './WidgetPicker';
import { WidgetOptionControls } from './WidgetOptionControls';
import { MarketBiasConfigEditor } from './MarketBiasConfigEditor';
import {
  DEFAULT_ROLLING_BIAS_REVIEW_PERIOD,
  toRollingBiasWidgetConfig,
} from '../reviewV2/widgets/RollingBiasWinRateWidget';
import {
  ROLLING_BIAS_PERIODS,
  parseRollingBiasPeriod,
} from '../../services/marketBias/rollingBiasWinRate';
import { FloatingUnsavedChangesBanner } from './FloatingUnsavedChangesBanner';
import {
  getWidgetNameByPlacement,
  type WidgetDefinition,
} from '../../data/widgetRegistry';
import { t } from '../../lang/helpers';
import { generateUUID } from '../../utils/uuid';
import { resolveDemonTrackerOptions } from '../reviewV2/widgets/shared/demonTrackerAggregation';

import {
  useGuideAction,
  useGuideCurrentStepId,
  useGuideBackHandler,
  useGuideTarget,
  useVisibleGuideStepId,
} from '../../guides/GuideRuntimeLayer';
import {
  LAYOUT_BUILDER_ADD_WIDGET_BUTTON_TARGET_ID,
  LAYOUT_BUILDER_EDITOR_PANEL_TARGET_ID,
  LAYOUT_BUILDER_INSERT_SLOT_TARGET_ID,
  LAYOUT_BUILDER_SAVE_BUTTON_TARGET_ID,
  LAYOUT_BUILDER_WHATS_NEW_INSERT_SLOT_STEP_ID,
  LAYOUT_BUILDER_TEMPLATE_SAVED_ACTION_ID,
  LAYOUT_BUILDER_WIDGET_ADDED_ACTION_ID,
} from '../../guides/layoutBuilderGuideIds';
import { openExternalUrl } from '../../utils/externalLinks';
import { TradeReviewQuestionEditor } from './TradeReviewQuestionEditor';
import {
  KeyLevelsConfigEditor,
  useKeyLevelsParentGroups,
  type KeyLevelsParentGroups,
} from './KeyLevelsConfigEditor';
import { TradeReviewFieldLayoutEditor } from './TradeReviewFieldLayoutEditor';
import type {
  TradeReviewFieldLayout,
  TradeReviewQuestionConfig,
  TradeReviewQuestionConfigKey,
  TradeReviewWidgetConfig,
} from '../reviewV2/widgets/tradeReviewConfig';
import {
  isValidTradeReviewQuestionGraph,
  resolveTradeReviewFieldLayout,
  TRADE_REVIEW_FIELD_PLACEMENT_CONFIG_KEYS,
  TRADE_REVIEW_FIELD_PLACEMENTS,
  TRADE_REVIEW_QUESTION_CONFIG_KEY_LIST,
} from '../reviewV2/widgets/tradeReviewConfig';
import { mergeClassNames } from '../../utils/classNames';
import { WidgetInsertSlot, getFirstInsertableIndex } from './WidgetInsertSlot';
import { DropdownSelect } from '../shared/DropdownSelect';
import { Button } from '../ui/Button';

interface TemplateEditorProps {
  plugin: JournalitPlugin;
  templateService: ReviewTemplateService;
  templateId: string;
  templateType: ReviewTemplateType;
  onTemplateChange?: () => void;
  onDirtyStateChange?: (isDirty: boolean) => void;
  
  onCanEditChange?: (canEdit: boolean) => void;
  
  openInEditor?: boolean;
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

const getDemonTrackerTrackingMethodLabel = (
  method: DemonTrackerTrackingMethod
): string => {
  switch (method) {
    case 'trading-days':
      return t(
        'templateEditor.widget.demon-tracker.tracking-method.trading-days'
      );
    case 'daily-review-entries':
      return t(
        'templateEditor.widget.demon-tracker.tracking-method.daily-review-entries'
      );
    default:
      return t(
        'templateEditor.widget.demon-tracker.tracking-method.trade-occurrences'
      );
  }
};

const getDemonTrackerTrackingMethodDescription = (
  method: DemonTrackerTrackingMethod
): string => {
  switch (method) {
    case 'trading-days':
      return t(
        'templateEditor.widget.demon-tracker.tracking-method.trading-days-desc'
      );
    case 'daily-review-entries':
      return t(
        'templateEditor.widget.demon-tracker.tracking-method.daily-review-entries-desc'
      );
    default:
      return t(
        'templateEditor.widget.demon-tracker.tracking-method.trade-occurrences-desc'
      );
  }
};

const hasIncompleteTradeReviewQuestion = (
  widgets: WidgetPlacement[]
): boolean =>
  widgets.some((widget) => {
    if (widget.type !== 'trade-review' || !widget.config) return false;
    return TRADE_REVIEW_QUESTION_CONFIG_KEY_LIST.some((key) => {
      const questions = widget.config?.[key];
      if (!Array.isArray(questions)) return false;
      return !isValidTradeReviewQuestionGraph(questions);
    });
  });








interface SortableWidgetItemProps {
  id: string;
  index: number;
  widget: WidgetPlacement;
  plugin: JournalitPlugin;
  isEditing: boolean;
  templateType: ReviewTemplateType;
  availableMarkdownHeadings: string[];
  availableDrcMarkdownHeadings: string[];
  
  availableTradeNoteHeadings: string[];
  keyLevelsParentGroups: KeyLevelsParentGroups;
  skipWeekends: boolean;
  onWidgetChange: (index: number, widget: WidgetDefinition) => void;
  onConfigChange: (index: number, config: Record<string, unknown>) => void;
  onDuplicate: (index: number) => void;
  onRemove: (index: number) => void;
  
  isJustAdded: boolean;
  onPickerCancel: (index: number) => void;
  
  insertSlotBefore: React.ReactNode;
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

type ReviewContextDisplayMode = 'both' | 'inherited' | 'current';

const reviewContextDisplayOptionKeys: Array<{
  value: ReviewContextDisplayMode;
  labelKey: Parameters<typeof t>[0];
}> = [
  {
    value: 'both',
    labelKey: 'templateEditor.widget.review-context-fields.context.both',
  },
  {
    value: 'inherited',
    labelKey: 'templateEditor.widget.review-context-fields.inherited',
  },
  {
    value: 'current',
    labelKey: 'templateEditor.widget.review-context-fields.current',
  },
];

const getReviewContextDisplayOptions =
  (): SegmentOption<ReviewContextDisplayMode>[] =>
    reviewContextDisplayOptionKeys.map(({ value, labelKey }) => ({
      value,
      label: t(labelKey),
    }));

interface WidgetConfigEditorProps {
  id: string;
  index: number;
  widget: WidgetPlacement;
  plugin: JournalitPlugin;
  templateType: ReviewTemplateType;
  availableMarkdownHeadings: string[];
  availableDrcMarkdownHeadings: string[];
  availableTradeNoteHeadings: string[];
  keyLevelsParentGroups: KeyLevelsParentGroups;
  skipWeekends: boolean;
  onConfigChange: (index: number, config: Record<string, unknown>) => void;
}

const SessionLogConfigEditor: React.FC<WidgetConfigEditorProps> = ({
  index,
  widget,
  onConfigChange,
}) => {
  return (
    <div className="template-widget-config-row">
      <label className="template-review-context-toggle-row">
        <input
          type="checkbox"
          checked={widget.config?.hideEmptyOutsideSession === true}
          onChange={(event) =>
            onConfigChange(index, {
              ...widget.config,
              hideEmptyOutsideSession: event.target.checked,
            })
          }
        />
        {t('templateEditor.widget.session-log.hide-empty-outside')}
      </label>
    </div>
  );
};

const MarkdownHeaderConfigEditor: React.FC<WidgetConfigEditorProps> = ({
  index,
  widget,
  onConfigChange,
}) => {
  
  const headerConfig = widget.config as
    | { level?: number; text?: string }
    | undefined;
  const headerLevel = headerConfig?.level ?? 2;
  const headerText = headerConfig?.text ?? '';
  return (
    <div className="template-widget-config-row">
      <DropdownSelect
        ariaLabel={t('widget.markdown-header.name')}
        width="content"
        value={String(headerLevel)}
        options={[
          { value: '1', label: 'H1' },
          { value: '2', label: 'H2' },
          { value: '3', label: 'H3' },
          { value: '4', label: 'H4' },
          { value: '5', label: 'H5' },
          { value: '6', label: 'H6' },
        ]}
        onChange={(nextValue) =>
          onConfigChange(index, {
            ...widget.config,
            level: parseInt(nextValue, 10),
            text: headerText,
          })
        }
      />
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
  );
};

const MarkdownZoneConfigEditor: React.FC<WidgetConfigEditorProps> = ({
  index,
  widget,
  onConfigChange,
}) => {
  const markdownZoneConfig = widget.config as { text?: string } | undefined;
  const markdownZoneText = markdownZoneConfig?.text ?? '';
  return (
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
        placeholder={t('templateEditor.widget.markdown-zone-text-placeholder')}
        className="template-input template-widget-config-textarea"
        rows={3}
      />
    </div>
  );
};

const ReviewContextFieldsConfigEditor: React.FC<WidgetConfigEditorProps> = ({
  index,
  widget,
  plugin,
  templateType,
  onConfigChange,
}) => {
  const reviewContextDisplayOptions = getReviewContextDisplayOptions();
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

  const reviewContextFieldLabels = new Map(
    reviewContextFields.map((field): [string, string] => [
      field.id,
      field.label,
    ])
  );
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
  const reviewContextDisplayMode: ReviewContextDisplayMode =
    (reviewContextConfig?.showInherited ?? true) &&
    (reviewContextConfig?.showLocal ?? true)
      ? 'both'
      : reviewContextConfig?.showInherited === false
        ? 'current'
        : 'inherited';

  return (
    <div className="template-review-context-config">
      <div className="template-review-context-config-row">
        <div className="template-review-context-config-label">
          {t('templateEditor.widget.review-context-fields.selection')}
        </div>
        <div className="template-review-context-config-control">
          <DropdownSelect
            ariaLabel={t(
              'templateEditor.widget.review-context-fields.selection'
            )}
            width="content"
            value={reviewContextSelectionMode}
            options={[
              {
                value: 'all',
                label: t(
                  'templateEditor.widget.review-context-fields.selection.all'
                ),
              },
              {
                value: 'group',
                label: t(
                  'templateEditor.widget.review-context-fields.selection.group'
                ),
              },
              {
                value: 'fields',
                label: t(
                  'templateEditor.widget.review-context-fields.selection.fields'
                ),
              },
            ]}
            onChange={(nextValue) =>
              updateReviewContextConfig({
                selectionMode: parseReviewContextFieldsSelectionMode(nextValue),
                groupId: undefined,
                fieldIds: undefined,
              })
            }
          />
        </div>
      </div>

      {reviewContextSelectionMode === 'group' && (
        <div className="template-review-context-config-row">
          <div className="template-review-context-config-label">
            {t('templateEditor.widget.review-context-fields.group')}
          </div>
          <div className="template-review-context-config-control">
            <DropdownSelect
              ariaLabel={t('templateEditor.widget.review-context-fields.group')}
              width="content"
              value={reviewContextConfig?.groupId || ''}
              options={[
                {
                  value: '',
                  label: t(
                    'templateEditor.widget.review-context-fields.group-placeholder'
                  ),
                },
                ...reviewContextGroups.map((group) => ({
                  value: group.id,
                  label: group.name,
                })),
              ]}
              onChange={(nextValue) =>
                updateReviewContextConfig({ groupId: nextValue })
              }
            />
          </div>
        </div>
      )}

      {reviewContextSelectionMode === 'fields' &&
        (reviewContextFields.length === 0 ? (
          <div className="template-review-context-config-row">
            <div className="template-review-context-config-label">
              {t('templateEditor.widget.review-context-fields.fields')}
            </div>
            <div className="template-widget-config-help">
              {t('templateEditor.widget.review-context-fields.no-fields')}
            </div>
          </div>
        ) : (
          <div className="template-review-context-config-row template-review-context-config-row--stacked">
            <ComboBox
              isMulti
              label={t('templateEditor.widget.review-context-fields.fields')}
              options={reviewContextFields.map((field) => field.id)}
              getOptionLabel={(fieldId) =>
                reviewContextFieldLabels.get(fieldId) ?? fieldId
              }
              value={Array.from(reviewContextSelectedFieldIds)}
              placeholder={t(
                'templateEditor.widget.review-context-fields.fields-placeholder'
              )}
              onChange={(fieldIds) =>
                updateReviewContextConfig({
                  fieldIds: fieldIds.join(','),
                })
              }
            />
          </div>
        ))}

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
  );
};

const TradeReviewConfigEditor: React.FC<WidgetConfigEditorProps> = ({
  index,
  widget,
  plugin,
  availableTradeNoteHeadings,
  onConfigChange,
}) => {
  const tradeReviewConfig = (widget.config ?? {}) as TradeReviewWidgetConfig;
  const tradeReviewCustomFieldDefinitions =
    plugin.customFieldsService?.getFields() ?? [];
  const fieldLayout = resolveTradeReviewFieldLayout(tradeReviewConfig);
  const notesShown =
    fieldLayout.visible.includes('notes') ||
    fieldLayout.collapsed.includes('notes');
  const notesSectionValues = tradeReviewConfig.notesSections ?? [];
  
  const notesSectionOptions = [
    ...new Set([...availableTradeNoteHeadings, ...notesSectionValues]),
  ];
  const updateTradeReviewConfig = (updates: Record<string, unknown>): void => {
    onConfigChange(index, {
      ...widget.config,
      ...updates,
    });
  };
  const updateTradeReviewQuestions = (
    key: TradeReviewQuestionConfigKey,
    questions: TradeReviewQuestionConfig[]
  ): void => {
    updateTradeReviewConfig({ [key]: questions });
  };
  const resetTradeReviewQuestions = (
    key: TradeReviewQuestionConfigKey
  ): void => {
    const nextConfig = { ...(widget.config ?? {}) };
    delete nextConfig[key];
    onConfigChange(index, nextConfig);
  };
  const updateTradeReviewFieldLayout = (
    layout: TradeReviewFieldLayout
  ): void => {
    const nextConfig: Record<string, unknown> = { ...(widget.config ?? {}) };
    
    delete nextConfig.fields;
    for (const placement of TRADE_REVIEW_FIELD_PLACEMENTS) {
      nextConfig[TRADE_REVIEW_FIELD_PLACEMENT_CONFIG_KEYS[placement]] =
        layout[placement];
    }
    if (layout.hidden.length > 0) {
      nextConfig.hiddenFields = layout.hidden;
    } else {
      delete nextConfig.hiddenFields;
    }
    onConfigChange(index, nextConfig);
  };

  return (
    <div className="template-review-context-config template-trade-review-config">
      <TradeReviewFieldLayoutEditor
        config={tradeReviewConfig}
        customFieldDefinitions={tradeReviewCustomFieldDefinitions}
        onChange={updateTradeReviewFieldLayout}
      />

      {notesShown && (
        <div className="template-review-context-config-row template-review-context-config-row--stacked">
          <ComboBox
            isMulti
            label={t('templateEditor.widget.trade-review.notes-sections')}
            options={notesSectionOptions}
            value={notesSectionValues}
            placeholder={t('templateEditor.widget.trade-review.notes-all')}
            onChange={(headings) =>
              updateTradeReviewConfig({
                notesSections: headings.length > 0 ? headings : undefined,
              })
            }
          />
          {notesSectionOptions.length === 0 && (
            <div className="template-widget-config-help">
              {t('templateEditor.widget.trade-review.notes-sections-empty')}
            </div>
          )}
        </div>
      )}

      <div className="template-review-context-config-row">
        <div className="template-review-context-config-label">
          {t('templateEditor.widget.trade-review.display')}
        </div>
        <div className="template-review-context-config-control template-trade-review-toggle-list">
          <label className="template-review-context-toggle-row">
            <input
              type="checkbox"
              checked={tradeReviewConfig.showImages !== false}
              onChange={(event) =>
                updateTradeReviewConfig({
                  showImages: event.target.checked,
                })
              }
            />
            {t('templateEditor.widget.trade-review.show-images')}
          </label>
          <label className="template-review-context-toggle-row">
            <input
              type="checkbox"
              checked={tradeReviewConfig.defaultExpanded === false}
              onChange={(event) =>
                updateTradeReviewConfig({
                  defaultExpanded: !event.target.checked,
                })
              }
            />
            {t('templateEditor.widget.weekly-drc-start-collapsed')}
          </label>
        </div>
      </div>

      <TradeReviewQuestionEditor
        config={tradeReviewConfig}
        onChange={updateTradeReviewQuestions}
        onReset={resetTradeReviewQuestions}
      />
    </div>
  );
};

const PreviousTradingDayContextConfigEditor: React.FC<
  WidgetConfigEditorProps
> = ({ index, widget, availableMarkdownHeadings, onConfigChange }) => {
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

  return (
    <div className="template-widget-config-row--previous-context">
      <div className="template-previous-context-controls">
        <Button
          variant="secondary"
          size="small"
          className="template-previous-context-add-button"
          onClick={addPreviousContextHeading}
        >
          {t('templateEditor.widget.previous-context-add-section')}
        </Button>

        <DropdownSelect
          ariaLabel={t('templateEditor.widget.previous-context-fallback-label')}
          width="content"
          value={previousContextFallbackMode}
          options={[
            {
              value: 'nearest-earlier',
              label: t(
                'templateEditor.widget.previous-context-fallback-nearest'
              ),
            },
            {
              value: 'expected-only',
              label: t(
                'templateEditor.widget.previous-context-fallback-expected'
              ),
            },
          ]}
          onChange={(nextValue) =>
            onConfigChange(
              index,
              buildPreviousContextConfig(
                widget.config,
                previousContextHeadings,
                nextValue
              )
            )
          }
        />
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
              <DropdownSelect
                ariaLabel={t(
                  'templateEditor.widget.previous-context-heading-label'
                )}
                
                menuWidth="content"
                value={heading}
                options={[
                  {
                    value: '',
                    label: t(
                      'templateEditor.widget.previous-context-heading-placeholder'
                    ),
                  },
                  ...availableMarkdownHeadings.map((availableHeading) => ({
                    value: availableHeading,
                    label: availableHeading,
                  })),
                ]}
                onChange={(nextValue) =>
                  updatePreviousContextHeading(headingIndex, nextValue)
                }
              />
            </div>
            <Button
              variant="danger"
              size="small"
              className="template-previous-context-remove"
              onClick={() => removePreviousContextHeading(headingIndex)}
              aria-label={t('button.remove')}
            >
              {t('button.remove')}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

const WeeklyDrcContextConfigEditor: React.FC<WidgetConfigEditorProps> = ({
  index,
  widget,
  availableDrcMarkdownHeadings,
  skipWeekends,
  onConfigChange,
}) => {
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

  return (
    <div className="template-widget-config-row--previous-context template-weekly-drc-config">
      <div className="template-weekly-drc-options">
        <label className="template-weekly-drc-field">
          <span className="template-widget-config-label">
            {t('templateEditor.widget.weekly-drc-day-label')}
          </span>
          <DropdownSelect
            ariaLabel={t('templateEditor.widget.weekly-drc-day-label')}
            width="content"
            value={weeklyDrcDayScope}
            options={[
              {
                value: 'all',
                label: t('templateEditor.widget.weekly-drc-day-all'),
              },
              ...weeklyDrcDayOptions.map((day) => ({
                value: day,
                label: day.charAt(0).toUpperCase() + day.slice(1),
              })),
            ]}
            onChange={(nextValue) =>
              onConfigChange(
                index,
                buildWeeklyDrcConfig(weeklyDrcHeadings, {
                  dayScope: nextValue,
                })
              )
            }
          />
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
          <Button
            variant="secondary"
            size="small"
            className="template-previous-context-add-button"
            onClick={addWeeklyDrcHeading}
          >
            {t('templateEditor.widget.previous-context-add-section')}
          </Button>
        </div>
        {weeklyDrcSectionRows.map((heading, headingIndex) => (
          <div
            key={`weekly-drc-heading-${headingIndex}`}
            className="template-previous-context-section-row"
          >
            <div className="template-previous-context-select-wrapper">
              <DropdownSelect
                ariaLabel={t(
                  'templateEditor.widget.previous-context-heading-label'
                )}
                
                menuWidth="content"
                value={heading}
                options={[
                  {
                    value: '',
                    label: t(
                      'templateEditor.widget.previous-context-heading-placeholder'
                    ),
                  },
                  ...availableDrcMarkdownHeadings.map((availableHeading) => ({
                    value: availableHeading,
                    label: availableHeading,
                  })),
                ]}
                onChange={(nextValue) =>
                  updateWeeklyDrcHeading(headingIndex, nextValue)
                }
              />
            </div>
            <button
              type="button"
              className="template-previous-context-remove template-previous-context-remove--icon journalit-icon-button"
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
  );
};

const DemonTrackerConfigEditor: React.FC<WidgetConfigEditorProps> = ({
  id,
  index,
  widget,
  templateType,
  onConfigChange,
}) => {
  const demonConfig = widget.config as DemonTrackerWidgetConfig | undefined;
  const demonOptions = resolveDemonTrackerOptions(demonConfig);
  const demonTrackingMethodDescription =
    getDemonTrackerTrackingMethodDescription(demonOptions.trackingMethod);
  const demonTrackingMethodSelectId = `${id}-demon-tracking-method`;
  return (
    <div className="template-widget-config-row template-widget-config-row--wide template-widget-config-row--demon-tracker">
      <div className="template-widget-config-label">
        <span className="template-widget-config-label-heading">
          <label
            id={`${demonTrackingMethodSelectId}-label`}
            htmlFor={demonTrackingMethodSelectId}
          >
            {t('templateEditor.widget.demon-tracker.tracking-method')}
          </label>
          <Tooltip
            content={demonTrackingMethodDescription}
            preferredPosition="top"
            disclosureLabel={demonTrackingMethodDescription}
          >
            <span
              className="journalit-template-widget-config-info journalit-dashboard-metric-info"
              aria-hidden="true"
            >
              <Info size={13} />
            </span>
          </Tooltip>
        </span>
        <DropdownSelect
          id={demonTrackingMethodSelectId}
          ariaLabel={t('templateEditor.widget.demon-tracker.tracking-method')}
          width="content"
          ariaLabelledBy={`${demonTrackingMethodSelectId}-label`}
          value={demonOptions.trackingMethod}
          options={DEMON_TRACKER_TRACKING_METHODS.map((method) => ({
            value: method,
            label: getDemonTrackerTrackingMethodLabel(method),
          }))}
          onChange={(trackingMethod) => {
            if (isDemonTrackerTrackingMethod(trackingMethod)) {
              onConfigChange(index, {
                ...widget.config,
                trackingMethod,
              });
            }
          }}
        />
      </div>

      {(templateType === 'weekly' || templateType === 'monthly') && (
        <label className="template-widget-config-label">
          {t('templateEditor.widget.demon-tracker.stop-after')}
          <DropdownSelect
            ariaLabel={t('templateEditor.widget.demon-tracker.stop-after')}
            width="content"
            value={String(demonOptions.stopThreshold)}
            options={DEMON_TRACKER_STOP_THRESHOLDS.map((threshold) => ({
              value: String(threshold),
              label: String(threshold),
            }))}
            onChange={(nextValue) => {
              const stopThreshold = Number(nextValue);
              if (isDemonTrackerStopThreshold(stopThreshold)) {
                onConfigChange(index, {
                  ...widget.config,
                  stopThreshold,
                });
              }
            }}
          />
        </label>
      )}
    </div>
  );
};

const RollingBiasConfigEditor: React.FC<WidgetConfigEditorProps> = ({
  index,
  widget,
  onConfigChange,
}) => (
  <div className="template-widget-config-row">
    <label className="template-widget-config-label">
      {t('templateEditor.widget.rolling-bias-win-rate.window')}
      <DropdownSelect
        ariaLabel={t('templateEditor.widget.rolling-bias-win-rate.window')}
        width="content"
        value={String(
          toRollingBiasWidgetConfig(widget.config).window ??
            DEFAULT_ROLLING_BIAS_REVIEW_PERIOD
        )}
        options={ROLLING_BIAS_PERIODS.map((period) => ({
          value: String(period),
          label: t('dashboard.rolling_bias.last_trades', {
            count: String(period),
          }),
        }))}
        onChange={(nextValue) => {
          const period = parseRollingBiasPeriod(nextValue);
          if (period) {
            onConfigChange(index, { ...widget.config, window: period });
          }
        }}
      />
    </label>
  </div>
);

const WIDGET_CONFIG_EDITORS = new Map<
  string,
  React.FC<WidgetConfigEditorProps>
>(
  Object.entries({
    'session-log': SessionLogConfigEditor,
    'key-levels': KeyLevelsConfigEditor,
    'markdown-header': MarkdownHeaderConfigEditor,
    'markdown-zone': MarkdownZoneConfigEditor,
    'review-context-fields': ReviewContextFieldsConfigEditor,
    'trade-review': TradeReviewConfigEditor,
    'previous-trading-day-context': PreviousTradingDayContextConfigEditor,
    'weekly-drc-context': WeeklyDrcContextConfigEditor,
    'demon-tracker': DemonTrackerConfigEditor,
    'market-bias': MarketBiasConfigEditor,
    'rolling-bias-win-rate': RollingBiasConfigEditor,
  })
);


const WidgetRowConfig: React.FC<
  WidgetConfigEditorProps & { isEditing: boolean }
> = ({ isEditing, ...editorProps }) => {
  if (!isEditing) return null;
  const ConfigEditor = WIDGET_CONFIG_EDITORS.get(editorProps.widget.type);
  return (
    <>
      {ConfigEditor && <ConfigEditor {...editorProps} />}
      <WidgetOptionControls
        widget={editorProps.widget}
        onConfigChange={(config) =>
          editorProps.onConfigChange(editorProps.index, config)
        }
      />
    </>
  );
};

const WidgetRowActions: React.FC<{
  index: number;
  onDuplicate: (index: number) => void;
  onRemove: (index: number) => void;
}> = ({ index, onDuplicate, onRemove }) => (
  <div className="template-section-actions">
    <button
      onClick={() => onDuplicate(index)}
      className="template-section-action template-section-duplicate journalit-icon-button"
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
    <button
      onClick={() => onRemove(index)}
      className="template-section-action template-section-remove journalit-icon-button"
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
);

function useSortableWidgetItemContent({
  id,
  index,
  widget,
  plugin,
  isEditing,
  templateType,
  availableMarkdownHeadings,
  availableDrcMarkdownHeadings,
  availableTradeNoteHeadings,
  keyLevelsParentGroups,
  skipWeekends,
  onWidgetChange,
  onConfigChange,
  onDuplicate,
  onRemove,
  isJustAdded,
  onPickerCancel,
  insertSlotBefore,
}: SortableWidgetItemProps): React.ReactNode {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: !isEditing || widget.locked });
  const canEditWidget = isEditing && !widget.locked;

  return (
    <div
      ref={setNodeRef}
      style={dndKitStyle(
        CSS.Translate.toString(transform),
        isDragging ? transition : undefined
      )}
      className={mergeClassNames(
        'template-section-card',
        isDragging && 'is-dragging',
        isJustAdded && 'template-section-card--just-added'
      )}
    >
      {insertSlotBefore}
      
      <div className="template-widget-row">
        
        {!widget.locked && (
          <button
            type="button"
            {...attributes}
            {...listeners}
            className={mergeClassNames(
              'journalit-native-button journalit-native-button--unstyled',
              `template-section-handle${isEditing ? ' is-editing' : ''}`
            )}
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
          </button>
        )}
        
        {widget.locked && <div className="template-widget-handle-spacer" />}

        <div className="template-widget-info">
          {canEditWidget ? (
            <WidgetPicker
              value={widget.type}
              valueConfig={widget.config}
              templateType={templateType}
              onChange={(w) => onWidgetChange(index, w)}
              placeholder={t('templateEditor.widget.select-placeholder')}
              autoOpen={isJustAdded && !widget.type}
              onCancel={() => onPickerCancel(index)}
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

        {canEditWidget && (
          <WidgetRowActions
            index={index}
            onDuplicate={onDuplicate}
            onRemove={onRemove}
          />
        )}
      </div>

      <WidgetRowConfig
        isEditing={isEditing}
        id={id}
        index={index}
        widget={widget}
        plugin={plugin}
        templateType={templateType}
        availableMarkdownHeadings={availableMarkdownHeadings}
        availableDrcMarkdownHeadings={availableDrcMarkdownHeadings}
        availableTradeNoteHeadings={availableTradeNoteHeadings}
        keyLevelsParentGroups={keyLevelsParentGroups}
        skipWeekends={skipWeekends}
        onConfigChange={onConfigChange}
      />
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
  onCanEditChange,
  openInEditor = false,
}: TemplateEditorProps) {
  
  const [template, setTemplate] = useState<ReviewTemplate | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>(
    openInEditor ? 'editor' : 'preview'
  );
  
  
  const [lastTemplateId, setLastTemplateId] = useState(templateId);
  if (templateId !== lastTemplateId) {
    setLastTemplateId(templateId);
    if (openInEditor) setViewMode('editor');
  }
  const [editingName, setEditingName] = useState('');
  const [editingWidgets, setEditingWidgetsState] = useState<WidgetPlacement[]>(
    []
  );
  const editingWidgetsRef = useRef(editingWidgets);
  useLayoutEffect(() => {
    editingWidgetsRef.current = editingWidgets;
  }, [editingWidgets]);
  const commitEditingWidgets = useCallback(
    (
      update:
        | WidgetPlacement[]
        | ((currentWidgets: WidgetPlacement[]) => WidgetPlacement[])
    ) => {
      const nextWidgets =
        typeof update === 'function'
          ? update(editingWidgetsRef.current)
          : update;
      editingWidgetsRef.current = nextWidgets;
      setEditingWidgetsState(nextWidgets);
    },
    []
  );
  const widgetEditorIdsRef = useRef<WeakMap<WidgetPlacement, string>>(
    new WeakMap()
  );
  
  const guideAddedWidgetIdRef = useRef<string | null>(null);
  const [justAddedEditorId, setJustAddedEditorId] = useState<string | null>(
    null
  );
  const [isSorting, setIsSorting] = useState(false);
  const emitGuideAction = useGuideAction();
  const currentGuideStepId = useGuideCurrentStepId();
  const registerEditorPanelTarget = useGuideTarget(
    LAYOUT_BUILDER_EDITOR_PANEL_TARGET_ID
  );
  const registerAddWidgetButtonTarget = useGuideTarget(
    LAYOUT_BUILDER_ADD_WIDGET_BUTTON_TARGET_ID
  );
  const registerSaveButtonTarget = useGuideTarget(
    LAYOUT_BUILDER_SAVE_BUTTON_TARGET_ID
  );
  const registerInsertSlotTarget = useGuideTarget(
    LAYOUT_BUILDER_INSERT_SLOT_TARGET_ID
  );
  const isInsertSlotGuideStepVisible =
    useVisibleGuideStepId() === LAYOUT_BUILDER_WHATS_NEW_INSERT_SLOT_STEP_ID;

  
  
  const loadTemplate = useCallback(
    (savedWidgets?: WidgetPlacement[]) => {
      const templates = templateService.getTemplates(templateType);
      const found = templates.find((t) => t.id === templateId);
      if (found) {
        setTemplate(found);
        setEditingName(found.name);
        const widgets = cloneWidgetPlacements(found.widgets);
        if (savedWidgets?.length === widgets.length) {
          widgets.forEach((widget, index) => {
            const editorId = widgetEditorIdsRef.current.get(
              savedWidgets[index]
            );
            if (editorId) widgetEditorIdsRef.current.set(widget, editorId);
          });
        }
        commitEditingWidgets(widgets);
      }
    },
    [commitEditingWidgets, templateService, templateId, templateType]
  );

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

  const keyLevelsParentGroups = useKeyLevelsParentGroups(
    templateService,
    templateType
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

  
  
  const [tradeLayoutVersion, setTradeLayoutVersion] = useState(0);
  useEventBus('trade-template:changed', () =>
    setTradeLayoutVersion((version) => version + 1)
  );
  useEventBus('default-template:changed', ({ type }) => {
    if (type === 'trade') setTradeLayoutVersion((version) => version + 1);
  });
  const availableTradeNoteHeadings = useMemo(() => {
    void tradeLayoutVersion;
    const headings = (
      resolveDefaultTradeTemplate(plugin).noteSections ?? []
    ).flatMap((section) =>
      section.type === 'header' && section.text.trim()
        ? [section.text.trim()]
        : []
    );
    return [...new Set(headings)];
  }, [plugin, tradeLayoutVersion]);

  
  useEffect(() => {
    onDirtyStateChange?.(hasChanges);
  }, [hasChanges, onDirtyStateChange]);

  
  const canEdit = viewMode === 'editor' && template && !template.isBuiltIn;

  
  
  const isEditable = !!canEdit;
  useEffect(() => {
    onCanEditChange?.(isEditable);
    return () => onCanEditChange?.(false);
  }, [isEditable, onCanEditChange]);
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
    if (hasIncompleteTradeReviewQuestion(editingWidgets)) {
      new Notice(t('validation.complete-required'));
      return;
    }

    try {
      await templateService.updateTemplate(templateId, {
        name: editingName,
        widgets: editingWidgets,
      });
      loadTemplate(editingWidgets);
      
      
      guideAddedWidgetIdRef.current = null;
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
      commitEditingWidgets(cloneWidgetPlacements(template.widgets));
    }
  }, [commitEditingWidgets, template]);

  
  const replaceWidgetPlacement = useCallback(
    (previous: WidgetPlacement, next: WidgetPlacement): WidgetPlacement => {
      widgetEditorIdsRef.current.set(next, getWidgetEditorId(previous));
      return next;
    },
    [getWidgetEditorId]
  );

  
  const handleInsertWidget = useCallback(
    (index: number) => {
      const placement: WidgetPlacement = { type: '' };
      const editorId = getWidgetEditorId(placement);
      commitEditingWidgets((currentWidgets) => {
        const nextWidgets = [...currentWidgets];
        nextWidgets.splice(index, 0, placement);
        return nextWidgets;
      });
      guideAddedWidgetIdRef.current = editorId;
      setJustAddedEditorId(editorId);
      emitGuideAction(LAYOUT_BUILDER_WIDGET_ADDED_ACTION_ID);
    },
    [commitEditingWidgets, emitGuideAction, getWidgetEditorId]
  );

  const handleAddWidget = useCallback(() => {
    handleInsertWidget(editingWidgetsRef.current.length);
  }, [handleInsertWidget]);

  
  
  
  const handlePickerCancel = useCallback(
    (index: number) => {
      if (currentGuideStepId === 'choose-widget') return;
      const widget = editingWidgetsRef.current[index];
      if (!widget || widget.type) return;
      commitEditingWidgets((currentWidgets) =>
        currentWidgets.filter((current) => current !== widget)
      );
    },
    [commitEditingWidgets, currentGuideStepId]
  );

  const handleRemoveWidget = useCallback(
    (index: number) => {
      const currentWidgets = editingWidgetsRef.current;
      if (currentWidgets[index].locked) {
        new Notice(t('notice.info.cannot-remove-locked'));
        return;
      }
      const newWidgets = [...currentWidgets];
      newWidgets.splice(index, 1);
      commitEditingWidgets(newWidgets);
    },
    [commitEditingWidgets]
  );

  const handleDuplicateWidget = useCallback(
    (index: number) => {
      const currentWidgets = editingWidgetsRef.current;
      const sourceWidget = currentWidgets[index];
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

      const newWidgets = [...currentWidgets];
      newWidgets.splice(index + 1, 0, duplicatedWidget);
      commitEditingWidgets(newWidgets);
    },
    [commitEditingWidgets]
  );

  const handleWidgetChange = useCallback(
    (index: number, widgetDef: WidgetDefinition) => {
      const newWidgets = [...editingWidgetsRef.current];
      
      
      const sameType = newWidgets[index].type === widgetDef.type;
      const previousConfig = sameType ? newWidgets[index].config : undefined;
      const mergedConfig = widgetDef.defaultConfig
        ? { ...previousConfig, ...widgetDef.defaultConfig }
        : previousConfig;
      const nextWidget: WidgetPlacement = {
        ...newWidgets[index],
        type: widgetDef.type,
        config: mergedConfig,
        id: sameType ? newWidgets[index].id : undefined,
      };

      if (widgetDef.type === 'images' && !nextWidget.id) {
        nextWidget.id = `images-${generateUUID()}`;
      }

      newWidgets[index] = replaceWidgetPlacement(newWidgets[index], nextWidget);
      commitEditingWidgets(newWidgets);
    },
    [commitEditingWidgets, replaceWidgetPlacement]
  );

  const handleWidgetConfigChange = useCallback(
    (index: number, config: Record<string, unknown>) => {
      const newWidgets = [...editingWidgetsRef.current];
      const nextWidget = { ...newWidgets[index], config };
      newWidgets[index] = replaceWidgetPlacement(newWidgets[index], nextWidget);
      commitEditingWidgets(newWidgets);
    },
    [commitEditingWidgets, replaceWidgetPlacement]
  );

  const handleDragStart = useCallback(() => setIsSorting(true), []);
  const handleDragCancel = useCallback(() => setIsSorting(false), []);

  
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setIsSorting(false);
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      commitEditingWidgets((prevWidgets) => {
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
    [commitEditingWidgets, getWidgetEditorId]
  );

  const handleGuideBack = useCallback(
    ({ toStepId }: { toStepId: string }) => {
      if (toStepId === 'intro' || toStepId === 'create-own-layout') {
        setJustAddedEditorId(null);
        setViewMode('preview');
        return;
      }

      
      
      const targetStepId =
        toStepId === 'save-template' && !hasChanges ? 'add-widget' : toStepId;
      const redirect =
        targetStepId === toStepId ? undefined : { toStepId: targetStepId };

      if (
        targetStepId === 'editor-overview' ||
        targetStepId === 'add-widget' ||
        targetStepId === 'choose-widget' ||
        targetStepId === 'save-template' ||
        targetStepId === 'set-default-template'
      ) {
        setViewMode('editor');
      }

      const guideAddedWidgetId = guideAddedWidgetIdRef.current;

      if (targetStepId === 'add-widget' && guideAddedWidgetId !== null) {
        commitEditingWidgets((currentWidgets) =>
          currentWidgets.filter(
            (widget) => getWidgetEditorId(widget) !== guideAddedWidgetId
          )
        );
        guideAddedWidgetIdRef.current = null;
        return redirect;
      }

      if (targetStepId === 'choose-widget' && guideAddedWidgetId !== null) {
        commitEditingWidgets((currentWidgets) =>
          currentWidgets.map((widget) =>
            getWidgetEditorId(widget) === guideAddedWidgetId
              ? 
                
                replaceWidgetPlacement(widget, { type: '' })
              : widget
          )
        );
      }

      return redirect;
    },
    [
      commitEditingWidgets,
      getWidgetEditorId,
      hasChanges,
      replaceWidgetPlacement,
    ]
  );

  useGuideBackHandler(handleGuideBack);

  const handleViewModeChange = useCallback((nextViewMode: ViewMode) => {
    
    setJustAddedEditorId(null);
    setViewMode(nextViewMode);
  }, []);

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
    availableTradeNoteHeadings,
    keyLevelsParentGroups,
    canEdit,
    getWidgetEditorId,
    previewTemplate,
    handleSave,
    handleDiscard,
    handleAddWidget,
    handleInsertWidget,
    handlePickerCancel,
    justAddedEditorId,
    isSorting,
    handleRemoveWidget,
    handleDuplicateWidget,
    handleWidgetChange,
    handleWidgetConfigChange,
    handleDragStart,
    handleDragCancel,
    handleDragEnd,
    handleViewModeChange,
    handleOpenWidgetLibraryDocs,
    registerEditorPanelTarget,
    registerAddWidgetButtonTarget,
    registerSaveButtonTarget,
    registerInsertSlotTarget,
    isInsertSlotGuideStepVisible,
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
    availableTradeNoteHeadings,
    keyLevelsParentGroups,
    canEdit,
    getWidgetEditorId,
    previewTemplate,
    handleSave,
    handleDiscard,
    handleAddWidget,
    handleInsertWidget,
    handlePickerCancel,
    justAddedEditorId,
    isSorting,
    handleRemoveWidget,
    handleDuplicateWidget,
    handleWidgetChange,
    handleWidgetConfigChange,
    handleDragStart,
    handleDragCancel,
    handleDragEnd,
    handleViewModeChange,
    handleOpenWidgetLibraryDocs,
    registerEditorPanelTarget,
    registerAddWidgetButtonTarget,
    registerSaveButtonTarget,
    registerInsertSlotTarget,
    isInsertSlotGuideStepVisible,
  } = useTemplateEditorModel(props);

  if (!template || !previewTemplate) {
    return (
      <div className="template-editor-loading">
        {t('templateEditor.loading')}
      </div>
    );
  }

  const showUnsavedBanner = hasChanges && !template.isBuiltIn;
  const minInsertIndex = getFirstInsertableIndex(editingWidgets);
  const renderInsertSlot = (index: number, trailing = false) =>
    canEdit && index >= minInsertIndex ? (
      <WidgetInsertSlot
        index={index}
        trailing={trailing}
        
        ref={index === minInsertIndex ? registerInsertSlotTarget : undefined}
        revealed={index === minInsertIndex && isInsertSlotGuideStepVisible}
        onInsert={handleInsertWidget}
      />
    ) : null;

  return (
    <div
      className={`template-editor-root${showUnsavedBanner ? ' template-editor-root--has-floating-unsaved' : ''}`}
    >
      
      <div className="template-editor-topbar">
        <div className="template-editor-topbar-group">
          <SegmentedControl
            options={getViewModeOptions()}
            value={viewMode}
            onChange={(v) => handleViewModeChange(v)}
            size="small"
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
          <TemplatePreview template={previewTemplate} plugin={plugin} />
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

            
            <div className="template-editor-field">
              <label
                htmlFor="journalit-templateeditor-1956"
                className="template-editor-field-label"
              >
                {t('templateEditor.field.template-name')}
              </label>
              <input
                id="journalit-templateeditor-1956"
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
                <div className="template-editor-widget-label">
                  {t('templateEditor.field.widgets', {
                    count: String(editingWidgets.length),
                  })}
                </div>
                {canEdit && (
                  <div className="template-editor-widget-actions">
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => void handleOpenWidgetLibraryDocs()}
                      className="template-action-button template-action-button--neutral template-action-button--compact"
                    >
                      {t('templateEditor.button.widget-library-docs')}
                    </Button>
                    <Button
                      variant="primary"
                      size="small"
                      ref={registerAddWidgetButtonTarget}
                      onClick={() => void handleAddWidget()}
                      className="template-action-button template-action-button--secondary template-action-button--compact"
                    >
                      {t('templateEditor.button.add-widget')}
                    </Button>
                  </div>
                )}
              </div>

              <DndContext
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragCancel={handleDragCancel}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={editingWidgets.map(getWidgetEditorId)}
                  strategy={verticalListSortingStrategy}
                >
                  <div
                    className={mergeClassNames(
                      'template-editor-widget-list',
                      isSorting && 'is-sorting'
                    )}
                  >
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
                        availableTradeNoteHeadings={availableTradeNoteHeadings}
                        keyLevelsParentGroups={keyLevelsParentGroups}
                        skipWeekends={
                          plugin.settings.trade.skipWeekends ?? true
                        }
                        onWidgetChange={handleWidgetChange}
                        onConfigChange={handleWidgetConfigChange}
                        onDuplicate={handleDuplicateWidget}
                        onRemove={handleRemoveWidget}
                        isJustAdded={
                          justAddedEditorId === getWidgetEditorId(widget)
                        }
                        onPickerCancel={handlePickerCancel}
                        insertSlotBefore={renderInsertSlot(index)}
                      />
                    ))}
                    {renderInsertSlot(editingWidgets.length, true)}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          </div>
        )}
      </div>

      
      {showUnsavedBanner && (
        <FloatingUnsavedChangesBanner
          message={t('templateEditor.unsaved-changes')}
          onDiscard={() => void handleDiscard()}
          onSave={() => void handleSave()}
          saveButtonRef={registerSaveButtonTarget}
        />
      )}
    </div>
  );
};
