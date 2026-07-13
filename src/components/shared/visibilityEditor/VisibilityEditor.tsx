

import React, { useMemo, useState } from 'react';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { dndKitStyle } from '../../../styles/inlineStylePolicy';
import {
  ChevronDown,
  ChevronRight,
  GripVertical,
  Lock,
  Plus,
} from '../icons/ObsidianIcon';

export type VisibilityEditorTab = 'active' | 'available';

export interface VisibilityEditorItem {
  id: string;
  label: string;
  category: string;
  description?: React.ReactNode;
  locked?: boolean;
  reorderable?: boolean;
}

export interface VisibilityEditorCategory {
  id: string;
  label: string;
}

interface VisibilityEditorProps {
  activeItems: VisibilityEditorItem[];
  availableItems: VisibilityEditorItem[];
  categories: VisibilityEditorCategory[];
  activeTab: VisibilityEditorTab;
  onActiveTabChange: (tab: VisibilityEditorTab) => void;
  activeTabLabel: string;
  availableTabLabel: string;
  activeDescription: string;
  availableDescription: string;
  emptyActiveText: string;
  emptyAvailableText: string;
  getAddAriaLabel: (itemLabel: string) => string;
  getRemoveAriaLabel: (itemLabel: string) => string;
  onReorder: (activeId: string, overId: string) => void;
  onAdd: (itemId: string) => void;
  onRemove: (itemId: string) => void;
  canRemoveItem?: (item: VisibilityEditorItem) => boolean;
  groupActiveByCategory?: boolean;
  className?: string;
}

export const VisibilityEditor: React.FC<VisibilityEditorProps> = ({
  activeItems,
  availableItems,
  categories,
  activeTab,
  onActiveTabChange,
  activeTabLabel,
  availableTabLabel,
  activeDescription,
  availableDescription,
  emptyActiveText,
  emptyAvailableText,
  getAddAriaLabel,
  getRemoveAriaLabel,
  onReorder,
  onAdd,
  onRemove,
  canRemoveItem = (item) => !item.locked,
  groupActiveByCategory = false,
  className = '',
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    () => new Set(categories.map((category) => category.id))
  );

  const availableByCategory = useMemo(() => {
    const grouped = new Map<string, VisibilityEditorItem[]>();
    for (const category of categories) {
      grouped.set(category.id, []);
    }

    for (const item of availableItems) {
      const categoryItems = grouped.get(item.category);
      if (categoryItems) {
        categoryItems.push(item);
      }
    }

    return grouped;
  }, [availableItems, categories]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((previous) => {
      const next = new Set(previous);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  return (
    <div className={`journalit-visibility-editor ${className}`.trim()}>
      <nav className="journalit-tab-nav">
        <div className="journalit-tab-wrapper">
          <button
            type="button"
            className={`journalit-tab-button ${activeTab === 'active' ? 'journalit-tab-active' : ''}`}
            onClick={() => onActiveTabChange('active')}
          >
            {activeTabLabel}
            <span className="journalit-tab-count">{activeItems.length}</span>
          </button>
          <button
            type="button"
            className={`journalit-tab-button ${activeTab === 'available' ? 'journalit-tab-active' : ''}`}
            onClick={() => onActiveTabChange('available')}
          >
            {availableTabLabel}
            <span className="journalit-tab-count">{availableItems.length}</span>
          </button>
        </div>
      </nav>

      <div className="journalit-visibility-editor__content">
        {activeTab === 'active' ? (
          <div className="journalit-visibility-editor__panel">
            <div className="journalit-visibility-editor__description">
              {activeDescription}
            </div>
            <ActiveVisibilityItems
              items={activeItems}
              categories={categories}
              groupByCategory={groupActiveByCategory}
              onReorder={onReorder}
              onRemove={onRemove}
              canRemoveItem={canRemoveItem}
              getRemoveAriaLabel={getRemoveAriaLabel}
            />
            {activeItems.length === 0 && (
              <div className="journalit-visibility-editor__empty">
                {emptyActiveText}
              </div>
            )}
          </div>
        ) : (
          <div className="journalit-visibility-editor__panel journalit-visibility-editor__panel--available">
            <div className="journalit-visibility-editor__description">
              {availableDescription}
            </div>
            {categories.map((category) => {
              const categoryItems = availableByCategory.get(category.id) ?? [];
              if (categoryItems.length === 0) return null;

              const isExpanded = expandedCategories.has(category.id);

              return (
                <div
                  key={category.id}
                  className="journalit-visibility-editor__category"
                >
                  <button
                    type="button"
                    className="journalit-visibility-editor__category-header"
                    onClick={() => toggleCategory(category.id)}
                  >
                    {isExpanded ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                    <span className="journalit-visibility-editor__category-label">
                      {category.label}
                    </span>
                    <span className="journalit-visibility-editor__category-count">
                      {categoryItems.length}
                    </span>
                  </button>
                  {isExpanded && (
                    <div className="journalit-visibility-editor__available-list">
                      {categoryItems.map((item) => (
                        <AvailableVisibilityItem
                          key={item.id}
                          item={item}
                          onAdd={onAdd}
                          addAriaLabel={getAddAriaLabel(item.label)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            {availableItems.length === 0 && (
              <div className="journalit-visibility-editor__empty">
                {emptyAvailableText}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

VisibilityEditor.displayName = 'VisibilityEditor';

interface ActiveVisibilityItemsProps {
  items: VisibilityEditorItem[];
  categories: VisibilityEditorCategory[];
  groupByCategory: boolean;
  onReorder: (activeId: string, overId: string) => void;
  onRemove: (itemId: string) => void;
  canRemoveItem: (item: VisibilityEditorItem) => boolean;
  getRemoveAriaLabel: (itemLabel: string) => string;
}

export const resolveVisibilityEditorReorderTarget = (
  items: VisibilityEditorItem[],
  activeId: string,
  overId: string
): string => {
  const overItem = items.find((item) => item.id === overId);
  if (!overItem || overItem.reorderable !== false) {
    return overId;
  }

  const overIndex = items.findIndex((item) => item.id === overId);
  const sameCategoryItems = items.filter(
    (item) => item.category === overItem.category
  );
  const sameCategoryOverIndex = sameCategoryItems.findIndex(
    (item) => item.id === overId
  );

  const nextReorderableItem = sameCategoryItems
    .slice(sameCategoryOverIndex + 1)
    .find((item) => item.id !== activeId && item.reorderable !== false);
  if (nextReorderableItem) {
    return nextReorderableItem.id;
  }

  const previousReorderableItem = sameCategoryItems
    .slice(0, sameCategoryOverIndex)
    .reverse()
    .find((item) => item.id !== activeId && item.reorderable !== false);

  if (previousReorderableItem) {
    return previousReorderableItem.id;
  }

  const nextGlobalReorderableItem = items
    .slice(overIndex + 1)
    .find((item) => item.id !== activeId && item.reorderable !== false);

  return nextGlobalReorderableItem?.id ?? overId;
};

const ActiveVisibilityItems: React.FC<ActiveVisibilityItemsProps> = React.memo(
  ({
    items,
    categories,
    groupByCategory,
    onReorder,
    onRemove,
    canRemoveItem,
    getRemoveAriaLabel,
  }) => {
    const handleDragEnd = (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;
      const activeItem = items.find((item) => item.id === active.id);
      if (activeItem?.reorderable === false) return;
      const activeItemId = String(active.id);
      const overItemId = String(over.id);
      onReorder(
        activeItemId,
        resolveVisibilityEditorReorderTarget(items, activeItemId, overItemId)
      );
    };

    const renderItem = (item: VisibilityEditorItem) => (
      <SortableVisibilityItem
        key={item.id}
        item={item}
        onRemove={onRemove}
        canRemove={canRemoveItem(item)}
        removeAriaLabel={getRemoveAriaLabel(item.label)}
      />
    );

    if (!groupByCategory) {
      return (
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            {items.map(renderItem)}
          </SortableContext>
        </DndContext>
      );
    }

    return categories.map((category) => {
      const categoryItems = items.filter(
        (item) => item.category === category.id
      );
      if (categoryItems.length === 0) return null;

      return (
        <div
          key={category.id}
          className="journalit-visibility-editor__active-category"
        >
          <div className="journalit-visibility-editor__active-category-label">
            {category.label}
          </div>
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={categoryItems.map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="journalit-visibility-editor__active-category-items">
                {categoryItems.map(renderItem)}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      );
    });
  }
);

ActiveVisibilityItems.displayName = 'ActiveVisibilityItems';

interface SortableVisibilityItemProps {
  item: VisibilityEditorItem;
  onRemove: (itemId: string) => void;
  canRemove: boolean;
  removeAriaLabel: string;
}

const SortableVisibilityItem: React.FC<SortableVisibilityItemProps> =
  React.memo(({ item, onRemove, canRemove, removeAriaLabel }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({
      id: item.id,
      disabled: item.locked || item.reorderable === false,
    });
    const canReorder = item.reorderable !== false;

    return (
      <div
        ref={setNodeRef}
        style={dndKitStyle(
          CSS.Transform.toString(transform),
          isDragging ? transition : undefined
        )}
        className={`journalit-visibility-editor__active-item ${item.description ? 'has-description' : ''} ${isDragging ? 'is-dragging' : ''}`}
      >
        <div
          className={`journalit-visibility-editor__drag-handle ${canReorder ? '' : 'is-disabled'}`}
          {...attributes}
          {...listeners}
          aria-hidden={canReorder ? undefined : true}
        >
          {canReorder ? <GripVertical size={16} /> : <Lock size={14} />}
        </div>

        <div className="journalit-visibility-editor__item-copy">
          <div className="journalit-visibility-editor__item-label">
            {item.label}
          </div>
          {item.description && (
            <div className="journalit-visibility-editor__item-description">
              {item.description}
            </div>
          )}
        </div>

        <button
          type="button"
          className="journalit-visibility-editor__remove-button"
          onClick={() => onRemove(item.id)}
          disabled={!canRemove}
          aria-label={removeAriaLabel}
        >
          ×
        </button>
      </div>
    );
  });

SortableVisibilityItem.displayName = 'SortableVisibilityItem';

interface AvailableVisibilityItemProps {
  item: VisibilityEditorItem;
  onAdd: (itemId: string) => void;
  addAriaLabel: string;
}

const AvailableVisibilityItem: React.FC<AvailableVisibilityItemProps> =
  React.memo(({ item, onAdd, addAriaLabel }) => {
    return (
      <div className="journalit-visibility-editor__available-item">
        <div className="journalit-visibility-editor__item-copy">
          <div className="journalit-visibility-editor__item-label">
            {item.label}
          </div>
          {item.description && (
            <div className="journalit-visibility-editor__item-description">
              {item.description}
            </div>
          )}
        </div>
        <button
          type="button"
          className="journalit-visibility-editor__add-button"
          onClick={() => onAdd(item.id)}
          aria-label={addAriaLabel}
        >
          <Plus
            size={14}
            className="journalit-visibility-editor__add-button-icon"
            aria-hidden="true"
          />
        </button>
      </div>
    );
  });

AvailableVisibilityItem.displayName = 'AvailableVisibilityItem';
