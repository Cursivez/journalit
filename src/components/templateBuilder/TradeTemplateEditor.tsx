

import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { Notice } from 'obsidian';
import { Info } from '../shared/icons/ObsidianIcon';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { dndKitStyle } from '../../styles/inlineStylePolicy';
import type JournalitPlugin from '../../main';
import { TradeTemplate, TradeReviewSection } from '../../types/reviewV2';
import { TradeTemplateService } from '../../services/templates/TradeTemplateService';
import { t } from '../../lang/helpers';

interface TradeTemplateEditorProps {
  plugin: JournalitPlugin;
  tradeTemplateService: TradeTemplateService;
  templateId: string;
  onTemplateChange?: () => void;
  onDirtyStateChange?: (isDirty: boolean) => void;
}


const Toggle: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}> = ({ checked, onChange, disabled }) => (
  <button
    onClick={() => !disabled && onChange(!checked)}
    className={`template-toggle${checked ? ' is-checked' : ''}${
      disabled ? ' is-disabled' : ''
    }`}
  >
    <div className="template-toggle__thumb" />
  </button>
);


const SectionRow: React.FC<{
  label: string;
  description?: string;
  children: React.ReactNode;
}> = ({ label, description, children }) => (
  <div className="template-section-row">
    <div className="template-section-row__info">
      <div className="template-section-row__label">{label}</div>
      {description && (
        <div className="template-section-row__description">{description}</div>
      )}
    </div>
    <div className="template-section-row__control">{children}</div>
  </div>
);


const Select: React.FC<{
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  disabled?: boolean;
}> = ({ value, options, onChange, disabled }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    disabled={disabled}
    className={`template-select${disabled ? ' is-disabled' : ''}`}
  >
    {options.map((opt) => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>
);


const Input: React.FC<{
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  disabled?: boolean;
}> = ({ value, onChange, placeholder, multiline, rows = 3, disabled }) => {
  const className = `template-input${multiline ? ' template-input--textarea' : ''}${
    disabled ? ' is-disabled' : ''
  }`;

  if (multiline) {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className={className}
      />
    );
  }

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={className}
    />
  );
};


const getSectionTypeLabel = (type: TradeReviewSection['type']) => {
  switch (type) {
    case 'header':
      return t('template.editor.type.header');
    case 'checkbox':
      return t('template.editor.type.checkbox');
    case 'textarea':
      return t('template.editor.type.textarea');
    case 'checkboxList':
      return t('template.editor.type.checkboxList');
  }
};


const getSectionPreviewText = (section: TradeReviewSection) => {
  if (section.title) return section.title.replace(/\*\*/g, '');
  if (section.content)
    return (
      section.content.substring(0, 30) +
      (section.content.length > 30 ? '...' : '')
    );
  if (section.placeholder)
    return (
      section.placeholder.substring(0, 30) +
      (section.placeholder.length > 30 ? '...' : '')
    );
  return t('template.editor.preview-fallback', {
    type: getSectionTypeLabel(section.type),
  });
};


interface SortableSectionItemProps {
  id: string;
  section: TradeReviewSection;
  isEditing: boolean;
  onUpdate: (section: TradeReviewSection) => void;
  onRemove: () => void;
}

const SortableSectionItem: React.FC<SortableSectionItemProps> = ({
  id,
  section,
  isEditing,
  onUpdate,
  onRemove,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: !isEditing });

  const [isExpanded, setIsExpanded] = useState(false);

  const handleDragHandleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    listeners?.onKeyDown?.(e);
  };

  const handleTypeChange = (newType: TradeReviewSection['type']) => {
    const updated = { ...section, type: newType };
    
    if (newType === 'checkboxList') {
      updated.items = updated.items || [''];
      updated.content = undefined;
      updated.placeholder = undefined;
    } else if (newType === 'textarea') {
      updated.placeholder = updated.placeholder || '';
      updated.content = undefined;
      updated.items = undefined;
    } else {
      updated.content = updated.content || '';
      updated.items = undefined;
      updated.placeholder = undefined;
    }
    onUpdate(updated);
  };

  const handleItemUpdate = (itemIndex: number, value: string) => {
    const newItems = [...(section.items || [])];
    newItems[itemIndex] = value;
    onUpdate({ ...section, items: newItems });
  };

  const handleAddItem = () => {
    const newItems = [...(section.items || []), ''];
    onUpdate({ ...section, items: newItems });
  };

  const handleRemoveItem = (itemIndex: number) => {
    const newItems = (section.items || []).filter((_, i) => i !== itemIndex);
    onUpdate({ ...section, items: newItems.length > 0 ? newItems : [''] });
  };

  return (
    <div
      ref={setNodeRef}
      style={dndKitStyle(
        CSS.Transform.toString(transform),
        isDragging ? transition : undefined
      )}
      className={`template-section-card${isDragging ? ' is-dragging' : ''}`}
    >
      
      <div className="template-section-row-main">
        
        <div
          {...attributes}
          {...listeners}
          role="button"
          tabIndex={isEditing ? 0 : -1}
          className={`template-section-handle${isEditing ? ' is-editing' : ''}`}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={handleDragHandleKeyDown}
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

        
        <div
          className={`template-section-info${isEditing ? ' is-editing' : ''}`}
          role="button"
          tabIndex={isEditing ? 0 : -1}
          aria-disabled={!isEditing || undefined}
          onClick={() => isEditing && setIsExpanded(!isExpanded)}
          onKeyDown={(e) => {
            if (!isEditing || (e.key !== 'Enter' && e.key !== ' ')) return;
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }}
        >
          <div className="template-section-info-row">
            <span className="template-section-title">
              {getSectionPreviewText(section)}
            </span>
            <span className="template-section-type">
              {getSectionTypeLabel(section.type)}
            </span>
          </div>
        </div>

        
        {isEditing && (
          <button
            onClick={() => onRemove()}
            className="template-section-remove"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      
      {isExpanded && isEditing && (
        <div className="template-section-expanded">
          
          <div>
            <label className="template-section-label">
              {t('template.editor.section-type')}
            </label>
            <Select
              value={section.type}
              options={[
                {
                  value: 'textarea',
                  label: t('template.editor.type.textarea'),
                },
                {
                  value: 'checkbox',
                  label: t('template.editor.type.checkbox'),
                },
                {
                  value: 'checkboxList',
                  label: t('template.editor.type.checkboxList'),
                },
              ]}
              onChange={(value) =>
                handleTypeChange(value as TradeReviewSection['type'])
              }
            />
          </div>

          
          <div>
            <label className="template-section-label">
              {t('template.editor.title-label')}
            </label>
            <Input
              value={section.title}
              onChange={(value) => onUpdate({ ...section, title: value })}
              placeholder={t('template.editor.title-placeholder')}
            />
          </div>

          
          {section.type === 'header' && (
            <div>
              <label className="template-section-label">
                {t('template.editor.content-label')}
              </label>
              <Input
                value={section.content || ''}
                onChange={(value) => onUpdate({ ...section, content: value })}
                placeholder={t('template.editor.content-placeholder')}
                multiline
                rows={2}
              />
            </div>
          )}

          {section.type === 'checkbox' && (
            <div>
              <label className="template-section-label">
                {t('template.editor.checkbox-label')}
              </label>
              <Input
                value={section.content || ''}
                onChange={(value) => onUpdate({ ...section, content: value })}
                placeholder={t('template.editor.checkbox-placeholder')}
                multiline
                rows={2}
              />
            </div>
          )}

          {section.type === 'textarea' && (
            <div>
              <label className="template-section-label">
                {t('template.editor.placeholder-label')}
              </label>
              <Input
                value={section.placeholder || ''}
                onChange={(value) =>
                  onUpdate({ ...section, placeholder: value })
                }
                placeholder={t('template.editor.placeholder-hint')}
              />
            </div>
          )}

          {section.type === 'checkboxList' && (
            <div>
              <label className="template-section-label">
                {t('template.editor.items-label')}
              </label>
              {(section.items || ['']).map((item, itemIndex) => (
                <div key={itemIndex} className="template-checkboxlist-row">
                  <Input
                    value={item}
                    onChange={(value) => handleItemUpdate(itemIndex, value)}
                    placeholder={t('template.editor.item-n', {
                      n: String(itemIndex + 1),
                    })}
                  />
                  <button
                    onClick={() => handleRemoveItem(itemIndex)}
                    disabled={(section.items || []).length <= 1}
                    className="template-section-remove"
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                onClick={handleAddItem}
                className="template-action-button template-action-button--secondary template-action-button--compact"
              >
                {t('template.editor.add-item')}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

function useTradeTemplateEditorModel({
  tradeTemplateService,
  templateId,
  onTemplateChange,
  onDirtyStateChange,
}: Omit<TradeTemplateEditorProps, 'plugin'>) {
  
  const [template, setTemplate] = useState<TradeTemplate | null>(null);

  
  const [editingName, setEditingName] = useState('');
  const [editingSections, setEditingSections] = useState<
    TradeTemplate['sections'] | null
  >(null);
  const [isEditingNameField, setIsEditingNameField] = useState(false);

  
  const loadTemplate = useCallback(() => {
    const loaded = tradeTemplateService.getTemplate(templateId);
    if (loaded) {
      setTemplate(loaded);
      setEditingName(loaded.name);
      setEditingSections(JSON.parse(JSON.stringify(loaded.sections)));
    }
  }, [templateId, tradeTemplateService]);

  
  useEffect(() => {
    loadTemplate();
  }, [loadTemplate]);

  
  const hasChanges = useMemo(() => {
    if (!template || !editingSections) return false;
    if (editingName !== template.name) return true;
    return (
      JSON.stringify(editingSections) !== JSON.stringify(template.sections)
    );
  }, [template, editingName, editingSections]);

  
  useEffect(() => {
    onDirtyStateChange?.(hasChanges);
  }, [hasChanges, onDirtyStateChange]);

  
  const handleSave = useCallback(async () => {
    if (!template || !editingSections) return;

    try {
      if (template.isBuiltIn) {
        new Notice(t('notice.error.duplicate-to-customize'));
        return;
      }

      await tradeTemplateService.updateTemplate(template.id, {
        name: editingName,
        sections: editingSections,
      });
      loadTemplate();
      onTemplateChange?.();
      new Notice(t('notice.template-saved'));
    } catch (error) {
      console.error('Failed to save template:', error);
      new Notice(
        error instanceof Error
          ? error.message
          : t('notice.error.switch-template-generic')
      );
    }
  }, [
    template,
    editingName,
    editingSections,
    tradeTemplateService,
    loadTemplate,
    onTemplateChange,
  ]);

  
  const handleDiscard = useCallback(() => {
    if (template) {
      setEditingName(template.name);
      setEditingSections(JSON.parse(JSON.stringify(template.sections)));
    }
  }, [template]);

  
  const updateSection = useCallback(
    <K extends keyof TradeTemplate['sections']>(
      sectionKey: K,
      updates: Partial<TradeTemplate['sections'][K]>
    ) => {
      if (!editingSections) return;

      setEditingSections((currentSections) => {
        if (!currentSections) return currentSections;

        return {
          ...currentSections,
          [sectionKey]: {
            ...currentSections[sectionKey],
            ...updates,
          },
        };
      });
    },
    [editingSections]
  );

  
  const handleNameBlur = useCallback(() => {
    setIsEditingNameField(false);
  }, []);

  
  const createDragEndHandler = useCallback(
    (sectionKey: 'sections' | 'winSections' | 'lossSections') => {
      return (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id || !editingSections) return;

        const sections = editingSections.review[sectionKey] || [];
        const oldIndex = sections.findIndex((s) => s.id === active.id);
        const newIndex = sections.findIndex((s) => s.id === over.id);

        if (oldIndex === -1 || newIndex === -1) return;

        const newSections = [...sections];
        const [movedItem] = newSections.splice(oldIndex, 1);
        newSections.splice(newIndex, 0, movedItem);

        updateSection('review', { [sectionKey]: newSections });
      };
    },
    [editingSections, updateSection]
  );

  
  const [activeReviewTab, setActiveReviewTab] = useState<'win' | 'loss'>('win');
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditingNameField) {
      nameInputRef.current?.focus();
    }
  }, [isEditingNameField]);

  return {
    template,
    editingSections,
    editingName,
    setEditingName,
    isEditingNameField,
    setIsEditingNameField,
    hasChanges,
    handleDiscard,
    handleSave,
    updateSection,
    handleNameBlur,
    createDragEndHandler,
    activeReviewTab,
    setActiveReviewTab,
    nameInputRef,
  };
}

type TradeTemplateEditorModel = ReturnType<typeof useTradeTemplateEditorModel>;

function ReviewSectionList({
  editingSections,
  canEdit,
  sectionKey,
  label,
  mutedLabel = false,
  addPrefix,
  updateSection,
  createDragEndHandler,
}: Pick<TradeTemplateEditorModel, 'updateSection' | 'createDragEndHandler'> & {
  editingSections: TradeTemplate['sections'];
  canEdit: boolean;
  sectionKey: 'sections' | 'winSections' | 'lossSections';
  label: string;
  mutedLabel?: boolean;
  addPrefix: string;
}) {
  const sections = editingSections.review[sectionKey] || [];

  return (
    <>
      <div className="template-editor-section-header">
        <label
          className={`template-editor-section-label${mutedLabel ? ' template-editor-section-label--muted' : ''}`}
        >
          {label}
        </label>
        {canEdit && (
          <button
            onClick={() => {
              const newSection: TradeReviewSection = {
                id: `${addPrefix}-${Date.now()}`,
                title: '',
                type: 'textarea',
                placeholder: '',
              };
              updateSection('review', {
                [sectionKey]: [...sections, newSection],
              });
            }}
            className="template-action-button template-action-button--secondary template-action-button--compact"
          >
            {t('template.editor.add-section')}
          </button>
        )}
      </div>

      {sections.length === 0 ? (
        <div className="template-editor-empty-state">
          {t('template.editor.no-sections')}
          {canEdit && t('template.editor.add-section-hint')}
        </div>
      ) : (
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={createDragEndHandler(sectionKey)}
        >
          <SortableContext
            items={sections.map((section) => section.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="template-editor-section-list">
              {sections.map((section, index) => (
                <SortableSectionItem
                  key={section.id}
                  id={section.id}
                  section={section}
                  isEditing={canEdit}
                  onUpdate={(updatedSection) => {
                    const nextSections = [...sections];
                    nextSections[index] = updatedSection;
                    updateSection('review', { [sectionKey]: nextSections });
                  }}
                  onRemove={() => {
                    updateSection('review', {
                      [sectionKey]: sections.filter((_, i) => i !== index),
                    });
                  }}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </>
  );
}

function TradeReviewSettingsPanel({
  editingSections,
  canEdit,
  isBuiltIn,
  updateSection,
  createDragEndHandler,
  activeReviewTab,
  setActiveReviewTab,
}: Pick<
  TradeTemplateEditorModel,
  | 'updateSection'
  | 'createDragEndHandler'
  | 'activeReviewTab'
  | 'setActiveReviewTab'
> & {
  editingSections: TradeTemplate['sections'];
  canEdit: boolean;
  isBuiltIn: boolean;
}) {
  return (
    <>
      
      <div className="template-editor-panel template-editor-panel--spaced">
        <h3 className="template-editor-section-title">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
          {t('template.editor.review-title')}
        </h3>

        
        {isBuiltIn && (
          <div className="template-editor-notice template-editor-notice--warning">
            <Info size={16} className="template-editor-notice__icon" />
            <span>{t('template.editor.built-in-notice')}</span>
          </div>
        )}

        <SectionRow
          label={t('template.editor.show-review')}
          description={t('template.editor.show-review-desc')}
        >
          <Select
            value={editingSections.review.show}
            options={[
              {
                value: 'always',
                label: t('template.editor.show-review.always'),
              },
              {
                value: 'losses-only',
                label: t('template.editor.show-review.losses-only'),
              },
              {
                value: 'never',
                label: t('template.editor.show-review.never'),
              },
            ]}
            onChange={(value) =>
              updateSection('review', {
                show: value as 'always' | 'losses-only' | 'never',
              })
            }
            disabled={isBuiltIn}
          />
        </SectionRow>

        
        {editingSections.review.show !== 'never' && (
          <>
            <SectionRow
              label={t('template.editor.show-missed')}
              description={t('template.editor.show-missed-desc')}
            >
              <Toggle
                checked={editingSections.review.showForMissed ?? false}
                onChange={(checked) =>
                  updateSection('review', { showForMissed: checked })
                }
                disabled={isBuiltIn}
              />
            </SectionRow>

            <SectionRow
              label={t('template.editor.show-backtest')}
              description={t('template.editor.show-backtest-desc')}
            >
              <Toggle
                checked={editingSections.review.showForBacktest ?? false}
                onChange={(checked) =>
                  updateSection('review', { showForBacktest: checked })
                }
                disabled={isBuiltIn}
              />
            </SectionRow>
          </>
        )}

        
        {editingSections.review.show !== 'never' && (
          <div className="template-editor-review-sections">
            
            {editingSections.review.show === 'losses-only' && (
              <ReviewSectionList
                editingSections={editingSections}
                canEdit={canEdit}
                sectionKey="sections"
                label={t('template.editor.sections')}
                addPrefix="section"
                updateSection={updateSection}
                createDragEndHandler={createDragEndHandler}
              />
            )}

            
            {editingSections.review.show === 'always' && (
              <>
                
                <div className="template-editor-tab-list">
                  <button
                    onClick={() => setActiveReviewTab('win')}
                    className={`template-editor-tab-button${
                      activeReviewTab === 'win' ? ' is-active' : ''
                    }`}
                  >
                    {t('template.editor.win-sections')}
                  </button>
                  <button
                    onClick={() => setActiveReviewTab('loss')}
                    className={`template-editor-tab-button${
                      activeReviewTab === 'loss' ? ' is-active' : ''
                    }`}
                  >
                    {t('template.editor.loss-sections')}
                  </button>
                </div>

                
                {activeReviewTab === 'win' && (
                  <ReviewSectionList
                    editingSections={editingSections}
                    canEdit={canEdit}
                    sectionKey="winSections"
                    label={t('template.editor.win-sections-desc')}
                    mutedLabel
                    addPrefix="win-section"
                    updateSection={updateSection}
                    createDragEndHandler={createDragEndHandler}
                  />
                )}

                
                {activeReviewTab === 'loss' && (
                  <ReviewSectionList
                    editingSections={editingSections}
                    canEdit={canEdit}
                    sectionKey="lossSections"
                    label={t('template.editor.loss-sections-desc')}
                    mutedLabel
                    addPrefix="loss-section"
                    updateSection={updateSection}
                    createDragEndHandler={createDragEndHandler}
                  />
                )}
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export const TradeTemplateEditor: React.FC<TradeTemplateEditorProps> = ({
  plugin: _plugin,
  tradeTemplateService,
  templateId,
  onTemplateChange,
  onDirtyStateChange,
}) => {
  const {
    template,
    editingSections,
    editingName,
    setEditingName,
    isEditingNameField,
    setIsEditingNameField,
    hasChanges,
    handleDiscard,
    handleSave,
    updateSection,
    handleNameBlur,
    createDragEndHandler,
    activeReviewTab,
    setActiveReviewTab,
    nameInputRef,
  } = useTradeTemplateEditorModel({
    tradeTemplateService,
    templateId,
    onTemplateChange,
    onDirtyStateChange,
  });

  if (!template || !editingSections) {
    return (
      <div className="template-editor-loading">
        {t('template.editor.loading')}
      </div>
    );
  }

  const isBuiltIn = template.isBuiltIn;
  const canEdit = !isBuiltIn;

  return (
    <div className="template-editor-root">
      
      <div className="template-editor-topbar">
        <div className="template-editor-topbar-group template-editor-topbar-group--tight">
          {isEditingNameField && canEdit ? (
            <input
              ref={nameInputRef}
              type="text"
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              onBlur={handleNameBlur}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleNameBlur();
                if (e.key === 'Escape') {
                  setEditingName(template.name);
                  setIsEditingNameField(false);
                }
              }}
              className="template-editor-title-input"
            />
          ) : (
            <h2
              role={canEdit ? 'button' : undefined}
              tabIndex={canEdit ? 0 : undefined}
              onClick={() => canEdit && setIsEditingNameField(true)}
              onKeyDown={
                canEdit
                  ? (e) => {
                      if (e.key !== 'Enter' && e.key !== ' ') return;
                      e.preventDefault();
                      setIsEditingNameField(true);
                    }
                  : undefined
              }
              className={`template-editor-title-text${canEdit ? ' is-editable' : ''}`}
            >
              {editingName}
            </h2>
          )}
          {isBuiltIn && (
            <span className="template-editor-badge">
              {t('template.editor.built-in')}
            </span>
          )}
        </div>
      </div>

      
      <div className="template-editor-canvas template-editor-canvas-container">
        <div className="template-editor-content">
          
          {hasChanges && canEdit && (
            <div className="template-unsaved-banner">
              <span className="template-unsaved-banner__text">
                {t('template.editor.unsaved-changes')}
              </span>
              <div className="template-unsaved-banner__actions">
                <button
                  onClick={handleDiscard}
                  className="template-action-button template-action-button--neutral template-action-button--compact"
                >
                  {t('button.discard')}
                </button>
                <button
                  onClick={handleSave}
                  className="template-action-button template-action-button--primary template-action-button--compact"
                >
                  {t('button.save')}
                </button>
              </div>
            </div>
          )}

          <TradeReviewSettingsPanel
            editingSections={editingSections}
            canEdit={canEdit}
            isBuiltIn={isBuiltIn}
            updateSection={updateSection}
            createDragEndHandler={createDragEndHandler}
            activeReviewTab={activeReviewTab}
            setActiveReviewTab={setActiveReviewTab}
          />

          
          <div className="template-editor-panel">
            <h3 className="template-editor-section-title template-editor-section-title--compact">
              {t('template.editor.section-visibility')}
            </h3>

            <SectionRow
              label={t('template.editor.nav-bar')}
              description={t('template.editor.nav-bar-desc')}
            >
              <Toggle
                checked={editingSections.navigation.show}
                onChange={(checked) =>
                  updateSection('navigation', { show: checked })
                }
                disabled={!canEdit}
              />
            </SectionRow>

            <SectionRow
              label={t('template.editor.images')}
              description={t('template.editor.images-desc')}
            >
              <Toggle
                checked={editingSections.images.show}
                onChange={(checked) =>
                  updateSection('images', { show: checked })
                }
                disabled={!canEdit}
              />
            </SectionRow>

            <SectionRow
              label={t('template.editor.metadata')}
              description={t('template.editor.metadata-desc')}
            >
              <Toggle
                checked={editingSections.metadata.show}
                onChange={(checked) =>
                  updateSection('metadata', { show: checked })
                }
                disabled={!canEdit}
              />
            </SectionRow>

            <SectionRow
              label={t('template.editor.details')}
              description={t('template.editor.details-desc')}
            >
              <Toggle
                checked={editingSections.details.show}
                onChange={(checked) =>
                  updateSection('details', { show: checked })
                }
                disabled={!canEdit}
              />
            </SectionRow>

            <SectionRow
              label={t('template.editor.review-button')}
              description={t('template.editor.review-button-desc')}
            >
              <Toggle
                checked={editingSections.reviewButton.show}
                onChange={(checked) =>
                  updateSection('reviewButton', { show: checked })
                }
                disabled={!canEdit}
              />
            </SectionRow>
          </div>
        </div>
      </div>
    </div>
  );
};
