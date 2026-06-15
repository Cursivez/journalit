

import React, { useEffect, useRef, useState } from 'react';
import { Notice } from 'obsidian';
import {
  ArrowUp,
  ArrowDown,
  Check,
  Edit,
  Trash,
  X,
} from '../../../components/shared/icons/ObsidianIcon';
import { Input } from '../../../components/core/Input';
import { Button } from '../../../components/ui';
import JournalitPlugin from '../../../main';
import { eventBus } from '../../../services/events';
import { t } from '../../../lang/helpers';

interface ItemManagerProps {
  plugin: JournalitPlugin;
  items: string[];
  defaultItems: string[];
  settingsPath: string; 
  placeholder: string;
  onItemsChange?: (items: string[]) => void;
  settingsEventComponent?: string; 
}

function getDuplicateAwareItemKeys(items: string[]): string[] {
  const occurrenceByItem = new Map<string, number>();
  return items.map((item) => {
    const occurrence = occurrenceByItem.get(item) ?? 0;
    occurrenceByItem.set(item, occurrence + 1);
    return JSON.stringify([item, occurrence]);
  });
}

function isMutableObject(value: unknown): value is object {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function useItemManagerModel({
  plugin,
  items,
  defaultItems,
  settingsPath,
  onItemsChange,
  settingsEventComponent,
}: Omit<ItemManagerProps, 'placeholder'>) {
  const [newItem, setNewItem] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const isSavingRef = useRef(false);

  const isComposingKeyEvent = (event: React.KeyboardEvent<HTMLInputElement>) =>
    event.nativeEvent.isComposing || event.key === 'Process';

  useEffect(() => {
    if (editingIndex !== null && editingIndex >= items.length) {
      setEditingIndex(null);
      setEditingValue('');
    }
  }, [editingIndex, items.length]);

  
  const updateNestedSettings = (path: string, value: unknown) => {
    const parts = path.split('.');
    const settings = { ...plugin.settings };

    let current: object = settings;

    
    for (let i = 0; i < parts.length - 1; i++) {
      const key = parts[i];
      const next: unknown = Reflect.get(current, key);
      if (!isMutableObject(next)) {
        const child = {};
        Reflect.set(current, key, child);
        current = child;
        continue;
      }

      current = next;
    }

    
    Reflect.set(current, parts[parts.length - 1], value);

    return settings;
  };

  
  const saveSettingsAndNotify = async (updatedItems: string[]) => {
    
    const newSettings = updateNestedSettings(settingsPath, updatedItems);
    plugin.settings = newSettings;

    await plugin.saveSettings();

    
    if (settingsEventComponent) {
      eventBus.publish('settings:changed', {
        component: settingsEventComponent,
        settings:
          settingsPath.split('.')[0] === settingsEventComponent
            ? plugin.settings[settingsEventComponent]
            : plugin.settings,
      });
    }

    
    if (onItemsChange) {
      onItemsChange(updatedItems);
    }
  };

  const runWithSaveLock = async (operation: () => Promise<void>) => {
    if (isSavingRef.current) {
      return;
    }

    isSavingRef.current = true;
    setIsSaving(true);

    try {
      await operation();
    } finally {
      isSavingRef.current = false;
      setIsSaving(false);
    }
  };

  const clearEditState = () => {
    setEditingIndex(null);
    setEditingValue('');
  };

  
  const addItem = async () => {
    const trimmedValue = newItem.trim();
    if (!trimmedValue) return;

    await runWithSaveLock(async () => {
      const updatedItems = [...items, trimmedValue];
      await saveSettingsAndNotify(updatedItems);
      setNewItem('');
    });
  };

  
  const startEditing = (index: number) => {
    if (isSaving) {
      return;
    }

    setEditingIndex(index);
    setEditingValue(items[index] ?? '');
  };

  
  const saveEditedItem = async () => {
    if (editingIndex === null) return;

    const trimmedValue = editingValue.trim();
    if (!trimmedValue) return;

    if (items[editingIndex] === trimmedValue) {
      clearEditState();
      return;
    }

    await runWithSaveLock(async () => {
      const updatedItems = [...items];
      updatedItems[editingIndex] = trimmedValue;

      await saveSettingsAndNotify(updatedItems);
      clearEditState();
    });
  };

  
  const removeItem = async (index: number) => {
    await runWithSaveLock(async () => {
      const updatedItems = [...items];
      updatedItems.splice(index, 1);

      let nextEditingIndex = editingIndex;
      let shouldClearEditState = false;

      if (editingIndex !== null) {
        if (editingIndex === index) {
          nextEditingIndex = null;
          shouldClearEditState = true;
        } else if (editingIndex > index) {
          nextEditingIndex = editingIndex - 1;
        }
      }

      await saveSettingsAndNotify(updatedItems);

      if (shouldClearEditState) {
        clearEditState();
      } else if (
        nextEditingIndex !== null &&
        editingIndex !== null &&
        nextEditingIndex !== editingIndex
      ) {
        setEditingIndex(nextEditingIndex);
      }
    });
  };

  
  const moveItem = async (index: number, direction: 'up' | 'down') => {
    await runWithSaveLock(async () => {
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= items.length) return;

      const updatedItems = [...items];
      [updatedItems[index], updatedItems[targetIndex]] = [
        updatedItems[targetIndex],
        updatedItems[index],
      ];

      let nextEditingIndex = editingIndex;

      if (editingIndex !== null) {
        if (editingIndex === index) {
          nextEditingIndex = targetIndex;
        } else if (editingIndex === targetIndex) {
          nextEditingIndex = index;
        }
      }

      await saveSettingsAndNotify(updatedItems);

      if (
        nextEditingIndex !== null &&
        editingIndex !== null &&
        nextEditingIndex !== editingIndex
      ) {
        setEditingIndex(nextEditingIndex);
      }
    });
  };

  
  const resetToDefaults = async () => {
    await runWithSaveLock(async () => {
      await saveSettingsAndNotify([...defaultItems]);
      clearEditState();
      new Notice(t('notice.reset-items'));
    });
  };

  return {
    newItem,
    setNewItem,
    editingIndex,
    editingValue,
    setEditingValue,
    isSaving,
    isComposingKeyEvent,
    addItem,
    startEditing,
    saveEditedItem,
    removeItem,
    moveItem,
    resetToDefaults,
    clearEditState,
  };
}

export const ItemManager: React.FC<ItemManagerProps> = (props) => {
  const { items, placeholder } = props;
  const {
    newItem,
    setNewItem,
    editingIndex,
    editingValue,
    setEditingValue,
    isSaving,
    isComposingKeyEvent,
    addItem,
    startEditing,
    saveEditedItem,
    removeItem,
    moveItem,
    resetToDefaults,
    clearEditState,
  } = useItemManagerModel(props);
  const itemKeys = getDuplicateAwareItemKeys(items);

  return (
    <div className="item-manager">
      <div className="setting-item">
        <div className="setting-item-info">
          <div className="setting-item-control">
            <Button
              onClick={resetToDefaults}
              variant="secondary"
              disabled={isSaving}
            >
              {t('button.reset-to-defaults')}
            </Button>
          </div>
        </div>
      </div>

      {items.map((item, index) => {
        const isEditingCurrentItem = editingIndex === index;

        return (
          <div key={itemKeys[index]} className="setting-item custom-item">
            <div className="setting-item-info">
              {isEditingCurrentItem ? (
                <Input
                  value={editingValue}
                  onChange={(value: string) => setEditingValue(value)}
                  placeholder={placeholder}
                  disabled={isSaving}
                  onKeyDown={(event) => {
                    if (isSaving || isComposingKeyEvent(event)) {
                      return;
                    }

                    if (event.key === 'Enter') {
                      event.preventDefault();
                      void saveEditedItem();
                    }

                    if (event.key === 'Escape') {
                      event.preventDefault();
                      clearEditState();
                    }
                  }}
                />
              ) : (
                <div className="setting-item-name">{item}</div>
              )}
            </div>
            <div className="setting-item-control">
              <div className="item-manager-item-actions">
                {isEditingCurrentItem ? (
                  <>
                    <Button
                      onClick={() => void saveEditedItem()}
                      size="sm"
                      disabled={isSaving}
                      className="item-manager-icon-button"
                      aria-label={t('button.save')}
                    >
                      <Check size={14} aria-hidden="true" />
                    </Button>
                    <Button
                      onClick={clearEditState}
                      variant="secondary"
                      size="sm"
                      disabled={isSaving}
                      className="item-manager-icon-button"
                      aria-label={t('button.cancel')}
                    >
                      <X size={14} aria-hidden="true" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={() => void moveItem(index, 'up')}
                      disabled={isSaving || index === 0}
                      size="sm"
                      className="item-manager-move-button"
                      aria-label={t('button.move-up')}
                    >
                      <ArrowUp size={14} aria-hidden="true" />
                    </Button>
                    <Button
                      onClick={() => void moveItem(index, 'down')}
                      disabled={isSaving || index === items.length - 1}
                      size="sm"
                      className="item-manager-move-button"
                      aria-label={t('button.move-down')}
                    >
                      <ArrowDown size={14} aria-hidden="true" />
                    </Button>
                    <Button
                      onClick={() => startEditing(index)}
                      size="sm"
                      disabled={isSaving}
                      className="item-manager-icon-button"
                      aria-label={t('button.edit')}
                    >
                      <Edit size={14} aria-hidden="true" />
                    </Button>
                    <Button
                      onClick={() => void removeItem(index)}
                      size="sm"
                      disabled={isSaving}
                      className="item-manager-icon-button"
                      aria-label={t('button.remove')}
                    >
                      <Trash size={14} aria-hidden="true" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}

      <div className="setting-item custom-item-add">
        <div className="setting-item-info">
          <Input
            value={newItem}
            onChange={(value: string) => setNewItem(value)}
            placeholder={placeholder}
            disabled={isSaving}
            onKeyDown={(event) => {
              if (isSaving || isComposingKeyEvent(event)) {
                return;
              }

              if (event.key === 'Enter') {
                event.preventDefault();
                void addItem();
              }
            }}
          />
        </div>
        <div className="setting-item-control">
          <Button
            onClick={() => void addItem()}
            disabled={isSaving || !newItem.trim()}
          >
            {t('button.add')}
          </Button>
        </div>
      </div>
    </div>
  );
};
