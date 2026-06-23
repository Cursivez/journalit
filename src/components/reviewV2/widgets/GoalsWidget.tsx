

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TFile } from 'obsidian';
import JournalitPlugin from '../../../main';
import { InvalidContextMessage } from './InvalidContextMessage';
import { GoalsPreviewData } from '../../../types/reviewV2';
import { SkeletonBox, SkeletonCircle, Tooltip } from '../../shared';
import { t } from '../../../lang/helpers';


const MAX_FRONTMATTER_RETRIES = 5;
const FRONTMATTER_RETRY_DELAY_MS = 150;


type ReviewType =
  | 'drc'
  | 'weekly-review'
  | 'monthly-review'
  | 'quarterly-review'
  | 'yearly-review';


const GOALS_FIELD_MAP: Record<ReviewType, { goals: string; status: string }> = {
  drc: { goals: 'dailyGoals', status: 'dailyGoalStatus' },
  'weekly-review': { goals: 'weeklyGoals', status: 'weeklyGoalStatus' },
  'monthly-review': { goals: 'monthlyGoals', status: 'monthlyGoalStatus' },
  'quarterly-review': {
    goals: 'quarterlyGoals',
    status: 'quarterlyGoalStatus',
  },
  'yearly-review': { goals: 'yearlyGoals', status: 'yearlyGoalStatus' },
};

function isReviewType(value: string): value is ReviewType {
  switch (value) {
    case 'drc':
    case 'weekly-review':
    case 'monthly-review':
    case 'quarterly-review':
    case 'yearly-review':
      return true;
    default:
      return false;
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

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
  if (!isRecord(value)) {
    return {};
  }
  const booleanRecord: Record<string, boolean> = {};
  for (const itemKey in value) {
    const itemValue = value[itemKey];
    if (typeof itemValue === 'boolean') {
      booleanRecord[itemKey] = itemValue;
    }
  }
  return booleanRecord;
};

interface GoalItem {
  text: string;
  checked: boolean;
}

function getReviewItemKeys(items: GoalItem[]): string[] {
  const occurrenceByItem = new Map<string, number>();
  return items.map((item) => {
    const identity = JSON.stringify([item.text, item.checked]);
    const occurrence = occurrenceByItem.get(identity) ?? 0;
    occurrenceByItem.set(identity, occurrence + 1);
    return JSON.stringify([identity, occurrence]);
  });
}

interface GoalsWidgetProps {
  filePath: string;
  plugin: JournalitPlugin;
  
  preview?: boolean;
  
  previewData?: GoalsPreviewData;
}

export const GoalsWidget: React.FC<GoalsWidgetProps> = React.memo(
  ({ filePath, plugin, preview, previewData }) => {
    const [goalsState, setGoalsState] = useState<{
      goals: GoalItem[];
      loading: boolean;
      isValidContext: boolean;
      reviewType: ReviewType | null;
    }>({
      goals: [],
      loading: true,
      isValidContext: true,
      reviewType: null,
    });
    const { goals, loading, isValidContext, reviewType } = goalsState;
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editText, setEditText] = useState('');
    const [newGoalText, setNewGoalText] = useState('');
    const setGoals = (updatedGoals: GoalItem[]) => {
      setGoalsState((current) => ({ ...current, goals: updatedGoals }));
    };
    const editInputRef = useRef<HTMLInputElement>(null);
    const newGoalInputRef = useRef<HTMLInputElement>(null);
    const retryCountRef = useRef(0);
    const isValidContextRef = useRef(true);
    const retryTimeoutRef = useRef<number | null>(null);

    
    const loadGoals = useCallback(async () => {
      const file = plugin.app.vault.getAbstractFileByPath(filePath);
      if (!(file instanceof TFile)) {
        isValidContextRef.current = false;
        setGoalsState((current) => ({
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
          retryTimeoutRef.current = window.setTimeout(
            () => void loadGoals(),
            FRONTMATTER_RETRY_DELAY_MS
          );
          return;
        }
        isValidContextRef.current = false;
        setGoalsState((current) => ({
          ...current,
          isValidContext: false,
          loading: false,
        }));
        return;
      }

      const type = typeof frontmatter.type === 'string' ? frontmatter.type : '';
      if (!isReviewType(type)) {
        isValidContextRef.current = false;
        setGoalsState((current) => ({
          ...current,
          isValidContext: false,
          loading: false,
        }));
        return;
      }

      const validType = type;
      const fieldMap = GOALS_FIELD_MAP[validType];

      
      const goalsArray = getStringArray(frontmatter, fieldMap.goals);
      const goalStatus = getBooleanRecord(frontmatter, fieldMap.status);

      
      const goalItems: GoalItem[] = goalsArray.map((text, index) => ({
        text,
        checked: goalStatus[`goal_${index}`] ?? false,
      }));

      setGoalsState({
        goals: goalItems,
        reviewType: validType,
        isValidContext: true,
        loading: false,
      });
      isValidContextRef.current = true;
    }, [filePath, plugin]);

    useEffect(() => {
      
      if (preview && previewData) {
        setGoalsState({
          goals: previewData.goals,
          reviewType: null,
          loading: false,
          isValidContext: true,
        });
        isValidContextRef.current = true;
        return;
      }

      retryCountRef.current = 0;
      void loadGoals();

      
      
      
      
      const handleMetadataChange = (file: TFile) => {
        if (file.path === filePath) {
          void loadGoals();
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
    }, [filePath, preview, previewData, loadGoals, plugin]);

    useEffect(() => {
      if (editingIndex !== null && editInputRef.current) {
        editInputRef.current.focus();
        editInputRef.current.select();
      }
    }, [editingIndex]);

    const updateFrontmatter = async (updatedGoals: GoalItem[]) => {
      if (!reviewType) return;

      const file = plugin.app.vault.getAbstractFileByPath(filePath);
      if (!(file instanceof TFile)) return;

      const fieldMap = GOALS_FIELD_MAP[reviewType];
      const goalsArray = updatedGoals.map((g) => g.text);
      const goalStatus: Record<string, boolean> = {};
      updatedGoals.forEach((goal, index) => {
        goalStatus[`goal_${index}`] = goal.checked;
      });

      try {
        
        if (reviewType === 'drc') {
          await plugin.drcService.updateDRCFrontmatter(
            filePath,
            {
              dailyGoals: goalsArray,
              dailyGoalStatus: goalStatus,
            },
            'user-input'
          );
        } else {
          
          await plugin.app.fileManager.processFrontMatter(file, (fm) => {
            if (!isRecord(fm)) return;
            const frontmatter = fm;
            frontmatter[fieldMap.goals] = goalsArray;
            frontmatter[fieldMap.status] = goalStatus;
          });
        }
      } catch (error) {
        console.error('[GoalsWidget] Failed to update frontmatter:', error);
      }
    };

    const handleToggleGoal = async (index: number) => {
      if (preview) return; 
      const previousGoals = [...goals];
      const updatedGoals = [...goals];
      updatedGoals[index] = {
        ...updatedGoals[index],
        checked: !updatedGoals[index].checked,
      };
      setGoals(updatedGoals);
      try {
        await updateFrontmatter(updatedGoals);
      } catch (error) {
        
        setGoals(previousGoals);
        console.error('[GoalsWidget] Failed to toggle goal:', error);
      }
    };

    const handleStartEdit = (index: number) => {
      if (preview) return; 
      setEditingIndex(index);
      setEditText(goals[index].text);
    };

    const handleSaveEdit = async () => {
      if (preview) return; 
      if (editingIndex === null) return;

      const trimmedText = editText.trim();
      if (!trimmedText) {
        
        await handleDeleteGoal(editingIndex);
      } else {
        const previousGoals = [...goals];
        const updatedGoals = [...goals];
        updatedGoals[editingIndex] = {
          ...updatedGoals[editingIndex],
          text: trimmedText,
        };
        setGoals(updatedGoals);
        try {
          await updateFrontmatter(updatedGoals);
        } catch (error) {
          
          setGoals(previousGoals);
          console.error('[GoalsWidget] Failed to save edited goal:', error);
          
          return;
        }
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

    const handleDeleteGoal = async (index: number) => {
      if (preview) return; 
      const previousGoals = [...goals];
      const updatedGoals = goals.filter((_, i) => i !== index);
      setGoals(updatedGoals);

      
      if (editingIndex === index) {
        setEditingIndex(null);
        setEditText('');
      }

      try {
        await updateFrontmatter(updatedGoals);
      } catch (error) {
        
        setGoals(previousGoals);
        console.error('[GoalsWidget] Failed to delete goal:', error);
      }
    };

    const handleAddGoal = async () => {
      if (preview) return; 
      const trimmedText = newGoalText.trim();
      if (!trimmedText) return;

      const newGoal: GoalItem = {
        text: trimmedText,
        checked: false,
      };

      const previousGoals = [...goals];
      const updatedGoals = [...goals, newGoal];
      setGoals(updatedGoals);
      setNewGoalText('');

      try {
        await updateFrontmatter(updatedGoals);
      } catch (error) {
        
        setGoals(previousGoals);
        setNewGoalText(trimmedText); 
        console.error('[GoalsWidget] Failed to add goal:', error);
      }

      
      if (newGoalInputRef.current) {
        newGoalInputRef.current.focus();
      }
    };

    const handleNewGoalKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        void handleAddGoal();
      }
    };

    
    const getLabel = () => {
      if (preview) return t('widget.goals.title.default');
      if (!reviewType) return t('widget.goals.title.default');
      switch (reviewType) {
        case 'drc':
          return t('widget.goals.title.daily');
        case 'weekly-review':
          return t('widget.goals.title.weekly');
        case 'monthly-review':
          return t('widget.goals.title.monthly');
        case 'quarterly-review':
          return t('widget.goals.title.quarterly');
        case 'yearly-review':
          return t('widget.goals.title.yearly');
        default:
          return t('widget.goals.title.default');
      }
    };

    
    const getTooltipContent = () => {
      if (!reviewType) return null;
      const typeMap: Record<string, string> = {
        drc: t('widget.goals.tooltip.daily'),
        'weekly-review': t('widget.goals.tooltip.weekly'),
        'monthly-review': t('widget.goals.tooltip.monthly'),
        'quarterly-review': t('widget.goals.tooltip.quarterly'),
        'yearly-review': t('widget.goals.tooltip.yearly'),
      };
      return typeMap[reviewType] || null;
    };

    if (loading) {
      
      const goalCount = 3;
      return (
        <div className="journalit-reviewv2-card-wrapper">
          <div className="journalit-reviewv2-card journalit-reviewv2-card--centered">
            
            <div className="journalit-reviewv2-card-header">
              <SkeletonBox width={90} height={16} borderRadius="4px" />
              <SkeletonBox width={70} height={14} borderRadius="4px" />
            </div>
            
            <div className="journalit-reviewv2-list">
              {Array.from({ length: goalCount }).map((_, i) => (
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
          widgetType="Goals"
          reason={t('widget.goals.invalid-context')}
        />
      );
    }

    const tooltipContent = getTooltipContent();

    const itemKeys = getReviewItemKeys(goals);

    return (
      <div className="journalit-reviewv2-card-wrapper">
        <div className="journalit-reviewv2-card journalit-reviewv2-card--centered">
          <div className="journalit-reviewv2-card-header">
            <div className="journalit-reviewv2-card-title-row">
              <h4 className="journalit-reviewv2-card-title">{getLabel()}</h4>
              {tooltipContent && (
                <Tooltip
                  content={
                    <div className="journalit-reviewv2-tooltip-content">
                      {tooltipContent}
                    </div>
                  }
                  preferredPosition="top"
                >
                  <span className="journalit-reviewv2-tooltip-icon">?</span>
                </Tooltip>
              )}
            </div>
            <span className="journalit-reviewv2-card-subtitle">
              {t('widget.goals.completed', {
                completed: goals.filter((g) => g.checked).length.toString(),
                total: goals.length.toString(),
              })}
            </span>
          </div>

          
          <div className="journalit-reviewv2-list">
            {goals.map((goal, index) => (
              <div
                key={itemKeys[index]}
                className="journalit-reviewv2-list-item"
              >
                
                <input
                  type="checkbox"
                  checked={goal.checked}
                  onChange={() => void handleToggleGoal(index)}
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
                      onClick={() => setEditingIndex(null)}
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
                    onClick={() => void handleToggleGoal(index)}
                    onKeyDown={(e) => {
                      if (e.key !== 'Enter' && e.key !== ' ') return;
                      e.preventDefault();
                      void handleToggleGoal(index);
                    }}
                    className={`journalit-reviewv2-item-text ${
                      goal.checked
                        ? 'journalit-reviewv2-item-text--completed'
                        : ''
                    }`}
                  >
                    {goal.text}
                  </span>
                )}

                
                {!preview && editingIndex !== index && (
                  <>
                    <button
                      onClick={() => void handleStartEdit(index)}
                      aria-label={t('widget.goals.aria.edit')}
                      className="journalit-reviewv2-icon-button"
                    >
                      {t('button.edit')}
                    </button>
                    <button
                      onClick={() => void handleDeleteGoal(index)}
                      aria-label={t('widget.goals.aria.delete')}
                      className="journalit-reviewv2-icon-button journalit-reviewv2-icon-button--delete"
                    >
                      ×
                    </button>
                  </>
                )}
              </div>
            ))}

            
            {goals.length === 0 && (
              <div className="journalit-reviewv2-empty">
                {preview
                  ? t('widget.goals.empty.preview')
                  : t('widget.goals.empty.default')}
              </div>
            )}

            
            {!preview && (
              <div className="journalit-reviewv2-add-row">
                <input
                  ref={newGoalInputRef}
                  type="text"
                  value={newGoalText}
                  onChange={(e) => setNewGoalText(e.target.value)}
                  onKeyDown={handleNewGoalKeyDown}
                  placeholder={t('widget.goals.placeholder')}
                  className="journalit-reviewv2-add-input"
                />
                <button
                  onClick={() => void handleAddGoal()}
                  disabled={!newGoalText.trim()}
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

GoalsWidget.displayName = 'GoalsWidget';
