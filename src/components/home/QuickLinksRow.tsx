

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

  const IconComponent = resolveIcon(quickLink.icon);

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
  const [localQuickLinks, setLocalQuickLinks] = useState<QuickLinkButton[]>([]);

  
  useEffect(() => {
    if (propQuickLinks && propQuickLinks.length > 0) {
      setLocalQuickLinks(propQuickLinks);
    } else {
      const settingsQuickLinks = plugin.settings.home?.quickLinks;
      if (settingsQuickLinks && settingsQuickLinks.length > 0) {
        setLocalQuickLinks(settingsQuickLinks);
      } else {
        
        const defaultQuickLinks = DEFAULT_SETTINGS.home?.quickLinks || [];
        if (defaultQuickLinks.length > 0) {
          setLocalQuickLinks(defaultQuickLinks);
          
          if (plugin.settings.home) {
            plugin.settings.home.quickLinks = defaultQuickLinks;
            
            void plugin.saveSettings();
          }
        }
      }
    }
  }, [propQuickLinks, plugin]);

  
  const actionResolver = useMemo(
    () => new QuickLinkActionResolver(plugin),
    [plugin]
  );

  
  const visibleQuickLinks = useMemo(() => {
    return localQuickLinks
      .filter((ql) => ql.visible)
      .sort((a, b) => a.order - b.order);
  }, [localQuickLinks]);

  
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

          
          const updatedQuickLinks = localQuickLinks.map((ql) => {
            const newIndex = newVisibleQuickLinks.findIndex(
              (vql) => vql.id === ql.id
            );
            if (newIndex !== -1) {
              
              return { ...ql, order: newIndex };
            } else {
              
              const maxVisibleOrder = newVisibleQuickLinks.length - 1;
              const hiddenIndex = localQuickLinks
                .filter((item) => !item.visible)
                .findIndex((item) => item.id === ql.id);
              return { ...ql, order: maxVisibleOrder + 1 + hiddenIndex };
            }
          });

          
          setLocalQuickLinks(updatedQuickLinks);

          
          if (plugin.settings.home) {
            plugin.settings.home.quickLinks = updatedQuickLinks;
            void plugin.saveSettings();
          }
        }
      }
    },
    [visibleQuickLinks, localQuickLinks, plugin]
  );

  
  const handleRemoveQuickLink = useCallback(
    (quickLinkId: string) => {
      const updatedQuickLinks = localQuickLinks.map((ql) =>
        ql.id === quickLinkId ? { ...ql, visible: false } : ql
      );

      
      setLocalQuickLinks(updatedQuickLinks);

      
      onQuickLinksChange?.(updatedQuickLinks);

      
      if (plugin.settings.home) {
        plugin.settings.home.quickLinks = updatedQuickLinks;
        void plugin.saveSettings();
      }
    },
    [localQuickLinks, plugin, onQuickLinksChange]
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
