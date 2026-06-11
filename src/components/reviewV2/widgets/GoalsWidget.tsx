

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


const SUPPORTED_TYPES: ReviewType[] = Object.keys(
  GOALS_FIELD_MAP
) as ReviewType[];

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
    const [goals, setGoals] = useState<GoalItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editText, setEditText] = useState('');
    const [newGoalText, setNewGoalText] = useState('');
    const [isValidContext, setIsValidContext] = useState(true);
    const [reviewType, setReviewType] = useState<ReviewType | null>(null);
    const editInputRef = useRef<HTMLInputElement>(null);
    const newGoalInputRef = useRef<HTMLInputElement>(null);
    const retryCountRef = useRef(0);
    const isValidContextRef = useRef(true);
    const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    
    const loadGoals = useCallback(async () => {
      const file = plugin.app.vault.getAbstractFileByPath(filePath);
      if (!(file instanceof TFile)) {
        setIsValidContext(false);
        isValidContextRef.current = false;
        setLoading(false);
        return;
      }

      const cache = plugin.app.metadataCache.getFileCache(file);
      const frontmatter = cache?.frontmatter;

      if (!frontmatter) {
        
        if (retryCountRef.current < MAX_FRONTMATTER_RETRIES) {
          retryCountRef.current++;
          if (retryTimeoutRef.current !== null) {
            clearTimeout(retryTimeoutRef.current);
          }
          retryTimeoutRef.current = setTimeout(
            () => loadGoals(),
            FRONTMATTER_RETRY_DELAY_MS
          );
          return;
        }
        setIsValidContext(false);
        isValidContextRef.current = false;
        setLoading(false);
        return;
      }

      const type = frontmatter.type as string;
      if (!SUPPORTED_TYPES.includes(type as ReviewType)) {
        setIsValidContext(false);
        isValidContextRef.current = false;
        setLoading(false);
        return;
      }

      
      const validType = type as ReviewType;
      setReviewType(validType);
      const fieldMap = GOALS_FIELD_MAP[validType];

      
      const goalsArray: string[] = frontmatter[fieldMap.goals] || [];
      const goalStatus: Record<string, boolean> =
        frontmatter[fieldMap.status] || {};

      
      const goalItems: GoalItem[] = goalsArray.map((text, index) => ({
        text,
        checked: goalStatus[`goal_${index}`] ?? false,
      }));

      setGoals(goalItems);
      setIsValidContext(true);
      isValidContextRef.current = true;
      setLoading(false);
    }, [filePath, plugin]);

    useEffect(() => {
      
      if (preview && previewData) {
        setGoals(previewData.goals);
        setLoading(false);
        setIsValidContext(true);
        isValidContextRef.current = true;
        return;
      }

      retryCountRef.current = 0;
      loadGoals();

      
      
      
      
      const handleMetadataChange = (file: TFile) => {
        if (file.path === filePath) {
          loadGoals();
        }
      };

      plugin.app.metadataCache.on('changed', handleMetadataChange);

      return () => {
        plugin.app.metadataCache.off('changed', handleMetadataChange);
        if (retryTimeoutRef.current !== null) {
          clearTimeout(retryTimeoutRef.current);
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
            fm[fieldMap.goals] = goalsArray;
            fm[fieldMap.status] = goalStatus;
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
        handleSaveEdit();
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
        handleAddGoal();
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
                  onChange={() => handleToggleGoal(index)}
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
                      onClick={handleSaveEdit}
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
                    onClick={() => handleToggleGoal(index)}
                    onKeyDown={(e) => {
                      if (e.key !== 'Enter' && e.key !== ' ') return;
                      e.preventDefault();
                      handleToggleGoal(index);
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
                      onClick={() => handleStartEdit(index)}
                      aria-label={t('widget.goals.aria.edit')}
                      className="journalit-reviewv2-icon-button"
                    >
                      {t('button.edit')}
                    </button>
                    <button
                      onClick={() => handleDeleteGoal(index)}
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
                  onClick={handleAddGoal}
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
