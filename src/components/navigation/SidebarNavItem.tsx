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
import type { SessionIndicatorPhase } from '../../services/sessionMode/SessionPhaseWatcher';
import { getSessionIndicatorLabel } from './sessionIndicatorLabel';

interface SidebarNavItemProps {
  item: SidebarNavItemType;
  isEditing: boolean;
  isBusy?: boolean;
  
  sessionPhase?: SessionIndicatorPhase;
  onRemove: (id: string) => void;
  onClick: (action: QuickLinkAction) => void | Promise<void>;
  children?: React.ReactNode;
}

interface SidebarNavItemContentProps {
  item: SidebarNavItemType;
  isBusy: boolean;
  sessionPhase: SessionIndicatorPhase;
}

const SidebarNavItemContent: React.FC<SidebarNavItemContentProps> = ({
  item,
  isBusy,
  sessionPhase,
}) => {
  const IconComponent = resolveIcon(item.icon);
  const labelKey = `navigation.items.${item.id}`;
  const label = isBusy
    ? t('trade-sync.quick.running')
    : hasTranslation(labelKey)
      ? t(labelKey)
      : item.label;

  return (
    <>
      <div className="journalit-nav-item-icon journalit-session-indicator-icon">
        <IconComponent size={16} />
      </div>
      <span className="journalit-nav-item-label">{label}</span>
      {sessionPhase && (
        <span className="journalit-sr-only">
          {getSessionIndicatorLabel(sessionPhase)}
        </span>
      )}
    </>
  );
};

interface StaticSidebarNavItemProps {
  item: SidebarNavItemType;
  isBusy: boolean;
  sessionPhase: SessionIndicatorPhase;
  onClick: (action: QuickLinkAction) => void | Promise<void>;
  children?: React.ReactNode;
}

const StaticSidebarNavItem: React.FC<StaticSidebarNavItemProps> = ({
  item,
  isBusy,
  sessionPhase,
  onClick,
  children,
}) => {
  const activateNavItem = useCallback(() => {
    if (!isBusy) void onClick(item.action);
  }, [isBusy, item.action, onClick]);

  return (
    <>
      <button
        type="button"
        className="journalit-native-button journalit-native-button--unstyled journalit-sidebar-nav-button journalit-nav-item"
        data-nav-item-id={item.id}
        data-editing="false"
        data-trade-sync-running={isBusy ? 'true' : undefined}
        data-session-phase={sessionPhase ?? undefined}
        aria-busy={isBusy}
        aria-disabled={isBusy}
        onClick={activateNavItem}
      >
        <SidebarNavItemContent
          item={item}
          isBusy={isBusy}
          sessionPhase={sessionPhase}
        />
      </button>
      {children}
    </>
  );
};

interface SortableSidebarNavItemProps {
  item: SidebarNavItemType;
  isBusy: boolean;
  sessionPhase: SessionIndicatorPhase;
  onRemove: (id: string) => void;
  children?: React.ReactNode;
}

const SortableSidebarNavItem: React.FC<SortableSidebarNavItemProps> = ({
  item,
  isBusy,
  sessionPhase,
  onRemove,
  children,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({
    id: item.id,
    data: { hasNestedShortcuts: Boolean(children) },
  });
  const transformString = CSS.Translate.toString(transform);
  const handleRemoveClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      event.preventDefault();
      onRemove(item.id);
    },
    [item.id, onRemove]
  );
  const stopRemovePointerDown = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      event.stopPropagation();
    },
    []
  );
  const stopRemoveKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      event.stopPropagation();
    },
    []
  );

  return (
    <div
      ref={setNodeRef}
      className="journalit-nav-sortable-group"
      style={dndKitStyle(transformString, transition)}
    >
      <div
        ref={setActivatorNodeRef}
        className="journalit-nav-item"
        data-nav-item-id={item.id}
        data-editing="true"
        data-trade-sync-running={isBusy ? 'true' : undefined}
        data-session-phase={sessionPhase ?? undefined}
        {...attributes}
        {...listeners}
      >
        <div className="journalit-nav-item-drag">
          <GripVertical size={14} />
        </div>
        <SidebarNavItemContent
          item={item}
          isBusy={isBusy}
          sessionPhase={sessionPhase}
        />
        <button
          className="journalit-nav-item-remove"
          onPointerDown={stopRemovePointerDown}
          onKeyDown={stopRemoveKeyDown}
          onClick={handleRemoveClick}
          aria-label={t('navigation.edit-mode.hide-item')}
          type="button"
        >
          <X size={10} />
        </button>
      </div>
      {children}
    </div>
  );
};

const SidebarNavItem: React.FC<SidebarNavItemProps> = ({
  item,
  isEditing,
  isBusy = false,
  sessionPhase = null,
  onRemove,
  onClick,
  children,
}) =>
  isEditing ? (
    <SortableSidebarNavItem
      item={item}
      isBusy={isBusy}
      sessionPhase={sessionPhase}
      onRemove={onRemove}
    >
      {children}
    </SortableSidebarNavItem>
  ) : (
    <StaticSidebarNavItem
      item={item}
      isBusy={isBusy}
      sessionPhase={sessionPhase}
      onClick={onClick}
    >
      {children}
    </StaticSidebarNavItem>
  );

export const SidebarNavItemComponent = React.memo(SidebarNavItem);
SidebarNavItemComponent.displayName = 'SidebarNavItemComponent';
