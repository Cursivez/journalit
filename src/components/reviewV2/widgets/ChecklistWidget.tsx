

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TFile } from 'obsidian';
import JournalitPlugin from '../../../main';
import { InvalidContextMessage } from './InvalidContextMessage';
import { ChecklistPreviewData } from '../../../types/reviewV2';
import { SkeletonBox, SkeletonCircle, Tooltip } from '../../shared';
import { t } from '../../../lang/helpers';


const MAX_FRONTMATTER_RETRIES = 5;
const FRONTMATTER_RETRY_DELAY_MS = 150;

interface ChecklistItem {
  text: string;
  checked: boolean;
}

function getReviewItemKeys(items: ChecklistItem[]): string[] {
  const occurrenceByItem = new Map<string, number>();
  return items.map((item) => {
    const identity = JSON.stringify([item.text, item.checked]);
    const occurrence = occurrenceByItem.get(identity) ?? 0;
    occurrenceByItem.set(identity, occurrence + 1);
    return JSON.stringify([identity, occurrence]);
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function getChecklistReviewType(
  value: unknown
): 'drc' | 'weekly-review' | null {
  if (value === 'drc') return 'drc';
  if (value === 'weekly-review') return 'weekly-review';
  return null;
}

const getStringArray = (
  record: Record<string, unknown>,
  key: string
): string[] => {
  const value = record[key];
  if (!Array.isArray(value)) return [];
  const strings: string[] = [];
  for (const item of value) {
    if (typeof item === 'string') strings.push(item);
  }
  return strings;
};

const getBooleanRecord = (
  record: Record<string, unknown>,
  key: string
): Record<string, boolean> => {
  const value = record[key];
  if (!isRecord(value)) return {};
  const booleanRecord: Record<string, boolean> = {};
  for (const itemKey in value) {
    const itemValue = value[itemKey];
    if (typeof itemValue === 'boolean') {
      booleanRecord[itemKey] = itemValue;
    }
  }
  return booleanRecord;
};

interface ChecklistWidgetProps {
  filePath: string;
  plugin: JournalitPlugin;
  
  preview?: boolean;
  
  previewData?: ChecklistPreviewData;
  
  previewReviewType?: 'drc' | 'weekly-review';
}

export const ChecklistWidget: React.FC<ChecklistWidgetProps> = React.memo(
  ({ filePath, plugin, preview, previewData, previewReviewType }) => {
    const [checklistState, setChecklistState] = useState<{
      items: ChecklistItem[];
      loading: boolean;
      isValidContext: boolean;
      reviewType: 'drc' | 'weekly-review' | null;
    }>({
      items: [],
      loading: true,
      isValidContext: true,
      reviewType: null,
    });
    const { items, loading, isValidContext, reviewType } = checklistState;
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editText, setEditText] = useState('');
    const [newItemText, setNewItemText] = useState('');
    const setItems = (updatedItems: ChecklistItem[]) => {
      setChecklistState((current) => ({ ...current, items: updatedItems }));
    };
    const editInputRef = useRef<HTMLInputElement>(null);
    const newItemInputRef = useRef<HTMLInputElement>(null);
    const retryCountRef = useRef(0);
    const isValidContextRef = useRef(isValidContext);
    const retryTimeoutRef = useRef<number | null>(null);

    
    useEffect(() => {
      isValidContextRef.current = isValidContext;
    }, [isValidContext]);

    const loadChecklist = useCallback(async () => {
      const file = plugin.app.vault.getAbstractFileByPath(filePath);
      if (!(file instanceof TFile)) {
        setChecklistState((current) => ({
          ...current,
          isValidContext: false,
          loading: false,
        }));
        return;
      }

      const cache = plugin.app.metadataCache.getFileCache(file);
      const frontmatter = cache?.frontmatter;

      if (!isRecord(frontmatter)) {
        
        if (retryCountRef.current < MAX_FRONTMATTER_RETRIES) {
          retryCountRef.current++;
          if (retryTimeoutRef.current !== null) {
            window.clearTimeout(retryTimeoutRef.current);
          }
          retryTimeoutRef.current = window.setTimeout(() => {
            void loadChecklist();
          }, FRONTMATTER_RETRY_DELAY_MS);
          return;
        }
        setChecklistState((current) => ({
          ...current,
          isValidContext: false,
          loading: false,
        }));
        return;
      }

      const nextReviewType = getChecklistReviewType(frontmatter.type);
      if (!nextReviewType) {
        setChecklistState((current) => ({
          ...current,
          isValidContext: false,
          loading: false,
        }));
        return;
      }

      
      const checklistItems = getStringArray(frontmatter, 'checklistItems');
      const checklistStatus = getBooleanRecord(frontmatter, 'checklistStatus');

      
      const checklistData: ChecklistItem[] = checklistItems.map(
        (text, index) => ({
          text,
          checked: checklistStatus[`item_${index}`] ?? false,
        })
      );

      setChecklistState({
        items: checklistData,
        reviewType: nextReviewType,
        isValidContext: true,
        loading: false,
      });
    }, [filePath, plugin.app.metadataCache, plugin.app.vault]);

    useEffect(() => {
      
      if (preview && previewData) {
        setChecklistState({
          items: previewData.items,
          reviewType: previewReviewType ?? 'drc',
          loading: false,
          isValidContext: true,
        });
        return;
      }

      retryCountRef.current = 0;
      void loadChecklist();

      
      
      
      
      const handleMetadataChange = (file: TFile) => {
        if (file.path === filePath) {
          void loadChecklist();
        }
      };

      plugin.app.metadataCache.on('changed', handleMetadataChange);

      return () => {
        plugin.app.metadataCache.off('changed', handleMetadataChange);
        if (retryTimeoutRef.current !== null) {
          window.clearTimeout(retryTimeoutRef.current);
          retryTimeoutRef.current = null;
        }
      };
    }, [
      filePath,
      preview,
      previewData,
      previewReviewType,
      loadChecklist,
      plugin.app.metadataCache,
    ]);

    useEffect(() => {
      if (editingIndex !== null && editInputRef.current) {
        editInputRef.current.focus();
        editInputRef.current.select();
      }
    }, [editingIndex]);

    const updateFrontmatter = async (updatedItems: ChecklistItem[]) => {
      const file = plugin.app.vault.getAbstractFileByPath(filePath);
      if (!(file instanceof TFile)) return;

      const checklistItems = updatedItems.map((item) => item.text);
      const checklistStatus: Record<string, boolean> = {};
      updatedItems.forEach((item, index) => {
        checklistStatus[`item_${index}`] = item.checked;
      });

      try {
        if (reviewType === 'weekly-review') {
          const weeklyReviewService = plugin.serviceManager
            ? await plugin.serviceManager.getWeeklyReviewService()
            : plugin.weeklyReviewService;

          if (!weeklyReviewService) {
            console.warn(
              '[ChecklistWidget] Weekly review service not available'
            );
            return;
          }

          await weeklyReviewService.updateWeeklyReviewFrontmatter(filePath, {
            checklistItems,
            checklistStatus,
          });
        } else {
          await plugin.drcService.updateDRCFrontmatter(
            filePath,
            {
              checklistItems,
              checklistStatus,
            },
            'user-input'
          );
        }
      } catch (error) {
        console.error('[ChecklistWidget] Failed to update frontmatter:', error);
      }
    };

    const handleToggleItem = async (index: number) => {
      if (preview) return; 
      const updatedItems = [...items];
      updatedItems[index] = {
        ...updatedItems[index],
        checked: !updatedItems[index].checked,
      };
      setItems(updatedItems);
      await updateFrontmatter(updatedItems);
    };

    const handleStartEdit = (index: number) => {
      if (preview) return; 
      setEditingIndex(index);
      setEditText(items[index].text);
    };

    const handleSaveEdit = async () => {
      if (preview) return; 
      if (editingIndex === null) return;

      const trimmedText = editText.trim();
      if (!trimmedText) {
        
        await handleDeleteItem(editingIndex);
      } else {
        const updatedItems = [...items];
        updatedItems[editingIndex] = {
          ...updatedItems[editingIndex],
          text: trimmedText,
        };
        setItems(updatedItems);
        await updateFrontmatter(updatedItems);
      }

      setEditingIndex(null);
      setEditText('');
    };

    const handleCancelEdit = () => {
      setEditingIndex(null);
      setEditText('');
    };

    const handleEditKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        void handleSaveEdit();
      } else if (e.key === 'Escape') {
        handleCancelEdit();
      }
    };

    const handleDeleteItem = async (index: number) => {
      if (preview) return; 
      const updatedItems = items.filter((_, i) => i !== index);
      setItems(updatedItems);
      await updateFrontmatter(updatedItems);

      
      if (editingIndex === index) {
        setEditingIndex(null);
        setEditText('');
      }
    };

    const handleAddItem = async () => {
      if (preview) return; 
      const trimmedText = newItemText.trim();
      if (!trimmedText) return;

      const newItem: ChecklistItem = {
        text: trimmedText,
        checked: false,
      };

      const updatedItems = [...items, newItem];
      setItems(updatedItems);
      setNewItemText('');
      await updateFrontmatter(updatedItems);

      
      if (newItemInputRef.current) {
        newItemInputRef.current.focus();
      }
    };

    const handleNewItemKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        void handleAddItem();
      }
    };

    if (loading) {
      
      const itemCount = 3;
      return (
        <div className="journalit-reviewv2-card-wrapper">
          <div className="journalit-reviewv2-card journalit-reviewv2-card--centered">
            
            <div className="journalit-reviewv2-card-header">
              <SkeletonBox width={130} height={16} borderRadius="4px" />
              <SkeletonBox width={70} height={14} borderRadius="4px" />
            </div>
            
            <div className="journalit-reviewv2-list">
              {Array.from({ length: itemCount }).map((_, i) => (
                <div key={i} className="journalit-reviewv2-list-item">
                  <SkeletonCircle size={16} />
                  <SkeletonBox
                    width={`${60 + ((i * 15) % 30)}%`}
                    height={14}
                    borderRadius="4px"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (!isValidContext) {
      return (
        <InvalidContextMessage
          widgetType={t('widget.checklist.title')}
          reason={t('widget.checklist.invalid-context')}
        />
      );
    }

    const isWeekly = reviewType === 'weekly-review';
    const title = isWeekly
      ? t('widget.checklist.weekly-title')
      : t('widget.checklist.title');
    const tooltipMain = isWeekly
      ? t('widget.checklist.tooltip.weekly')
      : t('widget.checklist.tooltip.day-only');
    const tooltipSubtext = isWeekly
      ? t('widget.checklist.tooltip.weekly-settings-link')
      : t('widget.checklist.tooltip.settings-link');

    const itemKeys = getReviewItemKeys(items);

    return (
      <div className="journalit-reviewv2-card-wrapper">
        <div className="journalit-reviewv2-card journalit-reviewv2-card--centered">
          <div className="journalit-reviewv2-card-header">
            <div className="journalit-reviewv2-card-title-row">
              <h4 className="journalit-reviewv2-card-title">{title}</h4>
              <Tooltip
                content={
                  <div className="journalit-reviewv2-tooltip-content">
                    <div>{tooltipMain}</div>
                    <div className="journalit-reviewv2-tooltip-subtext">
                      {tooltipSubtext}
                    </div>
                  </div>
                }
                preferredPosition="top"
              >
                <span className="journalit-reviewv2-tooltip-icon">ⓘ</span>
              </Tooltip>
            </div>
            <span className="journalit-reviewv2-card-subtitle">
              {items.filter((item) => item.checked).length}/{items.length}{' '}
              {t('widget.checklist.completed')}
            </span>
          </div>

          
          <div className="journalit-reviewv2-list">
            {items.map((item, index) => (
              <div
                key={itemKeys[index]}
                className="journalit-reviewv2-list-item"
              >
                
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => void handleToggleItem(index)}
                  disabled={preview}
                  className="journalit-reviewv2-checkbox"
                />

                
                {editingIndex === index ? (
                  <>
                    <input
                      ref={editInputRef}
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={handleEditKeyDown}
                      className="journalit-reviewv2-edit-input"
                    />
                    <button
                      onClick={() => void handleSaveEdit()}
                      aria-label={t('button.save')}
                      className="journalit-reviewv2-action-button journalit-reviewv2-action-button--primary"
                    >
                      {t('button.save')}
                    </button>
                    <button
                      onClick={() => void handleCancelEdit()}
                      aria-label={t('button.cancel')}
                      className="journalit-reviewv2-action-button journalit-reviewv2-action-button--secondary"
                    >
                      {t('button.cancel')}
                    </button>
                  </>
                ) : (
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={() => void handleToggleItem(index)}
                    onKeyDown={(e) => {
                      if (e.key !== 'Enter' && e.key !== ' ') return;
                      e.preventDefault();
                      void handleToggleItem(index);
                    }}
                    className={`journalit-reviewv2-item-text ${
                      item.checked
                        ? 'journalit-reviewv2-item-text--completed'
                        : ''
                    }`}
                  >
                    {item.text}
                  </span>
                )}

                
                {!preview && editingIndex !== index && (
                  <>
                    <button
                      onClick={() => void handleStartEdit(index)}
                      aria-label={t('widget.checklist.edit-item')}
                      className="journalit-reviewv2-icon-button"
                    >
                      {t('button.edit')}
                    </button>
                    <button
                      onClick={() => void handleDeleteItem(index)}
                      aria-label={t('widget.checklist.delete-item')}
                      className="journalit-reviewv2-icon-button journalit-reviewv2-icon-button--delete"
                    >
                      ×
                    </button>
                  </>
                )}
              </div>
            ))}

            
            {items.length === 0 && (
              <div className="journalit-reviewv2-empty">
                {preview
                  ? t('widget.checklist.empty.preview')
                  : t('widget.checklist.empty.add-one')}
              </div>
            )}

            
            {!preview && (
              <div className="journalit-reviewv2-add-row">
                <input
                  ref={newItemInputRef}
                  type="text"
                  value={newItemText}
                  onChange={(e) => setNewItemText(e.target.value)}
                  onKeyDown={handleNewItemKeyDown}
                  placeholder={t('widget.checklist.placeholder')}
                  className="journalit-reviewv2-add-input"
                />
                <button
                  onClick={() => void handleAddItem()}
                  disabled={!newItemText.trim()}
                  className="journalit-reviewv2-add-button"
                >
                  {t('button.add')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

ChecklistWidget.displayName = 'ChecklistWidget';
