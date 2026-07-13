import React, { useCallback } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { X, GripVertical } from '../shared/icons/ObsidianIcon';
import { resolveIcon } from '../../utils/iconResolver';
import { dndKitStyle } from '../../styles/inlineStylePolicy';
import { hasTranslation, t } from '../../lang/helpers';
import type {
  QuickLinkAction,
  SidebarNavItem as SidebarNavItemType,
} from '../../settings/types';

interface SidebarNavItemProps {
  item: SidebarNavItemType;
  isEditing: boolean;
  onRemove: (id: string) => void;
  onClick: (action: QuickLinkAction) => void;
}

export const SidebarNavItemComponent: React.FC<SidebarNavItemProps> = ({
  item,
  isEditing,
  onRemove,
  onClick,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: item.id,
      disabled: !isEditing,
    });
  const transformString = CSS.Transform.toString(transform);

  const IconComponent = resolveIcon(item.icon);

  const handleRemoveClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      e.preventDefault();
      onRemove(item.id);
    },
    [item.id, onRemove]
  );

  const stopRemoveDragStart = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      e.stopPropagation();
    },
    []
  );

  const stopRemoveKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      e.stopPropagation();
    },
    []
  );

  const activateNavItem = useCallback(() => {
    if (!isEditing) {
      onClick(item.action);
    }
  }, [isEditing, onClick, item.action]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (isEditing) {
        listeners?.onKeyDown?.(e);
        return;
      }

      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activateNavItem();
      }
    },
    [activateNavItem, isEditing, listeners]
  );

  return (
    <div
      ref={setNodeRef}
      className="journalit-nav-item"
      data-nav-item-id={item.id}
      data-editing={isEditing ? 'true' : 'false'}
      onClick={activateNavItem}
      style={dndKitStyle(transformString, transition)}
      {...(isEditing ? attributes : {})}
      role="button"
      tabIndex={0}
      {...(isEditing ? listeners : {})}
      onKeyDown={handleKeyDown}
    >
      {isEditing && (
        <div className="journalit-nav-item-drag">
          <GripVertical size={14} />
        </div>
      )}
      <div className="journalit-nav-item-icon">
        <IconComponent size={16} />
      </div>
      <span className="journalit-nav-item-label">
        {(() => {
          const labelKey = `navigation.items.${item.id}`;
          return hasTranslation(labelKey) ? t(labelKey) : item.label;
        })()}
      </span>
      {isEditing && (
        <button
          className="journalit-nav-item-remove"
          onPointerDown={stopRemoveDragStart}
          onKeyDown={stopRemoveKeyDown}
          onClick={handleRemoveClick}
          aria-label={t('navigation.edit-mode.hide-item')}
          type="button"
        >
          <X size={10} />
        </button>
      )}
    </div>
  );
};
