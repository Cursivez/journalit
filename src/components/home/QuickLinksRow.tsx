

import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { X } from '../shared/icons/ObsidianIcon';
import {
  DndContext,
  DragEndEvent,
  closestCenter,
  Modifier,
} from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import JournalitPlugin from '../../main';
import {
  QuickLinkButton,
  QuickLinkAction,
  DEFAULT_SETTINGS,
} from '../../settings/types';
import { QuickLinkActionResolver } from '../../utils/QuickLinkActionResolver';
import { resolveIcon } from '../../utils/iconResolver';
import { hasTranslation, t } from '../../lang/helpers';
import { cssVars, dndKitStyle } from '../../styles/inlineStylePolicy';

export function mergeQuickLinksWithDefaults(
  currentQuickLinks: QuickLinkButton[]
): QuickLinkButton[] {
  const defaultQuickLinks = DEFAULT_SETTINGS.home?.quickLinks || [];
  const currentById = new Map(
    currentQuickLinks.map((quickLink) => [quickLink.id, quickLink])
  );
  const merged = [...currentQuickLinks];
  let changed = false;

  for (const defaultQuickLink of defaultQuickLinks) {
    const existing = currentById.get(defaultQuickLink.id);
    if (!existing) {
      const maxOrder = merged.reduce(
        (max, quickLink) => Math.max(max, quickLink.order),
        -1
      );
      merged.push({ ...defaultQuickLink, order: maxOrder + 1 });
      changed = true;
    }
  }

  return changed ? merged : currentQuickLinks;
}


const restrictToHorizontalAxis: Modifier = ({ transform }) => {
  return {
    ...transform,
    y: 0, 
  };
};

interface QuickLinksRowProps {
  plugin: JournalitPlugin;
  isEditing?: boolean;
  
  quickLinks?: QuickLinkButton[];
  
  onQuickLinksChange?: (quickLinks: QuickLinkButton[]) => void;
}


const SortableQuickLinkButton: React.FC<{
  quickLink: QuickLinkButton;
  isEditing: boolean;
  onRemove: (id: string) => void;
  onClick: (action: QuickLinkAction) => void;
}> = ({ quickLink, isEditing, onRemove, onClick }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: quickLink.id,
      disabled: !isEditing,
    });

  const transformString = CSS.Transform.toString(
    transform ? { ...transform, y: 0 } : transform
  );

  const iconName = quickLink.id === 'quick-import' ? 'zap' : quickLink.icon;
  const IconComponent = resolveIcon(iconName);

  const handleRemoveClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      e.preventDefault();
      onRemove(quickLink.id);
    },
    [quickLink.id, onRemove]
  );

  const handleButtonClick = useCallback(() => {
    if (!isEditing) {
      onClick(quickLink.action);
    }
  }, [isEditing, onClick, quickLink.action]);

  const labelKey = `home.quick-links.${quickLink.id}`;
  const label = hasTranslation(labelKey) ? t(labelKey) : labelKey;

  return (
    <div
      ref={setNodeRef}
      className="journalit-quick-link-item"
      style={dndKitStyle(transformString, transition)}
      data-editing={isEditing ? 'true' : 'false'}
    >
      <div
        className="journalit-quick-link-wrapper"
        data-editing={isEditing ? 'true' : 'false'}
      >
        <div
          {...attributes}
          {...(isEditing ? listeners : {})}
          className="journalit-quick-link-handle"
        >
          <button
            onClick={() => void handleButtonClick()}
            disabled={isEditing}
            className="journalit-quick-link-button jl-quick-link-hover"
            style={cssVars({ '--link-color': quickLink.color })}
            aria-label={label}
            type="button"
          >
            <IconComponent
              size={16}
              className="journalit-quick-link-icon"
              aria-hidden="true"
            />
            <span className="journalit-quick-link-label">{label}</span>
          </button>
        </div>

        {isEditing && (
          <button
            className="journalit-quick-link-remove"
            onClick={(event) => void handleRemoveClick(event)}
            aria-label={t('home.quick-links.hide')}
            type="button"
          >
            <X size={12} />
          </button>
        )}
      </div>
    </div>
  );
};

const QuickLinksRowComponent: React.FC<QuickLinksRowProps> = ({
  plugin,
  isEditing = false,
  quickLinks: propQuickLinks,
  onQuickLinksChange,
}) => {
  const resolveInitialQuickLinks = () => {
    if (propQuickLinks && propQuickLinks.length > 0) {
      return mergeQuickLinksWithDefaults(propQuickLinks);
    }
    const settingsQuickLinks = plugin.settings.home?.quickLinks;
    if (settingsQuickLinks && settingsQuickLinks.length > 0) {
      return mergeQuickLinksWithDefaults(settingsQuickLinks);
    }
    return mergeQuickLinksWithDefaults(DEFAULT_SETTINGS.home?.quickLinks || []);
  };
  const [localQuickLinks, setLocalQuickLinks] = useState<QuickLinkButton[]>(
    resolveInitialQuickLinks
  );
  const quickLinks = useMemo(
    () => mergeQuickLinksWithDefaults(propQuickLinks ?? localQuickLinks),
    [localQuickLinks, propQuickLinks]
  );

  
  useEffect(() => {
    const settingsQuickLinks = plugin.settings.home?.quickLinks;
    const defaultQuickLinks = DEFAULT_SETTINGS.home?.quickLinks || [];
    const mergedQuickLinks = mergeQuickLinksWithDefaults(
      settingsQuickLinks && settingsQuickLinks.length > 0
        ? settingsQuickLinks
        : defaultQuickLinks
    );

    if (mergedQuickLinks !== settingsQuickLinks && plugin.settings.home) {
      plugin.settings.home.quickLinks = mergedQuickLinks;
      onQuickLinksChange?.(mergedQuickLinks);
      void plugin.saveSettings();
    }
  }, [plugin, onQuickLinksChange]);

  
  const actionResolver = useMemo(
    () => new QuickLinkActionResolver(plugin),
    [plugin]
  );

  
  const visibleQuickLinks = useMemo(() => {
    return [...quickLinks]
      .filter((ql) => ql.visible)
      .sort((a, b) => a.order - b.order);
  }, [quickLinks]);

  
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        const activeId = active.id.toString();
        const overId = over.id.toString();

        
        const oldIndex = visibleQuickLinks.findIndex(
          (ql) => ql.id === activeId
        );
        const newIndex = visibleQuickLinks.findIndex((ql) => ql.id === overId);

        if (oldIndex !== -1 && newIndex !== -1) {
          
          const newVisibleQuickLinks = [...visibleQuickLinks];
          const [movedItem] = newVisibleQuickLinks.splice(oldIndex, 1);
          newVisibleQuickLinks.splice(newIndex, 0, movedItem);

          const visibleOrderById = new Map(
            newVisibleQuickLinks.map((quickLink, index) => [
              quickLink.id,
              index,
            ])
          );
          const hiddenOrderById = new Map<string, number>();
          for (const item of quickLinks) {
            if (!item.visible) {
              hiddenOrderById.set(item.id, hiddenOrderById.size);
            }
          }
          const maxVisibleOrder = newVisibleQuickLinks.length - 1;

          
          const updatedQuickLinks = quickLinks.map((ql) => {
            const newIndex = visibleOrderById.get(ql.id);
            if (newIndex !== undefined) {
              
              return { ...ql, order: newIndex };
            }

            
            const hiddenIndex = hiddenOrderById.get(ql.id) ?? 0;
            return { ...ql, order: maxVisibleOrder + 1 + hiddenIndex };
          });

          
          setLocalQuickLinks(updatedQuickLinks);

          
          onQuickLinksChange?.(updatedQuickLinks);

          
          if (plugin.settings.home) {
            plugin.settings.home.quickLinks = updatedQuickLinks;
            void plugin.saveSettings();
          }
        }
      }
    },
    [visibleQuickLinks, quickLinks, plugin, onQuickLinksChange]
  );

  
  const handleRemoveQuickLink = useCallback(
    (quickLinkId: string) => {
      const updatedQuickLinks = quickLinks.map((ql) =>
        ql.id === quickLinkId ? { ...ql, visible: false } : ql
      );

      
      setLocalQuickLinks(updatedQuickLinks);

      
      onQuickLinksChange?.(updatedQuickLinks);

      
      if (plugin.settings.home) {
        plugin.settings.home.quickLinks = updatedQuickLinks;
        void plugin.saveSettings();
      }
    },
    [quickLinks, plugin, onQuickLinksChange]
  );

  
  const handleQuickLinkClick = useCallback(
    async (action: QuickLinkAction) => {
      try {
        await actionResolver.executeAction(action);
      } catch (error) {
        console.error('Failed to execute quick link action:', error);
      }
    },
    [actionResolver]
  );

  if (visibleQuickLinks.length === 0) {
    return (
      <div className="journalit-quick-links-row journalit-quick-links-row--empty">
        {t('home.quick-links.all-hidden')}
      </div>
    );
  }

  return (
    <div className="journalit-quick-links-row">
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToHorizontalAxis]}
      >
        <SortableContext
          items={visibleQuickLinks.map((q) => q.id)}
          strategy={horizontalListSortingStrategy}
        >
          {visibleQuickLinks.map((quickLink) => (
            <SortableQuickLinkButton
              key={quickLink.id}
              quickLink={quickLink}
              isEditing={isEditing}
              onRemove={handleRemoveQuickLink}
              onClick={(quickLink) => void handleQuickLinkClick(quickLink)}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};

export const QuickLinksRow = React.memo(QuickLinksRowComponent);
